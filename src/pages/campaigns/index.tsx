import { apollo } from "apollo";
import { GET_ACTIVE_PETITION, GET_PETITION } from "apollo/queries/petitionQuery";
import CampaignCard from "components/home/CampCard";
import FrontLayout from "layout/FrontLayout";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ICampaign } from "types/Applicant.types";
import Link from "next/link";
import { useRouter } from 'next/router'
import CampaignSlider from "../../components/camp-slider/Slider"
// import { ApolloProvider } from "@apollo/client";
import { useQuery } from "@apollo/client";


const CampaignPage: () => JSX.Element = () => {
	const [campaigns, setCamp] = useState<ICampaign[]>([])
	const [searchTerm, setSearchTerm] = useState("");
	const [queryCampaigns, setQueryCampaigns] = useState<ICampaign[]>([]);

	useQuery(GET_PETITION, {
		client: apollo,
		onCompleted: (data) => {
			console.log(data)
			setCamp(data.getPetitions)
			setQueryCampaigns(data.getPetitions)
		},
		onError: (err) => console.log(err),
	});

	useEffect(() => {
		setQueryCampaigns(campaigns)
	}, [])

	const categories = [
		{
			title: 'All',
			cate: 'All'
		},
		{
			title: 'Human Right',
			cate: 'Human Right awareness'
		},
		{
			title: 'Social policy',
			cate: 'Social policy'
		},
		{
			title: 'Criminal',
			cate: 'Criminal Justice'
		},
		{
			title: 'Environment',
			cate: 'Environment'
		},
		{
			title: 'Development',
			cate: 'Development'
		},
		{
			title: 'Health',
			cate: 'Health'
		},
		// {
		// 	title: 'Human Right P',
		// 	cate: 'Human Right Preceeding'
		// },
		{
			title: 'Politics',
			cate: 'Politics'
		},
		{
			title: 'Disability',
			cate: 'Disability'
		},
		{
			title: 'Equality',
			cate: 'Equality'
		},
		{
			title: 'Others',
			cate: 'Others'
		}
	]
	const router = useRouter()
	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		router.push('/startcamp')
	}
	const changeCategory = (event: React.MouseEvent<HTMLDivElement>): void => {
		const item: any = event.currentTarget
		const text = item?.lastChild?.innerText
		if (text === 'All') {
			setQueryCampaigns(campaigns)
			return
		}
		const results = campaigns.filter(itemCamp => itemCamp.category === text)
		setQueryCampaigns(results)
	}
	return (
				<FrontLayout showFooter={false}>

			<Wrapper>
				<div className="explore py-5 animate__animated animate__fadeIn">
					<div className="container">
						<h1 className="ex-title mb-3 fw-bold fs-3">Explore Campaign</h1>
						<p className="">
							Browse and join hundred others endorse a campaign you’d like to
							support.
						</p>
						<div className="ex-bar d-flex">
							<div className="ex-input d-flex mb-3">
								<div className="_ex-input">
									<input
										type="search"
										className="form-control rounded-pill"
										placeholder="Search"
										onChange={(event) => {
											setSearchTerm(event.target.value);
										}}
									/>
									<div className="flex sm:hidden">
										{categories.map((item, index) => {
											return <div onClick={changeCategory} className="p-2 m-2 rounded-lg  cursor-pointer text-sm" key={index}>{item.title} <span className="hidden">{item.cate}</span></div>
										})}
									</div>
								</div>
							</div>
							<div>
								<select name="options" id="" className="lg:ml-4 rounded-md border-gray-200">
									<option value="">All</option>
									<option value="">Images</option>
									<option value="">Videos</option>
								</select>
							</div>
						</div>
						{/* <CampaignSlider /> */}
						<div className="flex justify-between flex-wrap">
							{queryCampaigns
								.filter((camp) =>
									camp.title
										?.toLocaleLowerCase()
										.includes(searchTerm.toLocaleLowerCase()),
								)
								.map((campaign, i) => (
									<CampaignCard key={i} camp={campaign} />
								))}
						</div>

						<div
							className='px-20 lg:w-1/2 text-center py-3 rounded-xl mt-5 text-black m-auto bg-gray-200 cursor-pointer'
						>
							Do you think you have a social concern? <br />
							Start writing your own Campaign...  <span>&#x270E;</span>

						</div>
					</div>
				</div>
			</Wrapper>
		</FrontLayout>
	);
};

export default CampaignPage;

const Wrapper = styled.div`
	.campaign-list {
	}
`;
