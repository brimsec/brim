const {kabobCase} = require("lodash")
const moment = require("moment")
const path = require("path")
const {write} = require("../utils/file")
const lastVersion = require("../../package.json").version

async function handleMigration(input) {
  let name = kabobCase(input)
  let version = moment().format("YYYYMMDDHHmm")
  let title = version + "_" + name
  let file = title + ".ts"
  let test = title + ".test.ts"
  let dir = path.join(__dirname, "../../src/js/state/migrations")

  write(path.join(dir, file), contents(name))
  write(path.join(dir, test), testContents(title, version))
}

function contents(name) {
  return `
export default function ${name}(state: any) {
  // Migrate state here
  return state
}
`
}

function testContents(title, version) {
  return `import {migrate} from "src/js/test/helpers/migrate"

test("migrating ${title}", async () => {
  const next = await migrate({state: "v${lastVersion}", to: "${version}"})

  expect(next).toBe("what you'd expect")
})
`
}

module.exports = {handleMigration}
