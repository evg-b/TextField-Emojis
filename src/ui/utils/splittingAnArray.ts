export default function splittingAnArray<T>(array: T[], size: number): T[][] {
    let newArray: T[][] = []
    for (let i = 0; i < Math.ceil(array.length / size); i++) {
        newArray[i] = array.slice((i * size), (i * size) + size)
    }
    return newArray
}