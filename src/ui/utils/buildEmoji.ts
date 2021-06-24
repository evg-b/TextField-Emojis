import stringToHex from './stringToHex';

export default function buildEmoji(emojiUTF8: string, mode: 'full' | 'mini' = 'full') {
    const emojiHEX = stringToHex(emojiUTF8)
    const emoji = document.createElement(mode === 'full' ? 'i' : 'img')

    if (mode === 'mini') {
        emoji.className = `emoji`
        emoji.setAttribute('src', `/emoji/e/${emojiHEX}.png`)
        // emoji.setAttribute('alt', emojiUTF8)
        return emoji
    }
    emoji.className = `emoji @${emojiHEX}`
    const itemBox = document.createElement('div')
    itemBox.setAttribute('data-hex', emojiHEX)
    itemBox.setAttribute('data-utf8', emojiUTF8)
    itemBox.className = `item_cont`

    itemBox.append(emoji)

    return itemBox
}