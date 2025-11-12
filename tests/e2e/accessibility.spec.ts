import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Tests', () => {
  test('login page should be accessible', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test('dashboard should be accessible', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
    });
  });

  test('admin services page should be accessible', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('http://localhost:5173/#/admin/services');
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
    });
  });

  test('keyboard navigation should work', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    
    // Tab through form
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('all interactive elements should be focusable', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Check that navigation items are focusable
    const navItems = page.locator('[data-tour-id]');
    const count = await navItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = navItems.nth(i);
      await item.focus();
      await expect(item).toBeFocused();
    }
  });
});
