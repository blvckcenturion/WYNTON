import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ActionModal from "../../utils/components/ActionModal"
import comboService from "../services/combo"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import elementSearch from "../../utils/functions/elementSearch"
import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api"
import ProductCard from "./ProductCard"
import { faCancel, faCirclePlus, faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons"
import { open } from "@tauri-apps/api/dialog"
import { convertFileSrc } from "@tauri-apps/api/tauri"

const ComboForm = ({combo, combos, products, setShowCombosForm, setCombo, loadCombos} : {combo: any | null, combos: any[], products: any[], setShowCombosForm : Function, setCombo: Function, loadCombos : Function}) => { 

    const [allProducts, setAllProducts] = useState<any>(null)
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [comboSave, setComboSave] = useState<any>(null)
    const [comboUpdated, setComboUpdated] = useState<boolean>(false)
    const [comboItemsUpdated, setComboItemsUpdated] = useState<boolean>(false)
    const [productSearch, setProductSearch] = useState<string>("")
    const [productsFiltered, setProductsFiltered] = useState<any>(null)
    const [photo, setPhoto] = useState<string>("");
    const [photoSrc, setPhotoSrc] = useState<string>("");
    const [photoReplaced, setPhotoReplaced] = useState<boolean>(false);

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
            if (combo.photo) {
                setPhoto(combo.photo)
                setPhotoSrc(combo.photo)
            }
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
    
                let validatedCombo = comboService.comboValidationSchema.parse({ ...values, products: selectedProducts, photo:photo, photoSrc: photoSrc })
                validatedCombo.denomination = validatedCombo.denomination.toLowerCase()
                
                if (selectedProducts.length == 0) {
                    throw new Error("Debe seleccionar al menos un producto")
                }

                let filtered = combos.filter(c => { if (c.denomination.trim().toLowerCase() == validatedCombo.denomination.trim().toLowerCase()) return c })

                if (filtered.length > 0) {
                    throw new Error("Ya existe un combo con esa denominacion")
                }
                
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
                let validatedCombo = comboService.comboValidationSchema.parse({ ...values, products: selectedProducts, photo: photo, photoSrc: photoSrc })
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

                if ( comboUpdated || comboItemsUpdated || photoReplaced) {
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
        await comboService.update({...comboSave, photo: photo, photoSrc: photoSrc, photoReplaced, photo_path: combo?.photo_path}, comboItemsUpdated, comboUpdated)
        setShowCombosForm(false)
        setCombo(null)
        loadCombos()
    }

    const handleImage = async () => {
        try {
          let res : any = await open({
            multiple: false,
            directory: false,
            filters: [
              { name: 'Image', extensions: ['jpg', 'png', 'jpeg'] }
            ]
          });
          if(res == null) {
            setPhoto("");
            setPhotoSrc("");
          } else {
            setPhoto(convertFileSrc(res));
            setPhotoSrc(res)
          }
    
          if(combo) {
            setPhotoReplaced(true);
          }
    
        } catch ( e: any) {
          toast.error(e.message);  
        }
      }

    return (
        <>
            <div>
                <form onSubmit={combo !== null ? editCombo.handleSubmit : createCombo.handleSubmit }>
                    <div>
                        <label htmlFor="comboDenomination">
                            {`Denominacion del combo ${combo ? editCombo.values.denomination.length > 0 ? `(${editCombo.values.denomination.length})` : "" : createCombo.values.denomination.length > 0 ? `(${createCombo.values.denomination.length})` : ""}`}
                        </label>
                        <input type="text" id="comboDenomination" onChange={combo ? editCombo.handleChange("denomination") : createCombo.handleChange("denomination")} value={combo ? editCombo.values.denomination : createCombo.values.denomination} />
                    </div>
                    <div>
                        <label htmlFor="comboPrice" >
                            {`Precio del combo ${getSelectedProducts().length > 0 ? `(Sugerido: ${getSelectedProducts().reduce((acc: any, curr: any) => { return parseFloat(acc) + (parseFloat(curr.price )* parseFloat(curr.qty))},0).toFixed(2) })` : ''}`}
                        </label>
                        <input type="number" step="0.01" id="comboPrice" onChange={combo ? editCombo.handleChange("price") : createCombo.handleChange("price")} value={combo ? editCombo.values.price : createCombo.values.price} />
                    </div>
                    <div>
                        <h3 className="text-accent-1">
                            {`Productos ${combo ? getSelectedProducts().length > 0 ? `(${getSelectedProducts().length})` : "" : getSelectedProducts().length > 0 ? `(${getSelectedProducts().length})` : ""}`}
                        </h3>
                        <div>
                            <div id="comboAvailableProducts">
                                <div>
                                    <input placeholder="Buscar productos" type="text"  value={productSearch} onChange={handleProductSearch} />
                                </div>
                                <div>
                                    {
                                        allProducts && productSearch.length == 0 && allProducts.map((product : any, index : number) => {
                                            return (<ProductCard key={index} index={index} product={product} handleProductSelect={handleProductSelect} handleProductQty={handleProductQty} />)
                                        })
                                    }
                                    {
                                        allProducts && productSearch.length > 0 && productsFiltered.filter((p: any) => p.name.toLowerCase().includes(productSearch.toLowerCase())).map((product: any, index: number) => {
                                            return (<ProductCard key={index} index={index} product={product} handleProductSelect={handleProductSelect} handleProductQty={handleProductQty} />)
                                        })
                                    }
                                    {
                                        allProducts && productSearch.length > 0 && productsFiltered.filter((p: any) => p.name.toLowerCase().includes(productSearch.toLowerCase())).length == 0 && <div className="not-found text-center">No se encontraron productos con el nombre "{productSearch}"</div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="productDescription">
                        Imagen del producto
                        </label>
                        <div className={`photo ${photo.length > 0 ? "active" : "non-active"}`} id="productPhoto">
                        {photo.length == 0 && (
                            <div onClick={handleImage}>
                            <FontAwesomeIcon icon={faCirclePlus}/>
                            <p>Escoger imagen</p>
                            </div>
                        )}
                        {photo && photo.length > 0 && (
                            <div>
                                <div>
                                    <img src={photo} alt="product" />
                                </div>
                            <div>
                                <button className={`${photo.length > 0 ? "active" : ""}`} type="button" onClick={() => { setPhoto(""); setPhotoSrc(""); setPhotoReplaced(true) }}>
                                <FontAwesomeIcon icon={faTrash}/>
                                &nbsp;Eliminar
                                </button>
                                <button className={`${photo.length > 0 ? "active" : ""}`} type="button" onClick={handleImage}>
                                <FontAwesomeIcon icon={faEdit}/>
                                &nbsp;Editar
                                </button>
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                    <div className="flex flex-row form-submit">
                        <button type="submit">
                        <FontAwesomeIcon icon={faSave} />
                        &nbsp;{combo ? "Guardar" : "Agregar"}
                        </button>
                        <button type="button" onClick={cancelEditCombo}>
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
export default ComboForm;