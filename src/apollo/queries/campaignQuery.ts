import { gql } from "@apollo/client";

export const GET_CAMPAIGN = gql`
	query ($slug: String) {
		getCampaign(slug: $slug) {
			title
			id
			target
			status
			body
			image
			asset{
				url
				type
  	  }
			promoted
			aim
			createdAt
			likes
			slug
			category
			authorName
			authorId
			authorImg
		}
	}
`;

export const GET_CAMPAIGNS = gql`
	{
		getCampaigns {
			id
			excerpt
			title
			body
			slug
			views
			image
			asset{
				url
				type
  	  }
			createdAt
			category
			promoted
			endorsements {
				id
			}
			authorName
			authorId
			authorImg
		}
	}
`;

export const GET_ACTIVE_CAMPAIGNS = gql`
	{
		getActiveCampaigns {
			title
			id
			excerpt
			slug
			image
			createdAt
			promoted
			category
			endorsements {
				id
			}
			authorName
			authorId
			authorImg
		}
	}
`;
export const GET_ENDORSEMENTS_BY_CAMPAIGN = gql`
	query ($petition_id: ID) {
		getEndorsementsByPetition(petition_id: $petition_id) {
			id
			createdAt
			body
			likes
			author{
				name
				id
				image
				firstName
				lastName
			}
		}
	}
`;

export const MY_CAMPAIGN = gql`
	{
		myCampaign {
			id
			title
			createdAt
			image
			excerpt
			status
			body
			slug
			asset{
				url
				type
  	  }
			promoted
			category
			views
			endorsements {
				__typename
			}
		}
	}
`;

export const GET_CAMPIGN_NOTICE = gql`
	{
		getCampaignNotice {
			action
			createdAt
			author {
				id
				image
				firstName
			}
			data {
				title
				slug
			}
		}
	}
`;
