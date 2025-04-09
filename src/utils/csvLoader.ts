
import Papa from 'papaparse';

export interface CourseItem {
  topic_id: string;
  topic_title: string;
  subtopic_title: string;
  markdown_path: string;
  pdf_path: string;
  youtube_url: string;
}

export interface CourseData {
  [key: string]: CourseItem[];
}

export const courseList = [
  {
    id: 'webdev',
    title: 'Web Development',
    description: 'Learn HTML, CSS, JavaScript and React to build modern web applications',
    image: '/placeholder.svg'
  },
  {
    id: 'python',
    title: 'Python Programming',
    description: 'Master Python programming from basics to advanced concepts',
    image: '/placeholder.svg'
  }
];

export const loadCourseData = async (courseId: string): Promise<CourseItem[]> => {
  try {
    const response = await fetch(`/courses/${courseId}.csv`);
    const csvData = await response.text();
    
    const result = Papa.parse<CourseItem>(csvData, {
      header: true,
      skipEmptyLines: true
    });
    
    return result.data;
  } catch (error) {
    console.error(`Error loading course data for ${courseId}:`, error);
    return [];
  }
};

export const loadMarkdownContent = async (path: string): Promise<string> => {
  try {
    const response = await fetch(`/${path}`);
    const markdown = await response.text();
    return markdown;
  } catch (error) {
    console.error(`Error loading markdown from ${path}:`, error);
    return '# Error\nFailed to load content. Please try again later.';
  }
};
