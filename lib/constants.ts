// Shared constants — single source of truth

export const ROLE_KEYS = [
  'role.cameriere', 'role.colf', 'role.barista', 'role.runner',
  'role.magazziniere', 'role.hostess', 'role.cuoco', 'role.lavapiatti',
  'role.addetto_pulizie', 'role.event_planner', 'role.altro'
] as const

// Keep ROLES for backward compat as the values used in DB
export const ROLES = [
  'Cameriere', 'Colf', 'Barista', 'Runner', 'Magazziniere',
  'Hostess', 'Cuoco', 'Lavapiatti', 'Addetto pulizie', 'Event Planner', 'Altro'
] as const

export type RoleName = (typeof ROLES)[number]
