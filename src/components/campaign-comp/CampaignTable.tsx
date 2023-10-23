import { UserCampaignAtom } from "atoms/UserAtom";
import ShareIcon from "components/ShareIcon";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import {
	FacebookShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} from "react-share";
import { useRecoilValue } from "recoil";
import { Dropdown } from "rsuite";
import styled from "styled-components";
import { ICampaign } from "types/Applicant.types";
import { BASEURL } from "utils/constants";

const CampaignTable = ({ campaigns }: { campaigns: any }): JSX.Element => {
	// const campaigns = useRecoilValue<ICampaign[]>(UserCampaignAtom);
	// console.log(campaigns);
	return (
		<div>
			<div className="container">
				<Table className="table table-striped">
					<thead className="thead bg-warning text-white">
						<tr className="table-row">
							<th>All Campaigns</th>
							<th>Date Created</th>
							<th> Status </th>
							<th className="text-center">Promotion <br /> Amount | Target</th>
							{/* <th> Promotion target  </th> */}
							<th> Views </th>
							<th> Endorsements </th>
							<th> Action </th>
						</tr>
					</thead>
					<tbody className="tbody">
						{campaigns?.map((camp: any, i: any) => (
							<SingleRow key={i} camp={camp} />
						))}
					</tbody>
				</Table>
			</div>
		</div>
	);
};

export default CampaignTable;

const Table = styled.table`
	.tbody {
		.table-row {
			a {
				img {
					width: 3rem;
					object-fit: cover;
					margin-right: 1rem;
				}
			}
		}
	}
`;

const SingleRow = ({ camp }: { camp: ICampaign }) => {

	return (
		<tr className="table-row">
			<td className="w-80">
				<Link href={`/campaigns/${camp?.slug}`}>
					<a className="text-decoration-none link-dark">
						<img src={camp?.image[0] || camp?.asset[0]?.url} alt="" />
						{camp?.title || camp?.caption || camp?.name || camp.body.slice(0, 50)}
					</a>
				</Link>
			</td>
			<td>{dayjs(camp?.createdAt).format("DD/MM/YYYY")}</td>
			<td>
				<i
					className={`fas me-2 ${camp?.status === "Pending"
						? "text-warning fa-dot-circle"
						: "text-success fa-check-circle"
						}`}
				></i>
			</td>
			<td className="text-center">{camp?.numberOfPaidViewsCount + "  |  " + camp.views.length}</td>
			<td> {camp?.views?.length} </td>
			<td> {camp?.endorsements?.length} </td>

			<td>
				<Dropdown placement="rightStart" title={<img className="h-6 w-6" src="/images/edit.svg" alt="" />} noCaret>
					<Dropdown.Item><Link href={`/promote?slug=${camp?._id}&views`}>
						<a className="p-0">{camp?.promoted ? "Upgrade" : "Promote"}</a>
					</Link>
					</Dropdown.Item>
					<Dropdown.Item><Link href={`/${camp.__typename}?page=${camp._id}`}>
						<a className=" p-0">Edit</a>
					</Link>
					</Dropdown.Item>
					<Dropdown.Item>
						<Link href={`/${camp.__typename}?page=${camp._id}`}>
							<a className=" p-0">Delete</a>
						</Link>
					</Dropdown.Item>
					<Dropdown.Item>
						<CampaignShareMenuList camp={camp}>
							<span className="">
								Share
							</span>
						</CampaignShareMenuList>
					</Dropdown.Item>
				</Dropdown>
			</td>
		</tr >
	);
};

export const CampaignShareMenuList = ({
	camp,
	children,
	...props
}: {
	camp: ICampaign;
	children: React.ReactChild;
}): JSX.Element => {
	return (
		<div className="dropdown">
			<span data-bs-toggle="dropdown" {...props}>
				{children}
			</span>
			<ul className="dropdown-menu m-0 ">
				<li className="dropdown-menu-item mb-2 ">
					<FacebookShareButton url={`${BASEURL}/campaigns/${camp?.slug}`}>
						<button className="btn py-0 ">
							<i className="fab fa-facebook-f text-facebook me-2"></i>
							Facebook
						</button>
					</FacebookShareButton>
				</li>
				<li className="dropdown-menu-item mb-2 ">
					<TwitterShareButton url={`${BASEURL}/campaigns/${camp?.slug}`}>
						<button className="btn py-0 ">
							<i className="fab fa-twitter text-twitter me-2"></i> Twitter
						</button>
					</TwitterShareButton>
				</li>
				<li className="dropdown-menu-item mb-2 ">
					<WhatsappShareButton url={`${BASEURL}/campaigns/${camp?.slug}`}>
						<button className="btn py-0 ">
							<i className="fab fa-whatsapp text-whatsapp me-2 "></i>
							Whatsapp
						</button>
					</WhatsappShareButton>
				</li>
			</ul>
		</div>
	);
};
