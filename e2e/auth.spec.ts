import { test, expect } from '@playwright/test'

// Génère un email unique à chaque run pour éviter les conflits
const uniqueEmail = () => `test-${Date.now()}@e2e.dev`

test.describe('Authentification', () => {
  test('inscription avec un nouveau compte', async ({ page }) => {
    const email = uniqueEmail()
    await page.goto('/register')

    await page.fill('input[type="text"]', 'Test E2E')
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]:first-of-type', 'password123')
    await page.fill('input[type="password"]:last-of-type', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
    await expect(page.locator('h1')).toContainText('Bonjour')
  })

  test('connexion avec un compte existant', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'demo@smart-identity.dev')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
  })

  test('erreur visible avec un mauvais mot de passe', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"]', 'demo@smart-identity.dev')
    await page.fill('input[type="password"]', 'mauvais_mdp')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=incorrect')).toBeVisible({ timeout: 5_000 })
    await expect(page).toHaveURL(/\/login/)
  })

  test('erreur de validation visible à l\'inscription (mdp trop court)', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[type="text"]', 'Test')
    await page.fill('input[type="email"]', uniqueEmail())
    await page.fill('input[type="password"]:first-of-type', '123')
    await page.fill('input[type="password"]:last-of-type', '123')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=8')).toBeVisible({ timeout: 5_000 })
  })

  test('redirection vers /login si accès direct au dashboard non connecté', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 })
  })

  test('déconnexion redirige vers la page d\'accueil', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'demo@smart-identity.dev')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

    await page.click('button:has-text("Déconnecter"), button:has-text("déconnecter"), button:has-text("Se déconnecter")')
    await expect(page).toHaveURL('/', { timeout: 5_000 })
  })
})
