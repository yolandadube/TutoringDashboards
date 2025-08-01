import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  Star,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { signOut, profile } = useAuth();
  const { toast } = useToast();

  // Modal states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTutor, setShowAddTutor] = useState(false);
  const [showScheduleLesson, setShowScheduleLesson] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  
  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    grade: '',
    subjects: '',
    phone: '',
    parentEmail: ''
  });
  
  const [tutorForm, setTutorForm] = useState({
    name: '',
    email: '',
    specialization: '',
    hourlyRate: '',
    experience: '',
    phone: ''
  });

  const [lessonForm, setLessonForm] = useState({
    student: '',
    tutor: '',
    subject: '',
    date: '',
    time: '',
    duration: '60',
    type: 'online'
  });

  const [fileForm, setFileForm] = useState({
    name: '',
    category: 'course-materials',
    description: '',
    file: null as File | null
  });

  // Handler functions
  const handleAddStudent = async () => {
    if (!studentForm.name || !studentForm.email || !studentForm.grade) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a temporary password for the student
      const tempPassword = `Student${Math.random().toString(36).substring(2, 8)}!`;
      
      // Create user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: studentForm.email,
        password: tempPassword,
        options: {
          data: {
            full_name: studentForm.name,
            role: 'student'
          }
        }
      });

      if (authError) {
        toast({
          title: "Error Creating Student Account",
          description: authError.message,
          variant: "destructive"
        });
        return;
      }

      if (!authData.user) {
        toast({
          title: "Error",
          description: "Failed to create user account",
          variant: "destructive"
        });
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: studentForm.email,
          full_name: studentForm.name,
          role: 'student',
          phone: studentForm.phone || null
        });

      if (profileError) {
        toast({
          title: "Error Creating Student Profile",
          description: profileError.message,
          variant: "destructive"
        });
        return;
      }

      // Create student record
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: authData.user.id,
          grade: studentForm.grade,
          subjects: studentForm.subjects ? studentForm.subjects.split(',').map(s => s.trim()) : []
        });

      if (studentError) {
        toast({
          title: "Error Creating Student Record",
          description: studentError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Student Added Successfully",
        description: `${studentForm.name} has been added. Temp password: ${tempPassword}`,
      });
      
      setStudentForm({ name: '', email: '', grade: '', subjects: '', phone: '', parentEmail: '' });
      setShowAddStudent(false);
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddTutor = async () => {
    if (!tutorForm.name || !tutorForm.email || !tutorForm.specialization) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a temporary password for the tutor
      const tempPassword = `Tutor${Math.random().toString(36).substring(2, 8)}!`;
      
      // Create user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tutorForm.email,
        password: tempPassword,
        options: {
          data: {
            full_name: tutorForm.name,
            role: 'tutor'
          }
        }
      });

      if (authError) {
        toast({
          title: "Error Creating Tutor Account",
          description: authError.message,
          variant: "destructive"
        });
        return;
      }

      if (!authData.user) {
        toast({
          title: "Error",
          description: "Failed to create user account",
          variant: "destructive"
        });
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: tutorForm.email,
          full_name: tutorForm.name,
          role: 'tutor',
          phone: tutorForm.phone || null
        });

      if (profileError) {
        toast({
          title: "Error Creating Tutor Profile",
          description: profileError.message,
          variant: "destructive"
        });
        return;
      }

      // Create tutor record
      const { error: tutorError } = await supabase
        .from('tutors')
        .insert({
          user_id: authData.user.id,
          subjects: [tutorForm.specialization],
          hourly_rate: tutorForm.hourlyRate ? parseFloat(tutorForm.hourlyRate.replace('$', '')) : null,
          qualifications: tutorForm.experience ? `${tutorForm.experience} years of experience` : null
        });

      if (tutorError) {
        toast({
          title: "Error Creating Tutor Record",
          description: tutorError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Tutor Added Successfully",
        description: `${tutorForm.name} has been added. Temp password: ${tempPassword}`,
      });
      
      setTutorForm({ name: '', email: '', specialization: '', hourlyRate: '', experience: '', phone: '' });
      setShowAddTutor(false);
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Failed to add tutor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleLesson = async () => {
    if (!lessonForm.student || !lessonForm.tutor || !lessonForm.subject || !lessonForm.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, you'd get actual student and tutor IDs
      // For now, we'll create a basic lesson record
      const scheduledDateTime = lessonForm.time 
        ? `${lessonForm.date}T${lessonForm.time}:00.000Z`
        : `${lessonForm.date}T09:00:00.000Z`;

      const { error: lessonError } = await supabase
        .from('lessons')
        .insert({
          subject: lessonForm.subject,
          scheduled_date: scheduledDateTime,
          duration_minutes: parseInt(lessonForm.duration),
          status: 'scheduled',
          topic: `${lessonForm.subject} lesson`,
          notes: `Lesson type: ${lessonForm.type}`
        });

      if (lessonError) {
        toast({
          title: "Error Scheduling Lesson",
          description: lessonError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Lesson Scheduled Successfully",
        description: `${lessonForm.subject} lesson scheduled for ${lessonForm.date} at ${lessonForm.time}`,
      });
      
      setLessonForm({ student: '', tutor: '', subject: '', date: '', time: '', duration: '60', type: 'online' });
      setShowScheduleLesson(false);
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Failed to schedule lesson. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUploadFile = async () => {
    if (!fileForm.name || !fileForm.file) {
      toast({
        title: "Missing Information",
        description: "Please provide file name and select a file",
        variant: "destructive"
      });
      return;
    }

    try {
      // Upload file to Supabase storage
      const fileExt = fileForm.file.name.split('.').pop();
      const fileName = `${Date.now()}-${fileForm.name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, fileForm.file);

      if (uploadError) {
        toast({
          title: "Error Uploading File",
          description: uploadError.message,
          variant: "destructive"
        });
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);

      // Save file record to database
      const { error: fileError } = await supabase
        .from('files')
        .insert({
          filename: fileForm.name,
          original_filename: fileForm.file.name,
          file_url: publicUrl,
          mime_type: fileForm.file.type,
          file_size: fileForm.file.size,
          associated_type: fileForm.category,
          associated_id: null
        });

      if (fileError) {
        toast({
          title: "Error Saving File Record",
          description: fileError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "File Uploaded Successfully",
        description: `${fileForm.name} has been uploaded and saved`,
      });
      
      setFileForm({ name: '', category: 'course-materials', description: '', file: null });
      setShowUploadFile(false);
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    }
  };

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
                <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
                  <DialogTrigger asChild>
                    <Button className="brand-gradient text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                      <DialogDescription>
                        Enter the student's information to add them to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                          id="name"
                          value={studentForm.name}
                          onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                          className="col-span-3"
                          placeholder="Full name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={studentForm.email}
                          onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                          className="col-span-3"
                          placeholder="student@email.com"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="grade" className="text-right">Grade</Label>
                        <Select value={studentForm.grade} onValueChange={(value) => setStudentForm({...studentForm, grade: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9th">9th Grade</SelectItem>
                            <SelectItem value="10th">10th Grade</SelectItem>
                            <SelectItem value="11th">11th Grade</SelectItem>
                            <SelectItem value="12th">12th Grade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subjects" className="text-right">Subjects</Label>
                        <Input
                          id="subjects"
                          value={studentForm.subjects}
                          onChange={(e) => setStudentForm({...studentForm, subjects: e.target.value})}
                          className="col-span-3"
                          placeholder="Math, Physics, Chemistry"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">Phone</Label>
                        <Input
                          id="phone"
                          value={studentForm.phone}
                          onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                          className="col-span-3"
                          placeholder="Student phone number"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="parentEmail" className="text-right">Parent Email</Label>
                        <Input
                          id="parentEmail"
                          type="email"
                          value={studentForm.parentEmail}
                          onChange={(e) => setStudentForm({...studentForm, parentEmail: e.target.value})}
                          className="col-span-3"
                          placeholder="parent@email.com"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddStudent}>Add Student</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Add Tutor Modal */}
                <Dialog open={showAddTutor} onOpenChange={setShowAddTutor}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Tutor</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tutorName" className="text-right">Name</Label>
                        <Input
                          id="tutorName"
                          value={tutorForm.name}
                          onChange={(e) => setTutorForm({...tutorForm, name: e.target.value})}
                          className="col-span-3"
                          placeholder="Full name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tutorEmail" className="text-right">Email</Label>
                        <Input
                          id="tutorEmail"
                          type="email"
                          value={tutorForm.email}
                          onChange={(e) => setTutorForm({...tutorForm, email: e.target.value})}
                          className="col-span-3"
                          placeholder="tutor@email.com"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="specialization" className="text-right">Specialization</Label>
                        <Select value={tutorForm.specialization} onValueChange={(value) => setTutorForm({...tutorForm, specialization: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="biology">Biology</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="hourlyRate" className="text-right">Hourly Rate</Label>
                        <Input
                          id="hourlyRate"
                          value={tutorForm.hourlyRate}
                          onChange={(e) => setTutorForm({...tutorForm, hourlyRate: e.target.value})}
                          className="col-span-3"
                          placeholder="$35"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="experience" className="text-right">Experience</Label>
                        <Input
                          id="experience"
                          value={tutorForm.experience}
                          onChange={(e) => setTutorForm({...tutorForm, experience: e.target.value})}
                          className="col-span-3"
                          placeholder="Years of experience"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tutorPhone" className="text-right">Phone</Label>
                        <Input
                          id="tutorPhone"
                          value={tutorForm.phone}
                          onChange={(e) => setTutorForm({...tutorForm, phone: e.target.value})}
                          className="col-span-3"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddTutor}>Add Tutor</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Student Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Alex Johnson', grade: '10th', subjects: ['Math', 'Physics'], hours: '18/25', performance: 87, email: 'alex@email.com' },
                      { name: 'Sarah Smith', grade: '11th', subjects: ['Chemistry', 'Biology'], hours: '22/30', performance: 92, email: 'sarah@email.com' },
                      { name: 'Mike Wilson', grade: '9th', subjects: ['Math'], hours: '5/15', performance: 78, email: 'mike@email.com' },
                      { name: 'Emma Davis', grade: '12th', subjects: ['Physics', 'Math'], hours: '28/35', performance: 95, email: 'emma@email.com' },
                      { name: 'John Brown', grade: '10th', subjects: ['Chemistry'], hours: '12/20', performance: 83, email: 'john@email.com' },
                      { name: 'Lisa Taylor', grade: '11th', subjects: ['Biology', 'Chemistry'], hours: '16/25', performance: 89, email: 'lisa@email.com' }
                    ].map((student, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <p className="text-sm text-muted-foreground">{student.grade} Grade</p>
                              <p className="text-xs text-muted-foreground">{student.email}</p>
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
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3 mr-1" />
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
                <Button className="brand-gradient text-white" onClick={() => setShowAddTutor(true)}>
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
                <Button className="brand-gradient text-white" onClick={() => setShowScheduleLesson(true)}>
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

            {/* Schedule Lesson Modal */}
            <Dialog open={showScheduleLesson} onOpenChange={setShowScheduleLesson}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Lesson</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lessonStudent" className="text-right">Student</Label>
                    <Select value={lessonForm.student} onValueChange={(value) => setLessonForm({...lessonForm, student: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alex">Alex Johnson</SelectItem>
                        <SelectItem value="sarah">Sarah Smith</SelectItem>
                        <SelectItem value="mike">Mike Wilson</SelectItem>
                        <SelectItem value="emma">Emma Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lessonTutor" className="text-right">Tutor</Label>
                    <Select value={lessonForm.tutor} onValueChange={(value) => setLessonForm({...lessonForm, tutor: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select tutor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="garcia">Dr. Maria Garcia</SelectItem>
                        <SelectItem value="wilson">Prof. James Wilson</SelectItem>
                        <SelectItem value="thompson">Dr. Sarah Thompson</SelectItem>
                        <SelectItem value="chen">Mr. David Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lessonSubject" className="text-right">Subject</Label>
                    <Select value={lessonForm.subject} onValueChange={(value) => setLessonForm({...lessonForm, subject: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lessonDate" className="text-right">Date</Label>
                    <Input
                      id="lessonDate"
                      type="date"
                      value={lessonForm.date}
                      onChange={(e) => setLessonForm({...lessonForm, date: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lessonTime" className="text-right">Time</Label>
                    <Input
                      id="lessonTime"
                      type="time"
                      value={lessonForm.time}
                      onChange={(e) => setLessonForm({...lessonForm, time: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">Duration</Label>
                    <Select value={lessonForm.duration} onValueChange={(value) => setLessonForm({...lessonForm, duration: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lessonType" className="text-right">Type</Label>
                    <Select value={lessonForm.type} onValueChange={(value) => setLessonForm({...lessonForm, type: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleScheduleLesson}>Schedule Lesson</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                <Button className="brand-gradient text-white" onClick={() => setShowUploadFile(true)}>
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

          {/* Upload File Modal */}
          <Dialog open={showUploadFile} onOpenChange={setShowUploadFile}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New File</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fileName" className="text-right">File Name</Label>
                  <Input
                    id="fileName"
                    value={fileForm.name}
                    onChange={(e) => setFileForm({...fileForm, name: e.target.value})}
                    className="col-span-3"
                    placeholder="Enter file name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fileCategory" className="text-right">Category</Label>
                  <Select value={fileForm.category} onValueChange={(value) => setFileForm({...fileForm, category: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course-materials">Course Materials</SelectItem>
                      <SelectItem value="student-submissions">Student Submissions</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                      <SelectItem value="assessments">Assessments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fileDescription" className="text-right">Description</Label>
                  <Textarea
                    id="fileDescription"
                    value={fileForm.description}
                    onChange={(e) => setFileForm({...fileForm, description: e.target.value})}
                    className="col-span-3"
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fileUpload" className="text-right">File</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={(e) => setFileForm({...fileForm, file: e.target.files?.[0] || null})}
                    className="col-span-3"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleUploadFile}>Upload File</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Tabs>
      </div>
    </div>
  );
}