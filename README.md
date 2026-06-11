<p align="center">
  <img src="public/favicon.svg" width="100" height="100" alt="Mini-Cover Logo">
</p>

<h1 align="center">Mini-Cover</h1>

<p align="center">优雅的在线封面生成工具</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>
<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/Shiguang-coding/Mini-Cover">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2FShiguang-coding%2FMini-Cover&output-directory=dist&install-command=npm%20install&build-command=npm%20run%20build" target="_blank" rel="noopener noreferrer">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="Deploy with EdgeOne Pages">
  </a>
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/Shiguang-coding/Mini-Cover">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />
  </a>
</p>
<p align="center">🎮 在线演示：
  <a href="hhttps://cover.shiguang666.eu.org/" target="_blank">https://cover.shiguang666.eu.org/</a>
</p>

## 📖 简介

Mini-Cover 是一个现代化的封面生成工具，专为博客、短视频、社交媒体设计。支持多种自定义选项，让你轻松创建个性化封面图片。

> 🍴 本项目基于 [JLinMr/Mini-Cover](https://github.com/JLinMr/Mini-Cover) 进行改造。

## ✨ 改造内容

### 图标功能增强

- **网址获取图标**：输入网址或域名，自动获取网站图标（Favicon）
- **多图标库支持**：
  - [LobeHub Icons](https://lobehub.com/icons) — 高清品牌图标，支持多种变体（彩色、黑白、渐变等）
  - [theSVG](https://thesvg.org) — 丰富的 SVG 图标库
  - [Developer Icons](https://xandemon.github.io/developer-icons/) — 开发者常用图标
  - [Iconify](https://icon-sets.iconify.design/) — 集合了 100+ 图标库的统一 API
- **快捷前缀**：支持 `lobe:`、`svg:`、`dev:` 等前缀快速切换图标源

### 图床上传优化

- **获取直链**：设计封面后可一键获取图床直链，无需手动保存再上传
- **多格式复制**：支持 URL、Markdown、HTML、BBCode 等多种链接格式一键复制
- **多图床支持**：支持 CloudFlare ImgBed、CloudFlare R2、Lsky Pro（蓝空图床）三种图床
- **快速切换**：可在弹窗中快速切换图床类型

### 其他优化

- 密码输入框添加显示/隐藏切换按钮
- 优化 README 文档，补充配置说明

## ✨ 特性

- 📱 响应式设计，完美支持移动端
- 🎨 丰富的图标库，一键选用
- 🖼️ 自定义背景图片，支持拖拽上传
- ✍️ 灵活的标题编辑，多种字体可选
- 💫 水印效果调整，实时预览
- 🎯 简洁的操作界面，快速上手

## ⚙️ 配置说明

### 环境配置

网站基础内容通过修改 `.env` 文件自定义网站配置：

### 默认配置

在 `src/config.js` 中可以修改默认文本和字体配置：

```javascript
export const defaultConfig = {
    // 默认文本配置
    text: '默认标题',       
    watermark: '@水印文本', 

    // 字体配置
    fontFamily: import.meta.env.VITE_APP_FONT_FAMILY,
    
    // 可用字体样式列表
    fontStyles: [
        'https://font-cdn.com/font1.css',
        'https://font-cdn.com/font2.css',
        // ...
    ],
    
    // 字体选项
    fontOptions: [
        { value: 'default', label: '默认全局' },
        { value: 'Microsoft YaHei', label: '微软雅黑' },
        // ...
    ]
};
```

## 🚀 快速开始

### 环境准备

- Node.js >= 16.16.0
- NPM >= 8.15.0

### 开发调试

```bash
# 克隆项目

git clone https://github.com/Shiguang-coding/Mini-Cover.git

# 安装依赖
npm install

# 启动服务
npm run dev

# 构建生产版本
npm run build
```

构建产物在 `dist` 目录下，可以直接部署到任何静态资源服务器上。


## ☁️ CloudFlare R2 图床部署

### 为什么需要部署 Worker？

Mini-Cover 是浏览器 Web 应用，受浏览器同源策略（CORS）限制。CloudFlare R2 的 S3 API 不处理浏览器的 OPTIONS 预检请求（返回 405），导致所有跨域上传请求被浏览器拦截。

Node.js / Electron 应用不受 CORS 限制，所以可以直接调用 R2 S3 API。Web 端必须通过 Worker 代理中转。

### 部署步骤

**1. 创建 R2 存储桶**

登录 [CloudFlare Dashboard](https://dash.cloudflare.com/) → R2 Object Storage → 创建存储桶。

**2. 创建 R2 API Token**

R2 → 管理 R2 API 令牌 → 创建 API 令牌 → 权限选「对象读写」。记录 Access Key ID 和 Secret Access Key。

**3. 部署 Worker**

CloudFlare Dashboard → Workers & Pages → 创建应用程序 → 选择「Workers」→ 创建 Worker，将 `worker/r2-upload.js` 的代码粘贴进去。

**4. 绑定 R2 Bucket**

Workers & Pages → 你的应用 → 设置 → 函数绑定 → 添加绑定 → 选择「R2 存储桶」，变量名填 `R2_BUCKET`，选择你的桶。

**5. 设置环境变量**

Workers & Pages → 你的应用 → 设置 → 变量和机密 → 添加：

| 变量名 | 值 |
|--------|-----|
| `AUTH_TOKEN` | 自定义上传密码（前端填写此值） |
| `CUSTOM_DOMAIN` | **强烈推荐**，自定义域名如 `https://cdn.example.com` |

> ⚠️ **重要提示**：CloudFlare Workers 免费版有请求频率限制，长时间未使用的 Worker 可能进入冷启动状态导致响应缓慢。**强烈建议配置自定义域名**，不仅更稳定，还能避免 `*.workers.dev` 域名在部分地区被墙的问题。

**6. 配置自定义域名（推荐）**

Workers & Pages → 你的应用 → 设置 → 触发 → 添加自定义域名。配置后将自定义域名填入前端「公开访问地址」字段。

**7. 前端配置**

在 Mini-Cover 的图床设置中选择 CloudFlare R2：

| 字段 | 值 |
|------|-----|
| Worker 地址 | Worker 的访问地址，如 `https://r2-upload.xxx.workers.dev` |
| 授权 Token | 步骤 5 中设置的 AUTH_TOKEN |
| 公开访问地址 | 自定义域名（推荐）或 R2 桶的公开访问地址，如 `https://pub-xxx.r2.dev` |

### Worker 代码

`worker/r2-upload.js` 通过 R2 Binding API（`env.MY_BUCKET.put()`）直接上传，无需 S3 签名，配置只需：桶绑定 + AUTH_TOKEN。

## 🖼️ Lsky Pro（蓝空图床）配置

### 前提条件

Lsky Pro V2.1 的 API 路由需要排除 CSRF 验证，否则跨域 POST 请求（上传）会返回 419 错误。

### 服务端配置

进入 Lsky Pro 容器，编辑 `VerifyCsrfToken.php`：

```bash
# 查看容器名称
docker ps | grep lsky

# 编辑 CSRF 中间件（将容器名替换为你的实际名称）
docker exec <容器名> sed -i "s/protected \$except = \[\]/protected \$except = ['api\/*',]/" /var/www/html/app/Http/Middleware/VerifyCsrfToken.php

# 清除缓存
docker exec <容器名> php artisan config:clear
```

确认修改成功：

```bash
docker exec <容器名> cat /var/www/html/app/Http/Middleware/VerifyCsrfToken.php
```

应看到：

```php
protected $except = [
    'api/*',
];
```

### 前端配置

在 Mini-Cover 的图床设置中选择 Lsky Pro：

| 字段 | 值 |
|------|-----|
| 站点地址 | Lsky Pro 的访问地址，如 `https://lsky.example.com` |
| 邮箱 | Lsky Pro 账号的登录邮箱 |
| 密码 | Lsky Pro 账号的登录密码 |

> 💡 前端会自动调用 API 获取 Token 并上传，无需手动配置 Token。

## 📝 开源协议

[MIT License](LICENSE)
