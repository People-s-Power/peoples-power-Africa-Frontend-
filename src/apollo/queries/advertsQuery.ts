import { gql } from "@apollo/client"

export const UPDATE_ADVERT = gql`
	mutation updateAd(
		$authorId: ID!
		$caption: String!
		$message: String!
		$action: String!
		$duration: String!
		$email: String!
		$link: String!
		$assets: [AssetInput!]!		$advertId: ID!
		$country: String!
		$state: String!
	) {
		updateAd(
			authorId: $authorId
			caption: $caption
			assets: $assets			message: $message
			action: $action
			duration: $duration
			email: $email
			link: $link
			advertId: $advertId
			country: $country
			state: $state
		) {
			_id
			caption
			message
			email
			duration
			link
			action
			audience
			image
			shares
			createdAt
			updatedAt
			__typename
		}
	}
`
export const CREATE_ADVERT = gql`
	mutation createdAd(
		$author: ID!
		$caption: String!
		$message: String!
		$action: String!
		$duration: String!
		$email: String!
		$link: String!
		$country: String!
		$state: String!
		$assets: [AssetInput!]!	) {
		createdAd(
			author: $author
			caption: $caption
			assets: $assets			message: $message
			action: $action
			duration: $duration
			email: $email
			link: $link
			country: $country
			state: $state
		) {
			_id
			caption
			message
			email
			duration
			link
			action
			audience
			image
			shares
			createdAt
			updatedAt
			__typename
		}
	}
`
export const MY_ADVERTS = gql`
	query myAdverts($authorId: ID!) {
		myAdverts(authorId: $authorId) {
			_id
			caption
			message
			email
			duration
			link
			action
			image
			views
			asset{
				url
				type
  	  }
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
        date
        replies{
          _id
           _id
        content
        authorName
        authorId
        authorImage
        authorEmail
        date
        }
        likes
        createdAt
      }
			__typename
			author {
				_id
				email
				image
				name
			}
			createdAt
			updatedAt
		}
	}
`
export const ADVERT = gql`
	query advert($advertId: ID!) {
		advert(advertId: $advertId) {
			_id
			caption
			message
			email
			duration
			link
			action
			image
			likes {
				name
			}
			asset{
				url
				type
  	  }
			__typename
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
			createdAt
			updatedAt
		}
	}
`
