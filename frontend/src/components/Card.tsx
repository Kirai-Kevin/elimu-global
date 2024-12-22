import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <motion.div 
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.div>
  );
}

