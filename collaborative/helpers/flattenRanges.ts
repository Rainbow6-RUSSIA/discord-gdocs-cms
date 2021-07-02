export type Range = [number, number]

export function isRange(A: unknown[]): A is Range {
    return typeof A[0] === "number" && typeof A[1] === "number"
}

export function subtractRanges(
    A: Range,
    B: Range
) {
    if (A[0] > B[1] || B[0] > A[1]) return [B] // All of B visible
    const result: Range[] = []
    if (A[0] > B[0]) result.push([B[0], A[0]]) // Beginning of B visible
    if (A[1] < B[1]) result.push([A[1], B[1]]) // End of B visible
    return result
}

export function flattenRanges(s: [string | null, Range][]) {
    const spans: [string | null, Range][] = JSON.parse(JSON.stringify(s))                        // deep clone
    let i = 0                                                        // Start at lowest span
    while (i < spans.length) {
        for (const superior of spans.slice(i + 1)) {                 // Iterate through all spans above
            const result = subtractRanges(superior[1], spans[i][1])
            if (result.length === 0) {                               // If span is completely covered
                spans.splice(i, 1)                                   // Remove it from list
                i -= 1                                               // Compensate for list shifting
                break                                                // Skip to next span
            } else {                                                 // If there is at least one resulting span
                spans[i][1] = result[0]
                if (result.length > 1)                               // If there are two resulting spans
                    spans.splice(i + 1, 0, [spans[i][0], result[1]]) // Insert another span with the same name
            }
        }
        i += 1
    }

    return spans
        .sort((a, b) => a[1][1] - b[1][1]) // sort by end
        .sort((a, b) => a[1][0] - b[1][0]) // sort by start
}