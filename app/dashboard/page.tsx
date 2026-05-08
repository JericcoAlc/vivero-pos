'use client'

import {

  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,

} from 'recharts'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {

  const [ventas, setVentas] =
    useState<any[]>([])

  const [items, setItems] =
    useState<any[]>([])

  const [filtroTiempo,
    setFiltroTiempo] =
    useState('mes')

  useEffect(() => {

    obtenerDatos()

  }, [])

  async function obtenerDatos() {

    const { data: ventasData } =
      await supabase
        .from('ventas')
        .select('*')

    const { data: itemsData } =
      await supabase
        .from('venta_items')
        .select('*')

    if (ventasData) {
      setVentas(ventasData)
    }

    if (itemsData) {
      setItems(itemsData)
    }
  }

  const ventasFiltradas =
    useMemo(() => {

      const ahora = new Date()

      return ventas.filter((venta) => {

        const fecha =
          new Date(venta.created_at)

        const diff =
          (ahora.getTime()
            - fecha.getTime())
          /
          (1000 * 60 * 60 * 24)

        switch (filtroTiempo) {

          case 'hoy':
            return diff <= 1

          case 'semana':
            return diff <= 7

          case 'mes':
            return diff <= 30

          case 'año':
            return diff <= 365

          default:
            return true
        }
      })

    }, [ventas, filtroTiempo])

  const itemsFiltrados =
    useMemo(() => {

      const tickets =
        ventasFiltradas.map(
          (v) => v.ticket
        )

      return items.filter((item) =>
        tickets.includes(item.ticket)
      )

    }, [items, ventasFiltradas])

  const ventasTotales =
    ventasFiltradas.reduce(
      (acc, venta) =>
        acc + Number(venta.total),
      0
    )

  const ticketsTotales =
    ventasFiltradas.length

  const ticketPromedio =
    ticketsTotales > 0
      ? ventasTotales /
        ticketsTotales
      : 0

  const ventasPorDia =
    ventasFiltradas.map(
      (venta) => ({
        fecha:
          new Date(
            venta.created_at
          ).toLocaleDateString(),

        total:
          Number(venta.total),
      })
    )

  const metodosPago = [

    {
      name: 'Efectivo',

      value:
        ventasFiltradas.filter(
          (v) =>
            v.metodo_pago ===
            'efectivo'
        ).length
    },

    {
      name: 'Tarjeta',

      value:
        ventasFiltradas.filter(
          (v) =>
            v.metodo_pago ===
            'tarjeta'
        ).length
    },

    {
      name: 'Transferencia',

      value:
        ventasFiltradas.filter(
          (v) =>
            v.metodo_pago ===
            'transferencia'
        ).length
    },
  ]

  const productosMap:
    Record<string, number> = {}

  itemsFiltrados.forEach((item) => {

    if (!productosMap[item.producto]) {

      productosMap[item.producto] = 0
    }

    productosMap[item.producto] +=
      item.cantidad
  })

  const productosTop =
    Object.entries(productosMap)
      .map(([producto, cantidad]) => ({

        producto,
        cantidad,

      }))
      .sort(
        (a, b) =>
          b.cantidad - a.cantidad
      )
      .slice(0, 5)

  const horasMap:
    Record<string, number> = {}

  ventasFiltradas.forEach((venta) => {

    const hora =
      new Date(
        venta.created_at
      ).getHours()

    const horaTexto =
      `${hora}:00`

    if (!horasMap[horaTexto]) {

      horasMap[horaTexto] = 0
    }

    horasMap[horaTexto] +=
      Number(venta.total)
  })

  const horasPico =
    Object.entries(horasMap)
      .map(([hora, total]) => ({

        hora,
        total,

      }))

  const insights = [

    `El ticket promedio actual es de $${ticketPromedio.toFixed(2)}.`,

    `Se han generado ${ticketsTotales} tickets en el periodo seleccionado.`,

    `El producto más vendido es ${productosTop[0]?.producto || 'N/A'}.`,

    `Las ventas totales acumuladas son de $${ventasTotales.toFixed(2)}.`,

  ]

  const scoreNegocio =
    Math.min(
      100,
      Math.round(
        (
          ventasTotales / 100
        )
        +
        (
          ticketsTotales * 2
        )
      )
    )

  return (

    <div className="bg-[#F8F9F4] min-h-screen p-3 md:p-6">

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          justify-between
          gap-5
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl
              font-black
              text-[#1F3A2E]
            "
          >

            Dashboard Inteligente

          </h1>

          <p
            className="
              text-gray-500
              mt-2
              text-base
              md:text-lg
            "
          >

            Analítica operativa del vivero

          </p>

        </div>

        <div
          className="
            bg-[#1F3A2E]
            text-white
            rounded-3xl
            px-5 md:px-8
            py-5
            shadow-xl
            w-full
            xl:w-auto
          "
        >

          <p className="opacity-70">
            Score Operativo
          </p>

          <h2
            className="
              text-4xl
              md:text-5xl
              font-black
            "
          >

            {scoreNegocio}/100

          </h2>

        </div>

      </div>

      {/* FILTROS */}

      <div
        className="
          flex
          gap-3
          mb-8
          overflow-x-auto
          pb-2
        "
      >

        {[
          'hoy',
          'semana',
          'mes',
          'año',
          'todo'
        ].map((filtro) => (

          <button
            key={filtro}

            onClick={() =>
              setFiltroTiempo(
                filtro
              )
            }

            className={`
              min-w-fit
              px-5
              md:px-6
              py-3
              rounded-2xl
              font-bold
              capitalize
              transition-all
              border
              whitespace-nowrap

              ${
                filtroTiempo === filtro
                  ? 'bg-[#1F3A2E] text-white shadow-xl border-[#1F3A2E]'
                  : 'bg-white text-[#1F2937] hover:bg-gray-100 border-gray-200'
              }
            `}
          >

            {filtro}

          </button>

        ))}

      </div>

      {/* KPIs */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          2xl:grid-cols-4
          gap-5
          mb-8
        "
      >

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Ventas Totales
          </p>

          <h2
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl
              font-black
              mt-3
              text-[#1F3A2E]
            "
          >

            ${ventasTotales}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Tickets
          </p>

          <h2
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl
              font-black
              mt-3
              text-[#1F3A2E]
            "
          >

            {ticketsTotales}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Ticket Promedio
          </p>

          <h2
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl
              font-black
              mt-3
              text-[#1F3A2E]
            "
          >

            $
            {ticketPromedio.toFixed(2)}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Productos Vendidos
          </p>

          <h2
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl
              font-black
              mt-3
              text-[#1F3A2E]
            "
          >

            {itemsFiltrados.length}

          </h2>

        </div>

      </div>

      {/* GRAFICAS */}

      <div
        className="
          grid
          grid-cols-1
          2xl:grid-cols-2
          gap-6
          mb-8
        "
      >

        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-md">

          <h2
            className="
              text-xl
              md:text-2xl
              font-black
              mb-6
              text-[#1F3A2E]
            "
          >

            Tendencia de Ventas

          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <AreaChart data={ventasPorDia}>

              <defs>

                <linearGradient
                  id="colorVentas"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#1F3A2E"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#1F3A2E"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="fecha" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#1F3A2E"
                fillOpacity={1}
                fill="url(#colorVentas)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-md">

          <h2
            className="
              text-xl
              md:text-2xl
              font-black
              mb-6
              text-[#1F3A2E]
            "
          >

            Métodos de Pago

          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={metodosPago}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#1F3A2E"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-md">

          <h2
            className="
              text-xl
              md:text-2xl
              font-black
              mb-6
              text-[#1F3A2E]
            "
          >

            Productos Más Vendidos

          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={productosTop}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="producto" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="cantidad"
                fill="#588157"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-md">

          <h2
            className="
              text-xl
              md:text-2xl
              font-black
              mb-6
              text-[#1F3A2E]
            "
          >

            Horas Pico

          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <LineChart data={horasPico}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="hora" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#A3B18A"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* INSIGHTS */}

      <div
        className="
          bg-white
          rounded-3xl
          p-5 md:p-8
          shadow-xl
        "
      >

        <h2
          className="
            text-2xl
            md:text-3xl
            font-black
            mb-6
            text-[#1F3A2E]
          "
        >

          Insights Inteligentes

        </h2>

        <div className="space-y-4">

          {insights?.map((insight, index) => (

            <div
              key={index}
              className="
                bg-[#F8F9F4]
                rounded-2xl
                p-4 md:p-5
              "
            >

              <p
                className="
                  text-base
                  md:text-lg
                  font-medium
                "
              >

                {insight}

              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}