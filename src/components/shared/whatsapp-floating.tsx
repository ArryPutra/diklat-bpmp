"use client"

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { BiLogoWhatsapp } from 'react-icons/bi'

interface WhatsAppFloatingProps {
    phoneNumber?: string
    message?: string
    className?: string
}

export default function WhatsAppFloating({
    phoneNumber = "6281234567890",
    message = "Halo, saya ingin bertanya tentang Diklat BPMP Kalsel",
    className
}: WhatsAppFloatingProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        // Delay untuk animasi muncul
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-500",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Tooltip */}
            <div className={cn(
                "bg-white px-4 py-2 rounded-lg shadow-lg border transition-all duration-300 max-w-[200px]",
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
            )}>
                <p className="text-sm font-medium text-gray-800">Butuh bantuan?</p>
                <p className="text-xs text-gray-500">Chat via WhatsApp</p>
            </div>

            {/* WhatsApp Button */}
            <button
                onClick={handleClick}
                className={cn(
                    "relative group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg",
                    "hover:scale-110 hover:shadow-xl transition-all duration-300",
                    "animate-bounce-subtle"
                )}
                aria-label="Chat via WhatsApp"
            >
                {/* Pulse Effect */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

                {/* Icon */}
                <BiLogoWhatsapp className="text-3xl relative z-10" />
            </button>
        </div>
    )
}
