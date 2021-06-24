export default function convertMaptoSortArray(map: Map<string, number>): string[] {
    return Array.from(map.keys()).sort((a, b) => map.get(b)! - map.get(a)!)
}