import { faAdd, faCancel, faEdit, faFileImage, faMinus, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import Modal from "../utils/components/modal"
import ActionModal from "../utils/components/actionModal"
import { useFormik } from "formik"
import productService from "../menu/services/product"
import comboService from "./services/combo"
import { toast } from "react-toastify"
import { invoke } from "@tauri-apps/api"
import capitalize from "../utils/functions/capitalize"
import elementSearch from "../utils/functions/elementSearch"
const Combos = () => {
    const [combosSearchTerm, setCombosSearchTerm] = useState("")
    const [showCombosForm, setShowCombosForm] = useState(false)
    const [combos, setCombos] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [combosSearch, setCombosSearch] = useState<any[] | null>(null)
    const [combosEdit, setCombosEdit] = useState<object | null>(null);
    const [comboDelete, setComboDelete] = useState<number | null>(null)
    const [showComboDelete, setShowComboDelete] = useState(false)

    useEffect(() => {
        (async () => {
            
            await loadCombos()
        })();

    }, [])


    const loadProducts = async () => {
        const products: any[] = await productService.load()
        return products
    }

    const loadCombos = async () => {
        let products = await loadProducts()
        const combos: any[] = await comboService.load()
        if (products.length > 0) { 
            console.log(products)
            combos.forEach((combo) => {
                combo.products.forEach((comboProduct : any) => {
                    products.forEach((product) => {
                        if (comboProduct.product_id == product.id) {
                            comboProduct.productDetails = product
                        }
                    })
                })
            })
            setProducts(products)
            setCombos(combos)
        }
        
    }


    const handleComboSearch = (e: any) => {

        const comboFilter = (combo: any) => {
            if (combo.denomination.trim().toLowerCase() == e.target.value.trim().toLowerCase() || combo.denomination.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())) {
                return combo;
            }
        }
        elementSearch(e, setCombosSearchTerm, setCombosSearch, combos, comboFilter)
    }

    const showCombos = (combos: any[]) => {
        if (combos.length == 0) return []
        console.log('OLA')
        return combos.map((combo) => { 
            return (
                <tr key={combo.id}>
                    <td>{ capitalize(combo.denomination)}</td>
                    <td>{combo.price.toFixed(2)} BS</td>
                    {/* <td>
                        {combo.products.map((product: any) => {
                            return (
                                <div key={product.id}>
                                    <span>{product.productDetails.name}</span>
                                    <span className="text-accent-1"> x{product.quantity}</span>
                                </div>
                            )
                        })}
                    </td> */}
                    <td>
                        <button className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => { setCombosEdit(combo);  setShowCombosForm(true)}}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => { setShowComboDelete(true);  setComboDelete(combo.id)}}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </td>
                </tr>
            )
        })
    }

    const deleteCombo = async () => {
        if (comboDelete != null) await comboService.delete(comboDelete)
        await loadCombos()
        setShowComboDelete(false)
    }

    return (
        <div className="combos-module">
            <div className="add-combos-section section">
                <form className='form-search'>
                    <div>
                        <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                        Nombre del combo
                        </label>
                        <input placeholder="Buscar combos"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text" onChange={handleComboSearch} value={combosSearchTerm}/>
                    </div>
                    <div>
                        <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={ () => setShowCombosForm(true)}>
                            <FontAwesomeIcon icon={faAdd} />
                            &nbsp;Agregar combo
                        </button>
                    </div>
                </form>
                <div className="table item-table">
                    {combos.length == 0 && combosSearch == null && (
                        <div className="text-center">
                            <p>No hay combos disponibles.</p>
                        </div>
                    )}
                    {combosSearch != null && combosSearch.length == 0 && (
                        <div>
                            <p>No se encontraron productos con el nombre "{combosSearchTerm}"</p>
                        </div>
                    )}
                    {(combos != null || combosSearch != null) && (combos?.length > 0 && combosSearch == null|| combosSearch != null && combosSearch?.length > 0) && (
                    <table className='table-auto'>
                        <thead>
                        <tr>
                            <th>Denominacion&nbsp;</th>
                            <th>Precio&nbsp;</th>
                            <th>Productos</th>
                            <th>Acciones</th>        
                        </tr>
                        </thead>
                            <tbody>
                                <>
                                    {combos != null && combosSearch == null && showCombos(combos)}
                                    {combosSearch != null && showCombos(combosSearch)}
                                </>
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
            <Modal className={"add-product-modal"} title={combosEdit ? "Editar combo" : "Agregar combo"} showModal={showCombosForm} onClose={() => {setShowCombosForm(false); setCombosEdit(null);} }>
                <CombosForm combo={combosEdit} combos={combos} products={products} setShowCombosForm={setShowCombosForm} setCombo={setCombosEdit} loadCombos={loadCombos} />
            </Modal>
            <ActionModal title="Eliminar combo" body="¿Esta seguro que desea eliminar este combo?" showModal={showComboDelete} onConfirm={deleteCombo} onCancel={() => setShowComboDelete(false)}/>
        </div>
    )
}

const CombosForm = ({combo, combos, products, setShowCombosForm, setCombo, loadCombos} : {combo: any | null, combos: any[], products: any[], setShowCombosForm : Function, setCombo: Function, loadCombos : Function}) => { 

    const [allProducts, setAllProducts] = useState<any>(null)
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [comboSave, setComboSave] = useState<any>(null)
    const [comboUpdated, setComboUpdated] = useState<boolean>(false)
    const [comboItemsUpdated, setComboItemsUpdated] = useState<boolean>(false)
    const [productSearch, setProductSearch] = useState<string>("")
    const [productsFiltered, setProductsFiltered] = useState<any>(null)


    useEffect(() => {
        let prods;

        if (combo != null) { 
            prods = products.map(p => {
                let selected = combo.products.find((cp: any) => cp.productDetails.id == p.id)
                if (selected) {
                    p.selected = true
                    p.qty = selected.quantity
                } else {
                    p.selected = false
                    p.qty = 1
                }
                return p
            })
        } else {
            prods = products.map(p => {
                p.selected = false
                p.qty = 1
                return p
            })
        }

        setAllProducts(prods)
       
    }, [])

    const handleProductSearch = (e: any) => { 
        const productFilter = (product: any) => {
            if(product.name.trim().toLowerCase() === e.target.value.trim().toLowerCase() || product.name.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())){
              return product;
            }
        }
        
        elementSearch(e, setProductSearch, setProductsFiltered, allProducts, productFilter)
    }

    const createCombo = useFormik({
        initialValues: {
            denomination: "",
            price: 0,
        },
        onSubmit: async (values) => {
            try {
                let selectedProducts = getSelectedProducts()
    
                let validatedCombo = comboService.comboValidationSchema.parse({ ...values, products: selectedProducts })
                validatedCombo.denomination = validatedCombo.denomination.toLowerCase()

                if (selectedProducts.length == 0) {
                    throw new Error("Debe seleccionar al menos un producto")
                }

                await invoke("find_by_name_combo", { denomination: validatedCombo.denomination }).then((res: any) => {
                    res = JSON.parse(res)
                    if (res.length > 0) {
                        throw new Error("Ya existe un combo con esa denominacion")
                    }
                })
                
                let res: any = await comboService.create(validatedCombo)

                if (res) {
                    toast.success("Combo creado con exito")
                    loadCombos()
                    setShowCombosForm(false)
                } else {
                    toast.error("No se pudo agregar el combo")
                }
                
                
            } catch (e: any) {
                console.log(e)
                if (typeof e.issues !== "undefined"){
                    toast.error(e.issues[0].message);
                } else {
                    toast.error(e.message);
                }
            }
        }
    })
    const editCombo = useFormik({
        initialValues: {
            denomination: combo?.denomination  || "",
            price: combo?.price || "",
        },
        onSubmit: async (values) => {
            try {
                let selectedProducts = getSelectedProducts()
                let validatedCombo = comboService.comboValidationSchema.parse({ ...values, products: selectedProducts })
                validatedCombo.denomination = validatedCombo.denomination.toLowerCase()

                let filtered = combos.filter(c => { if (c.denomination.trim().toLowerCase() == validatedCombo.denomination.trim().toLowerCase() && c.id != combo?.id) return c })
                
                if (filtered.length > 0) {
                    throw new Error("Ya existe un combo con esa denominacion")
                }

                let comboUpdated = combo.denomination != validatedCombo.denomination || combo.price != validatedCombo.price;
                let comboItemsUpdated = combo.products.length !== selectedProducts.length;

                selectedProducts.forEach((p: any) => { 
                    let prod = combo?.products.find((cp: any) => cp.productDetails.id == p.id)
                    if (prod) {
                        if (prod.quantity != p.qty) {
                            comboItemsUpdated = true;
                        }
                    } else {
                        comboItemsUpdated = true;
                    }
                })

                if ( comboUpdated || comboItemsUpdated) {
                    if(selectedProducts.length == 0) {
                        throw new Error("Debe seleccionar al menos un producto")
                    } else {
                        setComboSave({ ...validatedCombo, id: combo.id })
                        setComboUpdated(comboUpdated)
                        setComboItemsUpdated(comboItemsUpdated)
                        setShowConfirm(true)
                    }
                } else {
                    setShowCombosForm(false)
                }
            } catch(e: any) {
                console.log(e)
                if (typeof e.issues !== "undefined"){
                    toast.error(e.issues[0].message);
                } else {
                    toast.error(e.message);
                }
            }

        }
    })

    const cancelEditCombo = () => {
        setShowCombosForm(false);
        setCombo(null);
    }

    const handleProductSelect = (product: any) => { 
        let prod = allProducts?.map((p : any) => {
            if(p.id == product.id) {
                p.selected = !p.selected
            }
            return p
        })
        setAllProducts(prod)
    }

    const handleProductQty = (product: any, qty: number) => {
        if (qty > 0) {
            let prod = allProducts?.map((p: any) => {
                if (p.id == product.id) {
                    p.qty = qty
                }
                return p
            }
            )
            setAllProducts(prod)
        }
    }

    const getSelectedProducts = () => {
        if (allProducts == null) return []
        let selectedProducts = allProducts?.filter((p: any) => p.selected == true)
        return selectedProducts
    }

    const confirmEditCombo = async () => {
        await comboService.update(comboSave, comboItemsUpdated, comboUpdated)
        setShowCombosForm(false)
        loadCombos()
    }

    return (
        <>
            <div>
                <form onSubmit={combo !== null ? editCombo.handleSubmit : createCombo.handleSubmit }>
                    <div className="mb-1">
                        <label htmlFor="comboDenomination" className="block text-accent-1 text-sm font-bold mb-2">
                            {`Denominacion del combo ${combo ? editCombo.values.denomination.length > 0 ? `(${editCombo.values.denomination.length})` : "" : createCombo.values.denomination.length > 0 ? `(${createCombo.values.denomination.length})` : ""}`}
                        </label>
                        <input type="text" className="shadow appareance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="comboDenomination" onChange={combo ? editCombo.handleChange("denomination") : createCombo.handleChange("denomination")} value={combo ? editCombo.values.denomination : createCombo.values.denomination} />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="comboPrice" className="block text-accent-1 text-sm font-bold mb-2">
                            Precio del combo
                        </label>
                        <input type="number" step="0.01"  className="shadow appareance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="comboPrice" onChange={combo ? editCombo.handleChange("price") : createCombo.handleChange("price")} value={combo ? editCombo.values.price : createCombo.values.price} />
                    </div>
                    <div className="mb-1">
                        <h3 className="text-accent-1">
                            {`Productos ${combo ? getSelectedProducts().length > 0 ? `(${getSelectedProducts().length})` : "" : getSelectedProducts().length > 0 ? `(${getSelectedProducts().length})` : ""}`}
                        </h3>
                        <div className="flex flex-col">
                            <div id="comboAvailableProducts">
                                <div>
                                    <input placeholder="Buscar productos" type="text" className="shadow appareance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="comboAvailableProductsSearch" value={productSearch} onChange={handleProductSearch} />
                                </div>
                                <div>
                                    {
                                        allProducts && productSearch.length == 0 && allProducts.map((product : any, index : number) => {
                                            return (<ProductCard index={index} product={product} handleProductSelect={handleProductSelect} handleProductQty={handleProductQty} />)
                                        })
                                    }
                                    {
                                        allProducts && productSearch.length > 0 && productsFiltered.filter((p: any) => p.name.toLowerCase().includes(productSearch.toLowerCase())).map((product: any, index: number) => {
                                            return (<ProductCard index={index} product={product} handleProductSelect={handleProductSelect} handleProductQty={handleProductQty} />)
                                        })
                                    }

                                    {
                                        allProducts && productSearch.length > 0 && productsFiltered.filter((p: any) => p.name.toLowerCase().includes(productSearch.toLowerCase())).length == 0 && <div className="not-found text-center">No se encontraron productos con el nombre "{productSearch}"</div>
                                    }

                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div className="flex flex-row form-submit">
                    <button className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    <FontAwesomeIcon icon={faSave} />
                    &nbsp;{combo ? "Guardar" : "Agregar"}
                    </button>
                    <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={cancelEditCombo}>
                    <FontAwesomeIcon icon={faCancel} />
                    &nbsp;Cancelar
                    </button>
                </div>
                </form>
            </div>
            <ActionModal title={"Guardar cambios"} body={"¿Estas seguro de guardar los cambios?"} showModal={showConfirm} onConfirm={confirmEditCombo} onCancel={() => { setShowConfirm(false); setComboUpdated(false); setComboItemsUpdated(false); }} className={"confirm-modal"} />
        </>
    )
}

