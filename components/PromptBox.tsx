import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"

interface PromptBoxProps {
    isLoading: boolean
    setIsLoading: (v: boolean) => void
}

function PromptBox({isLoading, setIsLoading}: PromptBoxProps) {

    const [prompt, setPrompt] = useState('')

  return (
    <form className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>

        <textarea 
        className=" outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message DeepSeek" required
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}/>

        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
                <p className="flex items-center gap-2 text-sm border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                    <Image className="h-5" src={assets.deepthink_icon} alt="" />
                    DeepThink (R1)
                </p>
                <p className="flex items-center gap-2 text-sm border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                    <Image className="h-5" src={assets.search_icon} alt="" />
                    Search
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Image className="h-5 cursor-pointer" src={assets.pin_icon} alt="" />
                <button className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
                    <Image className="h-3.5 cursor-pointer" src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt="" />
                </button>
            </div>
        </div>

    </form>
  )
}

export default PromptBox
