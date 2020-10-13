import styled from "styled-components"
import ExternalLinkSvg from "../../public/static/external-link.svg"

export const ExternalLinkIcon = styled(ExternalLinkSvg)`
  fill: ${({ theme }) => theme.header.primary};
`
