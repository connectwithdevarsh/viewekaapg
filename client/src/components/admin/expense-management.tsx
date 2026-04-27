import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Receipt, Plus, ArrowUpRight, ArrowDownRight, Trash2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Expense } from "@shared/schema";

export default function ExpenseManagement() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    type: "expense",
    category: "Maintenance",
    date: new Date().toISOString().split('T')[0]
  });

  const [monthValue, setMonthValue] = useState(new Date().toISOString().slice(0, 7));

  const formattedDisplayMonth = useMemo(() => {
    if (!monthValue) return "";
    const date = new Date(monthValue + "-01T00:00:00");
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [monthValue]);

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
    queryFn: async () => {
      const response = await fetch('/api/expenses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'x-pg-id': localStorage.getItem('pg-id')!
        }
      });
      if (!response.ok) throw new Error('Failed to fetch expenses');
      return response.json();
    }
  });

  const createExpense = useMutation({
    mutationFn: (data: typeof formData) =>
      apiRequest("POST", "/api/expenses", { ...data, amount: String(data.amount) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      toast({ title: "Success", description: "Entry added successfully" });
      setFormData(prev => ({ ...prev, amount: "", description: "" }));
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add entry", variant: "destructive" });
    }
  });

  const deleteExpense = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      toast({ title: "Success", description: "Entry deleted successfully" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      toast({ title: "Error", description: "Amount and description are required", variant: "destructive" });
      return;
    }
    createExpense.mutate(formData);
  };

  const filteredExpenses = useMemo(() => {
    if (!monthValue) return expenses;
    return expenses.filter(e => {
      if (!e.date) return false;
      const expenseDate = new Date(e.date);
      const expenseMonth = expenseDate.toISOString().slice(0, 7);
      return expenseMonth === monthValue;
    });
  }, [expenses, monthValue]);

  const totalIncome = filteredExpenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = filteredExpenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[hsl(220,25%,12%)] p-4 rounded-xl border border-purple-500/20 glass-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Monthly Expense Register</h3>
            <p className="text-sm text-purple-200/60">Manage your finances for {formattedDisplayMonth}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="month-picker" className="text-purple-200 whitespace-nowrap">Select Month:</Label>
          <Input 
            id="month-picker"
            type="month"
            value={monthValue}
            onChange={(e) => setMonthValue(e.target.value)}
            className="bg-[hsl(220,25%,10%)] border-purple-500/20 text-white focus:border-purple-500/50 min-w-[150px] max-w-[200px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-400 mb-1">Total Income</p>
                <h3 className="text-2xl font-bold text-white">₹{totalIncome.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400 mb-1">Total Expenses</p>
                <h3 className="text-2xl font-bold text-white">₹{totalExpense.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`glass-card ${netProfit >= 0 ? 'border-purple-500/20' : 'border-yellow-500/20'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-200/60 mb-1">Net Balance</p>
                <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-white' : 'text-yellow-400'}`}>
                  ₹{Math.abs(netProfit).toLocaleString()} {netProfit < 0 && '(Loss)'}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${netProfit >= 0 ? 'bg-purple-500/20' : 'bg-yellow-500/20'}`}>
                <Receipt className={`w-6 h-6 ${netProfit >= 0 ? 'text-purple-400' : 'text-yellow-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass-card border-purple-500/20 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl text-white">Add Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-purple-200">Type</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}>
                  <SelectTrigger className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(220,25%,12%)] border-purple-500/20">
                    <SelectItem value="income" className="text-green-400 hover:bg-green-500/20">Income</SelectItem>
                    <SelectItem value="expense" className="text-red-400 hover:bg-red-500/20">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white"
                  placeholder="e.g. Cook Salary, Maintenance"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">Amount (₹)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-200">Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white"
                  placeholder="Details"
                />
              </div>

              <Button type="submit" className="w-full btn-gen text-white" disabled={createExpense.isPending}>
                <Plus className="w-4 h-4 mr-2" /> Add Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-card border-purple-500/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-white">Transactions for {formattedDisplayMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-purple-200/60">Loading entries...</div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-8 text-purple-200/60">No financial entries found for this month.</div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center ${
                        expense.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {expense.type === 'income' ? (
                          <ArrowUpRight className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{expense.category}</h4>
                        <p className="text-sm text-purple-200/60">{expense.description}</p>
                        <p className="text-xs text-purple-300/40 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(expense.date!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${expense.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {expense.type === 'income' ? '+' : '-'}₹{Number(expense.amount).toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this entry?')) {
                            deleteExpense.mutate(expense.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
