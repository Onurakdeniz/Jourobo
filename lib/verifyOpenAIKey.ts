
import * as jose from "jose";
import prisma from "@/lib/prisma";

const publicJWK = JSON.parse(process.env.ECDSA_PUBLIC_KEY || "{}");

async function initializeOpenAIClientForTask(taskId: string) {
    try {
      // Retrieve the task along with its linked LLMRun and Agent
      const taskWithLLMRunAndAIModel = await prisma.task.findUnique({
        where: {
          id: taskId,   
        },
        include: {
          LLMRun: {
            include: {
              AIModel: true, // Include the AIModel to access the apiKey
            },
          },
          Agent: true, // Include the Agent to access the userName
        },
      });
  
      if (
        !taskWithLLMRunAndAIModel ||
        !taskWithLLMRunAndAIModel.LLMRun ||
        !taskWithLLMRunAndAIModel.LLMRun.AIModel ||
        !taskWithLLMRunAndAIModel.LLMRun.AIModel.apiKey ||
        !taskWithLLMRunAndAIModel.Agent
      ) {
        throw new Error(
          "AI model, API key, or Agent not found for the specified task."
        );
      }
  
      const { apiKey } = taskWithLLMRunAndAIModel.LLMRun.AIModel;
      const databaseUserName = taskWithLLMRunAndAIModel.Agent.userName; // UserName from the database
  
      // Import the public key for JWT verification
      const publicKey = await jose.importJWK(publicJWK, "ES256");
  
      // Verify the tokenized API key
      const verifiedResult = await jose.jwtVerify(apiKey, publicKey, {
        issuer: "robojou",
        audience: "userOpenAIKeys",
      });
  
      // Extract userName from the verified JWT payload
      const tokenUserName = verifiedResult.payload.userName as string;
  
      // Check if the userName from the payload matches the userName associated with the task's agent
      if (tokenUserName !== databaseUserName) {
        throw new Error(
          "The userName from the token does not match the task's agent userName."
        );
      }
  
      // Return the verified API key
      return apiKey as string;
    } catch (error) {
      console.error("Failed to initialize OpenAI client for the task:", error);
      throw new Error("Initialization of OpenAI client for task failed.");
    }
  }