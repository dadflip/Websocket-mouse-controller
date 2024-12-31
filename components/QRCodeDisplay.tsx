'use client';

import QRCode from 'qrcode.react';

interface QRCodeDisplayProps {
  url: string;
}

export default function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  return (
    <div className="bg-white p-4 rounded-lg inline-block">
      <QRCode value={url} size={200} />
    </div>
  );
}