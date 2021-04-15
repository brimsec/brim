export type Locator = {
  props: {"data-test-locator": string}
  css: string
}

export default function createLocator(name: string): Locator {
  return {
    props: {"data-test-locator": name},
    css: `[data-test-locator="${name}"]`
  }
}
