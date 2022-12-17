import React from "react";
import { AiOutlineDelete } from "react-icons/ai"

function rand(num=255){
    return Math.floor(Math.random()*num)
}

export function Card({url, logo, title, description, id, isRemove, editTitle}) {
    function urlParse(url){
        let u = null
        if(["http", "https"].some(protocol => url.includes(protocol))){
            u = new URL(url)
        }else{
            let _url = `https://${url}`
            u = new URL(_url)
        }
        return u
    }
    function getDomain(url){
        const domain = urlParse(url).hostname
        return domain
    }

    function getProtocol(url){
        const protocol = urlParse(url).protocol
        return protocol
    }

    return (
        <li style={{position: "relative", overflow: "hidden"}}
            id={id}
        >
            <a href={url} target="_blank" className="flex-col">
                <div className="logo flex center user-select-none">
                    <img src={`${getProtocol(logo || url)}${getDomain(logo || url)}/favicon.ico`} alt="google" 
                        onError={(e) => {
                            e.target.style.visibility = 'hidden'
                            // e.target.parentElement.style.backgroundColor= `rgb(${rand()}, ${rand()}, ${rand()})`
                            e.target.parentElement.style.backgroundColor= `hsl(${rand()}, ${rand(70)}%, ${rand(70)}%)`
                            e.target.parentElement.innerText = `${title[0]}`
                        }}
                    />
                </div>
                <div className="summary flex-col"
                    onClick={editTitle}
                >
                    <span
                        className="category--title"
                    >{title ||''}</span>
                    <span className="web-description">{description|| ' '}</span>
                </div>
            </a>
            {
                isRemove
                && 
                <div 
                    className="remove-card"
                >
                    <AiOutlineDelete size={20} color="rgba(230, 0, 0, .8)"/>
                </div>
            }
        </li>
    );

    
}
