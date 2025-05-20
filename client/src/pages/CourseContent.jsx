import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, BookOpen, Clock, CheckCircle, Pencil, Plus } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const CourseContent = () => {
  const { courseId, contentId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
    fetchProgress();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3050/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      }
    } catch (error) {
      toast.error('Failed to fetch course details');
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch(`http://localhost:3050/api/progress/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        setNotes(data.notes.filter(note => note.contentId === contentId));
      }
    } catch (error) {
      toast.error('Failed to fetch progress details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3050/api/progress/${courseId}/content/${contentId}/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
          }
        }
      );
      if (response.ok) {
        toast.success('Content marked as completed');
        fetchProgress();
      }
    } catch (error) {
      toast.error('Failed to mark content as completed');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:3050/api/progress/${courseId}/content/${contentId}/note`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ note: newNote })
        }
      );
      if (response.ok) {
        toast.success('Note added successfully');
        setNewNote('');
        fetchProgress();
      }
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!course || !progress) {
    return <div className="flex items-center justify-center min-h-screen">Content not found</div>;
  }

  const currentContent = course.content.find(c => c.id === contentId);
  if (!currentContent) {
    return <div className="flex items-center justify-center min-h-screen">Content not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6 text-purple-400" />
            <h3 className="font-medium">{course.title}</h3>
          </div>
          <nav className="space-y-2">
            {course.content.map((item) => (
              <Link 
                key={item.id} 
                to={`/student/course/${courseId}/content/${item.id}`}
                className={`flex items-center px-4 py-3 ${
                  item.id === contentId 
                    ? 'text-white bg-white/10 rounded-lg' 
                    : 'text-white/70 hover:bg-white/5 rounded-lg transition-colors'
                }`}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                {item.title}
                {progress.completedContent.some(c => c.contentId === item.id) && (
                  <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-medium">{currentContent.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-white/70">{currentContent.type}</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/70" />
                <span className="text-white/70">{currentContent.duration || 'N/A'} mins</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Content Display */}
          <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 mb-8">
            {currentContent.type === 'video' ? (
              <div className="aspect-video bg-black">
                <video 
                  src={currentContent.url} 
                  controls 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <article dangerouslySetInnerHTML={{ __html: currentContent.url }} />
              </div>
            )}
          </div>

          {/* Progress and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Progress */}
            <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Progress</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-white/10 rounded-full">
                      <div 
                        className="h-2 bg-purple-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-purple-400 font-medium">
                    {progress.progressPercentage}%
                  </span>
                </div>
                <Button 
                  onClick={handleComplete}
                  disabled={progress.completedContent.some(c => c.contentId === contentId)}
                  className="w-full"
                >
                  {progress.completedContent.some(c => c.contentId === contentId)
                    ? 'Completed'
                    : 'Mark as Completed'}
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Notes</h2>
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg">
                    <p className="text-white/70">{note.note}</p>
                    <p className="text-xs text-white/50 mt-2">{new Date(note.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
                <div className="flex items-center gap-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-4 text-white resize-none"
                  />
                  <Button 
                    onClick={handleAddNote}
                    className="!p-2"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseContent;
