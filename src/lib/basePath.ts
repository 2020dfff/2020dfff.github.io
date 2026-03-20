/**
 * Prepend Next.js basePath to a URL path.
 *
 * next/image and next/link handle basePath automatically,
 * but raw HTML tags (<img>, <iframe>, <a href>, <link>) do NOT.
 * Use this helper for any content-sourced URL rendered via native HTML elements.
 */
export function withBasePath(path: string): string {
    if (!path || !path.startsWith('/')) return path;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    if (!basePath) return path;
    // Avoid double-prefixing
    if (path.startsWith(basePath)) return path;
    return `${basePath}${path}`;
}
