import { gql } from "@apollo/client";

export const GET_STRAPI_LAWYERS = gql`
	{
		lawyers {
			state
			name
			id
			image {
				url
			}
			socials {
				facebook
				twitter
				linkedin
				instagram
			}
		}
	}
`;

export const GET_STRAPI_REPS = gql`
	{
		reps {
			state
			name
			id
			image {
				url
			}
			socials {
				facebook
				twitter
				linkedin
				instagram
			}
		}
	}
`;

export const GET_STRAPI_SINGLE_CAMPAIGN = gql`
	{
		singleCampaign {
			title
			end_date
			image {
				url
			}
		}
	}
`;

export const GET_STRAPI_TESTIMONIES = gql`
	{
		testimonies {
			author
			company
			job_position
			body
			image {
				url
			}
		}
	}
`;

export const GET_STRAPI_ABOUT = gql`
	{
		about {
			who_we_are
			what_we_do
			what_we_do_image {
				url
			}
			vision
			goal
		}
	}
`;

export const GET_STRAPI_META = gql`
	{
		meta {
			title
			about
			phone
			address
			email
			logo {
				url
			}
			socials {
				facebook
				twitter
				linkedin
				instagram
			}
		}
	}
`;
