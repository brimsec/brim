import initTestStore from "../../test/init-test-store"
import Queries from "./"
import {Group} from "./types"
import get from "lodash/get"

let store
beforeEach(() => {
  store = initTestStore()
})

const testLib = {
  id: "root",
  name: "root",
  items: [
    {
      // .items[0]
      id: "testId1",
      name: "testName1",
      items: [
        {
          // .items[0].items[0]
          id: "testId2",
          name: "testName2",
          description: "testDescription2",
          value: "testValue2",
          tags: ["testTag1", "testTag2"]
        },
        {
          // .items[0].items[1]
          id: "testId3",
          name: "testName3",
          items: [
            {
              // .items[0].items[1].items[0]
              id: "testId4",
              name: "testName4",
              description: "testDescription4",
              value: "testValue4",
              tags: ["testTag2"]
            }
          ]
        },
        {
          // .items[0].items[2]
          id: "testId5",
          name: "testName5",
          description: "testDescription5",
          value: "testValue5",
          tags: ["testTag1"]
        }
      ]
    }
  ]
}

const newQuery = {
  id: "newQueryId",
  name: "newQueryName",
  description: "newQueryDescription",
  value: "newQueryValue",
  tags: []
}

const newGroup = {
  id: "newGroupId",
  name: "newGroupName",
  items: []
}

const getGroup = (path: number[]): Group => {
  return get(
    Queries.getRaw(store.getState()),
    path.map((pathNdx) => `items[${pathNdx}]`).join(".")
  )
}

test("set all", () => {
  store.dispatch(Queries.setAll(testLib))

  const state = store.getState()

  expect(Queries.getRaw(state)).toEqual(testLib)
})

test("add query", () => {
  store.dispatch(Queries.setAll(testLib))

  const parentGroup = getGroup([0])
  expect(parentGroup.items).toHaveLength(3)

  store.dispatch(Queries.addItem(newQuery, parentGroup))

  expect(getGroup([0]).items).toHaveLength(4)
  expect(getGroup([0]).items[3]).toEqual(newQuery)
})

test("add query, nested", () => {
  store.dispatch(Queries.setAll(testLib))

  const parentGroup = getGroup([0, 1])
  expect(parentGroup.items).toHaveLength(1)

  store.dispatch(Queries.addItem(newQuery, parentGroup))

  expect(getGroup([0, 1]).items).toHaveLength(2)
  expect(getGroup([0, 1]).items[1]).toEqual(newQuery)
})

test("add group, add query to new group", () => {
  store.dispatch(Queries.setAll(testLib))

  const parentGroup = getGroup([0])
  expect(parentGroup.items).toHaveLength(3)

  store.dispatch(Queries.addItem(newGroup, parentGroup))

  expect(getGroup([0]).items).toHaveLength(4)
  expect(getGroup([0]).items[3]).toEqual(newGroup)
  expect(getGroup([0, 3]).items).toHaveLength(0)

  store.dispatch(Queries.addItem(newQuery, newGroup))

  expect(getGroup([0, 3]).items).toHaveLength(1)
  expect(getGroup([0, 3]).items[0]).toEqual(newQuery)
})

test("remove query, group", () => {
  store.dispatch(Queries.setAll(testLib))

  const testName1Group = getGroup([0])
  expect(testName1Group.items).toHaveLength(3)

  store.dispatch(Queries.removeItems([getGroup([0]).items[0]]))

  expect(getGroup([0]).items).toHaveLength(2)
  expect(getGroup([0]).items).toEqual(testName1Group.items.slice(1))

  store.dispatch(Queries.removeItems([getGroup([0]).items[0]]))
  expect(getGroup([0]).items).toHaveLength(1)
  expect(getGroup([0]).items).toEqual([testName1Group.items[2]])
})

test("move query, same group, different group same depth", () => {
  store.dispatch(Queries.setAll(testLib))

  const testName1Group = getGroup([0])
  expect(testName1Group.items).toHaveLength(3)

  const testName2Query = testName1Group.items[0]

  // move to end
  store.dispatch(Queries.moveItems([getGroup([0]).items[0]], getGroup([0]), 2))

  expect(getGroup([0]).items).toHaveLength(3)

  expect(getGroup([0]).items).toEqual([
    ...testName1Group.items.slice(1),
    testName2Query
  ])

  // move back to beginning
  store.dispatch(Queries.moveItems([getGroup([0]).items[2]], getGroup([0]), 0))

  expect(getGroup([0]).items).toHaveLength(3)
  expect(getGroup([0]).items).toEqual(testName1Group.items)

  // move to "uncle's" group
  store.dispatch(Queries.addItem(newGroup, getGroup([0])))

  expect(getGroup([0, 1]).items).toHaveLength(1)
  expect(getGroup([0, 3]).items).toHaveLength(0)

  const testName4Query = getGroup([0, 1]).items[0]

  store.dispatch(
    Queries.moveItems([getGroup([0, 1]).items[0]], getGroup([0, 3]), 0)
  )

  expect(getGroup([0, 1]).items).toHaveLength(0)
  expect(getGroup([0, 3]).items).toHaveLength(1)
  expect(getGroup([0, 3]).items[0]).toEqual(testName4Query)
})

test("move query, different group", () => {
  store.dispatch(Queries.setAll(testLib))

  const testName1Group = getGroup([0])
  const testName3Group = getGroup([0, 1])

  expect(testName1Group.items).toHaveLength(3)
  expect(testName3Group.items).toHaveLength(1)

  const testName2Query = testName1Group.items[0]

  store.dispatch(Queries.moveItems([testName2Query], testName3Group, 0))

  const newTestName1Group = getGroup([0])
  const newTestName3Group = getGroup([0, 0])

  expect(newTestName1Group.items).toHaveLength(2)
  expect(newTestName3Group.items).toHaveLength(2)

  expect(newTestName1Group.items[0].id).toEqual(testName1Group.items[1].id)
  expect(newTestName3Group.items).toEqual([
    testName2Query,
    ...testName3Group.items
  ])
})

test("edit query", () => {
  store.dispatch(Queries.setAll(testLib))

  store.dispatch(Queries.editItem(newQuery, "testId2"))
  expect(getGroup([0]).items[0]).toEqual(newQuery)
})

test("edit group", () => {
  store.dispatch(Queries.setAll(testLib))

  store.dispatch(Queries.editItem(newGroup, "testId3"))
  expect(getGroup([0, 1])).toEqual(newGroup)
})
