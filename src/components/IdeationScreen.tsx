"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface GameTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export default function IdeationScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content: "Welcome to the Game Development Ideation Assistant! I'm here to help you brainstorm and develop your game ideas. What kind of game are you thinking about creating?",
      timestamp: new Date("2024-01-01T12:00:00"),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);

  // Add save state for feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const suggestions = [
    "Add new scenes",
    "Add extra level with boss",
    "Add more power ups",
    "Add NPC character",
    "Implement crafting system",
    "2 player game",
    "Create character customization",
    "Add weather effects",
  ];

  const gameTemplates: GameTemplate[] = [
    {
      id: "platformer",
      name: "2D Platformer",
      description: "Classic side-scrolling adventure with jumping mechanics",
      tags: ["2D", "Action", "Adventure"],
    },
    {
      id: "rpg",
      name: "RPG Adventure",
      description: "Role-playing game with character progression and quests",
      tags: ["RPG", "Story", "Characters"],
    },
    {
      id: "puzzle",
      name: "Puzzle Game",
      description: "Mind-bending puzzles and logic challenges",
      tags: ["Puzzle", "Logic", "Casual"],
    },
    {
      id: "shooter",
      name: "Space Shooter",
      description: "Fast-paced action in outer space",
      tags: ["Action", "Shooter", "Sci-fi"],
    },
    {
      id: "racing",
      name: "Racing Game",
      description: "High-speed racing with customizable vehicles",
      tags: ["Racing", "Sports", "Competitive"],
    },
    {
      id: "strategy",
      name: "Strategy Game",
      description: "Resource management and tactical gameplay",
      tags: ["Strategy", "Management", "Tactical"],
    },
  ];

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setStreamingMessage(""); // Start streaming

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: currentMessage }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullMessage = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value);
          fullMessage += chunk;
          setStreamingMessage(fullMessage);
        }
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: fullMessage || "Sorry, I couldn't think of a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage(null);
    } catch (err) {
      setStreamingMessage(null);
      console.error("Error:", err);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = gameTemplates.find((t) => t.id === templateId);
    if (template) {
      setCurrentMessage(`I want to create a ${template.name}: ${template.description}`);
    }
  };

  // Helper to extract game design data from message (supports JSON or plain text)
  function extractGameDesign(content: string) {
    try {
      // Try to parse JSON game idea array
      const ideas = JSON.parse(content);
      if (Array.isArray(ideas) && ideas.length > 0) {
        return ideas[0];
      }
    } catch {
      // Fallback: parse markdown-like text
      // Simple extraction for title, genre, description
      const titleMatch = content.match(/##\s*\*\*"?(.+?)"?\*\*/);
      const genreMatch = content.match(/\*\*Genre:\*\*\s*(.+)/);
      const descMatch = content.match(/\*\*Core Concept:\*\*\s*([\s\S]+?)(\n\n|\*\*Key Mechanics)/);
      return {
        title: titleMatch ? titleMatch[1] : "Untitled",
        genre: genreMatch ? genreMatch[1] : "Unknown",
        description: descMatch ? descMatch[1].trim() : content,
        raw: content
      };
    }
  }

  // Remove API save logic, replace with download
  const handleSaveGameIdea = () => {
    // Find last assistant message
    const lastAssistantMsg = [...messages]
      .reverse()
      .find((msg) => msg.type === "assistant");

    if (!lastAssistantMsg) {
      setSaveStatus("No game idea to save.");
      return;
    }

    // Extract game design data
    const gameDesign = extractGameDesign(lastAssistantMsg.content);

    // Create markdown content from object
    const mdContent = `# Game Idea

## ${gameDesign.title}

**Genre:** ${gameDesign.genre}

**Description:**  
${gameDesign.description}

---

${gameDesign.raw || lastAssistantMsg.content}
`;

    // Create a blob and trigger download
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "gameidea.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSaveStatus("Download started!");
  };

  function renderGameIdeas(content: string) {
    let ideas: any[] = [];
    try {
      ideas = JSON.parse(content);
      if (!Array.isArray(ideas)) return null;
    } catch {
      return null;
    }
    return (
      <div className="space-y-4">
        {ideas.map((idea, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-slate-700 border border-slate-600 shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-white">{idea.title}</span>
              <span className="px-2 py-1 rounded bg-blue-600 text-xs text-white font-semibold">{idea.genre}</span>
            </div>
            <p className="text-slate-200 text-sm">{idea.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">AI Ideation Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <ScrollArea className="flex-1 mb-4 pr-4">
              <div className="space-y-4">
                {/* Render previous messages */}
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.type === "assistant" && renderGameIdeas(message.content) ? (
                      <div className="flex flex-row">
                        <Avatar className="w-8 h-8 mr-2">
                          <AvatarFallback className="bg-green-600">AI</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">{renderGameIdeas(message.content)}</div>
                      </div>
                    ) : (
                      <div
                        className={`flex gap-3 ${
                          message.type === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={message.type === "user" ? "bg-blue-600" : "bg-green-600"}>
                            {message.type === "user" ? "U" : "AI"}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700 text-slate-200"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-60 mt-1 block">
                            {message.timestamp.toTimeString().slice(0, 5)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Render streaming message if present */}
                {streamingMessage !== null && (
                  <div className="flex flex-row">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarFallback className="bg-green-600">AI</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {renderGameIdeas(streamingMessage) || (
                        <div className="max-w-[80%] p-3 rounded-lg bg-slate-700 text-slate-200">
                          <p className="text-sm whitespace-pre-line">{streamingMessage}</p>
                          <span className="text-xs opacity-60 mt-1 block">...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Textarea
                placeholder="Describe your game idea or ask for suggestions..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-1 bg-slate-700 border-slate-600 text-white resize-none"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Sidebar with suggestions and templates */}
      <div className="space-y-6">
        {/* Suggestions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Design Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 bg-slate-700 hover:bg-slate-600 text-slate-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="text-sm">{suggestion}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Templates */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Game Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {gameTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-slate-600 bg-slate-700 hover:bg-slate-600"
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <h4 className="text-white font-medium text-sm">{template.name}</h4>
                    <p className="text-slate-300 text-xs mt-1">{template.description}</p>
                    <div className="flex gap-1 mt-2">
                      {template.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-slate-600 text-slate-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Good to Go Button */}
        <div>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold"
            onClick={handleSaveGameIdea}
          >
            Good to Go! 🚀
          </Button>
          {saveStatus && (
            <div className="text-center text-sm mt-2 text-slate-300">{saveStatus}</div>
          )}
        </div>
      </div>
    </div>
  );
}
