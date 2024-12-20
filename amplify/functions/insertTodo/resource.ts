import { defineFunction } from '@aws-amplify/backend'

export const insertTodo = defineFunction({
  name: 'insertTodo',
  entry: './handler.ts',
  environment: {
    TODO_TABLE_NAME: 'Todo-dsx6qs3fcvbxfmgki4vviedldi-NONE'
  }
})
