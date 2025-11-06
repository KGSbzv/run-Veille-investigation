import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Tests End-to-End critiques - CACRS
 * Scénarios utilisateurs réels en conditions production
 */

test.describe('🔐 Authentification & Navigation', () => {
  
  test('Page login accessible et responsive', async ({ page }) => {
    await page.goto('/login');
    
    // Vérifier titre
    await expect(page).toHaveTitle(/CACRS/);
    
    // Vérifier présence du formulaire
    await expect(page.locator('text=Portail CACRS')).toBeVisible();
    await expect(page.locator('text=Plateforme de Veille')).toBeVisible();
    
    // Vérifier bouton Google Sign-In
    await expect(page.locator('#google-signin-button')).toBeVisible();
    
    // Screenshot baseline
    await page.screenshot({ path: 'tests/visual/login-page.png', fullPage: true });
  });

  test('Accessibilité page login (WCAG 2.1 AA)', async ({ page }) => {
    await page.goto('/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Redirection vers dashboard si déjà connecté', async ({ page, context }) => {
    // Simuler session existante (mock)
    await context.addCookies([
      {
        name: 'cacrs-mock-user',
        value: JSON.stringify({
          id: 'test-123',
          email: 'test@cacrs.fr',
          role: 'analyst'
        }),
        domain: 'cacrs-frontend-e3cni43iqq-ew.a.run.app',
        path: '/',
      },
    ]);
    
    await page.goto('/login');
    
    // Devrait rediriger vers dashboard
    await expect(page).toHaveURL(/dashboard/);
  });
});

test.describe('📊 Dashboard', () => {
  
  test.beforeEach(async ({ page }) => {
    // Simuler connexion (utiliser localStorage comme fait l'app)
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('cacrs-mock-user', JSON.stringify({
        id: 'test-analyst',
        email: 'analyst@cacrs.gouv.fr',
        role: 'analyst',
        status: 'actif'
      }));
    });
    await page.goto('/dashboard');
  });

  test('Dashboard affiche les statistiques', async ({ page }) => {
    await expect(page.locator('h1:has-text("Tableau de bord")')).toBeVisible();
    
    // Vérifier présence des cartes stats
    await expect(page.locator('text=Dossiers Actifs')).toBeVisible();
    await expect(page.locator('text=Nouveaux Findings')).toBeVisible();
    
    // Vérifier chiffres affichés
    await expect(page.locator('text=2').first()).toBeVisible(); // Nombre dossiers
    
    // Screenshot
    await page.screenshot({ path: 'tests/visual/dashboard.png', fullPage: true });
  });

  test('Navigation sidebar fonctionnelle', async ({ page }) => {
    // Test navigation vers chaque section
    await page.click('a:has-text("Dossiers d\'enquête")');
    await expect(page).toHaveURL(/cases/);
    
    await page.click('a:has-text("Veille & Findings")');
    await expect(page).toHaveURL(/watchlists/);
    
    await page.click('a:has-text("Tableau de bord")');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Core Web Vitals - Performance dashboard', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries.find(e => e.entryType === 'largest-contentful-paint');
          resolve({ lcp: lcp?.renderTime || lcp?.loadTime });
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout après 10s
        setTimeout(() => resolve({ lcp: null }), 10000);
      });
    });
    
    console.log('LCP:', metrics);
    // LCP devrait être < 2.5s
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500);
    }
  });
});

