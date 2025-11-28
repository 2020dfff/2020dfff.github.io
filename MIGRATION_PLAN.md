# 双分支维护方案 - Jekyll to PRISM 迁移计划

**创建日期：** 2025年11月28日  
**项目：** 个人学术主页迁移

---

## 📋 分支策略

### 分支结构

```
main (默认分支)
├── 维护 Jekyll 旧版站点
├── 当前线上运行版本
├── 稳定且经过验证
└── GitHub Pages 部署: https://2020dfff.github.io

prism (新开发分支)
├── 基于 PRISM 框架的新版站点
├── 使用 Next.js + TypeScript + Tailwind
├── 逐步迁移和完善功能
└── 测试部署: https://2020dfff.github.io/prism/ (可选)
```

---

## 🎯 实施步骤

### Phase 1: 分支创建与初始化（当天完成）

#### Step 1.1: 创建 prism 分支
```bash
# 基于当前 main 分支创建新分支
git checkout -b prism

# 验证分支创建成功
git branch
```

#### Step 1.2: 清理 prism 分支
```bash
# 在 prism 分支中，保留 PRISM 目录，移除 Jekyll 相关文件
# 保留以下文件：
# - README.md (更新为 PRISM 说明)
# - LICENSE
# - .gitignore
# - PRISM/ (移到根目录)

# 删除 Jekyll 相关文件
rm -rf _config.yml _data/ _includes/ _layouts/ _pages/ _posts/ _sass/ _site/
rm -rf assets/ docs/ google_scholar_crawler/
rm -rf Gemfile Gemfile.lock run_server.sh nus_deploy.sh
rm -rf CNAME robots.txt google2c751e3971b23be9.html

# 将 PRISM 目录内容移到根目录
mv PRISM/* .
mv PRISM/.* . 2>/dev/null || true
rmdir PRISM

# 创建 .gitignore (如果需要)
# 提交初始版本
git add .
git commit -m "feat: Initialize PRISM framework migration"
```

#### Step 1.3: 推送到远程
```bash
# 推送 prism 分支到 GitHub
git push -u origin prism
```

---

### Phase 2: 内容迁移（1-2周）

#### 迁移清单

##### ✅ 基础配置
- [ ] `content/config.toml` - 个人信息、社交链接、导航
- [ ] `content/bio.md` - 个人简介
- [ ] `public/` - 头像、favicon 等资源

##### ✅ 简单页面 (Card 类型)
- [ ] `content/news.toml` - 新闻动态
- [ ] `content/awards.toml` - 获奖经历
- [ ] `content/education.toml` - 教育背景
- [ ] `content/teaching.toml` - 教学经历（如需要）
- [ ] `content/services.toml` - 服务经历（如需要）

##### ✅ 复杂页面
- [ ] `content/publications.bib` - 论文列表（从 Google Scholar 导出）
- [ ] `content/research.toml` - 研究经历（转为 card 格式）
- [ ] `content/internships.toml` - 实习经历（需自定义 logo 支持）
- [ ] `content/projects.toml` - 项目经历
- [ ] `content/cv.md` - 简历

##### 🔧 功能扩展
- [ ] 博客系统（需自行开发）
  - [ ] 创建 `content/posts/` 目录
  - [ ] 开发 BlogList 和 BlogPost 组件
  - [ ] 实现路由系统
  - [ ] 迁移现有博客文章
- [ ] 访客统计（可选）
  - [ ] ClusterMaps 集成
- [ ] 自定义组件
  - [ ] Logo 支持 (internships)
  - [ ] 时间线组件（可选）

##### 📦 资源迁移
- [ ] `/images/` → `/public/images/`
- [ ] `/papers/` → `/public/papers/` (如有)
- [ ] Favicon 和其他图标

---

### Phase 3: 本地测试与优化（3-5天）

