// amplify/functions/insertTodo/handler.ts
import { data, type Schema } from "../../data/resource"
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid';
import { generateClient } from 'aws-amplify/data'


export const handler: Schema["insertTodo"]["functionHandler"] = async (event) => {
  // DynamoDBクライアントの初期化
  const client = new DynamoDBClient({})
  const docClient = DynamoDBDocumentClient.from(client)
  const { msg } = event.arguments

  const amplifyClient = generateClient<Schema>()

  try {

    //const newTodo = await amplifyClient.models.Todo.create({
    //  text: msg.msg,
    //  completed: false
    //})

    // 別の方法: 直接DynamoDBにインサート
    const params = {
      TableName: 'Todo-dsx6qs3fcvbxfmgki4vviedldi-NONE', // 環境変数から取得
      Item: {
        id: uuidv4(),
        __typename: 'Todo',
        text: `${msg}`,
        completed: false,
        owner: 'd7d41ac8-10e1-7013-12ac-f81cd2a2263b::d7d41ac8-10e1-7013-12ac-f81cd2a2263b',
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
      }
    }

    await docClient.send(new PutCommand(params))

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: event.arguments,
        todo: { ...params.Item }
      })
    }
  } catch (error) {
    console.error('Error inserting todo:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to insert todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}