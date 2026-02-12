import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { DocumentModel } from "@/lib/models/Document";
import { 
  GoogleGenerativeAI, 
  TaskType, 
  EmbedContentRequest, 
  BatchEmbedContentsResponse 
} from "@google/generative-ai";

const pdf = require("pdf-parse-fork");

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData: FormData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    
    // NEW MODEL: gemini-embedding-001 (Replaces text-embedding-004)
    const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    const arrayBuffer: ArrayBuffer = await file.arrayBuffer();
    const buffer: Buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    const text: string = data.text;

    const chunks: string[] = text
      .split(/\n\s*\n/)
      .map((c: string) => c.trim())
      .filter((c: string) => c.length > 20);

    // Prepare requests with strict typing
    const requests: EmbedContentRequest[] = chunks.map((chunk: string) => ({
      content: { role: "user", parts: [{ text: chunk }] },
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    }));

    const result: BatchEmbedContentsResponse = await embedModel.batchEmbedContents({
      requests,
    });

    const embeddings: number[][] = result.embeddings.map((e) => e.values);

    await connectDB();

    const documentsToSave = chunks.map((chunk: string, index: number) => ({
      content: chunk,
      embedding: embeddings[index], // This will now be 3072 dimensions
      metadata: { fileName: file.name },
    }));

    await DocumentModel.insertMany(documentsToSave);

    return NextResponse.json({ 
      success: true, 
      message: `Indexed ${chunks.length} chunks successfully.` 
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Ingestion Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}