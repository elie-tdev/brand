import { camelCase, isArray } from 'lodash'

export const keysToCamel = (o: any) => {
  if (isObject(o)) {
    const n = {}

    Object.keys(o).forEach(k => {
      n[camelCase(k)] = keysToCamel(o[k])
    })
    return n
  } else if (isArray(o)) {
    return o.map(i => {
      return keysToCamel(i)
    })
  }
  return o
}

// isObject is used for keysToCamel method.
// Lodash method isObject breaks iterable responses
const isObject = (o: any) => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function'
}
