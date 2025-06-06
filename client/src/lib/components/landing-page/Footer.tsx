import { Search } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#576F72] to-[#344054] rounded-lg flex items-center justify-center">
                                <Search className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                DigReddit
                            </span>
                        </div>
                        <p className="mb-4">
                            Turn Reddit conversations into qualified leads for
                            your business in real-time.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#how-it-works"
                                    className="hover:text-white transition-colors"
                                >
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#who-its-for"
                                    className="hover:text-white transition-colors"
                                >
                                    Who It's For
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#faq"
                                    className="hover:text-white transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="mailto:balamyohance@gmail.com"
                                    className="hover:text-white transition-colors"
                                >
                                    balamyohance@gmail.com
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://www.reddit.com/user/Hot-Glass8919"
                                    className="hover:text-white transition-colors"
                                >
                                    u/Hot-Glass8919
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p>© 2025 DigReddit. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect width="4" height="12" x="2" y="9" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <rect
                                    width="20"
                                    height="20"
                                    x="2"
                                    y="2"
                                    rx="5"
                                    ry="5"
                                />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
