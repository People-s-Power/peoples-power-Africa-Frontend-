/* eslint-disable react/react-in-jsx-scope */
import { Modal } from "rsuite"
import { useState, useRef, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import { UPDATE_POST } from "apollo/queries/postQuery"
import NotificationCard from "components/NotificationCard"

const AddUpdates = ({ open, handelClick, petition, update }: { open: boolean; handelClick(): void; petition: any; update: any }): JSX.Element => {
	const author = useRecoilValue(UserAtom)
	const [loading, setLoading] = useState(false)
	const [previewImages, setFilePreview] = useState(update?.image || []);

	const [body, setBody] = useState(update?.body || "")
	const uploadRef = useRef<HTMLInputElement>(null)

	const [notication, setNotication] = useState(false)
	const [msg, setMsg] = useState("")
	const [link, setLink] = useState("")

	useEffect(() => {
		// console.log(update)
		// console.log(petition)
	}, [])

	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files

		if (files && files.length <= 6) {
			const fileArray = Array.from(files);

			fileArray.forEach((file) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => {
					setFilePreview((prev) => [...prev, reader.result]);
				};
			});
		} else {
		}
		uploadRef.current.value = null;

	}

	const handleDelSelected = (index) => {
		setFilePreview((prev) => {
			const newPreviewImages = [...prev];
			newPreviewImages.splice(index, 1);
			return newPreviewImages;
		});
	};

	const handleSubmit = async () => {
		if (previewImages.length < 0 || body === "") {
			return toast.warn("Please fill all fields")
		}
		setLoading(true)
		try {
			const { data } = await axios.post("petition/update", {
				petitionId: petition._id,
				body: body,
				image: previewImages,
				authorId: author.id,
			})
			// toast.success("Updates added successfulluy")
			setLoading(false)
			handelClick()
			setLink(`/Update?page=${data.id}`)
			setMsg("Updates added  Successfully!")
			setNotication(true)
		} catch (err) {
			console.log(err)
			toast.warn("Oops an error occured")
			setLoading(false)
		}
	}
	const handleUpdate = async () => {
		setLoading(true)
		try {
			const { data } = await axios.put("petition/update", {
				updateId: update._id,
				body: body,
				image: previewImages,
				authorId: author.id,
			})
			toast.success("Updates edited successfulluy")
			setLoading(false)
			handelClick()
			setLink(`/Update?page=${data.id}`)
			setMsg("Updates edited  Successfully!")
			setNotication(true)
		} catch (err) {
			console.log(err)
			toast.warn("Oops an error occured")
			setLoading(false)
		}
	}
	return (
		<>
			<Modal open={open} onClose={handelClick}>
				<Modal.Header>
					<div className="border-b border-gray-200 p-3 w-full">
						<Modal.Title> {update === null ? "Add Update" : "Edit Update"}</Modal.Title>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div className="flex">
						<img src={author?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
						<div className="text-sm">{author?.name}</div>
					</div>
					<textarea
						value={body}
						onChange={(e) => setBody(e.target.value)}
						name=""
						className="w-full h-32 border border-white text-sm"
						placeholder="Let your supporters know about the progress of this petition ..."
					></textarea>
				</Modal.Body>

				<Modal.Footer>
					<input type="file" ref={uploadRef} multiple={true} className="d-none" onChange={handleImage} />
					{previewImages.length > 0 && (
						<div className="flex flex-wrap my-4 w-full">
							{previewImages.map((url, index) => (
								<div className="w-[100px] h-[100px] m-[3px]" key={index}>
									<img
										src={url}
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
							))}
						</div>
					)}
					<div className="flex justify-between text-gray-500">
						<div className="w-24 flex justify-between my-auto">
							<div onClick={() => uploadRef.current?.click()} className="cursor-pointer">
								<img className="w-4 h-4 my-auto" src="/images/home/icons/ic_outline-photo-camera.svg" alt="" />
							</div>
							<div className="cursor-pointer">
								<img className="w-4 h-4 my-auto" src="/images/home/icons/charm_camera-video.svg" alt="" />
							</div>
							<div className="cursor-pointer">
								<img className="w-4 h-4 my-auto" src="/images/home/icons/fe_sitemap.svg" alt="" />
							</div>
							<div className="cursor-pointer">
								<img className="w-4 h-4 my-auto" src="/images/home/icons/tabler_article.svg" alt="" />
							</div>
						</div>
						{update === null ? (
							<button onClick={handleSubmit} className="p-1 bg-warning text-white rounded-sm w-40">
								{loading ? "Loading..." : "Add Update"}
							</button>
						) : (
							<button onClick={handleUpdate} className="p-1 bg-warning text-white rounded-sm w-40">
								{loading ? "Loading..." : "Edit Update"}
							</button>
						)}
					</div>
				</Modal.Footer>
			</Modal>
			<ToastContainer />
			{
				notication && <NotificationCard hide={notication} msg={msg} link={link} close={() => setNotication(!notication)} />
			}
		</>
	)
}
export default AddUpdates
