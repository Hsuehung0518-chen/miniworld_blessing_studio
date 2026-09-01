(function(){
'use strict';
var app=document.getElementById('app');
var views=Array.prototype.slice.call(document.querySelectorAll('.view'));
var toast=document.getElementById('toast');
var state={flow:'gift',template:'琉璃宮燈世界',imageData:'',imageName:'',theme:'dark',font:16};
var templates=[
['水晶仙界藏品','水晶球・仙山雲海・宮闕'],['軟木瓶中世界','軟木塞玻璃器皿・微縮場景'],['卷軸書卷藏品','古卷・題跋・印章'],['玉雕珍藏','翡翠・黃玉・白玉浮雕'],['琉璃宮燈世界','琉璃燈罩・發光微縮景'],['博物館玻璃罩','Bell Jar・展陳銘牌'],['古董珠寶盒世界','開盒展開私人秘境'],['時計時光藏品','懷錶／座鐘中的故事'],['東方屏風立體畫','多層屏風・浮雕山水'],['陶瓷青花器世界','瓷器內外景融合'],['立體書 Pop-up Art','書頁升起微縮世界'],['私人藝術館藏','展櫃・作品燈・收藏編號']];
function $(id){return document.getElementById(id)}
function show(name){views.forEach(function(v){v.classList.toggle('active',v.dataset.view===name)});window.scrollTo(0,0);save()}
function notify(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(function(){toast.classList.remove('show')},1600)}
function esc(s){return String(s||'').trim()}
function derivePlaque(){
  var name=esc($('recipient').value)||'收藏者';
  var p=$('plaquePattern').value;
  if(p==='collection')return name+' · 雅藏';
  if(p==='gift')return '敬贈　'+name;
  if(p==='treasure')return '贈予'+name+' · 珍藏';
  if(p==='madefor')return '為'+name+'珍藏而作';
  return esc($('plaqueCustom').value)||name+' · 雅藏';
}
function applyDerivedPlaque(force){
  if($('plaquePattern').value==='custom'&&!force)return;
  $('plaqueCustom').value=derivePlaque();
}
function save(){try{localStorage.setItem('aacs-v2-1',JSON.stringify({flow:state.flow,template:state.template,theme:state.theme,font:state.font,title:$('title').value,recipient:$('recipient').value,blessing:$('blessing').value,edition:$('edition').value,signature:$('signature').value,referenceBrief:$('referenceBrief').value,world:$('world').value,material:$('material').value,plaquePattern:$('plaquePattern').value,plaqueCustom:$('plaqueCustom').value,scrollMode:$('scrollMode').value}))}catch(e){}}
function restore(){try{var x=JSON.parse(localStorage.getItem('aacs-v2-1')||'null');if(!x)return;state.flow=x.flow||state.flow;state.template=x.template||state.template;state.theme=x.theme||'dark';state.font=x.font||16;['title','recipient','blessing','edition','signature','referenceBrief','world','material','plaquePattern','plaqueCustom','scrollMode'].forEach(function(k){if(x[k]!==undefined&&$(k))$(k).value=x[k]});applyTheme();applyFont()}catch(e){}}
function applyTheme(){document.body.classList.toggle('light',state.theme==='light');$('themeBtn').textContent=state.theme==='light'?'☾':'☀︎'}
function applyFont(){document.documentElement.style.setProperty('--fs',state.font+'px')}
function renderTemplates(){var grid=$('templateGrid');grid.textContent='';templates.forEach(function(t){var b=document.createElement('button');b.type='button';b.className='choice'+(t[0]===state.template?' selected':'');b.innerHTML='<b>'+t[0]+'</b><small>'+t[1]+'</small>';b.addEventListener('click',function(){state.template=t[0];renderTemplates();save()});grid.appendChild(b)})}
function autoFill(){state.template='琉璃宮燈世界';$('title').value='開運招福';$('recipient').value='陳氏家族';$('blessing').value='福氣常在，財運亨通，心想事成，萬事順遂。';$('referenceBrief').value='抬起右前掌的招福貓、粉色櫻花、富士山、紅色鳥居、金元寶、福袋、金幣與開運招福元素。';$('plaquePattern').value='treasure';$('scrollMode').value='scroll';$('world').value='未來光境';$('material').value='琉璃 × 黃銅';applyDerivedPlaque(true);renderTemplates();save()}
function syncPreview(){
  var title=esc($('title').value)||'未命名作品';
  var recipient=esc($('recipient').value)||'珍藏者';
  var blessing=esc($('blessing').value)||'願日日安好';
  var plaque=esc($('plaqueCustom').value)||derivePlaque();
  var brief=esc($('referenceBrief').value)||'未填寫參考圖核心元素';
  $('titlePreview').textContent=title;$('plaquePreview').textContent=plaque;$('scrollPreview').textContent=blessing;$('scrollPreview').classList.toggle('on',$('scrollMode').value==='scroll');
  $('summary').innerHTML='<b>'+title+'</b><br>收藏者：'+recipient+'<br>模板：'+state.template+'<br>世界觀：'+$('world').value+'<br>材質：'+$('material').value+'<br>銘牌：'+plaque+'<br>Edition：'+esc($('edition').value);
  $('referenceSummary').innerHTML='<b>參考圖狀態</b><br>'+(state.imageData?'已載入本機參考圖：'+state.imageName:'尚未載入圖片')+'<br>核心元素：'+brief+'<br><small>目前不會自動把圖片送到 AI；Prompt 會納入您確認的核心元素。</small>';
  $('toResult').disabled=true;save();
}
function buildPrompt(){
  var title=esc($('title').value)||'Untitled';
  var recipient=esc($('recipient').value)||'Collector';
  var blessing=esc($('blessing').value);
  var plaque=esc($('plaqueCustom').value)||derivePlaque();
  var brief=esc($('referenceBrief').value);
  var ref='';
  if(state.imageData||brief){ref=' Preserve the emotional identity of the reference image and retain these confirmed core elements: '+(brief||'the user-provided reference image')+'. Do not replace the hero subject with unrelated objects.';}
  return 'Create a premium personalized AI art collectible, presented as a museum-grade '+state.template+'.'+ref+' Rebuild it as a coherent miniature collectible world. Core world: '+$('world').value+'. Primary materials: '+$('material').value+'. Main artwork title in accurate Traditional Chinese: “'+title+'”. Integrate the dedication as a refined '+($('scrollMode').value==='scroll'?'classical Chinese hanging scroll with calligraphy, restrained seals, aged silk-paper texture':'formal collector inscription')+': “'+blessing+'”. The base must carry a sophisticated gold recessed / relief seal-script-and-clerical-script inspired inscription: “'+plaque+'”. Collector / recipient: “'+recipient+'”. Include Edition '+esc($('edition').value)+' and artist signature / provenance “'+esc($('signature').value)+'” discreetly on the rear or secondary plaque, not competing with the hero artwork. Use cinematic macro photography, convincing miniature scale, handcrafted detail, realistic glass reflections and refraction where applicable, volumetric light, shallow depth of field, elegant negative space, premium 2026 collectible presentation, strong subject separation, no duplicated landmarks, no garbled text, no watermark, no extra limbs, no competing focal point.';
}
function buildCard(){return '《'+(esc($('title').value)||'未命名作品')+'》\n'+state.template+'\n收藏者：'+(esc($('recipient').value)||'—')+'\n銘牌：'+(esc($('plaqueCustom').value)||derivePlaque())+'\nEdition：'+(esc($('edition').value)||'—')+'\n題贈：'+(esc($('blessing').value)||'—')+'\n參考圖核心：'+(esc($('referenceBrief').value)||'—')+'\n落款：'+(esc($('signature').value)||'—')}
function copyText(text){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){notify('已複製')}).catch(function(){fallbackCopy(text)})}else{fallbackCopy(text)}}
function fallbackCopy(text){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');notify('已複製')}catch(e){notify('請長按文字手動複製')}document.body.removeChild(ta)}
function downloadJson(){var data={version:'2.1',title:$('title').value,recipient:$('recipient').value,blessing:$('blessing').value,edition:$('edition').value,signature:$('signature').value,template:state.template,world:$('world').value,material:$('material').value,plaque:$('plaqueCustom').value,plaquePattern:$('plaquePattern').value,dedicationStyle:$('scrollMode').value,referenceImageName:state.imageName,referenceBrief:$('referenceBrief').value,prompt:$('promptOutput').textContent};var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='AI-Art-Collectible-'+(esc($('title').value)||'work')+'.json';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},0)}

