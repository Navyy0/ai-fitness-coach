export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white p-4 text-center text-sm mt-8">
      <p>© {new Date().getFullYear()} AI Fitness Coach. All rights reserved.</p>
      <p className="mt-2 text-gray-400">Powered by AI • Built with Next.js</p>
    </footer>
  );
}
