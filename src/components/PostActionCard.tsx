import React from "react"
import PropTypes, { InferProps } from "prop-types"

const PostActionCardProp = {
	authorImage: PropTypes.string,
	handelClick: PropTypes.func.isRequired,
	handelEventClick: PropTypes.func.isRequired,
	handelPetition: PropTypes.func.isRequired,
	handelOpenFindExpart: PropTypes.func.isRequired,
	count: PropTypes.any,
	refresh: PropTypes.func,
	hashtag: PropTypes.string,
}

export default function PostActionCard({
	authorImage,
	handelClick,
	handelEventClick,
	handelPetition,
	handelOpenFindExpart,
	count,
	refresh,
	hashtag
}: InferProps<typeof PostActionCardProp>): JSX.Element {
	return (
		<div className="border-b border-gray-300">
			{hashtag && <div className="flex gap-3 px-3 py-2 mb-3 border-b border-b-zinc-200">
				<div className="lg:w-32 lg:h-32 w-20 h-20 flex justify-center lg:ml-20 items-center rounded-full border border-zinc-400 text-4xl font-bold">#</div>
				<div className="text lg:mt-10">
					<h1 className="text-2xl font-semibold">#{hashtag || "Social Policy"}</h1>
					<p className="text-sm text-zinc-400 my-1">202240</p>
					<div className="the-hash hidden">{hashtag}</div>
					<button className="text-white bg-warning p-3 py-2 rounded">+ Follow</button>
				</div>
			</div>}
			<div className="flex justify-center">
				<img src={authorImage ? authorImage : ""} className="w-14 h-14 mx-4 rounded-full" alt="" />
				<div onClick={() => handelPetition()} className="p-3 pl-8 rounded-full w-[80%] border border-black text-sm cursor-pointer">
					What are your complaints? Start Petition
				</div>
			</div>
			<div className="flex justify-evenly my-4">
				<div className="flex w-16 justify-between sm:hidden">
					<div onClick={() => handelClick()} className="w-6 cursor-pointer">
						<img className="w-6 h-6 my-auto" src="/images/home/icons/ic_outline-photo-camera.svg" alt="" />
					</div>
					<div onClick={() => handelClick()} className="w-6 cursor-pointer">
						<img className="w-6 h-6 my-auto" src="/images/home/icons/charm_camera-video.svg" alt="" />
					</div>
				</div>
				<div className="flex  cursor-pointer" onClick={() => handelOpenFindExpart()}>
					{/* <img className="w-6 h-6 my-auto" src="/images/home/icons/experts.svg" alt="" /> */}
					<div className="my-auto text-sm ml-3">Find NGO/Activists</div>
				</div>
				<div className="flex  cursor-pointer" onClick={() => handelEventClick()}>
					<img className="w-6 h-6 my-auto" src="/images/home/icons/fe_sitemap.svg" alt="" />
					<div className="my-auto text-sm ml-3">Events</div>
				</div>
				{/* <div className="flex  cursor-pointer" onClick={() => handelPetition()}>
					<img className="w-6 h-6 my-auto" src="/images/home/icons/tabler_article.svg" alt="" />
					<div className="my-auto text-sm ml-3">Start Petition</div>
				</div> */}
			</div>

			{count > 0 && (
				<div
					className="w-40 mx-auto flex justify-evenly text-center text-warning border border-warning rounded-full text-xs p-2 m-1 cursor-pointer"
					onClick={() => refresh()}
				>
					<img src="/images/arrow-up.svg" className="w-3" alt="" />
					{count} New Post
				</div>
			)}
		</div>
	)
}
