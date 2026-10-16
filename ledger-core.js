(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MWLedger=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION=1,KEY='miniworld:ledger:v1',MAX_BYTES=2*1024*1024;
const statuses=['待盤點','待素材','待驗證','製作中','已交付','暫掛'];
const stages=['母圖','動畫','文字','輸出','交付'];
const levels=['待查證','檔案已查核','本機驗證通過','使用者驗收','實際交付確認'];
const kinds=['母圖','原始MP4','定稿GIF','其他'];
const text=(x,n=2000)=>typeof x==='string'&&x.length<=n;
const uid=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const now=()=>new Date().toISOString();
function empty(){return {schemaVersion:VERSION,updatedAt:now(),exportedAt:null,projects:[],assets:[],evidence:[],recipes:[]};}
function urlOK(s){if(s==='')return true;try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}}
function assert(ok,msg){if(!ok)throw new Error(msg);}
function object(o){return !!o&&typeof o==='object'&&!Array.isArray(o);}
function validate(d){
 assert(object(d),'備份須是物件');assert(d.schemaVersion===VERSION,'不支援此備份版本');
 assert(new TextEncoder().encode(JSON.stringify(d)).length<=MAX_BYTES,'備份超過 2 MB');
 for(const [name,max] of [['projects',500],['assets',2000],['evidence',5000],['recipes',100]]){
  assert(Array.isArray(d[name])&&d[name].length<=max,'資料數量或格式不符：'+name);
  const ids=new Set();for(const row of d[name]){assert(object(row)&&text(row.id,100)&&row.id,'缺少識別碼');assert(!ids.has(row.id),'同一備份內有重複識別碼');ids.add(row.id);}
 }
 const ps=new Set(d.projects.map(p=>p.id));
 for(const p of d.projects){assert(text(p.name,120)&&p.name.trim(),'作品名稱不可空白');assert(statuses.includes(p.status)&&stages.includes(p.stage),'作品狀態或階段不符');for(const k of ['prompt','settings','textStrategy','next','missing','holdReason','notes'])assert(text(p[k]),'作品欄位不符：'+k);for(const k of ['createdAt','updatedAt','checkedAt'])assert(text(p[k],100),'時間欄位不符');}
 for(const a of d.assets){assert(ps.has(a.projectId),'素材沒有對應作品');assert(kinds.includes(a.kind),'素材類別不符');for(const k of ['name','version','location'])assert(text(a[k],500),'素材欄位不符');assert(text(a.url,2000)&&urlOK(a.url),'素材連結須是無帳密的 HTTP(S) 網址');assert(typeof a.verified==='boolean','素材查核狀態不符');}
 for(const e of d.evidence){assert(ps.has(e.projectId),'驗收沒有對應作品');assert(levels.includes(e.level),'證據程度不符');for(const k of ['item','by','date','location','note'])assert(text(e[k],1000),'證據欄位不符');assert(text(e.url,2000)&&urlOK(e.url),'證據連結不安全');assert(typeof e.passed==='boolean','驗收結果不符');}
 for(const r of d.recipes){assert(text(r.name,120)&&object(r.fields)&&Object.keys(r.fields).length<=30,'配方格式不符');for(const [k,v] of Object.entries(r.fields)){assert(text(k,50)&&text(v,10000),'配方內容不符');assert(!['__proto__','constructor','prototype'].includes(k),'配方欄位不安全');}}
 for(const k of ['updatedAt','exportedAt'])assert(d[k]===null||text(d[k],100),'備份時間不符');
 for(const p of d.projects)if(p.status==='已交付')assert(deliveryGaps(d,p.id).length===0,'已交付作品缺成果、來源位置或驗收依據');
 // Whitelist records rather than retaining unknown/prototype-bearing properties.
 const pick=(o,ks)=>Object.fromEntries(ks.map(k=>[k,o[k]]));
 return {schemaVersion:VERSION,updatedAt:d.updatedAt,exportedAt:d.exportedAt,projects:d.projects.map(p=>pick(p,['id','name','stage','status','prompt','settings','textStrategy','next','missing','holdReason','notes','createdAt','updatedAt','checkedAt'])),assets:d.assets.map(a=>pick(a,['id','projectId','kind','name','version','location','url','verified'])),evidence:d.evidence.map(e=>pick(e,['id','projectId','item','level','by','date','location','url','note','passed'])),recipes:d.recipes.map(r=>({id:r.id,name:r.name,fields:Object.fromEntries(Object.entries(r.fields))}))};
}
function deliveryGaps(d,id){const a=d.assets.filter(x=>x.projectId===id),e=d.evidence.filter(x=>x.projectId===id);const located=x=>x.verified&&!!(x.url||x.location.trim());const gaps=[];for(const k of ['母圖','原始MP4','定稿GIF'])if(!a.some(x=>x.kind===k&&located(x)))gaps.push('缺少已查核的'+k+'位置');if(!e.some(x=>x.passed&&['使用者驗收','實際交付確認'].includes(x.level)&&x.item.trim()&&x.by.trim()&&x.date.trim()&&(x.url||x.location.trim())))gaps.push('缺少具位置、日期與確認者的驗收依據');return gaps;}
function parse(s){assert(typeof s==='string'&&new TextEncoder().encode(s).length<=MAX_BYTES,'備份超過 2 MB');return validate(JSON.parse(s));}
function merge(a,b){a=validate(a);b=validate(b);const out=empty();let kept=0;for(const key of ['projects','assets','evidence','recipes']){const map=new Map(a[key].map(x=>[x.id,x]));for(const row of b[key]){if(map.has(row.id)){kept++;continue;}map.set(row.id,row);}out[key]=[...map.values()];}return {data:validate(out),kept};}
function load(storage){const raw=storage.getItem(KEY);return raw?parse(raw):empty();}
function persist(storage,d){const clean=validate(d);storage.setItem(KEY,JSON.stringify(clean));return clean;}
function sample(){const d=empty(),id='mw-demo-001';d.projects.push({id,name:'夢喵・匿名示範',stage:'交付',status:'待盤點',prompt:'',settings:'歷史紀錄：Grok 圖片設為「循環」、約6秒、4:3；實際模型與扣額度未記錄。',textStrategy:'依生成結果判斷：正確原字保留；必要才修字。此歷史定稿保留生成文字。',next:'匯入自己的素材位置與驗收紀錄',missing:'此為匿名示範，未包含私人媒體、提示詞原稿或對話證據。',holdReason:'',notes:'曾確認可愛與可透過 LINE 分享；此描述不是收件端技術驗證。跨母圖移植眼部動態失敗，不再採用。',createdAt:now(),updatedAt:now(),checkedAt:''});for(const [kind,name] of [['母圖','居家背景母圖'],['原始MP4','1000015353.mp4'],['定稿GIF','Mengmiao_Coin_Gift.gif']])d.assets.push({id:uid(),projectId:id,kind,name,version:'歷史採用版，待查核',location:'',url:'',verified:false});return d;}
return {VERSION,KEY,MAX_BYTES,statuses,stages,levels,kinds,uid,now,empty,validate,parse,merge,load,persist,sample,urlOK,deliveryGaps};
});
