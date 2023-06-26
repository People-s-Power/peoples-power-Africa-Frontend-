/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef } from "react"
import FrontLayout from "layout/FrontLayout"
import Head from "next/head"
import { useQuery } from "@apollo/client"
import { MY_CAMPAIGN } from "apollo/queries/campaignQuery"
import { apollo } from "apollo"
import { useState } from "react"
import { ICampaign, IUser, IOrg } from "types/Applicant.types"
import Link from "next/link"
import axios from "axios"
import { sassNull } from "sass"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import Slider from "../../components/camp-slider/Slider"
import router, { useRouter } from "next/router"
import { GET_ORGANIZATION, GET_ORGANIZATIONS, DELETE_ORG } from "apollo/queries/orgQuery"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { SERVER_URL } from "utils/constants"
import { MY_ADVERTS } from "apollo/queries/advertsQuery"
import { GET_USER_POSTS } from "apollo/queries/postQuery"
import { MY_VICTORIES } from "apollo/queries/victories"
import { MY_EVENT } from "apollo/queries/eventQuery"
import CreatePost from "../../components/modals/CreatePost"
import CreateAdvert from "../../components/modals/CreateAdvert"
import CreateEvent from "../../components/modals/CreateEvent"
import StartPetition from "../../components/modals/StartPetition"
import { Modal } from "rsuite"
import { GET_ALL, GET_ALL_USERS, FOLLOW } from "apollo/queries/generalQuery"

import AdvertsComp from "components/AdvertsCard"
import PetitionComp from "components/PetitionCard"
import EventsCard from "components/EventsCard"
import CampComp from "components/CampComp"
import { print } from "graphql"
import PostActionCard from "components/PostActionCard"
import { Dropdown } from "rsuite"
import FollowSlides from "components/camp-slider/FollowSlides"
import VictoryCard from "components/VictoryCard"
import Updates from "components/updates"
import { MY_PETITION } from "apollo/queries/petitionQuery"
import FindExpartModal from "components/modals/FindExpartModal"

