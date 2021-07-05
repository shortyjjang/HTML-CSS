import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Display } from 'fancymixin';
import { KEYS, ClickOutside, triggerEvent } from 'fancyutils'
import autosize from 'autosize';
import dateFormat from 'date-fns/format'
import ContentEditable from 'react-contenteditable'


export default class Info extends React.Component {
    handleAuthorChange = event => {
        this.props.setArticleProp('authors', event.target.value);
    }

    handleTitleChange = event => {
        this.props.setArticleProp('title', event.target.value);
    }

    handleTaglineChange = event => {
        this.props.setArticleProp('tagline', event.target.value);
    }

    componentDidMount() {
        autosize(this.ta1);
        autosize(this.ta2);
    }

    render() {
        const { actionButtonText, actionButtonLink, authors, setArticleProp, title, tagline, dateCreated, saveCount } = this.props;

        return (
            <div className="info">
                  <h2 className="title">
                      <b>
                          <textarea ref={(e)=>{this.ta1 = e}}
                                    type="text" placeholder="Article Title"
                                    onChange={this.handleTitleChange}
                                    value={title} />
                      </b>
                      <small>
                          <textarea ref={(e)=>{this.ta2 = e}} type="text" placeholder="Article Tagline"
                                    onChange={this.handleTaglineChange}
                                    value={tagline} />
                      </small>
                  </h2>
                      {window.isWhitelabelV2 ? 
                        <ContentEditable className="author" onChange={this.handleAuthorChange} html={authors}
                                         placeholder="Type Author" />
                        :
                        <input className="author-input author"
                               type="text" placeholder={"TYPE AUTHOR / PHOTOGRAPHER"}
                               onChange={this.handleAuthorChange}
                               value={authors} />
                      }
                      {window.isWhitelabelV2 && <div className="date text-placeholder">{dateFormat(dateCreated || new Date, 'MMMM DD, YYYY')}</div>}
                      <ActionButton setArticleProp={setArticleProp} actionButtonText={actionButtonText}
                                    actionButtonLink={actionButtonLink} saveCount={saveCount} />
            </div>
        )
    }
}

class ActionButton extends React.Component {
    state = {
        edit: false
    };

    componentDidMount() {
        this.clickOutside = new ClickOutside({ component: this, popupElementRefKey: "ActionButtonEl" });
    }

    componentWillUnmount() {
        this.clickOutside.destroy();
    }

    componentDidUpdate() {
        if (this.state.edit) {
            this.clickOutside.handleAttach(this.closePopup);
        }
    }

    handleEdit = event => {
        if (event.target === event.currentTarget) {
            this.setState({ edit: !this.state.edit });
        }
    }

    handleActionButtonKeyDown = event => {
        if (event.keyCode === KEYS.ENTER) {
            this.setState({ edit: !this.state.edit });
        }
    }

    handleButtonTextChange = event => {
        this.props.setArticleProp('actionButtonText', event.target.value);
    }

    handleButtonURLChange = event => {
        this.props.setArticleProp('actionButtonLink', event.target.value);
    }

    closePopup = () => {
        this.setState({ edit: false })
    }

    render() {
        const { edit } = this.state;
        const { actionButtonText, actionButtonLink, saveCount } = this.props;

        const actionButton = (<span className="btn-shop" onClick={this.handleEdit} ref={el => {
                this.ActionButtonEl = el;
            }}>
            {actionButtonText || (window.isWhitelabelV2 ? 'Click to set action' : 'Article Button')}
            <small className="button_option" style={Display.NoneIf(!edit)}>
                <input type="text" placeholder="Button Text" onChange={this.handleButtonTextChange} value={actionButtonText} onKeyDown={this.handleActionButtonKeyDown} />
                <input type="text" placeholder="Button URL" onChange={this.handleButtonURLChange} value={actionButtonLink} onKeyDown={this.handleActionButtonKeyDown} />
            </small>
        </span>);

        if (window.isWhitelabelV2) {
            return <div className="interaction">
                <ul className="share">
                    <li><a className="fb" onClick={e => e.preventDefault()}></a></li>
                    <li><a className="tw" onClick={e => e.preventDefault()}></a></li>
                    <li><a className="email" onClick={e => e.preventDefault()}></a></li>
                    <li><a className="link" onClick={e => e.preventDefault()}></a></li>
                </ul>
                {actionButton}
                <div className="like">
                    <a className="button button-static fancy _count"><span><i></i></span>{saveCount || '0'}</a>
                </div>
            </div>
        } else {
            return actionButton
        }
    }
}
