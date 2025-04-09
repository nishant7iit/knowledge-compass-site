
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, FileText, Home } from 'lucide-react';
import { CourseItem, loadCourseData, courseList } from '@/utils/csvLoader';

export const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Find the course title
  const courseTitle = courseList.find(course => course.id === courseId)?.title || 'Course';

  useEffect(() => {
    if (!courseId) return;
    
    const fetchCourseData = async () => {
      setLoading(true);
      const data = await loadCourseData(courseId);
      setCourseData(data);
      setLoading(false);
      
      // If there's data, navigate to the first topic
      if (data.length > 0 && window.location.pathname === `/course/${courseId}`) {
        navigate(`/course/${courseId}/${data[0].topic_id}`);
      }
    };
    
    fetchCourseData();
  }, [courseId, navigate]);

  // Group topics by topic_title
  const groupedTopics: { [key: string]: CourseItem[] } = {};
  courseData.forEach(item => {
    if (!groupedTopics[item.topic_title]) {
      groupedTopics[item.topic_title] = [];
    }
    groupedTopics[item.topic_title].push(item);
  });

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 h-full transition-transform duration-300 bg-white border-r shadow-lg transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="text-knowledge-600" size={20} />
            <span className="font-semibold text-knowledge-950">Knowledge Compass</span>
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 font-medium text-gray-900">
          <Link to="/" className="flex items-center mb-4 space-x-2 text-sm text-knowledge-600 hover:text-knowledge-800">
            <Home size={16} />
            <span>Home</span>
          </Link>
          
          <h2 className="mb-2 text-xl font-bold text-knowledge-900">{courseTitle}</h2>
          
          {loading ? (
            <div className="py-4 text-center text-gray-500">Loading topics...</div>
          ) : (
            <div className="mt-4 space-y-4">
              {Object.entries(groupedTopics).map(([topicTitle, items]) => (
                <div key={topicTitle} className="space-y-1">
                  <h3 className="text-lg font-semibold text-knowledge-800">{topicTitle}</h3>
                  <ul className="pl-4 space-y-1">
                    {items.map((item) => (
                      <li key={item.topic_id}>
                        <Link
                          to={`/course/${courseId}/${item.topic_id}`}
                          className="flex items-center py-1 text-sm text-gray-700 hover:text-knowledge-600"
                        >
                          <ChevronRight size={14} className="mr-1" />
                          {item.subtopic_title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 p-2 m-4 text-white bg-knowledge-600 rounded-full shadow-lg md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={24} />
      </button>
      
      {/* Main content area */}
      <div className="flex-1 md:ml-64">
        <div className="container p-4 mx-auto mt-16 md:mt-0 md:p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-knowledge-600">Home</Link>
              <ChevronRight size={14} />
              <Link to={`/course/${courseId}`} className="hover:text-knowledge-600">{courseTitle}</Link>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">Loading course content...</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              {/* Course content will be rendered by TopicPage */}
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { Outlet } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

export default CoursePage;
