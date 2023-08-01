/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect } from "react"
import { Modal, Popover, Whisper } from "rsuite"
import { useState, useRef } from "react"
import { CREATE_POST, UPDATE_POST } from "apollo/queries/postQuery"
import { Dropdown } from "rsuite"
import axios from "axios"
import { SERVER_URL, states } from "utils/constants"
import { print } from "graphql"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import PropTypes, { InferProps } from "prop-types"
import Select from "react-select"
import { io } from "socket.io-client"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { socket } from "pages/_app"

const FindExpartModalProp = {
	author: PropTypes.shape({ image: PropTypes.string, name: PropTypes.string }).isRequired,
	open: PropTypes.bool.isRequired,
	handelClose: PropTypes.func.isRequired,
	orgs: PropTypes.any,
}

const FindExpartModal = ({ author, open, handelClose, orgs }: InferProps<typeof FindExpartModalProp>): JSX.Element => {
	const [screen, setScreen] = React.useState(1)
	const [country, setCountry] = useState("")
	const [countries, setCountries] = useState([])
	const [cities, setCities] = useState([])
	const [categoryValue, setCategoryValue] = React.useState("")
	const [subCategoryValue, setSubCategoryValue] = React.useState("")
	const [city, setCity] = useState("")
	const user = useRecoilValue(UserAtom)
	const [loading, setLoading] = useState(false)
	const [active, setActive] = useState<any>(author)
	const [message, setMessage] = React.useState(`
Hello!
I'd like to invite you to take a look at my complaint below and submit a proposal if you're available and interested:
Start your Complaint…`)

	useEffect(() => {
		setActive(author)
	}, [author !== null])



	useEffect(() => {
		// Get countries
		axios
			.get(window.location.origin + "/api/getCountries")
			.then((res) => {
				const calculated = res.data.map((country: any) => ({ label: country, value: country }))
				setCountries(calculated)
			})
			.catch((err) => console.log(err))
	}, [])

	useEffect(() => {
		// Get countries
		if (country) {
			axios
				.get(`${window.location.origin}/api/getState?country=${country}`)
				.then((res) => {
					const calculated = res.data.map((state: any) => ({ label: state, value: state }))
					setCities(calculated)
				})
				.catch((err) => console.log(err))
		}
	}, [country])

	// const socket = io(SERVER_URL, {
	// 	query: {
	// 		user_id: user?.id,
	// 	},
	// })
	const category = [
		{ value: "NGO", label: "Non-Governmental Organization (NGO)" },
		// { value: "coaching and mentoring", label: "Coaching and mentoring" },
		// { value: "health", label: "Health" },
		// { value: "leadership development", label: "Leadership development" },
		{ value: "law", label: "Law" },
		// { value: "information technology", label: "Information technology" },
		{ value: "others", label: "Others" },
	]
	const subCategory = [
		{ value: "human right awareness", label: "Human right awareness" },
		{ value: "social policy", label: "Social Policy" },
		{ value: "criminal justice", label: "Criminal Justice" },
		{ value: "human right action", label: "Human Right Action" },
		{ value: "environment", label: "Environment" },
		{ value: "health", label: "Health" },
		{ value: "disability", label: "Disability" },
		{ value: "equality", label: "Equality" },
		{ value: "others", label: "Others" },
	]
	const handleSubmit = () => {
		if (screen === 1 && categoryValue) {
			setScreen(2)
		}
		if (screen === 2 && categoryValue) {
			setLoading(true)
			// console.log(message)
			socket.emit(
				"find_experts",
				{
					category: categoryValue,
					subCategory: subCategoryValue,
					country: country,
					city: city,
					userId: active.id || active._id,
					message: message,
				},
				(response) => {
					toast.success(response)
					handelClose()
					setScreen(1)
					setCategoryValue("")
					setSubCategoryValue("")
					setLoading(false)
				}
			)
		}
	}
	const speaker = (
		<Popover>
			<div onClick={() => setActive(author)} className="flex m-1 cursor-pointer">
				<img src={author?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
				<div className="text-sm my-auto">{author?.name}</div>
			</div>
			{
				orgs?.map((org: any, index: number) => (
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
			}
		</Popover>
	)

	return (
		<>
			<Modal open={open} onClose={handelClose}>
				<Modal.Header>
					<div className="border-b border-gray-200 p-3 w-full">
						<Modal.Title>Find An Expart</Modal.Title>
					</div>
				</Modal.Header>
				<Modal.Body>
					{orgs !== null ? (
						<div className="p-2 w-full rounded-md">
							<Whisper placement="bottom" trigger="click" speaker={speaker}>
								<div className="flex ">
									<div className="flex cursor-pointer">
										<img src={active?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
										<div className="text-sm my-auto">{active?.name}</div>
									</div>
									<div className="my-auto">
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#F7A607" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
											<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
										</svg>
									</div>
								</div>
							</Whisper>
						</div>
					) : null}
					{/* <div className="flex mb-4">
						<img src={author?.image || ""} className="w-10 h-10 rounded-full mr-4" alt="" />
						<div className="text-sm">{author?.name || ""}</div>
					</div> */}
					{screen === 1 ? (
						<div>
							<div className="h-96">
								<Select
									className="mb-4"
									classNamePrefix="select"
									placeholder="Select Category of Service Provider"
									onChange={(val: any) => setCategoryValue(val.value)}
									isClearable={true}
									isSearchable={true}
									name="color"
									options={category}
								/>
								{categoryValue === "NGO" ? (
									<Select
										className="mb-4"
										classNamePrefix="select"
										onChange={(val: any) => setSubCategoryValue(val.value)}
										placeholder="Select Sub-Category of Service Provider"
										isClearable={true}
										isSearchable={true}
										name="color"
										options={subCategory}
									/>
								) : null}
								{/* <Select
									className="mb-4"
									classNamePrefix="select"
									placeholder="Select Location of Service Provider"
									isClearable={true}
									isSearchable={true}
									name="color"
									options={states}
								/> */}
								<Select
									className="mb-4"
									classNamePrefix="select"
									placeholder="Select Country of Service Provider"
									isClearable={true}
									isSearchable={true}
									name="color"
									onChange={(val: any) => setCountry(val.value)}
									options={countries}
								/>
								<Select
									className="mb-4"
									classNamePrefix="select"
									placeholder="Select City"
									isClearable={true}
									isSearchable={true}
									name="color"
									onChange={(val: any) => setCity(val.value)}
									options={cities}
								/>
								<textarea
									name=""
									onChange={(e) => setMessage(e.target.value)}
									value={message}
									className="w-full h-32 border border-white bg-gray-100 text-sm"
									placeholder="Start your complaint..."
								></textarea>
								<p className="font-bold">Example: For the past 3 weeks I have been very down with sickness with symptoms like voting, headache, fever and fatigue. Please I need your expert advice.</p>
							</div>
						</div>
					) : (
						<div>
							<div className="text-bold">{categoryValue}</div>
							<div className="mb-6">{subCategoryValue}</div>
							<div>{message}</div>
						</div>
					)}
				</Modal.Body>

				<Modal.Footer>
					<button onClick={handleSubmit} className="p-1 bg-warning text-white rounded-sm ">
						{screen === 1 ? "Next" : loading ? "Loading..." : "Send Message"}
					</button>
				</Modal.Footer>
			</Modal>
			<ToastContainer />
		</>
	)
}
export default FindExpartModal
