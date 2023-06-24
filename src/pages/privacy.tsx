import FrontLayout from "layout/FrontLayout";
import React, { Fragment } from "react";
import Head from "next/head";
import styled from "styled-components";
// import { GetStaticProps, NextPage } from "next";
// import { apolloStrapi } from "apollo";
// import { gql } from "@apollo/client";
// import ReactMarkdown from "react-markdown";

const PrivacyPage = () => {
	return (
		<Fragment>
			<Head>
				<title>Privacy</title>
			</Head>
					<FrontLayout showFooter={false}>

				<Wrapper className="privacy-policy py-5">
					<div className="container">
						<iframe width="100%" height="3500" src="https://docs.google.com/document/d/e/2PACX-1vS9WeduCRmpPm5qsOAe_5cmr51I2nP1UJj7eHa9DjH9oyGBKjsPMrxrhkv2gSbESphBR6e-BllV0Vx8/pub?embedded=true"></iframe>
					</div>
				</Wrapper>
			</FrontLayout>
		</Fragment>
	);
};

export default PrivacyPage;

const Wrapper = styled.div``;
