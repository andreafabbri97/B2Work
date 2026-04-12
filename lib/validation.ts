// Lightweight validation helpers for API routes

type ValidationResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string }

/**
 * Validate and sanitize a gig creation payload.
 */
export function validateGigPayload(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Payload non valido' }
  }

  const payload = raw as Record<string, unknown>

  const title = typeof payload.title === 'string' ? payload.title.trim() : ''
  if (!title || title.length > 200) {
    return { ok: false, error: 'Il titolo è obbligatorio (max 200 caratteri)' }
  }

  const description = typeof payload.description === 'string' ? payload.description.trim().slice(0, 2000) : null
  const category = typeof payload.category === 'string' ? payload.category.trim().slice(0, 50) : null
  const role = typeof payload.role === 'string' ? payload.role.trim().slice(0, 50) : null
  const location = typeof payload.location === 'string' ? payload.location.trim().slice(0, 200) : null
  const date = typeof payload.date === 'string' ? payload.date : null
  const duration_hours = typeof payload.duration_hours === 'number' && payload.duration_hours > 0 && payload.duration_hours <= 24
    ? payload.duration_hours
    : null
  const price = typeof payload.price === 'number' && payload.price > 0 && payload.price <= 100000
    ? payload.price
    : null
  const poster_id = typeof payload.poster_id === 'string' ? payload.poster_id : null

  return {
    ok: true,
    data: { title, description, category, role, location, date, duration_hours, price, poster_id },
  }
}

/**
 * Validate a booking creation payload.
 */
export function validateBookingPayload(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Payload non valido' }
  }

  const payload = raw as Record<string, unknown>

  const gig_id = typeof payload.gig_id === 'string' ? payload.gig_id : null
  const host_id = typeof payload.host_id === 'string' ? payload.host_id : null
  const colf_id = typeof payload.colf_id === 'string' ? payload.colf_id : null
  const date = typeof payload.date === 'string' ? payload.date : null
  const total_price = typeof payload.total_price === 'number' && payload.total_price >= 0
    ? payload.total_price
    : null

  if (!gig_id && !host_id && !colf_id) {
    return { ok: false, error: 'Almeno uno tra gig_id, host_id o colf_id è obbligatorio' }
  }

  return {
    ok: true,
    data: { gig_id, host_id, colf_id, date, total_price, status: 'PENDING' },
  }
}

/**
 * Validate a profile registration payload.
 */
export function validateProfilePayload(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Payload non valido' }
  }

  const payload = raw as Record<string, unknown>

  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Email non valida' }
  }

  const full_name = typeof payload.full_name === 'string' ? payload.full_name.trim().slice(0, 100) : ''
  const role = typeof payload.role === 'string' ? payload.role.trim().slice(0, 20) : 'WORKER'

  return {
    ok: true,
    data: { email, full_name, role },
  }
}
