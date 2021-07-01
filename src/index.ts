import { ArrayEmoji } from './dataEmoji'
import { Scroll } from './ui/Scroll/Scroll'
import { Tabs } from './ui/Tabs/Tabs';
import { TextField } from './ui/TextField/TextField';
import { List } from './ui/List/List';
import { Smile, Clock } from './ui/Icons/Icons';
import { Button } from './ui/Button/Button';
import { Store } from './Store/Store';
import { FakeServer, emojisType } from './FakeServer/FakeServer';
import useChangeTheme from './ui/utils/useChangeTheme';
import convertMaptoSortArray from './ui/utils/convertMaptoSortArray'
import { loadState, saveState } from './ui/utils/useLocalStorage'

type ThemeType = 'dark' | 'light'
type State = {
    activeTabIndex: number
    inputText: string
    favorites: Map<string, number>
    favoritesCount: number
    showEmoji: boolean
    cursor: number
    emojis: emojisType[]
    theme: ThemeType
}
// Создаем Store
const store = new Store<State>({
    activeTabIndex: 0,
    inputText: '',
    favorites: new Map(),
    favoritesCount: 0,
    showEmoji: false,
    cursor: 0,
    emojis: [],
    theme: 'light'
})

// Достаем из localStorageState если есть старая версия
const localStorageState = loadState()
if (localStorageState) {
    store.init({
        ...localStorageState,
        favorites: new Map(localStorageState.favorites.map((key: any) => [key[0], key[1]]))
    })
}
store.getState()?.activeTabIndex
// подписываемся на изменения в store
store.subscribe(observerRender)

const fakeServer = new FakeServer(ArrayEmoji)

const root = document.getElementById('root')

// Создаем общий контейнер для приложения
const container = document.createElement('div')
container.className = 'container'

// Создаем контейнер для Emoji
const emojiContainer = document.createElement('div')
emojiContainer.className = 'emoji-container emoji-container-hidden'
const emojiTail = document.createElement('div')
emojiTail.className = 'emoji-container-tail'

// Создаем компоненты List, и заполняем его Emoji UTF8
const newListEmoji = new List(store.getState().emojis, onClickEmoji)
const newListEmojiFavorites = new List([
    {
        'title': 'Часто используемые',
        'items': convertMaptoSortArray(store.getState().favorites)
    }
], onClickEmoji)

// Описываем содержимое табов
const tabsBlock = TabsBlock([
    {
        list: newListEmoji.create(),
        callbackScroll: onScrollUpdate,
        buttunIcon: Smile
    },
    {
        list: newListEmojiFavorites.create(),
        buttunIcon: Clock
    }
])

const btnIcon = Button({
    type: 'div',
    className: ['icon-button'],
    children: Smile,
    onClick: () => {
        store.setState(s => ({
            ...s,
            showEmoji: !s.showEmoji
        }))
    }
})

const btnTheme = Button({
    type: 'div',
    className: ['btn-theme', `btn-theme-${howNowTheme()}`],
    onClick: changeThemeState
})

const textField = TextFieldBlock()
textField.setValue(store.getState().inputText)

emojiContainer.append(tabsBlock.create(), emojiTail)
container.append(emojiContainer, textField.create())

root?.append(container, btnTheme)

textField.onFocus()

// init
getDataEmojiUpdate()
useChangeTheme(store.getState().theme)

function changeThemeState() {
    let newTheme: ThemeType = howNowTheme() === 'dark' ? 'light' : 'dark'
    store.setState(s => ({ ...s, theme: newTheme }))
}

function howNowTheme() {
    return store.getState().theme === 'light' ? 'light' : 'dark'
}

function onClickEmoji(emoji?: string) {
    if (emoji) {
        textField.addEmoji(emoji)
        const emojiCountPrev = store.getState().favorites.get(emoji)
        store.setState(s => ({
            ...s,
            favorites: s.favorites.set(emoji, (emojiCountPrev || 0) + 1),
            favoritesCount: s.favoritesCount + 1
        }))
    }
}
function getDataEmojiUpdate() {
    let cursor = store.getState().cursor
    if (cursor !== -1) {
        let dataServer = fakeServer.getEmojis(cursor)
        store.setState(s => ({
            ...s,
            cursor: dataServer.nextCursor,
            emojis: [dataServer.emojis!]
        }))
    }
}
function onChangeTextField(value: string) {
    store.setState(s => ({
        ...s,
        inputText: value
    }))
}

// Следим за границей скролла и если что подгружаем новую порцию Emoji
function onScrollUpdate(scrollPercentageY: number) {
    if (scrollPercentageY > 90) {
        getDataEmojiUpdate()
    }
}

function TabsBlock(lists:
    {
        list: HTMLElement,
        callbackScroll?: (scrollPercentageY: number) => void,
        buttunIcon: string
    }[]
) {

    const tabsContent = lists.map(list => ({
        tabContent: new Scroll(list.list, list.callbackScroll).create(),
        button: list.buttunIcon
    }))
    const newTabs = new Tabs(tabsContent)
    return newTabs
}
function TextFieldBlock() {
    const newTextField = new TextField('Ваше сообщение', btnIcon, onChangeTextField)
    return newTextField
}

// вешаем один EventListener для двух задач
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault()
        store.setState(s => ({
            ...s,
            showEmoji: !s.showEmoji
        }))
    }
    if (e.ctrlKey && e.code === 'Backquote') {
        e.preventDefault()
        store.setState(s => ({
            ...s,
            theme: s.theme === 'dark' ? 'light' : 'dark'
        }))
    }
})

/**
 * observerRender подписан на изменения в сторе и принимает решения что изменять
*/

function observerRender(oldState: State, newState: State) {

    // 0 save State в LocalStorage
    saveState({
        activeTabIndex: newState.activeTabIndex,
        theme: newState.theme,
        inputText: newState.inputText,
        favoritesCount: newState.favoritesCount,
        favorites: Array.from(newState.favorites.entries())
    })
    // 1 если изменилось количество в favoritesCount то делаем перерасчет и обновляем лист
    if (oldState.favoritesCount !== newState.favoritesCount) {
        newListEmojiFavorites.newList([{
            "title": "Часто используемые",
            'items': convertMaptoSortArray(newState.favorites)
        }]
        )
    }
    // 2 изменения в showEmoji
    if (oldState.showEmoji !== newState.showEmoji) {
        // показывать или скрывать emoji контайнер
        if (newState.showEmoji) {
            emojiContainer.classList.remove('emoji-container-hidden')
            btnIcon.classList.add('button-active')
        } else {
            emojiContainer.classList.add('emoji-container-hidden')
            btnIcon.classList.remove('button-active')
        }
        textField.onFocus()
    }
    // 3 изменения в showEmoji
    if (oldState.cursor !== newState.cursor) {
        if (newState.cursor !== -1) {
            newListEmoji.updateList(newState.emojis)
        }
    }
    // 4 изменения в theme
    if (oldState.theme !== newState.theme) {
        useChangeTheme(newState.theme)
        btnTheme.classList.toggle(`btn-theme-${oldState.theme}`)
        btnTheme.classList.toggle(`btn-theme-${newState.theme}`)
    }
}

