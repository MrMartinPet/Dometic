import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {restaurants} from './restaurants.mjs';
import {fetchMenus,restorePrevious} from './sources.mjs';
const output=new URL('../data.json',import.meta.url);
let previous;
try{previous=JSON.parse(await readFile(output,'utf8'));restorePrevious(previous.restaurants)}catch{}
const result=await fetchMenus();
result.restaurants=restaurants.map(config=>{const r=result.restaurants.find(x=>x.id===config.id)||config;return {...config,...r,name:config.name,coupon:config.coupon,rank:restaurants.findIndex(x=>x.id===config.id)+1};});
await mkdir(new URL('../images/',import.meta.url),{recursive:true});
for(const r of result.restaurants){
 const saved=[];
 for(const [i,source] of (r.imageData||[]).entries()){
  if(source.startsWith('images/')){saved.push(source);continue;}
  const match=source.match(/^data:image\/(jpeg|png|webp);base64,(.+)$/);if(!match)continue;
  const bytes=Buffer.from(match[2],'base64'),hash=createHash('sha256').update(bytes).digest('hex').slice(0,12),ext=match[1]==='jpeg'?'jpg':match[1];
  const name=r.id+'-'+r.imageYear+'-w'+r.imageWeek+'-'+(i+1)+'-'+hash+'.'+ext;
  await writeFile(new URL('../images/'+name,import.meta.url),bytes);saved.push('images/'+name);
 }
 r.imageData=saved;
}
result.hosting='GitHub Pages';result.updateMethod='GitHub Actions';
await writeFile(output,JSON.stringify(result,null,2)+'\n');
console.log('Updated '+result.restaurants.length+' restaurants: '+result.restaurants.map(r=>r.id+'='+r.state).join(', '));
