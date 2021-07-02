import React, { CSSProperties, ChangeEvent, FocusEvent, forwardRef, useEffect, useRef, useContext } from "react"
import mergeRefs from "react-merge-refs"
import type { ReactRef } from "../../common/state/ReactRef"
import { CursorsContext } from "../convergence/CursorContext"
import { flattenRanges, Range } from "../helpers/flattenRanges"
import { checkInput, disabledInputs, outlineOnlyInputs } from "../helpers/inputFilters"
import { PlainTextInput, HighlightContainer, TransparentTextInput, EchoInput } from "../layout/InputHighlight"
import { RemoteCursor, RemoteSelection } from "../layout/RemoteCursor"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"

type InputElement = HTMLInputElement | HTMLTextAreaElement
type InputChangeEvent = ChangeEvent<InputElement>
type InputFocusEvent = FocusEvent<InputElement>

export type InputProps = {
  as: "textarea" | "input"
  id: string
  type?: string
  value: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  style: CSSProperties

  onChange?: (event: InputChangeEvent) => void
  onClick?: () => void
  onFocus?: (event: InputFocusEvent) => void
  onBlur?: (event: InputFocusEvent) => void
  "aria-label"?: string
}

const RichTextInputRender = (
  props: InputProps,
  ref: ReactRef<InputElement>,
) => {
  const cursorMap = useContext(CursorsContext)!
  const cursors = [...cursorMap.entries()]
    .filter(([, val]) => val.path === props.id && !val.isLocal && val.selection)
    .sort((a, b) => a[1].timestamp - b[1].timestamp)

  const value = props.value
  // debugger
  const unflattenRanges: [string | null, Range][] = cursors.map(e => [e[0], e[1].selection!])
  unflattenRanges.unshift([null, [0, value.length]])

  console.log("RANGES", unflattenRanges)
  let ranges

  try {
    ranges = flattenRanges(unflattenRanges)
  } catch (error) {
    debugger
    throw error
  }

  const content = (
    <>
      {
        ranges.map(([id, sub]) =>
          !id
            ? value.slice(sub[0], sub[1])
            : sub[0] === sub[1]
              ? (<RemoteCursor key={id} color={cursorMap.get(id)!.color} />)
              : (<RemoteSelection key={`${id}-${sub[0]}`} color={cursorMap.get(id)!.color}>{value.slice(sub[0], sub[1])}</RemoteSelection>)
        )
      }
      {"\n" /* фикс при пустых строках в конце */}
    </>
  )

  const echoRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<InputElement>(null)

  useEffect(() => {
    const { current: echo } = echoRef
    const { current: input } = inputRef
    if (echo && input) {
      const setScroll = () => {
        echo.scrollTop = input.scrollTop // echo.scrollHeight * (input.scrollTop  / input.scrollHeight)
        echo.scrollLeft = input.scrollLeft // echo.scrollWidth  * (input.scrollLeft / input.scrollWidth)
      }

      const observer = new ResizeObserver(setScroll)
      observer.observe(input)
      input.addEventListener("scroll", setScroll)
      return () => {
        input.removeEventListener("scroll", setScroll)
        observer.disconnect()
      }
    }
  }, [])
  // TODO: показывать фокус на поле вебхука
  return checkInput(props, outlineOnlyInputs)
    ? <PlainTextInput ref={mergeRefs([ref, inputRef])} {...props} />
    : (
      <HighlightContainer>
        <TransparentTextInput ref={mergeRefs([ref, inputRef])} {...props} />
        <EchoInput ref={echoRef} >
          {content}
        </EchoInput>
      </HighlightContainer>
    )

}

const RichTextInput = forwardRef(RichTextInputRender)

const SwitchRender = (
  props: InputProps,
  ref: ReactRef<InputElement>,
) => {
  const cursors = useContext(CursorsContext)

  const isOccupied = cursors && [...cursors.values()].some(c => c.path === props.id)

  return (
    !isOccupied
    // || checkInput(props, disabledInputs)
  )
    ? <PlainTextInput ref={mergeRefs([ref])} {...props} />
    : <RichTextInput ref={ref} {...props} />
}

export const TextInput = forwardRef(SwitchRender)
