import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { GameProvider } from '@/context/GameContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'KindQuest',
    template: '%s | KindQuest',
  },
  description:
    'Multilingual educational game for children — learn respect, kindness and honesty through play.',
  keywords: ['education', 'children', 'game', 'values', 'uzbek', 'russian', 'english'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <LanguageProvider>
            <GameProvider>{children}</GameProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
