import { faFileImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ProductCard = ({className, photo, name, children, qty, onAdd, onMinus}: {className: string, photo: any, name: string, children: any, qty: number, onAdd: any, onMinus: any}) => {
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
                <button className="btn btn-primary" onClick={onMinus}>-</button>
                <input type="number" value={qty}/>
                <button className="btn btn-primary" onClick={onAdd}>+</button>
            </div>
        </div>
    )
}

export default ProductCard