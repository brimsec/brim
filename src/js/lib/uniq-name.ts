function join(name, num) {
  return num === 0 ? name : [name, `(${num})`].join(" ")
}

export function getUniqName(proposal: string, existing: string[]) {
  let i = 0
  while (existing.includes(join(proposal, i))) i++
  return join(proposal, i)
}
