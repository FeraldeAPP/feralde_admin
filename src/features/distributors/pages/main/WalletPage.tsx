import { HugeiconsIcon } from "@hugeicons/react"
import { Wallet02Icon } from "@hugeicons/core-free-icons"

export default function WalletPage() {
    return (
        <div className="flex flex-col gap-6 p-4 font-[var(--font-bricolage)] text-[#393939]">
            <div>
                <p className="text-[12px] text-[#A5A5A5] font-medium leading-tight">Distributor Portal</p>
                <h1 className="text-2xl font-bold tracking-tight text-[#393939]">My Earnings & Wallet</h1>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[#F2F2F2] rounded-2xl bg-white p-8 text-center mt-4">
                <div className="h-16 w-16 rounded-full bg-stone-50 flex items-center justify-center mb-4">
                    <HugeiconsIcon icon={Wallet02Icon} size={32} className="text-stone-400" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Wallet Page</h3>
                <p className="text-stone-500 max-w-xs mx-auto text-sm mt-2">
                    This is a placeholder for the Wallet page. Track your earnings, commissions, and withdrawal history here.
                </p>
            </div>
        </div>
    )
}
