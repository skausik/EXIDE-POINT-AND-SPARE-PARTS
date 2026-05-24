import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Exide Point & Spare Parts | Quality Batteries',
  description: 'Your trusted source for Exide, Amaron, Luminous, Livguard, Microtek, Okaya, Eastman and Powerzone batteries. Best prices, genuine products.',
  keywords: 'exide battery, amaron battery, inverter battery, car battery, bike battery, luminous, livguard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
