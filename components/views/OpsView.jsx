'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Check, Trash2, Clock, Calendar, Flag, Folder, Layers, CheckCircle2, Circle, AlertCircle, Edit3, ChevronRight, Target, Flame, Archive, AlertTriangle, Link2, Unlink, MoreVertical, ArchiveRestore, CalendarClock } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr, fmtD, daysBetween, parseD } from '@/lib/utils';
import { AF } from '@/lib/audio';
import * as L from '@/lib/logic';

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
  newProject: { pt: 'NOVO PROJETO', en: 'NEW PROJECT', es: 'NUEVO PROYECTO' },
  filterAll: { pt: 'Todas', short: { pt: 'Todas', en: 'All', es: 'Todas' }, en: 'All', es: 'Todas' },
  filterToday: { pt: 'Para Hoje', short: { pt: 'Hoje', en: 'Today', es: 'Hoy' }, en: 'For Today', es: 'Para Hoy' },
  filterPostponed: { pt: 'Adiadas', short: { pt: 'Adiadas', en: 'Postponed', es: 'Pospuestas' }, en: 'Postponed', es: 'Pospuestas' },
  filterDone: { pt: 'Concluídas', short: { pt: 'Concluídas', en: 'Done', es: 'Hechas' }, en: 'Completed', es: 'Completadas' },
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
};

