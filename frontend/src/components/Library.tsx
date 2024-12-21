import { useState, useEffect } from 'react';

interface LibraryItem {
  id: number;
  title: string;
  author: string;
  type: 'eBook' | 'Article' | 'Video' | 'Research Paper';
  subject: string;
  url: string;
}

function Library() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulating API call to fetch library items
    const fetchLibraryItems = async () => {
      // In a real application, this would be an API call
      const mockLibraryItems: LibraryItem[] = [
        { id: 1, title: 'Introduction to Calculus', author: 'John Smith', type: 'eBook', subject: 'Math', url: '/library/calculus_intro.pdf' },
        { id: 2, title: 'The Impact of Climate Change', author: 'Jane Doe', type: 'Article', subject: 'Environmental Science', url: '/library/climate_change_impact.html' },
        { id: 3, title: 'Understanding Quantum Physics', author: 'Albert Einstein', type: 'Video', subject: 'Physics', url: '/library/quantum_physics.mp4' },
        { id: 4, title: 'Advancements in Machine Learning', author: 'Alan Turing', type: 'Research Paper', subject: 'Computer Science', url: '/library/machine_learning_advancements.pdf' },
      ];
      setLibraryItems(mockLibraryItems);
    };

    fetchLibraryItems();
  }, []);

  const filteredItems = libraryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'eBook':
        return '📚';
      case 'Article':
        return '📰';
      case 'Video':
        return '🎥';
      case 'Research Paper':
        return '📄';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Library</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, author, or subject"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">{getIcon(item.type)}</span>
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Author: {item.author}</p>
            <p className="text-sm text-gray-600 mb-2">Type: {item.type}</p>
            <p className="text-sm text-gray-600 mb-4">Subject: {item.subject}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors inline-block"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;

