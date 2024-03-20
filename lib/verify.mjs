import prisma from "./prisma.js";
import { jwtVerify, importJWK } from 'jose';

 
 

const publicJWK = JSON.parse(process.env.ECDSA_PUBLIC_KEY || '{}');

async function initializeOpenAIClientForTask(taskId)   {
  try {
    // Retrieve the task along with its linked LLMRun, which includes the AIModel and its apiKey
    const taskWithLLMRunAndAIModel = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        LLMRun: {
          include: {
            AIModel: true, // Include the AIModel in the response to access the apiKey
          },
        },
      },
    });

    if (!taskWithLLMRunAndAIModel || !taskWithLLMRunAndAIModel.LLMRun || !taskWithLLMRunAndAIModel.LLMRun.AIModel || !taskWithLLMRunAndAIModel.LLMRun.AIModel.apiKey) {
      throw new Error('AI model or API key not found for the specified task.');
    }

    // Assuming the apiKey is tokenized and needs to be verified
    const apiKeyToken = taskWithLLMRunAndAIModel.LLMRun.AIModel.apiKey;

    // Import the public key for JWT verification
    const publicKey = await importJWK(publicJWK, 'ES256');

    // Verify the tokenized API key
    const verifiedResult = await jwtVerify(apiKeyToken, publicKey, {
      issuer: 'robojou',
      audience: 'userOpenAIKeys',
    });

    // Assuming the verified API key is what you want to use
    return {
      id: 'open-ai',
      apiKey: verifiedResult.payload.apiKey  
    };

  } catch (error) {
    console.error('Failed to initialize OpenAI client for the task:', error);
    throw new Error('Initialization of OpenAI client for task failed.');
  }
}

// Usage example - replace with an actual task ID
const taskId = '3bad30bf-7801-4025-82a4-5a7a347796a8'; 
initializeOpenAIClientForTask(taskId)
  .then(config => {
    console.log('OpenAI client initialized successfully for task with API Key:', config.apiKey);
    // Use `config.apiKey` to make API calls to OpenAI as needed
  })
  .catch(console.error);
 