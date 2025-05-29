import React from 'react';
import { FileText, Video, Link as LinkIcon, Download } from 'lucide-react';

const ResourceList = ({ resources }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'link':
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Lesson Resources</h3>
      <div className="divide-y divide-gray-100">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-3 hover:bg-gray-50 transition-colors rounded-lg px-4 -mx-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {getIcon(resource.type)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                <p className="text-sm text-gray-500 capitalize">{resource.type}</p>
              </div>
            </div>
            <Download className="w-5 h-5 text-gray-400" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;