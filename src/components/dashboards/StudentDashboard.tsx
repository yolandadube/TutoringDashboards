import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  User,
  MessageSquare,
  BarChart3
} from 'lucide-react';

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock student data
  const studentData = {
    name: 'Alex Johnson',
    grade: 'Grade 10',
    totalHours: 50,
    usedHours: 32,
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    averageScore: 87,
    completedAssignments: 24,
    pendingAssignments: 3
  };

  const upcomingLessons = [
    { id: 1, subject: 'Mathematics', tutor: 'Dr. Smith', date: '2024-01-15', time: '14:00', topic: 'Calculus Derivatives' },
    { id: 2, subject: 'Physics', tutor: 'Prof. Johnson', date: '2024-01-16', time: '10:00', topic: 'Quantum Mechanics' },
    { id: 3, subject: 'Chemistry', tutor: 'Dr. Brown', date: '2024-01-17', time: '16:00', topic: 'Organic Compounds' }
  ];

  const recentHomework = [
    { id: 1, title: 'Calculus Problem Set 5', subject: 'Mathematics', dueDate: '2024-01-18', status: 'pending', score: null },
    { id: 2, title: 'Physics Lab Report', subject: 'Physics', dueDate: '2024-01-16', status: 'submitted', score: null },
    { id: 3, title: 'Chemical Equations Worksheet', subject: 'Chemistry', dueDate: '2024-01-14', status: 'graded', score: 92 }
  ];

  const performanceData = [
    { subject: 'Mathematics', score: 89, trend: 'up' },
    { subject: 'Physics', score: 85, trend: 'stable' },
    { subject: 'Chemistry', score: 87, trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Portal</h1>
            <p className="text-muted-foreground">Welcome back, {studentData.name}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-primary border-primary">
              {studentData.grade}
            </Badge>
            <div className="text-right">
              <p className="text-sm font-medium">{studentData.totalHours - studentData.usedHours} hours remaining</p>
              <div className="w-24">
                <Progress value={(studentData.usedHours / studentData.totalHours) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{studentData.averageScore}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{studentData.completedAssignments}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-warning/10">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{studentData.pendingAssignments}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours Used</p>
                <p className="text-2xl font-bold">{studentData.usedHours}/{studentData.totalHours}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="homework">Homework</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingLessons.map((lesson) => (
                      <div key={lesson.id} className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{lesson.subject}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                          </div>
                          <Badge variant="outline">{lesson.date}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {lesson.tutor}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {lesson.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Homework */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Homework
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentHomework.map((hw) => (
                      <div key={hw.id} className="p-3 rounded-lg border bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{hw.title}</h4>
                            <p className="text-sm text-muted-foreground">{hw.subject}</p>
                          </div>
                          <Badge 
                            variant={hw.status === 'graded' ? 'default' : hw.status === 'submitted' ? 'secondary' : 'destructive'}
                          >
                            {hw.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Due: {hw.dueDate}</span>
                          {hw.score && <span className="font-medium text-success">Score: {hw.score}%</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Detailed lesson schedule and calendar will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="homework" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Homework & Assignments</CardTitle>
                <Button className="brand-gradient text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Assignment
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Homework submission and tracking interface will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Academic Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceData.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{subject.subject}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{subject.score}%</span>
                          <TrendingUp className={`h-4 w-4 ${subject.trend === 'up' ? 'text-success' : 'text-muted-foreground'}`} />
                        </div>
                      </div>
                      <Progress value={subject.score} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Learning Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Access to lesson notes, study materials, and resources will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}