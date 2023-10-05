/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-empty */
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
import Slider from "../components/camp-slider/Slider"
import router, { useRouter } from "next/router"
import { GET_ORGANIZATIONS, GET_ORGANIZATION } from "apollo/queries/orgQuery"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import { MY_ADVERTS } from "apollo/queries/advertsQuery"
import { GET_USER_POSTS } from "apollo/queries/postQuery"
import { MY_VICTORIES } from "apollo/queries/victories"
import { MY_EVENT } from "apollo/queries/eventQuery"
import { FOLLOW, UNFOLLOW } from "apollo/queries/generalQuery"
import CreatePost from "../components/modals/CreatePost"
import CreateAdvert from "../components/modals/CreateAdvert"
import CreateEvent from "../components/modals/CreateEvent"
import StartPetition from "../components/modals/StartPetition"
import AdvertsComp from "components/AdvertsCard"
import PetitionComp from "components/PetitionCard"
import EventsCard from "components/EventsCard"
import CampComp from "components/CampComp"
import PostActionCard from "components/PostActionCard"
import { Dropdown } from "rsuite"
import Cookies from "js-cookie"
import VictoryCard from "components/VictoryCard"
import Updates from "components/updates"
import FollowSlides from "components/camp-slider/FollowSlides"
import { MY_PETITION } from "apollo/queries/petitionQuery"
import Online from "components/Online"
import FindExpartModal from "components/modals/FindExpartModal"

