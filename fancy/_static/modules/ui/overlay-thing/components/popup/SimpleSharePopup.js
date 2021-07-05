import React from 'react';
import classnames from 'classnames';
import { closePopup, copyToClipboard } from 'fancyutils';

export default class SimpleSharePopup extends React.Component {
    static popupName = 'minimum-share';

    constructor(props) {
        super(props);
        const { thing, viewer } = props;
        let url = `https://fancy.com${thing.url}`;
        if (viewer && viewer.username) {
            let connector = ~url.indexOf('?') ? '&' : '?';
            url = `${url}${connector}ref=${viewer.username}`
        }
        console.log(url)
        this.state = {
            shareUrl: url,
            urlCopied: false,
        }
    }

    handleCancelClick = (event) => {
        event.preventDefault();
        closePopup(SimpleSharePopup.popupName);
    }

    componentDidUpdate(){
        $.dialog(SimpleSharePopup.popupName).center();
    }

    handleCopyLink = (event) => {
        console.log('handleCopyLink');
        const { shareUrl } = this.state;
        console.log('handleCopyLink ' + shareUrl );
        copyToClipboard(shareUrl);
        this.setState({ urlCopied: true });
        setTimeout(() => {
            this.setState({ urlCopied: false });
        }, 2000);
    }


    render() {
        const { thing, viewer } = this.props;
        const { shareUrl, urlCopied } = this.state;

        return (
          <>
          	<p className="ltit">Share</p>
            <ul>
                <li><a href="#" className="btn-copy-link link" onClick={this.handleCopyLink}>{urlCopied ? "Copied to clipboard" : "Copy link"}</a></li>
                <li><a 
                    href={`http://pinterest.com/pin/create/link/?url=${encodeURIComponent(shareUrl)}&media=${thing.images ? encodeURIComponent(thing.images[0].image_url) : ""}&description=${encodeURIComponent(thing.name)}`}
                    target="_blank" className="pin">Share to Pinterest</a></li>
                <li><a 
                    href={`mailto:?body=Check%20out%20${encodeURIComponent(thing.name)}%20on%20Fancy!%0A%0A${encodeURIComponent(shareUrl)}&subject=${encodeURIComponent(thing.name)}%20on%20Fancy`}
                    target="_blank" className="email">Share via email</a></li>
            </ul>
            <button className="ly-close" title="Close"><i className="ic-del-black"></i></button>
          </>
        );
    }
}