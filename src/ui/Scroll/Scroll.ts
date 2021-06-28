import { TouchDriver, MoveCoord } from './../TouchDriver/TouchDriver';
import setEvgCssVar from './../utils/setEvgCssVar';

// тут есть возможность и для горизонтального скролла
export class Scroll {
    constructor(
        private children: HTMLElement,
        private onUpdate?: (scrollPercentageY: number) => void
    ) { }
    prevNowY = 0
    isTouchTrack = false
    scrollOverflow = document.createElement('div')
    scrollTrack = document.createElement('div')
    scrollContainer = document.createElement('div')
    create() {
        const { children, scrollOverflow, scrollTrack, scrollContainer } = this

        scrollOverflow.className = 'scroll-overflow'
        scrollOverflow.append(children)

        scrollTrack.className = 'scroll-track scroll-track-y'

        scrollContainer.className = 'scroll-container'
        scrollContainer.append(scrollOverflow, scrollTrack)

        const satisfactorySizeBind = satisfactorySize.bind(null, scrollContainer, scrollOverflow)
        satisfactorySizeBind()

        // если содержимое контейнера изменилась на уровне количества children
        const mutationObserver = new MutationObserver(satisfactorySizeBind)
        // если содержимое контейнера изменилась по высоте но количество children не изменилось
        const resizeObserver = new ResizeObserver(satisfactorySizeBind)

        resizeObserver.observe(scrollOverflow)
        mutationObserver.observe(scrollOverflow, {
            childList: true,
            subtree: true,
        })

        scrollOverflow.addEventListener('scroll', (e) => this.onMoveScroll(e), { passive: false })

        const touchDriver = new TouchDriver(
            scrollTrack,
            this.onStart.bind(this),
            this.onMoveY.bind(this),
            this.onMoveEnd.bind(this)
        )
        touchDriver.observe()

        return scrollContainer
    }
    // Вычисляем на сколько сдвинулся track (курсором или жестом) и двигаем track и контайнер на нужную дистанцию. 
    calcPosition(newPositionScroll: number = 0) {
        const { scrollOverflow, scrollContainer } = this
        const space = getSpace(scrollContainer, scrollOverflow)
        const scollSizeY = calcScrollerSize(space).y

        let workSpace = space.container.y
        let allSpace = space.overflow.y
        let ratioShift = allSpace / workSpace

        let startScroll = 0
        let endScroll = workSpace - scollSizeY

        let scrollToY = scrollOverflow.scrollTop
        if (newPositionScroll >= 0 && newPositionScroll < endScroll) {
            scrollToY = ratioShift * newPositionScroll
            setEvgCssVar(scrollContainer, '--evg-scroller--y', `${scrollToY}px`)
        } else {
            // Если кординаты превышают начальную границу скрола, то просто оставляем его на начальной позиции (startScroll). Так же с конечной границей. (endScroll)
            if (Math.sign(newPositionScroll) === -1) {
                scrollToY = startScroll
                setEvgCssVar(scrollContainer, '--evg-scroller--y', `${scrollToY}px`)
            } else {
                scrollToY = ratioShift * endScroll
                setEvgCssVar(scrollContainer, '--evg-scroller--y', `${scrollToY}px`)
            }
        }

        scrollOverflow.scrollTo(0, scrollToY)
    }
    // Вычисляем новое положение track и сдвигаем его при срабатывании события onscroll
    onMoveScroll(e: Event) {
        const { scrollContainer, scrollOverflow } = this
        const { container, overflow } = getSpace(scrollContainer, scrollOverflow)

        let scrollPercentageY = Number(((e.target as Element).scrollTop / (overflow.y - container.y)).toFixed(2))
        let scrollPercentage = Number(((e.target as Element).scrollTop / (overflow.y)).toFixed(2))

        let positionY = scrollPercentage * container.y

        setEvgCssVar(scrollContainer, '--evg-scroller-y', `${positionY}px`)

        this.onScrollDetectPosition(scrollPercentageY)
    }
    // callback для TouchDriver
    // высчитываем новую позицию track и скролл контента при нажатие
    onStart(e: MoveCoord) {
        let { scrollContainer, scrollOverflow, isTouchTrack } = this
        const { nowY } = e
        isTouchTrack = true
        const space = getSpace(scrollContainer, scrollOverflow)
        const scollSizeY = calcScrollerSize(space).y

        if (nowY < this.prevNowY || nowY > (this.prevNowY + scollSizeY)) {
            let correction = scollSizeY / 2

            this.prevNowY = nowY - correction
            this.calcPosition(this.prevNowY)
        }

    }
    // callback для TouchDriver
    // посылаем новые координаты в calcPosition() чтобы менять позицию скролла во время движения.
    onMoveY(e: MoveCoord) {
        this.prevNowY += e.deltaY
        this.calcPosition(this.prevNowY)
    }
    // callback для TouchDriver
    onMoveEnd() {
        this.isTouchTrack = false
    }
    onScrollDetectPosition(scrollPercentageY: number) {
        this.onUpdate && this.onUpdate(scrollPercentageY * 100)
    }
}

type Space = {
    container: { x: number, y: number }
    overflow: { x: number, y: number }
}
function getSpace(containerNode: HTMLElement, overflowNode: HTMLElement): Space {
    return {
        container: {
            x: containerNode.offsetWidth,
            y: containerNode.offsetHeight
        },
        overflow: {
            x: overflowNode.scrollWidth,
            y: overflowNode.scrollHeight
        }
    }
}
function calcScrollerSize(space: Space): Space['container'] {
    const { container, overflow } = space
    return {
        x: (container.x / overflow.x) * container.x,
        y: (container.y / overflow.y) * container.y
    }
}
// Выясняем, нужно ли показывать track. Если высота прокручиваемого контейнера больше видимой облости, то показываем.
function satisfactorySize(containerNode: HTMLElement, overflowNode: HTMLElement) {
    const space = getSpace(containerNode, overflowNode)
    let isShow = false
    if (space.container.y < space.overflow.y) {
        isShow = true
    }

    const scollSizeY = calcScrollerSize(space).y

    setEvgCssVar(containerNode, '--evg-scroller-size-y', `${scollSizeY}px`)
    setEvgCssVar(containerNode, '--evg-scroller-show', `${isShow ? 'block' : 'none'}`)
}