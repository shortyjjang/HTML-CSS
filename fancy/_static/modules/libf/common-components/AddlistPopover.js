import React, { Component } from 'react';
import classnames from 'classnames';

import { KEYS, MP, getDisplay, isEmpty, alertify } from 'fancyutils';
import { Display } from 'fancymixin';


export class AddlistPopover extends Component {
    state = {
        lists: [],
        wanted: false,
        listSearchQuery: '',
        listCreationQuery: '',
        createListFocused: false,
    };

    setStateSafe(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    drawUserList(objectId) {
        objectId = objectId || this.props.objectId;
        getListCheckbox({
            merchantId: this.props.merchantId,
            objectId,
            callback: res => { this.setStateSafe(res) }
        });
    }

    handleListSearch = (event) => {
        const listSearchQuery = event.target.value;
        this.setStateSafe({ listSearchQuery });
    }

    handleListCreation = (event) => {
        event.preventDefault();
        if (event.type === 'keyup' &&
            event.which !== KEYS.ENTER) {
            return;
        }
        const listCreationQuery = $.trim(this.state.listCreationQuery);
        const { objectId, objectType, merchantId } = this.props;
        if (isEmpty(listCreationQuery)) {
            return;
        }
        // save new list
        createList({
            merchantId,
            listCreationQuery,
            callback: () => {
                this.setStateSafe({ listCreationQuery: '' }, () => {
                    this.drawUserList(objectId);
                    this.quickCreateList.focus();
                    if (objectType === 'thing') {
                        MP('Create New List', { 'thing id': objectId, 'list name': listCreationQuery, 'via': 'thing detail' });
                    }
                })
            }
        })
    }

    handleWishlistCheckboxChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const targ = event.currentTarget;
        const { objectType, objectId, handleHide } = this.props;
        const name = 'wanted';
        const params = { owned: false, wanted: targ.checked };
        const eventName = targ.checked ? "Add to List" : "Remove from List";

        if (objectType === 'thing') {
            if (params.wanted && window.dataLayer) {
                window.dataLayer.push({'event': 'Add_to_Wishlist_Check', 'product_id': undefined, 'products_info': undefined, 'products': undefined, 'revenue': undefined, 'option_id': undefined });
            }

            $.ajax(`/rest-api/v1/things/${objectId}`, { type:'PUT', data: params })
                .done(() => {
                    this.drawUserList(objectId);
                    this.setStateSafe({ wanted: params.wanted });
                    if (params.wanted) {
                        handleHide && handleHide();
                    }
                })
                .error(err => { console.warn(err); });

            MP(eventName, { 'thing id': objectId, 'list name': name, 'list id': -1, 'via': 'thing detail' });
        } else {
            console.warn('Add to list does not work with non-thing type')
            return;
        }
    }

    handleListCheckboxChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const targ = event.currentTarget;
        const isChecked = targ.checked;
        const { objectId, objectType, handleHide, merchantId } = this.props;
        const { lists } = this.state;
        const selectedListId = targ.getAttribute('data-listid')
        const collectionAction = [Number(selectedListId), targ.checked]

        if (objectType === 'thing') {
            const eventName = isChecked ? "Add to List" : "Remove from List";
            const theList = lists.filter(list => list.id === selectedListId)[0];
            const callback = () => {
                this.drawUserList(objectId);
                if (isChecked) {
                    handleHide && handleHide();
                }
                MP(eventName, { 'thing id': objectId, 'list name': theList.name, 'list id': theList.id, 'via': 'thing detail' });
            };

            if (merchantId) {
                updateList({ merchantId, objectId, collectionAction, callback })
            } else {
                const checked = [];
                const unchecked = [];
                $(this.lists).find('input[type="checkbox"]:not(.tag)').each(function() {
                    const listId = this.getAttribute('data-listid');
                    if (this.checked) {
                        checked.push(listId);
                    } else {
                        unchecked.push(listId)
                    }
                });
                updateList({ checked, unchecked, objectId, callback })
            }

        } else {
            console.warn('Add to list does not work with non-thing type')
            return;
        }
    }

    isWishlistQuery(listSearchQuery) {
        return 'wishlist'.indexOf($.trim(listSearchQuery).toLowerCase()) !== -1
    }

    handleCreateListLabelClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setStateSafe({ createListFocused: true }, () => {
            this.quickCreateList.focus();
        });
    }

    handleCreateListBlur = () => {
        this.setStateSafe({ createListFocused: false });
    }

    handleCreateListQueryChange = (event) => {
        this.setStateSafe({ listCreationQuery: event.target.value });
    }

    componentDidMount() {
        this.mounted = true;
        this.listDrawn = false;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(pp) {
        if (
            (pp.showList !== this.props.showList || this.listDrawn === false) &&
            this.props.showList === true
        ) {
            if (this.listDrawn === false) {
                this.listDrawn = true
            }
            this.drawUserList(this.props.objectId);
            setTimeout(() => {
                this.listSearchInput.focus();
            }, 0);
        }
    }

    render() {
        var { objectId, showList, headerGap, merchantId } = this.props;
        var {
            lists,
            wanted,
            listSearchQuery,
            listCreationQuery,
            createListFocused
        } = this.state;

        return (
            <div id="show-addlist" className={classnames("has-arrow more-share-popup", { bot: headerGap && (headerGap < 16 + 269) /*= tip + bubble*/ })}
                 style={getDisplay(showList)}>
                <span className="tit">{merchantId ? gettext("Add to Collection") : gettext("Add to List")}</span>
                <span className="search before-bg-share2">
                    <input ref={(element) => {this.listSearchInput = element;}}
                            type="text"
                            className="text"
                            placeholder={merchantId ? gettext('Search your collections') : gettext('Search your lists')}
                            value={listSearchQuery}
                            onChange={this.handleListSearch} />
                </span>
                <ul className="lists" ref={(element) => {this.lists = element;}}>
                    {!merchantId && <li>
                        <label htmlFor={`wanted-${objectId}`}>
                            <input type="checkbox" name="wanted"
                                   checked={wanted}
                                   id={`wanted-${objectId}`}
                                   className={`tag ${wanted ? 'checked' : ''}`}
                                   style={{ display: this.isWishlistQuery(listSearchQuery) ? null : 'none' }}
                                   onChange={this.handleWishlistCheckboxChange} /> {gettext('Wish List')}</label>
                    </li>}
                    {lists && lists.map((list, idx) => {
                        const term = $.trim(listSearchQuery).toLowerCase();
                        var style;
                        if (_.isString(term) && term.length > 0) {
                            style = Display.NoneIf(
                                list.name.toLowerCase().indexOf(term.toLowerCase()) === -1
                            );
                        }
                        const className = list.selected ? "selected" : null;
                        const ident = `${objectId}-${list.id}`;
                        return (
                            <li key={idx} style={style}>
                                <label htmlFor={ident}>
                                    <input className={className}
                                           type="checkbox" name={ident} id={ident}
                                           checked={list.selected}
                                           data-listid={list.id}
                                           onChange={this.handleListCheckboxChange} /> {list.name}</label>
                            </li>
                        )
                    })}
                </ul>
                <div className="new-list">
                    <label htmlFor="quick-create-list"
                            style={{ display: createListFocused ? 'none' : 'block' }}
                            onClick={this.handleCreateListLabelClick}>
                        <i className="icon" />{merchantId ? gettext('Create New Collection') : gettext("Create New List")}</label>
                    <input type="text"
                            id="quick-create-list"
                            ref={(element) => {this.quickCreateList = element;}}
                            onBlur={this.handleCreateListBlur}
                            onKeyUp={this.handleListCreation}
                            onChange={this.handleCreateListQueryChange}
                            value={listCreationQuery}
                            placeholder={merchantId ? gettext('Create New Collection') : gettext("Create New List")} />
                    <button className="btn-create"
                            onClick={this.handleListCreation}>{gettext("Create")}</button>
                </div>
            </div>
        );
    }
}

