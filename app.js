/* ============================================
   学生管理系统 — 应用逻辑 (Phase 2)
   ============================================ */

const STORAGE_KEYS = {
  SCHEDULE: 'schedule_data_v2',
  STUDENTS: 'students_data_v1',
  EXAMS: 'exam_records_v1',
  TREES: 'knowledge_templates_v1',
  TRACES: 'student_knowledge_traces_v1',
  COLORS: 'campus_colors_v1'
};

const ICONS = {
  calendar: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; margin-right:2px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  clock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px; margin-right:3px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  mapPin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px; margin-right:1px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  users: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; margin-right:2px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  tree: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px; margin-right:3px;"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-2.58-4.6l.3-.49a2.99 2.99 0 0 1 2.75-1.38l.14.01a5.98 5.98 0 0 1 11.02-3.13l.21.36a3 3 0 0 1 2.5 4.54l-.45.74a3 3 0 0 1-2.54 1.45L16 13.5"/><path d="M12 22v-8"/></svg>`,
  school: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px; margin-right:2px;"><path d="m4 6 8-4 8 4"></path><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"></path><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"></path><path d="M18 5v17"></path><path d="M6 5v17"></path><circle cx="12" cy="9" r="2"></circle></svg>`,
  inbox: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; margin-right:4px;"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>`
};

// ---- State ----
let state = {
  scheduleData: {},
  studentsData: {},
  examRecords: {},
  knowledgeTemplates: {},
  studentKnowledgeTraces: {},
  campusColorMap: {},
  currentWeekOffset: 0,
  currentView: 'scheduleView',
  currentEditingSlot: null,
  currentViewingStudentId: null,
  currentViewingTreeId: null,
  studentChartInstance: null
};

// ---- Constants ----
const CAMPUS_COLORS = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#fb923c', '#2dd4bf'];
const WEEKDAYS = [
  { key: 'tue', name: '周二', dayOfWeek: 2 }, { key: 'wed', name: '周三', dayOfWeek: 3 },
  { key: 'thu', name: '周四', dayOfWeek: 4 }, { key: 'fri', name: '周五', dayOfWeek: 5 },
  { key: 'sat', name: '周六', dayOfWeek: 6 }, { key: 'sun', name: '周日', dayOfWeek: 0 }
];
const DEFAULT_TEMPLATES = {
  tue: [{start:'19:00',end:'21:00'}], wed: [{start:'19:00',end:'21:00'}], thu: [{start:'19:00',end:'21:00'}],
  fri: [{start:'15:00',end:'17:00'}, {start:'17:30',end:'19:00'}, {start:'19:30',end:'21:00'}],
  sat: [{start:'08:00',end:'10:00'},{start:'10:00',end:'12:00'},{start:'13:00',end:'15:00'},{start:'15:00',end:'17:00'},{start:'17:00',end:'18:00'}],
  sun: [{start:'08:00',end:'10:00'},{start:'10:00',end:'12:00'},{start:'13:00',end:'15:00'},{start:'15:00',end:'17:00'},{start:'17:00',end:'18:00'}],
};

// ---- Utils ----
const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const timeToMinutes = (time) => { const [h,m] = time.split(':').map(Number); return h*60+m; };
const escapeHTML = (str) => { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; };
const getCampusColor = (campus) => {
  if (!campus) return CAMPUS_COLORS[0];
  if (!state.campusColorMap[campus]) {
    state.campusColorMap[campus] = CAMPUS_COLORS[Object.keys(state.campusColorMap).length % CAMPUS_COLORS.length];
    saveData('COLORS', state.campusColorMap);
  }
  return state.campusColorMap[campus];
};
const showToast = (msg) => {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
};

// ---- Persistence ----
function loadAllData() {
  Object.keys(STORAGE_KEYS).forEach(k => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS[k]);
      let keyInState = k === 'COLORS' ? 'campusColorMap' : 
                       k === 'SCHEDULE' ? 'scheduleData' :
                       k === 'STUDENTS' ? 'studentsData' :
                       k === 'EXAMS' ? 'examRecords' :
                       k === 'TREES' ? 'knowledgeTemplates' : 'studentKnowledgeTraces';
      if (raw) state[keyInState] = JSON.parse(raw);
    } catch(e) {}
  });

  // Data Migration for v1 schedule
  const oldScheduleStr = localStorage.getItem('schedule_data_v1');
  if (oldScheduleStr && !localStorage.getItem(STORAGE_KEYS.SCHEDULE)) {
    migrateV1toV2(JSON.parse(oldScheduleStr));
  }
}
function saveData(keyId, data) { localStorage.setItem(STORAGE_KEYS[keyId], JSON.stringify(data)); }

