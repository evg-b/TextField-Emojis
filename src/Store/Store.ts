type listener<T> = {
    (oldState: T, newState: T): void
}

export class Store<State> {
    constructor(private state: State) { }
    listeners: listener<State>[] = []
    init(State: State) {
        this.state = { ...this.state, ...State }
    }
    getState() {
        return this.state
    }
    subscribe(listener: listener<State>) {
        this.listeners.push(listener)
    }
    setState(f: (state: State) => State) {
        const [oldState, newState] = [{ ...this.state }, f(this.state)]
        this.state = f(this.state)

        this.listeners.forEach(listener => listener(oldState, newState))
    }
}