import { useEffect, useState } from "react";
import authService from "../users/services/auth";
import orderService from "./services/orders";
import convertUTCDateToLocalDate from "../utils/functions/convertUTCDateToLocalDate";
import capitalize from "../utils/functions/capitalize";
import categoryService from "../menu/services/category";

const OrderAnalytics = () => {

    const [orders, setOrders] = useState<any[]>([])
    const [allOrders, setAllOrders] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [startDate, setStartDate] = useState<string | number | readonly string[] | undefined >("")
    const [endDate, setEndDate] = useState<string | number | readonly string[] | undefined >("")
    const [user, setUser] = useState<any>("")
    const [stats, setStats] = useState<any>({})
    const [performance, setPerformance] = useState<any>("")
    const [status, setStatus] = useState<any>("")
    const [orderType, setOrderType] = useState<any>("");

    useEffect(() => {
        (async () => {
            let users: any[] = await authService.load()

            let canceledOrders: any[] = await orderService.load(0)
            let pendingOrders: any[] = await orderService.load(1)
            let finalizedOrders: any[] = await orderService.load(2)

            let orders: any[] = finalizedOrders
            orders = orders.concat(canceledOrders)
            orders = orders.concat(pendingOrders)

            let categories = await categoryService.load();
            
            orders = orders.map((order) => {
                let user = users.find((user) => user.id === order.user_id)
                return {
                    id: order.id,
                    userId: order.user_id,
                    total: order.items.reduce((acc : number, item : any) => { 
                        return acc + (item.price * item.quantity)
                    }, 0),
                    paymentMethod: order.payment_method,
                    items: order.items.map((item: any) => { 
                        return {
                            price: item.price,
                            quantity: item.quantity,
                            subtotal: item.price * item.quantity,
                            comboId: item.combo_id,
                            productId: item.product_id,
                            id: item.id,
                            categoryId: item.product ? item.product.category_id : null,
                            categoryName: categories.find((category: any) => category.id === (item.product ? item.product.category_id : null))?.name,
                            name: capitalize(item.product ? item.product.name : item.combo.denomination),
                        }
                    }),
                    status: order.status,
                    orderType: order.order_type,
                    userName: user ? `${user.names} ${user.last_names}` : "Super Admin",
                    dateTime: convertUTCDateToLocalDate(new Date(order.created_at))
                }
            })

            orders = orders.sort((a, b) => {
                const dateA = new Date(a.dateTime);
                const dateB = new Date(b.dateTime);
            
                return dateB.getTime() - dateA.getTime();
            });

            finalizedOrders = orders.filter((order) => order.status == 2)
            let stats = await calculateOrderStats(finalizedOrders)
            setUsers(users)
            setOrders(orders)
            setAllOrders(orders)
            setStats(stats)

        })()

    }, [])

    const calculateOrderStats = async (orders: any[]) => { 
        let total = 0;
        let units = 0;
        let totalOrders = orders.length;
        let ordersPerDay: any[] = [];
        let ordersPerDayAvg = 0;
        let mostSoldProducts: any[] = [];
        let bestUserSellers: any[] = [];
        let mostUsedPaymentMethods: any[] = [];
        let paymentTypeTotals: any[] = []; // Object to store payment type totals
        let orderTypeCounts: any[] = [];
        let categoryCounts: any[] = [];

        orders.forEach((order) => { 
            total += order.total;
            units += order.items.reduce((acc: number, item: any) => { 
                return acc + item.quantity;
            }, 0);
            let date = new Date(order.createdAt);
            let dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            let orderPerDay = ordersPerDay.find((orderPerDay) => orderPerDay.date === dateStr);
            if (orderPerDay) {
                orderPerDay.orders.push(order);
            } else {
                ordersPerDay.push({
                    date: dateStr,
                    orders: [order]
                });
            }
    
            order.items.forEach((item: any) => {
                let product = mostSoldProducts.find((product) => product.productId === item.productId || product.comboId === item.comboId);
                if (product) {
                    product.quantity += item.quantity;
                } else {
                    mostSoldProducts.push({
                        productId: item.productId,
                        comboId: item.comboId,
                        name: item.name,
                        quantity: item.quantity
                    });
                }
            });
    
            let paymentMethod = mostUsedPaymentMethods.find((paymentMethod) => paymentMethod.paymentMethod === order.paymentMethod);
            let paymentType = paymentTypeTotals.find((paymentType) => paymentType.paymentMethod === order.paymentMethod);
            if (paymentMethod && paymentType) {
                paymentMethod.quantity += 1;
                paymentType.quantity += order.total; 
            } else {
                mostUsedPaymentMethods.push({
                    paymentMethod: order.paymentMethod,
                    quantity: 1
                });

                paymentTypeTotals.push({
                    paymentMethod: order.paymentMethod,
                    quantity: order.total
                })
            }
    
            let seller = bestUserSellers.find((seller) => seller.userId === order.userId);
            if (seller) {
                seller.total += order.items.reduce((acc: number, item: any) => { 
                    return acc + item.quantity;
                }, 0);
            } else {
                bestUserSellers.push({
                    userId: order.userId,
                    userName: order.userName,
                    total: order.items.reduce((acc: number, item: any) => {
                        return acc + item.quantity;
                    }, 0)
                });
            }

            let orderTypeCount = orderTypeCounts.find((orderTypeCount) => orderTypeCount.orderType === order.orderType);
            if (orderTypeCount) {
                orderTypeCount.quantity += 1;
            } else {
                orderTypeCounts.push({
                    orderType: order.orderType,
                    quantity: 1
                });
            }
        });

        orders.forEach((order) => {
            order.items.forEach((item: any) => {
                let categoryId = item.categoryId || 'no-category';
                let categoryName = item.categoryName || 'Sin Categoria';
        
                let category = categoryCounts.find((categoryCount) => categoryCount.categoryId === categoryId);
                if (category) {
                    category.quantity += item.quantity;
                } else {
                    categoryCounts.push({
                        categoryId: categoryId,
                        categoryName: categoryName,
                        quantity: item.quantity
                    });
                }
            });
        });
    
        mostSoldProducts = mostSoldProducts.sort((a, b) => {
            return b.quantity - a.quantity;
        });

        ordersPerDayAvg = ordersPerDay.reduce((acc: number, orderPerDay: any) => {
            return acc + orderPerDay.orders.length;
        }, 0) / ordersPerDay.length;
    
        mostUsedPaymentMethods = mostUsedPaymentMethods.sort((a, b) => {
            return b.quantity - a.quantity;
        });

        return { total, units, totalOrders, ordersPerDay, ordersPerDayAvg, mostSoldProducts, bestUserSellers, mostUsedPaymentMethods, paymentTypeTotals, orderTypeCounts, categoryCounts };
    }

    const handleUserChange = async (e: any) => { 
        if (e.target.value !== "" && (performance === "2" || performance === "3")) { 
            setPerformance("")
        }
        setUser(e.target.value)
        
        let { orders, stats } = await loadOrders(e.target.value, startDate, endDate, status, orderType)
        
        setStats(stats)
        setOrders(orders)

    }

    const loadOrders = async (userFilter: any | null, startDateFilter: any | null, endDateFilter: any | null, status: any | null, orderTypeFilter: any | null) => {
        let orders = allOrders

        if (userFilter !== "" && userFilter !== null) { 
            orders = orders.filter((order) => {
                return order.userId == userFilter
            })
        }

        if (startDateFilter !== "" && startDateFilter !== null) { 
            let date = startDateFilter.toString()
            orders = orders.filter((order) => {
                let d = convertUTCDateToLocalDate(new Date(date))
                let d1 = new Date(order.dateTime.getFullYear(), order.dateTime.getMonth(), order.dateTime.getDate())
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate())
                
                return d1 >= d
            })
        }

        if (endDateFilter !== "" && endDateFilter !== null) {
            let date = endDateFilter.toString()
            orders = orders.filter((order) => {
                let d = convertUTCDateToLocalDate(new Date(date))
                let d1 = new Date(order.dateTime.getFullYear(), order.dateTime.getMonth(), order.dateTime.getDate())
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate())

                return d1 <= d
            })
        }

        if (orderTypeFilter !== "" && orderTypeFilter !== null) {
            orders = orders.filter((order) => {
                return order.orderType == parseInt(orderTypeFilter);
            });
        }

        let stats;
        if (status !== "" && status !== null) {
            orders = orders.filter((order) => {
                return order.status == parseInt(status)
            })
            stats = await calculateOrderStats(orders)
        } else {
            let finalizedOrders = orders.filter((order) => order.status == 2)
            stats = await calculateOrderStats(finalizedOrders)
        }
        
        
        return { orders, stats}
    }

    const handleOrderTypeChange = async (e: any) => {
        setOrderType(e.target.value);
        let { orders, stats } = await loadOrders(user, startDate, endDate, status, e.target.value);
        setStats(stats);
        setOrders(orders);
    }

    const handleStartDateChange = async (e: any) => {
        if (endDate != "" && endDate != undefined) { 
            if (e.target.value > endDate) {
                return;
            }
        }
        setStartDate(e.target.value)
        
        let { orders, stats } = await loadOrders(user, e.target.value, endDate, status,orderType)
        
        setStats(stats)
        setOrders(orders)
    }

    const handleEndDateChange = async (e: any) => {
        if (startDate != "" && startDate != undefined) {
            if (e.target.value < startDate) {
                return;
            }
        }
        setEndDate(e.target.value)

        let { orders, stats } = await loadOrders(user, startDate, e.target.value, status, orderType)
        
        setStats(stats)
        setOrders(orders)
    }

    const handleStatusChange = async (e: any) => { 
        setStatus(e.target.value)

        let { orders, stats } = await loadOrders(user, startDate, endDate, e.target.value, orderType)

        setStats(stats)
        setOrders(orders)

    }   

    const cleanFilters = async () => {
        setStartDate("")
        setEndDate("")
        setUser("")
        setStatus("")
        setOrderType("")
        setPerformance("")

        let { orders, stats } = await loadOrders(null, null, null, null, null)

        setStats(stats)
        setOrders(orders)
    }

    return (
        <div className="order-analytics-module">
            <div>
                <form className={`${(startDate != "" || endDate != "" || status != "" || orderType != "" || performance != "") ? "" : "no-filters"}`}>
                    <div>
                        <label htmlFor="orderUser">
                            Usuario
                        </label>
                        <select name="orderUser" id="orderUser" value={user} onChange={handleUserChange}>
                            <option value="">Todos</option>
                            {users.map((user) => {
                                return (
                                    <option value={user.id}>{user.names} {user.last_names}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="orderPerformance">
                            Rendimiento
                        </label>
                        <select name="orderPerformance" id="orderPerformance" value={performance} onChange={(e) => setPerformance(e.target.value)}>
                            <option value="">No mostrar</option>
                            <option value="1">Productos</option>
                            {user == "" ? (
                                <>
                                    <option value="2">Usuarios</option>
                                    <option value="3">Ordenes por tipo de pago</option>
                                    <option value="4">Suma por tipo de pago</option>
                                    <option value="5">Ordenes por tipo</option>
                                    <option value="6">Categorías</option>
                                </>
                            ) : null}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="orderType">
                            Tipo de Orden
                        </label>
                        <select name="orderType" id="orderType" value={orderType} onChange={handleOrderTypeChange}>
                            <option value="">Todos</option>
                            <option value="1">Orden de tienda</option>
                            <option value="2">Orden de PedidosYa</option>
                        </select>
                    </div>
                    {/* Filter by status */}
                    <div>
                        <label htmlFor="orderStatus">
                            Estado
                        </label>
                        <select name="orderStatus" id="orderStatus" value={status} onChange={handleStatusChange}>
                            <option value="">Todos</option>
                            <option value="0">Cancelada</option>
                            <option value="1">Pendiente</option>
                            <option value="2">Finalizada</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="orderStartDate">
                            Fecha de inicio
                        </label>
                        <input type="date" name="orderStartDate" id="orderStartDate" value={startDate} onChange={handleStartDateChange}/>
                    </div>
                    <div>
                        <label htmlFor="orderEndDate">
                            Fecha de fin
                        </label>
                        <input type="date" name="orderEndDate" id="orderEndDate" value={endDate} onChange={handleEndDateChange}/>
                    </div>
                    
                    {(startDate != "" || endDate != "" || status != "" || orderType != "" || performance != "") ? (
                        <div>
                            <button type="button" onClick={cleanFilters}>
                                Limpiar 
                            </button>
                        </div>
                    ) : null}
                    
                </form>
            </div>
            <div>
                <OrderAnalyticsCard title={(status == "" || status == "2") ? "Total generado" : status == "1" ? "Total por capturar" : "Total no capturado"} value={`${stats.total ? stats.total.toFixed(2): 0} BS`} />
                <OrderAnalyticsCard title="Numero de ordenes" value={`${stats.totalOrders ? stats.totalOrders : 0}`} />
                <OrderAnalyticsCard title="Promedio diario de ordenes" value={`${stats.ordersPerDayAvg ? stats.ordersPerDayAvg.toFixed(2) : 0}`} />
                <OrderAnalyticsCard title={"Total unidades"} value={`${stats.units ? stats.units : 0}`} />
            </div>
            <div>
                {performance ? (
                    <div className="table item-table performance">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    {performance === "2" ? <th>Total</th> : null}
                                    {(performance === "3" || performance === "1" || performance === "5" || performance === "6") ? <th>Cantidad</th> : null}
                                    {performance === "4" ? <th>Suma (BS)</th> : null}
                                </tr>
                            </thead>
                            <tbody>
                                {performance == "1" && stats.mostSoldProducts && stats.mostSoldProducts.map((product: any) => {
                                    return (
                                        <tr>
                                            <td>{product.name}</td>
                                            <td>{product.quantity}</td>
                                        </tr>
                                    )
                                })}
                                {performance == "2" && stats.bestUserSellers && stats.bestUserSellers.map((user: any) => { 
                                    return (
                                        <tr>
                                            <td>{user.userName}</td>
                                            <td>{user.total}</td>
                                        </tr>
                                    )
                                })}
                                {performance == "3" && stats.mostUsedPaymentMethods && stats.mostUsedPaymentMethods.map((paymentMethod: any) => {
                                    return (
                                        <tr>
                                            <td>{paymentMethod.paymentMethod == 1 ? "Tarjeta" : paymentMethod.paymentMethod == 2 ? "QR" : "Efectivo"}</td>
                                            <td>{paymentMethod.quantity}</td>
                                        </tr>
                                    )
                                })}
                                {performance == "4" && stats.paymentTypeTotals && stats.paymentTypeTotals.map((paymentMethod: any) => {
                                    return (
                                        <tr>
                                            <td>{paymentMethod.paymentMethod == 1 ? "Tarjeta" : paymentMethod.paymentMethod == 2 ? "QR" : "Efectivo"}</td>
                                            <td>{paymentMethod.quantity}</td>
                                        </tr>
                                    )
                                })}
                                {performance == "5" && stats.orderTypeCounts && stats.orderTypeCounts.map((orderTypeCount: any) => {
                                    return (
                                        <tr>
                                            <td>{orderTypeCount.orderType == 1 ? "Orden de tienda" : "Orden de PedidosYa"}</td>
                                            <td>{orderTypeCount.quantity}</td>
                                        </tr>
                                    )
                                })}
                                {performance == "6" && stats.categoryCounts && stats.categoryCounts.map((categoryCount: any) => {
                                    return (
                                        <tr>
                                            <td>{categoryCount.categoryName}</td>
                                            <td>{categoryCount.quantity}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : null}
                <div className={`table item-table orders ${performance ? "" : "no-performance"}`}>
                    {orders == null || orders.length == 0 ? (
                        <div>
                            <p>No existen ordenes registradas.</p>
                        </div>
                    ): (
                         <table>
                         <thead>
                             <tr>
                                <th>#</th>
                                <th>Fecha/Hora</th>
                                <th>Usuario</th>
                                <th>Productos</th>
                                <th>Total</th>
                                <th>Metodo de pago</th>
                                <th>Tipo de orden</th>
                                <th>Estado</th>        
                             </tr>
                         </thead>
                         <tbody>
                             {orders.map((order) => { 
                                 return (
                                     <tr>
                                        <td>{order.id}</td>
                                        <td>{order.dateTime.toLocaleString()}</td>
                                        <td>{order.userName}</td>
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
            </div>
        </div>
    )
}

const OrderAnalyticsCard = ({title, value} : {title: string, value: string}) => { 
    return (
        <div className="analytic-card">
            <div>
                <h4>{title}</h4>
            </div>
            <div>
                <h3>{value}</h3>
            </div>
        </div>
    )
}

export default OrderAnalytics;