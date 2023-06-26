/* eslint-disable no-var */
import { useQuery } from "@apollo/client"
import { apollo } from "apollo"
import axios from "axios"
import { UserAtom } from "atoms/UserAtom"
import LoginModal from "components/auth/login/modal/LoginModal"
import { CampaignShareMenuList } from "components/campaign-comp/CampaignTable"
import EndorseCampaignComp from "components/campaign-comp/EndorseCampaignComp"
import Endorsements from "components/campaign-comp/Endorsements"
import FrontLayout from "layout/FrontLayout"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import React, { Fragment, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { ICampaign, IEndorsement } from "types/Applicant.types"
import Link from "next/link"
import router, { useRouter } from "next/router"
import { SINGLE_PETITION } from "apollo/queries/petitionQuery"
import AddUpdates from "components/modals/AddUpdates"

// const io = socket(SERVER_URL, {
// 	extraHeaders: {
// 		authorization: Cookies.get("token") || "",
// 	},
// });

export interface Update {
	body: string
	image: string
}

const SingleCampaignPage = (): JSX.Element => {
	// console.log(camp)
	const [endorsements, setEndorsements] = useState<IEndorsement[]>([])
	const [isLiked, setIsLiked] = useState(false)
	const [showEndorsement, setShowEndorsement] = useState(false)
	const [showLogin, setShowLogin] = useState(false)
	const { query } = useRouter()
	const user = useRecoilValue(UserAtom)
	const [update, setUpdate] = useState<Update[]>([])
	const [open, setOpen] = useState(false)
	const [camp, setCamp] = useState<any>(null)
	const [single, setSingle] = useState(null)
	const [likes, setLikes] = useState([])

	useQuery(SINGLE_PETITION, {
		client: apollo,
		variables: { slug: query.slug },
		onCompleted: (data) => {
			console.log(data)
			setCamp(data.getPetition)
			setEndorsements(data.getPetition.comments)
			setUpdate(data.getPetition.updates)
			setLikes(data.getPetition.likes)
		},
		onError: (err) => console.log(err),
	})

	// const handleLike = async () => {
	// 	// io.emit("likeCampaign", { id: camp?.id });
	// 	console.log("handlike")
	// }

	// const viewCamp = async () => {
	// 	if (!user) return
	// 	const data = {
	// 		userId: user?.id,
	// 	}
	// 	const res = await axios.put(`/campaign/viewCamp/${camp?._id}`, data)
	// 	// console.log(res)
	// }

	// useEffect(() => {
	// if (camp?.likes?.includes(user?.id)) {
	// 	setIsLiked(true)
	// } else {
	// 	setIsLiked(false)
	// }
	// viewCamp()
	// }, [camp, user])

	let target = 2000

	return (
		<Fragment>
			<Head>
				<title>Petition || {camp?.title}</title>
				<meta name="description" content={camp?.body} />
			</Head>
			<FrontLayout showFooter={false}>
				<Wrapper className="single-camp py-4 ">
					<LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
					<div className="container inner py-2">
						<div className="">
							<main className="single-camp-wrap px-2 d-flex flex-column flex-md-row align-items-sm-start justify-content-sm-between">
								<div className="sec-1 lg:pl-5 mb-5 left lg:w-[50%]">
									<div className="top">
										<h1 className="m-0 p-0 text-warning fw-bold mb-3 fs-4">Explore Petition</h1>
										<div className="grid grid-flow-col auto-cols-auto grid-flow-row auto-rows-auto gap-1">
											{
												camp?.image?.slice(0, 4).map((image, index) =>
													<img key={index} className="w-full h-80 rounded-md object-cover" src={image} alt="" />
												)
											}
										</div>
										{/* <div className="d-flex  share-like align-items-center">
											<a
												className={`btn rounded-circle me-5 like-btn 
                   								 ${isLiked ? "bg-sky text-primary" : "text-muted"}`}
												onClick={() => {
													user?.id !== camp?.author?._id && handleLike()
												}}
											>
												<i className="fas fa-thumbs-up small"></i>
											</a>
											<CampaignShareMenuList camp={camp}>
												<button className="btn p-0 px-0">
													<i className="fas fa-share small text-muted"></i>
												</button>
											</CampaignShareMenuList>
										</div> */}
									</div>
									<h3 className="mb-0 p-0 fw-bold m-0 capitalize">{camp?.title}</h3>
									<div className="m-0 mt-2 fw-bold flex">
										<img className="w-8 h-8 rounded-full" src={camp?.author?.image} alt="" />
										<p className="ml-3 my-auto">
											{`${camp?.author?.name}`} launched this Petition to {camp?.target}
										</p>
									</div>
									<div className="fs-5 my-3">{camp?.body}</div>
									<Link href={`/report?page=${camp?._id}`}>
										<div className="text-red-500 cursor-pointer">Report Abuse</div>
									</Link>
									{update.length >= 1 ? (
										<div className="bg-gray-100 p-3 mt-5">
											<div className="text-xl font-bold my-2">PETITION UPDATE</div>
											{update.map((item, i) => (
												<div key={i}>
													<div className="text-lg my-1">
														<img src={item.image[0]} className="w-full h-80 rounded-md object-cover" alt="" />
														<div className="text-sm">
															{item.body}
														</div>
														<button onClick={() => { setSingle(update[i]); setOpen(!open) }} className="bg-transparent p-2 text-warning ml-auto">
															<span>&#x270E;</span> Edit
														</button>
													</div>
												</div>
											))}
										</div>
									) : null}
								</div>

								<aside className="sec-2 align-items-center flex-column d-flex right">
									<div>
										<p className="mt-0 font-bold text-xl">
											{Number(likes?.length) + 1} {Number(likes?.length) + 1 <= 1 ? "has" : "have"} endorsed this campaign, Lets get it to{" "}
											{Number(likes?.length) >= target ? " " + target + 100 : target}
										</p>
										<div className="h-4 mt-2 relative max-w-xl rounded-full overflow-hidden w-full">
											<div className="w-full h-full bg-gray-200 absolute"></div>
											<div
												id="bar"
												className={"h-full bg-warning relative w-4"}
												style={{
													width: Number(likes?.length) < 150 ? +10 + "px" : Number(likes?.length) >= 300 ? +500 + "px" : +50 + "px",
												}}
											></div>
										</div>
									</div>

									{likes?.length ? (
										<p className="mb-4 bg-sky ps-1 py-2 fs-5 text-center rounded text-muted w-100 fw-bold">Endorsements</p>
									) : camp?.author?._id === user?.id ? null : (
										<div className="px-3">
											<p className="py-2 fs-5 text-center rounded text-muted w-100 px-2">Be the first to endorse this campaign</p>
										</div>
									)}
									<div className="mb-3 w-100">
										{endorsements?.map((endorsement, i) => (
											<Endorsements endorsement={endorsement} key={i} />
										))}
									</div>
									{/* {camp?.author?._id === user?.id ? null : endorsements.length >= 1 ? (
										endorsements.map((endorse, i) =>
											user?.id === endorse.author.id ? (
												<div key={i}>
													<div>
														Thank you {user.firstName} for endorsing this campaign. Let's now make this campaign get to other supporters on PEOPLE POWER by
														promoting it.
													</div>
													<Link href={`/promote?slug=${camp.slug}`}>
														<a className="btn btn-warning btn-sm  rounded-pill px-3 fw-bold my-3 text-center mx-auto">Promote Campaign</a>
													</Link>
												</div>
											) : null
										)
									) : (
										<div>
											<EndorseCampaignComp camp={camp} />
										</div>
									)} */}
								</aside>
							</main>
						</div>
						{single !== null ? <AddUpdates open={open} handelClick={() => setOpen(!open)} update={single} petition={camp} /> : null}
					</div>
				</Wrapper>
			</FrontLayout>
		</Fragment>
	)
}

export default SingleCampaignPage

const Wrapper = styled.div`
	.camp-image {
		width: 100%;
		max-height: 30rem;
		object-fit: cover;
	}
	.mde-textarea-wrapper {
		.mde-text {
			background-color: inherit;
			border: 0;
			outline: 0;
			-webkit-box-shadow: 0;
			-moz-box-shadow: 0;
			box-shadow: 0;
			resize: none;
		}
	}
	#text {
		display: none;
	}
`
