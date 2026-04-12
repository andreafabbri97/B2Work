// Shared constants — single source of truth

export const ROLES = [
  'Cameriere',
  'Colf',
  'Barista',
  'Runner',
  'Magazziniere',
  'Hostess',
  'Cuoco',
  'Lavapiatti',
  'Addetto pulizie',
  'Event Planner',
  'Altro',
] as const

export type RoleName = (typeof ROLES)[number]
