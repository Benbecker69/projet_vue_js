const { z } = require('zod');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const orderItemInput = z.object({
  productId: z.string(),
  variantSku: z.string(),
  qty: z.number().int().min(1).max(10),
});

const createOrderSchema = z.object({
  items: z.array(orderItemInput).min(1, 'Panier vide'),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    line1: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().default('FR'),
  }),
});

async function createOrder(req, res) {
  const { items, shippingAddress } = createOrderSchema.parse(req.body);

  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new AppError(`Produit introuvable : ${item.productId}`, 400);

    const variant = product.variants.find(v => v.sku === item.variantSku);
    if (!variant) throw new AppError(`Variante introuvable : ${item.variantSku}`, 400);

    const lineTotal = product.price * item.qty;
    total += lineTotal;

    orderItems.push({
      product: product._id,
      variantSku: variant.sku,
      name: `${product.name} — ${variant.color}`,
      unitPrice: product.price,
      qty: item.qty,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    total: Math.round(total * 100) / 100,
    shippingAddress,
  });

  res.status(201).json({ order });
}

async function listOrders(req, res) {
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('items.product', 'name slug images');
  res.json({ orders });
}

async function getOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .populate('items.product', 'name slug images');
  if (!order) throw new AppError('Commande introuvable', 404, 'ORDER_NOT_FOUND');
  res.json({ order });
}

module.exports = { createOrder, listOrders, getOrder };
