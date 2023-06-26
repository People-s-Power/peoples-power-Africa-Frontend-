import React from "react"
import { Modal } from "rsuite"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import { CREATE_VICTORIES, UPDATE_VICTORIES } from "apollo/queries/victories"
import { useRouter } from "next/router"
import NotificationCard from "components/NotificationCard"

const CreateVictories = ({ open, handelClick, victory }: { open: boolean; handelClick(): void; victory: any }): JSX.Element => {
	const author = useRecoilValue(UserAtom)
	const [loading, setLoading] = useState(false)
	const [body, setBody] = useState(victory?.body || "Congratulations to all who supported our petition to achieve its campaign goal and getting a massive victory. Our petition has just won. Let’s keep making the change that we need.")
	const router = useRouter()
	const [notication, setNotication] = useState(false)
	const [msg, setMsg] = useState("")
	const [link, setLink] = useState("")

	const handelSubmit = async () => {
		setLoading(true)
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(CREATE_VICTORIES),
				variables: {
					authorId: author.id,
					body: body,
					imageFile: ["https://media.tenor.com/AyG5njrbcGIAAAAM/animated-cute.gif"],
				},
			})
			console.log(data)
			setLoading(false)
			setLink(`/${data.data.createVictory.__typename}?page=${data.data.createVictory._id}`)
			setMsg("Victory Created Successfully!")
			setNotication(true)
			handelClick()
		} catch (err) {
			console.log(err)
			setLoading(false)
		}
	}
	const handelUpdate = async () => {
		setLoading(true)
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(UPDATE_VICTORIES),
				variables: {
					victoryId: victory._id,
					authorId: author.id,
					body: body,
					imageFile: ["https://media.tenor.com/AyG5njrbcGIAAAAM/animated-cute.gif"],
				},
			})
			console.log(data)
			setLoading(false)
			setLink(`/${data.data.updateVictory.__typename}?page=${data.data.updateVictory._id}`)
			setMsg("Victory Edited Successfully!")
			setNotication(true)
			handelClick()
		} catch (err) {
			console.log(err)
			setLoading(false)
		}
	}
	return (
		<>
			<Modal open={open} onClose={handelClick}>
				<Modal.Header>
					<div className="border-b border-gray-200 p-3 w-full">
						{
							victory === null ? <Modal.Title>Celebrate Victory</Modal.Title> : <Modal.Title>Edit Victory</Modal.Title>
						}
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
						placeholder="Let your supporters congratulate you on this Victory..."
					></textarea>
				</Modal.Body>

				<Modal.Footer>
					<div className="flex justify-between text-gray-500">
						{victory === null ? (
							<button onClick={handelSubmit} className="p-1 bg-warning text-white rounded-sm w-40">
								{loading ? "Loading..." : "Celebrate Victory"}
							</button>
						) : (
							<button onClick={handelUpdate} className="p-1 bg-warning text-white rounded-sm w-40">
								{loading ? "Loading..." : "Edit Victory"}
							</button>
						)}
					</div>
				</Modal.Footer>
			</Modal>
			{
				notication && <NotificationCard hide={notication} msg={msg} link={link} close={() => setNotication(!notication)} />
			}
		</>
	)
}

export default CreateVictories
