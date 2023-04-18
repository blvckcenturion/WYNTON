import { faAdd } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import userLogService from "../services/userLog"

const UserLog = () => {

    const [userSearchTerm, setUserSearchTerm] = useState("")
    const [userLogs, setUserLogs] = useState<any[]>([])
    const [userLogSearch, setUserLogSearch] = useState<any[] | null>(null)

    useEffect(() => {
        (async () => {
            await loadUserLogs()
        })
    })

    const loadUserLogs = async () => {
        const users: any[] = await userLogService.load()
        setUserLogs(users)
    }

    const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => { 
        setUserSearchTerm(e.target.value)
    }    

    const showUserLogs = (userLogs: any[]) => {
        return userLogs.map((userLog: any) => { 
            return (
                <tr>
                    <h1>aaa</h1>
                    {/* <td>{userLog.name}</td>
                    <td>{userLog.username}</td>
                    <td>{userLog.userType}</td>
                    <td>{userLog.loginDate}</td>
                    <td>{userLog.logoutDate}</td> */}
                </tr>
            )
        })
    }

    return (
        <div className="user-log-section section">
            <form className="form-search">
                <div>
                    <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="userName">
                        Nombre del usuario
                    </label>
                    <input placeholder="Buscar usuarios"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userName" type="text" onChange={handleUserSearch} value={userSearchTerm}/>
                </div>
                <div/>
            </form>
            <div className="table item-table">
                {userLogs.length == 0 && userLogSearch == null && (
                    <div className="text-center">
                        <p>No existen historiales registrados.</p>
                    </div>
                )}
                {userLogSearch != null && userLogSearch.length == 0 && (
                    <div>
                        <p>No se encontraron usuarios con el nombre: "{userSearchTerm}" </p>
                    </div>   
                )}
                {(userLogs != null || userLogSearch != null) && (userLogs?.length > 0 && userLogSearch == null || userLogSearch != null && userLogSearch?.length > 0) && (
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Usuario</th>
                                <th>Tipo de Usuario</th>
                                <th>Fecha/Hora inicio de Sesion</th>
                                <th>Fecha/Hora fin de Sesion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userLogs != null && userLogSearch == null && showUserLogs(userLogs)}
                            {userLogSearch != null && showUserLogs(userLogSearch)}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default UserLog