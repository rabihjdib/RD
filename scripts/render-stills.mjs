// Renders many Stills from one bundle, much faster than one `remotion still` per id.
// Usage: node scripts/render-stills.mjs <id-prefix> <out-dir> [browser-executable]
// Each Still whose id starts with the prefix is written to <out-dir>/<file>.png, where
// <file> comes from the Still's `file` default prop, or the id itself.
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const [prefix, outDir, browserExecutable] = process.argv.slice(2);
if (!prefix || !outDir) {
	console.error('Usage: node scripts/render-stills.mjs <id-prefix> <out-dir> [browser-executable]');
	process.exit(1);
}

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = (await getCompositions(serveUrl, {browserExecutable})).filter((c) => c.id.startsWith(prefix));
mkdirSync(outDir, {recursive: true});
for (const composition of comps) {
	const output = path.join(outDir, `${composition.props.file ?? composition.id}.png`);
	await renderStill({composition, serveUrl, output, browserExecutable, overwrite: true});
	console.log(output);
}
