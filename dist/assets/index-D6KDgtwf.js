function kp(e,t){for(var n=0;n<t.length;n++){const a=t[n];if(typeof a!="string"&&!Array.isArray(a)){for(const l in a)if(l!=="default"&&!(l in e)){const s=Object.getOwnPropertyDescriptor(a,l);s&&Object.defineProperty(e,l,s.get?s:{enumerable:!0,get:()=>a[l]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))a(l);new MutationObserver(l=>{for(const s of l)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(l){const s={};return l.integrity&&(s.integrity=l.integrity),l.referrerPolicy&&(s.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?s.credentials="include":l.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(l){if(l.ep)return;l.ep=!0;const s=n(l);fetch(l.href,s)}})();function Sp(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Ed={exports:{}},ul={},Pd={exports:{}},ae={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Gr=Symbol.for("react.element"),_p=Symbol.for("react.portal"),Np=Symbol.for("react.fragment"),Cp=Symbol.for("react.strict_mode"),zp=Symbol.for("react.profiler"),Ep=Symbol.for("react.provider"),Pp=Symbol.for("react.context"),Tp=Symbol.for("react.forward_ref"),Dp=Symbol.for("react.suspense"),Lp=Symbol.for("react.memo"),Ip=Symbol.for("react.lazy"),so=Symbol.iterator;function Mp(e){return e===null||typeof e!="object"?null:(e=so&&e[so]||e["@@iterator"],typeof e=="function"?e:null)}var Td={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Dd=Object.assign,Ld={};function Kn(e,t,n){this.props=e,this.context=t,this.refs=Ld,this.updater=n||Td}Kn.prototype.isReactComponent={};Kn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Kn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Id(){}Id.prototype=Kn.prototype;function ni(e,t,n){this.props=e,this.context=t,this.refs=Ld,this.updater=n||Td}var ri=ni.prototype=new Id;ri.constructor=ni;Dd(ri,Kn.prototype);ri.isPureReactComponent=!0;var io=Array.isArray,Md=Object.prototype.hasOwnProperty,ai={current:null},Rd={key:!0,ref:!0,__self:!0,__source:!0};function Od(e,t,n){var a,l={},s=null,i=null;if(t!=null)for(a in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(s=""+t.key),t)Md.call(t,a)&&!Rd.hasOwnProperty(a)&&(l[a]=t[a]);var o=arguments.length-2;if(o===1)l.children=n;else if(1<o){for(var d=Array(o),p=0;p<o;p++)d[p]=arguments[p+2];l.children=d}if(e&&e.defaultProps)for(a in o=e.defaultProps,o)l[a]===void 0&&(l[a]=o[a]);return{$$typeof:Gr,type:e,key:s,ref:i,props:l,_owner:ai.current}}function Rp(e,t){return{$$typeof:Gr,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function li(e){return typeof e=="object"&&e!==null&&e.$$typeof===Gr}function Op(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var oo=/\/+/g;function Tl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Op(""+e.key):t.toString(36)}function ka(e,t,n,a,l){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(s){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case Gr:case _p:i=!0}}if(i)return i=e,l=l(i),e=a===""?"."+Tl(i,0):a,io(l)?(n="",e!=null&&(n=e.replace(oo,"$&/")+"/"),ka(l,t,n,"",function(p){return p})):l!=null&&(li(l)&&(l=Rp(l,n+(!l.key||i&&i.key===l.key?"":(""+l.key).replace(oo,"$&/")+"/")+e)),t.push(l)),1;if(i=0,a=a===""?".":a+":",io(e))for(var o=0;o<e.length;o++){s=e[o];var d=a+Tl(s,o);i+=ka(s,t,n,d,l)}else if(d=Mp(e),typeof d=="function")for(e=d.call(e),o=0;!(s=e.next()).done;)s=s.value,d=a+Tl(s,o++),i+=ka(s,t,n,d,l);else if(s==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function la(e,t,n){if(e==null)return e;var a=[],l=0;return ka(e,a,"","",function(s){return t.call(n,s,l++)}),a}function Bp(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Qe={current:null},Sa={transition:null},Ap={ReactCurrentDispatcher:Qe,ReactCurrentBatchConfig:Sa,ReactCurrentOwner:ai};function Bd(){throw Error("act(...) is not supported in production builds of React.")}ae.Children={map:la,forEach:function(e,t,n){la(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return la(e,function(){t++}),t},toArray:function(e){return la(e,function(t){return t})||[]},only:function(e){if(!li(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};ae.Component=Kn;ae.Fragment=Np;ae.Profiler=zp;ae.PureComponent=ni;ae.StrictMode=Cp;ae.Suspense=Dp;ae.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ap;ae.act=Bd;ae.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=Dd({},e.props),l=e.key,s=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(s=t.ref,i=ai.current),t.key!==void 0&&(l=""+t.key),e.type&&e.type.defaultProps)var o=e.type.defaultProps;for(d in t)Md.call(t,d)&&!Rd.hasOwnProperty(d)&&(a[d]=t[d]===void 0&&o!==void 0?o[d]:t[d])}var d=arguments.length-2;if(d===1)a.children=n;else if(1<d){o=Array(d);for(var p=0;p<d;p++)o[p]=arguments[p+2];a.children=o}return{$$typeof:Gr,type:e.type,key:l,ref:s,props:a,_owner:i}};ae.createContext=function(e){return e={$$typeof:Pp,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Ep,_context:e},e.Consumer=e};ae.createElement=Od;ae.createFactory=function(e){var t=Od.bind(null,e);return t.type=e,t};ae.createRef=function(){return{current:null}};ae.forwardRef=function(e){return{$$typeof:Tp,render:e}};ae.isValidElement=li;ae.lazy=function(e){return{$$typeof:Ip,_payload:{_status:-1,_result:e},_init:Bp}};ae.memo=function(e,t){return{$$typeof:Lp,type:e,compare:t===void 0?null:t}};ae.startTransition=function(e){var t=Sa.transition;Sa.transition={};try{e()}finally{Sa.transition=t}};ae.unstable_act=Bd;ae.useCallback=function(e,t){return Qe.current.useCallback(e,t)};ae.useContext=function(e){return Qe.current.useContext(e)};ae.useDebugValue=function(){};ae.useDeferredValue=function(e){return Qe.current.useDeferredValue(e)};ae.useEffect=function(e,t){return Qe.current.useEffect(e,t)};ae.useId=function(){return Qe.current.useId()};ae.useImperativeHandle=function(e,t,n){return Qe.current.useImperativeHandle(e,t,n)};ae.useInsertionEffect=function(e,t){return Qe.current.useInsertionEffect(e,t)};ae.useLayoutEffect=function(e,t){return Qe.current.useLayoutEffect(e,t)};ae.useMemo=function(e,t){return Qe.current.useMemo(e,t)};ae.useReducer=function(e,t,n){return Qe.current.useReducer(e,t,n)};ae.useRef=function(e){return Qe.current.useRef(e)};ae.useState=function(e){return Qe.current.useState(e)};ae.useSyncExternalStore=function(e,t,n){return Qe.current.useSyncExternalStore(e,t,n)};ae.useTransition=function(){return Qe.current.useTransition()};ae.version="18.3.1";Pd.exports=ae;var m=Pd.exports;const Ra=Sp(m),Up=kp({__proto__:null,default:Ra},[m]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fp=m,$p=Symbol.for("react.element"),Wp=Symbol.for("react.fragment"),qp=Object.prototype.hasOwnProperty,Vp=Fp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Hp={key:!0,ref:!0,__self:!0,__source:!0};function Ad(e,t,n){var a,l={},s=null,i=null;n!==void 0&&(s=""+n),t.key!==void 0&&(s=""+t.key),t.ref!==void 0&&(i=t.ref);for(a in t)qp.call(t,a)&&!Hp.hasOwnProperty(a)&&(l[a]=t[a]);if(e&&e.defaultProps)for(a in t=e.defaultProps,t)l[a]===void 0&&(l[a]=t[a]);return{$$typeof:$p,type:e,key:s,ref:i,props:l,_owner:Vp.current}}ul.Fragment=Wp;ul.jsx=Ad;ul.jsxs=Ad;Ed.exports=ul;var r=Ed.exports,ls={},Ud={exports:{}},at={},Fd={exports:{}},$d={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(B,S){var I=B.length;B.push(S);e:for(;0<I;){var F=I-1>>>1,Z=B[F];if(0<l(Z,S))B[F]=S,B[I]=Z,I=F;else break e}}function n(B){return B.length===0?null:B[0]}function a(B){if(B.length===0)return null;var S=B[0],I=B.pop();if(I!==S){B[0]=I;e:for(var F=0,Z=B.length,ye=Z>>>1;F<ye;){var de=2*(F+1)-1,le=B[de],ce=de+1,se=B[ce];if(0>l(le,I))ce<Z&&0>l(se,le)?(B[F]=se,B[ce]=I,F=ce):(B[F]=le,B[de]=I,F=de);else if(ce<Z&&0>l(se,I))B[F]=se,B[ce]=I,F=ce;else break e}}return S}function l(B,S){var I=B.sortIndex-S.sortIndex;return I!==0?I:B.id-S.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;e.unstable_now=function(){return s.now()}}else{var i=Date,o=i.now();e.unstable_now=function(){return i.now()-o}}var d=[],p=[],f=1,h=null,x=3,k=!1,j=!1,w=!1,_=typeof setTimeout=="function"?setTimeout:null,g=typeof clearTimeout=="function"?clearTimeout:null,u=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function c(B){for(var S=n(p);S!==null;){if(S.callback===null)a(p);else if(S.startTime<=B)a(p),S.sortIndex=S.expirationTime,t(d,S);else break;S=n(p)}}function v(B){if(w=!1,c(B),!j)if(n(d)!==null)j=!0,G(N);else{var S=n(p);S!==null&&V(v,S.startTime-B)}}function N(B,S){j=!1,w&&(w=!1,g(D),D=-1),k=!0;var I=x;try{for(c(S),h=n(d);h!==null&&(!(h.expirationTime>S)||B&&!H());){var F=h.callback;if(typeof F=="function"){h.callback=null,x=h.priorityLevel;var Z=F(h.expirationTime<=S);S=e.unstable_now(),typeof Z=="function"?h.callback=Z:h===n(d)&&a(d),c(S)}else a(d);h=n(d)}if(h!==null)var ye=!0;else{var de=n(p);de!==null&&V(v,de.startTime-S),ye=!1}return ye}finally{h=null,x=I,k=!1}}var P=!1,z=null,D=-1,E=5,T=-1;function H(){return!(e.unstable_now()-T<E)}function te(){if(z!==null){var B=e.unstable_now();T=B;var S=!0;try{S=z(!0,B)}finally{S?K():(P=!1,z=null)}}else P=!1}var K;if(typeof u=="function")K=function(){u(te)};else if(typeof MessageChannel<"u"){var J=new MessageChannel,M=J.port2;J.port1.onmessage=te,K=function(){M.postMessage(null)}}else K=function(){_(te,0)};function G(B){z=B,P||(P=!0,K())}function V(B,S){D=_(function(){B(e.unstable_now())},S)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(B){B.callback=null},e.unstable_continueExecution=function(){j||k||(j=!0,G(N))},e.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):E=0<B?Math.floor(1e3/B):5},e.unstable_getCurrentPriorityLevel=function(){return x},e.unstable_getFirstCallbackNode=function(){return n(d)},e.unstable_next=function(B){switch(x){case 1:case 2:case 3:var S=3;break;default:S=x}var I=x;x=S;try{return B()}finally{x=I}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(B,S){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var I=x;x=B;try{return S()}finally{x=I}},e.unstable_scheduleCallback=function(B,S,I){var F=e.unstable_now();switch(typeof I=="object"&&I!==null?(I=I.delay,I=typeof I=="number"&&0<I?F+I:F):I=F,B){case 1:var Z=-1;break;case 2:Z=250;break;case 5:Z=1073741823;break;case 4:Z=1e4;break;default:Z=5e3}return Z=I+Z,B={id:f++,callback:S,priorityLevel:B,startTime:I,expirationTime:Z,sortIndex:-1},I>F?(B.sortIndex=I,t(p,B),n(d)===null&&B===n(p)&&(w?(g(D),D=-1):w=!0,V(v,I-F))):(B.sortIndex=Z,t(d,B),j||k||(j=!0,G(N))),B},e.unstable_shouldYield=H,e.unstable_wrapCallback=function(B){var S=x;return function(){var I=x;x=S;try{return B.apply(this,arguments)}finally{x=I}}}})($d);Fd.exports=$d;var Qp=Fd.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yp=m,rt=Qp;function A(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Wd=new Set,Er={};function bn(e,t){Wn(e,t),Wn(e+"Capture",t)}function Wn(e,t){for(Er[e]=t,e=0;e<t.length;e++)Wd.add(t[e])}var Tt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ss=Object.prototype.hasOwnProperty,Gp=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,co={},uo={};function Kp(e){return ss.call(uo,e)?!0:ss.call(co,e)?!1:Gp.test(e)?uo[e]=!0:(co[e]=!0,!1)}function Jp(e,t,n,a){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return a?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Xp(e,t,n,a){if(t===null||typeof t>"u"||Jp(e,t,n,a))return!0;if(a)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Ye(e,t,n,a,l,s,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=a,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=s,this.removeEmptyString=i}var Be={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){Be[e]=new Ye(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];Be[t]=new Ye(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){Be[e]=new Ye(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){Be[e]=new Ye(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){Be[e]=new Ye(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){Be[e]=new Ye(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){Be[e]=new Ye(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){Be[e]=new Ye(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){Be[e]=new Ye(e,5,!1,e.toLowerCase(),null,!1,!1)});var si=/[\-:]([a-z])/g;function ii(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(si,ii);Be[t]=new Ye(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(si,ii);Be[t]=new Ye(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(si,ii);Be[t]=new Ye(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){Be[e]=new Ye(e,1,!1,e.toLowerCase(),null,!1,!1)});Be.xlinkHref=new Ye("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){Be[e]=new Ye(e,1,!1,e.toLowerCase(),null,!0,!0)});function oi(e,t,n,a){var l=Be.hasOwnProperty(t)?Be[t]:null;(l!==null?l.type!==0:a||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Xp(t,n,l,a)&&(n=null),a||l===null?Kp(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,a=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,a?e.setAttributeNS(a,t,n):e.setAttribute(t,n))))}var Rt=Yp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,sa=Symbol.for("react.element"),Sn=Symbol.for("react.portal"),_n=Symbol.for("react.fragment"),di=Symbol.for("react.strict_mode"),is=Symbol.for("react.profiler"),qd=Symbol.for("react.provider"),Vd=Symbol.for("react.context"),ci=Symbol.for("react.forward_ref"),os=Symbol.for("react.suspense"),ds=Symbol.for("react.suspense_list"),ui=Symbol.for("react.memo"),At=Symbol.for("react.lazy"),Hd=Symbol.for("react.offscreen"),po=Symbol.iterator;function nr(e){return e===null||typeof e!="object"?null:(e=po&&e[po]||e["@@iterator"],typeof e=="function"?e:null)}var we=Object.assign,Dl;function cr(e){if(Dl===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Dl=t&&t[1]||""}return`
`+Dl+e}var Ll=!1;function Il(e,t){if(!e||Ll)return"";Ll=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(p){var a=p}Reflect.construct(e,[],t)}else{try{t.call()}catch(p){a=p}e.call(t.prototype)}else{try{throw Error()}catch(p){a=p}e()}}catch(p){if(p&&a&&typeof p.stack=="string"){for(var l=p.stack.split(`
`),s=a.stack.split(`
`),i=l.length-1,o=s.length-1;1<=i&&0<=o&&l[i]!==s[o];)o--;for(;1<=i&&0<=o;i--,o--)if(l[i]!==s[o]){if(i!==1||o!==1)do if(i--,o--,0>o||l[i]!==s[o]){var d=`
`+l[i].replace(" at new "," at ");return e.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",e.displayName)),d}while(1<=i&&0<=o);break}}}finally{Ll=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?cr(e):""}function Zp(e){switch(e.tag){case 5:return cr(e.type);case 16:return cr("Lazy");case 13:return cr("Suspense");case 19:return cr("SuspenseList");case 0:case 2:case 15:return e=Il(e.type,!1),e;case 11:return e=Il(e.type.render,!1),e;case 1:return e=Il(e.type,!0),e;default:return""}}function cs(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case _n:return"Fragment";case Sn:return"Portal";case is:return"Profiler";case di:return"StrictMode";case os:return"Suspense";case ds:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Vd:return(e.displayName||"Context")+".Consumer";case qd:return(e._context.displayName||"Context")+".Provider";case ci:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ui:return t=e.displayName||null,t!==null?t:cs(e.type)||"Memo";case At:t=e._payload,e=e._init;try{return cs(e(t))}catch{}}return null}function ef(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return cs(t);case 8:return t===di?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function en(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Qd(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function tf(e){var t=Qd(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),a=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,s=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(i){a=""+i,s.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return a},setValue:function(i){a=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ia(e){e._valueTracker||(e._valueTracker=tf(e))}function Yd(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),a="";return e&&(a=Qd(e)?e.checked?"true":"false":e.value),e=a,e!==n?(t.setValue(e),!0):!1}function Oa(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function us(e,t){var n=t.checked;return we({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function fo(e,t){var n=t.defaultValue==null?"":t.defaultValue,a=t.checked!=null?t.checked:t.defaultChecked;n=en(t.value!=null?t.value:n),e._wrapperState={initialChecked:a,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Gd(e,t){t=t.checked,t!=null&&oi(e,"checked",t,!1)}function ps(e,t){Gd(e,t);var n=en(t.value),a=t.type;if(n!=null)a==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(a==="submit"||a==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?fs(e,t.type,n):t.hasOwnProperty("defaultValue")&&fs(e,t.type,en(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function ho(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var a=t.type;if(!(a!=="submit"&&a!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function fs(e,t,n){(t!=="number"||Oa(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var ur=Array.isArray;function Rn(e,t,n,a){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&a&&(e[n].defaultSelected=!0)}else{for(n=""+en(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,a&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function hs(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(A(91));return we({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function mo(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(A(92));if(ur(n)){if(1<n.length)throw Error(A(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:en(n)}}function Kd(e,t){var n=en(t.value),a=en(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),a!=null&&(e.defaultValue=""+a)}function go(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Jd(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ms(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Jd(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var oa,Xd=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,a,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,a,l)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(oa=oa||document.createElement("div"),oa.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=oa.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Pr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var yr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},nf=["Webkit","ms","Moz","O"];Object.keys(yr).forEach(function(e){nf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),yr[t]=yr[e]})});function Zd(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||yr.hasOwnProperty(e)&&yr[e]?(""+t).trim():t+"px"}function ec(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var a=n.indexOf("--")===0,l=Zd(n,t[n],a);n==="float"&&(n="cssFloat"),a?e.setProperty(n,l):e[n]=l}}var rf=we({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function gs(e,t){if(t){if(rf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(A(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(A(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(A(61))}if(t.style!=null&&typeof t.style!="object")throw Error(A(62))}}function xs(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var vs=null;function pi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ys=null,On=null,Bn=null;function xo(e){if(e=Xr(e)){if(typeof ys!="function")throw Error(A(280));var t=e.stateNode;t&&(t=gl(t),ys(e.stateNode,e.type,t))}}function tc(e){On?Bn?Bn.push(e):Bn=[e]:On=e}function nc(){if(On){var e=On,t=Bn;if(Bn=On=null,xo(e),t)for(e=0;e<t.length;e++)xo(t[e])}}function rc(e,t){return e(t)}function ac(){}var Ml=!1;function lc(e,t,n){if(Ml)return e(t,n);Ml=!0;try{return rc(e,t,n)}finally{Ml=!1,(On!==null||Bn!==null)&&(ac(),nc())}}function Tr(e,t){var n=e.stateNode;if(n===null)return null;var a=gl(n);if(a===null)return null;n=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(A(231,t,typeof n));return n}var bs=!1;if(Tt)try{var rr={};Object.defineProperty(rr,"passive",{get:function(){bs=!0}}),window.addEventListener("test",rr,rr),window.removeEventListener("test",rr,rr)}catch{bs=!1}function af(e,t,n,a,l,s,i,o,d){var p=Array.prototype.slice.call(arguments,3);try{t.apply(n,p)}catch(f){this.onError(f)}}var br=!1,Ba=null,Aa=!1,js=null,lf={onError:function(e){br=!0,Ba=e}};function sf(e,t,n,a,l,s,i,o,d){br=!1,Ba=null,af.apply(lf,arguments)}function of(e,t,n,a,l,s,i,o,d){if(sf.apply(this,arguments),br){if(br){var p=Ba;br=!1,Ba=null}else throw Error(A(198));Aa||(Aa=!0,js=p)}}function jn(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function sc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function vo(e){if(jn(e)!==e)throw Error(A(188))}function df(e){var t=e.alternate;if(!t){if(t=jn(e),t===null)throw Error(A(188));return t!==e?null:e}for(var n=e,a=t;;){var l=n.return;if(l===null)break;var s=l.alternate;if(s===null){if(a=l.return,a!==null){n=a;continue}break}if(l.child===s.child){for(s=l.child;s;){if(s===n)return vo(l),e;if(s===a)return vo(l),t;s=s.sibling}throw Error(A(188))}if(n.return!==a.return)n=l,a=s;else{for(var i=!1,o=l.child;o;){if(o===n){i=!0,n=l,a=s;break}if(o===a){i=!0,a=l,n=s;break}o=o.sibling}if(!i){for(o=s.child;o;){if(o===n){i=!0,n=s,a=l;break}if(o===a){i=!0,a=s,n=l;break}o=o.sibling}if(!i)throw Error(A(189))}}if(n.alternate!==a)throw Error(A(190))}if(n.tag!==3)throw Error(A(188));return n.stateNode.current===n?e:t}function ic(e){return e=df(e),e!==null?oc(e):null}function oc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=oc(e);if(t!==null)return t;e=e.sibling}return null}var dc=rt.unstable_scheduleCallback,yo=rt.unstable_cancelCallback,cf=rt.unstable_shouldYield,uf=rt.unstable_requestPaint,_e=rt.unstable_now,pf=rt.unstable_getCurrentPriorityLevel,fi=rt.unstable_ImmediatePriority,cc=rt.unstable_UserBlockingPriority,Ua=rt.unstable_NormalPriority,ff=rt.unstable_LowPriority,uc=rt.unstable_IdlePriority,pl=null,kt=null;function hf(e){if(kt&&typeof kt.onCommitFiberRoot=="function")try{kt.onCommitFiberRoot(pl,e,void 0,(e.current.flags&128)===128)}catch{}}var xt=Math.clz32?Math.clz32:xf,mf=Math.log,gf=Math.LN2;function xf(e){return e>>>=0,e===0?32:31-(mf(e)/gf|0)|0}var da=64,ca=4194304;function pr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Fa(e,t){var n=e.pendingLanes;if(n===0)return 0;var a=0,l=e.suspendedLanes,s=e.pingedLanes,i=n&268435455;if(i!==0){var o=i&~l;o!==0?a=pr(o):(s&=i,s!==0&&(a=pr(s)))}else i=n&~l,i!==0?a=pr(i):s!==0&&(a=pr(s));if(a===0)return 0;if(t!==0&&t!==a&&!(t&l)&&(l=a&-a,s=t&-t,l>=s||l===16&&(s&4194240)!==0))return t;if(a&4&&(a|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=a;0<t;)n=31-xt(t),l=1<<n,a|=e[n],t&=~l;return a}function vf(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function yf(e,t){for(var n=e.suspendedLanes,a=e.pingedLanes,l=e.expirationTimes,s=e.pendingLanes;0<s;){var i=31-xt(s),o=1<<i,d=l[i];d===-1?(!(o&n)||o&a)&&(l[i]=vf(o,t)):d<=t&&(e.expiredLanes|=o),s&=~o}}function ws(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function pc(){var e=da;return da<<=1,!(da&4194240)&&(da=64),e}function Rl(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Kr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-xt(t),e[t]=n}function bf(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var a=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-xt(n),s=1<<l;t[l]=0,a[l]=-1,e[l]=-1,n&=~s}}function hi(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var a=31-xt(n),l=1<<a;l&t|e[a]&t&&(e[a]|=t),n&=~l}}var fe=0;function fc(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var hc,mi,mc,gc,xc,ks=!1,ua=[],Ht=null,Qt=null,Yt=null,Dr=new Map,Lr=new Map,Ft=[],jf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function bo(e,t){switch(e){case"focusin":case"focusout":Ht=null;break;case"dragenter":case"dragleave":Qt=null;break;case"mouseover":case"mouseout":Yt=null;break;case"pointerover":case"pointerout":Dr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Lr.delete(t.pointerId)}}function ar(e,t,n,a,l,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:a,nativeEvent:s,targetContainers:[l]},t!==null&&(t=Xr(t),t!==null&&mi(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function wf(e,t,n,a,l){switch(t){case"focusin":return Ht=ar(Ht,e,t,n,a,l),!0;case"dragenter":return Qt=ar(Qt,e,t,n,a,l),!0;case"mouseover":return Yt=ar(Yt,e,t,n,a,l),!0;case"pointerover":var s=l.pointerId;return Dr.set(s,ar(Dr.get(s)||null,e,t,n,a,l)),!0;case"gotpointercapture":return s=l.pointerId,Lr.set(s,ar(Lr.get(s)||null,e,t,n,a,l)),!0}return!1}function vc(e){var t=dn(e.target);if(t!==null){var n=jn(t);if(n!==null){if(t=n.tag,t===13){if(t=sc(n),t!==null){e.blockedOn=t,xc(e.priority,function(){mc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function _a(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Ss(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var a=new n.constructor(n.type,n);vs=a,n.target.dispatchEvent(a),vs=null}else return t=Xr(n),t!==null&&mi(t),e.blockedOn=n,!1;t.shift()}return!0}function jo(e,t,n){_a(e)&&n.delete(t)}function kf(){ks=!1,Ht!==null&&_a(Ht)&&(Ht=null),Qt!==null&&_a(Qt)&&(Qt=null),Yt!==null&&_a(Yt)&&(Yt=null),Dr.forEach(jo),Lr.forEach(jo)}function lr(e,t){e.blockedOn===t&&(e.blockedOn=null,ks||(ks=!0,rt.unstable_scheduleCallback(rt.unstable_NormalPriority,kf)))}function Ir(e){function t(l){return lr(l,e)}if(0<ua.length){lr(ua[0],e);for(var n=1;n<ua.length;n++){var a=ua[n];a.blockedOn===e&&(a.blockedOn=null)}}for(Ht!==null&&lr(Ht,e),Qt!==null&&lr(Qt,e),Yt!==null&&lr(Yt,e),Dr.forEach(t),Lr.forEach(t),n=0;n<Ft.length;n++)a=Ft[n],a.blockedOn===e&&(a.blockedOn=null);for(;0<Ft.length&&(n=Ft[0],n.blockedOn===null);)vc(n),n.blockedOn===null&&Ft.shift()}var An=Rt.ReactCurrentBatchConfig,$a=!0;function Sf(e,t,n,a){var l=fe,s=An.transition;An.transition=null;try{fe=1,gi(e,t,n,a)}finally{fe=l,An.transition=s}}function _f(e,t,n,a){var l=fe,s=An.transition;An.transition=null;try{fe=4,gi(e,t,n,a)}finally{fe=l,An.transition=s}}function gi(e,t,n,a){if($a){var l=Ss(e,t,n,a);if(l===null)Hl(e,t,a,Wa,n),bo(e,a);else if(wf(l,e,t,n,a))a.stopPropagation();else if(bo(e,a),t&4&&-1<jf.indexOf(e)){for(;l!==null;){var s=Xr(l);if(s!==null&&hc(s),s=Ss(e,t,n,a),s===null&&Hl(e,t,a,Wa,n),s===l)break;l=s}l!==null&&a.stopPropagation()}else Hl(e,t,a,null,n)}}var Wa=null;function Ss(e,t,n,a){if(Wa=null,e=pi(a),e=dn(e),e!==null)if(t=jn(e),t===null)e=null;else if(n=t.tag,n===13){if(e=sc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Wa=e,null}function yc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(pf()){case fi:return 1;case cc:return 4;case Ua:case ff:return 16;case uc:return 536870912;default:return 16}default:return 16}}var Wt=null,xi=null,Na=null;function bc(){if(Na)return Na;var e,t=xi,n=t.length,a,l="value"in Wt?Wt.value:Wt.textContent,s=l.length;for(e=0;e<n&&t[e]===l[e];e++);var i=n-e;for(a=1;a<=i&&t[n-a]===l[s-a];a++);return Na=l.slice(e,1<a?1-a:void 0)}function Ca(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function pa(){return!0}function wo(){return!1}function lt(e){function t(n,a,l,s,i){this._reactName=n,this._targetInst=l,this.type=a,this.nativeEvent=s,this.target=i,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(n=e[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?pa:wo,this.isPropagationStopped=wo,this}return we(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=pa)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=pa)},persist:function(){},isPersistent:pa}),t}var Jn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},vi=lt(Jn),Jr=we({},Jn,{view:0,detail:0}),Nf=lt(Jr),Ol,Bl,sr,fl=we({},Jr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:yi,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==sr&&(sr&&e.type==="mousemove"?(Ol=e.screenX-sr.screenX,Bl=e.screenY-sr.screenY):Bl=Ol=0,sr=e),Ol)},movementY:function(e){return"movementY"in e?e.movementY:Bl}}),ko=lt(fl),Cf=we({},fl,{dataTransfer:0}),zf=lt(Cf),Ef=we({},Jr,{relatedTarget:0}),Al=lt(Ef),Pf=we({},Jn,{animationName:0,elapsedTime:0,pseudoElement:0}),Tf=lt(Pf),Df=we({},Jn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Lf=lt(Df),If=we({},Jn,{data:0}),So=lt(If),Mf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Rf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Of={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Bf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Of[e])?!!t[e]:!1}function yi(){return Bf}var Af=we({},Jr,{key:function(e){if(e.key){var t=Mf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ca(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Rf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:yi,charCode:function(e){return e.type==="keypress"?Ca(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ca(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Uf=lt(Af),Ff=we({},fl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),_o=lt(Ff),$f=we({},Jr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:yi}),Wf=lt($f),qf=we({},Jn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Vf=lt(qf),Hf=we({},fl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Qf=lt(Hf),Yf=[9,13,27,32],bi=Tt&&"CompositionEvent"in window,jr=null;Tt&&"documentMode"in document&&(jr=document.documentMode);var Gf=Tt&&"TextEvent"in window&&!jr,jc=Tt&&(!bi||jr&&8<jr&&11>=jr),No=" ",Co=!1;function wc(e,t){switch(e){case"keyup":return Yf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function kc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Nn=!1;function Kf(e,t){switch(e){case"compositionend":return kc(t);case"keypress":return t.which!==32?null:(Co=!0,No);case"textInput":return e=t.data,e===No&&Co?null:e;default:return null}}function Jf(e,t){if(Nn)return e==="compositionend"||!bi&&wc(e,t)?(e=bc(),Na=xi=Wt=null,Nn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return jc&&t.locale!=="ko"?null:t.data;default:return null}}var Xf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function zo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Xf[e.type]:t==="textarea"}function Sc(e,t,n,a){tc(a),t=qa(t,"onChange"),0<t.length&&(n=new vi("onChange","change",null,n,a),e.push({event:n,listeners:t}))}var wr=null,Mr=null;function Zf(e){Mc(e,0)}function hl(e){var t=En(e);if(Yd(t))return e}function eh(e,t){if(e==="change")return t}var _c=!1;if(Tt){var Ul;if(Tt){var Fl="oninput"in document;if(!Fl){var Eo=document.createElement("div");Eo.setAttribute("oninput","return;"),Fl=typeof Eo.oninput=="function"}Ul=Fl}else Ul=!1;_c=Ul&&(!document.documentMode||9<document.documentMode)}function Po(){wr&&(wr.detachEvent("onpropertychange",Nc),Mr=wr=null)}function Nc(e){if(e.propertyName==="value"&&hl(Mr)){var t=[];Sc(t,Mr,e,pi(e)),lc(Zf,t)}}function th(e,t,n){e==="focusin"?(Po(),wr=t,Mr=n,wr.attachEvent("onpropertychange",Nc)):e==="focusout"&&Po()}function nh(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return hl(Mr)}function rh(e,t){if(e==="click")return hl(t)}function ah(e,t){if(e==="input"||e==="change")return hl(t)}function lh(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var yt=typeof Object.is=="function"?Object.is:lh;function Rr(e,t){if(yt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),a=Object.keys(t);if(n.length!==a.length)return!1;for(a=0;a<n.length;a++){var l=n[a];if(!ss.call(t,l)||!yt(e[l],t[l]))return!1}return!0}function To(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Do(e,t){var n=To(e);e=0;for(var a;n;){if(n.nodeType===3){if(a=e+n.textContent.length,e<=t&&a>=t)return{node:n,offset:t-e};e=a}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=To(n)}}function Cc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Cc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function zc(){for(var e=window,t=Oa();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Oa(e.document)}return t}function ji(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function sh(e){var t=zc(),n=e.focusedElem,a=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Cc(n.ownerDocument.documentElement,n)){if(a!==null&&ji(n)){if(t=a.start,e=a.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,s=Math.min(a.start,l);a=a.end===void 0?s:Math.min(a.end,l),!e.extend&&s>a&&(l=a,a=s,s=l),l=Do(n,s);var i=Do(n,a);l&&i&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),s>a?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ih=Tt&&"documentMode"in document&&11>=document.documentMode,Cn=null,_s=null,kr=null,Ns=!1;function Lo(e,t,n){var a=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ns||Cn==null||Cn!==Oa(a)||(a=Cn,"selectionStart"in a&&ji(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),kr&&Rr(kr,a)||(kr=a,a=qa(_s,"onSelect"),0<a.length&&(t=new vi("onSelect","select",null,t,n),e.push({event:t,listeners:a}),t.target=Cn)))}function fa(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var zn={animationend:fa("Animation","AnimationEnd"),animationiteration:fa("Animation","AnimationIteration"),animationstart:fa("Animation","AnimationStart"),transitionend:fa("Transition","TransitionEnd")},$l={},Ec={};Tt&&(Ec=document.createElement("div").style,"AnimationEvent"in window||(delete zn.animationend.animation,delete zn.animationiteration.animation,delete zn.animationstart.animation),"TransitionEvent"in window||delete zn.transitionend.transition);function ml(e){if($l[e])return $l[e];if(!zn[e])return e;var t=zn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Ec)return $l[e]=t[n];return e}var Pc=ml("animationend"),Tc=ml("animationiteration"),Dc=ml("animationstart"),Lc=ml("transitionend"),Ic=new Map,Io="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function nn(e,t){Ic.set(e,t),bn(t,[e])}for(var Wl=0;Wl<Io.length;Wl++){var ql=Io[Wl],oh=ql.toLowerCase(),dh=ql[0].toUpperCase()+ql.slice(1);nn(oh,"on"+dh)}nn(Pc,"onAnimationEnd");nn(Tc,"onAnimationIteration");nn(Dc,"onAnimationStart");nn("dblclick","onDoubleClick");nn("focusin","onFocus");nn("focusout","onBlur");nn(Lc,"onTransitionEnd");Wn("onMouseEnter",["mouseout","mouseover"]);Wn("onMouseLeave",["mouseout","mouseover"]);Wn("onPointerEnter",["pointerout","pointerover"]);Wn("onPointerLeave",["pointerout","pointerover"]);bn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));bn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));bn("onBeforeInput",["compositionend","keypress","textInput","paste"]);bn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));bn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));bn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var fr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ch=new Set("cancel close invalid load scroll toggle".split(" ").concat(fr));function Mo(e,t,n){var a=e.type||"unknown-event";e.currentTarget=n,of(a,t,void 0,e),e.currentTarget=null}function Mc(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var a=e[n],l=a.event;a=a.listeners;e:{var s=void 0;if(t)for(var i=a.length-1;0<=i;i--){var o=a[i],d=o.instance,p=o.currentTarget;if(o=o.listener,d!==s&&l.isPropagationStopped())break e;Mo(l,o,p),s=d}else for(i=0;i<a.length;i++){if(o=a[i],d=o.instance,p=o.currentTarget,o=o.listener,d!==s&&l.isPropagationStopped())break e;Mo(l,o,p),s=d}}}if(Aa)throw e=js,Aa=!1,js=null,e}function me(e,t){var n=t[Ts];n===void 0&&(n=t[Ts]=new Set);var a=e+"__bubble";n.has(a)||(Rc(t,e,2,!1),n.add(a))}function Vl(e,t,n){var a=0;t&&(a|=4),Rc(n,e,a,t)}var ha="_reactListening"+Math.random().toString(36).slice(2);function Or(e){if(!e[ha]){e[ha]=!0,Wd.forEach(function(n){n!=="selectionchange"&&(ch.has(n)||Vl(n,!1,e),Vl(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ha]||(t[ha]=!0,Vl("selectionchange",!1,t))}}function Rc(e,t,n,a){switch(yc(t)){case 1:var l=Sf;break;case 4:l=_f;break;default:l=gi}n=l.bind(null,t,n,e),l=void 0,!bs||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),a?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Hl(e,t,n,a,l){var s=a;if(!(t&1)&&!(t&2)&&a!==null)e:for(;;){if(a===null)return;var i=a.tag;if(i===3||i===4){var o=a.stateNode.containerInfo;if(o===l||o.nodeType===8&&o.parentNode===l)break;if(i===4)for(i=a.return;i!==null;){var d=i.tag;if((d===3||d===4)&&(d=i.stateNode.containerInfo,d===l||d.nodeType===8&&d.parentNode===l))return;i=i.return}for(;o!==null;){if(i=dn(o),i===null)return;if(d=i.tag,d===5||d===6){a=s=i;continue e}o=o.parentNode}}a=a.return}lc(function(){var p=s,f=pi(n),h=[];e:{var x=Ic.get(e);if(x!==void 0){var k=vi,j=e;switch(e){case"keypress":if(Ca(n)===0)break e;case"keydown":case"keyup":k=Uf;break;case"focusin":j="focus",k=Al;break;case"focusout":j="blur",k=Al;break;case"beforeblur":case"afterblur":k=Al;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=ko;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=zf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=Wf;break;case Pc:case Tc:case Dc:k=Tf;break;case Lc:k=Vf;break;case"scroll":k=Nf;break;case"wheel":k=Qf;break;case"copy":case"cut":case"paste":k=Lf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=_o}var w=(t&4)!==0,_=!w&&e==="scroll",g=w?x!==null?x+"Capture":null:x;w=[];for(var u=p,c;u!==null;){c=u;var v=c.stateNode;if(c.tag===5&&v!==null&&(c=v,g!==null&&(v=Tr(u,g),v!=null&&w.push(Br(u,v,c)))),_)break;u=u.return}0<w.length&&(x=new k(x,j,null,n,f),h.push({event:x,listeners:w}))}}if(!(t&7)){e:{if(x=e==="mouseover"||e==="pointerover",k=e==="mouseout"||e==="pointerout",x&&n!==vs&&(j=n.relatedTarget||n.fromElement)&&(dn(j)||j[Dt]))break e;if((k||x)&&(x=f.window===f?f:(x=f.ownerDocument)?x.defaultView||x.parentWindow:window,k?(j=n.relatedTarget||n.toElement,k=p,j=j?dn(j):null,j!==null&&(_=jn(j),j!==_||j.tag!==5&&j.tag!==6)&&(j=null)):(k=null,j=p),k!==j)){if(w=ko,v="onMouseLeave",g="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(w=_o,v="onPointerLeave",g="onPointerEnter",u="pointer"),_=k==null?x:En(k),c=j==null?x:En(j),x=new w(v,u+"leave",k,n,f),x.target=_,x.relatedTarget=c,v=null,dn(f)===p&&(w=new w(g,u+"enter",j,n,f),w.target=c,w.relatedTarget=_,v=w),_=v,k&&j)t:{for(w=k,g=j,u=0,c=w;c;c=kn(c))u++;for(c=0,v=g;v;v=kn(v))c++;for(;0<u-c;)w=kn(w),u--;for(;0<c-u;)g=kn(g),c--;for(;u--;){if(w===g||g!==null&&w===g.alternate)break t;w=kn(w),g=kn(g)}w=null}else w=null;k!==null&&Ro(h,x,k,w,!1),j!==null&&_!==null&&Ro(h,_,j,w,!0)}}e:{if(x=p?En(p):window,k=x.nodeName&&x.nodeName.toLowerCase(),k==="select"||k==="input"&&x.type==="file")var N=eh;else if(zo(x))if(_c)N=ah;else{N=nh;var P=th}else(k=x.nodeName)&&k.toLowerCase()==="input"&&(x.type==="checkbox"||x.type==="radio")&&(N=rh);if(N&&(N=N(e,p))){Sc(h,N,n,f);break e}P&&P(e,x,p),e==="focusout"&&(P=x._wrapperState)&&P.controlled&&x.type==="number"&&fs(x,"number",x.value)}switch(P=p?En(p):window,e){case"focusin":(zo(P)||P.contentEditable==="true")&&(Cn=P,_s=p,kr=null);break;case"focusout":kr=_s=Cn=null;break;case"mousedown":Ns=!0;break;case"contextmenu":case"mouseup":case"dragend":Ns=!1,Lo(h,n,f);break;case"selectionchange":if(ih)break;case"keydown":case"keyup":Lo(h,n,f)}var z;if(bi)e:{switch(e){case"compositionstart":var D="onCompositionStart";break e;case"compositionend":D="onCompositionEnd";break e;case"compositionupdate":D="onCompositionUpdate";break e}D=void 0}else Nn?wc(e,n)&&(D="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(D="onCompositionStart");D&&(jc&&n.locale!=="ko"&&(Nn||D!=="onCompositionStart"?D==="onCompositionEnd"&&Nn&&(z=bc()):(Wt=f,xi="value"in Wt?Wt.value:Wt.textContent,Nn=!0)),P=qa(p,D),0<P.length&&(D=new So(D,e,null,n,f),h.push({event:D,listeners:P}),z?D.data=z:(z=kc(n),z!==null&&(D.data=z)))),(z=Gf?Kf(e,n):Jf(e,n))&&(p=qa(p,"onBeforeInput"),0<p.length&&(f=new So("onBeforeInput","beforeinput",null,n,f),h.push({event:f,listeners:p}),f.data=z))}Mc(h,t)})}function Br(e,t,n){return{instance:e,listener:t,currentTarget:n}}function qa(e,t){for(var n=t+"Capture",a=[];e!==null;){var l=e,s=l.stateNode;l.tag===5&&s!==null&&(l=s,s=Tr(e,n),s!=null&&a.unshift(Br(e,s,l)),s=Tr(e,t),s!=null&&a.push(Br(e,s,l))),e=e.return}return a}function kn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ro(e,t,n,a,l){for(var s=t._reactName,i=[];n!==null&&n!==a;){var o=n,d=o.alternate,p=o.stateNode;if(d!==null&&d===a)break;o.tag===5&&p!==null&&(o=p,l?(d=Tr(n,s),d!=null&&i.unshift(Br(n,d,o))):l||(d=Tr(n,s),d!=null&&i.push(Br(n,d,o)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var uh=/\r\n?/g,ph=/\u0000|\uFFFD/g;function Oo(e){return(typeof e=="string"?e:""+e).replace(uh,`
`).replace(ph,"")}function ma(e,t,n){if(t=Oo(t),Oo(e)!==t&&n)throw Error(A(425))}function Va(){}var Cs=null,zs=null;function Es(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ps=typeof setTimeout=="function"?setTimeout:void 0,fh=typeof clearTimeout=="function"?clearTimeout:void 0,Bo=typeof Promise=="function"?Promise:void 0,hh=typeof queueMicrotask=="function"?queueMicrotask:typeof Bo<"u"?function(e){return Bo.resolve(null).then(e).catch(mh)}:Ps;function mh(e){setTimeout(function(){throw e})}function Ql(e,t){var n=t,a=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(a===0){e.removeChild(l),Ir(t);return}a--}else n!=="$"&&n!=="$?"&&n!=="$!"||a++;n=l}while(n);Ir(t)}function Gt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Ao(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Xn=Math.random().toString(36).slice(2),wt="__reactFiber$"+Xn,Ar="__reactProps$"+Xn,Dt="__reactContainer$"+Xn,Ts="__reactEvents$"+Xn,gh="__reactListeners$"+Xn,xh="__reactHandles$"+Xn;function dn(e){var t=e[wt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Dt]||n[wt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Ao(e);e!==null;){if(n=e[wt])return n;e=Ao(e)}return t}e=n,n=e.parentNode}return null}function Xr(e){return e=e[wt]||e[Dt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function En(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(A(33))}function gl(e){return e[Ar]||null}var Ds=[],Pn=-1;function rn(e){return{current:e}}function ge(e){0>Pn||(e.current=Ds[Pn],Ds[Pn]=null,Pn--)}function he(e,t){Pn++,Ds[Pn]=e.current,e.current=t}var tn={},$e=rn(tn),Je=rn(!1),mn=tn;function qn(e,t){var n=e.type.contextTypes;if(!n)return tn;var a=e.stateNode;if(a&&a.__reactInternalMemoizedUnmaskedChildContext===t)return a.__reactInternalMemoizedMaskedChildContext;var l={},s;for(s in n)l[s]=t[s];return a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function Xe(e){return e=e.childContextTypes,e!=null}function Ha(){ge(Je),ge($e)}function Uo(e,t,n){if($e.current!==tn)throw Error(A(168));he($e,t),he(Je,n)}function Oc(e,t,n){var a=e.stateNode;if(t=t.childContextTypes,typeof a.getChildContext!="function")return n;a=a.getChildContext();for(var l in a)if(!(l in t))throw Error(A(108,ef(e)||"Unknown",l));return we({},n,a)}function Qa(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||tn,mn=$e.current,he($e,e),he(Je,Je.current),!0}function Fo(e,t,n){var a=e.stateNode;if(!a)throw Error(A(169));n?(e=Oc(e,t,mn),a.__reactInternalMemoizedMergedChildContext=e,ge(Je),ge($e),he($e,e)):ge(Je),he(Je,n)}var Ct=null,xl=!1,Yl=!1;function Bc(e){Ct===null?Ct=[e]:Ct.push(e)}function vh(e){xl=!0,Bc(e)}function an(){if(!Yl&&Ct!==null){Yl=!0;var e=0,t=fe;try{var n=Ct;for(fe=1;e<n.length;e++){var a=n[e];do a=a(!0);while(a!==null)}Ct=null,xl=!1}catch(l){throw Ct!==null&&(Ct=Ct.slice(e+1)),dc(fi,an),l}finally{fe=t,Yl=!1}}return null}var Tn=[],Dn=0,Ya=null,Ga=0,st=[],it=0,gn=null,zt=1,Et="";function sn(e,t){Tn[Dn++]=Ga,Tn[Dn++]=Ya,Ya=e,Ga=t}function Ac(e,t,n){st[it++]=zt,st[it++]=Et,st[it++]=gn,gn=e;var a=zt;e=Et;var l=32-xt(a)-1;a&=~(1<<l),n+=1;var s=32-xt(t)+l;if(30<s){var i=l-l%5;s=(a&(1<<i)-1).toString(32),a>>=i,l-=i,zt=1<<32-xt(t)+l|n<<l|a,Et=s+e}else zt=1<<s|n<<l|a,Et=e}function wi(e){e.return!==null&&(sn(e,1),Ac(e,1,0))}function ki(e){for(;e===Ya;)Ya=Tn[--Dn],Tn[Dn]=null,Ga=Tn[--Dn],Tn[Dn]=null;for(;e===gn;)gn=st[--it],st[it]=null,Et=st[--it],st[it]=null,zt=st[--it],st[it]=null}var nt=null,tt=null,ve=!1,gt=null;function Uc(e,t){var n=ot(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function $o(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,nt=e,tt=Gt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,nt=e,tt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=gn!==null?{id:zt,overflow:Et}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=ot(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,nt=e,tt=null,!0):!1;default:return!1}}function Ls(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Is(e){if(ve){var t=tt;if(t){var n=t;if(!$o(e,t)){if(Ls(e))throw Error(A(418));t=Gt(n.nextSibling);var a=nt;t&&$o(e,t)?Uc(a,n):(e.flags=e.flags&-4097|2,ve=!1,nt=e)}}else{if(Ls(e))throw Error(A(418));e.flags=e.flags&-4097|2,ve=!1,nt=e}}}function Wo(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;nt=e}function ga(e){if(e!==nt)return!1;if(!ve)return Wo(e),ve=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Es(e.type,e.memoizedProps)),t&&(t=tt)){if(Ls(e))throw Fc(),Error(A(418));for(;t;)Uc(e,t),t=Gt(t.nextSibling)}if(Wo(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(A(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){tt=Gt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}tt=null}}else tt=nt?Gt(e.stateNode.nextSibling):null;return!0}function Fc(){for(var e=tt;e;)e=Gt(e.nextSibling)}function Vn(){tt=nt=null,ve=!1}function Si(e){gt===null?gt=[e]:gt.push(e)}var yh=Rt.ReactCurrentBatchConfig;function ir(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(A(309));var a=n.stateNode}if(!a)throw Error(A(147,e));var l=a,s=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===s?t.ref:(t=function(i){var o=l.refs;i===null?delete o[s]:o[s]=i},t._stringRef=s,t)}if(typeof e!="string")throw Error(A(284));if(!n._owner)throw Error(A(290,e))}return e}function xa(e,t){throw e=Object.prototype.toString.call(t),Error(A(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function qo(e){var t=e._init;return t(e._payload)}function $c(e){function t(g,u){if(e){var c=g.deletions;c===null?(g.deletions=[u],g.flags|=16):c.push(u)}}function n(g,u){if(!e)return null;for(;u!==null;)t(g,u),u=u.sibling;return null}function a(g,u){for(g=new Map;u!==null;)u.key!==null?g.set(u.key,u):g.set(u.index,u),u=u.sibling;return g}function l(g,u){return g=Zt(g,u),g.index=0,g.sibling=null,g}function s(g,u,c){return g.index=c,e?(c=g.alternate,c!==null?(c=c.index,c<u?(g.flags|=2,u):c):(g.flags|=2,u)):(g.flags|=1048576,u)}function i(g){return e&&g.alternate===null&&(g.flags|=2),g}function o(g,u,c,v){return u===null||u.tag!==6?(u=ts(c,g.mode,v),u.return=g,u):(u=l(u,c),u.return=g,u)}function d(g,u,c,v){var N=c.type;return N===_n?f(g,u,c.props.children,v,c.key):u!==null&&(u.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===At&&qo(N)===u.type)?(v=l(u,c.props),v.ref=ir(g,u,c),v.return=g,v):(v=Ia(c.type,c.key,c.props,null,g.mode,v),v.ref=ir(g,u,c),v.return=g,v)}function p(g,u,c,v){return u===null||u.tag!==4||u.stateNode.containerInfo!==c.containerInfo||u.stateNode.implementation!==c.implementation?(u=ns(c,g.mode,v),u.return=g,u):(u=l(u,c.children||[]),u.return=g,u)}function f(g,u,c,v,N){return u===null||u.tag!==7?(u=fn(c,g.mode,v,N),u.return=g,u):(u=l(u,c),u.return=g,u)}function h(g,u,c){if(typeof u=="string"&&u!==""||typeof u=="number")return u=ts(""+u,g.mode,c),u.return=g,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case sa:return c=Ia(u.type,u.key,u.props,null,g.mode,c),c.ref=ir(g,null,u),c.return=g,c;case Sn:return u=ns(u,g.mode,c),u.return=g,u;case At:var v=u._init;return h(g,v(u._payload),c)}if(ur(u)||nr(u))return u=fn(u,g.mode,c,null),u.return=g,u;xa(g,u)}return null}function x(g,u,c,v){var N=u!==null?u.key:null;if(typeof c=="string"&&c!==""||typeof c=="number")return N!==null?null:o(g,u,""+c,v);if(typeof c=="object"&&c!==null){switch(c.$$typeof){case sa:return c.key===N?d(g,u,c,v):null;case Sn:return c.key===N?p(g,u,c,v):null;case At:return N=c._init,x(g,u,N(c._payload),v)}if(ur(c)||nr(c))return N!==null?null:f(g,u,c,v,null);xa(g,c)}return null}function k(g,u,c,v,N){if(typeof v=="string"&&v!==""||typeof v=="number")return g=g.get(c)||null,o(u,g,""+v,N);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case sa:return g=g.get(v.key===null?c:v.key)||null,d(u,g,v,N);case Sn:return g=g.get(v.key===null?c:v.key)||null,p(u,g,v,N);case At:var P=v._init;return k(g,u,c,P(v._payload),N)}if(ur(v)||nr(v))return g=g.get(c)||null,f(u,g,v,N,null);xa(u,v)}return null}function j(g,u,c,v){for(var N=null,P=null,z=u,D=u=0,E=null;z!==null&&D<c.length;D++){z.index>D?(E=z,z=null):E=z.sibling;var T=x(g,z,c[D],v);if(T===null){z===null&&(z=E);break}e&&z&&T.alternate===null&&t(g,z),u=s(T,u,D),P===null?N=T:P.sibling=T,P=T,z=E}if(D===c.length)return n(g,z),ve&&sn(g,D),N;if(z===null){for(;D<c.length;D++)z=h(g,c[D],v),z!==null&&(u=s(z,u,D),P===null?N=z:P.sibling=z,P=z);return ve&&sn(g,D),N}for(z=a(g,z);D<c.length;D++)E=k(z,g,D,c[D],v),E!==null&&(e&&E.alternate!==null&&z.delete(E.key===null?D:E.key),u=s(E,u,D),P===null?N=E:P.sibling=E,P=E);return e&&z.forEach(function(H){return t(g,H)}),ve&&sn(g,D),N}function w(g,u,c,v){var N=nr(c);if(typeof N!="function")throw Error(A(150));if(c=N.call(c),c==null)throw Error(A(151));for(var P=N=null,z=u,D=u=0,E=null,T=c.next();z!==null&&!T.done;D++,T=c.next()){z.index>D?(E=z,z=null):E=z.sibling;var H=x(g,z,T.value,v);if(H===null){z===null&&(z=E);break}e&&z&&H.alternate===null&&t(g,z),u=s(H,u,D),P===null?N=H:P.sibling=H,P=H,z=E}if(T.done)return n(g,z),ve&&sn(g,D),N;if(z===null){for(;!T.done;D++,T=c.next())T=h(g,T.value,v),T!==null&&(u=s(T,u,D),P===null?N=T:P.sibling=T,P=T);return ve&&sn(g,D),N}for(z=a(g,z);!T.done;D++,T=c.next())T=k(z,g,D,T.value,v),T!==null&&(e&&T.alternate!==null&&z.delete(T.key===null?D:T.key),u=s(T,u,D),P===null?N=T:P.sibling=T,P=T);return e&&z.forEach(function(te){return t(g,te)}),ve&&sn(g,D),N}function _(g,u,c,v){if(typeof c=="object"&&c!==null&&c.type===_n&&c.key===null&&(c=c.props.children),typeof c=="object"&&c!==null){switch(c.$$typeof){case sa:e:{for(var N=c.key,P=u;P!==null;){if(P.key===N){if(N=c.type,N===_n){if(P.tag===7){n(g,P.sibling),u=l(P,c.props.children),u.return=g,g=u;break e}}else if(P.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===At&&qo(N)===P.type){n(g,P.sibling),u=l(P,c.props),u.ref=ir(g,P,c),u.return=g,g=u;break e}n(g,P);break}else t(g,P);P=P.sibling}c.type===_n?(u=fn(c.props.children,g.mode,v,c.key),u.return=g,g=u):(v=Ia(c.type,c.key,c.props,null,g.mode,v),v.ref=ir(g,u,c),v.return=g,g=v)}return i(g);case Sn:e:{for(P=c.key;u!==null;){if(u.key===P)if(u.tag===4&&u.stateNode.containerInfo===c.containerInfo&&u.stateNode.implementation===c.implementation){n(g,u.sibling),u=l(u,c.children||[]),u.return=g,g=u;break e}else{n(g,u);break}else t(g,u);u=u.sibling}u=ns(c,g.mode,v),u.return=g,g=u}return i(g);case At:return P=c._init,_(g,u,P(c._payload),v)}if(ur(c))return j(g,u,c,v);if(nr(c))return w(g,u,c,v);xa(g,c)}return typeof c=="string"&&c!==""||typeof c=="number"?(c=""+c,u!==null&&u.tag===6?(n(g,u.sibling),u=l(u,c),u.return=g,g=u):(n(g,u),u=ts(c,g.mode,v),u.return=g,g=u),i(g)):n(g,u)}return _}var Hn=$c(!0),Wc=$c(!1),Ka=rn(null),Ja=null,Ln=null,_i=null;function Ni(){_i=Ln=Ja=null}function Ci(e){var t=Ka.current;ge(Ka),e._currentValue=t}function Ms(e,t,n){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===n)break;e=e.return}}function Un(e,t){Ja=e,_i=Ln=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(Ke=!0),e.firstContext=null)}function ct(e){var t=e._currentValue;if(_i!==e)if(e={context:e,memoizedValue:t,next:null},Ln===null){if(Ja===null)throw Error(A(308));Ln=e,Ja.dependencies={lanes:0,firstContext:e}}else Ln=Ln.next=e;return t}var cn=null;function zi(e){cn===null?cn=[e]:cn.push(e)}function qc(e,t,n,a){var l=t.interleaved;return l===null?(n.next=n,zi(t)):(n.next=l.next,l.next=n),t.interleaved=n,Lt(e,a)}function Lt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Ut=!1;function Ei(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Vc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Pt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Kt(e,t,n){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,oe&2){var l=a.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),a.pending=t,Lt(e,n)}return l=a.interleaved,l===null?(t.next=t,zi(a)):(t.next=l.next,l.next=t),a.interleaved=t,Lt(e,n)}function za(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,hi(e,n)}}function Vo(e,t){var n=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,n===a)){var l=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?l=s=i:s=s.next=i,n=n.next}while(n!==null);s===null?l=s=t:s=s.next=t}else l=s=t;n={baseState:a.baseState,firstBaseUpdate:l,lastBaseUpdate:s,shared:a.shared,effects:a.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Xa(e,t,n,a){var l=e.updateQueue;Ut=!1;var s=l.firstBaseUpdate,i=l.lastBaseUpdate,o=l.shared.pending;if(o!==null){l.shared.pending=null;var d=o,p=d.next;d.next=null,i===null?s=p:i.next=p,i=d;var f=e.alternate;f!==null&&(f=f.updateQueue,o=f.lastBaseUpdate,o!==i&&(o===null?f.firstBaseUpdate=p:o.next=p,f.lastBaseUpdate=d))}if(s!==null){var h=l.baseState;i=0,f=p=d=null,o=s;do{var x=o.lane,k=o.eventTime;if((a&x)===x){f!==null&&(f=f.next={eventTime:k,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var j=e,w=o;switch(x=t,k=n,w.tag){case 1:if(j=w.payload,typeof j=="function"){h=j.call(k,h,x);break e}h=j;break e;case 3:j.flags=j.flags&-65537|128;case 0:if(j=w.payload,x=typeof j=="function"?j.call(k,h,x):j,x==null)break e;h=we({},h,x);break e;case 2:Ut=!0}}o.callback!==null&&o.lane!==0&&(e.flags|=64,x=l.effects,x===null?l.effects=[o]:x.push(o))}else k={eventTime:k,lane:x,tag:o.tag,payload:o.payload,callback:o.callback,next:null},f===null?(p=f=k,d=h):f=f.next=k,i|=x;if(o=o.next,o===null){if(o=l.shared.pending,o===null)break;x=o,o=x.next,x.next=null,l.lastBaseUpdate=x,l.shared.pending=null}}while(!0);if(f===null&&(d=h),l.baseState=d,l.firstBaseUpdate=p,l.lastBaseUpdate=f,t=l.shared.interleaved,t!==null){l=t;do i|=l.lane,l=l.next;while(l!==t)}else s===null&&(l.shared.lanes=0);vn|=i,e.lanes=i,e.memoizedState=h}}function Ho(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var a=e[t],l=a.callback;if(l!==null){if(a.callback=null,a=n,typeof l!="function")throw Error(A(191,l));l.call(a)}}}var Zr={},St=rn(Zr),Ur=rn(Zr),Fr=rn(Zr);function un(e){if(e===Zr)throw Error(A(174));return e}function Pi(e,t){switch(he(Fr,t),he(Ur,e),he(St,Zr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:ms(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=ms(t,e)}ge(St),he(St,t)}function Qn(){ge(St),ge(Ur),ge(Fr)}function Hc(e){un(Fr.current);var t=un(St.current),n=ms(t,e.type);t!==n&&(he(Ur,e),he(St,n))}function Ti(e){Ur.current===e&&(ge(St),ge(Ur))}var be=rn(0);function Za(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Gl=[];function Di(){for(var e=0;e<Gl.length;e++)Gl[e]._workInProgressVersionPrimary=null;Gl.length=0}var Ea=Rt.ReactCurrentDispatcher,Kl=Rt.ReactCurrentBatchConfig,xn=0,je=null,Pe=null,De=null,el=!1,Sr=!1,$r=0,bh=0;function Ae(){throw Error(A(321))}function Li(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!yt(e[n],t[n]))return!1;return!0}function Ii(e,t,n,a,l,s){if(xn=s,je=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Ea.current=e===null||e.memoizedState===null?Sh:_h,e=n(a,l),Sr){s=0;do{if(Sr=!1,$r=0,25<=s)throw Error(A(301));s+=1,De=Pe=null,t.updateQueue=null,Ea.current=Nh,e=n(a,l)}while(Sr)}if(Ea.current=tl,t=Pe!==null&&Pe.next!==null,xn=0,De=Pe=je=null,el=!1,t)throw Error(A(300));return e}function Mi(){var e=$r!==0;return $r=0,e}function jt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return De===null?je.memoizedState=De=e:De=De.next=e,De}function ut(){if(Pe===null){var e=je.alternate;e=e!==null?e.memoizedState:null}else e=Pe.next;var t=De===null?je.memoizedState:De.next;if(t!==null)De=t,Pe=e;else{if(e===null)throw Error(A(310));Pe=e,e={memoizedState:Pe.memoizedState,baseState:Pe.baseState,baseQueue:Pe.baseQueue,queue:Pe.queue,next:null},De===null?je.memoizedState=De=e:De=De.next=e}return De}function Wr(e,t){return typeof t=="function"?t(e):t}function Jl(e){var t=ut(),n=t.queue;if(n===null)throw Error(A(311));n.lastRenderedReducer=e;var a=Pe,l=a.baseQueue,s=n.pending;if(s!==null){if(l!==null){var i=l.next;l.next=s.next,s.next=i}a.baseQueue=l=s,n.pending=null}if(l!==null){s=l.next,a=a.baseState;var o=i=null,d=null,p=s;do{var f=p.lane;if((xn&f)===f)d!==null&&(d=d.next={lane:0,action:p.action,hasEagerState:p.hasEagerState,eagerState:p.eagerState,next:null}),a=p.hasEagerState?p.eagerState:e(a,p.action);else{var h={lane:f,action:p.action,hasEagerState:p.hasEagerState,eagerState:p.eagerState,next:null};d===null?(o=d=h,i=a):d=d.next=h,je.lanes|=f,vn|=f}p=p.next}while(p!==null&&p!==s);d===null?i=a:d.next=o,yt(a,t.memoizedState)||(Ke=!0),t.memoizedState=a,t.baseState=i,t.baseQueue=d,n.lastRenderedState=a}if(e=n.interleaved,e!==null){l=e;do s=l.lane,je.lanes|=s,vn|=s,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Xl(e){var t=ut(),n=t.queue;if(n===null)throw Error(A(311));n.lastRenderedReducer=e;var a=n.dispatch,l=n.pending,s=t.memoizedState;if(l!==null){n.pending=null;var i=l=l.next;do s=e(s,i.action),i=i.next;while(i!==l);yt(s,t.memoizedState)||(Ke=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,a]}function Qc(){}function Yc(e,t){var n=je,a=ut(),l=t(),s=!yt(a.memoizedState,l);if(s&&(a.memoizedState=l,Ke=!0),a=a.queue,Ri(Jc.bind(null,n,a,e),[e]),a.getSnapshot!==t||s||De!==null&&De.memoizedState.tag&1){if(n.flags|=2048,qr(9,Kc.bind(null,n,a,l,t),void 0,null),Ie===null)throw Error(A(349));xn&30||Gc(n,t,l)}return l}function Gc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=je.updateQueue,t===null?(t={lastEffect:null,stores:null},je.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Kc(e,t,n,a){t.value=n,t.getSnapshot=a,Xc(t)&&Zc(e)}function Jc(e,t,n){return n(function(){Xc(t)&&Zc(e)})}function Xc(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!yt(e,n)}catch{return!0}}function Zc(e){var t=Lt(e,1);t!==null&&vt(t,e,1,-1)}function Qo(e){var t=jt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Wr,lastRenderedState:e},t.queue=e,e=e.dispatch=kh.bind(null,je,e),[t.memoizedState,e]}function qr(e,t,n,a){return e={tag:e,create:t,destroy:n,deps:a,next:null},t=je.updateQueue,t===null?(t={lastEffect:null,stores:null},je.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(a=n.next,n.next=e,e.next=a,t.lastEffect=e)),e}function eu(){return ut().memoizedState}function Pa(e,t,n,a){var l=jt();je.flags|=e,l.memoizedState=qr(1|t,n,void 0,a===void 0?null:a)}function vl(e,t,n,a){var l=ut();a=a===void 0?null:a;var s=void 0;if(Pe!==null){var i=Pe.memoizedState;if(s=i.destroy,a!==null&&Li(a,i.deps)){l.memoizedState=qr(t,n,s,a);return}}je.flags|=e,l.memoizedState=qr(1|t,n,s,a)}function Yo(e,t){return Pa(8390656,8,e,t)}function Ri(e,t){return vl(2048,8,e,t)}function tu(e,t){return vl(4,2,e,t)}function nu(e,t){return vl(4,4,e,t)}function ru(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function au(e,t,n){return n=n!=null?n.concat([e]):null,vl(4,4,ru.bind(null,t,e),n)}function Oi(){}function lu(e,t){var n=ut();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&Li(t,a[1])?a[0]:(n.memoizedState=[e,t],e)}function su(e,t){var n=ut();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&Li(t,a[1])?a[0]:(e=e(),n.memoizedState=[e,t],e)}function iu(e,t,n){return xn&21?(yt(n,t)||(n=pc(),je.lanes|=n,vn|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Ke=!0),e.memoizedState=n)}function jh(e,t){var n=fe;fe=n!==0&&4>n?n:4,e(!0);var a=Kl.transition;Kl.transition={};try{e(!1),t()}finally{fe=n,Kl.transition=a}}function ou(){return ut().memoizedState}function wh(e,t,n){var a=Xt(e);if(n={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null},du(e))cu(t,n);else if(n=qc(e,t,n,a),n!==null){var l=He();vt(n,e,a,l),uu(n,t,a)}}function kh(e,t,n){var a=Xt(e),l={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null};if(du(e))cu(t,l);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var i=t.lastRenderedState,o=s(i,n);if(l.hasEagerState=!0,l.eagerState=o,yt(o,i)){var d=t.interleaved;d===null?(l.next=l,zi(t)):(l.next=d.next,d.next=l),t.interleaved=l;return}}catch{}finally{}n=qc(e,t,l,a),n!==null&&(l=He(),vt(n,e,a,l),uu(n,t,a))}}function du(e){var t=e.alternate;return e===je||t!==null&&t===je}function cu(e,t){Sr=el=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function uu(e,t,n){if(n&4194240){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,hi(e,n)}}var tl={readContext:ct,useCallback:Ae,useContext:Ae,useEffect:Ae,useImperativeHandle:Ae,useInsertionEffect:Ae,useLayoutEffect:Ae,useMemo:Ae,useReducer:Ae,useRef:Ae,useState:Ae,useDebugValue:Ae,useDeferredValue:Ae,useTransition:Ae,useMutableSource:Ae,useSyncExternalStore:Ae,useId:Ae,unstable_isNewReconciler:!1},Sh={readContext:ct,useCallback:function(e,t){return jt().memoizedState=[e,t===void 0?null:t],e},useContext:ct,useEffect:Yo,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Pa(4194308,4,ru.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Pa(4194308,4,e,t)},useInsertionEffect:function(e,t){return Pa(4,2,e,t)},useMemo:function(e,t){var n=jt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var a=jt();return t=n!==void 0?n(t):t,a.memoizedState=a.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},a.queue=e,e=e.dispatch=wh.bind(null,je,e),[a.memoizedState,e]},useRef:function(e){var t=jt();return e={current:e},t.memoizedState=e},useState:Qo,useDebugValue:Oi,useDeferredValue:function(e){return jt().memoizedState=e},useTransition:function(){var e=Qo(!1),t=e[0];return e=jh.bind(null,e[1]),jt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var a=je,l=jt();if(ve){if(n===void 0)throw Error(A(407));n=n()}else{if(n=t(),Ie===null)throw Error(A(349));xn&30||Gc(a,t,n)}l.memoizedState=n;var s={value:n,getSnapshot:t};return l.queue=s,Yo(Jc.bind(null,a,s,e),[e]),a.flags|=2048,qr(9,Kc.bind(null,a,s,n,t),void 0,null),n},useId:function(){var e=jt(),t=Ie.identifierPrefix;if(ve){var n=Et,a=zt;n=(a&~(1<<32-xt(a)-1)).toString(32)+n,t=":"+t+"R"+n,n=$r++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=bh++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},_h={readContext:ct,useCallback:lu,useContext:ct,useEffect:Ri,useImperativeHandle:au,useInsertionEffect:tu,useLayoutEffect:nu,useMemo:su,useReducer:Jl,useRef:eu,useState:function(){return Jl(Wr)},useDebugValue:Oi,useDeferredValue:function(e){var t=ut();return iu(t,Pe.memoizedState,e)},useTransition:function(){var e=Jl(Wr)[0],t=ut().memoizedState;return[e,t]},useMutableSource:Qc,useSyncExternalStore:Yc,useId:ou,unstable_isNewReconciler:!1},Nh={readContext:ct,useCallback:lu,useContext:ct,useEffect:Ri,useImperativeHandle:au,useInsertionEffect:tu,useLayoutEffect:nu,useMemo:su,useReducer:Xl,useRef:eu,useState:function(){return Xl(Wr)},useDebugValue:Oi,useDeferredValue:function(e){var t=ut();return Pe===null?t.memoizedState=e:iu(t,Pe.memoizedState,e)},useTransition:function(){var e=Xl(Wr)[0],t=ut().memoizedState;return[e,t]},useMutableSource:Qc,useSyncExternalStore:Yc,useId:ou,unstable_isNewReconciler:!1};function ht(e,t){if(e&&e.defaultProps){t=we({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Rs(e,t,n,a){t=e.memoizedState,n=n(a,t),n=n==null?t:we({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var yl={isMounted:function(e){return(e=e._reactInternals)?jn(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var a=He(),l=Xt(e),s=Pt(a,l);s.payload=t,n!=null&&(s.callback=n),t=Kt(e,s,l),t!==null&&(vt(t,e,l,a),za(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var a=He(),l=Xt(e),s=Pt(a,l);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=Kt(e,s,l),t!==null&&(vt(t,e,l,a),za(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=He(),a=Xt(e),l=Pt(n,a);l.tag=2,t!=null&&(l.callback=t),t=Kt(e,l,a),t!==null&&(vt(t,e,a,n),za(t,e,a))}};function Go(e,t,n,a,l,s,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,s,i):t.prototype&&t.prototype.isPureReactComponent?!Rr(n,a)||!Rr(l,s):!0}function pu(e,t,n){var a=!1,l=tn,s=t.contextType;return typeof s=="object"&&s!==null?s=ct(s):(l=Xe(t)?mn:$e.current,a=t.contextTypes,s=(a=a!=null)?qn(e,l):tn),t=new t(n,s),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=yl,e.stateNode=t,t._reactInternals=e,a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=s),t}function Ko(e,t,n,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,a),t.state!==e&&yl.enqueueReplaceState(t,t.state,null)}function Os(e,t,n,a){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},Ei(e);var s=t.contextType;typeof s=="object"&&s!==null?l.context=ct(s):(s=Xe(t)?mn:$e.current,l.context=qn(e,s)),l.state=e.memoizedState,s=t.getDerivedStateFromProps,typeof s=="function"&&(Rs(e,t,s,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&yl.enqueueReplaceState(l,l.state,null),Xa(e,n,l,a),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function Yn(e,t){try{var n="",a=t;do n+=Zp(a),a=a.return;while(a);var l=n}catch(s){l=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:t,stack:l,digest:null}}function Zl(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Bs(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Ch=typeof WeakMap=="function"?WeakMap:Map;function fu(e,t,n){n=Pt(-1,n),n.tag=3,n.payload={element:null};var a=t.value;return n.callback=function(){rl||(rl=!0,Ys=a),Bs(e,t)},n}function hu(e,t,n){n=Pt(-1,n),n.tag=3;var a=e.type.getDerivedStateFromError;if(typeof a=="function"){var l=t.value;n.payload=function(){return a(l)},n.callback=function(){Bs(e,t)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Bs(e,t),typeof a!="function"&&(Jt===null?Jt=new Set([this]):Jt.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function Jo(e,t,n){var a=e.pingCache;if(a===null){a=e.pingCache=new Ch;var l=new Set;a.set(t,l)}else l=a.get(t),l===void 0&&(l=new Set,a.set(t,l));l.has(n)||(l.add(n),e=Fh.bind(null,e,t,n),t.then(e,e))}function Xo(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Zo(e,t,n,a,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Pt(-1,1),t.tag=2,Kt(n,t,1))),n.lanes|=1),e)}var zh=Rt.ReactCurrentOwner,Ke=!1;function Ve(e,t,n,a){t.child=e===null?Wc(t,null,n,a):Hn(t,e.child,n,a)}function ed(e,t,n,a,l){n=n.render;var s=t.ref;return Un(t,l),a=Ii(e,t,n,a,s,l),n=Mi(),e!==null&&!Ke?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,It(e,t,l)):(ve&&n&&wi(t),t.flags|=1,Ve(e,t,a,l),t.child)}function td(e,t,n,a,l){if(e===null){var s=n.type;return typeof s=="function"&&!Vi(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=s,mu(e,t,s,a,l)):(e=Ia(n.type,null,a,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,!(e.lanes&l)){var i=s.memoizedProps;if(n=n.compare,n=n!==null?n:Rr,n(i,a)&&e.ref===t.ref)return It(e,t,l)}return t.flags|=1,e=Zt(s,a),e.ref=t.ref,e.return=t,t.child=e}function mu(e,t,n,a,l){if(e!==null){var s=e.memoizedProps;if(Rr(s,a)&&e.ref===t.ref)if(Ke=!1,t.pendingProps=a=s,(e.lanes&l)!==0)e.flags&131072&&(Ke=!0);else return t.lanes=e.lanes,It(e,t,l)}return As(e,t,n,a,l)}function gu(e,t,n){var a=t.pendingProps,l=a.children,s=e!==null?e.memoizedState:null;if(a.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},he(Mn,et),et|=n;else{if(!(n&1073741824))return e=s!==null?s.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,he(Mn,et),et|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},a=s!==null?s.baseLanes:n,he(Mn,et),et|=a}else s!==null?(a=s.baseLanes|n,t.memoizedState=null):a=n,he(Mn,et),et|=a;return Ve(e,t,l,n),t.child}function xu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function As(e,t,n,a,l){var s=Xe(n)?mn:$e.current;return s=qn(t,s),Un(t,l),n=Ii(e,t,n,a,s,l),a=Mi(),e!==null&&!Ke?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,It(e,t,l)):(ve&&a&&wi(t),t.flags|=1,Ve(e,t,n,l),t.child)}function nd(e,t,n,a,l){if(Xe(n)){var s=!0;Qa(t)}else s=!1;if(Un(t,l),t.stateNode===null)Ta(e,t),pu(t,n,a),Os(t,n,a,l),a=!0;else if(e===null){var i=t.stateNode,o=t.memoizedProps;i.props=o;var d=i.context,p=n.contextType;typeof p=="object"&&p!==null?p=ct(p):(p=Xe(n)?mn:$e.current,p=qn(t,p));var f=n.getDerivedStateFromProps,h=typeof f=="function"||typeof i.getSnapshotBeforeUpdate=="function";h||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(o!==a||d!==p)&&Ko(t,i,a,p),Ut=!1;var x=t.memoizedState;i.state=x,Xa(t,a,i,l),d=t.memoizedState,o!==a||x!==d||Je.current||Ut?(typeof f=="function"&&(Rs(t,n,f,a),d=t.memoizedState),(o=Ut||Go(t,n,o,a,x,d,p))?(h||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=d),i.props=a,i.state=d,i.context=p,a=o):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{i=t.stateNode,Vc(e,t),o=t.memoizedProps,p=t.type===t.elementType?o:ht(t.type,o),i.props=p,h=t.pendingProps,x=i.context,d=n.contextType,typeof d=="object"&&d!==null?d=ct(d):(d=Xe(n)?mn:$e.current,d=qn(t,d));var k=n.getDerivedStateFromProps;(f=typeof k=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(o!==h||x!==d)&&Ko(t,i,a,d),Ut=!1,x=t.memoizedState,i.state=x,Xa(t,a,i,l);var j=t.memoizedState;o!==h||x!==j||Je.current||Ut?(typeof k=="function"&&(Rs(t,n,k,a),j=t.memoizedState),(p=Ut||Go(t,n,p,a,x,j,d)||!1)?(f||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(a,j,d),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(a,j,d)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||o===e.memoizedProps&&x===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&x===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=j),i.props=a,i.state=j,i.context=d,a=p):(typeof i.componentDidUpdate!="function"||o===e.memoizedProps&&x===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&x===e.memoizedState||(t.flags|=1024),a=!1)}return Us(e,t,n,a,s,l)}function Us(e,t,n,a,l,s){xu(e,t);var i=(t.flags&128)!==0;if(!a&&!i)return l&&Fo(t,n,!1),It(e,t,s);a=t.stateNode,zh.current=t;var o=i&&typeof n.getDerivedStateFromError!="function"?null:a.render();return t.flags|=1,e!==null&&i?(t.child=Hn(t,e.child,null,s),t.child=Hn(t,null,o,s)):Ve(e,t,o,s),t.memoizedState=a.state,l&&Fo(t,n,!0),t.child}function vu(e){var t=e.stateNode;t.pendingContext?Uo(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Uo(e,t.context,!1),Pi(e,t.containerInfo)}function rd(e,t,n,a,l){return Vn(),Si(l),t.flags|=256,Ve(e,t,n,a),t.child}var Fs={dehydrated:null,treeContext:null,retryLane:0};function $s(e){return{baseLanes:e,cachePool:null,transitions:null}}function yu(e,t,n){var a=t.pendingProps,l=be.current,s=!1,i=(t.flags&128)!==0,o;if((o=i)||(o=e!==null&&e.memoizedState===null?!1:(l&2)!==0),o?(s=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),he(be,l&1),e===null)return Is(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(i=a.children,e=a.fallback,s?(a=t.mode,s=t.child,i={mode:"hidden",children:i},!(a&1)&&s!==null?(s.childLanes=0,s.pendingProps=i):s=wl(i,a,0,null),e=fn(e,a,n,null),s.return=t,e.return=t,s.sibling=e,t.child=s,t.child.memoizedState=$s(n),t.memoizedState=Fs,e):Bi(t,i));if(l=e.memoizedState,l!==null&&(o=l.dehydrated,o!==null))return Eh(e,t,i,a,o,l,n);if(s){s=a.fallback,i=t.mode,l=e.child,o=l.sibling;var d={mode:"hidden",children:a.children};return!(i&1)&&t.child!==l?(a=t.child,a.childLanes=0,a.pendingProps=d,t.deletions=null):(a=Zt(l,d),a.subtreeFlags=l.subtreeFlags&14680064),o!==null?s=Zt(o,s):(s=fn(s,i,n,null),s.flags|=2),s.return=t,a.return=t,a.sibling=s,t.child=a,a=s,s=t.child,i=e.child.memoizedState,i=i===null?$s(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},s.memoizedState=i,s.childLanes=e.childLanes&~n,t.memoizedState=Fs,a}return s=e.child,e=s.sibling,a=Zt(s,{mode:"visible",children:a.children}),!(t.mode&1)&&(a.lanes=n),a.return=t,a.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=a,t.memoizedState=null,a}function Bi(e,t){return t=wl({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function va(e,t,n,a){return a!==null&&Si(a),Hn(t,e.child,null,n),e=Bi(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Eh(e,t,n,a,l,s,i){if(n)return t.flags&256?(t.flags&=-257,a=Zl(Error(A(422))),va(e,t,i,a)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(s=a.fallback,l=t.mode,a=wl({mode:"visible",children:a.children},l,0,null),s=fn(s,l,i,null),s.flags|=2,a.return=t,s.return=t,a.sibling=s,t.child=a,t.mode&1&&Hn(t,e.child,null,i),t.child.memoizedState=$s(i),t.memoizedState=Fs,s);if(!(t.mode&1))return va(e,t,i,null);if(l.data==="$!"){if(a=l.nextSibling&&l.nextSibling.dataset,a)var o=a.dgst;return a=o,s=Error(A(419)),a=Zl(s,a,void 0),va(e,t,i,a)}if(o=(i&e.childLanes)!==0,Ke||o){if(a=Ie,a!==null){switch(i&-i){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(a.suspendedLanes|i)?0:l,l!==0&&l!==s.retryLane&&(s.retryLane=l,Lt(e,l),vt(a,e,l,-1))}return qi(),a=Zl(Error(A(421))),va(e,t,i,a)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=$h.bind(null,e),l._reactRetry=t,null):(e=s.treeContext,tt=Gt(l.nextSibling),nt=t,ve=!0,gt=null,e!==null&&(st[it++]=zt,st[it++]=Et,st[it++]=gn,zt=e.id,Et=e.overflow,gn=t),t=Bi(t,a.children),t.flags|=4096,t)}function ad(e,t,n){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),Ms(e.return,t,n)}function es(e,t,n,a,l){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:n,tailMode:l}:(s.isBackwards=t,s.rendering=null,s.renderingStartTime=0,s.last=a,s.tail=n,s.tailMode=l)}function bu(e,t,n){var a=t.pendingProps,l=a.revealOrder,s=a.tail;if(Ve(e,t,a.children,n),a=be.current,a&2)a=a&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ad(e,n,t);else if(e.tag===19)ad(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}a&=1}if(he(be,a),!(t.mode&1))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Za(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),es(t,!1,l,n,s);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Za(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}es(t,!0,n,null,s);break;case"together":es(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ta(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function It(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),vn|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(A(153));if(t.child!==null){for(e=t.child,n=Zt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Zt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Ph(e,t,n){switch(t.tag){case 3:vu(t),Vn();break;case 5:Hc(t);break;case 1:Xe(t.type)&&Qa(t);break;case 4:Pi(t,t.stateNode.containerInfo);break;case 10:var a=t.type._context,l=t.memoizedProps.value;he(Ka,a._currentValue),a._currentValue=l;break;case 13:if(a=t.memoizedState,a!==null)return a.dehydrated!==null?(he(be,be.current&1),t.flags|=128,null):n&t.child.childLanes?yu(e,t,n):(he(be,be.current&1),e=It(e,t,n),e!==null?e.sibling:null);he(be,be.current&1);break;case 19:if(a=(n&t.childLanes)!==0,e.flags&128){if(a)return bu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),he(be,be.current),a)break;return null;case 22:case 23:return t.lanes=0,gu(e,t,n)}return It(e,t,n)}var ju,Ws,wu,ku;ju=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Ws=function(){};wu=function(e,t,n,a){var l=e.memoizedProps;if(l!==a){e=t.stateNode,un(St.current);var s=null;switch(n){case"input":l=us(e,l),a=us(e,a),s=[];break;case"select":l=we({},l,{value:void 0}),a=we({},a,{value:void 0}),s=[];break;case"textarea":l=hs(e,l),a=hs(e,a),s=[];break;default:typeof l.onClick!="function"&&typeof a.onClick=="function"&&(e.onclick=Va)}gs(n,a);var i;n=null;for(p in l)if(!a.hasOwnProperty(p)&&l.hasOwnProperty(p)&&l[p]!=null)if(p==="style"){var o=l[p];for(i in o)o.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else p!=="dangerouslySetInnerHTML"&&p!=="children"&&p!=="suppressContentEditableWarning"&&p!=="suppressHydrationWarning"&&p!=="autoFocus"&&(Er.hasOwnProperty(p)?s||(s=[]):(s=s||[]).push(p,null));for(p in a){var d=a[p];if(o=l!=null?l[p]:void 0,a.hasOwnProperty(p)&&d!==o&&(d!=null||o!=null))if(p==="style")if(o){for(i in o)!o.hasOwnProperty(i)||d&&d.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in d)d.hasOwnProperty(i)&&o[i]!==d[i]&&(n||(n={}),n[i]=d[i])}else n||(s||(s=[]),s.push(p,n)),n=d;else p==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,o=o?o.__html:void 0,d!=null&&o!==d&&(s=s||[]).push(p,d)):p==="children"?typeof d!="string"&&typeof d!="number"||(s=s||[]).push(p,""+d):p!=="suppressContentEditableWarning"&&p!=="suppressHydrationWarning"&&(Er.hasOwnProperty(p)?(d!=null&&p==="onScroll"&&me("scroll",e),s||o===d||(s=[])):(s=s||[]).push(p,d))}n&&(s=s||[]).push("style",n);var p=s;(t.updateQueue=p)&&(t.flags|=4)}};ku=function(e,t,n,a){n!==a&&(t.flags|=4)};function or(e,t){if(!ve)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function Ue(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,a=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,a|=l.subtreeFlags&14680064,a|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,a|=l.subtreeFlags,a|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=a,e.childLanes=n,t}function Th(e,t,n){var a=t.pendingProps;switch(ki(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ue(t),null;case 1:return Xe(t.type)&&Ha(),Ue(t),null;case 3:return a=t.stateNode,Qn(),ge(Je),ge($e),Di(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(ga(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,gt!==null&&(Js(gt),gt=null))),Ws(e,t),Ue(t),null;case 5:Ti(t);var l=un(Fr.current);if(n=t.type,e!==null&&t.stateNode!=null)wu(e,t,n,a,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!a){if(t.stateNode===null)throw Error(A(166));return Ue(t),null}if(e=un(St.current),ga(t)){a=t.stateNode,n=t.type;var s=t.memoizedProps;switch(a[wt]=t,a[Ar]=s,e=(t.mode&1)!==0,n){case"dialog":me("cancel",a),me("close",a);break;case"iframe":case"object":case"embed":me("load",a);break;case"video":case"audio":for(l=0;l<fr.length;l++)me(fr[l],a);break;case"source":me("error",a);break;case"img":case"image":case"link":me("error",a),me("load",a);break;case"details":me("toggle",a);break;case"input":fo(a,s),me("invalid",a);break;case"select":a._wrapperState={wasMultiple:!!s.multiple},me("invalid",a);break;case"textarea":mo(a,s),me("invalid",a)}gs(n,s),l=null;for(var i in s)if(s.hasOwnProperty(i)){var o=s[i];i==="children"?typeof o=="string"?a.textContent!==o&&(s.suppressHydrationWarning!==!0&&ma(a.textContent,o,e),l=["children",o]):typeof o=="number"&&a.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&ma(a.textContent,o,e),l=["children",""+o]):Er.hasOwnProperty(i)&&o!=null&&i==="onScroll"&&me("scroll",a)}switch(n){case"input":ia(a),ho(a,s,!0);break;case"textarea":ia(a),go(a);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(a.onclick=Va)}a=l,t.updateQueue=a,a!==null&&(t.flags|=4)}else{i=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Jd(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof a.is=="string"?e=i.createElement(n,{is:a.is}):(e=i.createElement(n),n==="select"&&(i=e,a.multiple?i.multiple=!0:a.size&&(i.size=a.size))):e=i.createElementNS(e,n),e[wt]=t,e[Ar]=a,ju(e,t,!1,!1),t.stateNode=e;e:{switch(i=xs(n,a),n){case"dialog":me("cancel",e),me("close",e),l=a;break;case"iframe":case"object":case"embed":me("load",e),l=a;break;case"video":case"audio":for(l=0;l<fr.length;l++)me(fr[l],e);l=a;break;case"source":me("error",e),l=a;break;case"img":case"image":case"link":me("error",e),me("load",e),l=a;break;case"details":me("toggle",e),l=a;break;case"input":fo(e,a),l=us(e,a),me("invalid",e);break;case"option":l=a;break;case"select":e._wrapperState={wasMultiple:!!a.multiple},l=we({},a,{value:void 0}),me("invalid",e);break;case"textarea":mo(e,a),l=hs(e,a),me("invalid",e);break;default:l=a}gs(n,l),o=l;for(s in o)if(o.hasOwnProperty(s)){var d=o[s];s==="style"?ec(e,d):s==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,d!=null&&Xd(e,d)):s==="children"?typeof d=="string"?(n!=="textarea"||d!=="")&&Pr(e,d):typeof d=="number"&&Pr(e,""+d):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Er.hasOwnProperty(s)?d!=null&&s==="onScroll"&&me("scroll",e):d!=null&&oi(e,s,d,i))}switch(n){case"input":ia(e),ho(e,a,!1);break;case"textarea":ia(e),go(e);break;case"option":a.value!=null&&e.setAttribute("value",""+en(a.value));break;case"select":e.multiple=!!a.multiple,s=a.value,s!=null?Rn(e,!!a.multiple,s,!1):a.defaultValue!=null&&Rn(e,!!a.multiple,a.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Va)}switch(n){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}}a&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ue(t),null;case 6:if(e&&t.stateNode!=null)ku(e,t,e.memoizedProps,a);else{if(typeof a!="string"&&t.stateNode===null)throw Error(A(166));if(n=un(Fr.current),un(St.current),ga(t)){if(a=t.stateNode,n=t.memoizedProps,a[wt]=t,(s=a.nodeValue!==n)&&(e=nt,e!==null))switch(e.tag){case 3:ma(a.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ma(a.nodeValue,n,(e.mode&1)!==0)}s&&(t.flags|=4)}else a=(n.nodeType===9?n:n.ownerDocument).createTextNode(a),a[wt]=t,t.stateNode=a}return Ue(t),null;case 13:if(ge(be),a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ve&&tt!==null&&t.mode&1&&!(t.flags&128))Fc(),Vn(),t.flags|=98560,s=!1;else if(s=ga(t),a!==null&&a.dehydrated!==null){if(e===null){if(!s)throw Error(A(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(A(317));s[wt]=t}else Vn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Ue(t),s=!1}else gt!==null&&(Js(gt),gt=null),s=!0;if(!s)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(a=a!==null,a!==(e!==null&&e.memoizedState!==null)&&a&&(t.child.flags|=8192,t.mode&1&&(e===null||be.current&1?Te===0&&(Te=3):qi())),t.updateQueue!==null&&(t.flags|=4),Ue(t),null);case 4:return Qn(),Ws(e,t),e===null&&Or(t.stateNode.containerInfo),Ue(t),null;case 10:return Ci(t.type._context),Ue(t),null;case 17:return Xe(t.type)&&Ha(),Ue(t),null;case 19:if(ge(be),s=t.memoizedState,s===null)return Ue(t),null;if(a=(t.flags&128)!==0,i=s.rendering,i===null)if(a)or(s,!1);else{if(Te!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(i=Za(e),i!==null){for(t.flags|=128,or(s,!1),a=i.updateQueue,a!==null&&(t.updateQueue=a,t.flags|=4),t.subtreeFlags=0,a=n,n=t.child;n!==null;)s=n,e=a,s.flags&=14680066,i=s.alternate,i===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=i.childLanes,s.lanes=i.lanes,s.child=i.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=i.memoizedProps,s.memoizedState=i.memoizedState,s.updateQueue=i.updateQueue,s.type=i.type,e=i.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return he(be,be.current&1|2),t.child}e=e.sibling}s.tail!==null&&_e()>Gn&&(t.flags|=128,a=!0,or(s,!1),t.lanes=4194304)}else{if(!a)if(e=Za(i),e!==null){if(t.flags|=128,a=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),or(s,!0),s.tail===null&&s.tailMode==="hidden"&&!i.alternate&&!ve)return Ue(t),null}else 2*_e()-s.renderingStartTime>Gn&&n!==1073741824&&(t.flags|=128,a=!0,or(s,!1),t.lanes=4194304);s.isBackwards?(i.sibling=t.child,t.child=i):(n=s.last,n!==null?n.sibling=i:t.child=i,s.last=i)}return s.tail!==null?(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=_e(),t.sibling=null,n=be.current,he(be,a?n&1|2:n&1),t):(Ue(t),null);case 22:case 23:return Wi(),a=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==a&&(t.flags|=8192),a&&t.mode&1?et&1073741824&&(Ue(t),t.subtreeFlags&6&&(t.flags|=8192)):Ue(t),null;case 24:return null;case 25:return null}throw Error(A(156,t.tag))}function Dh(e,t){switch(ki(t),t.tag){case 1:return Xe(t.type)&&Ha(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Qn(),ge(Je),ge($e),Di(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Ti(t),null;case 13:if(ge(be),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(A(340));Vn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ge(be),null;case 4:return Qn(),null;case 10:return Ci(t.type._context),null;case 22:case 23:return Wi(),null;case 24:return null;default:return null}}var ya=!1,Fe=!1,Lh=typeof WeakSet=="function"?WeakSet:Set,q=null;function In(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(a){ke(e,t,a)}else n.current=null}function qs(e,t,n){try{n()}catch(a){ke(e,t,a)}}var ld=!1;function Ih(e,t){if(Cs=$a,e=zc(),ji(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var a=n.getSelection&&n.getSelection();if(a&&a.rangeCount!==0){n=a.anchorNode;var l=a.anchorOffset,s=a.focusNode;a=a.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var i=0,o=-1,d=-1,p=0,f=0,h=e,x=null;t:for(;;){for(var k;h!==n||l!==0&&h.nodeType!==3||(o=i+l),h!==s||a!==0&&h.nodeType!==3||(d=i+a),h.nodeType===3&&(i+=h.nodeValue.length),(k=h.firstChild)!==null;)x=h,h=k;for(;;){if(h===e)break t;if(x===n&&++p===l&&(o=i),x===s&&++f===a&&(d=i),(k=h.nextSibling)!==null)break;h=x,x=h.parentNode}h=k}n=o===-1||d===-1?null:{start:o,end:d}}else n=null}n=n||{start:0,end:0}}else n=null;for(zs={focusedElem:e,selectionRange:n},$a=!1,q=t;q!==null;)if(t=q,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,q=e;else for(;q!==null;){t=q;try{var j=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(j!==null){var w=j.memoizedProps,_=j.memoizedState,g=t.stateNode,u=g.getSnapshotBeforeUpdate(t.elementType===t.type?w:ht(t.type,w),_);g.__reactInternalSnapshotBeforeUpdate=u}break;case 3:var c=t.stateNode.containerInfo;c.nodeType===1?c.textContent="":c.nodeType===9&&c.documentElement&&c.removeChild(c.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(A(163))}}catch(v){ke(t,t.return,v)}if(e=t.sibling,e!==null){e.return=t.return,q=e;break}q=t.return}return j=ld,ld=!1,j}function _r(e,t,n){var a=t.updateQueue;if(a=a!==null?a.lastEffect:null,a!==null){var l=a=a.next;do{if((l.tag&e)===e){var s=l.destroy;l.destroy=void 0,s!==void 0&&qs(t,n,s)}l=l.next}while(l!==a)}}function bl(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var a=n.create;n.destroy=a()}n=n.next}while(n!==t)}}function Vs(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Su(e){var t=e.alternate;t!==null&&(e.alternate=null,Su(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[wt],delete t[Ar],delete t[Ts],delete t[gh],delete t[xh])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function _u(e){return e.tag===5||e.tag===3||e.tag===4}function sd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||_u(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Hs(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Va));else if(a!==4&&(e=e.child,e!==null))for(Hs(e,t,n),e=e.sibling;e!==null;)Hs(e,t,n),e=e.sibling}function Qs(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(a!==4&&(e=e.child,e!==null))for(Qs(e,t,n),e=e.sibling;e!==null;)Qs(e,t,n),e=e.sibling}var Re=null,mt=!1;function Bt(e,t,n){for(n=n.child;n!==null;)Nu(e,t,n),n=n.sibling}function Nu(e,t,n){if(kt&&typeof kt.onCommitFiberUnmount=="function")try{kt.onCommitFiberUnmount(pl,n)}catch{}switch(n.tag){case 5:Fe||In(n,t);case 6:var a=Re,l=mt;Re=null,Bt(e,t,n),Re=a,mt=l,Re!==null&&(mt?(e=Re,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Re.removeChild(n.stateNode));break;case 18:Re!==null&&(mt?(e=Re,n=n.stateNode,e.nodeType===8?Ql(e.parentNode,n):e.nodeType===1&&Ql(e,n),Ir(e)):Ql(Re,n.stateNode));break;case 4:a=Re,l=mt,Re=n.stateNode.containerInfo,mt=!0,Bt(e,t,n),Re=a,mt=l;break;case 0:case 11:case 14:case 15:if(!Fe&&(a=n.updateQueue,a!==null&&(a=a.lastEffect,a!==null))){l=a=a.next;do{var s=l,i=s.destroy;s=s.tag,i!==void 0&&(s&2||s&4)&&qs(n,t,i),l=l.next}while(l!==a)}Bt(e,t,n);break;case 1:if(!Fe&&(In(n,t),a=n.stateNode,typeof a.componentWillUnmount=="function"))try{a.props=n.memoizedProps,a.state=n.memoizedState,a.componentWillUnmount()}catch(o){ke(n,t,o)}Bt(e,t,n);break;case 21:Bt(e,t,n);break;case 22:n.mode&1?(Fe=(a=Fe)||n.memoizedState!==null,Bt(e,t,n),Fe=a):Bt(e,t,n);break;default:Bt(e,t,n)}}function id(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Lh),t.forEach(function(a){var l=Wh.bind(null,e,a);n.has(a)||(n.add(a),a.then(l,l))})}}function ft(e,t){var n=t.deletions;if(n!==null)for(var a=0;a<n.length;a++){var l=n[a];try{var s=e,i=t,o=i;e:for(;o!==null;){switch(o.tag){case 5:Re=o.stateNode,mt=!1;break e;case 3:Re=o.stateNode.containerInfo,mt=!0;break e;case 4:Re=o.stateNode.containerInfo,mt=!0;break e}o=o.return}if(Re===null)throw Error(A(160));Nu(s,i,l),Re=null,mt=!1;var d=l.alternate;d!==null&&(d.return=null),l.return=null}catch(p){ke(l,t,p)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Cu(t,e),t=t.sibling}function Cu(e,t){var n=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(ft(t,e),bt(e),a&4){try{_r(3,e,e.return),bl(3,e)}catch(w){ke(e,e.return,w)}try{_r(5,e,e.return)}catch(w){ke(e,e.return,w)}}break;case 1:ft(t,e),bt(e),a&512&&n!==null&&In(n,n.return);break;case 5:if(ft(t,e),bt(e),a&512&&n!==null&&In(n,n.return),e.flags&32){var l=e.stateNode;try{Pr(l,"")}catch(w){ke(e,e.return,w)}}if(a&4&&(l=e.stateNode,l!=null)){var s=e.memoizedProps,i=n!==null?n.memoizedProps:s,o=e.type,d=e.updateQueue;if(e.updateQueue=null,d!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&Gd(l,s),xs(o,i);var p=xs(o,s);for(i=0;i<d.length;i+=2){var f=d[i],h=d[i+1];f==="style"?ec(l,h):f==="dangerouslySetInnerHTML"?Xd(l,h):f==="children"?Pr(l,h):oi(l,f,h,p)}switch(o){case"input":ps(l,s);break;case"textarea":Kd(l,s);break;case"select":var x=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!s.multiple;var k=s.value;k!=null?Rn(l,!!s.multiple,k,!1):x!==!!s.multiple&&(s.defaultValue!=null?Rn(l,!!s.multiple,s.defaultValue,!0):Rn(l,!!s.multiple,s.multiple?[]:"",!1))}l[Ar]=s}catch(w){ke(e,e.return,w)}}break;case 6:if(ft(t,e),bt(e),a&4){if(e.stateNode===null)throw Error(A(162));l=e.stateNode,s=e.memoizedProps;try{l.nodeValue=s}catch(w){ke(e,e.return,w)}}break;case 3:if(ft(t,e),bt(e),a&4&&n!==null&&n.memoizedState.isDehydrated)try{Ir(t.containerInfo)}catch(w){ke(e,e.return,w)}break;case 4:ft(t,e),bt(e);break;case 13:ft(t,e),bt(e),l=e.child,l.flags&8192&&(s=l.memoizedState!==null,l.stateNode.isHidden=s,!s||l.alternate!==null&&l.alternate.memoizedState!==null||(Fi=_e())),a&4&&id(e);break;case 22:if(f=n!==null&&n.memoizedState!==null,e.mode&1?(Fe=(p=Fe)||f,ft(t,e),Fe=p):ft(t,e),bt(e),a&8192){if(p=e.memoizedState!==null,(e.stateNode.isHidden=p)&&!f&&e.mode&1)for(q=e,f=e.child;f!==null;){for(h=q=f;q!==null;){switch(x=q,k=x.child,x.tag){case 0:case 11:case 14:case 15:_r(4,x,x.return);break;case 1:In(x,x.return);var j=x.stateNode;if(typeof j.componentWillUnmount=="function"){a=x,n=x.return;try{t=a,j.props=t.memoizedProps,j.state=t.memoizedState,j.componentWillUnmount()}catch(w){ke(a,n,w)}}break;case 5:In(x,x.return);break;case 22:if(x.memoizedState!==null){dd(h);continue}}k!==null?(k.return=x,q=k):dd(h)}f=f.sibling}e:for(f=null,h=e;;){if(h.tag===5){if(f===null){f=h;try{l=h.stateNode,p?(s=l.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=h.stateNode,d=h.memoizedProps.style,i=d!=null&&d.hasOwnProperty("display")?d.display:null,o.style.display=Zd("display",i))}catch(w){ke(e,e.return,w)}}}else if(h.tag===6){if(f===null)try{h.stateNode.nodeValue=p?"":h.memoizedProps}catch(w){ke(e,e.return,w)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===e)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===e)break e;for(;h.sibling===null;){if(h.return===null||h.return===e)break e;f===h&&(f=null),h=h.return}f===h&&(f=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:ft(t,e),bt(e),a&4&&id(e);break;case 21:break;default:ft(t,e),bt(e)}}function bt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(_u(n)){var a=n;break e}n=n.return}throw Error(A(160))}switch(a.tag){case 5:var l=a.stateNode;a.flags&32&&(Pr(l,""),a.flags&=-33);var s=sd(e);Qs(e,s,l);break;case 3:case 4:var i=a.stateNode.containerInfo,o=sd(e);Hs(e,o,i);break;default:throw Error(A(161))}}catch(d){ke(e,e.return,d)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Mh(e,t,n){q=e,zu(e)}function zu(e,t,n){for(var a=(e.mode&1)!==0;q!==null;){var l=q,s=l.child;if(l.tag===22&&a){var i=l.memoizedState!==null||ya;if(!i){var o=l.alternate,d=o!==null&&o.memoizedState!==null||Fe;o=ya;var p=Fe;if(ya=i,(Fe=d)&&!p)for(q=l;q!==null;)i=q,d=i.child,i.tag===22&&i.memoizedState!==null?cd(l):d!==null?(d.return=i,q=d):cd(l);for(;s!==null;)q=s,zu(s),s=s.sibling;q=l,ya=o,Fe=p}od(e)}else l.subtreeFlags&8772&&s!==null?(s.return=l,q=s):od(e)}}function od(e){for(;q!==null;){var t=q;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Fe||bl(5,t);break;case 1:var a=t.stateNode;if(t.flags&4&&!Fe)if(n===null)a.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:ht(t.type,n.memoizedProps);a.componentDidUpdate(l,n.memoizedState,a.__reactInternalSnapshotBeforeUpdate)}var s=t.updateQueue;s!==null&&Ho(t,s,a);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Ho(t,i,n)}break;case 5:var o=t.stateNode;if(n===null&&t.flags&4){n=o;var d=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":d.autoFocus&&n.focus();break;case"img":d.src&&(n.src=d.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var p=t.alternate;if(p!==null){var f=p.memoizedState;if(f!==null){var h=f.dehydrated;h!==null&&Ir(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(A(163))}Fe||t.flags&512&&Vs(t)}catch(x){ke(t,t.return,x)}}if(t===e){q=null;break}if(n=t.sibling,n!==null){n.return=t.return,q=n;break}q=t.return}}function dd(e){for(;q!==null;){var t=q;if(t===e){q=null;break}var n=t.sibling;if(n!==null){n.return=t.return,q=n;break}q=t.return}}function cd(e){for(;q!==null;){var t=q;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{bl(4,t)}catch(d){ke(t,n,d)}break;case 1:var a=t.stateNode;if(typeof a.componentDidMount=="function"){var l=t.return;try{a.componentDidMount()}catch(d){ke(t,l,d)}}var s=t.return;try{Vs(t)}catch(d){ke(t,s,d)}break;case 5:var i=t.return;try{Vs(t)}catch(d){ke(t,i,d)}}}catch(d){ke(t,t.return,d)}if(t===e){q=null;break}var o=t.sibling;if(o!==null){o.return=t.return,q=o;break}q=t.return}}var Rh=Math.ceil,nl=Rt.ReactCurrentDispatcher,Ai=Rt.ReactCurrentOwner,dt=Rt.ReactCurrentBatchConfig,oe=0,Ie=null,Ce=null,Oe=0,et=0,Mn=rn(0),Te=0,Vr=null,vn=0,jl=0,Ui=0,Nr=null,Ge=null,Fi=0,Gn=1/0,Nt=null,rl=!1,Ys=null,Jt=null,ba=!1,qt=null,al=0,Cr=0,Gs=null,Da=-1,La=0;function He(){return oe&6?_e():Da!==-1?Da:Da=_e()}function Xt(e){return e.mode&1?oe&2&&Oe!==0?Oe&-Oe:yh.transition!==null?(La===0&&(La=pc()),La):(e=fe,e!==0||(e=window.event,e=e===void 0?16:yc(e.type)),e):1}function vt(e,t,n,a){if(50<Cr)throw Cr=0,Gs=null,Error(A(185));Kr(e,n,a),(!(oe&2)||e!==Ie)&&(e===Ie&&(!(oe&2)&&(jl|=n),Te===4&&$t(e,Oe)),Ze(e,a),n===1&&oe===0&&!(t.mode&1)&&(Gn=_e()+500,xl&&an()))}function Ze(e,t){var n=e.callbackNode;yf(e,t);var a=Fa(e,e===Ie?Oe:0);if(a===0)n!==null&&yo(n),e.callbackNode=null,e.callbackPriority=0;else if(t=a&-a,e.callbackPriority!==t){if(n!=null&&yo(n),t===1)e.tag===0?vh(ud.bind(null,e)):Bc(ud.bind(null,e)),hh(function(){!(oe&6)&&an()}),n=null;else{switch(fc(a)){case 1:n=fi;break;case 4:n=cc;break;case 16:n=Ua;break;case 536870912:n=uc;break;default:n=Ua}n=Ru(n,Eu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Eu(e,t){if(Da=-1,La=0,oe&6)throw Error(A(327));var n=e.callbackNode;if(Fn()&&e.callbackNode!==n)return null;var a=Fa(e,e===Ie?Oe:0);if(a===0)return null;if(a&30||a&e.expiredLanes||t)t=ll(e,a);else{t=a;var l=oe;oe|=2;var s=Tu();(Ie!==e||Oe!==t)&&(Nt=null,Gn=_e()+500,pn(e,t));do try{Ah();break}catch(o){Pu(e,o)}while(!0);Ni(),nl.current=s,oe=l,Ce!==null?t=0:(Ie=null,Oe=0,t=Te)}if(t!==0){if(t===2&&(l=ws(e),l!==0&&(a=l,t=Ks(e,l))),t===1)throw n=Vr,pn(e,0),$t(e,a),Ze(e,_e()),n;if(t===6)$t(e,a);else{if(l=e.current.alternate,!(a&30)&&!Oh(l)&&(t=ll(e,a),t===2&&(s=ws(e),s!==0&&(a=s,t=Ks(e,s))),t===1))throw n=Vr,pn(e,0),$t(e,a),Ze(e,_e()),n;switch(e.finishedWork=l,e.finishedLanes=a,t){case 0:case 1:throw Error(A(345));case 2:on(e,Ge,Nt);break;case 3:if($t(e,a),(a&130023424)===a&&(t=Fi+500-_e(),10<t)){if(Fa(e,0)!==0)break;if(l=e.suspendedLanes,(l&a)!==a){He(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=Ps(on.bind(null,e,Ge,Nt),t);break}on(e,Ge,Nt);break;case 4:if($t(e,a),(a&4194240)===a)break;for(t=e.eventTimes,l=-1;0<a;){var i=31-xt(a);s=1<<i,i=t[i],i>l&&(l=i),a&=~s}if(a=l,a=_e()-a,a=(120>a?120:480>a?480:1080>a?1080:1920>a?1920:3e3>a?3e3:4320>a?4320:1960*Rh(a/1960))-a,10<a){e.timeoutHandle=Ps(on.bind(null,e,Ge,Nt),a);break}on(e,Ge,Nt);break;case 5:on(e,Ge,Nt);break;default:throw Error(A(329))}}}return Ze(e,_e()),e.callbackNode===n?Eu.bind(null,e):null}function Ks(e,t){var n=Nr;return e.current.memoizedState.isDehydrated&&(pn(e,t).flags|=256),e=ll(e,t),e!==2&&(t=Ge,Ge=n,t!==null&&Js(t)),e}function Js(e){Ge===null?Ge=e:Ge.push.apply(Ge,e)}function Oh(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var a=0;a<n.length;a++){var l=n[a],s=l.getSnapshot;l=l.value;try{if(!yt(s(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function $t(e,t){for(t&=~Ui,t&=~jl,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-xt(t),a=1<<n;e[n]=-1,t&=~a}}function ud(e){if(oe&6)throw Error(A(327));Fn();var t=Fa(e,0);if(!(t&1))return Ze(e,_e()),null;var n=ll(e,t);if(e.tag!==0&&n===2){var a=ws(e);a!==0&&(t=a,n=Ks(e,a))}if(n===1)throw n=Vr,pn(e,0),$t(e,t),Ze(e,_e()),n;if(n===6)throw Error(A(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,on(e,Ge,Nt),Ze(e,_e()),null}function $i(e,t){var n=oe;oe|=1;try{return e(t)}finally{oe=n,oe===0&&(Gn=_e()+500,xl&&an())}}function yn(e){qt!==null&&qt.tag===0&&!(oe&6)&&Fn();var t=oe;oe|=1;var n=dt.transition,a=fe;try{if(dt.transition=null,fe=1,e)return e()}finally{fe=a,dt.transition=n,oe=t,!(oe&6)&&an()}}function Wi(){et=Mn.current,ge(Mn)}function pn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,fh(n)),Ce!==null)for(n=Ce.return;n!==null;){var a=n;switch(ki(a),a.tag){case 1:a=a.type.childContextTypes,a!=null&&Ha();break;case 3:Qn(),ge(Je),ge($e),Di();break;case 5:Ti(a);break;case 4:Qn();break;case 13:ge(be);break;case 19:ge(be);break;case 10:Ci(a.type._context);break;case 22:case 23:Wi()}n=n.return}if(Ie=e,Ce=e=Zt(e.current,null),Oe=et=t,Te=0,Vr=null,Ui=jl=vn=0,Ge=Nr=null,cn!==null){for(t=0;t<cn.length;t++)if(n=cn[t],a=n.interleaved,a!==null){n.interleaved=null;var l=a.next,s=n.pending;if(s!==null){var i=s.next;s.next=l,a.next=i}n.pending=a}cn=null}return e}function Pu(e,t){do{var n=Ce;try{if(Ni(),Ea.current=tl,el){for(var a=je.memoizedState;a!==null;){var l=a.queue;l!==null&&(l.pending=null),a=a.next}el=!1}if(xn=0,De=Pe=je=null,Sr=!1,$r=0,Ai.current=null,n===null||n.return===null){Te=1,Vr=t,Ce=null;break}e:{var s=e,i=n.return,o=n,d=t;if(t=Oe,o.flags|=32768,d!==null&&typeof d=="object"&&typeof d.then=="function"){var p=d,f=o,h=f.tag;if(!(f.mode&1)&&(h===0||h===11||h===15)){var x=f.alternate;x?(f.updateQueue=x.updateQueue,f.memoizedState=x.memoizedState,f.lanes=x.lanes):(f.updateQueue=null,f.memoizedState=null)}var k=Xo(i);if(k!==null){k.flags&=-257,Zo(k,i,o,s,t),k.mode&1&&Jo(s,p,t),t=k,d=p;var j=t.updateQueue;if(j===null){var w=new Set;w.add(d),t.updateQueue=w}else j.add(d);break e}else{if(!(t&1)){Jo(s,p,t),qi();break e}d=Error(A(426))}}else if(ve&&o.mode&1){var _=Xo(i);if(_!==null){!(_.flags&65536)&&(_.flags|=256),Zo(_,i,o,s,t),Si(Yn(d,o));break e}}s=d=Yn(d,o),Te!==4&&(Te=2),Nr===null?Nr=[s]:Nr.push(s),s=i;do{switch(s.tag){case 3:s.flags|=65536,t&=-t,s.lanes|=t;var g=fu(s,d,t);Vo(s,g);break e;case 1:o=d;var u=s.type,c=s.stateNode;if(!(s.flags&128)&&(typeof u.getDerivedStateFromError=="function"||c!==null&&typeof c.componentDidCatch=="function"&&(Jt===null||!Jt.has(c)))){s.flags|=65536,t&=-t,s.lanes|=t;var v=hu(s,o,t);Vo(s,v);break e}}s=s.return}while(s!==null)}Lu(n)}catch(N){t=N,Ce===n&&n!==null&&(Ce=n=n.return);continue}break}while(!0)}function Tu(){var e=nl.current;return nl.current=tl,e===null?tl:e}function qi(){(Te===0||Te===3||Te===2)&&(Te=4),Ie===null||!(vn&268435455)&&!(jl&268435455)||$t(Ie,Oe)}function ll(e,t){var n=oe;oe|=2;var a=Tu();(Ie!==e||Oe!==t)&&(Nt=null,pn(e,t));do try{Bh();break}catch(l){Pu(e,l)}while(!0);if(Ni(),oe=n,nl.current=a,Ce!==null)throw Error(A(261));return Ie=null,Oe=0,Te}function Bh(){for(;Ce!==null;)Du(Ce)}function Ah(){for(;Ce!==null&&!cf();)Du(Ce)}function Du(e){var t=Mu(e.alternate,e,et);e.memoizedProps=e.pendingProps,t===null?Lu(e):Ce=t,Ai.current=null}function Lu(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Dh(n,t),n!==null){n.flags&=32767,Ce=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Te=6,Ce=null;return}}else if(n=Th(n,t,et),n!==null){Ce=n;return}if(t=t.sibling,t!==null){Ce=t;return}Ce=t=e}while(t!==null);Te===0&&(Te=5)}function on(e,t,n){var a=fe,l=dt.transition;try{dt.transition=null,fe=1,Uh(e,t,n,a)}finally{dt.transition=l,fe=a}return null}function Uh(e,t,n,a){do Fn();while(qt!==null);if(oe&6)throw Error(A(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(A(177));e.callbackNode=null,e.callbackPriority=0;var s=n.lanes|n.childLanes;if(bf(e,s),e===Ie&&(Ce=Ie=null,Oe=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ba||(ba=!0,Ru(Ua,function(){return Fn(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=dt.transition,dt.transition=null;var i=fe;fe=1;var o=oe;oe|=4,Ai.current=null,Ih(e,n),Cu(n,e),sh(zs),$a=!!Cs,zs=Cs=null,e.current=n,Mh(n),uf(),oe=o,fe=i,dt.transition=s}else e.current=n;if(ba&&(ba=!1,qt=e,al=l),s=e.pendingLanes,s===0&&(Jt=null),hf(n.stateNode),Ze(e,_e()),t!==null)for(a=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],a(l.value,{componentStack:l.stack,digest:l.digest});if(rl)throw rl=!1,e=Ys,Ys=null,e;return al&1&&e.tag!==0&&Fn(),s=e.pendingLanes,s&1?e===Gs?Cr++:(Cr=0,Gs=e):Cr=0,an(),null}function Fn(){if(qt!==null){var e=fc(al),t=dt.transition,n=fe;try{if(dt.transition=null,fe=16>e?16:e,qt===null)var a=!1;else{if(e=qt,qt=null,al=0,oe&6)throw Error(A(331));var l=oe;for(oe|=4,q=e.current;q!==null;){var s=q,i=s.child;if(q.flags&16){var o=s.deletions;if(o!==null){for(var d=0;d<o.length;d++){var p=o[d];for(q=p;q!==null;){var f=q;switch(f.tag){case 0:case 11:case 15:_r(8,f,s)}var h=f.child;if(h!==null)h.return=f,q=h;else for(;q!==null;){f=q;var x=f.sibling,k=f.return;if(Su(f),f===p){q=null;break}if(x!==null){x.return=k,q=x;break}q=k}}}var j=s.alternate;if(j!==null){var w=j.child;if(w!==null){j.child=null;do{var _=w.sibling;w.sibling=null,w=_}while(w!==null)}}q=s}}if(s.subtreeFlags&2064&&i!==null)i.return=s,q=i;else e:for(;q!==null;){if(s=q,s.flags&2048)switch(s.tag){case 0:case 11:case 15:_r(9,s,s.return)}var g=s.sibling;if(g!==null){g.return=s.return,q=g;break e}q=s.return}}var u=e.current;for(q=u;q!==null;){i=q;var c=i.child;if(i.subtreeFlags&2064&&c!==null)c.return=i,q=c;else e:for(i=u;q!==null;){if(o=q,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:bl(9,o)}}catch(N){ke(o,o.return,N)}if(o===i){q=null;break e}var v=o.sibling;if(v!==null){v.return=o.return,q=v;break e}q=o.return}}if(oe=l,an(),kt&&typeof kt.onPostCommitFiberRoot=="function")try{kt.onPostCommitFiberRoot(pl,e)}catch{}a=!0}return a}finally{fe=n,dt.transition=t}}return!1}function pd(e,t,n){t=Yn(n,t),t=fu(e,t,1),e=Kt(e,t,1),t=He(),e!==null&&(Kr(e,1,t),Ze(e,t))}function ke(e,t,n){if(e.tag===3)pd(e,e,n);else for(;t!==null;){if(t.tag===3){pd(t,e,n);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(Jt===null||!Jt.has(a))){e=Yn(n,e),e=hu(t,e,1),t=Kt(t,e,1),e=He(),t!==null&&(Kr(t,1,e),Ze(t,e));break}}t=t.return}}function Fh(e,t,n){var a=e.pingCache;a!==null&&a.delete(t),t=He(),e.pingedLanes|=e.suspendedLanes&n,Ie===e&&(Oe&n)===n&&(Te===4||Te===3&&(Oe&130023424)===Oe&&500>_e()-Fi?pn(e,0):Ui|=n),Ze(e,t)}function Iu(e,t){t===0&&(e.mode&1?(t=ca,ca<<=1,!(ca&130023424)&&(ca=4194304)):t=1);var n=He();e=Lt(e,t),e!==null&&(Kr(e,t,n),Ze(e,n))}function $h(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Iu(e,n)}function Wh(e,t){var n=0;switch(e.tag){case 13:var a=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:a=e.stateNode;break;default:throw Error(A(314))}a!==null&&a.delete(t),Iu(e,n)}var Mu;Mu=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Je.current)Ke=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return Ke=!1,Ph(e,t,n);Ke=!!(e.flags&131072)}else Ke=!1,ve&&t.flags&1048576&&Ac(t,Ga,t.index);switch(t.lanes=0,t.tag){case 2:var a=t.type;Ta(e,t),e=t.pendingProps;var l=qn(t,$e.current);Un(t,n),l=Ii(null,t,a,e,l,n);var s=Mi();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Xe(a)?(s=!0,Qa(t)):s=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,Ei(t),l.updater=yl,t.stateNode=l,l._reactInternals=t,Os(t,a,e,n),t=Us(null,t,a,!0,s,n)):(t.tag=0,ve&&s&&wi(t),Ve(null,t,l,n),t=t.child),t;case 16:a=t.elementType;e:{switch(Ta(e,t),e=t.pendingProps,l=a._init,a=l(a._payload),t.type=a,l=t.tag=Vh(a),e=ht(a,e),l){case 0:t=As(null,t,a,e,n);break e;case 1:t=nd(null,t,a,e,n);break e;case 11:t=ed(null,t,a,e,n);break e;case 14:t=td(null,t,a,ht(a.type,e),n);break e}throw Error(A(306,a,""))}return t;case 0:return a=t.type,l=t.pendingProps,l=t.elementType===a?l:ht(a,l),As(e,t,a,l,n);case 1:return a=t.type,l=t.pendingProps,l=t.elementType===a?l:ht(a,l),nd(e,t,a,l,n);case 3:e:{if(vu(t),e===null)throw Error(A(387));a=t.pendingProps,s=t.memoizedState,l=s.element,Vc(e,t),Xa(t,a,null,n);var i=t.memoizedState;if(a=i.element,s.isDehydrated)if(s={element:a,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){l=Yn(Error(A(423)),t),t=rd(e,t,a,n,l);break e}else if(a!==l){l=Yn(Error(A(424)),t),t=rd(e,t,a,n,l);break e}else for(tt=Gt(t.stateNode.containerInfo.firstChild),nt=t,ve=!0,gt=null,n=Wc(t,null,a,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Vn(),a===l){t=It(e,t,n);break e}Ve(e,t,a,n)}t=t.child}return t;case 5:return Hc(t),e===null&&Is(t),a=t.type,l=t.pendingProps,s=e!==null?e.memoizedProps:null,i=l.children,Es(a,l)?i=null:s!==null&&Es(a,s)&&(t.flags|=32),xu(e,t),Ve(e,t,i,n),t.child;case 6:return e===null&&Is(t),null;case 13:return yu(e,t,n);case 4:return Pi(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=Hn(t,null,a,n):Ve(e,t,a,n),t.child;case 11:return a=t.type,l=t.pendingProps,l=t.elementType===a?l:ht(a,l),ed(e,t,a,l,n);case 7:return Ve(e,t,t.pendingProps,n),t.child;case 8:return Ve(e,t,t.pendingProps.children,n),t.child;case 12:return Ve(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(a=t.type._context,l=t.pendingProps,s=t.memoizedProps,i=l.value,he(Ka,a._currentValue),a._currentValue=i,s!==null)if(yt(s.value,i)){if(s.children===l.children&&!Je.current){t=It(e,t,n);break e}}else for(s=t.child,s!==null&&(s.return=t);s!==null;){var o=s.dependencies;if(o!==null){i=s.child;for(var d=o.firstContext;d!==null;){if(d.context===a){if(s.tag===1){d=Pt(-1,n&-n),d.tag=2;var p=s.updateQueue;if(p!==null){p=p.shared;var f=p.pending;f===null?d.next=d:(d.next=f.next,f.next=d),p.pending=d}}s.lanes|=n,d=s.alternate,d!==null&&(d.lanes|=n),Ms(s.return,n,t),o.lanes|=n;break}d=d.next}}else if(s.tag===10)i=s.type===t.type?null:s.child;else if(s.tag===18){if(i=s.return,i===null)throw Error(A(341));i.lanes|=n,o=i.alternate,o!==null&&(o.lanes|=n),Ms(i,n,t),i=s.sibling}else i=s.child;if(i!==null)i.return=s;else for(i=s;i!==null;){if(i===t){i=null;break}if(s=i.sibling,s!==null){s.return=i.return,i=s;break}i=i.return}s=i}Ve(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,a=t.pendingProps.children,Un(t,n),l=ct(l),a=a(l),t.flags|=1,Ve(e,t,a,n),t.child;case 14:return a=t.type,l=ht(a,t.pendingProps),l=ht(a.type,l),td(e,t,a,l,n);case 15:return mu(e,t,t.type,t.pendingProps,n);case 17:return a=t.type,l=t.pendingProps,l=t.elementType===a?l:ht(a,l),Ta(e,t),t.tag=1,Xe(a)?(e=!0,Qa(t)):e=!1,Un(t,n),pu(t,a,l),Os(t,a,l,n),Us(null,t,a,!0,e,n);case 19:return bu(e,t,n);case 22:return gu(e,t,n)}throw Error(A(156,t.tag))};function Ru(e,t){return dc(e,t)}function qh(e,t,n,a){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ot(e,t,n,a){return new qh(e,t,n,a)}function Vi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Vh(e){if(typeof e=="function")return Vi(e)?1:0;if(e!=null){if(e=e.$$typeof,e===ci)return 11;if(e===ui)return 14}return 2}function Zt(e,t){var n=e.alternate;return n===null?(n=ot(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Ia(e,t,n,a,l,s){var i=2;if(a=e,typeof e=="function")Vi(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case _n:return fn(n.children,l,s,t);case di:i=8,l|=8;break;case is:return e=ot(12,n,t,l|2),e.elementType=is,e.lanes=s,e;case os:return e=ot(13,n,t,l),e.elementType=os,e.lanes=s,e;case ds:return e=ot(19,n,t,l),e.elementType=ds,e.lanes=s,e;case Hd:return wl(n,l,s,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case qd:i=10;break e;case Vd:i=9;break e;case ci:i=11;break e;case ui:i=14;break e;case At:i=16,a=null;break e}throw Error(A(130,e==null?e:typeof e,""))}return t=ot(i,n,t,l),t.elementType=e,t.type=a,t.lanes=s,t}function fn(e,t,n,a){return e=ot(7,e,a,t),e.lanes=n,e}function wl(e,t,n,a){return e=ot(22,e,a,t),e.elementType=Hd,e.lanes=n,e.stateNode={isHidden:!1},e}function ts(e,t,n){return e=ot(6,e,null,t),e.lanes=n,e}function ns(e,t,n){return t=ot(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Hh(e,t,n,a,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Rl(0),this.expirationTimes=Rl(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Rl(0),this.identifierPrefix=a,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function Hi(e,t,n,a,l,s,i,o,d){return e=new Hh(e,t,n,o,d),t===1?(t=1,s===!0&&(t|=8)):t=0,s=ot(3,null,null,t),e.current=s,s.stateNode=e,s.memoizedState={element:a,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ei(s),e}function Qh(e,t,n){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Sn,key:a==null?null:""+a,children:e,containerInfo:t,implementation:n}}function Ou(e){if(!e)return tn;e=e._reactInternals;e:{if(jn(e)!==e||e.tag!==1)throw Error(A(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Xe(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(A(171))}if(e.tag===1){var n=e.type;if(Xe(n))return Oc(e,n,t)}return t}function Bu(e,t,n,a,l,s,i,o,d){return e=Hi(n,a,!0,e,l,s,i,o,d),e.context=Ou(null),n=e.current,a=He(),l=Xt(n),s=Pt(a,l),s.callback=t??null,Kt(n,s,l),e.current.lanes=l,Kr(e,l,a),Ze(e,a),e}function kl(e,t,n,a){var l=t.current,s=He(),i=Xt(l);return n=Ou(n),t.context===null?t.context=n:t.pendingContext=n,t=Pt(s,i),t.payload={element:e},a=a===void 0?null:a,a!==null&&(t.callback=a),e=Kt(l,t,i),e!==null&&(vt(e,l,i,s),za(e,l,i)),i}function sl(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function fd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Qi(e,t){fd(e,t),(e=e.alternate)&&fd(e,t)}function Yh(){return null}var Au=typeof reportError=="function"?reportError:function(e){console.error(e)};function Yi(e){this._internalRoot=e}Sl.prototype.render=Yi.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(A(409));kl(e,t,null,null)};Sl.prototype.unmount=Yi.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;yn(function(){kl(null,e,null,null)}),t[Dt]=null}};function Sl(e){this._internalRoot=e}Sl.prototype.unstable_scheduleHydration=function(e){if(e){var t=gc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ft.length&&t!==0&&t<Ft[n].priority;n++);Ft.splice(n,0,e),n===0&&vc(e)}};function Gi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function _l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function hd(){}function Gh(e,t,n,a,l){if(l){if(typeof a=="function"){var s=a;a=function(){var p=sl(i);s.call(p)}}var i=Bu(t,a,e,0,null,!1,!1,"",hd);return e._reactRootContainer=i,e[Dt]=i.current,Or(e.nodeType===8?e.parentNode:e),yn(),i}for(;l=e.lastChild;)e.removeChild(l);if(typeof a=="function"){var o=a;a=function(){var p=sl(d);o.call(p)}}var d=Hi(e,0,!1,null,null,!1,!1,"",hd);return e._reactRootContainer=d,e[Dt]=d.current,Or(e.nodeType===8?e.parentNode:e),yn(function(){kl(t,d,n,a)}),d}function Nl(e,t,n,a,l){var s=n._reactRootContainer;if(s){var i=s;if(typeof l=="function"){var o=l;l=function(){var d=sl(i);o.call(d)}}kl(t,i,e,l)}else i=Gh(n,t,e,l,a);return sl(i)}hc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=pr(t.pendingLanes);n!==0&&(hi(t,n|1),Ze(t,_e()),!(oe&6)&&(Gn=_e()+500,an()))}break;case 13:yn(function(){var a=Lt(e,1);if(a!==null){var l=He();vt(a,e,1,l)}}),Qi(e,1)}};mi=function(e){if(e.tag===13){var t=Lt(e,134217728);if(t!==null){var n=He();vt(t,e,134217728,n)}Qi(e,134217728)}};mc=function(e){if(e.tag===13){var t=Xt(e),n=Lt(e,t);if(n!==null){var a=He();vt(n,e,t,a)}Qi(e,t)}};gc=function(){return fe};xc=function(e,t){var n=fe;try{return fe=e,t()}finally{fe=n}};ys=function(e,t,n){switch(t){case"input":if(ps(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var a=n[t];if(a!==e&&a.form===e.form){var l=gl(a);if(!l)throw Error(A(90));Yd(a),ps(a,l)}}}break;case"textarea":Kd(e,n);break;case"select":t=n.value,t!=null&&Rn(e,!!n.multiple,t,!1)}};rc=$i;ac=yn;var Kh={usingClientEntryPoint:!1,Events:[Xr,En,gl,tc,nc,$i]},dr={findFiberByHostInstance:dn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Jh={bundleType:dr.bundleType,version:dr.version,rendererPackageName:dr.rendererPackageName,rendererConfig:dr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Rt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=ic(e),e===null?null:e.stateNode},findFiberByHostInstance:dr.findFiberByHostInstance||Yh,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ja=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ja.isDisabled&&ja.supportsFiber)try{pl=ja.inject(Jh),kt=ja}catch{}}at.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Kh;at.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Gi(t))throw Error(A(200));return Qh(e,t,null,n)};at.createRoot=function(e,t){if(!Gi(e))throw Error(A(299));var n=!1,a="",l=Au;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=Hi(e,1,!1,null,null,n,!1,a,l),e[Dt]=t.current,Or(e.nodeType===8?e.parentNode:e),new Yi(t)};at.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(A(188)):(e=Object.keys(e).join(","),Error(A(268,e)));return e=ic(t),e=e===null?null:e.stateNode,e};at.flushSync=function(e){return yn(e)};at.hydrate=function(e,t,n){if(!_l(t))throw Error(A(200));return Nl(null,e,t,!0,n)};at.hydrateRoot=function(e,t,n){if(!Gi(e))throw Error(A(405));var a=n!=null&&n.hydratedSources||null,l=!1,s="",i=Au;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=Bu(t,null,e,1,n??null,l,!1,s,i),e[Dt]=t.current,Or(e),a)for(e=0;e<a.length;e++)n=a[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Sl(t)};at.render=function(e,t,n){if(!_l(t))throw Error(A(200));return Nl(null,e,t,!1,n)};at.unmountComponentAtNode=function(e){if(!_l(e))throw Error(A(40));return e._reactRootContainer?(yn(function(){Nl(null,null,e,!1,function(){e._reactRootContainer=null,e[Dt]=null})}),!0):!1};at.unstable_batchedUpdates=$i;at.unstable_renderSubtreeIntoContainer=function(e,t,n,a){if(!_l(n))throw Error(A(200));if(e==null||e._reactInternals===void 0)throw Error(A(38));return Nl(e,t,n,!1,a)};at.version="18.3.1-next-f1338f8080-20240426";function Uu(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Uu)}catch(e){console.error(e)}}Uu(),Ud.exports=at;var Xh=Ud.exports,md=Xh;ls.createRoot=md.createRoot,ls.hydrateRoot=md.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Hr(){return Hr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},Hr.apply(this,arguments)}var Vt;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(Vt||(Vt={}));const gd="popstate";function Zh(e){e===void 0&&(e={});function t(a,l){let{pathname:s,search:i,hash:o}=a.location;return Xs("",{pathname:s,search:i,hash:o},l.state&&l.state.usr||null,l.state&&l.state.key||"default")}function n(a,l){return typeof l=="string"?l:Fu(l)}return tm(t,n,null,e)}function ze(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function Ki(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function em(){return Math.random().toString(36).substr(2,8)}function xd(e,t){return{usr:e.state,key:e.key,idx:t}}function Xs(e,t,n,a){return n===void 0&&(n=null),Hr({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?Zn(t):t,{state:n,key:t&&t.key||a||em()})}function Fu(e){let{pathname:t="/",search:n="",hash:a=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),a&&a!=="#"&&(t+=a.charAt(0)==="#"?a:"#"+a),t}function Zn(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let a=e.indexOf("?");a>=0&&(t.search=e.substr(a),e=e.substr(0,a)),e&&(t.pathname=e)}return t}function tm(e,t,n,a){a===void 0&&(a={});let{window:l=document.defaultView,v5Compat:s=!1}=a,i=l.history,o=Vt.Pop,d=null,p=f();p==null&&(p=0,i.replaceState(Hr({},i.state,{idx:p}),""));function f(){return(i.state||{idx:null}).idx}function h(){o=Vt.Pop;let _=f(),g=_==null?null:_-p;p=_,d&&d({action:o,location:w.location,delta:g})}function x(_,g){o=Vt.Push;let u=Xs(w.location,_,g);p=f()+1;let c=xd(u,p),v=w.createHref(u);try{i.pushState(c,"",v)}catch(N){if(N instanceof DOMException&&N.name==="DataCloneError")throw N;l.location.assign(v)}s&&d&&d({action:o,location:w.location,delta:1})}function k(_,g){o=Vt.Replace;let u=Xs(w.location,_,g);p=f();let c=xd(u,p),v=w.createHref(u);i.replaceState(c,"",v),s&&d&&d({action:o,location:w.location,delta:0})}function j(_){let g=l.location.origin!=="null"?l.location.origin:l.location.href,u=typeof _=="string"?_:Fu(_);return u=u.replace(/ $/,"%20"),ze(g,"No window.location.(origin|href) available to create URL for href: "+u),new URL(u,g)}let w={get action(){return o},get location(){return e(l,i)},listen(_){if(d)throw new Error("A history only accepts one active listener");return l.addEventListener(gd,h),d=_,()=>{l.removeEventListener(gd,h),d=null}},createHref(_){return t(l,_)},createURL:j,encodeLocation(_){let g=j(_);return{pathname:g.pathname,search:g.search,hash:g.hash}},push:x,replace:k,go(_){return i.go(_)}};return w}var vd;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(vd||(vd={}));function nm(e,t,n){return n===void 0&&(n="/"),rm(e,t,n)}function rm(e,t,n,a){let l=typeof t=="string"?Zn(t):t,s=qu(l.pathname||"/",n);if(s==null)return null;let i=$u(e);am(i);let o=null;for(let d=0;o==null&&d<i.length;++d){let p=gm(s);o=fm(i[d],p)}return o}function $u(e,t,n,a){t===void 0&&(t=[]),n===void 0&&(n=[]),a===void 0&&(a="");let l=(s,i,o)=>{let d={relativePath:o===void 0?s.path||"":o,caseSensitive:s.caseSensitive===!0,childrenIndex:i,route:s};d.relativePath.startsWith("/")&&(ze(d.relativePath.startsWith(a),'Absolute route path "'+d.relativePath+'" nested under path '+('"'+a+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),d.relativePath=d.relativePath.slice(a.length));let p=hn([a,d.relativePath]),f=n.concat(d);s.children&&s.children.length>0&&(ze(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+p+'".')),$u(s.children,t,f,p)),!(s.path==null&&!s.index)&&t.push({path:p,score:um(p,s.index),routesMeta:f})};return e.forEach((s,i)=>{var o;if(s.path===""||!((o=s.path)!=null&&o.includes("?")))l(s,i);else for(let d of Wu(s.path))l(s,i,d)}),t}function Wu(e){let t=e.split("/");if(t.length===0)return[];let[n,...a]=t,l=n.endsWith("?"),s=n.replace(/\?$/,"");if(a.length===0)return l?[s,""]:[s];let i=Wu(a.join("/")),o=[];return o.push(...i.map(d=>d===""?s:[s,d].join("/"))),l&&o.push(...i),o.map(d=>e.startsWith("/")&&d===""?"/":d)}function am(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:pm(t.routesMeta.map(a=>a.childrenIndex),n.routesMeta.map(a=>a.childrenIndex)))}const lm=/^:[\w-]+$/,sm=3,im=2,om=1,dm=10,cm=-2,yd=e=>e==="*";function um(e,t){let n=e.split("/"),a=n.length;return n.some(yd)&&(a+=cm),t&&(a+=im),n.filter(l=>!yd(l)).reduce((l,s)=>l+(lm.test(s)?sm:s===""?om:dm),a)}function pm(e,t){return e.length===t.length&&e.slice(0,-1).every((a,l)=>a===t[l])?e[e.length-1]-t[t.length-1]:0}function fm(e,t,n){let{routesMeta:a}=e,l={},s="/",i=[];for(let o=0;o<a.length;++o){let d=a[o],p=o===a.length-1,f=s==="/"?t:t.slice(s.length)||"/",h=hm({path:d.relativePath,caseSensitive:d.caseSensitive,end:p},f),x=d.route;if(!h)return null;Object.assign(l,h.params),i.push({params:l,pathname:hn([s,h.pathname]),pathnameBase:jm(hn([s,h.pathnameBase])),route:x}),h.pathnameBase!=="/"&&(s=hn([s,h.pathnameBase]))}return i}function hm(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,a]=mm(e.path,e.caseSensitive,e.end),l=t.match(n);if(!l)return null;let s=l[0],i=s.replace(/(.)\/+$/,"$1"),o=l.slice(1);return{params:a.reduce((p,f,h)=>{let{paramName:x,isOptional:k}=f;if(x==="*"){let w=o[h]||"";i=s.slice(0,s.length-w.length).replace(/(.)\/+$/,"$1")}const j=o[h];return k&&!j?p[x]=void 0:p[x]=(j||"").replace(/%2F/g,"/"),p},{}),pathname:s,pathnameBase:i,pattern:e}}function mm(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),Ki(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let a=[],l="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(i,o,d)=>(a.push({paramName:o,isOptional:d!=null}),d?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(a.push({paramName:"*"}),l+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?l+="\\/*$":e!==""&&e!=="/"&&(l+="(?:(?=\\/|$))"),[new RegExp(l,t?void 0:"i"),a]}function gm(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return Ki(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function qu(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,a=e.charAt(n);return a&&a!=="/"?null:e.slice(n)||"/"}const xm=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,vm=e=>xm.test(e);function ym(e,t){t===void 0&&(t="/");let{pathname:n,search:a="",hash:l=""}=typeof e=="string"?Zn(e):e,s;if(n)if(vm(n))s=n;else{if(n.includes("//")){let i=n;n=n.replace(/\/\/+/g,"/"),Ki(!1,"Pathnames cannot have embedded double slashes - normalizing "+(i+" -> "+n))}n.startsWith("/")?s=bd(n.substring(1),"/"):s=bd(n,t)}else s=t;return{pathname:s,search:wm(a),hash:km(l)}}function bd(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(l=>{l===".."?n.length>1&&n.pop():l!=="."&&n.push(l)}),n.length>1?n.join("/"):"/"}function rs(e,t,n,a){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(a)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function bm(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function Vu(e,t){let n=bm(e);return t?n.map((a,l)=>l===n.length-1?a.pathname:a.pathnameBase):n.map(a=>a.pathnameBase)}function Hu(e,t,n,a){a===void 0&&(a=!1);let l;typeof e=="string"?l=Zn(e):(l=Hr({},e),ze(!l.pathname||!l.pathname.includes("?"),rs("?","pathname","search",l)),ze(!l.pathname||!l.pathname.includes("#"),rs("#","pathname","hash",l)),ze(!l.search||!l.search.includes("#"),rs("#","search","hash",l)));let s=e===""||l.pathname==="",i=s?"/":l.pathname,o;if(i==null)o=n;else{let h=t.length-1;if(!a&&i.startsWith("..")){let x=i.split("/");for(;x[0]==="..";)x.shift(),h-=1;l.pathname=x.join("/")}o=h>=0?t[h]:"/"}let d=ym(l,o),p=i&&i!=="/"&&i.endsWith("/"),f=(s||i===".")&&n.endsWith("/");return!d.pathname.endsWith("/")&&(p||f)&&(d.pathname+="/"),d}const hn=e=>e.join("/").replace(/\/\/+/g,"/"),jm=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),wm=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,km=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Sm(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const Qu=["post","put","patch","delete"];new Set(Qu);const _m=["get",...Qu];new Set(_m);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Qr(){return Qr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},Qr.apply(this,arguments)}const Ji=m.createContext(null),Nm=m.createContext(null),ea=m.createContext(null),Cl=m.createContext(null),wn=m.createContext({outlet:null,matches:[],isDataRoute:!1}),Yu=m.createContext(null);function ta(){return m.useContext(Cl)!=null}function Xi(){return ta()||ze(!1),m.useContext(Cl).location}function Gu(e){m.useContext(ea).static||m.useLayoutEffect(e)}function Zi(){let{isDataRoute:e}=m.useContext(wn);return e?Am():Cm()}function Cm(){ta()||ze(!1);let e=m.useContext(Ji),{basename:t,future:n,navigator:a}=m.useContext(ea),{matches:l}=m.useContext(wn),{pathname:s}=Xi(),i=JSON.stringify(Vu(l,n.v7_relativeSplatPath)),o=m.useRef(!1);return Gu(()=>{o.current=!0}),m.useCallback(function(p,f){if(f===void 0&&(f={}),!o.current)return;if(typeof p=="number"){a.go(p);return}let h=Hu(p,JSON.parse(i),s,f.relative==="path");e==null&&t!=="/"&&(h.pathname=h.pathname==="/"?t:hn([t,h.pathname])),(f.replace?a.replace:a.push)(h,f.state,f)},[t,a,i,s,e])}function zm(e,t){return Em(e,t)}function Em(e,t,n,a){ta()||ze(!1);let{navigator:l}=m.useContext(ea),{matches:s}=m.useContext(wn),i=s[s.length-1],o=i?i.params:{};i&&i.pathname;let d=i?i.pathnameBase:"/";i&&i.route;let p=Xi(),f;if(t){var h;let _=typeof t=="string"?Zn(t):t;d==="/"||(h=_.pathname)!=null&&h.startsWith(d)||ze(!1),f=_}else f=p;let x=f.pathname||"/",k=x;if(d!=="/"){let _=d.replace(/^\//,"").split("/");k="/"+x.replace(/^\//,"").split("/").slice(_.length).join("/")}let j=nm(e,{pathname:k}),w=Im(j&&j.map(_=>Object.assign({},_,{params:Object.assign({},o,_.params),pathname:hn([d,l.encodeLocation?l.encodeLocation(_.pathname).pathname:_.pathname]),pathnameBase:_.pathnameBase==="/"?d:hn([d,l.encodeLocation?l.encodeLocation(_.pathnameBase).pathname:_.pathnameBase])})),s,n,a);return t&&w?m.createElement(Cl.Provider,{value:{location:Qr({pathname:"/",search:"",hash:"",state:null,key:"default"},f),navigationType:Vt.Pop}},w):w}function Pm(){let e=Bm(),t=Sm(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,l={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return m.createElement(m.Fragment,null,m.createElement("h2",null,"Unexpected Application Error!"),m.createElement("h3",{style:{fontStyle:"italic"}},t),n?m.createElement("pre",{style:l},n):null,null)}const Tm=m.createElement(Pm,null);class Dm extends m.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?m.createElement(wn.Provider,{value:this.props.routeContext},m.createElement(Yu.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Lm(e){let{routeContext:t,match:n,children:a}=e,l=m.useContext(Ji);return l&&l.static&&l.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(l.staticContext._deepestRenderedBoundaryId=n.route.id),m.createElement(wn.Provider,{value:t},a)}function Im(e,t,n,a){var l;if(t===void 0&&(t=[]),n===void 0&&(n=null),a===void 0&&(a=null),e==null){var s;if(!n)return null;if(n.errors)e=n.matches;else if((s=a)!=null&&s.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let i=e,o=(l=n)==null?void 0:l.errors;if(o!=null){let f=i.findIndex(h=>h.route.id&&(o==null?void 0:o[h.route.id])!==void 0);f>=0||ze(!1),i=i.slice(0,Math.min(i.length,f+1))}let d=!1,p=-1;if(n&&a&&a.v7_partialHydration)for(let f=0;f<i.length;f++){let h=i[f];if((h.route.HydrateFallback||h.route.hydrateFallbackElement)&&(p=f),h.route.id){let{loaderData:x,errors:k}=n,j=h.route.loader&&x[h.route.id]===void 0&&(!k||k[h.route.id]===void 0);if(h.route.lazy||j){d=!0,p>=0?i=i.slice(0,p+1):i=[i[0]];break}}}return i.reduceRight((f,h,x)=>{let k,j=!1,w=null,_=null;n&&(k=o&&h.route.id?o[h.route.id]:void 0,w=h.route.errorElement||Tm,d&&(p<0&&x===0?(Um("route-fallback"),j=!0,_=null):p===x&&(j=!0,_=h.route.hydrateFallbackElement||null)));let g=t.concat(i.slice(0,x+1)),u=()=>{let c;return k?c=w:j?c=_:h.route.Component?c=m.createElement(h.route.Component,null):h.route.element?c=h.route.element:c=f,m.createElement(Lm,{match:h,routeContext:{outlet:f,matches:g,isDataRoute:n!=null},children:c})};return n&&(h.route.ErrorBoundary||h.route.errorElement||x===0)?m.createElement(Dm,{location:n.location,revalidation:n.revalidation,component:w,error:k,children:u(),routeContext:{outlet:null,matches:g,isDataRoute:!0}}):u()},null)}var Ku=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(Ku||{}),Ju=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(Ju||{});function Mm(e){let t=m.useContext(Ji);return t||ze(!1),t}function Rm(e){let t=m.useContext(Nm);return t||ze(!1),t}function Om(e){let t=m.useContext(wn);return t||ze(!1),t}function Xu(e){let t=Om(),n=t.matches[t.matches.length-1];return n.route.id||ze(!1),n.route.id}function Bm(){var e;let t=m.useContext(Yu),n=Rm(),a=Xu();return t!==void 0?t:(e=n.errors)==null?void 0:e[a]}function Am(){let{router:e}=Mm(Ku.UseNavigateStable),t=Xu(Ju.UseNavigateStable),n=m.useRef(!1);return Gu(()=>{n.current=!0}),m.useCallback(function(l,s){s===void 0&&(s={}),n.current&&(typeof l=="number"?e.navigate(l):e.navigate(l,Qr({fromRouteId:t},s)))},[e,t])}const jd={};function Um(e,t,n){jd[e]||(jd[e]=!0)}function Fm(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function Zu(e){let{to:t,replace:n,state:a,relative:l}=e;ta()||ze(!1);let{future:s,static:i}=m.useContext(ea),{matches:o}=m.useContext(wn),{pathname:d}=Xi(),p=Zi(),f=Hu(t,Vu(o,s.v7_relativeSplatPath),d,l==="path"),h=JSON.stringify(f);return m.useEffect(()=>p(JSON.parse(h),{replace:n,state:a,relative:l}),[p,h,l,n,a]),null}function Ma(e){ze(!1)}function $m(e){let{basename:t="/",children:n=null,location:a,navigationType:l=Vt.Pop,navigator:s,static:i=!1,future:o}=e;ta()&&ze(!1);let d=t.replace(/^\/*/,"/"),p=m.useMemo(()=>({basename:d,navigator:s,static:i,future:Qr({v7_relativeSplatPath:!1},o)}),[d,o,s,i]);typeof a=="string"&&(a=Zn(a));let{pathname:f="/",search:h="",hash:x="",state:k=null,key:j="default"}=a,w=m.useMemo(()=>{let _=qu(f,d);return _==null?null:{location:{pathname:_,search:h,hash:x,state:k,key:j},navigationType:l}},[d,f,h,x,k,j,l]);return w==null?null:m.createElement(ea.Provider,{value:p},m.createElement(Cl.Provider,{children:n,value:w}))}function Wm(e){let{children:t,location:n}=e;return zm(Zs(t),n)}new Promise(()=>{});function Zs(e,t){t===void 0&&(t=[]);let n=[];return m.Children.forEach(e,(a,l)=>{if(!m.isValidElement(a))return;let s=[...t,l];if(a.type===m.Fragment){n.push.apply(n,Zs(a.props.children,s));return}a.type!==Ma&&ze(!1),!a.props.index||!a.props.children||ze(!1);let i={id:a.props.id||s.join("-"),caseSensitive:a.props.caseSensitive,element:a.props.element,Component:a.props.Component,index:a.props.index,path:a.props.path,loader:a.props.loader,action:a.props.action,errorElement:a.props.errorElement,ErrorBoundary:a.props.ErrorBoundary,hasErrorBoundary:a.props.ErrorBoundary!=null||a.props.errorElement!=null,shouldRevalidate:a.props.shouldRevalidate,handle:a.props.handle,lazy:a.props.lazy};a.props.children&&(i.children=Zs(a.props.children,s)),n.push(i)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const qm="6";try{window.__reactRouterVersion=qm}catch{}const Vm="startTransition",wd=Up[Vm];function Hm(e){let{basename:t,children:n,future:a,window:l}=e,s=m.useRef();s.current==null&&(s.current=Zh({window:l,v5Compat:!0}));let i=s.current,[o,d]=m.useState({action:i.action,location:i.location}),{v7_startTransition:p}=a||{},f=m.useCallback(h=>{p&&wd?wd(()=>d(h)):d(h)},[d,p]);return m.useLayoutEffect(()=>i.listen(f),[i,f]),m.useEffect(()=>Fm(a),[a]),m.createElement($m,{basename:t,children:n,location:o.location,navigationType:o.action,navigator:i,future:a})}var kd;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(kd||(kd={}));var Sd;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(Sd||(Sd={}));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qm=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ep=(...e)=>e.filter((t,n,a)=>!!t&&a.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Ym={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gm=m.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:l="",children:s,iconNode:i,...o},d)=>m.createElement("svg",{ref:d,...Ym,width:t,height:t,stroke:e,strokeWidth:a?Number(n)*24/Number(t):n,className:ep("lucide",l),...o},[...i.map(([p,f])=>m.createElement(p,f)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=(e,t)=>{const n=m.forwardRef(({className:a,...l},s)=>m.createElement(Gm,{ref:s,iconNode:t,className:ep(`lucide-${Qm(e)}`,a),...l}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tp=X("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const il=X("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Km=X("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zr=X("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jm=X("ChevronsLeft",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xm=X("ChevronsRight",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ol=X("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const as=X("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ei=X("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zm=X("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eg=X("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const np=X("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rp=X("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hr=X("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mr=X("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tg=X("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ap=X("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ng=X("GripVertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rg=X("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ag=X("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lg=X("ListTodo",[["rect",{x:"3",y:"5",width:"6",height:"6",rx:"1",key:"1defrl"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gr=X("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xr=X("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sg=X("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ig=X("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lp=X("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const og=X("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dg=X("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cg=X("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ug=X("Pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $n=X("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _d=X("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pg=X("ScrollText",[["path",{d:"M15 12h-5",key:"r7krc0"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zl=X("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ti=X("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fg=X("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hg=X("SlidersVertical",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mg=X("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gg=X("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xg=X("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vg=X("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yg=X("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eo=X("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sp=X("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yr=X("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function bg({onLogout:e}){var D;const[t,n]=m.useState(()=>new Date().toLocaleTimeString("en-IN")),[a,l]=m.useState([]),[s,i]=m.useState(""),[o,d]=m.useState(""),[p,f]=m.useState(!1),h=m.useRef(null),x=JSON.parse(localStorage.getItem("user")||"{}"),k=localStorage.getItem("token"),[j,w]=m.useState(()=>{const E=localStorage.getItem("erp_theme");return E?E==="dark":!0}),[_,g]=m.useState(()=>localStorage.getItem("erp_company_name")||"Vyom ERP"),[u,c]=m.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing");m.useEffect(()=>{const E=localStorage.getItem("erp_theme"),T=E?E==="dark":!0;document.documentElement.setAttribute("data-theme",T?"dark":"light"),w(T)},[]);const v=()=>{const E=!j;w(E),localStorage.setItem("erp_theme",E?"dark":"light"),document.documentElement.setAttribute("data-theme",E?"dark":"light")};m.useEffect(()=>{const E=setInterval(()=>{n(new Date().toLocaleTimeString("en-IN"))},1e3);N();const T=J=>{J.detail&&J.detail.orderId!==void 0?i(J.detail.orderId||""):J.detail&&J.detail.orderId===null&&i("")};window.addEventListener("setView",T);const H=()=>{N()};window.addEventListener("orderUpdated",H);const te=J=>{h.current&&!h.current.contains(J.target)&&f(!1)};document.addEventListener("mousedown",te);const K=()=>{g(localStorage.getItem("erp_company_name")||"Vyom ERP"),c(localStorage.getItem("erp_system_title")||"Control Panel Manufacturing")};return window.addEventListener("erpSettingsUpdated",K),()=>{clearInterval(E),window.removeEventListener("setView",T),window.removeEventListener("orderUpdated",H),document.removeEventListener("mousedown",te),window.removeEventListener("erpSettingsUpdated",K)}},[]),m.useEffect(()=>{if(s&&a.length>0){const E=a.find(T=>T.id==s);E&&d(E.order_number)}else s||d("")},[s,a]);const N=async()=>{if(k)try{const E=await fetch("http://localhost:5000/api/orders",{headers:{Authorization:`Bearer ${k}`}});if(E.ok){const T=await E.json();l(T)}}catch(E){console.error("Header fetch error:",E)}},P=(E,T)=>{i(E),d(T||""),f(!1),E?window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:parseInt(E)}})):window.dispatchEvent(new CustomEvent("setView",{detail:{view:"board",orderId:null}}))},z=a.filter(E=>(E.order_number||"").toLowerCase().includes(o.toLowerCase())||(E.company_name||"").toLowerCase().includes(o.toLowerCase()));return r.jsxs("div",{className:"header",children:[r.jsxs("div",{className:"header-left",children:[r.jsx("div",{className:"logo",children:_}),r.jsx("div",{className:"header-title",children:u})]}),r.jsxs("div",{className:"header-right",children:[r.jsxs("div",{className:"user-info",style:{display:"flex",alignItems:"center",gap:"8px",marginRight:"16px",color:"var(--text2)",fontSize:"12px"},children:[r.jsx(eo,{size:14}),r.jsx("span",{children:x.username||"User"}),r.jsx("span",{className:`role-badge role-${(D=x.role)==null?void 0:D.toLowerCase()}`,children:x.role||"Viewer"})]}),r.jsxs("div",{className:"order-selector",ref:h,children:[r.jsx(zl,{size:14,className:"search-icon"}),r.jsx("input",{type:"text",className:"order-search-input",placeholder:"Search Order...",value:o,onFocus:()=>f(!0),onChange:E=>{d(E.target.value),f(!0)}}),s&&r.jsx("button",{className:"clear-search",onClick:E=>{E.stopPropagation(),P("","")},title:"Clear Selection",children:"×"}),p&&r.jsxs("div",{className:"search-dropdown-menu",children:[r.jsx("div",{className:`search-dropdown-item ${s?"":"active"}`,onClick:()=>P("",""),children:"View All Orders (Board)"}),z.length>0?z.map(E=>r.jsxs("div",{className:`search-dropdown-item ${s==E.id?"active":""}`,onClick:()=>P(E.id,E.order_number),children:[r.jsx("div",{style:{fontWeight:600},children:E.order_number}),E.company_name&&r.jsx("div",{style:{fontSize:"10px",color:"#888"},children:E.company_name})]},E.id)):r.jsx("div",{className:"search-dropdown-item empty",children:"No orders found"})]})]}),r.jsx("div",{className:"clock",style:{marginRight:"16px"},children:t}),r.jsxs("button",{onClick:v,title:j?"Switch to Light Mode":"Switch to Dark Mode",style:{background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:"6px",color:"var(--text2)",cursor:"pointer",display:"flex",alignItems:"center",padding:"5px 10px",marginRight:"8px",transition:"all 0.2s",gap:"5px",fontSize:"12px"},onMouseEnter:E=>{E.currentTarget.style.color="var(--accent)",E.currentTarget.style.borderColor="var(--accent)"},onMouseLeave:E=>{E.currentTarget.style.color="var(--text2)",E.currentTarget.style.borderColor="var(--border2)"},children:[j?r.jsx(gg,{size:13}):r.jsx(cg,{size:13}),j?"Light":"Dark"]}),r.jsxs("button",{onClick:e,className:"logout-btn",children:[r.jsx(ig,{size:14}),"Logout"]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .order-selector {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 16px;
        }
        .order-search-input {
          background: var(--bg4);
          border: 1px solid var(--border2);
          border-radius: 20px;
          color: var(--text);
          padding: 6px 30px 6px 32px;
          font-size: 12px;
          width: 240px;
          outline: none;
          transition: all 0.2s;
        }
        .order-search-input:focus {
          background: var(--bg3);
          border-color: var(--blue);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text3);
          pointer-events: none;
        }
        .clear-search {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text3);
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          padding: 0;
        }
        .clear-search:hover { color: var(--text); }
        
        .search-dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 100%;
          max-height: 300px;
          overflow-y: auto;
          background: var(--bg2);
          border: 1px solid var(--border2);
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          z-index: 1000;
        }
        .search-dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 12px;
          color: var(--text2);
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .search-dropdown-item:last-child { border-bottom: none; }
        .search-dropdown-item:hover { background: var(--bg3); color: var(--text); }
        .search-dropdown-item.active { background: var(--blue-dim); color: var(--blue); }
        .search-dropdown-item.empty { color: var(--text3); text-align: center; font-style: italic; cursor: default; }
        .search-dropdown-item.empty:hover { background: transparent; }
      `}})]})}const Mt=[{id:"Sales",color:"var(--teal)",label:"Sales",sub:"Customer interface"},{id:"Design",color:"var(--purple)",label:"Design",sub:"Engineering"},{id:"Purchase",color:"var(--orange)",label:"Purchase",sub:"Procurement"},{id:"Stores",color:"var(--green)",label:"Stores",sub:"Stock & Issue"},{id:"Production",color:"var(--red)",label:"Production",sub:"Manufacturing"},{id:"QC",color:"var(--blue)",label:"QC",sub:"Quality Control"},{id:"Dispatch",color:"var(--text2)",label:"Dispatch",sub:"Logistics"},{id:"Accounts",color:"var(--text2)",label:"Accounts",sub:"Billing"}];vr(new Date),vr(new Date),vr(new Date),vr(new Date);function vr(e){return e.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}const Le={pending:{cls:"badge-pending",label:"PENDING"},inprogress:{cls:"badge-inprogress",label:"IN PROGRESS"},done:{cls:"badge-done",label:"DONE"},blocked:{cls:"badge-blocked",label:"BLOCKED"},review:{cls:"badge-review",label:"REVIEW"}},jg=[{key:"Stock Check",label:"① Stock Check"},{key:"Material Allotted",label:"② Material Allotted"},{key:"Acceptance",label:"③ Acceptance"},{key:"Accept-Complete",label:"④ Accept-Complete"}],wg=[{id:"board",icon:ag,label:"Board",roles:null},{id:"planning",icon:tp,label:"Planning",roles:null},{id:"orders",icon:eg,label:"Orders",roles:null},{id:"new-order",icon:Zm,label:"New Order",roles:["Admin","Manager","Sales"]},{id:"masters",icon:rp,label:"Masters",roles:["Admin","Manager","Sales"]},{id:"import",icon:vg,label:"Import",roles:["Admin","Manager","Sales"]},{id:"worklist",icon:lg,label:"My Worklist",roles:["Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Sales"]}],kg=[{id:"users",icon:sp,label:"User Directory"},{id:"logs",icon:pg,label:"System Logs"},{id:"settings",icon:ti,label:"System Settings"}];function Sg({steps:e,currentFilter:t,onFilterDept:n,bomState:a,onSetBomState:l,designType:s,onSetDesignType:i,currentView:o,onSetView:d,userRole:p}){return r.jsxs("div",{className:"sidenav",children:[r.jsx("div",{className:"sidenav-section",children:"Workspace"}),wg.map(f=>{if(f.roles&&!f.roles.includes(p))return null;const h=f.icon;return r.jsxs("button",{className:`dept-btn${o===f.id?" active":""}`,onClick:()=>d(f.id),children:[r.jsx(h,{size:14,className:"nav-icon"}),f.label]},f.id)}),r.jsx("div",{className:"sidenav-section",style:{marginTop:8},children:"Departments"}),r.jsxs("button",{className:`dept-btn${t==="all"?" active":""}`,onClick:()=>n("all"),children:[r.jsx("span",{className:"dept-dot",style:{background:"var(--accent)"}}),"All Departments"]}),Mt.map(f=>{const h=e.filter(k=>k.dept===f.id&&k.status==="done").length,x=e.filter(k=>k.dept===f.id).length;return r.jsxs("button",{className:`dept-btn${t===f.id?" active":""}`,onClick:()=>{n(f.id),d("flow")},children:[r.jsx("span",{className:"dept-dot",style:{background:f.color}}),f.label,x>0?r.jsxs("span",{className:"dept-count",children:[h,"/",x]}):r.jsx("span",{className:"dept-count",style:{opacity:.3},children:"—"})]},f.id)}),r.jsx("div",{className:"sidenav-section",style:{marginTop:8},children:"BOM Status"}),r.jsx("div",{style:{padding:"0 12px 12px"},children:jg.map(f=>{const h=["Admin","Manager","Accounts","Production"].includes(p);return r.jsx("div",{className:`bom-state${a===f.key?" active-state":""}${h?"":" read-only"}`,onClick:()=>h&&l(f.key),children:f.label},f.key)})}),r.jsx("div",{className:"sidenav-section",children:"Design Type"}),r.jsxs("div",{style:{padding:"0 12px 14px"},children:[r.jsxs("div",{className:s==="Standard"?"tag-standard":"tag-nonstandard",children:["◆ ",s==="Standard"?"STANDARD":"NON-STANDARD"]}),r.jsx("div",{style:{marginTop:6,display:"flex",gap:6},children:["Standard","Non-Standard"].map(f=>{const h=["Admin","Manager","Design"].includes(p);return r.jsx("button",{className:`vbtn${s===f?" active":""}${h?"":" read-only"}`,style:{flex:1,fontSize:10},onClick:()=>h&&i(f),children:f==="Standard"?"Standard":"Non-Std"},f)})})]}),p==="Admin"&&r.jsxs("div",{style:{marginTop:"auto",borderTop:"1px solid var(--border)",padding:"8px 0 4px"},children:[r.jsx("div",{className:"sidenav-section",children:"Administration"}),kg.map(f=>{const h=f.icon;return r.jsxs("button",{className:`dept-btn${o===f.id?" active":""}`,onClick:()=>d(f.id),style:{width:"100%",justifyContent:"flex-start"},children:[r.jsx(h,{size:14,className:"nav-icon"}),f.label]},f.id)})]})]})}function _g({deliveryDate:e}){if(!e)return r.jsx("span",{style:{color:"var(--text3)"},children:"—"});const t=Math.ceil((new Date(e)-new Date)/864e5),n=t<0||t<7?"var(--red)":t<14?"var(--accent)":"var(--green)",a=t<0?`${Math.abs(t)}d overdue`:t===0?"today":`${t}d left`;return r.jsx("span",{style:{color:n,fontFamily:"var(--font-mono)",fontSize:14,fontWeight:700},children:a})}function Ng({steps:e,currentFilter:t,selectedOrder:n}){const a=t==="all"?e:e.filter(f=>f.dept===t),l=a.filter(f=>f.status==="inprogress").length,s=a.filter(f=>f.status==="blocked").length,i=a.filter(f=>f.status==="done").length,o=a.length;let d="PENDING",p="var(--accent)";return o===0?(d="NO TASKS",p="var(--text3)"):i===o?(d="COMPLETE",p="var(--green)"):s>0?(d="BLOCKED",p="var(--red)"):(i>0||l>0)&&(d="IN PROGRESS",p="var(--blue)"),r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card",children:[r.jsx("div",{className:"stat-label",children:"Order Status"}),r.jsx("div",{className:"stat-value",style:{color:p,fontSize:13,fontWeight:700,marginTop:4},children:d}),r.jsx("div",{className:"stat-sub",children:(n==null?void 0:n.order_number)||"no order selected"})]}),r.jsxs("div",{className:"stat-card",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:l>0?"var(--blue)":"var(--text3)"},children:l}),r.jsx("div",{className:"stat-sub",children:"active steps"})]}),r.jsxs("div",{className:"stat-card",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:s>0?"var(--red)":"var(--text3)"},children:s}),r.jsx("div",{className:"stat-sub",children:s>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card",children:[r.jsx("div",{className:"stat-label",children:"Delivery"}),r.jsx("div",{style:{marginTop:4},children:r.jsx(_g,{deliveryDate:n==null?void 0:n.delivery_date})}),r.jsx("div",{className:"stat-sub",children:n!=null&&n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"TBD"})]})]})}function Cg(){const[e,t]=m.useState(null),n=localStorage.getItem("token");return m.useEffect(()=>{fetch("http://localhost:5000/api/board",{headers:{Authorization:`Bearer ${n}`}}).then(a=>a.ok?a.json():[]).then(a=>{const l=new Date,s=new Date(l);s.setDate(l.getDate()+7);let i=0,o=0,d=0,p=0;a.forEach(f=>{const h=(f.priority||"Medium").toLowerCase();if((h==="urgent"||h==="high")&&d++,f.delivery_date){const x=new Date(f.delivery_date);x>=l&&x<=s&&p++}(f.steps||[]).forEach(x=>{x.status==="blocked"&&i++,x.status==="inprogress"&&o++})}),t({total:a.length,urgentHigh:d,totalBlocked:i,totalIP:o,dueThisWeek:p})}).catch(()=>t(null))},[n]),e?r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card",children:[r.jsx("div",{className:"stat-label",children:"Active Orders"}),r.jsx("div",{className:"stat-value",style:{color:"var(--text)"},children:e.total}),r.jsx("div",{className:"stat-sub",children:"in pipeline"})]}),r.jsxs("div",{className:"stat-card",children:[r.jsx("div",{className:"stat-label",children:"Urgent / High"}),r.jsx("div",{className:"stat-value",style:{color:e.urgentHigh>0?"var(--accent)":"var(--text3)"},children:e.urgentHigh}),r.jsx("div",{className:"stat-sub",children:"priority orders"})]}),r.jsxs("div",{className:"stat-card",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:e.totalIP>0?"var(--blue)":"var(--text3)"},children:e.totalIP}),r.jsx("div",{className:"stat-sub",children:"steps across orders"})]}),r.jsxs("div",{className:"stat-card",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:e.totalBlocked>0?"var(--red)":"var(--text3)"},children:e.totalBlocked}),r.jsx("div",{className:"stat-sub",children:e.totalBlocked>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card",children:[r.jsx("div",{className:"stat-label",children:"Due This Week"}),r.jsx("div",{className:"stat-value",style:{color:e.dueThisWeek>0?"var(--accent)":"var(--text3)"},children:e.dueThisWeek}),r.jsx("div",{className:"stat-sub",children:"orders"})]})]}):r.jsx("div",{className:"stats-row",children:[...Array(5)].map((a,l)=>r.jsxs("div",{className:"stat-card",style:{opacity:.4},children:[r.jsx("div",{className:"stat-label",children:"Loading…"}),r.jsx("div",{className:"stat-value",children:"—"})]},l))})}function zg({steps:e,currentFilter:t,selectedOrder:n}){return n?r.jsx(Ng,{steps:e,currentFilter:t,selectedOrder:n}):r.jsx(Cg,{})}const Nd=["General","PO","Quotation","BOM","Drawing","QC Report","Dispatch Document","Photo"],Eg=["Sales","Accounts","Admin","Manager"];function dl({entityType:e,entityId:t,initialDocs:n=[],onUploadSuccess:a,onDocsUpdate:l,readOnly:s=!1,defaultDocType:i="General",userRole:o=null}){const p=!o||Eg.includes(o)?Nd:Nd.filter(c=>c!=="PO"),[f,h]=m.useState(n),[x,k]=m.useState(!1),[j,w]=m.useState(i);m.useEffect(()=>{i&&w(i)},[i]);const _=localStorage.getItem("token");m.useEffect(()=>{t&&(async()=>{try{const v=await fetch(`http://localhost:5000/api/documents/${e}/${t}`,{headers:{Authorization:`Bearer ${_}`}});if(v.ok){const N=await v.json();h(N)}}catch(v){console.error("Failed to fetch docs",v)}})()},[e,t,_]),m.useEffect(()=>{l&&l(f)},[f,l]);const g=async c=>{const v=Array.from(c.target.files);if(v.length===0)return;if(j==="PO"||j==="Quotation"){if(v.length>1){alert(`${j} can only be a single file.`),c.target.value="";return}if(f.some(P=>P.doc_type===j)){alert(`A ${j} already exists for this order. Please delete it first or choose a different type.`),c.target.value="";return}}if(f.length+v.length>20){alert("Maximum 20 files allowed per entity."),c.target.value="";return}k(!0);const N=new FormData;N.append("entity_type",e),N.append("entity_id",t),N.append("doc_type",j),v.forEach(P=>N.append("files",P));try{const P=await fetch("http://localhost:5000/api/documents/upload",{method:"POST",headers:{Authorization:`Bearer ${_}`},body:N});if(P.ok){const z=await P.json();h([...f,...z]),a&&a(z)}else{const z=await P.json();alert(z.error||"Upload failed")}}catch(P){console.error("Upload error:",P),alert("Network error during upload")}finally{k(!1),c.target.value=""}},u=async c=>{if(window.confirm("Are you sure you want to delete this document?"))try{const v=await fetch(`http://localhost:5000/api/documents/${c}`,{method:"DELETE",headers:{Authorization:`Bearer ${_}`}});if(v.ok){const N=f.filter(P=>P.id!==c);h(N),a&&a(N)}else{const N=await v.json();alert(N.error||"Failed to delete document")}}catch(v){console.error("Delete error:",v),alert("Network error during deletion")}};return r.jsxs("div",{className:"doc-manager",children:[r.jsxs("div",{className:"doc-header",children:[r.jsxs("h4",{children:["Documents (",f.length,"/20)"]}),!s&&r.jsxs("div",{className:"doc-upload-controls",children:[r.jsx("select",{value:j,onChange:c=>w(c.target.value),className:"doc-type-select",children:p.map(c=>r.jsx("option",{value:c,children:c},c))}),r.jsxs("label",{className:"upload-btn",children:[x?"Uploading...":"Add Files",r.jsx("input",{type:"file",multiple:!0,hidden:!0,onChange:g,disabled:x||f.length>=20})]})]})]}),r.jsx("div",{className:"doc-list",children:f.length===0?r.jsx("div",{className:"no-docs",children:"No documents uploaded yet."}):f.map(c=>r.jsxs("div",{className:"doc-item",children:[r.jsxs("div",{className:"doc-info",children:[r.jsx("span",{className:"doc-type-badge",children:c.doc_type}),r.jsx("span",{className:"doc-name",title:c.file_name,children:c.file_name})]}),r.jsxs("div",{className:"doc-meta",children:[r.jsxs("span",{children:[(c.file_size/1024).toFixed(1)," KB"]}),r.jsx("a",{href:`http://localhost:5000/uploads/${c.file_path.split(/[\/\\]/).pop()}?token=${_}`,target:"_blank",rel:"noopener noreferrer",className:"doc-link",children:"View"}),!s&&r.jsx("button",{onClick:()=>u(c.id),style:{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",marginLeft:"8px",fontSize:"14px"},title:"Delete document",children:"✕"})]})]},c.id))}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .doc-manager {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }
        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .doc-header h4 { margin: 0; color: #fff; font-weight: 500; }
        .doc-upload-controls { display: flex; gap: 8px; }
        .doc-type-select {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #ccc;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 13px;
        }
        .upload-btn {
          background: #3b82f6;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .upload-btn:hover { background: #2563eb; }
        .upload-btn[disabled] { opacity: 0.5; cursor: not-allowed; }
        
        .doc-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .doc-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .doc-info { display: flex; align-items: center; gap: 10px; overflow: hidden; }
        .doc-type-badge {
          font-size: 10px;
          text-transform: uppercase;
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .doc-name {
          font-size: 13px;
          color: #eee;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .doc-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: #888; }
        .doc-link { color: #3b82f6; text-decoration: none; font-weight: 500; }
        .doc-link:hover { text-decoration: underline; }
        .no-docs { text-align: center; color: #666; font-size: 13px; padding: 20px; }
      `}})]})}function Cd({status:e}){const{cls:t,label:n}=Le[e]||Le.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Pg({steps:e,currentFilter:t,onOpenModal:n,onSetView:a,userRole:l,selectedOrderId:s,selectedOrder:i,onStepsChanged:o,selectedUnitId:d,setSelectedUnitId:p,unitSteps:f,setUnitSteps:h}){const[x,k]=m.useState([]),[j,w]=m.useState(null),_=localStorage.getItem("token"),[g,u]=m.useState(!1),[c,v]=m.useState(null),[N,P]=m.useState([]),[z,D]=m.useState(null),E=JSON.parse(localStorage.getItem("user")||"{}"),T=c?["Admin","Manager"].includes(l)||c.dept===l||c.assigned_user_id===E.id:!1,[H,te]=m.useState("details"),[K,J]=m.useState(0),M=(()=>{if(!c)return[];try{return Array.isArray(c.custom_fields)?c.custom_fields:JSON.parse(c.custom_fields||"[]")}catch{return[]}})();m.useEffect(()=>{fetch("http://localhost:5000/api/users",{headers:{Authorization:`Bearer ${_}`}}).then(async y=>{y.ok&&P(await y.json())}).catch(console.error)},[_]);const G=async(y,U)=>{if(!T)return;const R=f.find(Y=>Y.id===y),ee=R?R.order_unit_id:d;if(ee)try{const Y=await fetch(`http://localhost:5000/api/units/${ee}/steps/${y}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${_}`},body:JSON.stringify(U)});if(Y.ok){const C=await fetch(`http://localhost:5000/api/units/${ee}/steps`,{headers:{Authorization:`Bearer ${_}`}}).then(ne=>ne.json());h(C);const O=C.find(ne=>ne.id===y);v(O),o&&o(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:s}}))}else{const C=await Y.json().catch(()=>({}));D(C.error||"Failed to update step")}}catch(Y){console.error(Y),D("Network error — could not update step")}},V=y=>{D(null),y.order_unit_id?(v(y),te("details"),J(0),u(!0)):n(y.id)},B=e.filter(y=>!y.order_unit_id),S=[...f,...B],I=()=>{const y=(i==null?void 0:i.units)||[];return r.jsxs("div",{className:"unit-selector-container",style:{marginBottom:24,display:"flex",alignItems:"center",gap:12},children:[r.jsx("span",{style:{fontSize:13,color:"#aaa",fontWeight:"bold",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Track Level:"}),r.jsxs("select",{className:"form-select",value:d,onChange:U=>p(U.target.value),style:{width:"auto",background:"var(--bg3)",fontSize:"13px",padding:"6px 12px",border:"1px solid var(--border2)",color:"var(--text)",borderRadius:"6px",cursor:"pointer"},children:[r.jsx("option",{value:"",children:"Order Milestones"}),y.map(U=>r.jsxs("option",{value:U.id,children:["Unit: ",U.unit_id," (",U.status,")"]},U.id))]})]})};m.useEffect(()=>{fetch("http://localhost:5000/api/task_masters",{headers:{Authorization:`Bearer ${_}`}}).then(async y=>{if(y.ok){const U=await y.json();k(U)}}).catch(console.error)},[_]);const F=async y=>{if(!(!y||!s))try{(await fetch(`http://localhost:5000/api/orders/${s}/steps`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${_}`},body:JSON.stringify({taskId:y})})).ok&&(o&&o(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:s}})))}catch(U){console.error(U)}},Z=(y,U)=>{w(U),y.dataTransfer.effectAllowed="move",setTimeout(()=>{y.target.style.opacity="0.5"},0)},ye=y=>{y.target.style.opacity="1",w(null)},de=(y,U)=>{y.preventDefault(),j&&j.dept!==U?y.dataTransfer.dropEffect="none":y.dataTransfer.dropEffect="move"},le=async(y,U)=>{if(y.preventDefault(),!j||j.id===U.id||j.dept!==U.dept)return;const R=e.filter(ie=>ie.dept===U.dept),ee=R.findIndex(ie=>ie.id===j.id),Y=R.findIndex(ie=>ie.id===U.id);if(ee===-1||Y===-1)return;const C=[...R],[O]=C.splice(ee,1);C.splice(Y,0,O);const ne=C.map(ie=>ie.id);try{(await fetch(`http://localhost:5000/api/orders/${s}/steps/reorder`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${_}`},body:JSON.stringify({orderedIds:ne})})).ok&&o&&(o(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:s}})))}catch(ie){console.error("Failed to reorder",ie)}},ce=[...Mt].sort((y,U)=>["Admin","Manager"].includes(l)?0:y.id===l?-1:U.id===l?1:0),se=t==="all"?ce:ce.filter(y=>y.id===t);return r.jsxs("div",{style:{display:"flex",flexDirection:"column",width:"100%"},children:[I(),t==="all"?r.jsxs("div",{className:"lanes",children:[se.map(y=>{const U=S.filter(C=>C.dept===y.id),R=U.some(C=>C.status==="blocked"),ee=!d&&(["Admin","Manager"].includes(l)||y.id===l),Y=x.filter(C=>C.dept===y.id&&!U.some(O=>O.task_id===C.id));return r.jsxs("div",{className:`lane${R?" active-lane":""}`,children:[r.jsxs("div",{className:"lane-label",children:[r.jsx("div",{style:{width:3,height:20,background:y.color,borderRadius:2,marginBottom:6}}),r.jsx("div",{className:"lane-name",children:y.label}),r.jsx("div",{className:"lane-sub",children:y.sub}),y.id==="Sales"&&l==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:12,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),ee&&Y.length>0&&s&&!d&&r.jsx("div",{style:{marginTop:12},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:C=>{F(C.target.value),C.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),Y.map(C=>r.jsx("option",{value:C.id,children:C.name},C.id))]})})]}),r.jsxs("div",{className:"lane-steps",children:[U.map((C,O)=>{const ne=JSON.parse(localStorage.getItem("user")||"{}"),ie=!!C.order_unit_id,Ne=["Admin","Manager"].includes(l)||C.dept===l||ie&&C.assigned_user_id===ne.id,xe=!ie&&!d&&Ne;return r.jsxs("div",{style:{display:"flex",alignItems:"center"},draggable:xe,onDragStart:Se=>xe&&Z(Se,C),onDragEnd:ye,onDragOver:Se=>de(Se,y.id),onDrop:Se=>xe&&le(Se,C),children:[r.jsxs("div",{className:`step status-${C.status}${Ne?"":" read-only"}${C.dept==="Sales"&&C.status==="pending"?" pulse-sales":""}${(j==null?void 0:j.id)===C.id?" dragging":""}`,onClick:()=>V(C),style:{cursor:xe?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${C.status}`}),r.jsxs("div",{className:"step-num",children:[y.id.toUpperCase().slice(0,3),"-",String(O+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[C.name,C.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4},children:"📎"})]}),r.jsx("div",{className:"step-sub",children:C.sub}),r.jsx(Cd,{status:C.status}),C.notes&&r.jsx("div",{className:"step-note",children:C.notes}),C.special==="sales"&&l==="Sales"&&r.jsx("button",{className:"vbtn",style:{marginTop:8,fontSize:10,width:"100%",background:"rgba(20, 184, 166, 0.2)",color:"var(--teal)",border:"1px solid rgba(20, 184, 166, 0.4)"},onClick:Se=>{Se.stopPropagation(),a("new-order")},children:"Go to Order Creation"})]}),O<U.length-1&&r.jsx("div",{className:"step-arrow",children:"›"})]},ie?`unit-${C.id}`:`order-${C.id}`)}),U.length===0&&r.jsx("div",{style:{padding:12,color:"#666",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},y.id)}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
            .pulse-sales {
              animation: sales-glow 2s infinite ease-in-out;
              border: 1px solid rgba(20, 184, 166, 0.4) !important;
            }
            @keyframes sales-glow {
              0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
              50% { box-shadow: 0 0 15px 0 rgba(20, 184, 166, 0.4); }
              100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
            }
          `}})]}):r.jsx("div",{className:"flow-card-grid",children:se.map(y=>{const U=S.filter(C=>C.dept===y.id),R=U.some(C=>C.status==="blocked"),ee=!d&&(["Admin","Manager"].includes(l)||y.id===l),Y=x.filter(C=>C.dept===y.id&&!U.some(O=>O.task_id===C.id));return r.jsxs("div",{className:`dept-flow-card${R?" has-blocked":""}`,children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:y.color}}),r.jsxs("div",{children:[r.jsx("div",{className:"dept-card-title",children:y.label}),r.jsx("div",{className:"dept-card-sub",children:y.sub})]})]}),i&&r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:i.order_number}),i.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"#aaa",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:i.company_name}),i.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"🚚"})," ",new Date(i.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),i&&i.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"#f59e0b",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"#d1d5db"},children:i.notes})]}),y.id==="Sales"&&l==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:8,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),ee&&Y.length>0&&s&&!d&&r.jsx("div",{style:{marginTop:8},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:C=>{F(C.target.value),C.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),Y.map(C=>r.jsx("option",{value:C.id,children:C.name},C.id))]})})]}),r.jsxs("div",{className:"dept-card-tasks-vertical",children:[U.map((C,O)=>{const ne=JSON.parse(localStorage.getItem("user")||"{}"),ie=!!C.order_unit_id,Ne=["Admin","Manager"].includes(l)||C.dept===l||ie&&C.assigned_user_id===ne.id,xe=!ie&&!d&&Ne;return r.jsx("div",{style:{display:"flex",alignItems:"center"},draggable:xe,onDragStart:Se=>xe&&Z(Se,C),onDragEnd:ye,onDragOver:Se=>de(Se,y.id),onDrop:Se=>xe&&le(Se,C),children:r.jsxs("div",{className:`step status-${C.status}${Ne?"":" read-only"}${C.dept==="Sales"&&C.status==="pending"?" pulse-sales":""}${(j==null?void 0:j.id)===C.id?" dragging":""}`,onClick:()=>V(C),style:{cursor:xe?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${C.status}`}),r.jsxs("div",{className:"step-num",children:[y.id.toUpperCase().slice(0,3),"-",String(O+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[C.name,C.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4},children:"📎"})]}),r.jsx("div",{className:"step-sub",children:C.sub}),r.jsx(Cd,{status:C.status}),C.notes&&r.jsx("div",{className:"step-note",children:C.notes}),C.special==="sales"&&l==="Sales"&&r.jsx("button",{className:"vbtn",style:{marginTop:8,fontSize:10,width:"100%",background:"rgba(20, 184, 166, 0.2)",color:"var(--teal)",border:"1px solid rgba(20, 184, 166, 0.4)"},onClick:Se=>{Se.stopPropagation(),a("new-order")},children:"Go to Order Creation"})]})},ie?`unit-${C.id}`:`order-${C.id}`)}),U.length===0&&r.jsx("div",{style:{padding:12,color:"#666",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},y.id)})}),g&&c&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&u(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:T?"Edit Unit Step":"View Unit Step"}),r.jsxs("div",{className:"modal-sub",children:[c.name," (",c.dept,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>u(!1),children:"✕"})]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid #333",padding:"0 24px",marginBottom:"16px"},children:["details",...M.length>0?["fields"]:[],"documents"].map(y=>r.jsxs("button",{onClick:()=>te(y),style:{background:"transparent",border:"none",borderBottom:H===y?"2px solid #3b82f6":"2px solid transparent",color:H===y?"#60a5fa":"#888",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:H===y?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[y==="fields"?"Form Fields":y.charAt(0).toUpperCase()+y.slice(1),y==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:M.length})]},y))}),r.jsxs("div",{className:"modal-body",children:[!T&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"12px"},children:["ℹ️ ",r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:c.dept})," department."]}),z&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"12px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"14px",flexShrink:0},children:"⛔"}),r.jsx("span",{style:{flex:1},children:z}),r.jsx("button",{onClick:()=>D(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"14px",padding:"0",lineHeight:1},children:"✕"})]}),H==="details"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Status"}),T?r.jsxs("select",{className:"form-select",value:c.status,onChange:y=>{const U=y.target.value;if(c.requires_upload&&U==="done"&&K===0){alert("You must upload at least one document to complete this task.");return}G(c.id,{status:U})},style:{background:"#111",fontSize:"13px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${(Le[c.status]||Le.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:(Le[c.status]||Le.pending).label})})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Assign Worker"}),T?r.jsxs("select",{className:"form-select",value:c.assigned_user_id||"",onChange:y=>G(c.id,{assigned_user_id:y.target.value?parseInt(y.target.value):null}),style:{background:"#111",fontSize:"13px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),N.filter(y=>y.role===c.dept).map(y=>r.jsx("option",{value:y.id,children:y.username},y.id))]}):r.jsx("div",{style:{fontSize:"13px",color:"#ddd",background:"#111",padding:"8px 12px",borderRadius:"6px"},children:(()=>{const y=N.find(U=>U.id===c.assigned_user_id);return y?y.username:"Unassigned"})()})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Notes"}),T?r.jsx("textarea",{className:"form-input",defaultValue:c.notes||"",onBlur:y=>G(c.id,{notes:y.target.value}),placeholder:"Add step notes...",style:{background:"#111",fontSize:"13px",height:"60px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"13px",color:"#bbb",fontStyle:"italic",background:"#111",padding:"10px 12px",borderRadius:"6px",minHeight:"40px",whiteSpace:"pre-wrap"},children:c.notes||"No notes added."})]})]}),H==="fields"&&M.length>0&&r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:M.map((y,U)=>{var ee;const R=Y=>{const C=[...M];C[U].value=Y,G(c.id,{custom_fields:C})};return r.jsxs("div",{style:{background:"#111",border:"1px solid #2a2a2a",borderRadius:"8px",padding:"12px 16px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("span",{style:{color:"#eee",fontSize:"13px",fontWeight:"600"},children:y.label}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"10px",color:"#555",textTransform:"uppercase",background:"#222",padding:"1px 5px",borderRadius:"3px"},children:y.type})]}),T?y.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!y.value,onChange:Y=>R(Y.target.checked)}):y.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:y.value||"",onChange:Y=>R(Y.target.value),style:{background:"#111",fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(ee=y.options)==null?void 0:ee.map(Y=>r.jsx("option",{value:Y,children:Y},Y))]}):r.jsx("input",{type:y.type==="Number"?"number":"text",className:"form-input",defaultValue:y.value||"",onBlur:Y=>R(Y.target.value),style:{background:"#111",fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"#ddd",fontWeight:"500",marginTop:"2px"},children:y.type==="Yes/No"?y.value==="Yes"||y.value===!0?"✅ Yes":"❌ No":y.value||"—"})]},y.id)})}),H==="documents"&&r.jsxs("div",{children:[c.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"⚠️ This task requires at least one document to be marked as Done."}),r.jsx(dl,{entityType:"UnitStep",entityId:c.id,initialDocs:[],onDocsUpdate:y=>J(y.length),readOnly:!T,defaultDocType:c.default_doc_type||"General",userRole:l})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .flow-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          align-items: start;
          padding-bottom: 40px;
        }
        .dept-flow-card {
          background: rgba(25, 25, 25, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .dept-flow-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .dept-flow-card.has-blocked {
          border-color: rgba(239, 68, 68, 0.5);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.15);
          background: linear-gradient(180deg, rgba(239, 68, 68, 0.03) 0%, rgba(25, 25, 25, 0.6) 100%);
        }
        .dept-card-header {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
        }
        .dept-card-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .dept-color-bar {
          width: 4px;
          height: 32px;
          border-radius: 4px;
        }
        .dept-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .dept-card-sub {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }
        .dept-card-ord-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
        .ord-badge {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-weight: 600;
          font-size: 13px;
          color: #cbd5e1;
        }
        .delivery-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #a78bfa;
          background: rgba(167, 139, 250, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid rgba(167, 139, 250, 0.2);
          font-weight: 500;
        }
        .delivery-badge .icon {
          font-size: 10px;
        }
        .dept-card-tasks-vertical {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        /* Override standard .step to look better in vertical list */
        .dept-card-tasks-vertical .step {
          width: 100%;
          min-width: 0;
          max-width: none;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.2s;
        }
        .dept-card-tasks-vertical .step:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }
        .pulse-sales {
          animation: sales-glow 2s infinite ease-in-out;
          border: 1px solid rgba(20, 184, 166, 0.4) !important;
        }
        @keyframes sales-glow {
          0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
          50% { box-shadow: 0 0 15px 0 rgba(20, 184, 166, 0.4); }
          100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
        }
      `}})]})}function Tg({status:e}){const{cls:t,label:n}=Le[e]||Le.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Dg({currentFilter:e,userRole:t,onSetView:n}){const[a,l]=m.useState([]),[s,i]=m.useState(!0),[o,d]=m.useState("all"),[p,f]=m.useState("incomplete"),[h,x]=m.useState("updated"),[k,j]=m.useState(""),w=localStorage.getItem("token");m.useEffect(()=>{_();const c=()=>{_()};return window.addEventListener("orderUpdated",c),()=>window.removeEventListener("orderUpdated",c)},[]);const _=async()=>{try{const c=await fetch("http://localhost:5000/api/board",{headers:{Authorization:`Bearer ${w}`}});c.ok&&l(await c.json())}catch(c){console.error(c)}finally{i(!1)}},g=e==="all"?Mt:Mt.filter(c=>c.id===e);if(s)return r.jsx("div",{className:"loading",style:{padding:40,textAlign:"center",color:"#888"},children:"Loading board..."});const u=a.filter(c=>{if(o!=="all"&&(c.priority||"Medium").toLowerCase()!==o||p==="incomplete"&&c.status==="completed"||p==="completed"&&c.status!=="completed")return!1;if(k.trim()!==""){const v=k.toLowerCase(),N=(c.order_number||"").toLowerCase().includes(v),P=(c.company_name||"").toLowerCase().includes(v),z=(c.po_number||"").toLowerCase().includes(v),D=c.steps&&c.steps.some(E=>(E.name||"").toLowerCase().includes(v)||(E.dept||"").toLowerCase().includes(v));if(!N&&!P&&!z&&!D)return!1}return!0}).sort((c,v)=>{if(h==="updated"){const N=new Date(c.updated_at||0);return new Date(v.updated_at||0)-N}return 0});return r.jsxs("div",{className:"board-view-orders",children:[r.jsxs("div",{className:"board-filters",children:[r.jsxs("div",{className:"filter-group",children:[r.jsx(ap,{size:14,className:"filter-icon"}),r.jsx("span",{className:"filter-label",children:"Sort:"}),r.jsxs("select",{value:h,onChange:c=>x(c.target.value),className:"board-select",children:[r.jsx("option",{value:"updated",children:"Recently Updated"}),r.jsx("option",{value:"created",children:"Recently Created"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Status:"}),r.jsxs("select",{value:p,onChange:c=>f(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Orders"}),r.jsx("option",{value:"incomplete",children:"Incomplete Only"}),r.jsx("option",{value:"completed",children:"Completed Only"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Priority:"}),r.jsxs("select",{value:o,onChange:c=>d(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"low",children:"Low"})]})]}),r.jsxs("div",{className:"board-search-container",children:[r.jsx(zl,{size:14,className:"board-search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by Order, PO, Company or Task...",value:k,onChange:c=>j(c.target.value),className:"board-search-input"}),k&&r.jsx("button",{className:"search-clear-btn",onClick:()=>j(""),title:"Clear search",children:r.jsx(Yr,{size:14})})]})]}),u.map(c=>{if(c.status==="completed")return e!=="all"&&!c.steps.some(z=>z.dept===e)?null:r.jsxs("div",{className:"completed-order-row",onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"completed-order-header",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsxs("div",{className:"completed-badges-row",children:[c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"🚚"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]}),r.jsx("span",{className:"completed-global-badge",children:"COMPLETED"})]})]}),r.jsx("div",{className:"completed-banner",children:r.jsxs("div",{className:"completed-banner-content",children:[r.jsx("div",{className:"completed-icon-badge",children:"✓"}),r.jsxs("div",{className:"completed-text-content",children:[r.jsx("span",{className:"completed-title",children:"Order Fully Completed"}),r.jsx("span",{className:"completed-subtitle",children:"All steps have been successfully finalized. Click to view process flow logs."})]})]})})]},c.id);let v=[],N=[];if(v=c.steps.filter(P=>["inprogress","blocked","review"].includes(P.status)),v.length===0){const P=c.steps.find(z=>z.status==="pending");if(P)v=[P];else return null}return N=g.filter(P=>v.some(z=>z.dept===P.id)),N.length===0?null:r.jsxs("div",{className:"board-order-row",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsx("div",{className:"board-dept-grid",children:N.map(P=>{const z=v.filter(D=>D.dept===P.id);return r.jsxs("div",{className:"dept-flow-card",onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:P.color}}),r.jsx("div",{className:"dept-card-title",children:P.label})]}),r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:c.order_number}),c.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"#aaa",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:c.company_name}),c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"🚚"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),c.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"#f59e0b",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"#d1d5db"},children:c.notes})]})]}),r.jsx("div",{className:"dept-card-tasks",children:z.map(D=>r.jsxs("div",{className:`board-task status-${D.status}`,children:[r.jsx("span",{className:`step-dot dot-${D.status}`}),r.jsx("div",{className:"board-task-name",title:D.name,children:D.name}),r.jsx(Tg,{status:D.status})]},D.id))})]},P.id)})})]},c.id)}),u.length===0&&r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"No orders match the current filters."}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .board-view-orders {
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding-bottom: 40px;
        }
        .board-filters {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--bg2);
          padding: 12px 20px;
          border-radius: 8px;
          border: 1px solid var(--border);
          margin-bottom: -8px;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-icon {
          color: var(--text3);
        }
        .filter-label {
          font-size: 11px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .board-select {
          background: var(--bg4);
          border: 1px solid var(--border2);
          color: var(--text);
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
        }
        .board-select option {
          background: var(--bg3);
          color: var(--text);
        }
        .board-select:hover {
          border-color: var(--accent);
        }
        .board-order-title {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          letter-spacing: 0.5px;
        }
        .board-order-company {
          color: var(--text2);
          font-size: 15px;
          font-weight: normal;
        }
        .board-dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          align-items: start;
        }
        .dept-flow-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-top: 2px solid var(--border2);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s ease;
        }
        .dept-flow-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.15);
          border-color: var(--accent);
        }
        .dept-card-header {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px dashed var(--border2);
        }
        .dept-card-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .dept-color-bar {
          width: 4px;
          height: 32px;
          border-radius: 4px;
        }
        .dept-card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .dept-card-ord-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg4);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .ord-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 13px;
          color: var(--text);
        }
        .delivery-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--purple);
          background: var(--purple-dim);
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid rgba(124, 58, 237, 0.25);
          font-weight: 500;
        }
        .delivery-badge .icon {
          font-size: 10px;
        }
        .dept-card-tasks {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .board-task {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 8px;
          background: var(--bg3);
          border: 1px solid var(--border);
          font-size: 12px;
          transition: all 0.2s;
        }
        .board-task:hover {
          background: var(--bg4);
          border-color: var(--border2);
          transform: translateX(3px);
        }
        .board-task-name {
          flex: 1;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .board-search-container {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--bg4);
          border: 1px solid var(--border2);
          border-radius: 6px;
          padding: 4px 10px;
          margin-left: auto;
          flex: 1 1 200px;
          max-width: 280px;
          min-width: 140px;
          height: 28px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .board-search-container:focus-within {
          border-color: var(--blue);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .board-search-icon {
          color: var(--text3);
          margin-right: 8px;
          flex-shrink: 0;
        }
        .board-search-input {
          background: transparent;
          border: none;
          color: var(--text);
          font-size: 12px;
          outline: none;
          width: 100%;
          padding: 0;
          height: 100%;
          box-sizing: border-box;
        }
        .board-search-input::placeholder {
          color: var(--text3);
        }
        .search-clear-btn {
          background: transparent;
          border: none;
          color: var(--text3);
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .search-clear-btn:hover {
          color: var(--red);
          background: var(--red-dim);
        }
        .completed-order-row {
          background: var(--green-dim);
          border: 1px solid rgba(22, 163, 74, 0.25);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .completed-order-row:hover {
          border-color: var(--green);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .completed-order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .completed-order-header .board-order-title {
          margin: 0;
          border-bottom: none;
          padding-bottom: 0;
        }
        .completed-badges-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .completed-global-badge {
          font-size: 11px;
          color: var(--green);
          background: var(--green-dim);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(22, 163, 74, 0.3);
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .completed-banner {
          display: flex;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px 20px;
          align-items: center;
        }
        .completed-banner-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .completed-icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--green);
          color: #fff;
          border-radius: 50%;
          font-size: 18px;
          font-weight: bold;
        }
        .completed-text-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .completed-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--green);
        }
        .completed-subtitle {
          font-size: 13px;
          color: var(--text2);
        }
        .loading {
          color: var(--text3);
        }
      `}})]})}function Lg({status:e}){const{cls:t,label:n}=Le[e]||Le.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Ig({steps:e,currentFilter:t,onOpenModal:n,userRole:a}){const l=(t==="all"?e:e.filter(s=>s.dept===t)).slice().sort((s,i)=>["Admin","Manager"].includes(a)?0:s.dept===a&&i.dept!==a?-1:i.dept===a&&s.dept!==a?1:0);return r.jsxs("table",{className:"step-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"#"}),r.jsx("th",{children:"DEPT"}),r.jsx("th",{children:"STEP"}),r.jsx("th",{children:"STATUS"}),r.jsx("th",{children:"NOTES"}),r.jsx("th",{children:"UPDATED"})]})}),r.jsx("tbody",{children:l.map((s,i)=>{const o=Mt.find(d=>d.id===s.dept);return r.jsxs("tr",{onClick:()=>n(s.id),children:[r.jsx("td",{style:{color:"var(--text3)",fontFamily:"var(--font-mono)",fontSize:10},children:i+1}),r.jsx("td",{children:r.jsx("span",{style:{color:(o==null?void 0:o.color)||"var(--text2)",fontWeight:500},children:s.dept})}),r.jsxs("td",{children:[r.jsx("div",{style:{fontWeight:500},children:s.name}),r.jsx("div",{style:{fontSize:10,color:"var(--text3)"},children:s.sub})]}),r.jsx("td",{children:r.jsx(Lg,{status:s.status})}),r.jsx("td",{style:{color:"var(--text3)",fontSize:11},children:s.notes||"—"}),r.jsx("td",{style:{color:"var(--text3)",fontFamily:"var(--font-mono)",fontSize:10},children:s.updated||"—"})]},s.id)})})]})}function Mg({selectedStep:e,activityLog:t,selectedOrder:n}){var l,s,i;const a=e?Mt.find(o=>o.id===e.dept):null;return r.jsxs("div",{className:"right-panel",children:[r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Selected Step"}),e?r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:8,color:(a==null?void 0:a.color)||"var(--text)"},children:e.name}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Department"}),r.jsx("span",{className:"detail-val",style:{color:(a==null?void 0:a.color)||"inherit"},children:e.dept})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Status"}),r.jsx("span",{className:`step-status-badge badge-${e.status}`,style:{marginTop:0},children:e.status.toUpperCase()})]}),e.notes&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Notes"}),r.jsx("span",{className:"detail-val",style:{color:"var(--text2)",maxWidth:130,textAlign:"right",wordBreak:"break-word"},children:e.notes})]})]}):r.jsx("div",{className:"empty-detail",children:"Click any step to see details."})]}),n?r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Order Overview"}),r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:4,fontFamily:"var(--font-mono)",fontSize:13},children:n.order_number}),n.company_name&&r.jsxs("div",{style:{color:"var(--text2)",fontSize:11,marginBottom:12},children:["🏢 ",n.company_name]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Priority"}),r.jsx("span",{className:`priority-badge ${((l=n.priority)==null?void 0:l.toLowerCase())||"medium"}`,style:{fontSize:10},children:n.priority||"Medium"})]}),n.po_number&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"PO Number"}),r.jsx("span",{className:"detail-val",children:n.po_number})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Order Date"}),r.jsx("span",{className:"detail-val",children:n.order_date?new Date(n.order_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"N/A"})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Delivery"}),r.jsx("span",{className:"detail-val",style:{color:"var(--accent)"},children:n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"TBD"})]}),n.packaging_type&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Packaging"}),r.jsxs("span",{className:"detail-val",style:{color:"var(--purple)"},children:[n.packaging_type==="Wooden Packaging"?"🪵":"🫧"," ",n.packaging_type]})]}),((s=n.units)==null?void 0:s.length)>0&&r.jsxs("div",{style:{marginTop:12,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsxs("span",{className:"detail-key",style:{display:"block",marginBottom:8},children:["Units (",n.units.length,")"]}),r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:4},children:[n.units.slice(0,12).map(o=>r.jsx("span",{style:{fontSize:9,padding:"2px 5px",borderRadius:3,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontFamily:"var(--font-mono)"},children:o.short_serial},o.id)),n.units.length>12&&r.jsxs("span",{style:{fontSize:9,color:"var(--text3)",padding:"2px 4px"},children:["+",n.units.length-12," more"]})]})]}),((i=n.documents)==null?void 0:i.filter(o=>o.doc_type!=="TaskUpload").length)>0&&r.jsxs("div",{style:{marginTop:10,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsx("span",{className:"detail-key",style:{display:"block",marginBottom:6},children:"Documents"}),n.documents.filter(o=>o.doc_type!=="TaskUpload").map(o=>r.jsx("div",{style:{fontSize:11,marginBottom:3},children:r.jsxs("a",{href:`http://localhost:5000/uploads/${o.file_path.split(/[/\\]/).pop()}?token=${localStorage.getItem("token")}`,target:"_blank",rel:"noopener noreferrer",style:{color:"var(--blue)",textDecoration:"none"},children:["📄 ",o.file_name]})},o.id))]})]})]}):null,r.jsxs("div",{className:"panel-section",style:{flex:1},children:[r.jsxs("div",{className:"panel-sec-title",style:{display:"flex",alignItems:"center",gap:6},children:[r.jsx(np,{size:10}),"Activity Log"]}),r.jsxs("div",{id:"activityLog",style:{maxHeight:280,overflowY:"auto"},children:[t.length===0&&r.jsx("div",{className:"empty-detail",children:"No activity recorded yet."}),t.slice(0,50).map((o,d)=>{var f;const p=((f=Mt.find(h=>h.id===o.dept))==null?void 0:f.color)||"var(--text2)";return r.jsxs("div",{className:"log-entry",children:[r.jsx("div",{className:"log-time",children:o.time}),r.jsxs("div",{className:"log-text",children:[r.jsxs("span",{className:"log-dept",style:{color:p},children:["[",o.dept,"]"]})," ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:600},children:o.username}),": ",o.text]})]},d)})]})]})]})}function Rg({step:e,isOpen:t,onClose:n,onSave:a,onDelete:l,userRole:s,selectedOrder:i}){const[o,d]=m.useState("pending"),[p,f]=m.useState(""),[h,x]=m.useState(null),[k,j]=m.useState(""),[w,_]=m.useState({layout:!1,electrical:!1,bom:!1}),[g,u]=m.useState(0),[c,v]=m.useState([]),[N,P]=m.useState("details"),[z,D]=m.useState(null),E=["Admin","Manager"].includes(s),T=e?["Admin","Manager"].includes(s)||e.dept===s:!1;if(m.useEffect(()=>{if(e){d(e.status),f(e.notes||""),j(e.dispatch_date||""),x(null),_({layout:!1,electrical:!1,bom:!1}),u(0),P("details"),D(null);try{const M=Array.isArray(e.custom_fields)?e.custom_fields:JSON.parse(e.custom_fields||"[]");v(Array.isArray(M)?M:[])}catch{v([])}}},[e]),!t||!e)return null;const H=async()=>{if(!T)return;if(e.requires_upload&&o==="done"&&g===0){alert("You must upload at least one document to complete this task.");return}D(null);const M=await a({status:o,notes:p,qcFailTarget:h,dispatchDate:k,checklist:w,custom_fields:c});M&&D(M)},te=(M,G)=>{v(V=>V.map((B,S)=>S===M?{...B,value:G}:B))},K=M=>{M.target.className==="modal-overlay open"&&n()},J=(M,G)=>{switch(M.type){case"Text":return r.jsx("input",{type:"text",className:"form-input",value:M.value||"",onChange:V=>te(G,V.target.value),placeholder:`Enter ${M.label}...`,disabled:!T});case"Number":return r.jsx("input",{type:"number",className:"form-input",value:M.value||"",onChange:V=>te(G,V.target.value),disabled:!T});case"Date":return r.jsx("input",{type:"date",className:"form-input",value:M.value||"",onChange:V=>te(G,V.target.value),disabled:!T});case"Yes/No":return r.jsx("div",{style:{display:"flex",gap:"12px",marginTop:"4px"},children:["Yes","No"].map(V=>r.jsx("button",{type:"button",onClick:()=>T&&te(G,V),style:{padding:"6px 20px",borderRadius:"6px",border:"1px solid",cursor:T?"pointer":"default",fontSize:"13px",fontWeight:"600",background:M.value===V?V==="Yes"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)":"transparent",borderColor:M.value===V?V==="Yes"?"#10b981":"#ef4444":"#444",color:M.value===V?V==="Yes"?"#10b981":"#ef4444":"#888",opacity:!T&&M.value!==V?.4:1},children:V},V))});case"Dropdown":return r.jsxs("select",{className:"form-select",value:M.value||"",onChange:V=>te(G,V.target.value),disabled:!T,children:[r.jsx("option",{value:"",children:"-- Select --"}),(M.options||[]).map(V=>r.jsx("option",{value:V,children:V},V))]});default:return r.jsx("input",{type:"text",className:"form-input",value:M.value||"",onChange:V=>te(G,V.target.value),placeholder:`Enter ${M.label}...`,disabled:!T})}};return r.jsxs("div",{className:"modal-overlay open",onClick:K,children:[r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:e.name}),r.jsxs("div",{className:"modal-sub",children:[e.dept," — ",e.sub]})]}),r.jsx("button",{className:"modal-close",onClick:n,children:"✕"})]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid #333",padding:"0 24px"},children:["details",...c.length>0?["fields"]:[],"documents"].map(M=>r.jsxs("button",{onClick:()=>P(M),style:{background:"transparent",border:"none",borderBottom:N===M?"2px solid #3b82f6":"2px solid transparent",color:N===M?"#60a5fa":"#888",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:N===M?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[M==="fields"?"Form Fields":M.charAt(0).toUpperCase()+M.slice(1),M==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:c.length})]},M))}),r.jsxs("div",{className:"modal-body",children:[N==="details"&&r.jsxs(r.Fragment,{children:[!T&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px"},children:"ℹ️"}),r.jsxs("span",{children:[r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:e.dept})," department."]})]}),z&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"13px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px",flexShrink:0},children:"⛔"}),r.jsx("span",{style:{flex:1},children:z}),r.jsx("button",{onClick:()=>D(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"16px",padding:"0",lineHeight:1},children:"✕"})]}),i&&e.order_fields&&e.order_fields.length>0&&r.jsxs("div",{style:{marginBottom:"16px",padding:"12px 16px",background:"rgba(59,130,246,0.05)",border:"1px solid rgba(59,130,246,0.15)",borderRadius:"8px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"#3b82f6",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"10px"},children:"Order Reference"}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))",gap:"8px"},children:e.order_fields.map(M=>{const G={order_number:"Order #",company_name:"Company",delivery_date:"Delivery Date",po_number:"PO Number",packaging_type:"Packaging",priority:"Priority",notes:"Order Notes"};let V=i[M];return M==="delivery_date"&&V&&(V=new Date(V).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})),r.jsxs("div",{style:{background:"#111",borderRadius:"6px",padding:"8px 10px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"#555",marginBottom:"3px"},children:G[M]||M}),r.jsx("div",{style:{fontSize:"13px",color:"#ddd",fontWeight:"500"},children:V||"—"})]},M)})})]}),e.special==="sales"&&s==="Sales"&&r.jsxs("div",{className:"sales-action-box",children:[r.jsx("div",{className:"action-label",children:"Action Required:"}),r.jsx("div",{className:"action-text",children:"Initialize the order to generate unique unit IDs and upload primary documents."}),r.jsx("button",{className:"action-btn",onClick:()=>{n(),window.dispatchEvent(new CustomEvent("setView",{detail:"new-order"}))},children:"Go to Order Creation"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Status"}),T?r.jsxs("select",{className:"form-select",value:o,onChange:M=>d(M.target.value),children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"review",children:"Under Review"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${(Le[o]||Le.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:(Le[o]||Le.pending).label})})]}),e.special==="qc"&&r.jsxs("div",{id:"qcFailArea",children:[r.jsx("label",{style:{fontSize:10,color:"var(--text3)",display:"block",marginBottom:6},children:"If QC Fail — return to:"}),T?r.jsxs("div",{className:"qc-options",children:[r.jsxs("div",{className:`qc-opt${h==="production"?" selected":""}`,onClick:()=>T&&x("production"),style:{cursor:T?"pointer":"default"},children:["↩ Production",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Rework"})]}),r.jsxs("div",{className:`qc-opt${h==="design"?" selected":""}`,onClick:()=>T&&x("design"),style:{cursor:T?"pointer":"default"},children:["↩ Design",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Re-check"})]})]}):r.jsx("div",{style:{fontSize:"13px",color:"#eee",background:"#111",padding:"8px 12px",borderRadius:"6px"},children:h?`↩ Returned to ${h.charAt(0).toUpperCase()+h.slice(1)}`:"No fail action selected"})]}),e.special==="design"&&r.jsxs("div",{className:"design-checklist",children:[r.jsx("div",{className:"design-checklist-title",children:"Simultaneous Release Checklist"}),T?r.jsxs(r.Fragment,{children:[r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:w.layout,onChange:M=>_({...w,layout:M.target.checked})})," Panel Layout (for Fitter)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:w.electrical,onChange:M=>_({...w,electrical:M.target.checked})})," Electrical Design (for Wireman)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:w.bom,onChange:M=>_({...w,bom:M.target.checked})})," BOM Released to Purchase & Stores"]})]}):r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px"},children:[r.jsxs("div",{children:[w.layout?"✅":"❌"," Panel Layout (for Fitter)"]}),r.jsxs("div",{children:[w.electrical?"✅":"❌"," Panel Design (for Wireman)"]}),r.jsxs("div",{children:[w.bom?"✅":"❌"," BOM Released to Purchase & Stores"]})]})]}),e.special==="dispatch"&&r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirmed Dispatch Date"}),T?r.jsx("input",{type:"date",className:"form-input",value:k,onChange:M=>j(M.target.value)}):r.jsx("div",{style:{fontSize:"14px",color:"#ddd",background:"#111",padding:"8px 12px",borderRadius:"6px"},children:k?new Date(k).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"Not set"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Notes / Remarks"}),T?r.jsx("textarea",{className:"form-textarea",placeholder:"Add notes…",value:p,onChange:M=>f(M.target.value)}):r.jsx("div",{style:{fontSize:"13px",color:"#bbb",fontStyle:"italic",background:"#111",padding:"10px 14px",borderRadius:"6px",border:"1px solid #222",minHeight:"40px",whiteSpace:"pre-wrap"},children:p||"No notes or remarks added."})]})]}),N==="fields"&&c.length>0&&r.jsxs("div",{children:[r.jsx("div",{style:{color:"#888",fontSize:"12px",marginBottom:"16px"},children:T?"Fill in the required information for this task.":"Information filled in for this task."}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:c.map((M,G)=>r.jsxs("div",{style:{background:"#111",border:"1px solid #2a2a2a",borderRadius:"8px",padding:"12px 16px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("span",{style:{color:"#eee",fontSize:"13px",fontWeight:"600"},children:M.label}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"10px",color:"#555",textTransform:"uppercase",background:"#222",padding:"1px 5px",borderRadius:"3px"},children:M.type})]}),T?J(M,G):r.jsx("div",{style:{fontSize:"13px",color:"#ddd",fontWeight:"500",marginTop:"4px"},children:M.type==="Yes/No"?M.value==="Yes"||M.value===!0?"✅ Yes":"❌ No":M.value||"—"})]},G))})]}),N==="documents"&&r.jsxs("div",{children:[e.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"⚠️ This task requires at least one document to be marked as Done."}),r.jsx(dl,{entityType:"Step",entityId:e.id,initialDocs:[],onDocsUpdate:M=>u(M.length),readOnly:!T,defaultDocType:e.default_doc_type||"General",userRole:s})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"24px",paddingTop:"16px",borderTop:"1px solid #222"},children:[E&&T?r.jsx("button",{className:"vbtn",style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444"},onClick:()=>l(e.id),children:"Delete Task"}):r.jsx("div",{}),r.jsx("div",{style:{display:"flex",gap:"12px"},children:T?r.jsxs(r.Fragment,{children:[r.jsx("button",{className:"btn-cancel",onClick:n,children:"Cancel"}),r.jsx("button",{className:"btn-save",onClick:H,children:"Update Status"})]}):r.jsx("button",{className:"btn-cancel",onClick:n,style:{minWidth:"100px"},children:"Close"})})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .sales-action-box {
          background: rgba(20, 184, 166, 0.1);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .action-label { color: var(--teal); font-size: 11px; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; }
        .action-text { color: #ccc; font-size: 13px; margin-bottom: 12px; line-height: 1.4; }
        .action-btn {
          background: var(--teal);
          color: #000;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        }
        .action-btn:hover { opacity: 0.9; }
      `}})]})}function Og(){const[e,t]=m.useState(""),[n,a]=m.useState(""),[l,s]=m.useState(!1),[i,o]=m.useState(""),[d,p]=m.useState(!1),f=Zi();m.useEffect(()=>{localStorage.getItem("token")&&f("/dashboard")},[f]);const h=async x=>{x.preventDefault(),o(""),p(!0);try{const k=await fetch("http://localhost:5000/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:n})}),j=await k.json();if(!k.ok)throw new Error(j.error||"Login failed");localStorage.setItem("token",j.token),localStorage.setItem("user",JSON.stringify(j.user)),f("/dashboard")}catch(k){o(k.message)}finally{p(!1)}};return r.jsx("div",{className:"auth-container",children:r.jsxs("div",{className:"auth-card",children:[r.jsxs("div",{className:"auth-header",children:[r.jsx("div",{className:"auth-logo",children:r.jsx(sg,{size:32,className:"neon-text"})}),r.jsx("h1",{children:"Welcome Back"}),r.jsx("p",{children:"Sign in to access your ERP dashboard"})]}),r.jsxs("form",{onSubmit:h,className:"auth-form",children:[i&&r.jsxs("div",{className:"auth-error",children:[r.jsx(ol,{size:18}),r.jsx("span",{children:i})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"email",children:"Email Address / Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(lp,{className:"input-icon",size:18}),r.jsx("input",{id:"email",type:"text",placeholder:"email or username",value:e,onChange:x=>t(x.target.value),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"password",children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(xr,{className:"input-icon",size:18}),r.jsx("input",{id:"password",type:l?"text":"password",placeholder:"••••••••",value:n,onChange:x=>a(x.target.value),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>s(!l),"aria-label":l?"Hide password":"Show password",children:l?r.jsx(hr,{size:18}):r.jsx(mr,{size:18})})]})]}),r.jsx("button",{type:"submit",className:"auth-button",disabled:d,children:d?r.jsx(gr,{className:"animate-spin"}):"Sign In"})]})]})})}function Bg(){const[e,t]=m.useState([]),[n,a]=m.useState(!0),[l,s]=m.useState(null),[i,o]=m.useState(!1),[d,p]=m.useState({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),[f,h]=m.useState(!1),[x,k]=m.useState(""),[j,w]=m.useState(!1),[_,g]=m.useState(!1),[u,c]=m.useState(null),[v,N]=m.useState(!1),[P,z]=m.useState({username:"",email:"",role:"",password:"",confirmPassword:""}),[D,E]=m.useState(!1),[T,H]=m.useState(!1),[te,K]=m.useState(""),[J,M]=m.useState(!1),[G,V]=m.useState(null),[B,S]=m.useState(!1),[I,F]=m.useState(""),Z=localStorage.getItem("token"),ye=["Admin","Manager","Sales","Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Viewer"];m.useEffect(()=>{de()},[]);const de=async()=>{try{const R=await fetch("http://localhost:5000/api/users",{headers:{Authorization:`Bearer ${Z}`}}),ee=await R.json();R.ok&&t(ee)}catch(R){console.error("Failed to fetch users",R)}finally{a(!1)}},le=async R=>{if(R.preventDefault(),h(!0),k(""),d.password!==d.confirmPassword){k("Passwords do not match"),h(!1);return}try{const{confirmPassword:ee,...Y}=d,C=await fetch("http://localhost:5000/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${Z}`},body:JSON.stringify(Y)}),O=await C.json();C.ok?(o(!1),p({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),w(!1),g(!1),de()):k(O.error||"Failed to create user")}catch{k("Network error")}finally{h(!1)}},ce=R=>{c(R),z({username:R.username,email:R.email,role:R.role,password:"",confirmPassword:""}),K(""),E(!1),H(!1),N(!0)},se=()=>{c(null),N(!1),E(!1),H(!1)},y=async R=>{if(R.preventDefault(),M(!0),K(""),P.password&&P.password!==P.confirmPassword){K("Passwords do not match"),M(!1);return}try{const{confirmPassword:ee,...Y}=P,C=await fetch(`http://localhost:5000/api/users/${u.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${Z}`},body:JSON.stringify(Y)}),O=await C.json();C.ok?(N(!1),c(null),de()):K(O.error||"Failed to update user")}catch{K("Network error")}finally{M(!1)}},U=async()=>{if(G){S(!0),F("");try{const R=await fetch(`http://localhost:5000/api/users/${G.id}`,{method:"DELETE",headers:{Authorization:`Bearer ${Z}`}}),ee=await R.json();R.ok?(V(null),de()):F(ee.error||"Failed to delete user")}catch{F("Network error")}finally{S(!1)}}};return n?r.jsxs("div",{className:"loading-state",children:[r.jsx(gr,{className:"animate-spin"})," Loading User Directory..."]}):r.jsxs("div",{className:"user-mgmt",children:[r.jsxs("div",{className:"mgmt-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(sp,{size:20}),r.jsx("h2",{children:"User Management Directory"}),r.jsxs("span",{className:"badge-count",children:[e.length," Total Accounts"]})]}),r.jsxs("button",{className:"add-user-btn",onClick:()=>o(!i),children:[r.jsx(yg,{size:16}),i?"Cancel":"Add New User"]})]}),i&&r.jsx("div",{className:"add-user-form-container",children:r.jsxs("form",{onSubmit:le,className:"add-user-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(eo,{size:14,className:"input-icon"}),r.jsx("input",{type:"text",placeholder:"johndoe",value:d.username,onChange:R=>p({...d,username:R.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Email Address"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(lp,{size:14,className:"input-icon"}),r.jsx("input",{type:"email",placeholder:"john@example.com",value:d.email,onChange:R=>p({...d,email:R.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(xr,{size:14,className:"input-icon"}),r.jsx("input",{type:j?"text":"password",placeholder:"••••••••",value:d.password,onChange:R=>p({...d,password:R.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>w(!j),"aria-label":j?"Hide password":"Show password",children:j?r.jsx(hr,{size:14}):r.jsx(mr,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Confirm Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(xr,{size:14,className:"input-icon"}),r.jsx("input",{type:_?"text":"password",placeholder:"••••••••",value:d.confirmPassword,onChange:R=>p({...d,confirmPassword:R.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>g(!_),"aria-label":_?"Hide password":"Show password",children:_?r.jsx(hr,{size:14}):r.jsx(mr,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Assign Role"}),r.jsx("select",{className:"auth-select",value:d.role,onChange:R=>p({...d,role:R.target.value}),children:ye.map(R=>r.jsx("option",{value:R,children:R},R))})]})]}),x&&r.jsx("div",{className:"form-error",children:x}),r.jsx("button",{type:"submit",className:"submit-user-btn",disabled:f,children:f?r.jsx(gr,{size:16,className:"animate-spin"}):"Create User Account"})]})}),r.jsx("div",{className:"user-table-container",children:r.jsxs("table",{className:"user-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Username"}),r.jsx("th",{children:"Email"}),r.jsx("th",{children:"Current Role"}),r.jsx("th",{children:"Actions"})]})}),r.jsx("tbody",{children:e.map(R=>r.jsxs("tr",{children:[r.jsx("td",{className:"u-name",children:R.username}),r.jsx("td",{className:"u-email",children:R.email}),r.jsx("td",{children:r.jsx("span",{className:`role-badge role-${R.role.toLowerCase()}`,children:R.role})}),r.jsx("td",{children:r.jsxs("div",{className:"action-buttons-cell",style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsxs("button",{className:"vbtn",onClick:()=>ce(R),style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(mg,{size:14}),"Edit"]}),r.jsxs("button",{className:"vbtn",onClick:()=>{F(""),V(R)},style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px",borderColor:"rgba(239,68,68,0.3)",color:"var(--red)"},children:[r.jsx(xg,{size:14}),"Delete"]})]})})]},R.id))})]})}),v&&u&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",children:"Edit User Details"}),r.jsxs("p",{className:"modal-sub",children:["Modify details for account: ",u.username]})]}),r.jsx("button",{className:"modal-close",onClick:se,children:r.jsx(Yr,{size:18})})]}),r.jsxs("form",{onSubmit:y,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Username"}),r.jsx("input",{type:"text",className:"form-input",value:P.username,onChange:R=>z({...P,username:R.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Email Address"}),r.jsx("input",{type:"email",className:"form-input",value:P.email,onChange:R=>z({...P,email:R.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Role"}),r.jsx("select",{className:"form-select",value:P.role,onChange:R=>z({...P,role:R.target.value}),children:ye.map(R=>r.jsx("option",{value:R,children:R},R))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"New Password (leave blank to keep current)"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(xr,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:D?"text":"password",className:"form-input",placeholder:"••••••••",value:P.password,onChange:R=>z({...P,password:R.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>E(!D),style:{right:"12px"},"aria-label":D?"Hide password":"Show password",children:D?r.jsx(hr,{size:14}):r.jsx(mr,{size:14})})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirm New Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(xr,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:T?"text":"password",className:"form-input",placeholder:"••••••••",value:P.confirmPassword||"",onChange:R=>z({...P,confirmPassword:R.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>H(!T),style:{right:"12px"},"aria-label":T?"Hide password":"Show password",children:T?r.jsx(hr,{size:14}):r.jsx(mr,{size:14})})]})]}),te&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:te}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:se,disabled:J,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:J,children:J?r.jsx(gr,{size:16,className:"animate-spin"}):"Save Changes"})]})]})]})}),G&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",style:{color:"var(--red)"},children:"Delete User Account"}),r.jsx("p",{className:"modal-sub",children:"Are you sure you want to permanently delete this user?"})]}),r.jsx("button",{className:"modal-close",onClick:()=>V(null),children:r.jsx(Yr,{size:18})})]}),r.jsxs("div",{className:"modal-body",children:[r.jsxs("p",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:"1.5"},children:["Deleting ",r.jsx("strong",{children:G.username})," (",G.email,") will remove their account immediately. Any documents uploaded, orders created, or panels assigned to this user will have their references cleared safely."]}),I&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:I}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>V(null),disabled:B,children:"Cancel"}),r.jsx("button",{type:"button",className:"btn-save",style:{background:"var(--red)",color:"#fff"},onClick:U,disabled:B,children:B?r.jsx(gr,{size:16,className:"animate-spin"}):"Delete Account"})]})]})]})})]})}function Ag({onOrderCreated:e}){const[t,n]=m.useState({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",lineItems:[{line_item_number:"0001",material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),[a,l]=m.useState([]),[s,i]=m.useState({po:null,quotation:null,approved_docs:[]}),[o,d]=m.useState(!1),p=localStorage.getItem("token");m.useEffect(()=>{fetch("http://localhost:5000/api/companies",{headers:{Authorization:`Bearer ${p}`}}).then(u=>u.json()).then(u=>l(u)).catch(u=>console.error(u))},[p]);const f=u=>{const{name:c,value:v}=u.target;n(N=>({...N,[c]:v}))},h=(u,c,v)=>{n(N=>{const P=[...N.lineItems];if(P[u][c]=v,c==="quantity"||c==="unit_price"){const z=parseFloat(P[u].quantity)||0,D=parseFloat(P[u].unit_price)||0;P[u].total_price=(z*D).toFixed(2)}return{...N,lineItems:P}})},x=()=>{n(u=>{const c=u.lineItems.length>0?parseInt(u.lineItems[u.lineItems.length-1].line_item_number):0,v=String(c+1).padStart(4,"0");return{...u,lineItems:[...u.lineItems,{line_item_number:v,material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}})},k=u=>{n(c=>({...c,lineItems:c.lineItems.filter((v,N)=>N!==u)}))},j=(u,c)=>{if(c==="approved_docs"){const v=Array.from(u.target.files);i(N=>{const z=[...N.approved_docs||[],...v];return z.length>20?(alert("Maximum 20 files allowed"),N):{...N,[c]:z}}),u.target.value=""}else i(v=>({...v,[c]:u.target.files[0]}))},w=u=>{i(c=>({...c,approved_docs:c.approved_docs.filter((v,N)=>N!==u)}))},_=u=>{i(v=>({...v,[u]:null}));const c=document.getElementById(`file-input-${u}`);c&&(c.value="")},g=async u=>{if(u.preventDefault(),!t.company_location_id||t.lineItems.length===0){alert("Please select a company and add at least one line item.");return}d(!0);const c=new FormData;c.append("company_location_id",t.company_location_id),c.append("order_date",t.order_date),c.append("delivery_date",t.delivery_date),c.append("notes",t.notes),c.append("priority",t.priority),c.append("po_number",t.po_number),c.append("end_client_name",t.end_client_name||""),c.append("lineItems",JSON.stringify(t.lineItems)),s.po&&c.append("po",s.po),s.quotation&&c.append("quotation",s.quotation),s.approved_docs&&s.approved_docs.length>0&&s.approved_docs.forEach(v=>c.append("approved",v));try{const v=await fetch("http://localhost:5000/api/orders",{method:"POST",headers:{Authorization:`Bearer ${p}`},body:c});if(v.ok){const N=await v.json();alert(N.message),e&&e(N.order),n({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",lineItems:[{line_item_number:"0001",material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),i({po:null,quotation:null,approved_docs:[]})}else{const N=await v.json();alert(N.error||"Failed to create order")}}catch(v){console.error("Submit error:",v),alert("Network error during order creation")}finally{d(!1)}};return r.jsxs("div",{className:"order-creation-container",children:[r.jsxs("div",{className:"form-card",children:[r.jsx("h2",{className:"form-title",children:"Create New Order"}),r.jsx("p",{className:"form-subtitle",children:"Fill in the details to generate an Internal Order Number and Unit IDs."}),r.jsxs("form",{onSubmit:g,className:"order-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Select Company & Location"}),r.jsxs("select",{name:"company_location_id",value:t.company_location_id,onChange:f,className:"form-select",children:[r.jsx("option",{value:"",children:"-- None --"}),a.map(u=>{var c;return r.jsx("optgroup",{label:u.name,children:(c=u.locations)==null?void 0:c.map(v=>r.jsxs("option",{value:v.id,children:[u.name," - ",v.city]},v.id))},u.id)})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Order Date"}),r.jsx("input",{type:"date",name:"order_date",value:t.order_date,onChange:f})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Overall Delivery Date"}),r.jsx("input",{type:"date",name:"delivery_date",value:t.delivery_date,onChange:f})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{name:"priority",value:t.priority,onChange:f,className:"form-input",children:[r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Customer PO Number"}),r.jsx("input",{type:"text",name:"po_number",value:t.po_number,onChange:f})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Dispatch / Packaging"}),r.jsxs("select",{name:"packaging_type",value:t.packaging_type,onChange:f,className:"form-input",children:[r.jsx("option",{value:"",children:"-- Select Packaging Type --"}),r.jsx("option",{value:"Wooden Packaging",children:"Wooden Packaging"}),r.jsx("option",{value:"Foam Packaging",children:"Foam Packaging"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"End Client Name (Optional)"}),r.jsx("input",{type:"text",name:"end_client_name",value:t.end_client_name,onChange:f})]}),r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Overall Order Notes"}),r.jsx("textarea",{name:"notes",value:t.notes,onChange:f})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"32px",marginBottom:"32px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[r.jsx("h3",{className:"section-title",style:{margin:0},children:"Line Items"}),r.jsx("button",{type:"button",className:"vbtn",style:{background:"#3b82f6",fontSize:"12px",padding:"6px 12px"},onClick:x,children:"+ Add Line Item"})]}),t.lineItems.map((u,c)=>r.jsxs("div",{style:{background:"#111",padding:"20px",borderRadius:"12px",border:"1px solid #333",marginBottom:"16px",position:"relative"},children:[t.lineItems.length>1&&r.jsx("button",{type:"button",onClick:()=>k(c),style:{position:"absolute",top:"16px",right:"16px",background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:"16px"},children:"✕"}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"100px 1fr 1fr 1fr",gap:"16px",marginBottom:"16px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Line Item #"}),r.jsx("input",{type:"text",className:"form-input",value:u.line_item_number,onChange:v=>h(c,"line_item_number",v.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Material Description"}),r.jsx("input",{type:"text",className:"form-input",value:u.material_description,onChange:v=>h(c,"material_description",v.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Part Number *"}),r.jsx("input",{type:"text",className:"form-input",value:u.part_number,onChange:v=>h(c,"part_number",v.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Panel Type / Size"}),r.jsx("input",{type:"text",className:"form-input",value:u.panel_type_size,onChange:v=>h(c,"panel_type_size",v.target.value)})]})]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"100px 100px 150px 150px 150px",gap:"16px",marginBottom:"16px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Quantity *"}),r.jsx("input",{type:"number",className:"form-input",min:"1",value:u.quantity,onChange:v=>h(c,"quantity",v.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Unit"}),r.jsx("input",{type:"text",className:"form-input",value:u.unit,onChange:v=>h(c,"unit",v.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Unit Price *"}),r.jsx("input",{type:"number",step:"0.01",className:"form-input",value:u.unit_price,onChange:v=>h(c,"unit_price",v.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Total Price"}),r.jsx("input",{type:"number",step:"0.01",className:"form-input",value:u.total_price,onChange:v=>h(c,"total_price",v.target.value),readOnly:!0,style:{background:"#222"}})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Delivery Date"}),r.jsx("input",{type:"date",className:"form-input",value:u.delivery_date,onChange:v=>h(c,"delivery_date",v.target.value)})]})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Item Notes"}),r.jsx("input",{type:"text",className:"form-input",value:u.notes,onChange:v=>h(c,"notes",v.target.value)})]})]},c))]}),r.jsxs("div",{className:"file-upload-section",children:[r.jsx("h3",{className:"section-title",children:"Required Documents"}),r.jsxs("div",{style:{fontSize:"11px",color:"#666",marginBottom:"16px"},children:["⚠️ Only ",r.jsx("strong",{style:{color:"#aaa"},children:"one"})," PO copy and one Quotation allowed. To replace after submission, delete the existing file first."]}),r.jsxs("div",{className:"file-grid",children:[r.jsxs("div",{className:"file-input-wrapper",children:[r.jsx("label",{children:"Customer PO Copy"}),s.po?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"#1a1a1a",border:"1px solid #333",borderRadius:"6px",padding:"8px 10px"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981"},children:"✔"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:s.po.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:u=>j(u,"po")})]}),r.jsx("button",{type:"button",onClick:()=>_("po"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",border:"1px dashed #444",borderRadius:"6px",padding:"10px",cursor:"pointer",color:"#888",fontSize:"12px"},children:["📎 Choose file…",r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:u=>j(u,"po")})]})]}),r.jsxs("div",{className:"file-input-wrapper",children:[r.jsx("label",{children:"Quotation"}),s.quotation?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"#1a1a1a",border:"1px solid #333",borderRadius:"6px",padding:"8px 10px"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981"},children:"✔"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:s.quotation.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:u=>j(u,"quotation")})]}),r.jsx("button",{type:"button",onClick:()=>_("quotation"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",border:"1px dashed #444",borderRadius:"6px",padding:"10px",cursor:"pointer",color:"#888",fontSize:"12px"},children:["📎 Choose file…",r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:u=>j(u,"quotation")})]})]}),r.jsxs("div",{className:"file-input-wrapper",style:{alignItems:"flex-start"},children:[r.jsx("label",{children:"Approved Documents (Up to 20)"}),r.jsx("input",{type:"file",multiple:!0,onChange:u=>j(u,"approved_docs")}),s.approved_docs&&s.approved_docs.length>0&&r.jsx("div",{className:"selected-files-list",children:s.approved_docs.map((u,c)=>r.jsxs("div",{className:"selected-file-item",children:[r.jsx("span",{className:"file-name-hint",children:u.name}),r.jsx("button",{type:"button",onClick:()=>w(c),className:"remove-file-btn",children:"✕"})]},c))})]})]})]}),r.jsx("div",{className:"form-actions",children:r.jsx("button",{type:"submit",className:"submit-btn",disabled:o,children:o?"Creating Order...":"Initialize Order"})})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .order-creation-container {
          padding: 24px;
          max-width: 900px;
          margin: 0 auto;
        }
        .form-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .form-title { margin: 0 0 8px 0; color: #fff; font-size: 24px; }
        .form-subtitle { color: #888; font-size: 14px; margin-bottom: 32px; }
        
        .order-form { display: flex; flex-direction: column; gap: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .full-width { grid-column: span 2; }
        
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { color: #bbb; font-size: 13px; font-weight: 500; }
        .form-group input, .form-group textarea {
          background: #0f0f0f;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
          color: #eee;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: #3b82f6;
          outline: none;
        }
        .form-group textarea { min-height: 80px; resize: vertical; }
        
        .file-upload-section {
          margin-top: 16px;
          padding-top: 24px;
          border-top: 1px solid #333;
        }
        .section-title { font-size: 16px; color: #fff; margin-bottom: 16px; }
        .file-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        
        .file-input-wrapper { 
          display: flex; flex-direction: column; gap: 12px;
          background: #111; border: 1px dashed #444; border-radius: 12px; padding: 20px;
          align-items: center; justify-content: center; text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .file-input-wrapper:hover { border-color: #3b82f6; background: #151515; }
        .file-input-wrapper label { color: #bbb; font-size: 13px; font-weight: 600; }
        .file-input-wrapper input[type="file"] {
          font-size: 12px; color: #888; max-width: 100%;
        }
        .file-name-hint { font-size: 12px; color: #3b82f6; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;}
        
        .selected-files-list {
          display: flex; flex-direction: column; gap: 4px; width: 100%;
          max-height: 120px; overflow-y: auto; padding-right: 4px; margin-top: 8px;
        }
        .selected-file-item {
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px;
        }
        .remove-file-btn {
          background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 12px; padding: 2px 6px;
        }
        .remove-file-btn:hover { color: #f87171; }
        
        .form-actions { margin-top: 16px; display: flex; justify-content: flex-end; }
        .submit-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.1s, background 0.2s;
        }
        .submit-btn:hover { background: #2563eb; transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}})]})}function Ug({onImportComplete:e}){var u,c,v,N,P;const[t,n]=m.useState(null),[a,l]=m.useState(!1),[s,i]=m.useState(!1),[o,d]=m.useState(null),p=m.useRef(null),f=localStorage.getItem("token"),h=z=>{z.preventDefault(),l(!0)},x=()=>l(!1),k=z=>{z.preventDefault(),l(!1);const D=z.dataTransfer.files[0];D&&j(D)},j=z=>{if(!z.name.match(/\.xlsx$/i)){alert("Only .xlsx files are supported. Please use the sample template.");return}n(z),d(null)},w=async()=>{if(t){i(!0),d(null);try{const z=new FormData;z.append("file",t);const E=await(await fetch("http://localhost:5000/api/orders/import",{method:"POST",headers:{Authorization:`Bearer ${f}`},body:z})).json();if(E.error){d({message:E.error,created:[],errors:[]});return}d(E),E.created&&E.created.length>0}catch{d({message:"Network error — could not reach the server. Is Docker running?",created:[],errors:[]})}finally{i(!1)}}},_=z=>{z.preventDefault(),window.location.href="http://localhost:5000/api/template/order_import_template.xlsx"},g=()=>{n(null),d(null),p.current&&(p.current.value="")};return r.jsxs("div",{className:"oi-container",children:[r.jsxs("div",{className:"oi-card",children:[r.jsxs("div",{className:"oi-header",children:[r.jsxs("div",{children:[r.jsx("h2",{className:"oi-title",children:"Bulk Order Import"}),r.jsxs("p",{className:"oi-subtitle",children:["Upload a filled Excel template to create multiple orders automatically. Each unique ",r.jsx("code",{children:"po_number"})," becomes one order."]})]}),r.jsx("a",{href:"#",onClick:_,className:"oi-download-btn",title:"Download the sample template",children:"⬇ Download Template"})]}),!o&&r.jsxs("div",{className:`oi-dropzone${a?" oi-dragging":""}${t?" oi-has-file":""}`,onDragOver:h,onDragLeave:x,onDrop:k,onClick:()=>{var z;return!t&&((z=p.current)==null?void 0:z.click())},children:[r.jsx("input",{ref:p,type:"file",accept:".xlsx",hidden:!0,onChange:z=>z.target.files[0]&&j(z.target.files[0])}),t?r.jsxs("div",{className:"oi-file-preview",children:[r.jsx("span",{className:"oi-file-icon",children:"📊"}),r.jsxs("div",{className:"oi-file-info",children:[r.jsx("span",{className:"oi-file-name",children:t.name}),r.jsxs("span",{className:"oi-file-size",children:[(t.size/1024).toFixed(1)," KB"]})]}),r.jsx("button",{className:"oi-clear-btn",onClick:z=>{z.stopPropagation(),g()},title:"Remove",children:"✕"})]}):r.jsxs("div",{className:"oi-drop-prompt",children:[r.jsx("div",{className:"oi-drop-icon",children:"📂"}),r.jsxs("div",{className:"oi-drop-text",children:["Drag & drop your ",r.jsx("strong",{children:".xlsx"})," file here"]}),r.jsx("div",{className:"oi-drop-sub",children:"or click to browse"})]})]}),!o&&r.jsx("div",{className:"oi-actions",children:r.jsx("button",{className:"oi-upload-btn",disabled:!t||s,onClick:w,children:s?r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"oi-spinner"})," Processing..."]}):"Import Orders"})}),!o&&r.jsxs("div",{className:"oi-instructions",children:[r.jsx("h3",{className:"oi-inst-title",children:"How to use"}),r.jsxs("ol",{className:"oi-inst-list",children:[r.jsx("li",{children:"Download the template using the button above."}),r.jsxs("li",{children:["Open the ",r.jsx("strong",{children:'"Import Template"'})," sheet and fill in your data."]}),r.jsxs("li",{children:["Each row = one line item. Rows with the same ",r.jsx("code",{children:"po_number"})," are grouped into one order."]}),r.jsxs("li",{children:["Company name & city must match entries in ",r.jsx("strong",{children:"Masters → Companies"}),"."]}),r.jsxs("li",{children:["Dates must be in ",r.jsx("strong",{children:"YYYY-MM-DD"})," format or a proper Excel date."]}),r.jsxs("li",{children:["Save as ",r.jsx("code",{children:".xlsx"})," and upload here."]})]}),r.jsxs("div",{className:"oi-field-ref",children:[r.jsx("h4",{children:"Required Fields"}),r.jsx("div",{className:"oi-field-grid",children:[{f:"company_name",r:!0,note:"Exact match in Masters"},{f:"company_city",r:!0,note:"Exact match in Masters"},{f:"order_date",r:!0,note:"YYYY-MM-DD"},{f:"delivery_date",r:!0,note:"YYYY-MM-DD"},{f:"po_number",r:!0,note:"Groups rows into one order"},{f:"priority",r:!0,note:"Low / Medium / High / Urgent"},{f:"material_description",r:!0,note:"Per line item"},{f:"quantity",r:!0,note:"Positive integer"},{f:"unit",r:!0,note:"e.g. Nos, Sets"},{f:"unit_price",r:!0,note:"Numeric, no ₹"},{f:"packaging_type",r:!1,note:"Wooden Packaging / Foam Packaging"},{f:"end_client_name",r:!1,note:"Optional end client name / site location"},{f:"order_notes",r:!1,note:"Optional"},{f:"part_number",r:!1,note:"Optional"},{f:"panel_type_size",r:!1,note:"e.g. 800x600"},{f:"line_item_delivery_date",r:!1,note:"Defaults to delivery_date"},{f:"line_item_notes",r:!1,note:"Optional"}].map(({f:z,r:D,note:E})=>r.jsxs("div",{className:"oi-field-row",children:[r.jsx("code",{className:"oi-field-name",children:z}),r.jsx("span",{className:`oi-badge ${D?"req":"opt"}`,children:D?"Required":"Optional"}),r.jsx("span",{className:"oi-field-note",children:E})]},z))})]})]}),o&&r.jsxs("div",{className:"oi-result",children:[r.jsxs("p",{className:`oi-result-msg ${((u=o.created)==null?void 0:u.length)>0?"success":"fail"}`,children:[((c=o.created)==null?void 0:c.length)>0?"✅":"⚠️"," ",o.message]}),((v=o.created)==null?void 0:v.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{children:"Created & Merged Orders"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Order Number"}),r.jsx("th",{children:"Units Added"}),r.jsx("th",{children:"Action Taken"})]})}),r.jsx("tbody",{children:o.created.map((z,D)=>r.jsxs("tr",{children:[r.jsx("td",{children:z.po_number}),r.jsx("td",{children:r.jsx("strong",{style:{color:"#60a5fa"},children:z.order_number})}),r.jsx("td",{children:z.units}),r.jsx("td",{children:r.jsx("span",{style:{background:z.is_appended?"#1e3a8a":"#064e3b",color:z.is_appended?"#60a5fa":"#34d399",fontSize:"11px",fontWeight:"bold",padding:"3px 8px",borderRadius:"4px",display:"inline-block"},children:z.is_appended?"Merged (Appended)":"Created (New)"})})]},D))})]})]}),((N=o.errors)==null?void 0:N.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{style:{color:"#f87171"},children:"Errors"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Reason"})]})}),r.jsx("tbody",{children:o.errors.map((z,D)=>r.jsxs("tr",{children:[r.jsx("td",{children:z.po_number}),r.jsx("td",{style:{color:"#f87171"},children:z.error})]},D))})]})]}),r.jsxs("div",{style:{display:"flex",gap:12,marginTop:20},children:[r.jsx("button",{className:"oi-upload-btn",onClick:g,children:"Import Another File"}),((P=o.created)==null?void 0:P.length)>0&&r.jsx("button",{className:"oi-upload-btn",style:{background:"#10b981"},onClick:()=>e==null?void 0:e(),children:"View Orders →"})]})]})]}),r.jsx("style",{children:`
        .oi-container { padding: 24px; max-width: 960px; margin: 0 auto; }
        .oi-card {
          background: #1a1a1a; border: 1px solid #2a2a2a;
          border-radius: 16px; padding: 32px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        /* Header */
        .oi-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; gap: 16px; }
        .oi-title  { margin: 0 0 6px; color: #fff; font-size: 22px; font-weight: 700; }
        .oi-subtitle { color: #888; font-size: 13px; margin: 0; line-height: 1.6; }
        .oi-subtitle code { background: #222; padding: 1px 5px; border-radius: 4px; color: #60a5fa; font-size: 12px; }
        .oi-download-btn {
          flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 6px;
          background: #1e3a5f; color: #60a5fa; border: 1px solid #2a5298;
          padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600;
          text-decoration: none; transition: background 0.2s;
          white-space: nowrap;
        }
        .oi-download-btn:hover { background: #2a4a7a; }

        /* Drop Zone */
        .oi-dropzone {
          border: 2px dashed #333; border-radius: 12px; padding: 40px 24px;
          text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 20px;
          background: #111;
        }
        .oi-dropzone:hover { border-color: #3b82f6; background: #131e35; }
        .oi-dragging  { border-color: #3b82f6 !important; background: #131e35 !important; }
        .oi-has-file  { cursor: default; border-color: #10b981 !important; background: #0d1f1a !important; }

        .oi-drop-icon { font-size: 42px; margin-bottom: 12px; }
        .oi-drop-text { color: #ccc; font-size: 15px; margin-bottom: 6px; }
        .oi-drop-sub  { color: #666; font-size: 12px; }

        .oi-file-preview { display: flex; align-items: center; gap: 14px; }
        .oi-file-icon { font-size: 36px; }
        .oi-file-info { flex: 1; text-align: left; }
        .oi-file-name { display: block; color: #fff; font-weight: 600; font-size: 14px; }
        .oi-file-size { display: block; color: #888; font-size: 12px; margin-top: 2px; }
        .oi-clear-btn {
          background: transparent; border: none; color: #ef4444;
          font-size: 18px; cursor: pointer; padding: 4px 8px;
        }
        .oi-clear-btn:hover { color: #f87171; }

        /* Actions */
        .oi-actions { display: flex; justify-content: flex-end; margin-bottom: 28px; }
        .oi-upload-btn {
          background: #3b82f6; color: #fff; border: none;
          padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.2s, transform 0.1s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .oi-upload-btn:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); }
        .oi-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .oi-spinner {
          width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Instructions */
        .oi-instructions { padding-top: 24px; border-top: 1px solid #222; }
        .oi-inst-title { color: #fff; font-size: 15px; margin: 0 0 14px; }
        .oi-inst-list { color: #aaa; font-size: 13px; line-height: 2; padding-left: 18px; margin: 0 0 24px; }
        .oi-inst-list strong { color: #ddd; }
        .oi-inst-list code { background: #222; padding: 1px 5px; border-radius: 4px; color: #60a5fa; font-size: 12px; }

        .oi-field-ref h4 { color: #fff; font-size: 14px; margin: 0 0 12px; }
        .oi-field-grid { display: flex; flex-direction: column; gap: 6px; }
        .oi-field-row {
          display: grid; grid-template-columns: 220px 80px 1fr; align-items: center;
          gap: 12px; padding: 6px 10px; border-radius: 6px; background: #111;
        }
        .oi-field-name { color: #60a5fa; font-size: 12px; }
        .oi-badge {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          padding: 2px 7px; border-radius: 4px; text-align: center;
        }
        .oi-badge.req { background: rgba(239,68,68,0.15); color: #f87171; }
        .oi-badge.opt { background: rgba(107,114,128,0.2); color: #9ca3af; }
        .oi-field-note { color: #888; font-size: 12px; }

        /* Results */
        .oi-result { padding-top: 24px; border-top: 1px solid #222; }
        .oi-result-msg { font-size: 15px; font-weight: 600; margin-bottom: 20px; }
        .oi-result-msg.success { color: #34d399; }
        .oi-result-msg.fail    { color: #f87171; }
        .oi-result-section { margin-bottom: 20px; }
        .oi-result-section h4 { color: #fff; font-size: 13px; margin: 0 0 10px; }
        .oi-result-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .oi-result-table th {
          text-align: left; padding: 8px 12px; color: #888; font-weight: 500;
          border-bottom: 1px solid #2a2a2a; font-size: 11px; text-transform: uppercase;
        }
        .oi-result-table td {
          padding: 10px 12px; color: #ccc; border-bottom: 1px solid #1a1a1a;
        }
        .oi-result-table tr:last-child td { border-bottom: none; }
      `})]})}function Fg({initialSelectedId:e}){var de,le,ce,se;const[t,n]=m.useState([]),[a,l]=m.useState(null),[s,i]=m.useState(null),[o,d]=m.useState("created_at"),[p,f]=m.useState(!0),[h,x]=m.useState("inprogress"),k=localStorage.getItem("token"),[j,w]=m.useState([]),[_,g]=m.useState([]),[u,c]=m.useState(null),v=JSON.parse(localStorage.getItem("user")||"{}"),[N,P]=m.useState(null),[z,D]=m.useState(""),[E,T]=m.useState("done"),[H,te]=m.useState(!1),K=async y=>{if(y.preventDefault(),!(!z||!E)){te(!0);try{const U=await fetch(`http://localhost:5000/api/planning/line-items/${N.id}/bulk-units-status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${k}`},body:JSON.stringify({dept:z,status:E})});if(U.ok)alert(`Successfully updated all ${z} steps to ${E} for this batch.`),P(null),await B(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const R=await U.json();alert(R.error||"Failed to bulk update units.")}}catch(U){console.error(U),alert("Network error, please try again.")}finally{te(!1)}}};m.useEffect(()=>{V(),J();const y=U=>{V(),U.detail&&U.detail.orderId&&l(R=>(R&&R.id===U.detail.orderId&&B(U.detail.orderId),R))};return window.addEventListener("orderUpdated",y),()=>window.removeEventListener("orderUpdated",y)},[]),m.useEffect(()=>{s?M(s.id):(w([]),c(null))},[s]);const J=async()=>{try{const y=await fetch("http://localhost:5000/api/users",{headers:{Authorization:`Bearer ${k}`}});y.ok&&g(await y.json())}catch(y){console.error("Fetch users error:",y)}},M=async y=>{try{const U=await fetch(`http://localhost:5000/api/units/${y}/steps`,{headers:{Authorization:`Bearer ${k}`}});U.ok&&w(await U.json())}catch(U){console.error("Fetch unit steps error:",U)}},G=async(y,U)=>{try{(await fetch(`http://localhost:5000/api/units/${s.id}/steps/${y}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${k}`},body:JSON.stringify(U)})).ok&&(await M(s.id),await B(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}})))}catch(R){console.error("Update unit step error:",R)}};m.useEffect(()=>{e&&t.length>0&&B(e)},[e,t]);const V=async()=>{try{const y=await fetch("http://localhost:5000/api/orders",{headers:{Authorization:`Bearer ${k}`}});if(y.ok){const U=await y.json();n(U)}}catch(y){console.error("Fetch error:",y)}finally{f(!1)}},B=async y=>{var U;try{const R=await fetch(`http://localhost:5000/api/orders/${y}`,{headers:{Authorization:`Bearer ${k}`}});if(R.ok){const ee=await R.json();if(l(ee),s){const Y=(U=ee.units)==null?void 0:U.find(C=>C.id===s.id);Y&&i(Y)}}}catch(R){console.error("Fetch details error:",R)}},S=y=>{if(!y||y.length===0)return 0;const U={Pending:0,Design:15,"Material Waiting":30,Production:55,"QC Testing":75,"QC Passed":90,"Ready for Dispatch":95,Dispatched:100,Delivered:100,Rework:40,"QC Failed":60};let R=0;return y.forEach(ee=>{R+=U[ee.status]||0}),Math.round(R/y.length)};if(p)return r.jsx("div",{className:"loading",children:"Loading orders..."});const I=y=>parseInt(y.unit_count)>0&&parseInt(y.dispatched_unit_count)>=parseInt(y.unit_count),F=t.filter(y=>!I(y)),Z=t.filter(y=>I(y)),ye=h==="completed"?Z:F;return r.jsxs("div",{className:"order-list-container",children:[r.jsxs("div",{className:"orders-sidebar",children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("h3",{className:"sidebar-title",style:{margin:0},children:"Orders"}),r.jsxs("select",{value:o,onChange:y=>d(y.target.value),className:"form-select",style:{padding:"2px 8px",fontSize:"11px",width:"auto",background:"#222"},children:[r.jsx("option",{value:"created_at",children:"Created Date"}),r.jsx("option",{value:"order_date",children:"Order Date"}),r.jsx("option",{value:"delivery_date",children:"Delivery Date"}),r.jsx("option",{value:"po_number",children:"PO Number"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"4px",marginBottom:"12px",background:"#111",borderRadius:"8px",padding:"4px"},children:[r.jsxs("button",{onClick:()=>x("inprogress"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:h==="inprogress"?"#1d4ed8":"transparent",color:h==="inprogress"?"#fff":"#888"},children:["In Progress ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",F.length,")"]})]}),r.jsxs("button",{onClick:()=>x("completed"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:h==="completed"?"#065f46":"transparent",color:h==="completed"?"#34d399":"#888"},children:["Completed ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",Z.length,")"]})]})]}),r.jsxs("div",{className:"order-items",children:[ye.length===0&&r.jsx("div",{style:{color:"#555",fontSize:"13px",textAlign:"center",padding:"32px 16px",fontStyle:"italic"},children:h==="completed"?"No completed orders yet.":"No in-progress orders."}),ye.map(y=>r.jsxs("div",{className:`order-card ${(a==null?void 0:a.id)===y.id?"active":""}`,onClick:()=>B(y.id),children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"},children:[r.jsx("div",{className:"order-num",style:{margin:0},children:y.order_number}),h==="completed"?r.jsx("span",{style:{background:"rgba(16,185,129,0.15)",color:"#34d399",border:"1px solid rgba(16,185,129,0.3)",borderRadius:"20px",padding:"2px 8px",fontSize:"10px",fontWeight:"700"},children:"✓ DONE"}):y.priority&&r.jsx("span",{className:`priority-badge ${y.priority.toLowerCase()}`,children:y.priority})]}),r.jsxs("div",{className:"order-meta",children:[r.jsxs("span",{children:[y.unit_count," Units"]})," •",r.jsx("span",{children:o==="created_at"?new Date(y.created_at).toLocaleDateString():o==="order_date"?y.order_date?new Date(y.order_date).toLocaleDateString():"No Order Date":o==="delivery_date"?y.delivery_date?new Date(y.delivery_date).toLocaleDateString():"No Delivery Date":o==="po_number"?y.po_number||"No PO Number":""})]}),y.company_name&&r.jsxs("div",{className:"order-company",children:["🏢 ",y.company_name," - ",y.company_city]})]},y.id))]})]}),r.jsx("div",{className:"order-details-pane",children:a?r.jsxs("div",{className:"details-content",children:[r.jsxs("div",{className:"details-header",children:[r.jsxs("div",{children:[r.jsx("h2",{children:a.order_number}),a.company_name&&r.jsxs("div",{className:"order-company-lg",children:["🏢 ",a.company_name," (",a.company_city,")"]})]}),r.jsxs("div",{className:"creator-info",children:["Created by: ",a.creator_name||"System"]})]}),r.jsxs("div",{className:"order-progress-container",children:[r.jsxs("div",{className:"progress-labels",children:[r.jsx("span",{children:"Order Progress"}),r.jsxs("span",{children:[S(a.units),"%"]})]}),r.jsx("div",{className:"progress-bar-bg",children:r.jsx("div",{className:"progress-bar-fill",style:{width:`${S(a.units)}%`}})})]}),r.jsxs("div",{className:"details-grid",children:[r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Priority"}),r.jsx("div",{className:"val",children:r.jsx("span",{className:`priority-badge ${((de=a.priority)==null?void 0:de.toLowerCase())||"medium"}`,children:a.priority||"Medium"})})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Order Date"}),r.jsx("div",{className:"val",children:a.order_date?new Date(a.order_date).toLocaleDateString():"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Delivery Date"}),r.jsx("div",{className:"val",children:a.delivery_date?new Date(a.delivery_date).toLocaleDateString():"TBD"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Notes"}),r.jsx("div",{className:"val",children:a.notes||"No notes"})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"24px"},children:[r.jsx("h3",{children:"Line Items & Units"}),(le=a.line_items)==null?void 0:le.map(y=>{var R;const U=((R=a.units)==null?void 0:R.filter(ee=>ee.line_item_id===y.id))||[];return r.jsxs("div",{style:{background:"#222",borderRadius:"8px",padding:"16px",marginBottom:"16px",border:"1px solid #333"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",borderBottom:"1px solid #444",paddingBottom:"8px"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsxs("strong",{children:["Line ",y.line_item_number]}),": ",y.material_description," ",y.part_number?`(${y.part_number})`:"",["Admin","Manager","Production","Sales","Design","Purchase","Stores","QC","Dispatch","Accounts"].includes(v.role)&&r.jsx("button",{className:"vbtn",style:{padding:"2px 8px",fontSize:"10px",background:"#2563eb",border:"none",borderRadius:"4px",cursor:"pointer",display:"inline-flex",alignItems:"center",height:"22px"},onClick:()=>{D(""),T("done"),P(y)},children:"Bulk Update Batch"})]}),r.jsxs("div",{style:{color:"#888",fontSize:"13px"},children:[y.quantity," ",y.unit||"Nos"," @ ₹",y.unit_price]})]}),r.jsx("div",{className:"units-grid",children:U.map(ee=>r.jsxs("div",{className:"unit-badge interactive",onClick:()=>i(ee),children:[r.jsx("span",{className:"u-id",children:ee.short_serial}),r.jsx("span",{className:`u-status ${ee.status.toLowerCase().replace(/\s+/g,"-")}`,children:ee.status})]},ee.id))})]},y.id)})]}),r.jsx(dl,{entityType:"Order",entityId:a.id,initialDocs:((ce=a.documents)==null?void 0:ce.filter(y=>y.entity_type==="Order"))||[],userRole:v.role})]}):r.jsx("div",{className:"select-prompt",children:"Select an order from the list to view details and documents."})}),s&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&i(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Unit Tracking"}),r.jsxs("div",{className:"modal-sub",children:[s.unit_id," (",s.status,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>i(null),children:"✕"})]}),r.jsxs("div",{className:"modal-body",children:[r.jsxs("div",{style:{marginBottom:20},children:[r.jsx("h4",{style:{margin:"0 0 12px 0",color:"#fff",fontSize:"14px",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Production Steps"}),j.length===0?r.jsx("div",{style:{color:"#666",fontSize:"13px",fontStyle:"italic"},children:"Loading steps..."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[...j].sort((y,U)=>["Admin","Manager"].includes(v.role)?0:y.dept===v.role&&U.dept!==v.role?-1:U.dept===v.role&&y.dept!==v.role?1:0).map(y=>{const U=u===y.id,R=["Admin","Manager"].includes(v.role)||y.dept===v.role||y.assigned_user_id===v.id,ee=_.find(O=>O.id===y.assigned_user_id);let Y=[];try{Y=Array.isArray(y.custom_fields)?y.custom_fields:JSON.parse(y.custom_fields||"[]")}catch{Y=[]}const C=_.filter(O=>O.role===y.dept);return r.jsxs("div",{style:{background:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.05)",borderRadius:"8px",padding:"12px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"},onClick:()=>c(U?null:y.id),children:[r.jsxs("div",{children:[r.jsxs("div",{style:{fontWeight:"600",color:"#fff",fontSize:"13px"},children:[!R&&r.jsx("span",{style:{color:"#60a5fa",marginRight:"6px",fontSize:"9px",textTransform:"uppercase",background:"rgba(59, 130, 246, 0.1)",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(59, 130, 246, 0.2)"},children:"View Only"}),y.name]}),r.jsxs("div",{style:{fontSize:"11px",color:"#888",marginTop:"2px"},children:["Dept: ",r.jsx("span",{style:{color:"#60a5fa"},children:y.dept})," | Assigned: ",r.jsx("span",{style:{color:"#34d399"},children:ee?ee.username:"Unassigned"})]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[r.jsx("span",{className:`step-status-badge badge-${y.status}`,style:{fontSize:"9px",fontWeight:"bold"},children:y.status}),r.jsx("span",{style:{fontSize:"10px",color:"#666"},children:U?"▲":"▼"})]})]}),U&&r.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px dashed rgba(255, 255, 255, 0.1)"},children:[!R&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.08)",border:"1px solid rgba(59, 130, 246, 0.15)",borderRadius:"6px",padding:"8px 12px",marginBottom:"12px",color:"#60a5fa",fontSize:"11px"},children:["ℹ️ ",r.jsx("strong",{children:"View-Only Mode"})," — managed by the ",r.jsx("strong",{children:y.dept})," department."]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"#888",display:"block",marginBottom:"4px"},children:"Step Status"}),R?r.jsxs("select",{className:"form-select",value:y.status,onChange:O=>G(y.id,{status:O.target.value}),style:{background:"#111",fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"2px"},children:r.jsx("span",{className:`step-status-badge ${(Le[y.status]||Le.pending).cls}`,style:{fontSize:"11px",padding:"3px 8px",fontWeight:"bold"},children:(Le[y.status]||Le.pending).label})})]}),r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"#888",display:"block",marginBottom:"4px"},children:"Assign Worker"}),R?r.jsxs("select",{className:"form-select",value:y.assigned_user_id||"",onChange:O=>G(y.id,{assigned_user_id:O.target.value?parseInt(O.target.value):null}),style:{background:"#111",fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),C.map(O=>r.jsx("option",{value:O.id,children:O.username},O.id))]}):r.jsx("div",{style:{fontSize:"12px",color:"#ddd",background:"#111",padding:"6px 10px",borderRadius:"6px"},children:ee?ee.username:"Unassigned"})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"#888",display:"block",marginBottom:"4px"},children:"Notes"}),R?r.jsx("textarea",{className:"form-input",defaultValue:y.notes||"",onBlur:O=>G(y.id,{notes:O.target.value}),placeholder:"Add step notes...",style:{background:"#111",fontSize:"12px",height:"50px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"12px",color:"#bbb",fontStyle:"italic",background:"#111",padding:"8px 12px",borderRadius:"6px",whiteSpace:"pre-wrap"},children:y.notes||"No notes added."})]}),Y.length>0&&r.jsxs("div",{style:{marginBottom:"12px",padding:"10px",background:"rgba(0,0,0,0.2)",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.03)"},children:[r.jsx("div",{style:{fontSize:"11px",color:"#888",fontWeight:"bold",marginBottom:"8px",textTransform:"uppercase"},children:"Custom Fields"}),Y.map((O,ne)=>{var Ne;const ie=xe=>{const Se=[...Y];Se[ne].value=xe,G(y.id,{custom_fields:Se})};return r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"#ccc",display:"block",marginBottom:"2px"},children:O.label}),R?O.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!O.value,onChange:xe=>ie(xe.target.checked)}):O.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:O.value||"",onChange:xe=>ie(xe.target.value),style:{background:"#111",fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(Ne=O.options)==null?void 0:Ne.map(xe=>r.jsx("option",{value:xe,children:xe},xe))]}):r.jsx("input",{type:O.type==="Number"?"number":"text",className:"form-input",defaultValue:O.value||"",onBlur:xe=>ie(xe.target.value),style:{background:"#111",fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"#ddd",fontWeight:"500",marginTop:"2px"},children:O.type==="Yes/No"?O.value==="Yes"||O.value===!0?"✅ Yes":"❌ No":O.value||"—"})]},O.id)})]})]})]},y.id)})})]}),r.jsx("div",{style:{marginTop:24,borderTop:"1px solid #333",paddingTop:"16px"},children:r.jsx(dl,{entityType:"Unit",entityId:s.id,initialDocs:((se=a.documents)==null?void 0:se.filter(y=>y.entity_type==="Unit"&&y.entity_id===s.id))||[],onUploadSuccess:()=>B(a.id),userRole:v.role})})]})]})}),N&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&P(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"400px",width:"90%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Update Batch Units"}),r.jsxs("div",{className:"modal-sub",children:["Line Item: ",N.line_item_number," (",N.quantity," units)"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>P(null),children:"✕"})]}),r.jsxs("form",{onSubmit:K,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{style:{display:"block",color:"#bbb",fontSize:"13px",marginBottom:"6px"},children:"Target Department Task"}),r.jsxs("select",{className:"form-select",value:z,onChange:y=>D(y.target.value),style:{width:"100%",background:"#111",color:"#fff",border:"1px solid #333",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"",children:"-- Select Department --"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"})]})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"20px"},children:[r.jsx("label",{style:{display:"block",color:"#bbb",fontSize:"13px",marginBottom:"6px"},children:"Set Task Status to"}),r.jsxs("select",{className:"form-select",value:E,onChange:y=>T(y.target.value),style:{width:"100%",background:"#111",color:"#fff",border:"1px solid #333",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"flex-end",gap:"10px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>P(null),disabled:H,style:{background:"transparent",border:"1px solid #444",color:"#ccc",borderRadius:"6px",padding:"8px 16px",cursor:"pointer"},children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:H,style:{background:"#3b82f6",border:"none",color:"#fff",borderRadius:"6px",padding:"8px 16px",cursor:"pointer",fontWeight:"600"},children:H?"Updating...":"Update All Units"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .order-list-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          height: calc(100vh - 200px);
        }
        .orders-sidebar {
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #333;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sidebar-title { padding: 16px; border-bottom: 1px solid #333; margin: 0; font-size: 16px; }
        .order-items { overflow-y: auto; flex: 1; }
        .order-card {
          padding: 16px;
          border-bottom: 1px solid #222;
          cursor: pointer;
          transition: background 0.2s;
        }
        .order-card:hover { background: #222; }
        .order-card.active { background: #2a2a2a; border-left: 3px solid #3b82f6; }
        .order-num { color: #fff; font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .order-meta { color: #666; font-size: 12px; }
        .order-company { color: #9ca3af; font-size: 11px; margin-top: 6px; }
        .order-company-lg { color: #9ca3af; font-size: 14px; margin-top: 4px; }
        
        .order-details-pane {
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #333;
          padding: 24px;
          overflow-y: auto;
        }
        .details-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; border-bottom: 1px solid #333; padding-bottom: 16px; }
        .details-header h2 { margin: 0; color: #fff; }
        .creator-info { color: #888; font-size: 13px; }
        
        .order-progress-container { margin-bottom: 24px; }
        .progress-labels { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; color: #bbb; text-transform: uppercase; font-weight: 600; }
        .progress-bar-bg { background: #333; border-radius: 6px; height: 8px; overflow: hidden; width: 100%; }
        .progress-bar-fill { background: var(--teal, #14b8a6); height: 100%; transition: width 0.4s ease-out; }
        
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
        .detail-box label { color: #666; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .detail-box .val { color: #ddd; font-size: 15px; }
        
        .units-section { margin-bottom: 32px; }
        .units-section h3 { font-size: 16px; color: #fff; margin-bottom: 12px; }
        .units-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .unit-badge {
          background: #0f0f0f;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 6px 10px;
          display: flex;
          flex-direction: column;
          min-width: 140px;
        }
        .unit-badge.interactive { cursor: pointer; transition: background 0.2s, border-color 0.2s; }
        .unit-badge.interactive:hover { background: #1a1a1a; border-color: #3b82f6; }
        .u-id { font-size: 12px; color: #eee; font-weight: 500; }
        .u-status { font-size: 10px; color: #888; margin-top: 2px; text-transform: uppercase; }
        .u-status.pending { color: #f59e0b; }
        
        .select-prompt { height: 100%; display: flex; align-items: center; justify-content: center; color: #666; }
        .loading { text-align: center; padding: 40px; color: #888; }
        
        .priority-badge {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .priority-badge.low { background: rgba(156, 163, 175, 0.2); color: #9ca3af; border: 1px solid rgba(156, 163, 175, 0.4); }
        .priority-badge.medium { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
        .priority-badge.high { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
        .priority-badge.urgent { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
      `}})]})}const $g=["Text","Number","Date","Yes/No","Dropdown"],Wg=[{key:"order_number",label:"Order Number"},{key:"company_name",label:"Company Name"},{key:"delivery_date",label:"Delivery Date"},{key:"po_number",label:"PO Number"},{key:"packaging_type",label:"Packaging Type"},{key:"priority",label:"Priority"},{key:"notes",label:"Order Notes"}];function qg(){const[e,t]=m.useState("companies"),[n,a]=m.useState([]),[l,s]=m.useState(!1),[i,o]=m.useState({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),[d,p]=m.useState([]),[f,h]=m.useState(!1),[x,k]=m.useState(null),[j,w]=m.useState({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),[_,g]=m.useState([]),[u,c]=m.useState(!1),[v,N]=m.useState({label:"",type:"Text",options:""}),P=localStorage.getItem("token"),z=JSON.parse(localStorage.getItem("user")||"{}"),D=["Admin","Manager","Sales"].includes(z.role);m.useEffect(()=>{E(),T()},[]),m.useEffect(()=>{const S=I=>{I.altKey&&I.key.toLowerCase()==="n"&&(I.preventDefault(),e==="companies"?s(!0):e==="tasks"&&D&&(k(null),w({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,order_fields:[]}),g([]),c(!1),h(!0)))};return window.addEventListener("keydown",S),()=>{window.removeEventListener("keydown",S)}},[e,D]);const E=async()=>{try{const S=await fetch("http://localhost:5000/api/companies",{headers:{Authorization:`Bearer ${P}`}});S.ok&&a(await S.json())}catch(S){console.error(S)}},T=async()=>{try{const S=await fetch("http://localhost:5000/api/task_masters",{headers:{Authorization:`Bearer ${P}`}});S.ok&&p(await S.json())}catch(S){console.error(S)}},H=(S,I,F)=>{const Z=[...i.locations];Z[S][I]=F,o({...i,locations:Z})},te=()=>{o({...i,locations:[...i.locations,{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]})},K=async S=>{S.preventDefault();try{(await fetch("http://localhost:5000/api/companies",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${P}`},body:JSON.stringify(i)})).ok&&(s(!1),o({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),E())}catch(I){console.error(I)}},J=async S=>{S.preventDefault();const I=!!x,F=I?`http://localhost:5000/api/task_masters/${x}`:"http://localhost:5000/api/task_masters",Z=I?"PUT":"POST",ye=_.map(({id:de,label:le,type:ce,options:se})=>({id:de,label:le,type:ce,options:se||[]}));try{(await fetch(F,{method:Z,headers:{"Content-Type":"application/json",Authorization:`Bearer ${P}`},body:JSON.stringify({...j,custom_fields:ye,order_fields:j.order_fields||[]})})).ok?(h(!1),k(null),w({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),g([]),c(!1),T()):alert("Failed to save task")}catch(de){console.error(de)}},M=S=>{k(S.id),w({dept:S.dept,name:S.name,sub:S.sub||"",special:S.special||"",is_mandatory:S.is_mandatory,requires_upload:S.requires_upload,default_doc_type:S.default_doc_type||"General",order_fields:Array.isArray(S.order_fields)?S.order_fields:S.order_fields?JSON.parse(S.order_fields):[]});try{const I=Array.isArray(S.custom_fields)?S.custom_fields:JSON.parse(S.custom_fields||"[]");g(I)}catch{g([])}c(!1),h(!0)},G=()=>{if(!v.label.trim()){alert("Label is required.");return}const S={id:Date.now(),label:v.label.trim(),type:v.type,options:v.type==="Dropdown"?v.options.split(",").map(I=>I.trim()).filter(Boolean):[]};g(I=>[...I,S]),N({label:"",type:"Text",options:""}),c(!1)},V=S=>g(I=>I.filter(F=>F.id!==S)),B=async S=>{if(window.confirm("Are you sure you want to delete this task?"))try{(await fetch(`http://localhost:5000/api/task_masters/${S}`,{method:"DELETE",headers:{Authorization:`Bearer ${P}`}})).ok?T():alert("Failed to delete task")}catch(I){console.error(I)}};return r.jsxs("div",{style:{padding:"24px"},children:[r.jsxs("div",{style:{display:"flex",gap:"16px",marginBottom:"24px",borderBottom:"1px solid #333",paddingBottom:"16px"},children:[r.jsx("button",{className:`vbtn ${e==="companies"?"active":""}`,onClick:()=>t("companies"),children:"Companies"}),r.jsx("button",{className:`vbtn ${e==="tasks"?"active":""}`,onClick:()=>t("tasks"),children:"Task Masters"})]}),e==="companies"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"#fff"},children:"Company Masters"}),r.jsx("button",{className:"vbtn",onClick:()=>s(!0),children:"+ Register Company (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:n.map(S=>r.jsxs("div",{style:{background:"#1a1a1a",padding:"20px",borderRadius:"12px",border:"1px solid #333"},children:[r.jsx("h3",{style:{margin:"0 0 16px 0",color:"#fff"},children:S.name}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:S.locations.map(I=>r.jsxs("div",{style:{background:"#111",padding:"16px",borderRadius:"8px",border:"1px solid #222"},children:[r.jsx("div",{style:{color:"#3b82f6",fontWeight:"bold",marginBottom:"8px"},children:I.city}),r.jsx("div",{style:{fontSize:"13px",color:"#bbb",marginBottom:"4px"},children:I.address}),r.jsxs("div",{style:{fontSize:"12px",color:"#888",marginTop:"12px"},children:[r.jsxs("div",{children:[r.jsx("strong",{children:"Contact:"})," ",I.person_in_charge||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Phone:"})," ",I.contact_number||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Email:"})," ",I.email||"N/A"]})]})]},I.id))})]},S.id))})]}),e==="tasks"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"#fff"},children:"Task Masters"}),D&&r.jsx("button",{className:"vbtn",onClick:()=>{k(null),w({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),g([]),c(!1),h(!0)},children:"+ New Task (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:Mt.map(S=>{const I=d.filter(F=>F.dept===S.id);return I.length===0?null:r.jsxs("div",{children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"},children:[r.jsx("div",{style:{width:"4px",height:"16px",background:S.color,borderRadius:"2px"}}),r.jsx("h3",{style:{margin:0,color:"#fff",fontSize:"15px"},children:S.label})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:I.map(F=>r.jsxs("div",{style:{background:"#1a1a1a",padding:"16px",borderRadius:"8px",border:"1px solid #333"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"},children:[r.jsx("span",{style:{fontSize:"12px",color:S.color,fontWeight:"bold",textTransform:"uppercase"},children:F.dept}),r.jsx("span",{style:{fontSize:"10px",background:F.is_mandatory?"#3b82f644":"#6b728044",color:F.is_mandatory?"#60a5fa":"#9ca3af",padding:"2px 6px",borderRadius:"4px"},children:F.is_mandatory?"MANDATORY":"OPTIONAL"})]}),r.jsx("div",{style:{color:"#fff",fontWeight:"500",marginBottom:"4px"},children:F.name}),r.jsx("div",{style:{color:"#888",fontSize:"12px",marginBottom:"12px"},children:F.sub||"No description"}),r.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[F.requires_upload&&r.jsxs("span",{style:{fontSize:"10px",background:"#f59e0b44",color:"#fbbf24",padding:"2px 6px",borderRadius:"4px"},children:["Requires: ",F.default_doc_type||"General"]}),F.special&&r.jsxs("span",{style:{fontSize:"10px",background:"#10b98144",color:"#34d399",padding:"2px 6px",borderRadius:"4px"},children:["Special: ",F.special]})]}),D&&r.jsxs("div",{style:{display:"flex",gap:"4px"},children:[r.jsx("button",{style:{background:"transparent",border:"1px solid #444",color:"#ccc",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>M(F),children:"Edit"}),r.jsx("button",{style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>B(F.id),children:"Delete"})]})]})]},F.id))})]},S.id)})})]}),l&&r.jsx("div",{className:"modal-overlay open",onClick:S=>{S.target.className==="modal-overlay open"&&s(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:"Register Company"}),r.jsx("button",{className:"modal-close",onClick:()=>s(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:K,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Company Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:i.name,onChange:S=>o({...i,name:S.target.value})})]}),r.jsx("div",{style:{marginTop:"24px",marginBottom:"16px",borderBottom:"1px solid #333",paddingBottom:"8px",color:"#fff"},children:"Locations"}),i.locations.map((S,I)=>r.jsxs("div",{style:{background:"#111",padding:"16px",borderRadius:"8px",marginBottom:"16px",border:"1px solid #222"},children:[r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"City *"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:S.city,onChange:F=>H(I,"city",F.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Person in Charge"}),r.jsx("input",{type:"text",className:"form-input",value:S.person_in_charge,onChange:F=>H(I,"person_in_charge",F.target.value)})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Full Address"}),r.jsx("input",{type:"text",className:"form-input",value:S.address,onChange:F=>H(I,"address",F.target.value)})]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Contact Number"}),r.jsx("input",{type:"text",className:"form-input",value:S.contact_number,onChange:F=>H(I,"contact_number",F.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Email"}),r.jsx("input",{type:"email",className:"form-input",value:S.email,onChange:F=>H(I,"email",F.target.value)})]})]})]},I)),r.jsx("button",{type:"button",onClick:te,style:{background:"transparent",border:"1px dashed #444",color:"#888",width:"100%",padding:"12px",borderRadius:"8px",cursor:"pointer",marginBottom:"24px"},children:"+ Add Another Location"}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#333"},onClick:()=>s(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:"Save Company"})]})]})})]})}),f&&r.jsx("div",{className:"modal-overlay open",onClick:S=>{S.target.className==="modal-overlay open"&&h(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:x?"Edit Task Master":"New Task Master"}),r.jsx("button",{className:"modal-close",onClick:()=>h(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:J,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Department"}),r.jsx("select",{className:"form-select",value:j.dept,onChange:S=>w({...j,dept:S.target.value}),children:Mt.map(S=>r.jsx("option",{value:S.id,children:S.label},S.id))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Task Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:j.name,onChange:S=>w({...j,name:S.target.value})})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Description / Subtitle"}),r.jsx("input",{type:"text",className:"form-input",value:j.sub,onChange:S=>w({...j,sub:S.target.value})})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"16px"},children:[r.jsx("input",{type:"checkbox",checked:j.is_mandatory,onChange:S=>w({...j,is_mandatory:S.target.checked})}),r.jsx("label",{style:{margin:0,color:"#fff"},children:"Mandatory Task (added to all new orders)"})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"12px"},children:[r.jsx("input",{type:"checkbox",checked:j.requires_upload,onChange:S=>w({...j,requires_upload:S.target.checked})}),r.jsx("label",{style:{margin:0,color:"#fff"},children:"Requires Document Upload to complete"})]}),j.requires_upload&&r.jsxs("div",{className:"modal-field",style:{marginLeft:"24px",marginTop:"8px"},children:[r.jsx("label",{style:{color:"#fff",fontSize:"12px",display:"block",marginBottom:"4px"},children:"Default Document Type"}),r.jsxs("select",{className:"form-select",value:j.default_doc_type||"General",onChange:S=>w({...j,default_doc_type:S.target.value}),style:{background:"#111",fontSize:"13px",width:"100%",padding:"6px 12px"},children:[r.jsx("option",{value:"General",children:"General"}),r.jsx("option",{value:"PO",children:"PO"}),r.jsx("option",{value:"Quotation",children:"Quotation"}),r.jsx("option",{value:"BOM",children:"BOM"}),r.jsx("option",{value:"Drawing",children:"Drawing"}),r.jsx("option",{value:"QC Report",children:"QC Report"}),r.jsx("option",{value:"Dispatch Document",children:"Dispatch Document"}),r.jsx("option",{value:"Photo",children:"Photo"})]})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid #333"},children:[r.jsx("label",{style:{color:"#fff",fontWeight:"600",display:"block",marginBottom:"10px"},children:"Order Fields to Show"}),r.jsx("div",{style:{color:"#666",fontSize:"11px",marginBottom:"10px"},children:"These fields from the order will be shown as read-only reference inside the task modal."}),r.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:Wg.map(S=>{const I=(j.order_fields||[]).includes(S.key);return r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"6px",background:I?"rgba(59,130,246,0.15)":"#111",border:`1px solid ${I?"rgba(59,130,246,0.4)":"#2a2a2a"}`,borderRadius:"6px",padding:"5px 10px",cursor:"pointer",fontSize:"12px",color:I?"#60a5fa":"#888"},children:[r.jsx("input",{type:"checkbox",checked:I,style:{display:"none"},onChange:()=>{const F=j.order_fields||[],Z=I?F.filter(ye=>ye!==S.key):[...F,S.key];w(ye=>({...ye,order_fields:Z}))}}),I?"✓ ":"",S.label]},S.key)})})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid #333"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("label",{style:{color:"#fff",fontWeight:"600"},children:"Form Fields"}),r.jsx("button",{type:"button",onClick:()=>c(!u),style:{background:"rgba(59,130,246,0.15)",color:"#60a5fa",border:"1px solid rgba(59,130,246,0.3)",padding:"4px 10px",borderRadius:"6px",fontSize:"11px",cursor:"pointer"},children:u?"Cancel":"+ Add Field"})]}),u&&r.jsxs("div",{style:{background:"#111",border:"1px solid #333",borderRadius:"8px",padding:"12px",marginBottom:"12px"},children:[r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"8px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"#999",display:"block",marginBottom:"4px"},children:"Label *"}),r.jsx("input",{type:"text",className:"form-input",value:v.label,onChange:S=>N(I=>({...I,label:S.target.value})),placeholder:"e.g. Test Voltage"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"#999",display:"block",marginBottom:"4px"},children:"Type"}),r.jsx("select",{className:"form-select",value:v.type,onChange:S=>N(I=>({...I,type:S.target.value})),children:$g.map(S=>r.jsx("option",{value:S,children:S},S))})]})]}),v.type==="Dropdown"&&r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"#999",display:"block",marginBottom:"4px"},children:"Options (comma-separated)"}),r.jsx("input",{type:"text",className:"form-input",value:v.options,onChange:S=>N(I=>({...I,options:S.target.value})),placeholder:"Option A, Option B"})]}),r.jsx("button",{type:"button",onClick:G,style:{background:"#10b981",color:"#fff",border:"none",padding:"6px 14px",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},children:"Add Field"})]}),_.length===0?r.jsx("div",{style:{color:"#555",fontSize:"12px",fontStyle:"italic",padding:"8px 0"},children:"No form fields defined. Users will only see Notes when filling this task."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:_.map(S=>{var I;return r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#111",padding:"8px 12px",borderRadius:"6px",border:"1px solid #2a2a2a"},children:[r.jsxs("div",{children:[r.jsx("span",{style:{color:"#ddd",fontSize:"13px"},children:S.label}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"10px",color:"#555",background:"#1a1a1a",padding:"1px 5px",borderRadius:"3px",textTransform:"uppercase"},children:S.type}),((I=S.options)==null?void 0:I.length)>0&&r.jsxs("span",{style:{marginLeft:"6px",fontSize:"10px",color:"#666"},children:["(",S.options.join(", "),")"]})]}),r.jsx("button",{type:"button",onClick:()=>V(S.id),style:{background:"transparent",border:"none",color:"#666",cursor:"pointer",fontSize:"14px"},children:"✕"})]},S.id)})})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px",marginTop:"24px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#333"},onClick:()=>h(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:x?"Update Task":"Save Task"})]})]})})]})})]})}function Vg(){const[e,t]=m.useState([]),[n,a]=m.useState("1000"),[l,s]=m.useState(""),[i,o]=m.useState("All"),[d,p]=m.useState(!1),f=localStorage.getItem("token");m.useEffect(()=>{h(n)},[n]);const h=async(w=n)=>{p(!0);try{const _=await fetch(`http://localhost:5000/api/logs?limit=${w}`,{headers:{Authorization:`Bearer ${f}`}});if(_.ok){const g=await _.json();t(g)}}catch(_){console.error(_)}finally{p(!1)}},x=w=>{const _=new Date(w);return _.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+" "+_.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},k=w=>{switch(w==null?void 0:w.toLowerCase()){case"sales":return{background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",border:"1px solid rgba(59, 130, 246, 0.2)"};case"design":return{background:"rgba(167, 139, 250, 0.1)",color:"#a78bfa",border:"1px solid rgba(167, 139, 250, 0.2)"};case"purchase":return{background:"rgba(249, 115, 22, 0.1)",color:"#f97316",border:"1px solid rgba(249, 115, 22, 0.2)"};case"stores":return{background:"rgba(45, 212, 191, 0.1)",color:"#2dd4bf",border:"1px solid rgba(45, 212, 191, 0.2)"};case"production":return{background:"rgba(239, 68, 68, 0.1)",color:"#ef4444",border:"1px solid rgba(239, 68, 68, 0.2)"};case"qc":return{background:"rgba(34, 197, 94, 0.1)",color:"#22c55e",border:"1px solid rgba(34, 197, 94, 0.2)"};case"dispatch":return{background:"rgba(245, 158, 11, 0.1)",color:"#f59e0b",border:"1px solid rgba(245, 158, 11, 0.2)"};case"accounts":return{background:"rgba(14, 165, 233, 0.1)",color:"#0ea5e9",border:"1px solid rgba(14, 165, 233, 0.2)"};default:return{background:"rgba(255, 255, 255, 0.05)",color:"#888",border:"1px solid rgba(255, 255, 255, 0.1)"}}},j=e.filter(w=>{if(i!=="All"&&w.dept!==i)return!1;if(l){const _=l.toLowerCase(),g=(w.username||"").toLowerCase().includes(_),u=(w.action_text||"").toLowerCase().includes(_),c=(w.order_number||"").toLowerCase().includes(_);return g||u||c}return!0});return r.jsxs("div",{style:{padding:"24px"},children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid #333",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(tg,{size:22,style:{color:"#f59e0b"}}),"System Activity Logs"]})}),r.jsxs("div",{style:{background:"#14161a",border:"1px solid #2a2f3a",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"16px",flex:1,minWidth:"300px"},children:[r.jsxs("div",{style:{position:"relative",flex:1,minWidth:"220px"},children:[r.jsx(zl,{size:16,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#5a6070"}}),r.jsx("input",{type:"text",placeholder:"Search logs by user, action or order #...",value:l,onChange:w=>s(w.target.value),style:{width:"100%",background:"#0e0f11",border:"1px solid #2a2f3a",borderRadius:"8px",color:"#e8eaf0",padding:"10px 12px 10px 38px",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},className:"log-search-input"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(ap,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#5a6070"}}),r.jsxs("select",{value:i,onChange:w=>o(w.target.value),style:{width:"100%",background:"#0e0f11",border:"1px solid #2a2f3a",borderRadius:"8px",color:"#e8eaf0",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"All",children:"All Departments"}),r.jsx("option",{value:"Sales",children:"Sales"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"}),r.jsx("option",{value:"Accounts",children:"Accounts"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"#5a6070",fontSize:"10px"},children:"▼"})]}),r.jsxs("div",{style:{position:"relative",width:"160px"},children:[r.jsx(rp,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#5a6070"}}),r.jsxs("select",{value:n,onChange:w=>a(w.target.value),style:{width:"100%",background:"#0e0f11",border:"1px solid #2a2f3a",borderRadius:"8px",color:"#e8eaf0",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"100",children:"Fetch 100 Logs"}),r.jsx("option",{value:"250",children:"Fetch 250 Logs"}),r.jsx("option",{value:"500",children:"Fetch 500 Logs"}),r.jsx("option",{value:"1000",children:"Fetch 1000 Logs"}),r.jsx("option",{value:"5000",children:"Fetch 5000 Logs"}),r.jsx("option",{value:"all",children:"Fetch All Logs"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"#5a6070",fontSize:"10px"},children:"▼"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[(l||i!=="All")&&r.jsx("button",{onClick:()=>{s(""),o("All")},style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"#ef4444",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",transition:"all 0.2s"},className:"clear-btn",children:"Clear Filters"}),r.jsxs("button",{onClick:()=>h(n),disabled:d,style:{background:"#1c1f26",border:"1px solid #2a2f3a",color:"#e8eaf0",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",transition:"all 0.2s"},className:"refresh-btn",children:[r.jsx($n,{size:14,className:d?"spin":"",style:{transition:"transform 0.5s"}}),d?"Loading...":"Refresh"]})]})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:"12px",fontSize:"12px",color:"#8a93a8"},children:[r.jsxs("div",{children:["Showing ",r.jsx("span",{style:{color:"#f59e0b",fontWeight:"600"},children:j.length})," ","of ",r.jsx("span",{style:{color:"#fff",fontWeight:"600"},children:e.length})," fetched logs"," ",n==="all"?"(full system history)":`(limit: ${n})`]}),j.length<e.length&&r.jsxs("div",{style:{fontStyle:"italic"},children:["Filtered out ",e.length-j.length," logs"]})]}),r.jsx("div",{style:{background:"#111",borderRadius:"12px",border:"1px solid #2a2f3a",overflow:"hidden"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"13px"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"#14161a",borderBottom:"1px solid #2a2f3a"},children:[r.jsx("th",{style:{padding:"16px",color:"#8a93a8",fontWeight:"500"},children:"Timestamp"}),r.jsx("th",{style:{padding:"16px",color:"#8a93a8",fontWeight:"500"},children:"User"}),r.jsx("th",{style:{padding:"16px",color:"#8a93a8",fontWeight:"500"},children:"Order #"}),r.jsx("th",{style:{padding:"16px",color:"#8a93a8",fontWeight:"500"},children:"Department"}),r.jsx("th",{style:{padding:"16px",color:"#8a93a8",fontWeight:"500"},children:"Action"})]})}),r.jsx("tbody",{children:d&&e.length===0?r.jsx("tr",{children:r.jsxs("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"#8a93a8"},children:[r.jsx($n,{size:24,className:"spin",style:{margin:"0 auto 12px",color:"#f59e0b",display:"block"}}),"Loading activity logs..."]})}):j.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"#5a6070"},children:"No matching activity logs found."})}):j.map(w=>r.jsxs("tr",{style:{borderBottom:"1px solid #1c1f26"},className:"log-row",children:[r.jsx("td",{style:{padding:"16px",color:"#8a93a8",whiteSpace:"nowrap"},children:x(w.timestamp)}),r.jsx("td",{style:{padding:"16px",color:"#fff",fontWeight:"600"},children:w.username}),r.jsx("td",{style:{padding:"16px"},children:w.order_number?r.jsx("span",{style:{fontFamily:"monospace",fontSize:"11px",background:"rgba(245,158,11,0.1)",color:"#f59e0b",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(245,158,11,0.2)"},children:w.order_number}):r.jsx("span",{style:{color:"#444"},children:"—"})}),r.jsx("td",{style:{padding:"16px"},children:w.dept?r.jsx("span",{style:{display:"inline-block",fontSize:"11px",fontWeight:"500",padding:"2px 8px",borderRadius:"12px",...k(w.dept)},children:w.dept}):r.jsx("span",{style:{color:"#444"},children:"—"})}),r.jsx("td",{style:{padding:"16px",color:"#e8eaf0"},children:w.action_text})]},w.id))})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .log-search-input:focus {
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
        }
        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
        }
        .refresh-btn:hover:not(:disabled) {
          background: #242830 !important;
          border-color: #363d4a !important;
          color: #fff !important;
        }
        .spin {
          animation: spin-anim 1s linear infinite;
        }
        @keyframes spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .log-row {
          transition: background 0.15s ease, border-left-color 0.15s ease;
          border-left: 3px solid transparent;
        }
        .log-row:hover {
          background: #14161a !important;
          border-left-color: #f59e0b !important;
        }
      `}})]})}const Hg=[10,20,50,100],wa=["sr_no","order_number","po_number","part_number","client_name","end_client_name","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","priority","status","qc_status","qc_date","progress","action"];function Qg(){const e=localStorage.getItem("token"),t=JSON.parse(localStorage.getItem("user")||"{}"),n=["Admin","Manager","Production","Sales"].includes(t.role),[a,l]=m.useState([]),[s,i]=m.useState(()=>{const b=localStorage.getItem("planning_column_order");if(b)try{const L=JSON.parse(b);if(Array.isArray(L)&&L.length>0){const $=L.filter(Q=>wa.includes(Q)),W=wa.filter(Q=>!$.includes(Q));return[...$,...W]}}catch(L){console.error("Error parsing column order from localStorage:",L)}return wa}),[o,d]=m.useState(null),[p,f]=m.useState(null),h=(b,L)=>{d(L),b.dataTransfer.effectAllowed="move",b.dataTransfer.setData("text/plain",L)},x=(b,L)=>{b.preventDefault(),o!==L&&p!==L&&f(L)},k=(b,L)=>{p===L&&f(null)},j=(b,L)=>{if(b.preventDefault(),!o||o===L){d(null),f(null);return}const $=s.indexOf(o),W=s.indexOf(L);if($!==-1&&W!==-1){const Q=[...s];Q.splice($,1),Q.splice(W,0,o),i(Q),localStorage.setItem("planning_column_order",JSON.stringify(Q))}d(null),f(null)},w=()=>{d(null),f(null)},_=b=>{switch(b){case"sr_no":return"Sr. No.";case"order_number":return"Order Number";case"po_number":return"PO Number";case"part_number":return"Part Number";case"client_name":return"Client Name";case"end_client_name":return"End Client Name";case"planned_dispatch":return"Planned Dispatch";case"mounting_start":return"Mounting Start";case"mounting_complete":return"Mounting Complete";case"delivery_date":return"Order Delivery Date";case"wiring_assigned":return"Wiring Assigned";case"wiring_expected":return"Wiring Expected";case"expected_qc":return"Expected QC";case"priority":return"Priority";case"status":return"Status";case"qc_status":return"QC Status";case"qc_date":return"QC Passed Date";case"progress":return"Progress";case"action":return"Action";default:return b}},g=s.filter(b=>!(b==="action"&&!n)),u=(b,L,$,W)=>{var Ee;const Q=se&&se.lineItemId===L.line_item_id&&se.colId===b;if(U&&U.lineItemId===L.line_item_id&&U.colId===b)return r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{className:"inline-saving-spinner"}),r.jsx("span",{className:"dim text-xs",children:"Saving..."})]});if(Q){const ue=pe=>{pe.key==="Enter"?pe.target.blur():pe.key==="Escape"&&y(null)},qe=pe=>{ao(L.line_item_id,b,pe,se.oldValue)},Me=()=>{se&&se.lineItemId===L.line_item_id&&se.colId===b&&ao(L.line_item_id,b,se.value,se.oldValue)};if(["priority","status","qc_status"].includes(b)){let pe=[];return b==="priority"?pe=["Low","Medium","High","Urgent"]:b==="status"?pe=["Not Started","In Progress","Waiting for Material","QC Testing","Completed"]:b==="qc_status"&&(pe=["Pending","Pass","Fail"]),r.jsx("select",{className:"inline-edit-select",value:se.value,onChange:pt=>qe(pt.target.value),onBlur:Me,autoFocus:!0,children:pe.map(pt=>r.jsx("option",{value:pt,children:pt},pt))})}if(["planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(b))return r.jsx("input",{type:"date",className:"inline-edit-input",value:se.value,onChange:pe=>y({...se,value:pe.target.value}),onBlur:Me,onKeyDown:ue,autoFocus:!0});if(b==="end_client_name")return r.jsx("input",{type:"text",className:"inline-edit-input",value:se.value,onChange:pe=>y({...se,value:pe.target.value}),onBlur:Me,onKeyDown:ue,autoFocus:!0})}switch(b){case"sr_no":return $;case"order_number":return r.jsxs(r.Fragment,{children:[L.order_number," ",r.jsxs("span",{style:{opacity:.5},children:["/ ",L.line_item_number]})]});case"po_number":return L.po_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"part_number":return L.part_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"client_name":return L.company_name;case"end_client_name":return L.end_client_name||r.jsx("span",{className:"dim text-xs",children:"Unspecified"});case"planned_dispatch":return We(L.planned_dispatch_date);case"mounting_start":return We(L.mounting_start_date);case"mounting_complete":return We(L.mounting_complete_date);case"wiring_assigned":return We(L.wiring_assigned_date);case"wiring_expected":return We(L.wiring_expected_date);case"expected_qc":return We(L.expected_qc_date);case"priority":return r.jsx("span",{className:`priority-badge ${((Ee=L.priority)==null?void 0:Ee.toLowerCase())||"medium"}`,children:L.priority});case"status":return r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[r.jsx("span",{className:`status-badge ${(L.status||"Not Started").toLowerCase().replace(/\s+/g,"-")}`,children:L.status||"Not Started"}),L.active_dept&&r.jsxs("span",{className:`dept-badge dept-${(L.active_dept||"").toLowerCase()}`,children:["⚙ ",L.active_dept]})]});case"qc_status":return r.jsx("span",{className:`qc-badge ${(L.qc_status||"Pending").toLowerCase()}`,children:L.qc_status||"Pending"});case"qc_date":return We(L.qc_date);case"progress":return r.jsxs("div",{className:"progress-cell",children:[r.jsxs("div",{className:"progress-text",children:[W,"%"]}),r.jsx("div",{className:"progress-track",children:r.jsx("div",{className:"progress-fill",style:{width:`${W}%`,backgroundColor:mp(W)}})})]});case"action":return n?r.jsx("button",{className:"icon-btn",onClick:()=>dp(L),title:"Edit planning data",children:r.jsx(ug,{size:13})}):null;default:return null}},[c,v]=m.useState(!0),[N,P]=m.useState(""),[z,D]=m.useState("all"),[E,T]=m.useState("all"),[H,te]=m.useState(null),[K,J]=m.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[M,G]=m.useState(""),[V,B]=m.useState(""),[S,I]=m.useState([]),[F,Z]=m.useState(!1),[ye,de]=m.useState({end_client_name:!1,planned_dispatch_date:!1,mounting_start_date:!1,mounting_complete_date:!1,wiring_assigned_date:!1,wiring_expected_date:!1,expected_qc_date:!1,priority:!1,status:!1,qc_status:!1,qc_date:!1}),[le,ce]=m.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[se,y]=m.useState(null),[U,R]=m.useState(null),[ee,Y]=m.useState(1),[C,O]=m.useState(20),[ne,ie]=m.useState("none"),[Ne,xe]=m.useState("none"),[Se,op]=m.useState({}),to=b=>{op(L=>({...L,[b]:L[b]===!1}))};m.useEffect(()=>{na()},[]);const na=async()=>{try{const b=await fetch("http://localhost:5000/api/planning",{headers:{Authorization:`Bearer ${e}`}});b.ok&&l(await b.json())}catch(b){console.error("Error fetching planning data:",b)}finally{v(!1)}},dp=b=>{n&&(te(b),J({end_client_name:b.end_client_name||"",planned_dispatch_date:b.planned_dispatch_date?b.planned_dispatch_date.split("T")[0]:"",mounting_start_date:b.mounting_start_date?b.mounting_start_date.split("T")[0]:"",mounting_complete_date:b.mounting_complete_date?b.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:b.wiring_assigned_date?b.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:b.wiring_expected_date?b.wiring_expected_date.split("T")[0]:"",expected_qc_date:b.expected_qc_date?b.expected_qc_date.split("T")[0]:"",priority:b.priority||"Medium",status:b.status||"Not Started",qc_status:b.qc_status||"Pending",qc_date:b.qc_date?b.qc_date.split("T")[0]:""}),G(""),B(""))},Ot=b=>{const{name:L,value:$}=b.target;J(W=>({...W,[L]:$}))},cp=async b=>{b.preventDefault();try{const L=await fetch(`http://localhost:5000/api/planning/line-items/${H.line_item_id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(K)});if(L.ok)B("Planning details updated successfully."),setTimeout(()=>{te(null),na(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const $=await L.json();G($.error||"Failed to update planning details.")}}catch(L){console.error(L),G("Network error, please try again.")}},We=b=>b?new Date(b).toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"}):"—",no=a.filter(b=>{const L=b.order_number.toLowerCase().includes(N.toLowerCase())||(b.po_number||"").toLowerCase().includes(N.toLowerCase())||(b.company_name||"").toLowerCase().includes(N.toLowerCase())||(b.end_client_name||"").toLowerCase().includes(N.toLowerCase()),$=z==="all"||b.status===z,W=E==="all"||b.priority===E;return L&&$&&W}),up=b=>{P(b),Y(1)},pp=b=>{D(b),Y(1)},fp=b=>{T(b),Y(1)},hp=b=>{O(Number(b)),Y(1)},ra=no.length,ln=Math.max(1,Math.ceil(ra/C)),_t=Math.min(ee,ln),er=(_t-1)*C,ro=Math.min(er+C,ra),tr=no.slice(er,ro),mp=b=>b<30?"#ef4444":b<70?"#f59e0b":"#10b981",gp=m.useCallback(()=>{const b=[],$=Math.max(1,_t-3),W=Math.min(ln,_t+3);for(let Q=$;Q<=W;Q++)b.push(Q);return b},[_t,ln]),xp=b=>{I(L=>L.includes(b)?L.filter($=>$!==b):[...L,b])},vp=()=>{const b=tr.map($=>$.line_item_id),L=b.every($=>S.includes($));I(L?$=>$.filter(W=>!b.includes(W)):$=>{const W=[...$];return b.forEach(Q=>{W.includes(Q)||W.push(Q)}),W})},yp=async b=>{b.preventDefault();const L={};let $=!1;if(Object.keys(le).forEach(W=>{le[W]!==""&&(L[W]=le[W],$=!0)}),!$){G("Please modify at least one field to update.");return}v(!0);try{const W=await fetch("http://localhost:5000/api/planning/line-items/bulk",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({lineItemIds:S,fields:L})});if(W.ok)B(`Successfully updated ${S.length} items.`),I([]),setTimeout(()=>{Z(!1),G(""),B(""),ce({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),na(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const Q=await W.json();G(Q.error||"Failed to update selected items."),v(!1)}}catch(W){console.error(W),G("Network error, please try again."),v(!1)}},bp=(b,L,$)=>{if(!n||["INPUT","SELECT","OPTION","BUTTON","A","svg","path"].includes(b.target.tagName))return;let W="";L==="end_client_name"?W=$.end_client_name||"":L==="planned_dispatch"?W=$.planned_dispatch_date?$.planned_dispatch_date.split("T")[0]:"":L==="mounting_start"?W=$.mounting_start_date?$.mounting_start_date.split("T")[0]:"":L==="mounting_complete"?W=$.mounting_complete_date?$.mounting_complete_date.split("T")[0]:"":L==="wiring_assigned"?W=$.wiring_assigned_date?$.wiring_assigned_date.split("T")[0]:"":L==="wiring_expected"?W=$.wiring_expected_date?$.wiring_expected_date.split("T")[0]:"":L==="expected_qc"?W=$.expected_qc_date?$.expected_qc_date.split("T")[0]:"":L==="priority"?W=$.priority||"Medium":L==="status"?W=$.status||"Not Started":L==="qc_status"?W=$.qc_status||"Pending":L==="qc_date"&&(W=$.qc_date?$.qc_date.split("T")[0]:""),y({lineItemId:$.line_item_id,colId:L,value:W,oldValue:W})},ao=async(b,L,$,W)=>{if($===W){y(null);return}R({lineItemId:b,colId:L}),y(null);try{let Q=L;L==="planned_dispatch"?Q="planned_dispatch_date":L==="mounting_start"?Q="mounting_start_date":L==="mounting_complete"?Q="mounting_complete_date":L==="wiring_assigned"?Q="wiring_assigned_date":L==="wiring_expected"?Q="wiring_expected_date":L==="expected_qc"&&(Q="expected_qc_date");const re=a.find(qe=>qe.line_item_id===b);if(!re)throw new Error("Order not found");const Ee={end_client_name:re.end_client_name||"",planned_dispatch_date:re.planned_dispatch_date?re.planned_dispatch_date.split("T")[0]:"",mounting_start_date:re.mounting_start_date?re.mounting_start_date.split("T")[0]:"",mounting_complete_date:re.mounting_complete_date?re.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:re.wiring_assigned_date?re.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:re.wiring_expected_date?re.wiring_expected_date.split("T")[0]:"",expected_qc_date:re.expected_qc_date?re.expected_qc_date.split("T")[0]:"",priority:re.priority||"Medium",status:re.status||"Not Started",qc_status:re.qc_status||"Pending",qc_date:re.qc_date?re.qc_date.split("T")[0]:""};Ee[Q]=$;const ue=await fetch(`http://localhost:5000/api/planning/line-items/${b}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(Ee)});if(ue.ok)await na(),window.dispatchEvent(new CustomEvent("orderUpdated"));else{const qe=await ue.json();alert(qe.error||"Failed to update planning details.")}}catch(Q){console.error(Q),alert("Network error, please try again.")}finally{R(null)}},lo=(b,L)=>{if(!L||L==="none")return"";switch(L){case"planned_dispatch":return We(b.planned_dispatch_date);case"mounting_start":return We(b.mounting_start_date);case"mounting_complete":return We(b.mounting_complete_date);case"delivery_date":return We(b.delivery_date);case"wiring_assigned":return We(b.wiring_assigned_date);case"wiring_expected":return We(b.wiring_expected_date);case"expected_qc":return We(b.expected_qc_date);case"qc_date":return We(b.qc_date);case"client_name":return b.company_name||"Unspecified";case"end_client_name":return b.end_client_name||"Unspecified";case"priority":return b.priority||"Medium";case"status":return b.status||"Not Started";case"qc_status":return b.qc_status||"Pending";case"active_dept":return b.active_dept||"Planning";default:return b[L]||"Unspecified"}},jp=b=>{if(!ne||ne==="none")return{type:"flat",rows:b};const L={};b.forEach(W=>{const Q=lo(W,ne);L[Q]||(L[Q]=[]),L[Q].push(W)});const $={type:"grouped",keys:Object.keys(L).sort(),groups:{}};return Object.keys(L).forEach(W=>{const Q=L[W];if(Ne&&Ne!=="none"){const re={};Q.forEach(Ee=>{const ue=lo(Ee,Ne);re[ue]||(re[ue]=[]),re[ue].push(Ee)}),$.groups[W]={type:"subgrouped",keys:Object.keys(re).sort(),groups:re}}else $.groups[W]={type:"flat",rows:Q}}),$},El=(b,L,$)=>{const W=S.includes(b.line_item_id);return r.jsxs("tr",{className:`planning-row ${W?"selected-row":""}`,children:[n&&r.jsx("td",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},children:r.jsx("input",{type:"checkbox",checked:W,onChange:()=>xp(b.line_item_id)})}),g.map((Q,re)=>{const Ee=re===0;let ue="";["sr_no","order_number","po_number","part_number","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(Q)&&(ue+=" mono"),Q==="order_number"&&(ue+=" font-semibold text-accent");let Me={};Q==="part_number"&&(Me={maxWidth:"120px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}),Ee&&(ue+=" col-sticky-first",Me={...Me,left:n?"40px":0});const pe=["planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","status","qc_date"].includes(Q),pt=se&&se.lineItemId===b.line_item_id&&se.colId===Q,aa=U&&U.lineItemId===b.line_item_id&&U.colId===Q;return n&&pe&&(ue+=" editable-cell"),pt&&(ue+=" is-editing"),aa&&(ue+=" is-saving"),r.jsx("td",{className:ue.trim(),style:Me,title:Q==="part_number"?b.part_number:void 0,onClick:Pl=>pe&&bp(Pl,Q,b),children:u(Q,b,L,$)},Q)})]},b.line_item_id)};return c?r.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"400px",color:"#888"},children:"Loading Planning Records..."}):r.jsxs("div",{className:"planning-module",children:[r.jsxs("div",{className:"planning-controls",children:[r.jsxs("div",{className:"search-box",children:[r.jsx(zl,{size:16,className:"search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by PO, Client, End Client, or Order Number...",value:N,onChange:b=>up(b.target.value)})]}),r.jsxs("div",{className:"filter-group",children:[r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Status"}),r.jsxs("select",{value:z,onChange:b=>pp(b.target.value),children:[r.jsx("option",{value:"all",children:"All Statuses"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{value:E,onChange:b=>fp(b.target.value),children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Group By"}),r.jsxs("select",{value:ne,onChange:b=>{ie(b.target.value),b.target.value==="none"&&xe("none")},children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Then Group By"}),r.jsxs("select",{value:Ne,onChange:b=>xe(b.target.value),disabled:ne==="none",children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsx("button",{className:"reset-columns-btn",onClick:()=>{i(wa),localStorage.removeItem("planning_column_order")},title:"Reset columns to default order",children:"Reset Columns"})]})]}),r.jsx("div",{className:"table-responsive",children:r.jsxs("table",{className:"planning-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[n&&r.jsx("th",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},children:r.jsx("input",{type:"checkbox",checked:tr.length>0&&tr.every(b=>S.includes(b.line_item_id)),onChange:vp})}),g.map((b,L)=>{const $=L===0,W=_(b),Q=p===b,re=s.indexOf(o),Ee=s.indexOf(b);let ue="";Q&&re!==-1&&re!==Ee&&(ue=re<Ee?" drag-over-right":" drag-over-left");let qe={},Me=`${o===b?" dragging":""}${ue}`;return $&&(Me+=" col-sticky-first",qe={left:n?"40px":0}),r.jsx("th",{className:Me.trim(),style:qe,draggable:!0,onDragStart:pe=>h(pe,b),onDragOver:pe=>x(pe,b),onDragLeave:pe=>k(pe,b),onDrop:pe=>j(pe,b),onDragEnd:w,children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(ng,{size:12,className:"drag-handle"}),r.jsx("span",{children:W})]})},b)})]})}),r.jsx("tbody",{children:tr.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:g.length+(n?1:0),style:{textAlign:"center",padding:"32px",color:"#666",fontStyle:"italic"},children:"No planning records match your search criteria."})}):(()=>{const b=jp(tr);if(b.type==="flat")return b.rows.map(($,W)=>{const Q=parseInt($.total_steps||0),re=parseInt($.done_steps||0),Ee=Q>0?Math.round(re/Q*100):0;return El($,er+W+1,Ee)});let L=er;return b.keys.map($=>{const W=b.groups[$],Q=`p:${$}`,re=Se[Q]!==!1;let Ee=0;return W.type==="flat"?Ee=W.rows.length:W.keys.forEach(ue=>{Ee+=W.groups[ue].length}),r.jsxs(Ra.Fragment,{children:[r.jsx("tr",{className:"group-header-row primary",onClick:()=>to(Q),children:r.jsx("td",{colSpan:g.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content",children:[r.jsx("span",{className:"expand-icon",children:re?r.jsx(il,{size:14}):r.jsx(zr,{size:14})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[_(ne),":"]})," ",$]}),r.jsxs("span",{className:"group-badge",children:[Ee," items"]})]})})}),re&&(W.type==="flat"?W.rows.map(ue=>{L++;const qe=parseInt(ue.total_steps||0),Me=parseInt(ue.done_steps||0),pe=qe>0?Math.round(Me/qe*100):0;return El(ue,L,pe)}):W.keys.map(ue=>{const qe=W.groups[ue],Me=`p:${$}|s:${ue}`,pe=Se[Me]!==!1;return r.jsxs(Ra.Fragment,{children:[r.jsx("tr",{className:"group-header-row secondary",onClick:()=>to(Me),children:r.jsx("td",{colSpan:g.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content secondary-content",style:{paddingLeft:"24px"},children:[r.jsx("span",{className:"expand-icon",children:pe?r.jsx(il,{size:12}):r.jsx(zr,{size:12})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[_(Ne),":"]})," ",ue]}),r.jsxs("span",{className:"group-badge secondary-badge",children:[qe.length," items"]})]})})}),pe&&qe.map(pt=>{L++;const aa=parseInt(pt.total_steps||0),Pl=parseInt(pt.done_steps||0),wp=aa>0?Math.round(Pl/aa*100):0;return El(pt,L,wp)})]},Me)}))]},Q)})})()})]})}),r.jsxs("div",{className:"pagination-bar",children:[r.jsxs("div",{className:"pagination-info",children:[r.jsx("span",{className:"row-count",children:ra===0?"No records":`Showing ${er+1}–${ro} of ${ra} records`}),r.jsxs("div",{className:"page-size-control",children:[r.jsx("span",{children:"Rows per page"}),r.jsx("select",{value:C,onChange:b=>hp(b.target.value),children:Hg.map(b=>r.jsx("option",{value:b,children:b},b))})]})]}),r.jsxs("div",{className:"pagination-nav",children:[r.jsx("button",{className:"pg-btn",onClick:()=>Y(1),disabled:_t===1,title:"First page",children:r.jsx(Jm,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>Y(b=>Math.max(1,b-1)),disabled:_t===1,title:"Previous page",children:r.jsx(Km,{size:14})}),gp().map(b=>r.jsx("button",{className:`pg-btn pg-num ${b===_t?"active":""}`,onClick:()=>Y(b),children:b},b)),r.jsx("button",{className:"pg-btn",onClick:()=>Y(b=>Math.min(ln,b+1)),disabled:_t===ln,title:"Next page",children:r.jsx(zr,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>Y(ln),disabled:_t===ln,title:"Last page",children:r.jsx(Xm,{size:14})})]})]}),H&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&te(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Order: ",H.order_number," / Line: ",H.line_item_number," (PO: ",H.po_number||"N/A",")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>te(null),children:r.jsx(Yr,{size:18})})]}),r.jsxs("form",{onSubmit:cp,className:"modal-body",children:[M&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(ol,{size:16}),r.jsx("span",{children:M})]}),V&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(ei,{size:16}),r.jsx("span",{children:V})]}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",name:"planned_dispatch_date",value:K.planned_dispatch_date,onChange:Ot,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",name:"mounting_start_date",value:K.mounting_start_date,onChange:Ot,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",name:"mounting_complete_date",value:K.mounting_complete_date,onChange:Ot,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",name:"wiring_assigned_date",value:K.wiring_assigned_date,onChange:Ot,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",name:"wiring_expected_date",value:K.wiring_expected_date,onChange:Ot,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",name:"expected_qc_date",value:K.expected_qc_date,onChange:Ot,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Overall Planning Status"}),r.jsxs("select",{name:"status",value:K.status,onChange:Ot,className:"form-select",children:[r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",name:"qc_date",value:K.qc_date,onChange:Ot,className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>te(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Save Planning Changes"})]})]})]})}),S.length>0&&r.jsx("div",{className:"bulk-actions-banner",children:r.jsxs("div",{className:"bulk-actions-content",children:[r.jsxs("span",{className:"bulk-count",children:[r.jsx("strong",{children:S.length})," items selected"]}),r.jsxs("div",{className:"bulk-buttons",children:[r.jsx("button",{className:"btn-bulk-edit",onClick:()=>{ce({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),Z(!0)},children:"Bulk Edit Parameters"}),r.jsx("button",{className:"btn-bulk-clear",onClick:()=>I([]),children:"Deselect All"})]})]})}),F&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&Z(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"560px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Updating ",S.length," selected line items"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>Z(!1),children:r.jsx(Yr,{size:18})})]}),r.jsxs("form",{onSubmit:yp,className:"modal-body",children:[M&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(ol,{size:16}),r.jsx("span",{children:M})]}),V&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(ei,{size:16}),r.jsx("span",{children:V})]}),r.jsx("p",{className:"bulk-instructions",children:"Enter values or select options for parameters you want to update for all selected items. Blank fields will remain unchanged."}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",value:le.planned_dispatch_date,onChange:b=>ce({...le,planned_dispatch_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",value:le.mounting_start_date,onChange:b=>ce({...le,mounting_start_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",value:le.mounting_complete_date,onChange:b=>ce({...le,mounting_complete_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",value:le.wiring_assigned_date,onChange:b=>ce({...le,wiring_assigned_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",value:le.wiring_expected_date,onChange:b=>ce({...le,wiring_expected_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",value:le.expected_qc_date,onChange:b=>ce({...le,expected_qc_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planning Status"}),r.jsxs("select",{value:le.status,onChange:b=>ce({...le,status:b.target.value}),className:"form-select",children:[r.jsx("option",{value:"",children:"Leave unchanged"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",value:le.qc_date,onChange:b=>ce({...le,qc_date:b.target.value}),className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>Z(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Apply Bulk Changes"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .planning-module {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .planning-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background: var(--bg2, #14161a);
          border: 1px solid var(--border, #2a2f3a);
          border-radius: var(--radius-lg, 10px);
          padding: 12px 16px;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 480px;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text3, #5a6070);
          pointer-events: none;
        }

        .search-box input {
          width: 100%;
          background: var(--bg, #0e0f11);
          border: 1px solid var(--border2, #363d4a);
          border-radius: var(--radius, 6px);
          padding: 8px 12px 8px 36px;
          color: var(--text, #e8eaf0);
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s;
        }

        .search-box input:focus {
          border-color: var(--accent, #f59e0b);
        }

        .filter-group {
          display: flex;
          gap: 12px;
        }

        .filter-select-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-select-wrapper label {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text3, #5a6070);
        }

        .filter-select-wrapper select {
          background: var(--bg, #0e0f11);
          border: 1px solid var(--border2, #363d4a);
          border-radius: var(--radius, 6px);
          padding: 6px 12px;
          color: var(--text2, #8a93a8);
          font-size: 12px;
          outline: none;
          cursor: pointer;
        }

        .filter-select-wrapper select:focus {
          border-color: var(--accent, #f59e0b);
          color: var(--text, #e8eaf0);
        }

        /* ─── Table ─── */
        .table-responsive {
          background: var(--bg2, #14161a);
          border: 1px solid var(--border, #2a2f3a);
          border-radius: var(--radius-lg, 10px);
          overflow-x: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .planning-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 12px;
          text-align: left;
        }

        .planning-table th {
          background: var(--bg2, #14161a);
          border-bottom: 1px solid var(--border, #2a2f3a);
          padding: 12px 14px;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: var(--text2, #8a93a8);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
          white-space: nowrap;
          position: sticky;
          top: 0;
          z-index: 2;
        }

        /* Sticky first column */
        .col-sticky {
          position: sticky !important;
          left: 0;
          z-index: 3 !important;
          background: var(--bg2, #14161a) !important;
          box-shadow: 2px 0 6px rgba(0,0,0,0.3);
        }

        .col-sticky-td {
          background: var(--bg2, #14161a);
          box-shadow: 2px 0 6px rgba(0,0,0,0.3);
        }

        .planning-row:hover .col-sticky-td {
          background: #1a1d23;
        }

        .planning-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: background 0.15s;
        }

        .planning-row:hover {
          background: #1a1d23;
        }

        /* Draggable Columns styling */
        .planning-table th {
          cursor: grab;
          transition: background-color 0.15s, box-shadow 0.15s;
        }
        .planning-table th:active {
          cursor: grabbing;
        }
        .drag-handle {
          color: var(--text3, #5a6070);
          opacity: 0.4;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        .planning-table th:hover .drag-handle {
          opacity: 0.9;
          color: var(--accent, #f59e0b);
        }
        .dragging {
          opacity: 0.4;
          border: 1px dashed var(--accent, #f59e0b) !important;
        }
        .drag-over-left {
          box-shadow: inset 3px 0 0 0 var(--accent, #f59e0b) !important;
        }
        .drag-over-right {
          box-shadow: inset -3px 0 0 0 var(--accent, #f59e0b) !important;
        }

        .reset-columns-btn {
          align-self: flex-end;
          background: none;
          border: 1px solid var(--border2, #363d4a);
          color: var(--text2, #8a93a8);
          padding: 6px 12px;
          height: 32px;
          border-radius: var(--radius, 6px);
          font-size: 11px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .reset-columns-btn:hover {
          border-color: var(--accent, #f59e0b);
          color: var(--text, #e8eaf0);
          background: rgba(245,158,11,0.05);
        }

        .planning-table td {
          padding: 10px 14px;
          color: var(--text, #e8eaf0);
          white-space: nowrap;
          vertical-align: middle;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .planning-table td.mono {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text2, #8a93a8);
        }

        .text-accent { color: var(--accent, #f59e0b) !important; }
        .font-semibold { font-weight: 600; }
        .dim { color: var(--text3, #5a6070); }
        .text-xs { font-size: 10px; }

        .priority-badge {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
        }
        .priority-badge.low    { background: rgba(156,163,175,0.1); color: #9ca3af; border: 1px solid rgba(156,163,175,0.2); }
        .priority-badge.medium { background: rgba(59,130,246,0.1);  color: #60a5fa; border: 1px solid rgba(59,130,246,0.2);  }
        .priority-badge.high   { background: rgba(245,158,11,0.1);  color: #fbbf24; border: 1px solid rgba(245,158,11,0.2);  }
        .priority-badge.urgent { background: rgba(239,68,68,0.1);   color: #f87171; border: 1px solid rgba(239,68,68,0.2);   }

        .status-badge {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
        }
        .status-badge.not-started          { background: rgba(156,163,175,0.1); color: #9ca3af; border: 1px solid rgba(156,163,175,0.2); }
        .status-badge.in-progress          { background: rgba(59,130,246,0.1);  color: #3b82f6; border: 1px solid rgba(59,130,246,0.2);  }
        .status-badge.waiting-for-material { background: rgba(167,139,250,0.1); color: #a78bfa; border: 1px solid rgba(167,139,250,0.2); }
        .status-badge.qc-testing           { background: rgba(245,158,11,0.1);  color: #f59e0b; border: 1px solid rgba(245,158,11,0.2);  }
        .status-badge.completed            { background: rgba(34,197,94,0.1);   color: #22c55e; border: 1px solid rgba(34,197,94,0.2);   }

        .qc-badge {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
        }
        .qc-badge.pending { background: rgba(245,158,11,0.08); color: #fbbf24; }
        .qc-badge.pass    { background: rgba(34,197,94,0.08);  color: #22c55e; }
        .qc-badge.fail    { background: rgba(239,68,68,0.08);  color: #ef4444; }

        /* Department badge in Status column */
        .dept-badge {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          letter-spacing: 0.5px;
        }
        .dept-badge.dept-planning    { background: rgba(156,163,175,0.12); color: #9ca3af; }
        .dept-badge.dept-sales       { background: rgba(99,102,241,0.15);  color: #818cf8; }
        .dept-badge.dept-design      { background: rgba(167,139,250,0.15); color: #c084fc; }
        .dept-badge.dept-purchase    { background: rgba(251,191,36,0.12);  color: #fbbf24; }
        .dept-badge.dept-stores      { background: rgba(251,191,36,0.12);  color: #fbbf24; }
        .dept-badge.dept-production  { background: rgba(59,130,246,0.15);  color: #60a5fa; }
        .dept-badge.dept-qc          { background: rgba(245,158,11,0.15);  color: #f59e0b; }
        .dept-badge.dept-dispatch    { background: rgba(34,197,94,0.15);   color: #4ade80; }
        .dept-badge.dept-accounts    { background: rgba(34,197,94,0.15);   color: #4ade80; }

        .progress-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 110px;
        }

        .progress-text {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: var(--text, #e8eaf0);
          font-weight: 600;
          width: 28px;
          text-align: right;
        }

        .progress-track {
          flex: 1;
          height: 5px;
          background: var(--bg4, #242830);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease-out;
        }

        .icon-btn {
          background: none;
          border: 1px solid var(--border2, #363d4a);
          color: var(--text2, #8a93a8);
          padding: 4px 6px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn:hover {
          border-color: var(--accent, #f59e0b);
          color: var(--text, #e8eaf0);
          background: rgba(245,158,11,0.05);
        }

        /* ─── Pagination Bar ─── */
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: var(--bg2, #14161a);
          border: 1px solid var(--border, #2a2f3a);
          border-radius: var(--radius-lg, 10px);
          padding: 10px 16px;
          flex-wrap: wrap;
        }

        .pagination-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .row-count {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text2, #8a93a8);
        }

        .page-size-control {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: var(--text3, #5a6070);
        }

        .page-size-control select {
          background: var(--bg, #0e0f11);
          border: 1px solid var(--border2, #363d4a);
          border-radius: 5px;
          padding: 4px 8px;
          color: var(--text2, #8a93a8);
          font-size: 11px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
        }

        .page-size-control select:focus {
          border-color: var(--accent, #f59e0b);
        }

        .pagination-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .pg-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 30px;
          height: 30px;
          padding: 0 6px;
          background: var(--bg, #0e0f11);
          border: 1px solid var(--border2, #363d4a);
          border-radius: 6px;
          color: var(--text2, #8a93a8);
          font-size: 12px;
          font-family: var(--font-mono, monospace);
          cursor: pointer;
          transition: all 0.15s;
          user-select: none;
        }

        .pg-btn:hover:not(:disabled) {
          border-color: var(--accent, #f59e0b);
          color: var(--text, #e8eaf0);
          background: rgba(245,158,11,0.06);
        }

        .pg-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .pg-btn.active {
          background: var(--accent, #f59e0b);
          border-color: var(--accent, #f59e0b);
          color: #000;
          font-weight: 700;
        }

        /* Modal Styles */
        .modal-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .modal-form-grid .full {
          grid-column: span 2;
        }

        .modal-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .modal-field label {
          font-size: 10px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          color: var(--text3, #5a6070);
          letter-spacing: 0.5px;
        }

        .alert-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 14px;
          line-height: 1.4;
        }

        .alert-message.error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }

        .alert-message.success {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          color: #4ade80;
        }

        /* ── Sticky Checkbox Column ── */
        .col-sticky-checkbox {
          position: sticky !important;
          left: 0;
          z-index: 3 !important;
          background: var(--bg2, #14161a) !important;
          border-right: 1px solid var(--border, #2a2f3a);
          width: 40px;
          min-width: 40px;
          text-align: center;
          vertical-align: middle;
        }

        .col-sticky-checkbox input[type="checkbox"] {
          cursor: pointer;
          accent-color: var(--accent, #f59e0b);
          width: 14px;
          height: 14px;
          vertical-align: middle;
        }

        .col-sticky-first {
          position: sticky !important;
          z-index: 3 !important;
          background: var(--bg2, #14161a) !important;
          box-shadow: 2px 0 6px rgba(0, 0, 0, 0.3);
        }

        .selected-row {
          background: rgba(245, 158, 11, 0.03) !important;
        }

        .selected-row:hover {
          background: rgba(245, 158, 11, 0.06) !important;
        }

        /* ── Click-to-Edit Styles ── */
        .planning-table td.editable-cell {
          cursor: pointer;
          position: relative;
          transition: background-color 0.15s;
        }

        .planning-table td.editable-cell:hover {
          background: rgba(245, 158, 11, 0.05) !important;
        }

        .planning-table td.editable-cell::after {
          content: '✎';
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: var(--text3, #5a6070);
          opacity: 0;
          transition: opacity 0.15s;
          pointer-events: none;
        }

        .planning-table td.editable-cell:hover::after {
          opacity: 0.6;
        }

        .planning-table td.editable-cell.is-editing::after,
        .planning-table td.editable-cell.is-saving::after {
          display: none !important;
        }

        .inline-edit-input, .inline-edit-select {
          width: 100%;
          background: var(--bg, #0e0f11);
          border: 1px solid var(--accent, #f59e0b);
          border-radius: 4px;
          padding: 4px 6px;
          color: var(--text, #e8eaf0);
          font-size: 11px;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
        }

        .inline-edit-input:focus, .inline-edit-select:focus {
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
        }

        .inline-saving-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(245, 158, 11, 0.2);
          border-top-color: var(--accent, #f59e0b);
          border-radius: 50%;
          animation: inline-spin 0.6s linear infinite;
          display: inline-block;
          margin-right: 4px;
        }

        @keyframes inline-spin {
          to { transform: rotate(360deg); }
        }

        /* ── Bulk Actions Floating Banner ── */
        .bulk-actions-banner {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99;
          background: rgba(20, 22, 26, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(245, 158, 11, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 16px rgba(245, 158, 11, 0.1);
          border-radius: 12px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          max-width: 90%;
          width: 500px;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .bulk-actions-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 16px;
        }

        .bulk-count {
          color: var(--text, #e8eaf0);
          font-size: 13px;
        }

        .bulk-count strong {
          color: var(--accent, #f59e0b);
          font-size: 15px;
        }

        .bulk-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-bulk-edit {
          background: var(--accent, #f59e0b);
          border: none;
          color: #000;
          font-weight: 600;
          font-size: 12px;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }

        .btn-bulk-edit:hover {
          background: #d97706;
        }

        .btn-bulk-edit:active {
          transform: scale(0.98);
        }

        .btn-bulk-clear {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border2, #363d4a);
          color: var(--text2, #8a93a8);
          font-weight: 500;
          font-size: 12px;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-bulk-clear:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text, #e8eaf0);
          border-color: var(--border, #2a2f3a);
        }

        /* ── Bulk Edit Modal Styles ── */
        .bulk-instructions {
          font-size: 12px;
          color: var(--text2, #8a93a8);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .bulk-grid {
          gap: 16px 20px;
        }

        .bulk-field-row {
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          padding-bottom: 12px;
        }

        .bulk-field-row input[type="checkbox"] {
          margin-top: 26px;
          cursor: pointer;
          accent-color: var(--accent, #f59e0b);
          width: 14px;
          height: 14px;
        }

        .bulk-field-row.full input[type="checkbox"] {
          margin-top: 26px;
        }

        .bulk-field-input-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bulk-field-input-wrapper label {
          font-size: 10px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          color: var(--text3, #5a6070);
          letter-spacing: 0.5px;
        }

        .bulk-field-input-wrapper input:disabled,
        .bulk-field-input-wrapper select:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: rgba(0, 0, 0, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.05) !important;
        }

        /* ── Grouping Styles ── */
        .group-header-row {
          background: var(--bg2, #14161a) !important;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.15s;
        }
        .group-header-row:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .group-header-row.primary {
          border-bottom: 2px solid var(--border2, #363d4a);
        }
        .group-header-row.secondary {
          border-bottom: 1px dashed var(--border, #2a2f3a);
        }
        .group-header-content {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          color: var(--text, #e8eaf0);
          font-size: 13px;
        }
        .secondary-content {
          font-size: 12px;
          color: var(--text2, #8a93a8);
        }
        .expand-icon {
          color: var(--accent, #f59e0b);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
        }
        .group-title {
          font-family: var(--font-mono, monospace);
        }
        .group-badge {
          background: rgba(245, 158, 11, 0.1);
          color: var(--accent, #f59e0b);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .secondary-badge {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text2, #8a93a8);
        }
      `}})]})}function Yg(){const[e,t]=m.useState(()=>localStorage.getItem("erp_company_name")||"Vyom ERP"),[n,a]=m.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing"),[l,s]=m.useState(()=>localStorage.getItem("erp_timezone")||"IST (UTC+05:30)"),[i,o]=m.useState(()=>localStorage.getItem("erp_default_page_size")||"20"),[d,p]=m.useState(()=>localStorage.getItem("erp_double_grouping")!=="false"),[f,h]=m.useState(()=>localStorage.getItem("erp_auto_qc_calc")==="true"),[x,k]=m.useState(()=>localStorage.getItem("erp_planning_fs_default")==="true"),[j,w]=m.useState("general"),[_,g]=m.useState(!1),[u,c]=m.useState(!1),[v,N]=m.useState(""),[P,z]=m.useState(!1),D=async T=>{T.preventDefault(),g(!0),c(!1),setTimeout(()=>{localStorage.setItem("erp_company_name",e),localStorage.setItem("erp_system_title",n),localStorage.setItem("erp_timezone",l),localStorage.setItem("erp_default_page_size",i),localStorage.setItem("erp_double_grouping",d?"true":"false"),localStorage.setItem("erp_auto_qc_calc",f?"true":"false"),localStorage.setItem("erp_planning_fs_default",x?"true":"false"),g(!1),c(!0),window.dispatchEvent(new CustomEvent("erpSettingsUpdated")),setTimeout(()=>c(!1),3e3)},800)},E=T=>{window.confirm(`Are you sure you want to run: "${T}"? This action cannot be undone.`)&&(z(!0),N(""),setTimeout(()=>{z(!1),T==="Clear Activity Logs"?N("Activity logs cleared successfully (simulated)."):T==="Reset Database"?N("Database reset and re-seeded successfully."):T==="Backup Database"&&N("Database backup generated: vyom_erp_backup_"+new Date().toISOString().split("T")[0]+".sql"),setTimeout(()=>N(""),5e3)},1200))};return r.jsxs("div",{style:{padding:"24px"},className:"settings-container",children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(ti,{size:22,style:{color:"#f59e0b"}}),"Administration Settings"]})}),r.jsxs("div",{className:"settings-layout",children:[r.jsxs("div",{className:"settings-tabs",children:[r.jsxs("button",{className:`tab-btn ${j==="general"?"active":""}`,onClick:()=>w("general"),children:[r.jsx(hg,{size:14}),"General Setup"]}),r.jsxs("button",{className:`tab-btn ${j==="workflow"?"active":""}`,onClick:()=>w("workflow"),children:[r.jsx(ti,{size:14}),"Workflow & Features"]}),r.jsxs("button",{className:`tab-btn ${j==="maintenance"?"active":""}`,onClick:()=>w("maintenance"),children:[r.jsx(fg,{size:14}),"System Maintenance"]})]}),r.jsxs("div",{className:"settings-content",children:[j==="general"&&r.jsxs("form",{onSubmit:D,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"General System Configurations"}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Company Name (Logo Text)"}),r.jsx("input",{type:"text",value:e,onChange:T=>t(T.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"This label appears on the top-left logo header."})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"System/Factory Title"}),r.jsx("input",{type:"text",value:n,onChange:T=>a(T.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"Descriptive subtitle shown next to the logo."})]}),r.jsxs("div",{className:"form-row",children:[r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"System Timezone"}),r.jsxs("select",{value:l,onChange:T=>s(T.target.value),children:[r.jsx("option",{value:"IST (UTC+05:30)",children:"India Standard Time (IST)"}),r.jsx("option",{value:"UTC",children:"Coordinated Universal Time (UTC)"}),r.jsx("option",{value:"EST (UTC-05:00)",children:"Eastern Standard Time (EST)"}),r.jsx("option",{value:"GMT",children:"Greenwich Mean Time (GMT)"})]})]}),r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"Default Page Size"}),r.jsxs("select",{value:i,onChange:T=>o(T.target.value),children:[r.jsx("option",{value:"10",children:"10 Rows per page"}),r.jsx("option",{value:"20",children:"20 Rows per page"}),r.jsx("option",{value:"50",children:"50 Rows per page"}),r.jsx("option",{value:"100",children:"100 Rows per page"})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:_,children:[_?r.jsx($n,{size:14,className:"spin"}):r.jsx(_d,{size:14}),_?"Saving...":"Save Settings"]}),u&&r.jsxs("span",{className:"success-msg",children:[r.jsx(as,{size:14})," Settings updated successfully!"]})]})]}),j==="workflow"&&r.jsxs("form",{onSubmit:D,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"Planning Module & Workflow Toggles"}),r.jsxs("div",{className:"toggle-group",children:[r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"enableDoubleGrouping",checked:d,onChange:T=>p(T.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"enableDoubleGrouping",children:"Enable Double Grouping Filter"}),r.jsx("span",{className:"toggle-desc",children:"Allows planning board users to apply a secondary group parameter simultaneously."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"autoQCFromSteps",checked:f,onChange:T=>h(T.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"autoQCFromSteps",children:"Auto-calculate QC Status"}),r.jsx("span",{className:"toggle-desc",children:"Automatically update line item QC status to completed when all QC department steps are checked off."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"planningFullscreenDefault",checked:x,onChange:T=>k(T.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"planningFullscreenDefault",children:"Planning Board Fullscreen by Default"}),r.jsx("span",{className:"toggle-desc",children:"Loads the Planning Module in fullscreen mode automatically."})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:_,children:[_?r.jsx($n,{size:14,className:"spin"}):r.jsx(_d,{size:14}),_?"Saving...":"Save Settings"]}),u&&r.jsxs("span",{className:"success-msg",children:[r.jsx(as,{size:14})," Workflow updated successfully!"]})]})]}),j==="maintenance"&&r.jsxs("div",{className:"settings-form",children:[r.jsx("h3",{className:"section-title text-danger",children:"System Operations & Diagnostics"}),r.jsx("p",{className:"danger-notice",children:"WARNING: The operations below are administrative privileges. Running them can modify systemic operational states or reset logging indices."}),r.jsxs("div",{className:"maintenance-actions",children:[r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Database Backup"}),r.jsx("p",{children:"Generate a complete SQL schema and data export dump for emergency recovery."})]}),r.jsx("button",{onClick:()=>E("Backup Database"),className:"maint-btn secondary",disabled:P,children:"Backup DB"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Clear Activity Logs"}),r.jsx("p",{children:"Trims or wipes the system activity logger history database to conserve resources."})]}),r.jsx("button",{onClick:()=>E("Clear Activity Logs"),className:"maint-btn warning",disabled:P,children:"Wipe Logs"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Factory Reset ERP"}),r.jsx("p",{children:"Re-seeds and formats databases to standard template values (removes testing orders)."})]}),r.jsx("button",{onClick:()=>E("Reset Database"),className:"maint-btn danger",disabled:P,children:"Factory Reset"})]})]}),P&&r.jsxs("div",{className:"maintenance-loader",children:[r.jsx($n,{size:18,className:"spin"})," Running operations..."]}),v&&r.jsxs("div",{className:"maintenance-result",children:[r.jsx(as,{size:14})," ",v]})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .settings-layout {
          display: flex;
          gap: 24px;
          margin-top: 16px;
        }

        .settings-tabs {
          width: 240px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border2, #363d4a);
          color: var(--text2, #8a93a8);
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          transition: all 0.15s;
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text, #e8eaf0);
        }

        .tab-btn.active {
          background: rgba(245, 158, 11, 0.1);
          color: var(--accent, #f59e0b);
          border-color: var(--accent, #f59e0b);
        }

        .settings-content {
          flex: 1;
          background: #14161a;
          border: 1px solid var(--border2, #363d4a);
          border-radius: 12px;
          padding: 24px 30px;
          min-height: 400px;
        }

        .section-title {
          margin-top: 0;
          margin-bottom: 20px;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 10px;
        }

        .section-title.text-danger {
          color: #f87171;
        }

        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-row {
          display: flex;
          gap: 20px;
        }

        .form-group.half {
          flex: 1;
        }

        .form-group label {
          color: var(--text2, #8a93a8);
          font-size: 12px;
          font-weight: 500;
        }

        .form-group input[type="text"],
        .form-group select {
          background: #0e0f11;
          border: 1px solid var(--border2, #363d4a);
          border-radius: 6px;
          color: var(--text, #e8eaf0);
          padding: 10px 12px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input[type="text"]:focus,
        .form-group select:focus {
          border-color: var(--accent, #f59e0b);
        }

        .helper-text {
          font-size: 11px;
          color: var(--text3, #5a6070);
        }

        .toggle-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .toggle-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.02);
        }

        .toggle-item input[type="checkbox"] {
          margin-top: 3px;
          cursor: pointer;
          accent-color: var(--accent, #f59e0b);
          width: 15px;
          height: 15px;
        }

        .toggle-label-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toggle-label-group label {
          color: var(--text, #e8eaf0);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .toggle-desc {
          font-size: 11px;
          color: var(--text2, #8a93a8);
        }

        .danger-notice {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #f87171;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .maintenance-actions {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .maintenance-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          border: 1px solid var(--border2, #363d4a);
        }

        .card-info h4 {
          margin: 0 0 4px;
          color: var(--text, #e8eaf0);
          font-size: 13px;
          font-weight: 600;
        }

        .card-info p {
          margin: 0;
          color: var(--text2, #8a93a8);
          font-size: 11px;
        }

        .maint-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background 0.15s;
        }

        .maint-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #e8eaf0;
        }
        .maint-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .maint-btn.warning {
          background: rgba(245, 158, 11, 0.15);
          color: var(--accent, #f59e0b);
        }
        .maint-btn.warning:hover {
          background: rgba(245, 158, 11, 0.25);
        }

        .maint-btn.danger {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }
        .maint-btn.danger:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .maintenance-loader {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          font-size: 12px;
          color: var(--text2, #8a93a8);
        }

        .maintenance-result {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          font-size: 12px;
          color: var(--accent, #f59e0b);
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.15);
          padding: 10px 14px;
          border-radius: 6px;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--accent, #f59e0b);
          border: none;
          color: #000;
          font-weight: 600;
          font-size: 13px;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }

        .save-btn:hover:not(:disabled) {
          background: #d97706;
        }

        .save-btn:active {
          transform: scale(0.98);
        }

        .success-msg {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #22c55e;
          font-size: 12px;
          font-weight: 500;
        }

        .spin {
          animation: spin-anim 1s linear infinite;
        }

        @keyframes spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}})]})}const zd={Urgent:{color:"#ef4444",bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.3)"},High:{color:"#f59e0b",bg:"rgba(245,158,11,0.12)",border:"rgba(245,158,11,0.3)"},Medium:{color:"#3b82f6",bg:"rgba(59,130,246,0.12)",border:"rgba(59,130,246,0.3)"},Low:{color:"#6b7280",bg:"rgba(107,114,128,0.12)",border:"rgba(107,114,128,0.3)"}},cl={done:{label:"Done",color:"#10b981",bg:"rgba(16,185,129,0.12)",icon:"✓"},inprogress:{label:"In Progress",color:"#f59e0b",bg:"rgba(245,158,11,0.12)",icon:"◉"},pending:{label:"Pending",color:"#6b7280",bg:"rgba(107,114,128,0.12)",icon:"○"},blocked:{label:"Blocked",color:"#ef4444",bg:"rgba(239,68,68,0.12)",icon:"✕"},review:{label:"Review",color:"#8b5cf6",bg:"rgba(139,92,246,0.12)",icon:"⟳"}},ip={Design:"#6366f1",Purchase:"#f59e0b",Stores:"#10b981",Production:"#3b82f6",QC:"#8b5cf6",Dispatch:"#ec4899",Accounts:"#14b8a6",Sales:"#f97316"};function Gg(e){const t={};for(const n of e){const a=n.order_number;t[a]||(t[a]={order_number:n.order_number,order_id:n.order_id,priority:n.priority,delivery_date:n.delivery_date,company_name:n.company_name,company_city:n.company_city,units:[]}),t[a].units.push(n)}return Object.values(t)}function Kg({step:e,onStatusChange:t,canEdit:n}){const a=cl[e.status]||cl.pending;return r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:20,background:a.bg,border:`1px solid ${a.color}33`,fontSize:11,color:a.color,fontWeight:600},children:[r.jsx("span",{children:a.icon}),r.jsx("span",{children:e.name}),n&&r.jsxs("select",{value:e.status,onChange:l=>t(e.id,l.target.value),onClick:l=>l.stopPropagation(),style:{background:"transparent",border:"none",color:a.color,fontSize:10,cursor:"pointer",outline:"none",padding:0},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]})]})}function Jg({unit:e,dept:t,onStepStatusChange:n,users:a,canEdit:l}){const[s,i]=m.useState(!1),o=e.dept_steps||[],d=o.filter(x=>x.status==="done").length,p=d===o.length&&o.length>0,f=o.some(x=>x.status==="blocked"),h=f?"var(--red)":p?"var(--green)":"transparent";return r.jsxs(r.Fragment,{children:[r.jsxs("tr",{onClick:()=>i(x=>!x),style:{cursor:"pointer",borderLeft:`3px solid ${h}`,background:s?"var(--bg3)":"transparent",transition:"background 0.15s"},className:"worklist-row",children:[r.jsxs("td",{style:{padding:"10px 14px",display:"flex",alignItems:"center",gap:8},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:11,marginRight:4},children:s?r.jsx(il,{size:12}):r.jsx(zr,{size:12})}),r.jsx("span",{style:{fontFamily:"monospace",fontWeight:700,color:"var(--text)",fontSize:13},children:e.unit_serial})]}),r.jsxs("td",{style:{padding:"10px 14px",color:"var(--text2)",fontSize:12},children:[e.material_description,e.part_number&&r.jsxs("span",{style:{marginLeft:6,color:"var(--text3)",fontSize:10},children:["(",e.part_number,")"]})]}),r.jsx("td",{style:{padding:"10px 14px"},children:r.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:o.length===0?r.jsx("span",{style:{color:"#475569",fontSize:11,fontStyle:"italic"},children:"No steps"}):o.map(x=>r.jsx(Kg,{step:x,canEdit:l,onStatusChange:(k,j)=>n(e.unit_id,k,j)},x.id))})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:p?"var(--green)":f?"var(--red)":"var(--text2)"},children:[p?r.jsx(ei,{size:13}):f?r.jsx(ol,{size:13}):r.jsx(np,{size:13}),d,"/",o.length]})})]}),s&&o.length>0&&r.jsx("tr",{style:{background:"var(--bg3)"},children:r.jsx("td",{colSpan:4,style:{padding:"12px 24px 16px 48px"},children:r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:o.map(x=>{const k=cl[x.status]||cl.pending,j=a.find(w=>w.id===x.assigned_user_id);return r.jsxs("div",{style:{background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[r.jsxs("div",{children:[r.jsx("div",{style:{fontWeight:600,color:"var(--text)",fontSize:13},children:x.name}),x.notes&&r.jsx("div",{style:{color:"var(--text3)",fontSize:11,marginTop:2,fontStyle:"italic"},children:x.notes}),j&&r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4,marginTop:4,color:"var(--green)",fontSize:11},children:[r.jsx(eo,{size:10}),j.username]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[x.updated&&r.jsx("span",{style:{color:"var(--text3)",fontSize:10},children:x.updated}),l?r.jsxs("select",{value:x.status,onChange:w=>n(e.unit_id,x.id,w.target.value),style:{background:k.bg,border:`1px solid ${k.color}44`,color:k.color,fontSize:11,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontWeight:600,outline:"none"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("span",{style:{background:k.bg,border:`1px solid ${k.color}44`,color:k.color,fontSize:11,borderRadius:6,padding:"4px 8px",fontWeight:600},children:k.label})]})]},x.id)})})})})]})}function Xg({group:e,dept:t,onStepStatusChange:n,users:a,canEdit:l}){const[s,i]=m.useState(!1),o=zd[e.priority]||zd.Medium,d=ip[t]||"#6366f1",p=e.units.reduce((k,j)=>k+(j.dept_steps||[]).length,0),f=e.units.reduce((k,j)=>k+(j.dept_steps||[]).filter(w=>w.status==="done").length,0),h=p>0?Math.round(f/p*100):0,x=e.delivery_date&&new Date(e.delivery_date)<new Date;return r.jsxs("div",{style:{background:"var(--bg2)",borderRadius:12,overflow:"hidden",border:"1px solid var(--border)",marginBottom:16,boxShadow:"0 4px 12px rgba(0,0,0,0.1)"},children:[r.jsxs("div",{onClick:()=>i(k=>!k),style:{padding:"14px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",background:"var(--bg3)",borderBottom:s?"none":"1px solid var(--border)",userSelect:"none"},children:[r.jsx("span",{style:{color:"var(--text3)"},children:s?r.jsx(zr,{size:15}):r.jsx(il,{size:15})}),r.jsx("div",{style:{fontFamily:"monospace",fontWeight:800,color:"var(--text)",fontSize:15,letterSpacing:.5},children:e.order_number}),e.company_name&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:12},children:["🏢 ",e.company_name,e.company_city?` · ${e.company_city}`:""]}),r.jsxs("div",{style:{marginLeft:"auto",display:"flex",alignItems:"center",gap:10},children:[e.delivery_date&&r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4,fontSize:11,color:x?"#ef4444":"#64748b"},children:[r.jsx(tp,{size:11}),new Date(e.delivery_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),x&&r.jsx("span",{style:{color:"#ef4444",fontWeight:700},children:"· OVERDUE"})]}),r.jsx("span",{style:{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:800,background:o.bg,color:o.color,border:`1px solid ${o.border}`,textTransform:"uppercase",letterSpacing:.5},children:e.priority}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[r.jsx("div",{style:{width:70,height:5,background:"var(--border2)",borderRadius:10,overflow:"hidden"},children:r.jsx("div",{style:{height:"100%",width:`${h}%`,borderRadius:10,background:h===100?"var(--green)":d,transition:"width 0.4s"}})}),r.jsxs("span",{style:{fontSize:11,color:"var(--text3)",fontWeight:600},children:[h,"%"]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--text3)"},children:[r.jsx(rg,{size:11}),e.units.length," unit",e.units.length!==1?"s":""]})]})]}),!s&&r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"var(--bg3)",borderBottom:"1px solid var(--border)"},children:[r.jsx("th",{style:{padding:"8px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Unit ID"}),r.jsx("th",{style:{padding:"8px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Item"}),r.jsx("th",{style:{padding:"8px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Tasks"}),r.jsx("th",{style:{padding:"8px 14px",textAlign:"center",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Progress"})]})}),r.jsx("tbody",{children:e.units.map(k=>r.jsx(Jg,{unit:k,dept:t,onStepStatusChange:n,users:a,canEdit:l},k.unit_id))})]})]})}function Zg({dept:e}){const[t,n]=m.useState([]),[a,l]=m.useState([]),[s,i]=m.useState(!0),[o,d]=m.useState(!1),[p,f]=m.useState("all"),[h,x]=m.useState(""),k=localStorage.getItem("token"),j=JSON.parse(localStorage.getItem("user")||"{}"),w=["Admin","Manager",e].includes(j.role),_=ip[e]||"#6366f1",g=m.useCallback(async(E=!1)=>{E?d(!0):i(!0);try{const[T,H]=await Promise.all([fetch(`http://localhost:5000/api/dept-worklist/${encodeURIComponent(e)}`,{headers:{Authorization:`Bearer ${k}`}}),fetch("http://localhost:5000/api/users",{headers:{Authorization:`Bearer ${k}`}})]);T.ok&&n(await T.json()),H.ok&&l(await H.json())}finally{i(!1),d(!1)}},[e,k]);m.useEffect(()=>{g()},[g]),m.useEffect(()=>{const E=()=>g(!0);return window.addEventListener("orderUpdated",E),()=>window.removeEventListener("orderUpdated",E)},[g]);const u=async(E,T,H)=>{try{(await fetch(`http://localhost:5000/api/units/${E}/steps/${T}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${k}`},body:JSON.stringify({status:H})})).ok&&(n(K=>K.map(J=>J.unit_id!==E?J:{...J,dept_steps:(J.dept_steps||[]).map(M=>M.id===T?{...M,status:H}:M)})),window.dispatchEvent(new CustomEvent("orderUpdated")))}catch(te){console.error("Failed to update step",te)}},c=t.filter(E=>{var T,H,te,K;if(h){const J=h.toLowerCase();if(!(((T=E.unit_serial)==null?void 0:T.toLowerCase().includes(J))||((H=E.order_number)==null?void 0:H.toLowerCase().includes(J))||((te=E.material_description)==null?void 0:te.toLowerCase().includes(J))||((K=E.company_name)==null?void 0:K.toLowerCase().includes(J))))return!1}if(p==="done"){const J=E.dept_steps||[];return J.length>0&&J.every(M=>M.status==="done")}if(p==="inprogress")return(E.dept_steps||[]).some(M=>M.status==="inprogress");if(p==="pending"){const J=E.dept_steps||[];return J.every(M=>M.status==="pending")||J.length===0}return!0}),v=Gg(c),N=t.length,P=t.filter(E=>(E.dept_steps||[]).every(T=>T.status==="done")&&(E.dept_steps||[]).length>0).length,z=t.filter(E=>(E.dept_steps||[]).some(T=>T.status==="inprogress")).length,D=t.filter(E=>(E.dept_steps||[]).some(T=>T.status==="blocked")).length;return s?r.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:300,gap:16},children:[r.jsx("div",{style:{width:48,height:48,border:`3px solid ${_}33`,borderTopColor:_,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:14},children:["Loading ",e," worklist..."]}),r.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}):r.jsxs("div",{style:{padding:"4px 0"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[r.jsx("div",{style:{width:36,height:36,borderRadius:10,background:`${_}22`,border:`1px solid ${_}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18},children:e==="Design"?"✏️":e==="QC"?"🔬":e==="Production"?"🔧":e==="Purchase"?"📦":e==="Stores"?"🏪":e==="Dispatch"?"🚚":e==="Accounts"?"💼":"📋"}),r.jsxs("div",{children:[r.jsxs("h2",{style:{margin:0,color:"var(--text)",fontSize:20,fontWeight:800},children:[e," Worklist"]}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:12,marginTop:2},children:[N," unit",N!==1?"s":""," currently in ",e]})]})]}),r.jsxs("button",{onClick:()=>g(!0),disabled:o,style:{display:"flex",alignItems:"center",gap:6,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:12,borderRadius:8,padding:"7px 14px",cursor:"pointer",transition:"all 0.2s"},children:[r.jsx($n,{size:13,style:{animation:o?"spin 0.8s linear infinite":"none"}}),"Refresh"]})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:12,marginBottom:20},children:[{label:"Total Units",value:N,color:_},{label:"In Progress",value:z,color:"#f59e0b"},{label:"Completed",value:P,color:"#10b981"},{label:"Blocked",value:D,color:"#ef4444"}].map(E=>r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",textAlign:"center",borderTop:`2px solid ${E.color}55`},children:[r.jsx("div",{style:{fontSize:24,fontWeight:800,color:E.color},children:E.value}),r.jsx("div",{style:{fontSize:11,color:"var(--text3)",marginTop:2,textTransform:"uppercase",letterSpacing:.5},children:E.label})]},E.label))}),r.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"},children:[r.jsx("input",{type:"text",placeholder:"Search by unit ID, order, item, client...",value:h,onChange:E=>x(E.target.value),style:{flex:1,minWidth:220,background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,padding:"9px 14px",color:"var(--text)",fontSize:13,outline:"none",transition:"border-color 0.2s"},onFocus:E=>E.target.style.borderColor=_,onBlur:E=>E.target.style.borderColor="var(--border2)"}),r.jsx("div",{style:{display:"flex",background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,overflow:"hidden"},children:["all","pending","inprogress","done"].map(E=>r.jsx("button",{onClick:()=>f(E),style:{padding:"9px 14px",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:p===E?_:"transparent",color:p===E?"#fff":"var(--text2)",textTransform:"capitalize",transition:"all 0.15s"},children:E==="inprogress"?"In Progress":E.charAt(0).toUpperCase()+E.slice(1)},E))})]}),v.length===0&&r.jsxs("div",{style:{textAlign:"center",padding:"60px 20px",background:"var(--bg2)",borderRadius:12,border:"1px solid var(--border)"},children:[r.jsx("div",{style:{fontSize:40,marginBottom:12},children:"🎉"}),r.jsx("div",{style:{color:"var(--text)",fontWeight:700,fontSize:18,marginBottom:6},children:h||p!=="all"?"No matching units":`No units in ${e}`}),r.jsx("div",{style:{color:"var(--text3)",fontSize:13},children:h||p!=="all"?"Try adjusting your search or filter.":`All ${e} tasks are complete or no units have been assigned yet.`})]}),v.map(E=>r.jsx(Xg,{group:E,dept:e,onStepStatusChange:u,users:a,canEdit:w},E.order_number)),r.jsx("style",{children:`
        .worklist-row:hover { background: rgba(255,255,255,0.03) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `})]})}const ex=({children:e})=>{const t=localStorage.getItem("token"),n=localStorage.getItem("user");return!t||t==="undefined"||t==="null"||!n?r.jsx(Zu,{to:"/",replace:!0}):e};function tx(){const[e,t]=m.useState([]),[n,a]=m.useState([]),[l,s]=m.useState("all"),[i,o]=m.useState("board"),[d,p]=m.useState("Accept-Complete"),[f,h]=m.useState("Standard"),[x,k]=m.useState(null),[j,w]=m.useState(!1),[_,g]=m.useState(null),u=m.useRef(null),[c,v]=m.useState(null),[N,P]=m.useState(!0),[z,D]=m.useState(""),[E,T]=m.useState([]),H=m.useRef(null),te=Zi(),[K,J]=m.useState(()=>JSON.parse(localStorage.getItem("user")||"{}")),M=localStorage.getItem("token"),G=async(C,O={})=>{const ne=await fetch(C,{...O,headers:{...O.headers,Authorization:`Bearer ${M}`}});return ne.status===401?(localStorage.removeItem("token"),localStorage.removeItem("user"),te("/"),null):ne};m.useEffect(()=>{S(),I();const C=O=>{typeof O.detail=="string"?o(O.detail):O.detail&&O.detail.view&&(o(O.detail.view),O.detail.orderId?(g(O.detail.orderId),u.current=O.detail.orderId):O.detail.orderId===null&&(g(null),u.current=null))};return window.addEventListener("setView",C),()=>window.removeEventListener("setView",C)},[]),m.useEffect(()=>{_?(B(_),V(_)):(t([]),v(null))},[_]),m.useEffect(()=>{if(!c){D(""),H.current=null;return}if(H.current!==c.id){const C=c.units||[];C.length>0?D(C[0].id.toString()):D(""),H.current=c.id}else{const C=c.units||[];z&&!C.some(O=>O.id.toString()===z.toString())&&(C.length>0?D(C[0].id.toString()):D(""))}},[c,z]),m.useEffect(()=>{var O,ne;const C=z||((ne=(O=c==null?void 0:c.units)==null?void 0:O[0])==null?void 0:ne.id);C&&M?fetch(`http://localhost:5000/api/units/${C}/steps`,{headers:{Authorization:`Bearer ${M}`}}).then(async ie=>{ie.ok&&T(await ie.json())}).catch(console.error):T([])},[z,c,M]),m.useEffect(()=>{const C=()=>{var O,ne;if(_){B(_),V(_);const ie=z||((ne=(O=c==null?void 0:c.units)==null?void 0:O[0])==null?void 0:ne.id);ie&&M&&fetch(`http://localhost:5000/api/units/${ie}/steps`,{headers:{Authorization:`Bearer ${M}`}}).then(async Ne=>{Ne.ok&&T(await Ne.json())}).catch(console.error)}};return window.addEventListener("orderUpdated",C),()=>window.removeEventListener("orderUpdated",C)},[_,z,c,M]);const V=async C=>{if(M)try{const O=await G(`http://localhost:5000/api/orders/${C}`);O!=null&&O.ok&&v(await O.json())}catch(O){console.error("Failed to fetch order details",O)}},B=async C=>{if(M)try{const O=await G(`http://localhost:5000/api/orders/${C}/steps`);O!=null&&O.ok&&t(await O.json())}catch(O){console.error("Failed to fetch steps",O)}},S=async()=>{if(M)try{const C=await G("http://localhost:5000/api/auth/profile");if(C!=null&&C.ok){const O=await C.json();J(O),localStorage.setItem("user",JSON.stringify(O))}}catch(C){console.error("Failed to sync profile",C)}},I=async()=>{try{const C=await G("http://localhost:5000/api/logs");if(C!=null&&C.ok){const O=await C.json();a(O.map(ne=>({time:vr(new Date(ne.timestamp)),dept:ne.dept,text:ne.action_text,username:ne.username})))}}catch(C){console.error("Failed to fetch logs",C)}},F=async(C,O,ne)=>{const ie=ne??u.current;try{const Ne=await G("http://localhost:5000/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dept:C,action_text:O,order_id:ie?parseInt(ie):null})});I()}catch(Ne){console.error("Failed to log activity",Ne)}},Z=()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),te("/")},ye=C=>{o(C),C==="board"&&(g(null),u.current=null,v(null),t([]),s("all"),window.dispatchEvent(new CustomEvent("setView",{detail:{orderId:null}})))},de=e.find(C=>C.id===x)||null,le=C=>{k(C),w(!0)},ce=()=>{w(!1)},se=async C=>{try{const O=await fetch(`http://localhost:5000/api/orders/${_}/steps/${x}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${M}`},body:JSON.stringify(C)});if(O.ok){if(await B(_),await V(_),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:_}})),de.special==="qc"&&C.status==="blocked"&&C.qcFailTarget){const ne=C.qcFailTarget==="production"?"QC FAIL → returned to Production for rework":"QC FAIL → returned to Design for re-check";F("QC",ne,_)}return F(de.dept,`"${de.name}" → ${C.status.toUpperCase()}${C.notes?" — "+C.notes:""}`,_),w(!1),null}else return(await O.json().catch(()=>({}))).error||"Failed to save step"}catch(O){return console.error("Failed to save step",O),"Network error — could not save step"}},y=async C=>{if(window.confirm("Are you sure you want to permanently delete this task from the order's flow?"))try{(await fetch(`http://localhost:5000/api/orders/${_}/steps/${C}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok?(w(!1),B(_),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:_}}))):alert("Failed to delete step")}catch(O){console.error(O)}},U=C=>{if(!["Admin","Manager","Accounts","Production"].includes(K.role)){alert("Unauthorized to change BOM status");return}p(C),F("Stores",`BOM status updated → ${C}`,_)},R=C=>{if(!["Admin","Manager","Design"].includes(K.role)){alert("Unauthorized to change Design classification");return}h(C),F("Design",`Design classified as ${C}`,_)},ee=e.filter(C=>!C.order_unit_id),Y=[...E,...ee];return r.jsxs("div",{className:"app-container",children:[r.jsx(bg,{onLogout:Z}),r.jsxs("div",{className:"app",children:[(!N||i!=="planning")&&r.jsx(Sg,{steps:Y,currentFilter:l,onFilterDept:s,bomState:d,onSetBomState:U,designType:f,onSetDesignType:R,currentView:i,onSetView:ye,userRole:K.role}),r.jsxs("main",{className:"main",children:[i!=="planning"&&r.jsx(zg,{steps:Y,currentFilter:l,selectedOrder:c}),r.jsxs("div",{className:"flow-header",children:[r.jsx("div",{className:"flow-title",children:i==="board"?"Board":i==="planning"?"Planning Board":i==="flow"?"Process Flow":i==="table"?"Table View":i==="orders"?"Order Directory":i==="new-order"?"New Order":i==="import"?"Import Orders":i==="masters"?"Masters":i==="logs"?"System Logs":i==="worklist"?`${K.role} Worklist`:"User Management"}),["board","flow","table"].includes(i)&&r.jsxs("div",{className:"view-toggle",children:[r.jsx("button",{className:`vbtn${i==="board"?" active":""}`,onClick:()=>ye("board"),children:"Board"}),r.jsx("button",{className:`vbtn${i==="flow"?" active":""}`,onClick:()=>o("flow"),children:"Flow"}),r.jsx("button",{className:`vbtn${i==="table"?" active":""}`,onClick:()=>o("table"),children:"Table"})]}),i==="planning"&&r.jsxs("button",{className:`vbtn${N?" active":""}`,onClick:()=>P(!N),style:{display:"flex",alignItems:"center",gap:"6px"},children:[N?r.jsx(dg,{size:13}):r.jsx(og,{size:13}),N?"Exit Fullscreen":"Fullscreen"]})]}),i==="board"?r.jsx(Dg,{currentFilter:l,userRole:K.role,onSetView:o}):i==="planning"?r.jsx(Qg,{}):i==="flow"?_?r.jsx(Pg,{steps:e,currentFilter:l,onOpenModal:le,onSetView:o,userRole:K.role,selectedOrderId:_,selectedOrder:c,onStepsChanged:()=>B(_),selectedUnitId:z,setSelectedUnitId:D,unitSteps:E,setUnitSteps:T}):r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"Please select an order from the Header dropdown to view its Process Flow."}):i==="table"?r.jsx(Ig,{steps:Y,currentFilter:l,onOpenModal:le,userRole:K.role}):i==="orders"?r.jsx(Fg,{initialSelectedId:_}):i==="new-order"?r.jsx(Ag,{onOrderCreated:()=>{o("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):i==="import"?r.jsx(Ug,{onImportComplete:()=>{o("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):i==="masters"?r.jsx(qg,{}):i==="logs"?r.jsx(Vg,{}):i==="settings"?r.jsx(Yg,{}):i==="worklist"?r.jsx(Zg,{dept:K.role}):r.jsx(Bg,{})]}),i!=="planning"&&r.jsx(Mg,{selectedStep:de,activityLog:n,selectedOrder:c})]}),r.jsx(Rg,{step:de,isOpen:j,onClose:ce,onSave:se,onDelete:y,userRole:K.role,selectedOrder:c})]})}function nx(){return r.jsx(Hm,{children:r.jsxs(Wm,{children:[r.jsx(Ma,{path:"/",element:r.jsx(Og,{})}),r.jsx(Ma,{path:"/dashboard",element:r.jsx(ex,{children:r.jsx(tx,{})})}),r.jsx(Ma,{path:"*",element:r.jsx(Zu,{to:"/",replace:!0})})]})})}ls.createRoot(document.getElementById("root")).render(r.jsx(Ra.StrictMode,{children:r.jsx(nx,{})}));
