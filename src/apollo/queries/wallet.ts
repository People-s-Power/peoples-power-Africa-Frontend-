import { gql } from "@apollo/client"

export const GET_WALLET = gql`
  query wallet($id: String! ){
    wallet(id: $id){
      balance
      userId{
        _id
        name
      }
    }
  }
`

export const GET_TRANSACTIONS = gql`
  query walletTx($userId: ID!, $page: Int!, $limit: Int!){
    walletTx(userId: $userId, page: $page, limit: $limit){
      tx{
        amount
        currency
        paymentMethod
        status
        walletId
        isInflow
      }
    }
  }
`