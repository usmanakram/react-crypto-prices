import React, { Component } from "react";
import { newsHeadlinesSlider } from "../services/custom";
class NewsHeadLine extends Component {
  state = {};

  componentDidMount() {
    newsHeadlinesSlider();
  }

  render() {
    const news = [
      { headline: " Nam dignissim auctor In sit amet lacinia", _id: "1" },
      { headline: " Nam dignissim auctor In sit amet lacinia", _id: "2" },
      { headline: " Nam dignissim auctor In sit amet lacinia", _id: "3" },
      { headline: " Nam dignissim auctor In sit amet lacinia", _id: "4" }
    ];
    return (
      <React.Fragment>
        {/*<!-- graph-block --> */}
        <div className="news-headline-block mt-3">
          <div className="container">
            <div className="row">
              <div className="col-lg-1 col-md-2">
                <span className="news-tags">News</span>
              </div>
              <div className="col-lg-11 col-md-10">
                <div className="news-headlines-block">
                  <div
                    className="news-headlines-slider"
                    id="news_headlines_slider"
                  >
                    {news.map(headline => (
                      <div key={headline._id}>
                        <a href="./news-details.html">{headline.headline}</a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewsHeadLine;
