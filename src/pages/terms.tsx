import React, { Fragment } from "react";
import FrontLayout from "layout/FrontLayout";
import Head from "next/head";
import { GetStaticProps, NextPage } from "next";
import { apolloStrapi } from "apollo";
import gql from "graphql-tag";
import ReactMarkdown from "react-markdown";

// interface IProps {
// 	terms: {
// 		body: string;
// 	};
// }
const TermsAndConditionPage = () => {

	return (
		<Fragment>
			<Head>
				<title>Terms And Conditions</title>
			</Head>
					<FrontLayout showFooter={false}>

				<div className="text-center py-4">
					{/* <ReactMarkdown>{terms?.body}</ReactMarkdown> */}
					<iframe width="100%" height="3500" src="https://docs.google.com/document/d/e/2PACX-1vSZxnjx1NPklNew0-ytqATLRRZBl97ei6RQ_QgopAERLYPDAPABdJrm50U0hePA7F5T7vJ5PJdqlyNZ/pub?embedded=true"></iframe>
				</div>
			</FrontLayout>
		</Fragment>
	);
};

export default TermsAndConditionPage;
