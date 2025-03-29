import { useState, useRef, useEffect } from "react";
import { DecentraLearn_backend } from "./../../../declarations/DecentraLearn_backend";

interface Message {
    sender: "user" | "bot";
    text: string;
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        { sender: "bot", text: "Hi, how can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const askAgent = async (msg: string) => {
        try {
            const response = await DecentraLearn_backend.chat([{ role: "user", content: msg }]);
            setMessages((prevChat) => [
                ...prevChat.slice(0, -1), // Remove "Thinking..." message
                { sender: "bot", text: response },
            ]);
        } catch (e) {
            console.log(e);
            alert("An error occurred. Please try again.");
            setMessages((prevChat) => prevChat.slice(0, -1)); // Remove "Thinking..."
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: "user", text: input };
        const thinkingMessage: Message = { sender: "bot", text: "Thinking..." };

        setMessages((prevChat) => [...prevChat, userMessage, thinkingMessage]);
        setInput("");
        setIsLoading(true);

        askAgent(input);
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-2xl">
            {/* Chat Messages */}
            <div className="space-y-3 h-45 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`max-w-[80%] p-3 rounded-lg ${msg.sender === "user"
                                ? "ml-auto bg-black text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Empty div as anchor for scrolling */}
            </div>

            {/* Input Field */}
            <div className="flex items-center border-t pt-3 mt-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg outline-none text-black"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSubmit}
                    className="ml-2 p-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                    disabled={isLoading}
                >
                    🚀
                </button>
            </div>
        </div>
    );
}
