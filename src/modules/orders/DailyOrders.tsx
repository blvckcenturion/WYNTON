import { useEffect, useState } from "react";
import orderService from "./services/orders";
import convertUTCDateToLocalDate from "../utils/functions/convertUTCDateToLocalDate";
import capitalize from "../utils/functions/capitalize";

const DailyOrders = ({ user }: { user: any }) => { 
    
    const [dailyOrders, setDailyOrders] = useState<any[]>([])
    const [status, setStatus] = useState<any>("")
    const [orderType, setOrderType] = useState<any>("")
    const [totalGenerated, setTotalGenerated] = useState<number>(0);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);

    useEffect(() => {
        (async () => {
            let canceledOrders: any[] = await orderService.load(0)
            let finalizedOrders: any[] = await orderService.load(2)
            
            let dailyOrders: any[] = [...canceledOrders, ...finalizedOrders]
    
            dailyOrders = dailyOrders.filter((order: any) => {
                return order.user_id === user.id
            });
    
            dailyOrders = dailyOrders.filter((order: any) => {
                let today = convertUTCDateToLocalDate(new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())));
                let orderDate = convertUTCDateToLocalDate(new Date(order.created_at))
                today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                return orderDate >= today
            });
    
            dailyOrders = dailyOrders.filter((order: any) => {
                // Filter by status if specified
                if (status !== "" && status !== null) {
                    return order.status == parseInt(status);
                }
    
                // Filter by order type if specified
                if (orderType !== "" && orderType !== null) {
                    return order.order_type == parseInt(orderType);
                }
    
                return true;
            });
    
            dailyOrders = dailyOrders.map((order: any) => { 
                return {
                    id: order.id,
                    total: order.items.reduce((acc : number, item : any) => { 
                        return acc + (item.price * item.quantity)
                    }, 0),
                    paymentMethod: order.payment_method,
                    orderType: order.order_type,
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
            });
    
            setDailyOrders(dailyOrders);
    
            // Filter orders with status 2 for statistics calculation
            const finalizedDailyOrders = dailyOrders.filter(order => order.status === 2);
    
            // Calculate the statistics
            const totalGen = finalizedDailyOrders.reduce((acc, order) => acc + order.items.reduce((acc:any, item:any) => acc + (item.price * item.quantity), 0), 0);
            const totalOrd = finalizedDailyOrders.length;
            const totalProd = finalizedDailyOrders.reduce((acc, order) => acc + order.items.reduce((acc:any, item:any) => acc + item.quantity, 0), 0);
    
            setTotalGenerated(totalGen);
            setTotalOrders(totalOrd);
            setTotalProducts(totalProd);
    
            console.log(totalGen);
            console.log(totalOrd);
            console.log(totalProd);
        })();
    }, [status, orderType]);
    

    // Filter orders with status 2 for statistics calculation
    const finalizedDailyOrders = dailyOrders.filter(order => order.status === 2);
    const canceledDailyOrders = dailyOrders.filter(order => order.status === 0);

    // Calculate the statistics for finalized orders
    const totalGenFinalized = finalizedDailyOrders.reduce((acc, order) => acc + order.items.reduce((acc:any, item:any) => acc + (item.price * item.quantity), 0), 0);
    const totalOrdFinalized = finalizedDailyOrders.length;
    const totalProdFinalized = finalizedDailyOrders.reduce((acc, order) => acc + order.items.reduce((acc:any, item:any) => acc + item.quantity, 0), 0);

    // Calculate the statistics for canceled orders
    const totalOrdCanceled = canceledDailyOrders.length;
    

    const handleStatusChange = (e: any) => { 
        setStatus(e.target.value)
    }

    const handleOrderTypeChange = (e: any) => { 
        setOrderType(e.target.value)
    }


    return (
        <div className="daily-orders-module">
            <h1>Ordenes del dia</h1>
            
            <div className="filters">
                <label htmlFor="orderStatus">
                    Estado
                </label>
                <select name="orderStatus" id="orderStatus" value={status} onChange={handleStatusChange}>
                    <option value="">Todos</option>
                    <option value="0">Cancelada</option>
                    <option value="1">Pendiente</option>
                    <option value="2">Finalizada</option>
                </select>

                <label htmlFor="orderType">
                    Tipo de orden
                </label>
                <select name="orderType" id="orderType" value={orderType} onChange={handleOrderTypeChange}>
                    <option value="">Todos</option>
                    <option value="1">Orden de tienda</option>
                    <option value="2">Orden de PedidosYa</option>
                </select>
            </div>
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
                                <th>Tipo de orden</th>
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
                                         <td>{order.orderType == 1 ? "Orden de tienda" : "Orden de PedidosYa"} </td>
                                        <td>{order.status == 1 ? "Pendiente" : order.status == 2 ? "Finalizada" :  "Cancelada"}</td>   
                                     </tr>
                                 )
                             })}
                         </tbody>    
                    </table>
                )}
            </div>
            <div className="stats-bar">
                <div className="stat-card">
                    <h2>Total Generado</h2>
                    <p>{totalGenFinalized.toFixed(2)} BS</p>
                </div>
                <div className="stat-card">
                    <h2>Ordenes Finalizadas</h2>
                    <p>{totalOrdFinalized}</p>
                </div>
                <div className="stat-card">
                    <h2>Ordenes Canceladas</h2>
                    <p>{totalOrdCanceled}</p>
                </div>
                <div className="stat-card">
                    <h2>Productos Vendidos</h2>
                    <p>{totalProdFinalized}</p>
                </div>
            </div>

        </div>
    )
}

export default DailyOrders;