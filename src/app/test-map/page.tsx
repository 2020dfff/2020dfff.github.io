'use client';

import AmChartsMap from '@/components/pages/AmChartsMap';

export default function TestMapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl    npm run dev font-bold mb-8">Test Map Page</h1>
      <p className="mb-4">If you see a map below, the AmChartsMap component is working:</p>
      <AmChartsMap />
    </div>
  );
}
