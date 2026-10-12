/**
 * finalize-presentation-content.mjs
 * ------------------------------------------------------------------
 * Incorpora DEFINITIVAMENTE las fotografías de la exposición al
 * proyecto y actualiza la fuente oficial del contenido.
 *
 * Uso:   node scripts/finalize-presentation-content.mjs
 *
 * Flujo:
 *   1. Lee imagenes_definitivas_exposicion/
 *   2. Valida formato, legibilidad y tamaño.
 *   3. Asocia cada foto a un atractivo por nombre de archivo
 *      (o por manifest.json explícito). NO adivina por parecido visual.
 *   4. Optimiza (sharp si está disponible), corrige orientación,
 *      mantiene proporciones y convierte a WEBP preferentemente.
 *   5. Copia a public/images/attractions/ (con respaldo previo).
 *   6. Actualiza src/data/official-attractions.json.
 *
 * Reglas de nombre de archivo:
 *   <slug>-portada.<ext>            -> portada del atractivo
 *   <slug>-galeria-01.<ext>         -> imagen de galería (orden)
 *   <slug>-<N>.<ext>                -> imagen de galería (orden = N)
 *   <slug>.<ext>                    -> portada
 * El <slug> debe coincidir EXACTAMENTE con un atractivo oficial.
 * Si el nombre no permite identificar el atractivo con seguridad,
 * la fotografía se OMITE y se registra como pendiente.
 * ------------------------------------------------------------------
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const inboxDir = path.join(rootDir, 'imagenes_definitivas_exposicion');
const targetDir = path.join(rootDir, 'public', 'images', 'attractions');
const officialFile = path.join(rootDir, 'src', 'data', 'official-attractions.json');
const backupRoot = path.join(rootDir, '.presentation_backup');

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB por original
const MAX_WIDTH = 1920;

const report = {
  found: [],
  processed: [],
  skipped: [],
  updatedAttractions: new Set(),
  backups: [],
  errors: [],
  warnings: [],
};

const log = (msg) => console.log(msg);

function safeName(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function loadSharp() {
  try {
    const mod = await import('sharp');
    return mod.default;
  } catch {
    return null;
  }
}

async function readOfficial() {
  const raw = await fs.readFile(officialFile, 'utf8');
  return JSON.parse(raw);
}

function buildSlugIndex(official) {
  const index = new Map();
  for (const a of official.attractions) index.set(a.slug, a);
  return index;
}

/** Determina { slug, role, order } a partir del nombre del archivo. */
function resolveFromFileName(fileName, slugIndex) {
  const ext = path.extname(fileName).toLowerCase();
  const base = safeName(path.basename(fileName, ext));
  const slugs = [...slugIndex.keys()].sort((a, b) => b.length - a.length);

  for (const slug of slugs) {
    const safeSlug = safeName(slug);
    if (base === safeSlug) return { slug, role: 'portada', order: 0 };
    if (!base.startsWith(safeSlug + '-')) continue;

    const rest = base.slice(safeSlug.length + 1);
    if (['portada', 'cover', 'principal'].includes(rest)) return { slug, role: 'portada', order: 0 };
    if (rest.startsWith('galeria') || rest.startsWith('gallery')) {
      const numMatch = rest.match(/(\d+)/);
      return { slug, role: 'galeria', order: numMatch ? parseInt(numMatch[1], 10) : 1 };
    }
    const bareNum = rest.match(/^(\d+)$/);
    if (bareNum) return { slug, role: 'galeria', order: parseInt(bareNum[1], 10) };
    // Prefijo reconocido pero sufijo desconocido: no es seguro asumir.
    return { ambiguous: true, slug, rest };
  }
  return null;
}

async function readManifest() {
  const p = path.join(inboxDir, 'manifest.json');
  if (!(await exists(p))) return null;
  try {
    return JSON.parse(await fs.readFile(p, 'utf8'));
  } catch (err) {
    report.warnings.push(`manifest.json ilegible: ${err.message}`);
    return null;
  }
}

