import { useEffect, useState } from "react";
import orderService from "./services/orders";
import convertUTCDateToLocalDate from "../utils/functions/convertUTCDateToLocalDate";
import capitalize from "../utils/functions/capitalize";

const DailyOrders = ({user}: {user: any}) => { 
    const [dailyOrders, setDailyOrders] = useState<any[]>([])

    useEffect(() => {
        (async () => {
            let canceledOrders: any[] = await orderService.load(0)
            let finalizedOrders: any[] = await orderService.load(2)
            
            let dailyOrders: any[] = [...canceledOrders, ...finalizedOrders]

            dailyOrders = dailyOrders.filter((order: any) => {
                return order.user_id === user.id
            })
            dailyOrders = dailyOrders.filter((order: any) => {
                let today = convertUTCDateToLocalDate(new Date())
                let orderDate = convertUTCDateToLocalDate(new Date(order.created_at))
                today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                return orderDate >= today
            })

            dailyOrders = dailyOrders.map((order: any) => { 
                return {
                    id: order.id,
                    total: order.items.reduce((acc : number, item : any) => { 
                        return acc + (item.price * item.quantity)
                    }, 0),
                    payment_method: order.payment_method,
                    items: order.items.map((item: any) => { 
                        return {
                            price: item.price,
                            quantity: item.quantity,
                            subtotal: item.price * item.quantity,
                            comboId: item.combo_id,
                            productId: item.product_id,
                            id: item.id,
                            name: capitalize(item.product ? item.product.name : item.combo.denomination),
                        }
                    }),
                    status: order.status,
                    dateTime: convertUTCDateToLocalDate(new Date(order.created_at)),
                }
            })
            console.log(dailyOrders)

            setDailyOrders(dailyOrders)
            
        })()
    }, [])
    return (
        <div className="daily-orders-module">
            <h1>Ordenes del dia</h1>
            <div className="table item-table orders">
                {dailyOrders == null || dailyOrders.length === 0 ? (
                    <div>
                        <p>No hay ordenes registradas hoy.</p> 
                    </div>
                ) : (
                    <table>
                        <thead>
                             <tr>
                                <th>#</th>
                                <th>Fecha/Hora</th>
                                <th>Productos</th>
                                <th>Total</th>
                                <th>Metodo de pago</th>
                                <th>Estado</th>        
                             </tr>
                        </thead>
                        <tbody>
                             {dailyOrders.map((order) => { 
                                 return (
                                     <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.dateTime.toLocaleString()}</td>
                                        <td>
                                        {
                                            order.items.map((item: any) => {
                                                return (
                                                    <div>
                                                        <span>{item.name}: </span>
                                                        <span>{item.price.toFixed(2)} BS x</span>
                                                        <span className="text-accent-1">{item.quantity} = {item.subtotal} BS</span>
                                                    </div>
                                                )
                                            })
                                        }
                                        </td>
                                        <td>{order.total.toFixed(2)} BS</td>
                                        <td>{order.paymentMethod == 1 ? "Tarjeta" : order.paymentMethod == 2 ? "QR" : "Efectivo"}</td>
                                        <td>{order.status == 1 ? "Pendiente" : order.status == 2 ? "Finalizada" :  "Cancelada"}</td>   
                                     </tr>
                                 )
                             })}
                         </tbody>    
                    </table>
                )}
            </div>
        </div>
    )
}
export default DailyOrders;