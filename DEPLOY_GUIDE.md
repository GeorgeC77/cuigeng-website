# 个人主页部署到自定义域名 — 完整指南

你的项目是一个基于 **Vite + React** 的纯静态网站。`dist.zip` 已经是构建好的产物，可以直接部署。

`vite.config.ts` 中配置了 `base: './'`，这意味着所有资源路径都是相对的，**非常适合自定义域名部署**。

---

## 方案一：GitHub Pages + 自定义域名（⭐ 最简单、免费、国际访问好）

**不需要使用 `env_Part`，5分钟搞定。**

### 步骤

1. **创建 GitHub 仓库**
   - 在 GitHub 新建一个仓库，比如 `cuigeng-website`

2. **上传 `dist` 文件夹内容到仓库**
   - 解压 `dist.zip`，将 `dist` 文件夹内的所有文件（不是 dist 文件夹本身）推送到仓库
   - 或者推送到仓库的 `gh-pages` 分支

3. **开启 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 `main` 或 `gh-pages`，文件夹选 `/ (root)`

4. **绑定自定义域名**
   - 在仓库根目录创建 `CNAME` 文件，内容写你的域名，例如：
     ```
     www.cuigeng.com
     ```
   - 在你的域名 DNS 服务商处添加 CNAME 记录：
     - 主机记录：`www`
     - 记录值：`<你的GitHub用户名>.github.io`
   - 等待 DNS 生效（通常几分钟到几小时）

5. **开启 HTTPS**
   - GitHub Pages 支持自动 HTTPS，在 Pages 设置里勾选 "Enforce HTTPS"

### 优点
- 完全免费
- 自动 HTTPS
- 全球 CDN 加速
- 每次推送到仓库自动重新部署

### 缺点
- 国内访问速度一般（学术/国际受众不受影响）
- 如果域名没有备案，在国内某些网络环境下可能不稳定

---

## 方案二：国内云存储 + CDN（国内访问快，需付费和备案）

适合面向国内用户的场景。需要：
- 已**备案**的自定义域名（如果服务器在国内）
- 云存储服务（阿里云 OSS / 腾讯云 COS / 百度云 BOS）

### 使用 `env_Part` 虚拟环境自动部署

你的 `env_Part` 中有 `baidubce` SDK，可以用来部署到**百度智能云 BOS**。我也提供了阿里云 OSS 的脚本模板。

#### 1. 激活虚拟环境

```bash
# Windows CMD
e:\python_project\Part\env_Part\Scripts\activate.bat

# Windows PowerShell
e:\python_project\Part\env_Part\Scripts\Activate.ps1

# Git Bash / MSYS2
source /e/python_project/Part/env_Part/Scripts/activate
```

#### 2. 配置部署脚本

我已经为你创建了部署脚本，见 `deploy_baidu.py`。

**百度云 BOS 部署脚本**（推荐，因为 env_Part 已有 SDK）：

```bash
python deploy_baidu.py
```

使用前需要修改脚本中的：
- `access_key_id`
- `secret_access_key`
- `bucket_name`
- `endpoint`

### 通用云存储部署步骤

1. 购买云存储服务（阿里云 OSS / 腾讯云 COS / 百度云 BOS）
2. 创建存储桶（Bucket），设置为**公共读**
3. 获取 Access Key 和 Secret Key
4. 运行部署脚本上传 `dist` 文件夹
5. 绑定自定义域名到存储桶
6. 配置 CDN（可选，但强烈建议）
7. 在 CDN/存储桶配置中开启 HTTPS

---

## 方案三：Vercel / Netlify / Cloudflare Pages（免费、功能强）

和 GitHub Pages 类似，但部署体验更好：

- **Vercel**: `npm i -g vercel` → `vercel --prod`
- **Netlify**: 拖拽 `dist` 文件夹到 netlify.com
- **Cloudflare Pages**: 连接 GitHub 仓库自动部署

这些平台都支持自定义域名和自动 HTTPS。

---

## 当前项目状态检查

```bash
# 解压 dist 查看构建产物
unzip -q cuigeng-website-dist.zip
# dist 文件夹就是完整的网站，包含 index.html 和所有资源
```

`dist/index.html` 已经正确引用了相对路径的资源：
```html
<script type="module" crossorigin src="./assets/index-DnxxHyjQ.js"></script>
<link rel="stylesheet" crossorigin href="./assets/index-nrAP1YpR.css">
```

这意味着你可以把 `dist` 文件夹的内容放到任何静态托管服务的根目录下，都能正常运行。

---

## 推荐方案总结

| 场景 | 推荐方案 | 是否需要 env_Part |
|------|---------|------------------|
| 免费、简单、国际学术访问 | GitHub Pages | ❌ 不需要 |
| 免费、自动部署、功能强 | Vercel / Netlify | ❌ 不需要 |
| 国内访问快、已备案域名 | 阿里云/腾讯云/百度云 + CDN | ✅ 可以用脚本 |
| 纯测试/局域网演示 | Python FastAPI 静态服务器 | ✅ 需要 |

---

## 常见问题

**Q: 我需要重新构建吗？**
A: 不需要。`dist.zip` 已经是完整构建产物。但如果你修改了源码，需要重新构建：
```bash
cd src_directory
npm install
npm run build
# 生成的 dist 文件夹就是新的部署包
```

**Q: 自定义域名需要什么配置？**
A: 核心是在 DNS 服务商处添加 CNAME 记录指向你的托管服务。具体记录值取决于你选择的平台。

**Q: 国内访问 GitHub Pages 很慢怎么办？**
A: 使用国内云存储 + CDN 方案，或 Cloudflare Pages（有全球 CDN，国内比 GitHub Pages 稍好）。
