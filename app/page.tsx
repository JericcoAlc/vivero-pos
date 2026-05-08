'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {

  const [ventas, setVentas] =
    useState<any[]>([])

  const [productos, setProductos] =
    useState<any[]>([])

  const [categoriaSeleccionada,
    setCategoriaSeleccionada] =
    useState('Todos')

  const [busqueda, setBusqueda] =
    useState('')

  const [metodoPago,
    setMetodoPago] =
    useState('efectivo')

  const [carrito, setCarrito] =
    useState<any[]>([])

  const [dineroRecibido,
    setDineroRecibido] =
    useState('')

  const [mostrarCobro,
    setMostrarCobro] =
    useState(false)

  const [mostrarTicket,
    setMostrarTicket] =
    useState(false)

  const [ticketActual,
    setTicketActual] =
    useState<any>(null)

  useEffect(() => {
    obtenerVentas()
    obtenerProductos()
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

  async function obtenerProductos() {

    const { data } = await supabase
      .from('productos')
      .select('*')

    if (data) {
      setProductos(data)
    }
  }

  function agregarProductoDirecto(
    productoData: any
  ) {

    const nuevoProducto = {
      producto: productoData.nombre,
      cantidad: 1,
      precio: Number(productoData.precio),
      subtotal: Number(productoData.precio),
    }

    setCarrito([
      ...carrito,
      nuevoProducto
    ])
  }

  function eliminarDelCarrito(
    index: number
  ) {

    const nuevoCarrito =
      carrito.filter(
        (_, i) => i !== index
      )

    setCarrito(nuevoCarrito)
  }

  function aumentarCantidad(
    index: number
  ) {

    const nuevoCarrito = [...carrito]

    nuevoCarrito[index].cantidad += 1

    nuevoCarrito[index].subtotal =
      nuevoCarrito[index].cantidad *
      nuevoCarrito[index].precio

    setCarrito(nuevoCarrito)
  }

  function disminuirCantidad(
    index: number
  ) {

    const nuevoCarrito = [...carrito]

    if (
      nuevoCarrito[index].cantidad > 1
    ) {

      nuevoCarrito[index].cantidad -= 1

      nuevoCarrito[index].subtotal =
        nuevoCarrito[index].cantidad *
        nuevoCarrito[index].precio

      setCarrito(nuevoCarrito)
    }
  }

  async function cobrarVenta() {

    if (carrito.length === 0) return

    const ticket =
      Date.now().toString()

    const totalGeneral =
      carrito.reduce(
        (acc, item) =>
          acc + item.subtotal,
        0
      )

    await supabase
      .from('ventas')
      .insert([
        {
          ticket,
          total: totalGeneral,
          metodo_pago: metodoPago,
        },
      ])

    const items = carrito.map(
      (item) => ({
        ticket,
        producto: item.producto,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: item.subtotal,
      })
    )

    await supabase
      .from('venta_items')
      .insert(items)

    setTicketActual({
      ticket,
      items: carrito,
      total: totalGeneral,
      metodoPago,
      dineroRecibido,
      cambio,
    })

    setMostrarTicket(true)

    setCarrito([])

    obtenerVentas()
  }

  const categorias = [
    'Todos',
    ...new Set(
      productos.map(
        (producto: any) =>
          producto.categoria
      )
    )
  ]

  const productosFiltrados =
    productos.filter(
      (producto: any) => {

        const coincideCategoria =
          categoriaSeleccionada ===
          'Todos'
          ||
          producto.categoria ===
          categoriaSeleccionada

        const coincideBusqueda =
          producto.nombre
            .toLowerCase()
            .includes(
              busqueda.toLowerCase()
            )

        return (
          coincideCategoria &&
          coincideBusqueda
        )
      }
    )

  const totalGeneral =
    carrito.reduce(
      (acc, item) =>
        acc + item.subtotal,
      0
    )

  const cambio =
    Number(dineroRecibido || 0)
    - totalGeneral

  return (

    <div className="bg-[#F8F9F4] min-h-screen text-[#1F2937] p-3 md:p-5">

      {/* HEADER */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          px-4 md:px-8
          py-5
          mb-5

          flex
          flex-col
          lg:flex-row

          gap-4

          lg:items-center
          justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              md:text-3xl
              xl:text-4xl
              font-black
              tracking-tight
              text-[#1F3A2E]
            "
          >
            Vivero San Fernando
          </h1>

          <p
            className="
              text-gray-500
              mt-1
              text-sm
              md:text-base
            "
          >
            Sistema operativo del vivero
          </p>

        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-4
          "
        >

          <div
            className="
              bg-[#F3F4F6]
              px-5
              py-3
              rounded-2xl
            "
          >

            <p className="text-sm text-gray-500">
              Ventas hoy
            </p>

            <p className="text-2xl font-bold">
              {ventas.length}
            </p>

          </div>

          <div
            className="
              bg-[#1F3A2E]
              text-white
              px-5
              py-3
              rounded-2xl
            "
          >

            <p className="text-sm opacity-70">
              Total actual
            </p>

            <p className="text-2xl font-bold">
              ${totalGeneral}
            </p>

          </div>

        </div>

      </div>

      {/* LAYOUT */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-[220px_1fr]
          xl:grid-cols-[260px_1fr_380px]
          gap-5
          min-h-[85vh]
        "
      >

        {/* SIDEBAR */}

        <div
          className="
            bg-[#1F3A2E]
            text-white
            rounded-3xl
            p-5
            shadow-xl
            overflow-hidden
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-5
            "
          >
            Categorías
          </h2>

          <div
            className="
              flex
              lg:block
              gap-3
              overflow-x-auto
              lg:overflow-visible
              pb-2
            "
          >

            {categorias.map((categoria) => (

              <button
                key={categoria}

                onClick={() =>
                  setCategoriaSeleccionada(
                    categoria
                  )
                }

                className={`
                  min-w-fit
                  lg:w-full

                  text-left
                  whitespace-nowrap

                  px-5
                  py-4

                  rounded-2xl

                  transition-all
                  duration-200

                  text-base
                  md:text-lg

                  ${
                    categoriaSeleccionada ===
                    categoria
                      ? 'bg-[#A3B18A] text-[#1F3A2E] font-bold'
                      : 'bg-[#2D4739] hover:bg-[#3B5D4B]'
                  }
                `}
              >

                {categoria}

              </button>

            ))}

          </div>

        </div>

        {/* PRODUCTOS */}

        <div className="overflow-y-auto">

          <div
            className="
              bg-white
              rounded-3xl
              shadow-md
              p-5
              mb-5
            "
          >

            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              className="
                w-full
                bg-[#F3F4F6]
                rounded-2xl
                px-5
                py-4
                outline-none
                text-base
                md:text-lg
              "
            />

          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              gap-4
            "
          >

            {productosFiltrados.map(
              (productoData) => (

              <button
                key={productoData.id}

                onClick={() =>
                  agregarProductoDirecto(
                    productoData
                  )
                }

                className="
                  bg-white
                  rounded-3xl
                  p-5
                  shadow-md
                  hover:shadow-2xl
                  hover:scale-[1.02]
                  transition-all
                  duration-200
                  text-left
                "
              >

                <div className="mb-4">

                  <div
                    className="
                      w-14 h-14
                      rounded-2xl
                      bg-[#A3B18A]
                      flex
                      items-center
                      justify-center
                      text-2xl
                    "
                  >
                    🌿
                  </div>

                </div>

                <p
                  className="
                    text-lg
                    md:text-xl
                    font-bold
                    text-[#1F3A2E]
                  "
                >
                  {productoData.nombre}
                </p>

                <p className="text-gray-500 mt-1">
                  {productoData.categoria}
                </p>

                <p
                  className="
                    text-2xl
                    md:text-3xl
                    font-black
                    mt-5
                  "
                >
                  ${productoData.precio}
                </p>

              </button>

            ))}

          </div>

        </div>

        {/* CARRITO */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            p-4 md:p-5
            flex flex-col
            w-full
          "
        >

          <div
            className="
              flex items-center
              justify-between
              mb-6
            "
          >

            <h2
              className="
                text-2xl
                md:text-3xl
                font-black
                text-[#1F3A2E]
              "
            >
              Carrito
            </h2>

            <div
              className="
                bg-[#F3F4F6]
                px-4
                py-2
                rounded-2xl
              "
            >

              <p className="font-bold">
                {carrito.length} items
              </p>

            </div>

          </div>

          <div
            className="
              flex-1
              overflow-y-auto
              space-y-4
            "
          >

            {carrito.map(
              (item, index) => (

              <div
                key={index}
                className="
                  bg-[#F8F9F4]
                  rounded-3xl
                  p-5
                "
              >

                <div
                  className="
                    flex items-start
                    justify-between
                    gap-3
                  "
                >

                  <div>

                    <p
                      className="
                        text-lg
                        md:text-xl
                        font-bold
                        text-[#1F3A2E]
                      "
                    >
                      {item.producto}
                    </p>

                    <p className="text-gray-500 mt-1">
                      ${item.precio} c/u
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      eliminarDelCarrito(index)
                    }
                    className="
                      bg-red-100
                      text-red-500
                      px-3 py-2
                      rounded-xl
                    "
                  >
                    ✕
                  </button>

                </div>

                <div
                  className="
                    flex items-center
                    justify-between
                    mt-5
                  "
                >

                  <div
                    className="
                      flex items-center
                      gap-3
                    "
                  >

                    <button
                      onClick={() =>
                        disminuirCantidad(index)
                      }
                      className="
                        w-10 h-10
                        rounded-xl
                        bg-white
                        shadow
                      "
                    >
                      -
                    </button>

                    <p className="text-xl font-bold">
                      {item.cantidad}
                    </p>

                    <button
                      onClick={() =>
                        aumentarCantidad(index)
                      }
                      className="
                        w-10 h-10
                        rounded-xl
                        bg-white
                        shadow
                      "
                    >
                      +
                    </button>

                  </div>

                  <p
                    className="
                      text-2xl
                      font-black
                      text-[#1F3A2E]
                    "
                  >
                    ${item.subtotal}
                  </p>

                </div>

              </div>

            ))}

          </div>

          <div className="border-t mt-5 pt-5">

            <select
              value={metodoPago}
              onChange={(e) =>
                setMetodoPago(
                  e.target.value
                )
              }
              className="
                w-full
                bg-[#F3F4F6]
                rounded-2xl
                px-5
                py-4
                mb-5
                outline-none
              "
            >

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

            <div
              className="
                flex items-center
                justify-between
                mb-5
              "
            >

              <p className="text-xl text-gray-500">
                Total
              </p>

              <p
                className="
                  text-3xl
                  md:text-4xl
                  xl:text-5xl
                  font-black
                  text-[#1F3A2E]
                "
              >
                ${totalGeneral}
              </p>

            </div>

            <button
              onClick={() =>
                setMostrarCobro(true)
              }
              className="
                w-full
                bg-[#1F3A2E]
                hover:bg-[#2D4739]
                transition-all
                text-white
                py-5
                rounded-3xl
                text-xl
                md:text-2xl
                font-black
                shadow-xl
              "
            >
              COBRAR
            </button>

          </div>

        </div>

      </div>

      {/* MODAL COBRO */}

      {mostrarCobro && (

        <div
          className="
            fixed inset-0
            bg-black/40
            flex items-center
            justify-center
            z-50
            p-4
          "
        >

          <div
            className="
              bg-white
              p-5 md:p-8
              rounded-3xl
              w-[95%]
              md:w-[500px]
              shadow-2xl
            "
          >

            <h2
              className="
                text-3xl
                md:text-4xl
                font-black
                mb-6
                text-[#1F3A2E]
              "
            >
              Cobrar
            </h2>

            <p className="text-2xl mb-4">
              Total: ${totalGeneral}
            </p>

            <input
              type="number"
              placeholder="Dinero recibido"
              value={dineroRecibido}
              onChange={(e) =>
                setDineroRecibido(
                  e.target.value
                )
              }
              className="
                w-full
                bg-[#F3F4F6]
                rounded-2xl
                px-5
                py-4
                mb-5
                outline-none
              "
            />

            <p
              className="
                text-2xl
                md:text-3xl
                font-black
                mb-6
              "
            >
              Cambio:
              ${cambio > 0 ? cambio : 0}
            </p>

            <div
              className="
                flex
                flex-col
                md:flex-row
                gap-4
              "
            >

              <button
                onClick={() =>
                  setMostrarCobro(false)
                }
                className="
                  w-full
                  bg-gray-200
                  py-4
                  rounded-2xl
                  font-bold
                "
              >
                Cancelar
              </button>

              <button
                onClick={async () => {

                  await cobrarVenta()

                  setMostrarCobro(false)

                  setDineroRecibido('')

                }}
                className="
                  w-full
                  bg-[#1F3A2E]
                  text-white
                  py-4
                  rounded-2xl
                  font-bold
                "
              >
                Confirmar Cobro
              </button>

            </div>

          </div>

        </div>

      )}

      {/* MODAL TICKET */}

      {mostrarTicket && ticketActual && (

        <div
          className="
            fixed inset-0
            bg-black/40
            flex items-center
            justify-center
            z-50
            p-4
          "
        >

          <div
            className="
              bg-white
              p-5 md:p-8
              rounded-3xl
              w-[95%]
              md:w-[500px]
              shadow-2xl
            "
          >

            <div id="ticket-print">

              <h2
                className="
                  text-3xl
                  md:text-4xl
                  font-black
                  mb-2
                  text-center
                  text-[#1F3A2E]
                "
              >
                Vivero San Fernando
              </h2>

              <p
                className="
                  text-center
                  text-gray-500
                  mb-6
                "
              >
                Ticket de compra
              </p>

              <p className="mb-2">
                Ticket:
                {ticketActual.ticket}
              </p>

              <p className="mb-6">
                Método:
                {ticketActual.metodoPago}
              </p>

              <div className="space-y-3 mb-6">

                {ticketActual.items.map(
                  (
                    item: any,
                    index: number
                  ) => (

                  <div
                    key={index}
                    className="
                      flex justify-between
                      border-b
                      pb-2
                    "
                  >

                    <div>

                      <p className="font-bold">
                        {item.producto}
                      </p>

                      <p>
                        x{item.cantidad}
                      </p>

                    </div>

                    <p>
                      ${item.subtotal}
                    </p>

                  </div>

                ))}

              </div>

              <div
                className="
                  space-y-2
                  text-lg md:text-xl
                "
              >

                <div className="flex justify-between">

                  <p>Total:</p>

                  <p className="font-bold">
                    ${ticketActual.total}
                  </p>

                </div>

                <div className="flex justify-between">

                  <p>Recibido:</p>

                  <p>
                    ${ticketActual.dineroRecibido}
                  </p>

                </div>

                <div className="flex justify-between">

                  <p>Cambio:</p>

                  <p>
                    ${ticketActual.cambio}
                  </p>

                </div>

              </div>

            </div>

            <div
              className="
                flex
                flex-col
                md:flex-row
                gap-4
                mt-8
                print:hidden
              "
            >

              <button
                onClick={() =>
                  window.print()
                }
                className="
                  w-full
                  bg-[#1F3A2E]
                  text-white
                  py-4
                  rounded-2xl
                  font-bold
                "
              >
                Imprimir
              </button>

              <button
                onClick={() =>
                  setMostrarTicket(false)
                }
                className="
                  w-full
                  bg-gray-200
                  py-4
                  rounded-2xl
                  font-bold
                "
              >
                Cerrar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )
}