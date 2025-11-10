import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🔧</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Shortcut Maker
              </span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/examples"
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Examples
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
