import type { Metadata } from 'next'
import './globals.css'

import Link from 'next/link'

export const metadata: Metadata = {

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

          <aside

            className="
              group

              bg-[#1F3A2E]
              text-white

              flex
              flex-col

              p-4

              transition-all
              duration-300
              ease-in-out

              w-[90px]
              hover:w-[280px]

              overflow-hidden
            "
          >

            {/* LOGO */}

            <div className="mb-10">

              <div
                className="
                  flex
                  items-start
                  gap-4
                "
              >

                <div
                  className="
                    min-w-[48px]
                    h-[48px]

                    rounded-2xl

                    bg-[#2D4739]

                    flex
                    items-center
                    justify-center

                    text-2xl
                  "
                >
                  🌿
                </div>

                <div
                  className="
                    opacity-0
                    group-hover:opacity-100

                    transition-all
                    duration-300

                    whitespace-nowrap
                  "
                >

                  <h1
                    className="
                      text-3xl
                      font-black
                      leading-tight
                    "
                  >

                    Vivero
                    <br />
                    San Fernando

                  </h1>

                  <p
                    className="
                      text-sm
                      opacity-70
                      mt-2
                    "
                  >

                    Control Center

                  </p>

                </div>

              </div>

            </div>

            {/* NAV */}

            <nav
              className="
                flex
                flex-col
                gap-3
              "
            >

              <Link
                href="/"
                className="
                  bg-[#2D4739]
                  hover:bg-[#3B5D4B]

                  transition-all

                  px-5
                  py-4

                  rounded-2xl

                  flex
                  items-center
                  gap-4
                "
              >

                <span className="text-2xl">
                  🛒
                </span>

                <span
                  className="
                    text-lg
                    font-semibold

                    opacity-0
                    group-hover:opacity-100

                    transition-all
                    duration-300

                    whitespace-nowrap
                  "
                >

                  POS

                </span>

              </Link>

              <Link
                href="/dashboard"
                className="
                  bg-[#2D4739]
                  hover:bg-[#3B5D4B]

                  transition-all

                  px-5
                  py-4

                  rounded-2xl

                  flex
                  items-center
                  gap-4
                "
              >

                <span className="text-2xl">
                  📊
                </span>

                <span
                  className="
                    text-lg
                    font-semibold

                    opacity-0
                    group-hover:opacity-100

                    transition-all
                    duration-300

                    whitespace-nowrap
                  "
                >

                  Dashboard

                </span>

              </Link>

              <Link
                href="/inventario"
                className="
                  bg-[#2D4739]
                  hover:bg-[#3B5D4B]

                  transition-all

                  px-5
                  py-4

                  rounded-2xl

                  flex
                  items-center
                  gap-4
                "
              >

                <span className="text-2xl">
                  📦
                </span>

                <span
                  className="
                    text-lg
                    font-semibold

                    opacity-0
                    group-hover:opacity-100

                    transition-all
                    duration-300

                    whitespace-nowrap
                  "
                >

                  Inventario

                </span>

              </Link>

              <Link
                href="/tickets"
                className="
                  bg-[#2D4739]
                  hover:bg-[#3B5D4B]

                  transition-all

                  px-5
                  py-4

                  rounded-2xl

                  flex
                  items-center
                  gap-4
                "
              >

                <span className="text-2xl">
                  🎟️
                </span>

                <span
                  className="
                    text-lg
                    font-semibold

                    opacity-0
                    group-hover:opacity-100

                    transition-all
                    duration-300

                    whitespace-nowrap
                  "
                >

                  Tickets

                </span>

              </Link>

            </nav>

            {/* FOOTER */}

            <div className="mt-auto">

              <div
                className="
                  bg-[#2D4739]
                  rounded-2xl
                  p-4

                  flex
                  items-center
                  gap-4
                "
              >

                <div className="text-2xl">
                  🟢
                </div>

                <div
                  className="
                    opacity-0
                    group-hover:opacity-100

                    transition-all
                    duration-300

                    whitespace-nowrap
                  "
                >

                  <p className="text-sm opacity-70">

                    Sistema Operativo

                  </p>

                  <p className="text-xl font-black mt-1">

                    Online

                  </p>

                </div>

              </div>

            </div>

          </aside>

          {/* CONTENIDO */}

          <main
            className="
              flex-1
              overflow-y-auto
              bg-[#F8F9F4]
            "
          >

            {children}

          </main>

        </div>

      </body>

    </html>

  )
}