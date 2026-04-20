import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Payment, Resident } from "@shared/schema";
import { CreditCard, CheckCircle2, Plus, Trash2, Calendar, AlertCircle } from "lucide-react";

type PaymentWithResident = Payment & { resident: Resident };

export default function PaymentTracker() {
  const { toast } = useToast();
  
  // Default to current month "YYYY-MM"
  const [monthValue, setMonthValue] = useState(new Date().toISOString().slice(0, 7));
  
  // Convert "2026-04" -> "April 2026"
  const formattedDisplayMonth = useMemo(() => {
    if (!monthValue) return "";
    const date = new Date(monthValue + "-01T00:00:00");
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [monthValue]);

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [newPayment, setNewPayment] = useState({
    amount: "5000",
    dueDate: new Date().toISOString().split('T')[0]
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

  const updatePaymentStatus = useMutation({
    mutationFn: ({ id, status, paidDate }: { id: number, status: string, paidDate?: Date }) =>
      apiRequest("PUT", `/api/payments/${id}/status`, { status, paidDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      toast({ title: "Success", description: "Payment status updated successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to update payment status", variant: "destructive" });
    }
  });

  const addPayment = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/payments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      toast({ title: "Success", description: "Rent record added successfully" });
      setIsAddPaymentOpen(false);
      setNewPayment({ amount: "5000", dueDate: new Date().toISOString().split('T')[0] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to add payment", variant: "destructive" });
    }
  });

  const deletePayment = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/payments/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      toast({ title: "Success", description: "Payment record deleted successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to delete payment", variant: "destructive" });
    }
  });

  const markAsPaid = (id: number) => {
    updatePaymentStatus.mutate({ id, status: "paid", paidDate: new Date() });
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident || !newPayment.amount || !newPayment.dueDate) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    addPayment.mutate({
      residentId: selectedResident.id,
      month: formattedDisplayMonth,
      amount: newPayment.amount.toString(),
      dueDate: new Date(newPayment.dueDate),
      status: "pending"
    });
  };

  const openAddRentDialog = (resident: Resident) => {
    setSelectedResident(resident);
    setIsAddPaymentOpen(true);
  };

  if (paymentsLoading || residentsLoading) {
    return (
      <Card className="glass-card border-purple-500/20">
        <CardContent className="p-6">
          <div className="text-center text-purple-200/60">Loading monthly records...</div>
        </CardContent>
      </Card>
    );
  }

  // Sort residents primarily by room number naturally
  const sortedResidents = [...(residents || [])].sort((a, b) => {
    return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card border-purple-500/20">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Monthly Rent Register</CardTitle>
              <p className="text-sm text-purple-200/60 mt-1">Easily view and assign rent per month</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="month-picker" className="text-purple-200 whitespace-nowrap">Select Month:</Label>
            <Input 
              id="month-picker"
              type="month"
              value={monthValue}
              onChange={(e) => setMonthValue(e.target.value)}
              className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white focus:border-purple-500/50 min-w-[200px]"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-purple-500/10 border-b border-purple-500/20">
                  <th className="px-4 py-3 text-left text-purple-200 font-medium w-24">Room No</th>
                  <th className="px-4 py-3 text-left text-purple-200 font-medium">Resident Details</th>
                  <th className="px-4 py-3 text-left text-purple-200 font-medium">{formattedDisplayMonth} Rent Status</th>
                  <th className="px-4 py-3 text-right text-purple-200 font-medium">Monthly Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedResidents.map((resident) => {
                  // Find the payment record for THIS resident matching THIS selected month
                  const payment = payments?.find(p => p.residentId === resident.id && p.month === formattedDisplayMonth);
                  
                  return (
                    <tr key={resident.id} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                      <td className="px-4 py-4 text-purple-200/90 font-bold text-lg align-top">
                        {resident.roomNumber}
                      </td>
                      <td className="px-4 py-4 text-white align-top">
                        <div className="font-semibold text-base">{resident.name}</div>
                        <div className="text-xs text-purple-300/60 mt-1">{resident.roomType} | {resident.college}</div>
                        <div className="text-xs text-purple-300/60 mt-0.5">{resident.mobile}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        {payment ? (
                          <div className="space-y-2">
                             <div className="font-semibold text-gradient-gold text-lg">₹{payment.amount}</div>
                             <Badge
                                variant={payment.status === "paid" ? "default" : "destructive"}
                                className={
                                  payment.status === "paid"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                }
                              >
                                {payment.status === "paid" ? (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Paid
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                              </Badge>
                              {payment.status !== "paid" && (
                                <div className="text-xs text-red-400/80 mt-1">
                                  Due: {new Date(payment.dueDate).toLocaleDateString()}
                                </div>
                              )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-purple-300/40 text-sm italic">Not tracking rent yet</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 align-top text-right">
                        {payment ? (
                           <div className="flex gap-2 justify-end items-start flex-wrap">
                            {payment.status !== "paid" && (
                              <Button
                                size="sm"
                                onClick={() => markAsPaid(payment.id)}
                                disabled={updatePaymentStatus.isPending}
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30 shadow-sm"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Mark as Paid
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                if(window.confirm("Are you sure you want to remove this month's rent record?")) {
                                  deletePayment.mutate(payment.id);
                                }
                              }}
                              disabled={deletePayment.isPending}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 shadow-none hover:shadow-sm h-9 w-9"
                              title="Delete rent record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                             size="sm"
                             onClick={() => openAddRentDialog(resident)}
                             className="bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 border-purple-500/30 w-full sm:w-auto shadow-sm"
                          >
                             <Plus className="w-4 h-4 mr-1" />
                             Add Rent
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!sortedResidents || sortedResidents.length === 0) && (
              <div className="text-center py-12 text-purple-300/50 flex flex-col items-center">
                <AlertCircle className="w-8 h-8 mb-3 opacity-50" />
                No residents found. Add residents first to manage their monthly rent.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Specific Rent Dialog */}
      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent className="bg-[hsl(220,25%,10%)] border-purple-500/20 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              Add Rent for {formattedDisplayMonth}
            </DialogTitle>
          </DialogHeader>
          {selectedResident && (
            <form onSubmit={handleAddPayment} className="space-y-4 mt-4">
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 mb-4">
                <div className="text-sm text-purple-300/60">Resident</div>
                <div className="font-semibold text-white">{selectedResident.name}</div>
                <div className="text-sm text-purple-200/80">Room {selectedResident.roomNumber}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-purple-200">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  placeholder="e.g. 5000"
                  className="bg-[hsl(220,25%,12%)] border-purple-500/20 focus:border-purple-500/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-purple-200">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                  className="bg-[hsl(220,25%,12%)] border-purple-500/20 focus:border-purple-500/50"
                  required
                />
              </div>
              <Button type="submit" disabled={addPayment.isPending} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white mt-4 shadow-lg shadow-purple-500/30">
                {addPayment.isPending ? "Generating Record..." : `Set Rent for ${formattedDisplayMonth}`}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
