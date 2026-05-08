'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Inventario() {

  const [productos, setProductos] =
    useState<any[]>([])

  const [busqueda, setBusqueda] =
    useState('')

  const [mostrarModal,
    setMostrarModal] =
    useState(false)

  const [modoEdicion,
    setModoEdicion] =
    useState(false)

  const [productoEditando,
    setProductoEditando] =
    useState<any>(null)

  const [nombre, setNombre] =
    useState('')

  const [precio, setPrecio] =
    useState('')

  const [stock, setStock] =
    useState('')

  const [categoria, setCategoria] =
    useState('')

  const [costo, setCosto] =
    useState('')

  useEffect(() => {
    obtenerProductos()
  }, [])

  async function obtenerProductos() {

    const { data } = await supabase
      .from('productos')
      .select('*')
      .order('id', {
        ascending: false
      })

    if (data) {
      setProductos(data)
    }
  }

  function limpiarFormulario() {

    setNombre('')
    setPrecio('')
    setStock('')
    setCategoria('')
    setCosto('')

    setModoEdicion(false)

    setProductoEditando(null)
  }

  async function agregarProducto() {

    if (
      !nombre ||
      !precio ||
      !stock ||
      !categoria
    ) return

    await supabase
      .from('productos')
      .insert([
        {
          nombre,
          precio:
            Number(precio),
          stock:
            Number(stock),
          categoria,
          costo:
            Number(costo || 0),
        },
      ])

    cerrarModal()

    obtenerProductos()
  }

  async function editarProducto() {

    if (!productoEditando) return

    await supabase
      .from('productos')
      .update({
        nombre,
        precio:
          Number(precio),
        stock:
          Number(stock),
        categoria,
        costo:
          Number(costo || 0),
      })
      .eq(
        'id',
        productoEditando.id
      )

    cerrarModal()

    obtenerProductos()
  }

  async function eliminarProducto(
    id: number
  ) {

    const confirmar =
      confirm(
        '¿Eliminar producto?'
      )

    if (!confirmar) return

    await supabase
      .from('productos')
      .delete()
      .eq('id', id)

    obtenerProductos()
  }

  function abrirCrear() {

    limpiarFormulario()

    setMostrarModal(true)
  }

  function abrirEditar(
    producto: any
  ) {

    setModoEdicion(true)

    setProductoEditando(producto)

    setNombre(
      String(producto.nombre || '')
    )

    setPrecio(
      String(producto.precio || '')
    )

    setStock(
      String(producto.stock || '')
    )

    setCategoria(
      String(producto.categoria || '')
    )

    setCosto(
      String(producto.costo || '')
    )

    setMostrarModal(true)
  }

  function cerrarModal() {

    setMostrarModal(false)

    limpiarFormulario()
  }

  const productosFiltrados =
    useMemo(() => {

      return productos.filter(
        (producto) =>

          producto.nombre
            .toLowerCase()
            .includes(
              busqueda.toLowerCase()
            )

          ||

          producto.categoria
            .toLowerCase()
            .includes(
              busqueda.toLowerCase()
            )

      )

    }, [
      productos,
      busqueda
    ])

  const valorInventario =
    productos.reduce(
      (acc, producto) =>

        acc +
        (
          Number(producto.stock)
          *
          Number(producto.costo || 0)
        ),

      0
    )

  const productosBajos =
    productos.filter(
      (producto) =>
        producto.stock <= 5
    )

  const categorias =
    [
      ...new Set(
        productos.map(
          (p) => p.categoria
        )
      )
    ]

  return (

    <div className="bg-[#F8F9F4] min-h-screen p-3 md:p-6 text-[#1F2937]">

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

            Inventario

          </h1>

          <p
            className="
              text-gray-500
              mt-2
              text-base
              md:text-lg
            "
          >

            Gestión operativa del vivero

          </p>

        </div>

        <button
          onClick={abrirCrear}

          className="
            bg-[#1F3A2E]
            hover:bg-[#2D4739]

            transition-all

            text-white

            px-6 md:px-8
            py-4

            rounded-2xl

            font-bold

            shadow-xl

            w-full
            md:w-auto
          "
        >

          + Nuevo Producto

        </button>

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
            Productos
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

            {productos.length}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Categorías
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

            {categorias.length}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">

          <p className="text-gray-500">
            Stock Bajo
          </p>

          <h2
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl
              font-black
              mt-3
              text-red-500
            "
          >

            {productosBajos.length}

          </h2>

        </div>

        <div className="bg-[#1F3A2E] text-white rounded-3xl p-6 shadow-xl">

          <p className="opacity-70">
            Valor Inventario
          </p>

          <h2
            className="
              text-3xl
              md:text-4xl
              xl:text-5xl
              font-black
              mt-3
            "
          >

            $
            {valorInventario.toFixed(0)}

          </h2>

        </div>

      </div>

      {/* ALERTAS */}

      {productosBajos.length > 0 && (

        <div
          className="
            bg-red-100
            border
            border-red-200
            rounded-3xl
            p-4 md:p-6
            mb-8
          "
        >

          <h2
            className="
              text-xl
              md:text-2xl
              font-black
              text-red-600
              mb-4
            "
          >

            Alertas de Stock

          </h2>

          <div className="space-y-3">

            {productosBajos.map(
              (producto) => (

              <div
                key={producto.id}

                className="
                  bg-white
                  rounded-2xl
                  p-4

                  flex
                  flex-col
                  md:flex-row

                  md:items-center
                  justify-between

                  gap-3
                "
              >

                <div>

                  <p
                    className="
                      font-bold
                      text-lg
                      text-[#1F2937]
                    "
                  >

                    {producto.nombre}

                  </p>

                  <p className="text-gray-500">

                    {producto.categoria}

                  </p>

                </div>

                <div
                  className="
                    bg-red-500
                    text-white

                    px-4
                    py-2

                    rounded-xl
                    font-bold

                    w-fit
                  "
                >

                  Stock:
                  {' '}
                  {producto.stock}

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* BUSCADOR */}

      <div className="bg-white rounded-3xl p-5 shadow-md mb-8">

        <input
          type="text"
          placeholder="Buscar producto o categoría..."
          value={busqueda}

          onChange={(e) =>
            setBusqueda(
              e.target.value
            )
          }

          className="
            w-full
            bg-[#F3F4F6]
            rounded-2xl
            px-5
            py-4
            outline-none
            text-[#1F2937]
            placeholder:text-gray-400
          "
        />

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

          <table className="w-full min-w-[1000px]">

            <thead className="bg-[#1F3A2E] text-white">

              <tr>

                <th className="text-left p-5">
                  Producto
                </th>

                <th className="text-left p-5">
                  Categoría
                </th>

                <th className="text-left p-5">
                  Precio
                </th>

                <th className="text-left p-5">
                  Costo
                </th>

                <th className="text-left p-5">
                  Stock
                </th>

                <th className="text-left p-5">
                  Ganancia
                </th>

                <th className="text-left p-5">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody className="text-[#1F2937]">

              {productosFiltrados.map(
                (producto) => {

                const ganancia =
                  Number(producto.precio)
                  -
                  Number(producto.costo || 0)

                return (

                  <tr
                    key={producto.id}
                    className="
                      border-b
                      hover:bg-[#F8F9F4]
                    "
                  >

                    <td className="p-5 font-semibold text-lg">

                      {producto.nombre}

                    </td>

                    <td className="p-5">

                      {producto.categoria}

                    </td>

                    <td className="p-5 font-bold">

                      $
                      {producto.precio}

                    </td>

                    <td className="p-5">

                      $
                      {producto.costo || 0}

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
                            producto.stock <= 5
                              ? 'bg-red-100 text-red-500'
                              : 'bg-green-100 text-green-600'
                          }
                        `}
                      >

                        {producto.stock}

                      </div>

                    </td>

                    <td className="p-5 font-bold text-[#1F3A2E]">

                      ${ganancia}

                    </td>

                    <td className="p-5">

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            abrirEditar(
                              producto
                            )
                          }

                          className="
                            bg-[#1F3A2E]
                            text-white

                            px-4
                            py-2

                            rounded-xl
                            font-bold
                          "
                        >

                          Editar

                        </button>

                        <button
                          onClick={() =>
                            eliminarProducto(
                              producto.id
                            )
                          }

                          className="
                            bg-red-100
                            text-red-500

                            px-4
                            py-2

                            rounded-xl
                            font-bold
                          "
                        >

                          Eliminar

                        </button>

                      </div>

                    </td>

                  </tr>

                )})}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {mostrarModal && (

        <div
          className="
            fixed inset-0
            bg-black/40

            flex
            items-center
            justify-center

            z-50
            p-4
          "
        >

          <div
            className="
              bg-white

              w-[95%]
              md:w-[700px]

              rounded-3xl

              p-5 md:p-8

              shadow-2xl
            "
          >

            <h2
              className="
                text-3xl
                md:text-4xl
                font-black
                text-[#1F3A2E]
                mb-8
              "
            >

              {
                modoEdicion
                  ? 'Editar Producto'
                  : 'Nuevo Producto'
              }

            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >

              <input
                type="text"
                placeholder="Nombre"
                value={nombre || ''}

                onChange={(e) =>
                  setNombre(
                    e.target.value
                  )
                }

                className="
                  bg-[#F3F4F6]
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              />

              <input
                type="text"
                placeholder="Categoría"
                value={categoria || ''}

                onChange={(e) =>
                  setCategoria(
                    e.target.value
                  )
                }

                className="
                  bg-[#F3F4F6]
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              />

              <input
                type="number"
                placeholder="Precio venta"
                value={precio || ''}

                onChange={(e) =>
                  setPrecio(
                    e.target.value
                  )
                }

                className="
                  bg-[#F3F4F6]
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              />

              <input
                type="number"
                placeholder="Costo compra"
                value={costo || ''}

                onChange={(e) =>
                  setCosto(
                    e.target.value
                  )
                }

                className="
                  bg-[#F3F4F6]
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              />

              <input
                type="number"
                placeholder="Stock"
                value={stock || ''}

                onChange={(e) =>
                  setStock(
                    e.target.value
                  )
                }

                className="
                  bg-[#F3F4F6]
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              />

            </div>

            <div
              className="
                flex
                flex-col
                md:flex-row
                gap-4
                mt-8
              "
            >

              <button
                onClick={cerrarModal}

                className="
                  w-full
                  bg-gray-200
                  py-4
                  rounded-2xl
                  font-bold
                  text-[#1F2937]
                "
              >

                Cancelar

              </button>

              <button
                onClick={
                  modoEdicion
                    ? editarProducto
                    : agregarProducto
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

                {
                  modoEdicion
                    ? 'Guardar Cambios'
                    : 'Agregar Producto'
                }

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )
}