(function(){
  const dialog=document.getElementById('belief-dialog');
  if(!dialog) return;
  const panel=dialog.querySelector('.belief-dialog-panel');
  const closeBtn=dialog.querySelector('.belief-dialog-close');
  const title=document.getElementById('belief-dialog-title');
  const copy=document.getElementById('belief-dialog-copy');
  const practice=document.getElementById('belief-dialog-practice');
  const kicker=document.getElementById('belief-dialog-kicker');
  const artLabel=document.getElementById('belief-art-label');
  const artFoot=document.getElementById('belief-art-foot');
  const flow=document.getElementById('belief-flow');
  let lastTrigger=null;
  const data={
    commercial:{
      no:'01',title:'Commercial instinct <em>matters.</em>',
      copy:'Strong creative work starts with a clear understanding of the business problem. The audience, proposition, objective and constraints shape the idea — not the other way around.',
      practice:'Before choosing a format or platform, define what needs to change: awareness, understanding, consideration, demand or customer action.',
      label:'FROM BUSINESS NEED TO CREATIVE IDEA',foot:'The brief gets sharper when the business problem is clear.',
      nodes:['Business objective','Audience & context','Creative response','Business outcome']
    },
    attention:{
      no:'02',title:'Attention has to <em>be earned.</em>',
      copy:'People are surrounded by content and have endless ways to ignore it. Relevance earns the first moment; a distinctive point of view gives them a reason to stay, remember and share.',
      practice:'Start with a real audience tension. Make the idea recognisable, useful or entertaining — and give it a voice that could not belong to just anyone.',
      label:'FROM AUDIENCE NEED TO EARNED ATTENTION',foot:'Relevance opens the door. A point of view makes it memorable.',
      nodes:['Audience tension','Relevant hook','Distinctive point of view','Earned attention']
    },
    execution:{
      no:'03',title:'Execution is the <em>differentiator.</em>',
      copy:'An idea is only the beginning. Research, scripting, craft, production, feedback and delivery determine whether the original thinking survives contact with the real world.',
      practice:'The work needs clear ownership, useful feedback loops, attention to detail and delivery that respects the audience, platform and brief.',
      label:'FROM PROMISING IDEA TO FINISHED WORK',foot:'The details are where the idea becomes real.',
      nodes:['A strong idea','Research & craft','Disciplined delivery','Work in the world']
    }
  };
  function open(key,trigger){
    const d=data[key]; if(!d) return;
    lastTrigger=trigger;
    kicker.textContent=d.no+' / THE PRINCIPLE';
    title.innerHTML=d.title;
    copy.textContent=d.copy;
    practice.textContent=d.practice;
    artLabel.textContent=d.label;
    artFoot.textContent=d.foot;
    flow.innerHTML=d.nodes.map((n,i)=>'<div class="flow-node"><i>0'+(i+1)+'</i><span>'+n+'</span>'+(i===d.nodes.length-1?'<strong>↗</strong>':'<strong>↓</strong>')+'</div>').join('');
    dialog.classList.add('is-open');
    dialog.setAttribute('aria-hidden','false');
    document.body.classList.add('belief-overlay-open');
    closeBtn.focus();
  }
  function close(){
    dialog.classList.remove('is-open');
    dialog.setAttribute('aria-hidden','true');
    document.body.classList.remove('belief-overlay-open');
    if(lastTrigger) lastTrigger.focus();
  }
  document.querySelectorAll('.belief-trigger').forEach(btn=>btn.addEventListener('click',()=>open(btn.dataset.belief,btn)));
  closeBtn.addEventListener('click',close);
  dialog.querySelectorAll('[data-belief-close]').forEach(el=>el.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(!dialog.classList.contains('is-open'))return;if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const focusables=[...panel.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled);if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
})();
