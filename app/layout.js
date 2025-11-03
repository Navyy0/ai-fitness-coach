import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { QueryProvider } from './providers';
import { AuthContextProvider } from '../contexts/AuthContext';

export const metadata = {
  title: 'AI Fitness Coach',
  description: 'AI-powered fitness assistant that generates personalized workout and diet plans'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <AuthContextProvider>
          <QueryProvider>
            <Header />
            <main className="max-w-7xl mx-auto p-4 sm:p-6">{children}</main>
            <Footer />
          </QueryProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
