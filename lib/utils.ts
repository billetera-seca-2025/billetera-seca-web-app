import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount)
}

export function formatDate(dateString: string | undefined | null): string {
    try {
        console.log('Attempting to format date:', dateString, 'Type:', typeof dateString)
        
        // Si la fecha es null o undefined
        if (!dateString) {
            console.error('Date string is empty or undefined')
            return 'Fecha no disponible'
        }

        // Si la fecha no es un string, intentar convertirla
        if (typeof dateString !== 'string') {
            console.warn('Date is not a string, attempting to convert:', dateString)
            dateString = String(dateString)
        }

        // Extraer los componentes de la fecha UTC
        const utcDate = new Date(dateString)
        const year = utcDate.getUTCFullYear()
        const month = utcDate.getUTCMonth()
        const day = utcDate.getUTCDate()
        const hours = utcDate.getUTCHours()
        const minutes = utcDate.getUTCMinutes()

        // Crear una nueva fecha con los componentes UTC
        const date = new Date(Date.UTC(year, month, day, hours, minutes))
        
        console.log('Parsed UTC date:', {
            utcDate,
            components: { year, month, day, hours, minutes },
            iso: date.toISOString(),
            local: date.toLocaleString('es-AR'),
            isValid: !isNaN(date.getTime()),
            originalString: dateString
        })
        
        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            console.error('Invalid date string:', dateString, 'Type:', typeof dateString)
            return 'Fecha inválida'
        }

        // Formatear la fecha en español, usando los componentes UTC
        const formattedDate = new Intl.DateTimeFormat('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC' // Usar UTC para mantener la hora original
        }).format(date)
        
        console.log('Formatted date:', formattedDate, 'From:', dateString)
        return formattedDate
    } catch (error) {
        console.error('Error formatting date:', error, 'Input:', dateString, 'Type:', typeof dateString)
        return 'Error al formatear fecha'
    }
}
