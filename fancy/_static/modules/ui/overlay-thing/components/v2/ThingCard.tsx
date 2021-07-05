import React from "react";
import { numberFormat } from "fancyutils";

export interface ThingCardProps {
    brand_name: string;
    title: string;
    html_url: string;
    image_url: string;
    max_price: number;
    min_price: number;
}

export default function ThingCard({ brand_name, title, html_url, image_url, max_price, min_price }: ThingCardProps) {
    let p = <>${numberFormat(min_price, 0)}</>;
    if (max_price !== min_price) {
        p = (
            <>
                <em className="from">from </em> ${numberFormat(min_price, 0)}
            </>
        );
    }

    return (
        <div className="figure-item new">
            <figure>
                <a href={html_url}>
                    <span className="figure" style={{ backgroundImage: `url(${image_url})` }}>
                        <img
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                            style={{ backgroundImage: `url(${image_url})` }}
                        />
                    </span>
                </a>
            </figure>
            <figcaption>
                <a href={html_url}>
                    <span className="category">{brand_name}</span>
                    <b className="title">{title}</b>
                    <span className="price">{p}</span>
                </a>
            </figcaption>
        </div>
    );
}
