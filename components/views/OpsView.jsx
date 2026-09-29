'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Check, Trash2, Clock, Calendar, Flag, Folder, Layers, CheckCircle2, Circle, AlertCircle, Edit3, ChevronRight, Target, Flame, Archive, AlertTriangle, Link2, Unlink, MoreVertical, ArchiveRestore, CalendarClock, Shield, Sparkles, ScrollText, CheckSquare, HeartHandshake, Zap, ChevronDown, ChevronUp, X, BarChart2, TrendingUp, Activity } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr, fmtD, daysBetween, parseD } from '@/lib/utils';
import { AF } from '@/lib/audio';
import * as L from '@/lib/logic';
import { PROJECT_CATEGORIES, PREDEFINED_TEMPLATES } from '@/lib/project-templates';

const OPS_CATEGORIES = [
  {
    id: 'tasks',
    labelShort: { pt: 'Tarefas', en: 'Tasks', es: 'Tareas' },
    labelFull: { pt: 'Tarefas & Operações', en: 'Tasks & Operations', es: 'Tareas y Operaciones' },
    icon: Target,
  },
  {
    id: 'projects',
    labelShort: { pt: 'Projetos', en: 'Projects', es: 'Proyectos' },
    labelFull: { pt: 'Projetos Estratégicos', en: 'Strategic Projects', es: 'Proyectos Estratégicos' },
    icon: Layers,
  },
  {
    id: 'archive',
    labelShort: { pt: 'Arquivo', en: 'Archive', es: 'Archivo' },
    labelFull: { pt: 'Arquivo & Concluídos', en: 'Archive & Completed', es: 'Archivo y Concluídos' },
    icon: Archive,
  },
];

