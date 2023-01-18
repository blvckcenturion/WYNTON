import { invoke } from "@tauri-apps/api";
import {toast} from "react-toastify";
import { z } from "zod";
import displayError from "../../utils/functions/displayError";

// Category Service class in charge of interacting with the Rust Backend 
class categoryService {

    public static categoryValidationSchema = z.object({
        name: z.string().trim()
        .max(20, {message: "El nombre de la categoria debe ser menor o igual a 20 caracteres."}).min(1, {message: "El nombre de la categoria es requerido."}),
    })

    public static async load() {
        try {
            const response : string = await invoke("get_all_category")
            const categories = await JSON.parse(response)
            return await JSON.parse(response);
        } catch(e: any) {
            displayError(e)
            return []
        }
    }

    public static async delete(id : number) {
        try {
            let products : string = await invoke("get_all_product_by_category", {id});
            products = await JSON.parse(products);

            if(products.length > 0){
                throw new Error("No se puede eliminar la categoria porque tiene productos asociados.");
            }
            await invoke("delete_category", { id })
            toast.success("Categoría eliminada de forma exitosa")
        } catch(e : any) {
            displayError(e)
        }
    }

    public static async filter(name : string, id? : number ) {
        try{
            let categories = await this.load();
            categories = categories.filter((category : any) => {
                if(category.name.trim().toLowerCase() === name.trim().toLowerCase()){
                    return category;
                }
            })

            if(id){
                categories = categories.filter((category : any) => {
                    if(category.id !== id){
                        return category;
                    }
                })
            }

            return categories
        } catch(e: any){
            displayError(e)
        } 
    }

    public static async update(category : any) {
        try{
            await invoke("update_category", category)
            toast.success("Categoría actualizada de forma exitosa")
        } catch(e: any){
            displayError(e)
        }
    }
}

export default categoryService;