export default function firstLast<T>(array: T[]): [T | null, T | null] {
  const first = array[0] || null
  const last = array[array.length - 1] || null
  return [first, last]
}
