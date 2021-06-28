const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const base62toUUID = {
    encode:
        (uuid: string) => {
            let int = BigInt(`0x${uuid.replaceAll("-", "")}`)
            if (int === BigInt(0)) {
                return "0"
            }
            let s = ""
            while (int > BigInt(0)) {
                s = `${charset[Number(int % BigInt(62))]}${s}`
                int /= BigInt(62)
            }
            return s
        },
    decode:
        (chars: string) => {
            const int = chars
                .split("")
                .reverse()
                .reduce((prev, curr, i) =>
                    prev + (BigInt(charset.indexOf(curr)) * (BigInt(62) ** BigInt(i))), BigInt(0)
                )
            const hex = int.toString(16)
            return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
        }
}

export { base62toUUID }