'use client';

import { QRCodeCanvas } from 'qrcode.react';

import type { Props } from '@/types';

export default function PixSection(data: Props) {
  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg print:shadow-none"
      style={{
        backgroundImage: `url('/templo-sede-cascavel/${data.templeImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Darkened overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Main content */}
      <div className="relative flex flex-col items-center text-center p-6 md:p-10 space-y-6 text-white">
        <div className="space-y-3 w-full max-w-[90%] break-words">
          <div className="text-2xl md:text-3xl font-bold drop-shadow-lg">
            Contribua via PIX
          </div>
          <div className="text-base sm:text-lg md:text-xl font-semibold tracking-wide drop-shadow-md break-all">
            {data.pix.key}
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-md">
          <QRCodeCanvas value={data.pix.qrcodeValue} size={100} />
        </div>

        <blockquote className="max-w-xl text-base sm:text-lg md:text-xl italic text-center leading-relaxed drop-shadow-lg">
          “Deus ama ao que dá com alegria.”
          <footer className="mt-2 not-italic text-gray-300 text-xs md:text-sm">
            — 2 Coríntios 9:7b
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
