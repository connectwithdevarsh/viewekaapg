import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Resident, Payment } from "@shared/schema";

type PaymentWithResident = Payment & { resident: Resident };

export default function ResidentsTable() {
  const { toast } = useToast();

  const { data: residents, isLoading: residentsLoading } = useQuery({
    queryKey: ['/api/residents'],
    queryFn: async () => {
      const response = await fetch('/api/residents', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 'x-pg-id': localStorage.getItem('pg-id')! }
      });
      if (!response.ok) throw new Error('Failed to fetch residents');
      return response.json() as Promise<Resident[]>;
    }
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/payments'],
    queryFn: async () => {
      const response = await fetch('/api/payments', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 'x-pg-id': localStorage.getItem('pg-id')! }
      });
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json() as Promise<PaymentWithResident[]>;
    }
  });

  const deleteResident = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/residents/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/residents'] });
      toast({
        title: "Success",
        description: "Resident deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete resident",
        variant: "destructive",
      });
    }
  });

  if (residentsLoading || paymentsLoading) {
    return (
      <Card className="glass-card border-purple-500/20">
        <CardContent className="p-6">
          <div className="text-center text-purple-200/60">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const getPayoutStatus = (residentId: string) => {
    if (!payments) return null;
    const residentPayments = payments.filter(p => p.residentId === residentId);
    if (residentPayments.length === 0) {
      return <span className="text-purple-300/50 text-sm">No Records</span>;
    }

    const pendingPayments = residentPayments.filter(p => p.status !== "paid");
    if (pendingPayments.length > 0) {
      return (
        <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1 w-max">
          <AlertCircle className="w-3 h-3" />
          {pendingPayments.length} Pending
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1 w-max">
        <CheckCircle2 className="w-3 h-3" />
        Up to date
      </Badge>
    );
  };

  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <CardTitle className="text-xl text-white">Current Residents</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-purple-500/10 border-b border-purple-500/20">
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Name</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Mobile</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Room No</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">College</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Room Type</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Joining Date</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Payout Status</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {residents?.map((resident) => (
                <tr key={resident.id} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                  <td className="px-4 py-3 text-white">{resident.name}</td>
                  <td className="px-4 py-3 text-purple-200/70">{resident.mobile}</td>
                  <td className="px-4 py-3 text-purple-200/70">{resident.roomNumber}</td>
                  <td className="px-4 py-3 text-purple-200/70">{resident.college}</td>
                  <td className="px-4 py-3 text-purple-200/70">{resident.roomType}</td>
                  <td className="px-4 py-3 text-purple-200/70">
                    {new Date(resident.joiningDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {getPayoutStatus(resident.id)}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteResident.mutate(resident.id)}
                      disabled={deleteResident.isPending}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!residents || residents.length === 0) && (
            <div className="text-center py-8 text-purple-300/50">
              No residents found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
