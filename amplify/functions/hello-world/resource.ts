import { defineFunction } from '@aws-amplify/backend';

export const helloWorld  = defineFunction({
    name: 'hello-world',
    entry: './handler.ts',
    timeoutSeconds: 30,
    runtime: 20,
  });