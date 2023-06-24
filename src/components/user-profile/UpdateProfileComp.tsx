import { UserAtom } from "atoms/UserAtom"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { Loader } from "rsuite"
import { IUser } from "types/Applicant.types"
import router from "next/router"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
	const [description, setDescription] = useState("")
	const [info, setInfo] = useState<Partial<IUser>>(user)
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setInfo({
			...info,
			[name]: value,
		})
	}
	useEffect(() => {
		console.log(user);
		if (!info) setInfo(user)
	}, [])

	const handleSubmit = async (e: React.FormEvent & any) => {
		e.preventDefault()
		setLoading(true)
		try {
			const newInterests = [...e.target.interests].map(intr => intr.checked).reduce((acc, cur, curIdx) => {
				if(cur) {
					acc.push(INTERESTS[curIdx]);
				}
				return acc;
			}, []);
			const { data } = await axios.put("/user/update", {...info, interests: newInterests})
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
					<input type="text" className="form-control" name="country" placeholder={user?.country} value={info?.country} onChange={handleChange} />
				</div>

				<div className="col">
					<label className="form-label fw-bold" htmlFor="city">
						City
					</label>
					<input
						type="text"
						name="city"
						className="form-control"
						value={info?.city}
						onChange={handleChange}
						// id="city"
					/>
				</div>
			</div>

			<div className="">
				<button type="reset" className="btn px-5 py-2 rounded-pill bg-light text-warning" onClick={() => setInfo(user)}>
					Cancel
				</button>
				<button disabled={loading} className="btn px-5 py-2 rounded-pill border-3 fw-bold btn-outline-warning">
					{loading ? <Loader content="processing..." /> : "Update"}
				</button>
			</div>
			<ToastContainer />
		</form>
	)
}

export default UpdateProfileComp
