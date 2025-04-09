
import React from 'react';
import { Link } from 'react-router-dom';
import { courseList } from '@/utils/csvLoader';
import { BookOpen, Compass } from 'lucide-react';

export const CourseList: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="relative py-16 bg-gradient-to-b from-knowledge-600 to-knowledge-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-4 space-x-2">
              <Compass className="text-white" size={40} />
              <BookOpen className="text-white" size={40} />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Knowledge Compass</h1>
            <p className="max-w-2xl mb-8 text-xl text-knowledge-100">
              Your guide to structured learning. Explore our courses and begin your educational journey today.
            </p>
          </div>
        </div>
      </div>

      {/* Course grid */}
      <div className="container px-4 py-16 mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Available Courses</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courseList.map((course) => (
            <Link
              to={`/course/${course.id}`}
              key={course.id}
              className="relative overflow-hidden transition-transform duration-300 bg-white border rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              <div className="h-48 bg-knowledge-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-knowledge-900">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
                <div className="flex justify-end mt-4">
                  <span className="inline-flex items-center px-3 py-1 text-sm text-white bg-knowledge-500 rounded-full">
                    Explore
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
