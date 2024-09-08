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
import Link from "next/link"

export interface Operator {
	userId: string
	role: string
}

const Manageadmin = () => {
	const author = useRecoilValue(UserAtom)
	const [admins, setAdmins] = useState<IUser[]>([])
	const { query } = useRouter()
	const [role, setRole] = useState("")
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [userId, setUserId] = useState<any>("")
	const [review, setReview] = useState(false)

	const getAdmins = async (orgId: string) => {
		try {
			const res = await axios(`/organization/${orgId}/operators`)
			console.log(res.data)
			setAdmins(res.data)
		} catch (error) {
			console.log(error)
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
		} finally {
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
			setAdmins((prev) => prev.filter((u) => u.id != sing))
		} catch (error) {
			toast.warn("Oops an error occoured")
		}
	}

	useEffect(() => {
		query.page && getAdmins(query.page as string)
	}, [query])

	const adminTooltip = <Tooltip>This person makes, edits, create and promote, posts, petitons, events, update, organization and profile.</Tooltip>
	const editorTooltip = <Tooltip>This person edits posts, petitons, events, update and products.</Tooltip>

	return (
		<FrontLayout showFooter={false}>
			<>
				<Head>
					<title>{`People Power`} || Manage Admins </title>
				</Head>
				<div className="p-4 max-w-[85rem] mx-auto flex gap-3">
					<div className="sidebar text-base bg-[#f8fbfa] h-fit rounded-md p-3 max-w-sm w-full">
						<Link href={"/org?page=" + query.page}>
							<div className="flex items-center mb-2 gap-2 cursor-pointer">
								<img className="w-8 h-8 opacity-20" src="/images/logo.svg" alt="" />
								<p className="font-semibold">Organisation Admins</p>
							</div>
						</Link>
						<ul className="pl-0 pt-2 flex flex-col gap-2 text-sm">
							<li>
								<Link href={`/manageadmins?page=${query.page}`}>
									<button className="bg-transparent text-warning text-sm">Admins</button>
								</Link>
							</li>
						</ul>
					</div>

					<main className="p-3 grow">
						<section className="top flex justify-between">
							<div>
								<h3>Admins</h3>
								<p>View all admins</p>
							</div>
							<div className="flex gap-2 h-fit">
								<Link href={`/addadmin?page=${query.page}`}>
									<button className="bg-warning text-white rounded px-4 py-1.5 h-auto">Add admins</button>
								</Link>
								<Link href={`/addprofessionals?page=${query.page}`}>
									<button className="bg-warning text-white rounded px-4 py-1.5 h-auto">Add Professionals</button>
								</Link>
							</div>
						</section>

						{admins?.length ? (
							<table className="table-auto my-3 w-full border !border-spacing-1 !border-slate-600">
								<thead>
									<tr className="!bg-gray-100">
										<th className="border px-1 pl-2 py-1 border-slate-600 font-semibold">Name</th>
										<th className="border px-1 pl-2 py-1 border-slate-600 font-semibold">Role</th>
										<th className="border px-1 pl-2 py-1 border-slate-600 font-semibold">Edit Role</th>
										<th className="border px-1 pl-2 py-1 border-slate-600 font-semibold">Reviews & Rating</th>
										<th className="border px-1 pl-2 py-1 border-slate-600 font-semibold">Actions</th>
									</tr>
								</thead>
								<tbody>
									{admins.map((org) => (
										<tr key={org.id}>
											<td className="border px-1 pl-2 py-1 border-slate-600">
												<div className="flex gap-1 items-center">
													<img src={org.image} className="w-12 rounded-full h-12 " alt="" />
													<p>
														{org?.firstName} {org.lastName}
													</p>
												</div>
											</td>
											<td className="border px-1 pl-2 py-1 border-slate-600">
												{org?.role === "admin" ? (
													<Whisper placement="bottom" controlId="control-id-hover" trigger="hover" speaker={adminTooltip}>
														<button>{org?.role} &#x1F6C8;</button>
													</Whisper>
												) : (
													<Whisper placement="bottom" controlId="control-id-hover" trigger="hover" speaker={editorTooltip}>
														<button>{org?.role} &#x1F6C8;</button>
													</Whisper>
												)}
											</td>
											<td className="border px-1 pl-2 py-1 border-slate-600">
												<button
													onClick={() => {
														setOpen(!open), setRole(org.role), setUserId(org?.id)
													}}
													className="bg-transparent w-44 p-2"
												>
													<span>&#x270E;</span> Edit
												</button>
											</td>
											<td className="border px-1 pl-2 py-1 border-slate-600 cursor-pointer" onClick={() => setReview(true)}>
												Reviews & Rating
											</td>
											<td
												className="border px-1 pl-2 py-1 border-slate-600 cursor-pointer"
												onClick={() => {
													removeAdmin(org.id)
												}}
											>
												&#10006;
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<>
								<div className="text-center my-3">No Admins yet</div>
							</>
						)}
					</main>
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

export default Manageadmin
