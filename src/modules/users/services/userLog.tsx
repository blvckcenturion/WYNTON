import { invoke } from "@tauri-apps/api";
import displayError from "../../utils/functions/displayError";

class userLogService{
    public static async createLog(id : number) {
        try {
            let response: any = await invoke("create_user_log", {id});
            response = await JSON.parse(response);
            
            console.log(response)

            if (response === null) {
                throw new Error("No se pudo crear registro de usuario");
            }

            return true;
        } catch (e: any) {
            console.log(e)
            displayError(e);
            return false;
        }
    }

    public static async finishLog() { 
        try {
            let response: any = await invoke("update_user_log");
            return true;
        } catch (e: any) {
            displayError(e);
            return false;
        }
    }

    public static async load() {
        try {
            let response: any = await invoke("get_all_user_logs");
            response = await JSON.parse(response);
            return response;
        } catch (e: any) {
            displayError(e);
            return null;
        }
    }
        
}

export default userLogService;