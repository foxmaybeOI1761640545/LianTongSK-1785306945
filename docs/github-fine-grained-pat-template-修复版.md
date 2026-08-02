# GitHub Fine-Grained PAT 创建方案

本文记录一种用于 AI IDE / 本地脚本操作单个 GitHub 仓库的 fine-grained Personal Access Token 创建方案。

## 适用场景

该方案适合以下操作：

- 通过 HTTPS remote 执行 `git push`
- 推送或更新 `.github/workflows`
- 创建或更新 Pull Request
- 管理单个仓库内的 Actions、Pages、Secrets、Variables、Issues、Releases 等资源

日常本地 Git 操作优先使用 SSH。只有需要通过 GitHub API 或 HTTPS token 自动化管理仓库资源时，再创建 PAT。

## 参数预留位

创建新 PAT 前，先替换以下参数：

```text
OWNER = <GitHub账号或组织名>
REPO_NAME = <目标仓库名>
TOKEN_NAME = AI-IDE-<REPO_NAME>
```

当前常用账号示例：

```text
OWNER = foxmaybeOI1761640545
```

## URL 模板

该模板会预填 fine-grained PAT 的名称、说明、资源所有者、永久不过期以及仓库级高权限。

```text
https://github.com/settings/personal-access-tokens/new?name=AI-IDE-<REPO_NAME>&description=AI+IDE+full+repository+access+for+<OWNER>/<REPO_NAME>&target_name=<OWNER>&expires_in=none&actions=write&administration=write&agent_secrets=write&agent_tasks=write&agent_variables=write&artifact_metadata=write&attestations=write&code_quality=write&security_events=write&codespaces=write&codespaces_lifecycle_admin=write&codespaces_metadata=read&codespaces_secrets=write&statuses=write&contents=write&copilot_agent_settings=write&repository_custom_properties=write&vulnerability_alerts=write&dependabot_secrets=write&deployments=write&discussions=write&environments=write&issues=write&license_compliance_alerts=write&merge_queues=write&metadata=read&pages=write&pull_requests=write&repository_advisories=write&repo_secret_scanning_dismissal_requests=write&secret_scanning_alerts=write&secrets=write&actions_variables=write&repository_hooks=write&workflows=write
```

示例替换：

```text
<OWNER> = foxmaybeOI1761640545
<REPO_NAME> = LianTongSK-1785306945
```

注意：实际打开链接前，必须把 URL 中的 `<OWNER>` 和 `<REPO_NAME>` 都替换掉。不要保留 `target_name=<OWNER>`，否则 GitHub 会提示找不到资源所有者。

如果 GitHub 页面仍有未选中的新增权限，手动勾选 `Read and write`，再把对应参数补回本文档。

## 最近补充的权限参数

以下参数用于覆盖 GitHub 新增或之前遗漏的仓库级权限：

```text
agent_secrets=write
agent_tasks=write
agent_variables=write
copilot_agent_settings=write
license_compliance_alerts=write
repo_secret_scanning_dismissal_requests=write
```

## 页面上必须手动确认

GitHub 的 URL 参数可以预填大部分权限，但不能可靠地通过 URL 参数锁定某一个仓库。因此打开页面后必须手动确认：

```text
Resource owner: <OWNER>
Expiration: No expiration
Repository access: Only select repositories
Selected repositories: 只选择 <REPO_NAME>
```

只有当 `Repository access` 选择 `Only select repositories` 且仅选择目标仓库时，该 PAT 才能被限制在单个仓库范围内。

## 权限范围说明

该模板包含的是仓库级权限，不包含账户级或组织级权限。

因此它的目标是：

```text
单个仓库范围内尽可能完整的管理权限
```

不是：

```text
整个 GitHub 账号的所有权限
所有组织权限
所有仓库权限
```

## 使用提醒

- PAT 生成后只显示一次，需要保存在本机安全位置。
- 不要把 PAT 写入聊天、README、源码、Git 历史或截图。
- 不建议把 PAT 配进 GitHub Actions Secret 用于 Pages 部署；当前 Pages 部署应继续使用 `GITHUB_TOKEN`。
- 如果 PAT 泄露，立即到 GitHub 删除该 token，并检查目标仓库近期 push、workflow、secret 和 settings 变更。
- 永久不过期的 PAT 风险更高；若只是临时操作，优先创建短期 token。

## 常见用途

### HTTPS remote 使用 PAT

如果不用 SSH，而是临时通过 HTTPS 推送，可使用：

```powershell
git remote set-url origin https://github.com/<OWNER>/<REPO_NAME>.git
git push
```

Git 提示输入密码时，密码位置填写 PAT。

### 恢复 SSH remote

日常开发完成后建议恢复 SSH remote：

```powershell
git remote set-url origin git@github.com:<OWNER>/<REPO_NAME>.git
git remote -v
```
