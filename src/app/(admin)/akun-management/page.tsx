"use client";

import { useState, useEffect } from "react";
import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  Shield, 
  User as UserIcon,
  X,
  AlertCircle,
  Mail,
  Lock
} from "lucide-react";

// Import Komponen Global
import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";

// Integrasi Store & Types
import { useUserStore } from "@/src/app/store/useUserStore";
import { User, UserCreate, UserUpdate } from "@/src/app/types/user";

export default function AkunManagementPage() {
  const { users, isLoading, error, fetchUsers, addUser, editUser, removeUser } = useUserStore();

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setSelectedUser] = useState<User | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<UserCreate>({
    username: "",
    email: "",
    full_name: "",
    password: "",
    role: "opd", // Default role diperbarui
    is_active: true
  });

  // --- Initial Fetch ---
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Handlers ---
  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        password: "", 
        role: user.role,
        is_active: user.is_active
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: "",
        email: "",
        full_name: "",
        password: "",
        role: "opd", // Default role diperbarui
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updatePayload: UserUpdate = { ...formData };
        if (!updatePayload.password) delete updatePayload.password;
        
        await editUser(editingUser.id, updatePayload);
        alert("User berhasil diperbarui");
      } else {
        await addUser(formData);
        alert("User berhasil ditambahkan");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun '${username}'?`)) {
      try {
        await removeUser(id);
        alert("User berhasil dihapus");
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Helpers untuk UI ---
  const getAvatarColor = (role: string) => {
    if (role === 'admin') return 'bg-indigo-500';
    if (role === 'brida') return 'bg-teal-500';
    return 'bg-blue-400'; // opd / default
  };

  const getBadgeStyle = (role: string) => {
    if (role === 'admin') return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    if (role === 'brida') return 'bg-teal-50 text-teal-600 border-teal-100';
    return 'bg-blue-50 text-blue-600 border-blue-100'; // opd / default
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen font-sans text-black">
        <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
          <PageHeader title="Manajemen Akun" subtitle="Memuat daftar pengguna..." />
          <LoadingState message="Menghubungkan ke server Mimika DataHub..." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen font-sans animate-in fade-in duration-500 text-black">
      {/* Wrapper Utama sesuai standar UploadDataPage */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        
        {/* 1. HEADER */}
        <PageHeader 
          title="Manajemen Akun" 
          subtitle="Kelola akses pengguna, peran, dan status aktivasi sistem"
          withSearch
          onSearch={(val) => setSearchTerm(val)}
        />

        {/* 2. ACTION BAR */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
             <p className="text-sm text-gray-500 font-medium ">
               Ditemukan <span className="text-blue-600 font-bold">{filteredUsers.length}</span> dari {users.length} user terdaftar
             </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            <UserPlus size={18} /> Tambah User Baru
          </button>
        </div>

        {/* 3. USER TABLE */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Pengguna</th>
                  <th className="px-6 py-5 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Role</th>
                  <th className="px-6 py-5 font-bold text-gray-400 text-[11px] uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 font-bold text-gray-400 text-[11px] uppercase tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${getAvatarColor(user.role)}`}>
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate max-w-[200px]">
                          <p className="font-bold text-gray-800">{user.full_name}</p>
                          <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getBadgeStyle(user.role)}`}>
                        <Shield size={12} /> {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-400'}`} />
                         <span className={`text-xs font-bold ${user.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                           {user.is_active ? 'Aktif' : 'Non-aktif'}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id, user.username)}
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Hapus User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-300 ">
                      <AlertCircle size={40} className="mx-auto mb-2 opacity-20" />
                      Tidak ada akun ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 border border-white/20 overflow-hidden">
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    {editingUser ? <Edit2 size={20} className="text-blue-500" /> : <UserPlus size={20} className="text-blue-500" />}
                    {editingUser ? 'Edit Akun Pengguna' : 'Tambah User Baru'}
                  </h3>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" required value={formData.full_name} 
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                        placeholder="Contoh: Budi Santoso"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                      <input 
                        type="text" required value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                        placeholder="budisantoso"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                      <select 
                        value={formData.role} 
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                      >
                        {/* UPDATE: Pilihan Role */}
                        <option value="opd">OPD</option>
                        <option value="brida">BRIDA</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="email" required value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                        placeholder="nama@mimikakab.go.id"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      {editingUser ? 'Ganti Password (Opsional)' : 'Password Akun'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="password" required={!editingUser} value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" id="active-check" checked={formData.is_active} 
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="active-check" className="text-sm font-bold text-gray-600 cursor-pointer">Akun ini aktif</label>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? 'Sedang Memproses...' : editingUser ? 'Simpan Perubahan' : 'Buat Akun Sekarang'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <footer className="mt-auto text-center text-gray-400 text-[10px] font-medium tracking-widest uppercase pb-4">
          © 2026 Mimika DataHub - Sistem Keamanan & Autentikasi Pengguna
        </footer>
      </div>
    </div>
  );
}