#### 开发环境设置
```bash
# 切换到 prism 分支
git checkout prism

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

#### 测试清单
- [ ] 所有页面正常显示
- [ ] 导航链接正确
- [ ] 响应式设计（手机、平板、桌面）
- [ ] 深色模式切换
- [ ] 论文搜索和筛选
- [ ] 外部链接正常
- [ ] 图片资源加载

---

### Phase 4: 部署策略

#### 方案 A: GitHub Pages 双分支部署（推荐）

**主站点 (main 分支):**
```
URL: https://2020dfff.github.io
分支: main
保持: Jekyll 旧版
```

**测试站点 (prism 分支 - 使用 gh-pages):**
```bash
# 在 prism 分支中构建
npm run build

# 部署到 gh-pages 分支（可以用 gh-pages 包）
npm install -g gh-pages

# 部署 out/ 目录到 gh-pages 分支
gh-pages -d out -b gh-pages

# 或手动部署
git checkout --orphan gh-pages
cp -r out/* .
git add .
git commit -m "Deploy PRISM version"
git push origin gh-pages
```

**访问测试版：**
- 在 GitHub Settings > Pages 中选择 `gh-pages` 分支
- 测试 URL: `https://2020dfff.github.io` (切换后)

#### 方案 B: NUS 服务器双版本部署

```bash
# Jekyll 版本（现有）
~/public_html/         # 主站点

# PRISM 版本（新）
~/public_html/prism/   # 测试版本

# 部署脚本
#!/bin/bash
# deploy_prism_to_nus.sh

echo "构建 PRISM 站点..."
npm run build

echo "上传到 NUS 服务器..."
scp -r out/* yfei11@stu.comp.nus.edu.sg:~/public_html/prism/

echo "设置权限..."
ssh yfei11@stu.comp.nus.edu.sg << 'EOF'
chmod 755 ~/public_html/prism
find ~/public_html/prism -type d -exec chmod 755 {} \;
find ~/public_html/prism -type f -exec chmod 644 {} \;
EOF

echo "部署完成！"
echo "测试地址: https://www.comp.nus.edu.sg/~yfei11/prism/"
```

#### 方案 C: Cloudflare Pages（最简单，推荐测试用）

```bash
# 1. 注册 Cloudflare Pages
# 2. 连接 GitHub 仓库
# 3. 选择 prism 分支
# 4. 构建设置：
#    - Build command: npm run build
#    - Build output: out
# 5. 部署后获得测试 URL: https://your-site.pages.dev
```

---

## 🔄 日常工作流程

### 更新旧站点 (Jekyll)
```bash
# 1. 切换到 main 分支
git checkout main

# 2. 编辑内容
vim _pages/about.md

# 3. 本地测试
bundle exec jekyll serve

# 4. 提交并部署
git add .
git commit -m "update: xxx"
git push origin main

# GitHub Pages 自动部署
```

### 开发新站点 (PRISM)
```bash
# 1. 切换到 prism 分支
git checkout prism

# 2. 编辑内容
vim content/bio.md

# 3. 本地测试
npm run dev

# 4. 提交
git add .
git commit -m "feat: xxx"
git push origin prism

# 手动部署到测试环境（如需要）
npm run build
# 上传 out/ 目录
```

### 同步重要更新
```bash
# 如果 main 分支有重要内容更新，需要同步到 prism
git checkout prism
git checkout main -- _pages/publications.md  # 选择性合并文件

# 或使用 cherry-pick
git cherry-pick <commit-hash>
```

---

## 📊 切换策略

### 何时切换到 PRISM？

**切换条件清单：**
- [ ] 所有核心内容已迁移
- [ ] 所有页面功能正常
- [ ] 响应式设计完善
- [ ] 至少 2 周的测试期
- [ ] 至少 5 人用户反馈良好
- [ ] SEO 配置完成
- [ ] 性能测试通过（Lighthouse > 90）

### 正式切换步骤

#### 方式 1: 使用 GitHub Pages 默认分支切换
```bash
# 1. 在 GitHub Settings > Pages 中
#    将 Source 从 main 改为 prism

# 2. 等待部署完成（2-3分钟）

# 3. 验证主站点
#    https://2020dfff.github.io

# 4. 如果有问题，立即切换回 main
```

#### 方式 2: 合并到 main（永久切换）
```bash
# ⚠️ 这会替换 main 分支的内容

# 1. 备份当前 main
git checkout main
git branch main-jekyll-backup

# 2. 用 prism 替换 main
git checkout prism
git branch -D main
git checkout -b main
git push origin main --force

# 3. 保留 prism 分支继续开发
git push origin prism
```

#### 方式 3: NUS 服务器切换
```bash
# 备份旧版
ssh yfei11@stu.comp.nus.edu.sg
mv ~/public_html ~/public_html.jekyll.backup
mv ~/public_html/prism ~/public_html

# 回滚（如需要）
mv ~/public_html ~/public_html.prism
mv ~/public_html.jekyll.backup ~/public_html
```

---

## 🛡️ 风险管理

### 回退方案

**如果新站点出现问题：**

1. **立即回退到 Jekyll 版本**
   ```bash
   # GitHub Pages: 在 Settings 中切换回 main 分支
   # NUS: 执行回滚脚本
   ```

2. **保留两个版本同时运行**
   - 主站: Jekyll (main)
   - 测试站: PRISM (prism 或子目录)

3. **问题修复后再次尝试**

### 备份策略

- ✅ main 分支永久保留 Jekyll 版本
- ✅ prism 分支持续开发新版本
- ✅ 定期创建 tag 标记重要版本
  ```bash
  # 创建版本标记
  git tag -a v1.0.0-jekyll -m "Jekyll version stable"
  git tag -a v2.0.0-prism-beta -m "PRISM beta version"
  git push origin --tags
  ```

---

## 📈 迁移时间表

| 阶段 | 任务 | 预计时间 | 状态 |
|------|------|----------|------|
| **Week 1** | 分支创建、基础配置 | 1-2天 | ⏳ 待开始 |
| **Week 1-2** | 简单页面迁移 | 2-3天 | ⏳ 待开始 |
| **Week 2** | 论文列表转换 | 1天 | ⏳ 待开始 |
| **Week 2-3** | 复杂页面迁移 | 2-3天 | ⏳ 待开始 |
| **Week 3-4** | 博客系统开发（可选） | 3-5天 | ⏳ 待开始 |
| **Week 4** | 样式调整和优化 | 2-3天 | ⏳ 待开始 |
| **Week 4-5** | 测试和修复 | 3-5天 | ⏳ 待开始 |
| **Week 5** | 部署测试版 | 1天 | ⏳ 待开始 |
| **Week 6+** | 收集反馈、持续优化 | 持续 | ⏳ 待开始 |

**总计：约 4-6 周完成迁移**

---

## 🎯 下一步行动

### 立即执行（今天）

1. **创建 prism 分支**
   ```bash
   git checkout -b prism
   ```

2. **清理和初始化**
   - 移除 Jekyll 文件
   - 移动 PRISM 到根目录
   - 初始提交

3. **推送到远程**
   ```bash
   git push -u origin prism
   ```

### 本周任务

- [ ] 完成基础配置 (`config.toml`)
- [ ] 迁移个人简介 (`bio.md`)
- [ ] 转换新闻动态 (`news.toml`)
- [ ] 测试本地开发环境

### 下周任务

- [ ] 创建 `publications.bib`
- [ ] 转换教育背景
- [ ] 转换研究/实习经历
- [ ] 部署测试版本

---

## 📞 支持和帮助

如果遇到问题：

1. **查看 PRISM 文档**
   - `/PRISM/README.md`
   - `/PRISM/docs/`

2. **Git 分支管理**
   ```bash
   git branch          # 查看本地分支
   git branch -r       # 查看远程分支
   git checkout main   # 切换回旧版
   git checkout prism  # 切换到新版
   ```

3. **随时回滚**
   - main 分支始终保持稳定
   - 可以随时切换回去

---

## ✅ 总结

**这个方案的优势：**
- ✅ 零风险 - 旧站点持续运行
- ✅ 灵活性 - 可以慢慢完善
- ✅ 可回退 - 随时切换回旧版
- ✅ 并行维护 - 两个版本都可更新
- ✅ 渐进式 - 逐步迁移功能

**开始迁移！** 🚀
