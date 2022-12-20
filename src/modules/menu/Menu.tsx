import { useState } from "react";
import AddCategory from "./sections/AddCategory";
import AddProduct from "./sections/AddProduct";
import ViewMenu from "./sections/ViewMenu";

const Menu = () => {
    const [tab, setTab] = useState(1)

    const handleToggle = (t : number) => {
        setTab(t)
    }

    const Render = () => {
        switch(tab){
            case 1:
                return <ViewMenu/>
            case 2:
                return <AddProduct/>
            case 3:
                return <AddCategory/>
        }
    }

    return (
        <div className="menu-module">
            <div>
                <button className={tab == 1 && "active"} onClick={() => handleToggle(1)} >Menu</button>
                <button className={tab == 2 && "active"} onClick={() => handleToggle(2)} >Agregar Producto</button>
                <button className={tab == 3 && "active"} onClick={() => handleToggle(3)}>Agregar Categoria</button>
            </div>
            <div>
                <Render/>
            </div>
        </div>
    )
}

export default Menu;