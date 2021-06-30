import React, { forwardRef, useEffect, useRef, useState } from "react"
import mergeRefs from "react-merge-refs"
import type { ReactRef } from "../../common/state/ReactRef"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { PlainTextInput, HighlightContainer, TransparentTextInput, EchoInput } from "../layout/InputHighlight"
import { RemoteCursor, RemoteSelection } from "../layout/RemoteCursor"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"

type CommonInputElement = HTMLInputElement | HTMLTextAreaElement | null

type AnyProps = {
  value: string
  id: string
  [s: string]: unknown
}

const TextInputHighlight = (
  props: AnyProps,
  ref: ReactRef<CommonInputElement>,
) => {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)
  const echoRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<CommonInputElement>(null)
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
  }, [inputRef])

  return (
    props.disabled
    || props.type === "password"
    || props.placeholder === "#rrggbb"
    || !collaborationManager.convergence
    || !collaborationManager.roomId
    || !value
  ) // детект некорректных полей
    ? <PlainTextInput ref={mergeRefs([ref, inputRef])} {...props} /> // TODO: показывать фокус на поле вебхука
    : (
      <HighlightContainer>
        <TransparentTextInput ref={mergeRefs([ref, inputRef])} {...props} />
        <EchoInput ref={echoRef} >
          {Boolean(value.length > 0 && props.id !== "webhook") && content}
        </EchoInput>
      </HighlightContainer>
    )

}

export const TextInput = forwardRef(TextInputHighlight)
