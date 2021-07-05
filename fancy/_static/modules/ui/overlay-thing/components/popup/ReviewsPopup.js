import React from 'react';
import { Display } from 'fancymixin';

import Review from '../Review';


export default class ReviewsPopup extends React.Component {
    static popupName = 'customer-review';
    state = {
        reviews: [],
    };
    endReached = false;

    componentDidMount() {
        this.loadReviews();
    }

    componentDidUpdate(prevProps) {
        if (this.props.sales.id !== prevProps.sales.id) {
            this.loadReviews();
        }
    }

    handleLoading = () => {
        const $ul = $(this.reviewsContainer);
        var scrollTop = $ul.scrollTop();
        var scrollHeight = $ul[0].scrollHeight;
        if (
            !this.endReached &&
            (scrollTop > scrollHeight - $ul.height() - 200)
        ) {
            this.loadReviews();
        }
    }

    getParam = () => {
        if (this.state.reviews.length > 0) {
            return { cursor: _.last(this.state.reviews).id - 1 };
        } else {
            return null;
        }
    }

    loadReviews = () => {
        if (this.loading || this.endReached) {
            return;
        }
        this.loading = true;
        this.setState({ loading: true }, () => {
            const { sales } = this.props;
            $.ajax({
                type: 'GET',
                url: `/rest-api/v1/reviews/${sales.id}`,
                data: this.getParam()
            })
            .then(({ reviews }) => {
                if (reviews.length) {
                    this.setState({ reviews: this.postProcessReviews(reviews) })
                } else {
                    this.endReached = true;
                }
            })
            .always(() => {
                this.setState({ loading: false });
                this.loading = false;
            });
        });
    }

    postProcessReviews(reviews) {
        return reviews.map(review => {
            review.date_created = $.datepicker.formatDate('MM d, yy', new Date(review.date_created));
            review.viewer_can_vote = review.voted == 0 && review.user.id != this.props.appContext.viewer.id;
            return review;
        });
    }

    render() {
        const { appContext, sales } = this.props;
        const { reviews, loading } = this.state;

        return (
            <div>
                <p className="ltit">Customer reviews</p>
                <p className="total-range">
                    <b>{
                        sales.review_rating > 0 ?
                        String((sales.review_rating / 2).toFixed(1))
                        :
                        '0'
                    } stars</b> – {sales.review_count} customer reviews</p>
                <ul onScroll={this.handleLoading} ref={(element) => {this.reviewsContainer = element;}}>
                    {reviews.map((review, i) =>
                        <Review key={i} review={review} appContext={appContext} sales={sales} />
                    )}
                    <li className="loading" style={Display.NoneIf(!loading)} />
                </ul>
                <button className="ly-close" title="Close">
                    <i className="ic-del-black" />
                </button>
            </div>
        );
    }
}
