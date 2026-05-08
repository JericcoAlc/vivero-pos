'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Tickets() {

  const [ventas, setVentas] =
    useState<any[]>([])

  const [busqueda, setBusqueda] =
    useState('')

  const [filtroMetodo,
    setFiltroMetodo] =
    useState('todos')

  const [filtroTiempo,
    setFiltroTiempo] =
    useState('todo')

  useEffect(() => {
    obtenerVentas()
  }, [])

  async function obtenerVentas() {

    const { data } = await supabase
      .from('ventas')
      .select('*')
      .order('fecha', {
        ascending: false
      })

    if (data) {
      setVentas(data)
    }
  }

  /* FILTRO TIEMPO */

  const ventasFiltradasTiempo =
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

  /* FILTRO GENERAL */

  const ticketsFiltrados =
    useMemo(() => {

      return ventasFiltradasTiempo.filter(
        (venta) => {

          const coincideBusqueda =

            venta.ticket
              ?.toLowerCase()
              .includes(
                busqueda.toLowerCase()
              )

            ||

            venta.metodo_pago
              ?.toLowerCase()
              .includes(
                busqueda.toLowerCase()
              )

          const coincideMetodo =

            filtroMetodo === 'todos'

            ||

            venta.metodo_pago
              ===
              filtroMetodo

          return (
            coincideBusqueda
            &&
            coincideMetodo
          )

        })

    }, [
      ventasFiltradasTiempo,
      busqueda,
      filtroMetodo
    ])

  /* KPIs */

  const ventasTotales =
    ticketsFiltrados.reduce(
      (acc, venta) =>
        acc + Number(venta.total),
      0
    )

  const ticketPromedio =

    ticketsFiltrados.length > 0

      ?

      ventasTotales
      /
      ticketsFiltrados.length

      :

      0

  const efectivoTotal =
    ticketsFiltrados
      .filter(
        (v) =>
          v.metodo_pago ===
          'efectivo'
      )
      .reduce(
        (acc, venta) =>
          acc +
          Number(venta.total),
        0
      )

  const tarjetaTotal =
    ticketsFiltrados
      .filter(
        (v) =>
          v.metodo_pago ===
          'tarjeta'
      )
      .reduce(
        (acc, venta) =>
          acc +
          Number(venta.total),
        0
      )

  return (

    <div className="bg-[#F8F9F4] min-h-screen p-3 md:p-6 text-[#1F2937]">

      {/* HEADER */}

      <div className="mb-8">

        <h1
          className="
            text-3xl
            md:text-4xl
            xl:text-5xl
            font-black
            text-[#1F3A2E]
          "
        >

          Tickets

        </h1>

        <p
          className="
            text-gray-500
            mt-2
            text-base
            md:text-lg
          "
        >

          Historial completo de ventas

        </p>

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

            $
            {ventasTotales.toFixed(0)}

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

            {ticketsFiltrados.length}

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
            {ticketPromedio.toFixed(0)}

          </h2>

        </div>

        <div className="bg-[#1F3A2E] text-white rounded-3xl p-6 shadow-xl">

          <p className="opacity-70">

            Métodos Pago

          </p>

          <div className="mt-3 space-y-1">

            <p className="font-bold">

              Efectivo:
              {' '}
              $
              {efectivoTotal.toFixed(0)}

            </p>

            <p className="font-bold">

              Tarjeta:
              {' '}
              $
              {tarjetaTotal.toFixed(0)}

            </p>

          </div>

        </div>

      </div>

      {/* FILTROS */}

      <div className="bg-white rounded-3xl p-5 shadow-md mb-8">

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-4
          "
        >

          {/* BUSCADOR */}

          <input
            type="text"
            placeholder="Buscar ticket o método..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
            className="
              bg-[#F3F4F6]
              rounded-2xl
              px-5
              py-4
              outline-none
              text-[#1F2937]
              placeholder:text-gray-400
            "
          />

          {/* MÉTODO */}

          <select
            value={filtroMetodo}
            onChange={(e) =>
              setFiltroMetodo(
                e.target.value
              )
            }
            className="
              bg-[#F3F4F6]
              rounded-2xl
              px-5
              py-4
              outline-none
              text-[#1F2937]
            "
          >

            <option value="todos">

              Todos los métodos

            </option>

            <option value="efectivo">

              Efectivo

            </option>

            <option value="tarjeta">

              Tarjeta

            </option>

            <option value="transferencia">

              Transferencia

            </option>

          </select>

          {/* TIEMPO */}

          <select
            value={filtroTiempo}
            onChange={(e) =>
              setFiltroTiempo(
                e.target.value
              )
            }
            className="
              bg-[#F3F4F6]
              rounded-2xl
              px-5
              py-4
              outline-none
              text-[#1F2937]
            "
          >

            <option value="todo">

              Todo el tiempo

            </option>

            <option value="hoy">

              Hoy

            </option>

            <option value="semana">

              Última semana

            </option>

            <option value="mes">

              Este mes

            </option>

            <option value="anio">

              Este año

            </option>

          </select>

        </div>

      </div>

      {/* TABLA */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-[#1F3A2E] text-white">

              <tr>

                <th className="text-left p-5">

                  Ticket

                </th>

                <th className="text-left p-5">

                  Fecha

                </th>

                <th className="text-left p-5">

                  Hora

                </th>

                <th className="text-left p-5">

                  Método

                </th>

                <th className="text-left p-5">

                  Total

                </th>

                <th className="text-left p-5">

                  Estado

                </th>

              </tr>

            </thead>

            <tbody className="text-[#1F2937]">

              {ticketsFiltrados.map(
                (venta) => {

                const fecha =
                  new Date(
                    venta.fecha
                  )

                return (

                  <tr
                    key={venta.id}
                    className="
                      border-b
                      hover:bg-[#F8F9F4]
                    "
                  >

                    <td className="p-5 font-bold">

                      #{venta.ticket}

                    </td>

                    <td className="p-5">

                      {fecha.toLocaleDateString()}

                    </td>

                    <td className="p-5">

                      {fecha.toLocaleTimeString()}

                    </td>

                    <td className="p-5">

                      <div
                        className={`
                          px-4
                          py-2
                          rounded-xl
                          font-bold
                          w-fit

                          ${
                            venta.metodo_pago ===
                            'efectivo'

                              ?

                              'bg-green-100 text-green-600'

                              :

                            venta.metodo_pago ===
                            'tarjeta'

                              ?

                              'bg-blue-100 text-blue-600'

                              :

                              'bg-yellow-100 text-yellow-700'
                          }
                        `}
                      >

                        {venta.metodo_pago}

                      </div>

                    </td>

                    <td className="p-5 font-black text-[#1F3A2E]">

                      $
                      {Number(
                        venta.total
                      ).toFixed(0)}

                    </td>

                    <td className="p-5">

                      <div
                        className="
                          bg-green-100
                          text-green-600

                          px-4
                          py-2

                          rounded-xl
                          font-bold
                          w-fit
                        "
                      >

                        Completado

                      </div>

                    </td>

                  </tr>

                )})}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}