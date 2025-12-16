import React from 'react';

const Testimonials = () => {
  const testimonials = [
    { 
      id: 1, 
      name: 'Dr. Sarah Johnson', 
      role: 'Head of Science Department', 
      content: 'This platform has transformed how we manage our laboratory schedules. The interface is intuitive and the booking process is seamless.',
      rating: 5
    },
    { 
      id: 2, 
      name: 'Prof. Michael Chen', 
      role: 'Chemistry Professor', 
      content: 'The real-time availability feature saves us hours each week. Highly recommended for any educational institution.',
      rating: 5
    },
    { 
      id: 3, 
      name: 'Lisa Rodriguez', 
      role: 'Lab Coordinator', 
      content: 'Excellent support and continuous improvements. The reporting features are particularly useful for resource planning.',
      rating: 4
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-300 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
              {testimonial.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
          </div>
          
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <p className="text-gray-600 italic">
            "{testimonial.content}"
          </p>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;