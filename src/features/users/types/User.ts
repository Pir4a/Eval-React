export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  image?: string
  age?: number
  gender?: string
  birthDate?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  hair?: { color?: string; type?: string }
  phone?: string
  username?: string
  ip?: string
  macAddress?: string
  maidenName?: string
  password?: string
  role?: string
  university?: string
  ein?: string
  ssn?: string
  userAgent?: string
  address?: {
    address?: string
    city?: string
    state?: string
    postalCode?: string
  }
  company?: { department?: string; name?: string; title?: string }
  bank?: { cardExpire?: string; cardNumber?: string; cardType?: string; iban?: string }
  crypto?: { coin?: string; wallet?: string; network?: string }
}


