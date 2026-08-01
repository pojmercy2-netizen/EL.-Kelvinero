import {
  mysqlTable,
  int,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core'

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashed_password: varchar('hashed_password', { length: 255 }).notNull(),
  is_admin: boolean('is_admin').default(false),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  created_at: timestamp('created_at').defaultNow(),
})

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = mysqlTable('categories', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
})

// ─── Collections ──────────────────────────────────────────────────────────────
export const collections = mysqlTable('collections', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
})

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = mysqlTable('products', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  category_id: int('category_id'),
  collection_id: int('collection_id'),
  image: varchar('image', { length: 500 }),
  stock: int('stock').default(50),
  size: text('size'),
  color: text('color'),
  created_at: timestamp('created_at').defaultNow(),
})

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  customer_name: varchar('customer_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  shipping_address: text('shipping_address'),
  total_price: decimal('total_price', { precision: 12, scale: 2 }),
  status: varchar('status', { length: 50 }).default('Pending'),
  payment_status: varchar('payment_status', { length: 50 }).default('Unpaid'),
  created_at: timestamp('created_at').defaultNow(),
})

// ─── Order Items ──────────────────────────────────────────────────────────────
export const order_items = mysqlTable('order_items', {
  id: int('id').autoincrement().primaryKey(),
  order_id: int('order_id'),
  product_id: int('product_id'),
  quantity: int('quantity').notNull(),
  unit_price: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
})

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settings = mysqlTable('settings', {
  key: varchar('key', { length: 255 }).primaryKey(),
  value: text('value').notNull(),
})