const org = () => {
	const [campaigns, setCampaigns] = useState<ICampaign[]>([])
	const [user, setUser] = useState<any>()
	const [orgs, setOrgs] = useState<IOrg[]>([])
	const { query } = useRouter()
	const author = useRecoilValue(UserAtom)
	const [product, setProduct] = useState(false)
	const [organization, setOrganization] = useState(false)
	const [img, setImg] = useState("")
	const uploadRef = useRef<HTMLInputElement>(null)
	const [following, setFollow] = useState(false)
	const [adverts, setAdverts] = useState<any>([])
	const [posts, setPosts] = useState<any>([])
	const [victories, setVictories] = useState<any>([])
	const [events, setEvents] = useState<any>([])
	const [openPost, setOpenPost] = useState(false)
	const [openAd, setOpenAd] = useState(false)
	const [openEvent, setOpenEvent] = useState(false)
	const [openPetition, setOpenPetition] = useState(false)
	const [all, setAll] = useState<any>([])
	const [open, setOpen] = useState(false)
	const handelClick = () => setOpenPost(!openPost)
	const handelPetition = () => setOpenPetition(!openPetition)
	const handelAdClick = () => setOpenAd(!openAd)
	const handelEventClick = () => setOpenEvent(!openEvent)

	const [openFindExpart, setOpenFindExpart] = useState(false)

	const handelOpenFindExpart = () => setOpenFindExpart(!openFindExpart)

	let page: any
	if (typeof window !== "undefined") {
		page = localStorage.getItem("page")
	}
	function isValidUrl(string: any) {
		try {
			new URL(string)
			return true
		} catch (err) {
			return false
		}
	}

	useQuery(GET_ORGANIZATION, {
		variables: { ID: query.page },
		client: apollo,
		onCompleted: (data) => {
			// console.log(data.getOrganzation)
			setUser(data.getOrganzation)
			user?.followers.map((single: any) => {
				if (single === user.id) {
					setFollow(true)
				} else {
					setFollow(false)
				}
			})
			localStorage.setItem("operator", JSON.stringify(data.getOrganzation.operators))
		},
		onError: (err) => console.log(err),
	})

	useQuery(GET_ORGANIZATIONS, {
		variables: { ID: author?.id },
		client: apollo,
		onCompleted: (data) => {
			// console.log(data)
			setOrgs(data.getUserOrganizations)
		},
		onError: (err) => console.log(err),
	})

	useQuery(MY_ADVERTS, {
		client: apollo,
		variables: { authorId: query?.page },
		onCompleted: (data) => {
			// console.log(data)
			setAdverts(data.myAdverts)
		},
		onError: (err) => {
			console.log(err)
		},
	})

	useQuery(MY_PETITION, {
		client: apollo,
		variables: { authorId: query?.page },
		onCompleted: (data) => {
			console.log(data)
			setCampaigns(data.myPetition)
		},
		onError: (err) => {
			console.log(err)
		},
	})

	useQuery(MY_VICTORIES, {
		client: apollo,
		variables: { authorId: query?.page },
		onCompleted: (data) => {
			// console.log(data)
			setVictories(data.myVictories)
		},
		onError: (err) => console.log(err),
	})

	useQuery(MY_EVENT, {
		client: apollo,
		variables: { authorId: query.page },
		onCompleted: (data) => {
			// console.log(data)
			setEvents(data.authorEvents)
		},
		onError: (err) => console.log(err),
	})

	useQuery(GET_USER_POSTS, {
		client: apollo,
		variables: { authorId: query.page },
		onCompleted: (data) => {
			console.log(data)
			setPosts(data.myPosts)
		},
		onError: (err) => console.log(err),
	})

	async function getData() {
		try {
			const general = [...campaigns, ...posts, ...adverts, ...victories, ...events]
			const randomizedItems = general.sort(() => Math.random() - 0.5)
			const sortedItems = randomizedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			const newArray = []
			for (let i = 0; i < sortedItems.length; i++) {
				newArray.push(sortedItems[i])
				if ((i + 1) % 3 === 0) {
					newArray.push({
						__typename: "Follow",
					})
				}
			}
			// console.log(newArray)
			setAll(newArray)
		} catch (err) {
			console.log(err.response)
		}
	}

	useEffect(() => {
		getData()
	}, [adverts, posts, victories, events, campaigns, orgs])

	const deleteOrg = async () => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(DELETE_ORG),
				variables: {
					id: query.page,
				},
			})
			console.log(data)
			toast.success("Organization deleted!")
			router.push("/")
		} catch (error) {
			console.log(error)
		}
	}
	// const follow = () => {
	// 	axios
	// 		.post("/user/follow", {
	// 			userId: page,
	// 		})
	// 		.then(function (response) {
	// 			toast.success("Followed!")
	// 			setFollow(true)
	// 		})
	// 		.catch(function (error) {
	// 			console.log(error)
	// 			toast.warn("Oops an error occoured!")
	// 		})
	// }

	const singleOrg = (id: string) => {
		router.push(`/org?page=${id}`)
		localStorage.setItem("page", `${id}`)
	}

	const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		const reader = new FileReader()
		if (files && files.length > 0) {
			reader.readAsDataURL(files[0])
			reader.onloadend = () => {
				if (reader.result) {
					setImg(reader.result as any)
				}
			}
		}
	}

	const uploadFileToServer = async () => {
		if (!img) {
			uploadRef.current?.click()
		} else {
			try {
				// setLoading(true);
				const { data } = await axios.post(`/organization/uploadimg/${query.page}`, { image: img })
				toast("Image uploaded successfully")
				setImg("")
			} catch (error) {
				console.log(error)
			} finally {
				// setLoading(false);
			}
		}
	}

	return (
		<FrontLayout showFooter={false}>
			<>
				<Head>
					<title>
						{`PEOPLE POWER`} || {user?.name}{" "}
					</title>
				</Head>
				<div className="lg:mx-32">
					<div className="rounded-md bg-gray-100">
						<div className="relative ">
							<div>
								<img className="w-full h-52" src="https://source.unsplash.com/random/800x400?nature" alt="" />
							</div>
							<div className="edit-sec relative sm:w-[90%] lg:left-10 left-2 -top-20">
								<div className="py-3 mb-4 d-flex">
									<div className="pro-img-wrap rounded-circle position-relative">
										<input type="file" ref={uploadRef} onChange={handleImg} />
										<button className="btn p-0 z-50" onClick={uploadFileToServer}>
											<i
												className={`fas fs-5 d-flex align-items-center justify-content-center  rounded-circle  text-secondary ${img ? "fa-save" : "fa-pencil-alt"
													}`}
											></i>
										</button>

										<div className="pro-img position-relative rounded-circle">
											<img src={img || user?.image || "/images/user.png"} alt="" className="position-absolute" />
										</div>
									</div>
								</div>
								<div className="">
									<div className="lg:flex justify-between">
										<div className="flex flex-column justify-center">
											<div className="flex">
												<div className="text-xl font-bold ">{user?.name}</div>
												<div className="text-xs text-gray-900 flex my-auto ml-6">
													{user?.followers.length} Followers
													<div className="text-xs text-gray-900 ml-2">Following {user?.following.length}</div>
												</div>
											</div>
											<div className="text-sm font-thin w-96">{user?.description.substring(0, 100) + "..."}</div>
											<div className="pt-1 text-sm">
												{user?.city}, {user?.country}
											</div>
										</div>
										{
											user?.author === author?.id &&
											<div className="font-black text-lg mr-32">
												<Link href={`/org/update?page=${user?._id}`}>
													<button className="bg-transparent p-2 text-warning">
														<span>&#x270E;</span> Edit
													</button>
												</Link>
												<button onClick={() => setOpen(!open)} className="bg-transparent p-2 text-red-600">
													Delete
												</button>
											</div>
										}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="lg:flex mt-3">
						<div className="lg:w-1/3 mt-3 lg:h-80 lg:mr-4 rounded-md bg-gray-50">
							{user?.author === author?.id ? (
								<div className=" text-base p-3">
									<Link href={`/addadmin?page=${query.page}`}>
										<button className="bg-transparent text-warning">Admin</button>
									</Link>
									<div className="my-2">
										<Link href="/mycamp">
											<button className="bg-transparent">Dashboard</button>
										</Link>
									</div>
									<div className="my-2">
										<button className=" bg-transparent" onClick={() => setProduct(!product)}>
											{" "}
											Products
										</button>
									</div>
									<div>
										{orgs.map((org, i) => (
											<div key={i} className="flex cursor-pointer my-2" onClick={() => singleOrg(org?._id)}>
												{isValidUrl(org?.image) ? (
													<img className="w-8 h-8 rounded-full" src={org?.image} alt="" />
												) : (
													<img className="w-8 h-8 opacity-20" src="/images/logo.svg" alt="" />
												)}
												<p className="pl-2 mt-2 text-sm">{org?.name}</p>
											</div>
										))}
									</div>
								</div>
							) : null}
						</div>
						{product ? (
							<div className="lg:w-4/6 rounded-md mt-3">
								<div className="bg-transparent cursor-pointer w-36 my-2 mx-auto flex justify-between" onClick={() => handelAdClick()}>
									<div className="text-center my-auto">
										<div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
										{/* <div className="text-xs">  create </div> */}
									</div>
									<div className="my-auto text-sm">Create Product</div>
								</div>
								<div>
									{adverts.map((advert: any) => (
										<div key={advert.caption} className="p-3 border-b border-gray-400 my-3">
											<div>{advert.caption}</div>
											<div className="py-2">
												<img className="w-full h-80 object-cover rounded-md" src={advert.image} alt="" />
											</div>
											<div className="text-sm py-2 leading-loose">{advert.message}</div>
											<div className="pt-3 flex justify-between">
												<div className="w-2/3">{advert.email}</div>
												<div>
													<button className="p-2 bg-warning ">Sign up</button>
												</div>
												<Dropdown placement="leftStart" title={<img className="h-6 w-6" src="/images/edit.svg" alt="" />} noCaret>
													<Dropdown.Item>Advertise</Dropdown.Item>
													<Dropdown.Item>Edit</Dropdown.Item>
												</Dropdown>
											</div>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="lg:w-4/6">
								<PostActionCard
									authorImage={author?.image}
									handelOpenFindExpart={handelOpenFindExpart}
									handelClick={handelClick}
									handelEventClick={handelEventClick}
									handelPetition={handelPetition}
								/>

								{all.length === 0 ? <div className="text-center">You dont have any campaign at the moment</div> : <></>}
								{all[0] !== undefined
									? all.map((single: any, index: number) => {
										// setType(single.__typename)
										switch (single.__typename) {
											case "Advert":
												return (
													<div key={index}>
														<AdvertsComp advert={single} />
													</div>
												)
											case "Event":
												return (
													<div key={index}>
														<EventsCard event={single} />
													</div>
												)
											case "Petition":
												return (
													<div key={index}>
														<PetitionComp petition={single} />
													</div>
												)
											case "Victory":
												return (
													<div key={index}>
														<VictoryCard post={single} />
													</div>
												)
											// case "Post":
											// 	return (
											// 		<div key={index}>
											// 			<CampComp post={single} />
											// 		</div>
											// 	)
											case "Update":
												return (
													<div key={index}>
														<Updates updates={single} />
													</div>
												)
											case "Follow":
												return (
													<div key={index}>
														<FollowSlides />
													</div>
												)
											// default:
											// 	return (
											// 		<div key={index}>
											// 			<Shared shared={single} />
											// 		</div>
											// 	)
										}
									})
									: null}
							</div>
						)}
					</div>
				</div>
				<Modal open={open} onClose={() => setOpen(!open)}>
					<div className="p-3">
						<p>Are you sure you want to delete this organization?</p>
					</div>
					<Modal.Footer>
						<button className="bg-transparent p-3 mx-3" onClick={() => setOpen(!open)}>
							Cancel
						</button>
						<button className="bg-red-500 p-3 text-white mx-3" onClick={() => deleteOrg()}>
							Delete
						</button>
					</Modal.Footer>
				</Modal>
				<CreatePost open={openPost} handelPetition={handelPetition} handelClick={handelClick} post={null} orgs={orgs} />
				<CreateEvent open={openEvent} handelClick={handelEventClick} event={null} orgs={orgs} />
				<CreateAdvert open={openAd} handelClick={handelAdClick} advert={null} />
				<StartPetition open={openPetition} handelClick={handelPetition} data={null} orgs={orgs} />
				<FindExpartModal author={author} open={openFindExpart} handelClose={() => setOpenFindExpart(false)} orgs={orgs} />
				<ToastContainer />
			</>
		</FrontLayout>
	)
}

export default org
