import React from "react"
import styled from "styled-components"
import { chevronDown } from "../../icons/chevron"
import { loading as loadingIcon } from "../icons/loading"

export type DropdownOption = {
  label: string
  value?: string
  selected?: boolean
  disabled?: boolean
}

export type DropdownGroup = {
  name: string
  group: DropdownOption[]
}

export type DropdownOptions = (DropdownOption | DropdownGroup)[]

export type DropdownProps = {
  options?: DropdownOptions
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  loading?: boolean
  disabled?: boolean
}

const Wrap = styled.div`
  min-width: 60px;
  position: relative;
`

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
  pointer-events: none;
`

const Select = styled.select`
  background: ${({ theme }) => `${theme.background.secondaryAlt}`};
  color: ${({ theme }) => theme.interactive.active};
  font: inherit;
  outline: none;

  cursor: pointer;
  appearance: none;

  min-height: 36px;
  max-height: 36px;
  width: 100%;

  padding: 0 9px;
  border: 2px solid ${({ theme }) => theme.background.secondaryAlt};

  border-radius: 3px;

  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;

  transition: 150ms;
  transition-property: background-color, border-color, color;

  &:focus {
    border-color: ${({ theme }) => theme.accent.primary};
  }
  &:disabled {
    background: transparent;
    border-color: ${({ theme }) => theme.interactive.muted};
    color: ${({ theme }) => theme.text.muted};
  }
`

const groupGuard = (
  option: DropdownOption | DropdownGroup,
): option is DropdownGroup => "group" in option

const optionMap = ({ label, value, selected, disabled }: DropdownOption) => (
  <option
    key={`${value}.${label}`}
    disabled={disabled}
    value={value}
    selected={selected}
  >
    {label}
  </option>
)

export const Dropdown = ({
  options = [],
  disabled = false,
  loading = false,
  placeholder,
  onChange = () => {},
}: DropdownProps) => {
  const restOptions = options.map(opt =>
    groupGuard(opt) ? (
      <optgroup key={`${opt.name}.${opt.group.length}`} label={opt.name}>
        {opt.group.map(optionMap)}
      </optgroup>
    ) : (
      optionMap(opt)
    ),
  )

  const placeholderOption = !disabled ? (
    loading ? (
      <option>loading...</option>
    ) : (
      placeholder && <option>{placeholder}</option>
    )
  ) : null

  return (
    <Wrap>
      <Select disabled={disabled || loading} onChange={onChange}>
        {placeholderOption}
        {restOptions}
      </Select>
      <Arrow>{loading ? loadingIcon : chevronDown}</Arrow>
    </Wrap>
  )
}
