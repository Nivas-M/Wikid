export default function CardSkeleton() {
  return (
    <div className="w-full max-w-3xl md:max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse dark:border-[#343536] dark:bg-[#1a1a1b]">
      <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[550px]">
        {/* Left Column Skeleton */}
        <div className="flex flex-col justify-between p-5 sm:p-6 md:pr-6">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 pb-2">
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-[#272729]" />
              <div className="h-4 w-36 rounded bg-gray-200 dark:bg-[#272729]" />
            </div>

            {/* Title */}
            <div className="pt-2">
              <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-[#272729]" />
            </div>

            {/* Extract Lines */}
            <div className="space-y-2.5 pt-4">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-[#272729]" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-[#272729]" />
              <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-[#272729]" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-[#27282a]">
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 rounded-full bg-gray-200 dark:bg-[#272729]" />
              <div className="h-9 w-24 rounded-full bg-gray-200 dark:bg-[#272729]" />
            </div>
            <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-[#272729]" />
          </div>
        </div>

        {/* Right Column Skeleton (Image Slot) */}
        <div className="relative flex min-h-[310px] items-center justify-center bg-gray-100 border-t md:border-t-0 md:border-l border-gray-100 dark:border-[#27282a] dark:bg-[#18191a] md:min-h-full">
          <div className="h-12 w-12 rounded-full bg-gray-200/70 dark:bg-[#272729]/70" />
        </div>
      </div>
    </div>
  );
}

