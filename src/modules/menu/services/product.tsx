import { invoke } from "@tauri-apps/api"
import { exists } from "@tauri-apps/api/fs"
import { convertFileSrc } from "@tauri-apps/api/tauri"
import { toast } from "react-toastify"
import displayError from "../../utils/functions/displayError"
import categoryService from "./category"
import { z } from "zod"
import createImage from "../../utils/functions/createImage"

class productService {

    public static productValidationSchema = z.object({
        name: z.string({
            required_error: "El nombre del producto es requerido."
        }).trim().max(50, {message: "El nombre del producto debe ser menor o igual a 50 caracteres."}).min(1, {message: "El nombre del producto es requerido."}),
        price: z.number({
            invalid_type_error: "El precio debe ser un numero valido.",
            required_error: "El precio del producto es requerido."
        }).min(0, {message: "El precio del producto debe ser mayor o igual a 0."}).positive({message: "El precio del producto debe ser mayor o igual a 0."}),
        description: z.string().max(100, {message: "La descripcion del producto debe ser menor o igual a 100 caracteres."}).trim().optional(),
        categoryId: z.number().optional().nullable(),
        photo: z.string().optional(),
        photoSrc: z.string().optional()
    })

    // Load all active products from the database 
    public static async load(orderBy?: string, order?: string) : Promise<any[]>{
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

            products = await Promise.all(products)

            if(orderBy === "name") {
                products = products.sort((a, b) => {
                    return order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
                })
            } else if(orderBy === "price") {
                products = products.sort((a, b) => {
                    return order === "asc" ? a.price - b.price : b.price - a.price
                })
            } else if(orderBy === "category") {
                products = products.sort((a, b) => {
                    return order === "asc" ? a.category?.name.localeCompare(b.category?.name) : b.category?.name.localeCompare(a.category?.name)
                })
            }
            
            return products
        } catch(e : any) {
            console.log(e)
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
            }).sort((a : any,b : any) => { return a.products.length > b.products.length ? -1 : 1 })
        } catch(e : any) {
            displayError(e)
            return[]
        }
    }

    public static async delete(id : number) {
        try {
            await invoke("delete_product", { id })
            await invoke("delete_combo_item_by_product", { id })
            toast.success("Producto eliminado de forma exitosa")
        } catch(e : any) {
            displayError(e)
        }
    }

    public static async create(product: any) { 
        try {
            if (product.photo !== "" && product.photoSrc !== "") { 
                product.photo = await createImage("products", product.photoSrc)
            }
            let response : any = await invoke("create_product", product)
            return await JSON.parse(response)
        } catch(e : any) {
            console.log(e)
            displayError(e)
            return null
        }
    }

    public static async update(product : any) {
        try {
            if (product.photoReplaced && product.photoSrc !== "") { 
                product.photo = await createImage("products", product.photoSrc)
            } else if(product.photoReplaced && product.photoSrc === "") {
                product.photo = null
            } else {
                product.photo = product.photo_path
            }


            await invoke("update_product", product)
            toast.success("Producto actualizado de forma exitosa")
        } catch(e : any) {
            displayError(e)
        }
    }

    

}

export default productService