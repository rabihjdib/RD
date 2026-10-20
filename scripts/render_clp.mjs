// Renders every Chez Les Petits still (all ads x all formats, plus logo assets) to
// out/chez-les-petits/, bundling once instead of once per still.
// usage: node scripts/render_clp.mjs [id-filter]
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser, renderStill} from '@remotion/renderer';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, 'out/chez-les-petits');
mkdirSync(outDir, {recursive: true});

// Prefer the preinstalled Chromium so no browser download is needed.
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = existsSync(shell) ? shell : null;

const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable});
const filter = process.argv[2] ?? '';
const comps = (await getCompositions(serveUrl, {puppeteerInstance: browser})).filter(
	(c) => c.id.startsWith('CLP-') && c.id.includes(filter),
);
for (const composition of comps) {
	await renderStill({
		composition,
		serveUrl,
		output: path.join(outDir, `${composition.id.slice(4)}.png`),
		puppeteerInstance: browser,
	});
	console.log('rendered', composition.id);
}
await browser.close({silent: true});
console.log(comps.length, 'stills');
