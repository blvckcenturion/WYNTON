import { useRouter } from "next/router";
import Logo from "../../assets/logo";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import authService from "./services/auth";
import { useEffect } from "react";
import userLogService from "./services/userLog";
import bcrypt from "bcryptjs";
function Login() {
    
    const router = useRouter();

  useEffect(() => { 
    let pass = bcrypt.hashSync("sexoman", 10)
    console.log(pass)
    const user = localStorage.getItem("userId")
    if (user) {
      localStorage.removeItem("userId")
    }
  }, [])

    const login = useFormik({
        initialValues: {
          username: "",
          password: "",
        },
        onSubmit: async (values) => {
          try {
            let l = authService.loginSchema.parse(values);
            
            const user = await authService.login(l.username, l.password);
            
            if (user) { 
              localStorage.setItem("userId", user.id);
              let log = await userLogService.createLog(user.id)
              if (log) {
                router.push("/dashboard/");
              }
            } else {
              throw new Error("El usuario o la contraseña son incorrectos.");
            }
          } catch (e: any) {
            console.log(e)
            if (typeof e.issues !== "undefined") {
              toast.error(e.issues[0].message);
              } else {
              toast.error(e.message);
            }
          }
        }
      })

    return (
        <div className="login-page page">
          <div>
            <div>
              <div>
                <Logo/>
                <h1 className="text-primary">WYNTON</h1>
              </div>
            </div>
            <div>
              <h2 className="text-primary">
                Bienvenido.
              </h2>
              <p>Por favor ingresa tus credenciales.</p>
              <form className="px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="username">
                    Nombre de Usuario
                  </label>
                  <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={login.values.username} onChange={login.handleChange("username")}  id="username" type="text"/>
                </div>
                <div className="mb-6">
                  <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="password">
                    Contraseña
                  </label>
                  <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" value={login.values.password} onChange={login.handleChange("password")} type="password"/>
                </div>
                <div className="flex items-center justify-between flex-col">
                  <button onClick={() => login.handleSubmit()} className="text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="button">
                    Iniciar Sesion
                  </button>
                </div>
              </form>
            </div>
            <div>
              <p>© WYNTON 2022</p>
            </div>
          </div>
          <div/>
        </div>
      );
}

export default Login