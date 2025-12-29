'use client'

import { createContext, useContext } from 'react'
import type {
  ThemeToggleContentData,
  WaitlistModalContentData,
  SplashScreenContentData,
  LegalUiContentData,
  ErrorUiContentData,
  LoadingUiContentData,
} from '@/lib/validation/global-content-schemas'

export interface GlobalContentContextValue {
  themeToggle?: ThemeToggleContentData
  waitlistModal?: WaitlistModalContentData
  splashScreen?: SplashScreenContentData
  legalUi?: LegalUiContentData
  errorUi?: ErrorUiContentData
  loadingUi?: LoadingUiContentData
}

const GlobalContentContext = createContext<GlobalContentContextValue>({})

export function GlobalContentProvider({
  value,
  children,
}: {
  value: GlobalContentContextValue
  children: React.ReactNode
}) {
  return (
    <GlobalContentContext.Provider value={value}>
      {children}
    </GlobalContentContext.Provider>
  )
}

export function useGlobalContent() {
  return useContext(GlobalContentContext)
}
