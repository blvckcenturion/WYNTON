import { useEffect, useState } from "react";
import Logo from "../../assets/logo";
import NavigationOption from "./NavigationOption";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { faBell, faBellConcierge, faCancel, faCartShopping, faCheck, faChevronCircleDown, faGear, faGears, faHistory, faKey, faObjectGroup, faReceipt, faRightFromBracket, faSave, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menu from "../menu/Menu";
import Combos from "../combos/Combos";
import Users from "../users/Users";
import Orders from "../orders/Orders";
import { useRouter } from "next/router";
import authService from "../users/services/auth";
import capitalize from "../utils/functions/capitalize";
import { exists } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import OrderAnalytics from "../orders/OrdersHistory";
import ActionModal from "../utils/components/ActionModal";
import DailyOrders from "../orders/DailyOrders";
import Modal from "../utils/components/Modal";

const Dashboard = () => { 

    const router = useRouter()

    const [tab, setTab] = useState(1)
    const [user, setUser] = useState<any>(null)
    const [showUserOptions, setShowUserOptions] = useState(false)
    const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
    const [showConfirmLogout, setShowConfirmLogout] = useState(false)


    useEffect(() => {
        (async () => {
            console.log('aaa')
            
        })()
    }, [])

    useEffect(() => {

        (async () => { 
            const user = await authService.loadUser()
            console.log(user.id)

            if (user) { 
                user.photo = user.photo && await exists(user.photo) ? convertFileSrc(user.photo) : null
                setUser(user)
            } else {
                localStorage.removeItem("userId")
                router.push("/login")
            }
        })()

        window.addEventListener("keydown", (e) => {
            if (e.key == "Escape") {
                setShowUserOptions(true)
            }
        })

    }, [])

    
    const handleToggle = (t : number) => {
        setTab(t)
    }

    const changePassword = useFormik({
        initialValues: {
            old_password: "",
            password: "",
            confirm_password: "", 
            username: ""
        },
        onSubmit: async (values) => {
            try {
                let u = await authService.loadUser()
                values.username = u.username
                let l = authService.changePasswordSchema.parse(values);
                
                const user = await authService.login(l.username, l.old_password);
                
                if (l.password !== l.confirm_password) { 
                    throw new Error("Las contraseñas no coinciden.");
                }

                if (user) { 
                    if (l.password === l.old_password) {
                        throw new Error("La contraseña nueva no puede ser igual a la anterior");
                    }
                    const updatedUser = await authService.updateUserPassword(user.id, l.password);
                    if (updatedUser) {
                        toast.success("Contraseña actualizada correctamente, vuelva a iniciar sesión");
                        localStorage.removeItem("userId");
                        router.push("/");
                    }


                } else {
                    throw new Error("Contraseña incorrecta.");
                }
            } catch (e: any) {
                if (typeof e.issues !== "undefined") {
                    toast.error(e.issues[0].message);
                } else {
                    toast.error(e.message);
                }
            }
        }
    })

    const UserOptions = (): JSX.Element => {
        if (user) {
            if(user.user_type && user.user_type == 2) {
                return (
                    <>
                        <NavigationOption title={"Ordenes"} icon={faCartShopping} onClick={() => handleToggle(1)} active={tab === 1} />
                        <NavigationOption title={"Historial de ordenes"} icon={faReceipt} onClick={() => handleToggle(2)} active={tab === 2} />
                    </>
                )
            } else {
                return (
                    <>
                        <NavigationOption title={"Menu"} icon={faBellConcierge} onClick={() => handleToggle(1)} active={tab == 1}/>
                        <NavigationOption title={"Combos"} icon={faObjectGroup} onClick={() =>handleToggle(2)} active={tab === 2}/>
                        <NavigationOption title={"Usuarios"} icon={faUser} onClick={() => handleToggle(3)} active={tab === 3}/>
                        <NavigationOption title={"Ordenes"} icon={faCartShopping} onClick={() => handleToggle(4)} active={tab === 4} />
                        <NavigationOption title={"Historial de ordenes"} icon={faReceipt} onClick={() =>handleToggle(5)} active={tab === 5}/>
                    </>
                )
            }
        }
        return <></>
    }

    const Heading = () => {
        return (
            <div>
                <Logo/>
                <h1>WYNTON</h1>
            </div>
        )
    }
    
    const UserDetails = () => {
        return (
            <div className="user-details" >
                <div className="user-credentials">
                    {user && (
                        <>
                        <h3>{capitalize(user.names)} {capitalize(user.last_names)}</h3>
                        <h4>{user.user_type == 1 ? "Administrador" : user.user_type == 2 ? "Empleado" : "Super Admin"}</h4>
                        </>
                    )}
                </div>
                <div className="user-options" onClick={() => setShowUserOptions(true)}>
                    <FontAwesomeIcon icon={faGear} />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={`dashboard-page page ${user && user.user_type && (user.user_type == 1 || user.user_type == 3) ? "admin-layout" : "employee-layout"}`}>
                {user && user.user_type && (user.user_type == 1 || user.user_type == 3) ? (
                    <div className="dashboard-sidebar">
                        <div>
                            <Heading/>
                            <div>
                                {<UserOptions/>}
                            </div>
                        </div>
                        <UserDetails/>
                    </div>
                ) : (
                    <div className="dashboard-header" >
                            <Heading />
                            <div>
                                {<UserOptions/>}
                            </div>
                            <UserDetails/>
                    </div>
                )}
                
                <div className="dashboard-content">
                    {user && user.user_type && (user.user_type == 1 || user.user_type == 3) ? (
                        <>
                            {tab == 1 && <Menu />}
                            {tab == 2 &&  <Combos />}
                            {tab == 3 && <Users />}
                            {tab == 4 && <Orders user={user} />}
                            {tab == 5 && <OrderAnalytics/>}
                        </>
                    ) : (
                        <>
                                {user && tab == 1 && <Orders user={user} />}
                                {user && tab == 2 && <DailyOrders user={user} />}
                        </>
                    )}
                </div>
            </div>
            <Modal className={"user-options-modal"} title={"Opciones de usuario"} showModal={showUserOptions} onClose={() => setShowUserOptions(false)}>
                <div className="user-options">
                    {user && user.user_type && (user.user_type == 1 || user.user_type == 3) && (
                        <button>
                            <FontAwesomeIcon icon={faUserCircle} />
                            <h3>Configuracion</h3>
                        </button>
                    )}
                    <button onClick={() => { setShowPasswordUpdate(true); setShowUserOptions(false)}}>
                        <FontAwesomeIcon icon={faKey} />
                        <h3>Cambiar Contraseña</h3>
                    </button>
                    <button onClick={() => setShowConfirmLogout(true)}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <h3>Cerrar sesión</h3>
                    </button>
                </div>
            </Modal>
            <Modal className={"password-update-modal"} title={"Cambiar Contraseña"} showModal={showPasswordUpdate} onClose={() => { setShowPasswordUpdate(false); setShowUserOptions(true); changePassword.resetForm()}}>
                <div className="password-update">
                    <form onSubmit={changePassword.handleSubmit}>
                        <div className="mb-1">
                            <label htmlFor="old_password">Contraseña Actual</label>
                            <input type="password" name="old_password" id="old_password" onChange={changePassword.handleChange} value={changePassword.values.old_password} />
                        </div>
                        <div className="mb-1">
                            <label htmlFor="password">Nueva Contraseña</label>
                            <input type="password" name="password" id="password" onChange={changePassword.handleChange} value={changePassword.values.password} />
                        </div>
                        <div className="mb-1">
                            <label htmlFor="confirm_password">Confirmar Contraseña</label>
                            <input type="password" name="confirm_password" id="confirm_password" onChange={changePassword.handleChange} value={changePassword.values.confirm_password} />
                        </div>
                        <div className="mb-1">
                            <button type="submit">
                                <FontAwesomeIcon icon={faCheck} />
                                &nbsp;Confirmar
                            </button>
                            <button type="button" onClick={() => { setShowPasswordUpdate(false); setShowUserOptions(true); changePassword.resetForm() }}>
                                <FontAwesomeIcon icon={faCancel} />
                                &nbsp;Cancelar
                            </button>

                        </div>
                    </form>
                </div>
            </Modal>
            <ActionModal showModal={showConfirmLogout} onCancel={() => setShowConfirmLogout(false)} onConfirm={() => { authService.logout(router)}} title={"Cerrar sesión"} className={"confirm-modal"} body={"¿Está seguro que desea cerrar sesión?"} />
        </>
    )
}



export default Dashboard;