
const AddCategory = () => {
  return (
    <div className="add-category-section">
        <div>
          <h2>Agregar una nueva categoria.</h2>
        </div>
        <form className="px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="categoryName">
                Nombre de la categoria
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="categoryName" type="text"/>
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

export default AddCategory