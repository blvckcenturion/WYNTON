import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import Logo from "../assets/logo";
import { useRouter } from "next/router";

function App() {
  const router = useRouter();
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async () => {
    router.push("/dashboard/");
  }

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
          <p className="text-accent-1">Por favor ingresa tus credenciales.</p>
          <form className="px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="username">
                Email
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text"/>
            </div>
            <div className="mb-6">
              <label className="block text-accent-1 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password"/>
            </div>
            <div className="flex items-center justify-between flex-col">
              <button onClick={handleLogin} className="text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="button">
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

export default App;

