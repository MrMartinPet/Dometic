import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';import{restaurants}from'./restaurants.mjs';import{isoWeek,parseMenu}from'./sources.mjs';
assert.deepEqual(restaurants.slice(0,6).map(r=>r.id),['jives','ehns','lafamiglia','thaipalatset','eddies','fyran']);assert.equal(restaurants.filter(r=>r.coupon).length,6);assert.equal(new Set(restaurants.map(r=>r.id)).size,restaurants.length);
const data=JSON.parse(await readFile(new URL('../data.json',import.meta.url)));assert.deepEqual(data.restaurants.map(r=>r.id),restaurants.map(r=>r.id));
assert.deepEqual(isoWeek('2027-01-01'),{year:2026,week:53});
assert.equal(parseMenu('Lunchmeny v.44\nMåndag\nRätt ett\nTisdag\nRätt två').week,44);
const client=await readFile(new URL('../app.js',import.meta.url),'utf8');new Function(client);assert.ok(!client.includes('openai'));assert.ok(!client.includes('chatgpt.site'));assert.ok(!client.includes('data-edit'));assert.ok(!client.includes('manual'));console.log('Order, coupon flags, 14 sources, dates and GitHub-only client validated');