export default function OpsView() {
  const { S, update, toast, openModal, closeModal } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = I18N;

  const [activeMainTab, setActiveMainTab] = useState('tasks');
  const [filter, setFilter] = useState('today');
  const [projFilter, setProjFilter] = useState('ativos'); // 'ativos', 'concluidos', 'arquivados'

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
              <button
                type="button"
                className="py-2 px-3 rounded border border-danger/40 bg-danger/10 hover:bg-danger/20 text-danger text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  closeModal();
                  requestDeleteTask(taskToEdit);
                }}
              >
                <Trash2 size={13} />
                <span>{tx.btnDeleteTask[curLang]}</span>
              </button>
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

  /* MODAL: Criar / Editar Projeto (Com Início, Duração em Dias e Término) */
  const openProjectModal = (projToEdit = null) => {
    const ProjModalContent = () => {
      const [pTitle, setPTitle] = useState(projToEdit ? projToEdit.title : '');
      const [pDesc, setPDesc] = useState(projToEdit ? projToEdit.desc || '' : '');
      const [pStart, setPStart] = useState(projToEdit ? (projToEdit.start || today()) : today());

      const initialDays = projToEdit && projToEdit.start && projToEdit.deadline
        ? Math.max(1, daysBetween(projToEdit.start, projToEdit.deadline) + 1)
        : (projToEdit?.days || 30);
      const [pDays, setPDays] = useState(initialDays);

      const initialDead = projToEdit && projToEdit.deadline
        ? projToEdit.deadline
        : dstr(new Date(parseD(today()).getTime() + (Number(initialDays) - 1) * 86400000));
      const [pDeadline, setPDeadline] = useState(initialDead);
      const [tStart, setTStart] = useState(projToEdit ? (projToEdit.tStart || '') : '');
      const [tEnd, setTEnd] = useState(projToEdit ? (projToEdit.tEnd || '') : '');

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

      return (
        <div className="text-left">
          <div className="pb-2 mb-3 border-b border-line">
            <h3 className="font-display text-xl tracking-wide text-gold">
              {projToEdit ? tx.projModalEdit[curLang] : tx.projModalNew[curLang]}
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <span className="lbl mb-1 block">{tx.lblProjTitle[curLang]}</span>
              <input
                type="text"
                placeholder={tx.phProjTitle[curLang]}
                className="field w-full text-xs sm:text-sm"
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

            {/* CRONOGRAMA COMPLETO: INÍCIO, DURAÇÃO EM DIAS E TÉRMINO */}
            <div className="rounded border border-gold/40 bg-surface2/90 p-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gold font-bold block mb-2">
                {tx.lblProjSchedule[curLang]}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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

          <div className="mt-4 flex gap-2">
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
                      start: pStart || today(),
                      days: Number(pDays) || 30,
                      deadline: pDeadline || '',
                      tStart: tStart || '',
                      tEnd: tEnd || '',
                      status: 'ativo',
                      archived: false,
                      steps: [],
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
      if ((target.rep || 'unica') === 'unica') {
        target.done = !target.done;
      } else {
        const dd = today();
        target.doneDates = target.doneDates || [];
        const i = target.doneDates.indexOf(dd);
        if (i >= 0) target.doneDates.splice(i, 1);
        else target.doneDates.push(dd);
      }
    });
    AF.click();
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
    <div className="grid gap-3.5">
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
              className={`flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 rounded-lg text-xs font-bold transition-all select-none cursor-pointer ${
                isSelected
                  ? 'bg-gold text-[#141414] shadow-sm font-extrabold'
                  : 'text-muted hover:text-ink hover:bg-surface/50'
              }`}
            >
              <Icon size={14} className="flex-none" />
              <span className="sm:hidden whitespace-nowrap text-[11px]">
                {cat.labelShort[curLang] || cat.labelShort.pt}
              </span>
              <span className="hidden sm:inline whitespace-nowrap">
                {cat.labelFull[curLang] || cat.labelFull.pt}
              </span>
              <span className={`text-[9.5px] px-1 sm:px-1.5 py-0.2 rounded font-mono font-bold flex-none ${
                isSelected ? 'bg-black/20 text-black' : 'bg-surface text-gold'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de Ação de Operações */}
      <div className="flex items-center justify-between gap-2 w-full min-w-0">
        {activeMainTab === 'tasks' && (
          <div className="flex items-center justify-between w-full min-w-0 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-gold/30 flex items-center justify-center bg-gold/5 font-mono text-[9.5px] sm:text-[10px] font-bold text-gold shrink-0">
                {pct}%
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-muted truncate">
                {completedToday}/{todayTasks.length} <span className="hidden sm:inline">{tx.progress[curLang]}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => openTaskModal()}
              className="btn-gold py-1.5 px-2.5 sm:px-3 text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm shrink-0 whitespace-nowrap"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>{tx.newTask[curLang]}</span>
            </button>
          </div>
        )}

        {activeMainTab === 'projects' && (
          <div className="flex items-center justify-end w-full min-w-0">
            <button
              type="button"
              onClick={() => openProjectModal()}
              className="btn-gold py-1.5 px-2.5 sm:px-3 text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm shrink-0 whitespace-nowrap"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>{tx.newProject[curLang]}</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. ABA DE TAREFAS */}
      {activeMainTab === 'tasks' && (
        <Card className="p-3.5 sm:p-4">
          <div className="mb-3 pb-2.5 border-b border-line/60">
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pb-0.5 max-w-full">
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
                  className={`flex-1 sm:flex-none shrink-0 text-[11px] sm:text-xs font-mono px-2 sm:px-3 py-1.5 rounded transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
                    filter === f.id
                      ? 'bg-gold text-[#141414] font-bold shadow-sm'
                      : 'bg-surface2 text-muted hover:text-ink border border-line'
                  }`}
                >
                  <span className="sm:hidden">{f.labelShort}</span>
                  <span className="hidden sm:inline">{f.labelFull}</span>
                  <span className={`text-[9.5px] px-1 sm:px-1.5 py-0.2 rounded ${filter === f.id ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {displayedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {displayedTasks.map((tItem) => {
                const isDone = L.isDone(tItem, today());
                const isPostponed = L.isTaskPostponed(tItem);
                const isOverdue = L.isTaskOverdue(tItem);
                const priColor = {
                  alta: 'border-danger/40 bg-danger/5 text-danger',
                  media: 'border-gold/40 bg-gold/5 text-gold',
                  baixa: 'border-line bg-surface text-muted',
                }[tItem.pri] || 'border-line text-muted';
                const parentProj = projects.find((p) => String(p.id) === String(tItem.projectId));

                return (
                  <div
                    key={tItem.id}
                    className={`flex items-center justify-between gap-2.5 p-2.5 rounded-r border transition-all ${
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
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-none">
                      {!isDone && (
                        <button
                          type="button"
                          title={tx.btnPostponeAction[curLang]}
                          onClick={() => openPostponeModal(tItem)}
                          className={`p-1 rounded transition-colors flex items-center gap-1 text-xs font-mono cursor-pointer ${
                            isPostponed
                              ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5'
                              : 'text-muted hover:text-gold'
                          }`}
                        >
                          <CalendarClock size={13} />
                          <span className="text-[10px] hidden sm:inline">{tx.btnPostponeAction[curLang]}</span>
                        </button>
                      )}
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
                  </div>
                );
              })}

              {/* CARD DE BALANCEAMENTO: Se contagem for ímpar na aba de tarefas ativas, preenche o vácuo */}
              {displayedTasks.length % 2 === 1 && filter !== 'done' && (
                <div
                  onClick={() => openTaskModal()}
                  className="cursor-pointer border border-dashed border-gold/30 hover:border-gold/60 bg-gold/5 hover:bg-gold/10 rounded-r p-2.5 flex items-center justify-center gap-2 text-gold transition-all min-h-[46px]"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">
                    {tx.cardNewOp[curLang]}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Empty>{tx.noTasks[curLang]}</Empty>
            </div>
          )}
        </Card>
      )}

      {/* 2. ABA DE PROJETOS ESTRATÉGICOS */}
      {activeMainTab === 'projects' && (
        <div className="flex flex-col gap-3">
          {/* Sub-filtros de Projetos com Scroll Horizontal Suave */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full -mx-0.5 px-0.5">
            {[
              { id: 'ativos', label: tx.projFilterActive[curLang], count: projects.filter((p) => !p.archived && p.status !== 'concluido').length },
              { id: 'concluidos', label: tx.projFilterDone[curLang], count: projects.filter((p) => !p.archived && p.status === 'concluido').length },
              { id: 'arquivados', label: tx.projFilterArchived[curLang], count: projects.filter((p) => p.archived).length },
            ].map((pf) => (
              <button
                key={pf.id}
                type="button"
                onClick={() => setProjFilter(pf.id)}
                className={`shrink-0 text-xs font-mono px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  projFilter === pf.id
                    ? 'bg-gold text-[#141414] font-bold shadow-sm'
                    : 'bg-surface2 text-muted hover:text-ink border border-line'
                }`}
              >
                <span>{pf.label}</span>
                <span className={`text-[9.5px] px-1.5 py-0.2 rounded ${projFilter === pf.id ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                  {pf.count}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
            {displayedProjects.length > 0 ? (
              <>
                {displayedProjects.map((proj) => {
                const isCompleted = proj.status === 'concluido';
                const isArchived = proj.archived;
                const steps = proj.steps || [];
                const stepsDone = steps.filter((s) => s.done).length;
                const projTasks = tasks.filter((t) => (String(t.projectId) === String(proj.id) || String(t.proj) === String(proj.id)) && !t.archived);
                const projTasksDone = projTasks.filter((t) => L.isDone(t, today())).length;
                const totalItems = steps.length + projTasks.length;
                const doneItems = stepsDone + projTasksDone;
                const projPct = totalItems ? Math.round((doneItems / totalItems) * 100) : isCompleted ? 100 : 0;
                const isProjectLate = L.isProjLate(S, proj);
                const hasDelayedTask = projTasks.some((t) => L.isTaskOverdue(t));
                const hasPostponedTask = projTasks.some((t) => L.isTaskPostponed(t));

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
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Folder className="text-gold flex-none" size={18} />
                          <h4 className={`text-sm font-bold truncate ${isCompleted ? 'line-through text-muted' : 'text-ink'}`}>
                            {proj.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 flex-none">
                          {!isArchived && (
                            <button
                              type="button"
                              onClick={() => toggleProjectStatus(proj)}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold transition-all ${
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
                            className="text-muted hover:text-gold p-1 transition-colors"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            title={isArchived ? tx.unarchiveProjAction[curLang] : tx.archiveProjAction[curLang]}
                            onClick={() => requestArchiveProject(proj)}
                            className="text-muted hover:text-gold p-1 transition-colors"
                          >
                            <Archive size={13} />
                          </button>
                          <button
                            type="button"
                            title={tx.delProjAction[curLang]}
                            onClick={() => requestDeleteProject(proj)}
                            className="text-muted hover:text-danger p-1 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {proj.desc && (
                        <p className="text-xs text-muted mb-3 leading-relaxed">
                          {proj.desc}
                        </p>
                      )}

                      {/* Banner de Atraso se Projeto Atrasado */}
                      {isProjectLate && !isCompleted && !isArchived && (
                        <div className="mb-2.5 p-2 rounded bg-danger/10 border border-danger/30 flex items-center gap-1.5 text-xs text-danger">
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

                      {/* Barra de Progresso */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted mb-1">
                          <span>{tx.lblTotalProgress[curLang]}</span>
                          <span className="font-bold text-gold">{projPct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden border border-line/40">
                          <div
                            className="h-full bg-gold transition-all duration-300"
                            style={{ width: `${projPct}%` }}
                          />
                        </div>
                      </div>

                      {/* TAREFAS VINCULADAS A ESTE PROJETO */}
                      <div className="mb-3 p-2 rounded bg-surface/60 border border-line/40">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-muted uppercase font-bold">
                            {tx.lblLinkedTasks[curLang]} ({projTasksDone}/{projTasks.length})
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openTaskModal(null, proj.id)}
                              className="text-[10px] font-mono text-gold hover:underline flex items-center gap-0.5"
                            >
                              <Plus size={10} /> {tx.btnNewInline[curLang]}
                            </button>
                            <span className="text-muted text-[10px]">•</span>
                            <button
                              type="button"
                              onClick={() => openLinkTaskModal(proj)}
                              className="text-[10px] font-mono text-muted hover:text-ink flex items-center gap-0.5"
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
                                    {!done && (
                                      <button
                                        type="button"
                                        title={tx.btnPostponeAction[curLang]}
                                        onClick={() => openPostponeModal(pt)}
                                        className="text-muted hover:text-amber-400 p-0.5 transition-colors cursor-pointer"
                                      >
                                        <CalendarClock size={12} />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      title={tx.editTaskTitle[curLang]}
                                      onClick={() => openTaskModal(pt)}
                                      className="text-muted/60 hover:text-gold p-0.5 transition-colors cursor-pointer"
                                    >
                                      <Edit3 size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      title={tx.unlinkFromProj[curLang]}
                                      onClick={() => unlinkTask(pt.id)}
                                      className="text-muted/60 hover:text-amber-400 p-0.5 transition-colors cursor-pointer"
                                    >
                                      <Unlink size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      title={tx.delTaskTitle[curLang]}
                                      onClick={() => requestDeleteTask(pt)}
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
                      <div className="space-y-1.5 mb-3">
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
                          <button type="submit" className="btn-dark py-1 px-2 text-[11px] font-mono font-bold">
                            {tx.btnAdd[curLang]}
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-line/40 flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-muted">
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
              <div className="col-span-2 py-10 text-center">
                <Card className="py-8">
                  <Empty>
                    {tx.noProjects[curLang]}
                    <br />
                    {projFilter === 'ativos' && (
                      <button
                        type="button"
                        onClick={() => openProjectModal()}
                        className="btn-gold py-1.5 px-4 text-xs font-bold mt-3"
                      >
                        {tx.btnCreateFirstProject[curLang]}
                      </button>
                    )}
                  </Empty>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ABA DE ARQUIVO GERAL */}
      {activeMainTab === 'archive' && (
        <div className="grid gap-3.5">
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
