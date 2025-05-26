'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Rocket } from 'lucide-react'

export default function Landing() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-between dark:bg-gray-900">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-8 py-4 bg-black/80 backdrop-blur shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative shrink-0">
            <Image
              src="/vocalcashlogo.png"
              alt="VocalCash Logo"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-200 tracking-wide">
            VocalCash
          </h1>
        </div>

        {/* CTA links */}
        <div className="flex mt-4 sm:mt-0 space-x-3">
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm md:text-base"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition shadow-sm text-sm md:text-base"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 px-4 md:px-6 py-14 md:py-24 max-w-5xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
          Manage Your Finances with Your Voice 🗣️
        </h2>
        <p className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
          Track income and expenses hands-free. Budget smarter. Stay on top of your money—anytime,
          anywhere—by simply speaking.
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl text-base shadow-lg transition"
        >
          <Rocket size={18} /> Get Started
        </Link>
      </motion.section>

      {/* Features */}
      <section className="bg-black py-12 md:py-16 px-4 md:px-6 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 text-center">
          {[
            { icon: '🎙️', title: 'Voice-Driven', text: 'Speak to record income or expenses—no typing.' },
            { icon: '📊', title: 'Smart Dashboard', text: 'Visual insights that keep your finances clear.' },
            { icon: '🔐', title: 'Secure & Private', text: 'Only you can access your encrypted data.' },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                {f.icon} {f.title}
              </h3>
              <p className="text-gray-400 text-sm md:text-base">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-800">
        &copy; {new Date().getFullYear()} VocalCash. All rights reserved.
      </footer>
    </main>
  )
}
