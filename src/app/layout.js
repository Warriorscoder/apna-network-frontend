import './globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'] 
});

export const metadata = {
  title: 'Apna Network',
  description: 'Connecting Communities, Empowering Lives',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='scroll-smooth'>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ConditionalNavbar />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}