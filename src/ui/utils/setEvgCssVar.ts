export default function setEvgCssVar(node: HTMLElement, key: string, value: string) {
    node.style.setProperty(key, value)
}