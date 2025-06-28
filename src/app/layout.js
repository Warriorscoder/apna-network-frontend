import './globals.css';
import { Inter, Roboto } from 'next/font/google';
import Footer from './Footer';
import { AuthProvider } from "./context/Authcontext";

const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Apna Network',
  description: 'Connecting Communities, Empowering Lives',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='scroll-smooth'>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <main className="flex-grow">{children}</main>
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
