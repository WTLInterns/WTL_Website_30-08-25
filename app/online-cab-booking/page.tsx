import { Metadata } from "next"
import OnlineCabBookingContent from "@/components/OnlineCabBookingContent"

export const metadata: Metadata = {
  title: "WTL — Online Cab Booking & Outstation Cabs in India",
  description:
    "Book reliable cabs, outstation cars and hourly rentals with WTL. Transparent fares, vetted drivers, 24/7 support and eco-friendly options. Book now!",
}

export default function Page() {
  return <OnlineCabBookingContent />
}
