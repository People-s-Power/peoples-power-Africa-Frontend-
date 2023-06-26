import Link from "next/link"
import React from "react"
import ReactTimeAgo from "react-time-ago"
import { INTERESTED } from "apollo/queries/eventQuery"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
// import { io } from "socket.io-client"
import { socket } from "pages/_app"

const NotificationComp = ({ item }: { item: any }) => {
	// console.log(item)
	const author = useRecoilValue(UserAtom)
	// const socket = io(SERVER_URL, {
	// 	query: {
	// 		user_id: author?.id,
	// 	},
	// })
	const readNotication = (id: any) => {
		socket.emit('readNotice', {
			userId: author.id,
			noticeId: id,
		}, response =>
			console.log('readNotice:', response),
		);
	}
	function isRead(read) {
		return read.some((obj) => obj === author.id)
	}
	const interested = async (event: any) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(INTERESTED),
				variables: {
					eventId: event.itemId,
					authorId: author.id,
					authorImg: author.image,
					name: author.name,
				},
			})
			console.log(data)
			toast.success("Registered successfully")
		} catch (error) {
			console.log(error)
			toast.warn("Oops an error occoured!")
		}
	}
	return (
		<div onMouseEnter={() => readNotication(item.id)} className="border-b mx-auto border-gray-200 lg:w-[60%] p-3 flex">
			<img src={item.authorImage} className="w-16 h-16 rounded-full my-auto" alt="" />

			<div className="w-10 my-auto">
				{
					isRead(item.readBy) === false ?
						<div className="p-2 h-2 my-auto mx-auto w-2 rounded-full bg-warning"></div>
						: null
				}
			</div>
			<div className="ml-6 my-auto">
				<div className="text-base w-[100%]">{item.message}</div>
				<div>
					{(() => {
						switch (item.event) {
							// case "Created-Advert":
							// 	return (
							// 		<Link href={`Advert?page=${item.itemId}`}>
							// 			<button className="btn text-warning border border-warning p-2 px-20 my-2">View Advert</button>
							// 		</Link>
							// 	)
							case "Created-Victory":
								return (
									<Link href={`/messages?page=${item.authorId}`}>
										<button className="btn text-warning border border-warning p-2 px-20 my-2">Say Congrats</button>
									</Link>
								)
							case "Created-Petition":
								return (
									<Link href={`Petition?page=${item.itemId}`}>
										<button className="btn text-warning border border-warning p-2 px-20 my-2">View Petition</button>
									</Link>
								)
							// case "Created-Post":
							// 	return (
							// 		<Link href={`Post?page=${item.itemId}`}>
							// 			<button className="btn text-warning border border-warning p-2 px-20 my-2">View Post</button>
							// 		</Link>
							// 	)
							case "Created-Event":
								return (
									<Link href={`Event?page=${item.itemId}`}>
										<button className="btn text-warning border border-warning p-2 px-20 my-2">
											Attend Event
										</button>
									</Link>
								)
							case "Created-Follow":
								return (
									<Link href={`user?page=${item.itemId}`}>
										<button className="btn text-warning border border-warning p-2 px-20 my-2">View Profile</button>
									</Link>
								)
						}
					})()}
				</div>
			</div>
			<div className="ml-auto w-32 rounded-md text-xs text-gray-700">
				<ReactTimeAgo date={new Date(item.createdAt)} />
			</div>
			<ToastContainer />
		</div>
	)
}
export default NotificationComp
