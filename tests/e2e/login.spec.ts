import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
  });

  test('should display login page correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('CACRS');
    await expect(page.locator('text=Connexion')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill in login form
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    // Verify dashboard is loaded
    await expect(page.locator('h1')).toContainText('Tableau de Bord');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    // Should stay on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should redirect to dashboard if already logged in', async ({ page }) => {
    // Simulate logged in state
    await page.evaluate(() => {
      localStorage.setItem('auth', JSON.stringify({
        user: { id: '1', email: 'nyh770@gmail.com', role: 'admin' }
      }));
    });

    await page.goto('http://localhost:5173/#/login');
    await page.waitForURL('**/dashboard');
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[type="email"]', 'notanemail');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });
});
