import React, { useEffect, useState } from "react";
import { Strapi_Single_Campaign } from "types/Applicant.types";

const CampaignBanner = ({
	campaignBanner,
}: {
	campaignBanner: Strapi_Single_Campaign;
}): JSX.Element => {
	const endDate = new Date(campaignBanner?.end_date);
	const [countDown, setCountDown] = useState({
		d: 0,
		h: 0,
		m: 0,
		s: 0,
	});

	useEffect(() => {
		setInterval(function () {
			const now = new Date().getTime();

			const distance = (endDate as unknown as number) - now;

			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
			);
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			setCountDown({
				d: days,
				h: hours,
				m: minutes,
				s: seconds,
			});
		}, 1000);
	}, []);

	return (
		<section
			className="camp-category "
			style={{ background: `url(${campaignBanner?.image?.url}) no-repeat` }}
		>
			<div className="_camp-category">
				<div className="wrapper">
					<p className="text-center fs-2 fw-bold text-light  font-weight-bolder mb-4">
						Reveal the identity of the imposter called <br /> Mr President
					</p>
					<div className="time-boxes">
						<div className="box py-2 d-flex flex-column align-items-center justify-content-center">
							<p
								className="font-weight-bold m-0"
								style={{ fontSize: "1.2rem" }}
							>
								{countDown.d}
							</p>
							<p className="text-muted mb-0 fw-bold fs-6">Days</p>
						</div>
						<div className="box py-3 d-flex flex-column align-items-center justify-content-center">
							<p
								className="font-weight-bold m-0"
								style={{ fontSize: "1.2rem" }}
							>
								{countDown.m}
							</p>
							<p className="text-muted mb-0 fw-bold fs-6">Minutes</p>
						</div>
						<div className="box d-flex py-3 flex-column align-items-center justify-content-center">
							<p
								className="font-weight-bold m-0"
								style={{ fontSize: "1.2rem" }}
							>
								{countDown.s}
							</p>
							<p className="text-muted mb-0 fw-bold fs-6">Seconds</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CampaignBanner;
