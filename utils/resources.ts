export const normalizeResources = (
  raw: Record<string, string>,
  prefix: 'ac' | 'ep'
) => {
  if (process.env.NODE_ENV !== 'production') {
    const devMessages = require('../../../dev-utils/resources/dev-messages.json')

    Object.keys(devMessages).forEach(devRid => {
      raw[devRid] = devMessages[devRid]
    })
  }

  const normalized: typeof raw = {}

  // Remove `ep.` prefix
  for (const key of Object.keys(raw)) {
    normalized[key.startsWith(`${prefix}.`) ? key.substr(3) : key] = raw[key]
  }

  return normalized
}
