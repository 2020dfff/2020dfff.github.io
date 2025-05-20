# 将Jekyll网站部署到NUS服务器

按照以下步骤将你的Jekyll网站部署到NUS计算机学院的服务器：

## 1. 准备本地文件

已完成的步骤：
- 修改了`_config.yml`文件中的URL为`https://www.comp.nus.edu.sg/~yfei11`
- 确保头像路径正确（添加了前导斜杠`/`）
- 在导航菜单中使用完整URL路径
- 注释了CNAME文件

## 2. 使用自动部署脚本

为了解决图片不显示和链接跳转问题，我创建了一个自动部署脚本：

1. 使脚本可执行
   ```
   chmod +x nus_deploy.sh
   ```

2. 运行脚本
   ```
   ./nus_deploy.sh
   ```

该脚本会自动：
- 生成静态网站
- 修复HTML文件中的资源路径
- 上传文件到NUS服务器
- 设置正确的文件权限

## 3. 手动部署步骤（如果不使用脚本）

如果你想手动部署，请按照以下步骤操作：

1. 生成静态网站
   ```
   bundle exec jekyll build
   ```

2. 修复资源路径问题
   ```
   find _site -name "*.html" -type f -exec sed -i '' 's|href="/|href="https://www.comp.nus.edu.sg/~yfei11/|g' {} \;
   find _site -name "*.html" -type f -exec sed -i '' 's|src="/|src="https://www.comp.nus.edu.sg/~yfei11/|g' {} \;
   find _site -name "*.html" -type f -exec sed -i '' 's|url(/|url(https://www.comp.nus.edu.sg/~yfei11/|g' {} \;
   ```

3. 登录到NUS账户
   ```
   ssh yfei11@stu.comp.nus.edu.sg
   ```

4. 创建`public_html`目录（如果尚未存在）
   ```
   mkdir ~/public_html
   ```

5. 从本地上传`_site`目录中的所有文件到服务器
   ```
   # 在本地执行这个命令
   scp -r _site/* yfei11@stu.comp.nus.edu.sg:~/public_html/
   ```

6. 设置正确的权限
   ```
   chmod 711 ~/
   chmod 711 ~/public_html
   find ~/public_html -type d -exec chmod 711 {} \;
   find ~/public_html -type f -exec chmod 644 {} \;
   ```

## 4. 常见问题解决

### 图片不显示
- 确保所有图片文件都上传到了正确的位置
- 检查图片文件的权限是否为644
- 验证HTML中的图片路径是否正确（应使用完整URL或正确的相对路径）

### 页面链接无法正确跳转
- 确保所有内部链接都使用完整URL或正确的相对路径
- 在导航菜单中使用`{{ site.url }}{{ link.url }}`格式的链接
- 修复所有资源引用（CSS、JavaScript等）的路径

## 5. 测试你的网站

在浏览器中访问你的网站：
```
https://www.comp.nus.edu.sg/~yfei11
```

## 注意事项

1. 确保不要在`public_html`目录中放置任何敏感或私人文件
2. 遵守NUS计算机学院的《通用计算设施规则和条例》
3. 如果你在访问网站时遇到"权限被拒绝"错误，请检查你的WWW目录和文件的权限

## 维护网站

每次你更新网站内容后，需要：

1. 在本地运行`bundle exec jekyll build`重新生成网站
2. 将更新后的文件上传到服务器
   ```
   scp -r _site/* yfei11@stu.comp.nus.edu.sg:~/public_html/
   ```

## 其他注意事项

- 如果你想继续使用GitHub Pages作为备份或测试环境，可以保留原有设置
- 如需更改URL结构或添加内容，请修改本地文件后重新生成并上传 