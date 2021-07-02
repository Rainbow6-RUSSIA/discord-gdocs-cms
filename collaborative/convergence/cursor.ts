import type { LocalPropertyReference } from "@convergence/convergence"
import ColorHash from "color-hash"
import { isEqual } from "lodash"
import type { EditorManagerLike } from "../../modules/editor/EditorManager"
import { checkInput, disabledInputs } from "../helpers/inputFilters"
import type { ConvergenceClient } from "./client"

type TextElement = HTMLTextAreaElement | HTMLInputElement
// type Path = (string | number)[]

// const isAllowedEvent = (event: Event) =>
//   !(event instanceof KeyboardEvent)
//   || ["Arrow", "Page", "Home", "End"].some(s => event.key.startsWith(s))

// const ShortPathConvert: Record<string, string> = {
//   webhook: "url",
//   message: "message",
// }

export type CursorsMap = Map<string, {
  path: string,
  selection: [number, number] | null,
  color: string,
  isLocal: boolean,
  timestamp: number
}>

export class ConvergenceCursor {
  constructor(client: ConvergenceClient) {
    if (!client.model || !client.user)
      throw new Error("Incomplete client")
    Object.assign(window, { cursor: this })
    this.client = client
    this.color = new ColorHash().hex(client.user.username)

    this.pathReference = client.model.root().propertyReference("path")
    this.selectionReference = client.model.root().propertyReference("selection")

    // console.log("TEST UNSET REF", this.pathReference.value(), this.selectionReference.values())

    this.targetElement = null
    this.selectionChange()
    // this.elementReference.on(LocalElementReference.Events.SET, e => console.log("ELEMENT REFERENCE SET", e))
  }

  pathReference: LocalPropertyReference // путь к выделенному элементу
  selectionReference: LocalPropertyReference // выделение на выбранном елементе
  client: ConvergenceClient
  color: string

  targetElement: TextElement | null

  initTracking = () => {
    document.addEventListener("selectionchange", this.selectionChange)
    this.pathReference.share()
    this.selectionReference.share()
  }

  stopTracking = () => {
    document.removeEventListener("selectionchange", this.selectionChange)
    if (this.pathReference.isShared()) this.pathReference.unshare()
    if (this.selectionReference.isShared()) this.selectionReference.unshare()
  }

  /*
    1. Приход/уход          | Заполнить все/Очистить все 
    2. Переход между полями | Обновить все               
    3. Редактирование поля  | Обновить выделение          
    4. Повторный клик       | Ничего
  */
  selectionChange = () => {
    const newTarget = ConvergenceCursor.isAllowedElement(document.activeElement) ? document.activeElement : null
    const oldTarget = this.targetElement
    console.log("🚀 ~ selectionChange")

    if (oldTarget === null && newTarget === null) return
    if (newTarget === oldTarget && !this.isSelectionChanged()) return

    if (newTarget !== oldTarget) {
      this.changeElement(oldTarget, newTarget)
      this.updatePath(newTarget)
    }

    this.updateSelection(newTarget)

    this.targetElement = newTarget
  }

  changeElement = (oldTarget: TextElement | null, newTarget: TextElement | null) => {
    // if (oldTarget) oldTarget.style.borderColor = ""
    // if (newTarget) newTarget.style.borderColor = this.color
  }

  updateSelection = (target: TextElement | null) => {
    if (typeof target?.selectionStart === "number") {
      this.selectionReference.set([target.selectionStart, target.selectionEnd].map(String))
    } else {
      this.selectionReference.clear()
    }
    console.log("🚀 ~ updateSelection", this.selectionReference.values())
  }

  updatePath = (target: TextElement | null) => {
    if (target?.id) {
      // const localPath = target.id.split("_").filter(Boolean).map(parseNumbers)
      // let path
      // if (typeof localPath[0] === "number") {
      //   path = ConvergenceCursor.findPathById(this.client.editor, localPath[0])
      //     .map(parseNumbers)
      //     .concat(localPath[1])
      // } else {
      //   path = ["target", ShortPathConvert[localPath[0]]]
      // }
      // this.pathReference.set(path.map(String))
      this.pathReference.set(target.id)
    } else {
      this.pathReference.clear()
    }
    console.log("🚀 ~ updatePath", this.pathReference.values())
  }

  cursorReport = () => {
    // debounce(() => {
    // if (this.activeElement && this.path.length > 0) {
    // TODO: реф элемента отваливается при получении изменений
    // console.log("ELEMENT REF IS ATTACHED", this.elementReference.value().isAttached())
    // if (this.indexReference) {
    // this.indexReference.set(this.selection)
    // console.log("REFERENCE", this.indexReference.values())
    // } else {
    //     console.log("REFERENCE", null)
    // }
    // }
  } // , 150, {maxWait: 500})

  revertCaretPosition = () => {
    if (!this.selectionReference.isSet()) return
    const selection = this.selectionReference.values().map(Number)
    this.targetElement?.setSelectionRange(selection[0], selection[1])
  }

  isSelectionChanged() {
    const a = this.selectionReference.values().map(Number)
    const b = [this.targetElement?.selectionStart, this.targetElement?.selectionEnd]
    const c = !isEqual(a, b)
    console.log("🚀 ~ isSelectionChanged", c)
    return c
  }

  static findPathById(obj: EditorManagerLike, id: number) {
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

  static isAllowedElement = (
    element: EventTarget | null,
  ): element is TextElement =>
    (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) && !checkInput(element, disabledInputs)

}
