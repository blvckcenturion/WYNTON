import { faAdd, faCancel, faCircleCheck, faEdit, faFileCirclePlus, faFileImage, faRotateRight, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useFormik } from "formik";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import ActionModal from "../utils/components/actionModal";
import Modal from "../utils/components/modal";
import createImage from "../utils/functions/createImage";
import elementSearch from "../utils/functions/elementSearch";
import authService from "./services/auth";
import { open } from '@tauri-apps/api/dialog';
import capitalize from "../utils/functions/capitalize";
import { useRouter } from "next/router";

const Users = () => {

    const router = useRouter()

    const [currentUser, setCurrentUser] = useState<any>(null)
    const [userList, setUserList] = useState<any[]>([]);
    const [userSearch, setUserSearch] = useState<any[] | null>(null);
    const [userSearchTerm, setUserSearchTerm] = useState<string>("");
    const [showUserForm, setShowUserForm] = useState<boolean>(false);
    const [showUserDelete, setShowUserDelete] = useState<boolean>(false);
    const [userDelete, setUserDelete] = useState<number | null>(null);
    const [userEdit, setUserEdit] = useState<object | null>(null);
    const [showNewUserModal, setShowNewUserModal] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<any | null>(null);
    const [editedUser, setEditedUser] = useState<boolean>(false);
  
    useEffect(() => {
        (async () => {
            await loadUsers()
            let user = await loadUser()

            if (user) {
                setCurrentUser(user)
            }
        })()
    }, [])

    const loadUsers = async () => {
        const users: any[] = await authService.load()
        setUserList(users)
    }

    const loadUser = async () => {
        let idStr = localStorage.getItem("userId")

        if (!idStr) router.push("/login")
        else {
            let id = parseInt(JSON.parse(idStr))
            const user = await authService.loadById(id)
            return user
        }
    }

    const handleUserSearch = (e: any) => { 
        const userFilter = (user: any) => {
            let fullName = `${user.names} ${user.last_names}`

            if (user.names.toLowerCase().includes(e.target.value.toLowerCase()) || fullName.toLowerCase().includes(e.target.value.toLowerCase()) || user.last_names.toLowerCase().includes(e.target.value.toLowerCase()) || user.username.toLowerCase().includes(e.target.value.toLowerCase())) {
                return user
            }
        }
        elementSearch(e, setUserSearchTerm, setUserSearch, userList, userFilter)
    }

    const showUsers = (users: any[]) => {

        return users.map((user: any) => {
            return (
                <tr key={user.id}>
                    <td>{`${capitalize(user.names)} ${capitalize(user.last_names)}`}</td>
                    <td>{user.username}</td>
                    <td>{user.user_type == 1 ? "Administrador" : "Empleado"}</td>
                    <td>{user.user_reference.length > 0 ? user.user_reference : "N/A"}</td>
                    <td>
                        <div>
                            {user.photo && (
                                <img src={user.photo} alt="Imagen de usuario" />
                            )}
                            {!user.photo && (
                                <>
                                    <FontAwesomeIcon icon={faFileImage} />
                                    <br />
                                    Sin imagen.
                                </>
                            )}
                        </div>
                    </td>
                    <td>
                        {(user && user.user_type == 2 || currentUser && currentUser.user_type === 3) && (
                            <>
                                <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => {setUserEdit(user); setShowUserForm(true)}}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => {setShowUserDelete(true); setUserDelete(user.id);}}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </>
                        )}
                        
                    </td>

                </tr>
            )
            
        })
    }

    const handleDeleteUser = async () => {
        if (userDelete) {
            await authService.deleteUser(userDelete)
            setUserDelete(null)
            await loadUsers()
            setShowUserDelete(false)
        }
    }

    const showNewUser = (newUser : any, edit : boolean) => {
        setShowNewUserModal(true)
        setEditedUser(edit)
        setNewUser(newUser)
    }

    return (
        <>
            <div className="add-user-section section">
                <form className="form-search">
                    <div>
                        <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="userName">
                            Nombre del usuario
                        </label>
                        <input placeholder="Buscar usuarios"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userName" type="text" onChange={handleUserSearch} value={userSearchTerm}/>
                    </div>
                    <div>
                        <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={ () => setShowUserForm(true)}>
                            <FontAwesomeIcon icon={faAdd} />
                            &nbsp;Agregar usuario
                        </button>
                    </div>
                </form>
                <div className="table item-table">
                    {userList.length == 0 && userSearch == null && (
                        <div className="text-center">
                            <p>No existen usuarios registrados.</p>
                        </div>
                    )}
                    {userSearch != null && userSearch.length == 0 && (
                        <div>
                            <p>No se encontraron usuarios llamados "{userSearchTerm}"</p>
                        </div>
                    )}
                    {(userList != null || userSearch != null) && (userList?.length > 0 && userSearch == null|| userSearch != null && userSearch?.length > 0) && (
                        <table className='table-auto'>
                            <thead>
                                <tr>
                                    <th>Nombre&nbsp;</th>
                                    <th>Usuario&nbsp;</th>
                                    <th>Tipo de Usuario&nbsp;</th>
                                    <th>Referencias</th>
                                    <th>Imagen</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList != null && userSearch == null && showUsers(userList)}
                                {userSearch != null && showUsers(userSearch)}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Modal className={"add-user-modal"} title={userEdit ? "Editar usuario" : "Agregar usuario"} showModal={showUserForm} onClose={() => {setShowUserForm(false); setUserEdit(null);} }>
                <UserForm currentUser={currentUser}  showNewUser={showNewUser} user={userEdit} loadUsers={loadUsers} setShowUserForm={setShowUserForm} setUser={setUserEdit}/>
            </Modal>
            <Modal className="show-user-modal" title={"Usuario creado de forma exitosa"} showModal={showNewUserModal} onClose={() => { setShowNewUserModal(false);  setNewUser(null)}}>
                <div className="modal-body">
                    {editedUser ? (
                        <p>La contraseña del usuario <span>{newUser?.names} {newUser?.last_names}</span> ha sido cambiada de forma exitosa.</p>
                    ) : (
                        <p>El usuario <span>{newUser?.names} {newUser?.last_names}</span> ha sido creado de forma exitosa.</p>
                    )}
                    <hr />
                    <p className="select">Usuario: {newUser?.username}</p>
                    <p className="select">Contraseña: {newUser?.password}</p>
                    <hr />
                    <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => { setShowNewUserModal(false);  setNewUser(null)}}>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        &nbsp;Confirmar
                    </button>
                </div>
            </Modal>
            <ActionModal title="Eliminar usuario" body="¿Esta seguro que desea eliminar este usuario?" showModal={showUserDelete} onConfirm={handleDeleteUser} onCancel={() => setShowUserDelete(false)} />
        </>
    )  
}

