import React, { forwardRef, useEffect, useRef } from "react"
import styled from "styled-components"
import { Input } from "../../common/input/layout/Input"
import { FlexContainer } from "../../common/layout/FlexContainer"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { ExternalServiceManagerContext } from "../header/ExternalServiceManagerContext"

const HighlightContainer = styled(FlexContainer)`
  position: relative;
  overflow: hidden;
  width: 100%;
  background: ${({ theme }) => theme.background.secondaryAlt};
`

const SimpleTextInput = styled(Input)`
  background-color: transparent;
  z-index: 1;
  ${FlexContainer} > & {
    flex: 1;
  }
`

const EchoInput = styled(Input)`
  position: absolute;
  color: red;
  /* Hide scrollbar*/
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-track { background-color: transparent }
  scrollbar-color: transparent transparent;

  left: 9px;

  input + & {
    line-height: 36px; // from Input
    white-space: nowrap;
    overflow: auto hidden;
    padding: 0;
    height: calc(100% + 18px);
    right: 9px;
  }

  textarea + & {
    line-height: normal;
    white-space: pre-wrap; // important for pixel-perfect overlay
    overflow: hidden auto; // important for pixel-perfect overlay
    padding: 0 9px 5.5px 0; // from Input
    top: 5.5px;
    height: calc(100% - 5.5px);
  }
`

type CommonInputElement = HTMLInputElement | HTMLTextAreaElement

const TextInputHighlight = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any,
  ref: React.ForwardedRef<CommonInputElement>
) => {
  const external = useRequiredContext(ExternalServiceManagerContext)
  const echoRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef(ref && "current" in ref ? ref.current : null) // use forwarded ref or create intermediate
  
  useEffect(() => {
    const { current: echo } = echoRef
    const { current: input } = inputRef
    if (echo && input) {
      const setScroll = () => {
        echo.scrollTop  = input.scrollTop // echo.scrollHeight * (input.scrollTop  / input.scrollHeight)
        echo.scrollLeft = input.scrollLeft // echo.scrollWidth  * (input.scrollLeft / input.scrollWidth)
      }
  
      input.addEventListener("scroll", setScroll)
      return () => {
        input.removeEventListener("scroll", setScroll)
      }
    }
  }, [inputRef])
  
  return <HighlightContainer>
    <SimpleTextInput ref={ref ?? inputRef} {...props} />
    <EchoInput ref={echoRef} as="div">{props.id !== "webhook" && props.value}</EchoInput>
  </HighlightContainer>
}

export const TextInput = forwardRef(TextInputHighlight)