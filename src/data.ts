export type GalleryCategory =
  | "emocion"
  | "retrato"
  | "vals"
  | "decoracion"
  | "detalle"
  | "editorial"
  | "momento";

export type GalleryPhoto = {
  code: string;
  title: string;
  category: GalleryCategory;
  src: string;
  orientation: "vertical" | "horizontal" | "square";
  priority: number;
};

export const photographer = {
  name: "Stiven Verdesoto",
  brand: "byStiven",
  handle: "@bystiven",
  location: "Galápagos · Ecuador",
  instagramUrl: "https://www.instagram.com/bystiven/",
  whatsappNumber: "593968257817",
  tagline: "Fotografía editorial de eventos, decoración, retrato, naturaleza y vida salvaje.",
  gear: ["Sony A7C", "100-400mm F4/5.6", "24mm F1.4"],
  profilePhoto: "https://blogger.googleusercontent.com/img/a/AVvXsEgAnF9SVeIrNupzkphruohtFaPDyF4lb7oKFbUyOkZPSWebRmjVQpZJvw3ZoMFZMbsgaqqt4mup8sABVBhYkigQjwRnzZdXzgSE9TOBQdzVH5W4QL3liFCbRw-_4YtNtjccBlD6FExc9uYlVWFrkaY_8m8XoWchocosdLHnfwxCSdpPrhW8vYeEDraqRQQ",
  portraitPhoto: "https://blogger.googleusercontent.com/img/a/AVvXsEjfAJe7673Ulq5xldKwjxm7oiLeW-08F72f0UT7zLpn5Ojgqo-iggrvJD2rLavQwlQvUT1XBiqdQ_Ml_ZdoGMD-NuKnFwnQnHQFW7c52PPYq-jdkfVLtjss0SX9kLxB_qaXi8zNXEItusdyo1ni_8tm64AE8MHnJ9nY4jdYK3rQiPC5UW6-KLa2eS1nmE0",
  heroBackground: "https://blogger.googleusercontent.com/img/a/AVvXsEgJa5DmqcI1heZCqjHzeWoLQ02zEB3nL4RuUbQ7rBNH5byRsNss7Ztrn4ADO3KW7SsyaX2RqFJGnRuCib8S_8rwM2Mn7FlyLH5h9ME_8iIW_PhHNT9k66W73Auwp_kQQ6yW2k_KQsOKa1c2o5UHKeyAx8__7z-d61YEXs4qgflltwJOxyt4l326-3d7S8E",
  heroSubject: "https://blogger.googleusercontent.com/img/a/AVvXsEigVZBtLcvw0qlA8aOjLAwCQQoXtAt2Q29Mf101IqoPEnTB_1xc00D3VrCHuYiTgE7Ni-hvSzmem3r9xp30BmYNVPSNreprkTDYM1vW5uuAjgL18giyHl45lAhNmporBeDAgu1bZi7LLOODJiMj2w3UeEI6tMURFo6suZdbRZRaLbF-1mddfewo-5E3mUw",
};

export const clientGallery = {
  slug: "samantha-guadalupe-15",
  title: "Samantha Guadalupe",
  subtitle: "Quinceaños · 13 Junio 2026",
  downloadPin: "1328",
  cover: "https://blogger.googleusercontent.com/img/a/AVvXsEjl9FJHEmGGn99v6gwAVJgC60vv-_-91XsrkwHe6YuB07aF5hrBm-3iTAgy-JkSCLW319f--7Gfrqtp0JXLPN1tI3Rgyq-7dyj612XUdwSEotMv_iVxFmFYA-3dqUS0L_JJzaGrstU2TcZjDT1Fxw4_YDnHK3nhsPH4jBon6rLE1LnhRvZMeNpBmuxv6xA",
  intro: "Una selección cuidada de momentos naturales, retratos, vals y detalles de decoración capturados durante la celebración.",
  note: "Vista previa optimizada para web. La entrega final puede prepararse en alta calidad después de confirmar el paquete.",
};

