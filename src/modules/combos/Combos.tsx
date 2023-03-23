import { faAdd, faCancel, faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import Modal from "../utils/components/modal"
import ActionModal from "../utils/components/actionModal"
import { useFormik } from "formik"
import productService from "../menu/services/product"
const Combos = () => {
    const [combosSearchTerm, setCombosSearchTerm] = useState("")
    const [showCombosForm, setShowCombosForm] = useState(false)
    const [combos, setCombos] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [combosSearch, setCombosSearch] = useState<any[] | null>(null)
    const [combosEdit, setCombosEdit] = useState<object | null>(null);
    const [showComboDelete, setShowComboDelete] = useState(false)

    useEffect(() => {
        (async () => { 
            await loadProducts()
        })()
    }, [])


    const loadProducts = async () => {
        const products: any[] = await productService.load()
        setProducts(products)
    }

    const handleComboSearch = (e : any) => {

    }

    const showCombos = (combos : any[]) => {

    }

    const deleteCombo = () => {

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
                        </tr>
                        </thead>
                        {/* <tbody>
                            {combos != null && combosSearch == null && showCombos(combos)}
                            {combosSearch != null && showCombos(combosSearch)}
                        </tbody> */}
                    </table>
                    )}
                </div>
            </div>
            <Modal className={"add-product-modal"} title={combosEdit ? "Editar combo" : "Agregar combo"} showModal={showCombosForm} onClose={() => {setShowCombosForm(false); setCombosEdit(null);} }>
                <CombosForm combo={combosEdit} products={products} setShowCombosForm={setShowCombosForm} setCombo={setCombosEdit} />
            </Modal>
            <ActionModal title="Eliminar producto" body="¿Esta seguro que desea eliminar este producto?" showModal={showComboDelete} onConfirm={deleteCombo} onCancel={() => setShowComboDelete(false)}/>
        </div>
    )
}

const CombosForm = ({combo, products, setShowCombosForm, setCombo} : {combo: any | null, products: any[], setShowCombosForm : Function, setCombo: Function}) => { 

    const [selectedProducts, setSelectedProducts] = useState<any[]>(combo ? combo.products : [])
    const [allProducts, setAllProducts] = useState<any[]>(products)

    const createCombo = useFormik({
        initialValues: {
            denomination: "",
            price: "",
            products: []
        },
        onSubmit: async (values) => {
            console.log(values)
        }
    })
    const editCombo = useFormik({
        initialValues: {
            denomination: combo?.denomination  || "",
            price: combo?.price || "",
            products: combo?.products || []
        },
        onSubmit: async (values) => {
            console.log(values)
        }
    })

    const cancelEditProduct = () => {
        setCombo(null);
        setShowCombosForm(false);

    }

    return (
        <div>
            <form>
                <div className="mb-1">
                    <label htmlFor="comboDenomination" className="block text-accent-1 text-sm font-bold mb-2">
                        {`Denominacion del combo ${combo ? editCombo.values.denomination.length > 0 ? `(${editCombo.values.denomination.length})` : "" : createCombo.values.denomination.length > 0 ? `(${createCombo.values.denomination.length})` : ""}`}
                    </label>
                    <input type="text" className="shadow appareance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="comboDenomination" onChange={combo ? editCombo.handleChange("denomination") : createCombo.handleChange("denomination")} value={combo ? editCombo.values.denomination : createCombo.values.denomination} />
                </div>
                <div className="mb-1">
                    <label htmlFor="comboPrice" className="block text-accent-1 text-sm font-bold mb-2">
                        {`Precio del combo ${combo ? editCombo.values.price.length > 0 ? `(${editCombo.values.price.length})` : "" : createCombo.values.price.length > 0 ? `(${createCombo.values.price.length})` : ""}`}
                    </label>
                    <input type="text" className="shadow appareance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="comboPrice" onChange={combo ? editCombo.handleChange("price") : createCombo.handleChange("price")} value={combo ? editCombo.values.price : createCombo.values.price} />
                </div>
                <div className="mb-1">
                    <h3 className="text-accent-1">
                        {`Productos ${combo ? editCombo.values.products.length > 0 ? `(${editCombo.values.products.length})` : "" : createCombo.values.products.length > 0 ? `(${createCombo.values.products.length})` : ""}`}
                    </h3>
                    <div className="flex flex-col">
                        <div id="comboAvailableProducts">
                            <div>
                                <label htmlFor="comboAvailableProductsSearch" className="block text-accent-1 text-sm font-bold mb-2">
                                    Buscar producto
                                </label>
                                <input type="text" className="shadow appareance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="comboAvailableProductsSearch" />
                            </div>
                            <div>
                                {
                                    allProducts.map((product, index) => {
                                        return (
                                            <div className="flex flex-row" key={index}>
                                                <h4>{product.name}</h4>
                                            </div>
                                        )
                                    })
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
                <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={cancelEditProduct}>
                  <FontAwesomeIcon icon={faCancel} />
                  &nbsp;Cancelar
                </button>
              </div>
            </form>
        </div>
    )
}

export default Combos