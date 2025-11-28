'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { TextPageConfig } from '@/types/page';
import AmChartsMap from './AmChartsMap';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
    slug?: string;
}

export default function TextPage({ config, content, embedded = false, slug }: TextPageProps) {
    // 检测内容中是否包含地图占位符，或者如果是 misc 页面
    const hasMap = slug === 'misc' || content.includes('<div id="chartdiv"></div>') || content.includes('id="chartdiv"');
    
    // 移除地图相关的 script 标签和占位符，因为我们会用 React 组件替代
    const cleanedContent = content
        .replace(/<script[^>]*src="https:\/\/cdn\.amcharts\.com[^"]*"[^>]*><\/script>/g, '')
        .replace(/<script>[\s\S]*?am5\.ready[\s\S]*?<\/script>/g, '')
        .replace(/<div id="chartdiv"><\/div>/g, '')
        .replace(/#chartdiv[\s\S]*?}/g, '');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                    {config.description}
                </p>
            )}
            <div className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        h1: ({ children }) => {
                            return (
                                <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>
                            );
                        },
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium hover:underline transition-colors"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {cleanedContent}
                </ReactMarkdown>
                
                {/* 如果是 misc 页面，在内容后渲染地图 */}
                {slug === 'misc' && (
                    <div className="mt-8">
                        <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">🌏 Footprints Map</h1>
                        <AmChartsMap />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
