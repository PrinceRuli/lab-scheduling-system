import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const registerSchema = yup.object().shape({
  name: yup.string().min(3, 'Nama minimal 3 karakter').required('Nama wajib diisi'),
  email: yup.string().email('Email harus valid').required('Email wajib diisi'),
  password: yup.string().min(6, 'Password minimal 6 karakter').required('Password wajib diisi'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Password tidak cocok')
    .required('Konfirmasi password wajib diisi'),
  role: yup.string().oneOf(['teacher', 'student'], 'Pilih peran yang valid').required('Peran wajib dipilih'),
  institution: yup.string().required('Institusi wajib diisi'),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Remove confirmPassword from data
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      showNotification('success', 'Registrasi berhasil!');
      
      // Redirect based on role
      if (userData.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/');
      }
    } catch (error) {
      showNotification('error', error.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Buat Akun Baru</h2>
          <p className="mt-2 text-sm text-gray-600">
            Atau{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              masuk ke akun yang sudah ada
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="John Doe"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="nama@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Institution Field */}
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                Institusi/Sekolah
              </label>
              <input
                id="institution"
                type="text"
                {...register('institution')}
                className={`input-field ${errors.institution ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Universitas Contoh"
                disabled={isLoading}
              />
              {errors.institution && (
                <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peran
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex cursor-pointer">
                  <input
                    type="radio"
                    value="teacher"
                    {...register('role')}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-full p-4 border border-gray-300 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50">
                    <div className="text-center">
                      <div className="font-medium">Guru/Dosen</div>
                      <div className="text-xs text-gray-500 mt-1">Untuk pengajar</div>
                    </div>
                  </div>
                </label>
                <label className="relative flex cursor-pointer">
                  <input
                    type="radio"
                    value="student"
                    {...register('role')}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-full p-4 border border-gray-300 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50">
                    <div className="text-center">
                      <div className="font-medium">Siswa/Mahasiswa</div>
                      <div className="text-xs text-gray-500 mt-1">Untuk pelajar</div>
                    </div>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`input-field ${errors.password ? 'border-red-300 focus:ring-red-500' : ''} pr-10`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`input-field ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : ''} pr-10`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftarkan...
                </span>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;