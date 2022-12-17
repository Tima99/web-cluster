import React from "react";
import { BsPlusSquareFill } from "react-icons/bs";

export function Category({ clickHandler, categoryName, id }) {
    return (
        <div className="category flex center between">
            <div className="tool-tip">
                <span 
                    className="category-name" onClick={clickHandler}
                    data-id={id}
                >{categoryName}</span>
                <div className="tooltiptext right">Double Tab to Edit</div>
            </div>
            {/* <span className="add-icon tool-tip">
                <BsPlusSquareFill />
                <span className="tooltiptext left">Add Web</span>
            </span> */}
        </div>
    );
}
