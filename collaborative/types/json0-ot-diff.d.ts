declare module "json0-ot-diff" {
    import DiffMatchPatch from "diff-match-patch"
    import { Op } from "sharedb"

    export default function (
        oldJson: unknown,
        newJson: unknown,
        diffMatchPatch?: DiffMatchPatch
    ) : Op[]
}