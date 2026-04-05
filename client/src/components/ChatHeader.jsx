import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
    const { activeChat, setActiveChat } = useChatStore();
    const { onlineUsers } = useAuthStore();
    // console.log("Online: ", onlineUsers)
    // console.log("activeChat: ", activeChat.id)
    const isOnline = onlineUsers.includes(String(activeChat.id));
    // console.log("isOnline: ", isOnline);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape") setActiveChat(null);
        };

        window.addEventListener("keydown", handleEscKey);

        // cleanup function
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [setActiveChat]);

    return (
        <div
            className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-21 px-6 flex-1"
        >
            <div className="flex items-center space-x-3">
                <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
                    <div className="w-12 rounded-full">
                        <img
                            src={activeChat.avatar || "/avatar.png"}
                            alt={activeChat.username}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-slate-200 font-medium">
                        {activeChat.username}
                    </h3>
                    <p className="text-slate-400 text-sm"> 
                        {isOnline ? "online" : "offline"}
                    </p>
                </div>
            </div>

            <button onClick={() => setActiveChat(null)}>
                <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
            </button>
        </div>
    );
}
export default ChatHeader;
