import React, { Component } from 'react';
import classnames from 'classnames';

import { closePopup, KEYS, MP, isEmpty, alertify } from 'fancyutils';
import { Display } from 'fancymixin';

export default class AddlistPopup extends Component {
    static popupName = 'add-list';
    state = {
        lists: [],
        listSearchQuery: '',
        listCreationQuery: '',
        listCreating: false,
    };

    handleDialogOpen = () => {
        this.setState({ lists: [], listSearchQuery: '', listCreationQuery: '' });
        this.drawUserList()
        setTimeout(() => {
            this.listSearchInput.focus();
        }, 0);

    }
    componentDidMount() {
        $.dialog(AddlistPopup.popupName).$obj.on('open', this.handleDialogOpen);
    }

    componentDidUpdate(prevProps, prevState){
        $.dialog(AddlistPopup.popupName).center();
    }

    drawUserList() {
        const objectId = this.props.objectId;
        getListCheckbox({
            objectId,
            callback: res => { this.setState(res) }
        });
    }

    handleListSearch = (event) => {
        const listSearchQuery = event.target.value;
        this.setState({ listSearchQuery });
    }

    handleListCreation = (event) => {
        event.preventDefault();
        if (this.state.listCreating) return;
        if (event.type === 'keyup' &&
            event.which !== KEYS.ENTER) {
            return;
        }
        const listCreationQuery = $.trim(this.state.listCreationQuery);
        const { objectId } = this.props;
        if (isEmpty(listCreationQuery)) {
            return;
        }
        this.setState({ listCreating: true })
        // save new list
        updateList({
            objectId,
            createList: listCreationQuery,
            callback: (success, updated) => {
                if (success) {
                    const { lists } = this.state;
                    MP('Create New List', { 'thing id': objectId, 'list name': listCreationQuery, 'via': 'thing detail' });
                    this.setState( {
                        listCreationQuery: '', listCreating: false,
                        lists: [ ...updated, ...lists ],
                    });
                }
            }
        })
    }

    handleListItemToggle = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const targ = event.currentTarget;
        const { objectId } = this.props;
        const { lists } = this.state;
        const selectedListId = Number(targ.getAttribute('data-listid'));
        const theList = lists.filter(list => list.id === selectedListId)[0];
        const prevAdded = theList.added;
        theList.added = !theList.added;
        const eventName = theList.added ? "Add to List" : "Remove from List";
        this.setState({ lists })

        const callback = (success, updated) => {
            const { lists } = this.state;
            if (success) {
            } else {
                const theList = lists.filter(list => list.id === selectedListId)[0];
                theList.added = prevAdded;
            }
            this.setState({ lists })
            MP(eventName, { 'thing id': objectId, 'list name': theList.name, 'list id': theList.id, 'via': 'thing detail' });
        };

        const update = { objectId, callback };

        if (theList.added) update['checked'] = [theList.id];
        else update['unchecked'] = [theList.id];
        updateList(update)
    }

    handleCreateListQueryChange = (event) => {
        this.setState({ listCreationQuery: event.target.value });
    }

    render() {
        var { objectId } = this.props;
        var {
            lists,
            listSearchQuery,
            listCreationQuery,
            listCreating,
        } = this.state;

        return (
            <>
                <p className="ltit">Add to collections</p>
                <fieldset className="search">
                    <input type="text" placeholder="Search" className="text" 
                        value={listSearchQuery} ref={(element) => {this.listSearchInput = element;}}
                        onChange={this.handleListSearch} />
                </fieldset>
                <div className="list">
                    <ul ref={(el) => {this.lists = el;}}>
                    {lists && lists.map((list, idx) => {
                        const term = $.trim(listSearchQuery).toLowerCase();
                        var style;
                        if (_.isString(term) && term.length > 0) {
                            style = Display.NoneIf(
                                list.name.toLowerCase().indexOf(term.toLowerCase()) === -1
                            );
                        }
                        const ident = `${objectId}-${list.id}`;
                        return (
                            <li key={idx} style={style} className={classnames({ "added": list.added })}>
                                <label>{list.name}</label>
                                <button
                                    data-listid={list.id} 
                                    onClick={this.handleListItemToggle}
                                    className="btns-blue-embo">{list.added ? "Remove" : "Add"}</button>
                            </li>
                        )
                    })}
                    </ul>
                </div>
                <fieldset className="create">
                    <input 
                        type="text" placeholder="Create new collection" 
                        ref={(element) => {this.quickCreateList = element;}}
                        onKeyUp={this.handleListCreation}
                        onChange={this.handleCreateListQueryChange}
                        value={listCreationQuery}/>
                    <button className={classnames("btn-create", { "loading": listCreating })} style={Display.NoneIf($.trim(listCreationQuery).length == 0)}
                        onClick={this.handleListCreation}>{gettext("Create")}</button>
                </fieldset>
                <button className="ly-close" title="Close"><i className="ic-del-black"></i></button>
            </>
        );
    }
}

function getListCheckbox({ objectId, callback }) {
    $.get('/get_list_checkbox.json', { tid: objectId }).done(resp => {
        if (resp.status_code == 0) {
            alertify.alert(resp.message || "Please try again later.");
            closePopup(AddlistPopup.popupName);
        }
        callback && callback({ lists: resp.lists })
    },)
    .error(err => { 
        alertify.alert("Please try again later.");
        console.warn(err); 
        closePopup(AddlistPopup.popupName);
    });
}

function updateList({ objectId, checked, unchecked, createList, callback }) {
    const payload = { tid: objectId };
    if (checked) payload['add_list_ids'] = checked.join(',');
    if (unchecked) payload['remove_list_ids'] = unchecked.join(',');
    if (createList) payload['new_list'] = createList;

    $.post('/update_list_checkbox.json', payload)
    .done(resp => {
        if (resp.status_code == 0) {
            alertify.alert(resp.message || "Please try again later.");
            callback(false, null);
        } else {
            callback(true, resp.lists);
        }
    })
    .error(err => { 
        console.warn(err); 
        alertify.alert("Please try again later.");
        callback(false, []);
    })
}
