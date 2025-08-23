import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Send, Volume2, VolumeX, Bot, User } from "lucide-react";
import { aiChatAPI } from "../../../APIservices/users/studentAPI";

const AIChatAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition if available
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);

        // Wait a bit before sending to ensure complete sentence
        setTimeout(() => {
          handleSendMessage(transcript, true);
        }, 500);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleListen = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (
    message = inputMessage,
    isVoiceInput = false
  ) => {
    if (!message.trim() || isProcessing) return;

    const userMessage = {
      role: "user",
      content: message.trim(),
      isVoice: isVoiceInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    if (!isVoiceInput) {
      setInputMessage("");
    }

    setIsProcessing(true);
    setIsTyping(true);

    try {
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        message: msg.content,
      }));

      const response = await aiChatAPI({
        message: message.trim(),
        isVoice: isVoiceInput,
        chatHistory,
      });

      if (response.status === "success") {
        setIsTyping(false);

        // Clean the response text from markdown and formatting
        const cleanResponse = response.data.response
          .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // Remove asterisks
          .replace(/#{1,6}\s*/g, "") // Remove hash marks
          .replace(/`{1,3}([^`]+)`{1,3}/g, "$1") // Remove backticks
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove markdown links
          .replace(/^\s*[\*\-\+]\s*/gm, "• ") // Convert list markers to bullets
          .replace(/\n{3,}/g, "\n\n") // Normalize line breaks
          .trim();

        const aiMessage = {
          role: "assistant",
          content: cleanResponse,
          isVoice: isVoiceInput,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (isVoiceInput && cleanResponse) {
          speakResponse(cleanResponse);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);

      const errorMessage = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again.",
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text) => {
    if ("speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();

      // Remove any remaining special characters for better speech
      const cleanText = text
        .replace(/[*#`_~]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      speechSynthesisRef.current = utterance;
      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        speechSynthesisRef.current = null;
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        speechSynthesisRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Study Assistant
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isProcessing ? "Thinking..." : "Ready to help you learn"}
            </p>
          </div>
        </div>

        {isSpeaking && (
          <Button
            onClick={stopSpeaking}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
          >
            <VolumeX className="h-4 w-4 mr-2" />
            Stop Speaking
          </Button>
        )}
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="p-6 bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 max-w-md">
              <Bot className="h-12 w-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to your AI Study Assistant!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                I can help explain concepts, answer questions, and guide you
                through your studies.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Mic className="h-4 w-4" />
                <span>Click the mic to ask with your voice</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-500 dark:bg-blue-600"
                      : message.isError
                      ? "bg-red-500 dark:bg-red-600"
                      : "bg-gray-500 dark:bg-gray-600"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`flex-1 max-w-3xl ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${
                      message.role === "user"
                        ? "bg-blue-500 text-white dark:bg-blue-600"
                        : message.isError
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700"
                        : "bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {message.content}
                    </div>

                    <div
                      className={`flex items-center justify-between mt-2 text-xs ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span>{formatTime(message.timestamp)}</span>
                      {message.isVoice && (
                        <div className="flex items-center space-x-1">
                          <Volume2 className="h-3 w-3" />
                          <span>Voice</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          {/* Voice Button */}
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={handleListen}
            disabled={isProcessing || isSpeaking}
            className={`flex-shrink-0 transition-all duration-200 ${
              isListening
                ? "bg-red-500 hover:bg-red-600 text-white border-red-500 animate-pulse"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          {/* Input Field */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              disabled={isProcessing || isSpeaking}
              className="pr-12 py-3 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
            />

            {/* Character count or status */}
            {inputMessage.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {inputMessage.length}
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isProcessing || isSpeaking}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl transition-all duration-200"
            title="Send message"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>

        {/* Status indicators */}
        {(isListening || isProcessing || isSpeaking) && (
          <div className="flex justify-center mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
              {isListening && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening...</span>
                </>
              )}
              {isProcessing && (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Processing...</span>
                </>
              )}
              {isSpeaking && (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Speaking...</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatAssistant;
