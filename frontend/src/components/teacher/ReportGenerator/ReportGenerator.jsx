import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ReportGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      alert(`Report "${data.reportName}" generated successfully!`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
      <p className="text-gray-600 mb-6">Create custom reports for your lab usage</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Name
          </label>
          <input
            type="text"
            {...register('reportName', { required: 'Report name is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="My Lab Usage Report"
          />
          {errors.reportName && (
            <p className="mt-1 text-sm text-red-600">{errors.reportName.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select
            {...register('reportType', { required: 'Report type is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Select report type</option>
            <option value="usage">Usage Report</option>
            <option value="booking">Booking History</option>
            <option value="analytics">Analytics Report</option>
            <option value="summary">Monthly Summary</option>
          </select>
          {errors.reportType && (
            <p className="mt-1 text-sm text-red-600">{errors.reportType.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              {...register('startDate', { required: 'Start date is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              {...register('endDate', { required: 'End date is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                {...register('format')}
                value="pdf"
                defaultChecked
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">PDF</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register('format')}
                value="excel"
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Excel</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register('format')}
                value="csv"
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">CSV</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors ${
            isGenerating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Report...
            </span>
          ) : (
            'Generate Report'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportGenerator;