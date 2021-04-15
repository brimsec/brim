import Chunker from "./Chunker"

let chunker
beforeEach(() => {
  chunker = new Chunker({
    size: 1000,
    height: 50,
    rowHeight: 10,
    chunkSize: 5,
    overScan: 1
  })
})

test("#visibleChunks height = 1", () => {
  chunker.height = 1
  expect(chunker.visibleChunks(0)).toEqual([0, 1])
})

test("#visibleChunks height = 50", () => {
  expect(chunker.visibleChunks(0)).toEqual([0, 1])
})

test("#visibleChunks height = 51", () => {
  chunker.height = 51
  expect(chunker.visibleChunks(0)).toEqual([0, 1, 2])
})

test("#visibleChunks height = 50, scrollTop = 50", () => {
  expect(chunker.visibleChunks(50)).toEqual([0, 1, 2])
})

test("#visibleChunks height = 58, scrollTop = 50", () => {
  chunker.height = 58
  expect(chunker.visibleChunks(50)).toEqual([0, 1, 2, 3])
})

test("#visibleChunks height = 50, scrollTop = 51", () => {
  expect(chunker.visibleChunks(51)).toEqual([0, 1, 2])
})

test("#visibleChunks height = 50, scrollTop = 9950 at the bottom", () => {
  expect(chunker.visibleChunks(9950)).toEqual([198, 199])
})

test("#visibleChunks when scrolled past the bottom", () => {
  expect(chunker.visibleChunks(9999)).toEqual([198, 199])
})

test("#visibleChunks when scrolled past the beginning", () => {
  expect(chunker.visibleChunks(-1)).toEqual([0, 1])
})

test("#visibleChunks when in the middle", () => {
  chunker.chunkSize = 2

  expect(chunker.visibleChunks(444)).toEqual([21, 22, 23, 24, 25])
  expect([
    ...chunker.rows(22),
    ...chunker.rows(23),
    ...chunker.rows(24)
  ]).toEqual([44, 45, 46, 47, 48, 49])
})

test("#visibleChunks always changes together", () => {
  chunker.height = 100
  expect(chunker.visibleChunks(0)).toEqual([0, 1, 2])
  expect(chunker.visibleChunks(1)).toEqual([0, 1, 2])
  expect(chunker.visibleChunks(49)).toEqual([0, 1, 2])
  expect(chunker.visibleChunks(50)).toEqual([0, 1, 2, 3])
  expect(chunker.visibleChunks(51)).toEqual([0, 1, 2, 3])
  expect(chunker.visibleChunks(99)).toEqual([0, 1, 2, 3])
  expect(chunker.visibleChunks(100)).toEqual([1, 2, 3, 4])
  expect(chunker.visibleChunks(101)).toEqual([1, 2, 3, 4])
})

test("#visibleChunks overScan = 2", () => {
  chunker.height = 100
  chunker.overScan = 2
  expect(chunker.visibleChunks(0)).toEqual([0, 1, 2, 3])
})

test("#visibleChunks overScan = 1", () => {
  chunker.height = 100
  chunker.overScan = 1
  expect(chunker.visibleChunks(0)).toEqual([0, 1, 2])
})

test("#visibleChunks overScan = 2 in the middle", () => {
  chunker.height = 100
  chunker.overScan = 2
  expect(chunker.visibleChunks(525)).toEqual([8, 9, 10, 11, 12, 13])
})

test("#visibleChunks overScan = 2 at the end", () => {
  chunker.height = 100
  chunker.overScan = 2

  expect(chunker.visibleChunks(9950)).toEqual([197, 198, 199])
})

test("#rows for first chunk", () => {
  chunker.height = 100
  expect(chunker.rows(0)).toEqual([0, 1, 2, 3, 4])
})
test("#rows for last chunk", () => {
  chunker.height = 100
  expect(chunker.rows(199)).toEqual([995, 996, 997, 998, 999])
})
test("#rows for last chunk odd numbers", () => {
  chunker.height = 100
  chunker.chunkSize = 7
  expect(chunker.rows(141)).toEqual([987, 988, 989, 990, 991, 992, 993])
  expect(chunker.rows(142)).toEqual([994, 995, 996, 997, 998, 999])
})

test("#rows for first chunk size less than chunk size", () => {
  chunker.size = 3
  chunker.height = 100
  chunker.chunkSize = 7
  expect(chunker.rows(0)).toEqual([0, 1, 2])
})
