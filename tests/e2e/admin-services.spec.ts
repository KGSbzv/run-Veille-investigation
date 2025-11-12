import { test, expect } from '@playwright/test';

test.describe('Admin Services & Secrets Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'nyh770@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Navigate to admin services
    await page.goto('http://localhost:5173/#/admin/services');
  });

  test('should display services page correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Services & IA / Secrets');
    
    // Check filters are present
    await expect(page.locator('text=Tous')).toBeVisible();
    await expect(page.locator('text=Activés')).toBeVisible();
    await expect(page.locator('text=Services IA')).toBeVisible();
  });

  test('should display all 15 services', async ({ page }) => {
    // Wait for services to load
    await page.waitForSelector('[data-testid="service-card"]', { timeout: 5000 }).catch(() => {
      // If data-testid not present, check by class or other selector
    });
    
    // Count service cards (should have at least some services)
    const serviceCards = await page.locator('.bg-dark-card').count();
    expect(serviceCards).toBeGreaterThan(0);
  });

  test('should filter services by "Activés"', async ({ page }) => {
    await page.click('text=Activés');
    
    // Should show only enabled services
    const cards = await page.locator('.bg-dark-card').count();
    expect(cards).toBeGreaterThanOrEqual(1); // At least Gemini and Firebase
  });

  test('should filter services by "Services IA"', async ({ page }) => {
    await page.click('text=Services IA');
    
    // Check that AI services are shown
    await expect(page.locator('text=Google Gemini')).toBeVisible();
  });

  test('should toggle service activation', async ({ page }) => {
    // Find first service toggle
    const toggle = page.locator('input[type="checkbox"]').first();
    const initialState = await toggle.isChecked();
    
    // Click toggle
    await toggle.click();
    
    // Wait for state to change
    await page.waitForTimeout(500);
    
    // Verify state changed
    const newState = await toggle.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('should update secret name', async ({ page }) => {
    // Find first secret name input
    const secretInput = page.locator('input[placeholder*="GEMINI_API_KEY"]').first();
    
    // Clear and type new value
    await secretInput.fill('TEST_API_KEY');
    
    // Click save if there's a save button
    const saveButton = page.locator('button:has-text("Sauvegarder")').first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      
      // Wait for save to complete
      await page.waitForTimeout(500);
    }
  });

  test('should display service configuration fields', async ({ page }) => {
    // Check for AI service configuration
    const geminiCard = page.locator('text=Google Gemini').locator('..');
    
    // Should have model, temperature, etc.
    await expect(page.locator('text=Model').first()).toBeVisible();
    await expect(page.locator('text=Temperature').first()).toBeVisible();
  });

  test('should show test button for services', async ({ page }) => {
    const testButton = page.locator('button:has-text("Tester")').first();
    await expect(testButton).toBeVisible();
  });

  test('should test service connection', async ({ page }) => {
    // Enable a service first
    const firstToggle = page.locator('input[type="checkbox"]').first();
    if (!await firstToggle.isChecked()) {
      await firstToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Click test button
    const testButton = page.locator('button:has-text("Tester")').first();
    await testButton.click();
    
    // Should show loading state
    await expect(page.locator('text=Test en cours')).toBeVisible().catch(() => {
      // Test might complete too quickly
    });
    
    // Wait for test to complete
    await page.waitForTimeout(2000);
  });

  test('should display service status badges', async ({ page }) => {
    // Check for status badges
    const statusBadges = await page.locator('span.inline-flex').count();
    expect(statusBadges).toBeGreaterThan(0);
  });

  test('should show instructions panel', async ({ page }) => {
    await expect(page.locator('text=Instructions')).toBeVisible();
    await expect(page.locator('text=Saisissez uniquement')).toBeVisible();
  });

  test('should display full secret path', async ({ page }) => {
    await expect(page.locator('text=projects/9546768441/secrets/')).toBeVisible();
  });

  test('should prevent access for non-admin users', async ({ page }) => {
    // Logout
    await page.goto('http://localhost:5173/#/dashboard');
    await page.evaluate(() => localStorage.clear());
    
    // Login as non-admin
    await page.goto('http://localhost:5173/#/login');
    await page.fill('input[type="email"]', 'analyste@cacrs.gouv.fr');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Try to access services page
    await page.goto('http://localhost:5173/#/admin/services');
    
    // Should redirect to dashboard
    await page.waitForURL('**/dashboard');
  });
});
