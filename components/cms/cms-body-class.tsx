'use client'

import { useEffect } from 'react'

export default function CMSBodyClass() {
  useEffect(() => {
    // Add class to body when CMS is mounted
    document.body.classList.add('cms-page')
    document.documentElement.style.backgroundColor = '#171717'
    document.body.style.backgroundColor = '#171717'
    
    return () => {
      // Cleanup on unmount
      document.body.classList.remove('cms-page')
    }
  }, [])

  return null
}

