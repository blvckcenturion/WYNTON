import { useEffect, useState } from "react";
import authService from "../users/services/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFighterJet } from "@fortawesome/free-solid-svg-icons";
import orderService from "./services/orders";

const OrderAnalytics = () => {

    const [orders, setOrders] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [startDate, setStartDate] = useState<string | number | readonly string[] | undefined >("")
    const [endDate, setEndDate] = useState<string | number | readonly string[] | undefined >("")
    const [user, setUser] = useState<any>("")
    const [performance, setPerformance] = useState<any>("")

    useEffect(() => {
        (async () => {
            let users: any[] = await authService.load()
            setUsers(users)

            let orders: any[] = await orderService.load()
            console.log(orders)
        })()
    }, [])

    const handleUserChange = (e: any) => { 
        if (e.target.value !== "" && performance === "2") { 
            setPerformance("")
        }
        setUser(e.target.value)
    }

    const handleStartDateChange = (e: any) => {
        if (endDate != "" && endDate != undefined) { 
            if (e.target.value > endDate) {
                return;
            }
        }
        setStartDate(e.target.value)
    }

    const handleEndDateChange = (e: any) => {
        if (startDate != "" && startDate != undefined) {
            if (e.target.value < startDate) {
                return;
            }
        }
        setEndDate(e.target.value)
    }

    const cleanFilters = () => {
        setStartDate("")
        setEndDate("")
        setUser("")
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
                            <option value="44">ras</option>
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
                <OrderAnalyticsCard title="Total generado" value="100,000.00 BS" />
                <OrderAnalyticsCard title="Numero de ordenes" value="100" />
                <OrderAnalyticsCard title="Promedio diario de ventas" value="10" />
                <OrderAnalyticsCard title={"Unidades vendidas"} value="10" />
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
                                <tr>
                                    <td>Producto 1</td>
                                    <td>100</td>
                                </tr>
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
                            <tr>
                                <td>12/12/2021 12:00</td>
                                <td>Usuario 1</td>
                                <td>10</td>
                                <td>100,000.00 BS</td>
                            </tr>
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