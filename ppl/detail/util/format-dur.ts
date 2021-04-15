import {intervalToDuration} from "date-fns"

const units = ["years", "months", "days", "hours", "minutes", "seconds"]

// Takes two dates and returns the two most significant parts of their duration
export default function formatDir(start, end) {
  if (!start || !end) return "Not available"
  const obj = intervalToDuration({start, end})
  let allZero = true
  let parts = []
  for (const unit of units) {
    if (allZero && obj[unit] === 0) continue
    allZero = false
    parts.push(formatPart(obj[unit], unit))
  }
  if (allZero) {
    parts.push(formatPart((end.getTime() - start.getTime()) / 1000, "seconds"))
  }
  return firstTwo(parts).join(" ")
}

function formatPart(amount, unit) {
  if (amount === 1) return [amount, singular(unit)].join(" ")
  else return [amount, unit].join(" ")
}

function singular(unit) {
  return unit.replace(/s$/, "")
}

function firstTwo(array) {
  const first = []
  for (let i = 0; i < array.length; ++i) {
    if (i === 2) break
    first.push(array[i])
  }
  return first
}
