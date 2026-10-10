import React from 'react'
import { Check } from 'lucide-react'

export interface StepItem {
  id: number
  title: string
  subtitle: string
}

interface BatchStepbarProps {
  steps: StepItem[]
  currentStep: number
  onSelectStep: (step: number) => void
}

export const BatchStepbar: React.FC<BatchStepbarProps> = ({
  steps,
  currentStep,
  onSelectStep,
}) => {
  const progressPercent = Math.round((currentStep / steps.length) * 100)

  return (
    <div className="w-full bg-white rounded-[20px] shadow-ceciz-surface border border-[#FBCFE8]/50 p-3 sm:p-4 mb-4">
      {/* Mobile view: Step Pill & Progress Text */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-[#EC4899]/10 text-[#EC4899] font-bold text-[11px]">
            Langkah {currentStep}/{steps.length}
          </span>
          <span className="font-semibold text-[#18181B] truncate">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <span className="text-[11px] font-medium text-[#71717A]">
          {progressPercent}% Selesai
        </span>
      </div>

      {/* Progress Bar Line Track */}
      <div className="w-full bg-[#FFF5FA] h-1.5 rounded-full overflow-hidden mb-3 border border-[#FBCFE8]/50">
        <div
          className="h-full bg-gradient-to-r from-[#EC4899] to-[#DB2777] transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3 relative">
        {steps.map((step) => {
          const isCurrent = currentStep === step.id
          const isPassed = currentStep > step.id

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(step.id)}
              className={`flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2.5 rounded-[12px] sm:rounded-[14px] text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#FFF5FA] border border-[#FBCFE8] shadow-2xs'
                  : 'hover:bg-zinc-50 border border-transparent'
              }`}
            >
              {/* Step Number / Icon Circle */}
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] sm:text-xs font-bold transition-all ${
                  isPassed
                    ? 'bg-[#16A34A] text-white shadow-2xs'
                    : isCurrent
                      ? 'bg-[#EC4899] text-white shadow-xs ring-2 sm:ring-4 ring-[#EC4899]/20'
                      : 'bg-zinc-100 text-[#71717A] border border-zinc-200'
                }`}
              >
                {isPassed ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : step.id}
              </div>

              {/* Labels */}
              <div className="min-w-0">
                <p
                  className={`text-[11px] sm:text-[13px] font-bold truncate leading-tight ${
                    isCurrent ? 'text-[#EC4899]' : isPassed ? 'text-[#18181B]' : 'text-[#71717A]'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#71717A] truncate hidden sm:block mt-0.5">
                  {step.subtitle}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BatchStepbar
