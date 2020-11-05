import React from "react"
import styled from "styled-components"
import { Z_INDEX_SLIDER } from "../../common/constants"

const SliderBar = styled.div`
  z-index: ${Z_INDEX_SLIDER};
  grid-area: slider;
  transition: 150ms;

  &:hover {
    background: ${({ theme }) => theme.accent.warning};
    transform: scaleX(3);
    transition: 150ms;
    cursor: col-resize;
  }
`

type SliderProps = {
  split: number
  setSplit: (n: number) => void
}

type GenericEvent = MouseEvent | TouchEvent

export class Slider extends React.PureComponent<SliderProps> {
  constructor(props: SliderProps) {
    super(props)
    this.ref = React.createRef<HTMLDivElement>()
  }

  componentDidMount = () => {
    if (!this.ref.current) return
    window.addEventListener("mouseup", this.handleStop)
    window.addEventListener("mousemove", this.handleMove)
    window.addEventListener("touchmove", this.handleMove)
  }

  componentWillUnmount = () => {
    if (!this.ref.current) return
    window.removeEventListener("mouseup", this.handleStop)
    window.removeEventListener("mousemove", this.handleMove)
    window.removeEventListener("touchmove", this.handleMove)
  }

  props!: SliderProps

  active = false
  minSplit = 0.3
  maxSplit = 0.7
  accuracy = 1

  handleStart = (event: GenericEvent) => {
    if (!this.active) console.log("START", event.type)
    this.active = true
  }

  handleStop = (event: GenericEvent) => {
    if (this.active) console.log("STOP", event.type)
    this.active = false
  }

  handleMove = (event: GenericEvent) => {
    const { active, maxSplit, minSplit } = this

    const node = this.ref.current
    if (active && node?.getBoundingClientRect) {
      document.getSelection()?.empty()

      const x =
        event instanceof MouseEvent ? event.clientX : event.touches[0].clientX

      let newSplit =
        Math.round(((x / window.innerWidth) * 100) / this.accuracy) /
        (100 / this.accuracy)

      console.log(x, newSplit)

      if (newSplit < minSplit) newSplit = minSplit
      if (newSplit > maxSplit) newSplit = maxSplit
      this.props.setSplit(newSplit)
    }
  }

  private readonly ref: React.RefObject<HTMLDivElement>
  render() {
    return (
      <SliderBar
        onMouseDown={e => this.handleStart((e as unknown) as MouseEvent)}
        onTouchStart={e => this.handleStart((e as unknown) as TouchEvent)}
        onTouchEnd={e => this.handleStop((e as unknown) as TouchEvent)}
        ref={this.ref}
      />
    )
  }
}
