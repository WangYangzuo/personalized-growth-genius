
import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40">
      <motion.div
        className="w-24 h-24 relative"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 3, 
          ease: "linear", 
          repeat: Infinity 
        }}
      >
        <motion.div 
          className="absolute inset-0 rounded-xl border-t-4 border-accent opacity-30"
          animate={{ rotate: -120 }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute inset-0 rounded-xl border-l-4 border-r-4 border-accent opacity-70"
          animate={{ rotateY: 180 }}
          transition={{ 
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute inset-0 rounded-xl border-b-4 border-accent"
          animate={{ rotate: 120 }}
          transition={{ 
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
      <motion.p 
        className="mt-6 text-lg font-medium text-gray-700"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ 
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity
        }}
      >
        Creating your personalized growth plan...
      </motion.p>
    </div>
  );
};

export default LoadingAnimation;
