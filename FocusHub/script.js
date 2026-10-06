// FocusHub interactive features: navigation, dark mode, tasks, resources, and profile.
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('mainNav');
  if (menuBtn) menuBtn.addEventListener('click', () => nav.classList.toggle('open'));

  const themeBtn = document.getElementById('themeBtn');
  if (localStorage.getItem('focusTheme') === 'dark') document.body.classList.add('dark');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('focusTheme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  setupTasks();
  setupResources();
  setupProfile();
  updateHomeStats();
});

function getTasks(){ return JSON.parse(localStorage.getItem('focusTasks') || '[]'); }
function saveTasks(tasks){ localStorage.setItem('focusTasks', JSON.stringify(tasks)); }

function setupTasks(){
  const form=document.getElementById('taskForm'); const list=document.getElementById('taskList');
  if(!form || !list) return;
  renderTasks();
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name=document.getElementById('taskName').value.trim();
    const date=document.getElementById('taskDate').value;
    const priority=document.getElementById('taskPriority').value;
    if(!name || !date) return;
    const tasks=getTasks();
    tasks.push({id:Date.now(),name,date,priority,done:false}); saveTasks(tasks); form.reset();
    document.getElementById('taskMessage').textContent='Task added successfully!'; renderTasks(); updateHomeStats();
  });
}
function renderTasks(){
  const list=document.getElementById('taskList'); if(!list) return;
  const tasks=getTasks();
  document.getElementById('taskSummary').textContent=`${tasks.length} task${tasks.length===1?'':'s'}`;
  if(!tasks.length){list.innerHTML='<p class="task-date">No tasks yet. Add your first task above.</p>';return;}
  list.innerHTML=tasks.map(t=>`<div class="task ${t.done?'done':''}"><input type="checkbox" ${t.done?'checked':''} onchange="toggleTask(${t.id})" style="width:auto"><div class="task-info"><div class="task-name">${escapeHTML(t.name)}</div><div class="task-date">Due: ${t.date}</div></div><span class="priority ${t.priority.toLowerCase()}">${t.priority}</span><button class="delete" onclick="deleteTask(${t.id})">×</button></div>`).join('');
}
function toggleTask(id){const tasks=getTasks();const t=tasks.find(x=>x.id===id);if(t)t.done=!t.done;saveTasks(tasks);renderTasks();updateHomeStats();}
function deleteTask(id){saveTasks(getTasks().filter(t=>t.id!==id));renderTasks();updateHomeStats();}
function updateHomeStats(){
  const count=document.getElementById('homeTaskCount'); const bar=document.getElementById('homeProgress'); const text=document.getElementById('homeProgressText');
  if(!count) return; const tasks=getTasks(); const done=tasks.filter(t=>t.done).length; const percent=tasks.length?Math.round(done/tasks.length*100):0;
  count.textContent=`${tasks.length} task${tasks.length===1?'':'s'}`; bar.style.width=percent+'%'; text.textContent=tasks.length?`${done} of ${tasks.length} completed (${percent}%).`:'Start adding tasks in Planner.';
}

const resources=[
 {title:'MDN Web Docs',cat:'coding',desc:'Reference and guides for HTML, CSS, JavaScript, and web APIs.',url:'https://developer.mozilla.org/'},
 {title:'JavaScript.info',cat:'coding',desc:'A beginner-friendly tutorial for learning modern JavaScript.',url:'https://javascript.info/'},
 {title:'Figma Learn',cat:'design',desc:'Lessons and tutorials for interface design and prototyping.',url:'https://help.figma.com/'},
 {title:'Canva Design School',cat:'design',desc:'Simple design lessons for posters, presentations, and content.',url:'https://www.canva.com/designschool/'},
 {title:'Pomodoro Technique',cat:'productivity',desc:'A simple time-management method for focused study sessions.',url:'https://todoist.com/productivity-methods/pomodoro-technique'},
 {title:'Google Scholar',cat:'research',desc:'Search academic papers and scholarly literature for research.',url:'https://scholar.google.com/'}
];
function setupResources(){
  const grid=document.getElementById('resourceGrid'); if(!grid) return;
  const search=document.getElementById('resourceSearch'); const filter=document.getElementById('resourceFilter');
  const render=()=>{const q=search.value.toLowerCase();const f=filter.value;const items=resources.filter(r=>(f==='all'||r.cat===f)&&(r.title.toLowerCase().includes(q)||r.desc.toLowerCase().includes(q)));grid.innerHTML=items.length?items.map(r=>`<article class="resource-card"><span class="tag">${r.cat.toUpperCase()}</span><h3>${r.title}</h3><p>${r.desc}</p><a href="${r.url}" target="_blank" rel="noopener">Visit resource →</a></article>`).join(''):'<p class="task-date">No resources found.</p>';};
  search.addEventListener('input',render);filter.addEventListener('change',render);render();
}
function setupProfile(){
  const form=document.getElementById('profileForm');if(!form)return;
  const saved=JSON.parse(localStorage.getItem('focusProfile')||'null');
  if(saved){document.getElementById('profileName').value=saved.name;document.getElementById('profileCourse').value=saved.course;document.getElementById('profileYear').value=saved.year;showProfile(saved);}
  form.addEventListener('submit',(e)=>{e.preventDefault();const data={name:document.getElementById('profileName').value.trim(),course:document.getElementById('profileCourse').value.trim(),year:document.getElementById('profileYear').value};if(!data.name||!data.course)return;localStorage.setItem('focusProfile',JSON.stringify(data));showProfile(data);document.getElementById('profileMessage').textContent='Profile saved successfully!';});
}
function showProfile(p){document.getElementById('profilePreviewName').textContent=p.name;document.getElementById('profilePreviewCourse').textContent=`${p.course} · ${p.year}`;document.getElementById('avatar').textContent=p.name.charAt(0).toUpperCase();}
function escapeHTML(str){return str.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
