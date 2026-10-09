import React, { useState, useEffect } from 'react';

export default function TaskManagementModal({ isOpen, onClose, onSave, task = null, loading = false }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('PENDING');
  const [dueDate, setDueDate] = useState('');
  const [assigneeName, setAssigneeName] = useState('Unassigned');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setCategory(task.category || 'GENERAL');
      setPriority(task.priority || 'MEDIUM');
      setStatus(task.status || 'PENDING');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setAssigneeName(task.assigneeName || 'Unassigned');
      setNotes(task.notes || '');
    } else {
      setTitle('');
      setCategory('GENERAL');
      setPriority('MEDIUM');
      setStatus('PENDING');
      setDueDate('');
      setAssigneeName('Unassigned');
      setNotes('');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      category,
      priority,
      status,
      dueDate: dueDate || null,
      assigneeName: assigneeName.trim() || 'Unassigned',
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-[#B76E79]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#B76E79]/20 via-[#1E293B] to-[#0F172A] border-b border-[#B76E79]/30">
          <h3 className="text-lg font-serif font-bold text-[#F3E5AB]">
            {task ? '✏️ Edit Task' : '📋 Add New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finalize Sangeet Choreographer & Sound System"
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B76E79] transition"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              >
                <option value="DECOR">Decor & Floral 🌸</option>
                <option value="CATERING">Catering & Menu 🍽️</option>
                <option value="MUSIC">Music & Sangeet 🎵</option>
                <option value="LOGISTICS">Logistics & Stay 🏨</option>
                <option value="OUTFITS">Outfits & Beauty 💄</option>
                <option value="PHOTOGRAPHY">Photography 📸</option>
                <option value="GENERAL">General Task 📋</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              >
                <option value="URGENT">🔴 Urgent</option>
                <option value="HIGH">🟠 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🟢 Low</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                placeholder="e.g. Groom / Bride / Organizer"
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Workflow Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'PENDING', label: '⏳ Pending', color: 'border-amber-500/40 text-amber-300' },
                { id: 'IN_PROGRESS', label: '🔄 In Progress', color: 'border-blue-500/40 text-blue-300' },
                { id: 'COMPLETED', label: '✅ Completed', color: 'border-emerald-500/40 text-emerald-300' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id)}
                  className={`py-2 rounded-xl border text-xs font-semibold transition ${
                    status === item.id
                      ? `bg-gray-800 ${item.color} shadow-md`
                      : 'border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Task Notes / Vendor Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add contact info, vendor specs, or deadline instructions..."
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#B76E79]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white text-xs font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Saving Task...' : task ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
