import { restaurants as RESTAURANTS } from './restaurants.mjs';
const DAYS=['Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag','Söndag'];
export function decode(s){return s.replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&apos;|&#039;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>');}
export function textFromHtml(html){return decode(html.replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<\/(?:p|div|h[1-6]|li|tr|section|article)>|<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,' ')).split('\n').map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean).join('\n');}
export function isoWeek(date){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));const year=d.getUTCFullYear();return {year,week:Math.ceil((((d-new Date(Date.UTC(year,0,1)))/86400000)+1)/7)};}
export function parseMenu(text){
 const heading=/(?:lunchmeny|meny|lunch(?:\s+på[^\n]{0,35})?)\s*(?:för\s*)?(?:vecka|v\s*\.?)[\s:]*(\d{1,2})(?:\s*[,/–-]?\s*(20\d{2}))?/i.exec(text);
 if(!heading)return null;
 const week=+heading[1];if(week<1||week>53)return null;
 let body=text.slice(heading.index+heading[0].length).split(/Copyright|Kontakta oss|Vi serverar endast|Med reservation|Logga in/i)[0];
 const matches=[...body.matchAll(/(?:^|\n)(Måndag|Tisdag|Onsdag|Torsdag|Fredag|Lördag|Söndag)\s*(?:\d{1,2}[/.-]\d{1,2})?\s*:?\s*(?=\n|$)/gi)];
 if(matches.length<2)return null;
 const days={};let shared='';
 for(let i=0;i<matches.length;i++){
  const m=matches[i],day=DAYS.find(d=>d.toLowerCase()===m[1].toLowerCase());let section=body.slice(m.index+m[0].length,matches[i+1]?.index??body.length).trim();
  const cut=section.search(/(?:^|\n)(?:Veckans\s+(?:vegetariska?|sallad)|Fredagsfika)\s*:/i);
  if(cut>=0){shared+='\n'+section.slice(cut);section=section.slice(0,cut);}
  const lines=section.split('\n').map(s=>s.trim()).filter(s=>s.length>2&&s.length<450);
  const dessert=lines.filter(s=>/^(?:Dessert|Efterrätt|Fredagsdessert)\s*:/i.test(s));
  days[day]={dishes:lines.filter(s=>!dessert.includes(s)).slice(0,7),dessert:dessert.join('\n')};
 }
 const veg=shared.match(/Veckans\s+vegetariska?\s*:\s*([^\n]+)/i)?.[1]||'';
 const friday=shared.match(/Fredagsfika\s*:\s*([^\n]+)/i)?.[1]||'';
 if(friday&&days.Fredag)days.Fredag.dessert=friday;
 const info=text.slice(Math.max(0,heading.index-2500),heading.index);
 const price=info.match(/(?:Pris\s*(?:för lunchbuffé)?\s*:?|Vuxen\s*:)\s*(\d{2,3})\s*(?:kronor|kr|:-)/i)?.[1];
 const includes=info.match(/inkl\.?\.?\s*([^\n]+)/i)?.[1]||info.match(/Varje vardag erbjuder vi:\s*\n([^\n]+)/i)?.[1]||'';
 return {week,year:heading[2]?+heading[2]:null,days,vegetarian:veg,price:price?Number(price):null,includes:includes.slice(0,220),note:/Fredagsdessert ingår ej/i.test(info)?'Fredagsdessert ingår inte vid avhämtning eller utkörning.':''};
}
const SNAPSHOT={};
for(const record of Object.values(SNAPSHOT)){if(record.menu&&!record.menu.year)record.menu.year=isoWeek(record.checkedAt.slice(0,10)).year;}
const FACEBOOK_POSTS={
 lafamiglia:{week:43,year:2026,url:'https://www.facebook.com/lafamigliatidaholm/posts/1728390382622102/'},
 ehns:{week:43,year:2026,url:'https://www.facebook.com/ehnskok/posts/1780033190794531/'}
};
function stockWeek(){return isoWeek(new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Stockholm',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()));}
export function facebookImageUrls(html){
 const high=[...html.matchAll(/"contentUrl":"((?:\\.|[^"\\])*)"/g)].map(m=>{try{return JSON.parse('"'+m[1]+'"')}catch{return ''}}).filter(u=>{try{return new URL(u).hostname.endsWith('.fbcdn.net')}catch{return false}});
 return [...html.matchAll(/<img\b[^>]*>/gi)].map(m=>m[0]).filter(tag=>/scaledImage/i.test(tag)).map(tag=>{const url=decode(tag.match(/\bsrc="([^"]+)"/i)?.[1]||'');const file=url.split('?')[0].split('/').pop();return {url:high.find(u=>u.split('?')[0].split('/').pop()===file)||url,alt:decode(tag.match(/\balt="([^"]*)"/i)?.[1]||'')};}).filter(x=>{try{return new URL(x.url).hostname.endsWith('.fbcdn.net')}catch{return false}}).reverse().sort((a,b)=>Number(/bild av text|image of text/i.test(b.alt))-Number(/bild av text|image of text/i.test(a.alt))).slice(0,3);
}
export function parseFacebookPost(html){
 const text=textFromHtml(html).split(/\nVisa mer|\nKommentar|\nDela/)[0].replace(/\.\.\.\s*/g,'').replace(/\n(\d+)\s*$/,'');
 const week=Number(text.match(/(?:vecka|v\.)\s*(\d{1,2})/i)?.[1]||0);
 const timestamp=html.match(/data-utime="(\d+)"/)?.[1];const publishedAt=timestamp?new Date(Number(timestamp)*1000).toISOString():null;
 let normalized=text.replace(/(Veckans\s+(?:vegetariska?|Sallad))\s*\n/gi,'$1: ');
 normalized=normalized.split(/\nÖppettider:/)[0];
 const menu=parseMenu(normalized);
 const includes=text.match(/(?:Ink\.|Inkl\.?|I lunchpriset ingår alltid)\s*([^\n]+)/i)?.[1]||'';
 const hours=text.match(/(?:Öppettider:\s*|Alla vardagar\s*)(\d{1,2}[:.]\d{2}\s*[-–]\s*\d{1,2}[:.]\d{2})/i)?.[1]||'';
 if(menu){menu.includes=includes;menu.year=publishedAt?new Date(publishedAt).getUTCFullYear():null;}
 return {menu,week,publishedAt,includes,hours,images:facebookImageUrls(html)};
}
async function htmlGet(url){const response=await fetch(url,{signal:AbortSignal.timeout(8000),headers:{Accept:'text/html'}});if(!response.ok)throw Error('Source unavailable');return response.text();}
async function imageInline(url){const response=await fetch(url,{signal:AbortSignal.timeout(7000)});if(!response.ok||!/^image\/(?:jpeg|png|webp)/i.test(response.headers.get('content-type')||''))throw Error('Image unavailable');const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length>900000)throw Error('Image too large');let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return 'data:'+response.headers.get('content-type').split(';')[0]+';base64,'+btoa(binary);}
async function facebookMenu(r,checkedAt){
 const expected=stockWeek(),seed=FACEBOOK_POSTS[r.id],page=new URL(r.facebook).pathname.split('/').filter(Boolean)[0];
 const candidates=[];
 if(seed&&seed.week===expected.week&&seed.year===expected.year)candidates.push(seed.url);
 // Only inspect public links from this restaurant's page; no login/session is used.
 try{if(candidates.length)throw Error('Known current-week post');const html=await htmlGet(r.facebook);const links=[...html.matchAll(new RegExp('(?:https?:\\/\\/www\\.facebook\\.com)?\\/'+page+'\\/posts\\/(?:[^"<>\\s]*?\\/)?(\\d{8,})\\/?','g'))];for(const link of links.slice(0,6)){const url='https://www.facebook.com/'+page+'/posts/'+link[1]+'/';if(!candidates.includes(url))candidates.push(url);}}catch{}
 for(const source of candidates.slice(0,4)){
  try{
   const html=await htmlGet('https://www.facebook.com/plugins/post.php?href='+encodeURIComponent(source)+'&show_text=true&width=500');
   const parsed=parseFacebookPost(html);if(parsed.week!==expected.week||!parsed.publishedAt)continue;
   const age=Date.now()-new Date(parsed.publishedAt).getTime();if(age< -86400000||age>14*86400000)continue;
   const imageData=[];
   if(!parsed.menu)for(const pic of parsed.images.slice(0,1)){try{imageData.push(await imageInline(pic.url))}catch{}}
   if(!parsed.menu&&!imageData.length)continue;
   return {...r,...parsed,images:undefined,source,imageData,imageWeek:parsed.week,imageYear:expected.year,state:parsed.menu?'parsed':'image',checkedAt};
  }catch{}
 }
 const old=SNAPSHOT[r.id];
 if(old)return {...old,snapshot:true,state:old.menu?'snapshot':'image',checkedAt,menuFetchedAt:old.menuFetchedAt||old.checkedAt};
 return {...r,state:'unavailable',menu:null,checkedAt};
}

