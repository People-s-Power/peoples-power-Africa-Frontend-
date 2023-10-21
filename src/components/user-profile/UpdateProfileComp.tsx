import { UserAtom } from "atoms/UserAtom"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { Loader } from "rsuite"
import { IUser } from "types/Applicant.types"
import router from "next/router"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Select from "react-select"
import { SERVER_URL } from "utils/constants"
import { GET_BANKS, VERIFY_BANK_ACCOUNT } from "apollo/queries/wallet"
import { useMutation, useQuery } from "@apollo/client"
import { apollo } from "apollo"
import { print } from "graphql"

const INTERESTS = [
	"human right awareness",
	"social policy",
	"criminal justice",
	"environment justice",
	"health",
	"politics",
	"discrimination",
	"development",
	"disability",
] as const

const UpdateProfileComp = (): JSX.Element => {
	const user = useRecoilValue(UserAtom)
	const [loading, setLoading] = useState(false)
	const [verifying, setVerifying] = useState(false)
	const [description, setDescription] = useState("")
	const [countries, setCountries] = useState([])
	const [cities, setCities] = useState([])
	const [country, setCountry] = useState("")
	const [city, setCity] = useState("")
	const [info, setInfo] = useState<Partial<IUser>>(user)
	const [banks, setBanks] = useState([])
	const [bank, setBank] = useState(user?.bankName || "")
	const [code, setCode] = useState("")
	const [accountName, setAccountName] = useState(user?.accountName || "")
	const [accountNumber, setAccountNumber] = useState(user?.accountNumber || "")

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setInfo({
			...info,
			[name]: value,
		})
	}

	useEffect(() => {
		// console.log(user);
		if (!info) setInfo(user)
	}, [])

	const verifyBank = async () => {
		setVerifying(true)

		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(VERIFY_BANK_ACCOUNT),
				variables: {
					code,
					account_number: accountNumber
				},
			})
			setAccountName(data.data.verifyBankAccount.account_name)
			console.log(data)
			// setVerifying(false)

		} catch (e) {
			console.log(e.response)
			setVerifying(false)
			// checkAccount()
		}
	}


	function checkAccount() {
		if (accountNumber?.length >= 9) {
			banks.map((item: { name: any; code: React.SetStateAction<string>; }) => {
				if (item.name === bank) {
					setCode(item.code)
					verifyBank()
				} else {
					return
				}
			})
			verifyBank()
		}
	}

	useEffect(() => {
		// Get countries
		axios
			.get(window.location.origin + "/api/getCountries")
			.then((res) => {
				const calculated = res.data.map((country: any) => ({ label: country, value: country }))
				setCountries(calculated)
				setCountry(user?.country)
			})
			.catch((err) => console.log(err))
	}, [])


	useQuery(GET_BANKS, {
		client: apollo,
		onCompleted: (data) => {
			console.log(data)
			setBanks(data.getBanks)
		},
		onError: (err) => {
			console.log(err)
		},
	});

	useEffect(() => {
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

	const isLargeNumber = (element) => element.value === user?.country;

	const getUserState = (element) => element.value === user?.state;


	const handleSubmit = async (e: React.FormEvent & any) => {
		e.preventDefault()
		setLoading(true)
		try {
			const newInterests = [...e.target.interests].map(intr => intr.checked).reduce((acc, cur, curIdx) => {
				if (cur) {
					acc.push(INTERESTS[curIdx]);
				}
				return acc;
			}, []);
			const { data } = await axios.put("/user/update", { ...info, country, state: city, interests: newInterests, bankCode: code, bankName: bank, accountName, accountNumber })
			console.log(data);
			setLoading(false)
			toast.success("Profile Updates Successfully!")
			router.push(`/user?page=${user.id}`)
		} catch (error) {
			console.log(error)
			setLoading(false)
			toast.warn("Oops an error occured!")
		}
	}


	return (
		<form onSubmit={handleSubmit} className="lg:w-[300px] mx-auto">
			<div className=" mb-3 g-md-4 g-2">
				<div className="col">
					<label className="form-label">Fullname</label>
					<input type="text" name="name" className="form-control" value={info?.name} onChange={handleChange} />
				</div>
				{/* <div className="col">
					<label className="form-label">Last Name</label>
					<input
						type="text"
						name="lastName"
						className="form-control"
						value={info?.lastName}
						onChange={handleChange}
					/>
				</div> */}
			</div>
			<div className=" mb-3 g-md-4 g-2 ">
				<div className="col">
					<label className="form-label">Email</label>
					<input type="text" className="form-control" placeholder={user?.email} disabled />
				</div>

				<div className="col">
					<label className="form-label">Phone no</label>
					<input type="text" name="phone" className="form-control" value={info?.phone} onChange={handleChange} />
				</div>
			</div>
			<div className=" mb-3 row-cols-1">
				<div className="col">
					<label className="form-label fw-bold" htmlFor="bio">
						Bio/Description
					</label>
					<textarea name="description" className="form-control" onChange={handleChange} cols={30} rows={3} value={info?.description}></textarea>
				</div>
			</div>

			<div className="mb-3">
				<label className="form-label fw-bold">Interests</label>
				<div>
					{INTERESTS.map((interest) => (
						<div key={interest} className="w-full flex items-center gap-2">
							<input name="interests" className="rounded text-[#f7a815] ring-0 outline-none" type="checkbox" defaultChecked={user?.interests.includes(interest)} />
							{interest}
						</div>
					))}
				</div>
			</div>

			{/* <div className="row g-md-4 mb-3 row-cols-1 g-2 row-cols-md-2">
				<div className="col">
					<label className="form-label fw-bold" htmlFor="language">
						Language
					</label>
					<input
						type="text"
						className="form-control"
						placeholder="English (United Kingdom)"
						id="language"
					/>
				</div>
				<div className="col">
					<label className="form-label fw-bold" htmlFor="handle">
						Twitter handle
					</label>
					<input
						type="text"
						className="form-control"
						placeholder="@ Username"
						id="handle"
					/>
				</div>
			</div> */}
			<div className=" g-md-4 mb-3">
				<div className="col">
					<label className="form-label fw-bold" htmlFor="country">
						Country
					</label>
					{countries.length !== 0 && user !== undefined ? <Select defaultValue={countries[countries?.findIndex(isLargeNumber)]} options={countries} onChange={(e: any) => setCountry(e?.value)} /> : null}
					{/* <input type="text" className="form-control" name="country" placeholder={user?.country} value={info?.country} onChange={handleChange} /> */}
				</div>

				<div className="col">
					<label className="form-label fw-bold" htmlFor="city">
						City
					</label>
					{cities.length !== 0 && user !== undefined ? <Select defaultValue={cities[cities?.findIndex(getUserState)]} options={cities} onChange={(e: any) => setCity(e?.value)} />
						: null}
				</div>
			</div>

			<div className="my-4">
				<label className="form-label fw-bold" htmlFor="">
					Select Bank
				</label>
				<div>
					<select value={bank} onChange={(e) => { setBank(e.target.value) }} className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg">
						{
							banks.map((bank: any, index: React.Key | null | undefined) => (
								<option key={index} value={bank.name}>{bank.name}</option>
							))
						}
					</select>
				</div>
				{/* <Select options={banks} onChange={(e: any) => setCountry(e?.name)} /> */}
			</div>

			<div className="my-4">
				<label className="form-label fw-bold" htmlFor="accountNumber">
					Acount Number
				</label>
				<input type="number" name="accountNumber" className="form-control"
					value={accountNumber}
					onChange={(e) => {
						setAccountNumber(e.target.value)
						checkAccount()
					}
					} />
				<p className="p-1 text-warning text-xs">{verifying ? "verifying..." : ""}</p>
			</div>
			<div className="mb-6">
				<p className="text-lg my-2">{accountName}</p>
			</div>

			<div className="flex">
				<button disabled={loading} className="btn px-5 py-2 rounded-pill border-3 fw-bold btn-outline-warning">
					{loading ? <Loader content="processing..." /> : "Update"}
				</button>
				<button type="reset" className="btn px-5 text-black py-2 rounded-pill bg-light text-warning" onClick={() => setInfo(user)}>
					Cancel
				</button>
			</div>
			<ToastContainer />
		</form>
	)
}

export default UpdateProfileComp
