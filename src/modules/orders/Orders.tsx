import { useEffect, useState } from "react";
import productService from "../menu/services/product";
import categoryService from "../menu/services/category";
import capitalize from "../utils/functions/capitalize";
import comboService from "../combos/services/combo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck, faCheckCircle, faCircleCheck, faEdit, faFileImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "./components/ProductCard";
import elementSearch from "../utils/functions/elementSearch";
import Modal from "../utils/components/Modal";
import orderService from "./services/orders";
import { toast } from "react-toastify";
import ActionModal from "../utils/components/ActionModal";


const Orders = ({user} : {user: any}) => {
    const [productSearchTerm, setProductSearchTerm] = useState<string>("")
    const [combosSearchTerm, setCombosSearchTerm] = useState<string>("")
    const [productType, setProductType] = useState<number>(0)
    const [productCategory, setProductCategory] = useState<number>(-2)
    const [allProducts, setAllProducts] = useState<any[]>([])
    const [allCombos, setAllCombos] = useState<any[]>([])
    const [productsCreate, setProductsCreate] = useState<any[]>([])
    const [productsEdit, setProductsEdit] = useState<any[]>([])
    const [combosCreate, setCombosCreate] = useState<any[]>([])
    const [combosEdit, setCombosEdit] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [productsSearchCreate, setProductsSearchCreate] = useState<any[]>([])
    const [combosSearchCreate, setCombosSearchCreate] = useState<any[]>([])
    const [productsSearchEdit, setProductsSearchEdit] = useState<any[]>([])
    const [combosSearchEdit, setCombosSearchEdit] = useState<any[]>([])
    const [confirmOrderModal, setConfirmOrderModal] = useState<boolean>(false)
    const [confirmOrderModalEdit, setConfirmOrderModalEdit] = useState<boolean>(false)
    const [pendingOrders, setPendingOrders] = useState<any[]>([])
    const [paymentMethod, setPaymentMethod] = useState<number>(1)
    const [showCancelOrderConfirmation, setShowCancelOrderConfirmation] = useState<boolean>(false)
    const [showEditOrderConfirmation, setShowEditOrderConfirmation] = useState<boolean>(false)
    const [showFinalizeOrderConfirmation, setShowFinalizeOrderConfirmation] = useState<boolean>(false)
    const [orderToFinalize, setOrderToFinalize] = useState<number>(0)
    const [orderToCancel, setOrderToCancel] = useState<number>(0)
    const [orderToEdit, setOrderToEdit] = useState<number>(0)
    const [editOrderMode, setEditOrderMode] = useState<boolean>(false)
    const [editOrder, setEditOrder] = useState<any>(null)
    const [confirmShowCalculateChange, setConfirmShowCalculateChange] = useState<boolean>(false)
    const [showChangeModal, setShowChangeModal] = useState<boolean>(false)
    const [amount, setAmount] = useState<number>(0)
    const [paymentAmount, setPaymentAmount] = useState<number>(0)
    const [orderType, setOrderType] = useState<number>(1)


    useEffect(() => {
        (async () => {
            let products: any[] = await productService.load();
            products = products.map((p: any) => {
                p.name = capitalize(p.name)
                p.qty = 0
                return p
            })
            let categories: any[] = await categoryService.load();
            categories = categories.map((c: any) => {
                c.name = capitalize(c.name)
                return c
            })
            setCategories(categories);

            let combos: any[] = await comboService.load();
            combos = combos.map((c: any) => {
                c.denomination = capitalize(c.denomination)
                c.qty = 0
                c.products = c.products.map((p: any) => {
                    let prod = products.find((product: any) => product.id === p.product_id)
                    return {
                        ...prod,
                        qty: p.quantity
                    }
                })
                return c
            })

            loadPendingOrders()
            setAllProducts(products);
            setProductsCreate(products);
            setProductsEdit(products);
            setAllCombos(combos);
            setCombosCreate(combos);
            setCombosEdit(combos);
        })()
    }, [])

    const loadPendingOrders = async () => { 
        let pendingOrders: any[] = await orderService.load(1)
        pendingOrders = pendingOrders.filter((order: any) => order.user_id == user.id)
        pendingOrders = pendingOrders.map((order: any) => {
            order.items = order.items.map((item: any) => {
                if (item.product_id) {
                    let product = allProducts.find((p: any) => p.id === item.product_id)
                    return {
                        ...item,
                        product: product
                    }
                } else {
                    let combo = allCombos.find((c: any) => c.id === item.combo_id)
                    return {
                        ...item,
                        combo: combo
                    }
                }
            })
            return order
        })
        setPendingOrders(pendingOrders)
    }

    
    const handleProductSearch = (e: any) => {
        const productFilter = (product: any) => {
            if (productCategory === -2) {
                if (product.name.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())) return product
            } else if (productCategory === -1) {
                if (product.name.trim().toLowerCase().includes(e.target.value.trim().toLowerCase()) && product.category_id === null) return product
            } else {
                if (product.name.trim().toLowerCase().includes(e.target.value.trim().toLowerCase()) && product.category_id === productCategory) return product
            }
        }
        elementSearch(e, setProductSearchTerm, editOrderMode ? setProductsSearchEdit : setProductsSearchCreate, editOrderMode ? productsEdit :productsCreate, productFilter)
    }

    const handleComboSearch = (e: any) => {
        const comboFilter = (combo: any) => {
            if (combo.denomination.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())) return combo
        }
        elementSearch(e, setCombosSearchTerm, editOrderMode ? setCombosSearchEdit : setCombosSearchCreate, editOrderMode ? combosEdit : combosCreate, comboFilter)
    }

    const handleProductType = (e: any) => {
        if (e.target.value !== productType) setProductSearchTerm("")
        setProductType(parseInt(e.target.value))
    }

    const handleProductCategory = (e: any) => {
        let category = parseInt(e.target.value)
        const productFilter = (product: any) => {
            if (category === -2) {
                if (productSearchTerm === "") return product
                else if (product.name.trim().toLowerCase().includes(productSearchTerm.trim().toLowerCase())) return product
            } else if (category === -1) {
                if (productSearchTerm === "" && product.category_id === null) return product
                else if (product.name.trim().toLowerCase().includes(productSearchTerm.trim().toLowerCase()) && product.category_id === null) return product
            } else {
                if (productSearchTerm === "" && product.category_id === category) return product
                else if (product.name.trim().toLowerCase().includes(productSearchTerm.trim().toLowerCase()) && product.category_id === category) return product
            }   
        }
        if (editOrderMode) {
            let prod = productsEdit.filter(productFilter)
            setProductsSearchEdit(prod)
        } else {
            let prod = productsCreate.filter(productFilter)
            setProductsSearchCreate(prod)
        }
        setProductCategory(category)
    }

    const getSelectedProducts = (prodList: any[]) => {
        let selectedProducts: any[] = []
        prodList.forEach((p: any) => {
            if (p.qty > 0) selectedProducts.push(p)
        })
        return selectedProducts
    }

    const getSelectedCombos = (comboList: any[]) => {
        let selectedCombos: any[] = []
        comboList.forEach((c: any) => {
            if (c.qty > 0) selectedCombos.push(c)
        })
        return selectedCombos
    }

    const handleChangeProductQty = (id: number, qty: number, prodList: any[]) => {
        let productsCopy = [...prodList]
        let product = prodList.find((p: any) => p.id === id)

        if (qty >= 0) product.qty = qty
        if (!editOrderMode) {
            setProductsCreate(productsCopy)
        } else {
            setProductsEdit(productsCopy)
        }
    }

    const handleChangeComboQty = (id: number, qty: number, comboList: any[]) => {
        let combosCopy = [...comboList]
        let combo = combosCopy.find((c: any) => c.id === id)
        if (qty >= 0) combo.qty = qty
        if (!editOrderMode) { 
            setCombosCreate(combosCopy)
        } else {
            setCombosEdit(combosCopy)
        }
    }

    const showProducts = (products: any[]) => {
        if (products.length === 0)
            return (
                <div className="no-results">
                    <h4 >{(productSearchTerm === "" && productCategory == -2) ? "No existen productos registrados." : "No se encontraron resultados para tu busqueda."}</h4>
                </div>
            )
        return products.map((product: any) => {
            return (
                <ProductCard items={products} key={product.id} id={product.id} className={`product-card ${product.qty > 0 ? "selected" : ""}`} photo={product.photo} name={product.name} qty={product.qty} handleChangeQty={handleChangeProductQty}>
                    <h4>{product.name}</h4>
                    <p>{product.price.toFixed(2)} BS</p>
                </ProductCard>
            )
        })
    }
    
    const showCombos = (combos: any[]) => {
        if (combos.length === 0)
            return (
                <div className="no-results">
                    <h4>{(combosSearchTerm === "") ? "No existen combos registrados." : "No se encontraron resultados para tu busqueda."}</h4>
                </div>
            )
        return combos.map((combo: any,) => {
            return (
                <ProductCard items={combos} key={combo.id} id={combo.id} className={`combo-card ${combo.qty > 0 ? "selected" : ""}`} photo={combo.photo} name={combo.denomination} qty={combo.qty} handleChangeQty={handleChangeComboQty}>
                    <h4>{combo.denomination}</h4>
                    <div>
                        {combo.products.map((product: any) => {
                            return (
                                <p key={product.id}>{product.name} <span className="text-accent-1">x{product.qty}</span></p>
                            )
                        })}
                    </div>
                    <p>{combo.price.toFixed(2)} BS</p>
                </ProductCard>
            )
        })
    }

    const getTotal = (prodList: any[], comboList: any[]) => {
        return getSelectedProducts(prodList).reduce((acc: number, product: any) => acc + (product.price * product.qty), 0) + getSelectedCombos(comboList).reduce((acc: number, combo: any) => acc + (combo.price * combo.qty), 0)
    }

    const handleCreateOrder = async () => {
        let items: any[] = []
        getSelectedProducts(productsCreate).forEach((p: any) => {
            items.push({ order_id: 1, productId: p.id, quantity: p.qty, price: p.price })
        })
        getSelectedCombos(combosCreate).forEach((c: any) => {
            items.push({ order_id: 1, comboId: c.id, quantity: c.qty, price: c.price })
        })
        let order = {
            items: items,
            userId: user.id,
            orderType: orderType,
            paymentMethod: paymentMethod
        }

        let res: any = await orderService.create(order)
        
        if (res) {
            toast.success(`Orden #${res} creada de forma exitosa`)
            setProductsCreate(productsCreate.map((p: any) => {
                p.qty = 0
                return p
            }))
            setCombosCreate(combosCreate.map((c: any) => {
                c.qty = 0
                return c
            }))
            setConfirmOrderModal(false)
            loadPendingOrders()

        } else {
            toast.error("Error al crear la orden.")
        }
        
    }

    const handleOrderEdition = async () => { 
        let items: any[] = []
        getSelectedProducts(productsEdit).forEach((p: any) => {
            items.push({ order_id: editOrder.id, productId: p.id, quantity: p.qty, price: p.price })
        })

        getSelectedCombos(combosEdit).forEach((c: any) => {
            items.push({ order_id: editOrder.id, comboId: c.id, quantity: c.qty, price: c.price })
        })

        console.log(paymentMethod !== editOrder.payment_method ? paymentMethod : null)

        let order = {
            items: items,
            userId: user.id,
            id: editOrder.id,
            paymentMethod: paymentMethod !== editOrder.payment_method ? paymentMethod : null
        }
        
        let res: any = await orderService.updateOrderDetails(order)
        if (res) {
            toast.success(`Orden #${editOrder.id} editada de forma exitosa`)
            
            cancelEditOrder()
            setConfirmOrderModalEdit(false)
            
        }

    }

    const handleCancelOrder = async (id: number) => { 
        setShowCancelOrderConfirmation(true)
        setOrderToCancel(id)
    }

    const handleConfirmCancelOrder = async () => { 
        await orderService.updateStatus({id:orderToCancel, status: 0});
        setShowCancelOrderConfirmation(false)
        loadPendingOrders()
        setEditOrderMode(false)
        setEditOrder(null)
    }

    const handleFinalizeOrder = async (id: number) => { 
        setShowFinalizeOrderConfirmation(true)
        setOrderToFinalize(id)
    }

    const handleConfirmFinalizeOrder = async () => {
        await orderService.updateStatus({ id: orderToFinalize, status: 2 });
        setShowFinalizeOrderConfirmation(false)
        console.log(pendingOrders)
        const orderAmount = pendingOrders.filter(order => order.id === orderToFinalize)[0].items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
        loadPendingOrders()
        setAmount(orderAmount)
        setConfirmShowCalculateChange(true)
        
    }


    const handleEditOrder = async (id: number) => { 
        setShowEditOrderConfirmation(true)
        setOrderToEdit(id)
    }

    const cancelEditOrder = () => {

        setProductsEdit(productsEdit.map((p: any) => {
            p.qty = 0
            return p
        }))
        setCombosEdit(combosEdit.map((c: any) => {
            c.qty = 0
            return c
        }))
        setProductType(0)
        setEditOrderMode(false)
        setEditOrder(null)
        setProductSearchTerm("")
        setPaymentMethod(1)
        loadPendingOrders()
    }

    const handleConfirmEditOrder = async () => { 
        const editOrder = pendingOrders.find((order: any) => order.id === orderToEdit)
        // get all the combos and products from the order and set them to the state
        let products: any[] = allProducts.map((p: any) => { 
            let item = editOrder.items.find((item: any) => item.product_id === p.id)
            if (item) {
                p.qty = item.quantity
                return p
            } else {
                p.qty = 0
                return p
            }
        })
        let combos: any[] = allCombos.map((c: any) => {
            let item = editOrder.items.find((item: any) => item.combo_id === c.id)
            if (item) {
                c.qty = item.quantity
                return c
            } else {
                c.qty = 0
                return c
            }
        })
        setProductsEdit(products)
        setCombosEdit(combos)
        setShowEditOrderConfirmation(false)
        setEditOrderMode(true)
        setEditOrder(editOrder)
        setProductSearchTerm("")
        setPaymentMethod(editOrder.payment_method)
    }

    const handleConfirmCalculateChange = () => {
        setConfirmShowCalculateChange(false)
        setShowChangeModal(true)
    }

    const calculateChange = () => {
        const change = paymentAmount - amount;
        return !change ? 0 : change < 0 ? 0 : change
    }
                    
    return (
        <>
            <div className="orders-module">
                <div className={`products-section`}>
                    <div>
                        <form className={`${productType ? "combos" : "products"}`}>
                            <div>
                                <label htmlFor="productName">
                                    Nombre
                                </label>
                                <input placeholder={`Buscar ${productType ? "combos" : "productos"}`} id="productName" type="text" onChange={!productType ? handleProductSearch : handleComboSearch} value={!productType ? productSearchTerm : combosSearchTerm} />
                            </div>
                            <div>
                                <label htmlFor="productType">
                                    Tipo
                                </label>
                                <select id="productType" onChange={handleProductType} value={productType}>
                                    <option value="0">Productos</option>
                                    <option value="1">Combos</option>
                                </select>
                            </div>
                            {!productType ? (
                                <div>
                                    <label htmlFor="productType">
                                        Categoria
                                    </label>
                                    <select id="productType" onChange={handleProductCategory} value={productCategory}>
                                        <option value="-2">Todos</option>
                                        <option value="-1">Sin categoria</option>
                                        {categories.map((category: any) => {
                                            return <option key={category.id} value={category.id}>{category.name}</option>
                                        })}
                                    </select>
                                </div>
                            ) : null}
                        </form>
                    </div>
                    <div>
                            {
                                !productType ? showProducts(((productSearchTerm || productCategory != -2)) ? editOrderMode ? productsSearchEdit : productsSearchCreate : editOrderMode ? productsEdit : productsCreate) : showCombos(combosSearchTerm ? editOrderMode ? combosSearchEdit : combosSearchCreate : editOrderMode ? combosEdit : combosCreate)
                            }
                    </div>
                </div>
                <div className={`place-order-section ${editOrderMode ? "edit-order" : ""}`}>
                    <div>
                        <div className="order-title-card">
                            <h3>{editOrderMode ? `Orden #${editOrder.id}` : "Ordenes Pendientes"}</h3>
                        </div>
                        {!editOrderMode ? (
                            <div>
                            {pendingOrders.length ? (
                                <>
                                    {pendingOrders.map((order: any) => { 
                                        return (
                                            <OrderCard key={order.id} id={order.id} total={order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)} handleFinalizeOrder={handleFinalizeOrder} handleEditOrder={handleEditOrder} />
                                        )

                                    })}
                                </>
                            ): (
                                <div className="no-results">
                                    <h4>No hay ordenes pendientes.</h4>
                                </div>
                            )}
                        </div>
                        ) : null}
                    </div>
                    <div>
                        <div className="order-title-card">
                            <h3>Resumen</h3>
                        </div>
                        <div>
                            {getSelectedProducts(editOrderMode ? productsEdit : productsCreate).map((product: any) => <Detail key={product.id} name={product.name} qty={product.qty} price={product.price} />)}
                            {getSelectedCombos(editOrderMode ? combosEdit :combosCreate).map((combo: any) => <Detail key={combo.id} name={combo.denomination} qty={combo.qty} price={combo.price} />)}
                            {getSelectedCombos(editOrderMode ? combosEdit :combosCreate).length + getSelectedProducts(editOrderMode ? productsEdit : productsCreate).length === 0 && (
                                <div className="no-results">
                                    <h4>No hay productos seleccionados.</h4>
                                </div>
                            )}
                        </div>
                        <div className="order-title-card">
                            <h4>Total</h4>
                            <p>
                                {getTotal(productsCreate, combosCreate).toFixed(2)} BS
                            </p>
                        </div>
                        <div>
                            <button disabled={(getSelectedCombos(combosCreate).length + getSelectedProducts(productsCreate).length) === 0 && !editOrderMode || (getSelectedCombos(combosEdit).length + getSelectedProducts(productsEdit).length) === 0 && editOrderMode} onClick={() => editOrderMode ? setConfirmOrderModalEdit(true) : setConfirmOrderModal(true) }>{editOrderMode ? "Confirmar " : "Crear"} orden</button>
                            {editOrderMode ? (
                                <>
                                    <button onClick={() => handleCancelOrder(editOrder.id)}>Eliminar orden</button>
                                    <button onClick={() => cancelEditOrder()}>Cancelar edicion</button>
                                </>         
                            ): null}
                        </div>
                    </div>
                </div>
            </div>
            <Modal className="confirm-order-modal" title={"Confirmacion de orden"} showModal={confirmOrderModal && !editOrderMode || confirmOrderModalEdit && editOrderMode} onClose={() => editOrderMode ? setConfirmOrderModalEdit(false) :setConfirmOrderModal(false)}>
                <div>
                    <div>
                        <h4>¿Estas seguro que deseas {`${editOrderMode ? "editar" : "crear"}`} esta orden?</h4>
                    </div>
                    <div>
                        {getSelectedProducts(editOrderMode ? productsEdit : productsCreate).length ? (
                            <div>
                                <h4>Productos ({getSelectedProducts(editOrderMode ? productsEdit : productsCreate).reduce((acc: number, product: any) => acc + (product.qty), 0)})</h4>
                                <div className={`${getSelectedCombos(editOrderMode ? combosEdit : combosCreate).length ? "" : "max"}`}>
                                    {getSelectedProducts(editOrderMode ? productsEdit : productsCreate).map((product: any) => <Detail key={product.id} name={product.name} qty={product.qty} price={product.price} />)}
                                </div>
                            </div>
                        ) : null}
                        {getSelectedCombos(editOrderMode ? combosEdit : combosCreate).length ? (
                            <div >
                                <h4>Combos ({getSelectedCombos(editOrderMode ? combosEdit : combosCreate).reduce((acc: number, combo: any) => acc + (combo.qty), 0)})</h4>
                                <div className={`${getSelectedProducts(editOrderMode ? productsEdit : productsCreate).length ? "" : "max"}`}>
                                    {getSelectedCombos(editOrderMode ? combosEdit : combosCreate).map((combo: any) => <Detail key={combo.id} name={combo.denomination} qty={combo.qty} price={combo.price} />)}
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div>
                        
                        <div>
                            <h4>Metodo de pago</h4>
                            <select id="productPaymentType" onChange={(e) => setPaymentMethod(parseInt(e.target.value))} value={paymentMethod}>
                                <option value="1">Tarjeta</option>
                                <option value="2">QR</option>
                                <option value="3">Efectivo</option>
                            </select>
                        </div>
                        <div>
                            <h4>Tipo de orden</h4>
                            <select id="orderType" onChange={(e) => setOrderType(parseInt(e.target.value))} value={orderType}>
                                <option value="1">Orden de tienda</option>
                                <option value="2">Orden de PedidosYa</option>
                            </select>
                        </div>
                        <div>
                            <h4>Total</h4>
                            <p>
                                {getTotal(editOrderMode ? productsEdit : productsCreate, editOrderMode ? combosEdit : combosCreate).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div>
                        <button onClick={editOrderMode ? handleOrderEdition : handleCreateOrder}><FontAwesomeIcon icon={faCheck} /> &nbsp;Confirmar</button>
                        <button onClick={() => editOrderMode ? setConfirmOrderModalEdit(false) : setConfirmOrderModal(false)}><FontAwesomeIcon icon={faCancel} /> &nbsp;Cancelar</button>
                    </div>
                </div>
            </Modal>
            <Modal className="calculate-change-modal" title={"Calcular monto de cambio"} showModal={showChangeModal} onClose={() => setShowChangeModal(false)}>
                <div>
                    <div>
                        <h4>Total de la orden</h4>
                        <p>{amount.toFixed(2)} BS</p>
                    </div>
                    <div>
                        <h4>Monto de pago</h4>
                        <input type="number" value={paymentAmount} onChange={(event) => setPaymentAmount(parseFloat(event.target.value))}></input>
                    </div>
                    <div>
                        <h4>Cambio</h4>
                        <p>{calculateChange()} BS</p>
                    </div>
                    <div>
                        <button onClick={() => setShowChangeModal(false)}>
                            <FontAwesomeIcon icon={faCancel} />
                            &nbsp; Cerrar Ventana
                        </button>
                    </div>
                </div>
            </Modal>
            <ActionModal title="Alerta!" body={`¿Esta seguro que desea cancelar la orden #${orderToCancel}?`} showModal={showCancelOrderConfirmation} onConfirm={handleConfirmCancelOrder} onCancel={() => setShowCancelOrderConfirmation(false)}/>
            <ActionModal title="Alerta!" body={`¿Esta seguro que desea editar la orden #${orderToEdit}?`} showModal={showEditOrderConfirmation} onConfirm={handleConfirmEditOrder} onCancel={() => setShowEditOrderConfirmation(false)}/>
            <ActionModal title="Alerta!" body={`¿Esta seguro que desea finalizar la orden #${orderToFinalize}?`} showModal={showFinalizeOrderConfirmation} onConfirm={handleConfirmFinalizeOrder} onCancel={() => setShowFinalizeOrderConfirmation(false)} />
            <ActionModal title="Alerta!" body={`¿Desea realizar el calculo de cambio para la orden #${orderToFinalize}?`} showModal={confirmShowCalculateChange} onConfirm={handleConfirmCalculateChange} onCancel={() => setConfirmShowCalculateChange(false)}/>
        </>
    );
};

const OrderCard = ({id, total, handleFinalizeOrder, handleEditOrder} : {id: number, total: number, handleFinalizeOrder : Function, handleEditOrder : Function}) => {
    return (
        <div className="order-card">
            <div>
                <div>
                    <h3>Orden</h3>
                    <p>#{id}</p>
                </div>
                <div>
                    <h3>Total</h3>
                    <p>{total.toFixed(2)}</p>
                </div>
            </div>
            <div>
                <button onClick={() => handleEditOrder(id)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleFinalizeOrder(id)}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                </button>
            </div>
        </div>
    )
}

const Detail = ({ qty, name, price }: { qty: number, name: string, price: number }) => {
    return (
        <div className="detail-card">
            <div>
                <div>
                    <p>{qty}</p>
                </div>
            </div>
            <div>
                <p>
                    {name}
                </p>
            </div>
            <div>
                <p>
                    {(qty * price).toFixed(2)}
                </p>
            </div>
        </div>
    )
}

export default Orders;