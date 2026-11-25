# Formats and support

mc-3ds-import reads 3DS with three.js's TDSLoader.

## What is read

- Meshes with texture coordinates, and their materials: colours, shininess, transparency, and colour, bump and specular maps.
- Textures given with the file, found by name.
- Materials as MeshStandardMaterial, or MeshPhongMaterial with `materialType: 'phong'`.
- The file's master scale, returned but not applied, as its meaning varies between programs.

## Orientation and units

3DS files are Z up; the group turns them Y up. Pass `unitScale` for metres per unit.

## Limits

Cameras, lights and keyframe animation are not read.
