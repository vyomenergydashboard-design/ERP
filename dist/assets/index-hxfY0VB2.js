function Op(e,t){for(var n=0;n<t.length;n++){const a=t[n];if(typeof a!="string"&&!Array.isArray(a)){for(const o in a)if(o!=="default"&&!(o in e)){const s=Object.getOwnPropertyDescriptor(a,o);s&&Object.defineProperty(e,o,s.get?s:{enumerable:!0,get:()=>a[o]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();function Mp(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var nc={exports:{}},Oo={},ac={exports:{}},de={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var va=Symbol.for("react.element"),$p=Symbol.for("react.portal"),Up=Symbol.for("react.fragment"),Fp=Symbol.for("react.strict_mode"),Wp=Symbol.for("react.profiler"),qp=Symbol.for("react.provider"),Vp=Symbol.for("react.context"),Hp=Symbol.for("react.forward_ref"),Qp=Symbol.for("react.suspense"),Yp=Symbol.for("react.memo"),Gp=Symbol.for("react.lazy"),Di=Symbol.iterator;function Jp(e){return e===null||typeof e!="object"?null:(e=Di&&e[Di]||e["@@iterator"],typeof e=="function"?e:null)}var oc={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},sc=Object.assign,lc={};function vn(e,t,n){this.props=e,this.context=t,this.refs=lc,this.updater=n||oc}vn.prototype.isReactComponent={};vn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};vn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function ic(){}ic.prototype=vn.prototype;function Pl(e,t,n){this.props=e,this.context=t,this.refs=lc,this.updater=n||oc}var Tl=Pl.prototype=new ic;Tl.constructor=Pl;sc(Tl,vn.prototype);Tl.isPureReactComponent=!0;var Pi=Array.isArray,dc=Object.prototype.hasOwnProperty,Ll={current:null},cc={key:!0,ref:!0,__self:!0,__source:!0};function uc(e,t,n){var a,o={},s=null,l=null;if(t!=null)for(a in t.ref!==void 0&&(l=t.ref),t.key!==void 0&&(s=""+t.key),t)dc.call(t,a)&&!cc.hasOwnProperty(a)&&(o[a]=t[a]);var i=arguments.length-2;if(i===1)o.children=n;else if(1<i){for(var d=Array(i),u=0;u<i;u++)d[u]=arguments[u+2];o.children=d}if(e&&e.defaultProps)for(a in i=e.defaultProps,i)o[a]===void 0&&(o[a]=i[a]);return{$$typeof:va,type:e,key:s,ref:l,props:o,_owner:Ll.current}}function Kp(e,t){return{$$typeof:va,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Il(e){return typeof e=="object"&&e!==null&&e.$$typeof===va}function Xp(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Ti=/\/+/g;function as(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Xp(""+e.key):t.toString(36)}function Ya(e,t,n,a,o){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var l=!1;if(e===null)l=!0;else switch(s){case"string":case"number":l=!0;break;case"object":switch(e.$$typeof){case va:case $p:l=!0}}if(l)return l=e,o=o(l),e=a===""?"."+as(l,0):a,Pi(o)?(n="",e!=null&&(n=e.replace(Ti,"$&/")+"/"),Ya(o,t,n,"",function(u){return u})):o!=null&&(Il(o)&&(o=Kp(o,n+(!o.key||l&&l.key===o.key?"":(""+o.key).replace(Ti,"$&/")+"/")+e)),t.push(o)),1;if(l=0,a=a===""?".":a+":",Pi(e))for(var i=0;i<e.length;i++){s=e[i];var d=a+as(s,i);l+=Ya(s,t,n,d,o)}else if(d=Jp(e),typeof d=="function")for(e=d.call(e),i=0;!(s=e.next()).done;)s=s.value,d=a+as(s,i++),l+=Ya(s,t,n,d,o);else if(s==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return l}function Da(e,t,n){if(e==null)return e;var a=[],o=0;return Ya(e,a,"","",function(s){return t.call(n,s,o++)}),a}function Zp(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var et={current:null},Ga={transition:null},ef={ReactCurrentDispatcher:et,ReactCurrentBatchConfig:Ga,ReactCurrentOwner:Ll};function pc(){throw Error("act(...) is not supported in production builds of React.")}de.Children={map:Da,forEach:function(e,t,n){Da(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Da(e,function(){t++}),t},toArray:function(e){return Da(e,function(t){return t})||[]},only:function(e){if(!Il(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};de.Component=vn;de.Fragment=Up;de.Profiler=Wp;de.PureComponent=Pl;de.StrictMode=Fp;de.Suspense=Qp;de.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ef;de.act=pc;de.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=sc({},e.props),o=e.key,s=e.ref,l=e._owner;if(t!=null){if(t.ref!==void 0&&(s=t.ref,l=Ll.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(d in t)dc.call(t,d)&&!cc.hasOwnProperty(d)&&(a[d]=t[d]===void 0&&i!==void 0?i[d]:t[d])}var d=arguments.length-2;if(d===1)a.children=n;else if(1<d){i=Array(d);for(var u=0;u<d;u++)i[u]=arguments[u+2];a.children=i}return{$$typeof:va,type:e.type,key:o,ref:s,props:a,_owner:l}};de.createContext=function(e){return e={$$typeof:Vp,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:qp,_context:e},e.Consumer=e};de.createElement=uc;de.createFactory=function(e){var t=uc.bind(null,e);return t.type=e,t};de.createRef=function(){return{current:null}};de.forwardRef=function(e){return{$$typeof:Hp,render:e}};de.isValidElement=Il;de.lazy=function(e){return{$$typeof:Gp,_payload:{_status:-1,_result:e},_init:Zp}};de.memo=function(e,t){return{$$typeof:Yp,type:e,compare:t===void 0?null:t}};de.startTransition=function(e){var t=Ga.transition;Ga.transition={};try{e()}finally{Ga.transition=t}};de.unstable_act=pc;de.useCallback=function(e,t){return et.current.useCallback(e,t)};de.useContext=function(e){return et.current.useContext(e)};de.useDebugValue=function(){};de.useDeferredValue=function(e){return et.current.useDeferredValue(e)};de.useEffect=function(e,t){return et.current.useEffect(e,t)};de.useId=function(){return et.current.useId()};de.useImperativeHandle=function(e,t,n){return et.current.useImperativeHandle(e,t,n)};de.useInsertionEffect=function(e,t){return et.current.useInsertionEffect(e,t)};de.useLayoutEffect=function(e,t){return et.current.useLayoutEffect(e,t)};de.useMemo=function(e,t){return et.current.useMemo(e,t)};de.useReducer=function(e,t,n){return et.current.useReducer(e,t,n)};de.useRef=function(e){return et.current.useRef(e)};de.useState=function(e){return et.current.useState(e)};de.useSyncExternalStore=function(e,t,n){return et.current.useSyncExternalStore(e,t,n)};de.useTransition=function(){return et.current.useTransition()};de.version="18.3.1";ac.exports=de;var p=ac.exports;const Wn=Mp(p),tf=Op({__proto__:null,default:Wn},[p]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rf=p,nf=Symbol.for("react.element"),af=Symbol.for("react.fragment"),of=Object.prototype.hasOwnProperty,sf=rf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,lf={key:!0,ref:!0,__self:!0,__source:!0};function fc(e,t,n){var a,o={},s=null,l=null;n!==void 0&&(s=""+n),t.key!==void 0&&(s=""+t.key),t.ref!==void 0&&(l=t.ref);for(a in t)of.call(t,a)&&!lf.hasOwnProperty(a)&&(o[a]=t[a]);if(e&&e.defaultProps)for(a in t=e.defaultProps,t)o[a]===void 0&&(o[a]=t[a]);return{$$typeof:nf,type:e,key:s,ref:l,props:o,_owner:sf.current}}Oo.Fragment=af;Oo.jsx=fc;Oo.jsxs=fc;nc.exports=Oo;var r=nc.exports,Is={},mc={exports:{}},ft={},xc={exports:{}},gc={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(R,J){var Y=R.length;R.push(J);e:for(;0<Y;){var E=Y-1>>>1,M=R[E];if(0<o(M,J))R[E]=J,R[Y]=M,Y=E;else break e}}function n(R){return R.length===0?null:R[0]}function a(R){if(R.length===0)return null;var J=R[0],Y=R.pop();if(Y!==J){R[0]=Y;e:for(var E=0,M=R.length,Z=M>>>1;E<Z;){var le=2*(E+1)-1,xe=R[le],se=le+1,ve=R[se];if(0>o(xe,Y))se<M&&0>o(ve,xe)?(R[E]=ve,R[se]=Y,E=se):(R[E]=xe,R[le]=Y,E=le);else if(se<M&&0>o(ve,Y))R[E]=ve,R[se]=Y,E=se;else break e}}return J}function o(R,J){var Y=R.sortIndex-J.sortIndex;return Y!==0?Y:R.id-J.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;e.unstable_now=function(){return s.now()}}else{var l=Date,i=l.now();e.unstable_now=function(){return l.now()-i}}var d=[],u=[],v=1,m=null,b=3,w=!1,_=!1,S=!1,z=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,f=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function c(R){for(var J=n(u);J!==null;){if(J.callback===null)a(u);else if(J.startTime<=R)a(u),J.sortIndex=J.expirationTime,t(d,J);else break;J=n(u)}}function k(R){if(S=!1,c(R),!_)if(n(d)!==null)_=!0,V(I);else{var J=n(u);J!==null&&U(k,J.startTime-R)}}function I(R,J){_=!1,S&&(S=!1,x(L),L=-1),w=!0;var Y=b;try{for(c(J),m=n(d);m!==null&&(!(m.expirationTime>J)||R&&!T());){var E=m.callback;if(typeof E=="function"){m.callback=null,b=m.priorityLevel;var M=E(m.expirationTime<=J);J=e.unstable_now(),typeof M=="function"?m.callback=M:m===n(d)&&a(d),c(J)}else a(d);m=n(d)}if(m!==null)var Z=!0;else{var le=n(u);le!==null&&U(k,le.startTime-J),Z=!1}return Z}finally{m=null,b=Y,w=!1}}var D=!1,C=null,L=-1,P=5,h=-1;function T(){return!(e.unstable_now()-h<P)}function j(){if(C!==null){var R=e.unstable_now();h=R;var J=!0;try{J=C(!0,R)}finally{J?N():(D=!1,C=null)}}else D=!1}var N;if(typeof f=="function")N=function(){f(j)};else if(typeof MessageChannel<"u"){var B=new MessageChannel,A=B.port2;B.port1.onmessage=j,N=function(){A.postMessage(null)}}else N=function(){z(j,0)};function V(R){C=R,D||(D=!0,N())}function U(R,J){L=z(function(){R(e.unstable_now())},J)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(R){R.callback=null},e.unstable_continueExecution=function(){_||w||(_=!0,V(I))},e.unstable_forceFrameRate=function(R){0>R||125<R?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<R?Math.floor(1e3/R):5},e.unstable_getCurrentPriorityLevel=function(){return b},e.unstable_getFirstCallbackNode=function(){return n(d)},e.unstable_next=function(R){switch(b){case 1:case 2:case 3:var J=3;break;default:J=b}var Y=b;b=J;try{return R()}finally{b=Y}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(R,J){switch(R){case 1:case 2:case 3:case 4:case 5:break;default:R=3}var Y=b;b=R;try{return J()}finally{b=Y}},e.unstable_scheduleCallback=function(R,J,Y){var E=e.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?E+Y:E):Y=E,R){case 1:var M=-1;break;case 2:M=250;break;case 5:M=1073741823;break;case 4:M=1e4;break;default:M=5e3}return M=Y+M,R={id:v++,callback:J,priorityLevel:R,startTime:Y,expirationTime:M,sortIndex:-1},Y>E?(R.sortIndex=Y,t(u,R),n(d)===null&&R===n(u)&&(S?(x(L),L=-1):S=!0,U(k,Y-E))):(R.sortIndex=M,t(d,R),_||w||(_=!0,V(I))),R},e.unstable_shouldYield=T,e.unstable_wrapCallback=function(R){var J=b;return function(){var Y=b;b=J;try{return R.apply(this,arguments)}finally{b=Y}}}})(gc);xc.exports=gc;var df=xc.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cf=p,pt=df;function W(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var hc=new Set,Zn={};function $r(e,t){cn(e,t),cn(e+"Capture",t)}function cn(e,t){for(Zn[e]=t,e=0;e<t.length;e++)hc.add(t[e])}var Yt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),As=Object.prototype.hasOwnProperty,uf=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Li={},Ii={};function pf(e){return As.call(Ii,e)?!0:As.call(Li,e)?!1:uf.test(e)?Ii[e]=!0:(Li[e]=!0,!1)}function ff(e,t,n,a){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return a?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function mf(e,t,n,a){if(t===null||typeof t>"u"||ff(e,t,n,a))return!0;if(a)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function tt(e,t,n,a,o,s,l){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=a,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=s,this.removeEmptyString=l}var qe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){qe[e]=new tt(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];qe[t]=new tt(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){qe[e]=new tt(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){qe[e]=new tt(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){qe[e]=new tt(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){qe[e]=new tt(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){qe[e]=new tt(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){qe[e]=new tt(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){qe[e]=new tt(e,5,!1,e.toLowerCase(),null,!1,!1)});var Al=/[\-:]([a-z])/g;function Rl(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Al,Rl);qe[t]=new tt(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Al,Rl);qe[t]=new tt(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Al,Rl);qe[t]=new tt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){qe[e]=new tt(e,1,!1,e.toLowerCase(),null,!1,!1)});qe.xlinkHref=new tt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){qe[e]=new tt(e,1,!1,e.toLowerCase(),null,!0,!0)});function Bl(e,t,n,a){var o=qe.hasOwnProperty(t)?qe[t]:null;(o!==null?o.type!==0:a||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(mf(t,n,o,a)&&(n=null),a||o===null?pf(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=n===null?o.type===3?!1:"":n:(t=o.attributeName,a=o.attributeNamespace,n===null?e.removeAttribute(t):(o=o.type,n=o===3||o===4&&n===!0?"":""+n,a?e.setAttributeNS(a,t,n):e.setAttribute(t,n))))}var Xt=cf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Pa=Symbol.for("react.element"),qr=Symbol.for("react.portal"),Vr=Symbol.for("react.fragment"),Ol=Symbol.for("react.strict_mode"),Rs=Symbol.for("react.profiler"),vc=Symbol.for("react.provider"),yc=Symbol.for("react.context"),Ml=Symbol.for("react.forward_ref"),Bs=Symbol.for("react.suspense"),Os=Symbol.for("react.suspense_list"),$l=Symbol.for("react.memo"),ar=Symbol.for("react.lazy"),bc=Symbol.for("react.offscreen"),Ai=Symbol.iterator;function Cn(e){return e===null||typeof e!="object"?null:(e=Ai&&e[Ai]||e["@@iterator"],typeof e=="function"?e:null)}var ze=Object.assign,os;function An(e){if(os===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);os=t&&t[1]||""}return`
`+os+e}var ss=!1;function ls(e,t){if(!e||ss)return"";ss=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(u){var a=u}Reflect.construct(e,[],t)}else{try{t.call()}catch(u){a=u}e.call(t.prototype)}else{try{throw Error()}catch(u){a=u}e()}}catch(u){if(u&&a&&typeof u.stack=="string"){for(var o=u.stack.split(`
`),s=a.stack.split(`
`),l=o.length-1,i=s.length-1;1<=l&&0<=i&&o[l]!==s[i];)i--;for(;1<=l&&0<=i;l--,i--)if(o[l]!==s[i]){if(l!==1||i!==1)do if(l--,i--,0>i||o[l]!==s[i]){var d=`
`+o[l].replace(" at new "," at ");return e.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",e.displayName)),d}while(1<=l&&0<=i);break}}}finally{ss=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?An(e):""}function xf(e){switch(e.tag){case 5:return An(e.type);case 16:return An("Lazy");case 13:return An("Suspense");case 19:return An("SuspenseList");case 0:case 2:case 15:return e=ls(e.type,!1),e;case 11:return e=ls(e.type.render,!1),e;case 1:return e=ls(e.type,!0),e;default:return""}}function Ms(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Vr:return"Fragment";case qr:return"Portal";case Rs:return"Profiler";case Ol:return"StrictMode";case Bs:return"Suspense";case Os:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case yc:return(e.displayName||"Context")+".Consumer";case vc:return(e._context.displayName||"Context")+".Provider";case Ml:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case $l:return t=e.displayName||null,t!==null?t:Ms(e.type)||"Memo";case ar:t=e._payload,e=e._init;try{return Ms(e(t))}catch{}}return null}function gf(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ms(t);case 8:return t===Ol?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function yr(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function jc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function hf(e){var t=jc(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),a=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var o=n.get,s=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(l){a=""+l,s.call(this,l)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return a},setValue:function(l){a=""+l},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ta(e){e._valueTracker||(e._valueTracker=hf(e))}function wc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),a="";return e&&(a=jc(e)?e.checked?"true":"false":e.value),e=a,e!==n?(t.setValue(e),!0):!1}function io(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function $s(e,t){var n=t.checked;return ze({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Ri(e,t){var n=t.defaultValue==null?"":t.defaultValue,a=t.checked!=null?t.checked:t.defaultChecked;n=yr(t.value!=null?t.value:n),e._wrapperState={initialChecked:a,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function kc(e,t){t=t.checked,t!=null&&Bl(e,"checked",t,!1)}function Us(e,t){kc(e,t);var n=yr(t.value),a=t.type;if(n!=null)a==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(a==="submit"||a==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Fs(e,t.type,n):t.hasOwnProperty("defaultValue")&&Fs(e,t.type,yr(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Bi(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var a=t.type;if(!(a!=="submit"&&a!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Fs(e,t,n){(t!=="number"||io(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Rn=Array.isArray;function nn(e,t,n,a){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&a&&(e[n].defaultSelected=!0)}else{for(n=""+yr(n),t=null,o=0;o<e.length;o++){if(e[o].value===n){e[o].selected=!0,a&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function Ws(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(W(91));return ze({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Oi(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(W(92));if(Rn(n)){if(1<n.length)throw Error(W(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:yr(n)}}function Sc(e,t){var n=yr(t.value),a=yr(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),a!=null&&(e.defaultValue=""+a)}function Mi(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function _c(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function qs(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?_c(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var La,Nc=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,a,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,a,o)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(La=La||document.createElement("div"),La.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=La.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function ea(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var qn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},vf=["Webkit","ms","Moz","O"];Object.keys(qn).forEach(function(e){vf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),qn[t]=qn[e]})});function Cc(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||qn.hasOwnProperty(e)&&qn[e]?(""+t).trim():t+"px"}function zc(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var a=n.indexOf("--")===0,o=Cc(n,t[n],a);n==="float"&&(n="cssFloat"),a?e.setProperty(n,o):e[n]=o}}var yf=ze({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Vs(e,t){if(t){if(yf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(W(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(W(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(W(61))}if(t.style!=null&&typeof t.style!="object")throw Error(W(62))}}function Hs(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Qs=null;function Ul(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ys=null,an=null,on=null;function $i(e){if(e=ja(e)){if(typeof Ys!="function")throw Error(W(280));var t=e.stateNode;t&&(t=Wo(t),Ys(e.stateNode,e.type,t))}}function Ec(e){an?on?on.push(e):on=[e]:an=e}function Dc(){if(an){var e=an,t=on;if(on=an=null,$i(e),t)for(e=0;e<t.length;e++)$i(t[e])}}function Pc(e,t){return e(t)}function Tc(){}var is=!1;function Lc(e,t,n){if(is)return e(t,n);is=!0;try{return Pc(e,t,n)}finally{is=!1,(an!==null||on!==null)&&(Tc(),Dc())}}function ta(e,t){var n=e.stateNode;if(n===null)return null;var a=Wo(n);if(a===null)return null;n=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(W(231,t,typeof n));return n}var Gs=!1;if(Yt)try{var zn={};Object.defineProperty(zn,"passive",{get:function(){Gs=!0}}),window.addEventListener("test",zn,zn),window.removeEventListener("test",zn,zn)}catch{Gs=!1}function bf(e,t,n,a,o,s,l,i,d){var u=Array.prototype.slice.call(arguments,3);try{t.apply(n,u)}catch(v){this.onError(v)}}var Vn=!1,co=null,uo=!1,Js=null,jf={onError:function(e){Vn=!0,co=e}};function wf(e,t,n,a,o,s,l,i,d){Vn=!1,co=null,bf.apply(jf,arguments)}function kf(e,t,n,a,o,s,l,i,d){if(wf.apply(this,arguments),Vn){if(Vn){var u=co;Vn=!1,co=null}else throw Error(W(198));uo||(uo=!0,Js=u)}}function Ur(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Ic(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ui(e){if(Ur(e)!==e)throw Error(W(188))}function Sf(e){var t=e.alternate;if(!t){if(t=Ur(e),t===null)throw Error(W(188));return t!==e?null:e}for(var n=e,a=t;;){var o=n.return;if(o===null)break;var s=o.alternate;if(s===null){if(a=o.return,a!==null){n=a;continue}break}if(o.child===s.child){for(s=o.child;s;){if(s===n)return Ui(o),e;if(s===a)return Ui(o),t;s=s.sibling}throw Error(W(188))}if(n.return!==a.return)n=o,a=s;else{for(var l=!1,i=o.child;i;){if(i===n){l=!0,n=o,a=s;break}if(i===a){l=!0,a=o,n=s;break}i=i.sibling}if(!l){for(i=s.child;i;){if(i===n){l=!0,n=s,a=o;break}if(i===a){l=!0,a=s,n=o;break}i=i.sibling}if(!l)throw Error(W(189))}}if(n.alternate!==a)throw Error(W(190))}if(n.tag!==3)throw Error(W(188));return n.stateNode.current===n?e:t}function Ac(e){return e=Sf(e),e!==null?Rc(e):null}function Rc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Rc(e);if(t!==null)return t;e=e.sibling}return null}var Bc=pt.unstable_scheduleCallback,Fi=pt.unstable_cancelCallback,_f=pt.unstable_shouldYield,Nf=pt.unstable_requestPaint,Le=pt.unstable_now,Cf=pt.unstable_getCurrentPriorityLevel,Fl=pt.unstable_ImmediatePriority,Oc=pt.unstable_UserBlockingPriority,po=pt.unstable_NormalPriority,zf=pt.unstable_LowPriority,Mc=pt.unstable_IdlePriority,Mo=null,Ot=null;function Ef(e){if(Ot&&typeof Ot.onCommitFiberRoot=="function")try{Ot.onCommitFiberRoot(Mo,e,void 0,(e.current.flags&128)===128)}catch{}}var Dt=Math.clz32?Math.clz32:Tf,Df=Math.log,Pf=Math.LN2;function Tf(e){return e>>>=0,e===0?32:31-(Df(e)/Pf|0)|0}var Ia=64,Aa=4194304;function Bn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function fo(e,t){var n=e.pendingLanes;if(n===0)return 0;var a=0,o=e.suspendedLanes,s=e.pingedLanes,l=n&268435455;if(l!==0){var i=l&~o;i!==0?a=Bn(i):(s&=l,s!==0&&(a=Bn(s)))}else l=n&~o,l!==0?a=Bn(l):s!==0&&(a=Bn(s));if(a===0)return 0;if(t!==0&&t!==a&&!(t&o)&&(o=a&-a,s=t&-t,o>=s||o===16&&(s&4194240)!==0))return t;if(a&4&&(a|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=a;0<t;)n=31-Dt(t),o=1<<n,a|=e[n],t&=~o;return a}function Lf(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function If(e,t){for(var n=e.suspendedLanes,a=e.pingedLanes,o=e.expirationTimes,s=e.pendingLanes;0<s;){var l=31-Dt(s),i=1<<l,d=o[l];d===-1?(!(i&n)||i&a)&&(o[l]=Lf(i,t)):d<=t&&(e.expiredLanes|=i),s&=~i}}function Ks(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function $c(){var e=Ia;return Ia<<=1,!(Ia&4194240)&&(Ia=64),e}function ds(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ya(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Dt(t),e[t]=n}function Af(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var a=e.eventTimes;for(e=e.expirationTimes;0<n;){var o=31-Dt(n),s=1<<o;t[o]=0,a[o]=-1,e[o]=-1,n&=~s}}function Wl(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var a=31-Dt(n),o=1<<a;o&t|e[a]&t&&(e[a]|=t),n&=~o}}var he=0;function Uc(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Fc,ql,Wc,qc,Vc,Xs=!1,Ra=[],ur=null,pr=null,fr=null,ra=new Map,na=new Map,sr=[],Rf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Wi(e,t){switch(e){case"focusin":case"focusout":ur=null;break;case"dragenter":case"dragleave":pr=null;break;case"mouseover":case"mouseout":fr=null;break;case"pointerover":case"pointerout":ra.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":na.delete(t.pointerId)}}function En(e,t,n,a,o,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:a,nativeEvent:s,targetContainers:[o]},t!==null&&(t=ja(t),t!==null&&ql(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Bf(e,t,n,a,o){switch(t){case"focusin":return ur=En(ur,e,t,n,a,o),!0;case"dragenter":return pr=En(pr,e,t,n,a,o),!0;case"mouseover":return fr=En(fr,e,t,n,a,o),!0;case"pointerover":var s=o.pointerId;return ra.set(s,En(ra.get(s)||null,e,t,n,a,o)),!0;case"gotpointercapture":return s=o.pointerId,na.set(s,En(na.get(s)||null,e,t,n,a,o)),!0}return!1}function Hc(e){var t=zr(e.target);if(t!==null){var n=Ur(t);if(n!==null){if(t=n.tag,t===13){if(t=Ic(n),t!==null){e.blockedOn=t,Vc(e.priority,function(){Wc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ja(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Zs(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var a=new n.constructor(n.type,n);Qs=a,n.target.dispatchEvent(a),Qs=null}else return t=ja(n),t!==null&&ql(t),e.blockedOn=n,!1;t.shift()}return!0}function qi(e,t,n){Ja(e)&&n.delete(t)}function Of(){Xs=!1,ur!==null&&Ja(ur)&&(ur=null),pr!==null&&Ja(pr)&&(pr=null),fr!==null&&Ja(fr)&&(fr=null),ra.forEach(qi),na.forEach(qi)}function Dn(e,t){e.blockedOn===t&&(e.blockedOn=null,Xs||(Xs=!0,pt.unstable_scheduleCallback(pt.unstable_NormalPriority,Of)))}function aa(e){function t(o){return Dn(o,e)}if(0<Ra.length){Dn(Ra[0],e);for(var n=1;n<Ra.length;n++){var a=Ra[n];a.blockedOn===e&&(a.blockedOn=null)}}for(ur!==null&&Dn(ur,e),pr!==null&&Dn(pr,e),fr!==null&&Dn(fr,e),ra.forEach(t),na.forEach(t),n=0;n<sr.length;n++)a=sr[n],a.blockedOn===e&&(a.blockedOn=null);for(;0<sr.length&&(n=sr[0],n.blockedOn===null);)Hc(n),n.blockedOn===null&&sr.shift()}var sn=Xt.ReactCurrentBatchConfig,mo=!0;function Mf(e,t,n,a){var o=he,s=sn.transition;sn.transition=null;try{he=1,Vl(e,t,n,a)}finally{he=o,sn.transition=s}}function $f(e,t,n,a){var o=he,s=sn.transition;sn.transition=null;try{he=4,Vl(e,t,n,a)}finally{he=o,sn.transition=s}}function Vl(e,t,n,a){if(mo){var o=Zs(e,t,n,a);if(o===null)ys(e,t,a,xo,n),Wi(e,a);else if(Bf(o,e,t,n,a))a.stopPropagation();else if(Wi(e,a),t&4&&-1<Rf.indexOf(e)){for(;o!==null;){var s=ja(o);if(s!==null&&Fc(s),s=Zs(e,t,n,a),s===null&&ys(e,t,a,xo,n),s===o)break;o=s}o!==null&&a.stopPropagation()}else ys(e,t,a,null,n)}}var xo=null;function Zs(e,t,n,a){if(xo=null,e=Ul(a),e=zr(e),e!==null)if(t=Ur(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Ic(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return xo=e,null}function Qc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Cf()){case Fl:return 1;case Oc:return 4;case po:case zf:return 16;case Mc:return 536870912;default:return 16}default:return 16}}var ir=null,Hl=null,Ka=null;function Yc(){if(Ka)return Ka;var e,t=Hl,n=t.length,a,o="value"in ir?ir.value:ir.textContent,s=o.length;for(e=0;e<n&&t[e]===o[e];e++);var l=n-e;for(a=1;a<=l&&t[n-a]===o[s-a];a++);return Ka=o.slice(e,1<a?1-a:void 0)}function Xa(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ba(){return!0}function Vi(){return!1}function mt(e){function t(n,a,o,s,l){this._reactName=n,this._targetInst=o,this.type=a,this.nativeEvent=s,this.target=l,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(s):s[i]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Ba:Vi,this.isPropagationStopped=Vi,this}return ze(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ba)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ba)},persist:function(){},isPersistent:Ba}),t}var yn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ql=mt(yn),ba=ze({},yn,{view:0,detail:0}),Uf=mt(ba),cs,us,Pn,$o=ze({},ba,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Yl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Pn&&(Pn&&e.type==="mousemove"?(cs=e.screenX-Pn.screenX,us=e.screenY-Pn.screenY):us=cs=0,Pn=e),cs)},movementY:function(e){return"movementY"in e?e.movementY:us}}),Hi=mt($o),Ff=ze({},$o,{dataTransfer:0}),Wf=mt(Ff),qf=ze({},ba,{relatedTarget:0}),ps=mt(qf),Vf=ze({},yn,{animationName:0,elapsedTime:0,pseudoElement:0}),Hf=mt(Vf),Qf=ze({},yn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Yf=mt(Qf),Gf=ze({},yn,{data:0}),Qi=mt(Gf),Jf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Kf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Xf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Zf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Xf[e])?!!t[e]:!1}function Yl(){return Zf}var em=ze({},ba,{key:function(e){if(e.key){var t=Jf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Xa(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Kf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Yl,charCode:function(e){return e.type==="keypress"?Xa(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Xa(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),tm=mt(em),rm=ze({},$o,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Yi=mt(rm),nm=ze({},ba,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Yl}),am=mt(nm),om=ze({},yn,{propertyName:0,elapsedTime:0,pseudoElement:0}),sm=mt(om),lm=ze({},$o,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),im=mt(lm),dm=[9,13,27,32],Gl=Yt&&"CompositionEvent"in window,Hn=null;Yt&&"documentMode"in document&&(Hn=document.documentMode);var cm=Yt&&"TextEvent"in window&&!Hn,Gc=Yt&&(!Gl||Hn&&8<Hn&&11>=Hn),Gi=" ",Ji=!1;function Jc(e,t){switch(e){case"keyup":return dm.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Kc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Hr=!1;function um(e,t){switch(e){case"compositionend":return Kc(t);case"keypress":return t.which!==32?null:(Ji=!0,Gi);case"textInput":return e=t.data,e===Gi&&Ji?null:e;default:return null}}function pm(e,t){if(Hr)return e==="compositionend"||!Gl&&Jc(e,t)?(e=Yc(),Ka=Hl=ir=null,Hr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Gc&&t.locale!=="ko"?null:t.data;default:return null}}var fm={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ki(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!fm[e.type]:t==="textarea"}function Xc(e,t,n,a){Ec(a),t=go(t,"onChange"),0<t.length&&(n=new Ql("onChange","change",null,n,a),e.push({event:n,listeners:t}))}var Qn=null,oa=null;function mm(e){du(e,0)}function Uo(e){var t=Gr(e);if(wc(t))return e}function xm(e,t){if(e==="change")return t}var Zc=!1;if(Yt){var fs;if(Yt){var ms="oninput"in document;if(!ms){var Xi=document.createElement("div");Xi.setAttribute("oninput","return;"),ms=typeof Xi.oninput=="function"}fs=ms}else fs=!1;Zc=fs&&(!document.documentMode||9<document.documentMode)}function Zi(){Qn&&(Qn.detachEvent("onpropertychange",eu),oa=Qn=null)}function eu(e){if(e.propertyName==="value"&&Uo(oa)){var t=[];Xc(t,oa,e,Ul(e)),Lc(mm,t)}}function gm(e,t,n){e==="focusin"?(Zi(),Qn=t,oa=n,Qn.attachEvent("onpropertychange",eu)):e==="focusout"&&Zi()}function hm(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Uo(oa)}function vm(e,t){if(e==="click")return Uo(t)}function ym(e,t){if(e==="input"||e==="change")return Uo(t)}function bm(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Tt=typeof Object.is=="function"?Object.is:bm;function sa(e,t){if(Tt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),a=Object.keys(t);if(n.length!==a.length)return!1;for(a=0;a<n.length;a++){var o=n[a];if(!As.call(t,o)||!Tt(e[o],t[o]))return!1}return!0}function ed(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function td(e,t){var n=ed(e);e=0;for(var a;n;){if(n.nodeType===3){if(a=e+n.textContent.length,e<=t&&a>=t)return{node:n,offset:t-e};e=a}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=ed(n)}}function tu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?tu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function ru(){for(var e=window,t=io();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=io(e.document)}return t}function Jl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function jm(e){var t=ru(),n=e.focusedElem,a=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&tu(n.ownerDocument.documentElement,n)){if(a!==null&&Jl(n)){if(t=a.start,e=a.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=n.textContent.length,s=Math.min(a.start,o);a=a.end===void 0?s:Math.min(a.end,o),!e.extend&&s>a&&(o=a,a=s,s=o),o=td(n,s);var l=td(n,a);o&&l&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==l.node||e.focusOffset!==l.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),s>a?(e.addRange(t),e.extend(l.node,l.offset)):(t.setEnd(l.node,l.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var wm=Yt&&"documentMode"in document&&11>=document.documentMode,Qr=null,el=null,Yn=null,tl=!1;function rd(e,t,n){var a=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;tl||Qr==null||Qr!==io(a)||(a=Qr,"selectionStart"in a&&Jl(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Yn&&sa(Yn,a)||(Yn=a,a=go(el,"onSelect"),0<a.length&&(t=new Ql("onSelect","select",null,t,n),e.push({event:t,listeners:a}),t.target=Qr)))}function Oa(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Yr={animationend:Oa("Animation","AnimationEnd"),animationiteration:Oa("Animation","AnimationIteration"),animationstart:Oa("Animation","AnimationStart"),transitionend:Oa("Transition","TransitionEnd")},xs={},nu={};Yt&&(nu=document.createElement("div").style,"AnimationEvent"in window||(delete Yr.animationend.animation,delete Yr.animationiteration.animation,delete Yr.animationstart.animation),"TransitionEvent"in window||delete Yr.transitionend.transition);function Fo(e){if(xs[e])return xs[e];if(!Yr[e])return e;var t=Yr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in nu)return xs[e]=t[n];return e}var au=Fo("animationend"),ou=Fo("animationiteration"),su=Fo("animationstart"),lu=Fo("transitionend"),iu=new Map,nd="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function wr(e,t){iu.set(e,t),$r(t,[e])}for(var gs=0;gs<nd.length;gs++){var hs=nd[gs],km=hs.toLowerCase(),Sm=hs[0].toUpperCase()+hs.slice(1);wr(km,"on"+Sm)}wr(au,"onAnimationEnd");wr(ou,"onAnimationIteration");wr(su,"onAnimationStart");wr("dblclick","onDoubleClick");wr("focusin","onFocus");wr("focusout","onBlur");wr(lu,"onTransitionEnd");cn("onMouseEnter",["mouseout","mouseover"]);cn("onMouseLeave",["mouseout","mouseover"]);cn("onPointerEnter",["pointerout","pointerover"]);cn("onPointerLeave",["pointerout","pointerover"]);$r("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));$r("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));$r("onBeforeInput",["compositionend","keypress","textInput","paste"]);$r("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));$r("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));$r("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var On="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),_m=new Set("cancel close invalid load scroll toggle".split(" ").concat(On));function ad(e,t,n){var a=e.type||"unknown-event";e.currentTarget=n,kf(a,t,void 0,e),e.currentTarget=null}function du(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var a=e[n],o=a.event;a=a.listeners;e:{var s=void 0;if(t)for(var l=a.length-1;0<=l;l--){var i=a[l],d=i.instance,u=i.currentTarget;if(i=i.listener,d!==s&&o.isPropagationStopped())break e;ad(o,i,u),s=d}else for(l=0;l<a.length;l++){if(i=a[l],d=i.instance,u=i.currentTarget,i=i.listener,d!==s&&o.isPropagationStopped())break e;ad(o,i,u),s=d}}}if(uo)throw e=Js,uo=!1,Js=null,e}function ke(e,t){var n=t[sl];n===void 0&&(n=t[sl]=new Set);var a=e+"__bubble";n.has(a)||(cu(t,e,2,!1),n.add(a))}function vs(e,t,n){var a=0;t&&(a|=4),cu(n,e,a,t)}var Ma="_reactListening"+Math.random().toString(36).slice(2);function la(e){if(!e[Ma]){e[Ma]=!0,hc.forEach(function(n){n!=="selectionchange"&&(_m.has(n)||vs(n,!1,e),vs(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ma]||(t[Ma]=!0,vs("selectionchange",!1,t))}}function cu(e,t,n,a){switch(Qc(t)){case 1:var o=Mf;break;case 4:o=$f;break;default:o=Vl}n=o.bind(null,t,n,e),o=void 0,!Gs||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),a?o!==void 0?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):o!==void 0?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function ys(e,t,n,a,o){var s=a;if(!(t&1)&&!(t&2)&&a!==null)e:for(;;){if(a===null)return;var l=a.tag;if(l===3||l===4){var i=a.stateNode.containerInfo;if(i===o||i.nodeType===8&&i.parentNode===o)break;if(l===4)for(l=a.return;l!==null;){var d=l.tag;if((d===3||d===4)&&(d=l.stateNode.containerInfo,d===o||d.nodeType===8&&d.parentNode===o))return;l=l.return}for(;i!==null;){if(l=zr(i),l===null)return;if(d=l.tag,d===5||d===6){a=s=l;continue e}i=i.parentNode}}a=a.return}Lc(function(){var u=s,v=Ul(n),m=[];e:{var b=iu.get(e);if(b!==void 0){var w=Ql,_=e;switch(e){case"keypress":if(Xa(n)===0)break e;case"keydown":case"keyup":w=tm;break;case"focusin":_="focus",w=ps;break;case"focusout":_="blur",w=ps;break;case"beforeblur":case"afterblur":w=ps;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":w=Hi;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":w=Wf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":w=am;break;case au:case ou:case su:w=Hf;break;case lu:w=sm;break;case"scroll":w=Uf;break;case"wheel":w=im;break;case"copy":case"cut":case"paste":w=Yf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":w=Yi}var S=(t&4)!==0,z=!S&&e==="scroll",x=S?b!==null?b+"Capture":null:b;S=[];for(var f=u,c;f!==null;){c=f;var k=c.stateNode;if(c.tag===5&&k!==null&&(c=k,x!==null&&(k=ta(f,x),k!=null&&S.push(ia(f,k,c)))),z)break;f=f.return}0<S.length&&(b=new w(b,_,null,n,v),m.push({event:b,listeners:S}))}}if(!(t&7)){e:{if(b=e==="mouseover"||e==="pointerover",w=e==="mouseout"||e==="pointerout",b&&n!==Qs&&(_=n.relatedTarget||n.fromElement)&&(zr(_)||_[Gt]))break e;if((w||b)&&(b=v.window===v?v:(b=v.ownerDocument)?b.defaultView||b.parentWindow:window,w?(_=n.relatedTarget||n.toElement,w=u,_=_?zr(_):null,_!==null&&(z=Ur(_),_!==z||_.tag!==5&&_.tag!==6)&&(_=null)):(w=null,_=u),w!==_)){if(S=Hi,k="onMouseLeave",x="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(S=Yi,k="onPointerLeave",x="onPointerEnter",f="pointer"),z=w==null?b:Gr(w),c=_==null?b:Gr(_),b=new S(k,f+"leave",w,n,v),b.target=z,b.relatedTarget=c,k=null,zr(v)===u&&(S=new S(x,f+"enter",_,n,v),S.target=c,S.relatedTarget=z,k=S),z=k,w&&_)t:{for(S=w,x=_,f=0,c=S;c;c=Wr(c))f++;for(c=0,k=x;k;k=Wr(k))c++;for(;0<f-c;)S=Wr(S),f--;for(;0<c-f;)x=Wr(x),c--;for(;f--;){if(S===x||x!==null&&S===x.alternate)break t;S=Wr(S),x=Wr(x)}S=null}else S=null;w!==null&&od(m,b,w,S,!1),_!==null&&z!==null&&od(m,z,_,S,!0)}}e:{if(b=u?Gr(u):window,w=b.nodeName&&b.nodeName.toLowerCase(),w==="select"||w==="input"&&b.type==="file")var I=xm;else if(Ki(b))if(Zc)I=ym;else{I=hm;var D=gm}else(w=b.nodeName)&&w.toLowerCase()==="input"&&(b.type==="checkbox"||b.type==="radio")&&(I=vm);if(I&&(I=I(e,u))){Xc(m,I,n,v);break e}D&&D(e,b,u),e==="focusout"&&(D=b._wrapperState)&&D.controlled&&b.type==="number"&&Fs(b,"number",b.value)}switch(D=u?Gr(u):window,e){case"focusin":(Ki(D)||D.contentEditable==="true")&&(Qr=D,el=u,Yn=null);break;case"focusout":Yn=el=Qr=null;break;case"mousedown":tl=!0;break;case"contextmenu":case"mouseup":case"dragend":tl=!1,rd(m,n,v);break;case"selectionchange":if(wm)break;case"keydown":case"keyup":rd(m,n,v)}var C;if(Gl)e:{switch(e){case"compositionstart":var L="onCompositionStart";break e;case"compositionend":L="onCompositionEnd";break e;case"compositionupdate":L="onCompositionUpdate";break e}L=void 0}else Hr?Jc(e,n)&&(L="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(L="onCompositionStart");L&&(Gc&&n.locale!=="ko"&&(Hr||L!=="onCompositionStart"?L==="onCompositionEnd"&&Hr&&(C=Yc()):(ir=v,Hl="value"in ir?ir.value:ir.textContent,Hr=!0)),D=go(u,L),0<D.length&&(L=new Qi(L,e,null,n,v),m.push({event:L,listeners:D}),C?L.data=C:(C=Kc(n),C!==null&&(L.data=C)))),(C=cm?um(e,n):pm(e,n))&&(u=go(u,"onBeforeInput"),0<u.length&&(v=new Qi("onBeforeInput","beforeinput",null,n,v),m.push({event:v,listeners:u}),v.data=C))}du(m,t)})}function ia(e,t,n){return{instance:e,listener:t,currentTarget:n}}function go(e,t){for(var n=t+"Capture",a=[];e!==null;){var o=e,s=o.stateNode;o.tag===5&&s!==null&&(o=s,s=ta(e,n),s!=null&&a.unshift(ia(e,s,o)),s=ta(e,t),s!=null&&a.push(ia(e,s,o))),e=e.return}return a}function Wr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function od(e,t,n,a,o){for(var s=t._reactName,l=[];n!==null&&n!==a;){var i=n,d=i.alternate,u=i.stateNode;if(d!==null&&d===a)break;i.tag===5&&u!==null&&(i=u,o?(d=ta(n,s),d!=null&&l.unshift(ia(n,d,i))):o||(d=ta(n,s),d!=null&&l.push(ia(n,d,i)))),n=n.return}l.length!==0&&e.push({event:t,listeners:l})}var Nm=/\r\n?/g,Cm=/\u0000|\uFFFD/g;function sd(e){return(typeof e=="string"?e:""+e).replace(Nm,`
`).replace(Cm,"")}function $a(e,t,n){if(t=sd(t),sd(e)!==t&&n)throw Error(W(425))}function ho(){}var rl=null,nl=null;function al(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ol=typeof setTimeout=="function"?setTimeout:void 0,zm=typeof clearTimeout=="function"?clearTimeout:void 0,ld=typeof Promise=="function"?Promise:void 0,Em=typeof queueMicrotask=="function"?queueMicrotask:typeof ld<"u"?function(e){return ld.resolve(null).then(e).catch(Dm)}:ol;function Dm(e){setTimeout(function(){throw e})}function bs(e,t){var n=t,a=0;do{var o=n.nextSibling;if(e.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(a===0){e.removeChild(o),aa(t);return}a--}else n!=="$"&&n!=="$?"&&n!=="$!"||a++;n=o}while(n);aa(t)}function mr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function id(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var bn=Math.random().toString(36).slice(2),Bt="__reactFiber$"+bn,da="__reactProps$"+bn,Gt="__reactContainer$"+bn,sl="__reactEvents$"+bn,Pm="__reactListeners$"+bn,Tm="__reactHandles$"+bn;function zr(e){var t=e[Bt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Gt]||n[Bt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=id(e);e!==null;){if(n=e[Bt])return n;e=id(e)}return t}e=n,n=e.parentNode}return null}function ja(e){return e=e[Bt]||e[Gt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Gr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(W(33))}function Wo(e){return e[da]||null}var ll=[],Jr=-1;function kr(e){return{current:e}}function Se(e){0>Jr||(e.current=ll[Jr],ll[Jr]=null,Jr--)}function be(e,t){Jr++,ll[Jr]=e.current,e.current=t}var br={},Ke=kr(br),ot=kr(!1),Ir=br;function un(e,t){var n=e.type.contextTypes;if(!n)return br;var a=e.stateNode;if(a&&a.__reactInternalMemoizedUnmaskedChildContext===t)return a.__reactInternalMemoizedMaskedChildContext;var o={},s;for(s in n)o[s]=t[s];return a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function st(e){return e=e.childContextTypes,e!=null}function vo(){Se(ot),Se(Ke)}function dd(e,t,n){if(Ke.current!==br)throw Error(W(168));be(Ke,t),be(ot,n)}function uu(e,t,n){var a=e.stateNode;if(t=t.childContextTypes,typeof a.getChildContext!="function")return n;a=a.getChildContext();for(var o in a)if(!(o in t))throw Error(W(108,gf(e)||"Unknown",o));return ze({},n,a)}function yo(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||br,Ir=Ke.current,be(Ke,e),be(ot,ot.current),!0}function cd(e,t,n){var a=e.stateNode;if(!a)throw Error(W(169));n?(e=uu(e,t,Ir),a.__reactInternalMemoizedMergedChildContext=e,Se(ot),Se(Ke),be(Ke,e)):Se(ot),be(ot,n)}var Wt=null,qo=!1,js=!1;function pu(e){Wt===null?Wt=[e]:Wt.push(e)}function Lm(e){qo=!0,pu(e)}function Sr(){if(!js&&Wt!==null){js=!0;var e=0,t=he;try{var n=Wt;for(he=1;e<n.length;e++){var a=n[e];do a=a(!0);while(a!==null)}Wt=null,qo=!1}catch(o){throw Wt!==null&&(Wt=Wt.slice(e+1)),Bc(Fl,Sr),o}finally{he=t,js=!1}}return null}var Kr=[],Xr=0,bo=null,jo=0,ht=[],vt=0,Ar=null,qt=1,Vt="";function Nr(e,t){Kr[Xr++]=jo,Kr[Xr++]=bo,bo=e,jo=t}function fu(e,t,n){ht[vt++]=qt,ht[vt++]=Vt,ht[vt++]=Ar,Ar=e;var a=qt;e=Vt;var o=32-Dt(a)-1;a&=~(1<<o),n+=1;var s=32-Dt(t)+o;if(30<s){var l=o-o%5;s=(a&(1<<l)-1).toString(32),a>>=l,o-=l,qt=1<<32-Dt(t)+o|n<<o|a,Vt=s+e}else qt=1<<s|n<<o|a,Vt=e}function Kl(e){e.return!==null&&(Nr(e,1),fu(e,1,0))}function Xl(e){for(;e===bo;)bo=Kr[--Xr],Kr[Xr]=null,jo=Kr[--Xr],Kr[Xr]=null;for(;e===Ar;)Ar=ht[--vt],ht[vt]=null,Vt=ht[--vt],ht[vt]=null,qt=ht[--vt],ht[vt]=null}var ut=null,ct=null,_e=!1,Et=null;function mu(e,t){var n=yt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function ud(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ut=e,ct=mr(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ut=e,ct=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Ar!==null?{id:qt,overflow:Vt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=yt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ut=e,ct=null,!0):!1;default:return!1}}function il(e){return(e.mode&1)!==0&&(e.flags&128)===0}function dl(e){if(_e){var t=ct;if(t){var n=t;if(!ud(e,t)){if(il(e))throw Error(W(418));t=mr(n.nextSibling);var a=ut;t&&ud(e,t)?mu(a,n):(e.flags=e.flags&-4097|2,_e=!1,ut=e)}}else{if(il(e))throw Error(W(418));e.flags=e.flags&-4097|2,_e=!1,ut=e}}}function pd(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ut=e}function Ua(e){if(e!==ut)return!1;if(!_e)return pd(e),_e=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!al(e.type,e.memoizedProps)),t&&(t=ct)){if(il(e))throw xu(),Error(W(418));for(;t;)mu(e,t),t=mr(t.nextSibling)}if(pd(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(W(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ct=mr(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ct=null}}else ct=ut?mr(e.stateNode.nextSibling):null;return!0}function xu(){for(var e=ct;e;)e=mr(e.nextSibling)}function pn(){ct=ut=null,_e=!1}function Zl(e){Et===null?Et=[e]:Et.push(e)}var Im=Xt.ReactCurrentBatchConfig;function Tn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(W(309));var a=n.stateNode}if(!a)throw Error(W(147,e));var o=a,s=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===s?t.ref:(t=function(l){var i=o.refs;l===null?delete i[s]:i[s]=l},t._stringRef=s,t)}if(typeof e!="string")throw Error(W(284));if(!n._owner)throw Error(W(290,e))}return e}function Fa(e,t){throw e=Object.prototype.toString.call(t),Error(W(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function fd(e){var t=e._init;return t(e._payload)}function gu(e){function t(x,f){if(e){var c=x.deletions;c===null?(x.deletions=[f],x.flags|=16):c.push(f)}}function n(x,f){if(!e)return null;for(;f!==null;)t(x,f),f=f.sibling;return null}function a(x,f){for(x=new Map;f!==null;)f.key!==null?x.set(f.key,f):x.set(f.index,f),f=f.sibling;return x}function o(x,f){return x=vr(x,f),x.index=0,x.sibling=null,x}function s(x,f,c){return x.index=c,e?(c=x.alternate,c!==null?(c=c.index,c<f?(x.flags|=2,f):c):(x.flags|=2,f)):(x.flags|=1048576,f)}function l(x){return e&&x.alternate===null&&(x.flags|=2),x}function i(x,f,c,k){return f===null||f.tag!==6?(f=zs(c,x.mode,k),f.return=x,f):(f=o(f,c),f.return=x,f)}function d(x,f,c,k){var I=c.type;return I===Vr?v(x,f,c.props.children,k,c.key):f!==null&&(f.elementType===I||typeof I=="object"&&I!==null&&I.$$typeof===ar&&fd(I)===f.type)?(k=o(f,c.props),k.ref=Tn(x,f,c),k.return=x,k):(k=oo(c.type,c.key,c.props,null,x.mode,k),k.ref=Tn(x,f,c),k.return=x,k)}function u(x,f,c,k){return f===null||f.tag!==4||f.stateNode.containerInfo!==c.containerInfo||f.stateNode.implementation!==c.implementation?(f=Es(c,x.mode,k),f.return=x,f):(f=o(f,c.children||[]),f.return=x,f)}function v(x,f,c,k,I){return f===null||f.tag!==7?(f=Tr(c,x.mode,k,I),f.return=x,f):(f=o(f,c),f.return=x,f)}function m(x,f,c){if(typeof f=="string"&&f!==""||typeof f=="number")return f=zs(""+f,x.mode,c),f.return=x,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Pa:return c=oo(f.type,f.key,f.props,null,x.mode,c),c.ref=Tn(x,null,f),c.return=x,c;case qr:return f=Es(f,x.mode,c),f.return=x,f;case ar:var k=f._init;return m(x,k(f._payload),c)}if(Rn(f)||Cn(f))return f=Tr(f,x.mode,c,null),f.return=x,f;Fa(x,f)}return null}function b(x,f,c,k){var I=f!==null?f.key:null;if(typeof c=="string"&&c!==""||typeof c=="number")return I!==null?null:i(x,f,""+c,k);if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Pa:return c.key===I?d(x,f,c,k):null;case qr:return c.key===I?u(x,f,c,k):null;case ar:return I=c._init,b(x,f,I(c._payload),k)}if(Rn(c)||Cn(c))return I!==null?null:v(x,f,c,k,null);Fa(x,c)}return null}function w(x,f,c,k,I){if(typeof k=="string"&&k!==""||typeof k=="number")return x=x.get(c)||null,i(f,x,""+k,I);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case Pa:return x=x.get(k.key===null?c:k.key)||null,d(f,x,k,I);case qr:return x=x.get(k.key===null?c:k.key)||null,u(f,x,k,I);case ar:var D=k._init;return w(x,f,c,D(k._payload),I)}if(Rn(k)||Cn(k))return x=x.get(c)||null,v(f,x,k,I,null);Fa(f,k)}return null}function _(x,f,c,k){for(var I=null,D=null,C=f,L=f=0,P=null;C!==null&&L<c.length;L++){C.index>L?(P=C,C=null):P=C.sibling;var h=b(x,C,c[L],k);if(h===null){C===null&&(C=P);break}e&&C&&h.alternate===null&&t(x,C),f=s(h,f,L),D===null?I=h:D.sibling=h,D=h,C=P}if(L===c.length)return n(x,C),_e&&Nr(x,L),I;if(C===null){for(;L<c.length;L++)C=m(x,c[L],k),C!==null&&(f=s(C,f,L),D===null?I=C:D.sibling=C,D=C);return _e&&Nr(x,L),I}for(C=a(x,C);L<c.length;L++)P=w(C,x,L,c[L],k),P!==null&&(e&&P.alternate!==null&&C.delete(P.key===null?L:P.key),f=s(P,f,L),D===null?I=P:D.sibling=P,D=P);return e&&C.forEach(function(T){return t(x,T)}),_e&&Nr(x,L),I}function S(x,f,c,k){var I=Cn(c);if(typeof I!="function")throw Error(W(150));if(c=I.call(c),c==null)throw Error(W(151));for(var D=I=null,C=f,L=f=0,P=null,h=c.next();C!==null&&!h.done;L++,h=c.next()){C.index>L?(P=C,C=null):P=C.sibling;var T=b(x,C,h.value,k);if(T===null){C===null&&(C=P);break}e&&C&&T.alternate===null&&t(x,C),f=s(T,f,L),D===null?I=T:D.sibling=T,D=T,C=P}if(h.done)return n(x,C),_e&&Nr(x,L),I;if(C===null){for(;!h.done;L++,h=c.next())h=m(x,h.value,k),h!==null&&(f=s(h,f,L),D===null?I=h:D.sibling=h,D=h);return _e&&Nr(x,L),I}for(C=a(x,C);!h.done;L++,h=c.next())h=w(C,x,L,h.value,k),h!==null&&(e&&h.alternate!==null&&C.delete(h.key===null?L:h.key),f=s(h,f,L),D===null?I=h:D.sibling=h,D=h);return e&&C.forEach(function(j){return t(x,j)}),_e&&Nr(x,L),I}function z(x,f,c,k){if(typeof c=="object"&&c!==null&&c.type===Vr&&c.key===null&&(c=c.props.children),typeof c=="object"&&c!==null){switch(c.$$typeof){case Pa:e:{for(var I=c.key,D=f;D!==null;){if(D.key===I){if(I=c.type,I===Vr){if(D.tag===7){n(x,D.sibling),f=o(D,c.props.children),f.return=x,x=f;break e}}else if(D.elementType===I||typeof I=="object"&&I!==null&&I.$$typeof===ar&&fd(I)===D.type){n(x,D.sibling),f=o(D,c.props),f.ref=Tn(x,D,c),f.return=x,x=f;break e}n(x,D);break}else t(x,D);D=D.sibling}c.type===Vr?(f=Tr(c.props.children,x.mode,k,c.key),f.return=x,x=f):(k=oo(c.type,c.key,c.props,null,x.mode,k),k.ref=Tn(x,f,c),k.return=x,x=k)}return l(x);case qr:e:{for(D=c.key;f!==null;){if(f.key===D)if(f.tag===4&&f.stateNode.containerInfo===c.containerInfo&&f.stateNode.implementation===c.implementation){n(x,f.sibling),f=o(f,c.children||[]),f.return=x,x=f;break e}else{n(x,f);break}else t(x,f);f=f.sibling}f=Es(c,x.mode,k),f.return=x,x=f}return l(x);case ar:return D=c._init,z(x,f,D(c._payload),k)}if(Rn(c))return _(x,f,c,k);if(Cn(c))return S(x,f,c,k);Fa(x,c)}return typeof c=="string"&&c!==""||typeof c=="number"?(c=""+c,f!==null&&f.tag===6?(n(x,f.sibling),f=o(f,c),f.return=x,x=f):(n(x,f),f=zs(c,x.mode,k),f.return=x,x=f),l(x)):n(x,f)}return z}var fn=gu(!0),hu=gu(!1),wo=kr(null),ko=null,Zr=null,ei=null;function ti(){ei=Zr=ko=null}function ri(e){var t=wo.current;Se(wo),e._currentValue=t}function cl(e,t,n){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===n)break;e=e.return}}function ln(e,t){ko=e,ei=Zr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(at=!0),e.firstContext=null)}function jt(e){var t=e._currentValue;if(ei!==e)if(e={context:e,memoizedValue:t,next:null},Zr===null){if(ko===null)throw Error(W(308));Zr=e,ko.dependencies={lanes:0,firstContext:e}}else Zr=Zr.next=e;return t}var Er=null;function ni(e){Er===null?Er=[e]:Er.push(e)}function vu(e,t,n,a){var o=t.interleaved;return o===null?(n.next=n,ni(t)):(n.next=o.next,o.next=n),t.interleaved=n,Jt(e,a)}function Jt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var or=!1;function ai(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function yu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Qt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function xr(e,t,n){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,pe&2){var o=a.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),a.pending=t,Jt(e,n)}return o=a.interleaved,o===null?(t.next=t,ni(a)):(t.next=o.next,o.next=t),a.interleaved=t,Jt(e,n)}function Za(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Wl(e,n)}}function md(e,t){var n=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,n===a)){var o=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var l={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?o=s=l:s=s.next=l,n=n.next}while(n!==null);s===null?o=s=t:s=s.next=t}else o=s=t;n={baseState:a.baseState,firstBaseUpdate:o,lastBaseUpdate:s,shared:a.shared,effects:a.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function So(e,t,n,a){var o=e.updateQueue;or=!1;var s=o.firstBaseUpdate,l=o.lastBaseUpdate,i=o.shared.pending;if(i!==null){o.shared.pending=null;var d=i,u=d.next;d.next=null,l===null?s=u:l.next=u,l=d;var v=e.alternate;v!==null&&(v=v.updateQueue,i=v.lastBaseUpdate,i!==l&&(i===null?v.firstBaseUpdate=u:i.next=u,v.lastBaseUpdate=d))}if(s!==null){var m=o.baseState;l=0,v=u=d=null,i=s;do{var b=i.lane,w=i.eventTime;if((a&b)===b){v!==null&&(v=v.next={eventTime:w,lane:0,tag:i.tag,payload:i.payload,callback:i.callback,next:null});e:{var _=e,S=i;switch(b=t,w=n,S.tag){case 1:if(_=S.payload,typeof _=="function"){m=_.call(w,m,b);break e}m=_;break e;case 3:_.flags=_.flags&-65537|128;case 0:if(_=S.payload,b=typeof _=="function"?_.call(w,m,b):_,b==null)break e;m=ze({},m,b);break e;case 2:or=!0}}i.callback!==null&&i.lane!==0&&(e.flags|=64,b=o.effects,b===null?o.effects=[i]:b.push(i))}else w={eventTime:w,lane:b,tag:i.tag,payload:i.payload,callback:i.callback,next:null},v===null?(u=v=w,d=m):v=v.next=w,l|=b;if(i=i.next,i===null){if(i=o.shared.pending,i===null)break;b=i,i=b.next,b.next=null,o.lastBaseUpdate=b,o.shared.pending=null}}while(!0);if(v===null&&(d=m),o.baseState=d,o.firstBaseUpdate=u,o.lastBaseUpdate=v,t=o.shared.interleaved,t!==null){o=t;do l|=o.lane,o=o.next;while(o!==t)}else s===null&&(o.shared.lanes=0);Br|=l,e.lanes=l,e.memoizedState=m}}function xd(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var a=e[t],o=a.callback;if(o!==null){if(a.callback=null,a=n,typeof o!="function")throw Error(W(191,o));o.call(a)}}}var wa={},Mt=kr(wa),ca=kr(wa),ua=kr(wa);function Dr(e){if(e===wa)throw Error(W(174));return e}function oi(e,t){switch(be(ua,t),be(ca,e),be(Mt,wa),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:qs(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=qs(t,e)}Se(Mt),be(Mt,t)}function mn(){Se(Mt),Se(ca),Se(ua)}function bu(e){Dr(ua.current);var t=Dr(Mt.current),n=qs(t,e.type);t!==n&&(be(ca,e),be(Mt,n))}function si(e){ca.current===e&&(Se(Mt),Se(ca))}var Ne=kr(0);function _o(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ws=[];function li(){for(var e=0;e<ws.length;e++)ws[e]._workInProgressVersionPrimary=null;ws.length=0}var eo=Xt.ReactCurrentDispatcher,ks=Xt.ReactCurrentBatchConfig,Rr=0,Ce=null,Oe=null,$e=null,No=!1,Gn=!1,pa=0,Am=0;function Qe(){throw Error(W(321))}function ii(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Tt(e[n],t[n]))return!1;return!0}function di(e,t,n,a,o,s){if(Rr=s,Ce=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,eo.current=e===null||e.memoizedState===null?Mm:$m,e=n(a,o),Gn){s=0;do{if(Gn=!1,pa=0,25<=s)throw Error(W(301));s+=1,$e=Oe=null,t.updateQueue=null,eo.current=Um,e=n(a,o)}while(Gn)}if(eo.current=Co,t=Oe!==null&&Oe.next!==null,Rr=0,$e=Oe=Ce=null,No=!1,t)throw Error(W(300));return e}function ci(){var e=pa!==0;return pa=0,e}function Rt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return $e===null?Ce.memoizedState=$e=e:$e=$e.next=e,$e}function wt(){if(Oe===null){var e=Ce.alternate;e=e!==null?e.memoizedState:null}else e=Oe.next;var t=$e===null?Ce.memoizedState:$e.next;if(t!==null)$e=t,Oe=e;else{if(e===null)throw Error(W(310));Oe=e,e={memoizedState:Oe.memoizedState,baseState:Oe.baseState,baseQueue:Oe.baseQueue,queue:Oe.queue,next:null},$e===null?Ce.memoizedState=$e=e:$e=$e.next=e}return $e}function fa(e,t){return typeof t=="function"?t(e):t}function Ss(e){var t=wt(),n=t.queue;if(n===null)throw Error(W(311));n.lastRenderedReducer=e;var a=Oe,o=a.baseQueue,s=n.pending;if(s!==null){if(o!==null){var l=o.next;o.next=s.next,s.next=l}a.baseQueue=o=s,n.pending=null}if(o!==null){s=o.next,a=a.baseState;var i=l=null,d=null,u=s;do{var v=u.lane;if((Rr&v)===v)d!==null&&(d=d.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),a=u.hasEagerState?u.eagerState:e(a,u.action);else{var m={lane:v,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};d===null?(i=d=m,l=a):d=d.next=m,Ce.lanes|=v,Br|=v}u=u.next}while(u!==null&&u!==s);d===null?l=a:d.next=i,Tt(a,t.memoizedState)||(at=!0),t.memoizedState=a,t.baseState=l,t.baseQueue=d,n.lastRenderedState=a}if(e=n.interleaved,e!==null){o=e;do s=o.lane,Ce.lanes|=s,Br|=s,o=o.next;while(o!==e)}else o===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function _s(e){var t=wt(),n=t.queue;if(n===null)throw Error(W(311));n.lastRenderedReducer=e;var a=n.dispatch,o=n.pending,s=t.memoizedState;if(o!==null){n.pending=null;var l=o=o.next;do s=e(s,l.action),l=l.next;while(l!==o);Tt(s,t.memoizedState)||(at=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,a]}function ju(){}function wu(e,t){var n=Ce,a=wt(),o=t(),s=!Tt(a.memoizedState,o);if(s&&(a.memoizedState=o,at=!0),a=a.queue,ui(_u.bind(null,n,a,e),[e]),a.getSnapshot!==t||s||$e!==null&&$e.memoizedState.tag&1){if(n.flags|=2048,ma(9,Su.bind(null,n,a,o,t),void 0,null),Ue===null)throw Error(W(349));Rr&30||ku(n,t,o)}return o}function ku(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ce.updateQueue,t===null?(t={lastEffect:null,stores:null},Ce.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Su(e,t,n,a){t.value=n,t.getSnapshot=a,Nu(t)&&Cu(e)}function _u(e,t,n){return n(function(){Nu(t)&&Cu(e)})}function Nu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Tt(e,n)}catch{return!0}}function Cu(e){var t=Jt(e,1);t!==null&&Pt(t,e,1,-1)}function gd(e){var t=Rt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:fa,lastRenderedState:e},t.queue=e,e=e.dispatch=Om.bind(null,Ce,e),[t.memoizedState,e]}function ma(e,t,n,a){return e={tag:e,create:t,destroy:n,deps:a,next:null},t=Ce.updateQueue,t===null?(t={lastEffect:null,stores:null},Ce.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(a=n.next,n.next=e,e.next=a,t.lastEffect=e)),e}function zu(){return wt().memoizedState}function to(e,t,n,a){var o=Rt();Ce.flags|=e,o.memoizedState=ma(1|t,n,void 0,a===void 0?null:a)}function Vo(e,t,n,a){var o=wt();a=a===void 0?null:a;var s=void 0;if(Oe!==null){var l=Oe.memoizedState;if(s=l.destroy,a!==null&&ii(a,l.deps)){o.memoizedState=ma(t,n,s,a);return}}Ce.flags|=e,o.memoizedState=ma(1|t,n,s,a)}function hd(e,t){return to(8390656,8,e,t)}function ui(e,t){return Vo(2048,8,e,t)}function Eu(e,t){return Vo(4,2,e,t)}function Du(e,t){return Vo(4,4,e,t)}function Pu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Tu(e,t,n){return n=n!=null?n.concat([e]):null,Vo(4,4,Pu.bind(null,t,e),n)}function pi(){}function Lu(e,t){var n=wt();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&ii(t,a[1])?a[0]:(n.memoizedState=[e,t],e)}function Iu(e,t){var n=wt();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&ii(t,a[1])?a[0]:(e=e(),n.memoizedState=[e,t],e)}function Au(e,t,n){return Rr&21?(Tt(n,t)||(n=$c(),Ce.lanes|=n,Br|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,at=!0),e.memoizedState=n)}function Rm(e,t){var n=he;he=n!==0&&4>n?n:4,e(!0);var a=ks.transition;ks.transition={};try{e(!1),t()}finally{he=n,ks.transition=a}}function Ru(){return wt().memoizedState}function Bm(e,t,n){var a=hr(e);if(n={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null},Bu(e))Ou(t,n);else if(n=vu(e,t,n,a),n!==null){var o=Ze();Pt(n,e,a,o),Mu(n,t,a)}}function Om(e,t,n){var a=hr(e),o={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null};if(Bu(e))Ou(t,o);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var l=t.lastRenderedState,i=s(l,n);if(o.hasEagerState=!0,o.eagerState=i,Tt(i,l)){var d=t.interleaved;d===null?(o.next=o,ni(t)):(o.next=d.next,d.next=o),t.interleaved=o;return}}catch{}finally{}n=vu(e,t,o,a),n!==null&&(o=Ze(),Pt(n,e,a,o),Mu(n,t,a))}}function Bu(e){var t=e.alternate;return e===Ce||t!==null&&t===Ce}function Ou(e,t){Gn=No=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Mu(e,t,n){if(n&4194240){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Wl(e,n)}}var Co={readContext:jt,useCallback:Qe,useContext:Qe,useEffect:Qe,useImperativeHandle:Qe,useInsertionEffect:Qe,useLayoutEffect:Qe,useMemo:Qe,useReducer:Qe,useRef:Qe,useState:Qe,useDebugValue:Qe,useDeferredValue:Qe,useTransition:Qe,useMutableSource:Qe,useSyncExternalStore:Qe,useId:Qe,unstable_isNewReconciler:!1},Mm={readContext:jt,useCallback:function(e,t){return Rt().memoizedState=[e,t===void 0?null:t],e},useContext:jt,useEffect:hd,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,to(4194308,4,Pu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return to(4194308,4,e,t)},useInsertionEffect:function(e,t){return to(4,2,e,t)},useMemo:function(e,t){var n=Rt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var a=Rt();return t=n!==void 0?n(t):t,a.memoizedState=a.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},a.queue=e,e=e.dispatch=Bm.bind(null,Ce,e),[a.memoizedState,e]},useRef:function(e){var t=Rt();return e={current:e},t.memoizedState=e},useState:gd,useDebugValue:pi,useDeferredValue:function(e){return Rt().memoizedState=e},useTransition:function(){var e=gd(!1),t=e[0];return e=Rm.bind(null,e[1]),Rt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var a=Ce,o=Rt();if(_e){if(n===void 0)throw Error(W(407));n=n()}else{if(n=t(),Ue===null)throw Error(W(349));Rr&30||ku(a,t,n)}o.memoizedState=n;var s={value:n,getSnapshot:t};return o.queue=s,hd(_u.bind(null,a,s,e),[e]),a.flags|=2048,ma(9,Su.bind(null,a,s,n,t),void 0,null),n},useId:function(){var e=Rt(),t=Ue.identifierPrefix;if(_e){var n=Vt,a=qt;n=(a&~(1<<32-Dt(a)-1)).toString(32)+n,t=":"+t+"R"+n,n=pa++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Am++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},$m={readContext:jt,useCallback:Lu,useContext:jt,useEffect:ui,useImperativeHandle:Tu,useInsertionEffect:Eu,useLayoutEffect:Du,useMemo:Iu,useReducer:Ss,useRef:zu,useState:function(){return Ss(fa)},useDebugValue:pi,useDeferredValue:function(e){var t=wt();return Au(t,Oe.memoizedState,e)},useTransition:function(){var e=Ss(fa)[0],t=wt().memoizedState;return[e,t]},useMutableSource:ju,useSyncExternalStore:wu,useId:Ru,unstable_isNewReconciler:!1},Um={readContext:jt,useCallback:Lu,useContext:jt,useEffect:ui,useImperativeHandle:Tu,useInsertionEffect:Eu,useLayoutEffect:Du,useMemo:Iu,useReducer:_s,useRef:zu,useState:function(){return _s(fa)},useDebugValue:pi,useDeferredValue:function(e){var t=wt();return Oe===null?t.memoizedState=e:Au(t,Oe.memoizedState,e)},useTransition:function(){var e=_s(fa)[0],t=wt().memoizedState;return[e,t]},useMutableSource:ju,useSyncExternalStore:wu,useId:Ru,unstable_isNewReconciler:!1};function Ct(e,t){if(e&&e.defaultProps){t=ze({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ul(e,t,n,a){t=e.memoizedState,n=n(a,t),n=n==null?t:ze({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ho={isMounted:function(e){return(e=e._reactInternals)?Ur(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var a=Ze(),o=hr(e),s=Qt(a,o);s.payload=t,n!=null&&(s.callback=n),t=xr(e,s,o),t!==null&&(Pt(t,e,o,a),Za(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var a=Ze(),o=hr(e),s=Qt(a,o);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=xr(e,s,o),t!==null&&(Pt(t,e,o,a),Za(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ze(),a=hr(e),o=Qt(n,a);o.tag=2,t!=null&&(o.callback=t),t=xr(e,o,a),t!==null&&(Pt(t,e,a,n),Za(t,e,a))}};function vd(e,t,n,a,o,s,l){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,s,l):t.prototype&&t.prototype.isPureReactComponent?!sa(n,a)||!sa(o,s):!0}function $u(e,t,n){var a=!1,o=br,s=t.contextType;return typeof s=="object"&&s!==null?s=jt(s):(o=st(t)?Ir:Ke.current,a=t.contextTypes,s=(a=a!=null)?un(e,o):br),t=new t(n,s),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ho,e.stateNode=t,t._reactInternals=e,a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=s),t}function yd(e,t,n,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,a),t.state!==e&&Ho.enqueueReplaceState(t,t.state,null)}function pl(e,t,n,a){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs={},ai(e);var s=t.contextType;typeof s=="object"&&s!==null?o.context=jt(s):(s=st(t)?Ir:Ke.current,o.context=un(e,s)),o.state=e.memoizedState,s=t.getDerivedStateFromProps,typeof s=="function"&&(ul(e,t,s,n),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&Ho.enqueueReplaceState(o,o.state,null),So(e,n,o,a),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function xn(e,t){try{var n="",a=t;do n+=xf(a),a=a.return;while(a);var o=n}catch(s){o=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:t,stack:o,digest:null}}function Ns(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function fl(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Fm=typeof WeakMap=="function"?WeakMap:Map;function Uu(e,t,n){n=Qt(-1,n),n.tag=3,n.payload={element:null};var a=t.value;return n.callback=function(){Eo||(Eo=!0,kl=a),fl(e,t)},n}function Fu(e,t,n){n=Qt(-1,n),n.tag=3;var a=e.type.getDerivedStateFromError;if(typeof a=="function"){var o=t.value;n.payload=function(){return a(o)},n.callback=function(){fl(e,t)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){fl(e,t),typeof a!="function"&&(gr===null?gr=new Set([this]):gr.add(this));var l=t.stack;this.componentDidCatch(t.value,{componentStack:l!==null?l:""})}),n}function bd(e,t,n){var a=e.pingCache;if(a===null){a=e.pingCache=new Fm;var o=new Set;a.set(t,o)}else o=a.get(t),o===void 0&&(o=new Set,a.set(t,o));o.has(n)||(o.add(n),e=rx.bind(null,e,t,n),t.then(e,e))}function jd(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function wd(e,t,n,a,o){return e.mode&1?(e.flags|=65536,e.lanes=o,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Qt(-1,1),t.tag=2,xr(n,t,1))),n.lanes|=1),e)}var Wm=Xt.ReactCurrentOwner,at=!1;function Xe(e,t,n,a){t.child=e===null?hu(t,null,n,a):fn(t,e.child,n,a)}function kd(e,t,n,a,o){n=n.render;var s=t.ref;return ln(t,o),a=di(e,t,n,a,s,o),n=ci(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Kt(e,t,o)):(_e&&n&&Kl(t),t.flags|=1,Xe(e,t,a,o),t.child)}function Sd(e,t,n,a,o){if(e===null){var s=n.type;return typeof s=="function"&&!bi(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=s,Wu(e,t,s,a,o)):(e=oo(n.type,null,a,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,!(e.lanes&o)){var l=s.memoizedProps;if(n=n.compare,n=n!==null?n:sa,n(l,a)&&e.ref===t.ref)return Kt(e,t,o)}return t.flags|=1,e=vr(s,a),e.ref=t.ref,e.return=t,t.child=e}function Wu(e,t,n,a,o){if(e!==null){var s=e.memoizedProps;if(sa(s,a)&&e.ref===t.ref)if(at=!1,t.pendingProps=a=s,(e.lanes&o)!==0)e.flags&131072&&(at=!0);else return t.lanes=e.lanes,Kt(e,t,o)}return ml(e,t,n,a,o)}function qu(e,t,n){var a=t.pendingProps,o=a.children,s=e!==null?e.memoizedState:null;if(a.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},be(tn,dt),dt|=n;else{if(!(n&1073741824))return e=s!==null?s.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,be(tn,dt),dt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},a=s!==null?s.baseLanes:n,be(tn,dt),dt|=a}else s!==null?(a=s.baseLanes|n,t.memoizedState=null):a=n,be(tn,dt),dt|=a;return Xe(e,t,o,n),t.child}function Vu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ml(e,t,n,a,o){var s=st(n)?Ir:Ke.current;return s=un(t,s),ln(t,o),n=di(e,t,n,a,s,o),a=ci(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Kt(e,t,o)):(_e&&a&&Kl(t),t.flags|=1,Xe(e,t,n,o),t.child)}function _d(e,t,n,a,o){if(st(n)){var s=!0;yo(t)}else s=!1;if(ln(t,o),t.stateNode===null)ro(e,t),$u(t,n,a),pl(t,n,a,o),a=!0;else if(e===null){var l=t.stateNode,i=t.memoizedProps;l.props=i;var d=l.context,u=n.contextType;typeof u=="object"&&u!==null?u=jt(u):(u=st(n)?Ir:Ke.current,u=un(t,u));var v=n.getDerivedStateFromProps,m=typeof v=="function"||typeof l.getSnapshotBeforeUpdate=="function";m||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(i!==a||d!==u)&&yd(t,l,a,u),or=!1;var b=t.memoizedState;l.state=b,So(t,a,l,o),d=t.memoizedState,i!==a||b!==d||ot.current||or?(typeof v=="function"&&(ul(t,n,v,a),d=t.memoizedState),(i=or||vd(t,n,i,a,b,d,u))?(m||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(t.flags|=4194308)):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=d),l.props=a,l.state=d,l.context=u,a=i):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{l=t.stateNode,yu(e,t),i=t.memoizedProps,u=t.type===t.elementType?i:Ct(t.type,i),l.props=u,m=t.pendingProps,b=l.context,d=n.contextType,typeof d=="object"&&d!==null?d=jt(d):(d=st(n)?Ir:Ke.current,d=un(t,d));var w=n.getDerivedStateFromProps;(v=typeof w=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(i!==m||b!==d)&&yd(t,l,a,d),or=!1,b=t.memoizedState,l.state=b,So(t,a,l,o);var _=t.memoizedState;i!==m||b!==_||ot.current||or?(typeof w=="function"&&(ul(t,n,w,a),_=t.memoizedState),(u=or||vd(t,n,u,a,b,_,d)||!1)?(v||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(a,_,d),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(a,_,d)),typeof l.componentDidUpdate=="function"&&(t.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof l.componentDidUpdate!="function"||i===e.memoizedProps&&b===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&b===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=_),l.props=a,l.state=_,l.context=d,a=u):(typeof l.componentDidUpdate!="function"||i===e.memoizedProps&&b===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&b===e.memoizedState||(t.flags|=1024),a=!1)}return xl(e,t,n,a,s,o)}function xl(e,t,n,a,o,s){Vu(e,t);var l=(t.flags&128)!==0;if(!a&&!l)return o&&cd(t,n,!1),Kt(e,t,s);a=t.stateNode,Wm.current=t;var i=l&&typeof n.getDerivedStateFromError!="function"?null:a.render();return t.flags|=1,e!==null&&l?(t.child=fn(t,e.child,null,s),t.child=fn(t,null,i,s)):Xe(e,t,i,s),t.memoizedState=a.state,o&&cd(t,n,!0),t.child}function Hu(e){var t=e.stateNode;t.pendingContext?dd(e,t.pendingContext,t.pendingContext!==t.context):t.context&&dd(e,t.context,!1),oi(e,t.containerInfo)}function Nd(e,t,n,a,o){return pn(),Zl(o),t.flags|=256,Xe(e,t,n,a),t.child}var gl={dehydrated:null,treeContext:null,retryLane:0};function hl(e){return{baseLanes:e,cachePool:null,transitions:null}}function Qu(e,t,n){var a=t.pendingProps,o=Ne.current,s=!1,l=(t.flags&128)!==0,i;if((i=l)||(i=e!==null&&e.memoizedState===null?!1:(o&2)!==0),i?(s=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),be(Ne,o&1),e===null)return dl(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(l=a.children,e=a.fallback,s?(a=t.mode,s=t.child,l={mode:"hidden",children:l},!(a&1)&&s!==null?(s.childLanes=0,s.pendingProps=l):s=Go(l,a,0,null),e=Tr(e,a,n,null),s.return=t,e.return=t,s.sibling=e,t.child=s,t.child.memoizedState=hl(n),t.memoizedState=gl,e):fi(t,l));if(o=e.memoizedState,o!==null&&(i=o.dehydrated,i!==null))return qm(e,t,l,a,i,o,n);if(s){s=a.fallback,l=t.mode,o=e.child,i=o.sibling;var d={mode:"hidden",children:a.children};return!(l&1)&&t.child!==o?(a=t.child,a.childLanes=0,a.pendingProps=d,t.deletions=null):(a=vr(o,d),a.subtreeFlags=o.subtreeFlags&14680064),i!==null?s=vr(i,s):(s=Tr(s,l,n,null),s.flags|=2),s.return=t,a.return=t,a.sibling=s,t.child=a,a=s,s=t.child,l=e.child.memoizedState,l=l===null?hl(n):{baseLanes:l.baseLanes|n,cachePool:null,transitions:l.transitions},s.memoizedState=l,s.childLanes=e.childLanes&~n,t.memoizedState=gl,a}return s=e.child,e=s.sibling,a=vr(s,{mode:"visible",children:a.children}),!(t.mode&1)&&(a.lanes=n),a.return=t,a.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=a,t.memoizedState=null,a}function fi(e,t){return t=Go({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Wa(e,t,n,a){return a!==null&&Zl(a),fn(t,e.child,null,n),e=fi(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function qm(e,t,n,a,o,s,l){if(n)return t.flags&256?(t.flags&=-257,a=Ns(Error(W(422))),Wa(e,t,l,a)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(s=a.fallback,o=t.mode,a=Go({mode:"visible",children:a.children},o,0,null),s=Tr(s,o,l,null),s.flags|=2,a.return=t,s.return=t,a.sibling=s,t.child=a,t.mode&1&&fn(t,e.child,null,l),t.child.memoizedState=hl(l),t.memoizedState=gl,s);if(!(t.mode&1))return Wa(e,t,l,null);if(o.data==="$!"){if(a=o.nextSibling&&o.nextSibling.dataset,a)var i=a.dgst;return a=i,s=Error(W(419)),a=Ns(s,a,void 0),Wa(e,t,l,a)}if(i=(l&e.childLanes)!==0,at||i){if(a=Ue,a!==null){switch(l&-l){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=o&(a.suspendedLanes|l)?0:o,o!==0&&o!==s.retryLane&&(s.retryLane=o,Jt(e,o),Pt(a,e,o,-1))}return yi(),a=Ns(Error(W(421))),Wa(e,t,l,a)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=nx.bind(null,e),o._reactRetry=t,null):(e=s.treeContext,ct=mr(o.nextSibling),ut=t,_e=!0,Et=null,e!==null&&(ht[vt++]=qt,ht[vt++]=Vt,ht[vt++]=Ar,qt=e.id,Vt=e.overflow,Ar=t),t=fi(t,a.children),t.flags|=4096,t)}function Cd(e,t,n){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),cl(e.return,t,n)}function Cs(e,t,n,a,o){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:n,tailMode:o}:(s.isBackwards=t,s.rendering=null,s.renderingStartTime=0,s.last=a,s.tail=n,s.tailMode=o)}function Yu(e,t,n){var a=t.pendingProps,o=a.revealOrder,s=a.tail;if(Xe(e,t,a.children,n),a=Ne.current,a&2)a=a&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Cd(e,n,t);else if(e.tag===19)Cd(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}a&=1}if(be(Ne,a),!(t.mode&1))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;n!==null;)e=n.alternate,e!==null&&_o(e)===null&&(o=n),n=n.sibling;n=o,n===null?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Cs(t,!1,o,n,s);break;case"backwards":for(n=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&_o(e)===null){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}Cs(t,!0,n,null,s);break;case"together":Cs(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ro(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Kt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Br|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(W(153));if(t.child!==null){for(e=t.child,n=vr(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=vr(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Vm(e,t,n){switch(t.tag){case 3:Hu(t),pn();break;case 5:bu(t);break;case 1:st(t.type)&&yo(t);break;case 4:oi(t,t.stateNode.containerInfo);break;case 10:var a=t.type._context,o=t.memoizedProps.value;be(wo,a._currentValue),a._currentValue=o;break;case 13:if(a=t.memoizedState,a!==null)return a.dehydrated!==null?(be(Ne,Ne.current&1),t.flags|=128,null):n&t.child.childLanes?Qu(e,t,n):(be(Ne,Ne.current&1),e=Kt(e,t,n),e!==null?e.sibling:null);be(Ne,Ne.current&1);break;case 19:if(a=(n&t.childLanes)!==0,e.flags&128){if(a)return Yu(e,t,n);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),be(Ne,Ne.current),a)break;return null;case 22:case 23:return t.lanes=0,qu(e,t,n)}return Kt(e,t,n)}var Gu,vl,Ju,Ku;Gu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};vl=function(){};Ju=function(e,t,n,a){var o=e.memoizedProps;if(o!==a){e=t.stateNode,Dr(Mt.current);var s=null;switch(n){case"input":o=$s(e,o),a=$s(e,a),s=[];break;case"select":o=ze({},o,{value:void 0}),a=ze({},a,{value:void 0}),s=[];break;case"textarea":o=Ws(e,o),a=Ws(e,a),s=[];break;default:typeof o.onClick!="function"&&typeof a.onClick=="function"&&(e.onclick=ho)}Vs(n,a);var l;n=null;for(u in o)if(!a.hasOwnProperty(u)&&o.hasOwnProperty(u)&&o[u]!=null)if(u==="style"){var i=o[u];for(l in i)i.hasOwnProperty(l)&&(n||(n={}),n[l]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Zn.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in a){var d=a[u];if(i=o!=null?o[u]:void 0,a.hasOwnProperty(u)&&d!==i&&(d!=null||i!=null))if(u==="style")if(i){for(l in i)!i.hasOwnProperty(l)||d&&d.hasOwnProperty(l)||(n||(n={}),n[l]="");for(l in d)d.hasOwnProperty(l)&&i[l]!==d[l]&&(n||(n={}),n[l]=d[l])}else n||(s||(s=[]),s.push(u,n)),n=d;else u==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,i=i?i.__html:void 0,d!=null&&i!==d&&(s=s||[]).push(u,d)):u==="children"?typeof d!="string"&&typeof d!="number"||(s=s||[]).push(u,""+d):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Zn.hasOwnProperty(u)?(d!=null&&u==="onScroll"&&ke("scroll",e),s||i===d||(s=[])):(s=s||[]).push(u,d))}n&&(s=s||[]).push("style",n);var u=s;(t.updateQueue=u)&&(t.flags|=4)}};Ku=function(e,t,n,a){n!==a&&(t.flags|=4)};function Ln(e,t){if(!_e)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function Ye(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,a=0;if(t)for(var o=e.child;o!==null;)n|=o.lanes|o.childLanes,a|=o.subtreeFlags&14680064,a|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)n|=o.lanes|o.childLanes,a|=o.subtreeFlags,a|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=a,e.childLanes=n,t}function Hm(e,t,n){var a=t.pendingProps;switch(Xl(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ye(t),null;case 1:return st(t.type)&&vo(),Ye(t),null;case 3:return a=t.stateNode,mn(),Se(ot),Se(Ke),li(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Ua(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Et!==null&&(Nl(Et),Et=null))),vl(e,t),Ye(t),null;case 5:si(t);var o=Dr(ua.current);if(n=t.type,e!==null&&t.stateNode!=null)Ju(e,t,n,a,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!a){if(t.stateNode===null)throw Error(W(166));return Ye(t),null}if(e=Dr(Mt.current),Ua(t)){a=t.stateNode,n=t.type;var s=t.memoizedProps;switch(a[Bt]=t,a[da]=s,e=(t.mode&1)!==0,n){case"dialog":ke("cancel",a),ke("close",a);break;case"iframe":case"object":case"embed":ke("load",a);break;case"video":case"audio":for(o=0;o<On.length;o++)ke(On[o],a);break;case"source":ke("error",a);break;case"img":case"image":case"link":ke("error",a),ke("load",a);break;case"details":ke("toggle",a);break;case"input":Ri(a,s),ke("invalid",a);break;case"select":a._wrapperState={wasMultiple:!!s.multiple},ke("invalid",a);break;case"textarea":Oi(a,s),ke("invalid",a)}Vs(n,s),o=null;for(var l in s)if(s.hasOwnProperty(l)){var i=s[l];l==="children"?typeof i=="string"?a.textContent!==i&&(s.suppressHydrationWarning!==!0&&$a(a.textContent,i,e),o=["children",i]):typeof i=="number"&&a.textContent!==""+i&&(s.suppressHydrationWarning!==!0&&$a(a.textContent,i,e),o=["children",""+i]):Zn.hasOwnProperty(l)&&i!=null&&l==="onScroll"&&ke("scroll",a)}switch(n){case"input":Ta(a),Bi(a,s,!0);break;case"textarea":Ta(a),Mi(a);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(a.onclick=ho)}a=o,t.updateQueue=a,a!==null&&(t.flags|=4)}else{l=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=_c(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=l.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof a.is=="string"?e=l.createElement(n,{is:a.is}):(e=l.createElement(n),n==="select"&&(l=e,a.multiple?l.multiple=!0:a.size&&(l.size=a.size))):e=l.createElementNS(e,n),e[Bt]=t,e[da]=a,Gu(e,t,!1,!1),t.stateNode=e;e:{switch(l=Hs(n,a),n){case"dialog":ke("cancel",e),ke("close",e),o=a;break;case"iframe":case"object":case"embed":ke("load",e),o=a;break;case"video":case"audio":for(o=0;o<On.length;o++)ke(On[o],e);o=a;break;case"source":ke("error",e),o=a;break;case"img":case"image":case"link":ke("error",e),ke("load",e),o=a;break;case"details":ke("toggle",e),o=a;break;case"input":Ri(e,a),o=$s(e,a),ke("invalid",e);break;case"option":o=a;break;case"select":e._wrapperState={wasMultiple:!!a.multiple},o=ze({},a,{value:void 0}),ke("invalid",e);break;case"textarea":Oi(e,a),o=Ws(e,a),ke("invalid",e);break;default:o=a}Vs(n,o),i=o;for(s in i)if(i.hasOwnProperty(s)){var d=i[s];s==="style"?zc(e,d):s==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,d!=null&&Nc(e,d)):s==="children"?typeof d=="string"?(n!=="textarea"||d!=="")&&ea(e,d):typeof d=="number"&&ea(e,""+d):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Zn.hasOwnProperty(s)?d!=null&&s==="onScroll"&&ke("scroll",e):d!=null&&Bl(e,s,d,l))}switch(n){case"input":Ta(e),Bi(e,a,!1);break;case"textarea":Ta(e),Mi(e);break;case"option":a.value!=null&&e.setAttribute("value",""+yr(a.value));break;case"select":e.multiple=!!a.multiple,s=a.value,s!=null?nn(e,!!a.multiple,s,!1):a.defaultValue!=null&&nn(e,!!a.multiple,a.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=ho)}switch(n){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}}a&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ye(t),null;case 6:if(e&&t.stateNode!=null)Ku(e,t,e.memoizedProps,a);else{if(typeof a!="string"&&t.stateNode===null)throw Error(W(166));if(n=Dr(ua.current),Dr(Mt.current),Ua(t)){if(a=t.stateNode,n=t.memoizedProps,a[Bt]=t,(s=a.nodeValue!==n)&&(e=ut,e!==null))switch(e.tag){case 3:$a(a.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&$a(a.nodeValue,n,(e.mode&1)!==0)}s&&(t.flags|=4)}else a=(n.nodeType===9?n:n.ownerDocument).createTextNode(a),a[Bt]=t,t.stateNode=a}return Ye(t),null;case 13:if(Se(Ne),a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(_e&&ct!==null&&t.mode&1&&!(t.flags&128))xu(),pn(),t.flags|=98560,s=!1;else if(s=Ua(t),a!==null&&a.dehydrated!==null){if(e===null){if(!s)throw Error(W(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(W(317));s[Bt]=t}else pn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Ye(t),s=!1}else Et!==null&&(Nl(Et),Et=null),s=!0;if(!s)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(a=a!==null,a!==(e!==null&&e.memoizedState!==null)&&a&&(t.child.flags|=8192,t.mode&1&&(e===null||Ne.current&1?Me===0&&(Me=3):yi())),t.updateQueue!==null&&(t.flags|=4),Ye(t),null);case 4:return mn(),vl(e,t),e===null&&la(t.stateNode.containerInfo),Ye(t),null;case 10:return ri(t.type._context),Ye(t),null;case 17:return st(t.type)&&vo(),Ye(t),null;case 19:if(Se(Ne),s=t.memoizedState,s===null)return Ye(t),null;if(a=(t.flags&128)!==0,l=s.rendering,l===null)if(a)Ln(s,!1);else{if(Me!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(l=_o(e),l!==null){for(t.flags|=128,Ln(s,!1),a=l.updateQueue,a!==null&&(t.updateQueue=a,t.flags|=4),t.subtreeFlags=0,a=n,n=t.child;n!==null;)s=n,e=a,s.flags&=14680066,l=s.alternate,l===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=l.childLanes,s.lanes=l.lanes,s.child=l.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=l.memoizedProps,s.memoizedState=l.memoizedState,s.updateQueue=l.updateQueue,s.type=l.type,e=l.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return be(Ne,Ne.current&1|2),t.child}e=e.sibling}s.tail!==null&&Le()>gn&&(t.flags|=128,a=!0,Ln(s,!1),t.lanes=4194304)}else{if(!a)if(e=_o(l),e!==null){if(t.flags|=128,a=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Ln(s,!0),s.tail===null&&s.tailMode==="hidden"&&!l.alternate&&!_e)return Ye(t),null}else 2*Le()-s.renderingStartTime>gn&&n!==1073741824&&(t.flags|=128,a=!0,Ln(s,!1),t.lanes=4194304);s.isBackwards?(l.sibling=t.child,t.child=l):(n=s.last,n!==null?n.sibling=l:t.child=l,s.last=l)}return s.tail!==null?(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=Le(),t.sibling=null,n=Ne.current,be(Ne,a?n&1|2:n&1),t):(Ye(t),null);case 22:case 23:return vi(),a=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==a&&(t.flags|=8192),a&&t.mode&1?dt&1073741824&&(Ye(t),t.subtreeFlags&6&&(t.flags|=8192)):Ye(t),null;case 24:return null;case 25:return null}throw Error(W(156,t.tag))}function Qm(e,t){switch(Xl(t),t.tag){case 1:return st(t.type)&&vo(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return mn(),Se(ot),Se(Ke),li(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return si(t),null;case 13:if(Se(Ne),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(W(340));pn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Se(Ne),null;case 4:return mn(),null;case 10:return ri(t.type._context),null;case 22:case 23:return vi(),null;case 24:return null;default:return null}}var qa=!1,Ge=!1,Ym=typeof WeakSet=="function"?WeakSet:Set,ee=null;function en(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(a){De(e,t,a)}else n.current=null}function yl(e,t,n){try{n()}catch(a){De(e,t,a)}}var zd=!1;function Gm(e,t){if(rl=mo,e=ru(),Jl(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var a=n.getSelection&&n.getSelection();if(a&&a.rangeCount!==0){n=a.anchorNode;var o=a.anchorOffset,s=a.focusNode;a=a.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var l=0,i=-1,d=-1,u=0,v=0,m=e,b=null;t:for(;;){for(var w;m!==n||o!==0&&m.nodeType!==3||(i=l+o),m!==s||a!==0&&m.nodeType!==3||(d=l+a),m.nodeType===3&&(l+=m.nodeValue.length),(w=m.firstChild)!==null;)b=m,m=w;for(;;){if(m===e)break t;if(b===n&&++u===o&&(i=l),b===s&&++v===a&&(d=l),(w=m.nextSibling)!==null)break;m=b,b=m.parentNode}m=w}n=i===-1||d===-1?null:{start:i,end:d}}else n=null}n=n||{start:0,end:0}}else n=null;for(nl={focusedElem:e,selectionRange:n},mo=!1,ee=t;ee!==null;)if(t=ee,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,ee=e;else for(;ee!==null;){t=ee;try{var _=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(_!==null){var S=_.memoizedProps,z=_.memoizedState,x=t.stateNode,f=x.getSnapshotBeforeUpdate(t.elementType===t.type?S:Ct(t.type,S),z);x.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var c=t.stateNode.containerInfo;c.nodeType===1?c.textContent="":c.nodeType===9&&c.documentElement&&c.removeChild(c.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(W(163))}}catch(k){De(t,t.return,k)}if(e=t.sibling,e!==null){e.return=t.return,ee=e;break}ee=t.return}return _=zd,zd=!1,_}function Jn(e,t,n){var a=t.updateQueue;if(a=a!==null?a.lastEffect:null,a!==null){var o=a=a.next;do{if((o.tag&e)===e){var s=o.destroy;o.destroy=void 0,s!==void 0&&yl(t,n,s)}o=o.next}while(o!==a)}}function Qo(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var a=n.create;n.destroy=a()}n=n.next}while(n!==t)}}function bl(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Xu(e){var t=e.alternate;t!==null&&(e.alternate=null,Xu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Bt],delete t[da],delete t[sl],delete t[Pm],delete t[Tm])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Zu(e){return e.tag===5||e.tag===3||e.tag===4}function Ed(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Zu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function jl(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ho));else if(a!==4&&(e=e.child,e!==null))for(jl(e,t,n),e=e.sibling;e!==null;)jl(e,t,n),e=e.sibling}function wl(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(a!==4&&(e=e.child,e!==null))for(wl(e,t,n),e=e.sibling;e!==null;)wl(e,t,n),e=e.sibling}var Fe=null,zt=!1;function nr(e,t,n){for(n=n.child;n!==null;)ep(e,t,n),n=n.sibling}function ep(e,t,n){if(Ot&&typeof Ot.onCommitFiberUnmount=="function")try{Ot.onCommitFiberUnmount(Mo,n)}catch{}switch(n.tag){case 5:Ge||en(n,t);case 6:var a=Fe,o=zt;Fe=null,nr(e,t,n),Fe=a,zt=o,Fe!==null&&(zt?(e=Fe,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Fe.removeChild(n.stateNode));break;case 18:Fe!==null&&(zt?(e=Fe,n=n.stateNode,e.nodeType===8?bs(e.parentNode,n):e.nodeType===1&&bs(e,n),aa(e)):bs(Fe,n.stateNode));break;case 4:a=Fe,o=zt,Fe=n.stateNode.containerInfo,zt=!0,nr(e,t,n),Fe=a,zt=o;break;case 0:case 11:case 14:case 15:if(!Ge&&(a=n.updateQueue,a!==null&&(a=a.lastEffect,a!==null))){o=a=a.next;do{var s=o,l=s.destroy;s=s.tag,l!==void 0&&(s&2||s&4)&&yl(n,t,l),o=o.next}while(o!==a)}nr(e,t,n);break;case 1:if(!Ge&&(en(n,t),a=n.stateNode,typeof a.componentWillUnmount=="function"))try{a.props=n.memoizedProps,a.state=n.memoizedState,a.componentWillUnmount()}catch(i){De(n,t,i)}nr(e,t,n);break;case 21:nr(e,t,n);break;case 22:n.mode&1?(Ge=(a=Ge)||n.memoizedState!==null,nr(e,t,n),Ge=a):nr(e,t,n);break;default:nr(e,t,n)}}function Dd(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Ym),t.forEach(function(a){var o=ax.bind(null,e,a);n.has(a)||(n.add(a),a.then(o,o))})}}function Nt(e,t){var n=t.deletions;if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];try{var s=e,l=t,i=l;e:for(;i!==null;){switch(i.tag){case 5:Fe=i.stateNode,zt=!1;break e;case 3:Fe=i.stateNode.containerInfo,zt=!0;break e;case 4:Fe=i.stateNode.containerInfo,zt=!0;break e}i=i.return}if(Fe===null)throw Error(W(160));ep(s,l,o),Fe=null,zt=!1;var d=o.alternate;d!==null&&(d.return=null),o.return=null}catch(u){De(o,t,u)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)tp(t,e),t=t.sibling}function tp(e,t){var n=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Nt(t,e),At(e),a&4){try{Jn(3,e,e.return),Qo(3,e)}catch(S){De(e,e.return,S)}try{Jn(5,e,e.return)}catch(S){De(e,e.return,S)}}break;case 1:Nt(t,e),At(e),a&512&&n!==null&&en(n,n.return);break;case 5:if(Nt(t,e),At(e),a&512&&n!==null&&en(n,n.return),e.flags&32){var o=e.stateNode;try{ea(o,"")}catch(S){De(e,e.return,S)}}if(a&4&&(o=e.stateNode,o!=null)){var s=e.memoizedProps,l=n!==null?n.memoizedProps:s,i=e.type,d=e.updateQueue;if(e.updateQueue=null,d!==null)try{i==="input"&&s.type==="radio"&&s.name!=null&&kc(o,s),Hs(i,l);var u=Hs(i,s);for(l=0;l<d.length;l+=2){var v=d[l],m=d[l+1];v==="style"?zc(o,m):v==="dangerouslySetInnerHTML"?Nc(o,m):v==="children"?ea(o,m):Bl(o,v,m,u)}switch(i){case"input":Us(o,s);break;case"textarea":Sc(o,s);break;case"select":var b=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!s.multiple;var w=s.value;w!=null?nn(o,!!s.multiple,w,!1):b!==!!s.multiple&&(s.defaultValue!=null?nn(o,!!s.multiple,s.defaultValue,!0):nn(o,!!s.multiple,s.multiple?[]:"",!1))}o[da]=s}catch(S){De(e,e.return,S)}}break;case 6:if(Nt(t,e),At(e),a&4){if(e.stateNode===null)throw Error(W(162));o=e.stateNode,s=e.memoizedProps;try{o.nodeValue=s}catch(S){De(e,e.return,S)}}break;case 3:if(Nt(t,e),At(e),a&4&&n!==null&&n.memoizedState.isDehydrated)try{aa(t.containerInfo)}catch(S){De(e,e.return,S)}break;case 4:Nt(t,e),At(e);break;case 13:Nt(t,e),At(e),o=e.child,o.flags&8192&&(s=o.memoizedState!==null,o.stateNode.isHidden=s,!s||o.alternate!==null&&o.alternate.memoizedState!==null||(gi=Le())),a&4&&Dd(e);break;case 22:if(v=n!==null&&n.memoizedState!==null,e.mode&1?(Ge=(u=Ge)||v,Nt(t,e),Ge=u):Nt(t,e),At(e),a&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!v&&e.mode&1)for(ee=e,v=e.child;v!==null;){for(m=ee=v;ee!==null;){switch(b=ee,w=b.child,b.tag){case 0:case 11:case 14:case 15:Jn(4,b,b.return);break;case 1:en(b,b.return);var _=b.stateNode;if(typeof _.componentWillUnmount=="function"){a=b,n=b.return;try{t=a,_.props=t.memoizedProps,_.state=t.memoizedState,_.componentWillUnmount()}catch(S){De(a,n,S)}}break;case 5:en(b,b.return);break;case 22:if(b.memoizedState!==null){Td(m);continue}}w!==null?(w.return=b,ee=w):Td(m)}v=v.sibling}e:for(v=null,m=e;;){if(m.tag===5){if(v===null){v=m;try{o=m.stateNode,u?(s=o.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(i=m.stateNode,d=m.memoizedProps.style,l=d!=null&&d.hasOwnProperty("display")?d.display:null,i.style.display=Cc("display",l))}catch(S){De(e,e.return,S)}}}else if(m.tag===6){if(v===null)try{m.stateNode.nodeValue=u?"":m.memoizedProps}catch(S){De(e,e.return,S)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;v===m&&(v=null),m=m.return}v===m&&(v=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Nt(t,e),At(e),a&4&&Dd(e);break;case 21:break;default:Nt(t,e),At(e)}}function At(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Zu(n)){var a=n;break e}n=n.return}throw Error(W(160))}switch(a.tag){case 5:var o=a.stateNode;a.flags&32&&(ea(o,""),a.flags&=-33);var s=Ed(e);wl(e,s,o);break;case 3:case 4:var l=a.stateNode.containerInfo,i=Ed(e);jl(e,i,l);break;default:throw Error(W(161))}}catch(d){De(e,e.return,d)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Jm(e,t,n){ee=e,rp(e)}function rp(e,t,n){for(var a=(e.mode&1)!==0;ee!==null;){var o=ee,s=o.child;if(o.tag===22&&a){var l=o.memoizedState!==null||qa;if(!l){var i=o.alternate,d=i!==null&&i.memoizedState!==null||Ge;i=qa;var u=Ge;if(qa=l,(Ge=d)&&!u)for(ee=o;ee!==null;)l=ee,d=l.child,l.tag===22&&l.memoizedState!==null?Ld(o):d!==null?(d.return=l,ee=d):Ld(o);for(;s!==null;)ee=s,rp(s),s=s.sibling;ee=o,qa=i,Ge=u}Pd(e)}else o.subtreeFlags&8772&&s!==null?(s.return=o,ee=s):Pd(e)}}function Pd(e){for(;ee!==null;){var t=ee;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Ge||Qo(5,t);break;case 1:var a=t.stateNode;if(t.flags&4&&!Ge)if(n===null)a.componentDidMount();else{var o=t.elementType===t.type?n.memoizedProps:Ct(t.type,n.memoizedProps);a.componentDidUpdate(o,n.memoizedState,a.__reactInternalSnapshotBeforeUpdate)}var s=t.updateQueue;s!==null&&xd(t,s,a);break;case 3:var l=t.updateQueue;if(l!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}xd(t,l,n)}break;case 5:var i=t.stateNode;if(n===null&&t.flags&4){n=i;var d=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":d.autoFocus&&n.focus();break;case"img":d.src&&(n.src=d.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var v=u.memoizedState;if(v!==null){var m=v.dehydrated;m!==null&&aa(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(W(163))}Ge||t.flags&512&&bl(t)}catch(b){De(t,t.return,b)}}if(t===e){ee=null;break}if(n=t.sibling,n!==null){n.return=t.return,ee=n;break}ee=t.return}}function Td(e){for(;ee!==null;){var t=ee;if(t===e){ee=null;break}var n=t.sibling;if(n!==null){n.return=t.return,ee=n;break}ee=t.return}}function Ld(e){for(;ee!==null;){var t=ee;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Qo(4,t)}catch(d){De(t,n,d)}break;case 1:var a=t.stateNode;if(typeof a.componentDidMount=="function"){var o=t.return;try{a.componentDidMount()}catch(d){De(t,o,d)}}var s=t.return;try{bl(t)}catch(d){De(t,s,d)}break;case 5:var l=t.return;try{bl(t)}catch(d){De(t,l,d)}}}catch(d){De(t,t.return,d)}if(t===e){ee=null;break}var i=t.sibling;if(i!==null){i.return=t.return,ee=i;break}ee=t.return}}var Km=Math.ceil,zo=Xt.ReactCurrentDispatcher,mi=Xt.ReactCurrentOwner,bt=Xt.ReactCurrentBatchConfig,pe=0,Ue=null,Ae=null,We=0,dt=0,tn=kr(0),Me=0,xa=null,Br=0,Yo=0,xi=0,Kn=null,nt=null,gi=0,gn=1/0,Ft=null,Eo=!1,kl=null,gr=null,Va=!1,dr=null,Do=0,Xn=0,Sl=null,no=-1,ao=0;function Ze(){return pe&6?Le():no!==-1?no:no=Le()}function hr(e){return e.mode&1?pe&2&&We!==0?We&-We:Im.transition!==null?(ao===0&&(ao=$c()),ao):(e=he,e!==0||(e=window.event,e=e===void 0?16:Qc(e.type)),e):1}function Pt(e,t,n,a){if(50<Xn)throw Xn=0,Sl=null,Error(W(185));ya(e,n,a),(!(pe&2)||e!==Ue)&&(e===Ue&&(!(pe&2)&&(Yo|=n),Me===4&&lr(e,We)),lt(e,a),n===1&&pe===0&&!(t.mode&1)&&(gn=Le()+500,qo&&Sr()))}function lt(e,t){var n=e.callbackNode;If(e,t);var a=fo(e,e===Ue?We:0);if(a===0)n!==null&&Fi(n),e.callbackNode=null,e.callbackPriority=0;else if(t=a&-a,e.callbackPriority!==t){if(n!=null&&Fi(n),t===1)e.tag===0?Lm(Id.bind(null,e)):pu(Id.bind(null,e)),Em(function(){!(pe&6)&&Sr()}),n=null;else{switch(Uc(a)){case 1:n=Fl;break;case 4:n=Oc;break;case 16:n=po;break;case 536870912:n=Mc;break;default:n=po}n=cp(n,np.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function np(e,t){if(no=-1,ao=0,pe&6)throw Error(W(327));var n=e.callbackNode;if(dn()&&e.callbackNode!==n)return null;var a=fo(e,e===Ue?We:0);if(a===0)return null;if(a&30||a&e.expiredLanes||t)t=Po(e,a);else{t=a;var o=pe;pe|=2;var s=op();(Ue!==e||We!==t)&&(Ft=null,gn=Le()+500,Pr(e,t));do try{ex();break}catch(i){ap(e,i)}while(!0);ti(),zo.current=s,pe=o,Ae!==null?t=0:(Ue=null,We=0,t=Me)}if(t!==0){if(t===2&&(o=Ks(e),o!==0&&(a=o,t=_l(e,o))),t===1)throw n=xa,Pr(e,0),lr(e,a),lt(e,Le()),n;if(t===6)lr(e,a);else{if(o=e.current.alternate,!(a&30)&&!Xm(o)&&(t=Po(e,a),t===2&&(s=Ks(e),s!==0&&(a=s,t=_l(e,s))),t===1))throw n=xa,Pr(e,0),lr(e,a),lt(e,Le()),n;switch(e.finishedWork=o,e.finishedLanes=a,t){case 0:case 1:throw Error(W(345));case 2:Cr(e,nt,Ft);break;case 3:if(lr(e,a),(a&130023424)===a&&(t=gi+500-Le(),10<t)){if(fo(e,0)!==0)break;if(o=e.suspendedLanes,(o&a)!==a){Ze(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=ol(Cr.bind(null,e,nt,Ft),t);break}Cr(e,nt,Ft);break;case 4:if(lr(e,a),(a&4194240)===a)break;for(t=e.eventTimes,o=-1;0<a;){var l=31-Dt(a);s=1<<l,l=t[l],l>o&&(o=l),a&=~s}if(a=o,a=Le()-a,a=(120>a?120:480>a?480:1080>a?1080:1920>a?1920:3e3>a?3e3:4320>a?4320:1960*Km(a/1960))-a,10<a){e.timeoutHandle=ol(Cr.bind(null,e,nt,Ft),a);break}Cr(e,nt,Ft);break;case 5:Cr(e,nt,Ft);break;default:throw Error(W(329))}}}return lt(e,Le()),e.callbackNode===n?np.bind(null,e):null}function _l(e,t){var n=Kn;return e.current.memoizedState.isDehydrated&&(Pr(e,t).flags|=256),e=Po(e,t),e!==2&&(t=nt,nt=n,t!==null&&Nl(t)),e}function Nl(e){nt===null?nt=e:nt.push.apply(nt,e)}function Xm(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var a=0;a<n.length;a++){var o=n[a],s=o.getSnapshot;o=o.value;try{if(!Tt(s(),o))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function lr(e,t){for(t&=~xi,t&=~Yo,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Dt(t),a=1<<n;e[n]=-1,t&=~a}}function Id(e){if(pe&6)throw Error(W(327));dn();var t=fo(e,0);if(!(t&1))return lt(e,Le()),null;var n=Po(e,t);if(e.tag!==0&&n===2){var a=Ks(e);a!==0&&(t=a,n=_l(e,a))}if(n===1)throw n=xa,Pr(e,0),lr(e,t),lt(e,Le()),n;if(n===6)throw Error(W(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Cr(e,nt,Ft),lt(e,Le()),null}function hi(e,t){var n=pe;pe|=1;try{return e(t)}finally{pe=n,pe===0&&(gn=Le()+500,qo&&Sr())}}function Or(e){dr!==null&&dr.tag===0&&!(pe&6)&&dn();var t=pe;pe|=1;var n=bt.transition,a=he;try{if(bt.transition=null,he=1,e)return e()}finally{he=a,bt.transition=n,pe=t,!(pe&6)&&Sr()}}function vi(){dt=tn.current,Se(tn)}function Pr(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,zm(n)),Ae!==null)for(n=Ae.return;n!==null;){var a=n;switch(Xl(a),a.tag){case 1:a=a.type.childContextTypes,a!=null&&vo();break;case 3:mn(),Se(ot),Se(Ke),li();break;case 5:si(a);break;case 4:mn();break;case 13:Se(Ne);break;case 19:Se(Ne);break;case 10:ri(a.type._context);break;case 22:case 23:vi()}n=n.return}if(Ue=e,Ae=e=vr(e.current,null),We=dt=t,Me=0,xa=null,xi=Yo=Br=0,nt=Kn=null,Er!==null){for(t=0;t<Er.length;t++)if(n=Er[t],a=n.interleaved,a!==null){n.interleaved=null;var o=a.next,s=n.pending;if(s!==null){var l=s.next;s.next=o,a.next=l}n.pending=a}Er=null}return e}function ap(e,t){do{var n=Ae;try{if(ti(),eo.current=Co,No){for(var a=Ce.memoizedState;a!==null;){var o=a.queue;o!==null&&(o.pending=null),a=a.next}No=!1}if(Rr=0,$e=Oe=Ce=null,Gn=!1,pa=0,mi.current=null,n===null||n.return===null){Me=1,xa=t,Ae=null;break}e:{var s=e,l=n.return,i=n,d=t;if(t=We,i.flags|=32768,d!==null&&typeof d=="object"&&typeof d.then=="function"){var u=d,v=i,m=v.tag;if(!(v.mode&1)&&(m===0||m===11||m===15)){var b=v.alternate;b?(v.updateQueue=b.updateQueue,v.memoizedState=b.memoizedState,v.lanes=b.lanes):(v.updateQueue=null,v.memoizedState=null)}var w=jd(l);if(w!==null){w.flags&=-257,wd(w,l,i,s,t),w.mode&1&&bd(s,u,t),t=w,d=u;var _=t.updateQueue;if(_===null){var S=new Set;S.add(d),t.updateQueue=S}else _.add(d);break e}else{if(!(t&1)){bd(s,u,t),yi();break e}d=Error(W(426))}}else if(_e&&i.mode&1){var z=jd(l);if(z!==null){!(z.flags&65536)&&(z.flags|=256),wd(z,l,i,s,t),Zl(xn(d,i));break e}}s=d=xn(d,i),Me!==4&&(Me=2),Kn===null?Kn=[s]:Kn.push(s),s=l;do{switch(s.tag){case 3:s.flags|=65536,t&=-t,s.lanes|=t;var x=Uu(s,d,t);md(s,x);break e;case 1:i=d;var f=s.type,c=s.stateNode;if(!(s.flags&128)&&(typeof f.getDerivedStateFromError=="function"||c!==null&&typeof c.componentDidCatch=="function"&&(gr===null||!gr.has(c)))){s.flags|=65536,t&=-t,s.lanes|=t;var k=Fu(s,i,t);md(s,k);break e}}s=s.return}while(s!==null)}lp(n)}catch(I){t=I,Ae===n&&n!==null&&(Ae=n=n.return);continue}break}while(!0)}function op(){var e=zo.current;return zo.current=Co,e===null?Co:e}function yi(){(Me===0||Me===3||Me===2)&&(Me=4),Ue===null||!(Br&268435455)&&!(Yo&268435455)||lr(Ue,We)}function Po(e,t){var n=pe;pe|=2;var a=op();(Ue!==e||We!==t)&&(Ft=null,Pr(e,t));do try{Zm();break}catch(o){ap(e,o)}while(!0);if(ti(),pe=n,zo.current=a,Ae!==null)throw Error(W(261));return Ue=null,We=0,Me}function Zm(){for(;Ae!==null;)sp(Ae)}function ex(){for(;Ae!==null&&!_f();)sp(Ae)}function sp(e){var t=dp(e.alternate,e,dt);e.memoizedProps=e.pendingProps,t===null?lp(e):Ae=t,mi.current=null}function lp(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Qm(n,t),n!==null){n.flags&=32767,Ae=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Me=6,Ae=null;return}}else if(n=Hm(n,t,dt),n!==null){Ae=n;return}if(t=t.sibling,t!==null){Ae=t;return}Ae=t=e}while(t!==null);Me===0&&(Me=5)}function Cr(e,t,n){var a=he,o=bt.transition;try{bt.transition=null,he=1,tx(e,t,n,a)}finally{bt.transition=o,he=a}return null}function tx(e,t,n,a){do dn();while(dr!==null);if(pe&6)throw Error(W(327));n=e.finishedWork;var o=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(W(177));e.callbackNode=null,e.callbackPriority=0;var s=n.lanes|n.childLanes;if(Af(e,s),e===Ue&&(Ae=Ue=null,We=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Va||(Va=!0,cp(po,function(){return dn(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=bt.transition,bt.transition=null;var l=he;he=1;var i=pe;pe|=4,mi.current=null,Gm(e,n),tp(n,e),jm(nl),mo=!!rl,nl=rl=null,e.current=n,Jm(n),Nf(),pe=i,he=l,bt.transition=s}else e.current=n;if(Va&&(Va=!1,dr=e,Do=o),s=e.pendingLanes,s===0&&(gr=null),Ef(n.stateNode),lt(e,Le()),t!==null)for(a=e.onRecoverableError,n=0;n<t.length;n++)o=t[n],a(o.value,{componentStack:o.stack,digest:o.digest});if(Eo)throw Eo=!1,e=kl,kl=null,e;return Do&1&&e.tag!==0&&dn(),s=e.pendingLanes,s&1?e===Sl?Xn++:(Xn=0,Sl=e):Xn=0,Sr(),null}function dn(){if(dr!==null){var e=Uc(Do),t=bt.transition,n=he;try{if(bt.transition=null,he=16>e?16:e,dr===null)var a=!1;else{if(e=dr,dr=null,Do=0,pe&6)throw Error(W(331));var o=pe;for(pe|=4,ee=e.current;ee!==null;){var s=ee,l=s.child;if(ee.flags&16){var i=s.deletions;if(i!==null){for(var d=0;d<i.length;d++){var u=i[d];for(ee=u;ee!==null;){var v=ee;switch(v.tag){case 0:case 11:case 15:Jn(8,v,s)}var m=v.child;if(m!==null)m.return=v,ee=m;else for(;ee!==null;){v=ee;var b=v.sibling,w=v.return;if(Xu(v),v===u){ee=null;break}if(b!==null){b.return=w,ee=b;break}ee=w}}}var _=s.alternate;if(_!==null){var S=_.child;if(S!==null){_.child=null;do{var z=S.sibling;S.sibling=null,S=z}while(S!==null)}}ee=s}}if(s.subtreeFlags&2064&&l!==null)l.return=s,ee=l;else e:for(;ee!==null;){if(s=ee,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Jn(9,s,s.return)}var x=s.sibling;if(x!==null){x.return=s.return,ee=x;break e}ee=s.return}}var f=e.current;for(ee=f;ee!==null;){l=ee;var c=l.child;if(l.subtreeFlags&2064&&c!==null)c.return=l,ee=c;else e:for(l=f;ee!==null;){if(i=ee,i.flags&2048)try{switch(i.tag){case 0:case 11:case 15:Qo(9,i)}}catch(I){De(i,i.return,I)}if(i===l){ee=null;break e}var k=i.sibling;if(k!==null){k.return=i.return,ee=k;break e}ee=i.return}}if(pe=o,Sr(),Ot&&typeof Ot.onPostCommitFiberRoot=="function")try{Ot.onPostCommitFiberRoot(Mo,e)}catch{}a=!0}return a}finally{he=n,bt.transition=t}}return!1}function Ad(e,t,n){t=xn(n,t),t=Uu(e,t,1),e=xr(e,t,1),t=Ze(),e!==null&&(ya(e,1,t),lt(e,t))}function De(e,t,n){if(e.tag===3)Ad(e,e,n);else for(;t!==null;){if(t.tag===3){Ad(t,e,n);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(gr===null||!gr.has(a))){e=xn(n,e),e=Fu(t,e,1),t=xr(t,e,1),e=Ze(),t!==null&&(ya(t,1,e),lt(t,e));break}}t=t.return}}function rx(e,t,n){var a=e.pingCache;a!==null&&a.delete(t),t=Ze(),e.pingedLanes|=e.suspendedLanes&n,Ue===e&&(We&n)===n&&(Me===4||Me===3&&(We&130023424)===We&&500>Le()-gi?Pr(e,0):xi|=n),lt(e,t)}function ip(e,t){t===0&&(e.mode&1?(t=Aa,Aa<<=1,!(Aa&130023424)&&(Aa=4194304)):t=1);var n=Ze();e=Jt(e,t),e!==null&&(ya(e,t,n),lt(e,n))}function nx(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),ip(e,n)}function ax(e,t){var n=0;switch(e.tag){case 13:var a=e.stateNode,o=e.memoizedState;o!==null&&(n=o.retryLane);break;case 19:a=e.stateNode;break;default:throw Error(W(314))}a!==null&&a.delete(t),ip(e,n)}var dp;dp=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ot.current)at=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return at=!1,Vm(e,t,n);at=!!(e.flags&131072)}else at=!1,_e&&t.flags&1048576&&fu(t,jo,t.index);switch(t.lanes=0,t.tag){case 2:var a=t.type;ro(e,t),e=t.pendingProps;var o=un(t,Ke.current);ln(t,n),o=di(null,t,a,e,o,n);var s=ci();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,st(a)?(s=!0,yo(t)):s=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,ai(t),o.updater=Ho,t.stateNode=o,o._reactInternals=t,pl(t,a,e,n),t=xl(null,t,a,!0,s,n)):(t.tag=0,_e&&s&&Kl(t),Xe(null,t,o,n),t=t.child),t;case 16:a=t.elementType;e:{switch(ro(e,t),e=t.pendingProps,o=a._init,a=o(a._payload),t.type=a,o=t.tag=sx(a),e=Ct(a,e),o){case 0:t=ml(null,t,a,e,n);break e;case 1:t=_d(null,t,a,e,n);break e;case 11:t=kd(null,t,a,e,n);break e;case 14:t=Sd(null,t,a,Ct(a.type,e),n);break e}throw Error(W(306,a,""))}return t;case 0:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:Ct(a,o),ml(e,t,a,o,n);case 1:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:Ct(a,o),_d(e,t,a,o,n);case 3:e:{if(Hu(t),e===null)throw Error(W(387));a=t.pendingProps,s=t.memoizedState,o=s.element,yu(e,t),So(t,a,null,n);var l=t.memoizedState;if(a=l.element,s.isDehydrated)if(s={element:a,isDehydrated:!1,cache:l.cache,pendingSuspenseBoundaries:l.pendingSuspenseBoundaries,transitions:l.transitions},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){o=xn(Error(W(423)),t),t=Nd(e,t,a,n,o);break e}else if(a!==o){o=xn(Error(W(424)),t),t=Nd(e,t,a,n,o);break e}else for(ct=mr(t.stateNode.containerInfo.firstChild),ut=t,_e=!0,Et=null,n=hu(t,null,a,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(pn(),a===o){t=Kt(e,t,n);break e}Xe(e,t,a,n)}t=t.child}return t;case 5:return bu(t),e===null&&dl(t),a=t.type,o=t.pendingProps,s=e!==null?e.memoizedProps:null,l=o.children,al(a,o)?l=null:s!==null&&al(a,s)&&(t.flags|=32),Vu(e,t),Xe(e,t,l,n),t.child;case 6:return e===null&&dl(t),null;case 13:return Qu(e,t,n);case 4:return oi(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=fn(t,null,a,n):Xe(e,t,a,n),t.child;case 11:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:Ct(a,o),kd(e,t,a,o,n);case 7:return Xe(e,t,t.pendingProps,n),t.child;case 8:return Xe(e,t,t.pendingProps.children,n),t.child;case 12:return Xe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(a=t.type._context,o=t.pendingProps,s=t.memoizedProps,l=o.value,be(wo,a._currentValue),a._currentValue=l,s!==null)if(Tt(s.value,l)){if(s.children===o.children&&!ot.current){t=Kt(e,t,n);break e}}else for(s=t.child,s!==null&&(s.return=t);s!==null;){var i=s.dependencies;if(i!==null){l=s.child;for(var d=i.firstContext;d!==null;){if(d.context===a){if(s.tag===1){d=Qt(-1,n&-n),d.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var v=u.pending;v===null?d.next=d:(d.next=v.next,v.next=d),u.pending=d}}s.lanes|=n,d=s.alternate,d!==null&&(d.lanes|=n),cl(s.return,n,t),i.lanes|=n;break}d=d.next}}else if(s.tag===10)l=s.type===t.type?null:s.child;else if(s.tag===18){if(l=s.return,l===null)throw Error(W(341));l.lanes|=n,i=l.alternate,i!==null&&(i.lanes|=n),cl(l,n,t),l=s.sibling}else l=s.child;if(l!==null)l.return=s;else for(l=s;l!==null;){if(l===t){l=null;break}if(s=l.sibling,s!==null){s.return=l.return,l=s;break}l=l.return}s=l}Xe(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,a=t.pendingProps.children,ln(t,n),o=jt(o),a=a(o),t.flags|=1,Xe(e,t,a,n),t.child;case 14:return a=t.type,o=Ct(a,t.pendingProps),o=Ct(a.type,o),Sd(e,t,a,o,n);case 15:return Wu(e,t,t.type,t.pendingProps,n);case 17:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:Ct(a,o),ro(e,t),t.tag=1,st(a)?(e=!0,yo(t)):e=!1,ln(t,n),$u(t,a,o),pl(t,a,o,n),xl(null,t,a,!0,e,n);case 19:return Yu(e,t,n);case 22:return qu(e,t,n)}throw Error(W(156,t.tag))};function cp(e,t){return Bc(e,t)}function ox(e,t,n,a){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function yt(e,t,n,a){return new ox(e,t,n,a)}function bi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function sx(e){if(typeof e=="function")return bi(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Ml)return 11;if(e===$l)return 14}return 2}function vr(e,t){var n=e.alternate;return n===null?(n=yt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function oo(e,t,n,a,o,s){var l=2;if(a=e,typeof e=="function")bi(e)&&(l=1);else if(typeof e=="string")l=5;else e:switch(e){case Vr:return Tr(n.children,o,s,t);case Ol:l=8,o|=8;break;case Rs:return e=yt(12,n,t,o|2),e.elementType=Rs,e.lanes=s,e;case Bs:return e=yt(13,n,t,o),e.elementType=Bs,e.lanes=s,e;case Os:return e=yt(19,n,t,o),e.elementType=Os,e.lanes=s,e;case bc:return Go(n,o,s,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case vc:l=10;break e;case yc:l=9;break e;case Ml:l=11;break e;case $l:l=14;break e;case ar:l=16,a=null;break e}throw Error(W(130,e==null?e:typeof e,""))}return t=yt(l,n,t,o),t.elementType=e,t.type=a,t.lanes=s,t}function Tr(e,t,n,a){return e=yt(7,e,a,t),e.lanes=n,e}function Go(e,t,n,a){return e=yt(22,e,a,t),e.elementType=bc,e.lanes=n,e.stateNode={isHidden:!1},e}function zs(e,t,n){return e=yt(6,e,null,t),e.lanes=n,e}function Es(e,t,n){return t=yt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function lx(e,t,n,a,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ds(0),this.expirationTimes=ds(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ds(0),this.identifierPrefix=a,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function ji(e,t,n,a,o,s,l,i,d){return e=new lx(e,t,n,i,d),t===1?(t=1,s===!0&&(t|=8)):t=0,s=yt(3,null,null,t),e.current=s,s.stateNode=e,s.memoizedState={element:a,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},ai(s),e}function ix(e,t,n){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:qr,key:a==null?null:""+a,children:e,containerInfo:t,implementation:n}}function up(e){if(!e)return br;e=e._reactInternals;e:{if(Ur(e)!==e||e.tag!==1)throw Error(W(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(st(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(W(171))}if(e.tag===1){var n=e.type;if(st(n))return uu(e,n,t)}return t}function pp(e,t,n,a,o,s,l,i,d){return e=ji(n,a,!0,e,o,s,l,i,d),e.context=up(null),n=e.current,a=Ze(),o=hr(n),s=Qt(a,o),s.callback=t??null,xr(n,s,o),e.current.lanes=o,ya(e,o,a),lt(e,a),e}function Jo(e,t,n,a){var o=t.current,s=Ze(),l=hr(o);return n=up(n),t.context===null?t.context=n:t.pendingContext=n,t=Qt(s,l),t.payload={element:e},a=a===void 0?null:a,a!==null&&(t.callback=a),e=xr(o,t,l),e!==null&&(Pt(e,o,l,s),Za(e,o,l)),l}function To(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Rd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function wi(e,t){Rd(e,t),(e=e.alternate)&&Rd(e,t)}function dx(){return null}var fp=typeof reportError=="function"?reportError:function(e){console.error(e)};function ki(e){this._internalRoot=e}Ko.prototype.render=ki.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(W(409));Jo(e,t,null,null)};Ko.prototype.unmount=ki.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Or(function(){Jo(null,e,null,null)}),t[Gt]=null}};function Ko(e){this._internalRoot=e}Ko.prototype.unstable_scheduleHydration=function(e){if(e){var t=qc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<sr.length&&t!==0&&t<sr[n].priority;n++);sr.splice(n,0,e),n===0&&Hc(e)}};function Si(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Xo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Bd(){}function cx(e,t,n,a,o){if(o){if(typeof a=="function"){var s=a;a=function(){var u=To(l);s.call(u)}}var l=pp(t,a,e,0,null,!1,!1,"",Bd);return e._reactRootContainer=l,e[Gt]=l.current,la(e.nodeType===8?e.parentNode:e),Or(),l}for(;o=e.lastChild;)e.removeChild(o);if(typeof a=="function"){var i=a;a=function(){var u=To(d);i.call(u)}}var d=ji(e,0,!1,null,null,!1,!1,"",Bd);return e._reactRootContainer=d,e[Gt]=d.current,la(e.nodeType===8?e.parentNode:e),Or(function(){Jo(t,d,n,a)}),d}function Zo(e,t,n,a,o){var s=n._reactRootContainer;if(s){var l=s;if(typeof o=="function"){var i=o;o=function(){var d=To(l);i.call(d)}}Jo(t,l,e,o)}else l=cx(n,t,e,o,a);return To(l)}Fc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Bn(t.pendingLanes);n!==0&&(Wl(t,n|1),lt(t,Le()),!(pe&6)&&(gn=Le()+500,Sr()))}break;case 13:Or(function(){var a=Jt(e,1);if(a!==null){var o=Ze();Pt(a,e,1,o)}}),wi(e,1)}};ql=function(e){if(e.tag===13){var t=Jt(e,134217728);if(t!==null){var n=Ze();Pt(t,e,134217728,n)}wi(e,134217728)}};Wc=function(e){if(e.tag===13){var t=hr(e),n=Jt(e,t);if(n!==null){var a=Ze();Pt(n,e,t,a)}wi(e,t)}};qc=function(){return he};Vc=function(e,t){var n=he;try{return he=e,t()}finally{he=n}};Ys=function(e,t,n){switch(t){case"input":if(Us(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var a=n[t];if(a!==e&&a.form===e.form){var o=Wo(a);if(!o)throw Error(W(90));wc(a),Us(a,o)}}}break;case"textarea":Sc(e,n);break;case"select":t=n.value,t!=null&&nn(e,!!n.multiple,t,!1)}};Pc=hi;Tc=Or;var ux={usingClientEntryPoint:!1,Events:[ja,Gr,Wo,Ec,Dc,hi]},In={findFiberByHostInstance:zr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},px={bundleType:In.bundleType,version:In.version,rendererPackageName:In.rendererPackageName,rendererConfig:In.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Xt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ac(e),e===null?null:e.stateNode},findFiberByHostInstance:In.findFiberByHostInstance||dx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ha=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ha.isDisabled&&Ha.supportsFiber)try{Mo=Ha.inject(px),Ot=Ha}catch{}}ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ux;ft.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Si(t))throw Error(W(200));return ix(e,t,null,n)};ft.createRoot=function(e,t){if(!Si(e))throw Error(W(299));var n=!1,a="",o=fp;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=ji(e,1,!1,null,null,n,!1,a,o),e[Gt]=t.current,la(e.nodeType===8?e.parentNode:e),new ki(t)};ft.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(W(188)):(e=Object.keys(e).join(","),Error(W(268,e)));return e=Ac(t),e=e===null?null:e.stateNode,e};ft.flushSync=function(e){return Or(e)};ft.hydrate=function(e,t,n){if(!Xo(t))throw Error(W(200));return Zo(null,e,t,!0,n)};ft.hydrateRoot=function(e,t,n){if(!Si(e))throw Error(W(405));var a=n!=null&&n.hydratedSources||null,o=!1,s="",l=fp;if(n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(l=n.onRecoverableError)),t=pp(t,null,e,1,n??null,o,!1,s,l),e[Gt]=t.current,la(e),a)for(e=0;e<a.length;e++)n=a[e],o=n._getVersion,o=o(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,o]:t.mutableSourceEagerHydrationData.push(n,o);return new Ko(t)};ft.render=function(e,t,n){if(!Xo(t))throw Error(W(200));return Zo(null,e,t,!1,n)};ft.unmountComponentAtNode=function(e){if(!Xo(e))throw Error(W(40));return e._reactRootContainer?(Or(function(){Zo(null,null,e,!1,function(){e._reactRootContainer=null,e[Gt]=null})}),!0):!1};ft.unstable_batchedUpdates=hi;ft.unstable_renderSubtreeIntoContainer=function(e,t,n,a){if(!Xo(n))throw Error(W(200));if(e==null||e._reactInternals===void 0)throw Error(W(38));return Zo(e,t,n,!1,a)};ft.version="18.3.1-next-f1338f8080-20240426";function mp(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(mp)}catch(e){console.error(e)}}mp(),mc.exports=ft;var fx=mc.exports,Od=fx;Is.createRoot=Od.createRoot,Is.hydrateRoot=Od.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ga(){return ga=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},ga.apply(this,arguments)}var cr;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(cr||(cr={}));const Md="popstate";function mx(e){e===void 0&&(e={});function t(a,o){let{pathname:s,search:l,hash:i}=a.location;return Cl("",{pathname:s,search:l,hash:i},o.state&&o.state.usr||null,o.state&&o.state.key||"default")}function n(a,o){return typeof o=="string"?o:xp(o)}return gx(t,n,null,e)}function Re(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function _i(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function xx(){return Math.random().toString(36).substr(2,8)}function $d(e,t){return{usr:e.state,key:e.key,idx:t}}function Cl(e,t,n,a){return n===void 0&&(n=null),ga({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?jn(t):t,{state:n,key:t&&t.key||a||xx()})}function xp(e){let{pathname:t="/",search:n="",hash:a=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),a&&a!=="#"&&(t+=a.charAt(0)==="#"?a:"#"+a),t}function jn(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let a=e.indexOf("?");a>=0&&(t.search=e.substr(a),e=e.substr(0,a)),e&&(t.pathname=e)}return t}function gx(e,t,n,a){a===void 0&&(a={});let{window:o=document.defaultView,v5Compat:s=!1}=a,l=o.history,i=cr.Pop,d=null,u=v();u==null&&(u=0,l.replaceState(ga({},l.state,{idx:u}),""));function v(){return(l.state||{idx:null}).idx}function m(){i=cr.Pop;let z=v(),x=z==null?null:z-u;u=z,d&&d({action:i,location:S.location,delta:x})}function b(z,x){i=cr.Push;let f=Cl(S.location,z,x);u=v()+1;let c=$d(f,u),k=S.createHref(f);try{l.pushState(c,"",k)}catch(I){if(I instanceof DOMException&&I.name==="DataCloneError")throw I;o.location.assign(k)}s&&d&&d({action:i,location:S.location,delta:1})}function w(z,x){i=cr.Replace;let f=Cl(S.location,z,x);u=v();let c=$d(f,u),k=S.createHref(f);l.replaceState(c,"",k),s&&d&&d({action:i,location:S.location,delta:0})}function _(z){let x=o.location.origin!=="null"?o.location.origin:o.location.href,f=typeof z=="string"?z:xp(z);return f=f.replace(/ $/,"%20"),Re(x,"No window.location.(origin|href) available to create URL for href: "+f),new URL(f,x)}let S={get action(){return i},get location(){return e(o,l)},listen(z){if(d)throw new Error("A history only accepts one active listener");return o.addEventListener(Md,m),d=z,()=>{o.removeEventListener(Md,m),d=null}},createHref(z){return t(o,z)},createURL:_,encodeLocation(z){let x=_(z);return{pathname:x.pathname,search:x.search,hash:x.hash}},push:b,replace:w,go(z){return l.go(z)}};return S}var Ud;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(Ud||(Ud={}));function hx(e,t,n){return n===void 0&&(n="/"),vx(e,t,n)}function vx(e,t,n,a){let o=typeof t=="string"?jn(t):t,s=vp(o.pathname||"/",n);if(s==null)return null;let l=gp(e);yx(l);let i=null;for(let d=0;i==null&&d<l.length;++d){let u=Px(s);i=zx(l[d],u)}return i}function gp(e,t,n,a){t===void 0&&(t=[]),n===void 0&&(n=[]),a===void 0&&(a="");let o=(s,l,i)=>{let d={relativePath:i===void 0?s.path||"":i,caseSensitive:s.caseSensitive===!0,childrenIndex:l,route:s};d.relativePath.startsWith("/")&&(Re(d.relativePath.startsWith(a),'Absolute route path "'+d.relativePath+'" nested under path '+('"'+a+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),d.relativePath=d.relativePath.slice(a.length));let u=Lr([a,d.relativePath]),v=n.concat(d);s.children&&s.children.length>0&&(Re(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+u+'".')),gp(s.children,t,v,u)),!(s.path==null&&!s.index)&&t.push({path:u,score:Nx(u,s.index),routesMeta:v})};return e.forEach((s,l)=>{var i;if(s.path===""||!((i=s.path)!=null&&i.includes("?")))o(s,l);else for(let d of hp(s.path))o(s,l,d)}),t}function hp(e){let t=e.split("/");if(t.length===0)return[];let[n,...a]=t,o=n.endsWith("?"),s=n.replace(/\?$/,"");if(a.length===0)return o?[s,""]:[s];let l=hp(a.join("/")),i=[];return i.push(...l.map(d=>d===""?s:[s,d].join("/"))),o&&i.push(...l),i.map(d=>e.startsWith("/")&&d===""?"/":d)}function yx(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Cx(t.routesMeta.map(a=>a.childrenIndex),n.routesMeta.map(a=>a.childrenIndex)))}const bx=/^:[\w-]+$/,jx=3,wx=2,kx=1,Sx=10,_x=-2,Fd=e=>e==="*";function Nx(e,t){let n=e.split("/"),a=n.length;return n.some(Fd)&&(a+=_x),t&&(a+=wx),n.filter(o=>!Fd(o)).reduce((o,s)=>o+(bx.test(s)?jx:s===""?kx:Sx),a)}function Cx(e,t){return e.length===t.length&&e.slice(0,-1).every((a,o)=>a===t[o])?e[e.length-1]-t[t.length-1]:0}function zx(e,t,n){let{routesMeta:a}=e,o={},s="/",l=[];for(let i=0;i<a.length;++i){let d=a[i],u=i===a.length-1,v=s==="/"?t:t.slice(s.length)||"/",m=Ex({path:d.relativePath,caseSensitive:d.caseSensitive,end:u},v),b=d.route;if(!m)return null;Object.assign(o,m.params),l.push({params:o,pathname:Lr([s,m.pathname]),pathnameBase:Rx(Lr([s,m.pathnameBase])),route:b}),m.pathnameBase!=="/"&&(s=Lr([s,m.pathnameBase]))}return l}function Ex(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,a]=Dx(e.path,e.caseSensitive,e.end),o=t.match(n);if(!o)return null;let s=o[0],l=s.replace(/(.)\/+$/,"$1"),i=o.slice(1);return{params:a.reduce((u,v,m)=>{let{paramName:b,isOptional:w}=v;if(b==="*"){let S=i[m]||"";l=s.slice(0,s.length-S.length).replace(/(.)\/+$/,"$1")}const _=i[m];return w&&!_?u[b]=void 0:u[b]=(_||"").replace(/%2F/g,"/"),u},{}),pathname:s,pathnameBase:l,pattern:e}}function Dx(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),_i(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let a=[],o="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(l,i,d)=>(a.push({paramName:i,isOptional:d!=null}),d?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(a.push({paramName:"*"}),o+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?o+="\\/*$":e!==""&&e!=="/"&&(o+="(?:(?=\\/|$))"),[new RegExp(o,t?void 0:"i"),a]}function Px(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return _i(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function vp(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,a=e.charAt(n);return a&&a!=="/"?null:e.slice(n)||"/"}const Tx=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Lx=e=>Tx.test(e);function Ix(e,t){t===void 0&&(t="/");let{pathname:n,search:a="",hash:o=""}=typeof e=="string"?jn(e):e,s;if(n)if(Lx(n))s=n;else{if(n.includes("//")){let l=n;n=n.replace(/\/\/+/g,"/"),_i(!1,"Pathnames cannot have embedded double slashes - normalizing "+(l+" -> "+n))}n.startsWith("/")?s=Wd(n.substring(1),"/"):s=Wd(n,t)}else s=t;return{pathname:s,search:Bx(a),hash:Ox(o)}}function Wd(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(o=>{o===".."?n.length>1&&n.pop():o!=="."&&n.push(o)}),n.length>1?n.join("/"):"/"}function Ds(e,t,n,a){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(a)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function Ax(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function yp(e,t){let n=Ax(e);return t?n.map((a,o)=>o===n.length-1?a.pathname:a.pathnameBase):n.map(a=>a.pathnameBase)}function bp(e,t,n,a){a===void 0&&(a=!1);let o;typeof e=="string"?o=jn(e):(o=ga({},e),Re(!o.pathname||!o.pathname.includes("?"),Ds("?","pathname","search",o)),Re(!o.pathname||!o.pathname.includes("#"),Ds("#","pathname","hash",o)),Re(!o.search||!o.search.includes("#"),Ds("#","search","hash",o)));let s=e===""||o.pathname==="",l=s?"/":o.pathname,i;if(l==null)i=n;else{let m=t.length-1;if(!a&&l.startsWith("..")){let b=l.split("/");for(;b[0]==="..";)b.shift(),m-=1;o.pathname=b.join("/")}i=m>=0?t[m]:"/"}let d=Ix(o,i),u=l&&l!=="/"&&l.endsWith("/"),v=(s||l===".")&&n.endsWith("/");return!d.pathname.endsWith("/")&&(u||v)&&(d.pathname+="/"),d}const Lr=e=>e.join("/").replace(/\/\/+/g,"/"),Rx=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Bx=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Ox=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Mx(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const jp=["post","put","patch","delete"];new Set(jp);const $x=["get",...jp];new Set($x);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ha(){return ha=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},ha.apply(this,arguments)}const Ni=p.createContext(null),Ux=p.createContext(null),ka=p.createContext(null),es=p.createContext(null),Fr=p.createContext({outlet:null,matches:[],isDataRoute:!1}),wp=p.createContext(null);function Sa(){return p.useContext(es)!=null}function Ci(){return Sa()||Re(!1),p.useContext(es).location}function kp(e){p.useContext(ka).static||p.useLayoutEffect(e)}function zi(){let{isDataRoute:e}=p.useContext(Fr);return e?eg():Fx()}function Fx(){Sa()||Re(!1);let e=p.useContext(Ni),{basename:t,future:n,navigator:a}=p.useContext(ka),{matches:o}=p.useContext(Fr),{pathname:s}=Ci(),l=JSON.stringify(yp(o,n.v7_relativeSplatPath)),i=p.useRef(!1);return kp(()=>{i.current=!0}),p.useCallback(function(u,v){if(v===void 0&&(v={}),!i.current)return;if(typeof u=="number"){a.go(u);return}let m=bp(u,JSON.parse(l),s,v.relative==="path");e==null&&t!=="/"&&(m.pathname=m.pathname==="/"?t:Lr([t,m.pathname])),(v.replace?a.replace:a.push)(m,v.state,v)},[t,a,l,s,e])}function Wx(e,t){return qx(e,t)}function qx(e,t,n,a){Sa()||Re(!1);let{navigator:o}=p.useContext(ka),{matches:s}=p.useContext(Fr),l=s[s.length-1],i=l?l.params:{};l&&l.pathname;let d=l?l.pathnameBase:"/";l&&l.route;let u=Ci(),v;if(t){var m;let z=typeof t=="string"?jn(t):t;d==="/"||(m=z.pathname)!=null&&m.startsWith(d)||Re(!1),v=z}else v=u;let b=v.pathname||"/",w=b;if(d!=="/"){let z=d.replace(/^\//,"").split("/");w="/"+b.replace(/^\//,"").split("/").slice(z.length).join("/")}let _=hx(e,{pathname:w}),S=Gx(_&&_.map(z=>Object.assign({},z,{params:Object.assign({},i,z.params),pathname:Lr([d,o.encodeLocation?o.encodeLocation(z.pathname).pathname:z.pathname]),pathnameBase:z.pathnameBase==="/"?d:Lr([d,o.encodeLocation?o.encodeLocation(z.pathnameBase).pathname:z.pathnameBase])})),s,n,a);return t&&S?p.createElement(es.Provider,{value:{location:ha({pathname:"/",search:"",hash:"",state:null,key:"default"},v),navigationType:cr.Pop}},S):S}function Vx(){let e=Zx(),t=Mx(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,o={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return p.createElement(p.Fragment,null,p.createElement("h2",null,"Unexpected Application Error!"),p.createElement("h3",{style:{fontStyle:"italic"}},t),n?p.createElement("pre",{style:o},n):null,null)}const Hx=p.createElement(Vx,null);class Qx extends p.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?p.createElement(Fr.Provider,{value:this.props.routeContext},p.createElement(wp.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Yx(e){let{routeContext:t,match:n,children:a}=e,o=p.useContext(Ni);return o&&o.static&&o.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(o.staticContext._deepestRenderedBoundaryId=n.route.id),p.createElement(Fr.Provider,{value:t},a)}function Gx(e,t,n,a){var o;if(t===void 0&&(t=[]),n===void 0&&(n=null),a===void 0&&(a=null),e==null){var s;if(!n)return null;if(n.errors)e=n.matches;else if((s=a)!=null&&s.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let l=e,i=(o=n)==null?void 0:o.errors;if(i!=null){let v=l.findIndex(m=>m.route.id&&(i==null?void 0:i[m.route.id])!==void 0);v>=0||Re(!1),l=l.slice(0,Math.min(l.length,v+1))}let d=!1,u=-1;if(n&&a&&a.v7_partialHydration)for(let v=0;v<l.length;v++){let m=l[v];if((m.route.HydrateFallback||m.route.hydrateFallbackElement)&&(u=v),m.route.id){let{loaderData:b,errors:w}=n,_=m.route.loader&&b[m.route.id]===void 0&&(!w||w[m.route.id]===void 0);if(m.route.lazy||_){d=!0,u>=0?l=l.slice(0,u+1):l=[l[0]];break}}}return l.reduceRight((v,m,b)=>{let w,_=!1,S=null,z=null;n&&(w=i&&m.route.id?i[m.route.id]:void 0,S=m.route.errorElement||Hx,d&&(u<0&&b===0?(tg("route-fallback"),_=!0,z=null):u===b&&(_=!0,z=m.route.hydrateFallbackElement||null)));let x=t.concat(l.slice(0,b+1)),f=()=>{let c;return w?c=S:_?c=z:m.route.Component?c=p.createElement(m.route.Component,null):m.route.element?c=m.route.element:c=v,p.createElement(Yx,{match:m,routeContext:{outlet:v,matches:x,isDataRoute:n!=null},children:c})};return n&&(m.route.ErrorBoundary||m.route.errorElement||b===0)?p.createElement(Qx,{location:n.location,revalidation:n.revalidation,component:S,error:w,children:f(),routeContext:{outlet:null,matches:x,isDataRoute:!0}}):f()},null)}var Sp=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(Sp||{}),_p=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(_p||{});function Jx(e){let t=p.useContext(Ni);return t||Re(!1),t}function Kx(e){let t=p.useContext(Ux);return t||Re(!1),t}function Xx(e){let t=p.useContext(Fr);return t||Re(!1),t}function Np(e){let t=Xx(),n=t.matches[t.matches.length-1];return n.route.id||Re(!1),n.route.id}function Zx(){var e;let t=p.useContext(wp),n=Kx(),a=Np();return t!==void 0?t:(e=n.errors)==null?void 0:e[a]}function eg(){let{router:e}=Jx(Sp.UseNavigateStable),t=Np(_p.UseNavigateStable),n=p.useRef(!1);return kp(()=>{n.current=!0}),p.useCallback(function(o,s){s===void 0&&(s={}),n.current&&(typeof o=="number"?e.navigate(o):e.navigate(o,ha({fromRouteId:t},s)))},[e,t])}const qd={};function tg(e,t,n){qd[e]||(qd[e]=!0)}function rg(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function Cp(e){let{to:t,replace:n,state:a,relative:o}=e;Sa()||Re(!1);let{future:s,static:l}=p.useContext(ka),{matches:i}=p.useContext(Fr),{pathname:d}=Ci(),u=zi(),v=bp(t,yp(i,s.v7_relativeSplatPath),d,o==="path"),m=JSON.stringify(v);return p.useEffect(()=>u(JSON.parse(m),{replace:n,state:a,relative:o}),[u,m,o,n,a]),null}function so(e){Re(!1)}function ng(e){let{basename:t="/",children:n=null,location:a,navigationType:o=cr.Pop,navigator:s,static:l=!1,future:i}=e;Sa()&&Re(!1);let d=t.replace(/^\/*/,"/"),u=p.useMemo(()=>({basename:d,navigator:s,static:l,future:ha({v7_relativeSplatPath:!1},i)}),[d,i,s,l]);typeof a=="string"&&(a=jn(a));let{pathname:v="/",search:m="",hash:b="",state:w=null,key:_="default"}=a,S=p.useMemo(()=>{let z=vp(v,d);return z==null?null:{location:{pathname:z,search:m,hash:b,state:w,key:_},navigationType:o}},[d,v,m,b,w,_,o]);return S==null?null:p.createElement(ka.Provider,{value:u},p.createElement(es.Provider,{children:n,value:S}))}function ag(e){let{children:t,location:n}=e;return Wx(zl(t),n)}new Promise(()=>{});function zl(e,t){t===void 0&&(t=[]);let n=[];return p.Children.forEach(e,(a,o)=>{if(!p.isValidElement(a))return;let s=[...t,o];if(a.type===p.Fragment){n.push.apply(n,zl(a.props.children,s));return}a.type!==so&&Re(!1),!a.props.index||!a.props.children||Re(!1);let l={id:a.props.id||s.join("-"),caseSensitive:a.props.caseSensitive,element:a.props.element,Component:a.props.Component,index:a.props.index,path:a.props.path,loader:a.props.loader,action:a.props.action,errorElement:a.props.errorElement,ErrorBoundary:a.props.ErrorBoundary,hasErrorBoundary:a.props.ErrorBoundary!=null||a.props.errorElement!=null,shouldRevalidate:a.props.shouldRevalidate,handle:a.props.handle,lazy:a.props.lazy};a.props.children&&(l.children=zl(a.props.children,s)),n.push(l)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const og="6";try{window.__reactRouterVersion=og}catch{}const sg="startTransition",Vd=tf[sg];function lg(e){let{basename:t,children:n,future:a,window:o}=e,s=p.useRef();s.current==null&&(s.current=mx({window:o,v5Compat:!0}));let l=s.current,[i,d]=p.useState({action:l.action,location:l.location}),{v7_startTransition:u}=a||{},v=p.useCallback(m=>{u&&Vd?Vd(()=>d(m)):d(m)},[d,u]);return p.useLayoutEffect(()=>l.listen(v),[l,v]),p.useEffect(()=>rg(a),[a]),p.createElement(ng,{basename:t,children:n,location:i.location,navigationType:i.action,navigator:l,future:a})}var Hd;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(Hd||(Hd={}));var Qd;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(Qd||(Qd={}));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ig=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),zp=(...e)=>e.filter((t,n,a)=>!!t&&a.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var dg={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cg=p.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:o="",children:s,iconNode:l,...i},d)=>p.createElement("svg",{ref:d,...dg,width:t,height:t,stroke:e,strokeWidth:a?Number(n)*24/Number(t):n,className:zp("lucide",o),...i},[...l.map(([u,v])=>p.createElement(u,v)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=(e,t)=>{const n=p.forwardRef(({className:a,...o},s)=>p.createElement(cg,{ref:s,iconNode:t,className:zp(`lucide-${ig(e)}`,a),...o}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ug=ae("ArrowUpDown",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ep=ae("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lo=ae("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dp=ae("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=ae("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pg=ae("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fg=ae("ChevronsLeft",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mg=ae("ChevronsRight",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Io=ae("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qa=ae("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const El=ae("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xg=ae("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gg=ae("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pp=ae("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tp=ae("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hg=ae("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mn=ae("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $n=ae("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ao=ae("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ei=ae("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vg=ae("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yg=ae("GripVertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bg=ae("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jg=ae("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wg=ae("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kg=ae("ListTodo",[["rect",{x:"3",y:"5",width:"6",height:"6",rx:"1",key:"1defrl"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Un=ae("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rn=ae("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sg=ae("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _g=ae("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lp=ae("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ng=ae("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cg=ae("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zg=ae("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eg=ae("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dg=ae("Pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ht=ae("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ps=ae("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pg=ae("ScrollText",[["path",{d:"M15 12h-5",key:"r7krc0"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mr=ae("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dl=ae("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tg=ae("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lg=ae("SlidersVertical",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ig=ae("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ag=ae("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ip=ae("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rg=ae("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bg=ae("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ts=ae("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ap=ae("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hn=ae("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function Og({onLogout:e,onToggleSidebar:t,sidenavCollapsed:n}){var T,j;const[a,o]=p.useState(()=>new Date().toLocaleTimeString("en-IN")),[s,l]=p.useState([]),[i,d]=p.useState(""),[u,v]=p.useState(""),[m,b]=p.useState(!1),w=p.useRef(null),_=JSON.parse(localStorage.getItem("user")||"{}"),S=localStorage.getItem("token"),[z,x]=p.useState(()=>{const N=localStorage.getItem("erp_theme");return N?N==="dark":!0}),[f,c]=p.useState(()=>localStorage.getItem("erp_company_name")||"Vyom Process Flow"),[k,I]=p.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing");p.useEffect(()=>{const N=localStorage.getItem("erp_theme"),B=N?N==="dark":!0;document.documentElement.setAttribute("data-theme",B?"dark":"light"),x(B)},[]);const D=()=>{const N=!z;x(N),localStorage.setItem("erp_theme",N?"dark":"light"),document.documentElement.setAttribute("data-theme",N?"dark":"light")};p.useEffect(()=>{const N=setInterval(()=>{o(new Date().toLocaleTimeString("en-IN"))},1e3);C();const B=R=>{R.detail&&R.detail.orderId!==void 0?d(R.detail.orderId||""):R.detail&&R.detail.orderId===null&&d("")};window.addEventListener("setView",B);const A=()=>{C()};window.addEventListener("orderUpdated",A);const V=R=>{w.current&&!w.current.contains(R.target)&&b(!1)};document.addEventListener("mousedown",V);const U=()=>{c(localStorage.getItem("erp_company_name")||"Vyom Process Flow"),I(localStorage.getItem("erp_system_title")||"Control Panel Manufacturing")};return window.addEventListener("erpSettingsUpdated",U),()=>{clearInterval(N),window.removeEventListener("setView",B),window.removeEventListener("orderUpdated",A),document.removeEventListener("mousedown",V),window.removeEventListener("erpSettingsUpdated",U)}},[]),p.useEffect(()=>{if(i&&s.length>0){const N=s.find(B=>B.id==i);N&&v(N.order_number)}else i||v("")},[i,s]);const C=async()=>{if(S)try{const N=await fetch(window.API_BASE+"/api/orders",{headers:{Authorization:`Bearer ${S}`}});if(N.ok){const B=await N.json();l(B)}}catch(N){console.error("Header fetch error:",N)}},L=(N,B)=>{d(N),v(B||""),b(!1),N?window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:parseInt(N)}})):window.dispatchEvent(new CustomEvent("setView",{detail:{view:"board",orderId:null}}))},P=i&&u.trim()===(((T=s.find(N=>N.id==i))==null?void 0:T.order_number)||""),h=s.filter(N=>{const B=P?"":u.trim().toLowerCase();if(!B)return!0;const A=B.split(/\s+/),V=(N.order_number||"").toLowerCase(),U=(N.company_name||"").toLowerCase(),R=(N.po_number||"").toLowerCase();return A.every(J=>V.includes(J)||U.includes(J)||R.includes(J))});return r.jsxs("div",{className:"header",children:[r.jsxs("div",{className:"header-left",children:[r.jsx("button",{className:"sidebar-toggle-btn",onClick:t,title:n?"Expand Sidebar":"Collapse Sidebar","aria-label":n?"Expand Sidebar":"Collapse Sidebar",children:r.jsx(Cg,{size:16})}),r.jsx("div",{className:"logo",children:f}),r.jsx("div",{className:"header-title",children:k})]}),r.jsxs("div",{className:"header-right",children:[r.jsxs("div",{className:"user-info",children:[r.jsx(ts,{size:14,className:"user-icon"}),r.jsx("span",{className:"user-name",children:_.username||"User"}),r.jsx("span",{className:`role-badge role-${(j=_.role)==null?void 0:j.toLowerCase()}`,children:_.role||"Viewer"})]}),r.jsxs("div",{className:"order-selector",ref:w,children:[r.jsx(Mr,{size:14,className:"search-icon"}),r.jsx("input",{type:"text",className:"order-search-input",placeholder:"Search Order...",value:u,onFocus:()=>b(!0),onChange:N=>{v(N.target.value),b(!0)}}),i&&r.jsx("button",{className:"clear-search",onClick:N=>{N.stopPropagation(),L("","")},title:"Clear Selection",children:"×"}),m&&r.jsxs("div",{className:"search-dropdown-menu",children:[r.jsx("div",{className:`search-dropdown-item ${i?"":"active"}`,onClick:()=>L("",""),children:"View All Orders (Board)"}),h.length>0?h.map(N=>r.jsxs("div",{className:`search-dropdown-item ${i==N.id?"active":""}`,onClick:()=>L(N.id,N.order_number),children:[r.jsx("div",{style:{fontWeight:600},children:N.order_number}),N.company_name&&r.jsx("div",{style:{fontSize:"10px",color:"#888"},children:N.company_name})]},N.id)):r.jsx("div",{className:"search-dropdown-item empty",children:"No orders found"})]})]}),r.jsx("div",{className:"clock-wrapper",children:a}),r.jsxs("button",{onClick:D,title:z?"Switch to Light Mode":"Switch to Dark Mode",className:"theme-toggle-btn",children:[z?r.jsx(Ag,{size:13}):r.jsx(Eg,{size:13}),r.jsx("span",{className:"theme-toggle-text",children:z?"Light":"Dark"})]}),r.jsxs("button",{onClick:e,className:"logout-btn",children:[r.jsx(_g,{size:14,className:"logout-icon"}),r.jsx("span",{className:"logout-text",children:"Logout"})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .sidebar-toggle-btn {
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          transition: all 0.2s;
          margin-right: 4px;
        }
        .sidebar-toggle-btn:hover {
          background: var(--bg4);
          color: var(--accent);
          border-color: var(--accent);
        }
        .order-selector {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 16px;
        }
        .order-search-input {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 30px;
          color: var(--text);
          padding: 8px 30px 8px 36px;
          font-size: 12px;
          width: 260px;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }
        .order-search-input:hover {
          border-color: var(--border2);
        }
        .order-search-input:focus {
          border-color: var(--accent);
          background: var(--bg2);
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12), 0 4px 12px rgba(245, 158, 11, 0.04);
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
          top: calc(100% + 6px);
          left: 0;
          width: 100%;
          max-height: 300px;
          overflow-y: auto;
          background: var(--bg2);
          border: 1px solid var(--border2);
          border-radius: 12px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.18);
          z-index: 1000;
          padding: 6px;
        }
        .search-dropdown-item {
          padding: 10px 14px;
          cursor: pointer;
          font-size: 12px;
          color: var(--text2);
          border-radius: 8px;
          margin-bottom: 2px;
          transition: background 0.15s, color 0.15s;
        }
        .search-dropdown-item:last-child { margin-bottom: 0; }
        .search-dropdown-item:hover { background: var(--bg3); color: var(--text); }
        .search-dropdown-item.active { background: var(--blue-dim); color: var(--blue); }
        .search-dropdown-item.empty { color: var(--text3); text-align: center; font-style: italic; cursor: default; }
        .search-dropdown-item.empty:hover { background: transparent; }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: 16px;
          color: var(--text2);
          font-size: 12px;
        }
        .clock-wrapper {
          margin-right: 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text3);
        }
        .theme-toggle-btn {
          background: var(--bg4);
          border: 1px solid var(--border2);
          border-radius: 6px;
          color: var(--text2);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 5px 10px;
          margin-right: 8px;
          transition: all 0.2s;
          gap: 5px;
          font-size: 12px;
        }
        .theme-toggle-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Responsive styling for small laptops / tablets */
        @media (max-width: 1200px) {
          .header-title {
            display: none;
          }
        }
        @media (max-width: 1024px) {
          .order-search-input {
            width: 180px;
          }
        }
        @media (max-width: 900px) {
          .user-name {
            display: none;
          }
          .clock-wrapper {
            display: none;
          }
          .order-search-input {
            width: 140px;
          }
        }
        @media (max-width: 768px) {
          .role-badge {
            display: none;
          }
          .theme-toggle-text, .logout-text {
            display: none;
          }
          .theme-toggle-btn, .logout-btn {
            padding: 6px;
            margin-right: 4px;
          }
          .user-info {
            margin-right: 8px;
          }
          .order-selector {
            margin-right: 8px;
          }
        }
      `}})]})}const jr=[{id:"Sales",color:"var(--teal)",label:"Sales",sub:"Customer interface"},{id:"Design",color:"var(--purple)",label:"Design",sub:"Engineering"},{id:"Purchase",color:"var(--orange)",label:"Purchase",sub:"Procurement"},{id:"Stores",color:"var(--green)",label:"Stores",sub:"Stock & Issue"},{id:"Production",color:"var(--red)",label:"Production",sub:"Manufacturing"},{id:"QC",color:"var(--blue)",label:"QC",sub:"Quality Control"},{id:"Dispatch",color:"var(--text2)",label:"Dispatch",sub:"Logistics"},{id:"Accounts",color:"var(--text2)",label:"Accounts",sub:"Billing"}];Fn(new Date),Fn(new Date),Fn(new Date),Fn(new Date);function Fn(e){return e.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}const Je={pending:{cls:"badge-pending",label:"PENDING"},inprogress:{cls:"badge-inprogress",label:"IN PROGRESS"},done:{cls:"badge-done",label:"DONE"},blocked:{cls:"badge-blocked",label:"BLOCKED"},review:{cls:"badge-review",label:"REVIEW"}},Mg=[{id:"board",icon:wg,label:"Board",roles:null},{id:"planning",icon:Ep,label:"Planning",roles:["Admin","Manager","Planning"]},{id:"orders",icon:gg,label:"Orders",roles:null},{id:"documents",icon:Ao,label:"Documents",roles:null},{id:"new-order",icon:xg,label:"New Order",roles:["Admin","Manager","Sales"]},{id:"masters",icon:Tp,label:"Masters",roles:["Admin","Manager","Sales"]},{id:"import",icon:Rg,label:"Import",roles:["Admin","Manager","Sales"]},{id:"worklist",icon:kg,label:"My Worklist",roles:["Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Sales"]}],$g=[{id:"users",icon:Ap,label:"User Directory"},{id:"logs",icon:Pg,label:"System Logs"},{id:"settings",icon:Dl,label:"System Settings"}];function Yd({item:e,isActive:t,onClick:n}){const a=e.icon;return r.jsxs("button",{className:`dept-btn${t?" active":""}`,onClick:n,title:e.label,children:[r.jsx(a,{size:16,className:"nav-icon"}),r.jsx("span",{className:"nav-label",children:e.label})]})}function Ug({steps:e,currentFilter:t,onFilterDept:n,currentView:a,onSetView:o,userRole:s,collapsed:l=!1}){return r.jsx("aside",{className:`sidenav${l?" sidenav--collapsed":""}`,children:r.jsxs("div",{className:"sidenav-inner",children:[r.jsxs("div",{className:"sidenav-group",children:[r.jsx("p",{className:"sidenav-label",children:"Workspace"}),Mg.map(i=>i.roles&&!i.roles.includes(s)?null:r.jsx(Yd,{item:i,isActive:a===i.id,onClick:()=>o(i.id)},i.id))]}),r.jsxs("div",{className:"sidenav-group",children:[r.jsx("p",{className:"sidenav-label",children:"Departments"}),r.jsxs("button",{className:`dept-btn${t==="all"?" active":""}`,onClick:()=>n("all"),title:"All Departments",children:[r.jsx("span",{className:"dept-dot",style:{background:"var(--accent)"}}),r.jsx("span",{className:"nav-label",children:"All Departments"})]}),jr.map(i=>{const d=e.filter(v=>v.dept===i.id&&v.status==="done").length,u=e.filter(v=>v.dept===i.id).length;return r.jsxs("button",{className:`dept-btn${t===i.id?" active":""}`,onClick:()=>{n(i.id),o("flow")},title:i.label,children:[r.jsx("span",{className:"dept-dot",style:{background:i.color}}),r.jsx("span",{className:"nav-label",children:i.label}),r.jsx("span",{className:"dept-count nav-count",children:u>0?`${d}/${u}`:"—"})]},i.id)})]}),s==="Admin"&&r.jsxs("div",{className:"sidenav-group sidenav-group--admin",children:[r.jsx("p",{className:"sidenav-label",children:"Admin"}),$g.map(i=>r.jsx(Yd,{item:i,isActive:a===i.id,onClick:()=>o(i.id)},i.id))]})]})})}function Fg({deliveryDate:e}){if(!e)return r.jsx("span",{style:{color:"var(--text3)"},children:"—"});const t=Math.ceil((new Date(e)-new Date)/864e5),n=t<0||t<7?"var(--red)":t<14?"var(--accent)":"var(--green)",a=t<0?`${Math.abs(t)}d overdue`:t===0?"today":`${t}d left`;return r.jsx("span",{style:{color:n,fontFamily:"var(--font-mono)",fontSize:14,fontWeight:700},children:a})}function Wg({steps:e,currentFilter:t,selectedOrder:n}){const a=t==="all"?e:e.filter(v=>v.dept===t),o=a.filter(v=>v.status==="inprogress").length,s=a.filter(v=>v.status==="blocked").length,l=a.filter(v=>v.status==="done").length,i=a.length;let d="PENDING",u="var(--accent)";return i===0?(d="NO TASKS",u="var(--text3)"):l===i?(d="COMPLETE",u="var(--green)"):s>0?(d="BLOCKED",u="var(--red)"):(l>0||o>0)&&(d="IN PROGRESS",u="var(--blue)"),r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card stat-status",children:[r.jsx("div",{className:"stat-label",children:"Order Status"}),r.jsx("div",{className:"stat-value",style:{color:u,fontSize:13,fontWeight:700,marginTop:4},children:d}),r.jsx("div",{className:"stat-sub",children:(n==null?void 0:n.order_number)||"no order selected"})]}),r.jsxs("div",{className:"stat-card stat-progress",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:o>0?"var(--blue)":"var(--text3)"},children:o}),r.jsx("div",{className:"stat-sub",children:"active steps"})]}),r.jsxs("div",{className:"stat-card stat-blocked",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:s>0?"var(--red)":"var(--text3)"},children:s}),r.jsx("div",{className:"stat-sub",children:s>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card stat-delivery",children:[r.jsx("div",{className:"stat-label",children:"Delivery"}),r.jsx("div",{style:{marginTop:4},children:r.jsx(Fg,{deliveryDate:n==null?void 0:n.delivery_date})}),r.jsx("div",{className:"stat-sub",children:n!=null&&n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"TBD"})]})]})}function qg(){const[e,t]=p.useState(null),n=localStorage.getItem("token");return p.useEffect(()=>{fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${n}`}}).then(a=>a.ok?a.json():[]).then(a=>{const o=new Date,s=new Date(o);s.setDate(o.getDate()+7);let l=0,i=0,d=0,u=0,v=0;a.forEach(m=>{v+=parseInt(m.line_item_count||0);const b=(m.priority||"Medium").toLowerCase();if((b==="urgent"||b==="high")&&d++,m.delivery_date){const w=new Date(m.delivery_date);w>=o&&w<=s&&u++}(m.steps||[]).forEach(w=>{w.status==="blocked"&&l++,w.status==="inprogress"&&i++})}),t({total:a.length,totalLineItems:v,urgentHigh:d,totalBlocked:l,totalIP:i,dueThisWeek:u})}).catch(()=>t(null))},[n]),e?r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card stat-active",children:[r.jsx("div",{className:"stat-label",children:"Active Orders & Items"}),r.jsxs("div",{className:"stat-value",style:{color:"var(--text)"},children:[e.totalLineItems,r.jsxs("span",{style:{fontSize:"13px",color:"var(--text3)",fontWeight:"normal",marginLeft:"6px"},children:["(",e.total," Orders)"]})]}),r.jsx("div",{className:"stat-sub",children:"in pipeline"})]}),r.jsxs("div",{className:"stat-card stat-urgent",children:[r.jsx("div",{className:"stat-label",children:"Urgent / High"}),r.jsx("div",{className:"stat-value",style:{color:e.urgentHigh>0?"var(--accent)":"var(--text3)"},children:e.urgentHigh}),r.jsx("div",{className:"stat-sub",children:"priority orders"})]}),r.jsxs("div",{className:"stat-card stat-progress",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:e.totalIP>0?"var(--blue)":"var(--text3)"},children:e.totalIP}),r.jsx("div",{className:"stat-sub",children:"steps across orders"})]}),r.jsxs("div",{className:"stat-card stat-blocked",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:e.totalBlocked>0?"var(--red)":"var(--text3)"},children:e.totalBlocked}),r.jsx("div",{className:"stat-sub",children:e.totalBlocked>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card stat-due",children:[r.jsx("div",{className:"stat-label",children:"Due This Week"}),r.jsx("div",{className:"stat-value",style:{color:e.dueThisWeek>0?"var(--accent)":"var(--text3)"},children:e.dueThisWeek}),r.jsx("div",{className:"stat-sub",children:"orders"})]})]}):r.jsx("div",{className:"stats-row",children:[...Array(5)].map((a,o)=>r.jsxs("div",{className:"stat-card",style:{opacity:.4},children:[r.jsx("div",{className:"stat-label",children:"Loading…"}),r.jsx("div",{className:"stat-value",children:"—"})]},o))})}function Vg({steps:e,currentFilter:t,selectedOrder:n}){return n?r.jsx(Wg,{steps:e,currentFilter:t,selectedOrder:n}):r.jsx(qg,{})}const Gd=["General","PO","Quotation","BOM","Drawing","QC Report","Dispatch Document","Photo"],Hg=["Sales","Accounts","Admin","Manager"];function Ro({entityType:e,entityId:t,initialDocs:n=[],onUploadSuccess:a,onDocsUpdate:o,readOnly:s=!1,defaultDocType:l="General",userRole:i=null}){const u=!i||Hg.includes(i)?Gd:Gd.filter(T=>T!=="PO"),[v,m]=p.useState(n),[b,w]=p.useState(!1),[_,S]=p.useState(l),[z,x]=p.useState(!0),[f,c]=p.useState(!1),k=localStorage.getItem("token");p.useEffect(()=>{l&&S(l)},[l]),p.useEffect(()=>{t&&(async()=>{try{const j=await fetch(`${window.API_BASE}/api/documents/${e}/${t}`,{headers:{Authorization:`Bearer ${k}`}});if(j.ok){const N=await j.json();m(N)}}catch(j){console.error("Failed to fetch docs",j)}})()},[e,t,k]),p.useEffect(()=>{o&&o(v)},[v,o]);const I=async T=>{if(_==="PO"||_==="Quotation"){if(T.length>1){alert(`${_} can only be a single file.`);return}if(v.some(N=>N.doc_type===_)){alert(`A ${_} already exists. Please delete it first.`);return}}if(v.length+T.length>20){alert("Maximum 20 files allowed per entity.");return}w(!0);const j=new FormData;j.append("entity_type",e),j.append("entity_id",t),j.append("doc_type",_),T.forEach(N=>j.append("files",N));try{const N=await fetch(window.API_BASE+"/api/documents/upload",{method:"POST",headers:{Authorization:`Bearer ${k}`},body:j});if(N.ok){const B=await N.json();m([...v,...B]),a&&a(B)}else{const B=await N.json();alert(B.error||"Upload failed")}}catch(N){console.error("Upload error:",N),alert("Network error during upload")}finally{w(!1)}},D=async T=>{const j=Array.from(T.target.files);j.length!==0&&(await I(j),T.target.value="")},C=T=>{s||(T.preventDefault(),c(!0))},L=()=>{c(!1)},P=async T=>{if(s)return;T.preventDefault(),c(!1);const j=Array.from(T.dataTransfer.files);j.length!==0&&await I(j)},h=async T=>{if(window.confirm("Delete this document?"))try{const j=await fetch(`${window.API_BASE}/api/documents/${T}`,{method:"DELETE",headers:{Authorization:`Bearer ${k}`}});if(j.ok){const N=v.filter(B=>B.id!==T);m(N),a&&a(N)}else{const N=await j.json();alert(N.error||"Failed to delete document")}}catch(j){console.error("Delete error:",j),alert("Network error during deletion")}};return r.jsxs("div",{className:`doc-manager${f?" doc-manager--dragging":""}`,onDragOver:C,onDragLeave:L,onDrop:P,children:[r.jsxs("div",{className:"doc-header",onClick:()=>x(T=>!T),style:{cursor:"pointer",userSelect:"none"},children:[r.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",margin:0},children:[r.jsx("span",{style:{display:"inline-block",fontSize:"10px",transition:"transform 0.2s",transform:z?"rotate(-90deg)":"rotate(0deg)",color:"var(--text3)"},children:"▼"}),"Documents (",v.length,"/20)",v.length>0&&z&&r.jsxs("span",{style:{fontSize:"11px",fontWeight:"400",color:"var(--text3)",background:"var(--bg4)",padding:"1px 7px",borderRadius:"10px",marginLeft:"2px"},children:[v.length," file",v.length!==1?"s":""]})]}),!s&&!z&&r.jsxs("div",{className:"doc-upload-controls",onClick:T=>T.stopPropagation(),children:[r.jsx("select",{value:_,onChange:T=>S(T.target.value),className:"doc-type-select",children:u.map(T=>r.jsx("option",{value:T,children:T},T))}),r.jsxs("label",{className:"upload-btn",children:[b?"Uploading...":"Add Files",r.jsx("input",{type:"file",multiple:!0,hidden:!0,onChange:D,disabled:b||v.length>=20})]})]})]}),!z&&r.jsx("div",{className:"doc-list",children:v.length===0?r.jsx("div",{className:"no-docs",children:f?"Drop files here to upload":"No documents uploaded yet. Drag & drop files here to upload."}):v.map(T=>r.jsxs("div",{className:"doc-item",children:[r.jsxs("div",{className:"doc-info",children:[r.jsx("span",{className:"doc-type-badge",children:T.doc_type}),r.jsx("span",{className:"doc-name",title:T.file_name,children:T.file_name})]}),r.jsxs("div",{className:"doc-meta",children:[r.jsxs("span",{children:[(T.file_size/1024).toFixed(1)," KB"]}),r.jsx("a",{href:`${window.API_BASE}/uploads/${T.file_path.split(/[\/\\]/).pop()}?token=${k}`,target:"_blank",rel:"noopener noreferrer",className:"doc-link",children:"View"}),!s&&r.jsx("button",{onClick:()=>h(T.id),style:{background:"transparent",border:"none",color:"var(--red)",cursor:"pointer",marginLeft:"4px",fontSize:"14px",lineHeight:1},title:"Delete document",children:"✕"})]})]},T.id))}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .doc-manager {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          margin-top: 14px;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .doc-manager--dragging {
          border: 1.5px dashed var(--blue) !important;
          background: var(--blue-dim) !important;
        }
        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .doc-header h4 { color: var(--text); font-weight: 500; font-size: 13px; }
        .doc-header:hover h4 { color: var(--blue); }
        .doc-manager:has(.doc-list) .doc-header { margin-bottom: 10px; }
        .doc-upload-controls { display: flex; gap: 8px; }
        .doc-type-select {
          background: var(--bg4);
          border: 1px solid var(--border);
          color: var(--text2);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
        }
        .upload-btn {
          background: var(--blue);
          color: #fff;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .upload-btn:hover { opacity: 0.85; }
        .doc-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 2px;
          margin-top: 8px;
        }
        .doc-item {
          background: var(--bg4);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .doc-item:hover { border-color: var(--border2); }
        .doc-info { display: flex; align-items: center; gap: 8px; overflow: hidden; flex: 1; min-width: 0; }
        .doc-type-badge {
          font-size: 9px;
          text-transform: uppercase;
          font-weight: 700;
          background: var(--blue-dim);
          color: var(--blue);
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          letter-spacing: 0.4px;
        }
        .doc-name {
          font-size: 12px;
          color: var(--text2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .doc-meta { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--text3); flex-shrink: 0; }
        .doc-link { color: var(--blue); text-decoration: none; font-weight: 500; }
        .doc-link:hover { text-decoration: underline; }
        .no-docs { text-align: center; color: var(--text3); font-size: 12px; padding: 16px 0; border: 1px dashed transparent; }
      `}})]})}function Jd({status:e}){const{cls:t,label:n}=Je[e]||Je.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Qg({steps:e,currentFilter:t,onOpenModal:n,onSetView:a,userRole:o,selectedOrderId:s,selectedOrder:l,onStepsChanged:i,selectedUnitId:d,setSelectedUnitId:u,unitSteps:v,setUnitSteps:m}){const[b,w]=p.useState([]),[_,S]=p.useState(null),z=localStorage.getItem("token"),[x,f]=p.useState(!1),[c,k]=p.useState(null),[I,D]=p.useState([]),[C,L]=p.useState(null),P=JSON.parse(localStorage.getItem("user")||"{}"),h=c?["Admin","Manager"].includes(o)||c.dept===o||c.assigned_user_id===P.id:!1,[T,j]=p.useState("details"),[N,B]=p.useState(0),A=(()=>{if(!c)return[];try{return Array.isArray(c.custom_fields)?c.custom_fields:JSON.parse(c.custom_fields||"[]")}catch{return[]}})();p.useEffect(()=>{fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${z}`}}).then(async O=>{O.ok&&D(await O.json())}).catch(console.error)},[z]);const V=async(O,re)=>{if(!h)return;const Q=v.find(ie=>ie.id===O),ge=Q?Q.order_unit_id:d;if(ge)try{const ie=await fetch(`${window.API_BASE}/api/units/${ge}/steps/${O}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${z}`},body:JSON.stringify(re)});if(ie.ok){const F=await fetch(`${window.API_BASE}/api/units/${ge}/steps`,{headers:{Authorization:`Bearer ${z}`}}).then(Pe=>Pe.json());m(F);const je=F.find(Pe=>Pe.id===O);k(je),i&&i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:s}}))}else{const F=await ie.json().catch(()=>({}));L(F.error||"Failed to update step")}}catch(ie){console.error(ie),L("Network error — could not update step")}},U=O=>{L(null),O.order_unit_id?(k(O),j("details"),B(0),f(!0)):n(O.id)},R=e.filter(O=>!O.order_unit_id),J=[...v,...R],Y=()=>{const O=(l==null?void 0:l.units)||[];return r.jsxs("div",{className:"unit-selector-container",style:{marginBottom:24,display:"flex",alignItems:"center",gap:12},children:[r.jsx("span",{style:{fontSize:13,color:"var(--text3)",fontWeight:"bold",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Track Level:"}),r.jsxs("select",{className:"form-select",value:d,onChange:re=>u(re.target.value),style:{width:"auto",background:"var(--bg3)",fontSize:"13px",padding:"6px 12px",border:"1px solid var(--border2)",color:"var(--text)",borderRadius:"6px",cursor:"pointer"},children:[r.jsx("option",{value:"",children:"Order Milestones"}),O.map(re=>r.jsxs("option",{value:re.id,children:["Unit: ",re.unit_id," (",re.status,")"]},re.id))]})]})};p.useEffect(()=>{fetch(window.API_BASE+"/api/task_masters",{headers:{Authorization:`Bearer ${z}`}}).then(async O=>{if(O.ok){const re=await O.json();w(re)}}).catch(console.error)},[z]);const E=async O=>{if(!(!O||!s))try{(await fetch(`${window.API_BASE}/api/orders/${s}/steps`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${z}`},body:JSON.stringify({taskId:O})})).ok&&(i&&i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:s}})))}catch(re){console.error(re)}},M=(O,re)=>{S(re),O.dataTransfer.effectAllowed="move",setTimeout(()=>{O.target.style.opacity="0.5"},0)},Z=O=>{O.target.style.opacity="1",S(null)},le=(O,re)=>{O.preventDefault(),_&&_.dept!==re?O.dataTransfer.dropEffect="none":O.dataTransfer.dropEffect="move"},xe=async(O,re)=>{if(O.preventDefault(),!_||_.id===re.id||_.dept!==re.dept)return;const Q=e.filter(fe=>fe.dept===re.dept),ge=Q.findIndex(fe=>fe.id===_.id),ie=Q.findIndex(fe=>fe.id===re.id);if(ge===-1||ie===-1)return;const F=[...Q],[je]=F.splice(ge,1);F.splice(ie,0,je);const Pe=F.map(fe=>fe.id);try{(await fetch(`${window.API_BASE}/api/orders/${s}/steps/reorder`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${z}`},body:JSON.stringify({orderedIds:Pe})})).ok&&i&&(i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:s}})))}catch(fe){console.error("Failed to reorder",fe)}},se=[...jr].sort((O,re)=>["Admin","Manager"].includes(o)?0:O.id===o?-1:re.id===o?1:0),ve=t==="all"?se:se.filter(O=>O.id===t);return r.jsxs("div",{style:{display:"flex",flexDirection:"column",width:"100%"},children:[Y(),t==="all"?r.jsxs("div",{className:"lanes",children:[ve.map(O=>{const re=J.filter(F=>F.dept===O.id),Q=re.some(F=>F.status==="blocked"),ge=!d&&(["Admin","Manager"].includes(o)||O.id===o),ie=b.filter(F=>F.dept===O.id&&!re.some(je=>je.task_id===F.id));return r.jsxs("div",{className:`lane${Q?" active-lane":""}`,children:[r.jsxs("div",{className:"lane-label",children:[r.jsx("div",{style:{width:3,height:20,background:O.color,borderRadius:2,marginBottom:6}}),r.jsx("div",{className:"lane-name",children:O.label}),r.jsx("div",{className:"lane-sub",children:O.sub}),O.id==="Sales"&&o==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:12,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),ge&&ie.length>0&&s&&!d&&r.jsx("div",{style:{marginTop:12},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:F=>{E(F.target.value),F.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),ie.map(F=>r.jsx("option",{value:F.id,children:F.name},F.id))]})})]}),r.jsxs("div",{className:"lane-steps",children:[re.map((F,je)=>{const Pe=JSON.parse(localStorage.getItem("user")||"{}"),fe=!!F.order_unit_id,it=["Admin","Manager"].includes(o)||F.dept===o||fe&&F.assigned_user_id===Pe.id,q=!fe&&!d&&it;return r.jsxs("div",{style:{display:"flex",alignItems:"center"},draggable:q,onDragStart:G=>q&&M(G,F),onDragEnd:Z,onDragOver:G=>le(G,O.id),onDrop:G=>q&&xe(G,F),children:[r.jsxs("div",{className:`step status-${F.status}${it?"":" read-only"}${F.dept==="Sales"&&F.status==="pending"?" pulse-sales":""}${(_==null?void 0:_.id)===F.id?" dragging":""}`,onClick:()=>U(F),style:{cursor:q?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${F.status}`}),r.jsxs("div",{className:"step-num",children:[O.id.toUpperCase().slice(0,3),"-",String(je+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[F.name,F.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4,fontSize:10,color:"var(--accent)"},children:"(Upload Required)"})]}),r.jsx("div",{className:"step-sub",children:F.sub}),r.jsx(Jd,{status:F.status}),F.notes&&r.jsx("div",{className:"step-note",children:F.notes})]}),je<re.length-1&&r.jsx("div",{className:"step-arrow",children:"›"})]},fe?`unit-${F.id}`:`order-${F.id}`)}),re.length===0&&r.jsx("div",{style:{padding:12,color:"var(--text3)",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},O.id)}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
            .pulse-sales {
              animation: sales-glow 2s infinite ease-in-out;
              border: 1px solid rgba(20, 184, 166, 0.4) !important;
            }
            @keyframes sales-glow {
              0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
              50% { box-shadow: 0 0 15px 0 rgba(20, 184, 166, 0.4); }
              100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
            }
          `}})]}):r.jsx("div",{className:"flow-card-grid",children:ve.map(O=>{const re=J.filter(F=>F.dept===O.id),Q=re.some(F=>F.status==="blocked"),ge=!d&&(["Admin","Manager"].includes(o)||O.id===o),ie=b.filter(F=>F.dept===O.id&&!re.some(je=>je.task_id===F.id));return r.jsxs("div",{className:`dept-flow-card${Q?" has-blocked":""}`,children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:O.color}}),r.jsxs("div",{children:[r.jsx("div",{className:"dept-card-title",children:O.label}),r.jsx("div",{className:"dept-card-sub",children:O.sub})]})]}),l&&r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:l.order_number}),l.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:l.company_name}),l.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"Delivery:"})," ",new Date(l.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),l&&l.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"var(--accent)",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"var(--text2)"},children:l.notes})]}),O.id==="Sales"&&o==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:8,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),ge&&ie.length>0&&s&&!d&&r.jsx("div",{style:{marginTop:8},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:F=>{E(F.target.value),F.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),ie.map(F=>r.jsx("option",{value:F.id,children:F.name},F.id))]})})]}),r.jsxs("div",{className:"dept-card-tasks-vertical",children:[re.map((F,je)=>{const Pe=JSON.parse(localStorage.getItem("user")||"{}"),fe=!!F.order_unit_id,it=["Admin","Manager"].includes(o)||F.dept===o||fe&&F.assigned_user_id===Pe.id,q=!fe&&!d&&it;return r.jsx("div",{style:{display:"flex",alignItems:"center"},draggable:q,onDragStart:G=>q&&M(G,F),onDragEnd:Z,onDragOver:G=>le(G,O.id),onDrop:G=>q&&xe(G,F),children:r.jsxs("div",{className:`step status-${F.status}${it?"":" read-only"}${F.dept==="Sales"&&F.status==="pending"?" pulse-sales":""}${(_==null?void 0:_.id)===F.id?" dragging":""}`,onClick:()=>U(F),style:{cursor:q?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${F.status}`}),r.jsxs("div",{className:"step-num",children:[O.id.toUpperCase().slice(0,3),"-",String(je+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[F.name,F.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4,fontSize:10,color:"var(--accent)"},children:"(Upload Required)"})]}),r.jsx("div",{className:"step-sub",children:F.sub}),r.jsx(Jd,{status:F.status}),F.notes&&r.jsx("div",{className:"step-note",children:F.notes})]})},fe?`unit-${F.id}`:`order-${F.id}`)}),re.length===0&&r.jsx("div",{style:{padding:12,color:"var(--text3)",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},O.id)})}),x&&c&&r.jsx("div",{className:"modal-overlay open",onClick:O=>{O.target.className==="modal-overlay open"&&f(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:h?"Edit Unit Step":"View Unit Step"}),r.jsxs("div",{className:"modal-sub",children:[c.name," (",c.dept,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>f(!1),children:"✕"})]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid var(--border)",padding:"0 24px",marginBottom:"16px"},children:["details",...A.length>0?["fields"]:[],"documents"].map(O=>r.jsxs("button",{onClick:()=>j(O),style:{background:"transparent",border:"none",borderBottom:T===O?"2px solid var(--blue)":"2px solid transparent",color:T===O?"var(--blue)":"var(--text3)",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:T===O?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[O==="fields"?"Form Fields":O.charAt(0).toUpperCase()+O.slice(1),O==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:A.length})]},O))}),r.jsxs("div",{className:"modal-body",children:[!h&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"12px"},children:[r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:c.dept})," department."]}),C&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"12px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"12px",flexShrink:0,fontWeight:700},children:"Error:"}),r.jsx("span",{style:{flex:1},children:C}),r.jsx("button",{onClick:()=>L(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"14px",padding:"0",lineHeight:1},children:"✕"})]}),T==="details"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Status"}),h?r.jsxs("select",{className:"form-select",value:c.status,onChange:O=>{const re=O.target.value;if(c.requires_upload&&re==="done"&&N===0){alert("You must upload at least one document to complete this task.");return}V(c.id,{status:re})},style:{fontSize:"13px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${(Je[c.status]||Je.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:(Je[c.status]||Je.pending).label})})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Assign Worker"}),h?r.jsxs("select",{className:"form-select",value:c.assigned_user_id||"",onChange:O=>V(c.id,{assigned_user_id:O.target.value?parseInt(O.target.value):null}),style:{fontSize:"13px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),I.filter(O=>O.role===c.dept).map(O=>r.jsx("option",{value:O.id,children:O.username},O.id))]}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:(()=>{const O=I.find(re=>re.id===c.assigned_user_id);return O?O.username:"Unassigned"})()})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Notes"}),h?r.jsx("textarea",{className:"form-input",defaultValue:c.notes||"",onBlur:O=>V(c.id,{notes:O.target.value}),placeholder:"Add step notes...",style:{fontSize:"13px",height:"60px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"10px 12px",borderRadius:"6px",minHeight:"40px",whiteSpace:"pre-wrap"},children:c.notes||"No notes added."})]})]}),T==="fields"&&A.length>0&&r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:A.map((O,re)=>{var ge;const Q=ie=>{const F=[...A];F[re].value=ie,V(c.id,{custom_fields:F})};return r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 16px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:O.label}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"10px",color:"var(--text3)",textTransform:"uppercase",background:"var(--bg4)",padding:"1px 5px",borderRadius:"3px"},children:O.type})]}),h?O.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!O.value,onChange:ie=>Q(ie.target.checked)}):O.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:O.value||"",onChange:ie=>Q(ie.target.value),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(ge=O.options)==null?void 0:ge.map(ie=>r.jsx("option",{value:ie,children:ie},ie))]}):r.jsx("input",{type:O.type==="Number"?"number":"text",className:"form-input",defaultValue:O.value||"",onBlur:ie=>Q(ie.target.value),style:{fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"#ddd",fontWeight:"500",marginTop:"2px"},children:O.type==="Yes/No"?O.value==="Yes"||O.value===!0?"Yes":"No":O.value||"—"})]},O.id)})}),T==="documents"&&r.jsxs("div",{children:[c.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"This task requires at least one document to be marked as Done."}),r.jsx(Ro,{entityType:"UnitStep",entityId:c.id,initialDocs:[],onDocsUpdate:O=>B(O.length),readOnly:!h,defaultDocType:c.default_doc_type||"General",userRole:o})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .flow-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          align-items: start;
          padding-bottom: 40px;
        }
        .dept-flow-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-top: 2px solid var(--border2);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .dept-flow-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
          border-color: var(--border2);
        }
        .dept-flow-card.has-blocked {
          border-color: var(--red);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.12);
          background: linear-gradient(180deg, var(--red-dim) 0%, var(--bg2) 100%);
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
        .dept-card-sub {
          font-size: 11px;
          color: var(--text3);
          margin-top: 2px;
        }
        .dept-card-ord-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg3);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .ord-badge {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-weight: 600;
          font-size: 13px;
          color: var(--text2);
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
          border: 1px solid rgba(167, 139, 250, 0.25);
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
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 8px;
          transition: all 0.2s;
        }
        .dept-card-tasks-vertical .step:hover {
          background: var(--bg4);
          border-color: var(--border2);
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
      `}})]})}function Yg({status:e}){const{cls:t,label:n}=Je[e]||Je.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Gg({currentFilter:e,userRole:t,onSetView:n}){const[a,o]=p.useState([]),[s,l]=p.useState(!0),[i,d]=p.useState("all"),[u,v]=p.useState("incomplete"),[m,b]=p.useState("updated"),[w,_]=p.useState(""),S=localStorage.getItem("token");p.useEffect(()=>{z();const c=()=>{z()};return window.addEventListener("orderUpdated",c),()=>window.removeEventListener("orderUpdated",c)},[]);const z=async()=>{try{const c=await fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${S}`}});c.ok&&o(await c.json())}catch(c){console.error(c)}finally{l(!1)}},x=e==="all"?jr:jr.filter(c=>c.id===e);if(s)return r.jsx("div",{className:"loading",style:{padding:40,textAlign:"center",color:"#888"},children:"Loading board..."});const f=a.filter(c=>{if(i!=="all"&&(c.priority||"Medium").toLowerCase()!==i||u==="incomplete"&&c.status==="completed"||u==="completed"&&c.status!=="completed")return!1;if(w.trim()!==""){const k=w.trim().toLowerCase().split(/\s+/),I=(c.order_number||"").toLowerCase(),D=(c.company_name||"").toLowerCase(),C=(c.po_number||"").toLowerCase();if(!k.every(P=>I.includes(P)||D.includes(P)||C.includes(P)||c.steps&&c.steps.some(h=>(h.name||"").toLowerCase().includes(P)||(h.dept||"").toLowerCase().includes(P))))return!1}return!0}).sort((c,k)=>{if(m==="updated"){const I=new Date(c.updated_at||0);return new Date(k.updated_at||0)-I}return 0});return r.jsxs("div",{className:"board-view-orders",children:[r.jsxs("div",{className:"board-filters",children:[r.jsxs("div",{className:"filter-group",children:[r.jsx(Ei,{size:14,className:"filter-icon"}),r.jsx("span",{className:"filter-label",children:"Sort:"}),r.jsxs("select",{value:m,onChange:c=>b(c.target.value),className:"board-select",children:[r.jsx("option",{value:"updated",children:"Recently Updated"}),r.jsx("option",{value:"created",children:"Recently Created"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Status:"}),r.jsxs("select",{value:u,onChange:c=>v(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Orders"}),r.jsx("option",{value:"incomplete",children:"Incomplete Only"}),r.jsx("option",{value:"completed",children:"Completed Only"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Priority:"}),r.jsxs("select",{value:i,onChange:c=>d(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"low",children:"Low"})]})]}),r.jsxs("div",{className:"board-search-container",children:[r.jsx(Mr,{size:14,className:"board-search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by Order, PO, Company or Task...",value:w,onChange:c=>_(c.target.value),className:"board-search-input"}),w&&r.jsx("button",{className:"search-clear-btn",onClick:()=>_(""),title:"Clear search",children:r.jsx(hn,{size:14})})]})]}),f.map(c=>{if(c.status==="completed")return e!=="all"&&!c.steps.some(C=>C.dept===e)?null:r.jsxs("div",{className:"completed-order-row",onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"completed-order-header",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsxs("div",{className:"completed-badges-row",children:[c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"Delivery:"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]}),r.jsx("span",{className:"completed-global-badge",children:"COMPLETED"})]})]}),r.jsx("div",{className:"completed-banner",children:r.jsxs("div",{className:"completed-banner-content",children:[r.jsx("div",{className:"completed-icon-badge",children:"✓"}),r.jsxs("div",{className:"completed-text-content",children:[r.jsx("span",{className:"completed-title",children:"Order Fully Completed"}),r.jsx("span",{className:"completed-subtitle",children:"All steps have been successfully finalized. Click to view process flow logs."})]})]})})]},c.id);let k=[],I=[];if(k=c.steps.filter(D=>["inprogress","blocked","review"].includes(D.status)),k.length===0){const D=c.steps.find(C=>C.status==="pending");if(D)k=[D];else return null}return I=x.filter(D=>k.some(C=>C.dept===D.id)),I.length===0?null:r.jsxs("div",{className:"board-order-row",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsx("div",{className:"board-dept-grid",children:I.map(D=>{const C=k.filter(L=>L.dept===D.id);return r.jsxs("div",{className:"dept-flow-card",style:{borderTopColor:D.color},onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:D.color}}),r.jsx("div",{className:"dept-card-title",children:D.label})]}),r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:c.order_number}),c.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"#aaa",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:c.company_name}),c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"Delivery:"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),c.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"#f59e0b",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"#d1d5db"},children:c.notes})]})]}),r.jsx("div",{className:"dept-card-tasks",children:C.map(L=>r.jsxs("div",{className:`board-task status-${L.status}`,children:[r.jsx("span",{className:`step-dot dot-${L.status}`}),r.jsx("div",{className:"board-task-name",title:L.name,children:L.name}),r.jsx(Yg,{status:L.status})]},L.id))})]},D.id)})})]},c.id)}),f.length===0&&r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"No orders match the current filters."}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
          background: var(--card-bg);
          padding: 12px 20px;
          border-radius: 8px;
          border: 1px solid var(--card-border);
          margin-bottom: -8px;
          box-shadow: var(--card-shadow);
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
          font-weight: 600;
        }
        .board-select {
          background: var(--bg3);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .board-select option {
          background: var(--bg3);
          color: var(--text);
        }
        .board-select:hover {
          border-color: var(--border2);
          background: var(--bg4);
        }
        .board-select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
        }
        .board-order-row {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 32px;
          box-shadow: var(--card-shadow);
        }
        .board-order-title {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          letter-spacing: -0.2px;
        }
        .board-order-company {
          color: var(--text3);
          font-size: 14px;
          font-weight: 500;
          margin-left: 8px;
        }
        .board-dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          align-items: start;
        }
        .dept-flow-card {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-top: 3px solid var(--border2);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .dept-flow-card:hover {
          transform: translateY(-4px);
          background: var(--bg2);
          border-color: var(--accent);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
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
          background: var(--bg3);
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
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 6px 12px;
          margin-left: auto;
          flex: 1 1 200px;
          max-width: 280px;
          min-width: 140px;
          height: 32px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .board-search-container:hover {
          border-color: var(--border2);
        }
        .board-search-container:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
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
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-left: 4px solid var(--green);
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 32px;
          box-shadow: var(--card-shadow);
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .completed-order-row:hover {
          border-color: rgba(22, 163, 74, 0.4);
          border-left-color: var(--green);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(22, 163, 74, 0.05);
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
      `}})]})}const Kd={Urgent:0,High:1,Medium:2,Low:3},Xd={Urgent:{bg:"rgba(239,68,68,0.12)",color:"#ef4444",border:"rgba(239,68,68,0.35)"},High:{bg:"rgba(249,115,22,0.12)",color:"#f97316",border:"rgba(249,115,22,0.35)"},Medium:{bg:"rgba(234,179,8,0.12)",color:"#eab308",border:"rgba(234,179,8,0.35)"},Low:{bg:"rgba(99,102,241,0.12)",color:"#818cf8",border:"rgba(99,102,241,0.35)"}},Zd={Completed:{bg:"rgba(16,185,129,0.12)",color:"#10b981",border:"rgba(16,185,129,0.3)"},Blocked:{bg:"rgba(239,68,68,0.12)",color:"#ef4444",border:"rgba(239,68,68,0.3)"},"In Progress":{bg:"rgba(59,130,246,0.12)",color:"#3b82f6",border:"rgba(59,130,246,0.3)"},"On Hold":{bg:"rgba(148,163,184,0.12)",color:"#94a3b8",border:"rgba(148,163,184,0.3)"}};function Jg({currentFilter:e,onSetView:t}){const[n,a]=p.useState([]),o=p.useRef(null);p.useEffect(()=>{const h=o.current;if(!h)return;let T=!1,j,N;const B=R=>{["INPUT","SELECT","OPTION","BUTTON","A","TH"].includes(R.target.tagName)||R.target.closest("th")||R.target.closest("button")||(T=!0,h.classList.add("active-drag"),j=R.pageX-h.offsetLeft,N=h.scrollLeft)},A=()=>{T=!1,h.classList.remove("active-drag")},V=()=>{T=!1,h.classList.remove("active-drag")},U=R=>{if(!T)return;R.preventDefault();const Y=(R.pageX-h.offsetLeft-j)*1.5;h.scrollLeft=N-Y};return h.addEventListener("mousedown",B),h.addEventListener("mouseleave",A),h.addEventListener("mouseup",V),h.addEventListener("mousemove",U),()=>{h.removeEventListener("mousedown",B),h.removeEventListener("mouseleave",A),h.removeEventListener("mouseup",V),h.removeEventListener("mousemove",U)}},[]);const[s,l]=p.useState(!0),[i,d]=p.useState(""),[u,v]=p.useState("all"),[m,b]=p.useState("incomplete"),[w,_]=p.useState("order_number"),[S,z]=p.useState("asc"),x=localStorage.getItem("token");p.useEffect(()=>{f();const h=()=>{f()};return window.addEventListener("orderUpdated",h),()=>window.removeEventListener("orderUpdated",h)},[e]);const f=async()=>{l(!0);try{const h=e==="all"?"Sales":e,T=await fetch(`${window.API_BASE}/api/dept-worklist/${encodeURIComponent(h)}`,{headers:{Authorization:`Bearer ${x}`}});T.ok&&a(await T.json())}catch(h){console.error(h)}finally{l(!1)}},c=(h,T)=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:parseInt(h),unitId:parseInt(T)}}))},k=h=>{w===h?z(T=>T==="asc"?"desc":"asc"):(_(h),z("asc"))},I=h=>{var T;return h.unit_status==="Dispatched"?"Completed":h.unit_status==="Hold"?"On Hold":(T=h.dept_steps)!=null&&T.some(j=>j.status==="blocked")?"Blocked":"In Progress"},C=[...n.filter(h=>{const T=I(h);if(u!=="all"&&(h.priority||"Medium").toLowerCase()!==u||m==="incomplete"&&T==="Completed"||m==="completed"&&T!=="Completed"||m==="blocked"&&T!=="Blocked"||m==="hold"&&T!=="On Hold")return!1;if(i.trim()){const j=i.trim().toLowerCase();return(h.order_number||"").toLowerCase().includes(j)||(h.unit_serial||"").toLowerCase().includes(j)||(h.company_name||"").toLowerCase().includes(j)||(h.po_number||"").toLowerCase().includes(j)||(h.reference_number||"").toLowerCase().includes(j)||(h.end_client_name||"").toLowerCase().includes(j)||(h.material_description||"").toLowerCase().includes(j)||(h.part_number||"").toLowerCase().includes(j)}return!0})].sort((h,T)=>{let j,N;return w==="priority"?(j=Kd[h.priority||"Medium"]??2,N=Kd[T.priority||"Medium"]??2):w==="delivery_date"?(j=h.delivery_date?new Date(h.delivery_date).getTime():1/0,N=T.delivery_date?new Date(T.delivery_date).getTime():1/0):w==="unit_status"?(j=I(h),N=I(T)):(j=(h[w]||"").toString().toLowerCase(),N=(T[w]||"").toString().toLowerCase()),j<N?S==="asc"?-1:1:j>N?S==="asc"?1:-1:0}),L=({col:h})=>w!==h?r.jsx(ug,{size:11,style:{opacity:.3,marginLeft:4}}):S==="asc"?r.jsx(pg,{size:11,style:{color:"var(--blue)",marginLeft:4}}):r.jsx(Lo,{size:11,style:{color:"var(--blue)",marginLeft:4}}),P=({label:h,col:T,style:j})=>r.jsx("th",{onClick:()=>T&&k(T),style:{cursor:T?"pointer":"default",userSelect:"none",whiteSpace:"nowrap",padding:"11px 14px",fontSize:"11px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.6px",color:w===T?"var(--blue)":"var(--text3)",background:"var(--bg3)",borderBottom:"1px solid var(--border)",...j},children:r.jsxs("span",{style:{display:"inline-flex",alignItems:"center"},children:[h,T&&r.jsx(L,{col:T})]})});return s?r.jsx("div",{style:{padding:60,textAlign:"center",color:"var(--text3)"},children:r.jsx("div",{style:{fontSize:13},children:"Loading units..."})}):r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:0,height:"100%"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"var(--bg2)",borderBottom:"1px solid var(--border)",flexWrap:"wrap"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"7px 12px",flex:"1 1 200px",minWidth:0},children:[r.jsx(Mr,{size:13,style:{color:"var(--text3)",flexShrink:0}}),r.jsx("input",{type:"text",placeholder:"Search order, serial, PO, description, customer...",value:i,onChange:h=>d(h.target.value),style:{background:"none",border:"none",outline:"none",color:"var(--text)",fontSize:13,width:"100%"}}),i&&r.jsx("button",{onClick:()=>d(""),style:{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",display:"flex",padding:0},children:r.jsx(hn,{size:13})})]}),r.jsxs("select",{value:m,onChange:h=>b(h.target.value),style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text2)",fontSize:12,padding:"7px 10px",cursor:"pointer",outline:"none"},children:[r.jsx("option",{value:"all",children:"All Status"}),r.jsx("option",{value:"incomplete",children:"Incomplete"}),r.jsx("option",{value:"completed",children:"Completed"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"hold",children:"On Hold"})]}),r.jsxs("select",{value:u,onChange:h=>v(h.target.value),style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text2)",fontSize:12,padding:"7px 10px",cursor:"pointer",outline:"none"},children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"urgent",children:"Urgent"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"low",children:"Low"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginLeft:"auto",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",fontSize:12,color:"var(--text3)",whiteSpace:"nowrap",flexShrink:0},children:[r.jsx(jg,{size:13}),r.jsx("strong",{style:{color:"var(--text)"},children:C.length})," unit items"]})]}),r.jsx("div",{ref:o,className:"table-responsive-scroll",style:{overflowX:"auto",overflowY:"auto",flex:1},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:13},children:[r.jsx("thead",{style:{position:"sticky",top:0,zIndex:2},children:r.jsxs("tr",{children:[r.jsx(P,{label:"Order #",col:"order_number"}),r.jsx(P,{label:"Unit Serial",col:"unit_serial"}),r.jsx(P,{label:"Customer",col:"company_name"}),r.jsx(P,{label:"PO Number",col:"po_number"}),r.jsx(P,{label:"Ref #",col:"reference_number"}),r.jsx(P,{label:"End Client",col:"end_client_name"}),r.jsx(P,{label:"Part Number",col:"part_number"}),r.jsx(P,{label:"Description",col:"material_description"}),r.jsx(P,{label:"Current Dept",col:"current_dept"}),r.jsx(P,{label:"Priority",col:"priority",style:{textAlign:"center"}}),r.jsx(P,{label:"Delivery",col:"delivery_date"}),r.jsx(P,{label:"Status",col:"unit_status",style:{textAlign:"center"}})]})}),r.jsxs("tbody",{children:[C.map((h,T)=>{const j=I(h),N=Zd[j]||Zd["In Progress"],B=h.priority||"Medium",A=Xd[B]||Xd.Medium,V=h.delivery_date&&new Date(h.delivery_date)<new Date&&j!=="Completed";return r.jsxs("tr",{onClick:()=>c(h.order_id,h.id),style:{background:T%2===0?"var(--bg)":"var(--bg2)",cursor:"pointer",transition:"background 0.12s",borderBottom:"1px solid var(--border)"},onMouseEnter:U=>U.currentTarget.style.background="var(--bg4)",onMouseLeave:U=>U.currentTarget.style.background=T%2===0?"var(--bg)":"var(--bg2)",children:[r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--blue)",fontSize:12,whiteSpace:"nowrap"},children:h.order_number}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--text)",fontSize:12,whiteSpace:"nowrap"},children:h.unit_serial}),r.jsxs("td",{style:{padding:"10px 14px",fontWeight:600,color:"var(--text)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[h.company_name||r.jsx("span",{style:{color:"var(--text3)",fontStyle:"italic"},children:"—"}),h.company_city&&r.jsxs("span",{style:{color:"var(--text3)",fontWeight:400,fontSize:11,marginLeft:4},children:["· ",h.company_city]})]}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",color:"var(--text3)",fontSize:12},children:h.po_number||"—"}),r.jsx("td",{style:{padding:"10px 14px",fontSize:12,whiteSpace:"nowrap"},children:h.reference_number?r.jsx("span",{style:{fontFamily:"var(--font-mono)",color:"#f59e0b",fontWeight:600},children:h.reference_number}):r.jsx("span",{style:{color:"var(--text3)",opacity:.4},children:"—"})}),r.jsx("td",{style:{padding:"10px 14px",color:"var(--text3)",fontSize:12,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:h.end_client_name||r.jsx("span",{style:{opacity:.4},children:"—"})}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--text2)"},children:h.part_number||"—"}),r.jsx("td",{style:{padding:"10px 14px",color:"var(--text2)",fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:h.material_description,children:h.material_description||"—"}),r.jsx("td",{style:{padding:"10px 14px",fontWeight:600,color:"var(--text2)"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:"rgba(99,102,241,0.1)",color:"#818cf8",border:"1px solid rgba(99,102,241,0.25)",textTransform:"uppercase",letterSpacing:"0.4px"},children:h.current_dept||"Sales"})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:A.bg,color:A.color,border:`1px solid ${A.border}`,textTransform:"uppercase",letterSpacing:"0.5px"},children:B})}),r.jsxs("td",{style:{padding:"10px 14px",color:V?"#ef4444":"var(--text2)",fontWeight:V?600:400,whiteSpace:"nowrap",fontSize:12},children:[h.delivery_date?new Date(h.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"}),V&&r.jsx("span",{style:{fontSize:9,color:"#ef4444",fontWeight:700,marginLeft:5,background:"rgba(239,68,68,0.12)",borderRadius:4,padding:"1px 5px"},children:"OVERDUE"})]}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:N.bg,color:N.color,border:`1px solid ${N.border}`,textTransform:"uppercase",letterSpacing:"0.4px",whiteSpace:"nowrap"},children:j})})]},h.unit_id)}),C.length===0&&r.jsx("tr",{children:r.jsxs("td",{colSpan:12,style:{textAlign:"center",padding:"48px 24px",color:"var(--text3)"},children:[r.jsx(Mr,{size:28,style:{opacity:.3,marginBottom:8,display:"block",margin:"0 auto 8px"}}),r.jsx("div",{style:{fontSize:14},children:"No units match the current filters"})]})})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .table-responsive-scroll {
          cursor: grab;
        }
        .table-responsive-scroll.active-drag {
          cursor: grabbing;
          user-select: none;
        }
      `}})]})}function Kg({selectedStep:e,activityLog:t,selectedOrder:n,isOpen:a=!0,onToggle:o}){var l,i,d;const s=e?jr.find(u=>u.id===e.dept):null;return r.jsxs("div",{className:`right-panel${a?"":" right-panel--collapsed"}`,children:[r.jsx("button",{className:"rp-toggle",onClick:o,title:a?"Collapse panel":"Expand panel","aria-label":a?"Collapse sidebar":"Expand sidebar",children:r.jsx(Dp,{size:15,style:{transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)",transform:a?"rotate(0deg)":"rotate(180deg)"}})}),r.jsx("div",{className:"rp-inner",children:r.jsxs("div",{className:"rp-content",children:[r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Selected Step"}),e?r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:8,color:(s==null?void 0:s.color)||"var(--text)"},children:e.name}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Department"}),r.jsx("span",{className:"detail-val",style:{color:(s==null?void 0:s.color)||"inherit"},children:e.dept})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Status"}),r.jsx("span",{className:`step-status-badge badge-${e.status}`,style:{marginTop:0},children:e.status.toUpperCase()})]}),e.notes&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Notes"}),r.jsx("span",{className:"detail-val",style:{color:"var(--text2)",maxWidth:130,textAlign:"right",wordBreak:"break-word"},children:e.notes})]})]}):r.jsx("div",{className:"empty-detail",children:"Click any step to see details."})]}),n?r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Order Overview"}),r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:4,fontFamily:"var(--font-mono)",fontSize:13},children:n.order_number}),n.company_name&&r.jsx("div",{style:{color:"var(--text2)",fontSize:11,marginBottom:12},children:n.company_name}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Priority"}),r.jsx("span",{className:`priority-badge ${((l=n.priority)==null?void 0:l.toLowerCase())||"medium"}`,style:{fontSize:10},children:n.priority||"Medium"})]}),n.po_number&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"PO Number"}),r.jsx("span",{className:"detail-val",children:n.po_number})]}),n.reference_number&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Cust. Ref #"}),r.jsx("span",{className:"detail-val",children:n.reference_number})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Classification"}),r.jsx("span",{className:"detail-val",style:{fontWeight:"600",color:n.classification==="Non-Standard"?"var(--blue)":"var(--text2)"},children:n.classification||"Standard"})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Order Date"}),r.jsx("span",{className:"detail-val",children:n.order_date?new Date(n.order_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"N/A"})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Delivery"}),r.jsx("span",{className:"detail-val",style:{color:"var(--accent)"},children:n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"TBD"})]}),n.packaging_type&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Packaging"}),r.jsxs("span",{className:"detail-val",style:{color:"var(--purple)"},children:[n.packaging_type==="Wooden Packaging"?"🪵":"🫧"," ",n.packaging_type]})]}),((i=n.units)==null?void 0:i.length)>0&&r.jsxs("div",{style:{marginTop:12,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsxs("span",{className:"detail-key",style:{display:"block",marginBottom:8},children:["Units (",n.units.length,")"]}),r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:4},children:[n.units.slice(0,12).map(u=>r.jsx("span",{style:{fontSize:9,padding:"2px 5px",borderRadius:3,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontFamily:"var(--font-mono)"},children:u.short_serial},u.id)),n.units.length>12&&r.jsxs("span",{style:{fontSize:9,color:"var(--text3)",padding:"2px 4px"},children:["+",n.units.length-12," more"]})]})]}),((d=n.documents)==null?void 0:d.filter(u=>u.doc_type!=="TaskUpload").length)>0&&r.jsxs("div",{style:{marginTop:10,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsx("span",{className:"detail-key",style:{display:"block",marginBottom:6},children:"Documents"}),n.documents.filter(u=>u.doc_type!=="TaskUpload").map(u=>r.jsx("div",{style:{fontSize:11,marginBottom:3},children:r.jsx("a",{href:`${window.API_BASE}/uploads/${u.file_path.split(/[/\\]/).pop()}?token=${localStorage.getItem("token")}`,target:"_blank",rel:"noopener noreferrer",style:{color:"var(--blue)",textDecoration:"none"},children:u.file_name})},u.id))]})]})]}):null,r.jsxs("div",{className:"panel-section",style:{flex:1},children:[r.jsxs("div",{className:"panel-sec-title",style:{display:"flex",alignItems:"center",gap:6},children:[r.jsx(Pp,{size:10}),"Activity Log"]}),r.jsxs("div",{id:"activityLog",style:{maxHeight:280,overflowY:"auto"},children:[t.length===0&&r.jsx("div",{className:"empty-detail",children:"No activity recorded yet."}),t.slice(0,50).map((u,v)=>{var b;const m=((b=jr.find(w=>w.id===u.dept))==null?void 0:b.color)||"var(--text2)";return r.jsxs("div",{className:"log-entry",children:[r.jsx("div",{className:"log-time",children:u.time}),r.jsxs("div",{className:"log-text",children:[r.jsxs("span",{className:"log-dept",style:{color:m},children:["[",u.dept,"]"]})," ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:600},children:u.username}),": ",u.text]})]},v)})]})]})]})})]})}const ec=e=>{if(!e)return"";if(typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e))return e;try{const t=new Date(e);if(!isNaN(t.getTime()))return t.toISOString().split("T")[0]}catch{}return""};function Xg({step:e,isOpen:t,onClose:n,onSave:a,onDelete:o,userRole:s,selectedOrder:l}){const[i,d]=p.useState("pending"),[u,v]=p.useState(""),[m,b]=p.useState(null),[w,_]=p.useState(""),[S,z]=p.useState({layout:!1,electrical:!1,bom:!1}),[x,f]=p.useState(0),[c,k]=p.useState([]),[I,D]=p.useState("details"),[C,L]=p.useState(null),P=["Admin","Manager"].includes(s),h=e?(["Admin","Manager"].includes(s)||e.dept===s)&&(l==null?void 0:l.hold_status)!=="Approved":!1;if(p.useEffect(()=>{if(e){d(e.status),v(e.notes||""),_(ec(e.dispatch_date)),b(null),z({layout:!1,electrical:!1,bom:!1}),f(0),D("details"),L(null);try{const A=Array.isArray(e.custom_fields)?e.custom_fields:JSON.parse(e.custom_fields||"[]");k(Array.isArray(A)?A:[])}catch{k([])}}},[e]),!t||!e)return null;const T=async()=>{if(!h)return;if(e.requires_upload&&i==="done"&&x===0){alert("You must upload at least one document to complete this task.");return}L(null);const A=await a({status:i,notes:u,qcFailTarget:m,dispatchDate:w,checklist:S,custom_fields:c});A&&L(A)},j=(A,V)=>{k(U=>U.map((R,J)=>J===A?{...R,value:V}:R))},N=A=>{A.target.className==="modal-overlay open"&&n()},B=(A,V)=>{switch(A.type){case"Text":return r.jsx("input",{type:"text",className:"form-input",value:A.value||"",onChange:U=>j(V,U.target.value),placeholder:`Enter ${A.label}...`,disabled:!h});case"Number":return r.jsx("input",{type:"number",className:"form-input",value:A.value||"",onChange:U=>j(V,U.target.value),disabled:!h});case"Date":return r.jsx("input",{type:"date",className:"form-input",value:ec(A.value),onChange:U=>j(V,U.target.value),disabled:!h});case"Yes/No":return r.jsx("div",{style:{display:"flex",gap:"12px",marginTop:"4px"},children:["Yes","No"].map(U=>r.jsx("button",{type:"button",onClick:()=>h&&j(V,U),style:{padding:"6px 20px",borderRadius:"6px",border:"1px solid",cursor:h?"pointer":"default",fontSize:"13px",fontWeight:"600",background:A.value===U?U==="Yes"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)":"transparent",borderColor:A.value===U?U==="Yes"?"#10b981":"#ef4444":"#444",color:A.value===U?U==="Yes"?"#10b981":"#ef4444":"#888",opacity:!h&&A.value!==U?.4:1},children:U},U))});case"Dropdown":return r.jsxs("select",{className:"form-select",value:A.value||"",onChange:U=>j(V,U.target.value),disabled:!h,children:[r.jsx("option",{value:"",children:"-- Select --"}),(A.options||[]).map(U=>r.jsx("option",{value:U,children:U},U))]});default:return r.jsx("input",{type:"text",className:"form-input",value:A.value||"",onChange:U=>j(V,U.target.value),placeholder:`Enter ${A.label}...`,disabled:!h})}};return r.jsxs("div",{className:"modal-overlay open",onClick:N,children:[r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:e.name}),r.jsxs("div",{className:"modal-sub",children:[e.dept," — ",e.sub]})]}),r.jsx("button",{className:"modal-close",onClick:n,children:"✕"})]}),(l==null?void 0:l.hold_status)==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.08)",borderBottom:"1px solid rgba(239, 68, 68, 0.15)",padding:"12px 24px",color:"#ef4444",fontSize:"12px",fontWeight:"500"},children:[r.jsx("strong",{children:"Order is on hold."})," Flow updates and document uploads are disabled."]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid var(--border)",padding:"0 24px"},children:["details",...c.length>0?["fields"]:[],"documents"].map(A=>r.jsxs("button",{onClick:()=>D(A),style:{background:"transparent",border:"none",borderBottom:I===A?"2px solid var(--blue)":"2px solid transparent",color:I===A?"var(--blue)":"var(--text3)",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:I===A?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[A==="fields"?"Form Fields":A.charAt(0).toUpperCase()+A.slice(1),A==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:c.length})]},A))}),r.jsxs("div",{className:"modal-body",children:[I==="details"&&r.jsxs(r.Fragment,{children:[!h&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px"}}),r.jsxs("span",{children:[r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:e.dept})," department."]})]}),C&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"13px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px",flexShrink:0}}),r.jsx("span",{style:{flex:1},children:C}),r.jsx("button",{onClick:()=>L(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"16px",padding:"0",lineHeight:1},children:"✕"})]}),l&&e.order_fields&&e.order_fields.length>0&&r.jsxs("div",{style:{marginBottom:"16px",padding:"12px 16px",background:"rgba(59,130,246,0.05)",border:"1px solid rgba(59,130,246,0.15)",borderRadius:"8px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"#3b82f6",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"10px"},children:"Order Reference"}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))",gap:"8px"},children:e.order_fields.map(A=>{const V={order_number:"Order #",company_name:"Company",delivery_date:"Delivery Date",po_number:"PO Number",packaging_type:"Packaging",priority:"Priority",notes:"Order Notes"};let U=l[A];return A==="delivery_date"&&U&&(U=new Date(U).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})),r.jsxs("div",{style:{background:"var(--bg3)",borderRadius:"6px",padding:"8px 10px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"3px"},children:V[A]||A}),r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",fontWeight:"500"},children:U||"—"})]},A)})})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Status"}),h?r.jsxs("select",{className:"form-select",value:i,onChange:A=>d(A.target.value),children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"review",children:"Under Review"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${(Je[i]||Je.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:(Je[i]||Je.pending).label})})]}),e.special==="qc"&&r.jsxs("div",{id:"qcFailArea",children:[r.jsx("label",{style:{fontSize:10,color:"var(--text3)",display:"block",marginBottom:6},children:"If QC Fail — return to:"}),h?r.jsxs("div",{className:"qc-options",children:[r.jsxs("div",{className:`qc-opt${m==="production"?" selected":""}`,onClick:()=>h&&b("production"),style:{cursor:h?"pointer":"default"},children:["Production",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Rework"})]}),r.jsxs("div",{className:`qc-opt${m==="design"?" selected":""}`,onClick:()=>h&&b("design"),style:{cursor:h?"pointer":"default"},children:["Design",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Re-check"})]})]}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:m?`Returned to ${m.charAt(0).toUpperCase()+m.slice(1)}`:"No fail action selected"})]}),e.special==="design"&&r.jsxs("div",{className:"design-checklist",children:[r.jsx("div",{className:"design-checklist-title",children:"Simultaneous Release Checklist"}),h?r.jsxs(r.Fragment,{children:[r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:S.layout,onChange:A=>z({...S,layout:A.target.checked})})," Panel Layout (for Fitter)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:S.electrical,onChange:A=>z({...S,electrical:A.target.checked})})," Electrical Design (for Wireman)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:S.bom,onChange:A=>z({...S,bom:A.target.checked})})," BOM Released to Purchase & Stores"]})]}):r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px"},children:[r.jsxs("div",{children:[S.layout?"Yes":"No"," Panel Layout (for Fitter)"]}),r.jsxs("div",{children:[S.electrical?"Yes":"No"," Panel Design (for Wireman)"]}),r.jsxs("div",{children:[S.bom?"Yes":"No"," BOM Released to Purchase & Stores"]})]})]}),e.special==="dispatch"&&r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirmed Dispatch Date"}),h?r.jsx("input",{type:"date",className:"form-input",value:w,onChange:A=>_(A.target.value)}):r.jsx("div",{style:{fontSize:"14px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:w?new Date(w).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"Not set"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Notes / Remarks"}),h?r.jsx("textarea",{className:"form-textarea",placeholder:"Add notes…",value:u,onChange:A=>v(A.target.value)}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"10px 14px",borderRadius:"6px",border:"1px solid var(--border)",minHeight:"40px",whiteSpace:"pre-wrap"},children:u||"No notes or remarks added."})]})]}),I==="fields"&&c.length>0&&r.jsxs("div",{children:[r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",marginBottom:"16px"},children:h?"Fill in the required information for this task.":"Information filled in for this task."}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:c.map((A,V)=>r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 16px"},children:[r.jsx("div",{style:{marginBottom:"8px"},children:r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:A.label})}),h?B(A,V):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",fontWeight:"500",marginTop:"4px"},children:A.type==="Yes/No"?A.value==="Yes"||A.value===!0?"Yes":"No":A.value||"—"})]},V))})]}),I==="documents"&&r.jsxs("div",{children:[e.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"This task requires at least one document to be marked as Done."}),r.jsx(Ro,{entityType:"Step",entityId:e.id,initialDocs:[],onDocsUpdate:A=>f(A.length),readOnly:!h,defaultDocType:e.default_doc_type||"General",userRole:s})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"24px",paddingTop:"16px",borderTop:"1px solid var(--border)"},children:[P&&h?r.jsx("button",{className:"vbtn",style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444"},onClick:()=>o(e.id),children:"Delete Task"}):r.jsx("div",{}),r.jsx("div",{style:{display:"flex",gap:"12px"},children:h?r.jsxs(r.Fragment,{children:[r.jsx("button",{className:"btn-cancel",onClick:n,children:"Cancel"}),r.jsx("button",{className:"btn-save",onClick:T,children:"Update Status"})]}):r.jsx("button",{className:"btn-cancel",onClick:n,style:{minWidth:"100px"},children:"Close"})})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .sales-action-box {
          background: rgba(20, 184, 166, 0.1);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .action-label { color: var(--teal); font-size: 11px; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; }
        .action-text { color: var(--text2); font-size: 13px; margin-bottom: 12px; line-height: 1.4; }
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
      `}})]})}function Zg(){const[e,t]=p.useState(""),[n,a]=p.useState(""),[o,s]=p.useState(!1),[l,i]=p.useState(""),[d,u]=p.useState(!1),v=zi();p.useEffect(()=>{localStorage.getItem("token")&&v("/dashboard")},[v]);const m=async b=>{b.preventDefault(),i(""),u(!0);try{const w=await fetch(window.API_BASE+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:n})}),_=await w.json();if(!w.ok)throw new Error(_.error||"Login failed");localStorage.setItem("token",_.token),localStorage.setItem("user",JSON.stringify(_.user)),v("/dashboard")}catch(w){i(w.message)}finally{u(!1)}};return r.jsx("div",{className:"auth-container",children:r.jsxs("div",{className:"auth-card",children:[r.jsxs("div",{className:"auth-header",children:[r.jsx("div",{className:"auth-logo",children:r.jsx(Sg,{size:32,className:"neon-text"})}),r.jsx("h1",{children:"Welcome Back"}),r.jsx("p",{children:"Sign in to access your ERP dashboard"})]}),r.jsxs("form",{onSubmit:m,className:"auth-form",children:[l&&r.jsxs("div",{className:"auth-error",children:[r.jsx(Io,{size:18}),r.jsx("span",{children:l})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"email",children:"Email Address / Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Lp,{className:"input-icon",size:18}),r.jsx("input",{id:"email",type:"text",placeholder:"email or username",value:e,onChange:b=>t(b.target.value),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"password",children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(rn,{className:"input-icon",size:18}),r.jsx("input",{id:"password",type:o?"text":"password",placeholder:"••••••••",value:n,onChange:b=>a(b.target.value),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>s(!o),"aria-label":o?"Hide password":"Show password",children:o?r.jsx(Mn,{size:18}):r.jsx($n,{size:18})})]})]}),r.jsx("button",{type:"submit",className:"auth-button",disabled:d,children:d?r.jsx(Un,{className:"animate-spin"}):"Sign In"})]})]})})}function eh(){const[e,t]=p.useState([]),[n,a]=p.useState(!0),[o,s]=p.useState(null),[l,i]=p.useState(!1),[d,u]=p.useState({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),[v,m]=p.useState(!1),[b,w]=p.useState(""),[_,S]=p.useState(!1),[z,x]=p.useState(!1),[f,c]=p.useState(null),[k,I]=p.useState(!1),[D,C]=p.useState({username:"",email:"",role:"",password:"",confirmPassword:""}),[L,P]=p.useState(!1),[h,T]=p.useState(!1),[j,N]=p.useState(""),[B,A]=p.useState(!1),[V,U]=p.useState(null),[R,J]=p.useState(!1),[Y,E]=p.useState(""),M=localStorage.getItem("token"),Z=["Admin","Manager","Sales","Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Planning","Viewer"];p.useEffect(()=>{le()},[]);const le=async()=>{try{const Q=await fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${M}`}}),ge=await Q.json();Q.ok&&t(ge)}catch(Q){console.error("Failed to fetch users",Q)}finally{a(!1)}},xe=async Q=>{if(Q.preventDefault(),m(!0),w(""),d.password!==d.confirmPassword){w("Passwords do not match"),m(!1);return}try{const{confirmPassword:ge,...ie}=d,F=await fetch(window.API_BASE+"/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${M}`},body:JSON.stringify(ie)}),je=await F.json();F.ok?(i(!1),u({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),S(!1),x(!1),le()):w(je.error||"Failed to create user")}catch{w("Network error")}finally{m(!1)}},se=Q=>{c(Q),C({username:Q.username,email:Q.email,role:Q.role,password:"",confirmPassword:""}),N(""),P(!1),T(!1),I(!0)},ve=()=>{c(null),I(!1),P(!1),T(!1)},O=async Q=>{if(Q.preventDefault(),A(!0),N(""),D.password&&D.password!==D.confirmPassword){N("Passwords do not match"),A(!1);return}try{const{confirmPassword:ge,...ie}=D,F=await fetch(`${window.API_BASE}/api/users/${f.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${M}`},body:JSON.stringify(ie)}),je=await F.json();F.ok?(I(!1),c(null),le()):N(je.error||"Failed to update user")}catch{N("Network error")}finally{A(!1)}},re=async()=>{if(V){J(!0),E("");try{const Q=await fetch(`${window.API_BASE}/api/users/${V.id}`,{method:"DELETE",headers:{Authorization:`Bearer ${M}`}}),ge=await Q.json();Q.ok?(U(null),le()):E(ge.error||"Failed to delete user")}catch{E("Network error")}finally{J(!1)}}};return n?r.jsxs("div",{className:"loading-state",children:[r.jsx(Un,{className:"animate-spin"})," Loading User Directory..."]}):r.jsxs("div",{className:"user-mgmt",children:[r.jsxs("div",{className:"mgmt-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Ap,{size:20}),r.jsx("h2",{children:"User Management Directory"}),r.jsxs("span",{className:"badge-count",children:[e.length," Total Accounts"]})]}),r.jsxs("button",{className:"add-user-btn",onClick:()=>i(!l),children:[r.jsx(Bg,{size:16}),l?"Cancel":"Add New User"]})]}),l&&r.jsx("div",{className:"add-user-form-container",children:r.jsxs("form",{onSubmit:xe,className:"add-user-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(ts,{size:14,className:"input-icon"}),r.jsx("input",{type:"text",placeholder:"johndoe",value:d.username,onChange:Q=>u({...d,username:Q.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Email Address"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Lp,{size:14,className:"input-icon"}),r.jsx("input",{type:"email",placeholder:"john@example.com",value:d.email,onChange:Q=>u({...d,email:Q.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(rn,{size:14,className:"input-icon"}),r.jsx("input",{type:_?"text":"password",placeholder:"••••••••",value:d.password,onChange:Q=>u({...d,password:Q.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>S(!_),"aria-label":_?"Hide password":"Show password",children:_?r.jsx(Mn,{size:14}):r.jsx($n,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Confirm Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(rn,{size:14,className:"input-icon"}),r.jsx("input",{type:z?"text":"password",placeholder:"••••••••",value:d.confirmPassword,onChange:Q=>u({...d,confirmPassword:Q.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>x(!z),"aria-label":z?"Hide password":"Show password",children:z?r.jsx(Mn,{size:14}):r.jsx($n,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Assign Role"}),r.jsx("select",{className:"auth-select",value:d.role,onChange:Q=>u({...d,role:Q.target.value}),children:Z.map(Q=>r.jsx("option",{value:Q,children:Q},Q))})]})]}),b&&r.jsx("div",{className:"form-error",children:b}),r.jsx("button",{type:"submit",className:"submit-user-btn",disabled:v,children:v?r.jsx(Un,{size:16,className:"animate-spin"}):"Create User Account"})]})}),r.jsx("div",{className:"user-table-container",children:r.jsxs("table",{className:"user-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Username"}),r.jsx("th",{children:"Email"}),r.jsx("th",{children:"Current Role"}),r.jsx("th",{children:"Actions"})]})}),r.jsx("tbody",{children:e.map(Q=>r.jsxs("tr",{children:[r.jsx("td",{className:"u-name",children:Q.username}),r.jsx("td",{className:"u-email",children:Q.email}),r.jsx("td",{children:r.jsx("span",{className:`role-badge role-${Q.role.toLowerCase()}`,children:Q.role})}),r.jsx("td",{children:r.jsxs("div",{className:"action-buttons-cell",style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsxs("button",{className:"vbtn",onClick:()=>se(Q),style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(Ig,{size:14}),"Edit"]}),r.jsxs("button",{className:"vbtn",onClick:()=>{E(""),U(Q)},style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px",borderColor:"rgba(239,68,68,0.3)",color:"var(--red)"},children:[r.jsx(Ip,{size:14}),"Delete"]})]})})]},Q.id))})]})}),k&&f&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",children:"Edit User Details"}),r.jsxs("p",{className:"modal-sub",children:["Modify details for account: ",f.username]})]}),r.jsx("button",{className:"modal-close",onClick:ve,children:r.jsx(hn,{size:18})})]}),r.jsxs("form",{onSubmit:O,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Username"}),r.jsx("input",{type:"text",className:"form-input",value:D.username,onChange:Q=>C({...D,username:Q.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Email Address"}),r.jsx("input",{type:"email",className:"form-input",value:D.email,onChange:Q=>C({...D,email:Q.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Role"}),r.jsx("select",{className:"form-select",value:D.role,onChange:Q=>C({...D,role:Q.target.value}),children:Z.map(Q=>r.jsx("option",{value:Q,children:Q},Q))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"New Password (leave blank to keep current)"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(rn,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:L?"text":"password",className:"form-input",placeholder:"••••••••",value:D.password,onChange:Q=>C({...D,password:Q.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>P(!L),style:{right:"12px"},"aria-label":L?"Hide password":"Show password",children:L?r.jsx(Mn,{size:14}):r.jsx($n,{size:14})})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirm New Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(rn,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:h?"text":"password",className:"form-input",placeholder:"••••••••",value:D.confirmPassword||"",onChange:Q=>C({...D,confirmPassword:Q.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>T(!h),style:{right:"12px"},"aria-label":h?"Hide password":"Show password",children:h?r.jsx(Mn,{size:14}):r.jsx($n,{size:14})})]})]}),j&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:j}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:ve,disabled:B,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:B,children:B?r.jsx(Un,{size:16,className:"animate-spin"}):"Save Changes"})]})]})]})}),V&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",style:{color:"var(--red)"},children:"Delete User Account"}),r.jsx("p",{className:"modal-sub",children:"Are you sure you want to permanently delete this user?"})]}),r.jsx("button",{className:"modal-close",onClick:()=>U(null),children:r.jsx(hn,{size:18})})]}),r.jsxs("div",{className:"modal-body",children:[r.jsxs("p",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:"1.5"},children:["Deleting ",r.jsx("strong",{children:V.username})," (",V.email,") will remove their account immediately. Any documents uploaded, orders created, or panels assigned to this user will have their references cleared safely."]}),Y&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:Y}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>U(null),disabled:R,children:"Cancel"}),r.jsx("button",{type:"button",className:"btn-save",style:{background:"var(--red)",color:"#fff"},onClick:re,disabled:R,children:R?r.jsx(Un,{size:16,className:"animate-spin"}):"Delete Account"})]})]})]})})]})}function th({onOrderCreated:e}){const[t,n]=p.useState({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard",lineItems:[{material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),[a,o]=p.useState([]),[s,l]=p.useState({po:null,quotation:null,approved_docs:[]}),[i,d]=p.useState(!1),[u,v]=p.useState(!1),[m,b]=p.useState(!1),[w,_]=p.useState(!1),S=localStorage.getItem("token");p.useEffect(()=>{fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${S}`}}).then(j=>j.json()).then(j=>o(j)).catch(j=>console.error(j))},[S]),p.useEffect(()=>{if(t.order_date){const j=new Date(t.order_date);j.setDate(j.getDate()+28);const N=j.toISOString().split("T")[0];t.delivery_date!==N&&n(B=>({...B,delivery_date:N,lineItems:B.lineItems.map(A=>({...A,delivery_date:N}))}))}else t.delivery_date!==""&&n(j=>({...j,delivery_date:"",lineItems:j.lineItems.map(N=>({...N,delivery_date:""}))}))},[t.order_date]);const z=j=>{const{name:N,value:B}=j.target;n(A=>({...A,[N]:B}))},x=(j,N,B)=>{n(A=>{const V=[...A.lineItems];if(V[j][N]=B,N==="quantity"||N==="unit_price"){const U=parseFloat(V[j].quantity)||0,R=parseFloat(V[j].unit_price)||0;V[j].total_price=(U*R).toFixed(2)}return{...A,lineItems:V}})},f=()=>{n(j=>({...j,lineItems:[...j.lineItems,{material_description:"",part_number:"",panel_type_size:"",delivery_date:j.delivery_date||"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}))},c=j=>{n(N=>({...N,lineItems:N.lineItems.filter((B,A)=>A!==j)}))},k=(j,N)=>{l(N==="approved_docs"?B=>{const V=[...B.approved_docs||[],...j];return V.length>20?(alert("Maximum 20 files allowed"),B):{...B,[N]:V}}:B=>({...B,[N]:j[0]}))},I=(j,N)=>{const B=Array.from(j.target.files);B.length!==0&&(k(B,N),j.target.value="")},D=(j,N)=>{j.preventDefault(),N(!0)},C=j=>{j(!1)},L=(j,N,B)=>{j.preventDefault(),B(!1);const A=Array.from(j.dataTransfer.files);A.length!==0&&k(A,N)},P=j=>{l(N=>({...N,approved_docs:N.approved_docs.filter((B,A)=>A!==j)}))},h=j=>{l(B=>({...B,[j]:null}));const N=document.getElementById(`file-input-${j}`);N&&(N.value="")},T=async j=>{if(j.preventDefault(),!t.company_location_id||t.lineItems.length===0){alert("Please select a company and add at least one line item.");return}d(!0);const N=new FormData;N.append("company_location_id",t.company_location_id),N.append("order_date",t.order_date),N.append("delivery_date",t.delivery_date),N.append("notes",t.notes),N.append("priority",t.priority),N.append("po_number",t.po_number),N.append("end_client_name",t.end_client_name||""),N.append("gst_number",t.gst_number||""),N.append("reference_number",t.reference_number||""),N.append("classification",t.classification||"Standard"),N.append("lineItems",JSON.stringify(t.lineItems)),s.po&&N.append("po",s.po),s.quotation&&N.append("quotation",s.quotation),s.approved_docs&&s.approved_docs.length>0&&s.approved_docs.forEach(B=>N.append("approved",B));try{const B=await fetch(window.API_BASE+"/api/orders",{method:"POST",headers:{Authorization:`Bearer ${S}`},body:N});if(B.ok){const A=await B.json();alert(A.message),e&&e(A.order),n({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard",lineItems:[{material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),l({po:null,quotation:null,approved_docs:[]})}else{const A=await B.json();alert(A.error||"Failed to create order")}}catch(B){console.error("Submit error:",B),alert("Network error during order creation")}finally{d(!1)}};return r.jsxs("div",{className:"order-creation-container",children:[r.jsxs("div",{className:"form-card",children:[r.jsx("h2",{className:"form-title",children:"Create New Order"}),r.jsx("p",{className:"form-subtitle",children:"Fill in the details to generate an Internal Order Number and Unit IDs."}),r.jsxs("form",{onSubmit:T,className:"order-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Select Company & Location"}),r.jsxs("select",{name:"company_location_id",value:t.company_location_id,onChange:z,className:"form-select",children:[r.jsx("option",{value:"",children:"-- None --"}),a.map(j=>{var N;return r.jsx("optgroup",{label:j.name,children:(N=j.locations)==null?void 0:N.map(B=>r.jsxs("option",{value:B.id,children:[j.name," - ",B.city]},B.id))},j.id)})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Order Date"}),r.jsx("input",{type:"date",name:"order_date",value:t.order_date,onChange:z})]}),r.jsxs("div",{className:"form-group",children:[r.jsxs("label",{children:["Overall Delivery Date ",r.jsx("span",{style:{fontSize:"11px",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",name:"delivery_date",value:t.delivery_date,disabled:!0,style:{opacity:.7,cursor:"not-allowed"}})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{name:"priority",value:t.priority,onChange:z,className:"form-input",children:[r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Customer PO Number"}),r.jsx("input",{type:"text",name:"po_number",value:t.po_number,onChange:z})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Dispatch / Packaging"}),r.jsxs("select",{name:"packaging_type",value:t.packaging_type,onChange:z,className:"form-input",children:[r.jsx("option",{value:"",children:"-- Select Packaging Type --"}),r.jsx("option",{value:"Wooden Packaging",children:"Wooden Packaging"}),r.jsx("option",{value:"Foam Packaging",children:"Foam Packaging"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"End Client Name (Optional)"}),r.jsx("input",{type:"text",name:"end_client_name",value:t.end_client_name,onChange:z})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"GST Number (Optional)"}),r.jsx("input",{type:"text",name:"gst_number",value:t.gst_number,onChange:z,placeholder:"e.g. 27AAAAA1111A1Z1"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Customer Reference Number (Optional)"}),r.jsx("input",{type:"text",name:"reference_number",value:t.reference_number,onChange:z,placeholder:"e.g. REF-2026-99"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Classification"}),r.jsxs("select",{name:"classification",value:t.classification||"Standard",onChange:z,style:{width:"100%",padding:"8px 12px",background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text2)",fontSize:"13px"},children:[r.jsx("option",{value:"Standard",children:"Standard"}),r.jsx("option",{value:"Non-Standard",children:"Non-Standard"})]})]}),r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Overall Order Notes"}),r.jsx("textarea",{name:"notes",value:t.notes,onChange:z})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"32px",marginBottom:"32px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[r.jsx("h3",{className:"section-title",style:{margin:0},children:"Line Items"}),r.jsx("button",{type:"button",className:"vbtn",style:{background:"#3b82f6",fontSize:"12px",padding:"6px 12px"},onClick:f,children:"+ Add Line Item"})]}),t.lineItems.map((j,N)=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"20px",borderRadius:"12px",border:"1px solid var(--border)",marginBottom:"16px",position:"relative"},children:[t.lineItems.length>1&&r.jsx("button",{type:"button",onClick:()=>c(N),style:{position:"absolute",top:"16px",right:"16px",background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:"16px"},children:"✕"}),r.jsxs("div",{className:"line-item-grid-1",children:[r.jsxs("div",{children:[r.jsxs("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:["Line Item # ",r.jsx("span",{style:{color:"#888",fontStyle:"italic"},children:"(auto-assigned)"})]}),r.jsx("input",{type:"text",className:"form-input",value:`Item ${N+1}`,readOnly:!0,style:{background:"var(--bg4)",opacity:.6,cursor:"not-allowed"}})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Material Description"}),r.jsx("input",{type:"text",className:"form-input",value:j.material_description,onChange:B=>x(N,"material_description",B.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Part Number *"}),r.jsx("input",{type:"text",className:"form-input",value:j.part_number,onChange:B=>x(N,"part_number",B.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Panel Type / Size"}),r.jsx("input",{type:"text",className:"form-input",value:j.panel_type_size,onChange:B=>x(N,"panel_type_size",B.target.value)})]})]}),r.jsxs("div",{className:"line-item-grid-2",children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Quantity *"}),r.jsx("input",{type:"number",className:"form-input",min:"1",value:j.quantity,onChange:B=>x(N,"quantity",B.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Unit"}),r.jsx("input",{type:"text",className:"form-input",value:j.unit,onChange:B=>x(N,"unit",B.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Unit Price *"}),r.jsx("input",{type:"number",step:"0.01",min:"0",max:"9999999999999.99",className:"form-input",value:j.unit_price,onChange:B=>x(N,"unit_price",B.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Total Price"}),r.jsx("input",{type:"number",step:"0.01",className:"form-input",value:j.total_price,onChange:B=>x(N,"total_price",B.target.value),readOnly:!0,style:{background:"var(--bg4)",opacity:.7}})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Delivery Date"}),r.jsx("input",{type:"date",className:"form-input",value:j.delivery_date,disabled:!0,style:{opacity:.7,cursor:"not-allowed"}})]})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Item Notes"}),r.jsx("input",{type:"text",className:"form-input",value:j.notes,onChange:B=>x(N,"notes",B.target.value)})]})]},N))]}),r.jsxs("div",{className:"file-upload-section",children:[r.jsx("h3",{className:"section-title",children:"Required Documents"}),r.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"16px"},children:["Only ",r.jsx("strong",{style:{color:"var(--text2)"},children:"one"})," PO copy and one Quotation allowed. To replace after submission, delete the existing file first."]}),r.jsxs("div",{className:"file-grid",children:[r.jsxs("div",{className:`file-input-wrapper${u?" dragging":""}`,onDragOver:j=>D(j,v),onDragLeave:()=>C(v),onDrop:j=>L(j,"po",v),children:[r.jsx("label",{children:"Customer PO Copy"}),s.po?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"8px 10px",width:"100%",justifyContent:"center"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981",fontWeight:"bold"},children:"Done"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:s.po.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:j=>I(j,"po")})]}),r.jsx("button",{type:"button",onClick:()=>h("po"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"Drag file here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:j=>I(j,"po")})]})]}),r.jsxs("div",{className:`file-input-wrapper${m?" dragging":""}`,onDragOver:j=>D(j,b),onDragLeave:()=>C(b),onDrop:j=>L(j,"quotation",b),children:[r.jsx("label",{children:"Quotation"}),s.quotation?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"8px 10px",width:"100%",justifyContent:"center"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981",fontWeight:"bold"},children:"Done"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:s.quotation.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:j=>I(j,"quotation")})]}),r.jsx("button",{type:"button",onClick:()=>h("quotation"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"Drag file here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:j=>I(j,"quotation")})]})]}),r.jsxs("div",{className:`file-input-wrapper${w?" dragging":""}`,onDragOver:j=>D(j,_),onDragLeave:()=>C(_),onDrop:j=>L(j,"approved_docs",_),style:{alignItems:"center"},children:[r.jsx("label",{children:"Approved Documents (Up to 20)"}),r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"Drag files here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{type:"file",multiple:!0,hidden:!0,onChange:j=>I(j,"approved_docs")})]}),s.approved_docs&&s.approved_docs.length>0&&r.jsx("div",{className:"selected-files-list",children:s.approved_docs.map((j,N)=>r.jsxs("div",{className:"selected-file-item",children:[r.jsx("span",{className:"file-name-hint",children:j.name}),r.jsx("button",{type:"button",onClick:()=>P(N),className:"remove-file-btn",children:"✕"})]},N))})]})]})]}),r.jsx("div",{className:"form-actions",children:r.jsx("button",{type:"submit",className:"submit-btn",disabled:i,children:i?"Creating Order...":"Initialize Order"})})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .order-creation-container {
          padding: 24px;
          max-width: 900px;
          margin: 0 auto;
        }
        .form-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }
        .form-title { margin: 0 0 8px 0; color: var(--text); font-size: 24px; }
        .form-subtitle { color: var(--text3); font-size: 14px; margin-bottom: 32px; }
        
        .order-form { display: flex; flex-direction: column; gap: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .full-width { grid-column: span 2; }
        
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { color: var(--text2); font-size: 13px; font-weight: 500; }
        .form-group input, .form-group textarea {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
          color: var(--text);
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--blue);
          outline: none;
        }
        .form-group textarea { min-height: 80px; resize: vertical; }
        
        .file-upload-section {
          margin-top: 16px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }
        .section-title { font-size: 16px; color: var(--text); margin-bottom: 16px; }
        .file-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        
        .file-input-wrapper { 
          display: flex; flex-direction: column; gap: 12px;
          background: var(--bg3); border: 1px dashed var(--border2); border-radius: 12px; padding: 20px;
          align-items: center; justify-content: center; text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .file-input-wrapper:hover { border-color: var(--blue); background: var(--bg4); }
        .file-input-wrapper.dragging {
          border-color: var(--blue) !important;
          background: var(--blue-dim) !important;
        }
        .file-input-wrapper label { color: var(--text2); font-size: 13px; font-weight: 600; }
        .file-input-wrapper input[type="file"] {
          font-size: 12px; color: var(--text3); max-width: 100%;
        }
        .file-name-hint { font-size: 12px; color: var(--blue); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;}
        
        .selected-files-list {
          display: flex; flex-direction: column; gap: 4px; width: 100%;
          max-height: 120px; overflow-y: auto; padding-right: 4px; margin-top: 8px;
        }
        .selected-file-item {
          display: flex; justify-content: space-between; align-items: center;
          background: var(--bg4); padding: 4px 8px; border-radius: 4px;
        }
        .remove-file-btn {
          background: transparent; border: none; color: var(--red); cursor: pointer; font-size: 12px; padding: 2px 6px;
        }
        .remove-file-btn:hover { opacity: 0.8; }
        
        .form-actions { margin-top: 16px; display: flex; justify-content: flex-end; }
        .submit-btn {
          background: var(--blue);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.1s, background 0.2s;
        }
        .submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .line-item-grid-1 {
          display: grid;
          grid-template-columns: 100px 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .line-item-grid-2 {
          display: grid;
          grid-template-columns: 100px 100px 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
          .form-card {
            padding: 20px;
          }
          .line-item-grid-1, .line-item-grid-2 {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}})]})}function Rp({onImportComplete:e}){var f,c,k,I;const[t,n]=p.useState(null),[a,o]=p.useState(!1),[s,l]=p.useState(!1),[i,d]=p.useState(null),u=p.useRef(null),v=localStorage.getItem("token"),m=D=>{D.preventDefault(),o(!0)},b=()=>o(!1),w=D=>{D.preventDefault(),o(!1);const C=D.dataTransfer.files[0];C&&_(C)},_=D=>{if(!D.name.match(/\.xlsx$/i)){alert("Only .xlsx files are supported. Please use the sample template.");return}n(D),d(null)},S=async()=>{if(t){l(!0),d(null);try{const D=new FormData;D.append("file",t);const L=await(await fetch(window.API_BASE+"/api/orders/import",{method:"POST",headers:{Authorization:`Bearer ${v}`},body:D})).json();if(L.error){d({message:L.error,created:[],errors:[]});return}d(L),L.created&&L.created.length>0}catch{d({message:"Network error — could not reach the server. Is Docker running?",created:[],errors:[]})}finally{l(!1)}}},z=D=>{D.preventDefault(),window.location.href=window.API_BASE+"/api/template/order_import_template.xlsx"},x=()=>{n(null),d(null),u.current&&(u.current.value="")};return r.jsxs("div",{className:"oi-container",children:[r.jsxs("div",{className:"oi-card",children:[r.jsxs("div",{className:"oi-header",children:[r.jsxs("div",{children:[r.jsx("h2",{className:"oi-title",children:"Bulk Order Import"}),r.jsxs("p",{className:"oi-subtitle",children:["Upload a filled Excel template to create multiple orders automatically. Each unique ",r.jsx("code",{children:"po_number"})," becomes one order."]})]}),r.jsx("a",{href:"#",onClick:z,className:"oi-download-btn",title:"Download the sample template",children:"Download Template"})]}),!i&&r.jsxs("div",{className:`oi-dropzone${a?" oi-dragging":""}${t?" oi-has-file":""}`,onDragOver:m,onDragLeave:b,onDrop:w,onClick:()=>{var D;return!t&&((D=u.current)==null?void 0:D.click())},children:[r.jsx("input",{ref:u,type:"file",accept:".xlsx",hidden:!0,onChange:D=>D.target.files[0]&&_(D.target.files[0])}),t?r.jsxs("div",{className:"oi-file-preview",children:[r.jsx("span",{className:"oi-file-icon"}),r.jsxs("div",{className:"oi-file-info",children:[r.jsx("span",{className:"oi-file-name",children:t.name}),r.jsxs("span",{className:"oi-file-size",children:[(t.size/1024).toFixed(1)," KB"]})]}),r.jsx("button",{className:"oi-clear-btn",onClick:D=>{D.stopPropagation(),x()},title:"Remove",children:"✕"})]}):r.jsxs("div",{className:"oi-drop-prompt",children:[r.jsx("div",{className:"oi-drop-icon"}),r.jsxs("div",{className:"oi-drop-text",children:["Drag & drop your ",r.jsx("strong",{children:".xlsx"})," file here"]}),r.jsx("div",{className:"oi-drop-sub",children:"or click to browse"})]})]}),!i&&r.jsx("div",{className:"oi-actions",children:r.jsx("button",{className:"oi-upload-btn",disabled:!t||s,onClick:S,children:s?r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"oi-spinner"})," Processing..."]}):"Import Orders"})}),!i&&r.jsxs("div",{className:"oi-instructions",children:[r.jsx("h3",{className:"oi-inst-title",children:"How to use"}),r.jsxs("ol",{className:"oi-inst-list",children:[r.jsx("li",{children:"Download the template using the button above."}),r.jsxs("li",{children:["Open the ",r.jsx("strong",{children:'"Import Template"'})," sheet and fill in your data."]}),r.jsxs("li",{children:["Each row = one line item. Rows with the same ",r.jsx("code",{children:"po_number"})," are grouped into one order."]}),r.jsxs("li",{children:["Company name & city must match entries in ",r.jsx("strong",{children:"Masters → Companies"}),"."]}),r.jsxs("li",{children:["Dates must be in ",r.jsx("strong",{children:"YYYY-MM-DD"})," format or a proper Excel date."]}),r.jsxs("li",{children:["Save as ",r.jsx("code",{children:".xlsx"})," and upload here."]})]}),r.jsxs("div",{className:"oi-field-ref",children:[r.jsx("h4",{children:"Required Fields"}),r.jsx("div",{className:"oi-field-grid",children:[{f:"company_name",r:!0,note:"Exact match in Masters"},{f:"company_city",r:!0,note:"Exact match in Masters"},{f:"order_date",r:!0,note:"YYYY-MM-DD"},{f:"delivery_date",r:!0,note:"YYYY-MM-DD"},{f:"po_number",r:!0,note:"Groups rows into one order"},{f:"priority",r:!0,note:"Low / Medium / High / Urgent"},{f:"material_description",r:!0,note:"Per line item"},{f:"quantity",r:!0,note:"Positive integer"},{f:"unit",r:!0,note:"e.g. Nos, Sets"},{f:"unit_price",r:!0,note:"Numeric, no ₹"},{f:"packaging_type",r:!1,note:"Wooden Packaging / Foam Packaging"},{f:"end_client_name",r:!1,note:"Optional end client name / site location"},{f:"order_notes",r:!1,note:"Optional"},{f:"part_number",r:!1,note:"Optional"},{f:"panel_type_size",r:!1,note:"e.g. 800x600"},{f:"line_item_delivery_date",r:!1,note:"Defaults to delivery_date"},{f:"line_item_notes",r:!1,note:"Optional"}].map(({f:D,r:C,note:L})=>r.jsxs("div",{className:"oi-field-row",children:[r.jsx("code",{className:"oi-field-name",children:D}),r.jsx("span",{className:`oi-badge ${C?"req":"opt"}`,children:C?"Required":"Optional"}),r.jsx("span",{className:"oi-field-note",children:L})]},D))})]})]}),i&&r.jsxs("div",{className:"oi-result",children:[r.jsx("p",{className:`oi-result-msg ${((f=i.created)==null?void 0:f.length)>0?"success":"fail"}`,children:i.message}),((c=i.created)==null?void 0:c.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{children:"Created & Merged Orders"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Order Number"}),r.jsx("th",{children:"Units Added"}),r.jsx("th",{children:"Action Taken"})]})}),r.jsx("tbody",{children:i.created.map((D,C)=>r.jsxs("tr",{children:[r.jsx("td",{children:D.po_number}),r.jsx("td",{children:r.jsx("strong",{style:{color:"#60a5fa"},children:D.order_number})}),r.jsx("td",{children:D.units}),r.jsx("td",{children:r.jsx("span",{style:{background:D.is_appended?"#1e3a8a":"#064e3b",color:D.is_appended?"#60a5fa":"#34d399",fontSize:"11px",fontWeight:"bold",padding:"3px 8px",borderRadius:"4px",display:"inline-block"},children:D.is_appended?"Merged (Appended)":"Created (New)"})})]},C))})]})]}),((k=i.errors)==null?void 0:k.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{style:{color:"#f87171"},children:"Errors"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Reason"})]})}),r.jsx("tbody",{children:i.errors.map((D,C)=>r.jsxs("tr",{children:[r.jsx("td",{children:D.po_number}),r.jsx("td",{style:{color:"#f87171"},children:D.error})]},C))})]})]}),r.jsxs("div",{style:{display:"flex",gap:12,marginTop:20},children:[r.jsx("button",{className:"oi-upload-btn",onClick:x,children:"Import Another File"}),((I=i.created)==null?void 0:I.length)>0&&r.jsx("button",{className:"oi-upload-btn",style:{background:"#10b981"},onClick:()=>e==null?void 0:e(),children:"View Orders →"})]})]})]}),r.jsx("style",{children:`
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
      `})]})}function rh({isOpen:e,onClose:t,onImportComplete:n}){return p.useEffect(()=>{if(!e)return;const a=o=>{o.key==="Escape"&&t()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[e,t]),e?r.jsxs("div",{className:"bim-overlay",onClick:a=>{a.target===a.currentTarget&&t()},children:[r.jsxs("div",{className:"bim-modal",children:[r.jsxs("div",{className:"bim-modal-header",children:[r.jsx("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:r.jsx("span",{style:{fontWeight:"700",fontSize:"16px",color:"var(--text)"},children:"Bulk Order Import"})}),r.jsx("button",{className:"bim-close",onClick:t,title:"Close (Esc)",children:"✕"})]}),r.jsx("div",{className:"bim-body",children:r.jsx(Rp,{onImportComplete:()=>{n==null||n(),t()}})})]}),r.jsx("style",{children:`
        .bim-overlay {
          position: fixed;
          inset: 0;
          z-index: 1200;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: bim-fade-in 0.15s ease;
        }
        @keyframes bim-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .bim-modal {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 18px;
          width: 100%;
          max-width: 860px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 80px rgba(0,0,0,0.45);
          animation: bim-slide-up 0.2s ease;
          overflow: hidden;
        }
        @keyframes bim-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .bim-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--bg3);
          border-radius: 18px 18px 0 0;
          flex-shrink: 0;
        }

        .bim-close {
          background: transparent;
          border: none;
          color: var(--text3);
          font-size: 16px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .bim-close:hover {
          background: var(--bg4);
          color: var(--red);
        }

        .bim-body {
          overflow-y: auto;
          flex: 1;
          /* Override oi-container/oi-card for modal context */
        }

        /* ── Override OrderImport card styles inside the modal ── */
        .bim-body .oi-container {
          padding: 20px 24px;
          max-width: 100%;
          margin: 0;
        }
        .bim-body .oi-card {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 0;
          box-shadow: none;
        }
        .bim-body .oi-title  { color: var(--text);  }
        .bim-body .oi-subtitle { color: var(--text3); }
        .bim-body .oi-subtitle code { background: var(--bg4); color: var(--blue); }
        .bim-body .oi-download-btn {
          background: var(--blue-dim);
          color: var(--blue);
          border-color: var(--blue);
          opacity: 0.9;
        }
        .bim-body .oi-download-btn:hover { opacity: 1; }
        .bim-body .oi-dropzone {
          border-color: var(--border2);
          background: var(--bg3);
        }
        .bim-body .oi-dropzone:hover { border-color: var(--blue); background: var(--bg4); }
        .bim-body .oi-dragging  { border-color: var(--blue) !important; background: var(--bg4) !important; }
        .bim-body .oi-has-file  { border-color: var(--green) !important; background: var(--bg3) !important; }
        .bim-body .oi-drop-text { color: var(--text2); }
        .bim-body .oi-drop-sub  { color: var(--text3); }
        .bim-body .oi-file-name { color: var(--text); }
        .bim-body .oi-file-size { color: var(--text3); }
        .bim-body .oi-instructions { border-top-color: var(--border); }
        .bim-body .oi-inst-title { color: var(--text); }
        .bim-body .oi-inst-list { color: var(--text2); }
        .bim-body .oi-inst-list strong { color: var(--text); }
        .bim-body .oi-inst-list code { background: var(--bg4); color: var(--blue); }
        .bim-body .oi-field-ref h4 { color: var(--text); }
        .bim-body .oi-field-row { background: var(--bg3); }
        .bim-body .oi-field-name { color: var(--blue); }
        .bim-body .oi-field-note { color: var(--text3); }
        .bim-body .oi-result { border-top-color: var(--border); }
        .bim-body .oi-result-section h4 { color: var(--text); }
        .bim-body .oi-result-table th { color: var(--text3); border-bottom-color: var(--border); }
        .bim-body .oi-result-table td { color: var(--text2); border-bottom-color: var(--border); }
      `})]}):null}function nh({initialSelectedId:e}){var _n,_a,Na,Ca,za,_r,Lt,gt,Zt,Nn;const[t,n]=p.useState([]),[a,o]=p.useState(null),[s,l]=p.useState(null),[i,d]=p.useState("created_at"),[u,v]=p.useState(!0),[m,b]=p.useState("inprogress"),w=localStorage.getItem("token"),[_,S]=p.useState([]),[z,x]=p.useState([]),[f,c]=p.useState(null),k=JSON.parse(localStorage.getItem("user")||"{}"),[I,D]=p.useState(null),[C,L]=p.useState(""),[P,h]=p.useState("done"),[T,j]=p.useState(!1),[N,B]=p.useState(!1),[A,V]=p.useState(null),[U,R]=p.useState({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard"}),[J,Y]=p.useState([]),[E,M]=p.useState(!1),[Z,le]=p.useState(null),[xe,se]=p.useState({material_description:"",part_number:"",panel_type_size:"",quantity:"",unit:"Nos",unit_price:"",delivery_date:"",notes:""}),[ve,O]=p.useState(!1),re=async()=>{try{const y=await fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${w}`}});y.ok&&Y(await y.json())}catch(y){console.error("Fetch companies error:",y)}},Q=y=>{R({company_location_id:y.company_location_id||"",order_date:y.order_date?y.order_date.split("T")[0]:"",delivery_date:y.delivery_date?y.delivery_date.split("T")[0]:"",notes:y.notes||"",priority:y.priority||"Medium",po_number:y.po_number||"",packaging_type:y.packaging_type||"",end_client_name:y.end_client_name||"",gst_number:y.gst_number||"",reference_number:y.reference_number||"",classification:y.classification||"Standard"}),V(y),re()},ge=async y=>{y.preventDefault(),M(!0);try{const X=await fetch(`${window.API_BASE}/api/orders/${A.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify(U)});if(X.ok)alert("Order amended successfully!"),V(null),await rt(a.id),await xt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const oe=await X.json();alert(oe.error||"Failed to amend order.")}}catch(X){console.error(X),alert("Network error, please try again.")}finally{M(!1)}},ie=async y=>{if(window.confirm("Are you sure you want to delete this order? This will permanently delete the order, all its line items, all unit serial numbers, steps, and resequence all remaining orders!"))try{const X=await fetch(`${window.API_BASE}/api/orders/${y}`,{method:"DELETE",headers:{Authorization:`Bearer ${w}`}});if(X.ok)alert("Order deleted and remaining orders resequenced successfully!"),o(null),await xt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:null}}));else{const oe=await X.json();alert(oe.error||"Failed to delete order.")}}catch(X){console.error(X),alert("Network error, please try again.")}},F=y=>{se({material_description:y.material_description||"",part_number:y.part_number||"",panel_type_size:y.panel_type_size||"",quantity:y.quantity||"",unit:y.unit||"Nos",unit_price:y.unit_price||"",delivery_date:y.delivery_date?y.delivery_date.split("T")[0]:"",notes:y.notes||""}),le(y)},je=async y=>{y.preventDefault(),O(!0);try{const X=await fetch(`${window.API_BASE}/api/orders/${a.id}/line-items/${Z.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify(xe)});if(X.ok)le(null),await rt(a.id);else{const oe=await X.json();alert(oe.error||"Failed to amend line item.")}}catch(X){console.error(X),alert("Network error, please try again.")}finally{O(!1)}},Pe=(y,X)=>{se(oe=>({...oe,[y]:X}))},fe=async y=>{try{const X=await fetch(`${window.API_BASE}/api/orders/${a.id}/hold/${y}`,{method:"POST",headers:{Authorization:`Bearer ${w}`}});if(X.ok)await rt(a.id),await xt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const oe=await X.json();alert(oe.error||"Failed to update hold status")}}catch(X){console.error(X),alert("Network error updating hold status")}},it=["admin","manager","sales"].includes((_n=k.role)==null?void 0:_n.toLowerCase()),q=async y=>{if(y.preventDefault(),!(!C||!P)){j(!0);try{const X=await fetch(`${window.API_BASE}/api/planning/line-items/${I.id}/bulk-units-status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify({dept:C,status:P})});if(X.ok)alert(`Successfully updated all ${C} steps to ${P} for this batch.`),D(null),await rt(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const oe=await X.json();alert(oe.error||"Failed to bulk update units.")}}catch(X){console.error(X),alert("Network error, please try again.")}finally{j(!1)}}};p.useEffect(()=>{xt(),G();const y=X=>{xt(),X.detail&&X.detail.orderId&&o(oe=>(oe&&oe.id===X.detail.orderId&&rt(X.detail.orderId),oe))};return window.addEventListener("orderUpdated",y),()=>window.removeEventListener("orderUpdated",y)},[]),p.useEffect(()=>{s?Te(s.id):(S([]),c(null))},[s]);const G=async()=>{try{const y=await fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${w}`}});y.ok&&x(await y.json())}catch(y){console.error("Fetch users error:",y)}},Te=async y=>{try{const X=await fetch(`${window.API_BASE}/api/units/${y}/steps`,{headers:{Authorization:`Bearer ${w}`}});X.ok&&S(await X.json())}catch(X){console.error("Fetch unit steps error:",X)}},$t=async(y,X)=>{try{(await fetch(`${window.API_BASE}/api/units/${s.id}/steps/${y}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify(X)})).ok&&(await Te(s.id),await rt(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}})))}catch(oe){console.error("Update unit step error:",oe)}};p.useEffect(()=>{e&&t.length>0&&rt(e)},[e,t]);const xt=async()=>{try{const y=await fetch(window.API_BASE+"/api/orders",{headers:{Authorization:`Bearer ${w}`}});if(y.ok){const X=await y.json();n(X)}}catch(y){console.error("Fetch error:",y)}finally{v(!1)}},rt=async y=>{var X;try{const oe=await fetch(`${window.API_BASE}/api/orders/${y}`,{headers:{Authorization:`Bearer ${w}`}});if(oe.ok){const Ee=await oe.json();if(o(Ee),s){const Ve=(X=Ee.units)==null?void 0:X.find(He=>He.id===s.id);Ve&&l(Ve)}}}catch(oe){console.error("Fetch details error:",oe)}},wn=y=>{if(!y||y.length===0)return 0;const X={Pending:0,Design:15,"Material Waiting":30,Production:55,"QC Testing":75,"QC Passed":90,"Ready for Dispatch":95,Dispatched:100,Delivered:100,Rework:40,"QC Failed":60};let oe=0;return y.forEach(Ee=>{oe+=X[Ee.status]||0}),Math.round(oe/y.length)};if(u)return r.jsx("div",{className:"loading",children:"Loading orders..."});const kt=y=>parseInt(y.unit_count)>0&&parseInt(y.dispatched_unit_count)>=parseInt(y.unit_count),kn=t.filter(y=>!kt(y)),Be=t.filter(y=>kt(y)),Sn=m==="completed"?Be:kn;return kn.reduce((y,X)=>y+parseInt(X.line_item_count||0),0),Be.reduce((y,X)=>y+parseInt(X.line_item_count||0),0),r.jsxs("div",{className:"order-list-container",children:[r.jsxs("div",{className:"orders-sidebar",children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("h3",{className:"sidebar-title",style:{margin:0},children:"Orders"}),r.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"center"},children:[it&&r.jsx("button",{onClick:()=>B(!0),title:"Bulk Import Orders from Excel",style:{background:"var(--blue-dim)",border:"1px solid var(--blue)",color:"var(--blue)",borderRadius:"6px",padding:"3px 9px",fontSize:"11px",fontWeight:"600",cursor:"pointer",display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap",transition:"opacity 0.15s"},onMouseOver:y=>y.currentTarget.style.opacity="0.8",onMouseOut:y=>y.currentTarget.style.opacity="1",children:"Import"}),r.jsxs("select",{value:i,onChange:y=>d(y.target.value),className:"form-select",style:{padding:"2px 8px",fontSize:"11px",width:"auto"},children:[r.jsx("option",{value:"created_at",children:"Created Date"}),r.jsx("option",{value:"order_date",children:"Order Date"}),r.jsx("option",{value:"delivery_date",children:"Delivery Date"}),r.jsx("option",{value:"po_number",children:"PO Number"})]})]})]}),r.jsxs("div",{style:{display:"flex",gap:"4px",marginBottom:"12px",background:"var(--bg4)",borderRadius:"8px",padding:"4px",border:"1px solid var(--border)"},children:[r.jsxs("button",{onClick:()=>b("inprogress"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:m==="inprogress"?"var(--blue)":"transparent",color:m==="inprogress"?"#fff":"var(--text3)"},children:["In Progress ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",kn.length,")"]})]}),r.jsxs("button",{onClick:()=>b("completed"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:m==="completed"?"var(--green)":"transparent",color:m==="completed"?"#fff":"var(--text3)"},children:["Completed ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",Be.length,")"]})]})]}),r.jsxs("div",{className:"order-items",children:[Sn.length===0&&r.jsx("div",{style:{color:"var(--text3)",fontSize:"13px",textAlign:"center",padding:"32px 16px",fontStyle:"italic"},children:m==="completed"?"No completed orders yet.":"No in-progress orders."}),Sn.map(y=>r.jsxs("div",{className:`order-card ${(a==null?void 0:a.id)===y.id?"active":""}`,onClick:()=>rt(y.id),children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"},children:[r.jsx("div",{className:"order-num",style:{margin:0},children:y.order_number}),m==="completed"?r.jsx("span",{style:{background:"rgba(16,185,129,0.15)",color:"#34d399",border:"1px solid rgba(16,185,129,0.3)",borderRadius:"20px",padding:"2px 8px",fontSize:"10px",fontWeight:"700"},children:"✓ DONE"}):y.priority&&r.jsx("span",{className:`priority-badge ${y.priority.toLowerCase()}`,children:y.priority})]}),r.jsxs("div",{className:"order-meta",children:[r.jsxs("span",{children:[y.unit_count," Units"]})," •",r.jsx("span",{children:i==="created_at"?new Date(y.created_at).toLocaleDateString():i==="order_date"?y.order_date?new Date(y.order_date).toLocaleDateString():"No Order Date":i==="delivery_date"?y.delivery_date?new Date(y.delivery_date).toLocaleDateString():"No Delivery Date":i==="po_number"?y.po_number||"No PO Number":""})]}),y.company_name&&r.jsxs("div",{className:"order-company",children:[y.company_name," - ",y.company_city]})]},y.id))]})]}),r.jsx("div",{className:"order-details-pane",children:a?r.jsxs("div",{className:"details-content",children:[r.jsxs("div",{className:"details-header",children:[r.jsxs("div",{children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"},children:[r.jsx("h2",{style:{margin:0},children:a.order_number}),["admin","manager","sales"].includes((_a=k.role)==null?void 0:_a.toLowerCase())&&r.jsx("button",{className:"vbtn",style:{padding:"4px 12px",fontSize:"12px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>Q(a),children:"Amend Order"}),((Na=k.role)==null?void 0:Na.toLowerCase())==="admin"&&r.jsx("button",{className:"vbtn",style:{padding:"4px 12px",fontSize:"12px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>ie(a.id),children:"Delete Order"}),a.hold_status==="Requested"&&r.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsx("span",{style:{fontSize:"11px",background:"rgba(245, 158, 11, 0.15)",color:"#f59e0b",padding:"4px 8px",borderRadius:"4px",fontWeight:"600"},children:"Hold Requested"}),["admin","manager"].includes((Ca=k.role)==null?void 0:Ca.toLowerCase())&&r.jsxs(r.Fragment,{children:[r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#10b981",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>fe("approve"),children:"Approve Hold"}),r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>fe("reject"),children:"Reject"})]})]}),a.hold_status==="Approved"&&r.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsx("span",{style:{fontSize:"11px",background:"rgba(239, 68, 68, 0.15)",color:"#ef4444",padding:"4px 8px",borderRadius:"4px",fontWeight:"700",textTransform:"uppercase"},children:"ON HOLD"}),["admin","manager","sales"].includes((za=k.role)==null?void 0:za.toLowerCase())&&r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>fe("resume"),children:"Resume Order"})]}),(a.hold_status==="None"||!a.hold_status)&&["admin","manager","sales"].includes((_r=k.role)==null?void 0:_r.toLowerCase())&&r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#f59e0b",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>fe("request"),children:"Request Hold"})]}),a.company_name&&r.jsxs("div",{className:"order-company-lg",style:{marginTop:"4px"},children:[a.company_name," (",a.company_city,")"]})]}),r.jsxs("div",{className:"creator-info",children:["Created by: ",a.creator_name||"System"]})]}),a.hold_status==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.25)",borderRadius:"8px",padding:"12px 16px",marginBottom:"20px",color:"#ef4444",fontWeight:"500",fontSize:"13px"},children:[r.jsx("strong",{children:"ORDER IS CURRENTLY ON HOLD"})," — All production updates, step changes, and document uploads for this order and its units are currently locked."]}),r.jsxs("div",{className:"order-progress-container",children:[r.jsxs("div",{className:"progress-labels",children:[r.jsx("span",{children:"Order Progress"}),r.jsxs("span",{children:[wn(a.units),"%"]})]}),r.jsx("div",{className:"progress-bar-bg",children:r.jsx("div",{className:"progress-bar-fill",style:{width:`${wn(a.units)}%`}})})]}),r.jsxs("div",{className:"details-grid",style:{gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:"20px"},children:[r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Priority"}),r.jsx("div",{className:"val",children:r.jsx("span",{className:`priority-badge ${((Lt=a.priority)==null?void 0:Lt.toLowerCase())||"medium"}`,children:a.priority||"Medium"})})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Order Date"}),r.jsx("div",{className:"val",children:a.order_date?new Date(a.order_date).toLocaleDateString("en-IN"):"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Delivery Date"}),r.jsx("div",{className:"val",children:a.delivery_date?new Date(a.delivery_date).toLocaleDateString("en-IN"):"TBD"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"PO Number"}),r.jsx("div",{className:"val",children:a.po_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Cust. Ref #"}),r.jsx("div",{className:"val",children:a.reference_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Classification"}),r.jsx("div",{className:"val",style:{fontWeight:"600",color:a.classification==="Non-Standard"?"var(--blue)":"var(--text2)"},children:a.classification||"Standard"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"End Client"}),r.jsx("div",{className:"val",children:a.end_client_name||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"GST Number"}),r.jsx("div",{className:"val",children:a.gst_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Packaging"}),r.jsx("div",{className:"val",children:a.packaging_type||"N/A"})]}),r.jsxs("div",{className:"detail-box",style:{gridColumn:"1 / -1"},children:[r.jsx("label",{children:"Notes"}),r.jsx("div",{className:"val",style:{whiteSpace:"pre-wrap"},children:a.notes||"No notes"})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"24px"},children:[r.jsx("h3",{children:"Line Items & Units"}),(gt=a.line_items)==null?void 0:gt.map(y=>{var oe,Ee,Ve;const X=((oe=a.units)==null?void 0:oe.filter(He=>He.line_item_id===y.id))||[];return r.jsxs("div",{style:{background:"var(--bg3)",borderRadius:"8px",padding:"16px",marginBottom:"16px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",borderBottom:"1px solid var(--border2)",paddingBottom:"8px"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[r.jsx("strong",{children:y.line_item_number}),": ",y.material_description," ",y.part_number?`(${y.part_number})`:"",["admin","manager","production","sales","design","purchase","stores","qc","dispatch","accounts","planning"].includes((Ee=k.role)==null?void 0:Ee.toLowerCase())&&r.jsx("button",{className:"vbtn",style:{padding:"2px 8px",fontSize:"10px",background:"#2563eb",border:"none",borderRadius:"4px",cursor:"pointer",display:"inline-flex",alignItems:"center",height:"22px"},onClick:()=>{if(a.hold_status==="Approved"){alert("Order is currently on hold. Updates are disabled.");return}L(""),h("done"),D(y)},children:"Bulk Update Batch"}),["admin","manager","sales"].includes((Ve=k.role)==null?void 0:Ve.toLowerCase())&&r.jsx("button",{className:"vbtn",title:"Amend Line Item",style:{padding:"2px 8px",fontSize:"10px",background:"#7c3aed",border:"none",borderRadius:"4px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px",height:"22px"},onClick:()=>{if(a.hold_status==="Approved"){alert("Order is currently on hold. Amendments are disabled.");return}F(y)},children:"Amend"})]}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:"13px"},children:[y.quantity," ",y.unit||"Nos"," @ ₹",y.unit_price]})]}),r.jsxs("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap",fontSize:"12px",color:"var(--text2)",marginBottom:"12px",background:"var(--bg2)",padding:"8px 12px",borderRadius:"6px",border:"1px solid var(--border)"},children:[r.jsxs("div",{children:[r.jsx("strong",{style:{color:"var(--text3)"},children:"Status:"})," ",r.jsx("span",{style:{color:y.status==="Completed"?"#10b981":"#60a5fa",fontWeight:"600"},children:y.status||"Not Started"})]}),y.qc_status&&r.jsxs("div",{children:[r.jsx("strong",{style:{color:"var(--text3)"},children:"QC:"})," ",r.jsx("span",{style:{color:y.qc_status==="Pass"?"#10b981":y.qc_status==="Fail"?"#ef4444":"#f59e0b",fontWeight:"600"},children:y.qc_status})]}),y.planned_dispatch_date&&r.jsxs("div",{children:[r.jsx("strong",{style:{color:"var(--text3)"},children:"Dispatch Date:"})," ",new Date(y.planned_dispatch_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})]}),y.wiring_expected_date&&r.jsxs("div",{children:[r.jsx("strong",{style:{color:"var(--text3)"},children:"Wiring Exp:"})," ",new Date(y.wiring_expected_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})]}),y.qc_date&&r.jsxs("div",{children:[r.jsx("strong",{style:{color:"var(--text3)"},children:"QC Date:"})," ",new Date(y.qc_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})]})]}),r.jsx("div",{className:"units-grid",children:X.map(He=>r.jsxs("div",{className:"unit-badge interactive",onClick:()=>l(He),children:[r.jsx("span",{className:"u-id",children:He.short_serial}),r.jsx("span",{className:`u-status ${He.status.toLowerCase().replace(/\s+/g,"-")}`,children:He.status})]},He.id))})]},y.id)})]}),r.jsx(Ro,{entityType:"Order",entityId:a.id,initialDocs:((Zt=a.documents)==null?void 0:Zt.filter(y=>y.entity_type==="Order"))||[],userRole:k.role,readOnly:a.hold_status==="Approved"})]}):r.jsx("div",{className:"select-prompt",children:"Select an order from the list to view details and documents."})}),s&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&l(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Unit Tracking"}),r.jsxs("div",{className:"modal-sub",children:[s.unit_id," (",s.status,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>l(null),children:"✕"})]}),r.jsxs("div",{className:"modal-body",children:[(a==null?void 0:a.hold_status)==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.08)",border:"1px solid rgba(239, 68, 68, 0.15)",borderRadius:"6px",padding:"8px 12px",marginBottom:"12px",color:"#ef4444",fontSize:"11px",fontWeight:"500"},children:[r.jsx("strong",{children:"Order is on hold."})," Production flow step updates are locked until the hold is released."]}),r.jsxs("div",{style:{marginBottom:20},children:[r.jsx("h4",{style:{margin:"0 0 12px 0",color:"var(--text)",fontSize:"14px",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Production Steps"}),_.length===0?r.jsx("div",{style:{color:"var(--text3)",fontSize:"13px",fontStyle:"italic"},children:"Loading steps..."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[..._].sort((y,X)=>{var oe,Ee,Ve,He,er,tr,rr,ce,St;return["admin","manager"].includes((oe=k.role)==null?void 0:oe.toLowerCase())?0:((Ee=y.dept)==null?void 0:Ee.toLowerCase())===((Ve=k.role)==null?void 0:Ve.toLowerCase())&&((He=X.dept)==null?void 0:He.toLowerCase())!==((er=k.role)==null?void 0:er.toLowerCase())?-1:((tr=X.dept)==null?void 0:tr.toLowerCase())===((rr=k.role)==null?void 0:rr.toLowerCase())&&((ce=y.dept)==null?void 0:ce.toLowerCase())!==((St=k.role)==null?void 0:St.toLowerCase())?1:0}).map(y=>{var er,tr,rr;const X=f===y.id,oe=(["admin","manager"].includes((er=k.role)==null?void 0:er.toLowerCase())||((tr=y.dept)==null?void 0:tr.toLowerCase())===((rr=k.role)==null?void 0:rr.toLowerCase())||y.assigned_user_id===k.id)&&(a==null?void 0:a.hold_status)!=="Approved",Ee=z.find(ce=>ce.id===y.assigned_user_id);let Ve=[];try{Ve=Array.isArray(y.custom_fields)?y.custom_fields:JSON.parse(y.custom_fields||"[]")}catch{Ve=[]}const He=z.filter(ce=>{var St,Ut;return((St=ce.role)==null?void 0:St.toLowerCase())===((Ut=y.dept)==null?void 0:Ut.toLowerCase())});return r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"},onClick:()=>c(X?null:y.id),children:[r.jsxs("div",{children:[r.jsxs("div",{style:{fontWeight:"600",color:"var(--text)",fontSize:"13px"},children:[!oe&&r.jsx("span",{style:{color:"#60a5fa",marginRight:"6px",fontSize:"9px",textTransform:"uppercase",background:"rgba(59, 130, 246, 0.1)",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(59, 130, 246, 0.2)"},children:"View Only"}),y.name]}),r.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)",marginTop:"2px"},children:["Dept: ",r.jsx("span",{style:{color:"#60a5fa"},children:y.dept})," | Assigned: ",r.jsx("span",{style:{color:"#34d399"},children:Ee?Ee.username:"Unassigned"})]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[r.jsx("span",{className:`step-status-badge badge-${y.status}`,style:{fontSize:"9px",fontWeight:"bold"},children:y.status}),r.jsx("span",{style:{fontSize:"10px",color:"var(--text3)"},children:X?"▲":"▼"})]})]}),X&&r.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px dashed var(--border2)"},children:[!oe&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.08)",border:"1px solid rgba(59, 130, 246, 0.15)",borderRadius:"6px",padding:"8px 12px",marginBottom:"12px",color:"#60a5fa",fontSize:"11px"},children:[r.jsx("strong",{children:"View-Only Mode"})," — managed by the ",r.jsx("strong",{children:y.dept})," department."]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Step Status"}),oe?r.jsxs("select",{className:"form-select",value:y.status,onChange:ce=>$t(y.id,{status:ce.target.value}),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"2px"},children:r.jsx("span",{className:`step-status-badge ${(Je[y.status]||Je.pending).cls}`,style:{fontSize:"11px",padding:"3px 8px",fontWeight:"bold"},children:(Je[y.status]||Je.pending).label})})]}),r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Assign Worker"}),oe?r.jsxs("select",{className:"form-select",value:y.assigned_user_id||"",onChange:ce=>$t(y.id,{assigned_user_id:ce.target.value?parseInt(ce.target.value):null}),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),He.map(ce=>r.jsx("option",{value:ce.id,children:ce.username},ce.id))]}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text)",background:"var(--bg3)",padding:"6px 10px",borderRadius:"6px"},children:Ee?Ee.username:"Unassigned"})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Notes"}),oe?r.jsx("textarea",{className:"form-input",defaultValue:y.notes||"",onBlur:ce=>$t(y.id,{notes:ce.target.value}),placeholder:"Add step notes...",style:{fontSize:"12px",height:"50px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px",whiteSpace:"pre-wrap"},children:y.notes||"No notes added."})]}),Ve.length>0&&r.jsxs("div",{style:{marginBottom:"12px",padding:"10px",background:"var(--bg3)",borderRadius:"6px",border:"1px solid var(--border)"},children:[r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",fontWeight:"bold",marginBottom:"8px",textTransform:"uppercase"},children:"Custom Fields"}),Ve.map((ce,St)=>{var g;const Ut=$=>{const ne=[...Ve];ne[St].value=$,$t(y.id,{custom_fields:ne})};return r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text2)",display:"block",marginBottom:"2px"},children:ce.label}),oe?ce.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!ce.value,onChange:$=>Ut($.target.checked)}):ce.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:ce.value||"",onChange:$=>Ut($.target.value),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(g=ce.options)==null?void 0:g.map($=>r.jsx("option",{value:$,children:$},$))]}):r.jsx("input",{type:ce.type==="Number"?"number":"text",className:"form-input",defaultValue:ce.value||"",onBlur:$=>Ut($.target.value),style:{fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text)",fontWeight:"500",marginTop:"2px"},children:ce.type==="Yes/No"?ce.value==="Yes"||ce.value===!0?"Yes":"No":ce.value||"—"})]},ce.id)})]})]})]},y.id)})})]}),r.jsx("div",{style:{marginTop:24,borderTop:"1px solid var(--border)",paddingTop:"16px"},children:r.jsx(Ro,{entityType:"Unit",entityId:s.id,initialDocs:((Nn=a.documents)==null?void 0:Nn.filter(y=>y.entity_type==="Unit"&&y.entity_id===s.id))||[],onUploadSuccess:()=>rt(a.id),userRole:k.role,readOnly:a.hold_status==="Approved"})})]})]})}),I&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&D(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"400px",width:"90%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Update Batch Units"}),r.jsxs("div",{className:"modal-sub",children:["Line Item: ",I.line_item_number," (",I.quantity," units)"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>D(null),children:"✕"})]}),r.jsxs("form",{onSubmit:q,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{style:{display:"block",color:"var(--text2)",fontSize:"13px",marginBottom:"6px"},children:"Target Department Task"}),r.jsxs("select",{className:"form-select",value:C,onChange:y=>L(y.target.value),style:{width:"100%",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"",children:"-- Select Department --"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"})]})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"20px"},children:[r.jsx("label",{style:{display:"block",color:"var(--text2)",fontSize:"13px",marginBottom:"6px"},children:"Set Task Status to"}),r.jsxs("select",{className:"form-select",value:P,onChange:y=>h(y.target.value),style:{width:"100%",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"flex-end",gap:"10px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>D(null),disabled:T,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:T,style:{background:"#3b82f6",border:"none",color:"#fff",borderRadius:"6px",padding:"8px 16px",cursor:"pointer",fontWeight:"600"},children:T?"Updating...":"Update All Units"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .order-list-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          height: calc(100vh - 200px);
        }
        @media (max-width: 1024px) {
          .order-list-container {
            grid-template-columns: 1fr;
            height: auto;
            gap: 16px;
          }
          .orders-sidebar {
            max-height: 250px;
          }
        }
        .orders-sidebar {
          background: var(--bg2);
          border-radius: 12px;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sidebar-title { padding: 16px; border-bottom: 1px solid var(--border); margin: 0; font-size: 16px; color: var(--text); }
        .order-items { overflow-y: auto; flex: 1; }
        .order-card {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.2s;
        }
        .order-card:hover { background: var(--bg3); }
        .order-card.active { background: var(--bg3); border-left: 3px solid var(--blue); }
        .order-num { color: var(--text); font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .order-meta { color: var(--text3); font-size: 12px; }
        .order-company { color: var(--text3); font-size: 11px; margin-top: 6px; }
        .order-company-lg { color: var(--text2); font-size: 14px; margin-top: 4px; }
        
        .order-details-pane {
          background: var(--bg2);
          border-radius: 12px;
          border: 1px solid var(--border);
          padding: 24px;
          overflow-y: auto;
        }
        .details-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
        .details-header h2 { margin: 0; color: var(--text); }
        .creator-info { color: var(--text3); font-size: 13px; }
        
        .order-progress-container { margin-bottom: 24px; }
        .progress-labels { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; color: var(--text2); text-transform: uppercase; font-weight: 600; }
        .progress-bar-bg { background: var(--border2); border-radius: 6px; height: 8px; overflow: hidden; width: 100%; }
        .progress-bar-fill { background: var(--teal); height: 100%; transition: width 0.4s ease-out; }
        
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
        .detail-box label { color: var(--text3); font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .detail-box .val { color: var(--text); font-size: 15px; }
        
        .units-section { margin-bottom: 32px; }
        .units-section h3 { font-size: 16px; color: var(--text); margin-bottom: 12px; }
        .units-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .unit-badge {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 6px 10px;
          display: flex;
          flex-direction: column;
          min-width: 140px;
        }
        .unit-badge.interactive { cursor: pointer; transition: background 0.2s, border-color 0.2s; }
        .unit-badge.interactive:hover { background: var(--bg4); border-color: var(--blue); }
        .u-id { font-size: 12px; color: var(--text); font-weight: 500; }
        .u-status { font-size: 10px; color: var(--text3); margin-top: 2px; text-transform: uppercase; }
        .u-status.pending { color: var(--accent); }
        
        .select-prompt { height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text3); }
        .loading { text-align: center; padding: 40px; color: var(--text3); }
        
        .priority-badge {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .priority-badge.low { background: var(--gray-dim); color: var(--text3); border: 1px solid var(--border2); }
        .priority-badge.medium { background: var(--blue-dim); color: var(--blue); border: 1px solid rgba(59, 130, 246, 0.4); }
        .priority-badge.high { background: var(--orange-dim); color: var(--orange); border: 1px solid rgba(245, 158, 11, 0.4); }
        .priority-badge.urgent { background: var(--red-dim); color: var(--red); border: 1px solid rgba(239, 68, 68, 0.4); }

        @media (max-width: 768px) {
          .order-list-container {
            grid-template-columns: 1fr;
            height: auto;
            gap: 12px;
          }
          .orders-sidebar { max-height: 220px; }
          .order-details-pane { padding: 14px; }
          .details-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .details-header > div:last-child {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .details-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 20px;
          }
          .unit-badge { min-width: 120px; }
        }

        @media (max-width: 480px) {
          .order-card { padding: 10px 12px; }
          .order-num { font-size: 13px; }
          .order-details-pane { padding: 10px; border-radius: 8px; }
          .details-grid { gap: 8px; }
          .unit-badge { min-width: 100px; }
          .line-items-section { margin-top: 16px !important; }
        }
      `}}),r.jsx(rh,{isOpen:N,onClose:()=>B(!1),onImportComplete:()=>{xt(),window.dispatchEvent(new CustomEvent("orderUpdated"))}}),A&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&V(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"700px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Amend Order Details"}),r.jsxs("div",{className:"modal-sub",children:["Updating fields for ",A.order_number]})]}),r.jsx("button",{className:"modal-close",onClick:()=>V(null),children:"✕"})]}),r.jsxs("form",{onSubmit:ge,children:[r.jsx("div",{className:"modal-body",children:r.jsxs("div",{className:"form-grid",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"},children:[r.jsxs("div",{className:"form-group",style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Select Company & Location"}),r.jsxs("select",{className:"form-select",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.company_location_id,onChange:y=>R({...U,company_location_id:y.target.value}),required:!0,children:[r.jsx("option",{value:"",children:"-- None --"}),J.map(y=>{var X;return r.jsx("optgroup",{label:y.name,children:(X=y.locations)==null?void 0:X.map(oe=>r.jsxs("option",{value:oe.id,children:[y.name," - ",oe.city]},oe.id))},y.id)})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Order Date"}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.order_date,onChange:y=>{const X=y.target.value;let oe=U.delivery_date;if(X){const Ee=new Date(X);Ee.setDate(Ee.getDate()+28),oe=Ee.toISOString().split("T")[0]}R({...U,order_date:X,delivery_date:oe})}})]}),r.jsxs("div",{className:"form-group",children:[r.jsxs("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:["Overall Delivery Date ",r.jsx("span",{style:{textTransform:"none",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",opacity:.7,cursor:"not-allowed"},value:U.delivery_date,disabled:!0})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Priority"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.priority,onChange:y=>R({...U,priority:y.target.value}),children:[r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Customer PO Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.po_number,onChange:y=>R({...U,po_number:y.target.value}),placeholder:"e.g. PO-45000"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Packaging Type"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.packaging_type,onChange:y=>R({...U,packaging_type:y.target.value}),children:[r.jsx("option",{value:"",children:"-- Select Packaging Type --"}),r.jsx("option",{value:"Wooden Packaging",children:"Wooden Packaging"}),r.jsx("option",{value:"Foam Packaging",children:"Foam Packaging"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"End Client Name"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.end_client_name,onChange:y=>R({...U,end_client_name:y.target.value}),placeholder:"e.g. Reliance Industries"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"GST Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.gst_number,onChange:y=>R({...U,gst_number:y.target.value}),placeholder:"e.g. 27AAAAA1111A1Z1"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Customer Reference Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.reference_number,onChange:y=>R({...U,reference_number:y.target.value}),placeholder:"e.g. REF-2026-99"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Classification"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.classification||"Standard",onChange:y=>R({...U,classification:y.target.value}),children:[r.jsx("option",{value:"Standard",children:"Standard"}),r.jsx("option",{value:"Non-Standard",children:"Non-Standard"})]})]}),r.jsxs("div",{className:"form-group",style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Overall Order Notes"}),r.jsx("textarea",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",height:"80px",resize:"vertical"},value:U.notes,onChange:y=>R({...U,notes:y.target.value}),placeholder:"Enter special notes..."})]})]})}),r.jsxs("div",{className:"modal-footer",style:{display:"flex",justifyContent:"flex-end",gap:"10px",padding:"16px",borderTop:"1px solid var(--border)"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#64748b",border:"none",color:"#fff",padding:"8px 16px",borderRadius:"4px",cursor:"pointer"},onClick:()=>V(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",style:{background:"#10b981",border:"none",color:"#fff",padding:"8px 16px",borderRadius:"4px",cursor:"pointer"},disabled:E,children:E?"Saving...":"Save Changes"})]})]})]})}),Z&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&le(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"640px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Amend Line Item"}),r.jsxs("div",{className:"modal-sub",children:["Item ",Z.line_item_number," — ",a==null?void 0:a.order_number]})]}),r.jsx("button",{className:"modal-close",onClick:()=>le(null),children:"✕"})]}),r.jsxs("form",{onSubmit:je,children:[r.jsx("div",{className:"modal-body",children:r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"},children:[r.jsxs("div",{style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Material Description"}),r.jsx("input",{type:"text",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.material_description,onChange:y=>Pe("material_description",y.target.value),placeholder:"e.g. VFD Control Panel 22kW"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Part Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.part_number,onChange:y=>Pe("part_number",y.target.value),placeholder:"e.g. VFD-22K-STD"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Panel Type / Size"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.panel_type_size,onChange:y=>Pe("panel_type_size",y.target.value),placeholder:"e.g. 800x600"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Quantity"}),r.jsx("input",{type:"number",min:"1",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.quantity,onChange:y=>Pe("quantity",y.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Unit"}),r.jsx("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.unit,onChange:y=>Pe("unit",y.target.value),children:["Nos","Sets","Pcs","Units","Lot"].map(y=>r.jsx("option",{value:y,children:y},y))})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Unit Price (₹)"}),r.jsx("input",{type:"number",min:"0",max:"9999999999999.99",step:"0.01",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.unit_price,onChange:y=>Pe("unit_price",y.target.value)})]}),r.jsxs("div",{style:{gridColumn:"span 2",padding:"8px 12px",background:"var(--bg2)",borderRadius:"6px",border:"1px solid var(--border)",fontSize:"13px",color:"var(--text3)"},children:["Total Price: ",r.jsxs("strong",{style:{color:"var(--text)",fontSize:"15px"},children:["₹",((parseFloat(xe.unit_price)||0)*(parseInt(xe.quantity)||0)).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"11px"},children:"(auto-calculated)"})]}),r.jsxs("div",{children:[r.jsxs("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:["Line Item Delivery Date ",r.jsx("span",{style:{textTransform:"none",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box",opacity:.7,cursor:"not-allowed"},value:xe.delivery_date,disabled:!0})]}),r.jsxs("div",{style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Notes"}),r.jsx("textarea",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",height:"72px",resize:"vertical",boxSizing:"border-box"},value:xe.notes,onChange:y=>Pe("notes",y.target.value),placeholder:"Item-specific notes..."})]})]})}),r.jsxs("div",{className:"modal-footer",style:{display:"flex",justifyContent:"flex-end",gap:"10px",padding:"16px",borderTop:"1px solid var(--border)"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#64748b",border:"none",color:"#fff",padding:"8px 18px",borderRadius:"4px",cursor:"pointer"},onClick:()=>le(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",style:{background:"#7c3aed",border:"none",color:"#fff",padding:"8px 18px",borderRadius:"4px",cursor:"pointer"},disabled:ve,children:ve?"Saving...":"Save Line Item"})]})]})]})})]})}const Bp=[{key:"orders.order_number",label:"Order #"},{key:"orders.po_number",label:"PO Number"},{key:"orders.order_date",label:"Order Date"},{key:"orders.delivery_date",label:"Delivery Date"},{key:"orders.planned_dispatch_date",label:"Planned Dispatch Date"},{key:"orders.priority",label:"Priority"},{key:"orders.classification",label:"Classification"},{key:"orders.packaging_type",label:"Packaging Type"},{key:"orders.end_client_name",label:"End Client Name"},{key:"orders.reference_number",label:"Reference Number"},{key:"orders.gst_number",label:"GST Number"},{key:"orders.hold_status",label:"Hold Status"},{key:"orders.order_status",label:"Order Status"},{key:"orders.notes",label:"Order Notes"},{key:"company_name",label:"Company Name"},{key:"company_city",label:"Company City"},{key:"person_in_charge",label:"Person In Charge"},{key:"contact_number",label:"Contact Number"},{key:"company_email",label:"Company Email"},{key:"orders.wiring_assigned_date",label:"Wiring Assigned Date"},{key:"orders.wiring_expected_date",label:"Wiring Expected Date"},{key:"orders.expected_qc_date",label:"Expected QC Date"},{key:"orders.qc_date",label:"QC Date"},{key:"orders.qc_status",label:"QC Status"},{key:"li.material_description",label:"Material Description"},{key:"li.part_number",label:"Part Number"},{key:"li.panel_type_size",label:"Panel Type / Size"},{key:"li.delivery_date",label:"Line Item Delivery Date"},{key:"li.quantity",label:"Quantity"},{key:"li.unit",label:"Unit"},{key:"li.unit_price",label:"Unit Price"},{key:"li.total_price",label:"Total Price"},{key:"docs.any",label:"Any document uploaded"},{key:"docs.PO",label:"PO document uploaded"},{key:"docs.Drawing",label:"Drawing uploaded"},{key:"docs.BOM",label:"BOM uploaded"},{key:"docs.QC",label:"QC document uploaded"},{key:"docs.Dispatch",label:"Dispatch document uploaded"},{key:"docs.Quotation",label:"Quotation uploaded"},{key:"docs.General",label:"General document uploaded"},{key:"docs.TaskUpload",label:"Task upload present"},{key:"unit_serial",label:"Unit Serial"},{key:"short_serial",label:"Short Serial"},{key:"current_dept",label:"Current Department"},{key:"unit_status",label:"Unit Status"},{key:"__custom__",label:"Custom key…"}],tc=[{value:"",label:"— No condition (any non-empty) —",needsValue:!1},{value:"IS_NOT_EMPTY",label:"is not empty",needsValue:!1},{value:"IS_EMPTY",label:"is empty",needsValue:!1},{value:"HAS_DOCS",label:"has documents (count > 0)",needsValue:!1},{value:"NO_DOCS",label:"has no documents (count = 0)",needsValue:!1},{value:"EQUALS",label:"= equals",needsValue:!0},{value:"NOT_EQUALS",label:"≠ not equals",needsValue:!0},{value:"CONTAINS",label:"contains",needsValue:!0},{value:"GT",label:"> greater than",needsValue:!0},{value:"GTE",label:"≥ greater than or equal",needsValue:!0},{value:"LT",label:"< less than",needsValue:!0},{value:"LTE",label:"≤ less than or equal",needsValue:!0},{value:"DATE_FUTURE",label:"date is in the future",needsValue:!1},{value:"DATE_PAST",label:"date is today or past",needsValue:!1}],Ts=(e,t)=>{switch(e){case"":return"";case"IS_NOT_EMPTY":return'$val !== "" && $val !== null && $val !== undefined';case"IS_EMPTY":return'$val === "" || $val === null || $val === undefined';case"HAS_DOCS":return"Number($val) > 0";case"NO_DOCS":return'Number($val) === 0 || $val === ""';case"EQUALS":return`String($val).toLowerCase() === ${JSON.stringify(String(t).toLowerCase())}`;case"NOT_EQUALS":return`String($val).toLowerCase() !== ${JSON.stringify(String(t).toLowerCase())}`;case"CONTAINS":return`String($val).toLowerCase().includes(${JSON.stringify(String(t).toLowerCase())})`;case"GT":return`Number($val) > ${Number(t)||0}`;case"GTE":return`Number($val) >= ${Number(t)||0}`;case"LT":return`Number($val) < ${Number(t)||0}`;case"LTE":return`Number($val) <= ${Number(t)||0}`;case"DATE_FUTURE":return"new Date($val) > new Date()";case"DATE_PAST":return"new Date($val) <= new Date()";default:return""}},ah=(e,t)=>{var a;if(!e)return"auto-done when not empty";const n=((a=Bp.find(o=>o.key===t))==null?void 0:a.label)||t;return e==="Number($val) > 0"?`${n} → at least 1 document`:e.includes("Number($val) === 0")?`${n} → no documents`:e.includes('!== ""')?`${n} is not empty`:e.includes('=== ""')?`${n} is empty`:e.includes(".includes(")?`${n} contains value`:e.includes("new Date($val) > new Date()")?`${n} is in the future`:e.includes("new Date($val) <= new Date()")?`${n} is today or past`:e.includes("=== ")?`${n} equals value`:e.includes("!== ")?`${n} does not equal value`:e.includes("> ")?`${n} > value`:e.includes(">= ")?`${n} >= value`:e.includes("< ")?`${n} < value`:e.includes("<= ")?`${n} <= value`:e},oh=[{key:"order_number",label:"Order Number"},{key:"company_name",label:"Company Name"},{key:"delivery_date",label:"Delivery Date"},{key:"po_number",label:"PO Number"},{key:"packaging_type",label:"Packaging Type"},{key:"priority",label:"Priority"},{key:"notes",label:"Order Notes"}];function sh(){var J,Y;const[e,t]=p.useState("companies"),[n,a]=p.useState([]),[o,s]=p.useState(!1),[l,i]=p.useState({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),[d,u]=p.useState([]),[v,m]=p.useState(!1),[b,w]=p.useState(null),[_,S]=p.useState({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),[z,x]=p.useState([]),[f,c]=p.useState(!1),[k,I]=p.useState({label:"",type:"Text",options:"",datakeyPreset:"",customDatakey:"",operator:"",conditionValue:""}),D=localStorage.getItem("token"),L=((J=JSON.parse(localStorage.getItem("user")||"{}").role)==null?void 0:J.toLowerCase())==="admin";p.useEffect(()=>{P(),h()},[]),p.useEffect(()=>{const E=M=>{M.altKey&&M.key.toLowerCase()==="n"&&(M.preventDefault(),e==="companies"&&L?s(!0):e==="tasks"&&L&&(w(null),S({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,order_fields:[]}),x([]),c(!1),m(!0)))};return window.addEventListener("keydown",E),()=>{window.removeEventListener("keydown",E)}},[e,L]);const P=async()=>{try{const E=await fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${D}`}});E.ok&&a(await E.json())}catch(E){console.error(E)}},h=async()=>{try{const E=await fetch(window.API_BASE+"/api/task_masters",{headers:{Authorization:`Bearer ${D}`}});E.ok&&u(await E.json())}catch(E){console.error(E)}},T=(E,M,Z)=>{const le=[...l.locations];le[E][M]=Z,i({...l,locations:le})},j=()=>{i({...l,locations:[...l.locations,{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]})},N=async E=>{E.preventDefault();try{(await fetch(window.API_BASE+"/api/companies",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${D}`},body:JSON.stringify(l)})).ok&&(s(!1),i({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),P())}catch(M){console.error(M)}},B=async E=>{E.preventDefault();const M=!!b,Z=M?`${window.API_BASE}/api/task_masters/${b}`:window.API_BASE+"/api/task_masters",le=M?"PUT":"POST",xe=z.map(({id:se,label:ve,type:O,options:re,datakey:Q,condition:ge})=>({id:se,label:ve,type:O,options:re||[],datakey:Q||"",condition:ge||""}));try{(await fetch(Z,{method:le,headers:{"Content-Type":"application/json",Authorization:`Bearer ${D}`},body:JSON.stringify({..._,custom_fields:xe,order_fields:_.order_fields||[]})})).ok?(m(!1),w(null),S({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),x([]),c(!1),h()):alert("Failed to save task")}catch(se){console.error(se)}},A=E=>{w(E.id),S({dept:E.dept,name:E.name,sub:E.sub||"",special:E.special||"",is_mandatory:E.is_mandatory,requires_upload:E.requires_upload,default_doc_type:E.default_doc_type||"General",order_fields:Array.isArray(E.order_fields)?E.order_fields:E.order_fields?JSON.parse(E.order_fields):[]});try{const M=Array.isArray(E.custom_fields)?E.custom_fields:JSON.parse(E.custom_fields||"[]");x(M)}catch{x([])}c(!1),m(!0)},V=()=>{if(!k.label.trim()){alert("Label is required.");return}const E=k.datakeyPreset==="__custom__"?(k.customDatakey||"").trim():(k.datakeyPreset||"").trim(),M=Ts(k.operator,k.conditionValue),Z={id:Date.now(),label:k.label.trim(),type:k.type,options:k.type==="Dropdown"?k.options.split(",").map(le=>le.trim()).filter(Boolean):[],datakey:E,condition:M};x(le=>[...le,Z]),I({label:"",type:"Text",options:"",datakeyPreset:"",customDatakey:"",operator:"",conditionValue:""}),c(!1)},U=E=>x(M=>M.filter(Z=>Z.id!==E)),R=async E=>{if(window.confirm("Are you sure you want to delete this task?"))try{(await fetch(`${window.API_BASE}/api/task_masters/${E}`,{method:"DELETE",headers:{Authorization:`Bearer ${D}`}})).ok?h():alert("Failed to delete task")}catch(M){console.error(M)}};return r.jsxs("div",{style:{padding:"24px"},children:[r.jsxs("div",{style:{display:"flex",gap:"16px",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:[r.jsx("button",{className:`vbtn ${e==="companies"?"active":""}`,onClick:()=>t("companies"),children:"Companies"}),r.jsx("button",{className:`vbtn ${e==="tasks"?"active":""}`,onClick:()=>t("tasks"),children:"Task Masters"})]}),e==="companies"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"var(--text)"},children:"Company Masters"}),L&&r.jsx("button",{className:"vbtn",onClick:()=>s(!0),children:"+ Register Company (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:n.map(E=>r.jsxs("div",{style:{background:"var(--bg2)",padding:"20px",borderRadius:"12px",border:"1px solid var(--border)"},children:[r.jsx("h3",{style:{margin:"0 0 16px 0",color:"var(--text)"},children:E.name}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:E.locations.map(M=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"16px",borderRadius:"8px",border:"1px solid var(--border)"},children:[r.jsx("div",{style:{color:"var(--blue)",fontWeight:"bold",marginBottom:"8px"},children:M.city}),r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",marginBottom:"4px"},children:M.address}),r.jsxs("div",{style:{fontSize:"12px",color:"var(--text3)",marginTop:"12px"},children:[r.jsxs("div",{children:[r.jsx("strong",{children:"Contact:"})," ",M.person_in_charge||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Phone:"})," ",M.contact_number||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Email:"})," ",M.email||"N/A"]})]})]},M.id))})]},E.id))})]}),e==="tasks"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"var(--text)"},children:"Task Masters"}),L&&r.jsx("button",{className:"vbtn",onClick:()=>{w(null),S({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),x([]),c(!1),m(!0)},children:"+ New Task (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:jr.map(E=>{const M=d.filter(Z=>Z.dept===E.id);return M.length===0?null:r.jsxs("div",{children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"},children:[r.jsx("div",{style:{width:"4px",height:"16px",background:E.color,borderRadius:"2px"}}),r.jsx("h3",{style:{margin:0,color:"var(--text)",fontSize:"15px"},children:E.label})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:M.map(Z=>r.jsxs("div",{style:{background:"var(--bg2)",padding:"16px",borderRadius:"8px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"},children:[r.jsx("span",{style:{fontSize:"12px",color:E.color,fontWeight:"bold",textTransform:"uppercase"},children:Z.dept}),r.jsx("span",{style:{fontSize:"10px",background:Z.is_mandatory?"var(--blue-dim)":"var(--gray-dim)",color:Z.is_mandatory?"var(--blue)":"var(--text3)",padding:"2px 6px",borderRadius:"4px"},children:Z.is_mandatory?"MANDATORY":"OPTIONAL"})]}),r.jsx("div",{style:{color:"var(--text)",fontWeight:"500",marginBottom:"4px"},children:Z.name}),r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",marginBottom:"12px"},children:Z.sub||"No description"}),r.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[Z.requires_upload&&r.jsxs("span",{style:{fontSize:"10px",background:"#f59e0b44",color:"#fbbf24",padding:"2px 6px",borderRadius:"4px"},children:["Requires: ",Z.default_doc_type||"General"]}),Z.special&&r.jsxs("span",{style:{fontSize:"10px",background:"#10b98144",color:"#34d399",padding:"2px 6px",borderRadius:"4px"},children:["Special: ",Z.special]})]}),L&&r.jsxs("div",{style:{display:"flex",gap:"4px"},children:[r.jsx("button",{style:{background:"transparent",border:"1px solid var(--border2)",color:"var(--text2)",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>A(Z),children:"Edit"}),r.jsx("button",{style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>R(Z.id),children:"Delete"})]})]})]},Z.id))})]},E.id)})})]}),o&&r.jsx("div",{className:"modal-overlay open",onClick:E=>{E.target.className==="modal-overlay open"&&s(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:"Register Company"}),r.jsx("button",{className:"modal-close",onClick:()=>s(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:N,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Company Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:l.name,onChange:E=>i({...l,name:E.target.value})})]}),r.jsx("div",{style:{marginTop:"24px",marginBottom:"16px",borderBottom:"1px solid var(--border)",paddingBottom:"8px",color:"var(--text)"},children:"Locations"}),l.locations.map((E,M)=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"16px",borderRadius:"8px",marginBottom:"16px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"City *"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:E.city,onChange:Z=>T(M,"city",Z.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Person in Charge"}),r.jsx("input",{type:"text",className:"form-input",value:E.person_in_charge,onChange:Z=>T(M,"person_in_charge",Z.target.value)})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Full Address"}),r.jsx("input",{type:"text",className:"form-input",value:E.address,onChange:Z=>T(M,"address",Z.target.value)})]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Contact Number"}),r.jsx("input",{type:"text",className:"form-input",value:E.contact_number,onChange:Z=>T(M,"contact_number",Z.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Email"}),r.jsx("input",{type:"email",className:"form-input",value:E.email,onChange:Z=>T(M,"email",Z.target.value)})]})]})]},M)),r.jsx("button",{type:"button",onClick:j,style:{background:"transparent",border:"1px dashed var(--border2)",color:"var(--text3)",width:"100%",padding:"12px",borderRadius:"8px",cursor:"pointer",marginBottom:"24px"},children:"+ Add Another Location"}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"var(--bg4)"},onClick:()=>s(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:"Save Company"})]})]})})]})}),v&&r.jsx("div",{className:"modal-overlay open",onClick:E=>{E.target.className==="modal-overlay open"&&m(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:b?"Edit Task Master":"New Task Master"}),r.jsx("button",{className:"modal-close",onClick:()=>m(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:B,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Department"}),r.jsx("select",{className:"form-select",value:_.dept,onChange:E=>S({..._,dept:E.target.value}),children:jr.map(E=>r.jsx("option",{value:E.id,children:E.label},E.id))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Task Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:_.name,onChange:E=>S({..._,name:E.target.value})})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Description / Subtitle"}),r.jsx("input",{type:"text",className:"form-input",value:_.sub,onChange:E=>S({..._,sub:E.target.value})})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"16px"},children:[r.jsx("input",{type:"checkbox",checked:_.is_mandatory,onChange:E=>S({..._,is_mandatory:E.target.checked})}),r.jsx("label",{style:{margin:0,color:"var(--text)"},children:"Mandatory Task (added to all new orders)"})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"12px"},children:[r.jsx("input",{type:"checkbox",checked:_.requires_upload,onChange:E=>S({..._,requires_upload:E.target.checked})}),r.jsx("label",{style:{margin:0,color:"var(--text)"},children:"Requires Document Upload to complete"})]}),_.requires_upload&&r.jsxs("div",{className:"modal-field",style:{marginLeft:"24px",marginTop:"8px"},children:[r.jsx("label",{style:{color:"#fff",fontSize:"12px",display:"block",marginBottom:"4px"},children:"Default Document Type"}),r.jsxs("select",{className:"form-select",value:_.default_doc_type||"General",onChange:E=>S({..._,default_doc_type:E.target.value}),style:{fontSize:"13px",width:"100%",padding:"6px 12px"},children:[r.jsx("option",{value:"General",children:"General"}),r.jsx("option",{value:"PO",children:"PO"}),r.jsx("option",{value:"Quotation",children:"Quotation"}),r.jsx("option",{value:"BOM",children:"BOM"}),r.jsx("option",{value:"Drawing",children:"Drawing"}),r.jsx("option",{value:"QC Report",children:"QC Report"}),r.jsx("option",{value:"Dispatch Document",children:"Dispatch Document"}),r.jsx("option",{value:"Photo",children:"Photo"})]})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid #333"},children:[r.jsx("label",{style:{color:"#fff",fontWeight:"600",display:"block",marginBottom:"10px"},children:"Order Fields to Show"}),r.jsx("div",{style:{color:"var(--text3)",fontSize:"11px",marginBottom:"10px"},children:"These fields from the order will be shown as read-only reference inside the task modal."}),r.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:oh.map(E=>{const M=(_.order_fields||[]).includes(E.key);return r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"6px",background:M?"var(--blue-dim)":"var(--bg3)",border:`1px solid ${M?"rgba(59,130,246,0.4)":"var(--border)"}`,borderRadius:"6px",padding:"5px 10px",cursor:"pointer",fontSize:"12px",color:M?"var(--blue)":"var(--text3)"},children:[r.jsx("input",{type:"checkbox",checked:M,style:{display:"none"},onChange:()=>{const Z=_.order_fields||[],le=M?Z.filter(xe=>xe!==E.key):[...Z,E.key];S(xe=>({...xe,order_fields:le}))}}),M?"✓ ":"",E.label]},E.key)})})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("label",{style:{color:"var(--text)",fontWeight:"600"},children:"Form Fields"}),r.jsx("button",{type:"button",onClick:()=>c(!f),style:{background:"rgba(59,130,246,0.15)",color:"#60a5fa",border:"1px solid rgba(59,130,246,0.3)",padding:"4px 10px",borderRadius:"6px",fontSize:"11px",cursor:"pointer"},children:f?"Cancel":"+ Add Field"})]}),f&&r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px",marginBottom:"12px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Label *"}),r.jsx("input",{type:"text",className:"form-input",value:k.label,onChange:E=>I(M=>({...M,label:E.target.value})),placeholder:"e.g. Test Voltage"})]}),r.jsxs("div",{style:{background:"var(--bg4)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:"8px",padding:"12px",marginBottom:"12px"},children:[r.jsx("div",{style:{fontSize:"11px",color:"#a78bfa",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"10px"},children:"Auto-Done Trigger (optional)"}),r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"10px"},children:"If the selected DB field matches this condition, the task is automatically marked Done."}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"},children:[r.jsx("span",{style:{fontSize:"12px",fontWeight:"700",color:"#a78bfa",minWidth:"18px"},children:"IF"}),r.jsxs("div",{style:{flex:"1 1 160px"},children:[r.jsxs("select",{className:"form-select",value:k.datakeyPreset||"",onChange:E=>I(M=>({...M,datakeyPreset:E.target.value,customDatakey:"",operator:"",conditionValue:""})),children:[r.jsx("option",{value:"",children:"— pick a field —"}),Bp.map(E=>r.jsx("option",{value:E.key,children:E.label},E.key))]}),k.datakeyPreset==="__custom__"&&r.jsx("input",{type:"text",className:"form-input",style:{marginTop:"6px",fontFamily:"monospace",fontSize:"12px"},value:k.customDatakey||"",onChange:E=>I(M=>({...M,customDatakey:E.target.value})),placeholder:"table.column_name"})]}),r.jsx("div",{style:{flex:"1 1 160px"},children:r.jsx("select",{className:"form-select",value:k.operator||"",onChange:E=>I(M=>({...M,operator:E.target.value,conditionValue:""})),disabled:!k.datakeyPreset||k.datakeyPreset==="",children:tc.map(E=>r.jsx("option",{value:E.value,children:E.label},E.value))})}),((Y=tc.find(E=>E.value===k.operator))==null?void 0:Y.needsValue)&&r.jsx("div",{style:{flex:"1 1 120px"},children:r.jsx("input",{type:"text",className:"form-input",value:k.conditionValue||"",onChange:E=>I(M=>({...M,conditionValue:E.target.value})),placeholder:"value…"})})]}),k.datakeyPreset&&k.datakeyPreset!==""&&r.jsx("div",{style:{marginTop:"8px",fontSize:"11px",color:"#9ca3af",fontFamily:"monospace",background:"var(--bg3)",padding:"6px 10px",borderRadius:"4px"},children:Ts(k.operator,k.conditionValue)?`Auto-done: ${Ts(k.operator,k.conditionValue)}`:"Auto-done when field has any value"})]}),r.jsx("button",{type:"button",onClick:V,style:{background:"#10b981",color:"#fff",border:"none",padding:"6px 14px",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},children:"Add Field"})]}),z.length===0?r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",fontStyle:"italic",padding:"8px 0"},children:"No form fields defined. Users will only see Notes when filling this task."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:z.map(E=>{var M;return r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[r.jsxs("div",{children:[r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:E.label}),((M=E.options)==null?void 0:M.length)>0&&r.jsxs("span",{style:{marginLeft:"6px",fontSize:"10px",color:"var(--text3)"},children:["(",E.options.join(", "),")"]})]}),(E.datakey||E.condition)&&r.jsx("div",{style:{fontSize:"11px",color:"#a78bfa",marginTop:"3px",display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"},children:r.jsxs("span",{style:{background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"4px",padding:"1px 6px"},children:["IF ",ah(E.condition,E.datakey)]})})]}),r.jsx("button",{type:"button",onClick:()=>U(E.id),style:{background:"transparent",border:"none",color:"#666",cursor:"pointer",fontSize:"14px"},children:"✕"})]},E.id)})})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px",marginTop:"24px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#333"},onClick:()=>m(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:b?"Update Task":"Save Task"})]})]})})]})})]})}function lh(){const[e,t]=p.useState([]),[n,a]=p.useState("1000"),[o,s]=p.useState(""),[l,i]=p.useState("All"),[d,u]=p.useState(!1),v=localStorage.getItem("token");p.useEffect(()=>{m(n)},[n]);const m=async(S=n)=>{u(!0);try{const z=await fetch(`${window.API_BASE}/api/logs?limit=${S}`,{headers:{Authorization:`Bearer ${v}`}});if(z.ok){const x=await z.json();t(x)}}catch(z){console.error(z)}finally{u(!1)}},b=S=>{const z=new Date(S);return z.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+" "+z.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},w=S=>{switch(S==null?void 0:S.toLowerCase()){case"sales":return{background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",border:"1px solid rgba(59, 130, 246, 0.2)"};case"design":return{background:"rgba(167, 139, 250, 0.1)",color:"#a78bfa",border:"1px solid rgba(167, 139, 250, 0.2)"};case"purchase":return{background:"rgba(249, 115, 22, 0.1)",color:"#f97316",border:"1px solid rgba(249, 115, 22, 0.2)"};case"stores":return{background:"rgba(45, 212, 191, 0.1)",color:"#2dd4bf",border:"1px solid rgba(45, 212, 191, 0.2)"};case"production":return{background:"rgba(239, 68, 68, 0.1)",color:"#ef4444",border:"1px solid rgba(239, 68, 68, 0.2)"};case"qc":return{background:"rgba(34, 197, 94, 0.1)",color:"#22c55e",border:"1px solid rgba(34, 197, 94, 0.2)"};case"dispatch":return{background:"rgba(245, 158, 11, 0.1)",color:"#f59e0b",border:"1px solid rgba(245, 158, 11, 0.2)"};case"accounts":return{background:"rgba(14, 165, 233, 0.1)",color:"#0ea5e9",border:"1px solid rgba(14, 165, 233, 0.2)"};default:return{background:"rgba(255, 255, 255, 0.05)",color:"#888",border:"1px solid rgba(255, 255, 255, 0.1)"}}},_=e.filter(S=>{if(l!=="All"&&S.dept!==l)return!1;if(o.trim()!==""){const z=o.trim().toLowerCase().split(/\s+/),x=(S.username||"").toLowerCase(),f=(S.action_text||"").toLowerCase(),c=(S.order_number||"").toLowerCase();return z.every(k=>x.includes(k)||f.includes(k)||c.includes(k))}return!0});return r.jsxs("div",{style:{padding:"24px"},children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"var(--text)",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Ao,{size:22,style:{color:"#f59e0b"}}),"System Activity Logs"]})}),r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"16px",flex:1,minWidth:"300px"},children:[r.jsxs("div",{style:{position:"relative",flex:1,minWidth:"220px"},children:[r.jsx(Mr,{size:16,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("input",{type:"text",placeholder:"Search logs by user, action or order #...",value:o,onChange:S=>s(S.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 38px",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},className:"log-search-input"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(Ei,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:l,onChange:S=>i(S.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"All",children:"All Departments"}),r.jsx("option",{value:"Sales",children:"Sales"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"}),r.jsx("option",{value:"Accounts",children:"Accounts"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]}),r.jsxs("div",{style:{position:"relative",width:"160px"},children:[r.jsx(Tp,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:n,onChange:S=>a(S.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"100",children:"Fetch 100 Logs"}),r.jsx("option",{value:"250",children:"Fetch 250 Logs"}),r.jsx("option",{value:"500",children:"Fetch 500 Logs"}),r.jsx("option",{value:"1000",children:"Fetch 1000 Logs"}),r.jsx("option",{value:"5000",children:"Fetch 5000 Logs"}),r.jsx("option",{value:"all",children:"Fetch All Logs"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[(o||l!=="All")&&r.jsx("button",{onClick:()=>{s(""),i("All")},style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"#ef4444",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",transition:"all 0.2s"},className:"clear-btn",children:"Clear Filters"}),r.jsxs("button",{onClick:()=>m(n),disabled:d,style:{background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",transition:"all 0.2s"},className:"refresh-btn",children:[r.jsx(Ht,{size:14,className:d?"spin":"",style:{transition:"transform 0.5s"}}),d?"Loading...":"Refresh"]})]})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:"12px",fontSize:"12px",color:"var(--text3)"},children:[r.jsxs("div",{children:["Showing ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:"600"},children:_.length})," ","of ",r.jsx("span",{style:{color:"var(--text)",fontWeight:"600"},children:e.length})," fetched logs"," ",n==="all"?"(full system history)":`(limit: ${n})`]}),_.length<e.length&&r.jsxs("div",{style:{fontStyle:"italic"},children:["Filtered out ",e.length-_.length," logs"]})]}),r.jsx("div",{style:{background:"var(--bg2)",borderRadius:"12px",border:"1px solid var(--border)",overflow:"hidden"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"13px"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"var(--bg3)",borderBottom:"1px solid var(--border)"},children:[r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Timestamp"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"User"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Order #"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Department"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Action"})]})}),r.jsx("tbody",{children:d&&e.length===0?r.jsx("tr",{children:r.jsxs("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"var(--text3)"},children:[r.jsx(Ht,{size:24,className:"spin",style:{margin:"0 auto 12px",color:"#f59e0b",display:"block"}}),"Loading activity logs..."]})}):_.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"var(--text3)"},children:"No matching activity logs found."})}):_.map(S=>r.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},className:"log-row",children:[r.jsx("td",{style:{padding:"16px",color:"var(--text3)",whiteSpace:"nowrap"},children:b(S.timestamp)}),r.jsx("td",{style:{padding:"16px",color:"var(--text)",fontWeight:"600"},children:S.username}),r.jsx("td",{style:{padding:"16px"},children:S.order_number?r.jsx("span",{style:{fontFamily:"monospace",fontSize:"11px",background:"var(--orange-dim)",color:"var(--accent)",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(245,158,11,0.2)"},children:S.order_number}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"})}),r.jsx("td",{style:{padding:"16px"},children:S.dept?r.jsx("span",{style:{display:"inline-block",fontSize:"11px",fontWeight:"500",padding:"2px 8px",borderRadius:"12px",...w(S.dept)},children:S.dept}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"})}),r.jsx("td",{style:{padding:"16px",color:"var(--text)"},children:S.action_text})]},S.id))})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .log-search-input:focus {
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
        }
        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
        }
        .refresh-btn:hover:not(:disabled) {
          background: var(--bg4) !important;
          border-color: var(--border2) !important;
          color: var(--text) !important;
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
          background: var(--bg3) !important;
          border-left-color: var(--accent) !important;
        }
      `}})]})}const ih=[10,20,50,100],Ls=["sr_no","order_number","unit_number","po_number","reference_number","part_number","client_name","end_client_name","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","priority","status","qc_status","qc_date","progress","action"];function dh(){var Ut;const e=localStorage.getItem("token"),t=JSON.parse(localStorage.getItem("user")||"{}"),n=["admin","manager","planning"].includes((Ut=t.role)==null?void 0:Ut.toLowerCase()),a=Wn.useRef(null);p.useEffect(()=>{const g=a.current;if(!g)return;let $=!1,ne,te;const K=we=>{["INPUT","SELECT","OPTION","BUTTON","A","TH"].includes(we.target.tagName)||we.target.closest("th")||we.target.closest("button")||($=!0,g.classList.add("active-drag"),ne=we.pageX-g.offsetLeft,te=g.scrollLeft)},H=()=>{$=!1,g.classList.remove("active-drag")},ye=()=>{$=!1,g.classList.remove("active-drag")},me=we=>{if(!$)return;we.preventDefault();const ue=(we.pageX-g.offsetLeft-ne)*1.5;g.scrollLeft=te-ue};return g.addEventListener("mousedown",K),g.addEventListener("mouseleave",H),g.addEventListener("mouseup",ye),g.addEventListener("mousemove",me),()=>{g.removeEventListener("mousedown",K),g.removeEventListener("mouseleave",H),g.removeEventListener("mouseup",ye),g.removeEventListener("mousemove",me)}},[]);const[o,s]=p.useState([]),[l,i]=p.useState(()=>{const g=localStorage.getItem("planning_column_order");if(g)try{const $=JSON.parse(g);if(Array.isArray($)&&$.length>0){const ne=$.filter(K=>Ls.includes(K)),te=Ls.filter(K=>!ne.includes(K));return[...ne,...te]}}catch($){console.error("Error parsing column order from localStorage:",$)}return Ls}),[d,u]=p.useState(null),[v,m]=p.useState(null),b=(g,$)=>{u($),g.dataTransfer.effectAllowed="move",g.dataTransfer.setData("text/plain",$)},w=(g,$)=>{g.preventDefault(),d!==$&&v!==$&&m($)},_=(g,$)=>{v===$&&m(null)},S=(g,$)=>{if(g.preventDefault(),!d||d===$){u(null),m(null);return}const ne=l.indexOf(d),te=l.indexOf($);if(ne!==-1&&te!==-1){const K=[...l];K.splice(ne,1),K.splice(te,0,d),i(K),localStorage.setItem("planning_column_order",JSON.stringify(K))}u(null),m(null)},z=()=>{u(null),m(null)},x=g=>{switch(g){case"sr_no":return"Sr. No.";case"order_number":return"Order Number";case"unit_number":return"Unit Serial #";case"po_number":return"PO Number";case"reference_number":return"Cust. Ref #";case"part_number":return"Part Number";case"client_name":return"Client Name";case"end_client_name":return"End Client Name";case"planned_dispatch":return"Planned Dispatch";case"mounting_start":return"Mounting Start";case"mounting_complete":return"Mounting Complete";case"delivery_date":return"Order Delivery Date";case"wiring_assigned":return"Wiring Assigned";case"wiring_expected":return"Wiring Expected";case"expected_qc":return"Expected QC";case"priority":return"Priority";case"status":return"Status";case"qc_status":return"QC Status";case"qc_date":return"QC Passed Date";case"progress":return"Progress";case"action":return"Action";default:return g}},f=l.filter(g=>!(g==="action"&&!n)),c=(g,$,ne,te)=>{var ye;const K=O&&O.lineItemId===$.line_item_id&&O.colId===g;if(Q&&Q.lineItemId===$.line_item_id&&Q.colId===g)return r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{className:"inline-saving-spinner"}),r.jsx("span",{className:"dim text-xs",children:"Saving..."})]});if(K){const me=ue=>{ue.key==="Enter"?ue.target.blur():ue.key==="Escape"&&re(null)},we=ue=>{tr($.line_item_id,g,ue,O.oldValue)},Ie=()=>{O&&O.lineItemId===$.line_item_id&&O.colId===g&&tr($.line_item_id,g,O.value,O.oldValue)};if(["priority","status","qc_status"].includes(g)){let ue=[];return g==="priority"?ue=["Low","Medium","High","Urgent"]:g==="status"?ue=["Not Started","In Progress","Waiting for Material","QC Testing","Completed"]:g==="qc_status"&&(ue=["Pending","Pass","Fail"]),r.jsx("select",{className:"inline-edit-select",value:O.value,onChange:_t=>we(_t.target.value),onBlur:Ie,autoFocus:!0,children:ue.map(_t=>r.jsx("option",{value:_t,children:_t},_t))})}if(["planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(g))return r.jsx("input",{type:"date",className:"inline-edit-input",value:O.value,onChange:ue=>re({...O,value:ue.target.value}),onBlur:Ie,onKeyDown:me,autoFocus:!0});if(g==="end_client_name")return r.jsx("input",{type:"text",className:"inline-edit-input",value:O.value,onChange:ue=>re({...O,value:ue.target.value}),onBlur:Ie,onKeyDown:me,autoFocus:!0})}switch(g){case"sr_no":return ne;case"order_number":return r.jsx("span",{style:{fontFamily:"var(--font-mono)",fontWeight:600},children:$.order_number});case"unit_number":return $.specific_unit_serial?r.jsx("span",{style:{fontFamily:"var(--font-mono)",color:"var(--blue)",fontWeight:600,fontSize:"13px"},children:$.specific_unit_serial}):r.jsx("span",{className:"dim text-xs",children:"—"});case"po_number":return $.po_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"reference_number":return $.reference_number?r.jsx("span",{style:{color:"#f59e0b",fontWeight:600},children:$.reference_number}):r.jsx("span",{className:"dim text-xs",children:"—"});case"part_number":return $.part_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"client_name":return $.company_name;case"end_client_name":return $.end_client_name||r.jsx("span",{className:"dim text-xs",children:"Unspecified"});case"planned_dispatch":return Be($.planned_dispatch_date);case"mounting_start":return Be($.mounting_start_date);case"mounting_complete":return Be($.mounting_complete_date);case"wiring_assigned":return Be($.wiring_assigned_date);case"wiring_expected":return Be($.wiring_expected_date);case"expected_qc":return Be($.expected_qc_date);case"priority":return r.jsx("span",{className:`priority-badge ${((ye=$.priority)==null?void 0:ye.toLowerCase())||"medium"}`,children:$.priority});case"status":return r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[r.jsx("span",{className:`status-badge ${($.status||"Not Started").toLowerCase().replace(/\s+/g,"-")}`,children:$.status||"Not Started"}),$.active_dept&&r.jsx("span",{className:`dept-badge dept-${($.active_dept||"").toLowerCase()}`,children:$.active_dept})]});case"qc_status":return r.jsx("span",{className:`qc-badge ${($.qc_status||"Pending").toLowerCase()}`,children:$.qc_status||"Pending"});case"qc_date":return Be($.qc_date);case"progress":return r.jsxs("div",{className:"progress-cell",children:[r.jsxs("div",{className:"progress-text",children:[te,"%"]}),r.jsx("div",{className:"progress-track",children:r.jsx("div",{className:"progress-fill",style:{width:`${te}%`,backgroundColor:X(te)}})})]});case"action":return n?r.jsx("button",{className:"icon-btn",onClick:()=>wn($),title:"Edit planning data",children:r.jsx(Dg,{size:13})}):null;default:return null}},[k,I]=p.useState(!0),[D,C]=p.useState(""),[L,P]=p.useState("all"),[h,T]=p.useState("all"),[j,N]=p.useState(null),[B,A]=p.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[V,U]=p.useState(""),[R,J]=p.useState(""),[Y,E]=p.useState([]),[M,Z]=p.useState(!1),[le,xe]=p.useState({end_client_name:!1,planned_dispatch_date:!1,mounting_start_date:!1,mounting_complete_date:!1,wiring_assigned_date:!1,wiring_expected_date:!1,expected_qc_date:!1,priority:!1,status:!1,qc_status:!1,qc_date:!1}),[se,ve]=p.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[O,re]=p.useState(null),[Q,ge]=p.useState(null),[ie,F]=p.useState(1),[je,Pe]=p.useState(20),[fe,it]=p.useState("none"),[q,G]=p.useState("none"),[Te,$t]=p.useState({}),xt=g=>{$t($=>({...$,[g]:$[g]===!1}))};p.useEffect(()=>{rt()},[]);const rt=async()=>{try{const g=await fetch(window.API_BASE+"/api/planning",{headers:{Authorization:`Bearer ${e}`}});g.ok&&s(await g.json())}catch(g){console.error("Error fetching planning data:",g)}finally{I(!1)}},wn=g=>{n&&(N(g),A({end_client_name:g.end_client_name||"",planned_dispatch_date:g.planned_dispatch_date?g.planned_dispatch_date.split("T")[0]:"",mounting_start_date:g.mounting_start_date?g.mounting_start_date.split("T")[0]:"",mounting_complete_date:g.mounting_complete_date?g.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:g.wiring_assigned_date?g.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:g.wiring_expected_date?g.wiring_expected_date.split("T")[0]:"",expected_qc_date:g.expected_qc_date?g.expected_qc_date.split("T")[0]:"",priority:g.priority||"Medium",status:g.status||"Not Started",qc_status:g.qc_status||"Pending",qc_date:g.qc_date?g.qc_date.split("T")[0]:""}),U(""),J(""))},kt=g=>{const{name:$,value:ne}=g.target;A(te=>({...te,[$]:ne}))},kn=async g=>{g.preventDefault();try{const $=j.specific_unit_id?`${window.API_BASE}/api/planning/units/${j.specific_unit_id}`:`${window.API_BASE}/api/planning/line-items/${j.line_item_id}`,ne=await fetch($,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(B)});if(ne.ok)J("Planning details updated successfully."),setTimeout(()=>{N(null),rt(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const te=await ne.json();U(te.error||"Failed to update planning details.")}}catch($){console.error($),U("Network error, please try again.")}},Be=g=>g?new Date(g).toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"}):"—",Sn=[];o.forEach(g=>{const $=parseInt(g.quantity)||1,ne=Array.isArray(g.units)?g.units:[],te=g.unit_numbers?g.unit_numbers.split(", "):[];for(let K=0;K<$;K++){const H=ne[K]||null,ye=(H==null?void 0:H.unit_id)||(H==null?void 0:H.short_serial)||te[K]||"";Sn.push({...g,unit_index:K+1,total_qty:$,specific_unit_id:(H==null?void 0:H.id)||null,specific_unit_serial:ye,specific_active_dept:(H==null?void 0:H.current_dept)||g.active_dept,status:(H==null?void 0:H.status)||g.status||"Not Started",qc_status:(H==null?void 0:H.qc_status)||g.qc_status||"Pending",planned_dispatch_date:(H==null?void 0:H.planned_dispatch_date)||g.planned_dispatch_date,wiring_assigned_date:(H==null?void 0:H.wiring_assigned_date)||g.wiring_assigned_date,wiring_expected_date:(H==null?void 0:H.wiring_expected_date)||g.wiring_expected_date,expected_qc_date:(H==null?void 0:H.expected_qc_date)||g.expected_qc_date,qc_date:(H==null?void 0:H.qc_date)||g.qc_date,mounting_start_date:(H==null?void 0:H.mounting_start_date)||g.mounting_start_date,mounting_complete_date:(H==null?void 0:H.mounting_complete_date)||g.mounting_complete_date,row_key:`${g.line_item_id}-${K}`})}});const _n=Sn.filter(g=>{let $=!0;if(D.trim()!==""){const K=D.trim().toLowerCase().split(/\s+/),H=(g.order_number||"").toLowerCase(),ye=(g.line_item_number||"").toLowerCase(),me=`${g.order_number||""} / ${g.line_item_number||""}`.toLowerCase(),we=`${g.order_number||""}/${g.line_item_number||""}`.toLowerCase(),Ie=`${g.order_number||""}${g.line_item_number||""}`.toLowerCase(),ue=(g.po_number||"").toLowerCase(),_t=(g.part_number||"").toLowerCase(),Ea=(g.company_name||"").toLowerCase(),rs=(g.end_client_name||"").toLowerCase(),ns=(g.specific_unit_serial||g.unit_numbers||"").toLowerCase();$=K.every(It=>H.includes(It)||ye.includes(It)||me.includes(It)||we.includes(It)||Ie.includes(It)||ue.includes(It)||_t.includes(It)||Ea.includes(It)||rs.includes(It)||ns.includes(It))}const ne=L==="all"||g.status===L,te=h==="all"||g.priority===h;return $&&ne&&te}),_a=g=>{C(g),F(1)},Na=g=>{P(g),F(1)},Ca=g=>{T(g),F(1)},za=g=>{Pe(Number(g)),F(1)},_r=_n.length,Lt=Math.max(1,Math.ceil(_r/je)),gt=Math.min(ie,Lt),Zt=(gt-1)*je,Nn=Math.min(Zt+je,_r),y=_n.slice(Zt,Nn),X=g=>g<30?"#ef4444":g<70?"#f59e0b":"#10b981",oe=p.useCallback(()=>{const g=[],ne=Math.max(1,gt-3),te=Math.min(Lt,gt+3);for(let K=ne;K<=te;K++)g.push(K);return g},[gt,Lt]),Ee=g=>{E($=>$.includes(g)?$.filter(ne=>ne!==g):[...$,g])},Ve=()=>{const g=y.map(ne=>ne.line_item_id),$=g.every(ne=>Y.includes(ne));E($?ne=>ne.filter(te=>!g.includes(te)):ne=>{const te=[...ne];return g.forEach(K=>{te.includes(K)||te.push(K)}),te})},He=async g=>{g.preventDefault();const $={};let ne=!1;if(Object.keys(se).forEach(te=>{se[te]!==""&&($[te]=se[te],ne=!0)}),!ne){U("Please modify at least one field to update.");return}I(!0);try{const te=await fetch(window.API_BASE+"/api/planning/line-items/bulk",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({lineItemIds:Y,fields:$})});if(te.ok)J(`Successfully updated ${Y.length} items.`),E([]),setTimeout(()=>{Z(!1),U(""),J(""),ve({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),rt(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const K=await te.json();U(K.error||"Failed to update selected items."),I(!1)}}catch(te){console.error(te),U("Network error, please try again."),I(!1)}},er=(g,$,ne)=>{var te;!n||!ne||["INPUT","SELECT","OPTION","BUTTON","A","LABEL"].includes((te=g.target.tagName)==null?void 0:te.toUpperCase())||g.target.closest("button")||g.target.closest('input[type="checkbox"]')||wn(ne)},tr=async(g,$,ne,te)=>{if(ne===te){re(null);return}ge({lineItemId:g,colId:$}),re(null);try{let K=$;$==="planned_dispatch"?K="planned_dispatch_date":$==="mounting_start"?K="mounting_start_date":$==="mounting_complete"?K="mounting_complete_date":$==="wiring_assigned"?K="wiring_assigned_date":$==="wiring_expected"?K="wiring_expected_date":$==="expected_qc"&&(K="expected_qc_date");const H=o.find(we=>we.line_item_id===g);if(!H)throw new Error("Order not found");const ye={end_client_name:H.end_client_name||"",planned_dispatch_date:H.planned_dispatch_date?H.planned_dispatch_date.split("T")[0]:"",mounting_start_date:H.mounting_start_date?H.mounting_start_date.split("T")[0]:"",mounting_complete_date:H.mounting_complete_date?H.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:H.wiring_assigned_date?H.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:H.wiring_expected_date?H.wiring_expected_date.split("T")[0]:"",expected_qc_date:H.expected_qc_date?H.expected_qc_date.split("T")[0]:"",priority:H.priority||"Medium",status:H.status||"Not Started",qc_status:H.qc_status||"Pending",qc_date:H.qc_date?H.qc_date.split("T")[0]:""};ye[K]=ne;const me=await fetch(`${window.API_BASE}/api/planning/line-items/${g}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(ye)});if(me.ok)await rt(),window.dispatchEvent(new CustomEvent("orderUpdated"));else{const we=await me.json();alert(we.error||"Failed to update planning details.")}}catch(K){console.error(K),alert("Network error, please try again.")}finally{ge(null)}},rr=(g,$)=>{if(!$||$==="none")return"";switch($){case"planned_dispatch":return Be(g.planned_dispatch_date);case"mounting_start":return Be(g.mounting_start_date);case"mounting_complete":return Be(g.mounting_complete_date);case"delivery_date":return Be(g.delivery_date);case"wiring_assigned":return Be(g.wiring_assigned_date);case"wiring_expected":return Be(g.wiring_expected_date);case"expected_qc":return Be(g.expected_qc_date);case"qc_date":return Be(g.qc_date);case"client_name":return g.company_name||"Unspecified";case"end_client_name":return g.end_client_name||"Unspecified";case"priority":return g.priority||"Medium";case"status":return g.status||"Not Started";case"qc_status":return g.qc_status||"Pending";case"active_dept":return g.active_dept||"Planning";default:return g[$]||"Unspecified"}},ce=g=>{if(!fe||fe==="none")return{type:"flat",rows:g};const $={};g.forEach(te=>{const K=rr(te,fe);$[K]||($[K]=[]),$[K].push(te)});const ne={type:"grouped",keys:Object.keys($).sort(),groups:{}};return Object.keys($).forEach(te=>{const K=$[te];if(q&&q!=="none"){const H={};K.forEach(ye=>{const me=rr(ye,q);H[me]||(H[me]=[]),H[me].push(ye)}),ne.groups[te]={type:"subgrouped",keys:Object.keys(H).sort(),groups:H}}else ne.groups[te]={type:"flat",rows:K}}),ne},St=(g,$,ne)=>{const te=Y.includes(g.line_item_id);return r.jsxs("tr",{className:`planning-row ${te?"selected-row":""}`,onClick:K=>er(K,"row",g),style:{cursor:n?"pointer":"default"},children:[n&&r.jsx("td",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},onClick:K=>K.stopPropagation(),children:r.jsx("input",{type:"checkbox",checked:te,onChange:()=>Ee(g.line_item_id)})}),f.map((K,H)=>{const ye=H===0;let me="";["sr_no","order_number","unit_number","po_number","reference_number","part_number","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(K)&&(me+=" mono"),(K==="order_number"||K==="unit_number")&&(me+=" font-semibold text-accent");let Ie={};return K==="part_number"&&(Ie={maxWidth:"120px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}),ye&&(me+=" col-sticky-first",Ie={...Ie,left:n?"40px":0}),r.jsx("td",{className:me.trim(),style:Ie,title:K==="part_number"?g.part_number:void 0,onClick:ue=>er(ue,K,g),children:c(K,g,$,ne)},K)})]},g.row_key)};return k?r.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"400px",color:"#888"},children:"Loading Planning Records..."}):r.jsxs("div",{className:"planning-module",children:[r.jsxs("div",{className:"planning-controls",children:[r.jsxs("div",{className:"search-box",children:[r.jsx(Mr,{size:16,className:"search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by PO, Client, End Client, or Order Number...",value:D,onChange:g=>_a(g.target.value)})]}),r.jsxs("div",{className:"filter-group",children:[r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Status"}),r.jsxs("select",{value:L,onChange:g=>Na(g.target.value),children:[r.jsx("option",{value:"all",children:"All Statuses"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{value:h,onChange:g=>Ca(g.target.value),children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Group By"}),r.jsxs("select",{value:fe,onChange:g=>{it(g.target.value),g.target.value==="none"&&G("none")},children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Then Group By"}),r.jsxs("select",{value:q,onChange:g=>G(g.target.value),disabled:fe==="none",children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsx("button",{className:"reset-filters-btn",onClick:()=>{C(""),P("all"),T("all"),it("none"),G("none"),F(1)},title:"Reset all filters and grouping to default",children:"Reset Filters"})]})]}),r.jsx("div",{className:"table-responsive",ref:a,children:r.jsxs("table",{className:"planning-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[n&&r.jsx("th",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},children:r.jsx("input",{type:"checkbox",checked:y.length>0&&y.every(g=>Y.includes(g.line_item_id)),onChange:Ve})}),f.map((g,$)=>{const ne=$===0,te=x(g),K=v===g,H=l.indexOf(d),ye=l.indexOf(g);let me="";K&&H!==-1&&H!==ye&&(me=H<ye?" drag-over-right":" drag-over-left");let we={},Ie=`${d===g?" dragging":""}${me}`;return ne&&(Ie+=" col-sticky-first",we={left:n?"40px":0}),r.jsx("th",{className:Ie.trim(),style:we,draggable:!0,onDragStart:ue=>b(ue,g),onDragOver:ue=>w(ue,g),onDragLeave:ue=>_(ue,g),onDrop:ue=>S(ue,g),onDragEnd:z,children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(yg,{size:12,className:"drag-handle"}),r.jsx("span",{children:te})]})},g)})]})}),r.jsx("tbody",{children:y.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:f.length+(n?1:0),style:{textAlign:"center",padding:"32px",color:"#666",fontStyle:"italic"},children:"No planning records match your search criteria."})}):(()=>{const g=ce(y);if(g.type==="flat")return g.rows.map((ne,te)=>{const K=parseInt(ne.total_steps||0),H=parseInt(ne.done_steps||0),ye=K>0?Math.round(H/K*100):0;return St(ne,Zt+te+1,ye)});let $=Zt;return g.keys.map(ne=>{const te=g.groups[ne],K=`p:${ne}`,H=Te[K]!==!1;let ye=0;return te.type==="flat"?ye=te.rows.length:te.keys.forEach(me=>{ye+=te.groups[me].length}),r.jsxs(Wn.Fragment,{children:[r.jsx("tr",{className:"group-header-row primary",onClick:()=>xt(K),children:r.jsx("td",{colSpan:f.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content",children:[r.jsx("span",{className:"expand-icon",children:H?r.jsx(Lo,{size:14}):r.jsx(lo,{size:14})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[x(fe),":"]})," ",ne]}),r.jsxs("span",{className:"group-badge",children:[ye," items"]})]})})}),H&&(te.type==="flat"?te.rows.map(me=>{$++;const we=parseInt(me.total_steps||0),Ie=parseInt(me.done_steps||0),ue=we>0?Math.round(Ie/we*100):0;return St(me,$,ue)}):te.keys.map(me=>{const we=te.groups[me],Ie=`p:${ne}|s:${me}`,ue=Te[Ie]!==!1;return r.jsxs(Wn.Fragment,{children:[r.jsx("tr",{className:"group-header-row secondary",onClick:()=>xt(Ie),children:r.jsx("td",{colSpan:f.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content secondary-content",style:{paddingLeft:"24px"},children:[r.jsx("span",{className:"expand-icon",children:ue?r.jsx(Lo,{size:12}):r.jsx(lo,{size:12})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[x(q),":"]})," ",me]}),r.jsxs("span",{className:"group-badge secondary-badge",children:[we.length," items"]})]})})}),ue&&we.map(_t=>{$++;const Ea=parseInt(_t.total_steps||0),rs=parseInt(_t.done_steps||0),ns=Ea>0?Math.round(rs/Ea*100):0;return St(_t,$,ns)})]},Ie)}))]},K)})})()})]})}),r.jsxs("div",{className:"pagination-bar",children:[r.jsxs("div",{className:"pagination-info",children:[r.jsx("span",{className:"row-count",children:_r===0?"No records":`Showing ${Zt+1}–${Nn} of ${_r} records`}),r.jsxs("div",{className:"page-size-control",children:[r.jsx("span",{children:"Rows per page"}),r.jsx("select",{value:je,onChange:g=>za(g.target.value),children:ih.map(g=>r.jsx("option",{value:g,children:g},g))})]})]}),r.jsxs("div",{className:"pagination-nav",children:[r.jsx("button",{className:"pg-btn",onClick:()=>F(1),disabled:gt===1,title:"First page",children:r.jsx(fg,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>F(g=>Math.max(1,g-1)),disabled:gt===1,title:"Previous page",children:r.jsx(Dp,{size:14})}),oe().map(g=>r.jsx("button",{className:`pg-btn pg-num ${g===gt?"active":""}`,onClick:()=>F(g),children:g},g)),r.jsx("button",{className:"pg-btn",onClick:()=>F(g=>Math.min(Lt,g+1)),disabled:gt===Lt,title:"Next page",children:r.jsx(lo,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>F(Lt),disabled:gt===Lt,title:"Last page",children:r.jsx(mg,{size:14})})]})]}),j&&r.jsx("div",{className:"modal-overlay open",onClick:g=>{g.target.className==="modal-overlay open"&&N(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Order: ",j.order_number," — Unit Serial: ",j.specific_unit_serial||j.line_item_number," (PO: ",j.po_number||"N/A",")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>N(null),children:r.jsx(hn,{size:18})})]}),r.jsxs("form",{onSubmit:kn,className:"modal-body",children:[V&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(Io,{size:16}),r.jsx("span",{children:V})]}),R&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(El,{size:16}),r.jsx("span",{children:R})]}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",name:"planned_dispatch_date",value:B.planned_dispatch_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",name:"mounting_start_date",value:B.mounting_start_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",name:"mounting_complete_date",value:B.mounting_complete_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",name:"wiring_assigned_date",value:B.wiring_assigned_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",name:"wiring_expected_date",value:B.wiring_expected_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",name:"expected_qc_date",value:B.expected_qc_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Overall Planning Status"}),r.jsxs("select",{name:"status",value:B.status,onChange:kt,className:"form-select",children:[r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",name:"qc_date",value:B.qc_date,onChange:kt,className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>N(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Save Planning Changes"})]})]})]})}),Y.length>0&&r.jsx("div",{className:"bulk-actions-banner",children:r.jsxs("div",{className:"bulk-actions-content",children:[r.jsxs("span",{className:"bulk-count",children:[r.jsx("strong",{children:Y.length})," items selected"]}),r.jsxs("div",{className:"bulk-buttons",children:[r.jsx("button",{className:"btn-bulk-edit",onClick:()=>{ve({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),Z(!0)},children:"Bulk Edit Parameters"}),r.jsx("button",{className:"btn-bulk-clear",onClick:()=>E([]),children:"Deselect All"})]})]})}),M&&r.jsx("div",{className:"modal-overlay open",onClick:g=>{g.target.className==="modal-overlay open"&&Z(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"560px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Updating ",Y.length," selected line items"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>Z(!1),children:r.jsx(hn,{size:18})})]}),r.jsxs("form",{onSubmit:He,className:"modal-body",children:[V&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(Io,{size:16}),r.jsx("span",{children:V})]}),R&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(El,{size:16}),r.jsx("span",{children:R})]}),r.jsx("p",{className:"bulk-instructions",children:"Enter values or select options for parameters you want to update for all selected items. Blank fields will remain unchanged."}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",value:se.planned_dispatch_date,onChange:g=>ve({...se,planned_dispatch_date:g.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",value:se.mounting_start_date,onChange:g=>ve({...se,mounting_start_date:g.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",value:se.mounting_complete_date,onChange:g=>ve({...se,mounting_complete_date:g.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",value:se.wiring_assigned_date,onChange:g=>ve({...se,wiring_assigned_date:g.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",value:se.wiring_expected_date,onChange:g=>ve({...se,wiring_expected_date:g.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",value:se.expected_qc_date,onChange:g=>ve({...se,expected_qc_date:g.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planning Status"}),r.jsxs("select",{value:se.status,onChange:g=>ve({...se,status:g.target.value}),className:"form-select",children:[r.jsx("option",{value:"",children:"Leave unchanged"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",value:se.qc_date,onChange:g=>ve({...se,qc_date:g.target.value}),className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>Z(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Apply Bulk Changes"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
          cursor: grab;
        }
        .table-responsive.active-drag {
          cursor: grabbing;
          user-select: none;
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

        .reset-filters-btn {
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
        .reset-filters-btn:hover {
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
          content: '';
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
      `}})]})}function ch(){const[e,t]=p.useState(()=>localStorage.getItem("erp_company_name")||"Vyom Process Flow"),[n,a]=p.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing"),[o,s]=p.useState(()=>localStorage.getItem("erp_timezone")||"IST (UTC+05:30)"),[l,i]=p.useState(()=>localStorage.getItem("erp_default_page_size")||"20"),[d,u]=p.useState(()=>localStorage.getItem("erp_double_grouping")!=="false"),[v,m]=p.useState(()=>localStorage.getItem("erp_auto_qc_calc")==="true"),[b,w]=p.useState(()=>localStorage.getItem("erp_planning_fs_default")==="true"),[_,S]=p.useState("1"),[z,x]=p.useState(!0),[f,c]=p.useState(""),[k,I]=p.useState(!1),[D,C]=p.useState(!1),L=localStorage.getItem("token"),[P,h]=p.useState("general"),[T,j]=p.useState(!1),[N,B]=p.useState(!1),[A,V]=p.useState(""),[U,R]=p.useState(!1);p.useEffect(()=>{fetch(window.API_BASE+"/api/system-settings",{headers:{Authorization:`Bearer ${L}`}}).then(M=>M.json()).then(M=>{M.order_number_start&&S(M.order_number_start),x(!!M._orders_exist)}).catch(()=>{})},[L]);const J=async()=>{c(""),C(!1);const M=parseInt(_);if(isNaN(M)||M<1){c("Please enter a valid positive number.");return}I(!0);try{const Z=await fetch(window.API_BASE+"/api/system-settings",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${L}`},body:JSON.stringify({order_number_start:M})}),le=await Z.json();Z.ok?(C(!0),setTimeout(()=>C(!1),3e3)):c(le.error||"Failed to save.")}catch{c("Network error.")}finally{I(!1)}},Y=async M=>{M.preventDefault(),j(!0),B(!1),setTimeout(()=>{localStorage.setItem("erp_company_name",e),localStorage.setItem("erp_system_title",n),localStorage.setItem("erp_timezone",o),localStorage.setItem("erp_default_page_size",l),localStorage.setItem("erp_double_grouping",d?"true":"false"),localStorage.setItem("erp_auto_qc_calc",v?"true":"false"),localStorage.setItem("erp_planning_fs_default",b?"true":"false"),j(!1),B(!0),window.dispatchEvent(new CustomEvent("erpSettingsUpdated")),setTimeout(()=>B(!1),3e3)},800)},E=M=>{window.confirm(`Are you sure you want to run: "${M}"? This action cannot be undone.`)&&(R(!0),V(""),setTimeout(()=>{R(!1),M==="Clear Activity Logs"?V("Activity logs cleared successfully (simulated)."):M==="Reset Database"?V("Database reset and re-seeded successfully."):M==="Backup Database"&&V("Database backup generated: vyom_erp_backup_"+new Date().toISOString().split("T")[0]+".sql"),setTimeout(()=>V(""),5e3)},1200))};return r.jsxs("div",{style:{padding:"24px"},className:"settings-container",children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Dl,{size:22,style:{color:"#f59e0b"}}),"Administration Settings"]})}),r.jsxs("div",{className:"settings-layout",children:[r.jsxs("div",{className:"settings-tabs",children:[r.jsxs("button",{className:`tab-btn ${P==="general"?"active":""}`,onClick:()=>h("general"),children:[r.jsx(Lg,{size:14}),"General Setup"]}),r.jsxs("button",{className:`tab-btn ${P==="workflow"?"active":""}`,onClick:()=>h("workflow"),children:[r.jsx(Dl,{size:14}),"Workflow & Features"]}),r.jsxs("button",{className:`tab-btn ${P==="maintenance"?"active":""}`,onClick:()=>h("maintenance"),children:[r.jsx(Tg,{size:14}),"System Maintenance"]})]}),r.jsxs("div",{className:"settings-content",children:[P==="general"&&r.jsxs(r.Fragment,{children:[r.jsxs("form",{onSubmit:Y,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"General System Configurations"}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Company Name (Logo Text)"}),r.jsx("input",{type:"text",value:e,onChange:M=>t(M.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"This label appears on the top-left logo header."})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"System/Factory Title"}),r.jsx("input",{type:"text",value:n,onChange:M=>a(M.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"Descriptive subtitle shown next to the logo."})]}),r.jsxs("div",{className:"form-row",children:[r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"System Timezone"}),r.jsxs("select",{value:o,onChange:M=>s(M.target.value),children:[r.jsx("option",{value:"IST (UTC+05:30)",children:"India Standard Time (IST)"}),r.jsx("option",{value:"UTC",children:"Coordinated Universal Time (UTC)"}),r.jsx("option",{value:"EST (UTC-05:00)",children:"Eastern Standard Time (EST)"}),r.jsx("option",{value:"GMT",children:"Greenwich Mean Time (GMT)"})]})]}),r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"Default Page Size"}),r.jsxs("select",{value:l,onChange:M=>i(M.target.value),children:[r.jsx("option",{value:"10",children:"10 Rows per page"}),r.jsx("option",{value:"20",children:"20 Rows per page"}),r.jsx("option",{value:"50",children:"50 Rows per page"}),r.jsx("option",{value:"100",children:"100 Rows per page"})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:T,children:[T?r.jsx(Ht,{size:14,className:"spin"}):r.jsx(Ps,{size:14}),T?"Saving...":"Save Settings"]}),N&&r.jsxs("span",{className:"success-msg",children:[r.jsx(Qa,{size:14})," Settings updated successfully!"]})]})]}),r.jsxs("div",{style:{marginTop:"28px",padding:"20px 24px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px"},children:[r.jsxs("h3",{style:{margin:"0 0 6px 0",color:"var(--text)",fontSize:"15px",display:"flex",alignItems:"center",gap:"8px"},children:[r.jsx(bg,{size:16,style:{color:"#f59e0b"}}),"Order Number Sequence"]}),r.jsxs("p",{style:{margin:"0 0 16px 0",color:"var(--text3)",fontSize:"13px"},children:["Set the starting order number for this system. ",r.jsx("strong",{style:{color:"#f59e0b"},children:"Once the first order is created, this setting is permanently locked."})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",background:"var(--bg3)",border:`1px solid ${z?"var(--border)":"#f59e0b"}`,borderRadius:"8px",padding:"8px 14px"},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:"13px",whiteSpace:"nowrap"},children:`${String(new Date().getFullYear()%100).padStart(2,"0")}${String((new Date().getFullYear()+1)%100).padStart(2,"0")}`}),r.jsx("input",{type:"number",min:"1",value:_,onChange:M=>{S(M.target.value),c("")},disabled:z,style:{width:"90px",background:"transparent",border:"none",outline:"none",color:z?"var(--text3)":"var(--text)",fontSize:"15px",fontWeight:"700",cursor:z?"not-allowed":"text"}})]}),z?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",color:"#94a3b8",fontSize:"13px"},children:[r.jsx(rn,{size:14}),"Locked — orders already exist"]}):r.jsxs("button",{type:"button",onClick:J,disabled:k,style:{display:"flex",alignItems:"center",gap:"6px",background:"#f59e0b",color:"#000",border:"none",borderRadius:"8px",padding:"9px 18px",fontWeight:"600",fontSize:"13px",cursor:"pointer"},children:[k?r.jsx(Ht,{size:13,className:"spin"}):r.jsx(Ps,{size:13}),k?"Saving...":"Set Starting Number"]}),D&&r.jsxs("span",{style:{display:"flex",alignItems:"center",gap:"6px",color:"#10b981",fontSize:"13px"},children:[r.jsx(Qa,{size:14})," Saved! Next order will be ",`${String(new Date().getFullYear()%100).padStart(2,"0")}${String((new Date().getFullYear()+1)%100).padStart(2,"0")}`,String(_).padStart(4,"0")]})]}),f&&r.jsx("p",{style:{margin:"10px 0 0",color:"#ef4444",fontSize:"12px"},children:f})]})]}),P==="workflow"&&r.jsxs("form",{onSubmit:Y,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"Planning Module & Workflow Toggles"}),r.jsxs("div",{className:"toggle-group",children:[r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"enableDoubleGrouping",checked:d,onChange:M=>u(M.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"enableDoubleGrouping",children:"Enable Double Grouping Filter"}),r.jsx("span",{className:"toggle-desc",children:"Allows planning board users to apply a secondary group parameter simultaneously."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"autoQCFromSteps",checked:v,onChange:M=>m(M.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"autoQCFromSteps",children:"Auto-calculate QC Status"}),r.jsx("span",{className:"toggle-desc",children:"Automatically update line item QC status to completed when all QC department steps are checked off."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"planningFullscreenDefault",checked:b,onChange:M=>w(M.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"planningFullscreenDefault",children:"Planning Board Fullscreen by Default"}),r.jsx("span",{className:"toggle-desc",children:"Loads the Planning Module in fullscreen mode automatically."})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:T,children:[T?r.jsx(Ht,{size:14,className:"spin"}):r.jsx(Ps,{size:14}),T?"Saving...":"Save Settings"]}),N&&r.jsxs("span",{className:"success-msg",children:[r.jsx(Qa,{size:14})," Workflow updated successfully!"]})]})]}),P==="maintenance"&&r.jsxs("div",{className:"settings-form",children:[r.jsx("h3",{className:"section-title text-danger",children:"System Operations & Diagnostics"}),r.jsx("p",{className:"danger-notice",children:"WARNING: The operations below are administrative privileges. Running them can modify systemic operational states or reset logging indices."}),r.jsxs("div",{className:"maintenance-actions",children:[r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Database Backup"}),r.jsx("p",{children:"Generate a complete SQL schema and data export dump for emergency recovery."})]}),r.jsx("button",{onClick:()=>E("Backup Database"),className:"maint-btn secondary",disabled:U,children:"Backup DB"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Clear Activity Logs"}),r.jsx("p",{children:"Trims or wipes the system activity logger history database to conserve resources."})]}),r.jsx("button",{onClick:()=>E("Clear Activity Logs"),className:"maint-btn warning",disabled:U,children:"Wipe Logs"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Factory Reset ERP"}),r.jsx("p",{children:"Re-seeds and formats databases to standard template values (removes testing orders)."})]}),r.jsx("button",{onClick:()=>E("Reset Database"),className:"maint-btn danger",disabled:U,children:"Factory Reset"})]})]}),U&&r.jsxs("div",{className:"maintenance-loader",children:[r.jsx(Ht,{size:18,className:"spin"})," Running operations..."]}),A&&r.jsxs("div",{className:"maintenance-result",children:[r.jsx(Qa,{size:14})," ",A]})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const rc={Urgent:{color:"#ef4444",bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.3)"},High:{color:"#f59e0b",bg:"rgba(245,158,11,0.12)",border:"rgba(245,158,11,0.3)"},Medium:{color:"#3b82f6",bg:"rgba(59,130,246,0.12)",border:"rgba(59,130,246,0.3)"},Low:{color:"#6b7280",bg:"rgba(107,114,128,0.12)",border:"rgba(107,114,128,0.3)"}},Bo={done:{label:"Done",color:"#10b981",bg:"rgba(16,185,129,0.12)",icon:"✓"},inprogress:{label:"In Progress",color:"#f59e0b",bg:"rgba(245,158,11,0.12)",icon:"◉"},pending:{label:"Pending",color:"#6b7280",bg:"rgba(107,114,128,0.12)",icon:"○"},blocked:{label:"Blocked",color:"#ef4444",bg:"rgba(239,68,68,0.12)",icon:"✕"},review:{label:"Review",color:"#8b5cf6",bg:"rgba(139,92,246,0.12)",icon:"⟳"}},uh={Design:"#6366f1",Purchase:"#f59e0b",Stores:"#10b981",Production:"#3b82f6",QC:"#8b5cf6",Dispatch:"#ec4899",Accounts:"#14b8a6",Sales:"#f97316"};function ph({step:e,onStatusChange:t,canEdit:n}){const a=Bo[e.status]||Bo.pending;return r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:20,background:a.bg,border:`1px solid ${a.color}33`,fontSize:11,color:a.color,fontWeight:600},children:[r.jsx("span",{children:a.icon}),r.jsx("span",{children:e.name}),n&&r.jsxs("select",{value:e.status,onChange:o=>t(e.id,o.target.value),onClick:o=>o.stopPropagation(),style:{background:"transparent",border:"none",color:a.color,fontSize:10,cursor:"pointer",outline:"none",padding:0},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]})]})}function fh({unit:e,dept:t,onStepStatusChange:n,users:a,currentUser:o}){const[s,l]=p.useState(!1),i=e.dept_steps||[],d=i.filter(w=>w.status==="done").length,u=d===i.length&&i.length>0,v=i.some(w=>w.status==="blocked"),m=w=>{var _,S,z;return["admin","manager"].includes((_=o.role)==null?void 0:_.toLowerCase())||((S=w.dept)==null?void 0:S.toLowerCase())===((z=o.role)==null?void 0:z.toLowerCase())},b=v?"var(--red)":u?"var(--green)":"transparent";return r.jsxs(r.Fragment,{children:[r.jsxs("tr",{onClick:()=>l(w=>!w),style:{cursor:"pointer",borderLeft:`3px solid ${b}`,background:s?"var(--bg3)":"transparent",transition:"background 0.15s"},className:"worklist-row",children:[r.jsxs("td",{style:{padding:"10px 14px"},children:[r.jsx("div",{style:{fontFamily:"monospace",fontWeight:700,color:"var(--text)",fontSize:13},children:e.order_number}),e.company_name&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:11,marginTop:2},children:[e.company_name,e.company_city?` · ${e.company_city}`:""]}),e.po_number&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:11,marginTop:1,fontFamily:"monospace"},children:["PO: ",e.po_number]}),e.reference_number&&r.jsxs("div",{style:{color:"#f59e0b",fontSize:10,marginTop:1,fontWeight:600},children:["Ref: ",e.reference_number]})]}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"monospace",fontWeight:700,color:"var(--text)",fontSize:13},children:e.unit_serial}),r.jsxs("td",{style:{padding:"10px 14px",color:"var(--text2)",fontSize:12},children:[e.material_description,e.part_number&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:10,marginTop:2},children:["Part: ",e.part_number]})]}),r.jsx("td",{style:{padding:"10px 14px"},children:(()=>{const w=rc[e.priority]||rc.Medium;return r.jsx("span",{style:{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:w.bg,color:w.color,border:`1px solid ${w.border}`,textTransform:"uppercase",letterSpacing:.5},children:e.priority})})()}),r.jsx("td",{style:{padding:"10px 14px",fontSize:11,color:"var(--text2)"},children:e.delivery_date?new Date(e.delivery_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"N/A"}),r.jsx("td",{style:{padding:"10px 14px"},children:r.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:i.length===0?r.jsx("span",{style:{color:"#475569",fontSize:11,fontStyle:"italic"},children:"No steps"}):i.map(w=>r.jsx(ph,{step:w,canEdit:m(w),onStatusChange:(_,S)=>n(e.unit_id,_,S)},w.id))})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:u?"var(--green)":v?"var(--red)":"var(--text2)"},children:[u?r.jsx(El,{size:13}):v?r.jsx(Io,{size:13}):r.jsx(Pp,{size:13}),d,"/",i.length]})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{color:"var(--text3)",display:"inline-flex",alignItems:"center"},children:s?r.jsx(Lo,{size:14}):r.jsx(lo,{size:14})})})]}),s&&i.length>0&&r.jsx("tr",{style:{background:"var(--bg3)"},children:r.jsx("td",{colSpan:8,style:{padding:"12px 24px 16px 24px"},children:r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:i.map(w=>{const _=Bo[w.status]||Bo.pending,S=a.find(z=>z.id===w.assigned_user_id);return r.jsxs("div",{style:{background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[r.jsxs("div",{children:[r.jsx("div",{style:{fontWeight:600,color:"var(--text)",fontSize:13},children:w.name}),w.notes&&r.jsx("div",{style:{color:"var(--text3)",fontSize:11,marginTop:2,fontStyle:"italic"},children:w.notes}),S&&r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4,marginTop:4,color:"var(--green)",fontSize:11},children:[r.jsx(ts,{size:10}),S.username]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[w.updated&&r.jsx("span",{style:{color:"var(--text3)",fontSize:10},children:w.updated}),m(w)?r.jsxs("select",{value:w.status,onChange:z=>n(e.unit_id,w.id,z.target.value),style:{background:_.bg,border:`1px solid ${_.color}44`,color:_.color,fontSize:11,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontWeight:600,outline:"none"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("span",{style:{background:_.bg,border:`1px solid ${_.color}44`,color:_.color,fontSize:11,borderRadius:6,padding:"4px 8px",fontWeight:600},children:_.label})]})]},w.id)})})})})]})}function mh({dept:e}){var L;const[t,n]=p.useState([]),[a,o]=p.useState([]),[s,l]=p.useState(!0),[i,d]=p.useState(!1),[u,v]=p.useState("all"),[m,b]=p.useState(""),w=localStorage.getItem("token"),_=JSON.parse(localStorage.getItem("user")||"{}");["admin","manager",e==null?void 0:e.toLowerCase()].includes((L=_.role)==null?void 0:L.toLowerCase());const S=uh[e]||"#6366f1",z=React.useRef(null);p.useEffect(()=>{const P=z.current;if(!P)return;let h=!1,T,j;const N=U=>{["INPUT","SELECT","OPTION","BUTTON","A","TH"].includes(U.target.tagName)||U.target.closest("th")||U.target.closest("button")||(h=!0,P.classList.add("active-drag"),T=U.pageX-P.offsetLeft,j=P.scrollLeft)},B=()=>{h=!1,P.classList.remove("active-drag")},A=()=>{h=!1,P.classList.remove("active-drag")},V=U=>{if(!h)return;U.preventDefault();const J=(U.pageX-P.offsetLeft-T)*1.5;P.scrollLeft=j-J};return P.addEventListener("mousedown",N),P.addEventListener("mouseleave",B),P.addEventListener("mouseup",A),P.addEventListener("mousemove",V),()=>{P.removeEventListener("mousedown",N),P.removeEventListener("mouseleave",B),P.removeEventListener("mouseup",A),P.removeEventListener("mousemove",V)}},[]);const x=p.useCallback(async(P=!1)=>{P?d(!0):l(!0);try{const[h,T]=await Promise.all([fetch(`${window.API_BASE}/api/dept-worklist/${encodeURIComponent(e)}`,{headers:{Authorization:`Bearer ${w}`}}),fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${w}`}})]);h.ok&&n(await h.json()),T.ok&&o(await T.json())}finally{l(!1),d(!1)}},[e,w]);p.useEffect(()=>{x()},[x]),p.useEffect(()=>{const P=()=>x(!0);return window.addEventListener("orderUpdated",P),()=>window.removeEventListener("orderUpdated",P)},[x]);const f=async(P,h,T)=>{try{(await fetch(`${window.API_BASE}/api/units/${P}/steps/${h}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify({status:T})})).ok&&(n(N=>N.map(B=>B.unit_id!==P?B:{...B,dept_steps:(B.dept_steps||[]).map(A=>A.id===h?{...A,status:T}:A)})),window.dispatchEvent(new CustomEvent("orderUpdated")))}catch(j){console.error("Failed to update step",j)}},c=t.filter(P=>{if(m.trim()!==""){const h=m.trim().toLowerCase().split(/\s+/),T=(P.unit_serial||"").toLowerCase(),j=(P.order_number||"").toLowerCase(),N=(P.material_description||"").toLowerCase(),B=(P.company_name||"").toLowerCase(),A=(P.reference_number||"").toLowerCase(),V=(P.po_number||"").toLowerCase();if(!h.every(R=>T.includes(R)||j.includes(R)||N.includes(R)||B.includes(R)||A.includes(R)||V.includes(R)))return!1}if(u==="done"){const h=P.dept_steps||[];return h.length>0&&h.every(T=>T.status==="done")}if(u==="inprogress")return(P.dept_steps||[]).some(T=>T.status==="inprogress");if(u==="pending"){const h=P.dept_steps||[];return h.every(T=>T.status==="pending")||h.length===0}return!0}),k=t.length,I=t.filter(P=>(P.dept_steps||[]).every(h=>h.status==="done")&&(P.dept_steps||[]).length>0).length,D=t.filter(P=>(P.dept_steps||[]).some(h=>h.status==="inprogress")).length,C=t.filter(P=>(P.dept_steps||[]).some(h=>h.status==="blocked")).length;return s?r.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:300,gap:16},children:[r.jsx("div",{style:{width:48,height:48,border:`3px solid ${S}33`,borderTopColor:S,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:14},children:["Loading ",e," worklist..."]}),r.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}):r.jsxs("div",{style:{padding:"4px 0"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12},children:[r.jsx("div",{style:{display:"flex",alignItems:"center",gap:12},children:r.jsxs("div",{children:[r.jsxs("h2",{style:{margin:0,color:"var(--text)",fontSize:20,fontWeight:800},children:[e," Worklist"]}),r.jsx("div",{style:{color:"var(--text3)",fontSize:12,marginTop:2},children:e==="Sales"?`${k} unit${k!==1?"s":""} total in system`:`${k} unit${k!==1?"s":""} currently in ${e}`})]})}),r.jsxs("button",{onClick:()=>x(!0),disabled:i,style:{display:"flex",alignItems:"center",gap:6,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:12,borderRadius:8,padding:"7px 14px",cursor:"pointer",transition:"all 0.2s"},children:[r.jsx(Ht,{size:13,style:{animation:i?"spin 0.8s linear infinite":"none"}}),"Refresh"]})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:12,marginBottom:20},children:[{label:"Total Units",value:k,color:S},{label:"In Progress",value:D,color:"#f59e0b"},{label:"Completed",value:I,color:"#10b981"},{label:"Blocked",value:C,color:"#ef4444"}].map(P=>r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",textAlign:"center",borderTop:`2px solid ${P.color}55`},children:[r.jsx("div",{style:{fontSize:24,fontWeight:800,color:P.color},children:P.value}),r.jsx("div",{style:{fontSize:11,color:"var(--text3)",marginTop:2,textTransform:"uppercase",letterSpacing:.5},children:P.label})]},P.label))}),r.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"},children:[r.jsx("input",{type:"text",placeholder:"Search by unit ID, order, item, client...",value:m,onChange:P=>b(P.target.value),style:{flex:1,minWidth:220,background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,padding:"9px 14px",color:"var(--text)",fontSize:13,outline:"none",transition:"border-color 0.2s"},onFocus:P=>P.target.style.borderColor=S,onBlur:P=>P.target.style.borderColor="var(--border2)"}),r.jsx("div",{style:{display:"flex",background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,overflow:"hidden"},children:["all","pending","inprogress","done"].map(P=>r.jsx("button",{onClick:()=>v(P),style:{padding:"9px 14px",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:u===P?S:"transparent",color:u===P?"#fff":"var(--text2)",textTransform:"capitalize",transition:"all 0.15s"},children:P==="inprogress"?"In Progress":P.charAt(0).toUpperCase()+P.slice(1)},P))})]}),c.length===0&&r.jsxs("div",{style:{textAlign:"center",padding:"60px 20px",background:"var(--bg2)",borderRadius:12,border:"1px solid var(--border)"},children:[r.jsx("div",{style:{color:"var(--text)",fontWeight:700,fontSize:18,marginBottom:6},children:m||u!=="all"?"No matching units":e==="Sales"?"No units in the system":`No units in ${e}`}),r.jsx("div",{style:{color:"var(--text3)",fontSize:13},children:m||u!=="all"?"Try adjusting your search or filter.":`All ${e} tasks are complete or no units have been assigned yet.`})]}),c.length>0&&r.jsx("div",{ref:z,className:"worklist-table-container",style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,overflowX:"auto",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"var(--bg3)",borderBottom:"1px solid var(--border)"},children:[r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Order Info"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Unit ID"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Item Details"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Priority"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Delivery Date"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Tasks"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"center",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Progress"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"center",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Expand"})]})}),r.jsx("tbody",{children:c.map(P=>r.jsx(fh,{unit:P,dept:e,onStepStatusChange:f,users:a,currentUser:_},P.unit_id))})]})}),r.jsx("style",{children:`
        .worklist-row:hover { background: rgba(255,255,255,0.03) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .worklist-table-container {
          cursor: grab;
        }
        .worklist-table-container.active-drag {
          cursor: grabbing;
          user-select: none;
        }
      `})]})}const xh=["All","General","PO","Quotation","BOM","Drawing","QC Report","Dispatch Document","Photo"];function gh(){const[e,t]=p.useState({orders:[],documents:[]}),[n,a]=p.useState(""),[o,s]=p.useState("All"),[l,i]=p.useState("All"),[d,u]=p.useState(!1),[v,m]=p.useState({}),b=localStorage.getItem("token"),w=JSON.parse(localStorage.getItem("user")||"{}");p.useEffect(()=>{_()},[]);const _=async()=>{u(!0);try{const C=await fetch(window.API_BASE+"/api/documents/directory",{headers:{Authorization:`Bearer ${b}`}});if(C.ok){const L=await C.json();t(L)}}catch(C){console.error("Failed to fetch document directory",C)}finally{u(!1)}},S=async(C,L)=>{if(C.stopPropagation(),!!window.confirm("Are you sure you want to delete this document?"))try{const P=await fetch(`${window.API_BASE}/api/documents/${L}`,{method:"DELETE",headers:{Authorization:`Bearer ${b}`}});if(P.ok)t(h=>({...h,documents:h.documents.filter(T=>T.id!==L)}));else{const h=await P.json();alert(h.error||"Failed to delete document")}}catch(P){console.error("Delete error:",P),alert("Network error during deletion")}},z=C=>{switch(C==null?void 0:C.toLowerCase()){case"sales":return{background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",border:"1px solid rgba(59, 130, 246, 0.2)"};case"design":return{background:"rgba(167, 139, 250, 0.1)",color:"#a78bfa",border:"1px solid rgba(167, 139, 250, 0.2)"};case"purchase":return{background:"rgba(249, 115, 22, 0.1)",color:"#f97316",border:"1px solid rgba(249, 115, 22, 0.2)"};case"stores":return{background:"rgba(45, 212, 191, 0.1)",color:"#2dd4bf",border:"1px solid rgba(45, 212, 191, 0.2)"};case"production":return{background:"rgba(239, 68, 68, 0.1)",color:"#ef4444",border:"1px solid rgba(239, 68, 68, 0.2)"};case"qc":return{background:"rgba(34, 197, 94, 0.1)",color:"#22c55e",border:"1px solid rgba(34, 197, 94, 0.2)"};case"dispatch":return{background:"rgba(245, 158, 11, 0.1)",color:"#f59e0b",border:"1px solid rgba(245, 158, 11, 0.2)"};case"accounts":return{background:"rgba(14, 165, 233, 0.1)",color:"#0ea5e9",border:"1px solid rgba(14, 165, 233, 0.2)"};default:return{background:"rgba(255, 255, 255, 0.05)",color:"#888",border:"1px solid rgba(255, 255, 255, 0.1)"}}},x=C=>{switch(C==null?void 0:C.toUpperCase()){case"PO":return{background:"rgba(245, 158, 11, 0.15)",color:"#fbbf24",border:"1px solid rgba(245,158,11,0.3)"};case"QUOTATION":return{background:"rgba(59, 130, 246, 0.15)",color:"#60a5fa",border:"1px solid rgba(59,130,246,0.3)"};case"BOM":return{background:"rgba(45, 212, 191, 0.15)",color:"#2dd4bf",border:"1px solid rgba(45,212,191,0.3)"};case"DRAWING":return{background:"rgba(167, 139, 250, 0.15)",color:"#c084fc",border:"1px solid rgba(167,139,250,0.3)"};case"QC REPORT":return{background:"rgba(34, 197, 94, 0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.3)"};default:return{background:"rgba(255, 255, 255, 0.08)",color:"#e8eaf0",border:"1px solid rgba(255,255,255,0.15)"}}},f=C=>{const L=new Date(C);return L.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+" "+L.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},c=C=>{m(L=>({...L,[C]:!L[C]}))},k=e.documents.filter(C=>{if(o!=="All"&&C.uploader_role!==o||l!=="All"&&C.doc_type!==l)return!1;if(n.trim()!==""){const L=n.trim().toLowerCase().split(/\s+/),P=(C.file_name||"").toLowerCase(),h=(C.uploader_username||"").toLowerCase(),T=(C.source_details||"").toLowerCase(),j=e.orders.find(U=>Number(U.id)===Number(C.order_id)),N=((j==null?void 0:j.order_number)||"").toLowerCase(),B=((j==null?void 0:j.po_number)||"").toLowerCase(),A=((j==null?void 0:j.company_name)||"").toLowerCase(),V=((j==null?void 0:j.end_client_name)||"").toLowerCase();return L.every(U=>P.includes(U)||h.includes(U)||T.includes(U)||N.includes(U)||B.includes(U)||A.includes(U)||V.includes(U))}return!0}),I=e.orders.map(C=>{const L=k.filter(P=>Number(P.order_id)===Number(C.id));return{...C,docs:L}}).filter(C=>{if(n||o!=="All"||l!=="All"){if(n.trim()!==""){const L=n.trim().toLowerCase().split(/\s+/),P=(C.order_number||"").toLowerCase(),h=(C.po_number||"").toLowerCase(),T=(C.company_name||"").toLowerCase(),j=(C.end_client_name||"").toLowerCase();if(L.every(A=>P.includes(A)||h.includes(A)||T.includes(A)||j.includes(A))&&!(o!=="All"||l!=="All"))return!0}return C.docs.length>0}return!0}),D=k.length;return r.jsxs("div",{style:{padding:"24px"},children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px",fontSize:"18px",fontWeight:600},children:[r.jsx(vg,{size:22,style:{color:"#f59e0b"}}),"Order Document Directory"]})}),r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"16px",flex:1,minWidth:"300px"},children:[r.jsxs("div",{style:{position:"relative",flex:1,minWidth:"220px"},children:[r.jsx(Mr,{size:16,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("input",{type:"text",placeholder:"Search by file name, uploader, details...",value:n,onChange:C=>a(C.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 38px",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},className:"doc-search-input"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(Ei,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:o,onChange:C=>s(C.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"All",children:"All Departments"}),r.jsx("option",{value:"Sales",children:"Sales"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"}),r.jsx("option",{value:"Accounts",children:"Accounts"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(Ao,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("select",{value:l,onChange:C=>i(C.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:xh.map(C=>r.jsx("option",{value:C==="All"?"All":C,children:C==="All"?"All Document Tags":C},C))}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[(n||o!=="All"||l!=="All")&&r.jsx("button",{onClick:()=>{a(""),s("All"),i("All")},style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"var(--red)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",transition:"all 0.2s"},className:"clear-btn",children:"Clear Filters"}),r.jsxs("button",{onClick:_,disabled:d,style:{background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",transition:"all 0.2s"},className:"refresh-btn",children:[r.jsx(Ht,{size:14,className:d?"spin":""}),d?"Loading...":"Refresh"]})]})]}),r.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:"16px",fontSize:"12px",color:"var(--text2)"},children:r.jsxs("div",{children:["Showing documents for ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:"600"},children:I.length})," orders"," ","(",r.jsx("span",{style:{color:"#fff",fontWeight:"600"},children:D})," documents match filters)"]})}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:d&&e.orders.length===0?r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"64px",textAlign:"center",color:"var(--text2)"},children:[r.jsx(Ht,{size:24,className:"spin",style:{margin:"0 auto 12px",color:"var(--accent)",display:"block"}}),"Loading Document Directory..."]}):I.length===0?r.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"48px",textAlign:"center",color:"var(--text3)"},children:"No orders or documents match the current filters."}):I.map(C=>{const L=v[C.id]!==!0,P=C.docs.length>0;return r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden",transition:"border-color 0.2s"},className:"order-card",children:[r.jsxs("div",{onClick:()=>c(C.id),style:{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:"rgba(255, 255, 255, 0.01)",borderBottom:L?"none":"1px solid var(--border)"},className:"order-card-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"},children:[r.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"13px",background:"rgba(245,158,11,0.1)",color:"var(--accent)",padding:"4px 10px",borderRadius:"6px",border:"1px solid rgba(245,158,11,0.2)",fontWeight:600},children:C.order_number}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px",fontFamily:"var(--font-mono)"},children:"PO:"}),r.jsx("span",{style:{color:"#fff",fontSize:"13px",fontFamily:"var(--font-mono)",fontWeight:500},children:C.po_number||"—"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px"},children:"Client:"}),r.jsx("span",{style:{color:"var(--text2)",fontSize:"13px",fontWeight:500},children:C.company_name||C.end_client_name||"—"})]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsxs("span",{style:{fontSize:"11px",background:P?"rgba(34, 197, 94, 0.1)":"rgba(255,255,255,0.03)",color:P?"var(--green)":"var(--text3)",padding:"3px 8px",borderRadius:"20px",border:P?"1px solid rgba(34, 197, 94, 0.2)":"1px solid var(--border)"},children:[C.docs.length," document",C.docs.length!==1?"s":""]}),r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px",transition:"transform 0.2s",transform:L?"rotate(0deg)":"rotate(180deg)"},children:"▼"})]})]}),!L&&r.jsx("div",{style:{padding:"20px"},children:P?r.jsx("div",{style:{overflowX:"auto"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"13px",textAlign:"left"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{borderBottom:"1px solid var(--border2)",color:"var(--text2)"},children:[r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Document Name"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Tag"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Uploading Dept"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Uploaded By"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Source Context"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Date & Time"}),r.jsx("th",{style:{padding:"10px 12px",textAlign:"right"},children:"Actions"})]})}),r.jsx("tbody",{children:C.docs.map(h=>{var B;const T=h.uploaded_by===w.id||["admin","manager"].includes((B=w.role)==null?void 0:B.toLowerCase()),j=h.file_path.split(/[\/\\]/).pop(),N=`${window.API_BASE}/uploads/${j}?token=${b}`;return r.jsxs("tr",{className:"doc-row",style:{borderBottom:"1px solid var(--border)"},children:[r.jsx("td",{style:{padding:"12px"},children:r.jsxs("a",{href:N,target:"_blank",rel:"noopener noreferrer",style:{color:"#fff",textDecoration:"none",display:"flex",alignItems:"center",gap:"8px",fontWeight:500},className:"doc-file-link",children:[r.jsx(Ao,{size:16,style:{color:"var(--text3)",flexShrink:0}}),r.jsx("span",{style:{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap",maxWidth:"280px"},title:h.file_name,children:h.file_name}),r.jsxs("span",{style:{fontSize:"10px",color:"var(--text3)"},children:["(",(h.file_size/1024).toFixed(1)," KB)"]})]})}),r.jsx("td",{style:{padding:"12px"},children:r.jsx("span",{style:{fontSize:"10px",fontWeight:600,padding:"2px 8px",borderRadius:"4px",textTransform:"uppercase",display:"inline-block",...x(h.doc_type)},children:h.doc_type})}),r.jsx("td",{style:{padding:"12px"},children:r.jsx("span",{style:{fontSize:"11px",fontWeight:500,padding:"2px 8px",borderRadius:"12px",display:"inline-block",...z(h.uploader_role)},children:h.uploader_role||"System"})}),r.jsx("td",{style:{padding:"12px",color:"var(--text2)"},children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(ts,{size:13,style:{color:"var(--text3)"}}),r.jsx("span",{children:h.uploader_username||"system"})]})}),r.jsx("td",{style:{padding:"12px",color:"var(--text2)",fontStyle:h.source_details==="Order Level"?"italic":"normal"},children:h.source_details}),r.jsx("td",{style:{padding:"12px",color:"var(--text3)",whiteSpace:"nowrap"},children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px"},children:[r.jsx(Ep,{size:13}),r.jsx("span",{children:f(h.uploaded_at)})]})}),r.jsx("td",{style:{padding:"12px",textAlign:"right"},children:r.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[r.jsx("a",{href:N,download:h.file_name,style:{background:"rgba(255, 255, 255, 0.05)",border:"1px solid var(--border)",color:"var(--text2)",padding:"5px 8px",borderRadius:"6px",cursor:"pointer",display:"inline-flex",alignItems:"center"},title:"Download document",className:"action-icon-btn",children:r.jsx(hg,{size:13})}),T&&r.jsx("button",{onClick:A=>S(A,h.id),style:{background:"rgba(239, 68, 68, 0.05)",border:"1px solid rgba(239, 68, 68, 0.15)",color:"var(--red)",padding:"5px 8px",borderRadius:"6px",cursor:"pointer",display:"inline-flex",alignItems:"center"},title:"Delete document",className:"action-icon-btn delete-btn",children:r.jsx(Ip,{size:13})})]})})]},h.id)})})]})}):r.jsx("div",{style:{color:"var(--text3)",textAlign:"center",fontSize:"13px",padding:"12px 0",fontStyle:"italic"},children:"No documents associated with this order."})})]},C.id)})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .doc-search-input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
        }
        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
        }
        .refresh-btn:hover:not(:disabled) {
          background: var(--bg4) !important;
          border-color: var(--border2) !important;
          color: #fff !important;
        }
        .spin {
          animation: spin-anim 1s linear infinite;
        }
        @keyframes spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .order-card {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .order-card-header:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .doc-row {
          transition: background 0.1s ease;
        }
        .doc-row:hover {
          background: rgba(255, 255, 255, 0.01) !important;
        }
        .doc-file-link:hover {
          text-decoration: underline !important;
        }
        .action-icon-btn:hover {
          background: var(--bg4) !important;
          border-color: var(--border2) !important;
          color: #fff !important;
        }
        .action-icon-btn.delete-btn:hover {
          background: rgba(239, 68, 68, 0.15) !important;
          border-color: var(--red) !important;
          color: var(--red) !important;
        }
      `}})]})}const hh=({children:e})=>{const t=localStorage.getItem("token"),n=localStorage.getItem("user");return!t||t==="undefined"||t==="null"||!n?r.jsx(Cp,{to:"/",replace:!0}):e};function vh(){const[e,t]=p.useState([]),[n,a]=p.useState([]),[o,s]=p.useState("all"),[l,i]=p.useState("table"),[d,u]=p.useState("Accept-Complete"),[v,m]=p.useState("Standard"),[b,w]=p.useState(null),[_,S]=p.useState(!1),[z,x]=p.useState(null),f=p.useRef(null),[c,k]=p.useState(null),[I,D]=p.useState(!0),[C,L]=p.useState(!1),[P,h]=p.useState(()=>window.innerWidth<1200),[T,j]=p.useState(""),[N,B]=p.useState([]),A=p.useRef(null),V=p.useRef(null),U=zi(),[R,J]=p.useState(()=>JSON.parse(localStorage.getItem("user")||"{}")),Y=localStorage.getItem("token"),E=async(q,G={})=>{const Te=await fetch(q,{...G,headers:{...G.headers,Authorization:`Bearer ${Y}`}});return Te.status===401?(localStorage.removeItem("token"),localStorage.removeItem("user"),U("/"),null):Te};p.useEffect(()=>{le(),xe();const q=G=>{typeof G.detail=="string"?i(G.detail):G.detail&&G.detail.view&&(i(G.detail.view),G.detail.orderId?(x(G.detail.orderId),f.current=G.detail.orderId):G.detail.orderId===null&&(x(null),f.current=null),G.detail.unitId?(V.current=G.detail.unitId,j(String(G.detail.unitId))):(V.current=null,j("")))};return window.addEventListener("setView",q),()=>window.removeEventListener("setView",q)},[]),p.useEffect(()=>{z?(Z(z),M(z)):(t([]),k(null))},[z]),p.useEffect(()=>{if(!c){j(""),A.current=null;return}if(A.current!==c.id){const q=c.units||[];V.current&&q.some(G=>G.id.toString()===V.current.toString())?j(V.current.toString()):q.length>0?j(q[0].id.toString()):j(""),V.current=null,A.current=c.id}else{const q=c.units||[];T&&!q.some(G=>G.id.toString()===T.toString())&&(q.length>0?j(q[0].id.toString()):j(""))}},[c,T]),p.useEffect(()=>{const q=T;q&&Y?fetch(`${window.API_BASE}/api/units/${q}/steps`,{headers:{Authorization:`Bearer ${Y}`}}).then(async G=>{G.ok&&B(await G.json())}).catch(console.error):B([])},[T,c,Y]),p.useEffect(()=>{const q=()=>{if(z){Z(z),M(z);const G=T;G&&Y&&fetch(`${window.API_BASE}/api/units/${G}/steps`,{headers:{Authorization:`Bearer ${Y}`}}).then(async Te=>{Te.ok&&B(await Te.json())}).catch(console.error)}};return window.addEventListener("orderUpdated",q),()=>window.removeEventListener("orderUpdated",q)},[z,T,c,Y]);const M=async q=>{if(Y)try{const G=await E(`${window.API_BASE}/api/orders/${q}`);G!=null&&G.ok&&k(await G.json())}catch(G){console.error("Failed to fetch order details",G)}},Z=async q=>{if(Y)try{const G=await E(`${window.API_BASE}/api/orders/${q}/steps`);G!=null&&G.ok&&t(await G.json())}catch(G){console.error("Failed to fetch steps",G)}},le=async()=>{if(Y)try{const q=await E(window.API_BASE+"/api/auth/profile");if(q!=null&&q.ok){const G=await q.json();J(G),localStorage.setItem("user",JSON.stringify(G))}}catch(q){console.error("Failed to sync profile",q)}},xe=async()=>{try{const q=await E(window.API_BASE+"/api/logs");if(q!=null&&q.ok){const G=await q.json();a(G.map(Te=>({time:Fn(new Date(Te.timestamp)),dept:Te.dept,text:Te.action_text,username:Te.username})))}}catch(q){console.error("Failed to fetch logs",q)}},se=async(q,G,Te)=>{const $t=Te??f.current;try{const xt=await E(window.API_BASE+"/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dept:q,action_text:G,order_id:$t?parseInt($t):null})});xe()}catch(xt){console.error("Failed to log activity",xt)}},ve=()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),U("/")},O=q=>{q==="board"?(i("table"),x(null),f.current=null,k(null),t([]),s("all"),window.dispatchEvent(new CustomEvent("setView",{detail:{orderId:null}}))):i(q)},re=e.find(q=>q.id===b)||null,Q=q=>{w(q),S(!0)},ge=()=>{S(!1)},ie=async q=>{try{const G=await fetch(`${window.API_BASE}/api/orders/${z}/steps/${b}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${Y}`},body:JSON.stringify(q)});if(G.ok){if(await Z(z),await M(z),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:z}})),re.special==="qc"&&q.status==="blocked"&&q.qcFailTarget){const Te=q.qcFailTarget==="production"?"QC FAIL → returned to Production for rework":"QC FAIL → returned to Design for re-check";se("QC",Te,z)}return se(re.dept,`"${re.name}" → ${q.status.toUpperCase()}${q.notes?" — "+q.notes:""}`,z),S(!1),null}else return(await G.json().catch(()=>({}))).error||"Failed to save step"}catch(G){return console.error("Failed to save step",G),"Network error — could not save step"}},F=async q=>{if(window.confirm("Are you sure you want to permanently delete this task from the order's flow?"))try{(await fetch(`${window.API_BASE}/api/orders/${z}/steps/${q}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok?(S(!1),Z(z),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:z}}))):alert("Failed to delete step")}catch(G){console.error(G)}},je=q=>{if(!["Admin","Manager","Accounts","Production"].includes(R.role)){alert("Unauthorized to change BOM status");return}u(q),se("Stores",`BOM status updated → ${q}`,z)},Pe=q=>{if(!["Admin","Manager","Design"].includes(R.role)){alert("Unauthorized to change Design classification");return}m(q),se("Design",`Design classified as ${q}`,z)},fe=e.filter(q=>!q.order_unit_id),it=[...N,...fe];return r.jsxs("div",{className:"app-container",children:[r.jsx(Og,{onLogout:ve,onToggleSidebar:()=>h(q=>!q),sidenavCollapsed:P}),r.jsxs("div",{className:"app",children:[(!I||l!=="planning")&&r.jsx(Ug,{steps:it,currentFilter:o,onFilterDept:s,bomState:d,onSetBomState:je,designType:v,onSetDesignType:Pe,currentView:l,onSetView:O,userRole:R.role,collapsed:P}),r.jsxs("main",{className:"main",children:[l!=="planning"&&r.jsx(Vg,{steps:it,currentFilter:o,selectedOrder:c}),r.jsxs("div",{className:"flow-header",children:[r.jsx("div",{className:"flow-title",children:l==="board"?"Board":l==="planning"?"Planning Board":l==="flow"?"Process Flow":l==="table"?"Table View":l==="orders"?"Order Directory":l==="documents"?"Document Directory":l==="new-order"?"New Order":l==="import"?"Import Orders":l==="masters"?"Masters":l==="logs"?"System Logs":l==="worklist"?`${R.role} Worklist`:"User Management"}),["board","flow","table"].includes(l)&&r.jsxs("div",{className:"view-toggle",children:[r.jsx("button",{className:`vbtn${l==="board"?" active":""}`,onClick:()=>i("board"),children:"Board"}),r.jsx("button",{className:`vbtn${l==="flow"?" active":""}`,onClick:()=>i("flow"),children:"Flow"}),r.jsx("button",{className:`vbtn${l==="table"?" active":""}`,onClick:()=>i("table"),children:"Table"})]}),l==="planning"&&r.jsxs("button",{className:`vbtn${I?" active":""}`,onClick:()=>D(!I),style:{display:"flex",alignItems:"center",gap:"6px"},children:[I?r.jsx(zg,{size:13}):r.jsx(Ng,{size:13}),I?"Exit Fullscreen":"Fullscreen"]})]}),l==="board"?r.jsx(Gg,{currentFilter:o,userRole:R.role,onSetView:i}):l==="planning"?["Admin","Manager","Planning"].includes(R.role)?r.jsx(dh,{}):r.jsx("div",{style:{padding:40,textAlign:"center",color:"var(--text3)"},children:"Unauthorized to view the Planning Module."}):l==="flow"?z?r.jsx(Qg,{steps:e,currentFilter:o,onOpenModal:Q,onSetView:i,userRole:R.role,selectedOrderId:z,selectedOrder:c,onStepsChanged:()=>Z(z),selectedUnitId:T,setSelectedUnitId:j,unitSteps:N,setUnitSteps:B}):r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"Please select an order from the Header dropdown to view its Process Flow."}):l==="table"?r.jsx(Jg,{currentFilter:o,onSetView:O}):l==="orders"?r.jsx(nh,{initialSelectedId:z}):l==="documents"?r.jsx(gh,{}):l==="new-order"?r.jsx(th,{onOrderCreated:()=>{i("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):l==="import"?r.jsx(Rp,{onImportComplete:()=>{i("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):l==="masters"?r.jsx(sh,{}):l==="logs"?r.jsx(lh,{}):l==="settings"?r.jsx(ch,{}):l==="worklist"?r.jsx(mh,{dept:R.role}):r.jsx(eh,{})]}),l!=="planning"&&R.role==="Admin"&&r.jsx(Kg,{selectedStep:re,activityLog:n,selectedOrder:c,isOpen:C,onToggle:()=>L(q=>!q)})]}),r.jsx(Xg,{step:re,isOpen:_,onClose:ge,onSave:ie,onDelete:F,userRole:R.role,selectedOrder:c})]})}function yh(){return r.jsx(lg,{children:r.jsxs(ag,{children:[r.jsx(so,{path:"/",element:r.jsx(Zg,{})}),r.jsx(so,{path:"/dashboard",element:r.jsx(hh,{children:r.jsx(vh,{})})}),r.jsx(so,{path:"*",element:r.jsx(Cp,{to:"/",replace:!0})})]})})}window.API_BASE="";const{fetch:bh}=window;window.fetch=async(...e)=>{var n;const t=await bh(...e);if(t.status===401){const a=typeof e[0]=="string"?e[0]:(n=e[0])==null?void 0:n.url;a&&!a.includes("/api/auth/login")&&(localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.href="/")}return t};Is.createRoot(document.getElementById("root")).render(r.jsx(Wn.StrictMode,{children:r.jsx(yh,{})}));
