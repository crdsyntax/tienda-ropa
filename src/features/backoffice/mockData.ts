import type { BackofficeProduct, Order } from './types';

export const MOCK_PRODUCTS: BackofficeProduct[] = [
  { id: 'p1', name: 'Camiseta Algodón Premium', sku: 'CAM-001', description: 'Camiseta de algodón 100% orgánico, corte relajado.', price: 29.99, originalPrice: null, currency: 'USD', stock: 45, category: 'Camisetas', status: 'active', images: ['https://placehold.co/200x200/E2E8F0/475569?text=CAM-001'], brand: 'CottonShop', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blanco', 'Negro'] },
  { id: 'p2', name: 'Pantalón Chino Slim Fit', sku: 'PAN-002', description: 'Pantalón chino de corte slim con acabado lavado suave.', price: 59.99, originalPrice: null, currency: 'USD', stock: 3, category: 'Pantalones', status: 'active', images: ['https://placehold.co/200x200/E2E8F0/475569?text=PAN-002'], brand: 'CottonShop', sizes: ['30', '32', '34', '36'], colors: ['Beige', 'Negro', 'Azul'] },
  { id: 'p3', name: 'Chaqueta Vaquera Clásica', sku: 'CHQ-003', description: 'Chaqueta vaquera con corte clásico y botones metálicos.', price: 89.99, originalPrice: null, currency: 'USD', stock: 12, category: 'Chaquetas', status: 'active', images: ['https://placehold.co/200x200/E2E8F0/475569?text=CHQ-003'], brand: 'DenimCo', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Azul', 'Negro'] },
  { id: 'p4', name: 'Vestido Floral Verano', sku: 'VES-004', description: 'Vestido ligero con estampado floral.', price: 49.99, originalPrice: null, currency: 'USD', stock: 20, category: 'Vestidos', status: 'active', images: ['https://placehold.co/200x200/E2E8F0/475569?text=VES-004'], brand: 'FloraMode', sizes: ['XS', 'S', 'M', 'L'], colors: ['Rosa', 'Azul'] },
  { id: 'p5', name: 'Sudadera Oversize', sku: 'SUD-005', description: 'Sudadera de algodón con corte oversized y capucha.', price: 44.99, originalPrice: 59.99, currency: 'USD', stock: 2, category: 'Sudaderas', status: 'active', images: ['https://placehold.co/200x200/E2E8F0/475569?text=SUD-005'], brand: 'UrbanStyle', sizes: ['M', 'L', 'XL'], colors: ['Gris', 'Negro'] },
  { id: 'p6', name: 'Short Deportivo', sku: 'SHR-006', description: 'Short deportivo con tecnología de secado rápido.', price: 24.99, originalPrice: null, currency: 'USD', stock: 30, category: 'Shorts', status: 'active', images: ['https://placehold.co/200x200/E2E8F0/475569?text=SHR-006'], brand: 'SportFit', sizes: ['S', 'M', 'L', 'XL'], colors: ['Negro', 'Gris'] },
  { id: 'p7', name: 'Camiseta Estampada Edición Limitada', sku: 'CAM-007', description: 'Camiseta con estampado exclusivo edición limitada.', price: 34.99, originalPrice: null, currency: 'USD', stock: 0, category: 'Camisetas', status: 'draft', images: ['https://placehold.co/200x200/E2E8F0/475569?text=CAM-007'], brand: 'UrbanStyle', sizes: ['S', 'M', 'L'], colors: ['Blanco'] },
  { id: 'p8', name: 'Cinturón Cuero Premium', sku: 'ACC-008', description: 'Cinturón de cuero genuino con hebilla metálica.', price: 39.99, originalPrice: null, currency: 'USD', stock: 4, category: 'Accesorios', status: 'active', images: ['https://placehold.co/200x200/E2E8F0/475569?text=ACC-008'], brand: 'CottonShop', sizes: ['S', 'M', 'L'], colors: ['Negro', 'Café'] },
  { id: 'p9', name: 'Pantalón Cargo Militar', sku: 'PAN-009', description: 'Pantalón cargo con múltiples bolsillos y corte militar.', price: 69.99, originalPrice: null, currency: 'USD', stock: 15, category: 'Pantalones', status: 'active', images: ['https://placehold.co/200x200/E2E8F0/475569?text=PAN-009'], brand: 'DenimCo', sizes: ['30', '32', '34'], colors: ['Verde Oliva', 'Negro'] },
  { id: 'p10', name: 'Chamarra Bomber Acolchada', sku: 'CHQ-010', description: 'Chamarra bomber con forro acolchado y cierre frontal.', price: 99.99, originalPrice: null, currency: 'USD', stock: 8, category: 'Chaquetas', status: 'draft', images: ['https://placehold.co/200x200/E2E8F0/475569?text=CHQ-010'], brand: 'UrbanStyle', sizes: ['S', 'M', 'L', 'XL'], colors: ['Verde Oliva', 'Negro'] },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001', customer: 'María García', customerEmail: 'maria@email.com', customerPhone: '+52 55 1111 2233',
    date: '2026-07-24', total: 149.97, status: 'pending',
    items: [
      { productId: 'p1', productName: 'Camiseta Algodón Premium', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=CAM-001', size: 'M', quantity: 2, price: 29.99 },
      { productId: 'p4', productName: 'Vestido Floral Verano', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=VES-004', size: 'S', quantity: 1, price: 49.99 },
      { productId: 'p8', productName: 'Cinturón Cuero Premium', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=ACC-008', size: 'M', quantity: 1, price: 39.99 },
    ],
    paymentMethod: 'Tarjeta de crédito •••• 4242', address: 'Calle Reforma #456, Col. Juárez, CDMX',
  },
  {
    id: 'ORD-002', customer: 'Carlos López', customerEmail: 'carlos@email.com', customerPhone: '+52 55 2222 3344',
    date: '2026-07-23', total: 89.99, status: 'shipped',
    items: [
      { productId: 'p3', productName: 'Chaqueta Vaquera Clásica', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=CHQ-003', size: 'L', quantity: 1, price: 89.99 },
    ],
    paymentMethod: 'Transferencia SPEI', address: 'Av. Insurgentes #789, Col. Del Valle, CDMX',
  },
  {
    id: 'ORD-003', customer: 'Ana Martínez', customerEmail: 'ana@email.com', customerPhone: '+52 55 3333 4455',
    date: '2026-07-22', total: 129.98, status: 'delivered',
    items: [
      { productId: 'p2', productName: 'Pantalón Chino Slim Fit', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=PAN-002', size: '32', quantity: 1, price: 59.99 },
      { productId: 'p6', productName: 'Short Deportivo', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=SHR-006', size: 'M', quantity: 2, price: 24.99 },
    ],
    paymentMethod: 'Tarjeta de débito •••• 1111', address: 'Blvd. Constitución #321, Col. Centro, CDMX',
  },
  {
    id: 'ORD-004', customer: 'Roberto Sánchez', customerEmail: 'roberto@email.com', customerPhone: '+52 55 4444 5566',
    date: '2026-07-21', total: 44.99, status: 'cancelled',
    items: [
      { productId: 'p5', productName: 'Sudadera Oversize', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=SUD-005', size: 'XL', quantity: 1, price: 44.99 },
    ],
    paymentMethod: 'PayPal', address: 'Calle Durango #159, Col. Roma, CDMX',
  },
  {
    id: 'ORD-005', customer: 'Laura Fernández', customerEmail: 'laura@email.com', customerPhone: '+52 55 5555 6677',
    date: '2026-07-20', total: 209.97, status: 'pending',
    items: [
      { productId: 'p9', productName: 'Pantalón Cargo Militar', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=PAN-009', size: '32', quantity: 1, price: 69.99 },
      { productId: 'p3', productName: 'Chaqueta Vaquera Clásica', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=CHQ-003', size: 'M', quantity: 1, price: 89.99 },
      { productId: 'p1', productName: 'Camiseta Algodón Premium', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=CAM-001', size: 'L', quantity: 1, price: 29.99 },
    ],
    paymentMethod: 'Tarjeta de crédito •••• 5678', address: 'Av. Universidad #1000, Col. Narvarte, CDMX',
  },
  {
    id: 'ORD-006', customer: 'Pedro Jiménez', customerEmail: 'pedro@email.com', customerPhone: '+52 55 6666 7788',
    date: '2026-07-19', total: 59.99, status: 'shipped',
    items: [
      { productId: 'p2', productName: 'Pantalón Chino Slim Fit', productImage: 'https://placehold.co/200x200/E2E8F0/475569?text=PAN-002', size: '34', quantity: 1, price: 59.99 },
    ],
    paymentMethod: 'Transferencia SPEI', address: 'Calle Puebla #555, Col. Condesa, CDMX',
  },
];
