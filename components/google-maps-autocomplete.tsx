"use client"

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"

interface GoogleMapsAutocompleteProps {
  pickupId: string
  dropId: string
}

// Keep track of script loading state globally
let scriptLoadingPromise: Promise<void> | null = null

export default function GoogleMapsAutocomplete({ pickupId, dropId }: GoogleMapsAutocompleteProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const loadGoogleMaps = async () => {
      try {
        // If script is already loaded, initialize immediately
        if (window.google?.maps?.places) {
          initializeAutocomplete()
          return
        }

        // If script is already being loaded, wait for it
        if (scriptLoadingPromise) {
          await scriptLoadingPromise
          initializeAutocomplete()
          return
        }

        // Create new script loading promise
        scriptLoadingPromise = new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDuZC6kFobB0pnp-k3VcxQIjvb0EhgfnVIlibraries=places"
          script.async = true

          script.onload = () => {
            initializeAutocomplete()
            setIsLoaded(true)
            resolve()
          }

          script.onerror = (error) => {
            console.error('Error loading Google Maps:', error)
            reject(error)
          }

          document.head.appendChild(script)
        })

        await scriptLoadingPromise
      } catch (error) {
        console.error('Error in loadGoogleMaps:', error)
      }
    }

    const initializeAutocomplete = () => {
      const pickupInput = document.getElementById(pickupId) as HTMLInputElement
      const dropInput = document.getElementById(dropId) as HTMLInputElement

      if (pickupInput && window.google?.maps?.places) {
        const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInput, {
          types: ['address'],
          componentRestrictions: { country: 'in' }
        })
      }

      if (dropInput && window.google?.maps?.places) {
        const dropAutocomplete = new window.google.maps.places.Autocomplete(dropInput, {
          types: ['address'],
          componentRestrictions: { country: 'in' }
        })
      }
    }

    loadGoogleMaps()

    return () => {
      // Don't remove the script as it might be used by other components
      // Only cleanup if this is the last component using it
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]')
      if (scripts.length === 1) {
        document.head.removeChild(scripts[0])
        scriptLoadingPromise = null
      }
    }
  }, [pickupId, dropId])

  return null
} 