const I18N = {
  tabTasks: { pt: '🎯 TAREFAS & OPERAÇÕES', en: '🎯 TASKS & OPERATIONS', es: '🎯 TAREAS Y OPERACIONES' },
  tabProjects: { pt: '🏛️ PROJETOS ESTRATÉGICOS', en: '🏛️ STRATEGIC PROJECTS', es: '🏛️ PROYECTOS ESTRATÉGICOS' },
  newTask: { pt: 'NOVA OPERAÇÃO', en: 'NEW OPERATION', es: 'NUEVA OPERACIÓN' },
  newTaskShort: { pt: 'Nova Operação', en: 'New Operation', es: 'Nueva Operación' },
  newProject: { pt: 'NOVO PROJETO', en: 'NEW PROJECT', es: 'NUEVO PROYECTO' },
  newProjectShort: { pt: 'Novo Projeto', en: 'New Project', es: 'Nuevo Proyecto' },
  filterAll: { pt: 'Todas', short: { pt: 'Todas', en: 'All', es: 'Todas' }, en: 'All', es: 'Todas' },
  filterToday: { pt: 'Para Hoje', short: { pt: 'Hoje', en: 'Today', es: 'Hoy' }, en: 'For Today', es: 'Para Hoy' },
  filterPostponed: { pt: 'Adiadas', short: { pt: 'Adiadas', en: 'Postp.', es: 'Posp.' }, en: 'Postponed', es: 'Pospuestas' },
  filterDone: { pt: 'Concluídas', short: { pt: 'Feitas', en: 'Done', es: 'Hechas' }, en: 'Completed', es: 'Completadas' },
  filterActive: { pt: 'Ativos', en: 'Active', es: 'Activos' },
  filterArchived: { pt: 'Arquivados', en: 'Archived', es: 'Archivados' },
  progress: { pt: 'Progresso do Dia', en: 'Today\'s Progress', es: 'Progreso del Día' },
  noTasks: { pt: 'Nenhuma operação nesta categoria.', en: 'No operations in this category.', es: 'Ninguna operación en esta categoría.' },
  noProjects: { pt: 'Nenhum projeto nesta categoria.', en: 'No projects in this category.', es: 'Ningún proyecto en esta categoría.' },
  postponeModalTitle: { pt: 'ADIAR OPERAÇÃO', en: 'POSTPONE OPERATION', es: 'POSPONER OPERACIÓN' },
  postponeModalDesc: { pt: 'Para quando você deseja postergar esta missão?', en: 'When do you want to postpone this mission to?', es: '¿Para cuándo deseas posponer esta misión?' },
  postponePlus1: { pt: 'Amanhã (+1 dia)', en: 'Tomorrow (+1 day)', es: 'Mañana (+1 día)' },
  postponePlus2: { pt: '+2 dias', en: '+2 days', es: '+2 días' },
  postponePlus3: { pt: '+3 dias', en: '+3 days', es: '+3 días' },
  postponePlus7: { pt: 'Próxima semana (+7 dias)', en: 'Next week (+7 days)', es: 'Próxima semana (+7 días)' },
  postponeCustomDate: { pt: 'Escolher data específica:', en: 'Choose specific date:', es: 'Elegir fecha específica:' },
  btnPostponeConfirm: { pt: 'Confirmar Adiamento', en: 'Confirm Postponement', es: 'Confirmar Aplazamiento' },
  btnPostponeRemove: { pt: 'Remover Adiamento (Trazer para Hoje)', en: 'Remove Postponement (Bring to Today)', es: 'Quitar Aplazamiento (Traer a Hoy)' },
  badgePostponed: { pt: '⏳ ADIADA', en: '⏳ POSTPONED', es: '⏳ POSPUESTA' },
  badgeOverdue: { pt: '⚠️ ATRASADA', en: '⚠️ OVERDUE', es: '⚠️ ATRASADA' },
  badgeProjectDelayed: { pt: '⚠️ ATRASADO', en: '⚠️ DELAYED', es: '⚠️ ATRASADO' },
  projDelayedBoth: { pt: 'Projeto atrasado: possui tarefas atrasadas e adiadas', en: 'Project delayed: has overdue and postponed tasks', es: 'Proyecto retrasado: tiene tareas atrasadas y pospuestas' },
  projDelayedPostponed: { pt: 'Projeto atrasado: tarefa vinculada foi adiada', en: 'Project delayed: linked task was postponed', es: 'Proyecto retrasado: tarea vinculada fue pospuesta' },
  projDelayedOverdue: { pt: 'Projeto atrasado: tarefa vinculada está atrasada', en: 'Project delayed: linked task is overdue', es: 'Proyecto retrasado: tarea vinculada está atrasada' },
  projDelayedDeadline: { pt: 'Projeto atrasado: prazo final ultrapassado', en: 'Project delayed: deadline exceeded', es: 'Proyecto retrasado: plazo final superado' },
  toastPostponed: { pt: '⏳ Operação adiada!', en: '⏳ Operation postponed!', es: '⏳ ¡Operación pospuesta!' },
  toastPostponeRemoved: { pt: '✓ Adiamento removido!', en: '✓ Postponement removed!', es: '✓ ¡Aplazamiento removido!' },
  btnPostponeAction: { pt: 'Adiar', en: 'Postpone', es: 'Posponer' },
  taskModalEdit: { pt: 'EDITAR OPERAÇÃO', en: 'EDIT OPERATION', es: 'EDITAR OPERACIÓN' },
  taskModalNew: { pt: 'CRIAR NOVA OPERAÇÃO', en: 'CREATE NEW OPERATION', es: 'CREAR NUEVA OPERACIÓN' },
  lblMissionDesc: { pt: 'Missão / Descrição:', en: 'Mission / Description:', es: 'Misión / Descripción:' },
  phMission: { pt: 'Ex: Treino de pernas, Fazer Barba, Ler 10 págs...', en: 'E.g.: Leg workout, Shave, Read 10 pages...', es: 'Ej.: Entrenamiento de piernas, Afeitarse, Leer 10 págs...' },
  lblPriority: { pt: 'Prioridade:', en: 'Priority:', es: 'Prioridad:' },
  priHigh: { pt: '🔴 Alta (Guerra)', en: '🔴 High (War)', es: '🔴 Alta (Guerra)' },
  priMedium: { pt: '🟡 Média', en: '🟡 Medium', es: '🟡 Media' },
  priLow: { pt: '⚪ Baixa', en: '⚪ Low', es: '⚪ Baja' },
  lblFrequency: { pt: 'Frequência:', en: 'Frequency:', es: 'Frecuencia:' },
  repOnce: { pt: 'Única', en: 'One-time', es: 'Única' },
  repDaily: { pt: 'Diária', en: 'Daily', es: 'Diaria' },
  repWorkdays: { pt: 'Dias Úteis (Seg a Sex)', en: 'Weekdays (Mon to Fri)', es: 'Días Laborables (Lun a Vie)' },
  repWeekend: { pt: 'Fins de Semana (Sáb/Dom)', en: 'Weekends (Sat/Sun)', es: 'Fines de Semana (Sáb/Dom)' },
  repWeekly: { pt: 'Semanal (1x por semana)', en: 'Weekly (1x per week)', es: 'Semanal (1x por semana)' },
  repCustom: { pt: 'Personalizada (Escolher dias)', en: 'Custom (Choose days)', es: 'Personalizada (Elegir días)' },
  chooseWeeklyDay: { pt: 'Escolha o dia da semana que repete:', en: 'Choose the day of the week it repeats:', es: 'Elige el día de la semana que se repite:' },
  repeatsEvery: { pt: 'Repete todo(a)', en: 'Repeats every', es: 'Se repite cada' },
  chooseCustomDays: { pt: 'Escolha os dias em que repete:', en: 'Choose the days it repeats:', es: 'Elige los días en que se repite:' },
  lblDays: { pt: 'Dias:', en: 'Days:', es: 'Días:' },
  noDaysSelected: { pt: 'Nenhum dia selecionado', en: 'No days selected', es: 'Ningún día seleccionado' },
  lblTimeOpt: { pt: 'Horário & Alerta 🔔 (Opcional):', en: 'Time & Alert 🔔 (Optional):', es: 'Horario y Alerta 🔔 (Opcional):' },
  lblLinkProject: { pt: 'Vincular a Projeto:', en: 'Link to Project:', es: 'Vincular a Proyecto:' },
  optNoProject: { pt: '(Nenhum / Avulso)', en: '(None / Standalone)', es: '(Ninguno / Suelto)' },
  btnSaveChanges: { pt: 'Salvar Alterações', en: 'Save Changes', es: 'Guardar Cambios' },
  btnCreateOperation: { pt: 'Criar Operação', en: 'Create Operation', es: 'Crear Operación' },
  btnCancel: { pt: 'Cancelar', en: 'Cancel', es: 'Cancelar' },
  toastEnterDesc: { pt: 'Digite a descrição da operação', en: 'Enter operation description', es: 'Ingresa la descripción de la operación' },
  toastTaskUpdated: { pt: 'Operação atualizada!', en: 'Operation updated!', es: '¡Operación actualizada!' },
  toastTaskCreated: { pt: '✅ Operação criada!', en: '✅ Operation created!', es: '¡✅ Operación creada!' },
  toastTaskDeleted: { pt: 'Operação excluída', en: 'Operation deleted', es: 'Operación eliminada' },
  projModalEdit: { pt: 'EDITAR PROJETO', en: 'EDIT PROJECT', es: 'EDITAR PROYECTO' },
  projModalNew: { pt: 'NOVO PROJETO ESTRATÉGICO', en: 'NEW STRATEGIC PROJECT', es: 'NUEVO PROYECTO ESTRATÉGICO' },
  lblProjTitle: { pt: 'Título da Missão / Projeto:', en: 'Mission / Project Title:', es: 'Título de la Misión / Proyecto:' },
  phProjTitle: { pt: 'Ex: Lançamento do Negócio, Cuidar do Jardim...', en: 'E.g.: Business Launch, Garden Project...', es: 'Ej.: Lanzamiento del Negocio, Cuidar el Jardín...' },
  lblProjDesc: { pt: 'Objetivo / Descrição:', en: 'Goal / Description:', es: 'Objetivo / Descripción:' },
  phProjDesc: { pt: 'Qual o resultado esperado e por que este projeto é crucial?', en: 'What is the expected result and why is this project crucial?', es: '¿Cuál es el resultado esperado y por qué este proyecto es crucial?' },
  lblProjSchedule: { pt: '📅 Cronograma: Início, Duração e Término', en: '📅 Schedule: Start, Duration, and End', es: '📅 Cronograma: Inicio, Duración y Fin' },
  lblStartDate: { pt: 'Data de Início:', en: 'Start Date:', es: 'Fecha de Inicio:' },
  lblDurationDays: { pt: 'Duração (Dias):', en: 'Duration (Days):', es: 'Duración (Días):' },
  lblEndDate: { pt: 'Término / Encerramento:', en: 'End / Deadline:', es: 'Fin / Cierre:' },
  lblFocusWindowStart: { pt: 'Janela Diária — Início (Alerta 🔔):', en: 'Daily Focus Window — Start (Alert 🔔):', es: 'Ventana Diaria — Inicio (Alerta 🔔):' },
  lblFocusWindowEnd: { pt: 'Janela Diária — Fim:', en: 'Daily Focus Window — End:', es: 'Ventana Diaria — Fin:' },
  lblQuickActions: { pt: 'Ações Rápidas de Tarefas:', en: 'Quick Task Actions:', es: 'Acciones Rápidas de Tareas:' },
  btnNewTaskInProj: { pt: '+ Nova Tarefa Neste Projeto', en: '+ New Task in this Project', es: '+ Nueva Tarea en este Proyecto' },
  btnLinkExistingTask: { pt: 'Vincular Tarefa Existente', en: 'Link Existing Task', es: 'Vincular Tarea Existente' },
  btnSaveProj: { pt: 'Salvar Alterações', en: 'Save Changes', es: 'Guardar Cambios' },
  btnCreateProj: { pt: 'Criar Projeto', en: 'Create Project', es: 'Crear Proyecto' },
  toastEnterProjTitle: { pt: 'Digite o nome do projeto', en: 'Enter project name', es: 'Ingresa el nombre del proyecto' },
  toastProjUpdated: { pt: 'Projeto atualizado!', en: 'Project updated!', es: '¡Proyecto actualizado!' },
  toastProjCreated: { pt: '✅ Projeto criado com sucesso!', en: '✅ Project created successfully!', es: '¡✅ Proyecto creado con éxito!' },
  linkTaskTitle: { pt: 'VINCULAR TAREFA EXISTENTE', en: 'LINK EXISTING TASK', es: 'VINCULAR TAREA EXISTENTE' },
  linkTaskSub: { pt: 'Selecione uma tarefa para incluir no projeto', en: 'Select a task to include in project', es: 'Selecciona una tarea para incluir en el proyecto' },
  linkBtn: { pt: 'Vincular', en: 'Link', es: 'Vincular' },
  linkAllLinked: { pt: 'Todas as suas tarefas já estão vinculadas a este projeto ou não há tarefas criadas.', en: 'All your tasks are already linked to this project or there are no tasks created.', es: 'Todas tus tareas ya están vinculadas a este proyecto o no hay tareas creadas.' },
  btnClose: { pt: 'Fechar', en: 'Close', es: 'Cerrar' },
  toastTaskLinked: { pt: 'Tarefa vinculada ao projeto!', en: 'Task linked to project!', es: '¡Tarea vinculada al proyecto!' },
  toastTaskUnlinked: { pt: 'Tarefa desvinculada do projeto', en: 'Task unlinked from project', es: 'Tarea desvinculada del proyecto' },
  delTaskTitle: { pt: 'EXCLUIR OPERAÇÃO?', en: 'DELETE OPERATION?', es: '¿ELIMINAR OPERACIÓN?' },
  delTaskMsg: { pt: 'Tem certeza que deseja cancelar e excluir permanentemente a operação', en: 'Are you sure you want to permanently cancel and delete the operation', es: '¿Estás seguro de que deseas cancelar y eliminar permanentemente la operación' },
  delTaskConfirmMsg: { pt: 'Tem certeza que deseja cancelar e excluir permanentemente a operação', en: 'Are you sure you want to permanently cancel and delete the operation', es: '¿Estás seguro de que deseas cancelar y eliminar permanentemente la operación' },
  btnYesDelete: { pt: 'Sim, Excluir', en: 'Yes, Delete', es: 'Sí, Eliminar' },
  btnDeleteConfirm: { pt: 'Sim, Excluir', en: 'Yes, Delete', es: 'Sí, Eliminar' },
  btnDeleteTask: { pt: 'Excluir Operação', en: 'Delete Operation', es: 'Eliminar Operación' },
  archiveTaskTitle: { pt: 'ARQUIVAR OPERAÇÃO?', en: 'ARCHIVE OPERATION?', es: '¿ARCHIVAR OPERACIÓN?' },
  archiveTaskConfirmMsg: { pt: 'Deseja arquivar a operação', en: 'Do you want to archive the operation', es: '¿Deseas archivar la operación' },
  btnArchiveTask: { pt: 'Arquivar Operação', en: 'Archive Operation', es: 'Archivar Operación' },
  btnArchiveConfirm: { pt: 'Sim, Arquivar', en: 'Yes, Archive', es: 'Sí, Archivar' },
  toastTaskArchived: { pt: '📦 Operação arquivada!', en: '📦 Operation archived!', es: '¡📦 Operación archivada!' },
  unarchiveProjTitle: { pt: 'DESARQUIVAR PROJETO?', en: 'UNARCHIVE PROJECT?', es: '¿DESARCHIVAR PROYECTO?' },
  unarchiveProjMsg: { pt: 'Deseja restaurar o projeto', en: 'Do you want to restore the project', es: '¿Deseas restaurar el proyecto' },
  unarchiveProjConfirmMsg: { pt: 'Deseja restaurar e reativar o projeto', en: 'Do you want to restore and reactivate the project', es: '¿Deseas restaurar y reactivar el proyecto' },
  unarchiveProjToActive: { pt: 'para os projetos ativos?', en: 'to active projects?', es: 'a los proyectos activos?' },
  btnRestoreProj: { pt: 'Restaurar Projeto', en: 'Restore Project', es: 'Restaurar Proyecto' },
  btnUnarchiveConfirm: { pt: 'Desarquivar Projeto', en: 'Unarchive Project', es: 'Desarchivar Proyecto' },
  toastProjUnarchived: { pt: 'Projeto desarquivado!', en: 'Project unarchived!', es: '¡Projeto desarchivado!' },
  archiveProjTitle: { pt: 'ARQUIVAR PROJETO?', en: 'ARCHIVE PROJECT?', es: '¿ARCHIVAR PROYECTO?' },
  archiveProjChoiceTitle: { pt: 'ARQUIVAR PROJETO ESTRATÉGICO', en: 'ARCHIVE STRATEGIC PROJECT', es: 'ARCHIVAR PROYECTO ESTRATÉGICO' },
  archiveProjChoiceDesc: {
    pt: (title, count) => `Você está prestes a arquivar "${title}". Existem ${count} tarefa(s) vinculada(s). Como deseja proceder com essas tarefas?`,
    en: (title, count) => `You are about to archive "${title}". There are ${count} linked task(s). How do you want to proceed with these tasks?`,
    es: (title, count) => `Estás a punto de archivar "${title}". Hay ${count} tarea(s) vinculada(s). ¿Cómo deseas proceder con esas tareas?`,
  },
  archiveProjMsg1: { pt: 'Você está arquivando o projeto', en: 'You are archiving project', es: 'Estás archivando el proyecto' },
  archiveProjMsg2: { pt: 'tarefa(s) vinculada(s). Como deseja proceder com essas tarefas?', en: 'linked task(s). How do you want to proceed with these tasks?', es: 'tarea(s) vinculada(s). ¿Cómo deseas proceder con esas tareas?' },
  btnArchiveBoth: { pt: '📦 Arquivar Projeto E Tarefas Vinculadas', en: '📦 Archive Project AND Linked Tasks', es: '📦 Archivar Proyecto Y Tareas Vinculadas' },
  btnArchiveProjAndTasks: { pt: '📦 Arquivar Projeto E Tarefas Vinculadas', en: '📦 Archive Project AND Linked Tasks', es: '📦 Archivar Proyecto Y Tareas Vinculadas' },
  btnArchiveOnlyProj: { pt: '🔓 Arquivar Só Projeto (Manter Tarefas Ativas/Avulsas)', en: '🔓 Archive Only Project (Keep Tasks Active/Standalone)', es: '🔓 Archivar Solo Proyecto (Mantener Tareas Activas/Sueltas)' },
  btnArchiveProjOnly: { pt: '🔓 Arquivar Só Projeto (Manter Tarefas Ativas/Avulsas)', en: '🔓 Archive Only Project (Keep Tasks Active/Standalone)', es: '🔓 Archivar Solo Proyecto (Mantener Tareas Activas/Sueltas)' },
  toastProjTasksArchived: { pt: '📦 Projeto e tarefas arquivados!', en: '📦 Project and tasks archived!', es: '¡📦 Proyecto y tareas archivados!' },
  toastProjOnlyArchived: { pt: '📦 Projeto arquivado (tarefas tornaram-se avulsas)!', en: '📦 Project archived (tasks became standalone)!', es: '¡📦 Proyecto archivado (tareas quedaron sueltas)!' },
  toastProjArchivedOnly: { pt: '📦 Projeto arquivado (tarefas tornaram-se avulsas)!', en: '📦 Project archived (tasks became standalone)!', es: '¡📦 Proyecto archivado (tareas quedaron sueltas)!' },
  delProjTitle: { pt: 'EXCLUIR PROJETO DEFINITIVAMENTE?', en: 'DELETE PROJECT PERMANENTLY?', es: '¿ELIMINAR PROYECTO DEFINITIVAMENTE?' },
  delProjChoiceTitle: { pt: 'EXCLUIR PROJETO DEFINITIVAMENTE', en: 'DELETE PROJECT PERMANENTLY', es: 'ELIMINAR PROYECTO DEFINITIVAMENTE' },
  delProjChoiceDesc: {
    pt: (title, count) => `Você está prestes a excluir "${title}". Existem ${count} tarefa(s) vinculada(s). O que deseja fazer com as tarefas?`,
    en: (title, count) => `You are about to delete "${title}". There are ${count} linked task(s). What do you want to do with the tasks?`,
    es: (title, count) => `Estás a punto de eliminar "${title}". Hay ${count} tarea(s) vinculada(s). ¿Qué deseas hacer con las tareas?`,
  },
  delProjMsg1: { pt: 'Você está prestes a apagar', en: 'You are about to delete', es: 'Estás a punto de borrar' },
  delProjMsg2: { pt: 'O que deseja fazer com as tarefas?', en: 'What do you want to do with the tasks?', es: '¿Qué deseas hacer con las tareas?' },
  btnDelBoth: { pt: '🗑️ Excluir Projeto E Todas as Suas Tarefas', en: '🗑️ Delete Project AND All Its Tasks', es: '🗑️ Eliminar Proyecto Y Todas Sus Tareas' },
  btnDelProjAndTasks: { pt: '🗑️ Excluir Projeto E Todas as Suas Tarefas', en: '🗑️ Delete Project AND All Its Tasks', es: '🗑️ Eliminar Proyecto Y Todas Sus Tareas' },
  btnDelOnlyProj: { pt: '🛡️ Excluir Apenas Projeto (Preservar Tarefas como Avulsas)', en: '🛡️ Delete Only Project (Keep Tasks Standalone)', es: '🛡️ Eliminar Solo Proyecto (Preservar Tareas Sueltas)' },
  btnDelProjOnly: { pt: '🛡️ Excluir Apenas Projeto (Preservar Tarefas como Avulsas)', en: '🛡️ Delete Only Project (Keep Tasks Standalone)', es: '🛡️ Eliminar Solo Proyecto (Preservar Tareas Sueltas)' },
  toastProjDeleted: { pt: 'Projeto e tarefas excluídos!', en: 'Project and tasks deleted!', es: '¡Proyecto y tareas eliminados!' },
  toastProjTasksDeleted: { pt: 'Projeto e tarefas excluídos!', en: 'Project and tasks deleted!', es: '¡Proyecto y tareas eliminados!' },
  toastProjDeletedTasksSaved: { pt: 'Projeto excluído! Tarefas salvas como avulsas.', en: 'Project deleted! Tasks saved as standalone.', es: '¡Proyecto eliminado! Tareas guardadas como sueltas.' },
  toastProjDeletedOnly: { pt: 'Projeto excluído! Tarefas salvas como avulsas.', en: 'Project deleted! Tasks saved as standalone.', es: '¡Proyecto eliminado! Tareas guardadas como sueltas.' },
  reopenProjTitle: { pt: 'REABRIR PROJETO?', en: 'REOPEN PROJECT?', es: '¿REABRIR PROYECTO?' },
  completeProjTitle: { pt: 'CONCLUIR PROJETO?', en: 'COMPLETE PROJECT?', es: '¿CONCLUIR PROYECTO?' },
  reopenProjMsg: { pt: 'Deseja marcar o projeto de volta como Em Andamento?', en: 'Do you want to mark this project back as In Progress?', es: '¿Deseas marcar este proyecto de vuelta como En Curso?' },
  reopenProjConfirmMsg: { pt: 'Deseja marcar o projeto de volta como Em Andamento?', en: 'Do you want to mark this project back as In Progress?', es: '¿Deseas marcar este proyecto de vuelta como En Curso?' },
  completeProjMsg: { pt: 'Parabéns guerreiro! Confirmar conclusão do projeto estratégico', en: 'Congratulations warrior! Confirm completion of strategic project', es: '¡Felicidades guerrero! Confirmar conclusión del proyecto estratégico' },
  completeProjConfirmMsg: { pt: 'Parabéns guerreiro! Confirmar conclusão do projeto estratégico', en: 'Congratulations warrior! Confirm completion of strategic project', es: '¡Felicidades guerrero! Confirmar conclusión del proyecto estratégico' },
  btnReopen: { pt: 'Reabrir', en: 'Reopen', es: 'Reabrir' },
  btnCompleteMission: { pt: 'Concluir Missão', en: 'Complete Mission', es: 'Concluir Misión' },
  toastProjReopened: { pt: 'Projeto reaberto', en: 'Project reopened', es: 'Proyecto reabierto' },
  toastProjCompleted: { pt: '🏆 Projeto Concluído com Honra!', en: '🏆 Project Completed with Honor!', es: '¡🏆 Proyecto Concluido con Honor!' },
  statusCompleted: { pt: '✓ CONCLUÍDO', en: '✓ COMPLETED', es: '✓ COMPLETADO' },
  statusInProgress: { pt: 'EM ANDAMENTO', en: 'IN PROGRESS', es: 'EN CURSO' },
  lblTotalProgress: { pt: 'PROGRESSO TOTAL', en: 'TOTAL PROGRESS', es: 'PROGRESO TOTAL' },
  lblLinkedTasks: { pt: 'TAREFAS VINCULADAS', en: 'LINKED TASKS', es: 'TAREAS VINCULADAS' },
  btnNewInline: { pt: 'Nova', en: 'New', es: 'Nueva' },
  btnLinkInline: { pt: 'Vincular', en: 'Link', es: 'Vincular' },
  noLinkedTasks: { pt: 'Nenhuma tarefa vinculada ainda.', en: 'No linked tasks yet.', es: 'Ninguna tarea vinculada aún.' },
  lblSteps: { pt: 'ETAPAS', en: 'STEPS', es: 'ETAPAS' },
  phAddStep: { pt: '+ Adicionar etapa...', en: '+ Add step...', es: '+ Añadir etapa...' },
  btnAdd: { pt: 'Adicionar', en: 'Add', es: 'Añadir' },
  wordDays: { pt: 'dias', en: 'days', es: 'días' },
  wordDay: { pt: 'Dia', en: 'Day', es: 'Día' },
  wordDeadline: { pt: 'Prazo:', en: 'Deadline:', es: 'Plazo:' },
  noDeadline: { pt: 'Sem prazo definido', en: 'No deadline set', es: 'Sin plazo definido' },
  wordTasks: { pt: 'tarefas', en: 'tasks', es: 'tareas' },
  btnCreateFirstProject: { pt: '+ CRIAR PRIMEIRO PROJETO', en: '+ CREATE FIRST PROJECT', es: '+ CREAR PRIMER PROYECTO' },
  cardNewOp: { pt: '+ Nova Operação', en: '+ New Operation', es: '+ Nueva Operación' },
  cardNewProject: { pt: 'Novo Projeto Estratégico', en: 'New Strategic Project', es: 'Nuevo Proyecto Estratégico' },
  cardNewProjectSub: { pt: 'Crie uma nova frente tática com marcos e tarefas dedicadas.', en: 'Create a new tactical front with milestones and dedicated tasks.', es: 'Crea un nuevo frente táctico con hitos y tareas dedicadas.' },
  archivedProjectsTitle: { pt: '🏛️ PROJETOS ARQUIVADOS', en: '🏛️ ARCHIVED PROJECTS', es: '🏛️ PROYECTOS ARCHIVADOS' },
  noArchivedProjects: { pt: 'Nenhum projeto arquivado.', en: 'No archived projects.', es: 'Ningún proyecto archivado.' },
  badgeArchived: { pt: 'Arquivado', en: 'Archived', es: 'Archivado' },
  lblLinkedTasksCount: { pt: 'Tarefas vinculadas:', en: 'Linked tasks:', es: 'Tareas vinculadas:' },
  btnUnarchive: { pt: 'Desarquivar', en: 'Unarchive', es: 'Desarchivar' },
  archivedTasksTitle: { pt: '🎯 TAREFAS ARQUIVADAS', en: '🎯 ARCHIVED TASKS', es: '🎯 TAREAS ARCHIVADAS' },
  btnRestore: { pt: 'Restaurar', en: 'Restore', es: 'Restaurar' },
  toastTaskRestored: { pt: 'Tarefa restaurada!', en: 'Task restored!', es: '¡Tarea restaurada!' },
  projFilterActive: { pt: 'Ativos', en: 'Active', es: 'Activos' },
  projFilterDone: { pt: 'Concluídos', en: 'Completed', es: 'Completados' },
  projFilterArchived: { pt: 'Arquivados 📦', en: 'Archived 📦', es: 'Archivados 📦' },
  btnConfirmGeneric: { pt: 'Confirmar', en: 'Confirm', es: 'Confirmar' },
  editTaskTitle: { pt: 'Editar Operação', en: 'Edit Operation', es: 'Editar Operación' },
  editProjTitle: { pt: 'Editar Projeto', en: 'Edit Project', es: 'Editar Proyecto' },
  archiveProjAction: { pt: 'Arquivar Projeto', en: 'Archive Project', es: 'Archivar Proyecto' },
  unarchiveProjAction: { pt: 'Desarquivar Projeto', en: 'Unarchive Project', es: 'Desarchivar Proyecto' },
  delProjAction: { pt: 'Excluir Projeto', en: 'Delete Project', es: 'Eliminar Proyecto' },
  unlinkFromProj: { pt: 'Desvincular do Projeto', en: 'Unlink from Project', es: 'Desvincular del Proyecto' },
  btnExploreTemplates: { pt: '⚡ 6 Modelos Prontos da Forja', en: '⚡ 6 Forge Templates', es: '⚡ 6 Plantillas de la Forja' },
  btnExploreTemplatesShort: { pt: '⚡ 6 Modelos', en: '⚡ 6 Templates', es: '⚡ 6 Plantillas' },
  btnHideTemplates: { pt: 'Ocultar Modelos', en: 'Hide Templates', es: 'Ocultar Plantillas' },
  btnHideTemplatesShort: { pt: 'Ocultar', en: 'Hide', es: 'Ocultar' },
  templatesBannerTitle: { pt: 'MODELOS PRÉ-CONFIGURADOS DA FORJA (1 CLIQUE)', en: 'FORGE PRE-CONFIGURED TEMPLATES (1-CLICK)', es: 'PLANTILLAS PRECONFIGURADAS DE LA FORJA (1-CLIC)' },
  templatesBannerDesc: { pt: 'Projetos prontos com mandamentos, hábitos e marcos táticos testados. Ative ou adapte como quiser:', en: 'Ready projects with commandments, habits, and tactical milestones. Activate or tailor as you wish:', es: 'Proyectos listos con mandamientos, hábitos e hitos tácticos probados. Activa o adapta a tu gusto:' },
  btnUseTemplate: { pt: 'Usar Modelo ➔', en: 'Use Template ➔', es: 'Usar Plantilla ➔' },
  lblCategoryArea: { pt: 'Área / Categoria do Projeto:', en: 'Project Area / Category:', es: 'Área / Categoría del Proyecto:' },
  optNoCategory: { pt: 'Geral / Outro', en: 'General / Other', es: 'General / Otro' },
  lblPillarPact: { pt: 'Pacto de Honra dos 3 Pilares:', en: '3 Pillars Honor Pact:', es: 'Pacto de Honor de los 3 Pilares:' },
  chkLinkPillars: { pt: 'Vincular este projeto à blindagem dos 3 Pilares (Sem Pornô, Sem Masturbação, Retenção)', en: 'Link this project to 3 Pillars shield (No Porn, No Masturbation, Retention)', es: 'Vincular este proyecto al blindaje de los 3 Pilares (Sin Porno, Sin Masturbación, Retención)' },
  badgePillarsActive: { pt: '🛡️ 3 Pilares Vinculados', en: '🛡️ 3 Pillars Linked', es: '🛡️ 3 Pilares Vinculados' },
  badgePillarsStreak: { pt: 'dias limpos', en: 'clean days', es: 'días limpios' },
  lblCommandments: { pt: '📜 Mandamentos & Código de Honra:', en: '📜 Commandments & Honor Code:', es: '📜 Mandamientos y Código de Honor:' },
  lblCommandmentsSub: { pt: 'Princípios inegociáveis e nova autoimagem gravada neste projeto:', en: 'Non-negotiable principles and new self-image etched into this project:', es: 'Principios innegociables y nueva autoimagen grabada en este proyecto:' },
  phNewCommandment: { pt: 'Novo mandamento (ex: Eu sou o prêmio / Não ligo para opinião alheia)...', en: 'New commandment (e.g. I am the prize / I don\'t care about outside opinions)...', es: 'Nuevo mandamiento (ej.: Yo soy el premio / No me importa la opinión ajena)...' },
  btnAddCommandment: { pt: 'Adicionar Lei', en: 'Add Law', es: 'Añadir Ley' },
  lblSuggestionsFromCategory: { pt: 'Sugestões Recomendadas para esta Área:', en: 'Recommended Suggestions for this Area:', es: 'Sugerencias Recomendadas para esta Área:' },
  btnAddAllSuggestions: { pt: '+ Adicionar Todas', en: '+ Add All', es: '+ Añadir Todas' },
  lblHabitsInProject: { pt: '⚡ Hábitos Vinculados a Este Projeto:', en: '⚡ Habits Linked to This Project:', es: '⚡ Hábitos Vinculados a Este Proyecto:' },
  lblHabitsInProjectSub: { pt: 'Ao concluir esses hábitos no dia a dia, eles alimentam a força deste projeto:', en: 'Completing these daily habits directly fuels this project\'s power:', es: 'Al completar estos hábitos a diario, alimentan la fuerza de este proyecto:' },
  btnAnchorHabit: { pt: '+ Vincular Hábito da Forja', en: '+ Link Forge Habit', es: '+ Vincular Hábito de la Forja' },
  toastHabitLinkedToProj: { pt: '⚡ Hábito vinculado ao projeto!', en: '⚡ Habit linked to project!', es: '¡⚡ Hábito vinculado al proyecto!' },
  toastHabitUnlinkedFromProj: { pt: 'Hábito desvinculado do projeto', en: 'Habit unlinked from project', es: 'Hábito desvinculado del proyecto' },
  durationShortcuts: { pt: 'Atalhos de Duração:', en: 'Duration Shortcuts:', es: 'Atajos de Duración:' },
  durationDaysWord: { pt: 'Dias', en: 'Days', es: 'Días' },
  daysRemainingWord: { pt: 'Restam', en: 'Left', es: 'Quedan' },
  projectHealthOnTrack: { pt: 'EM RITMO DE VITÓRIA', en: 'ON TRACK FOR VICTORY', es: 'EN RITMO DE VICTORIA' },
  projectHealthWarning: { pt: 'ALERTA: FORJA ESFRIANDO', en: 'WARNING: FORGE COOLING', es: 'ALERTA: FORJA ENFRIÁNDOSE' },
  toastTemplateLoaded: { pt: '⚔️ Modelo carregado com sucesso!', en: '⚔️ Template loaded successfully!', es: '¡⚔️ Plantilla cargada con éxito!' },
  lblForgeSlotsStatus: { pt: 'Slots da Forja em uso:', en: 'Forge slots in use:', es: 'Slots de la Forja en uso:' },
  lblMyActiveForgeHabits: { pt: '⚔️ Seus Hábitos Ativos no Protocolo Diário:', en: '⚔️ Your Active Daily Protocol Habits:', es: '⚔️ Tus Hábitos Activos en el Protocolo Diario:' },
  lblSlotsFullNotice: {
    pt: (slots) => `🔒 Todos os seus ${slots} slots da Forja já estão em uso. Selecione apenas entre os seus hábitos ativos para este projeto:`,
    en: (slots) => `🔒 All your ${slots} Forge slots are already in use. Select only among your active habits for this project:`,
    es: (slots) => `🔒 Todos tus ${slots} slots de la Forja ya están en uso. Selecciona solo entre tus hábitos activos para este proyecto:`,
  },
  lblFreeSlotsAvailable: {
    pt: (free) => `Você possui ${free} slot(s) livre(s) na Forja. Você pode escolher mais hábitos abaixo:`,
    en: (free) => `You have ${free} free slot(s) in the Forge. You may choose more habits below:`,
    es: (free) => `Tienes ${free} slot(s) libre(s) en la Forja. Puedes elegir más hábitos abajo:`,
  },
  toastSlotsFullCannotAdd: {
    pt: (slots) => `🔒 Limite de ${slots} slots atingido na Forja! Escolha apenas hábitos que você já tem ativos.`,
    en: (slots) => `🔒 Limit of ${slots} slots reached in the Forge! Choose only habits you already have active.`,
    es: (slots) => `🔒 ¡Límite de ${slots} slots alcanzado en la Forja! Elige solo hábitos que ya tengas activos.`,
  },
  tipHabitDone: { pt: 'Concluído hoje! (Toque para desmarcar)', en: 'Done today! (Tap to uncheck)', es: '¡Cumplido hoy! (Toca para desmarcar)' },
  tipHabitPending: { pt: 'Pendente hoje (Toque para marcar como cumprido)', en: 'Pending today (Tap to mark done)', es: 'Pendiente hoy (Toca para marcar cumplido)' },
  btnExpandProject: { pt: 'Expandir Projeto & Tarefas', en: 'Expand Project & Tasks', es: 'Expandir Proyecto y Tareas' },
  btnCollapseProject: { pt: 'Recolher Projeto', en: 'Collapse Project', es: 'Plegar Proyecto' },
  lblCompactTasks: { pt: 'tarefas', en: 'tasks', es: 'tareas' },
  lblCompactHabits: { pt: 'hábitos', en: 'habits', es: 'hábitos' },
  lblCompactLaws: { pt: 'leis', en: 'laws', es: 'leyes' },
  lblCompactSteps: { pt: 'etapas', en: 'milestones', es: 'etapas' },
  lblDoneTodayCount: { pt: 'cumpridos hoje', en: 'done today', es: 'cumplidos hoy' },
  lblTasksDoneCount: { pt: 'concluídas', en: 'completed', es: 'completadas' },
  btnAnalyzeTask: { pt: 'Analisar Tarefa', en: 'Analyze Task', es: 'Analizar Tarea' },
  btnAnalyzeShort: { pt: 'Análise', en: 'Analysis', es: 'Análisis' },
  taskAnalysisTitle: { pt: 'ANÁLISE DA OPERAÇÃO', en: 'OPERATION ANALYSIS', es: 'ANÁLISIS DE LA OPERACIÓN' },
  taskAnalysisSub: { pt: 'Histórico de consistência, frequência e evolução na disciplina', en: 'Consistency history, frequency, and discipline evolution', es: 'Historial de consistencia, frecuencia y evolución en la disciplina' },
  lblTotalExecutions: { pt: 'Total de Conclusões', en: 'Total Completions', es: 'Total de Conclusiones' },
  subCumulativeHistory: { pt: 'Execuções registradas', en: 'Recorded executions', es: 'Ejecuciones registradas' },
  lblCurrentStreak: { pt: 'Sequência Ativa', en: 'Active Streak', es: 'Racha Activa' },
  subConsecutiveDays: { pt: 'dias consecutivos', en: 'consecutive days', es: 'días consecutivos' },
  lblConsistencyRate: { pt: 'Taxa de Consistência', en: 'Consistency Rate', es: 'Tasa de Consistencia' },
  subLast30Days: { pt: 'Últimos 30 dias', en: 'Last 30 days', es: 'Últimos 30 días' },
  lblProjectContribution: { pt: 'Meta do Projeto', en: 'Project Goal', es: 'Meta del Proyecto' },
  subDaysDoneOfTotal: { pt: 'dias cumpridos na meta', en: 'days completed in goal', es: 'días cumplidos en la meta' },
  lblIndependentTask: { pt: 'Operação Avulsa', en: 'Standalone Operation', es: 'Operación Suelta' },
  subNoLinkedProject: { pt: 'Sem projeto vinculado', en: 'No linked project', es: 'Sin proyecto vinculado' },
  lblStatusToday: { pt: 'Status de Hoje', en: 'Today\'s Status', es: 'Estado de Hoy' },
  badgeDoneTodayHonored: { pt: '✓ Concluída Hoje com Honra!', en: '✓ Completed Today with Honor!', es: '¡✓ Cumplida Hoy con Honor!' },
  badgePendingToday: { pt: '⏳ Pendente para Hoje', en: '⏳ Pending for Today', es: '⏳ Pendiente para Hoy' },
  btnMarkDoneNow: { pt: '✓ Marcar como Feita', en: '✓ Mark as Done', es: '✓ Marcar como Hecha' },
  btnUnmarkToday: { pt: 'Desmarcar Hoje', en: 'Unmark Today', es: 'Desmarcar Hoy' },
  lblHeatmap14Days: { pt: 'Histórico dos Últimos 14 Dias', en: 'Last 14 Days History', es: 'Historial de los Últimos 14 Días' },
  lblHeatmapTip: { pt: 'Toque em qualquer dia para marcar ou desmarcar retrospectivamente.', en: 'Tap any day to mark or unmark retroactively.', es: 'Toca cualquier día para marcar o desmarcar retroactivamente.' },
  lblCompletedDatesList: { pt: 'Registro de Datas Cumpridas', en: 'Log of Completed Dates', es: 'Registro de Fechas Cumplidas' },
  noCompletionsYet: { pt: 'Nenhuma conclusão registrada ainda. Cumpra a missão hoje para iniciar sua série de vitórias!', en: 'No completions recorded yet. Complete the mission today to launch your winning streak!', es: 'Ninguna conclusión registrada aún. ¡Cumple la misión hoy para iniciar tu racha de victorias!' },
  lblTaskSpecs: { pt: 'Ficha Técnica da Missão', en: 'Mission Technical Specs', es: 'Ficha Técnica de la Misión' },
  lblCreatedOn: { pt: 'Criada em:', en: 'Created on:', es: 'Creada en:' },
  lblTargetDaysInProject: { pt: 'Meta de Duração:', en: 'Target Duration:', es: 'Meta de Duración:' },
  lblExecutionsOrDays: { pt: 'dias', en: 'days', es: 'días' },
  lblDoneTodayTag: { pt: 'Feita hoje', en: 'Done today', es: 'Hecha hoy' },
  lblPendingTodayTag: { pt: 'Pendente hoje', en: 'Pending today', es: 'Pendiente hoy' },
  lblTaskDaysCompletedBadge: { pt: 'dias cumpridos', en: 'days completed', es: 'días cumplidos' },
  btnFinishAnalysis: { pt: 'Fechar Análise', en: 'Close Analysis', es: 'Cerrar Análisis' },
  lblSuggestedTaskMatch: { pt: 'Operação correspondente encontrada:', en: 'Matching operation found:', es: 'Operación coincidente encontrada:' },
  btnLinkThisTask: { pt: 'Vincular com 1 Toque', en: 'Link with 1 Tap', es: 'Vincular con 1 Toque' },
  toastTaskLinked: { pt: 'Operação vinculada ao projeto com sucesso!', en: 'Operation successfully linked to project!', es: '¡Operación vinculada al proyecto con éxito!' },
  lblDaysCompletedInGoal: { pt: 'dias cumpridos na meta', en: 'days completed in goal', es: 'días cumplidos en la meta' },
  lblNoTasksInProjNotice: { pt: 'Nenhuma tarefa vinculada a este projeto ainda.', en: 'No tasks linked to this project yet.', es: 'Ninguna tarea vinculada a este proyecto aún.' },
  lblTodayBadge: { pt: 'HOJE', en: 'TODAY', es: 'HOY' },
};

