import { faAdd } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import Modal from "../utils/components/modal"
import ActionModal from "../utils/components/actionModal"
const Combos = () => {
    const [combosSearchTerm, setCombosSearchTerm] = useState("")
    const [showCombosForm, setShowCombosForm] = useState(false)
    const [combos, setCombos] = useState<any[]>([])
    const [combosSearch, setCombosSearch] = useState<any[] | null>(null)
    const [combosEdit, setCombosEdit] = useState<object | null>(null);
    const [showComboDelete, setShowComboDelete] = useState(false)

    const handleComboSearch = (e : any) => {

    }

    const showCombos = (combos : any[]) => {

    }

    const deleteCombo = () => {

    }

    return (
        <div className="combos-module">
            <div className="add-combos-section section">
                <form className='form-search'>
                    <div>
                        <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                        Nombre del combo
                        </label>
                        <input placeholder="Buscar combos"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text" onChange={handleComboSearch} value={combosSearchTerm}/>
                    </div>
                    <div>
                        <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={ () => setShowCombosForm(true)}>
                            <FontAwesomeIcon icon={faAdd} />
                            &nbsp;Agregar combo
                        </button>
                    </div>
                </form>
                <div className="table item-table">
                    {combos.length == 0 && combosSearch == null && (
                        <div className="text-center">
                            <p>No hay combos disponibles</p>
                        </div>
                    )}
                    {combosSearch != null && combosSearch.length == 0 && (
                        <div>
                            <p>No se encontraron productos con el nombre "{combosSearchTerm}"</p>
                        </div>
                    )}
                    {(combos != null || combosSearch != null) && (combos?.length > 0 && combosSearch == null|| combosSearch != null && combosSearch?.length > 0) && (
                    <table className='table-auto'>
                        <thead>
                        <tr>
                            <th>Nombre&nbsp;</th>
                            <th>Precio&nbsp;</th>
                            <th>Descripcion</th>
                            <th>Categoria&nbsp;</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        {/* <tbody>
                            {combos != null && combosSearch == null && showCombos(combos)}
                            {combosSearch != null && showCombos(combosSearch)}
                        </tbody> */}
                    </table>
                    )}
                </div>
            </div>
            <Modal className={"add-product-modal"} title={combosEdit ? "Editar combo" : "Agregar combo"} showModal={showCombosForm} onClose={() => {setShowCombosForm(false); setCombosEdit(null);} }>
                <CombosForm/>
            </Modal>
            <ActionModal title="Eliminar producto" body="¿Esta seguro que desea eliminar este producto?" showModal={showComboDelete} onConfirm={deleteCombo} onCancel={() => setShowComboDelete(false)}/>
        </div>
    )
}

const CombosForm = () => { 
    return <div></div>
}

export default Combos