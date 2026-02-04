import type { FieldHook } from 'payload'

const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string') {
      return value.replace(/ /g, '-').toLowerCase()
    }

    if (operation === 'create' || operation === 'update') {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return fallbackData.replace(/ /g, '-').toLowerCase()
      }
    }

    return value
  }

export default formatSlug
