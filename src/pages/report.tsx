import React, { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import Link from "next/link"
import { UserAtom } from "atoms/UserAtom"
import { useRecoilValue } from "recoil"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export enum ReportEnum {
	Deceptive = "Deceptive and fraudulent",
	Breaches = "Breaches human rights",
	Guilty = "Guilty of hate speech",
	Obscene = "Obscene image",
	Harmful = "Harmful to children",
	Incites = "Incites violence, sucide or harm",
	Encourages = "Encourages racism",
	Impersonation = "Impersonation",
}

export interface reportDTO {
	campaignSlug: string
	reportType: ReportEnum
	reportMessage: string
}

const report = () => {
	const author = useRecoilValue(UserAtom)
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { query } = useRouter()
	const [report, setReport] = useState("")
	const [message, setMessage] = useState("")

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		try {
			setLoading(true)
			const { data } = await axios.post("/reports", {
				itemId: query.page,
				reportType: report,
				body: message,
				author: author.id,
			})
			console.log(data)
			setLoading(false)
			router.push(`/`)
			toast.success("Petition reported successfully!")
		} catch (error) {
			console.log(error)
			setLoading(false)
			toast.warn("Oops an error occoured")
		}
	}
	const getValue = (e: any) => {
		console.log(e.target.value)
		setReport(e.target.value)
	}
	return (
		<div>
			<div>
				<div className="font-bold uppercase text-3xl text-center p-4">Report violation</div>
				<div className="text-lg mx-8">
					Campaigns or comments can be rreported if they are in breach of our userguide, terms and condition and privacy policies.
				</div>
				<div className="mx-10 my-4">
					<form onSubmit={handleSubmit}>
						<div className="flex">
							<input type="checkbox" className="m-1" value="Deceptive and fraudulent" onClick={(e) => getValue(e)} />
							<div className="px-2">Deceptive and fraudulent</div>
						</div>
						<div className="flex">
							<input type="checkbox" className="m-1" value="Breaches human rights" onClick={(e) => getValue(e)} />
							<div className="px-2">Breaches human rights</div>
						</div>
						<div className="flex">
							<input type="checkbox" className="m-1" value="Guilty of hate speech" onClick={(e) => getValue(e)} />
							<div className="px-2">Guilty of hate speech</div>
						</div>
						<div className="flex">
							<input type="checkbox" className="m-1" value="Obscene image" onClick={(e) => getValue(e)} />
							<div className="px-2">Obscene image</div>
						</div>
						<div className="flex">
							<input type="checkbox" className="m-1" value="Harmful to children" onClick={(e) => getValue(e)} />
							<div className="px-2">Harmful to children</div>
						</div>
						<div className="flex">
							<input type="checkbox" className="m-1" value="Incites violence, sucide or harm" onClick={(e) => getValue(e)} />
							<div className="px-2">Incites violence, sucide or harm</div>
						</div>
						<div className="flex">
							<input type="checkbox" className="m-1" value="Encourages racism" onClick={(e) => getValue(e)} />
							<div className="px-2">Encourages racism</div>
						</div>
						<div className="flex">
							<input type="checkbox" className="m-1" value="Impersonation" onClick={(e) => getValue(e)} />
							<div className="px-2">Impersonation</div>
						</div>
						<div>
							<textarea
								name=""
								id=""
								required
								className="w-full h-32 my-3 rounded-md"
								placeholder="Please type the reason for making this report for a review by the admin."
								onChange={(e) => setMessage(e.target.value)}
							></textarea>
							<div className="text-center">
								<button className="bg-red-500 w-80 rounded-md text-white p-2" type="submit">
									{loading ? "Loading" : "Report"}
								</button>
							</div>
						</div>
					</form>
				</div>
				<div className="text-lg mx-8">
					Your report will be reviewed by our admin to access if they are in breach of our userguide, Terms of service and privacy policies.
				</div>
			</div>
			<ToastContainer />
		</div>
	)
}

export default report
