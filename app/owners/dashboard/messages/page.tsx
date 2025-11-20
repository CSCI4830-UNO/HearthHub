"use client"
import { useState } from "react";
import { MessageSquare, Send, Search, AlertCircle, User, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const conversations = [
  {
    id: 1,
    tenant: "John Doe",
    property: "The Duke Omaha Apartments",
    lastMessage: "The heating system seems to be making a strange noise. Can someone take a look?",
    lastMessageTime: "2 hours ago",
    unread: 2,
    type: "maintenance",
  },
  {
    id: 2,
    tenant: "Jane Smith",
    property: "Juniper Rows",
    lastMessage: "Thank you for fixing the leak! Everything looks great now.",
    lastMessageTime: "1 day ago",
    unread: 0,
    type: "general",
  },
  {
    id: 3,
    tenant: "Mike Johnson",
    property: "Dundee Flats",
    lastMessage: "I'm planning to renew my lease. Can we discuss the terms?",
    lastMessageTime: "3 days ago",
    unread: 1,
    type: "lease",
  },
];

export default function MessagesPage() {
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);
  const maintenanceRequests = conversations.filter(c => c.type === "maintenance").length;

const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with tenants and handle requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalUnread > 0 && (
            <Badge variant="default">{totalUnread} unread</Badge>
          )}
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Conversations</CardDescription>
            <CardTitle className="text-2xl">{conversations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unread Messages</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{totalUnread}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Maintenance Requests</CardDescription>
            <CardTitle className="text-2xl text-red-600">{maintenanceRequests}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="grid gap-4">
        {conversations.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{conversation.tenant}</h3>
                      {conversation.unread > 0 && (
                        <Badge variant="default">{conversation.unread}</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {conversation.type}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {conversation.property}
                  </p>
                  
                  <p className="text-sm line-clamp-2">
                    {conversation.lastMessage}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {conversation.type === "maintenance" && (
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedConversation(conversation)}>
                  View Conversation
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {conversations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-center">
              Start communicating with tenants to see messages here
            </p>
          </CardContent>
        </Card>
        )}

    {selectedConversation && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Conversation with {selectedConversation.tenant}
            </h2>
            <Button variant="ghost" onClick={() => setSelectedConversation(null)}>
              Close
            </Button>
          </div>
          <div className="space-y-4 text-foreground">
            <p><strong className="font-semibold">Property:</strong> {selectedConversation.property}</p>
            <p><strong className="font-semibold">Message:</strong> {selectedConversation.lastMessage}</p>
            <p className="text-sm text-muted-foreground">
              Sent {selectedConversation.lastMessageTime}
            </p>
            <Badge variant="outline">{selectedConversation.type}</Badge>
          </div>
        </div>
      </div>
      )}
  </div>
  );
}

