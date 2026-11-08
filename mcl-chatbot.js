(() => {
  if (document.getElementById('mcl-chat-launcher')) return;
  const style=document.createElement('style');
  style.textContent = `
#mcl-chat-launcher{position:fixed;right:20px;bottom:22px;z-index:1200;border:0;border-radius:999px;background:#d7ee1d;color:#171813;padding:15px 20px;font:800 15px Manrope,Arial,sans-serif;box-shadow:5px 6px 0 #68772b;display:flex;align-items:center;gap:10px;cursor:pointer}
#mcl-chat-launcher .mcl-chat-dot{width:9px;height:9px;border-radius:50%;background:#68772b;box-shadow:0 0 0 4px #68772b22}
#mcl-chat-panel{position:fixed;right:20px;bottom:88px;z-index:1201;width:min(390px,calc(100vw - 28px));height:min(610px,calc(100dvh - 125px));background:#fbfaf4;color:#171813;border:1px solid #deddd2;border-radius:24px;box-shadow:0 24px 80px #0003;display:none;overflow:hidden;font-family:"DM Sans",Arial,sans-serif}
#mcl-chat-panel.open{display:flex;flex-direction:column}
#mcl-chat-head{background:#171813;color:#fff;padding:17px 18px;display:flex;align-items:center;justify-content:space-between}
#mcl-chat-head strong{font:800 16px Manrope,Arial,sans-serif;display:block}
#mcl-chat-head small{color:#d7ee1d;font-size:11px;letter-spacing:.12em;text-transform:uppercase}
#mcl-chat-close{border:0;background:#ffffff18;color:white;border-radius:50%;width:34px;height:34px;font-size:22px;cursor:pointer}
#mcl-chat-progress{height:3px;background:#e7e5da}
#mcl-chat-progress span{display:block;height:100%;width:0;background:#b6cf17;transition:width .25s}
#mcl-chat-log{padding:18px 15px;overflow:auto;flex:1;display:flex;flex-direction:column;gap:12px}
.mcl-chat-msg{max-width:88%;padding:12px 14px;border-radius:16px;font-size:14px;line-height:1.45;white-space:pre-wrap}
.mcl-chat-msg.bot{align-self:flex-start;background:#eeede4;border-bottom-left-radius:5px}
.mcl-chat-msg.user{align-self:flex-end;background:#d7ee1d;border-bottom-right-radius:5px}
#mcl-chat-options{padding:12px 14px 15px;border-top:1px solid #e5e3d9;display:flex;flex-wrap:wrap;gap:8px;max-height:42%;overflow:auto}
.mcl-chat-choice{border:1px solid #c9c9bb;background:#fffefa;color:#171813;border-radius:999px;padding:10px 13px;font:700 12px "DM Sans",Arial,sans-serif;cursor:pointer;text-align:left}
.mcl-chat-choice:hover{border-color:#68772b;background:#f4f6df}
.mcl-chat-input{width:100%;border:1px solid #c9c9bb;border-radius:12px;background:white;padding:12px;font:14px "DM Sans",Arial,sans-serif;min-height:44px}
.mcl-chat-send{border:0;border-radius:999px;background:#171813;color:#fff;padding:11px 16px;font-weight:800;cursor:pointer}
.mcl-chat-foot{font-size:10px;color:#77796e;text-align:center;padding:0 10px 10px}
@media(max-width:520px){#mcl-chat-launcher{right:14px;bottom:14px;padding:13px 16px}#mcl-chat-panel{right:8px;bottom:76px;width:calc(100vw - 16px);height:min(620px,calc(100dvh - 94px));border-radius:20px}}
  `;
  document.head.appendChild(style);
  const launcher=document.createElement('button');
  launcher.id='mcl-chat-launcher';launcher.type='button';launcher.setAttribute('aria-label','Chat with Murder Crow Labs');
  launcher.innerHTML='<span class="mcl-chat-dot"></span> Ask Murder Crow <span aria-hidden="true">↗</span>';
  const panel=document.createElement('section');
  panel.id='mcl-chat-panel';panel.setAttribute('aria-label','Murder Crow Labs consultation assistant');
  panel.innerHTML='<div id="mcl-chat-head"><div><small>CREATIVE · TECH · GROWTH</small><strong>Let’s find what you need.</strong></div><button id="mcl-chat-close" type="button" aria-label="Close chat">×</button></div><div id="mcl-chat-progress"><span></span></div><div id="mcl-chat-log" aria-live="polite"></div><div id="mcl-chat-options"></div><div class="mcl-chat-foot">A few quick questions · Free first consultation</div>';
  document.body.append(launcher,panel);
  const log=panel.querySelector('#mcl-chat-log'),opts=panel.querySelector('#mcl-chat-options'),progress=panel.querySelector('#mcl-chat-progress span');
  const answers={};let step=0;
  const flow=[
    {key:'service',q:'Hey! I’m the Murder Crow assistant. What can we help you with?',a:['Branding & visual identity','Website or mobile application','AI software / Lead Intelligence','Marketing & business growth','Product, packaging or design','Film, content or production','CRM & automation','Interior / space design','Workshop or skill development','Not sure yet — help me decide']},
    {key:'stage',q:'Nice. Where are you right now with this project?',a:['Just an idea','Starting a new business','Already running a business','Rebranding or scaling','Need help with an existing project']},
    {key:'goal',q:'What would you like us to help you achieve?',a:['Build something from scratch','Improve what I already have','Get more customers / leads','Create a stronger brand experience','Automate or simplify operations','Explore options with an expert']},
    {key:'scope',q:'Give me a little more context. What are you planning to build or improve?',input:true,placeholder:'A few words about your project…'},
    {key:'timeline',q:'When would you like to get started?',a:['Immediately','Within 2–4 weeks','Within 1–3 months','Just exploring for now']},
    {key:'budget',q:'Do you have an approximate budget in mind? This is optional and helps us suggest a realistic approach.',a:['Under ₹25,000','₹25,000–₹50,000','₹50,000–₹1 lakh','₹1–₹3 lakh','₹3 lakh+','Not decided yet','Prefer to discuss']},
    {key:'contact',q:'What name should we use when we follow up?',input:true,placeholder:'Your name'}
  ];
  function bubble(text,who){const el=document.createElement('div');el.className='mcl-chat-msg '+who;el.textContent=text;log.appendChild(el);log.scrollTop=log.scrollHeight;}
  function choose(value){bubble(value,'user');answers[flow[step].key]=value;step++;render();}
  function render(){
    opts.innerHTML='';progress.style.width=Math.min(100,Math.round(step/(flow.length+1)*100))+'%';
    if(step<flow.length){const item=flow[step];bubble(item.q,'bot');
      if(item.a){item.a.forEach(v=>{const b=document.createElement('button');b.type='button';b.className='mcl-chat-choice';b.textContent=v;b.addEventListener('click',()=>choose(v));opts.appendChild(b);});}
      else{const input=document.createElement('input');input.className='mcl-chat-input';input.placeholder=item.placeholder;input.setAttribute('aria-label',item.placeholder);const send=document.createElement('button');send.type='button';send.className='mcl-chat-send';send.textContent='Continue →';send.addEventListener('click',()=>{const v=input.value.trim();if(v)choose(v);else input.focus();});input.addEventListener('keydown',e=>{if(e.key==='Enter')send.click();});opts.append(input,send);input.focus();}
      if(step>0){const back=document.createElement('button');back.type='button';back.className='mcl-chat-choice';back.textContent='← Back';back.addEventListener('click',()=>{step--;delete answers[flow[step].key];log.lastElementChild?.remove();log.lastElementChild?.remove();log.lastElementChild?.remove();render();});opts.appendChild(back);}
    }else{
      bubble('Thanks! Here’s a quick summary of what you shared. Continue to our free consultation form and tell us how to reach you.','bot');
      const summary=flow.map(x=>x.key.toUpperCase()+': '+(answers[x.key]||'Not provided')).join('\n');
      const card=document.createElement('div');card.className='mcl-chat-msg bot';card.textContent=summary;log.appendChild(card);
      const copy=document.createElement('button');copy.type='button';copy.className='mcl-chat-choice';copy.textContent='Copy my answers';copy.addEventListener('click',()=>{if(navigator.clipboard?.writeText)navigator.clipboard.writeText(summary).then(()=>{copy.textContent='Copied ✓';}).catch(()=>{copy.textContent='Copy unavailable';});});
      const consult=document.createElement('button');consult.type='button';consult.className='mcl-chat-send';consult.textContent='Continue to free consultation →';consult.addEventListener('click',()=>{try{sessionStorage.setItem('mclConsultationSummary',summary);}catch(e){}if(typeof window.openReservation==='function')window.openReservation();else location.hash='#ask-crow';});
      opts.append(copy,consult);
    }
  }
  function reset(){step=0;Object.keys(answers).forEach(k=>delete answers[k]);log.innerHTML='';render();}
  launcher.addEventListener('click',()=>{panel.classList.add('open');launcher.style.display='none';if(!log.children.length)reset();});
  panel.querySelector('#mcl-chat-close').addEventListener('click',()=>{panel.classList.remove('open');launcher.style.display='flex';});
  reset();
})();