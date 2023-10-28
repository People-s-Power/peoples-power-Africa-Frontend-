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

import { GET_ORGANIZATION } from "apollo/queries/orgQuery"
import { Operator } from "pages/addadmin"
import { IUser } from "types/Applicant.types"

import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import { MY_VICTORIES } from "apollo/queries/victories"
import { ACTIVITIES } from "apollo/queries/orgQuery"
import NewTask from "components/modals/NewTask"
import { GET_TASKS, REMOVE_TASK } from "apollo/queries/taskQuery"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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
	const [activities, setActivities] = useState([])
	const [open, setOpen] = useState(false)
	const [tasks, setTasks] = useState([])



	const [operator, setOperator] = useState<Operator[]>([])
	const [operators, setOperators] = useState<IUser[]>([])
	const [users, setUsers] = useState<IUser[]>([])


	// const loading = true;
	const getGeneral = () => {
		let general = [...petition, ...post, ...adverts, ...events, ...victories]
		const randomizedItems = general.sort(() => Math.random() - 0.5)
		setCampaigns(randomizedItems)
		// console.log(randomizedItems)
	}


	useEffect(() => {
		axios
			.get(`/user`)
			.then(function (response) {
				setUsers(response.data)
				allAdmins()
			})
			.catch(function (error) {
				console.log(error)
			})
	}, [operator])

	useQuery(GET_ORGANIZATION, {
		variables: { ID: query.page },
		client: apollo,
		onCompleted: (data) => {
			console.log(data.getOrganzation.operators)
			setOperator(data.getOrganzation.operators)
		},
		onError: (err) => console.log(err),
	})



	const allAdmins = () => {
		setOperators([])
		const list: any = []
		operator.map((single: any) => {
			users.map((user: any) => {
				if (user.id === single.userId) {
					// console.log(user)
					list.push({ ...user, ...{ role: single.role } })
					setOperators(list)
				}
			})
		})
		console.log(operators)
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

	useQuery(GET_TASKS, {
		client: apollo,
		variables: { orgId: query.page, page: 1, limit: 100 },
		onCompleted: (data) => {
			console.log(data)
			setTasks(data.tasks.tasks)
		},
		onError: (err) => console.log(err),
	})

	useQuery(ACTIVITIES, {
		client: apollo,
		variables: { page: 1, limit: 100, orgId: query.page },
		onCompleted: (data) => {
			setActivities(data.getOrgActivities.activities)
			// setEvents(data.authorEvents)
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
					<title>{`Theplaint.org`}</title>
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
						<div className="flex w-[50%] mx-auto justify-between">
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
							<div
								onClick={() => { setActive("tasks"), allAdmins() }}
								className={
									active === "tasks"
										? "border-b border-warning cursor-pointer"
										: "cursor-pointer"
								}
							>
								Tasks
							</div>
							<div
								onClick={() => setActive("social")}
								className={
									active === "social"
										? "border-b border-warning cursor-pointer"
										: "cursor-pointer"
								}
							>
								Social Connect
							</div>
							<div
								onClick={() => router.push(`addadmin?page=${query.page}`)}
								className={
									active === "user"
										? "border-b border-warning cursor-pointer"
										: "cursor-pointer"
								}
							>
								User
							</div>

						</div>
						<div className="pt-4">
							{(() => {
								switch (active) {
									case "summary":
										return <div className="w-[80%] mx-auto">
											<div className="flex justify-evenly text-center">
												<div className="shadow-md rounded-md p-4">
													<p className="text-[#000000B2] text-sm">No of Posts</p>
													<h2 className="text-3xl my-4 font-bold">{post.length}</h2>
													<p className="text-[#000000B2] text-sm">5% increased this month</p>
												</div>
												<div className="shadow-md rounded-md p-4">
													<p className="text-[#000000B2] text-sm">Total No. of Petitions</p>
													<h2 className="text-3xl my-4 font-bold">{petition.length}</h2>
													<p className="text-[#000000B2] text-sm">5% increased this month</p>
												</div>
												<div className="shadow-md rounded-md p-4">
													<p className="text-[#000000B2] text-sm">No. of  Events</p>
													<h2 className="text-3xl my-4 font-bold">{events.length}</h2>
													<p className="text-[#000000B2] text-sm">5% increased this month</p>
												</div>
											</div>

											<p className="text-2xl my-8 text-center text-[#00401C]">Activity Logs</p>

											<div>
												{activities.length > 0 ? activities.map((activity, index) => <div className="flex p-3 border-b" key={index}>
													<img className="w-10 h-10 mr-4" src={activity.authorId.image} alt="" />
													<p className="my-auto">{activity.text} by {activity.authorId.name}</p>
												</div>) : <div className="text-center my-4">No Activities</div>}
											</div>
										</div>;
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
									case "tasks":
										return <div className="w-[80%] mx-auto">
											<button onClick={() => setOpen(true)} className="py-2 my-4 text-white float-right px-8 rounded-md bg-warning">Create Task</button>
											<div>
												<table className="table-auto w-full ">
													<thead className="bg-warning text-white text-left rounded-md">
														<tr>
															<th className="p-3">Date</th>
															<th className="p-3">Name</th>
															<th className="p-3">Author</th>
															<th className="p-3">Status</th>
															<th className="p-3">Due Date</th>
															{/* <th className="p-3">Endorsement</th> */}
															<th className="p-3">Action</th>
														</tr>
													</thead>
													<tbody>
														{tasks.length > 0 ? tasks.map(task => (
															<tr key={task._id}>
																<td className="p-3">
																	{task.createdAt.substring(0, 10)}
																</td>
																<td className="p-3">
																	{task.name}
																</td>
																<td className="p-3">
																	{task.author.name}
																</td>
																<td className="p-3">
																	{task.status}
																</td>
																<td className="p-3">
																	{task.dueDate.substring(0, 10)}
																</td>
																<td className="p-3">
																	<SingleTask task={task} operators={operators} />
																</td>
															</tr>
														)) : null}
													</tbody>
												</table>
											</div>
										</div>;
									case "social":
										return <div className="text-center my-8">Coming Soon</div>
								}
							})()}
						</div>
					</div>}
				</Wrapper>
				<NewTask open={open} handelClick={() => setOpen(false)} task={null} operators={operators} />
				<ToastContainer />
			</>
		</FrontLayout>
	)
}

const SingleTask = ({ task, operators }: { task: any, operators: any }) => {
	const [open, setOpen] = useState(false)

	const deleteTask = async () => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(REMOVE_TASK),
				variables: {
					id: task._id
				}
			})
			console.log(data)
			toast.success("Task deleted successfully")
		} catch (error) {
			console.log(error)
			toast.error(error?.response.data.message)
		}
	}

	return (
		<div className="flex justify-evenly">
			<img onClick={() => setOpen(true)} className="cursor-pointer" src="./images/pencil-fill.svg" alt="" />
			<img onClick={() => deleteTask()} className="cursor-pointer" src="./images/trash-fill.svg" alt="" />
			<NewTask open={open} handelClick={() => setOpen(false)} task={task} operators={operators} />
		</div>
	)
}

export default authGuard(MyCamp)
