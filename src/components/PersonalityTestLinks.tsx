
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const PersonalityTestLinks: React.FC = () => {
  const testLinks = [
    {
      name: '测试我的MBTI类型',
      url: 'https://www.16personalities.com/ch',
      color: 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-900',
      hoverColor: 'hover:from-indigo-100 hover:to-indigo-200',
    },
    {
      name: '测试我的荣格认知功能',
      url: 'https://www.jungus.cn/test/',
      color: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900',
      hoverColor: 'hover:from-amber-100 hover:to-amber-200',
    },
    {
      name: '测试我的九型人格',
      url: 'https://enneagram-personality.com/zh-Hans',
      color: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-900',
      hoverColor: 'hover:from-emerald-100 hover:to-emerald-200',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="mt-12 text-center"
    >
      <h3 className="text-lg font-medium text-gray-700 mb-6">
        不确定您的性格类型？点击下方链接进行免费测试：
      </h3>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {testLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`personality-test-button px-5 py-3 rounded-lg ${link.color} ${link.hoverColor} 
                      shadow-md flex items-center justify-center gap-2 w-full sm:w-auto`}
            whileHover={{ y: -4, rotateZ: 0.5 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="font-medium">{link.name}</span>
            <ExternalLink size={16} />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonalityTestLinks;
