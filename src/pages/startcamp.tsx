import React, { useEffect, useState, Fragment } from 'react';
import AddCampaign from "components/campaign-comp/AddCampaign";
import FrontLayout from "layout/FrontLayout";
import { useRouter } from "next/router";
import styled from "styled-components";
import Head from "next/head";
import axios from 'axios';
import { IOrg } from "types/Applicant.types";
import { UserAtom } from "atoms/UserAtom";
import { GET_ORGANIZATIONS, GET_ORGANIZATION } from "apollo/queries/orgQuery";
import { apollo } from "apollo";
import { useRecoilValue } from "recoil";
import { useQuery } from "@apollo/client";

const StartCampPage = (): JSX.Element => {
	const { query } = useRouter();
	const [account, setAccount] = useState("")
	const [orgs, setOrgs] = useState<IOrg[]>([])
	const [org, setOrg] = useState<IOrg[]>([])
	const author = useRecoilValue(UserAtom);
    const [orgId, setOrgId] = useState("")

	useQuery(GET_ORGANIZATIONS, {
		variables: { ID: author?.id },
		client: apollo,
		onCompleted: (data) => {
			// console.log(data)
			setOrgs(data.getUserOrganizations)
		},
		onError: (err) => console.log(err),
	});


	const singleOrg = (id: string) => {
		axios.get(`/orgs/${id}`)
			.then(function (response) {
				setOrg(response.data)
			})
			.catch(function (error) {
				console.log(error);
			})
	}

	return (
		<Fragment>
			<Head>
				<title>Start Campaign</title>
			</Head>
					<FrontLayout showFooter={false}>

				<Wrapper>
					{
						// account === "" ? (
						// 	<div>
						// 		<div className="text-3xl font-bold text-center">Select Account to Start Campaign From</div>
						// 		<div className="flex justify-evenly text-center my-32">
						// 			<div className="w-80 cursor-pointer" onClick={() => setAccount("user")}>
						// 				<img src="/images/logo.svg" className="w-16 h-16 mx-auto" alt="" />
						// 				<div className="text-base my-3 capitalize">{user?.name}</div>
						// 			</div>
						// 			{orgs.map(org => (
						// 				<div className="w-80 cursor-pointer" onClick={() => {setAccount("org"), singleOrg(org._id)}}>
						// 					<img src="/images/logo.svg" className="w-16 h-16 mx-auto" alt="" />
						// 					<div className="text-base my-3 capitalize">{org?.name}</div>
						// 				</div>
						// 			))}
						// 		</div>
						// 	</div>
						// ) : (
						// 	account === "user" ? (
						!query.category ? (
							<Fragment>
								<div className="homepage">
									<div className="container">
										{/* <div className="_action d-flex justify-content-center align-items-center">
											<div className="_action-img">
												<img
													src="/images/undraw_black_lives_matter_rndk.png"
													alt=""
													className="animate__animated animate__rollIn"
												/>
											</div>
											<div className="_action-txt">
												Take <br /> Action {user?.name}
											</div>
										</div> */}
										<div className="homepage-txt font-weight-bolder text-muted">
											What kind of Campaign would <br /> you want to launch?
										</div>
										<div className="_homepage-txt mt-5 pb-2">
											Selecting an area of interest helps us to recommend your{" "}
											<br />
											campaign to interested supporters.
										</div>
									</div>
								</div>
								<div className="_camp-type py-5">
									<div className="container">
										<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
											{camps.map((camp, i) => (
												<CategoryItem key={i} camp={camp} />
											))}
										</div>
									</div>
								</div>
							</Fragment>
						) : (
							<AddCampaign category={query?.category as string} />
						)
						// ) : (
						// 	account === "org" ? (
						// 		!query.category ? (
						// 			<Fragment>
						// 				<div className="homepage">
						// 					<div className="container">
						// 						<div className="_action d-flex justify-content-center align-items-center">
						// 							<div className="_action-img">
						// 								<img
						// 									src="/images/undraw_black_lives_matter_rndk.png"
						// 									alt=""
						// 									className="animate__animated animate__rollIn"
						// 								/>
						// 							</div>
						// 							<div className="_action-txt">
						// 								Take <br /> Action 
						// 							</div>
						// 						</div>
						// 						<div className="homepage-txt font-weight-bolder text-muted">
						// 							What kind of Campaign would <br /> you want to launch?
						// 						</div>
						// 						<div className="_homepage-txt mt-5 pb-2">
						// 							Selecting an area of interest helps EDF to recommend your{" "}
						// 							<br />
						// 							campaign to interested supporters.
						// 						</div>
						// 					</div>
						// 				</div>
						// 				<div className="_camp-type py-5">
						// 					<div className="container">
						// 						<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
						// 							{camps.map((camp, i) => (
						// 								<CategoryItem key={i} camp={camp} />
						// 							))}
						// 						</div>
						// 					</div>
						// 				</div>
						// 			</Fragment>
						// 		) : (
						// 			<AddCampaignOrg category={query?.category as string} organization={org}  />
						// 		)
						// 	) : (
						// 		<div></div>
						// 	)
						// )
						// )
					}
				</Wrapper>
			</FrontLayout>
		</Fragment>
	);
};

export default StartCampPage;

const camps = [
	{ name: "Human Right awareness", img: "camp6" },
	{ name: "Social Policy", img: "camp5" },
	{ name: "Criminal Justice", img: "camp9" },
	{ name: "Human Right Action", img: "camp90" },
	{ name: `Development`, img: "camp3" },
	{ name: "Environment", img: "camp7" },
	{ name: "Health", img: "camp8" },
	{ name: "Politics", img: "camp10" },
	{ name: "Disability", img: "camp11" },
	{ name: "Equality", img: "camp1" },
	{ name: "Others", img: "camp2" },
];

const CategoryItem = ({ camp }: { camp: { name: string; img: string } }) => {
	const router = useRouter();
	return (
		<div className="camp-card col my-4">
			<div className="card main-camp-card h-100 bg-transparent  border-0">
				<img
					src={`images/${camp.img}.svg`}
					alt=""
					className="card-img d-block mb-2 mx-auto"
				/>

				<p className="text-center main-camp-card-title fs-5 card-title">
					{camp.name}
				</p>
				<div className="camp-btn d-flex justify-content-center my-2">
					<button
						className="btn btn-warning px-4 py-2 _camp-btn text-capitalize fw-bold rounded-pill"
						onClick={() => {
							// setCatory(camp.name);
							router.push(`/startcamp?category=${camp.name}`);
							// setStep(1);
						}}
					>
						take action
					</button>
				</div>
			</div>
		</div>
	);
};

const Wrapper = styled.div`
	.card-img {
		width: 7rem;
		height: 7rem;
		object-fit: contain;
	}
`;
