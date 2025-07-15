import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, BarChart3, FileText, Video, Calendar, Award, Shield } from 'lucide-react';

export function LandingPage() {
  const [accessCode, setAccessCode] = useState('');
  const navigate = useNavigate();

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim()) {
      // For now, route based on simple codes - in production this would validate tokens
      if (accessCode.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else if (accessCode.toLowerCase().includes('tutor')) {
        navigate('/tutor');
      } else if (accessCode.toLowerCase().includes('student')) {
        navigate('/student');
      } else if (accessCode.toLowerCase().includes('parent')) {
        navigate('/parent');
      } else {
        // Default to student portal for demo
        navigate('/student');
      }
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Digital Learning Materials',
      description: 'Access lesson notes, homework, and tests all in one place'
    },
    {
      icon: Users,
      title: 'Tutor-Student Connection',
      description: 'Direct communication and feedback between tutors and students'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Visual analytics and performance monitoring'
    },
    {
      icon: FileText,
      title: 'Assignment Management',
      description: 'Upload, submit, and grade assignments seamlessly'
    },
    {
      icon: Video,
      title: 'Virtual Lessons',
      description: 'Schedule and track online tutoring sessions'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Automated lesson planning and reminders'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Track milestones and celebrate student success'
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Passwordless authentication via secure links'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                Yolymatics Tutorials
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground/80 mb-4">
                Learning Management Dashboard
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A comprehensive tutoring platform connecting students, tutors, and parents 
                in an integrated learning ecosystem.
              </p>
            </div>

            {/* Access Portal */}
            <Card className="max-w-md mx-auto glass-effect border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Access Your Portal</CardTitle>
                <CardDescription>
                  Enter your secure access code to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAccessSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter access code..."
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="text-center"
                  />
                  <Button 
                    type="submit" 
                    className="w-full brand-gradient hover:opacity-90 text-white font-medium"
                  >
                    Access Portal
                  </Button>
                </form>
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-muted-foreground text-center">
                    <p>Demo codes: admin, tutor, student, parent</p>
                  </div>
                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/login')}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Sign In to Your Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Platform Features</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for effective online tutoring and student management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-8">About Yolymatics Tutorials</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-hover">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">For Students</h4>
                  <p className="text-sm text-muted-foreground">
                    Access lessons, submit assignments, track progress, and communicate with tutors
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">For Tutors</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage students, create lessons, grade assignments, and track student progress
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">For Parents</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor progress, view assignments, track lessons, and manage tutoring hours
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-2">
            © 2024 Yolymatics Tutorials. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Visit us at{' '}
            <a 
              href="https://www.yolymaticstutorials.com" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.yolymaticstutorials.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}