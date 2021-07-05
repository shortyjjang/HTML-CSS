import cx from "classnames";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import SwiperCore, { Thumbs } from "swiper";
import Lightbox from "react-image-lightbox";
import { debounceEventUntilTimeout } from "fancyutils";

import { useFancy } from "./FancyContext";
import type { ReviewEntry as ReviewEntryType, Reviews as ReviewsType } from "ftypes";

SwiperCore.use([Thumbs]);

interface ReviewParams {
    page?: number;
    per_page?: number;
    q?: string;
    sort?: "newest" | "rating_desc" | "rating_asc";
    setLoading?: Dispatch<SetStateAction<boolean>>;
}

function useDefaultReviews({ page, per_page, q, sort, setLoading }: ReviewParams) {
    const { thing } = useFancy();
    const {
        sales: { id: sid },
    } = thing;

    const skip = !sort && !per_page && (!page || page === 1) && !q;
    const reviews = useReviews({ skip, sid, page, per_page, q, sort, setLoading });
    if (skip) {
        return thing.reviews;
    } else {
        return reviews;
    }
}

function useReviews({
    skip = false,
    sid,
    page,
    per_page,
    q,
    sort,
    setLoading,
}: ReviewParams & { skip: boolean; sid: number }) {
    const [reviews, setReviews] = useState(null);
    const param = $.extend({}, { q, page, per_page, sort });

    useEffect(() => {
        if (skip) {
            return;
        }
        setLoading?.(true);
        $.get(`/rest-api/v2/reviews/saleitem/${sid}`, param)
            .then((res) => {
                setReviews(res);
            })
            .always(() => {
                setLoading?.(false);
            });
    }, [skip, sid, q, page, per_page, sort]);

    return reviews;
}

const Reviews = () => {
    const [loading, setLoading] = useState(false);
    const [reviewOption, setReviewOption] = useState({
        page: undefined,
        per_page: undefined,
        q: undefined,
        sort: undefined,
    });

    const reviews = useDefaultReviews({ ...reviewOption, setLoading });

    if (reviewOption.q === undefined && (!reviews || reviews.review_count === 0)) {
        return null;
    }

    return (
        <div className={cx("review-points review-section", { loading })}>
            <ReviewHead reviews={reviews} />
            <ReviewList
                reviews={reviews}
                reviewOption={reviewOption}
                setReviewOption={(applying) => {
                    setReviewOption({ ...reviewOption, ...applying });
                }}
            />
        </div>
    );
};

const ReviewHead = ({ reviews } : { reviews: ReviewsType }) => {
    return (
        <>
            <h3 className="stit">
                {reviews.summary.rating_avg}{" "}
                <small className="count">
                    ({reviews.summary.total_ratings} rating{reviews.summary.total_ratings != 1 ? "s" : ""})
                </small>
            </h3>
            <ul className="optional">
                {reviews.summary.attributes.map((a, i) => {
                    return (
                        <li key={i}>
                            <label>{a.label}</label>
                            <span className="review-range">
                                <i className="review-range-value" style={{ width: `${Number(a.rating) * 20}%` }}></i>
                            </span>
                            <b>{a.rating}</b>
                        </li>
                    );
                })}
            </ul>
            {/* <div className="btn-area">
                <button className="btns-blue-embo btn-review">Write a Review</button>
            </div> */}
        </>
    );
};

const ReviewEntry = ({ review } : { review: ReviewEntryType }) => {
    const [photoIndex, setPhotoIndex] = useState<number | null>(null);

    return (
        <li>
            <small className="date">{review.date}</small>
            <span className={"review-range " + "point" + (review.rating | 0)}>
                <span className="bg"></span>
                <i className="review-range-value">
                    <span></span>
                </i>
            </span>
            <span className="username">{review.name}</span>{" "}
            <span className="verified">
                <em>Verified User</em>
            </span>
            <b className="title">{review.title}</b>
            <span className="description">{review.review}</span>
            <div>
                {review.images.map((image, i) => {
                    return (
                        <div className="photo" key={i}>
                            <img
                                onClick={() => {
                                    setPhotoIndex(i);
                                }}
                                alt="review image"
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                                style={{
                                    backgroundImage: `url('${image.thumbnail_url}')`,
                                }}
                            />
                        </div>
                    );
                })}
                {photoIndex !== null && (
                    <Lightbox
                        mainSrc={review.images[photoIndex].image_url}
                        nextSrc={review.images[(photoIndex + 1) % review.images.length].image_url}
                        prevSrc={
                            review.images[(photoIndex + review.images.length - 1) % review.images.length].image_url
                        }
                        onCloseRequest={() => setPhotoIndex(null)}
                        onMovePrevRequest={() =>
                            setPhotoIndex((photoIndex + review.images.length - 1) % review.images.length)
                        }
                        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % review.images.length)}
                    />
                )}
            </div>
        </li>
    );
};

const ReviewList = ({ reviews, reviewOption, setReviewOption } : { reviews: ReviewsType }) => {
    const currentPage = reviewOption.page || 1;
    return (
        <>
            <fieldset className="search">
                <label>Filter reviews</label>
                <input
                    type="text"
                    placeholder="Search topics and reviews"
                    className="text"
                    onChange={debounceEventUntilTimeout((e) => {
                        setReviewOption({ q: e.target.value });
                    }, 500)}
                />
                <span className="sort">
                    <label>Sort By:</label>
                    <select
                        onChange={({ target }) => {
                            setReviewOption({ sort: target.value });
                        }}>
                        <option value="newest">Most Recent</option>
                        <option value="rating_desc">Highest Rated</option>
                        <option value="rating_asc">Lowest Rated</option>
                    </select>
                </span>
            </fieldset>
            <ul className="review-list">
                {reviews.reviews.length > 0 ? (
                    reviews.reviews.map((review, i) => <ReviewEntry key={i} review={review} />)
                ) : (
                    <li className="no-review">There is no review matching your request. Please try another option.</li>
                )}
            </ul>
            <div className="review-pagination">
                {currentPage > 1 && (
                    <>
                        <a href="#" className="more">
                            See more reviews
                        </a>
                        <a
                            className="prev"
                            onClick={() => {
                                setReviewOption({ page: Math.max(1, currentPage - 1) });
                            }}>
                            Prev
                        </a>
                    </>
                )}
                {currentPage < reviews.total_pages && (
                    <a
                        className="next"
                        onClick={() => {
                            setReviewOption({ page: Math.min(currentPage + 1, reviews.total_pages) });
                        }}>
                        Next
                    </a>
                )}
                {_.range(1, reviews.total_pages + 1).map((pageNum, i) => (
                    <a
                        key={i}
                        onClick={() => {
                            setReviewOption({ page: pageNum });
                        }}
                        className={currentPage === pageNum ? "current" : undefined}>
                        {pageNum}
                    </a>
                ))}
            </div>
        </>
    );
};

export default Reviews;
