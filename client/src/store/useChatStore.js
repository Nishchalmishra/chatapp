import { create } from "zustand"
import {api} from "../lib/api.js"
import { useAuthStore } from "./useAuthStore.js"

const notificationSound = new Audio("/notification.mp3")

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    activeChat: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({ isSoundEnabled: !get().isSoundEnabled });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setActiveChat: (chat) => set({ activeChat: chat }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await api.get("/message/contacts");
            set({ allContacts: res });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await api.get("/message/chat");
            // console.log(res)
            set({ chats: res });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await api.get(`/message/${userId}`);
            set({ messages: res });
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (data) => {
        const { activeChat, messages } = get();
        const { authUser } = useAuthStore.getState();
        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            id: tempId,
            senderId: authUser.id,
            receiverId: activeChat.id,
            message: data.message,
            image: data.image,
            createdAt: new Date().toISOString(),
        };

        // immediately update ui

        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await api.post(`/message/send/${activeChat.id}`, data);
            set({ messages: messages.concat(res) });
        } catch (error) {
            console.log(error);
            set({ messages: messages });
        }
    },

    // subscribeToMessages: () => {
    //     const { activeChat, isSoundEnabled } = get();
    //     if (!activeChat) return;
    //     console.log("Subscribed to messages");

    //     const socket = useAuthStore.getState().socket;

    //     // console.log("socket in chat store: ", socket.on("newMessage"));

    //     socket.on("newMessage", (newMessage) => {
    //         const isMessageSentFromSelectedUser =
    //             newMessage.senderId === String(activeChat.id);
    //         if (!isMessageSentFromSelectedUser) return;

    //         if (isSoundEnabled) {
    //             const audio = new Audio("/notification.mp3");
    //             audio.play();
    //         }
    //         console.log("New message: ", newMessage);
    //         set({ messages: get().messages.concat(newMessage) });
    //         console.log("recieved");
    //     });

    // },

    // unsubscribeFromMessages: () => {
    //     const socket = useAuthStore.getState().socket;
    //     socket.off("newMessage");
    // },
    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        console.log("✅ Subscribed to messages");

        // 🔥 remove old listeners (VERY IMPORTANT)
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            // console.log("🔥 RECEIVED:", newMessage);

            const { activeChat, isSoundEnabled } = get();

            if (!activeChat) return;

            const isMessageSentFromSelectedUser =
                String(newMessage.senderId) === String(activeChat.id);

            if (!isMessageSentFromSelectedUser) return;

            if (isSoundEnabled) {
                notificationSound.play();
            }

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");
    },
}));