function migrateV1toV2(oldSched) {
  let newSched = {};
  Object.keys(oldSched).forEach(dateKey => {
    newSched[dateKey] = oldSched[dateKey].map(slot => {
      // 找寻或创建学生
      let stuId = Object.keys(state.studentsData).find(id => state.studentsData[id].name === slot.student);
      if (!stuId) {
        stuId = generateId();
        state.studentsData[stuId] = { name: slot.student, campus: slot.campus || '', balance: 0, treeId: '' };
        saveData('STUDENTS', state.studentsData);
      }
      return { id: slot.id, start: slot.start, end: slot.end, studentId: stuId, isSettled: false };
    });
  });
  state.scheduleData = newSched;
  saveData('SCHEDULE', state.scheduleData);
}

// ==== VIEW ROUTING ====
function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
  document.getElementById(viewId).style.display = 'block';
  document.querySelector(`[data-target="${viewId}"]`).classList.add('active');
  state.currentView = viewId;

  if (viewId === 'scheduleView') renderSchedule(true);
  if (viewId === 'studentsView') renderStudentsView();
  if (viewId === 'treesView') renderTreesView();
}

// ==== SCHEDULE VIEW ====
document.getElementById('prevWeekBtn').onclick = () => { state.currentWeekOffset--; renderSchedule(); };
document.getElementById('nextWeekBtn').onclick = () => { state.currentWeekOffset++; renderSchedule(); };
document.getElementById('todayBtn').onclick = () => { state.currentWeekOffset = 0; renderSchedule(true); };

