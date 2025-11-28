# 🚀 快速开始 - 双分支迁移

**最后更新：** 2025年11月28日

---

## ⚡️ 立即开始（5分钟设置）

### 方式 1: 使用自动化脚本（推荐）

```bash
# 1. 运行初始化脚本（会自动创建 prism 分支）
cd /Users/sharkiefff/Desktop/2020dfff.github.io
./PRISM/scripts/setup_prism_branch.sh

# 2. 推送到 GitHub
git push -u origin prism

# 3. 安装依赖并测试
npm install
npm run dev
```

### 方式 2: 手动创建

```bash
# 1. 创建分支
git checkout -b prism

# 2. 清理 Jekyll 文件
rm -rf _data _includes _layouts _pages _posts _sass _site docs google_scholar_crawler
rm -f _config.yml Gemfile Gemfile.lock run_server.sh nus_deploy.sh

# 3. 移动 PRISM 到根目录
mv PRISM/* .
mv PRISM/.* . 2>/dev/null || true
rmdir PRISM

# 4. 提交并推送
git add .
git commit -m "feat: Initialize PRISM framework"
git push -u origin prism

# 5. 安装依赖
npm install
npm run dev
```

---

## 📁 分支说明

### `main` 分支（旧版 Jekyll）
```
✅ 当前线上运行版本
✅ 保持稳定，继续维护
✅ 随时可以回退
📍 URL: https://2020dfff.github.io
```

### `prism` 分支（新版 Next.js）
```
🚀 新开发版本
🔧 功能逐步迁移
🧪 测试和优化
📍 测试 URL: (待部署)
```

---

## 🔄 日常使用

### 快速切换分支

```bash
# 使用切换脚本（推荐）
./scripts/switch_branch.sh

# 或直接命令
git checkout main     # 切换到旧版
git checkout prism    # 切换到新版
```

### 更新旧站点（Jekyll）

```bash
# 1. 切换到 main 分支
git checkout main

# 2. 编辑内容
vim _pages/about.md

# 3. 测试
bundle exec jekyll serve

# 4. 提交
git add .
git commit -m "update: 更新内容"
git push origin main
```

### 开发新站点（PRISM）

```bash
# 1. 切换到 prism 分支
git checkout prism

# 2. 编辑内容
vim content/bio.md

# 3. 实时预览
npm run dev
# 访问 http://localhost:3000

# 4. 提交
git add .
git commit -m "feat: 添加新功能"
git push origin prism
```

---

## 📝 内容编辑位置

### PRISM 版本（prism 分支）

| 内容 | 文件位置 | 格式 |
|------|----------|------|
| 个人信息 | `content/config.toml` | TOML |
| 关于我 | `content/bio.md` | Markdown |
| 论文列表 | `content/publications.bib` | BibTeX |
| 新闻动态 | `content/news.toml` | TOML |
| 获奖经历 | `content/awards.toml` | TOML |
| 教育背景 | `content/education.toml` | TOML |
| 研究经历 | `content/research.toml` | TOML |
| 实习经历 | `content/internships.toml` | TOML |
| 项目经历 | `content/projects.toml` | TOML |
| 简历 | `content/cv.md` | Markdown |

### Jekyll 版本（main 分支）

| 内容 | 文件位置 |
|------|----------|
| 配置 | `_config.yml` |
| 关于我 | `_pages/about.md` |
| 教育背景 | `_pages/education.md` |
| 论文发表 | `_pages/publications.md` |
| 其他页面 | `_pages/*.md` |
| 博客文章 | `_posts/*.md` |

---

## 🚀 部署

### 部署测试版（PRISM）

```bash
# 切换到 prism 分支
git checkout prism

# 部署到 NUS 服务器子目录
./scripts/deploy_prism_to_nus.sh

# 访问测试版
# https://www.comp.nus.edu.sg/~yfei11/prism/
```

### 部署正式版（选择一个）

**选项 1: 保持 Jekyll（推荐在完全测试前）**
```bash
# 不做任何改变，main 分支继续部署
```

**选项 2: 切换到 PRISM**
```bash
# 在 GitHub Settings > Pages
# 将 Source 从 main 改为 prism
```

**选项 3: 替换 main 分支（永久切换）**
```bash
# ⚠️ 慎重！会替换 main 分支内容
# 先备份
git checkout main
git branch main-jekyll-backup

# 用 prism 替换 main
git checkout prism
git branch -D main
git checkout -b main
git push origin main --force
```

---

## 🛠️ 实用命令

### 查看分支

```bash
git branch              # 本地分支
git branch -r           # 远程分支
git branch -a           # 所有分支
```

### 比较分支

```bash
# 查看文件差异
git diff main prism --stat

# 查看具体文件差异
git diff main prism -- content/bio.md
```

### 同步更新

```bash
# 从 main 同步特定文件到 prism
git checkout prism
git checkout main -- _pages/publications.md

# 或使用 cherry-pick
git cherry-pick <commit-hash>
```

### 暂存更改

```bash
# 暂存当前更改
git stash

# 切换分支
git checkout main

# 恢复更改
git checkout prism
git stash pop
```

---

## ❓ 常见问题

### Q: 如何在两个版本间切换？
**A:** 使用脚本 `./scripts/switch_branch.sh` 或 `git checkout main/prism`

### Q: 更新了 main 分支，如何同步到 prism？
**A:** 
```bash
git checkout prism
git merge main
# 或选择性合并
git checkout main -- path/to/file
```

### Q: PRISM 出问题了，如何快速回退？
**A:** 
```bash
# GitHub Pages: 在 Settings 改回 main 分支
# NUS: 删除 prism 子目录即可，主目录仍是旧版
```

### Q: 如何知道我在哪个分支？
**A:**
```bash
git branch --show-current
# 或在终端提示符中显示（需配置）
```

### Q: 能同时运行两个版本吗？
**A:** 可以！
- 主站: Jekyll (main) - https://2020dfff.github.io
- 测试站: PRISM (prism) - https://2020dfff.github.io/prism/ (子目录)

---

## 📊 迁移进度跟踪

在 `MIGRATION_PLAN.md` 中查看详细的迁移计划和进度。

### 当前状态

- [x] 创建双分支方案
- [x] 编写部署脚本
- [ ] 基础配置迁移
- [ ] 内容迁移
- [ ] 功能开发
- [ ] 测试部署
- [ ] 正式上线

---

## 📞 需要帮助？

1. **查看完整迁移计划**: `cat MIGRATION_PLAN.md`
2. **PRISM 文档**: `cat README.md`
3. **Git 帮助**: `git --help`

---

## ✅ 检查清单

开始前确认：

- [ ] Git 仓库状态正常
- [ ] 已安装 Node.js (≥22.0.0)
- [ ] 已安装 npm
- [ ] main 分支已推送到 GitHub
- [ ] 了解基本的 Git 操作

准备好了？运行：
```bash
./PRISM/scripts/setup_prism_branch.sh
```

开始迁移！🚀
