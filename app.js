(function(){
'use strict';
var views=[].slice.call(document.querySelectorAll('.view'));
var toast=document.getElementById('toast');
var state={theme:'dark',font:16,lastView:'home'};
function $(id){return document.getElementById(id)}
function clean(v,f){v=String(v||'').trim();return v||f||''}
function notify(m){toast.textContent=m;toast.classList.add('show');window.clearTimeout(notify.t);notify.t=window.setTimeout(function(){toast.classList.remove('show')},1600)}
function show(name){views.forEach(function(v){v.classList.toggle('active',v.dataset.view===name)});state.lastView=name;try{window.scrollTo(0,0)}catch(e){}savePrefs()}
function savePrefs(){try{localStorage.setItem('aacs-v23-prefs',JSON.stringify(state))}catch(e){}}
function restorePrefs(){try{var x=JSON.parse(localStorage.getItem('aacs-v23-prefs')||'null');if(x){state.theme=x.theme||'dark';state.font=x.font||16}}catch(e){}applyTheme();applyFont()}
function applyTheme(){document.body.classList.toggle('light',state.theme==='light');$('themeBtn').textContent=state.theme==='light'?'☾':'☀︎'}
function applyFont(){document.documentElement.style.setProperty('--fs',state.font+'px')}
function copyText(text){if(!text){notify('目前沒有可複製內容');return}if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){notify('已複製')}).catch(function(){fallbackCopy(text)})}else{fallbackCopy(text)}}
function fallbackCopy(text){var ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,ta.value.length);try{document.execCommand('copy');notify('已複製')}catch(e){notify('請長按文字手動複製')}document.body.removeChild(ta)}
var adapterNames={universal:'通用圖生圖',chatgpt:'ChatGPT Images',gemini:'Gemini Images',midjourney:'Midjourney',ideogram:'Ideogram',flux:'FLUX / ComfyUI',custom:'自訂／其他'};
function textInstruction(mode,title){if(mode==='none')return 'Do not add any text, letters, logos or typographic elements.';if(mode==='space')return 'Do not render the final wording. Reserve a clean, elegant physical plaque or sign area for later typography post-production.';return 'Integrate the exact Traditional Chinese title “'+title+'” as clean, legible physical lettering; prioritize character accuracy and do not invent extra text.'}
function fidelityInstruction(v){if(v==='faithful')return 'Preserve the hero subject, pose, expression, identity cues and overall visual hierarchy very closely.';if(v==='creative')return 'Keep the unmistakable hero identity but allow a more imaginative spatial reconstruction into a miniature collectible world.';return 'Preserve the unmistakable hero identity and emotional tone while moderately rebuilding the surroundings into a coherent miniature world.'}
function adapterIntro(target){if(target==='chatgpt')return 'Use the image already attached in this conversation as the visual reference. Follow the transformation instructions below directly.';if(target==='gemini')return 'Use the image currently provided to the image generator as the primary reference and transform it according to the following art direction.';if(target==='midjourney')return 'Use the reference image already supplied in your Midjourney workflow as the dominant subject/composition reference; treat the text below as art direction, not as a request to invent a new unrelated subject.';if(target==='ideogram')return 'Use the uploaded reference image as the primary visual reference, with special care for clean layout and any requested typography.';if(target==='flux')return 'Image-to-image direction: use the loaded reference image as the source identity/composition anchor; preserve the hero while rebuilding the environment according to this prompt.';if(target==='custom')return 'Use the reference image you have already loaded in this image-generation app as the primary visual source.';return 'Use the uploaded reference image as the primary visual reference.'}
function adapterTail(target){if(target==='midjourney')return ' Keep one clear hero subject and strong silhouette. Apply your preferred image-reference strength inside Midjourney rather than inventing extra subjects.';if(target==='ideogram')return ' Keep typography isolated on a simple physical sign surface if text rendering is enabled.';if(target==='flux')return ' Keep denoise/image-to-image strength moderate enough to retain the hero identity; tune this in your own FLUX/ComfyUI workflow.';return ''}
function quickPrompt(){var target=$('qTarget').value,template=$('qTemplate').value,world=$('qWorld').value,material=$('qMaterial').value,core=clean($('qCore').value,'the unmistakable hero subject and signature motifs from the reference image'),title=clean($('qTitle').value,'開運招福'),ratio=$('qRatio').value,textMode=$('qTextMode').value,strength=$('qStrength').value;return adapterIntro(target)+'\n\nTransform the reference into a premium museum-grade miniature '+template+'. '+fidelityInstruction(strength)+' Preserve these confirmed core elements: '+core+'. Do not replace the hero with unrelated objects.\n\nRebuild the scene as a true three-dimensional MiniWorld rather than simply placing the flat reference image inside a container. Core world: '+world+'. Primary materials: '+material+'. Create layered foreground, midground and background, handcrafted miniature architecture/props appropriate to the reference, believable scale cues, and a polished collectible-object presentation.\n\n'+textInstruction(textMode,title)+'\n\nVisual quality: cinematic macro photography, tilt-shift miniature scale, convincing handcrafted detail, realistic material response, glass reflections and refraction where applicable, volumetric light, shallow depth of field, elegant negative space, premium 2026 collectible presentation, strong subject separation. Composition '+ratio+'. No duplicated hero, no duplicated landmarks, no distorted face, no extra limbs or paws, no garbled text, no watermark, no logo, no competing focal point.'+adapterTail(target)}
function quickPromptZh(){var target=$('qTarget').value,template=$('qTemplate').value,world=$('qWorld').value,material=$('qMaterial').value,core=clean($('qCore').value,'參考圖中最具辨識度的主角與標誌性元素'),title=clean($('qTitle').value,'開運招福'),ratio=$('qRatio').value,textMode=$('qTextMode').value,strength=$('qStrength').value;var intro={chatgpt:'使用本對話中已附加的圖片作為主要視覺參考，直接依照以下轉換指令執行。',gemini:'使用目前提供給圖像生成器的圖片作為主要參考，依照以下藝術方向進行轉換。',midjourney:'以已提供給 Midjourney 工作流的參考圖作為主體與構圖依據，下列文字只作為藝術指導，不要另行創造無關主角。',ideogram:'以上傳的參考圖作為主要視覺依據，並特別注意乾淨版面與指定文字的正確呈現。',flux:'圖生圖方向：以已載入的參考圖作為主體身分與構圖錨點，在保留主角的前提下依下列提示重構環境。',custom:'使用你已在目前圖像生成 App 載入的參考圖作為主要視覺來源。',universal:'使用已上傳的參考圖作為主要視覺依據。'}[target]||'使用已上傳的參考圖作為主要視覺依據。';var fidelity=strength==='faithful'?'高度保留主角、姿勢、表情、身分特徵與原始視覺層級。':strength==='creative'?'保留一眼可辨識的主角身分，但允許更具想像力地重構為微縮收藏世界。':'保留一眼可辨識的主角身分與情緒氣質，同時適度把周圍場景重構成連貫的微縮世界。';var text=textMode==='none'?'不要加入任何文字、字母、Logo 或排版元素。':textMode==='space'?'不要直接生成最終文字；請保留乾淨、優雅的實體銘牌或文字區，方便後製加入文字。':'將精確繁體中文「'+title+'」整合為乾淨、清楚可讀的實體文字，優先確保中文字形正確，不要自行增加其他文字。';return intro+'\n\n將參考圖轉換為博物館收藏級的微縮「'+template+'」。'+fidelity+' 必須保留以下已確認核心元素：'+core+'。不可把主角替換成無關物件。\n\n把場景真正重構成立體 MiniWorld，而不是把平面原圖直接塞進容器。核心世界觀：'+world+'。主要材質：'+material+'。建立清楚的前景、中景、背景層次，加入符合參考圖語意的手工微縮建築與道具、可信的尺度線索，以及精緻收藏藝術品展示感。\n\n'+text+'\n\n視覺品質：電影級微距攝影、移軸微縮比例、可信手作細節、真實材質反應；適用處加入玻璃反射與折射、體積光、淺景深、優雅留白、2026 高級收藏品呈現、主體清楚分離。構圖比例 '+ratio+'。不得重複主角、不得重複地標、不得扭曲臉部、不得多出肢體或腳掌、不得產生亂碼文字、不得有浮水印、Logo 或搶焦點元素。';}
var generatedQuick={zh:'',en:''},activePromptLang='zh';
function syncBilingualEditors(source){if(source==='zh')$('quickOutputBiZh').value=$('quickOutputZh').value;else if(source==='en')$('quickOutputBiEn').value=$('quickOutputEn').value;else if(source==='bizh')$('quickOutputZh').value=$('quickOutputBiZh').value;else if(source==='bien')$('quickOutputEn').value=$('quickOutputBiEn').value;$('editStatus').textContent='✎ 已修改提示詞；複製時會使用你目前的內容。'}
function setPromptLang(lang){activePromptLang=lang;document.querySelectorAll('[data-prompt-lang]').forEach(function(b){b.classList.toggle('active',b.dataset.promptLang===lang)});$('promptZhPane').classList.toggle('active',lang==='zh');$('promptEnPane').classList.toggle('active',lang==='en');$('promptBiPane').classList.toggle('active',lang==='bi')}
function loadGeneratedPrompts(){generatedQuick.zh=quickPromptZh();generatedQuick.en=quickPrompt();$('quickOutputZh').value=generatedQuick.zh;$('quickOutputEn').value=generatedQuick.en;$('quickOutputBiZh').value=generatedQuick.zh;$('quickOutputBiEn').value=generatedQuick.en;$('editStatus').textContent='✓ 已生成中英文版本，可直接在框內修改。';aestheticHistory=[];$('undoAesthetic').disabled=true;$('aestheticStatus').textContent='尚未套用微調。';}
function currentPromptText(){if(activePromptLang==='en')return $('quickOutputEn').value;if(activePromptLang==='bi')return '【繁體中文】\n'+$('quickOutputBiZh').value+'\n\n【English】\n'+$('quickOutputBiEn').value;return $('quickOutputZh').value;}

