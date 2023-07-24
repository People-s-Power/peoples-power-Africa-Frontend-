import { gql } from "@apollo/client"

export const GET_EVENTS = gql`
	query events {
		events {
			_id
			audience
			author {
				_id
				name
				email
				image
				description
			}
			asset{
				url
				type
  	  }
			comments{
        _id
        content
        authorName
        authorId
        authorImage
        authorEmail
        
        replies{
          _id
        content
        authorName
        authorId
        authorImage
        authorEmail
        createdAt
        }
        likes
        createdAt
      }
			shares
			description
			startDate
			endDate
			audience
			createdAt
			__typename
			time
			image
			name
			likes {
				name
			}
			interested{
				_id
				image
				email
				name
				__typename
			}
			type
		}
	}
`

export const UPDATE_EVENT = gql`
	mutation updateEvent(
		$authorId: ID!
		$eventId: ID!
		$name: String!
		$description: String!
		$endDate: String!
		$startDate: String!
		$time: String!
		$type: String!
		$country: String!
		$state: String!
		$assets: [AssetInput!]!	) {
		updateEvent(
			name: $name
			description: $description
			endDate: $endDate
			startDate: $startDate
			time: $time
			type: $type
			assets: $assets		
			authorId: $authorId
			eventId: $eventId
			country: $country
			state: $state
		) {
			_id
			audience
			author {
				_id
				name
				email
				image
			}
			description
			startDate
			endDate
			time
			image
			interested{
				_id
				image
				email
				name
				__typename
			}
			name
			type
			__typename
		}
	}
`

export const CREATE_EVENT = gql`
	mutation createEvent(
		$author: ID!
		$name: String!
		$description: String!
		$endDate: String!
		$startDate: String!
		$time: String!
		$type: String!
		$country: String!
		$state: String!
		$assets: [AssetInput!]!		$audience: String!
	) {
		createEvent(
			name: $name
			description: $description
			endDate: $endDate
			startDate: $startDate
			time: $time
			type: $type
			assets: $assets		
			author: $author
			country: $country
			state: $state
			audience: $audience
		) {
			_id
			audience
			author {
				_id
				name
				email
				image
			}
			description
			startDate
			endDate
			time
			image
			interested{
				_id
				image
				email
				name
				__typename
			}
			name
			type
			__typename
		}
	}
`

export const MY_EVENT = gql`
	query authorEvents($authorId: ID!) {
		authorEvents(authorId: $authorId) {
			_id
			audience
			views
			author {
				_id
				name
				email
				image
			}
			asset{
				url
				type
  	  }
			description
			startDate
			endDate
			createdAt
			__typename
			time
			image
			name
			likes {
				name
			}
			comments{
        _id
        content
        authorName
        authorId
        authorImage
        authorEmail
        replies{
          _id
        content
        authorName
        authorId
        authorImage
        authorEmail
        createdAt
        }
        likes
        createdAt
      }
			interested{
				_id
				image
				email
				name
				__typename
			}
			name
			type
		}
	}
`

export const INTERESTED = gql`
	mutation interested($eventId: String!, $authorId: ID!, $authorImg: String!, $name: String!, $email: String!) {
		interested(eventId: $eventId, authorId: $authorId, authorImg: $authorImg, name: $name, email: $email) {
			_id
			name
			description
			time
			image
			type
			audience
			startDate
			endDate
			interested{
				_id
				image
				email
				name
				__typename
			}
			shares
			likes {
				_id
				name
				email
				image
			}
			createdAt
			updatedAt
			author {
				_id
				name
				email
				image
			}
			promoted
		}
	}
`
export const EVENT = gql`
	query event($eventId: ID!) {
		event(eventId: $eventId) {
			_id
			audience
			author {
				_id
				name
				email
				image
			}
			asset{
				url
				type
  	  }
			description
			startDate
			endDate
			createdAt
			__typename
			time
			image
			name
			comments{
        _id
        content
        authorName
        authorId
        authorImage
        authorEmail
        
        replies{
          _id
        content
        authorName
        authorId
        authorImage
        authorEmail
        createdAt
        }
        likes
        createdAt
      }
			likes {
				name
			}
			name
			type
			interested{
				_id
				image
				email
				name
				__typename
			}
		}
	}
`