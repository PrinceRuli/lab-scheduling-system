import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNotification } from '../hooks/useNotification';

const contactSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
});

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('success', 'Message sent successfully! We will contact you soon.');
      reset();
    } catch (error) {
      showNotification('error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">Get in touch with our support team</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                {...register('name')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                {...register('subject')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.subject ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="How can we help you?"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                {...register('message')}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.message ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your message here..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
        
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📧</span>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">support@labscheduler.edu</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📞</span>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">(123) 456-7890</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📍</span>
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">123 University Street<br />Education City, EC 12345</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday</span>
                <span className="font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;