var aestheticHistory=[];
var aestheticRules={
dreamy:{
 zh:'美學微調：增加夢幻層次，以柔和光暈、漂浮微粒、淡雅薄霧、柔焦散景與細緻體積光營造如夢似境的氛圍，但不要犧牲主角辨識度與材質真實感。',
 en:'Aesthetic refinement: add a dreamier atmosphere with soft glow, floating particles, delicate mist, gentle bokeh and refined volumetric light, while preserving clear hero identity and believable materials.'
},
realistic:{
 zh:'美學微調：提升寫實感，強化真實材質紋理、自然陰影、微小瑕疵、玻璃折射、金屬反射、可信尺度與攝影式光線，避免塑膠感與過度光滑。',
 en:'Aesthetic refinement: increase realism with authentic material textures, natural shadows, subtle imperfections, convincing glass refraction, metal reflections, believable scale cues and photographic lighting; avoid plastic-looking surfaces and over-smoothing.'
},
premium:{
 zh:'美學微調：提升收藏級質感，使用克制而精準的高端材質、精品展示比例、博物館級打光、優雅留白與細緻工藝，避免過量裝飾與廉價奢華感。',
 en:'Aesthetic refinement: elevate the collectible to a more premium level through restrained luxury materials, museum-grade lighting, elegant negative space, refined craftsmanship and sophisticated presentation; avoid excessive ornament and cheap-looking opulence.'
},
eastern:{
 zh:'美學微調：加深東方美學語彙，以含蓄留白、卷軸構圖、玉石／琉璃／木雕／金箔細節、雲氣紋、亭閣、山水層次與雅緻色彩秩序呈現，不要堆砌俗套符號。',
 en:'Aesthetic refinement: deepen the East Asian visual language through restrained negative space, scroll-like composition, jade/liuli/wood/gold-leaf details, subtle cloud motifs, pavilion and landscape layering, and elegant color hierarchy without cliché symbol overload.'
},
miniature:{
 zh:'美學微調：強化微縮世界感，加入清楚的比例線索、極細小手作建築與道具、前中後景層次、移軸景深與微距視角，讓作品像真實可收藏的實體模型。',
 en:'Aesthetic refinement: intensify the miniature-world effect with clear scale cues, tiny handcrafted architecture and props, strong foreground-midground-background layering, tilt-shift depth of field and macro perspective so the result reads as a real collectible model.'
},
warm:{
 zh:'美學微調：增加溫暖感，採柔和金色環境光、暖白高光、舒適色溫與細膩柔影，營造祝福、安定、親近的情緒，但不要整體過曝或偏橘。',
 en:'Aesthetic refinement: make the scene warmer with soft golden ambient light, warm-white highlights, comforting color temperature and delicate soft shadows, creating a blessing-like and intimate mood without overexposure or excessive orange tint.'
},
lessText:{
 zh:'文字策略微調：減少畫面文字，只保留最重要的主標題或一塊主要銘牌，其餘祝福文字改為背面、次要牌或留待後製；保持畫面乾淨、避免文字搶焦點。',
 en:'Typography refinement: reduce visible text in the artwork. Keep only the essential title or one primary plaque; move secondary dedication text to the rear/secondary plaque or reserve it for post-production. Keep the composition clean and prevent typography from competing with the hero.'
}
};
function activeEditors(){
 if(activePromptLang==='en') return [{el:$('quickOutputEn'),lang:'en'},{el:$('quickOutputBiEn'),lang:'en',mirror:true}];
 if(activePromptLang==='bi') return [{el:$('quickOutputBiZh'),lang:'zh'},{el:$('quickOutputBiEn'),lang:'en'}];
 return [{el:$('quickOutputZh'),lang:'zh'},{el:$('quickOutputBiZh'),lang:'zh',mirror:true}];
}
function appendIncremental(el,text,key){
 var tag='\n\n['+key+'] ';
 if(el.value.indexOf('['+key+'] ')!==-1) return false;
 el.value=(el.value||'').replace(/\s+$/,'')+tag+text;
 return true;
}
function applyAesthetic(key){
 var rule=aestheticRules[key]; if(!rule)return;
 var snapshot={zh:$('quickOutputZh').value,en:$('quickOutputEn').value,bizh:$('quickOutputBiZh').value,bien:$('quickOutputBiEn').value,status:$('aestheticStatus').textContent};
 var changed=false;
 if(activePromptLang==='bi'){
   changed=appendIncremental($('quickOutputBiZh'),rule.zh,key)||changed;
   changed=appendIncremental($('quickOutputBiEn'),rule.en,key)||changed;
   $('quickOutputZh').value=$('quickOutputBiZh').value;
   $('quickOutputEn').value=$('quickOutputBiEn').value;
 }else if(activePromptLang==='en'){
   changed=appendIncremental($('quickOutputEn'),rule.en,key)||changed;
   $('quickOutputBiEn').value=$('quickOutputEn').value;
 }else{
   changed=appendIncremental($('quickOutputZh'),rule.zh,key)||changed;
   $('quickOutputBiZh').value=$('quickOutputZh').value;
 }
 if(changed){
   aestheticHistory.push(snapshot);
   if(aestheticHistory.length>12)aestheticHistory.shift();
   $('undoAesthetic').disabled=false;
   $('aestheticStatus').textContent='✓ 已增量套用「'+document.querySelector('[data-aesthetic="'+key+'"]').textContent+'」；原本手動修改內容已保留。';
   $('editStatus').textContent='✎ Prompt 已加入美學增量；複製時會使用目前版本。';
   notify('已套用美學微調');
 }else{
   $('aestheticStatus').textContent='此微調已套用過，未重複疊加。';
   notify('此微調已存在');
 }
}
function undoAesthetic(){
 var s=aestheticHistory.pop(); if(!s){$('undoAesthetic').disabled=true;return}
 $('quickOutputZh').value=s.zh;$('quickOutputEn').value=s.en;$('quickOutputBiZh').value=s.bizh;$('quickOutputBiEn').value=s.bien;
 $('aestheticStatus').textContent='↶ 已復原上一個美學微調。';
 $('undoAesthetic').disabled=aestheticHistory.length===0;
 notify('已復原上一個微調');
}
function plaqueText(){var n=clean($('recipient').value,'收藏者'),p=$('plaquePattern').value;if(p==='collection')return n+' · 雅藏';if(p==='gift')return '敬贈　'+n;if(p==='treasure')return '贈予'+n+' · 珍藏';if(p==='madefor')return '為'+n+'珍藏而作';return clean($('plaqueCustom').value,n+' · 雅藏')}
function syncPlaque(){if($('plaquePattern').value!=='custom')$('plaqueCustom').value=plaqueText()}
function fullPrompt(){var title=clean($('title').value,'未命名作品'),recipient=clean($('recipient').value,'收藏者'),blessing=clean($('blessing').value,'願日日安好'),brief=clean($('referenceBrief').value,'the unmistakable hero subject from the reference image'),plaque=clean($('plaqueCustom').value,plaqueText());return 'Create a premium personalized AI art collectible, presented as a museum-grade '+$('template').value+'. Use the reference image already provided to the chosen image generator and preserve its emotional identity. Retain these confirmed core elements: '+brief+'. Rebuild them as a coherent miniature collectible world rather than a flat image-in-container effect. Core world: '+$('world').value+'. Primary materials: '+$('material').value+'. Main artwork title in accurate Traditional Chinese: “'+title+'”. Integrate the dedication as a refined '+($('scrollMode').value==='scroll'?'classical Chinese hanging scroll with calligraphy, restrained seals and aged silk-paper texture':'formal collector inscription')+': “'+blessing+'”. The base must carry a sophisticated gold recessed / relief seal-script-and-clerical-script inspired inscription: “'+plaque+'”. Collector / recipient: “'+recipient+'”. Include Edition '+clean($('edition').value,'No. 001 / 001')+' and artist signature / provenance “'+clean($('signature').value,'')+'” discreetly on a rear or secondary plaque, not competing with the hero artwork. Use cinematic macro photography, convincing miniature scale, handcrafted detail, realistic reflections/refraction where applicable, volumetric light, shallow depth of field, elegant negative space, premium 2026 collectible presentation, strong subject separation, no duplicated hero or landmarks, no garbled text, no watermark, no extra limbs, no competing focal point.'}
function resetQuick(){$('qTarget').value='universal';$('qTemplate').value='琉璃宮燈世界';$('qWorld').value='未來光境 × 日式開運庭園';$('qMaterial').value='琉璃 × 黃銅 × 金箔';$('qCore').value='抬起右前掌的橘白招福貓、溫柔表情、金色鈴鐺與開運吊牌、粉色櫻花、富士山、紅色鳥居、金元寶、福袋、金幣與開運招福氛圍';$('qTitle').value='開運招福';$('qRatio').value='9:16';$('qTextMode').value='strict';$('qStrength').value='balanced';$('quickOutputPanel').hidden=true;generatedQuick={zh:'',en:''};aestheticHistory=[];$('undoAesthetic').disabled=true;$('aestheticStatus').textContent='尚未套用微調。';notify('已恢復招福貓範例')}
document.querySelectorAll('[data-mode]').forEach(function(b){b.addEventListener('click',function(){show(b.dataset.mode)})});document.querySelectorAll('[data-go]').forEach(function(b){b.addEventListener('click',function(){show(b.dataset.go)})});
$('helpBtn').addEventListener('click',function(){show('help')});$('themeBtn').addEventListener('click',function(){state.theme=state.theme==='dark'?'light':'dark';applyTheme();savePrefs()});$('fontBtn').addEventListener('click',function(){state.font=state.font>=20?16:state.font+2;applyFont();savePrefs();notify('字體 '+state.font+'px')});
$('quickGenerate').addEventListener('click',function(){loadGeneratedPrompts();$('adapterName').textContent=adapterNames[$('qTarget').value];$('quickHint').textContent='下一步：可先在預覽框微調美學語句，再回到 '+adapterNames[$('qTarget').value]+'，確認參考圖仍已載入後貼上指令生成。';$('quickOutputPanel').hidden=false;setPromptLang('zh');notify('中英文快速指令已生成')});document.querySelectorAll('[data-prompt-lang]').forEach(function(b){b.addEventListener('click',function(){setPromptLang(b.dataset.promptLang)})});document.querySelectorAll('[data-aesthetic]').forEach(function(b){b.addEventListener('click',function(){applyAesthetic(b.dataset.aesthetic)})});$('undoAesthetic').addEventListener('click',undoAesthetic);$('quickOutputZh').addEventListener('input',function(){syncBilingualEditors('zh')});$('quickOutputEn').addEventListener('input',function(){syncBilingualEditors('en')});$('quickOutputBiZh').addEventListener('input',function(){syncBilingualEditors('bizh')});$('quickOutputBiEn').addEventListener('input',function(){syncBilingualEditors('bien')});$('copyCurrent').addEventListener('click',function(){copyText(currentPromptText())});$('copyBilingual').addEventListener('click',function(){copyText('【繁體中文】\n'+$('quickOutputBiZh').value+'\n\n【English】\n'+$('quickOutputBiEn').value)});$('restoreGenerated').addEventListener('click',function(){if(!generatedQuick.zh)loadGeneratedPrompts();else{$('quickOutputZh').value=generatedQuick.zh;$('quickOutputEn').value=generatedQuick.en;$('quickOutputBiZh').value=generatedQuick.zh;$('quickOutputBiEn').value=generatedQuick.en;$('editStatus').textContent='✓ 已還原本次生成內容。'}notify('已還原生成內容')});$('quickReset').addEventListener('click',resetQuick);
$('recipient').addEventListener('input',function(){syncPlaque()});$('plaquePattern').addEventListener('change',function(){syncPlaque()});$('plaqueCustom').addEventListener('input',function(){$('plaquePattern').value='custom'});$('fullGenerate').addEventListener('click',function(){syncPlaque();var p=fullPrompt();$('fullOutput').textContent=p;$('collectorCard').textContent='《'+clean($('title').value,'未命名作品')+'》｜'+$('template').value+'｜收藏者：'+clean($('recipient').value,'—')+'｜銘牌：'+plaqueText()+'｜Edition：'+clean($('edition').value,'—');$('fullOutputPanel').hidden=false;notify('收藏級 Prompt 已生成')});$('copyFull').addEventListener('click',function(){copyText($('fullOutput').textContent)});
document.querySelectorAll('[data-guide]').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('[data-guide]').forEach(function(x){x.classList.toggle('active',x===b)});document.querySelectorAll('.guide-page').forEach(function(p){p.classList.toggle('active',p.id===b.dataset.guide)})})});
restorePrefs();syncPlaque();
})();
