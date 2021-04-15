import Tabs from "../../Tabs"
import Viewer from ".."
import initTestStore from "../../../test/init-test-store"

let store

const dispatch = (...args) => store.dispatch(...args)
const select = (selector): any => selector(store.getState())
const indices = () => select(Viewer.getSelection).getIndices()
const records = Array(20).fill([{name: "a", type: "b", value: "c"}])

beforeEach(() => {
  store = initTestStore()
  const id = select(Tabs.getActive)
  store.dispatch(Viewer.appendRecords(id, records))
})

test("select one row", () => {
  dispatch(Viewer.select(0))

  expect(indices()).toEqual([0])
})

test("select one row, then another", () => {
  dispatch(Viewer.select(0))
  dispatch(Viewer.select(3))

  expect(indices()).toEqual([3])
})

test("select multi one", () => {
  dispatch(Viewer.selectMulti(0))

  expect(indices()).toEqual([0])
})

test("select multi more than one", () => {
  dispatch(Viewer.selectMulti(0))
  dispatch(Viewer.selectMulti(5))
  dispatch(Viewer.selectMulti(10))

  expect(indices()).toEqual([0, 5, 10])
})

test("select mutli to deselect", () => {
  dispatch(Viewer.selectRange(2))
  dispatch(Viewer.selectMulti(1))

  expect(indices()).toEqual([0, 2])
})

test("deselect at start of range then range next", () => {
  dispatch(Viewer.select(5))
  dispatch(Viewer.selectRange(7))
  dispatch(Viewer.selectMulti(1))
  dispatch(Viewer.selectRange(3))

  dispatch(Viewer.selectMulti(1))
  dispatch(Viewer.selectRangeNext())

  expect(indices()).toEqual([2, 3, 4, 5, 6, 7])
})

test("deselect at end of range then range next", () => {
  dispatch(Viewer.select(5))
  dispatch(Viewer.selectRange(7))
  dispatch(Viewer.selectMulti(1))
  dispatch(Viewer.selectRange(3))

  dispatch(Viewer.selectMulti(3))
  dispatch(Viewer.selectRangeNext())

  expect(indices()).toEqual([1, 2, 5, 6, 7, 8])
})

test("deselect in the middle of range", () => {
  dispatch(Viewer.select(5))
  dispatch(Viewer.selectRange(7))
  dispatch(Viewer.selectMulti(1))
  dispatch(Viewer.selectRange(3))

  dispatch(Viewer.selectMulti(2))
  dispatch(Viewer.selectRangeNext())

  expect(indices()).toEqual([1, 3, 4, 5, 6, 7])
})

test("select multi outside of current range", () => {
  dispatch(Viewer.selectRange(2))
  dispatch(Viewer.selectMulti(4))
  dispatch(Viewer.selectMulti(6))
  dispatch(Viewer.selectMulti(4))
  dispatch(Viewer.selectRangeNext())

  expect(indices()).toEqual([0, 1, 2, 6, 7])
})

test("select range when no selection", () => {
  dispatch(Viewer.selectRange(2))

  expect(indices()).toEqual([0, 1, 2])
})

test("select when there is a range going backwards", () => {
  dispatch(Viewer.select(5))
  dispatch(Viewer.selectRange(3))

  expect(indices()).toEqual([3, 4, 5])
})

test("select range when you've selected a few already", () => {
  dispatch(Viewer.select(0))
  dispatch(Viewer.selectMulti(2))
  dispatch(Viewer.selectRange(5))

  expect(indices()).toEqual([0, 2, 3, 4, 5])
})

test("selecting a range forward, then backward", () => {
  dispatch(Viewer.select(3))
  dispatch(Viewer.selectRange(5))
  dispatch(Viewer.selectRange(0))

  expect(indices()).toEqual([0, 1, 2, 3])
})

test("selecting the next one", () => {
  dispatch(Viewer.selectNext())

  expect(indices()).toEqual([0])
})

test("selecting next a few times", () => {
  dispatch(Viewer.selectNext())
  dispatch(Viewer.selectNext())

  expect(indices()).toEqual([1])
})

test("selecting prev on init", () => {
  dispatch(Viewer.selectPrev())
  dispatch(Viewer.selectPrev())
  dispatch(Viewer.selectPrev())
  dispatch(Viewer.selectPrev())

  expect(indices()).toEqual([records.length - 4])
})

test("selecting next range", () => {
  dispatch(Viewer.select(18))
  dispatch(Viewer.selectRangeNext())
  dispatch(Viewer.selectRangeNext())
  dispatch(Viewer.selectRangeNext())

  expect(indices()).toEqual([18, 19])
})

test("selecting prev range", () => {
  dispatch(Viewer.select(3))
  dispatch(Viewer.selectRangePrev())
  dispatch(Viewer.selectRangePrev())
  dispatch(Viewer.selectRangePrev())
  dispatch(Viewer.selectRangePrev())

  expect(indices()).toEqual([0, 1, 2, 3])
})

test("selecting next and prev range", () => {
  dispatch(Viewer.select(3))
  dispatch(Viewer.selectRangeNext())
  dispatch(Viewer.selectRangePrev())
  dispatch(Viewer.selectRangePrev())

  expect(indices()).toEqual([2, 3])
})

test("selecting range back and forth", () => {
  dispatch(Viewer.select(3))
  dispatch(Viewer.selectRangeNext())
  dispatch(Viewer.selectRangePrev())

  expect(indices()).toEqual([3])
})

test("selecting then deselecting", () => {
  dispatch(Viewer.select(3))
  dispatch(Viewer.selectMulti(3))

  expect(indices()).toEqual([])
})

test("select range prev after sequential multi selects", () => {
  dispatch(Viewer.select(1))
  dispatch(Viewer.selectMulti(2))
  dispatch(Viewer.selectMulti(3))
  dispatch(Viewer.selectRangePrev())

  expect(indices()).toEqual([1, 2])
})

test("select range next after sequential multi selects", () => {
  dispatch(Viewer.select(3))
  dispatch(Viewer.selectRange(1))
  dispatch(Viewer.selectRangePrev())
  dispatch(Viewer.selectRangeNext())

  expect(indices()).toEqual([1, 2, 3])
})

test("select range next when entering new range", () => {
  dispatch(Viewer.select(3))
  dispatch(Viewer.selectMulti(4))
  dispatch(Viewer.selectMulti(1))
  dispatch(Viewer.selectRangeNext())
  dispatch(Viewer.selectRangeNext())

  expect(indices()).toEqual([1, 2, 3, 4, 5])
})

test("select range prev when entering new range", () => {
  dispatch(Viewer.select(3))
  dispatch(Viewer.selectMulti(4))
  dispatch(Viewer.selectMulti(6))
  dispatch(Viewer.selectRangePrev())
  dispatch(Viewer.selectRangePrev())

  expect(indices()).toEqual([2, 3, 4, 5, 6])
})

test("selectAll", () => {
  dispatch(Viewer.selectAll())

  expect(indices().length).toEqual(records.length)
})
