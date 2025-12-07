// Simple clsx implementation for className merging
export type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const nested = clsx(...input)
      if (nested) classes.push(nested)
    }
  }

  return classes.join(' ')
}
