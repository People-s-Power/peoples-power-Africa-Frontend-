import Link from "next/link";
import React from "react";
import styled from "styled-components";
// import { ICampaign } from "types/Applicant.types";
// import { truncateWord } from "utils";

const CampaignCard = ({ camp }: { camp: any }): JSX.Element => {
	function isValidUrl(string: any) {
		try {
			new URL(string);
			return true;
		} catch (err) {
			return false;
		}
	}
	return (
		<div className="lg:w-[23%] my-2 overflow-hidden bg-[#FBFBFB] rounded-md w-full">
			<a className="text-decoration-none link-dark">
				<img src={camp?.image[0]} className="card-image h-52 w-full" alt={camp?.title} />
				<div className="card-body p-3">
					<p className="card-title fs-5 fw-bold text-[#4F4F4F] capitalize">
						{camp?.title?.length > 30
							? `${camp?.title?.slice(0, 30)}...`
							: camp?.title}
					</p>
					<p className="card-text break-all text-[#666666] my-2">{camp?.body.substring(0, 230)}</p>
					<Link href={`/campaigns/${camp?.slug}`}>
						<button className="text-warning text-xs">Read More</button>
					</Link>
				</div>
			</a>
		</div>
	);
};

export default CampaignCard;
