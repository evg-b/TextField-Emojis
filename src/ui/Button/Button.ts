
export function Button(props: {
    type: string,
    className: string[],
    children?: string,
    onClick: (this: Node, ev?: MouseEvent) => void
}) {
    const buttonNode = document.createElement(props.type)
    buttonNode.className = props.className.join(' ')
    buttonNode.classList.add('button')
    buttonNode.addEventListener('click', props.onClick)
    if (props.children) {
        buttonNode.innerHTML = props.children
    }
    return buttonNode
}