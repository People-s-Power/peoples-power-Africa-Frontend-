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
import ReactSelect from "react-select"

export interface Operator {
	userId: string
	role: string
}

const PROFESSIONS = [
	"General Administrative Assistant",
	"Social Media Manager ",
	"Real Estate",
	"Virtual Research",
	"Virtual Data Entry",
	"Virtual Book keeper",
	"Virtual ecommerce",
	"Customer Service Provider (Phone/Chat",
	"Content Writer",
	"Website Management",
	"Public Relation Assistant",
	"Graphic designs",
	"Appointment/Calendar setter",
	"Email Management",
	"Campaign/petition Writer",
]

const Addadmin = () => {
	const author = useRecoilValue(UserAtom)
	const [professionals, setProfessionalas] = useState<IUser[]>([])
	const [profession, setProfession] = useState("")
	const { query } = useRouter()
	const [role, setRole] = useState("")
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [result, setResult] = useState<{ message: string } | undefined>()
	const [userId, setUserId] = useState<any>("")
	const [search, setSearched] = useState("")

	useEffect(() => {
		const GET_PROFESSIONALS_URL = "https://project-experthub.onrender.com/v1/user"
		// const GET_PROFESSIONALS_URL = "http://localhost:5000/v1/user";
		axios.get(GET_PROFESSIONALS_URL).then((response) => {
			Array.isArray(response.data?.data.users) &&
				setProfessionalas(
					response.data.data.users.map((d) => {
						if (d.name) return d
						return { ...d, name: d.firstName + " " + d.lastName }
					})
				)
		})
	}, [])

	useEffect(() => {
		if (query.trxref) {
			// Process transaction
			axios
				.get(SERVER_URL + `/api/v5/organization/transaction-verify/${query.trxref}`)
				.then((res) => {
					console.log(res)
					if (res.data.message) {
						// toast.info(res.data.message);
						// setTimeout(() => {
						// 	window.location.href = `/manageadmins?page=${query.page}`
						// })
						// Show modal with message and actions (Assign tasks or Manage admins)
						setOpen(true)
						setResult(res.data)
					}
				})
				.catch((err) => console.log(err))
		}
	}, [query])

	const addProfessional = async () => {
		if (loading) return
		if (!userId) {
			toast.info("Please select a user!")
			return
		}
		try {
			setLoading(true)
			const res = await axios.post(SERVER_URL + "/api/v5/organization/add-professional", {
				professionalID: userId,
				orgId: query.page,
			})
			if (res.status.toString().startsWith("2")) {
				window.location.href = res.data.authorization_url
			}
			// toast.success("Profession added successfully!")
			// location.reload()
		} catch (error) {
			toast.warn("Oops an error occoured")
		} finally {
			setLoading(false)
		}
	}

	return (
		<FrontLayout showFooter={false}>
			<>
				<Head>
					<title>{`People Power`} || Add A Professional </title>
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
							<div className="max-w-lg">
								<h3>Hire a trained professionals</h3>
								{/* <p>Leave the complexity of writing, designing and editing your campaigns and other administration to us.</p> */}

								<p>
									Our team of content writers, designers, journalists and social skill workers can handle your content, designs, updates and other
									administrations while you focus on building a strong and physical campaigns with momentum.
								</p>
								<p>For a monthly fee of #35,000</p>
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

						<section className="select-role mt-4 space-y-2">
							<p className="font-semibold">Filter by profession</p>
							<ReactSelect
								className="max-w-sm"
								placeholder="Select a specific role"
								onChange={(e) => setProfession(e.value)}
								options={PROFESSIONS.map((prof) => ({ value: prof, label: prof }))}
							/>
						</section>

						{profession && (
							<section className="select-role mt-4 space-y-2">
								<p className="font-semibold">Select user to add</p>

								<input
									type="text"
									className="max-w-sm w-full border border-slate-600 p-1.5 rounded"
									onChange={(e) => {
										setSearched(e.target.value)
									}}
									placeholder="Type here to search for a user to assign role"
								/>

								{professionals.length ? (
									<div className="grid grid-cols-3 max-h-[400px] h-auto overflow-auto w-full">
										<td className="px-2 py-2 border border-slate-600">User</td>
										<td className="px-2 py-2 border border-slate-600">Role</td>
										<td className="px-2 py-2 border border-slate-600">Review</td>
										{search
											? professionals
													.filter((user) => {
														return (
															user.firstName?.toLowerCase()?.includes(search.toLowerCase()) ||
															user.lastName?.toLowerCase()?.includes(search.toLowerCase()) ||
															(user.name?.toLowerCase()?.includes(search.toLowerCase()) && user.profession == profession)
														)
													})
													.map((user) => (
														<>
															<td onClick={() => setUserId(user._id)} className="px-2 py-2 flex gap-2 items-center border border-slate-600 cursor-pointer">
																<svg
																	fill={userId == user._id ? "#18C73E" : "#e6e6e6"}
																	viewBox="0 0 16 16"
																	className="w-7"
																	xmlns="http://www.w3.org/2000/svg"
																	aria-hidden="true"
																>
																	<path
																		clipRule="evenodd"
																		fillRule="evenodd"
																		d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z"
																	/>
																</svg>
																{user.firstName + " " + user.lastName}
															</td>
															<td onClick={() => setUserId(user._id)} className="px-2 py-2 border border-slate-600 cursor-pointer">
																{user.role}
															</td>
															<td onClick={() => setUserId(user._id)} className="px-2 py-2 border border-slate-600 cursor-pointer">
																{user.description}
															</td>
														</>
													))
											: professionals
													.filter((user) => user.profession == profession)
													.map((user) => (
														<>
															<td onClick={() => setUserId(user._id)} className="px-2 py-2 flex gap-2 items-center border border-slate-600 cursor-pointer">
																<svg
																	fill={userId == user._id ? "#18C73E" : "#e6e6e6"}
																	viewBox="0 0 16 16"
																	className="w-7"
																	xmlns="http://www.w3.org/2000/svg"
																	aria-hidden="true"
																>
																	<path
																		clipRule="evenodd"
																		fillRule="evenodd"
																		d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z"
																	/>
																</svg>
																{user.firstName + " " + user.lastName}
															</td>
															<td onClick={() => setUserId(user._id)} className="px-2 py-2 border border-slate-600 cursor-pointer">
																{user.profession}
															</td>
															<td onClick={() => setUserId(user._id)} className="px-2 py-2 border border-slate-600 cursor-pointer">
																{user.description}
															</td>
														</>
													))}
									</div>
								) : (
									<p>No professionals available now</p>
								)}
							</section>
						)}

						<section className="submit mt-4 space-y-2">
							<button onClick={addProfessional} type="button" className="px-4 py-2 rounded bg-warning text-white">
								Hire
							</button>
						</section>
					</main>
				</div>
				<ToastContainer />
				<Modal open={open} onClose={() => setOpen(!open)}>
					<div className="px-4">
						<h3 className="pb-2 font-semibold">Add Professional Successful</h3>
						<p className="text-zinc-500">{result?.message}. Where next?</p>
						<div className="grid gap-2 mt-2">
							<Link href={`/mycamp?page=${query.page}`}>
								<button className="bg-warning text-white rounded px-3 py-1 text-sm">Assign task to user</button>
							</Link>
							<Link href={`/manageadmins?page=${query.page}`}>
								<button className="bg-warning text-white rounded px-3 py-1 text-sm">View admin list</button>
							</Link>
						</div>
					</div>
				</Modal>
			</>
		</FrontLayout>
	)
}

export default Addadmin
