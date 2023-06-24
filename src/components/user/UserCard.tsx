import React from "react";
import { Strapi_Lawyer } from "types/Applicant.types";

const UserCardComp = ({ user }: { user: Strapi_Lawyer }): JSX.Element => {
	return (
		<div className="card user-card">
			<img className="card-img-top" src={user?.image?.url} alt="" />
			<div className="card-body">
				<div className="pt-2">
					<p className="fs-5 mb-0 fw-bold text-capitalize ">{user?.name}</p>
					<p>{user?.state}</p>
				</div>
			</div>
		</div>
	);
};

export default UserCardComp;
