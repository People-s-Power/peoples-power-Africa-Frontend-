import { useQuery } from "@apollo/client";
import { GET_CAMPIGN_NOTICE } from "apollo/queries/campaignQuery";
import { UserAtom } from "atoms/UserAtom";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import * as timeago from "timeago.js";
import { ICampaignNotice } from "types/Applicant.types";

// const io = socketIOClient("http://localhost:8001", {
// 	path: "/api/v2/io",
// });

const CampaignNotificationComp = (): JSX.Element => {
	const [notices, setNotices] = useState<ICampaignNotice[]>([]);
	useQuery(GET_CAMPIGN_NOTICE, {
		onCompleted: (data) => setNotices(data.getCampaignNotice),
		onError: (err) => console.log(err),
	});

	// useEffect(() => {
	// 	io.on(CampaignMessage.All, (data) => setNotices((old) => [old, data]));
	// }, []);

	return (
		<Fragment>
			{notices
				?.sort((a: any, b: any) => b.createdAt - a.createdAt)
				.map((notice, i) => (
					<SingleNotice notice={notice} key={i} />
				))}
		</Fragment>
	);
};

export default CampaignNotificationComp;

const SingleNotice = ({ notice }: { notice: ICampaignNotice }) => {
	const user = useRecoilValue(UserAtom);

	return (
		<NoticeWrapper>
			<div className="wrapper">
				<img src={notice?.author?.image} className="notice-image" alt="" />
				<div>
					<small>
						<b className="me-1">
							{notice?.author?._id === user?._id
								? "You"
								: notice?.author?.firstName}
						</b>

						{notice?.action}
						<Link href={`/campaigns/${notice?.data?.slug}`}>
							<a className="text-decoration-none c-hand ms-1">
								<b> {notice?.data.title}</b>
							</a>
						</Link>
						<i className="ms-1">{timeago.format(notice?.createdAt)}</i>
					</small>
				</div>
			</div>
			<hr />
		</NoticeWrapper>
	);
};

export const NoticeWrapper = styled.div`
	.wrapper {
		display: flex;
		gap: 1rem;
		padding-top: 0.5rem;
		img {
			width: 2rem;
			height: 2rem;
			border-radius: 100%;
		}
		span,
		b {
			font-size: inherit;
		}
	}
`;
