import { Modal, Popover, Whisper } from "rsuite"
import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AdvertsComp from "components/AdvertsCard"
import EventsCard from "components/EventsCard"
import PetitionComp from "components/PetitionCard"
import VictoryCard from "components/VictoryCard"
import CampComp from "components/CampComp"
import Updates from "components/updates"

const ShareModal = ({ open, handelClick, orgs, single }: { open: boolean; handelClick(): void; orgs: any; single: any }) => {
	const author = useRecoilValue(UserAtom)
	const [active, setActive] = useState<any>(author)
	const [loading, setLoading] = useState(false)
	const [body, setBody] = useState("")

	// useEffect(() => {
	// 	console.log(single)
	// })

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const { data } = await axios.post("share", {
				body: body,
				author: active._id || active.id,
				itemId: single._id,
			})

			console.log(data)
			handelClick()
			setBody("")
			setLoading(false)
			toast.success("Shared Successfully")
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	const speaker = (
		<Popover>
			<div onClick={() => setActive(author)} className="flex m-1">
				<img src={author?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
				<div className="text-sm my-auto">{author?.name}</div>
			</div>
			{orgs?.map((org: any, index: number) => (
				<div onClick={() => setActive(org)} key={index} className="flex m-1">
					<img src={org?.image} className="w-8 h-8 rounded-full mr-4" alt="" />
					<div className="text-sm my-auto">{org?.name}</div>
				</div>
			))}
		</Popover>
	)

	return (
		<div>
			<Modal open={open} onClose={handelClick}>
				<Modal.Header>
					<div className="border-b border-gray-200 p-3 w-full flex justify-between">
						<Modal.Title>Share your thought</Modal.Title>
						<button onClick={handleSubmit} className="p-1 bg-warning text-white rounded-sm w-20">
							{loading ? "Loading..." : "Share"}
						</button>
					</div>
				</Modal.Header>
				<Modal.Body>
					<Whisper placement="bottom" trigger="click" speaker={speaker}>
						<div className="flex">
							<img src={active?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
							<div className="text-sm my-auto">{active?.name}</div>
						</div>
					</Whisper>

					<textarea
						value={body}
						onChange={(e) => setBody(e.target.value)}
						name=""
						className="w-full h-8 border border-white text-sm"
						placeholder={"Write your thought about this " + single.__typename + "..."}
					></textarea>
				</Modal.Body>
				<div>
					{(() => {
						switch (single.__typename) {
							case "Advert":
								return (
									<div>
										<AdvertsComp advert={single} />
									</div>
								)
							case "Event":
								return (
									<div>
										<EventsCard event={single} />
									</div>
								)
							case "Petition":
								return (
									<div>
										<PetitionComp petition={single} />
									</div>
								)
							case "Victory":
								return (
									<div>
										<VictoryCard post={single} />
									</div>
								)
							case "Post":
								return (
									<div>
										<CampComp post={single} />
									</div>
								)
							case "Update":
								return (
									<div>
										<Updates updates={single} />
									</div>
								)
						}
					})()}
				</div>
			</Modal>
			<ToastContainer />
		</div>
	)
}

export default ShareModal