const user = () => {
	const [campaigns, setCampaigns] = useState<ICampaign[]>([])
	const author = useRecoilValue(UserAtom)

	const [openPost, setOpenPost] = useState(false)
	const [openAd, setOpenAd] = useState(false)
	const [openEvent, setOpenEvent] = useState(false)
	const [openPetition, setOpenPetition] = useState(false)

	const handelClick = () => setOpenPost(!openPost)
	const handelPetition = () => setOpenPetition(!openPetition)
	const handelAdClick = () => setOpenAd(!openAd)
	const handelEventClick = () => setOpenEvent(!openEvent)

	const [user, setUser] = useState<IUser>()
	const [orgs, setOrgs] = useState<IOrg[]>([])
	const { query } = useRouter()
	const [product, setProduct] = useState(false)
	const [following, setFollow] = useState(false)
	const [orgId, setOrgId] = useState("")
	const [all, setAll] = useState<any>([])
	const [adverts, setAdverts] = useState<any>([])
	const [posts, setPosts] = useState<any>([])
	const [victories, setVictories] = useState<any>([])
	const [events, setEvents] = useState<any>([])
	const [openFindExpart, setOpenFindExpart] = useState(false)
	const handelOpenFindExpart = () => setOpenFindExpart(!openFindExpart)
	const uploadRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);
	const [img, setImg] = useState("");

	const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
		// const { files } = e.target;
		// setImg(URL.createObjectURL(files?.[0] as any));
		const files = e.target.files;
		const reader = new FileReader();
		if (files && files.length > 0) {
			reader.readAsDataURL(files[0]);
			reader.onloadend = () => {
				if (reader.result) {
					setImg(reader.result as any);
				}
			};
		}
	};

	const uploadFileToServer = async () => {
		if (!img) {
			uploadRef.current?.click();
		} else {
			try {
				setLoading(true);
				const { data } = await axios.post("/user/upload", { image: img });
				toast("Image uploaded successfully");
				// setUser({ ...user, image: data });
				setImg("");
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
	};

	useQuery(GET_ORGANIZATIONS, {
		variables: { ID: author?.id },
		client: apollo,
		onCompleted: (data) => {
			// console.log(data.getUserOrganizations)
			setOrgs(data.getUserOrganizations)
		},
		onError: (err) => {
			// console.log(err)
		},
	})

	useQuery(MY_ADVERTS, {
		client: apollo,
		variables: { authorId: query.page },
		onCompleted: (data) => {
			// console.log(data)
			setAdverts(data.myAdverts)
		},
		onError: (err) => console.log(err),
	})

	useQuery(MY_PETITION, {
		client: apollo,
		variables: { authorId: query.page },
		onCompleted: (data) => {
			// console.log(data)
			setCampaigns(data.myPetition)
		},
		onError: (err) => {
			console.log(err)
		},
	})

	useQuery(MY_VICTORIES, {
		client: apollo,
		variables: { authorId: query.page },
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
			// console.log(data)
			setPosts(data.myPosts)
		},
		onError: (err) => console.log(err),
	})

	function isValidUrl(string: any) {
		try {
			new URL(string)
			return true
		} catch (err) {
			return false
		}
	}
	const follow = async (id) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(FOLLOW),
				variables: {
					followerId: author.id,
					followId: id,
				},
			})
			console.log(data)
			setFollow(true)
		} catch (error) {
			console.log(error)
		}
	}
	const unfollow = async (id) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(UNFOLLOW),
				variables: {
					followerId: author.id,
					unfollowId: id,
				},
			})
			console.log(data)
			setFollow(false)
		} catch (error) {
			console.log(error)
		}
	}

	function searchForValue(id) {
		if (author) {
			let matchingStrings = false;
			for (const string of author?.following) {
				if (string.includes(id)) {
					matchingStrings = true
				}
			}
			return matchingStrings;
		}
	}
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

	const getSingle = () => {
		// if (query.page === undefined) {
		// 	router.push("/")
		// }
		try {
			axios
				.get(`/user/single/${query.page}`)
				.then(function (response) {
					setUser(response.data.user)
					// setCampaigns(response.data.Petitions)
					// console.log(response.data)
					response.data.user.orgOperating.map((operating: any) => {
						setOrgId(operating)
						refetch()
					})
				})
				.catch(function (error) {
					if (error?.response.data.statusCode === 404) {
						router.push(`org?page=${query.page}`)
					}
					console.log(error.response)
				})
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getData()
		getSingle()
	}, [adverts, author, posts, events, campaigns, victories])

	const { refetch } = useQuery(GET_ORGANIZATION, {
		variables: { ID: orgId },
		client: apollo,
		onCompleted: (data) => {
			setOrgs([...orgs, data.getOrganzation])
		},
		onError: (err) => {
			// console.log(err)
		},
	})

	const singleOrg = (id: string) => {
		localStorage.setItem("page", `${id}`)
		router.push(`/org?page=${id}`)
	}


	return (
		<FrontLayout showFooter={false}>
			<>
				<Head>
					<title>
						{`Theplaint.org`} || {user?.name}{" "}
					</title>
				</Head>
				<div className="lg:mx-52">
					<div className="rounded-md ">
						<div className="relative ">
							<div>
								<img className="w-full h-52" src="https://source.unsplash.com/random/800x400?nature" alt="" />
							</div>
							{
								author?.id === query.page ? <div className="edit-sec relative sm:w-[90%] lg:left-10 sm:left-2 -top-20">
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
								</div>
									: <div className="relative -top-20 left-10 rounded-circle w-44 h-44 pro-img  bg-white p-1">
										<div className="relative w-44 h-44">
											<img className="rounded-circle w-44 h-44" src={user?.image} alt="" />
										</div>
									</div>
							}
						</div>
						<div className="-mt-28 py-8 lg:px-10 px-2 z-10">
							<div className="lg:flex justify-between">
								<div className="flex flex-column justify-center">
									<div className="flex">
										{author && <Online id={query.page} />}
										<div className="text-xl font-bold ">{user?.name}</div>
										<div className="flex cursor-pointer my-auto ml-6">
											<Link href="/connection?page=followers">
												<div className="text-xs text-gray-900 ml-2"> {user?.followers.length} Followers</div>
											</Link>
											<Link href="/connection?page=following">
												<div className="text-xs text-gray-900 ml-2">Following {user?.following.length}</div>
											</Link>
										</div>
									</div>
									<div className="text-sm font-thin w-96">{user?.description.substring(0, 100) + "..."}</div>
									<div className="flex">
										<img className="w-4 h-4 mr-3 my-auto" src="/images/home/icons/akar-icons_location.png" alt="" />
										<div className="pt-1 text-sm">
											{user?.city}, {user?.country}
										</div>
									</div>
									{
										following === false ? author?.id !== query.page && <div>
											{searchForValue(query.page) ? <span onClick={() => unfollow(query.page)} className="cursor-pointer text-warning">Unfollow</span> : <span onClick={() => follow(query.page)} className="cursor-pointer text-warning mt-2">+ Follow</span>}
										</div> : <div className="text-sm text-warning mt-2">Following</div>
									}
								</div>

								<div className="mt-auto z-10">
									{
										author?.id === query.page ? <div className="font-black text-lg">
											<Link href={`/mycamp/profile`}>
												<button className="bg-transparent p-2 text-warning">
													<span>&#x270E;</span> Edit
												</button>
											</Link>
										</div> : ""
										// <div className="font-black text-lg">
										// 	<Link href={`messages?page=${user?.id}`}>
										// 		<button className="bg-transparent border border-warning rounded-full px-6 py-1 text-warning">
										// 			Send Message
										// 		</button>
										// 	</Link>
										// </div>
									}
								</div>
							</div>
							<div className="my-2">
								{query.page !== author?.id && <Link href={`/report?page=${query.page}`}>Report</Link>}
							</div>
						</div>
					</div>
					<Slider />
					<div className="lg:flex mt-3">
						<div className="lg:w-1/3 mt-3 lg:mr-4 rounded-md">
							{author?.id === query.page ? (
								<div className="text-base p-3">
									<div className="my-2">
										<Link href="/mycamp">
											<button className="bg-transparent">Dashboard</button>
										</Link>
									</div>
									<div className="my-2">
										<button className=" bg-transparent" onClick={() => setProduct(!product)}>
											Products
										</button>
									</div>
									{/* <div
										// href={"/org/create"}
										className="cursor-pointer sm:hidden"
										onClick={() => {
											const url = new URL("https://teamapp-6jfl6.ondigitalocean.app/home")
											url.searchParams.set("u_refer", Cookies.get("__ed_KEY") as string)
											window.open(url.toString(), "__blank")
										}}
									>
										<div className="bg-transparent my-2 flex justify-between">
											<div className="my-auto  w-1/2">Human Right Action</div>
											<div className="text-center cursor-pointer">
												<div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
												<div className="text-xs"> add </div>
											</div>
										</div>
									</div> */}
									<Link href={"/org/create"}>
										<div className="bg-transparent my-2 flex sm:hidden justify-between">
											<div className="my-auto w-1/2">Organization</div>
											<div className="text-center cursor-pointer">
												<div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
												<div className="text-xs"> create </div>
											</div>
										</div>
									</Link>
									{/* <div className="bg-transparent my-2 flex justify-between">
                                        <div className="my-auto  w-1/2">Adverts</div>
                                        <div className='text-center cursor-pointer' onClick={() => handelAdClick()}>
                                            <div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
                                            <div className="text-xs">  create </div>
                                        </div>
                                    </div> */}
									<div className="sm:hidden">
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
									<div className="text-left">
										<Dropdown title="My Interests">
											{author?.interests.map((interst, i) => <Dropdown.Item key={i}>{interst}</Dropdown.Item>)}
										</Dropdown>
									</div>
								</div>
							) : (
								<div className="text-left">
									<Dropdown title="User Interests">
										{user?.interests.map((interst, i) => <Dropdown.Item key={i}>{interst}</Dropdown.Item>)}
									</Dropdown>
								</div>)}
						</div>
						{product ? (
							<div className="w-full rounded-md mt-3">
								<div className="bg-transparent cursor-pointer w-36 my-2 mx-auto flex justify-between" onClick={() => handelAdClick()}>
									<div className="text-center my-auto">
										<div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
										{/* <div className="text-xs">  create </div> */}
									</div>
									<div className="my-auto text-sm">Create Product</div>
								</div>
								<div>
									{adverts.map((advert: any, index) => (
										<div key={index}>
											<AdvertsComp advert={advert} />
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="lg:w-4/6">
								{query.page === author?.id ? (
									<PostActionCard
										authorImage={author?.image}
										handelOpenFindExpart={handelOpenFindExpart}
										handelClick={handelClick}
										handelEventClick={handelEventClick}
										handelPetition={handelPetition}
									/>
								) : null}
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
														<VictoryCard post={single} orgs={orgs} />
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
										}
									})
									: null}
							</div>
						)}
					</div>
				</div>
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

export default user
