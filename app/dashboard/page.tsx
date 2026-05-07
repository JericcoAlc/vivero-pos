'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts'

export default function Dashboard() {

  const [ventas, setVentas] =
    useState<any[]>([])

  const [items, setItems] =
    useState<any[]>([])

  const [filtroTiempo,
    setFiltroTiempo] =
    useState('mes')

  useEffect(() => {
    obtenerData()
  }, [])

  async function obtenerData() {

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

  /* =========================================
     FILTRO TIEMPO
  ========================================= */

  const ventasFiltradas =
    useMemo(() => {

      const ahora = new Date()

      return ventas.filter((venta) => {

        const fecha =
          new Date(venta.fecha)

        if (
          filtroTiempo === 'hoy'
        ) {

          return (
            fecha.toDateString()
            ===
            ahora.toDateString()
          )
        }

        if (
          filtroTiempo === 'semana'
        ) {

          const hace7 =
            new Date()

          hace7.setDate(
            ahora.getDate() - 7
          )

          return fecha >= hace7
        }

        if (
          filtroTiempo === 'mes'
        ) {

          return (
            fecha.getMonth()
            ===
            ahora.getMonth()
          )
        }

        if (
          filtroTiempo === 'anio'
        ) {

          return (
            fecha.getFullYear()
            ===
            ahora.getFullYear()
          )
        }

        return true

      })

    }, [
      ventas,
      filtroTiempo
    ])

  /* =========================================
     ITEMS FILTRADOS
  ========================================= */

  const ticketsFiltrados =
    ventasFiltradas.map(
      (venta) => venta.ticket
    )

  const itemsFiltrados =
    items.filter((item) =>
      ticketsFiltrados.includes(
        item.ticket
      )
    )

  /* =========================================
     KPIs
  ========================================= */

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
      ? ventasTotales / ticketsTotales
      : 0

  /* =========================================
     VENTAS POR DÍA
  ========================================= */

  const ventasPorDia =
    useMemo(() => {

      const agrupadas: any = {}

      ventasFiltradas.forEach((venta) => {

        const fecha =
          new Date(
            venta.fecha
          ).toLocaleDateString()

        if (!agrupadas[fecha]) {
          agrupadas[fecha] = 0
        }

        agrupadas[fecha] +=
          Number(venta.total)
      })

      return Object.entries(
        agrupadas
      ).map(([fecha, total]) => ({
        fecha,
        total,
      }))

    }, [ventasFiltradas])

  /* =========================================
     MÉTODOS PAGO
  ========================================= */

  const metodosPago =
    useMemo(() => {

      const agrupados: any = {}

      ventasFiltradas.forEach((venta) => {

        const metodo =
          venta.metodo_pago

        if (!agrupados[metodo]) {
          agrupados[metodo] = 0
        }

        agrupados[metodo] += 1
      })

      return Object.entries(
        agrupados
      ).map(([name, value]) => ({
        name,
        value,
      }))

    }, [ventasFiltradas])

  /* =========================================
     PRODUCTOS TOP
  ========================================= */

  const productosTop =
    useMemo(() => {

      const agrupados: any = {}

      itemsFiltrados.forEach((item) => {

        if (
          !agrupados[item.producto]
        ) {

          agrupados[item.producto] = 0
        }

        agrupados[item.producto] +=
          item.cantidad
      })

      return Object.entries(
        agrupados
      )
        .map(([producto, cantidad]) => ({
          producto,
          cantidad,
        }))
        .sort(
          (a: any, b: any) =>
            b.cantidad - a.cantidad
        )
        .slice(0, 5)

    }, [itemsFiltrados])

  /* =========================================
     HORAS PICO
  ========================================= */

  const horasPico =
    useMemo(() => {

      const agrupadas: any = {}

      ventasFiltradas.forEach((venta) => {

        const hora =
          new Date(
            venta.fecha
          ).getHours()

        const label =
          `${hora}:00`

        if (!agrupadas[label]) {
          agrupadas[label] = 0
        }

        agrupadas[label] +=
          Number(venta.total)
      })

      return Object.entries(
        agrupadas
      ).map(([hora, total]) => ({
        hora,
        total,
      }))

    }, [ventasFiltradas])

  /* =========================================
     SCORE NEGOCIO
  ========================================= */

  const scoreNegocio =
    Math.min(
      100,
      Math.round(
        (
          ventasTotales / 100 +
          ticketPromedio
        ) / 10
      )
    )

  /* =========================================
     INSIGHTS
  ========================================= */

  const insights =
    useMemo(() => {

      const insights = []

      if (
        ventasTotales < 500
      ) {

        insights.push(
          'Ventas bajas detectadas. Conviene lanzar promociones.'
        )
      }

      if (
        ticketPromedio > 1000
      ) {

        insights.push(
          'El ticket promedio es alto. Hay potencial premium.'
        )
      }

      if (
        productosTop.length > 0
      ) {

        insights.push(
          `${productosTop[0].producto} es el producto dominante actualmente.`
        )
      }

      const tarjeta =
        ventasFiltradas.filter(
          (v) =>
            v.metodo_pago ===
            'tarjeta'
        ).length

      if (
        tarjeta >
        ventasFiltradas.length * 0.5
      ) {

        insights.push(
          'La mayoría de clientes utilizan tarjeta.'
        )
      }

      if (
        horasPico.length > 0
      ) {

        const topHora =
          [...horasPico].sort(
            (a: any, b: any) =>
              b.total - a.total
          )[0]

        insights.push(
          `La hora más fuerte es ${topHora.hora}.`
        )
      }

      return insights

    }, [
      ventasTotales,
      ticketPromedio,
      productosTop,
      ventasFiltradas,
      horasPico
    ])

  return (

    <div className="bg-[#F8F9F4] min-h-screen p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-5xl font-black text-[#1F3A2E]">

            Dashboard Inteligente

          </h1>

          <p className="text-gray-500 mt-2 text-lg">

            Analítica operativa del vivero

          </p>

        </div>

        <div className="bg-[#1F3A2E] text-white rounded-3xl px-8 py-5 shadow-xl">

          <p className="opacity-70">
            Score Operativo
          </p>

          <h2 className="text-5xl font-black">

            {scoreNegocio}/100

          </h2>

        </div>

      </div>

      {/* FILTROS */}

      <div className="flex gap-3 mb-8">

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
              px-6 py-3 rounded-2xl font-bold capitalize transition-all border
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

      <div className="grid grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Ventas Totales
          </p>

          <h2 className="text-5xl font-black mt-3 text-[#1F3A2E]">

            ${ventasTotales}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Tickets
          </p>

          <h2 className="text-5xl font-black mt-3 text-[#1F3A2E]">

            {ticketsTotales}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Ticket Promedio
          </p>

          <h2 className="text-5xl font-black mt-3 text-[#1F3A2E]">

            $
            {ticketPromedio.toFixed(2)}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Productos Vendidos
          </p>

          <h2 className="text-5xl font-black mt-3 text-[#1F3A2E]">

            {itemsFiltrados.length}

          </h2>

        </div>

      </div>

      {/* GRÁFICAS */}

      <div className="grid grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <h2 className="text-2xl font-black mb-6 text-[#1F3A2E]">

            Tendencia de Ventas

          </h2>

          <ResponsiveContainer width="100%" height={320}>

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

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <h2 className="text-2xl font-black mb-6 text-[#1F3A2E]">

            Métodos de Pago

          </h2>

          <ResponsiveContainer width="100%" height={320}>

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

      </div>

      {/* SEGUNDA FILA */}

      <div className="grid grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <h2 className="text-2xl font-black mb-6 text-[#1F3A2E]">

            Productos Más Vendidos

          </h2>

          <ResponsiveContainer width="100%" height={320}>

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

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <h2 className="text-2xl font-black mb-6 text-[#1F3A2E]">

            Horas Pico

          </h2>

          <ResponsiveContainer width="100%" height={320}>

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

      <div className="bg-white rounded-3xl p-8 shadow-xl">

        <h2 className="text-3xl font-black text-[#1F3A2E] mb-6">

          Insights Inteligentes

        </h2>

        <div className="space-y-4">

          {insights.map(
            (insight, index) => (

            <div
              key={index}
              className="bg-[#F8F9F4] border border-[#E5E7EB] rounded-2xl p-5"
            >

              <p className="text-lg text-[#1F2937] font-medium">

                {insight}

              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}