import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Upload
} from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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
            <p className="text-muted-foreground">Welcome back, Yolanda Dube</p>
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
                  {/* Student list would go here */}
                  <p className="text-muted-foreground">Student management interface will be implemented here.</p>
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
                  {/* Tutor list would go here */}
                  <p className="text-muted-foreground">Tutor management interface will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Lesson management would go here */}
                  <p className="text-muted-foreground">Lesson scheduling and management interface will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analytics & Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Analytics charts would go here */}
                  <p className="text-muted-foreground">Analytics dashboard with charts and reports will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
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
                  {/* File management would go here */}
                  <p className="text-muted-foreground">File upload and management interface will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}