# GitHub SSH 仓库操作说明

本文记录之后本地 GitHub 仓库操作统一使用 SSH 方式，不再为本地 `git push` 反复创建临时 PAT。

## 当前状态

- SSH 认证账号：`foxmaybeOI1761640545`
- SSH 测试命令已通过：

```powershell
ssh -T git@github.com
```

成功提示类似：

```text
Hi foxmaybeOI1761640545! You've successfully authenticated, but GitHub does not provide shell access.
```

如果 `github.com:22` 被拒绝，可使用 GitHub SSH over HTTPS 端口 `443`，并在 `C:\Users\栀子花\.ssh\config` 中配置。

## 新仓库需要填写的参数

按实际情况替换下面参数；没有对应需求就留空或忽略。

```text
GITHUB_ACCOUNT = foxmaybeOI1761640545
REPO_NAME = <新仓库名>
DEFAULT_BRANCH = main
FEATURE_BRANCH = <功能分支名>
LOCAL_PROJECT_DIR = <本地项目目录>
PAGES_BASE = /<新仓库名>/
```

## 常用操作

### 克隆新仓库

```powershell
git clone git@github.com:GITHUB_ACCOUNT/REPO_NAME.git
```

示例：

```powershell
git clone git@github.com:foxmaybeOI1761640545/LianTongSK-1785306945.git
```

### 给已有本地仓库设置 SSH remote

```powershell
git remote set-url origin git@github.com:GITHUB_ACCOUNT/REPO_NAME.git
git remote -v
```

示例：

```powershell
git remote set-url origin git@github.com:foxmaybeOI1761640545/LianTongSK-1785306945.git
git remote -v
```

### 推送主分支

```powershell
git push -u origin main
```

### 推送功能分支

```powershell
git push -u origin FEATURE_BRANCH
```

示例：

```powershell
git push -u origin future/1785323405/DemoDashboard
```

## GitHub Pages 注意事项

如果项目仍使用当前的 GitHub Actions Pages 部署方式：

- Pages Source 选择 `GitHub Actions`
- 不需要创建 `gh-pages` 分支
- 不需要为 Pages 部署创建 PAT 或仓库 Secret
- Actions 使用 GitHub 自动提供的 `GITHUB_TOKEN`

如果复制 Vite 项目到新仓库，需要同步修改 `vite.config.*` 中的 `base`：

```ts
base: '/REPO_NAME/'
```

否则 GitHub Pages 上可能出现资源 404 或白屏。

## SSH key 管理提醒

- 私钥文件只保存在本机，不上传 GitHub，不提交到仓库。
- 公钥文件通常以 `.pub` 结尾，可以添加到 GitHub。
- 忘记私钥 passphrase 后无法找回；可以删除旧 key，重新生成并在 GitHub 添加新公钥。
- 一个 GitHub 账号可以添加多个公钥；一台电脑也可以保存多套私钥。
- 多 GitHub 账号建议使用不同 SSH key，并通过 `~/.ssh/config` 区分。
