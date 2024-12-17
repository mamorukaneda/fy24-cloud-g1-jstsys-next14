import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { fetchAuthSession } from 'aws-amplify/auth'

import outputs from "../amplify_outputs.json"

export const execLambda = async () => {
    const { credentials } = await fetchAuthSession();
    const awsRegion = outputs.auth.aws_region
    const functionName = outputs.custom.helloWorldFunctionName
    const labmda = new LambdaClient({ credentials: credentials, region: awsRegion })
    const command = new InvokeCommand({
      FunctionName: functionName,
    });
    const apiResponse = await labmda.send(command);
    
    if (apiResponse.Payload) {
      return JSON.parse(new TextDecoder().decode(apiResponse.Payload))
    } else {
      return null;
    }
}

export default execLambda;
