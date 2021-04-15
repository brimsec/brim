export default function() {
  appendDivId("app-root")
  appendDivId("notification-root")
  appendDivId("modal-root")
  appendDivId("tooltip-root")
  appendDivId("context-menu-root")
  appendDivId("measure-layer")
  detectInputType()
}

function appendDivId(id: string) {
  const div = document.createElement("div")
  div.id = id
  if (document.body) document.body.appendChild(div)
}

function detectInputType() {
  document.addEventListener("mousedown", () => {
    const el = document.body
    if (!el) return
    el.classList.add("using-mouse")
    el.classList.remove("using-keyboard")
  })
  document.addEventListener("keydown", () => {
    const el = document.body
    if (!el) return
    el.classList.add("using-keyboard")
    el.classList.remove("using-mouse")
  })
}
