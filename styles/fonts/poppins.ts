import { Poppins } from 'next/font/google';

export const poppins = Poppins({
  display: 'swap',
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});
