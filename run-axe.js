const express = require('express');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const axeCore = require('axe-core');

const app = express();
const root = path.join(__dirname);
app.use(express.static(root));

const candidateExecutables = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  process.env.CHROMIUM_PATH,
  process.env.EDGE_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

const executablePath = candidateExecutables.find((candidate) => fs.existsSync(candidate));

(async () => {
  const server = app.listen(0, async () => {
    const port = server.address().port;
    const url = `http://localhost:${port}/`;
    console.log(`Serving ${root} at ${url}`);

    let browser = null;
    try {
      if (!executablePath) {
        throw new Error('No Chrome/Edge executable found. Set PUPPETEER_EXECUTABLE_PATH to a browser path.');
      }
      console.log(`Using browser executable: ${executablePath}`);
      browser = await puppeteer.launch({
        executablePath,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      await page.evaluate(axeSource => {

        eval(axeSource);
      }, axeCore.source);

      const results = await page.evaluate(async () => {
        return await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        });
      });

      console.log('Axe results summary:');
      console.log(`Violations: ${results.violations.length}`);
      if (results.violations.some(v => v.impact === 'critical')) {
        process.exitCode = 1;
      }
      if (results.violations.length > 0) {
        results.violations.forEach((v) => {
          console.log(`- ${v.id}: ${v.help} (impact: ${v.impact})`);
          v.nodes.slice(0,3).forEach((n, i) => {
            console.log(`   ${i+1}) ${n.html}`);
          });
        });
      }


      await browser.close();
    } catch (err) {
      console.error('Error running axe:', err);
      if (browser) await browser.close();
      process.exitCode = 2;
    } finally {
      server.close();
    }
  });
})();
