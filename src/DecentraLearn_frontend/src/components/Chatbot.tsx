import { useState, useRef, useEffect } from "react";

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        // Rest of your code remains the same
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: "user" as const, text: input }];
        setMessages(newMessages);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            const botReply = "I'm just a bot, but I can help you with your questions!";
            setMessages([...newMessages, { sender: "bot" as const, text: botReply }]);
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-2xl">
            {/* Chat Messages */}
            <div className="space-y-3 h-45 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === "user"
                                ? "ml-auto bg-black text-white"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Empty div as anchor for scrolling */}
            </div>

            {/* Input Field remains the same */}
            <div className="flex items-center border-t pt-3 mt-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg outline-none text-black"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="ml-2 p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                    🚀
                </button>
            </div>
        </div>
    );
}
