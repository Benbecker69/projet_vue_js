import { test, expect } from '@playwright/test'

/**
 * Scénario E2E complet — parcours utilisateur intégral :
 * Inscription → Dashboard SaaS → Modification profil → Ajout lien → Simulation NFC
 * → Page publique → Boutique → Panier → Commande → Vérification historique
 */

const TEST_EMAIL = `full-flow-${Date.now()}@e2e.dev`
const TEST_PASSWORD = 'testpassword123'
const TEST_NAME = 'Utilisateur E2E'

test.describe('Parcours utilisateur complet', () => {
  let authToken: string | undefined

  test('1 — Inscription et accès au dashboard', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[type="text"]', TEST_NAME)
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]:first-of-type', TEST_PASSWORD)
    await page.fill('input[type="password"]:last-of-type', TEST_PASSWORD)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 })
    await expect(page.locator('h1')).toContainText('Bonjour')
    await expect(page.locator('text=Utilisateur E2E, text=E2E')).toBeVisible()
  })

  test('2 — Navigation SaaS : accès aux sections du dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

    // Sidebar : vérification des liens de navigation
    await expect(page.locator('text=Mon profil')).toBeVisible()
    await expect(page.locator('text=Mes liens')).toBeVisible()
    await expect(page.locator('text=Mes bracelets')).toBeVisible()
    await expect(page.locator('text=Statistiques')).toBeVisible()
    await expect(page.locator('text=Mes commandes')).toBeVisible()
  })

  test('3 — Modification du profil (bio + slug)', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

    await page.goto('/dashboard/profile')
    await expect(page.locator('h1')).toContainText('profil')

    const slug = `e2e-user-${Date.now()}`
    await page.fill('textarea', 'Bio de test E2E — développeur full-stack.')
    await page.fill('input[placeholder="votre-nom"]', slug)
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Enregistré')).toBeVisible({ timeout: 5_000 })
  })

  test('4 — Ajout et suppression d\'un lien (CRUD)', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

    await page.goto('/dashboard/links')

    // Ajout d'un lien
    await page.click('button:has-text("Ajouter")')
    await page.fill('input[placeholder="Mon portfolio"]', 'Mon GitHub')
    await page.fill('input[type="url"]', 'https://github.com/test-e2e')
    await page.click('button[type="submit"]:has-text("Enregistrer")')

    await expect(page.locator('text=Mon GitHub')).toBeVisible({ timeout: 5_000 })
    await expect(page.locator('text=github.com/test-e2e')).toBeVisible()

    // Suppression
    await page.click('.group:has-text("Mon GitHub") button:has-text("Supprimer")')
    await expect(page.locator('text=Mon GitHub')).not.toBeVisible({ timeout: 5_000 })
  })

  test('5 — Création d\'un bracelet NFC et simulation de scan', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

    // D'abord configurer un slug (requis pour la simulation NFC)
    await page.goto('/dashboard/profile')
    const slug = `e2e-nfc-${Date.now()}`
    await page.fill('input[placeholder="votre-nom"]', slug)
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Enregistré')).toBeVisible({ timeout: 5_000 })

    await page.goto('/dashboard/nfc')

    await page.fill('input[placeholder="Ex: Mon bracelet pro"]', 'Bracelet E2E')
    await page.click('button:has-text("Créer")')

    await expect(page.locator('text=Bracelet E2E')).toBeVisible({ timeout: 5_000 })
    await expect(page.locator('text=NFC-')).toBeVisible()

    // Simulation scan — ouvre la page publique dans un nouvel onglet
    const pagePromise = page.context().waitForEvent('page')
    await page.click('button:has-text("Simuler le scan")')
    const newPage = await pagePromise
    await expect(newPage).toHaveURL(/\/u\//, { timeout: 10_000 })
    await newPage.close()
  })

  test('6 — E-commerce : catalogue et ajout au panier', async ({ page }) => {
    await page.goto('/shop')

    // Le catalogue doit afficher les produits (seed requis)
    await expect(page.locator('.card, [class*="card"]').first()).toBeVisible({ timeout: 10_000 })

    // Clic sur le premier produit
    await page.locator('a[href^="/shop/"]').first().click()
    await expect(page.url()).toMatch(/\/shop\//)

    // Sélectionner une variante et ajouter au panier
    await page.locator('button[class*="border"]').first().click()
    await page.click('button:has-text("Ajouter au panier")')

    await expect(page.locator('text=Ajouté au panier')).toBeVisible({ timeout: 5_000 })
  })

  test('7 — Panier : modification des quantités et passage à la commande', async ({ page }) => {
    // D'abord ajouter un produit
    await page.goto('/shop')
    await page.locator('a[href^="/shop/"]').first().click()
    await page.click('button:has-text("Ajouter au panier")')
    await expect(page.locator('text=Ajouté au panier')).toBeVisible({ timeout: 5_000 })

    await page.goto('/cart')

    // Vérifier qu'il y a des articles
    await expect(page.locator('.card').first()).toBeVisible()

    // Augmenter la quantité
    await page.locator('button:has-text("+")').click()
    await expect(page.locator('text=2')).toBeVisible()
  })

  test('8 — Checkout : finalisation de commande (auth requise)', async ({ page }) => {
    // Ajouter un produit au panier
    await page.goto('/shop')
    await page.locator('a[href^="/shop/"]').first().click()
    await page.click('button:has-text("Ajouter au panier")')
    await expect(page.locator('text=Ajouté au panier')).toBeVisible({ timeout: 5_000 })

    // Aller au panier — bouton doit rediriger vers login si non connecté
    await page.goto('/cart')
    await page.click('button:has-text("connecter pour commander"), button:has-text("Passer la commande")')

    // Si redirigé vers login, se connecter
    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', TEST_EMAIL)
      await page.fill('input[type="password"]', TEST_PASSWORD)
      await page.click('button[type="submit"]')
      await expect(page).toHaveURL(/\/checkout|\/cart/, { timeout: 10_000 })
    }

    if (page.url().includes('/checkout')) {
      // Remplir le formulaire d'adresse
      await page.fill('input[type="text"]', TEST_NAME)
      await page.fill('input[placeholder*="rue"], input[placeholder*="Rue"]', '12 rue de la Paix')
      await page.fill('input[placeholder="Paris"]', 'Paris')
      await page.fill('input[placeholder="75001"]', '75001')

      await page.click('button:has-text("Confirmer la commande")')

      // Vérification de la confirmation
      await expect(page.locator('text=confirmée, text=Confirmée, text=confirmé')).toBeVisible({ timeout: 10_000 })
    }
  })

  test('9 — Historique des commandes dans le dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

    await page.goto('/dashboard/orders')
    // La page se charge sans erreur
    await expect(page.locator('h1')).toContainText('commandes')
  })

  test('10 — Page publique accessible sans authentification', async ({ page }) => {
    // La page /u/alex-martin doit être accessible (user de seed)
    await page.goto('/u/alex-martin')

    await expect(page.locator('h1, [class*="font-bold"]').first()).toBeVisible({ timeout: 10_000 })
    // Pas de redirection vers login
    await expect(page).not.toHaveURL(/\/login/)
  })
})
