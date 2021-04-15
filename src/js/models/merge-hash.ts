export default class MergeHash {
  hash: any

  constructor(hash: Object = {}) {
    this.hash = hash
  }

  get(key: string, defaultVal: any = {}) {
    return this.hash[key] || defaultVal
  }

  set(key: string, data: any) {
    this.hash[key] = data
  }

  merge(key: any, data: any) {
    const value = this.get(key)

    if (value) this.set(key, {...data, ...value})
    else this.set(key, {...value})
  }

  toJSON() {
    return this.hash
  }
}
