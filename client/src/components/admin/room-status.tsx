import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { RoomStatus, Resident, Payment } from "@shared/schema";
import { Building2, Users, CheckCircle2, XCircle, Phone, Calendar, DollarSign, AlertCircle } from "lucide-react";

type ResidentWithPayments = Resident & { payments: Payment[] };

export default function RoomStatus() {
  const { data: roomStatus, isLoading } = useQuery({
    queryKey: ['/api/room-status'],
    queryFn: async () => {
      const response = await fetch('/api/room-status', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 'x-pg-id': localStorage.getItem('pg-id')! }
      });
      if (!response.ok) throw new Error('Failed to fetch room status');
      return response.json() as Promise<RoomStatus[]>;
    }
  });

  const defaultRoomStatus = [
    { roomType: "1-sharing", totalRooms: 5, occupiedRooms: 0 },
    { roomType: "2-sharing", totalRooms: 5, occupiedRooms: 0 },
    { roomType: "5-sharing", totalRooms: 2, occupiedRooms: 0 },
    { roomType: "6-sharing", totalRooms: 4, occupiedRooms: 0 }
  ];

  const displayData = roomStatus && roomStatus.length > 0 ? roomStatus : defaultRoomStatus;

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [expandedRoomNumber, setExpandedRoomNumber] = useState<string | null>(null);

  const { data: roomDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['/api/room-details', selectedRoom],
    queryFn: async () => {
      if (!selectedRoom) return null;
      const response = await fetch(`/api/room-details/${encodeURIComponent(selectedRoom)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'x-pg-id': localStorage.getItem('pg-id')!
        }
      });
      if (!response.ok) throw new Error('Failed to fetch room details');
      return response.json() as Promise<ResidentWithPayments[]>;
    },
    enabled: !!selectedRoom
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Overdue</Badge>;
      default:
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-purple-500/20">
        <CardContent className="p-6">
          <div className="text-center text-purple-200/60">Loading room status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass-card border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <CardTitle className="text-xl text-white">Room Availability Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayData.map((room, index) => {
              const available = room.totalRooms - room.occupiedRooms;
              const isFullyOccupied = available === 0;
              const isLowAvailability = available <= 1 && !isFullyOccupied;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedRoom(room.roomType)}
                  className={`glass-card rounded-xl p-5 border text-left transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${isFullyOccupied
                      ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
                      : isLowAvailability
                        ? 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50'
                        : 'border-green-500/30 bg-green-500/5 hover:border-green-500/50'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isFullyOccupied
                        ? 'bg-red-500/20'
                        : isLowAvailability
                          ? 'bg-yellow-500/20'
                          : 'bg-green-500/20'
                      }`}>
                      {isFullyOccupied ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle2 className={`w-5 h-5 ${isLowAvailability ? 'text-yellow-400' : 'text-green-400'
                          }`} />
                      )}
                    </div>
                    <h3 className="font-semibold text-white capitalize">
                      {room.roomType.replace('-sharing', ' Sharing')}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200/60 text-sm">Available</span>
                      <span className={`font-bold ${isFullyOccupied
                          ? 'text-red-400'
                          : isLowAvailability
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}>{available}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200/60 text-sm">Occupied</span>
                      <span className="font-bold text-purple-200">{room.occupiedRooms}</span>
                    </div>
                    <div className="pt-2 border-t border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300/50 text-xs">Total Rooms</span>
                        <span className="text-xs text-purple-300/70">{room.totalRooms}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 h-2 bg-purple-500/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isFullyOccupied
                          ? 'bg-red-500 w-full'
                          : isLowAvailability
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      style={{
                        width: `${(room.totalRooms > 0 ? (room.occupiedRooms / room.totalRooms) : 0) * 100}%`
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRoom} onOpenChange={(open) => {
        if (!open) { setSelectedRoom(null); setExpandedRoomNumber(null); }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#0d0d12] border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2 capitalize">
              <Users className="w-5 h-5 text-purple-400" />
              {selectedRoom?.replace('-sharing', ' Sharing')} - Rooms
            </DialogTitle>
          </DialogHeader>

          {detailsLoading ? (
            <div className="text-center py-8 text-purple-200/60">Loading details...</div>
          ) : roomDetails && roomDetails.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(
                roomDetails.reduce((acc, resident) => {
                  const num = resident.roomNumber || 'Unassigned';
                  if (!acc[num]) acc[num] = [];
                  acc[num].push(resident);
                  return acc;
                }, {} as Record<string, typeof roomDetails>)
              ).map(([roomNum, residentsInRoom]) => (
                <div key={roomNum} className="glass-card rounded-xl border border-purple-500/20 overflow-hidden">
                  <button
                    onClick={() => setExpandedRoomNumber(expandedRoomNumber === roomNum ? null : roomNum)}
                    className="w-full text-left px-5 py-4 bg-purple-500/5 hover:bg-purple-500/10 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold">
                        {roomNum}
                      </div>
                      <span className="font-semibold text-white">Room {roomNum}</span>
                    </div>
                    <span className="text-sm text-purple-200/60">
                      {residentsInRoom.length} Resident{residentsInRoom.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                  
                  {expandedRoomNumber === roomNum && (
                    <div className="p-4 space-y-4 bg-black/20 border-t border-purple-500/10">
                      {residentsInRoom.map((resident) => (
                        <div
                          key={resident.id}
                          className="rounded-lg p-4 border border-purple-500/10 bg-purple-500/5"
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-white">{resident.name}</h4>
                              <div className="flex items-center gap-4 text-sm text-purple-200/70">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {resident.mobile}
                                </span>
                              </div>
                              <div className="text-sm text-purple-200/60">
                                {resident.college}
                              </div>
                              <div className="text-xs text-purple-300/50">
                                Joined: {new Date(resident.joiningDate).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="space-y-2 min-w-[200px]">
                              <div className="text-sm font-medium text-purple-200/70 flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                Payment History
                              </div>
                              {resident.payments && resident.payments.length > 0 ? (
                                <div className="space-y-2">
                                  {resident.payments.map((payment) => (
                                    <div
                                      key={payment.id}
                                      className="flex items-center justify-between gap-4 text-sm bg-purple-500/10 rounded-lg p-2"
                                    >
                                      <span className="text-purple-200/70">{payment.month}</span>
                                      <span className="font-medium text-white">₹{payment.amount}</span>
                                      {getPaymentStatusBadge(payment.status)}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-purple-300/50 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  No payment records
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-purple-200/60">
              No residents found in this room type
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}