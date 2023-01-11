import { toast } from "react-toastify"

const displayError = (e : any) => {
    if (typeof e.issues !== "undefined") {
        toast.error(e.issues[0].message)
    } else {
        toast.error(e.message);
    }
}

export default displayError