function renderSchedule(autoScrollToToday = false) {
  const dates = getWeekDates(state.currentWeekOffset);
  
  // Header
  document.getElementById('weekRange').textContent = `${dates.tue.getFullYear()}年 ${dates.tue.getMonth()+1}月${dates.tue.getDate()}日 — ${dates.sun.getMonth()+1}月${dates.sun.getDate()}日`;
  
  const grid = document.getElementById('scheduleGrid');
  grid.innerHTML = '';
  
  let totalSlots = 0, totalHours = 0, uniqueStudents = new Set(), uniqueCampuses = new Set();

  WEEKDAYS.forEach(wd => {
    const d = dates[wd.key];
    const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const slots = (state.scheduleData[dateKey]||[]).sort((a,b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    
    // Day Col
    const col = document.createElement('div');
    const isToday = d.toDateString() === new Date().toDateString();
    col.className = `day-column ${isToday ? 'is-today' : ''}`;
    col.innerHTML = `
      <div class="day-header">
        <div><div class="day-name">${wd.name}</div><div class="day-date">${d.getMonth()+1}月${d.getDate()}日</div></div>
        ${isToday ? '<span class="today-badge">今天</span>' : ''}
      </div>
    `;

    const container = document.createElement('div');
    container.className = 'slots-container';

    // Rendering slots
    const template = DEFAULT_TEMPLATES[wd.key] || [];
    if (template.length > 0) {
      const usedIds = new Set();
      template.forEach((tmpl, i) => {
        if ((wd.key==='sat'||wd.key==='sun') && i===2 && tmpl.start==='13:00') {
          const ldiv = document.createElement('div');
          ldiv.className = 'time-slot lunch-break';
          ldiv.innerHTML = `<span class="lunch-break-text">🍚 午休 12:00 - 13:00</span>`;
          container.appendChild(ldiv);
        }
        const match = slots.find(s => s.start === tmpl.start && s.end === tmpl.end && !usedIds.has(s.id));
        if (match) {
          usedIds.add(match.id);
          container.appendChild(createFilledSlot(match, dateKey));
          totalSlots++;
          const dur = (timeToMinutes(match.end) - timeToMinutes(match.start))/60;
          totalHours += dur;
          uniqueStudents.add(match.studentId);
          const stu = state.studentsData[match.studentId];
          if(stu && stu.campus) uniqueCampuses.add(stu.campus);
        } else {
          container.appendChild(createEmptySlot(tmpl, dateKey));
        }
      });
      slots.filter(s => !usedIds.has(s.id)).forEach(s => {
        container.appendChild(createFilledSlot(s, dateKey));
        totalSlots++;
        totalHours += (timeToMinutes(s.end) - timeToMinutes(s.start))/60;
        uniqueStudents.add(s.studentId);
        if(state.studentsData[s.studentId] && state.studentsData[s.studentId].campus) uniqueCampuses.add(state.studentsData[s.studentId].campus);
      });
    } else if (slots.length > 0) {
      slots.forEach(s => {
        container.appendChild(createFilledSlot(s, dateKey));
        totalSlots++;
        totalHours += (timeToMinutes(s.end) - timeToMinutes(s.start))/60;
        uniqueStudents.add(s.studentId);
        if(state.studentsData[s.studentId] && state.studentsData[s.studentId].campus) uniqueCampuses.add(state.studentsData[s.studentId].campus);
      });
    } else {
      const ediv = document.createElement('div');
      ediv.className = 'empty-day-hint';
      ediv.innerHTML = `<span class="empty-icon">${ICONS.inbox}</span><span>暂无课程排期</span>`;
      container.appendChild(ediv);
    }

    const addBtn = document.createElement('button');
    addBtn.className = 'add-slot-btn'; addBtn.textContent = '＋ 添加排课';
    addBtn.onclick = () => openScheduleModal(null, dateKey);
    container.appendChild(addBtn);

    col.appendChild(container);
    grid.appendChild(col);
  });

  // Stats
  document.getElementById('statsBar').innerHTML = `
    <div class="stat-chip">${ICONS.calendar} 本周排课 <span>${totalSlots} 节</span></div>
    <div class="stat-chip">${ICONS.clock} 总时长 <span>${totalHours.toFixed(1)} hrs</span></div>
    <div class="stat-chip">${ICONS.users} 上课学生 <span>${uniqueStudents.size} 人</span></div>
    <div class="stat-chip">${ICONS.school} 涉及校区 <span>${uniqueCampuses.size} 个</span></div>
  `;

  if (autoScrollToToday && window.innerWidth <= 768 && state.currentWeekOffset === 0) {
    setTimeout(() => {
      const todayCol = document.querySelector('.day-column.is-today');
      if (todayCol) {
        todayCol.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  }
}

function getWeekDates(offset = 0) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() + (dayOfWeek === 0 ? -6 : 1 - dayOfWeek) + offset * 7);
  monday.setHours(0,0,0,0);
  const dates = {};
  WEEKDAYS.forEach(wd => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + (wd.dayOfWeek===0 ? 6 : wd.dayOfWeek-1));
    dates[wd.key] = d;
  });
  return dates;
}

function createFilledSlot(slot, dateKey) {
  const stu = state.studentsData[slot.studentId] || { name: '未知学生', campus: '' };
  const _color = getCampusColor(stu.campus);
  const div = document.createElement('div');
  div.className = `time-slot filled ${slot.isSettled ? 'settled' : ''}`;
  
  // Elevate contrast using matching 10% opacity background and tailored borders
  div.style.borderLeft = `4px solid ${_color}`;
  div.style.backgroundColor = _color + '1A'; // 10% opacity hex
  div.style.borderColor = _color + '33'; // 20% opacity border
  
  div.innerHTML = `
    <div class="slot-time" style="color: ${_color}; filter: brightness(0.8);">${ICONS.clock} ${slot.start} — ${slot.end} ${slot.isSettled?'<span style="color:#10b981;">✅ 已结余</span>':''}</div>
    <div class="slot-student">${escapeHTML(stu.name)}</div>
    <div class="slot-badges">
      ${stu.campus ? `<span class="slot-campus" style="background:${_color}26; color:${_color};">${ICONS.mapPin} ${escapeHTML(stu.campus)}</span>` : ''}
    </div>
  `;
  div.onclick = () => openScheduleModal(slot, dateKey);
  return div;
}

function createEmptySlot(tmpl, dateKey) {
  const div = document.createElement('div');
  div.className = 'time-slot empty';
  div.innerHTML = `<span class="add-hint">＋ ${tmpl.start} — ${tmpl.end}</span>`;
  div.onclick = () => openScheduleModal(null, dateKey, tmpl.start, tmpl.end);
  return div;
}

// ---- Schedule Modal (Add/Edit) ----
function populateStudentSelect(selectEl, selectedId) {
  selectEl.innerHTML = '<option value="">-- 请选择学生 --</option>';
  Object.keys(state.studentsData).forEach(id => {
    const stu = state.studentsData[id];
    let opt = document.createElement('option');
    opt.value = id; opt.textContent = `${stu.name} (${stu.campus || '无校区'}) - 余 ${stu.balance} h`;
    selectEl.appendChild(opt);
  });
  if(selectedId) selectEl.value = selectedId;
}

function openScheduleModal(slot, dateKey, defStart='', defEnd='') {
  state.currentEditingSlot = slot;
  document.getElementById('editDay').value = dateKey;
  
  populateStudentSelect(document.getElementById('paramStudentId'), slot ? slot.studentId : '');
  
  if (slot) {
    document.getElementById('modalTitle').textContent = '课程详情';
    document.getElementById('editSlotId').value = slot.id;
    document.getElementById('startTime').value = slot.start;
    document.getElementById('endTime').value = slot.end;
    document.getElementById('deleteBtn').style.display = 'block';
    
    const rZone = document.getElementById('recurringZone');
    if(rZone) rZone.style.display = 'none';

    // Show Settle Zone if not settled
    const settleZone = document.getElementById('settleZone');
    if (!slot.isSettled) {
      settleZone.style.display = 'block';
      let hours = (timeToMinutes(slot.end) - timeToMinutes(slot.start))/60;
      document.getElementById('deductHours').value = hours;
    } else {
      settleZone.style.display = 'none';
    }
  } else {
    document.getElementById('modalTitle').textContent = '添加排课';
    document.getElementById('editSlotId').value = '';
    document.getElementById('startTime').value = defStart;
    document.getElementById('endTime').value = defEnd;
    document.getElementById('deleteBtn').style.display = 'none';
    document.getElementById('settleZone').style.display = 'none';
    
    const rZone = document.getElementById('recurringZone');
    if(rZone) {
      rZone.style.display = 'flex';
      document.getElementById('isRecurringCheck').checked = false;
    }
  }
  
  document.getElementById('modalOverlay').classList.add('active');
}

document.getElementById('slotForm').onsubmit = (e) => {
  e.preventDefault();
  const dateKey = document.getElementById('editDay').value;
  const slotId = document.getElementById('editSlotId').value;
  const stId = document.getElementById('paramStudentId').value;
  const st = document.getElementById('startTime').value;
  const en = document.getElementById('endTime').value;

  if (!stId) return showToast('请选择学生，如果没有请在档案库添加');
  if (timeToMinutes(en) <= timeToMinutes(st)) return showToast('结束时间有误');

  if (!state.scheduleData[dateKey]) state.scheduleData[dateKey] = [];
  
  if (slotId) { // Update
    let idx = state.scheduleData[dateKey].findIndex(s => s.id === slotId);
    if(idx>-1) state.scheduleData[dateKey][idx] = { ...state.scheduleData[dateKey][idx], studentId: stId, start: st, end: en };
    showToast('更新成功');
  } else { // Create
    const isRecur = document.getElementById('isRecurringCheck') && document.getElementById('isRecurringCheck').checked;
    const gId = isRecur ? generateId() : null;
    
    state.scheduleData[dateKey].push({ id: generateId(), studentId: stId, start: st, end: en, isSettled: false, groupId: gId });
    
    if (isRecur) {
      for(let i=1; i<=20; i++) {
        let cd = new Date(dateKey);
        cd.setDate(cd.getDate() + i * 7);
        let rKey = `${cd.getFullYear()}-${String(cd.getMonth()+1).padStart(2,'0')}-${String(cd.getDate()).padStart(2,'0')}`;
        if (!state.scheduleData[rKey]) state.scheduleData[rKey] = [];
        state.scheduleData[rKey].push({ id: generateId(), studentId: stId, start: st, end: en, isSettled: false, groupId: gId });
      }
    }
    showToast(isRecur ? '固定排课添加成功（已顺延20周）' : '添加成功');
  }
  saveData('SCHEDULE', state.scheduleData);
  document.getElementById('modalOverlay').classList.remove('active');
  renderSchedule();
};

document.getElementById('deleteBtn').onclick = () => {
  const dk = document.getElementById('editDay').value;
  const id = document.getElementById('editSlotId').value;
  if(state.scheduleData[dk]) {
    const slotObj = state.scheduleData[dk].find(s => s.id === id);
    if (slotObj && slotObj.groupId) {
      if(confirm('该课程是每周固定排课。\n\n[确定] 删除本周及之后所有的关联排课\n[取消] 仅删除本周这1节课')) {
        const limitDate = new Date(dk);
        Object.keys(state.scheduleData).forEach(k => {
          if(new Date(k) >= limitDate) {
            state.scheduleData[k] = state.scheduleData[k].filter(s => s.groupId !== slotObj.groupId);
          }
        });
        saveData('SCHEDULE', state.scheduleData);
        showToast('已删除此后所有关联排课');
        document.getElementById('modalOverlay').classList.remove('active');
        renderSchedule();
        return;
      }
    }
    
    state.scheduleData[dk] = state.scheduleData[dk].filter(s => s.id !== id);
    saveData('SCHEDULE', state.scheduleData);
    showToast('删除成功');
  }
  document.getElementById('modalOverlay').classList.remove('active');
  renderSchedule();
};

// ==== SETTLE / CHECKOUT ====
document.getElementById('startSettleBtn').onclick = () => {
  document.getElementById('modalOverlay').classList.remove('active'); // Close base modal
  document.getElementById('settleForm').reset();
  document.getElementById('mdResult').value = '';
  document.getElementById('copyAndSettleBtn').textContent = `复制反馈 并扣除 ${document.getElementById('deductHours').value} 课时`;
  document.getElementById('settleModalOverlay').classList.add('active');
};

const generateMarkdown = () => {
  let dateText = document.getElementById('editDay').value;
  let stuName = state.studentsData[state.currentEditingSlot.studentId].name;
  let topic = document.getElementById('settleTopic').value || '未填写';
  let m = document.getElementById('settleMastered').value || '无';
  let w = document.getElementById('settleWeak').value || '无';
  let hw = document.getElementById('settleHomework').value || '无';
  
  return `### 👩‍🏫 课后反馈 (${dateText})
**学生**：${stuName}

**📚 今日讲解 / 重难点**：
${topic}

**✅ 课堂掌握（已达标题型）**：
${m}

**⚠️ 需要加强（易错/未掌握）**：
${w}

**📝 课后作业与配合事项**：
${hw}

---
*此反馈由教学系统自动生成，如有疑问请微信沟通。*`;
};

// 监听输入自动生成Markdown预览
['settleTopic','settleMastered','settleWeak','settleHomework'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById('mdResult').value = generateMarkdown();
  });
});

