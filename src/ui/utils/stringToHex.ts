export default function stringToHex(string: string) {
    return encodeURIComponent(string.replace(/\uFE0F/giu, ''))
        .replace(/%/ig, '')
        .toLowerCase();
}