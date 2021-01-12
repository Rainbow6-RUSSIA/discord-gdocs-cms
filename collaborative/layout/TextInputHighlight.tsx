import React, { forwardRef } from "react"
import styled, { StyledComponentPropsWithRef, StyledProps  } from "styled-components"
import { Input } from "../../common/input/layout/Input"
import type { InputFieldProps } from "../../common/input/text/InputField"
import { FlexContainer } from "../../common/layout/FlexContainer"
import type { ReactRef } from "../../common/state/ReactRef"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { ExternalServiceManagerContext } from "../header/ExternalServiceManagerContext"

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
  width: 100%;
  height: 100%;
  overflow: hidden; // hide scrollbar
  input + & {
    line-height: 36px; // from Input
  }
  textarea + & {
    line-height: normal;
    white-space: pre-wrap; // important for pixel-perfect overlay
    overflow: auto; // important for pixel-perfect overlay
    /* resize: vertical; */
    /* overflow-wrap: break-word; */
    padding: 5.5px 9px; // from Input
  }
`

const HighlightContainer = styled(FlexContainer)`
  position: relative;
  overflow: hidden;
  width: 100%;
`

const TextInputHighlight = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any,
  ref: React.ForwardedRef<HTMLInputElement | HTMLTextAreaElement>
) => {
  const external = useRequiredContext(ExternalServiceManagerContext)
  return <HighlightContainer>
    <SimpleTextInput ref={ref} {...props} />
    <EchoInput as="div">{props.value}</EchoInput>
  </HighlightContainer>
}

export const TextInput = forwardRef(TextInputHighlight)