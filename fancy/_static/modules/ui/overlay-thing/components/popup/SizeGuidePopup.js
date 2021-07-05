import React from 'react';
import { closePopup, schemeless } from 'fancyutils';

const db = { display: 'block' };
const dn = { display: 'none' };
function displayIf(condition) {
    return condition ? db : dn;
}

export default class SizeGuidePopup extends React.Component {
    static popupName = 'general_size_guide';

    constructor(props) {
        super(props);
        this.state = {
            // tab: props.thing.sales.size_chart_ids.length > 0 ? 'sizechart' : 'measure',
            tab: 'measure',
            // sizeCharts: [],
            sizeGuide: null
        };
    }

    handleCancelClick = (event) => {
        event.preventDefault();
        closePopup(SizeGuidePopup.popupName);
    }

    loadSizeGuide = () => {
        const { sales } = this.props.thing;
            
        if (this.loadingGuide || !sales.size_guide_id) {
            return;
        }
        this.loadingGuide = true;
        this.setState({ loadingGuide: true }, () => {
            $.ajax({
                type: 'GET',
                url: ` /rest-api/v1/seller/${sales.seller.id}/sizeguides/${sales.size_guide_id}`,
                data: {}
            })
            .then(size_guide => {
                if (size_guide) {
                    this.setState({ sizeGuide: size_guide })
                }
            })
            .always(() => {
                this.setState({ loadingGuide: false });
                this.loadingGuide = false;
            });
        });
    }

    componentDidMount() {
        // this.loadSizeCharts();
        this.loadSizeGuide()
    }

    componentDidUpdate(){
        $.dialog(SizeGuidePopup.popupName).center();
    }

    render() {
        const {tab, /*sizeCharts,*/ sizeGuide} = this.state;

        return (
          <div>
            <p className="ltit">{gettext('Size Guide')}</p>
            {sizeGuide &&
              <SizeGuide {...this.props} tab={tab} sizeGuide={sizeGuide}/>
            }
            <button type="button" className="ly-close" title="Close"><i className="ic-del-black"></i></button>
          </div>
        );
  }
}

export class SizeGuide extends React.Component {
    render() {
        const { tab, thing, sizeGuide } = this.props;

        return <div className="section measuring" style={displayIf(tab === 'measure')}>
          <p>Please note that the following measuring guide is provided by {thing.sales.seller.brand_name} for this specific item. </p>
          <div className="table">
            <table className="tb-type4">
              <thead>
                <tr>
                  {sizeGuide.columns.length > 0 &&
                     sizeGuide.columns.map((column, idx) => <th>{column}</th>)
                  }
                </tr>
              </thead>
              <tbody>
                {sizeGuide.rows.length > 0 &&
                  sizeGuide.rows.map((row, idx) => 
                    <tr>
                      {row.map((column, idx) => <td>{column}{idx > 0 && (sizeGuide.unit=='inch'?'″':sizeGuide.unit)}</td>)}
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
          {sizeGuide.images.length > 0 ?
            <div className="thumbnail">
              <img src={schemeless(sizeGuide.images[0].url)} alt="" />
            </div>
            :
            <div/>
          }
        </div>
    }
}
