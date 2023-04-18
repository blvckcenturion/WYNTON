import { useState } from "react";
import UserOperations from "./sections/UserOperations";
import UserLog from "./sections/UserLog";

const Users = () => {
    const [tab, setTab] = useState(1)
    
    const handleToggle = (t: number) => {
        setTab(t)
    }

    const Render = (): JSX.Element => {
        switch (tab) {
            case 1:
                return <UserOperations />
            default:
                return <UserLog />
        }
    }

    return (
        <div className="users-module module">
            <div>
                <button className={tab == 1 ? "active" : undefined} onClick={() => handleToggle(1)} >Usuarios</button>
                <button className={tab == 2 ? "active" : undefined} onClick={() => handleToggle(2)} >Historial</button>
            </div>
            <div>
                <Render />
            </div>
        </div>
    )
}

export default Users;