import React from "react"
import styled from "styled-components"

type IOption = {
    label: string;
    value?: string;
    selected?: boolean;
    disabled?: boolean;
};

type IGroup = {
    name: string
    group: IOption[]
}

export type DropdownProps = {
    options: (IOption | IGroup)[]
    // placeholder?: string
    onChange?: (arg?: IOption) => void
}

const Select = styled.select`
    background: ${({ theme }) => `${theme.background.secondaryAlt}`};
    color: ${({ theme }) => theme.interactive.active};
    font: inherit;
    outline: none;

    cursor: pointer;

    min-width: 60px;
    min-height: 36px;
    max-height: 36px;

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

const groupGuard = (option: IOption | IGroup): option is IGroup => "group" in option

export const Dropdown = ({ options, onChange = () => {} }: DropdownProps) => {
    options = [{ label: "Option 1" }, { label: "Option 2", disabled: true }, { group: [{ label: "Option 3" }, { label: "Option 4" }], name: "Group" }]
    const finalOptions = options.flatMap(opt => 
        groupGuard(opt)
        ? opt.group.map((o, i) => ({...o, label: `${opt.name}: ${o.label} (${i+1}/${opt.group.length})`}))
        : opt
    )
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => onChange(finalOptions.find(opt => opt.value === event.target.value))
    return <Select onChange={handleChange}>
        {finalOptions.map(({label, value, selected, disabled}) => <option key={label} disabled={disabled} value={value} selected={selected}>{label}</option>)}
    </Select>
}