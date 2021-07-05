import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";

import ThingCard from "./ThingCard";
import { useFancy } from "./FancyContext";

const MerchantInfo = () => {
    const {
        thing,
        thing: {
            sales: { seller },
        },
    } = useFancy();
    const [showMore, setShowMore] = useState(false);
    const descEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setShowMore(descEl.current ? descEl.current.clientHeight <= 80 : false);
    }, [thing.id]);

    return (
        <div className="merchant-info">
            <h2 className="stit">More about {seller.brand_name}</h2>
            <div className={classnames("description", { collapsed: !showMore })}>
                <div dangerouslySetInnerHTML={{ __html: seller.description }} ref={descEl} />
            </div>
            <a className="more" style={{ display: showMore ? "none" : undefined }} onClick={() => setShowMore(true)}>
                Read more
            </a>
            <a className="btns-blue-embo" href={seller.shop_url}>
                Explore more
            </a>
            <Swiper className="swiper-no-swiping">
                {seller.sale_items.map((item, i) => {
                    return (
                        <SwiperSlide key={i} tag="li">
                            <ThingCard {...item} brand_name={seller.brand_name} />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default MerchantInfo;
