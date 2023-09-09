import { gql } from "@apollo/client"

export const GET_ALL = gql`
	mutation timeline($authorId: ID!, $page: Int, $limit: Int) {
		timeline(authorId: $authorId, page: $page, limit: $limit) {
			adverts {
				_id
				caption
				message
				email
				duration
				link
				action
				image
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
					
					replies{
						 _id
					content
					authorName
					authorId
					authorImage
					authorEmail
					
					}
					likes
					createdAt
				}
				__typename
				shares
				author {
					_id
					email
					image
					description
					name
				}
				createdAt
				updatedAt
			}

			victories {
				_id
				body
				image
				asset{
      url
      type
    }
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
					description
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
					likes
					}
					likes
					createdAt
				}
			}

			petitions {
				aim
				addedFrom
				author {
					_id
					name
					email
					description
					image
				}
				body
				category
				asset{
      url
      type
    }
				createdAt
				__typename
				endorsements {
					body
				}
				excerpt
				_id
				image
				likes {
					_id
					name
					email
					image
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
					likes
					}
					likes
					createdAt
				}
				numberOfPaidEndorsementCount
				numberOfPaidViewsCount
				promoted
				slug
				status
				target
				title
				updatedAt
				views
			}

			posts {
				_id
				body
				createdAt
				image
				asset{
					url
					type
    		}
				categories
				likes {
					_id
					name
					email
					image
				}
				shares
				__typename
				author {
					name
					email
					image
					_id
					description
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
					likes
					}
					likes
					createdAt
				}
				isPetition
			}

			updates {
				body
				_id
				asset{
					url
					type
				}
				petition {
					_id
					title
					asset{
						url
						type
					}
					image
					excerpt
					aim
					target
					body
					slug
					status
					createdAt
					updatedAt
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
					addedFrom
					numberOfPaidViewsCount
					numberOfPaidEndorsementCount
					endorsements {
						id
						body
						author {
							id
							name
							email
							image
						}
					}
					likes {
						_id
						name
						email
						image
					}
					promoted
					views
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
					category
					region
					author {
						_id
						name
						email
						image
					}
				}
				image
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
					likes
					}
					likes
					createdAt
				}
				likes {
					_id
					name
					email
					image
				}
				shares
				author {
					_id
					name
					description
					email
					image
				}
				__typename
			}

			events {
				_id
				asset{
					url
					type
				}
				audience
				author {
					_id
					name
					email
					image
					description
				}
				interested{
					_id
					image
					email
					name
					__typename
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
					likes
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
				type
			}
		}
	}
`

export const GET_ALL_USERS = gql`
	query {
		getUsers {
			id
			name
			accountType
			image
			email
			isActive
			country
			state
			phone
			address
		}
	}
`

export const CONNECTIONS = gql`
	mutation connections($authorId: ID!) {
		connections(authorId: $authorId) {
			name
			image
			_id
			followers
			description
		}
	}
`
export const FOLLOWERS = gql`
	query getUserFollowers($userId: String!) {
		getUserFollowers(userId: $userId) {
			name
			image
			_id
			followers
			description
		}
	}
`
export const FOLLOWING = gql`
	query getUserFollowing($userId: String!) {
		getUserFollowing(userId: $userId) {
			name
			image
			_id
			followers
			description
		}
	}
`

export const COMMENT = gql`
	mutation comment($authorId: ID!, $itemId: ID!, $content: String!) {
		comment(authorId: $authorId, itemId: $itemId, content: $content) {
			_id
			content
		}
	}
`

export const FOLLOW = gql`
	mutation follow($followerId: ID!, $followId: ID!) {
		follow(followerId: $followerId, followId: $followId)
	}
`

export const UNFOLLOW = gql`
	mutation unfollow($followerId: ID!, $unfollowId: ID!) {
		unfollow(followerId: $followerId, unfollowId: $unfollowId)
	}
`

export const LIKE = gql`
	mutation like($authorId: ID!, $itemId: ID!) {
		like(authorId: $authorId, itemId: $itemId)
	}
`

export const SHARE = gql`
	mutation share($authorId: ID!, $itemId: ID!) {
		share(authorId: $authorId, itemId: $itemId) {
			posts {
				_id
				body
			}
			adverts {
				_id
				message
			}
			petitions {
				_id
				title
			}
			events {
				_id
				name
			}
			victories {
				_id
				body
			}
		}
	}
`

export const VIEW = gql`
mutation view($authorId: ID!, $itemId: ID!){
  view(authorId: $authorId, itemId: $itemId)
}`

export const HIDE = gql`
mutation hideFor($authorId: ID!, $itemId: ID!){
  hideFor(authorId: $authorId, itemId: $itemId)
}`

export const UNHIDE = gql`
mutation unhide($authorId: ID!, $itemId: ID!){
  unhide(authorId: $authorId, itemId: $itemId)
}`

// export const UNLIKE = gql
// `mutation like($authorId: ID!, $itemId: ID!){
//   like(authorId: $authorId, itemId: $itemId)
// }`


export const UPDATES = gql`
	query getUpdate($id: ID!) {
		getUpdate(id: $id) {
				body
				_id
				asset{
					url
					type
				}
				petition {
					_id
					title
					asset{
						url
						type
					}
					image
					excerpt
					aim
					target
					body
					slug
					status
					createdAt
					updatedAt
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
					addedFrom
					numberOfPaidViewsCount
					numberOfPaidEndorsementCount
					endorsements {
						id
						body
						author {
							id
							name
							email
							image
						}
					}
					likes {
						_id
						name
						email
						image
					}
					promoted
					views
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
					category
					region
					author {
						_id
						name
						email
						image
					}
				}
				image
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
					likes
					}
					likes
					createdAt
				}
				likes {
					_id
					name
					email
					image
				}
				shares
				author {
					_id
					name
					description
					email
					image
				}
				__typename
			}
	}
`