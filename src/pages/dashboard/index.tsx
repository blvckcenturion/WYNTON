import { useState } from "react";
import Logo from "../../assets/logo"
import NavigationOption from "../../modules/dashboard/NavigationOption"
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faUser, faBellConcierge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Menu from '../../modules/menu/Menu';

const Dashboard = () => {
    const [tab, setTab] = useState(1)

    const handleToggle = (t : number) => {
        setTab(t)
    }
 
    const Render = () => {
        switch(tab){
            case 1:
                return <Menu/>
            case 2:
                return (<h1>Hola Mundo</h1>)
        }
    }

    return (
        <div className="dashboard-page page">
            <div className="dashboard-sidebar">
                <div className="shadow appearance-none rounded">
                    <div className="dashboard-header">
                        <Logo/>
                        <h1 className="text-primary">WYNTON</h1>
                    </div>
                    <div className="dashboard-items">
                        <NavigationOption title={"Menu"} icon={faBellConcierge} onClick={() => handleToggle(1)} active={tab == 1}/>
                        <NavigationOption title={"Empleados"} icon={faUser} onClick={() => handleToggle(2)} active={tab == 2}/>
                    </div>
                </div>
                <div className="dashboard-user-details shadow appearance-none rounded">
                    <FontAwesomeIcon icon={faUserCircle} />
                    <div>
                        <h3>Antonio Rojas Vargas</h3>
                        <h4>Administrador</h4>
                    </div>
                </div>
            </div>
            <div className="dashboard-content">
                <Render/>
            </div>
        </div>
    )
}

export default Dashboard

