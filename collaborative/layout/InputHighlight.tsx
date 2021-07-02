import styled from "styled-components"
import { Input } from "../../common/input/layout/Input"
import { FlexContainer } from "../../common/layout/FlexContainer"

export const HighlightContainer = styled(FlexContainer)`
  position: relative;
  overflow: hidden;
  width: 100%;
  background: ${({ theme }) => theme.background.secondaryAlt};
  border: 0;
  border-radius: 3px; // rounded inputs
`
export const PlainTextInput = styled(Input)`
  ${FlexContainer} > & {
    flex: 1;
  }
`

export const TransparentTextInput = styled(PlainTextInput)`
  background-color: transparent;
  z-index: 1;

  color: ${process.env.NODE_ENV === "development" ? "#ff0000f0" : ({ theme }) => theme.text.normal}
`

// There's minor bugs in Firefox, I won't fix them
export const EchoInput = styled(Input)`
  position: absolute;
  color: ${process.env.NODE_ENV === "development" ? "blue" : "transparent"};
  
  /* Hide scrollbar*/
  ::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  scrollbar-color: transparent transparent;

  border: 2px solid transparent;

  font-size: 16px; // фиксированный шрифт, а не из настроек

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