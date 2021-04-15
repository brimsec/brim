interface BrimSearchParams {
  id: string
  href
}

export default function getUrlSearchParams(): BrimSearchParams {
  const urlSearchParams = new URLSearchParams(window.location.search)
  // @ts-ignore
  return Object.fromEntries(urlSearchParams.entries())
}
