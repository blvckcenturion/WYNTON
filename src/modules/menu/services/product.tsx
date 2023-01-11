import { invoke } from "@tauri-apps/api"
import { exists } from "@tauri-apps/api/fs"
import { convertFileSrc } from "@tauri-apps/api/tauri"
import { toast } from "react-toastify"
import displayError from "../../utils/functions/displayError"
import categoryService from "./category"

class productService {
    // Load all active products from the database 
    public static async load() : Promise<any[]>{
        try{
            const categories: any[] = await categoryService.load()
            const response : string = await invoke("get_all_product")
            let products: any[] = await JSON.parse(response)
            products = await products.map(async (product) => {
                return {
                    ...product,
                    category: categories.find((category) => {
                        return category.id === product.category_id
                    }),
                    photo: product.photo && await exists(product.photo) ? convertFileSrc(product.photo) : null,
                    photo_path: product.photo
                }
            })

            return await Promise.all(products)
        } catch(e : any) {
            displayError(e)
            return [];
        }
    }

    // Load all active products from the database grouped by category
    public static async loadByCategory() : Promise<any[]> {
        try {
            let categories = await categoryService.load()
            categories.push({ name: "Sin categoría", id: null })
            const products = await this.load()

            return await categories.map((category : any) => {
                return {
                    ...category,
                    products: products.filter((product) => {
                        return product.category_id === category.id
                    })
                }
            }).sort((a : any,b : any) => { return a.products.length > b.products.length ? =-1 : -1 })
        } catch(e : any) {
            displayError(e)
            return[]
        }
    }
}

export default productService