const UserForm = ({showNewUser, user, loadUsers, setShowUserForm, setUser, currentUser}: {showNewUser : Function, user : any | null, loadUsers : Function, setShowUserForm : Function, setUser : Function, currentUser : any}) => {
    
    const [photo, setPhoto] = useState<any>("");
    const [photoSrc, setPhotoSrc] = useState<any>("");
    const [photoReplaced, setPhotoReplaced] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [userSave, setUserSave] = useState<any>(null);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    

    useEffect(() => {
        if (user && user.photo) {
            setPhoto(user.photo)
            setPhotoSrc(user.photo)
            // Usuario: peloculo168987
            // Contraseña: fcCBhJpqJJ72
        }
    }, [])

    const createUser = useFormik({
        initialValues: {
            names: "",
            last_names: "",
            user_type: (currentUser && currentUser.user_type === 3) ? "1" : "2",
            user_reference: "",
        },
        onSubmit: async (values) => { 
            try {
                let u = authService.userValidationSchema.parse({ ...values, user_type: parseInt(values.user_type) });
                u.names = u.names.toLowerCase();
                u.last_names = u.last_names.toLowerCase();

                
                if (photo !== "" && photoSrc !== "") {
                    u.photo = await createImage("users", photoSrc);
                }

                let user = await authService.createUser(u);

                if (user != null) {

                    setShowUserForm(false);
                    showNewUser(user, false);

                    await loadUsers();
                }


            } catch (e: any) {
                if (typeof e.issues !== "undefined"){
                toast.error(e.issues[0].message);
                } else {
                toast.error(e.message);
                }
            }

        }
    })

    const editUser = useFormik({
        initialValues: {
            names: user?.names || "",
            last_names: user?.last_names || "",
            user_type: user?.user_type || 1,
            user_reference: user?.user_reference || "",
        },
        onSubmit: async (values) => { 
            let u = authService.userValidationSchema.parse({ ...values, user_type: parseInt(values.user_type) });
            u.names = u.names.toLowerCase();
            u.last_names = u.last_names.toLowerCase();

            if (u.names !== user?.names || u.last_names !== user?.last_names || u.user_type !== user?.user_type || u.user_reference !== user?.user_reference || photoReplaced) {
                setUserSave(u);
                setShowConfirm(true);
            } else {
                cancelEditUser();
            }
        }
    })

    const handleImage = async () => {
        try {
            let res : any = await open({
                multiple: false,
                directory: false,
                filters: [
                  { name: 'Image', extensions: ['jpg', 'png', 'jpeg'] }
                ]
              });
              if(res == null) {
                setPhoto("");
                setPhotoSrc("");
              } else {
                setPhoto(convertFileSrc(res));
                setPhotoSrc(res)
              }
        
              if(user) {
                setPhotoReplaced(true);
              }
        } catch (e: any) { 
            toast.error(e.message);
        }
    }

    const confirmEditUser = async () => { 
        let userEdit = userSave

        if (photoReplaced && photo != "" && photoSrc != "") {
            userEdit.photo = await createImage("users", photoSrc)
        } else {
            userEdit.photo = user?.photo_path;
        }
        
        userEdit.username = user?.username;
        userEdit.password = user?.password;

        userEdit.id = user?.id;

        console.log(userEdit)
        await authService.updateUser(userEdit)

        loadUsers(); 
        setShowUserForm(false);
        setUser(null);
    }

    const cancelEditUser = () => {
        setShowUserForm(false);
        setUser(null);
    }

    const confirmPasswordChange = async () => { 
        let newPassword = await authService.updateUserPassword(user?.id, null);
        if (newPassword != null) {
            setShowConfirmPassword(false);
            showNewUser({ ...user, password: newPassword }, true);
            cancelEditUser();
        }
    }
    
    return (
        <>
            <div>
                <form onSubmit={user !== null ? editUser.handleSubmit : createUser.handleSubmit}>
                    <div className="mb-1">
                        <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="userNames">
                        {`Nombres del usuario ${user ? editUser.values.names.length > 0 ? `(${editUser.values.names.length})` : ""  : createUser.values.names.length > 0 ? `(${createUser.values.names.length})` : ""}`}<span>(*)</span>
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userNames" type="text" onChange={user ? editUser.handleChange("names") : createUser.handleChange("names")} value={user ? editUser.values.names : createUser.values.names}/>
                    </div>
                    <div className="mb-1">
                        <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="userLast_names">
                            {`Apellidos del usuario ${user ? editUser.values.last_names.length > 0 ? `(${editUser.values.last_names.length})` : "" : createUser.values.last_names.length > 0 ? `(${createUser.values.last_names.length})` : ""}`}<span>(*)</span>                            
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userLast_names" type="text" onChange={user ? editUser.handleChange("last_names") : createUser.handleChange("last_names")} value={user ? editUser.values.last_names : createUser.values.last_names}/>
                    </div>
                    {/* I need an input for user_reference using a text area*/}   
                    <div className="mb-1">
                        <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="user_type">
                            Tipo de usuario <span>(*)</span>
                        </label>
                        <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="user_type" onChange={user ? editUser.handleChange("user_type") : createUser.handleChange("user_type")} value={user ? editUser.values.user_type : createUser.values.user_type}>
                            {currentUser && currentUser.user_type == 3 && (<option value="1">Administrador</option>)}
                            <option value="2">Empleado</option>
                        </select>    
                    </div>
                    <div className="mb-1">
                        <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="user_reference">
                            {`Referencias del usuario ${user ? editUser.values.user_reference.length > 0 ? `(${editUser.values.user_reference.length})` : ""  : createUser.values.user_reference.length > 0 ? `(${createUser.values.user_reference.length})` : ""}`}
                        </label>    
                        <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="user_reference" onChange={user ? editUser.handleChange("user_reference") : createUser.handleChange("user_reference")} value={user ? editUser.values.user_reference : createUser.values.user_reference} />    
                    </div>
                    <div className="mb-4">
                        <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="userPhotoW">
                        Imagen del usuario
                        </label>
                        <div className={`photo ${photo.length > 0 ? "active" : "non-active"}`} id="userPhoto">
                        {photo.length == 0 && (
                            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onClick={handleImage}>
                            <FontAwesomeIcon icon={faFileCirclePlus}/>
                            <p>Escoger imagen</p>
                            </div>
                        )}
                        {photo && photo.length > 0 && (
                            <div>
                                <div className="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                    <img src={photo} alt="user" />
                                </div>
                                <div>
                                    <button className={`${photo.length > 0 ? "active" : ""}`} type="button" onClick={() => { setPhoto(""); setPhotoSrc(""); setPhotoReplaced(true) }}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                    &nbsp;Eliminar
                                    </button>
                                    <button className={`${photo.length > 0 ? "active" : ""}`} type="button" onClick={handleImage}>
                                    <FontAwesomeIcon icon={faEdit}/>
                                    &nbsp;Editar
                                    </button>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                    <div className={`flex flex-row form-submit ${user ? "edit" : ""}`}>
                        <button className="text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline" type="submit">
                        <FontAwesomeIcon icon={faSave} />
                        &nbsp;{user ? "Guardar" : "Agregar"}
                        </button>
                        {user && (
                            <button className="text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => setShowConfirmPassword(true)}>
                        <FontAwesomeIcon icon={faRotateRight} />
                        &nbsp;{user ? "Resetear Contraseña" : "Agregar"}
                        </button>
                        )}
                        <button className="text-white font-bold rounded focus:outline-none focus:shadow-outline" type="button" onClick={cancelEditUser} >
                        <FontAwesomeIcon icon={faCancel} />
                        &nbsp;Cancelar
                        </button>
                    </div>
                </form>
            </div>
            <ActionModal title={"Guardar cambios"} body={"¿Desea confirmar los cambios realizados al usuario?"} showModal={showConfirm} onConfirm={confirmEditUser} onCancel={() => setShowConfirm(false)} className={"confirm-modal"} />
            <ActionModal title={"Generar nueva contraseña"} body={"¿Desea confirmar el cambio de contraseña?"} showModal={showConfirmPassword} onConfirm={confirmPasswordChange} onCancel={() => setShowConfirmPassword(false)} className={"confirm-modal"}/>
        </>
    )
}

export default Users;