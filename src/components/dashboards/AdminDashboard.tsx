import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Settings, 
  Plus,
  GraduationCap,
  UserCheck,
  Clock,
  TrendingUp,
  FileText,
  Upload,
  Star
} from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { signOut, profile } = useAuth();

  // Mock data - in production this would come from Supabase
  const stats = {
    totalStudents: 24,
    activeTutors: 8,
    lessonsThisWeek: 45,
    totalRevenue: 12500,
    completionRate: 92,
    avgRating: 4.8
  };

  const recentActivities = [
    { id: 1, type: 'student_added', message: 'New student Sarah Johnson enrolled', time: '2 hours ago' },
    { id: 2, type: 'lesson_completed', message: 'Math lesson completed by John Doe', time: '4 hours ago' },
    { id: 3, type: 'assignment_submitted', message: '15 assignments submitted today', time: '6 hours ago' },
    { id: 4, type: 'tutor_feedback', message: 'New feedback from Maria Garcia', time: '1 day ago' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Yolymatics Tutorials - Admin</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm" className="brand-gradient text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={signOut}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-success/10">
                <GraduationCap className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Tutors</p>
                <p className="text-2xl font-bold">{stats.activeTutors}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-warning/10">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lessons This Week</p>
                <p className="text-2xl font-bold">{stats.lessonsThisWeek}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="tutors">Tutors</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      Add Student
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <GraduationCap className="h-6 w-6 mb-2" />
                      Add Tutor
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Calendar className="h-6 w-6 mb-2" />
                      Schedule Lesson
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      Upload Materials
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Student Management</CardTitle>
                <Button className="brand-gradient text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Student Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Alex Johnson', grade: '10th', subjects: ['Math', 'Physics'], hours: '18/25', performance: 87 },
                      { name: 'Sarah Smith', grade: '11th', subjects: ['Chemistry', 'Biology'], hours: '22/30', performance: 92 },
                      { name: 'Mike Wilson', grade: '9th', subjects: ['Math'], hours: '5/15', performance: 78 },
                      { name: 'Emma Davis', grade: '12th', subjects: ['Physics', 'Math'], hours: '28/35', performance: 95 },
                      { name: 'John Brown', grade: '10th', subjects: ['Chemistry'], hours: '12/20', performance: 83 },
                      { name: 'Lisa Taylor', grade: '11th', subjects: ['Biology', 'Chemistry'], hours: '16/25', performance: 89 }
                    ].map((student, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <p className="text-sm text-muted-foreground">{student.grade} Grade</p>
                            </div>
                            <Badge variant="outline">{student.performance}%</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {student.subjects.map((subject) => (
                                <Badge key={subject} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Hours: {student.hours}
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                View Details
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutors" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tutor Management</CardTitle>
                <Button className="brand-gradient text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tutor
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tutor Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Dr. Maria Garcia', specialization: 'Mathematics & Physics', students: 12, rating: 4.9, hourlyRate: '$45' },
                      { name: 'Prof. James Wilson', specialization: 'Chemistry & Biology', students: 8, rating: 4.7, hourlyRate: '$40' },
                      { name: 'Dr. Sarah Thompson', specialization: 'Mathematics', students: 15, rating: 4.8, hourlyRate: '$42' },
                      { name: 'Mr. David Chen', specialization: 'Physics', students: 10, rating: 4.6, hourlyRate: '$38' }
                    ].map((tutor, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{tutor.name}</h4>
                              <p className="text-sm text-muted-foreground">{tutor.specialization}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{tutor.rating}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Students:</span>
                              <span className="font-medium">{tutor.students}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Hourly Rate:</span>
                              <span className="font-medium">{tutor.hourlyRate}</span>
                            </div>
                            <div className="flex space-x-2 mt-3">
                              <Button size="sm" variant="outline" className="flex-1">
                                View Profile
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lesson Management</CardTitle>
                <Button className="brand-gradient text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Lesson
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Today's Lessons */}
                  <div>
                    <h4 className="font-medium mb-3">Today's Lessons</h4>
                    <div className="space-y-2">
                      {[
                        { student: 'Alex Johnson', tutor: 'Dr. Garcia', subject: 'Mathematics', time: '09:00', status: 'scheduled' },
                        { student: 'Sarah Smith', tutor: 'Prof. Wilson', subject: 'Chemistry', time: '11:00', status: 'in-progress' },
                        { student: 'Mike Wilson', tutor: 'Dr. Garcia', subject: 'Mathematics', time: '14:00', status: 'scheduled' },
                        { student: 'Emma Davis', tutor: 'Dr. Thompson', subject: 'Physics', time: '16:00', status: 'completed' }
                      ].map((lesson, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 text-center">
                              <span className="font-medium">{lesson.time}</span>
                            </div>
                            <div>
                              <h5 className="font-medium">{lesson.student}</h5>
                              <p className="text-sm text-muted-foreground">{lesson.subject} with {lesson.tutor}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={
                              lesson.status === 'completed' ? 'default' : 
                              lesson.status === 'in-progress' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {lesson.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">92%</p>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-success">4.8</p>
                        <p className="text-sm text-muted-foreground">Avg Rating</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subject) => (
                        <div key={subject} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{subject}</span>
                            <span>{Math.floor(Math.random() * 20) + 80}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${Math.floor(Math.random() * 20) + 80}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">$12,500</p>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-success">+15%</p>
                        <p className="text-sm text-muted-foreground">Growth</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Top Performing Tutors</h5>
                      {[
                        { name: 'Dr. Maria Garcia', revenue: '$3,200' },
                        { name: 'Prof. James Wilson', revenue: '$2,800' },
                        { name: 'Dr. Sarah Thompson', revenue: '$2,400' }
                      ].map((tutor) => (
                        <div key={tutor.name} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm">{tutor.name}</span>
                          <span className="font-medium">{tutor.revenue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  File Management
                </CardTitle>
                <Button className="brand-gradient text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* File Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium">Course Materials</h4>
                        <p className="text-sm text-muted-foreground">124 files</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-success" />
                        <h4 className="font-medium">Student Submissions</h4>
                        <p className="text-sm text-muted-foreground">67 files</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-warning" />
                        <h4 className="font-medium">Resources</h4>
                        <p className="text-sm text-muted-foreground">89 files</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Files */}
                  <div>
                    <h4 className="font-medium mb-3">Recent Files</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'Calculus_Worksheet_Ch5.pdf', type: 'PDF', size: '2.4 MB', uploaded: '2 hours ago', uploader: 'Dr. Garcia' },
                        { name: 'Physics_Lab_Instructions.docx', type: 'DOC', size: '1.8 MB', uploaded: '5 hours ago', uploader: 'Prof. Wilson' },
                        { name: 'Chemistry_Formula_Sheet.pdf', type: 'PDF', size: '3.1 MB', uploaded: '1 day ago', uploader: 'Dr. Brown' }
                      ].map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium">{file.name}</h5>
                              <p className="text-sm text-muted-foreground">{file.size} • {file.uploaded} • {file.uploader}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{file.type}</Badge>
                            <Button size="sm" variant="outline">Download</Button>
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