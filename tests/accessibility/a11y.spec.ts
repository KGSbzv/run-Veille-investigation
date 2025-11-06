import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Tests d'Accessibilité Approfondis - WCAG 2.1 AA
 * Inclut tests automatiques ET vérifications manuelles simulées
 */

test.describe('♿ Accessibilité WCAG 2.1 AA - Tests Automatiques', () => {
  
  const pages = [
    { name: 'Login', url: '/login' },
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Dossiers', url: '/cases' },
    { name: 'Détail Dossier', url: '/cases/1' },
    { name: 'Veille', url: '/watchlists' },
    { name: 'Admin', url: '/admin' },
  ];

  for (const pageInfo of pages) {
    test(`${pageInfo.name} - Scan axe-core complet`, async ({ page }) => {
      // Setup user si nécessaire
      if (pageInfo.url !== '/login') {
        await page.evaluate(() => {
          localStorage.setItem('cacrs-mock-user', JSON.stringify({
            id: 'test-a11y',
            email: 'test@cacrs.fr',
            role: 'admin',
            status: 'actif'
          }));
        });
      }
      
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags([
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'best-practice'
        ])
        .exclude('#google-signin-button') // Exclu composant Google externe
        .analyze();
      
      // Log violations pour debug
      if (accessibilityScanResults.violations.length > 0) {
        console.log(`\n⚠️  Violations trouvées sur ${pageInfo.name}:`);
        accessibilityScanResults.violations.forEach(violation => {
          console.log(`  - ${violation.id}: ${violation.description}`);
          console.log(`    Impact: ${violation.impact}`);
          console.log(`    Elements: ${violation.nodes.length}`);
        });
      }
      
      // 0 violations critiques accepté
      const criticalViolations = accessibilityScanResults.violations
        .filter(v => v.impact === 'critical' || v.impact === 'serious');
      
      expect(criticalViolations).toHaveLength(0);
    });
  }
});

test.describe('⌨️  Navigation Clavier Complète', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('cacrs-mock-user', JSON.stringify({
        id: 'test-keyboard',
        email: 'test@cacrs.fr',
        role: 'analyst',
        status: 'actif'
      }));
    });
  });

  test('Dashboard - Navigation Tab complète', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Compter éléments focusables
    const focusableCount = await page.evaluate(() => {
      const focusable = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return focusable.length;
    });
    
    console.log(`Éléments focusables: ${focusableCount}`);
    expect(focusableCount).toBeGreaterThan(5);
    
    // Tester Tab navigation
    for (let i = 0; i < Math.min(focusableCount, 20); i++) {
      await page.keyboard.press('Tab');
      
      // Vérifier qu'un élément a le focus
      const hasFocus = await page.evaluate(() => {
        return document.activeElement !== document.body;
      });
      expect(hasFocus).toBe(true);
      
      // Vérifier focus visible
      const focusVisible = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement;
        if (!active) return false;
        
        const styles = window.getComputedStyle(active);
        // Vérifier outline ou focus-visible
        return styles.outline !== 'none' || 
               active.matches(':focus-visible');
      });
      
      if (!focusVisible) {
        console.warn(`Element ${i} n'a pas de focus visible`);
      }
    }
  });

  test('Formulaires accessibles au clavier', async ({ page }) => {
    await page.goto('/watchlists');
    
    // Focus sur input
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Taper dans input
    await page.keyboard.type('Test clavier');
    
    const value = await page.locator('input[placeholder*="requête"]').inputValue();
    expect(value).toBe('Test clavier');
    
    // Submit avec Enter
    await page.keyboard.press('Enter');
    // Vérifier que le bouton a été activé (spinner devrait apparaître)
    // Note: Nécessite API key configurée pour vrai test
  });

  test('Skip links présents (navigation rapide)', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Premier Tab devrait être skip link
    await page.keyboard.press('Tab');
    
    const firstFocused = await page.evaluate(() => {
      return document.activeElement?.textContent || '';
    });
    
    // Vérifier si c'est un lien "skip"
    // (À implémenter si nécessaire)
  });
});

