/**
 * Фейковая серверная логика по отдачи контента порциями
 */

export type emojisType = {
    title: string
    items: string[]
}

type response = {
    cursor: number
    nextCursor: number
    emojis?: emojisType
}
export class FakeServer {
    constructor(private emojisDB: emojisType[]) { }
    getNextCursor(cursor: number) {
        if (cursor + 1 <= this.emojisDB.length) {
            return cursor + 1
        } else {
            return -1
        }
    }
    getEmojis(cursor: number): response {
        let jsonResult: response
        let nextCursor = this.getNextCursor(cursor)
        if (nextCursor !== -1) {
            jsonResult = {
                cursor: cursor,
                nextCursor: nextCursor,
                emojis: this.emojisDB[cursor]
            }
        } else {
            jsonResult = {
                cursor: cursor,
                nextCursor: nextCursor
            }
        }
        return jsonResult
    }
}