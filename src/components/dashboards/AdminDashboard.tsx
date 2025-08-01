import { useState, useEffect } from 'react';
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

  // Data states
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTutor, setShowAddTutor] = useState(false);
  const [showScheduleLesson, setShowScheduleLesson] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [showViewStudent, setShowViewStudent] = useState(false);
  const [showViewTutor, setShowViewTutor] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  
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

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStudents(),
        fetchTutors(),
        fetchLessons()
      ]);
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles(full_name, email, phone)
        `);
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTutors = async () => {
    try {
      const { data, error } = await supabase
        .from('tutors')
        .select(`
          *,
          profiles(full_name, email, phone)
        `);
      
      if (error) throw error;
      setTutors(data || []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  };

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*');
      
      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('user_id', studentId);

      if (error) throw error;

      // Also delete from profiles and auth
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', studentId);

      if (profileError) throw profileError;

      toast({
        title: "Student Deleted",
        description: "Student has been successfully removed",
      });

      // Refresh data
      await fetchStudents();
    } catch (error) {
      toast({
        title: "Error Deleting Student",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteTutor = async (tutorId: string) => {
    try {
      const { error } = await supabase
        .from('tutors')
        .delete()
        .eq('user_id', tutorId);

      if (error) throw error;

      // Also delete from profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', tutorId);

      if (profileError) throw profileError;

      toast({
        title: "Tutor Deleted",
        description: "Tutor has been successfully removed",
      });

      // Refresh data
      await fetchTutors();
    } catch (error) {
      toast({
        title: "Error Deleting Tutor",
        description: error.message,
        variant: "destructive"
      });
    }
  };

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
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', studentForm.email);

      if (existingUser && existingUser.length > 0) {
        toast({
          title: "Email Already Exists",
          description: "A user with this email already exists in the system",
          variant: "destructive"
        });
        return;
      }

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
        if (authError.message.includes('already registered')) {
          toast({
            title: "Email Already Registered",
            description: "This email is already registered in the system",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error Creating Student Account",
            description: authError.message,
            variant: "destructive"
          });
        }
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
        if (profileError.message.includes('duplicate key')) {
          toast({
            title: "Duplicate Entry",
            description: "A user with this email already exists",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error Creating Student Profile",
            description: profileError.message,
            variant: "destructive"
          });
        }
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
      
      // Refresh students data
      await fetchStudents();
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
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', tutorForm.email);

      if (existingUser && existingUser.length > 0) {
        toast({
          title: "Email Already Exists",
          description: "A user with this email already exists in the system",
          variant: "destructive"
        });
        return;
      }

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
        if (authError.message.includes('already registered')) {
          toast({
            title: "Email Already Registered",
            description: "This email is already registered in the system",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error Creating Tutor Account",
            description: authError.message,
            variant: "destructive"
          });
        }
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
        if (profileError.message.includes('duplicate key')) {
          toast({
            title: "Duplicate Entry",
            description: "A user with this email already exists",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error Creating Tutor Profile",
            description: profileError.message,
            variant: "destructive"
          });
        }
        return;
      }

      // Create tutor record
      const { error: tutorError } = await supabase
        .from('tutors')
        .insert({
          user_id: authData.user.id,
          subjects: [tutorForm.specialization],
          hourly_rate: tutorForm.hourlyRate ? parseFloat(tutorForm.hourlyRate.replace('R', '').replace('$', '')) : null,
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
      
      // Refresh tutors data
      await fetchTutors();
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
      
      // Refresh lessons data
      await fetchLessons();
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

  // Real data stats
  const stats = {
    totalStudents: students.length,
    activeTutors: tutors.length,
    lessonsThisWeek: lessons.length,
    totalRevenue: 0, // Start with 0 for virgin platform
    completionRate: 0, // Start with 0 for virgin platform
    avgRating: 0 // Start with 0 for virgin platform
  };

  const recentActivities = [
    // Start with empty activities for virgin platform
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
            <Button 
              size="sm" 
              className="brand-gradient text-white"
              onClick={() => {
                toast({
                  title: "Quick Add",
                  description: "Use the Overview tab Quick Actions or specific tab Add buttons to add new items",
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Settings",
                  description: "Settings panel will be available soon",
                });
              }}
            >
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
                    {recentActivities.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No recent activity yet.</p>
                        <p className="text-xs text-muted-foreground mt-2">Activity will appear here as you use the platform.</p>
                      </div>
                    ) : (
                      recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))
                    )}
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
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setShowAddStudent(true)}>
                      <Users className="h-6 w-6 mb-2" />
                      Add Student
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setShowAddTutor(true)}>
                      <GraduationCap className="h-6 w-6 mb-2" />
                      Add Tutor
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setShowScheduleLesson(true)}>
                      <Calendar className="h-6 w-6 mb-2" />
                      Schedule Lesson
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setShowUploadFile(true)}>
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
                <Button className="brand-gradient text-white" onClick={() => setShowAddStudent(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Student Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">Loading students...</p>
                      </div>
                    ) : students.length === 0 ? (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No students found. Add some students to get started!</p>
                      </div>
                    ) : (
                      students.map((student) => (
                        <Card key={student.user_id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium">{student.profiles?.full_name || 'Unknown'}</h4>
                                <p className="text-sm text-muted-foreground">{student.grade} Grade</p>
                                <p className="text-xs text-muted-foreground">{student.profiles?.email || 'No email'}</p>
                              </div>
                              <Badge variant="outline">Student</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {student.subjects && student.subjects.length > 0 ? (
                                  student.subjects.map((subject) => (
                                    <Badge key={subject} variant="secondary" className="text-xs">
                                      {subject}
                                    </Badge>
                                  ))
                                ) : (
                                  <Badge variant="secondary" className="text-xs">No subjects</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Phone: {student.profiles?.phone || 'Not provided'}
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setShowViewStudent(true);
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${student.profiles?.full_name}?`)) {
                                      deleteStudent(student.user_id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
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
                    {loading ? (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">Loading tutors...</p>
                      </div>
                    ) : tutors.length === 0 ? (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No tutors found. Add some tutors to get started!</p>
                      </div>
                    ) : (
                      tutors.map((tutor) => (
                        <Card key={tutor.user_id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium">{tutor.profiles?.full_name || 'Unknown'}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {tutor.subjects && tutor.subjects.length > 0 ? tutor.subjects.join(', ') : 'No specialization'}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">5.0</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{tutor.profiles?.email || 'No email'}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Hourly Rate:</span>
                                <span className="font-medium">R{tutor.hourly_rate || 'Not set'}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-medium">{tutor.profiles?.phone || 'Not provided'}</span>
                              </div>
                              <div className="flex space-x-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => {
                                    setSelectedTutor(tutor);
                                    setShowViewTutor(true);
                                  }}
                                >
                                  View Profile
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${tutor.profiles?.full_name}?`)) {
                                      deleteTutor(tutor.user_id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
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
                      {lessons.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No lessons scheduled for today.</p>
                          <p className="text-xs text-muted-foreground mt-2">Schedule lessons to see them here.</p>
                        </div>
                      ) : (
                        lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 text-center">
                                <span className="font-medium">
                                  {lesson.scheduled_date ? new Date(lesson.scheduled_date).toLocaleTimeString('en-ZA', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    hour12: false 
                                  }) : 'TBD'}
                                </span>
                              </div>
                              <div>
                                <h5 className="font-medium">{lesson.subject || 'Unknown Subject'}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {lesson.duration_minutes ? `${lesson.duration_minutes} minutes` : 'Duration TBD'}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant={
                                lesson.status === 'completed' ? 'default' : 
                                lesson.status === 'in-progress' ? 'secondary' : 
                                'outline'
                              }
                            >
                              {lesson.status || 'scheduled'}
                            </Badge>
                          </div>
                        ))
                      )}
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
                        <p className="text-2xl font-bold text-primary">{stats.completionRate}%</p>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-success">{stats.avgRating}</p>
                        <p className="text-sm text-muted-foreground">Avg Rating</p>
                      </div>
                    </div>
                    {['Mathematics', 'Physics', 'Chemistry', 'Biology'].length > 0 ? (
                      <div className="space-y-3">
                        {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subject) => (
                          <div key={subject} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{subject}</span>
                              <span>0%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `0%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm">No performance data yet</p>
                      </div>
                    )}
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
                        <p className="text-2xl font-bold text-primary">R{stats.totalRevenue}</p>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-success">0%</p>
                        <p className="text-sm text-muted-foreground">Growth</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Top Performing Tutors</h5>
                      {tutors.length > 0 ? (
                        tutors.slice(0, 3).map((tutor) => (
                          <div key={tutor.user_id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm">{tutor.profiles?.full_name || 'Unknown'}</span>
                            <span className="font-medium">R0</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground text-sm">No tutors yet</p>
                        </div>
                      )}
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
                        <p className="text-sm text-muted-foreground">0 files</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-success" />
                        <h4 className="font-medium">Student Submissions</h4>
                        <p className="text-sm text-muted-foreground">0 files</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-warning" />
                        <h4 className="font-medium">Resources</h4>
                        <p className="text-sm text-muted-foreground">0 files</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Files */}
                  <div>
                    <h4 className="font-medium mb-3">Recent Files</h4>
                    <div className="space-y-2">
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No files uploaded yet.</p>
                        <p className="text-xs text-muted-foreground mt-2">Upload files to see them here.</p>
                      </div>
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

        {/* All Modals - Placed outside tabs for proper functionality */}
        
        {/* Add Student Modal */}
        <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
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
                  placeholder="R350"
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
                    {students.map((student) => (
                      <SelectItem key={student.user_id} value={student.user_id}>
                        {student.profiles?.full_name || 'Unknown'}
                      </SelectItem>
                    ))}
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
                    {tutors.map((tutor) => (
                      <SelectItem key={tutor.user_id} value={tutor.user_id}>
                        {tutor.profiles?.full_name || 'Unknown'}
                      </SelectItem>
                    ))}
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

        {/* View Student Modal */}
        <Dialog open={showViewStudent} onOpenChange={setShowViewStudent}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Name:</Label>
                  <span className="col-span-3">{selectedStudent.profiles?.full_name || 'Unknown'}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Email:</Label>
                  <span className="col-span-3">{selectedStudent.profiles?.email || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Grade:</Label>
                  <span className="col-span-3">{selectedStudent.grade || 'Not specified'}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Phone:</Label>
                  <span className="col-span-3">{selectedStudent.profiles?.phone || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Subjects:</Label>
                  <div className="col-span-3">
                    {selectedStudent.subjects && selectedStudent.subjects.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedStudent.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No subjects assigned</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewStudent(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Tutor Modal */}
        <Dialog open={showViewTutor} onOpenChange={setShowViewTutor}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tutor Details</DialogTitle>
            </DialogHeader>
            {selectedTutor && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Name:</Label>
                  <span className="col-span-3">{selectedTutor.profiles?.full_name || 'Unknown'}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Email:</Label>
                  <span className="col-span-3">{selectedTutor.profiles?.email || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Phone:</Label>
                  <span className="col-span-3">{selectedTutor.profiles?.phone || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Hourly Rate:</Label>
                  <span className="col-span-3">R{selectedTutor.hourly_rate || 'Not set'}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Subjects:</Label>
                  <div className="col-span-3">
                    {selectedTutor.subjects && selectedTutor.subjects.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedTutor.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No specializations assigned</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Qualifications:</Label>
                  <span className="col-span-3">{selectedTutor.qualifications || 'Not provided'}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewTutor(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}