import anime from "animejs"

export default function clickFeedback(el: Element, text: string) {
  const rect = el.getBoundingClientRect()
  const div = document.createElement("div")
  div.className = "click-feedback"
  div.innerHTML = text

  if (document.body) document.body.append(div)
  const {width} = div.getBoundingClientRect()

  anime
    .timeline({targets: div, duration: 500})
    .add({
      translateX: {
        value: rect.left + rect.width / 2 - width / 2,
        duration: 0
      },
      translateY: [rect.top, rect.top - 2 - rect.height],
      opacity: [0, 1],
      scale: [0.5, 1],
      endDelay: 1000
    })
    .add({
      easing: "easeOutSine",
      opacity: [1, 0]
    })
    .finished.then(() => div.remove())
}
