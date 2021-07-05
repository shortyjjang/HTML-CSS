import React from 'react';
import { numberFormat, schemeless, closePopup } from 'fancyutils';

import appState from '../../appstate';


export default class AskQuestionPopup extends React.Component {
  static popupName = 'ask_seller';

  constructor(props) {
    super(props);
    this.state = {
      sending: false,
      question: ''
    };
  }

  getUsername = () => {
    const { thing: { sales } } = this.props;
    if (sales == null) {
      return '';
    }

    if (sales.discount_percentage > 0 && sales.seller.id == 616001) {
      return 'Fancy Sales';
    } else {
      return sales.seller.brand_name;
    }
  }

  handleChange = (event) => {
    this.setState({ question: event.target.value });
  }

  handleCancel = () => {
    closePopup('ask_seller');
  }

  handleSend = () => {
    const { sending, question } = this.state;
    const { thing, thing: { sales } } = this.props;
    if (sending) {
      return;
    }
    if (appState.loggedIn !== true) {
      require_login();
      return;
    }
    if ($.trim(question).length > 2048) {
      alertify.alert("Sorry, message is too long. Please write less than 2048 characters.");
      return;
    }
    const brandName = this.getUsername();
    this.setState({ sending: true }, () => {
      $.post("/messages/send-message.json",
        { seller_id: sales.seller.id, things: thing.id, message: $.trim(question) },
        (res) => {
          if(!res.status_code){
            alertify.alert(res.message || "Sorry, we couldn't send your message right now. Please try again later.");
          } else {
            alertify.alert(`Your message has been sent to ${brandName}`);
            this.setState({ question: '' });
          }
        }
      )
      .done(() => {
        closePopup('ask_seller')
      })
      .fail(() => {
        alertify.alert("Failed to send message. Please try again");
      })
      .always(() => {
        this.setState({ sending: false });
      })
    });
  }

  isSendDisabled = () => {
    return !(this.state.question && this.state.question.length > 0);
  }

  render() {
    const { question } = this.state;
    const { thing, thing: { sales } } = this.props;

    return sales ? (
      <div>
        <p className="ltit">{gettext("Ask a Question")}</p>
        <div className="figure-item">
          <figure style={{ backgroundImage: `url(${schemeless(thing.image.src)})` }} />
          <figcaption>
            <span className="title">{sales.name}</span>
            <span className="figure-detail">
              <b className="price">
                ${numberFormat(sales.price, 0)}
              </b> <span className="username">· {this.getUsername()}</span></span>
          </figcaption>
        </div>
        <fieldset>
          <p>
            <textarea className="text"
                      placeholder={`Ask a question about ${sales.name}`}
                      defaultValue=""
                      value={question}
                      onChange={this.handleChange} />
          </p>
          <div className="btn-area">
            <button className="btns-gray-embo" onClick={this.handleCancel}>{gettext('Cancel')}</button>
            <button className="btns-blue-embo _send" disabled={this.isSendDisabled()} onClick={this.handleSend}>{gettext('Send')}</button>
          </div>
        </fieldset>
        <button className="ly-close" title="Close">
          <i className="ic-del-black" />
        </button>
      </div>
    )
    :
    <div />
  }
}
