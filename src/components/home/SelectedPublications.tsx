import Link from 'next/link';
import { Publication } from '@/types/publication';
import { withBasePath } from '@/lib/basePath';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    const getPublicationBadge = (pub: Publication) => {
        return pub.badge || 'PAPER';
    };

    const getPublicationPreviewSrc = (pub: Publication) => {
        if (pub.previewUrl || pub.thumbnailUrl) return pub.previewUrl || pub.thumbnailUrl;
        if (pub.preview) return withBasePath(`/papers/${pub.preview}`);
        return null;
    };

    return (
        <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                {enableOnePageMode ? (
                    // Native in-page anchor: reliably scrolls to the #publications section
                    // (respects scroll-mt / scroll-smooth) without next/link's same-page
                    // hash quirk, and avoids basePath prefixing issues.
                    <a
                        href="#publications"
                        className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                    >
                        View All →
                    </a>
                ) : (
                    <Link
                        href="/publications"
                        prefetch={true}
                        className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                    >
                        View All →
                    </Link>
                )}
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <div
                        key={pub.id}
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02] animate-fade-in"
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="sm:w-28 flex-shrink-0">
                                <div className="aspect-video sm:aspect-[4/3] rounded-lg overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 relative">
                                    {getPublicationPreviewSrc(pub) ? (
                                        <img
                                            src={getPublicationPreviewSrc(pub) || ''}
                                            alt={pub.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            loading="lazy"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 via-white to-neutral-100 dark:from-accent/15 dark:via-neutral-900 dark:to-neutral-800">
                                            <span className="text-lg font-serif font-bold text-accent">{getPublicationBadge(pub)}</span>
                                            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">{pub.year}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-primary mb-2 leading-tight">
                                    {pub.title}
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                                {author.name}
                                            </span>
                                            {author.isCorresponding && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                                    {pub.journal || pub.conference}
                                </p>
                                {pub.description && (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                        {pub.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
