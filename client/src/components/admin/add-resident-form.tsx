import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertResident } from "@shared/schema";
import { UserPlus } from "lucide-react";

export default function AddResidentForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertResident>({
    name: "",
    mobile: "",
    roomNumber: "",
    college: "",
    joiningDate: new Date(),
    roomType: "",
    isActive: true
  });

  const addResident = useMutation({
    mutationFn: (data: InsertResident) =>
      apiRequest("POST", "/api/residents", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/residents'] });
      toast({
        title: "Success!",
        description: "Resident added successfully",
      });
      setFormData({
        name: "",
        mobile: "",
        roomNumber: "",
        college: "",
        joiningDate: new Date(),
        roomType: "",
        isActive: true
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add resident",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.roomNumber || !formData.college || !formData.roomType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    addResident.mutate(formData);
  };

  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-green-400" />
        </div>
        <CardTitle className="text-xl text-white">Add New Resident</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-purple-200">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-purple-200">Mobile *</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomNumber" className="text-purple-200">Room Number *</Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="college" className="text-purple-200">College/Company *</Label>
            <Input
              id="college"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joiningDate" className="text-purple-200">Joining Date *</Label>
            <Input
              id="joiningDate"
              type="date"
              value={formData.joiningDate.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, joiningDate: new Date(e.target.value) })}
              className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white focus:border-purple-500/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomType" className="text-purple-200">Room Type *</Label>
            <Select
              value={formData.roomType}
              onValueChange={(value) => setFormData({ ...formData, roomType: value })}
            >
              <SelectTrigger className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white focus:border-purple-500/50">
                <SelectValue placeholder="Select Room Type" />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(220,25%,12%)] border-purple-500/20">
                <SelectItem value="1-sharing" className="text-white hover:bg-purple-500/20">1 Sharing</SelectItem>
                <SelectItem value="2-sharing" className="text-white hover:bg-purple-500/20">2 Sharing</SelectItem>
                <SelectItem value="5-sharing" className="text-white hover:bg-purple-500/20">5 Sharing</SelectItem>
                <SelectItem value="6-sharing" className="text-white hover:bg-purple-500/20">6 Sharing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              className="btn-gen text-white px-8 py-6 text-lg rounded-xl"
              disabled={addResident.isPending}
            >
              {addResident.isPending ? "Adding..." : "Add Resident"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
