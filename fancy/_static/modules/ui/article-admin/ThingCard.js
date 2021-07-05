import React from 'react';


export class ThingCard extends React.Component {
    state = {
        thing: null,
    };

    componentDidMount() {
        $.get(`/rest-api/v1/things/${this.props.tid}${window.isWhitelabel ? '?sales=true' : ''}`)
            .then(thing => {
                this.setState({ thing });
            });
    }

    handleRemove = () => {
        const { tid } = this.props

        const $selected = $(`.popup.add_thing_item dd li[data-tid="${tid}"].selected`)
        $selected.removeClass('selected')
        $selected.find('input').prop('checked', false)

        this.props.onRemove(tid)
    }
 
    getURL() {
        const { thing } = this.state;
        if (window.isWhitelabel && thing.sales) {
            return `${encodeURI(thing.name)}/p/${thing.sales.id}`
        } else {
            const { thing } = this.state;
            return `/things/${thing.id}`
        }
    }

    render() {
        const { thing } = this.state;
        if (this.state.thing) {
            return (
              <li>
                <button className="remove" onClick={this.handleRemove} />
                <div className="figure-item">
                  <figure>
                    <a href={this.getURL()}>
                      <span className="back" />
                      <span className="figure grid" style={{backgroundImage: `url('${thing.image.src}')`}} />
                    </a>
                  </figure>
                  <figcaption>
                    <a href={this.getURL()} className="title">{thing.name}</a>
                    {thing.sales && 
                        <em className="figure-detail">
                            <span className="price ">${thing.sales.price} </span>
                        </em>
                    }
                  </figcaption>
                </div>
              </li>
            );
        } else {
            return null;
        }
    }
}

export const ThingCardPlaceholder = _ => <li>
    <div className="figure-item placeholder" />
</li>
