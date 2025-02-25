import { defineFunction } from '@aws-amplify/backend'

export const getGpsDataWithTime = defineFunction({
  name: 'getGpsDataWithTime',
  entry: './handler.ts',
})
