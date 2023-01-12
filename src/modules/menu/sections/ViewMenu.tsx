import { faFileImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import ActionModal from "../../utils/components/actionModal"
import productService from "../services/product"
import Modal from "../../utils/components/modal"
import categoryService from "../services/category"
import { ProductForm } from "./Products"
import { CategoryForm } from "./Categories"

// Main component for the menu section
const ViewMenu = () => {

    // Menu Section State Variables
    const [categories, setCategories] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [productDelete, setProductDelete] = useState<any | number>(null)
    const [productEdit, setProductEdit] = useState<any>(null)
    const [categoryDelete , setCategoryDelete] = useState<any | number>(null)
    const [categoryEdit, setCategoryEdit] = useState<any>(null)
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false)

    
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
    }

    // Helper function to delete a product from the backend and update the state
    const deleteProduct = async () => {
        await productService.delete(productDelete)
        setProductDelete(null)
        setShowModalDelete(false)
        await loadCategories()
    }

    // Helper function to delete a category from the backend and update the state
    const deleteCategory = async () => {
        await categoryService.delete(categoryDelete)
        setCategoryDelete(null)
        setShowModalDelete(false)
        await loadCategories()
    }



    const renderCategories = () => {

        if(categories.length == 1 && categories[0].products.length == 0) 
        return (
            <div className="empty">
                <p>No hay productos <br /> ni categorias registradas.</p>
            </div>
        )

        return categories.map((category) => {
            return (
                <div key={category.id} className="category">
                    <div>
                        <h3>{category.name}{` (${category.products.length})`}</h3>
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
                    {category.products.length > 0 && (
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
                                            {product.description ? <p>{product.description}</p> : null}
                                            <p>{product.price} BOB</p>
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
            <ActionModal title={productDelete ? "Eliminar producto" : "Eliminar categoria"} body={productDelete ? "¿Esta seguro que desea eliminar este producto?" : "¿Esta seguro que desea eliminar esta categoria?"} showModal={showModalDelete} onCancel={() => {setShowModalDelete(false); productDelete ? setProductDelete(null) : setCategoryDelete(null)}} onConfirm={productDelete ? deleteProduct : deleteCategory} />
            <Modal className={productEdit ? "add-product-modal" : "add-category-modal"} title={productEdit ? "Editar producto" : "Editar categoria"} showModal={showModalEdit} onClose={() => {setShowModalEdit(false); productEdit ? setProductEdit(null) : setCategoryEdit(null)}} >
                {productEdit ? (
                    <ProductForm categories={categories} setShowProductForm={setShowModalEdit} loadProducts={loadCategories} product={productEdit} products={products}/>
                ) : (
                    <CategoryForm setShowCategoryForm={setShowModalEdit} loadCategories={loadCategories} category={categoryEdit} categories={categories}/>
                )}
            </Modal>
        </>
    )
}

export default ViewMenu;