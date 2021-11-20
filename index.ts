import { getMouseOverVector } from './computations'

type Reference<T extends HTMLElement = HTMLElement> = Document | Window | T

type EventObject<T extends HTMLElement = HTMLElement> = {
  element: Reference<T>,
  type: string,
  function: (ev: any) => void
}

type PositionVector = {
  x: number,
  y: number
}

type MouserOptions = {
  restState?: {x: number, y: number},
  refreshRate?: number,
  reference?: Reference
}

class Mouser {
  private static _instance: Mouser

  private reference: Reference
  private refreshRate: number
  private eventListeners: EventObject[] = []
  private restState: PositionVector

  public vector: PositionVector

  public constructor ({
    reference = window,
    restState = {
      x: 0,
      y: 0
    },
    refreshRate = 0
  }: MouserOptions = {}) {
    this.reference = reference
    this.restState = restState
    this.refreshRate = refreshRate
    this.vector = this.restState

    this.registerEvents()
  }

  public static Instance (params: MouserOptions) {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this(params))
  }

  public addReference (el: Reference) {
    this.reference = el
  }

  public removeReference () {
    this.reference = window
  }

  public removeEventListeners () {
    this.clearEvents(this.eventListeners)
  }

  private setEventList () {
    this.eventListeners = [
      {
        element: this.reference || window,
        type: 'mouseleave',
        function: this.setRestState.bind(this)
      },
      {
        element: this.reference || window,
        type: 'mousemove',
        function: this.updateVector.bind(this)
      }
    ]
  }

  private registerEvents () {
    this.setEventList()
    this.eventListeners.forEach(this.addEvent)
  }

  private updateVector (ev) {
    if (this.shouldUpdate()) {
      // console.log(getMouseOverVector(ev))
      this.vector = getMouseOverVector(ev)
    }
  }

  private setRestState () {
    this.vector = this.restState
  }

  private addEvent (event: EventObject) {
    event.element?.addEventListener(event.type, event.function)
  }

  private clearEvents (eventListeners: EventObject[]) {
    eventListeners.forEach((event) => {
      event.element?.removeEventListener(event.type, event.function)
    })
  }

  // determine element update based on given rate
  private shouldUpdate (): boolean {
    let counter = 0
    if (this.refreshRate === 0) return true
    return counter++ % this.refreshRate === 0
  }
}

// export singleton
export default function getMouserInstance (params:MouserOptions): Mouser {
  return Mouser.Instance(params)
}