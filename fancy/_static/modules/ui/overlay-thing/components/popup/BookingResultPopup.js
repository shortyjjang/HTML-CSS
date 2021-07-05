import React from 'react';

import { redirect } from '../../container/routeutils';


export default class BookingResultPopup extends React.Component {
    static popupName = 'booking-result';
    render() {
        const { roomlist } = this.props;

        return (
            <div>
                <p className="ltit">Room Available</p>
                <div className="data-head after">
                    <span className="type">Room type</span>
                    <span className="price">Avg price/night</span>
                    <span className="total">Subtotal</span>
                </div>
                <ul className="data-list after">
                    {roomlist && roomlist.map(room => <BookingResultItem room={room} {...this.props} />)}
                </ul>
                <button className="ly-close" title="Close">
                    <i className="ic-del-black" />
                </button>
            </div>
        )
    }
}

class BookingResultItem extends React.Component {
    handleBook = () => {
        const { arrivalDate, departureDate, hotelID, room, rooms } = this.props;
        const params = {
            hotelId: hotelID,
            rateCode: room.rateCode,
            arrivalDate,
            departureDate,
            rooms,
        };
        redirect(`https://${location.host}/ean/hotel/book/?${$.param(params)}`);
    }
    render() {
        const { room } = this.props;

        var price;
        var _description;
        var longDescription = '';
        if (room.supplierType == 'E') {
            price = room.chargeable.total;
            _description = room.RoomType.description;
            longDescription = room.RoomType.descriptionLong;
        } else {
            price = room.chargeable.maxNightlyRate;
            _description = room.roomTypeDescription;
        }
        const formattedPrice = "$" + parseFloat(price).toFixed(2);
        const nightlyPrice = room.supplierType == 'E' && room.nightlyrates ?
            '$' + parseFloat(room.nightlyrates[0].rate).toFixed(2) + '/night'
            :
            '';
        const description = $('<span />').html(_description).text();

        return (
           <li>
                <span className="type">
                    <b>{description}</b>
                    {room.nonRefundable && <b>* Non Refundable</b>}
                </span>
                <span className="price">{nightlyPrice}</span>
                <span className="total"><b>{formattedPrice}</b></span>
                <span rowspan="2" className="button">
                    <button className="btns-green-embo btn-bookit"
                            onClick={this.handleBook}>Book Now</button>
                </span>
                <div className="description" dangerouslySetInnerHTML={{ __html: longDescription }}/>
            </li>
        );
    }
}