document.getElementById('copyAndSettleBtn').onclick = async () => {
  if(!document.getElementById('settleTopic').value) return showToast('讲解内容必填');
  
  const md = generateMarkdown();
  try {
    await navigator.clipboard.writeText(md);
    showToast('已复制到剪贴板！正在结账...');
  } catch(e) {
    showToast('结账成功，但复制失败，请手动全选复制文本框。');
  }

  // 扣费逻辑
  const stuId = state.currentEditingSlot.studentId;
  const deduct = parseFloat(document.getElementById('deductHours').value || 0);
  
  if (state.studentsData[stuId]) {
    state.studentsData[stuId].balance -= deduct;
    saveData('STUDENTS', state.studentsData);
  }

  // 标记排课为已结算
  const dk = document.getElementById('editDay').value;
  const sid = state.currentEditingSlot.id;
  const slotObj = state.scheduleData[dk].find(s => s.id === sid);
  if(slotObj) slotObj.isSettled = true;
  saveData('SCHEDULE', state.scheduleData);

  document.getElementById('settleModalOverlay').classList.remove('active');
  renderSchedule();
  
  // Navigate to student profile to light up tree
  if(confirm('是否立刻前往学生的【考情档案】勾选刚才讲解的知识点？')) {
    switchView('studentsView');
    selectStudent(stuId);
  }
};

