import FrontLayout from "layout/FrontLayout";
import React, { useState } from "react";

const finallaunch = () => {
  return (
    		<FrontLayout showFooter={false}>

      <>
        <div className="finalsec-wrap py-5">
          <div className="container">
            <div className="love-img d-flex justify-content-center mb-4 py-3">
              <img src="images/love 1.svg" alt="" />
            </div>
            <div className="finalsec-txt text-center py-3 mb-3 ">
              Interesting choice! <br /> Sharing this campaign will Help gain
              <br />
              more supporters and endorsements.
            </div>
            <div className="num-of-end text-muted text-center py-2 mb-3 ">
              172,760 new endorsements were added to <br /> this campaign.
              Thanks to the people who <br /> shared it. Join them and help this
              campaign <br /> reach its desired target and goal!
            </div>
            <div className="final-sec-share mb-3 py-4 d-flex justify-content-center">
              <div className="share-btn-wrap py-3">
                <div className="facebook-btn bbn  justify-content-center align-items-center mb-3 text-center">
                  <span>Send and share message on Facebook</span>
                </div>
                <div className="twitter-btn bbn  justify-content-center align-items-center mb-3 text-center">
                  <span>Tweet on twitter</span>
                </div>
                <div className="email-btn bbn justify-content-center align-items-center mb-3 text-center">
                  <span>Send as Email</span>
                </div>
                <div className="bbn mb-3 position-relative">
                  <input
                    type="text"
                    className="form-control"
                    readOnly={true}
                    disabled={true}
                    placeholder="https//edfhr/fjeskjirhgjgkkkdddkkkdk"
                  />
                  <button
                    className="btn text-light font-weight-bold Copy link  rounded-0 position-absolute btn-outline-light "
                    style={{ background: "#18C73E", right: 0 }}
                  >
                    Copy link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </FrontLayout>
  );
};

export default finallaunch;
