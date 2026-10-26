import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';import{restaurants}from'./restaurants.mjs';import{isoWeek,parseMenu,facebookImageUrls,facebookPostLinks,fetchWebsiteMenu}from'./sources.mjs';
assert.deepEqual(restaurants.slice(0,6).map(r=>r.id),['jives','ehns','lafamiglia','thaipalatset','eddies','fyran']);assert.equal(restaurants.filter(r=>r.coupon).length,6);assert.equal(new Set(restaurants.map(r=>r.id)).size,restaurants.length);
const data=JSON.parse(await readFile(new URL('../data.json',import.meta.url)));assert.deepEqual(data.restaurants.map(r=>r.id),restaurants.map(r=>r.id));
assert.deepEqual(isoWeek('2027-01-01'),{year:2026,week:53});
assert.equal(parseMenu('Lunchmeny v.44\nMåndag\nRätt ett\nTisdag\nRätt två').week,44);
const client=await readFile(new URL('../app.js',import.meta.url),'utf8');new Function(client);assert.ok(!client.includes('openai'));assert.ok(!client.includes('chatgpt.site'));assert.ok(!client.includes('data-edit'));assert.ok(!client.includes('manual'));console.log('Order, coupon flags, 14 sources, dates and GitHub-only client validated');

const pictures=facebookImageUrls('<img class="scaledImage" src="https://scontent.xx.fbcdn.net/cover.jpg" alt="May be an image of sushi and text"><img class="scaledImage" src="https://scontent.xx.fbcdn.net/menu.jpg" alt="May be an image of text">');assert.equal(pictures[0].url,'https://scontent.xx.fbcdn.net/menu.jpg');

// Public post discovery supports regular, escaped and pfbid links without crossing pages.
assert.deepEqual(facebookPostLinks('https://www.facebook.com/ehnskok/posts/pfbidA1234567890/', 'ehnskok'), ['https://www.facebook.com/ehnskok/posts/pfbidA1234567890/']);
assert.deepEqual(facebookPostLinks('href="https:\\/\\/www.facebook.com\\/ehnskok\\/posts\\/123456789012/"', 'ehnskok'), ['https://www.facebook.com/ehnskok/posts/123456789012/']);
assert.deepEqual(facebookPostLinks('https://www.facebook.com/otherpage/posts/123456789012/', 'ehnskok'), []);
assert.ok(client.includes('Visa Facebook-sidan')&&client.includes('facebookPage(r)')&&client.includes('Kopiera sidlänken'));

const helliden={id:'helliden',daily:true,source:'https://hellidensslott.se/veckans-lunch/'};
const sampleHtml='<h3>Meny vecka 44</h3><p>Måndag:</p><p>Kyckling med potatis</p><p>Tisdag:</p><p>Fisk med ris</p>';
const mock=async url=>{
 if(!url.includes('/wp-json/'))throw Error('Testad webbstörning');
 return new Response(JSON.stringify([{content:{rendered:sampleHtml}}]),{status:200,headers:{'content-type':'application/json'}});
};
const recovered=await fetchWebsiteMenu(helliden,'2026-10-26T13:00:00.000Z',mock,{year:2026,week:44});
assert.equal(recovered.state,'parsed');
assert.equal(recovered.fetchSource,'WordPress-API');
assert.equal(recovered.menu?.week,44);
assert.equal(recovered.menu?.days?.Måndag?.dishes[0],'Kyckling med potatis');
const stale=await fetchWebsiteMenu(helliden,'2026-10-26T13:00:00.000Z',async()=>new Response('<h3>Meny vecka 43</h3><p>Måndag:</p><p>Gammal rätt</p><p>Tisdag:</p><p>Gammal fisk</p>'),{year:2026,week:44});
assert.equal(stale.state,'unavailable');
assert.equal(stale.menu,null);
console.log('Helliden WordPress-fallback och veckokontroll testade');
