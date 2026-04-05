// import { useChatStore } from "../store/useChatStore";
// import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
// import ProfileHeader from "../components/ProfileHeader";
// import ActiveTabSwitch from "../components/ActiveTabSwitch";
// import ChatsList from "../components/ChatsList";
// import ContactList from "../components/ContactList";
// import ChatContainer from "../components/ChatContainer";
// import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

// function ChatPage() {
//     const { activeTab, activeChat } = useChatStore();

//     return (
//         <div className="relative w-full max-w-6xl h-200">
//             <BorderAnimatedContainer>
//                 {/* LEFT SIDE */}
//                 <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
//                     <ProfileHeader />
//                     <ActiveTabSwitch />

//                     <div className="flex-1 overflow-y-auto p-4 space-y-2">
//                         {activeTab === "chats" ? (
//                             <ChatsList />
//                         ) : (
//                             <ContactList />
//                         )}
//                     </div>
//                 </div>

//                 {/* RIGHT SIDE */}
//                 <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
//                     {activeChat ? (
//                         <ChatContainer />
//                     ) : (
//                         <NoConversationPlaceholder />
//                     )}
//                 </div>
//             </BorderAnimatedContainer>
//         </div>
//     );
// }
// export default ChatPage;

import { useChatStore } from "../store/useChatStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
    const { activeTab, activeChat } = useChatStore();

    return (
        // <div className="relative w-full max-w-6xl h-screen">
        //     <BorderAnimatedContainer>
        //         {/* LEFT SIDE */}
        //         <div
        //             className={`
        //                 w-full md:w-80
        //                 bg-slate-800/50 backdrop-blur-sm flex flex-col
        //                 ${activeChat ? "hidden md:flex" : "flex"}
        //             `}
        //         >
        //             <ProfileHeader />
        //             <ActiveTabSwitch />

        //             <div className="flex-1 overflow-y-auto p-4 space-y-2">
        //                 {activeTab === "chats" ? (
        //                     <ChatsList />
        //                 ) : (
        //                     <ContactList />
        //                 )}
        //             </div>
        //         </div>

        //         {/* RIGHT SIDE */}
        //         <div
        //             className={`
        //                 flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm
        //                 ${!activeChat ? "hidden md:flex" : "flex"}
        //             `}
        //         >
        //             {activeChat ? (
        //                 <ChatContainer />
        //             ) : (
        //                 <NoConversationPlaceholder />
        //             )}
        //         </div>
        //     </BorderAnimatedContainer>
        // </div>
        // <div className="relative w-full max-w-6xl h-screen">
        <div className="relative w-full h-screen md:max-w-6xl md:mx-auto">
            <BorderAnimatedContainer>
                {/* LEFT */}
                <div
                    className={`
                    w-full md:w-80 flex flex-col bg-slate-800/50 backdrop-blur-sm
                    ${activeChat ? "hidden md:flex" : "flex"}
                    `}
                >
                    <ProfileHeader />
                    <ActiveTabSwitch />

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {activeTab === "chats" ? (
                            <ChatsList />
                        ) : (
                            <ContactList />
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div
                    className={`
                        flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm
                        ${!activeChat ? "hidden md:flex" : "flex"}
                    `}
                >
                    {activeChat ? (
                        <ChatContainer />
                    ) : (
                        <NoConversationPlaceholder />
                    )}
                </div>
            </BorderAnimatedContainer>
        </div>
    );
}

export default ChatPage;
