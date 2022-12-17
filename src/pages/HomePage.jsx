import { AddWeb } from "../components/AddWeb";
import { NotFound } from "../components/NotFound";
import { Category } from "../components/Category";
import { Card } from "../components/Card";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { RiHome2Fill, RiHome2Line } from "react-icons/ri";
import { RiAddBoxFill, RiAddBoxLine } from "react-icons/ri";
import { AiOutlineDelete, AiFillDelete } from "react-icons/ai"
import logo from "../assets/logo.png"

export default function HomePage() {
    const [addWeb, setAddWeb] = useState({
        url: "",
        logo: "",
        name: "",
        protocol: "https://",
        description: "",
    });
    const [selectedCategory, setSelectedCategory] = useState("");
    const [clusters, setClusters] = useState(null);
    const [categories, setCategories] = useState([]);
    const [nav, setNav] = useState({add: null, remove: null})
    const [newlyAdded, setNewlyAdded] = useState() // contains id of newly added card

    const AddWebProps = {
        inputHandler,
        addWeb,
        addWebHandler,
        categories,
        setCategories: setCategoryName,
        setSelectedCategory,
        selectedCategory,
    };
    const STORAGE_KEY = "CLUSTER";
    let doubleTab = 0;

    useLayoutEffect(() => {
        const web_clusters = localStorage.getItem(STORAGE_KEY);
        const clusters = web_clusters !== null && JSON.parse(web_clusters);

        if (web_clusters === null || clusters.length <= 0) {
            // if empty cluster
            setClusters([]);
            const initial = { name: "Web Cluster", id: uuid() };
            setCategories([initial]);
            setSelectedCategory(initial);
            return;
        }

        setClusters(clusters);
        setCategories(
            clusters.map((c) => ({ name: c.categoryName, id: c.id }))
        );
        setSelectedCategory({
            name: clusters[0].categoryName,
            id: clusters[0].id,
        });
    }, []);

    useEffect(() => {
        if(!newlyAdded) return
        const newlyAddedCard = document.getElementById(newlyAdded)

        newlyAddedCard?.classList.add("new-added")
        newlyAddedCard?.scrollIntoView({block: "center"})
        newlyAddedCard.addEventListener("animationend", ()=>{
            newlyAddedCard?.classList.remove("new-added")
        })

    }, [newlyAdded])

    return (
        <>
            {
                nav.add 
                ? <AddWeb {...AddWebProps} />
                : <header>
                    <img src={logo} alt="" />
                    Web Cluster
                </header>
            }
            <main>
                <ul
                    style={{
                        padding: "1rem 0.7rem 3rem 1rem",
                        listStyle: "none",
                    }}
                    onClick={removeItem}
                >
                    {clusters !== null && clusters.length > 0 ? (
                        MapClusters(clusters, editCategoryName, nav, editCardSummary)
                    ) : (
                        <NotFound text="No clusters found" />
                    )}
                </ul>
            </main>

            <nav>
                <li
                    onClick={(e) => {
                        setNav({
                            add: false,
                            remove: false
                        })
                        document.querySelector('header')?.scrollIntoView()
                        if(!e.target.matches('li')) return
                        e.target.querySelector('input').checked = true
                    }}
                >
                    <input type="radio" name="nav" id="nav-home" defaultChecked={true}/>
                    <label htmlFor="nav-home" className="fill"><RiHome2Fill /></label>
                    <label htmlFor="nav-home" className="line"><RiHome2Line /></label>
                </li>
                <li 
                    onClick={(e) => {
                        setNav({
                            add: true,
                            remove: false
                        })
                        Scroll()
                        if(!e.target.matches('li')) return
                        e.target.querySelector('input').checked = true
                    }}
                >
                    <input type="radio" name="nav" id="nav-add" />
                    <label htmlFor="nav-add" className="fill"><RiAddBoxFill /></label>
                    <label htmlFor="nav-add" className="line"><RiAddBoxLine /></label>
                </li>
                <li
                    onClick={(e) => {
                        setNav({
                            add: false,
                            remove: true
                        })
                        Scroll()
                        if(!e.target.matches('li')) return
                        e.target.querySelector('input').checked = true
                    }}
                    
                >
                    <input type="radio" name="nav" id="nav-remove" />
                    <label htmlFor="nav-remove" className="fill"><AiFillDelete /></label>
                    <label htmlFor="nav-remove" className="line"><AiOutlineDelete /></label>
                </li>
            </nav>
        </>
    );

    function Scroll(){
        const addNavComponent = document.querySelector('.input-groups')
        if(addNavComponent){
            addNavComponent.scrollIntoView({block: "nearest"})
            addNavComponent.style.position = 'sticky'
            addNavComponent.style.top = 0
        }
    }

    function inputHandler(e) {
        const protocols = ["https://", "http://"];
        if(e.target.name === "name"){
            const hasProtocol = ["http://", "https://"].some(protocol => e.target.value.includes(protocol))
            if(hasProtocol){
                e.target.value = e.target.value.replace("https://", '')
                e.target.value = e.target.value.replace("http://", '')
            }

        }
        const value =
            e.target.name === "protocol"
                ? protocols[Number(e.target.checked)]
                : e.target.value;
        setAddWeb((prev) => {
            const web = { ...prev, [e.target.name]: value };
            const urlAdded = { ...web, url: `${web.protocol}${web.name}` };
            return urlAdded;
        });
    }

    function doubleClickHandler(){
        doubleTab++;
        setTimeout(() => (doubleTab = 0), 500);
        if (doubleTab < 2) return false;
        return true
    }

    function editCategoryName(e) {
        // on double tab or click make target editable
        if(!doubleClickHandler()) return
        // reserver old selectedCategory name
        const oldCatgeoryName = e.target.getAttribute("data-id");
        const name = setCategoryName(
            "Edit category name: ",
            e.target.innerText,
            false
        );
        if (!name) return;

        const idx = clusters.findIndex((c) => c.id === oldCatgeoryName);
        if (idx === -1)
            return alert("Unable to edit.\nSomething went wrong 😔.");

        clusters[idx].categoryName = name;
        setCategories((prev) => {
            prev[idx].name = name;
            return prev;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clusters));
    }

    function setCategoryName(title, defaultValue, newCategory = true) {
        const name = prompt(title, defaultValue || "");
        if (name === null || !name.trim().length) return null;
        const id = uuid();
        setSelectedCategory({ name, id });
        if (newCategory)
            setCategories((prev) =>
                Array.from(new Set([...prev, { name, id }]))
            );
        return name.trim();
    }

    function addWebHandler(e) {
        e.preventDefault();
        const valid = document.getElementById("add-web-form").checkValidity();
        if (!valid) return document.getElementById("web-url").focus();

        if (!selectedCategory?.name?.trim())
            return alert("➕ 𝗦𝗲𝗹𝗲𝗰𝘁 𝗰𝗮𝘁𝗲𝗴𝗼𝗿𝘆 𝗼𝗿 𝗖𝗿𝗲𝗮𝘁𝗲 𝗻𝗲𝘄 𝗼𝗻𝗲.");

        let web_clusters = localStorage.getItem(STORAGE_KEY);
        web_clusters =
            web_clusters !== null ? JSON.parse(web_clusters) : web_clusters;

        let clusters = [];
        const id = uuid() // this is category id
        const itemId = uuid()
        if (web_clusters === null){
            // push first cluster to localstorage
            clusters.push({
                categoryName: selectedCategory.name,
                id: selectedCategory.id || id,
                items: [{ ...addWeb, id: itemId }],
            });
        }
        else {
            const clusterIdx = web_clusters.findIndex(
                (c) => c.id === selectedCategory.id
            );
            if (clusterIdx === -1) {
                web_clusters.push({
                    categoryName: selectedCategory.name,
                    id: selectedCategory.id || id,
                    items: [{ ...addWeb, id: itemId }],
                });
            } else {
                web_clusters[clusterIdx].items.push({ ...addWeb, id: itemId });
            }
            clusters = web_clusters;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(clusters));
        setClusters(clusters);
        setNewlyAdded(itemId)
    }

    function removeItem(e) {
        let elem = null;
        if (e.target.matches("div.remove-card")) {
            elem = e.target.parentElement;
        } else if (e.target.matches("svg")) {
            elem = e.target.parentElement.parentElement;
        } else return;
        if (!elem) return alert("Unable to delete.\nTry Again");

        const card_id = elem.getAttribute("id");
        const category_id = elem.parentElement.getAttribute("data-category");

        const idx = clusters.findIndex((c) => c.id === category_id);

        if (idx === -1) return alert("Unable to delete.\nTry Again");

        const items = clusters[idx].items.filter((i) => i.id !== card_id);
        if (items.length > 0) clusters[idx].items = items;
        else delete clusters[idx];

        const newClusters = clusters ? clusters.filter((c) => c) : [];
        setClusters(newClusters);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newClusters));

        let categories = newClusters.map((c) => {
            return { name: c.categoryName, id: c.id };
        });
        categories =
            categories.length > 0
                ? categories
                : [{ name: "Web Cluster", id: uuid() }];
        setCategories(categories);
        setSelectedCategory({
            name: categories[0].name,
            id: categories[0].id,
        });
    }

    function editCardSummary(e){
        const titleEdit = e.target.matches("span.category--title")
        const descriptionEdit = e.target.matches("span.web-description") 
        if(!titleEdit && !descriptionEdit) return
        
        e.preventDefault()

        const edit = prompt(`Edit ${titleEdit ? 'Title': 'Description'} : `, e.target.innerText)
        if(edit === null || !edit.toString().trim().length) return

        const ele = e.target.parentElement.parentElement.parentElement

        if(ele.tagName !== "LI") return
        const id = ele.getAttribute('id')
        const categoryId = ele.parentElement.getAttribute('data-category')
        const category = clusters.findIndex(c => c.id === categoryId)
        if(category === -1) return

        const newItems = clusters[category].items.map(item => {
            if(item.id === id){
                if(titleEdit)
                    item.title = edit
                else
                    item.description = edit
            }
            return item
        })

        clusters[category].items = newItems
        const newClusters = [...clusters]

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newClusters))
        setClusters(newClusters)
    }
}

