import React, { Component } from "react";
import NewsHeadline from "./newsHeadline";
import { highlights } from "../services/custom";
class HighLightWedget extends Component {
  state = {};

  componentDidMount() {
    highlights();
  }

  render() {
    const { highlights } = this.props;
    return (
      <React.Fragment>
        {/* <!-- Graph --> */}
        <div className="graph graph-padding">
          <div className="container">
            <div className="row margin-balance">
              {highlights.map(highlight => (
                <div key={highlight.currency} className="col-lg-3 col-6">
                  <a href="#s" className="graph-item-block">
                    <div className="graph-item">
                      <div className="graph-content">
                        <h5>{highlight.currency}</h5>

                        <div className="lastprice">
                          <span className={`price-change ${highlight.color}`}>
                            {highlight.priceChange}
                          </span>
                          <span className="transmoney">
                            {highlight.transmoney}
                          </span>
                        </div>
                        <span className="volume">
                          Volume:{highlight.volume}
                        </span>
                      </div>
                      <div className="graph-chart">
                        <span className={highlight.updatingChartClass}>
                          {highlight.updatingChart}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          {/* <NewsHeadline /> */}
        </div>
      </React.Fragment>
    );
  }
}

export default HighLightWedget;
