export function intoExpiresInAsSeconds(expiresAt: number) {
    return Math.floor((expiresAt - Date.now()) / 1000);
}