interface Props {
  city: string;
  onClose: () => void;
}

export default function UnavailableModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">Oops! City Unavailable</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          It looks like there&apos;s already a distributor covering this city.{' '}
          <span className="font-semibold text-gray-700">
            Please choose another city to proceed.
          </span>
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