// ==== STUDENTS VIEW ====
function renderStudentsList() {
  const list = document.getElementById('studentList');
  list.innerHTML = '';
  Object.keys(state.studentsData).forEach(id => {
    const s = state.studentsData[id];
    let div = document.createElement('div');
    div.className = `student-item ${state.currentViewingStudentId === id ? 'active' : ''}`;
    div.innerHTML = `
      <div class="stu-item-name">${escapeHTML(s.name)} <span>${s.balance}h</span></div>
      <div class="stu-item-meta"><span>${ICONS.mapPin} ${s.campus||'未分类'}</span> <span>${s.treeId ? ICONS.tree+'已绑知识树':''}</span></div>
    `;
    div.onclick = () => selectStudent(id);
    list.appendChild(div);
  });
}

function renderStudentsView() {
  renderStudentsList();
  if (state.currentViewingStudentId && state.studentsData[state.currentViewingStudentId]) {
    selectStudent(state.currentViewingStudentId);
  } else {
    document.getElementById('studentProfile').innerHTML = '<div class="empty-profile-hint">请在左侧选择或添加学生</div>';
  }
}

function selectStudent(id) {
  state.currentViewingStudentId = id;
  renderStudentsList(); // highlight active
  
  const stu = state.studentsData[id];
  const prof = document.getElementById('studentProfile');
  
  prof.innerHTML = `
    <div class="profile-header">
      <div class="profile-title">
        <h2>${escapeHTML(stu.name)} <button class="btn btn-sm" onclick="editStudentInfo('${id}')">编辑资料</button></h2>
        <div class="profile-tags">
          <span class="stat-chip">${ICONS.mapPin} ${stu.campus||'未分类'}</span>
          <span class="stat-chip">${ICONS.tree} ${stu.treeId ? (state.knowledgeTemplates[stu.treeId]?.name || '树形缺失') : '未绑知识树'}</span>
        </div>
      </div>
      <div class="balance-card">
        <div class="balance-num">${stu.balance}</div>
        <div class="balance-label">剩余课时 (h)</div>
        <button class="btn btn-sm" onclick="promptAddBalance('${id}')" style="margin-top:8px;">充值</button>
      </div>
    </div>
    
    <div class="profile-grid">
      <div class="panel">
        <h3>考情趋势图 <button class="btn btn-sm" onclick="addExamRecord('${id}')">录入成绩</button></h3>
        <div class="chart-container"><canvas id="examChart"></canvas></div>
      </div>
      <div class="panel">
        <h3>教学备忘与家长嘱咐</h3>
        <textarea class="text-area-display" id="stuMemoText" onblur="saveMemo('${id}')" placeholder="记录学生的专属薄弱点，或家长特别交代的注意事项...">${stu.memo || ''}</textarea>
      </div>
    </div>
    
    ${stu.treeId ? renderTreeTrackerForStudent(id, stu.treeId) : '<div class="panel" style="grid-column:1/-1;"><h3>知识树追踪</h3><p style="color:var(--text-muted);font-size:0.85rem;">该学生暂未绑定知识树。请点击【编辑】为TA绑定。</p></div>'}
  `;
  
  renderExamChart(id);
  if (stu.treeId) {
    setTimeout(() => updateTreeProgressUI(id, stu.treeId), 0);
  }
}

