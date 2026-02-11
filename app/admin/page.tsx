"use client";
import { useState, useEffect } from "react";
import { Trash2, FileText, UploadCloud, Eraser, Loader2, ArrowRight, CheckCircle2, FileUp } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [docs, setDocs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoadingDocs(true);
    const res = await fetch("/api/ingest/list");
    const data = await res.json();
    setDocs(data);
    setLoadingDocs(false);
  };

  // 1. Handle File Selection (Wait for button click)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus("");
    }
  };

  // 2. The Actual Post/Upload Logic
  const handlePost = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus("AI is reading and memorizing...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/ingest", { method: "POST", body: formData });
      if (res.ok) {
        setUploadStatus("✅ Successfully trained!");
        setSelectedFile(null); // Reset input
        fetchDocs(); // Refresh list
      } else {
        setUploadStatus("❌ Failed to process.");
      }
    } catch (err) {
      setUploadStatus("❌ Error connecting to server.");
    } finally {
      setIsUploading(false);
    }
  };

  // 3. Delete Specific File (AI Forgets)
  const handleDeleteFile = async (name: string) => {
    if (!confirm(`Are you sure? AI will lose all knowledge from: ${name}`)) return;

    await fetch("/api/ingest/list", { 
        method: "DELETE", 
        body: JSON.stringify({ fileName: name }) 
    });
    fetchDocs();
  };

  const handleClearAll = async () => {
    if (!confirm("Wipe ALL knowledge? The AI will forget everything.")) return;
    await fetch("/api/ingest/list", { 
        method: "DELETE", 
        body: JSON.stringify({ deleteAll: true }) 
    });
    fetchDocs();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-black min-h-screen">
      <div className="flex justify-between items-end mb-10 border-b pb-6">
        <div>
          <h1 className="text-4xl font-black text-indigo-600 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium">Knowledge Base Management System</p>
        </div>
        <Link href="/admin/users" className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-all">
          Manage Users <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: UPLOAD BOX */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileUp className="text-indigo-600" /> Train New Data
            </h2>
            
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-100 rounded-2xl p-8 cursor-pointer hover:bg-indigo-50/30 transition-all">
                <UploadCloud className={selectedFile ? "text-indigo-600" : "text-gray-300"} size={48} />
                <span className="mt-4 font-bold text-gray-700 text-center">
                  {selectedFile ? selectedFile.name : "Select PDF Document"}
                </span>
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" disabled={isUploading} />
              </label>

              {selectedFile && (
                <button 
                  onClick={handlePost}
                  disabled={isUploading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {isUploading ? <><Loader2 className="animate-spin" /> Training AI...</> : "POST TO KNOWLEDGE BASE"}
                </button>
              )}

              {uploadStatus && (
                <p className={`text-center text-sm font-bold ${uploadStatus.includes('✅') ? 'text-green-600' : 'text-indigo-600'}`}>
                  {uploadStatus}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: KNOWLEDGE LIST */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="text-indigo-600" /> Active Knowledge
              </h2>
              {docs.length > 0 && (
                <button onClick={handleClearAll} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline">
                  <Eraser size={14} /> Reset Brain
                </button>
              )}
            </div>

            <div className="space-y-3">
              {loadingDocs ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-300" /></div>
              ) : docs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed">
                  <p className="text-gray-400 text-sm">The AI has no specific knowledge yet.</p>
                </div>
              ) : (
                docs.map(doc => (
                  <div key={doc} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <FileText size={20} />
                      </div>
                      <span className="font-bold text-gray-700 truncate max-w-[250px]">{doc}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteFile(doc)} 
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-2"
                      title="Make AI forget this file"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}