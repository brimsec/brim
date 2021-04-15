import * as Styler from "./Styler"
import buildViewerDimens from "./build-viewer-dimens"

const dimens = buildViewerDimens({
  type: "fixed",
  size: 20,
  rowHeight: 10,
  height: 300,
  width: 400,
  sumColumnWidths: 22 + 33 + 44 + 44
})

test("#viewer", () => {
  expect(Styler.viewer(dimens)).toEqual({width: 400})
})

test("#view when fixed subtracts for header", () => {
  expect(Styler.view(dimens)).toEqual({width: 400, height: 290})
})

test("#header", () => {
  expect(Styler.header(dimens, 20)).toEqual({
    transform: "translateX(-20px)",
    width: 400
  })
})

test("#list", () => {
  expect(Styler.list(dimens)).toEqual({height: 200, width: 400})
})

test("#row", () => {
  expect(Styler.row(dimens)).toEqual({
    height: 10,
    width: 400
  })
})
