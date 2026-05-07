import type { Metadata } from 'next'
import './globals.css'

import Link from 'next/link'

export const metadata = {
  title:
    'Vivero San Fernando Control',

  description:
    'Sistema operativo inteligente para viveros',

  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (

    <html lang="es">

      <body>

        <div className="flex h-screen overflow-hidden">

          {/* SIDEBAR */}

          <aside className="w-[280px] bg-[#1F3A2E] text-white flex flex-col p-6">

            {/* LOGO */}

            <div className="mb-10">

              <h1 className="text-3xl font-black leading-tight">

                Vivero
                <br />
                San Fernando

              </h1>

              <p className="text-sm opacity-70 mt-2">

                Control Center

              </p>

            </div>

            {/* NAV */}

            <nav className="flex flex-col gap-3">

              <Link
                href="/"
                className="bg-[#2D4739] hover:bg-[#3B5D4B] transition-all px-5 py-4 rounded-2xl text-lg font-semibold"
              >

                POS

              </Link>

              <Link
                href="/dashboard"
                className="bg-[#2D4739] hover:bg-[#3B5D4B] transition-all px-5 py-4 rounded-2xl text-lg font-semibold"
              >

                Dashboard

              </Link>

              <Link
                href="/inventario"
                className="bg-[#2D4739] hover:bg-[#3B5D4B] transition-all px-5 py-4 rounded-2xl text-lg font-semibold"
              >

                Inventario

              </Link>

              <Link
                href="/tickets"
                className="bg-[#2D4739] hover:bg-[#3B5D4B] transition-all px-5 py-4 rounded-2xl text-lg font-semibold"
              >

                Tickets

              </Link>

            </nav>

            {/* FOOTER */}

            <div className="mt-auto">

              <div className="bg-[#2D4739] rounded-2xl p-4">

                <p className="text-sm opacity-70">
                  Sistema Operativo
                </p>

                <p className="text-xl font-black mt-1">

                  Online

                </p>

              </div>

            </div>

          </aside>

          {/* CONTENIDO */}

          <main className="flex-1 overflow-y-auto">

            {children}

          </main>

        </div>

      </body>

    </html>

  )
}