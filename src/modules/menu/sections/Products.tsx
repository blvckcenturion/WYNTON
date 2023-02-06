import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { invoke } from '@tauri-apps/api'
import { z } from "zod"
import { useFormik } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { faFileCirclePlus, faAngleUp, faAngleDown, faFileImage, faAdd, faSave, faTrash, faEdit, faCancel} from '@fortawesome/free-solid-svg-icons'
import Modal from '../../utils/components/modal'
import createImage from '../../utils/functions/createImage'
import { exists } from '@tauri-apps/api/fs'
import capitalize from '../../utils/functions/capitalize'
import elementSearch from '../../utils/functions/elementSearch'
import ActionModal from '../../utils/components/actionModal'
import productService from '../services/product'
import categoryService from '../services/category'


// Main component for the products section 
const Products = () => {

  // Products Section State Variables
  const [categories, setCategories] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState<any[] | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState<string>("");
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [showProductDelete, setShowProductDelete] = useState<boolean>(false);
  const [productDelete, setProductDelete] = useState<number | null>(null);
  const [productEdit, setProductEdit] = useState<object | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orderBy, setOrderBy] = useState<string>("name");
  const [orderAsc, setOrderAsc] = useState<boolean>(true);

  // Products Section On Mount Function
  useEffect(() => {
    (async () => {
        await loadProducts();
        const categories : any[] = await categoryService.load();
        setCategories(categories);
    })()
  }, [])
  
  // Helper function to Load all the active products from the backend and set the state
  const loadProducts = async () => {
    const products : any[] = await productService.load(orderBy, orderAsc ? "asc" : "desc");
    setProducts(products);
  }

  // Helper function to search for products using a specific term
  const handleProductSearch = (e: any) => {
    const productFilter = (product: any) => {
      if(product.name.trim().toLowerCase() === e.target.value.trim().toLowerCase() || product.name.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())){
        return product;
      }
    }
    elementSearch(e, setProductSearchTerm, setProductSearch, products, productFilter)
  }

  // Helper function that renders the products on the table
  const showProducts = (products : any[]) => {
    return products.map((product : any) => {
      return (
        <tr key={product.id}>
          <td>{capitalize(product.name)}</td>
          <td>{product.price}</td>
          <td>{product.description ? capitalize(product.description) : "N/A"}</td>
          <td>{product.category?.name ? capitalize(product.category.name) : "N/A"}</td>
          <td>
            <div>
              {product.photo && (
                <img src={product.photo} alt={product.name} />
              )}
              {!product.photo && (
                <>
                  <FontAwesomeIcon icon={faFileImage} />
                  <br />
                  Sin imagen.
                </>
              )}
            </div>
          </td>
          <td>
            <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => {setProductEdit(product); setShowProductForm(true)}}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => {setShowProductDelete(true); setProductDelete(product.id);}}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </td>
        </tr>
      )
    })
  }

  // Invoker function to set a product's status as deleted
  const deleteProduct = async () => {
    if (productDelete !== null) await productService.delete(productDelete)
    await loadProducts()
    setShowProductDelete(false)
  }

  const handleProductLoadChange = async (orderByChange? : any, orderAscChange? : boolean) => {
    console.log('pe')
    if(orderAscChange != null){ 
      setOrderAsc(orderAscChange)
    } 
    if(orderByChange != null){
      setOrderBy(orderByChange)
    }

    console.log("handleProductLoadChange")
    console.log("orderBy: ", orderBy)
    console.log("orderAsc: ", orderAsc)
    
    await loadProducts()
  }

  return (
    <>
      <div className="add-product-section section">
        <form className='form-search'>
              <div>
                <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                  Nombre del producto
                </label>
                <input placeholder="Buscar productos"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text" onChange={handleProductSearch} value={productSearchTerm}/>
              </div>
              <div>
                <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={ () => setShowProductForm(true)}>
                    <FontAwesomeIcon icon={faAdd} />
                    &nbsp;Agregar producto
                </button>
              </div>
          </form>
          <div className='table item-table'>
            {products.length == 0 && productSearch == null && (
              <div className="text-center">
                <p>No hay productos registrados.</p>
              </div>
            )}

            {productSearch != null && productSearch.length == 0 && (
              <div>
                <p>No se encontraron productos con el nombre "{productSearchTerm}"</p>
              </div>
            )}
            {(products != null || productSearch != null) && (products?.length > 0 && productSearch == null|| productSearch != null && productSearch?.length > 0) && (
              <table className='table-auto'>
                <thead>
                  <tr>
                    <th className={orderBy === "name" ? "active" : ""} onClick={() => handleProductLoadChange(orderBy !== "name" ? "name" : null, orderBy !== "name" ? true : !orderAsc )}>Nombre&nbsp;{orderBy === "name" && <FontAwesomeIcon icon={orderAsc ? faAngleUp : faAngleDown }/>}</th>
                    <th className={orderBy === "price" ? "active" : ""} onClick={() => handleProductLoadChange(orderBy !== "price" ? "price" : null, orderBy !== "price" ? true : !orderAsc)}>Precio&nbsp;{orderBy === "price" && <FontAwesomeIcon icon={orderAsc ? faAngleUp : faAngleDown }/>}</th>
                    <th>Descripcion</th>
                    <th className={orderBy === "category" ? "active" : ""} onClick={() => handleProductLoadChange(orderBy !== "category" ? "category" : null, orderBy  !== "category" ? true : !orderAsc)}>Categoria&nbsp;{orderBy === "category" && <FontAwesomeIcon icon={orderAsc ? faAngleUp : faAngleDown }/>}</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products != null && productSearch == null && showProducts(products)}
                  {productSearch != null && showProducts(productSearch)}
                </tbody>
            </table>
            )}
          </div>
      </div>
      <Modal className={"add-product  -modal"} title={productEdit ? "Editar producto" : "Agregar producto"} showModal={showProductForm} onClose={() => {setShowProductForm(false); setProductEdit(null);} }>
        <ProductForm products={products} product={productEdit} loadProducts={loadProducts} categories={categories} setShowProductForm={setShowProductForm} setProduct={setProductEdit}/>
      </Modal>
      <ActionModal title="Eliminar producto" body="¿Esta seguro que desea eliminar este producto?" showModal={showProductDelete} onConfirm={deleteProduct} onCancel={() => setShowProductDelete(false)}/>
    </>
  )
}

