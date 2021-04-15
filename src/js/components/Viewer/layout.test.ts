import buildViewerDimens from "./build-viewer-dimens"

describe("AutoLayout", () => {
  const autoLayout = buildViewerDimens({
    height: 500,
    width: 960,
    size: 200,
    rowHeight: 10,
    type: "auto",
    sumColumnWidths: 0
  })

  test("#viewHeight ", () => {
    expect(autoLayout.viewHeight).toBe(500)
  })

  test("#viewWidth", () => {
    expect(autoLayout.viewWidth).toBe(960)
  })

  test("#listHeight", () => {
    expect(autoLayout.listHeight).toBe(2000)
  })

  test("#listWidth", () => {
    expect(autoLayout.listWidth).toBe("auto")
  })

  test("#rowHeight", () => {
    expect(autoLayout.rowHeight).toBe(10)
  })
})

describe("FixedLayout", () => {
  const fixedLayout = buildViewerDimens({
    type: "fixed",
    height: 500,
    width: 100,
    rowHeight: 10,
    sumColumnWidths: 22 + 44 + 55,
    size: 200
  })

  test("#viewHeight", () => {
    expect(fixedLayout.viewHeight).toBe(490)
  })

  test("#listWidth when sum of column widths > width", () => {
    const fixedLayout = buildViewerDimens({
      type: "fixed",
      height: 500,
      width: 10,
      rowHeight: 10,
      sumColumnWidths: 22 + 44 + 55,
      size: 200
    })
    expect(fixedLayout.listWidth).toBe(121)
    expect(fixedLayout.rowWidth).toBe(121)
  })

  test("#listWidth ", () => {
    const fixedLayout = buildViewerDimens({
      type: "fixed",
      height: 500,
      width: 500,
      rowHeight: 10,
      sumColumnWidths: 22 + 44 + 55,
      size: 200
    })
    expect(fixedLayout.listWidth).toBe(500)
    expect(fixedLayout.rowWidth).toBe(500)
  })

  test("#rowWidth is same as listWidth", () => {
    const fixedLayout = buildViewerDimens({
      type: "fixed",
      height: 500,
      width: 100,
      rowHeight: 10,
      sumColumnWidths: 22 + 44 + 55,
      size: 200
    })
    expect(fixedLayout.rowWidth).toBe(121)
  })
})
