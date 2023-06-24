import Link from "next/link";
import React from "react";

interface IProps {
  img: string;
  name: string;
}

const Action = (camp: IProps): JSX.Element => {
  return (
    <>
      <div className="camp-card my-4 border-left border-right">
        <div className="card-img d-flex justify-content-center">
          <img src={`images/${camp.img}.png`} alt="" />
        </div>
        <h2 className="text-center my-2 font-weight-bolder">{camp.name}</h2>
        <div className="camp-btn d-flex justify-content-center my-2">
          <Link href="/upload">
            <button className="btn _camp-btn text-capitalize font-weight-bold">
              take action
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Action;
