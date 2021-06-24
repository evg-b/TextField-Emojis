export default function hexToString(hex: string) {
    return decodeURIComponent(hex.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
}