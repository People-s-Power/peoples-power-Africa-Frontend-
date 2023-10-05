import React, { useState } from "react"
import { Dropdown } from "rsuite"
import ReactTimeAgo from "react-time-ago"
import CreatePost from "./modals/CreatePost"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { SHARE, LIKE, COMMENT, FOLLOW } from "apollo/queries/generalQuery"
import axios from "axios"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import Interaction from "./Interaction"
import HideComp from "./HideComp"
import StartPetition from "./modals/StartPetition"
import FindExpartModal from "./modals/FindExpartModal"
import UnHideComp from "./UnHideComp"

interface IProps {
	post: any;
	timeLine?: boolean;
	orgs?: any
}

const Victory = ({ post, timeLine, orgs }: IProps): JSX.Element => {
	const author = useRecoilValue(UserAtom)
	const handelClick = () => setOpenPost(!openPost)
	const [openPost, setOpenPost] = useState(false)
	const [content, setContent] = useState("")
	const [following, setFollowing] = useState(false)
	const [openPetition, setOpenPetition] = useState(false)
	const handelPetition = () => setOpenPetition(!openPetition)
	const [openFindExpart, setOpenFindExpart] = useState(false)
	const handelOpenFindExpart = () => setOpenFindExpart(!openFindExpart)

	const [show, setShow] = useState(false)

	const toggle = val => {
		setShow(val)
	}

	const follow = async (id) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(FOLLOW),
				variables: {
					followerId: author.id,
					followId: id,
				},
			})
			console.log(data)
			setFollowing(true)
		} catch (error) {
			console.log(error)
		}
	}

	function searchForValue(id) {
		let matchingStrings = false;
		for (const string of author.following) {
			if (string.includes(id)) {
				matchingStrings = true
			}
		}
		return matchingStrings;
	}


	return (
		<div>
			{show === false && <div className={timeLine ? "p-3 mb-3" : "p-3 border rounded-md mb-3"}>
				<div className="border-b border-gray-200 pb-3">
					<div className="flex">
						<Link href={`user?page=${post.author?._id}`}>
							<div className="flex cursor-pointer">
								<img className="w-12 h-12 rounded-full" src={post.author?.image} alt="" />
								<div className="ml-2">
									<div className="text-base font-bold capitalize">
										{post.author?.name} <span className="text-xs">{author?.id === post.author?._id ? ". You" : ""}</span>
									</div>
									<div className="text-base">Shared this victory/testimony</div>
								</div>
							</div>
						</Link>
						{timeLine ? searchForValue(post.author._id) ? null : <div className="w-[15%] ml-auto">
							{following ? <span>Following</span> : <span onClick={() => follow(post.author._id)} className="cursor-pointer">+ Follow</span>}
						</div> : <HideComp id={post._id} />}
					</div>
					<div className="text-sm my-1">{post.author.description?.slice(0, 70)} {post.author.description?.length > 100 && '...'}</div>
				</div>
				<div className="text-sm p-2 leading-loose">{post.body}</div>
				<div className="p-2">
					<img src={post?.asset[0].url} className="w-full h-80 rounded-md object-cover" alt="" />
				</div>
				<div className="text-sm leading-loose p-2">
					Do you think you have a personal or social concern? Find an expert who will help you resolve it or start writing your own petition and share your victory or testimony later
				</div>
				<div className="flex justify-center mb-1">
					<button className="border border-warning p-1 mt-1 mr-4 text-black rounded-md bg-white" onClick={() => handelOpenFindExpart()}>Find Expert</button>
					<button className="border border-warning p-1 mt-1 text-black rounded-md bg-white" onClick={() => handelPetition()}>Start Petition</button>
				</div>
				<Interaction post={post} />

				<CreatePost open={openPost} handelClick={handelClick} post={post} handelPetition={handelClick} orgs={null} />
				<FindExpartModal author={author} open={openFindExpart} handelClose={() => setOpenFindExpart(false)} orgs={orgs} />
				<StartPetition open={openPetition} handelClick={handelPetition} orgs={orgs} data={null} />
				<ToastContainer />
			</div>}

			{show && <UnHideComp toggle={toggle} id={post._id} />}

		</div>
	)
}

export default Victory