const sg = {
  "01": "https://blogger.googleusercontent.com/img/a/AVvXsEiC_Qoi70HIToSXQ4k5kiTIIPnQBPwDS_hH64Tmo0b9qtkwrP06DRiEy6QqsrQV3gATU5BuExE29lZWU0AVonT53h_6gpG4B6S8cmHl6-LtYIv6teWlsVzc1gqzrcjWa64XigjmrdRfr9eI-82wghvoJagTTpG7oxmqSZZovXiCLgseErdzWLwltwczhg4",
  "02": "https://blogger.googleusercontent.com/img/a/AVvXsEjgPr_aNzxc-h3AGa5kUnQBNgrjqLT_P-DOLsGh2pzisY8QV1WntjquzNyY2yW55DyXZVN9yoq_HQKhCfEibanUTNN_zcAEBV6j4vKG1paVqH_YFD3qRKxwmSqL3VARwMnkWRYyJFYEQxTwzFho7czz69yRUjFnh9m2wFT1P7Gu0WxTCPCebCPk7eUeMME",
  "03": "https://blogger.googleusercontent.com/img/a/AVvXsEjl9FJHEmGGn99v6gwAVJgC60vv-_-91XsrkwHe6YuB07aF5hrBm-3iTAgy-JkSCLW319f--7Gfrqtp0JXLPN1tI3Rgyq-7dyj612XUdwSEotMv_iVxFmFYA-3dqUS0L_JJzaGrstU2TcZjDT1Fxw4_YDnHK3nhsPH4jBon6rLE1LnhRvZMeNpBmuxv6xA",
  "04": "https://blogger.googleusercontent.com/img/a/AVvXsEhFRv5HfuWHKivOLmIR4oCGUHf2lsdKaI2hkvZPfATXU5u2ZRuHuuGrr9xuiuKp8pCMf3WuQ35kY4xMG0IjS_P-SlGx2hpA1V2fmLUvInLQN1Y-VxnqMpntxddVaf4Rz2yS5EWDxSpw9MSRFUoQQMgyHxVfXxrM3zYWzaqAcswA8aGDHP248n8d2HE2s4U",
  "05": "https://blogger.googleusercontent.com/img/a/AVvXsEiAgoqSOmC11S2QfXDv613W4ArYt9m9TaVsrqzq8rR7RHTA89VXjylM330jsLqpAcHUdfTt1LEDFg-aoooLGTnC-xMurARDP7x7KNPiG3k2dW9OL5PUxsgX_BYWK7VCJ4-rl4n0dPoroSc6cu9kKq9xZYa74po2IPlML4yNzSHxx1_p46dSPv0GLOv5jdA",
  "06": "https://blogger.googleusercontent.com/img/a/AVvXsEj4s2Y3CLY-xMRcFGivQN7zHLk03GSPYUElPPC333CZTZrYWJ2y2ZhyptJp-wSSrmQI8n47ssdeQCu7tq-niHnK6vK7Y6znUUv7HMQTu6ueiIpo8yR0XCHsy7Dlas8hOwu9zwZk_CiFSzRvEQmeS0n5CQPyMmFau6A6kj7U1J0S2Z9j8A3xCGCA2eY0NaU",
  "07": "https://blogger.googleusercontent.com/img/a/AVvXsEiCgXcDFBCE-b83T_mKgKI16-yDcNqkZyRDGF1i4tbb_gtS4QlGbLGxrIIBeLgPUTDEKWXzdPjFdak9wd-YVXotP5v8UzCcHunlaz76VfE-V6JrDjF0JtZVXYVF5Ix60FqWFAbUvqHFOnuHJddbEEUmKR7KnSOQWZidpY63KiJ7wgVINT5Dy67kyOM3qOE",
  "08": "https://blogger.googleusercontent.com/img/a/AVvXsEizwo4fv039CmIhHGEW4EXwTfordLb0zAsxrombYorVacEw7W0CoJn6XyUWIsv5PENPZXXDIEyb8_aivNoI8f-nelCsutHNHZoohW0y37M3FyuWKSeHFKKiF_SSC2iV686UyUt9LuB7wfOKFDIzN1pjX7isqgn0R3cUsO-pH15nF5uh7UPKfCuJuCjAp1g",
  "09": "https://blogger.googleusercontent.com/img/a/AVvXsEiLOlPSUfCI_oyuTnTn1giLbmou8OyCJDycQwgVzDk1gR5iaMBQ6PaRXMJed3wzWcF55Q59kJAm56kSc-dVXegOgUSAHEeBBPNDMUrDhAeoVB2SREVwma_FCq_vV7Cy-0JgeB_n3WZ16x6jRJ0ix-7CQ2fwWaf1CHjTeWIgbssQkE6o9J-LNqWW20OoUmk",
  "10": "https://blogger.googleusercontent.com/img/a/AVvXsEh-jIgC2owtqxgVCWV37AIxwTdrc4iM91aLs2RjyvhS9hHZXL_jYCJ5ESN-ar29ZB-uuEA5DUMdCCewLSkiMxBFt9IURIEsssctsqLKmVxB0O_vbV9jImfi2NSaiLk-bzv-CNeUvC6044T-2QKFeHiprv8uPsGZa_D4lNVB8_2hlXziW06f0CBEhEgLPaM",
  "11": "https://blogger.googleusercontent.com/img/a/AVvXsEirRRbhGL25DHWbOHYHMGIEe5nWEYy8DfHh8HR6PcqZQ_QrdaCrR3IT1ObWGBx2OBfcAwRYrwsSet1GXZo9lSw3lE_Gi44mxL-wpvnyBOKc2brtU_CVRI9l8Lk4weYf49xqN3SpcmMFvIkjixHu9I6QyWe4soc9P-jcWRqCJOhiWWyENFHl60bY6f4NACk",
  "12": "https://blogger.googleusercontent.com/img/a/AVvXsEh0GnvMhEAYlcBxWXA_6o0phf8xtlKzYYGxfqCxqLQQLJVsljhhDlkwSUqcGS07zcfegk8MLTWu7W2PZtpxNM5vAppnSF80ETVOaNwTYwS3XdIbFgubU-vzEVlvEHeAdlf-d_s80kFpCkdfyW1HI2vx3U9_EoRCZwCTg2ORARE8jxa0SaUPv2c6O-2ftL8",
  "13": "https://blogger.googleusercontent.com/img/a/AVvXsEiM5kh22Ghiu4gLef2szd9b1QspGRNU09882mF983uTtxijmFJQKUl2VfKRraODEZqbKtWGMwnaWPe1WvjIsVuUO6j4J_qqKRzbajr037c-xzugFJv-4p_QVQQrjUXTUgYm-qEtQcNAS9kqZbneZiSQ6U3AZqU9LgeLPA3j2_5ZLQLfTRFvjel1LUXZtac",
  "14": "https://blogger.googleusercontent.com/img/a/AVvXsEgR1VkroF6jhdK8lkBCUL065tETp1YGMURnxIheZg0FP2NZN17s5rYDV8Q8lBMBXbKYqF7uEal5kzl3Y-hkIQZcTaJIyRInBidtRBrHmAGZSXq7aRLS09NR5uKnPNB6m5tZh8LOOsH6IXecDm0BwYaXcRtv1lOpVKivfdF0kZPNzAenEkEZ-GtQmVeK6PU",
  "15": "https://blogger.googleusercontent.com/img/a/AVvXsEgJi3JvV_cRz6FmgUmgSvT_S10JuTa4Tuqh62CpItfPhcBUUElDrS3yqfgooRob17L3oN04tX6BI6ehkpJJ8eKHNc3kUtslTxFiGAFtTLaZgCJB10Qgv667sHO0rXFCfJ8kvchjnsULgmlrBTJpKOHgURMo9A0SnFBn70wPcTjh1yq1U1S_39y5mX1E2bw",
  "16": "https://blogger.googleusercontent.com/img/a/AVvXsEirSesHE78lkjzPgY83rbEReuLmqxrdSO-9YD7cp0XKQS3aD0vEEPAR-qVtKLe2-EVbqYfJlEpB1qGLkvJixUvknjAzuir71rC13Oa49ZstKsCGLbORpmIu2m7aqyIS-WIEGzkHxpGWbshUvmQiZShx_LsRR6NrGfwlht2n9KNuVrZoQzK2pN-YXMCbq_g",
  "17": "https://blogger.googleusercontent.com/img/a/AVvXsEhqddAv_AMrtzjb1BXpuWwgn2AAQoKGQrv04i5QMkP5lTsZf1zyqe0EkTDI6UN8047tdujC2OCUg2jC6EbzIsNRqJBA_dIzOPjJKiGEUq7c7zTj9AAmW5_3X4CmSNqAPvjc_Gtivi1eoLYLB-6QYwJ2ZhNpmsdG0sb7M7U5E-5tybU93DcIEWPsJwJehk8",
  "18": "https://blogger.googleusercontent.com/img/a/AVvXsEj_COAjDcy2ZFRwUwktrtrxtCIjHpzo2ldDZSRl6scZH5EDLJUKRXrbBm5SnShSXGhI9oK41L-67v6hF4Fmb6NXWBjESid_1J_onn7RF-_TYOHo14xdzIhhMUMbwopEmKAwOHVf5wQiAVaF3FeSmLDMKK3ISxNPSPPZrSUGm5zUrBW7vA2uaOpASERYb4Q",
  "19": "https://blogger.googleusercontent.com/img/a/AVvXsEhQ5w92CP1paCm4BXzTyA1Qd_-vQboKh-cgid1oX4aWLe5RRRU2ZJ2B6la3rUQBDLpzXZnXzdQYNj9iGYuADblcHM7vmMb89gIv4A_b9x5NfqAfcIgmOOcLt-qXdolcVa4o_XXLZR4ABzhn04euJl04cSl6_s_KU9b-JP2PAfYTpfuZigpCe_Sh7WU3Nho",
  "20": "https://blogger.googleusercontent.com/img/a/AVvXsEiLuli7dmkLw1cNQgLao1kyt-ZGnSrOptsGWqaka0rKEhJRwRFlBv_mzsYZ02gzyVljJQCRVNp1JX9RtNsIhyhoQZbwbrBDd0iW3czSH6iWDbvC_-nVZ6ID0WXse-qujniG9kbFGsS1r5FWOzJulYWS3skFnacReEJj6Bqiq83XeyyN7uldiO6dPfQmPyc",
  "21": "https://blogger.googleusercontent.com/img/a/AVvXsEjla2sLOYUJbqRfQekp09CYvrZMeHxtjoXCHZtyJ14ZxiUaxQRp3HjtPTnTYQyDd4omV3vrLpW_AQUQnKyZVJIL1ueRtZ23L6EY2A_efVkc9D2mlJ7fGKBNKkf-m74Wa-U-KptS9odQ2n7bKWg8FeCkfSoJ2O1Ny3pQWHqZre79dBsBdUTbrI3adliHCSs",
  "22": "https://blogger.googleusercontent.com/img/a/AVvXsEgvPpw-wmn30MXbEe7BshzPJvcR9PsvSoPuFjnVb27rVKY4eYjvZQKXV0FxIC763_g7Dh5repy4VkIv5jQN6NywqU9geoOqYFbTgV5OPtXLD5YuOCjBU2BPiLrY-DyzF8KMGeEHYiHiZlI7h28HUvI_xaOrjYstgTbvcQaaRAedYlpMtQ_1Y2yIr3Gi-tM",
  "23": "https://blogger.googleusercontent.com/img/a/AVvXsEgFuLdqO_QEW6vnECacFBOvt5soQ5BRtp1YatcDTmQnf9rq-wL0huq4IJ6niAF7J0T18A2SYP1v0U0OGtMi6XBNPFj_x4SWYhzDM6SVFidH2osHz8nBCCe_tzS_Hyh8IiARAU9MWQYHfULy0-jxZoKQk5PqG31CbWGGR3o0L9d6eSHwzw9MyRTFZqM5QCY",
  "24": "https://blogger.googleusercontent.com/img/a/AVvXsEgFuLdqO_QEW6vnECacFBOvt5soQ5BRtp1YatcDTmQnf9rq-wL0huq4IJ6niAF7J0T18A2SYP1v0U0OGtMi6XBNPFj_x4SWYhzDM6SVFidH2osHz8nBCCe_tzS_Hyh8IiARAU9MWQYHfULy0-jxZoKQk5PqG31CbWGGR3o0L9d6eSHwzw9MyRTFZqM5QCY",
};

