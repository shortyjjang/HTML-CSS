import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import ThingCard, { ThingCardProps } from "./ThingCard";
import { useFancy } from "./FancyContext";

const Recommendation = () => {
    return (
        <>
            <Likeable />
            <RecentlyViewed />
        </>
    );
};

const convertThingsV1 = (things: {
    url: string;
    thumb_image_url_558: string;
    sales: {
        max_price: number;
        min_price: number;
        seller: {
            brand_name: string;
        };
        title: string;
    }[];
    name: string;
}[]) => {
    return things.map(({ url: html_url, thumb_image_url_558: image_url, sales, name }) => {
        return {
            html_url,
            image_url,
            max_price: sales ? sales[0].max_price : 0,
            min_price: sales ? sales[0].min_price : 0,
            brand_name: sales ? sales[0].seller.brand_name : '',
            title: sales ? sales[0].title : name,
        };
    });
};

const Likeable = () => {
    const { thing: { recommended } } = useFancy();

    return (recommended?.length > 0) ? (
        <>
            <div className="recommend similar">
                <h2 className="stit">You May Also Like</h2>
                {/*<div className="control">
                    <div
                        onClick={() => {
                            setOffset(Math.max(5, offset - 5));
                        }}>
                        {"<"}
                    </div>
                    <div
                        onClick={() => {
                            setOffset(Math.min(offset + 5, ((things.length / 5) | 0) * 5));
                        }}>
                        {">"}
                    </div>
                </div>*/}
            </div>
            <Swiper className="recommend similar swiper-no-swiping" slidesPerColumn={5}>
                {recommended?.map((thing, i) => {
                              return (
                                  <SwiperSlide key={i}>
                                      <ThingCard {...thing} />
                                  </SwiperSlide>
                              );
                          })}
            </Swiper>
        </>
    ) : null;
};

const RecentlyViewed = () => {
    const { thing } = useFancy();
    const [things, setThings] = useState<ThingCardProps[] | null>(null);
    // const [offset, setOffset] = useState(4);
    const offset = 4;

    useEffect(() => {
        $.ajax({
            type: "get",
            url: `/recently_viewed_things_json?include_sale_item_option=True&rapi_compl=True&count=4&thing_id=${thing.id}`,
        }).then((response) => {
            const recently = convertThingsV1(response);
            setThings(recently);
        });
    }, []);

    return (
        <>
            <div className="recommend recently">
                <h2 className="stit">Recently Viewed</h2>
                {/*<div className="control" style="display:none;">
                    <div
                        onClick={() => {
                            setOffset(Math.max(4, offset - 4));
                        }}>
                        {"<"}
                    </div>
                    <div
                        onClick={() => {
                            setOffset(Math.min(offset + 4, ((things.length / 4) | 0) * 4));
                        }}>
                        {">"}
                    </div>
                </div>*/}
            </div>
            <Swiper className="recommend recently swiper-no-swiping" slidesPerColumn={4}>
                {things
                    ? things
                          .filter((_, i) => {
                              if (offset > 4) {
                                  return i >= offset - 4 && i < offset;
                              }
                              return i < offset;
                          })
                          .map((thing, i) => {
                              return (
                                  <SwiperSlide key={i}>
                                      <ThingCard {...thing} />
                                  </SwiperSlide>
                              );
                          })
                    : null}
            </Swiper>
        </>
    );
};

export default Recommendation;
