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

                let dressedItems10 = items10.map(item => {
                    const emoji = buildEmoji(item)
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