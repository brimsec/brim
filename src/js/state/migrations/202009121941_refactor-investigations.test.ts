import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202009121941_refactorInvestigations", async () => {
  const next = await migrate({state: "v0.17.0", to: "202009121941"})
  const space1 = "sp_1hWwRQKtTnWlkr7w57k91Ofw2Sr"
  const space2 = "sp_1hWwT27GJg9kHqgrVanqvvO5Ke5"
  const space3 = "sp_1hWwTowuLDqnmIE4u5SrYIPq86k"

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    const investigations = state.investigation["localhost:9867"]

    expect(investigations[space1]).toHaveLength(1)
    expect(investigations[space2]).toHaveLength(2)
    expect(investigations[space3]).toHaveLength(3)
  }
})
