import { notFound } from 'next/navigation';
import { getMarkdownContent } from '@/lib/content';
import TextPage from '@/components/pages/TextPage';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function generateStaticParams() {
    try {
        const files = fs.readdirSync(BLOG_DIR);
        return files
            .filter(file => file.endsWith('.md'))
            .map(file => ({
                post: file.replace('.md', ''),
            }));
    } catch (error) {
        console.error('Error reading blog directory:', error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ post: string }> }): Promise<Metadata> {
    const { post } = await params;
    const content = getMarkdownContent(`blog/${post}.md`);
    
    // Extract title from markdown frontmatter or first heading
    const titleMatch = content.match(/^title:\s*["'](.+)["']/m) || content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1] : post;

    return {
        title: `${title} | Blog`,
        description: 'Blog post',
    };
}

export default async function BlogPost({ params }: { params: Promise<{ post: string }> }) {
    const { post } = await params;
    
    try {
        const content = getMarkdownContent(`blog/${post}.md`);
        
        // Remove frontmatter if present
        const cleanContent = content.replace(/^---[\s\S]*?---\n/m, '');
        
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <TextPage 
                    config={{
                        type: 'text',
                        title: 'Blog',
                        source: `blog/${post}.md`
                    }} 
                    content={cleanContent}
                    embedded={false}
                />
            </div>
        );
    } catch (error) {
        console.error('Error loading blog post:', error);
        notFound();
    }
}
