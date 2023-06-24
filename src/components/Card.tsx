import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import { ICampaign } from "types/Applicant.types";
import { CardImg } from "./styled/style";

const cardComp = ({ camp }: { camp: ICampaign }): JSX.Element => {
	console.log(camp)
	return (
		<>
			<div className="col">
				<div className="card rounded h-100 bg-white border-0">
					<CardImg className="card-img">
						<img
							src={camp?.image ? camp.image : "/images/Rectangle.png"}
							alt=""
						/>
					</CardImg>

					<div className="card-body">
						<Link href={`/campaigns/${camp?.slug}`}>
							<a
								className="card-title d-block mb-3 fw-bold text-dark  text-decoration-none"
								style={{ fontSize: "1.5rem" }}
							>
								{camp.title}
							</a>
						</Link>

						<ReactMarkdown className="card-text text-dark">
							{camp?.excerpt}
						</ReactMarkdown>
						<a className=" text-warning fw-bold text-decoration-none">
							Endorse Campaign
						</a>
						<p className="">{camp?.endorsements?.length || "Not"} Endorsed</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default cardComp;
