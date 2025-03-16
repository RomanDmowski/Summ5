import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { OpenAI } from "openai";
import { z } from "zod";

const summarizeSchema = z.object({
  text: z.string().min(1, "Text is required").max(10000, "Text is too long"),
});

interface TextAnalysis {
  title: string;
  interestingFacts: string[];
  summary: string;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeText(text: string): Promise<TextAnalysis> {
  try {
    // Step 1: Generate title
    const titleResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a title generation expert. Create a concise, engaging title for the given text. Return only the title text."
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    const title = titleResponse.choices[0].message.content || "Untitled";

    // Step 2: Extract interesting facts
    const factsResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a fact extraction expert. Extract exactly two of the most interesting facts from the given text. Return only the facts, each on a new line."
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    const facts = factsResponse.choices[0].message.content?.split('\n').filter(Boolean) || [];

    // Step 3: Generate summary
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a text summarization expert. Provide a 3-sentence summary of the given text that captures the key points while maintaining readability and coherence. Return only the summary text."
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    const summary = summaryResponse.choices[0].message.content || "";

    return {
      title,
      interestingFacts: facts,
      summary
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to analyze text: ${errorMessage}`);
  }
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const { text } = summarizeSchema.parse(req.body);
    
    const analysis = await analyzeText(text);
    const formattedOutput = `${analysis.title}\n\nKey Facts:\n1. ${analysis.interestingFacts[0]}\n2. ${analysis.interestingFacts[1]}\n\nSummary:\n${analysis.summary}`;

    context.res = {
      status: 200,
      body: { summary: formattedOutput }
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      context.res = {
        status: 400,
        body: { message: error.errors[0].message }
      };
    } else {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      context.res = {
        status: 500,
        body: { message }
      };
    }
  }
};

export default httpTrigger;
