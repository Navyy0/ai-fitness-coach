// app/layout.js
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'AI Fitness Coach',
  description: 'AI generated workout & diet plans'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto p-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
