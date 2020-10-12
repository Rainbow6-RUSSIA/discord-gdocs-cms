import styled from "styled-components"
import LoadingSvg from "../../public/static/loading.svg"

export const LoadingIcon = styled(LoadingSvg)`
  fill: ${({ theme }) => theme.header.primary};
`
