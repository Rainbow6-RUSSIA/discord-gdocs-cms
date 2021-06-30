import React, { CSSProperties, ChangeEvent, FocusEvent, forwardRef, useEffect, useRef, useState } from "react"
import mergeRefs from "react-merge-refs"
import type { ReactRef } from "../../common/state/ReactRef"
import { useRequiredContext } from "../../common/state/useRequiredContext"
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
  // const collaborationManager = useRequiredContext(CollaborationManagerContext)
  const echoRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<InputElement>(null)
  const [pos, setPos] = useState([0, 0])

  const { value = "" } = props
  const content = (
    <>
      {value.slice(0, pos[0])}
      {pos[0] === pos[1] ? (
        <RemoteCursor color="#FF0000" />
      ) : (
        <RemoteSelection color="#FF0000">{value.slice(pos[0], pos[1])}</RemoteSelection>
      )}
      {value.slice(pos[1])}
      {"\n" /* фикс при пустых строках в конце */}
    </>
  )

  useEffect(() => {
    const { current: echo } = echoRef
    const { current: input } = inputRef
    if (echo && input) {
      const setScroll = () => {
        echo.scrollTop = input.scrollTop // echo.scrollHeight * (input.scrollTop  / input.scrollHeight)
        echo.scrollLeft = input.scrollLeft // echo.scrollWidth  * (input.scrollLeft / input.scrollWidth)
      }

      setPos(
        new Array(2)
          .fill(null)
          .map(() => Math.round(Math.random() * 100)) // test
          .sort((a, b) => a - b),
      )

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
          {value.length > 0 && content}
        </EchoInput>
      </HighlightContainer>
    )

}

const RichTextInput = forwardRef(RichTextInputRender)

const SwitchRender = (
  props: InputProps,
  ref: ReactRef<InputElement>,
) => {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  return (
    checkInput(props, disabledInputs)
    || !collaborationManager.convergence
    || !collaborationManager.roomId
  ) // детект некорректных полей
    ? <PlainTextInput ref={mergeRefs([ref])} {...props} />
    : <RichTextInput ref={ref} {...props} />
}

export const TextInput = forwardRef(SwitchRender)
