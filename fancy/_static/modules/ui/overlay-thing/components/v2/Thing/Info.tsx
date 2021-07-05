import React from "react";
import SaleItem from "./SaleItem";

import { useFancy } from "../FancyContext";

const Info = () => {
    const fancyProps = useFancy();
    const { thing: { reviews, sales }, fancyContext } = fancyProps;
    const r = reviews.summary;

    return (
        <div className="figure-info">
            <div className="vendor"><a href={sales.seller.shop_url}>{sales.seller.brand_name}</a></div>
            {r.total_ratings > 0 && (
                <div className="review-points">
                    <span style={{ cursor: r.total_reviews > 0 ? "pointer" : undefined }} onClick={() => {
                        if (r.total_reviews > 0) {
                            const $el = $(".review-section");
                            const headerSize = parseInt($(".container").css("padding-top")) || 0;
                            if ($el.length) {
                                $(window).scrollTop($el[0].offsetTop - headerSize);
                            }
                        }
                    }}>
                        {r.rating_avg} <small className="count">({r.total_ratings} rating{r.total_ratings != 1 ? 's' : ''})</small>{" "}
                    </span>
                </div>
            )}
            <SaleItem {...fancyProps} />
        </div>
    );
};

export default Info;
