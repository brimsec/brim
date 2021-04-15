export default {
  url(value: string) {
    return "https://www.virustotal.com/gui/search/" + encodeURIComponent(value)
  }
}
