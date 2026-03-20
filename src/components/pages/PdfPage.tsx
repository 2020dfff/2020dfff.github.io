'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { withBasePath } from '@/lib/basePath';

interface PdfPageProps {
    title: string;
    pdfUrl: string;
    downloadFilename?: string;
}

export default function PdfPage({ title, pdfUrl, downloadFilename }: PdfPageProps) {
    const fullPdfUrl = withBasePath(pdfUrl);
    return (
        <div>
            {/* Header with title and download button */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-serif font-bold text-primary">{title}</h1>
                <a
                    href={fullPdfUrl}
                    download={downloadFilename || true}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Download PDF</span>
                </a>
            </div>

            {/* PDF Embed */}
            <div className="w-full rounded-lg overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700">
                <iframe
                    src={fullPdfUrl}
                    className="w-full bg-neutral-100 dark:bg-neutral-800"
                    style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
                    title={title}
                />
            </div>
        </div>
    );
}