document.querySelectorAll('[data-flow]').forEach(function(b){b.addEventListener('click',function(){state.flow=b.dataset.flow;if(state.flow==='auto')autoFill();show('design')})});
document.querySelectorAll('[data-back]').forEach(function(b){b.addEventListener('click',function(){show(b.dataset.back)})});
$('homeBtn').addEventListener('click',function(){show('home')});$('newWork').addEventListener('click',function(){show('design')});$('helpBtn').addEventListener('click',function(){show('help')});
$('themeBtn').addEventListener('click',function(){state.theme=state.theme==='dark'?'light':'dark';applyTheme();save()});
$('fontBtn').addEventListener('click',function(){state.font=state.font>=20?16:state.font+2;applyFont();save();notify('字體 '+state.font+'px')});
$('recipient').addEventListener('input',function(){if($('plaquePattern').value!=='custom')applyDerivedPlaque(true);save()});
$('plaquePattern').addEventListener('change',function(){if(this.value!=='custom')applyDerivedPlaque(true);save()});
$('plaqueCustom').addEventListener('input',function(){$('plaquePattern').value='custom';save()});
$('imageInput').addEventListener('change',function(e){var f=e.target.files&&e.target.files[0];if(!f){state.imageData='';state.imageName='';$('photoPreview').hidden=true;$('imageStatus').textContent='尚未載入圖片。v2.1 會顯示參考圖，但目前未連接 AI Vision 後端，因此不會自動辨識圖片內容。';return}if(!/^image\//.test(f.type)){e.target.value='';$('imageStatus').textContent='請選擇圖片檔';return}if(f.size>8*1024*1024){e.target.value='';$('imageStatus').textContent='圖片請小於 8MB';return}var r=new FileReader();r.onload=function(){state.imageData=r.result;state.imageName=f.name;$('photoPreview').src=r.result;$('photoPreview').hidden=false;$('imageStatus').textContent='已載入：'+f.name+'｜目前僅本機預覽，未送往 AI Vision 分析。';notify('參考圖已載入')};r.onerror=function(){$('imageStatus').textContent='圖片讀取失敗，請重試'};r.readAsDataURL(f)});
$('toPreview').addEventListener('click',function(){syncPreview();show('preview')});
$('generateBtn').addEventListener('click',function(){$('promptOutput').textContent=buildPrompt();$('cardOutput').textContent=buildCard();$('toResult').disabled=false;notify('Prompt 已生成')});
$('toResult').addEventListener('click',function(){if(!$('toResult').disabled)show('result')});$('copyPrompt').addEventListener('click',function(){copyText($('promptOutput').textContent)});$('copyCard').addEventListener('click',function(){copyText($('cardOutput').textContent)});$('downloadJson').addEventListener('click',downloadJson);
['title','blessing','edition','signature','referenceBrief','world','material','scrollMode'].forEach(function(id){$(id).addEventListener('change',save);$(id).addEventListener('input',save)});
restore();renderTemplates();applyTheme();applyFont();if($('plaquePattern').value!=='custom')applyDerivedPlaque(true);
})();