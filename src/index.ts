import * as THREE from 'three';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { countModel, FileManager, ImportFiles, orient, toStandardMaterials, type ImportInput, type ImportStats } from './common.js';

export { ImportFiles, FileManager, toStandardMaterials, countModel } from './common.js';
export type { ImportInput, ImportFile, ImportData, ImportStats } from './common.js';

export interface TdsOptions {
  /** The .3ds file to open, if several are given. By default, the first. */
  main?: string;
  /** standard (the default) turns the materials into MeshStandardMaterial; phong keeps MeshPhongMaterial. */
  materialType?: 'standard' | 'phong';
  /** Metres per 3DS unit, overriding the file's master scale. */
  unitScale?: number;
}

export interface TdsLoadResult {
  /** The model, Y up: a group named after the file. */
  group: THREE.Group;
  /** The file's master scale (MASTER_SCALE chunk), 1 if it has none. */
  masterScale: number;
  /** Textures the model refers to that were not given. */
  missing: string[];
  warnings: string[];
  stats: ImportStats;
}

export class TdsImportError extends Error {
  override name = 'TdsImportError';
}

/** Finds the MASTER_SCALE chunk (0x0100) inside the editor chunk (0x3D3D). */
function masterScale(bytes: Uint8Array): number {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const walk = (start: number, end: number): number | null => {
    let p = start;
    while (p + 6 <= end) {
      const id = v.getUint16(p, true);
      const len = v.getUint32(p + 2, true);
      if (len < 6 || p + len > end) return null;
      if (id === 0x0100 && len >= 10) return v.getFloat32(p + 6, true);
      if (id === 0x3d3d) {
        const found = walk(p + 6, p + len);
        if (found !== null) return found;
      }
      p += len;
    }
    return null;
  };
  // The main chunk (0x4D4D) holds the version and the editor chunk.
  return v.byteLength > 6 && v.getUint16(0, true) === 0x4d4d ? (walk(6, Math.min(v.getUint32(2, true), v.byteLength)) ?? 1) : 1;
}

/**
 * Reads an Autodesk 3D Studio .3ds file. Pass the file's bytes, or the .3ds file with its
 * textures, loose or in a zip.
 */
export async function load3ds(input: ImportInput, options: TdsOptions = {}): Promise<TdsLoadResult> {
  const files = await ImportFiles.from(input, 'model.3ds');
  const main = files.main(['3ds'], options.main) ?? files.files[0];
  if (!main) throw new TdsImportError('There is no .3ds file to open');
  const bytes = main.bytes;
  if (!(bytes[0] === 0x4d && bytes[1] === 0x4d)) throw new TdsImportError(`${main.name} is not a 3DS file`);
  const fm = new FileManager(files);
  const loader = new TDSLoader(fm.manager);
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const model = loader.parse(data, '');
  await fm.done();
  fm.dispose();
  if ((options.materialType ?? 'standard') === 'standard') toStandardMaterials(model);
  const warnings: string[] = [];
  const missing = [...fm.missing];
  if (missing.length) warnings.push(`Textures not found: ${missing.join(', ')}`);
  const scale = masterScale(bytes);
  const name = main.name.replace(/\\/g, '/').split('/').pop()!.replace(/\.3ds$/i, '');
  model.name = name;
  // 3DS files are Z up.
  const group = orient(model, name, true, options.unitScale ?? 1);
  return { group, masterScale: scale, missing, warnings, stats: countModel(group) };
}
