/* eslint-disable react/react-in-jsx-scope */
import { Modal, Popover, Whisper } from "rsuite"
import { useState, useRef, useEffect } from "react"
import { Dropdown } from "rsuite"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { bodyStreamToNodeStream } from "next/dist/server/body-streams"
import { useRouter } from "next/router"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"

const StartPetition = ({ open, handelClick, data, orgs }: { open: boolean; handelClick(): void; data: any; orgs: any }): JSX.Element => {
	const [title, setTitle] = useState(data?.title || "")
	const [loading, setLoading] = useState(false)
	const uploadRef = useRef<HTMLInputElement>(null)
	const [category, setCategory] = useState("Add Category")
	const author = useRecoilValue(UserAtom)
	const [active, setActive] = useState<any>(null)
	const [id, setId] = useState(data?._id || "")
	const [previewImages, setFilePreview] = useState(data?.asset || []);
	const router = useRouter()
	const [aim, setAim] = useState(data?.aim || "")
	const [target, setTarget] = useState(data?.target || "")
	const [body, setBody] = useState(data?.body || "")

	const handleDelSelected = (index) => {
		setFilePreview((prev) => {
			const newPreviewImages = [...prev];
			newPreviewImages.splice(index, 1);
			return newPreviewImages;
		});
	};

	useEffect(() => {
		setActive(author)
	}, [author !== null])

	const [preview, setPreview] = useState(false)
	const handelPreview = () => {
		handelClick()
		setPreview(!preview)
	}

	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		const reader = new FileReader()

		if (files && files.length > 0) {
			reader.readAsDataURL(files[0])
			reader.onloadend = () => {
				if (reader.result) {
					const type = files[0].name.substr(files[0].name.length - 3)
					setFilePreview([...previewImages, {
						url: reader.result as string,
						type: type === "mp4" ? "video" : "image"
					}])
				}
			}
		}
	}



	const createPetition = async () => {
		try {
			setLoading(true)
			const { data } = await axios.post("/petition", {
				title: title,
				category: category,
				assets: previewImages,
				aim: aim,
				target: target,
				body: body,
				author: active._id || active.id,
			})
			console.log(data)
			setLoading(false)
			setPreview(false)
			toast("Petition Created Successfully")
			router.push(`/promote?slug=${data.slug}`)
			setTitle("")
			setCategory("")
			setAim("")
			setTarget("")
			setBody("")
			setFilePreview([])
		} catch (error) {
			console.log(error.response)
			toast.warn("Oops! Something went wrong")
			setLoading(false)
		}
	}
	const updatePetition = async () => {
		try {
			setLoading(true)
			const { data } = await axios.put("https://apiv5-xacq2.ondigitalocean.app/api/v5/petition", {
				title: title,
				category: category,
				assets: previewImages,
				aim: aim,
				target: target,
				body: body,
				id: id,
			})
			console.log(data)
			setLoading(false)
			setPreview(false)
			toast("Petition Updated Successfully")
			setTitle("")
			setCategory("")
			setAim("")
			setTarget("")
			setBody("")
			setFilePreview([])
		} catch (error) {
			console.log(error)
			setLoading(false)
			toast.warn("Oops! Something went wrong")
		}
	}
	const speaker = (
		<Popover>
			<div onClick={() => setActive(author)} className="flex m-1 cursor-pointer">
				<img src={author?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
				<div className="text-sm my-auto">{author?.name}</div>
			</div>
			{orgs !== null
				? orgs?.map((org: any, index: number) => (
					<div
						onClick={() => {
							setActive(org)
						}}
						key={index}
						className="flex m-1 cursor-pointer"
					>
						<img src={org?.image} className="w-8 h-8 rounded-full mr-4" alt="" />
						<div className="text-sm my-auto">{org?.name}</div>
					</div>
				))
				: null}
		</Popover>
	)

	return (
		<>
			<Modal open={open} onClose={handelClick}>
				<Modal.Header>
					<div className="border-b border-gray-200 p-3 w-full">
						{data === null ? <Modal.Title>Create petition</Modal.Title> : <Modal.Title>Edit petition</Modal.Title>}
					</div>
				</Modal.Header>
				<Modal.Body>
					{orgs !== null ? (
						<div className="p-2 w-full rounded-md">
							<Whisper placement="bottom" trigger="click" speaker={speaker}>
								<div className="flex ">
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
					) : null}
					<div className="bg-gray-200 w-full p-4 text-center relative cursor-pointer" onClick={() => uploadRef.current?.click()}>
						{/* {image?.type === "image" && <img onClick={() => uploadRef.current?.click()} src={image.file} width="500" className="h-52 left-0 object-cover w-full absolute top-0" />} */}
						{/* {image?.type === "video" && (
							<video
								src={image.file}
								width="500"
								controls={true}
								className="embed-responsive-item absolute top-0 w-full object-cover left-0 h-52"
							>
								<source src={image.file} type="video/mp4" />
							</video>
						)} */}
						<input type="file" ref={uploadRef} multiple={true}
							className="d-none" onChange={handleImage} />
						<img src="/images/home/icons/ant-design_camera-outlined.svg" className="w-20 cursor-pointer h-20 mx-auto" alt="" />
						<div className="text-base my-3">Upload Petition Cover Image</div>
						<div className="text-sm my-2 text-gray-800">Cover image should be minimum of 500pxl/width</div>
					</div>
					{previewImages.length > 0 && (
						<div className="flex flex-wrap my-4 w-full">
							{previewImages.map((image, index) => (
								image.type === 'image' ?
									<div className="w-[100px] h-[100px] m-[3px]" key={index}>
										<img
											src={image.url}
											alt={`Preview ${index}`}
											className=" object-cover w-full h-full"
										/>
										<div
											className="flex  cursor-pointer text-[red] justify-center items-center"
											onClick={() => handleDelSelected(index)}
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
											<source src={image.url} type="video/mp4" />
										</video>
										<div
											className="flex  cursor-pointer text-[red] justify-center items-center"
											onClick={() => handleDelSelected(index)}
										>
											Delete
										</div>
									</div>
							))}
						</div>
					)}
					<div className="my-3 text-sm">
						<input
							value={title}
							type="text"
							onChange={(e) => setTitle(e.target.value)}
							className="p-2 border border-gray-700 w-full rounded-sm text-sm"
							placeholder="Title of petition"
						/>
					</div>
					<div className="mt-3 text-sm">
						<textarea
							value={aim}
							onChange={(e) => setAim(e.target.value)}
							className="p-1 border border-gray-700 w-full h-20 rounded-sm"
							placeholder="What is the aim of this petition"
						/>
					</div>

					<div className="mt-3 text-sm">
						<textarea
							value={target}
							onChange={(e) => setTarget(e.target.value)}
							className="p-1 border border-gray-700 w-full h-20 rounded-sm"
							placeholder="Who are you addressing the petition to ? ( e.g Presidnt, Prime minister, Governor, Senator, Rep e.t.c)"
						/>
					</div>
					<div className="mt-3 text-sm">
						<textarea
							value={body}
							onChange={(e) => setBody(e.target.value)}
							className="p-1 border border-gray-700 w-full h-32 rounded-sm"
							placeholder="Type the issue that you are complaining about"
						/>
					</div>
					<div className="z-40">
						<Dropdown placement="topStart" title={<div className="text-sm text-warning">{category}</div>}>
							<Dropdown.Item onClick={() => setCategory("Human right awareness")}>Human right awareness</Dropdown.Item>
							<Dropdown.Item onClick={() => setCategory("Social Policy")}>Social Policy</Dropdown.Item>
							<Dropdown.Item onClick={() => setCategory("Criminal Justice")}>Criminal Justice</Dropdown.Item>
							<Dropdown.Item onClick={() => setCategory("Human Right Action")}>Human Right Action</Dropdown.Item>
							<Dropdown.Item onClick={() => setCategory("Development")}>Development</Dropdown.Item>
							<Dropdown.Item onClick={() => setCategory("Environment")}>Environment</Dropdown.Item>
							<Dropdown.Item onClick={() => setCategory("Health")}>Health</Dropdown.Item>
							<Dropdown.Item onClick={() => setCategory("Politics")}>Politics</Dropdown.Item>
							<Dropdown.Item onClick={() => setCategory("Disability")}>Disability</Dropdown.Item>
							<Dropdown.Item onClick={() => setCategory("Equality")}>Equality</Dropdown.Item>
						</Dropdown>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<div className="flex lg:justify-evenly justify-between lg:w-1/2 mx-auto">
						<button onClick={handelClick} className="p-1 text-warning border border-warning rounded-md w-20 my-4">
							Save
						</button>
						<button onClick={handelPreview} className="p-1 bg-warning text-white rounded-md w-44 my-4">
							{loading ? "Loading..." : "Launch"}
						</button>
					</div>
				</Modal.Footer>
			</Modal>

			<Modal open={preview} onClose={handelPreview}>
				<Modal.Header>
					<div className="border-b border-gray-200 p-3 w-full">
						<Modal.Title>Preview petition</Modal.Title>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div>
						<div className="my-2 text-lg">{title}</div>
						<div className="my-4 w-full">
							{previewImages.length > 0 && (
								<div className="flex flex-wrap my-2 w-full">
									{previewImages.map((image, index) => (
										image.type === 'image' ?
											<div className="w-[100px] h-[100px] m-[3px]" key={index}>
												<img
													src={image.url}
													alt={`Preview ${index}`}
													className=" object-cover w-full h-full"
												/>
												<div
													className="flex  cursor-pointer text-[red] justify-center items-center"
													onClick={() => handleDelSelected(index)}
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
													onClick={() => handleDelSelected(index)}
												>
													Delete
												</div>
											</div>
									))}
								</div>
							)}
						</div>
						<div className="text-sm my-2">{body}</div>
						<div className="text-sm my-2">Category: {category}</div>
						<div className="text-sm my-2">Aim: {aim}</div>
						<div className="text-sm my-2">Target: {target}</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<div className="flex lg:justify-evenly justify-between lg:w-1/2 mx-auto">
						<button
							onClick={() => {
								handelPreview()
								handelClick()
							}}
							className="p-1 text-warning border border-warning rounded-md w-20 my-4"
						>
							Edit
						</button>
						{data === null ? (
							<button
								onClick={() => {
									createPetition()
								}}
								className="p-1 bg-warning text-white rounded-md w-44 my-4"
							>
								{loading ? "Loading..." : "Launch"}
							</button>
						) : (
							<button
								onClick={() => {
									updatePetition()
								}}
								className="p-1 bg-warning text-white rounded-md w-44 my-4"
							>
								{loading ? "Loading..." : "Update"}
							</button>
						)}
					</div>
				</Modal.Footer>
			</Modal>
			<ToastContainer />
		</>
	)
}
export default StartPetition
