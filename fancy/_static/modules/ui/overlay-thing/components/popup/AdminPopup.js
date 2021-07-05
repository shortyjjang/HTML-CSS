import React from 'react';
import { Display } from "fancymixin";
import classnames from 'classnames';
import { xmlUtil } from "fancyutils";

export default class AdminPopup extends React.Component {
    static popupName = 'thing-admin';
    state = {
        show_on_homepage: null,
        date_published: null, 
        exclude_from_popular: false,
        show_in_search: true,
        optionSaving: false,
        ownerSaving: false,
        mergeSaving: false,
    };
    
    
    componentDidMount() {
        const that = this;
        $.dialog(AdminPopup.popupName).$obj.on('open', () => {
            const { thing: { show_on_homepage, date_published, exclude_from_popular, show_in_search }  } = that.props;
            that.setState( { show_on_homepage, date_published, exclude_from_popular, show_in_search } );
        });
    }

    componentDidUpdate(prevProps, prevState){
        $.dialog(AdminPopup.popupName).center();
    }
    
    handleSaveOptions = () => {
        const { thing } = this.props;
        const { show_on_homepage, date_published, exclude_from_popular, show_in_search, optionSaving } = this.state;
        if (optionSaving) return false;
        const payload = { thing_id: thing.id, show_on_homepage, exclude_from_popular, show_in_search }
        if (show_on_homepage) {
            let inputDate = new Date(date_published);
            if (isNaN(inputDate)) {
                alert("invalid date - must be in format of 2020-01-01 10:10:10");
                return false;
            }            
            payload['date_published'] = inputDate.toISOString().replace(/T/, " ").split(".")[0];
        }
        this.setState({optionSaving:true});
        $.post('/manage-newthing.json', payload).then((json) => {
            if (json.status_code == 1) {
                Object.assign(thing, payload);
                alert("Updated!");
            } else {
                alert(json.message || "Failed to save the changes");
            }
            this.setState({optionSaving:false})
        }).fail(() => {
            alert("Something went wrong!");
            this.setState({optionSaving:false})
        });
    }

    handleChangeOwner = () => {
        const { thing } = this.props;
        if (this.state.ownerSaving) return false;
        if (this.changeOwnerEl == null) return false;
        const new_owner = this.changeOwnerEl.value.trim();
        if (new_owner.length == 0) {
            alert("Please enter a username.");
            return false;
        }
        if (new_owner.toLowerCase() == thing.thing_owner.username.toLowerCase()) {
            alert("The thing is already owned by the user.");
            return false;
        }

        if (window.confirm(`Do you want to change the current thing's owner to ${new_owner}?`)) {
            this.setState({ownerSaving: true})
            $.ajax({
                type: "post",
                url: "/change_new_thing_owner.xml",
                data: { new_owner_name: new_owner, thing_id: thing.id, new_thing_id: thing.ntid, old_user_id: thing.thing_owner.id },
                dataType: "xml"
            })
                .done(xml => {
                    if (xmlUtil.isSuccess(xml)) {
                        alert("Done!");
                        location.reload();                        
                    } else if (xmlUtil.isFail(xml)) {
                        alert(
                            $(xml)
                                .find("message")
                                .text()
                        );
                    }
                })
                .fail(() => {
                    alert("There was an error.");
                })
                .always(() => {
                    this.setState({ownerSaving: false})
                });
        }
        return false;
    }

    handleMergeThings = () => {

    }

    render() {
        const { 
            thing, 
            thing: { sales },
        } = this.props;
        const { show_on_homepage, date_published, exclude_from_popular, show_in_search, optionSaving, ownerSaving, mergeSaving } = this.state;
        return (
          <>
          	<p className="ltit">{thing.name}</p>
            <div className="thing-admin-body">
                <ul className="thing-info">
                <li><em>Sale ID</em> {sales.id}</li>
                    <li><em>Thing ID</em> {thing.id}</li>
                    <li><em>Thing Owner</em> {thing.thing_owner.username}</li>
                    <li className="buttons">
                        <a className="btns-blue-embo" href={`/merchant/products/${sales.id}`} target="_blank">Edit Sale</a>
                        <a className="btns-gray-embo" href={`/admin/view-sale-orders-by-thing-id?thing_id=${thing.id}`} target="_blank">View Orders</a>
                        <a className="btns-gray-embo" href={`/admin/view-users-by-cart-item?sale_id=${sales.id}`} target="_blank">View Carts</a>
                    </li>
                </ul>
                <div className="thing-options">
                    <p>
                        <label><input type="checkbox" name="show-on-homepage" checked={!!show_on_homepage}
                        onChange={(event) => this.setState({ show_on_homepage: event.target.checked })}
                        /> Show on Homepage</label>
                        <input className="text" type="text" name="date-published" placeholder="2020-01-02 10:20:30"
                            style={Display.NoneIf(!show_on_homepage)} value={date_published || ''}
                            onChange={(event) => {this.setState({ date_published: event.target.value })}}
                            />
                    </p>
                    <p>
                        <label><input type="checkbox" name="exclude-from-popular" checked={!!exclude_from_popular}
                            onChange={(event) => this.setState({ exclude_from_popular: event.target.checked })}
                        /> Exclude from Popular</label>
                    </p>
                    <p>
                        <label><input type="checkbox" name="show-in-search" checked={!!show_in_search}
                            onChange={(event) => this.setState({ show_in_search: event.target.checked })}
                        /> Show in Search</label>
                    </p>
                    <p>
                        <button className={classnames("btns-blue-embo", { "loading": optionSaving })} onClick={this.handleSaveOptions}>Save Changes</button>
                    </p>                    
                </div>
                <div className="thing-actions">
                    <p>
                        <label>Change Owner</label>
                        <input type="text" name="change_owner" placeholder="Enter new username" ref={(el) => {this.changeOwnerEl = el; }}/>
                        <button className={classnames("btns-blue-embo", { "loading": ownerSaving })} onClick={this.handleChangeOwner}>Change</button>
                    </p>
                    {/*
                    <p>
                        <label>Merge Things</label>
                        <input type="text" name="merge_thing_id" placeholder="Enter Thing ID" ref={(el) => {this.mergeThingEl = el; }}/>
                        <button className={classnames("btns-blue-embo", { "loading": mergeSaving })} onClick={this.handleMergeThings}>Merge</button>
                    </p>*/}
                </div>

            </div>
            <button className="ly-close" title="Close"><i className="ic-del-black"></i></button>
          </>
        );
    }
}