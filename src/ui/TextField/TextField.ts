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
    setValue(newValue: string) {
        if (newValue !== this.value) {
            this.value = newValue
            this.textFieldInput.innerHTML = newValue
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
                let cleantText = detectHighlightTarget(pastedText)
                cleantText = cleanUpText(cleantText)
                cleantText = this.emojiDetect(cleantText)
                document.execCommand('insertHTML', false, cleantText.trim())
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
    addContentInRange(content: HTMLElement) {
        let select = window.getSelection() || document.getSelection()
        if (this.saveRange.startOffset !== this.saveRange.endOffset) {
            this.saveRange.deleteContents()
        }
        this.saveRange.insertNode(content)
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
        let allText = this.textFieldInput.innerHTML
        if (fixContentaditable(this.textFieldInput.innerHTML)) {
            this.textFieldInput.innerHTML = ''
            this.onChangeInput && this.onChangeInput('')
            return
        }
        let cleantText = detectHighlightTarget(allText)
        if (allText !== cleantText) {

            let realDom = createDOMmap(this.textFieldInput)
            let virtualDom = createDOMmap(stringToHTML(cleantText))

            diff(virtualDom, realDom, this.textFieldInput)

            this.restore()
        }
        this.textFieldInput.normalize()
        this.onChangeInput && this.onChangeInput(cleantText)

    }
}

function cleanUpText(textPast: string) {
    let tagRegex = /<[^>]+>/igm
    let style = /(style="[^"]*")/igm
    let validTagsRegex = /(<img class="emoji" src=".*" >)|(<br\/?>)/igm

    let res = textPast
        .replace(style, '')
        .replace(tagRegex, function (tag) {
            return tag.match(validTagsRegex) ? tag : '';
        })
        .replace(/\n/g, '')
    return res
}

function detectHighlightTarget(nodeText: string) {
    let urlRegex = /(^|\s)https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig
    let hashtagsRegex = /[\s](#[A-Za-zА-Яа-яё0-9]+)[\s]/ig
    let MenschenRegex = /[\s](@[A-Za-zА-Яа-яё0-9]*\b)[\s]/ig
    let mailRegex = /\S+@\S+\.\S+/ig

    let cleantText: string = ''

    cleantText = nodeText
        .replace(urlRegex, (tagA, taB) => `<a>${taB}</a> `)
        .replace(mailRegex, (tagA, taB) => `<a>${taB}</a> `)
        .replace(MenschenRegex, (tagA, taB) => `<a>${taB}</a> `)
        .replace(hashtagsRegex, (tagA, taB) => `<a>${taB}</a> `)

    return cleantText
}
function fixContentaditable(string: string) {
    return string === '<br>'
}