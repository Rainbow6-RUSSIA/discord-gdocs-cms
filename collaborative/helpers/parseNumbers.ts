export function parseNumbers(value: string) {
    const n = Number.parseInt(value, 10);
    return Number.isNaN(n) ? value : n
}