import { expect, test } from '@playwright/test'

test('loads the complete data insight dashboard without console errors', async ({ page }) => {
  const consoleErrors = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  await page.goto('')
  await expect(page.getByRole('heading', { name: '粤港一卡双号用户体验与价值运营驾驶舱' })).toBeVisible()
  await expect(page.getByText('真实样本 · 静态脱敏聚合', { exact: true })).toBeVisible()
  await expect(page.getByText('仅覆盖广东侧样本用户访问香港网络', { exact: true })).toBeVisible()
  await expect(page.locator('[data-kpi="users"]')).toContainText('2,177')
  await expect(page.locator('[data-kpi="recall"]')).toContainText('504')
  await expect(page.locator('[data-kpi="concentration"]')).toContainText('90.44%')
  await expect(page.getByTestId('high-value-ranking').locator('.rank-main strong').first()).toHaveText(/^1\d{2}\*{4}\d{4}$/)
  await expect(page.getByTestId('experience-path-panel')).toContainText('激活体验')
  await expect(page.getByTestId('opportunity-panel')).toContainText('企业场景候选')
  await expect(page.getByTestId('kpi-grid').locator('.kpi-card')).toHaveCount(6)
  await expect(page.locator('canvas')).toHaveCount(2)
  await expect(page.getByTestId('flow-map')).toBeVisible()
  await expect(page.getByTestId('sample-boundary-card')).toContainText('未提供对侧样本')
  expect(consoleErrors).toEqual([])
})

test('links audience focus, opportunity cards and evidence drawer', async ({ page }) => {
  await page.goto('')
  await page.getByTestId('segment-filter').selectOption('RECALL')
  await expect(page.getByTestId('segment-filter')).toHaveValue('RECALL')
  await expect(page.getByTestId('opportunity-panel').locator('.selected')).toContainText('低活跃召回候选')
  await page.getByTestId('high-value-ranking').locator('.ranking-row').first().click()
  await expect(page.getByTestId('cdr-drawer')).toBeVisible()
  await expect(page.getByText('真实聚合证据')).toBeVisible()
  await expect(page.getByText('行为信号说明')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('cdr-drawer')).toBeHidden()
})

test('starts, pauses and resumes guided demo mode', async ({ page }) => {
  await page.goto('')
  await page.getByTestId('tour-start').click()
  await expect(page.getByText('演示导览')).toBeVisible()
  await page.getByRole('button', { name: '暂停演示' }).click()
  await expect(page.getByRole('button', { name: '继续演示' })).toBeVisible()
  await page.getByRole('button', { name: '继续演示' }).click()
  await expect(page.getByRole('button', { name: '暂停演示' })).toBeVisible()
})
