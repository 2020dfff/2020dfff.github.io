#!/bin/bash

# 快速分支切换脚本
# 用途：快速在 main 和 prism 分支之间切换

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示当前状态
show_status() {
    CURRENT_BRANCH=$(git branch --show-current)
    echo -e "${BLUE}================================${NC}"
    echo -e "${GREEN}📍 当前分支: ${YELLOW}$CURRENT_BRANCH${NC}"
    
    # 显示分支说明
    if [ "$CURRENT_BRANCH" = "main" ]; then
        echo -e "${GREEN}📖 Jekyll 旧版本 (稳定)${NC}"
    elif [ "$CURRENT_BRANCH" = "prism" ]; then
        echo -e "${GREEN}🚀 PRISM 新版本 (开发中)${NC}"
    fi
    
    # 检查未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  有未提交的更改${NC}"
        git status --short
    else
        echo -e "${GREEN}✅ 工作区干净${NC}"
    fi
    echo -e "${BLUE}================================${NC}"
}

# 切换到指定分支
switch_to() {
    TARGET_BRANCH=$1
    CURRENT_BRANCH=$(git branch --show-current)
    
    if [ "$CURRENT_BRANCH" = "$TARGET_BRANCH" ]; then
        echo -e "${YELLOW}已经在 $TARGET_BRANCH 分支${NC}"
        return
    fi
    
    # 检查未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  有未提交的更改${NC}"
        echo "请选择操作："
        echo "  1) 提交更改后切换"
        echo "  2) 暂存更改后切换 (stash)"
        echo "  3) 放弃更改后切换 (危险！)"
        echo "  4) 取消"
        read -p "请输入选项 (1-4): " choice
        
        case $choice in
            1)
                echo "请输入提交信息："
                read -p "> " commit_msg
                git add .
                git commit -m "$commit_msg"
                ;;
            2)
                git stash save "Auto stash before switching to $TARGET_BRANCH"
                echo -e "${GREEN}✅ 更改已暂存${NC}"
                ;;
            3)
                echo -e "${RED}⚠️  确认放弃所有更改？(yes/no)${NC}"
                read -p "> " confirm
                if [ "$confirm" = "yes" ]; then
                    git reset --hard
                    git clean -fd
                    echo -e "${GREEN}✅ 更改已放弃${NC}"
                else
                    echo "已取消"
                    return
                fi
                ;;
            *)
                echo "已取消"
                return
                ;;
        esac
    fi
    
    # 切换分支
    echo -e "${BLUE}🔄 切换到 $TARGET_BRANCH 分支...${NC}"
    git checkout "$TARGET_BRANCH"
    
    # 拉取最新更改
    echo -e "${BLUE}📥 拉取最新更改...${NC}"
    git pull origin "$TARGET_BRANCH" || echo -e "${YELLOW}⚠️  拉取失败（可能是新分支）${NC}"
    
    echo -e "${GREEN}✅ 成功切换到 $TARGET_BRANCH 分支！${NC}"
    
    # 显示分支特定提示
    if [ "$TARGET_BRANCH" = "main" ]; then
        echo ""
        echo -e "${BLUE}📖 Jekyll 开发提示：${NC}"
        echo "   - 启动开发服务器: bundle exec jekyll serve"
        echo "   - 部署到 NUS: ./nus_deploy.sh"
    elif [ "$TARGET_BRANCH" = "prism" ]; then
        echo ""
        echo -e "${BLUE}🚀 PRISM 开发提示：${NC}"
        echo "   - 安装依赖: npm install"
        echo "   - 启动开发服务器: npm run dev"
        echo "   - 构建: npm run build"
    fi
}

# 主菜单
show_menu() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${GREEN}🌳 分支切换工具${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    show_status
    echo ""
    echo "请选择操作："
    echo "  1) 切换到 main (Jekyll 旧版)"
    echo "  2) 切换到 prism (PRISM 新版)"
    echo "  3) 查看所有分支"
    echo "  4) 显示分支差异"
    echo "  5) 退出"
    echo ""
    read -p "请输入选项 (1-5): " choice
    
    case $choice in
        1)
            switch_to "main"
            ;;
        2)
            switch_to "prism"
            ;;
        3)
            echo ""
            echo -e "${BLUE}本地分支：${NC}"
            git branch
            echo ""
            echo -e "${BLUE}远程分支：${NC}"
            git branch -r
            ;;
        4)
            echo ""
            echo -e "${BLUE}main 和 prism 的文件差异：${NC}"
            git diff main prism --stat
            ;;
        5)
            echo -e "${GREEN}再见！${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}无效选项${NC}"
            ;;
    esac
}

# 如果提供了参数，直接切换
if [ "$1" = "main" ] || [ "$1" = "prism" ]; then
    switch_to "$1"
else
    # 否则显示菜单
    while true; do
        show_menu
        echo ""
        read -p "继续操作？(y/n): " continue_choice
        if [ "$continue_choice" != "y" ]; then
            echo -e "${GREEN}再见！${NC}"
            break
        fi
    done
fi
