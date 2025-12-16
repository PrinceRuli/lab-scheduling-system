import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import userService from '../services/userService';

const profileSchema = yup.object().shape({
  name: yup.string().min(3, 'Nama minimal 3 karakter').required('Nama wajib diisi'),
  email: yup.string().email('Format email tidak valid').required('Email wajib diisi'),
  phone: yup.string().matches(/^[0-9]{10,13}$/, 'Nomor telepon harus valid (10-13 digit)'),
  institution: yup.string().required('Institusi wajib diisi'),
  department: yup.string(),
  bio: yup.string().max(500, 'Bio maksimal 500 karakter'),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Password saat ini wajib diisi'),
  newPassword: yup.string().min(6, 'Password baru minimal 6 karakter').required('Password baru wajib diisi'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Password tidak cocok')
    .required('Konfirmasi password wajib diisi'),
});

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ bookings: 0, articles: 0, hours: 0 });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: user || {},
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      resetProfile(user);
      fetchUserStats();
    }
  }, [user, resetProfile]);

  const fetchUserStats = async () => {
    try {
      // Simulated stats - nanti akan diganti dengan API call
      setStats({
        bookings: 24,
        articles: 5,
        hours: 72,
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const handleProfileSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      showNotification('success', 'Profil berhasil diperbarui!');
      setIsEditing(false);
    } catch (error) {
      showNotification('error', error.message || 'Gagal memperbarui profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data) => {
    setIsLoading(true);
    try {
      await userService.changePassword(data);
      showNotification('success', 'Password berhasil diubah!');
      setIsChangingPassword(false);
      resetPassword();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('error', 'Ukuran file maksimal 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'File harus berupa gambar');
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    if (!profileImage) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);
      
      await userService.uploadProfileImage(formData);
      showNotification('success', 'Foto profil berhasil diunggah!');
      setProfileImage(null);
    } catch (error) {
      showNotification('error', 'Gagal mengunggah foto profil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Profile Header with Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Image Section */}
          <div className="relative">
            <div className="w-32 h-32 bg-white/20 rounded-full border-4 border-white/30 flex items-center justify-center relative overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
              
              <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </label>
            </div>
            
            {profileImage && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleSaveImage}
                  disabled={isLoading}
                  className="flex-1 bg-white text-blue-600 hover:bg-gray-100 py-2 rounded-lg text-sm font-medium"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
                <button
                  onClick={() => {
                    setProfileImage(null);
                    setImagePreview('');
                  }}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
            <p className="text-blue-100 mb-4">{user?.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                {user?.role === 'admin' ? 'Administrator' : 'Pengajar'}
              </span>
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                {user?.institution}
              </span>
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                Bergabung {new Date(user?.createdAt || Date.now()).toLocaleDateString('id-ID')}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.bookings}</p>
                <p className="text-sm text-blue-200">Booking</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.articles}</p>
                <p className="text-sm text-blue-200">Artikel</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.hours} jam</p>
                <p className="text-sm text-blue-200">Lab Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Informasi Profil</h2>
              <button
                onClick={() => {
                  if (isEditing) {
                    resetProfile(user);
                  }
                  setIsEditing(!isEditing);
                }}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isEditing
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isEditing ? 'Batal Edit' : 'Edit Profil'}
              </button>
            </div>

            <form onSubmit={handleSubmitProfile(handleProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    {...registerProfile('name')}
                    disabled={!isEditing || isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      profileErrors.name ? 'border-red-300' : 'border-gray-300'
                    } ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    {...registerProfile('email')}
                    disabled={!isEditing || isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      profileErrors.email ? 'border-red-300' : 'border-gray-300'
                    } ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institusi
                  </label>
                  <input
                    type="text"
                    {...registerProfile('institution')}
                    disabled={!isEditing || isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      profileErrors.institution ? 'border-red-300' : 'border-gray-300'
                    } ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {profileErrors.institution && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.institution.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    {...registerProfile('phone')}
                    disabled={!isEditing || isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      profileErrors.phone ? 'border-red-300' : 'border-gray-300'
                    } ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {profileErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (Opsional)
                  </label>
                  <textarea
                    {...registerProfile('bio')}
                    disabled={!isEditing || isLoading}
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      profileErrors.bio ? 'border-red-300' : 'border-gray-300'
                    } ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Ceritakan sedikit tentang diri Anda..."
                  />
                  {profileErrors.bio && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.bio.message}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </span>
                    ) : (
                      'Simpan Perubahan'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Aktivitas Terbaru</h2>
            <div className="space-y-4">
              {[
                { action: 'Booking dibuat', description: 'Computer Lab A', date: 'Hari ini, 10:30', type: 'booking' },
                { action: 'Artikel diterbitkan', description: 'Lab Safety Guidelines', date: 'Kemarin, 14:20', type: 'article' },
                { action: 'Password diubah', description: 'Update keamanan', date: '2 hari lalu', type: 'security' },
                { action: 'Profil diperbarui', description: 'Informasi institusi', date: '3 hari lalu', type: 'profile' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'article' ? 'bg-green-100 text-green-600' :
                    activity.type === 'security' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'booking' && '📅'}
                    {activity.type === 'article' && '📝'}
                    {activity.type === 'security' && '🔒'}
                    {activity.type === 'profile' && '👤'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Security & Settings */}
        <div className="space-y-8">
          {/* Change Password Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Keamanan Akun</h2>
            
            {isChangingPassword ? (
              <form onSubmit={handleSubmitPassword(handlePasswordSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    {...registerPassword('currentPassword')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    {...registerPassword('newPassword')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    {...registerPassword('confirmPassword')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
                  >
                    {isLoading ? 'Mengubah...' : 'Ubah Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      resetPassword();
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Perbarui password Anda secara berkala untuk menjaga keamanan akun.</p>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg"
                >
                  Ubah Password
                </button>
              </div>
            )}
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pengaturan Akun</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notifikasi Email</p>
                  <p className="text-sm text-gray-600">Terima pemberitahuan via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Mode Gelap</p>
                  <p className="text-sm text-gray-600">Tampilan gelap untuk kenyamanan mata</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full text-red-600 hover:text-red-800 font-medium py-3">
                  Hapus Akun
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tautan Cepat</h2>
            <div className="space-y-3">
              <a href="/bookings" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Booking Saya</span>
                <span className="text-blue-600">→</span>
              </a>
              <a href="/articles" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Artikel Saya</span>
                <span className="text-blue-600">→</span>
              </a>
              <a href="/schedule" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Jadwal</span>
                <span className="text-blue-600">→</span>
              </a>
              <a href="/help" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Bantuan</span>
                <span className="text-blue-600">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;