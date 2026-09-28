"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";

type Student = { id: string; name: string; belt: string; weightKg: number | null };
type Pair = { a: Student; b: Student };

export default function TrainingTimer({ students, canPair }: { students: Student[]; canPair: boolean }) {
  const [fight, setFight] = useState(300);
  const [rest, setRest] = useState(60);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"FIGHT" | "REST">("FIGHT");
  const [round, setRound] = useState(1);
  const [mode, setMode] = useState<"TIMER" | "PAIRS">("TIMER");
  const [selected, setSelected] = useState<string[]>(students.map(s => s.id));
  const [pairs, setPairs] = useState<Pair[]>([]);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => { if (!running) return; const id = setInterval(() => setRemaining(v => Math.max(0, v - 1)), 1000); return () => clearInterval(id) }, [running]);
  useEffect(() => { if (remaining !== 0 || !running) return; beep(); if (phase === "FIGHT") { setPhase("REST"); setRemaining(rest); } else { setRound(r => r + 1); setPhase("FIGHT"); setRemaining(fight); if (mode === "PAIRS") makePairs(true); } }, [remaining, running, phase, rest, fight, mode]);
  function beep() { try { const C = window.AudioContext || (window as any).webkitAudioContext; audio.current ||= new C(); const o = audio.current.createOscillator(); const g = audio.current.createGain(); o.frequency.value = 740; g.gain.value = .14; o.connect(g).connect(audio.current.destination); o.start(); o.stop(audio.current.currentTime + .45); } catch { } }
  function format(v: number) { const m = Math.floor(v / 60).toString().padStart(2, "0"); const s = (v % 60).toString().padStart(2, "0"); return `${m}:${s}` }
  function reset() { setRunning(false); setPhase("FIGHT"); setRound(1); setRemaining(fight); }
  function makePairs(rotate = false) {
    const pool = students.filter(s => selected.includes(s.id));
    const offset = rotate && pool.length > 2 ? round % pool.length : 0;
    const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
    const result: Pair[] = []; for (let i = 0; i + 1 < rotated.length; i += 2)result.push({ a: rotated[i], b: rotated[i + 1] }); setPairs(result);
  }
  const pct = Math.max(0, Math.min(100, (remaining / (phase === "FIGHT" ? fight : rest)) * 100));
  const lastMinute = phase === "FIGHT" && remaining <= 60;
  const circleStyle = { background: `conic-gradient(var(--gold) ${100 - pct}%, ${lastMinute ? "#d6a21f" : "#32343b"} ${100 - pct}% 100%)` } as React.CSSProperties;
  const selectable = useMemo(() => students, [students]);

  return <div className={styles.wrap}>
    <div className={styles.toolbar}>
      <div className={styles.segment}><button className={mode === "TIMER" ? styles.active : ""} onClick={() => setMode("TIMER")}>Somente cronômetro</button>{canPair && <button className={mode === "PAIRS" ? styles.active : ""} onClick={() => setMode("PAIRS")}>Cronômetro + duplas</button>}</div>
      <label>Luta <input type="number" min="1" value={Math.round(fight / 60)} onChange={e => { const n = Math.max(1, Number(e.target.value)) * 60; setFight(n); if (!running && phase === "FIGHT") setRemaining(n) }} /> min</label>
      <label>Descanso <input type="number" min="0" value={Math.round(rest / 60)} onChange={e => setRest(Math.max(0, Number(e.target.value)) * 60)} /> min</label>
    </div>

    <section className={`${styles.stage} ${lastMinute ? styles.warning : ""}`}>
      <div className={styles.status}>{phase === "FIGHT" ? "TEMPO DE LUTA" : "DESCANSO / TROCA"}</div>
      <div className={styles.ring} style={circleStyle}><div><strong>{format(remaining)}</strong><span>ROUND {round}</span></div></div>
      <div className={styles.controls}><button onClick={() => setRunning(v => !v)}>{running ? "Pausar" : "Iniciar"}</button><button onClick={reset}>Reiniciar</button><button onClick={() => { setRemaining(0); setRunning(true) }}>Próximo</button></div>
      {lastMinute && <div className={styles.last}>ÚLTIMO MINUTO</div>}
    </section>

    {mode === "PAIRS" && canPair && <section className={styles.pairs}>
      <div className={styles.pairHeader}><div><h2>Duplas do treino</h2><p>Por padrão o casamento é livre. Você pode escolher quem está treinando hoje.</p></div><button onClick={() => makePairs(false)}>Casar duplas</button></div>
      <div className={styles.checks}>{selectable.map(s => <label key={s.id}><input type="checkbox" checked={selected.includes(s.id)} onChange={e => setSelected(v => e.target.checked ? [...v, s.id] : v.filter(x => x !== s.id))} />{s.name}<small>{s.belt}{s.weightKg ? ` • ${s.weightKg}kg` : ""}</small></label>)}</div>
      <div className={styles.pairGrid}>{pairs.map((p, i) => <article key={i}><span>DUPLA {i + 1}</span><b>{p.a.name}</b><em>×</em><b>{p.b.name}</b></article>)}</div>
    </section>}
  </div>
}
