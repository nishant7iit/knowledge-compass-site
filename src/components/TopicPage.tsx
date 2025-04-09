
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { CourseItem, loadCourseData, loadMarkdownContent } from '@/utils/csvLoader';
import { FileDown, Youtube } from 'lucide-react';

export const TopicPage: React.FC = () => {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>();
  const [topicData, setTopicData] = useState<CourseItem | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !topicId) return;

    const fetchTopicData = async () => {
      setLoading(true);
      
      try {
        // Get all course data
        const courseData = await loadCourseData(courseId);
        
        // Find the specific topic
        const topic = courseData.find(item => item.topic_id === topicId);
        
        if (topic) {
          setTopicData(topic);
          
          // Load markdown content
          const markdownContent = await loadMarkdownContent(topic.markdown_path);
          setMarkdown(markdownContent);
        }
      } catch (error) {
        console.error('Error loading topic:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [courseId, topicId]);

  // Custom renderer for YouTube iframes
  const renderers = {
    // @ts-ignore - type issues with react-markdown
    iframe: ({ node, ...props }) => (
      <div className="my-4 overflow-hidden rounded-lg aspect-video">
        <iframe className="w-full h-full" {...props} title="YouTube video" allowFullScreen />
      </div>
    ),
    // @ts-ignore - type issues with react-markdown
    a: ({ node, ...props }) => {
      const isPdf = props.href?.endsWith('.pdf');
      return isPdf ? (
        <a 
          {...props} 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-knowledge-600 rounded-md hover:bg-knowledge-700"
        >
          <FileDown className="mr-2" size={16} />
          {props.children}
        </a>
      ) : (
        <a {...props} className="text-knowledge-600 hover:underline" />
      );
    },
    // @ts-ignore - type issues with react-markdown
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="px-1 py-0.5 text-sm bg-gray-100 rounded" {...props}>
          {children}
        </code>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading topic content...</div>
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="p-8">
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          <h2 className="text-xl font-bold">Topic Not Found</h2>
          <p>The requested topic could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-knowledge-900 md:text-3xl">
          {topicData.topic_title}: {topicData.subtopic_title}
        </h1>
        
        <div className="flex flex-wrap mt-4 space-x-2">
          {topicData.pdf_path && (
            <a 
              href={`/${topicData.pdf_path}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-knowledge-600 rounded-md hover:bg-knowledge-700"
            >
              <FileDown className="mr-2" size={16} />
              Download PDF
            </a>
          )}
          
          {topicData.youtube_url && (
            <a 
              href={topicData.youtube_url.replace('/embed/', '/watch?v=')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              <Youtube className="mr-2" size={16} />
              Watch on YouTube
            </a>
          )}
        </div>
      </header>

      <div className="prose prose-lg max-w-none prose-headings:text-knowledge-900 prose-a:text-knowledge-600">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default TopicPage;
