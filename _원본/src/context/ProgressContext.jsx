import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ProgressContext = createContext(null)
const KEY = 'nonghyupsaryo-progress-v1'
const LAB_KEY = 'nonghyupsaryo-labs-v1'

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}
function saveLocal(map) {
  localStorage.setItem(KEY, JSON.stringify(map))
}
function loadLabs() {
  try {
    return JSON.parse(localStorage.getItem(LAB_KEY)) || {}
  } catch {
    return {}
  }
}
function saveLabs(map) {
  localStorage.setItem(LAB_KEY, JSON.stringify(map))
}

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const [progress, setProgress] = useState(loadLocal)
  const [labProgress, setLabProgress] = useState(loadLabs)
  const syncedUser = useRef(null)

  // 로그인 시: Supabase 진도 불러와 로컬과 병합, 로컬-only 항목은 업로드
  useEffect(() => {
    if (!user) {
      syncedUser.current = null
      return
    }
    if (syncedUser.current === user.id) return
    syncedUser.current = user.id

    ;(async () => {
      const { data, error } = await supabase
        .from('nonghyupsaryo_progress')
        .select('vol_id, part_num')
        .eq('user_id', user.id)
      if (error) {
        console.warn('[nonghyupsaryo] progress load skipped:', error.message)
        return
      }
      const remote = {}
      for (const r of data || []) remote[`${r.vol_id}/${r.part_num}`] = true

      const local = loadLocal()
      const merged = { ...remote, ...local }
      setProgress(merged)
      saveLocal(merged)

      // 로컬에만 있던 항목 업로드
      const toUpload = Object.keys(local)
        .filter((k) => !remote[k])
        .map((k) => {
          const [vol_id, part_num] = k.split('/')
          return { user_id: user.id, vol_id, part_num: Number(part_num) }
        })
      if (toUpload.length) {
        try {
          await supabase.from('nonghyupsaryo_progress').upsert(toUpload, {
            onConflict: 'user_id,vol_id,part_num',
          })
        } catch (e) {
          console.warn('[nonghyupsaryo] progress upload skipped:', e?.message || e)
        }
      }
    })()
  }, [user])

  const isDone = useCallback((volId, partNum) => !!progress[`${volId}/${partNum}`], [progress])

  const setDone = useCallback(
    async (volId, partNum, done) => {
      const k = `${volId}/${partNum}`
      setProgress((prev) => {
        const next = { ...prev }
        if (done) next[k] = true
        else delete next[k]
        saveLocal(next)
        return next
      })
      if (user) {
        try {
          if (done) {
            await supabase
              .from('nonghyupsaryo_progress')
              .upsert(
                { user_id: user.id, vol_id: volId, part_num: Number(partNum) },
                { onConflict: 'user_id,vol_id,part_num' }
              )
          } else {
            await supabase
              .from('nonghyupsaryo_progress')
              .delete()
              .match({ user_id: user.id, vol_id: volId, part_num: Number(partNum) })
          }
        } catch (e) {
          // 테이블 미생성 등으로 동기화 실패해도 로컬 저장은 유지(로그인 흐름 보호)
          console.warn('[nonghyupsaryo] progress sync skipped:', e?.message || e)
        }
      }
    },
    [user]
  )

  const toggle = useCallback(
    (volId, partNum) => setDone(volId, partNum, !progress[`${volId}/${partNum}`]),
    [progress, setDone]
  )

  const countDone = useCallback(
    (volId, partNums) => partNums.filter((n) => progress[`${volId}/${n}`]).length,
    [progress]
  )

  // ----- 실습(Labs) 완료: localStorage 기반 -----
  const labKey = (volId, day, idx) => `${volId}/${day}/${idx}`
  const isLabDone = useCallback(
    (volId, day, idx) => !!labProgress[labKey(volId, day, idx)],
    [labProgress]
  )
  const toggleLab = useCallback((volId, day, idx) => {
    setLabProgress((prev) => {
      const k = `${volId}/${day}/${idx}`
      const next = { ...prev }
      if (next[k]) delete next[k]
      else next[k] = true
      saveLabs(next)
      return next
    })
  }, [])
  const countLabsDone = useCallback(
    (keys) => keys.filter((k) => labProgress[k]).length,
    [labProgress]
  )

  return (
    <ProgressContext.Provider
      value={{ progress, isDone, setDone, toggle, countDone, labProgress, isLabDone, toggleLab, countLabsDone }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
