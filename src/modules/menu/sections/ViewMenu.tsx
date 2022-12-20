const ViewMenu = () => {

    const categories = [
        {
            id: 1,
            name: "Entradas",
            products: [
                {
                    id: 1,
                    name: "Ceviche",
                    price: 10.00,
                    description: "Ceviche de pescado",
                    photo: "https://t1.rg.ltmcdn.com/es/posts/7/4/1/ceviche_peruano_18147_orig.jpg"
                },
                {
                    id: 2,
                    name: "Ceviche",
                    price: 10.00,
                    description: "Ceviche de pescado",
                    photo: "https://t1.rg.ltmcdn.com/es/posts/7/4/1/ceviche_peruano_18147_orig.jpg"
                },
                {
                    id: 3,
                    name: "Ceviche",
                    price: 10.00,
                    description: "Ceviche de pescado",
                    photo: "https://t1.rg.ltmcdn.com/es/posts/7/4/1/ceviche_peruano_18147_orig.jpg"
                },
                {
                    id: 4,
                    name: "Ceviche",
                    price: 10.00,
                    description: "Ceviche de pescado",
                    photo: "https://t1.rg.ltmcdn.com/es/posts/7/4/1/ceviche_peruano_18147_orig.jpg"
                },
                {
                    id: 5,
                    name: "Ceviche",
                    price: 10.00,
                    description: "Ceviche de pescado",
                    photo: "https://t1.rg.ltmcdn.com/es/posts/7/4/1/ceviche_peruano_18147_orig.jpg"
                }
            ]
        },
        {
            id: 2,
            name: "Platos Fuertes",
            products: [
                {
                    id: 1,
                    name: "Ceviche de mole de pescado de tu tia abuela",
                    price: 10.00,
                    description: "Ceviche de pescado",
                    photo: "https://t1.rg.ltmcdn.com/es/posts/7/4/1/ceviche_peruano_18147_orig.jpg"
                },
                {
                    id: 2,
                    name: "Ceviche",
                    price: 10.00,
                    description: "Ceviche de pescado",
                    photo: "https://t1.rg.ltmcdn.com/es/posts/7/4/1/ceviche_peruano_18147_orig.jpg"
                }
            ]
        },
        {
            id: 3,
            name: "Postres",
            products: []
        },
        {
            id: 4,
            name: "Postres",
            products: []
        }
    ]

    return (
        <div className="view-menu-section"> 
          {categories.map((category) => {
            return (
                <div key={category.id} className="category">
                    <div>
                        <h3>{category.name}{` (${category.products.length})`}</h3>
                        <div>
                            <button>
                                Editar
                            </button>
                            <button>
                                Eliminar
                            </button>
                        </div>
                    </div>
                    {category.products.length > 0 && (
                        <div>
                            {category.products.map((product) => {
                                return (
                                    <div key={product.id} className="product">
                                        <div>
                                            <img src={product.photo} alt={product.name}/>
                                        </div>
                                        <div>
                                            <h4>{product.name}</h4>
                                            <p>{product.description}</p>
                                            <p>{product.price} USD</p>
                                        </div>
                                        <div>
                                            <button>
                                                Editar
                                            </button>
                                            <button>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>
                    )}
                </div>
            )
          })}  
        </div>
    )
}

export default ViewMenu;