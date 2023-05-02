import { faFileImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ProductCard = ({id, className, photo, name, children, qty, handleChangeQty}: {id: number, className: string, photo: any, name: string, children: any, qty: number, handleChangeQty : any}) => {
    return (
        <div className={`orders-card ${className}`}>
            <div>
                {photo ? (
                    <img src={photo} alt={name}/>
                ) : (
                    <div>
                        <FontAwesomeIcon icon={faFileImage} />
                        <p>
                            Sin imagen. 
                        </p>
                    </div>
                )}
            </div>
            <div>
                {children}
            </div>
            <div>
                <button className="btn btn-primary" onClick={() => handleChangeQty(id, qty-1)}>-</button>
                <input type="number" readOnly value={qty}/>
                <button className="btn btn-primary" onClick={() => handleChangeQty(id, qty+1)}>+</button>
            </div>
        </div>
    )
}

export default ProductCard