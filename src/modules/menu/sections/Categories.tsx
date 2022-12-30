import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { z } from "zod";
import { useFormik } from 'formik';
import {toast} from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faSave } from '@fortawesome/free-solid-svg-icons';

const Categories = () => {

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState<string>("");
  const [categoryEdit, setCategoryEdit] = useState<any>(null);
  const [categorySearch, setCategorySearch] = useState<any[] | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
  const [categoryDelete, setCategoryDelete] = useState<any | null>(null);

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

  const deleteCategory = async () => {
    
    try {
      await invoke("delete_category", {id: categoryDelete}).then((res) => {
        toast.success("Categoria eliminada correctamente.");
      });
      await getCategories();
      setCategoryDelete(null);
    } catch(e: any) {
      toast.error(e.message);
    }
  }

  const cancelDeleteCategory = () => {
    setCategoryDelete(null);
  }

  const handleCategory = (e : any) => {
    console.log(e.target.value)
    if(e.target.value.trim()){
      let cat = categories.filter((el : any) => {
        if (el.name.trim().toLowerCase() === e.target.value.trim().toLowerCase() || el.name.trim().includes(e.target.value.trim().toLowerCase())){
          console.log(el.name.toLowerCase() + " = " + e.target.value.toLowerCase())
          return el;
        } 
      })
      console.log(cat)
      setCategorySearch(cat);
      setCategory(e.target.value);
    } else {
      setCategory(e.target.value);
      setCategorySearch(null)
    }
  }

  const showCategories = (categories : any[]) => {
    return categories.map((category : any) => {
      return (
        <tr key={category.id}>
          <td>{category.name}</td>
          <td>{category.updated_at == null ? new Date(category.created_at).toLocaleString() : new Date(category.updated_at).toLocaleString()}</td>
          <td>
            <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => editCategory(category)}>
              Editar
            </button>
            <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => setCategoryDelete(category.id)}>
              Eliminar
            </button>
          </td>
        </tr>
      )
    })
  }

  const addCategory = () => {
    setShowCategoryForm(true);
    setCategoryEdit(null);
  }

  const editCategory = (c : object) => {
    setShowCategoryForm(true);
    setCategoryEdit(c);
  }

  return (
    <>
    <div className="add-category-section section">
        <form className='form-search'>
            <div>
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="categoryName">
                Nombre de la categoria
              </label>
              <input placeholder="Buscar categorias"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="categoryName" type="text" onChange={handleCategory} value={category}/>
            </div>
            <div>
              <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={ addCategory}>
                  <FontAwesomeIcon icon={faAdd} />
                  &nbsp;Agregar categoria
              </button>
            </div>
        </form>
        <div className="table item-table">
          {categories.length == 0 && categorySearch == null && (
            <div>
              <p>No hay categorias registradas.</p>
            </div>
          )}
          {categorySearch != null && categorySearch.length == 0 && (
            <div>
              <p>No hay resultados para la busqueda.</p>
            </div>
          )}
          {(categories != null || categorySearch != null) && (categories?.length > 0 && categorySearch == null || categorySearch != null && categorySearch?.length > 0) && (
            <table className="table-auto">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ultima actualizacion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories != null && categorySearch == null && showCategories(categories)}
                {categorySearch != null && showCategories(categorySearch)}
              </tbody>
            </table>
          )}
        </div>
    </div>
    {showCategoryForm && <CategoryForm setShowCategoryForm={setShowCategoryForm} getCategories={getCategories} category={categoryEdit} categories={categories}/>}
    {categoryDelete != null && <CategoryDelete title={"Eliminar categoria"} body={"¿Estas seguro de eliminar esta categoria?"} onConfirm={deleteCategory} onCancel={cancelDeleteCategory}/>}
    </>
  )
}


const CategoryDelete = ({title, body, onConfirm, onCancel} : {title: string, body : string, onConfirm : any, onCancel : any}) => {
  const bgClose = (e : any) => {
    const modal = document.getElementById("modal-wrapper");
    if (e.target === modal){
      onCancel();
    }
  }

  return (
    <div className='modal' id='modal-wrapper' onClick={bgClose}>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>{title}</h2>
        </div>
        <div className='modal-body'>
          <p>{body}</p>
        </div>
        <div className='modal-footer'>
          <button className='btn btn-cancel' onClick={onCancel}>Cancelar</button>
          <button className='btn btn-confirm' onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}

const CategoryForm = ({setShowCategoryForm, getCategories, category, categories} : {setShowCategoryForm : Function, getCategories : Function, category : any, categories : any[]}) => {

  const Category = z.object({
    name: z.string().trim()
    .max(20, {message: "El nombre de la categoria debe ser menor o igual a 20 caracteres."}).min(1, {message: "El nombre de la categoria es requerido."}),
  })

  const editCategory = useFormik({
    initialValues: {
      name: category != null ? category.name : '',
    },
    onSubmit: async (values) => {
      let cat = Category.parse(values);
      cat.name = cat.name.toLowerCase();
      try {
        let filtered = categories.filter((el : any) => { if (el.name.trim().toLowerCase() === cat.name.trim().toLowerCase() && el.id !== category.id) return el; });
        if (filtered.length > 0 && category.id !== filtered[0].id) {
          throw new Error("Ya existe una categoria con ese nombre.");
        }
        await invoke("update_category", {id: category.id, name: cat.name});
        toast.success("Categoria actualizada con exito.");
        await getCategories();
        setShowCategoryForm(false);
      } catch(e: any) {
        if (typeof e.issues !== "undefined"){
          toast.error(e.issues[0].message);
        } else {
          toast.error(e.message);
        }
      }
    }
  })

  const createCategory = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      try {
        let cat = Category.parse(values);
        cat.name = cat.name.toLowerCase();
        await invoke("find_by_name_category", {name: cat.name}).then((res : any) => {
          res = JSON.parse(res);
          if (res.length > 0) {
            throw new Error("Ya existe una categoria con ese nombre.");
          }
        });
        await invoke("create_category", cat).then((res) => {
          toast.success("Categoria agregada correctamente.");
          createCategory.resetForm();
        });
        await getCategories();
        setShowCategoryForm(false);
      } catch(e: any ) {
        if (typeof e.issues !== "undefined"){
          toast.error(e.issues[0].message);
        } else {
          toast.error(e.message);
        }
      }
    }
  })

  const bgClose = (e : any) => {
    const modal = document.getElementById("add-category-modal");
    if (e.target === modal){
      setShowCategoryForm(false);
    }
  }

  return (
    <div className='add-category-modal modal' id="add-category-modal" onClick={bgClose}>
      <div>
        <h1 className="text-2xl font-bold">Agregar categoria</h1>
        <form onSubmit={category === null ? createCategory.handleSubmit : editCategory.handleSubmit}>
          <div>
            <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="addCategoryName">
              Nombre de la categoria
            </label>
            <input className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="addCategoryName" type="text" value={category === null ? createCategory.values.name : editCategory.values.name} onChange={category === null ? createCategory.handleChange("name") : editCategory.handleChange("name")}/>
          </div>
          <div>
            <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
                <FontAwesomeIcon icon={faSave} />
                &nbsp;{category === null ? "Agregar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Categories