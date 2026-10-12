/**
 * generate-official-content.mjs
 * ------------------------------------------------------------------
 * Genera src/data/official-attractions.json como FUENTE OFICIAL del
 * contenido distribuido, a partir del dataset base definido en
 * src/data/attractions.ts (atractivos + imágenes locales referenciales).
 *
 * Uso:  node scripts/generate-official-content.mjs
 *
 * Este script NO descarga imágenes. Sólo consolida el contenido ya
 * incorporado en el proyecto y sus rutas locales compatibles con
 * GitHub Pages (sin rutas Windows, sin idb:, sin blob:, sin URLs externas).
 * ------------------------------------------------------------------
 */

import { build } from 'esbuild';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcFile = path.join(rootDir, 'src', 'data', 'attractions.ts');
const outFile = path.join(rootDir, 'src', 'data', 'official-attractions.json');
const tmpFile = path.join(rootDir, 'node_modules', '.cache-official-attractions.mjs');

const FORBIDDEN = [
  { re: /^[a-zA-Z]:[\\/]/, reason: 'ruta absoluta de Windows' },
  { re: /\\/, reason: 'backslash de Windows' },
  { re: /^idb:/, reason: 'referencia IndexedDB' },
  { re: /^blob:/, reason: 'URL de objeto temporal' },
  { re: /^https?:\/\//, reason: 'URL externa (debe ser local)' },
];

function sanitizeImagePath(url) {
  return String(url).replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\/+/, '');
}

async function loadBaseAttractions() {
  await build({
    entryPoints: [srcFile],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: tmpFile,
    logLevel: 'error',
  });
  const mod = await import(pathToFileURL(tmpFile).href + `?t=${Date.now()}`);
  await fs.rm(tmpFile, { force: true });
  return mod.INITIAL_ATTRACTIONS;
}

function toOfficialAttraction(a) {
  const images = (a.images || []).map(sanitizeImagePath);
  const meta = a.imageMeta || [];
  const imageMeta = images.map((url, i) => ({
    url,
    alt: meta[i]?.alt ?? `${a.name} - imagen ${i + 1}`,
    source: meta[i]?.source ?? 'Ilustración referencial de demostración',
    author: meta[i]?.author ?? 'Huamanga: Tu Historia Viva',
    license: meta[i]?.license ?? 'Uso demostrativo académico',
    isReferential: meta[i]?.isReferential ?? true,
  }));
  return {
    ...a,
    images,
    imageMeta,
    isReferentialImage: a.isReferentialImage ?? imageMeta.every((m) => m.isReferential),
    lastModified: a.lastModified ?? new Date().toISOString(),
  };
}

function validate(attractions) {
  const problems = [];
  for (const a of attractions) {
    for (const url of a.images) {
      for (const rule of FORBIDDEN) {
        if (rule.re.test(url)) problems.push(`${a.slug}: "${url}" -> ${rule.reason}`);
      }
    }
  }
  return problems;
}

async function main() {
  const base = await loadBaseAttractions();
  const attractions = base.map(toOfficialAttraction);
  const problems = validate(attractions);
  if (problems.length) {
    console.error('✗ Se detectaron rutas no válidas:');
    problems.forEach((p) => console.error('  - ' + p));
    process.exitCode = 1;
    return;
  }

  let contentVersion = 1;
  try {
    const prev = JSON.parse(await fs.readFile(outFile, 'utf8'));
    contentVersion = (prev.contentVersion ?? 0) + 1;
  } catch {
    contentVersion = 1;
  }

  const payload = {
    contentVersion,
    updatedAt: new Date().toISOString(),
    note:
      'Fuente oficial del contenido distribuido. Las rutas de imágenes son locales ' +
      'y relativas para compatibilidad con GitHub Pages. Ver CREDITS.md.',
    attractions,
  };

  await fs.writeFile(outFile, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`✓ official-attractions.json generado (contentVersion=${contentVersion}, ${attractions.length} atractivos).`);
  console.log(`  -> ${path.relative(rootDir, outFile)}`);
}

main().catch((err) => {
  console.error('✗ Error inesperado:', err);
  process.exitCode = 1;
});
