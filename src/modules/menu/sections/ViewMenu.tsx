import { faAngleDown, faAngleUp, faFileImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import ActionModal from "../../utils/components/actionModal"
import productService from "../services/product"
import Modal from "../../utils/components/modal"
import categoryService from "../services/category"
import { ProductForm } from "./Products"
import { CategoryForm } from "./Categories"
import comboService from "../../combos/services/combo"

// Main component for the menu section
const ViewMenu = () => {

    // Menu Section State Variables
    const [categories, setCategories] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [productDelete, setProductDelete] = useState<any | number>(null)
    const [showProductComboDelete, setShowProductComboDelete] = useState<boolean>(false);
    const [productEdit, setProductEdit] = useState<any>(null)
    const [categoryDelete , setCategoryDelete] = useState<any | number>(null)
    const [categoryEdit, setCategoryEdit] = useState<any>(null)
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false)
    const [toggledCategories, setToggledCategories] = useState<any[]>([])
    const [comboCount, setComboCount] = useState<number>(0);

    
    // Products Section On Mount Function
    useEffect(() => {
        (async () => {
            await loadCategories()
            await loadProducts()
        })()
    }, [])

    // Helper function to load all products from the backend and set the state
    const loadProducts = async () => {
        const products : any[] = await productService.load()
        setProducts(products)
    }

    // Helper function to load all products from the backend grouped by category and set the state
    const loadCategories = async () => {
        const categories : any[] = await productService.loadByCategory()
        setCategories(categories)
        let toggledCategories : any = {}
        categories.forEach((category) => {toggledCategories[category.name] = false})
        setToggledCategories(toggledCategories)
    }

    // Helper function to delete a product from the backend and update the state
    const deleteProduct = async () => { 
        if (productDelete !== null) await productService.delete(productDelete)
        setProductDelete(null)
        await loadCategories()
    }


    const handleDeleteProduct = async () => {
        const combos = await comboService.searchByProduct(productDelete)
        if (combos && combos.length > 0) { 
            setComboCount(combos.length)
            setShowProductComboDelete(true)
        } else {
            await deleteProduct()
        }
        setShowModalDelete(false)
    }

    // Helper function to delete a category from the backend and update the state
    const deleteCategory = async () => {
        await categoryService.delete(categoryDelete)
        setCategoryDelete(null)
        setShowModalDelete(false)
        await loadCategories()
    }

    const handleDeleteProductCombo = async () => {
        await deleteProduct()
        setShowProductComboDelete(false)
    }



    const renderCategories = () => {

        if(categories.length == 1 && categories[0].products.length == 0) 
        return (
            <div className="empty">
                <p>No existen productos <br /> ni categorias registradas.</p>
            </div>
        )

        return categories.map((category) => {

            return (
                <div key={category.id} className="category">
                    <div>
                        <h3 onClick={() => setToggledCategories({...toggledCategories, [category.name] : !toggledCategories[category.name]})}>{category.name}{` (${category.products.length})`}&nbsp;&nbsp;&nbsp;{category.products.length > 0 ? <FontAwesomeIcon icon={toggledCategories[category.name] ? faAngleDown : faAngleUp} /> : null}</h3>
                        <div>
                            {category.id && (
                                <>
                                    <button onClick={() => {setCategoryEdit(category); setShowModalEdit(true)}}>
                                        Editar
                                    </button>
                                    {!(category.products.length > 0) && (
                                        <button onClick={() =>{setCategoryDelete(category.id); setShowModalDelete(true)}}>
                                            Eliminar
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {category.products.length > 0 && toggledCategories[category.name] == false && (
                        <div>
                            {category.products.map((product : any) => {
                                return (
                                    <div key={product.id} className="product">
                                        <div>
                                            {product.photo ? (
                                                <img src={product.photo} alt={product.name}/>
                                            ) : (
                                                <div>
                                                    <FontAwesomeIcon icon={faFileImage} />
                                                    <p>
                                                        Sin imagen. 
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4>{product.name}</h4>
                                            <p className="desc">{ product.description ? product.description.length > 53 ? product.description.slice(50) + "..." : product.description : "N/A"}</p>
                                            <p>{product.price.toFixed(2)} BS</p>
                                        </div>
                                        <div>
                                            <button onClick={() => {setProductEdit(product); setShowModalEdit(true)}}>
                                                Editar
                                            </button>
                                            <button onClick={() => {setProductDelete(product.id); setShowModalDelete(true);}}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )
        })
    }

    return (
        <>
            <div className="view-menu-section"> 
                {renderCategories()}
            </div>
            <ActionModal title={productDelete ? "Eliminar producto" : "Eliminar categoria"} body={productDelete ? "¿Esta seguro que desea eliminar este producto?" : "¿Esta seguro que desea eliminar esta categoria?"} showModal={showModalDelete} onCancel={() => {setShowModalDelete(false); productDelete ? setProductDelete(null) : setCategoryDelete(null)}} onConfirm={productDelete ? handleDeleteProduct : deleteCategory} />
            <Modal className={productEdit ? "add-product-modal" : "add-category-modal"} title={productEdit ? "Editar producto" : "Editar categoria"} showModal={showModalEdit} onClose={() => {setShowModalEdit(false); productEdit ? setProductEdit(null) : setCategoryEdit(null)}} >
                {productEdit ? (
                    <ProductForm categories={categories} setShowProductForm={setShowModalEdit} loadProducts={loadCategories} product={productEdit} products={products} setProduct={setProductEdit}/>
                ) : (
                    <CategoryForm setShowCategoryForm={setShowModalEdit} loadCategories={loadCategories} category={categoryEdit} categories={categories} setCategory={setCategoryEdit}/>
                )}
            </Modal>
            <ActionModal title="Alerta!" body={`El producto es parte de ${comboCount} ${comboCount > 1 ? "combos" : "combo"} y sera eliminado ${comboCount > 1 ? "de los mismos" : "del mismo"} ¿Desea proceder de todas formas?`} showModal={showProductComboDelete} onConfirm={handleDeleteProductCombo} onCancel={() => setShowProductComboDelete(false)}/>
        </>
    )
}

export default ViewMenu;