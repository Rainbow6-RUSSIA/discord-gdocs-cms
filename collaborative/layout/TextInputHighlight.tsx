import React, { forwardRef, useEffect, useRef, useState } from "react"
import mergeRefs from "react-merge-refs"
import styled from "styled-components"
import { Input } from "../../common/input/layout/Input"
import { FlexContainer } from "../../common/layout/FlexContainer"
import type { ReactRef } from "../../common/state/ReactRef"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"

const HighlightContainer = styled(FlexContainer)`
  position: relative;
  overflow: hidden;
  width: 100%;
  background: ${({ theme }) => theme.background.secondaryAlt};
  border: 0;
  border-radius: 3px; // rounded inputs
`
const PlainTextInput = styled(Input)`
  ${FlexContainer} > & {
    flex: 1;
  }
`

const TransparentTextInput = styled(PlainTextInput)`
  background-color: transparent;
  z-index: 1;
`

// There's minor bugs in Firefox, I won't fix them
const EchoInput = styled(Input)`
  position: absolute;
  color: ${process.env.NODE_ENV === "development" ? "blue" : "transparent"};
  /* Hide scrollbar*/
  ::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  scrollbar-color: transparent transparent;

  border: 2px solid transparent;

  height: 100%;
  width: 100%;

  input + && {
    line-height: 33px; // from Input 36px - 3px
    white-space: nowrap;
    overflow: hidden;
    padding: 0 9px;
    clip-path: inset(0 9px 0 9px);
  }

  textarea + && {
    line-height: normal;
    white-space: pre-wrap; // important for pixel-perfect overlay
    overflow: hidden auto; // important for pixel-perfect overlay
    padding: 5.5px 9px; // from Input
  }
`.withComponent("div") // fix buggy "as" prop

type CursorProps = {
  color: string
  // name: string
}

const Highlight = styled.span<CursorProps>`
  position: relative;
  background-color: ${props => `${props.color}7F`};
  box-shadow: 0 0 0 1px ${props => props.color};
  border-radius: 2px;
`

const Cursor = styled(Highlight)`
  /* &:before { // this solution disappointed me because cursor name under the borders of input 
    position: absolute;
    font-size: 14px;
    line-height: 14px;
    top: -14px;
    left: -2px;
    content: "${props => props.color}";
    background: ${props => props.color};
    height: 14px;
    z-index: 2;
  } */
  &:before {
    position: absolute;
    top: 0;
    z-index: 2;
    content: "";

    width: 0; // CSS Triangle
    height: 0;
    border-style: solid;
    border-width: 2px 0 2px 8px;
    border-color: transparent transparent transparent ${props => props.color};
  }
`

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
        <Cursor color="#FF0000" />
      ) : (
        <Highlight color="#FF0000">{value.slice(pos[0], pos[1])}</Highlight>
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
