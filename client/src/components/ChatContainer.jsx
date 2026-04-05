import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
    const {
        activeChat,
        getMessagesByUserId,
        messages,
        isMessagesLoading,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    // console.log(subscribeToMessages)

    // console.log("messages: ", messages)


    useEffect(() => {
        getMessagesByUserId(activeChat.id);
        subscribeToMessages();

        // clean up
        return () => unsubscribeFromMessages();
    }, [
        activeChat,
        getMessagesByUserId,
        subscribeToMessages,
        unsubscribeFromMessages,
    ]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <>
            <ChatHeader />
            {/* <div className=" 
                flex-1 px-6 overflow-y-auto py-8
            "> */}
            <div className="relative w-full h-screen md:max-w-6xl md:mx-auto">
                {/* <div className="flex flex-col h-full md:h-auto"> */}
                {messages.length > 0 && !isMessagesLoading ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chat ${msg.senderId === authUser.id ? "chat-end" : "chat-start"}`}
                            >
                                <div
                                    className={`chat-bubble relative ${
                                        msg.senderId === authUser.id
                                            ? "bg-cyan-600 text-white"
                                            : "bg-slate-800 text-slate-200"
                                    }`}
                                >
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="Shared"
                                            className="rounded-lg h-48 object-cover"
                                        />
                                    )}
                                    {msg.message && (
                                        <p className="mt-1">{msg.message}</p>
                                    )}
                                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                                        {new Date(
                                            msg.createdAt,
                                        ).toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {/* 👇 scroll target */}
                        <div ref={messageEndRef} />
                    </div>
                ) : isMessagesLoading ? (
                    <MessagesLoadingSkeleton />
                ) : (
                    <NoChatHistoryPlaceholder name={activeChat.username} />
                )}
            </div>

            <MessageInput />
        </>
    );
}

export default ChatContainer;
