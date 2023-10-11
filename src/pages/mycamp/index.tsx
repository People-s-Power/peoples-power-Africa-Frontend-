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
	const [campaigns, setCampaigns] = useState([])
	const [victories, setVictories] = useState([])

	// const loading = true;
	const getGeneral = () => {
		let general = [...petition, ...post, ...adverts, ...events, ...victories]
		const randomizedItems = general.sort(() => Math.random() - 0.5)
		setCampaigns(randomizedItems)
		// console.log(randomizedItems)
	}

	useQuery(MY_ADVERTS, {
		client: apollo,
		variables: { authorId: "64beb56cb585e627382e4dd8" },
		onCompleted: (data) => {
			// console.log(data)
			setAdverts(data.myAdverts)
		},
		onError: (err) => console.log(err),
	})

	useQuery(MY_PETITION, {
		client: apollo,
		variables: { authorId: "64beb56cb585e627382e4dd8" },
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
		variables: { authorId: "64beb56cb585e627382e4dd8" },
		onCompleted: (data) => {
			// console.log(data)
			setVictories(data.myVictories)
		},
		onError: (err) => console.log(err),
	})

	useQuery(MY_EVENT, {
		client: apollo,
		variables: { authorId: "64beb56cb585e627382e4dd8" },
		onCompleted: (data) => {
			// console.log(data)
			setEvents(data.authorEvents)
		},
		onError: (err) => console.log(err),
	})

	useQuery(GET_USER_POSTS, {
		client: apollo,
		variables: { authorId: "64beb56cb585e627382e4dd8" },
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
					<div className="container">
						{/* <h1 className="text-secondary pt-2 mb-3 fs-3 fw-bold">
							My Campaigns
						</h1>
						<p className="fs-4 fst-italic">Welcome {user?.firstName} !</p>
						<Link href="/startcamp">
							<a className="btn btn-warning rounded-pill px-4">
								<i className="fas fa-plus text-light me-2"></i> Create Campaign
							</a>
						</Link> */}
						<div className="mt-4 ">
							{campaigns.length > 0 ? (
								<div>
									<h3 className="fs-4 fw-bold text-center">Check Progress</h3>
									<div className="d-flex py-3 flex-column flex-md-row">
										<div className="flex-fill overflow-auto">
											<CampaignTable campaigns={campaigns} />
										</div>
									</div>
								</div>
							) : (
								<p>Loading...</p>
							)}
						</div>
					</div>
				</Wrapper>
			</>
		</FrontLayout>
	)
}

export default authGuard(MyCamp)
