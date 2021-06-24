export default function useChangeTheme(themeName: string) {
    document.body.setAttribute('scheme', themeName)
}