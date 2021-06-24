const nameStateInLocalStorage = 'EVG-STATE'
export const loadState = () => {
    try {
        const serialState = localStorage.getItem(nameStateInLocalStorage)
        if (serialState === null) {
            return undefined
        }
        return JSON.parse(serialState)
    } catch (error) {
        return undefined
    }
}
export const saveState = (state: unknown) => {
    try {
        const serialState = JSON.stringify(state)
        localStorage.setItem(nameStateInLocalStorage, serialState)
    } catch (error) {
        console.log(`[saveState] error: ${error}`)
    }
}