function findByManifest(manifest, fileName, slugIndex) {
  if (!manifest || !Array.isArray(manifest.photos)) return null;
  const entry = manifest.photos.find((ph) => ph.file === fileName);
  if (!entry) return null;
  if (!slugIndex.has(entry.slug)) return { ambiguous: true, slug: entry.slug, rest: 'slug inexistente' };
  return {
    slug: entry.slug,
    role: entry.role === 'portada' ? 'portada' : 'galeria',
    order: Number.isFinite(entry.order) ? entry.order : 1,
    author: entry.author,
    source: entry.source,
    license: entry.license,
    status: entry.status,
    url: entry.url,
  };
}

async function processImage(fileName, sharp) {
  const input = path.join(inboxDir, fileName);
  const ext = path.extname(fileName).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    report.skipped.push(`${fileName} (formato no permitido)`);
    return null;
  }
  let stat;
  try {
    stat = await fs.stat(input);
  } catch {
    report.skipped.push(`${fileName} (no legible)`);
    return null;
  }
  if (stat.size > MAX_BYTES) {
    report.skipped.push(`${fileName} (excede ${Math.round(MAX_BYTES / 1024 / 1024)} MB)`);
    return null;
  }
  if (sharp && stat.size > 512 * 1024) {
    const meta = await sharp(input).metadata();
    const meta2 = meta.width && meta.width > MAX_WIDTH
      ? `se reducirá de ${meta.width}px a ${MAX_WIDTH}px`
      : `dimensiones ${meta.width}x${meta.height}`;
    log(`   · optimizando ${fileName} (${meta2})`);
  }
  return { input, ext, size: stat.size };
}

async function writeFinal(fileName, resolved, sharp) {
  const base = safeName(resolved.slug);
  const suffix =
    resolved.role === 'portada' ? 'portada' : `galeria-${String(resolved.order).padStart(2, '0')}`;
  const outExt = sharp ? '.webp' : path.extname(fileName).toLowerCase();
  const outName = `${base}-${suffix}${outExt}`;
  const outPath = path.join(targetDir, outName);

  if (await exists(outPath)) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const bdir = path.join(backupRoot, `images_${ts}`);
    await fs.mkdir(bdir, { recursive: true });
    await fs.copyFile(outPath, path.join(bdir, outName));
    report.backups.push(path.relative(rootDir, path.join(bdir, outName)));
  }

  if (sharp) {
    await sharp(path.join(inboxDir, fileName))
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);
  } else {
    await fs.copyFile(path.join(inboxDir, fileName), outPath);
  }
  return { outName, outPath };
}

function buildImageMeta(resolved, outName, url, fallbackName) {
  const isReferential = resolved.status ? resolved.status === 'referencial' : false;
  const source = resolved.source ?? (isReferential ? 'Material referencial de demostración' : 'Fotografía incorporada');
  const author = resolved.author ?? 'Responsable del proyecto';
  const license = resolved.license ?? (isReferential ? 'Uso demostrativo académico' : 'Uso autorizado');
  return {
    url,
    alt: `${resolved.slug.replace(/-/g, ' ')} - ${resolved.role === 'portada' ? 'portada' : 'galería ' + resolved.order}`,
    source,
    author,
    license,
    isReferential,
    addedAt: new Date().toISOString(),
  };
}

