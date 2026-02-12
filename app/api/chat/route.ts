import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import Groq from "groq-sdk";
import connectDB from "@/lib/db";
import { DocumentModel } from "@/lib/models/Document";
import { ChatModel } from "@/lib/models/Chat";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const rawMessages = body.messages || [];
    if (rawMessages.length === 0) return NextResponse.json({ text: "No message provided" });
    
    const userQuestion = rawMessages[rawMessages.length - 1].content;

    await connectDB();

    // 1. Save User Question to DB
    await ChatModel.create({ userId, role: "user", content: userQuestion });

    // 2. Vector Search (Using the new stable model)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    
    // Explicitly using TaskType.RETRIEVAL_QUERY for search accuracy
    const embeddingResult = await embedModel.embedContent({
      content: { role: "user", parts: [{ text: userQuestion }] },
      taskType: TaskType.RETRIEVAL_QUERY,
    });
    
    const queryVector = embeddingResult.embedding.values;

    const searchResults = await DocumentModel.aggregate([
      {
        $vectorSearch: {
          index: "chatbot_index",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 100,
          limit: 4,
        },
      },
      { $project: { content: 1, _id: 0 } },
    ]);

    const contextText = searchResults.length > 0 
      ? searchResults.map((res: { content: string }) => res.content).join("\n\n---\n\n")
      : "No relevant documents found in the current knowledge base.";

    // 3. SANITIZE AND SLICE HISTORY
    // We only take the last 4 messages to prevent the AI from relying on "ghost memory"
    // of documents that were deleted but mentioned in earlier chat turns.
    const sanitizedMessages = rawMessages
      .slice(-4) 
      .map((msg: any) => ({
        role: msg.role === "assistant" || msg.role === "model" ? "assistant" : "user",
        content: String(msg.content)
      }));

    // 4. Generate Answer from Groq
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are a helpful AI assistant.

You answer questions strictly based on the information available in your current knowledge base. 
Your knowledge comes only from the documents and content that have been provided to you.

Rules:
1. Answer using only the information available below.
2. Do not use outside knowledge or make assumptions.
3. If the answer is not available in the provided information, respond with:
   "I'm sorry, that information is not in my current knowledge base."
4. Provide clear, natural, and conversational responses.

Knowledge Base:
${contextText}
`

        },
        ...sanitizedMessages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Lower temperature makes it follow the context more strictly
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "";

    // 5. Save AI Response to DB
    await ChatModel.create({ userId, role: "assistant", content: aiResponse });

    return NextResponse.json({ text: aiResponse });

  } catch (error: any) {
    console.error("CHAT ERROR:", error);
    // Return 200 with error text so the UI doesn't crash
    return NextResponse.json({ text: "I'm having trouble connecting to the brain. Error: " + error.message }, { status: 200 });
  }
}