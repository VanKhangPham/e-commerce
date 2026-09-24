import React from 'react'

export const ProductSkeleton: React.FC<{ count?: number; layout?: 'grid' | 'list' }> = ({
  count = 4,
  layout = 'grid',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-white rounded-2xl border border-slate-100 p-4 ${
            layout === 'list' ? 'flex flex-col sm:flex-row gap-5' : 'flex flex-col'
          }`}
        >
          <div
            className={`bg-slate-100 rounded-xl ${
              layout === 'list' ? 'w-full sm:w-56 h-48 sm:h-36' : 'aspect-square w-full mb-4'
            }`}
          />
          <div className="flex-1 space-y-3">
            <div className="h-3 bg-slate-100 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="h-5 bg-slate-100 rounded w-1/3 mt-4" />
            <div className="h-9 bg-slate-100 rounded-xl w-full mt-3" />
          </div>
        </div>
      ))}
    </>
  )
}
