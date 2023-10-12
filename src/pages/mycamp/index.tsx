import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { MY_PETITION } from "apollo/queries/petitionQuery"
import { UserAtom } from "atoms/UserAtom"
import Slider from "components/camp-slider/Slider"
import CampaignTable from "components/campaign-comp/CampaignTable"
import { Wrapper } from "components/styled/style"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import authGuard from "hooks/authGuard"
import FrontLayout from "layout/FrontLayout"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRecoilValue } from "recoil"
import { ICampaign } from "types/Applicant.types"
import { apollo } from "apollo"
import { MY_EVENT } from "apollo/queries/eventQuery"
import { GET_USER_POSTS } from "apollo/queries/postQuery"
import { MY_ADVERTS } from "apollo/queries/advertsQuery"
import router, { useRouter } from "next/router"
import axios from "axios"

import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import { MY_VICTORIES } from "apollo/queries/victories"
dayjs.extend(relativeTime)

const MyCamp: NextPage = (): JSX.Element => {
	const author = useRecoilValue(UserAtom)
	const [petition, setPetition] = useState([])
	const [post, setPost] = useState([])
	const [events, setEvents] = useState([])
	const [adverts, setAdverts] = useState([])
	const { query } = useRouter()
	const [all, setCampaigns] = useState([])
	const [victories, setVictories] = useState([])
	const [active, setActive] = useState("summary");
	const [manage, setManage] = useState("all")

	// const loading = true;
	const getGeneral = () => {
		let general = [...petition, ...post, ...adverts, ...events, ...victories]
		const randomizedItems = general.sort(() => Math.random() - 0.5)
		setCampaigns(randomizedItems)
		// console.log(randomizedItems)
	}

	useQuery(MY_ADVERTS, {
		client: apollo,
		variables: { authorId: query.page || author?.id },
		onCompleted: (data) => {
			// console.log(data)
			setAdverts(data.myAdverts)
		},
		onError: (err) => console.log(err),
	})

	useQuery(MY_PETITION, {
		client: apollo,
		variables: { authorId: query.page || author?.id },
		onCompleted: (data) => {
			// console.log(data)
			setPetition(data.myPetition)
		},
		onError: (err) => {
			console.log(err)
		},
	})

	useQuery(MY_VICTORIES, {
		client: apollo,
		variables: { authorId: query.page || author?.id },
		onCompleted: (data) => {
			// console.log(data)
			setVictories(data.myVictories)
		},
		onError: (err) => console.log(err),
	})

	useQuery(MY_EVENT, {
		client: apollo,
		variables: { authorId: query.page || author?.id },
		onCompleted: (data) => {
			// console.log(data)
			setEvents(data.authorEvents)
		},
		onError: (err) => console.log(err),
	})

	useQuery(GET_USER_POSTS, {
		client: apollo,
		variables: { authorId: query.page || author?.id },
		onCompleted: (data) => {
			// console.log(data)
			setPost(data.myPosts)
		},
		onError: (err) => console.log(err),
	})

	useEffect(() => {
		getGeneral()
	}, [adverts, petition, post, events, author, victories])

	return (
		<FrontLayout showFooter={false}>
			<>
				<Head>
					<title>{`Theplaint.org`} || My campaign</title>
				</Head>
				<Wrapper className="my-camp bg-white ">
					{query.page === undefined ? <div className="container">
						<div className="mt-4 ">
							{all.length > 0 ? (
								<div>
									<div className="flex justify-between my-5">
										<input type="text" className="p-2 rounded-md border w-[30%]" placeholder="Search" />
										<select onChange={(e) => setManage(e.target.value)} className=" p-2 border w-44 rounded-md">
											<option value="all">All</option>
											<option value="petition">Petition</option>
											<option value="post" >Post</option>
											<option value="events">Events</option>
											<option value="adverts">Advert</option>
											<option value="victories">Victory</option>
											{/* <option value="update">Update</option> */}
										</select>
									</div>
									<div className="d-flex py-3 flex-column flex-md-row">
										<div className="flex-fill overflow-auto">
											<CampaignTable campaigns={eval(manage)} />
										</div>
									</div>
								</div>
							) : (
								<p className="text-center">Loading...</p>
							)}
						</div>
					</div> : <div>
						<div className="flex w-[30%] mx-auto justify-between">
							<div
								onClick={() => setActive("summary")}
								className={
									active === "summary"
										? "border-b border-warning cursor-pointer"
										: "cursor-pointer"
								}
							>
								Summary
							</div>
							<div
								onClick={() => setActive("content")}
								className={
									active === "content"
										? "border-b border-warning cursor-pointer"
										: "cursor-pointer"
								}
							>
								Manage Content
							</div>
							{/* <div
								onClick={() => router.push("?page=user")}
								className={
									active === "user"
										? "border-b border-warning cursor-pointer"
										: "cursor-pointer"
								}
							>
								User
							</div> */}

						</div>
						<div className="pt-4">
							{(() => {
								switch (active) {
									case "summary":
										return <div></div>;
									case "content":
										return <div>
											<div className="flex w-[80%] mx-auto justify-between my-5">
												<input type="text" className="p-2 rounded-md border w-[30%]" placeholder="Search" />
												<select onChange={(e) => setManage(e.target.value)} className="w-44 p-2 border rounded-md">
													<option value="all">All</option>
													<option value="petition">Petition</option>
													<option value="post" >Post</option>
													<option value="events">Events</option>
													<option value="adverts">Advert</option>
													<option value="victories">Victory</option>
													{/* <option value="update">Update</option> */}
												</select>
											</div>
											<div className="">
												{all.length > 0 ? (
													<div className="flex-fill overflow-auto">
														<CampaignTable campaigns={eval(manage)} />
													</div>
												) : (
													<p className="text-center">Loading...</p>
												)}
											</div>
										</div>;
								}
							})()}
						</div>

					</div>}

				</Wrapper>
			</>
		</FrontLayout>
	)
}

export default authGuard(MyCamp)
