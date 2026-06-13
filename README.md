<p align="center">
  <img src="public/favicon.svg" width="100" height="100" alt="Shiguang-Cover Logo">
</p>

<h1 align="center">Shiguang-Cover</h1>

<p align="center">优雅的在线封面生成工具</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/Shiguang-coding/Shiguang-Cover">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2FShiguang-coding%2FShiguang-Cover&output-directory=dist&install-command=npm%20install&build-command=npm%20run%20build" target="_blank" rel="noopener noreferrer">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="Deploy with EdgeOne Pages">
  </a>
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/Shiguang-coding/Shiguang-Cover">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />
  </a>
</p>
<p align="center">
  🎮 在线演示：<a href="https://cover.shiguang666.eu.org" target="_blank">https://cover.shiguang666.eu.org/</a>
</p>


---

## 📖 简介

Shiguang-Cover 是一个现代化的封面生成工具，专为博客、短视频、社交媒体设计。支持多种自定义选项，让你轻松创建个性化封面图片。

> 🍴 本项目基于 [JLinMr/Mini-Cover](https://github.com/JLinMr/Mini-Cover) 进行改造，现更名为 Shiguang-Cover。

![preview](https://img.shiguang666.eu.org/file/1781388236667_20260614060346279.webp)

## ✨ 特性

| 功能 | 说明 |
|------|------|
| 🌐 **网址获取图标** | 输入网址或域名，自动获取网站图标（Favicon） |
| 🎨 **多图标库支持** | [LobeHub Icons](https://lobehub.com/icons) · [theSVG](https://thesvg.org) · [Developer Icons](https://xandemon.github.io/developer-icons/) · [Iconify](https://icon-sets.iconify.design/) |
| ⚡ **快捷前缀** | 支持 `lobe:`、`svg:`、`dev:` 等前缀快速切换图标源 |
| 🎯 **智能配色** | 纯色图标自动提取主色调，背景使用互补色，标题和水印自动匹配图标颜色 |
| 🖼️ **拖拽上传** | 支持拖拽图片到画布区域，自动识别为背景图或图标 |
| 📐 **多格式导出** | 支持导出 WebP、PNG、JPG 多种格式 |
| 💧 **水印效果** | 实时预览水印效果，支持自定义文字和颜色 |
| 📱 **响应式设计** | 完美支持移动端，随时随地编辑 |
| ☁️ **图床集成** | 支持 CloudFlare ImgBed、CloudFlare R2、Lsky Pro 三种图床 |
| 📊 **统计可配置** | Umami 统计通过环境变量配置，未配置则不加载 |
| 📋 **ICP 备案号** | 通过环境变量配置，自动显示在页脚 |

## ⚙️ 配置说明

### 环境变量

项目所有环境变量均为可选，不配置即可正常使用。如需自定义，复制示例文件并填写：

```bash
cp .env.example .env
```

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_APP_TITLE` | 网站标题 | `Shiguang-Cover` |
| `VITE_APP_ICP_NUMBER` | ICP 备案号（选填） | `豫ICP备2025XXXXXXX号` |
| `VITE_APP_FONT_FAMILY` | 全局字体名称（选填） | `MaokenZhuyuanTi` |
| `VITE_APP_FONT_CSS_URL` | 全局字体 CSS 文件地址（选填） | [示例](#可用字体) |
| `VITE_UMAMI_SCRIPT_URL` | Umami 统计脚本地址（选填） | `https://umami.example.com/script.js` |
| `VITE_UMAMI_WEBSITE_ID` | Umami 网站 ID（选填） | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |

### 可用字体

| 字体名称 | 显示名称 | 说明 |
|----------|----------|------|
| `MaokenZhuyuanTi` | 猫啃珠圆体 | 需配合 CSS URL 使用 |
| `HarmonyOS_Regular` | 鸿蒙字体 | 需配合 CSS URL 使用 |
| `yozai` | 悠哉字体 | 需配合 CSS URL 使用 |
| `寒蝉全圆体` | 寒蝉全圆体 | 需配合 CSS URL 使用 |
| `Douyin Sans` | 抖音美好体 | 需配合 CSS URL 使用 |
| `Microsoft YaHei` | 微软雅黑 | 系统字体，无需 CSS URL |

### 默认配置

在 `src/config.js` 中可以修改默认文本和字体配置：

```javascript
export const defaultConfig = {
    text: '默认标题',
    watermark: '@水印文本',
    fontFamily: import.meta.env.VITE_APP_FONT_FAMILY,
    fontStyles: [ /* 字体 CSS 文件列表 */ ],
    fontOptions: [ /* 字体选项 */ ]
};
```

## 🚀 快速开始

### 环境准备

- Node.js >= 16.16.0
- NPM >= 8.15.0

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/Shiguang-coding/Shiguang-Cover.git

# 安装依赖
npm install

# 启动开发服务
npm run dev

# 构建生产版本
npm run build
```

构建产物在 `dist` 目录下，可以直接部署到任何静态资源服务器上。

## ☁️ CloudFlare R2 图床部署

> **为什么需要部署 Worker？**
>
> Shiguang-Cover 是浏览器 Web 应用，受浏览器同源策略（CORS）限制。CloudFlare R2 的 S3 API 不处理浏览器的 OPTIONS 预检请求（返回 405），导致所有跨域上传请求被浏览器拦截。
>
> Node.js / Electron 应用不受 CORS 限制，所以可以直接调用 R2 S3 API。Web 端必须通过 Worker 代理中转。

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

在 Shiguang-Cover 的图床设置中选择 CloudFlare R2：

| 字段 | 值 |
|------|-----|
| Worker 地址 | Worker 的访问地址，如 `https://r2-upload.xxx.workers.dev` |
| 授权 Token | 步骤 5 中设置的 AUTH_TOKEN |
| 公开访问地址 | 自定义域名（推荐）或 R2 桶的公开访问地址，如 `https://pub-xxx.r2.dev` |

> `worker/r2-upload.js` 通过 R2 Binding API（`env.MY_BUCKET.put()`）直接上传，无需 S3 签名，配置只需：桶绑定 + AUTH_TOKEN。

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

在 Shiguang-Cover 的图床设置中选择 Lsky Pro：

| 字段 | 值 |
|------|-----|
| 站点地址 | Lsky Pro 的访问地址，如 `https://lsky.example.com` |
| 邮箱 | Lsky Pro 账号的登录邮箱 |
| 密码 | Lsky Pro 账号的登录密码 |

> 💡 前端会自动调用 API 获取 Token 并上传，无需手动配置 Token。

## ❓ 常见问题

开发或部署过程中遇到问题，请查看 [故障排查文档](故障排查.md)。

## 📝 开源协议

[MIT License](LICENSE)
