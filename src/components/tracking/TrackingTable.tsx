import { useState } from 'react'
import { Plus, CheckSquare, Square, Package } from 'lucide-react'
import type { TrackingItem, TrackingStage } from '@/types/tracking'
import { TrackingStatusDropdown } from './TrackingStatusDropdown'

interface TrackingTableProps {
  items: TrackingItem[]
  onUpdateStatus: (id: string, newStage: TrackingStage) => void
  onToggleCheckout: (id: string) => void
  onAddResi: (id: string, resi: string) => void
}

const COUNTRY_FLAGS: Record<string, string> = {
  JP: '🇯🇵',
  KR: '🇰🇷',
  CH: '🇨🇳',
  TH: '🇹🇭',
  INA: '🇮🇩',
}

export const TrackingTable: React.FC<TrackingTableProps> = ({
  items,
  onUpdateStatus,
  onToggleCheckout,
  onAddResi,
}) => {
  const [activeResiModalId, setActiveResiModalId] = useState<string | null>(null)
  const [newResiInput, setNewResiInput] = useState('')

  const handleSaveResi = (id: string) => {
    if (!newResiInput.trim()) return
    onAddResi(id, newResiInput.trim())
    setNewResiInput('')
    setActiveResiModalId(null)
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-[#FBCFE8]/40 p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FFF5FA] text-[#EC4899] flex items-center justify-center mx-auto">
          <Package className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#18181B]">Tidak ada data tracking</h3>
        <p className="text-xs text-[#71717A]">
          Belum ada batch atau barang yang sesuai dengan filter yang dipilih.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[24px] shadow-ceciz-surface border border-[#FBCFE8]/40 overflow-hidden">
      {/* Desktop Table View (md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-[#FFF5FA] border-b border-[#FCE7F3] text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
              <th className="py-3.5 px-4 w-12 text-center">NO</th>
              <th className="py-3.5 px-4 min-w-[180px]">BATCH & GUDANG</th>
              <th className="py-3.5 px-4 min-w-[200px]">ITEM & BUYER</th>
              <th className="py-3.5 px-4 min-w-[180px]">STATUS 7 TAHAP</th>
              <th className="py-3.5 px-4 min-w-[160px]">NO. RESI</th>
              <th className="py-3.5 px-4 w-28 text-center">CO SHOPEE</th>
              <th className="py-3.5 px-4 w-24 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FCE7F3] text-xs">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-[#FFF5FA]/30 transition-colors">
                <td className="py-3.5 px-4 text-center font-medium text-[#71717A]">
                  {idx + 1}
                </td>

                {/* Batch & WH */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#18181B]">
                    <span>{COUNTRY_FLAGS[item.countryCode] || '🌐'}</span>
                    <span>{item.batchCode}</span>
                  </div>
                  <span className="text-[11px] text-[#71717A] block truncate max-w-[220px]" title={item.batchName}>
                    {item.batchName}
                  </span>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded-[6px] text-[10px] font-medium bg-zinc-100 text-zinc-700">
                    {item.warehouseName}
                  </span>
                </td>

                {/* Item & Buyer */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#18181B] text-[13px]">
                    {item.itemName}
                  </div>
                  <div className="text-[11px] text-[#71717A] mt-0.5">
                    Buyer: <span className="font-medium text-[#18181B]">{item.buyerName}</span> ({item.buyerUsername})
                  </div>
                  <span className="text-[10px] text-[#A1A1AA] block mt-0.5">
                    Qty: {item.qty} pc • Update: {item.updatedAt}
                  </span>
                </td>

                {/* 7-Stage Dropdown Inline */}
                <td className="py-3.5 px-4">
                  <TrackingStatusDropdown
                    currentStage={item.status}
                    onStageChange={(newStage) => onUpdateStatus(item.id, newStage)}
                  />
                </td>

                {/* Resi Badges & Input */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1 items-center">
                    {item.resiNumbers.map((resi, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 rounded-[6px] text-[10px] font-mono font-medium bg-[#FFF5FA] border border-[#FBCFE8] text-[#EC4899]"
                      >
                        {resi}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveResiModalId(item.id)
                        setNewResiInput('')
                      }}
                      className="p-1 rounded-[6px] border border-dashed border-[#FBCFE8] text-[#EC4899] hover:bg-[#FFF5FA] transition-colors cursor-pointer"
                      title="Tambah nomor resi"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Checklist CO Shopee (PRD B §6.4 monitoring terpisah) */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => onToggleCheckout(item.id)}
                    className="inline-flex items-center justify-center cursor-pointer p-1 rounded-lg hover:bg-[#FFF5FA] transition-colors"
                    title={item.checkedOut ? 'Sudah CO Shopee' : 'Belum CO Shopee'}
                  >
                    {item.checkedOut ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-400" />
                    )}
                  </button>
                </td>

                {/* Status Arsip / Aktif */}
                <td className="py-3.5 px-4 text-center">
                  {item.isArchived ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span>Arsip</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Aktif</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (md:hidden) */}
      <div className="md:hidden divide-y divide-[#FCE7F3]">
        {items.map((item, idx) => (
          <div key={item.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#EC4899] text-white text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-bold text-xs text-[#18181B]">
                  {COUNTRY_FLAGS[item.countryCode] || '🌐'} {item.batchCode}
                </span>
              </div>
              {item.isArchived ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600">
                  Arsip
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                  Aktif
                </span>
              )}
            </div>

            <div>
              <div className="font-semibold text-xs text-[#18181B]">{item.itemName}</div>
              <div className="text-[11px] text-[#71717A]">
                Buyer: <span className="font-medium text-[#18181B]">{item.buyerName}</span> ({item.buyerUsername}) • Qty: {item.qty}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#71717A] font-medium">Status 7 Tahap:</span>
              <TrackingStatusDropdown
                currentStage={item.status}
                onStageChange={(newStage) => onUpdateStatus(item.id, newStage)}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#71717A] font-medium">Checklist CO Shopee:</span>
              <button
                type="button"
                onClick={() => onToggleCheckout(item.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                {item.checkedOut ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckSquare className="w-4 h-4" /> Sudah CO
                  </span>
                ) : (
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Square className="w-4 h-4" /> Belum CO
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Quick Input Resi */}
      {activeResiModalId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] shadow-2xl border border-[#FBCFE8] max-w-sm w-full p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <h4 className="text-sm font-bold text-[#18181B]">Tambah Nomor Resi</h4>
            <input
              type="text"
              placeholder="Contoh: JP-YAMATO-889102"
              value={newResiInput}
              onChange={(e) => setNewResiInput(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[12px] border border-[#FCE7F3] text-xs font-medium text-[#18181B] focus-ceciz-ring"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveResiModalId(null)}
                className="px-3.5 py-2 rounded-[10px] text-xs font-semibold text-[#71717A] hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSaveResi(activeResiModalId)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[#EC4899] text-white hover:bg-[#DB2777] transition-colors cursor-pointer shadow-sm"
              >
                Simpan Resi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
