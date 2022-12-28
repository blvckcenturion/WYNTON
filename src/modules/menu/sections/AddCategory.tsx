import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { z } from "zod";
import { useFormik } from 'formik';
import {toast} from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const AddCategory = () => {

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState<string>("");
  const [categorySearch, setCategorySearch] = useState(null);

  useEffect(() => {
    (async () => {
      await getCategories();
    })()
  }, [])

  const getCategories = async () => {
    try {
      let res : string = await invoke("get_all_category");
      let cat : any = JSON.parse(res);
      setCategories(cat);
      console.log(cat);
    } catch(e: any) {
      toast.error(e.message);
    }
  }

  // const Category = z.object({
  //   name: z.string().trim()
  //   .max(20, {message: "El nombre de la categoria debe ser menor o igual a 20 caracteres."}).min(1, {message: "El nombre de la categoria es requerido."}),
  // })
  
  // const formik = useFormik({
  //   initialValues: {
  //     name: '',
  //   },
  //   onSubmit: async (values) => {
  //     try {
  //       let cat = Category.parse(values);
  //       cat.name = cat.name.toLowerCase();
  //       await invoke("find_by_name_category", {name: cat.name}).then((res : any) => {
  //         res = JSON.parse(res);
  //         if (res.length > 0) {
  //           throw new Error("Ya existe una categoria con ese nombre.");
  //         }
  //       });
  //       await invoke("create_category", cat).then((res) => {
  //         toast.success("Categoria agregada correctamente.");
  //         formik.resetForm();
  //       });
  //       await getCategories();
  //     } catch(e: any ) {
  //       if (typeof e.issues !== "undefined"){
  //         toast.error(e.issues[0].message);
  //       } else {
  //         toast.error(e.message);
  //       }
  //     }
  //   }
  // })

  const handleDelete = async (id : number) => {
    try {
      await invoke("delete_category", {id}).then((res) => {
        toast.success("Categoria eliminada correctamente.");
      });
      await getCategories();
    } catch(e: any) {
      toast.error(e.message);
    }
  }

  const handleCategory = (e) => {
    let cat = categories.filter(el => el.name.toLowerCase() == e.target.value.toLowerCase() || el.name.includes(category))
    setCategorySearch(cat);
    setCategory(e.target.value);
    
    // console.log(categorySearch )
    // let cat = categories.map(e => {
    //   if(e.name.toLowerCase()) {

    //   }
    // })
  }

  const showCategories = (categories) => {
    return categories.map((category : any) => {
      return (
        <tr key={category.id}>
          <td>{category.id}</td>
          <td>{category.name}</td>
          <td>{category.updated_at == null ? new Date(category.created_at).toLocaleString() : new Date(category.updated_at).toLocaleString()}</td>
          <td>
            <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
              Editar
            </button>
            <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="submit" onClick={() => handleDelete(category.id)}>
              Eliminar
            </button>
          </td>
        </tr>
      )
    })
  }


  return (
    <div className="add-category-section">
        <form>
            <div>
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="categoryName">
                Nombre de la categoria
              </label>
              <input placeholder="Buscar categorias..."className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="categoryName" type="text" onChange={handleCategory} value={category}/>
            </div>
            <div>
              <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
                  <FontAwesomeIcon icon={faAdd} />
                  &nbsp;Agregar categoria
              </button>
            </div>
        </form>
        <div className="table">
          <table className="table-auto">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ultima actualizacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories != null && showCategories(categories)}
              {/* {categorySearch != null && } */}
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default AddCategory