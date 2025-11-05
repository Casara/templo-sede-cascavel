'use client';

import PixSection from '@/components/PixSection';
import TempleTimeline from '@/components/TempleTimeline';
import type { Props } from '@/types';

export default function Page() {
  const data: Props = {
    churchName: 'IPAD Ministério Restauração — Área Oeste do Paraná',
    templeImage: '/templo.jpg',
    pix: {
      key: 'tesouraria.o.parana@restauramundo.com',
      qrcodeValue:
        '00020101021126590014br.gov.bcb.pix0137tesouraria.o.parana@restauramundo.com5204000053039865802BR5925IGREJA PENTECOSTAL ASSEMB6012PORTO ALEGRE62070503***63043EC2',
    },
    entryValue: 200000,
    totalValue: 740000,
    updatedAt: '2025-11-03T00:00:00',
    months: [
      {
        month: 'Abr/25',
        templeDue: 10000,
        loanDue: 0,
        templePayment: 10000,
        loanPayment: 0,
        available: 0,
        paidTotal: 10000,
        supportFund: 0,
      },
      {
        month: 'Mai/25',
        templeDue: 10000,
        loanDue: 3500,
        templePayment: 10000,
        loanPayment: 3500,
        available: 0,
        paidTotal: 13500,
        supportFund: 0,
      },
      {
        month: 'Jun/25',
        templeDue: 10000,
        loanDue: 3500,
        templePayment: 10000,
        loanPayment: 3500,
        available: 0,
        paidTotal: 13500,
        supportFund: 0,
      },
      {
        month: 'Jul/25',
        templeDue: 10000,
        loanDue: 3500,
        templePayment: 10000,
        loanPayment: 3500,
        available: 0,
        paidTotal: 13500,
        supportFund: 3100,
      },
      {
        month: 'Ago/25',
        templeDue: 10000,
        loanDue: 3500,
        templePayment: 10000,
        loanPayment: 3500,
        available: 0,
        paidTotal: 13500,
        supportFund: 0,
      },
      {
        month: 'Set/25',
        templeDue: 10000,
        loanDue: 3500,
        templePayment: 10000,
        loanPayment: 3500,
        available: 0,
        paidTotal: 13500,
        supportFund: 0,
      },
      {
        month: 'Out/25',
        templeDue: 10000,
        loanDue: 3500,
        templePayment: 10000,
        loanPayment: 3500,
        available: 0,
        paidTotal: 13500,
        supportFund: 7000,
      },
      {
        month: 'Nov/25',
        templeDue: 10000,
        loanDue: 3500,
        templePayment: 0,
        loanPayment: 0,
        available: 620,
        paidTotal: 0,
        supportFund: 0,
      },
    ],
  };

  return (
    <main className="max-w-6xl w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 space-y-4">
          <TempleTimeline {...data} />
          <PixSection {...data} />
        </div>
      </div>
    </main>
  );
}
