import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import PageContainer from './PageContainer';
import Card from './Card';

interface Material {
  id: number;
  title: string;
  subject: string;
  type: 'PDF' | 'Video' | 'Audio' | 'Interactive';
  size: string;
  downloadUrl: string;
}

function Materials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    const fetchMaterials = async () => {
      // In a real application, this would be an API call
      const mockMaterials: Material[] = [
        { id: 1, title: 'Algebra Basics', subject: 'Math', type: 'PDF', size: '2.3 MB', downloadUrl: '/materials/algebra_basics.pdf' },
        { id: 2, title: 'World War II Overview', subject: 'History', type: 'Video', size: '156 MB', downloadUrl: '/materials/ww2_overview.mp4' },
        { id: 3, title: 'English Grammar Rules', subject: 'English', type: 'PDF', size: '1.8 MB', downloadUrl: '/materials/english_grammar.pdf' },
        { id: 4, title: 'Cell Biology Interactive', subject: 'Biology', type: 'Interactive', size: '50 MB', downloadUrl: '/materials/cell_biology_interactive.html' },
      ];
      setMaterials(mockMaterials);
    };

    fetchMaterials();
  }, []);

  const filteredMaterials = selectedSubject
    ? materials.filter(material => material.subject === selectedSubject)
    : materials;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <PageContainer>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold text-blue-600">Study Materials</h2>
        
        <Card>
          <div className="p-6">
            <label htmlFor="subject" className="block text-xl font-semibold text-blue-500 mb-4">Filter by Subject</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 text-gray-600 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Subjects</option>
              <option value="Math">Math</option>
              <option value="History">History</option>
              <option value="English">English</option>
              <option value="Biology">Biology</option>
            </select>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <motion.div key={material.id} variants={itemVariants}>
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-500 mb-4">{material.title}</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600">Subject: {material.subject}</p>
                    <p className="text-gray-600">Type: {material.type}</p>
                    <p className="text-gray-600">Size: {material.size}</p>
                  </div>
                  <motion.a
                    href={material.downloadUrl}
                    download
                    className="mt-6 inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="mr-2" size={20} />
                    Download Material
                  </motion.a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  );
}

export default Materials;

