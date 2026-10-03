'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  getNodesBounds,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { jsPDF } from 'jspdf'

// ── Types ──────────────────────────────────────────────────────────────────────
export type TreeMember = {
  id: string
  first_name: string | null
  last_name: string | null
  badge_number: string | null
  pledge_class: string | null
  big_brother_id: string | null
  hide_entry: boolean | null
  is_deceased: boolean | null
  member_status: string | null
}

// Deceased-only members are shown in full on the tree (unlike the directory,
// which hides them) so lineage stays visible. Expelled members — and anyone
// else manually hidden — still render as blank boxes.
function isTreeHidden(m: TreeMember): boolean {
  if (!m.hide_entry) return false
  if (m.is_deceased && m.member_status !== 'expelled_other') return false
  return true
}

type NodeData = {
  member: TreeMember
  focused: boolean
  inLineage: boolean
  dimmed: boolean
}

// ── Layout constants ───────────────────────────────────────────────────────────
const NODE_W = 172
const NODE_H = 76
const H_GAP = 32    // horizontal gap between sibling subtrees
const V_GAP = 90    // vertical gap between generations
const TREE_GAP = 130 // gap between separate root family trees

// ── Tree layout ────────────────────────────────────────────────────────────────
interface LayoutNode {
  id: string
  member: TreeMember
  children: LayoutNode[]
  subtreeWidth: number
  x: number
  y: number
}

