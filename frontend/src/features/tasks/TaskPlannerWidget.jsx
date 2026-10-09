import React, { useState } from 'react';

export default function TaskPlannerWidget({
  tasks = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  loading = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const pendingTasks = tasks.filter((t) => t.status === 'PENDING').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'URGENT' && t.status !== 'COMPLETED').length;

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.assigneeName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === 'ALL' || t.category === activeCategory;
    const matchesStatus = activeStatus === 'ALL' || t.status === activeStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'LOW':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'DECOR':
        return '🌸 Decor';
      case 'CATERING':
        return '🍽️ Catering';
      case 'MUSIC':
        return '🎵 Music';
      case 'LOGISTICS':
        return '🏨 Logistics';
      case 'OUTFITS':
        return '💄 Outfits';
      case 'PHOTOGRAPHY':
        return '📸 Photo';
      default:
        return '📋 General';
    }
  };

  return (
    <div className="bg-[#111827]/80 border border-[#B76E79]/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B76E79] font-bold">Workspace Checklist</span>
          <h2 className="text-2xl font-serif font-bold text-white mt-0.5">Task Planner & Assignment Hub</h2>
          <p className="text-xs text-gray-400 mt-1">Organize vendor deliverables, deadlines, and assignees</p>
        </div>
        <button
          onClick={onAddTask}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white font-bold text-xs shadow-lg hover:opacity-95 transition flex items-center gap-2"
        >
          <span>➕</span> Add Task
        </button>
      </div>

      {/* Progress Card */}
      <div className="my-6 bg-[#0B0F19]/80 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-300 font-medium">Overall Planning Progress</span>
          <span className="text-[#F3E5AB] font-bold">
            {completedTasks} of {totalTasks} Completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
          <div
            className="h-full bg-gradient-to-r from-[#B76E79] via-[#D4AF37] to-[#10B981] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Summary Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-800/60 text-xs">
          <div className="bg-gray-900/50 p-2.5 rounded-lg border border-gray-800/80">
            <span className="text-gray-400 block text-[10px]">Total Tasks</span>
            <span className="text-white font-bold text-base">{totalTasks}</span>
          </div>
          <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
            <span className="text-amber-400 block text-[10px]">Pending</span>
            <span className="text-amber-300 font-bold text-base">{pendingTasks}</span>
          </div>
          <div className="bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/20">
            <span className="text-blue-400 block text-[10px]">In Progress</span>
            <span className="text-blue-300 font-bold text-base">{inProgressTasks}</span>
          </div>
          <div className="bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
            <span className="text-red-400 block text-[10px]">Urgent Tasks</span>
            <span className="text-red-300 font-bold text-base">{urgentTasks}</span>
          </div>
        </div>
      </div>

      {/* Controls: Search, Category Pills & Status Tabs */}
      <div className="space-y-4 mb-6">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks by title or assignee..."
            className="w-full bg-gray-900/70 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#B76E79]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'DECOR', label: '🌸 Decor' },
            { id: 'CATERING', label: '🍽️ Catering' },
            { id: 'MUSIC', label: '🎵 Music' },
            { id: 'LOGISTICS', label: '🏨 Logistics' },
            { id: 'OUTFITS', label: '💄 Outfits' },
            { id: 'PHOTOGRAPHY', label: '📸 Photo' },
            { id: 'GENERAL', label: '📋 General' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#B76E79] border-[#B76E79] text-white shadow-md'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          {[
            { id: 'ALL', label: 'All Tasks' },
            { id: 'PENDING', label: '⏳ Pending' },
            { id: 'IN_PROGRESS', label: '🔄 In Progress' },
            { id: 'COMPLETED', label: '✅ Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={`text-xs font-medium px-3 py-1 rounded-md transition ${
                activeStatus === tab.id
                  ? 'bg-[#B76E79]/20 text-[#F3E5AB] font-bold border border-[#B76E79]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-xs">
          <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading wedding tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
          <span className="text-3xl block mb-2">📋</span>
          <p className="text-sm font-semibold text-gray-300">No tasks found</p>
          <p className="text-xs text-gray-500 mt-1">Click "+ Add Task" to create your first checklist item!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((t) => (
            <div
              key={t._id}
              className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
                t.status === 'COMPLETED'
                  ? 'bg-gray-900/40 border-gray-800/80 opacity-75'
                  : 'bg-[#0B0F19]/90 border-gray-800 hover:border-[#B76E79]/40'
              }`}
            >
              {/* Checkbox & Title Info */}
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => onToggleStatus(t)}
                  className={`w-6 h-6 mt-0.5 rounded-lg border flex items-center justify-center text-xs font-bold transition flex-shrink-0 ${
                    t.status === 'COMPLETED'
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-gray-700 bg-gray-900 text-transparent hover:border-gray-500'
                  }`}
                >
                  ✓
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-semibold text-sm ${
                        t.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-white'
                      }`}
                    >
                      {t.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-[#F3E5AB] font-medium border border-gray-700">
                      {getCategoryIcon(t.category)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(
                        t.priority
                      )}`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                    <span>👤 Assignee: <strong className="text-gray-300">{t.assigneeName}</strong></span>
                    {t.dueDate && (
                      <span>📅 Due: <strong className="text-gray-300">{new Date(t.dueDate).toLocaleDateString()}</strong></span>
                    )}
                    {t.notes && <span className="text-gray-500 italic max-w-xs truncate">"{t.notes}"</span>}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onEditTask(t)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#F3E5AB] hover:bg-gray-800 transition text-xs"
                  title="Edit Task"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDeleteTask(t._id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition text-xs"
                  title="Delete Task"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
