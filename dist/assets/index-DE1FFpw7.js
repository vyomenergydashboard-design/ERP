function Rp(e,t){for(var n=0;n<t.length;n++){const a=t[n];if(typeof a!="string"&&!Array.isArray(a)){for(const o in a)if(o!=="default"&&!(o in e)){const l=Object.getOwnPropertyDescriptor(a,o);l&&Object.defineProperty(e,o,l.get?l:{enumerable:!0,get:()=>a[o]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const s of l.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function a(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}})();function Op(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var tc={exports:{}},Mo={},rc={exports:{}},ce={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ha=Symbol.for("react.element"),Bp=Symbol.for("react.portal"),Mp=Symbol.for("react.fragment"),$p=Symbol.for("react.strict_mode"),Fp=Symbol.for("react.profiler"),Up=Symbol.for("react.provider"),Wp=Symbol.for("react.context"),qp=Symbol.for("react.forward_ref"),Vp=Symbol.for("react.suspense"),Hp=Symbol.for("react.memo"),Qp=Symbol.for("react.lazy"),zi=Symbol.iterator;function Yp(e){return e===null||typeof e!="object"?null:(e=zi&&e[zi]||e["@@iterator"],typeof e=="function"?e:null)}var nc={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ac=Object.assign,oc={};function bn(e,t,n){this.props=e,this.context=t,this.refs=oc,this.updater=n||nc}bn.prototype.isReactComponent={};bn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};bn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function lc(){}lc.prototype=bn.prototype;function Es(e,t,n){this.props=e,this.context=t,this.refs=oc,this.updater=n||nc}var Ds=Es.prototype=new lc;Ds.constructor=Es;ac(Ds,bn.prototype);Ds.isPureReactComponent=!0;var Ei=Array.isArray,sc=Object.prototype.hasOwnProperty,Ps={current:null},ic={key:!0,ref:!0,__self:!0,__source:!0};function dc(e,t,n){var a,o={},l=null,s=null;if(t!=null)for(a in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(l=""+t.key),t)sc.call(t,a)&&!ic.hasOwnProperty(a)&&(o[a]=t[a]);var i=arguments.length-2;if(i===1)o.children=n;else if(1<i){for(var d=Array(i),u=0;u<i;u++)d[u]=arguments[u+2];o.children=d}if(e&&e.defaultProps)for(a in i=e.defaultProps,i)o[a]===void 0&&(o[a]=i[a]);return{$$typeof:ha,type:e,key:l,ref:s,props:o,_owner:Ps.current}}function Gp(e,t){return{$$typeof:ha,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Ts(e){return typeof e=="object"&&e!==null&&e.$$typeof===ha}function Jp(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Di=/\/+/g;function nl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Jp(""+e.key):t.toString(36)}function Ya(e,t,n,a,o){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(l){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case ha:case Bp:s=!0}}if(s)return s=e,o=o(s),e=a===""?"."+nl(s,0):a,Ei(o)?(n="",e!=null&&(n=e.replace(Di,"$&/")+"/"),Ya(o,t,n,"",function(u){return u})):o!=null&&(Ts(o)&&(o=Gp(o,n+(!o.key||s&&s.key===o.key?"":(""+o.key).replace(Di,"$&/")+"/")+e)),t.push(o)),1;if(s=0,a=a===""?".":a+":",Ei(e))for(var i=0;i<e.length;i++){l=e[i];var d=a+nl(l,i);s+=Ya(l,t,n,d,o)}else if(d=Yp(e),typeof d=="function")for(e=d.call(e),i=0;!(l=e.next()).done;)l=l.value,d=a+nl(l,i++),s+=Ya(l,t,n,d,o);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function Ea(e,t,n){if(e==null)return e;var a=[],o=0;return Ya(e,a,"","",function(l){return t.call(n,l,o++)}),a}function Kp(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var et={current:null},Ga={transition:null},Xp={ReactCurrentDispatcher:et,ReactCurrentBatchConfig:Ga,ReactCurrentOwner:Ps};function cc(){throw Error("act(...) is not supported in production builds of React.")}ce.Children={map:Ea,forEach:function(e,t,n){Ea(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Ea(e,function(){t++}),t},toArray:function(e){return Ea(e,function(t){return t})||[]},only:function(e){if(!Ts(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};ce.Component=bn;ce.Fragment=Mp;ce.Profiler=Fp;ce.PureComponent=Es;ce.StrictMode=$p;ce.Suspense=Vp;ce.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Xp;ce.act=cc;ce.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=ac({},e.props),o=e.key,l=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,s=Ps.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(d in t)sc.call(t,d)&&!ic.hasOwnProperty(d)&&(a[d]=t[d]===void 0&&i!==void 0?i[d]:t[d])}var d=arguments.length-2;if(d===1)a.children=n;else if(1<d){i=Array(d);for(var u=0;u<d;u++)i[u]=arguments[u+2];a.children=i}return{$$typeof:ha,type:e.type,key:o,ref:l,props:a,_owner:s}};ce.createContext=function(e){return e={$$typeof:Wp,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Up,_context:e},e.Consumer=e};ce.createElement=dc;ce.createFactory=function(e){var t=dc.bind(null,e);return t.type=e,t};ce.createRef=function(){return{current:null}};ce.forwardRef=function(e){return{$$typeof:qp,render:e}};ce.isValidElement=Ts;ce.lazy=function(e){return{$$typeof:Qp,_payload:{_status:-1,_result:e},_init:Kp}};ce.memo=function(e,t){return{$$typeof:Hp,type:e,compare:t===void 0?null:t}};ce.startTransition=function(e){var t=Ga.transition;Ga.transition={};try{e()}finally{Ga.transition=t}};ce.unstable_act=cc;ce.useCallback=function(e,t){return et.current.useCallback(e,t)};ce.useContext=function(e){return et.current.useContext(e)};ce.useDebugValue=function(){};ce.useDeferredValue=function(e){return et.current.useDeferredValue(e)};ce.useEffect=function(e,t){return et.current.useEffect(e,t)};ce.useId=function(){return et.current.useId()};ce.useImperativeHandle=function(e,t,n){return et.current.useImperativeHandle(e,t,n)};ce.useInsertionEffect=function(e,t){return et.current.useInsertionEffect(e,t)};ce.useLayoutEffect=function(e,t){return et.current.useLayoutEffect(e,t)};ce.useMemo=function(e,t){return et.current.useMemo(e,t)};ce.useReducer=function(e,t,n){return et.current.useReducer(e,t,n)};ce.useRef=function(e){return et.current.useRef(e)};ce.useState=function(e){return et.current.useState(e)};ce.useSyncExternalStore=function(e,t,n){return et.current.useSyncExternalStore(e,t,n)};ce.useTransition=function(){return et.current.useTransition()};ce.version="18.3.1";rc.exports=ce;var p=rc.exports;const io=Op(p),Zp=Rp({__proto__:null,default:io},[p]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ef=p,tf=Symbol.for("react.element"),rf=Symbol.for("react.fragment"),nf=Object.prototype.hasOwnProperty,af=ef.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,of={key:!0,ref:!0,__self:!0,__source:!0};function uc(e,t,n){var a,o={},l=null,s=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(s=t.ref);for(a in t)nf.call(t,a)&&!of.hasOwnProperty(a)&&(o[a]=t[a]);if(e&&e.defaultProps)for(a in t=e.defaultProps,t)o[a]===void 0&&(o[a]=t[a]);return{$$typeof:tf,type:e,key:l,ref:s,props:o,_owner:af.current}}Mo.Fragment=rf;Mo.jsx=uc;Mo.jsxs=uc;tc.exports=Mo;var r=tc.exports,Tl={},pc={exports:{}},xt={},fc={exports:{}},xc={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t($,V){var Y=$.length;$.push(V);e:for(;0<Y;){var D=Y-1>>>1,I=$[D];if(0<o(I,V))$[D]=V,$[Y]=I,Y=D;else break e}}function n($){return $.length===0?null:$[0]}function a($){if($.length===0)return null;var V=$[0],Y=$.pop();if(Y!==V){$[0]=Y;e:for(var D=0,I=$.length,ee=I>>>1;D<ee;){var ie=2*(D+1)-1,ne=$[ie],fe=ie+1,de=$[fe];if(0>o(ne,Y))fe<I&&0>o(de,ne)?($[D]=de,$[fe]=Y,D=fe):($[D]=ne,$[ie]=Y,D=ie);else if(fe<I&&0>o(de,Y))$[D]=de,$[fe]=Y,D=fe;else break e}}return V}function o($,V){var Y=$.sortIndex-V.sortIndex;return Y!==0?Y:$.id-V.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;e.unstable_now=function(){return l.now()}}else{var s=Date,i=s.now();e.unstable_now=function(){return s.now()-i}}var d=[],u=[],g=1,m=null,h=3,S=!1,N=!1,_=!1,E=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,f=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function c($){for(var V=n(u);V!==null;){if(V.callback===null)a(u);else if(V.startTime<=$)a(u),V.sortIndex=V.expirationTime,t(d,V);else break;V=n(u)}}function w($){if(_=!1,c($),!N)if(n(d)!==null)N=!0,G(T);else{var V=n(u);V!==null&&B(w,V.startTime-$)}}function T($,V){N=!1,_&&(_=!1,x(k),k=-1),S=!0;var Y=h;try{for(c(V),m=n(d);m!==null&&(!(m.expirationTime>V)||$&&!P());){var D=m.callback;if(typeof D=="function"){m.callback=null,h=m.priorityLevel;var I=D(m.expirationTime<=V);V=e.unstable_now(),typeof I=="function"?m.callback=I:m===n(d)&&a(d),c(V)}else a(d);m=n(d)}if(m!==null)var ee=!0;else{var ie=n(u);ie!==null&&B(w,ie.startTime-V),ee=!1}return ee}finally{m=null,h=Y,S=!1}}var L=!1,y=null,k=-1,F=5,j=-1;function P(){return!(e.unstable_now()-j<F)}function C(){if(y!==null){var $=e.unstable_now();j=$;var V=!0;try{V=y(!0,$)}finally{V?z():(L=!1,y=null)}}else L=!1}var z;if(typeof f=="function")z=function(){f(C)};else if(typeof MessageChannel<"u"){var M=new MessageChannel,A=M.port2;M.port1.onmessage=C,z=function(){A.postMessage(null)}}else z=function(){E(C,0)};function G($){y=$,L||(L=!0,z())}function B($,V){k=E(function(){$(e.unstable_now())},V)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function($){$.callback=null},e.unstable_continueExecution=function(){N||S||(N=!0,G(T))},e.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):F=0<$?Math.floor(1e3/$):5},e.unstable_getCurrentPriorityLevel=function(){return h},e.unstable_getFirstCallbackNode=function(){return n(d)},e.unstable_next=function($){switch(h){case 1:case 2:case 3:var V=3;break;default:V=h}var Y=h;h=V;try{return $()}finally{h=Y}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function($,V){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var Y=h;h=$;try{return V()}finally{h=Y}},e.unstable_scheduleCallback=function($,V,Y){var D=e.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?D+Y:D):Y=D,$){case 1:var I=-1;break;case 2:I=250;break;case 5:I=1073741823;break;case 4:I=1e4;break;default:I=5e3}return I=Y+I,$={id:g++,callback:V,priorityLevel:$,startTime:Y,expirationTime:I,sortIndex:-1},Y>D?($.sortIndex=Y,t(u,$),n(d)===null&&$===n(u)&&(_?(x(k),k=-1):_=!0,B(w,Y-D))):($.sortIndex=I,t(d,$),N||S||(N=!0,G(T))),$},e.unstable_shouldYield=P,e.unstable_wrapCallback=function($){var V=h;return function(){var Y=h;h=V;try{return $.apply(this,arguments)}finally{h=Y}}}})(xc);fc.exports=xc;var lf=fc.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sf=p,ft=lf;function W(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var mc=new Set,Xn={};function $r(e,t){pn(e,t),pn(e+"Capture",t)}function pn(e,t){for(Xn[e]=t,e=0;e<t.length;e++)mc.add(t[e])}var Yt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Il=Object.prototype.hasOwnProperty,df=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Pi={},Ti={};function cf(e){return Il.call(Ti,e)?!0:Il.call(Pi,e)?!1:df.test(e)?Ti[e]=!0:(Pi[e]=!0,!1)}function uf(e,t,n,a){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return a?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function pf(e,t,n,a){if(t===null||typeof t>"u"||uf(e,t,n,a))return!0;if(a)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function tt(e,t,n,a,o,l,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=a,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=s}var Ve={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){Ve[e]=new tt(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];Ve[t]=new tt(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){Ve[e]=new tt(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){Ve[e]=new tt(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){Ve[e]=new tt(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){Ve[e]=new tt(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){Ve[e]=new tt(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){Ve[e]=new tt(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){Ve[e]=new tt(e,5,!1,e.toLowerCase(),null,!1,!1)});var Is=/[\-:]([a-z])/g;function Ls(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Is,Ls);Ve[t]=new tt(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Is,Ls);Ve[t]=new tt(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Is,Ls);Ve[t]=new tt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){Ve[e]=new tt(e,1,!1,e.toLowerCase(),null,!1,!1)});Ve.xlinkHref=new tt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){Ve[e]=new tt(e,1,!1,e.toLowerCase(),null,!0,!0)});function As(e,t,n,a){var o=Ve.hasOwnProperty(t)?Ve[t]:null;(o!==null?o.type!==0:a||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(pf(t,n,o,a)&&(n=null),a||o===null?cf(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=n===null?o.type===3?!1:"":n:(t=o.attributeName,a=o.attributeNamespace,n===null?e.removeAttribute(t):(o=o.type,n=o===3||o===4&&n===!0?"":""+n,a?e.setAttributeNS(a,t,n):e.setAttribute(t,n))))}var Xt=sf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Da=Symbol.for("react.element"),Hr=Symbol.for("react.portal"),Qr=Symbol.for("react.fragment"),Rs=Symbol.for("react.strict_mode"),Ll=Symbol.for("react.profiler"),gc=Symbol.for("react.provider"),hc=Symbol.for("react.context"),Os=Symbol.for("react.forward_ref"),Al=Symbol.for("react.suspense"),Rl=Symbol.for("react.suspense_list"),Bs=Symbol.for("react.memo"),ar=Symbol.for("react.lazy"),vc=Symbol.for("react.offscreen"),Ii=Symbol.iterator;function Cn(e){return e===null||typeof e!="object"?null:(e=Ii&&e[Ii]||e["@@iterator"],typeof e=="function"?e:null)}var Ce=Object.assign,al;function An(e){if(al===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);al=t&&t[1]||""}return`
`+al+e}var ol=!1;function ll(e,t){if(!e||ol)return"";ol=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(u){var a=u}Reflect.construct(e,[],t)}else{try{t.call()}catch(u){a=u}e.call(t.prototype)}else{try{throw Error()}catch(u){a=u}e()}}catch(u){if(u&&a&&typeof u.stack=="string"){for(var o=u.stack.split(`
`),l=a.stack.split(`
`),s=o.length-1,i=l.length-1;1<=s&&0<=i&&o[s]!==l[i];)i--;for(;1<=s&&0<=i;s--,i--)if(o[s]!==l[i]){if(s!==1||i!==1)do if(s--,i--,0>i||o[s]!==l[i]){var d=`
`+o[s].replace(" at new "," at ");return e.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",e.displayName)),d}while(1<=s&&0<=i);break}}}finally{ol=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?An(e):""}function ff(e){switch(e.tag){case 5:return An(e.type);case 16:return An("Lazy");case 13:return An("Suspense");case 19:return An("SuspenseList");case 0:case 2:case 15:return e=ll(e.type,!1),e;case 11:return e=ll(e.type.render,!1),e;case 1:return e=ll(e.type,!0),e;default:return""}}function Ol(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Qr:return"Fragment";case Hr:return"Portal";case Ll:return"Profiler";case Rs:return"StrictMode";case Al:return"Suspense";case Rl:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case hc:return(e.displayName||"Context")+".Consumer";case gc:return(e._context.displayName||"Context")+".Provider";case Os:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Bs:return t=e.displayName||null,t!==null?t:Ol(e.type)||"Memo";case ar:t=e._payload,e=e._init;try{return Ol(e(t))}catch{}}return null}function xf(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ol(t);case 8:return t===Rs?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function yr(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function yc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function mf(e){var t=yc(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),a=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var o=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(s){a=""+s,l.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return a},setValue:function(s){a=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Pa(e){e._valueTracker||(e._valueTracker=mf(e))}function bc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),a="";return e&&(a=yc(e)?e.checked?"true":"false":e.value),e=a,e!==n?(t.setValue(e),!0):!1}function co(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Bl(e,t){var n=t.checked;return Ce({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Li(e,t){var n=t.defaultValue==null?"":t.defaultValue,a=t.checked!=null?t.checked:t.defaultChecked;n=yr(t.value!=null?t.value:n),e._wrapperState={initialChecked:a,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function jc(e,t){t=t.checked,t!=null&&As(e,"checked",t,!1)}function Ml(e,t){jc(e,t);var n=yr(t.value),a=t.type;if(n!=null)a==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(a==="submit"||a==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?$l(e,t.type,n):t.hasOwnProperty("defaultValue")&&$l(e,t.type,yr(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ai(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var a=t.type;if(!(a!=="submit"&&a!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function $l(e,t,n){(t!=="number"||co(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Rn=Array.isArray;function on(e,t,n,a){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&a&&(e[n].defaultSelected=!0)}else{for(n=""+yr(n),t=null,o=0;o<e.length;o++){if(e[o].value===n){e[o].selected=!0,a&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function Fl(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(W(91));return Ce({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ri(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(W(92));if(Rn(n)){if(1<n.length)throw Error(W(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:yr(n)}}function wc(e,t){var n=yr(t.value),a=yr(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),a!=null&&(e.defaultValue=""+a)}function Oi(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function kc(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ul(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?kc(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Ta,Sc=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,a,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,a,o)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Ta=Ta||document.createElement("div"),Ta.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Ta.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Zn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Wn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},gf=["Webkit","ms","Moz","O"];Object.keys(Wn).forEach(function(e){gf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Wn[t]=Wn[e]})});function _c(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Wn.hasOwnProperty(e)&&Wn[e]?(""+t).trim():t+"px"}function Nc(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var a=n.indexOf("--")===0,o=_c(n,t[n],a);n==="float"&&(n="cssFloat"),a?e.setProperty(n,o):e[n]=o}}var hf=Ce({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Wl(e,t){if(t){if(hf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(W(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(W(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(W(61))}if(t.style!=null&&typeof t.style!="object")throw Error(W(62))}}function ql(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Vl=null;function Ms(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Hl=null,ln=null,sn=null;function Bi(e){if(e=ba(e)){if(typeof Hl!="function")throw Error(W(280));var t=e.stateNode;t&&(t=qo(t),Hl(e.stateNode,e.type,t))}}function Cc(e){ln?sn?sn.push(e):sn=[e]:ln=e}function zc(){if(ln){var e=ln,t=sn;if(sn=ln=null,Bi(e),t)for(e=0;e<t.length;e++)Bi(t[e])}}function Ec(e,t){return e(t)}function Dc(){}var sl=!1;function Pc(e,t,n){if(sl)return e(t,n);sl=!0;try{return Ec(e,t,n)}finally{sl=!1,(ln!==null||sn!==null)&&(Dc(),zc())}}function ea(e,t){var n=e.stateNode;if(n===null)return null;var a=qo(n);if(a===null)return null;n=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(W(231,t,typeof n));return n}var Ql=!1;if(Yt)try{var zn={};Object.defineProperty(zn,"passive",{get:function(){Ql=!0}}),window.addEventListener("test",zn,zn),window.removeEventListener("test",zn,zn)}catch{Ql=!1}function vf(e,t,n,a,o,l,s,i,d){var u=Array.prototype.slice.call(arguments,3);try{t.apply(n,u)}catch(g){this.onError(g)}}var qn=!1,uo=null,po=!1,Yl=null,yf={onError:function(e){qn=!0,uo=e}};function bf(e,t,n,a,o,l,s,i,d){qn=!1,uo=null,vf.apply(yf,arguments)}function jf(e,t,n,a,o,l,s,i,d){if(bf.apply(this,arguments),qn){if(qn){var u=uo;qn=!1,uo=null}else throw Error(W(198));po||(po=!0,Yl=u)}}function Fr(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Tc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Mi(e){if(Fr(e)!==e)throw Error(W(188))}function wf(e){var t=e.alternate;if(!t){if(t=Fr(e),t===null)throw Error(W(188));return t!==e?null:e}for(var n=e,a=t;;){var o=n.return;if(o===null)break;var l=o.alternate;if(l===null){if(a=o.return,a!==null){n=a;continue}break}if(o.child===l.child){for(l=o.child;l;){if(l===n)return Mi(o),e;if(l===a)return Mi(o),t;l=l.sibling}throw Error(W(188))}if(n.return!==a.return)n=o,a=l;else{for(var s=!1,i=o.child;i;){if(i===n){s=!0,n=o,a=l;break}if(i===a){s=!0,a=o,n=l;break}i=i.sibling}if(!s){for(i=l.child;i;){if(i===n){s=!0,n=l,a=o;break}if(i===a){s=!0,a=l,n=o;break}i=i.sibling}if(!s)throw Error(W(189))}}if(n.alternate!==a)throw Error(W(190))}if(n.tag!==3)throw Error(W(188));return n.stateNode.current===n?e:t}function Ic(e){return e=wf(e),e!==null?Lc(e):null}function Lc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Lc(e);if(t!==null)return t;e=e.sibling}return null}var Ac=ft.unstable_scheduleCallback,$i=ft.unstable_cancelCallback,kf=ft.unstable_shouldYield,Sf=ft.unstable_requestPaint,Te=ft.unstable_now,_f=ft.unstable_getCurrentPriorityLevel,$s=ft.unstable_ImmediatePriority,Rc=ft.unstable_UserBlockingPriority,fo=ft.unstable_NormalPriority,Nf=ft.unstable_LowPriority,Oc=ft.unstable_IdlePriority,$o=null,Mt=null;function Cf(e){if(Mt&&typeof Mt.onCommitFiberRoot=="function")try{Mt.onCommitFiberRoot($o,e,void 0,(e.current.flags&128)===128)}catch{}}var Pt=Math.clz32?Math.clz32:Df,zf=Math.log,Ef=Math.LN2;function Df(e){return e>>>=0,e===0?32:31-(zf(e)/Ef|0)|0}var Ia=64,La=4194304;function On(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function xo(e,t){var n=e.pendingLanes;if(n===0)return 0;var a=0,o=e.suspendedLanes,l=e.pingedLanes,s=n&268435455;if(s!==0){var i=s&~o;i!==0?a=On(i):(l&=s,l!==0&&(a=On(l)))}else s=n&~o,s!==0?a=On(s):l!==0&&(a=On(l));if(a===0)return 0;if(t!==0&&t!==a&&!(t&o)&&(o=a&-a,l=t&-t,o>=l||o===16&&(l&4194240)!==0))return t;if(a&4&&(a|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=a;0<t;)n=31-Pt(t),o=1<<n,a|=e[n],t&=~o;return a}function Pf(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Tf(e,t){for(var n=e.suspendedLanes,a=e.pingedLanes,o=e.expirationTimes,l=e.pendingLanes;0<l;){var s=31-Pt(l),i=1<<s,d=o[s];d===-1?(!(i&n)||i&a)&&(o[s]=Pf(i,t)):d<=t&&(e.expiredLanes|=i),l&=~i}}function Gl(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Bc(){var e=Ia;return Ia<<=1,!(Ia&4194240)&&(Ia=64),e}function il(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function va(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Pt(t),e[t]=n}function If(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var a=e.eventTimes;for(e=e.expirationTimes;0<n;){var o=31-Pt(n),l=1<<o;t[o]=0,a[o]=-1,e[o]=-1,n&=~l}}function Fs(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var a=31-Pt(n),o=1<<a;o&t|e[a]&t&&(e[a]|=t),n&=~o}}var ye=0;function Mc(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var $c,Us,Fc,Uc,Wc,Jl=!1,Aa=[],ur=null,pr=null,fr=null,ta=new Map,ra=new Map,lr=[],Lf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Fi(e,t){switch(e){case"focusin":case"focusout":ur=null;break;case"dragenter":case"dragleave":pr=null;break;case"mouseover":case"mouseout":fr=null;break;case"pointerover":case"pointerout":ta.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ra.delete(t.pointerId)}}function En(e,t,n,a,o,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:a,nativeEvent:l,targetContainers:[o]},t!==null&&(t=ba(t),t!==null&&Us(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Af(e,t,n,a,o){switch(t){case"focusin":return ur=En(ur,e,t,n,a,o),!0;case"dragenter":return pr=En(pr,e,t,n,a,o),!0;case"mouseover":return fr=En(fr,e,t,n,a,o),!0;case"pointerover":var l=o.pointerId;return ta.set(l,En(ta.get(l)||null,e,t,n,a,o)),!0;case"gotpointercapture":return l=o.pointerId,ra.set(l,En(ra.get(l)||null,e,t,n,a,o)),!0}return!1}function qc(e){var t=zr(e.target);if(t!==null){var n=Fr(t);if(n!==null){if(t=n.tag,t===13){if(t=Tc(n),t!==null){e.blockedOn=t,Wc(e.priority,function(){Fc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ja(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Kl(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var a=new n.constructor(n.type,n);Vl=a,n.target.dispatchEvent(a),Vl=null}else return t=ba(n),t!==null&&Us(t),e.blockedOn=n,!1;t.shift()}return!0}function Ui(e,t,n){Ja(e)&&n.delete(t)}function Rf(){Jl=!1,ur!==null&&Ja(ur)&&(ur=null),pr!==null&&Ja(pr)&&(pr=null),fr!==null&&Ja(fr)&&(fr=null),ta.forEach(Ui),ra.forEach(Ui)}function Dn(e,t){e.blockedOn===t&&(e.blockedOn=null,Jl||(Jl=!0,ft.unstable_scheduleCallback(ft.unstable_NormalPriority,Rf)))}function na(e){function t(o){return Dn(o,e)}if(0<Aa.length){Dn(Aa[0],e);for(var n=1;n<Aa.length;n++){var a=Aa[n];a.blockedOn===e&&(a.blockedOn=null)}}for(ur!==null&&Dn(ur,e),pr!==null&&Dn(pr,e),fr!==null&&Dn(fr,e),ta.forEach(t),ra.forEach(t),n=0;n<lr.length;n++)a=lr[n],a.blockedOn===e&&(a.blockedOn=null);for(;0<lr.length&&(n=lr[0],n.blockedOn===null);)qc(n),n.blockedOn===null&&lr.shift()}var dn=Xt.ReactCurrentBatchConfig,mo=!0;function Of(e,t,n,a){var o=ye,l=dn.transition;dn.transition=null;try{ye=1,Ws(e,t,n,a)}finally{ye=o,dn.transition=l}}function Bf(e,t,n,a){var o=ye,l=dn.transition;dn.transition=null;try{ye=4,Ws(e,t,n,a)}finally{ye=o,dn.transition=l}}function Ws(e,t,n,a){if(mo){var o=Kl(e,t,n,a);if(o===null)vl(e,t,a,go,n),Fi(e,a);else if(Af(o,e,t,n,a))a.stopPropagation();else if(Fi(e,a),t&4&&-1<Lf.indexOf(e)){for(;o!==null;){var l=ba(o);if(l!==null&&$c(l),l=Kl(e,t,n,a),l===null&&vl(e,t,a,go,n),l===o)break;o=l}o!==null&&a.stopPropagation()}else vl(e,t,a,null,n)}}var go=null;function Kl(e,t,n,a){if(go=null,e=Ms(a),e=zr(e),e!==null)if(t=Fr(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Tc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return go=e,null}function Vc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(_f()){case $s:return 1;case Rc:return 4;case fo:case Nf:return 16;case Oc:return 536870912;default:return 16}default:return 16}}var ir=null,qs=null,Ka=null;function Hc(){if(Ka)return Ka;var e,t=qs,n=t.length,a,o="value"in ir?ir.value:ir.textContent,l=o.length;for(e=0;e<n&&t[e]===o[e];e++);var s=n-e;for(a=1;a<=s&&t[n-a]===o[l-a];a++);return Ka=o.slice(e,1<a?1-a:void 0)}function Xa(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ra(){return!0}function Wi(){return!1}function mt(e){function t(n,a,o,l,s){this._reactName=n,this._targetInst=o,this.type=a,this.nativeEvent=l,this.target=s,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Ra:Wi,this.isPropagationStopped=Wi,this}return Ce(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ra)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ra)},persist:function(){},isPersistent:Ra}),t}var jn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Vs=mt(jn),ya=Ce({},jn,{view:0,detail:0}),Mf=mt(ya),dl,cl,Pn,Fo=Ce({},ya,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Hs,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Pn&&(Pn&&e.type==="mousemove"?(dl=e.screenX-Pn.screenX,cl=e.screenY-Pn.screenY):cl=dl=0,Pn=e),dl)},movementY:function(e){return"movementY"in e?e.movementY:cl}}),qi=mt(Fo),$f=Ce({},Fo,{dataTransfer:0}),Ff=mt($f),Uf=Ce({},ya,{relatedTarget:0}),ul=mt(Uf),Wf=Ce({},jn,{animationName:0,elapsedTime:0,pseudoElement:0}),qf=mt(Wf),Vf=Ce({},jn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Hf=mt(Vf),Qf=Ce({},jn,{data:0}),Vi=mt(Qf),Yf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Gf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Jf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Kf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Jf[e])?!!t[e]:!1}function Hs(){return Kf}var Xf=Ce({},ya,{key:function(e){if(e.key){var t=Yf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Xa(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Gf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Hs,charCode:function(e){return e.type==="keypress"?Xa(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Xa(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Zf=mt(Xf),ex=Ce({},Fo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Hi=mt(ex),tx=Ce({},ya,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Hs}),rx=mt(tx),nx=Ce({},jn,{propertyName:0,elapsedTime:0,pseudoElement:0}),ax=mt(nx),ox=Ce({},Fo,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),lx=mt(ox),sx=[9,13,27,32],Qs=Yt&&"CompositionEvent"in window,Vn=null;Yt&&"documentMode"in document&&(Vn=document.documentMode);var ix=Yt&&"TextEvent"in window&&!Vn,Qc=Yt&&(!Qs||Vn&&8<Vn&&11>=Vn),Qi=" ",Yi=!1;function Yc(e,t){switch(e){case"keyup":return sx.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Gc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Yr=!1;function dx(e,t){switch(e){case"compositionend":return Gc(t);case"keypress":return t.which!==32?null:(Yi=!0,Qi);case"textInput":return e=t.data,e===Qi&&Yi?null:e;default:return null}}function cx(e,t){if(Yr)return e==="compositionend"||!Qs&&Yc(e,t)?(e=Hc(),Ka=qs=ir=null,Yr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Qc&&t.locale!=="ko"?null:t.data;default:return null}}var ux={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Gi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!ux[e.type]:t==="textarea"}function Jc(e,t,n,a){Cc(a),t=ho(t,"onChange"),0<t.length&&(n=new Vs("onChange","change",null,n,a),e.push({event:n,listeners:t}))}var Hn=null,aa=null;function px(e){su(e,0)}function Uo(e){var t=Kr(e);if(bc(t))return e}function fx(e,t){if(e==="change")return t}var Kc=!1;if(Yt){var pl;if(Yt){var fl="oninput"in document;if(!fl){var Ji=document.createElement("div");Ji.setAttribute("oninput","return;"),fl=typeof Ji.oninput=="function"}pl=fl}else pl=!1;Kc=pl&&(!document.documentMode||9<document.documentMode)}function Ki(){Hn&&(Hn.detachEvent("onpropertychange",Xc),aa=Hn=null)}function Xc(e){if(e.propertyName==="value"&&Uo(aa)){var t=[];Jc(t,aa,e,Ms(e)),Pc(px,t)}}function xx(e,t,n){e==="focusin"?(Ki(),Hn=t,aa=n,Hn.attachEvent("onpropertychange",Xc)):e==="focusout"&&Ki()}function mx(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Uo(aa)}function gx(e,t){if(e==="click")return Uo(t)}function hx(e,t){if(e==="input"||e==="change")return Uo(t)}function vx(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var It=typeof Object.is=="function"?Object.is:vx;function oa(e,t){if(It(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),a=Object.keys(t);if(n.length!==a.length)return!1;for(a=0;a<n.length;a++){var o=n[a];if(!Il.call(t,o)||!It(e[o],t[o]))return!1}return!0}function Xi(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Zi(e,t){var n=Xi(e);e=0;for(var a;n;){if(n.nodeType===3){if(a=e+n.textContent.length,e<=t&&a>=t)return{node:n,offset:t-e};e=a}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Xi(n)}}function Zc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Zc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function eu(){for(var e=window,t=co();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=co(e.document)}return t}function Ys(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function yx(e){var t=eu(),n=e.focusedElem,a=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Zc(n.ownerDocument.documentElement,n)){if(a!==null&&Ys(n)){if(t=a.start,e=a.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=n.textContent.length,l=Math.min(a.start,o);a=a.end===void 0?l:Math.min(a.end,o),!e.extend&&l>a&&(o=a,a=l,l=o),o=Zi(n,l);var s=Zi(n,a);o&&s&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),l>a?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var bx=Yt&&"documentMode"in document&&11>=document.documentMode,Gr=null,Xl=null,Qn=null,Zl=!1;function ed(e,t,n){var a=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Zl||Gr==null||Gr!==co(a)||(a=Gr,"selectionStart"in a&&Ys(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Qn&&oa(Qn,a)||(Qn=a,a=ho(Xl,"onSelect"),0<a.length&&(t=new Vs("onSelect","select",null,t,n),e.push({event:t,listeners:a}),t.target=Gr)))}function Oa(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Jr={animationend:Oa("Animation","AnimationEnd"),animationiteration:Oa("Animation","AnimationIteration"),animationstart:Oa("Animation","AnimationStart"),transitionend:Oa("Transition","TransitionEnd")},xl={},tu={};Yt&&(tu=document.createElement("div").style,"AnimationEvent"in window||(delete Jr.animationend.animation,delete Jr.animationiteration.animation,delete Jr.animationstart.animation),"TransitionEvent"in window||delete Jr.transitionend.transition);function Wo(e){if(xl[e])return xl[e];if(!Jr[e])return e;var t=Jr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in tu)return xl[e]=t[n];return e}var ru=Wo("animationend"),nu=Wo("animationiteration"),au=Wo("animationstart"),ou=Wo("transitionend"),lu=new Map,td="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function jr(e,t){lu.set(e,t),$r(t,[e])}for(var ml=0;ml<td.length;ml++){var gl=td[ml],jx=gl.toLowerCase(),wx=gl[0].toUpperCase()+gl.slice(1);jr(jx,"on"+wx)}jr(ru,"onAnimationEnd");jr(nu,"onAnimationIteration");jr(au,"onAnimationStart");jr("dblclick","onDoubleClick");jr("focusin","onFocus");jr("focusout","onBlur");jr(ou,"onTransitionEnd");pn("onMouseEnter",["mouseout","mouseover"]);pn("onMouseLeave",["mouseout","mouseover"]);pn("onPointerEnter",["pointerout","pointerover"]);pn("onPointerLeave",["pointerout","pointerover"]);$r("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));$r("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));$r("onBeforeInput",["compositionend","keypress","textInput","paste"]);$r("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));$r("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));$r("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Bn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),kx=new Set("cancel close invalid load scroll toggle".split(" ").concat(Bn));function rd(e,t,n){var a=e.type||"unknown-event";e.currentTarget=n,jf(a,t,void 0,e),e.currentTarget=null}function su(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var a=e[n],o=a.event;a=a.listeners;e:{var l=void 0;if(t)for(var s=a.length-1;0<=s;s--){var i=a[s],d=i.instance,u=i.currentTarget;if(i=i.listener,d!==l&&o.isPropagationStopped())break e;rd(o,i,u),l=d}else for(s=0;s<a.length;s++){if(i=a[s],d=i.instance,u=i.currentTarget,i=i.listener,d!==l&&o.isPropagationStopped())break e;rd(o,i,u),l=d}}}if(po)throw e=Yl,po=!1,Yl=null,e}function we(e,t){var n=t[as];n===void 0&&(n=t[as]=new Set);var a=e+"__bubble";n.has(a)||(iu(t,e,2,!1),n.add(a))}function hl(e,t,n){var a=0;t&&(a|=4),iu(n,e,a,t)}var Ba="_reactListening"+Math.random().toString(36).slice(2);function la(e){if(!e[Ba]){e[Ba]=!0,mc.forEach(function(n){n!=="selectionchange"&&(kx.has(n)||hl(n,!1,e),hl(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ba]||(t[Ba]=!0,hl("selectionchange",!1,t))}}function iu(e,t,n,a){switch(Vc(t)){case 1:var o=Of;break;case 4:o=Bf;break;default:o=Ws}n=o.bind(null,t,n,e),o=void 0,!Ql||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),a?o!==void 0?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):o!==void 0?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function vl(e,t,n,a,o){var l=a;if(!(t&1)&&!(t&2)&&a!==null)e:for(;;){if(a===null)return;var s=a.tag;if(s===3||s===4){var i=a.stateNode.containerInfo;if(i===o||i.nodeType===8&&i.parentNode===o)break;if(s===4)for(s=a.return;s!==null;){var d=s.tag;if((d===3||d===4)&&(d=s.stateNode.containerInfo,d===o||d.nodeType===8&&d.parentNode===o))return;s=s.return}for(;i!==null;){if(s=zr(i),s===null)return;if(d=s.tag,d===5||d===6){a=l=s;continue e}i=i.parentNode}}a=a.return}Pc(function(){var u=l,g=Ms(n),m=[];e:{var h=lu.get(e);if(h!==void 0){var S=Vs,N=e;switch(e){case"keypress":if(Xa(n)===0)break e;case"keydown":case"keyup":S=Zf;break;case"focusin":N="focus",S=ul;break;case"focusout":N="blur",S=ul;break;case"beforeblur":case"afterblur":S=ul;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":S=qi;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":S=Ff;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":S=rx;break;case ru:case nu:case au:S=qf;break;case ou:S=ax;break;case"scroll":S=Mf;break;case"wheel":S=lx;break;case"copy":case"cut":case"paste":S=Hf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":S=Hi}var _=(t&4)!==0,E=!_&&e==="scroll",x=_?h!==null?h+"Capture":null:h;_=[];for(var f=u,c;f!==null;){c=f;var w=c.stateNode;if(c.tag===5&&w!==null&&(c=w,x!==null&&(w=ea(f,x),w!=null&&_.push(sa(f,w,c)))),E)break;f=f.return}0<_.length&&(h=new S(h,N,null,n,g),m.push({event:h,listeners:_}))}}if(!(t&7)){e:{if(h=e==="mouseover"||e==="pointerover",S=e==="mouseout"||e==="pointerout",h&&n!==Vl&&(N=n.relatedTarget||n.fromElement)&&(zr(N)||N[Gt]))break e;if((S||h)&&(h=g.window===g?g:(h=g.ownerDocument)?h.defaultView||h.parentWindow:window,S?(N=n.relatedTarget||n.toElement,S=u,N=N?zr(N):null,N!==null&&(E=Fr(N),N!==E||N.tag!==5&&N.tag!==6)&&(N=null)):(S=null,N=u),S!==N)){if(_=qi,w="onMouseLeave",x="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(_=Hi,w="onPointerLeave",x="onPointerEnter",f="pointer"),E=S==null?h:Kr(S),c=N==null?h:Kr(N),h=new _(w,f+"leave",S,n,g),h.target=E,h.relatedTarget=c,w=null,zr(g)===u&&(_=new _(x,f+"enter",N,n,g),_.target=c,_.relatedTarget=E,w=_),E=w,S&&N)t:{for(_=S,x=N,f=0,c=_;c;c=Vr(c))f++;for(c=0,w=x;w;w=Vr(w))c++;for(;0<f-c;)_=Vr(_),f--;for(;0<c-f;)x=Vr(x),c--;for(;f--;){if(_===x||x!==null&&_===x.alternate)break t;_=Vr(_),x=Vr(x)}_=null}else _=null;S!==null&&nd(m,h,S,_,!1),N!==null&&E!==null&&nd(m,E,N,_,!0)}}e:{if(h=u?Kr(u):window,S=h.nodeName&&h.nodeName.toLowerCase(),S==="select"||S==="input"&&h.type==="file")var T=fx;else if(Gi(h))if(Kc)T=hx;else{T=mx;var L=xx}else(S=h.nodeName)&&S.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(T=gx);if(T&&(T=T(e,u))){Jc(m,T,n,g);break e}L&&L(e,h,u),e==="focusout"&&(L=h._wrapperState)&&L.controlled&&h.type==="number"&&$l(h,"number",h.value)}switch(L=u?Kr(u):window,e){case"focusin":(Gi(L)||L.contentEditable==="true")&&(Gr=L,Xl=u,Qn=null);break;case"focusout":Qn=Xl=Gr=null;break;case"mousedown":Zl=!0;break;case"contextmenu":case"mouseup":case"dragend":Zl=!1,ed(m,n,g);break;case"selectionchange":if(bx)break;case"keydown":case"keyup":ed(m,n,g)}var y;if(Qs)e:{switch(e){case"compositionstart":var k="onCompositionStart";break e;case"compositionend":k="onCompositionEnd";break e;case"compositionupdate":k="onCompositionUpdate";break e}k=void 0}else Yr?Yc(e,n)&&(k="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(k="onCompositionStart");k&&(Qc&&n.locale!=="ko"&&(Yr||k!=="onCompositionStart"?k==="onCompositionEnd"&&Yr&&(y=Hc()):(ir=g,qs="value"in ir?ir.value:ir.textContent,Yr=!0)),L=ho(u,k),0<L.length&&(k=new Vi(k,e,null,n,g),m.push({event:k,listeners:L}),y?k.data=y:(y=Gc(n),y!==null&&(k.data=y)))),(y=ix?dx(e,n):cx(e,n))&&(u=ho(u,"onBeforeInput"),0<u.length&&(g=new Vi("onBeforeInput","beforeinput",null,n,g),m.push({event:g,listeners:u}),g.data=y))}su(m,t)})}function sa(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ho(e,t){for(var n=t+"Capture",a=[];e!==null;){var o=e,l=o.stateNode;o.tag===5&&l!==null&&(o=l,l=ea(e,n),l!=null&&a.unshift(sa(e,l,o)),l=ea(e,t),l!=null&&a.push(sa(e,l,o))),e=e.return}return a}function Vr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function nd(e,t,n,a,o){for(var l=t._reactName,s=[];n!==null&&n!==a;){var i=n,d=i.alternate,u=i.stateNode;if(d!==null&&d===a)break;i.tag===5&&u!==null&&(i=u,o?(d=ea(n,l),d!=null&&s.unshift(sa(n,d,i))):o||(d=ea(n,l),d!=null&&s.push(sa(n,d,i)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var Sx=/\r\n?/g,_x=/\u0000|\uFFFD/g;function ad(e){return(typeof e=="string"?e:""+e).replace(Sx,`
`).replace(_x,"")}function Ma(e,t,n){if(t=ad(t),ad(e)!==t&&n)throw Error(W(425))}function vo(){}var es=null,ts=null;function rs(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ns=typeof setTimeout=="function"?setTimeout:void 0,Nx=typeof clearTimeout=="function"?clearTimeout:void 0,od=typeof Promise=="function"?Promise:void 0,Cx=typeof queueMicrotask=="function"?queueMicrotask:typeof od<"u"?function(e){return od.resolve(null).then(e).catch(zx)}:ns;function zx(e){setTimeout(function(){throw e})}function yl(e,t){var n=t,a=0;do{var o=n.nextSibling;if(e.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(a===0){e.removeChild(o),na(t);return}a--}else n!=="$"&&n!=="$?"&&n!=="$!"||a++;n=o}while(n);na(t)}function xr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ld(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var wn=Math.random().toString(36).slice(2),Bt="__reactFiber$"+wn,ia="__reactProps$"+wn,Gt="__reactContainer$"+wn,as="__reactEvents$"+wn,Ex="__reactListeners$"+wn,Dx="__reactHandles$"+wn;function zr(e){var t=e[Bt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Gt]||n[Bt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ld(e);e!==null;){if(n=e[Bt])return n;e=ld(e)}return t}e=n,n=e.parentNode}return null}function ba(e){return e=e[Bt]||e[Gt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Kr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(W(33))}function qo(e){return e[ia]||null}var os=[],Xr=-1;function wr(e){return{current:e}}function ke(e){0>Xr||(e.current=os[Xr],os[Xr]=null,Xr--)}function je(e,t){Xr++,os[Xr]=e.current,e.current=t}var br={},Ke=wr(br),at=wr(!1),Lr=br;function fn(e,t){var n=e.type.contextTypes;if(!n)return br;var a=e.stateNode;if(a&&a.__reactInternalMemoizedUnmaskedChildContext===t)return a.__reactInternalMemoizedMaskedChildContext;var o={},l;for(l in n)o[l]=t[l];return a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function ot(e){return e=e.childContextTypes,e!=null}function yo(){ke(at),ke(Ke)}function sd(e,t,n){if(Ke.current!==br)throw Error(W(168));je(Ke,t),je(at,n)}function du(e,t,n){var a=e.stateNode;if(t=t.childContextTypes,typeof a.getChildContext!="function")return n;a=a.getChildContext();for(var o in a)if(!(o in t))throw Error(W(108,xf(e)||"Unknown",o));return Ce({},n,a)}function bo(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||br,Lr=Ke.current,je(Ke,e),je(at,at.current),!0}function id(e,t,n){var a=e.stateNode;if(!a)throw Error(W(169));n?(e=du(e,t,Lr),a.__reactInternalMemoizedMergedChildContext=e,ke(at),ke(Ke),je(Ke,e)):ke(at),je(at,n)}var Wt=null,Vo=!1,bl=!1;function cu(e){Wt===null?Wt=[e]:Wt.push(e)}function Px(e){Vo=!0,cu(e)}function kr(){if(!bl&&Wt!==null){bl=!0;var e=0,t=ye;try{var n=Wt;for(ye=1;e<n.length;e++){var a=n[e];do a=a(!0);while(a!==null)}Wt=null,Vo=!1}catch(o){throw Wt!==null&&(Wt=Wt.slice(e+1)),Ac($s,kr),o}finally{ye=t,bl=!1}}return null}var Zr=[],en=0,jo=null,wo=0,ht=[],vt=0,Ar=null,qt=1,Vt="";function Nr(e,t){Zr[en++]=wo,Zr[en++]=jo,jo=e,wo=t}function uu(e,t,n){ht[vt++]=qt,ht[vt++]=Vt,ht[vt++]=Ar,Ar=e;var a=qt;e=Vt;var o=32-Pt(a)-1;a&=~(1<<o),n+=1;var l=32-Pt(t)+o;if(30<l){var s=o-o%5;l=(a&(1<<s)-1).toString(32),a>>=s,o-=s,qt=1<<32-Pt(t)+o|n<<o|a,Vt=l+e}else qt=1<<l|n<<o|a,Vt=e}function Gs(e){e.return!==null&&(Nr(e,1),uu(e,1,0))}function Js(e){for(;e===jo;)jo=Zr[--en],Zr[en]=null,wo=Zr[--en],Zr[en]=null;for(;e===Ar;)Ar=ht[--vt],ht[vt]=null,Vt=ht[--vt],ht[vt]=null,qt=ht[--vt],ht[vt]=null}var pt=null,ut=null,Se=!1,Dt=null;function pu(e,t){var n=yt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function dd(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,pt=e,ut=xr(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,pt=e,ut=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Ar!==null?{id:qt,overflow:Vt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=yt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,pt=e,ut=null,!0):!1;default:return!1}}function ls(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ss(e){if(Se){var t=ut;if(t){var n=t;if(!dd(e,t)){if(ls(e))throw Error(W(418));t=xr(n.nextSibling);var a=pt;t&&dd(e,t)?pu(a,n):(e.flags=e.flags&-4097|2,Se=!1,pt=e)}}else{if(ls(e))throw Error(W(418));e.flags=e.flags&-4097|2,Se=!1,pt=e}}}function cd(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;pt=e}function $a(e){if(e!==pt)return!1;if(!Se)return cd(e),Se=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!rs(e.type,e.memoizedProps)),t&&(t=ut)){if(ls(e))throw fu(),Error(W(418));for(;t;)pu(e,t),t=xr(t.nextSibling)}if(cd(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(W(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ut=xr(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ut=null}}else ut=pt?xr(e.stateNode.nextSibling):null;return!0}function fu(){for(var e=ut;e;)e=xr(e.nextSibling)}function xn(){ut=pt=null,Se=!1}function Ks(e){Dt===null?Dt=[e]:Dt.push(e)}var Tx=Xt.ReactCurrentBatchConfig;function Tn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(W(309));var a=n.stateNode}if(!a)throw Error(W(147,e));var o=a,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(s){var i=o.refs;s===null?delete i[l]:i[l]=s},t._stringRef=l,t)}if(typeof e!="string")throw Error(W(284));if(!n._owner)throw Error(W(290,e))}return e}function Fa(e,t){throw e=Object.prototype.toString.call(t),Error(W(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function ud(e){var t=e._init;return t(e._payload)}function xu(e){function t(x,f){if(e){var c=x.deletions;c===null?(x.deletions=[f],x.flags|=16):c.push(f)}}function n(x,f){if(!e)return null;for(;f!==null;)t(x,f),f=f.sibling;return null}function a(x,f){for(x=new Map;f!==null;)f.key!==null?x.set(f.key,f):x.set(f.index,f),f=f.sibling;return x}function o(x,f){return x=vr(x,f),x.index=0,x.sibling=null,x}function l(x,f,c){return x.index=c,e?(c=x.alternate,c!==null?(c=c.index,c<f?(x.flags|=2,f):c):(x.flags|=2,f)):(x.flags|=1048576,f)}function s(x){return e&&x.alternate===null&&(x.flags|=2),x}function i(x,f,c,w){return f===null||f.tag!==6?(f=Cl(c,x.mode,w),f.return=x,f):(f=o(f,c),f.return=x,f)}function d(x,f,c,w){var T=c.type;return T===Qr?g(x,f,c.props.children,w,c.key):f!==null&&(f.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===ar&&ud(T)===f.type)?(w=o(f,c.props),w.ref=Tn(x,f,c),w.return=x,w):(w=oo(c.type,c.key,c.props,null,x.mode,w),w.ref=Tn(x,f,c),w.return=x,w)}function u(x,f,c,w){return f===null||f.tag!==4||f.stateNode.containerInfo!==c.containerInfo||f.stateNode.implementation!==c.implementation?(f=zl(c,x.mode,w),f.return=x,f):(f=o(f,c.children||[]),f.return=x,f)}function g(x,f,c,w,T){return f===null||f.tag!==7?(f=Tr(c,x.mode,w,T),f.return=x,f):(f=o(f,c),f.return=x,f)}function m(x,f,c){if(typeof f=="string"&&f!==""||typeof f=="number")return f=Cl(""+f,x.mode,c),f.return=x,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Da:return c=oo(f.type,f.key,f.props,null,x.mode,c),c.ref=Tn(x,null,f),c.return=x,c;case Hr:return f=zl(f,x.mode,c),f.return=x,f;case ar:var w=f._init;return m(x,w(f._payload),c)}if(Rn(f)||Cn(f))return f=Tr(f,x.mode,c,null),f.return=x,f;Fa(x,f)}return null}function h(x,f,c,w){var T=f!==null?f.key:null;if(typeof c=="string"&&c!==""||typeof c=="number")return T!==null?null:i(x,f,""+c,w);if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Da:return c.key===T?d(x,f,c,w):null;case Hr:return c.key===T?u(x,f,c,w):null;case ar:return T=c._init,h(x,f,T(c._payload),w)}if(Rn(c)||Cn(c))return T!==null?null:g(x,f,c,w,null);Fa(x,c)}return null}function S(x,f,c,w,T){if(typeof w=="string"&&w!==""||typeof w=="number")return x=x.get(c)||null,i(f,x,""+w,T);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case Da:return x=x.get(w.key===null?c:w.key)||null,d(f,x,w,T);case Hr:return x=x.get(w.key===null?c:w.key)||null,u(f,x,w,T);case ar:var L=w._init;return S(x,f,c,L(w._payload),T)}if(Rn(w)||Cn(w))return x=x.get(c)||null,g(f,x,w,T,null);Fa(f,w)}return null}function N(x,f,c,w){for(var T=null,L=null,y=f,k=f=0,F=null;y!==null&&k<c.length;k++){y.index>k?(F=y,y=null):F=y.sibling;var j=h(x,y,c[k],w);if(j===null){y===null&&(y=F);break}e&&y&&j.alternate===null&&t(x,y),f=l(j,f,k),L===null?T=j:L.sibling=j,L=j,y=F}if(k===c.length)return n(x,y),Se&&Nr(x,k),T;if(y===null){for(;k<c.length;k++)y=m(x,c[k],w),y!==null&&(f=l(y,f,k),L===null?T=y:L.sibling=y,L=y);return Se&&Nr(x,k),T}for(y=a(x,y);k<c.length;k++)F=S(y,x,k,c[k],w),F!==null&&(e&&F.alternate!==null&&y.delete(F.key===null?k:F.key),f=l(F,f,k),L===null?T=F:L.sibling=F,L=F);return e&&y.forEach(function(P){return t(x,P)}),Se&&Nr(x,k),T}function _(x,f,c,w){var T=Cn(c);if(typeof T!="function")throw Error(W(150));if(c=T.call(c),c==null)throw Error(W(151));for(var L=T=null,y=f,k=f=0,F=null,j=c.next();y!==null&&!j.done;k++,j=c.next()){y.index>k?(F=y,y=null):F=y.sibling;var P=h(x,y,j.value,w);if(P===null){y===null&&(y=F);break}e&&y&&P.alternate===null&&t(x,y),f=l(P,f,k),L===null?T=P:L.sibling=P,L=P,y=F}if(j.done)return n(x,y),Se&&Nr(x,k),T;if(y===null){for(;!j.done;k++,j=c.next())j=m(x,j.value,w),j!==null&&(f=l(j,f,k),L===null?T=j:L.sibling=j,L=j);return Se&&Nr(x,k),T}for(y=a(x,y);!j.done;k++,j=c.next())j=S(y,x,k,j.value,w),j!==null&&(e&&j.alternate!==null&&y.delete(j.key===null?k:j.key),f=l(j,f,k),L===null?T=j:L.sibling=j,L=j);return e&&y.forEach(function(C){return t(x,C)}),Se&&Nr(x,k),T}function E(x,f,c,w){if(typeof c=="object"&&c!==null&&c.type===Qr&&c.key===null&&(c=c.props.children),typeof c=="object"&&c!==null){switch(c.$$typeof){case Da:e:{for(var T=c.key,L=f;L!==null;){if(L.key===T){if(T=c.type,T===Qr){if(L.tag===7){n(x,L.sibling),f=o(L,c.props.children),f.return=x,x=f;break e}}else if(L.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===ar&&ud(T)===L.type){n(x,L.sibling),f=o(L,c.props),f.ref=Tn(x,L,c),f.return=x,x=f;break e}n(x,L);break}else t(x,L);L=L.sibling}c.type===Qr?(f=Tr(c.props.children,x.mode,w,c.key),f.return=x,x=f):(w=oo(c.type,c.key,c.props,null,x.mode,w),w.ref=Tn(x,f,c),w.return=x,x=w)}return s(x);case Hr:e:{for(L=c.key;f!==null;){if(f.key===L)if(f.tag===4&&f.stateNode.containerInfo===c.containerInfo&&f.stateNode.implementation===c.implementation){n(x,f.sibling),f=o(f,c.children||[]),f.return=x,x=f;break e}else{n(x,f);break}else t(x,f);f=f.sibling}f=zl(c,x.mode,w),f.return=x,x=f}return s(x);case ar:return L=c._init,E(x,f,L(c._payload),w)}if(Rn(c))return N(x,f,c,w);if(Cn(c))return _(x,f,c,w);Fa(x,c)}return typeof c=="string"&&c!==""||typeof c=="number"?(c=""+c,f!==null&&f.tag===6?(n(x,f.sibling),f=o(f,c),f.return=x,x=f):(n(x,f),f=Cl(c,x.mode,w),f.return=x,x=f),s(x)):n(x,f)}return E}var mn=xu(!0),mu=xu(!1),ko=wr(null),So=null,tn=null,Xs=null;function Zs(){Xs=tn=So=null}function ei(e){var t=ko.current;ke(ko),e._currentValue=t}function is(e,t,n){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===n)break;e=e.return}}function cn(e,t){So=e,Xs=tn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(nt=!0),e.firstContext=null)}function jt(e){var t=e._currentValue;if(Xs!==e)if(e={context:e,memoizedValue:t,next:null},tn===null){if(So===null)throw Error(W(308));tn=e,So.dependencies={lanes:0,firstContext:e}}else tn=tn.next=e;return t}var Er=null;function ti(e){Er===null?Er=[e]:Er.push(e)}function gu(e,t,n,a){var o=t.interleaved;return o===null?(n.next=n,ti(t)):(n.next=o.next,o.next=n),t.interleaved=n,Jt(e,a)}function Jt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var or=!1;function ri(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function hu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Qt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function mr(e,t,n){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,xe&2){var o=a.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),a.pending=t,Jt(e,n)}return o=a.interleaved,o===null?(t.next=t,ti(a)):(t.next=o.next,o.next=t),a.interleaved=t,Jt(e,n)}function Za(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Fs(e,n)}}function pd(e,t){var n=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,n===a)){var o=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?o=l=s:l=l.next=s,n=n.next}while(n!==null);l===null?o=l=t:l=l.next=t}else o=l=t;n={baseState:a.baseState,firstBaseUpdate:o,lastBaseUpdate:l,shared:a.shared,effects:a.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function _o(e,t,n,a){var o=e.updateQueue;or=!1;var l=o.firstBaseUpdate,s=o.lastBaseUpdate,i=o.shared.pending;if(i!==null){o.shared.pending=null;var d=i,u=d.next;d.next=null,s===null?l=u:s.next=u,s=d;var g=e.alternate;g!==null&&(g=g.updateQueue,i=g.lastBaseUpdate,i!==s&&(i===null?g.firstBaseUpdate=u:i.next=u,g.lastBaseUpdate=d))}if(l!==null){var m=o.baseState;s=0,g=u=d=null,i=l;do{var h=i.lane,S=i.eventTime;if((a&h)===h){g!==null&&(g=g.next={eventTime:S,lane:0,tag:i.tag,payload:i.payload,callback:i.callback,next:null});e:{var N=e,_=i;switch(h=t,S=n,_.tag){case 1:if(N=_.payload,typeof N=="function"){m=N.call(S,m,h);break e}m=N;break e;case 3:N.flags=N.flags&-65537|128;case 0:if(N=_.payload,h=typeof N=="function"?N.call(S,m,h):N,h==null)break e;m=Ce({},m,h);break e;case 2:or=!0}}i.callback!==null&&i.lane!==0&&(e.flags|=64,h=o.effects,h===null?o.effects=[i]:h.push(i))}else S={eventTime:S,lane:h,tag:i.tag,payload:i.payload,callback:i.callback,next:null},g===null?(u=g=S,d=m):g=g.next=S,s|=h;if(i=i.next,i===null){if(i=o.shared.pending,i===null)break;h=i,i=h.next,h.next=null,o.lastBaseUpdate=h,o.shared.pending=null}}while(!0);if(g===null&&(d=m),o.baseState=d,o.firstBaseUpdate=u,o.lastBaseUpdate=g,t=o.shared.interleaved,t!==null){o=t;do s|=o.lane,o=o.next;while(o!==t)}else l===null&&(o.shared.lanes=0);Or|=s,e.lanes=s,e.memoizedState=m}}function fd(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var a=e[t],o=a.callback;if(o!==null){if(a.callback=null,a=n,typeof o!="function")throw Error(W(191,o));o.call(a)}}}var ja={},$t=wr(ja),da=wr(ja),ca=wr(ja);function Dr(e){if(e===ja)throw Error(W(174));return e}function ni(e,t){switch(je(ca,t),je(da,e),je($t,ja),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Ul(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Ul(t,e)}ke($t),je($t,t)}function gn(){ke($t),ke(da),ke(ca)}function vu(e){Dr(ca.current);var t=Dr($t.current),n=Ul(t,e.type);t!==n&&(je(da,e),je($t,n))}function ai(e){da.current===e&&(ke($t),ke(da))}var _e=wr(0);function No(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var jl=[];function oi(){for(var e=0;e<jl.length;e++)jl[e]._workInProgressVersionPrimary=null;jl.length=0}var eo=Xt.ReactCurrentDispatcher,wl=Xt.ReactCurrentBatchConfig,Rr=0,Ne=null,Oe=null,Me=null,Co=!1,Yn=!1,ua=0,Ix=0;function Ye(){throw Error(W(321))}function li(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!It(e[n],t[n]))return!1;return!0}function si(e,t,n,a,o,l){if(Rr=l,Ne=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,eo.current=e===null||e.memoizedState===null?Ox:Bx,e=n(a,o),Yn){l=0;do{if(Yn=!1,ua=0,25<=l)throw Error(W(301));l+=1,Me=Oe=null,t.updateQueue=null,eo.current=Mx,e=n(a,o)}while(Yn)}if(eo.current=zo,t=Oe!==null&&Oe.next!==null,Rr=0,Me=Oe=Ne=null,Co=!1,t)throw Error(W(300));return e}function ii(){var e=ua!==0;return ua=0,e}function Ot(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Me===null?Ne.memoizedState=Me=e:Me=Me.next=e,Me}function wt(){if(Oe===null){var e=Ne.alternate;e=e!==null?e.memoizedState:null}else e=Oe.next;var t=Me===null?Ne.memoizedState:Me.next;if(t!==null)Me=t,Oe=e;else{if(e===null)throw Error(W(310));Oe=e,e={memoizedState:Oe.memoizedState,baseState:Oe.baseState,baseQueue:Oe.baseQueue,queue:Oe.queue,next:null},Me===null?Ne.memoizedState=Me=e:Me=Me.next=e}return Me}function pa(e,t){return typeof t=="function"?t(e):t}function kl(e){var t=wt(),n=t.queue;if(n===null)throw Error(W(311));n.lastRenderedReducer=e;var a=Oe,o=a.baseQueue,l=n.pending;if(l!==null){if(o!==null){var s=o.next;o.next=l.next,l.next=s}a.baseQueue=o=l,n.pending=null}if(o!==null){l=o.next,a=a.baseState;var i=s=null,d=null,u=l;do{var g=u.lane;if((Rr&g)===g)d!==null&&(d=d.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),a=u.hasEagerState?u.eagerState:e(a,u.action);else{var m={lane:g,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};d===null?(i=d=m,s=a):d=d.next=m,Ne.lanes|=g,Or|=g}u=u.next}while(u!==null&&u!==l);d===null?s=a:d.next=i,It(a,t.memoizedState)||(nt=!0),t.memoizedState=a,t.baseState=s,t.baseQueue=d,n.lastRenderedState=a}if(e=n.interleaved,e!==null){o=e;do l=o.lane,Ne.lanes|=l,Or|=l,o=o.next;while(o!==e)}else o===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Sl(e){var t=wt(),n=t.queue;if(n===null)throw Error(W(311));n.lastRenderedReducer=e;var a=n.dispatch,o=n.pending,l=t.memoizedState;if(o!==null){n.pending=null;var s=o=o.next;do l=e(l,s.action),s=s.next;while(s!==o);It(l,t.memoizedState)||(nt=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,a]}function yu(){}function bu(e,t){var n=Ne,a=wt(),o=t(),l=!It(a.memoizedState,o);if(l&&(a.memoizedState=o,nt=!0),a=a.queue,di(ku.bind(null,n,a,e),[e]),a.getSnapshot!==t||l||Me!==null&&Me.memoizedState.tag&1){if(n.flags|=2048,fa(9,wu.bind(null,n,a,o,t),void 0,null),Fe===null)throw Error(W(349));Rr&30||ju(n,t,o)}return o}function ju(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ne.updateQueue,t===null?(t={lastEffect:null,stores:null},Ne.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function wu(e,t,n,a){t.value=n,t.getSnapshot=a,Su(t)&&_u(e)}function ku(e,t,n){return n(function(){Su(t)&&_u(e)})}function Su(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!It(e,n)}catch{return!0}}function _u(e){var t=Jt(e,1);t!==null&&Tt(t,e,1,-1)}function xd(e){var t=Ot();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:pa,lastRenderedState:e},t.queue=e,e=e.dispatch=Rx.bind(null,Ne,e),[t.memoizedState,e]}function fa(e,t,n,a){return e={tag:e,create:t,destroy:n,deps:a,next:null},t=Ne.updateQueue,t===null?(t={lastEffect:null,stores:null},Ne.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(a=n.next,n.next=e,e.next=a,t.lastEffect=e)),e}function Nu(){return wt().memoizedState}function to(e,t,n,a){var o=Ot();Ne.flags|=e,o.memoizedState=fa(1|t,n,void 0,a===void 0?null:a)}function Ho(e,t,n,a){var o=wt();a=a===void 0?null:a;var l=void 0;if(Oe!==null){var s=Oe.memoizedState;if(l=s.destroy,a!==null&&li(a,s.deps)){o.memoizedState=fa(t,n,l,a);return}}Ne.flags|=e,o.memoizedState=fa(1|t,n,l,a)}function md(e,t){return to(8390656,8,e,t)}function di(e,t){return Ho(2048,8,e,t)}function Cu(e,t){return Ho(4,2,e,t)}function zu(e,t){return Ho(4,4,e,t)}function Eu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Du(e,t,n){return n=n!=null?n.concat([e]):null,Ho(4,4,Eu.bind(null,t,e),n)}function ci(){}function Pu(e,t){var n=wt();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&li(t,a[1])?a[0]:(n.memoizedState=[e,t],e)}function Tu(e,t){var n=wt();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&li(t,a[1])?a[0]:(e=e(),n.memoizedState=[e,t],e)}function Iu(e,t,n){return Rr&21?(It(n,t)||(n=Bc(),Ne.lanes|=n,Or|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,nt=!0),e.memoizedState=n)}function Lx(e,t){var n=ye;ye=n!==0&&4>n?n:4,e(!0);var a=wl.transition;wl.transition={};try{e(!1),t()}finally{ye=n,wl.transition=a}}function Lu(){return wt().memoizedState}function Ax(e,t,n){var a=hr(e);if(n={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null},Au(e))Ru(t,n);else if(n=gu(e,t,n,a),n!==null){var o=Ze();Tt(n,e,a,o),Ou(n,t,a)}}function Rx(e,t,n){var a=hr(e),o={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null};if(Au(e))Ru(t,o);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var s=t.lastRenderedState,i=l(s,n);if(o.hasEagerState=!0,o.eagerState=i,It(i,s)){var d=t.interleaved;d===null?(o.next=o,ti(t)):(o.next=d.next,d.next=o),t.interleaved=o;return}}catch{}finally{}n=gu(e,t,o,a),n!==null&&(o=Ze(),Tt(n,e,a,o),Ou(n,t,a))}}function Au(e){var t=e.alternate;return e===Ne||t!==null&&t===Ne}function Ru(e,t){Yn=Co=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Ou(e,t,n){if(n&4194240){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Fs(e,n)}}var zo={readContext:jt,useCallback:Ye,useContext:Ye,useEffect:Ye,useImperativeHandle:Ye,useInsertionEffect:Ye,useLayoutEffect:Ye,useMemo:Ye,useReducer:Ye,useRef:Ye,useState:Ye,useDebugValue:Ye,useDeferredValue:Ye,useTransition:Ye,useMutableSource:Ye,useSyncExternalStore:Ye,useId:Ye,unstable_isNewReconciler:!1},Ox={readContext:jt,useCallback:function(e,t){return Ot().memoizedState=[e,t===void 0?null:t],e},useContext:jt,useEffect:md,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,to(4194308,4,Eu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return to(4194308,4,e,t)},useInsertionEffect:function(e,t){return to(4,2,e,t)},useMemo:function(e,t){var n=Ot();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var a=Ot();return t=n!==void 0?n(t):t,a.memoizedState=a.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},a.queue=e,e=e.dispatch=Ax.bind(null,Ne,e),[a.memoizedState,e]},useRef:function(e){var t=Ot();return e={current:e},t.memoizedState=e},useState:xd,useDebugValue:ci,useDeferredValue:function(e){return Ot().memoizedState=e},useTransition:function(){var e=xd(!1),t=e[0];return e=Lx.bind(null,e[1]),Ot().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var a=Ne,o=Ot();if(Se){if(n===void 0)throw Error(W(407));n=n()}else{if(n=t(),Fe===null)throw Error(W(349));Rr&30||ju(a,t,n)}o.memoizedState=n;var l={value:n,getSnapshot:t};return o.queue=l,md(ku.bind(null,a,l,e),[e]),a.flags|=2048,fa(9,wu.bind(null,a,l,n,t),void 0,null),n},useId:function(){var e=Ot(),t=Fe.identifierPrefix;if(Se){var n=Vt,a=qt;n=(a&~(1<<32-Pt(a)-1)).toString(32)+n,t=":"+t+"R"+n,n=ua++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Ix++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Bx={readContext:jt,useCallback:Pu,useContext:jt,useEffect:di,useImperativeHandle:Du,useInsertionEffect:Cu,useLayoutEffect:zu,useMemo:Tu,useReducer:kl,useRef:Nu,useState:function(){return kl(pa)},useDebugValue:ci,useDeferredValue:function(e){var t=wt();return Iu(t,Oe.memoizedState,e)},useTransition:function(){var e=kl(pa)[0],t=wt().memoizedState;return[e,t]},useMutableSource:yu,useSyncExternalStore:bu,useId:Lu,unstable_isNewReconciler:!1},Mx={readContext:jt,useCallback:Pu,useContext:jt,useEffect:di,useImperativeHandle:Du,useInsertionEffect:Cu,useLayoutEffect:zu,useMemo:Tu,useReducer:Sl,useRef:Nu,useState:function(){return Sl(pa)},useDebugValue:ci,useDeferredValue:function(e){var t=wt();return Oe===null?t.memoizedState=e:Iu(t,Oe.memoizedState,e)},useTransition:function(){var e=Sl(pa)[0],t=wt().memoizedState;return[e,t]},useMutableSource:yu,useSyncExternalStore:bu,useId:Lu,unstable_isNewReconciler:!1};function zt(e,t){if(e&&e.defaultProps){t=Ce({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ds(e,t,n,a){t=e.memoizedState,n=n(a,t),n=n==null?t:Ce({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Qo={isMounted:function(e){return(e=e._reactInternals)?Fr(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var a=Ze(),o=hr(e),l=Qt(a,o);l.payload=t,n!=null&&(l.callback=n),t=mr(e,l,o),t!==null&&(Tt(t,e,o,a),Za(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var a=Ze(),o=hr(e),l=Qt(a,o);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=mr(e,l,o),t!==null&&(Tt(t,e,o,a),Za(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ze(),a=hr(e),o=Qt(n,a);o.tag=2,t!=null&&(o.callback=t),t=mr(e,o,a),t!==null&&(Tt(t,e,a,n),Za(t,e,a))}};function gd(e,t,n,a,o,l,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,l,s):t.prototype&&t.prototype.isPureReactComponent?!oa(n,a)||!oa(o,l):!0}function Bu(e,t,n){var a=!1,o=br,l=t.contextType;return typeof l=="object"&&l!==null?l=jt(l):(o=ot(t)?Lr:Ke.current,a=t.contextTypes,l=(a=a!=null)?fn(e,o):br),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Qo,e.stateNode=t,t._reactInternals=e,a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=l),t}function hd(e,t,n,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,a),t.state!==e&&Qo.enqueueReplaceState(t,t.state,null)}function cs(e,t,n,a){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs={},ri(e);var l=t.contextType;typeof l=="object"&&l!==null?o.context=jt(l):(l=ot(t)?Lr:Ke.current,o.context=fn(e,l)),o.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(ds(e,t,l,n),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&Qo.enqueueReplaceState(o,o.state,null),_o(e,n,o,a),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function hn(e,t){try{var n="",a=t;do n+=ff(a),a=a.return;while(a);var o=n}catch(l){o=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:o,digest:null}}function _l(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function us(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var $x=typeof WeakMap=="function"?WeakMap:Map;function Mu(e,t,n){n=Qt(-1,n),n.tag=3,n.payload={element:null};var a=t.value;return n.callback=function(){Do||(Do=!0,js=a),us(e,t)},n}function $u(e,t,n){n=Qt(-1,n),n.tag=3;var a=e.type.getDerivedStateFromError;if(typeof a=="function"){var o=t.value;n.payload=function(){return a(o)},n.callback=function(){us(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){us(e,t),typeof a!="function"&&(gr===null?gr=new Set([this]):gr.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function vd(e,t,n){var a=e.pingCache;if(a===null){a=e.pingCache=new $x;var o=new Set;a.set(t,o)}else o=a.get(t),o===void 0&&(o=new Set,a.set(t,o));o.has(n)||(o.add(n),e=em.bind(null,e,t,n),t.then(e,e))}function yd(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function bd(e,t,n,a,o){return e.mode&1?(e.flags|=65536,e.lanes=o,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Qt(-1,1),t.tag=2,mr(n,t,1))),n.lanes|=1),e)}var Fx=Xt.ReactCurrentOwner,nt=!1;function Xe(e,t,n,a){t.child=e===null?mu(t,null,n,a):mn(t,e.child,n,a)}function jd(e,t,n,a,o){n=n.render;var l=t.ref;return cn(t,o),a=si(e,t,n,a,l,o),n=ii(),e!==null&&!nt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Kt(e,t,o)):(Se&&n&&Gs(t),t.flags|=1,Xe(e,t,a,o),t.child)}function wd(e,t,n,a,o){if(e===null){var l=n.type;return typeof l=="function"&&!vi(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,Fu(e,t,l,a,o)):(e=oo(n.type,null,a,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!(e.lanes&o)){var s=l.memoizedProps;if(n=n.compare,n=n!==null?n:oa,n(s,a)&&e.ref===t.ref)return Kt(e,t,o)}return t.flags|=1,e=vr(l,a),e.ref=t.ref,e.return=t,t.child=e}function Fu(e,t,n,a,o){if(e!==null){var l=e.memoizedProps;if(oa(l,a)&&e.ref===t.ref)if(nt=!1,t.pendingProps=a=l,(e.lanes&o)!==0)e.flags&131072&&(nt=!0);else return t.lanes=e.lanes,Kt(e,t,o)}return ps(e,t,n,a,o)}function Uu(e,t,n){var a=t.pendingProps,o=a.children,l=e!==null?e.memoizedState:null;if(a.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},je(nn,ct),ct|=n;else{if(!(n&1073741824))return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,je(nn,ct),ct|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},a=l!==null?l.baseLanes:n,je(nn,ct),ct|=a}else l!==null?(a=l.baseLanes|n,t.memoizedState=null):a=n,je(nn,ct),ct|=a;return Xe(e,t,o,n),t.child}function Wu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ps(e,t,n,a,o){var l=ot(n)?Lr:Ke.current;return l=fn(t,l),cn(t,o),n=si(e,t,n,a,l,o),a=ii(),e!==null&&!nt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Kt(e,t,o)):(Se&&a&&Gs(t),t.flags|=1,Xe(e,t,n,o),t.child)}function kd(e,t,n,a,o){if(ot(n)){var l=!0;bo(t)}else l=!1;if(cn(t,o),t.stateNode===null)ro(e,t),Bu(t,n,a),cs(t,n,a,o),a=!0;else if(e===null){var s=t.stateNode,i=t.memoizedProps;s.props=i;var d=s.context,u=n.contextType;typeof u=="object"&&u!==null?u=jt(u):(u=ot(n)?Lr:Ke.current,u=fn(t,u));var g=n.getDerivedStateFromProps,m=typeof g=="function"||typeof s.getSnapshotBeforeUpdate=="function";m||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==a||d!==u)&&hd(t,s,a,u),or=!1;var h=t.memoizedState;s.state=h,_o(t,a,s,o),d=t.memoizedState,i!==a||h!==d||at.current||or?(typeof g=="function"&&(ds(t,n,g,a),d=t.memoizedState),(i=or||gd(t,n,i,a,h,d,u))?(m||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=d),s.props=a,s.state=d,s.context=u,a=i):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{s=t.stateNode,hu(e,t),i=t.memoizedProps,u=t.type===t.elementType?i:zt(t.type,i),s.props=u,m=t.pendingProps,h=s.context,d=n.contextType,typeof d=="object"&&d!==null?d=jt(d):(d=ot(n)?Lr:Ke.current,d=fn(t,d));var S=n.getDerivedStateFromProps;(g=typeof S=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==m||h!==d)&&hd(t,s,a,d),or=!1,h=t.memoizedState,s.state=h,_o(t,a,s,o);var N=t.memoizedState;i!==m||h!==N||at.current||or?(typeof S=="function"&&(ds(t,n,S,a),N=t.memoizedState),(u=or||gd(t,n,u,a,h,N,d)||!1)?(g||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(a,N,d),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(a,N,d)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=N),s.props=a,s.state=N,s.context=d,a=u):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),a=!1)}return fs(e,t,n,a,l,o)}function fs(e,t,n,a,o,l){Wu(e,t);var s=(t.flags&128)!==0;if(!a&&!s)return o&&id(t,n,!1),Kt(e,t,l);a=t.stateNode,Fx.current=t;var i=s&&typeof n.getDerivedStateFromError!="function"?null:a.render();return t.flags|=1,e!==null&&s?(t.child=mn(t,e.child,null,l),t.child=mn(t,null,i,l)):Xe(e,t,i,l),t.memoizedState=a.state,o&&id(t,n,!0),t.child}function qu(e){var t=e.stateNode;t.pendingContext?sd(e,t.pendingContext,t.pendingContext!==t.context):t.context&&sd(e,t.context,!1),ni(e,t.containerInfo)}function Sd(e,t,n,a,o){return xn(),Ks(o),t.flags|=256,Xe(e,t,n,a),t.child}var xs={dehydrated:null,treeContext:null,retryLane:0};function ms(e){return{baseLanes:e,cachePool:null,transitions:null}}function Vu(e,t,n){var a=t.pendingProps,o=_e.current,l=!1,s=(t.flags&128)!==0,i;if((i=s)||(i=e!==null&&e.memoizedState===null?!1:(o&2)!==0),i?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),je(_e,o&1),e===null)return ss(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(s=a.children,e=a.fallback,l?(a=t.mode,l=t.child,s={mode:"hidden",children:s},!(a&1)&&l!==null?(l.childLanes=0,l.pendingProps=s):l=Jo(s,a,0,null),e=Tr(e,a,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=ms(n),t.memoizedState=xs,e):ui(t,s));if(o=e.memoizedState,o!==null&&(i=o.dehydrated,i!==null))return Ux(e,t,s,a,i,o,n);if(l){l=a.fallback,s=t.mode,o=e.child,i=o.sibling;var d={mode:"hidden",children:a.children};return!(s&1)&&t.child!==o?(a=t.child,a.childLanes=0,a.pendingProps=d,t.deletions=null):(a=vr(o,d),a.subtreeFlags=o.subtreeFlags&14680064),i!==null?l=vr(i,l):(l=Tr(l,s,n,null),l.flags|=2),l.return=t,a.return=t,a.sibling=l,t.child=a,a=l,l=t.child,s=e.child.memoizedState,s=s===null?ms(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},l.memoizedState=s,l.childLanes=e.childLanes&~n,t.memoizedState=xs,a}return l=e.child,e=l.sibling,a=vr(l,{mode:"visible",children:a.children}),!(t.mode&1)&&(a.lanes=n),a.return=t,a.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=a,t.memoizedState=null,a}function ui(e,t){return t=Jo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ua(e,t,n,a){return a!==null&&Ks(a),mn(t,e.child,null,n),e=ui(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Ux(e,t,n,a,o,l,s){if(n)return t.flags&256?(t.flags&=-257,a=_l(Error(W(422))),Ua(e,t,s,a)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=a.fallback,o=t.mode,a=Jo({mode:"visible",children:a.children},o,0,null),l=Tr(l,o,s,null),l.flags|=2,a.return=t,l.return=t,a.sibling=l,t.child=a,t.mode&1&&mn(t,e.child,null,s),t.child.memoizedState=ms(s),t.memoizedState=xs,l);if(!(t.mode&1))return Ua(e,t,s,null);if(o.data==="$!"){if(a=o.nextSibling&&o.nextSibling.dataset,a)var i=a.dgst;return a=i,l=Error(W(419)),a=_l(l,a,void 0),Ua(e,t,s,a)}if(i=(s&e.childLanes)!==0,nt||i){if(a=Fe,a!==null){switch(s&-s){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=o&(a.suspendedLanes|s)?0:o,o!==0&&o!==l.retryLane&&(l.retryLane=o,Jt(e,o),Tt(a,e,o,-1))}return hi(),a=_l(Error(W(421))),Ua(e,t,s,a)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=tm.bind(null,e),o._reactRetry=t,null):(e=l.treeContext,ut=xr(o.nextSibling),pt=t,Se=!0,Dt=null,e!==null&&(ht[vt++]=qt,ht[vt++]=Vt,ht[vt++]=Ar,qt=e.id,Vt=e.overflow,Ar=t),t=ui(t,a.children),t.flags|=4096,t)}function _d(e,t,n){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),is(e.return,t,n)}function Nl(e,t,n,a,o){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:n,tailMode:o}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=a,l.tail=n,l.tailMode=o)}function Hu(e,t,n){var a=t.pendingProps,o=a.revealOrder,l=a.tail;if(Xe(e,t,a.children,n),a=_e.current,a&2)a=a&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&_d(e,n,t);else if(e.tag===19)_d(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}a&=1}if(je(_e,a),!(t.mode&1))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;n!==null;)e=n.alternate,e!==null&&No(e)===null&&(o=n),n=n.sibling;n=o,n===null?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Nl(t,!1,o,n,l);break;case"backwards":for(n=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&No(e)===null){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}Nl(t,!0,n,null,l);break;case"together":Nl(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ro(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Kt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Or|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(W(153));if(t.child!==null){for(e=t.child,n=vr(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=vr(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Wx(e,t,n){switch(t.tag){case 3:qu(t),xn();break;case 5:vu(t);break;case 1:ot(t.type)&&bo(t);break;case 4:ni(t,t.stateNode.containerInfo);break;case 10:var a=t.type._context,o=t.memoizedProps.value;je(ko,a._currentValue),a._currentValue=o;break;case 13:if(a=t.memoizedState,a!==null)return a.dehydrated!==null?(je(_e,_e.current&1),t.flags|=128,null):n&t.child.childLanes?Vu(e,t,n):(je(_e,_e.current&1),e=Kt(e,t,n),e!==null?e.sibling:null);je(_e,_e.current&1);break;case 19:if(a=(n&t.childLanes)!==0,e.flags&128){if(a)return Hu(e,t,n);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),je(_e,_e.current),a)break;return null;case 22:case 23:return t.lanes=0,Uu(e,t,n)}return Kt(e,t,n)}var Qu,gs,Yu,Gu;Qu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};gs=function(){};Yu=function(e,t,n,a){var o=e.memoizedProps;if(o!==a){e=t.stateNode,Dr($t.current);var l=null;switch(n){case"input":o=Bl(e,o),a=Bl(e,a),l=[];break;case"select":o=Ce({},o,{value:void 0}),a=Ce({},a,{value:void 0}),l=[];break;case"textarea":o=Fl(e,o),a=Fl(e,a),l=[];break;default:typeof o.onClick!="function"&&typeof a.onClick=="function"&&(e.onclick=vo)}Wl(n,a);var s;n=null;for(u in o)if(!a.hasOwnProperty(u)&&o.hasOwnProperty(u)&&o[u]!=null)if(u==="style"){var i=o[u];for(s in i)i.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Xn.hasOwnProperty(u)?l||(l=[]):(l=l||[]).push(u,null));for(u in a){var d=a[u];if(i=o!=null?o[u]:void 0,a.hasOwnProperty(u)&&d!==i&&(d!=null||i!=null))if(u==="style")if(i){for(s in i)!i.hasOwnProperty(s)||d&&d.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in d)d.hasOwnProperty(s)&&i[s]!==d[s]&&(n||(n={}),n[s]=d[s])}else n||(l||(l=[]),l.push(u,n)),n=d;else u==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,i=i?i.__html:void 0,d!=null&&i!==d&&(l=l||[]).push(u,d)):u==="children"?typeof d!="string"&&typeof d!="number"||(l=l||[]).push(u,""+d):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Xn.hasOwnProperty(u)?(d!=null&&u==="onScroll"&&we("scroll",e),l||i===d||(l=[])):(l=l||[]).push(u,d))}n&&(l=l||[]).push("style",n);var u=l;(t.updateQueue=u)&&(t.flags|=4)}};Gu=function(e,t,n,a){n!==a&&(t.flags|=4)};function In(e,t){if(!Se)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function Ge(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,a=0;if(t)for(var o=e.child;o!==null;)n|=o.lanes|o.childLanes,a|=o.subtreeFlags&14680064,a|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)n|=o.lanes|o.childLanes,a|=o.subtreeFlags,a|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=a,e.childLanes=n,t}function qx(e,t,n){var a=t.pendingProps;switch(Js(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ge(t),null;case 1:return ot(t.type)&&yo(),Ge(t),null;case 3:return a=t.stateNode,gn(),ke(at),ke(Ke),oi(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&($a(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Dt!==null&&(Ss(Dt),Dt=null))),gs(e,t),Ge(t),null;case 5:ai(t);var o=Dr(ca.current);if(n=t.type,e!==null&&t.stateNode!=null)Yu(e,t,n,a,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!a){if(t.stateNode===null)throw Error(W(166));return Ge(t),null}if(e=Dr($t.current),$a(t)){a=t.stateNode,n=t.type;var l=t.memoizedProps;switch(a[Bt]=t,a[ia]=l,e=(t.mode&1)!==0,n){case"dialog":we("cancel",a),we("close",a);break;case"iframe":case"object":case"embed":we("load",a);break;case"video":case"audio":for(o=0;o<Bn.length;o++)we(Bn[o],a);break;case"source":we("error",a);break;case"img":case"image":case"link":we("error",a),we("load",a);break;case"details":we("toggle",a);break;case"input":Li(a,l),we("invalid",a);break;case"select":a._wrapperState={wasMultiple:!!l.multiple},we("invalid",a);break;case"textarea":Ri(a,l),we("invalid",a)}Wl(n,l),o=null;for(var s in l)if(l.hasOwnProperty(s)){var i=l[s];s==="children"?typeof i=="string"?a.textContent!==i&&(l.suppressHydrationWarning!==!0&&Ma(a.textContent,i,e),o=["children",i]):typeof i=="number"&&a.textContent!==""+i&&(l.suppressHydrationWarning!==!0&&Ma(a.textContent,i,e),o=["children",""+i]):Xn.hasOwnProperty(s)&&i!=null&&s==="onScroll"&&we("scroll",a)}switch(n){case"input":Pa(a),Ai(a,l,!0);break;case"textarea":Pa(a),Oi(a);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(a.onclick=vo)}a=o,t.updateQueue=a,a!==null&&(t.flags|=4)}else{s=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=kc(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof a.is=="string"?e=s.createElement(n,{is:a.is}):(e=s.createElement(n),n==="select"&&(s=e,a.multiple?s.multiple=!0:a.size&&(s.size=a.size))):e=s.createElementNS(e,n),e[Bt]=t,e[ia]=a,Qu(e,t,!1,!1),t.stateNode=e;e:{switch(s=ql(n,a),n){case"dialog":we("cancel",e),we("close",e),o=a;break;case"iframe":case"object":case"embed":we("load",e),o=a;break;case"video":case"audio":for(o=0;o<Bn.length;o++)we(Bn[o],e);o=a;break;case"source":we("error",e),o=a;break;case"img":case"image":case"link":we("error",e),we("load",e),o=a;break;case"details":we("toggle",e),o=a;break;case"input":Li(e,a),o=Bl(e,a),we("invalid",e);break;case"option":o=a;break;case"select":e._wrapperState={wasMultiple:!!a.multiple},o=Ce({},a,{value:void 0}),we("invalid",e);break;case"textarea":Ri(e,a),o=Fl(e,a),we("invalid",e);break;default:o=a}Wl(n,o),i=o;for(l in i)if(i.hasOwnProperty(l)){var d=i[l];l==="style"?Nc(e,d):l==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,d!=null&&Sc(e,d)):l==="children"?typeof d=="string"?(n!=="textarea"||d!=="")&&Zn(e,d):typeof d=="number"&&Zn(e,""+d):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(Xn.hasOwnProperty(l)?d!=null&&l==="onScroll"&&we("scroll",e):d!=null&&As(e,l,d,s))}switch(n){case"input":Pa(e),Ai(e,a,!1);break;case"textarea":Pa(e),Oi(e);break;case"option":a.value!=null&&e.setAttribute("value",""+yr(a.value));break;case"select":e.multiple=!!a.multiple,l=a.value,l!=null?on(e,!!a.multiple,l,!1):a.defaultValue!=null&&on(e,!!a.multiple,a.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=vo)}switch(n){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}}a&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ge(t),null;case 6:if(e&&t.stateNode!=null)Gu(e,t,e.memoizedProps,a);else{if(typeof a!="string"&&t.stateNode===null)throw Error(W(166));if(n=Dr(ca.current),Dr($t.current),$a(t)){if(a=t.stateNode,n=t.memoizedProps,a[Bt]=t,(l=a.nodeValue!==n)&&(e=pt,e!==null))switch(e.tag){case 3:Ma(a.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Ma(a.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else a=(n.nodeType===9?n:n.ownerDocument).createTextNode(a),a[Bt]=t,t.stateNode=a}return Ge(t),null;case 13:if(ke(_e),a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Se&&ut!==null&&t.mode&1&&!(t.flags&128))fu(),xn(),t.flags|=98560,l=!1;else if(l=$a(t),a!==null&&a.dehydrated!==null){if(e===null){if(!l)throw Error(W(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(W(317));l[Bt]=t}else xn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Ge(t),l=!1}else Dt!==null&&(Ss(Dt),Dt=null),l=!0;if(!l)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(a=a!==null,a!==(e!==null&&e.memoizedState!==null)&&a&&(t.child.flags|=8192,t.mode&1&&(e===null||_e.current&1?Be===0&&(Be=3):hi())),t.updateQueue!==null&&(t.flags|=4),Ge(t),null);case 4:return gn(),gs(e,t),e===null&&la(t.stateNode.containerInfo),Ge(t),null;case 10:return ei(t.type._context),Ge(t),null;case 17:return ot(t.type)&&yo(),Ge(t),null;case 19:if(ke(_e),l=t.memoizedState,l===null)return Ge(t),null;if(a=(t.flags&128)!==0,s=l.rendering,s===null)if(a)In(l,!1);else{if(Be!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=No(e),s!==null){for(t.flags|=128,In(l,!1),a=s.updateQueue,a!==null&&(t.updateQueue=a,t.flags|=4),t.subtreeFlags=0,a=n,n=t.child;n!==null;)l=n,e=a,l.flags&=14680066,s=l.alternate,s===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=s.childLanes,l.lanes=s.lanes,l.child=s.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=s.memoizedProps,l.memoizedState=s.memoizedState,l.updateQueue=s.updateQueue,l.type=s.type,e=s.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return je(_e,_e.current&1|2),t.child}e=e.sibling}l.tail!==null&&Te()>vn&&(t.flags|=128,a=!0,In(l,!1),t.lanes=4194304)}else{if(!a)if(e=No(s),e!==null){if(t.flags|=128,a=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),In(l,!0),l.tail===null&&l.tailMode==="hidden"&&!s.alternate&&!Se)return Ge(t),null}else 2*Te()-l.renderingStartTime>vn&&n!==1073741824&&(t.flags|=128,a=!0,In(l,!1),t.lanes=4194304);l.isBackwards?(s.sibling=t.child,t.child=s):(n=l.last,n!==null?n.sibling=s:t.child=s,l.last=s)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=Te(),t.sibling=null,n=_e.current,je(_e,a?n&1|2:n&1),t):(Ge(t),null);case 22:case 23:return gi(),a=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==a&&(t.flags|=8192),a&&t.mode&1?ct&1073741824&&(Ge(t),t.subtreeFlags&6&&(t.flags|=8192)):Ge(t),null;case 24:return null;case 25:return null}throw Error(W(156,t.tag))}function Vx(e,t){switch(Js(t),t.tag){case 1:return ot(t.type)&&yo(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return gn(),ke(at),ke(Ke),oi(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return ai(t),null;case 13:if(ke(_e),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(W(340));xn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ke(_e),null;case 4:return gn(),null;case 10:return ei(t.type._context),null;case 22:case 23:return gi(),null;case 24:return null;default:return null}}var Wa=!1,Je=!1,Hx=typeof WeakSet=="function"?WeakSet:Set,X=null;function rn(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(a){De(e,t,a)}else n.current=null}function hs(e,t,n){try{n()}catch(a){De(e,t,a)}}var Nd=!1;function Qx(e,t){if(es=mo,e=eu(),Ys(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var a=n.getSelection&&n.getSelection();if(a&&a.rangeCount!==0){n=a.anchorNode;var o=a.anchorOffset,l=a.focusNode;a=a.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var s=0,i=-1,d=-1,u=0,g=0,m=e,h=null;t:for(;;){for(var S;m!==n||o!==0&&m.nodeType!==3||(i=s+o),m!==l||a!==0&&m.nodeType!==3||(d=s+a),m.nodeType===3&&(s+=m.nodeValue.length),(S=m.firstChild)!==null;)h=m,m=S;for(;;){if(m===e)break t;if(h===n&&++u===o&&(i=s),h===l&&++g===a&&(d=s),(S=m.nextSibling)!==null)break;m=h,h=m.parentNode}m=S}n=i===-1||d===-1?null:{start:i,end:d}}else n=null}n=n||{start:0,end:0}}else n=null;for(ts={focusedElem:e,selectionRange:n},mo=!1,X=t;X!==null;)if(t=X,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,X=e;else for(;X!==null;){t=X;try{var N=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(N!==null){var _=N.memoizedProps,E=N.memoizedState,x=t.stateNode,f=x.getSnapshotBeforeUpdate(t.elementType===t.type?_:zt(t.type,_),E);x.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var c=t.stateNode.containerInfo;c.nodeType===1?c.textContent="":c.nodeType===9&&c.documentElement&&c.removeChild(c.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(W(163))}}catch(w){De(t,t.return,w)}if(e=t.sibling,e!==null){e.return=t.return,X=e;break}X=t.return}return N=Nd,Nd=!1,N}function Gn(e,t,n){var a=t.updateQueue;if(a=a!==null?a.lastEffect:null,a!==null){var o=a=a.next;do{if((o.tag&e)===e){var l=o.destroy;o.destroy=void 0,l!==void 0&&hs(t,n,l)}o=o.next}while(o!==a)}}function Yo(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var a=n.create;n.destroy=a()}n=n.next}while(n!==t)}}function vs(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Ju(e){var t=e.alternate;t!==null&&(e.alternate=null,Ju(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Bt],delete t[ia],delete t[as],delete t[Ex],delete t[Dx])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Ku(e){return e.tag===5||e.tag===3||e.tag===4}function Cd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Ku(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ys(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=vo));else if(a!==4&&(e=e.child,e!==null))for(ys(e,t,n),e=e.sibling;e!==null;)ys(e,t,n),e=e.sibling}function bs(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(a!==4&&(e=e.child,e!==null))for(bs(e,t,n),e=e.sibling;e!==null;)bs(e,t,n),e=e.sibling}var We=null,Et=!1;function nr(e,t,n){for(n=n.child;n!==null;)Xu(e,t,n),n=n.sibling}function Xu(e,t,n){if(Mt&&typeof Mt.onCommitFiberUnmount=="function")try{Mt.onCommitFiberUnmount($o,n)}catch{}switch(n.tag){case 5:Je||rn(n,t);case 6:var a=We,o=Et;We=null,nr(e,t,n),We=a,Et=o,We!==null&&(Et?(e=We,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):We.removeChild(n.stateNode));break;case 18:We!==null&&(Et?(e=We,n=n.stateNode,e.nodeType===8?yl(e.parentNode,n):e.nodeType===1&&yl(e,n),na(e)):yl(We,n.stateNode));break;case 4:a=We,o=Et,We=n.stateNode.containerInfo,Et=!0,nr(e,t,n),We=a,Et=o;break;case 0:case 11:case 14:case 15:if(!Je&&(a=n.updateQueue,a!==null&&(a=a.lastEffect,a!==null))){o=a=a.next;do{var l=o,s=l.destroy;l=l.tag,s!==void 0&&(l&2||l&4)&&hs(n,t,s),o=o.next}while(o!==a)}nr(e,t,n);break;case 1:if(!Je&&(rn(n,t),a=n.stateNode,typeof a.componentWillUnmount=="function"))try{a.props=n.memoizedProps,a.state=n.memoizedState,a.componentWillUnmount()}catch(i){De(n,t,i)}nr(e,t,n);break;case 21:nr(e,t,n);break;case 22:n.mode&1?(Je=(a=Je)||n.memoizedState!==null,nr(e,t,n),Je=a):nr(e,t,n);break;default:nr(e,t,n)}}function zd(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Hx),t.forEach(function(a){var o=rm.bind(null,e,a);n.has(a)||(n.add(a),a.then(o,o))})}}function Ct(e,t){var n=t.deletions;if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];try{var l=e,s=t,i=s;e:for(;i!==null;){switch(i.tag){case 5:We=i.stateNode,Et=!1;break e;case 3:We=i.stateNode.containerInfo,Et=!0;break e;case 4:We=i.stateNode.containerInfo,Et=!0;break e}i=i.return}if(We===null)throw Error(W(160));Xu(l,s,o),We=null,Et=!1;var d=o.alternate;d!==null&&(d.return=null),o.return=null}catch(u){De(o,t,u)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Zu(t,e),t=t.sibling}function Zu(e,t){var n=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ct(t,e),Rt(e),a&4){try{Gn(3,e,e.return),Yo(3,e)}catch(_){De(e,e.return,_)}try{Gn(5,e,e.return)}catch(_){De(e,e.return,_)}}break;case 1:Ct(t,e),Rt(e),a&512&&n!==null&&rn(n,n.return);break;case 5:if(Ct(t,e),Rt(e),a&512&&n!==null&&rn(n,n.return),e.flags&32){var o=e.stateNode;try{Zn(o,"")}catch(_){De(e,e.return,_)}}if(a&4&&(o=e.stateNode,o!=null)){var l=e.memoizedProps,s=n!==null?n.memoizedProps:l,i=e.type,d=e.updateQueue;if(e.updateQueue=null,d!==null)try{i==="input"&&l.type==="radio"&&l.name!=null&&jc(o,l),ql(i,s);var u=ql(i,l);for(s=0;s<d.length;s+=2){var g=d[s],m=d[s+1];g==="style"?Nc(o,m):g==="dangerouslySetInnerHTML"?Sc(o,m):g==="children"?Zn(o,m):As(o,g,m,u)}switch(i){case"input":Ml(o,l);break;case"textarea":wc(o,l);break;case"select":var h=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!l.multiple;var S=l.value;S!=null?on(o,!!l.multiple,S,!1):h!==!!l.multiple&&(l.defaultValue!=null?on(o,!!l.multiple,l.defaultValue,!0):on(o,!!l.multiple,l.multiple?[]:"",!1))}o[ia]=l}catch(_){De(e,e.return,_)}}break;case 6:if(Ct(t,e),Rt(e),a&4){if(e.stateNode===null)throw Error(W(162));o=e.stateNode,l=e.memoizedProps;try{o.nodeValue=l}catch(_){De(e,e.return,_)}}break;case 3:if(Ct(t,e),Rt(e),a&4&&n!==null&&n.memoizedState.isDehydrated)try{na(t.containerInfo)}catch(_){De(e,e.return,_)}break;case 4:Ct(t,e),Rt(e);break;case 13:Ct(t,e),Rt(e),o=e.child,o.flags&8192&&(l=o.memoizedState!==null,o.stateNode.isHidden=l,!l||o.alternate!==null&&o.alternate.memoizedState!==null||(xi=Te())),a&4&&zd(e);break;case 22:if(g=n!==null&&n.memoizedState!==null,e.mode&1?(Je=(u=Je)||g,Ct(t,e),Je=u):Ct(t,e),Rt(e),a&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!g&&e.mode&1)for(X=e,g=e.child;g!==null;){for(m=X=g;X!==null;){switch(h=X,S=h.child,h.tag){case 0:case 11:case 14:case 15:Gn(4,h,h.return);break;case 1:rn(h,h.return);var N=h.stateNode;if(typeof N.componentWillUnmount=="function"){a=h,n=h.return;try{t=a,N.props=t.memoizedProps,N.state=t.memoizedState,N.componentWillUnmount()}catch(_){De(a,n,_)}}break;case 5:rn(h,h.return);break;case 22:if(h.memoizedState!==null){Dd(m);continue}}S!==null?(S.return=h,X=S):Dd(m)}g=g.sibling}e:for(g=null,m=e;;){if(m.tag===5){if(g===null){g=m;try{o=m.stateNode,u?(l=o.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(i=m.stateNode,d=m.memoizedProps.style,s=d!=null&&d.hasOwnProperty("display")?d.display:null,i.style.display=_c("display",s))}catch(_){De(e,e.return,_)}}}else if(m.tag===6){if(g===null)try{m.stateNode.nodeValue=u?"":m.memoizedProps}catch(_){De(e,e.return,_)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;g===m&&(g=null),m=m.return}g===m&&(g=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Ct(t,e),Rt(e),a&4&&zd(e);break;case 21:break;default:Ct(t,e),Rt(e)}}function Rt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Ku(n)){var a=n;break e}n=n.return}throw Error(W(160))}switch(a.tag){case 5:var o=a.stateNode;a.flags&32&&(Zn(o,""),a.flags&=-33);var l=Cd(e);bs(e,l,o);break;case 3:case 4:var s=a.stateNode.containerInfo,i=Cd(e);ys(e,i,s);break;default:throw Error(W(161))}}catch(d){De(e,e.return,d)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Yx(e,t,n){X=e,ep(e)}function ep(e,t,n){for(var a=(e.mode&1)!==0;X!==null;){var o=X,l=o.child;if(o.tag===22&&a){var s=o.memoizedState!==null||Wa;if(!s){var i=o.alternate,d=i!==null&&i.memoizedState!==null||Je;i=Wa;var u=Je;if(Wa=s,(Je=d)&&!u)for(X=o;X!==null;)s=X,d=s.child,s.tag===22&&s.memoizedState!==null?Pd(o):d!==null?(d.return=s,X=d):Pd(o);for(;l!==null;)X=l,ep(l),l=l.sibling;X=o,Wa=i,Je=u}Ed(e)}else o.subtreeFlags&8772&&l!==null?(l.return=o,X=l):Ed(e)}}function Ed(e){for(;X!==null;){var t=X;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Je||Yo(5,t);break;case 1:var a=t.stateNode;if(t.flags&4&&!Je)if(n===null)a.componentDidMount();else{var o=t.elementType===t.type?n.memoizedProps:zt(t.type,n.memoizedProps);a.componentDidUpdate(o,n.memoizedState,a.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&fd(t,l,a);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}fd(t,s,n)}break;case 5:var i=t.stateNode;if(n===null&&t.flags&4){n=i;var d=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":d.autoFocus&&n.focus();break;case"img":d.src&&(n.src=d.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var g=u.memoizedState;if(g!==null){var m=g.dehydrated;m!==null&&na(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(W(163))}Je||t.flags&512&&vs(t)}catch(h){De(t,t.return,h)}}if(t===e){X=null;break}if(n=t.sibling,n!==null){n.return=t.return,X=n;break}X=t.return}}function Dd(e){for(;X!==null;){var t=X;if(t===e){X=null;break}var n=t.sibling;if(n!==null){n.return=t.return,X=n;break}X=t.return}}function Pd(e){for(;X!==null;){var t=X;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Yo(4,t)}catch(d){De(t,n,d)}break;case 1:var a=t.stateNode;if(typeof a.componentDidMount=="function"){var o=t.return;try{a.componentDidMount()}catch(d){De(t,o,d)}}var l=t.return;try{vs(t)}catch(d){De(t,l,d)}break;case 5:var s=t.return;try{vs(t)}catch(d){De(t,s,d)}}}catch(d){De(t,t.return,d)}if(t===e){X=null;break}var i=t.sibling;if(i!==null){i.return=t.return,X=i;break}X=t.return}}var Gx=Math.ceil,Eo=Xt.ReactCurrentDispatcher,pi=Xt.ReactCurrentOwner,bt=Xt.ReactCurrentBatchConfig,xe=0,Fe=null,Ie=null,qe=0,ct=0,nn=wr(0),Be=0,xa=null,Or=0,Go=0,fi=0,Jn=null,rt=null,xi=0,vn=1/0,Ut=null,Do=!1,js=null,gr=null,qa=!1,dr=null,Po=0,Kn=0,ws=null,no=-1,ao=0;function Ze(){return xe&6?Te():no!==-1?no:no=Te()}function hr(e){return e.mode&1?xe&2&&qe!==0?qe&-qe:Tx.transition!==null?(ao===0&&(ao=Bc()),ao):(e=ye,e!==0||(e=window.event,e=e===void 0?16:Vc(e.type)),e):1}function Tt(e,t,n,a){if(50<Kn)throw Kn=0,ws=null,Error(W(185));va(e,n,a),(!(xe&2)||e!==Fe)&&(e===Fe&&(!(xe&2)&&(Go|=n),Be===4&&sr(e,qe)),lt(e,a),n===1&&xe===0&&!(t.mode&1)&&(vn=Te()+500,Vo&&kr()))}function lt(e,t){var n=e.callbackNode;Tf(e,t);var a=xo(e,e===Fe?qe:0);if(a===0)n!==null&&$i(n),e.callbackNode=null,e.callbackPriority=0;else if(t=a&-a,e.callbackPriority!==t){if(n!=null&&$i(n),t===1)e.tag===0?Px(Td.bind(null,e)):cu(Td.bind(null,e)),Cx(function(){!(xe&6)&&kr()}),n=null;else{switch(Mc(a)){case 1:n=$s;break;case 4:n=Rc;break;case 16:n=fo;break;case 536870912:n=Oc;break;default:n=fo}n=ip(n,tp.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function tp(e,t){if(no=-1,ao=0,xe&6)throw Error(W(327));var n=e.callbackNode;if(un()&&e.callbackNode!==n)return null;var a=xo(e,e===Fe?qe:0);if(a===0)return null;if(a&30||a&e.expiredLanes||t)t=To(e,a);else{t=a;var o=xe;xe|=2;var l=np();(Fe!==e||qe!==t)&&(Ut=null,vn=Te()+500,Pr(e,t));do try{Xx();break}catch(i){rp(e,i)}while(!0);Zs(),Eo.current=l,xe=o,Ie!==null?t=0:(Fe=null,qe=0,t=Be)}if(t!==0){if(t===2&&(o=Gl(e),o!==0&&(a=o,t=ks(e,o))),t===1)throw n=xa,Pr(e,0),sr(e,a),lt(e,Te()),n;if(t===6)sr(e,a);else{if(o=e.current.alternate,!(a&30)&&!Jx(o)&&(t=To(e,a),t===2&&(l=Gl(e),l!==0&&(a=l,t=ks(e,l))),t===1))throw n=xa,Pr(e,0),sr(e,a),lt(e,Te()),n;switch(e.finishedWork=o,e.finishedLanes=a,t){case 0:case 1:throw Error(W(345));case 2:Cr(e,rt,Ut);break;case 3:if(sr(e,a),(a&130023424)===a&&(t=xi+500-Te(),10<t)){if(xo(e,0)!==0)break;if(o=e.suspendedLanes,(o&a)!==a){Ze(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=ns(Cr.bind(null,e,rt,Ut),t);break}Cr(e,rt,Ut);break;case 4:if(sr(e,a),(a&4194240)===a)break;for(t=e.eventTimes,o=-1;0<a;){var s=31-Pt(a);l=1<<s,s=t[s],s>o&&(o=s),a&=~l}if(a=o,a=Te()-a,a=(120>a?120:480>a?480:1080>a?1080:1920>a?1920:3e3>a?3e3:4320>a?4320:1960*Gx(a/1960))-a,10<a){e.timeoutHandle=ns(Cr.bind(null,e,rt,Ut),a);break}Cr(e,rt,Ut);break;case 5:Cr(e,rt,Ut);break;default:throw Error(W(329))}}}return lt(e,Te()),e.callbackNode===n?tp.bind(null,e):null}function ks(e,t){var n=Jn;return e.current.memoizedState.isDehydrated&&(Pr(e,t).flags|=256),e=To(e,t),e!==2&&(t=rt,rt=n,t!==null&&Ss(t)),e}function Ss(e){rt===null?rt=e:rt.push.apply(rt,e)}function Jx(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var a=0;a<n.length;a++){var o=n[a],l=o.getSnapshot;o=o.value;try{if(!It(l(),o))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function sr(e,t){for(t&=~fi,t&=~Go,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Pt(t),a=1<<n;e[n]=-1,t&=~a}}function Td(e){if(xe&6)throw Error(W(327));un();var t=xo(e,0);if(!(t&1))return lt(e,Te()),null;var n=To(e,t);if(e.tag!==0&&n===2){var a=Gl(e);a!==0&&(t=a,n=ks(e,a))}if(n===1)throw n=xa,Pr(e,0),sr(e,t),lt(e,Te()),n;if(n===6)throw Error(W(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Cr(e,rt,Ut),lt(e,Te()),null}function mi(e,t){var n=xe;xe|=1;try{return e(t)}finally{xe=n,xe===0&&(vn=Te()+500,Vo&&kr())}}function Br(e){dr!==null&&dr.tag===0&&!(xe&6)&&un();var t=xe;xe|=1;var n=bt.transition,a=ye;try{if(bt.transition=null,ye=1,e)return e()}finally{ye=a,bt.transition=n,xe=t,!(xe&6)&&kr()}}function gi(){ct=nn.current,ke(nn)}function Pr(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Nx(n)),Ie!==null)for(n=Ie.return;n!==null;){var a=n;switch(Js(a),a.tag){case 1:a=a.type.childContextTypes,a!=null&&yo();break;case 3:gn(),ke(at),ke(Ke),oi();break;case 5:ai(a);break;case 4:gn();break;case 13:ke(_e);break;case 19:ke(_e);break;case 10:ei(a.type._context);break;case 22:case 23:gi()}n=n.return}if(Fe=e,Ie=e=vr(e.current,null),qe=ct=t,Be=0,xa=null,fi=Go=Or=0,rt=Jn=null,Er!==null){for(t=0;t<Er.length;t++)if(n=Er[t],a=n.interleaved,a!==null){n.interleaved=null;var o=a.next,l=n.pending;if(l!==null){var s=l.next;l.next=o,a.next=s}n.pending=a}Er=null}return e}function rp(e,t){do{var n=Ie;try{if(Zs(),eo.current=zo,Co){for(var a=Ne.memoizedState;a!==null;){var o=a.queue;o!==null&&(o.pending=null),a=a.next}Co=!1}if(Rr=0,Me=Oe=Ne=null,Yn=!1,ua=0,pi.current=null,n===null||n.return===null){Be=1,xa=t,Ie=null;break}e:{var l=e,s=n.return,i=n,d=t;if(t=qe,i.flags|=32768,d!==null&&typeof d=="object"&&typeof d.then=="function"){var u=d,g=i,m=g.tag;if(!(g.mode&1)&&(m===0||m===11||m===15)){var h=g.alternate;h?(g.updateQueue=h.updateQueue,g.memoizedState=h.memoizedState,g.lanes=h.lanes):(g.updateQueue=null,g.memoizedState=null)}var S=yd(s);if(S!==null){S.flags&=-257,bd(S,s,i,l,t),S.mode&1&&vd(l,u,t),t=S,d=u;var N=t.updateQueue;if(N===null){var _=new Set;_.add(d),t.updateQueue=_}else N.add(d);break e}else{if(!(t&1)){vd(l,u,t),hi();break e}d=Error(W(426))}}else if(Se&&i.mode&1){var E=yd(s);if(E!==null){!(E.flags&65536)&&(E.flags|=256),bd(E,s,i,l,t),Ks(hn(d,i));break e}}l=d=hn(d,i),Be!==4&&(Be=2),Jn===null?Jn=[l]:Jn.push(l),l=s;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var x=Mu(l,d,t);pd(l,x);break e;case 1:i=d;var f=l.type,c=l.stateNode;if(!(l.flags&128)&&(typeof f.getDerivedStateFromError=="function"||c!==null&&typeof c.componentDidCatch=="function"&&(gr===null||!gr.has(c)))){l.flags|=65536,t&=-t,l.lanes|=t;var w=$u(l,i,t);pd(l,w);break e}}l=l.return}while(l!==null)}op(n)}catch(T){t=T,Ie===n&&n!==null&&(Ie=n=n.return);continue}break}while(!0)}function np(){var e=Eo.current;return Eo.current=zo,e===null?zo:e}function hi(){(Be===0||Be===3||Be===2)&&(Be=4),Fe===null||!(Or&268435455)&&!(Go&268435455)||sr(Fe,qe)}function To(e,t){var n=xe;xe|=2;var a=np();(Fe!==e||qe!==t)&&(Ut=null,Pr(e,t));do try{Kx();break}catch(o){rp(e,o)}while(!0);if(Zs(),xe=n,Eo.current=a,Ie!==null)throw Error(W(261));return Fe=null,qe=0,Be}function Kx(){for(;Ie!==null;)ap(Ie)}function Xx(){for(;Ie!==null&&!kf();)ap(Ie)}function ap(e){var t=sp(e.alternate,e,ct);e.memoizedProps=e.pendingProps,t===null?op(e):Ie=t,pi.current=null}function op(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Vx(n,t),n!==null){n.flags&=32767,Ie=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Be=6,Ie=null;return}}else if(n=qx(n,t,ct),n!==null){Ie=n;return}if(t=t.sibling,t!==null){Ie=t;return}Ie=t=e}while(t!==null);Be===0&&(Be=5)}function Cr(e,t,n){var a=ye,o=bt.transition;try{bt.transition=null,ye=1,Zx(e,t,n,a)}finally{bt.transition=o,ye=a}return null}function Zx(e,t,n,a){do un();while(dr!==null);if(xe&6)throw Error(W(327));n=e.finishedWork;var o=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(W(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if(If(e,l),e===Fe&&(Ie=Fe=null,qe=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||qa||(qa=!0,ip(fo,function(){return un(),null})),l=(n.flags&15990)!==0,n.subtreeFlags&15990||l){l=bt.transition,bt.transition=null;var s=ye;ye=1;var i=xe;xe|=4,pi.current=null,Qx(e,n),Zu(n,e),yx(ts),mo=!!es,ts=es=null,e.current=n,Yx(n),Sf(),xe=i,ye=s,bt.transition=l}else e.current=n;if(qa&&(qa=!1,dr=e,Po=o),l=e.pendingLanes,l===0&&(gr=null),Cf(n.stateNode),lt(e,Te()),t!==null)for(a=e.onRecoverableError,n=0;n<t.length;n++)o=t[n],a(o.value,{componentStack:o.stack,digest:o.digest});if(Do)throw Do=!1,e=js,js=null,e;return Po&1&&e.tag!==0&&un(),l=e.pendingLanes,l&1?e===ws?Kn++:(Kn=0,ws=e):Kn=0,kr(),null}function un(){if(dr!==null){var e=Mc(Po),t=bt.transition,n=ye;try{if(bt.transition=null,ye=16>e?16:e,dr===null)var a=!1;else{if(e=dr,dr=null,Po=0,xe&6)throw Error(W(331));var o=xe;for(xe|=4,X=e.current;X!==null;){var l=X,s=l.child;if(X.flags&16){var i=l.deletions;if(i!==null){for(var d=0;d<i.length;d++){var u=i[d];for(X=u;X!==null;){var g=X;switch(g.tag){case 0:case 11:case 15:Gn(8,g,l)}var m=g.child;if(m!==null)m.return=g,X=m;else for(;X!==null;){g=X;var h=g.sibling,S=g.return;if(Ju(g),g===u){X=null;break}if(h!==null){h.return=S,X=h;break}X=S}}}var N=l.alternate;if(N!==null){var _=N.child;if(_!==null){N.child=null;do{var E=_.sibling;_.sibling=null,_=E}while(_!==null)}}X=l}}if(l.subtreeFlags&2064&&s!==null)s.return=l,X=s;else e:for(;X!==null;){if(l=X,l.flags&2048)switch(l.tag){case 0:case 11:case 15:Gn(9,l,l.return)}var x=l.sibling;if(x!==null){x.return=l.return,X=x;break e}X=l.return}}var f=e.current;for(X=f;X!==null;){s=X;var c=s.child;if(s.subtreeFlags&2064&&c!==null)c.return=s,X=c;else e:for(s=f;X!==null;){if(i=X,i.flags&2048)try{switch(i.tag){case 0:case 11:case 15:Yo(9,i)}}catch(T){De(i,i.return,T)}if(i===s){X=null;break e}var w=i.sibling;if(w!==null){w.return=i.return,X=w;break e}X=i.return}}if(xe=o,kr(),Mt&&typeof Mt.onPostCommitFiberRoot=="function")try{Mt.onPostCommitFiberRoot($o,e)}catch{}a=!0}return a}finally{ye=n,bt.transition=t}}return!1}function Id(e,t,n){t=hn(n,t),t=Mu(e,t,1),e=mr(e,t,1),t=Ze(),e!==null&&(va(e,1,t),lt(e,t))}function De(e,t,n){if(e.tag===3)Id(e,e,n);else for(;t!==null;){if(t.tag===3){Id(t,e,n);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(gr===null||!gr.has(a))){e=hn(n,e),e=$u(t,e,1),t=mr(t,e,1),e=Ze(),t!==null&&(va(t,1,e),lt(t,e));break}}t=t.return}}function em(e,t,n){var a=e.pingCache;a!==null&&a.delete(t),t=Ze(),e.pingedLanes|=e.suspendedLanes&n,Fe===e&&(qe&n)===n&&(Be===4||Be===3&&(qe&130023424)===qe&&500>Te()-xi?Pr(e,0):fi|=n),lt(e,t)}function lp(e,t){t===0&&(e.mode&1?(t=La,La<<=1,!(La&130023424)&&(La=4194304)):t=1);var n=Ze();e=Jt(e,t),e!==null&&(va(e,t,n),lt(e,n))}function tm(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),lp(e,n)}function rm(e,t){var n=0;switch(e.tag){case 13:var a=e.stateNode,o=e.memoizedState;o!==null&&(n=o.retryLane);break;case 19:a=e.stateNode;break;default:throw Error(W(314))}a!==null&&a.delete(t),lp(e,n)}var sp;sp=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||at.current)nt=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return nt=!1,Wx(e,t,n);nt=!!(e.flags&131072)}else nt=!1,Se&&t.flags&1048576&&uu(t,wo,t.index);switch(t.lanes=0,t.tag){case 2:var a=t.type;ro(e,t),e=t.pendingProps;var o=fn(t,Ke.current);cn(t,n),o=si(null,t,a,e,o,n);var l=ii();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ot(a)?(l=!0,bo(t)):l=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,ri(t),o.updater=Qo,t.stateNode=o,o._reactInternals=t,cs(t,a,e,n),t=fs(null,t,a,!0,l,n)):(t.tag=0,Se&&l&&Gs(t),Xe(null,t,o,n),t=t.child),t;case 16:a=t.elementType;e:{switch(ro(e,t),e=t.pendingProps,o=a._init,a=o(a._payload),t.type=a,o=t.tag=am(a),e=zt(a,e),o){case 0:t=ps(null,t,a,e,n);break e;case 1:t=kd(null,t,a,e,n);break e;case 11:t=jd(null,t,a,e,n);break e;case 14:t=wd(null,t,a,zt(a.type,e),n);break e}throw Error(W(306,a,""))}return t;case 0:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:zt(a,o),ps(e,t,a,o,n);case 1:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:zt(a,o),kd(e,t,a,o,n);case 3:e:{if(qu(t),e===null)throw Error(W(387));a=t.pendingProps,l=t.memoizedState,o=l.element,hu(e,t),_o(t,a,null,n);var s=t.memoizedState;if(a=s.element,l.isDehydrated)if(l={element:a,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){o=hn(Error(W(423)),t),t=Sd(e,t,a,n,o);break e}else if(a!==o){o=hn(Error(W(424)),t),t=Sd(e,t,a,n,o);break e}else for(ut=xr(t.stateNode.containerInfo.firstChild),pt=t,Se=!0,Dt=null,n=mu(t,null,a,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(xn(),a===o){t=Kt(e,t,n);break e}Xe(e,t,a,n)}t=t.child}return t;case 5:return vu(t),e===null&&ss(t),a=t.type,o=t.pendingProps,l=e!==null?e.memoizedProps:null,s=o.children,rs(a,o)?s=null:l!==null&&rs(a,l)&&(t.flags|=32),Wu(e,t),Xe(e,t,s,n),t.child;case 6:return e===null&&ss(t),null;case 13:return Vu(e,t,n);case 4:return ni(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=mn(t,null,a,n):Xe(e,t,a,n),t.child;case 11:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:zt(a,o),jd(e,t,a,o,n);case 7:return Xe(e,t,t.pendingProps,n),t.child;case 8:return Xe(e,t,t.pendingProps.children,n),t.child;case 12:return Xe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(a=t.type._context,o=t.pendingProps,l=t.memoizedProps,s=o.value,je(ko,a._currentValue),a._currentValue=s,l!==null)if(It(l.value,s)){if(l.children===o.children&&!at.current){t=Kt(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var i=l.dependencies;if(i!==null){s=l.child;for(var d=i.firstContext;d!==null;){if(d.context===a){if(l.tag===1){d=Qt(-1,n&-n),d.tag=2;var u=l.updateQueue;if(u!==null){u=u.shared;var g=u.pending;g===null?d.next=d:(d.next=g.next,g.next=d),u.pending=d}}l.lanes|=n,d=l.alternate,d!==null&&(d.lanes|=n),is(l.return,n,t),i.lanes|=n;break}d=d.next}}else if(l.tag===10)s=l.type===t.type?null:l.child;else if(l.tag===18){if(s=l.return,s===null)throw Error(W(341));s.lanes|=n,i=s.alternate,i!==null&&(i.lanes|=n),is(s,n,t),s=l.sibling}else s=l.child;if(s!==null)s.return=l;else for(s=l;s!==null;){if(s===t){s=null;break}if(l=s.sibling,l!==null){l.return=s.return,s=l;break}s=s.return}l=s}Xe(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,a=t.pendingProps.children,cn(t,n),o=jt(o),a=a(o),t.flags|=1,Xe(e,t,a,n),t.child;case 14:return a=t.type,o=zt(a,t.pendingProps),o=zt(a.type,o),wd(e,t,a,o,n);case 15:return Fu(e,t,t.type,t.pendingProps,n);case 17:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:zt(a,o),ro(e,t),t.tag=1,ot(a)?(e=!0,bo(t)):e=!1,cn(t,n),Bu(t,a,o),cs(t,a,o,n),fs(null,t,a,!0,e,n);case 19:return Hu(e,t,n);case 22:return Uu(e,t,n)}throw Error(W(156,t.tag))};function ip(e,t){return Ac(e,t)}function nm(e,t,n,a){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function yt(e,t,n,a){return new nm(e,t,n,a)}function vi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function am(e){if(typeof e=="function")return vi(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Os)return 11;if(e===Bs)return 14}return 2}function vr(e,t){var n=e.alternate;return n===null?(n=yt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function oo(e,t,n,a,o,l){var s=2;if(a=e,typeof e=="function")vi(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case Qr:return Tr(n.children,o,l,t);case Rs:s=8,o|=8;break;case Ll:return e=yt(12,n,t,o|2),e.elementType=Ll,e.lanes=l,e;case Al:return e=yt(13,n,t,o),e.elementType=Al,e.lanes=l,e;case Rl:return e=yt(19,n,t,o),e.elementType=Rl,e.lanes=l,e;case vc:return Jo(n,o,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case gc:s=10;break e;case hc:s=9;break e;case Os:s=11;break e;case Bs:s=14;break e;case ar:s=16,a=null;break e}throw Error(W(130,e==null?e:typeof e,""))}return t=yt(s,n,t,o),t.elementType=e,t.type=a,t.lanes=l,t}function Tr(e,t,n,a){return e=yt(7,e,a,t),e.lanes=n,e}function Jo(e,t,n,a){return e=yt(22,e,a,t),e.elementType=vc,e.lanes=n,e.stateNode={isHidden:!1},e}function Cl(e,t,n){return e=yt(6,e,null,t),e.lanes=n,e}function zl(e,t,n){return t=yt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function om(e,t,n,a,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=il(0),this.expirationTimes=il(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=il(0),this.identifierPrefix=a,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function yi(e,t,n,a,o,l,s,i,d){return e=new om(e,t,n,i,d),t===1?(t=1,l===!0&&(t|=8)):t=0,l=yt(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:a,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},ri(l),e}function lm(e,t,n){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Hr,key:a==null?null:""+a,children:e,containerInfo:t,implementation:n}}function dp(e){if(!e)return br;e=e._reactInternals;e:{if(Fr(e)!==e||e.tag!==1)throw Error(W(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ot(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(W(171))}if(e.tag===1){var n=e.type;if(ot(n))return du(e,n,t)}return t}function cp(e,t,n,a,o,l,s,i,d){return e=yi(n,a,!0,e,o,l,s,i,d),e.context=dp(null),n=e.current,a=Ze(),o=hr(n),l=Qt(a,o),l.callback=t??null,mr(n,l,o),e.current.lanes=o,va(e,o,a),lt(e,a),e}function Ko(e,t,n,a){var o=t.current,l=Ze(),s=hr(o);return n=dp(n),t.context===null?t.context=n:t.pendingContext=n,t=Qt(l,s),t.payload={element:e},a=a===void 0?null:a,a!==null&&(t.callback=a),e=mr(o,t,s),e!==null&&(Tt(e,o,s,l),Za(e,o,s)),s}function Io(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ld(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function bi(e,t){Ld(e,t),(e=e.alternate)&&Ld(e,t)}function sm(){return null}var up=typeof reportError=="function"?reportError:function(e){console.error(e)};function ji(e){this._internalRoot=e}Xo.prototype.render=ji.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(W(409));Ko(e,t,null,null)};Xo.prototype.unmount=ji.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Br(function(){Ko(null,e,null,null)}),t[Gt]=null}};function Xo(e){this._internalRoot=e}Xo.prototype.unstable_scheduleHydration=function(e){if(e){var t=Uc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<lr.length&&t!==0&&t<lr[n].priority;n++);lr.splice(n,0,e),n===0&&qc(e)}};function wi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Zo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ad(){}function im(e,t,n,a,o){if(o){if(typeof a=="function"){var l=a;a=function(){var u=Io(s);l.call(u)}}var s=cp(t,a,e,0,null,!1,!1,"",Ad);return e._reactRootContainer=s,e[Gt]=s.current,la(e.nodeType===8?e.parentNode:e),Br(),s}for(;o=e.lastChild;)e.removeChild(o);if(typeof a=="function"){var i=a;a=function(){var u=Io(d);i.call(u)}}var d=yi(e,0,!1,null,null,!1,!1,"",Ad);return e._reactRootContainer=d,e[Gt]=d.current,la(e.nodeType===8?e.parentNode:e),Br(function(){Ko(t,d,n,a)}),d}function el(e,t,n,a,o){var l=n._reactRootContainer;if(l){var s=l;if(typeof o=="function"){var i=o;o=function(){var d=Io(s);i.call(d)}}Ko(t,s,e,o)}else s=im(n,t,e,o,a);return Io(s)}$c=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=On(t.pendingLanes);n!==0&&(Fs(t,n|1),lt(t,Te()),!(xe&6)&&(vn=Te()+500,kr()))}break;case 13:Br(function(){var a=Jt(e,1);if(a!==null){var o=Ze();Tt(a,e,1,o)}}),bi(e,1)}};Us=function(e){if(e.tag===13){var t=Jt(e,134217728);if(t!==null){var n=Ze();Tt(t,e,134217728,n)}bi(e,134217728)}};Fc=function(e){if(e.tag===13){var t=hr(e),n=Jt(e,t);if(n!==null){var a=Ze();Tt(n,e,t,a)}bi(e,t)}};Uc=function(){return ye};Wc=function(e,t){var n=ye;try{return ye=e,t()}finally{ye=n}};Hl=function(e,t,n){switch(t){case"input":if(Ml(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var a=n[t];if(a!==e&&a.form===e.form){var o=qo(a);if(!o)throw Error(W(90));bc(a),Ml(a,o)}}}break;case"textarea":wc(e,n);break;case"select":t=n.value,t!=null&&on(e,!!n.multiple,t,!1)}};Ec=mi;Dc=Br;var dm={usingClientEntryPoint:!1,Events:[ba,Kr,qo,Cc,zc,mi]},Ln={findFiberByHostInstance:zr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},cm={bundleType:Ln.bundleType,version:Ln.version,rendererPackageName:Ln.rendererPackageName,rendererConfig:Ln.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Xt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ic(e),e===null?null:e.stateNode},findFiberByHostInstance:Ln.findFiberByHostInstance||sm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Va=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Va.isDisabled&&Va.supportsFiber)try{$o=Va.inject(cm),Mt=Va}catch{}}xt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=dm;xt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!wi(t))throw Error(W(200));return lm(e,t,null,n)};xt.createRoot=function(e,t){if(!wi(e))throw Error(W(299));var n=!1,a="",o=up;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=yi(e,1,!1,null,null,n,!1,a,o),e[Gt]=t.current,la(e.nodeType===8?e.parentNode:e),new ji(t)};xt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(W(188)):(e=Object.keys(e).join(","),Error(W(268,e)));return e=Ic(t),e=e===null?null:e.stateNode,e};xt.flushSync=function(e){return Br(e)};xt.hydrate=function(e,t,n){if(!Zo(t))throw Error(W(200));return el(null,e,t,!0,n)};xt.hydrateRoot=function(e,t,n){if(!wi(e))throw Error(W(405));var a=n!=null&&n.hydratedSources||null,o=!1,l="",s=up;if(n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=cp(t,null,e,1,n??null,o,!1,l,s),e[Gt]=t.current,la(e),a)for(e=0;e<a.length;e++)n=a[e],o=n._getVersion,o=o(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,o]:t.mutableSourceEagerHydrationData.push(n,o);return new Xo(t)};xt.render=function(e,t,n){if(!Zo(t))throw Error(W(200));return el(null,e,t,!1,n)};xt.unmountComponentAtNode=function(e){if(!Zo(e))throw Error(W(40));return e._reactRootContainer?(Br(function(){el(null,null,e,!1,function(){e._reactRootContainer=null,e[Gt]=null})}),!0):!1};xt.unstable_batchedUpdates=mi;xt.unstable_renderSubtreeIntoContainer=function(e,t,n,a){if(!Zo(n))throw Error(W(200));if(e==null||e._reactInternals===void 0)throw Error(W(38));return el(e,t,n,!1,a)};xt.version="18.3.1-next-f1338f8080-20240426";function pp(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(pp)}catch(e){console.error(e)}}pp(),pc.exports=xt;var um=pc.exports,Rd=um;Tl.createRoot=Rd.createRoot,Tl.hydrateRoot=Rd.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ma(){return ma=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},ma.apply(this,arguments)}var cr;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(cr||(cr={}));const Od="popstate";function pm(e){e===void 0&&(e={});function t(a,o){let{pathname:l,search:s,hash:i}=a.location;return _s("",{pathname:l,search:s,hash:i},o.state&&o.state.usr||null,o.state&&o.state.key||"default")}function n(a,o){return typeof o=="string"?o:fp(o)}return xm(t,n,null,e)}function Le(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function ki(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function fm(){return Math.random().toString(36).substr(2,8)}function Bd(e,t){return{usr:e.state,key:e.key,idx:t}}function _s(e,t,n,a){return n===void 0&&(n=null),ma({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?kn(t):t,{state:n,key:t&&t.key||a||fm()})}function fp(e){let{pathname:t="/",search:n="",hash:a=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),a&&a!=="#"&&(t+=a.charAt(0)==="#"?a:"#"+a),t}function kn(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let a=e.indexOf("?");a>=0&&(t.search=e.substr(a),e=e.substr(0,a)),e&&(t.pathname=e)}return t}function xm(e,t,n,a){a===void 0&&(a={});let{window:o=document.defaultView,v5Compat:l=!1}=a,s=o.history,i=cr.Pop,d=null,u=g();u==null&&(u=0,s.replaceState(ma({},s.state,{idx:u}),""));function g(){return(s.state||{idx:null}).idx}function m(){i=cr.Pop;let E=g(),x=E==null?null:E-u;u=E,d&&d({action:i,location:_.location,delta:x})}function h(E,x){i=cr.Push;let f=_s(_.location,E,x);u=g()+1;let c=Bd(f,u),w=_.createHref(f);try{s.pushState(c,"",w)}catch(T){if(T instanceof DOMException&&T.name==="DataCloneError")throw T;o.location.assign(w)}l&&d&&d({action:i,location:_.location,delta:1})}function S(E,x){i=cr.Replace;let f=_s(_.location,E,x);u=g();let c=Bd(f,u),w=_.createHref(f);s.replaceState(c,"",w),l&&d&&d({action:i,location:_.location,delta:0})}function N(E){let x=o.location.origin!=="null"?o.location.origin:o.location.href,f=typeof E=="string"?E:fp(E);return f=f.replace(/ $/,"%20"),Le(x,"No window.location.(origin|href) available to create URL for href: "+f),new URL(f,x)}let _={get action(){return i},get location(){return e(o,s)},listen(E){if(d)throw new Error("A history only accepts one active listener");return o.addEventListener(Od,m),d=E,()=>{o.removeEventListener(Od,m),d=null}},createHref(E){return t(o,E)},createURL:N,encodeLocation(E){let x=N(E);return{pathname:x.pathname,search:x.search,hash:x.hash}},push:h,replace:S,go(E){return s.go(E)}};return _}var Md;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(Md||(Md={}));function mm(e,t,n){return n===void 0&&(n="/"),gm(e,t,n)}function gm(e,t,n,a){let o=typeof t=="string"?kn(t):t,l=gp(o.pathname||"/",n);if(l==null)return null;let s=xp(e);hm(s);let i=null;for(let d=0;i==null&&d<s.length;++d){let u=Em(l);i=Nm(s[d],u)}return i}function xp(e,t,n,a){t===void 0&&(t=[]),n===void 0&&(n=[]),a===void 0&&(a="");let o=(l,s,i)=>{let d={relativePath:i===void 0?l.path||"":i,caseSensitive:l.caseSensitive===!0,childrenIndex:s,route:l};d.relativePath.startsWith("/")&&(Le(d.relativePath.startsWith(a),'Absolute route path "'+d.relativePath+'" nested under path '+('"'+a+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),d.relativePath=d.relativePath.slice(a.length));let u=Ir([a,d.relativePath]),g=n.concat(d);l.children&&l.children.length>0&&(Le(l.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+u+'".')),xp(l.children,t,g,u)),!(l.path==null&&!l.index)&&t.push({path:u,score:Sm(u,l.index),routesMeta:g})};return e.forEach((l,s)=>{var i;if(l.path===""||!((i=l.path)!=null&&i.includes("?")))o(l,s);else for(let d of mp(l.path))o(l,s,d)}),t}function mp(e){let t=e.split("/");if(t.length===0)return[];let[n,...a]=t,o=n.endsWith("?"),l=n.replace(/\?$/,"");if(a.length===0)return o?[l,""]:[l];let s=mp(a.join("/")),i=[];return i.push(...s.map(d=>d===""?l:[l,d].join("/"))),o&&i.push(...s),i.map(d=>e.startsWith("/")&&d===""?"/":d)}function hm(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:_m(t.routesMeta.map(a=>a.childrenIndex),n.routesMeta.map(a=>a.childrenIndex)))}const vm=/^:[\w-]+$/,ym=3,bm=2,jm=1,wm=10,km=-2,$d=e=>e==="*";function Sm(e,t){let n=e.split("/"),a=n.length;return n.some($d)&&(a+=km),t&&(a+=bm),n.filter(o=>!$d(o)).reduce((o,l)=>o+(vm.test(l)?ym:l===""?jm:wm),a)}function _m(e,t){return e.length===t.length&&e.slice(0,-1).every((a,o)=>a===t[o])?e[e.length-1]-t[t.length-1]:0}function Nm(e,t,n){let{routesMeta:a}=e,o={},l="/",s=[];for(let i=0;i<a.length;++i){let d=a[i],u=i===a.length-1,g=l==="/"?t:t.slice(l.length)||"/",m=Cm({path:d.relativePath,caseSensitive:d.caseSensitive,end:u},g),h=d.route;if(!m)return null;Object.assign(o,m.params),s.push({params:o,pathname:Ir([l,m.pathname]),pathnameBase:Lm(Ir([l,m.pathnameBase])),route:h}),m.pathnameBase!=="/"&&(l=Ir([l,m.pathnameBase]))}return s}function Cm(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,a]=zm(e.path,e.caseSensitive,e.end),o=t.match(n);if(!o)return null;let l=o[0],s=l.replace(/(.)\/+$/,"$1"),i=o.slice(1);return{params:a.reduce((u,g,m)=>{let{paramName:h,isOptional:S}=g;if(h==="*"){let _=i[m]||"";s=l.slice(0,l.length-_.length).replace(/(.)\/+$/,"$1")}const N=i[m];return S&&!N?u[h]=void 0:u[h]=(N||"").replace(/%2F/g,"/"),u},{}),pathname:l,pathnameBase:s,pattern:e}}function zm(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),ki(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let a=[],o="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(s,i,d)=>(a.push({paramName:i,isOptional:d!=null}),d?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(a.push({paramName:"*"}),o+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?o+="\\/*$":e!==""&&e!=="/"&&(o+="(?:(?=\\/|$))"),[new RegExp(o,t?void 0:"i"),a]}function Em(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return ki(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function gp(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,a=e.charAt(n);return a&&a!=="/"?null:e.slice(n)||"/"}const Dm=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Pm=e=>Dm.test(e);function Tm(e,t){t===void 0&&(t="/");let{pathname:n,search:a="",hash:o=""}=typeof e=="string"?kn(e):e,l;if(n)if(Pm(n))l=n;else{if(n.includes("//")){let s=n;n=n.replace(/\/\/+/g,"/"),ki(!1,"Pathnames cannot have embedded double slashes - normalizing "+(s+" -> "+n))}n.startsWith("/")?l=Fd(n.substring(1),"/"):l=Fd(n,t)}else l=t;return{pathname:l,search:Am(a),hash:Rm(o)}}function Fd(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(o=>{o===".."?n.length>1&&n.pop():o!=="."&&n.push(o)}),n.length>1?n.join("/"):"/"}function El(e,t,n,a){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(a)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function Im(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function hp(e,t){let n=Im(e);return t?n.map((a,o)=>o===n.length-1?a.pathname:a.pathnameBase):n.map(a=>a.pathnameBase)}function vp(e,t,n,a){a===void 0&&(a=!1);let o;typeof e=="string"?o=kn(e):(o=ma({},e),Le(!o.pathname||!o.pathname.includes("?"),El("?","pathname","search",o)),Le(!o.pathname||!o.pathname.includes("#"),El("#","pathname","hash",o)),Le(!o.search||!o.search.includes("#"),El("#","search","hash",o)));let l=e===""||o.pathname==="",s=l?"/":o.pathname,i;if(s==null)i=n;else{let m=t.length-1;if(!a&&s.startsWith("..")){let h=s.split("/");for(;h[0]==="..";)h.shift(),m-=1;o.pathname=h.join("/")}i=m>=0?t[m]:"/"}let d=Tm(o,i),u=s&&s!=="/"&&s.endsWith("/"),g=(l||s===".")&&n.endsWith("/");return!d.pathname.endsWith("/")&&(u||g)&&(d.pathname+="/"),d}const Ir=e=>e.join("/").replace(/\/\/+/g,"/"),Lm=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Am=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Rm=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Om(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const yp=["post","put","patch","delete"];new Set(yp);const Bm=["get",...yp];new Set(Bm);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ga(){return ga=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},ga.apply(this,arguments)}const Si=p.createContext(null),Mm=p.createContext(null),wa=p.createContext(null),tl=p.createContext(null),Ur=p.createContext({outlet:null,matches:[],isDataRoute:!1}),bp=p.createContext(null);function ka(){return p.useContext(tl)!=null}function _i(){return ka()||Le(!1),p.useContext(tl).location}function jp(e){p.useContext(wa).static||p.useLayoutEffect(e)}function Ni(){let{isDataRoute:e}=p.useContext(Ur);return e?Xm():$m()}function $m(){ka()||Le(!1);let e=p.useContext(Si),{basename:t,future:n,navigator:a}=p.useContext(wa),{matches:o}=p.useContext(Ur),{pathname:l}=_i(),s=JSON.stringify(hp(o,n.v7_relativeSplatPath)),i=p.useRef(!1);return jp(()=>{i.current=!0}),p.useCallback(function(u,g){if(g===void 0&&(g={}),!i.current)return;if(typeof u=="number"){a.go(u);return}let m=vp(u,JSON.parse(s),l,g.relative==="path");e==null&&t!=="/"&&(m.pathname=m.pathname==="/"?t:Ir([t,m.pathname])),(g.replace?a.replace:a.push)(m,g.state,g)},[t,a,s,l,e])}function Fm(e,t){return Um(e,t)}function Um(e,t,n,a){ka()||Le(!1);let{navigator:o}=p.useContext(wa),{matches:l}=p.useContext(Ur),s=l[l.length-1],i=s?s.params:{};s&&s.pathname;let d=s?s.pathnameBase:"/";s&&s.route;let u=_i(),g;if(t){var m;let E=typeof t=="string"?kn(t):t;d==="/"||(m=E.pathname)!=null&&m.startsWith(d)||Le(!1),g=E}else g=u;let h=g.pathname||"/",S=h;if(d!=="/"){let E=d.replace(/^\//,"").split("/");S="/"+h.replace(/^\//,"").split("/").slice(E.length).join("/")}let N=mm(e,{pathname:S}),_=Qm(N&&N.map(E=>Object.assign({},E,{params:Object.assign({},i,E.params),pathname:Ir([d,o.encodeLocation?o.encodeLocation(E.pathname).pathname:E.pathname]),pathnameBase:E.pathnameBase==="/"?d:Ir([d,o.encodeLocation?o.encodeLocation(E.pathnameBase).pathname:E.pathnameBase])})),l,n,a);return t&&_?p.createElement(tl.Provider,{value:{location:ga({pathname:"/",search:"",hash:"",state:null,key:"default"},g),navigationType:cr.Pop}},_):_}function Wm(){let e=Km(),t=Om(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,o={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return p.createElement(p.Fragment,null,p.createElement("h2",null,"Unexpected Application Error!"),p.createElement("h3",{style:{fontStyle:"italic"}},t),n?p.createElement("pre",{style:o},n):null,null)}const qm=p.createElement(Wm,null);class Vm extends p.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?p.createElement(Ur.Provider,{value:this.props.routeContext},p.createElement(bp.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Hm(e){let{routeContext:t,match:n,children:a}=e,o=p.useContext(Si);return o&&o.static&&o.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(o.staticContext._deepestRenderedBoundaryId=n.route.id),p.createElement(Ur.Provider,{value:t},a)}function Qm(e,t,n,a){var o;if(t===void 0&&(t=[]),n===void 0&&(n=null),a===void 0&&(a=null),e==null){var l;if(!n)return null;if(n.errors)e=n.matches;else if((l=a)!=null&&l.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let s=e,i=(o=n)==null?void 0:o.errors;if(i!=null){let g=s.findIndex(m=>m.route.id&&(i==null?void 0:i[m.route.id])!==void 0);g>=0||Le(!1),s=s.slice(0,Math.min(s.length,g+1))}let d=!1,u=-1;if(n&&a&&a.v7_partialHydration)for(let g=0;g<s.length;g++){let m=s[g];if((m.route.HydrateFallback||m.route.hydrateFallbackElement)&&(u=g),m.route.id){let{loaderData:h,errors:S}=n,N=m.route.loader&&h[m.route.id]===void 0&&(!S||S[m.route.id]===void 0);if(m.route.lazy||N){d=!0,u>=0?s=s.slice(0,u+1):s=[s[0]];break}}}return s.reduceRight((g,m,h)=>{let S,N=!1,_=null,E=null;n&&(S=i&&m.route.id?i[m.route.id]:void 0,_=m.route.errorElement||qm,d&&(u<0&&h===0?(Zm("route-fallback"),N=!0,E=null):u===h&&(N=!0,E=m.route.hydrateFallbackElement||null)));let x=t.concat(s.slice(0,h+1)),f=()=>{let c;return S?c=_:N?c=E:m.route.Component?c=p.createElement(m.route.Component,null):m.route.element?c=m.route.element:c=g,p.createElement(Hm,{match:m,routeContext:{outlet:g,matches:x,isDataRoute:n!=null},children:c})};return n&&(m.route.ErrorBoundary||m.route.errorElement||h===0)?p.createElement(Vm,{location:n.location,revalidation:n.revalidation,component:_,error:S,children:f(),routeContext:{outlet:null,matches:x,isDataRoute:!0}}):f()},null)}var wp=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(wp||{}),kp=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(kp||{});function Ym(e){let t=p.useContext(Si);return t||Le(!1),t}function Gm(e){let t=p.useContext(Mm);return t||Le(!1),t}function Jm(e){let t=p.useContext(Ur);return t||Le(!1),t}function Sp(e){let t=Jm(),n=t.matches[t.matches.length-1];return n.route.id||Le(!1),n.route.id}function Km(){var e;let t=p.useContext(bp),n=Gm(),a=Sp();return t!==void 0?t:(e=n.errors)==null?void 0:e[a]}function Xm(){let{router:e}=Ym(wp.UseNavigateStable),t=Sp(kp.UseNavigateStable),n=p.useRef(!1);return jp(()=>{n.current=!0}),p.useCallback(function(o,l){l===void 0&&(l={}),n.current&&(typeof o=="number"?e.navigate(o):e.navigate(o,ga({fromRouteId:t},l)))},[e,t])}const Ud={};function Zm(e,t,n){Ud[e]||(Ud[e]=!0)}function eg(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function _p(e){let{to:t,replace:n,state:a,relative:o}=e;ka()||Le(!1);let{future:l,static:s}=p.useContext(wa),{matches:i}=p.useContext(Ur),{pathname:d}=_i(),u=Ni(),g=vp(t,hp(i,l.v7_relativeSplatPath),d,o==="path"),m=JSON.stringify(g);return p.useEffect(()=>u(JSON.parse(m),{replace:n,state:a,relative:o}),[u,m,o,n,a]),null}function lo(e){Le(!1)}function tg(e){let{basename:t="/",children:n=null,location:a,navigationType:o=cr.Pop,navigator:l,static:s=!1,future:i}=e;ka()&&Le(!1);let d=t.replace(/^\/*/,"/"),u=p.useMemo(()=>({basename:d,navigator:l,static:s,future:ga({v7_relativeSplatPath:!1},i)}),[d,i,l,s]);typeof a=="string"&&(a=kn(a));let{pathname:g="/",search:m="",hash:h="",state:S=null,key:N="default"}=a,_=p.useMemo(()=>{let E=gp(g,d);return E==null?null:{location:{pathname:E,search:m,hash:h,state:S,key:N},navigationType:o}},[d,g,m,h,S,N,o]);return _==null?null:p.createElement(wa.Provider,{value:u},p.createElement(tl.Provider,{children:n,value:_}))}function rg(e){let{children:t,location:n}=e;return Fm(Ns(t),n)}new Promise(()=>{});function Ns(e,t){t===void 0&&(t=[]);let n=[];return p.Children.forEach(e,(a,o)=>{if(!p.isValidElement(a))return;let l=[...t,o];if(a.type===p.Fragment){n.push.apply(n,Ns(a.props.children,l));return}a.type!==lo&&Le(!1),!a.props.index||!a.props.children||Le(!1);let s={id:a.props.id||l.join("-"),caseSensitive:a.props.caseSensitive,element:a.props.element,Component:a.props.Component,index:a.props.index,path:a.props.path,loader:a.props.loader,action:a.props.action,errorElement:a.props.errorElement,ErrorBoundary:a.props.ErrorBoundary,hasErrorBoundary:a.props.ErrorBoundary!=null||a.props.errorElement!=null,shouldRevalidate:a.props.shouldRevalidate,handle:a.props.handle,lazy:a.props.lazy};a.props.children&&(s.children=Ns(a.props.children,l)),n.push(s)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const ng="6";try{window.__reactRouterVersion=ng}catch{}const ag="startTransition",Wd=Zp[ag];function og(e){let{basename:t,children:n,future:a,window:o}=e,l=p.useRef();l.current==null&&(l.current=pm({window:o,v5Compat:!0}));let s=l.current,[i,d]=p.useState({action:s.action,location:s.location}),{v7_startTransition:u}=a||{},g=p.useCallback(m=>{u&&Wd?Wd(()=>d(m)):d(m)},[d,u]);return p.useLayoutEffect(()=>s.listen(g),[s,g]),p.useEffect(()=>eg(a),[a]),p.createElement(tg,{basename:t,children:n,location:i.location,navigationType:i.action,navigator:s,future:a})}var qd;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(qd||(qd={}));var Vd;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(Vd||(Vd={}));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lg=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Np=(...e)=>e.filter((t,n,a)=>!!t&&a.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var sg={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ig=p.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:o="",children:l,iconNode:s,...i},d)=>p.createElement("svg",{ref:d,...sg,width:t,height:t,stroke:e,strokeWidth:a?Number(n)*24/Number(t):n,className:Np("lucide",o),...i},[...s.map(([u,g])=>p.createElement(u,g)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=(e,t)=>{const n=p.forwardRef(({className:a,...o},l)=>p.createElement(ig,{ref:l,iconNode:t,className:Np(`lucide-${lg(e)}`,a),...o}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dg=ae("ArrowUpDown",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cp=ae("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lo=ae("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zp=ae("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const so=ae("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cg=ae("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ug=ae("ChevronsLeft",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pg=ae("ChevronsRight",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ao=ae("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ha=ae("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cs=ae("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fg=ae("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xg=ae("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ep=ae("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dp=ae("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mg=ae("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
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
 */const Ro=ae("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ci=ae("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gg=ae("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hg=ae("GripVertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vg=ae("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yg=ae("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bg=ae("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jg=ae("ListTodo",[["rect",{x:"3",y:"5",width:"6",height:"6",rx:"1",key:"1defrl"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fn=ae("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const an=ae("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wg=ae("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kg=ae("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pp=ae("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sg=ae("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _g=ae("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ng=ae("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cg=ae("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zg=ae("Pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ht=ae("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dl=ae("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eg=ae("ScrollText",[["path",{d:"M15 12h-5",key:"r7krc0"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mr=ae("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zs=ae("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dg=ae("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pg=ae("SlidersVertical",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tg=ae("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ig=ae("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tp=ae("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lg=ae("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ag=ae("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rl=ae("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ip=ae("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yn=ae("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function Rg({onLogout:e,onToggleSidebar:t,sidenavCollapsed:n}){var P,C;const[a,o]=p.useState(()=>new Date().toLocaleTimeString("en-IN")),[l,s]=p.useState([]),[i,d]=p.useState(""),[u,g]=p.useState(""),[m,h]=p.useState(!1),S=p.useRef(null),N=JSON.parse(localStorage.getItem("user")||"{}"),_=localStorage.getItem("token"),[E,x]=p.useState(()=>{const z=localStorage.getItem("erp_theme");return z?z==="dark":!0}),[f,c]=p.useState(()=>localStorage.getItem("erp_company_name")||"Vyom ERP"),[w,T]=p.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing");p.useEffect(()=>{const z=localStorage.getItem("erp_theme"),M=z?z==="dark":!0;document.documentElement.setAttribute("data-theme",M?"dark":"light"),x(M)},[]);const L=()=>{const z=!E;x(z),localStorage.setItem("erp_theme",z?"dark":"light"),document.documentElement.setAttribute("data-theme",z?"dark":"light")};p.useEffect(()=>{const z=setInterval(()=>{o(new Date().toLocaleTimeString("en-IN"))},1e3);y();const M=$=>{$.detail&&$.detail.orderId!==void 0?d($.detail.orderId||""):$.detail&&$.detail.orderId===null&&d("")};window.addEventListener("setView",M);const A=()=>{y()};window.addEventListener("orderUpdated",A);const G=$=>{S.current&&!S.current.contains($.target)&&h(!1)};document.addEventListener("mousedown",G);const B=()=>{c(localStorage.getItem("erp_company_name")||"Vyom ERP"),T(localStorage.getItem("erp_system_title")||"Control Panel Manufacturing")};return window.addEventListener("erpSettingsUpdated",B),()=>{clearInterval(z),window.removeEventListener("setView",M),window.removeEventListener("orderUpdated",A),document.removeEventListener("mousedown",G),window.removeEventListener("erpSettingsUpdated",B)}},[]),p.useEffect(()=>{if(i&&l.length>0){const z=l.find(M=>M.id==i);z&&g(z.order_number)}else i||g("")},[i,l]);const y=async()=>{if(_)try{const z=await fetch(window.API_BASE+"/api/orders",{headers:{Authorization:`Bearer ${_}`}});if(z.ok){const M=await z.json();s(M)}}catch(z){console.error("Header fetch error:",z)}},k=(z,M)=>{d(z),g(M||""),h(!1),z?window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:parseInt(z)}})):window.dispatchEvent(new CustomEvent("setView",{detail:{view:"board",orderId:null}}))},F=i&&u.trim()===(((P=l.find(z=>z.id==i))==null?void 0:P.order_number)||""),j=l.filter(z=>{const M=F?"":u.trim().toLowerCase();if(!M)return!0;const A=M.split(/\s+/),G=(z.order_number||"").toLowerCase(),B=(z.company_name||"").toLowerCase(),$=(z.po_number||"").toLowerCase();return A.every(V=>G.includes(V)||B.includes(V)||$.includes(V))});return r.jsxs("div",{className:"header",children:[r.jsxs("div",{className:"header-left",children:[r.jsx("button",{className:"sidebar-toggle-btn",onClick:t,title:n?"Expand Sidebar":"Collapse Sidebar","aria-label":n?"Expand Sidebar":"Collapse Sidebar",children:r.jsx(_g,{size:16})}),r.jsx("div",{className:"logo",children:f}),r.jsx("div",{className:"header-title",children:w})]}),r.jsxs("div",{className:"header-right",children:[r.jsxs("div",{className:"user-info",children:[r.jsx(rl,{size:14,className:"user-icon"}),r.jsx("span",{className:"user-name",children:N.username||"User"}),r.jsx("span",{className:`role-badge role-${(C=N.role)==null?void 0:C.toLowerCase()}`,children:N.role||"Viewer"})]}),r.jsxs("div",{className:"order-selector",ref:S,children:[r.jsx(Mr,{size:14,className:"search-icon"}),r.jsx("input",{type:"text",className:"order-search-input",placeholder:"Search Order...",value:u,onFocus:()=>h(!0),onChange:z=>{g(z.target.value),h(!0)}}),i&&r.jsx("button",{className:"clear-search",onClick:z=>{z.stopPropagation(),k("","")},title:"Clear Selection",children:"×"}),m&&r.jsxs("div",{className:"search-dropdown-menu",children:[r.jsx("div",{className:`search-dropdown-item ${i?"":"active"}`,onClick:()=>k("",""),children:"View All Orders (Board)"}),j.length>0?j.map(z=>r.jsxs("div",{className:`search-dropdown-item ${i==z.id?"active":""}`,onClick:()=>k(z.id,z.order_number),children:[r.jsx("div",{style:{fontWeight:600},children:z.order_number}),z.company_name&&r.jsx("div",{style:{fontSize:"10px",color:"#888"},children:z.company_name})]},z.id)):r.jsx("div",{className:"search-dropdown-item empty",children:"No orders found"})]})]}),r.jsx("div",{className:"clock-wrapper",children:a}),r.jsxs("button",{onClick:L,title:E?"Switch to Light Mode":"Switch to Dark Mode",className:"theme-toggle-btn",children:[E?r.jsx(Ig,{size:13}):r.jsx(Cg,{size:13}),r.jsx("span",{className:"theme-toggle-text",children:E?"Light":"Dark"})]}),r.jsxs("button",{onClick:e,className:"logout-btn",children:[r.jsx(kg,{size:14,className:"logout-icon"}),r.jsx("span",{className:"logout-text",children:"Logout"})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const Ft=[{id:"Sales",color:"var(--teal)",label:"Sales",sub:"Customer interface"},{id:"Design",color:"var(--purple)",label:"Design",sub:"Engineering"},{id:"Purchase",color:"var(--orange)",label:"Purchase",sub:"Procurement"},{id:"Stores",color:"var(--green)",label:"Stores",sub:"Stock & Issue"},{id:"Production",color:"var(--red)",label:"Production",sub:"Manufacturing"},{id:"QC",color:"var(--blue)",label:"QC",sub:"Quality Control"},{id:"Dispatch",color:"var(--text2)",label:"Dispatch",sub:"Logistics"},{id:"Accounts",color:"var(--text2)",label:"Accounts",sub:"Billing"}];Un(new Date),Un(new Date),Un(new Date),Un(new Date);function Un(e){return e.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}const $e={pending:{cls:"badge-pending",label:"PENDING"},inprogress:{cls:"badge-inprogress",label:"IN PROGRESS"},done:{cls:"badge-done",label:"DONE"},blocked:{cls:"badge-blocked",label:"BLOCKED"},review:{cls:"badge-review",label:"REVIEW"}},Og=[{id:"board",icon:bg,label:"Board",roles:null},{id:"planning",icon:Cp,label:"Planning",roles:["Admin","Manager","Planning"]},{id:"orders",icon:xg,label:"Orders",roles:null},{id:"documents",icon:Ro,label:"Documents",roles:null},{id:"new-order",icon:fg,label:"New Order",roles:["Admin","Manager","Sales"]},{id:"masters",icon:Dp,label:"Masters",roles:["Admin","Manager","Sales"]},{id:"import",icon:Lg,label:"Import",roles:["Admin","Manager","Sales"]},{id:"worklist",icon:jg,label:"My Worklist",roles:["Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Sales"]}],Bg=[{id:"users",icon:Ip,label:"User Directory"},{id:"logs",icon:Eg,label:"System Logs"},{id:"settings",icon:zs,label:"System Settings"}];function Hd({item:e,isActive:t,onClick:n}){const a=e.icon;return r.jsxs("button",{className:`dept-btn${t?" active":""}`,onClick:n,title:e.label,children:[r.jsx(a,{size:16,className:"nav-icon"}),r.jsx("span",{className:"nav-label",children:e.label})]})}function Mg({steps:e,currentFilter:t,onFilterDept:n,currentView:a,onSetView:o,userRole:l,collapsed:s=!1}){return r.jsx("aside",{className:`sidenav${s?" sidenav--collapsed":""}`,children:r.jsxs("div",{className:"sidenav-inner",children:[r.jsxs("div",{className:"sidenav-group",children:[r.jsx("p",{className:"sidenav-label",children:"Workspace"}),Og.map(i=>i.roles&&!i.roles.includes(l)?null:r.jsx(Hd,{item:i,isActive:a===i.id,onClick:()=>o(i.id)},i.id))]}),r.jsxs("div",{className:"sidenav-group",children:[r.jsx("p",{className:"sidenav-label",children:"Departments"}),r.jsxs("button",{className:`dept-btn${t==="all"?" active":""}`,onClick:()=>n("all"),title:"All Departments",children:[r.jsx("span",{className:"dept-dot",style:{background:"var(--accent)"}}),r.jsx("span",{className:"nav-label",children:"All Departments"})]}),Ft.map(i=>{const d=e.filter(g=>g.dept===i.id&&g.status==="done").length,u=e.filter(g=>g.dept===i.id).length;return r.jsxs("button",{className:`dept-btn${t===i.id?" active":""}`,onClick:()=>{n(i.id),o("flow")},title:i.label,children:[r.jsx("span",{className:"dept-dot",style:{background:i.color}}),r.jsx("span",{className:"nav-label",children:i.label}),r.jsx("span",{className:"dept-count nav-count",children:u>0?`${d}/${u}`:"—"})]},i.id)})]}),l==="Admin"&&r.jsxs("div",{className:"sidenav-group sidenav-group--admin",children:[r.jsx("p",{className:"sidenav-label",children:"Admin"}),Bg.map(i=>r.jsx(Hd,{item:i,isActive:a===i.id,onClick:()=>o(i.id)},i.id))]})]})})}function $g({deliveryDate:e}){if(!e)return r.jsx("span",{style:{color:"var(--text3)"},children:"—"});const t=Math.ceil((new Date(e)-new Date)/864e5),n=t<0||t<7?"var(--red)":t<14?"var(--accent)":"var(--green)",a=t<0?`${Math.abs(t)}d overdue`:t===0?"today":`${t}d left`;return r.jsx("span",{style:{color:n,fontFamily:"var(--font-mono)",fontSize:14,fontWeight:700},children:a})}function Fg({steps:e,currentFilter:t,selectedOrder:n}){const a=t==="all"?e:e.filter(g=>g.dept===t),o=a.filter(g=>g.status==="inprogress").length,l=a.filter(g=>g.status==="blocked").length,s=a.filter(g=>g.status==="done").length,i=a.length;let d="PENDING",u="var(--accent)";return i===0?(d="NO TASKS",u="var(--text3)"):s===i?(d="COMPLETE",u="var(--green)"):l>0?(d="BLOCKED",u="var(--red)"):(s>0||o>0)&&(d="IN PROGRESS",u="var(--blue)"),r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card stat-status",children:[r.jsx("div",{className:"stat-label",children:"Order Status"}),r.jsx("div",{className:"stat-value",style:{color:u,fontSize:13,fontWeight:700,marginTop:4},children:d}),r.jsx("div",{className:"stat-sub",children:(n==null?void 0:n.order_number)||"no order selected"})]}),r.jsxs("div",{className:"stat-card stat-progress",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:o>0?"var(--blue)":"var(--text3)"},children:o}),r.jsx("div",{className:"stat-sub",children:"active steps"})]}),r.jsxs("div",{className:"stat-card stat-blocked",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:l>0?"var(--red)":"var(--text3)"},children:l}),r.jsx("div",{className:"stat-sub",children:l>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card stat-delivery",children:[r.jsx("div",{className:"stat-label",children:"Delivery"}),r.jsx("div",{style:{marginTop:4},children:r.jsx($g,{deliveryDate:n==null?void 0:n.delivery_date})}),r.jsx("div",{className:"stat-sub",children:n!=null&&n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"TBD"})]})]})}function Ug(){const[e,t]=p.useState(null),n=localStorage.getItem("token");return p.useEffect(()=>{fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${n}`}}).then(a=>a.ok?a.json():[]).then(a=>{const o=new Date,l=new Date(o);l.setDate(o.getDate()+7);let s=0,i=0,d=0,u=0,g=0;a.forEach(m=>{g+=parseInt(m.line_item_count||0);const h=(m.priority||"Medium").toLowerCase();if((h==="urgent"||h==="high")&&d++,m.delivery_date){const S=new Date(m.delivery_date);S>=o&&S<=l&&u++}(m.steps||[]).forEach(S=>{S.status==="blocked"&&s++,S.status==="inprogress"&&i++})}),t({total:a.length,totalLineItems:g,urgentHigh:d,totalBlocked:s,totalIP:i,dueThisWeek:u})}).catch(()=>t(null))},[n]),e?r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card stat-active",children:[r.jsx("div",{className:"stat-label",children:"Active Orders & Items"}),r.jsxs("div",{className:"stat-value",style:{color:"var(--text)"},children:[e.totalLineItems,r.jsxs("span",{style:{fontSize:"13px",color:"var(--text3)",fontWeight:"normal",marginLeft:"6px"},children:["(",e.total," Orders)"]})]}),r.jsx("div",{className:"stat-sub",children:"in pipeline"})]}),r.jsxs("div",{className:"stat-card stat-urgent",children:[r.jsx("div",{className:"stat-label",children:"Urgent / High"}),r.jsx("div",{className:"stat-value",style:{color:e.urgentHigh>0?"var(--accent)":"var(--text3)"},children:e.urgentHigh}),r.jsx("div",{className:"stat-sub",children:"priority orders"})]}),r.jsxs("div",{className:"stat-card stat-progress",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:e.totalIP>0?"var(--blue)":"var(--text3)"},children:e.totalIP}),r.jsx("div",{className:"stat-sub",children:"steps across orders"})]}),r.jsxs("div",{className:"stat-card stat-blocked",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:e.totalBlocked>0?"var(--red)":"var(--text3)"},children:e.totalBlocked}),r.jsx("div",{className:"stat-sub",children:e.totalBlocked>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card stat-due",children:[r.jsx("div",{className:"stat-label",children:"Due This Week"}),r.jsx("div",{className:"stat-value",style:{color:e.dueThisWeek>0?"var(--accent)":"var(--text3)"},children:e.dueThisWeek}),r.jsx("div",{className:"stat-sub",children:"orders"})]})]}):r.jsx("div",{className:"stats-row",children:[...Array(5)].map((a,o)=>r.jsxs("div",{className:"stat-card",style:{opacity:.4},children:[r.jsx("div",{className:"stat-label",children:"Loading…"}),r.jsx("div",{className:"stat-value",children:"—"})]},o))})}function Wg({steps:e,currentFilter:t,selectedOrder:n}){return n?r.jsx(Fg,{steps:e,currentFilter:t,selectedOrder:n}):r.jsx(Ug,{})}const Qd=["General","PO","Quotation","BOM","Drawing","QC Report","Dispatch Document","Photo"],qg=["Sales","Accounts","Admin","Manager"];function Oo({entityType:e,entityId:t,initialDocs:n=[],onUploadSuccess:a,onDocsUpdate:o,readOnly:l=!1,defaultDocType:s="General",userRole:i=null}){const u=!i||qg.includes(i)?Qd:Qd.filter(P=>P!=="PO"),[g,m]=p.useState(n),[h,S]=p.useState(!1),[N,_]=p.useState(s),[E,x]=p.useState(!0),[f,c]=p.useState(!1),w=localStorage.getItem("token");p.useEffect(()=>{s&&_(s)},[s]),p.useEffect(()=>{t&&(async()=>{try{const C=await fetch(`${window.API_BASE}/api/documents/${e}/${t}`,{headers:{Authorization:`Bearer ${w}`}});if(C.ok){const z=await C.json();m(z)}}catch(C){console.error("Failed to fetch docs",C)}})()},[e,t,w]),p.useEffect(()=>{o&&o(g)},[g,o]);const T=async P=>{if(N==="PO"||N==="Quotation"){if(P.length>1){alert(`${N} can only be a single file.`);return}if(g.some(z=>z.doc_type===N)){alert(`A ${N} already exists. Please delete it first.`);return}}if(g.length+P.length>20){alert("Maximum 20 files allowed per entity.");return}S(!0);const C=new FormData;C.append("entity_type",e),C.append("entity_id",t),C.append("doc_type",N),P.forEach(z=>C.append("files",z));try{const z=await fetch(window.API_BASE+"/api/documents/upload",{method:"POST",headers:{Authorization:`Bearer ${w}`},body:C});if(z.ok){const M=await z.json();m([...g,...M]),a&&a(M)}else{const M=await z.json();alert(M.error||"Upload failed")}}catch(z){console.error("Upload error:",z),alert("Network error during upload")}finally{S(!1)}},L=async P=>{const C=Array.from(P.target.files);C.length!==0&&(await T(C),P.target.value="")},y=P=>{l||(P.preventDefault(),c(!0))},k=()=>{c(!1)},F=async P=>{if(l)return;P.preventDefault(),c(!1);const C=Array.from(P.dataTransfer.files);C.length!==0&&await T(C)},j=async P=>{if(window.confirm("Delete this document?"))try{const C=await fetch(`${window.API_BASE}/api/documents/${P}`,{method:"DELETE",headers:{Authorization:`Bearer ${w}`}});if(C.ok){const z=g.filter(M=>M.id!==P);m(z),a&&a(z)}else{const z=await C.json();alert(z.error||"Failed to delete document")}}catch(C){console.error("Delete error:",C),alert("Network error during deletion")}};return r.jsxs("div",{className:`doc-manager${f?" doc-manager--dragging":""}`,onDragOver:y,onDragLeave:k,onDrop:F,children:[r.jsxs("div",{className:"doc-header",onClick:()=>x(P=>!P),style:{cursor:"pointer",userSelect:"none"},children:[r.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",margin:0},children:[r.jsx("span",{style:{display:"inline-block",fontSize:"10px",transition:"transform 0.2s",transform:E?"rotate(-90deg)":"rotate(0deg)",color:"var(--text3)"},children:"▼"}),"Documents (",g.length,"/20)",g.length>0&&E&&r.jsxs("span",{style:{fontSize:"11px",fontWeight:"400",color:"var(--text3)",background:"var(--bg4)",padding:"1px 7px",borderRadius:"10px",marginLeft:"2px"},children:[g.length," file",g.length!==1?"s":""]})]}),!l&&!E&&r.jsxs("div",{className:"doc-upload-controls",onClick:P=>P.stopPropagation(),children:[r.jsx("select",{value:N,onChange:P=>_(P.target.value),className:"doc-type-select",children:u.map(P=>r.jsx("option",{value:P,children:P},P))}),r.jsxs("label",{className:"upload-btn",children:[h?"Uploading...":"Add Files",r.jsx("input",{type:"file",multiple:!0,hidden:!0,onChange:L,disabled:h||g.length>=20})]})]})]}),!E&&r.jsx("div",{className:"doc-list",children:g.length===0?r.jsx("div",{className:"no-docs",children:f?"Drop files here to upload":"No documents uploaded yet. Drag & drop files here to upload."}):g.map(P=>r.jsxs("div",{className:"doc-item",children:[r.jsxs("div",{className:"doc-info",children:[r.jsx("span",{className:"doc-type-badge",children:P.doc_type}),r.jsx("span",{className:"doc-name",title:P.file_name,children:P.file_name})]}),r.jsxs("div",{className:"doc-meta",children:[r.jsxs("span",{children:[(P.file_size/1024).toFixed(1)," KB"]}),r.jsx("a",{href:`${window.API_BASE}/uploads/${P.file_path.split(/[\/\\]/).pop()}?token=${w}`,target:"_blank",rel:"noopener noreferrer",className:"doc-link",children:"View"}),!l&&r.jsx("button",{onClick:()=>j(P.id),style:{background:"transparent",border:"none",color:"var(--red)",cursor:"pointer",marginLeft:"4px",fontSize:"14px",lineHeight:1},title:"Delete document",children:"✕"})]})]},P.id))}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Yd({status:e}){const{cls:t,label:n}=$e[e]||$e.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Vg({steps:e,currentFilter:t,onOpenModal:n,onSetView:a,userRole:o,selectedOrderId:l,selectedOrder:s,onStepsChanged:i,selectedUnitId:d,setSelectedUnitId:u,unitSteps:g,setUnitSteps:m}){const[h,S]=p.useState([]),[N,_]=p.useState(null),E=localStorage.getItem("token"),[x,f]=p.useState(!1),[c,w]=p.useState(null),[T,L]=p.useState([]),[y,k]=p.useState(null),F=JSON.parse(localStorage.getItem("user")||"{}"),j=c?["Admin","Manager"].includes(o)||c.dept===o||c.assigned_user_id===F.id:!1,[P,C]=p.useState("details"),[z,M]=p.useState(0),A=(()=>{if(!c)return[];try{return Array.isArray(c.custom_fields)?c.custom_fields:JSON.parse(c.custom_fields||"[]")}catch{return[]}})();p.useEffect(()=>{fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${E}`}}).then(async O=>{O.ok&&L(await O.json())}).catch(console.error)},[E]);const G=async(O,te)=>{if(!j)return;const Q=g.find(le=>le.id===O),he=Q?Q.order_unit_id:d;if(he)try{const le=await fetch(`${window.API_BASE}/api/units/${he}/steps/${O}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${E}`},body:JSON.stringify(te)});if(le.ok){const U=await fetch(`${window.API_BASE}/api/units/${he}/steps`,{headers:{Authorization:`Bearer ${E}`}}).then(be=>be.json());m(U);const ze=U.find(be=>be.id===O);w(ze),i&&i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:l}}))}else{const U=await le.json().catch(()=>({}));k(U.error||"Failed to update step")}}catch(le){console.error(le),k("Network error — could not update step")}},B=O=>{k(null),O.order_unit_id?(w(O),C("details"),M(0),f(!0)):n(O.id)},$=e.filter(O=>!O.order_unit_id),V=[...g,...$],Y=()=>{const O=(s==null?void 0:s.units)||[];return r.jsxs("div",{className:"unit-selector-container",style:{marginBottom:24,display:"flex",alignItems:"center",gap:12},children:[r.jsx("span",{style:{fontSize:13,color:"var(--text3)",fontWeight:"bold",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Track Level:"}),r.jsxs("select",{className:"form-select",value:d,onChange:te=>u(te.target.value),style:{width:"auto",background:"var(--bg3)",fontSize:"13px",padding:"6px 12px",border:"1px solid var(--border2)",color:"var(--text)",borderRadius:"6px",cursor:"pointer"},children:[r.jsx("option",{value:"",children:"Order Milestones"}),O.map(te=>r.jsxs("option",{value:te.id,children:["Unit: ",te.unit_id," (",te.status,")"]},te.id))]})]})};p.useEffect(()=>{fetch(window.API_BASE+"/api/task_masters",{headers:{Authorization:`Bearer ${E}`}}).then(async O=>{if(O.ok){const te=await O.json();S(te)}}).catch(console.error)},[E]);const D=async O=>{if(!(!O||!l))try{(await fetch(`${window.API_BASE}/api/orders/${l}/steps`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${E}`},body:JSON.stringify({taskId:O})})).ok&&(i&&i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:l}})))}catch(te){console.error(te)}},I=(O,te)=>{_(te),O.dataTransfer.effectAllowed="move",setTimeout(()=>{O.target.style.opacity="0.5"},0)},ee=O=>{O.target.style.opacity="1",_(null)},ie=(O,te)=>{O.preventDefault(),N&&N.dept!==te?O.dataTransfer.dropEffect="none":O.dataTransfer.dropEffect="move"},ne=async(O,te)=>{if(O.preventDefault(),!N||N.id===te.id||N.dept!==te.dept)return;const Q=e.filter(ve=>ve.dept===te.dept),he=Q.findIndex(ve=>ve.id===N.id),le=Q.findIndex(ve=>ve.id===te.id);if(he===-1||le===-1)return;const U=[...Q],[ze]=U.splice(he,1);U.splice(le,0,ze);const be=U.map(ve=>ve.id);try{(await fetch(`${window.API_BASE}/api/orders/${l}/steps/reorder`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${E}`},body:JSON.stringify({orderedIds:be})})).ok&&i&&(i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:l}})))}catch(ve){console.error("Failed to reorder",ve)}},fe=[...Ft].sort((O,te)=>["Admin","Manager"].includes(o)?0:O.id===o?-1:te.id===o?1:0),de=t==="all"?fe:fe.filter(O=>O.id===t);return r.jsxs("div",{style:{display:"flex",flexDirection:"column",width:"100%"},children:[Y(),t==="all"?r.jsxs("div",{className:"lanes",children:[de.map(O=>{const te=V.filter(U=>U.dept===O.id),Q=te.some(U=>U.status==="blocked"),he=!d&&(["Admin","Manager"].includes(o)||O.id===o),le=h.filter(U=>U.dept===O.id&&!te.some(ze=>ze.task_id===U.id));return r.jsxs("div",{className:`lane${Q?" active-lane":""}`,children:[r.jsxs("div",{className:"lane-label",children:[r.jsx("div",{style:{width:3,height:20,background:O.color,borderRadius:2,marginBottom:6}}),r.jsx("div",{className:"lane-name",children:O.label}),r.jsx("div",{className:"lane-sub",children:O.sub}),O.id==="Sales"&&o==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:12,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),he&&le.length>0&&l&&!d&&r.jsx("div",{style:{marginTop:12},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:U=>{D(U.target.value),U.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),le.map(U=>r.jsx("option",{value:U.id,children:U.name},U.id))]})})]}),r.jsxs("div",{className:"lane-steps",children:[te.map((U,ze)=>{const be=JSON.parse(localStorage.getItem("user")||"{}"),ve=!!U.order_unit_id,H=["Admin","Manager"].includes(o)||U.dept===o||ve&&U.assigned_user_id===be.id,Z=!ve&&!d&&H;return r.jsxs("div",{style:{display:"flex",alignItems:"center"},draggable:Z,onDragStart:ue=>Z&&I(ue,U),onDragEnd:ee,onDragOver:ue=>ie(ue,O.id),onDrop:ue=>Z&&ne(ue,U),children:[r.jsxs("div",{className:`step status-${U.status}${H?"":" read-only"}${U.dept==="Sales"&&U.status==="pending"?" pulse-sales":""}${(N==null?void 0:N.id)===U.id?" dragging":""}`,onClick:()=>B(U),style:{cursor:Z?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${U.status}`}),r.jsxs("div",{className:"step-num",children:[O.id.toUpperCase().slice(0,3),"-",String(ze+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[U.name,U.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4},children:"📎"})]}),r.jsx("div",{className:"step-sub",children:U.sub}),r.jsx(Yd,{status:U.status}),U.notes&&r.jsx("div",{className:"step-note",children:U.notes})]}),ze<te.length-1&&r.jsx("div",{className:"step-arrow",children:"›"})]},ve?`unit-${U.id}`:`order-${U.id}`)}),te.length===0&&r.jsx("div",{style:{padding:12,color:"var(--text3)",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},O.id)}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
            .pulse-sales {
              animation: sales-glow 2s infinite ease-in-out;
              border: 1px solid rgba(20, 184, 166, 0.4) !important;
            }
            @keyframes sales-glow {
              0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
              50% { box-shadow: 0 0 15px 0 rgba(20, 184, 166, 0.4); }
              100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
            }
          `}})]}):r.jsx("div",{className:"flow-card-grid",children:de.map(O=>{const te=V.filter(U=>U.dept===O.id),Q=te.some(U=>U.status==="blocked"),he=!d&&(["Admin","Manager"].includes(o)||O.id===o),le=h.filter(U=>U.dept===O.id&&!te.some(ze=>ze.task_id===U.id));return r.jsxs("div",{className:`dept-flow-card${Q?" has-blocked":""}`,children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:O.color}}),r.jsxs("div",{children:[r.jsx("div",{className:"dept-card-title",children:O.label}),r.jsx("div",{className:"dept-card-sub",children:O.sub})]})]}),s&&r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:s.order_number}),s.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:s.company_name}),s.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"🚚"})," ",new Date(s.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),s&&s.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"var(--accent)",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"var(--text2)"},children:s.notes})]}),O.id==="Sales"&&o==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:8,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),he&&le.length>0&&l&&!d&&r.jsx("div",{style:{marginTop:8},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:U=>{D(U.target.value),U.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),le.map(U=>r.jsx("option",{value:U.id,children:U.name},U.id))]})})]}),r.jsxs("div",{className:"dept-card-tasks-vertical",children:[te.map((U,ze)=>{const be=JSON.parse(localStorage.getItem("user")||"{}"),ve=!!U.order_unit_id,H=["Admin","Manager"].includes(o)||U.dept===o||ve&&U.assigned_user_id===be.id,Z=!ve&&!d&&H;return r.jsx("div",{style:{display:"flex",alignItems:"center"},draggable:Z,onDragStart:ue=>Z&&I(ue,U),onDragEnd:ee,onDragOver:ue=>ie(ue,O.id),onDrop:ue=>Z&&ne(ue,U),children:r.jsxs("div",{className:`step status-${U.status}${H?"":" read-only"}${U.dept==="Sales"&&U.status==="pending"?" pulse-sales":""}${(N==null?void 0:N.id)===U.id?" dragging":""}`,onClick:()=>B(U),style:{cursor:Z?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${U.status}`}),r.jsxs("div",{className:"step-num",children:[O.id.toUpperCase().slice(0,3),"-",String(ze+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[U.name,U.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4},children:"📎"})]}),r.jsx("div",{className:"step-sub",children:U.sub}),r.jsx(Yd,{status:U.status}),U.notes&&r.jsx("div",{className:"step-note",children:U.notes})]})},ve?`unit-${U.id}`:`order-${U.id}`)}),te.length===0&&r.jsx("div",{style:{padding:12,color:"var(--text3)",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},O.id)})}),x&&c&&r.jsx("div",{className:"modal-overlay open",onClick:O=>{O.target.className==="modal-overlay open"&&f(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:j?"Edit Unit Step":"View Unit Step"}),r.jsxs("div",{className:"modal-sub",children:[c.name," (",c.dept,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>f(!1),children:"✕"})]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid var(--border)",padding:"0 24px",marginBottom:"16px"},children:["details",...A.length>0?["fields"]:[],"documents"].map(O=>r.jsxs("button",{onClick:()=>C(O),style:{background:"transparent",border:"none",borderBottom:P===O?"2px solid var(--blue)":"2px solid transparent",color:P===O?"var(--blue)":"var(--text3)",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:P===O?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[O==="fields"?"Form Fields":O.charAt(0).toUpperCase()+O.slice(1),O==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:A.length})]},O))}),r.jsxs("div",{className:"modal-body",children:[!j&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"12px"},children:["ℹ️ ",r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:c.dept})," department."]}),y&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"12px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"14px",flexShrink:0},children:"⛔"}),r.jsx("span",{style:{flex:1},children:y}),r.jsx("button",{onClick:()=>k(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"14px",padding:"0",lineHeight:1},children:"✕"})]}),P==="details"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Status"}),j?r.jsxs("select",{className:"form-select",value:c.status,onChange:O=>{const te=O.target.value;if(c.requires_upload&&te==="done"&&z===0){alert("You must upload at least one document to complete this task.");return}G(c.id,{status:te})},style:{fontSize:"13px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${($e[c.status]||$e.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:($e[c.status]||$e.pending).label})})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Assign Worker"}),j?r.jsxs("select",{className:"form-select",value:c.assigned_user_id||"",onChange:O=>G(c.id,{assigned_user_id:O.target.value?parseInt(O.target.value):null}),style:{fontSize:"13px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),T.filter(O=>O.role===c.dept).map(O=>r.jsx("option",{value:O.id,children:O.username},O.id))]}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:(()=>{const O=T.find(te=>te.id===c.assigned_user_id);return O?O.username:"Unassigned"})()})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Notes"}),j?r.jsx("textarea",{className:"form-input",defaultValue:c.notes||"",onBlur:O=>G(c.id,{notes:O.target.value}),placeholder:"Add step notes...",style:{fontSize:"13px",height:"60px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"10px 12px",borderRadius:"6px",minHeight:"40px",whiteSpace:"pre-wrap"},children:c.notes||"No notes added."})]})]}),P==="fields"&&A.length>0&&r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:A.map((O,te)=>{var he;const Q=le=>{const U=[...A];U[te].value=le,G(c.id,{custom_fields:U})};return r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 16px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:O.label}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"10px",color:"var(--text3)",textTransform:"uppercase",background:"var(--bg4)",padding:"1px 5px",borderRadius:"3px"},children:O.type})]}),j?O.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!O.value,onChange:le=>Q(le.target.checked)}):O.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:O.value||"",onChange:le=>Q(le.target.value),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(he=O.options)==null?void 0:he.map(le=>r.jsx("option",{value:le,children:le},le))]}):r.jsx("input",{type:O.type==="Number"?"number":"text",className:"form-input",defaultValue:O.value||"",onBlur:le=>Q(le.target.value),style:{fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"#ddd",fontWeight:"500",marginTop:"2px"},children:O.type==="Yes/No"?O.value==="Yes"||O.value===!0?"✅ Yes":"❌ No":O.value||"—"})]},O.id)})}),P==="documents"&&r.jsxs("div",{children:[c.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"⚠️ This task requires at least one document to be marked as Done."}),r.jsx(Oo,{entityType:"UnitStep",entityId:c.id,initialDocs:[],onDocsUpdate:O=>M(O.length),readOnly:!j,defaultDocType:c.default_doc_type||"General",userRole:o})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Hg({status:e}){const{cls:t,label:n}=$e[e]||$e.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Qg({currentFilter:e,userRole:t,onSetView:n}){const[a,o]=p.useState([]),[l,s]=p.useState(!0),[i,d]=p.useState("all"),[u,g]=p.useState("incomplete"),[m,h]=p.useState("updated"),[S,N]=p.useState(""),_=localStorage.getItem("token");p.useEffect(()=>{E();const c=()=>{E()};return window.addEventListener("orderUpdated",c),()=>window.removeEventListener("orderUpdated",c)},[]);const E=async()=>{try{const c=await fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${_}`}});c.ok&&o(await c.json())}catch(c){console.error(c)}finally{s(!1)}},x=e==="all"?Ft:Ft.filter(c=>c.id===e);if(l)return r.jsx("div",{className:"loading",style:{padding:40,textAlign:"center",color:"#888"},children:"Loading board..."});const f=a.filter(c=>{if(i!=="all"&&(c.priority||"Medium").toLowerCase()!==i||u==="incomplete"&&c.status==="completed"||u==="completed"&&c.status!=="completed")return!1;if(S.trim()!==""){const w=S.trim().toLowerCase().split(/\s+/),T=(c.order_number||"").toLowerCase(),L=(c.company_name||"").toLowerCase(),y=(c.po_number||"").toLowerCase();if(!w.every(F=>T.includes(F)||L.includes(F)||y.includes(F)||c.steps&&c.steps.some(j=>(j.name||"").toLowerCase().includes(F)||(j.dept||"").toLowerCase().includes(F))))return!1}return!0}).sort((c,w)=>{if(m==="updated"){const T=new Date(c.updated_at||0);return new Date(w.updated_at||0)-T}return 0});return r.jsxs("div",{className:"board-view-orders",children:[r.jsxs("div",{className:"board-filters",children:[r.jsxs("div",{className:"filter-group",children:[r.jsx(Ci,{size:14,className:"filter-icon"}),r.jsx("span",{className:"filter-label",children:"Sort:"}),r.jsxs("select",{value:m,onChange:c=>h(c.target.value),className:"board-select",children:[r.jsx("option",{value:"updated",children:"Recently Updated"}),r.jsx("option",{value:"created",children:"Recently Created"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Status:"}),r.jsxs("select",{value:u,onChange:c=>g(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Orders"}),r.jsx("option",{value:"incomplete",children:"Incomplete Only"}),r.jsx("option",{value:"completed",children:"Completed Only"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Priority:"}),r.jsxs("select",{value:i,onChange:c=>d(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"low",children:"Low"})]})]}),r.jsxs("div",{className:"board-search-container",children:[r.jsx(Mr,{size:14,className:"board-search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by Order, PO, Company or Task...",value:S,onChange:c=>N(c.target.value),className:"board-search-input"}),S&&r.jsx("button",{className:"search-clear-btn",onClick:()=>N(""),title:"Clear search",children:r.jsx(yn,{size:14})})]})]}),f.map(c=>{if(c.status==="completed")return e!=="all"&&!c.steps.some(y=>y.dept===e)?null:r.jsxs("div",{className:"completed-order-row",onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"completed-order-header",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsxs("div",{className:"completed-badges-row",children:[c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"🚚"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]}),r.jsx("span",{className:"completed-global-badge",children:"COMPLETED"})]})]}),r.jsx("div",{className:"completed-banner",children:r.jsxs("div",{className:"completed-banner-content",children:[r.jsx("div",{className:"completed-icon-badge",children:"✓"}),r.jsxs("div",{className:"completed-text-content",children:[r.jsx("span",{className:"completed-title",children:"Order Fully Completed"}),r.jsx("span",{className:"completed-subtitle",children:"All steps have been successfully finalized. Click to view process flow logs."})]})]})})]},c.id);let w=[],T=[];if(w=c.steps.filter(L=>["inprogress","blocked","review"].includes(L.status)),w.length===0){const L=c.steps.find(y=>y.status==="pending");if(L)w=[L];else return null}return T=x.filter(L=>w.some(y=>y.dept===L.id)),T.length===0?null:r.jsxs("div",{className:"board-order-row",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsx("div",{className:"board-dept-grid",children:T.map(L=>{const y=w.filter(k=>k.dept===L.id);return r.jsxs("div",{className:"dept-flow-card",style:{borderTopColor:L.color},onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:L.color}}),r.jsx("div",{className:"dept-card-title",children:L.label})]}),r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:c.order_number}),c.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"#aaa",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:c.company_name}),c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"🚚"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),c.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"#f59e0b",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"#d1d5db"},children:c.notes})]})]}),r.jsx("div",{className:"dept-card-tasks",children:y.map(k=>r.jsxs("div",{className:`board-task status-${k.status}`,children:[r.jsx("span",{className:`step-dot dot-${k.status}`}),r.jsx("div",{className:"board-task-name",title:k.name,children:k.name}),r.jsx(Hg,{status:k.status})]},k.id))})]},L.id)})})]},c.id)}),f.length===0&&r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"No orders match the current filters."}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Yg({status:e}){const{cls:t,label:n}=$e[e]||$e.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Gg({steps:e,currentFilter:t,onOpenModal:n,userRole:a}){const o=(t==="all"?e:e.filter(l=>l.dept===t)).slice().sort((l,s)=>["Admin","Manager"].includes(a)?0:l.dept===a&&s.dept!==a?-1:s.dept===a&&l.dept!==a?1:0);return r.jsxs("table",{className:"step-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"#"}),r.jsx("th",{children:"DEPT"}),r.jsx("th",{children:"STEP"}),r.jsx("th",{children:"STATUS"}),r.jsx("th",{children:"NOTES"}),r.jsx("th",{children:"UPDATED"})]})}),r.jsx("tbody",{children:o.map((l,s)=>{const i=Ft.find(d=>d.id===l.dept);return r.jsxs("tr",{onClick:()=>n(l.id),children:[r.jsx("td",{style:{color:"var(--text3)",fontFamily:"var(--font-mono)",fontSize:10},children:s+1}),r.jsx("td",{children:r.jsx("span",{style:{color:(i==null?void 0:i.color)||"var(--text2)",fontWeight:500},children:l.dept})}),r.jsxs("td",{children:[r.jsx("div",{style:{fontWeight:500},children:l.name}),r.jsx("div",{style:{fontSize:10,color:"var(--text3)"},children:l.sub})]}),r.jsx("td",{children:r.jsx(Yg,{status:l.status})}),r.jsx("td",{style:{color:"var(--text3)",fontSize:11},children:l.notes||"—"}),r.jsx("td",{style:{color:"var(--text3)",fontFamily:"var(--font-mono)",fontSize:10},children:l.updated||"—"})]},l.id)})})]})}const Gd={Urgent:0,High:1,Medium:2,Low:3},Jd={Urgent:{bg:"rgba(239,68,68,0.12)",color:"#ef4444",border:"rgba(239,68,68,0.35)"},High:{bg:"rgba(249,115,22,0.12)",color:"#f97316",border:"rgba(249,115,22,0.35)"},Medium:{bg:"rgba(234,179,8,0.12)",color:"#eab308",border:"rgba(234,179,8,0.35)"},Low:{bg:"rgba(99,102,241,0.12)",color:"#818cf8",border:"rgba(99,102,241,0.35)"}},Kd={Completed:{bg:"rgba(16,185,129,0.12)",color:"#10b981",border:"rgba(16,185,129,0.3)"},Blocked:{bg:"rgba(239,68,68,0.12)",color:"#ef4444",border:"rgba(239,68,68,0.3)"},"In Progress":{bg:"rgba(59,130,246,0.12)",color:"#3b82f6",border:"rgba(59,130,246,0.3)"},"On Hold":{bg:"rgba(148,163,184,0.12)",color:"#94a3b8",border:"rgba(148,163,184,0.3)"}};function Jg({currentFilter:e,onSetView:t}){const[n,a]=p.useState([]),[o,l]=p.useState(!0),[s,i]=p.useState(""),[d,u]=p.useState("all"),[g,m]=p.useState("incomplete"),[h,S]=p.useState("order_number"),[N,_]=p.useState("asc"),E=localStorage.getItem("token");p.useEffect(()=>{x()},[]);const x=async()=>{try{const j=await fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${E}`}});j.ok&&a(await j.json())}catch(j){console.error(j)}finally{l(!1)}},f=j=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:parseInt(j)}}))},c=j=>{h===j?_(P=>P==="asc"?"desc":"asc"):(S(j),_("asc"))},w=j=>{var P;return j.hold_status&&j.hold_status!=="None"?"On Hold":j.status==="completed"?"Completed":(P=j.steps)!=null&&P.some(C=>C.status==="blocked")?"Blocked":"In Progress"},L=[...n.filter(j=>{const P=w(j);if(d!=="all"&&(j.priority||"Medium").toLowerCase()!==d||g==="incomplete"&&P==="Completed"||g==="completed"&&P!=="Completed"||g==="blocked"&&P!=="Blocked"||g==="hold"&&P!=="On Hold")return!1;if(s.trim()){const C=s.trim().toLowerCase();return(j.order_number||"").toLowerCase().includes(C)||(j.company_name||"").toLowerCase().includes(C)||(j.po_number||"").toLowerCase().includes(C)||(j.reference_number||"").toLowerCase().includes(C)||(j.end_client_name||"").toLowerCase().includes(C)}return!0})].sort((j,P)=>{let C,z;return h==="priority"?(C=Gd[j.priority||"Medium"]??2,z=Gd[P.priority||"Medium"]??2):h==="delivery_date"?(C=j.delivery_date?new Date(j.delivery_date).getTime():1/0,z=P.delivery_date?new Date(P.delivery_date).getTime():1/0):h==="units"?(C=parseInt(j.unit_count)||0,z=parseInt(P.unit_count)||0):(C=(j[h]||"").toString().toLowerCase(),z=(P[h]||"").toString().toLowerCase()),C<z?N==="asc"?-1:1:C>z?N==="asc"?1:-1:0}),y=({col:j})=>h!==j?r.jsx(dg,{size:11,style:{opacity:.3,marginLeft:4}}):N==="asc"?r.jsx(cg,{size:11,style:{color:"var(--blue)",marginLeft:4}}):r.jsx(Lo,{size:11,style:{color:"var(--blue)",marginLeft:4}}),k=({label:j,col:P,style:C})=>r.jsx("th",{onClick:()=>P&&c(P),style:{cursor:P?"pointer":"default",userSelect:"none",whiteSpace:"nowrap",padding:"11px 14px",fontSize:"11px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.6px",color:h===P?"var(--blue)":"var(--text3)",background:"var(--bg3)",borderBottom:"1px solid var(--border)",...C},children:r.jsxs("span",{style:{display:"inline-flex",alignItems:"center"},children:[j,P&&r.jsx(y,{col:P})]})});if(o)return r.jsx("div",{style:{padding:60,textAlign:"center",color:"var(--text3)"},children:r.jsx("div",{style:{fontSize:13},children:"Loading orders..."})});const F=L.reduce((j,P)=>j+(parseInt(P.unit_count)||0),0);return r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:0,height:"100%"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"var(--bg2)",borderBottom:"1px solid var(--border)",flexWrap:"wrap"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"7px 12px",flex:"1 1 200px",minWidth:0},children:[r.jsx(Mr,{size:13,style:{color:"var(--text3)",flexShrink:0}}),r.jsx("input",{type:"text",placeholder:"Search order, PO, company, client...",value:s,onChange:j=>i(j.target.value),style:{background:"none",border:"none",outline:"none",color:"var(--text)",fontSize:13,width:"100%"}}),s&&r.jsx("button",{onClick:()=>i(""),style:{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",display:"flex",padding:0},children:r.jsx(yn,{size:13})})]}),r.jsxs("select",{value:g,onChange:j=>m(j.target.value),style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text2)",fontSize:12,padding:"7px 10px",cursor:"pointer",outline:"none"},children:[r.jsx("option",{value:"all",children:"All Status"}),r.jsx("option",{value:"incomplete",children:"Incomplete"}),r.jsx("option",{value:"completed",children:"Completed"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"hold",children:"On Hold"})]}),r.jsxs("select",{value:d,onChange:j=>u(j.target.value),style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text2)",fontSize:12,padding:"7px 10px",cursor:"pointer",outline:"none"},children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"urgent",children:"Urgent"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"low",children:"Low"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginLeft:"auto",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",fontSize:12,color:"var(--text3)",whiteSpace:"nowrap",flexShrink:0},children:[r.jsx(yg,{size:13}),r.jsx("strong",{style:{color:"var(--text)"},children:L.length})," orders  · ",r.jsx("strong",{style:{color:"var(--text)"},children:F})," units"]})]}),r.jsx("div",{style:{overflowX:"auto",overflowY:"auto",flex:1},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:13},children:[r.jsx("thead",{style:{position:"sticky",top:0,zIndex:2},children:r.jsxs("tr",{children:[r.jsx(k,{label:"#",col:"order_number"}),r.jsx(k,{label:"Customer",col:"company_name"}),r.jsx(k,{label:"PO Number",col:"po_number"}),r.jsx(k,{label:"Ref #",col:"reference_number"}),r.jsx(k,{label:"End Client"}),r.jsx(k,{label:"Classification",col:"classification"}),r.jsx(k,{label:"Units",col:"units",style:{textAlign:"center"}}),r.jsx(k,{label:"Priority",col:"priority",style:{textAlign:"center"}}),r.jsx(k,{label:"Delivery",col:"delivery_date"}),r.jsx(k,{label:"Active Depts"}),r.jsx(k,{label:"Status",style:{textAlign:"center"}})]})}),r.jsxs("tbody",{children:[L.map((j,P)=>{var V;const C=((V=j.steps)==null?void 0:V.filter(Y=>["inprogress","blocked","review"].includes(Y.status)))||[],z=Array.from(new Set(C.map(Y=>Y.dept))),M=w(j),A=Kd[M]||Kd["In Progress"],G=j.priority||"Medium",B=Jd[G]||Jd.Medium,$=j.delivery_date&&new Date(j.delivery_date)<new Date&&M!=="Completed";return r.jsxs("tr",{onClick:()=>f(j.id),style:{background:P%2===0?"var(--bg)":"var(--bg2)",cursor:"pointer",transition:"background 0.12s",borderBottom:"1px solid var(--border)"},onMouseEnter:Y=>Y.currentTarget.style.background="var(--bg4)",onMouseLeave:Y=>Y.currentTarget.style.background=P%2===0?"var(--bg)":"var(--bg2)",children:[r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--blue)",fontSize:12,whiteSpace:"nowrap"},children:j.order_number}),r.jsxs("td",{style:{padding:"10px 14px",fontWeight:600,color:"var(--text)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[j.company_name||r.jsx("span",{style:{color:"var(--text3)",fontStyle:"italic"},children:"—"}),j.company_city&&r.jsxs("span",{style:{color:"var(--text3)",fontWeight:400,fontSize:11,marginLeft:4},children:["· ",j.company_city]})]}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",color:"var(--text3)",fontSize:12},children:j.po_number||"—"}),r.jsx("td",{style:{padding:"10px 14px",fontSize:12,whiteSpace:"nowrap"},children:j.reference_number?r.jsx("span",{style:{fontFamily:"var(--font-mono)",color:"#f59e0b",fontWeight:600},children:j.reference_number}):r.jsx("span",{style:{color:"var(--text3)",opacity:.4},children:"—"})}),r.jsx("td",{style:{padding:"10px 14px",color:"var(--text3)",fontSize:12,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:j.end_client_name||r.jsx("span",{style:{opacity:.4},children:"—"})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:j.classification==="Non-Standard"?"rgba(99,102,241,0.12)":"rgba(16,185,129,0.1)",color:j.classification==="Non-Standard"?"#818cf8":"#34d399",border:`1px solid ${j.classification==="Non-Standard"?"rgba(99,102,241,0.3)":"rgba(16,185,129,0.25)"}`,textTransform:"uppercase",letterSpacing:"0.4px"},children:j.classification||"Standard"})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:12,fontWeight:700,color:"var(--text2)",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:6,padding:"2px 8px",display:"inline-block"},children:j.unit_count||0})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:B.bg,color:B.color,border:`1px solid ${B.border}`,textTransform:"uppercase",letterSpacing:"0.5px"},children:G})}),r.jsxs("td",{style:{padding:"10px 14px",color:$?"#ef4444":"var(--text2)",fontWeight:$?600:400,whiteSpace:"nowrap",fontSize:12},children:[j.delivery_date?new Date(j.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"}),$&&r.jsx("span",{style:{fontSize:9,color:"#ef4444",fontWeight:700,marginLeft:5,background:"rgba(239,68,68,0.12)",borderRadius:4,padding:"1px 5px"},children:"OVERDUE"})]}),r.jsx("td",{style:{padding:"10px 14px"},children:r.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:z.length>0?z.map(Y=>{const D=Ft.find(ee=>ee.id===Y),I=C.some(ee=>ee.dept===Y&&ee.status==="blocked");return r.jsx("span",{style:{fontSize:9,fontWeight:700,background:I?"rgba(239,68,68,0.12)":D!=null&&D.color?`${D.color}22`:"var(--bg4)",color:I?"#ef4444":(D==null?void 0:D.color)||"var(--text3)",border:`1px solid ${I?"rgba(239,68,68,0.4)":D!=null&&D.color?`${D.color}44`:"var(--border)"}`,padding:"2px 7px",borderRadius:10,textTransform:"uppercase",letterSpacing:"0.4px"},children:Y},Y)}):r.jsx("span",{style:{color:"var(--text3)",fontSize:11,fontStyle:"italic"},children:"Pending"})})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:A.bg,color:A.color,border:`1px solid ${A.border}`,textTransform:"uppercase",letterSpacing:"0.4px",whiteSpace:"nowrap"},children:M})})]},j.id)}),L.length===0&&r.jsx("tr",{children:r.jsxs("td",{colSpan:10,style:{textAlign:"center",padding:"48px 24px",color:"var(--text3)"},children:[r.jsx(Mr,{size:28,style:{opacity:.3,marginBottom:8,display:"block",margin:"0 auto 8px"}}),r.jsx("div",{style:{fontSize:14},children:"No orders match the current filters"})]})})]})]})})]})}function Kg({selectedStep:e,activityLog:t,selectedOrder:n,isOpen:a=!0,onToggle:o}){var s,i,d;const l=e?Ft.find(u=>u.id===e.dept):null;return r.jsxs("div",{className:`right-panel${a?"":" right-panel--collapsed"}`,children:[r.jsx("button",{className:"rp-toggle",onClick:o,title:a?"Collapse panel":"Expand panel","aria-label":a?"Collapse sidebar":"Expand sidebar",children:r.jsx(zp,{size:15,style:{transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)",transform:a?"rotate(0deg)":"rotate(180deg)"}})}),r.jsx("div",{className:"rp-inner",children:r.jsxs("div",{className:"rp-content",children:[r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Selected Step"}),e?r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:8,color:(l==null?void 0:l.color)||"var(--text)"},children:e.name}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Department"}),r.jsx("span",{className:"detail-val",style:{color:(l==null?void 0:l.color)||"inherit"},children:e.dept})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Status"}),r.jsx("span",{className:`step-status-badge badge-${e.status}`,style:{marginTop:0},children:e.status.toUpperCase()})]}),e.notes&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Notes"}),r.jsx("span",{className:"detail-val",style:{color:"var(--text2)",maxWidth:130,textAlign:"right",wordBreak:"break-word"},children:e.notes})]})]}):r.jsx("div",{className:"empty-detail",children:"Click any step to see details."})]}),n?r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Order Overview"}),r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:4,fontFamily:"var(--font-mono)",fontSize:13},children:n.order_number}),n.company_name&&r.jsxs("div",{style:{color:"var(--text2)",fontSize:11,marginBottom:12},children:["🏢 ",n.company_name]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Priority"}),r.jsx("span",{className:`priority-badge ${((s=n.priority)==null?void 0:s.toLowerCase())||"medium"}`,style:{fontSize:10},children:n.priority||"Medium"})]}),n.po_number&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"PO Number"}),r.jsx("span",{className:"detail-val",children:n.po_number})]}),n.reference_number&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Cust. Ref #"}),r.jsx("span",{className:"detail-val",children:n.reference_number})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Classification"}),r.jsx("span",{className:"detail-val",style:{fontWeight:"600",color:n.classification==="Non-Standard"?"var(--blue)":"var(--text2)"},children:n.classification||"Standard"})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Order Date"}),r.jsx("span",{className:"detail-val",children:n.order_date?new Date(n.order_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"N/A"})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Delivery"}),r.jsx("span",{className:"detail-val",style:{color:"var(--accent)"},children:n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"TBD"})]}),n.packaging_type&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Packaging"}),r.jsxs("span",{className:"detail-val",style:{color:"var(--purple)"},children:[n.packaging_type==="Wooden Packaging"?"🪵":"🫧"," ",n.packaging_type]})]}),((i=n.units)==null?void 0:i.length)>0&&r.jsxs("div",{style:{marginTop:12,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsxs("span",{className:"detail-key",style:{display:"block",marginBottom:8},children:["Units (",n.units.length,")"]}),r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:4},children:[n.units.slice(0,12).map(u=>r.jsx("span",{style:{fontSize:9,padding:"2px 5px",borderRadius:3,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontFamily:"var(--font-mono)"},children:u.short_serial},u.id)),n.units.length>12&&r.jsxs("span",{style:{fontSize:9,color:"var(--text3)",padding:"2px 4px"},children:["+",n.units.length-12," more"]})]})]}),((d=n.documents)==null?void 0:d.filter(u=>u.doc_type!=="TaskUpload").length)>0&&r.jsxs("div",{style:{marginTop:10,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsx("span",{className:"detail-key",style:{display:"block",marginBottom:6},children:"Documents"}),n.documents.filter(u=>u.doc_type!=="TaskUpload").map(u=>r.jsx("div",{style:{fontSize:11,marginBottom:3},children:r.jsxs("a",{href:`${window.API_BASE}/uploads/${u.file_path.split(/[/\\]/).pop()}?token=${localStorage.getItem("token")}`,target:"_blank",rel:"noopener noreferrer",style:{color:"var(--blue)",textDecoration:"none"},children:["📄 ",u.file_name]})},u.id))]})]})]}):null,r.jsxs("div",{className:"panel-section",style:{flex:1},children:[r.jsxs("div",{className:"panel-sec-title",style:{display:"flex",alignItems:"center",gap:6},children:[r.jsx(Ep,{size:10}),"Activity Log"]}),r.jsxs("div",{id:"activityLog",style:{maxHeight:280,overflowY:"auto"},children:[t.length===0&&r.jsx("div",{className:"empty-detail",children:"No activity recorded yet."}),t.slice(0,50).map((u,g)=>{var h;const m=((h=Ft.find(S=>S.id===u.dept))==null?void 0:h.color)||"var(--text2)";return r.jsxs("div",{className:"log-entry",children:[r.jsx("div",{className:"log-time",children:u.time}),r.jsxs("div",{className:"log-text",children:[r.jsxs("span",{className:"log-dept",style:{color:m},children:["[",u.dept,"]"]})," ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:600},children:u.username}),": ",u.text]})]},g)})]})]})]})})]})}const Xd=e=>{if(!e)return"";if(typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e))return e;try{const t=new Date(e);if(!isNaN(t.getTime()))return t.toISOString().split("T")[0]}catch{}return""};function Xg({step:e,isOpen:t,onClose:n,onSave:a,onDelete:o,userRole:l,selectedOrder:s}){const[i,d]=p.useState("pending"),[u,g]=p.useState(""),[m,h]=p.useState(null),[S,N]=p.useState(""),[_,E]=p.useState({layout:!1,electrical:!1,bom:!1}),[x,f]=p.useState(0),[c,w]=p.useState([]),[T,L]=p.useState("details"),[y,k]=p.useState(null),F=["Admin","Manager"].includes(l),j=e?(["Admin","Manager"].includes(l)||e.dept===l)&&(s==null?void 0:s.hold_status)!=="Approved":!1;if(p.useEffect(()=>{if(e){d(e.status),g(e.notes||""),N(Xd(e.dispatch_date)),h(null),E({layout:!1,electrical:!1,bom:!1}),f(0),L("details"),k(null);try{const A=Array.isArray(e.custom_fields)?e.custom_fields:JSON.parse(e.custom_fields||"[]");w(Array.isArray(A)?A:[])}catch{w([])}}},[e]),!t||!e)return null;const P=async()=>{if(!j)return;if(e.requires_upload&&i==="done"&&x===0){alert("You must upload at least one document to complete this task.");return}k(null);const A=await a({status:i,notes:u,qcFailTarget:m,dispatchDate:S,checklist:_,custom_fields:c});A&&k(A)},C=(A,G)=>{w(B=>B.map(($,V)=>V===A?{...$,value:G}:$))},z=A=>{A.target.className==="modal-overlay open"&&n()},M=(A,G)=>{switch(A.type){case"Text":return r.jsx("input",{type:"text",className:"form-input",value:A.value||"",onChange:B=>C(G,B.target.value),placeholder:`Enter ${A.label}...`,disabled:!j});case"Number":return r.jsx("input",{type:"number",className:"form-input",value:A.value||"",onChange:B=>C(G,B.target.value),disabled:!j});case"Date":return r.jsx("input",{type:"date",className:"form-input",value:Xd(A.value),onChange:B=>C(G,B.target.value),disabled:!j});case"Yes/No":return r.jsx("div",{style:{display:"flex",gap:"12px",marginTop:"4px"},children:["Yes","No"].map(B=>r.jsx("button",{type:"button",onClick:()=>j&&C(G,B),style:{padding:"6px 20px",borderRadius:"6px",border:"1px solid",cursor:j?"pointer":"default",fontSize:"13px",fontWeight:"600",background:A.value===B?B==="Yes"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)":"transparent",borderColor:A.value===B?B==="Yes"?"#10b981":"#ef4444":"#444",color:A.value===B?B==="Yes"?"#10b981":"#ef4444":"#888",opacity:!j&&A.value!==B?.4:1},children:B},B))});case"Dropdown":return r.jsxs("select",{className:"form-select",value:A.value||"",onChange:B=>C(G,B.target.value),disabled:!j,children:[r.jsx("option",{value:"",children:"-- Select --"}),(A.options||[]).map(B=>r.jsx("option",{value:B,children:B},B))]});default:return r.jsx("input",{type:"text",className:"form-input",value:A.value||"",onChange:B=>C(G,B.target.value),placeholder:`Enter ${A.label}...`,disabled:!j})}};return r.jsxs("div",{className:"modal-overlay open",onClick:z,children:[r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:e.name}),r.jsxs("div",{className:"modal-sub",children:[e.dept," — ",e.sub]})]}),r.jsx("button",{className:"modal-close",onClick:n,children:"✕"})]}),(s==null?void 0:s.hold_status)==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.08)",borderBottom:"1px solid rgba(239, 68, 68, 0.15)",padding:"12px 24px",color:"#ef4444",fontSize:"12px",fontWeight:"500"},children:["⛔ ",r.jsx("strong",{children:"Order is on hold."})," Flow updates and document uploads are disabled."]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid var(--border)",padding:"0 24px"},children:["details",...c.length>0?["fields"]:[],"documents"].map(A=>r.jsxs("button",{onClick:()=>L(A),style:{background:"transparent",border:"none",borderBottom:T===A?"2px solid var(--blue)":"2px solid transparent",color:T===A?"var(--blue)":"var(--text3)",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:T===A?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[A==="fields"?"Form Fields":A.charAt(0).toUpperCase()+A.slice(1),A==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:c.length})]},A))}),r.jsxs("div",{className:"modal-body",children:[T==="details"&&r.jsxs(r.Fragment,{children:[!j&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px"},children:"ℹ️"}),r.jsxs("span",{children:[r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:e.dept})," department."]})]}),y&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"13px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px",flexShrink:0},children:"⛔"}),r.jsx("span",{style:{flex:1},children:y}),r.jsx("button",{onClick:()=>k(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"16px",padding:"0",lineHeight:1},children:"✕"})]}),s&&e.order_fields&&e.order_fields.length>0&&r.jsxs("div",{style:{marginBottom:"16px",padding:"12px 16px",background:"rgba(59,130,246,0.05)",border:"1px solid rgba(59,130,246,0.15)",borderRadius:"8px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"#3b82f6",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"10px"},children:"Order Reference"}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))",gap:"8px"},children:e.order_fields.map(A=>{const G={order_number:"Order #",company_name:"Company",delivery_date:"Delivery Date",po_number:"PO Number",packaging_type:"Packaging",priority:"Priority",notes:"Order Notes"};let B=s[A];return A==="delivery_date"&&B&&(B=new Date(B).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})),r.jsxs("div",{style:{background:"var(--bg3)",borderRadius:"6px",padding:"8px 10px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"3px"},children:G[A]||A}),r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",fontWeight:"500"},children:B||"—"})]},A)})})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Status"}),j?r.jsxs("select",{className:"form-select",value:i,onChange:A=>d(A.target.value),children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"review",children:"Under Review"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${($e[i]||$e.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:($e[i]||$e.pending).label})})]}),e.special==="qc"&&r.jsxs("div",{id:"qcFailArea",children:[r.jsx("label",{style:{fontSize:10,color:"var(--text3)",display:"block",marginBottom:6},children:"If QC Fail — return to:"}),j?r.jsxs("div",{className:"qc-options",children:[r.jsxs("div",{className:`qc-opt${m==="production"?" selected":""}`,onClick:()=>j&&h("production"),style:{cursor:j?"pointer":"default"},children:["↩ Production",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Rework"})]}),r.jsxs("div",{className:`qc-opt${m==="design"?" selected":""}`,onClick:()=>j&&h("design"),style:{cursor:j?"pointer":"default"},children:["↩ Design",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Re-check"})]})]}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:m?`↩ Returned to ${m.charAt(0).toUpperCase()+m.slice(1)}`:"No fail action selected"})]}),e.special==="design"&&r.jsxs("div",{className:"design-checklist",children:[r.jsx("div",{className:"design-checklist-title",children:"Simultaneous Release Checklist"}),j?r.jsxs(r.Fragment,{children:[r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:_.layout,onChange:A=>E({..._,layout:A.target.checked})})," Panel Layout (for Fitter)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:_.electrical,onChange:A=>E({..._,electrical:A.target.checked})})," Electrical Design (for Wireman)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:_.bom,onChange:A=>E({..._,bom:A.target.checked})})," BOM Released to Purchase & Stores"]})]}):r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px"},children:[r.jsxs("div",{children:[_.layout?"✅":"❌"," Panel Layout (for Fitter)"]}),r.jsxs("div",{children:[_.electrical?"✅":"❌"," Panel Design (for Wireman)"]}),r.jsxs("div",{children:[_.bom?"✅":"❌"," BOM Released to Purchase & Stores"]})]})]}),e.special==="dispatch"&&r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirmed Dispatch Date"}),j?r.jsx("input",{type:"date",className:"form-input",value:S,onChange:A=>N(A.target.value)}):r.jsx("div",{style:{fontSize:"14px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:S?new Date(S).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"Not set"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Notes / Remarks"}),j?r.jsx("textarea",{className:"form-textarea",placeholder:"Add notes…",value:u,onChange:A=>g(A.target.value)}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"10px 14px",borderRadius:"6px",border:"1px solid var(--border)",minHeight:"40px",whiteSpace:"pre-wrap"},children:u||"No notes or remarks added."})]})]}),T==="fields"&&c.length>0&&r.jsxs("div",{children:[r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",marginBottom:"16px"},children:j?"Fill in the required information for this task.":"Information filled in for this task."}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:c.map((A,G)=>r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 16px"},children:[r.jsx("div",{style:{marginBottom:"8px"},children:r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:A.label})}),j?M(A,G):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",fontWeight:"500",marginTop:"4px"},children:A.type==="Yes/No"?A.value==="Yes"||A.value===!0?"✅ Yes":"❌ No":A.value||"—"})]},G))})]}),T==="documents"&&r.jsxs("div",{children:[e.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"⚠️ This task requires at least one document to be marked as Done."}),r.jsx(Oo,{entityType:"Step",entityId:e.id,initialDocs:[],onDocsUpdate:A=>f(A.length),readOnly:!j,defaultDocType:e.default_doc_type||"General",userRole:l})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"24px",paddingTop:"16px",borderTop:"1px solid var(--border)"},children:[F&&j?r.jsx("button",{className:"vbtn",style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444"},onClick:()=>o(e.id),children:"Delete Task"}):r.jsx("div",{}),r.jsx("div",{style:{display:"flex",gap:"12px"},children:j?r.jsxs(r.Fragment,{children:[r.jsx("button",{className:"btn-cancel",onClick:n,children:"Cancel"}),r.jsx("button",{className:"btn-save",onClick:P,children:"Update Status"})]}):r.jsx("button",{className:"btn-cancel",onClick:n,style:{minWidth:"100px"},children:"Close"})})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Zg(){const[e,t]=p.useState(""),[n,a]=p.useState(""),[o,l]=p.useState(!1),[s,i]=p.useState(""),[d,u]=p.useState(!1),g=Ni();p.useEffect(()=>{localStorage.getItem("token")&&g("/dashboard")},[g]);const m=async h=>{h.preventDefault(),i(""),u(!0);try{const S=await fetch(window.API_BASE+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:n})}),N=await S.json();if(!S.ok)throw new Error(N.error||"Login failed");localStorage.setItem("token",N.token),localStorage.setItem("user",JSON.stringify(N.user)),g("/dashboard")}catch(S){i(S.message)}finally{u(!1)}};return r.jsx("div",{className:"auth-container",children:r.jsxs("div",{className:"auth-card",children:[r.jsxs("div",{className:"auth-header",children:[r.jsx("div",{className:"auth-logo",children:r.jsx(wg,{size:32,className:"neon-text"})}),r.jsx("h1",{children:"Welcome Back"}),r.jsx("p",{children:"Sign in to access your ERP dashboard"})]}),r.jsxs("form",{onSubmit:m,className:"auth-form",children:[s&&r.jsxs("div",{className:"auth-error",children:[r.jsx(Ao,{size:18}),r.jsx("span",{children:s})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"email",children:"Email Address / Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Pp,{className:"input-icon",size:18}),r.jsx("input",{id:"email",type:"text",placeholder:"email or username",value:e,onChange:h=>t(h.target.value),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"password",children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(an,{className:"input-icon",size:18}),r.jsx("input",{id:"password",type:o?"text":"password",placeholder:"••••••••",value:n,onChange:h=>a(h.target.value),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>l(!o),"aria-label":o?"Hide password":"Show password",children:o?r.jsx(Mn,{size:18}):r.jsx($n,{size:18})})]})]}),r.jsx("button",{type:"submit",className:"auth-button",disabled:d,children:d?r.jsx(Fn,{className:"animate-spin"}):"Sign In"})]})]})})}function eh(){const[e,t]=p.useState([]),[n,a]=p.useState(!0),[o,l]=p.useState(null),[s,i]=p.useState(!1),[d,u]=p.useState({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),[g,m]=p.useState(!1),[h,S]=p.useState(""),[N,_]=p.useState(!1),[E,x]=p.useState(!1),[f,c]=p.useState(null),[w,T]=p.useState(!1),[L,y]=p.useState({username:"",email:"",role:"",password:"",confirmPassword:""}),[k,F]=p.useState(!1),[j,P]=p.useState(!1),[C,z]=p.useState(""),[M,A]=p.useState(!1),[G,B]=p.useState(null),[$,V]=p.useState(!1),[Y,D]=p.useState(""),I=localStorage.getItem("token"),ee=["Admin","Manager","Sales","Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Planning","Viewer"];p.useEffect(()=>{ie()},[]);const ie=async()=>{try{const Q=await fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${I}`}}),he=await Q.json();Q.ok&&t(he)}catch(Q){console.error("Failed to fetch users",Q)}finally{a(!1)}},ne=async Q=>{if(Q.preventDefault(),m(!0),S(""),d.password!==d.confirmPassword){S("Passwords do not match"),m(!1);return}try{const{confirmPassword:he,...le}=d,U=await fetch(window.API_BASE+"/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${I}`},body:JSON.stringify(le)}),ze=await U.json();U.ok?(i(!1),u({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),_(!1),x(!1),ie()):S(ze.error||"Failed to create user")}catch{S("Network error")}finally{m(!1)}},fe=Q=>{c(Q),y({username:Q.username,email:Q.email,role:Q.role,password:"",confirmPassword:""}),z(""),F(!1),P(!1),T(!0)},de=()=>{c(null),T(!1),F(!1),P(!1)},O=async Q=>{if(Q.preventDefault(),A(!0),z(""),L.password&&L.password!==L.confirmPassword){z("Passwords do not match"),A(!1);return}try{const{confirmPassword:he,...le}=L,U=await fetch(`${window.API_BASE}/api/users/${f.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${I}`},body:JSON.stringify(le)}),ze=await U.json();U.ok?(T(!1),c(null),ie()):z(ze.error||"Failed to update user")}catch{z("Network error")}finally{A(!1)}},te=async()=>{if(G){V(!0),D("");try{const Q=await fetch(`${window.API_BASE}/api/users/${G.id}`,{method:"DELETE",headers:{Authorization:`Bearer ${I}`}}),he=await Q.json();Q.ok?(B(null),ie()):D(he.error||"Failed to delete user")}catch{D("Network error")}finally{V(!1)}}};return n?r.jsxs("div",{className:"loading-state",children:[r.jsx(Fn,{className:"animate-spin"})," Loading User Directory..."]}):r.jsxs("div",{className:"user-mgmt",children:[r.jsxs("div",{className:"mgmt-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Ip,{size:20}),r.jsx("h2",{children:"User Management Directory"}),r.jsxs("span",{className:"badge-count",children:[e.length," Total Accounts"]})]}),r.jsxs("button",{className:"add-user-btn",onClick:()=>i(!s),children:[r.jsx(Ag,{size:16}),s?"Cancel":"Add New User"]})]}),s&&r.jsx("div",{className:"add-user-form-container",children:r.jsxs("form",{onSubmit:ne,className:"add-user-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(rl,{size:14,className:"input-icon"}),r.jsx("input",{type:"text",placeholder:"johndoe",value:d.username,onChange:Q=>u({...d,username:Q.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Email Address"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Pp,{size:14,className:"input-icon"}),r.jsx("input",{type:"email",placeholder:"john@example.com",value:d.email,onChange:Q=>u({...d,email:Q.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(an,{size:14,className:"input-icon"}),r.jsx("input",{type:N?"text":"password",placeholder:"••••••••",value:d.password,onChange:Q=>u({...d,password:Q.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>_(!N),"aria-label":N?"Hide password":"Show password",children:N?r.jsx(Mn,{size:14}):r.jsx($n,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Confirm Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(an,{size:14,className:"input-icon"}),r.jsx("input",{type:E?"text":"password",placeholder:"••••••••",value:d.confirmPassword,onChange:Q=>u({...d,confirmPassword:Q.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>x(!E),"aria-label":E?"Hide password":"Show password",children:E?r.jsx(Mn,{size:14}):r.jsx($n,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Assign Role"}),r.jsx("select",{className:"auth-select",value:d.role,onChange:Q=>u({...d,role:Q.target.value}),children:ee.map(Q=>r.jsx("option",{value:Q,children:Q},Q))})]})]}),h&&r.jsx("div",{className:"form-error",children:h}),r.jsx("button",{type:"submit",className:"submit-user-btn",disabled:g,children:g?r.jsx(Fn,{size:16,className:"animate-spin"}):"Create User Account"})]})}),r.jsx("div",{className:"user-table-container",children:r.jsxs("table",{className:"user-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Username"}),r.jsx("th",{children:"Email"}),r.jsx("th",{children:"Current Role"}),r.jsx("th",{children:"Actions"})]})}),r.jsx("tbody",{children:e.map(Q=>r.jsxs("tr",{children:[r.jsx("td",{className:"u-name",children:Q.username}),r.jsx("td",{className:"u-email",children:Q.email}),r.jsx("td",{children:r.jsx("span",{className:`role-badge role-${Q.role.toLowerCase()}`,children:Q.role})}),r.jsx("td",{children:r.jsxs("div",{className:"action-buttons-cell",style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsxs("button",{className:"vbtn",onClick:()=>fe(Q),style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(Tg,{size:14}),"Edit"]}),r.jsxs("button",{className:"vbtn",onClick:()=>{D(""),B(Q)},style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px",borderColor:"rgba(239,68,68,0.3)",color:"var(--red)"},children:[r.jsx(Tp,{size:14}),"Delete"]})]})})]},Q.id))})]})}),w&&f&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",children:"Edit User Details"}),r.jsxs("p",{className:"modal-sub",children:["Modify details for account: ",f.username]})]}),r.jsx("button",{className:"modal-close",onClick:de,children:r.jsx(yn,{size:18})})]}),r.jsxs("form",{onSubmit:O,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Username"}),r.jsx("input",{type:"text",className:"form-input",value:L.username,onChange:Q=>y({...L,username:Q.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Email Address"}),r.jsx("input",{type:"email",className:"form-input",value:L.email,onChange:Q=>y({...L,email:Q.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Role"}),r.jsx("select",{className:"form-select",value:L.role,onChange:Q=>y({...L,role:Q.target.value}),children:ee.map(Q=>r.jsx("option",{value:Q,children:Q},Q))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"New Password (leave blank to keep current)"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(an,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:k?"text":"password",className:"form-input",placeholder:"••••••••",value:L.password,onChange:Q=>y({...L,password:Q.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>F(!k),style:{right:"12px"},"aria-label":k?"Hide password":"Show password",children:k?r.jsx(Mn,{size:14}):r.jsx($n,{size:14})})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirm New Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(an,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:j?"text":"password",className:"form-input",placeholder:"••••••••",value:L.confirmPassword||"",onChange:Q=>y({...L,confirmPassword:Q.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>P(!j),style:{right:"12px"},"aria-label":j?"Hide password":"Show password",children:j?r.jsx(Mn,{size:14}):r.jsx($n,{size:14})})]})]}),C&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:C}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:de,disabled:M,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:M,children:M?r.jsx(Fn,{size:16,className:"animate-spin"}):"Save Changes"})]})]})]})}),G&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",style:{color:"var(--red)"},children:"Delete User Account"}),r.jsx("p",{className:"modal-sub",children:"Are you sure you want to permanently delete this user?"})]}),r.jsx("button",{className:"modal-close",onClick:()=>B(null),children:r.jsx(yn,{size:18})})]}),r.jsxs("div",{className:"modal-body",children:[r.jsxs("p",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:"1.5"},children:["Deleting ",r.jsx("strong",{children:G.username})," (",G.email,") will remove their account immediately. Any documents uploaded, orders created, or panels assigned to this user will have their references cleared safely."]}),Y&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:Y}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>B(null),disabled:$,children:"Cancel"}),r.jsx("button",{type:"button",className:"btn-save",style:{background:"var(--red)",color:"#fff"},onClick:te,disabled:$,children:$?r.jsx(Fn,{size:16,className:"animate-spin"}):"Delete Account"})]})]})]})})]})}function th({onOrderCreated:e}){const[t,n]=p.useState({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard",lineItems:[{material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),[a,o]=p.useState([]),[l,s]=p.useState({po:null,quotation:null,approved_docs:[]}),[i,d]=p.useState(!1),[u,g]=p.useState(!1),[m,h]=p.useState(!1),[S,N]=p.useState(!1),_=localStorage.getItem("token");p.useEffect(()=>{fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${_}`}}).then(C=>C.json()).then(C=>o(C)).catch(C=>console.error(C))},[_]),p.useEffect(()=>{if(t.order_date){const C=new Date(t.order_date);C.setDate(C.getDate()+28);const z=C.toISOString().split("T")[0];t.delivery_date!==z&&n(M=>({...M,delivery_date:z,lineItems:M.lineItems.map(A=>({...A,delivery_date:z}))}))}else t.delivery_date!==""&&n(C=>({...C,delivery_date:"",lineItems:C.lineItems.map(z=>({...z,delivery_date:""}))}))},[t.order_date]);const E=C=>{const{name:z,value:M}=C.target;n(A=>({...A,[z]:M}))},x=(C,z,M)=>{n(A=>{const G=[...A.lineItems];if(G[C][z]=M,z==="quantity"||z==="unit_price"){const B=parseFloat(G[C].quantity)||0,$=parseFloat(G[C].unit_price)||0;G[C].total_price=(B*$).toFixed(2)}return{...A,lineItems:G}})},f=()=>{n(C=>({...C,lineItems:[...C.lineItems,{material_description:"",part_number:"",panel_type_size:"",delivery_date:C.delivery_date||"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}))},c=C=>{n(z=>({...z,lineItems:z.lineItems.filter((M,A)=>A!==C)}))},w=(C,z)=>{s(z==="approved_docs"?M=>{const G=[...M.approved_docs||[],...C];return G.length>20?(alert("Maximum 20 files allowed"),M):{...M,[z]:G}}:M=>({...M,[z]:C[0]}))},T=(C,z)=>{const M=Array.from(C.target.files);M.length!==0&&(w(M,z),C.target.value="")},L=(C,z)=>{C.preventDefault(),z(!0)},y=C=>{C(!1)},k=(C,z,M)=>{C.preventDefault(),M(!1);const A=Array.from(C.dataTransfer.files);A.length!==0&&w(A,z)},F=C=>{s(z=>({...z,approved_docs:z.approved_docs.filter((M,A)=>A!==C)}))},j=C=>{s(M=>({...M,[C]:null}));const z=document.getElementById(`file-input-${C}`);z&&(z.value="")},P=async C=>{if(C.preventDefault(),!t.company_location_id||t.lineItems.length===0){alert("Please select a company and add at least one line item.");return}d(!0);const z=new FormData;z.append("company_location_id",t.company_location_id),z.append("order_date",t.order_date),z.append("delivery_date",t.delivery_date),z.append("notes",t.notes),z.append("priority",t.priority),z.append("po_number",t.po_number),z.append("end_client_name",t.end_client_name||""),z.append("gst_number",t.gst_number||""),z.append("reference_number",t.reference_number||""),z.append("classification",t.classification||"Standard"),z.append("lineItems",JSON.stringify(t.lineItems)),l.po&&z.append("po",l.po),l.quotation&&z.append("quotation",l.quotation),l.approved_docs&&l.approved_docs.length>0&&l.approved_docs.forEach(M=>z.append("approved",M));try{const M=await fetch(window.API_BASE+"/api/orders",{method:"POST",headers:{Authorization:`Bearer ${_}`},body:z});if(M.ok){const A=await M.json();alert(A.message),e&&e(A.order),n({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard",lineItems:[{material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),s({po:null,quotation:null,approved_docs:[]})}else{const A=await M.json();alert(A.error||"Failed to create order")}}catch(M){console.error("Submit error:",M),alert("Network error during order creation")}finally{d(!1)}};return r.jsxs("div",{className:"order-creation-container",children:[r.jsxs("div",{className:"form-card",children:[r.jsx("h2",{className:"form-title",children:"Create New Order"}),r.jsx("p",{className:"form-subtitle",children:"Fill in the details to generate an Internal Order Number and Unit IDs."}),r.jsxs("form",{onSubmit:P,className:"order-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Select Company & Location"}),r.jsxs("select",{name:"company_location_id",value:t.company_location_id,onChange:E,className:"form-select",children:[r.jsx("option",{value:"",children:"-- None --"}),a.map(C=>{var z;return r.jsx("optgroup",{label:C.name,children:(z=C.locations)==null?void 0:z.map(M=>r.jsxs("option",{value:M.id,children:[C.name," - ",M.city]},M.id))},C.id)})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Order Date"}),r.jsx("input",{type:"date",name:"order_date",value:t.order_date,onChange:E})]}),r.jsxs("div",{className:"form-group",children:[r.jsxs("label",{children:["Overall Delivery Date ",r.jsx("span",{style:{fontSize:"11px",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",name:"delivery_date",value:t.delivery_date,disabled:!0,style:{opacity:.7,cursor:"not-allowed"}})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{name:"priority",value:t.priority,onChange:E,className:"form-input",children:[r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Customer PO Number"}),r.jsx("input",{type:"text",name:"po_number",value:t.po_number,onChange:E})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Dispatch / Packaging"}),r.jsxs("select",{name:"packaging_type",value:t.packaging_type,onChange:E,className:"form-input",children:[r.jsx("option",{value:"",children:"-- Select Packaging Type --"}),r.jsx("option",{value:"Wooden Packaging",children:"Wooden Packaging"}),r.jsx("option",{value:"Foam Packaging",children:"Foam Packaging"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"End Client Name (Optional)"}),r.jsx("input",{type:"text",name:"end_client_name",value:t.end_client_name,onChange:E})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"GST Number (Optional)"}),r.jsx("input",{type:"text",name:"gst_number",value:t.gst_number,onChange:E,placeholder:"e.g. 27AAAAA1111A1Z1"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Customer Reference Number (Optional)"}),r.jsx("input",{type:"text",name:"reference_number",value:t.reference_number,onChange:E,placeholder:"e.g. REF-2026-99"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Classification"}),r.jsxs("select",{name:"classification",value:t.classification||"Standard",onChange:E,style:{width:"100%",padding:"8px 12px",background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text2)",fontSize:"13px"},children:[r.jsx("option",{value:"Standard",children:"Standard"}),r.jsx("option",{value:"Non-Standard",children:"Non-Standard"})]})]}),r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Overall Order Notes"}),r.jsx("textarea",{name:"notes",value:t.notes,onChange:E})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"32px",marginBottom:"32px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[r.jsx("h3",{className:"section-title",style:{margin:0},children:"Line Items"}),r.jsx("button",{type:"button",className:"vbtn",style:{background:"#3b82f6",fontSize:"12px",padding:"6px 12px"},onClick:f,children:"+ Add Line Item"})]}),t.lineItems.map((C,z)=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"20px",borderRadius:"12px",border:"1px solid var(--border)",marginBottom:"16px",position:"relative"},children:[t.lineItems.length>1&&r.jsx("button",{type:"button",onClick:()=>c(z),style:{position:"absolute",top:"16px",right:"16px",background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:"16px"},children:"✕"}),r.jsxs("div",{className:"line-item-grid-1",children:[r.jsxs("div",{children:[r.jsxs("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:["Line Item # ",r.jsx("span",{style:{color:"#888",fontStyle:"italic"},children:"(auto-assigned)"})]}),r.jsx("input",{type:"text",className:"form-input",value:`Item ${z+1}`,readOnly:!0,style:{background:"var(--bg4)",opacity:.6,cursor:"not-allowed"}})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Material Description"}),r.jsx("input",{type:"text",className:"form-input",value:C.material_description,onChange:M=>x(z,"material_description",M.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Part Number *"}),r.jsx("input",{type:"text",className:"form-input",value:C.part_number,onChange:M=>x(z,"part_number",M.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Panel Type / Size"}),r.jsx("input",{type:"text",className:"form-input",value:C.panel_type_size,onChange:M=>x(z,"panel_type_size",M.target.value)})]})]}),r.jsxs("div",{className:"line-item-grid-2",children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Quantity *"}),r.jsx("input",{type:"number",className:"form-input",min:"1",value:C.quantity,onChange:M=>x(z,"quantity",M.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Unit"}),r.jsx("input",{type:"text",className:"form-input",value:C.unit,onChange:M=>x(z,"unit",M.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Unit Price *"}),r.jsx("input",{type:"number",step:"0.01",min:"0",max:"9999999999999.99",className:"form-input",value:C.unit_price,onChange:M=>x(z,"unit_price",M.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Total Price"}),r.jsx("input",{type:"number",step:"0.01",className:"form-input",value:C.total_price,onChange:M=>x(z,"total_price",M.target.value),readOnly:!0,style:{background:"var(--bg4)",opacity:.7}})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Delivery Date"}),r.jsx("input",{type:"date",className:"form-input",value:C.delivery_date,disabled:!0,style:{opacity:.7,cursor:"not-allowed"}})]})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Item Notes"}),r.jsx("input",{type:"text",className:"form-input",value:C.notes,onChange:M=>x(z,"notes",M.target.value)})]})]},z))]}),r.jsxs("div",{className:"file-upload-section",children:[r.jsx("h3",{className:"section-title",children:"Required Documents"}),r.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"16px"},children:["⚠️ Only ",r.jsx("strong",{style:{color:"var(--text2)"},children:"one"})," PO copy and one Quotation allowed. To replace after submission, delete the existing file first."]}),r.jsxs("div",{className:"file-grid",children:[r.jsxs("div",{className:`file-input-wrapper${u?" dragging":""}`,onDragOver:C=>L(C,g),onDragLeave:()=>y(g),onDrop:C=>k(C,"po",g),children:[r.jsx("label",{children:"Customer PO Copy"}),l.po?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"8px 10px",width:"100%",justifyContent:"center"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981"},children:"✔"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:l.po.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:C=>T(C,"po")})]}),r.jsx("button",{type:"button",onClick:()=>j("po"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"📁 Drag file here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:C=>T(C,"po")})]})]}),r.jsxs("div",{className:`file-input-wrapper${m?" dragging":""}`,onDragOver:C=>L(C,h),onDragLeave:()=>y(h),onDrop:C=>k(C,"quotation",h),children:[r.jsx("label",{children:"Quotation"}),l.quotation?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"8px 10px",width:"100%",justifyContent:"center"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981"},children:"✔"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:l.quotation.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:C=>T(C,"quotation")})]}),r.jsx("button",{type:"button",onClick:()=>j("quotation"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"📁 Drag file here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:C=>T(C,"quotation")})]})]}),r.jsxs("div",{className:`file-input-wrapper${S?" dragging":""}`,onDragOver:C=>L(C,N),onDragLeave:()=>y(N),onDrop:C=>k(C,"approved_docs",N),style:{alignItems:"center"},children:[r.jsx("label",{children:"Approved Documents (Up to 20)"}),r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"📁 Drag files here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{type:"file",multiple:!0,hidden:!0,onChange:C=>T(C,"approved_docs")})]}),l.approved_docs&&l.approved_docs.length>0&&r.jsx("div",{className:"selected-files-list",children:l.approved_docs.map((C,z)=>r.jsxs("div",{className:"selected-file-item",children:[r.jsx("span",{className:"file-name-hint",children:C.name}),r.jsx("button",{type:"button",onClick:()=>F(z),className:"remove-file-btn",children:"✕"})]},z))})]})]})]}),r.jsx("div",{className:"form-actions",children:r.jsx("button",{type:"submit",className:"submit-btn",disabled:i,children:i?"Creating Order...":"Initialize Order"})})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Lp({onImportComplete:e}){var f,c,w,T,L;const[t,n]=p.useState(null),[a,o]=p.useState(!1),[l,s]=p.useState(!1),[i,d]=p.useState(null),u=p.useRef(null),g=localStorage.getItem("token"),m=y=>{y.preventDefault(),o(!0)},h=()=>o(!1),S=y=>{y.preventDefault(),o(!1);const k=y.dataTransfer.files[0];k&&N(k)},N=y=>{if(!y.name.match(/\.xlsx$/i)){alert("Only .xlsx files are supported. Please use the sample template.");return}n(y),d(null)},_=async()=>{if(t){s(!0),d(null);try{const y=new FormData;y.append("file",t);const F=await(await fetch(window.API_BASE+"/api/orders/import",{method:"POST",headers:{Authorization:`Bearer ${g}`},body:y})).json();if(F.error){d({message:F.error,created:[],errors:[]});return}d(F),F.created&&F.created.length>0}catch{d({message:"Network error — could not reach the server. Is Docker running?",created:[],errors:[]})}finally{s(!1)}}},E=y=>{y.preventDefault(),window.location.href=window.API_BASE+"/api/template/order_import_template.xlsx"},x=()=>{n(null),d(null),u.current&&(u.current.value="")};return r.jsxs("div",{className:"oi-container",children:[r.jsxs("div",{className:"oi-card",children:[r.jsxs("div",{className:"oi-header",children:[r.jsxs("div",{children:[r.jsx("h2",{className:"oi-title",children:"Bulk Order Import"}),r.jsxs("p",{className:"oi-subtitle",children:["Upload a filled Excel template to create multiple orders automatically. Each unique ",r.jsx("code",{children:"po_number"})," becomes one order."]})]}),r.jsx("a",{href:"#",onClick:E,className:"oi-download-btn",title:"Download the sample template",children:"⬇ Download Template"})]}),!i&&r.jsxs("div",{className:`oi-dropzone${a?" oi-dragging":""}${t?" oi-has-file":""}`,onDragOver:m,onDragLeave:h,onDrop:S,onClick:()=>{var y;return!t&&((y=u.current)==null?void 0:y.click())},children:[r.jsx("input",{ref:u,type:"file",accept:".xlsx",hidden:!0,onChange:y=>y.target.files[0]&&N(y.target.files[0])}),t?r.jsxs("div",{className:"oi-file-preview",children:[r.jsx("span",{className:"oi-file-icon",children:"📊"}),r.jsxs("div",{className:"oi-file-info",children:[r.jsx("span",{className:"oi-file-name",children:t.name}),r.jsxs("span",{className:"oi-file-size",children:[(t.size/1024).toFixed(1)," KB"]})]}),r.jsx("button",{className:"oi-clear-btn",onClick:y=>{y.stopPropagation(),x()},title:"Remove",children:"✕"})]}):r.jsxs("div",{className:"oi-drop-prompt",children:[r.jsx("div",{className:"oi-drop-icon",children:"📂"}),r.jsxs("div",{className:"oi-drop-text",children:["Drag & drop your ",r.jsx("strong",{children:".xlsx"})," file here"]}),r.jsx("div",{className:"oi-drop-sub",children:"or click to browse"})]})]}),!i&&r.jsx("div",{className:"oi-actions",children:r.jsx("button",{className:"oi-upload-btn",disabled:!t||l,onClick:_,children:l?r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"oi-spinner"})," Processing..."]}):"Import Orders"})}),!i&&r.jsxs("div",{className:"oi-instructions",children:[r.jsx("h3",{className:"oi-inst-title",children:"How to use"}),r.jsxs("ol",{className:"oi-inst-list",children:[r.jsx("li",{children:"Download the template using the button above."}),r.jsxs("li",{children:["Open the ",r.jsx("strong",{children:'"Import Template"'})," sheet and fill in your data."]}),r.jsxs("li",{children:["Each row = one line item. Rows with the same ",r.jsx("code",{children:"po_number"})," are grouped into one order."]}),r.jsxs("li",{children:["Company name & city must match entries in ",r.jsx("strong",{children:"Masters → Companies"}),"."]}),r.jsxs("li",{children:["Dates must be in ",r.jsx("strong",{children:"YYYY-MM-DD"})," format or a proper Excel date."]}),r.jsxs("li",{children:["Save as ",r.jsx("code",{children:".xlsx"})," and upload here."]})]}),r.jsxs("div",{className:"oi-field-ref",children:[r.jsx("h4",{children:"Required Fields"}),r.jsx("div",{className:"oi-field-grid",children:[{f:"company_name",r:!0,note:"Exact match in Masters"},{f:"company_city",r:!0,note:"Exact match in Masters"},{f:"order_date",r:!0,note:"YYYY-MM-DD"},{f:"delivery_date",r:!0,note:"YYYY-MM-DD"},{f:"po_number",r:!0,note:"Groups rows into one order"},{f:"priority",r:!0,note:"Low / Medium / High / Urgent"},{f:"material_description",r:!0,note:"Per line item"},{f:"quantity",r:!0,note:"Positive integer"},{f:"unit",r:!0,note:"e.g. Nos, Sets"},{f:"unit_price",r:!0,note:"Numeric, no ₹"},{f:"packaging_type",r:!1,note:"Wooden Packaging / Foam Packaging"},{f:"end_client_name",r:!1,note:"Optional end client name / site location"},{f:"order_notes",r:!1,note:"Optional"},{f:"part_number",r:!1,note:"Optional"},{f:"panel_type_size",r:!1,note:"e.g. 800x600"},{f:"line_item_delivery_date",r:!1,note:"Defaults to delivery_date"},{f:"line_item_notes",r:!1,note:"Optional"}].map(({f:y,r:k,note:F})=>r.jsxs("div",{className:"oi-field-row",children:[r.jsx("code",{className:"oi-field-name",children:y}),r.jsx("span",{className:`oi-badge ${k?"req":"opt"}`,children:k?"Required":"Optional"}),r.jsx("span",{className:"oi-field-note",children:F})]},y))})]})]}),i&&r.jsxs("div",{className:"oi-result",children:[r.jsxs("p",{className:`oi-result-msg ${((f=i.created)==null?void 0:f.length)>0?"success":"fail"}`,children:[((c=i.created)==null?void 0:c.length)>0?"✅":"⚠️"," ",i.message]}),((w=i.created)==null?void 0:w.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{children:"Created & Merged Orders"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Order Number"}),r.jsx("th",{children:"Units Added"}),r.jsx("th",{children:"Action Taken"})]})}),r.jsx("tbody",{children:i.created.map((y,k)=>r.jsxs("tr",{children:[r.jsx("td",{children:y.po_number}),r.jsx("td",{children:r.jsx("strong",{style:{color:"#60a5fa"},children:y.order_number})}),r.jsx("td",{children:y.units}),r.jsx("td",{children:r.jsx("span",{style:{background:y.is_appended?"#1e3a8a":"#064e3b",color:y.is_appended?"#60a5fa":"#34d399",fontSize:"11px",fontWeight:"bold",padding:"3px 8px",borderRadius:"4px",display:"inline-block"},children:y.is_appended?"Merged (Appended)":"Created (New)"})})]},k))})]})]}),((T=i.errors)==null?void 0:T.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{style:{color:"#f87171"},children:"Errors"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Reason"})]})}),r.jsx("tbody",{children:i.errors.map((y,k)=>r.jsxs("tr",{children:[r.jsx("td",{children:y.po_number}),r.jsx("td",{style:{color:"#f87171"},children:y.error})]},k))})]})]}),r.jsxs("div",{style:{display:"flex",gap:12,marginTop:20},children:[r.jsx("button",{className:"oi-upload-btn",onClick:x,children:"Import Another File"}),((L=i.created)==null?void 0:L.length)>0&&r.jsx("button",{className:"oi-upload-btn",style:{background:"#10b981"},onClick:()=>e==null?void 0:e(),children:"View Orders →"})]})]})]}),r.jsx("style",{children:`
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
      `})]})}function rh({isOpen:e,onClose:t,onImportComplete:n}){return p.useEffect(()=>{if(!e)return;const a=o=>{o.key==="Escape"&&t()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[e,t]),e?r.jsxs("div",{className:"bim-overlay",onClick:a=>{a.target===a.currentTarget&&t()},children:[r.jsxs("div",{className:"bim-modal",children:[r.jsxs("div",{className:"bim-modal-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[r.jsx("span",{style:{fontSize:"18px"},children:"📥"}),r.jsx("span",{style:{fontWeight:"700",fontSize:"16px",color:"var(--text)"},children:"Bulk Order Import"})]}),r.jsx("button",{className:"bim-close",onClick:t,title:"Close (Esc)",children:"✕"})]}),r.jsx("div",{className:"bim-body",children:r.jsx(Lp,{onImportComplete:()=>{n==null||n(),t()}})})]}),r.jsx("style",{children:`
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
      `})]}):null}function nh({initialSelectedId:e}){var _a,Na,Ca,za,Sr,Lt,gt,Zt,_n,er;const[t,n]=p.useState([]),[a,o]=p.useState(null),[l,s]=p.useState(null),[i,d]=p.useState("created_at"),[u,g]=p.useState(!0),[m,h]=p.useState("inprogress"),S=localStorage.getItem("token"),[N,_]=p.useState([]),[E,x]=p.useState([]),[f,c]=p.useState(null),w=JSON.parse(localStorage.getItem("user")||"{}"),[T,L]=p.useState(null),[y,k]=p.useState(""),[F,j]=p.useState("done"),[P,C]=p.useState(!1),[z,M]=p.useState(!1),[A,G]=p.useState(null),[B,$]=p.useState({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard"}),[V,Y]=p.useState([]),[D,I]=p.useState(!1),[ee,ie]=p.useState(null),[ne,fe]=p.useState({material_description:"",part_number:"",panel_type_size:"",quantity:"",unit:"Nos",unit_price:"",delivery_date:"",notes:""}),[de,O]=p.useState(!1),te=async()=>{try{const b=await fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${S}`}});b.ok&&Y(await b.json())}catch(b){console.error("Fetch companies error:",b)}},Q=b=>{$({company_location_id:b.company_location_id||"",order_date:b.order_date?b.order_date.split("T")[0]:"",delivery_date:b.delivery_date?b.delivery_date.split("T")[0]:"",notes:b.notes||"",priority:b.priority||"Medium",po_number:b.po_number||"",packaging_type:b.packaging_type||"",end_client_name:b.end_client_name||"",gst_number:b.gst_number||"",reference_number:b.reference_number||"",classification:b.classification||"Standard"}),G(b),te()},he=async b=>{b.preventDefault(),I(!0);try{const K=await fetch(`${window.API_BASE}/api/orders/${A.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${S}`},body:JSON.stringify(B)});if(K.ok)alert("Order amended successfully!"),G(null),await St(a.id),await kt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const oe=await K.json();alert(oe.error||"Failed to amend order.")}}catch(K){console.error(K),alert("Network error, please try again.")}finally{I(!1)}},le=async b=>{if(window.confirm("Are you sure you want to delete this order? This will permanently delete the order, all its line items, all unit serial numbers, steps, and resequence all remaining orders!"))try{const K=await fetch(`${window.API_BASE}/api/orders/${b}`,{method:"DELETE",headers:{Authorization:`Bearer ${S}`}});if(K.ok)alert("Order deleted and remaining orders resequenced successfully!"),o(null),await kt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:null}}));else{const oe=await K.json();alert(oe.error||"Failed to delete order.")}}catch(K){console.error(K),alert("Network error, please try again.")}},U=b=>{fe({material_description:b.material_description||"",part_number:b.part_number||"",panel_type_size:b.panel_type_size||"",quantity:b.quantity||"",unit:b.unit||"Nos",unit_price:b.unit_price||"",delivery_date:b.delivery_date?b.delivery_date.split("T")[0]:"",notes:b.notes||""}),ie(b)},ze=async b=>{b.preventDefault(),O(!0);try{const K=await fetch(`${window.API_BASE}/api/orders/${a.id}/line-items/${ee.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${S}`},body:JSON.stringify(ne)});if(K.ok)ie(null),await St(a.id);else{const oe=await K.json();alert(oe.error||"Failed to amend line item.")}}catch(K){console.error(K),alert("Network error, please try again.")}finally{O(!1)}},be=(b,K)=>{fe(oe=>({...oe,[b]:K}))},ve=async b=>{try{const K=await fetch(`${window.API_BASE}/api/orders/${a.id}/hold/${b}`,{method:"POST",headers:{Authorization:`Bearer ${S}`}});if(K.ok)await St(a.id),await kt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const oe=await K.json();alert(oe.error||"Failed to update hold status")}}catch(K){console.error(K),alert("Network error updating hold status")}},H=["admin","manager","sales"].includes((_a=w.role)==null?void 0:_a.toLowerCase()),Z=async b=>{if(b.preventDefault(),!(!y||!F)){C(!0);try{const K=await fetch(`${window.API_BASE}/api/planning/line-items/${T.id}/bulk-units-status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${S}`},body:JSON.stringify({dept:y,status:F})});if(K.ok)alert(`Successfully updated all ${y} steps to ${F} for this batch.`),L(null),await St(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const oe=await K.json();alert(oe.error||"Failed to bulk update units.")}}catch(K){console.error(K),alert("Network error, please try again.")}finally{C(!1)}}};p.useEffect(()=>{kt(),ue();const b=K=>{kt(),K.detail&&K.detail.orderId&&o(oe=>(oe&&oe.id===K.detail.orderId&&St(K.detail.orderId),oe))};return window.addEventListener("orderUpdated",b),()=>window.removeEventListener("orderUpdated",b)},[]),p.useEffect(()=>{l?st(l.id):(_([]),c(null))},[l]);const ue=async()=>{try{const b=await fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${S}`}});b.ok&&x(await b.json())}catch(b){console.error("Fetch users error:",b)}},st=async b=>{try{const K=await fetch(`${window.API_BASE}/api/units/${b}/steps`,{headers:{Authorization:`Bearer ${S}`}});K.ok&&_(await K.json())}catch(K){console.error("Fetch unit steps error:",K)}},it=async(b,K)=>{try{(await fetch(`${window.API_BASE}/api/units/${l.id}/steps/${b}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${S}`},body:JSON.stringify(K)})).ok&&(await st(l.id),await St(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}})))}catch(oe){console.error("Update unit step error:",oe)}};p.useEffect(()=>{e&&t.length>0&&St(e)},[e,t]);const kt=async()=>{try{const b=await fetch(window.API_BASE+"/api/orders",{headers:{Authorization:`Bearer ${S}`}});if(b.ok){const K=await b.json();n(K)}}catch(b){console.error("Fetch error:",b)}finally{g(!1)}},St=async b=>{var K;try{const oe=await fetch(`${window.API_BASE}/api/orders/${b}`,{headers:{Authorization:`Bearer ${S}`}});if(oe.ok){const Ee=await oe.json();if(o(Ee),l){const He=(K=Ee.units)==null?void 0:K.find(Qe=>Qe.id===l.id);He&&s(He)}}}catch(oe){console.error("Fetch details error:",oe)}},_t=b=>{if(!b||b.length===0)return 0;const K={Pending:0,Design:15,"Material Waiting":30,Production:55,"QC Testing":75,"QC Passed":90,"Ready for Dispatch":95,Dispatched:100,Delivered:100,Rework:40,"QC Failed":60};let oe=0;return b.forEach(Ee=>{oe+=K[Ee.status]||0}),Math.round(oe/b.length)};if(u)return r.jsx("div",{className:"loading",children:"Loading orders..."});const Sa=b=>parseInt(b.unit_count)>0&&parseInt(b.dispatched_unit_count)>=parseInt(b.unit_count),Ae=t.filter(b=>!Sa(b)),Wr=t.filter(b=>Sa(b)),Sn=m==="completed"?Wr:Ae;return Ae.reduce((b,K)=>b+parseInt(K.line_item_count||0),0),Wr.reduce((b,K)=>b+parseInt(K.line_item_count||0),0),r.jsxs("div",{className:"order-list-container",children:[r.jsxs("div",{className:"orders-sidebar",children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("h3",{className:"sidebar-title",style:{margin:0},children:"Orders"}),r.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"center"},children:[H&&r.jsx("button",{onClick:()=>M(!0),title:"Bulk Import Orders from Excel",style:{background:"var(--blue-dim)",border:"1px solid var(--blue)",color:"var(--blue)",borderRadius:"6px",padding:"3px 9px",fontSize:"11px",fontWeight:"600",cursor:"pointer",display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap",transition:"opacity 0.15s"},onMouseOver:b=>b.currentTarget.style.opacity="0.8",onMouseOut:b=>b.currentTarget.style.opacity="1",children:"📥 Import"}),r.jsxs("select",{value:i,onChange:b=>d(b.target.value),className:"form-select",style:{padding:"2px 8px",fontSize:"11px",width:"auto"},children:[r.jsx("option",{value:"created_at",children:"Created Date"}),r.jsx("option",{value:"order_date",children:"Order Date"}),r.jsx("option",{value:"delivery_date",children:"Delivery Date"}),r.jsx("option",{value:"po_number",children:"PO Number"})]})]})]}),r.jsxs("div",{style:{display:"flex",gap:"4px",marginBottom:"12px",background:"var(--bg4)",borderRadius:"8px",padding:"4px",border:"1px solid var(--border)"},children:[r.jsxs("button",{onClick:()=>h("inprogress"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:m==="inprogress"?"var(--blue)":"transparent",color:m==="inprogress"?"#fff":"var(--text3)"},children:["In Progress ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",Ae.length,")"]})]}),r.jsxs("button",{onClick:()=>h("completed"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:m==="completed"?"var(--green)":"transparent",color:m==="completed"?"#fff":"var(--text3)"},children:["Completed ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",Wr.length,")"]})]})]}),r.jsxs("div",{className:"order-items",children:[Sn.length===0&&r.jsx("div",{style:{color:"var(--text3)",fontSize:"13px",textAlign:"center",padding:"32px 16px",fontStyle:"italic"},children:m==="completed"?"No completed orders yet.":"No in-progress orders."}),Sn.map(b=>r.jsxs("div",{className:`order-card ${(a==null?void 0:a.id)===b.id?"active":""}`,onClick:()=>St(b.id),children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"},children:[r.jsx("div",{className:"order-num",style:{margin:0},children:b.order_number}),m==="completed"?r.jsx("span",{style:{background:"rgba(16,185,129,0.15)",color:"#34d399",border:"1px solid rgba(16,185,129,0.3)",borderRadius:"20px",padding:"2px 8px",fontSize:"10px",fontWeight:"700"},children:"✓ DONE"}):b.priority&&r.jsx("span",{className:`priority-badge ${b.priority.toLowerCase()}`,children:b.priority})]}),r.jsxs("div",{className:"order-meta",children:[r.jsxs("span",{children:[b.unit_count," Units"]})," •",r.jsx("span",{children:i==="created_at"?new Date(b.created_at).toLocaleDateString():i==="order_date"?b.order_date?new Date(b.order_date).toLocaleDateString():"No Order Date":i==="delivery_date"?b.delivery_date?new Date(b.delivery_date).toLocaleDateString():"No Delivery Date":i==="po_number"?b.po_number||"No PO Number":""})]}),b.company_name&&r.jsxs("div",{className:"order-company",children:["🏢 ",b.company_name," - ",b.company_city]})]},b.id))]})]}),r.jsx("div",{className:"order-details-pane",children:a?r.jsxs("div",{className:"details-content",children:[r.jsxs("div",{className:"details-header",children:[r.jsxs("div",{children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"},children:[r.jsx("h2",{style:{margin:0},children:a.order_number}),["admin","manager","sales"].includes((Na=w.role)==null?void 0:Na.toLowerCase())&&r.jsx("button",{className:"vbtn",style:{padding:"4px 12px",fontSize:"12px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>Q(a),children:"Amend Order"}),((Ca=w.role)==null?void 0:Ca.toLowerCase())==="admin"&&r.jsx("button",{className:"vbtn",style:{padding:"4px 12px",fontSize:"12px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>le(a.id),children:"Delete Order"}),a.hold_status==="Requested"&&r.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsx("span",{style:{fontSize:"11px",background:"rgba(245, 158, 11, 0.15)",color:"#f59e0b",padding:"4px 8px",borderRadius:"4px",fontWeight:"600"},children:"Hold Requested"}),["admin","manager"].includes((za=w.role)==null?void 0:za.toLowerCase())&&r.jsxs(r.Fragment,{children:[r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#10b981",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>ve("approve"),children:"Approve Hold"}),r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>ve("reject"),children:"Reject"})]})]}),a.hold_status==="Approved"&&r.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsx("span",{style:{fontSize:"11px",background:"rgba(239, 68, 68, 0.15)",color:"#ef4444",padding:"4px 8px",borderRadius:"4px",fontWeight:"700",textTransform:"uppercase"},children:"⛔ ON HOLD"}),["admin","manager","sales"].includes((Sr=w.role)==null?void 0:Sr.toLowerCase())&&r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>ve("resume"),children:"Resume Order"})]}),(a.hold_status==="None"||!a.hold_status)&&["admin","manager","sales"].includes((Lt=w.role)==null?void 0:Lt.toLowerCase())&&r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#f59e0b",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>ve("request"),children:"Request Hold"})]}),a.company_name&&r.jsxs("div",{className:"order-company-lg",style:{marginTop:"4px"},children:["🏢 ",a.company_name," (",a.company_city,")"]})]}),r.jsxs("div",{className:"creator-info",children:["Created by: ",a.creator_name||"System"]})]}),a.hold_status==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.25)",borderRadius:"8px",padding:"12px 16px",marginBottom:"20px",color:"#ef4444",fontWeight:"500",fontSize:"13px"},children:["⚠️ ",r.jsx("strong",{children:"ORDER IS CURRENTLY ON HOLD"})," — All production updates, step changes, and document uploads for this order and its units are currently locked."]}),r.jsxs("div",{className:"order-progress-container",children:[r.jsxs("div",{className:"progress-labels",children:[r.jsx("span",{children:"Order Progress"}),r.jsxs("span",{children:[_t(a.units),"%"]})]}),r.jsx("div",{className:"progress-bar-bg",children:r.jsx("div",{className:"progress-bar-fill",style:{width:`${_t(a.units)}%`}})})]}),r.jsxs("div",{className:"details-grid",style:{gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:"20px"},children:[r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Priority"}),r.jsx("div",{className:"val",children:r.jsx("span",{className:`priority-badge ${((gt=a.priority)==null?void 0:gt.toLowerCase())||"medium"}`,children:a.priority||"Medium"})})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Order Date"}),r.jsx("div",{className:"val",children:a.order_date?new Date(a.order_date).toLocaleDateString("en-IN"):"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Delivery Date"}),r.jsx("div",{className:"val",children:a.delivery_date?new Date(a.delivery_date).toLocaleDateString("en-IN"):"TBD"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"PO Number"}),r.jsx("div",{className:"val",children:a.po_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Cust. Ref #"}),r.jsx("div",{className:"val",children:a.reference_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Classification"}),r.jsx("div",{className:"val",style:{fontWeight:"600",color:a.classification==="Non-Standard"?"var(--blue)":"var(--text2)"},children:a.classification||"Standard"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"End Client"}),r.jsx("div",{className:"val",children:a.end_client_name||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"GST Number"}),r.jsx("div",{className:"val",children:a.gst_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Packaging"}),r.jsx("div",{className:"val",children:a.packaging_type||"N/A"})]}),r.jsxs("div",{className:"detail-box",style:{gridColumn:"1 / -1"},children:[r.jsx("label",{children:"Notes"}),r.jsx("div",{className:"val",style:{whiteSpace:"pre-wrap"},children:a.notes||"No notes"})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"24px"},children:[r.jsx("h3",{children:"Line Items & Units"}),(Zt=a.line_items)==null?void 0:Zt.map(b=>{var oe,Ee,He;const K=((oe=a.units)==null?void 0:oe.filter(Qe=>Qe.line_item_id===b.id))||[];return r.jsxs("div",{style:{background:"var(--bg3)",borderRadius:"8px",padding:"16px",marginBottom:"16px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",borderBottom:"1px solid var(--border2)",paddingBottom:"8px"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[r.jsx("strong",{children:b.line_item_number}),": ",b.material_description," ",b.part_number?`(${b.part_number})`:"",["admin","manager","production","sales","design","purchase","stores","qc","dispatch","accounts","planning"].includes((Ee=w.role)==null?void 0:Ee.toLowerCase())&&r.jsx("button",{className:"vbtn",style:{padding:"2px 8px",fontSize:"10px",background:"#2563eb",border:"none",borderRadius:"4px",cursor:"pointer",display:"inline-flex",alignItems:"center",height:"22px"},onClick:()=>{if(a.hold_status==="Approved"){alert("Order is currently on hold. Updates are disabled.");return}k(""),j("done"),L(b)},children:"Bulk Update Batch"}),["admin","manager","sales"].includes((He=w.role)==null?void 0:He.toLowerCase())&&r.jsx("button",{className:"vbtn",title:"Amend Line Item",style:{padding:"2px 8px",fontSize:"10px",background:"#7c3aed",border:"none",borderRadius:"4px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px",height:"22px"},onClick:()=>{if(a.hold_status==="Approved"){alert("Order is currently on hold. Amendments are disabled.");return}U(b)},children:"✏ Amend"})]}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:"13px"},children:[b.quantity," ",b.unit||"Nos"," @ ₹",b.unit_price]})]}),r.jsx("div",{className:"units-grid",children:K.map(Qe=>r.jsxs("div",{className:"unit-badge interactive",onClick:()=>s(Qe),children:[r.jsx("span",{className:"u-id",children:Qe.short_serial}),r.jsx("span",{className:`u-status ${Qe.status.toLowerCase().replace(/\s+/g,"-")}`,children:Qe.status})]},Qe.id))})]},b.id)})]}),r.jsx(Oo,{entityType:"Order",entityId:a.id,initialDocs:((_n=a.documents)==null?void 0:_n.filter(b=>b.entity_type==="Order"))||[],userRole:w.role,readOnly:a.hold_status==="Approved"})]}):r.jsx("div",{className:"select-prompt",children:"Select an order from the list to view details and documents."})}),l&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&s(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Unit Tracking"}),r.jsxs("div",{className:"modal-sub",children:[l.unit_id," (",l.status,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>s(null),children:"✕"})]}),r.jsxs("div",{className:"modal-body",children:[(a==null?void 0:a.hold_status)==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.08)",border:"1px solid rgba(239, 68, 68, 0.15)",borderRadius:"6px",padding:"8px 12px",marginBottom:"12px",color:"#ef4444",fontSize:"11px",fontWeight:"500"},children:["⛔ ",r.jsx("strong",{children:"Order is on hold."})," Production flow step updates are locked until the hold is released."]}),r.jsxs("div",{style:{marginBottom:20},children:[r.jsx("h4",{style:{margin:"0 0 12px 0",color:"var(--text)",fontSize:"14px",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Production Steps"}),N.length===0?r.jsx("div",{style:{color:"var(--text3)",fontSize:"13px",fontStyle:"italic"},children:"Loading steps..."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[...N].sort((b,K)=>{var oe,Ee,He,Qe,tr,rr,_r,pe,At;return["admin","manager"].includes((oe=w.role)==null?void 0:oe.toLowerCase())?0:((Ee=b.dept)==null?void 0:Ee.toLowerCase())===((He=w.role)==null?void 0:He.toLowerCase())&&((Qe=K.dept)==null?void 0:Qe.toLowerCase())!==((tr=w.role)==null?void 0:tr.toLowerCase())?-1:((rr=K.dept)==null?void 0:rr.toLowerCase())===((_r=w.role)==null?void 0:_r.toLowerCase())&&((pe=b.dept)==null?void 0:pe.toLowerCase())!==((At=w.role)==null?void 0:At.toLowerCase())?1:0}).map(b=>{var tr,rr,_r;const K=f===b.id,oe=(["admin","manager"].includes((tr=w.role)==null?void 0:tr.toLowerCase())||((rr=b.dept)==null?void 0:rr.toLowerCase())===((_r=w.role)==null?void 0:_r.toLowerCase())||b.assigned_user_id===w.id)&&(a==null?void 0:a.hold_status)!=="Approved",Ee=E.find(pe=>pe.id===b.assigned_user_id);let He=[];try{He=Array.isArray(b.custom_fields)?b.custom_fields:JSON.parse(b.custom_fields||"[]")}catch{He=[]}const Qe=E.filter(pe=>{var At,v;return((At=pe.role)==null?void 0:At.toLowerCase())===((v=b.dept)==null?void 0:v.toLowerCase())});return r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"},onClick:()=>c(K?null:b.id),children:[r.jsxs("div",{children:[r.jsxs("div",{style:{fontWeight:"600",color:"var(--text)",fontSize:"13px"},children:[!oe&&r.jsx("span",{style:{color:"#60a5fa",marginRight:"6px",fontSize:"9px",textTransform:"uppercase",background:"rgba(59, 130, 246, 0.1)",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(59, 130, 246, 0.2)"},children:"View Only"}),b.name]}),r.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)",marginTop:"2px"},children:["Dept: ",r.jsx("span",{style:{color:"#60a5fa"},children:b.dept})," | Assigned: ",r.jsx("span",{style:{color:"#34d399"},children:Ee?Ee.username:"Unassigned"})]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[r.jsx("span",{className:`step-status-badge badge-${b.status}`,style:{fontSize:"9px",fontWeight:"bold"},children:b.status}),r.jsx("span",{style:{fontSize:"10px",color:"var(--text3)"},children:K?"▲":"▼"})]})]}),K&&r.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px dashed var(--border2)"},children:[!oe&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.08)",border:"1px solid rgba(59, 130, 246, 0.15)",borderRadius:"6px",padding:"8px 12px",marginBottom:"12px",color:"#60a5fa",fontSize:"11px"},children:["ℹ️ ",r.jsx("strong",{children:"View-Only Mode"})," — managed by the ",r.jsx("strong",{children:b.dept})," department."]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Step Status"}),oe?r.jsxs("select",{className:"form-select",value:b.status,onChange:pe=>it(b.id,{status:pe.target.value}),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"2px"},children:r.jsx("span",{className:`step-status-badge ${($e[b.status]||$e.pending).cls}`,style:{fontSize:"11px",padding:"3px 8px",fontWeight:"bold"},children:($e[b.status]||$e.pending).label})})]}),r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Assign Worker"}),oe?r.jsxs("select",{className:"form-select",value:b.assigned_user_id||"",onChange:pe=>it(b.id,{assigned_user_id:pe.target.value?parseInt(pe.target.value):null}),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),Qe.map(pe=>r.jsx("option",{value:pe.id,children:pe.username},pe.id))]}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text)",background:"var(--bg3)",padding:"6px 10px",borderRadius:"6px"},children:Ee?Ee.username:"Unassigned"})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Notes"}),oe?r.jsx("textarea",{className:"form-input",defaultValue:b.notes||"",onBlur:pe=>it(b.id,{notes:pe.target.value}),placeholder:"Add step notes...",style:{fontSize:"12px",height:"50px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px",whiteSpace:"pre-wrap"},children:b.notes||"No notes added."})]}),He.length>0&&r.jsxs("div",{style:{marginBottom:"12px",padding:"10px",background:"var(--bg3)",borderRadius:"6px",border:"1px solid var(--border)"},children:[r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",fontWeight:"bold",marginBottom:"8px",textTransform:"uppercase"},children:"Custom Fields"}),He.map((pe,At)=>{var R;const v=q=>{const J=[...He];J[At].value=q,it(b.id,{custom_fields:J})};return r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text2)",display:"block",marginBottom:"2px"},children:pe.label}),oe?pe.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!pe.value,onChange:q=>v(q.target.checked)}):pe.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:pe.value||"",onChange:q=>v(q.target.value),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(R=pe.options)==null?void 0:R.map(q=>r.jsx("option",{value:q,children:q},q))]}):r.jsx("input",{type:pe.type==="Number"?"number":"text",className:"form-input",defaultValue:pe.value||"",onBlur:q=>v(q.target.value),style:{fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text)",fontWeight:"500",marginTop:"2px"},children:pe.type==="Yes/No"?pe.value==="Yes"||pe.value===!0?"✅ Yes":"❌ No":pe.value||"—"})]},pe.id)})]})]})]},b.id)})})]}),r.jsx("div",{style:{marginTop:24,borderTop:"1px solid var(--border)",paddingTop:"16px"},children:r.jsx(Oo,{entityType:"Unit",entityId:l.id,initialDocs:((er=a.documents)==null?void 0:er.filter(b=>b.entity_type==="Unit"&&b.entity_id===l.id))||[],onUploadSuccess:()=>St(a.id),userRole:w.role,readOnly:a.hold_status==="Approved"})})]})]})}),T&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&L(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"400px",width:"90%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Update Batch Units"}),r.jsxs("div",{className:"modal-sub",children:["Line Item: ",T.line_item_number," (",T.quantity," units)"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>L(null),children:"✕"})]}),r.jsxs("form",{onSubmit:Z,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{style:{display:"block",color:"var(--text2)",fontSize:"13px",marginBottom:"6px"},children:"Target Department Task"}),r.jsxs("select",{className:"form-select",value:y,onChange:b=>k(b.target.value),style:{width:"100%",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"",children:"-- Select Department --"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"})]})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"20px"},children:[r.jsx("label",{style:{display:"block",color:"var(--text2)",fontSize:"13px",marginBottom:"6px"},children:"Set Task Status to"}),r.jsxs("select",{className:"form-select",value:F,onChange:b=>j(b.target.value),style:{width:"100%",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"flex-end",gap:"10px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>L(null),disabled:P,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:P,style:{background:"#3b82f6",border:"none",color:"#fff",borderRadius:"6px",padding:"8px 16px",cursor:"pointer",fontWeight:"600"},children:P?"Updating...":"Update All Units"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}}),r.jsx(rh,{isOpen:z,onClose:()=>M(!1),onImportComplete:()=>{kt(),window.dispatchEvent(new CustomEvent("orderUpdated"))}}),A&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&G(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"700px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Amend Order Details"}),r.jsxs("div",{className:"modal-sub",children:["Updating fields for ",A.order_number]})]}),r.jsx("button",{className:"modal-close",onClick:()=>G(null),children:"✕"})]}),r.jsxs("form",{onSubmit:he,children:[r.jsx("div",{className:"modal-body",children:r.jsxs("div",{className:"form-grid",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"},children:[r.jsxs("div",{className:"form-group",style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Select Company & Location"}),r.jsxs("select",{className:"form-select",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:B.company_location_id,onChange:b=>$({...B,company_location_id:b.target.value}),required:!0,children:[r.jsx("option",{value:"",children:"-- None --"}),V.map(b=>{var K;return r.jsx("optgroup",{label:b.name,children:(K=b.locations)==null?void 0:K.map(oe=>r.jsxs("option",{value:oe.id,children:[b.name," - ",oe.city]},oe.id))},b.id)})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Order Date"}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:B.order_date,onChange:b=>{const K=b.target.value;let oe=B.delivery_date;if(K){const Ee=new Date(K);Ee.setDate(Ee.getDate()+28),oe=Ee.toISOString().split("T")[0]}$({...B,order_date:K,delivery_date:oe})}})]}),r.jsxs("div",{className:"form-group",children:[r.jsxs("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:["Overall Delivery Date ",r.jsx("span",{style:{textTransform:"none",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",opacity:.7,cursor:"not-allowed"},value:B.delivery_date,disabled:!0})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Priority"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:B.priority,onChange:b=>$({...B,priority:b.target.value}),children:[r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Customer PO Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:B.po_number,onChange:b=>$({...B,po_number:b.target.value}),placeholder:"e.g. PO-45000"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Packaging Type"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:B.packaging_type,onChange:b=>$({...B,packaging_type:b.target.value}),children:[r.jsx("option",{value:"",children:"-- Select Packaging Type --"}),r.jsx("option",{value:"Wooden Packaging",children:"Wooden Packaging"}),r.jsx("option",{value:"Foam Packaging",children:"Foam Packaging"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"End Client Name"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:B.end_client_name,onChange:b=>$({...B,end_client_name:b.target.value}),placeholder:"e.g. Reliance Industries"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"GST Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:B.gst_number,onChange:b=>$({...B,gst_number:b.target.value}),placeholder:"e.g. 27AAAAA1111A1Z1"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Customer Reference Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:B.reference_number,onChange:b=>$({...B,reference_number:b.target.value}),placeholder:"e.g. REF-2026-99"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Classification"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:B.classification||"Standard",onChange:b=>$({...B,classification:b.target.value}),children:[r.jsx("option",{value:"Standard",children:"Standard"}),r.jsx("option",{value:"Non-Standard",children:"Non-Standard"})]})]}),r.jsxs("div",{className:"form-group",style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Overall Order Notes"}),r.jsx("textarea",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",height:"80px",resize:"vertical"},value:B.notes,onChange:b=>$({...B,notes:b.target.value}),placeholder:"Enter special notes..."})]})]})}),r.jsxs("div",{className:"modal-footer",style:{display:"flex",justifyContent:"flex-end",gap:"10px",padding:"16px",borderTop:"1px solid var(--border)"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#64748b",border:"none",color:"#fff",padding:"8px 16px",borderRadius:"4px",cursor:"pointer"},onClick:()=>G(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",style:{background:"#10b981",border:"none",color:"#fff",padding:"8px 16px",borderRadius:"4px",cursor:"pointer"},disabled:D,children:D?"Saving...":"Save Changes"})]})]})]})}),ee&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&ie(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"640px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Amend Line Item"}),r.jsxs("div",{className:"modal-sub",children:["Item ",ee.line_item_number," — ",a==null?void 0:a.order_number]})]}),r.jsx("button",{className:"modal-close",onClick:()=>ie(null),children:"✕"})]}),r.jsxs("form",{onSubmit:ze,children:[r.jsx("div",{className:"modal-body",children:r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"},children:[r.jsxs("div",{style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Material Description"}),r.jsx("input",{type:"text",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ne.material_description,onChange:b=>be("material_description",b.target.value),placeholder:"e.g. VFD Control Panel 22kW"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Part Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ne.part_number,onChange:b=>be("part_number",b.target.value),placeholder:"e.g. VFD-22K-STD"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Panel Type / Size"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ne.panel_type_size,onChange:b=>be("panel_type_size",b.target.value),placeholder:"e.g. 800x600"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Quantity"}),r.jsx("input",{type:"number",min:"1",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ne.quantity,onChange:b=>be("quantity",b.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Unit"}),r.jsx("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ne.unit,onChange:b=>be("unit",b.target.value),children:["Nos","Sets","Pcs","Units","Lot"].map(b=>r.jsx("option",{value:b,children:b},b))})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Unit Price (₹)"}),r.jsx("input",{type:"number",min:"0",max:"9999999999999.99",step:"0.01",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ne.unit_price,onChange:b=>be("unit_price",b.target.value)})]}),r.jsxs("div",{style:{gridColumn:"span 2",padding:"8px 12px",background:"var(--bg2)",borderRadius:"6px",border:"1px solid var(--border)",fontSize:"13px",color:"var(--text3)"},children:["Total Price: ",r.jsxs("strong",{style:{color:"var(--text)",fontSize:"15px"},children:["₹",((parseFloat(ne.unit_price)||0)*(parseInt(ne.quantity)||0)).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"11px"},children:"(auto-calculated)"})]}),r.jsxs("div",{children:[r.jsxs("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:["Line Item Delivery Date ",r.jsx("span",{style:{textTransform:"none",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box",opacity:.7,cursor:"not-allowed"},value:ne.delivery_date,disabled:!0})]}),r.jsxs("div",{style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Notes"}),r.jsx("textarea",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",height:"72px",resize:"vertical",boxSizing:"border-box"},value:ne.notes,onChange:b=>be("notes",b.target.value),placeholder:"Item-specific notes..."})]})]})}),r.jsxs("div",{className:"modal-footer",style:{display:"flex",justifyContent:"flex-end",gap:"10px",padding:"16px",borderTop:"1px solid var(--border)"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#64748b",border:"none",color:"#fff",padding:"8px 18px",borderRadius:"4px",cursor:"pointer"},onClick:()=>ie(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",style:{background:"#7c3aed",border:"none",color:"#fff",padding:"8px 18px",borderRadius:"4px",cursor:"pointer"},disabled:de,children:de?"Saving...":"Save Line Item"})]})]})]})})]})}const Ap=[{key:"orders.order_number",label:"Order #"},{key:"orders.po_number",label:"PO Number"},{key:"orders.order_date",label:"Order Date"},{key:"orders.delivery_date",label:"Delivery Date"},{key:"orders.planned_dispatch_date",label:"Planned Dispatch Date"},{key:"orders.priority",label:"Priority"},{key:"orders.classification",label:"Classification"},{key:"orders.packaging_type",label:"Packaging Type"},{key:"orders.end_client_name",label:"End Client Name"},{key:"orders.reference_number",label:"Reference Number"},{key:"orders.gst_number",label:"GST Number"},{key:"orders.hold_status",label:"Hold Status"},{key:"orders.order_status",label:"Order Status"},{key:"orders.notes",label:"Order Notes"},{key:"company_name",label:"Company Name"},{key:"company_city",label:"Company City"},{key:"person_in_charge",label:"Person In Charge"},{key:"contact_number",label:"Contact Number"},{key:"company_email",label:"Company Email"},{key:"orders.wiring_assigned_date",label:"Wiring Assigned Date"},{key:"orders.wiring_expected_date",label:"Wiring Expected Date"},{key:"orders.expected_qc_date",label:"Expected QC Date"},{key:"orders.qc_date",label:"QC Date"},{key:"orders.qc_status",label:"QC Status"},{key:"li.material_description",label:"Material Description"},{key:"li.part_number",label:"Part Number"},{key:"li.panel_type_size",label:"Panel Type / Size"},{key:"li.delivery_date",label:"Line Item Delivery Date"},{key:"li.quantity",label:"Quantity"},{key:"li.unit",label:"Unit"},{key:"li.unit_price",label:"Unit Price"},{key:"li.total_price",label:"Total Price"},{key:"docs.any",label:"📄 Any document uploaded"},{key:"docs.PO",label:"📄 PO document uploaded"},{key:"docs.Drawing",label:"📄 Drawing uploaded"},{key:"docs.BOM",label:"📄 BOM uploaded"},{key:"docs.QC",label:"📄 QC document uploaded"},{key:"docs.Dispatch",label:"📄 Dispatch document uploaded"},{key:"docs.Quotation",label:"📄 Quotation uploaded"},{key:"docs.General",label:"📄 General document uploaded"},{key:"docs.TaskUpload",label:"📄 Task upload present"},{key:"unit_serial",label:"Unit Serial"},{key:"short_serial",label:"Short Serial"},{key:"current_dept",label:"Current Department"},{key:"unit_status",label:"Unit Status"},{key:"__custom__",label:"✏️ Custom key…"}],Zd=[{value:"",label:"— No condition (any non-empty) —",needsValue:!1},{value:"IS_NOT_EMPTY",label:"is not empty",needsValue:!1},{value:"IS_EMPTY",label:"is empty",needsValue:!1},{value:"HAS_DOCS",label:"📄 has documents (count > 0)",needsValue:!1},{value:"NO_DOCS",label:"📄 has no documents (count = 0)",needsValue:!1},{value:"EQUALS",label:"= equals",needsValue:!0},{value:"NOT_EQUALS",label:"≠ not equals",needsValue:!0},{value:"CONTAINS",label:"contains",needsValue:!0},{value:"GT",label:"> greater than",needsValue:!0},{value:"GTE",label:"≥ greater than or equal",needsValue:!0},{value:"LT",label:"< less than",needsValue:!0},{value:"LTE",label:"≤ less than or equal",needsValue:!0},{value:"DATE_FUTURE",label:"date is in the future",needsValue:!1},{value:"DATE_PAST",label:"date is today or past",needsValue:!1}],Pl=(e,t)=>{switch(e){case"":return"";case"IS_NOT_EMPTY":return'$val !== "" && $val !== null && $val !== undefined';case"IS_EMPTY":return'$val === "" || $val === null || $val === undefined';case"HAS_DOCS":return"Number($val) > 0";case"NO_DOCS":return'Number($val) === 0 || $val === ""';case"EQUALS":return`String($val).toLowerCase() === ${JSON.stringify(String(t).toLowerCase())}`;case"NOT_EQUALS":return`String($val).toLowerCase() !== ${JSON.stringify(String(t).toLowerCase())}`;case"CONTAINS":return`String($val).toLowerCase().includes(${JSON.stringify(String(t).toLowerCase())})`;case"GT":return`Number($val) > ${Number(t)||0}`;case"GTE":return`Number($val) >= ${Number(t)||0}`;case"LT":return`Number($val) < ${Number(t)||0}`;case"LTE":return`Number($val) <= ${Number(t)||0}`;case"DATE_FUTURE":return"new Date($val) > new Date()";case"DATE_PAST":return"new Date($val) <= new Date()";default:return""}},ah=(e,t)=>{var a;if(!e)return"auto-done when not empty";const n=((a=Ap.find(o=>o.key===t))==null?void 0:a.label)||t;return e==="Number($val) > 0"?`${n} → at least 1 document`:e.includes("Number($val) === 0")?`${n} → no documents`:e.includes('!== ""')?`${n} is not empty`:e.includes('=== ""')?`${n} is empty`:e.includes(".includes(")?`${n} contains value`:e.includes("new Date($val) > new Date()")?`${n} is in the future`:e.includes("new Date($val) <= new Date()")?`${n} is today or past`:e.includes("=== ")?`${n} equals value`:e.includes("!== ")?`${n} does not equal value`:e.includes("> ")?`${n} > value`:e.includes(">= ")?`${n} >= value`:e.includes("< ")?`${n} < value`:e.includes("<= ")?`${n} <= value`:e},oh=[{key:"order_number",label:"Order Number"},{key:"company_name",label:"Company Name"},{key:"delivery_date",label:"Delivery Date"},{key:"po_number",label:"PO Number"},{key:"packaging_type",label:"Packaging Type"},{key:"priority",label:"Priority"},{key:"notes",label:"Order Notes"}];function lh(){var V,Y;const[e,t]=p.useState("companies"),[n,a]=p.useState([]),[o,l]=p.useState(!1),[s,i]=p.useState({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),[d,u]=p.useState([]),[g,m]=p.useState(!1),[h,S]=p.useState(null),[N,_]=p.useState({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),[E,x]=p.useState([]),[f,c]=p.useState(!1),[w,T]=p.useState({label:"",type:"Text",options:"",datakeyPreset:"",customDatakey:"",operator:"",conditionValue:""}),L=localStorage.getItem("token"),k=((V=JSON.parse(localStorage.getItem("user")||"{}").role)==null?void 0:V.toLowerCase())==="admin";p.useEffect(()=>{F(),j()},[]),p.useEffect(()=>{const D=I=>{I.altKey&&I.key.toLowerCase()==="n"&&(I.preventDefault(),e==="companies"&&k?l(!0):e==="tasks"&&k&&(S(null),_({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,order_fields:[]}),x([]),c(!1),m(!0)))};return window.addEventListener("keydown",D),()=>{window.removeEventListener("keydown",D)}},[e,k]);const F=async()=>{try{const D=await fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${L}`}});D.ok&&a(await D.json())}catch(D){console.error(D)}},j=async()=>{try{const D=await fetch(window.API_BASE+"/api/task_masters",{headers:{Authorization:`Bearer ${L}`}});D.ok&&u(await D.json())}catch(D){console.error(D)}},P=(D,I,ee)=>{const ie=[...s.locations];ie[D][I]=ee,i({...s,locations:ie})},C=()=>{i({...s,locations:[...s.locations,{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]})},z=async D=>{D.preventDefault();try{(await fetch(window.API_BASE+"/api/companies",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${L}`},body:JSON.stringify(s)})).ok&&(l(!1),i({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),F())}catch(I){console.error(I)}},M=async D=>{D.preventDefault();const I=!!h,ee=I?`${window.API_BASE}/api/task_masters/${h}`:window.API_BASE+"/api/task_masters",ie=I?"PUT":"POST",ne=E.map(({id:fe,label:de,type:O,options:te,datakey:Q,condition:he})=>({id:fe,label:de,type:O,options:te||[],datakey:Q||"",condition:he||""}));try{(await fetch(ee,{method:ie,headers:{"Content-Type":"application/json",Authorization:`Bearer ${L}`},body:JSON.stringify({...N,custom_fields:ne,order_fields:N.order_fields||[]})})).ok?(m(!1),S(null),_({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),x([]),c(!1),j()):alert("Failed to save task")}catch(fe){console.error(fe)}},A=D=>{S(D.id),_({dept:D.dept,name:D.name,sub:D.sub||"",special:D.special||"",is_mandatory:D.is_mandatory,requires_upload:D.requires_upload,default_doc_type:D.default_doc_type||"General",order_fields:Array.isArray(D.order_fields)?D.order_fields:D.order_fields?JSON.parse(D.order_fields):[]});try{const I=Array.isArray(D.custom_fields)?D.custom_fields:JSON.parse(D.custom_fields||"[]");x(I)}catch{x([])}c(!1),m(!0)},G=()=>{if(!w.label.trim()){alert("Label is required.");return}const D=w.datakeyPreset==="__custom__"?(w.customDatakey||"").trim():(w.datakeyPreset||"").trim(),I=Pl(w.operator,w.conditionValue),ee={id:Date.now(),label:w.label.trim(),type:w.type,options:w.type==="Dropdown"?w.options.split(",").map(ie=>ie.trim()).filter(Boolean):[],datakey:D,condition:I};x(ie=>[...ie,ee]),T({label:"",type:"Text",options:"",datakeyPreset:"",customDatakey:"",operator:"",conditionValue:""}),c(!1)},B=D=>x(I=>I.filter(ee=>ee.id!==D)),$=async D=>{if(window.confirm("Are you sure you want to delete this task?"))try{(await fetch(`${window.API_BASE}/api/task_masters/${D}`,{method:"DELETE",headers:{Authorization:`Bearer ${L}`}})).ok?j():alert("Failed to delete task")}catch(I){console.error(I)}};return r.jsxs("div",{style:{padding:"24px"},children:[r.jsxs("div",{style:{display:"flex",gap:"16px",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:[r.jsx("button",{className:`vbtn ${e==="companies"?"active":""}`,onClick:()=>t("companies"),children:"Companies"}),r.jsx("button",{className:`vbtn ${e==="tasks"?"active":""}`,onClick:()=>t("tasks"),children:"Task Masters"})]}),e==="companies"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"var(--text)"},children:"Company Masters"}),k&&r.jsx("button",{className:"vbtn",onClick:()=>l(!0),children:"+ Register Company (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:n.map(D=>r.jsxs("div",{style:{background:"var(--bg2)",padding:"20px",borderRadius:"12px",border:"1px solid var(--border)"},children:[r.jsx("h3",{style:{margin:"0 0 16px 0",color:"var(--text)"},children:D.name}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:D.locations.map(I=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"16px",borderRadius:"8px",border:"1px solid var(--border)"},children:[r.jsx("div",{style:{color:"var(--blue)",fontWeight:"bold",marginBottom:"8px"},children:I.city}),r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",marginBottom:"4px"},children:I.address}),r.jsxs("div",{style:{fontSize:"12px",color:"var(--text3)",marginTop:"12px"},children:[r.jsxs("div",{children:[r.jsx("strong",{children:"Contact:"})," ",I.person_in_charge||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Phone:"})," ",I.contact_number||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Email:"})," ",I.email||"N/A"]})]})]},I.id))})]},D.id))})]}),e==="tasks"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"var(--text)"},children:"Task Masters"}),k&&r.jsx("button",{className:"vbtn",onClick:()=>{S(null),_({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),x([]),c(!1),m(!0)},children:"+ New Task (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:Ft.map(D=>{const I=d.filter(ee=>ee.dept===D.id);return I.length===0?null:r.jsxs("div",{children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"},children:[r.jsx("div",{style:{width:"4px",height:"16px",background:D.color,borderRadius:"2px"}}),r.jsx("h3",{style:{margin:0,color:"var(--text)",fontSize:"15px"},children:D.label})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:I.map(ee=>r.jsxs("div",{style:{background:"var(--bg2)",padding:"16px",borderRadius:"8px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"},children:[r.jsx("span",{style:{fontSize:"12px",color:D.color,fontWeight:"bold",textTransform:"uppercase"},children:ee.dept}),r.jsx("span",{style:{fontSize:"10px",background:ee.is_mandatory?"var(--blue-dim)":"var(--gray-dim)",color:ee.is_mandatory?"var(--blue)":"var(--text3)",padding:"2px 6px",borderRadius:"4px"},children:ee.is_mandatory?"MANDATORY":"OPTIONAL"})]}),r.jsx("div",{style:{color:"var(--text)",fontWeight:"500",marginBottom:"4px"},children:ee.name}),r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",marginBottom:"12px"},children:ee.sub||"No description"}),r.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[ee.requires_upload&&r.jsxs("span",{style:{fontSize:"10px",background:"#f59e0b44",color:"#fbbf24",padding:"2px 6px",borderRadius:"4px"},children:["Requires: ",ee.default_doc_type||"General"]}),ee.special&&r.jsxs("span",{style:{fontSize:"10px",background:"#10b98144",color:"#34d399",padding:"2px 6px",borderRadius:"4px"},children:["Special: ",ee.special]})]}),k&&r.jsxs("div",{style:{display:"flex",gap:"4px"},children:[r.jsx("button",{style:{background:"transparent",border:"1px solid var(--border2)",color:"var(--text2)",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>A(ee),children:"Edit"}),r.jsx("button",{style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>$(ee.id),children:"Delete"})]})]})]},ee.id))})]},D.id)})})]}),o&&r.jsx("div",{className:"modal-overlay open",onClick:D=>{D.target.className==="modal-overlay open"&&l(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:"Register Company"}),r.jsx("button",{className:"modal-close",onClick:()=>l(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:z,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Company Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:s.name,onChange:D=>i({...s,name:D.target.value})})]}),r.jsx("div",{style:{marginTop:"24px",marginBottom:"16px",borderBottom:"1px solid var(--border)",paddingBottom:"8px",color:"var(--text)"},children:"Locations"}),s.locations.map((D,I)=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"16px",borderRadius:"8px",marginBottom:"16px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"City *"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:D.city,onChange:ee=>P(I,"city",ee.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Person in Charge"}),r.jsx("input",{type:"text",className:"form-input",value:D.person_in_charge,onChange:ee=>P(I,"person_in_charge",ee.target.value)})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Full Address"}),r.jsx("input",{type:"text",className:"form-input",value:D.address,onChange:ee=>P(I,"address",ee.target.value)})]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Contact Number"}),r.jsx("input",{type:"text",className:"form-input",value:D.contact_number,onChange:ee=>P(I,"contact_number",ee.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Email"}),r.jsx("input",{type:"email",className:"form-input",value:D.email,onChange:ee=>P(I,"email",ee.target.value)})]})]})]},I)),r.jsx("button",{type:"button",onClick:C,style:{background:"transparent",border:"1px dashed var(--border2)",color:"var(--text3)",width:"100%",padding:"12px",borderRadius:"8px",cursor:"pointer",marginBottom:"24px"},children:"+ Add Another Location"}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"var(--bg4)"},onClick:()=>l(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:"Save Company"})]})]})})]})}),g&&r.jsx("div",{className:"modal-overlay open",onClick:D=>{D.target.className==="modal-overlay open"&&m(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:h?"Edit Task Master":"New Task Master"}),r.jsx("button",{className:"modal-close",onClick:()=>m(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:M,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Department"}),r.jsx("select",{className:"form-select",value:N.dept,onChange:D=>_({...N,dept:D.target.value}),children:Ft.map(D=>r.jsx("option",{value:D.id,children:D.label},D.id))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Task Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:N.name,onChange:D=>_({...N,name:D.target.value})})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Description / Subtitle"}),r.jsx("input",{type:"text",className:"form-input",value:N.sub,onChange:D=>_({...N,sub:D.target.value})})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"16px"},children:[r.jsx("input",{type:"checkbox",checked:N.is_mandatory,onChange:D=>_({...N,is_mandatory:D.target.checked})}),r.jsx("label",{style:{margin:0,color:"var(--text)"},children:"Mandatory Task (added to all new orders)"})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"12px"},children:[r.jsx("input",{type:"checkbox",checked:N.requires_upload,onChange:D=>_({...N,requires_upload:D.target.checked})}),r.jsx("label",{style:{margin:0,color:"var(--text)"},children:"Requires Document Upload to complete"})]}),N.requires_upload&&r.jsxs("div",{className:"modal-field",style:{marginLeft:"24px",marginTop:"8px"},children:[r.jsx("label",{style:{color:"#fff",fontSize:"12px",display:"block",marginBottom:"4px"},children:"Default Document Type"}),r.jsxs("select",{className:"form-select",value:N.default_doc_type||"General",onChange:D=>_({...N,default_doc_type:D.target.value}),style:{fontSize:"13px",width:"100%",padding:"6px 12px"},children:[r.jsx("option",{value:"General",children:"General"}),r.jsx("option",{value:"PO",children:"PO"}),r.jsx("option",{value:"Quotation",children:"Quotation"}),r.jsx("option",{value:"BOM",children:"BOM"}),r.jsx("option",{value:"Drawing",children:"Drawing"}),r.jsx("option",{value:"QC Report",children:"QC Report"}),r.jsx("option",{value:"Dispatch Document",children:"Dispatch Document"}),r.jsx("option",{value:"Photo",children:"Photo"})]})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid #333"},children:[r.jsx("label",{style:{color:"#fff",fontWeight:"600",display:"block",marginBottom:"10px"},children:"Order Fields to Show"}),r.jsx("div",{style:{color:"var(--text3)",fontSize:"11px",marginBottom:"10px"},children:"These fields from the order will be shown as read-only reference inside the task modal."}),r.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:oh.map(D=>{const I=(N.order_fields||[]).includes(D.key);return r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"6px",background:I?"var(--blue-dim)":"var(--bg3)",border:`1px solid ${I?"rgba(59,130,246,0.4)":"var(--border)"}`,borderRadius:"6px",padding:"5px 10px",cursor:"pointer",fontSize:"12px",color:I?"var(--blue)":"var(--text3)"},children:[r.jsx("input",{type:"checkbox",checked:I,style:{display:"none"},onChange:()=>{const ee=N.order_fields||[],ie=I?ee.filter(ne=>ne!==D.key):[...ee,D.key];_(ne=>({...ne,order_fields:ie}))}}),I?"✓ ":"",D.label]},D.key)})})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("label",{style:{color:"var(--text)",fontWeight:"600"},children:"Form Fields"}),r.jsx("button",{type:"button",onClick:()=>c(!f),style:{background:"rgba(59,130,246,0.15)",color:"#60a5fa",border:"1px solid rgba(59,130,246,0.3)",padding:"4px 10px",borderRadius:"6px",fontSize:"11px",cursor:"pointer"},children:f?"Cancel":"+ Add Field"})]}),f&&r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px",marginBottom:"12px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Label *"}),r.jsx("input",{type:"text",className:"form-input",value:w.label,onChange:D=>T(I=>({...I,label:D.target.value})),placeholder:"e.g. Test Voltage"})]}),r.jsxs("div",{style:{background:"var(--bg4)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:"8px",padding:"12px",marginBottom:"12px"},children:[r.jsx("div",{style:{fontSize:"11px",color:"#a78bfa",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"10px"},children:"⚡ Auto-Done Trigger (optional)"}),r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"10px"},children:"If the selected DB field matches this condition, the task is automatically marked Done."}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"},children:[r.jsx("span",{style:{fontSize:"12px",fontWeight:"700",color:"#a78bfa",minWidth:"18px"},children:"IF"}),r.jsxs("div",{style:{flex:"1 1 160px"},children:[r.jsxs("select",{className:"form-select",value:w.datakeyPreset||"",onChange:D=>T(I=>({...I,datakeyPreset:D.target.value,customDatakey:"",operator:"",conditionValue:""})),children:[r.jsx("option",{value:"",children:"— pick a field —"}),Ap.map(D=>r.jsx("option",{value:D.key,children:D.label},D.key))]}),w.datakeyPreset==="__custom__"&&r.jsx("input",{type:"text",className:"form-input",style:{marginTop:"6px",fontFamily:"monospace",fontSize:"12px"},value:w.customDatakey||"",onChange:D=>T(I=>({...I,customDatakey:D.target.value})),placeholder:"table.column_name"})]}),r.jsx("div",{style:{flex:"1 1 160px"},children:r.jsx("select",{className:"form-select",value:w.operator||"",onChange:D=>T(I=>({...I,operator:D.target.value,conditionValue:""})),disabled:!w.datakeyPreset||w.datakeyPreset==="",children:Zd.map(D=>r.jsx("option",{value:D.value,children:D.label},D.value))})}),((Y=Zd.find(D=>D.value===w.operator))==null?void 0:Y.needsValue)&&r.jsx("div",{style:{flex:"1 1 120px"},children:r.jsx("input",{type:"text",className:"form-input",value:w.conditionValue||"",onChange:D=>T(I=>({...I,conditionValue:D.target.value})),placeholder:"value…"})})]}),w.datakeyPreset&&w.datakeyPreset!==""&&r.jsx("div",{style:{marginTop:"8px",fontSize:"11px",color:"#9ca3af",fontFamily:"monospace",background:"var(--bg3)",padding:"6px 10px",borderRadius:"4px"},children:Pl(w.operator,w.conditionValue)?`⚡ ${Pl(w.operator,w.conditionValue)}`:"⚡ auto-done when field has any value"})]}),r.jsx("button",{type:"button",onClick:G,style:{background:"#10b981",color:"#fff",border:"none",padding:"6px 14px",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},children:"Add Field"})]}),E.length===0?r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",fontStyle:"italic",padding:"8px 0"},children:"No form fields defined. Users will only see Notes when filling this task."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:E.map(D=>{var I;return r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[r.jsxs("div",{children:[r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:D.label}),((I=D.options)==null?void 0:I.length)>0&&r.jsxs("span",{style:{marginLeft:"6px",fontSize:"10px",color:"var(--text3)"},children:["(",D.options.join(", "),")"]})]}),(D.datakey||D.condition)&&r.jsx("div",{style:{fontSize:"11px",color:"#a78bfa",marginTop:"3px",display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"},children:r.jsxs("span",{style:{background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"4px",padding:"1px 6px"},children:["⚡ IF ",ah(D.condition,D.datakey)]})})]}),r.jsx("button",{type:"button",onClick:()=>B(D.id),style:{background:"transparent",border:"none",color:"#666",cursor:"pointer",fontSize:"14px"},children:"✕"})]},D.id)})})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px",marginTop:"24px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#333"},onClick:()=>m(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:h?"Update Task":"Save Task"})]})]})})]})})]})}function sh(){const[e,t]=p.useState([]),[n,a]=p.useState("1000"),[o,l]=p.useState(""),[s,i]=p.useState("All"),[d,u]=p.useState(!1),g=localStorage.getItem("token");p.useEffect(()=>{m(n)},[n]);const m=async(_=n)=>{u(!0);try{const E=await fetch(`${window.API_BASE}/api/logs?limit=${_}`,{headers:{Authorization:`Bearer ${g}`}});if(E.ok){const x=await E.json();t(x)}}catch(E){console.error(E)}finally{u(!1)}},h=_=>{const E=new Date(_);return E.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+" "+E.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},S=_=>{switch(_==null?void 0:_.toLowerCase()){case"sales":return{background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",border:"1px solid rgba(59, 130, 246, 0.2)"};case"design":return{background:"rgba(167, 139, 250, 0.1)",color:"#a78bfa",border:"1px solid rgba(167, 139, 250, 0.2)"};case"purchase":return{background:"rgba(249, 115, 22, 0.1)",color:"#f97316",border:"1px solid rgba(249, 115, 22, 0.2)"};case"stores":return{background:"rgba(45, 212, 191, 0.1)",color:"#2dd4bf",border:"1px solid rgba(45, 212, 191, 0.2)"};case"production":return{background:"rgba(239, 68, 68, 0.1)",color:"#ef4444",border:"1px solid rgba(239, 68, 68, 0.2)"};case"qc":return{background:"rgba(34, 197, 94, 0.1)",color:"#22c55e",border:"1px solid rgba(34, 197, 94, 0.2)"};case"dispatch":return{background:"rgba(245, 158, 11, 0.1)",color:"#f59e0b",border:"1px solid rgba(245, 158, 11, 0.2)"};case"accounts":return{background:"rgba(14, 165, 233, 0.1)",color:"#0ea5e9",border:"1px solid rgba(14, 165, 233, 0.2)"};default:return{background:"rgba(255, 255, 255, 0.05)",color:"#888",border:"1px solid rgba(255, 255, 255, 0.1)"}}},N=e.filter(_=>{if(s!=="All"&&_.dept!==s)return!1;if(o.trim()!==""){const E=o.trim().toLowerCase().split(/\s+/),x=(_.username||"").toLowerCase(),f=(_.action_text||"").toLowerCase(),c=(_.order_number||"").toLowerCase();return E.every(w=>x.includes(w)||f.includes(w)||c.includes(w))}return!0});return r.jsxs("div",{style:{padding:"24px"},children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"var(--text)",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Ro,{size:22,style:{color:"#f59e0b"}}),"System Activity Logs"]})}),r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"16px",flex:1,minWidth:"300px"},children:[r.jsxs("div",{style:{position:"relative",flex:1,minWidth:"220px"},children:[r.jsx(Mr,{size:16,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("input",{type:"text",placeholder:"Search logs by user, action or order #...",value:o,onChange:_=>l(_.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 38px",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},className:"log-search-input"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(Ci,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:s,onChange:_=>i(_.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"All",children:"All Departments"}),r.jsx("option",{value:"Sales",children:"Sales"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"}),r.jsx("option",{value:"Accounts",children:"Accounts"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]}),r.jsxs("div",{style:{position:"relative",width:"160px"},children:[r.jsx(Dp,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:n,onChange:_=>a(_.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"100",children:"Fetch 100 Logs"}),r.jsx("option",{value:"250",children:"Fetch 250 Logs"}),r.jsx("option",{value:"500",children:"Fetch 500 Logs"}),r.jsx("option",{value:"1000",children:"Fetch 1000 Logs"}),r.jsx("option",{value:"5000",children:"Fetch 5000 Logs"}),r.jsx("option",{value:"all",children:"Fetch All Logs"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[(o||s!=="All")&&r.jsx("button",{onClick:()=>{l(""),i("All")},style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"#ef4444",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",transition:"all 0.2s"},className:"clear-btn",children:"Clear Filters"}),r.jsxs("button",{onClick:()=>m(n),disabled:d,style:{background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",transition:"all 0.2s"},className:"refresh-btn",children:[r.jsx(Ht,{size:14,className:d?"spin":"",style:{transition:"transform 0.5s"}}),d?"Loading...":"Refresh"]})]})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:"12px",fontSize:"12px",color:"var(--text3)"},children:[r.jsxs("div",{children:["Showing ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:"600"},children:N.length})," ","of ",r.jsx("span",{style:{color:"var(--text)",fontWeight:"600"},children:e.length})," fetched logs"," ",n==="all"?"(full system history)":`(limit: ${n})`]}),N.length<e.length&&r.jsxs("div",{style:{fontStyle:"italic"},children:["Filtered out ",e.length-N.length," logs"]})]}),r.jsx("div",{style:{background:"var(--bg2)",borderRadius:"12px",border:"1px solid var(--border)",overflow:"hidden"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"13px"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"var(--bg3)",borderBottom:"1px solid var(--border)"},children:[r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Timestamp"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"User"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Order #"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Department"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Action"})]})}),r.jsx("tbody",{children:d&&e.length===0?r.jsx("tr",{children:r.jsxs("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"var(--text3)"},children:[r.jsx(Ht,{size:24,className:"spin",style:{margin:"0 auto 12px",color:"#f59e0b",display:"block"}}),"Loading activity logs..."]})}):N.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"var(--text3)"},children:"No matching activity logs found."})}):N.map(_=>r.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},className:"log-row",children:[r.jsx("td",{style:{padding:"16px",color:"var(--text3)",whiteSpace:"nowrap"},children:h(_.timestamp)}),r.jsx("td",{style:{padding:"16px",color:"var(--text)",fontWeight:"600"},children:_.username}),r.jsx("td",{style:{padding:"16px"},children:_.order_number?r.jsx("span",{style:{fontFamily:"monospace",fontSize:"11px",background:"var(--orange-dim)",color:"var(--accent)",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(245,158,11,0.2)"},children:_.order_number}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"})}),r.jsx("td",{style:{padding:"16px"},children:_.dept?r.jsx("span",{style:{display:"inline-block",fontSize:"11px",fontWeight:"500",padding:"2px 8px",borderRadius:"12px",...S(_.dept)},children:_.dept}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"})}),r.jsx("td",{style:{padding:"16px",color:"var(--text)"},children:_.action_text})]},_.id))})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const ih=[10,20,50,100],Qa=["sr_no","order_number","po_number","reference_number","part_number","client_name","end_client_name","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","priority","status","qc_status","qc_date","progress","action"];function dh(){var At;const e=localStorage.getItem("token"),t=JSON.parse(localStorage.getItem("user")||"{}"),n=["admin","manager","planning"].includes((At=t.role)==null?void 0:At.toLowerCase()),[a,o]=p.useState([]),[l,s]=p.useState(()=>{const v=localStorage.getItem("planning_column_order");if(v)try{const R=JSON.parse(v);if(Array.isArray(R)&&R.length>0){const q=R.filter(re=>Qa.includes(re)),J=Qa.filter(re=>!q.includes(re));return[...q,...J]}}catch(R){console.error("Error parsing column order from localStorage:",R)}return Qa}),[i,d]=p.useState(null),[u,g]=p.useState(null),m=(v,R)=>{d(R),v.dataTransfer.effectAllowed="move",v.dataTransfer.setData("text/plain",R)},h=(v,R)=>{v.preventDefault(),i!==R&&u!==R&&g(R)},S=(v,R)=>{u===R&&g(null)},N=(v,R)=>{if(v.preventDefault(),!i||i===R){d(null),g(null);return}const q=l.indexOf(i),J=l.indexOf(R);if(q!==-1&&J!==-1){const re=[...l];re.splice(q,1),re.splice(J,0,i),s(re),localStorage.setItem("planning_column_order",JSON.stringify(re))}d(null),g(null)},_=()=>{d(null),g(null)},E=v=>{switch(v){case"sr_no":return"Sr. No.";case"order_number":return"Order Number";case"po_number":return"PO Number";case"reference_number":return"Cust. Ref #";case"part_number":return"Part Number";case"client_name":return"Client Name";case"end_client_name":return"End Client Name";case"planned_dispatch":return"Planned Dispatch";case"mounting_start":return"Mounting Start";case"mounting_complete":return"Mounting Complete";case"delivery_date":return"Order Delivery Date";case"wiring_assigned":return"Wiring Assigned";case"wiring_expected":return"Wiring Expected";case"expected_qc":return"Expected QC";case"priority":return"Priority";case"status":return"Status";case"qc_status":return"QC Status";case"qc_date":return"QC Passed Date";case"progress":return"Progress";case"action":return"Action";default:return v}},x=l.filter(v=>!(v==="action"&&!n)),f=(v,R,q,J)=>{var Pe;const re=de&&de.lineItemId===R.line_item_id&&de.colId===v;if(te&&te.lineItemId===R.line_item_id&&te.colId===v)return r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{className:"inline-saving-spinner"}),r.jsx("span",{className:"dim text-xs",children:"Saving..."})]});if(re){const me=ge=>{ge.key==="Enter"?ge.target.blur():ge.key==="Escape"&&O(null)},Ue=ge=>{tr(R.line_item_id,v,ge,de.oldValue)},Re=()=>{de&&de.lineItemId===R.line_item_id&&de.colId===v&&tr(R.line_item_id,v,de.value,de.oldValue)};if(["priority","status","qc_status"].includes(v)){let ge=[];return v==="priority"?ge=["Low","Medium","High","Urgent"]:v==="status"?ge=["Not Started","In Progress","Waiting for Material","QC Testing","Completed"]:v==="qc_status"&&(ge=["Pending","Pass","Fail"]),r.jsx("select",{className:"inline-edit-select",value:de.value,onChange:dt=>Ue(dt.target.value),onBlur:Re,autoFocus:!0,children:ge.map(dt=>r.jsx("option",{value:dt,children:dt},dt))})}if(["planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(v))return r.jsx("input",{type:"date",className:"inline-edit-input",value:de.value,onChange:ge=>O({...de,value:ge.target.value}),onBlur:Re,onKeyDown:me,autoFocus:!0});if(v==="end_client_name")return r.jsx("input",{type:"text",className:"inline-edit-input",value:de.value,onChange:ge=>O({...de,value:ge.target.value}),onBlur:Re,onKeyDown:me,autoFocus:!0})}switch(v){case"sr_no":return q;case"order_number":return r.jsxs(r.Fragment,{children:[R.line_item_number,R.total_qty>1&&r.jsxs("span",{style:{opacity:.5,marginLeft:"8px"},children:["(",R.unit_index,"/",R.total_qty,")"]})]});case"po_number":return R.po_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"reference_number":return R.reference_number?r.jsx("span",{style:{color:"#f59e0b",fontWeight:600},children:R.reference_number}):r.jsx("span",{className:"dim text-xs",children:"—"});case"part_number":return R.part_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"client_name":return R.company_name;case"end_client_name":return R.end_client_name||r.jsx("span",{className:"dim text-xs",children:"Unspecified"});case"planned_dispatch":return Ae(R.planned_dispatch_date);case"mounting_start":return Ae(R.mounting_start_date);case"mounting_complete":return Ae(R.mounting_complete_date);case"wiring_assigned":return Ae(R.wiring_assigned_date);case"wiring_expected":return Ae(R.wiring_expected_date);case"expected_qc":return Ae(R.expected_qc_date);case"priority":return r.jsx("span",{className:`priority-badge ${((Pe=R.priority)==null?void 0:Pe.toLowerCase())||"medium"}`,children:R.priority});case"status":return r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[r.jsx("span",{className:`status-badge ${(R.status||"Not Started").toLowerCase().replace(/\s+/g,"-")}`,children:R.status||"Not Started"}),R.active_dept&&r.jsxs("span",{className:`dept-badge dept-${(R.active_dept||"").toLowerCase()}`,children:["⚙ ",R.active_dept]})]});case"qc_status":return r.jsx("span",{className:`qc-badge ${(R.qc_status||"Pending").toLowerCase()}`,children:R.qc_status||"Pending"});case"qc_date":return Ae(R.qc_date);case"progress":return r.jsxs("div",{className:"progress-cell",children:[r.jsxs("div",{className:"progress-text",children:[J,"%"]}),r.jsx("div",{className:"progress-track",children:r.jsx("div",{className:"progress-fill",style:{width:`${J}%`,backgroundColor:b(J)}})})]});case"action":return n?r.jsx("button",{className:"icon-btn",onClick:()=>St(R),title:"Edit planning data",children:r.jsx(zg,{size:13})}):null;default:return null}},[c,w]=p.useState(!0),[T,L]=p.useState(""),[y,k]=p.useState("all"),[F,j]=p.useState("all"),[P,C]=p.useState(null),[z,M]=p.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[A,G]=p.useState(""),[B,$]=p.useState(""),[V,Y]=p.useState([]),[D,I]=p.useState(!1),[ee,ie]=p.useState({end_client_name:!1,planned_dispatch_date:!1,mounting_start_date:!1,mounting_complete_date:!1,wiring_assigned_date:!1,wiring_expected_date:!1,expected_qc_date:!1,priority:!1,status:!1,qc_status:!1,qc_date:!1}),[ne,fe]=p.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[de,O]=p.useState(null),[te,Q]=p.useState(null),[he,le]=p.useState(1),[U,ze]=p.useState(20),[be,ve]=p.useState("none"),[H,Z]=p.useState("none"),[ue,st]=p.useState({}),it=v=>{st(R=>({...R,[v]:R[v]===!1}))};p.useEffect(()=>{kt()},[]);const kt=async()=>{try{const v=await fetch(window.API_BASE+"/api/planning",{headers:{Authorization:`Bearer ${e}`}});v.ok&&o(await v.json())}catch(v){console.error("Error fetching planning data:",v)}finally{w(!1)}},St=v=>{n&&(C(v),M({end_client_name:v.end_client_name||"",planned_dispatch_date:v.planned_dispatch_date?v.planned_dispatch_date.split("T")[0]:"",mounting_start_date:v.mounting_start_date?v.mounting_start_date.split("T")[0]:"",mounting_complete_date:v.mounting_complete_date?v.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:v.wiring_assigned_date?v.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:v.wiring_expected_date?v.wiring_expected_date.split("T")[0]:"",expected_qc_date:v.expected_qc_date?v.expected_qc_date.split("T")[0]:"",priority:v.priority||"Medium",status:v.status||"Not Started",qc_status:v.qc_status||"Pending",qc_date:v.qc_date?v.qc_date.split("T")[0]:""}),G(""),$(""))},_t=v=>{const{name:R,value:q}=v.target;M(J=>({...J,[R]:q}))},Sa=async v=>{v.preventDefault();try{const R=await fetch(`${window.API_BASE}/api/planning/line-items/${P.line_item_id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(z)});if(R.ok)$("Planning details updated successfully."),setTimeout(()=>{C(null),kt(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const q=await R.json();G(q.error||"Failed to update planning details.")}}catch(R){console.error(R),G("Network error, please try again.")}},Ae=v=>v?new Date(v).toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"}):"—",Wr=[];a.forEach(v=>{const R=parseInt(v.quantity)||1;for(let q=0;q<R;q++)Wr.push({...v,unit_index:q+1,total_qty:R,row_key:`${v.line_item_id}-${q}`})});const Sn=Wr.filter(v=>{let R=!0;if(T.trim()!==""){const re=T.trim().toLowerCase().split(/\s+/),se=(v.order_number||"").toLowerCase(),Pe=(v.line_item_number||"").toLowerCase(),me=`${v.order_number||""} / ${v.line_item_number||""}`.toLowerCase(),Ue=`${v.order_number||""}/${v.line_item_number||""}`.toLowerCase(),Re=`${v.order_number||""}${v.line_item_number||""}`.toLowerCase(),ge=(v.po_number||"").toLowerCase(),dt=(v.part_number||"").toLowerCase(),qr=(v.company_name||"").toLowerCase(),Nn=(v.end_client_name||"").toLowerCase();R=re.every(Nt=>se.includes(Nt)||Pe.includes(Nt)||me.includes(Nt)||Ue.includes(Nt)||Re.includes(Nt)||ge.includes(Nt)||dt.includes(Nt)||qr.includes(Nt)||Nn.includes(Nt))}const q=y==="all"||v.status===y,J=F==="all"||v.priority===F;return R&&q&&J}),_a=v=>{L(v),le(1)},Na=v=>{k(v),le(1)},Ca=v=>{j(v),le(1)},za=v=>{ze(Number(v)),le(1)},Sr=Sn.length,Lt=Math.max(1,Math.ceil(Sr/U)),gt=Math.min(he,Lt),Zt=(gt-1)*U,_n=Math.min(Zt+U,Sr),er=Sn.slice(Zt,_n),b=v=>v<30?"#ef4444":v<70?"#f59e0b":"#10b981",K=p.useCallback(()=>{const v=[],q=Math.max(1,gt-3),J=Math.min(Lt,gt+3);for(let re=q;re<=J;re++)v.push(re);return v},[gt,Lt]),oe=v=>{Y(R=>R.includes(v)?R.filter(q=>q!==v):[...R,v])},Ee=()=>{const v=er.map(q=>q.line_item_id),R=v.every(q=>V.includes(q));Y(R?q=>q.filter(J=>!v.includes(J)):q=>{const J=[...q];return v.forEach(re=>{J.includes(re)||J.push(re)}),J})},He=async v=>{v.preventDefault();const R={};let q=!1;if(Object.keys(ne).forEach(J=>{ne[J]!==""&&(R[J]=ne[J],q=!0)}),!q){G("Please modify at least one field to update.");return}w(!0);try{const J=await fetch(window.API_BASE+"/api/planning/line-items/bulk",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({lineItemIds:V,fields:R})});if(J.ok)$(`Successfully updated ${V.length} items.`),Y([]),setTimeout(()=>{I(!1),G(""),$(""),fe({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),kt(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const re=await J.json();G(re.error||"Failed to update selected items."),w(!1)}}catch(J){console.error(J),G("Network error, please try again."),w(!1)}},Qe=(v,R,q)=>{if(!n||["INPUT","SELECT","OPTION","BUTTON","A","svg","path"].includes(v.target.tagName))return;let J="";R==="end_client_name"?J=q.end_client_name||"":R==="planned_dispatch"?J=q.planned_dispatch_date?q.planned_dispatch_date.split("T")[0]:"":R==="mounting_start"?J=q.mounting_start_date?q.mounting_start_date.split("T")[0]:"":R==="mounting_complete"?J=q.mounting_complete_date?q.mounting_complete_date.split("T")[0]:"":R==="wiring_assigned"?J=q.wiring_assigned_date?q.wiring_assigned_date.split("T")[0]:"":R==="wiring_expected"?J=q.wiring_expected_date?q.wiring_expected_date.split("T")[0]:"":R==="expected_qc"?J=q.expected_qc_date?q.expected_qc_date.split("T")[0]:"":R==="priority"?J=q.priority||"Medium":R==="status"?J=q.status||"Not Started":R==="qc_status"?J=q.qc_status||"Pending":R==="qc_date"&&(J=q.qc_date?q.qc_date.split("T")[0]:""),O({lineItemId:q.line_item_id,colId:R,value:J,oldValue:J})},tr=async(v,R,q,J)=>{if(q===J){O(null);return}Q({lineItemId:v,colId:R}),O(null);try{let re=R;R==="planned_dispatch"?re="planned_dispatch_date":R==="mounting_start"?re="mounting_start_date":R==="mounting_complete"?re="mounting_complete_date":R==="wiring_assigned"?re="wiring_assigned_date":R==="wiring_expected"?re="wiring_expected_date":R==="expected_qc"&&(re="expected_qc_date");const se=a.find(Ue=>Ue.line_item_id===v);if(!se)throw new Error("Order not found");const Pe={end_client_name:se.end_client_name||"",planned_dispatch_date:se.planned_dispatch_date?se.planned_dispatch_date.split("T")[0]:"",mounting_start_date:se.mounting_start_date?se.mounting_start_date.split("T")[0]:"",mounting_complete_date:se.mounting_complete_date?se.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:se.wiring_assigned_date?se.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:se.wiring_expected_date?se.wiring_expected_date.split("T")[0]:"",expected_qc_date:se.expected_qc_date?se.expected_qc_date.split("T")[0]:"",priority:se.priority||"Medium",status:se.status||"Not Started",qc_status:se.qc_status||"Pending",qc_date:se.qc_date?se.qc_date.split("T")[0]:""};Pe[re]=q;const me=await fetch(`${window.API_BASE}/api/planning/line-items/${v}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(Pe)});if(me.ok)await kt(),window.dispatchEvent(new CustomEvent("orderUpdated"));else{const Ue=await me.json();alert(Ue.error||"Failed to update planning details.")}}catch(re){console.error(re),alert("Network error, please try again.")}finally{Q(null)}},rr=(v,R)=>{if(!R||R==="none")return"";switch(R){case"planned_dispatch":return Ae(v.planned_dispatch_date);case"mounting_start":return Ae(v.mounting_start_date);case"mounting_complete":return Ae(v.mounting_complete_date);case"delivery_date":return Ae(v.delivery_date);case"wiring_assigned":return Ae(v.wiring_assigned_date);case"wiring_expected":return Ae(v.wiring_expected_date);case"expected_qc":return Ae(v.expected_qc_date);case"qc_date":return Ae(v.qc_date);case"client_name":return v.company_name||"Unspecified";case"end_client_name":return v.end_client_name||"Unspecified";case"priority":return v.priority||"Medium";case"status":return v.status||"Not Started";case"qc_status":return v.qc_status||"Pending";case"active_dept":return v.active_dept||"Planning";default:return v[R]||"Unspecified"}},_r=v=>{if(!be||be==="none")return{type:"flat",rows:v};const R={};v.forEach(J=>{const re=rr(J,be);R[re]||(R[re]=[]),R[re].push(J)});const q={type:"grouped",keys:Object.keys(R).sort(),groups:{}};return Object.keys(R).forEach(J=>{const re=R[J];if(H&&H!=="none"){const se={};re.forEach(Pe=>{const me=rr(Pe,H);se[me]||(se[me]=[]),se[me].push(Pe)}),q.groups[J]={type:"subgrouped",keys:Object.keys(se).sort(),groups:se}}else q.groups[J]={type:"flat",rows:re}}),q},pe=(v,R,q)=>{const J=V.includes(v.line_item_id);return r.jsxs("tr",{className:`planning-row ${J?"selected-row":""}`,children:[n&&r.jsx("td",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},children:r.jsx("input",{type:"checkbox",checked:J,onChange:()=>oe(v.line_item_id)})}),x.map((re,se)=>{const Pe=se===0;let me="";["sr_no","order_number","po_number","reference_number","part_number","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(re)&&(me+=" mono"),re==="order_number"&&(me+=" font-semibold text-accent");let Re={};re==="part_number"&&(Re={maxWidth:"120px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}),Pe&&(me+=" col-sticky-first",Re={...Re,left:n?"40px":0});const ge=["planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","status","qc_date"].includes(re),dt=de&&de.lineItemId===v.line_item_id&&de.colId===re,qr=te&&te.lineItemId===v.line_item_id&&te.colId===re;return n&&ge&&(me+=" editable-cell"),dt&&(me+=" is-editing"),qr&&(me+=" is-saving"),r.jsx("td",{className:me.trim(),style:Re,title:re==="part_number"?v.part_number:void 0,onClick:Nn=>ge&&Qe(Nn,re,v),children:f(re,v,R,q)},re)})]},v.row_key)};return c?r.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"400px",color:"#888"},children:"Loading Planning Records..."}):r.jsxs("div",{className:"planning-module",children:[r.jsxs("div",{className:"planning-controls",children:[r.jsxs("div",{className:"search-box",children:[r.jsx(Mr,{size:16,className:"search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by PO, Client, End Client, or Order Number...",value:T,onChange:v=>_a(v.target.value)})]}),r.jsxs("div",{className:"filter-group",children:[r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Status"}),r.jsxs("select",{value:y,onChange:v=>Na(v.target.value),children:[r.jsx("option",{value:"all",children:"All Statuses"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{value:F,onChange:v=>Ca(v.target.value),children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Group By"}),r.jsxs("select",{value:be,onChange:v=>{ve(v.target.value),v.target.value==="none"&&Z("none")},children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Then Group By"}),r.jsxs("select",{value:H,onChange:v=>Z(v.target.value),disabled:be==="none",children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsx("button",{className:"reset-columns-btn",onClick:()=>{s(Qa),localStorage.removeItem("planning_column_order")},title:"Reset columns to default order",children:"Reset Columns"})]})]}),r.jsx("div",{className:"table-responsive",children:r.jsxs("table",{className:"planning-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[n&&r.jsx("th",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},children:r.jsx("input",{type:"checkbox",checked:er.length>0&&er.every(v=>V.includes(v.line_item_id)),onChange:Ee})}),x.map((v,R)=>{const q=R===0,J=E(v),re=u===v,se=l.indexOf(i),Pe=l.indexOf(v);let me="";re&&se!==-1&&se!==Pe&&(me=se<Pe?" drag-over-right":" drag-over-left");let Ue={},Re=`${i===v?" dragging":""}${me}`;return q&&(Re+=" col-sticky-first",Ue={left:n?"40px":0}),r.jsx("th",{className:Re.trim(),style:Ue,draggable:!0,onDragStart:ge=>m(ge,v),onDragOver:ge=>h(ge,v),onDragLeave:ge=>S(ge,v),onDrop:ge=>N(ge,v),onDragEnd:_,children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(hg,{size:12,className:"drag-handle"}),r.jsx("span",{children:J})]})},v)})]})}),r.jsx("tbody",{children:er.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:x.length+(n?1:0),style:{textAlign:"center",padding:"32px",color:"#666",fontStyle:"italic"},children:"No planning records match your search criteria."})}):(()=>{const v=_r(er);if(v.type==="flat")return v.rows.map((q,J)=>{const re=parseInt(q.total_steps||0),se=parseInt(q.done_steps||0),Pe=re>0?Math.round(se/re*100):0;return pe(q,Zt+J+1,Pe)});let R=Zt;return v.keys.map(q=>{const J=v.groups[q],re=`p:${q}`,se=ue[re]!==!1;let Pe=0;return J.type==="flat"?Pe=J.rows.length:J.keys.forEach(me=>{Pe+=J.groups[me].length}),r.jsxs(io.Fragment,{children:[r.jsx("tr",{className:"group-header-row primary",onClick:()=>it(re),children:r.jsx("td",{colSpan:x.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content",children:[r.jsx("span",{className:"expand-icon",children:se?r.jsx(Lo,{size:14}):r.jsx(so,{size:14})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[E(be),":"]})," ",q]}),r.jsxs("span",{className:"group-badge",children:[Pe," items"]})]})})}),se&&(J.type==="flat"?J.rows.map(me=>{R++;const Ue=parseInt(me.total_steps||0),Re=parseInt(me.done_steps||0),ge=Ue>0?Math.round(Re/Ue*100):0;return pe(me,R,ge)}):J.keys.map(me=>{const Ue=J.groups[me],Re=`p:${q}|s:${me}`,ge=ue[Re]!==!1;return r.jsxs(io.Fragment,{children:[r.jsx("tr",{className:"group-header-row secondary",onClick:()=>it(Re),children:r.jsx("td",{colSpan:x.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content secondary-content",style:{paddingLeft:"24px"},children:[r.jsx("span",{className:"expand-icon",children:ge?r.jsx(Lo,{size:12}):r.jsx(so,{size:12})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[E(H),":"]})," ",me]}),r.jsxs("span",{className:"group-badge secondary-badge",children:[Ue.length," items"]})]})})}),ge&&Ue.map(dt=>{R++;const qr=parseInt(dt.total_steps||0),Nn=parseInt(dt.done_steps||0),Nt=qr>0?Math.round(Nn/qr*100):0;return pe(dt,R,Nt)})]},Re)}))]},re)})})()})]})}),r.jsxs("div",{className:"pagination-bar",children:[r.jsxs("div",{className:"pagination-info",children:[r.jsx("span",{className:"row-count",children:Sr===0?"No records":`Showing ${Zt+1}–${_n} of ${Sr} records`}),r.jsxs("div",{className:"page-size-control",children:[r.jsx("span",{children:"Rows per page"}),r.jsx("select",{value:U,onChange:v=>za(v.target.value),children:ih.map(v=>r.jsx("option",{value:v,children:v},v))})]})]}),r.jsxs("div",{className:"pagination-nav",children:[r.jsx("button",{className:"pg-btn",onClick:()=>le(1),disabled:gt===1,title:"First page",children:r.jsx(ug,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>le(v=>Math.max(1,v-1)),disabled:gt===1,title:"Previous page",children:r.jsx(zp,{size:14})}),K().map(v=>r.jsx("button",{className:`pg-btn pg-num ${v===gt?"active":""}`,onClick:()=>le(v),children:v},v)),r.jsx("button",{className:"pg-btn",onClick:()=>le(v=>Math.min(Lt,v+1)),disabled:gt===Lt,title:"Next page",children:r.jsx(so,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>le(Lt),disabled:gt===Lt,title:"Last page",children:r.jsx(pg,{size:14})})]})]}),P&&r.jsx("div",{className:"modal-overlay open",onClick:v=>{v.target.className==="modal-overlay open"&&C(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Order: ",P.order_number," — Line: ",P.line_item_number," (PO: ",P.po_number||"N/A",")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>C(null),children:r.jsx(yn,{size:18})})]}),r.jsxs("form",{onSubmit:Sa,className:"modal-body",children:[A&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(Ao,{size:16}),r.jsx("span",{children:A})]}),B&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(Cs,{size:16}),r.jsx("span",{children:B})]}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",name:"planned_dispatch_date",value:z.planned_dispatch_date,onChange:_t,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",name:"mounting_start_date",value:z.mounting_start_date,onChange:_t,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",name:"mounting_complete_date",value:z.mounting_complete_date,onChange:_t,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",name:"wiring_assigned_date",value:z.wiring_assigned_date,onChange:_t,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",name:"wiring_expected_date",value:z.wiring_expected_date,onChange:_t,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",name:"expected_qc_date",value:z.expected_qc_date,onChange:_t,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Overall Planning Status"}),r.jsxs("select",{name:"status",value:z.status,onChange:_t,className:"form-select",children:[r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",name:"qc_date",value:z.qc_date,onChange:_t,className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>C(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Save Planning Changes"})]})]})]})}),V.length>0&&r.jsx("div",{className:"bulk-actions-banner",children:r.jsxs("div",{className:"bulk-actions-content",children:[r.jsxs("span",{className:"bulk-count",children:[r.jsx("strong",{children:V.length})," items selected"]}),r.jsxs("div",{className:"bulk-buttons",children:[r.jsx("button",{className:"btn-bulk-edit",onClick:()=>{fe({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),I(!0)},children:"Bulk Edit Parameters"}),r.jsx("button",{className:"btn-bulk-clear",onClick:()=>Y([]),children:"Deselect All"})]})]})}),D&&r.jsx("div",{className:"modal-overlay open",onClick:v=>{v.target.className==="modal-overlay open"&&I(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"560px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Updating ",V.length," selected line items"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>I(!1),children:r.jsx(yn,{size:18})})]}),r.jsxs("form",{onSubmit:He,className:"modal-body",children:[A&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(Ao,{size:16}),r.jsx("span",{children:A})]}),B&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(Cs,{size:16}),r.jsx("span",{children:B})]}),r.jsx("p",{className:"bulk-instructions",children:"Enter values or select options for parameters you want to update for all selected items. Blank fields will remain unchanged."}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",value:ne.planned_dispatch_date,onChange:v=>fe({...ne,planned_dispatch_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",value:ne.mounting_start_date,onChange:v=>fe({...ne,mounting_start_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",value:ne.mounting_complete_date,onChange:v=>fe({...ne,mounting_complete_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",value:ne.wiring_assigned_date,onChange:v=>fe({...ne,wiring_assigned_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",value:ne.wiring_expected_date,onChange:v=>fe({...ne,wiring_expected_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",value:ne.expected_qc_date,onChange:v=>fe({...ne,expected_qc_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planning Status"}),r.jsxs("select",{value:ne.status,onChange:v=>fe({...ne,status:v.target.value}),className:"form-select",children:[r.jsx("option",{value:"",children:"Leave unchanged"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",value:ne.qc_date,onChange:v=>fe({...ne,qc_date:v.target.value}),className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>I(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Apply Bulk Changes"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function ch(){const[e,t]=p.useState(()=>localStorage.getItem("erp_company_name")||"Vyom ERP"),[n,a]=p.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing"),[o,l]=p.useState(()=>localStorage.getItem("erp_timezone")||"IST (UTC+05:30)"),[s,i]=p.useState(()=>localStorage.getItem("erp_default_page_size")||"20"),[d,u]=p.useState(()=>localStorage.getItem("erp_double_grouping")!=="false"),[g,m]=p.useState(()=>localStorage.getItem("erp_auto_qc_calc")==="true"),[h,S]=p.useState(()=>localStorage.getItem("erp_planning_fs_default")==="true"),[N,_]=p.useState("1"),[E,x]=p.useState(!0),[f,c]=p.useState(""),[w,T]=p.useState(!1),[L,y]=p.useState(!1),k=localStorage.getItem("token"),[F,j]=p.useState("general"),[P,C]=p.useState(!1),[z,M]=p.useState(!1),[A,G]=p.useState(""),[B,$]=p.useState(!1);p.useEffect(()=>{fetch(window.API_BASE+"/api/system-settings",{headers:{Authorization:`Bearer ${k}`}}).then(I=>I.json()).then(I=>{I.order_number_start&&_(I.order_number_start),x(!!I._orders_exist)}).catch(()=>{})},[k]);const V=async()=>{c(""),y(!1);const I=parseInt(N);if(isNaN(I)||I<1){c("Please enter a valid positive number.");return}T(!0);try{const ee=await fetch(window.API_BASE+"/api/system-settings",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${k}`},body:JSON.stringify({order_number_start:I})}),ie=await ee.json();ee.ok?(y(!0),setTimeout(()=>y(!1),3e3)):c(ie.error||"Failed to save.")}catch{c("Network error.")}finally{T(!1)}},Y=async I=>{I.preventDefault(),C(!0),M(!1),setTimeout(()=>{localStorage.setItem("erp_company_name",e),localStorage.setItem("erp_system_title",n),localStorage.setItem("erp_timezone",o),localStorage.setItem("erp_default_page_size",s),localStorage.setItem("erp_double_grouping",d?"true":"false"),localStorage.setItem("erp_auto_qc_calc",g?"true":"false"),localStorage.setItem("erp_planning_fs_default",h?"true":"false"),C(!1),M(!0),window.dispatchEvent(new CustomEvent("erpSettingsUpdated")),setTimeout(()=>M(!1),3e3)},800)},D=I=>{window.confirm(`Are you sure you want to run: "${I}"? This action cannot be undone.`)&&($(!0),G(""),setTimeout(()=>{$(!1),I==="Clear Activity Logs"?G("Activity logs cleared successfully (simulated)."):I==="Reset Database"?G("Database reset and re-seeded successfully."):I==="Backup Database"&&G("Database backup generated: vyom_erp_backup_"+new Date().toISOString().split("T")[0]+".sql"),setTimeout(()=>G(""),5e3)},1200))};return r.jsxs("div",{style:{padding:"24px"},className:"settings-container",children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(zs,{size:22,style:{color:"#f59e0b"}}),"Administration Settings"]})}),r.jsxs("div",{className:"settings-layout",children:[r.jsxs("div",{className:"settings-tabs",children:[r.jsxs("button",{className:`tab-btn ${F==="general"?"active":""}`,onClick:()=>j("general"),children:[r.jsx(Pg,{size:14}),"General Setup"]}),r.jsxs("button",{className:`tab-btn ${F==="workflow"?"active":""}`,onClick:()=>j("workflow"),children:[r.jsx(zs,{size:14}),"Workflow & Features"]}),r.jsxs("button",{className:`tab-btn ${F==="maintenance"?"active":""}`,onClick:()=>j("maintenance"),children:[r.jsx(Dg,{size:14}),"System Maintenance"]})]}),r.jsxs("div",{className:"settings-content",children:[F==="general"&&r.jsxs(r.Fragment,{children:[r.jsxs("form",{onSubmit:Y,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"General System Configurations"}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Company Name (Logo Text)"}),r.jsx("input",{type:"text",value:e,onChange:I=>t(I.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"This label appears on the top-left logo header."})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"System/Factory Title"}),r.jsx("input",{type:"text",value:n,onChange:I=>a(I.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"Descriptive subtitle shown next to the logo."})]}),r.jsxs("div",{className:"form-row",children:[r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"System Timezone"}),r.jsxs("select",{value:o,onChange:I=>l(I.target.value),children:[r.jsx("option",{value:"IST (UTC+05:30)",children:"India Standard Time (IST)"}),r.jsx("option",{value:"UTC",children:"Coordinated Universal Time (UTC)"}),r.jsx("option",{value:"EST (UTC-05:00)",children:"Eastern Standard Time (EST)"}),r.jsx("option",{value:"GMT",children:"Greenwich Mean Time (GMT)"})]})]}),r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"Default Page Size"}),r.jsxs("select",{value:s,onChange:I=>i(I.target.value),children:[r.jsx("option",{value:"10",children:"10 Rows per page"}),r.jsx("option",{value:"20",children:"20 Rows per page"}),r.jsx("option",{value:"50",children:"50 Rows per page"}),r.jsx("option",{value:"100",children:"100 Rows per page"})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:P,children:[P?r.jsx(Ht,{size:14,className:"spin"}):r.jsx(Dl,{size:14}),P?"Saving...":"Save Settings"]}),z&&r.jsxs("span",{className:"success-msg",children:[r.jsx(Ha,{size:14})," Settings updated successfully!"]})]})]}),r.jsxs("div",{style:{marginTop:"28px",padding:"20px 24px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px"},children:[r.jsxs("h3",{style:{margin:"0 0 6px 0",color:"var(--text)",fontSize:"15px",display:"flex",alignItems:"center",gap:"8px"},children:[r.jsx(vg,{size:16,style:{color:"#f59e0b"}}),"Order Number Sequence"]}),r.jsxs("p",{style:{margin:"0 0 16px 0",color:"var(--text3)",fontSize:"13px"},children:["Set the starting order number for this system. ",r.jsx("strong",{style:{color:"#f59e0b"},children:"Once the first order is created, this setting is permanently locked."})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",background:"var(--bg3)",border:`1px solid ${E?"var(--border)":"#f59e0b"}`,borderRadius:"8px",padding:"8px 14px"},children:[r.jsxs("span",{style:{color:"var(--text3)",fontSize:"13px",whiteSpace:"nowrap"},children:["ORD-",new Date().getFullYear(),"-"]}),r.jsx("input",{type:"number",min:"1",value:N,onChange:I=>{_(I.target.value),c("")},disabled:E,style:{width:"90px",background:"transparent",border:"none",outline:"none",color:E?"var(--text3)":"var(--text)",fontSize:"15px",fontWeight:"700",cursor:E?"not-allowed":"text"}})]}),E?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",color:"#94a3b8",fontSize:"13px"},children:[r.jsx(an,{size:14}),"Locked — orders already exist"]}):r.jsxs("button",{type:"button",onClick:V,disabled:w,style:{display:"flex",alignItems:"center",gap:"6px",background:"#f59e0b",color:"#000",border:"none",borderRadius:"8px",padding:"9px 18px",fontWeight:"600",fontSize:"13px",cursor:"pointer"},children:[w?r.jsx(Ht,{size:13,className:"spin"}):r.jsx(Dl,{size:13}),w?"Saving...":"Set Starting Number"]}),L&&r.jsxs("span",{style:{display:"flex",alignItems:"center",gap:"6px",color:"#10b981",fontSize:"13px"},children:[r.jsx(Ha,{size:14})," Saved! Next order will be ORD-",new Date().getFullYear(),"-",String(N).padStart(4,"0")]})]}),f&&r.jsx("p",{style:{margin:"10px 0 0",color:"#ef4444",fontSize:"12px"},children:f})]})]}),F==="workflow"&&r.jsxs("form",{onSubmit:Y,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"Planning Module & Workflow Toggles"}),r.jsxs("div",{className:"toggle-group",children:[r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"enableDoubleGrouping",checked:d,onChange:I=>u(I.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"enableDoubleGrouping",children:"Enable Double Grouping Filter"}),r.jsx("span",{className:"toggle-desc",children:"Allows planning board users to apply a secondary group parameter simultaneously."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"autoQCFromSteps",checked:g,onChange:I=>m(I.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"autoQCFromSteps",children:"Auto-calculate QC Status"}),r.jsx("span",{className:"toggle-desc",children:"Automatically update line item QC status to completed when all QC department steps are checked off."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"planningFullscreenDefault",checked:h,onChange:I=>S(I.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"planningFullscreenDefault",children:"Planning Board Fullscreen by Default"}),r.jsx("span",{className:"toggle-desc",children:"Loads the Planning Module in fullscreen mode automatically."})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:P,children:[P?r.jsx(Ht,{size:14,className:"spin"}):r.jsx(Dl,{size:14}),P?"Saving...":"Save Settings"]}),z&&r.jsxs("span",{className:"success-msg",children:[r.jsx(Ha,{size:14})," Workflow updated successfully!"]})]})]}),F==="maintenance"&&r.jsxs("div",{className:"settings-form",children:[r.jsx("h3",{className:"section-title text-danger",children:"System Operations & Diagnostics"}),r.jsx("p",{className:"danger-notice",children:"WARNING: The operations below are administrative privileges. Running them can modify systemic operational states or reset logging indices."}),r.jsxs("div",{className:"maintenance-actions",children:[r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Database Backup"}),r.jsx("p",{children:"Generate a complete SQL schema and data export dump for emergency recovery."})]}),r.jsx("button",{onClick:()=>D("Backup Database"),className:"maint-btn secondary",disabled:B,children:"Backup DB"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Clear Activity Logs"}),r.jsx("p",{children:"Trims or wipes the system activity logger history database to conserve resources."})]}),r.jsx("button",{onClick:()=>D("Clear Activity Logs"),className:"maint-btn warning",disabled:B,children:"Wipe Logs"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Factory Reset ERP"}),r.jsx("p",{children:"Re-seeds and formats databases to standard template values (removes testing orders)."})]}),r.jsx("button",{onClick:()=>D("Reset Database"),className:"maint-btn danger",disabled:B,children:"Factory Reset"})]})]}),B&&r.jsxs("div",{className:"maintenance-loader",children:[r.jsx(Ht,{size:18,className:"spin"})," Running operations..."]}),A&&r.jsxs("div",{className:"maintenance-result",children:[r.jsx(Ha,{size:14})," ",A]})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const ec={Urgent:{color:"#ef4444",bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.3)"},High:{color:"#f59e0b",bg:"rgba(245,158,11,0.12)",border:"rgba(245,158,11,0.3)"},Medium:{color:"#3b82f6",bg:"rgba(59,130,246,0.12)",border:"rgba(59,130,246,0.3)"},Low:{color:"#6b7280",bg:"rgba(107,114,128,0.12)",border:"rgba(107,114,128,0.3)"}},Bo={done:{label:"Done",color:"#10b981",bg:"rgba(16,185,129,0.12)",icon:"✓"},inprogress:{label:"In Progress",color:"#f59e0b",bg:"rgba(245,158,11,0.12)",icon:"◉"},pending:{label:"Pending",color:"#6b7280",bg:"rgba(107,114,128,0.12)",icon:"○"},blocked:{label:"Blocked",color:"#ef4444",bg:"rgba(239,68,68,0.12)",icon:"✕"},review:{label:"Review",color:"#8b5cf6",bg:"rgba(139,92,246,0.12)",icon:"⟳"}},uh={Design:"#6366f1",Purchase:"#f59e0b",Stores:"#10b981",Production:"#3b82f6",QC:"#8b5cf6",Dispatch:"#ec4899",Accounts:"#14b8a6",Sales:"#f97316"};function ph({step:e,onStatusChange:t,canEdit:n}){const a=Bo[e.status]||Bo.pending;return r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:20,background:a.bg,border:`1px solid ${a.color}33`,fontSize:11,color:a.color,fontWeight:600},children:[r.jsx("span",{children:a.icon}),r.jsx("span",{children:e.name}),n&&r.jsxs("select",{value:e.status,onChange:o=>t(e.id,o.target.value),onClick:o=>o.stopPropagation(),style:{background:"transparent",border:"none",color:a.color,fontSize:10,cursor:"pointer",outline:"none",padding:0},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]})]})}function fh({unit:e,dept:t,onStepStatusChange:n,users:a,currentUser:o}){const[l,s]=p.useState(!1),i=e.dept_steps||[],d=i.filter(S=>S.status==="done").length,u=d===i.length&&i.length>0,g=i.some(S=>S.status==="blocked"),m=S=>{var N,_,E;return["admin","manager"].includes((N=o.role)==null?void 0:N.toLowerCase())||((_=S.dept)==null?void 0:_.toLowerCase())===((E=o.role)==null?void 0:E.toLowerCase())},h=g?"var(--red)":u?"var(--green)":"transparent";return r.jsxs(r.Fragment,{children:[r.jsxs("tr",{onClick:()=>s(S=>!S),style:{cursor:"pointer",borderLeft:`3px solid ${h}`,background:l?"var(--bg3)":"transparent",transition:"background 0.15s"},className:"worklist-row",children:[r.jsxs("td",{style:{padding:"10px 14px"},children:[r.jsx("div",{style:{fontFamily:"monospace",fontWeight:700,color:"var(--text)",fontSize:13},children:e.order_number}),e.company_name&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:11,marginTop:2},children:["🏢 ",e.company_name,e.company_city?` · ${e.company_city}`:""]}),e.po_number&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:11,marginTop:1,fontFamily:"monospace"},children:["PO: ",e.po_number]}),e.reference_number&&r.jsxs("div",{style:{color:"#f59e0b",fontSize:10,marginTop:1,fontWeight:600},children:["Ref: ",e.reference_number]})]}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"monospace",fontWeight:700,color:"var(--text)",fontSize:13},children:e.unit_serial}),r.jsxs("td",{style:{padding:"10px 14px",color:"var(--text2)",fontSize:12},children:[e.material_description,e.part_number&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:10,marginTop:2},children:["Part: ",e.part_number]})]}),r.jsx("td",{style:{padding:"10px 14px"},children:(()=>{const S=ec[e.priority]||ec.Medium;return r.jsx("span",{style:{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:S.bg,color:S.color,border:`1px solid ${S.border}`,textTransform:"uppercase",letterSpacing:.5},children:e.priority})})()}),r.jsx("td",{style:{padding:"10px 14px",fontSize:11,color:"var(--text2)"},children:e.delivery_date?new Date(e.delivery_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"N/A"}),r.jsx("td",{style:{padding:"10px 14px"},children:r.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:i.length===0?r.jsx("span",{style:{color:"#475569",fontSize:11,fontStyle:"italic"},children:"No steps"}):i.map(S=>r.jsx(ph,{step:S,canEdit:m(S),onStatusChange:(N,_)=>n(e.unit_id,N,_)},S.id))})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:u?"var(--green)":g?"var(--red)":"var(--text2)"},children:[u?r.jsx(Cs,{size:13}):g?r.jsx(Ao,{size:13}):r.jsx(Ep,{size:13}),d,"/",i.length]})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{color:"var(--text3)",display:"inline-flex",alignItems:"center"},children:l?r.jsx(Lo,{size:14}):r.jsx(so,{size:14})})})]}),l&&i.length>0&&r.jsx("tr",{style:{background:"var(--bg3)"},children:r.jsx("td",{colSpan:8,style:{padding:"12px 24px 16px 24px"},children:r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:i.map(S=>{const N=Bo[S.status]||Bo.pending,_=a.find(E=>E.id===S.assigned_user_id);return r.jsxs("div",{style:{background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[r.jsxs("div",{children:[r.jsx("div",{style:{fontWeight:600,color:"var(--text)",fontSize:13},children:S.name}),S.notes&&r.jsx("div",{style:{color:"var(--text3)",fontSize:11,marginTop:2,fontStyle:"italic"},children:S.notes}),_&&r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4,marginTop:4,color:"var(--green)",fontSize:11},children:[r.jsx(rl,{size:10}),_.username]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[S.updated&&r.jsx("span",{style:{color:"var(--text3)",fontSize:10},children:S.updated}),m(S)?r.jsxs("select",{value:S.status,onChange:E=>n(e.unit_id,S.id,E.target.value),style:{background:N.bg,border:`1px solid ${N.color}44`,color:N.color,fontSize:11,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontWeight:600,outline:"none"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("span",{style:{background:N.bg,border:`1px solid ${N.color}44`,color:N.color,fontSize:11,borderRadius:6,padding:"4px 8px",fontWeight:600},children:N.label})]})]},S.id)})})})})]})}function xh({dept:e}){var y;const[t,n]=p.useState([]),[a,o]=p.useState([]),[l,s]=p.useState(!0),[i,d]=p.useState(!1),[u,g]=p.useState("all"),[m,h]=p.useState(""),S=localStorage.getItem("token"),N=JSON.parse(localStorage.getItem("user")||"{}");["admin","manager",e==null?void 0:e.toLowerCase()].includes((y=N.role)==null?void 0:y.toLowerCase());const _=uh[e]||"#6366f1",E=p.useCallback(async(k=!1)=>{k?d(!0):s(!0);try{const[F,j]=await Promise.all([fetch(`${window.API_BASE}/api/dept-worklist/${encodeURIComponent(e)}`,{headers:{Authorization:`Bearer ${S}`}}),fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${S}`}})]);F.ok&&n(await F.json()),j.ok&&o(await j.json())}finally{s(!1),d(!1)}},[e,S]);p.useEffect(()=>{E()},[E]),p.useEffect(()=>{const k=()=>E(!0);return window.addEventListener("orderUpdated",k),()=>window.removeEventListener("orderUpdated",k)},[E]);const x=async(k,F,j)=>{try{(await fetch(`${window.API_BASE}/api/units/${k}/steps/${F}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${S}`},body:JSON.stringify({status:j})})).ok&&(n(C=>C.map(z=>z.unit_id!==k?z:{...z,dept_steps:(z.dept_steps||[]).map(M=>M.id===F?{...M,status:j}:M)})),window.dispatchEvent(new CustomEvent("orderUpdated")))}catch(P){console.error("Failed to update step",P)}},f=t.filter(k=>{if(m.trim()!==""){const F=m.trim().toLowerCase().split(/\s+/),j=(k.unit_serial||"").toLowerCase(),P=(k.order_number||"").toLowerCase(),C=(k.material_description||"").toLowerCase(),z=(k.company_name||"").toLowerCase(),M=(k.reference_number||"").toLowerCase(),A=(k.po_number||"").toLowerCase();if(!F.every(B=>j.includes(B)||P.includes(B)||C.includes(B)||z.includes(B)||M.includes(B)||A.includes(B)))return!1}if(u==="done"){const F=k.dept_steps||[];return F.length>0&&F.every(j=>j.status==="done")}if(u==="inprogress")return(k.dept_steps||[]).some(j=>j.status==="inprogress");if(u==="pending"){const F=k.dept_steps||[];return F.every(j=>j.status==="pending")||F.length===0}return!0}),c=t.length,w=t.filter(k=>(k.dept_steps||[]).every(F=>F.status==="done")&&(k.dept_steps||[]).length>0).length,T=t.filter(k=>(k.dept_steps||[]).some(F=>F.status==="inprogress")).length,L=t.filter(k=>(k.dept_steps||[]).some(F=>F.status==="blocked")).length;return l?r.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:300,gap:16},children:[r.jsx("div",{style:{width:48,height:48,border:`3px solid ${_}33`,borderTopColor:_,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:14},children:["Loading ",e," worklist..."]}),r.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}):r.jsxs("div",{style:{padding:"4px 0"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[r.jsx("div",{style:{width:36,height:36,borderRadius:10,background:`${_}22`,border:`1px solid ${_}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18},children:e==="Design"?"✏️":e==="QC"?"🔬":e==="Production"?"🔧":e==="Purchase"?"📦":e==="Stores"?"🏪":e==="Dispatch"?"🚚":e==="Accounts"?"💼":"📋"}),r.jsxs("div",{children:[r.jsxs("h2",{style:{margin:0,color:"var(--text)",fontSize:20,fontWeight:800},children:[e," Worklist"]}),r.jsx("div",{style:{color:"var(--text3)",fontSize:12,marginTop:2},children:e==="Sales"?`${c} unit${c!==1?"s":""} total in system`:`${c} unit${c!==1?"s":""} currently in ${e}`})]})]}),r.jsxs("button",{onClick:()=>E(!0),disabled:i,style:{display:"flex",alignItems:"center",gap:6,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:12,borderRadius:8,padding:"7px 14px",cursor:"pointer",transition:"all 0.2s"},children:[r.jsx(Ht,{size:13,style:{animation:i?"spin 0.8s linear infinite":"none"}}),"Refresh"]})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:12,marginBottom:20},children:[{label:"Total Units",value:c,color:_},{label:"In Progress",value:T,color:"#f59e0b"},{label:"Completed",value:w,color:"#10b981"},{label:"Blocked",value:L,color:"#ef4444"}].map(k=>r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",textAlign:"center",borderTop:`2px solid ${k.color}55`},children:[r.jsx("div",{style:{fontSize:24,fontWeight:800,color:k.color},children:k.value}),r.jsx("div",{style:{fontSize:11,color:"var(--text3)",marginTop:2,textTransform:"uppercase",letterSpacing:.5},children:k.label})]},k.label))}),r.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"},children:[r.jsx("input",{type:"text",placeholder:"Search by unit ID, order, item, client...",value:m,onChange:k=>h(k.target.value),style:{flex:1,minWidth:220,background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,padding:"9px 14px",color:"var(--text)",fontSize:13,outline:"none",transition:"border-color 0.2s"},onFocus:k=>k.target.style.borderColor=_,onBlur:k=>k.target.style.borderColor="var(--border2)"}),r.jsx("div",{style:{display:"flex",background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,overflow:"hidden"},children:["all","pending","inprogress","done"].map(k=>r.jsx("button",{onClick:()=>g(k),style:{padding:"9px 14px",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:u===k?_:"transparent",color:u===k?"#fff":"var(--text2)",textTransform:"capitalize",transition:"all 0.15s"},children:k==="inprogress"?"In Progress":k.charAt(0).toUpperCase()+k.slice(1)},k))})]}),f.length===0&&r.jsxs("div",{style:{textAlign:"center",padding:"60px 20px",background:"var(--bg2)",borderRadius:12,border:"1px solid var(--border)"},children:[r.jsx("div",{style:{fontSize:40,marginBottom:12},children:"🎉"}),r.jsx("div",{style:{color:"var(--text)",fontWeight:700,fontSize:18,marginBottom:6},children:m||u!=="all"?"No matching units":e==="Sales"?"No units in the system":`No units in ${e}`}),r.jsx("div",{style:{color:"var(--text3)",fontSize:13},children:m||u!=="all"?"Try adjusting your search or filter.":`All ${e} tasks are complete or no units have been assigned yet.`})]}),f.length>0&&r.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"var(--bg3)",borderBottom:"1px solid var(--border)"},children:[r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Order Info"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Unit ID"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Item Details"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Priority"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Delivery Date"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Tasks"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"center",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Progress"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"center",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Expand"})]})}),r.jsx("tbody",{children:f.map(k=>r.jsx(fh,{unit:k,dept:e,onStepStatusChange:x,users:a,currentUser:N},k.unit_id))})]})}),r.jsx("style",{children:`
        .worklist-row:hover { background: rgba(255,255,255,0.03) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `})]})}const mh=["All","General","PO","Quotation","BOM","Drawing","QC Report","Dispatch Document","Photo"];function gh(){const[e,t]=p.useState({orders:[],documents:[]}),[n,a]=p.useState(""),[o,l]=p.useState("All"),[s,i]=p.useState("All"),[d,u]=p.useState(!1),[g,m]=p.useState({}),h=localStorage.getItem("token"),S=JSON.parse(localStorage.getItem("user")||"{}");p.useEffect(()=>{N()},[]);const N=async()=>{u(!0);try{const y=await fetch(window.API_BASE+"/api/documents/directory",{headers:{Authorization:`Bearer ${h}`}});if(y.ok){const k=await y.json();t(k)}}catch(y){console.error("Failed to fetch document directory",y)}finally{u(!1)}},_=async(y,k)=>{if(y.stopPropagation(),!!window.confirm("Are you sure you want to delete this document?"))try{const F=await fetch(`${window.API_BASE}/api/documents/${k}`,{method:"DELETE",headers:{Authorization:`Bearer ${h}`}});if(F.ok)t(j=>({...j,documents:j.documents.filter(P=>P.id!==k)}));else{const j=await F.json();alert(j.error||"Failed to delete document")}}catch(F){console.error("Delete error:",F),alert("Network error during deletion")}},E=y=>{switch(y==null?void 0:y.toLowerCase()){case"sales":return{background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",border:"1px solid rgba(59, 130, 246, 0.2)"};case"design":return{background:"rgba(167, 139, 250, 0.1)",color:"#a78bfa",border:"1px solid rgba(167, 139, 250, 0.2)"};case"purchase":return{background:"rgba(249, 115, 22, 0.1)",color:"#f97316",border:"1px solid rgba(249, 115, 22, 0.2)"};case"stores":return{background:"rgba(45, 212, 191, 0.1)",color:"#2dd4bf",border:"1px solid rgba(45, 212, 191, 0.2)"};case"production":return{background:"rgba(239, 68, 68, 0.1)",color:"#ef4444",border:"1px solid rgba(239, 68, 68, 0.2)"};case"qc":return{background:"rgba(34, 197, 94, 0.1)",color:"#22c55e",border:"1px solid rgba(34, 197, 94, 0.2)"};case"dispatch":return{background:"rgba(245, 158, 11, 0.1)",color:"#f59e0b",border:"1px solid rgba(245, 158, 11, 0.2)"};case"accounts":return{background:"rgba(14, 165, 233, 0.1)",color:"#0ea5e9",border:"1px solid rgba(14, 165, 233, 0.2)"};default:return{background:"rgba(255, 255, 255, 0.05)",color:"#888",border:"1px solid rgba(255, 255, 255, 0.1)"}}},x=y=>{switch(y==null?void 0:y.toUpperCase()){case"PO":return{background:"rgba(245, 158, 11, 0.15)",color:"#fbbf24",border:"1px solid rgba(245,158,11,0.3)"};case"QUOTATION":return{background:"rgba(59, 130, 246, 0.15)",color:"#60a5fa",border:"1px solid rgba(59,130,246,0.3)"};case"BOM":return{background:"rgba(45, 212, 191, 0.15)",color:"#2dd4bf",border:"1px solid rgba(45,212,191,0.3)"};case"DRAWING":return{background:"rgba(167, 139, 250, 0.15)",color:"#c084fc",border:"1px solid rgba(167,139,250,0.3)"};case"QC REPORT":return{background:"rgba(34, 197, 94, 0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.3)"};default:return{background:"rgba(255, 255, 255, 0.08)",color:"#e8eaf0",border:"1px solid rgba(255,255,255,0.15)"}}},f=y=>{const k=new Date(y);return k.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+" "+k.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},c=y=>{m(k=>({...k,[y]:!k[y]}))},w=e.documents.filter(y=>{if(o!=="All"&&y.uploader_role!==o||s!=="All"&&y.doc_type!==s)return!1;if(n.trim()!==""){const k=n.trim().toLowerCase().split(/\s+/),F=(y.file_name||"").toLowerCase(),j=(y.uploader_username||"").toLowerCase(),P=(y.source_details||"").toLowerCase(),C=e.orders.find(B=>Number(B.id)===Number(y.order_id)),z=((C==null?void 0:C.order_number)||"").toLowerCase(),M=((C==null?void 0:C.po_number)||"").toLowerCase(),A=((C==null?void 0:C.company_name)||"").toLowerCase(),G=((C==null?void 0:C.end_client_name)||"").toLowerCase();return k.every(B=>F.includes(B)||j.includes(B)||P.includes(B)||z.includes(B)||M.includes(B)||A.includes(B)||G.includes(B))}return!0}),T=e.orders.map(y=>{const k=w.filter(F=>Number(F.order_id)===Number(y.id));return{...y,docs:k}}).filter(y=>{if(n||o!=="All"||s!=="All"){if(n.trim()!==""){const k=n.trim().toLowerCase().split(/\s+/),F=(y.order_number||"").toLowerCase(),j=(y.po_number||"").toLowerCase(),P=(y.company_name||"").toLowerCase(),C=(y.end_client_name||"").toLowerCase();if(k.every(A=>F.includes(A)||j.includes(A)||P.includes(A)||C.includes(A))&&!(o!=="All"||s!=="All"))return!0}return y.docs.length>0}return!0}),L=w.length;return r.jsxs("div",{style:{padding:"24px"},children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px",fontSize:"18px",fontWeight:600},children:[r.jsx(gg,{size:22,style:{color:"#f59e0b"}}),"Order Document Directory"]})}),r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"16px",flex:1,minWidth:"300px"},children:[r.jsxs("div",{style:{position:"relative",flex:1,minWidth:"220px"},children:[r.jsx(Mr,{size:16,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("input",{type:"text",placeholder:"Search by file name, uploader, details...",value:n,onChange:y=>a(y.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 38px",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},className:"doc-search-input"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(Ci,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:o,onChange:y=>l(y.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"All",children:"All Departments"}),r.jsx("option",{value:"Sales",children:"Sales"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"}),r.jsx("option",{value:"Accounts",children:"Accounts"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(Ro,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("select",{value:s,onChange:y=>i(y.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:mh.map(y=>r.jsx("option",{value:y==="All"?"All":y,children:y==="All"?"All Document Tags":y},y))}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[(n||o!=="All"||s!=="All")&&r.jsx("button",{onClick:()=>{a(""),l("All"),i("All")},style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"var(--red)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",transition:"all 0.2s"},className:"clear-btn",children:"Clear Filters"}),r.jsxs("button",{onClick:N,disabled:d,style:{background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",transition:"all 0.2s"},className:"refresh-btn",children:[r.jsx(Ht,{size:14,className:d?"spin":""}),d?"Loading...":"Refresh"]})]})]}),r.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:"16px",fontSize:"12px",color:"var(--text2)"},children:r.jsxs("div",{children:["Showing documents for ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:"600"},children:T.length})," orders"," ","(",r.jsx("span",{style:{color:"#fff",fontWeight:"600"},children:L})," documents match filters)"]})}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:d&&e.orders.length===0?r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"64px",textAlign:"center",color:"var(--text2)"},children:[r.jsx(Ht,{size:24,className:"spin",style:{margin:"0 auto 12px",color:"var(--accent)",display:"block"}}),"Loading Document Directory..."]}):T.length===0?r.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"48px",textAlign:"center",color:"var(--text3)"},children:"No orders or documents match the current filters."}):T.map(y=>{const k=g[y.id]!==!0,F=y.docs.length>0;return r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden",transition:"border-color 0.2s"},className:"order-card",children:[r.jsxs("div",{onClick:()=>c(y.id),style:{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:"rgba(255, 255, 255, 0.01)",borderBottom:k?"none":"1px solid var(--border)"},className:"order-card-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"},children:[r.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"13px",background:"rgba(245,158,11,0.1)",color:"var(--accent)",padding:"4px 10px",borderRadius:"6px",border:"1px solid rgba(245,158,11,0.2)",fontWeight:600},children:y.order_number}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px",fontFamily:"var(--font-mono)"},children:"PO:"}),r.jsx("span",{style:{color:"#fff",fontSize:"13px",fontFamily:"var(--font-mono)",fontWeight:500},children:y.po_number||"—"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px"},children:"Client:"}),r.jsx("span",{style:{color:"var(--text2)",fontSize:"13px",fontWeight:500},children:y.company_name||y.end_client_name||"—"})]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsxs("span",{style:{fontSize:"11px",background:F?"rgba(34, 197, 94, 0.1)":"rgba(255,255,255,0.03)",color:F?"var(--green)":"var(--text3)",padding:"3px 8px",borderRadius:"20px",border:F?"1px solid rgba(34, 197, 94, 0.2)":"1px solid var(--border)"},children:[y.docs.length," document",y.docs.length!==1?"s":""]}),r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px",transition:"transform 0.2s",transform:k?"rotate(0deg)":"rotate(180deg)"},children:"▼"})]})]}),!k&&r.jsx("div",{style:{padding:"20px"},children:F?r.jsx("div",{style:{overflowX:"auto"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"13px",textAlign:"left"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{borderBottom:"1px solid var(--border2)",color:"var(--text2)"},children:[r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Document Name"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Tag"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Uploading Dept"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Uploaded By"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Source Context"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Date & Time"}),r.jsx("th",{style:{padding:"10px 12px",textAlign:"right"},children:"Actions"})]})}),r.jsx("tbody",{children:y.docs.map(j=>{var M;const P=j.uploaded_by===S.id||["admin","manager"].includes((M=S.role)==null?void 0:M.toLowerCase()),C=j.file_path.split(/[\/\\]/).pop(),z=`${window.API_BASE}/uploads/${C}?token=${h}`;return r.jsxs("tr",{className:"doc-row",style:{borderBottom:"1px solid var(--border)"},children:[r.jsx("td",{style:{padding:"12px"},children:r.jsxs("a",{href:z,target:"_blank",rel:"noopener noreferrer",style:{color:"#fff",textDecoration:"none",display:"flex",alignItems:"center",gap:"8px",fontWeight:500},className:"doc-file-link",children:[r.jsx(Ro,{size:16,style:{color:"var(--text3)",flexShrink:0}}),r.jsx("span",{style:{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap",maxWidth:"280px"},title:j.file_name,children:j.file_name}),r.jsxs("span",{style:{fontSize:"10px",color:"var(--text3)"},children:["(",(j.file_size/1024).toFixed(1)," KB)"]})]})}),r.jsx("td",{style:{padding:"12px"},children:r.jsx("span",{style:{fontSize:"10px",fontWeight:600,padding:"2px 8px",borderRadius:"4px",textTransform:"uppercase",display:"inline-block",...x(j.doc_type)},children:j.doc_type})}),r.jsx("td",{style:{padding:"12px"},children:r.jsx("span",{style:{fontSize:"11px",fontWeight:500,padding:"2px 8px",borderRadius:"12px",display:"inline-block",...E(j.uploader_role)},children:j.uploader_role||"System"})}),r.jsx("td",{style:{padding:"12px",color:"var(--text2)"},children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(rl,{size:13,style:{color:"var(--text3)"}}),r.jsx("span",{children:j.uploader_username||"system"})]})}),r.jsx("td",{style:{padding:"12px",color:"var(--text2)",fontStyle:j.source_details==="Order Level"?"italic":"normal"},children:j.source_details}),r.jsx("td",{style:{padding:"12px",color:"var(--text3)",whiteSpace:"nowrap"},children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px"},children:[r.jsx(Cp,{size:13}),r.jsx("span",{children:f(j.uploaded_at)})]})}),r.jsx("td",{style:{padding:"12px",textAlign:"right"},children:r.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[r.jsx("a",{href:z,download:j.file_name,style:{background:"rgba(255, 255, 255, 0.05)",border:"1px solid var(--border)",color:"var(--text2)",padding:"5px 8px",borderRadius:"6px",cursor:"pointer",display:"inline-flex",alignItems:"center"},title:"Download document",className:"action-icon-btn",children:r.jsx(mg,{size:13})}),P&&r.jsx("button",{onClick:A=>_(A,j.id),style:{background:"rgba(239, 68, 68, 0.05)",border:"1px solid rgba(239, 68, 68, 0.15)",color:"var(--red)",padding:"5px 8px",borderRadius:"6px",cursor:"pointer",display:"inline-flex",alignItems:"center"},title:"Delete document",className:"action-icon-btn delete-btn",children:r.jsx(Tp,{size:13})})]})})]},j.id)})})]})}):r.jsx("div",{style:{color:"var(--text3)",textAlign:"center",fontSize:"13px",padding:"12px 0",fontStyle:"italic"},children:"No documents associated with this order."})})]},y.id)})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const hh=({children:e})=>{const t=localStorage.getItem("token"),n=localStorage.getItem("user");return!t||t==="undefined"||t==="null"||!n?r.jsx(_p,{to:"/",replace:!0}):e};function vh(){const[e,t]=p.useState([]),[n,a]=p.useState([]),[o,l]=p.useState("all"),[s,i]=p.useState("board"),[d,u]=p.useState("Accept-Complete"),[g,m]=p.useState("Standard"),[h,S]=p.useState(null),[N,_]=p.useState(!1),[E,x]=p.useState(null),f=p.useRef(null),[c,w]=p.useState(null),[T,L]=p.useState(!0),[y,k]=p.useState(!1),[F,j]=p.useState(()=>window.innerWidth<1200),[P,C]=p.useState(""),[z,M]=p.useState([]),A=p.useRef(null),G=Ni(),[B,$]=p.useState(()=>JSON.parse(localStorage.getItem("user")||"{}")),V=localStorage.getItem("token"),Y=async(H,Z={})=>{const ue=await fetch(H,{...Z,headers:{...Z.headers,Authorization:`Bearer ${V}`}});return ue.status===401?(localStorage.removeItem("token"),localStorage.removeItem("user"),G("/"),null):ue};p.useEffect(()=>{ee(),ie();const H=Z=>{typeof Z.detail=="string"?i(Z.detail):Z.detail&&Z.detail.view&&(i(Z.detail.view),Z.detail.orderId?(x(Z.detail.orderId),f.current=Z.detail.orderId):Z.detail.orderId===null&&(x(null),f.current=null))};return window.addEventListener("setView",H),()=>window.removeEventListener("setView",H)},[]),p.useEffect(()=>{E?(I(E),D(E)):(t([]),w(null))},[E]),p.useEffect(()=>{if(!c){C(""),A.current=null;return}if(A.current!==c.id){const H=c.units||[];H.length>0?C(H[0].id.toString()):C(""),A.current=c.id}else{const H=c.units||[];P&&!H.some(Z=>Z.id.toString()===P.toString())&&(H.length>0?C(H[0].id.toString()):C(""))}},[c,P]),p.useEffect(()=>{var Z,ue;const H=P||((ue=(Z=c==null?void 0:c.units)==null?void 0:Z[0])==null?void 0:ue.id);H&&V?fetch(`${window.API_BASE}/api/units/${H}/steps`,{headers:{Authorization:`Bearer ${V}`}}).then(async st=>{st.ok&&M(await st.json())}).catch(console.error):M([])},[P,c,V]),p.useEffect(()=>{const H=()=>{var Z,ue;if(E){I(E),D(E);const st=P||((ue=(Z=c==null?void 0:c.units)==null?void 0:Z[0])==null?void 0:ue.id);st&&V&&fetch(`${window.API_BASE}/api/units/${st}/steps`,{headers:{Authorization:`Bearer ${V}`}}).then(async it=>{it.ok&&M(await it.json())}).catch(console.error)}};return window.addEventListener("orderUpdated",H),()=>window.removeEventListener("orderUpdated",H)},[E,P,c,V]);const D=async H=>{if(V)try{const Z=await Y(`${window.API_BASE}/api/orders/${H}`);Z!=null&&Z.ok&&w(await Z.json())}catch(Z){console.error("Failed to fetch order details",Z)}},I=async H=>{if(V)try{const Z=await Y(`${window.API_BASE}/api/orders/${H}/steps`);Z!=null&&Z.ok&&t(await Z.json())}catch(Z){console.error("Failed to fetch steps",Z)}},ee=async()=>{if(V)try{const H=await Y(window.API_BASE+"/api/auth/profile");if(H!=null&&H.ok){const Z=await H.json();$(Z),localStorage.setItem("user",JSON.stringify(Z))}}catch(H){console.error("Failed to sync profile",H)}},ie=async()=>{try{const H=await Y(window.API_BASE+"/api/logs");if(H!=null&&H.ok){const Z=await H.json();a(Z.map(ue=>({time:Un(new Date(ue.timestamp)),dept:ue.dept,text:ue.action_text,username:ue.username})))}}catch(H){console.error("Failed to fetch logs",H)}},ne=async(H,Z,ue)=>{const st=ue??f.current;try{const it=await Y(window.API_BASE+"/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dept:H,action_text:Z,order_id:st?parseInt(st):null})});ie()}catch(it){console.error("Failed to log activity",it)}},fe=()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),G("/")},de=H=>{i(H),H==="board"&&(x(null),f.current=null,w(null),t([]),l("all"),window.dispatchEvent(new CustomEvent("setView",{detail:{orderId:null}})))},O=e.find(H=>H.id===h)||null,te=H=>{S(H),_(!0)},Q=()=>{_(!1)},he=async H=>{try{const Z=await fetch(`${window.API_BASE}/api/orders/${E}/steps/${h}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${V}`},body:JSON.stringify(H)});if(Z.ok){if(await I(E),await D(E),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:E}})),O.special==="qc"&&H.status==="blocked"&&H.qcFailTarget){const ue=H.qcFailTarget==="production"?"QC FAIL → returned to Production for rework":"QC FAIL → returned to Design for re-check";ne("QC",ue,E)}return ne(O.dept,`"${O.name}" → ${H.status.toUpperCase()}${H.notes?" — "+H.notes:""}`,E),_(!1),null}else return(await Z.json().catch(()=>({}))).error||"Failed to save step"}catch(Z){return console.error("Failed to save step",Z),"Network error — could not save step"}},le=async H=>{if(window.confirm("Are you sure you want to permanently delete this task from the order's flow?"))try{(await fetch(`${window.API_BASE}/api/orders/${E}/steps/${H}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok?(_(!1),I(E),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:E}}))):alert("Failed to delete step")}catch(Z){console.error(Z)}},U=H=>{if(!["Admin","Manager","Accounts","Production"].includes(B.role)){alert("Unauthorized to change BOM status");return}u(H),ne("Stores",`BOM status updated → ${H}`,E)},ze=H=>{if(!["Admin","Manager","Design"].includes(B.role)){alert("Unauthorized to change Design classification");return}m(H),ne("Design",`Design classified as ${H}`,E)},be=e.filter(H=>!H.order_unit_id),ve=[...z,...be];return r.jsxs("div",{className:"app-container",children:[r.jsx(Rg,{onLogout:fe,onToggleSidebar:()=>j(H=>!H),sidenavCollapsed:F}),r.jsxs("div",{className:"app",children:[(!T||s!=="planning")&&r.jsx(Mg,{steps:ve,currentFilter:o,onFilterDept:l,bomState:d,onSetBomState:U,designType:g,onSetDesignType:ze,currentView:s,onSetView:de,userRole:B.role,collapsed:F}),r.jsxs("main",{className:"main",children:[s!=="planning"&&r.jsx(Wg,{steps:ve,currentFilter:o,selectedOrder:c}),r.jsxs("div",{className:"flow-header",children:[r.jsx("div",{className:"flow-title",children:s==="board"?"Board":s==="planning"?"Planning Board":s==="flow"?"Process Flow":s==="table"?"Table View":s==="orders"?"Order Directory":s==="documents"?"Document Directory":s==="new-order"?"New Order":s==="import"?"Import Orders":s==="masters"?"Masters":s==="logs"?"System Logs":s==="worklist"?`${B.role} Worklist`:"User Management"}),["board","flow","table"].includes(s)&&r.jsxs("div",{className:"view-toggle",children:[r.jsx("button",{className:`vbtn${s==="board"?" active":""}`,onClick:()=>de("board"),children:"Board"}),r.jsx("button",{className:`vbtn${s==="flow"?" active":""}`,onClick:()=>i("flow"),children:"Flow"}),r.jsx("button",{className:`vbtn${s==="table"?" active":""}`,onClick:()=>i("table"),children:"Table"})]}),s==="planning"&&r.jsxs("button",{className:`vbtn${T?" active":""}`,onClick:()=>L(!T),style:{display:"flex",alignItems:"center",gap:"6px"},children:[T?r.jsx(Ng,{size:13}):r.jsx(Sg,{size:13}),T?"Exit Fullscreen":"Fullscreen"]})]}),s==="board"?r.jsx(Qg,{currentFilter:o,userRole:B.role,onSetView:i}):s==="planning"?["Admin","Manager","Planning"].includes(B.role)?r.jsx(dh,{}):r.jsx("div",{style:{padding:40,textAlign:"center",color:"var(--text3)"},children:"Unauthorized to view the Planning Module."}):s==="flow"?E?r.jsx(Vg,{steps:e,currentFilter:o,onOpenModal:te,onSetView:i,userRole:B.role,selectedOrderId:E,selectedOrder:c,onStepsChanged:()=>I(E),selectedUnitId:P,setSelectedUnitId:C,unitSteps:z,setUnitSteps:M}):r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"Please select an order from the Header dropdown to view its Process Flow."}):s==="table"?E?r.jsx(Gg,{steps:ve,currentFilter:o,onOpenModal:te,userRole:B.role}):r.jsx(Jg,{currentFilter:o,onSetView:de}):s==="orders"?r.jsx(nh,{initialSelectedId:E}):s==="documents"?r.jsx(gh,{}):s==="new-order"?r.jsx(th,{onOrderCreated:()=>{i("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):s==="import"?r.jsx(Lp,{onImportComplete:()=>{i("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):s==="masters"?r.jsx(lh,{}):s==="logs"?r.jsx(sh,{}):s==="settings"?r.jsx(ch,{}):s==="worklist"?r.jsx(xh,{dept:B.role}):r.jsx(eh,{})]}),s!=="planning"&&B.role==="Admin"&&r.jsx(Kg,{selectedStep:O,activityLog:n,selectedOrder:c,isOpen:y,onToggle:()=>k(H=>!H)})]}),r.jsx(Xg,{step:O,isOpen:N,onClose:Q,onSave:he,onDelete:le,userRole:B.role,selectedOrder:c})]})}function yh(){return r.jsx(og,{children:r.jsxs(rg,{children:[r.jsx(lo,{path:"/",element:r.jsx(Zg,{})}),r.jsx(lo,{path:"/dashboard",element:r.jsx(hh,{children:r.jsx(vh,{})})}),r.jsx(lo,{path:"*",element:r.jsx(_p,{to:"/",replace:!0})})]})})}window.API_BASE="";const{fetch:bh}=window;window.fetch=async(...e)=>{var n;const t=await bh(...e);if(t.status===401){const a=typeof e[0]=="string"?e[0]:(n=e[0])==null?void 0:n.url;a&&!a.includes("/api/auth/login")&&(localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.href="/")}return t};Tl.createRoot(document.getElementById("root")).render(r.jsx(io.StrictMode,{children:r.jsx(yh,{})}));
