import { create } from 'zustand'
import { api } from '../lib/api.js'
import toast from 'react-hot-toast'
import { io } from "socket.io-client"



export const useAuthStore = create((set, get) => ({
    
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoginingIn: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await api.get('/auth/check')
            set({ authUser: res })
            get().connectSocket()
        } catch (error) {
            console.log(error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signUp: async (data) => {
        console.log("call hua")
        set({ isSigningUp: true })
        try {
            const res = await api.post('/auth/signup', data)
            set({ authUser: res })

            toast.success('Account created successfully')
            get().connectSocket()
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        console.log("call hua")
        set({ isLoginingIn: true })
        try {
            const res = await api.post('/auth/login', data)
            set({ authUser: res })

            toast.success('Logged in successfully')

            get().connectSocket()
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            set({ isLoginingIn: false })
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout')
            set({ authUser: null })
            toast.success('Logged out successfully')
            get().disconnectSocket()
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await api.put('/auth/update', data)
            set({ authUser: res })
            toast.success('Profile updated successfully')
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {

        const { authUser } = get()

        if(!authUser || get().socket?.connected ) return
        const socket = io('http://localhost:5000', {
            withCredentials: true,
        })

        socket.connect()

        set({ socket })

        socket.on("connect", () => {
            console.log("socket connected", socket.connected, socket)
        } )

        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds })
        })

        // console.log("socket connected", socket.connected, socket)
    },

    disconnectSocket: () => {
        if(!get().socket?.connected ) return get().socket?.disconnect()
    }

}))