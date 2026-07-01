const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // 设置 viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('1. 打开页面...');
  await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
  
  // 等待页面加载
  await page.waitForSelector('.main-content', { timeout: 10000 });
  console.log('   main-content 已加载');
  
  // 检查登录状态，先执行登录
  console.log('2. 执行登录...');
  await page.evaluate(() => {
    if (typeof doLogin === 'function') {
      doLogin();
      return 'doLogin executed';
    }
    return 'doLogin not found';
  }).then(r => console.log('   ' + r));
  
  // 等待登录完成
  await new Promise(r => setTimeout(r, 1000));
  
  // 导航到小说IP库页面 - 手动操作 DOM 避免 navToPage 中的 breadcrumb-path 错误
  console.log('3. 导航到小说IP库页面...');
  await page.evaluate(() => {
    // 手动切换 nav-item active 状态
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navEl = document.querySelector('[data-page="novel-ip"]');
    if (navEl) navEl.classList.add('active');
    
    // 手动切换 page active 状态
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-novel-ip');
    if (target) target.classList.add('active');
  });
  console.log('   页面切换完成');
  
  // 等待页面渲染
  await new Promise(r => setTimeout(r, 1000));
  
  // 截图看看当前状态
  await page.screenshot({ path: '/workspace/debug_screenshot.png', fullPage: false });
  console.log('   截图已保存到 debug_screenshot.png');
  
  // 执行调试 JavaScript
  console.log('4. 执行调试 JavaScript...');
  const result = await page.evaluate(() => {
    const mainContent = document.querySelector('.main-content');
    const novelPage = document.getElementById('page-novel-ip');
    const ipHeader = document.querySelector('#page-novel-ip .ip-header');
    
    const mainContentRect = mainContent ? mainContent.getBoundingClientRect() : null;
    const novelPageRect = novelPage ? novelPage.getBoundingClientRect() : null;
    const ipHeaderRect = ipHeader ? ipHeader.getBoundingClientRect() : null;
    const mainContentStyle = mainContent ? getComputedStyle(mainContent) : null;
    const pageStyle = novelPage ? getComputedStyle(novelPage) : null;
    
    const allPages = [];
    document.querySelectorAll('.page').forEach((p, i) => {
      const rect = p.getBoundingClientRect();
      const style = getComputedStyle(p);
      allPages.push({
        index: i,
        id: p.id,
        class: p.className,
        active: p.classList.contains('active'),
        display: style.display,
        position: style.position,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom
      });
    });
    
    const mainContentChildren = [];
    if (mainContent) {
      Array.from(mainContent.children).forEach((child, i) => {
        const rect = child.getBoundingClientRect();
        const style = getComputedStyle(child);
        mainContentChildren.push({
          index: i,
          tag: child.tagName,
          id: child.id || '',
          class: child.className || '',
          display: style.display,
          position: style.position,
          height: rect.height,
          top: rect.top,
          bottom: rect.bottom,
          marginTop: style.marginTop,
          marginBottom: style.marginBottom,
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
          visibility: style.visibility
        });
      });
    }
    
    // 检查 home page 是否实际不显示但有占位
    const homePage = document.getElementById('page-home');
    const homePageStyle = homePage ? getComputedStyle(homePage) : null;
    
    // 获取 page-novel-ip 的父链信息
    const parentChain = [];
    let current = novelPage;
    while (current && current !== document.body) {
      const rect = current.getBoundingClientRect();
      const style = getComputedStyle(current);
      parentChain.unshift({
        tag: current.tagName,
        id: current.id || '',
        class: current.className || '',
        display: style.display,
        height: rect.height,
        top: rect.top,
        marginTop: style.marginTop,
        paddingTop: style.paddingTop
      });
      current = current.parentElement;
    }
    
    // 检查 page-novel-ip 前面的元素（真正的兄弟）
    const allMainContentChildren = [];
    if (mainContent) {
      Array.from(mainContent.children).forEach((child, i) => {
        const rect = child.getBoundingClientRect();
        const style = getComputedStyle(child);
        const nestedPages = [];
        child.querySelectorAll('.page').forEach(np => {
          const nr = np.getBoundingClientRect();
          const ns = getComputedStyle(np);
          nestedPages.push({ id: np.id, display: ns.display, height: nr.height, top: nr.top, active: np.classList.contains('active') });
        });
        allMainContentChildren.push({
          index: i,
          tag: child.tagName,
          id: child.id || '',
          class: child.className || '',
          display: style.display,
          height: rect.height,
          top: rect.top,
          bottom: rect.bottom,
          nestedPages: nestedPages
        });
      });
    }
    
    return {
      mainContentRect: mainContentRect ? { top: mainContentRect.top, height: mainContentRect.height, paddingTop: mainContentStyle.paddingTop } : null,
      novelPageRect: novelPageRect ? { top: novelPageRect.top, height: novelPageRect.height } : null,
      ipHeaderRect: ipHeaderRect ? { top: ipHeaderRect.top } : null,
      novelPageDisplay: pageStyle ? pageStyle.display : 'N/A',
      novelPageClass: novelPage ? novelPage.className : 'N/A',
      parentChain: parentChain,
      allMainContentChildren: allMainContentChildren,
      scrollTop: mainContent ? mainContent.scrollTop : 'N/A'
    };
  });
  
  console.log(JSON.stringify(result, null, 2));
  
  await browser.close();
  console.log('\n完成。');
})();
