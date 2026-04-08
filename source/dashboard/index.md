---
layout: false
title: 后台管理系统
---
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>后台管理系统</title>
  
  <!-- 🔥 关键：引入 API 配置 -->
  <script src="/hexo/dashboard/config.js"></script>
  
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .header h1 { color: #333; margin-bottom: 10px; }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 10px;
    }
    .status.ok { background: #d4edda; color: #155724; }
    .status.error { background: #f8d7da; color: #721c24; }
    .btn-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .btn {
      padding: 12px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
    .btn:active { transform: translateY(0); }
    .output {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      font-family: monospace;
      font-size: 13px;
      max-height: 300px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .loading { text-align: center; color: #666; padding: 40px; }
    .error-msg { color: #721c24; background: #f8d7da; padding: 15px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎛️ 后台管理系统</h1>
      <p style="color: #666;">Hexo Blog Admin Panel</p>
      <div id="connectionStatus" class="status">🔄 连接中...</div>
    </div>

    <div id="app">
      <div class="loading">初始化中，请稍候...</div>
    </div>

    <div class="btn-group">
      <button class="btn" onclick="testHealth()">🔍 健康检查</button>
      <button class="btn" onclick="testAnnouncements()">📢 测试公告</button>
      <button class="btn" onclick="testComments()">💬 测试评论</button>
      <button class="btn" onclick="publishTestPost()">📝 发布测试文章</button>
    </div>

    <div id="output" class="output">等待操作...</div>
  </div>

  <script>
    const output = document.getElementById('output');
    const statusEl = document.getElementById('connectionStatus');

    function log(msg, type = 'info') {
      const time = new Date().toLocaleTimeString();
      output.innerHTML = `[${time}] ${msg}\n` + output.innerHTML;
    }

    async function init() {
      try {
        log(`🔗 连接 Workers: ${window.API_BASE}`);
        
        const health = await window.BlogAPI.request('/health');
        statusEl.className = 'status ok';
        statusEl.innerHTML = `✅ 在线 | KV: ${health.kv_bound ? '✓' : '✗'}`;
        
        log('✅ API 连接成功');
        log(`📦 KV 绑定: ${health.kv_bound ? '正常' : '未绑定'}`);
        
        document.getElementById('app').innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <p style="font-size: 18px; margin-bottom: 10px;">🎉 系统正常</p>
            <p style="color: #666; font-size: 14px;">
              Workers: ${window.API_BASE}<br>
              博客: ${location.origin}
            </p>
          </div>
        `;
        
      } catch (error) {
        statusEl.className = 'status error';
        statusEl.innerHTML = '❌ 连接失败';
        log(`🔥 错误: ${error.message}`, 'error');
        document.getElementById('app').innerHTML = `
          <div class="error-msg">
            <strong>连接失败</strong><br>
            请检查：<br>
            1. Workers 是否部署成功<br>
            2. 域名 hexiaoyiok.dpdns.org 是否生效<br>
            3. BLOG_KV 是否正确绑定
          </div>
        `;
      }
    }

    async function testHealth() {
      try {
        const res = await window.BlogAPI.request('/health');
        log('健康检查: ' + JSON.stringify(res, null, 2));
      } catch (e) { log('❌ ' + e.message, 'error'); }
    }

    async function testAnnouncements() {
      try {
        const data = await window.BlogAPI.announcements.get();
        log('公告列表: ' + JSON.stringify(data, null, 2));
      } catch (e) { log('❌ ' + e.message, 'error'); }
    }

    async function testComments() {
      try {
        const data = await window.BlogAPI.comments.get();
        log('评论列表: ' + JSON.stringify(data, null, 2));
      } catch (e) { log('❌ ' + e.message, 'error'); }
    }

    async function publishTestPost() {
      try {
        log('📤 发布测试文章...');
        const res = await window.BlogAPI.posts.create({
          title: '测试文章-' + Date.now(),
          content: '这是一篇通过后台发布的测试文章。\n\n如果看到这篇内容，说明发布流程正常！',
          category: '测试',
          tag: 'auto-test'
        });
        log('✅ 发布响应: ' + JSON.stringify(res, null, 2));
        log('🔍 请检查 GitHub Actions 是否触发构建...');
      } catch (e) { log('❌ ' + e.message, 'error'); }
    }

    // 页面加载时初始化
    window.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>
