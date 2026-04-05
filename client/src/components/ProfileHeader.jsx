import { useState, useRef } from "react";
import {LogOutIcon, VolumeOffIcon, Volume2Icon, LoaderIcon} from "lucide-react"
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore"  

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const ProfileHeader = () => {

    const { logout, authUser, updateProfile, isUpdatingProfile } = useAuthStore()
    const {isSoundEnabled, toggleSound} = useChatStore()
    const [selectedImg, setSelectedImg] = useState(null)

    const fileInputRef = useRef(null)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            await updateProfile(formData)
        } catch (error) {
            console.error(error)
        }

        // const reader = new FileReader()
        // reader.readAsDataURL(file)
        // reader.onloadend = async() => {
        //     const base64Img = reader.result
        //     setSelectedImg(base64Img)
        //     await updateProfile({avatar: base64Img})
        // }
    }

    // console.log(isUpdatingProfile)

    return (
        // <div className="p-6 border-b border-slate-700/50">
        <div className="p-4 md:p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar online">
                        <button
                            className="size-14 rounded-full overflow-hidden relative group"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <img
                                src={
                                    selectedImg ||
                                    authUser?.avatar ||
                                    "/avatar.png"
                                }
                                alt="user img"
                                className="size-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                {/* <span className="text-white text-xs">
                                   {isUpdatingProfile ? <LoaderIcon className="size-4 animate-spin"/> : "Change"  }
                                </span> */}
                                {isUpdatingProfile ? (
                                    <LoaderIcon className="size-4 animate-spin" />
                                ) : (
                                    <span className="text-white text-xs">
                                        Change
                                    </span>
                                )}
                            </div>
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-45 truncate">
                            {authUser.username}
                        </h3>

                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    {/* LOGOUT BTN */}
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={logout}
                    >
                        <LogOutIcon className="size-5" />
                    </button>

                    {/* SOUND TOGGLE BTN */}
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={() => {
                            // play click sound before toggling
                            mouseClickSound.currentTime = 0; // reset to start
                            mouseClickSound
                                .play()
                                .catch((error) =>
                                    console.log("Audio play failed:", error),
                                );
                            toggleSound();
                        }}
                    >
                        {isSoundEnabled ? (
                            <Volume2Icon className="size-5" />
                        ) : (
                            <VolumeOffIcon className="size-5" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveChat(null)}
                        className="md:hidden p-2"
                    >
                        ⬅
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
