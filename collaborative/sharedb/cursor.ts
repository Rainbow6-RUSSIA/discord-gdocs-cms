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
        document.addEventListener("focusin", this.focusIn)
        document.addEventListener("focusout", this.focusOut)
    }

    stopTracking = () => {
        document.removeEventListener("focusin", this.focusIn)
        document.removeEventListener("focusout", this.focusOut)
    }

    hookChange = (target: TextElement) => { 
        this.activeElement = target
        this.path = target.id.split("_").filter(Boolean).map(parseNumbers)
        target.addEventListener("click", this.cursorHandle)
        target.addEventListener("input", this.cursorHandle)
        target.addEventListener("keydown", this.cursorHandle)
        target.addEventListener("select", this.cursorHandle)
    }
    unhookChange = (target: TextElement) => {
        // this.activeElement = null;
        // this.path = null;
        target.removeEventListener("click", this.cursorHandle)
        target.removeEventListener("input", this.cursorHandle)
        target.removeEventListener("keydown", this.cursorHandle)
        target.removeEventListener("select", this.cursorHandle)
    }

    focusIn = (e: FocusEvent) => {
        const { target } = e
        if (isAllowedElement(target)) {
            if (this.activeElement) this.activeElement.style.backgroundColor = ""
            target.style.backgroundColor = "rebeccapurple"
            this.hookChange(target)
            
            if (isGreedyElement(this.path)) this.cursorHandle(e)
        }
    }

    focusOut = ({ target }: FocusEvent) => { 
        if (isAllowedElement(target)) {
            // target.style.backgroundColor = ""
            this.unhookChange(target)
        }
    }

    cursorHandle = debounce(
    (e: Event) => {
        if (this.activeElement && isValidPath(this.path)) {
            this.selection = [this.activeElement.selectionStart ?? 0, this.activeElement.selectionEnd ?? 0]
            console.log("cursorHandle", this.selection, this.path) // setInterval(() => temp1.setSelectionRange(i, i++), 1000)
        }
    }, 150, {maxWait: 500})

    revertCaretPosition = () => {
        if (this.activeElement && this.selection) {
            this.activeElement.setSelectionRange(...this.selection);
        }
    }    
}