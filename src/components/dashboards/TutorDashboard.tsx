import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Calendar, 
  FileText, 
  Upload,
  MessageSquare,
  CheckCircle,
  Clock,
  BookOpen,
  BarChart3,
  Star,
  Plus
} from 'lucide-react';

export function TutorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { signOut, profile } = useAuth();

  // Mock tutor data
  const tutorData = {
    name: 'Dr. Maria Garcia',
    specialization: 'Mathematics & Physics',
    totalStudents: 12,
    todayLessons: 4,
    completedLessons: 156,
    rating: 4.9,
    pendingGrading: 8
  };

  const todaySchedule = [
    { id: 1, student: 'Alex Johnson', subject: 'Mathematics', time: '09:00', duration: 60, topic: 'Calculus' },
    { id: 2, student: 'Sarah Smith', subject: 'Physics', time: '11:00', duration: 60, topic: 'Mechanics' },
    { id: 3, student: 'Mike Wilson', subject: 'Mathematics', time: '14:00', duration: 90, topic: 'Algebra' },
    { id: 4, student: 'Emma Davis', subject: 'Physics', time: '16:00', duration: 60, topic: 'Thermodynamics' }
  ];

  const myStudents = [
    { id: 1, name: 'Alex Johnson', grade: '10th', subjects: ['Mathematics'], progress: 87, lastLesson: '2024-01-12' },
    { id: 2, name: 'Sarah Smith', grade: '11th', subjects: ['Physics'], progress: 92, lastLesson: '2024-01-13' },
    { id: 3, name: 'Mike Wilson', grade: '9th', subjects: ['Mathematics'], progress: 78, lastLesson: '2024-01-11' },
    { id: 4, name: 'Emma Davis', grade: '12th', subjects: ['Physics'], progress: 95, lastLesson: '2024-01-14' }
  ];

  const pendingAssignments = [
    { id: 1, student: 'Alex Johnson', title: 'Calculus Problem Set', subject: 'Mathematics', submitted: '2024-01-13', dueGrading: '2024-01-15' },
    { id: 2, student: 'Sarah Smith', title: 'Physics Lab Report', subject: 'Physics', submitted: '2024-01-14', dueGrading: '2024-01-16' },
    { id: 3, student: 'Mike Wilson', title: 'Algebra Worksheet', subject: 'Mathematics', submitted: '2024-01-12', dueGrading: '2024-01-14' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Yolymatics Tutorials - Tutor</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-primary border-primary">
              {tutorData.specialization}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{tutorData.rating}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="ml-4"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Students</p>
                <p className="text-2xl font-bold">{tutorData.totalStudents}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-success/10">
                <Calendar className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Lessons</p>
                <p className="text-2xl font-bold">{tutorData.todayLessons}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-warning/10">
                <FileText className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Grading</p>
                <p className="text-2xl font-bold">{tutorData.pendingGrading}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
                <p className="text-2xl font-bold">{tutorData.completedLessons}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="grading">Grading</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaySchedule.map((lesson) => (
                      <div key={lesson.id} className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{lesson.student}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                          </div>
                          <Badge variant="outline">{lesson.time}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{lesson.subject}</span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {lesson.duration} min
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Pending Grading
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingAssignments.map((assignment) => (
                      <div key={assignment.id} className="p-3 rounded-lg border bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">{assignment.student}</p>
                          </div>
                          <Badge variant="destructive">Due {assignment.dueGrading}</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{assignment.subject}</span>
                          <Button size="sm" variant="outline">Grade</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  My Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myStudents.map((student) => (
                    <div key={student.id} className="p-4 rounded-lg border bg-card/50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.grade} Grade</p>
                        </div>
                        <Badge variant="outline">{student.subjects.join(', ')}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{student.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">Last lesson: {student.lastLesson}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lesson Schedule</CardTitle>
                <Button className="brand-gradient text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Weekly Schedule */}
                  <div>
                    <h4 className="font-medium mb-3">This Week's Schedule</h4>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="text-center p-2 bg-muted/50 rounded font-medium text-sm">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({length: 7}).map((_, index) => (
                        <div key={index} className="min-h-[120px] p-2 border rounded-lg bg-card/50">
                          {index === 1 && (
                            <div className="p-2 mb-2 bg-primary/10 rounded text-xs">
                              <div className="font-medium">09:00 - Alex</div>
                              <div className="text-muted-foreground">Mathematics</div>
                            </div>
                          )}
                          {index === 2 && (
                            <div className="p-2 mb-2 bg-success/10 rounded text-xs">
                              <div className="font-medium">14:00 - Sarah</div>
                              <div className="text-muted-foreground">Physics</div>
                            </div>
                          )}
                          {index === 4 && (
                            <div className="p-2 mb-2 bg-warning/10 rounded text-xs">
                              <div className="font-medium">16:00 - Mike</div>
                              <div className="text-muted-foreground">Mathematics</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Assignment Grading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingAssignments.map((assignment) => (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">{assignment.student} • {assignment.subject}</p>
                            <p className="text-xs text-muted-foreground">Submitted: {assignment.submitted}</p>
                          </div>
                          <Badge variant="destructive">Due: {assignment.dueGrading}</Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="brand-gradient text-white flex-1">
                            Grade Assignment
                          </Button>
                          <Button size="sm" variant="outline">
                            View Submission
                          </Button>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Teaching Materials
                </CardTitle>
                <Button className="brand-gradient text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Material
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Material Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium">Lesson Plans</h4>
                        <p className="text-sm text-muted-foreground">24 files</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-success" />
                        <h4 className="font-medium">Worksheets</h4>
                        <p className="text-sm text-muted-foreground">45 files</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-warning" />
                        <h4 className="font-medium">Resources</h4>
                        <p className="text-sm text-muted-foreground">31 files</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Materials */}
                  <div>
                    <h4 className="font-medium mb-3">My Materials</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'Calculus_Derivatives_Lesson.pdf', type: 'PDF', size: '3.2 MB', uploaded: '2 days ago', downloads: 12 },
                        { name: 'Physics_Lab_Guide.docx', type: 'DOC', size: '2.1 MB', uploaded: '1 week ago', downloads: 8 },
                        { name: 'Math_Formula_Sheet.pdf', type: 'PDF', size: '1.5 MB', uploaded: '2 weeks ago', downloads: 15 }
                      ].map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium">{material.name}</h5>
                              <p className="text-sm text-muted-foreground">{material.size} • {material.uploaded} • {material.downloads} downloads</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{material.type}</Badge>
                            <Button size="sm" variant="outline">Share</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}