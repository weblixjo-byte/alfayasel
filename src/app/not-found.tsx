import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md max-w-md w-full space-y-4">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto font-extrabold text-2xl">
          404
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">Page Not Found</h2>
        <p className="text-xs text-gray-500">
          The requested page could not be found. Return to Al Fayasel Laboratories home page.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-colors uppercase tracking-wider"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}
