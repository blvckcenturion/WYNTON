import Modal from "./modal"

const ActionModal = ({title, body, showModal, onCancel, onConfirm, className} : {title: string, body : string, showModal : boolean, onCancel : Function, onConfirm : Function, className? : string}) => {    

    return (
        <Modal className={`action-modal ${className}`} title={title} showModal={showModal} onClose={onCancel}>
            <div className="modal-body">
                <p>{body}</p>
            </div>
            <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => onCancel()}>Cancelar</button>
                <button className="btn btn-confirm" onClick={() => onConfirm()}>Confirmar</button>
            </div>
        </Modal>
    )
}

export default ActionModal