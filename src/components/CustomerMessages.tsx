import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, EyeOff, Search, X } from "lucide-react";
import { toast } from "sonner";

interface CustomerMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate: string | null;
  createdAt: string;
}

const CustomerMessages = () => {
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<CustomerMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFullMessage, setShowFullMessage] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(data);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error(error.message || 'Failed to fetch customer messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(`Failed to delete message: ${response.status} ${response.statusText}`);
      }

      toast.success('Message deleted successfully!');
      setMessages(messages.filter(message => message.id !== id));
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(error.message || 'Failed to delete message');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL messages? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch('/api/messages', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(`Failed to delete all messages: ${response.status} ${response.statusText}`);
      }

      toast.success('All messages deleted successfully!');
      setMessages([]);
    } catch (error: any) {
      console.error('Error deleting all messages:', error);
      toast.error(error.message || 'Failed to delete messages');
    }
  };

  const toggleMessageView = (id: number) => {
    setShowFullMessage(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customer Messages</CardTitle>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchTerm && (
              <button
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAll}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No customer messages found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div 
                key={message.id} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{message.name}</h3>
                      <Badge variant="secondary">{formatDate(message.createdAt)}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                      <span className="truncate max-w-[200px]">
                        <span className="font-medium">Email:</span> {message.email}
                      </span>
                      <span className="truncate max-w-[200px]">
                        <span className="font-medium">Phone:</span> {message.phone}
                      </span>
                      {message.preferredDate && (
                        <span>
                          <span className="font-medium">Preferred Date:</span> {message.preferredDate}
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <p className={`text-sm ${showFullMessage[message.id] ? '' : 'line-clamp-2'}`}>
                        {message.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMessageView(message.id)}
                    >
                      {showFullMessage[message.id] ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Show More
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMessage(message)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerMessages;