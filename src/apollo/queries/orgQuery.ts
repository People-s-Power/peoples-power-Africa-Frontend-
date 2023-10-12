import gql from "graphql-tag"

export const CREATE_ORG = gql`
	mutation createOrg($CreateOrgInput: CreateOrgInput!) {
		createOrg(input: $CreateOrgInput) {
			name
			email
			phone
			website
			description
			_id
		}
	}
`

export const UPDATE_ORG = gql`
	mutation updateOrganization($UpdateInput: UpdateInput!) {
		updateOrganization(input: $UpdateInput) {
			name
			email
			phone
			website
			description
		}
	}
`

export const GET_ORGANIZATIONS = gql`
	query getUserOrganizations($ID: ID!) {
		getUserOrganizations(id: $ID) {
			_id
			image
			author
			name
			email
			description
			phone
			followers
			following
			followers
			following
			operators {
				role
			}
			facebook
			linkedIn
			instagram
			twitter
			country
			city
			website
			__typename
		}
	}
`

export const GET_ORGANIZATION = gql`
	query getOrganzation($ID: ID!) {
		getOrganzation(id: $ID) {
			_id
			image
			author
			name
			email
			description
			phone
			followers
			following
			followers
			following
			operators {
				role
				userId
			}
			facebook
			linkedIn
			instagram
			twitter
			country
			city
			website
			__typename
		}
	}
`

export const ADD_OPERATOR = gql`
	mutation addOperator($CreateOperator: CreateOperator!) {
		addOperator(input: $CreateOperator) {
			image
			operators {
				role
				userId
			}
		}
	}
`
export const DELETE_OPERATOR = gql`
	mutation deleteOperator($DeleteOperator: DeleteOperator!) {
		deleteOperator(input: $DeleteOperator) {
			image
			operators {
				role
				userId
			}
		}
	}
`
export const DELETE_ORG = gql`
	mutation deleteOrganization($id: ID!) {
		deleteOrganization(id: $id) {
			image
			_id
		}
	}
`
export const EDIT_OPERATOR = gql`
	mutation editOperator($CreateOperator: CreateOperator!) {
		editOperator(input: $CreateOperator) {
			image
			_id
			operators {
				userId
				role
			}
		}
	}
`
export const ACTIVITIES = gql`
	query getOrgActivities($page: Int!, $limit: Int!, $orgId: ID!){
    getOrgActivities(page: $page, limit: $limit, orgId: $orgId){
			activities{
				text
				authorId{
					name
					image
				}
				
			}
		}
  }
`