export default function OpsView() {
  const { S, update, toast, openModal, closeModal } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = I18N;

  const [activeMainTab, setActiveMainTab] = useState('tasks');
  const [filter, setFilter] = useState('today');
  const [projFilter, setProjFilter] = useState('ativos'); // 'ativos', 'concluidos', 'arquivados'
  const [showTemplates, setShowTemplates] = useState(false);
  const [expandedProjIds, setExpandedProjIds] = useState({});

  const toggleExpandProject = (projId) => {
    setExpandedProjIds((prev) => ({
      ...prev,
      [projId]: !prev[projId],
    }));
    AF.click();
  };

  const tasks = S.tasks || [];
  const projects = S.projects || [];
  const archivedProjectIds = useMemo(() => new Set(
    (S.projects || []).filter((p) => p && p.archived).map((p) => String(p.id))
  ), [S.projects]);

  const isTaskActive = useCallback((t) => {
    if (!t || t.archived) return false;
    const pId = t.projectId != null ? t.projectId : t.proj;
    if (pId != null && archivedProjectIds.has(String(pId))) return false;
    return true;
  }, [archivedProjectIds]);

  const todayTasks = tasks.filter((x) => isTaskActive(x) && L.repDue(x, today()));
  const completedToday = todayTasks.filter((x) => L.isDone(x, today())).length;
  const pct = todayTasks.length ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  /* Funções Utilitárias de Análise de Tarefas e Progresso de Projetos */
  const getTaskStreak = useCallback((t) => {
    if (!t) return 0;
    if ((t.rep || 'unica') === 'unica') {
      return t.done ? 1 : 0;
    }
    const dates = new Set(t.doneDates || []);
    if (dates.size === 0) return 0;
    const tod = today();
    let streak = 0;
    let curr = parseD(tod);
    if (!dates.has(tod)) {
      curr = new Date(curr.getTime() - 86400000);
      if (!dates.has(dstr(curr))) return 0;
    }
    while (true) {
      const s = dstr(curr);
      if (dates.has(s)) {
        streak++;
        curr = new Date(curr.getTime() - 86400000);
      } else {
        break;
      }
    }
    return streak;
  }, []);

  const getTaskTotalDone = useCallback((t) => {
    if (!t) return 0;
    if ((t.rep || 'unica') === 'unica') return t.done ? 1 : 0;
    return (t.doneDates || []).length || (t.done ? 1 : 0);
  }, []);

  const getTaskConsistency = useCallback((t, daysWindow = 30) => {
    if (!t) return 0;
    const dates = new Set(t.doneDates || []);
    if ((t.rep || 'unica') === 'unica') return t.done ? 100 : 0;
    const createdDate = t.createdAt || today();
    const createdMs = parseD(createdDate).getTime();
    const todayMs = parseD(today()).getTime();
    const daysSinceCreation = Math.max(1, Math.round((todayMs - createdMs) / 86400000) + 1);
    const windowDays = Math.min(daysWindow, daysSinceCreation);
    let dueCount = 0;
    let doneCount = 0;
    for (let i = 0; i < windowDays; i++) {
      const d = new Date(todayMs - i * 86400000);
      const ds = dstr(d);
      if (L.repDue(t, ds)) {
        dueCount++;
        if (dates.has(ds)) doneCount++;
      }
    }
    return dueCount > 0 ? Math.min(100, Math.round((doneCount / dueCount) * 100)) : (dates.size > 0 ? 100 : 0);
  }, []);

  const calcProjectProgress = useCallback((proj, allTasks = tasks) => {
    const isCompleted = proj.status === 'concluido';
    if (isCompleted) {
      return {
        pct: 100,
        isCompleted: true,
        hasRecurring: false,
        recurringDone: 0,
        recurringTarget: 0,
        todayDue: 0,
        todayDone: 0,
        taskStats: [],
      };
    }

    const projDuration = proj.days
      ? Number(proj.days)
      : (proj.start && proj.deadline ? Math.max(1, daysBetween(proj.start, proj.deadline) + 1) : 0);

    const steps = proj.steps || [];
    const stepsDone = steps.filter((s) => s.done).length;

    const projTasks = (allTasks || []).filter(
      (t) => (String(t.projectId) === String(proj.id) || String(t.proj) === String(proj.id)) && !t.archived
    );

    const singleTasks = projTasks.filter((t) => (t.rep || 'unica') === 'unica');
    const recurringTasks = projTasks.filter((t) => (t.rep || 'unica') !== 'unica');
    const singleDone = singleTasks.filter((t) => t.done).length;

    let recurringTargetSum = 0;
    let recurringDoneSum = 0;
    let todayDueCount = 0;
    let todayDoneCount = 0;
    const tod = today();

    const taskStats = projTasks.map((t) => {
      const isExplicitRec = (t.rep || 'unica') !== 'unica';
      const recordedDays = (t.doneDates || []).length;
      const isMultiDayProject = projDuration > 1;
      const isTreatedAsRecurring = isExplicitRec || recordedDays > 1 || (isMultiDayProject && steps.length === 0);

      const isDoneToday = L.isDone(t, tod);
      const isDueToday = isTreatedAsRecurring ? (isExplicitRec ? L.repDue(t, tod) : true) : true;
      if (isDueToday) {
        todayDueCount++;
        if (isDoneToday) todayDoneCount++;
      }

      if (!isTreatedAsRecurring) {
        return {
          id: t.id,
          isRec: false,
          done: t.done,
          target: 1,
          completed: t.done ? 1 : 0,
          pct: t.done ? 100 : 0,
          isDoneToday,
        };
      }

      let target = 30;
      if (projDuration > 0) {
        if (!isExplicitRec || t.rep === 'diaria') target = projDuration;
        else if (t.rep === 'dias_uteis') target = Math.max(1, Math.round((projDuration * 5) / 7));
        else if (t.rep === 'fds') target = Math.max(1, Math.round((projDuration * 2) / 7));
        else if (t.rep === 'semanal') target = Math.max(1, Math.round(projDuration / 7));
        else if (t.rep === 'custom') target = Math.max(1, Math.round((projDuration * (t.repDays?.length || 1)) / 7));
      } else {
        target = Math.max(1, recordedDays + (isDoneToday ? 0 : 1));
      }

      const completed = Math.max(recordedDays, (t.done || isDoneToday) ? 1 : 0);
      recurringTargetSum += target;
      recurringDoneSum += Math.min(target, completed);

      return {
        id: t.id,
        isRec: true,
        target,
        completed,
        pct: Math.min(100, Math.round((completed / target) * 100)),
        isDoneToday,
      };
    });

    let pct = 0;
    const effectiveRecurring = taskStats.filter((ts) => ts.isRec);
    const effectiveSingle = taskStats.filter((ts) => !ts.isRec);
    const hasRecurring = effectiveRecurring.length > 0;
    const hasDiscreteItems = steps.length > 0 || effectiveSingle.length > 0;

    if (hasRecurring && !hasDiscreteItems) {
      pct = recurringTargetSum > 0 ? Math.min(100, Math.round((recurringDoneSum / recurringTargetSum) * 100)) : 0;
    } else if (!hasRecurring && hasDiscreteItems) {
      const totalDiscrete = steps.length + effectiveSingle.length;
      const doneDiscrete = stepsDone + effectiveSingle.filter((ts) => ts.done).length;
      pct = totalDiscrete > 0 ? Math.round((doneDiscrete / totalDiscrete) * 100) : 0;
    } else if (hasRecurring && hasDiscreteItems) {
      const totalDiscrete = steps.length + effectiveSingle.length;
      const doneDiscrete = stepsDone + effectiveSingle.filter((ts) => ts.done).length;
      const discreteRatio = totalDiscrete > 0 ? doneDiscrete / totalDiscrete : 0;
      const recRatio = recurringTargetSum > 0 ? recurringDoneSum / recurringTargetSum : 0;
      pct = Math.min(100, Math.round(((discreteRatio + recRatio) / 2) * 100));
    } else {
      pct = 0;
    }

    return {
      pct,
      projDuration,
      stepsTotal: steps.length,
      stepsDone,
      singleTotal: effectiveSingle.length,
      singleDone: effectiveSingle.filter((ts) => ts.done).length,
      hasRecurring,
      recurringTarget: recurringTargetSum,
      recurringDone: recurringDoneSum,
      todayDue: todayDueCount,
      todayDone: todayDoneCount,
      taskStats,
    };
  }, [tasks]);

  /* MODAL: Confirmação Genérica */
  const confirmAction = ({ title, message, onConfirm, confirmText = null, danger = false }) => {
    const defaultConfirmText = tx.btnConfirmGeneric[curLang];
    const ConfirmModal = () => (
      <div className="text-center p-1">
        <div className="w-12 h-12 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center mx-auto mb-3 text-gold">
          {danger ? <AlertTriangle size={24} className="text-danger" /> : <AlertCircle size={24} />}
        </div>
        <h3 className="font-display text-xl tracking-wide text-ink mb-1.5">{title}</h3>
        <p className="text-xs text-muted leading-relaxed mb-4">{message}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 py-2 rounded text-xs font-bold font-mono transition-colors ${
              danger ? 'bg-danger text-white hover:bg-danger/90' : 'btn-gold'
            }`}
            onClick={() => {
              closeModal();
              onConfirm();
            }}
          >
            {confirmText || defaultConfirmText}
          </button>
          <button
            type="button"
            className="btn-dark py-2 px-4 text-xs font-bold font-mono"
            onClick={closeModal}
          >
            {tx.btnCancel[curLang]}
          </button>
        </div>
      </div>
    );
    openModal(<ConfirmModal />);
  };

  /* Helper para label de repetição */
  const formatRepLabel = (t) => {
    if (!t.rep || t.rep === 'unica') return null;
    if (t.rep === 'diaria') return curLang === 'en' ? '🔁 Daily' : curLang === 'es' ? '🔁 Diaria' : '🔁 Diária';
    if (t.rep === 'dias_uteis' || t.rep === 'semana') return curLang === 'en' ? '🔁 Mon–Fri' : curLang === 'es' ? '🔁 Lun–Vie' : '🔁 Seg–Sex';
    if (t.rep === 'fds') return curLang === 'en' ? '🔁 Sat–Sun' : curLang === 'es' ? '🔁 Sáb–Dom' : '🔁 Sáb–Dom';
    const dayNames = curLang === 'en'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : curLang === 'es'
      ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    if (t.rep === 'semanal') {
      const dName = dayNames[t.repDay == null ? 1 : Number(t.repDay)] || dayNames[1];
      return `🔁 ${curLang === 'en' ? 'Weekly' : 'Semanal'} (${dName})`;
    }
    if (t.rep === 'custom') {
      const days = (t.repDays || []).slice().sort((a, b) => a - b).map((i) => dayNames[i]).join(', ');
      const customLabel = curLang === 'en' ? 'Custom' : 'Personalizada';
      return `🗓️ ${days || customLabel}`;
    }
    return `🔁 ${t.rep}`;
  };

  /* MODAL: Criar / Editar Tarefa (Sem X duplo) */
  const openTaskModal = (taskToEdit = null, defaultProjectId = '') => {
    const TaskModalContent = () => {
      const [txt, setTxt] = useState(taskToEdit ? taskToEdit.txt : '');
      const [pri, setPri] = useState(taskToEdit ? taskToEdit.pri : 'media');
      const [rep, setRep] = useState(taskToEdit ? (taskToEdit.rep || 'unica') : 'unica');
      const [repDay, setRepDay] = useState(taskToEdit && taskToEdit.repDay != null ? Number(taskToEdit.repDay) : 1);
      const [repDays, setRepDays] = useState(taskToEdit && Array.isArray(taskToEdit.repDays) ? taskToEdit.repDays : [1]);
      const [time, setTime] = useState(taskToEdit ? (taskToEdit.time || '') : '');
      const [projectId, setProjectId] = useState(taskToEdit ? (taskToEdit.projectId || '') : defaultProjectId);

      const dayList = curLang === 'en' ? [
        { id: 0, l: 'Sun', f: 'Sunday' },
        { id: 1, l: 'Mon', f: 'Monday' },
        { id: 2, l: 'Tue', f: 'Tuesday' },
        { id: 3, l: 'Wed', f: 'Wednesday' },
        { id: 4, l: 'Thu', f: 'Thursday' },
        { id: 5, l: 'Fri', f: 'Friday' },
        { id: 6, l: 'Sat', f: 'Saturday' },
      ] : curLang === 'es' ? [
        { id: 0, l: 'Dom', f: 'Domingo' },
        { id: 1, l: 'Lun', f: 'Lunes' },
        { id: 2, l: 'Mar', f: 'Martes' },
        { id: 3, l: 'Mié', f: 'Miércoles' },
        { id: 4, l: 'Jue', f: 'Jueves' },
        { id: 5, l: 'Vie', f: 'Viernes' },
        { id: 6, l: 'Sáb', f: 'Sábado' },
      ] : [
        { id: 0, l: 'Dom', f: 'Domingo' },
        { id: 1, l: 'Seg', f: 'Segunda-feira' },
        { id: 2, l: 'Ter', f: 'Terça-feira' },
        { id: 3, l: 'Qua', f: 'Quarta-feira' },
        { id: 4, l: 'Qui', f: 'Quinta-feira' },
        { id: 5, l: 'Sex', f: 'Sexta-feira' },
        { id: 6, l: 'Sáb', f: 'Sábado' },
      ];

      return (
        <div className="text-left">
          <div className="pb-2 mb-3 border-b border-line">
            <h3 className="font-display text-xl tracking-wide text-gold">
              {taskToEdit ? tx.taskModalEdit[curLang] : tx.taskModalNew[curLang]}
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <span className="lbl mb-1 block">{tx.lblMissionDesc[curLang]}</span>
              <input
                type="text"
                placeholder={tx.phMission[curLang]}
                className="field w-full text-xs sm:text-sm"
                value={txt}
                onChange={(e) => setTxt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="lbl mb-1 block">{tx.lblPriority[curLang]}</span>
                <select
                  className="field w-full text-xs font-semibold"
                  value={pri}
                  onChange={(e) => setPri(e.target.value)}
                >
                  <option value="alta" className="text-danger font-bold">{tx.priHigh[curLang]}</option>
                  <option value="media" className="text-gold font-bold">{tx.priMedium[curLang]}</option>
                  <option value="baixa" className="text-muted font-bold">{tx.priLow[curLang]}</option>
                </select>
              </div>

              <div>
                <span className="lbl mb-1 block">{tx.lblFrequency[curLang]}</span>
                <select
                  className="field w-full text-xs font-semibold"
                  value={rep}
                  onChange={(e) => setRep(e.target.value)}
                >
                  <option value="unica">{tx.repOnce[curLang]}</option>
                  <option value="diaria">{tx.repDaily[curLang]}</option>
                  <option value="dias_uteis">{tx.repWorkdays[curLang]}</option>
                  <option value="fds">{tx.repWeekend[curLang]}</option>
                  <option value="semanal">{tx.repWeekly[curLang]}</option>
                  <option value="custom">{tx.repCustom[curLang]}</option>
                </select>
              </div>
            </div>

            {/* SELEÇÃO DO DIA DA SEMANA QUANDO FOR SEMANAL */}
            {rep === 'semanal' && (
              <div className="p-2.5 rounded bg-surface2 border border-gold/40 animate-fadeIn">
                <span className="lbl mb-1.5 block text-gold font-bold">{tx.chooseWeeklyDay[curLang]}</span>
                <div className="grid grid-cols-7 gap-1">
                  {dayList.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setRepDay(d.id)}
                      className={`py-1.5 rounded text-xs font-bold transition-all text-center ${
                        repDay === d.id
                          ? 'bg-gold text-[#141414] font-extrabold shadow-sm'
                          : 'bg-surface border border-line text-muted hover:text-ink hover:border-gold/50'
                      }`}
                      title={d.f}
                    >
                      {d.l}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted mt-1.5 font-mono">
                  {tx.repeatsEvery[curLang]} <b className="text-gold uppercase">{dayList[repDay]?.f}</b>.
                </p>
              </div>
            )}

            {/* SELEÇÃO DE MÚLTIPLOS DIAS QUANDO FOR PERSONALIZADA */}
            {rep === 'custom' && (
              <div className="p-2.5 rounded bg-surface2 border border-gold/40 animate-fadeIn">
                <span className="lbl mb-1.5 block text-gold font-bold">{tx.chooseCustomDays[curLang]}</span>
                <div className="grid grid-cols-7 gap-1">
                  {dayList.map((d) => {
                    const isSel = repDays.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() =>
                          setRepDays((prev) =>
                            prev.includes(d.id)
                              ? prev.filter((x) => x !== d.id)
                              : [...prev, d.id]
                          )
                        }
                        className={`py-1.5 rounded text-xs font-bold transition-all text-center ${
                          isSel
                            ? 'bg-gold text-[#141414] font-extrabold shadow-sm'
                            : 'bg-surface border border-line text-muted hover:text-ink hover:border-gold/50'
                        }`}
                        title={d.f}
                      >
                        {d.l}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted mt-1.5 font-mono">
                  {tx.lblDays[curLang]}{' '}
                  <b className="text-gold">
                    {repDays.length > 0
                      ? repDays
                          .slice()
                          .sort((a, b) => a - b)
                          .map((i) => dayList[i]?.l)
                          .join(', ')
                      : tx.noDaysSelected[curLang]}
                  </b>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="lbl mb-1 block">{tx.lblTimeOpt[curLang]}</span>
                <input
                  type="time"
                  className="field w-full text-xs font-mono"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div>
                <span className="lbl mb-1 block">{tx.lblLinkProject[curLang]}</span>
                <select
                  className="field w-full text-xs font-semibold"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">{tx.optNoProject[curLang]}</option>
                  {projects.filter((p) => !p.archived).map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="btn-gold flex-1 py-2 text-xs font-bold"
              onClick={() => {
                if (!txt.trim()) return toast(tx.toastEnterDesc[curLang]);
                update((s) => {
                  s.tasks = s.tasks || [];
                  if (taskToEdit) {
                    const tTarget = s.tasks.find((x) => String(x.id) === String(taskToEdit.id));
                    if (tTarget) {
                      tTarget.txt = txt.trim();
                      tTarget.pri = pri;
                      tTarget.rep = rep;
                      tTarget.repDay = repDay;
                      tTarget.repDays = repDays;
                      tTarget.time = time || '';
                      tTarget.projectId = projectId || null;
                    }
                  } else {
                    s.tasks.push({
                      id: 'task_' + Date.now(),
                      txt: txt.trim(),
                      pri,
                      rep,
                      repDay,
                      repDays,
                      time: time || '',
                      projectId: projectId || null,
                      done: false,
                      doneDates: [],
                      createdAt: today(),
                    });
                  }
                });
                closeModal();
                AF.click();
                toast(taskToEdit ? tx.toastTaskUpdated[curLang] : tx.toastTaskCreated[curLang]);
              }}
            >
              {taskToEdit ? tx.btnSaveChanges[curLang] : tx.btnCreateOperation[curLang]}
            </button>
            {taskToEdit && (
              <>
                <button
                  type="button"
                  title={tx.btnPostponeAction[curLang]}
                  className="py-2 px-3 rounded border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    closeModal();
                    openPostponeModal(taskToEdit);
                  }}
                >
                  <CalendarClock size={13} />
                  <span>{tx.btnPostponeAction[curLang]}</span>
                </button>
                <button
                  type="button"
                  title={tx.btnArchiveTask[curLang]}
                  className="py-2 px-3 rounded border border-line bg-surface hover:bg-surface2 hover:text-amber-300 text-muted text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    closeModal();
                    requestArchiveTask(taskToEdit);
                  }}
                >
                  <Archive size={13} />
                  <span>{tx.btnArchiveTask[curLang]}</span>
                </button>
                <button
                  type="button"
                  title={tx.btnDeleteTask[curLang]}
                  className="py-2 px-3 rounded border border-danger/40 bg-danger/10 hover:bg-danger/20 text-danger text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    closeModal();
                    requestDeleteTask(taskToEdit);
                  }}
                >
                  <Trash2 size={13} />
                  <span>{tx.btnDeleteTask[curLang]}</span>
                </button>
              </>
            )}
            <button type="button" className="btn-dark py-2 px-4 text-xs font-bold" onClick={closeModal}>
              {tx.btnCancel[curLang]}
            </button>
          </div>
        </div>
      );
    };
    openModal(<TaskModalContent />);
  };

  /* MODAL: Vincular Tarefa Existente ao Projeto */
  const openLinkTaskModal = (proj) => {
    const unlinkedTasks = tasks.filter((t) => !t.archived && String(t.projectId) !== String(proj.id));

    const LinkModalContent = () => (
      <div className="text-left">
        <div className="pb-2 mb-3 border-b border-line">
          <h3 className="font-display text-xl tracking-wide text-gold">{tx.linkTaskTitle[curLang]}</h3>
          <p className="text-xs text-muted">{tx.linkTaskSub[curLang]} "{proj.title}":</p>
        </div>

        {unlinkedTasks.length > 0 ? (
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {unlinkedTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2 rounded bg-surface border border-line hover:border-gold/50 transition-colors"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <span className="text-xs font-bold text-ink block truncate">{t.txt}</span>
                  <span className="text-[10px] font-mono text-muted uppercase">
                    {t.rep || 'única'} • {t.pri || 'média'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    update((s) => {
                      const tgt = (s.tasks || []).find((x) => String(x.id) === String(t.id));
                      if (tgt) tgt.projectId = proj.id;
                    });
                    closeModal();
                    AF.click();
                    toast(tx.toastTaskLinked[curLang]);
                  }}
                  className="btn-gold py-1 px-2.5 text-[11px] font-bold flex items-center gap-1"
                >
                  <Link2 size={11} />
                  <span>{tx.linkBtn[curLang]}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-muted">
            {tx.linkAllLinked[curLang]}
          </div>
        )}

        <div className="mt-4 text-right">
          <button type="button" className="btn-dark py-1.5 px-4 text-xs font-bold" onClick={closeModal}>
            {tx.btnClose[curLang]}
          </button>
        </div>
      </div>
    );
    openModal(<LinkModalContent />);
  };

  /* MODAL: Criar / Editar Projeto (Com Início, Duração Flexível, Categoria, 3 Pilares e Mandamentos) */
  const openProjectModal = (projToEdit = null, templateData = null) => {
    const ProjModalContent = () => {
      const source = templateData || projToEdit;
      const initialCat = source?.category || (source?.cat ? source.cat.toLowerCase() : 'mind');
      const [category, setCategory] = useState(initialCat);

      const [pTitle, setPTitle] = useState(
        templateData ? (templateData.title[curLang] || templateData.title.pt) : (projToEdit ? projToEdit.title : '')
      );
      const [pDesc, setPDesc] = useState(
        templateData ? (templateData.desc[curLang] || templateData.desc.pt) : (projToEdit ? projToEdit.desc || '' : '')
      );
      const [pStart, setPStart] = useState(projToEdit ? (projToEdit.start || today()) : today());

      const initialDays = templateData?.days
        ? templateData.days
        : (projToEdit && projToEdit.start && projToEdit.deadline
            ? Math.max(1, daysBetween(projToEdit.start, projToEdit.deadline) + 1)
            : (projToEdit?.days || 30));
      const [pDays, setPDays] = useState(initialDays);

      const initialDead = projToEdit && projToEdit.deadline
        ? projToEdit.deadline
        : dstr(new Date(parseD(today()).getTime() + (Number(initialDays) - 1) * 86400000));
      const [pDeadline, setPDeadline] = useState(initialDead);
      const [tStart, setTStart] = useState(projToEdit ? (projToEdit.tStart || '') : '');
      const [tEnd, setTEnd] = useState(projToEdit ? (projToEdit.tEnd || '') : '');

      // Conexão com os 3 Pilares
      const [linkPillars, setLinkPillars] = useState(
        source?.linkPillars !== undefined ? !!source.linkPillars : true
      );

      // Mandamentos / Leis Pessoais de Conduta
      const initialCmds = source?.commandments
        ? (Array.isArray(source.commandments)
            ? source.commandments
            : (source.commandments[curLang] || source.commandments.pt || []))
        : [];
      const [commandments, setCommandments] = useState(initialCmds);
      const [newCmdTxt, setNewCmdTxt] = useState('');

      // Hábitos do guerreiro e controle de slots da Forja
      const allUserHabits = L.allH(S);
      const activeForgeIds = (S?.forge?.active || []).map(String);
      let maxSlots = 2;
      try {
        if (typeof L.slotLimit === 'function') {
          maxSlots = L.slotLimit(S);
        } else if (typeof L.maxSlots === 'function') {
          maxSlots = L.maxSlots(L.progressDays(S));
        }
      } catch {
        maxSlots = 2;
      }
      const activeCount = activeForgeIds.length;
      const isSlotsFull = activeCount >= maxSlots;

      // Hábitos Vinculados a este Projeto
      const initialHabitIds = (() => {
        if (projToEdit?.habitIds && Array.isArray(projToEdit.habitIds)) {
          return projToEdit.habitIds;
        }
        if (templateData?.habits) {
          const tplIds = templateData.habits.map((h) => h.id);
          // Prioriza estritamente os hábitos que o guerreiro já tem ativos na Forja
          const matching = tplIds.filter((id) => activeForgeIds.includes(String(id)));
          if (matching.length > 0) return matching;
          if (isSlotsFull) {
            // Se os slots já estão cheios, vincula os hábitos que já estão ativos na Forja
            return activeForgeIds.slice(0, maxSlots).map(Number);
          }
          return tplIds.slice(0, Math.max(1, maxSlots - activeCount));
        }
        // Projeto novo: sugere os hábitos ativos na Forja do usuário
        return activeForgeIds.slice(0, maxSlots).map(Number);
      })();
      const [linkedHabitIds, setLinkedHabitIds] = useState(initialHabitIds);

      // Etapas Iniciais (quando vier de template)
      const initialSteps = templateData?.steps
        ? (templateData.steps[curLang] || templateData.steps.pt || []).map((txt, idx) => ({
            id: 'st_init_' + idx + '_' + Date.now(),
            txt,
            done: false,
          }))
        : (projToEdit?.steps || []);
      const [projSteps, setProjSteps] = useState(initialSteps);

      const syncDead = (st, dy) => {
        if (st && Number(dy) >= 1) {
          const newDead = dstr(new Date(parseD(st).getTime() + (Number(dy) - 1) * 86400000));
          setPDeadline(newDead);
        }
      };

      const syncDays = (st, dl) => {
        if (st && dl) {
          const diff = daysBetween(st, dl) + 1;
          setPDays(Math.max(1, diff));
        }
      };

      const applyDurationPreset = (daysCount) => {
        setPDays(daysCount);
        if (pStart) syncDead(pStart, daysCount);
        AF.click();
      };

      // Categoria selecionada
      const activeCatObj = PROJECT_CATEGORIES.find((c) => c.id === category) || PROJECT_CATEGORIES[0];

      const addCommandment = (txtToAdd) => {
        const clean = (txtToAdd || newCmdTxt).trim();
        if (!clean) return;
        if (!commandments.includes(clean)) {
          setCommandments((prev) => [...prev, clean]);
        }
        setNewCmdTxt('');
        AF.click();
      };

      const removeCommandment = (idx) => {
        setCommandments((prev) => prev.filter((_, i) => i !== idx));
        AF.click();
      };

      const toggleHabitLink = (hId) => {
        const idStr = String(hId);
        const isAlreadyLinked = linkedHabitIds.some((x) => String(x) === idStr);
        if (isAlreadyLinked) {
          setLinkedHabitIds((prev) => prev.filter((id) => String(id) !== idStr));
          AF.click();
          return;
        }

        // Se NÃO está vinculado e não está nos hábitos ativos da Forja:
        const isActiveInForge = activeForgeIds.includes(idStr);
        if (!isActiveInForge && isSlotsFull) {
          toast(tx.toastSlotsFullCannotAdd[curLang](maxSlots));
          AF.tone(110, 0.35, 'sine', 0.18, 0, 55);
          return;
        }

        setLinkedHabitIds((prev) => [...prev, hId]);
        AF.click();
      };

      return (
        <div className="text-left max-h-[82vh] overflow-y-auto pr-1">
          <div className="pb-2 mb-3 border-b border-line flex items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-xl tracking-wide text-gold">
                {projToEdit ? tx.projModalEdit[curLang] : tx.projModalNew[curLang]}
              </h3>
              <p className="text-[11px] text-muted">
                {tx.templatesBannerDesc[curLang]}
              </p>
            </div>
            {linkPillars && (
              <span className="px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/40 text-[10px] font-mono font-bold shrink-0">
                🛡️ {L.progressDays(S)} {tx.badgePillarsStreak[curLang]}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {/* SELEÇÃO DE ÁREA / CATEGORIA */}
            <div>
              <span className="lbl mb-1 block">{tx.lblCategoryArea[curLang]}</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {PROJECT_CATEGORIES.map((cat) => {
                  const isSel = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id);
                        AF.click();
                      }}
                      className={`p-2 rounded border text-left transition-all flex items-center gap-2 cursor-pointer ${
                        isSel
                          ? 'border-gold bg-gold/15 text-gold shadow-sm'
                          : 'border-line bg-surface hover:border-gold/40 text-muted hover:text-ink'
                      }`}
                    >
                      <span className="text-base flex-none">{cat.icon}</span>
                      <span className="text-xs font-bold truncate">
                        {cat.label[curLang] || cat.label.pt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="lbl mb-1 block">{tx.lblProjTitle[curLang]}</span>
              <input
                type="text"
                placeholder={tx.phProjTitle[curLang]}
                className="field w-full text-xs sm:text-sm font-semibold"
                value={pTitle}
                onChange={(e) => setPTitle(e.target.value)}
              />
            </div>

            <div>
              <span className="lbl mb-1 block">{tx.lblProjDesc[curLang]}</span>
              <textarea
                rows={2}
                placeholder={tx.phProjDesc[curLang]}
                className="field w-full text-xs resize-none"
                value={pDesc}
                onChange={(e) => setPDesc(e.target.value)}
              />
            </div>

            {/* PACTO DOS 3 PILARES */}
            <div className={`p-2.5 rounded border transition-all ${
              linkPillars ? 'border-gold/40 bg-gold/5' : 'border-line bg-surface/60'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkPillars}
                  onChange={(e) => {
                    setLinkPillars(e.target.checked);
                    AF.click();
                  }}
                  className="mt-0.5 rounded border-line text-gold focus:ring-0 cursor-pointer"
                />
                <div>
                  <b className={`text-xs block ${linkPillars ? 'text-gold' : 'text-ink'}`}>
                    🛡️ {tx.lblPillarPact[curLang]}
                  </b>
                  <span className="text-[11px] text-muted block leading-snug">
                    {tx.chkLinkPillars[curLang]}
                  </span>
                </div>
              </label>
            </div>

            {/* CRONOGRAMA COMPLETO & ATALHOS DE DIAS */}
            <div className="rounded border border-gold/40 bg-surface2/90 p-2.5">
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-gold font-bold">
                  {tx.lblProjSchedule[curLang]}
                </span>
                {/* Atalhos Rápidos */}
                <div className="flex items-center gap-1">
                  <span className="text-[9.5px] text-muted font-mono mr-0.5">{tx.durationShortcuts[curLang]}</span>
                  {[
                    { label: '21d', val: 21 },
                    { label: '30d', val: 30 },
                    { label: '60d', val: 60 },
                    { label: '90d', val: 90 },
                    { label: '100d', val: 100 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => applyDurationPreset(p.val)}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold cursor-pointer transition-colors ${
                        Number(pDays) === p.val
                          ? 'bg-gold text-[#141414] border-gold'
                          : 'bg-surface border-line text-muted hover:text-gold hover:border-gold/40'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <div>
                  <span className="lbl mb-1 block">{tx.lblStartDate[curLang]}</span>
                  <input
                    type="date"
                    className="field w-full text-xs font-mono"
                    value={pStart}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPStart(val);
                      if (pDays) syncDead(val, pDays);
                    }}
                  />
                </div>

                <div>
                  <span className="lbl mb-1 block">{tx.lblDurationDays[curLang]}</span>
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    placeholder="Ex: 30"
                    className="field w-full text-xs font-mono font-bold text-gold"
                    value={pDays}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPDays(val);
                      if (pStart && val) syncDead(pStart, val);
                    }}
                  />
                </div>

                <div>
                  <span className="lbl mb-1 block">{tx.lblEndDate[curLang]}</span>
                  <input
                    type="date"
                    className="field w-full text-xs font-mono"
                    value={pDeadline}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPDeadline(val);
                      if (pStart && val) syncDays(pStart, val);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* MANDAMENTOS & AUTOIMAGEM */}
            <div className="rounded border border-line bg-surface p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-ink">
                  {tx.lblCommandments[curLang]}
                </span>
                <span className="text-[10px] font-mono text-muted">
                  {commandments.length} {commandments.length === 1 ? 'lei' : 'leis'}
                </span>
              </div>
              <p className="text-[10.5px] text-muted mb-2 leading-tight">
                {tx.lblCommandmentsSub[curLang]}
              </p>

              {commandments.length > 0 && (
                <div className="space-y-1 mb-2.5 max-h-36 overflow-y-auto pr-1">
                  {commandments.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 px-2 rounded bg-surface2 border border-line/60 flex items-start justify-between gap-1.5 text-xs text-amber-200/90 font-mono"
                    >
                      <span className="flex-1 leading-snug">⚔️ {cmd}</span>
                      <button
                        type="button"
                        onClick={() => removeCommandment(idx)}
                        className="text-muted hover:text-danger p-0.5 shrink-0"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Inserir novo mandamento */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder={tx.phNewCommandment[curLang]}
                  value={newCmdTxt}
                  onChange={(e) => setNewCmdTxt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCommandment();
                    }
                  }}
                  className="field flex-1 text-xs py-1 px-2"
                />
                <button
                  type="button"
                  onClick={() => addCommandment()}
                  className="btn-dark py-1 px-2.5 text-xs font-bold font-mono text-gold border-gold/30 shrink-0"
                >
                  + {tx.btnAddCommandment[curLang]}
                </button>
              </div>

              {/* Sugestões da Categoria */}
              {activeCatObj?.commandmentsSuggestions?.[curLang] && (
                <div className="mt-2 pt-2 border-t border-line/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-muted uppercase font-bold">
                      {tx.lblSuggestionsFromCategory[curLang]}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const recs = activeCatObj.commandmentsSuggestions[curLang] || [];
                        setCommandments((prev) => Array.from(new Set([...prev, ...recs])));
                        AF.click();
                      }}
                      className="text-[10px] font-mono text-gold hover:underline"
                    >
                      {tx.btnAddAllSuggestions[curLang]}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(activeCatObj.commandmentsSuggestions[curLang] || []).map((sug, i) => {
                      const already = commandments.includes(sug);
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={already}
                          onClick={() => addCommandment(sug)}
                          className={`text-[10px] font-mono text-left px-2 py-1 rounded border transition-all ${
                            already
                              ? 'bg-surface2/40 border-line/30 text-muted line-through opacity-50 cursor-not-allowed'
                              : 'bg-surface2 hover:bg-gold/10 border-line hover:border-gold/40 text-muted hover:text-gold cursor-pointer'
                          }`}
                        >
                          + {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* HÁBITOS DA FORJA ANCORADOS */}
            <div className="rounded border border-line bg-surface p-2.5">
              <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <span>⚡</span> {tx.lblHabitsInProject[curLang]}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface2 border border-line text-muted font-bold">
                  {tx.lblForgeSlotsStatus[curLang]} <b className={isSlotsFull ? 'text-amber-400' : 'text-gold'}>{activeCount}/{maxSlots >= 99 ? '∞' : maxSlots}</b>
                </span>
              </div>

              <p className="text-[10.5px] text-muted mb-2 leading-tight">
                {isSlotsFull ? tx.lblSlotsFullNotice[curLang](maxSlots) : tx.lblHabitsInProjectSub[curLang]}
              </p>

              {/* Lista dos hábitos ATIVOS na Forja */}
              {activeForgeIds.length > 0 ? (
                <div>
                  <span className="text-[10px] font-mono text-muted uppercase font-bold block mb-1">
                    {tx.lblMyActiveForgeHabits[curLang]}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {allUserHabits
                      .filter((h) => activeForgeIds.includes(String(h.id)))
                      .map((h) => {
                        const isLinked = linkedHabitIds.some((x) => String(x) === String(h.id));
                        const hName = h.n || h.name || h.title || '';
                        return (
                          <button
                            key={h.id}
                            type="button"
                            onClick={() => toggleHabitLink(h.id)}
                            className={`p-1.5 px-2 rounded border text-left text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                              isLinked
                                ? 'border-gold bg-gold/15 text-gold font-bold shadow-sm'
                                : 'border-line bg-surface2 text-muted hover:text-ink hover:border-gold/30'
                            }`}
                          >
                            <span>{h.icon || '⚡'}</span>
                            <span className="truncate flex-1 text-[11px]">{hName}</span>
                            {isLinked && <Check size={11} strokeWidth={3} className="shrink-0 text-gold" />}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-muted font-mono py-1">
                  Nenhum hábito ativo na Forja ainda.
                </div>
              )}

              {/* Se os slots NÃO estiverem cheios, exibe sugestões da categoria */}
              {!isSlotsFull && (
                <div className="mt-2 pt-2 border-t border-line/40">
                  <span className="text-[10px] font-mono text-muted uppercase font-bold block mb-1">
                    {tx.lblFreeSlotsAvailable[curLang](maxSlots - activeCount)}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(activeCatObj?.habitSuggestions || [])
                      .filter((h) => !activeForgeIds.includes(String(h.id)))
                      .map((h) => {
                        const isLinked = linkedHabitIds.some((x) => String(x) === String(h.id));
                        const hName = h.name[curLang] || h.name.pt;
                        return (
                          <button
                            key={h.id}
                            type="button"
                            onClick={() => toggleHabitLink(h.id)}
                            className={`p-1.5 px-2 rounded border text-left text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                              isLinked
                                ? 'border-gold bg-gold/15 text-gold font-bold shadow-sm'
                                : 'border-line bg-surface2 text-muted hover:text-ink hover:border-gold/30'
                            }`}
                          >
                            <span>{h.icon}</span>
                            <span className="truncate flex-1 text-[11px]">{hName}</span>
                            {isLinked && <Check size={11} strokeWidth={3} className="shrink-0 text-gold" />}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* JANELA DIÁRIA DE FOCO (OPCIONAL) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="lbl mb-1 block">{tx.lblFocusWindowStart[curLang]}</span>
                <input
                  type="time"
                  className="field w-full text-xs font-mono"
                  value={tStart}
                  onChange={(e) => setTStart(e.target.value)}
                />
              </div>

              <div>
                <span className="lbl mb-1 block">{tx.lblFocusWindowEnd[curLang]}</span>
                <input
                  type="time"
                  className="field w-full text-xs font-mono"
                  value={tEnd}
                  onChange={(e) => setTEnd(e.target.value)}
                />
              </div>
            </div>

            {/* Se estiver editando, oferece botões rápidos de tarefas */}
            {projToEdit && (
              <div className="pt-2 border-t border-line/60">
                <span className="lbl mb-1.5 block">{tx.lblQuickActions[curLang]}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      setTimeout(() => openTaskModal(null, projToEdit.id), 150);
                    }}
                    className="btn-dark py-1.5 px-2.5 text-xs font-bold flex-1 flex items-center justify-center gap-1 border-gold/40 text-gold"
                  >
                    <Plus size={12} />
                    <span>{tx.btnNewTaskInProj[curLang]}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      setTimeout(() => openLinkTaskModal(projToEdit), 150);
                    }}
                    className="btn-dark py-1.5 px-2.5 text-xs font-bold flex-1 flex items-center justify-center gap-1"
                  >
                    <Link2 size={12} />
                    <span>{tx.btnLinkExistingTask[curLang]}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2 pt-2 border-t border-line">
            <button
              type="button"
              className="btn-gold flex-1 py-2 text-xs font-bold"
              onClick={() => {
                if (!pTitle.trim()) return toast(tx.toastEnterProjTitle[curLang]);
                update((s) => {
                  s.projects = s.projects || [];
                  if (projToEdit) {
                    const pTarget = s.projects.find((p) => String(p.id) === String(projToEdit.id));
                    if (pTarget) {
                      pTarget.title = pTitle.trim();
                      pTarget.desc = pDesc.trim();
                      pTarget.category = category;
                      pTarget.linkPillars = linkPillars;
                      pTarget.commandments = commandments;
                      pTarget.habitIds = linkedHabitIds;
                      pTarget.start = pStart || today();
                      pTarget.days = Number(pDays) || 30;
                      pTarget.deadline = pDeadline || '';
                      pTarget.tStart = tStart || '';
                      pTarget.tEnd = tEnd || '';
                    }
                  } else {
                    s.projects.push({
                      id: 'proj_' + Date.now(),
                      title: pTitle.trim(),
                      desc: pDesc.trim(),
                      category,
                      linkPillars,
                      commandments,
                      habitIds: linkedHabitIds,
                      start: pStart || today(),
                      days: Number(pDays) || 30,
                      deadline: pDeadline || '',
                      tStart: tStart || '',
                      tEnd: tEnd || '',
                      status: 'ativo',
                      archived: false,
                      steps: projSteps,
                      createdAt: today(),
                    });
                  }
                });
                closeModal();
                AF.click();
                toast(projToEdit ? tx.toastProjUpdated[curLang] : tx.toastProjCreated[curLang]);
              }}
            >
              {projToEdit ? tx.btnSaveProj[curLang] : tx.btnCreateProj[curLang]}
            </button>
            <button type="button" className="btn-dark py-2 px-4 text-xs font-bold" onClick={closeModal}>
              {tx.btnCancel[curLang]}
            </button>
          </div>
        </div>
      );
    };
    openModal(<ProjModalContent />);
  };

  /* Toggle Tarefa */
  const toggleTask = (id) => {
    update((s) => {
      const target = (s.tasks || []).find((x) => String(x.id) === String(id));
      if (!target) return;
      const dd = today();
      target.doneDates = target.doneDates || [];
      if ((target.rep || 'unica') === 'unica') {
        target.done = !target.done;
        if (target.done) {
          if (!target.doneDates.includes(dd)) {
            target.doneDates.push(dd);
            target.doneDates.sort();
          }
        } else {
          const i = target.doneDates.indexOf(dd);
          if (i >= 0) target.doneDates.splice(i, 1);
        }
      } else {
        const i = target.doneDates.indexOf(dd);
        if (i >= 0) {
          target.doneDates.splice(i, 1);
          target.done = false;
        } else {
          target.doneDates.push(dd);
          target.doneDates.sort();
          target.done = true;
        }
      }
    });
    AF.click();
  };

  /* MODAL: Análise Estratégica Completa da Tarefa / Operação */
  const openTaskAnalysisModal = (taskItem) => {
    const TaskAnalysisModalContent = () => {
      const liveTask = (S?.tasks || []).find((x) => String(x.id) === String(taskItem.id)) || taskItem;
      const tod = today();
      const isDoneToday = L.isDone(liveTask, tod);

      const streak = getTaskStreak(liveTask);
      const totalDone = getTaskTotalDone(liveTask);
      const consistency = getTaskConsistency(liveTask, 30);

      const parentProj = (S?.projects || []).find(
        (p) => String(p.id) === String(liveTask.projectId || liveTask.proj)
      );

      // Meta e contribuição no projeto
      const projDuration = parentProj?.days
        ? Number(parentProj.days)
        : (parentProj?.start && parentProj?.deadline
            ? Math.max(1, daysBetween(parentProj.start, parentProj.deadline) + 1)
            : 30);

      const completedInProj = (liveTask.doneDates || []).length || (liveTask.done ? 1 : 0);
      let targetDaysInProj = projDuration;
      if (liveTask.rep === 'dias_uteis') targetDaysInProj = Math.max(1, Math.round((projDuration * 5) / 7));
      else if (liveTask.rep === 'fds') targetDaysInProj = Math.max(1, Math.round((projDuration * 2) / 7));
      else if (liveTask.rep === 'semanal') targetDaysInProj = Math.max(1, Math.round(projDuration / 7));
      else if (liveTask.rep === 'custom') targetDaysInProj = Math.max(1, Math.round((projDuration * (liveTask.repDays?.length || 1)) / 7));
      else if (liveTask.rep === 'unica') targetDaysInProj = 1;

      const projContribPct = Math.min(100, Math.round((completedInProj / targetDaysInProj) * 100));

      // Heatmap dos últimos 14 dias
      const past14Days = [];
      const todayMs = parseD(tod).getTime();
      const dayNamesShort = curLang === 'en'
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : curLang === 'es'
        ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
        : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

      for (let i = 13; i >= 0; i--) {
        const d = new Date(todayMs - i * 86400000);
        const ds = dstr(d);
        const doneOnDay = (liveTask.doneDates || []).includes(ds) || (ds === tod && liveTask.done);
        const dueOnDay = L.repDue(liveTask, ds);
        const isCurrentDay = ds === tod;
        past14Days.push({
          dateStr: ds,
          dayNum: d.getDate(),
          weekDayShort: dayNamesShort[d.getDay()],
          isDone: doneOnDay,
          isDue: dueOnDay,
          isToday: isCurrentDay,
        });
      }

      const toggleDateInHistory = (targetDateStr) => {
        update((s) => {
          const t = (s.tasks || []).find((x) => String(x.id) === String(liveTask.id));
          if (!t) return;
          if ((t.rep || 'unica') === 'unica') {
            t.done = !t.done;
            if (t.done) t.doneDates = [targetDateStr];
            else t.doneDates = [];
          } else {
            t.doneDates = t.doneDates || [];
            const idx = t.doneDates.indexOf(targetDateStr);
            if (idx >= 0) {
              t.doneDates.splice(idx, 1);
              if (targetDateStr === tod) t.done = false;
            } else {
              t.doneDates.push(targetDateStr);
              t.doneDates.sort();
              if (targetDateStr === tod) t.done = true;
            }
          }
        });
        AF.click();
      };

      const sortedDoneDates = Array.from(new Set(liveTask.doneDates || []))
        .sort()
        .reverse();

      return (
        <div className="text-left max-h-[85vh] overflow-y-auto pr-1">
          {/* Topo do Modal de Análise */}
          <div className="pb-2.5 mb-3 border-b border-line flex items-start justify-between gap-3 pr-8">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-gold/15 border border-gold/40 text-gold flex-none">
                <BarChart2 size={22} className="text-gold" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-gold font-extrabold uppercase tracking-wider block">
                  {tx.taskAnalysisTitle[curLang]}
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-ink leading-tight truncate">
                  {liveTask.txt}
                </h3>
              </div>
            </div>
          </div>

          {/* Cards de Métricas Principais (4 KPIs em Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
            {/* KPI 1: Total de Conclusões */}
            <div className="p-2.5 rounded-xl border border-line/60 bg-surface/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted text-[10px] font-mono mb-1">
                <span>{tx.lblTotalExecutions[curLang]}</span>
                <span>🏆</span>
              </div>
              <div>
                <b className="font-display text-2xl text-gold block leading-none">{totalDone}</b>
                <span className="text-[9.5px] text-muted font-mono block mt-1">
                  {tx.subCumulativeHistory[curLang]}
                </span>
              </div>
            </div>

            {/* KPI 2: Sequência Ativa */}
            <div className="p-2.5 rounded-xl border border-gold/30 bg-gold/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gold text-[10px] font-mono mb-1 font-bold">
                <span>{tx.lblCurrentStreak[curLang]}</span>
                <span>🔥</span>
              </div>
              <div>
                <b className="font-display text-2xl text-gold block leading-none">{streak}</b>
                <span className="text-[9.5px] text-gold2 font-mono block mt-1">
                  {tx.subConsecutiveDays[curLang]}
                </span>
              </div>
            </div>

            {/* KPI 3: Taxa de Consistência */}
            <div className="p-2.5 rounded-xl border border-line/60 bg-surface/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted text-[10px] font-mono mb-1">
                <span>{tx.lblConsistencyRate[curLang]}</span>
                <span>📈</span>
              </div>
              <div>
                <b className="font-display text-2xl text-ink block leading-none">{consistency}%</b>
                <span className="text-[9.5px] text-muted font-mono block mt-1">
                  {tx.subLast30Days[curLang]}
                </span>
              </div>
            </div>

            {/* KPI 4: Contribuição no Projeto */}
            <div className="p-2.5 rounded-xl border border-line/60 bg-surface/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted text-[10px] font-mono mb-1">
                <span>{parentProj ? tx.lblProjectContribution[curLang] : tx.lblIndependentTask[curLang]}</span>
                <span>📁</span>
              </div>
              <div>
                {parentProj ? (
                  <>
                    <b className="font-display text-2xl text-gold block leading-none">{projContribPct}%</b>
                    <span className="text-[9.5px] text-muted font-mono block mt-1 truncate">
                      {completedInProj}/{targetDaysInProj} {tx.lblExecutionsOrDays[curLang]}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-bold text-muted block leading-none mt-1">
                      {tx.lblIndependentTask[curLang]}
                    </span>
                    <span className="text-[9.5px] text-muted font-mono block mt-1">
                      {tx.subNoLinkedProject[curLang]}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Barra de Status de Hoje & Ação Imediata */}
          <div className="mb-3.5">
            <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
              isDoneToday
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : 'border-gold/40 bg-gold/10'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-none ${
                  isDoneToday ? 'bg-emerald-500 text-black font-bold' : 'bg-gold/20 text-gold'
                }`}>
                  {isDoneToday ? <Check size={18} strokeWidth={3} /> : <Clock size={16} />}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold block truncate text-ink">
                    {isDoneToday ? tx.badgeDoneTodayHonored[curLang] : tx.badgePendingToday[curLang]}
                  </span>
                  <span className="text-[10px] font-mono text-muted block truncate">
                    {fmtD(tod)} · {liveTask.time || '--:--'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleTask(liveTask.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer flex-none ${
                  isDoneToday
                    ? 'border border-line bg-surface text-muted hover:text-danger hover:border-danger/40'
                    : 'btn-gold shadow-sm'
                }`}
              >
                {isDoneToday ? tx.btnUnmarkToday[curLang] : tx.btnMarkDoneNow[curLang]}
              </button>
            </div>
          </div>

          {/* Calendário / Heatmap Interativo dos Últimos 14 Dias */}
          <div className="p-3 rounded-xl border border-line bg-surface2/60 mb-3.5">
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Calendar size={13} className="text-gold" />
                <span>{tx.lblHeatmap14Days[curLang]}</span>
              </span>
              <span className="text-[9.5px] font-mono text-muted">
                {tx.lblHeatmapTip[curLang]}
              </span>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 mt-2">
              {past14Days.map((day) => {
                return (
                  <button
                    key={day.dateStr}
                    type="button"
                    onClick={() => toggleDateInHistory(day.dateStr)}
                    className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[48px] ${
                      day.isDone
                        ? 'border-gold bg-gold/20 text-gold shadow-sm'
                        : day.isToday
                        ? 'border-gold/70 bg-surface text-ink ring-2 ring-gold/30'
                        : day.isDue
                        ? 'border-line/60 bg-surface/40 text-muted hover:border-gold/40 hover:text-ink'
                        : 'border-line/30 bg-surface/20 text-muted/50'
                    }`}
                    title={`${day.dateStr}: ${day.isDone ? 'Concluída ✓' : 'Pendente'}`}
                  >
                    <span className="text-[9px] font-mono uppercase block">{day.weekDayShort}</span>
                    <b className="text-xs font-mono block leading-none my-0.5">{day.dayNum}</b>
                    <span className="text-[10px] block leading-none">
                      {day.isDone ? '✓' : day.isToday ? '⏳' : '·'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Histórico Recente de Datas Cumpridas */}
          <div className="p-3 rounded-xl border border-line bg-surface2/60 mb-3.5">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5 mb-2">
              <Sparkles size={13} className="text-gold" />
              <span>{tx.lblCompletedDatesList[curLang]} ({sortedDoneDates.length})</span>
            </span>

            {sortedDoneDates.length > 0 ? (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {sortedDoneDates.map((ds) => {
                  const isTod = ds === tod;
                  return (
                    <div
                      key={ds}
                      className="p-1.5 px-2.5 rounded-lg border border-line/60 bg-surface/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span className="font-mono text-ink font-bold">
                          {fmtD(ds)}
                        </span>
                      </div>
                      {isTod && (
                        <span className="text-[9.5px] text-gold font-bold bg-gold/10 px-1.5 py-0.2 rounded border border-gold/30">
                          {tx.lblTodayBadge[curLang]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted leading-relaxed">
                {tx.noCompletionsYet[curLang]}
              </p>
            )}
          </div>

          {/* Ficha Técnica & Atalhos */}
          <div className="p-2.5 rounded-xl border border-line/60 bg-surface/40 mb-3 text-[11px] font-mono space-y-1 text-muted">
            <div className="flex items-center justify-between">
              <span>{tx.lblPriority[curLang]}</span>
              <b className="uppercase text-ink">{liveTask.pri}</b>
            </div>
            <div className="flex items-center justify-between">
              <span>{tx.lblFrequency[curLang]}</span>
              <b className="text-ink">{formatRepLabel(liveTask) || 'Única'}</b>
            </div>
            {parentProj && (
              <div className="flex items-center justify-between">
                <span>{tx.lblLinkProject[curLang]}</span>
                <b className="text-gold truncate max-w-[180px]">{parentProj.title}</b>
              </div>
            )}
            {liveTask.createdAt && (
              <div className="flex items-center justify-between">
                <span>{tx.lblCreatedOn[curLang]}</span>
                <span className="text-muted">{fmtD(liveTask.createdAt)}</span>
              </div>
            )}
          </div>

          {/* Botões Finais de Ação */}
          <div className="flex gap-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={() => {
                closeModal();
                setTimeout(() => openTaskModal(liveTask), 100);
              }}
              className="btn-dark py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 flex-1 cursor-pointer"
            >
              <Edit3 size={13} />
              <span>{tx.editTaskTitle[curLang]}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                closeModal();
                setTimeout(() => openPostponeModal(liveTask), 100);
              }}
              className="btn-dark py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 flex-1 cursor-pointer border-amber-500/40 text-amber-400"
            >
              <CalendarClock size={13} />
              <span>{tx.btnPostponeAction[curLang]}</span>
            </button>

            <button
              type="button"
              onClick={closeModal}
              className="btn-gold py-2 px-4 text-xs font-bold cursor-pointer"
            >
              {tx.btnFinishAnalysis[curLang]}
            </button>
          </div>
        </div>
      );
    };

    openModal(<TaskAnalysisModalContent />);
  };

  /* MODAL: Adiar Operação */
  const openPostponeModal = (task) => {
    const PostponeModalContent = () => {
      const tod = today();
      const addDaysStr = (n) => dstr(new Date(parseD(tod).getTime() + n * 86400000));
      const minDate = addDaysStr(1);
      const [chosenDate, setChosenDate] = useState(task.postponedTo || minDate);

      const applyPostpone = (dateStr) => {
        if (!dateStr) return;
        update((s) => {
          const t = (s.tasks || []).find((x) => String(x.id) === String(task.id));
          if (t) {
            t.postponedTo = dateStr;
            t.postponed = true;
            t.postponedAt = tod;
          }
        });
        closeModal();
        AF.click();
        toast(`${tx.toastPostponed[curLang]} (${fmtD(dateStr)})`);
      };

      const removePostpone = () => {
        update((s) => {
          const t = (s.tasks || []).find((x) => String(x.id) === String(task.id));
          if (t) {
            delete t.postponedTo;
            delete t.postponed;
            delete t.postponedAt;
          }
        });
        closeModal();
        AF.click();
        toast(tx.toastPostponeRemoved[curLang]);
      };

      return (
        <div className="text-left">
          <div className="pb-2 mb-3 border-b border-line">
            <div className="flex items-center gap-2 text-gold">
              <CalendarClock size={20} />
              <h3 className="font-display text-lg sm:text-xl tracking-wide">
                {tx.postponeModalTitle[curLang]}
              </h3>
            </div>
            <p className="text-xs text-muted mt-1 truncate">
              {task.txt}
            </p>
          </div>

          <p className="text-xs text-muted mb-3 leading-relaxed">
            {tx.postponeModalDesc[curLang]}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              className="p-2.5 rounded border border-line bg-surface hover:border-gold hover:text-gold text-xs font-mono font-bold flex flex-col items-center justify-center gap-0.5 transition-all text-center cursor-pointer"
              onClick={() => applyPostpone(addDaysStr(1))}
            >
              <span className="text-ink">{tx.postponePlus1[curLang]}</span>
              <span className="text-[10px] text-muted">{fmtD(addDaysStr(1))}</span>
            </button>
            <button
              type="button"
              className="p-2.5 rounded border border-line bg-surface hover:border-gold hover:text-gold text-xs font-mono font-bold flex flex-col items-center justify-center gap-0.5 transition-all text-center cursor-pointer"
              onClick={() => applyPostpone(addDaysStr(2))}
            >
              <span className="text-ink">{tx.postponePlus2[curLang]}</span>
              <span className="text-[10px] text-muted">{fmtD(addDaysStr(2))}</span>
            </button>
            <button
              type="button"
              className="p-2.5 rounded border border-line bg-surface hover:border-gold hover:text-gold text-xs font-mono font-bold flex flex-col items-center justify-center gap-0.5 transition-all text-center cursor-pointer"
              onClick={() => applyPostpone(addDaysStr(3))}
            >
              <span className="text-ink">{tx.postponePlus3[curLang]}</span>
              <span className="text-[10px] text-muted">{fmtD(addDaysStr(3))}</span>
            </button>
            <button
              type="button"
              className="p-2.5 rounded border border-line bg-surface hover:border-gold hover:text-gold text-xs font-mono font-bold flex flex-col items-center justify-center gap-0.5 transition-all text-center cursor-pointer"
              onClick={() => applyPostpone(addDaysStr(7))}
            >
              <span className="text-ink">{tx.postponePlus7[curLang]}</span>
              <span className="text-[10px] text-muted">{fmtD(addDaysStr(7))}</span>
            </button>
          </div>

          <div className="p-2.5 rounded bg-surface2 border border-line/60 mb-3">
            <span className="lbl mb-1.5 block text-xs">
              {tx.postponeCustomDate[curLang]}
            </span>
            <div className="flex gap-2">
              <input
                type="date"
                min={minDate}
                value={chosenDate}
                onChange={(e) => setChosenDate(e.target.value)}
                className="field flex-1 text-xs font-mono"
              />
              <button
                type="button"
                className="btn-gold px-3 text-xs font-bold font-mono"
                onClick={() => applyPostpone(chosenDate)}
              >
                {tx.btnPostponeConfirm[curLang]}
              </button>
            </div>
          </div>

          {task.postponedTo && (
            <div className="mb-3 p-2 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
              <span className="text-xs text-amber-400 font-mono">
                {tx.badgePostponed[curLang]}: <b>{fmtD(task.postponedTo)}</b>
              </span>
              <button
                type="button"
                className="text-[11px] font-bold text-danger hover:underline font-mono"
                onClick={removePostpone}
              >
                {tx.btnPostponeRemove[curLang]}
              </button>
            </div>
          )}

          <div className="mt-2 text-right">
            <button type="button" className="btn-dark py-1.5 px-4 text-xs font-bold" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </div>
      );
    };
    openModal(<PostponeModalContent />);
  };

  /* Excluir Tarefa com Confirmação */
  const requestDeleteTask = (task) => {
    confirmAction({
      title: tx.delTaskTitle[curLang],
      message: `${tx.delTaskConfirmMsg[curLang]} "${task.txt}"?`,
      danger: true,
      confirmText: tx.btnDeleteConfirm[curLang],
      onConfirm: () => {
        update((s) => {
          s.tasks = (s.tasks || []).filter((x) => String(x.id) !== String(task.id));
        });
        AF.click();
        toast(tx.toastTaskDeleted[curLang]);
      },
    });
  };

  /* Arquivar Tarefa com Confirmação */
  const requestArchiveTask = (task) => {
    confirmAction({
      title: tx.archiveTaskTitle[curLang],
      message: `${tx.archiveTaskConfirmMsg[curLang]} "${task.txt}"?`,
      danger: false,
      confirmText: tx.btnArchiveConfirm[curLang],
      onConfirm: () => {
        update((s) => {
          const target = (s.tasks || []).find((x) => String(x.id) === String(task.id));
          if (target) {
            target.archived = true;
          }
        });
        AF.click();
        toast(tx.toastTaskArchived[curLang]);
      },
    });
  };

  /* ARQUIVAR PROJETO COM ESCOLHA DE TAREFAS */
  const requestArchiveProject = (proj) => {
    const isArch = proj.archived;
    const isLinked = (t) => String(t.projectId) === String(proj.id) || String(t.proj) === String(proj.id);
    const linkedTasks = tasks.filter((t) => isLinked(t));

    if (isArch) {
      // Desarquivar
      confirmAction({
        title: tx.unarchiveProjTitle[curLang],
        message: `${tx.unarchiveProjConfirmMsg[curLang]} "${proj.title}"?`,
        confirmText: tx.btnUnarchiveConfirm[curLang],
        onConfirm: () => {
          update((s) => {
            const p = (s.projects || []).find((x) => String(x.id) === String(proj.id));
            if (p) p.archived = false;
            (s.tasks || []).forEach((t) => {
              if (String(t.projectId) === String(proj.id) || String(t.proj) === String(proj.id)) {
                t.archived = false;
              }
            });
          });
          AF.click();
          toast(tx.toastProjUnarchived[curLang]);
        },
      });
      return;
    }

    // Modal especial para arquivar com escolha de tarefas
    const ArchiveModalChoice = () => (
      <div className="text-center p-1">
        <div className="w-12 h-12 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center mx-auto mb-3 text-gold">
          <Archive size={24} />
        </div>
        <h3 className="font-display text-xl tracking-wide text-ink mb-1.5">{tx.archiveProjChoiceTitle[curLang]}</h3>
        <p className="text-xs text-muted leading-relaxed mb-4">
          {tx.archiveProjChoiceDesc[curLang](proj.title, linkedTasks.length)}
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="btn-gold py-2 text-xs font-bold font-mono"
            onClick={() => {
              update((s) => {
                const p = (s.projects || []).find((x) => String(x.id) === String(proj.id));
                if (p) p.archived = true;
                (s.tasks || []).forEach((t) => {
                  if (String(t.projectId) === String(proj.id) || String(t.proj) === String(proj.id)) {
                    t.archived = true;
                  }
                });
              });
              closeModal();
              AF.click();
              toast(tx.toastProjTasksArchived[curLang]);
            }}
          >
            {tx.btnArchiveProjAndTasks[curLang]}
          </button>
          <button
            type="button"
            className="btn-dark py-2 text-xs font-bold font-mono border-line"
            onClick={() => {
              update((s) => {
                const p = (s.projects || []).find((x) => String(x.id) === String(proj.id));
                if (p) p.archived = true;
                (s.tasks || []).forEach((t) => {
                  if (String(t.projectId) === String(proj.id) || String(t.proj) === String(proj.id)) {
                    t.projectId = null;
                    t.proj = null;
                    t.archived = false;
                  }
                });
              });
              closeModal();
              AF.click();
              toast(tx.toastProjArchivedOnly[curLang]);
            }}
          >
            {tx.btnArchiveProjOnly[curLang]}
          </button>
          <button
            type="button"
            className="btn-dark py-1.5 px-4 text-xs font-bold text-muted hover:text-ink mt-1"
            onClick={closeModal}
          >
            {tx.btnCancel[curLang]}
          </button>
        </div>
      </div>
    );
    openModal(<ArchiveModalChoice />);
  };

  /* EXCLUIR PROJETO COM ESCOLHA DE TAREFAS */
  const requestDeleteProject = (proj) => {
    const isLinked = (t) => String(t.projectId) === String(proj.id) || String(t.proj) === String(proj.id);
    const linkedTasks = tasks.filter((t) => isLinked(t));

    const DeleteModalChoice = () => (
      <div className="text-center p-1">
        <div className="w-12 h-12 rounded-full border border-danger/40 bg-danger/10 flex items-center justify-center mx-auto mb-3 text-danger">
          <AlertTriangle size={24} />
        </div>
        <h3 className="font-display text-xl tracking-wide text-danger mb-1.5">{tx.delProjChoiceTitle[curLang]}</h3>
        <p className="text-xs text-muted leading-relaxed mb-4">
          {tx.delProjChoiceDesc[curLang](proj.title, linkedTasks.length)}
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="bg-danger text-white hover:bg-danger/90 py-2 rounded text-xs font-bold font-mono"
            onClick={() => {
              update((s) => {
                s.projects = (s.projects || []).filter((p) => String(p.id) !== String(proj.id));
                s.tasks = (s.tasks || []).filter((t) => !isLinked(t));
              });
              closeModal();
              AF.click();
              toast(tx.toastProjTasksDeleted[curLang]);
            }}
          >
            {tx.btnDelProjAndTasks[curLang]}
          </button>
          <button
            type="button"
            className="btn-gold py-2 text-xs font-bold font-mono"
            onClick={() => {
              update((s) => {
                s.projects = (s.projects || []).filter((p) => String(p.id) !== String(proj.id));
                (s.tasks || []).forEach((t) => {
                  if (isLinked(t)) {
                    t.projectId = null;
                    t.proj = null;
                  }
                });
              });
              closeModal();
              AF.click();
              toast(tx.toastProjDeletedOnly[curLang]);
            }}
          >
            {tx.btnDelProjOnly[curLang]}
          </button>
          <button
            type="button"
            className="btn-dark py-1.5 px-4 text-xs font-bold text-muted hover:text-ink mt-1"
            onClick={closeModal}
          >
            {tx.btnCancel[curLang]}
          </button>
        </div>
      </div>
    );
    openModal(<DeleteModalChoice />);
  };

  /* Desvincular Tarefa de Projeto */
  const unlinkTask = (taskId) => {
    update((s) => {
      const t = (s.tasks || []).find((x) => String(x.id) === String(taskId));
      if (t) {
        t.projectId = null;
        t.proj = null;
      }
    });
    AF.click();
    toast(tx.toastTaskUnlinked[curLang]);
  };

  /* Concluir / Reabrir Projeto */
  const toggleProjectStatus = (proj) => {
    const isComp = proj.status === 'concluido';
    confirmAction({
      title: isComp ? tx.reopenProjTitle[curLang] : tx.completeProjTitle[curLang],
      message: isComp
        ? `${tx.reopenProjConfirmMsg[curLang]} "${proj.title}"?`
        : `${tx.completeProjConfirmMsg[curLang]} "${proj.title}"?`,
      confirmText: isComp ? tx.btnReopen[curLang] : tx.btnCompleteMission[curLang],
      onConfirm: () => {
        update((s) => {
          const p = (s.projects || []).find((x) => String(x.id) === String(proj.id));
          if (p) p.status = isComp ? 'ativo' : 'concluido';
        });
        AF.click();
        toast(isComp ? tx.toastProjReopened[curLang] : tx.toastProjCompleted[curLang]);
      },
    });
  };

  /* Etapas de Projeto */
  const addStepToProject = (pId, stepTxt) => {
    if (!stepTxt.trim()) return;
    update((s) => {
      const p = (s.projects || []).find((x) => String(x.id) === String(pId));
      if (p) {
        p.steps = p.steps || [];
        p.steps.push({ id: 'step_' + Date.now(), txt: stepTxt.trim(), done: false });
      }
    });
    AF.click();
  };

  const toggleStep = (pId, stepId) => {
    update((s) => {
      const p = (s.projects || []).find((x) => String(x.id) === String(pId));
      if (p && p.steps) {
        const st = p.steps.find((x) => String(x.id) === String(stepId));
        if (st) st.done = !st.done;
      }
    });
    AF.click();
  };

  /* Filtros de Tarefas */
  const displayedTasks = tasks.filter((x) => {
    if (!isTaskActive(x)) return false;
    const isDone = L.isDone(x, today());
    if (filter === 'done') return isDone;
    if (filter === 'postponed') return !isDone && L.isTaskPostponed(x);
    if (filter === 'today') return L.repDue(x, today()) && !isDone;
    return true;
  });

  /* Filtros de Projetos */
  const displayedProjects = projects.filter((p) => {
    if (projFilter === 'arquivados') return p.archived;
    if (p.archived) return false;
    if (projFilter === 'concluidos') return p.status === 'concluido';
    return p.status !== 'concluido';
  });

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-x-hidden pb-16">
      {/* SELETOR DE CATEGORIAS RESPONSIVO */}
      <div className="w-full max-w-full min-w-0 p-1 rounded-xl bg-surface2/80 border border-line/80 flex items-center gap-1 sm:gap-2">
        {OPS_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeMainTab === cat.id;
          const count = cat.id === 'tasks'
            ? tasks.filter((t) => isTaskActive(t)).length
            : cat.id === 'projects'
            ? projects.filter((p) => !p.archived).length
            : projects.filter((p) => p.archived).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                AF.click();
                setActiveMainTab(cat.id);
              }}
              className={`flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg text-xs font-bold transition-all select-none cursor-pointer ${
                isSelected
                  ? 'bg-gold text-[#141414] shadow-sm font-extrabold'
                  : 'text-muted hover:text-ink hover:bg-surface/50'
              }`}
            >
              <Icon size={13} className="shrink-0" />
              <span className="sm:hidden truncate text-[10.5px]">
                {cat.labelShort[curLang] || cat.labelShort.pt}
              </span>
              <span className="hidden sm:inline whitespace-nowrap">
                {cat.labelFull[curLang] || cat.labelFull.pt}
              </span>
              <span className={`text-[9px] sm:text-[9.5px] px-1 sm:px-1.5 py-0.2 rounded font-mono font-bold shrink-0 ${
                isSelected ? 'bg-black/20 text-black' : 'bg-surface text-gold'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de Ação de Operações */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full min-w-0">
        {activeMainTab === 'tasks' && (
          <div className="flex items-center justify-between w-full min-w-0 gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-gold/30 flex items-center justify-center bg-gold/5 font-mono text-[9px] sm:text-[10px] font-bold text-gold shrink-0">
                {pct}%
              </div>
              <span className="text-[10.5px] sm:text-xs font-mono text-muted truncate">
                {completedToday}/{todayTasks.length} <span className="hidden sm:inline">{tx.progress[curLang]}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => openTaskModal()}
              className="btn-gold py-1.5 px-2.5 sm:px-3 text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm shrink-0 whitespace-nowrap cursor-pointer"
            >
              <Plus size={13} strokeWidth={2.5} className="shrink-0" />
              <span className="hidden sm:inline">{tx.newTask[curLang]}</span>
              <span className="sm:hidden">{tx.newTaskShort[curLang]}</span>
            </button>
          </div>
        )}

        {activeMainTab === 'projects' && (
          <div className="flex items-center justify-between w-full min-w-0 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setShowTemplates((prev) => !prev);
                AF.click();
              }}
              className={`py-1.5 px-2 sm:px-3 text-xs font-mono font-bold rounded border transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink min-w-0 ${
                showTemplates
                  ? 'border-gold bg-gold/20 text-gold shadow-sm'
                  : 'border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold'
              }`}
            >
              <Sparkles size={13} className="text-gold shrink-0" />
              <span className="hidden sm:inline">{showTemplates ? tx.btnHideTemplates[curLang] : tx.btnExploreTemplates[curLang]}</span>
              <span className="sm:hidden truncate">{showTemplates ? tx.btnHideTemplatesShort[curLang] : tx.btnExploreTemplatesShort[curLang]}</span>
              {showTemplates ? <ChevronUp size={12} className="shrink-0" /> : <ChevronDown size={12} className="shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => openProjectModal()}
              className="btn-gold py-1.5 px-2.5 sm:px-3 text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm shrink-0 whitespace-nowrap cursor-pointer"
            >
              <Plus size={13} strokeWidth={2.5} className="shrink-0" />
              <span className="hidden sm:inline">{tx.newProject[curLang]}</span>
              <span className="sm:hidden">{tx.newProjectShort[curLang]}</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. ABA DE TAREFAS */}
      {activeMainTab === 'tasks' && (
        <div id="tour-ops-tasks" className="flex flex-col gap-3 w-full max-w-full min-w-0">
          {/* Sub-filtros de Tarefas Responsivos em Tela Cheia */}
          <div className="grid grid-cols-4 gap-1 sm:flex sm:items-center sm:gap-1.5 w-full">
            {[
              { id: 'today', labelShort: tx.filterToday.short[curLang], labelFull: tx.filterToday[curLang], count: todayTasks.filter((x) => !L.isDone(x, today())).length },
              { id: 'all', labelShort: tx.filterAll.short[curLang], labelFull: tx.filterAll[curLang], count: tasks.filter((t) => isTaskActive(t)).length },
              { id: 'postponed', labelShort: tx.filterPostponed.short[curLang], labelFull: tx.filterPostponed[curLang], count: tasks.filter((t) => isTaskActive(t) && !L.isDone(t, today()) && L.isTaskPostponed(t)).length },
              { id: 'done', labelShort: tx.filterDone.short[curLang], labelFull: tx.filterDone[curLang], count: tasks.filter((x) => isTaskActive(x) && L.isDone(x, today())).length },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`w-full sm:w-auto text-[10px] sm:text-xs font-mono px-1 sm:px-3 py-1.5 rounded transition-all flex items-center justify-center gap-0.5 sm:gap-1.5 cursor-pointer whitespace-nowrap select-none ${
                  filter === f.id
                    ? 'bg-gold text-[#141414] font-bold shadow-sm'
                    : 'bg-surface2 text-muted hover:text-ink border border-line'
                }`}
              >
                <span className="sm:hidden truncate">{f.labelShort}</span>
                <span className="hidden sm:inline">{f.labelFull}</span>
                <span className={`text-[8.5px] sm:text-[9.5px] px-1 sm:px-1.5 py-0.2 rounded shrink-0 ${filter === f.id ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {displayedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
              {displayedTasks.map((tItem) => {
                const isDone = L.isDone(tItem, today());
                const isPostponed = L.isTaskPostponed(tItem);
                const isOverdue = L.isTaskOverdue(tItem);
                const streak = getTaskStreak(tItem);
                const totalDone = getTaskTotalDone(tItem);
                const priColor = {
                  alta: 'border-danger/40 bg-danger/5 text-danger',
                  media: 'border-gold/40 bg-gold/5 text-gold',
                  baixa: 'border-line bg-surface text-muted',
                }[tItem.pri] || 'border-line text-muted';
                const parentProj = projects.find((p) => String(p.id) === String(tItem.projectId || tItem.proj));

                return (
                  <Card
                    key={tItem.id}
                    className={`flex items-center justify-between gap-2.5 p-3 sm:p-3.5 border transition-all w-full ${
                      isDone
                        ? 'border-line/40 bg-surface/50 opacity-60'
                        : isPostponed
                        ? 'border-amber-500/40 bg-surface2/90 hover:border-amber-500/70'
                        : isOverdue
                        ? 'border-danger/40 bg-surface2/90 hover:border-danger/70'
                        : 'border-line bg-surface2/80 hover:border-gold/40'
                    }`}
                  >
                    <div
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                      onClick={() => toggleTask(tItem.id)}
                    >
                      <button
                        type="button"
                        className={`w-5 h-5 rounded flex-none flex items-center justify-center border transition-colors ${
                          isDone
                            ? 'border-gold bg-gold text-[#141414]'
                            : 'border-[#3c3c46] bg-surface hover:border-gold'
                        }`}
                      >
                        {isDone && <Check size={13} strokeWidth={3} />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <span className={`text-xs sm:text-[13px] font-semibold block truncate ${isDone ? 'line-through text-muted' : 'text-ink'}`}>
                          {tItem.txt}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[9.5px] font-mono text-muted flex-wrap">
                          <span className={`px-1.5 py-0.2 rounded border font-bold uppercase ${priColor}`}>
                            {tItem.pri}
                          </span>
                          {isPostponed && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                              <CalendarClock size={10} />
                              <span>{tx.badgePostponed[curLang]} ({fmtD(tItem.postponedTo)})</span>
                            </span>
                          )}
                          {isOverdue && !isPostponed && (
                            <span className="px-1.5 py-0.2 rounded bg-danger/15 text-danger border border-danger/30 font-bold flex items-center gap-1">
                              <AlertTriangle size={10} />
                              <span>{tx.badgeOverdue[curLang]}</span>
                            </span>
                          )}
                          {tItem.time && (
                            <span className="flex items-center gap-0.5 text-gold2">
                              <Clock size={10} />
                              {tItem.time}
                            </span>
                          )}
                          {formatRepLabel(tItem) && (
                            <span className="text-muted font-bold">
                              {formatRepLabel(tItem)}
                            </span>
                          )}
                          {parentProj && (
                            <span className="px-1.5 py-0.2 rounded bg-gold/10 text-gold border border-gold/30 font-bold">
                              📁 {parentProj.title}
                            </span>
                          )}
                          {streak > 0 && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                openTaskAnalysisModal(tItem);
                              }}
                              className="px-1.5 py-0.2 rounded bg-gold/10 text-gold border border-gold/30 font-bold flex items-center gap-0.5 hover:bg-gold/20 transition-colors cursor-pointer"
                              title={tx.btnAnalyzeTask[curLang]}
                            >
                              <span>🔥</span>
                              <span>{streak} {tx.subConsecutiveDays[curLang]}</span>
                            </span>
                          )}
                          {totalDone > 0 && streak === 0 && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                openTaskAnalysisModal(tItem);
                              }}
                              className="px-1.5 py-0.2 rounded bg-surface border border-line text-muted font-bold flex items-center gap-0.5 hover:text-gold hover:border-gold/30 transition-colors cursor-pointer"
                              title={tx.btnAnalyzeTask[curLang]}
                            >
                              <span>⚡</span>
                              <span>{totalDone} {tx.lblExecutionsOrDays[curLang]}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-none">
                      <button
                        type="button"
                        title={tx.btnAnalyzeTask[curLang]}
                        onClick={(e) => {
                          e.stopPropagation();
                          openTaskAnalysisModal(tItem);
                        }}
                        className="text-muted hover:text-gold p-1.5 rounded hover:bg-gold/10 transition-colors flex items-center gap-1 text-xs font-mono cursor-pointer"
                      >
                        <BarChart2 size={13} className="text-gold" />
                        <span className="text-[10px] hidden md:inline">{tx.btnAnalyzeShort[curLang]}</span>
                      </button>
                      <button
                        type="button"
                        title={tx.btnPostponeAction[curLang]}
                        onClick={(e) => {
                          e.stopPropagation();
                          openPostponeModal(tItem);
                        }}
                        className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-mono cursor-pointer ${
                          isPostponed
                            ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5'
                            : 'text-muted hover:text-gold hover:bg-gold/10'
                        }`}
                      >
                        <CalendarClock size={13} />
                        <span className="text-[10px] hidden md:inline">{tx.btnPostponeAction[curLang]}</span>
                      </button>
                      <button
                        type="button"
                        title={tx.editTaskTitle[curLang]}
                        onClick={(e) => {
                          e.stopPropagation();
                          openTaskModal(tItem);
                        }}
                        className="text-muted hover:text-gold p-1.5 rounded hover:bg-gold/10 transition-colors cursor-pointer"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        type="button"
                        title={tx.btnArchiveTask[curLang]}
                        onClick={(e) => {
                          e.stopPropagation();
                          requestArchiveTask(tItem);
                        }}
                        className="text-muted hover:text-amber-300 p-1.5 rounded hover:bg-amber-400/10 transition-colors cursor-pointer"
                      >
                        <Archive size={13} />
                      </button>
                      <button
                        type="button"
                        title={tx.delTaskTitle[curLang]}
                        onClick={(e) => {
                          e.stopPropagation();
                          requestDeleteTask(tItem);
                        }}
                        className="text-muted hover:text-danger p-1.5 rounded hover:bg-danger/10 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </Card>
                );
              })}

              {/* CARD DE BALANCEAMENTO: Se contagem for ímpar na aba de tarefas ativas, preenche o vácuo */}
              {displayedTasks.length % 2 === 1 && filter !== 'done' && (
                <div
                  onClick={() => openTaskModal()}
                  className="cursor-pointer border border-dashed border-gold/30 hover:border-gold/60 bg-gold/5 hover:bg-gold/10 rounded-xl p-3 sm:p-3.5 flex items-center justify-center gap-2 text-gold transition-all min-h-[48px] w-full"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">
                    {tx.cardNewOp[curLang]}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Card className="py-12 text-center w-full">
              <Empty>{tx.noTasks[curLang]}</Empty>
            </Card>
          )}
        </div>
      )}

      {/* 2. ABA DE PROJETOS ESTRATÉGICOS */}
      {activeMainTab === 'projects' && (
        <div className="flex flex-col gap-3 w-full max-w-full min-w-0">
          {/* Sub-filtros de Projetos Responsivos */}
          <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center sm:gap-1.5 w-full">
            {[
              { id: 'ativos', label: tx.projFilterActive[curLang], count: projects.filter((p) => !p.archived && p.status !== 'concluido').length },
              { id: 'concluidos', label: tx.projFilterDone[curLang], count: projects.filter((p) => !p.archived && p.status === 'concluido').length },
              { id: 'arquivados', label: tx.projFilterArchived[curLang], count: projects.filter((p) => p.archived).length },
            ].map((pf) => (
              <button
                key={pf.id}
                type="button"
                onClick={() => setProjFilter(pf.id)}
                className={`w-full sm:w-auto text-[10.5px] sm:text-xs font-mono px-1.5 sm:px-3 py-1.5 rounded transition-all flex items-center justify-center gap-1 sm:gap-1.5 select-none cursor-pointer ${
                  projFilter === pf.id
                    ? 'bg-gold text-[#141414] font-bold shadow-sm'
                    : 'bg-surface2 text-muted hover:text-ink border border-line'
                }`}
              >
                <span className="truncate">{pf.label}</span>
                <span className={`text-[9px] sm:text-[9.5px] px-1 sm:px-1.5 py-0.2 rounded shrink-0 ${projFilter === pf.id ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                  {pf.count}
                </span>
              </button>
            ))}
          </div>

          {/* SEÇÃO EXPANSÍVEL: 6 MODELOS PRÉ-CONFIGURADOS DA FORJA */}
          {showTemplates && (
            <div className="p-3.5 sm:p-4 rounded-xl border border-gold/40 bg-gradient-to-b from-[#18110b] via-[#100b07] to-surface shadow-xl relative overflow-hidden mb-1">
              <div className="flex items-start justify-between gap-2 mb-3 pb-2.5 border-b border-gold/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/40 text-gold flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="font-display text-base tracking-wide text-gold">
                      {tx.templatesBannerTitle[curLang]}
                    </h3>
                    <p className="text-[11px] text-muted leading-tight">
                      {tx.templatesBannerDesc[curLang]}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTemplates(false)}
                  className="text-muted hover:text-ink p-1 rounded hover:bg-surface2 transition-colors shrink-0 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PREDEFINED_TEMPLATES.map((tpl) => {
                  const catObj = PROJECT_CATEGORIES.find((c) => c.id === tpl.category) || PROJECT_CATEGORIES[0];
                  const tTitle = tpl.title[curLang] || tpl.title.pt;
                  const tDesc = tpl.desc[curLang] || tpl.desc.pt;
                  const tCmds = tpl.commandments[curLang] || tpl.commandments.pt || [];
                  const tSteps = tpl.steps[curLang] || tpl.steps.pt || [];
                  const habitsList = tpl.habits || [];

                  return (
                    <div
                      key={tpl.id}
                      className="rounded-lg border border-gold/30 bg-surface/90 hover:border-gold/60 p-3 flex flex-col justify-between transition-all hover:shadow-[0_4px_20px_rgba(245,158,11,0.15)] group"
                    >
                      <div>
                        {/* Topo do Modelo */}
                        <div className="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface2 border border-line text-muted flex items-center gap-1 font-bold">
                            <span>{catObj.icon}</span>
                            <span>{catObj.label[curLang] || catObj.label.pt}</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/40 font-extrabold">
                            ⚡ {tpl.days} {tx.durationDaysWord[curLang]}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-[13px] font-bold text-ink mb-1.5 leading-snug group-hover:text-gold transition-colors">
                          {tTitle}
                        </h4>

                        <p className="text-[11px] text-muted line-clamp-3 mb-2.5 leading-relaxed">
                          {tDesc}
                        </p>

                        {/* Pilares e Hábitos da Forja */}
                        <div className="space-y-1.5 mb-3 pt-2 border-t border-line/40">
                          {tpl.linkPillars && (
                            <div className="flex items-center gap-1 text-[10px] font-mono text-gold font-bold">
                              <Shield size={11} className="text-gold shrink-0" />
                              <span>{tx.badgePillarsActive[curLang]}</span>
                            </div>
                          )}

                          {habitsList.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-[10px] font-mono text-muted mr-0.5">Hábitos:</span>
                              {habitsList.map((h) => {
                                const hName = h.name[curLang] || h.name.pt;
                                return (
                                  <span
                                    key={h.id}
                                    title={hName}
                                    className="text-[10px] px-1.5 py-0.2 rounded bg-surface2 border border-line/60 text-ink font-mono flex items-center gap-0.5"
                                  >
                                    <span>{h.icon}</span>
                                    <span className="max-w-[70px] truncate">{hName}</span>
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          <div className="text-[10px] font-mono text-muted flex items-center justify-between">
                            <span>📜 {tCmds.length} leis de conduta</span>
                            <span>🚩 {tSteps.length} etapas</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          openProjectModal(null, tpl);
                          toast(tx.toastTemplateLoaded[curLang]);
                        }}
                        className="btn-gold w-full py-1.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm mt-1 cursor-pointer"
                      >
                        <Zap size={12} strokeWidth={2.5} />
                        <span>{tx.btnUseTemplate[curLang]}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
            {displayedProjects.length > 0 ? (
              <>
                {displayedProjects.map((proj) => {
                const isCompleted = proj.status === 'concluido';
                const isArchived = proj.archived;
                const steps = proj.steps || [];
                const stepsDone = steps.filter((s) => s.done).length;
                const projTasks = tasks.filter((t) => (String(t.projectId) === String(proj.id) || String(t.proj) === String(proj.id)) && !t.archived);
                const projStats = calcProjectProgress(proj, tasks);
                const projPct = projStats.pct;
                const projTasksDone = projTasks.filter((t) => L.isDone(t, today())).length;
                const unlinkedTasks = tasks.filter((t) => !t.archived && !t.projectId && !t.proj);
                const suggestedTask = projTasks.length === 0 ? unlinkedTasks.find((t) => {
                  const pWords = proj.title.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
                  const tWords = t.txt.toLowerCase();
                  return pWords.some((w) => tWords.includes(w));
                }) : null;
                const isProjectLate = L.isProjLate(S, proj);
                const hasDelayedTask = projTasks.some((t) => L.isTaskOverdue(t));
                const hasPostponedTask = projTasks.some((t) => L.isTaskPostponed(t));
                const catObj = PROJECT_CATEGORIES.find((c) => c.id === proj.category);
                const userHabits = L.allH(S);
                const projHabits = (proj.habitIds || []).map((hId) => userHabits.find((h) => String(h.id) === String(hId))).filter(Boolean);
                const forgeDoneToday = (S?.forge?.done || {})[today()] || [];
                const projCmds = Array.isArray(proj.commandments) ? proj.commandments : [];
                const isExpanded = !!expandedProjIds[proj.id];

                return (
                  <Card
                    key={proj.id}
                    className={`p-3.5 sm:p-4 border transition-all flex flex-col justify-between ${
                      isArchived
                        ? 'border-line bg-surface/30 opacity-60'
                        : isCompleted
                        ? 'border-line/40 bg-surface/50 opacity-75'
                        : isProjectLate
                        ? 'border-danger/50 bg-surface2/90 hover:border-danger'
                        : 'border-line bg-surface2/80 hover:border-gold/40'
                    }`}
                  >
                    <div>
                      {/* Topo do Card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <span className="text-xl flex-none mt-0.5" role="img">{catObj?.icon || '🏛️'}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              {catObj && (
                                <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-surface border border-line text-muted font-bold">
                                  {catObj.label[curLang] || catObj.label.pt}
                                </span>
                              )}
                              {proj.days && (
                                <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-gold/10 text-gold border border-gold/30 font-bold">
                                  ⚡ {proj.days} {tx.wordDays[curLang]}
                                </span>
                              )}
                              {proj.linkPillars && (
                                <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-gold/15 text-gold border border-gold/40 font-extrabold flex items-center gap-1">
                                  <Shield size={10} className="text-gold" />
                                  <span>{tx.badgePillarsActive[curLang]} ({L.progressDays(S)} {tx.badgePillarsStreak[curLang]})</span>
                                </span>
                              )}
                            </div>
                            <h4 className={`text-sm sm:text-[15px] font-bold truncate leading-tight ${isCompleted ? 'line-through text-muted' : 'text-ink'}`}>
                              {proj.title}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-none">
                          {!isArchived && (
                            <button
                              type="button"
                              onClick={() => toggleProjectStatus(proj)}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold transition-all cursor-pointer ${
                                isCompleted
                                  ? 'border-gold bg-gold/15 text-gold'
                                  : isProjectLate
                                  ? 'border-danger/60 bg-danger/15 text-danger font-extrabold flex items-center gap-1 shadow-sm'
                                  : 'border-line bg-surface text-muted hover:text-ink'
                              }`}
                            >
                              {isCompleted ? tx.statusCompleted[curLang] : isProjectLate ? (
                                <>
                                  <AlertTriangle size={11} className="text-danger flex-none" />
                                  <span>{tx.badgeProjectDelayed[curLang]}</span>
                                </>
                              ) : tx.statusInProgress[curLang]}
                            </button>
                          )}
                          <button
                            type="button"
                            title={tx.editProjTitle[curLang]}
                            onClick={() => openProjectModal(proj)}
                            className="text-muted hover:text-gold p-1 transition-colors cursor-pointer"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            title={isArchived ? tx.unarchiveProjAction[curLang] : tx.archiveProjAction[curLang]}
                            onClick={() => requestArchiveProject(proj)}
                            className="text-muted hover:text-gold p-1 transition-colors cursor-pointer"
                          >
                            <Archive size={13} />
                          </button>
                          <button
                            type="button"
                            title={tx.delProjAction[curLang]}
                            onClick={() => requestDeleteProject(proj)}
                            className="text-muted hover:text-danger p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {proj.desc && (
                        <p className="text-xs text-muted mb-2.5 leading-relaxed">
                          {proj.desc}
                        </p>
                      )}

                      {/* Barra de Progresso do Projeto (Sempre Visível) */}
                      <div className="mb-2.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted mb-1">
                          <span className="flex items-center gap-1.5 font-bold text-ink">
                            <span>{tx.lblTotalProgress[curLang]}</span>
                            {projStats.hasRecurring && projStats.recurringTarget > 0 && (
                              <span className="text-gold font-mono font-normal text-[9.5px]">
                                · {projStats.recurringDone}/{projStats.recurringTarget} {tx.lblExecutionsOrDays[curLang]}
                              </span>
                            )}
                          </span>
                          <span className="font-bold text-gold text-xs">{projPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface overflow-hidden border border-line/40">
                          <div
                            className="h-full bg-gradient-to-r from-gold/80 to-gold transition-all duration-300 rounded-full"
                            style={{ width: `${projPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Sugestão Inteligente se houver tarefa avulsa compatível */}
                      {suggestedTask && (
                        <div className="p-2 rounded-lg bg-gold/10 border border-gold/40 flex items-center justify-between gap-2 mb-2 text-xs">
                          <div className="min-w-0">
                            <span className="text-[9.5px] font-mono text-muted block leading-none mb-0.5">
                              {tx.lblSuggestedTaskMatch[curLang]}
                            </span>
                            <b className="text-gold truncate block text-[11px] leading-tight">
                              {suggestedTask.txt}
                            </b>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              update((s) => {
                                const tgt = (s.tasks || []).find((x) => String(x.id) === String(suggestedTask.id));
                                if (tgt) {
                                  tgt.projectId = proj.id;
                                  tgt.proj = proj.id;
                                }
                              });
                              AF.click();
                              toast(tx.toastTaskLinked[curLang]);
                            }}
                            className="btn-gold px-2 py-1 text-[10px] font-bold shrink-0 cursor-pointer"
                          >
                            + {tx.btnLinkThisTask[curLang]}
                          </button>
                        </div>
                      )}

                      {/* 1. MODO COMPACTO (PADRÃO / RECOLHIDO NO MOBILE E DESKTOP) */}
                      {!isExpanded && (
                        <div className="space-y-2 mt-1">
                          {/* Badges de Resumo Tático dos Itens Vinculados */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                            {projTasks.length > 0 ? (
                              <span className={`px-2 py-0.5 rounded border flex items-center gap-1 font-bold ${
                                projStats.hasRecurring
                                  ? 'bg-gold/15 text-gold border-gold/40'
                                  : projTasksDone === projTasks.length
                                  ? 'bg-gold/15 text-gold border-gold/40'
                                  : 'bg-surface border-line text-muted'
                              }`}>
                                <span>🎯</span>
                                {projStats.hasRecurring ? (
                                  <span>{projStats.recurringDone}/{projStats.recurringTarget} {tx.lblExecutionsOrDays[curLang]} ({projStats.todayDone}/{projStats.todayDue || projTasks.length} {tx.lblDoneTodayCount[curLang]})</span>
                                ) : (
                                  <span>{projTasksDone}/{projTasks.length} {tx.lblCompactTasks[curLang]}</span>
                                )}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLinkTaskModal(proj);
                                }}
                                className="px-2 py-0.5 rounded border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20 flex items-center gap-1 font-bold cursor-pointer transition-colors"
                              >
                                <Plus size={10} />
                                <span>{tx.btnLinkExistingTask[curLang]}</span>
                              </button>
                            )}

                            {projHabits.length > 0 && (
                              <span className="px-2 py-0.5 rounded border border-line bg-surface text-muted flex items-center gap-1">
                                <span>⚡</span>
                                <span>{projHabits.filter((h) => forgeDoneToday.includes(h.id)).length}/{projHabits.length} {tx.lblCompactHabits[curLang]}</span>
                              </span>
                            )}

                            {projCmds.length > 0 && (
                              <span className="px-2 py-0.5 rounded border border-line bg-surface text-muted flex items-center gap-1">
                                <span>📜</span>
                                <span>{projCmds.length} {tx.lblCompactLaws[curLang]}</span>
                              </span>
                            )}

                            {steps.length > 0 && (
                              <span className="px-2 py-0.5 rounded border border-line bg-surface text-muted flex items-center gap-1">
                                <span>🚩</span>
                                <span>{stepsDone}/{steps.length} {tx.lblCompactSteps[curLang]}</span>
                              </span>
                            )}
                          </div>

                          {/* Aviso de Atraso Resumido */}
                          {isProjectLate && !isCompleted && !isArchived && (
                            <div className="p-1.5 px-2 rounded bg-danger/10 border border-danger/30 flex items-center gap-1.5 text-[11px] text-danger font-bold">
                              <AlertTriangle size={12} className="shrink-0 text-danger" />
                              <span className="truncate">{tx.badgeProjectDelayed[curLang]}</span>
                            </div>
                          )}

                          {/* Cronograma & Janela Resumidos */}
                          <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-muted pt-1 border-t border-line/30">
                            {proj.start && proj.deadline ? (
                              <span className="text-gold2 font-semibold flex items-center gap-1">
                                <Calendar size={11} /> {fmtD(proj.start)} ➔ {fmtD(proj.deadline)}
                              </span>
                            ) : proj.deadline ? (
                              <span className="text-gold2 flex items-center gap-1">
                                <Calendar size={11} /> {tx.wordDeadline[curLang]} {fmtD(proj.deadline)}
                              </span>
                            ) : (
                              <span>{tx.noDeadline[curLang]}</span>
                            )}

                            {proj.tStart && proj.tEnd && (
                              <span className="flex items-center gap-0.5 text-muted">
                                <Clock size={10} /> {proj.tStart}–{proj.tEnd}
                              </span>
                            )}
                          </div>

                          {/* Botão Intuitivo para Expandir */}
                          <button
                            type="button"
                            onClick={() => toggleExpandProject(proj.id)}
                            className="w-full mt-2 py-1.5 px-3 rounded-lg border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm group"
                          >
                            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                            <span>{tx.btnExpandProject[curLang]}</span>
                          </button>
                        </div>
                      )}

                      {/* 2. MODO EXPANDIDO (DETALHADO) */}
                      {isExpanded && (
                        <div className="space-y-3 mt-2">
                          {/* HÁBITOS DA FORJA ANCORADOS AO PROJETO */}
                          {projHabits.length > 0 && (
                            <div className="p-2 rounded bg-surface/70 border border-line/40">
                              <div className="flex items-center justify-between text-[10px] font-mono text-muted mb-1">
                                <span className="uppercase font-bold text-amber-300 flex items-center gap-1">
                                  <Zap size={11} className="text-gold" /> {tx.lblHabitsInProject[curLang]}
                                </span>
                                <span>{projHabits.filter((h) => forgeDoneToday.includes(h.id)).length}/{projHabits.length} {tx.lblDoneTodayCount[curLang]}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {projHabits.map((h) => {
                                  const isDoneToday = forgeDoneToday.includes(h.id);
                                  const hName = h.n || h.name || h.title || '';
                                  return (
                                    <span
                                      key={h.id}
                                      className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${
                                        isDoneToday
                                          ? 'bg-gold/20 border-gold/60 text-gold font-bold shadow-sm'
                                          : 'bg-surface2 border-line text-muted'
                                      }`}
                                    >
                                      <span>{h.icon || '⚡'}</span>
                                      <span className="truncate max-w-[100px]">{hName}</span>
                                      {isDoneToday && <Check size={10} strokeWidth={3} className="text-gold" />}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* LEIS & MANDAMENTOS DESTE PROJETO */}
                          {projCmds.length > 0 && (
                            <div className="p-2 rounded bg-surface/60 border border-line/40">
                              <span className="text-[10px] font-mono text-muted uppercase font-bold block mb-1">
                                {tx.lblCommandments[curLang]} ({projCmds.length})
                              </span>
                              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                                {projCmds.map((cmd, cIdx) => (
                                  <div key={cIdx} className="text-[11px] font-mono text-amber-200/90 leading-tight flex items-start gap-1">
                                    <span className="text-gold shrink-0">⚔️</span>
                                    <span>{cmd}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Banner de Atraso se Projeto Atrasado */}
                          {isProjectLate && !isCompleted && !isArchived && (
                            <div className="p-2 rounded bg-danger/10 border border-danger/30 flex items-center gap-1.5 text-xs text-danger">
                              <AlertTriangle size={13} className="shrink-0 text-danger" />
                              <span className="font-bold text-[11px] leading-tight">
                                {hasDelayedTask && hasPostponedTask
                                  ? tx.projDelayedBoth[curLang]
                                  : hasPostponedTask
                                  ? tx.projDelayedPostponed[curLang]
                                  : hasDelayedTask
                                  ? tx.projDelayedOverdue[curLang]
                                  : tx.projDelayedDeadline[curLang]}
                              </span>
                            </div>
                          )}

                          {/* TAREFAS VINCULADAS A ESTE PROJETO */}
                          <div className="p-2 rounded bg-surface/60 border border-line/40">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-mono text-muted uppercase font-bold">
                                {tx.lblLinkedTasks[curLang]} ({projTasksDone}/{projTasks.length})
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedProjIds((prev) => ({ ...prev, [proj.id]: true }));
                                    openTaskModal(null, proj.id);
                                  }}
                                  className="text-[10px] font-mono text-gold hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Plus size={10} /> {tx.btnNewInline[curLang]}
                                </button>
                                <span className="text-muted text-[10px]">•</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedProjIds((prev) => ({ ...prev, [proj.id]: true }));
                                    openLinkTaskModal(proj);
                                  }}
                                  className="text-[10px] font-mono text-muted hover:text-ink flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Link2 size={10} /> {tx.btnLinkInline[curLang]}
                                </button>
                              </div>
                            </div>

                            {projTasks.length > 0 ? (
                              <div className="space-y-1">
                                {projTasks.map((pt) => {
                                  const done = L.isDone(pt, today());
                                  const isPtPostponed = L.isTaskPostponed(pt);
                                  const isPtOverdue = L.isTaskOverdue(pt);
                                  return (
                                    <div
                                      key={pt.id}
                                      className={`flex items-center justify-between gap-1.5 p-1.5 px-2 rounded text-xs border transition-all ${
                                        done
                                          ? 'bg-surface2/40 border-line/20 opacity-60'
                                          : isPtPostponed
                                          ? 'bg-amber-500/10 border-amber-500/30'
                                          : isPtOverdue
                                          ? 'bg-danger/10 border-danger/30'
                                          : 'bg-surface2/60 border-line/30'
                                      }`}
                                    >
                                      <div
                                        className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer"
                                        onClick={() => toggleTask(pt.id)}
                                      >
                                        <div className={`w-3.5 h-3.5 rounded flex-none flex items-center justify-center border ${done ? 'bg-gold border-gold text-[#141414]' : 'border-line'}`}>
                                          {done && <Check size={10} strokeWidth={3} />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <span className={`truncate text-[11px] block ${done ? 'line-through text-muted' : 'text-ink'}`}>
                                            {pt.txt}
                                          </span>
                                          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                            {isPtPostponed && (
                                              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/15 px-1 rounded border border-amber-500/30 flex items-center gap-0.5">
                                                <CalendarClock size={9} />
                                                <span>{tx.badgePostponed[curLang]} ({fmtD(pt.postponedTo)})</span>
                                              </span>
                                            )}
                                            {isPtOverdue && !isPtPostponed && (
                                              <span className="text-[9px] font-mono font-bold text-danger bg-danger/15 px-1 rounded border border-danger/30 flex items-center gap-0.5">
                                                <AlertTriangle size={9} />
                                                <span>{tx.badgeOverdue[curLang]}</span>
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 flex-none">
                                        <button
                                          type="button"
                                          title={tx.btnAnalyzeTask[curLang]}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openTaskAnalysisModal(pt);
                                          }}
                                          className="text-muted hover:text-gold p-0.5 transition-colors cursor-pointer"
                                        >
                                          <BarChart2 size={12} className="text-gold" />
                                        </button>
                                        <button
                                          type="button"
                                          title={tx.btnPostponeAction[curLang]}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openPostponeModal(pt);
                                          }}
                                          className="text-muted hover:text-amber-400 p-0.5 transition-colors cursor-pointer"
                                        >
                                          <CalendarClock size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          title={tx.editTaskTitle[curLang]}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openTaskModal(pt);
                                          }}
                                          className="text-muted/60 hover:text-gold p-0.5 transition-colors cursor-pointer"
                                        >
                                          <Edit3 size={11} />
                                        </button>
                                        <button
                                          type="button"
                                          title={tx.unlinkFromProj[curLang]}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            unlinkTask(pt.id);
                                          }}
                                          className="text-muted/60 hover:text-amber-400 p-0.5 transition-colors cursor-pointer"
                                        >
                                          <Unlink size={11} />
                                        </button>
                                        <button
                                          type="button"
                                          title={tx.btnArchiveTask[curLang]}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            requestArchiveTask(pt);
                                          }}
                                          className="text-muted/60 hover:text-amber-300 p-0.5 transition-colors cursor-pointer"
                                        >
                                          <Archive size={11} />
                                        </button>
                                        <button
                                          type="button"
                                          title={tx.delTaskTitle[curLang]}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            requestDeleteTask(pt);
                                          }}
                                          className="text-muted/60 hover:text-danger p-0.5 transition-colors cursor-pointer"
                                        >
                                          <Trash2 size={11} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-[11px] text-muted italic">{tx.noLinkedTasks[curLang]}</p>
                            )}
                          </div>

                          {/* ETAPAS / MARCOS */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-muted uppercase block font-bold">
                              {tx.lblSteps[curLang]} ({stepsDone}/{steps.length})
                            </span>
                            {steps.map((st) => (
                              <div
                                key={st.id}
                                onClick={() => toggleStep(proj.id, st.id)}
                                className="flex items-center gap-2 p-1.5 rounded bg-surface border border-line/40 cursor-pointer text-xs"
                              >
                                <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${st.done ? 'bg-gold border-gold text-[#141414]' : 'border-line'}`}>
                                  {st.done && <Check size={10} strokeWidth={3} />}
                                </div>
                                <span className={`truncate text-xs ${st.done ? 'line-through text-muted' : 'text-ink'}`}>
                                  {st.txt}
                                </span>
                              </div>
                            ))}

                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const input = e.target.elements.stepInput;
                                addStepToProject(proj.id, input.value);
                                input.value = '';
                              }}
                              className="flex gap-1 pt-1"
                            >
                              <input
                                name="stepInput"
                                placeholder={tx.phAddStep[curLang]}
                                className="field py-1 px-2 text-[11px] flex-1"
                              />
                              <button type="submit" className="btn-dark py-1 px-2 text-[11px] font-mono font-bold cursor-pointer">
                                {tx.btnAdd[curLang]}
                              </button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-2 border-t border-line/40">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-muted mb-2">
                          {proj.start && proj.deadline ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="flex items-center gap-1 text-gold2 font-semibold">
                                <Calendar size={11} />
                                {fmtD(proj.start)} ➔ {fmtD(proj.deadline)}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-gold/10 text-gold border border-gold/30 font-bold">
                                {L.projTotal(proj)} {tx.wordDays[curLang]} {L.projCurDay(proj) > 0 ? `(${tx.wordDay[curLang]} ${L.projCurDay(proj)})` : ''}
                              </span>
                            </div>
                          ) : proj.deadline ? (
                            <span className="flex items-center gap-1 text-gold2">
                              <Calendar size={11} />
                              {tx.wordDeadline[curLang]} {fmtD(proj.deadline)}
                            </span>
                          ) : (
                            <span>{tx.noDeadline[curLang]}</span>
                          )}
                          <div className="flex items-center gap-2">
                            {proj.tStart && proj.tEnd && (
                              <span className="flex items-center gap-0.5 text-muted">
                                <Clock size={10} />
                                {proj.tStart}–{proj.tEnd}
                              </span>
                            )}
                            <span>{projTasks.length} {tx.wordTasks[curLang]}</span>
                          </div>
                        </div>

                        {/* Botão de Recolher Projeto */}
                        <button
                          type="button"
                          onClick={() => toggleExpandProject(proj.id)}
                          className="w-full py-1.5 px-3 rounded-lg border border-line bg-surface hover:bg-surface2 text-muted hover:text-ink text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ChevronUp size={14} />
                          <span>{tx.btnCollapseProject[curLang]}</span>
                        </button>
                      </div>
                    )}
                  </Card>
                );
              })}

              {/* CARD DE BALANCEAMENTO: Se contagem for ímpar na aba de projetos ativos, elimina o vácuo */}
              {displayedProjects.length % 2 === 1 && projFilter === 'ativos' && (
                <div
                  onClick={() => openProjectModal()}
                  className="cursor-pointer border-2 border-dashed border-gold/30 hover:border-gold/60 bg-gold/5 hover:bg-gold/10 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all min-h-[200px] group"
                >
                  <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/35 text-gold flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-sm">
                    <Plus size={20} strokeWidth={2.5} />
                  </div>
                  <b className="text-xs text-gold font-bold uppercase tracking-wider block">
                    {tx.cardNewProject[curLang]}
                  </b>
                  <span className="text-[11px] text-muted mt-1 max-w-[240px]">
                    {tx.cardNewProjectSub[curLang]}
                  </span>
                </div>
              )}
            </>
            ) : (
              <div className="col-span-1 md:col-span-2 py-8 text-center w-full">
                <Card className="py-8 px-4 w-full border-gold/30">
                  <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 text-gold flex items-center justify-center mx-auto mb-3">
                    <Layers size={24} />
                  </div>
                  <h4 className="font-display text-base text-ink mb-1">
                    {tx.noProjects[curLang]}
                  </h4>
                  <p className="text-xs text-muted max-w-sm mx-auto mb-4">
                    {tx.cardNewProjectSub[curLang]}
                  </p>
                  {projFilter === 'ativos' && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTemplates(true);
                          AF.click();
                        }}
                        className="btn-gold py-2 px-4 text-xs font-bold w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Sparkles size={14} />
                        <span>{tx.btnExploreTemplates[curLang]}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openProjectModal()}
                        className="btn-dark py-2 px-4 text-xs font-bold w-full sm:w-auto cursor-pointer"
                      >
                        {tx.btnCreateFirstProject[curLang]}
                      </button>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ABA DE ARQUIVO GERAL */}
      {activeMainTab === 'archive' && (
        <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0">
          {/* Projetos Arquivados */}
          <Card className="p-4 border-line">
            <div className="flex items-center justify-between mb-3">
              <K className="mb-0">{tx.archivedProjectsTitle[curLang]} ({projects.filter((p) => p.archived).length})</K>
            </div>
            {projects.filter((p) => p.archived).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projects.filter((p) => p.archived).map((proj) => {
                  const projTasks = tasks.filter((t) => String(t.projectId) === String(proj.id) || String(t.proj) === String(proj.id));
                  return (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-lg border border-line/60 bg-surface2/60 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-ink truncate">{proj.title}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-muted">
                            {tx.badgeArchived[curLang]}
                          </span>
                        </div>
                        {proj.desc && (
                          <p className="text-xs text-muted line-clamp-2 mb-2">{proj.desc}</p>
                        )}
                        <span className="text-[11px] font-mono text-muted">
                          {tx.lblLinkedTasksCount[curLang]} <b className="text-ink">{projTasks.length}</b>
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-line/50">
                        <button
                          type="button"
                          onClick={() => requestArchiveProject(proj)}
                          className="btn-gold py-1.5 px-3 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <ArchiveRestore size={12} />
                          <span>{tx.btnUnarchive[curLang]}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDeleteProject(proj)}
                          className="btn-dark py-1.5 px-2.5 text-xs text-muted hover:text-danger hover:border-danger/40 transition-colors"
                          title={tx.delProjAction[curLang]}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted">
                {tx.noArchivedProjects[curLang]}
              </div>
            )}
          </Card>

          {/* Tarefas Arquivadas (se houver) */}
          {tasks.filter((t) => t.archived).length > 0 && (
            <Card className="p-4 border-line">
              <div className="flex items-center justify-between mb-3">
                <K className="mb-0">{tx.archivedTasksTitle[curLang]} ({tasks.filter((t) => t.archived).length})</K>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tasks.filter((t) => t.archived).map((tItem) => (
                  <div
                    key={tItem.id}
                    className="p-2.5 rounded border border-line/50 bg-surface2/40 flex items-center justify-between gap-2"
                  >
                    <span className="text-xs text-muted truncate">{tItem.txt}</span>
                    <div className="flex items-center gap-1.5 flex-none">
                      <button
                        type="button"
                        onClick={() => {
                          update((s) => {
                            const target = (s.tasks || []).find((x) => String(x.id) === String(tItem.id));
                            if (target) target.archived = false;
                          });
                          AF.click();
                          toast(tx.toastTaskRestored[curLang]);
                        }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-line bg-surface hover:border-gold hover:text-gold text-muted font-bold cursor-pointer"
                      >
                        {tx.btnRestore[curLang]}
                      </button>
                      <button
                        type="button"
                        title={tx.editTaskTitle[curLang]}
                        onClick={() => openTaskModal(tItem)}
                        className="text-muted hover:text-gold p-1 rounded hover:bg-gold/10 transition-colors cursor-pointer"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        type="button"
                        title={tx.delTaskTitle[curLang]}
                        onClick={() => requestDeleteTask(tItem)}
                        className="text-muted hover:text-danger p-1 rounded hover:bg-danger/10 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
