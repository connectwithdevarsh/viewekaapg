import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, Shield, Lock, User } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: (data: typeof credentials) =>
      apiRequest("POST", "/api/auth/login", data),
    onSuccess: async (response) => {
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      toast({
        title: "Welcome Back!",
        description: "Login successful",
      });
      onLogin();
    },
    onError: (error: any) => {
      toast({
        title: "Access Denied",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen bg-[hsl(220,25%,8%)] flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md mx-4 relative z-10">
        <Card className="glass-card border-purple-500/20">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Shield className="text-white w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-white">
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Admin Access
                <Sparkles className="w-5 h-5 text-purple-400" />
              </span>
            </CardTitle>
            <p className="text-center text-purple-200/60 text-sm">
              Enter your credentials to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-purple-200">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <Input
                    id="username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="pl-10 bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50 focus:ring-purple-500/20"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="pl-10 bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50 focus:ring-purple-500/20"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full btn-gen text-white py-6 text-lg rounded-xl"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : "Login"}
              </Button>
              <Link href="/">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-500/10 hover:text-white"
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Website
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
