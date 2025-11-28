#!/bin/bash

# PRISM 部署脚本（测试版本）
# 用途：构建并部署 PRISM 到 NUS 服务器的子目录

set -e

# 配置
NUS_USER="yfei11"
NUS_HOST="stu.comp.nus.edu.sg"
NUS_PATH="~/public_html/prism"
BUILD_DIR="out"

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}🚀 部署 PRISM 到 NUS 服务器${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# 检查分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "prism" ]; then
    echo -e "${YELLOW}⚠️  当前不在 prism 分支${NC}"
    echo "是否继续？(y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        echo "已取消"
        exit 0
    fi
fi

# 检查未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  有未提交的更改${NC}"
    echo "是否提交后继续？(y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        read -p "提交信息: " commit_msg
        git add .
        git commit -m "$commit_msg"
    fi
fi

# 1. 安装依赖
echo ""
echo -e "${BLUE}1️⃣  安装依赖...${NC}"
npm install

# 2. 构建项目
echo ""
echo -e "${BLUE}2️⃣  构建项目...${NC}"
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${YELLOW}❌ 构建失败：$BUILD_DIR 目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建成功${NC}"

# 3. 创建远程目录
echo ""
echo -e "${BLUE}3️⃣  创建远程目录...${NC}"
ssh "${NUS_USER}@${NUS_HOST}" "mkdir -p ${NUS_PATH}"

# 4. 上传文件
echo ""
echo -e "${BLUE}4️⃣  上传文件到 NUS 服务器...${NC}"
echo "请输入 NUS 密码："
scp -r ${BUILD_DIR}/* "${NUS_USER}@${NUS_HOST}:${NUS_PATH}/"

# 5. 设置权限
echo ""
echo -e "${BLUE}5️⃣  设置文件权限...${NC}"
ssh "${NUS_USER}@${NUS_HOST}" << EOF
chmod 755 ${NUS_PATH}
find ${NUS_PATH} -type d -exec chmod 755 {} \;
find ${NUS_PATH} -type f -exec chmod 644 {} \;
EOF

echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✨ 部署成功！${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${GREEN}🌐 访问测试版：${NC}"
echo "   https://www.comp.nus.edu.sg/~yfei11/prism/"
echo ""
echo -e "${YELLOW}💡 提示：${NC}"
echo "   - 如需部署为主站点，请参考 MIGRATION_PLAN.md"
echo "   - 旧版 Jekyll 站点仍在主目录运行"
echo ""