window.saveMemo = function(id) {
  state.studentsData[id].memo = document.getElementById('stuMemoText').value;
  saveData('STUDENTS', state.studentsData);
  showToast('备忘已自动保存');
};

window.promptAddBalance = function(id) {
  const amt = prompt('请输入要充值的课时数（如 10，可以直接输入负数扣减）：');
  if(amt && !isNaN(amt)) {
    state.studentsData[id].balance = parseFloat((state.studentsData[id].balance + parseFloat(amt)).toFixed(1));
    saveData('STUDENTS', state.studentsData);
    selectStudent(id);
    showToast(`充值成功，当前余额 ${state.studentsData[id].balance}`);
  }
};

window.editStudentInfo = function(id) {
  const stu = state.studentsData[id];
  document.getElementById('editStudentId').value = id;
  document.getElementById('stuName').value = stu.name;
  document.getElementById('stuCampus').value = stu.campus;
  document.getElementById('stuBalance').value = stu.balance;
  
  // Populate tree dropdown
  const treeSel = document.getElementById('stuTreeId');
  treeSel.innerHTML = '<option value="">-- 暂不绑定 --</option>';
  Object.keys(state.knowledgeTemplates).forEach(tid => {
    let o = document.createElement('option'); o.value = tid; o.textContent = state.knowledgeTemplates[tid].name;
    treeSel.appendChild(o);
  });
  treeSel.value = stu.treeId || '';

  document.getElementById('studentModalTitle').textContent = '编辑学生';
  document.getElementById('studentModalOverlay').classList.add('active');
};

document.getElementById('addStudentBtn').onclick = () => {
  document.getElementById('editStudentId').value = '';
  document.getElementById('studentForm').reset();
  const treeSel = document.getElementById('stuTreeId');
  treeSel.innerHTML = '<option value="">-- 暂不绑定 --</option>';
  Object.keys(state.knowledgeTemplates).forEach(tid => {
    let o = document.createElement('option'); o.value = tid; o.textContent = state.knowledgeTemplates[tid].name;
    treeSel.appendChild(o);
  });
  document.getElementById('studentModalTitle').textContent = '新增学生';
  document.getElementById('studentModalOverlay').classList.add('active');
};

document.getElementById('studentForm').onsubmit = (e) => {
  e.preventDefault();
  const id = document.getElementById('editStudentId').value;
  const data = {
    name: document.getElementById('stuName').value,
    campus: document.getElementById('stuCampus').value,
    balance: parseFloat(document.getElementById('stuBalance').value) || 0,
    treeId: document.getElementById('stuTreeId').value,
  };
  if (id) { state.studentsData[id] = { ...state.studentsData[id], ...data }; } 
  else { state.studentsData[generateId()] = data; }
  saveData('STUDENTS', state.studentsData);
  document.getElementById('studentModalOverlay').classList.remove('active');
  renderStudentsView();
};

// Chart.js 绘制
function renderExamChart(stuId) {
  const canvas = document.getElementById('examChart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  if(state.studentChartInstance) {
    state.studentChartInstance.destroy();
  }

  const records = state.examRecords[stuId] || [];
  const labels = records.map(r => r.name);
  const data = records.map(r => parseFloat(r.score));
  
  // Chart.js Configuration
  state.studentChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '成绩',
        data: data,
        borderColor: '#D97757',
        backgroundColor: 'rgba(217, 119, 87, 0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#D97757',
        pointRadius: 4,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: false } // Scores don't strictly need 0
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

window.addExamRecord = function(stuId) {
  document.getElementById('examForm').dataset.stuId = stuId;
  document.getElementById('examForm').reset();
  document.getElementById('examModalOverlay').classList.add('active');
};

document.getElementById('examForm').onsubmit = (e) => {
  e.preventDefault();
  const stuId = e.target.dataset.stuId;
  const name = document.getElementById('examNameInput').value;
  const score = document.getElementById('examScoreInput').value;
  
  if(!state.examRecords[stuId]) state.examRecords[stuId] = [];
  state.examRecords[stuId].push({ name, score, date: new Date().toISOString() });
  saveData('EXAMS', state.examRecords);
  
  document.getElementById('examModalOverlay').classList.remove('active');
  selectStudent(stuId); // Refresh chart
};

// ==== KNOWLEDGE TREES ====

