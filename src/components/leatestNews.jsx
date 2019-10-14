import React from "react";
import LatestNewsItem from "./latestNewsItem";

const LeatestNews = ({ news }) => {
  return (
    <React.Fragment>
      <div className="lattest-news-section">
        <div className="container">
          <div className="setion-title-two">
            <h5>Latest News</h5>
          </div>
          <div className="row">
            {news.map(newsObj => (
              <LatestNewsItem key={newsObj.title} newsObj={newsObj} />
            ))}
          </div>
        </div>
      </div>
      {/* <!-- lattest-news-section --> */}
    </React.Fragment>
  );
};

export default LeatestNews;
