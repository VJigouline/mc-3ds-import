# API

## `load3ds(input, options?)`

Reads `.3ds`, with its textures and returns a promise of a `3dsLoadResult`.

`input` is the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files for a model in several files. Zip archives among them are opened.

It throws `TdsImportError` for input that isn't 3DS.

### Options

| Option | Default | Meaning |
| --- | --- | --- |
| `main` | the first .3ds file | The .3ds file to open, if several are given. |
| `materialType` | 'standard' | `'standard'` or `'phong'`. |
| `unitScale` | 1 | Metres per 3DS unit. |

### `3dsLoadResult`

| Field | Type | Meaning |
| --- | --- | --- |
| `group` | `THREE.Group` | The model. |
| `masterScale` | `number` | The file's master scale. |
| `missing` | `string[]` | Textures that were not given. |
| `warnings` | `string[]` | Problems that didn't stop the import. |
| `stats` | object | Counts of meshes, triangles and the like. |

See the package's `index.d.ts` for every exported type and helper.
