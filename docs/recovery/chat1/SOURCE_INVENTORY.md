# SOURCE_INVENTORY — Chat 1

Provenance for imported rescue: `VERIFIED_SOURCE`.

## Rescue identity

- SHA-256: `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`
- Files: **80**
- Directories including `extensions/`: **11**
- Layout: 10 runners × 8 files each

## File-type inventory

| Class | Count |
|---|---:|
| APP SOURCE (`.js`, `.css`, `.html`) | 60 |
| CONFIG (`manifest.json`) | 10 |
| DOCS (`README.md`) | 10 |
| TEST | 0 |
| BUILD SCRIPT | 0 |
| BUNDLED DEPENDENCY | 0 |
| GENERATED FILE | 0 |
| BINARY/PORTABLE | 0 |

## SHA-256 cross-runner inventory

| File | SHA-256 / drift |
|---|---|
| `background.js` | `364dc52071af76bf7415ac75d56aea7c90a223a0f866261a8c1bb1592b498404` — identical 01–10 |
| `content.js` | `617ae14755f95e7d71aa704ca88ecd9ccdd92b6f8cfbdeb750eac7ada1a79db0` — identical 01–10 |
| `popup.css` | `a72dca032ab900c87cbf99c906233245b7b4969b1049ea02b3c91538d85e9106` — identical 01–10 |
| `popup.html` | `e52a558348f475beb5b7046075c01d0e9c895be4a022c77242f613f0baeb50ac` — identical 01–10 |
| `popup.js` | `407b95e74db771a3c38c63d29c9701a095420d9565e25748d9727db57928bf57` — identical 01–10 |
| `README.md` | `5afd3061028a970452b8da215c35b54a62d9614af8bb4b323a73a90dbee499a7` — identical 01–10 |

### `interruption-bypass.js`

- Runner 01: `b7c4d6f1257ccbeb4c8a24093bc9b11bc2604f188ab1024ff178cd88c12f8632`
- Runner 02: `90843c3ae52a13498e3e8ab047114abf6d28f16a86dd76bfb09c55925ff57db3`
- Runner 03: `125def3f9964e1c6a9de3c9a5a503110411fb4fc12a6dc0c839b7b0e06f38341`
- Runner 04: `43197f4b62182dd6ef56b6d0f462830e75b51b9a8b074c1f30c4858d6a929f76`
- Runner 05: `810f10f498ca19227aa095cafec7aeb85b0157815dd7e71b58eb82b67b67a984`
- Runner 06–10: `693c5a5a21b1ec50360fa2a014fbcdca84484c93c7037f90db7630cd48c508ca`

### `manifest.json`

All are version `0.1.8`; payloads are runner-specific:

- 01 `fddb6623b6089b1ec64376ea3aee0c4f1725598c1dacbd5a5a47a02cee79db1d`
- 02 `16d1061992331bf00ab8dcbb60f0ee0a44e320f64a569bcd988b5d871d7e9835`
- 03 `5abcacd9d02df6705f1f90485ea8fab58d5e8a1f57dad5676cecca436f32cbf8`
- 04 `9b7f88cfddfb2b9fd7af492eed649a24abe93ac0fa995719e24848960d938219`
- 05 `79ae39f0b89dbe96de5ee115b9b6fa3822bd53764c8682a234998ce52ebeafb5`
- 06 `23867b50d73a524be85f4d624f4776ff017fe2475e6a473a7ffe627503b753f3`
- 07 `f08013e8f2dbf14b6c65ca29b2368a49c9e99c16f1dd3816f769b3aac919d216`
- 08 `df193392abaf70fb8843ce32fde1acd34d6584ab79d108561f20ee2bfd53c4ed`
- 09 `dac2a04c1c722bc2f3bf5ff0c6272417a6e1d84375837113507e30df96ad8ddd`
- 10 `a4c3a430087df646fed77f25e177636f55a7d451ac66cb3cc0569b5585e66128`

## Syntax status

`node --check` was run against all 40 recovered JavaScript files using Node `v22.16.0`: **40 PASS, 0 FAIL**.

## 81 vs 80 reconciliation

Old audit evidence reports an 81-file tree. The verified rescue contains exactly 80 files and no `.git` directory or extra top-level project file. Current evidence does not identify the missing historical path. Status: **one file missing by historical count, path/content UNKNOWN**. No file was reconstructed to close the gap.