async function main() {
  log('==========================================================');
  log(' FINALIZAR CONTENIDO DE LA EXPOSICIÓN');
  log('==========================================================');

  await fs.mkdir(targetDir, { recursive: true });
  if (!(await exists(inboxDir))) {
    await fs.mkdir(inboxDir, { recursive: true });
    log('· Se creó imagenes_definitivas_exposicion/ (vacía).');
  }

  const official = await readOfficial();
  const slugIndex = buildSlugIndex(official);
  const sharp = await loadSharp();
  log(sharp ? '· Optimizador sharp: DISPONIBLE (se convertirá a WEBP).' : '· Optimizador sharp: no disponible (se copiarán los originales).');

  const entries = (await fs.readdir(inboxDir)).filter(
    (f) => !f.startsWith('.') && f !== 'manifest.json' && ALLOWED_EXT.has(path.extname(f).toLowerCase())
  );
  report.found = entries;
  const manifest = await readManifest();

  // Acumular correspondencias por atractivo.
  const planned = new Map(); // slug -> { portada, galeria: [] }

  for (const fileName of entries) {
    const resolved = findByManifest(manifest, fileName, slugIndex) || resolveFromFileName(fileName, slugIndex);
    if (!resolved) {
      report.skipped.push(`${fileName} (no corresponde a ningún slug oficial)`);
      continue;
    }
    if (resolved.ambiguous) {
      report.skipped.push(`${fileName} (ambigüedad: "${resolved.rest}"; use manifest.json)`);
      continue;
    }
    const image = await processImage(fileName, sharp);
    if (!image) continue;

    try {
      const { outName, outPath } = await writeFinal(fileName, resolved, sharp);
      const url = `images/attractions/${outName}`;
      const entry = planned.get(resolved.slug) || { portada: null, galeria: [] };
      const meta = buildImageMeta(resolved, outName, url, fileName);
      if (resolved.role === 'portada' && !entry.portada) entry.portada = meta;
      else entry.galeria.push({ ...meta, _order: resolved.order });
      planned.set(resolved.slug, entry);
      report.processed.push(`${fileName} -> ${outName}`);
      void outPath;
    } catch (err) {
      report.errors.push(`${fileName}: ${err.message}`);
    }
  }

  // Aplicar cambios al contenido oficial.
  for (const attraction of official.attractions) {
    const entry = planned.get(attraction.slug);
    if (!entry) continue;
    const galleries = entry.galeria.sort((a, b) => a._order - b._order).map(({ _order, ...rest }) => rest);
    const images = [entry.portada, ...galleries].filter(Boolean);
    attraction.images = images.map((m) => m.url);
    attraction.imageMeta = images;
    attraction.isReferentialImage = images.every((m) => m.isReferential);
    attraction.lastModified = new Date().toISOString();
    report.updatedAttractions.add(attraction.slug);
  }

  // Validar que TODAS las rutas oficiales existan físicamente.
  const missing = [];
  for (const a of official.attractions) {
    for (const url of a.images) {
      const clean = url.replace(/^\.?\//, '');
      if (!(await exists(path.join(rootDir, 'public', clean)))) missing.push(`${a.slug}: ${url}`);
    }
  }
  if (missing.length) {
    report.warnings.push(`Referencias sin archivo físico (${missing.length}):`);
    missing.forEach((m) => report.warnings.push('   - ' + m));
  }

  if (report.updatedAttractions.size > 0) {
    official.contentVersion = (official.contentVersion ?? 0) + 1;
    official.updatedAt = new Date().toISOString();
    await fs.writeFile(officialFile, JSON.stringify(official, null, 2) + '\n', 'utf8');
  }

  printReport();
}

function printReport() {
  log('');
  log('----------------------------------------------------------');
  log(`Fotografías encontradas : ${report.found.length}`);
  log(`Fotografías procesadas  : ${report.processed.length}`);
  report.processed.forEach((p) => log('   ✓ ' + p));
  log(`Fotografías omitidas    : ${report.skipped.length}`);
  report.skipped.forEach((p) => log('   – ' + p));
  log(`Atractivos actualizados : ${report.updatedAttractions.size}`);
  [...report.updatedAttractions].forEach((s) => log('   ★ ' + s));
  log(`Respaldos creados       : ${report.backups.length}`);
  report.backups.forEach((b) => log('   ⌫ ' + b));
  log(`Errores                 : ${report.errors.length}`);
  report.errors.forEach((e) => log('   ✗ ' + e));
  log(`Advertencias            : ${report.warnings.length}`);
  report.warnings.forEach((w) => log('   ! ' + w));
  log('');
  log(`Ubicación definitiva    : public/images/attractions/`);
  log(`Fuente oficial          : src/data/official-attractions.json`);
  log('----------------------------------------------------------');

  if (report.found.length === 0) {
    log('No se encontraron fotografías nuevas. El contenido oficial actual');
    log('(imágenes referenciales incluidas en el proyecto) se mantiene intacto.');
  }
}

main().catch((err) => {
  console.error('✗ Error fatal:', err);
  process.exitCode = 1;
});
