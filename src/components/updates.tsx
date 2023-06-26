import React, { useState } from "react"
import { Dropdown } from "rsuite"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { COMMENT, LIKE } from "apollo/queries/generalQuery"
import axios from "axios"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import { useRouter } from "next/router"
import Interaction from "./Interaction"
import ReactTimeAgo from "react-time-ago"
import HideComp from "./HideComp"
import UnHideComp from "./UnHideComp"
import ImageCarousel from "./ImageCarousel"

const Updates = ({ updates }: { updates: any }): JSX.Element => {
	const author = useRecoilValue(UserAtom)
	const router = useRouter()
	const [content, setContent] = useState("")
	const [show, setShow] = useState(false)
	const [more, setMore] = useState(updates.body?.length > 250 ? true : false)

	const toggle = val => {
		setShow(val)
	}

	const share = async () => {
		try {
			const { data } = await axios.post("share", {
				body: "share",
				author: author.id,
				itemId: updates._id,
			})
			console.log(data)
			toast.success("Post has been shared")
		} catch (err) {
			console.log(err)
		}
	}

	const comment = async (id) => {
		if (content.length === 0) return
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(COMMENT),
				variables: {
					authorId: author.id,
					itemId: id,
					content: content,
				},
			})
			toast.success("Comment sent")
			console.log(data)
		} catch (error) {
			console.log(error)
			toast.warn("Oops! Something went wrong")
		}
	}

	function liked(id, array) {
		return array.some((obj) => obj._id === id)
	}
	const like = async () => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(LIKE),
				variables: {
					authorId: author.id,
					itemId: updates._id,
				},
			})
			toast.success("Post liked successfully")
			console.log(data)
		} catch (error) {
			console.log(error)
			toast.warn("Oops! Something went wrong")
		}
	}
	return (
		<div>
			{show === false && <div className="p-3 border mb-3">
				<div>
					{/* <div className="flex justify-between border-b border-gray-200 pb-3"> */}
					<div className="flex border-b border-gray-200 w-full pb-3">
						<Link href={`user?page=${updates.author._id}`}>
							<div className="flex cursor-pointer">
								<img className="w-12 h-12 rounded-full" src={updates.author.image} alt="" />
								<div className="ml-2 w-full">
									<div className="text-base capitalize">
										{updates.author.name} <span className="text-xs">{author?.id === updates.author._id ? ". You" : ""}</span>
									</div>
									<div className="text-xs">
										Added a Petition Update
										{/* <ReactTimeAgo date={new Date(updates.createdAt)} /> */}
									</div>
								</div>
							</div>
						</Link>
						<HideComp id={updates.id} toggle={toggle} />
					</div>
					{/* </div> */}
					<div className="text-sm my-1">{updates.author.description}</div>
				</div>
				<div className="text-sm p-2 leading-loose">{updates.petition?.title}</div>
				<div className="p-2">
					<ImageCarousel image={updates.image} />
				</div>
				<div className="font-bold text-lg">Petition Update</div>

				{more ? (
					<div className="text-sm p-2 leading-loose">
						{updates.body.slice(0, 250)}{" "}
						<span className="text-warning underline" onClick={() => setMore(!more)}>
							..see more
						</span>
					</div>
				) : (
					<div className="text-sm p-2 leading-loose">
						{updates.body}
						{updates.body.length > 250 ? (
							<span className="text-warning underline" onClick={() => setMore(!more)}>
								see less
							</span>
						) : null}
					</div>
				)}
				{/* <div className="text-sm p-2 leading-loose">{updates.body}</div> */}
				<div className="w-full relative">
					<Link href={`/campaigns/${updates?.petition?.slug}`}>
						<button className="p-2 absolute bottom-0 right-0 text-sm text-white bg-warning">
							View Petition
						</button>
					</Link>
				</div>
				<Interaction post={updates} />
				<ToastContainer />
			</div>}

			{show && <UnHideComp toggle={toggle} id={updates._id} />}

		</div>
	)
}

export default Updates
