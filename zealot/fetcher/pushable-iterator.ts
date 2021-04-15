type IteratorResult<T> =
  | {value: T; done: false}
  | {value: undefined; done: true}

type PendingPromise<T> = {
  resolve: (result: T) => void
  reject: (error: Error) => void
}

export const createPushableIterator = <T>() => {
  const pendingPromises: PendingPromise<IteratorResult<T>>[] = []
  const pendingResults: IteratorResult<T>[] = []

  let done = false
  let err: Error | null = null

  const createPendingPromise = (): Promise<IteratorResult<T>> =>
    new Promise((resolve, reject) => pendingPromises.push({resolve, reject}))

  return {
    push(result: IteratorResult<T>): void {
      const p = pendingPromises.shift()
      p ? p.resolve(result) : pendingResults.push(result)
    },
    next(): Promise<IteratorResult<T>> {
      if (err) return this.throw(err)
      if (done) return this.return()
      const result = pendingResults.shift()
      if (result) {
        return result.done ? this.return() : Promise.resolve(result)
      } else {
        return createPendingPromise()
      }
    },
    throw(e: Error) {
      err = e
      const p = pendingPromises.shift()
      if (p) p.reject(err)
      return Promise.reject(err)
    },
    return(): Promise<IteratorResult<T>> {
      done = true
      const p = pendingPromises.shift()
      if (p) p.resolve({done: true, value: undefined})
      return Promise.resolve({done: true, value: undefined})
    },
    [Symbol.asyncIterator]() {
      return this
    }
  }
}
