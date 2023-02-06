import { useState } from "react";
import Categories from "./sections/Categories";
import Combos from "./sections/Combos";
import Products from "./sections/Products";
import ViewMenu from "./sections/ViewMenu";

const Menu = () => {
    const [tab, setTab] = useState(1)

    const handleToggle = (t : number) => {
        setTab(t)
    }

    const Render = () : JSX.Element => {
        switch(tab){
            case 1:
                return <ViewMenu/>
            case 2:
                return <Products/>
            default:
                return <Categories/>
        }
    }

    return (
        <div className="menu-module">
            <div>
                <button className={tab == 1 ? "active" : undefined} onClick={() => handleToggle(1)} >Menu</button>
                <button className={tab == 2 ? "active" : undefined} onClick={() => handleToggle(2)} >Productos</button>
                <button className={tab == 3 ? "active" : undefined} onClick={() => handleToggle(3)}>Categorias</button>
            </div>
            <div>
                <Render/>
            </div>
        </div>
    )
}

export default Menu;