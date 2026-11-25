import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { load3ds, TdsImportError } from '../src/index.js';
import { allSamples, sample } from './files.js';

describe('3DS', () => {
  it('reads a model with its textures, turned Y up', async () => {
    const r = await load3ds(allSamples());
    expect(r.missing).toEqual([]);
    expect(r.stats).toMatchObject({ meshes: 1, triangles: 4117 });
    expect(r.stats.textures).toBeGreaterThan(0);
    expect(r.group.rotation.x).toBeCloseTo(-Math.PI / 2);
    const mesh = r.group.getObjectByProperty('type', 'Mesh') as THREE.Mesh;
    expect(mesh.material).toBeInstanceOf(THREE.MeshStandardMaterial);
  });

  it('reports textures that are not given', async () => {
    const r = await load3ds(sample('portalgun.3ds'));
    expect(r.missing.length).toBeGreaterThan(0);
  });

  it('refuses files that are not 3DS', async () => {
    await expect(load3ds({ name: 'a.3ds', data: 'hello' })).rejects.toThrow(TdsImportError);
  });
});
