// Shared helpers for any feature that uploads a user photo with a logged
// angler/name (Species catch log, Volunteer trash log, etc).

export function resizeToBlob(file, maxSize = 1000) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export async function getClientIp() {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip || ''
  } catch {
    return ''
  }
}

// Reads just enough of a JPEG's EXIF block (if present) to find the camera's
// "date taken" timestamp, before resizeToBlob() strips all metadata.
function readIfdEntries(view, tiffStart, ifdOffset, little) {
  const count = view.getUint16(ifdOffset, little)
  const entries = []
  for (let i = 0; i < count; i++) {
    const entryOffset = ifdOffset + 2 + i * 12
    entries.push({
      tag: view.getUint16(entryOffset, little),
      type: view.getUint16(entryOffset + 2, little),
      numValues: view.getUint32(entryOffset + 4, little),
      valueOffset: entryOffset + 8,
    })
  }
  return entries
}

function readAsciiEntry(view, tiffStart, entry, little) {
  const byteLength = entry.numValues
  const base =
    byteLength <= 4 ? entry.valueOffset : tiffStart + view.getUint32(entry.valueOffset, little)
  let str = ''
  for (let i = 0; i < byteLength; i++) str += String.fromCharCode(view.getUint8(base + i))
  return str.replace(/\0+$/, '')
}

function findExifDateTaken(view, tiffStart, little) {
  const firstIfdOffset = tiffStart + view.getUint32(tiffStart + 4, little)
  const ifd0 = readIfdEntries(view, tiffStart, firstIfdOffset, little)

  let fallback = null
  let exifIfdOffset = null
  for (const entry of ifd0) {
    if (entry.tag === 0x9003 && entry.type === 2) fallback = readAsciiEntry(view, tiffStart, entry, little)
    if (!fallback && entry.tag === 0x0132 && entry.type === 2) {
      fallback = readAsciiEntry(view, tiffStart, entry, little)
    }
    if (entry.tag === 0x8769) exifIfdOffset = tiffStart + view.getUint32(entry.valueOffset, little)
  }

  if (exifIfdOffset != null) {
    const exifIfd = readIfdEntries(view, tiffStart, exifIfdOffset, little)
    for (const entry of exifIfd) {
      if (entry.tag === 0x9003 && entry.type === 2) return readAsciiEntry(view, tiffStart, entry, little)
    }
  }
  return fallback
}

export async function getExifDateTaken(file) {
  try {
    const buffer = await file.slice(0, 131072).arrayBuffer()
    const view = new DataView(buffer)
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return ''

    let offset = 2
    while (offset + 4 <= view.byteLength) {
      if (view.getUint8(offset) !== 0xff) break
      const marker = view.getUint8(offset + 1)
      if (marker === 0xd9 || marker === 0xda) break
      if (marker >= 0xd0 && marker <= 0xd8) {
        offset += 2
        continue
      }
      const segLength = view.getUint16(offset + 2)
      if (marker === 0xe1) {
        const segStart = offset + 4
        const isExif =
          view.getUint8(segStart) === 0x45 &&
          view.getUint8(segStart + 1) === 0x78 &&
          view.getUint8(segStart + 2) === 0x69 &&
          view.getUint8(segStart + 3) === 0x66
        if (isExif) {
          const tiffStart = segStart + 6
          const little = view.getUint16(tiffStart) === 0x4949
          const raw = findExifDateTaken(view, tiffStart, little)
          const m = raw && raw.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/)
          return m ? `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}` : ''
        }
      }
      offset += 2 + segLength
    }
  } catch {
    return ''
  }
  return ''
}
