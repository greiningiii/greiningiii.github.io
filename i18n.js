/* Display text only. IDs, stored choices and grading expressions are language independent. */
'use strict';
const I18n=(()=>{
 const en={
  title:'STÆ302G · Practice room',course:'Mathematical Analysis III',room:'The practice room',language:'Language',session:'Practice session',format:'Question format',
  multiple:'Multiple choice',multipleCount:'10 questions · 2 points each',short:'Answers only',shortCount:'5 questions · 4 points each',newSet:'↻ New random set',
  help:'How to enter mathematical answers',
  syntax:'Use plain expressions: `1/3`, `sqrt(2)`, `pi`, `i`, `exp(-t)`, `sin(2*t)`, or `e^(-t)`. Use parentheses around an entire exponent. Use `conj(z)` for the complex conjugate of `z`. `ln` and `log` both mean the natural logarithm. Enter only the expression, without `u(t)=`.',
  grading:'Equivalent expressions are accepted. Roots may be entered in any order. For a matrix, fill in each entry separately. For singularities, use names such as `simple pole`, `pole of order 2`, or `removable singularity`. Each question is worth 4 points; all its fields must be correct for those points. An unrecognised expression is marked “check notation”; you can edit it and check again.',
  loading:'Loading the question bank…',check:'Check my answers ↗',reveal:'View answers',saved:'Your answers stay in this browser.',
  practiceTitle:'Practice the exam format',practiceText:'Q1 mixes five complex-analysis and five ODE questions. Q2 mixes three and two. Each set is worth 20 points.',
  learnTitle:'Learn from the answer',learnText:'Check your work, reveal an explanation, then try again. This is practice: nothing is submitted to Canvas.',
  courseTitle:'Built from the course',bank:'{total} questions: {q1} multiple choice and {q2} answer-only.',footer:'Practice, not assessment.',
  resetTitle:'Start a fresh set?',resetText:'Your current answers will be erased.',cancel:'Keep working',replace:'Start new set',noscript:'This practice site needs JavaScript to select questions and check answers.',
  storage:'Storage unavailable; answers remain in this tab.',answered:'{n} / {total} answered',answer:'Answer & explanation',set:'{mode} practice set · 20 points',
  q1Instructions:'Choose one answer for each question. No deductions for incorrect answers.',q2Instructions:'Give a final answer for each problem. Equivalent expressions are accepted.',
  complex:'Complex analysis',ode:'ODEs',points:'{n} pts',question:'Question {letter}',value:'Value {n} (any order)',yourAnswer:'Your answer',classification:'e.g. removable singularity',expression:'Expression in {variables}',exact:'Exact value, e.g. 1/3',
  classNote:'Use the usual names; give the order of any pole.',unorderedNote:'Enter all values, in any order.',variableNote:'Use {variables}. Exact expressions are preferred.',complexNote:'Use {variables}; conj(z) means the complex conjugate of z.',exactNote:'Enter an exact value.',
  correct:'✓ Correct',notation:'! Check notation',incorrect:'× Not yet correct',retry:'Try again, or view the answer below.',score:'{n} of {total} questions correct',viewed:'Practice score · answers have been viewed. Edit your answers and check again.',review:'Review the feedback below. You can edit an answer and check again.',revised:'Some answer options have been updated. Please answer those items and check again.',loadError:'The practice set could not be loaded. Please reload the page.',unknownSymbol:'Unknown symbol {symbol}. Use {variables}.',numberOnly:'Unknown symbol {symbol}. This answer should be a number.',parseError:'Cannot read this expression. Check notation, parentheses and function arguments.'
 };
 const is={
  title:'STÆ302G · Æfingasíða',course:'Stærðfræðigreining III',room:'Æfingasíða',language:'Tungumál',session:'Æfingalota',format:'Tegund spurninga',
  multiple:'Krossaspurningar',multipleCount:'10 spurningar · 2 stig hver',short:'Aðeins svör',shortCount:'5 spurningar · 4 stig hver',newSet:'↻ Nýjar slembivaldar spurningar',
  help:'Hvernig á að slá inn stærðfræðileg svör',
  syntax:'Notið segðir eins og `1/3`, `sqrt(2)`, `pi`, `i`, `exp(-t)`, `sin(2*t)` eða `e^(-t)`. Setjið sviga utan um allan veldisvísinn. Notið `conj(z)` fyrir samok `z`. Bæði `ln` og `log` tákna náttúrlega logrann. Sláið aðeins inn segðina, án `u(t)=`.',
  grading:'Jafngildar segðir eru samþykktar. Rætur má gefa í hvaða röð sem er. Fyrir fylki skal fylla út hvert stak sérstaklega. Fyrir sérstöðupunkta má nota heiti eins og `einfalt skaut`, `skaut af stigi 2` eða `afmáanlegur sérstöðupunktur`. Ensk heiti eru einnig samþykkt. Hver spurning gefur 4 stig; allir reitir hennar þurfa að vera réttir til að fá stigin. Ef segð er ekki þekkt birtist „Athugið rithátt“. Þið getið breytt svarinu og athugað aftur.',
  loading:'Sæki spurningasafnið…',check:'Athuga svörin mín ↗',reveal:'Sýna svör',saved:'Svörin ykkar eru vistuð í þessum vafra.',
  practiceTitle:'Æfið prófformið',practiceText:'Í Q1 eru fimm spurningar úr tvinnfallagreiningu og fimm úr afleiðujöfnum. Í Q2 eru þær þrjár og tvær. Hvor hluti gefur 20 stig.',
  learnTitle:'Lærið af lausninni',learnText:'Athugið svörin, skoðið skýringu og reynið aftur. Þetta er æfing: engu er skilað í Canvas.',
  courseTitle:'Úr námsefninu',bank:'{total} spurningar: {q1} krossaspurningar og {q2} spurningar þar sem aðeins er gefið svar.',footer:'Æfing, ekki námsmat.',
  resetTitle:'Byrja á nýjum spurningum?',resetText:'Núverandi svörum verður eytt.',cancel:'Halda áfram',replace:'Byrja nýja lotu',noscript:'Æfingasíðan þarf JavaScript til að velja spurningar og athuga svör.',
  storage:'Ekki er hægt að vista; svörin haldast á þessum flipa.',answered:'{n} / {total} svarað',answer:'Svar og skýring',set:'{mode} æfingalota · 20 stig',
  q1Instructions:'Veljið eitt svar við hverri spurningu. Ekki er dregið frá fyrir röng svör.',q2Instructions:'Gefið lokasvar við hverri spurningu. Jafngildar segðir eru samþykktar.',
  complex:'Tvinnfallagreining',ode:'Afleiðujöfnur',points:'{n} stig',question:'Spurning {letter}',value:'Gildi {n} (í hvaða röð sem er)',yourAnswer:'Svarið ykkar',classification:'t.d. afmáanlegur sérstöðupunktur',expression:'Segð með {variables}',exact:'Nákvæmt gildi, t.d. 1/3',
  classNote:'Notið venjuleg heiti; gefið stig hvers skauts.',unorderedNote:'Gefið öll gildin í hvaða röð sem er.',variableNote:'Notið {variables}. Gefið helst nákvæmar segðir.',complexNote:'Notið {variables}; conj(z) táknar samok z.',exactNote:'Gefið nákvæmt gildi.',
  correct:'✓ Rétt',notation:'! Athugið rithátt',incorrect:'× Ekki rétt enn',retry:'Reynið aftur eða skoðið svarið hér fyrir neðan.',score:'{n} af {total} spurningum rétt',viewed:'Æfingastig · svör hafa verið skoðuð. Breytið svörunum og athugið aftur.',review:'Skoðið endurgjöfina hér fyrir neðan. Þið getið breytt svari og athugað aftur.',revised:'Sumum svarmöguleikum hefur verið breytt. Svarið þeim spurningum og athugið aftur.',loadError:'Ekki tókst að sækja æfingalotuna. Endurhlaðið síðuna.',unknownSymbol:'Óþekkt tákn {symbol}. Notið {variables}.',numberOnly:'Óþekkt tákn {symbol}. Svarið á að vera tala.',parseError:'Ekki tókst að lesa segðina. Athugið rithátt, sviga og viðföng falla.'
 };
 const errors={
  'No answer entered.':'Ekkert svar gefið.', 'Enter an answer.':'Sláið inn svar.',
  'Please use an expression under 400 characters.':'Notið segð með færri en 400 stöfum.', 'Expression too long.':'Segðin er of löng.',
  'Use a mathematical expression, not an assignment or a list.':'Notið stærðfræðilega segð, ekki gildisgjöf eða lista.', 'Unsupported operator.':'Ekki er hægt að nota þennan reiknivirkja.',
  'Use standard functions such as sin, cos, exp, sqrt, log, or sinh.':'Notið föll eins og sin, cos, exp, sqrt, log eða sinh.',
  'Use finite constants.':'Notið endanlega fasta.', 'Exponent is too large.':'Veldisvísirinn er of stór.', 'The expression must give a number.':'Segðin þarf að gefa tölu.',
  'Cannot evaluate this expression. Check parentheses and function arguments.':'Ekki tókst að reikna gildi segðarinnar. Athugið sviga og viðföng falla.', 'The expression could not be checked.':'Ekki tókst að athuga segðina.'
 };
 function t(language,key,values={}){const copy={en,is}[language][key];if(copy===undefined)throw Error('Missing UI translation: '+key);return copy.replace(/\{(\w+)\}/g,(_,k)=>values[k]??'{'+k+'}');}
 function view(q,language){return language==='is'?{...q,...q.translations.is}:q;}
 function choice(q,value,language){return language==='is'?q.translations.is.options[q.options.indexOf(value)]:value;}
 function error(message,language){if(language==='en')return message;if(errors[message])return errors[message];const match=message.match(/^Unknown symbol (.+)\. (?:Use (.+)\.|This answer should be a number\.)$/);return match?t(language,match[2]?'unknownSymbol':'numberOnly',{symbol:match[1],variables:match[2]}):t(language,'parseError');}
 function apply(language){
  document.documentElement.lang=language;document.title=t(language,'title');
  for(const node of document.querySelectorAll('[data-i18n]')){node.replaceChildren();t(language,node.dataset.i18n).split(/(`[^`]+`)/g).forEach(part=>{if(part.startsWith('`')){const code=document.createElement('code');code.textContent=part.slice(1,-1);node.append(code);}else node.append(document.createTextNode(part));});}
  for(const node of document.querySelectorAll('[data-i18n-label]'))node.setAttribute('aria-label',t(language,node.dataset.i18nLabel));
  for(const lang of ['en','is'])document.getElementById('language-'+lang).setAttribute('aria-pressed',String(language===lang));
 }
 return {t,view,choice,error,apply,en,is};
})();
if(typeof module!=='undefined')module.exports=I18n;
