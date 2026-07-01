const puppeteer = require('puppeteer');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Save the page HTML for inspection
  const html = await page.content();
  require('fs').writeFileSync('/workspace/page_debug.html', html);

  // Get all visible text on page
  const pageText = await page.evaluate(() => {
    return {
      title: document.title,
      url: window.location.href,
      bodyText: document.body ? document.body.innerText.substring(0, 3000) : 'no body',
      inputs: Array.from(document.querySelectorAll('input')).map(inp => ({
        type: inp.type,
        name: inp.name,
        placeholder: inp.placeholder,
        id: inp.id,
        className: inp.className,
        visible: inp.offsetParent !== null,
      })),
      buttons: Array.from(document.querySelectorAll('button, input[type="submit"]')).map(btn => ({
        tag: btn.tagName,
        text: btn.textContent?.trim() || btn.value,
        className: btn.className,
        id: btn.id,
        visible: btn.offsetParent !== null,
      })),
      links: Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.textContent.trim().substring(0, 50),
        href: a.href?.substring(0, 100),
        className: a.className,
        visible: a.offsetParent !== null,
      })),
      navElements: Array.from(document.querySelectorAll('[class*="nav"], [class*="menu"], [class*="header"], [class*="top"]')).map(el => ({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 200),
        className: el.className,
      })),
    };
  });

  console.log(JSON.stringify(pageText, null, 2));

  // Take initial screenshot
  await page.screenshot({ path: '/workspace/screenshot_initial.png', fullPage: false });
  console.log('\nInitial screenshot saved to /workspace/screenshot_initial.png');

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
