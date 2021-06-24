import splittingAnArray from './../utils/splittingAnArray';
import buildEmoji from './../utils/buildEmoji'
import { emojisType } from './../../FakeServer/FakeServer'

export class List {
    constructor(
        private children: emojisType[],
        private onClick: (emoji?: string) => void,
    ) { }

    list = document.createElement('div')
    create() {
        const { list, children } = this
        list.className = 'list'

        list.append(...this.buildItems(children))

        // создаем делегат событие на общем потомке 
        list.addEventListener('click', (e) => {
            const target = (e.target as HTMLDivElement)
            if (target.className === 'item_cont') {
                this.onClick(target.dataset.utf8)
            }
        })
        list.addEventListener('keydown', (e) => {

            const target = (e.target as HTMLDivElement)
            const index = Number(target.attributes.getNamedItem('index')?.value)

            if (target.className === 'item_cont' && e.key === 'Enter') {
                e.preventDefault()
                this.onClick(target.dataset.utf8)
            }
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault()
            }
            // передвигаемся по emoji с помощью Sibling соседей и по index у соседей с верху и с низу
            if (target.className === 'item_cont' && e.key === 'ArrowRight') {
                let next = (target.nextSibling as HTMLElement)
                if (next) {
                    next.focus()
                } else {
                    target.parentElement && (target.parentElement.nextSibling?.firstChild as HTMLElement).focus()
                }
            }
            if (target.className === 'item_cont' && e.key === 'ArrowLeft') {
                let prev = (target.previousElementSibling as HTMLElement)
                if (prev) {
                    prev.focus()
                } else {
                    target.parentElement && (target.parentElement.previousSibling?.lastChild as HTMLElement).focus()
                }
            }
            if (target.className === 'item_cont' && e.key === 'ArrowUp') {
                let parent = target.parentElement?.previousSibling
                if (parent) {
                    try { (parent.childNodes.item(index) as HTMLElement).focus() } catch { }
                }
            }
            if (target.className === 'item_cont' && e.key === 'ArrowDown') {
                let parent = target.parentElement?.nextSibling
                if (parent) {
                    try { (parent.childNodes.item(index) as HTMLElement).focus() } catch { }
                }
            }
        })

        return list
    }
    // создаем строки по 10 emoji и title
    buildItems(children: emojisType[]) {
        let items: HTMLElement[] = []
        children.forEach(child => {
            const rowTitle = document.createElement('div')
            rowTitle.className = 'row_title'
            rowTitle.innerText = child.title
            items.push(rowTitle)

            let newItemsArray10 = splittingAnArray(child.items, 10)
            newItemsArray10.forEach(items10 => {
                const rowItems = document.createElement('div')
                rowItems.className = 'row_items'

                let dressedItems10 = items10.map((item, index) => {
                    const emoji = buildEmoji(item)
                    emoji.setAttribute('index', `${index}`)
                    return emoji
                })
                rowItems.append(...dressedItems10)
                items.push(rowItems)
            })
        })
        return items
    }
    // добавить контент
    updateList(children: emojisType[]) {
        this.list.append(...this.buildItems(children))
    }
    // рендер нового листа
    newList(children: emojisType[]) {
        this.list.innerHTML = ''
        this.list.append(...this.buildItems(children))
    }

}