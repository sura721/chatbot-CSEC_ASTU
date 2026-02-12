"use client";
import Link from "next/link";
import { Bot, ShieldCheck, Database, Zap, Cpu, Code2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-white text-black min-h-screen font-sans">
      {/* Hero Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold mb-6">
          <Zap size={16} /> ASTU Dev Club Entrance Project 2026
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          The Intelligent <br /> Knowledge Base.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          A modern RAG-powered chatbot platform. Upload documents, train your AI, 
          and get context-aware answers in seconds.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/admin" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Enter Admin Panel
          </Link>
          <button onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
            Explore Features
          </button>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="bg-gray-50 py-20 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-12">Built with Industry Standard Tech</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center gap-2">
              <Code2 size={40} /> <span className="font-bold">Next.js 14</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck size={40} /> <span className="font-bold">Clerk Auth</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Database size={40} /> <span className="font-bold">MongoDB Atlas</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Cpu size={40} /> <span className="font-bold">Groq Llama 3</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
     {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Bot size={24} />
            </div>
            <h3 className="text-xl font-bold">RAG Architecture</h3>
            <p className="text-gray-500 leading-relaxed">Uses Retrieval-Augmented Generation to ground AI responses in your specific PDF data.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-violet-600 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold">Vector Search</h3>
            <p className="text-gray-500 leading-relaxed">Calculates semantic similarity using multidimensional embeddings stored in MongoDB.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold">Admin Controls</h3>
            <p className="text-gray-500 leading-relaxed">Full dashboard to manage knowledge assets, clear AI memory, and monitor users.</p>
          </div>
        </div>
      </section>

      {/* Submission & Developer Note Section */}
      
      <section className="py-20 px-6 bg-indigo-900 text-white rounded-[3rem] mx-4 mb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Bot size={300} />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-black mb-6 border-b border-white/10 pb-4">
              Submission: ASTU Dev Club Entrance Project
            </h2>
            
            <div className="space-y-6 text-indigo-100 leading-relaxed">
              <p className="text-lg">
                <span className="font-bold text-white italic">Dear Evaluators,</span><br />
                I am excited to submit my project for the 2026 Dev Club entrance. I have built a 
                <span className="text-white font-bold"> Full-Stack RAG (Retrieval-Augmented Generation) AI Platform </span> 
                designed specifically for the ASTU Software  community.
              </p>

              <div className="bg-indigo-600/40 p-6 rounded-2xl border border-indigo-400/30">
                <h4 className="flex items-center gap-2 text-white font-bold mb-2">
                  <ShieldCheck size={20} /> Special Note on Accessibility
                </h4>
                <p className="text-sm">
                  To ensure a seamless evaluation experience, I have made the 
                  <span className="text-white font-semibold"> Admin Dashboard public for all authenticated users</span>. 
                  This allows you to immediately test document ingestion, manage the knowledge base, 
                  and see the user directory without waiting for manual role promotion. In a production 
                  environment, this would be restricted via Clerk&apos;s Role-Based Access Control (RBAC).
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 italic text-sm text-indigo-300 font-medium">
                <p>Submitted by: Surafel</p>
                <p>ASTU Software Engineering Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-100">
        &copy; 2026 Adama Science & Technology University - Dev Club
      </footer>

      {/* Footer Info */}
      <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-100">
        &copy; 2026 Adama Science & Technology University - dev Club
      </footer>
    </div>
  );
}