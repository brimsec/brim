import appMenu from "./app-menu"
import {Brim} from "../brim"

const mockSend = jest.fn()

test("app menu mac", async () => {
  const menu = appMenu(mockSend, new Brim(), "darwin")

  expect(menu).toMatchSnapshot()
})

test("app menu windows", async () => {
  const menu = appMenu(mockSend, new Brim(), "win32")

  expect(menu).toMatchSnapshot()
})
