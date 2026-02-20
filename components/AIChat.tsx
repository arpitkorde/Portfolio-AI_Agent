import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, Mic, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI, FunctionDeclaration, Type, Content, Part } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { SUMMARY, SKILLS, PROJECTS, EXPERIENCE, CONTACT_INFO, SITE_CONFIG } from '../constants';
import LiveAvatar from './LiveAvatar';

interface AIChatProps {
  onOpenBooking: () => void;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

const AIChat: React.FC<AIChatProps> = ({ onOpenBooking, isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: `Hi! I'm ${SITE_CONFIG.userName}'s AI Assistant. Ask me anything about their professional background, projects, or expertise. I can also check their availability and help you schedule a meeting directly. You can also toggle **Voice Mode** (top right) to speak with my interactive avatar! How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [provider, setProvider] = useState<'gemini' | 'ollama'>('gemini');

  // Voice & Avatar State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
          // Optional: Auto-send if desired, but letting user review is safer
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setInputValue(''); // Clear input for new speech
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  // Filter sensitive contact info
  const SAFE_CONTACT_INFO = {
    location: CONTACT_INFO.location,
    linkedin: CONTACT_INFO.linkedin,
    github: CONTACT_INFO.github
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isVoiceMode]);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
    }
    return () => {
      // Stop speaking when component unmounts
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Speak text function
  const speakText = (text: string) => {
    if (!speechSynthesisRef.current || !isVoiceMode) return;

    // Cancel previous
    speechSynthesisRef.current.cancel();

    // Strip markdown chars for smoother speech
    const cleanText = text.replace(/[*#`\[\]()] /g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a good English voice
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US');
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current.speak(utterance);
  };

  // --- Tool Definitions ---

  const checkAvailabilityTool: FunctionDeclaration = {
    name: "checkAvailability",
    description: `Check ${SITE_CONFIG.userName}'s calendar availability. Returns a list of available time slots for a given date or the upcoming days.`,
    parameters: {
      type: Type.OBJECT,
      properties: {
        date: {
          type: Type.STRING,
          description: "The specific date to check (YYYY-MM-DD or 'tomorrow', 'next monday'). If unspecified, checks next 3 business days."
        }
      }
    }
  };

