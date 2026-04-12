// Shared domain types — single source of truth for the entire app

export type UserRole = 'COLF' | 'HOST' | 'WORKER'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED'

export type GigStatus = 'OPEN' | 'FILLED' | 'CANCELLED'

export type NotificationType = 'new_application' | 'message' | 'review' | 'booking_update' | 'gig_match'

export type Profile = {
  id: string
  email: string
  full_name: string
  role: UserRole | string
  bio: string | null
  avatar_url: string | null
  city: string
  rating_avg: number
  verified?: boolean
  hourly_rate?: number
  latitude?: number | null
  longitude?: number | null
  address?: string | null
  availability?: Record<string, string[]> | null  // {"mon":["09:00-18:00"], ...}
  certificates?: string[] | null
  response_time_hours?: number | null
  phone?: string | null
  created_at?: string
}

export type Gig = {
  id: string
  poster_id: string | null
  title: string
  description?: string
  category?: string
  role?: string
  location?: string
  latitude?: number | null
  longitude?: number | null
  date?: string
  duration_hours?: number
  price?: number
  status?: GigStatus | string
  created_at?: string
}

export type Booking = {
  id: string
  host_id: string | null
  colf_id: string | null
  gig_id?: string
  status: BookingStatus
  date: string
  total_price: number | null
  created_at?: string
}

export type Category = {
  id: number
  slug: string
  name: string
}

export type Review = {
  id: string
  booking_id: string
  reviewer_id: string
  reviewed_id: string
  rating: number
  comment: string
  reviewer_name?: string
  reviewer_avatar?: string | null
  created_at?: string
}

export type Conversation = {
  id: string
  participant_1: string
  participant_2: string
  gig_id?: string | null
  last_message_at?: string
  created_at?: string
  // Joined fields
  other_user?: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'role'>
  last_message?: string
  unread_count?: number
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read_at?: string | null
  created_at?: string
}

export type Notification = {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body?: string | null
  data?: Record<string, unknown> | null
  read: boolean
  created_at?: string
}
