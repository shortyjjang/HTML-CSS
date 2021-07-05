import React, { Component } from 'react';
import { Display } from 'fancymixin';

const Votes = {
    Like: {
        param: { vote: 1 },
    },
    Dislike: {
        param: { vote: -1 },
    }
};

export default class Review extends Component {
    state = {
        like: null
    };
    lock = false;

    request(VoteType) {
        if (this.lock) {
            return;
        }
        this.lock = true;
        const { review, sales } = this.props;
        $.ajax({
            type:'PUT',
            url: `/rest-api/v1/reviews/${sales.id}/${review.id}`,
            data: VoteType.param,
        })
        .done(() => {
            this.setState({ like: VoteType });
        })
        .always(() => {
            this.lock = false;
        });
    }

    handleLike = (event) => {
        event.preventDefault();
        this.request(Votes.Like);
    };

    handleDislike = (event) => {
        event.preventDefault();
        this.request(Votes.Like);
    };

    getUpPercentage (voteup, votedown) {
        if (!voteup) {
            return 0;
        } else {
            return (voteup / (voteup + votedown) * 100).toFixed(0);
        }
    }

    render() {
        const { review, appContext } = this.props;
        const { body, date_created, voteup, votedown, rating, user, title, viewer_can_vote, option } = review;
        const upPercentage = this.getUpPercentage(voteup, votedown);
        const { like } = this.state;

        return (
            <li>
                <p className="rating">
                    <span className="value">
                        <small style={{ width: `${rating * 10}%` }} />
                    </span>
                    {/*<span className="name">{user.full_name || user.fullname}</span>*/}
                    <span className="date">{date_created}</span>
                </p>
                <div className="review">
                    <h4 className="title">{title}</h4>
                    <span className="option">Option: {option || ''}</span>
                    {(voteup > 0 || votedown > 0) ? 
                        <p className="precentage">{voteup} of {voteup + votedown} people ({upPercentage}%) found this review helpful.</p>
                        :
                        ''
                    }
                    <div className="description">{body}</div>
                    {appContext.loggedIn &&
                     viewer_can_vote &&
                        [
                            <p key="feedback" className="survey" style={Display.NoneIf(like != null)}>
                                Was this review helpful? <a onClick={this.handleLike} className="like">Like</a> ·
                                                         <a onClick={this.handleDislike} className="unlike">Unlike</a>
                            </p>,
                            <p key="feedback-response" className="success" style={Display.NoneIf(like == null)}>Thank you for your feedback.</p>
                        ]
                    }
                </div>
            </li>
        );
    }
}
