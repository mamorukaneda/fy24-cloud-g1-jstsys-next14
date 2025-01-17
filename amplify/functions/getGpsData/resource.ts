import { defineFunction } from '@aws-amplify/backend'

export const getGpsData = defineFunction({
  name: 'getGpsData',
  entry: './handler.ts',
})
