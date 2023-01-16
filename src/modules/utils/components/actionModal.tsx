import { faAdd, faCancel, faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "./modal"

const ActionModal = ({title, body, showModal, onCancel, onConfirm, className} : {title: string, body : string, showModal : boolean, onCancel : Function, onConfirm : Function, className? : string}) => {    

    return (
        <Modal className={`action-modal ${className}`} title={title} showModal={showModal} onClose={onCancel}>
            <div className="modal-body">
                <p>{body}</p>
            </div>
            <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => onCancel()}>
                    <FontAwesomeIcon icon={faCancel} />
                    &nbsp;Cancelar
                </button>
                <button className="btn btn-confirm" onClick={() => onConfirm()}>
                    <FontAwesomeIcon icon={faCheck} />
                    &nbsp;Confirmar
                </button>
            </div>
        </Modal>
    )
}

export default ActionModal