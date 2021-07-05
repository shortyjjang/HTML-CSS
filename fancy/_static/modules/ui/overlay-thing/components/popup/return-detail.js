import React from 'react';

export default class ReturnPolicyDetailPopup extends React.Component {
    static popupName = 'policy_detail';

    render() {
        const { sales } = this.props;
        return (
            <div>
                <p className="ltit">{gettext('Return policy')}</p>
                <div className="terms">
                    {sales.shipping_policy &&
                        <p>{sales.shipping_policy}</p>
                    }
                </div>
                <button className="ly-close" title="Close"><i className="ic-del-black" /></button>
            </div>
        );
    }
}
