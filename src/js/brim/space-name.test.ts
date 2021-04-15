import {createSpaceName} from "./space-name"

test("removes slashes at the front", () => {
  expect(createSpaceName("/file")).toEqual("file")
})

test("removes slashes at the end", () => {
  expect(createSpaceName("file/")).toEqual("file")
})

test("removes slashes at both sides", () => {
  expect(createSpaceName("/file/")).toEqual("file")
})

test("replaces slashes with underscore", () => {
  expect(createSpaceName("/file/this/that/cool")).toEqual("file_this_that_cool")
})

test("an emoji", () => {
  expect(createSpaceName("🐘")).toBe("🐘")
})

test("empty name", () => {
  expect(createSpaceName("")).toBe("Untitled")
})

test("trims space", () => {
  expect(createSpaceName("    name     ")).toBe("name")
})
