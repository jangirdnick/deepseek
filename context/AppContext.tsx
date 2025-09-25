"use client"

import { useUser } from "@clerk/nextjs"
import { createContext, PropsWithChildren, useContext } from "react"

export const AppContext = createContext<{ user: ReturnType<typeof useUser>["user"] | undefined }>({ user: undefined });

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = ({children}: PropsWithChildren) => {
    const {user} = useUser()

    const value = {user}

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}