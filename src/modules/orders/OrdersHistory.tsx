import { useEffect, useState } from "react";
import authService from "../users/services/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFighterJet } from "@fortawesome/free-solid-svg-icons";
import orderService from "./services/orders";
import convertUTCDateToLocalDate from "../utils/functions/convertUTCDateToLocalDate";
import capitalize from "../utils/functions/capitalize";

const OrderAnalytics = () => {

    const [orders, setOrders] = useState<any[]>([])
    const [allOrders, setAllOrders] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [startDate, setStartDate] = useState<string | number | readonly string[] | undefined >("")
    const [endDate, setEndDate] = useState<string | number | readonly string[] | undefined >("")
    const [user, setUser] = useState<any>("")
    const [stats, setStats] = useState<any>({})
    const [performance, setPerformance] = useState<any>("")

    useEffect(() => {
        (async () => {
            let users: any[] = await authService.load()
            let orders: any[] = await orderService.load()
            orders = orders.map((order) => {
                let user = users.find((user) => user.id === order.user_id)
                return {
                    createdAt: order.created_at,
                    id: order.id,
                    userId: order.user_id,
                    total: order.items.reduce((acc : number, item : any) => { 
                        return acc + (item.price * item.quantity)
                    }, 0),
                    items: order.items.map((item: any) => { 
                        return {
                            price: item.price,
                            quantity: item.quantity,
                            subtotal: item.price * item.quantity,
                            comboId: item.combo_id,
                            productId: item.product_id,
                            id: item.id,
                            name: capitalize(item.product ? item.product.name : item.combo.denomination)
                        }
                    }),
                    userName: user ? `${user.names} ${user.last_names}` : "Super Admin",
                    dateTime: convertUTCDateToLocalDate(new Date(order.created_at)).toLocaleString()
                }
            })
            let stats = await calculateOrderStats(orders)
            setUsers(users)
            setOrders(orders)
            setAllOrders(orders)
            setStats(stats)

        })()

    }, [])

    const calculateOrderStats = async (orders: any[]) => { 
        let total = 0
        let units = 0
        let totalOrders = orders.length
        let ordersPerDay: any[] = []
        let ordersPerDayAvg = 0
        let mostSoldProducts: any[] = []
        let bestUserSellers: any[] = []
        orders.forEach((order) => { 
            total += order.total
            units += order.items.reduce((acc: number, item: any) => { 
                return acc + item.quantity
            }, 0)
            let date = new Date(order.createdAt)
            let dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            let orderPerDay = ordersPerDay.find((orderPerDay) => orderPerDay.date === dateStr)
            if (orderPerDay) {
                orderPerDay.orders.push(order)
            }
            else {
                ordersPerDay.push({
                    date: dateStr,
                    orders: [order]
                })
            }

            order.items.forEach((item: any) => {
                let product = mostSoldProducts.find((product) => product.productId === item.productId || product.comboId === item.comboId)
                if (product) {
                    product.quantity += item.quantity
                } else {
                    mostSoldProducts.push({
                        productId: item.productId,
                        comboId: item.comboId,
                        name: item.name,
                        quantity: item.quantity
                    })
                }
            })

            let seller = bestUserSellers.find((seller) => seller.userId === order.userId)
            if (seller) {
                seller.total += order.items.reduce((acc: number, item: any) => { 
                    return acc + item.quantity
                }, 0)
            } else {
                bestUserSellers.push({
                    userId: order.userId,
                    userName: order.userName,
                    total: order.items.reduce((acc: number, item: any) => {
                        return acc + item.quantity
                    }, 0)
                })
            }
        })

        mostSoldProducts = mostSoldProducts.sort((a, b) => {
            return b.quantity - a.quantity
        })

        ordersPerDayAvg = ordersPerDay.reduce((acc: number, orderPerDay: any) => {
            return acc + orderPerDay.orders.length
        }, 0) / ordersPerDay.length
        return { total, units, totalOrders, ordersPerDay, ordersPerDayAvg, mostSoldProducts, bestUserSellers }
    } 

    const handleUserChange = async (e: any) => { 
        if (e.target.value !== "" && performance === "2") { 
            setPerformance("")
        }
        // console.log(loadOrders(e.target.value))
        setUser(e.target.value)

        let { orders, stats } = await loadOrders(e.target.value, null)

        setStats(stats)
        setOrders(orders)

    }

    const loadOrders = async (newUser: any | null, newStartDate: any | null) => {
    //Usuario: santiagosarabia168250
    //Contraseña: FYvidi7ZxKvk
        let orders = allOrders
        // console.log(orders)
        if (newUser !== "" && newUser !== null) { 
            orders = orders.filter((order) => {
                return order.userId == newUser
            })
        } else {
            orders = orders.filter((order) => {
                return order.userId == user.id
            })
        }
        if (newStartDate !== "" && newStartDate !== undefined && newStartDate !== null) { 
            let date = newStartDate.toString()
            orders = orders.filter((order) => {
                return new Date(order.createdAt) >= new Date(date)
            })
        } else {
            if (startDate !== "" && startDate !== undefined && startDate !== null) { 
                let date = startDate.toString()
                orders = orders.filter((order) => {
                    return new Date(order.createdAt) >= new Date(date)
                })
            }
            console.log(orders)
        }
        if (endDate !== "" && endDate !== undefined) { 
            let date = endDate.toString()
            orders = orders.filter((order) => {
                return new Date(order.createdAt) <= new Date(date)
            })
        }
        
        let stats = await calculateOrderStats(orders)
        
        return { orders, stats}
    }

    const handleStartDateChange = async (e: any) => {
        if (endDate != "" && endDate != undefined) { 
            if (e.target.value > endDate) {
                return;
            }
        }
        setStartDate(e.target.value)

        let { orders, stats } = await loadOrders(null,e.target.value)

        setStats(stats)
        setOrders(orders)
    }

    const handleEndDateChange = (e: any) => {
        if (startDate != "" && startDate != undefined) {
            if (e.target.value < startDate) {
                return;
            }
        }
        setEndDate(e.target.value)
    }

    const cleanFilters = async () => {
        setStartDate("")
        setEndDate("")
        setUser("")

        let { orders, stats } = await loadOrders(null, null)

        setStats(stats)
        setOrders(orders)
    }

    return (
        <div className="order-analytics-module">
            <div>
                <form className={`${(startDate != "" || endDate != "") ? "" : "no-filters"}`}>
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
                                <option value="2">Usuarios</option>
                            ) : null}
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
                    
                    {(startDate != "" || endDate != "") ? (
                        <div>
                            <button type="button" onClick={cleanFilters}>
                                Limpiar 
                            </button>
                        </div>
                    ) : null}
                    
                </form>
            </div>
            <div>
                <OrderAnalyticsCard title="Total generado" value={`${stats.total ? stats.total.toFixed(2): 0} BS`} />
                <OrderAnalyticsCard title="Numero de ordenes" value={`${stats.totalOrders ? stats.totalOrders : 0}`} />
                <OrderAnalyticsCard title="Promedio diario de ventas" value={`${stats.ordersPerDayAvg ? stats.ordersPerDayAvg.toFixed(2) : 0}`} />
                <OrderAnalyticsCard title={"Unidades vendidas"} value={`${stats.units ? stats.units : 0}`} />
            </div>
            <div>
                {performance ? (
                    <div className="table item-table performance">
                        
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Unidades</th>
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
                            </tbody>
                        </table>
                    </div>
                ) : null}
                <div className={`table item-table orders ${performance ? "" : "no-performance"}`}>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha/Hora</th>
                                <th>Usuario</th>
                                <th>Productos</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => { 
                                return (
                                    <tr>
                                        <td>{order.dateTime}</td>
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
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
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