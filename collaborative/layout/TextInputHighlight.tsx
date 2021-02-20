import React, { forwardRef, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Input } from "../../common/input/layout/Input"
import { FlexContainer } from "../../common/layout/FlexContainer"
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

const SimpleTextInput = styled(Input)`
  background-color: transparent;
  z-index: 1;
  ${FlexContainer} > & {
    flex: 1;
  }
`

// There's minor bugs in Firefox, I won't fix them
const EchoInput = styled(Input)`
  position: absolute;
  color: transparent;
  /* Hide scrollbar*/
  ::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  scrollbar-color: transparent transparent;

  left: 9px;

  input + & {
    line-height: 33px; // from Input 36px - 3px
    white-space: nowrap;
    overflow: auto hidden;
    padding: 0;
    height: calc(100% + 18px); // hide scrollbar at bottom
    right: 9px;
  }

  textarea + & {
    line-height: normal;
    white-space: pre-wrap; // important for pixel-perfect overlay
    overflow: hidden auto; // important for pixel-perfect overlay
    padding: 5.5px 9px 5.5px 0; // from Input
    height: 100%;
  }
`

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any,
) => {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)
  const echoRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<CommonInputElement>(
    ref && "current" in ref ? ref.current : null,
  ) // use forwarded ref or create intermediate
  const [pos, setPos] = useState([0, 0])

  const { value } = props

  const content = (
    <>
      {value.slice(0, pos[0])}
      {pos[0] === pos[1] ? (
        <Cursor color="#FF0000" />
      ) : (
        <Highlight color="#FF0000">{value.slice(pos[0], pos[1])}</Highlight>
      )}
      {value.slice(pos[1])}
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
          .map(() => Math.round(Math.random() * value.length))
          .sort((a, b) => a - b),
      )

      input.addEventListener("scroll", setScroll)
      return () => {
        input.removeEventListener("scroll", setScroll)
      }
    }
  }, [inputRef, value.length])

  return (
    <HighlightContainer>
      <SimpleTextInput
        style={{ backgroundColor: "red" }}
        ref={ref ?? inputRef}
        {...props}
      />
      <EchoInput ref={echoRef} as="div">
        {Boolean(value.length && props.id !== "webhook") && content}
      </EchoInput>
    </HighlightContainer>
  )
}

export const TextInput = forwardRef(TextInputHighlight)
