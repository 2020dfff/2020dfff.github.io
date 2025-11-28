#!/bin/bash

# PRISM 分支初始化脚本
# 用途：从 main 分支创建全新的 prism 分支

set -e  # 遇到错误立即退出

echo "🌳 开始创建 PRISM 分支..."
echo "================================"

# 确保在项目根目录
if [ ! -f "_config.yml" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  警告：有未提交的更改"
    echo "是否继续？(y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        echo "已取消"
        exit 0
    fi
fi

# 保存当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 当前分支: $CURRENT_BRANCH"

# 创建 prism 分支
echo ""
echo "1️⃣  创建 prism 分支..."
git checkout -b prism 2>/dev/null || git checkout prism

# 删除 Jekyll 相关文件
echo ""
echo "2️⃣  清理 Jekyll 文件..."

# 删除目录
rm -rf _data _includes _layouts _pages _posts _sass _site docs google_scholar_crawler sharkiefff.xyz_jks publications

# 删除文件
rm -f _config.yml Gemfile Gemfile.lock run_server.sh nus_deploy.sh
rm -f google2c751e3971b23be9.html seo_guide.md robots.txt CNAME

echo "   ✅ Jekyll 文件已清理"

# 移动 PRISM 文件到根目录
echo ""
echo "3️⃣  移动 PRISM 文件到根目录..."

if [ -d "PRISM" ]; then
    # 移动所有文件
    mv PRISM/* . 2>/dev/null || true
    mv PRISM/.* . 2>/dev/null || true
    
    # 删除空目录
    rmdir PRISM 2>/dev/null || true
    
    echo "   ✅ PRISM 文件已移动"
else
    echo "   ⚠️  PRISM 目录不存在，跳过"
fi

# 创建 .gitignore（如果不存在）
echo ""
echo "4️⃣  检查 .gitignore..."
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF
    echo "   ✅ .gitignore 已创建"
else
    echo "   ✅ .gitignore 已存在"
fi

# 更新 README
echo ""
echo "5️⃣  更新 README..."
cat > README.md << 'EOF'
# Personal Academic Website - PRISM Version

This is the PRISM (Next.js) version of my personal academic website.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
├── content/          # All content (TOML, Markdown, BibTeX)
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js app router
│   ├── components/   # React components
│   ├── lib/          # Utilities
│   └── types/        # TypeScript types
└── ...
```

## 📝 Content Management

All content is managed through files in the `content/` directory:

- `config.toml` - Site configuration
- `bio.md` - About me
- `publications.bib` - Publications (BibTeX format)
- `news.toml` - News items
- Other TOML files for different pages

## 🌳 Branch Strategy

- `main` - Old Jekyll version (stable)
- `prism` - New PRISM version (this branch)

## 📖 Documentation

- [PRISM Documentation](docs/)
- [Migration Plan](MIGRATION_PLAN.md)

## 📄 License

MIT License
EOF
echo "   ✅ README 已更新"

# 提交更改
echo ""
echo "6️⃣  提交初始版本..."
git add .
git commit -m "feat: Initialize PRISM framework

- Remove Jekyll files
- Move PRISM to root directory
- Update README and .gitignore
- Set up Next.js project structure"

echo ""
echo "================================"
echo "✨ PRISM 分支创建成功！"
echo ""
echo "📝 下一步："
echo "   1. 推送到远程："
echo "      git push -u origin prism"
echo ""
echo "   2. 安装依赖并测试："
echo "      npm install"
echo "      npm run dev"
echo ""
echo "   3. 开始内容迁移"
echo ""
echo "💡 提示："
echo "   - 随时可以切换回旧版: git checkout main"
echo "   - 查看分支: git branch"
echo "   - 查看迁移计划: cat MIGRATION_PLAN.md"
echo ""
