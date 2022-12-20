
const AddProduct = () => {
  return (
    <div className="add-product-section">
        <div>
          <h2>Agregar un nuevo producto.</h2>
        </div>
        <form className="px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                Nombre del producto
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text"/>
            </div>
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productPrice">
                Precio del producto
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productPrice" type="number" step="0.01"/>
            </div>
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productDescription">
                Descripcion del producto
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productDescription" type="text"/>
            </div>
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productCategory">
                Categoria del producto
              </label>
              <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productCategory">
                <option>Selecciona una categoria</option>
                <option>Comida</option>
                <option>Bebida</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productDescription">
                Imagen del producto
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productDescription" type="file" accept="image/png, image/jpeg"/>
            </div>
            <div className="flex items-center justify-between flex-col">
              <button className="text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="button">
                Agregar
              </button>
            </div>
        </form>
    </div>
  )
}

export default AddProduct