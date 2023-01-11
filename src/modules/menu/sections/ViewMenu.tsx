import { useEffect, useState } from "react"
import productService from "../services/product"

// Main component for the menu section
const ViewMenu = () => {

    // Menu Section State Variables
    const [categories, setCategories] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    
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

    const renderCategories = () => {
        console.log("perro")
        console.log(categories)
        return categories.map((category) => {
            return (
                <div key={category.id} className="category">
                    <div>
                        <h3>{category.name}{` (${category.products.length})`}</h3>
                        <div>
                            <button>
                                Editar
                            </button>
                            <button>
                                Eliminar
                            </button>
                        </div>
                    </div>
                    {category.products.length > 0 && (
                        <div>
                            {category.products.map((product : any) => {
                                return (
                                    <div key={product.id} className="product">
                                        <div>
                                            <img src={product.photo} alt={product.name}/>
                                        </div>
                                        <div>
                                            <h4>{product.name}</h4>
                                            <p>{product.description}</p>
                                            <p>{product.price} USD</p>
                                        </div>
                                        <div>
                                            <button>
                                                Editar
                                            </button>
                                            <button>
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
        <div className="view-menu-section"> 
            {renderCategories()}
          {/* {categories.map((category) => {
            return (
                <div key={category.id} className="category">
                    <div>
                        <h3>{category.name}{` (${category.products.length})`}</h3>
                        <div>
                            <button>
                                Editar
                            </button>
                            <button>
                                Eliminar
                            </button>
                        </div>
                    </div>
                    {category.products.length > 0 && (
                        <div>
                            {category.products.map((product) => {
                                return (
                                    <div key={product.id} className="product">
                                        <div>
                                            <img src={product.photo} alt={product.name}/>
                                        </div>
                                        <div>
                                            <h4>{product.name}</h4>
                                            <p>{product.description}</p>
                                            <p>{product.price} USD</p>
                                        </div>
                                        <div>
                                            <button>
                                                Editar
                                            </button>
                                            <button>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>
                    )}
                </div>
            )
          })}   */}
        </div>
    )
}

export default ViewMenu;