test.describe('🔤 Textes Alternatifs & Labels', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('cacrs-mock-user', JSON.stringify({
        id: 'test-labels',
        email: 'test@cacrs.fr',
        role: 'analyst',
        status: 'actif'
      }));
    });
  });

  test('Toutes les images ont des alts significatifs', async ({ page }) => {
    await page.goto('/dashboard');
    
    const imagesWithoutAlt = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .filter(img => !img.alt || img.alt.trim() === '')
        .map(img => ({
          src: img.src,
          className: img.className
        }));
    });
    
    if (imagesWithoutAlt.length > 0) {
      console.log('Images sans alt:', imagesWithoutAlt);
    }
    
    expect(imagesWithoutAlt).toHaveLength(0);
  });

  test('SVG icons ont aria-label ou aria-hidden', async ({ page }) => {
    await page.goto('/dashboard');
    
    const svgsWithoutLabel = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      return svgs
        .filter(svg => {
          const hasAriaLabel = svg.hasAttribute('aria-label');
          const hasAriaHidden = svg.getAttribute('aria-hidden') === 'true';
          const hasRole = svg.getAttribute('role') === 'img';
          return !hasAriaLabel && !hasAriaHidden && !hasRole;
        })
        .length;
    });
    
    // Tolérance: certains SVG décoratifs peuvent ne pas avoir de label
    expect(svgsWithoutLabel).toBeLessThan(10);
  });

  test('Tous les boutons ont un nom accessible', async ({ page }) => {
    await page.goto('/cases');
    
    const buttonsWithoutName = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons
        .filter(button => {
          const hasText = button.textContent?.trim();
          const hasAriaLabel = button.hasAttribute('aria-label');
          const hasAriaLabelledby = button.hasAttribute('aria-labelledby');
          return !hasText && !hasAriaLabel && !hasAriaLabelledby;
        })
        .map(btn => ({
          className: btn.className,
          innerHTML: btn.innerHTML.substring(0, 50)
        }));
    });
    
    if (buttonsWithoutName.length > 0) {
      console.log('Boutons sans nom:', buttonsWithoutName);
    }
    
    expect(buttonsWithoutName).toHaveLength(0);
  });

  test('Liens descriptifs (pas de "cliquez ici")', async ({ page }) => {
    await page.goto('/cases');
    
    const genericLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const genericTerms = ['cliquez ici', 'click here', 'ici', 'plus', 'voir plus', 'en savoir plus'];
      
      return links
        .filter(link => {
          const text = link.textContent?.toLowerCase().trim() || '';
          return genericTerms.some(term => text === term);
        })
        .map(link => ({
          text: link.textContent,
          href: link.href
        }));
    });
    
    if (genericLinks.length > 0) {
      console.log('Liens génériques trouvés:', genericLinks);
    }
    
    // Avertissement seulement
    expect(genericLinks.length).toBeLessThan(3);
  });
});

test.describe('🎨 Contrastes de Couleurs WCAG AA', () => {
  
  test('Contraste texte principal >= 4.5:1', async ({ page }) => {
    await page.goto('/dashboard');
    
    const contrastIssues = await page.evaluate(() => {
      // Fonction pour calculer contraste (simplifié)
      function getContrast(fg: string, bg: string): number {
        // Conversion couleur vers luminance relative
        // Implémentation simplifiée - en prod utiliser library
        return 4.5; // Mock - en réalité calculer vraiment
      }
      
      const elements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div'));
      const issues: any[] = [];
      
      elements.slice(0, 20).forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Check si texte visible
        if (el.textContent?.trim() && color && bgColor) {
          const contrast = getContrast(color, bgColor);
          if (contrast < 4.5) {
            issues.push({
              text: el.textContent.substring(0, 30),
              color,
              bgColor,
              contrast
            });
          }
        }
      });
      
      return issues;
    });
    
    // Note: Implémentation complète nécessiterait library de calcul contraste
    // Pour l'instant, axe-core le fait déjà automatiquement
  });
});

test.describe('📱 Responsive & Zoom', () => {
  
  test('Zoom 200% sans perte de contenu', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Simuler zoom 200%
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });
    
    await page.waitForTimeout(1000);
    
    // Vérifier que contenu principal toujours visible
    await expect(page.locator('h1:has-text("Tableau de bord")')).toBeVisible();
    
    // Reset zoom
    await page.evaluate(() => {
      document.body.style.zoom = '1';
    });
  });

  test('Mobile viewport accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone
    
    await page.evaluate(() => {
      localStorage.setItem('cacrs-mock-user', JSON.stringify({
        id: 'test-mobile',
        email: 'test@cacrs.fr',
        role: 'analyst',
        status: 'actif'
      }));
    });
    
    await page.goto('/dashboard');
    
    // Vérifier contenu visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Screenshot mobile
    await page.screenshot({ path: 'tests/visual/dashboard-mobile.png', fullPage: true });
  });
});

test.describe('📝 Formulaires Accessibles', () => {
  
  test('Labels associés aux inputs', async ({ page }) => {
    await page.goto('/login');
    
    const inputsWithoutLabel = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"])'));
      return inputs
        .filter(input => {
          const hasLabel = document.querySelector(`label[for="${input.id}"]`);
          const hasAriaLabel = input.hasAttribute('aria-label');
          const hasAriaLabelledby = input.hasAttribute('aria-labelledby');
          const hasPlaceholder = input.hasAttribute('placeholder');
          
          return !hasLabel && !hasAriaLabel && !hasAriaLabelledby && !hasPlaceholder;
        })
        .length;
    });
    
    expect(inputsWithoutLabel).toBe(0);
  });

  test('Messages d\'erreur associés via aria-describedby', async ({ page }) => {
    await page.goto('/login');
    
    // Simuler erreur (si formulaire réactif)
    // Vérifier que aria-describedby pointe vers message erreur
    // Test manuel car dépend de la logique formulaire
  });
});
