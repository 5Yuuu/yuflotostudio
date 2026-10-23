document.querySelectorAll('[data-package]').forEach(a=>a.addEventListener('click',()=>document.querySelector('#package').value=a.dataset.package));
document.querySelector('#copy').onclick=async()=>{
 const business=document.querySelector('#business').value.trim();
 const message=document.querySelector('#message').value.trim();
 const selectedPackage=document.querySelector('#package').value;
 const brief=`Hi Yui,\n\nI’m interested in ${selectedPackage}.\nBusiness / brand: ${business||'[your business]'}\n\n${message}`;
 try{await navigator.clipboard.writeText(brief);document.querySelector('#copy-status').textContent='Copied! Open Instagram and paste your enquiry into a message to @yufloto.';}
 catch{document.querySelector('#copy-status').textContent='Copy the enquiry below, then send it to @yufloto on Instagram.';let fallback=document.querySelector('#brief-fallback');if(!fallback){fallback=document.createElement('textarea');fallback.id='brief-fallback';fallback.readOnly=true;document.querySelector('#copy-status').after(fallback);}fallback.value=brief;fallback.select();}
};

function loadVideo(video){
 let changed=false;
 video.querySelectorAll('source[data-src]').forEach(source=>{if(!source.getAttribute('src')){source.src=source.dataset.src;changed=true;}});
 if(video.dataset.poster&&!video.poster)video.poster=video.dataset.poster;
 if(changed){video.preload='auto';video.load();}
}
const reelPreviews=document.querySelectorAll('.reel-preview');
const previewLoader=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 if(isIntersecting&&!matchMedia('(prefers-reduced-motion: reduce)').matches){loadVideo(target);previewLoader.unobserve(target);}
}),{rootMargin:'200px 0px'});
const previewObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 if(isIntersecting&&!document.hidden&&!matchMedia('(prefers-reduced-motion: reduce)').matches){loadVideo(target);target.muted=true;target.play().catch(()=>{});}else target.pause();
}),{threshold:.15});
reelPreviews.forEach(video=>{previewLoader.observe(video);previewObserver.observe(video);});
document.addEventListener('visibilitychange',()=>{reelPreviews.forEach(video=>{const box=video.getBoundingClientRect();if(!document.hidden&&box.top<innerHeight&&box.bottom>0&&box.left<innerWidth&&box.right>0&&!matchMedia('(prefers-reduced-motion: reduce)').matches){loadVideo(video);video.play().catch(()=>{});}else video.pause();});});

const themeToggle=document.querySelector('#theme-toggle');
function setAppearance(mode){document.documentElement.dataset.theme=mode;themeToggle.setAttribute('aria-pressed',String(mode==='dark'));themeToggle.setAttribute('aria-label',mode==='dark'?'Switch to light appearance':'Switch to dark appearance');themeToggle.querySelector('.theme-toggle-label').textContent=mode==='dark'?'Light':'Dark';}
const requestedTheme=new URLSearchParams(location.search).get('theme');
setAppearance(requestedTheme==='dark'?'dark':requestedTheme==='light'?'light':(localStorage.getItem('yufloto-appearance')||'light'));
themeToggle.addEventListener('click',()=>{const mode=document.documentElement.dataset.theme==='dark'?'light':'dark';setAppearance(mode);localStorage.setItem('yufloto-appearance',mode);const next=new URL(location.href);next.searchParams.set('theme',mode);history.replaceState(null,'',next);});

const heroFilms=[...document.querySelectorAll('.intro-film-clip')];
const heroSection=document.querySelector('.intro-editorial');
const prefersStill=matchMedia('(prefers-reduced-motion: reduce)');
let filmIndex=0,filmVisible=false,filmTimer;
function stopHeroFilm(){clearTimeout(filmTimer);heroFilms.forEach(video=>video.pause());}
function playHeroFilm(){stopHeroFilm();if(!filmVisible||document.hidden||prefersStill.matches||document.documentElement.dataset.theme!=='dark')return;const current=heroFilms[filmIndex];heroFilms.forEach((video,i)=>video.classList.toggle('active',i===filmIndex));loadVideo(current);current.currentTime=0;current.muted=true;current.play().catch(()=>{});filmTimer=setTimeout(()=>{filmIndex=(filmIndex+1)%heroFilms.length;playHeroFilm()},Number(current.dataset.duration)||3000);}
if(heroFilms.length){new IntersectionObserver(entries=>{filmVisible=entries[0].isIntersecting;playHeroFilm()},{threshold:.1}).observe(heroSection);document.addEventListener('visibilitychange',playHeroFilm);prefersStill.addEventListener('change',playHeroFilm);}

new MutationObserver(()=>playHeroFilm()).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

const mobileMenuToggle=document.querySelector('.mobile-menu-toggle');
function closeMobileMenu(){document.querySelector('header').classList.remove('menu-open');mobileMenuToggle.setAttribute('aria-expanded','false');mobileMenuToggle.setAttribute('aria-label','Open navigation');}
mobileMenuToggle.addEventListener('click',()=>{const open=mobileMenuToggle.getAttribute('aria-expanded')!=='true';document.querySelector('header').classList.toggle('menu-open',open);mobileMenuToggle.setAttribute('aria-expanded',String(open));mobileMenuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
document.querySelectorAll('header nav a').forEach(link=>link.addEventListener('click',closeMobileMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMobileMenu();});

const mobileGreeting=document.querySelector('.intro-character');
function positionMobileGreeting(){
 if(!matchMedia('(max-width:700px)').matches)return;
 const description=document.querySelector('.intro-description');
 const sectionRect=heroSection.getBoundingClientRect(),textRect=description.getBoundingClientRect();
 mobileGreeting.style.top=Math.max(120,textRect.top-sectionRect.top+textRect.height/2-mobileGreeting.offsetHeight/2)+'px';
}
function replayMobileGreeting(){
 if(!matchMedia('(max-width:700px)').matches||prefersStill.matches)return;
 positionMobileGreeting();
 mobileGreeting.classList.remove('greeting-replay');
 void mobileGreeting.offsetWidth;
 mobileGreeting.classList.add('greeting-replay');
}
themeToggle.addEventListener('click',replayMobileGreeting);
window.addEventListener('resize',()=>{if(matchMedia('(max-width:700px)').matches)positionMobileGreeting();else mobileGreeting.style.removeProperty('top');});
replayMobileGreeting();

const personalFilm=heroFilms[0];
const personalSource=personalFilm.querySelector('source[data-mobile-src]');
const mobileFilmLayout=matchMedia('(max-width:700px)');
function configurePersonalFilm(){
 const mobile=mobileFilmLayout.matches;
 const source=mobile?personalSource.dataset.mobileSrc:personalSource.dataset.desktopSrc;
 personalFilm.dataset.duration=mobile?'6900':'5000';
 personalSource.dataset.src=source;
 if(personalSource.getAttribute('src')&&personalSource.getAttribute('src')!==source){personalSource.setAttribute('src',source);personalFilm.load();}
}
configurePersonalFilm();
mobileFilmLayout.addEventListener('change',()=>{configurePersonalFilm();playHeroFilm();});
