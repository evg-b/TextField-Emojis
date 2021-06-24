import setEvgCssVar from './../utils/setEvgCssVar';
import { Button } from './../Button/Button';

type TabsType = {
    tabContent: HTMLElement
    button: string
}

export class Tabs {
    constructor(
        private children: TabsType[],
        private changeTabIndex?: (indexActiveTab: number) => void
    ) { }

    tabs = document.createElement('div')
    tabsZone = document.createElement('div')
    tabPanel = document.createElement('div')
    mapTabsCoord = new Map()
    indexActiveTab = 0
    prevIndexActiveTab = 0
    create() {
        const { tabs, tabsZone, tabPanel, children } = this
        tabs.className = 'tabs'
        tabsZone.className = 'tabs_zone'
        tabPanel.className = 'tabs_panel'

        children.forEach((child, index) => {
            child.tabContent.classList.add('tab')

            const offsetX = child.tabContent.offsetWidth * (index + 1)
            this.mapTabsCoord.set(index, offsetX)

            const btnTab = Button({
                type: 'button',
                className: ['tab_button', this.indexActiveTab === index ? 'tab_button_active' : ''],
                children: child.button,
                onClick: () => this.setIndexActiveTab(index)
            })
            btnTab.setAttribute('data-index', `${index}`)

            tabPanel.append(btnTab)
            tabsZone.append(child.tabContent)
        })

        tabs.append(tabsZone, tabPanel)

        return tabs
    }
    setIndexActiveTab(activeIndex: number) {
        let coordChildTab = 0
        if (this.prevIndexActiveTab !== activeIndex && activeIndex <= this.children.length - 1) {
            this.tabPanel.childNodes.forEach(node => {
                const htmlNode = (node as HTMLElement)
                if (htmlNode.dataset.index) {
                    let indexChild = Number(htmlNode.dataset.index)
                    if (indexChild === activeIndex) {
                        htmlNode.classList.add('tab_button_active')
                    } else {
                        htmlNode.classList.remove('tab_button_active')
                    }
                }

            })
            this.prevIndexActiveTab = activeIndex
            // вычисляем на какое расстояние нужно сдвинуть tab_zone
            coordChildTab = (this.children[activeIndex].tabContent.getBoundingClientRect().width) * activeIndex
            setEvgCssVar(this.tabsZone, '--evg-tabs-zone-shift-x', `${-coordChildTab}px`)
            this.changeTabIndex && this.changeTabIndex(activeIndex)
        }

    }
    onChangeTabIndex(newActiveIndex: number) {
        this.prevIndexActiveTab = newActiveIndex
        this.changeTabIndex && this.changeTabIndex(newActiveIndex)
    }
}