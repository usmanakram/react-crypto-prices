import React from "react";

const ActivitySection = ({ activities }) => {
  return (
    <React.Fragment>
      <div className="activity-section">
        <div className="container">
          <div className="row">
            {activities.map(activitie => (
              <div key={activitie.img} className="col-md-6">
                <div className="activity-block">
                  <img
                    src={activitie.img}
                    alt="img"
                    className="img-responsive"
                  />
                  <h4>{activitie.title}</h4>
                  <p>{activitie.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ActivitySection;