export function restorePrevious(records){for(const r of records||[]){if(r.menu||r.imageData?.length)SNAPSHOT[r.id]=r;}}
export const initialSnapshots=SNAPSHOT;
export async function fetchMenus(){
 const checkedAt=new Date().toISOString();
 const results=await Promise.all(RESTAURANTS.map(async r=>{
  try {
   if(!r.daily && !['turbinen','thaipalatset'].includes(r.id))return {...r,state:'general',menu:null,checkedAt};
   if(FACEBOOK_POSTS[r.id])return await facebookMenu(r,checkedAt);
   const response=await fetch(r.source,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'Lunchkollen/1.0 (+Tidaholm lunch menu reader)','Accept':'text/html'}});
   if(!response.ok)throw Error('Källan svarade inte');
   const html=await response.text();const text=textFromHtml(html);const menu=r.daily?parseMenu(text):null;
   if(r.daily)return {...r,menu,state:menu?'parsed':'unavailable',checkedAt};
   if(r.id==='thaipalatset')return {...r,menu:null,state:'general',checkedAt,description:/lunchbuffé[^.]*dessert/i.test(text)?'Lunchbuffé med förrätt, huvudrätt och dessert.':'Asiatisk lunchbuffé. Se restaurangens uppgifter.',dessert:'Dessert ingår enligt turistinformationen. Sort anges inte.',includes:'Allmän information – dagens exakta bufférätter och pris är inte bekräftade.'};
   const imageTags=[...html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m=>({url:new URL(decode(m[1]),r.source).href,tag:m[0]}));
   const images=imageTags.filter(x=>/meny/i.test(x.url)&&!/(logo|t[aå]rt)/i.test(x.url)).slice(0,2).map(x=>x.url);
   return {...r,menu:null,state:'general',checkedAt,images,description:'Lunch, smörgåsar, pajer och sallader. Se aktuell meny hos Turbinen.',dessert:'Bakverk och fika finns. Dagens sort och vad som ingår i lunchen är inte bekräftat.',includes:'Menyn kan publiceras som bild. Öppna originalmenyn för priser och aktuellt utbud.'};
  }catch{const old=SNAPSHOT[r.id];return old?{...r,...old,state:old.menu?'snapshot':'general',snapshot:true,checkedAt,menuFetchedAt:old.menuFetchedAt||old.checkedAt}:{...r,menu:null,state:'unavailable',checkedAt};}
 }));return {checkedAt,restaurants:results};
}
