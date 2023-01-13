import { faAdd } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"


const Combos = () => {

    // Combos Section State Variables
    const [comboSearchTerm, setComboSearchTerm] = useState("")
    const [combos, setCombos] = useState<any[]>([])

    // Products Section On Mount Function
    useEffect(() => {
        (async () => {
            await loadCombos()
            
        })()
    }, [])

    // Helper function to load all the active combos from the backend and set the state
    const loadCombos = async () => {}

    // Helper function to search for combos using a specific term
    const handleComboSearch = (e : React.ChangeEvent<HTMLInputElement>) => {}

    // Helper function that renders the products on the table

    return (
        <>
            <div className="combos-section section">
                <form className="form-search">
                    <div>
                        <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                        Nombre del combo
                        </label>
                        <input placeholder="Buscar productos"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="comboName" type="text" onChange={handleComboSearch} value={comboSearchTerm}/>
                    </div>
                    <div>
                    <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button">
                        <FontAwesomeIcon icon={faAdd} />
                        &nbsp;Agregar combo
                    </button>
                    </div>
                </form>
                <div className="table item-table">
                    
                </div>
            </div>
        </>
    )
}

export default Combos