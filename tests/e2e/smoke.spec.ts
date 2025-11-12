import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Critical Paths', () => {
  test('app should load', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/CACRS|Veille/i);
  });

  test('login page should be accessible', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('dashboard should load for authenticated user', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigation menu should work', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Check sidebar navigation
    await expect(page.locator('[data-tour-id="dashboard-nav"]')).toBeVisible();
    await expect(page.locator('[data-tour-id="cases-nav"]')).toBeVisible();
    await expect(page.locator('[data-tour-id="watchlists-nav"]')).toBeVisible();
  });

  test('cases page should load', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('http://localhost:5173/#/cases');
    await expect(page.locator('h1')).toContainText('Dossiers');
  });

  test('admin should access admin panel', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('http://localhost:5173/#/admin');
    await expect(page.locator('h1')).toContainText('Administration');
  });

  test('non-admin should not access admin panel', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'analyste@cacrs.gouv.fr');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('http://localhost:5173/#/admin');
    
    // Should redirect to dashboard
    await page.waitForURL('**/dashboard');
  });

  test('logout should work', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Click logout
    await page.click('button:has-text("Déconnexion")');
    
    // Should redirect to login
    await page.waitForURL('**/login');
  });

  test('all main pages should be accessible', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    const pages = [
      { url: '/#/dashboard', title: 'Tableau de Bord' },
      { url: '/#/cases', title: 'Dossiers' },
      { url: '/#/watchlists', title: /Veille|Findings/ },
      { url: '/#/admin', title: 'Administration' },
      { url: '/#/admin/services', title: 'Services & IA' },
    ];
    
    for (const { url, title } of pages) {
      await page.goto(`http://localhost:5173${url}`);
      await expect(page.locator('h1')).toContainText(title);
    }
  });
});
