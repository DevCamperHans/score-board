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

const langs = ['de', 'en'];

for (const lang of langs) {
    console.log(`Taking screenshots for "${lang}"...`);

    // Screenshot: display.html
    const displayPage = await browser.newPage();
    await displayPage.setViewport({ width: 1920, height: 1080 });
    await displayPage.goto(`file://${path.join(__dirname, 'display.html')}`, { waitUntil: 'networkidle0' });
    await displayPage.evaluate((lng) => {
        localStorage.setItem('scoreboard-lang', lng);
        applyDisplayLang();

        document.getElementById('tournament-title').textContent = 'Sommerturnier 2026';
        document.getElementById('name-home').textContent = 'FC Adler';
        document.getElementById('name-away').textContent = 'SV Löwen';
        document.getElementById('score-home').textContent = '3';
        document.getElementById('score-away').textContent = '2';
        document.getElementById('timer').textContent = '07:24';
        document.getElementById('scorers-home').innerHTML = "12' Müller #9<br>25' Schmidt #7<br>38' Weber #11";
        document.getElementById('scorers-away').innerHTML = "18' Fischer #10<br>31' Wagner #5";
    }, lang);
    await new Promise(r => setTimeout(r, 500));
    await displayPage.screenshot({ path: path.join(screenshotsDir, `display-${lang}.png`) });
    console.log(`Saved display-${lang}.png`);
    await displayPage.close();

    // Screenshot: control.html
    const controlPage = await browser.newPage();
    await controlPage.setViewport({ width: 1200, height: 900 });
    await controlPage.goto(`file://${path.join(__dirname, 'control.html')}`, { waitUntil: 'networkidle0' });
    await controlPage.evaluate((lng) => {
        setLanguage(lng);
    }, lang);
    await new Promise(r => setTimeout(r, 500));
    await controlPage.screenshot({ path: path.join(screenshotsDir, `control-${lang}.png`), fullPage: true });
    console.log(`Saved control-${lang}.png`);
    await controlPage.close();
}

await browser.close();
console.log('Done!');
