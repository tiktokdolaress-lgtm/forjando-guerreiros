'use client';
import React, { useState } from 'react';
import { BookOpen, Calendar, Send, Trash2, Smile, Meh, Frown, Flame, ShieldAlert, Sparkles, MoreVertical, Check, PenTool, History, BarChart3 } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';
import { AF } from '@/lib/audio';

const I18N = {
  headlineWrite: { pt: 'AUDITORIA NOTURNA DO GUERREIRO', en: "WARRIOR'S NIGHTLY AUDIT", es: 'AUDITORÍA NOCTURNA DEL GUERRERO' },
  subtitleWrite: { pt: 'Registre suas batalhas, vitórias e preste contas da sua honra hoje.', en: 'Log your battles, victories, and hold yourself accountable today.', es: 'Registra tus batallas, victorias y rinde cuentas de tu honor hoy.' },
  headlineHistory: { pt: 'REGISTROS DE COMBATE & HISTÓRICO', en: 'COMBAT LOGS & HISTORY', es: 'REGISTROS DE COMBATE E HISTORIAL' },
  subtitleHistory: { pt: 'Memória tática das suas batalhas diárias e evolução do guerreiro.', en: 'Tactical memory of your daily battles and warrior evolution.', es: 'Memoria táctica de tus batallas diarias y evolución del guerrero.' },
  headlineMetrics: { pt: 'VIGOR & AUDITORIA EMOCIONAL', en: 'VIGOR & EMOTIONAL AUDIT', es: 'VIGOR Y AUDITORÍA EMOCIONAL' },
  subtitleMetrics: { pt: 'Análise do seu estado de espírito e constância de prestação de contas.', en: 'Analysis of your state of mind and accountability consistency.', es: 'Análisis de tu estado de ánimo y constancia en la rendición de cuentas.' },
  badgeAuditDone: { pt: '✓ AUDITADO HOJE', en: '✓ AUDITED TODAY', es: '✓ AUDITADO HOY' },
  badgeAuditPending: { pt: '⚠️ PENDENTE HOJE', en: '⚠️ PENDING TODAY', es: '⚠️ PENDIENTE HOY' },
  btnViewHistoryShort: { pt: 'Ver Histórico', en: 'View History', es: 'Ver Historial' },
  btnNewReportShort: { pt: '+ Novo Relatório', en: '+ New Report', es: '+ Nuevo Informe' },
  title: { pt: 'DIÁRIO DE BORDO', en: "SHIP'S LOG", es: 'DIARIO DE A BORDO' },
  subtitle: { pt: 'Auditoria noturna do guerreiro. Registre suas vitórias e gatilhos.', en: "Warrior's evening audit. Log victories and triggers.", es: 'Auditoría nocturna del guerrero. Registra victorias y detonantes.' },
  catWrite: { pt: 'Novo Relatório', en: 'New Report', es: 'Nuevo Informe' },
  catHistory: { pt: 'Histórico de Auditorias', en: 'Audit History', es: 'Historial de Auditorías' },
  catMetrics: { pt: 'Métricas & Vigor', en: 'Metrics & Vigor', es: 'Métricas y Vigor' },
  newEntry: { pt: 'NOVO REGISTRO DO DIA', en: 'NEW DAILY ENTRY', es: 'NUEVO REGISTRO DEL DÍA' },
  moodLabel: { pt: 'Estado de Espírito / Vigor:', en: 'State of Mind / Vigor:', es: 'Estado de Ánimo / Vigor:' },
  moodGreat: { pt: 'Em Chamas 🔥', en: 'On Fire 🔥', es: 'En Llamas 🔥' },
  moodGood: { pt: 'Firme ⚔️', en: 'Steady ⚔️', es: 'Firme ⚔️' },
  moodTired: { pt: 'Cansado 🛡️', en: 'Tired 🛡️', es: 'Cansado 🛡️' },
  moodUrge: { pt: 'Guerra / Fissura ⚠️', en: 'Urges / War ⚠️', es: 'Guerra / Ansiedad ⚠️' },
  textLabel: { pt: 'Reflexão & Prestação de Contas:', en: 'Reflection & Accountability:', es: 'Reflexión y Rendición de Cuentas:' },
  textPh: { pt: 'Como você venceu suas batalhas hoje? Que tentação enfrentou?', en: 'How did you win your battles today? What urge did you conquer?', es: '¿Cómo venciste tus batallas hoy? ¿Qué tentación enfrentaste?' },
  saveBtn: { pt: 'GRAVAR NO DIÁRIO', en: 'SAVE TO LOG', es: 'GUARDAR EN DIARIO' },
  historyTitle: { pt: 'HISTÓRICO DE AUDITORIAS', en: 'AUDIT HISTORY', es: 'HISTORIAL DE AUDITORÍAS' },
  noEntries: { pt: 'Nenhum registro no diário ainda. Escreva seu primeiro relatório hoje!', en: 'No log entries yet. Write your first report today!', es: 'Sin registros aún. ¡Escribe tu primer reporte hoy!' },
  alreadyLogged: { pt: 'Você já registrou um relatório hoje! Pode registrar outro ou consultar o histórico.', en: 'You already recorded a report today! You can record another or view the history.', es: '¡Ya registraste un informe hoy! Puedes registrar otro o consultar el historial.' },
  viewHist: { pt: 'Ver histórico', en: 'View history', es: 'Ver historial' },
  plusNew: { pt: '+ Novo Relatório', en: '+ New Report', es: '+ Nuevo Informe' },
  writeFirst: { pt: 'Escrever Primeiro Relatório', en: 'Write First Report', es: 'Escribir Primer Informe' },
  noNotes: { pt: 'Sem anotações textuais.', en: 'No text notes.', es: 'Sin anotaciones textuales.' },
  delPrompt: { pt: 'Excluir este registro do diário?', en: 'Delete this entry from the log?', es: '¿Eliminar este registro del diario?' },
  delToast: { pt: 'Registro excluído', en: 'Entry deleted', es: 'Registro eliminado' },
  saveToast: { pt: '✅ Relatório gravado no Diário de Bordo!', en: "✅ Report recorded in Ship's Log!", es: '✅ ¡Informe guardado en el Diario!' },
  emptyPrompt: { pt: 'Escreva sua reflexão antes de salvar', en: 'Write your reflection before saving', es: 'Escribe tu reflexión antes de guardar' },
  totalReports: { pt: 'Total de Relatórios', en: 'Total Reports', es: 'Total de Informes' },
  todayAudit: { pt: 'Auditoria de Hoje', en: "Today's Audit", es: 'Auditoría de Hoy' },
  predVigor: { pt: 'Vigor Predominante', en: 'Predominant Vigor', es: 'Vigor Predominante' },
  lastReport: { pt: 'Último Relatório', en: 'Latest Report', es: 'Último Informe' },
  completed: { pt: '✓ Concluída', en: '✓ Completed', es: '✓ Completada' },
  pending: { pt: '⚠️ Pendente', en: '⚠️ Pending', es: '⚠️ Pendiente' },
  none: { pt: 'Nenhum', en: 'None', es: 'Ninguno' },
  moodDist: { pt: 'DISTRIBUIÇÃO DE ESTADOS DE ESPÍRITO', en: 'STATE OF MIND DISTRIBUTION', es: 'DISTRIBUCIÓN DE ESTADOS DE ÁNIMO' },
  delTitle: { pt: 'Excluir Registro', en: 'Delete Entry', es: 'Eliminar Registro' },
  delConfirmBtn: { pt: 'Sim, Excluir', en: 'Yes, Delete', es: 'Sí, Eliminar' },
  delCancelBtn: { pt: 'Cancelar', en: 'Cancel', es: 'Cancelar' },
};

