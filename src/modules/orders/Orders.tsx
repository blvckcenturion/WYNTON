import { useEffect, useState } from "react";
import productService from "../menu/services/product";
import categoryService from "../menu/services/category";
import capitalize from "../utils/functions/capitalize";
import comboService from "../combos/services/combo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faFileImage } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "./components/ProductCard";
import elementSearch from "../utils/functions/elementSearch";
import Modal from "../utils/components/modal";

const Orders = () => {
    const [productSearchTerm, setProductSearchTerm] = useState<string>("")
    const [combosSearchTerm, setCombosSearchTerm] = useState<string>("")
    const [productType, setProductType] = useState<number>(0)
    const [productCategory, setProductCategory] = useState<number>(-2)
    const [products, setProducts] = useState<any[]>([])
    const [combos, setCombos] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [productsSearch, setProductsSearch] = useState<any[]>([])
    const [combosSearch, setCombosSearch] = useState<any[]>([])
    const [confirmOrderModal, setConfirmOrderModal] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            let products : any[] = await productService.load();
            products = products.map((p: any) => { 
                p.name = capitalize(p.name)
                p.qty = 1
                return p
            })
            let categories: any[] = await categoryService.load();
            categories = categories.map((c: any) => {
                c.name = capitalize(c.name)
                return c
            })
            setCategories(categories);

            let combos: any[] = await comboService.load();
            combos = combos.map((c: any) => { 
                c.denomination = capitalize(c.denomination)
                c.qty = 1
                c.products = c.products.map((p: any) => { 
                    let prod = products.find((product: any) => product.id === p.id)
                    return {
                        ...prod,
                        qty: p.quantity
                    }
                })
                return c
            })
            setProducts(products);
            setCombos(combos);
        })()
    }, [])
    
    const handleProductSearch = (e: any) => {
        const productFilter = (product: any) => { 
            if (productCategory === -2) {
                if (product.name.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())) return product
            } else if (productCategory === -1) {
                if (product.name.trim().toLowerCase().includes(e.target.value.trim().toLowerCase()) && product.category_id === null) return product
            } else {
                if (product.name.trim().toLowerCase().includes(e.target.value.trim().toLowerCase()) && product.category_id === productCategory) return product
            }
        }
        elementSearch(e, setProductSearchTerm, setProductsSearch, products, productFilter)
    }

    const handleComboSearch = (e: any) => { 
        const comboFilter = (combo: any) => { 
            if (combo.denomination.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())) return combo
        }
        elementSearch(e, setCombosSearchTerm, setCombosSearch, combos, comboFilter)
    }

    const handleProductType = (e: any) => {
        if (e.target.value !== productType) setProductSearchTerm("")
        setProductType(parseInt(e.target.value))   
    }

    const handleProductCategory = (e: any) => {
        let category = parseInt(e.target.value)
        const productFilter = (product: any) => { 
            // if (productCategory )
            if (category === -2) {
                if (productSearchTerm === "") return product
                else if (product.name.trim().toLowerCase().includes(productSearchTerm.trim().toLowerCase())) return product
            } else if (category === -1) {
                if (productSearchTerm === "" && product.category_id === null) return product
                else if (product.name.trim().toLowerCase().includes(productSearchTerm.trim().toLowerCase()) && product.category_id === null) return product
            } else {
                if (productSearchTerm === "" && product.category_id === category) return product
                else if (product.name.trim().toLowerCase().includes(productSearchTerm.trim().toLowerCase()) && product.category_id === category) return product
            }
            
        }
        let prod = products.filter(productFilter)
        
        setProductsSearch(prod)
        setProductCategory(category)
    }

    const getSelectedProducts = () => { 
        let selectedProducts: any[] = []
        products.forEach((p: any) => { 
            if (p.qty > 0) selectedProducts.push(p)
        })
        return selectedProducts
    }

    const getSelectedCombos = () => {
        let selectedCombos: any[] = []
        combos.forEach((c: any) => {
            if (c.qty > 0) selectedCombos.push(c)
        })
        return selectedCombos
    }

    const handleChangeProductQty = (id: number, qty: number) => {
        console.log(qty)
        let productsCopy = [...products]
        let product = productsCopy.find((p: any) => p.id === id)
        if (qty >= 0) product.qty = qty
        setProducts(productsCopy)
    }

    const handleChangeComboQty = (id: number, qty: number) => {
        console.log(qty)
        let combosCopy = [...combos]
        let combo = combosCopy.find((c: any) => c.id === id)
        if (qty >= 0) combo.qty = qty
        setCombos(combosCopy)
    }

    const showProducts = (products: any[]) => {
        if (products.length === 0)
            return (
                <div className="no-results">
                    <h4 >{(productSearchTerm === "" && productCategory == -2) ? "No existen productos registrados." : "No se encontraron resultados para tu busqueda."}</h4>
                </div>
            )
        return products.map((product: any) => { 
            return (
                <ProductCard key={product.id} id={product.id} className={`product-card ${product.qty > 0 ? "selected" : ""}`} photo={product.photo} name={product.name} qty={product.qty} handleChangeQty={handleChangeProductQty}>
                    <h4>{product.name}</h4>
                    <p className="desc">{ product.description ? product.description.length > 53 ? product.description.slice(50) + "..." : product.description : "N/A"}</p>
                    <p>{product.price.toFixed(2)} BS</p>
                </ProductCard>
            )
        })
    }
    
    const showCombos = (combos: any[]) => { 
        if (combos.length === 0)
        return <h4 className="no-results">{(productSearchTerm === "" && productCategory == -2) ? "No existen combos registrados." : "No se encontraron resultados para tu busqueda."}</h4>
        return combos.map((combo: any,) => { 
            return (
                <ProductCard key={combo.id} id={combo.id} className={`combo-card ${combo.qty > 0 ? "selected" : ""}`} photo={combo.photo} name={combo.denomination} qty={combo.qty} handleChangeQty={handleChangeComboQty}>
                    <h4>{combo.denomination}</h4>
                    <div>
                        {combo.products.map((product: any) => {
                            return (
                                <p>{product.name} <span className="text-accent-1">x{product.qty}</span></p>
                            )
                        })}
                    </div>
                    <p>{combo.price.toFixed(2)} BS</p>
                </ProductCard>
            )
        })
    }

    const getTotal = () => {
        return getSelectedProducts().reduce((acc: number, product: any) => acc + (product.price * product.qty), 0) + getSelectedCombos().reduce((acc: number, combo: any) => acc + (combo.price * combo.qty), 0)
    }

    const handleCreateOrder = () => { 

    }

    return (
        <>
            <div className="orders-module">
                <div className={`products-section ${(getSelectedProducts().length || getSelectedCombos().length) ? "" : "empty"}`}>
                    <div>
                        <form className={`${productType ? "combos" : "products"}`}>
                            <div>
                                <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                                Nombre
                                </label>
                                <input placeholder={`Buscar ${productType ? "combos" : "productos"}`}className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text" onChange={!productType ? handleProductSearch : handleComboSearch} value={!productType ? productSearchTerm : combosSearchTerm}/>
                            </div>
                            <div>
                                <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productType">
                                    Tipo
                                </label>
                                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productType" onChange={handleProductType} value={productType}>
                                    <option value="0">Productos</option>
                                    <option value="1">Combos</option>
                                </select>
                            </div>
                            {!productType ? (
                                <div>
                                    <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productType">
                                        Categoria
                                    </label>
                                    <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productType" onChange={handleProductCategory} value={productCategory}>
                                        <option value="-2">Todos</option>
                                        <option value="-1">Sin categoria</option>
                                        {categories.map((category: any) => {
                                            return <option key={category.id} value={category.id}>{category.name}</option>
                                        })}
                                    </select>  
                                </div>
                            ) : null}
                        </form>
                        
                    </div>
                    <div className={(getSelectedProducts().length || getSelectedCombos().length) ? "" : "empty"}>
                        {
                            !productType ? showProducts(((productSearchTerm || productCategory != -2 )) ? productsSearch : products) : showCombos(combosSearchTerm ? combosSearch : combos)
                        }
                    </div>
                </div>
                {(getSelectedProducts().length || getSelectedCombos().length) ? (
                    <div className="place-order-section">
                        <div>
                            <div>
                                <h3>Resumen de orden</h3>
                            </div>
                            <div>
                                {getSelectedProducts().map((product: any) => <Detail key={product.id} name={product.name} qty={product.qty} price={product.price} />)}
                                {getSelectedCombos().map((combo: any) => <Detail key={combo.id} name={combo.denomination} qty={combo.qty} price={combo.price} />)}
                            </div>
                        </div>
                        <div>
                            <h3>Detalle</h3>
                            <div>
                                <h4>Productos</h4>
                                <p>
                                    {getSelectedProducts().reduce((acc: number, product: any) => acc + (product.qty), 0)}
                                </p>
                                <h4>Combos</h4>
                                <p>
                                    {getSelectedCombos().reduce((acc: number, combo: any) => acc + (combo.qty), 0)}
                                </p>
                                <h4>Total</h4>
                                <p>
                                    {getTotal().toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <button onClick={() => setConfirmOrderModal(true)}>Crear orden</button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            <Modal className="confirm-order-modal" title={"Confirmacion de orden"} showModal={confirmOrderModal} onClose={() => setConfirmOrderModal(false)}>
                <div>
                    <div>
                        <h4>¿Estas seguro que deseas crear esta orden?</h4>
                    </div>
                    <div>
                        {getSelectedProducts().length ? ( 
                            <div>
                                <h4>Productos ({getSelectedProducts().reduce((acc: number, product: any) => acc + (product.qty), 0)})</h4>
                                <div className={`${getSelectedCombos().length ? "" : "max"}`}>
                                    {getSelectedProducts().map((product: any) => <Detail key={product.id} name={product.name} qty={product.qty} price={product.price} />)}
                                    {/* {getSelectedProducts().map((product: any) => <Detail key={product.id} name={product.name} qty={product.qty} price={product.price} />)} */}
                                </div>
                            </div>
                        ) : null}
                        {getSelectedCombos().length ? (
                            <div >
                                <h4>Combos ({getSelectedCombos().reduce((acc: number, combo: any) => acc + (combo.qty), 0)})</h4>
                                <div className={`${getSelectedProducts().length ? "" : "max"}`}>
                                    {getSelectedCombos().map((combo: any) => <Detail key={combo.id} name={combo.denomination} qty={combo.qty} price={combo.price} />)}
                                    {getSelectedCombos().map((combo: any) => <Detail key={combo.id} name={combo.denomination} qty={combo.qty} price={combo.price} />)}
                                </div>
                            </div>
                        ) : null}
                        
                        <div>
                            <h4>Total</h4>
                            <p>
                                {getTotal().toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <button onClick={handleCreateOrder}> <FontAwesomeIcon icon={faCheckCircle} /> &nbsp;Crear orden</button>
                </div>
            </Modal>
        </>
    );
};

const Detail = ({qty, name, price} : {qty: number, name: string, price: number}) => {
    return (
        <div className="detail-card">
            <div>
                    <div>
                        <p>{qty}</p>
                    </div>
                </div>
                <div>
                    <p>
                        {name}
                    </p>
                </div>
                <div>
                    <p>
                        {(qty * price).toFixed(2)}
                    </p>
                </div>
        </div>
    )
}

export default Orders;