import { invoke } from "@tauri-apps/api"
import { z } from "zod"
import displayError from "../../utils/functions/displayError"
class comboService{
    public static comboValidationSchema = z.object({
        denomination: z.string({
            required_error: "El nombre del combo es requerido"
        }).trim().max(50, { message: "El nombre del combo debe ser menor o igual a 50 caracteres." }).min(1, { message: "El nombre del combo es requerido." }),
        price: z.number({
            invalid_type_error: "El precio debe ser un numero valido.",
            required_error: "El precio del combo es requerido."
        }).min(0, { message: "El precio del combo debe ser mayor o igual a 0." }).positive({ message: "El precio del combo debe ser mayor o igual a 0." }),
        products: z.array(z.object({
            id: z.number(),
            qty: z.number().min(1, { message: "La cantidad debe ser mayor o igual a 1." })
        })),
    })

    public static async create(combo: any) {
        try {
            let response : any = await invoke("create_combo", combo)
            response = await JSON.parse(response)
            console.log( response)
            combo.id = response[0].id
            combo.products.forEach(async (product: any) => { 
                let prod = {comboId: combo.id, productId: product.id, quantity: product.qty}
                await invoke("create_combo_item", prod)
            })
            console.log(combo)

            return response
        } catch (e: any) {
            console.log(e)
            displayError(e)
            return null
        }
    }

    public static async load(): Promise<any[]>{
        try{
            const response : string = await invoke("get_all_combo")
            let combos: any[] = await JSON.parse(response)
            combos = await combos.map(async (combo) => {
                let products : string = await invoke("get_all_by_combo_id_combo_item", { comboId: combo.id })
                products = await JSON.parse(products)
                return {
                    ...combo,
                    products: products
                }
            })
            combos = await Promise.all(combos)

            return combos
        } catch(e : any) {
            console.log(e)
            displayError(e)
            return [];
        }
    }

    public static async delete(id: number) {
        try {
            await invoke("delete_combo", { id })
            await invoke("delete_combo_item", { id })
            return true
        } catch (e: any) {
            console.log(e)
            displayError(e)
            return false
        }
    }
}


export default comboService;