export default function JournalView() {
  const { S, update, toast, openModal, closeModal } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = I18N;

  const [mood, setMood] = useState('firme');
  const [text, setText] = useState('');
  const [activeCategory, setActiveCategory] = useState('write');

  /* Normalização compatível com formato array ou objeto de journal */
  const rawJournal = (S && S.journal) || [];
  let entries = [];
  if (Array.isArray(rawJournal)) {
    entries = [...rawJournal].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } else if (typeof rawJournal === 'object' && rawJournal !== null) {
    entries = Object.keys(rawJournal).map((dateKey) => {
      const val = rawJournal[dateKey];
      const isObj = val && typeof val === 'object';
      return {
        id: isObj && val.id ? val.id : 'j_' + dateKey,
        date: isObj && val.date ? val.date : dateKey,
        mood: isObj ? (val.mood || val.ch || 'firme') : 'firme',
        text: isObj ? (val.text || val.vent || val.good || '') : String(val || ''),
        time: isObj && val.time ? val.time : '',
        createdAt: isObj && (val.createdAt || val.updatedAt) ? (val.createdAt || val.updatedAt) : 0,
      };
    }).reverse();
  }

  // Indicadores táticos de consistência de auditoria
  const hasTodayEntry = entries.some((e) => String(e.date) === today() || String(e.id) === today());
  const moodCounts = entries.reduce((acc, e) => {
    const m = e.mood || e.ch || 'firme';
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'firme';
  const topMoodLabel = {
    firme: tx.moodGood[curLang],
    fogo: tx.moodGreat[curLang],
    cansado: tx.moodTired[curLang],
    guerra: tx.moodUrge[curLang],
  }[topMood] || 'Firme ⚔️';

  const categories = [
    { id: 'write', label: tx.catWrite[curLang], icon: PenTool },
    { id: 'history', label: tx.catHistory[curLang], icon: History },
    { id: 'metrics', label: tx.catMetrics[curLang], icon: BarChart3 },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (!text.trim()) return toast(tx.emptyPrompt[curLang]);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEntry = {
      id: 'j_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      date: today(),
      time: timeStr,
      mood,
      text: text.trim(),
      createdAt: Date.now(),
    };

    update((s) => {
      if (Array.isArray(s.journal)) {
        s.journal.unshift(newEntry);
      } else {
        // Converte objeto existente para array para permitir múltiplas anotações por dia sem apagar
        const existing = [];
        if (s.journal && typeof s.journal === 'object') {
          Object.keys(s.journal).forEach((k) => {
            const val = s.journal[k];
            const isObj = val && typeof val === 'object';
            existing.push({
              id: isObj && val.id ? val.id : 'j_' + k,
              date: isObj && val.date ? val.date : k,
              mood: isObj ? (val.mood || val.ch || 'firme') : 'firme',
              text: isObj ? (val.text || val.vent || val.good || '') : String(val || ''),
              time: isObj && val.time ? val.time : '',
              createdAt: isObj && (val.createdAt || val.updatedAt) ? (val.createdAt || val.updatedAt) : 0,
            });
          });
        }
        s.journal = [newEntry, ...existing];
      }
    });

    setText('');
    AF.click();
    toast(tx.saveToast[curLang]);
  };

  const deleteEntry = (id) => {
    const ConfirmModal = () => (
      <div className="text-center p-2 select-none">
        <div className="w-12 h-12 rounded-xl border border-danger/40 bg-danger/10 flex items-center justify-center mx-auto mb-3 text-danger shadow-sm">
          <Trash2 size={22} />
        </div>
        <h3 className="font-display text-lg tracking-wide text-danger mb-1.5 font-bold uppercase">{tx.delTitle[curLang]}</h3>
        <p className="text-xs text-muted leading-relaxed mb-4">{tx.delPrompt[curLang]}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 py-2 rounded-xl text-xs font-bold font-mono bg-danger text-white hover:bg-danger/90 transition-all cursor-pointer shadow-sm active:scale-95"
            onClick={() => {
              closeModal();
              update((s) => {
                if (Array.isArray(s.journal)) {
                  s.journal = s.journal.filter((x) => String(x.id) !== String(id));
                } else if (s.journal && typeof s.journal === 'object') {
                  delete s.journal[id];
                }
              });
              AF.click();
              toast(tx.delToast[curLang]);
            }}
          >
            {tx.delConfirmBtn[curLang]}
          </button>
          <button
            type="button"
            className="btn-dark py-2 px-4 rounded-xl text-xs font-bold font-mono cursor-pointer active:scale-95 transition-all"
            onClick={closeModal}
          >
            {tx.delCancelBtn[curLang]}
          </button>
        </div>
      </div>
    );
    openModal(<ConfirmModal />);
  };

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-x-hidden pb-16">
      {/* NAVEGAÇÃO DO DIÁRIO: 3 SUB-ABAS EM AÇO FORJADO & OURO */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 w-full max-w-full min-w-0 select-none">
        {/* SELETOR DE SUB-ABAS */}
        <div className="w-full max-w-full min-w-0 p-1 rounded-xl bg-surface2/80 border border-line/80 flex items-center gap-1 sm:gap-1.5 select-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            const count = cat.id === 'history' ? entries.length : null;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  AF.click();
                  setActiveCategory(cat.id);
                }}
                className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all truncate select-none cursor-pointer ${
                  isSelected
                    ? 'bg-gold text-[#141414] shadow-sm font-black'
                    : 'text-muted hover:text-ink hover:bg-surface/50'
                }`}
              >
                <Icon size={14} className="flex-none" />
                <span className="truncate">{cat.label}</span>
                {count !== null && (
                  <span className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded font-mono font-bold flex-none ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-surface text-gold border border-line/50'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* BOTÃO DE AÇÃO RÁPIDA (RÚSTICO MEDIEVAL) */}
        {activeCategory !== 'write' ? (
          <button
            type="button"
            onClick={() => setActiveCategory('write')}
            className="flex-none py-2 px-3.5 rounded-xl border border-gold/40 bg-gold hover:brightness-110 text-[#141414] text-xs font-mono font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            <PenTool size={13} strokeWidth={2.5} className="flex-none" />
            <span>{tx.btnNewReportShort[curLang]}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveCategory('history')}
            className="flex-none py-2 px-3.5 rounded-xl border border-line/80 bg-surface2/90 hover:border-gold/50 text-muted hover:text-gold text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            <History size={13} className="text-gold flex-none" />
            <span>{tx.btnViewHistoryShort[curLang]}</span>
          </button>
        )}
      </div>

      {/* 1. CATEGORIA: NOVO RELATÓRIO */}
      {activeCategory === 'write' && (
        <div className="flex flex-col gap-3.5 w-full max-w-2xl mx-auto min-w-0">
          {/* BANNER TÁTICO DA AUDITORIA */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-xl border border-gold/30 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] shadow-sm select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface2/90 border border-line/80 flex items-center justify-center text-gold flex-none">
                <BookOpen size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-display font-black tracking-wide text-ink uppercase">
                    {tx.headlineWrite[curLang]}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    hasTodayEntry ? 'bg-gold/15 text-gold border-gold/30' : 'bg-danger/15 text-danger border-danger/30'
                  }`}>
                    {hasTodayEntry ? tx.badgeAuditDone[curLang] : tx.badgeAuditPending[curLang]}
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate">
                  {tx.subtitleWrite[curLang]}
                </p>
              </div>
            </div>

            {hasTodayEntry && (
              <button
                type="button"
                onClick={() => setActiveCategory('history')}
                className="text-xs font-mono font-bold text-gold hover:underline flex items-center gap-1 self-end sm:self-auto cursor-pointer"
              >
                <Check size={13} /> {tx.viewHist[curLang]}
              </button>
            )}
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-gold/25 bg-gradient-to-b from-[#17151F] via-[#121218] to-[#17151F] shadow-sm select-none">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-line/50">
              <span className="text-base">✍️</span>
              <h3 className="font-display text-sm sm:text-base tracking-wide text-ink font-bold uppercase">
                {tx.newEntry[curLang]}
              </h3>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <span className="text-[11px] font-mono text-muted uppercase font-bold tracking-wider mb-2 block">
                  {tx.moodLabel[curLang]}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'firme', label: tx.moodGood[curLang] },
                    { id: 'fogo', label: tx.moodGreat[curLang] },
                    { id: 'cansado', label: tx.moodTired[curLang] },
                    { id: 'guerra', label: tx.moodUrge[curLang] },
                  ].map((m) => {
                    const isMActive = mood === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setMood(m.id);
                          AF.click();
                        }}
                        className={`text-xs py-2.5 px-2 rounded-xl border font-mono font-bold text-center transition-all cursor-pointer active:scale-95 ${
                          isMActive
                            ? m.id === 'guerra'
                              ? 'border-danger bg-danger/25 text-danger shadow-sm font-black'
                              : 'border-gold bg-gold/20 text-gold shadow-sm font-black'
                            : 'border-line/70 bg-surface2/60 text-muted hover:border-gold/40 hover:text-ink'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-muted uppercase font-bold tracking-wider mb-2 block">
                  {tx.textLabel[curLang]}
                </span>
                <textarea
                  rows={6}
                  placeholder={tx.textPh[curLang]}
                  className="field w-full text-xs sm:text-[13px] leading-relaxed resize-none rounded-xl p-3 bg-surface border border-line/80 focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl border border-gold/40 bg-gold hover:brightness-110 text-[#141414] text-xs font-mono font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 uppercase tracking-wider"
              >
                <Send size={13} strokeWidth={2.5} />
                <span>{tx.saveBtn[curLang]}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. CATEGORIA: HISTÓRICO DE AUDITORIAS */}
      {activeCategory === 'history' && (
        <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-hidden">
          {/* BANNER TÁTICO DO HISTÓRICO */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-xl border border-gold/30 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] shadow-sm select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface2/90 border border-line/80 flex items-center justify-center text-gold flex-none">
                <History size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-display font-black tracking-wide text-ink uppercase">
                    {tx.headlineHistory[curLang]}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                    {entries.length} {tx.totalReports[curLang]}
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate">
                  {tx.subtitleHistory[curLang]}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveCategory('write')}
              className="py-1.5 px-3 rounded-lg border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all self-end sm:self-auto"
            >
              <PenTool size={12} />
              <span>{tx.plusNew[curLang]}</span>
            </button>
          </div>

          {entries.length > 0 ? (
            <div className="flex flex-col gap-3">
              {entries.map((item, idx) => {
                const itemMood = item.mood || item.ch || 'firme';
                const itemText = item.text || item.vent || item.good || '';
                const moodBadge = {
                  firme: 'border-gold/40 bg-gold/10 text-gold',
                  fogo: 'border-danger/40 bg-danger/10 text-danger',
                  cansado: 'border-line bg-surface text-muted',
                  guerra: 'border-danger bg-danger text-white font-bold',
                }[itemMood] || 'border-line text-muted';

                return (
                  <div
                    key={item.id || idx}
                    className="p-3.5 sm:p-4 rounded-xl border border-gold/20 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] hover:border-gold/40 transition-all flex flex-col gap-2.5 select-none shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs sm:text-sm font-bold text-ink">
                          {fmtD(item.date || today())}
                        </span>
                        {item.time && (
                          <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/25 font-bold">
                            {item.time}
                          </span>
                        )}
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${moodBadge}`}>
                          {itemMood}
                        </span>
                      </div>
                      <button
                        type="button"
                        title={tx.delTitle[curLang]}
                        onClick={() => deleteEntry(item.id || item.date)}
                        className="text-muted/60 hover:text-danger p-1.5 rounded-lg border border-transparent hover:border-danger/30 hover:bg-danger/10 transition-all cursor-pointer active:scale-95"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p className="text-xs sm:text-[13px] text-[#e0e0e8] whitespace-pre-wrap leading-relaxed bg-surface/70 p-3 rounded-lg border border-line/60 font-sans">
                      {itemText || tx.noNotes[curLang]}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 px-4 rounded-xl border border-line/60 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] text-center w-full">
              <Empty>{tx.noEntries[curLang]}</Empty>
              <button
                type="button"
                onClick={() => setActiveCategory('write')}
                className="btn-gold py-2 px-4 text-xs font-bold mt-3 active:scale-95 cursor-pointer shadow-sm"
              >
                {tx.writeFirst[curLang]}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. CATEGORIA: MÉTRICAS & VIGOR */}
      {activeCategory === 'metrics' && (
        <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-hidden">
          {/* BANNER TÁTICO DAS MÉTRICAS */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-xl border border-gold/30 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] shadow-sm select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface2/90 border border-line/80 flex items-center justify-center text-gold flex-none">
                <BarChart3 size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-display font-black tracking-wide text-ink uppercase">
                    {tx.headlineMetrics[curLang]}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                    {topMoodLabel}
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate">
                  {tx.subtitleMetrics[curLang]}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-xl border border-gold/25 bg-gradient-to-b from-[#17151F] via-[#121218] to-[#17151F] flex flex-col justify-between shadow-sm select-none">
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">{tx.totalReports[curLang]}</span>
              <b className="text-xl font-mono text-gold mt-1.5">{entries.length}</b>
            </div>
            <div className="p-3.5 rounded-xl border border-gold/25 bg-gradient-to-b from-[#17151F] via-[#121218] to-[#17151F] flex flex-col justify-between shadow-sm select-none">
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">{tx.todayAudit[curLang]}</span>
              <span className={`text-xs font-mono font-bold mt-1.5 inline-flex items-center gap-1 ${hasTodayEntry ? 'text-gold' : 'text-danger'}`}>
                {hasTodayEntry ? tx.completed[curLang] : tx.pending[curLang]}
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-gold/25 bg-gradient-to-b from-[#17151F] via-[#121218] to-[#17151F] flex flex-col justify-between shadow-sm select-none">
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">{tx.predVigor[curLang]}</span>
              <span className="text-xs font-semibold text-ink mt-1.5 truncate">{topMoodLabel}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-gold/25 bg-gradient-to-b from-[#17151F] via-[#121218] to-[#17151F] flex flex-col justify-between shadow-sm select-none">
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">{tx.lastReport[curLang]}</span>
              <span className="text-xs font-mono text-gold2 mt-1.5 truncate">{entries.length > 0 ? fmtD(entries[0].date || today()) : tx.none[curLang]}</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-gold/25 bg-gradient-to-b from-[#17151F] via-[#121218] to-[#17151F] shadow-sm select-none">
            <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-line/50">
              <span className="text-base">📊</span>
              <h3 className="font-display text-sm sm:text-base tracking-wide text-ink font-bold uppercase">
                {tx.moodDist[curLang]}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'firme', label: tx.moodGood[curLang], count: moodCounts.firme || 0, color: 'bg-gradient-to-r from-amber-600 to-gold' },
                { id: 'fogo', label: tx.moodGreat[curLang], count: moodCounts.fogo || 0, color: 'bg-gradient-to-r from-red-600 to-amber-500' },
                { id: 'cansado', label: tx.moodTired[curLang], count: moodCounts.cansado || 0, color: 'bg-gradient-to-r from-gray-600 to-slate-400' },
                { id: 'guerra', label: tx.moodUrge[curLang], count: moodCounts.guerra || 0, color: 'bg-gradient-to-r from-amber-700 to-orange-500' },
              ].map((m) => {
                const pct = entries.length ? Math.round((m.count / entries.length) * 100) : 0;
                return (
                  <div key={m.id} className="p-3 rounded-xl border border-line/70 bg-surface2/60">
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                      <span className="text-ink">{m.label}</span>
                      <span className="text-gold">{m.count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface border border-line/60 overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full transition-all duration-300 shadow-[0_0_6px_rgba(212,175,55,0.3)]`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
