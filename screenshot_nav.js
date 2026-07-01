const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080/index.html';
const SCREENSHOTS = [
  { navText: '小说IP库', pageId: 'novel-ip', file: '/workspace/screenshot_novel_ip.png' },
  { navText: '剧本库', pageId: 'script', file: '/workspace/screenshot_script.png' },
  { navText: '资产库', pageId: 'assets', file: '/workspace/screenshot_assets.png' },
  { navText: 'Agent工具', pageId: 'tools', file: '/workspace/screenshot_tools.png' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log('Opening page:', BASE_URL);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(3000);

    console.log('Logging in...');
    // Trigger login modal by clicking a protected nav item, then call doLogin()
    await page.evaluate(() => {
      const navEl = document.querySelector('[data-page="novel-ip"]');
      if (navEl) navEl.click();
    });
    await sleep(500);

    await page.evaluate(() => doLogin());
    await sleep(1000);
    console.log('Logged in.');

    // Verify login state
    const loggedIn = await page.evaluate(() => {
      const userIn = document.getElementById('userCenterIn');
      return userIn && getComputedStyle(userIn).display !== 'none';
    });
    console.log('Login verified:', loggedIn);

    // Create breadcrumb-path element to avoid navTo/navToPage errors
    await page.evaluate(() => {
      if (!document.getElementById('breadcrumb-path')) {
        const el = document.createElement('span');
        el.id = 'breadcrumb-path';
        el.style.display = 'none';
        document.body.appendChild(el);
      }
    });

    for (const item of SCREENSHOTS) {
      console.log(`\n--- Navigating to: ${item.navText} ---`);

      await page.evaluate((pageId) => {
        navToPage(pageId);
      }, item.pageId);

      await sleep(2000);
      await page.waitForFunction(() => document.readyState === 'complete', { timeout: 10000 }).catch(() => {});
      await sleep(2000);

      // Verify active page
      const activeInfo = await page.evaluate((pageId) => {
        const navEl = document.querySelector('[data-page="' + pageId + '"]');
        const pageEl = document.getElementById('page-' + pageId);
        return {
          navActive: navEl ? navEl.classList.contains('active') : false,
          pageActive: pageEl ? pageEl.classList.contains('active') : false,
          pageVisible: pageEl ? pageEl.offsetParent !== null : false,
        };
      }, item.pageId);
      console.log('Active state:', activeInfo);

      // Scroll to top to ensure header is visible
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(500);

      console.log(`Taking screenshot: ${item.file}`);
      await page.screenshot({ path: item.file, fullPage: false });
      console.log(`Screenshot saved: ${item.file}`);
    }

    console.log('\n=== All screenshots completed! ===');
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
