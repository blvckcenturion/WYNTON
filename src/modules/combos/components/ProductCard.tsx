import { faFileImage, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductCard = ({ product, index, handleProductQty, handleProductSelect }: { product: any, index: number, handleProductQty: Function, handleProductSelect: Function }) => { 
    return (
        <div className={`flex flex-row shadow appareance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${product.selected ?  "selected" : ""}`} key={index}>
        <div>
            {product.photo ? <img src={product.photo} alt={product.name} /> : <FontAwesomeIcon icon={faFileImage} />}
        </div>
        <div>
            <p>{product.name}</p>
            <p>{product.price.toFixed(2)} BS</p>
        </div>
        <div>
            <div>
                <button className="text-white font-bold rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => handleProductQty(product, product.qty-1)}>
                    <FontAwesomeIcon icon={faMinus} />
                </button>
                <div className="text-white font-bold rounded focus:outline-none focus:shadow-outline">
                    <p>{product.qty}</p>
                </div>
                <button className="text-white font-bold rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => handleProductQty(product, product.qty+1)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            <div>
                {product.selected ? (
                    <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline delete" type="button" onClick={() => handleProductSelect(product)}>
                        Eliminar&nbsp;<FontAwesomeIcon icon={faTrash} />
                    </button>
                ): (
                    <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline add" type="button" onClick={() => handleProductSelect(product)}>
                    Agregar&nbsp;<FontAwesomeIcon icon={faPlus} />
                    </button>
                )}
            </div>
        </div>
    </div>
    )
}
export default ProductCard;