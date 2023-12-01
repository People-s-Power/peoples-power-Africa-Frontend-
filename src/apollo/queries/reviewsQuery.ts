import { gql } from "@apollo/client"

export const GET_REVIEWS = gql`
  query reviews($page: Int!, $limit: Int!, $userId: String!){
    reviews(page: $page, limit: $limit, userId: $userId){
      reviews{
        body
        author{
          _id
          name
          image
        }
        rating
        createdAt
      }
    }
  }
`

export const NEW_REVIEW = gql`
  mutation createReview($body: String!, $rating: Int!, $userId: String!, $author: String!){
    createReview(body: $body, rating: $rating, userId: $userId, author: $author){
      body
      rating
      createdAt
    }
  }
`