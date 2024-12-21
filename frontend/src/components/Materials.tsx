import { useState, useEffect } from 'react';

interface Material {
  id: number;
  title: string;
  subject: string;
  type: 'PDF' | 'Video' | 'Presentation';
  url: string;
}

function Materials() {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    // Simulating API call to fetch materials
    const fetchMaterials = async () => {
      // In a real application, this would be an API call
      const mockMaterials: Material[] = [
        { id: 1, title: 'Algebra Fundamentals', subject: 'Math', type: 'PDF', url: '/materials/algebra_fundamentals.pdf' },
        { id: 2, title: 'Shakespeare\'s Hamlet', subject: 'English', type: 'Video', url: '/materials/hamlet_analysis.mp4' },
        { id: 3, title: 'Cell Structure and Function', subject: 'Biology', type: 'Presentation', url: '/materials/cell_structure.pptx' },
      ];
      setMaterials(mockMaterials);
    };

    fetchMaterials();
  }, []);

  const getIcon = (type: Material['type']) => {
    switch (type) {
      case 'PDF':
        return '📄';
      case 'Video':
        return '🎥';
      case 'Presentation':
        return '📊';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Learning Materials</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <div key={material.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">{getIcon(material.type)}</span>
              <h3 className="text-lg font-semibold">{material.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Subject: {material.subject}</p>
            <p className="text-sm text-gray-600 mb-4">Type: {material.type}</p>
            <a
              href={material.url}
              download
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors inline-block"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Materials;

