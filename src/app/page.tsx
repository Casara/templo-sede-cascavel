'use client';

import { useEffect, useState } from 'react';

import PixSection from '@/components/PixSection';
import TempleTimeline from '@/components/TempleTimeline';
import { fetchData } from '@/data/fetchMonths';
import type { Data } from '@/types';

export default function Page() {
  const [data, setData] = useState<Data | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <div className="w-24 h-24 border-10 border-gray-200 border-t-blue-600 rounded-full animate-[spin_1s_ease-in-out_infinite]" />
      </main>
    );
  }

  return (
    <main className="max-w-6xl w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 space-y-4">
          <TempleTimeline
            entryValue={200000}
            totalValue={740000}
            updatedAt={data?.updatedAt}
            months={data?.months}
          />
          <PixSection />
        </div>
      </div>
    </main>
  );
}
