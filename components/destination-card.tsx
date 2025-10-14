import Image from "next/image"
import Link from "next/link"

interface DestinationCardProps {
  city: string
  tag: string
  description: string
  rating: number
  reviews: number
  imageSrc: string
  // Optional link to navigate when the card is clicked
  href?: string
  // Optional list of sub-destinations to show like "To: *A *B *C"
  subDestinations?: string[]
}

export default function DestinationCard({ city, tag, description, rating, reviews, imageSrc, href, subDestinations }: DestinationCardProps) {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-yellow-400"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>,
      )
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-yellow-400"
        >
          <defs>
            <linearGradient id="half-star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="50%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill="url(#half-star-gradient)"
          />
        </svg>,
      )
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-yellow-400"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>,
      )
    }

    return stars
  }

  // Two layouts:
  // 1) If href or subDestinations provided, render compact horizontal card (matches reference screenshot)
  // 2) Otherwise, fall back to previous full-image overlay style (backward compatible)

  if (href || (subDestinations && subDestinations.length > 0)) {
    return (
      <Link
        href={href || "#"}
        className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-shadow duration-200"
      >
        {/* Thumbnail (native img for robust fallback) */}
        <img
          src={imageSrc || "/placeholder.jpg"}
          alt={city}
          width={96}
          height={80}
          className="rounded-lg object-cover shrink-0"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            if (target.src.endsWith("placeholder.jpg")) return
            target.src = "/placeholder.jpg"
          }}
        />

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{city}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">{tag}</span>
          </div>
          {subDestinations && subDestinations.length > 0 ? (
            <p className="text-sm text-indigo-600/90 truncate">
              <span className="text-gray-500 mr-1">To:</span>
              {subDestinations.map((d, idx) => (
                <span key={idx} className="">
                  {idx > 0 && <span className="text-gray-400"> • </span>}
                  <span className="hover:underline">{d}</span>
                </span>
              ))}
            </p>
          ) : (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link href="#" className="block relative rounded-lg overflow-hidden h-[280px] group">
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={city}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Tag */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium z-10">
        {tag}
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-2xl font-bold text-white mb-1">{city}</h3>
        <p className="text-white/90 text-sm mb-3">{description}</p>
        <div className="flex items-center">
          <div className="flex">{renderStars()}</div>
          <span className="text-white/80 text-sm ml-2">({reviews.toLocaleString()} Reviews)</span>
        </div>
      </div>
    </Link>
  )
}

