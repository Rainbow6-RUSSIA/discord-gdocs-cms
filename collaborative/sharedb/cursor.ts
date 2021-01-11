import debounce from "lodash.debounce"
import { parseNumbers } from "../helpers/parseNumbers"

type TextElement = HTMLTextAreaElement | HTMLInputElement 
type Path = (string | number)[]

const isAllowedElement = (element: EventTarget | null): 
element is TextElement =>
  element instanceof HTMLTextAreaElement
  || element instanceof HTMLInputElement

const isAllowedEvent = (event: Event) => 
  !(event instanceof KeyboardEvent)
  || ["Arrow", "Page", "Home", "End"].some(s => event.key.startsWith(s))

const isValidPath = (path: Path | null ) => Boolean(path?.length)

const isGreedyElement = (path: Path | null) => path && path[0] === "webhook" // this element block first click

export class ShareDBCursor {
    activeElement: TextElement | null = null
    path: Path | null = null
    selection: [number, number] | null = null

    initTracking = () => {
        document.addEventListener("selectionchange", this.selectionChange);
    }

    stopTracking = () => {
        document.removeEventListener("selectionchange", this.selectionChange);
    }

    selectionChange = () => {
        const target = document.activeElement
        if (isAllowedElement(target)) {
            if (target.id !== this.activeElement?.id) {
                if (this.activeElement) this.activeElement.style.backgroundColor = ""
                target.style.backgroundColor = "rebeccapurple"
            }
            this.activeElement = target;
            this.path = target.id.split("_").filter(Boolean).map(parseNumbers);
            this.selection = [target.selectionStart ?? 0, target.selectionEnd ?? 0]
            console.log("SAVE SELECTION", this.selection)
            this.cursorReport()
        }
    }

    cursorReport = debounce(() => {
        if (this.activeElement && isValidPath(this.path)) {
            // console.log("cursorReport", this.selection, this.path)
        }
    }, 150, {maxWait: 500})

    revertCaretPosition = () => {
        if (this.activeElement && this.selection) {
            console.log("SET SELECTION", this.selection)
            this.activeElement.setSelectionRange(...this.selection);
        }
    }    
}