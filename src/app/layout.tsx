import './globals.css';
import type React from 'react';

export const metadata = {
  title: 'Painel — Quitação do Templo',
  description: 'Painel de acompanhamento das quitações do templo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex items-start justify-center p-6">
          {children}
        </div>
      </body>
    </html>
  );
}
