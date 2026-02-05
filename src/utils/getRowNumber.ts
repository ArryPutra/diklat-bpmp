export function getRowNumber(
    index: number,
    currentPage: number,
    perPage: number
) {
    return index + 1 + (currentPage - 1) * perPage
}
