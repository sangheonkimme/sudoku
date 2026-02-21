import { test, expect, type Page } from '@playwright/test';

async function startEasyGame(page: Page) {
  await page.goto('/en');
  await expect(page).toHaveURL(/\/en$/);
  await page.getByRole('button', { name: 'Start a new Easy game' }).click();
  await expect(page.getByRole('grid', { name: 'Sudoku game board' })).toBeVisible();
}

test.describe('Sudoku game flow', () => {
  test('keeps in-progress game when switching locale', async ({ page }) => {
    await startEasyGame(page);

    const editableCell = page.getByRole('gridcell', { name: /empty/i }).first();
    await editableCell.click();

    const row = await editableCell.getAttribute('data-row');
    const col = await editableCell.getAttribute('data-col');
    if (row === null || col === null) {
      throw new Error('Failed to resolve editable cell coordinates.');
    }

    await page.getByRole('button', { name: 'Input number 1' }).click();
    const targetCell = page.getByTestId(`cell-${row}-${col}`);
    await expect(targetCell).toContainText('1');

    await page.getByTestId('language-select').selectOption('ko');
    await expect(page).toHaveURL(/\/ko$/);

    await expect(page.getByTestId(`cell-${row}-${col}`)).toContainText('1');
    await expect(page.getByRole('group', { name: '숫자 입력 패드' })).toBeVisible();
  });

  test('supports memo mode and converts memo to final number', async ({ page }) => {
    await startEasyGame(page);

    const editableCell = page.getByRole('gridcell', { name: /empty/i }).first();
    await editableCell.click();

    const row = await editableCell.getAttribute('data-row');
    const col = await editableCell.getAttribute('data-col');
    if (row === null || col === null) {
      throw new Error('Failed to resolve editable cell coordinates.');
    }

    const targetCell = page.getByTestId(`cell-${row}-${col}`);
    await page.getByTestId('notes-toggle').click();
    await expect(page.getByTestId('notes-toggle')).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'Input number 2' }).click();
    await page.getByRole('button', { name: 'Input number 4' }).click();
    await expect(targetCell).toContainText('2');
    await expect(targetCell).toContainText('4');

    await page.getByTestId('notes-toggle').click();
    await expect(page.getByTestId('notes-toggle')).toHaveAttribute('aria-pressed', 'false');
    await page.getByRole('button', { name: 'Input number 7' }).click();
    await expect(targetCell).toHaveText('7');
  });
});
