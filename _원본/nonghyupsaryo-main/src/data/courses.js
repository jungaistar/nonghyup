import content from './content.json'

// content.json: [ volume, volume ]
// volume: { id, title, subtitle, label, desc, intro[], parts[] }
// part: { num, title, day, kind('day'|'appendix'), intro[], sections[] }
// section: { num, title, blocks[], subsections[] }
// subsection: { num, title, blocks[] }

export const volumes = content

export function getVolume(volId) {
  return volumes.find((v) => v.id === volId) || null
}

export function getPart(volId, partNum) {
  const vol = getVolume(volId)
  if (!vol) return null
  return vol.parts.find((p) => String(p.num) === String(partNum)) || null
}

// part 안의 모든 블록 수(분량 표시용)
export function countBlocks(part) {
  let n = part.intro?.length || 0
  for (const s of part.sections) {
    n += s.blocks?.length || 0
    for (const ss of s.subsections) n += ss.blocks?.length || 0
  }
  return n
}

// part 안의 실습/표/그림 카운트(요약 배지용)
export function partStats(part) {
  let exercises = 0,
    figures = 0,
    tables = 0
  const scan = (blocks) => {
    for (const b of blocks || []) {
      if (b.type === 'exercise') exercises++
      else if (b.type === 'figure') figures++
      else if (b.type === 'table') tables++
    }
  }
  scan(part.intro)
  for (const s of part.sections) {
    scan(s.blocks)
    for (const ss of s.subsections) scan(ss.blocks)
  }
  return { exercises, figures, tables }
}

export const IMG_BASE = `${import.meta.env.BASE_URL}book-images/`
