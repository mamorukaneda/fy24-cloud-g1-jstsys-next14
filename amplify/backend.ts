import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { helloWorld  } from './functions/hello-world/resource';
import { insertTodo  } from './functions/insertTodo/resource';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stack } from "aws-cdk-lib";


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  helloWorld,
  insertTodo,
});
const authenticatedUserIamRole = backend.auth.resources.authenticatedUserIamRole;
backend.helloWorld.resources.lambda.grantInvoke(authenticatedUserIamRole);

backend.addOutput({
  custom: {
    helloWorldFunctionName: backend.helloWorld.resources.lambda.functionName,
  },
});

const todoTable = backend.data.resources.tables["Todo"];
const policy = new Policy(
  Stack.of(todoTable),
  "insertTodoPolicy",
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          'dynamodb:PutItem',
          'dynamodb:DeleteItem',
          'dynamodb:GetItem'
        ],
        resources: ["*"],
      }),
    ],
  }
);
backend.insertTodo.resources.lambda.role?.attachInlinePolicy(policy);