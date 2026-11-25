# mc-3ds-import

A 3DS importer for [three.js](https://threejs.org/), written in TypeScript. It reads Autodesk 3D Studio files with their meshes, materials and textures, Y up. It was made for [SceneEditor](https://github.com/VJigouline/SceneEditor), and works in any three.js application.

```ts
import { load3ds } from 'mc-3ds-import';

const result = await load3ds(input.files);   // the .3ds and its textures
scene.add(result.group);
console.log(result.warnings);       // anything that couldn't be read
```

## What it reads

- Meshes with texture coordinates, and their materials: colours, shininess, transparency, and colour, bump and specular maps.
- Textures given with the file, found by name.
- Materials as MeshStandardMaterial, or MeshPhongMaterial with `materialType: 'phong'`.
- The file's master scale, returned but not applied, as its meaning varies between programs.

Cameras, lights and keyframe animation are not read. See [Formats and support](Documentation/Support.md) for the details.

## Install

The package is not on the npm registry. Install it from GitHub:

```sh
npm install github:VJigouline/mc-3ds-import
```

`three` (r160 or later) is a peer dependency. The package builds itself on install.

## Documentation

- [Getting started](Documentation/GettingStarted.md)
- [API](Documentation/API.md)
- [Formats and support](Documentation/Support.md)
- [Using it in SceneEditor](Documentation/SceneEditor.md)

## Development

```sh
npm install
npm test           # unit tests, with Vitest
npm run typecheck
npm run build      # dist/
```

The tests load real 3DS files, kept in [`tests/samples`](tests/samples/README.md) with their licences. It needs Node.js 22 or later.

## Licence

[MIT](LICENSE)
