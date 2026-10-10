import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useToast } from '@/components/ui/Toast'
import { ASSET_CLASSES } from '@/lib/navigation'
import type { AssetClass } from '@/types'

interface ParsedRow {
  line: number
  instrumentName: string
  assetClass: AssetClass
  quantity: number
  investedAmount: number
  currentValue: number
  errors: string[]
}

const SAMPLE = `instrumentName,assetClass,quantity,investedAmount,currentValue
Tata Steel,Stocks,40,32000,35500
ICICI Prudential Bluechip Fund,Mutual Funds,210,18000,19700`

function parseCsv(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const header = lines[0].split(',').map((h) => h.trim())
  const rows: ParsedRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map((c) => c.trim())
    if (cells.every((c) => !c)) continue
    const get = (key: string) => cells[header.indexOf(key)] ?? ''
    const errors: string[] = []
    const instrumentName = get('instrumentName')
    const assetClassRaw = get('assetClass')
    const quantity = Number(get('quantity'))
    const investedAmount = Number(get('investedAmount'))
    const currentValue = Number(get('currentValue'))

    if (!instrumentName) errors.push('Missing instrument name')
    if (!ASSET_CLASSES.includes(assetClassRaw as AssetClass)) errors.push(`Unrecognized asset class "${assetClassRaw}"`)
    if (!quantity || quantity <= 0) errors.push('Invalid quantity')
    if (!investedAmount || investedAmount <= 0) errors.push('Invalid invested amount')
    if (isNaN(currentValue) || currentValue < 0) errors.push('Invalid current value')

    rows.push({
      line: i + 1,
      instrumentName,
      assetClass: (ASSET_CLASSES.includes(assetClassRaw as AssetClass) ? assetClassRaw : 'Other') as AssetClass,
      quantity,
      investedAmount,
      currentValue,
      errors,
    })
  }
  return rows
}

export function CsvImportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [raw, setRaw] = useState('')
  const [rows, setRows] = useState<ParsedRow[] | null>(null)
  const addHolding = usePortfolioStore((s) => s.addHolding)
  const { show } = useToast()

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? '')
      setRaw(text)
      setRows(parseCsv(text))
    }
    reader.readAsText(file)
  }

  function handlePreview() {
    setRows(parseCsv(raw))
  }

  function handleImport() {
    if (!rows) return
    const validRows = rows.filter((r) => r.errors.length === 0)
    for (const r of validRows) {
      addHolding({
        instrumentName: r.instrumentName,
        assetClass: r.assetClass,
        accountId: 'manual',
        quantity: r.quantity,
        investedAmount: r.investedAmount,
        currentValue: r.currentValue,
        currency: 'INR',
        purchaseDate: new Date().toISOString(),
        isManual: true,
      })
    }
    show(`Imported ${validRows.length} holding${validRows.length === 1 ? '' : 's'} from CSV.`)
    handleClose()
  }

  function handleClose() {
    setRaw('')
    setRows(null)
    onClose()
  }

  const validCount = rows?.filter((r) => r.errors.length === 0).length ?? 0
  const invalidCount = (rows?.length ?? 0) - validCount

  return (
    <Modal open={open} onClose={handleClose} title="Import Holdings via CSV" description="Simulate importing holdings from a spreadsheet export." size="lg">
      <div className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-[var(--color-border-light)] p-6 text-center hover:bg-[var(--color-surface-raised)]">
          <Upload size={20} className="text-[var(--color-text-muted)]" />
          <span className="text-sm text-[var(--color-text-secondary)]">Click to choose a .csv file, or paste rows below</span>
          <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>

        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={SAMPLE}
          rows={6}
          className="w-full rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg)] p-3 font-mono text-xs text-[var(--color-text-primary)] outline-none focus:border-[var(--color-emerald)]"
        />
        <p className="text-[11px] text-[var(--color-text-muted)]">Required columns: instrumentName, assetClass, quantity, investedAmount, currentValue</p>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={handlePreview} disabled={!raw.trim()}>Preview Import</Button>
          <Button variant="ghost" onClick={() => setRaw(SAMPLE)}>Use Sample Data</Button>
        </div>

        {rows && (
          <div className="rounded-xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
              <p className="text-xs text-[var(--color-text-secondary)]">{rows.length} row(s) parsed</p>
              <div className="flex gap-2">
                <Badge tone="gain">{validCount} valid</Badge>
                {invalidCount > 0 && <Badge tone="loss">{invalidCount} invalid</Badge>}
              </div>
            </div>
            <div className="max-h-56 overflow-y-auto">
              {rows.map((r) => (
                <div key={r.line} className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2 text-xs last:border-0">
                  <span className={r.errors.length ? 'text-[var(--color-loss)]' : 'text-[var(--color-text-primary)]'}>
                    Line {r.line}: {r.instrumentName || '(no name)'} {r.errors.length > 0 && `— ${r.errors.join(', ')}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" disabled={validCount === 0} onClick={handleImport}>Import {validCount > 0 ? validCount : ''} Holdings</Button>
        </div>
      </div>
    </Modal>
  )
}
