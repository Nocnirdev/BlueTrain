#!/usr/bin/env node
/**
 * Genera lotes OCR privados para el revisor de Fuerza.
 *
 * Ejemplo:
 *   node scripts/ocr-fuerza.mjs --input "/ruta/Ejercicios de Fuerza.pdf" \
 *     --output "/ruta/OCR privado" --first-page 2 --last-page 151
 *
 * Requiere macOS (Vision), Swift y Poppler (pdftoppm). Nunca escribe dentro
 * del repositorio si se indica una carpeta de salida independiente.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (!key?.startsWith('--') || value === undefined) {
    console.error('Uso: node scripts/ocr-fuerza.mjs --input PDF --output CARPETA [--first-page 2 --last-page 151 --batch-size 5]');
    process.exit(64);
  }
  args.set(key, value);
}

const input = args.get('--input');
const output = args.get('--output');
const firstPage = Number(args.get('--first-page') ?? '2');
const lastPage = Number(args.get('--last-page') ?? '151');
const batchSize = Number(args.get('--batch-size') ?? '5');
if (!input || !output || !existsSync(input) || !Number.isInteger(firstPage) || !Number.isInteger(lastPage) || !Number.isInteger(batchSize) || firstPage < 1 || lastPage < firstPage || batchSize < 1 || batchSize > 10) {
  console.error('Revise la ruta de entrada y el rango de páginas. Cada lote debe tener entre 1 y 10 páginas.');
  process.exit(64);
}

const inputPath = resolve(input);
const outputPath = resolve(output);
const repoPath = resolve(scriptDir, '..');
if (outputPath === repoPath || outputPath.startsWith(`${repoPath}/`)) {
  console.error('La salida debe quedar fuera del repositorio para no arriesgar la publicación del material privado.');
  process.exit(64);
}

const poppler = process.env.PDFTOPPM || 'pdftoppm';
const swiftc = process.env.SWIFTC || 'swiftc';
const tempPath = mkdtempSync(join(tmpdir(), 'bluetrain-fuerza-ocr-'));
const visionBinary = join(tempPath, 'vision-ocr');
const visionSource = join(scriptDir, 'vision-ocr.swift');
const sourceName = basename(inputPath);

function command(command, commandArgs) {
  return execFileSync(command, commandArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function pageTotal() {
  try {
    const info = command(process.env.PDFINFO || 'pdfinfo', [inputPath]);
    const match = info.match(/^Pages:\s+(\d+)$/m);
    return match ? Number(match[1]) : undefined;
  } catch {
    return undefined;
  }
}

function imageFor(page, batchTemp) {
  const before = new Set(readdirSync(batchTemp));
  command(poppler, ['-png', '-r', '240', '-f', String(page), '-l', String(page), inputPath, join(batchTemp, 'page')]);
  const images = readdirSync(batchTemp).filter(file => file.endsWith('.png') && !before.has(file));
  if (images.length !== 1) throw new Error(`No se pudo identificar la imagen de la página ${page}.`);
  const image = images[0];
  return join(batchTemp, image);
}

function ocrImage(image) {
  const raw = command(visionBinary, [image]);
  const lines = JSON.parse(raw);
  if (!Array.isArray(lines)) throw new Error('Vision devolvió un formato no esperado.');
  return lines.map(line => ({
    text: typeof line.text === 'string' ? line.text : '',
    ...(typeof line.confidence === 'number' ? { confidence: line.confidence } : {}),
    ...(typeof line.x === 'number' ? { x: line.x } : {}),
    ...(typeof line.y === 'number' ? { y: line.y } : {}),
  }));
}

mkdirSync(outputPath, { recursive: true });
if (statSync(inputPath).size === 0) {
  console.error('El PDF de entrada está vacío.');
  process.exit(65);
}

try {
  command(swiftc, [visionSource, '-framework', 'Vision', '-framework', 'AppKit', '-o', visionBinary]);
  const totalPages = pageTotal();
  const index = { schemaVersion: 1, createdAt: new Date().toISOString(), source: { fileName: sourceName, ...(totalPages ? { totalPages } : {}) }, batches: [] };
  let batchNumber = 1;
  for (let start = firstPage; start <= lastPage; start += batchSize, batchNumber += 1) {
    const end = Math.min(lastPage, start + batchSize - 1);
    const batchTemp = mkdtempSync(join(tempPath, `batch-${String(batchNumber).padStart(3, '0')}-`));
    try {
      const pages = [];
      for (let page = start; page <= end; page += 1) {
        const lines = ocrImage(imageFor(page, batchTemp));
        pages.push({ page, rawText: lines.map(line => line.text).filter(Boolean).join('\n'), lines });
      }
      const batchId = `lote-fuerza-${String(batchNumber).padStart(3, '0')}`;
      const fileName = `${batchId}.json`;
      const batch = { schemaVersion: 1, batchId, createdAt: new Date().toISOString(), source: { fileName: sourceName, pageRange: [start, end], ...(totalPages ? { totalPages } : {}) }, pages };
      writeFileSync(join(outputPath, fileName), `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
      index.batches.push({ file: fileName, batchId, pageRange: [start, end], pages: pages.length });
      console.log(`${batchId}: páginas ${start}–${end}`);
    } finally {
      rmSync(batchTemp, { recursive: true, force: true });
    }
  }
  writeFileSync(join(outputPath, 'indice-fuerza-ocr.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  console.log(`Completado: ${index.batches.length} lotes privados en ${outputPath}`);
} finally {
  rmSync(tempPath, { recursive: true, force: true });
}
