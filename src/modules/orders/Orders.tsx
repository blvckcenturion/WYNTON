import { useEffect, useState } from "react";
import productService from "../menu/services/product";
import categoryService from "../menu/services/category";
import capitalize from "../utils/functions/capitalize";
import comboService from "../combos/services/combo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "./components/ProductCard";

const Orders = () => {
    const [productSearchTerm, setProductSearchTerm] = useState<string>("")
    const [productType, setProductType] = useState<number>(0)
    const [productCategory, setProductCategory] = useState<number>(-2)
    const [products, setProducts] = useState<any[]>([])
    const [combos, setCombos] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])


    useEffect(() => {
        (async () => {
            let products : any[] = await productService.load();
            products = products.map((p: any) => { 
                p.name = capitalize(p.name)
                p.qty = 0
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
                c.qty = 0
                c.products = c.products.map((p: any) => { 
                    let prod = products.find((product: any) => product.id === p.id)
                    return {
                        ...prod,
                        qty: p.quantity
                    }
                })
                return c
            })
            console.log(combos)
            console.log(products)
            setProducts(products);
            setCombos(combos);
            
        })()
    }, [])

    const handleProductSearch = (e: any) => {
        setProductSearchTerm(e.target.value)
    }

    const handleProductType = (e: any) => {
        if (e.target.value !== productType) setProductSearchTerm("")
        setProductType(parseInt(e.target.value))   
    }

    const handleProductCategory = (e: any) => {
        setProductCategory(parseInt(e.target.value))
    }

    const getSelectedProducts = () => { 
        let selectedProducts: any[] = []
        products.forEach((p: any) => { 
            if (p.qty > 0) selectedProducts.push(p)
        })
        return selectedProducts
    }

    return (
        <div className="orders-module">
            <div className={`products-section ${getSelectedProducts().length ? "" : "empty"}`}>
                <div>
                    <form className={`${productType ? "combos" : "products"}`}>
                        <div>
                            <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                            Nombre
                            </label>
                            <input placeholder={`Buscar ${productType ? "combos" : "productos"}`}className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text" onChange={handleProductSearch} value={productSearchTerm}/>
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
                                    <option value="-2"></option>
                                    <option value="-1">Sin categoria</option>
                                    {categories.map((category: any) => {
                                        return <option key={category.id} value={category.id}>{category.name}</option>
                                    })}
                                </select>  
                            </div>
                        ) : null}
                    </form>
                    
                </div>
                <div className={getSelectedProducts().length ? "" : "empty"}>
                    {
                        !productType ? showProducts(products) : showCombos(combos)
                    }
                </div>
            </div>
            {getSelectedProducts().length ? (
                <div className="place-order-section">

                </div>
            ) : null}
        </div>
    );
};

const showProducts = (products: any[]) => {
    return products.map((product: any) => { 
        return (
            <ProductCard className="product-card" photo={product.photo} name={product.name} qty={product.qty} onAdd={() => {}} onMinus={() => {}}>
                <h4>{product.name}</h4>
                <p className="desc">{ product.description ? product.description.length > 53 ? product.description.slice(50) + "..." : product.description : "N/A"}</p>
                <p>{product.price.toFixed(2)} BS</p>
            </ProductCard>
        )
    })
}

const showCombos = (combos: any[]) => { 
    return combos.map((combo: any,) => { 
        return (
            <ProductCard className="combo-card" photo={combo.photo} name={combo.denomination} qty={combo.qty} onAdd={() => {}} onMinus={() => {}}>
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

export default Orders;