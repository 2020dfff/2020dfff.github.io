'use client';

import { useState } from 'react';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

// Show only the most recent few items by default; the rest are revealed via "Show more".
const DEFAULT_VISIBLE = 5;

export default function News({ items, title = 'News' }: NewsProps) {
    const [expanded, setExpanded] = useState(false);
    const hasMore = items.length > DEFAULT_VISIBLE;
    const visibleItems = expanded ? items : items.slice(0, DEFAULT_VISIBLE);

    return (
        <section className="animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-3">
                {visibleItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        {/* The neutral scale auto-inverts in dark mode via CSS vars, so no dark: overrides:
                            text-neutral-700 resolves to near-white (#e2e8f0) on the dark background. */}
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <p className="text-sm text-neutral-700 whitespace-pre-line">{item.content}</p>
                    </div>
                ))}
            </div>
            {hasMore && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-3 text-sm font-medium text-accent hover:text-accent-dark transition-colors duration-200"
                >
                    {expanded ? 'Show less' : `Show ${items.length - DEFAULT_VISIBLE} more`}
                </button>
            )}
        </section>
    );
}
