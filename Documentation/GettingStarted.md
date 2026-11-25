# Getting started

## Install

```sh
npm install three github:VJigouline/mc-3ds-import
```

## Open a file

`load3ds` takes the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files for a model in several files. Zip archives among them are opened. It returns a promise of the model.

```ts
import * as THREE from 'three';
import { load3ds } from 'mc-3ds-import';

const input = document.querySelector<HTMLInputElement>('input[type=file]')!;
input.multiple = true;
input.addEventListener('change', async () => {
  const result = await load3ds(input.files!);
  scene.add(result.group);
  for (const warning of result.warnings) console.warn(warning);
});
```

A model in several files is given as all of them together, or as a zip. Files it refers to (with its textures) are found by file name, wherever the model says they are, ignoring case and folders; those not given are listed in `missing`.

## What you get

- **`group`:** a `THREE.Group` holding the model, named after the file.
- **`stats`:** counts of what was read.
- **`warnings`:** anything that couldn't be read or was left out.

3DS files are Z up; the group turns them Y up. Pass `unitScale` for metres per unit.

## Options

- **`main`** (default the first .3ds file): The .3ds file to open, if several are given.
- **`materialType`** (default 'standard'): `'standard'` or `'phong'`.
- **`unitScale`** (default 1): Metres per 3DS unit.

See the [API](API.md) for every field of the result.
