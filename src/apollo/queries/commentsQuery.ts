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
  mutation removeReply($authorId: ID!, $commentId: ID!, $replyId: ID!){
    removeReply(authorId: $authorId, commentId: $commentId, replyId: $replyId){
      _id
    }
  }
`
export const LIKE_REPLY = gql`
  mutation likeandUnlikeReply($authorId: ID!, $commentId: ID!, $replyId: ID!){
    likeandUnlikeReply(authorId: $authorId, commentId: $commentId, replyId: $replyId)
  }
`
export const EDIT_COMMENT = gql`
  mutation editComment($authorId: ID!, $commentId: ID!, $content: String!){
    editComment(authorId: $authorId, commentId: $commentId, content: $content){
      _id
    }
  }
`
export const EDIT_REPLY = gql`
  mutation editReply($authorId: ID!, $commentId: ID!, $content: String!, $replyId: ID!){
    editReply(authorId: $authorId, commentId: $commentId, content: $content, replyId: $replyId)
    
  }
`

