import type { Product } from '../types'

export const PRODUCT: Product = {
  id: 'chargly-pb-10000',
  name: 'Mini Magnetic Wireless Power Bank 10000mAh',
  brand: 'Chargly',
  price: 29.99,
  comparePrice: 59.99,
  currency: 'USD',
  description:
    'Carga tu iPhone o Android sin cables. Nuestro power bank magnético se adhiere a tu teléfono con tecnología MagSafe y entrega 10000mAh de energía pura en un diseño ultra delgado que cabe en cualquier bolsillo.',
  features: [
    'Carga magnética inalámbrica — se adhiere al teléfono al instante',
    'Capacidad de 10000mAh — carga completa 2+ veces',
    'Ultra delgado (12mm) — cabe en cualquier bolsillo',
    'Compatible con iPhone 12+ y Android con MagSafe',
    'Carga rápida 15W inalámbrica + USB-C 20W',
    'Indicador LED de carga restante',
    'Protección contra sobrecarga y sobrecalentamiento',
    'Incluye cable USB-C de carga',
  ],
  specs: {
    'Capacidad': '10000mAh / 37Wh',
    'Entrada': 'USB-C 20W',
    'Salida inalámbrica': '15W (Qi + MagSafe)',
    'Salida USB-C': '20W PD',
    'Dimensiones': '107 × 68 × 12mm',
    'Peso': '180g',
    'Compatibilidad': 'iPhone 12/13/14/15/16, Android con MagSafe',
    'Certificaciones': 'CE, FCC, RoHS',
    'Color': 'Blanco',
    'En la caja': 'Power bank, cable USB-C, manual',
  },
  images: [
    '/img/product-1.svg',
    '/img/product-2.svg',
    '/img/product-3.svg',
  ],
}
