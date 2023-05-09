import { faAdd, faEdit, faFileImage, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import Modal from "../utils/components/Modal"
import ActionModal from "../utils/components/ActionModal"
import productService from "../menu/services/product"
import comboService from "./services/combo"
import capitalize from "../utils/functions/capitalize"
import elementSearch from "../utils/functions/elementSearch"
import ComboForm from "./components/ComboForm"

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
        return combos.map((combo) => { 
            return (
                <tr key={combo.id}>
                    <td>{ capitalize(combo.denomination)}</td>
                    <td>{combo.price.toFixed(2)} BS</td>
                    <td>
                        {combo.products.map((product: any) => {
                            return (
                                <div key={product.id}> 
                                    <span>{product.productDetails.name}</span>
                                    <span> x{product.quantity}</span>
                                </div>
                            )
                        })}
                    </td>
                    <td>
                        {combo.products.reduce((acc: number, product: any) => {
                            return acc + (product.productDetails.price * product.quantity)
                        }, 0).toFixed(2
                        )} BS
                    </td>
                    <td>
                        <div>
                        {combo.photo && (
                            <img src={combo.photo} alt={combo.denomination} />
                        )}
                        {!combo.photo && (
                            <>
                            <FontAwesomeIcon icon={faFileImage} />
                            <br />
                            Sin imagen.
                            </>
                        )}
                        </div>
                    </td>
                    <td>
                        <button onClick={() => { setCombosEdit(combo);  setShowCombosForm(true)}}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => { setShowComboDelete(true);  setComboDelete(combo.id)}}>
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
                        <label htmlFor="comboame">
                        Nombre del combo
                        </label>
                        <input placeholder="Buscar combos" id="comboame" type="text" onChange={handleComboSearch} value={combosSearchTerm}/>
                    </div>
                    <div>
                        <button type="button" onClick={ () => setShowCombosForm(true)}>
                            <FontAwesomeIcon icon={faAdd} />
                            &nbsp;Agregar combo
                        </button>
                    </div>
                </form>
                <div className="table item-table">
                    {combos.length == 0 && combosSearch == null && (
                        <div className="text-center">
                            <p>No existen combos registrados.</p>
                        </div>
                    )}
                    {combosSearch != null && combosSearch.length == 0 && (
                        <div>
                            <p>No se encontraron combos con el nombre "{combosSearchTerm}"</p>
                        </div>
                    )}
                    {(combos != null || combosSearch != null) && (combos?.length > 0 && combosSearch == null|| combosSearch != null && combosSearch?.length > 0) && (
                    <table className='table-auto'>
                        <thead>
                        <tr>
                            <th>Denominacion&nbsp;</th>
                            <th>Precio&nbsp;</th>
                            <th>Productos</th>        
                            <th>Valor Sumado&nbsp;</th>    
                            <th>Imagen</th>
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
                <ComboForm combo={combosEdit} combos={combos} products={products} setShowCombosForm={setShowCombosForm} setCombo={setCombosEdit} loadCombos={loadCombos} />
            </Modal>
            <ActionModal title="Eliminar combo" body="¿Esta seguro que desea eliminar este combo?" showModal={showComboDelete} onConfirm={deleteCombo} onCancel={() => setShowComboDelete(false)} />
        </div>
    )
}





export default Combos