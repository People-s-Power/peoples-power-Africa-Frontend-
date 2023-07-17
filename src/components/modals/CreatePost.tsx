/* eslint-disable react/react-in-jsx-scope */
import { Modal, Popover, Whisper } from "rsuite"
import { useState, useRef, useEffect } from "react"
import { CREATE_POST, UPDATE_POST } from "apollo/queries/postQuery"
import { Dropdown } from "rsuite"
import axios from "axios"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import NotificationCard from "components/NotificationCard"
import notifications from "pages/notifications"
import FindExpartModal from "./FindExpartModal"
import CreateEvent from "./CreateEvent"

const CreatePost = ({
	open,
	handelClick,
	post,
	handelPetition,
	orgs,
}: {
	open: boolean
	handelClick(): void
	post: any
	handelPetition(): void
	orgs: any
}): JSX.Element => {
	const [filesPreview, setFilePreview] = useState<any>(post?.image || [])
	const author = useRecoilValue(UserAtom)
	const [openEvent, setOpenEvent] = useState(false)
	const handelEventClick = () => setOpenEvent(!openEvent)
	const [active, setActive] = useState<any>(author)
	const [loading, setLoading] = useState(false)
	const [body, setBody] = useState(post?.body || "")
	const uploadRef = useRef<HTMLInputElement>(null)
	const [category, setCategory] = useState("Add Category")
	const [notication, setNotication] = useState(false)
	const [msg, setMsg] = useState("")
	const [link, setLink] = useState("")
	const [openFindExpart, setOpenFindExpart] = useState(false)

	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		const reader = new FileReader()

		if (files && files.length > 0) {
			reader.readAsDataURL(files[0])
			reader.onloadend = () => {
				if (reader.result) {
					const type = files[0].name.substr(files[0].name.length - 3)
					setFilePreview([...filesPreview, {
						url: reader.result as string,
						type: type === "mp4" ? "video" : "image"
					}])
				}
			}
		}
	}

	const clearFile = (index) => {
		const array = filesPreview
		array.splice(index, 1)
		setFilePreview(array)
	}

	const handleSubmit = async () => {
		if (category === "Add Category") return
		setLoading(true)
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(CREATE_POST),
				variables: {
					authorId: active.id || active._id,
					body: body,
					assets: filesPreview,
					categories: [category],
				},
			})
			console.log(data)
			handelClick()
			setBody("")
			setFilePreview([])
			setLoading(false)
			setLink(`/${data.data.createPost.__typename}?page=${data.data.createPost._id}`)
			setMsg("Post Created Successfully!")
			setNotication(true)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	const handleUpdate = async () => {
		setLoading(true)
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(UPDATE_POST),
				variables: {
					authorId: active._id,
					body: body,
					postId: post._id,
					assets: filesPreview,
					categories: [category],
				},
			})
			console.log(data)
			handelClick()
			setBody("")
			setLoading(false)
			setLink(`/${data.data.updatePost.__typename}?page=${data.data.updatePost._id}`)
			setMsg("Post Updated Successfully!")
			setNotication(true)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	useEffect(() => {
		if (open) {
			const theHashtag = document.querySelector(".the-hash") as HTMLDivElement;
			console.log(theHashtag);
			if (theHashtag) setCategory(theHashtag.innerText || "Add Category");
		}
	}, [open])

	useEffect(() => {
		post === null ? setActive(author) : setActive(post.author)
	}, [author !== null])

	const speaker = (
		<Popover>
			<div onClick={() => setActive(author)} className="flex m-1">
				<img src={author?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
				<div className="text-sm my-auto">{author?.name}</div>
			</div>
			{orgs?.map((org: any, index: number) => (
				<div onClick={() => setActive(org)} key={index} className="flex m-1 cursor-pointer">
					<img src={org?.image} className="w-8 h-8 rounded-full mr-4" alt="" />
					<div className="text-sm my-auto">{org?.name}</div>
				</div>
			))}
		</Popover>
	)

	return (
		<>
			<Modal open={open} onClose={handelClick}>
				<Modal.Header>
					<div className="border-b border-gray-200 w-full flex justify-between">
						{post === null ? (
							<div className="p-2 w-full rounded-md">
								<Whisper placement="bottom" trigger="click" speaker={speaker}>
									<div className="flex">
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
						) : (
							<div className="flex">
								<img src={active?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
								<div className="text-sm">{active?.name}</div>
							</div>
						)}
						{post === null ? (
							<button onClick={handleSubmit} className="p-1 h-8 my-auto bg-warning text-white rounded-sm w-20">
								{loading ? "Loading..." : "Post"}
							</button>
						) : (
							<button onClick={handleUpdate} className="p-1 h-8 my-auto bg-warning text-white rounded-sm w-20">
								{loading ? "Loading..." : "Update"}
							</button>
						)}
					</div>
				</Modal.Header>
				<Modal.Body>
					{/* {post === null ? (
						<div className="p-2 w-full rounded-md">
							<Whisper placement="bottom" trigger="click" speaker={speaker}>
								<div className="flex">
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
					) : (
						<div className="flex">
							<img src={active?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
							<div className="text-sm">{active?.name}</div>
						</div>
					)} */}
					<textarea
						value={body}
						onChange={(e) => setBody(e.target.value)}
						name=""
						className="w-full h-32 border border-white text-sm"
						placeholder="Start your complaint..."
					></textarea>
				</Modal.Body>
				<div className="z-40">
					<Dropdown placement="topStart" title={<div className="text-sm text-warning">{category}</div>}>
						{/* <Dropdown.Item onClick={() => setCategory("Human right awareness")}>Human right awareness</Dropdown.Item>
						<Dropdown.Item onClick={() => setCategory("Social Policy")}>Social Policy</Dropdown.Item>
						<Dropdown.Item onClick={() => setCategory("Criminal Justice")}>Criminal Justice</Dropdown.Item>
						<Dropdown.Item onClick={() => setCategory("Human Right Action")}>Human Right Action</Dropdown.Item>
						<Dropdown.Item onClick={() => setCategory("Development")}>Development</Dropdown.Item>
						<Dropdown.Item onClick={() => setCategory("Environment")}>Environment</Dropdown.Item>
						<Dropdown.Item onClick={() => setCategory("Health")}>Health</Dropdown.Item>
						<Dropdown.Item onClick={() => setCategory("Politics")}>Politics</Dropdown.Item>
						<Dropdown.Item onClick={() => setCategory("Disability")}>Disability</Dropdown.Item>
						<Dropdown.Item onClick={() => setCategory("Equality")}>Equality</Dropdown.Item> */}
					</Dropdown>
				</div>
				<Modal.Footer>
					<input type="file" ref={uploadRef} className="d-none" onChange={handleImage} />
					<div className="flex my-4">
						{filesPreview.map((image, index) => (
							image.type === 'image' ?
								<div className="w-[100px] h-[100px] m-[3px]" key={index}>
									<img
										src={image.url}
										alt={`Preview ${index}`}
										className=" object-cover w-full h-full"
									/>
									<div
										className="flex  cursor-pointer text-[red] justify-center items-center"
										onClick={() => clearFile(index)}
									>
										Delete
									</div>
								</div>
								: <div className="w-[100px] h-[100px] m-[3px]" key={index}>
									<video
										src={image.url}
										width="500"
										autoPlay muted
										className="embed-responsive-item w-full object-cover h-full"
									>
										<source src={image.file} type="video/mp4" />
									</video>
									<div
										className="flex  cursor-pointer text-[red] justify-center items-center"
										onClick={() => clearFile(index)}
									>
										Delete
									</div>
								</div>
						))}
						{/* {filesPreview.map((file, index) =>
							file.type === "image" ? (
								<div key={index} className="relative w-20 h-20 mx-1">
									<img src={file.url} className="w-20 h-20" alt="" />
									<div className="absolute top-1 cursor-pointer right-1 w-4 h-4 rounded-full bg-danger text-sm text-center text-white">
										<div className="mx-auto text-xs my-auto text-white" onClick={() => clearFile(index)}>
											x
										</div>
									</div>
								</div>
							) : (
								<video key={index} src={file.url} width="500" autoPlay muted className="w-full object-cover h-52 my-3">
									<source src={file.url} type="video/mp4" />
								</video>
							)
						)} */}
					</div>

					<div className="flex sm:flex-wrap justify-between text-gray-500">
						<div className="w-10 flex justify-between my-auto">
							<div onClick={() => uploadRef.current?.click()} className="cursor-pointer">
								<img className="w-4 h-4 my-auto" src="/images/home/icons/ic_outline-photo-camera.svg" alt="" />
							</div>
							<div onClick={() => uploadRef.current?.click()} className="cursor-pointer">
								<img className="w-4 h-4 my-auto" src="/images/home/icons/charm_camera-video.svg" alt="" />
							</div>
							{/* <div className="cursor-pointer">
								<img className="w-4 h-4 my-auto" src="/images/home/icons/fe_sitemap.svg" alt="" />
							</div> */}
						</div>
						<div
							className="text-sm flex my-auto"
							onClick={() => {
								handelClick()
								setOpenFindExpart(true)
							}}
						>
							<img className="w-4 h-4 my-auto" src="/images/home/icons/experts.svg" alt="" />
							<div className="my-auto text-sm ml-3">Find Expert</div>
						</div>
						<div
							className="text-sm my-auto flex cursor-pointer"
							onClick={() => {
								handelClick(), handelPetition()
							}}
						>
							<div className="cursor-pointer">
								<img className="w-4 h-4 my-auto" src="/images/home/icons/tabler_article.svg" alt="" />
							</div>
							<div className="my-auto text-sm ml-3">Make petition</div>
						</div>

						<div
							className="flex  cursor-pointer "
							onClick={() => {
								handelClick()
								handelEventClick()
							}}
						>
							<img className="w-4 h-4 my-auto" src="/images/home/icons/fe_sitemap.svg" alt="" />
							<div className="my-auto text-sm ml-3">Events</div>
						</div>
					</div>
				</Modal.Footer>
			</Modal>
			{notication && <NotificationCard hide={notication} msg={msg} link={link} close={() => setNotication(!notication)} />}
			<FindExpartModal author={author} open={openFindExpart} handelClose={() => setOpenFindExpart(false)} orgs={orgs} />
			<CreateEvent open={openEvent} handelClick={handelEventClick} event={null} orgs={orgs} />
		</>
	)
}
export default CreatePost
