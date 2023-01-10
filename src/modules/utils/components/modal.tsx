import { useEffect } from "react";

const Modal = ({className, showModal, onClose, children, title} : {className : string | null, showModal : boolean, onClose : Function, children : any, title : string}) => {

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape"){
                onClose();
            }
        });
    }, [])

    const closeModal = (e : any) => {
        const modal = document.getElementById("modal");
        if (e.target === modal){
            onClose();
        }
    }

    if(!showModal) return null;
    return (
        <div className={`modal ${className}`} id="modal" onClick={closeModal}>
            <div>
                <div className="modal-header">
                    <h1 className="text-2xl font-bold">
                        {title}
                    </h1>
                </div>
                {children}
            </div>
        </div>
    ) 
}

export default Modal