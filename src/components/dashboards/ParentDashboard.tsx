import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  FileText, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  BookOpen,
  MessageSquare,
  DollarSign
} from 'lucide-react';

export function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock parent/student data
  const childData = {
    name: 'Alex Johnson',
    grade: 'Grade 10',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    totalHours: 50,
    usedHours: 32,
    averageScore: 87,
    attendanceRate: 95,
    upcomingLessons: 3,
    pendingAssignments: 2
  };

  const recentLessons = [
    { id: 1, subject: 'Mathematics', tutor: 'Dr. Smith', date: '2024-01-12', topic: 'Calculus', summary: 'Covered derivatives and practiced problem-solving techniques.' },
    { id: 2, subject: 'Physics', tutor: 'Prof. Johnson', date: '2024-01-11', topic: 'Mechanics', summary: 'Studied Newton\'s laws and motion equations.' },
    { id: 3, subject: 'Chemistry', tutor: 'Dr. Brown', date: '2024-01-10', topic: 'Organic Chemistry', summary: 'Learned about molecular structures and reactions.' }
  ];

  const assignmentProgress = [
    { id: 1, title: 'Calculus Problem Set 5', subject: 'Mathematics', dueDate: '2024-01-18', status: 'in-progress', score: null },
    { id: 2, title: 'Physics Lab Report', subject: 'Physics', dueDate: '2024-01-16', status: 'submitted', score: null },
    { id: 3, title: 'Chemical Equations Worksheet', subject: 'Chemistry', dueDate: '2024-01-14', status: 'graded', score: 92 }
  ];

  const performanceMetrics = [
    { subject: 'Mathematics', currentScore: 89, previousScore: 85, trend: 'up' },
    { subject: 'Physics', currentScore: 85, previousScore: 83, trend: 'up' },
    { subject: 'Chemistry', currentScore: 87, previousScore: 89, trend: 'down' }
  ];

  const upcomingSchedule = [
    { id: 1, subject: 'Mathematics', tutor: 'Dr. Smith', date: '2024-01-15', time: '14:00' },
    { id: 2, subject: 'Physics', tutor: 'Prof. Johnson', date: '2024-01-16', time: '10:00' },
    { id: 3, subject: 'Chemistry', tutor: 'Dr. Brown', date: '2024-01-17', time: '16:00' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Yolymatics Tutorials - Parent</h1>
            <p className="text-muted-foreground">Monitoring {childData.name}'s Progress</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-primary border-primary">
              {childData.grade}
            </Badge>
            <div className="text-right">
              <p className="text-sm font-medium">{childData.totalHours - childData.usedHours} hours remaining</p>
              <div className="w-24">
                <Progress value={(childData.usedHours / childData.totalHours) * 100} className="h-2" />
              </div>
            </div>
            {childData.totalHours - childData.usedHours <= 5 && (
              <Badge variant="destructive">Low Balance</Badge>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{childData.averageScore}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold">{childData.attendanceRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-warning/10">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Lessons</p>
                <p className="text-2xl font-bold">{childData.upcomingLessons}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Work</p>
                <p className="text-2xl font-bold">{childData.pendingAssignments}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Recent Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLessons.map((lesson) => (
                      <div key={lesson.id} className="p-3 rounded-lg border bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{lesson.subject}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                          </div>
                          <Badge variant="outline">{lesson.date}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{lesson.summary}</p>
                        <p className="text-xs text-muted-foreground">Tutor: {lesson.tutor}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceMetrics.map((metric) => (
                      <div key={metric.subject} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{metric.subject}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold">{metric.currentScore}%</span>
                            <div className={`flex items-center ${metric.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                              <TrendingUp className={`h-3 w-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                              <span className="text-xs ml-1">
                                {Math.abs(metric.currentScore - metric.previousScore)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <Progress value={metric.currentScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hours Usage Alert */}
            {childData.totalHours - childData.usedHours <= 5 && (
              <Card className="border-warning bg-warning/5">
                <CardContent className="flex items-center space-x-4 pt-6">
                  <AlertCircle className="h-6 w-6 text-warning" />
                  <div className="flex-1">
                    <h4 className="font-medium text-warning">Low Tutoring Hours Alert</h4>
                    <p className="text-sm text-muted-foreground">
                      Your child has only {childData.totalHours - childData.usedHours} hours remaining. 
                      Consider purchasing additional hours to continue uninterrupted learning.
                    </p>
                  </div>
                  <Button variant="outline" className="border-warning text-warning hover:bg-warning/10">
                    Purchase Hours
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Academic Progress Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed progress charts and analytics will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Lesson History & Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Complete lesson history with tutor notes and summaries will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Assignment Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignmentProgress.map((assignment) => (
                    <div key={assignment.id} className="p-3 rounded-lg border bg-card/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                        </div>
                        <Badge 
                          variant={
                            assignment.status === 'graded' ? 'default' : 
                            assignment.status === 'submitted' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Due: {assignment.dueDate}</span>
                        {assignment.score && (
                          <span className="font-medium text-success">Score: {assignment.score}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingSchedule.map((lesson) => (
                    <div key={lesson.id} className="p-3 rounded-lg border bg-card/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{lesson.subject}</h4>
                          <p className="text-sm text-muted-foreground">with {lesson.tutor}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{lesson.date}</p>
                          <p className="text-sm text-muted-foreground">{lesson.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}