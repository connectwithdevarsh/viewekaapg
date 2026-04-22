import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Phone, MessageSquare, CheckCircle2, MessageCircle, Clock, User, Users, Building, Calendar } from "lucide-react";
import type { Inquiry } from "@shared/schema";

export default function InquiriesList() {
  const { toast } = useToast();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['/api/inquiries'],
    queryFn: async () => {
      const response = await fetch('/api/inquiries', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'x-pg-id': localStorage.getItem('pg-id')!
        }
      });
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      return response.json() as Promise<Inquiry[]>;
    }
  });

  const markAsHandled = useMutation({
    mutationFn: (id: number) =>
      apiRequest("PUT", `/api/inquiries/${id}/handled`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
      toast({
        title: "Success",
        description: "Inquiry marked as handled",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update inquiry",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <Card className="glass-card border-purple-500/20">
        <CardContent className="p-6">
          <div className="text-center text-purple-200/60">Loading inquiries...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-pink-400" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-xl text-white">Recent Inquiries</CardTitle>
            <span className="text-xs font-medium text-pink-400 mt-1 uppercase tracking-wider">
               EKAA PG - {localStorage.getItem('pg-id') === 'khatraj' ? 'Khatraj' : 'Chanakyapuri'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inquiries?.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`glass-card rounded-xl p-5 border transition-all duration-300 ${
                inquiry.isHandled
                  ? 'border-purple-500/10 opacity-70'
                  : 'border-purple-500/30 hover:border-purple-500/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{inquiry.studentName}</h3>
                    <p className="text-sm text-purple-200/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(inquiry.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-purple-300 border-purple-500/30 bg-purple-500/10">
                    EKAA PG - {localStorage.getItem('pg-id') === 'khatraj' ? 'Khatraj' : 'Chanakyapuri'}
                  </Badge>
                  <Badge
                    variant={inquiry.isHandled ? "default" : "secondary"}
                    className={
                      inquiry.isHandled
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }
                  >
                    {inquiry.isHandled ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Handled
                      </span>
                    ) : (
                      "New"
                    )}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                <div className="flex items-center gap-2 text-purple-200/70">
                  <Building className="w-4 h-4 text-purple-400" />
                  <span>{inquiry.college}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200/70">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>{inquiry.roomType}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200/70">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>{inquiry.phone}</span>
                </div>
                {inquiry.stayDuration && (
                  <div className="flex items-center gap-2 text-purple-200/70">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>{inquiry.stayDuration}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
                >
                  <a href={`tel:${inquiry.phone}`}>
                    <Phone size={16} className="mr-1" />
                    Call
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  <a
                    href={`https://wa.me/91${inquiry.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare size={16} className="mr-1" />
                    WhatsApp
                  </a>
                </Button>
                {!inquiry.isHandled && (
                  <Button
                    size="sm"
                    onClick={() => markAsHandled.mutate(inquiry.id)}
                    disabled={markAsHandled.isPending}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                  >
                    <CheckCircle2 size={16} className="mr-1" />
                    Mark as Handled
                  </Button>
                )}
              </div>
            </div>
          ))}
          {(!inquiries || inquiries.length === 0) && (
            <div className="text-center py-8 text-purple-300/50">
              No inquiries found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
