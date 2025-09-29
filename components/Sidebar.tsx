import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { useClerk, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import ChatLabel from './ChatLabel';
import { useState } from 'react';

interface SidebarProps {
    expend: boolean;
    setExpand: (v: boolean) => void
}


function Sidebar({expend, setExpand}: SidebarProps) {
  
  const {openSignIn} = useClerk()
  const {user, chats, createNewChat} = useAppContext()
  const [openMenu, setOpenMenu] = useState({
    id: 0, open: false
  })

  return (
    <div className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all ease-linear z-50 max-md:absolute max-md:h-screen
    ${expend ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'}`}>
      {/* top bar */}
      <div>
        <div className={`flex ${expend ? 'flex-row gap-10' : 'flex-col items-center gap-8'}`}>
            <Image className={expend ? "w-36" : "w-10"} src={expend ? assets.logo_text : assets.logo_icon} alt='' />

            <div 
            onClick={() => setExpand(!expend)}
            className='group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer'>
                <Image src={assets.menu_icon} alt='' className='md:hidden'/>
                <Image src={expend ? assets.sidebar_close_icon : assets.sidebar_icon} alt='' className='hidden md:block w-7'/>

                <div className={` absolute w-max ${expend ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"} opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg`}>
                    {expend ? 'Close sidebar' : 'Open sidebar'}
                    <div className={`w-3 h-3 absolute bg-black rotate-45 ${expend ? "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`}>
                    </div>
                </div>
            </div>
        </div>

        <button onClick={createNewChat} className={`mt-8 flex items-center justify-center cursor-pointer
            ${expend ? 'bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max' 
            : 'group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg'}`}>
            <Image className={expend ? 'w-6' : 'w-7'} src={expend ? assets.chat_icon : assets.chat_icon_dull} alt='' />
            <div className=' absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
                New chat
                <div className='w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5'></div>
            </div>
            {expend && <p className='text-white text font-medium'>New chat</p> }
        </button>

        <div className={`mt-8 text-white/25 text-sm ${expend ? 'block' : 'hidden'}`}>
          <p className='my-1'>Recent</p>
          {chats.map((chat, index) => <ChatLabel key={index} name={chat.name} id={chat.id} openMenu={openMenu} setOpenMenu={setOpenMenu} />)}
        </div>
      </div>

      {/* bottom bar */}
      <div>
        <div className={`flex items-center cursor-pointer group relative ${expend ? "gap-1 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10 cursor-pointer" 
            : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"}`}>
            <Image className={expend ? 'w-5' : 'w-6.5 mx-auto'} src={expend ? assets.phone_icon : assets.phone_icon_dull} alt='' />
            <div className={` absolute -top-60 pb-8 ${!expend && "-right-40"} opacity-0 group-hover:opacity-100 hidden group-hover:block transition`}>
            <div className={`relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg`}>
                <Image src={assets.qrcode} alt='' className='w-44' />
                <p>Scan to get DeepSeek App</p>
                <div className={`w-3 h-3 absolute bg-black rotate-45 ${expend ? '-right-12' : 'left-4'} -bottom-1.5`}></div>
            </div>
            </div>
            {expend && <> <span>Get App</span> <Image src={assets.new_icon} alt='' /> </>}
        </div>


        <div onClick={() => user ? null : openSignIn()}
        className={`flex items-center ${expend ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'} gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}>
            {user ? <UserButton /> 
            : <Image src={assets.profile_icon} alt='' className='w-7'/>
            }
            {expend && <span>My Profile</span>}
        </div>
      </div>

    </div>
  )
}

export default Sidebar
