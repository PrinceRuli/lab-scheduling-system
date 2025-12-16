import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/landing/Hero/Hero';
import ScheduleCards from '../components/landing/ScheduleCards/ScheduleCards';
import Articles from '../components/landing/Articles/Articles';
import Testimonials from '../components/landing/Testimonials/Testimonials';

const LandingPage = () => {
  return (
    <div className="text-center py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <Hero />
      </section>

      {/* Schedule Cards */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Easy Lab Scheduling</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book labs with just a few clicks. View availability in real-time and manage your schedule efficiently.
          </p>
        </div>
        <ScheduleCards />
      </section>

      {/* Articles Section */}
      <section className="mb-16 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles & Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest educational resources and lab management tips.
            </p>
          </div>
          <Articles />
          <div className="text-center mt-8">
            <Link to="/articles" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Teachers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join hundreds of educators who have transformed their lab management experience.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our platform today and experience seamless lab scheduling for your institution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg">
              Sign Up Free
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;