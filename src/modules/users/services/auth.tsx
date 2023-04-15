import { invoke } from "@tauri-apps/api";
import { z } from "zod";
import displayError from "../../utils/functions/displayError";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { exists } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";

class authService {

    public static userValidationSchema = z.object({
        names: z.string({
            required_error: "El nombre es requerido."
        }).trim().max(50, { message: "El nombre debe ser menor o igual a 50 caracteres." }).min(1, { message: "El nombre es requerido." }),
        last_names: z.string({
            required_error: "El apellido es requerido."
        }).trim().max(50, { message: "El apellido debe ser menor o igual a 50 caracteres." }).min(1, { message: "El apellido es requerido." }),
        user_type: z.number({
            invalid_type_error: "El tipo de usuario debe ser un numero valido.",
            required_error: "El tipo de usuario es requerido."
        }).min(1, { message: "El tipo de usuario es requerido." }),
        user_reference: z.string().optional(),
        photo: z.string().optional().nullable(),
    })

    public static loginSchema = z.object({
        username: z.string({
            required_error: "El nombre de usuario es requerido."
        }).trim().max(50, { message: "El nombre de usuario debe ser menor o igual a 50 caracteres." }).min(1, { message: "El nombre de usuario es requerido." }),
        password: z.string({
            required_error: "La contraseña es requerida."
        }).trim().max(50, { message: "La contraseña debe ser menor o igual a 50 caracteres." }).min(1, { message: "La contraseña es requerida." }),
    })

    public static changePasswordSchema = z.object({
        username: z.string({
            required_error: "El nombre de usuario es requerido."
        }).trim().max(50, { message: "El nombre de usuario debe ser menor o igual a 50 caracteres." }).min(1, { message: "El nombre de usuario es requerido." }),
        old_password: z.string({
            required_error: "La contraseña es requerida."
        }).trim().max(50, { message: "La contraseña debe ser menor o igual a 50 caracteres." }).min(1, { message: "La contraseña es requerida." }),
        password: z.string({
            required_error: "La nueva contraseña es requerida."
        }).trim().max(50, { message: "La nueva contraseña debe ser menor o igual a 50 caracteres." }).min(8, { message: "La nueva contraseña debe ser mayor o igual a 8 caracteres." }),
        confirm_password: z.string({
            required_error: "La confirmación de la contraseña es requerida."
        }).trim().max(50, { message: "La confirmación de la contraseña debe ser menor o igual a 50 caracteres." }).min(1, { message: "La confirmación de la contraseña es requerida." }),
    })

    public static async loadById(id : number): Promise<any> { 
        try {
            return await JSON.parse(await invoke("find_by_id_user", { id }))[0];
        } catch (e: any) {
            console.log(e)
            displayError(e);
            return null;
        }
    }

    public static async load() : Promise<any[]> {
        try {
            const response: string = await invoke("get_all_user");
            let users: any[] = await JSON.parse(response);
            users = await users.filter((user) => {
                return user.user_type !== 1 || user.user_type !== 2; 
            })

            users = await users.map(async (user) => {
                    return {
                            ...user,
                            photo: user.photo && await exists(user.photo) ? convertFileSrc(user.photo) : null,
                            photo_path: user.photo
                        }
                    })
                    
            users = await Promise.all(users)

            let userId = localStorage.getItem('userId');
            let uid = userId ? parseInt(userId) : null;
            // delete currentUser from users array
            users = users.filter((user) => {
                return user.id !== uid
            });
            return users;
        } catch (e: any) {
            displayError(e);
            return [];
        }
    }

    public static async deleteUser(id : any) {
        try {
            await invoke("delete_user", { id });
            toast.success("Usuario eliminado de forma exitosa");
        } catch (e: any) {
            displayError(e);
        }
    }

    private static generateUsername(names: string, last_names: string): string {
        // Generate a unique username using the first three and last three digits of the Unix timestamp
        const unixTimestamp = Date.now().toString();
        const username = `${names.toLowerCase()}${last_names.toLowerCase()}${unixTimestamp.substring(0, 3)}${unixTimestamp.substring(unixTimestamp.length - 3)}`;
        return username;
    }

    public static async createUser(user: any) {
        try {
            const password = require('secure-random-password');

            let generatedPassword = password.randomPassword({ characters: [password.upper, password.lower, password.digits] });
            user.password = await bcrypt.hash(generatedPassword, 10);
            user.username = this.generateUsername(user.names, user.last_names);
            user.lastNames = user.last_names;
            user.userType = user.user_type;
            user.userReference = user.user_reference;
            let response: any = await invoke("create_user", user);
            response = await JSON.parse(response);
            
            if (response !== 1) {
                throw new Error("No se pudo crear el usuario");
            }

            user.password = generatedPassword;

            return user;
        } catch (e : any) {
            displayError(e);
            return null;
        }
    }

    public static async updateUser(user: any) { 
        try {
            console.log(user)
            user.lastNames = user.last_names;
            user.userType = user.user_type;
            user.userReference = user.user_reference;
            await invoke("update_user", user);
            console.log('aaaa')
            toast.success("Usuario actualizado de forma exitosa");
        } catch (e: any) {
            console.log(e)
            displayError(e);
            return null;
        }
    }

    public static async updateUserPassword(id : any, newPassword: string | null) {
        try {
            let generatedPassword;
            if (!newPassword) { 
                const password = require('secure-random-password');
                generatedPassword = password.randomPassword({ characters: [password.upper, password.lower, password.digits] });
            } else {
                generatedPassword = newPassword;
            }
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            await invoke("update_password_user", { id, password: hashedPassword });
            return generatedPassword;
        } catch (e: any) {
            console.log(e)
            displayError(e);
            return null;
        }
    }

    public static async login(username: string, password: string) {
        try {
            console.log(username, password)
            const response: string = await invoke("login_user", { username });
            const user: any = await JSON.parse(response)[0];
            console.log(user)
            if (!user) {
                throw new Error("El usuario o la contraseña son incorrectos.");
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
            return isPasswordCorrect ? user : null;
        } catch (e: any) {
            console.log(e)
            displayError(e);
            return null;
        }
    }

    public static async logout(router : any) { 
        try {
            localStorage.removeItem("userId");
            router.push("/");
        } catch (e: any) {
            displayError(e);
        }
    }

}

export default authService;