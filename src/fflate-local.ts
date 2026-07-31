type ZipCallback = (error: Error | null, data: Uint8Array<ArrayBuffer>, final: boolean) => void;

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let value = 0xffffffff;
  for (let index = 0; index < data.length; index += 1) value = crcTable[(value ^ data[index]) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function merge(chunks: Uint8Array[]): Uint8Array<ArrayBuffer> {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  chunks.forEach((chunk) => { output.set(chunk, offset); offset += chunk.length; });
  return output;
}

function view(size: number): { bytes: Uint8Array<ArrayBuffer>; data: DataView<ArrayBuffer> } {
  const buffer = new ArrayBuffer(size);
  return { bytes: new Uint8Array(buffer), data: new DataView(buffer) };
}

export class ZipPassThrough {
  readonly filename: string;
  private readonly chunks: Uint8Array[] = [];

  constructor(filename: string) {
    this.filename = filename;
  }

  push(chunk: Uint8Array, _final = false): void {
    if (chunk.length) this.chunks.push(chunk.slice());
  }

  contents(): Uint8Array<ArrayBuffer> {
    return merge(this.chunks);
  }
}

export class Zip {
  private readonly callback: ZipCallback;
  private readonly files: ZipPassThrough[] = [];

  constructor(callback: ZipCallback) {
    this.callback = callback;
  }

  add(file: ZipPassThrough): void {
    this.files.push(file);
  }

  end(): void {
    try {
      const encoder = new TextEncoder();
      const localParts: Uint8Array[] = [];
      const centralParts: Uint8Array[] = [];
      let localOffset = 0;

      this.files.forEach((file) => {
        const name = encoder.encode(file.filename);
        const contents = file.contents();
        const checksum = crc32(contents);
        const local = view(30 + name.length);
        local.data.setUint32(0, 0x04034b50, true);
        local.data.setUint16(4, 20, true);
        local.data.setUint16(6, 0x0800, true);
        local.data.setUint16(8, 0, true);
        local.data.setUint32(14, checksum, true);
        local.data.setUint32(18, contents.length, true);
        local.data.setUint32(22, contents.length, true);
        local.data.setUint16(26, name.length, true);
        local.bytes.set(name, 30);
        localParts.push(local.bytes, contents);

        const central = view(46 + name.length);
        central.data.setUint32(0, 0x02014b50, true);
        central.data.setUint16(4, 20, true);
        central.data.setUint16(6, 20, true);
        central.data.setUint16(8, 0x0800, true);
        central.data.setUint16(10, 0, true);
        central.data.setUint32(16, checksum, true);
        central.data.setUint32(20, contents.length, true);
        central.data.setUint32(24, contents.length, true);
        central.data.setUint16(28, name.length, true);
        central.data.setUint32(42, localOffset, true);
        central.bytes.set(name, 46);
        centralParts.push(central.bytes);
        localOffset += local.bytes.length + contents.length;
      });

      const central = merge(centralParts);
      const end = view(22);
      end.data.setUint32(0, 0x06054b50, true);
      end.data.setUint16(8, this.files.length, true);
      end.data.setUint16(10, this.files.length, true);
      end.data.setUint32(12, central.length, true);
      end.data.setUint32(16, localOffset, true);
      this.callback(null, merge([...localParts, central, end.bytes]), true);
    } catch (error) {
      this.callback(error instanceof Error ? error : new Error("No se pudo crear el ZIP."), new Uint8Array(), true);
    }
  }
}
