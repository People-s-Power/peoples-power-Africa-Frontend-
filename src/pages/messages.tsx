import React, { useState, useEffect, useRef } from "react"
import FrontLayout from "layout/FrontLayout"
import { SERVER_URL } from "utils/constants"
import { io } from "socket.io-client"
import ReactTimeAgo from "react-time-ago"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import router, { useRouter } from "next/router"
import { Dropdown } from "rsuite"
import Link from "next/link"
import { Popover, Whisper } from "rsuite"
import { GET_ORGANIZATIONS, GET_ORGANIZATION } from "apollo/queries/orgQuery"
import { Loader } from "rsuite"
import { apollo } from "apollo"
import { useQuery } from "@apollo/client"
// import { print } from "graphql"
import axios from "axios"
import { socket } from "pages/_app"
import CreateVictories from "components/modals/CreateVictories"
import Online from "components/Online"
import { IUser } from "types/Applicant.types"

const messages = () => {
	const user = useRecoilValue(UserAtom)
	const [message, setMessage] = useState<any>("")
	const [messages, setMessages] = useState<any>(null)
	const [active, setActive] = useState<any>(user)
	const [show, setShow] = useState(null)
	const { query } = useRouter()
	const [rating, setRating] = useState<any>(0)
	const [star, setStar] = useState<any>(false)
	const [orgs, setOrgs] = useState<any>(null)
	const [orgId, setOrgId] = useState("")
	const uploadRef = useRef<HTMLInputElement>(null)
	const [filesPreview, setFilePreview] = useState<any>([])
	const [loading, setLoading] = useState(false)
	const bottomRef = useRef(null);
	const [victory, setVictory] = useState<any>(false)
	const makeTestimony = () => setVictory(!victory)
	const [sigUser, setUser] = useState<IUser>()
	const [typing, setTypingData] = useState("")

	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (filesPreview.length < 1) {
			const files = e.target.files
			const reader = new FileReader()

			if (files && files.length > 0) {
				reader.readAsDataURL(files[0])
				reader.onloadend = () => {
					if (reader.result) {
						setFilePreview([...filesPreview, reader.result as string])
					}
				}
			}
		}
	}
	// const socket = io(SERVER_URL, {
	// 	query: {
	// 		user_id: user?.id,
	// 	},
	// })

	useQuery(GET_ORGANIZATIONS, {
		variables: { ID: user?.id },
		client: apollo,
		onCompleted: (data) => {
			// console.log(data.getUserOrganizations)
			setOrgs(data.getUserOrganizations)
		},
		onError: (err) => {
			// console.log(err)
		},
	})

	const { refetch } = useQuery(GET_ORGANIZATION, {
		variables: { ID: orgId },
		client: apollo,
		onCompleted: (data) => {
			setOrgs([...orgs, data.getOrganzation])
		},
		onError: (err) => {
			console.log(err.message)
		},
	})

	const deleteChat = (id) => {
		if (socket.connected) {
			socket.emit('delete_dm', {
				dmId: id,
				userId: active.id || active._id,
			}, response => {
				console.log('delete_dm:', response)
				getDm()
			}
			);
		}
	}
	const getSingle = () => {
		try {
			axios.get(`/user/single/${user?.id}`).then(function (response) {
				// console.log(response.data.user.orgOperating)
				response.data.user.orgOperating.map((operating: any) => {
					setOrgId(operating)
					refetch()
				})
			})
		} catch (error) {
			console.log(error)
		}
	}

	const sendFile = (id) => {
		if (filesPreview.length > 0) {
			setLoading(true)
			const payload = {
				to: id,
				from: active.id || active._id,
				type: "file",
				file: filesPreview[0],
				dmType: active?.__typename === undefined ? "consumer-to-consumer" : "consumer-to-org",
			}
			socket.emit("send_dm", payload, (response) => {
				console.log(response)
				setFilePreview([])
				setShow(response)
				setLoading(false)
				if (query.page !== undefined) {
					router.push("/messages")
				}
			})
		}
	}
	const sendDm = (id) => {
		if (message !== "") {
			setLoading(true)
			const payload = {
				to: id,
				from: active.id || active._id,
				type: "text",
				text: message,
				dmType: active?.__typename === undefined ? "consumer-to-consumer" : "consumer-to-org",
			}
			socket.emit("send_dm", payload, (response) => {
				setMessage("")
				setShow(response)
				setLoading(false)
				if (query.page !== undefined) {
					router.push("/messages")
				}
			})
		}
	}
	useEffect(() => {
		setActive(user)
		getSingle()
	}, [user, socket])

	const getDm = () => {
		if (socket.connected) {
			socket.emit("get_dms", active?.id || active?._id, (response) => {
				setMessages(response.reverse())
				console.log(response)
			})
		}
	}

	useEffect(() => {
		if (query.page) {
			try {
				axios
					.get(`/user/single/${query.page}`)
					.then(function (response) {
						// console.log(response.data.user)
						setUser(response.data.user)
					})
			} catch (error) {
				console.log(error)
			}
		}
	}, [])

	useEffect(() => {
		getDm()
	}, [show, active])

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [show])


	const blockUser = (id) => {
		if (socket.connected) {
			socket.emit(
				"block_message",
				{
					messageId: id,
					userId: active.id || active._id
				},
				(response) => {
					console.log("block_message:", response)
					setShow(null)
					getDm()
				}
			)
		}
	}

	const unblockUser = (id) => {
		if (socket.connected) {
			socket.emit(
				"unblock_message",
				{
					messageId: id,
					userId: active.id || active._id
				},
				(response) => {
					console.log("unblock_message:", response)
					setShow(null)
					getDm()
				}
			)
		}
	}

	const readMessage = (id, msg) => {
		if (socket.connected) {
			socket.emit('read_message', {
				messageId: msg,
				dmId: id,
				userId: active.id || active._id,
			}, (response) => {
				console.log('read_message:', response),
					getDm()
			}
			);
		}
	}

	const deleteDm = (id, msg) => {
		if (socket.connected) {
			socket.emit('delete_message', {
				messageId: msg,
				dmId: id,
				userId: active.id || active._id,
			}, response => {
				console.log('delete_message:', response),
					// getDm()
					location.reload();
			});
		}
	}

	const resolve = (id) => {
		if (star === false) {
			setStar(true)
			return
		}
		socket.emit(
			"send_reviews",
			{
				authorId: active.id,
				messageId: id, // message id,
				rating: rating,
			},
			(response) => {
				console.log("send_reviews:", response)
			}
		)
		setStar(false)
	}

	const markUnRead = (id) => {
		if (socket.connected) {
			socket.emit('mark_as_unread', {
				dmId: id,
				userId: active.id || active._id,
			}, (response) => {
				// console.log('mark_as_unread:', response)
				getDm()
			})
		}
	}
	const markRead = (id, msg) => {
		if (socket.connected) {
			socket.emit('mark_as_read', {
				dmId: id,
				userId: active.id || active._id,
			}, (response) => {
				// console.log('mark_as_read:', response)
				readMessage(id, msg)
			})
		}
	}
	// item.users[0]._id === active.id ? item.users[1].name : item.users[0].name
	const search = (value) => {
		if (value === "") return getDm()
		const matchingStrings = []
		for (const string of messages) {
			if (string.users[0]._id === active.id ? string.users[1].name.toLowerCase().includes(value) : string.users[0].name.toLowerCase().includes(value)) {
				matchingStrings.push(string);
			}
		}
		setMessages(matchingStrings)
	}

	const sendTyping = (id) => {
		if (socket.connected) {
			socket.emit('typing', {
				to: id,
				userName: active.name
			}, response =>
				console.log('typing:', response),
			);
		}
	}

	const setTyping = () => {
		if (socket.connected) {
			socket.on('typing', function (data) {
				console.log('typing', data);
				setTypingData(data)
				setTimeout(() => setTypingData(''), 4000)
			});
		}
	}

	useEffect(() => {
		setTyping()
	})

	const speaker = (
		<Popover>
			<div onClick={() => setActive(user)} className="flex m-1 cursor-pointer">
				<img src={user?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
				<div className="text-sm my-auto">{user?.name}</div>
			</div>
			{orgs !== null
				? orgs.map((org: any, index: number) => (
					<div
						onClick={() => {
							setActive(org)
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
		<FrontLayout showFooter={false} msg={false}>
			<div className="lg:flex lg:px-32 sm:p-6">
				<div className="lg:w-[40%] overflow-y-auto h-full">
					<div className="text-lg p-3">Messages</div>
					{orgs && (
						<div className="my-2 bg-warning p-2 rounded-md">
							<Whisper placement="bottom" trigger="click" speaker={speaker}>
								<div className="flex justify-between ">
									<div className="flex cursor-pointer">
										<img src={active?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
										<div className="text-sm my-auto">{active?.name}</div>
									</div>
									<div className="my-auto">
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
											<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
										</svg>
									</div>
								</div>
							</Whisper>
						</div>
					)}
					<input type="text" className="p-2 rounded-md w-full" onChange={(e) => search(e.target.value)} placeholder="Search Messages" />
					{messages &&
						messages.map((item, index) => (
							<div key={index} className={
								item.type === "consumer-to-consumer" ? item.unread === true || item.messages[item.messages.length - 1]?.received === false && item.messages[item.messages.length - 1]?.to === active.id ? "flex p-3 bg-gray-100 cursor-pointer" : "flex p-3 hover:bg-gray-100 w-full cursor-pointer" : item.unread === true || item.messages[item.messages.length - 1].received === false && item.messages[item.messages.length - 1]?.to === active._id ? "flex p-3 bg-gray-100 cursor-pointer" : "flex p-3 hover:bg-gray-100 w-full cursor-pointer"}>


								<div onClick={() => { setShow(item); readMessage(item.id, item.messages[item.messages.length - 1]?._id); markRead(item.id, item.messages[item.messages.length - 1]?._id) }}
									className={"w-full flex"}
								>
									{
										item.type === "consumer-to-consumer" ? <img src={item.users[0]._id === active.id ? item.users[1].image : item.users[0].image
										} className="w-10 h-10 rounded-full my-auto" alt="" /> :
											<img src={item.users[0]._id === active._id || active.id ? item.users[1].image : item.users[0].image
											} className="w-10 h-10 rounded-full my-auto" alt="" />
									}

									{
										item.type === "consumer-to-consumer" ? <div className="w-6 my-auto mx-auto">
											{item.unread === true || item.messages[item.messages.length - 1]?.received === false && item.messages[item.messages.length - 1]?.to === active.id ? <div className="bg-warning mx-auto w-2 h-2 my-auto rounded-full"></div> : null}
										</div> : <div className="w-6 my-auto mx-auto">
											{item.unread === true || item.messages[item.messages.length - 1].received === false && item.messages[item.messages.length - 1]?.to === active._id ? <div className="bg-warning mx-auto w-2 h-2 my-auto rounded-full"></div> : null}
										</div>
									}

									<div className="w-[80%] ml-4">
										<div className="flex">
											<Online id={item.users[0]._id === active.id || active._id ? item.users[1]._id : item.users[0]._id} />
											{
												item.type === "consumer-to-consumer" ? <div className="text-base font-bold">{item.users[0]._id === active.id ? item.users[1].name : item.users[0].name}</div>
													: <div className="text-base font-bold">{item.users[0]._id === active._id || active.id ? item.users[1].name : item.users[0].name}</div>
											}
										</div>
										<div>
											<div className="text-sm"> <strong>{item.messages[item.messages.length - 1]?.type === "sponsored" ? "Expert Needed" : item.messages[item.messages.length - 1]?.type === "advert" ? "Promoted" : null} </strong> {item.messages[item.messages.length - 1]?.text?.substring(0, 50)} {item.messages[item.messages.length - 1]?.file ? "file" : ""}</div>
											<ReactTimeAgo date={new Date(item.updatedAt)} />
										</div>
									</div>
								</div>
								<Dropdown placement="leftStart" title={<img className="h-6 w-6" src="/images/edit.svg" alt="" />} noCaret>
									<Dropdown.Item>
										<span onClick={() => deleteChat(item.id)}>Delete</span>
									</Dropdown.Item>
									<Dropdown.Item>
										<span onClick={() => markUnRead(item.id)}>Mark Unread</span>
									</Dropdown.Item>
									<Dropdown.Item>
										<span onClick={() => markRead(item.id, item.messages[item.messages.length - 1]._id)}>Mark Read</span>
									</Dropdown.Item>
								</Dropdown>
							</div>
						))}
				</div>
				<div className={`lg:w-[45%] shadow-md lg:fixed lg:right-32 h-full sm:overflow-auto sm:mt-4  ${show !== null || query.page !== undefined ? 'sm:absolute sm:top-20 bg-white z-10 sm:left-0 sm:h-screen sm:w-screen' : 'sm:hidden'}`}>
					<div className="lg:hidden cursor-pointer p-4" onClick={() => setShow(null)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
							<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
						</svg>
					</div>
					{show === null && query.page !== undefined ? (
						<div className="text-center text-sm">
							{sigUser && <div className="text-center">
								<div className="flex justify-center mb-3">
									<img src={sigUser.image} className="w-12 h-12 rounded-full" alt="" />
									<div className="ml-4 my-auto">
										<div className="text-sm">{sigUser.name}</div>
									</div>
								</div>
								<p className="text-xs">{sigUser.description}</p>
							</div>}

							<p className="text-sm text-center text-warning py-1">{typing}</p>
						</div>
					) : (
						show &&
						<div className="lg:h-[60%] overflow-y-auto">
							<div className="p-2 sm:hidden text-center text-xs text-gray-400 border-b border-gray-200">
								<ReactTimeAgo date={new Date(show?.createdAt)} />
							</div>
							<div className="p-3">
								<div className="flex mb-3">
									{
										show?.type === "consumer-to-consumer" ? <img src={show.users[0]._id === active.id ? show.users[1].image : show.users[0].image} className="w-12 h-12 rounded-full" alt="" /> :
											<img src={show.users[0]._id === active._id ? show.users[1].image : show.users[0].image} className="w-12 h-12 rounded-full" alt="" />
									}
									<div className="ml-4 my-auto">
										{
											show.type === "consumer-to-consumer" ? <div className="text-sm">{show.users[0]._id === active.id ? show.users[1].name : show.users[0].name}</div> : <div className="text-sm">{show.users[0]._id === active._id ? show.users[1].name : show.users[0].name}</div>
										}
										<p className="text-sm text-center text-warning py-1">{typing}</p>
										<div className="text-xs">
											<ReactTimeAgo date={new Date(show.updatedAt)} />
										</div>
									</div>
								</div>
								{show.messages.map((item, index) =>
									item.from === active.id || active._id ? (
										<div key={index} className="flex">
											<div className="text-xs my-2 p-1 bg-gray-200 w-[80%] ml-auto rounded-md flex justify-between">
												{item.text}
												<img src={item?.file} alt="" />
												{
													item.delivered === true && item.received === false ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#18C73E" className="bi bi-check2" viewBox="0 0 16 16">
														<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
													</svg> : item.delivered === true && item.received === true ?
														<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#18C73E" className="bi bi-check2-all" viewBox="0 0 16 16">
															<path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z" />
															<path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z" />
														</svg> : null
												}
											</div>
											<Dropdown placement="leftStart" title={<img className="h-6 w-6" src="/images/edit.svg" alt="" />} noCaret>
												<Dropdown.Item>
													<span onClick={() => deleteDm(show.id, item._id)}>Delete</span>
												</Dropdown.Item>
											</Dropdown>
										</div>
									) : (
										<div key={index} className="text-xs w-[80%] my-2">
											{item.text}
											<img src={item?.file} alt="" />
										</div>
									)
								)}
								<div ref={bottomRef} />
							</div>
						</div>
					)}
					{
						show?.messages[show.messages.length - 1]?.type === "advert" ? <div className="fixed bottom-5 text-center w-[45%] bg-white">
							<a href={show.messages[show.messages.length - 1].link}>
								<button className="p-2 bg-warning w-44 mx-auto text-white rounded-md">Sign Up</button>
							</a>
						</div> :
							show?.blocked !== true ? (show !== null || query.page !== undefined ? (
								<div className="fixed bottom-0 lg:w-[45%] sm:left-0 w-full bg-white ">
									<div className="flex relative">
										<textarea
											onChange={(e) => { setMessage(e.target.value), sendTyping(show?.users[1]._id === active.id || active._id ? show.users[0]?._id : show?.users[1]?._id) }}
											className="w-full h-32 text-sm p-2 border bg-gray-200 border-white"
											placeholder="Write a message"
											value={message}
										></textarea>
										<Dropdown placement="topEnd" title={<img className="h-6 w-6 text-sm" src="/images/edit.svg" alt="" />} noCaret>
											{show?.type === "customer-org" && (
												<Dropdown.Item>
													<span onClick={() => resolve(active.id || active._id)}>Resolve</span>
												</Dropdown.Item>
											)}
											<Dropdown.Item>
												<span onClick={() => makeTestimony()}>Make a Testimony</span>
											</Dropdown.Item>
											<Link href={`/report?page=${show?.participants[0] || query.page}`}>
												<Dropdown.Item>Report User/Ad</Dropdown.Item>
											</Link>
											<Dropdown.Item>
												<span onClick={() => blockUser(show?.id)}>Block User</span>
											</Dropdown.Item>
										</Dropdown>
										{star === true && (
											<div className="absolute z-10 top-0 left-0 w-full bg-white h-full text-center">
												<p className="text-xl">Rate the performance of this Organization</p>
												<div className="flex my-2 justify-center cursor-pointer">
													<div onClick={() => setRating(1)} className="mx-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill={rating >= 1 ? "#18C73E" : "#D9D9D9"}
															className="bi bi-star-fill"
															viewBox="0 0 16 16"
														>
															<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
														</svg>
													</div>
													<div onClick={() => setRating(2)} className="mx-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill={rating >= 2 ? "#18C73E" : "#D9D9D9"}
															className="bi bi-star-fill"
															viewBox="0 0 16 16"
														>
															<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
														</svg>
													</div>
													<div onClick={() => setRating(3)} className="mx-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill={rating >= 3 ? "#18C73E" : "#D9D9D9"}
															className="bi bi-star-fill"
															viewBox="0 0 16 16"
														>
															<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
														</svg>
													</div>
													<div onClick={() => setRating(4)} className="mx-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill={rating >= 4 ? "#18C73E" : "#D9D9D9"}
															className="bi bi-star-fill"
															viewBox="0 0 16 16"
														>
															<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
														</svg>
													</div>
													<div onClick={() => setRating(5)} className="mx-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill={rating >= 5 ? "#18C73E" : "#D9D9D9"}
															className="bi bi-star-fill"
															viewBox="0 0 16 16"
														>
															<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
														</svg>
													</div>
												</div>
												<p className="text-xm">“ Give reasons why you are rating “</p>
												<div onClick={() => resolve(show.id)} className="text-sm text-warning cursor-pointer px-3 float-right mb-10">
													Send
												</div>
											</div>
										)}
									</div>
									{star === false ? (
										<div className="flex justify-between border-t border-gray-200 p-3">
											<div className="flex w-20 justify-between">
												<img onClick={() => uploadRef.current?.click()} className="w-4 h-4 my-auto  cursor-pointer" src="/images/home/icons/ic_outline-photo-camera.svg" alt="" />
												<img onClick={() => uploadRef.current?.click()} className="w-4 h-4 my-auto  cursor-pointer" src="/images/home/icons/charm_camera-video.svg" alt="" />
												<img className="w-4 h-4 my-auto  cursor-pointer" src="/images/home/icons/bi_file-earmark-arrow-down.svg" alt="" />
											</div>
											<input type="file" ref={uploadRef} className="d-none" onChange={handleImage} />
											<div className="flex">
												{filesPreview.map((file, index) => (
													<div key={index} className="relative w-20 h-20 mx-1">
														<img src={file} className="w-12 h-12" alt="" />
													</div>
												))}
											</div>
											{
												filesPreview.length >= 1 ? (
													<div onClick={() => sendFile(show?.participants[0] === active.id || active._id ? show.participants[1] || query.page : show?.participants[0] || query.page)} className="text-sm text-warning cursor-pointer">
														{loading ? <Loader /> : "Send"}
													</div>) : (
													<div onClick={() => sendDm(show?.participants[0] === active.id || active._id ? show.participants[1] || query.page : show?.participants[0] || query.page)} className="text-sm text-warning cursor-pointer">
														{loading ? <Loader /> : "Send"}
													</div>
												)
											}
											{/* <div onClick={() => sendDm(show?.participants[0] || query.page)} className="text-sm text-warning cursor-pointer">
												Send
											</div> */}
										</div>
									) : null}
								</div>
							) : <div className="p-4 text-center">
								<img className="w-40 mx-auto h-40 sm:hidden" src="/images/logo.svg" alt="" />
								<h5 className="my-4 sm:hidden">Chat with your clients.</h5>
								<p className="sm:hidden">Respond to Clients Message and Petitions message.</p>
								{/* <Link href={'/connection?page=followers'}> */}
								<button className="bg-warning px-4 text-white p-2 my-4 rounded-sm">chat with your clients</button>
								{/* </Link> */}
							</div>) :
								<div className="text-center text-gray-400">This user has been blocked {show.blockedBy === active.id || active._id ? <span className="text-warning cursor-pointer" onClick={() => unblockUser(show?.id)}>Unblock</span> : null} </div>
					}
				</div>
				<CreateVictories open={victory} handelClick={makeTestimony} victory={null} />
			</div>
		</FrontLayout>
	)
}

export default messages
