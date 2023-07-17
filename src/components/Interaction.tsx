import React, { useState, useEffect } from "react"
import { Dropdown } from "rsuite"
import ReactTimeAgo from "react-time-ago"
import CreatePost from "./modals/CreatePost"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { LIKE, COMMENT, VIEW } from "apollo/queries/generalQuery"
import axios from "axios"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import { Loader } from "rsuite"
import { DELETE_POST } from "apollo/queries/postQuery"
import { GET_ORGANIZATIONS, GET_ORGANIZATION } from "apollo/queries/orgQuery"
import { useMutation, useQuery } from "@apollo/client"
import { apollo } from "apollo"
import { IOrg } from "types/Applicant.types"
import ShareModal from "./modals/ShareModal"
import Link from "next/link"
import CreateAdvert from "./modals/CreateAdvert"
import CreateEvent from "./modals/CreateEvent"
import AddUpdates from "./modals/AddUpdates"
import StartPetition from "./modals/StartPetition"
import CreateVictories from "./modals/CreateVictories"
import { useRouter } from "next/router"
import { DELETE_VICTORIES } from "apollo/queries/victories"
import { LIKE_COMMENT, LIKE_REPLY, REMOVE_COMMENT, REPLY_COMMENT, EDIT_COMMENT, REMOVE_REPLY, EDIT_REPLY } from "apollo/queries/commentsQuery"

