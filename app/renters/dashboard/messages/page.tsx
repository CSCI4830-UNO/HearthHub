"use client"
import { MessageSquare, Send, Search, User, Building2, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const conversations = [
  {
    id: 1,
    property: "Dundee Flats",
    landlord: "John Smith",
    landlordEmail: "john.smith@example.com",
    lastMessage: "Thank you for your application! We'll review it and get back to you within 2-3 business days.",
    lastMessageTime: "2 hours ago",
    unread: 1,
  },
  {
    id: 2,
    property: "The Duo",
    landlord: "Sarah Johnson",
    landlordEmail: "sarah.johnson@example.com",
    lastMessage: "Great news! Your application has been approved. When would you like to schedule a tour?",
    lastMessageTime: "1 day ago",
    unread: 0,
  },
  {
    id: 3,
    property: "The Duke Omaha Apartments",
    landlord: "Mike Davis",
    landlordEmail: "mike.davis@example.com",
    lastMessage: "I have a few questions about your application. Can we schedule a call?",
    lastMessageTime: "3 days ago",
    unread: 2,
  },
];

export default function MessagesPage() {
    // Code to run the pop-up message window
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    //Code for the search bar
    const [searchTerm, setSearchTerm] = useState("");
    const filteredConversations = conversations.filter((c) =>
      c.landlord.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with property owners and landlords
          </p>
        </div>
        {totalUnread > 0 && (
          <Badge variant="default">{totalUnread} unread</Badge>
        )}
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
            <CardDescription>Active Conversations</CardDescription>
            <CardTitle className="text-2xl text-green-600">{conversations.length}</CardTitle>
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
            <Input placeholder="Search conversations..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                      <h3 className="font-semibold">{conversation.landlord}</h3>
                      {conversation.unread > 0 && (
                        <Badge variant="default">{conversation.unread}</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{conversation.property}</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {conversation.lastMessage}
                  </p>
                </div>

                <div className="flex-shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-20 px-6"
                        onClick={() => {
                        setSelectedConversation(conversation);
                        setShowModal(true);
                        }}>
                        View
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-center">
              Messages from property owners will show up here
            </p>
          </CardContent>
        </Card>
      )}

  {showModal && selectedConversation && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Conversation with {selectedConversation.landlord}
          </h2>
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </div>
        <div className="space-y-4">
          <p><strong>Property:</strong> {selectedConversation.property}</p>
          <p><strong>Email:</strong> {selectedConversation.landlordEmail}</p>
          <p><strong>Message:</strong> {selectedConversation.lastMessage}</p>
          <p className="text-sm text-muted-foreground">
            Sent {selectedConversation.lastMessageTime}
          </p>
        </div>
      </div>
    </div>
  )}

    </div>
  );
}

