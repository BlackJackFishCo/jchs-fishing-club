const CURRENT_BUILD = import.meta.env.VITE_BUILD_TIME

let checking = false

export async function checkForUpdate() {
  if (checking || !CURRENT_BUILD) return
  checking = true

  try {
    const res = await fetch(`${import.meta.env.BASE_URL}version.json`, { cache: 'no-store' })
    if (!res.ok) return

    const { buildTime } = await res.json()
    if (buildTime && buildTime !== CURRENT_BUILD) {
      const url = new URL(window.location.href)
      url.searchParams.set('_v', buildTime)
      window.location.replace(url.toString())
    }
  } catch {
    // offline or network hiccup — try again on the next check
  } finally {
    checking = false
  }
}