const CampComp = ({ post }: { post: any }): JSX.Element => {
	const router = useRouter()
	const author = useRecoilValue(UserAtom)
	const [openPost, setOpenPost] = useState(false)
	const [openAd, setOpenAd] = useState(false)
	const [openEvent, setOpenEvent] = useState(false)
	const [openPetition, setOpenPetition] = useState(false)
	const handelVictory = () => setOpenVictory(!openVictory)
	const [openVictory, setOpenVictory] = useState(false)
	const handelUpdates = () => setOpenUpdates(!openUpdates)

	const [openUpdates, setOpenUpdates] = useState(false)
	const handelClick = () => setOpenPost(!openPost)
	const handelPetition = () => setOpenPetition(!openPetition)
	const handelAdClick = () => setOpenAd(!openAd)
	const handelEventClick = () => setOpenEvent(!openEvent)

	const [comments, setComments] = useState(false)
	const [liked, setLiked] = useState(false)
	const [likes, setLikes] = useState(post.likes.length)
	const [content, setContent] = useState("")
	const [qty, setQty] = useState(4)
	const [allComment, setAllComment] = useState(post.comments)
	const [loading, setLoading] = useState(false)
	const [orgs, setOrgs] = useState<IOrg[]>([])
	const [open, setOpen] = useState(false)
	const [update, setUpdate] = useState(null)
	const [victories, setVictories] = useState(null)
	const [single, setSingle] = useState(null)

	useQuery(GET_ORGANIZATIONS, {
		variables: { ID: author?.id },
		client: apollo,
		onCompleted: (data) => {
			// console.log(data.getUserOrganizations)
			setOrgs(data.getUserOrganizations)
		},
		onError: (err) => {
			// console.log(err)
		},
	})

	function isOwner(id) {
		return id === author.id || orgs.some((obj) => obj._id === id)
	}
	author.orgOperating.map((org) => {
		useQuery(GET_ORGANIZATION, {
			variables: { ID: org },
			client: apollo,
			onCompleted: (data) => {
				// console.log(data)
				setOrgs([...orgs, data.getOrganzation])
			},
			onError: (err) => {
				console.log(err.message)
			},
		})
	})
	// }
	useEffect(() => {
		setLiked(post.likes?.some((obj) => obj._id === author.id))
	}, [])

	const like = async () => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(LIKE),
				variables: {
					authorId: author.id,
					itemId: post._id,
				},
			})
			console.log(data)
			setLiked(!liked)
			liked === true ? setLikes(likes - 1) : setLikes(likes + 1)
		} catch (error) {
			console.log(error)
		}
	}
	const promote = (slug) => {
		router.push(`/promote?slug=${slug}&view=true`)
	}

	const comment = async (e, id) => {
		if (content.length === 0) return
		if (e.key !== "Enter") return

		try {
			setLoading(true)
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(COMMENT),
				variables: {
					authorId: author.id,
					itemId: id,
					content: content,
				},
			})
			setAllComment([
				{
					author: {
						name: author.name,
						image: author.image,
					},
					content: content,
					createdAt: new Date(),
				},
				...allComment,
			])
			setContent(" ")
			setLoading(false)
			console.log(data)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}
	const commentBtn = async (id) => {
		try {
			setLoading(true)
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(COMMENT),
				variables: {
					authorId: author.id,
					itemId: id,
					content: content,
				},
			})
			setAllComment([
				{
					authorName: author.name,
					authorImage: author.image,
					authorId: author.id,
					content: content,
					_id: data.data.comment._id,
					createdAt: new Date(),
				},
				...allComment,
			])
			setContent(" ")
			setLoading(false)
			console.log(data)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	const deleteVictory = async (id) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(DELETE_VICTORIES),
				variables: {
					id: id,
				},
			})
			console.log(data)
			toast.success("Victory deleted successfully")
		} catch (error) {
			console.log(error)
			toast.warn("Opps! something occurred")
		}
	}
	const deletePost = async (id) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(DELETE_POST),
				variables: {
					authorId: id,
					postId: post._id,
				},
			})
			console.log(data)
			toast.success("Post deleted successfully")
		} catch (error) {
			console.log(error)
			toast.warn("Opps! something occurred")
		}
	}
	const view = async (id) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(VIEW),
				variables: {
					authorId: author.id,
					itemId: id,
				},
			})
			// console.log(data)
		} catch (err) {
			console.log(err.response)
		}
	}

	const editComment = async () => {
		try {
			setLoading(true)
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(EDIT_COMMENT),
				variables: {
					authorId: author.id,
					commentId: single._id,
					content: content
				},
			})
			console.log(data)
			setLoading(false)
			setContent("")
			setSingle(null)
		} catch (err) {
			console.log(err)
		}
	}

	const deleteComment = async (index) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(REMOVE_COMMENT),
				variables: {
					authorId: author.id,
					commentId: post.comments[index]._id,
					itemId: post._id
				},
			})
			console.log(data)
			allComment.splice(index, 1)
			// setAllComment(newComment)
		}
		catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="border-t border-gray-200">
			<div className="pt-3 flex justify-between" onMouseEnter={() => view(post._id || post.id)}>
				{liked ? (
					<div className="flex  cursor-pointer" onClick={() => { like() }}>
						<img className="w-8 h-8 sm:w-6 sm:h-6 sm:my-auto" src="/images/home/icons/liked.svg" alt="" />
						<div className={"text-warning text-sm my-auto ml-2"}>
							{likes} {post.__typename === "Petition" ? "endorsed" : "likes"}
						</div>
					</div>
				) : (
					<div className="flex  cursor-pointer" onClick={() => { like(); post.__typename === "Petition" ? setComments(true) : null }}>
						<img className="w-8 h-8 sm:w-6 sm:h-6 sm:my-auto" src="/images/home/icons/ant-design_like-outlined.svg" alt="" />
						<div className={"text-sm my-auto ml-2"}>
							{likes} {post.__typename === "Petition" ? "endorsed" : "likes"}
						</div>
					</div>
				)}

				<div className="flex  cursor-pointer" onClick={() => { post.__typename === "Petition" ? null : setComments(!comments) }}>
					<img className="w-8 h-8 sm:w-6 sm:h-6 sm:my-auto" src="/images/home/icons/akar-icons_chat-bubble.svg" alt="" />
					<div className="text-sm my-auto ml-2">{allComment?.length} {post.__typename === "Petition" ? "Reasons" : "Comments"} </div>
				</div>

				<div className="flex  cursor-pointer" onClick={() => setOpen(!open)}>
					<img className="w-8 h-8 sm:w-6 sm:h-6 sm:my-auto" src="/images/home/icons/clarity_share-line.svg" alt="" />
					<div className="text-sm my-auto ml-2">{post?.shares} Shares</div>
				</div>
				<Dropdown placement="leftStart" title={<img className="h-6 w-6" src="/images/edit.svg" alt="" />} noCaret>
					{(() => {
						switch (post.__typename) {
							case "Advert":
								return (
									<div>
										<Link href={`/report?page=${post?._id}`}>
											<Dropdown.Item>Report</Dropdown.Item>
										</Link>
										{isOwner(post.author._id) ? <Dropdown.Item onClick={handelAdClick}>Edit</Dropdown.Item> : null}
										{isOwner(post.author._id) ? (
											<Dropdown.Item>
												<span onClick={() => promote(post._id)}>Promote</span>
											</Dropdown.Item>
										) : null}
									</div>
								)
							case "Event":
								return (
									<div>
										<Link href={`/report?page=${post?._id}`}>
											<Dropdown.Item>Report</Dropdown.Item>
										</Link>
										{isOwner(post.author._id) ? (
											<Dropdown.Item>
												<span onClick={() => promote(post._id)}>Promote</span>{" "}
											</Dropdown.Item>
										) : null}
										{isOwner(post.author._id) ? <Dropdown.Item onClick={handelEventClick}>Edit</Dropdown.Item> : null}
										{isOwner(post.author._id) ? (
											<Dropdown.Item>
												<span onClick={() => promote(post._id)}>Promote</span>
											</Dropdown.Item>
										) : null}
									</div>
								)
							case "Petition":
								return (
									<div>
										<Dropdown.Item
											onClick={() => {
												handelVictory(), setVictories(null)
											}}
										>
											Celebrate Victory
										</Dropdown.Item>
										{isOwner(post.author._id) ?
											<Dropdown.Item
												onClick={() => {
													handelUpdates(), setUpdate(null)
												}}
											>
												Update
											</Dropdown.Item>
											: null}
										<Link href={`/report?page=${post?.slug}`}>
											<Dropdown.Item>Report</Dropdown.Item>
										</Link>
										<Dropdown.Item>
											<span onClick={() => promote(post._id)}>Promote</span>
										</Dropdown.Item>
										{isOwner(post.author._id) ? <Dropdown.Item onClick={handelPetition}>Edit</Dropdown.Item> : null}
									</div>
								)
							case "Victory":
								return (
									<div>
										{isOwner(post.author._id) ? (
											<Dropdown.Item
												onClick={() => {
													handelVictory(), setVictories(post)
												}}
											>
												Edit
											</Dropdown.Item>
										) : null}{" "}
										{isOwner(post.author._id) ? (
											<Dropdown.Item onClick={() => deleteVictory(post.author._id)}>
												<span className="text-red-500">Delete</span>
											</Dropdown.Item>
										) : null}
									</div>
								)
							case "Post":
								return (
									<div>
										<Link href={`/report?page=${post?._id}`}>
											<Dropdown.Item>Report</Dropdown.Item>
										</Link>
										{isOwner(post.author._id) ? (
											<Dropdown.Item>
												<span onClick={() => promote(post._id)}>Promote</span>
											</Dropdown.Item>
										) : null}{" "}
										{isOwner(post.author._id) ? <Dropdown.Item onClick={handelClick}>Edit</Dropdown.Item> : null}
										{isOwner(post.author._id) ? (
											<Dropdown.Item onClick={() => deletePost(post.author._id)}>
												<span className="text-red-500">Delete</span>
											</Dropdown.Item>
										) : null}
									</div>
								)
							case "Update":
								return (
									<div>
										{isOwner(post.author._id) ? (
											<Dropdown.Item
												onClick={() => {
													handelUpdates(), setUpdate(post)
												}}
											>
												Edit
											</Dropdown.Item>
										) : null}
										<Link href={`/report?page=${post?._id}`}>
											<Dropdown.Item>Report</Dropdown.Item>
										</Link>
									</div>
								)
							default:
								null
						}
					})()}
				</Dropdown>
			</div>
			{comments === true ? (
				<div>
					<div className="flex border-t border-gray-200 p-2 relative">
						<img src={author.image} className="w-10 h-10 mr-3 rounded-full my-auto" alt="" />
						<input
							type="text"
							value={content}
							// onKeyPress={(e) => comment(e, post._id)}
							onChange={(e) => setContent(e.target.value)}
							className="p-2 w-full border border-black text-sm"
							placeholder={post.__typename === "Petition" ? "What is your reason for endorsing this Petition?" : "Write a comment"}
						/>
						<div className="absolute top-4 right-6">
							{loading ? <Loader /> : <img src="./images/send.png" onClick={(e) => single === null ? commentBtn(post._id) : editComment()} className="w-6 h-6 cursor-pointer" alt="" />}
						</div>
					</div>
					{allComment?.length > 0
						? allComment?.slice(0, qty).map((comment, index) => (
							<div key={index} className="flex p-2">
								<img src={comment.authorImage} className="w-10 h-10 mr-3 rounded-full " alt="" />
								<div className="w-full">
									<div className=" bg-gray-100 p-2 flex justify-between">
										<div className="">
											<div className="font-bold text-sm mt-1">{comment.authorName}</div>
											<div className="text-xs mt-1">{comment?.content}</div>
										</div>
										<div className="text-sm">
											<ReactTimeAgo date={new Date(comment.createdAt)} />{" "}
										</div>
									</div>
									<RepliesComp comment={comment} setSingle={() => { setSingle(comment), setContent(single?.content) }} deleteComment={() => deleteComment(index)} />
								</div>
							</div>
						))
						: null}
					{allComment.length > 4 ? (
						<div onClick={() => setQty(qty + 4)} className="text-base text-warning text-center">
							show more
						</div>
					) : null}
				</div>
			) : null}
			<CreatePost open={openPost} handelClick={handelClick} post={post} handelPetition={handelClick} orgs={orgs} />
			<StartPetition open={openPetition} handelClick={handelPetition} orgs={orgs} data={post} />
			{/* <FindExpartModal author={author} open={openFindExpart} handelClose={() => setOpenFindExpart(false)} /> */}
			<CreateEvent open={openEvent} handelClick={handelEventClick} event={post} orgs={orgs} />
			<CreateAdvert open={openAd} handelClick={handelAdClick} advert={post} />
			<AddUpdates open={openUpdates} handelClick={handelUpdates} petition={post} update={update} />
			<CreateVictories open={openVictory} handelClick={handelVictory} victory={victories} />

			<ToastContainer />
			<ShareModal open={open} handelClick={() => setOpen(!open)} single={post} orgs={orgs} />
		</div>
	)
}

