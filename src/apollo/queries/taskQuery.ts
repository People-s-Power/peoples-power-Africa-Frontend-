import { gql } from "@apollo/client"

export const GET_TASKS = gql`
  query tasks($orgId: ID!, $page: Int!, $limit: Int!){
    tasks(orgId: $orgId, page: $page, limit: $limit){
      tasks{
        name
        dueDate
        _id
        dueTime
        createdAt
        instruction
        asset{
          url
          type
        }
        author{
          _id
          name
          image
        }
        prof{
          _id
          name
          image
        }
        assigne{
          _id
          name
          image
        }
        status
        
      }
    }
  }
`

export const NEW_TASK = gql`
  mutation createTask($CreateTaskInput: CreateTaskInput!){
    createTask(createTaskInput: $CreateTaskInput){
      name
      dueDate
      instruction
      dueTime
    }
  } 
`

export const UPDATE_TASK = gql`
  mutation updateTask($UpdateTaskInput: UpdateTaskInput!){
    updateTask(updateTaskInput: $UpdateTaskInput){
      name
      dueDate
      instruction
      dueTime
    }
  } 
`

export const REMOVE_TASK = gql`
  mutation removeTask($id: ID!){
    removeTask(id: $id){
      name
      dueDate
      instruction
      dueTime
    }
  } 
`