// 解析带缩进的 Markdown 文本结构为树形 JSON
function parseTreeText(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  let root = [];
  let stack = [{ level: -1, children: root }];
  
  lines.forEach((line, idx) => {
    // 粗略计算缩进层级：以2个空格或1个Tab作为一个缩进单位
    const indentMatch = line.match(/^([ \t]*)/);
    let rawIndent = indentMatch[1];
    // 换算统一层级值 (1 tab = 4 spaces for our logic, divided by 2)
    rawIndent = rawIndent.replace(/\t/g, '  ');
    const level = rawIndent.length / 2;
    const content = line.trim().replace(/^[-*+#]+\s*/, ''); // 去除前缀 markdown 符号
    
    const node = { id: `node_${idx}_${Date.now()}`, label: content, children: [] };
    
    let safeLimit = 0;
    while(stack.length > 0 && stack[stack.length-1].level >= level && safeLimit < 100) {
      stack.pop();
      safeLimit++;
    }
    
    stack[stack.length-1].children.push(node);
    stack.push({ level, children: node.children });
  });
  
  return root;
}

document.getElementById('importTreeBtn').onclick = () => {
  document.getElementById('treeForm').reset();
  document.getElementById('treeModalOverlay').classList.add('active');
};

document.getElementById('treeForm').onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById('treeName').value;
  const content = document.getElementById('treeContent').value;
  try {
    const treeJson = parseTreeText(content);
    if(treeJson.length === 0) throw new Error("解析为空");
    const tid = generateId();
    state.knowledgeTemplates[tid] = { name, tree: treeJson };
    saveData('TREES', state.knowledgeTemplates);
    document.getElementById('treeModalOverlay').classList.remove('active');
    renderTreesView();
    showToast('知识树导入成功！');
  } catch(e) {
    alert("解析失败，请检查缩进格式");
  }
};

function renderTreesView() {
  const list = document.getElementById('treeList');
  list.innerHTML = '';
  Object.keys(state.knowledgeTemplates).forEach(tid => {
    const t = state.knowledgeTemplates[tid];
    let div = document.createElement('div');
    div.className = `tree-list-item ${state.currentViewingTreeId === tid ? 'active':''}`;
    div.innerHTML = `<span>${escapeHTML(t.name)}</span>`;
    div.onclick = () => selectTreeTemplate(tid);
    list.appendChild(div);
  });
}

function selectTreeTemplate(tid) {
  state.currentViewingTreeId = tid;
  renderTreesView(); // update active class
  const t = state.knowledgeTemplates[tid];
  const viewer = document.getElementById('treeViewer');
  
  viewer.innerHTML = `
    <div class="tree-viewer-header">
      <h2>${escapeHTML(t.name)}</h2>
      <button class="btn btn-sm btn-delete" onclick="deleteTreeTemplate('${tid}')">删除模板</button>
    </div>
    <div class="tree-render-zone" style="max-height: 60vh;">
      ${renderTreeNodesHTML(t.tree, false)}
    </div>
  `;
}

window.deleteTreeTemplate = function(tid) {
  if(confirm("确定删除此模板吗？如果有学生正在使用可能会受影响。")) {
    delete state.knowledgeTemplates[tid];
    saveData('TREES', state.knowledgeTemplates);
    state.currentViewingTreeId = null;
    document.getElementById('treeViewer').innerHTML = '<div class="empty-profile-hint">请在左侧选择知识树</div>';
    renderTreesView();
  }
};

// 渲染知识树为 HTML (支持只读和互动点亮模式)
function renderTreeNodesHTML(nodes, interactive, studentId = null, treeId = null) {
  if (!nodes || nodes.length === 0) return '';
  let html = `<div class="tree-children" style="border-left:none; margin-left:0; padding-left:0;">`;
  
  nodes.forEach(n => {
    let isChecked = false;
    if (interactive && studentId && treeId) {
      if(!state.studentKnowledgeTraces[studentId]) state.studentKnowledgeTraces[studentId] = {};
      if(!state.studentKnowledgeTraces[studentId][treeId]) state.studentKnowledgeTraces[studentId][treeId] = {};
      isChecked = state.studentKnowledgeTraces[studentId][treeId][n.id] === true;
    }
    
    html += `
      <div class="tree-node">
        <div class="tree-node-row">
          ${interactive ? `<input type="checkbox" id="cb_${studentId}_${n.id}" class="tree-checkbox" onchange="toggleTreeNode('${studentId}', '${treeId}', '${n.id}', this.checked)" ${isChecked?'checked':''}>` : '<span style="color:var(--accent-terracotta);">🔸</span>'} 
          <span style="font-weight:${n.children.length>0?'600':'400'}; font-size:${n.children.length>0?'1rem':'0.9rem'}">${escapeHTML(n.label)}</span>
        </div>
        ${n.children.length > 0 ? `<div class="tree-children">${renderTreeNodesHTML(n.children, interactive, studentId, treeId)}</div>` : ''}
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

window.toggleTreeNode = function(stuId, treeId, nodeId, checked) {
  if(!state.studentKnowledgeTraces[stuId]) state.studentKnowledgeTraces[stuId] = {};
  if(!state.studentKnowledgeTraces[stuId][treeId]) state.studentKnowledgeTraces[stuId][treeId] = {};
  const ctx = state.studentKnowledgeTraces[stuId][treeId];
  
  const template = state.knowledgeTemplates[treeId];
  if(!template) return;

  // Pass 1: Top-down Cascade (Force all descendants to match the clicked node's state)
  function cascadeDown(nodes, targetId, isMatched) {
    for (let n of nodes) {
      const match = isMatched || n.id === targetId;
      if (match) {
        ctx[n.id] = checked;
        const cb = document.getElementById(`cb_${stuId}_${n.id}`);
        if(cb) cb.checked = checked;
      }
      if (n.children && n.children.length > 0) {
        cascadeDown(n.children, targetId, match);
      }
    }
  }
  cascadeDown(template.tree, nodeId, false);

  // Pass 2: Bottom-up Bubble (A parent is strictly checked iff ALL its children are checked)
  function updateParents(nodes) {
    let allChecked = true;
    for (let n of nodes) {
      if (n.children && n.children.length > 0) {
        const childrenAllChecked = updateParents(n.children);
        ctx[n.id] = childrenAllChecked;
        const cb = document.getElementById(`cb_${stuId}_${n.id}`);
        if(cb) cb.checked = childrenAllChecked;
      }
      if (!ctx[n.id]) allChecked = false;
    }
    return allChecked && nodes.length > 0;
  }
  updateParents(template.tree);

  saveData('TRACES', state.studentKnowledgeTraces);
  updateTreeProgressUI(stuId, treeId);
};

function renderTreeTrackerForStudent(stuId, treeId) {
  const template = state.knowledgeTemplates[treeId];
  if(!template) return '';
  
  return `
    <div class="stu-tree-panel panel" style="grid-column:1/-1;">
      <div class="tree-header-info">
        <h3>${ICONS.tree} 专属知识树：${escapeHTML(template.name)}</h3>
        <div style="flex:1; display:flex; align-items:center;">
          <div class="progress-bar-bg"><div class="progress-bar-fill" id="treeProgFill"></div></div>
          <span id="treeProgText" style="font-size:0.85rem; font-weight:600; min-width:70px; text-align:right;">0%</span>
        </div>
      </div>
      <div class="tree-render-zone">
        ${renderTreeNodesHTML(template.tree, true, stuId, treeId)}
      </div>
    </div>
  `;
}

function updateTreeProgressUI(stuId, treeId) {
  const template = state.knowledgeTemplates[treeId];
  if(!template) return;
  
  // Count total leaf nodes vs checked leaf nodes
  let totalLeaves = 0;
  let checkedLeaves = 0;
  
  const ctx = state.studentKnowledgeTraces[stuId]?.[treeId] || {};
  
  let safeLimit = 0;
  function traverse(nodes) {
    if (safeLimit++ > 3000) return;
    nodes.forEach(n => {
      if (n.children.length === 0) {
        totalLeaves++;
        if (ctx[n.id]) checkedLeaves++;
      } else {
        traverse(n.children);
      }
    });
  }
  traverse(template.tree);
  
  const pct = totalLeaves === 0 ? 0 : Math.round((checkedLeaves / totalLeaves) * 100);
  
  const fill = document.getElementById('treeProgFill');
  const txt = document.getElementById('treeProgText');
  if(fill && txt) {
    fill.style.width = `${pct}%`;
    txt.textContent = `${pct}% (${checkedLeaves}/${totalLeaves})`;
  }
}

// ==== BINDING ====
document.querySelectorAll('.nav-tab').forEach(el => {
  el.addEventListener('click', (e) => switchView(e.target.dataset.target));
});

// modal closing handlers
['cancelBtn','cancelSettleBtn','cancelStudentBtn','cancelTreeBtn', 'cancelExamBtn'].forEach(id => {
  document.getElementById(id).onclick = (e) => e.target.closest('.modal-overlay').classList.remove('active');
});

['modalOverlay','settleModalOverlay','studentModalOverlay','treeModalOverlay','examModalOverlay'].forEach(id => {
  document.getElementById(id).addEventListener('mousedown', (e) => {
    if(e.target.id === id) e.target.classList.remove('active');
  });
});

document.getElementById('prevWeekBtn').onclick = () => { state.currentWeekOffset--; renderSchedule(); };
document.getElementById('nextWeekBtn').onclick = () => { state.currentWeekOffset++; renderSchedule(); };
document.getElementById('todayBtn').onclick = () => { state.currentWeekOffset = 0; renderSchedule(); };

// ==== INIT ====
function init() {
  loadAllData();
  switchView('scheduleView'); // Default view
}

init();
