#!/bin/bash

# 生成网站
echo "生成Jekyll静态网站..."
bundle exec jekyll build

# 修复CSS和图片的路径问题
echo "修复资源路径问题..."
find _site -name "*.html" -type f -exec sed -i '' 's|href="/|href="https://www.comp.nus.edu.sg/~yfei11/|g' {} \;
find _site -name "*.html" -type f -exec sed -i '' 's|src="/|src="https://www.comp.nus.edu.sg/~yfei11/|g' {} \;
find _site -name "*.html" -type f -exec sed -i '' 's|url(/|url(https://www.comp.nus.edu.sg/~yfei11/|g' {} \;

# 修复协议无关URL
echo "修复协议无关URL..."
find _site -name "*.html" -type f -exec sed -i '' 's|src="//|src="https://|g' {} \;
find _site -name "*.html" -type f -exec sed -i '' 's|href="//|href="https://|g' {} \;

# 确保所有目录都具有正确的权限
echo "准备上传文件..."

# 上传前提示
echo "请输入你的NUS密码:"
scp -r _site/* yfei11@stu.comp.nus.edu.sg:~/public_html/

# 设置权限
echo "正在设置文件权限..."
ssh yfei11@stu.comp.nus.edu.sg << 'EOF'
chmod 711 ~/
chmod 711 ~/public_html
find ~/public_html -type d -exec chmod 711 {} \;
find ~/public_html -type f -exec chmod 644 {} \;
EOF

echo "部署完成！请访问 https://www.comp.nus.edu.sg/~yfei11/ 查看您的网站。" 