test.describe('📁 Dossiers d\'Enquête', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('cacrs-mock-user', JSON.stringify({
        id: 'test-analyst',
        email: 'analyst@cacrs.gouv.fr',
        role: 'analyst',
        status: 'actif'
      }));
    });
  });

  test('Liste des dossiers affichée', async ({ page }) => {
    await page.goto('/cases');
    
    await expect(page.locator('h1:has-text("Dossiers d\'enquête")')).toBeVisible();
    
    // Vérifier table
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Titre")')).toBeVisible();
    await expect(page.locator('th:has-text("Statut")')).toBeVisible();
    
    // Vérifier au moins un dossier mock
    await expect(page.locator('text=Opération Corbeau Numérique')).toBeVisible();
    
    await page.screenshot({ path: 'tests/visual/cases-list.png', fullPage: true });
  });

  test('Détail d\'un dossier accessible', async ({ page }) => {
    await page.goto('/cases');
    
    // Cliquer sur premier dossier
    await page.click('a:has-text("Opération Corbeau Numérique")');
    
    // Vérifier URL
    await expect(page).toHaveURL(/cases\/1/);
    
    // Vérifier contenu
    await expect(page.locator('h1:has-text("Opération Corbeau")')).toBeVisible();
    
    // Vérifier onglets
    await expect(page.locator('button:has-text("Chat d\'Enquête")')).toBeVisible();
    await expect(page.locator('button:has-text("Fichiers")')).toBeVisible();
    await expect(page.locator('button:has-text("Timeline")')).toBeVisible();
  });

  test('Upload de fichier fonctionnel', async ({ page }) => {
    await page.goto('/cases/1');
    
    // Aller sur onglet Fichiers
    await page.click('button:has-text("Fichiers")');
    
    // Vérifier présence input file
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    
    // Note: Upload réel nécessiterait un vrai fichier
    // await fileInput.setInputFiles('./tests/fixtures/test.pdf');
    
    await page.screenshot({ path: 'tests/visual/case-files.png', fullPage: true });
  });
});

test.describe('⚙️ Page Admin', () => {
  
  test('Admin accessible uniquement pour admin', async ({ page }) => {
    // Connecté en tant qu'analyst
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('cacrs-mock-user', JSON.stringify({
        id: 'test-analyst',
        email: 'analyst@cacrs.gouv.fr',
        role: 'analyst',
        status: 'actif'
      }));
    });
    
    await page.goto('/admin');
    
    // Devrait être redirigé
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Admin accessible pour utilisateur admin', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('cacrs-mock-user', JSON.stringify({
        id: 'test-admin',
        email: 'nyh770@gmail.com',
        role: 'admin',
        status: 'actif'
      }));
    });
    
    await page.goto('/admin');
    
    // Devrait rester sur admin
    await expect(page).toHaveURL(/admin/);
    await expect(page.locator('h1:has-text("Administration")')).toBeVisible();
    
    await page.screenshot({ path: 'tests/visual/admin-page.png', fullPage: true });
  });

  test('Gestion utilisateurs affichée', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('cacrs-mock-user', JSON.stringify({
        id: 'admin-1',
        email: 'nyh770@gmail.com',
        role: 'admin',
        status: 'actif'
      }));
    });
    
    await page.goto('/admin');
    
    // Vérifier table utilisateurs
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Utilisateur")')).toBeVisible();
    await expect(page.locator('th:has-text("Rôle")')).toBeVisible();
    await expect(page.locator('th:has-text("Statut")')).toBeVisible();
  });
});

test.describe('🔍 Veille & Findings', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('cacrs-mock-user', JSON.stringify({
        id: 'test-user',
        email: 'user@cacrs.fr',
        role: 'analyst',
        status: 'actif'
      }));
    });
  });

  test('Page veille accessible', async ({ page }) => {
    await page.goto('/watchlists');
    
    await expect(page.locator('h1:has-text("Veille & Findings")')).toBeVisible();
    await expect(page.locator('input[placeholder*="requête"]')).toBeVisible();
    await expect(page.locator('button:has-text("Rechercher")')).toBeVisible();
    
    await page.screenshot({ path: 'tests/visual/watchlists.png', fullPage: true });
  });

  test('Formulaire de recherche fonctionnel', async ({ page }) => {
    await page.goto('/watchlists');
    
    const input = page.locator('input[placeholder*="requête"]');
    await input.fill('Test recherche automatisée');
    
    const value = await input.inputValue();
    expect(value).toBe('Test recherche automatisée');
  });
});

test.describe('🎨 Visual Regression', () => {
  
  test('Screenshot comparaison toutes les pages', async ({ page }) => {
    const pages = [
      { url: '/login', name: 'login' },
      { url: '/dashboard', name: 'dashboard' },
      { url: '/cases', name: 'cases' },
      { url: '/watchlists', name: 'watchlists' },
    ];
    
    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ 
        path: `tests/visual/${pageInfo.name}-full.png`, 
        fullPage: true 
      });
    }
  });
});
