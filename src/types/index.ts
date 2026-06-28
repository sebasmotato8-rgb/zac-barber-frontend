export interface Product {
  id: string
  name: string
  brand: string
  price: number
  comparePrice: number
  currency: string
  description: string
  features: string[]
  specs: Record<string, string>
  images: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface OrderData {
  name: string
  email: string
  address: string
  city: string
  country: string
  phone: string
}
