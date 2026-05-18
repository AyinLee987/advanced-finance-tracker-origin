const { build } = require('esbuild');
const fs = require('fs');

(async function() {
  try {
    await build({
      entryPoints: ['main.js'],
      bundle: false,
      minify: true,
      sourcemap: false,
      outfile: 'main.min.js',
      target: ['es2018'],
    });

    const css = fs.readFileSync('style.css', 'utf8');
    const minCss = css.replace(/\/\*[^]*?\*\//g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    fs.writeFileSync('style.min.css', minCss, 'utf8');

    console.log('Assets built: main.min.js, style.min.css');
  } catch (e) {
    console.error('Build failed', e);
    process.exit(1);
  }
})();
