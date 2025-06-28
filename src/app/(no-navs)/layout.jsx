import Navbar from '@/app/Navbar';

export default function WithNavbarLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
    </>
  );
}
