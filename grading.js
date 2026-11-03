/* Local numerical equivalence checks; never execute student input as JavaScript. */
(function(root){
'use strict';
const functions=new Set(['sin','cos','tan','sinh','cosh','tanh','exp','sqrt','log','abs','atan','asin','acos','atan2','conj']);
function normalize(s){return String(s).trim().replace(/π/g,'pi').replace(/−|–/g,'-').replace(/×|·/g,'*').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\bln\b/g,'log').replace(/\b(?:infinity|infty)\b/gi,'Infinity');}
function compile(input,vars,math){
 if(!input.trim())throw Error('Enter an answer.');
 if(input.length>400)throw Error('Please use an expression under 400 characters.');
 const node=math.parse(normalize(input));let count=0;
 node.traverse(n=>{
  if(++count>180)throw Error('Expression too long.');
  if(!['ConstantNode','SymbolNode','OperatorNode','FunctionNode','ParenthesisNode'].includes(n.type))throw Error('Use a mathematical expression, not an assignment or a list.');
  if(n.type==='OperatorNode'&&!['+','-','*','/','^','!'].includes(n.op))throw Error('Unsupported operator.');
  if(n.type==='FunctionNode'&&(!n.fn.isSymbolNode||!functions.has(n.fn.name)))throw Error('Use standard functions such as sin, cos, exp, sqrt, log, or sinh.');
  if(n.type==='SymbolNode'&&![...vars,'pi','e','i',...functions].includes(n.name))throw Error('Unknown symbol '+n.name+'. '+(vars.length?'Use '+vars.join(', ')+'.':'This answer should be a number.'));
  if(n.type==='ConstantNode'&&typeof n.value==='number'&&(!Number.isFinite(n.value)||Math.abs(n.value)>1e7))throw Error('Use finite constants.');
  if(n.type==='OperatorNode'&&n.op==='^'&&n.args[1].isConstantNode&&Math.abs(n.args[1].value)>1000)throw Error('Exponent is too large.');
 });
 return node.compile();
}
function complex(v){if(typeof v==='number')return {re:v,im:0};if(v&&typeof v.re==='number'&&typeof v.im==='number')return v;throw Error('The expression must give a number.');}
function equivalent(input,expected,vars,math){
 const actual=compile(input,vars,math), reference=compile(expected,vars,math);
 const points=vars.length?[.13,.37,.71,1.17,1.63,2.31,2.93,3.71,4.19,5.13,6.31,7.17]:[0];
 let checked=0;
 for(const p of points){
  const scope={};for(const v of vars)scope[v]=v==='s'?p+10:v==='x'?(checked%2===0?-p/10:p/10):v==='z'?math.complex(p,checked%2===0?-.6*p-.21:.7*p+.31):p;
  let a,b;
  try{b=complex(reference.evaluate(scope));if(!Number.isFinite(b.re)||!Number.isFinite(b.im))continue;a=complex(actual.evaluate(scope));}
  catch(e){throw Error('Cannot evaluate this expression. Check parentheses and function arguments.');}
  checked++;
  if(!Number.isFinite(a.re)||!Number.isFinite(a.im))return false;
  if(Math.hypot(a.re-b.re,a.im-b.im)>1e-8+1e-7*Math.hypot(b.re,b.im))return false;
 }
 if(!checked)throw Error('The expression could not be checked.');
 return true;
}
function grade(q,inputs,math){
 if(q.kind==='q1')return {correct:inputs===q.correct,fields:[],error:null};
 const values=q.answers.map((_,i)=>String(inputs[i]||''));
 if(q.unordered){
  const unused=new Set(q.answers.map((_,i)=>i)),fields=[];
  for(const input of values){if(!input.trim()){fields.push({correct:false,error:'No answer entered.'});continue;}
   let found=-1,error=null;
   for(const j of unused){try{if(equivalent(input,q.answers[j].expression,q.variables,math)){found=j;break;}}catch(e){error=e.message;break;}}
   if(found>=0)unused.delete(found);fields.push({correct:found>=0,error});
  }
  return {correct:fields.every(f=>f.correct),fields,error:null};
 }
 const fields=values.map((v,i)=>{if(!v.trim())return {correct:false,error:'No answer entered.'};if(q.answers[i].kind==='classification'){const text=v.trim().toLowerCase().replace(/[.!]$/,'').replace(/\s+/g,' ');return {correct:q.answers[i].accepted.includes(text),error:null};}try{return {correct:equivalent(v,q.answers[i].expression,q.variables,math),error:null};}catch(e){return {correct:false,error:e.message};}});
 return {correct:fields.every(f=>f.correct),fields,error:null};
}
function shuffle(a,rng=Math.random){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function sample(bank,mode,previous=[],rng=Math.random){
 const selected=[];let families=new Set();
 for(const [subject,count]of [['complex',mode==='q1'?5:3],['ode',mode==='q1'?5:2]]){
  let pool=shuffle(bank.filter(q=>q.kind===mode&&q.subject===subject),rng);
  pool.sort((a,b)=>Number(previous.includes(a.id))-Number(previous.includes(b.id)));
  for(const q of pool){if(families.has(q.family))continue;selected.push(q);families.add(q.family);if(selected.filter(x=>x.subject===subject).length===count)break;}
 }
 if(selected.length!==(mode==='q1'?10:5))throw Error('Question bank incomplete.');
 return selected.map(q=>({...q,options:q.options?shuffle(q.options,rng):undefined}));
}
const api={normalize,equivalent,grade,sample,shuffle};if(typeof module!=='undefined')module.exports=api;else root.Practice=api;
})(typeof globalThis!=='undefined'?globalThis:this);
