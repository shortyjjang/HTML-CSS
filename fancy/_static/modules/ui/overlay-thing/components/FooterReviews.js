import React, { Component } from 'react';
import { renderPopup } from 'fancyutils';

import ReviewsPopup from './popup/ReviewsPopup';
import Review from './Review';


export default class FooterReviews extends Component {
    handleMoreReviewsDisplay = () => {
        const { appContext, thing: { sales } } = this.props;
        renderPopup(ReviewsPopup, { appContext, sales });
    };

    render() {
        const { appContext, thing: { sales } } = this.props;
        return (
            <div className="wrapper customer-review">
                <h3>Reviews</h3>
                <ul>
                    {sales.reviews.map((review, i) =>
                        <Review key={i} review={review} appContext={appContext} sales={sales} />
                    )}
                </ul>
                {sales.reviews.length > 3 &&
                    <a onClick={this.handleMoreReviewsDisplay} className="more">See {sales.reviews.length - 3} more reviews</a>
                }
            </div>
        );
    }
}
