import { invoke } from "@tauri-apps/api"
import { toast } from "react-toastify"
import { z } from "zod"
import displayError from "../../utils/functions/displayError"

class orderService {
    public static async create(order: any) {
        try {
            let response: any = await invoke("create_order", order)
            response = await JSON.parse(response)
            order.id = response
            console.log(order)
            order.items.forEach(async (i: any) => { 
                let prod = {orderId: order.id, productId: i.productId, comboId: i.comboId, quantity: i.quantity, price: i.price}
                await invoke("create_order_item", prod)
            })
            return response
        } catch (e: any) {
            console.log(e)
            displayError(e)
            return null
        }
    }
}

export default orderService