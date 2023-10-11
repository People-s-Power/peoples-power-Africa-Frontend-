import { gql, useQuery } from "@apollo/client"
import { UserAtom } from "atoms/UserAtom"
import PromoteModalComp from "components/PromoteModalComp"
import ChoosePromotion from "components/ChoosePromotion"
import Cookies from "js-cookie"
import FrontLayout from "layout/FrontLayout"
import router, { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import { PaystackButton, usePaystackPayment } from "react-paystack"
import { PaystackProps } from "react-paystack/dist/types"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { ICampaign } from "types/Applicant.types"
import { PaymentPurposeEnum } from "types/payment.interface"
import { IEnvironments } from "utils/constants"
import { checkFX, formateMoney } from "utils/formateMoney"
import Link from "next/link"
import axios from "axios"
import { apollo } from "apollo"
import ReactTimeAgo from "react-time-ago"
import { SINGLE_PETITION } from "apollo/queries/petitionQuery"
import { Modal } from "rsuite"
import Select from "react-select"
import ImageCarousel from "components/ImageCarousel"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


export const GET_CAMPAIGN = gql`
	query ($slug: String) {
		getCampaign(slug: $slug) {
			title
			id
			image
			slug
			target
		}
	}
`

export enum AudienceEnum {
	EVERYONE = 'EVERYONE',
	INTEREST = 'INTEREST',
	LOCATION = 'LOCATION'
}

export enum CurrencyListEnum {
	NGN = "NGN",
	GHS = "GHS",
	ZAR = "ZAR",
	USD = "USD",
}
export interface ITransactions {
	purpose: string
	length: number
}

const PromoteComp = (): JSX.Element => {
	const user = useRecoilValue(UserAtom)
	const [campaign, setCampaign] = useState<ICampaign>()
	const { query } = useRouter()
	const [showModal, setShowModal] = useState(false)
	const [showModalClose, setShowModalClose] = useState(false)
	const [transactions, setTransactions] = useState<ITransactions[]>([])

	const { error, data } = useQuery(SINGLE_PETITION, {
		client: apollo,
		variables: { slug: query.slug },
		onCompleted: (data) => {
			setCampaign(data.getCampaign)
		},
		onError: (err) => console.log(err),
	})

	let view = useMemo(() => {
		const initialView = Boolean(query?.view)
		return initialView
	}, [query])

	const endorse = useMemo(() => {
		const initialEndorse = Boolean(query?.endorse)
		// console.log(initialEndorse)
		return initialEndorse
	}, [query])

	const message = useMemo(() => {
		const initialMessage = Boolean(query?.message)
		// console.log(initialEndorse)
		return initialMessage
	}, [query])

	useEffect(() => {
		query.slug === undefined ? (view = true) : null
		if (!error && query.slug !== undefined) {
			setCampaign(data?.getPetition)
			console.log(data)
		}
		axios
			.get("/transaction")
			.then(function (response) {
				// console.log(response.data);
				setTransactions(response.data)
			})
			.catch(function (error) {
				console.log(error)
			})
	}, [data, error])



	return (
		<div>
			{/* <PromoteForm campaign={query.slug} /> */}
			{view || endorse || message ? (
				<PromoteForm campaign={campaign} view={view} endorse={endorse} message={message} />
			) : (
				<FrontLayout showFooter={false}>

					<Wrapper className="container">
						<PromoteModalComp show={showModalClose} onHide={() => setShowModalClose(false)} />
						<ChoosePromotion show={showModal} onHide={() => setShowModal(false)} />
						<div className="inner-wrapper">
							<div>
								<div className="card">
									<div className="card-Image">
										<ImageCarousel image={campaign?.asset} />
										{/* <img src={campaign?.asset[0].url} className="w-full h-1/2 object-cover" alt="" /> */}
									</div>
									<div className="card-body">
										<h4 className="fw-bold">{campaign?.title}</h4>
										<p>
											<b className="text-primary">Campaign Target</b>: {campaign?.target}
										</p>
									</div>
								</div>
								<div className="promotion mt-5">
									<p>Hello {user?.firstName}, let our Community of Supporters know about this campaign for support and more endorsements by promoting it.</p>

									<ul className="nav flex-column">
										<li className="nav-item mb-2 ms-3">
											Promoting this campaign will help push it to interested supporters who will endorse it and enable you reach your campaign goal.
										</li>
										<li className="nav-item mb-2 ms-3">
											Our community of supporters can also help you promote this campaign and spare in some cash if this campaign is promoted to them.
										</li>
									</ul>
									<div>
										{transactions && transactions?.length > 1
											? transactions.slice(0, 6).map((item: any, i) => (
												<div key={i} className="mx-auto bg-gray-50 text-center my-2 p-2">
													{item?.message + " "}
													<ReactTimeAgo date={item?.paid_at} locale="en-US" />
												</div>
											))
											: null}
									</div>
									<div className="my-5 text-center promote-btn ">
										<button onClick={() => setShowModal(true)} className="btn btn-warning ">
											Promote Now
										</button>
										<div className="text-center">
											<a className="btn" onClick={() => setShowModalClose(true)}>
												I Will Promote later
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Wrapper>
				</FrontLayout>
			)}
		</div>
	)
}

export default PromoteComp

const Wrapper = styled.div`
	h1 {
		font-size: 2.25rem;
		font-weight: bold;
	}
	.nav {
		list-style: circle;
	}
	.promote-btn {
		a {
			text-decoration: none;
		}
	}
	.bulk {
		&-option {
			cursor: pointer;
			margin-bottom: 1rem;
		}
	}
	.inner-wrapper {
		width: 100%;
		max-width: 600px;
		margin: auto;
		.card {
			box-shadow: 0px 10px 19px rgba(0, 0, 0, 0.06);
			border-radius: 15px;
			border-width: 0;
			Image {
				width: 100%;
				height: 226px;
				object-fit: cover;
			}
		}
		select {
			/* appearance: unset; */
			background-color: rgba(245, 246, 250, 1);
			border: none;
			outline: none;
			&:focus {
				border: none;
				outline: none;
			}
		}
		input {
			all: unset;
			border-bottom: 2px solid rgba(0, 64, 28, 1);

			margin: 0 1rem;
		}
	}
`

const PromoteForm = ({ campaign, view, endorse, message }: { campaign: any; view: boolean; endorse: boolean; message: boolean }) => {
	const user = useRecoilValue(UserAtom)
	const [views, setViews] = useState<any>(10)
	const [amount, setAmount] = useState<any>(20)
	const [loadingPrice, setLoadingPrice] = useState(false)
	const [currency, setCurrency] = useState<CurrencyListEnum>(CurrencyListEnum.NGN)
	const { query } = useRouter()
	const [audience, setAudience] = useState("")
	const [open, setOpen] = useState(true)
	const [location, setLocation] = useState("")
	const [country, setCountry] = useState("")
	const [countries, setCountries] = useState([])
	const [cities, setCities] = useState([])
	const [city, setCity] = useState("")
	const [myInterest, setMyInterest] = useState<string[]>([])
	const router = useRouter()

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


	// const paystack_config: PaystackProps = {
	// 	reference: new Date().getTime().toString(),
	// 	email: user?.email,
	// 	amount: amount.toFixed(2) * 100,
	// 	firstname: user?.firstName,
	// 	lastname: user?.lastName,
	// 	currency,
	// 	publicKey: "pk_live_13530a9fee6c7840c5f511e09879cbb22329dc28",
	// 	metadata: {
	// 		purpose: location === "inbox" ? PaymentPurposeEnum.MESSAGE : null,
	// 		key: query.slug,
	// 		numberOfViews: views,
	// 		name: user?.name,
	// 		audience: audience === "Everyone" ? AudienceEnum.EVERYONE : audience === "Interest" ? AudienceEnum.INTEREST : audience === "Location" ? AudienceEnum.LOCATION : null,
	// 		custom_fields: [
	// 			{
	// 				display_name: view === true ? PaymentPurposeEnum.VIEWS : endorse === true ? PaymentPurposeEnum.ENDORSE : PaymentPurposeEnum.MESSAGE,
	// 				value: campaign,
	// 				variable_name: "title",
	// 			},
	// 		],
	// 	},
	// }

	// const initializePayment = usePaystackPayment(paystack_config)
	// const onSuccess = async () => {
	// 	console.log(paystack_config)
	// 	router.push(`/mycamp`)
	// }
	// const onClose = () => {
	// 	console.log("")
	// }

	const promote = async () => {
		try {
			const { data } = await axios.post('/transaction/promote', {
				userId: user.id,
				amount,
				_id: query.slug,
				audience: audience === "Everyone" ? AudienceEnum.EVERYONE : audience === "Interest" ? AudienceEnum.INTEREST : audience === "Location" ? AudienceEnum.LOCATION : null,
				purpose: view === true ? PaymentPurposeEnum.VIEWS : endorse === true ? PaymentPurposeEnum.ENDORSE : PaymentPurposeEnum.MESSAGE,
				numberOfViews: views,
				userType: "user"
			})
			console.log(data)
			toast.success("Promotion Successfull!")
			router.push(`/mycamp`)
		} catch (e) {
			toast.warn(e.response.data.message)
			// console.log(e.response.data.message)
		}
	}

	useEffect(() => {
		// const convert = async () => {
		// 	try {
		// 		setLoadingPrice(true)
		// 		const unit = await checkFX(currency)
		// 		console.log(unit)
		// 		const result = unit * 20

		// 		setAmount(parseInt(views) * result)
		// 	} catch (error) {
		// 		console.log(error)
		// 	} finally {
		// 		setLoadingPrice(false)
		// 	}
		// }
		// convert()

		setAmount(parseInt(views) * 20)
	}, [currency, views])

	const continuePayment = () => {
		if (audience === "") return
		setOpen(false)
	}
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

	return (
		<FrontLayout showFooter={false} >
			<Wrapper className="container">
				<div className="md:w-[506px] m-auto">
					<div className="cursor-pointer text-sm text-blue-700" onClick={() => window.history.back()}>
						Go back
					</div>
					<p className="my-4 text-center fw-bold">How do you want to promote your campaign?</p>

					<form>
						<div className="form-group text-center">
							<label className="">
								<i className="fas fa-eye"></i> Views
							</label>
							<input type="number" value={views} onChange={(e) => setViews(e.target.value)} style={{ width: "4rem", appearance: "none" }} />
							<i className="fas fa-exchange-alt"></i>
							<input type="text" value={loadingPrice ? "calculating..." : formateMoney(amount, currency)} disabled />
							<select className="" onChange={(e) => setCurrency(e.target.value as CurrencyListEnum)}>
								<option>{CurrencyListEnum.NGN}</option>
								<option>{CurrencyListEnum.GHS}</option>
								<option>{CurrencyListEnum.ZAR}</option>
								<option>{CurrencyListEnum.USD}</option>
							</select>
						</div>
					</form>
					<div className="text-center">
						<button className="btn btn-warning my-4" onClick={() => promote()}>
							Click to pay
						</button>
					</div>
				</div>
				<Modal open={open}>
					<Modal.Header>
						<div className="border-b border-gray-200 p-3 w-full">
							<Modal.Title>Promote</Modal.Title>
						</div>
					</Modal.Header>
					<Modal.Body>
						<div className="w-full mx-auto my-10 text-sm">
							<div className="my-4">
								<p className="text-base text-center my-2">Your campaign is being promoted to your timeline. Tick below if you also want this to be promoted to user inbox:</p>
								<div className="flex justify-evenly">
									{/* <div className="border py-2 rounded-md text-sm px-8 cursor-pointer">Promote to Timeline</div> */}
									<div onClick={() => setLocation("inbox")} className={location === "inbox" ? "border border-warning py-2 text-warning rounded-md text-sm px-8 cursor-pointer" : "border py-2 rounded-md text-sm px-8 cursor-pointer"}> <input type="radio" className="mx-2" /> Promote to Inbox</div>
								</div>
							</div>
							<div className="my-4">
								<div className="text-base my-1">Select your Target audience</div>
								<select onChange={(e) => setAudience(e.target.value)} name="" id="" className="w-full border border-gray-700 text-sm">
									<option value="">Select your target audience</option>
									<option value="Everyone">Everyone</option>
									{/* <option value="Followers">Followers</option> */}
									<option value="Interest">Interest</option>
									<option value="Location">Location</option>
								</select>
							</div>
							{audience === "Interest" ? (
								interest.map((single, index) =>
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
								)
							) : null}
							{audience === "Location" ? (
								<div className="lg:flex justify-between">
									<div className="w-[45%] my-1">
										<div className="text-sm">Country</div>
										<div>
											{/* <input onChange={(e) => setCountry(e.target.value)} type="text" className="rounded-sm" placeholder="Nigeria" /> */}
											<Select options={countries} onChange={(e: any) => setCountry(e?.value)} />
										</div>
									</div>
									<div className="w-[45%] my-1">
										<div className="text-sm">City</div>
										<div>
											{/* <input onChange={(e) => setCity(e.target.value)} type="text" className="rounded-sm" placeholder="Lagis" /> */}
											<Select options={cities} onChange={(e: any) => setCity(e?.value)} />
										</div>
									</div>
								</div>
							) : null}
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button className="p-2 rounded-md bg-gray-200 mr-10" onClick={() => router.back()}>Back</button>
						<button className="p-2 bg-warning text-white rounded-md" onClick={() => continuePayment()}>Continue</button>
					</Modal.Footer>
				</Modal>
				<ToastContainer />
			</Wrapper>
		</FrontLayout>
	)
}
