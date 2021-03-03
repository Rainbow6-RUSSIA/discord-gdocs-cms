import { LocalElementReference, RealTimeString } from "@convergence/convergence"
import type { LocalIndexReference } from "@convergence/convergence/typings/model/reference/LocalIndexReference"
import ColorHash from "color-hash"
import type { EditorManagerLike } from "../../modules/editor/EditorManager"
import { parseNumbers } from "../helpers/parseNumbers"
import type { ConvergenceClient } from "./client"

type TextElement = HTMLTextAreaElement | HTMLInputElement
type Path = (string | number)[]

const isAllowedElement = (
  element: EventTarget | null,
): element is TextElement =>
  element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement

// const isAllowedEvent = (event: Event) =>
//   !(event instanceof KeyboardEvent)
//   || ["Arrow", "Page", "Home", "End"].some(s => event.key.startsWith(s))

// const isGreedyElement = (path: Path | null) => path && path[0] === "webhook" // this element block first click

function findPathById(obj: EditorManagerLike, id: number) {
  const path: string[] = []
  let found = false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function search(haystack: any) {
    for (const key in haystack) {
      if (Object.prototype.hasOwnProperty.call(haystack, key)) {
        if (key === "id" && haystack.id === id) {
          found = true
          break
        }
        path.push(key)
        if (typeof haystack[key] === "object") {
          search(haystack[key])
          if (found) break
        }
        path.pop()
      }
    }
  }

  search(obj)
  return path
}

const ShortPathConvert: Record<string, string> = {
  webhook: "url",
  message: "message",
}

export class ConvergenceCursor {
  constructor(client: ConvergenceClient) {
    if (!client.model || !client.collaboration.discord)
      throw new Error("Incomplete client")
    this.client = client
    this.color = new ColorHash().hex(client.collaboration.discord.id)
    this.elementReference = client.model.elementReference("selected")
    // this.elementReference.on(LocalElementReference.Events.SET, e => console.log("ELEMENT REFERENCE SET", e))
  }
  /**
   *  a.k.a selected element
   *
   * @type {LocalElementReference}
   * @memberof ConvergenceCursor
   */
  elementReference: LocalElementReference
  /**
   *  a.k.a cursor
   *
   * @type {LocalIndexReference}
   * @memberof ConvergenceCursor
   */
  indexReference?: LocalIndexReference
  client: ConvergenceClient
  color: string
  activeElement?: TextElement
  path: Path = []
  selection: [number, number] = [0, 0]

  updateIndexReference = () => {
    const element = this.elementReference.value()
    if (element instanceof RealTimeString) {
      this.indexReference = element.indexReference("cursor")
      // console.log("UPDATE INDEX REFERENCE", element.path())
    } else {
      delete this.indexReference
      // console.log("INDEX REFERENCE DELETED")
    }
  }

  initTracking = () => {
    document.addEventListener("selectionchange", this.selectionChange)
    this.elementReference.share()
  }

  stopTracking = () => {
    document.removeEventListener("selectionchange", this.selectionChange)
    if (this.elementReference.isShared()) this.elementReference.unshare()
  }

  selectionChange = () => {
    const target = document.activeElement
    if (isAllowedElement(target)) {
      this.updatePath(target)
      this.updateSelection(target)
      if (target.id !== this.activeElement?.id) this.changeElement(target)

      this.cursorReport()
    }
  }

  changeElement = (target: TextElement) => {
    if (this.activeElement) this.activeElement.style.borderColor = ""
    target.style.borderColor = this.color
    this.elementReference.set(this.client.model!.root().elementAt(this.path))
    this.updateIndexReference()
    this.activeElement = target
  }

  updateSelection = (target: TextElement) => {
    this.selection = [target.selectionStart ?? 0, target.selectionEnd ?? 0]
  }

  updatePath = (target: TextElement) => {
    const localPath = target.id.split("_").filter(Boolean).map(parseNumbers)
    if (typeof localPath[0] === "number") {
      this.path = findPathById(this.client.editor, localPath[0])
        .map(parseNumbers)
        .concat(localPath[1])
    } else {
      this.path = ["target", ShortPathConvert[localPath[0]]]
    }
  }

  cursorReport = () => {
    // debounce(() => {
    if (this.activeElement && this.path.length > 0) {
      // TODO: реф элемента отваливается при получении изменений
      // console.log("ELEMENT REF IS ATTACHED", this.elementReference.value().isAttached())
      // if (this.indexReference) {
      // this.indexReference.set(this.selection)
      // console.log("REFERENCE", this.indexReference.values())
      // } else {
      //     console.log("REFERENCE", null)
      // }
    }
  } // , 150, {maxWait: 500})

  revertCaretPosition = () => {
    if (this.activeElement) {
      this.activeElement.setSelectionRange(...this.selection)
    }
  }
}
