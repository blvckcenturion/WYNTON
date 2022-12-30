import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { invoke } from '@tauri-apps/api'
import { z } from "zod"
import { useFormik } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { open } from '@tauri-apps/api/dialog';
import { faFileCirclePlus, faFileImage, faAdd} from '@fortawesome/free-solid-svg-icons'

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState<string>("");
  const [productSearch, setProductSearch] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        let res : string = await invoke("get_all_category");
        let cat : any = JSON.parse(res);
        setCategories(cat);
      } catch(e: any) {
        toast.error(e.message);
      }
    })()
  }, [])

  const Product = z.object({
    name: z.string().trim().max(50, {message: "El nombre del producto debe ser menor o igual a 50 caracteres."}).min(1, {message: "El nombre del producto es requerido."}),
    price: z.number({
      invalid_type_error: "El precio debe ser un numero valido.",
      required_error: "El precio del producto es requerido."
    }).min(0, {message: "El precio del producto debe ser mayor o igual a 0."}).positive({message: "El precio del producto debe ser mayor o igual a 0."}),
    description: z.string().max(100, {message: "La descripcion del producto debe ser menor o igual a 100 caracteres."}).trim(),
    category_id: z.number({
      invalid_type_error: "La categoria debe ser un numero valido.",
      required_error: "La categoria del producto es requerida."
    }).min(-1, {message: "La categoria del producto es requerida."}),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      category_id: -1,
    },
    onSubmit: async (values) => {
      try {
        let prod = Product.parse(values); 
        prod.name = prod.name.toLowerCase();
        prod.description = prod.description.toLowerCase(); 
        // let res : string = await invoke("add_product", formik.values);
        // let product : any = JSON.parse(res);
        // toast.success("Producto agregado exitosamente");
      } catch(e: any) {
        if (typeof e.issues !== "undefined"){
          toast.error(e.issues[0].message);
        } else {
          toast.error(e.message);
        }
      }
    }
  })

  const handleImage = async () => {
    try {
      let res : any = await open({
        multiple: false,
        directory: false,
        filters: [
          { name: 'Image', extensions: ['jpg', 'png', 'jpeg'] }
        ]
      });

      if(res == null) {
        setPhoto("");
      } else {
        setPhoto(res);
      }
    } catch ( e: any) {
      toast.error(e.message);  
    }
  }

  const addProduct = async () => {
    console.log('hola')
  }

  const handleProductSearch = (e: any) => {
    setProductSearch(e.target.value);
  }

  return (
    <>
      <div className="add-product-section section">
        <form className='form-search'>
              <div>
                <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                  Nombre del producto
                </label>
                <input placeholder="Buscar productos"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text" onChange={handleProductSearch} value={productSearch}/>
              </div>
              <div>
                <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={ addProduct}>
                    <FontAwesomeIcon icon={faAdd} />
                    &nbsp;Agregar producto
                </button>
              </div>
          </form>
          <div className='table item-table'>
            <table className='table-auto'>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Descripcion</th>
                  <th>Categoria</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>

        {/* <div>
          <h2>Agregar un nuevo producto.</h2>
        </div> */}
        {/* <form className="px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productName">
                Nombre del producto
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productName" type="text" onChange={formik.handleChange("name")} value={formik.values.name}/>
            </div>
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productPrice">
                Precio del producto
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productPrice" type="number" step="0.01" onChange={formik.handleChange("price")} value={formik.values.price}/>
            </div>
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productDescription">
                Descripcion del producto
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productDescription" type="text" onChange={formik.handleChange("description")} value={formik.values.description}/>
            </div>
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="productCategory">
                Categoria del producto
              </label>
              <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="productCategory" onChange={formik.handleChange("category_id")} value={formik.values.category_id}>
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
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline photo" id="productPhoto" onClick={handleImage}>
                {photo.length == 0 && (
                  <>
                    <FontAwesomeIcon icon={faFileCirclePlus}></FontAwesomeIcon>
                    <p>Escoger imagen</p>
                  </>
                )}
                {photo && photo.length > 0 && (
                  <>
                    <FontAwesomeIcon icon={faFileImage}></FontAwesomeIcon>
                    
                    <p>{photo.toString()?.slice(-100)}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between flex-col">
              <button className="text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
                Agregar
              </button>
            </div>
        </form> */}
      </div>
    </>
  )
}

export default Products