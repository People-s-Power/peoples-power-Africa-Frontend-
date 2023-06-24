import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
import { Strapi_Testimony } from "types/Applicant.types";

const TestimonySlide = ({
	testimonies,
}: {
	testimonies: Strapi_Testimony[];
}): JSX.Element => {
	const settings = {
		dots: true,
		infinite: true,
		//   speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		// autoplay: true,
		speed: 500,
		// autoplaySpeed: 2000,
		cssEase: "linear",
	};
	return (
		<div className="p-0 m-0 container">
			<Slider {...settings} className="">
				{testimonies?.map((testimony, i) => (
					<SlideComp testimony={testimony} key={i} />
				))}
			</Slider>
		</div>
	);
};

export default TestimonySlide;

const SlideComp = ({ testimony }: { testimony: Strapi_Testimony }) => {
	return (
		<Wrapper className="slidecontainer px-3 m-0">
			<div className="container wrapper">
				<img
					src={'/images/'+testimony?.image}
					alt=""
					className="mx-auto mb-3 rounded-circle"
					width="105"
					height="150"
				/>
				<p className="side-txt mb-4 text-center">{testimony?.body}</p>
				<div className=" info">
					<p className="text-center _p1 m-0 fs-4 text-bold">{testimony?.author}</p>
					<p className="text-center _p2 mb-0 fw-bold fs-5">
						{testimony?.company}
					</p>
					<p className="text-center _p3 ">{testimony?.job_position}</p>
				</div>
			</div>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	.info {
		p {
			line-height: 0.8;
			text-align: center;
		}
	}
	.wrapper {
		width: 100%;
		max-width: 40rem;
		margin: auto;
	}
	._p3 {
		font-size: 0.9rem;
	}
`;
