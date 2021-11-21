import type { Reference } from './index'

// return current mouse position relative to reference element in listener
function getMouseOverVector (event: MouseEvent) {
  const position = getCursorPosition(event, event.currentTarget as HTMLElement)
  const dimension = getRefSize(event.currentTarget as HTMLElement)

  return {
    x: (Math.round((position.x / dimension.x) * 100) / 100),
    y: (Math.round((position.y / dimension.y) * 100) / 100)
  }
}

function getRefSize (el: Reference) {
  if (el instanceof Window) {
    return {
      x: el.innerWidth,
      y: el.innerHeight
    }
  }
  return {
    x: el.offsetWidth,
    y: el.offsetHeight
  }
}
function getCursorPosition (ev: MouseEvent, el: Reference) {
  if (el instanceof Window) {
    return {
      x: ev.clientX,
      y: ev.clientY
    }
  }
  const rect = el.getBoundingClientRect()
  return {
    x: ((ev.clientX - rect.left)),
    y: ((ev.clientY - rect.top))
  }
}

export {
  getMouseOverVector
}
