import { Scroll } from './../Scroll/Scroll'
import buildEmoji from './../utils/buildEmoji'
import { templRegExpEmoji } from './../utils/templRegExpEmoji'
import { createDOMmap, stringToHTML, diff } from './../utils/virtualDom'

export class TextField {
    constructor(
        private placeholder: string = 'placeholder',
        private actionElement: HTMLElement | '',
        private onChangeInput?: (value: string) => void
    ) { }
    value = ''
    textFieldBase = document.createElement('div')
    textFieldInput = document.createElement('div')
    selectTargetNode: Node = document.createElement('div')
    saveRange = new Range
    selectStart = 0
    selectEnd = 0
    prevMatchTagsText = ''
    setValue(newValue: string) {
        if (newValue !== this.value) {
            this.value = newValue
            this.textFieldInput.innerHTML = newValue
            // this.restore()
        }
    }
    onFocus() {
        this.textFieldInput.focus()
    }
    create() {
        const { textFieldBase, textFieldInput, actionElement } = this
        textFieldBase.className = 'textField_base'
        textFieldInput.className = 'textField_input'

        textFieldInput.setAttribute('contenteditable', 'true')
        textFieldInput.setAttribute('role', 'textbox')
        textFieldInput.setAttribute('placeholder', this.placeholder)

        const newScrollByInput = new Scroll(textFieldInput)

        if (actionElement instanceof HTMLElement) {
            actionElement.classList.add('textField_icon-button')
            textFieldBase.append(actionElement)
        }
        textFieldBase.append(newScrollByInput.create())

        textFieldInput.addEventListener('paste', (e) => {
            e.preventDefault()
            let pastedText = e.clipboardData?.getData('text/html') || e.clipboardData?.getData('text/plain')
            if (pastedText) {
                let { cleantText, matchTags } = detectHighlightTarget(pastedText)
                this.prevMatchTagsText = matchTags.join('')
                cleantText = this.emojiDetect(cleantText)
                console.log('past:', cleantText)
                cleantText = cleanUpText(cleantText).trim()
                this.addContentInRange(cleantText)
                // this.restore()
            }
        })
        document.addEventListener('selectionchange', () => this.detectAndSaveRange())
        const mutationObserver = new MutationObserver((e) => this.highlightRealTime(e))
        mutationObserver.observe(textFieldInput, {
            childList: true,
            characterData: true, // изменение текстового значения 
            characterDataOldValue: true,
            subtree: true
        })

        return textFieldBase
    }

    addEmoji(emojiUTF8: string) {
        this.addContentInRange(buildEmoji(emojiUTF8, 'mini'))
    }
    addContentInRange(content: string | HTMLElement) {
        let select = window.getSelection() || document.getSelection()
        if (this.saveRange.startOffset !== this.saveRange.endOffset) {
            this.saveRange.deleteContents()
        }

        let contentNode = document.createDocumentFragment()
        contentNode.append(content)

        this.saveRange.insertNode(contentNode)
        this.saveRange.collapse(false)
        select?.addRange(this.saveRange)
    }
    emojiDetect(str: string) {
        // ищем emojiUTF8 в тексте и замменяем на свои img
        let emojiRegex = new RegExp(templRegExpEmoji, 'g');

        str = str.replace(/\uFE0F/giu, '');
        return str.replace(emojiRegex, str => buildEmoji(str, 'mini').outerHTML)
    }
    restore() {
        this.saveRange.selectNodeContents(this.textFieldInput)
        this.saveRange.collapse(false)
        let sel = window.getSelection() || document.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(this.saveRange)
    }
    detectAndSaveRange() {
        let select = window.getSelection() || document.getSelection()
        if (select && select.anchorNode) {
            if ((select.anchorNode as HTMLElement).className === 'textField_input' || (select.anchorNode?.parentNode as HTMLElement).className === 'textField_input') {
                this.saveRange = select.getRangeAt(0)
            }
        }
    }
    highlightRealTime(e: MutationRecord[]) {
        let allText = this.textFieldInput.innerText
        if (fixContentaditable(this.textFieldInput.innerHTML)) {
            this.textFieldInput.innerHTML = ''
            this.onChangeInput && this.onChangeInput('')
            return
        }
        let { cleantText, matchTags } = detectHighlightTarget(allText)
        let matchTagsText = matchTags.join('')
        let lastMatchTagsText = this.prevMatchTagsText
        if (this.prevMatchTagsText !== matchTagsText) {
            this.prevMatchTagsText = matchTagsText
            console.log('[highlightRealTime] что-то поменялось заменяем')
            console.log('[highlightRealTime] вот', lastMatchTagsText, matchTagsText)

            let newTextFieldInput = document.createElement('div')
            newTextFieldInput.innerHTML = cleantText

            const countOldNodes = this.textFieldInput.childNodes.length
            const countNewNodes = newTextFieldInput.childNodes.length
            console.log('[highlightRealTime] old count:', countOldNodes)
            console.log('[highlightRealTime] new count:', countNewNodes)

            let realDom = createDOMmap(this.textFieldInput)
            let virtualDom = createDOMmap(stringToHTML(cleantText))

            diff(virtualDom, realDom, this.textFieldInput)
        }
        this.onChangeInput && this.onChangeInput(cleantText)
    }
}

function cleanUpText(textPast: string) {
    let tagRegex = /<[^>]+>/gim
    let styleTagRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gim
    let style = /style="([^"]*)"/gim
    let validTagsRegex = /<br[\s\/]*>|<img.*? class="emoji" src="(.*?)">/i

    return textPast
        .replace(styleTagRegex, '')
        .replace(style, '')
        .replace(tagRegex, function (tag) {
            return tag.match(validTagsRegex) ? tag : '';
        })
        .replace(/\n/g, '')
}

function detectHighlightTarget(text: string) {
    let urlRegex = /(^|\s)https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig
    let hashtagsRegex = /(^|\s)(#[a-z\d-]+)/ig
    let MenschenRegex = /^|\s(@[a-z\d-]+)/ig
    let mailRegex = /\S+@\S+\.\S+/ig

    let matchTags: string[] = []

    let cleantText = text
        .replace(urlRegex, (tag) => `<a>${addTag(matchTags, tag)}</a>`)
        .replace(mailRegex, (tag) => `<a>${addTag(matchTags, tag)}</a>`)
        .replace(MenschenRegex, (tag) => `<a>${addTag(matchTags, tag)}</a>`)
        .replace(hashtagsRegex, (tag) => `<a>${addTag(matchTags, tag)}</a>`)

    return { cleantText, matchTags }
}
function addTag(arr: string[], tag: string) {
    arr.push(tag)
    return tag
}
function fixContentaditable(string: string) {
    return string === '<br>'
}