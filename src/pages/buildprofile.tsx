import React, { useState, useRef, useEffect } from "react"
import FrontLayout from "layout/FrontLayout"
import { Steps, Button } from "rsuite"
import ConnectionCard from "../components/ConnectionCard"
import axios from "axios"
import { IUser } from "types/Applicant.types"
import { useRouter } from "next/router"
import { UserAtom } from "atoms/UserAtom"
import { useRecoilValue } from "recoil"
import { CONNECTIONS } from "apollo/queries/generalQuery"
import Select from "react-select"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import { FOLLOW } from "apollo/queries/generalQuery"
import { apollo } from "apollo"
import { useQuery } from "@apollo/client"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import FollowCard from "components/FollowCard"

function Buildprofile(): React.ReactElement {
	const [countries, setCountries] = useState([])
	const [cities, setCities] = useState([])
	const [step, setStep] = React.useState(0)
	const onChange = (nextStep: any) => {
		setStep(nextStep < 0 ? 0 : nextStep > 4 ? 4 : nextStep)
	}
	const router = useRouter()
	const [users, setUsers] = useState<IUser[]>([])
	const uploadRef = useRef<HTMLInputElement>(null)
	const [country, setCountry] = useState("")
	const [city, setCity] = useState("")
	const [description, setDescription] = useState("")
	const [myInterest, setMyInterest] = useState<string[]>([])
	const user = useRecoilValue(UserAtom)


	const getUsers = async () => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(CONNECTIONS),
				variables: {
					authorId: user?.id,
				},
			})
			console.log(data)
			setUsers(data.data.connections)
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
		// Get countries
		getUsers()
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
		getUsers()
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

	const [img, setImg] = useState("")
	const interest = [
		"human right awareness",
		"social policy",
		"criminal justice",
		"environment justice",
		"health",
		"politics",
		"discrimination",
		"development",
		"disability",
	]

	const onNext = () => onChange(step + 1)
	const onPrevious = () => onChange(step - 1)

	const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
		// const { files } = e.target;
		// setImg(URL.createObjectURL(files?.[0] as any));
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

	const follow = async (id) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(FOLLOW),
				variables: {
					followerId: user.id,
					followId: id,
				},
			})
			console.log(data)
			toast.success("Followed successfully")
			getUsers()
		} catch (error) {
			console.log(error)
		}
	}

	const uploadFileToServer = async () => {
		if (!img) {
			uploadRef.current?.click()
		} else {
			try {
				const { data } = await axios.post("/user/upload", { image: img })
				toast("Image uploaded successfully")
				setImg("")
				onNext()
			} catch (error) {
				console.log(error)
			}
		}
	}
	const handleSubmit = async () => {
		try {
			const { data } = await axios.put("/user/update", {
				name: user.name,
				phone: user.phone,
				country,
				city,
				description,
				interests: myInterest,
			})
			console.log(data)
			toast.success("Profile Updates Successfully!")
			router.push(`/`)
		} catch (error) {
			console.log(error)
			toast.warn("Oops an error occured!")
		}
	}



	const locationNext = () => {
		city && country !== "" ? onNext() : null
	}
	const descriptionNext = () => {
		description !== "" ? onNext() : null
	}
	return (
		<div>
			<FrontLayout showFooter={false} showHeader={false}>
				<main className="lg:w-2/3 mx-auto sm:px-6">
					<Steps current={step}>
						<Steps.Item title="" />
						<Steps.Item title="" />
						<Steps.Item title="" />
						<Steps.Item title="" />
						<Steps.Item title="" />
					</Steps>
					{(() => {
						switch (step) {
							case 0:
								return (
									<div>
										<div className="text-xl text-center py-14">Add your photo to build your profile</div>
										<div>
											<input type="file" ref={uploadRef} className="d-none" onChange={handleImg} />
											<img
												onClick={() => uploadRef.current?.click()}
												className="rounded-full hover:opacity-50 w-44 h-44 mx-auto"
												src={img || "/images/person.png"}
												alt=""
											/>
										</div>
										<div className="text-center mx-auto my-8">
											<button className="p-2 bg-warning text-white rounded-sm" onClick={uploadFileToServer}>
												Upload Photo
											</button>
											<div className="my-1">
												<Button onClick={onNext}>Skip</Button>
											</div>
										</div>
									</div>
								)
							case 1:
								return (
									<div>
										<div className="text-xl text-center py-14">Add your location to get personalised content</div>
										<div className="lg:flex justify-evenly">
											<div>
												<div>Country</div>
												<div>
													{/* <input onChange={(e) => setCountry(e.target.value)} type="text" className="rounded-sm" placeholder="Nigeria" /> */}
													<Select options={countries} onChange={(e: any) => setCountry(e?.value)} />
												</div>
											</div>
											<div>
												<div>City</div>
												<div>
													{/* <input onChange={(e) => setCity(e.target.value)} type="text" className="rounded-sm" placeholder="Lagis" /> */}
													<Select options={cities} onChange={(e: any) => setCity(e?.value)} />
												</div>
											</div>
										</div>
										<div className="text-center mx-auto my-8">
											<Button onClick={onPrevious}>Previous</Button>
											<button className="p-2 bg-warning text-white rounded-sm" onClick={locationNext}>
												Next
											</button>
										</div>
									</div>
								)
							case 2:
								return (
									<div>
										<div className="text-xl text-center py-14">Explain briefly about yourself</div>
										<div className="w-full">
											<div className="w-full">
												<div>Bio/Description</div>
												<div>
													<textarea onChange={(e) => setDescription(e.target.value)} className="w-full h-44"></textarea>
												</div>
											</div>
										</div>
										<div className="text-center mx-auto my-8">
											<Button onClick={onPrevious}>Previous</Button>
											<button className="p-2 bg-warning text-white rounded-sm" onClick={descriptionNext}>
												Next
											</button>
											<div className="my-1">
												<Button onClick={onNext}>Skip</Button>
											</div>
										</div>
									</div>
								)
							case 3:
								return (
									<div>
										<div className="text-xl text-center py-14">Select an area of interest to help us recommend contents that will interest you</div>
										<div className="w-80 mx-auto">
											{interest.map((single, index) => (
												<div key={index} className="flex my-3">
													{/* <input onChange={(e) => setMyInterest([...myInterest, e.target.value])} type="checkbox" value={single} className="p-2 rounded-full" /> */}
													<input
														onChange={(e) => {
															if (e.target.checked) {
																setMyInterest([...myInterest, e.target.value])
															} else {
																const newInterests = [...myInterest]
																const idx = newInterests.findIndex((x) => x === e.target.value)
																newInterests.splice(idx, 1)
																setMyInterest(newInterests)
															}
														}}
														type="checkbox"
														value={single}
														name="interests_spec"
														className="interests p-2 rounded-full"
													/>
													<div className="my-auto mx-4 capitalize">{single}</div>
												</div>
											))}
										</div>
										<div className="text-center mx-auto my-8">
											<Button onClick={onPrevious}>Previous</Button>
											<button className="p-2 bg-warning text-white rounded-sm" onClick={onNext}>
												Next
											</button>
										</div>
									</div>
								)
							case 4:
								// submit data and get people to follow
								console.log(myInterest)
								console.log(img, country, city, description)
								return (
									<div>
										<div className="text-xl text-center py-14">
											<div className="font-bold text-xl">Grow your feeds by following people and Organizations you may know</div>
											(People and organizations with similar insterests or location with you)
										</div>
										<div className="flex flex-wrap justify-between">
											{users.slice(0, 12).map((user, index) =>
												user._id !== user.id ? (
													<FollowCard key={index} user={user} />
													// <div key={index} className="lg:w-[25%] sm:w-1/2 lg:p-6 p-2">
													// 	<img src={user.image} className="w-20 h-20 rounded-full" alt="" />
													// 	<div className="text-xl py-2">{user.name} </div>
													// 	<div className="w-16 h-[1px] bg-gray-200"></div>
													// 	<div className="text-xs text-gray-700 my-3">{user.followers.length} Followers</div>
													// 	<div className="text-xs text-gray-900 my-6 cursor-pointer" onClick={() => follow(user._id)}>
													// 		+ Follow
													// 	</div>
													// </div>
												) : null
											)}
										</div>
										<div className="text-center mx-auto my-8">
											<Button onClick={onPrevious}>Previous</Button>
											<button className="p-2 bg-warning text-white rounded-sm" onClick={handleSubmit}>
												Finish
											</button>
										</div>
									</div>
								)
							default:
								return null
						}
					})()}
				</main>
			</FrontLayout>
			<ToastContainer />
		</div>
	)
}

export default Buildprofile