function getListCheckbox({ merchantId, objectId, callback }) {
    if (merchantId) {
        $.get(`/rest-api/v1/seller/${merchantId}/collections`, { selected_object_id: objectId }).done(({ collections } = {}) => {
            let lists;
            if (collections.length > 0) {
                lists = collections.sort((a, b) => {
                    var aText = $.trim(a).toLowerCase();
                    var bText = $.trim(b).toLowerCase();
                    return aText < bText ? -1 : 1;
                }).map(({ id, name, selected }) => {
                    return {
                        id,
                        name,
                        selected
                    };
                })
            } else {
                lists = [];
            }
            callback && callback({ lists, wanted: null });
        })
        .error(err => { console.warn(err); });
    } else {
        $.get('/_get_list_checkbox.html', { tid: objectId }).done(html => {
            const $html = $(html);
            const $items = $html.filter('li').find('img').remove().end();
            var lists;
            if ($items.length > 0) {
                lists = $items.sort((a, b) => {
                    var aText = $.trim($(a).text()).toLowerCase();
                    var bText = $.trim($(b).text()).toLowerCase();
                    return aText < bText ? -1 : 1;
                }).map((_, item) => {
                    var $item = $(item);
                    return {
                        id: $item.find('label').attr('for'),
                        name: $.trim($item.find('label').text()),
                        selected: $item.find('input').prop('checked'),
                    };
                }).get();
            } else {
                lists = [];
            }
            const wanted = $html.filter('input[name="wanted"]').val() === 'true';
            callback && callback({ lists, wanted });
        })
        .error(err => { console.warn(err); });
    }
}


function createList({ merchantId, listCreationQuery, callback }) {
    if (merchantId) {
        $.post(`/rest-api/v1/seller/${merchantId}/collections`, { list_name: listCreationQuery })
            .done(res => {
                // if ($(res).find("created").text() == 'False') {
                // if (false){
                //     alertify.alert(`List Title Not Available`, `There is already a list named ${listCreationQuery}. Try again with a different name.`);
                // } else {
                    callback && callback();
                // }
            })
            .error(err => { console.warn(err); });
    } else {
        $.post('/create_list.xml', { list_name: listCreationQuery, reaction: 0 })
            .done(res => {
                if ($(res).find("created").text() == 'False') {
                    alertify.alert(`<b>List Title Not Available</b><br><br>There is already a list named ${listCreationQuery}. Try again with a different name.`);
                } else {
                    callback && callback();
                }
            })
            .error(err => { console.warn(err); });
    }
}

function updateList({ merchantId, collectionAction, objectId, checked, unchecked, callback }) {
    if (merchantId) {
        const [collectionId, add] = collectionAction
        $.ajax({
            url: `/rest-api/v1/seller/${merchantId}/collections/${collectionId}`,
            type: 'POST',
            data: {
                object_id: objectId,
                action: add ? 'add': 'remove',
            },
        })
        .done(callback)
        .error(err => { console.warn(err); })
    } else {
        $.post('/save_list_items', {
            tid: objectId,
            checked_list_ids: checked.join(','),
            unchecked_list_ids: unchecked.join(',')
        })
        .done(callback)
        .error(err => { console.warn(err); })
    }
}
