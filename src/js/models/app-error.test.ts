import AppError from "./app-error"

test("a raw error with a message field", () => {
  const raw = {type: "Error", message: "Sort limit reached (10)"}

  expect(new AppError(raw).message()).toBe("Sort limit reached (10)")
})
