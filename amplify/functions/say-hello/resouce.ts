import { defineFunction } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  name: 'say-hello',
  entry: './handler.ts',
//  schedule: 'every 1m',
})