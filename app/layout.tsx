import type { Metadata } from 'next';

import '@/styles/globals.css';
import { poppins } from '@/styles/fonts/poppins';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Girin WalletConnect Example',
  description: 'Powered by Girin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <div className="flex h-[150px] items-center justify-center">
          <Link href="https://girin.app">
            <Image
              priority
              src="/logo.svg"
              alt="Logo"
              width={181}
              height={88.36}
            />
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
