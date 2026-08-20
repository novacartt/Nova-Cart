const products=[
{id:1,name:'Nova X Pro 5G',price:29999,icon:'📱',cat:'Mobiles'},
{id:2,name:'AirBook 14 Laptop',price:54999,icon:'💻',cat:'Laptops'},
{id:3,name:'Vision 55 Smart TV',price:39999,icon:'📺',cat:'TV'},
{id:4,name:'SoundPods Pro',price:4999,icon:'🎧',cat:'Audio'},
{id:5,name:'FitWatch Ultra',price:7999,icon:'⌚',cat:'Wearables'},
{id:6,name:'CoolHome 1.5T AC',price:32999,icon:'❄️',cat:'Appliances'},
{id:7,name:'PowerPhone Lite',price:14999,icon:'📱',cat:'Mobiles'},
{id:8,name:'GameBook 15',price:69999,icon:'💻',cat:'Laptops'}];
const money=n=>'₹'+n.toLocaleString('en-IN');
function render(){const grid=document.querySelector('#productGrid');if(!grid)return;let q=(document.querySelector('#search')?.value||'').toLowerCase();let arr=products.filter(p=>(p.name+p.cat).toLowerCase().includes(q));let s=document.querySelector('#sort')?.value;if(s==='low')arr.sort((a,b)=>a.price-b.price);if(s==='high')arr.sort((a,b)=>b.price-a.price);grid.innerHTML=arr.map(p=>`<article class="card"><div class="pic">${p.icon}</div><div class="muted">${p.cat}</div><h3>${p.name}</h3><div class="price">${money(p.price)}</div><div class="muted">EMI from ${money(Math.ceil(p.price*.8/12))}/mo*</div><a class="btn primary" href="product.html?id=${p.id}">View & Buy on EMI</a></article>`).join('')||'<p>No products found.</p>'}
document.addEventListener('input',e=>{if(e.target.id==='search')render()});document.addEventListener('change',e=>{if(e.target.id==='sort')render()});render();updateCart();
function updateCart(){let c=JSON.parse(localStorage.getItem('cart')||'[]');document.querySelectorAll('#cartCount').forEach(x=>x.textContent=c.length)}