  const bookMeetingTool: FunctionDeclaration = {
    name: "bookMeeting",
    description: "Generates a Google Calendar invite link for the user. Collects user details to pre-fill the invite.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "The name of the person booking the meeting" },
        email: { type: Type.STRING, description: "The email address of the person" },
        date: { type: Type.STRING, description: "The date of the meeting (YYYY-MM-DD)" },
        time: { type: Type.STRING, description: "The time of the meeting (e.g. 10:00, 14:30)" },
        reason: { type: Type.STRING, description: "Short reason or topic for the meeting" }
      },
      required: ["name", "email", "date", "time"]
    }
  };

  const openSchedulerTool: FunctionDeclaration = {
    name: "openScheduler",
    description: "Opens the visual calendar interface (modal) for the user to manually select a slot if they prefer.",
  };

  // --- Mock Implementations ---

  const handleCheckAvailability = (args: any) => {
    const today = new Date();
    // Default slots
    const slots = ["10:00", "11:30", "14:00", "16:30"];

    // Helper to format date YYYY-MM-DD
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // If specific date requested
    if (args.date) {
      const requestedDate = new Date(args.date);
      const day = requestedDate.getDay();
      if (day === 0 || day === 6) {
        return {
          status: "success",
          message: `${SITE_CONFIG.userName} is not available on weekends (${args.date}). Please choose a weekday.`
        };
      }
      return {
        status: "success",
        message: `Available slots for ${args.date}: ${slots.join(', ')}.`
      };
    }

    const availableDates = [];
    let d = new Date(today);
    let count = 0;
    while (count < 3) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        availableDates.push({ date: formatDate(d), slots });
        count++;
      }
    }

    return {
      status: "success",
      data: availableDates
    };
  };

  const handleBookMeeting = (args: any) => {
    try {
      const dateStr = args.date;
      let timeStr = args.time;
      const startDateTime = new Date(`${dateStr} ${timeStr}`);

      if (isNaN(startDateTime.getTime())) {
        throw new Error("Invalid Date/Time");
      }

      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 mins

      const formatGCalTime = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
      };

      const start = formatGCalTime(startDateTime);
      const end = formatGCalTime(endDateTime);
      const title = encodeURIComponent(`Meeting: ${args.name} <> ${SITE_CONFIG.userName}`);
      const details = encodeURIComponent(`Topic: ${args.reason || 'Portfolio Discussion'}\n\nBooked via AI Agent.`);
      const attendees = encodeURIComponent(`${SITE_CONFIG.email},${args.email}`);

      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&add=${attendees}`;

      return {
        status: "success",
        message: `I cannot directly send emails, but I have prepared the invitation for you. \n\n[Click here to confirm and send the invite](${url}) \n\nThis will open your Google Calendar with all details pre-filled.`
      };

    } catch (error) {
      onOpenBooking();
      return {
        status: "partial_success",
        message: "I've opened the scheduler view for you to finalize the booking manually."
      };
    }
  };


  // --- Ollama Implementation ---
  const generateOllamaResponse = async (newMessages: ChatMessage[]) => {
    const OLLAMA_URL = "http://localhost:11434/api/chat";
    const MODEL = "llama3.2";

    const conversation = newMessages.map(m => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.text
    }));

    // System prompt as first message
    conversation.unshift({ role: 'system', content: SITE_CONFIG.systemPrompt + "\n\nIMPORTANT: You have access to tools. If the user asks to check availability or book a meeting, you MUST output a JSON object with the tool name and arguments. Example: {\"tool\": \"checkAvailability\", \"args\": {\"date\": \"tomorrow\"}}. Do not output markdown or other text when calling a tool." });

    try {
      const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages: conversation,
          stream: false,
          format: "json" // Force JSON to help with tool calling parsing if we were strictly enforcing it, but for chat we might want text.
          // Actually, for mixed chat/tool, Llama 3.2 is tricky without strict tool calling API. 
          // We will use standard text mode and parse for JSON-like tool calls manually for simplicity in this demo.
        })
      });

      if (!response.ok) throw new Error("Ollama connection failed");

      const data = await response.json();
      let aiText = data.message.content;

      // Simple heuristic tool parsing for Ollama
      // Looking for JSON pattern like {"tool": ...}
      try {
        const jsonMatch = aiText.match(/\{.*"tool":.*\}/s);
        if (jsonMatch) {
          const toolCall = JSON.parse(jsonMatch[0]);
          let toolResult;

          if (toolCall.tool === 'checkAvailability') {
            toolResult = handleCheckAvailability(toolCall.args || {});
          } else if (toolCall.tool === 'bookMeeting') {
            toolResult = handleBookMeeting(toolCall.args || {});
          } else if (toolCall.tool === 'openScheduler') {
            onOpenBooking();
            toolResult = { status: "success", message: "Opened scheduler." };
          }

          if (toolResult) {
            // Feed result back to Ollama
            conversation.push({ role: 'assistant', content: aiText });
            conversation.push({ role: 'user', content: `Tool Result: ${JSON.stringify(toolResult)}` });

            const followUp = await fetch(OLLAMA_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ model: MODEL, messages: conversation, stream: false })
            });
            const followUpData = await followUp.json();
            aiText = followUpData.message.content;
          }
        }
      } catch (e) {
        // Not a valid tool call, just plain text
      }

      const text = aiText;
      if (isVoiceMode) speakText(text);
      return text;

    } catch (e) {
      console.error("Ollama Error", e);
      return "I couldn't connect to Ollama. Make sure it's running with `ollama serve` and `OLLAMA_ORIGINS=\"*\"`.";
    }
  };


  const generateResponse = async (newMessages: ChatMessage[]) => {
    if (provider === 'ollama') {
      return generateOllamaResponse(newMessages);
    }

    // Gemini Implementation (Existing)
    // Try to get API key from environment variables or window.aistudio
    let apiKey = import.meta.env.VITE_GEMINI_API_KEY || (window.aistudio ? await window.aistudio.getApiKey() : null);

    if (!apiKey) {
      return "I'm currently in offline mode. Please use the 'Book Call' button at the top to schedule a meeting directly.";
    }

    const systemInstruction = SITE_CONFIG.systemPrompt;
    const ai = new GoogleGenAI({ apiKey });

    // Convert chat history
    const contents: Content[] = newMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      let currentResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash', // Updated to Flash for better availability
        contents: contents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [checkAvailabilityTool, bookMeetingTool, openSchedulerTool] }]
        }
      });

      // Function Calling Loop
      let turns = 0;
      while (currentResponse.functionCalls && currentResponse.functionCalls.length > 0 && turns < 5) {
        turns++;
        if (currentResponse.candidates?.[0]?.content) {
          contents.push(currentResponse.candidates[0].content);
        } else {
          contents.push({ role: 'model', parts: [{ functionCall: currentResponse.functionCalls[0] }] });
        }

        const parts: Part[] = [];
        for (const call of currentResponse.functionCalls) {
          const funcName = call.name;
          const funcArgs = call.args;
          let functionResult;

          if (funcName === 'checkAvailability') {
            functionResult = handleCheckAvailability(funcArgs);
          } else if (funcName === 'bookMeeting') {
            functionResult = handleBookMeeting(funcArgs);
          } else if (funcName === 'openScheduler') {
            onOpenBooking();
            functionResult = { status: "success", message: "Calendar modal opened." };
          } else {
            functionResult = { error: "Function not found" };
          }

          parts.push({
            functionResponse: {
              name: funcName,
              response: { result: functionResult }
            }
          });
        }

        contents.push({ role: 'user', parts: parts });

        currentResponse = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: contents,
          config: {
            systemInstruction,
            tools: [{ functionDeclarations: [checkAvailabilityTool, bookMeetingTool, openSchedulerTool] }]
          }
        });
      }

      const text = currentResponse.text || "I processed that request.";

      // Trigger Speech
      if (isVoiceMode) {
        speakText(text);
      }

      return text;

    } catch (e: any) {
      console.error("Agent Error", e);
      return "I encountered an error connecting to the system. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Stop any current speech
    if (speechSynthesisRef.current) speechSynthesisRef.current.cancel();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsThinking(true);

    const aiResponseText = await generateResponse(updatedMessages);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      timestamp: new Date()
    };

    setIsThinking(false);
    setMessages(prev => [...prev, aiMessage]);
  };

  const toggleVoiceMode = () => {
    if (isVoiceMode) {
      // Turn off
      if (speechSynthesisRef.current) speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
    setIsVoiceMode(!isVoiceMode);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[600px] bg-secondary border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-accent/20 rounded-full">
                <Sparkles size={16} className="text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{SITE_CONFIG.userName}'s AI Agent</h3>
                <div className="flex items-center mt-0.5 space-x-2">
                  <button
                    onClick={() => setProvider('gemini')}
                    className={`text-[10px] uppercase font-bold tracking-wider transition-colors ${provider === 'gemini' ? 'text-accent' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Gemini
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    onClick={() => setProvider('ollama')}
                    className={`text-[10px] uppercase font-bold tracking-wider transition-colors ${provider === 'ollama' ? 'text-green-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Ollama (Local)
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceMode}
                className={`p-2 rounded-full transition-colors ${isVoiceMode ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                title={isVoiceMode ? "Disable Voice Mode" : "Enable Live Voice Mode"}
              >
                {isVoiceMode ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button onClick={() => onToggle(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Voice Mode Avatar (Overlay) */}
          {isVoiceMode && (
            <div className="p-6 bg-slate-900/80 border-b border-slate-700 flex flex-col items-center justify-center transition-all duration-300">
              <LiveAvatar isSpeaking={isSpeaking} className="w-32 h-32 md:w-40 md:h-40" />
              <p className="mt-4 text-sm text-slate-300 font-medium">
                {isSpeaking ? `${SITE_CONFIG.userName}(AI) is speaking...` : isThinking ? "Thinking..." : "Listening..."}
              </p>
            </div>
          )}

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 ${isVoiceMode ? 'h-48' : ''}`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-ai-purple/20'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-ai-purple" />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-sm ${msg.role === 'user'
                      ? 'bg-slate-700 text-white rounded-tr-none'
                      : 'bg-indigo-950/80 border border-indigo-900/50 text-slate-200 rounded-tl-none'
                      }`}
                  >
                    <ReactMarkdown components={{ p: ({ node, ...props }) => <p className="mb-0" {...props} /> }}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start w-full">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-ai-purple/20 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-ai-purple" />
                  </div>
                  <div className="bg-indigo-950/80 border border-indigo-900/50 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-secondary border-t border-slate-700">
            <div className="relative flex items-center">
              <button
                onClick={toggleListening}
                className={`absolute left-1.5 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-400 hover:text-white'}`}
                title={isListening ? "Stop Listening" : "Speak to Type"}
              >
                <Mic size={18} />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : isVoiceMode ? "Type or speak..." : "Ask to schedule a meeting..."}
                className="w-full bg-slate-900 text-slate-200 text-sm rounded-full py-3 pl-10 pr-12 focus:outline-none focus:ring-1 focus:ring-accent border border-slate-700"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isThinking}
                className="absolute right-1.5 p-2 bg-accent hover:bg-accentHover text-slate-900 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => onToggle(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-ai-purple to-indigo-600 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 animate-pulse transition-opacity"></div>
          <Bot className="text-white" size={28} />
          <span className="absolute right-0 top-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
        </button>
      )}
    </div>
  );
};

export default AIChat;