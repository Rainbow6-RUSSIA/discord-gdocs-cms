import React from "react"
import styled from "styled-components"
import { chevronDown } from "../../icons/chevron";
import { loading } from "../icons/loading";

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
    options?: (IOption | IGroup)[]
    // placeholder?: string
    onChange?: (arg?: IOption) => void
    loading?: boolean;
    disabled?: boolean;
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

const groupGuard = (option: IOption | IGroup): option is IGroup => "group" in option

export const Dropdown = (props: DropdownProps) => {
    const finalOptions = props.options?.flatMap(opt => 
        groupGuard(opt)
        ? opt.group.map((o, i) => ({...o, label: `${opt.name}: ${o.label} (${i+1}/${opt.group.length})`}))
        : opt
    ) ?? []

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => props.onChange?.(finalOptions.find(opt => opt.value === event.target.value))
    
    return <Wrap>
        <Select disabled={props.disabled || props.loading} onChange={handleChange}>
            {finalOptions.map(({label, value, selected, disabled}) => <option key={`${value}.${label}`} disabled={disabled} value={value} selected={selected}>{label}</option>)}
        </Select>
        <Arrow>{props.loading ? loading : chevronDown}</Arrow>
    </Wrap>
}