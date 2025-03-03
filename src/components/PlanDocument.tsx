
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check, FileCode, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormContext } from '@/context/FormContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlanDocumentProps {
  plan: string;
}

const PlanDocument: React.FC<PlanDocumentProps> = ({ plan }) => {
  const { formData } = useFormContext();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [mindmapOpen, setMindmapOpen] = useState(false);
  const mindmapRef = useRef<HTMLDivElement>(null);
  const [exportFormat, setExportFormat] = useState<'svg' | 'html'>('svg');
  const markmapInstance = useRef<Markmap | null>(null);

  // Initialize mindmap when dialog opens
  useEffect(() => {
    if (mindmapOpen && mindmapRef.current) {
      const transformer = new Transformer();
      const { root } = transformer.transform(plan);
      
      // Clear previous mindmap if exists
      if (mindmapRef.current) {
        mindmapRef.current.innerHTML = '';
      }
      
      // Create new mindmap
      setTimeout(() => {
        if (mindmapRef.current) {
          markmapInstance.current = Markmap.create(mindmapRef.current, undefined, root);
        }
      }, 100);
    }
  }, [mindmapOpen, plan]);

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([plan], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    
    // Create a personalized filename based on personality type
    let filename = 'personal-growth-plan';
    if (formData.personalityType.mbti) {
      filename += `-${formData.personalityType.mbti.toLowerCase()}`;
    }
    filename += '.md';
    
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: language === 'en' ? "Plan successfully downloaded" : "计划成功下载",
      description: language === 'en' ? `Saved as ${filename}` : `已保存为 ${filename}`,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(plan);
    setCopied(true);
    toast({
      title: language === 'en' ? "Content copied to clipboard" : "内容已复制到剪贴板",
      description: language === 'en' ? "You can now paste your growth plan anywhere" : "您现在可以将成长计划粘贴到任何地方",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMindmapExport = () => {
    if (!markmapInstance.current) return;
    
    if (exportFormat === 'svg') {
      // Export as SVG
      const svgEl = mindmapRef.current?.querySelector('svg');
      if (!svgEl) return;
      
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `mindmap-${formData.personalityType.mbti?.toLowerCase() || 'plan'}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      // Export as HTML
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Growth Plan Mindmap</title>
          <script src="https://cdn.jsdelivr.net/npm/d3@6"></script>
          <script src="https://cdn.jsdelivr.net/npm/markmap-view"></script>
          <style>
            body { margin: 0; }
            #mindmap { height: 100vh; width: 100vw; }
          </style>
        </head>
        <body>
          <div id="mindmap"></div>
          <script>
            // Embedding the markdown content
            const markdown = ${JSON.stringify(plan)};
            // Load markmap
            const { Transformer } = window.markmapLib;
            const { Markmap } = window.markmap;
            const transformer = new Transformer();
            const { root } = transformer.transform(markdown);
            const mm = Markmap.create('#mindmap', null, root);
          </script>
        </body>
        </html>
      `;
      
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = htmlUrl;
      downloadLink.download = `mindmap-${formData.personalityType.mbti?.toLowerCase() || 'plan'}.html`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    
    toast({
      title: language === 'en' ? "Mindmap exported successfully" : "思维导图导出成功",
      description: language === 'en' 
        ? `Saved as ${exportFormat.toUpperCase()} format` 
        : `已保存为 ${exportFormat.toUpperCase()} 格式`,
    });
  };

  // Convert markdown to HTML (simple implementation)
  const renderMarkdown = (markdown: string) => {
    const formattedText = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\s*\n\* (.*)/gm, '<ul class="list-disc ml-6 mb-4 space-y-1"><li>$1</li></ul>')
      .replace(/^\* (.*)/gm, '<li>$1</li>')
      // Number lists
      .replace(/^\s*\n\d\. (.*)/gm, '<ol class="list-decimal ml-6 mb-4 space-y-1"><li>$1</li></ol>')
      .replace(/^\d\. (.*)/gm, '<li>$1</li>')
      // Line breaks
      .replace(/\n/g, '<br />');

    return { __html: formattedText };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800">
            {language === 'en' ? 'Your Personalized Growth Plan' : '您的个性化成长计划'}
          </h2>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
              onClick={handleCopy}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? (language === 'en' ? 'Copied' : '已复制') : (language === 'en' ? 'Copy' : '复制')}</span>
            </Button>
            
            <Dialog open={mindmapOpen} onOpenChange={setMindmapOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <FileCode size={16} />
                  <span>{language === 'en' ? 'Mindmap' : '思维导图'}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{language === 'en' ? 'Plan Mindmap' : '计划思维导图'}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Select
                      value={exportFormat}
                      onValueChange={(value: 'svg' | 'html') => setExportFormat(value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder={language === 'en' ? 'Export format' : '导出格式'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="svg">SVG</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleMindmapExport}
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <FileImage size={16} />
                      <span>{language === 'en' ? 'Export' : '导出'}</span>
                    </Button>
                  </div>
                </div>
                <div 
                  ref={mindmapRef}
                  className="w-full h-[60vh] overflow-auto border border-gray-200 rounded-md p-4 bg-white"
                ></div>
              </DialogContent>
            </Dialog>
            
            <Button
              size="sm"
              className="bg-accent text-white flex items-center space-x-1 hover:bg-accent/90"
              onClick={handleDownload}
            >
              <Download size={16} />
              <span>{language === 'en' ? 'Download' : '下载'}</span>
            </Button>
          </div>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={renderMarkdown(plan)} />
        </div>
      </div>
    </motion.div>
  );
};

export default PlanDocument;
