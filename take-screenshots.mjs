import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'docs', 'screenshots');
fs.mkdirSync(screenshotsDir, { recursive: true });

const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});

// Screenshot: display.html
console.log('Taking display screenshot...');
const displayPage = await browser.newPage();
await displayPage.setViewport({ width: 1920, height: 1080 });
await displayPage.goto(`file://${path.join(__dirname, 'display.html')}`, { waitUntil: 'networkidle0' });
await displayPage.evaluate(() => {
    document.getElementById('tournament-title').textContent = 'Sommerturnier 2026';
    document.getElementById('name-home').textContent = 'FC Adler';
    document.getElementById('name-away').textContent = 'SV Löwen';
    document.getElementById('score-home').textContent = '3';
    document.getElementById('score-away').textContent = '2';
    document.getElementById('timer').textContent = '07:24';
    document.getElementById('scorers-home').innerHTML = "12' Müller #9<br>25' Schmidt #7<br>38' Weber #11";
    document.getElementById('scorers-away').innerHTML = "18' Fischer #10<br>31' Wagner #5";
});
await new Promise(r => setTimeout(r, 500));
await displayPage.screenshot({ path: path.join(screenshotsDir, 'display.png') });
console.log('Saved display.png');

// Screenshot: control.html
console.log('Taking control screenshot...');
const controlPage = await browser.newPage();
await controlPage.setViewport({ width: 1200, height: 900 });
await controlPage.goto(`file://${path.join(__dirname, 'control.html')}`, { waitUntil: 'networkidle0' });
await controlPage.evaluate(() => {
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) { el.value = val; el.dispatchEvent(new Event('input', { bubbles: true })); }
    };
    setVal('tournamentName', 'Sommerturnier 2026');
    setVal('homeTeamName', 'FC Adler');
    setVal('awayTeamName', 'SV Löwen');
});
await new Promise(r => setTimeout(r, 500));
await controlPage.screenshot({ path: path.join(screenshotsDir, 'control.png'), fullPage: true });
console.log('Saved control.png');

await browser.close();
console.log('Done!');
