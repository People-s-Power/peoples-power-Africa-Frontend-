import React from "react";
import styled from "styled-components";
import { Strapi_Lawyer } from "types/Applicant.types";

const LegalReprensentatives = ({
	lawyer,
}: {
	lawyer: Strapi_Lawyer;
}): JSX.Element => {
	return (
		<Wrapper className=" ">
			<div className="card rep-card  rounded-0">
				<img src={lawyer?.image?.url} className="card-img" alt="" />
				<div className="overlay fade-in-out ">
					<div className="inner">
						<div className="inner-wrapper">
							<p className="mb-1 fs-3 fw-bold">{lawyer?.name}</p>
							<p className="mb-3 fs-5">{lawyer?.state}</p>

							<div className="rep-icons mt-5 mb-3 ">
								<div className="socials d-flex gap-3 justify-content-start">
									<a
										href={`https://twitter.com/${lawyer?.socials?.twitter}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<i className="fab fa-twitter"></i>
									</a>
									<a
										href={`https://instagram.com/${lawyer?.socials?.instagram}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<i className="fab fa-instagram"></i>
									</a>
									<a
										href={`https://linkedin.com/in/${lawyer?.socials?.instagram}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<i className="fab fa-linkedin"></i>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Wrapper>
	);
};

export default LegalReprensentatives;

const Wrapper = styled.div`
	.rep-card {
		position: relative;
		img {
			width: 100%;
			height: 20rem;
			object-fit: cover;
		}
		&:hover {
			.overlay {
				opacity: 1;
				background: rgba(0, 64, 28, 0.57);
				backdrop-filter: blur(5px);
			}
		}
		.overlay {
			position: absolute;
			display: flex;
			align-items: end;
			box-sizing: border-box;
			opacity: 0;
			transition: 0.5s ease-in-out;
			.inner {
				width: 100%;
				padding: 1rem 2rem;
				p {
					margin: 0;
					line-height: 1;
					color: white;
				}
				a {
					text-decoration: none;
					background-color: #fff;
					height: 2.5rem;
					width: 2.5rem;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
				}
				.socials {
					justify-content: space-between;
					i {
						width: 37px;
						height: 37px;
						background: #f5f6fa;
						border-radius: 100%;
						color: rgba(0, 64, 28, 0.57);
						display: flex;
						justify-content: center;
						align-items: center;
						transition-duration: 0.5s;
						&:hover {
							background: #f5a60e;
							color: #ffffff;
						}
					}
				}
			}
		}
	}
`;
