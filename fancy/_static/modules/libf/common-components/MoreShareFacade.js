import React, { Component } from "react";
import { MoreShare } from "common-components";


export class MoreShareFacade extends Component {
    state = {
        share: false,
        list: false
    };

    handleClickShare = () => {
        this.setState({ share: true });
    };

    handleClickList = () => {
        this.setState({ list: true });
    };

    render() {
        const { share, list } = this.state;
        return (
            <React.Fragment>
                {!(share || list) && (
                    <FakeMoreShare onClickShare={this.handleClickShare} onClickAddlist={this.handleClickList} />
                )}
                {(share || list) && <MoreShare {...this.props} facadeShowShare={share} facadeShowList={list} />}
            </React.Fragment>
        );
    }
}

class FakeMoreShare extends Component {
    render() {
        return (
            <em className="menu-container on-home ignore-ext" data-rendered="true">
                <button className="btn-share" onClick={this.props.onClickShare}></button>
                <small className="btn-more" onClick={this.props.onClickAddlist}>
                    <em>Share &amp; Lists</em>
                </small>
            </em>
        );
    }
}