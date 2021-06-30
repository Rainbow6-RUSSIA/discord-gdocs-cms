import styled from "styled-components"

export type RemoteCursorProps = {
    color: string
    // name: string
}

export const RemoteSelection = styled.span<RemoteCursorProps>`
    position: relative;
    background-color: ${props => `${props.color}7F`};
    box-shadow: 0 0 0 1px ${props => props.color};
    border-radius: 2px;
  `

export const RemoteCursor = styled(RemoteSelection)`
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
