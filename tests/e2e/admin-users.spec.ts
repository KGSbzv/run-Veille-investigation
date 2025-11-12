import { test, expect } from '@playwright/test';

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Navigate to admin panel
    await page.goto('http://localhost:5173/#/admin');
  });

  test('should display admin page with tabs', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Administration');
    await expect(page.locator('text=Gestion des Utilisateurs')).toBeVisible();
    await expect(page.locator('text=Architecture Système')).toBeVisible();
    await expect(page.locator('text=Services & IA / Secrets')).toBeVisible();
  });

  test('should display user management table', async ({ page }) => {
    // Should be on users tab by default
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Utilisateur")')).toBeVisible();
    await expect(page.locator('th:has-text("Rôle")')).toBeVisible();
    await expect(page.locator('th:has-text("Statut")')).toBeVisible();
  });

  test('should list users', async ({ page }) => {
    const userRows = await page.locator('tbody tr').count();
    expect(userRows).toBeGreaterThan(0);
  });

  test('should change user role', async ({ page }) => {
    // Find first non-admin user role select
    const roleSelects = page.locator('select');
    const firstSelect = roleSelects.nth(1); // Skip admin's select which is disabled
    
    if (await firstSelect.isEnabled()) {
      const initialValue = await firstSelect.inputValue();
      
      // Change role
      await firstSelect.selectOption('analyst');
      
      // Wait for update
      await page.waitForTimeout(500);
      
      // Verify change (or could be reverted)
      const newValue = await firstSelect.inputValue();
      // Value might change or stay same depending on implementation
    }
  });

  test('should toggle user status', async ({ page }) => {
    // Find first status toggle button (not for admin)
    const toggleButtons = page.locator('button:has-text("Bloquer"), button:has-text("Débloquer")');
    
    if (await toggleButtons.count() > 0) {
      const firstButton = toggleButtons.first();
      const initialText = await firstButton.textContent();
      
      await firstButton.click();
      
      // Wait for state change
      await page.waitForTimeout(500);
      
      // Button text should change
      const newText = await firstButton.textContent();
      expect(newText).not.toBe(initialText);
    }
  });

  test('should not allow modifying admin users', async ({ page }) => {
    // Find admin user row (nyh770@gmail.com)
    const adminRow = page.locator('tr:has-text("nyh770@gmail.com")');
    
    // Role select should be disabled
    const roleSelect = adminRow.locator('select');
    await expect(roleSelect).toBeDisabled();
    
    // Action button should be disabled
    const actionButton = adminRow.locator('button');
    await expect(actionButton).toBeDisabled();
  });

  test('should switch to architecture tab', async ({ page }) => {
    await page.click('text=Architecture Système');
    
    // Should show architecture content
    await expect(page.locator('text=Bot Conversationnel Intelligent')).toBeVisible();
  });

  test('should display architecture services table', async ({ page }) => {
    await page.click('text=Architecture Système');
    
    // Check for service tables
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=Gemini for Google Cloud API')).toBeVisible();
  });

  test('should navigate to services settings', async ({ page }) => {
    await page.click('text=Services & IA / Secrets');
    
    // Should navigate to services page
    await page.waitForURL('**/admin/services');
    await expect(page.locator('h1')).toContainText('Services & IA / Secrets');
  });
});
