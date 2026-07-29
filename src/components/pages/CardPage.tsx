'use client';

import { motion } from 'framer-motion';
import { CardPageConfig } from '@/types/page';
import { withBasePath } from '@/lib/basePath';

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                {config.items.map((item, index) => {
                    const visualSrc = item.logo || item.image;
                    const hasVisual = Boolean(visualSrc || item.logoText);
                    const visualText = item.logoText || '';

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                {hasVisual && (
                                    <div className="flex-shrink-0">
                                        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl border overflow-hidden flex items-center justify-center ${visualSrc
                                            ? "border-neutral-200 dark:border-neutral-700 bg-white shadow-sm"
                                            : "border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-accent/10 via-neutral-50 to-neutral-100 dark:from-accent/15 dark:via-neutral-800 dark:to-neutral-900"
                                            }`}>
                                            {visualSrc ? (
                                                <img
                                                    src={withBasePath(visualSrc)}
                                                    alt={`${item.title} logo`}
                                                    className="w-full h-full object-contain p-2.5"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="text-base font-serif font-bold text-accent">{visualText}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                        <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary leading-tight`}>{item.title}</h3>
                                        {item.date && (
                                            <span className="shrink-0 text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                                {item.date}
                                            </span>
                                        )}
                                    </div>
                                    {item.subtitle && (
                                        <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                                    )}
                                    {item.roles && item.roles.length > 0 && (
                                        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                            {item.roles.map((role, roleIndex) => (
                                                <div
                                                    key={`${role.title}-${role.date || roleIndex}`}
                                                    className={`${roleIndex === 0 ? "pt-1" : "pt-4"} pb-4 last:pb-0`}
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                                                        <h4 className={`${embedded ? "text-base" : "text-lg"} font-semibold text-primary leading-tight`}>
                                                            {role.title}
                                                        </h4>
                                                        {role.date && (
                                                            <span className="shrink-0 text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                                                {role.date}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {role.subtitle && (
                                                        <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-2`}>
                                                            {role.subtitle}
                                                        </p>
                                                    )}
                                                    {role.content && (
                                                        <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                                            {role.content}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {item.content && (
                                        <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed space-y-1`}>
                                            {item.content.split('\n').map((line, lineIndex) => (
                                                <p key={lineIndex}>{line}</p>
                                            ))}
                                        </div>
                                    )}
                                    {item.tags && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
