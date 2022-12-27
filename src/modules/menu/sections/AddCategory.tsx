import { invoke } from '@tauri-apps/api/tauri';
import { z } from "zod";
import { useFormik } from 'formik';
import {toast} from "react-toastify";

const AddCategory = () => {

  const Category = z.object({
    name: z.string()
    .max(20, {message: "El nombre de la categoria debe ser menor o igual a 20 caracteres."}).min(1, {message: "El nombre de la categoria es requerido."})
    .trim(),
  })
  
  const formik = useFormik({
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
          formik.resetForm();
        });
      } catch(e: any ) {
        if (typeof e.issues !== "undefined"){
          toast.error(e.issues[0].message);
        } else {
          toast.error(e.message);
        }
      }
    }
  })

  return (
    <div className="add-category-section">
        <div>
          <h2>Agregar una nueva categoria.</h2>
        </div>
        <form className="px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="categoryName">
                Nombre de la categoria
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="categoryName" type="text" onChange={formik.handleChange("name")} value={formik.values.name}/>
            </div>
            <div className="flex items-center justify-between flex-col">
              <button className="text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
                Agregar
              </button>
            </div>
        </form>
    </div>
  )
}

export default AddCategory