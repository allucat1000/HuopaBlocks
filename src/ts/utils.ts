export function round(num: number, decimals: number = 0): number {
    return Math.round(num * (10 ** decimals)) / (10 ** decimals);
}