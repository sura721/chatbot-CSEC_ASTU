"use client";
import { useState, useEffect } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch("/api/admin/users", { 
      method: "DELETE", 
      body: JSON.stringify({ targetUserId: id }) 
    });
    fetchUsers();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-black min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-black text-indigo-600">User Management</h1>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-xs font-bold uppercase text-gray-500">User</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500">Email</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={3} className="p-10 text-center text-gray-400">Loading directory...</td></tr>
            ) : users.length === 0 ? (
               <tr><td colSpan={3} className="p-10 text-center text-gray-400">No users found.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium text-sm text-gray-800">{u.name}</td>
                  <td className="p-4 text-sm text-gray-600">{u.email}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}