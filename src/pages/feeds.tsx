/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import FrontLayout from "layout/FrontLayout"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import CampComp from "../components/CampComp"
import CreatePost from "../components/modals/CreatePost"
import CreateAdvert from "../components/modals/CreateAdvert"
import CreateEvent from "../components/modals/CreateEvent"
import StartPetition from "../components/modals/StartPetition"
import EventsCard from "components/EventsCard"
import { GET_ALL, CONNECTIONS, FOLLOW } from "apollo/queries/generalQuery"
import Link from "next/link"
import { GET_ORGANIZATIONS, GET_ORGANIZATION } from "apollo/queries/orgQuery"
import router, { useRouter } from "next/router"
import FollowSlides from "components/camp-slider/FollowSlides"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import { apollo } from "apollo"
import { useQuery } from "@apollo/client"
import { IUser, IOrg } from "types/Applicant.types"
import PetitionComp from "components/PetitionCard"
import AdvertsComp from "components/AdvertsCard"
import Updates from "components/updates"
import PostActionCard from "components/PostActionCard"
import FindExpartModal from "components/modals/FindExpartModal"
import VictoryCard from "components/VictoryCard"
import Shared from "components/Shared"
import { socket } from "pages/_app"
import Timeline from "components/Timeline"
import { Dropdown, Loader, Popover, Whisper } from "rsuite"
import NotificationCard from "components/NotificationCard"

