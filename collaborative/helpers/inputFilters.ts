import type { InputProps } from "../overrides/TextInputHighlight"

type GenericAttributes = Omit<InputProps, "style">

type Checklist = [keyof GenericAttributes, string | boolean][]

export const disabledInputs: Checklist = [
    ["id", "backups-search"],
    ["id", "backup-name"],
    ["id", "roomUrl"],
    ["disabled", true]
]

export const outlineOnlyInputs: Checklist = [
    ["placeholder", "#rrggbb"],
    ["type", "password"],
    ["readOnly", true],
    // ["value", ""],
]

export const checkInput = (props: Partial<GenericAttributes>, list: Checklist) => list.some(r => props[r[0]] === r[1])