export default CampComp

export function RepliesComp({ comment, deleteComment, setSingle }: any) {
	const [reply, setReply] = useState("")
	const [loading2, setLoading2] = useState(false)
	const author = useRecoilValue(UserAtom)
	const [replies, setReplies] = useState(false)
	const [commentLikes, setCommentLikes] = useState(comment?.likes?.length)
	const [commmentReplies, setCommentReplies] = useState(comment?.replies)
	const [single, setNewSingle] = useState(null)

	const replyBtn = async (comment) => {
		try {
			setLoading2(true)
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(REPLY_COMMENT),
				variables: {
					authorId: author.id,
					commentId: comment._id,
					content: reply,
				},
			})
			setCommentReplies([{
				authorName: author.name,
				authorImage: author.image,
				authorId: author.id,
				content: reply,
				createdAt: new Date(),
			}, ...commmentReplies])
			setReply(" ")
			setLoading2(false)
			console.log(data)
		} catch (error) {
			console.log(error)
			setLoading2(false)
		}
	}

	const likeComment = async (comment) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(LIKE_COMMENT),
				variables: {
					authorId: author.id,
					commentId: comment._id,
				},
			})
			console.log(data)
			setCommentLikes(commentLikes + 1)
		}
		catch (err) {
			console.log(err)
		}
	}

	const likeReply = async (comment, index) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(LIKE_REPLY),
				variables: {
					authorId: author.id,
					commentId: comment._id,
					replyId: comment.reply[index]._id,
				},
			})
			console.log(data)
		}
		catch (err) {
			console.log(err)
		}
	}

	const removeReply = async (index) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(REMOVE_REPLY),
				variables: {
					authorId: author.id,
					commentId: comment._id,
					replyId: commmentReplies[index]._id,
				},
			})
			console.log(data)
			commmentReplies.splice(index, 1)
			// setCommentReplies(newComment)
		}
		catch (err) {
			console.log(err)
		}
	}

	const editReply = async () => {
		try {
			setLoading2(true)
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(EDIT_REPLY),
				variables: {
					authorId: author.id,
					commentId: comment._id,
					replyId: single._id,
					content: reply
				},
			})
			setLoading2(false)
			setNewSingle(null)
			setReply("")
			console.log(data)
		}
		catch (err) {
			console.log(err)
		}
	}


	return (
		<div>
			<div className="flex my-1 text-sm">
				<div className="cursor-pointer" onClick={() => setReplies(!replies)}><span className="mr-1">{commmentReplies?.length}</span> Reply</div>
				<div onClick={(e) => likeComment(comment)} className="mx-4 cursor-pointer"><span className="mx-1">{commentLikes}</span> Likes</div>
				{
					author.id === comment.authorId ? <div onClick={() => setSingle()} className="cursor-pointer mr-4">
						Edit
					</div> : null
				}
				{
					author.id === comment.authorId ? <div onClick={() => deleteComment()} className="cursor-pointer text-red-500">
						Delete
					</div> : null
				}
			</div>

			{
				replies &&
				<div>
					<div className="flex border-t border-gray-200 p-2 relative">
						<img src={author.image} className="w-10 h-10 mr-3 rounded-full my-auto" alt="" />
						<input
							type="text"
							value={reply}
							onChange={(e) => setReply(e.target.value)}
							className="p-2 w-full border border-black text-sm"
							placeholder={"Reply comment"}
						/>
						<div className="absolute top-4 right-6">
							{loading2 ? <Loader /> : <img src="./images/send.png" onClick={(e) => { single === null ? replyBtn(comment) : editReply() }} className="w-6 h-6 cursor-pointer" alt="" />}
						</div>
					</div>
					{commmentReplies?.length > 0 ?
						commmentReplies?.map((reply, index) => (
							<div key={index} className="flex">
								<img src={reply.authorImage} className="w-10 h-10 mr-3 my-auto rounded-full" alt="" />
								<div className="w-full">
									<div className=" bg-gray-100 p-2 flex justify-between">
										<div className="">
											<div className="font-bold text-sm mt-1">{reply.authorName}</div>
											<div className="text-xs mt-1">{reply?.content}</div>
										</div>
										<div className="text-sm">
											<ReactTimeAgo date={new Date(reply.createdAt)} />{" "}
										</div>
									</div>
									<div className="flex my-1 text-sm">
										{/* <div onClick={() => setReplies(!replies)}><span className="mr-1">{comment.replies?.length}</span> Reply</div> */}
										<div onClick={(e) => likeReply(comment, index)} className="cursor-pointer"><span className="mx-1">{reply.likes?.length}</span> Likes</div>
										{
											author.id === reply.authorId ? <div onClick={() => { setReply(reply.content), setNewSingle(reply) }} className="cursor-pointer mx-4">
												Edit
											</div> : null
										}
										{
											author.id === reply.authorId ? <div onClick={() => removeReply(index)} className="cursor-pointer text-red-500">
												Delete
											</div> : null
										}
									</div>
								</div>
							</div>
						)
						) : null}
				</div>
			}
		</div>
	);
}
