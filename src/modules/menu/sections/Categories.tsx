import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { z } from "zod";
import { useFormik } from 'formik';
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCancel, faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import elementSearch from '../../utils/functions/elementSearch';
import Modal from '../../utils/components/modal';
import ActionModal from '../../utils/components/actionModal';
import categoryService from '../services/category';
import productService from '../services/product';

// Main component for the categories section
const Categories = () => {

  // Categories Section State Variables
  const [categories, setCategories] = useState<any>([]);
  const [categoryEdit, setCategoryEdit] = useState<any>(null);
  const [categorySearch, setCategorySearch] = useState<any[] | null>(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState<string>("");
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
  const [categoryDelete, setCategoryDelete] = useState<any | null>(null);
  const [showCategoryDelete, setShowCategoryDelete] = useState<boolean>(false);  

  // Categories Section On Mount Function
  useEffect(() => {
    (async () => {
      await loadCategories()
    })()
  }, [])
  
  // Helper function to Load all the active categories from the backend
  const loadCategories = async () => {
    let categories = await productService.loadByCategory()
    categories = categories.filter(e => {
      if (e.id !== null) {
        return e
      }
    })
    setCategories(categories)
  }

  // Helper function to search for categories using a specific term
  const handleCategorySearch = (e : any) => {
    const categoryFilter = (category : any) => {
      if(category.name.trim().toLowerCase() === e.target.value.trim().toLowerCase() || category.name.trim().includes(e.target.value.trim().toLowerCase())){
        return category;
      }
    }
    elementSearch(e, setCategorySearchTerm, setCategorySearch, categories, categoryFilter);
  }

  // Helper function that renders the categories on the table
  const showCategories = (categories : any[]) => {
    return categories.map((category : any) => {
      return (
        <tr key={category.id}>
          <td>{category.name}</td>
          <td>{category.products.length}</td>
          <td>
            <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => {setShowCategoryForm(true); setCategoryEdit(category)}}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => {setShowCategoryDelete(true); setCategoryDelete(category.id)}}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </td>
        </tr>
      )
    })
  }

  // Invoker function to set a category's status as deleted
  const deleteCategory = async () => {
      await categoryService.delete(categoryDelete);
      await loadCategories();
      setCategoryDelete(null);
      setShowCategoryDelete(false);
  }

  return (
    <>
    <div className="add-category-section section">
        <form className='form-search'>
            <div>
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="categoryName">
                Nombre de la categoria
              </label>
              <input placeholder="Buscar categorias"className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="categoryName" type="text" onChange={handleCategorySearch} value={categorySearchTerm}/>
            </div>
            <div>
              <button className="mb-2 text-white font-bold px-8 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => setShowCategoryForm(true)}>
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
              <p>No se encontraron categorias con el nombre "{categorySearchTerm}"</p>
            </div>
          )}
          {(categories != null || categorySearch != null) && (categories?.length > 0 && categorySearch == null || categorySearch != null && categorySearch?.length > 0) && (
            <table className="table-auto">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Productos Asociados</th>
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
    <Modal className={"add-category-modal"} title={categoryEdit ? "Editar categoria" : "Agregar categoria"} showModal={showCategoryForm} onClose={() => {setShowCategoryForm(false); setCategoryEdit(null)}}>
      <CategoryForm setShowCategoryForm={setShowCategoryForm} loadCategories={loadCategories} category={categoryEdit} categories={categories} setCategory={setCategoryEdit}/>
    </Modal>
    <ActionModal title="Eliminar categoria" body="¿Estas seguro que deseas eliminar esta categoria?" showModal={showCategoryDelete} onConfirm={deleteCategory} onCancel={() => setShowCategoryDelete(false)}/>
    </>
  )
}

// Component in charge of creating and editing categories.
const CategoryForm = ({setShowCategoryForm, loadCategories, category, categories, setCategory} : {setShowCategoryForm : Function, loadCategories : Function, category : any, categories : any[], setCategory : Function}) => {

  // Category State Variables
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [categorySave, setCategorySave] = useState<any>(null);

  // Create New Category Form Configuration
  const createCategory = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      try {
        let cat = categoryService.categoryValidationSchema.parse(values);
        cat.name = cat.name.toLowerCase();
        await invoke("find_by_name_category", {name: cat.name}).then((res : any) => {
          res = JSON.parse(res);
          if (res.length > 0) {
            throw new Error("Ya existe una categoria con ese nombre.");
          }
        });
        await invoke("create_category", cat).then((res) => {
          toast.success("Categoria agregada correctamente.");
        });
        await loadCategories();
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

  // Edit Category Form Configuration
  const editCategory = useFormik({
    initialValues: {
      name: category != null ? category.name : '',
    },
    onSubmit: async (values) => {
      try {
        let cat = categoryService.categoryValidationSchema.parse(values);
        cat.name = cat.name.toLowerCase();
        let filtered = categories.filter((el : any) => { if (el.name.trim().toLowerCase() === cat.name.trim().toLowerCase() && el.id !== category.id) return el; });
        if (filtered.length > 0 && category.id !== filtered[0].id) {
          throw new Error("Ya existe una categoria con ese nombre.");
        }
        if (cat.name !== category.name) {
          setShowConfirm(true)
          setCategorySave(cat)
        } else {
          setShowConfirm(false);
          setShowCategoryForm(false);
        }
      } catch(e: any) {
        if (typeof e.issues !== "undefined"){
          toast.error(e.issues[0].message);
        } else {
          toast.error(e.message);
        }
      }
    }
  })

  // Invoker function that will update the selected category
  const confirmEditCategory = async () => {
    await categoryService.update({id: category.id, name: categorySave.name})
    await loadCategories();
    setShowConfirm(false);
    setShowCategoryForm(false);
  }

  // Helper function to close the modal in case of cancelation
  const cancelEditCategory = () => {
    setShowCategoryForm(false);
    setCategory(null);
  }

  return (
    <>
      <div>
        <form onSubmit={category ? editCategory.handleSubmit : createCategory.handleSubmit}>
          <div>
            <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="addCategoryName">
              {`Nombre de la categoria ${category ? editCategory.values.name.length > 0 ? `(${editCategory.values.name.length})`: "" : createCategory.values.name.length > 0 ? `(${createCategory.values.name.length})` : ""}`} <span>(*)</span>
            </label>
            <input className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="addCategoryName" type="text" value={category === null ? createCategory.values.name : editCategory.values.name} onChange={category === null ? createCategory.handleChange("name") : editCategory.handleChange("name")}/>
          </div>
          <div className="flex flex-row form-submit">
            <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                <FontAwesomeIcon icon={faSave} />
                &nbsp;{category ? "Guardar" : "Agregar"}
            </button>
            <button className="text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={cancelEditCategory}>
                <FontAwesomeIcon icon={faCancel} />
                &nbsp; Cancelar
            </button>
          </div>
        </form>
      </div>
      <ActionModal title={"Guardar cambios"} body={"¿Desea confirmar los cambios realizados a la categoria?"} showModal={showConfirm} onConfirm={confirmEditCategory} onCancel={() => setShowConfirm(false) } className={"confirm-modal"} />
    </>
  )
}

export default Categories
export {CategoryForm}