function MapClusters(clusters, editCategoryName, nav, editTitle) {
    let touch = {
        x: 0, y:0, endX: 0, endY: 0
    }
    let direction = null;
    let sensitivity = 3
    
    return clusters.map((c) => {
        return (
            <li key={c.id} className="container">
                <Category
                    clickHandler={editCategoryName}
                    categoryName={c.categoryName}
                    id={c.id}
                />
                <ul className="category-web-collection" data-category={c.id}
                    onTouchEndCapture={touchEndHandler}
                    onTouchMoveCapture={touchMoveHandler}
                    onTouchStartCapture={touchStartHandler}
                >
                    {c.items?.map((item, i) => {
                        return (
                            <React.Fragment key={item.name + i}>
                                <Card
                                    url={item.url}
                                    logo={item.logo}
                                    title={item.title || item.name.split(".")[0]}
                                    description={item.description}
                                    id={item.id}
                                    isRemove={nav.remove}
                                    editTitle={editTitle}
                                />
                            </React.Fragment>
                        );
                    })}
                </ul>
            </li>
        );
    });


    function touchStartHandler(e){
        e.stopPropagation()
        touch.x = e.targetTouches[0].clientX
        touch.y = e.targetTouches[0].clientY

        direction = null
    }

    function touchMoveHandler(e){
        e.stopPropagation()
        touch.endX = e.targetTouches[0].clientX
        touch.endY = e.targetTouches[0].clientY
        direction = null
    }

    function touchEndHandler(e){

        if(touch.endX > sensitivity)
            if(touch.x < touch.endX)
                direction = "ltr"
            else if(touch.x > touch.endX)
                direction = "rtl"

        touch.endX = 0
        touch.endY = 0
        if(!direction) return
        
        let card = null
        if(e.target.matches('a')){
            card = e.target.parentElement
        }
        if(e.target.matches('div.logo')){
            card = e.target.parentElement.parentElement
        }
        if(e.target.matches('span')){
            card = e.target.parentElement.parentElement.parentElement
        }

        if(card === null || card.tagName !== "LI" || !card.getAttribute("id") ) return

        if(direction === "ltr"){
            card.style.gridColumn = `1/3`
        }
        else if(direction === "rtl"){
            if(!card.style.gridColumn.includes('auto'))
                card.style.gridColumn = `auto`
        }

    }
}
