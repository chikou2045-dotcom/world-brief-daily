# 世界晨报站点

这是一个无需构建步骤的静态网站。

## 本地预览

在此目录运行：

```bash
python3 -m http.server 4173
```

然后访问 `http://localhost:4173`。

## 每日数据

页面内容来自 `data/latest.js`。每日自动化会更新这个文件，首页布局和样式保持不变。

## 公开发布

这个目录可以直接部署到任意静态托管服务，例如 GitHub Pages、Cloudflare Pages、Netlify 或 Vercel。
