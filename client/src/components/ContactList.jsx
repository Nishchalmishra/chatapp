import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
    const { getAllContacts, allContacts, setActiveChat, isUsersLoading } =
        useChatStore();
    const { onlineUsers } = useAuthStore();
    console.log("onlineUsers: ", onlineUsers);
    console.log("allContacts: ", allContacts);
    console.log(onlineUsers.includes(String(allContacts[0])));

    useEffect(() => {
        getAllContacts();
    }, [getAllContacts]);

    if (isUsersLoading) return <UsersLoadingSkeleton />;

    return (
        <>
            {allContacts.map((contact) => (
                <div
                    key={contact.id}
                    className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                    onClick={() => setActiveChat(contact)}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`avatar ${onlineUsers.includes(String(contact.id)) ? "avatar-online" : "avatar-offline"}`}
                            // className={`avatar online`}
                        >
                            <div className="size-12 rounded-full">
                                <img
                                    src={contact.avatar || "/avatar.png"}
                                />
                            </div>
                        </div>
                        <h4 className="text-slate-200 font-medium">
                            {contact.username}
                        </h4>
                    </div>
                </div>
            ))}
        </>
    );
}
export default ContactList;
