/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react"
import FrontLayout from "layout/FrontLayout"
import Head from "next/head"
import axios from "axios"
import { useRouter } from "next/router"
import { IUser } from "types/Applicant.types"
import { ADD_OPERATOR, GET_ORGANIZATION, DELETE_OPERATOR, EDIT_OPERATOR } from "apollo/queries/orgQuery"
import { apollo } from "apollo"
import { useQuery } from "@apollo/client"
import { print } from "graphql"
import { SERVER_URL } from "utils/constants"
import { Tooltip, Whisper, Button, ButtonToolbar } from "rsuite"
import { Modal } from "rsuite"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { PaystackButton, usePaystackPayment } from "react-paystack"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import { PaystackProps } from "react-paystack/dist/types"
import Reviews from "components/modals/Reviews"

export interface Operator {
	userId: string
	role: string
}

const addadmin = () => {
	const author = useRecoilValue(UserAtom)
	const [admins, setAdmins] = useState(true)
	const [admin, setAdmin] = useState(true)
	const [users, setUsers] = useState<IUser[]>([])
	const [searched, setSearched] = useState<IUser[]>([])
	const { query } = useRouter()
	const [role, setRole] = useState("")
	const [adminTag, setAdminTag] = useState(false)
	const [editor, setEditor] = useState(false)
	const [loading, setLoading] = useState(false)
	const [operator, setOperator] = useState<Operator[]>([])
	const [operators, setOperators] = useState<IUser[]>([])
	const [open, setOpen] = useState(false)
	const [id, setId] = useState("")
	const [userId, setUserId] = useState<any>("")
	const [step, setStep] = useState(0)
	const router = useRouter()
	const [professionals, setProfessionals] = useState<any>([])
	const [trained, setTrained] = useState([])

	const [review, setReview] = useState(false)

	// const paystack_config: PaystackProps = {
	// 	reference: new Date().getTime().toString(),
	// 	email: author?.email as string,
	// 	amount: role === "editor" ? 1500000 : 3500000,
	// 	firstname: author?.firstName,
	// 	lastname: author?.lastName,
	// 	currency: "NGN",
	// 	publicKey: "pk_live_13530a9fee6c7840c5f511e09879cbb22329dc28",
	// 	plan: role === "editor" ? "PLN_hyabaaqen17sez8" : "PLN_bpzuum9aliqlyrw",
	// }

	// const initializePayment = usePaystackPayment(paystack_config)

	// const onSuccess = async () => {
	// 	console.log(paystack_config)
	// 	setStep(1)
	// 	return
	// }
	// const onClose = () => {
	// 	console.log("")
	// }

	const promote = async () => {
		try {
			const { data } = await axios.post("/transaction/subscribe", {
				amount: role === "editor" ? 200 : 300,
				author: author.id,
				autoRenew: true,
			})
			console.log(data)
			// setStep(1)

			toast.success("Your payment is successful pending approval")
			setAdmin(true)
			setAdmins(true)
			allAdmins()
			// router.push(`/mycamp?page=${query.page}`)
		} catch (e) {
			toast.warn(e.response.data.message)
			// console.log(e.response.data.message)
		}
	}

	const hireProfessonal = () => {
		if (role === "") {
			toast.warn("Please select a role to proceed")
			return
		}
		if (step === 0) {
			// initializePayment(onSuccess, onClose)
			promote()
			return
		}
		if (step === 1) {
			addAdmin()
		}
	}

	useEffect(() => {
		getRep()
		axios
			.get(`/user`)
			.then(function (response) {
				setUsers(response.data)
				// allAdmins()
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
			allAdmins()
		},
		onError: (err) => console.log(err),
	})

	const allAdmins = () => {
		setOperators([])
		const list: any = []
		operator.map((single: any) => {
			users.map((user: any) => {
				if (user.id === single.userId) {
					list.push({ ...user, ...{ role: single.role } })
					setOperators(list)
				}
			})
		})
		console.log(operators)
	}

	const addAdmin = async () => {
		try {
			setLoading(true)
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				// client: apollo,
				query: print(ADD_OPERATOR),
				variables: {
					CreateOperator: {
						userId: id,
						role: role,
						orgId: query.page,
					},
				},
			})
			setLoading(false)
			console.log(data)
			toast.success("Admin added successfully!")
			location.reload()
		} catch (error) {
			toast.warn("Oops an error occoured")
		}
	}

	const updateAdmin = async () => {
		try {
			setLoading(true)
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				// client: apollo,
				query: print(EDIT_OPERATOR),
				variables: {
					CreateOperator: {
						userId: userId,
						role: role,
						orgId: query.page,
					},
				},
			})
			setLoading(false)
			console.log(data)
			toast.success("Admin role updated ")
			setOpen(false)
			location.reload()
		} catch (error) {
			toast.warn("Oops an error occoured")
			setLoading(false)
		}
	}

	const removeAdmin = async (sing: any) => {
		// console.log(sing)
		try {
			setLoading(true)
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(DELETE_OPERATOR),
				variables: {
					DeleteOperator: {
						operatorId: sing,
						orgId: query.page,
					},
				},
			})
			console.log(data)
			setLoading(false)
			toast.success("Admin Deleted Successfully!")
			location.reload()
		} catch (error) {
			toast.warn("Oops an error occoured")
		}
	}

	const search = (e: any) => {
		const matchingStrings = []
		for (const string of users) {
			if (
				string.firstName?.toLowerCase()?.includes(e.target.value) ||
				string.lastName?.toLowerCase()?.includes(e.target.value) ||
				string.name?.toLowerCase()?.includes(e.target.value)
			) {
				matchingStrings.push(string)
			}
		}
		setSearched(matchingStrings)
	}
	const searchProf = (value) => {
		if (value === "") return
		const matchingStrings = []
		for (const string of trained) {
			if (string.name.toLowerCase().includes(value.target.value)) {
				matchingStrings.push(string)
			}
		}
		setProfessionals(matchingStrings)
	}

	const getRep = () => {
		try {
			axios.get("https://api.experthubllc.com/api/v5/user/state-ref").then((response) => {
				console.log(response.data)
				Array.isArray(response.data) && setTrained(response.data.map((d) => ({ ...d, name: d.firstName + " " + d.lastName })))
			})
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
		getRep()
	}, [])

	const adminTooltip = <Tooltip>This person makes, edits, create and promote, posts, petitons, events, update, organization and profile.</Tooltip>
	const editorTooltip = <Tooltip>This person edits posts, petitons, events, update and products.</Tooltip>

	return (
		<FrontLayout showFooter={false}>
			<>
				<Head>
					<title>{`People Power`} || Add Admin </title>
				</Head>
				<div className="sm:px-6">
					<div onClick={() => router.back()} className="cursor-pointer lg:ml-20">
						Back
					</div>
					<div className="lg:flex justify-evenly text-center">
						<div
							onClick={() => {
								setAdmin(true), setAdmins(true), allAdmins()
							}}
							className="cursor-pointer "
						>
							<div className="lg:text-xl text-base font-black underline">Admins</div>
							<p className="sm:hidden">Veiw all Admins</p>
						</div>
						<div
							onClick={() => {
								setAdmin(true), setAdmins(false)
							}}
							className="cursor-pointer"
						>
							<div className={"lg:text-xl text-sm font-bold underline"}>Add an Admin</div>
							<p className="sm:hidden">Manage your campaign</p>
						</div>
						<div
							onClick={() => {
								setAdmin(false), setAdmins(false)
							}}
							className="cursor-pointer"
						>
							<div className="lg:text-xl text-sm font-bold underline">Hire a trained professionals</div>
							<p className="sm:hidden">To draft, edit, promote and manage your campaigns with little cost.</p>
						</div>
					</div>
					{admin === true && admins === true ? (
						operators?.length >= 1 ? (
							operators.map((org, i) => (
								<div key={i} className="flex justify-between px-2 py-1 w-[80%] mx-auto bg-gray-200 my-2">
									<img src={org.image} className="w-12 rounded-full h-12 " alt="" />
									<div className="text-base capitalize ml-4 w-44 my-auto">
										{org?.firstName} {org.lastName}
									</div>
									<div className="my-auto text-xm capitalize w-32">
										{org?.role === "admin" ? (
											<Whisper placement="bottom" controlId="control-id-hover" trigger="hover" speaker={adminTooltip}>
												<button>{org?.role} &#x1F6C8;</button>
											</Whisper>
										) : (
											<Whisper placement="bottom" controlId="control-id-hover" trigger="hover" speaker={editorTooltip}>
												<button>{org?.role} &#x1F6C8;</button>
											</Whisper>
										)}
									</div>
									<div>
										<button
											onClick={() => {
												setOpen(!open), setRole(org.role), setUserId(org?.id)
											}}
											className="bg-transparent w-44 p-2"
										>
											<span>&#x270E;</span> Edit
										</button>
									</div>
									<div onClick={() => setReview(true)} className="p-2 my-auto cursor-pointer">
										Reviews & Rating
									</div>
									<div
										onClick={() => {
											removeAdmin(org.id)
										}}
										className=" cursor-pointer my-auto"
									>
										&#10006;
									</div>
									<Reviews user={org.id} open={review} handelClick={() => setReview(false)} />
								</div>
							))
						) : (
							<div className="text-center text-3xl my-4">No Admins yet</div>
						)
					) : null}
					{admin === true && admins === false ? (
						<div className="mt-20 lg:w-2/3 mx-auto">
							<div className="text-center text-3xl font-bold">Add an Admin</div>
							<div className="text-lg my-1">Add Page admin</div>
							<input
								type="text"
								className="p-3 rounded-md border border-gray w-full"
								onChange={(e) => {
									search(e)
								}}
								placeholder="Type here to search for a user to assign role"
							/>
							<div>
								{searched.map((search, i) => (
									<div
										key={i}
										className={
											id === search.id
												? "bg-gray-400 text-white p-3 text-base mb-1 cursor-pointer "
												: "" + "p-3 bg-gray-100 cursor-pointer hover:bg-gray-200 text-base mb-1"
										}
										onClick={() => {
											setId(search.id)
										}}
									>
										{search.firstName} {search.lastName}
									</div>
								))}
							</div>
							<div className="text-lg mt-4">Assign an admin role</div>
							<div>
								<div>
									<div className="flex my-1">
										<div className="my-auto mx-3">
											<input
												disabled={editor}
												type="checkbox"
												className="p-4"
												value="admin"
												checked={role === "admin"}
												onChange={() => {
													setRole("admin")
												}}
											/>
										</div>
										<div className="my-auto">
											<div className="text-lg font-bold">Admin</div>
											{/* <p>Event coverage, Writing and posting of campaigns, Editing of profile and campaigns, Promote campaigns, create an organization, Make update.	</p> */}
										</div>
									</div>
									<div className="flex my-1">
										<div className="my-auto mx-3">
											<input
												disabled={adminTag}
												type="checkbox"
												className="p-4"
												value="editor"
												checked={role === "editor"}
												onChange={() => {
													setRole("editor")
												}}
											/>
										</div>
										<div className="my-auto">
											<div className="text-lg font-bold">Editor</div>
											{/* <p>Edit profile, Edit campaigns and designs</p> */}
										</div>
									</div>
								</div>
							</div>
							<div className="text-center my-4">
								<button onClick={() => addAdmin()} className="p-2 bg-warning w-40 text-white">
									{loading ? "loading" : "Assign"}
								</button>
							</div>
						</div>
					) : admin === false && admins === false ? (
						<div>
							{step === 0 ? (
								<div className="mt-20 lg:w-2/3 mx-auto">
									<div className="text-center text-3xl font-bold">Hire a trained professionals</div>
									<div className="text-lg my-1">Leave the complexity of writing, designing and editing your campaigns and other administration to us.</div>
									<div className="text-lg mt-4">
										Our team of content writers, designers, journalists and social skill workers can handle your content, designs, updates and other
										administrations while you focus on building a strong and physical campaigns with momentum.
									</div>
									<div>
										<img src="/images/logo.svg" className="w-16 my-2 h-16 mx-auto" alt="" />
										<div className="font-bold text-lg text-center my-2">
											{author.name}, what plan will you like to use? <br />
											We&apos;ll recommend the right plan for you.
										</div>
										<div className="text-base my-2">
											Start your free 1-month trial today. Cancel anytime. We'll send you a reminder 7 days before your trial ends.
										</div>
										<div className="lg:flex lg:my-1 my-4 justify-between sm:text-center">
											<div className="my-auto lg:mx-3">
												<input
													onChange={() => {
														setRole("admin")
													}}
													type="checkbox"
													checked={role === "admin"}
													className="p-4 mx-auto"
												/>
											</div>
											<div className="my-auto lg:w-2/3">
												<div className="text-lg font-bold">Admin</div>
												<p className="sm:text-xs lg:text-base">
													Event coverage, Writing and posting of campaigns, Editing of profile and campaigns,
													<br /> Promote campaigns, create an organization, Make update.{" "}
												</p>
											</div>
											<button className="p-2 border borger-warning w-44 mx-1">N35, 000/Monthly</button>
										</div>
										<div className="lg:flex lg:my-3 my-4 justify-between sm:text-center">
											<div className="my-auto lg:mx-3">
												<input
													onChange={() => {
														setRole("editor")
													}}
													checked={role === "editor"}
													type="checkbox"
													className="p-4 "
												/>
											</div>
											<div className="my-auto lg:w-2/3">
												<div className="text-lg font-bold">Editor</div>
												<p className="sm:text-xs lg:text-base">Edit profile, Edit campaigns and designs</p>
											</div>
											<button className="p-2 border borger-warning w-44 mx-1">N15, 000/Monthly</button>
										</div>
									</div>
									<div className="text-center my-4">
										<button onClick={() => hireProfessonal()} className="p-2 bg-warning w-40 text-white">
											Start
										</button>
									</div>
								</div>
							) : (
								<div className="mt-20 w-2/3 mx-auto">
									<input
										type="text"
										className="p-3 rounded-md border border-gray w-full"
										onChange={(e) => {
											searchProf(e)
										}}
										placeholder="Type here to search for a user to assign role"
									/>
									<div>
										{professionals.map((search, i) => (
											<div
												key={i}
												className={
													id === search._id
														? "bg-gray-400 text-white p-3 text-base mb-1 cursor-pointer "
														: "" + "p-3 bg-gray-100 cursor-pointer hover:bg-gray-200 text-base mb-1"
												}
												onClick={() => {
													setId(search._id)
												}}
											>
												{search.name}
											</div>
										))}
									</div>
									<div className="text-center my-4">
										<button onClick={() => hireProfessonal()} className="p-2 bg-warning w-40 text-white">
											Assign
										</button>
									</div>
								</div>
							)}
						</div>
					) : (
						<></>
					)}
				</div>
				<ToastContainer />
				<Modal open={open} onClose={() => setOpen(!open)}>
					<div>
						<div className="p-4">Update Admin role</div>
						<div>
							<div>
								<div className="flex my-1">
									<div className="my-auto mx-3">
										<input
											disabled={editor}
											type="checkbox"
											className="p-4"
											value="admin"
											checked={role === "admin"}
											onChange={() => {
												setRole("admin")
											}}
										/>
									</div>
									<div className="my-auto">
										<div className="text-lg font-bold">Admin</div>
										{/* <p>Event coverage, Writing and posting of campaigns, Editing of profile and campaigns, Promote campaigns, create an organization, Make update.	</p> */}
									</div>
								</div>
								<div className="flex my-1">
									<div className="my-auto mx-3">
										<input
											disabled={adminTag}
											type="checkbox"
											className="p-4"
											value="editor"
											checked={role === "editor"}
											onChange={() => {
												setRole("editor")
											}}
										/>
									</div>
									<div className="my-auto">
										<div className="text-lg font-bold">Editor</div>
										{/* <p>Edit profile, Edit campaigns and designs</p> */}
									</div>
								</div>
							</div>
						</div>
					</div>
					<Modal.Footer>
						<button className="p-2 bg-transparent w-40" onClick={() => setOpen(!open)}>
							Cancel
						</button>
						<button className="p-2 bg-warning w-40 text-white" onClick={() => updateAdmin()}>
							Update
						</button>
					</Modal.Footer>
				</Modal>
			</>
		</FrontLayout>
	)
}

export default addadmin
