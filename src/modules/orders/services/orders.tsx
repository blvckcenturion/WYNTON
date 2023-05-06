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

    public static async load(): Promise<any[]> {
        try {
            let prod: string = await invoke("get_all_product_registered")
            let products: any[] = await JSON.parse(prod)
            
            let comb: string = await invoke("get_all_combo_registered")
            let combos: any[] = await JSON.parse(comb)

            const response: string = await invoke("get_all_order")
            let orders: any[] = await JSON.parse(response)

            orders = await orders.map(async (order) => {
                let i: string = await invoke("get_all_by_order_id", { orderId: order.id })
                let items: any[] = await JSON.parse(i)
                items = await items.map((item: any) => { 
                    let product = products.find((p: any) => p.id === item.product_id)
                    if (product === undefined) { 
                        product = combos.find((p: any) => p.id === item.combo_id)
                        return {
                            ...item,
                            combo: product
                        }
                    }
                    return {
                        ...item,
                        product: product
                    }
                })

                return {
                    ...order,
                    items: items
                }
            })
            
            orders = await Promise.all(orders)
            return orders
        } catch (e: any) { 

            console.log(e)
            displayError(e)
            return []
        }
    }
}

export default orderService