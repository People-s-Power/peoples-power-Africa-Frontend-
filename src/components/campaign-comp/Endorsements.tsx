import { UserAtom } from "atoms/UserAtom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import * as timeago from "timeago.js";
import { IEndorsement } from "types/Applicant.types";

const Endorsements = ({
	endorsement,
}: {
	endorsement: any;
}): JSX.Element => {
	const user = useRecoilValue(UserAtom);
	// const [isLiked, setIsLiked] = useState(false);

	// const handleLike = async () => {
	// 	if (!user) {
	// 		return alert("Please login to continue");
	// 	}
	// 	try {
	// 		const { data } = await axios.post("/endorsement/like", {
	// 			id: endorsement?.id,
	// 		});
	// 		setIsLiked(data);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// 	// setIsLiked(true);
	// };

	// useEffect(() => {
	// 	if (endorsement?.likes?.includes(user?.id)) {
	// 		setIsLiked(true);
	// 	} else {
	// 		setIsLiked(false);
	// 	}
	// }, [endorsement, user]);

	return (
		<Wrapper>
			<div className="wrapper">
				<div className="top">
					<img src={endorsement?.authorImage} className="me-2" alt="" />
					<div className=" text-head">
						<b className="d-block mb-0 name  ">
							{endorsement?.authorName}
						</b>
						<small className="mt-0 date small">
							<i>{timeago.format(endorsement?.createdAt)}</i>
						</small>
					</div>
				</div>
				<div className="bottom">
					<ReactMarkdown>{endorsement?.content}</ReactMarkdown>
				</div>
				{/* <hr className="" />
				<div className="d-flex align-items-center  ">
					<a
						className={`btn rounded-circle me-2 like-btn ${
							isLiked ? "bg-sky text-primary" : "text-muted"
						}`}
						onClick={handleLike}
					>
						<i className="fas fa-thumbs-up small"></i>
					</a>
					<span className=" p-0 px-0">
						{endorsement?.likes?.length} Like
						{endorsement?.likes?.length > 1 && "s"}
					</span>
				</div> */}
			</div>
		</Wrapper>
	);
};

export default Endorsements;

const Wrapper = styled.div`
	margin-bottom: 1rem;
	background-color: #fbfbfb;

	width: 100%;
	padding: 1rem;
	font-size: 0.975rem;
	.like-btn {
		&:hover {
			background-color: #ebffeb;
			/* color: #00401c; */
		}
	}
	.wrapper {
		.top {
			display: flex;
			margin-bottom: 0.5rem;
			align-items: center;
			.text-head {
				flex: 1;
			}
			img {
				/* width: 100%; */
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				object-fit: cover;
			}
		}
	}
	.name {
		line-height: 0.7;
	}
`;
