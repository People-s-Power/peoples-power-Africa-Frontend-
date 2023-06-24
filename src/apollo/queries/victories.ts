import { gql } from "@apollo/client"

export const MY_VICTORIES = gql`
	query myVictories($authorId: ID!) {
		myVictories(authorId: $authorId) {
			_id
			body
			image
			views
			likes {
				name
				_id
			}
			__typename
			shares
			updatedAt
			createdAt
			author {
				_id
				email
				image
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
		}
	}
`
export const CREATE_VICTORIES = gql`
	mutation createVictory($authorId: ID!, $body: String!, $imageFile: [String!]!) {
		createVictory(authorId: $authorId, body: $body, imageFile: $imageFile) {
			_id
			body
			__typename
		}
	}
`

export const UPDATE_VICTORIES = gql`
	mutation updateVictory($authorId: ID!, $body: String!, $imageFile: [String!]!, $victoryId: String!) {
		updateVictory(authorId: $authorId, body: $body, imageFile: $imageFile, victoryId: $victoryId) {
			_id
			body
			__typename
		}
	}
`
export const DELETE_VICTORIES = gql`
	mutation removeVictory($id: ID!) {
		removeVictory(id: $id) {
			_id
			body
		}
	}
`
export const VICTORY = gql`
	query victory($id: ID!) {
		victory(id: $id) {
			_id
			body
			image
			likes {
				name
				_id
			}
			__typename
			shares
			updatedAt
			createdAt
			author {
				_id
				email
				image
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
		}
	}
`