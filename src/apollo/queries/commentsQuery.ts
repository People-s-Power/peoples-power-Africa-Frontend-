import { gql } from "@apollo/client"

export const LIKE_COMMENT = gql`
  mutation likeandUnlikeComment($authorId: ID!, $commentId: ID!){
    likeandUnlikeComment(authorId: $authorId, commentId: $commentId)
  }
`
export const REMOVE_COMMENT = gql`
  mutation removeComment($authorId: ID!, $commentId: ID!, $itemId: ID!){
    removeComment(authorId: $authorId, commentId: $commentId, itemId: $itemId)
  }
`
export const REPLY_COMMENT = gql`
  mutation replyComment($authorId: ID!, $commentId: ID!, $content: String!){
    replyComment(authorId: $authorId, commentId: $commentId, content: $content){
      _id
    }
  }
`
export const REMOVE_REPLY = gql`
  mutation replyComment($authorId: ID!, $commentId: ID!, $replyId: ID!){
    replyComment(authorId: $authorId, commentId: $commentId, replyId: $replyId)
  }
`
export const LIKE_REPLY = gql`
  mutation likeandUnlikeReply($authorId: ID!, $commentId: ID!, $replyId: ID!){
    likeandUnlikeReply(authorId: $authorId, commentId: $commentId, replyId: $replyId)
  }
`
