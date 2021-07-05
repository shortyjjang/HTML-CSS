import React, { useEffect, useState, useRef } from "react";
import cx from "classnames";

import { useFancy } from "../FancyContext";

const Overview = () => {
    const { thing } = useFancy();
    const sales = thing.sales;
    const bv = sales.seller.brand_values;
    const shippingInfo: { [k: string]: any } = sales.shipping_info || {};

    return (
        <div className="overview">
            <dl className="shipping optional">
                <dt>Shipping Information</dt>
                <dd>
                    <ul>
                        <li className="from">
                            <span>{shippingInfo.origin}</span>
                        </li>
                        {shippingInfo.cost && (
                            <li className="cost">
                                <span>{shippingInfo.cost}</span>
                            </li>
                        )}
                        {shippingInfo.window && (
                            <li className="days">
                                <span>{shippingInfo.window}</span>
                            </li>
                        )}
                    </ul>
                </dd>
            </dl>
            {bv.length > 0 ? (
                <dl className="brand-value optional">
                    <dt>Buy with Confidence</dt>
                    <dd>
                        {bv.slice(0,3).map(([className, text]) => (
                            <span key={className} className={`badge ${className}`}>{text}</span>
                        ))}
                    </dd>
                </dl>
            ) : null}
        </div>
    );
};

const Description = () => {
    const [menu, setMenu] = useState<"features" | "specification" | "returns">("features");
    const [showMore, setShowMore] = useState(false);
    const descEl = useRef<HTMLDivElement>(null);
    const props = useFancy();
    const { thing, thing: { sales } } = props;
    const showFeatures = !!(sales.features && sales.features.trim());
    const showSpecs = !!(sales.specifications && sales.specifications.trim());
    const showReturns =
        !!(sales.return_exchange_policy_title && sales.return_exchange_policy_title.trim()) ||
        !!(sales.shipping_policy && sales.shipping_policy.trim());
    
    useEffect(() => {
        if (showFeatures) {
            setMenu('features');
        } else if (showSpecs) {
            setMenu('specification');
        } else if (showReturns) {
            setMenu('returns');
        }
        setShowMore(descEl.current ? descEl.current.clientHeight <= 76 : false);
    }, [thing.id]);

    return (
        <div className="detail">
            <dl className={cx("description optional")}>
                <dt>Description</dt>                
                <dd className={cx({ collapsed: !showMore })}>
                    <div dangerouslySetInnerHTML={{ __html: sales.description }} ref={descEl}/>
                </dd> 
                <a className="more" onClick={() => setShowMore(true)} style={{display: showMore ? 'none' : undefined }}>Read more</a>
            </dl>
            <div className="features-menu">
                {showFeatures && (
                    <a
                        className={cx({ current: menu === "features" })}
                        onClick={(e) => {
                            e.preventDefault();
                            setMenu("features");
                        }}>
                        Features
                    </a>
                )}
                {showSpecs && (
                    <a
                        className={cx({ current: menu === "specification" })}
                        onClick={(e) => {
                            e.preventDefault();
                            setMenu("specification");
                        }}>
                        Specifications
                    </a>
                )}
                {showReturns && (
                    <a
                        className={cx({ current: menu === "returns" })}
                        onClick={(e) => {
                            e.preventDefault();
                            setMenu("returns");
                        }}>
                        Returns
                    </a>
                )}
            </div>
            {showFeatures && (
                <dl className={cx("features optional", { show: menu === "features" })} data-featuretype="features">
                    <dt>
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                                setMenu("features");
                            }}>
                            Features
                        </a>
                    </dt>
                    <dd dangerouslySetInnerHTML={{ __html: sales.features }} />
                </dl>
            )}
            {showSpecs && (
                <dl
                    className={cx("features optional", { show: menu === "specification" })}
                    data-featuretype="specifications">
                    <dt>
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                                setMenu("specification");
                            }}>
                            Specifications
                        </a>
                    </dt>
                    <dt></dt>
                    <dd dangerouslySetInnerHTML={{ __html: sales.specifications }} />
                </dl>
            )}
            {showReturns && (
                <dl className={cx("features optional", { show: menu === "returns" })} data-featuretype="returns">
                    <dt>
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                                setMenu("returns");
                            }}>
                            Returns
                        </a>
                    </dt>
                    <dd><p>{sales.return_exchange_policy_title}</p><p>{sales.shipping_policy}</p></dd>
                </dl>
            )}
        </div>
    );
};

const Detail = () => {
    return (
        <div className="figure-detail">
            <Overview />
            <Description />
        </div>
    );
};

export default Detail;