// Component in charge of creating and editing products.
const ProductForm = ({ categories, setShowProductForm, loadProducts, product, products, setProduct}: { categories: any[], setShowProductForm : Function, loadProducts : Function, product : any | null, products: any[], setProduct : Function}) => {
  
  // Product Form State Variables
  const [photo, setPhoto] = useState<string>("");
  const [photoSrc, setPhotoSrc] = useState<string>("");
  const [photoReplaced, setPhotoReplaced] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [productSave, setProductSave] = useState<any>(null);

  // Product Form On Mount Function
  useEffect(() => {
    if(product && product.photo) {
      setPhoto(product.photo)
      setPhotoSrc(product.photo)
    }
  }, [])

  // Create New Product Form Configuration
  const createProduct = useFormik({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      categoryId: "-1",
    },
    onSubmit: async (values) => {
      try {
        let prod = productService.productValidationSchema.parse({...values, categoryId: parseInt(values.categoryId)}); 
        prod.name = prod.name.toLowerCase();
        prod.description = prod.description?.toLowerCase();
        prod.categoryId = prod.categoryId === -1 ? undefined : prod.categoryId;
      
        await invoke("find_by_name_product", {name: prod.name}).then((res : any) => {
          res = JSON.parse(res)
          if (res.length > 0) {
            throw new Error("Ya existe un producto con ese nombre.")
          }
        })

        if(photo !== "" && photoSrc !== "") {
          prod.photo = await createImage("products", photoSrc);     
        }
        let res : string = await invoke("create_product", prod);
        
        let product : any = JSON.parse(res);
        if (product){
          toast.success("Producto agregado exitosamente");
          loadProducts();
          setShowProductForm(false);
        } else {
          toast.error("No se pudo agregar el producto");
        }
      } catch(e: any) {
        console.log(e)
        if (typeof e.issues !== "undefined"){
          toast.error(e.issues[0].message);
        } else {
          toast.error(e.message);
        }
      }
    }
  })

  // Edit Product Form Configuration
  const editProduct = useFormik({
    initialValues: {
      name: product?.name || "",
      price: product?.price || 0,
      description: product?.description || "",
      categoryId: product?.category_id || -1,
    }, 
    onSubmit: async (values) => {
      try {
        let prod = productService.productValidationSchema.parse({...values, categoryId: parseInt(values.categoryId)});
        prod.name = prod.name.toLowerCase();
        prod.description = prod.description?.toLowerCase();
        prod.categoryId = prod.categoryId === -1 ? null : prod.categoryId;

        let filtered = products.filter((el : any) => {if (el.name.trim().toLowerCase() == prod.name.trim().toLowerCase() && el.id !== product.id) return el} );

        if (filtered.length > 0 && product.id !== filtered[0].id) {
          throw new Error("Ya existe un producto con ese nombre.");
        }

        if(prod.name !== product.name || prod.price !== product.price || prod.description !== product.description || prod.categoryId !== product.category_id || photoReplaced) {
          setProductSave(prod);
          setShowConfirm(true);
        } else {
          setShowProductForm(false);
        }
        
      } catch (e: any) {
        console.log(e)
        if (typeof e.issues !== "undefined"){
          toast.error(e.issues[0].message);
        } else {
          toast.error(e.message);
        }
      }
    }
  })  

  // Helper function that allows to upload pictures to later be saved
  const handleImage = async () => {
    try {
      let res : any = await open({
        multiple: false,
        directory: false,
        filters: [
          { name: 'Image', extensions: ['jpg', 'png', 'jpeg'] }
        ]
      });
      console.log(res)
      console.log(convertFileSrc(res));
      if(res == null) {
        setPhoto("");
        setPhotoSrc("");
      } else {
        setPhoto(convertFileSrc(res));
        setPhotoSrc(res)
      }

      if(product) {
        setPhotoReplaced(true);
      }

    } catch ( e: any) {
      toast.error(e.message);  
    }
  }

  // Invoker function that will update the selected product
  const confirmEditProduct = async () => {
    let prod = productSave;

    if (photoReplaced && photo != "" && photoSrc != "") {
      prod.photo = await createImage("products", photoSrc);
    } else {
      prod.photo = null;
    }
    await productService.update({id: product?.id, name: prod.name, description: prod.description, price: prod.price, categoryId: prod.categoryId, photo: photoReplaced ? prod.photo : product.photo_path})

    loadProducts();
    setShowProductForm(false);
  }

  // Helper function to close the modal in case of cancelation
  const cancelEditProduct = () => {
    setShowProductForm(false);
    setProduct(null);
  }


  return (
    <>
      <div>
        <form onSubmit={product !== null ? editProduct.handleSubmit : createProduct.handleSubmit}>
              <div className="mb-1">
                <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                  {`Nombre del producto ${product ? editProduct.values.name.length > 0 ? `(${editProduct.values.name.length})` : ""  : createProduct.values.name.length > 0 ? `(${createProduct.values.name.length})` : ""}`}<span>(*)</span>
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text" onChange={product ? editProduct.handleChange("name") :createProduct.handleChange("name")} value={product ? editProduct.values.name : createProduct.values.name}/>
              </div>
              <div className="mb-1">
                <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productPrice">
                  Precio del producto <span>(*)</span>
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productPrice" type="number" step="0.01" onChange={product ? editProduct.handleChange("price") :createProduct.handleChange("price")} value={product ? editProduct.values.price :createProduct.values.price}/>
              </div>
              <div className="mb-1">
                <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productDescription">
                  {`Descripcion del producto ${product ? editProduct.values.description.length > 0 ? `(${editProduct.values.description.length})` : ""  : createProduct.values.description.length > 0 ? `(${createProduct.values.description.length})` : ""} `}
                </label>
                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productDescription" onChange={product ? editProduct.handleChange("description") :createProduct.handleChange("description")} value={product ? editProduct.values.description :createProduct.values.description}/>
              </div>
              <div className="mb-1">
                <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productCategory">
                  Categoria del producto
                </label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productCategory" onChange={product ? editProduct.handleChange("categoryId") :createProduct.handleChange("categoryId")} value={product ? editProduct.values.categoryId :createProduct.values.categoryId}>
                  <option value="-1">Sin categoria</option>
                  {categories.map((category: any) => {
                    return <option key={category.id} value={category.id}>{category.name}</option>
                  })}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productDescription">
                  Imagen del producto
                </label>
                <div className={`photo ${photo.length > 0 ? "active" : "non-active"}`} id="productPhoto">
                  {photo.length == 0 && (
                    <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onClick={handleImage}>
                      <FontAwesomeIcon icon={faFileCirclePlus}/>
                      <p>Escoger imagen</p>
                    </div>
                  )}
                  {photo && photo.length > 0 && (
                    <div>
                      <div className="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <img src={photo} alt="product" />
                      </div>
                      <div>
                        <button className={`${photo.length > 0 ? "active" : ""}`} type="button" onClick={() => { setPhoto(""); setPhotoSrc(""); setPhotoReplaced(true) }}>
                          <FontAwesomeIcon icon={faTrash}/>
                          &nbsp;Eliminar
                        </button>
                        <button className={`${photo.length > 0 ? "active" : ""}`} type="button" onClick={handleImage}>
                          <FontAwesomeIcon icon={faEdit}/>
                          &nbsp;Editar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row form-submit">
                <button className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  <FontAwesomeIcon icon={faSave} />
                  &nbsp;{product ? "Guardar" : "Agregar"}
                </button>
                <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={cancelEditProduct}>
                  <FontAwesomeIcon icon={faCancel} />
                  &nbsp;Cancelar
                </button>
              </div>
          </form>
      </div>
      <ActionModal title={"Guardar cambios"} body={"¿Desea confirmar los cambios realizados al producto?"} showModal={showConfirm} onConfirm={confirmEditProduct} onCancel={() => setShowConfirm(false)} className={"confirm-modal"}/>
    </>
  )
}

export default Products;
export { ProductForm };