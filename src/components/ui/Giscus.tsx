'use client';

import { useEffect, useRef } from 'react';
import { useThemeStore, resolveTheme } from '@/lib/stores/themeStore';

export interface GiscusConfig {
    repo: string;
    repo_id: string;
    category: string;
    category_id: string;
    mapping?: string;
    lang?: string;
}

// giscus comment widget (GitHub Discussions backed). Loads giscus/client.js into an
// isolated iframe and keeps its theme in sync with the site's light/dark mode.
export default function Giscus(cfg: GiscusConfig) {
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useThemeStore((s) => s.theme);
    const giscusTheme = resolveTheme(theme) === 'dark' ? 'dark' : 'light';

    // Inject the giscus script once.
    useEffect(() => {
        const container = containerRef.current;
        if (!container || container.querySelector('iframe.giscus-frame') || container.querySelector('script')) {
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-repo', cfg.repo);
        script.setAttribute('data-repo-id', cfg.repo_id);
        script.setAttribute('data-category', cfg.category);
        script.setAttribute('data-category-id', cfg.category_id);
        script.setAttribute('data-mapping', cfg.mapping || 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'top');
        script.setAttribute('data-theme', giscusTheme);
        script.setAttribute('data-lang', cfg.lang || 'en');
        script.setAttribute('data-loading', 'lazy');
        container.appendChild(script);
        // Load once on mount; theme updates are handled by the effect below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep the giscus iframe theme in sync with the site theme.
    useEffect(() => {
        const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
        iframe?.contentWindow?.postMessage(
            { giscus: { setConfig: { theme: giscusTheme } } },
            'https://giscus.app'
        );
    }, [giscusTheme]);

    return <div ref={containerRef} className="giscus" />;
}
