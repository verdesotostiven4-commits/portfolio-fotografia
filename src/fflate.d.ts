declare module "fflate" {
  export class ZipPassThrough {
    constructor(filename: string);
    push(chunk: Uint8Array<ArrayBuffer>, final?: boolean): void;
  }

  export class Zip {
    constructor(callback: (error: Error | null, data: Uint8Array<ArrayBuffer>, final: boolean) => void);
    add(file: ZipPassThrough): void;
    end(): void;
  }
}
