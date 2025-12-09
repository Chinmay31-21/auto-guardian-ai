import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { vehicles } from '@/data/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'system',
    content: 'Customer Engagement AI Agent initialized. Ready to assist with vehicle maintenance communications.',
    timestamp: new Date()
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Hello! I\'m your AI Customer Engagement Agent. I can help you communicate with vehicle owners about maintenance alerts, schedule appointments, and collect feedback. Which customer would you like me to contact?',
    timestamp: new Date()
  }
];

export function CustomerChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isOnCall, setIsOnCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let responseContent = '';

      if (input.toLowerCase().includes('contact') || input.toLowerCase().includes('call')) {
        const vehicleMatch = vehicles.find(v =>
          input.toLowerCase().includes(v.ownerName.toLowerCase().split(' ')[0].toLowerCase())
        );
        if (vehicleMatch) {
          setSelectedVehicle(vehicleMatch.id);
          responseContent = `I'll initiate contact with ${vehicleMatch.ownerName} regarding their ${vehicleMatch.make} ${vehicleMatch.model}.\n\n📞 Calling ${vehicleMatch.ownerPhone}...\n\n"Hello ${vehicleMatch.ownerName.split(' ')[0]}, this is your AutoMaintain AI assistant. I'm calling about your ${vehicleMatch.make} ${vehicleMatch.model}. Our diagnostics have detected that your vehicle may need attention soon. Would you like to schedule a service appointment at your convenience?"`;
        } else {
          responseContent = 'I can help you contact a customer. Please specify which vehicle owner you\'d like me to reach. Available customers:\n\n' +
            vehicles.map(v => `• ${v.ownerName} - ${v.make} ${v.model}`).join('\n');
        }
      } else if (input.toLowerCase().includes('schedule')) {
        responseContent = 'I can help schedule a service appointment. Based on our analysis, here are the recommended time slots:\n\n📅 Tomorrow, 10:00 AM - Bangalore Central\n📅 Tomorrow, 2:30 PM - Mumbai West\n📅 Day after, 11:00 AM - Kochi Hub\n\nWould you like me to propose any of these slots to the customer?';
      } else if (input.toLowerCase().includes('feedback')) {
        responseContent = 'I\'ll send a feedback request to the customer. Here\'s my proposed message:\n\n"Dear valued customer, thank you for choosing AutoMaintain for your recent service. We\'d love to hear about your experience. Please rate our service on a scale of 1-5 and share any comments."\n\nShall I proceed with sending this feedback request?';
      } else {
        responseContent = 'I understand. As your Customer Engagement Agent, I can:\n\n🔔 Contact customers about maintenance alerts\n📅 Schedule service appointments\n📞 Make voice calls to explain vehicle issues\n⭐ Collect post-service feedback\n\nWhat would you like me to help with?';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Chat Interface */}
      <div className="lg:col-span-2 flex flex-col">
        <Card className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Customer Engagement Agent</h3>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isOnCall ? 'destructive' : 'outline'}
                size="icon"
                onClick={() => setIsOnCall(!isOnCall)}
              >
                {isOnCall ? <PhoneOff className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                disabled={!isOnCall}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  <div className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                    message.role === 'user' ? 'bg-primary' : message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'
                  )}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : message.role === 'assistant' ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.role === 'assistant'
                        ? 'bg-muted'
                        : 'bg-muted/50 text-muted-foreground text-sm'
                  )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      'text-xs mt-1',
                      message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message or command..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Customer Queue */}
      <div className="space-y-4">
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Pending Outreach</h4>
          <div className="space-y-3">
            {vehicles.filter(v => v.status !== 'healthy').slice(0, 4).map((vehicle) => (
              <div
                key={vehicle.id}
                className={cn(
                  'p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors',
                  selectedVehicle === vehicle.id && 'border-primary bg-primary/5'
                )}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{vehicle.ownerName}</span>
                  <Badge
                    className={cn(
                      'text-xs',
                      vehicle.status === 'warning'
                        ? 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]'
                        : 'bg-destructive/20 text-destructive'
                    )}
                  >
                    {vehicle.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {vehicle.make} {vehicle.model} • Health: {vehicle.healthScore}%
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-semibold mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <Phone className="h-4 w-4" />
              Initiate Voice Call
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <Send className="h-4 w-4" />
              Send SMS Reminder
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <Sparkles className="h-4 w-4" />
              Generate Script
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
