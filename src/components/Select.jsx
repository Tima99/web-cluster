import React from "react";
export function Select({
    id,
    item,
    selectedItem,
    setSelectedItem,
}) {
    return (
        <>
            <input
                type="radio"
                data-tab="tabinput"
                name="category"
                id={id}
                defaultChecked={id === selectedItem.id}
            />
            <label
                htmlFor={id}
                className="tab"
                onClick={(e) => {
                    if (!e.target.matches("label")) return;
                    setSelectedItem({id : e.target.getAttribute('for'), name: item});
                }}
            >
                {item}
            </label>
        </>
    );
}
