import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResidentsTable from "./residents-table";
import AddResidentForm from "./add-resident-form";
import PaymentTracker from "./payment-tracker";
import RoomStatus from "./room-status";
import InquiriesList from "./inquiries-list";
import ExpenseManagement from "./expense-management";
import { LogOut, LayoutDashboard, Users, UserPlus, CreditCard, Building2, MessageSquare, Sparkles, Receipt, RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminSection = "residents" | "add-resident" | "payments" | "rooms" | "inquiries" | "expenses";

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>("residents");
  const [pgLocation, setPgLocation] = useState(localStorage.getItem('pg-id') || "chanakyapuri");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    if (!localStorage.getItem('pg-id')) {
      localStorage.setItem('pg-id', "chanakyapuri");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    onLogout();
  };

  const handleLocationChange = (val: string) => {
    localStorage.setItem('pg-id', val);
    setPgLocation(val);
    window.location.reload();
  };

  const navItems = [
    { id: "residents" as AdminSection, label: "View Residents", icon: Users },
    { id: "add-resident" as AdminSection, label: "Add Resident", icon: UserPlus },
    { id: "payments" as AdminSection, label: "Payments", icon: CreditCard },
    { id: "expenses" as AdminSection, label: "Expenses", icon: Receipt },
    { id: "rooms" as AdminSection, label: "Room Status", icon: Building2 },
    { id: "inquiries" as AdminSection, label: "Inquiries", icon: MessageSquare }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "residents":
        return <ResidentsTable />;
      case "add-resident":
        return <AddResidentForm />;
      case "payments":
        return <PaymentTracker />;
      case "expenses":
        return <ExpenseManagement />;
      case "rooms":
        return <RoomStatus />;
      case "inquiries":
        return <InquiriesList />;
      default:
        return <ResidentsTable />;
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,25%,8%)]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <nav className="bg-[hsl(220,25%,10%)]/80 backdrop-blur-xl border-b border-purple-500/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-purple-300/60">EKAA PG</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={pgLocation} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-[220px] bg-[hsl(220,25%,12%)] border-purple-500/20 text-white">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(220,25%,12%)] border-purple-500/20">
                  <SelectItem value="chanakyapuri" className="text-white hover:bg-purple-500/20 font-bold">EKAA PG (Chanakyapuri)</SelectItem>
                  <SelectItem value="khatraj" className="text-indigo-200 hover:bg-indigo-500/20 font-bold">EKAA PG (Khatraj)</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} size={16} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="mr-2" size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Navigation */}
        <Card className="mb-8 glass-card border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={
                      activeSection === item.id
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                        : "bg-[hsl(220,25%,12%)] text-purple-200/70 hover:text-white hover:bg-purple-500/20 border border-purple-500/20"
                    }
                  >
                    <Icon className="mr-2" size={16} />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}
