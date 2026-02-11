import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import connectDB from "@/lib/db";
import { DocumentModel } from "@/lib/models/Document";
import { ChatModel } from "@/lib/models/Chat";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate User
    const { userId } =await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();
    const userQuestion = messages[messages.length - 1].content;

    await connectDB();

    // 2. Save User Message to History
    await ChatModel.create({
      userId,
      role: "user",
      content: userQuestion,
    });

    // 3. Generate Vector Embedding for the question (Google)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const embeddingResult = await embedModel.embedContent(userQuestion);
    const userQueryVector = embeddingResult.embedding.values;

    // 4. Vector Search in MongoDB
    const searchResults = await DocumentModel.aggregate([
      {
        $vectorSearch: {
          index: "chatbot_index", // Matches your Atlas index name
          path: "embedding",
          queryVector: userQueryVector,
          numCandidates: 100,
          limit: 4,
        },
      },
      {
        $project: { content: 1, _id: 0 },
      },
    ]);

    const contextText = searchResults.length > 0 
      ? searchResults.map((res: any) => res.content).join("\n\n---\n\n")
      : "No specific document context found.";

    // 5. Generate Answer using Groq (Llama 3)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for ASTU Dev Club. 
          Answer the question based ONLY on the following context.
          If the answer is not in the context, use your knowledge but mention it is not in the official docs.
          
          CONTEXT FROM DOCUMENTS:
          ${contextText}`,
        },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // 6. Save AI Response to History
    await ChatModel.create({
      userId,
      role: "assistant",
      content: aiResponse,
    });

    return NextResponse.json({ text: aiResponse });

  } catch (error: any) {
    console.error("CRITICAL CHAT ERROR:", error);
    return NextResponse.json({ text: "Error: " + error.message }, { status: 200 });
  }
}