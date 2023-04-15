import { useFormik } from "formik";
import Modal from "../utils/components/modal";
import authService from "./services/auth";
import { toast } from "react-toastify";

const PasswordUpdate = ({ showModal, setShowModal }: { showModal: boolean, setShowModal: Function }) => {
    
    const closeModal = () => { 
        console.log('asd')
    }

    const changePassword = useFormik({
        initialValues: {
            old_password: "",
            password: "",
            password_confirmation: ""
        },
        onSubmit: async (values) => {
            try {
                let l = authService.loginSchema.parse(values);
                
                const user = await authService.login(l.username, l.password);
                
                if (user) { 

                } else {
                    throw new Error("Contraseña incorrecta.");
                }
            } catch (e: any) {
                console.log(e)
                if (typeof e.issues !== "undefined") {
                    toast.error(e.issues[0].message);
                } else {
                    toast.error(e.message);
                }
            }
        }
    })


    return (
        <Modal className={"password-update-modal"} title={"Cambiar Contraseña"} showModal={showModal} onClose={closeModal}>
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
                        <label htmlFor="password_confirmation">Confirmar Contraseña</label>
                        <input type="password" name="password_confirmation" id="password_confirmation" onChange={changePassword.handleChange} value={changePassword.values.password_confirmation} />
                    </div>
                    <div className="mb-1">
                        <button type="submit">Cambiar Contraseña</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default PasswordUpdate;