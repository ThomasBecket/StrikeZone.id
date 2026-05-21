import type {Metadata} from 'next';
import { Rajdhani, DM_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'StrikeZone.id — Gear Up. Strike Hard.',
  description: 'Platform e-commerce airsoft premium pertama dan terlengkap di Indonesia dengan integrasi AI, rental, swap preloved, Event, KTP verifikasi, dan ranking komunitas.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${rajdhani.variable} ${dmSans.variable}`}>
      <body suppressHydrationWarning className="bg-[#080E18] text-[#F0F0F0] font-body selection:bg-[#4CAF50] selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