const HomePage = () => {
	const author = useRecoilValue(UserAtom)
	const [openPost, setOpenPost] = useState(false)
	const [openAd, setOpenAd] = useState(false)
	const [openEvent, setOpenEvent] = useState(false)
	const [openPetition, setOpenPetition] = useState(false)
	const [users, setUsers] = useState<IUser[]>([])
	const handelClick = () => setOpenPost(!openPost)
	const handelPetition = () => setOpenPetition(!openPetition)
	const handelAdClick = () => setOpenAd(!openAd)
	const handelEventClick = () => setOpenEvent(!openEvent)
	// const [following, setFollow] = useState(false)
	const [all, setAll] = useState<any>([])
	// const [type, setType] = useState("")
	const [orgs, setOrgs] = useState<IOrg[]>([])
	const [orgId, setOrgId] = useState("")
	const [openFindExpart, setOpenFindExpart] = useState(false)
	// const [notification, setNotifications] = useState<any>([])
	const handelOpenFindExpart = () => setOpenFindExpart(!openFindExpart)
	const [count, setCount] = useState(0)
	const [loading, setLoading] = useState(false)
	const [active, setActive] = useState<any>(null)
	const [toggle, setToggle] = useState(true)
	const [hashtag, setHashtag] = useState("")
	// console.log(author)

	useEffect(() => {
		if (window.innerWidth < 768) {
			setToggle(false)
		}
	}, [])

	useQuery(GET_ORGANIZATIONS, {
		variables: { ID: author?.userId },
		client: apollo,
		onCompleted: (data) => {
			// console.log(data.getUserOrganizations)
			setOrgs(data.getUserOrganizations)
		},
		onError: (err) => {
			// console.log(err)
		},
	})
	useEffect(() => {
		setActive(author)
	}, [author === null])

	const { refetch } = useQuery(GET_ORGANIZATION, {
		variables: { ID: orgId },
		client: apollo,
		onCompleted: (data) => {
			setOrgs([...orgs, data.getOrganzation])
		},
		onError: (err) => {
			// console.log(err.message)
		},
	})

	function isValidUrl(string: any) {
		try {
			new URL(string)
			return true
		} catch (err) {
			return false
		}
	}
	const singleOrg = (id: string) => {
		localStorage.setItem("page", `${id}`)
		router.push(`/org?page=${id}`)
	}

	const getSingle = () => {
		try {
			axios.get(`/user/single/${author?.userId}`).then(function (response) {
				// console.log(response.data.user.orgOperating)
				response.data.user?.orgOperating.map((operating: any) => {
					setOrgId(operating)
					refetch()
				})
			})
		} catch (error) {
			console.log(error)
		}
	}

	async function getData(hstag = "") {
		try {
			setLoading(true)
			setAll([])
			let feed = []
			let notification = []
			await socket.emit(
				"notifications",
				{
					userId: active?._id || active?.id,
					page: 1,
					limit: 80,
				},
				(response) => {
					notification = response.notifications
					// setCount(response.unReadCount)
					console.log(response)
				}
			)

			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(GET_ALL),
				variables: {
					authorId: active?._id || active?.id,
					page: 1,
					limit: 50,
				},
			})

			console.log(data)

			await axios.get(`share/feed/${active?._id || active?.id}`).then(function (response) {
				response.data.map((single) => {
					feed.push({ ...single, __typename: "Share" })
				})
				console.log(feed)
				// feed = response.data
				// console.log(response.data)
			})

			const general = [
				...feed,
				...notification,
				...data.data.timeline.adverts,
				...data.data.timeline.updates,
				...data.data.timeline.events,
				...data.data.timeline.petitions,
				...data.data.timeline.posts,
				...data.data.timeline.victories,
			]

			const randomizedItems = general.sort(() => Math.random() - 0.5)
			const sortedItems = randomizedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

			let newArray = []
			for (let i = 0; i < sortedItems.length; i++) {
				newArray.push(sortedItems[i])
				if ((i + 1) % 12 === 0) {
					newArray.push({
						__typename: "Follow",
					})
				}
			}
			if (hstag) {
				// newArray = newArray.filter((feedItem) => {
				// 	if (Object.prototype.hasOwnProperty.call(feedItem, "category")) {
				// 		if (feedItem.category.toLowerCase() === hstag.toLowerCase()) return true;
				// 		return false;
				// 	}
				// 	return false;
				// })
				newArray = newArray.filter((feedItem) => {
					if (Object.prototype.hasOwnProperty.call(feedItem, "category")) {
						if (feedItem.category.toLowerCase() === hstag.toLowerCase()) return true
						return false
					}
					if (Object.prototype.hasOwnProperty.call(feedItem, "categories")) {
						// console.log(feedItem)
						if (feedItem.categories[0].toLowerCase() === hstag.toLowerCase()) return true
						return false
					}
					return false
				})
			}
			console.log(newArray)
			setAll(newArray)
			setLoading(false)
		} catch (err) {
			console.log(err)
			// getData()
			setLoading(false)
		}
	}

	const filterItemsByInterest = (selectedHashtag: string) => {
		setHashtag(selectedHashtag)
	}

	const refresh = () => {
		setAll([])
		getData()
		setCount(0)
	}

	useEffect(() => {
		getSingle()
		getUsers()
		getData(hashtag)
	}, [active, hashtag])

	const getUsers = async () => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(CONNECTIONS),
				variables: {
					authorId: author.id,
				},
			})
			// console.log(data)
			console.log(data.data);

			setUsers(data.data.connections)
		} catch (e) {
			console.log(e.response)
		}
	}

	const speaker = (
		<Popover>
			<div
				onClick={() => {
					setActive(author)
					// getData()
				}}
				className="flex m-1 cursor-pointer"
			>
				<img src={author?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
				<div className="text-sm my-auto">{author?.name}</div>
			</div>
			{orgs !== null
				? orgs?.map((org: any, index: number) => (
					<div
						onClick={() => {
							setActive(org)
							// getData()
						}}
						key={index}
						className="flex m-1 cursor-pointer"
					>
						<img src={org?.image} className="w-8 h-8 rounded-full mr-4" alt="" />
						<div className="text-sm my-auto">{org?.name}</div>
					</div>
				))
				: null}
		</Popover>
	)

	return (
		<FrontLayout showFooter={false}>
			<main className="flex lg:mx-20">
				{toggle && (
					<aside className="lg:w-[20%] w-[80%] text-center fixed bg-white sm:z-20 lg:left-20">
						<div className="bg-warning w-full h-10"></div>
						<div className="p-2 relative -top-6 border-b border-gray-200">
							<Whisper placement="bottom" trigger="click" speaker={speaker}>
								<div className="flex justify-center">
									<img src={active?.image} className="w-[80px] left-0 right-0 rounded-full h-[80px] " alt="" />
									<div className="ml-2 my-auto">
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#18C73E" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
											<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
										</svg>
									</div>
								</div>
							</Whisper>
							<div className="text-base font-light">{active?.name}</div>
							<div className="text-xs px-3">{active?.description?.substring(0, 100) + "..."}</div>
						</div>
						<div className="overflow-y-auto overflow-x-hidden h-[400px]">
							<div className="border-b border-gray-200 px-3">
								<div className="flex justify-between my-2">
									<div className="text-sm my-auto">Start Petition</div>
									<div onClick={() => handelPetition()} className="text-center cursor-pointer">
										<div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
										<span className="text-xs text-center">start</span>
									</div>
								</div>
								{/* <a href="https://teamapp-6jfl6.ondigitalocean.app/" target="_blank">
									<div className="flex justify-between my-2">
										<div className="text-sm my-auto">Human Right Action</div>
										<div onClick={() => { }} className="text-center cursor-pointer">
											<div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
											<span className="text-xs text-center">start</span>
										</div>
									</div>
								</a> */}
								<Link href={"/about#career"}>
									<div className="flex justify-between my-2">
										<div className="text-sm my-auto">Become an Ambassador</div>
										<div className="text-center cursor-pointer">
											<div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
											<span className="text-xs text-center">start</span>
										</div>
									</div>
								</Link>
								{/* <div className="flex justify-between my-2">
									<div className="text-sm my-auto">Event</div>
									<div onClick={() => handelEventClick()} className="text-center cursor-pointer">
										<div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
										<span className="text-xs text-center">create</span>
									</div>
								</div> */}
								<div className="flex justify-between my-2">
									<div className="text-sm my-auto">Organisation</div>
									<Link href={"/org/create"}>
										<div className="text-center cursor-pointer">
											<div className="bg-gray-100 mx-auto pt-[1px] rounded-full w-6 h-6 text-base font-bold">+</div>
											<span className="text-xs text-center">create</span>
										</div>
									</Link>
								</div>
								<div>
									{orgs.map((org: any, i) => (
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
							<div className="text-left sm:p-3">
								<div className="flex">
									<p className="my-4">My Interests</p>
									<Link href={"/mycamp/profile"}>
										<span className="cursor-pointer m-3">
											{/* <img src="/images/pencil.png" className="w-6 h-6" alt="" /> */}
											<button className="bg-transparent p-2 text-warning rotate-90">
												<span className="text-warning">&#x270E;</span>
											</button>
										</span>
									</Link>
								</div>
								{author?.interests.map((interst, i) => (
									<p className="text-sm my-3 capitalize cursor-pointer" key={i} onClick={() => filterItemsByInterest(interst)}>
										{interst}
									</p>
								))}
							</div>
						</div>
						<div className="">
							<Link href="/contact">
								<button className="btn btn-warning px-4 fw-bold my-3 text-light rounded-pill">
									Get in Touch
									<i className="fas fa-long-arrow-alt-right ms-2"></i>
								</button>
							</Link>
						</div>
						{/* <div className="text-left">
							<Dropdown title="My Interests">
								{author?.interests.map((interst, i) => (
									<Dropdown.Item key={i} onClick={() => filterItemsByInterest(interst)}>{interst}</Dropdown.Item>
								))}
							</Dropdown>
						</div> */}
					</aside>
				)}

				<section className="w-full lg:w-[50%] mx-auto">
					<PostActionCard
						authorImage={active?.image}
						handelOpenFindExpart={handelOpenFindExpart}
						handelClick={handelClick}
						handelEventClick={handelEventClick}
						handelPetition={handelPetition}
						count={count}
						hashtag={hashtag}
						refresh={refresh}
					/>
					{loading ? (
						<div className="w-full">
							<Loader size="md" center />
						</div>
					) : null}
					<div className="mt-3">
						{all.map((single: any, index: number) => {
							// setType(single.__typename)
							switch (single.__typename) {
								// case "Advert":
								// 	return (
								// 		<div key={index}>
								// 			<AdvertsComp advert={single} />
								// 		</div>
								// 	)
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
								case "Post":
									return (
										<div key={index}>
											<CampComp open={() => handelOpenFindExpart()} post={single} openPetition={() => handelPetition()} />
										</div>
									)
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
								case undefined:
									return (
										<div key={index}>
											<Timeline item={single} />
										</div>
									)
								default:
									return (
										<div key={index}>
											<Shared shared={single} />
										</div>
									)
							}
						})}
						{/* <CampComp /> */}
					</div>
				</section>
				<aside className="w-[20%] sm:hidden p-2 fixed bg-white right-20">
					<div className="text-sm">Grow your Support Base by following persons and organizations that interest you</div>
					{users.slice(0, 4).map((user: any, index) =>
						user?._id !== author?.userId ? (
							<div key={index}>
								<Follow user={user} setUsers={setUsers} getUsers={getUsers} />
							</div>
						) : null
					)}
					{/* <Link href="/connection">
						<div className="text-sm text-warning cursor-pointer">view who you followed is following</div>
					</Link> */}
					<div className="p-2">
						{/* <div className="my-3 text-sm">
							Grow your feed by following
							persons and pages that
							interest you
						</div> */}
						<div className="my-3 text-sm">Following someone or a page allows you to see the persons interest, campaign</div>
						<div className="my-3 text-sm">You can reach a larger audience by allowing others to follow your activity and read what you are sharing</div>
					</div>
				</aside>
				{toggle && <div onClick={() => setToggle(false)} className="bg-black opacity-50 lg:hidden block w-full fixed top-0 left-0 h-screen z-10"></div>}
				<button onClick={() => setToggle(!toggle)} className="p-3 lg:hidden  rounded-full bg-warning z-20 fixed bottom-4 right-10">
					{toggle ? (
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-x" viewBox="0 0 16 16">
							<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-plus" viewBox="0 0 16 16">
							<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
						</svg>
					)}
				</button>
				<StartPetition open={openPetition} handelClick={handelPetition} orgs={orgs} data={null} />
				<CreatePost open={openPost} handelClick={handelClick} orgs={orgs} handelPetition={handelPetition} post={null} />
				<FindExpartModal author={author} open={openFindExpart} handelClose={() => setOpenFindExpart(false)} orgs={orgs} />
				<CreateEvent open={openEvent} handelClick={handelEventClick} event={null} orgs={orgs} />
				<CreateAdvert open={openAd} handelClick={handelAdClick} advert={null} />
				<ToastContainer />
			</main>
		</FrontLayout>
	)
}

export default HomePage

function Follow({ user, getUsers, setUsers }: { user: any, getUsers: () => void, setUsers: Dispatch<SetStateAction<any>> }) {

	const [loading, setLoading] = useState(false)
	const author = useRecoilValue(UserAtom)

	// console.log(user)
	const followUser = async (user: any) => {
		try {

			setLoading(true)
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(FOLLOW),
				variables: {
					followerId: author.id,
					followId: user._id,
				},
			})
			console.log(data)
			setLoading(false)
			toast.success("Followed!")
			setUsers(users => users.filter(userIn => (userIn && userIn._id !== user._id)))
			getUsers()
		} catch (error) {
			console.log(error, "follow error")
			setLoading(false)
			toast.warn("Oops an error occoured!")
		}
	}
	return (
		<div className="flex justify-between my-4">
			<Link href={`user?page=${user._id}`}>
				<img src={user.image} className="w-12 mx-2 my-auto h-12 cursor-pointer rounded-full" alt="" />
			</Link>
			<div className="w-[80%]">
				<Link href={`user?page=${user._id}`}>
					<div className="cursor-pointer">
						<div className="text-base font-light">{user.name} </div>
						<div className="text-xs">{user.description.substring(0, 30)}</div>
					</div>
				</Link>
				{loading ? (
					<div className="px-4 py-1 text-xs border border-black w-[70%] mt-2 rounded-md">
						<div className="my-auto text-sm text-warning">Following...</div>
					</div>
				) : (
					<div onClick={() => followUser(user)} className="flex cursor-pointer justify-between px-4 py-1 text-xs border border-black w-[70%] mt-2 rounded-md">
						<div className="text-lg">+</div>
						<div className="my-auto text-sm" >
							Follow
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
