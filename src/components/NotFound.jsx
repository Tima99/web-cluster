import React from "react";
import { RiEmotionSadLine } from "react-icons/ri"

export function NotFound({ text = "Not found" }) {
    return (
        <div
            className="not-found-container flex-col center"
            style={{
                gap: "0.3rem",
            }}
        >
            <RiEmotionSadLine size={"25vmin"} color={"#888"} />
            <span
                style={{
                    fontFamily: "var(--stylish-title)",
                    textTransform: "capitalize",
                    fontSize:'1.2rem'
                }}
            >
                {text}
            </span>
        </div>
    );
}
