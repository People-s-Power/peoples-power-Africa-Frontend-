/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from "react"
import { Modal } from "rsuite"
import { useRef, useState } from "react"
import axios from "axios"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import { CREATE_ADVERT, UPDATE_ADVERT } from "apollo/queries/advertsQuery"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import NotificationCard from "components/NotificationCard"

const CreateAdvert = ({ open, handelClick, advert }: { open: boolean; handelClick(): void; advert: any }): JSX.Element => {
	const [previewImages, setFilePreview] = useState(advert?.image || []);

	const uploadRef = useRef<HTMLInputElement>(null)
	const [caption, setCaption] = useState(advert?.caption || "")
	const [link, setLink] = useState(advert?.link || "")
	const [duration, setDuration] = useState(advert?.duration || "")
	const [message, setMessage] = useState(advert?.message || "")
	const [email, setEmail] = useState(advert?.email || "")
	const [audience, setAudience] = useState(advert?.audience || "")
	const [action, setAction] = useState(advert?.action || "")
	const [loading, setLoading] = useState(false)
	const author = useRecoilValue(UserAtom)
	const [notication, setNotication] = useState(false)
	const [msg, setMsg] = useState("")
	const [link2, setLink2] = useState("")


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

	const handleSubmit = async () => {
		setLoading(true)
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(CREATE_ADVERT),
				variables: {
					author: author.id,
					message: message,
					caption: caption,
					action: action,
					link: link,
					duration: duration,
					email: email,
					imageFile: previewImages,
				},
			})
			setMsg("Advert Created Successfully!")
			setLink2(`/${data.data.createdAd.__typename}?page=${data.data.createdAd._id}`)
			setNotication(true)
			console.log(data)
			handelClick()
			setMessage("")
			setCaption("")
			setAudience("")
			setLink("")
			setAction("")
			setEmail("")
			setDuration("")
			setLoading(true)
			setFilePreview([])
		} catch (error) {
			console.log(error.response)
			toast.warn("Oops something happened")
		}
	}
	const handleEdit = async () => {
		setLoading(true)
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(UPDATE_ADVERT),
				variables: {
					authorId: author.id,
					message: message,
					caption: caption,
					action: action,
					link: link,
					duration: duration,
					email: email,
					imageFile: previewImages,
					advertId: advert._id,
				},
			})
			setMsg("Advert Edited Successfully!")
			setLink2(`/${data.data.updateAd.__typename}?page=${data.data.updateAd._id}`)
			setNotication(true)
			console.log(data)
			handelClick()
			setMessage("")
			setCaption("")
			setAudience("")
			setLink("")
			setAction("")
			setEmail("")
			setDuration("")
			setLoading(true)
			setFilePreview([])
		} catch (error) {
			console.log(error)
			toast.warn("Oops something happened")
		}
	}
	const handleDelSelected = (index) => {
		setFilePreview((prev) => {
			const newPreviewImages = [...prev];
			newPreviewImages.splice(index, 1);
			return newPreviewImages;
		});
	};

	return (
		<>
			<Modal open={open} onClose={handelClick}>
				<Modal.Header>
					<div className="border-b border-gray-200 p-3 w-full">
						<Modal.Title>Create Product</Modal.Title>
					</div>
				</Modal.Header>
				{/* <Modal.Body> */}
				<div className="bg-gray-200 w-full p-4 text-center relative">
					<input type="file" ref={uploadRef} multiple={true} className="d-none" onChange={handleImage} />
					<img onClick={() => uploadRef.current?.click()} src="/images/home/icons/ant-design_camera-outlined.svg" className="w-20 h-20 mx-auto" alt="" />
					<div className="text-base my-3">Upload Product Cover Image</div>
					<div className="text-sm my-2 text-gray-800">Cover image should be minimum of 500pxl/width</div>
				</div>
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
				<div className="mt-2">
					<div className="text-sm my-1">Caption</div>
					<input value={caption} type="text" onChange={(e) => setCaption(e.target.value)} className="p-1 border border-gray-700 w-full rounded-sm" />
				</div>
				<div className="mt-2">
					<div className="text-sm my-1">Message</div>
					<textarea value={message} onChange={(e) => setMessage(e.target.value)} className="p-1 border border-gray-700 w-full h-20 rounded-sm" />
				</div>
				<div className="flex justify-between mt-2">
					{/* <div className="w-[45%]">
						<div className="text-sm my-1">Email</div>
						<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border border-gray-700 text-sm" />
					</div> */}
					<div className="w-[45%] text-sm">
						<div className="text-sm my-1">Website/Email/ Phone No</div>
						<input value={link} onChange={(e) => setLink(e.target.value)} type="text" className="w-full border border-gray-700 text-sm" />
					</div>
					<div className="w-[45%] text-sm">
						<div className="text-sm my-1">Duration</div>
						<input value={duration} onChange={(e) => setDuration(e.target.value)} type="text" className="w-full border border-gray-700 text-sm" />
					</div>
				</div>
				<div className="flex justify-between mt-2">
					{/* <div className="w-[45%]">
						<div className="text-sm my-1">Phone number</div>
						<input type="number" className="w-full border border-gray-700 text-sm" />
					</div> */}

				</div>
				<div className="flex justify-between mt-2">
					<div className="w-[45%] text-sm">
						<div className="text-sm my-1">Call to action</div>
						<select onChange={(e) => setAction(e.target.value)} name="" id="" className="w-full border border-gray-700 text-sm">
							<option value="Book now">Book now</option>
							<option value="Call us">Call us</option>
							<option value="Learn More">Learn More</option>
							<option value="Email us">Email us</option>
							<option value="Apply Now">Apply Now</option>
						</select>
					</div>
				</div>
				{/* </Modal.Body> */}
				<Modal.Footer>
					{advert === null ? (
						<button onClick={handleSubmit} className="p-1 bg-warning text-white rounded-md w-44 my-4">
							{loading ? "Loading..." : "Create Product"}
						</button>
					) : (
						<button onClick={handleEdit} className="p-1 bg-warning text-white rounded-md w-44 my-4">
							{loading ? "Loading..." : "Update Product"}
						</button>
					)}
				</Modal.Footer>
			</Modal>
			<ToastContainer />
			{
				notication && <NotificationCard hide={notication} msg={msg} link={link2} close={() => setNotication(!notication)} />
			}
		</>
	)
}
export default CreateAdvert