function buildForest(members: TreeMember[]): LayoutNode[] {
  const map = new Map<string, LayoutNode>()
  for (const m of members) {
    map.set(m.id, { id: m.id, member: m, children: [], subtreeWidth: 0, x: 0, y: 0 })
  }
  const roots: LayoutNode[] = []
  for (const m of members) {
    const node = map.get(m.id)!
    if (m.big_brother_id && map.has(m.big_brother_id)) {
      map.get(m.big_brother_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  function sortChildren(node: LayoutNode) {
    node.children.sort((a, b) =>
      (parseInt(a.member.badge_number ?? '999999') || 999999) -
      (parseInt(b.member.badge_number ?? '999999') || 999999)
    )
    node.children.forEach(sortChildren)
  }
  roots.sort((a, b) =>
    (parseInt(a.member.badge_number ?? '999999') || 999999) -
    (parseInt(b.member.badge_number ?? '999999') || 999999)
  )
  roots.forEach(sortChildren)
  return roots
}

function calcSubtreeWidth(node: LayoutNode): number {
  if (node.children.length === 0) {
    node.subtreeWidth = NODE_W
    return NODE_W
  }
  const childTotal = node.children.reduce(
    (sum, c, i) => sum + calcSubtreeWidth(c) + (i > 0 ? H_GAP : 0), 0
  )
  node.subtreeWidth = Math.max(NODE_W, childTotal)
  return node.subtreeWidth
}

function assignPositions(node: LayoutNode, left: number, depth: number): void {
  node.y = depth * (NODE_H + V_GAP)
  node.x = left + (node.subtreeWidth - NODE_W) / 2

  const childTotal = node.children.reduce(
    (sum, c, i) => sum + c.subtreeWidth + (i > 0 ? H_GAP : 0), 0
  )
  let childLeft = left + (node.subtreeWidth - childTotal) / 2
  for (const child of node.children) {
    assignPositions(child, childLeft, depth + 1)
    childLeft += child.subtreeWidth + H_GAP
  }
}

function buildFlowElements(members: TreeMember[]): { nodes: Node[], edges: Edge[] } {
  const flowNodes: Node[] = []
  const flowEdges: Edge[] = []
  const roots = buildForest(members)

  let left = 0
  for (const root of roots) {
    calcSubtreeWidth(root)
    assignPositions(root, left, 0)
    left += root.subtreeWidth + TREE_GAP
  }

  function traverse(node: LayoutNode) {
    flowNodes.push({
      id: node.id,
      type: 'member',
      position: { x: node.x, y: node.y },
      data: { member: node.member, focused: false, inLineage: false, dimmed: false } as NodeData,
      style: { width: NODE_W },
    })
    for (const child of node.children) {
      flowEdges.push({
        id: `${node.id}->${child.id}`,
        source: node.id,
        target: child.id,
        type: 'smoothstep',
        style: { stroke: '#4D0000', strokeWidth: 2 },
      })
      traverse(child)
    }
  }
  for (const root of roots) traverse(root)

  return { nodes: flowNodes, edges: flowEdges }
}

// ── Export: hand-built SVG, not a DOM screenshot ────────────────────────────────
// Earlier versions rendered the export by screenshotting the live xyflow DOM
// (via html-to-image, rasterizing through an SVG <foreignObject>). That broke
// badly for a tree wide enough to have many separate root families side by
// side — tens of thousands of CSS pixels is far more than that kind of
// foreignObject rasterization reliably handles, producing mostly-blank,
// corrupted output rather than a resize, regardless of how the final file
// size was capped.
//
// This builds the export directly from the same layout data used to draw the
// tree on screen (exact positions, text, lineage) as plain SVG markup —
// rectangles, text, and elbow-connector paths. No DOM cloning, no rasterize-
// at-full-size step: a 20,000px-wide tree is still just a few KB of markup,
// loads as an <img> in milliseconds, and draws cleanly onto a canvas of any
// target size since it's true vector source, not a pre-rasterized bitmap.
const EXPORT_PADDING = 48

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildExportSvgMarkup(nodes: Node[], edges: Edge[]): { svg: string; width: number; height: number } {
  const bounds = getNodesBounds(nodes)
  const width = Math.ceil(bounds.width + EXPORT_PADDING * 2)
  const height = Math.ceil(bounds.height + EXPORT_PADDING * 2)
  const ox = -bounds.x + EXPORT_PADDING
  const oy = -bounds.y + EXPORT_PADDING

  const nodeById = new Map(nodes.map(n => [n.id, n]))

  const edgeMarkup = edges.map(e => {
    const s = nodeById.get(e.source)
    const t = nodeById.get(e.target)
    if (!s || !t) return ''
    const x1 = s.position.x + NODE_W / 2 + ox
    const y1 = s.position.y + NODE_H + oy
    const x2 = t.position.x + NODE_W / 2 + ox
    const y2 = t.position.y + oy
    const midY = (y1 + y2) / 2
    return `<path d="M ${x1} ${y1} V ${midY} H ${x2} V ${y2}" fill="none" stroke="#4D0000" stroke-width="2"/>`
  }).join('')

  const nodeMarkup = nodes.map(n => {
    const { member } = n.data as NodeData
    const x = n.position.x + ox
    const y = n.position.y + oy

    if (isTreeHidden(member)) {
      return `<rect x="${x}" y="${y}" width="${NODE_W}" height="${NODE_H}" rx="12" ry="12" fill="#1A0000" fill-opacity="0.3" stroke="#4D0000" stroke-dasharray="4 3"/>`
    }

    const name = `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() || '—'
    return (
      `<rect x="${x}" y="${y}" width="${NODE_W}" height="${NODE_H}" rx="12" ry="12" fill="#1A0000" stroke="#4D0000"/>` +
      `<text x="${x + 12}" y="${y + 23}" fill="#ffffff" font-size="11" font-weight="700" font-family="Arial, Helvetica, sans-serif">${escapeXml(name)}</text>` +
      `<text x="${x + 12}" y="${y + 39}" fill="#C8A028" font-size="10" font-family="Arial, Helvetica, sans-serif">#${escapeXml(member.badge_number ?? '')}</text>` +
      `<text x="${x + 12}" y="${y + 54}" fill="#8A8A8A" font-size="10" font-family="Arial, Helvetica, sans-serif">${escapeXml(member.pledge_class ?? '')}</text>`
    )
  }).join('')

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="#0D0000"/>${edgeMarkup}${nodeMarkup}</svg>`

  return { svg, width, height }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load the generated image.'))
    img.src = src
  })
}

// ── Member node component ──────────────────────────────────────────────────────
function MemberNodeComponent({ data }: NodeProps) {
  const { member, focused, inLineage, dimmed } = data as NodeData

  if (isTreeHidden(member)) {
    return (
      <div
        style={{ width: NODE_W, opacity: dimmed ? 0.08 : 0.35 }}
        className="rounded-xl border border-dashed border-kp-border bg-kp-surface/20 px-3 py-2.5 select-none"
      >
        <Handle type="target" position={Position.Top}
          style={{ background: 'transparent', border: 'none', width: 1, height: 1 }} />
        <div className="h-3 w-16 rounded bg-kp-border/40 mb-2" />
        <div className="h-2 w-8 rounded bg-kp-border/30" />
        <Handle type="source" position={Position.Bottom}
          style={{ background: 'transparent', border: 'none', width: 1, height: 1 }} />
      </div>
    )
  }

  const name = `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim()

  return (
    <div
      style={{ width: NODE_W, opacity: dimmed ? 0.12 : 1 }}
      className={`
        rounded-xl border px-3 py-2.5 transition-all select-none
        ${focused
          ? 'bg-kp-gold/10 border-kp-gold shadow-[0_0_16px_rgba(200,160,40,0.3)]'
          : inLineage
            ? 'bg-kp-card border-kp-blue/80'
            : 'bg-kp-surface border-kp-border hover:border-kp-border/80'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />
      <div className={`text-xs font-bold truncate leading-tight ${focused ? 'text-kp-gold' : 'text-white'}`}>
        {name || '—'}
      </div>
      <div className="text-kp-gold/70 text-[10px] mt-1 leading-none">
        #{member.badge_number}
      </div>
      <div className="text-gray-500 text-[10px] truncate mt-1 leading-none">
        {member.pledge_class ?? ''}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />
    </div>
  )
}

const nodeTypes = { member: MemberNodeComponent }

// ── Inner tree (needs ReactFlowProvider context) ───────────────────────────────
// Raster output cap (px, long edge) for the exported PNG/PDF — comfortably
// under the ~16,384px canvas size limit most browsers share.
const EXPORT_MAX_DIMENSION = 8000

function FamilyTreeInner({ members, initialFocusId }: { members: TreeMember[]; initialFocusId?: string }) {
  const { fitView } = useReactFlow()
  const [focusedId, setFocusedId] = useState<string | null>(initialFocusId ?? null)
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null)

  const { nodes: baseNodes, edges: baseEdges } = useMemo(
    () => buildFlowElements(members),
    [members]
  )

  const memberMap = useMemo(() => new Map(members.map(m => [m.id, m])), [members])

  // Collect all ancestor + descendant IDs for the focused member
  const focusedLineage = useMemo((): Set<string> | null => {
    if (!focusedId) return null
    const set = new Set<string>([focusedId])
    // ancestors
    let cur = memberMap.get(focusedId)
    while (cur?.big_brother_id) {
      set.add(cur.big_brother_id)
      cur = memberMap.get(cur.big_brother_id)
    }
    // descendants
    function addDesc(id: string) {
      for (const m of members) {
        if (m.big_brother_id === id) {
          set.add(m.id)
          addDesc(m.id)
        }
      }
    }
    addDesc(focusedId)
    return set
  }, [focusedId, members, memberMap])

  const nodes = useMemo((): Node[] =>
    baseNodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        focused: n.id === focusedId,
        inLineage: focusedLineage ? (focusedLineage.has(n.id) && n.id !== focusedId) : false,
        dimmed: focusedLineage ? !focusedLineage.has(n.id) : false,
      } as NodeData,
    })),
    [baseNodes, focusedId, focusedLineage]
  )

  const edges = useMemo((): Edge[] =>
    baseEdges.map(e => {
      const inPath = focusedLineage?.has(e.source) && focusedLineage?.has(e.target)
      return {
        ...e,
        style: {
          stroke: inPath ? '#C8A028' : focusedLineage ? '#1A0000' : '#4D0000',
          strokeWidth: inPath ? 2.5 : 2,
          opacity: focusedLineage && !inPath ? 0.06 : 1,
        },
      }
    }),
    [baseEdges, focusedLineage]
  )

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return members
      .filter(m => !isTreeHidden(m) &&
        `${m.first_name} ${m.last_name} ${m.badge_number}`.toLowerCase().includes(q))
      .slice(0, 10)
  }, [search, members])

  const jumpTo = useCallback((id: string) => {
    setFocusedId(id)
    setSearch('')
    setShowDropdown(false)
    fitView({ nodes: [{ id }], duration: 750, maxZoom: 1.5, padding: 0.9 })
  }, [fitView])

  useEffect(() => {
    if (!initialFocusId) return
    const timer = setTimeout(() => {
      fitView({ nodes: [{ id: initialFocusId }], duration: 750, maxZoom: 1.5, padding: 0.9 })
    }, 150)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally run once on mount

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (focusedId === node.id) {
      setFocusedId(null)
    } else {
      setFocusedId(node.id)
      fitView({ nodes: [{ id: node.id }], duration: 600, maxZoom: 1.5, padding: 0.9 })
    }
  }, [focusedId, fitView])

  // Renders the whole tree (every box, not just the current pan/zoom or
  // highlight) to an image, then either downloads it directly or wraps it in
  // a same-size PDF page — which most PDF viewers' print dialogs will scale
  // to fit the paper automatically.
  //
  // Built from the same layout data used to draw the tree (buildExportSvgMarkup,
  // using baseNodes/baseEdges directly — always the full, un-dimmed tree,
  // regardless of any on-screen highlight) as plain SVG, then rasterized onto
  // a canvas at a capped resolution. Two earlier versions instead screenshotted
  // the live DOM via html-to-image, which reliably produced corrupted,
  // mostly-blank output once the tree was wide enough to have many separate
  // root families side by side (tens of thousands of pixels) — vector SVG has
  // no equivalent size limit, so this works at any tree size.
  const handleExport = useCallback(async (format: 'png' | 'pdf') => {
    if (baseNodes.length === 0) return
    setExporting(format)
    try {
      const { svg, width: naturalWidth, height: naturalHeight } = buildExportSvgMarkup(baseNodes, baseEdges)

      const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
      let img: HTMLImageElement
      try {
        img = await loadImage(svgUrl)
      } finally {
        URL.revokeObjectURL(svgUrl)
      }

      const scale = Math.min(1, EXPORT_MAX_DIMENSION / Math.max(naturalWidth, naturalHeight))
      const width = Math.max(1, Math.round(naturalWidth * scale))
      const height = Math.max(1, Math.round(naturalHeight * scale))

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = '#0D0000'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      const dataUrl = canvas.toDataURL('image/png')
      const filename = `family-tree-${new Date().toISOString().split('T')[0]}`
      if (format === 'png') {
        const link = document.createElement('a')
        link.download = `${filename}.png`
        link.href = dataUrl
        link.click()
      } else {
        const pdf = new jsPDF({
          orientation: width >= height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height],
        })
        pdf.addImage(dataUrl, 'PNG', 0, 0, width, height)
        pdf.save(`${filename}.pdf`)
      }
    } finally {
      setExporting(null)
    }
  }, [baseNodes, baseEdges])

  const focusedMember = focusedId ? memberMap.get(focusedId) ?? null : null
  const bigBrother = focusedMember?.big_brother_id ? memberMap.get(focusedMember.big_brother_id) ?? null : null
  const littleBrothers = focusedId ? members.filter(m => m.big_brother_id === focusedId) : []

  return (
    <div className="relative w-full h-full bg-kp-dark">

      {/* ── Search bar ──────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 z-10">
        <div className="relative">
          <input
            type="search"
            placeholder="Jump to member…"
            value={search}
            onChange={e => { setSearch(e.target.value); setShowDropdown(true) }}
            onFocus={() => search && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 160)}
            className="w-64 bg-kp-surface border border-kp-border rounded-xl px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors shadow-xl"
          />
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-kp-surface border border-kp-border rounded-xl shadow-2xl overflow-hidden z-20">
              {searchResults.map(m => (
                <button
                  key={m.id}
                  onMouseDown={() => jumpTo(m.id)}
                  className="w-full px-3 py-2.5 text-left hover:bg-kp-card flex items-center gap-2 border-b border-kp-border/50 last:border-0"
                >
                  <span className="text-kp-gold text-[11px] w-8 shrink-0 tabular-nums">#{m.badge_number}</span>
                  <span className="text-white text-sm truncate">{m.first_name} {m.last_name}</span>
                  <span className="text-gray-500 text-[10px] ml-auto shrink-0 pl-2">{m.pledge_class}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {focusedId && (
          <button
            onClick={() => setFocusedId(null)}
            className="mt-2 px-3 py-1.5 bg-kp-surface border border-kp-border rounded-lg text-gray-500 text-xs hover:text-kp-gold hover:border-kp-gold transition-colors shadow-lg"
          >
            ✕ Clear highlight
          </button>
        )}
      </div>

      {/* ── Export toolbar ──────────────────────────────────────────────── */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-3">
        <div className="flex items-center gap-2 bg-kp-surface border border-kp-border rounded-xl px-2 py-2 shadow-xl">
          <span className="text-gray-500 text-xs pl-1 pr-0.5 hidden sm:inline">Export</span>
          <button
            onClick={() => handleExport('png')}
            disabled={exporting !== null}
            title="Download the whole tree as a PNG image"
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-kp-gold hover:bg-kp-card transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {exporting === 'png' ? 'Rendering…' : 'Image'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting !== null}
            title="Download the whole tree as a printable PDF"
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-kp-gold hover:bg-kp-card transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {exporting === 'pdf' ? 'Rendering…' : 'PDF'}
          </button>
        </div>

        {/* ── Member detail card ─────────────────────────────────────────── */}
        {focusedMember && (
        <div className="w-72 bg-kp-surface border border-kp-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-kp-gold/10 border-b border-kp-border px-4 py-3 flex items-start justify-between gap-2">
            <div>
              {isTreeHidden(focusedMember) ? (
                <h3 className="text-gray-500 italic text-sm leading-tight">Hidden member</h3>
              ) : (
                <>
                  <h3 className="text-white font-bold text-sm leading-tight">
                    {focusedMember.first_name} {focusedMember.last_name}
                  </h3>
                  <p className="text-kp-gold text-[11px] mt-0.5">
                    {[focusedMember.pledge_class, focusedMember.badge_number ? `Badge #${focusedMember.badge_number}` : null]
                      .filter(Boolean).join(' · ')}
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => setFocusedId(null)}
              aria-label="Close"
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm leading-none mt-0.5 shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Lineage */}
          <div className="px-4 py-3 space-y-2.5">
            {isTreeHidden(focusedMember) ? (
              <p className="text-gray-500 text-xs italic">This member has requested privacy.</p>
            ) : (
              <>
                {bigBrother ? (
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">Big Brother</p>
                    {isTreeHidden(bigBrother) ? (
                      <span className="text-gray-500 text-sm italic">Hidden member</span>
                    ) : (
                      <button
                        onClick={() => jumpTo(bigBrother.id)}
                        className="text-kp-gold text-sm hover:underline text-left"
                      >
                        {bigBrother.first_name} {bigBrother.last_name}
                        <span className="text-gray-500 text-xs ml-1">#{bigBrother.badge_number}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs italic">Root member — no big brother</p>
                )}

                {littleBrothers.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                      Little Brothers ({littleBrothers.length})
                    </p>
                    <div className="space-y-1">
                      {littleBrothers.map(lb => (
                        isTreeHidden(lb) ? (
                          <span key={lb.id} className="block text-gray-500 text-sm italic">Hidden member</span>
                        ) : (
                          <button
                            key={lb.id}
                            onClick={() => jumpTo(lb.id)}
                            className="block text-kp-gold text-sm hover:underline text-left"
                          >
                            {lb.first_name} {lb.last_name}
                            <span className="text-gray-500 text-xs ml-1">#{lb.badge_number}</span>
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {littleBrothers.length === 0 && (
                  <p className="text-gray-500 text-xs italic">No little brothers on record</p>
                )}
              </>
            )}
          </div>

          {/* Lineage count footer */}
          {focusedLineage && focusedLineage.size > 1 && (
            <div className="border-t border-kp-border px-4 py-2 bg-kp-card/50">
              <p className="text-gray-500 text-[10px]">
                {focusedLineage.size - 1} other member{focusedLineage.size !== 2 ? 's' : ''} in lineage highlighted
              </p>
            </div>
          )}
        </div>
        )}
      </div>

      {/* ── React Flow canvas ────────────────────────────────────────────── */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={() => setFocusedId(null)}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 0.8 }}
        minZoom={0.03}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background variant={BackgroundVariant.Dots} color="#2A0000" gap={24} size={1} />
        <Controls
          showInteractive={false}
          style={{
            background: '#1A0000',
            border: '1px solid #4D0000',
            borderRadius: '0.75rem',
            overflow: 'hidden',
          }}
        />
        <MiniMap
          nodeColor={(n) => {
            const d = n.data as NodeData
            if (d?.focused) return '#C8A028'
            if (d?.inLineage) return '#2A4790'
            if (d?.dimmed) return '#1A0000'
            return '#4D0000'
          }}
          maskColor="rgba(13,0,0,0.75)"
          style={{
            background: '#0D0000',
            border: '1px solid #4D0000',
            borderRadius: '0.75rem',
          }}
        />
      </ReactFlow>
    </div>
  )
}

// ── Export with ReactFlowProvider wrapper ─────────────────────────────────────
export default function FamilyTree({ members, initialFocusId }: { members: TreeMember[]; initialFocusId?: string }) {
  return (
    <ReactFlowProvider>
      <FamilyTreeInner members={members} initialFocusId={initialFocusId} />
    </ReactFlowProvider>
  )
}
