import { Select } from './Select';
import { BsPlusSquareFill } from "react-icons/bs";

export function AddWeb({
    inputHandler,
    addWeb,
    addWebHandler,
    categories,
    setCategories,
    setSelectedCategory,
    selectedCategory,
}) {
    return (
        <form
            className="input-groups"
            style={{
                "--corner-radius": "0.3rem",
            }}
            id="add-web-form"
        >
            <div className="wraper">
                <div className="add-detail">
                    <div className="toogle-protocol-container">
                        <input
                            type="checkbox"
                            name="protocol"
                            id="protocol"
                            className="dis-none"
                            onChange={inputHandler}
                        />
                        <label htmlFor="protocol" data-protocol="https://">
                            https://
                        </label>
                        <label htmlFor="protocol" data-protocol="http://">
                            http://
                        </label>
                    </div>
                    <input
                        type="text"
                        name="name"
                        id="web-url"
                        placeholder="Enter website name"
                        onChange={inputHandler}
                        value={addWeb.name}
                        tabIndex={"1"}
                        required
                        autoFocus
                    />
                </div>
                
                <div className="add-detail description">
                    <input
                        type="text"
                        placeholder="Description..."
                        spellCheck={false}
                        onChange={inputHandler}
                        name="description"
                        value={addWeb.description}
                        tabIndex={"2"}
                    />
                </div>

                <div className="add-detail">
                    <input
                        type="url"
                        name="logo"
                        id="web-logo"
                        placeholder="(optional) Paste image link "
                        onChange={inputHandler}
                        value={addWeb.logo}
                        tabIndex={"3"}
                    />
                </div>
                
                <button
                    className="add-icon"
                    tabIndex={categories.length+5}
                    onClick={addWebHandler} 
                >
                    <BsPlusSquareFill />
                </button>
            </div>
            <ul
                className="category-inventory"
            >
                {
                categories.map((category, i) => {
                    
                    return (
                        <li key={category.id} tabIndex={i+4}>
                            <Select 
                                id={category.id}
                                item={category.name} 
                                selectedItem={selectedCategory} 
                                setSelectedItem={setSelectedCategory}  
                            />
                        </li>
                    );
                })
                }
                <li
                    className="new-category-name"
                    onClick={(e) => {
                        setCategories("Enter new category name: ");
                    }}
                    tabIndex={categories.length+4}
                >
                    New
                </li>
            </ul>
        </form>
    );
}
