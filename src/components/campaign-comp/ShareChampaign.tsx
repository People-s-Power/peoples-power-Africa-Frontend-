import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Clipboard from "react-clipboard.js";
import {
	EmailShareButton,
	FacebookShareButton,
	TwitterShareButton,
} from "react-share";
import styled from "styled-components";
import { ICampaign } from "types/Applicant.types";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASEURL } from "utils/constants";
import { useRecoilValue } from "recoil";
import { UserAtom } from "atoms/UserAtom";
import { apollo } from "apollo";

const GET_CAMPAIGN = gql`
	query ($slug: String) {
		getCampaign(slug: $slug) {
			title
			slug
			id
			endorsements {
				id
			}
		}
	}
`;

const ShareChampaign = (): JSX.Element => {
	const router = useRouter();
	const { query } = router;
	const [campaign, setCampaign] = useState<ICampaign>();
	const [link, setLink] = useState("");
	const [title, setTitle] = useState("");
	const user = useRecoilValue(UserAtom);

	useQuery(GET_CAMPAIGN, {
		variables: { slug: query?.slug },
		client: apollo,
		onCompleted: (data) => {
			setCampaign(data.getCampaign);
			// console.log(data.getCampaign)
			// setLink(
			// 	process.env.NODE_ENV === "production"
			// 		? `https://edfhr.org/campaigns/${data?.getCampaign?.slug}`
			// 		: `https://www.peoplespow.com/campaigns/${data?.getCampaign?.slug}`,
			// );
			setTitle(data?.getCampaign?.title);
		},
		onError: (err) => console.log(err),
	});

	const handleShareClosed = () => {
		toast(
			"You can start another campaign or promote your campaign to gain audience",
		);
		localStorage.clear();
		router.push(`/user?page=${user.id}`);
	};
	// if (loading) return <p className="mt-3">Loading...</p>;
	return (
		<Wrapper className="finalsec-wrap py-5">
			<div className="container">
				<div >
					<img className="h-96 m-auto" src="/images/pana.png" alt="" />
				</div>
				<div className="finalsec-txt text-center py-3 mb-3 ">
					Interesting choice! <br /> Sharing this campaign will Help gain
					<br />
					more supporters and endorsements.
				</div>
				<div className="num-of-end text-muted text-center py-2 mb-3 ">
					{Number(campaign?.endorsements?.length) + 1} new endorsement(s) were
					added to <br /> this campaign. Thanks to the people who <br /> shared
					it. Join them and help this campaign <br /> reach its desired target
					and goal!
				</div>
				<div className="button">
					<FacebookShareButton
						url={`${BASEURL}/campaigns/${campaign?.slug}`}
						onShareWindowClose={handleShareClosed}
					>
						<div className="d-grid">
							<button className="btn btn-facebook rounded-pill py-2">
								{" "}
								<i className="fab fa-facebook-f me-3"></i> share message on
								Facebook
							</button>
						</div>
					</FacebookShareButton>
					<TwitterShareButton url={`${BASEURL}/campaigns/${campaign?.slug}`} onShareWindowClose={handleShareClosed}>
						<div className="d-grid">
							<button className="btn btn-twitter rounded-pill py-2">
								{" "}
								<i className="fab fa-twitter me-3"></i>
								Tweet on twitter
							</button>
						</div>
					</TwitterShareButton>
					<EmailShareButton url={`${BASEURL}/campaigns/${campaign?.slug}`} subject={title} body={link}>
						<div className="d-grid">
							<button className="btn btn-warning rounded-pill py-2 fw-bold text-light">
								<i className="fas fa-envelope me-3"></i>
								Send as Email
							</button>
						</div>
					</EmailShareButton>
					<div className="input-group rounded-pill mt-3">
						<input
							type="text"
							className="form-control rounded-2"
							value={`${BASEURL}/campaigns/${campaign?.slug}`}
							disabled
						/>
						<Clipboard
							className="btn btn-primary "
							data-clipboard-text={`${BASEURL}/campaigns/${campaign?.slug}`}
							onSuccess={() => console.log(link)}
						>
							Copy link
						</Clipboard>
					</div>
					<div className="mt-3 text-center">
						<a href="/" className="text-decoration-none text-inherit">
							Go home
						</a>
					</div>
				</div>
			</div>
			<ToastContainer />
		</Wrapper>
	);
};

export default ShareChampaign;

const Wrapper = styled.div`
	.button {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 25rem;
		margin: auto;

		.btn-facebook {
			background: #0045f5;
			color: white;
			font-weight: bold;
		}
		.btn-twitter {
			background: #2fb4ff;

			color: white;
			font-weight: bold;
		}

		.btn {
			margin: 0.3rem 0;
		}
		.input-group-append {
			.btn {
				margin: 0;
			}
		}
	}
`;
