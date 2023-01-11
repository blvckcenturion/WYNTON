import { invoke } from "@tauri-apps/api";
import {toast} from "react-toastify";
import displayError from "../../utils/functions/displayError";

// Category Service class in charge of interacting with the Rust Backend 
class categoryService {
    public static async load() {
        try {
            const response : string = await invoke("get_all_category")
            return await JSON.parse(response);
        } catch(e: any) {
            displayError(e)
            return []
        }
    }
}

export default categoryService;