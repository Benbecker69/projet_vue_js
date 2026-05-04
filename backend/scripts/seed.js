require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const NfcObject = require('../src/models/NfcObject');
const MarketingContent = require('../src/models/MarketingContent');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    NfcObject.deleteMany({}),
    MarketingContent.deleteMany({}),
  ]);
  console.log('Collections cleared');

  // --- Users ---
  const demoUser = await User.create({
    name: 'Alex Martin',
    email: 'demo@smart-identity.dev',
    passwordHash: 'password123',
    role: 'user',
    profile: {
      publicSlug: 'alex-martin',
      bio: 'Designer & développeur freelance basé à Paris. Passionné par les interfaces humaines et le design système.',
      avatar: 'https://i.pravatar.cc/300?img=12',
      theme: 'dark',
      links: [
        { label: 'Portfolio', url: 'https://alexmartin.design', icon: 'globe' },
        { label: 'LinkedIn', url: 'https://linkedin.com/in/alex-martin', icon: 'linkedin' },
        { label: 'GitHub', url: 'https://github.com/alexmartin', icon: 'github' },
        { label: 'Contact', url: 'mailto:alex@smart-identity.dev', icon: 'mail' },
      ],
    },
  });

  await User.create({
    name: 'Admin',
    email: 'admin@smart-identity.dev',
    passwordHash: 'admin1234',
    role: 'admin',
    profile: { publicSlug: 'admin-si' },
  });

  console.log('Users created');

  // --- NFC Objects ---
  await NfcObject.create({
    code: 'NFC-DEMO0001',
    owner: demoUser._id,
    label: 'Bracelet principal',
    isActive: true,
    scanCount: 42,
  });

  console.log('NFC objects created');

  // --- Products ---
  await Product.insertMany([
    {
      name: 'Smart Bracelet Classic',
      slug: 'smart-bracelet-classic',
      description: 'Notre bracelet NFC d\'entrée de gamme. Élégant, léger, disponible en 3 coloris. Idéal pour commencer votre identité numérique.',
      price: 29.99,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      ],
      variants: [
        { color: 'Noir', sku: 'SBC-BLK' },
        { color: 'Argent', sku: 'SBC-SLV' },
        { color: 'Or rose', sku: 'SBC-RGD' },
      ],
    },
    {
      name: 'Smart Bracelet Pro',
      slug: 'smart-bracelet-pro',
      description: 'La version premium. Silicone haut de gamme, étanche IPX7, compatible iOS & Android. Pour les professionnels exigeants.',
      price: 59.99,
      images: [
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      ],
      variants: [
        { color: 'Noir mat', sku: 'SBP-BLK' },
        { color: 'Bleu nuit', sku: 'SBP-NVY' },
      ],
    },
    {
      name: 'Smart Card NFC',
      slug: 'smart-card-nfc',
      description: 'Format carte de visite, taille portefeuille. La façon la plus discrète de partager votre profil dans un contexte professionnel.',
      price: 19.99,
      images: [
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
      ],
      variants: [
        { color: 'Blanc mat', sku: 'SCN-WHT' },
        { color: 'Noir brillant', sku: 'SCN-BLK' },
      ],
    },
    {
      name: 'Smart Keychain',
      slug: 'smart-keychain',
      description: 'Porte-clé NFC compact. Toujours avec vous, jamais encombrant. Rechargez votre profil en temps réel depuis l\'app.',
      price: 14.99,
      images: [
        'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80',
      ],
      variants: [
        { color: 'Noir', sku: 'SKC-BLK' },
        { color: 'Blanc', sku: 'SKC-WHT' },
      ],
    },
  ]);

  console.log('Products created');

  // --- Marketing Content ---
  await MarketingContent.insertMany([
    // Features
    { type: 'feature', title: 'Partagez en un scan', body: 'Un simple scan de votre bracelet suffit pour partager votre profil complet, vos réseaux et vos coordonnées.', meta: { icon: 'zap' }, order: 1 },
    { type: 'feature', title: 'Page publique personnalisée', body: 'Créez et personnalisez votre page de profil. Choisissez vos liens, votre bio, votre thème visuel.', meta: { icon: 'user' }, order: 2 },
    { type: 'feature', title: 'Mise à jour instantanée', body: 'Modifiez votre profil depuis l\'app et votre bracelet reflète les changements en temps réel.', meta: { icon: 'refresh-cw' }, order: 3 },
    { type: 'feature', title: 'Compatible avec tout smartphone', body: 'NFC universel — fonctionne avec tous les iPhones depuis 2017 et Android depuis 2013, sans app à installer.', meta: { icon: 'smartphone' }, order: 4 },
    { type: 'feature', title: 'Multi-profils', body: 'Gérez plusieurs objets NFC pour différents contextes — perso, pro, événementiel.', meta: { icon: 'layers' }, order: 5 },
    { type: 'feature', title: 'Statistiques de scans', body: 'Suivez en temps réel combien de fois votre bracelet a été scanné et par qui.', meta: { icon: 'bar-chart-2' }, order: 6 },
    // FAQ
    { type: 'faq', title: 'Est-ce que je besoin d\'une application pour scanner ?', body: 'Non. N\'importe quel smartphone NFC peut scanner votre bracelet directement depuis les paramètres ou l\'appareil photo natif.', order: 1 },
    { type: 'faq', title: 'Comment configurer mon bracelet ?', body: 'Inscrivez-vous, configurez votre profil dans votre tableau de bord, puis associez votre bracelet depuis la section "Mes bracelets".', order: 2 },
    { type: 'faq', title: 'Puis-je changer mon profil après coup ?', body: 'Oui, votre profil est mis à jour instantanément. Aucune reprogrammation du bracelet n\'est nécessaire.', order: 3 },
    { type: 'faq', title: 'Le bracelet est-il résistant à l\'eau ?', body: 'Le Smart Bracelet Classic est résistant aux éclaboussures. Le Pro est étanche certifié IPX7 (immersion 30 min, 1 mètre).', order: 4 },
    // Testimonials
    { type: 'testimonial', title: 'Sarah K. — Designer UX', body: 'Je l\'utilise dans toutes mes réunions clients. Plus besoin de distribuer des cartes de visite, une accolade et c\'est fait.', meta: { avatar: 'https://i.pravatar.cc/100?img=5', role: 'Designer UX' }, order: 1 },
    { type: 'testimonial', title: 'Marc D. — Développeur Freelance', body: 'La version Pro est parfaite pour les salons tech. Etanche, solide et le profil se met à jour instantanément.', meta: { avatar: 'https://i.pravatar.cc/100?img=7', role: 'Développeur Freelance' }, order: 2 },
    { type: 'testimonial', title: 'Léa V. — Photographe', body: 'Mes clients scannent mon bracelet et tombent directement sur mon portfolio. Le taux de rappel a doublé.', meta: { avatar: 'https://i.pravatar.cc/100?img=9', role: 'Photographe' }, order: 3 },
  ]);

  console.log('Marketing content created');
  console.log('\n✅ Seed terminé !');
  console.log('   Demo user: demo@smart-identity.dev / password123');
  console.log('   Admin: admin@smart-identity.dev / admin1234');
  console.log('   Page publique: /u/alex-martin');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
