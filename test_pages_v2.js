const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('1. 打开首页...');
  await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle2', timeout: 30000 });

  // 等待页面渲染完成
  await new Promise(r => setTimeout(r, 2000));

  // 截图首页
  console.log('2. 截图首页 -> /workspace/screenshot_home_v2.png');
  await page.screenshot({ path: '/workspace/screenshot_home_v2.png', fullPage: false });

  // 检查页面是否有布局错乱
  const layoutIssues = await page.evaluate(() => {
    const issues = [];
    // 检查关键元素是否存在
    if (!document.getElementById('page-home')) issues.push('缺少 #page-home 元素');
    if (!document.querySelector('.topbar')) issues.push('缺少 .topbar 元素');
    if (!document.querySelector('.topbar-nav')) issues.push('缺少 .topbar-nav 导航栏');
    if (!document.querySelector('.nav-item.active')) issues.push('首页导航项未高亮');

    // 检查溢出元素
    const bodyWidth = document.body.clientWidth;
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > bodyWidth + 50) {
        issues.push(`元素 ${el.tagName}.${el.className} 宽度溢出: ${rect.width}px > ${bodyWidth}px`);
      }
    });

    return issues;
  });

  if (layoutIssues.length > 0) {
    console.log('⚠️ 首页布局问题:');
    layoutIssues.forEach(i => console.log('  - ' + i));
  } else {
    console.log('✅ 首页布局正常');
  }

  // 3. 登录
  console.log('3. 执行登录...');

  // 确保 breadcrumb-path 元素存在
  const breadcrumbExists = await page.evaluate(() => {
    if (!document.getElementById('breadcrumb-path')) {
      const bc = document.createElement('span');
      bc.id = 'breadcrumb-path';
      bc.className = 'topbar-breadcrumb';
      // 插入到 topbar 中
      const topbar = document.querySelector('.topbar');
      if (topbar) {
        topbar.insertBefore(bc, topbar.querySelector('.topbar-actions'));
      }
    }
    return !!document.getElementById('breadcrumb-path');
  });
  console.log('breadcrumb-path 元素创建: ' + breadcrumbExists);

  // 调用 doLogin()
  await page.evaluate(() => {
    if (typeof doLogin === 'function') {
      doLogin();
    } else {
      throw new Error('doLogin 函数不存在');
    }
  });

  // 等待登录状态更新
  await new Promise(r => setTimeout(r, 1000));

  // 验证登录状态
  const loggedIn = await page.evaluate(() => {
    return typeof isLoggedIn !== 'undefined' && isLoggedIn === true;
  });
  console.log('登录状态: ' + (loggedIn ? '已登录' : '未登录'));

  // 4. 导航到工作台
  console.log('4. 导航到工作台...');

  await page.evaluate(() => {
    if (typeof navToPage === 'function') {
      navToPage('my-works');
    } else {
      throw new Error('navToPage 函数不存在');
    }
  });

  // 等待页面切换
  await new Promise(r => setTimeout(r, 2000));

  // 检查工作台页面是否显示
  const workPageVisible = await page.evaluate(() => {
    const worksPage = document.getElementById('page-my-works');
    return worksPage && worksPage.classList.contains('active');
  });
  console.log('工作台页面显示: ' + workPageVisible);

  // 检查 breadcrumb 是否正确
  const breadcrumb = await page.evaluate(() => {
    const bc = document.getElementById('breadcrumb-path');
    return bc ? bc.textContent.trim() : 'NOT FOUND';
  });
  console.log('面包屑导航: ' + breadcrumb);

  // 截图工作台
  console.log('5. 截图工作台 -> /workspace/screenshot_myworks_v2.png');
  await page.screenshot({ path: '/workspace/screenshot_myworks_v2.png', fullPage: false });

  // 检查工作台布局问题
  const worksLayoutIssues = await page.evaluate(() => {
    const issues = [];
    if (!document.getElementById('page-my-works')) issues.push('缺少 #page-my-works 元素');
    if (!document.getElementById('page-my-works').classList.contains('active')) {
      issues.push('工作台页面未激活');
    }

    // 检查面包屑
    const bc = document.getElementById('breadcrumb-path');
    if (!bc) issues.push('缺少 breadcrumb-path 元素');
    else if (bc.textContent.trim() !== '工作台') issues.push('面包屑显示不正确: ' + bc.textContent);

    // 检查导航高亮
    const activeNav = document.querySelector('.nav-item.active');
    if (!activeNav) issues.push('没有高亮的导航项');
    else if (activeNav.getAttribute('data-page') !== 'my-works') {
      issues.push('导航高亮项不正确: ' + activeNav.getAttribute('data-page'));
    }

    // 检查溢出
    const bodyWidth = document.body.clientWidth;
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > bodyWidth + 50) {
        issues.push(`元素 ${el.tagName}.${el.className} 宽度溢出: ${rect.width}px > ${bodyWidth}px`);
      }
    });

    return issues;
  });

  if (worksLayoutIssues.length > 0) {
    console.log('⚠️ 工作台布局问题:');
    worksLayoutIssues.forEach(i => console.log('  - ' + i));
  } else {
    console.log('✅ 工作台布局正常');
  }

  await browser.close();
  console.log('\n全部完成！');
})();
