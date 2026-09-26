# 单词书查询

一个只使用 HTML、CSS 和原生 JavaScript 制作的英语单词书页码查询工具。它不需要后端、数据库或构建步骤，可直接部署到 GitHub Pages。

## 修改单词索引

编辑项目根目录的 `index.txt`，保存后重新上传到 GitHub 即可。每行写一个单词和对应页码，两者使用一个或多个空格或 Tab 分隔：

```text
abandon 12
ability 13
vocabulary 126
```

规则：

- 单词查询不区分大小写。
- 空行会被忽略。
- 行首和行尾空格会被自动去除。
- 格式不正确的行、非正整数页码会被忽略，不会影响其他数据。
- 同一单词出现多次时，最后一条格式正确的记录生效。

## 本地测试

由于网页使用 `fetch()` 读取 `index.txt`，请通过本地静态 HTTP 服务打开，而不是直接双击 `index.html`。

如果电脑安装了 Python，可在项目目录运行：

```bash
python -m http.server 8000
```

然后在浏览器访问 `http://localhost:8000`。

## 上传到 GitHub

1. 在 GitHub 创建一个新仓库。
2. 将本项目中的 `index.html`、`style.css`、`script.js`、`index.txt` 和 `README.md` 上传到仓库根目录。
3. 确认默认分支为 `main`。

## 开启 GitHub Pages

在 GitHub 仓库中依次打开：

`Settings` → `Pages` → `Build and deployment` → 选择 `Deploy from a branch` → 分支选择 `main` → 文件夹选择 `/ (root)` → 点击 `Save`。

GitHub 完成部署后，Pages 页面会显示网站地址。通常个人仓库会是：

```text
https://你的用户名.github.io/你的仓库名/
```

访问该地址即可使用。项目内所有资源都使用相对路径，因此部署到仓库子路径时也能正常加载。
