type CompareFn = (arg0: any, arg1: any) => boolean

export default class UniqArray {
  compareFn: CompareFn
  array: any[]

  constructor(compareFn: CompareFn = (a, b) => a === b) {
    this.compareFn = compareFn
    this.array = []
  }

  push(item: any) {
    if (!this.exists(item)) this.array.push(item)
  }

  exists(item: any) {
    return !!this.array.find((i) => this.compareFn(i, item))
  }

  toArray() {
    return this.array
  }
}