const ProductCard = ({ product, index, handleProductQty, handleProductSelect }: { product: any, index : number, handleProductQty : Function, handleProductSelect : Function }) => { 
    return (
        <div className={`flex flex-row shadow appareance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${product.selected ?  "selected" : ""}`} key={index}>
        <div>
            {product.photo ? <img src={product.photo} alt={product.name} /> : <FontAwesomeIcon icon={faFileImage} />}
        </div>
        <div>
            <p>{product.name}</p>
            <p>{product.price.toFixed(2)} BS</p>
        </div>
        <div>
            <div>
                <button className="text-white font-bold rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => handleProductQty(product, product.qty-1)}>
                    <FontAwesomeIcon icon={faMinus} />
                </button>
                <div className="text-white font-bold rounded focus:outline-none focus:shadow-outline">
                    <p>{product.qty}</p>
                </div>
                <button className="text-white font-bold rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => handleProductQty(product, product.qty+1)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            <div>
                {product.selected ? (
                    <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline delete" type="button" onClick={() => handleProductSelect(product)}>
                        Eliminar&nbsp;<FontAwesomeIcon icon={faTrash} />
                    </button>
                ): (
                    <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline add" type="button" onClick={() => handleProductSelect(product)}>
                    Agregar&nbsp;<FontAwesomeIcon icon={faPlus} />
                    </button>
                )}
                
            </div>
        </div>
    </div>
    )
    
}

export default Combos