export type MoveCoord = {
    startX: number
    startY: number
    nowX: number
    nowY: number
    shiftX: number
    shiftY: number
    deltaX: number
    deltaY: number
}

/**
 * Мой самый любимый компонент
 * Улавливает движения по поверхности родителя.
 * Можно делать удивительные вещи, но пока не в этой серии =) 
*/
export class TouchDriver {
    constructor(
        private targetNode: HTMLElement,
        private moveStart: (e: MoveCoord) => void,
        private move: (e: MoveCoord) => void,
        private moveEnd: (e: MoveCoord) => void
    ) { }

    isTouch = false
    prevDelta = { x: 0, y: 0 }
    moveCoord = {
        startX: 0,
        startY: 0,
        nowX: 0,
        nowY: 0,
        shiftX: 0,
        shiftY: 0,
        deltaX: 0,
        deltaY: 0,
    }
    EventSettings = {
        capture: true, // запускаемся на погружении
        passive: false
    }
    getInCoord(e: MouseEvent | TouchEvent) {
        let clientX = 0, clientY = 0

        // 1 - находим координаты нажатия относительно экрана
        if (e instanceof MouseEvent) {
            clientX = e.clientX
            clientY = e.clientY
        } else {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        }
        // 2 - находим координаты ref родителя относительно экрана
        let { x, y } = this.targetNode.getBoundingClientRect()

        // 3 - в итоге получаем координаты нажатия внутри родительского элемента
        let nowX = clientX - x
        let nowY = clientY - y

        return { nowX, nowY }
    }
    StartMouseOrTouch(e: MouseEvent | TouchEvent) {
        e.preventDefault()
        let { nowX, nowY } = this.getInCoord(e)
        this.isTouch = true
        this.moveCoord.nowX = nowX
        this.moveCoord.nowY = nowY
        this.moveStart(this.moveCoord)
    }
    Move(e: MouseEvent | TouchEvent) {
        let { isTouch, moveCoord, prevDelta } = this
        if (isTouch) {
            let { nowX, nowY } = this.getInCoord(e)

            // формируем дельты
            if (moveCoord.nowX !== 0) { moveCoord.deltaX = nowX - moveCoord.nowX }
            if (moveCoord.nowY !== 0) { moveCoord.deltaY = nowY - moveCoord.nowY }

            // запоминаем текущее положение
            moveCoord.nowX = nowX
            moveCoord.nowY = nowY

            // решаем конфликт между неопределенностью между x и y
            if (moveCoord.deltaX === moveCoord.deltaY && moveCoord.nowX !== 0 && moveCoord.nowY !== 0) {
                moveCoord.deltaY = prevDelta.y
                moveCoord.deltaX = prevDelta.x
            }
            prevDelta = { x: moveCoord.deltaX, y: moveCoord.deltaY }

            // формируем сдвиги от начала
            moveCoord.shiftX = moveCoord.nowX - moveCoord.startX
            moveCoord.shiftY = moveCoord.nowY - moveCoord.startY

            this.move(moveCoord)
        }
    }
    DetectEnd(e: MouseEvent | TouchEvent) {
        let { moveCoord, moveEnd } = this
        this.isTouch = false
        moveEnd(moveCoord)
    }
    observe() {
        // start
        this.targetNode.addEventListener('mousedown', (e) => this.StartMouseOrTouch(e), this.EventSettings)
        this.targetNode.addEventListener('touchstart', (e) => this.StartMouseOrTouch(e), this.EventSettings)
        // move
        window.addEventListener('mousemove', (e) => this.Move(e), this.EventSettings)
        this.targetNode.addEventListener('touchmove', (e) => this.Move(e), this.EventSettings)
        // end
        window.addEventListener('mouseup', (e) => this.DetectEnd(e), this.EventSettings)
        this.targetNode.addEventListener('touchend', (e) => this.DetectEnd(e), this.EventSettings)
    }
    // просто чтобы было =)
    unobserve() {
        // start
        this.targetNode.removeEventListener('mousedown', (e) => this.StartMouseOrTouch(e), this.EventSettings)
        this.targetNode.removeEventListener('touchstart', (e) => this.StartMouseOrTouch(e), this.EventSettings)
        // move
        window.removeEventListener('mousemove', (e) => this.Move(e), this.EventSettings)
        this.targetNode.removeEventListener('touchmove', (e) => this.Move(e), this.EventSettings)
        // end
        window.removeEventListener('mouseup', (e) => this.DetectEnd(e), this.EventSettings)
        this.targetNode.removeEventListener('touchend', (e) => this.DetectEnd(e), this.EventSettings)
    }
}