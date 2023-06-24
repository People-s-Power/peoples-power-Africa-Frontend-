import FrontLayout from "layout/FrontLayout";
import React, { Fragment } from "react";
import styled from "styled-components";
import Head from "next/head";
// import { Strapi_Lawyer } from "types/Applicant.types";
// import { GetStaticProps } from "next";
// import { apolloStrapi } from "apollo";
// import { GET_STRAPI_REPS } from "apollo/queries/strapiQuery";
import UserCardComp from "components/user/UserCard";

const RepsPage = ({ users }: { users: any }): JSX.Element => {
	return (
		<Fragment>
			<Head>
				<title>Our State Reps</title>
			</Head>
			<FrontLayout showFooter={false}>
				<Wrapper className="mt-4 reps">
					<div className="container">
						<h1 className="text-center fw-bold mb-3 ">State Reps</h1>
						<div className="card-wrapper">
							{users?.map((user, i) => (
								<UserCardComp user={user} key={i} />
							))}
						</div>
					</div>
				</Wrapper>
			</FrontLayout>
		</Fragment>
	);
};

export default RepsPage;

const Wrapper = styled.div``;

// export const getStaticProps: GetStaticProps = async () => {
// 	try {
// 		const { data } = await apolloStrapi.query({
// 			query: GET_STRAPI_REPS,
// 		});
// 		const users = data?.reps;
// 		return {
// 			props: {
// 				users,
// 			},
// 		};
// 	} catch (error) {
// 		console.log(error);
// 		return {
// 			props: {
// 				users: [],
// 			},
// 		};
// 	}
// };
