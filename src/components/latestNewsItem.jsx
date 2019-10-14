import React from "react";
import { Link } from "react-router-dom";

const LatestNewsItem = ({ newsObj }) => {
  return (
    <div key={newsObj.date} className="col-lg-4 col-md-6">
      <article className="post-style-one">
        <span className="post-metat-date">{newsObj.date}</span>
        <h4 className="post-title">
          <Link to="./news-details.html">{newsObj.title}</Link>
        </h4>
        <p className="post-entry">{newsObj.description}</p>
        <Link to="./news-details.html" className="post-link">
          {newsObj.readMore}
        </Link>
      </article>
    </div>
  );
};

export default LatestNewsItem;
