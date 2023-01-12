const Combos = () => {
    return (
        <>
            <div className="combos-section section">
                <form className="form-search">
                    <div>
                    <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                  Nombre del producto
                </label>
                <input placeholder="Buscar productos"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text" onChange={handleProductSearch} value={productSearchTerm}/>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Combos