export const eventPhotos: GalleryPhoto[] = [
  { code: "SG15-03", title: "Risas con amigas y bengalas", category: "emocion", src: sg["03"], orientation: "vertical", priority: 1 },
  { code: "SG15-07", title: "Vals con mirada dulce", category: "vals", src: sg["07"], orientation: "vertical", priority: 2 },
  { code: "SG15-12", title: "Vals entre humo y globos", category: "vals", src: sg["12"], orientation: "vertical", priority: 3 },
  { code: "SG15-09", title: "Reina en escenario", category: "editorial", src: sg["09"], orientation: "vertical", priority: 4 },
  { code: "SG15-10", title: "Retrato con acompañante", category: "retrato", src: sg["10"], orientation: "vertical", priority: 5 },
  { code: "SG15-04", title: "Retrato en mesa dulce", category: "retrato", src: sg["04"], orientation: "horizontal", priority: 6 },
  { code: "SG15-21", title: "Mesa familiar al atardecer", category: "decoracion", src: sg["21"], orientation: "horizontal", priority: 7 },
  { code: "SG15-11", title: "Bienvenida del evento", category: "decoracion", src: sg["11"], orientation: "square", priority: 8 },
  { code: "SG15-24", title: "Decoración principal", category: "decoracion", src: sg["24"], orientation: "horizontal", priority: 9 },
  { code: "SG15-14", title: "Espejo con nombre y fecha", category: "detalle", src: sg["14"], orientation: "vertical", priority: 10 },
  { code: "SG15-17", title: "Pastel de quinceaños", category: "detalle", src: sg["17"], orientation: "vertical", priority: 11 },
  { code: "SG15-18", title: "Detalle del pastel", category: "detalle", src: sg["18"], orientation: "square", priority: 12 },
  { code: "SG15-15", title: "Copa decorada", category: "detalle", src: sg["15"], orientation: "vertical", priority: 13 },
  { code: "SG15-16", title: "Trono vacío del evento", category: "decoracion", src: sg["16"], orientation: "square", priority: 14 },
  { code: "SG15-22", title: "Letras Samy al atardecer", category: "decoracion", src: sg["22"], orientation: "horizontal", priority: 15 },
  { code: "SG15-23", title: "Lugar y pétalos", category: "decoracion", src: sg["23"], orientation: "vertical", priority: 16 },
  { code: "SG15-08", title: "Retrato exterior natural", category: "retrato", src: sg["08"], orientation: "vertical", priority: 17 },
  { code: "SG15-05", title: "Retrato lateral en jardín", category: "retrato", src: sg["05"], orientation: "vertical", priority: 18 },
  { code: "SG15-20", title: "Retrato serio en jardín", category: "retrato", src: sg["20"], orientation: "vertical", priority: 19 },
  { code: "SG15-06", title: "Discurso con micrófono", category: "momento", src: sg["06"], orientation: "vertical", priority: 20 },
  { code: "SG15-01", title: "Entrada en el camino", category: "momento", src: sg["01"], orientation: "vertical", priority: 21 },
  { code: "SG15-02", title: "Vals detalle de manos", category: "vals", src: sg["02"], orientation: "horizontal", priority: 22 },
  { code: "SG15-13", title: "Reina en trono dorado", category: "editorial", src: sg["13"], orientation: "vertical", priority: 23 },
  { code: "SG15-19", title: "Vals mirada baja", category: "vals", src: sg["19"], orientation: "vertical", priority: 24 }
];

export const portfolioHighlights = [
  { title: "Eventos con intención", description: "Momentos reales, estética editorial y entrega pensada para clientes exigentes.", image: sg["03"] },
  { title: "Decoración premium", description: "Mesas, ambientes, detalles y espacios fotografiados con orden, luz y presencia comercial.", image: sg["21"] },
  { title: "Naturaleza Galápagos", description: "Una mirada limpia de paisaje, fauna, aventura y vida salvaje.", image: photographer.profilePhoto },
];

export const services = [
  "Quinceaños y eventos sociales",
  "Bodas y sesiones editoriales",
  "Decoración para proveedores",
  "Retratos profesionales",
  "Naturaleza y vida salvaje",
  "Entrega digital para clientes",
];
