import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { TRACKING_STAGES, type TrackingStage } from './types'

interface TrackingStatusDropdownProps {
  currentStage: TrackingStage
  onStageChange: (newStage: TrackingStage) => void
  disabled?: boolean
}

export const TrackingStatusDropdown: React.FC<TrackingStatusDropdownProps> = ({
  currentStage,
  onStageChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeConfig = TRACKING_STAGES[currentStage]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs hover:opacity-90 active:scale-[0.98] ${activeConfig.badgeColor} ${activeConfig.textColor} ${activeConfig.borderColor}`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${activeConfig.dotColor}`} />
        <span>{activeConfig.shortLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 rounded-[16px] bg-white border border-[#FCE7F3] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-[#FCE7F3] mb-1">
            <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">
              Pilih Status (7 Tahap)
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-0.5 px-1.5">
            {(Object.keys(TRACKING_STAGES) as TrackingStage[]).map((stageKey) => {
              const stage = TRACKING_STAGES[stageKey]
              const isSelected = stageKey === currentStage

              return (
                <button
                  key={stageKey}
                  type="button"
                  onClick={() => {
                    onStageChange(stageKey)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-[10px] flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFF5FA] text-[#EC4899] font-semibold'
                      : 'text-[#18181B] hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${stage.dotColor}`} />
                    <div>
                      <span className="block text-[12px]">{stage.label}</span>
                      <span className="block text-[10px] text-[#71717A] leading-tight">
                        {stage.description}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
