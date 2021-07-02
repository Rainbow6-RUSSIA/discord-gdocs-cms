import styled, { keyframes } from "styled-components"

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

const blink = keyframes`
  from, to { box-shadow: none; }
  50% { box-shadow: 0 0 0 1px currentColor; }
`

export const RemoteCursor = styled(RemoteSelection)`
  animation: ${blink} 1s step-end infinite;
  color: ${props => props.color};
`
