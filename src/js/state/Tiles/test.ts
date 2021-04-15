import initTestStore from "src/js/test/init-test-store"
import Tiles, {Tile} from "./index"

let s, d
beforeEach(() => {
  const store = initTestStore()
  d = store.dispatch
  s = (f) => f(store.getState())
})

/* Skipping tests until security summary is shipped */

test.skip("initial state", () => {
  const tiles = s(Tiles.all)
  expect(tiles.length).toBe(4)
})

test.skip("Adding a tile", () => {
  const tile: Tile = {
    id: "1",
    title: "Count by Path",
    query: "count() by _path",
    format: {type: "number"},
    layout: {x: 0, y: 0, w: 3, h: 3}
  }
  d(Tiles.create(tile))
  expect(s(Tiles.get(tile.id))).toEqual(tile)
})

test.skip("Removing a tile", () => {
  const tile: Tile = {
    id: "1",
    title: "Count by Path",
    query: "count() by _path",
    format: {type: "number"},
    layout: {x: 0, y: 0, w: 3, h: 3}
  }
  d(Tiles.create(tile))
  d(Tiles.delete(tile.id))
  expect(s(Tiles.get(tile.id))).toBe(undefined)
})
