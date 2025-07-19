import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import whiteboardService from "@/services/api/whiteboardService";

const Whiteboard = () => {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const isRTL = language === "ar" || language === "ur";

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (activeSession && canvasRef.current) {
      initializeCanvas();
    }
  }, [activeSession]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const allSessions = await whiteboardService.getAll();
      setSessions(allSessions.filter(s => s.isActive));
    } catch (error) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = strokeWidth;
    contextRef.current = context;
  };

  const startDrawing = (e) => {
    if (!activeSession) return;
    
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !activeSession) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    contextRef.current.closePath();
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const createSession = async () => {
    if (!sessionTitle.trim()) {
      toast.error("Please enter a session title");
      return;
    }

try {
      const newSession = await whiteboardService.create({
        title: sessionTitle,
        teacherId: user.Id
      });
      
      setSessions(prev => [newSession, ...prev]);
      setActiveSession(newSession);
      setShowCreateForm(false);
      setSessionTitle("");
      toast.success("Session created successfully!");
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to create session");
    }
  };

const joinSession = async (sessionId) => {
    try {
      const session = await whiteboardService.joinSession(sessionId, user.Id);
      setActiveSession(session);
      toast.success("Joined session successfully!");
    } catch (error) {
      console.error("Failed to join session:", error);
      toast.error("Failed to join session");
    }
  };

const endSession = async () => {
    if (!activeSession) return;
    
    try {
      await whiteboardService.endSession(activeSession.Id);
      setActiveSession(null);
      loadSessions();
      toast.success("Session ended");
    } catch (error) {
      console.error("Failed to end session:", error);
      toast.error("Failed to end session");
    }
  };

  const tools = [
    { name: "pen", icon: "Pen", label: "Pen" },
    { name: "eraser", icon: "Eraser", label: "Eraser" },
    { name: "text", icon: "Type", label: "Text" }
  ];

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`p-6 space-y-6 ${isRTL ? 'rtl' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('whiteboard')}</h1>
          <p className="text-gray-600 mt-1">Interactive learning sessions</p>
        </div>
        
        {user?.role === "teacher" && (
          <Button onClick={() => setShowCreateForm(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {t('createSession')}
          </Button>
        )}
      </div>

      {!activeSession ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Sessions */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Active Sessions</h2>
            
            {sessions.length === 0 ? (
              <Empty
                icon="Video"
                title="No active sessions"
                description="No whiteboard sessions are currently running"
                actionLabel={user?.role === "teacher" ? "Create Session" : undefined}
                onAction={user?.role === "teacher" ? () => setShowCreateForm(true) : undefined}
              />
            ) : (
<div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.Id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{session.title}</h3>
                        <p className="text-sm text-gray-600">
                          Teacher: {session.teacherId} • {session.studentIds.length} students
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">Live</span>
                        </div>
                      </div>
<Button
                        size="sm"
                        onClick={() => joinSession(session.Id)}
                        disabled={session.teacherId === user?.Id}
>
                        {session.teacherId === user?.Id ? "Your session" : t('joinSession')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Session Guidelines */}
          <Card variant="colored">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Use Whiteboard</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="Users" size={16} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Join or Create</h3>
                  <p className="text-sm text-gray-600">Teachers can create sessions, students can join active ones</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="PenTool" size={16} className="text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Interactive Drawing</h3>
                  <p className="text-sm text-gray-600">Use pen, eraser, and text tools to collaborate in real-time</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="MessageCircle" size={16} className="text-accent-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Real-time Learning</h3>
                  <p className="text-sm text-gray-600">Share knowledge and learn together in live sessions</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Active Whiteboard Session */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Whiteboard Canvas */}
          <div className="lg:col-span-3">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{activeSession.title}</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    {activeSession.studentIds.length} participants
</div>
                  {user?.Id === activeSession.teacherId && (
                    <Button variant="outline" size="sm" onClick={endSession}>
                      End Session
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setActiveSession(null)}>
                    Leave
                  </Button>
                </div>
              </div>
              
              <canvas
                ref={canvasRef}
                className="whiteboard-canvas w-full h-96 bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </Card>
          </div>

          {/* Tools Panel */}
          <div className="space-y-4">
            {/* Drawing Tools */}
            <Card>
              <h3 className="font-semibold text-gray-800 mb-4">Tools</h3>
              <div className="space-y-3">
                {tools.map((toolItem) => (
                  <button
                    key={toolItem.name}
                    onClick={() => setTool(toolItem.name)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                      tool === toolItem.name
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ApperIcon name={toolItem.icon} size={20} />
                    <span className="font-medium">{toolItem.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Colors */}
            <Card>
              <h3 className="font-semibold text-gray-800 mb-4">Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((colorOption) => (
                  <button
                    key={colorOption}
                    onClick={() => setColor(colorOption)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === colorOption ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </Card>

            {/* Stroke Width */}
            <Card>
              <h3 className="font-semibold text-gray-800 mb-4">Brush Size</h3>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center mt-2 text-sm text-gray-600">{strokeWidth}px</div>
            </Card>

            {/* Actions */}
            <Card>
              <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="w-full"
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Clear Canvas
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Session</h3>
            <Input
              label="Session Title"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="Enter session title..."
              className="mb-4"
            />
            <div className="flex space-x-3">
              <Button onClick={createSession} className="flex-1">
                Create Session
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateForm(false);
                  setSessionTitle("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Whiteboard;