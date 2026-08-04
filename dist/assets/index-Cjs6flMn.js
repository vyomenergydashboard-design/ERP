function Op(e,t){for(var n=0;n<t.length;n++){const a=t[n];if(typeof a!="string"&&!Array.isArray(a)){for(const o in a)if(o!=="default"&&!(o in e)){const l=Object.getOwnPropertyDescriptor(a,o);l&&Object.defineProperty(e,o,l.get?l:{enumerable:!0,get:()=>a[o]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const s of l.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function a(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}})();function Bp(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var rc={exports:{}},Mo={},nc={exports:{}},de={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ya=Symbol.for("react.element"),Mp=Symbol.for("react.portal"),$p=Symbol.for("react.fragment"),Up=Symbol.for("react.strict_mode"),Fp=Symbol.for("react.profiler"),Wp=Symbol.for("react.provider"),qp=Symbol.for("react.context"),Vp=Symbol.for("react.forward_ref"),Hp=Symbol.for("react.suspense"),Qp=Symbol.for("react.memo"),Yp=Symbol.for("react.lazy"),Ei=Symbol.iterator;function Gp(e){return e===null||typeof e!="object"?null:(e=Ei&&e[Ei]||e["@@iterator"],typeof e=="function"?e:null)}var ac={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},oc=Object.assign,lc={};function yn(e,t,n){this.props=e,this.context=t,this.refs=lc,this.updater=n||ac}yn.prototype.isReactComponent={};yn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};yn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function sc(){}sc.prototype=yn.prototype;function Ds(e,t,n){this.props=e,this.context=t,this.refs=lc,this.updater=n||ac}var Ps=Ds.prototype=new sc;Ps.constructor=Ds;oc(Ps,yn.prototype);Ps.isPureReactComponent=!0;var Di=Array.isArray,ic=Object.prototype.hasOwnProperty,Ts={current:null},dc={key:!0,ref:!0,__self:!0,__source:!0};function cc(e,t,n){var a,o={},l=null,s=null;if(t!=null)for(a in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(l=""+t.key),t)ic.call(t,a)&&!dc.hasOwnProperty(a)&&(o[a]=t[a]);var i=arguments.length-2;if(i===1)o.children=n;else if(1<i){for(var d=Array(i),u=0;u<i;u++)d[u]=arguments[u+2];o.children=d}if(e&&e.defaultProps)for(a in i=e.defaultProps,i)o[a]===void 0&&(o[a]=i[a]);return{$$typeof:ya,type:e,key:l,ref:s,props:o,_owner:Ts.current}}function Jp(e,t){return{$$typeof:ya,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Ls(e){return typeof e=="object"&&e!==null&&e.$$typeof===ya}function Kp(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Pi=/\/+/g;function nl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Kp(""+e.key):t.toString(36)}function Ga(e,t,n,a,o){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(l){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case ya:case Mp:s=!0}}if(s)return s=e,o=o(s),e=a===""?"."+nl(s,0):a,Di(o)?(n="",e!=null&&(n=e.replace(Pi,"$&/")+"/"),Ga(o,t,n,"",function(u){return u})):o!=null&&(Ls(o)&&(o=Jp(o,n+(!o.key||s&&s.key===o.key?"":(""+o.key).replace(Pi,"$&/")+"/")+e)),t.push(o)),1;if(s=0,a=a===""?".":a+":",Di(e))for(var i=0;i<e.length;i++){l=e[i];var d=a+nl(l,i);s+=Ga(l,t,n,d,o)}else if(d=Gp(e),typeof d=="function")for(e=d.call(e),i=0;!(l=e.next()).done;)l=l.value,d=a+nl(l,i++),s+=Ga(l,t,n,d,o);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function Pa(e,t,n){if(e==null)return e;var a=[],o=0;return Ga(e,a,"","",function(l){return t.call(n,l,o++)}),a}function Xp(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var et={current:null},Ja={transition:null},Zp={ReactCurrentDispatcher:et,ReactCurrentBatchConfig:Ja,ReactCurrentOwner:Ts};function uc(){throw Error("act(...) is not supported in production builds of React.")}de.Children={map:Pa,forEach:function(e,t,n){Pa(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Pa(e,function(){t++}),t},toArray:function(e){return Pa(e,function(t){return t})||[]},only:function(e){if(!Ls(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};de.Component=yn;de.Fragment=$p;de.Profiler=Fp;de.PureComponent=Ds;de.StrictMode=Up;de.Suspense=Hp;de.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Zp;de.act=uc;de.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=oc({},e.props),o=e.key,l=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,s=Ts.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(d in t)ic.call(t,d)&&!dc.hasOwnProperty(d)&&(a[d]=t[d]===void 0&&i!==void 0?i[d]:t[d])}var d=arguments.length-2;if(d===1)a.children=n;else if(1<d){i=Array(d);for(var u=0;u<d;u++)i[u]=arguments[u+2];a.children=i}return{$$typeof:ya,type:e.type,key:o,ref:l,props:a,_owner:s}};de.createContext=function(e){return e={$$typeof:qp,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Wp,_context:e},e.Consumer=e};de.createElement=cc;de.createFactory=function(e){var t=cc.bind(null,e);return t.type=e,t};de.createRef=function(){return{current:null}};de.forwardRef=function(e){return{$$typeof:Vp,render:e}};de.isValidElement=Ls;de.lazy=function(e){return{$$typeof:Yp,_payload:{_status:-1,_result:e},_init:Xp}};de.memo=function(e,t){return{$$typeof:Qp,type:e,compare:t===void 0?null:t}};de.startTransition=function(e){var t=Ja.transition;Ja.transition={};try{e()}finally{Ja.transition=t}};de.unstable_act=uc;de.useCallback=function(e,t){return et.current.useCallback(e,t)};de.useContext=function(e){return et.current.useContext(e)};de.useDebugValue=function(){};de.useDeferredValue=function(e){return et.current.useDeferredValue(e)};de.useEffect=function(e,t){return et.current.useEffect(e,t)};de.useId=function(){return et.current.useId()};de.useImperativeHandle=function(e,t,n){return et.current.useImperativeHandle(e,t,n)};de.useInsertionEffect=function(e,t){return et.current.useInsertionEffect(e,t)};de.useLayoutEffect=function(e,t){return et.current.useLayoutEffect(e,t)};de.useMemo=function(e,t){return et.current.useMemo(e,t)};de.useReducer=function(e,t,n){return et.current.useReducer(e,t,n)};de.useRef=function(e){return et.current.useRef(e)};de.useState=function(e){return et.current.useState(e)};de.useSyncExternalStore=function(e,t,n){return et.current.useSyncExternalStore(e,t,n)};de.useTransition=function(){return et.current.useTransition()};de.version="18.3.1";nc.exports=de;var p=nc.exports;const qn=Bp(p),ef=Op({__proto__:null,default:qn},[p]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tf=p,rf=Symbol.for("react.element"),nf=Symbol.for("react.fragment"),af=Object.prototype.hasOwnProperty,of=tf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,lf={key:!0,ref:!0,__self:!0,__source:!0};function pc(e,t,n){var a,o={},l=null,s=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(s=t.ref);for(a in t)af.call(t,a)&&!lf.hasOwnProperty(a)&&(o[a]=t[a]);if(e&&e.defaultProps)for(a in t=e.defaultProps,t)o[a]===void 0&&(o[a]=t[a]);return{$$typeof:rf,type:e,key:l,ref:s,props:o,_owner:of.current}}Mo.Fragment=nf;Mo.jsx=pc;Mo.jsxs=pc;rc.exports=Mo;var r=rc.exports,Ll={},fc={exports:{}},mt={},mc={exports:{}},xc={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(O,K){var Y=O.length;O.push(K);e:for(;0<Y;){var E=Y-1>>>1,$=O[E];if(0<o($,K))O[E]=K,O[Y]=$,Y=E;else break e}}function n(O){return O.length===0?null:O[0]}function a(O){if(O.length===0)return null;var K=O[0],Y=O.pop();if(Y!==K){O[0]=Y;e:for(var E=0,$=O.length,Z=$>>>1;E<Z;){var se=2*(E+1)-1,xe=O[se],oe=se+1,ve=O[oe];if(0>o(xe,Y))oe<$&&0>o(ve,xe)?(O[E]=ve,O[oe]=Y,E=oe):(O[E]=xe,O[se]=Y,E=se);else if(oe<$&&0>o(ve,Y))O[E]=ve,O[oe]=Y,E=oe;else break e}}return K}function o(O,K){var Y=O.sortIndex-K.sortIndex;return Y!==0?Y:O.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;e.unstable_now=function(){return l.now()}}else{var s=Date,i=s.now();e.unstable_now=function(){return s.now()-i}}var d=[],u=[],h=1,m=null,y=3,w=!1,_=!1,S=!1,z=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,f=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function c(O){for(var K=n(u);K!==null;){if(K.callback===null)a(u);else if(K.startTime<=O)a(u),K.sortIndex=K.expirationTime,t(d,K);else break;K=n(u)}}function k(O){if(S=!1,c(O),!_)if(n(d)!==null)_=!0,V(I);else{var K=n(u);K!==null&&U(k,K.startTime-O)}}function I(O,K){_=!1,S&&(S=!1,x(L),L=-1),w=!0;var Y=y;try{for(c(K),m=n(d);m!==null&&(!(m.expirationTime>K)||O&&!T());){var E=m.callback;if(typeof E=="function"){m.callback=null,y=m.priorityLevel;var $=E(m.expirationTime<=K);K=e.unstable_now(),typeof $=="function"?m.callback=$:m===n(d)&&a(d),c(K)}else a(d);m=n(d)}if(m!==null)var Z=!0;else{var se=n(u);se!==null&&U(k,se.startTime-K),Z=!1}return Z}finally{m=null,y=Y,w=!1}}var D=!1,C=null,L=-1,P=5,g=-1;function T(){return!(e.unstable_now()-g<P)}function j(){if(C!==null){var O=e.unstable_now();g=O;var K=!0;try{K=C(!0,O)}finally{K?N():(D=!1,C=null)}}else D=!1}var N;if(typeof f=="function")N=function(){f(j)};else if(typeof MessageChannel<"u"){var M=new MessageChannel,A=M.port2;M.port1.onmessage=j,N=function(){A.postMessage(null)}}else N=function(){z(j,0)};function V(O){C=O,D||(D=!0,N())}function U(O,K){L=z(function(){O(e.unstable_now())},K)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(O){O.callback=null},e.unstable_continueExecution=function(){_||w||(_=!0,V(I))},e.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<O?Math.floor(1e3/O):5},e.unstable_getCurrentPriorityLevel=function(){return y},e.unstable_getFirstCallbackNode=function(){return n(d)},e.unstable_next=function(O){switch(y){case 1:case 2:case 3:var K=3;break;default:K=y}var Y=y;y=K;try{return O()}finally{y=Y}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(O,K){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var Y=y;y=O;try{return K()}finally{y=Y}},e.unstable_scheduleCallback=function(O,K,Y){var E=e.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?E+Y:E):Y=E,O){case 1:var $=-1;break;case 2:$=250;break;case 5:$=1073741823;break;case 4:$=1e4;break;default:$=5e3}return $=Y+$,O={id:h++,callback:K,priorityLevel:O,startTime:Y,expirationTime:$,sortIndex:-1},Y>E?(O.sortIndex=Y,t(u,O),n(d)===null&&O===n(u)&&(S?(x(L),L=-1):S=!0,U(k,Y-E))):(O.sortIndex=$,t(d,O),_||w||(_=!0,V(I))),O},e.unstable_shouldYield=T,e.unstable_wrapCallback=function(O){var K=y;return function(){var Y=y;y=K;try{return O.apply(this,arguments)}finally{y=Y}}}})(xc);mc.exports=xc;var sf=mc.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var df=p,ft=sf;function W(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var gc=new Set,ea={};function $r(e,t){un(e,t),un(e+"Capture",t)}function un(e,t){for(ea[e]=t,e=0;e<t.length;e++)gc.add(t[e])}var Yt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Il=Object.prototype.hasOwnProperty,cf=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Ti={},Li={};function uf(e){return Il.call(Li,e)?!0:Il.call(Ti,e)?!1:cf.test(e)?Li[e]=!0:(Ti[e]=!0,!1)}function pf(e,t,n,a){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return a?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ff(e,t,n,a){if(t===null||typeof t>"u"||pf(e,t,n,a))return!0;if(a)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function tt(e,t,n,a,o,l,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=a,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=s}var qe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){qe[e]=new tt(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];qe[t]=new tt(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){qe[e]=new tt(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){qe[e]=new tt(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){qe[e]=new tt(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){qe[e]=new tt(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){qe[e]=new tt(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){qe[e]=new tt(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){qe[e]=new tt(e,5,!1,e.toLowerCase(),null,!1,!1)});var Is=/[\-:]([a-z])/g;function As(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Is,As);qe[t]=new tt(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Is,As);qe[t]=new tt(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Is,As);qe[t]=new tt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){qe[e]=new tt(e,1,!1,e.toLowerCase(),null,!1,!1)});qe.xlinkHref=new tt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){qe[e]=new tt(e,1,!1,e.toLowerCase(),null,!0,!0)});function Rs(e,t,n,a){var o=qe.hasOwnProperty(t)?qe[t]:null;(o!==null?o.type!==0:a||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ff(t,n,o,a)&&(n=null),a||o===null?uf(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=n===null?o.type===3?!1:"":n:(t=o.attributeName,a=o.attributeNamespace,n===null?e.removeAttribute(t):(o=o.type,n=o===3||o===4&&n===!0?"":""+n,a?e.setAttributeNS(a,t,n):e.setAttribute(t,n))))}var Xt=df.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ta=Symbol.for("react.element"),Vr=Symbol.for("react.portal"),Hr=Symbol.for("react.fragment"),Os=Symbol.for("react.strict_mode"),Al=Symbol.for("react.profiler"),hc=Symbol.for("react.provider"),vc=Symbol.for("react.context"),Bs=Symbol.for("react.forward_ref"),Rl=Symbol.for("react.suspense"),Ol=Symbol.for("react.suspense_list"),Ms=Symbol.for("react.memo"),nr=Symbol.for("react.lazy"),yc=Symbol.for("react.offscreen"),Ii=Symbol.iterator;function zn(e){return e===null||typeof e!="object"?null:(e=Ii&&e[Ii]||e["@@iterator"],typeof e=="function"?e:null)}var ze=Object.assign,al;function Rn(e){if(al===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);al=t&&t[1]||""}return`
`+al+e}var ol=!1;function ll(e,t){if(!e||ol)return"";ol=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(u){var a=u}Reflect.construct(e,[],t)}else{try{t.call()}catch(u){a=u}e.call(t.prototype)}else{try{throw Error()}catch(u){a=u}e()}}catch(u){if(u&&a&&typeof u.stack=="string"){for(var o=u.stack.split(`
`),l=a.stack.split(`
`),s=o.length-1,i=l.length-1;1<=s&&0<=i&&o[s]!==l[i];)i--;for(;1<=s&&0<=i;s--,i--)if(o[s]!==l[i]){if(s!==1||i!==1)do if(s--,i--,0>i||o[s]!==l[i]){var d=`
`+o[s].replace(" at new "," at ");return e.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",e.displayName)),d}while(1<=s&&0<=i);break}}}finally{ol=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Rn(e):""}function mf(e){switch(e.tag){case 5:return Rn(e.type);case 16:return Rn("Lazy");case 13:return Rn("Suspense");case 19:return Rn("SuspenseList");case 0:case 2:case 15:return e=ll(e.type,!1),e;case 11:return e=ll(e.type.render,!1),e;case 1:return e=ll(e.type,!0),e;default:return""}}function Bl(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Hr:return"Fragment";case Vr:return"Portal";case Al:return"Profiler";case Os:return"StrictMode";case Rl:return"Suspense";case Ol:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case vc:return(e.displayName||"Context")+".Consumer";case hc:return(e._context.displayName||"Context")+".Provider";case Bs:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Ms:return t=e.displayName||null,t!==null?t:Bl(e.type)||"Memo";case nr:t=e._payload,e=e._init;try{return Bl(e(t))}catch{}}return null}function xf(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Bl(t);case 8:return t===Os?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function vr(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function bc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function gf(e){var t=bc(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),a=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var o=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(s){a=""+s,l.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return a},setValue:function(s){a=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function La(e){e._valueTracker||(e._valueTracker=gf(e))}function jc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),a="";return e&&(a=bc(e)?e.checked?"true":"false":e.value),e=a,e!==n?(t.setValue(e),!0):!1}function co(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Ml(e,t){var n=t.checked;return ze({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Ai(e,t){var n=t.defaultValue==null?"":t.defaultValue,a=t.checked!=null?t.checked:t.defaultChecked;n=vr(t.value!=null?t.value:n),e._wrapperState={initialChecked:a,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function wc(e,t){t=t.checked,t!=null&&Rs(e,"checked",t,!1)}function $l(e,t){wc(e,t);var n=vr(t.value),a=t.type;if(n!=null)a==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(a==="submit"||a==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Ul(e,t.type,n):t.hasOwnProperty("defaultValue")&&Ul(e,t.type,vr(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ri(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var a=t.type;if(!(a!=="submit"&&a!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Ul(e,t,n){(t!=="number"||co(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var On=Array.isArray;function an(e,t,n,a){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&a&&(e[n].defaultSelected=!0)}else{for(n=""+vr(n),t=null,o=0;o<e.length;o++){if(e[o].value===n){e[o].selected=!0,a&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function Fl(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(W(91));return ze({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Oi(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(W(92));if(On(n)){if(1<n.length)throw Error(W(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:vr(n)}}function kc(e,t){var n=vr(t.value),a=vr(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),a!=null&&(e.defaultValue=""+a)}function Bi(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Sc(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Wl(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Sc(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Ia,_c=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,a,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,a,o)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Ia=Ia||document.createElement("div"),Ia.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Ia.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function ta(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Vn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},hf=["Webkit","ms","Moz","O"];Object.keys(Vn).forEach(function(e){hf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Vn[t]=Vn[e]})});function Nc(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Vn.hasOwnProperty(e)&&Vn[e]?(""+t).trim():t+"px"}function Cc(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var a=n.indexOf("--")===0,o=Nc(n,t[n],a);n==="float"&&(n="cssFloat"),a?e.setProperty(n,o):e[n]=o}}var vf=ze({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ql(e,t){if(t){if(vf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(W(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(W(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(W(61))}if(t.style!=null&&typeof t.style!="object")throw Error(W(62))}}function Vl(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Hl=null;function $s(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ql=null,on=null,ln=null;function Mi(e){if(e=wa(e)){if(typeof Ql!="function")throw Error(W(280));var t=e.stateNode;t&&(t=qo(t),Ql(e.stateNode,e.type,t))}}function zc(e){on?ln?ln.push(e):ln=[e]:on=e}function Ec(){if(on){var e=on,t=ln;if(ln=on=null,Mi(e),t)for(e=0;e<t.length;e++)Mi(t[e])}}function Dc(e,t){return e(t)}function Pc(){}var sl=!1;function Tc(e,t,n){if(sl)return e(t,n);sl=!0;try{return Dc(e,t,n)}finally{sl=!1,(on!==null||ln!==null)&&(Pc(),Ec())}}function ra(e,t){var n=e.stateNode;if(n===null)return null;var a=qo(n);if(a===null)return null;n=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(W(231,t,typeof n));return n}var Yl=!1;if(Yt)try{var En={};Object.defineProperty(En,"passive",{get:function(){Yl=!0}}),window.addEventListener("test",En,En),window.removeEventListener("test",En,En)}catch{Yl=!1}function yf(e,t,n,a,o,l,s,i,d){var u=Array.prototype.slice.call(arguments,3);try{t.apply(n,u)}catch(h){this.onError(h)}}var Hn=!1,uo=null,po=!1,Gl=null,bf={onError:function(e){Hn=!0,uo=e}};function jf(e,t,n,a,o,l,s,i,d){Hn=!1,uo=null,yf.apply(bf,arguments)}function wf(e,t,n,a,o,l,s,i,d){if(jf.apply(this,arguments),Hn){if(Hn){var u=uo;Hn=!1,uo=null}else throw Error(W(198));po||(po=!0,Gl=u)}}function Ur(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Lc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function $i(e){if(Ur(e)!==e)throw Error(W(188))}function kf(e){var t=e.alternate;if(!t){if(t=Ur(e),t===null)throw Error(W(188));return t!==e?null:e}for(var n=e,a=t;;){var o=n.return;if(o===null)break;var l=o.alternate;if(l===null){if(a=o.return,a!==null){n=a;continue}break}if(o.child===l.child){for(l=o.child;l;){if(l===n)return $i(o),e;if(l===a)return $i(o),t;l=l.sibling}throw Error(W(188))}if(n.return!==a.return)n=o,a=l;else{for(var s=!1,i=o.child;i;){if(i===n){s=!0,n=o,a=l;break}if(i===a){s=!0,a=o,n=l;break}i=i.sibling}if(!s){for(i=l.child;i;){if(i===n){s=!0,n=l,a=o;break}if(i===a){s=!0,a=l,n=o;break}i=i.sibling}if(!s)throw Error(W(189))}}if(n.alternate!==a)throw Error(W(190))}if(n.tag!==3)throw Error(W(188));return n.stateNode.current===n?e:t}function Ic(e){return e=kf(e),e!==null?Ac(e):null}function Ac(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ac(e);if(t!==null)return t;e=e.sibling}return null}var Rc=ft.unstable_scheduleCallback,Ui=ft.unstable_cancelCallback,Sf=ft.unstable_shouldYield,_f=ft.unstable_requestPaint,Le=ft.unstable_now,Nf=ft.unstable_getCurrentPriorityLevel,Us=ft.unstable_ImmediatePriority,Oc=ft.unstable_UserBlockingPriority,fo=ft.unstable_NormalPriority,Cf=ft.unstable_LowPriority,Bc=ft.unstable_IdlePriority,$o=null,Bt=null;function zf(e){if(Bt&&typeof Bt.onCommitFiberRoot=="function")try{Bt.onCommitFiberRoot($o,e,void 0,(e.current.flags&128)===128)}catch{}}var Pt=Math.clz32?Math.clz32:Pf,Ef=Math.log,Df=Math.LN2;function Pf(e){return e>>>=0,e===0?32:31-(Ef(e)/Df|0)|0}var Aa=64,Ra=4194304;function Bn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function mo(e,t){var n=e.pendingLanes;if(n===0)return 0;var a=0,o=e.suspendedLanes,l=e.pingedLanes,s=n&268435455;if(s!==0){var i=s&~o;i!==0?a=Bn(i):(l&=s,l!==0&&(a=Bn(l)))}else s=n&~o,s!==0?a=Bn(s):l!==0&&(a=Bn(l));if(a===0)return 0;if(t!==0&&t!==a&&!(t&o)&&(o=a&-a,l=t&-t,o>=l||o===16&&(l&4194240)!==0))return t;if(a&4&&(a|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=a;0<t;)n=31-Pt(t),o=1<<n,a|=e[n],t&=~o;return a}function Tf(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Lf(e,t){for(var n=e.suspendedLanes,a=e.pingedLanes,o=e.expirationTimes,l=e.pendingLanes;0<l;){var s=31-Pt(l),i=1<<s,d=o[s];d===-1?(!(i&n)||i&a)&&(o[s]=Tf(i,t)):d<=t&&(e.expiredLanes|=i),l&=~i}}function Jl(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Mc(){var e=Aa;return Aa<<=1,!(Aa&4194240)&&(Aa=64),e}function il(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ba(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Pt(t),e[t]=n}function If(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var a=e.eventTimes;for(e=e.expirationTimes;0<n;){var o=31-Pt(n),l=1<<o;t[o]=0,a[o]=-1,e[o]=-1,n&=~l}}function Fs(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var a=31-Pt(n),o=1<<a;o&t|e[a]&t&&(e[a]|=t),n&=~o}}var he=0;function $c(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Uc,Ws,Fc,Wc,qc,Kl=!1,Oa=[],cr=null,ur=null,pr=null,na=new Map,aa=new Map,or=[],Af="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Fi(e,t){switch(e){case"focusin":case"focusout":cr=null;break;case"dragenter":case"dragleave":ur=null;break;case"mouseover":case"mouseout":pr=null;break;case"pointerover":case"pointerout":na.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":aa.delete(t.pointerId)}}function Dn(e,t,n,a,o,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:a,nativeEvent:l,targetContainers:[o]},t!==null&&(t=wa(t),t!==null&&Ws(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Rf(e,t,n,a,o){switch(t){case"focusin":return cr=Dn(cr,e,t,n,a,o),!0;case"dragenter":return ur=Dn(ur,e,t,n,a,o),!0;case"mouseover":return pr=Dn(pr,e,t,n,a,o),!0;case"pointerover":var l=o.pointerId;return na.set(l,Dn(na.get(l)||null,e,t,n,a,o)),!0;case"gotpointercapture":return l=o.pointerId,aa.set(l,Dn(aa.get(l)||null,e,t,n,a,o)),!0}return!1}function Vc(e){var t=zr(e.target);if(t!==null){var n=Ur(t);if(n!==null){if(t=n.tag,t===13){if(t=Lc(n),t!==null){e.blockedOn=t,qc(e.priority,function(){Fc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ka(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Xl(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var a=new n.constructor(n.type,n);Hl=a,n.target.dispatchEvent(a),Hl=null}else return t=wa(n),t!==null&&Ws(t),e.blockedOn=n,!1;t.shift()}return!0}function Wi(e,t,n){Ka(e)&&n.delete(t)}function Of(){Kl=!1,cr!==null&&Ka(cr)&&(cr=null),ur!==null&&Ka(ur)&&(ur=null),pr!==null&&Ka(pr)&&(pr=null),na.forEach(Wi),aa.forEach(Wi)}function Pn(e,t){e.blockedOn===t&&(e.blockedOn=null,Kl||(Kl=!0,ft.unstable_scheduleCallback(ft.unstable_NormalPriority,Of)))}function oa(e){function t(o){return Pn(o,e)}if(0<Oa.length){Pn(Oa[0],e);for(var n=1;n<Oa.length;n++){var a=Oa[n];a.blockedOn===e&&(a.blockedOn=null)}}for(cr!==null&&Pn(cr,e),ur!==null&&Pn(ur,e),pr!==null&&Pn(pr,e),na.forEach(t),aa.forEach(t),n=0;n<or.length;n++)a=or[n],a.blockedOn===e&&(a.blockedOn=null);for(;0<or.length&&(n=or[0],n.blockedOn===null);)Vc(n),n.blockedOn===null&&or.shift()}var sn=Xt.ReactCurrentBatchConfig,xo=!0;function Bf(e,t,n,a){var o=he,l=sn.transition;sn.transition=null;try{he=1,qs(e,t,n,a)}finally{he=o,sn.transition=l}}function Mf(e,t,n,a){var o=he,l=sn.transition;sn.transition=null;try{he=4,qs(e,t,n,a)}finally{he=o,sn.transition=l}}function qs(e,t,n,a){if(xo){var o=Xl(e,t,n,a);if(o===null)vl(e,t,a,go,n),Fi(e,a);else if(Rf(o,e,t,n,a))a.stopPropagation();else if(Fi(e,a),t&4&&-1<Af.indexOf(e)){for(;o!==null;){var l=wa(o);if(l!==null&&Uc(l),l=Xl(e,t,n,a),l===null&&vl(e,t,a,go,n),l===o)break;o=l}o!==null&&a.stopPropagation()}else vl(e,t,a,null,n)}}var go=null;function Xl(e,t,n,a){if(go=null,e=$s(a),e=zr(e),e!==null)if(t=Ur(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Lc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return go=e,null}function Hc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Nf()){case Us:return 1;case Oc:return 4;case fo:case Cf:return 16;case Bc:return 536870912;default:return 16}default:return 16}}var sr=null,Vs=null,Xa=null;function Qc(){if(Xa)return Xa;var e,t=Vs,n=t.length,a,o="value"in sr?sr.value:sr.textContent,l=o.length;for(e=0;e<n&&t[e]===o[e];e++);var s=n-e;for(a=1;a<=s&&t[n-a]===o[l-a];a++);return Xa=o.slice(e,1<a?1-a:void 0)}function Za(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ba(){return!0}function qi(){return!1}function xt(e){function t(n,a,o,l,s){this._reactName=n,this._targetInst=o,this.type=a,this.nativeEvent=l,this.target=s,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Ba:qi,this.isPropagationStopped=qi,this}return ze(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ba)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ba)},persist:function(){},isPersistent:Ba}),t}var bn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Hs=xt(bn),ja=ze({},bn,{view:0,detail:0}),$f=xt(ja),dl,cl,Tn,Uo=ze({},ja,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Qs,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Tn&&(Tn&&e.type==="mousemove"?(dl=e.screenX-Tn.screenX,cl=e.screenY-Tn.screenY):cl=dl=0,Tn=e),dl)},movementY:function(e){return"movementY"in e?e.movementY:cl}}),Vi=xt(Uo),Uf=ze({},Uo,{dataTransfer:0}),Ff=xt(Uf),Wf=ze({},ja,{relatedTarget:0}),ul=xt(Wf),qf=ze({},bn,{animationName:0,elapsedTime:0,pseudoElement:0}),Vf=xt(qf),Hf=ze({},bn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Qf=xt(Hf),Yf=ze({},bn,{data:0}),Hi=xt(Yf),Gf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Jf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Kf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Xf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Kf[e])?!!t[e]:!1}function Qs(){return Xf}var Zf=ze({},ja,{key:function(e){if(e.key){var t=Gf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Za(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Jf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Qs,charCode:function(e){return e.type==="keypress"?Za(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Za(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),em=xt(Zf),tm=ze({},Uo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Qi=xt(tm),rm=ze({},ja,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Qs}),nm=xt(rm),am=ze({},bn,{propertyName:0,elapsedTime:0,pseudoElement:0}),om=xt(am),lm=ze({},Uo,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),sm=xt(lm),im=[9,13,27,32],Ys=Yt&&"CompositionEvent"in window,Qn=null;Yt&&"documentMode"in document&&(Qn=document.documentMode);var dm=Yt&&"TextEvent"in window&&!Qn,Yc=Yt&&(!Ys||Qn&&8<Qn&&11>=Qn),Yi=" ",Gi=!1;function Gc(e,t){switch(e){case"keyup":return im.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Jc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Qr=!1;function cm(e,t){switch(e){case"compositionend":return Jc(t);case"keypress":return t.which!==32?null:(Gi=!0,Yi);case"textInput":return e=t.data,e===Yi&&Gi?null:e;default:return null}}function um(e,t){if(Qr)return e==="compositionend"||!Ys&&Gc(e,t)?(e=Qc(),Xa=Vs=sr=null,Qr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Yc&&t.locale!=="ko"?null:t.data;default:return null}}var pm={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ji(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!pm[e.type]:t==="textarea"}function Kc(e,t,n,a){zc(a),t=ho(t,"onChange"),0<t.length&&(n=new Hs("onChange","change",null,n,a),e.push({event:n,listeners:t}))}var Yn=null,la=null;function fm(e){iu(e,0)}function Fo(e){var t=Jr(e);if(jc(t))return e}function mm(e,t){if(e==="change")return t}var Xc=!1;if(Yt){var pl;if(Yt){var fl="oninput"in document;if(!fl){var Ki=document.createElement("div");Ki.setAttribute("oninput","return;"),fl=typeof Ki.oninput=="function"}pl=fl}else pl=!1;Xc=pl&&(!document.documentMode||9<document.documentMode)}function Xi(){Yn&&(Yn.detachEvent("onpropertychange",Zc),la=Yn=null)}function Zc(e){if(e.propertyName==="value"&&Fo(la)){var t=[];Kc(t,la,e,$s(e)),Tc(fm,t)}}function xm(e,t,n){e==="focusin"?(Xi(),Yn=t,la=n,Yn.attachEvent("onpropertychange",Zc)):e==="focusout"&&Xi()}function gm(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Fo(la)}function hm(e,t){if(e==="click")return Fo(t)}function vm(e,t){if(e==="input"||e==="change")return Fo(t)}function ym(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Lt=typeof Object.is=="function"?Object.is:ym;function sa(e,t){if(Lt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),a=Object.keys(t);if(n.length!==a.length)return!1;for(a=0;a<n.length;a++){var o=n[a];if(!Il.call(t,o)||!Lt(e[o],t[o]))return!1}return!0}function Zi(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function ed(e,t){var n=Zi(e);e=0;for(var a;n;){if(n.nodeType===3){if(a=e+n.textContent.length,e<=t&&a>=t)return{node:n,offset:t-e};e=a}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Zi(n)}}function eu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?eu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function tu(){for(var e=window,t=co();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=co(e.document)}return t}function Gs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function bm(e){var t=tu(),n=e.focusedElem,a=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&eu(n.ownerDocument.documentElement,n)){if(a!==null&&Gs(n)){if(t=a.start,e=a.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=n.textContent.length,l=Math.min(a.start,o);a=a.end===void 0?l:Math.min(a.end,o),!e.extend&&l>a&&(o=a,a=l,l=o),o=ed(n,l);var s=ed(n,a);o&&s&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),l>a?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var jm=Yt&&"documentMode"in document&&11>=document.documentMode,Yr=null,Zl=null,Gn=null,es=!1;function td(e,t,n){var a=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;es||Yr==null||Yr!==co(a)||(a=Yr,"selectionStart"in a&&Gs(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Gn&&sa(Gn,a)||(Gn=a,a=ho(Zl,"onSelect"),0<a.length&&(t=new Hs("onSelect","select",null,t,n),e.push({event:t,listeners:a}),t.target=Yr)))}function Ma(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Gr={animationend:Ma("Animation","AnimationEnd"),animationiteration:Ma("Animation","AnimationIteration"),animationstart:Ma("Animation","AnimationStart"),transitionend:Ma("Transition","TransitionEnd")},ml={},ru={};Yt&&(ru=document.createElement("div").style,"AnimationEvent"in window||(delete Gr.animationend.animation,delete Gr.animationiteration.animation,delete Gr.animationstart.animation),"TransitionEvent"in window||delete Gr.transitionend.transition);function Wo(e){if(ml[e])return ml[e];if(!Gr[e])return e;var t=Gr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ru)return ml[e]=t[n];return e}var nu=Wo("animationend"),au=Wo("animationiteration"),ou=Wo("animationstart"),lu=Wo("transitionend"),su=new Map,rd="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function jr(e,t){su.set(e,t),$r(t,[e])}for(var xl=0;xl<rd.length;xl++){var gl=rd[xl],wm=gl.toLowerCase(),km=gl[0].toUpperCase()+gl.slice(1);jr(wm,"on"+km)}jr(nu,"onAnimationEnd");jr(au,"onAnimationIteration");jr(ou,"onAnimationStart");jr("dblclick","onDoubleClick");jr("focusin","onFocus");jr("focusout","onBlur");jr(lu,"onTransitionEnd");un("onMouseEnter",["mouseout","mouseover"]);un("onMouseLeave",["mouseout","mouseover"]);un("onPointerEnter",["pointerout","pointerover"]);un("onPointerLeave",["pointerout","pointerover"]);$r("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));$r("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));$r("onBeforeInput",["compositionend","keypress","textInput","paste"]);$r("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));$r("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));$r("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Mn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Sm=new Set("cancel close invalid load scroll toggle".split(" ").concat(Mn));function nd(e,t,n){var a=e.type||"unknown-event";e.currentTarget=n,wf(a,t,void 0,e),e.currentTarget=null}function iu(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var a=e[n],o=a.event;a=a.listeners;e:{var l=void 0;if(t)for(var s=a.length-1;0<=s;s--){var i=a[s],d=i.instance,u=i.currentTarget;if(i=i.listener,d!==l&&o.isPropagationStopped())break e;nd(o,i,u),l=d}else for(s=0;s<a.length;s++){if(i=a[s],d=i.instance,u=i.currentTarget,i=i.listener,d!==l&&o.isPropagationStopped())break e;nd(o,i,u),l=d}}}if(po)throw e=Gl,po=!1,Gl=null,e}function we(e,t){var n=t[os];n===void 0&&(n=t[os]=new Set);var a=e+"__bubble";n.has(a)||(du(t,e,2,!1),n.add(a))}function hl(e,t,n){var a=0;t&&(a|=4),du(n,e,a,t)}var $a="_reactListening"+Math.random().toString(36).slice(2);function ia(e){if(!e[$a]){e[$a]=!0,gc.forEach(function(n){n!=="selectionchange"&&(Sm.has(n)||hl(n,!1,e),hl(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[$a]||(t[$a]=!0,hl("selectionchange",!1,t))}}function du(e,t,n,a){switch(Hc(t)){case 1:var o=Bf;break;case 4:o=Mf;break;default:o=qs}n=o.bind(null,t,n,e),o=void 0,!Yl||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),a?o!==void 0?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):o!==void 0?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function vl(e,t,n,a,o){var l=a;if(!(t&1)&&!(t&2)&&a!==null)e:for(;;){if(a===null)return;var s=a.tag;if(s===3||s===4){var i=a.stateNode.containerInfo;if(i===o||i.nodeType===8&&i.parentNode===o)break;if(s===4)for(s=a.return;s!==null;){var d=s.tag;if((d===3||d===4)&&(d=s.stateNode.containerInfo,d===o||d.nodeType===8&&d.parentNode===o))return;s=s.return}for(;i!==null;){if(s=zr(i),s===null)return;if(d=s.tag,d===5||d===6){a=l=s;continue e}i=i.parentNode}}a=a.return}Tc(function(){var u=l,h=$s(n),m=[];e:{var y=su.get(e);if(y!==void 0){var w=Hs,_=e;switch(e){case"keypress":if(Za(n)===0)break e;case"keydown":case"keyup":w=em;break;case"focusin":_="focus",w=ul;break;case"focusout":_="blur",w=ul;break;case"beforeblur":case"afterblur":w=ul;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":w=Vi;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":w=Ff;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":w=nm;break;case nu:case au:case ou:w=Vf;break;case lu:w=om;break;case"scroll":w=$f;break;case"wheel":w=sm;break;case"copy":case"cut":case"paste":w=Qf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":w=Qi}var S=(t&4)!==0,z=!S&&e==="scroll",x=S?y!==null?y+"Capture":null:y;S=[];for(var f=u,c;f!==null;){c=f;var k=c.stateNode;if(c.tag===5&&k!==null&&(c=k,x!==null&&(k=ra(f,x),k!=null&&S.push(da(f,k,c)))),z)break;f=f.return}0<S.length&&(y=new w(y,_,null,n,h),m.push({event:y,listeners:S}))}}if(!(t&7)){e:{if(y=e==="mouseover"||e==="pointerover",w=e==="mouseout"||e==="pointerout",y&&n!==Hl&&(_=n.relatedTarget||n.fromElement)&&(zr(_)||_[Gt]))break e;if((w||y)&&(y=h.window===h?h:(y=h.ownerDocument)?y.defaultView||y.parentWindow:window,w?(_=n.relatedTarget||n.toElement,w=u,_=_?zr(_):null,_!==null&&(z=Ur(_),_!==z||_.tag!==5&&_.tag!==6)&&(_=null)):(w=null,_=u),w!==_)){if(S=Vi,k="onMouseLeave",x="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(S=Qi,k="onPointerLeave",x="onPointerEnter",f="pointer"),z=w==null?y:Jr(w),c=_==null?y:Jr(_),y=new S(k,f+"leave",w,n,h),y.target=z,y.relatedTarget=c,k=null,zr(h)===u&&(S=new S(x,f+"enter",_,n,h),S.target=c,S.relatedTarget=z,k=S),z=k,w&&_)t:{for(S=w,x=_,f=0,c=S;c;c=qr(c))f++;for(c=0,k=x;k;k=qr(k))c++;for(;0<f-c;)S=qr(S),f--;for(;0<c-f;)x=qr(x),c--;for(;f--;){if(S===x||x!==null&&S===x.alternate)break t;S=qr(S),x=qr(x)}S=null}else S=null;w!==null&&ad(m,y,w,S,!1),_!==null&&z!==null&&ad(m,z,_,S,!0)}}e:{if(y=u?Jr(u):window,w=y.nodeName&&y.nodeName.toLowerCase(),w==="select"||w==="input"&&y.type==="file")var I=mm;else if(Ji(y))if(Xc)I=vm;else{I=gm;var D=xm}else(w=y.nodeName)&&w.toLowerCase()==="input"&&(y.type==="checkbox"||y.type==="radio")&&(I=hm);if(I&&(I=I(e,u))){Kc(m,I,n,h);break e}D&&D(e,y,u),e==="focusout"&&(D=y._wrapperState)&&D.controlled&&y.type==="number"&&Ul(y,"number",y.value)}switch(D=u?Jr(u):window,e){case"focusin":(Ji(D)||D.contentEditable==="true")&&(Yr=D,Zl=u,Gn=null);break;case"focusout":Gn=Zl=Yr=null;break;case"mousedown":es=!0;break;case"contextmenu":case"mouseup":case"dragend":es=!1,td(m,n,h);break;case"selectionchange":if(jm)break;case"keydown":case"keyup":td(m,n,h)}var C;if(Ys)e:{switch(e){case"compositionstart":var L="onCompositionStart";break e;case"compositionend":L="onCompositionEnd";break e;case"compositionupdate":L="onCompositionUpdate";break e}L=void 0}else Qr?Gc(e,n)&&(L="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(L="onCompositionStart");L&&(Yc&&n.locale!=="ko"&&(Qr||L!=="onCompositionStart"?L==="onCompositionEnd"&&Qr&&(C=Qc()):(sr=h,Vs="value"in sr?sr.value:sr.textContent,Qr=!0)),D=ho(u,L),0<D.length&&(L=new Hi(L,e,null,n,h),m.push({event:L,listeners:D}),C?L.data=C:(C=Jc(n),C!==null&&(L.data=C)))),(C=dm?cm(e,n):um(e,n))&&(u=ho(u,"onBeforeInput"),0<u.length&&(h=new Hi("onBeforeInput","beforeinput",null,n,h),m.push({event:h,listeners:u}),h.data=C))}iu(m,t)})}function da(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ho(e,t){for(var n=t+"Capture",a=[];e!==null;){var o=e,l=o.stateNode;o.tag===5&&l!==null&&(o=l,l=ra(e,n),l!=null&&a.unshift(da(e,l,o)),l=ra(e,t),l!=null&&a.push(da(e,l,o))),e=e.return}return a}function qr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function ad(e,t,n,a,o){for(var l=t._reactName,s=[];n!==null&&n!==a;){var i=n,d=i.alternate,u=i.stateNode;if(d!==null&&d===a)break;i.tag===5&&u!==null&&(i=u,o?(d=ra(n,l),d!=null&&s.unshift(da(n,d,i))):o||(d=ra(n,l),d!=null&&s.push(da(n,d,i)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var _m=/\r\n?/g,Nm=/\u0000|\uFFFD/g;function od(e){return(typeof e=="string"?e:""+e).replace(_m,`
`).replace(Nm,"")}function Ua(e,t,n){if(t=od(t),od(e)!==t&&n)throw Error(W(425))}function vo(){}var ts=null,rs=null;function ns(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var as=typeof setTimeout=="function"?setTimeout:void 0,Cm=typeof clearTimeout=="function"?clearTimeout:void 0,ld=typeof Promise=="function"?Promise:void 0,zm=typeof queueMicrotask=="function"?queueMicrotask:typeof ld<"u"?function(e){return ld.resolve(null).then(e).catch(Em)}:as;function Em(e){setTimeout(function(){throw e})}function yl(e,t){var n=t,a=0;do{var o=n.nextSibling;if(e.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(a===0){e.removeChild(o),oa(t);return}a--}else n!=="$"&&n!=="$?"&&n!=="$!"||a++;n=o}while(n);oa(t)}function fr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function sd(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var jn=Math.random().toString(36).slice(2),Ot="__reactFiber$"+jn,ca="__reactProps$"+jn,Gt="__reactContainer$"+jn,os="__reactEvents$"+jn,Dm="__reactListeners$"+jn,Pm="__reactHandles$"+jn;function zr(e){var t=e[Ot];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Gt]||n[Ot]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=sd(e);e!==null;){if(n=e[Ot])return n;e=sd(e)}return t}e=n,n=e.parentNode}return null}function wa(e){return e=e[Ot]||e[Gt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Jr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(W(33))}function qo(e){return e[ca]||null}var ls=[],Kr=-1;function wr(e){return{current:e}}function ke(e){0>Kr||(e.current=ls[Kr],ls[Kr]=null,Kr--)}function ye(e,t){Kr++,ls[Kr]=e.current,e.current=t}var yr={},Ke=wr(yr),ot=wr(!1),Ir=yr;function pn(e,t){var n=e.type.contextTypes;if(!n)return yr;var a=e.stateNode;if(a&&a.__reactInternalMemoizedUnmaskedChildContext===t)return a.__reactInternalMemoizedMaskedChildContext;var o={},l;for(l in n)o[l]=t[l];return a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function lt(e){return e=e.childContextTypes,e!=null}function yo(){ke(ot),ke(Ke)}function id(e,t,n){if(Ke.current!==yr)throw Error(W(168));ye(Ke,t),ye(ot,n)}function cu(e,t,n){var a=e.stateNode;if(t=t.childContextTypes,typeof a.getChildContext!="function")return n;a=a.getChildContext();for(var o in a)if(!(o in t))throw Error(W(108,xf(e)||"Unknown",o));return ze({},n,a)}function bo(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||yr,Ir=Ke.current,ye(Ke,e),ye(ot,ot.current),!0}function dd(e,t,n){var a=e.stateNode;if(!a)throw Error(W(169));n?(e=cu(e,t,Ir),a.__reactInternalMemoizedMergedChildContext=e,ke(ot),ke(Ke),ye(Ke,e)):ke(ot),ye(ot,n)}var Wt=null,Vo=!1,bl=!1;function uu(e){Wt===null?Wt=[e]:Wt.push(e)}function Tm(e){Vo=!0,uu(e)}function kr(){if(!bl&&Wt!==null){bl=!0;var e=0,t=he;try{var n=Wt;for(he=1;e<n.length;e++){var a=n[e];do a=a(!0);while(a!==null)}Wt=null,Vo=!1}catch(o){throw Wt!==null&&(Wt=Wt.slice(e+1)),Rc(Us,kr),o}finally{he=t,bl=!1}}return null}var Xr=[],Zr=0,jo=null,wo=0,vt=[],yt=0,Ar=null,qt=1,Vt="";function Nr(e,t){Xr[Zr++]=wo,Xr[Zr++]=jo,jo=e,wo=t}function pu(e,t,n){vt[yt++]=qt,vt[yt++]=Vt,vt[yt++]=Ar,Ar=e;var a=qt;e=Vt;var o=32-Pt(a)-1;a&=~(1<<o),n+=1;var l=32-Pt(t)+o;if(30<l){var s=o-o%5;l=(a&(1<<s)-1).toString(32),a>>=s,o-=s,qt=1<<32-Pt(t)+o|n<<o|a,Vt=l+e}else qt=1<<l|n<<o|a,Vt=e}function Js(e){e.return!==null&&(Nr(e,1),pu(e,1,0))}function Ks(e){for(;e===jo;)jo=Xr[--Zr],Xr[Zr]=null,wo=Xr[--Zr],Xr[Zr]=null;for(;e===Ar;)Ar=vt[--yt],vt[yt]=null,Vt=vt[--yt],vt[yt]=null,qt=vt[--yt],vt[yt]=null}var pt=null,ut=null,_e=!1,Dt=null;function fu(e,t){var n=bt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function cd(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,pt=e,ut=fr(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,pt=e,ut=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Ar!==null?{id:qt,overflow:Vt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=bt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,pt=e,ut=null,!0):!1;default:return!1}}function ss(e){return(e.mode&1)!==0&&(e.flags&128)===0}function is(e){if(_e){var t=ut;if(t){var n=t;if(!cd(e,t)){if(ss(e))throw Error(W(418));t=fr(n.nextSibling);var a=pt;t&&cd(e,t)?fu(a,n):(e.flags=e.flags&-4097|2,_e=!1,pt=e)}}else{if(ss(e))throw Error(W(418));e.flags=e.flags&-4097|2,_e=!1,pt=e}}}function ud(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;pt=e}function Fa(e){if(e!==pt)return!1;if(!_e)return ud(e),_e=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!ns(e.type,e.memoizedProps)),t&&(t=ut)){if(ss(e))throw mu(),Error(W(418));for(;t;)fu(e,t),t=fr(t.nextSibling)}if(ud(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(W(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ut=fr(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ut=null}}else ut=pt?fr(e.stateNode.nextSibling):null;return!0}function mu(){for(var e=ut;e;)e=fr(e.nextSibling)}function fn(){ut=pt=null,_e=!1}function Xs(e){Dt===null?Dt=[e]:Dt.push(e)}var Lm=Xt.ReactCurrentBatchConfig;function Ln(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(W(309));var a=n.stateNode}if(!a)throw Error(W(147,e));var o=a,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(s){var i=o.refs;s===null?delete i[l]:i[l]=s},t._stringRef=l,t)}if(typeof e!="string")throw Error(W(284));if(!n._owner)throw Error(W(290,e))}return e}function Wa(e,t){throw e=Object.prototype.toString.call(t),Error(W(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function pd(e){var t=e._init;return t(e._payload)}function xu(e){function t(x,f){if(e){var c=x.deletions;c===null?(x.deletions=[f],x.flags|=16):c.push(f)}}function n(x,f){if(!e)return null;for(;f!==null;)t(x,f),f=f.sibling;return null}function a(x,f){for(x=new Map;f!==null;)f.key!==null?x.set(f.key,f):x.set(f.index,f),f=f.sibling;return x}function o(x,f){return x=hr(x,f),x.index=0,x.sibling=null,x}function l(x,f,c){return x.index=c,e?(c=x.alternate,c!==null?(c=c.index,c<f?(x.flags|=2,f):c):(x.flags|=2,f)):(x.flags|=1048576,f)}function s(x){return e&&x.alternate===null&&(x.flags|=2),x}function i(x,f,c,k){return f===null||f.tag!==6?(f=Cl(c,x.mode,k),f.return=x,f):(f=o(f,c),f.return=x,f)}function d(x,f,c,k){var I=c.type;return I===Hr?h(x,f,c.props.children,k,c.key):f!==null&&(f.elementType===I||typeof I=="object"&&I!==null&&I.$$typeof===nr&&pd(I)===f.type)?(k=o(f,c.props),k.ref=Ln(x,f,c),k.return=x,k):(k=lo(c.type,c.key,c.props,null,x.mode,k),k.ref=Ln(x,f,c),k.return=x,k)}function u(x,f,c,k){return f===null||f.tag!==4||f.stateNode.containerInfo!==c.containerInfo||f.stateNode.implementation!==c.implementation?(f=zl(c,x.mode,k),f.return=x,f):(f=o(f,c.children||[]),f.return=x,f)}function h(x,f,c,k,I){return f===null||f.tag!==7?(f=Tr(c,x.mode,k,I),f.return=x,f):(f=o(f,c),f.return=x,f)}function m(x,f,c){if(typeof f=="string"&&f!==""||typeof f=="number")return f=Cl(""+f,x.mode,c),f.return=x,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Ta:return c=lo(f.type,f.key,f.props,null,x.mode,c),c.ref=Ln(x,null,f),c.return=x,c;case Vr:return f=zl(f,x.mode,c),f.return=x,f;case nr:var k=f._init;return m(x,k(f._payload),c)}if(On(f)||zn(f))return f=Tr(f,x.mode,c,null),f.return=x,f;Wa(x,f)}return null}function y(x,f,c,k){var I=f!==null?f.key:null;if(typeof c=="string"&&c!==""||typeof c=="number")return I!==null?null:i(x,f,""+c,k);if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Ta:return c.key===I?d(x,f,c,k):null;case Vr:return c.key===I?u(x,f,c,k):null;case nr:return I=c._init,y(x,f,I(c._payload),k)}if(On(c)||zn(c))return I!==null?null:h(x,f,c,k,null);Wa(x,c)}return null}function w(x,f,c,k,I){if(typeof k=="string"&&k!==""||typeof k=="number")return x=x.get(c)||null,i(f,x,""+k,I);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case Ta:return x=x.get(k.key===null?c:k.key)||null,d(f,x,k,I);case Vr:return x=x.get(k.key===null?c:k.key)||null,u(f,x,k,I);case nr:var D=k._init;return w(x,f,c,D(k._payload),I)}if(On(k)||zn(k))return x=x.get(c)||null,h(f,x,k,I,null);Wa(f,k)}return null}function _(x,f,c,k){for(var I=null,D=null,C=f,L=f=0,P=null;C!==null&&L<c.length;L++){C.index>L?(P=C,C=null):P=C.sibling;var g=y(x,C,c[L],k);if(g===null){C===null&&(C=P);break}e&&C&&g.alternate===null&&t(x,C),f=l(g,f,L),D===null?I=g:D.sibling=g,D=g,C=P}if(L===c.length)return n(x,C),_e&&Nr(x,L),I;if(C===null){for(;L<c.length;L++)C=m(x,c[L],k),C!==null&&(f=l(C,f,L),D===null?I=C:D.sibling=C,D=C);return _e&&Nr(x,L),I}for(C=a(x,C);L<c.length;L++)P=w(C,x,L,c[L],k),P!==null&&(e&&P.alternate!==null&&C.delete(P.key===null?L:P.key),f=l(P,f,L),D===null?I=P:D.sibling=P,D=P);return e&&C.forEach(function(T){return t(x,T)}),_e&&Nr(x,L),I}function S(x,f,c,k){var I=zn(c);if(typeof I!="function")throw Error(W(150));if(c=I.call(c),c==null)throw Error(W(151));for(var D=I=null,C=f,L=f=0,P=null,g=c.next();C!==null&&!g.done;L++,g=c.next()){C.index>L?(P=C,C=null):P=C.sibling;var T=y(x,C,g.value,k);if(T===null){C===null&&(C=P);break}e&&C&&T.alternate===null&&t(x,C),f=l(T,f,L),D===null?I=T:D.sibling=T,D=T,C=P}if(g.done)return n(x,C),_e&&Nr(x,L),I;if(C===null){for(;!g.done;L++,g=c.next())g=m(x,g.value,k),g!==null&&(f=l(g,f,L),D===null?I=g:D.sibling=g,D=g);return _e&&Nr(x,L),I}for(C=a(x,C);!g.done;L++,g=c.next())g=w(C,x,L,g.value,k),g!==null&&(e&&g.alternate!==null&&C.delete(g.key===null?L:g.key),f=l(g,f,L),D===null?I=g:D.sibling=g,D=g);return e&&C.forEach(function(j){return t(x,j)}),_e&&Nr(x,L),I}function z(x,f,c,k){if(typeof c=="object"&&c!==null&&c.type===Hr&&c.key===null&&(c=c.props.children),typeof c=="object"&&c!==null){switch(c.$$typeof){case Ta:e:{for(var I=c.key,D=f;D!==null;){if(D.key===I){if(I=c.type,I===Hr){if(D.tag===7){n(x,D.sibling),f=o(D,c.props.children),f.return=x,x=f;break e}}else if(D.elementType===I||typeof I=="object"&&I!==null&&I.$$typeof===nr&&pd(I)===D.type){n(x,D.sibling),f=o(D,c.props),f.ref=Ln(x,D,c),f.return=x,x=f;break e}n(x,D);break}else t(x,D);D=D.sibling}c.type===Hr?(f=Tr(c.props.children,x.mode,k,c.key),f.return=x,x=f):(k=lo(c.type,c.key,c.props,null,x.mode,k),k.ref=Ln(x,f,c),k.return=x,x=k)}return s(x);case Vr:e:{for(D=c.key;f!==null;){if(f.key===D)if(f.tag===4&&f.stateNode.containerInfo===c.containerInfo&&f.stateNode.implementation===c.implementation){n(x,f.sibling),f=o(f,c.children||[]),f.return=x,x=f;break e}else{n(x,f);break}else t(x,f);f=f.sibling}f=zl(c,x.mode,k),f.return=x,x=f}return s(x);case nr:return D=c._init,z(x,f,D(c._payload),k)}if(On(c))return _(x,f,c,k);if(zn(c))return S(x,f,c,k);Wa(x,c)}return typeof c=="string"&&c!==""||typeof c=="number"?(c=""+c,f!==null&&f.tag===6?(n(x,f.sibling),f=o(f,c),f.return=x,x=f):(n(x,f),f=Cl(c,x.mode,k),f.return=x,x=f),s(x)):n(x,f)}return z}var mn=xu(!0),gu=xu(!1),ko=wr(null),So=null,en=null,Zs=null;function ei(){Zs=en=So=null}function ti(e){var t=ko.current;ke(ko),e._currentValue=t}function ds(e,t,n){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===n)break;e=e.return}}function dn(e,t){So=e,Zs=en=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(at=!0),e.firstContext=null)}function wt(e){var t=e._currentValue;if(Zs!==e)if(e={context:e,memoizedValue:t,next:null},en===null){if(So===null)throw Error(W(308));en=e,So.dependencies={lanes:0,firstContext:e}}else en=en.next=e;return t}var Er=null;function ri(e){Er===null?Er=[e]:Er.push(e)}function hu(e,t,n,a){var o=t.interleaved;return o===null?(n.next=n,ri(t)):(n.next=o.next,o.next=n),t.interleaved=n,Jt(e,a)}function Jt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var ar=!1;function ni(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function vu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Qt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function mr(e,t,n){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,fe&2){var o=a.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),a.pending=t,Jt(e,n)}return o=a.interleaved,o===null?(t.next=t,ri(a)):(t.next=o.next,o.next=t),a.interleaved=t,Jt(e,n)}function eo(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Fs(e,n)}}function fd(e,t){var n=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,n===a)){var o=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?o=l=s:l=l.next=s,n=n.next}while(n!==null);l===null?o=l=t:l=l.next=t}else o=l=t;n={baseState:a.baseState,firstBaseUpdate:o,lastBaseUpdate:l,shared:a.shared,effects:a.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function _o(e,t,n,a){var o=e.updateQueue;ar=!1;var l=o.firstBaseUpdate,s=o.lastBaseUpdate,i=o.shared.pending;if(i!==null){o.shared.pending=null;var d=i,u=d.next;d.next=null,s===null?l=u:s.next=u,s=d;var h=e.alternate;h!==null&&(h=h.updateQueue,i=h.lastBaseUpdate,i!==s&&(i===null?h.firstBaseUpdate=u:i.next=u,h.lastBaseUpdate=d))}if(l!==null){var m=o.baseState;s=0,h=u=d=null,i=l;do{var y=i.lane,w=i.eventTime;if((a&y)===y){h!==null&&(h=h.next={eventTime:w,lane:0,tag:i.tag,payload:i.payload,callback:i.callback,next:null});e:{var _=e,S=i;switch(y=t,w=n,S.tag){case 1:if(_=S.payload,typeof _=="function"){m=_.call(w,m,y);break e}m=_;break e;case 3:_.flags=_.flags&-65537|128;case 0:if(_=S.payload,y=typeof _=="function"?_.call(w,m,y):_,y==null)break e;m=ze({},m,y);break e;case 2:ar=!0}}i.callback!==null&&i.lane!==0&&(e.flags|=64,y=o.effects,y===null?o.effects=[i]:y.push(i))}else w={eventTime:w,lane:y,tag:i.tag,payload:i.payload,callback:i.callback,next:null},h===null?(u=h=w,d=m):h=h.next=w,s|=y;if(i=i.next,i===null){if(i=o.shared.pending,i===null)break;y=i,i=y.next,y.next=null,o.lastBaseUpdate=y,o.shared.pending=null}}while(!0);if(h===null&&(d=m),o.baseState=d,o.firstBaseUpdate=u,o.lastBaseUpdate=h,t=o.shared.interleaved,t!==null){o=t;do s|=o.lane,o=o.next;while(o!==t)}else l===null&&(o.shared.lanes=0);Or|=s,e.lanes=s,e.memoizedState=m}}function md(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var a=e[t],o=a.callback;if(o!==null){if(a.callback=null,a=n,typeof o!="function")throw Error(W(191,o));o.call(a)}}}var ka={},Mt=wr(ka),ua=wr(ka),pa=wr(ka);function Dr(e){if(e===ka)throw Error(W(174));return e}function ai(e,t){switch(ye(pa,t),ye(ua,e),ye(Mt,ka),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Wl(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Wl(t,e)}ke(Mt),ye(Mt,t)}function xn(){ke(Mt),ke(ua),ke(pa)}function yu(e){Dr(pa.current);var t=Dr(Mt.current),n=Wl(t,e.type);t!==n&&(ye(ua,e),ye(Mt,n))}function oi(e){ua.current===e&&(ke(Mt),ke(ua))}var Ne=wr(0);function No(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var jl=[];function li(){for(var e=0;e<jl.length;e++)jl[e]._workInProgressVersionPrimary=null;jl.length=0}var to=Xt.ReactCurrentDispatcher,wl=Xt.ReactCurrentBatchConfig,Rr=0,Ce=null,Be=null,$e=null,Co=!1,Jn=!1,fa=0,Im=0;function Qe(){throw Error(W(321))}function si(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Lt(e[n],t[n]))return!1;return!0}function ii(e,t,n,a,o,l){if(Rr=l,Ce=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,to.current=e===null||e.memoizedState===null?Bm:Mm,e=n(a,o),Jn){l=0;do{if(Jn=!1,fa=0,25<=l)throw Error(W(301));l+=1,$e=Be=null,t.updateQueue=null,to.current=$m,e=n(a,o)}while(Jn)}if(to.current=zo,t=Be!==null&&Be.next!==null,Rr=0,$e=Be=Ce=null,Co=!1,t)throw Error(W(300));return e}function di(){var e=fa!==0;return fa=0,e}function Rt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return $e===null?Ce.memoizedState=$e=e:$e=$e.next=e,$e}function kt(){if(Be===null){var e=Ce.alternate;e=e!==null?e.memoizedState:null}else e=Be.next;var t=$e===null?Ce.memoizedState:$e.next;if(t!==null)$e=t,Be=e;else{if(e===null)throw Error(W(310));Be=e,e={memoizedState:Be.memoizedState,baseState:Be.baseState,baseQueue:Be.baseQueue,queue:Be.queue,next:null},$e===null?Ce.memoizedState=$e=e:$e=$e.next=e}return $e}function ma(e,t){return typeof t=="function"?t(e):t}function kl(e){var t=kt(),n=t.queue;if(n===null)throw Error(W(311));n.lastRenderedReducer=e;var a=Be,o=a.baseQueue,l=n.pending;if(l!==null){if(o!==null){var s=o.next;o.next=l.next,l.next=s}a.baseQueue=o=l,n.pending=null}if(o!==null){l=o.next,a=a.baseState;var i=s=null,d=null,u=l;do{var h=u.lane;if((Rr&h)===h)d!==null&&(d=d.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),a=u.hasEagerState?u.eagerState:e(a,u.action);else{var m={lane:h,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};d===null?(i=d=m,s=a):d=d.next=m,Ce.lanes|=h,Or|=h}u=u.next}while(u!==null&&u!==l);d===null?s=a:d.next=i,Lt(a,t.memoizedState)||(at=!0),t.memoizedState=a,t.baseState=s,t.baseQueue=d,n.lastRenderedState=a}if(e=n.interleaved,e!==null){o=e;do l=o.lane,Ce.lanes|=l,Or|=l,o=o.next;while(o!==e)}else o===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Sl(e){var t=kt(),n=t.queue;if(n===null)throw Error(W(311));n.lastRenderedReducer=e;var a=n.dispatch,o=n.pending,l=t.memoizedState;if(o!==null){n.pending=null;var s=o=o.next;do l=e(l,s.action),s=s.next;while(s!==o);Lt(l,t.memoizedState)||(at=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,a]}function bu(){}function ju(e,t){var n=Ce,a=kt(),o=t(),l=!Lt(a.memoizedState,o);if(l&&(a.memoizedState=o,at=!0),a=a.queue,ci(Su.bind(null,n,a,e),[e]),a.getSnapshot!==t||l||$e!==null&&$e.memoizedState.tag&1){if(n.flags|=2048,xa(9,ku.bind(null,n,a,o,t),void 0,null),Ue===null)throw Error(W(349));Rr&30||wu(n,t,o)}return o}function wu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ce.updateQueue,t===null?(t={lastEffect:null,stores:null},Ce.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ku(e,t,n,a){t.value=n,t.getSnapshot=a,_u(t)&&Nu(e)}function Su(e,t,n){return n(function(){_u(t)&&Nu(e)})}function _u(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Lt(e,n)}catch{return!0}}function Nu(e){var t=Jt(e,1);t!==null&&Tt(t,e,1,-1)}function xd(e){var t=Rt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ma,lastRenderedState:e},t.queue=e,e=e.dispatch=Om.bind(null,Ce,e),[t.memoizedState,e]}function xa(e,t,n,a){return e={tag:e,create:t,destroy:n,deps:a,next:null},t=Ce.updateQueue,t===null?(t={lastEffect:null,stores:null},Ce.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(a=n.next,n.next=e,e.next=a,t.lastEffect=e)),e}function Cu(){return kt().memoizedState}function ro(e,t,n,a){var o=Rt();Ce.flags|=e,o.memoizedState=xa(1|t,n,void 0,a===void 0?null:a)}function Ho(e,t,n,a){var o=kt();a=a===void 0?null:a;var l=void 0;if(Be!==null){var s=Be.memoizedState;if(l=s.destroy,a!==null&&si(a,s.deps)){o.memoizedState=xa(t,n,l,a);return}}Ce.flags|=e,o.memoizedState=xa(1|t,n,l,a)}function gd(e,t){return ro(8390656,8,e,t)}function ci(e,t){return Ho(2048,8,e,t)}function zu(e,t){return Ho(4,2,e,t)}function Eu(e,t){return Ho(4,4,e,t)}function Du(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Pu(e,t,n){return n=n!=null?n.concat([e]):null,Ho(4,4,Du.bind(null,t,e),n)}function ui(){}function Tu(e,t){var n=kt();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&si(t,a[1])?a[0]:(n.memoizedState=[e,t],e)}function Lu(e,t){var n=kt();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&si(t,a[1])?a[0]:(e=e(),n.memoizedState=[e,t],e)}function Iu(e,t,n){return Rr&21?(Lt(n,t)||(n=Mc(),Ce.lanes|=n,Or|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,at=!0),e.memoizedState=n)}function Am(e,t){var n=he;he=n!==0&&4>n?n:4,e(!0);var a=wl.transition;wl.transition={};try{e(!1),t()}finally{he=n,wl.transition=a}}function Au(){return kt().memoizedState}function Rm(e,t,n){var a=gr(e);if(n={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null},Ru(e))Ou(t,n);else if(n=hu(e,t,n,a),n!==null){var o=Ze();Tt(n,e,a,o),Bu(n,t,a)}}function Om(e,t,n){var a=gr(e),o={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ru(e))Ou(t,o);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var s=t.lastRenderedState,i=l(s,n);if(o.hasEagerState=!0,o.eagerState=i,Lt(i,s)){var d=t.interleaved;d===null?(o.next=o,ri(t)):(o.next=d.next,d.next=o),t.interleaved=o;return}}catch{}finally{}n=hu(e,t,o,a),n!==null&&(o=Ze(),Tt(n,e,a,o),Bu(n,t,a))}}function Ru(e){var t=e.alternate;return e===Ce||t!==null&&t===Ce}function Ou(e,t){Jn=Co=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Bu(e,t,n){if(n&4194240){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Fs(e,n)}}var zo={readContext:wt,useCallback:Qe,useContext:Qe,useEffect:Qe,useImperativeHandle:Qe,useInsertionEffect:Qe,useLayoutEffect:Qe,useMemo:Qe,useReducer:Qe,useRef:Qe,useState:Qe,useDebugValue:Qe,useDeferredValue:Qe,useTransition:Qe,useMutableSource:Qe,useSyncExternalStore:Qe,useId:Qe,unstable_isNewReconciler:!1},Bm={readContext:wt,useCallback:function(e,t){return Rt().memoizedState=[e,t===void 0?null:t],e},useContext:wt,useEffect:gd,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ro(4194308,4,Du.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ro(4194308,4,e,t)},useInsertionEffect:function(e,t){return ro(4,2,e,t)},useMemo:function(e,t){var n=Rt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var a=Rt();return t=n!==void 0?n(t):t,a.memoizedState=a.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},a.queue=e,e=e.dispatch=Rm.bind(null,Ce,e),[a.memoizedState,e]},useRef:function(e){var t=Rt();return e={current:e},t.memoizedState=e},useState:xd,useDebugValue:ui,useDeferredValue:function(e){return Rt().memoizedState=e},useTransition:function(){var e=xd(!1),t=e[0];return e=Am.bind(null,e[1]),Rt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var a=Ce,o=Rt();if(_e){if(n===void 0)throw Error(W(407));n=n()}else{if(n=t(),Ue===null)throw Error(W(349));Rr&30||wu(a,t,n)}o.memoizedState=n;var l={value:n,getSnapshot:t};return o.queue=l,gd(Su.bind(null,a,l,e),[e]),a.flags|=2048,xa(9,ku.bind(null,a,l,n,t),void 0,null),n},useId:function(){var e=Rt(),t=Ue.identifierPrefix;if(_e){var n=Vt,a=qt;n=(a&~(1<<32-Pt(a)-1)).toString(32)+n,t=":"+t+"R"+n,n=fa++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Im++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Mm={readContext:wt,useCallback:Tu,useContext:wt,useEffect:ci,useImperativeHandle:Pu,useInsertionEffect:zu,useLayoutEffect:Eu,useMemo:Lu,useReducer:kl,useRef:Cu,useState:function(){return kl(ma)},useDebugValue:ui,useDeferredValue:function(e){var t=kt();return Iu(t,Be.memoizedState,e)},useTransition:function(){var e=kl(ma)[0],t=kt().memoizedState;return[e,t]},useMutableSource:bu,useSyncExternalStore:ju,useId:Au,unstable_isNewReconciler:!1},$m={readContext:wt,useCallback:Tu,useContext:wt,useEffect:ci,useImperativeHandle:Pu,useInsertionEffect:zu,useLayoutEffect:Eu,useMemo:Lu,useReducer:Sl,useRef:Cu,useState:function(){return Sl(ma)},useDebugValue:ui,useDeferredValue:function(e){var t=kt();return Be===null?t.memoizedState=e:Iu(t,Be.memoizedState,e)},useTransition:function(){var e=Sl(ma)[0],t=kt().memoizedState;return[e,t]},useMutableSource:bu,useSyncExternalStore:ju,useId:Au,unstable_isNewReconciler:!1};function zt(e,t){if(e&&e.defaultProps){t=ze({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function cs(e,t,n,a){t=e.memoizedState,n=n(a,t),n=n==null?t:ze({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Qo={isMounted:function(e){return(e=e._reactInternals)?Ur(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var a=Ze(),o=gr(e),l=Qt(a,o);l.payload=t,n!=null&&(l.callback=n),t=mr(e,l,o),t!==null&&(Tt(t,e,o,a),eo(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var a=Ze(),o=gr(e),l=Qt(a,o);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=mr(e,l,o),t!==null&&(Tt(t,e,o,a),eo(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ze(),a=gr(e),o=Qt(n,a);o.tag=2,t!=null&&(o.callback=t),t=mr(e,o,a),t!==null&&(Tt(t,e,a,n),eo(t,e,a))}};function hd(e,t,n,a,o,l,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,l,s):t.prototype&&t.prototype.isPureReactComponent?!sa(n,a)||!sa(o,l):!0}function Mu(e,t,n){var a=!1,o=yr,l=t.contextType;return typeof l=="object"&&l!==null?l=wt(l):(o=lt(t)?Ir:Ke.current,a=t.contextTypes,l=(a=a!=null)?pn(e,o):yr),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Qo,e.stateNode=t,t._reactInternals=e,a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=l),t}function vd(e,t,n,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,a),t.state!==e&&Qo.enqueueReplaceState(t,t.state,null)}function us(e,t,n,a){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs={},ni(e);var l=t.contextType;typeof l=="object"&&l!==null?o.context=wt(l):(l=lt(t)?Ir:Ke.current,o.context=pn(e,l)),o.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(cs(e,t,l,n),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&Qo.enqueueReplaceState(o,o.state,null),_o(e,n,o,a),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function gn(e,t){try{var n="",a=t;do n+=mf(a),a=a.return;while(a);var o=n}catch(l){o=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:o,digest:null}}function _l(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ps(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Um=typeof WeakMap=="function"?WeakMap:Map;function $u(e,t,n){n=Qt(-1,n),n.tag=3,n.payload={element:null};var a=t.value;return n.callback=function(){Do||(Do=!0,ws=a),ps(e,t)},n}function Uu(e,t,n){n=Qt(-1,n),n.tag=3;var a=e.type.getDerivedStateFromError;if(typeof a=="function"){var o=t.value;n.payload=function(){return a(o)},n.callback=function(){ps(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){ps(e,t),typeof a!="function"&&(xr===null?xr=new Set([this]):xr.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function yd(e,t,n){var a=e.pingCache;if(a===null){a=e.pingCache=new Um;var o=new Set;a.set(t,o)}else o=a.get(t),o===void 0&&(o=new Set,a.set(t,o));o.has(n)||(o.add(n),e=tx.bind(null,e,t,n),t.then(e,e))}function bd(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function jd(e,t,n,a,o){return e.mode&1?(e.flags|=65536,e.lanes=o,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Qt(-1,1),t.tag=2,mr(n,t,1))),n.lanes|=1),e)}var Fm=Xt.ReactCurrentOwner,at=!1;function Xe(e,t,n,a){t.child=e===null?gu(t,null,n,a):mn(t,e.child,n,a)}function wd(e,t,n,a,o){n=n.render;var l=t.ref;return dn(t,o),a=ii(e,t,n,a,l,o),n=di(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Kt(e,t,o)):(_e&&n&&Js(t),t.flags|=1,Xe(e,t,a,o),t.child)}function kd(e,t,n,a,o){if(e===null){var l=n.type;return typeof l=="function"&&!yi(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,Fu(e,t,l,a,o)):(e=lo(n.type,null,a,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!(e.lanes&o)){var s=l.memoizedProps;if(n=n.compare,n=n!==null?n:sa,n(s,a)&&e.ref===t.ref)return Kt(e,t,o)}return t.flags|=1,e=hr(l,a),e.ref=t.ref,e.return=t,t.child=e}function Fu(e,t,n,a,o){if(e!==null){var l=e.memoizedProps;if(sa(l,a)&&e.ref===t.ref)if(at=!1,t.pendingProps=a=l,(e.lanes&o)!==0)e.flags&131072&&(at=!0);else return t.lanes=e.lanes,Kt(e,t,o)}return fs(e,t,n,a,o)}function Wu(e,t,n){var a=t.pendingProps,o=a.children,l=e!==null?e.memoizedState:null;if(a.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ye(rn,ct),ct|=n;else{if(!(n&1073741824))return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ye(rn,ct),ct|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},a=l!==null?l.baseLanes:n,ye(rn,ct),ct|=a}else l!==null?(a=l.baseLanes|n,t.memoizedState=null):a=n,ye(rn,ct),ct|=a;return Xe(e,t,o,n),t.child}function qu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function fs(e,t,n,a,o){var l=lt(n)?Ir:Ke.current;return l=pn(t,l),dn(t,o),n=ii(e,t,n,a,l,o),a=di(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Kt(e,t,o)):(_e&&a&&Js(t),t.flags|=1,Xe(e,t,n,o),t.child)}function Sd(e,t,n,a,o){if(lt(n)){var l=!0;bo(t)}else l=!1;if(dn(t,o),t.stateNode===null)no(e,t),Mu(t,n,a),us(t,n,a,o),a=!0;else if(e===null){var s=t.stateNode,i=t.memoizedProps;s.props=i;var d=s.context,u=n.contextType;typeof u=="object"&&u!==null?u=wt(u):(u=lt(n)?Ir:Ke.current,u=pn(t,u));var h=n.getDerivedStateFromProps,m=typeof h=="function"||typeof s.getSnapshotBeforeUpdate=="function";m||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==a||d!==u)&&vd(t,s,a,u),ar=!1;var y=t.memoizedState;s.state=y,_o(t,a,s,o),d=t.memoizedState,i!==a||y!==d||ot.current||ar?(typeof h=="function"&&(cs(t,n,h,a),d=t.memoizedState),(i=ar||hd(t,n,i,a,y,d,u))?(m||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=d),s.props=a,s.state=d,s.context=u,a=i):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{s=t.stateNode,vu(e,t),i=t.memoizedProps,u=t.type===t.elementType?i:zt(t.type,i),s.props=u,m=t.pendingProps,y=s.context,d=n.contextType,typeof d=="object"&&d!==null?d=wt(d):(d=lt(n)?Ir:Ke.current,d=pn(t,d));var w=n.getDerivedStateFromProps;(h=typeof w=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==m||y!==d)&&vd(t,s,a,d),ar=!1,y=t.memoizedState,s.state=y,_o(t,a,s,o);var _=t.memoizedState;i!==m||y!==_||ot.current||ar?(typeof w=="function"&&(cs(t,n,w,a),_=t.memoizedState),(u=ar||hd(t,n,u,a,y,_,d)||!1)?(h||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(a,_,d),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(a,_,d)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&y===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&y===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=_),s.props=a,s.state=_,s.context=d,a=u):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&y===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&y===e.memoizedState||(t.flags|=1024),a=!1)}return ms(e,t,n,a,l,o)}function ms(e,t,n,a,o,l){qu(e,t);var s=(t.flags&128)!==0;if(!a&&!s)return o&&dd(t,n,!1),Kt(e,t,l);a=t.stateNode,Fm.current=t;var i=s&&typeof n.getDerivedStateFromError!="function"?null:a.render();return t.flags|=1,e!==null&&s?(t.child=mn(t,e.child,null,l),t.child=mn(t,null,i,l)):Xe(e,t,i,l),t.memoizedState=a.state,o&&dd(t,n,!0),t.child}function Vu(e){var t=e.stateNode;t.pendingContext?id(e,t.pendingContext,t.pendingContext!==t.context):t.context&&id(e,t.context,!1),ai(e,t.containerInfo)}function _d(e,t,n,a,o){return fn(),Xs(o),t.flags|=256,Xe(e,t,n,a),t.child}var xs={dehydrated:null,treeContext:null,retryLane:0};function gs(e){return{baseLanes:e,cachePool:null,transitions:null}}function Hu(e,t,n){var a=t.pendingProps,o=Ne.current,l=!1,s=(t.flags&128)!==0,i;if((i=s)||(i=e!==null&&e.memoizedState===null?!1:(o&2)!==0),i?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),ye(Ne,o&1),e===null)return is(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(s=a.children,e=a.fallback,l?(a=t.mode,l=t.child,s={mode:"hidden",children:s},!(a&1)&&l!==null?(l.childLanes=0,l.pendingProps=s):l=Jo(s,a,0,null),e=Tr(e,a,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=gs(n),t.memoizedState=xs,e):pi(t,s));if(o=e.memoizedState,o!==null&&(i=o.dehydrated,i!==null))return Wm(e,t,s,a,i,o,n);if(l){l=a.fallback,s=t.mode,o=e.child,i=o.sibling;var d={mode:"hidden",children:a.children};return!(s&1)&&t.child!==o?(a=t.child,a.childLanes=0,a.pendingProps=d,t.deletions=null):(a=hr(o,d),a.subtreeFlags=o.subtreeFlags&14680064),i!==null?l=hr(i,l):(l=Tr(l,s,n,null),l.flags|=2),l.return=t,a.return=t,a.sibling=l,t.child=a,a=l,l=t.child,s=e.child.memoizedState,s=s===null?gs(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},l.memoizedState=s,l.childLanes=e.childLanes&~n,t.memoizedState=xs,a}return l=e.child,e=l.sibling,a=hr(l,{mode:"visible",children:a.children}),!(t.mode&1)&&(a.lanes=n),a.return=t,a.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=a,t.memoizedState=null,a}function pi(e,t){return t=Jo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function qa(e,t,n,a){return a!==null&&Xs(a),mn(t,e.child,null,n),e=pi(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Wm(e,t,n,a,o,l,s){if(n)return t.flags&256?(t.flags&=-257,a=_l(Error(W(422))),qa(e,t,s,a)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=a.fallback,o=t.mode,a=Jo({mode:"visible",children:a.children},o,0,null),l=Tr(l,o,s,null),l.flags|=2,a.return=t,l.return=t,a.sibling=l,t.child=a,t.mode&1&&mn(t,e.child,null,s),t.child.memoizedState=gs(s),t.memoizedState=xs,l);if(!(t.mode&1))return qa(e,t,s,null);if(o.data==="$!"){if(a=o.nextSibling&&o.nextSibling.dataset,a)var i=a.dgst;return a=i,l=Error(W(419)),a=_l(l,a,void 0),qa(e,t,s,a)}if(i=(s&e.childLanes)!==0,at||i){if(a=Ue,a!==null){switch(s&-s){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=o&(a.suspendedLanes|s)?0:o,o!==0&&o!==l.retryLane&&(l.retryLane=o,Jt(e,o),Tt(a,e,o,-1))}return vi(),a=_l(Error(W(421))),qa(e,t,s,a)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=rx.bind(null,e),o._reactRetry=t,null):(e=l.treeContext,ut=fr(o.nextSibling),pt=t,_e=!0,Dt=null,e!==null&&(vt[yt++]=qt,vt[yt++]=Vt,vt[yt++]=Ar,qt=e.id,Vt=e.overflow,Ar=t),t=pi(t,a.children),t.flags|=4096,t)}function Nd(e,t,n){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),ds(e.return,t,n)}function Nl(e,t,n,a,o){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:n,tailMode:o}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=a,l.tail=n,l.tailMode=o)}function Qu(e,t,n){var a=t.pendingProps,o=a.revealOrder,l=a.tail;if(Xe(e,t,a.children,n),a=Ne.current,a&2)a=a&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Nd(e,n,t);else if(e.tag===19)Nd(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}a&=1}if(ye(Ne,a),!(t.mode&1))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;n!==null;)e=n.alternate,e!==null&&No(e)===null&&(o=n),n=n.sibling;n=o,n===null?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Nl(t,!1,o,n,l);break;case"backwards":for(n=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&No(e)===null){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}Nl(t,!0,n,null,l);break;case"together":Nl(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function no(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Kt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Or|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(W(153));if(t.child!==null){for(e=t.child,n=hr(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=hr(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function qm(e,t,n){switch(t.tag){case 3:Vu(t),fn();break;case 5:yu(t);break;case 1:lt(t.type)&&bo(t);break;case 4:ai(t,t.stateNode.containerInfo);break;case 10:var a=t.type._context,o=t.memoizedProps.value;ye(ko,a._currentValue),a._currentValue=o;break;case 13:if(a=t.memoizedState,a!==null)return a.dehydrated!==null?(ye(Ne,Ne.current&1),t.flags|=128,null):n&t.child.childLanes?Hu(e,t,n):(ye(Ne,Ne.current&1),e=Kt(e,t,n),e!==null?e.sibling:null);ye(Ne,Ne.current&1);break;case 19:if(a=(n&t.childLanes)!==0,e.flags&128){if(a)return Qu(e,t,n);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),ye(Ne,Ne.current),a)break;return null;case 22:case 23:return t.lanes=0,Wu(e,t,n)}return Kt(e,t,n)}var Yu,hs,Gu,Ju;Yu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};hs=function(){};Gu=function(e,t,n,a){var o=e.memoizedProps;if(o!==a){e=t.stateNode,Dr(Mt.current);var l=null;switch(n){case"input":o=Ml(e,o),a=Ml(e,a),l=[];break;case"select":o=ze({},o,{value:void 0}),a=ze({},a,{value:void 0}),l=[];break;case"textarea":o=Fl(e,o),a=Fl(e,a),l=[];break;default:typeof o.onClick!="function"&&typeof a.onClick=="function"&&(e.onclick=vo)}ql(n,a);var s;n=null;for(u in o)if(!a.hasOwnProperty(u)&&o.hasOwnProperty(u)&&o[u]!=null)if(u==="style"){var i=o[u];for(s in i)i.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(ea.hasOwnProperty(u)?l||(l=[]):(l=l||[]).push(u,null));for(u in a){var d=a[u];if(i=o!=null?o[u]:void 0,a.hasOwnProperty(u)&&d!==i&&(d!=null||i!=null))if(u==="style")if(i){for(s in i)!i.hasOwnProperty(s)||d&&d.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in d)d.hasOwnProperty(s)&&i[s]!==d[s]&&(n||(n={}),n[s]=d[s])}else n||(l||(l=[]),l.push(u,n)),n=d;else u==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,i=i?i.__html:void 0,d!=null&&i!==d&&(l=l||[]).push(u,d)):u==="children"?typeof d!="string"&&typeof d!="number"||(l=l||[]).push(u,""+d):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(ea.hasOwnProperty(u)?(d!=null&&u==="onScroll"&&we("scroll",e),l||i===d||(l=[])):(l=l||[]).push(u,d))}n&&(l=l||[]).push("style",n);var u=l;(t.updateQueue=u)&&(t.flags|=4)}};Ju=function(e,t,n,a){n!==a&&(t.flags|=4)};function In(e,t){if(!_e)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function Ye(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,a=0;if(t)for(var o=e.child;o!==null;)n|=o.lanes|o.childLanes,a|=o.subtreeFlags&14680064,a|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)n|=o.lanes|o.childLanes,a|=o.subtreeFlags,a|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=a,e.childLanes=n,t}function Vm(e,t,n){var a=t.pendingProps;switch(Ks(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ye(t),null;case 1:return lt(t.type)&&yo(),Ye(t),null;case 3:return a=t.stateNode,xn(),ke(ot),ke(Ke),li(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Fa(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Dt!==null&&(_s(Dt),Dt=null))),hs(e,t),Ye(t),null;case 5:oi(t);var o=Dr(pa.current);if(n=t.type,e!==null&&t.stateNode!=null)Gu(e,t,n,a,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!a){if(t.stateNode===null)throw Error(W(166));return Ye(t),null}if(e=Dr(Mt.current),Fa(t)){a=t.stateNode,n=t.type;var l=t.memoizedProps;switch(a[Ot]=t,a[ca]=l,e=(t.mode&1)!==0,n){case"dialog":we("cancel",a),we("close",a);break;case"iframe":case"object":case"embed":we("load",a);break;case"video":case"audio":for(o=0;o<Mn.length;o++)we(Mn[o],a);break;case"source":we("error",a);break;case"img":case"image":case"link":we("error",a),we("load",a);break;case"details":we("toggle",a);break;case"input":Ai(a,l),we("invalid",a);break;case"select":a._wrapperState={wasMultiple:!!l.multiple},we("invalid",a);break;case"textarea":Oi(a,l),we("invalid",a)}ql(n,l),o=null;for(var s in l)if(l.hasOwnProperty(s)){var i=l[s];s==="children"?typeof i=="string"?a.textContent!==i&&(l.suppressHydrationWarning!==!0&&Ua(a.textContent,i,e),o=["children",i]):typeof i=="number"&&a.textContent!==""+i&&(l.suppressHydrationWarning!==!0&&Ua(a.textContent,i,e),o=["children",""+i]):ea.hasOwnProperty(s)&&i!=null&&s==="onScroll"&&we("scroll",a)}switch(n){case"input":La(a),Ri(a,l,!0);break;case"textarea":La(a),Bi(a);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(a.onclick=vo)}a=o,t.updateQueue=a,a!==null&&(t.flags|=4)}else{s=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Sc(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof a.is=="string"?e=s.createElement(n,{is:a.is}):(e=s.createElement(n),n==="select"&&(s=e,a.multiple?s.multiple=!0:a.size&&(s.size=a.size))):e=s.createElementNS(e,n),e[Ot]=t,e[ca]=a,Yu(e,t,!1,!1),t.stateNode=e;e:{switch(s=Vl(n,a),n){case"dialog":we("cancel",e),we("close",e),o=a;break;case"iframe":case"object":case"embed":we("load",e),o=a;break;case"video":case"audio":for(o=0;o<Mn.length;o++)we(Mn[o],e);o=a;break;case"source":we("error",e),o=a;break;case"img":case"image":case"link":we("error",e),we("load",e),o=a;break;case"details":we("toggle",e),o=a;break;case"input":Ai(e,a),o=Ml(e,a),we("invalid",e);break;case"option":o=a;break;case"select":e._wrapperState={wasMultiple:!!a.multiple},o=ze({},a,{value:void 0}),we("invalid",e);break;case"textarea":Oi(e,a),o=Fl(e,a),we("invalid",e);break;default:o=a}ql(n,o),i=o;for(l in i)if(i.hasOwnProperty(l)){var d=i[l];l==="style"?Cc(e,d):l==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,d!=null&&_c(e,d)):l==="children"?typeof d=="string"?(n!=="textarea"||d!=="")&&ta(e,d):typeof d=="number"&&ta(e,""+d):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(ea.hasOwnProperty(l)?d!=null&&l==="onScroll"&&we("scroll",e):d!=null&&Rs(e,l,d,s))}switch(n){case"input":La(e),Ri(e,a,!1);break;case"textarea":La(e),Bi(e);break;case"option":a.value!=null&&e.setAttribute("value",""+vr(a.value));break;case"select":e.multiple=!!a.multiple,l=a.value,l!=null?an(e,!!a.multiple,l,!1):a.defaultValue!=null&&an(e,!!a.multiple,a.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=vo)}switch(n){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}}a&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ye(t),null;case 6:if(e&&t.stateNode!=null)Ju(e,t,e.memoizedProps,a);else{if(typeof a!="string"&&t.stateNode===null)throw Error(W(166));if(n=Dr(pa.current),Dr(Mt.current),Fa(t)){if(a=t.stateNode,n=t.memoizedProps,a[Ot]=t,(l=a.nodeValue!==n)&&(e=pt,e!==null))switch(e.tag){case 3:Ua(a.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Ua(a.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else a=(n.nodeType===9?n:n.ownerDocument).createTextNode(a),a[Ot]=t,t.stateNode=a}return Ye(t),null;case 13:if(ke(Ne),a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(_e&&ut!==null&&t.mode&1&&!(t.flags&128))mu(),fn(),t.flags|=98560,l=!1;else if(l=Fa(t),a!==null&&a.dehydrated!==null){if(e===null){if(!l)throw Error(W(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(W(317));l[Ot]=t}else fn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Ye(t),l=!1}else Dt!==null&&(_s(Dt),Dt=null),l=!0;if(!l)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(a=a!==null,a!==(e!==null&&e.memoizedState!==null)&&a&&(t.child.flags|=8192,t.mode&1&&(e===null||Ne.current&1?Me===0&&(Me=3):vi())),t.updateQueue!==null&&(t.flags|=4),Ye(t),null);case 4:return xn(),hs(e,t),e===null&&ia(t.stateNode.containerInfo),Ye(t),null;case 10:return ti(t.type._context),Ye(t),null;case 17:return lt(t.type)&&yo(),Ye(t),null;case 19:if(ke(Ne),l=t.memoizedState,l===null)return Ye(t),null;if(a=(t.flags&128)!==0,s=l.rendering,s===null)if(a)In(l,!1);else{if(Me!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=No(e),s!==null){for(t.flags|=128,In(l,!1),a=s.updateQueue,a!==null&&(t.updateQueue=a,t.flags|=4),t.subtreeFlags=0,a=n,n=t.child;n!==null;)l=n,e=a,l.flags&=14680066,s=l.alternate,s===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=s.childLanes,l.lanes=s.lanes,l.child=s.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=s.memoizedProps,l.memoizedState=s.memoizedState,l.updateQueue=s.updateQueue,l.type=s.type,e=s.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return ye(Ne,Ne.current&1|2),t.child}e=e.sibling}l.tail!==null&&Le()>hn&&(t.flags|=128,a=!0,In(l,!1),t.lanes=4194304)}else{if(!a)if(e=No(s),e!==null){if(t.flags|=128,a=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),In(l,!0),l.tail===null&&l.tailMode==="hidden"&&!s.alternate&&!_e)return Ye(t),null}else 2*Le()-l.renderingStartTime>hn&&n!==1073741824&&(t.flags|=128,a=!0,In(l,!1),t.lanes=4194304);l.isBackwards?(s.sibling=t.child,t.child=s):(n=l.last,n!==null?n.sibling=s:t.child=s,l.last=s)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=Le(),t.sibling=null,n=Ne.current,ye(Ne,a?n&1|2:n&1),t):(Ye(t),null);case 22:case 23:return hi(),a=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==a&&(t.flags|=8192),a&&t.mode&1?ct&1073741824&&(Ye(t),t.subtreeFlags&6&&(t.flags|=8192)):Ye(t),null;case 24:return null;case 25:return null}throw Error(W(156,t.tag))}function Hm(e,t){switch(Ks(t),t.tag){case 1:return lt(t.type)&&yo(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return xn(),ke(ot),ke(Ke),li(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return oi(t),null;case 13:if(ke(Ne),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(W(340));fn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ke(Ne),null;case 4:return xn(),null;case 10:return ti(t.type._context),null;case 22:case 23:return hi(),null;case 24:return null;default:return null}}var Va=!1,Ge=!1,Qm=typeof WeakSet=="function"?WeakSet:Set,ee=null;function tn(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(a){De(e,t,a)}else n.current=null}function vs(e,t,n){try{n()}catch(a){De(e,t,a)}}var Cd=!1;function Ym(e,t){if(ts=xo,e=tu(),Gs(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var a=n.getSelection&&n.getSelection();if(a&&a.rangeCount!==0){n=a.anchorNode;var o=a.anchorOffset,l=a.focusNode;a=a.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var s=0,i=-1,d=-1,u=0,h=0,m=e,y=null;t:for(;;){for(var w;m!==n||o!==0&&m.nodeType!==3||(i=s+o),m!==l||a!==0&&m.nodeType!==3||(d=s+a),m.nodeType===3&&(s+=m.nodeValue.length),(w=m.firstChild)!==null;)y=m,m=w;for(;;){if(m===e)break t;if(y===n&&++u===o&&(i=s),y===l&&++h===a&&(d=s),(w=m.nextSibling)!==null)break;m=y,y=m.parentNode}m=w}n=i===-1||d===-1?null:{start:i,end:d}}else n=null}n=n||{start:0,end:0}}else n=null;for(rs={focusedElem:e,selectionRange:n},xo=!1,ee=t;ee!==null;)if(t=ee,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,ee=e;else for(;ee!==null;){t=ee;try{var _=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(_!==null){var S=_.memoizedProps,z=_.memoizedState,x=t.stateNode,f=x.getSnapshotBeforeUpdate(t.elementType===t.type?S:zt(t.type,S),z);x.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var c=t.stateNode.containerInfo;c.nodeType===1?c.textContent="":c.nodeType===9&&c.documentElement&&c.removeChild(c.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(W(163))}}catch(k){De(t,t.return,k)}if(e=t.sibling,e!==null){e.return=t.return,ee=e;break}ee=t.return}return _=Cd,Cd=!1,_}function Kn(e,t,n){var a=t.updateQueue;if(a=a!==null?a.lastEffect:null,a!==null){var o=a=a.next;do{if((o.tag&e)===e){var l=o.destroy;o.destroy=void 0,l!==void 0&&vs(t,n,l)}o=o.next}while(o!==a)}}function Yo(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var a=n.create;n.destroy=a()}n=n.next}while(n!==t)}}function ys(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Ku(e){var t=e.alternate;t!==null&&(e.alternate=null,Ku(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ot],delete t[ca],delete t[os],delete t[Dm],delete t[Pm])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Xu(e){return e.tag===5||e.tag===3||e.tag===4}function zd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Xu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function bs(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=vo));else if(a!==4&&(e=e.child,e!==null))for(bs(e,t,n),e=e.sibling;e!==null;)bs(e,t,n),e=e.sibling}function js(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(a!==4&&(e=e.child,e!==null))for(js(e,t,n),e=e.sibling;e!==null;)js(e,t,n),e=e.sibling}var Fe=null,Et=!1;function rr(e,t,n){for(n=n.child;n!==null;)Zu(e,t,n),n=n.sibling}function Zu(e,t,n){if(Bt&&typeof Bt.onCommitFiberUnmount=="function")try{Bt.onCommitFiberUnmount($o,n)}catch{}switch(n.tag){case 5:Ge||tn(n,t);case 6:var a=Fe,o=Et;Fe=null,rr(e,t,n),Fe=a,Et=o,Fe!==null&&(Et?(e=Fe,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Fe.removeChild(n.stateNode));break;case 18:Fe!==null&&(Et?(e=Fe,n=n.stateNode,e.nodeType===8?yl(e.parentNode,n):e.nodeType===1&&yl(e,n),oa(e)):yl(Fe,n.stateNode));break;case 4:a=Fe,o=Et,Fe=n.stateNode.containerInfo,Et=!0,rr(e,t,n),Fe=a,Et=o;break;case 0:case 11:case 14:case 15:if(!Ge&&(a=n.updateQueue,a!==null&&(a=a.lastEffect,a!==null))){o=a=a.next;do{var l=o,s=l.destroy;l=l.tag,s!==void 0&&(l&2||l&4)&&vs(n,t,s),o=o.next}while(o!==a)}rr(e,t,n);break;case 1:if(!Ge&&(tn(n,t),a=n.stateNode,typeof a.componentWillUnmount=="function"))try{a.props=n.memoizedProps,a.state=n.memoizedState,a.componentWillUnmount()}catch(i){De(n,t,i)}rr(e,t,n);break;case 21:rr(e,t,n);break;case 22:n.mode&1?(Ge=(a=Ge)||n.memoizedState!==null,rr(e,t,n),Ge=a):rr(e,t,n);break;default:rr(e,t,n)}}function Ed(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Qm),t.forEach(function(a){var o=nx.bind(null,e,a);n.has(a)||(n.add(a),a.then(o,o))})}}function Ct(e,t){var n=t.deletions;if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];try{var l=e,s=t,i=s;e:for(;i!==null;){switch(i.tag){case 5:Fe=i.stateNode,Et=!1;break e;case 3:Fe=i.stateNode.containerInfo,Et=!0;break e;case 4:Fe=i.stateNode.containerInfo,Et=!0;break e}i=i.return}if(Fe===null)throw Error(W(160));Zu(l,s,o),Fe=null,Et=!1;var d=o.alternate;d!==null&&(d.return=null),o.return=null}catch(u){De(o,t,u)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)ep(t,e),t=t.sibling}function ep(e,t){var n=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ct(t,e),At(e),a&4){try{Kn(3,e,e.return),Yo(3,e)}catch(S){De(e,e.return,S)}try{Kn(5,e,e.return)}catch(S){De(e,e.return,S)}}break;case 1:Ct(t,e),At(e),a&512&&n!==null&&tn(n,n.return);break;case 5:if(Ct(t,e),At(e),a&512&&n!==null&&tn(n,n.return),e.flags&32){var o=e.stateNode;try{ta(o,"")}catch(S){De(e,e.return,S)}}if(a&4&&(o=e.stateNode,o!=null)){var l=e.memoizedProps,s=n!==null?n.memoizedProps:l,i=e.type,d=e.updateQueue;if(e.updateQueue=null,d!==null)try{i==="input"&&l.type==="radio"&&l.name!=null&&wc(o,l),Vl(i,s);var u=Vl(i,l);for(s=0;s<d.length;s+=2){var h=d[s],m=d[s+1];h==="style"?Cc(o,m):h==="dangerouslySetInnerHTML"?_c(o,m):h==="children"?ta(o,m):Rs(o,h,m,u)}switch(i){case"input":$l(o,l);break;case"textarea":kc(o,l);break;case"select":var y=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!l.multiple;var w=l.value;w!=null?an(o,!!l.multiple,w,!1):y!==!!l.multiple&&(l.defaultValue!=null?an(o,!!l.multiple,l.defaultValue,!0):an(o,!!l.multiple,l.multiple?[]:"",!1))}o[ca]=l}catch(S){De(e,e.return,S)}}break;case 6:if(Ct(t,e),At(e),a&4){if(e.stateNode===null)throw Error(W(162));o=e.stateNode,l=e.memoizedProps;try{o.nodeValue=l}catch(S){De(e,e.return,S)}}break;case 3:if(Ct(t,e),At(e),a&4&&n!==null&&n.memoizedState.isDehydrated)try{oa(t.containerInfo)}catch(S){De(e,e.return,S)}break;case 4:Ct(t,e),At(e);break;case 13:Ct(t,e),At(e),o=e.child,o.flags&8192&&(l=o.memoizedState!==null,o.stateNode.isHidden=l,!l||o.alternate!==null&&o.alternate.memoizedState!==null||(xi=Le())),a&4&&Ed(e);break;case 22:if(h=n!==null&&n.memoizedState!==null,e.mode&1?(Ge=(u=Ge)||h,Ct(t,e),Ge=u):Ct(t,e),At(e),a&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!h&&e.mode&1)for(ee=e,h=e.child;h!==null;){for(m=ee=h;ee!==null;){switch(y=ee,w=y.child,y.tag){case 0:case 11:case 14:case 15:Kn(4,y,y.return);break;case 1:tn(y,y.return);var _=y.stateNode;if(typeof _.componentWillUnmount=="function"){a=y,n=y.return;try{t=a,_.props=t.memoizedProps,_.state=t.memoizedState,_.componentWillUnmount()}catch(S){De(a,n,S)}}break;case 5:tn(y,y.return);break;case 22:if(y.memoizedState!==null){Pd(m);continue}}w!==null?(w.return=y,ee=w):Pd(m)}h=h.sibling}e:for(h=null,m=e;;){if(m.tag===5){if(h===null){h=m;try{o=m.stateNode,u?(l=o.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(i=m.stateNode,d=m.memoizedProps.style,s=d!=null&&d.hasOwnProperty("display")?d.display:null,i.style.display=Nc("display",s))}catch(S){De(e,e.return,S)}}}else if(m.tag===6){if(h===null)try{m.stateNode.nodeValue=u?"":m.memoizedProps}catch(S){De(e,e.return,S)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;h===m&&(h=null),m=m.return}h===m&&(h=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Ct(t,e),At(e),a&4&&Ed(e);break;case 21:break;default:Ct(t,e),At(e)}}function At(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Xu(n)){var a=n;break e}n=n.return}throw Error(W(160))}switch(a.tag){case 5:var o=a.stateNode;a.flags&32&&(ta(o,""),a.flags&=-33);var l=zd(e);js(e,l,o);break;case 3:case 4:var s=a.stateNode.containerInfo,i=zd(e);bs(e,i,s);break;default:throw Error(W(161))}}catch(d){De(e,e.return,d)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Gm(e,t,n){ee=e,tp(e)}function tp(e,t,n){for(var a=(e.mode&1)!==0;ee!==null;){var o=ee,l=o.child;if(o.tag===22&&a){var s=o.memoizedState!==null||Va;if(!s){var i=o.alternate,d=i!==null&&i.memoizedState!==null||Ge;i=Va;var u=Ge;if(Va=s,(Ge=d)&&!u)for(ee=o;ee!==null;)s=ee,d=s.child,s.tag===22&&s.memoizedState!==null?Td(o):d!==null?(d.return=s,ee=d):Td(o);for(;l!==null;)ee=l,tp(l),l=l.sibling;ee=o,Va=i,Ge=u}Dd(e)}else o.subtreeFlags&8772&&l!==null?(l.return=o,ee=l):Dd(e)}}function Dd(e){for(;ee!==null;){var t=ee;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Ge||Yo(5,t);break;case 1:var a=t.stateNode;if(t.flags&4&&!Ge)if(n===null)a.componentDidMount();else{var o=t.elementType===t.type?n.memoizedProps:zt(t.type,n.memoizedProps);a.componentDidUpdate(o,n.memoizedState,a.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&md(t,l,a);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}md(t,s,n)}break;case 5:var i=t.stateNode;if(n===null&&t.flags&4){n=i;var d=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":d.autoFocus&&n.focus();break;case"img":d.src&&(n.src=d.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var h=u.memoizedState;if(h!==null){var m=h.dehydrated;m!==null&&oa(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(W(163))}Ge||t.flags&512&&ys(t)}catch(y){De(t,t.return,y)}}if(t===e){ee=null;break}if(n=t.sibling,n!==null){n.return=t.return,ee=n;break}ee=t.return}}function Pd(e){for(;ee!==null;){var t=ee;if(t===e){ee=null;break}var n=t.sibling;if(n!==null){n.return=t.return,ee=n;break}ee=t.return}}function Td(e){for(;ee!==null;){var t=ee;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Yo(4,t)}catch(d){De(t,n,d)}break;case 1:var a=t.stateNode;if(typeof a.componentDidMount=="function"){var o=t.return;try{a.componentDidMount()}catch(d){De(t,o,d)}}var l=t.return;try{ys(t)}catch(d){De(t,l,d)}break;case 5:var s=t.return;try{ys(t)}catch(d){De(t,s,d)}}}catch(d){De(t,t.return,d)}if(t===e){ee=null;break}var i=t.sibling;if(i!==null){i.return=t.return,ee=i;break}ee=t.return}}var Jm=Math.ceil,Eo=Xt.ReactCurrentDispatcher,fi=Xt.ReactCurrentOwner,jt=Xt.ReactCurrentBatchConfig,fe=0,Ue=null,Ae=null,We=0,ct=0,rn=wr(0),Me=0,ga=null,Or=0,Go=0,mi=0,Xn=null,nt=null,xi=0,hn=1/0,Ft=null,Do=!1,ws=null,xr=null,Ha=!1,ir=null,Po=0,Zn=0,ks=null,ao=-1,oo=0;function Ze(){return fe&6?Le():ao!==-1?ao:ao=Le()}function gr(e){return e.mode&1?fe&2&&We!==0?We&-We:Lm.transition!==null?(oo===0&&(oo=Mc()),oo):(e=he,e!==0||(e=window.event,e=e===void 0?16:Hc(e.type)),e):1}function Tt(e,t,n,a){if(50<Zn)throw Zn=0,ks=null,Error(W(185));ba(e,n,a),(!(fe&2)||e!==Ue)&&(e===Ue&&(!(fe&2)&&(Go|=n),Me===4&&lr(e,We)),st(e,a),n===1&&fe===0&&!(t.mode&1)&&(hn=Le()+500,Vo&&kr()))}function st(e,t){var n=e.callbackNode;Lf(e,t);var a=mo(e,e===Ue?We:0);if(a===0)n!==null&&Ui(n),e.callbackNode=null,e.callbackPriority=0;else if(t=a&-a,e.callbackPriority!==t){if(n!=null&&Ui(n),t===1)e.tag===0?Tm(Ld.bind(null,e)):uu(Ld.bind(null,e)),zm(function(){!(fe&6)&&kr()}),n=null;else{switch($c(a)){case 1:n=Us;break;case 4:n=Oc;break;case 16:n=fo;break;case 536870912:n=Bc;break;default:n=fo}n=dp(n,rp.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function rp(e,t){if(ao=-1,oo=0,fe&6)throw Error(W(327));var n=e.callbackNode;if(cn()&&e.callbackNode!==n)return null;var a=mo(e,e===Ue?We:0);if(a===0)return null;if(a&30||a&e.expiredLanes||t)t=To(e,a);else{t=a;var o=fe;fe|=2;var l=ap();(Ue!==e||We!==t)&&(Ft=null,hn=Le()+500,Pr(e,t));do try{Zm();break}catch(i){np(e,i)}while(!0);ei(),Eo.current=l,fe=o,Ae!==null?t=0:(Ue=null,We=0,t=Me)}if(t!==0){if(t===2&&(o=Jl(e),o!==0&&(a=o,t=Ss(e,o))),t===1)throw n=ga,Pr(e,0),lr(e,a),st(e,Le()),n;if(t===6)lr(e,a);else{if(o=e.current.alternate,!(a&30)&&!Km(o)&&(t=To(e,a),t===2&&(l=Jl(e),l!==0&&(a=l,t=Ss(e,l))),t===1))throw n=ga,Pr(e,0),lr(e,a),st(e,Le()),n;switch(e.finishedWork=o,e.finishedLanes=a,t){case 0:case 1:throw Error(W(345));case 2:Cr(e,nt,Ft);break;case 3:if(lr(e,a),(a&130023424)===a&&(t=xi+500-Le(),10<t)){if(mo(e,0)!==0)break;if(o=e.suspendedLanes,(o&a)!==a){Ze(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=as(Cr.bind(null,e,nt,Ft),t);break}Cr(e,nt,Ft);break;case 4:if(lr(e,a),(a&4194240)===a)break;for(t=e.eventTimes,o=-1;0<a;){var s=31-Pt(a);l=1<<s,s=t[s],s>o&&(o=s),a&=~l}if(a=o,a=Le()-a,a=(120>a?120:480>a?480:1080>a?1080:1920>a?1920:3e3>a?3e3:4320>a?4320:1960*Jm(a/1960))-a,10<a){e.timeoutHandle=as(Cr.bind(null,e,nt,Ft),a);break}Cr(e,nt,Ft);break;case 5:Cr(e,nt,Ft);break;default:throw Error(W(329))}}}return st(e,Le()),e.callbackNode===n?rp.bind(null,e):null}function Ss(e,t){var n=Xn;return e.current.memoizedState.isDehydrated&&(Pr(e,t).flags|=256),e=To(e,t),e!==2&&(t=nt,nt=n,t!==null&&_s(t)),e}function _s(e){nt===null?nt=e:nt.push.apply(nt,e)}function Km(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var a=0;a<n.length;a++){var o=n[a],l=o.getSnapshot;o=o.value;try{if(!Lt(l(),o))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function lr(e,t){for(t&=~mi,t&=~Go,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Pt(t),a=1<<n;e[n]=-1,t&=~a}}function Ld(e){if(fe&6)throw Error(W(327));cn();var t=mo(e,0);if(!(t&1))return st(e,Le()),null;var n=To(e,t);if(e.tag!==0&&n===2){var a=Jl(e);a!==0&&(t=a,n=Ss(e,a))}if(n===1)throw n=ga,Pr(e,0),lr(e,t),st(e,Le()),n;if(n===6)throw Error(W(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Cr(e,nt,Ft),st(e,Le()),null}function gi(e,t){var n=fe;fe|=1;try{return e(t)}finally{fe=n,fe===0&&(hn=Le()+500,Vo&&kr())}}function Br(e){ir!==null&&ir.tag===0&&!(fe&6)&&cn();var t=fe;fe|=1;var n=jt.transition,a=he;try{if(jt.transition=null,he=1,e)return e()}finally{he=a,jt.transition=n,fe=t,!(fe&6)&&kr()}}function hi(){ct=rn.current,ke(rn)}function Pr(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Cm(n)),Ae!==null)for(n=Ae.return;n!==null;){var a=n;switch(Ks(a),a.tag){case 1:a=a.type.childContextTypes,a!=null&&yo();break;case 3:xn(),ke(ot),ke(Ke),li();break;case 5:oi(a);break;case 4:xn();break;case 13:ke(Ne);break;case 19:ke(Ne);break;case 10:ti(a.type._context);break;case 22:case 23:hi()}n=n.return}if(Ue=e,Ae=e=hr(e.current,null),We=ct=t,Me=0,ga=null,mi=Go=Or=0,nt=Xn=null,Er!==null){for(t=0;t<Er.length;t++)if(n=Er[t],a=n.interleaved,a!==null){n.interleaved=null;var o=a.next,l=n.pending;if(l!==null){var s=l.next;l.next=o,a.next=s}n.pending=a}Er=null}return e}function np(e,t){do{var n=Ae;try{if(ei(),to.current=zo,Co){for(var a=Ce.memoizedState;a!==null;){var o=a.queue;o!==null&&(o.pending=null),a=a.next}Co=!1}if(Rr=0,$e=Be=Ce=null,Jn=!1,fa=0,fi.current=null,n===null||n.return===null){Me=1,ga=t,Ae=null;break}e:{var l=e,s=n.return,i=n,d=t;if(t=We,i.flags|=32768,d!==null&&typeof d=="object"&&typeof d.then=="function"){var u=d,h=i,m=h.tag;if(!(h.mode&1)&&(m===0||m===11||m===15)){var y=h.alternate;y?(h.updateQueue=y.updateQueue,h.memoizedState=y.memoizedState,h.lanes=y.lanes):(h.updateQueue=null,h.memoizedState=null)}var w=bd(s);if(w!==null){w.flags&=-257,jd(w,s,i,l,t),w.mode&1&&yd(l,u,t),t=w,d=u;var _=t.updateQueue;if(_===null){var S=new Set;S.add(d),t.updateQueue=S}else _.add(d);break e}else{if(!(t&1)){yd(l,u,t),vi();break e}d=Error(W(426))}}else if(_e&&i.mode&1){var z=bd(s);if(z!==null){!(z.flags&65536)&&(z.flags|=256),jd(z,s,i,l,t),Xs(gn(d,i));break e}}l=d=gn(d,i),Me!==4&&(Me=2),Xn===null?Xn=[l]:Xn.push(l),l=s;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var x=$u(l,d,t);fd(l,x);break e;case 1:i=d;var f=l.type,c=l.stateNode;if(!(l.flags&128)&&(typeof f.getDerivedStateFromError=="function"||c!==null&&typeof c.componentDidCatch=="function"&&(xr===null||!xr.has(c)))){l.flags|=65536,t&=-t,l.lanes|=t;var k=Uu(l,i,t);fd(l,k);break e}}l=l.return}while(l!==null)}lp(n)}catch(I){t=I,Ae===n&&n!==null&&(Ae=n=n.return);continue}break}while(!0)}function ap(){var e=Eo.current;return Eo.current=zo,e===null?zo:e}function vi(){(Me===0||Me===3||Me===2)&&(Me=4),Ue===null||!(Or&268435455)&&!(Go&268435455)||lr(Ue,We)}function To(e,t){var n=fe;fe|=2;var a=ap();(Ue!==e||We!==t)&&(Ft=null,Pr(e,t));do try{Xm();break}catch(o){np(e,o)}while(!0);if(ei(),fe=n,Eo.current=a,Ae!==null)throw Error(W(261));return Ue=null,We=0,Me}function Xm(){for(;Ae!==null;)op(Ae)}function Zm(){for(;Ae!==null&&!Sf();)op(Ae)}function op(e){var t=ip(e.alternate,e,ct);e.memoizedProps=e.pendingProps,t===null?lp(e):Ae=t,fi.current=null}function lp(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Hm(n,t),n!==null){n.flags&=32767,Ae=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Me=6,Ae=null;return}}else if(n=Vm(n,t,ct),n!==null){Ae=n;return}if(t=t.sibling,t!==null){Ae=t;return}Ae=t=e}while(t!==null);Me===0&&(Me=5)}function Cr(e,t,n){var a=he,o=jt.transition;try{jt.transition=null,he=1,ex(e,t,n,a)}finally{jt.transition=o,he=a}return null}function ex(e,t,n,a){do cn();while(ir!==null);if(fe&6)throw Error(W(327));n=e.finishedWork;var o=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(W(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if(If(e,l),e===Ue&&(Ae=Ue=null,We=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Ha||(Ha=!0,dp(fo,function(){return cn(),null})),l=(n.flags&15990)!==0,n.subtreeFlags&15990||l){l=jt.transition,jt.transition=null;var s=he;he=1;var i=fe;fe|=4,fi.current=null,Ym(e,n),ep(n,e),bm(rs),xo=!!ts,rs=ts=null,e.current=n,Gm(n),_f(),fe=i,he=s,jt.transition=l}else e.current=n;if(Ha&&(Ha=!1,ir=e,Po=o),l=e.pendingLanes,l===0&&(xr=null),zf(n.stateNode),st(e,Le()),t!==null)for(a=e.onRecoverableError,n=0;n<t.length;n++)o=t[n],a(o.value,{componentStack:o.stack,digest:o.digest});if(Do)throw Do=!1,e=ws,ws=null,e;return Po&1&&e.tag!==0&&cn(),l=e.pendingLanes,l&1?e===ks?Zn++:(Zn=0,ks=e):Zn=0,kr(),null}function cn(){if(ir!==null){var e=$c(Po),t=jt.transition,n=he;try{if(jt.transition=null,he=16>e?16:e,ir===null)var a=!1;else{if(e=ir,ir=null,Po=0,fe&6)throw Error(W(331));var o=fe;for(fe|=4,ee=e.current;ee!==null;){var l=ee,s=l.child;if(ee.flags&16){var i=l.deletions;if(i!==null){for(var d=0;d<i.length;d++){var u=i[d];for(ee=u;ee!==null;){var h=ee;switch(h.tag){case 0:case 11:case 15:Kn(8,h,l)}var m=h.child;if(m!==null)m.return=h,ee=m;else for(;ee!==null;){h=ee;var y=h.sibling,w=h.return;if(Ku(h),h===u){ee=null;break}if(y!==null){y.return=w,ee=y;break}ee=w}}}var _=l.alternate;if(_!==null){var S=_.child;if(S!==null){_.child=null;do{var z=S.sibling;S.sibling=null,S=z}while(S!==null)}}ee=l}}if(l.subtreeFlags&2064&&s!==null)s.return=l,ee=s;else e:for(;ee!==null;){if(l=ee,l.flags&2048)switch(l.tag){case 0:case 11:case 15:Kn(9,l,l.return)}var x=l.sibling;if(x!==null){x.return=l.return,ee=x;break e}ee=l.return}}var f=e.current;for(ee=f;ee!==null;){s=ee;var c=s.child;if(s.subtreeFlags&2064&&c!==null)c.return=s,ee=c;else e:for(s=f;ee!==null;){if(i=ee,i.flags&2048)try{switch(i.tag){case 0:case 11:case 15:Yo(9,i)}}catch(I){De(i,i.return,I)}if(i===s){ee=null;break e}var k=i.sibling;if(k!==null){k.return=i.return,ee=k;break e}ee=i.return}}if(fe=o,kr(),Bt&&typeof Bt.onPostCommitFiberRoot=="function")try{Bt.onPostCommitFiberRoot($o,e)}catch{}a=!0}return a}finally{he=n,jt.transition=t}}return!1}function Id(e,t,n){t=gn(n,t),t=$u(e,t,1),e=mr(e,t,1),t=Ze(),e!==null&&(ba(e,1,t),st(e,t))}function De(e,t,n){if(e.tag===3)Id(e,e,n);else for(;t!==null;){if(t.tag===3){Id(t,e,n);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(xr===null||!xr.has(a))){e=gn(n,e),e=Uu(t,e,1),t=mr(t,e,1),e=Ze(),t!==null&&(ba(t,1,e),st(t,e));break}}t=t.return}}function tx(e,t,n){var a=e.pingCache;a!==null&&a.delete(t),t=Ze(),e.pingedLanes|=e.suspendedLanes&n,Ue===e&&(We&n)===n&&(Me===4||Me===3&&(We&130023424)===We&&500>Le()-xi?Pr(e,0):mi|=n),st(e,t)}function sp(e,t){t===0&&(e.mode&1?(t=Ra,Ra<<=1,!(Ra&130023424)&&(Ra=4194304)):t=1);var n=Ze();e=Jt(e,t),e!==null&&(ba(e,t,n),st(e,n))}function rx(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),sp(e,n)}function nx(e,t){var n=0;switch(e.tag){case 13:var a=e.stateNode,o=e.memoizedState;o!==null&&(n=o.retryLane);break;case 19:a=e.stateNode;break;default:throw Error(W(314))}a!==null&&a.delete(t),sp(e,n)}var ip;ip=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ot.current)at=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return at=!1,qm(e,t,n);at=!!(e.flags&131072)}else at=!1,_e&&t.flags&1048576&&pu(t,wo,t.index);switch(t.lanes=0,t.tag){case 2:var a=t.type;no(e,t),e=t.pendingProps;var o=pn(t,Ke.current);dn(t,n),o=ii(null,t,a,e,o,n);var l=di();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,lt(a)?(l=!0,bo(t)):l=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,ni(t),o.updater=Qo,t.stateNode=o,o._reactInternals=t,us(t,a,e,n),t=ms(null,t,a,!0,l,n)):(t.tag=0,_e&&l&&Js(t),Xe(null,t,o,n),t=t.child),t;case 16:a=t.elementType;e:{switch(no(e,t),e=t.pendingProps,o=a._init,a=o(a._payload),t.type=a,o=t.tag=ox(a),e=zt(a,e),o){case 0:t=fs(null,t,a,e,n);break e;case 1:t=Sd(null,t,a,e,n);break e;case 11:t=wd(null,t,a,e,n);break e;case 14:t=kd(null,t,a,zt(a.type,e),n);break e}throw Error(W(306,a,""))}return t;case 0:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:zt(a,o),fs(e,t,a,o,n);case 1:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:zt(a,o),Sd(e,t,a,o,n);case 3:e:{if(Vu(t),e===null)throw Error(W(387));a=t.pendingProps,l=t.memoizedState,o=l.element,vu(e,t),_o(t,a,null,n);var s=t.memoizedState;if(a=s.element,l.isDehydrated)if(l={element:a,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){o=gn(Error(W(423)),t),t=_d(e,t,a,n,o);break e}else if(a!==o){o=gn(Error(W(424)),t),t=_d(e,t,a,n,o);break e}else for(ut=fr(t.stateNode.containerInfo.firstChild),pt=t,_e=!0,Dt=null,n=gu(t,null,a,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(fn(),a===o){t=Kt(e,t,n);break e}Xe(e,t,a,n)}t=t.child}return t;case 5:return yu(t),e===null&&is(t),a=t.type,o=t.pendingProps,l=e!==null?e.memoizedProps:null,s=o.children,ns(a,o)?s=null:l!==null&&ns(a,l)&&(t.flags|=32),qu(e,t),Xe(e,t,s,n),t.child;case 6:return e===null&&is(t),null;case 13:return Hu(e,t,n);case 4:return ai(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=mn(t,null,a,n):Xe(e,t,a,n),t.child;case 11:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:zt(a,o),wd(e,t,a,o,n);case 7:return Xe(e,t,t.pendingProps,n),t.child;case 8:return Xe(e,t,t.pendingProps.children,n),t.child;case 12:return Xe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(a=t.type._context,o=t.pendingProps,l=t.memoizedProps,s=o.value,ye(ko,a._currentValue),a._currentValue=s,l!==null)if(Lt(l.value,s)){if(l.children===o.children&&!ot.current){t=Kt(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var i=l.dependencies;if(i!==null){s=l.child;for(var d=i.firstContext;d!==null;){if(d.context===a){if(l.tag===1){d=Qt(-1,n&-n),d.tag=2;var u=l.updateQueue;if(u!==null){u=u.shared;var h=u.pending;h===null?d.next=d:(d.next=h.next,h.next=d),u.pending=d}}l.lanes|=n,d=l.alternate,d!==null&&(d.lanes|=n),ds(l.return,n,t),i.lanes|=n;break}d=d.next}}else if(l.tag===10)s=l.type===t.type?null:l.child;else if(l.tag===18){if(s=l.return,s===null)throw Error(W(341));s.lanes|=n,i=s.alternate,i!==null&&(i.lanes|=n),ds(s,n,t),s=l.sibling}else s=l.child;if(s!==null)s.return=l;else for(s=l;s!==null;){if(s===t){s=null;break}if(l=s.sibling,l!==null){l.return=s.return,s=l;break}s=s.return}l=s}Xe(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,a=t.pendingProps.children,dn(t,n),o=wt(o),a=a(o),t.flags|=1,Xe(e,t,a,n),t.child;case 14:return a=t.type,o=zt(a,t.pendingProps),o=zt(a.type,o),kd(e,t,a,o,n);case 15:return Fu(e,t,t.type,t.pendingProps,n);case 17:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:zt(a,o),no(e,t),t.tag=1,lt(a)?(e=!0,bo(t)):e=!1,dn(t,n),Mu(t,a,o),us(t,a,o,n),ms(null,t,a,!0,e,n);case 19:return Qu(e,t,n);case 22:return Wu(e,t,n)}throw Error(W(156,t.tag))};function dp(e,t){return Rc(e,t)}function ax(e,t,n,a){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function bt(e,t,n,a){return new ax(e,t,n,a)}function yi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function ox(e){if(typeof e=="function")return yi(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Bs)return 11;if(e===Ms)return 14}return 2}function hr(e,t){var n=e.alternate;return n===null?(n=bt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function lo(e,t,n,a,o,l){var s=2;if(a=e,typeof e=="function")yi(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case Hr:return Tr(n.children,o,l,t);case Os:s=8,o|=8;break;case Al:return e=bt(12,n,t,o|2),e.elementType=Al,e.lanes=l,e;case Rl:return e=bt(13,n,t,o),e.elementType=Rl,e.lanes=l,e;case Ol:return e=bt(19,n,t,o),e.elementType=Ol,e.lanes=l,e;case yc:return Jo(n,o,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case hc:s=10;break e;case vc:s=9;break e;case Bs:s=11;break e;case Ms:s=14;break e;case nr:s=16,a=null;break e}throw Error(W(130,e==null?e:typeof e,""))}return t=bt(s,n,t,o),t.elementType=e,t.type=a,t.lanes=l,t}function Tr(e,t,n,a){return e=bt(7,e,a,t),e.lanes=n,e}function Jo(e,t,n,a){return e=bt(22,e,a,t),e.elementType=yc,e.lanes=n,e.stateNode={isHidden:!1},e}function Cl(e,t,n){return e=bt(6,e,null,t),e.lanes=n,e}function zl(e,t,n){return t=bt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function lx(e,t,n,a,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=il(0),this.expirationTimes=il(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=il(0),this.identifierPrefix=a,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function bi(e,t,n,a,o,l,s,i,d){return e=new lx(e,t,n,i,d),t===1?(t=1,l===!0&&(t|=8)):t=0,l=bt(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:a,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},ni(l),e}function sx(e,t,n){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Vr,key:a==null?null:""+a,children:e,containerInfo:t,implementation:n}}function cp(e){if(!e)return yr;e=e._reactInternals;e:{if(Ur(e)!==e||e.tag!==1)throw Error(W(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(lt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(W(171))}if(e.tag===1){var n=e.type;if(lt(n))return cu(e,n,t)}return t}function up(e,t,n,a,o,l,s,i,d){return e=bi(n,a,!0,e,o,l,s,i,d),e.context=cp(null),n=e.current,a=Ze(),o=gr(n),l=Qt(a,o),l.callback=t??null,mr(n,l,o),e.current.lanes=o,ba(e,o,a),st(e,a),e}function Ko(e,t,n,a){var o=t.current,l=Ze(),s=gr(o);return n=cp(n),t.context===null?t.context=n:t.pendingContext=n,t=Qt(l,s),t.payload={element:e},a=a===void 0?null:a,a!==null&&(t.callback=a),e=mr(o,t,s),e!==null&&(Tt(e,o,s,l),eo(e,o,s)),s}function Lo(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ad(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ji(e,t){Ad(e,t),(e=e.alternate)&&Ad(e,t)}function ix(){return null}var pp=typeof reportError=="function"?reportError:function(e){console.error(e)};function wi(e){this._internalRoot=e}Xo.prototype.render=wi.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(W(409));Ko(e,t,null,null)};Xo.prototype.unmount=wi.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Br(function(){Ko(null,e,null,null)}),t[Gt]=null}};function Xo(e){this._internalRoot=e}Xo.prototype.unstable_scheduleHydration=function(e){if(e){var t=Wc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<or.length&&t!==0&&t<or[n].priority;n++);or.splice(n,0,e),n===0&&Vc(e)}};function ki(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Zo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Rd(){}function dx(e,t,n,a,o){if(o){if(typeof a=="function"){var l=a;a=function(){var u=Lo(s);l.call(u)}}var s=up(t,a,e,0,null,!1,!1,"",Rd);return e._reactRootContainer=s,e[Gt]=s.current,ia(e.nodeType===8?e.parentNode:e),Br(),s}for(;o=e.lastChild;)e.removeChild(o);if(typeof a=="function"){var i=a;a=function(){var u=Lo(d);i.call(u)}}var d=bi(e,0,!1,null,null,!1,!1,"",Rd);return e._reactRootContainer=d,e[Gt]=d.current,ia(e.nodeType===8?e.parentNode:e),Br(function(){Ko(t,d,n,a)}),d}function el(e,t,n,a,o){var l=n._reactRootContainer;if(l){var s=l;if(typeof o=="function"){var i=o;o=function(){var d=Lo(s);i.call(d)}}Ko(t,s,e,o)}else s=dx(n,t,e,o,a);return Lo(s)}Uc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Bn(t.pendingLanes);n!==0&&(Fs(t,n|1),st(t,Le()),!(fe&6)&&(hn=Le()+500,kr()))}break;case 13:Br(function(){var a=Jt(e,1);if(a!==null){var o=Ze();Tt(a,e,1,o)}}),ji(e,1)}};Ws=function(e){if(e.tag===13){var t=Jt(e,134217728);if(t!==null){var n=Ze();Tt(t,e,134217728,n)}ji(e,134217728)}};Fc=function(e){if(e.tag===13){var t=gr(e),n=Jt(e,t);if(n!==null){var a=Ze();Tt(n,e,t,a)}ji(e,t)}};Wc=function(){return he};qc=function(e,t){var n=he;try{return he=e,t()}finally{he=n}};Ql=function(e,t,n){switch(t){case"input":if($l(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var a=n[t];if(a!==e&&a.form===e.form){var o=qo(a);if(!o)throw Error(W(90));jc(a),$l(a,o)}}}break;case"textarea":kc(e,n);break;case"select":t=n.value,t!=null&&an(e,!!n.multiple,t,!1)}};Dc=gi;Pc=Br;var cx={usingClientEntryPoint:!1,Events:[wa,Jr,qo,zc,Ec,gi]},An={findFiberByHostInstance:zr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},ux={bundleType:An.bundleType,version:An.version,rendererPackageName:An.rendererPackageName,rendererConfig:An.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Xt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ic(e),e===null?null:e.stateNode},findFiberByHostInstance:An.findFiberByHostInstance||ix,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Qa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Qa.isDisabled&&Qa.supportsFiber)try{$o=Qa.inject(ux),Bt=Qa}catch{}}mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=cx;mt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ki(t))throw Error(W(200));return sx(e,t,null,n)};mt.createRoot=function(e,t){if(!ki(e))throw Error(W(299));var n=!1,a="",o=pp;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=bi(e,1,!1,null,null,n,!1,a,o),e[Gt]=t.current,ia(e.nodeType===8?e.parentNode:e),new wi(t)};mt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(W(188)):(e=Object.keys(e).join(","),Error(W(268,e)));return e=Ic(t),e=e===null?null:e.stateNode,e};mt.flushSync=function(e){return Br(e)};mt.hydrate=function(e,t,n){if(!Zo(t))throw Error(W(200));return el(null,e,t,!0,n)};mt.hydrateRoot=function(e,t,n){if(!ki(e))throw Error(W(405));var a=n!=null&&n.hydratedSources||null,o=!1,l="",s=pp;if(n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=up(t,null,e,1,n??null,o,!1,l,s),e[Gt]=t.current,ia(e),a)for(e=0;e<a.length;e++)n=a[e],o=n._getVersion,o=o(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,o]:t.mutableSourceEagerHydrationData.push(n,o);return new Xo(t)};mt.render=function(e,t,n){if(!Zo(t))throw Error(W(200));return el(null,e,t,!1,n)};mt.unmountComponentAtNode=function(e){if(!Zo(e))throw Error(W(40));return e._reactRootContainer?(Br(function(){el(null,null,e,!1,function(){e._reactRootContainer=null,e[Gt]=null})}),!0):!1};mt.unstable_batchedUpdates=gi;mt.unstable_renderSubtreeIntoContainer=function(e,t,n,a){if(!Zo(n))throw Error(W(200));if(e==null||e._reactInternals===void 0)throw Error(W(38));return el(e,t,n,!1,a)};mt.version="18.3.1-next-f1338f8080-20240426";function fp(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(fp)}catch(e){console.error(e)}}fp(),fc.exports=mt;var px=fc.exports,Od=px;Ll.createRoot=Od.createRoot,Ll.hydrateRoot=Od.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ha(){return ha=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},ha.apply(this,arguments)}var dr;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(dr||(dr={}));const Bd="popstate";function fx(e){e===void 0&&(e={});function t(a,o){let{pathname:l,search:s,hash:i}=a.location;return Ns("",{pathname:l,search:s,hash:i},o.state&&o.state.usr||null,o.state&&o.state.key||"default")}function n(a,o){return typeof o=="string"?o:mp(o)}return xx(t,n,null,e)}function Re(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function Si(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function mx(){return Math.random().toString(36).substr(2,8)}function Md(e,t){return{usr:e.state,key:e.key,idx:t}}function Ns(e,t,n,a){return n===void 0&&(n=null),ha({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?wn(t):t,{state:n,key:t&&t.key||a||mx()})}function mp(e){let{pathname:t="/",search:n="",hash:a=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),a&&a!=="#"&&(t+=a.charAt(0)==="#"?a:"#"+a),t}function wn(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let a=e.indexOf("?");a>=0&&(t.search=e.substr(a),e=e.substr(0,a)),e&&(t.pathname=e)}return t}function xx(e,t,n,a){a===void 0&&(a={});let{window:o=document.defaultView,v5Compat:l=!1}=a,s=o.history,i=dr.Pop,d=null,u=h();u==null&&(u=0,s.replaceState(ha({},s.state,{idx:u}),""));function h(){return(s.state||{idx:null}).idx}function m(){i=dr.Pop;let z=h(),x=z==null?null:z-u;u=z,d&&d({action:i,location:S.location,delta:x})}function y(z,x){i=dr.Push;let f=Ns(S.location,z,x);u=h()+1;let c=Md(f,u),k=S.createHref(f);try{s.pushState(c,"",k)}catch(I){if(I instanceof DOMException&&I.name==="DataCloneError")throw I;o.location.assign(k)}l&&d&&d({action:i,location:S.location,delta:1})}function w(z,x){i=dr.Replace;let f=Ns(S.location,z,x);u=h();let c=Md(f,u),k=S.createHref(f);s.replaceState(c,"",k),l&&d&&d({action:i,location:S.location,delta:0})}function _(z){let x=o.location.origin!=="null"?o.location.origin:o.location.href,f=typeof z=="string"?z:mp(z);return f=f.replace(/ $/,"%20"),Re(x,"No window.location.(origin|href) available to create URL for href: "+f),new URL(f,x)}let S={get action(){return i},get location(){return e(o,s)},listen(z){if(d)throw new Error("A history only accepts one active listener");return o.addEventListener(Bd,m),d=z,()=>{o.removeEventListener(Bd,m),d=null}},createHref(z){return t(o,z)},createURL:_,encodeLocation(z){let x=_(z);return{pathname:x.pathname,search:x.search,hash:x.hash}},push:y,replace:w,go(z){return s.go(z)}};return S}var $d;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})($d||($d={}));function gx(e,t,n){return n===void 0&&(n="/"),hx(e,t,n)}function hx(e,t,n,a){let o=typeof t=="string"?wn(t):t,l=hp(o.pathname||"/",n);if(l==null)return null;let s=xp(e);vx(s);let i=null;for(let d=0;i==null&&d<s.length;++d){let u=Dx(l);i=Cx(s[d],u)}return i}function xp(e,t,n,a){t===void 0&&(t=[]),n===void 0&&(n=[]),a===void 0&&(a="");let o=(l,s,i)=>{let d={relativePath:i===void 0?l.path||"":i,caseSensitive:l.caseSensitive===!0,childrenIndex:s,route:l};d.relativePath.startsWith("/")&&(Re(d.relativePath.startsWith(a),'Absolute route path "'+d.relativePath+'" nested under path '+('"'+a+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),d.relativePath=d.relativePath.slice(a.length));let u=Lr([a,d.relativePath]),h=n.concat(d);l.children&&l.children.length>0&&(Re(l.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+u+'".')),xp(l.children,t,h,u)),!(l.path==null&&!l.index)&&t.push({path:u,score:_x(u,l.index),routesMeta:h})};return e.forEach((l,s)=>{var i;if(l.path===""||!((i=l.path)!=null&&i.includes("?")))o(l,s);else for(let d of gp(l.path))o(l,s,d)}),t}function gp(e){let t=e.split("/");if(t.length===0)return[];let[n,...a]=t,o=n.endsWith("?"),l=n.replace(/\?$/,"");if(a.length===0)return o?[l,""]:[l];let s=gp(a.join("/")),i=[];return i.push(...s.map(d=>d===""?l:[l,d].join("/"))),o&&i.push(...s),i.map(d=>e.startsWith("/")&&d===""?"/":d)}function vx(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Nx(t.routesMeta.map(a=>a.childrenIndex),n.routesMeta.map(a=>a.childrenIndex)))}const yx=/^:[\w-]+$/,bx=3,jx=2,wx=1,kx=10,Sx=-2,Ud=e=>e==="*";function _x(e,t){let n=e.split("/"),a=n.length;return n.some(Ud)&&(a+=Sx),t&&(a+=jx),n.filter(o=>!Ud(o)).reduce((o,l)=>o+(yx.test(l)?bx:l===""?wx:kx),a)}function Nx(e,t){return e.length===t.length&&e.slice(0,-1).every((a,o)=>a===t[o])?e[e.length-1]-t[t.length-1]:0}function Cx(e,t,n){let{routesMeta:a}=e,o={},l="/",s=[];for(let i=0;i<a.length;++i){let d=a[i],u=i===a.length-1,h=l==="/"?t:t.slice(l.length)||"/",m=zx({path:d.relativePath,caseSensitive:d.caseSensitive,end:u},h),y=d.route;if(!m)return null;Object.assign(o,m.params),s.push({params:o,pathname:Lr([l,m.pathname]),pathnameBase:Ax(Lr([l,m.pathnameBase])),route:y}),m.pathnameBase!=="/"&&(l=Lr([l,m.pathnameBase]))}return s}function zx(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,a]=Ex(e.path,e.caseSensitive,e.end),o=t.match(n);if(!o)return null;let l=o[0],s=l.replace(/(.)\/+$/,"$1"),i=o.slice(1);return{params:a.reduce((u,h,m)=>{let{paramName:y,isOptional:w}=h;if(y==="*"){let S=i[m]||"";s=l.slice(0,l.length-S.length).replace(/(.)\/+$/,"$1")}const _=i[m];return w&&!_?u[y]=void 0:u[y]=(_||"").replace(/%2F/g,"/"),u},{}),pathname:l,pathnameBase:s,pattern:e}}function Ex(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),Si(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let a=[],o="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(s,i,d)=>(a.push({paramName:i,isOptional:d!=null}),d?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(a.push({paramName:"*"}),o+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?o+="\\/*$":e!==""&&e!=="/"&&(o+="(?:(?=\\/|$))"),[new RegExp(o,t?void 0:"i"),a]}function Dx(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return Si(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function hp(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,a=e.charAt(n);return a&&a!=="/"?null:e.slice(n)||"/"}const Px=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Tx=e=>Px.test(e);function Lx(e,t){t===void 0&&(t="/");let{pathname:n,search:a="",hash:o=""}=typeof e=="string"?wn(e):e,l;if(n)if(Tx(n))l=n;else{if(n.includes("//")){let s=n;n=n.replace(/\/\/+/g,"/"),Si(!1,"Pathnames cannot have embedded double slashes - normalizing "+(s+" -> "+n))}n.startsWith("/")?l=Fd(n.substring(1),"/"):l=Fd(n,t)}else l=t;return{pathname:l,search:Rx(a),hash:Ox(o)}}function Fd(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(o=>{o===".."?n.length>1&&n.pop():o!=="."&&n.push(o)}),n.length>1?n.join("/"):"/"}function El(e,t,n,a){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(a)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function Ix(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function vp(e,t){let n=Ix(e);return t?n.map((a,o)=>o===n.length-1?a.pathname:a.pathnameBase):n.map(a=>a.pathnameBase)}function yp(e,t,n,a){a===void 0&&(a=!1);let o;typeof e=="string"?o=wn(e):(o=ha({},e),Re(!o.pathname||!o.pathname.includes("?"),El("?","pathname","search",o)),Re(!o.pathname||!o.pathname.includes("#"),El("#","pathname","hash",o)),Re(!o.search||!o.search.includes("#"),El("#","search","hash",o)));let l=e===""||o.pathname==="",s=l?"/":o.pathname,i;if(s==null)i=n;else{let m=t.length-1;if(!a&&s.startsWith("..")){let y=s.split("/");for(;y[0]==="..";)y.shift(),m-=1;o.pathname=y.join("/")}i=m>=0?t[m]:"/"}let d=Lx(o,i),u=s&&s!=="/"&&s.endsWith("/"),h=(l||s===".")&&n.endsWith("/");return!d.pathname.endsWith("/")&&(u||h)&&(d.pathname+="/"),d}const Lr=e=>e.join("/").replace(/\/\/+/g,"/"),Ax=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Rx=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Ox=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Bx(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const bp=["post","put","patch","delete"];new Set(bp);const Mx=["get",...bp];new Set(Mx);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function va(){return va=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},va.apply(this,arguments)}const _i=p.createContext(null),$x=p.createContext(null),Sa=p.createContext(null),tl=p.createContext(null),Fr=p.createContext({outlet:null,matches:[],isDataRoute:!1}),jp=p.createContext(null);function _a(){return p.useContext(tl)!=null}function Ni(){return _a()||Re(!1),p.useContext(tl).location}function wp(e){p.useContext(Sa).static||p.useLayoutEffect(e)}function Ci(){let{isDataRoute:e}=p.useContext(Fr);return e?Zx():Ux()}function Ux(){_a()||Re(!1);let e=p.useContext(_i),{basename:t,future:n,navigator:a}=p.useContext(Sa),{matches:o}=p.useContext(Fr),{pathname:l}=Ni(),s=JSON.stringify(vp(o,n.v7_relativeSplatPath)),i=p.useRef(!1);return wp(()=>{i.current=!0}),p.useCallback(function(u,h){if(h===void 0&&(h={}),!i.current)return;if(typeof u=="number"){a.go(u);return}let m=yp(u,JSON.parse(s),l,h.relative==="path");e==null&&t!=="/"&&(m.pathname=m.pathname==="/"?t:Lr([t,m.pathname])),(h.replace?a.replace:a.push)(m,h.state,h)},[t,a,s,l,e])}function Fx(e,t){return Wx(e,t)}function Wx(e,t,n,a){_a()||Re(!1);let{navigator:o}=p.useContext(Sa),{matches:l}=p.useContext(Fr),s=l[l.length-1],i=s?s.params:{};s&&s.pathname;let d=s?s.pathnameBase:"/";s&&s.route;let u=Ni(),h;if(t){var m;let z=typeof t=="string"?wn(t):t;d==="/"||(m=z.pathname)!=null&&m.startsWith(d)||Re(!1),h=z}else h=u;let y=h.pathname||"/",w=y;if(d!=="/"){let z=d.replace(/^\//,"").split("/");w="/"+y.replace(/^\//,"").split("/").slice(z.length).join("/")}let _=gx(e,{pathname:w}),S=Yx(_&&_.map(z=>Object.assign({},z,{params:Object.assign({},i,z.params),pathname:Lr([d,o.encodeLocation?o.encodeLocation(z.pathname).pathname:z.pathname]),pathnameBase:z.pathnameBase==="/"?d:Lr([d,o.encodeLocation?o.encodeLocation(z.pathnameBase).pathname:z.pathnameBase])})),l,n,a);return t&&S?p.createElement(tl.Provider,{value:{location:va({pathname:"/",search:"",hash:"",state:null,key:"default"},h),navigationType:dr.Pop}},S):S}function qx(){let e=Xx(),t=Bx(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,o={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return p.createElement(p.Fragment,null,p.createElement("h2",null,"Unexpected Application Error!"),p.createElement("h3",{style:{fontStyle:"italic"}},t),n?p.createElement("pre",{style:o},n):null,null)}const Vx=p.createElement(qx,null);class Hx extends p.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?p.createElement(Fr.Provider,{value:this.props.routeContext},p.createElement(jp.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Qx(e){let{routeContext:t,match:n,children:a}=e,o=p.useContext(_i);return o&&o.static&&o.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(o.staticContext._deepestRenderedBoundaryId=n.route.id),p.createElement(Fr.Provider,{value:t},a)}function Yx(e,t,n,a){var o;if(t===void 0&&(t=[]),n===void 0&&(n=null),a===void 0&&(a=null),e==null){var l;if(!n)return null;if(n.errors)e=n.matches;else if((l=a)!=null&&l.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let s=e,i=(o=n)==null?void 0:o.errors;if(i!=null){let h=s.findIndex(m=>m.route.id&&(i==null?void 0:i[m.route.id])!==void 0);h>=0||Re(!1),s=s.slice(0,Math.min(s.length,h+1))}let d=!1,u=-1;if(n&&a&&a.v7_partialHydration)for(let h=0;h<s.length;h++){let m=s[h];if((m.route.HydrateFallback||m.route.hydrateFallbackElement)&&(u=h),m.route.id){let{loaderData:y,errors:w}=n,_=m.route.loader&&y[m.route.id]===void 0&&(!w||w[m.route.id]===void 0);if(m.route.lazy||_){d=!0,u>=0?s=s.slice(0,u+1):s=[s[0]];break}}}return s.reduceRight((h,m,y)=>{let w,_=!1,S=null,z=null;n&&(w=i&&m.route.id?i[m.route.id]:void 0,S=m.route.errorElement||Vx,d&&(u<0&&y===0?(eg("route-fallback"),_=!0,z=null):u===y&&(_=!0,z=m.route.hydrateFallbackElement||null)));let x=t.concat(s.slice(0,y+1)),f=()=>{let c;return w?c=S:_?c=z:m.route.Component?c=p.createElement(m.route.Component,null):m.route.element?c=m.route.element:c=h,p.createElement(Qx,{match:m,routeContext:{outlet:h,matches:x,isDataRoute:n!=null},children:c})};return n&&(m.route.ErrorBoundary||m.route.errorElement||y===0)?p.createElement(Hx,{location:n.location,revalidation:n.revalidation,component:S,error:w,children:f(),routeContext:{outlet:null,matches:x,isDataRoute:!0}}):f()},null)}var kp=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(kp||{}),Sp=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(Sp||{});function Gx(e){let t=p.useContext(_i);return t||Re(!1),t}function Jx(e){let t=p.useContext($x);return t||Re(!1),t}function Kx(e){let t=p.useContext(Fr);return t||Re(!1),t}function _p(e){let t=Kx(),n=t.matches[t.matches.length-1];return n.route.id||Re(!1),n.route.id}function Xx(){var e;let t=p.useContext(jp),n=Jx(),a=_p();return t!==void 0?t:(e=n.errors)==null?void 0:e[a]}function Zx(){let{router:e}=Gx(kp.UseNavigateStable),t=_p(Sp.UseNavigateStable),n=p.useRef(!1);return wp(()=>{n.current=!0}),p.useCallback(function(o,l){l===void 0&&(l={}),n.current&&(typeof o=="number"?e.navigate(o):e.navigate(o,va({fromRouteId:t},l)))},[e,t])}const Wd={};function eg(e,t,n){Wd[e]||(Wd[e]=!0)}function tg(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function Np(e){let{to:t,replace:n,state:a,relative:o}=e;_a()||Re(!1);let{future:l,static:s}=p.useContext(Sa),{matches:i}=p.useContext(Fr),{pathname:d}=Ni(),u=Ci(),h=yp(t,vp(i,l.v7_relativeSplatPath),d,o==="path"),m=JSON.stringify(h);return p.useEffect(()=>u(JSON.parse(m),{replace:n,state:a,relative:o}),[u,m,o,n,a]),null}function so(e){Re(!1)}function rg(e){let{basename:t="/",children:n=null,location:a,navigationType:o=dr.Pop,navigator:l,static:s=!1,future:i}=e;_a()&&Re(!1);let d=t.replace(/^\/*/,"/"),u=p.useMemo(()=>({basename:d,navigator:l,static:s,future:va({v7_relativeSplatPath:!1},i)}),[d,i,l,s]);typeof a=="string"&&(a=wn(a));let{pathname:h="/",search:m="",hash:y="",state:w=null,key:_="default"}=a,S=p.useMemo(()=>{let z=hp(h,d);return z==null?null:{location:{pathname:z,search:m,hash:y,state:w,key:_},navigationType:o}},[d,h,m,y,w,_,o]);return S==null?null:p.createElement(Sa.Provider,{value:u},p.createElement(tl.Provider,{children:n,value:S}))}function ng(e){let{children:t,location:n}=e;return Fx(Cs(t),n)}new Promise(()=>{});function Cs(e,t){t===void 0&&(t=[]);let n=[];return p.Children.forEach(e,(a,o)=>{if(!p.isValidElement(a))return;let l=[...t,o];if(a.type===p.Fragment){n.push.apply(n,Cs(a.props.children,l));return}a.type!==so&&Re(!1),!a.props.index||!a.props.children||Re(!1);let s={id:a.props.id||l.join("-"),caseSensitive:a.props.caseSensitive,element:a.props.element,Component:a.props.Component,index:a.props.index,path:a.props.path,loader:a.props.loader,action:a.props.action,errorElement:a.props.errorElement,ErrorBoundary:a.props.ErrorBoundary,hasErrorBoundary:a.props.ErrorBoundary!=null||a.props.errorElement!=null,shouldRevalidate:a.props.shouldRevalidate,handle:a.props.handle,lazy:a.props.lazy};a.props.children&&(s.children=Cs(a.props.children,l)),n.push(s)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const ag="6";try{window.__reactRouterVersion=ag}catch{}const og="startTransition",qd=ef[og];function lg(e){let{basename:t,children:n,future:a,window:o}=e,l=p.useRef();l.current==null&&(l.current=fx({window:o,v5Compat:!0}));let s=l.current,[i,d]=p.useState({action:s.action,location:s.location}),{v7_startTransition:u}=a||{},h=p.useCallback(m=>{u&&qd?qd(()=>d(m)):d(m)},[d,u]);return p.useLayoutEffect(()=>s.listen(h),[s,h]),p.useEffect(()=>tg(a),[a]),p.createElement(rg,{basename:t,children:n,location:i.location,navigationType:i.action,navigator:s,future:a})}var Vd;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(Vd||(Vd={}));var Hd;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(Hd||(Hd={}));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sg=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Cp=(...e)=>e.filter((t,n,a)=>!!t&&a.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ig={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dg=p.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:o="",children:l,iconNode:s,...i},d)=>p.createElement("svg",{ref:d,...ig,width:t,height:t,stroke:e,strokeWidth:a?Number(n)*24/Number(t):n,className:Cp("lucide",o),...i},[...s.map(([u,h])=>p.createElement(u,h)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=(e,t)=>{const n=p.forwardRef(({className:a,...o},l)=>p.createElement(dg,{ref:l,iconNode:t,className:Cp(`lucide-${sg(e)}`,a),...o}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cg=ne("ArrowUpDown",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zp=ne("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Io=ne("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ep=ne("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const io=ne("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ug=ne("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pg=ne("ChevronsLeft",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fg=ne("ChevronsRight",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ao=ne("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ya=ne("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zs=ne("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mg=ne("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xg=ne("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dp=ne("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pp=ne("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gg=ne("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $n=ne("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Un=ne("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ro=ne("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zi=ne("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hg=ne("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vg=ne("GripVertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yg=ne("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bg=ne("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jg=ne("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wg=ne("ListTodo",[["rect",{x:"3",y:"5",width:"6",height:"6",rx:"1",key:"1defrl"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fn=ne("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nn=ne("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kg=ne("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sg=ne("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tp=ne("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _g=ne("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ng=ne("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cg=ne("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zg=ne("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eg=ne("Pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ht=ne("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dl=ne("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dg=ne("ScrollText",[["path",{d:"M15 12h-5",key:"r7krc0"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mr=ne("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Es=ne("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pg=ne("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tg=ne("SlidersVertical",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lg=ne("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ig=ne("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lp=ne("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ag=ne("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rg=ne("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rl=ne("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ip=ne("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vn=ne("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function Og({onLogout:e,onToggleSidebar:t,sidenavCollapsed:n}){var T,j;const[a,o]=p.useState(()=>new Date().toLocaleTimeString("en-IN")),[l,s]=p.useState([]),[i,d]=p.useState(""),[u,h]=p.useState(""),[m,y]=p.useState(!1),w=p.useRef(null),_=JSON.parse(localStorage.getItem("user")||"{}"),S=localStorage.getItem("token"),[z,x]=p.useState(()=>{const N=localStorage.getItem("erp_theme");return N?N==="dark":!0}),[f,c]=p.useState(()=>localStorage.getItem("erp_company_name")||"Vyom ERP"),[k,I]=p.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing");p.useEffect(()=>{const N=localStorage.getItem("erp_theme"),M=N?N==="dark":!0;document.documentElement.setAttribute("data-theme",M?"dark":"light"),x(M)},[]);const D=()=>{const N=!z;x(N),localStorage.setItem("erp_theme",N?"dark":"light"),document.documentElement.setAttribute("data-theme",N?"dark":"light")};p.useEffect(()=>{const N=setInterval(()=>{o(new Date().toLocaleTimeString("en-IN"))},1e3);C();const M=O=>{O.detail&&O.detail.orderId!==void 0?d(O.detail.orderId||""):O.detail&&O.detail.orderId===null&&d("")};window.addEventListener("setView",M);const A=()=>{C()};window.addEventListener("orderUpdated",A);const V=O=>{w.current&&!w.current.contains(O.target)&&y(!1)};document.addEventListener("mousedown",V);const U=()=>{c(localStorage.getItem("erp_company_name")||"Vyom ERP"),I(localStorage.getItem("erp_system_title")||"Control Panel Manufacturing")};return window.addEventListener("erpSettingsUpdated",U),()=>{clearInterval(N),window.removeEventListener("setView",M),window.removeEventListener("orderUpdated",A),document.removeEventListener("mousedown",V),window.removeEventListener("erpSettingsUpdated",U)}},[]),p.useEffect(()=>{if(i&&l.length>0){const N=l.find(M=>M.id==i);N&&h(N.order_number)}else i||h("")},[i,l]);const C=async()=>{if(S)try{const N=await fetch(window.API_BASE+"/api/orders",{headers:{Authorization:`Bearer ${S}`}});if(N.ok){const M=await N.json();s(M)}}catch(N){console.error("Header fetch error:",N)}},L=(N,M)=>{d(N),h(M||""),y(!1),N?window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:parseInt(N)}})):window.dispatchEvent(new CustomEvent("setView",{detail:{view:"board",orderId:null}}))},P=i&&u.trim()===(((T=l.find(N=>N.id==i))==null?void 0:T.order_number)||""),g=l.filter(N=>{const M=P?"":u.trim().toLowerCase();if(!M)return!0;const A=M.split(/\s+/),V=(N.order_number||"").toLowerCase(),U=(N.company_name||"").toLowerCase(),O=(N.po_number||"").toLowerCase();return A.every(K=>V.includes(K)||U.includes(K)||O.includes(K))});return r.jsxs("div",{className:"header",children:[r.jsxs("div",{className:"header-left",children:[r.jsx("button",{className:"sidebar-toggle-btn",onClick:t,title:n?"Expand Sidebar":"Collapse Sidebar","aria-label":n?"Expand Sidebar":"Collapse Sidebar",children:r.jsx(Ng,{size:16})}),r.jsx("div",{className:"logo",children:f}),r.jsx("div",{className:"header-title",children:k})]}),r.jsxs("div",{className:"header-right",children:[r.jsxs("div",{className:"user-info",children:[r.jsx(rl,{size:14,className:"user-icon"}),r.jsx("span",{className:"user-name",children:_.username||"User"}),r.jsx("span",{className:`role-badge role-${(j=_.role)==null?void 0:j.toLowerCase()}`,children:_.role||"Viewer"})]}),r.jsxs("div",{className:"order-selector",ref:w,children:[r.jsx(Mr,{size:14,className:"search-icon"}),r.jsx("input",{type:"text",className:"order-search-input",placeholder:"Search Order...",value:u,onFocus:()=>y(!0),onChange:N=>{h(N.target.value),y(!0)}}),i&&r.jsx("button",{className:"clear-search",onClick:N=>{N.stopPropagation(),L("","")},title:"Clear Selection",children:"×"}),m&&r.jsxs("div",{className:"search-dropdown-menu",children:[r.jsx("div",{className:`search-dropdown-item ${i?"":"active"}`,onClick:()=>L("",""),children:"View All Orders (Board)"}),g.length>0?g.map(N=>r.jsxs("div",{className:`search-dropdown-item ${i==N.id?"active":""}`,onClick:()=>L(N.id,N.order_number),children:[r.jsx("div",{style:{fontWeight:600},children:N.order_number}),N.company_name&&r.jsx("div",{style:{fontSize:"10px",color:"#888"},children:N.company_name})]},N.id)):r.jsx("div",{className:"search-dropdown-item empty",children:"No orders found"})]})]}),r.jsx("div",{className:"clock-wrapper",children:a}),r.jsxs("button",{onClick:D,title:z?"Switch to Light Mode":"Switch to Dark Mode",className:"theme-toggle-btn",children:[z?r.jsx(Ig,{size:13}):r.jsx(zg,{size:13}),r.jsx("span",{className:"theme-toggle-text",children:z?"Light":"Dark"})]}),r.jsxs("button",{onClick:e,className:"logout-btn",children:[r.jsx(Sg,{size:14,className:"logout-icon"}),r.jsx("span",{className:"logout-text",children:"Logout"})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const br=[{id:"Sales",color:"var(--teal)",label:"Sales",sub:"Customer interface"},{id:"Design",color:"var(--purple)",label:"Design",sub:"Engineering"},{id:"Purchase",color:"var(--orange)",label:"Purchase",sub:"Procurement"},{id:"Stores",color:"var(--green)",label:"Stores",sub:"Stock & Issue"},{id:"Production",color:"var(--red)",label:"Production",sub:"Manufacturing"},{id:"QC",color:"var(--blue)",label:"QC",sub:"Quality Control"},{id:"Dispatch",color:"var(--text2)",label:"Dispatch",sub:"Logistics"},{id:"Accounts",color:"var(--text2)",label:"Accounts",sub:"Billing"}];Wn(new Date),Wn(new Date),Wn(new Date),Wn(new Date);function Wn(e){return e.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}const Je={pending:{cls:"badge-pending",label:"PENDING"},inprogress:{cls:"badge-inprogress",label:"IN PROGRESS"},done:{cls:"badge-done",label:"DONE"},blocked:{cls:"badge-blocked",label:"BLOCKED"},review:{cls:"badge-review",label:"REVIEW"}},Bg=[{id:"board",icon:jg,label:"Board",roles:null},{id:"planning",icon:zp,label:"Planning",roles:["Admin","Manager","Planning"]},{id:"orders",icon:xg,label:"Orders",roles:null},{id:"documents",icon:Ro,label:"Documents",roles:null},{id:"new-order",icon:mg,label:"New Order",roles:["Admin","Manager","Sales"]},{id:"masters",icon:Pp,label:"Masters",roles:["Admin","Manager","Sales"]},{id:"import",icon:Ag,label:"Import",roles:["Admin","Manager","Sales"]},{id:"worklist",icon:wg,label:"My Worklist",roles:["Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Sales"]}],Mg=[{id:"users",icon:Ip,label:"User Directory"},{id:"logs",icon:Dg,label:"System Logs"},{id:"settings",icon:Es,label:"System Settings"}];function Qd({item:e,isActive:t,onClick:n}){const a=e.icon;return r.jsxs("button",{className:`dept-btn${t?" active":""}`,onClick:n,title:e.label,children:[r.jsx(a,{size:16,className:"nav-icon"}),r.jsx("span",{className:"nav-label",children:e.label})]})}function $g({steps:e,currentFilter:t,onFilterDept:n,currentView:a,onSetView:o,userRole:l,collapsed:s=!1}){return r.jsx("aside",{className:`sidenav${s?" sidenav--collapsed":""}`,children:r.jsxs("div",{className:"sidenav-inner",children:[r.jsxs("div",{className:"sidenav-group",children:[r.jsx("p",{className:"sidenav-label",children:"Workspace"}),Bg.map(i=>i.roles&&!i.roles.includes(l)?null:r.jsx(Qd,{item:i,isActive:a===i.id,onClick:()=>o(i.id)},i.id))]}),r.jsxs("div",{className:"sidenav-group",children:[r.jsx("p",{className:"sidenav-label",children:"Departments"}),r.jsxs("button",{className:`dept-btn${t==="all"?" active":""}`,onClick:()=>n("all"),title:"All Departments",children:[r.jsx("span",{className:"dept-dot",style:{background:"var(--accent)"}}),r.jsx("span",{className:"nav-label",children:"All Departments"})]}),br.map(i=>{const d=e.filter(h=>h.dept===i.id&&h.status==="done").length,u=e.filter(h=>h.dept===i.id).length;return r.jsxs("button",{className:`dept-btn${t===i.id?" active":""}`,onClick:()=>{n(i.id),o("flow")},title:i.label,children:[r.jsx("span",{className:"dept-dot",style:{background:i.color}}),r.jsx("span",{className:"nav-label",children:i.label}),r.jsx("span",{className:"dept-count nav-count",children:u>0?`${d}/${u}`:"—"})]},i.id)})]}),l==="Admin"&&r.jsxs("div",{className:"sidenav-group sidenav-group--admin",children:[r.jsx("p",{className:"sidenav-label",children:"Admin"}),Mg.map(i=>r.jsx(Qd,{item:i,isActive:a===i.id,onClick:()=>o(i.id)},i.id))]})]})})}function Ug({deliveryDate:e}){if(!e)return r.jsx("span",{style:{color:"var(--text3)"},children:"—"});const t=Math.ceil((new Date(e)-new Date)/864e5),n=t<0||t<7?"var(--red)":t<14?"var(--accent)":"var(--green)",a=t<0?`${Math.abs(t)}d overdue`:t===0?"today":`${t}d left`;return r.jsx("span",{style:{color:n,fontFamily:"var(--font-mono)",fontSize:14,fontWeight:700},children:a})}function Fg({steps:e,currentFilter:t,selectedOrder:n}){const a=t==="all"?e:e.filter(h=>h.dept===t),o=a.filter(h=>h.status==="inprogress").length,l=a.filter(h=>h.status==="blocked").length,s=a.filter(h=>h.status==="done").length,i=a.length;let d="PENDING",u="var(--accent)";return i===0?(d="NO TASKS",u="var(--text3)"):s===i?(d="COMPLETE",u="var(--green)"):l>0?(d="BLOCKED",u="var(--red)"):(s>0||o>0)&&(d="IN PROGRESS",u="var(--blue)"),r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card stat-status",children:[r.jsx("div",{className:"stat-label",children:"Order Status"}),r.jsx("div",{className:"stat-value",style:{color:u,fontSize:13,fontWeight:700,marginTop:4},children:d}),r.jsx("div",{className:"stat-sub",children:(n==null?void 0:n.order_number)||"no order selected"})]}),r.jsxs("div",{className:"stat-card stat-progress",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:o>0?"var(--blue)":"var(--text3)"},children:o}),r.jsx("div",{className:"stat-sub",children:"active steps"})]}),r.jsxs("div",{className:"stat-card stat-blocked",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:l>0?"var(--red)":"var(--text3)"},children:l}),r.jsx("div",{className:"stat-sub",children:l>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card stat-delivery",children:[r.jsx("div",{className:"stat-label",children:"Delivery"}),r.jsx("div",{style:{marginTop:4},children:r.jsx(Ug,{deliveryDate:n==null?void 0:n.delivery_date})}),r.jsx("div",{className:"stat-sub",children:n!=null&&n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"TBD"})]})]})}function Wg(){const[e,t]=p.useState(null),n=localStorage.getItem("token");return p.useEffect(()=>{fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${n}`}}).then(a=>a.ok?a.json():[]).then(a=>{const o=new Date,l=new Date(o);l.setDate(o.getDate()+7);let s=0,i=0,d=0,u=0,h=0;a.forEach(m=>{h+=parseInt(m.line_item_count||0);const y=(m.priority||"Medium").toLowerCase();if((y==="urgent"||y==="high")&&d++,m.delivery_date){const w=new Date(m.delivery_date);w>=o&&w<=l&&u++}(m.steps||[]).forEach(w=>{w.status==="blocked"&&s++,w.status==="inprogress"&&i++})}),t({total:a.length,totalLineItems:h,urgentHigh:d,totalBlocked:s,totalIP:i,dueThisWeek:u})}).catch(()=>t(null))},[n]),e?r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card stat-active",children:[r.jsx("div",{className:"stat-label",children:"Active Orders & Items"}),r.jsxs("div",{className:"stat-value",style:{color:"var(--text)"},children:[e.totalLineItems,r.jsxs("span",{style:{fontSize:"13px",color:"var(--text3)",fontWeight:"normal",marginLeft:"6px"},children:["(",e.total," Orders)"]})]}),r.jsx("div",{className:"stat-sub",children:"in pipeline"})]}),r.jsxs("div",{className:"stat-card stat-urgent",children:[r.jsx("div",{className:"stat-label",children:"Urgent / High"}),r.jsx("div",{className:"stat-value",style:{color:e.urgentHigh>0?"var(--accent)":"var(--text3)"},children:e.urgentHigh}),r.jsx("div",{className:"stat-sub",children:"priority orders"})]}),r.jsxs("div",{className:"stat-card stat-progress",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:e.totalIP>0?"var(--blue)":"var(--text3)"},children:e.totalIP}),r.jsx("div",{className:"stat-sub",children:"steps across orders"})]}),r.jsxs("div",{className:"stat-card stat-blocked",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:e.totalBlocked>0?"var(--red)":"var(--text3)"},children:e.totalBlocked}),r.jsx("div",{className:"stat-sub",children:e.totalBlocked>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card stat-due",children:[r.jsx("div",{className:"stat-label",children:"Due This Week"}),r.jsx("div",{className:"stat-value",style:{color:e.dueThisWeek>0?"var(--accent)":"var(--text3)"},children:e.dueThisWeek}),r.jsx("div",{className:"stat-sub",children:"orders"})]})]}):r.jsx("div",{className:"stats-row",children:[...Array(5)].map((a,o)=>r.jsxs("div",{className:"stat-card",style:{opacity:.4},children:[r.jsx("div",{className:"stat-label",children:"Loading…"}),r.jsx("div",{className:"stat-value",children:"—"})]},o))})}function qg({steps:e,currentFilter:t,selectedOrder:n}){return n?r.jsx(Fg,{steps:e,currentFilter:t,selectedOrder:n}):r.jsx(Wg,{})}const Yd=["General","PO","Quotation","BOM","Drawing","QC Report","Dispatch Document","Photo"],Vg=["Sales","Accounts","Admin","Manager"];function Oo({entityType:e,entityId:t,initialDocs:n=[],onUploadSuccess:a,onDocsUpdate:o,readOnly:l=!1,defaultDocType:s="General",userRole:i=null}){const u=!i||Vg.includes(i)?Yd:Yd.filter(T=>T!=="PO"),[h,m]=p.useState(n),[y,w]=p.useState(!1),[_,S]=p.useState(s),[z,x]=p.useState(!0),[f,c]=p.useState(!1),k=localStorage.getItem("token");p.useEffect(()=>{s&&S(s)},[s]),p.useEffect(()=>{t&&(async()=>{try{const j=await fetch(`${window.API_BASE}/api/documents/${e}/${t}`,{headers:{Authorization:`Bearer ${k}`}});if(j.ok){const N=await j.json();m(N)}}catch(j){console.error("Failed to fetch docs",j)}})()},[e,t,k]),p.useEffect(()=>{o&&o(h)},[h,o]);const I=async T=>{if(_==="PO"||_==="Quotation"){if(T.length>1){alert(`${_} can only be a single file.`);return}if(h.some(N=>N.doc_type===_)){alert(`A ${_} already exists. Please delete it first.`);return}}if(h.length+T.length>20){alert("Maximum 20 files allowed per entity.");return}w(!0);const j=new FormData;j.append("entity_type",e),j.append("entity_id",t),j.append("doc_type",_),T.forEach(N=>j.append("files",N));try{const N=await fetch(window.API_BASE+"/api/documents/upload",{method:"POST",headers:{Authorization:`Bearer ${k}`},body:j});if(N.ok){const M=await N.json();m([...h,...M]),a&&a(M)}else{const M=await N.json();alert(M.error||"Upload failed")}}catch(N){console.error("Upload error:",N),alert("Network error during upload")}finally{w(!1)}},D=async T=>{const j=Array.from(T.target.files);j.length!==0&&(await I(j),T.target.value="")},C=T=>{l||(T.preventDefault(),c(!0))},L=()=>{c(!1)},P=async T=>{if(l)return;T.preventDefault(),c(!1);const j=Array.from(T.dataTransfer.files);j.length!==0&&await I(j)},g=async T=>{if(window.confirm("Delete this document?"))try{const j=await fetch(`${window.API_BASE}/api/documents/${T}`,{method:"DELETE",headers:{Authorization:`Bearer ${k}`}});if(j.ok){const N=h.filter(M=>M.id!==T);m(N),a&&a(N)}else{const N=await j.json();alert(N.error||"Failed to delete document")}}catch(j){console.error("Delete error:",j),alert("Network error during deletion")}};return r.jsxs("div",{className:`doc-manager${f?" doc-manager--dragging":""}`,onDragOver:C,onDragLeave:L,onDrop:P,children:[r.jsxs("div",{className:"doc-header",onClick:()=>x(T=>!T),style:{cursor:"pointer",userSelect:"none"},children:[r.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",margin:0},children:[r.jsx("span",{style:{display:"inline-block",fontSize:"10px",transition:"transform 0.2s",transform:z?"rotate(-90deg)":"rotate(0deg)",color:"var(--text3)"},children:"▼"}),"Documents (",h.length,"/20)",h.length>0&&z&&r.jsxs("span",{style:{fontSize:"11px",fontWeight:"400",color:"var(--text3)",background:"var(--bg4)",padding:"1px 7px",borderRadius:"10px",marginLeft:"2px"},children:[h.length," file",h.length!==1?"s":""]})]}),!l&&!z&&r.jsxs("div",{className:"doc-upload-controls",onClick:T=>T.stopPropagation(),children:[r.jsx("select",{value:_,onChange:T=>S(T.target.value),className:"doc-type-select",children:u.map(T=>r.jsx("option",{value:T,children:T},T))}),r.jsxs("label",{className:"upload-btn",children:[y?"Uploading...":"Add Files",r.jsx("input",{type:"file",multiple:!0,hidden:!0,onChange:D,disabled:y||h.length>=20})]})]})]}),!z&&r.jsx("div",{className:"doc-list",children:h.length===0?r.jsx("div",{className:"no-docs",children:f?"Drop files here to upload":"No documents uploaded yet. Drag & drop files here to upload."}):h.map(T=>r.jsxs("div",{className:"doc-item",children:[r.jsxs("div",{className:"doc-info",children:[r.jsx("span",{className:"doc-type-badge",children:T.doc_type}),r.jsx("span",{className:"doc-name",title:T.file_name,children:T.file_name})]}),r.jsxs("div",{className:"doc-meta",children:[r.jsxs("span",{children:[(T.file_size/1024).toFixed(1)," KB"]}),r.jsx("a",{href:`${window.API_BASE}/uploads/${T.file_path.split(/[\/\\]/).pop()}?token=${k}`,target:"_blank",rel:"noopener noreferrer",className:"doc-link",children:"View"}),!l&&r.jsx("button",{onClick:()=>g(T.id),style:{background:"transparent",border:"none",color:"var(--red)",cursor:"pointer",marginLeft:"4px",fontSize:"14px",lineHeight:1},title:"Delete document",children:"✕"})]})]},T.id))}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Gd({status:e}){const{cls:t,label:n}=Je[e]||Je.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Hg({steps:e,currentFilter:t,onOpenModal:n,onSetView:a,userRole:o,selectedOrderId:l,selectedOrder:s,onStepsChanged:i,selectedUnitId:d,setSelectedUnitId:u,unitSteps:h,setUnitSteps:m}){const[y,w]=p.useState([]),[_,S]=p.useState(null),z=localStorage.getItem("token"),[x,f]=p.useState(!1),[c,k]=p.useState(null),[I,D]=p.useState([]),[C,L]=p.useState(null),P=JSON.parse(localStorage.getItem("user")||"{}"),g=c?["Admin","Manager"].includes(o)||c.dept===o||c.assigned_user_id===P.id:!1,[T,j]=p.useState("details"),[N,M]=p.useState(0),A=(()=>{if(!c)return[];try{return Array.isArray(c.custom_fields)?c.custom_fields:JSON.parse(c.custom_fields||"[]")}catch{return[]}})();p.useEffect(()=>{fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${z}`}}).then(async B=>{B.ok&&D(await B.json())}).catch(console.error)},[z]);const V=async(B,te)=>{if(!g)return;const H=h.find(ie=>ie.id===B),ge=H?H.order_unit_id:d;if(ge)try{const ie=await fetch(`${window.API_BASE}/api/units/${ge}/steps/${B}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${z}`},body:JSON.stringify(te)});if(ie.ok){const F=await fetch(`${window.API_BASE}/api/units/${ge}/steps`,{headers:{Authorization:`Bearer ${z}`}}).then(Pe=>Pe.json());m(F);const be=F.find(Pe=>Pe.id===B);k(be),i&&i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:l}}))}else{const F=await ie.json().catch(()=>({}));L(F.error||"Failed to update step")}}catch(ie){console.error(ie),L("Network error — could not update step")}},U=B=>{L(null),B.order_unit_id?(k(B),j("details"),M(0),f(!0)):n(B.id)},O=e.filter(B=>!B.order_unit_id),K=[...h,...O],Y=()=>{const B=(s==null?void 0:s.units)||[];return r.jsxs("div",{className:"unit-selector-container",style:{marginBottom:24,display:"flex",alignItems:"center",gap:12},children:[r.jsx("span",{style:{fontSize:13,color:"var(--text3)",fontWeight:"bold",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Track Level:"}),r.jsxs("select",{className:"form-select",value:d,onChange:te=>u(te.target.value),style:{width:"auto",background:"var(--bg3)",fontSize:"13px",padding:"6px 12px",border:"1px solid var(--border2)",color:"var(--text)",borderRadius:"6px",cursor:"pointer"},children:[r.jsx("option",{value:"",children:"Order Milestones"}),B.map(te=>r.jsxs("option",{value:te.id,children:["Unit: ",te.unit_id," (",te.status,")"]},te.id))]})]})};p.useEffect(()=>{fetch(window.API_BASE+"/api/task_masters",{headers:{Authorization:`Bearer ${z}`}}).then(async B=>{if(B.ok){const te=await B.json();w(te)}}).catch(console.error)},[z]);const E=async B=>{if(!(!B||!l))try{(await fetch(`${window.API_BASE}/api/orders/${l}/steps`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${z}`},body:JSON.stringify({taskId:B})})).ok&&(i&&i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:l}})))}catch(te){console.error(te)}},$=(B,te)=>{S(te),B.dataTransfer.effectAllowed="move",setTimeout(()=>{B.target.style.opacity="0.5"},0)},Z=B=>{B.target.style.opacity="1",S(null)},se=(B,te)=>{B.preventDefault(),_&&_.dept!==te?B.dataTransfer.dropEffect="none":B.dataTransfer.dropEffect="move"},xe=async(B,te)=>{if(B.preventDefault(),!_||_.id===te.id||_.dept!==te.dept)return;const H=e.filter(me=>me.dept===te.dept),ge=H.findIndex(me=>me.id===_.id),ie=H.findIndex(me=>me.id===te.id);if(ge===-1||ie===-1)return;const F=[...H],[be]=F.splice(ge,1);F.splice(ie,0,be);const Pe=F.map(me=>me.id);try{(await fetch(`${window.API_BASE}/api/orders/${l}/steps/reorder`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${z}`},body:JSON.stringify({orderedIds:Pe})})).ok&&i&&(i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:l}})))}catch(me){console.error("Failed to reorder",me)}},oe=[...br].sort((B,te)=>["Admin","Manager"].includes(o)?0:B.id===o?-1:te.id===o?1:0),ve=t==="all"?oe:oe.filter(B=>B.id===t);return r.jsxs("div",{style:{display:"flex",flexDirection:"column",width:"100%"},children:[Y(),t==="all"?r.jsxs("div",{className:"lanes",children:[ve.map(B=>{const te=K.filter(F=>F.dept===B.id),H=te.some(F=>F.status==="blocked"),ge=!d&&(["Admin","Manager"].includes(o)||B.id===o),ie=y.filter(F=>F.dept===B.id&&!te.some(be=>be.task_id===F.id));return r.jsxs("div",{className:`lane${H?" active-lane":""}`,children:[r.jsxs("div",{className:"lane-label",children:[r.jsx("div",{style:{width:3,height:20,background:B.color,borderRadius:2,marginBottom:6}}),r.jsx("div",{className:"lane-name",children:B.label}),r.jsx("div",{className:"lane-sub",children:B.sub}),B.id==="Sales"&&o==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:12,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),ge&&ie.length>0&&l&&!d&&r.jsx("div",{style:{marginTop:12},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:F=>{E(F.target.value),F.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),ie.map(F=>r.jsx("option",{value:F.id,children:F.name},F.id))]})})]}),r.jsxs("div",{className:"lane-steps",children:[te.map((F,be)=>{const Pe=JSON.parse(localStorage.getItem("user")||"{}"),me=!!F.order_unit_id,it=["Admin","Manager"].includes(o)||F.dept===o||me&&F.assigned_user_id===Pe.id,q=!me&&!d&&it;return r.jsxs("div",{style:{display:"flex",alignItems:"center"},draggable:q,onDragStart:G=>q&&$(G,F),onDragEnd:Z,onDragOver:G=>se(G,B.id),onDrop:G=>q&&xe(G,F),children:[r.jsxs("div",{className:`step status-${F.status}${it?"":" read-only"}${F.dept==="Sales"&&F.status==="pending"?" pulse-sales":""}${(_==null?void 0:_.id)===F.id?" dragging":""}`,onClick:()=>U(F),style:{cursor:q?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${F.status}`}),r.jsxs("div",{className:"step-num",children:[B.id.toUpperCase().slice(0,3),"-",String(be+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[F.name,F.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4,fontSize:10,color:"var(--accent)"},children:"(Upload Required)"})]}),r.jsx("div",{className:"step-sub",children:F.sub}),r.jsx(Gd,{status:F.status}),F.notes&&r.jsx("div",{className:"step-note",children:F.notes})]}),be<te.length-1&&r.jsx("div",{className:"step-arrow",children:"›"})]},me?`unit-${F.id}`:`order-${F.id}`)}),te.length===0&&r.jsx("div",{style:{padding:12,color:"var(--text3)",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},B.id)}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
            .pulse-sales {
              animation: sales-glow 2s infinite ease-in-out;
              border: 1px solid rgba(20, 184, 166, 0.4) !important;
            }
            @keyframes sales-glow {
              0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
              50% { box-shadow: 0 0 15px 0 rgba(20, 184, 166, 0.4); }
              100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
            }
          `}})]}):r.jsx("div",{className:"flow-card-grid",children:ve.map(B=>{const te=K.filter(F=>F.dept===B.id),H=te.some(F=>F.status==="blocked"),ge=!d&&(["Admin","Manager"].includes(o)||B.id===o),ie=y.filter(F=>F.dept===B.id&&!te.some(be=>be.task_id===F.id));return r.jsxs("div",{className:`dept-flow-card${H?" has-blocked":""}`,children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:B.color}}),r.jsxs("div",{children:[r.jsx("div",{className:"dept-card-title",children:B.label}),r.jsx("div",{className:"dept-card-sub",children:B.sub})]})]}),s&&r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:s.order_number}),s.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:s.company_name}),s.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"Delivery:"})," ",new Date(s.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),s&&s.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"var(--accent)",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"var(--text2)"},children:s.notes})]}),B.id==="Sales"&&o==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:8,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),ge&&ie.length>0&&l&&!d&&r.jsx("div",{style:{marginTop:8},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:F=>{E(F.target.value),F.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),ie.map(F=>r.jsx("option",{value:F.id,children:F.name},F.id))]})})]}),r.jsxs("div",{className:"dept-card-tasks-vertical",children:[te.map((F,be)=>{const Pe=JSON.parse(localStorage.getItem("user")||"{}"),me=!!F.order_unit_id,it=["Admin","Manager"].includes(o)||F.dept===o||me&&F.assigned_user_id===Pe.id,q=!me&&!d&&it;return r.jsx("div",{style:{display:"flex",alignItems:"center"},draggable:q,onDragStart:G=>q&&$(G,F),onDragEnd:Z,onDragOver:G=>se(G,B.id),onDrop:G=>q&&xe(G,F),children:r.jsxs("div",{className:`step status-${F.status}${it?"":" read-only"}${F.dept==="Sales"&&F.status==="pending"?" pulse-sales":""}${(_==null?void 0:_.id)===F.id?" dragging":""}`,onClick:()=>U(F),style:{cursor:q?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${F.status}`}),r.jsxs("div",{className:"step-num",children:[B.id.toUpperCase().slice(0,3),"-",String(be+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[F.name,F.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4,fontSize:10,color:"var(--accent)"},children:"(Upload Required)"})]}),r.jsx("div",{className:"step-sub",children:F.sub}),r.jsx(Gd,{status:F.status}),F.notes&&r.jsx("div",{className:"step-note",children:F.notes})]})},me?`unit-${F.id}`:`order-${F.id}`)}),te.length===0&&r.jsx("div",{style:{padding:12,color:"var(--text3)",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},B.id)})}),x&&c&&r.jsx("div",{className:"modal-overlay open",onClick:B=>{B.target.className==="modal-overlay open"&&f(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:g?"Edit Unit Step":"View Unit Step"}),r.jsxs("div",{className:"modal-sub",children:[c.name," (",c.dept,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>f(!1),children:"✕"})]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid var(--border)",padding:"0 24px",marginBottom:"16px"},children:["details",...A.length>0?["fields"]:[],"documents"].map(B=>r.jsxs("button",{onClick:()=>j(B),style:{background:"transparent",border:"none",borderBottom:T===B?"2px solid var(--blue)":"2px solid transparent",color:T===B?"var(--blue)":"var(--text3)",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:T===B?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[B==="fields"?"Form Fields":B.charAt(0).toUpperCase()+B.slice(1),B==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:A.length})]},B))}),r.jsxs("div",{className:"modal-body",children:[!g&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"12px"},children:[r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:c.dept})," department."]}),C&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"12px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"12px",flexShrink:0,fontWeight:700},children:"Error:"}),r.jsx("span",{style:{flex:1},children:C}),r.jsx("button",{onClick:()=>L(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"14px",padding:"0",lineHeight:1},children:"✕"})]}),T==="details"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Status"}),g?r.jsxs("select",{className:"form-select",value:c.status,onChange:B=>{const te=B.target.value;if(c.requires_upload&&te==="done"&&N===0){alert("You must upload at least one document to complete this task.");return}V(c.id,{status:te})},style:{fontSize:"13px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${(Je[c.status]||Je.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:(Je[c.status]||Je.pending).label})})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Assign Worker"}),g?r.jsxs("select",{className:"form-select",value:c.assigned_user_id||"",onChange:B=>V(c.id,{assigned_user_id:B.target.value?parseInt(B.target.value):null}),style:{fontSize:"13px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),I.filter(B=>B.role===c.dept).map(B=>r.jsx("option",{value:B.id,children:B.username},B.id))]}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:(()=>{const B=I.find(te=>te.id===c.assigned_user_id);return B?B.username:"Unassigned"})()})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Notes"}),g?r.jsx("textarea",{className:"form-input",defaultValue:c.notes||"",onBlur:B=>V(c.id,{notes:B.target.value}),placeholder:"Add step notes...",style:{fontSize:"13px",height:"60px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"10px 12px",borderRadius:"6px",minHeight:"40px",whiteSpace:"pre-wrap"},children:c.notes||"No notes added."})]})]}),T==="fields"&&A.length>0&&r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:A.map((B,te)=>{var ge;const H=ie=>{const F=[...A];F[te].value=ie,V(c.id,{custom_fields:F})};return r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 16px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:B.label}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"10px",color:"var(--text3)",textTransform:"uppercase",background:"var(--bg4)",padding:"1px 5px",borderRadius:"3px"},children:B.type})]}),g?B.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!B.value,onChange:ie=>H(ie.target.checked)}):B.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:B.value||"",onChange:ie=>H(ie.target.value),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(ge=B.options)==null?void 0:ge.map(ie=>r.jsx("option",{value:ie,children:ie},ie))]}):r.jsx("input",{type:B.type==="Number"?"number":"text",className:"form-input",defaultValue:B.value||"",onBlur:ie=>H(ie.target.value),style:{fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"#ddd",fontWeight:"500",marginTop:"2px"},children:B.type==="Yes/No"?B.value==="Yes"||B.value===!0?"Yes":"No":B.value||"—"})]},B.id)})}),T==="documents"&&r.jsxs("div",{children:[c.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"This task requires at least one document to be marked as Done."}),r.jsx(Oo,{entityType:"UnitStep",entityId:c.id,initialDocs:[],onDocsUpdate:B=>M(B.length),readOnly:!g,defaultDocType:c.default_doc_type||"General",userRole:o})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Qg({status:e}){const{cls:t,label:n}=Je[e]||Je.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Yg({currentFilter:e,userRole:t,onSetView:n}){const[a,o]=p.useState([]),[l,s]=p.useState(!0),[i,d]=p.useState("all"),[u,h]=p.useState("incomplete"),[m,y]=p.useState("updated"),[w,_]=p.useState(""),S=localStorage.getItem("token");p.useEffect(()=>{z();const c=()=>{z()};return window.addEventListener("orderUpdated",c),()=>window.removeEventListener("orderUpdated",c)},[]);const z=async()=>{try{const c=await fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${S}`}});c.ok&&o(await c.json())}catch(c){console.error(c)}finally{s(!1)}},x=e==="all"?br:br.filter(c=>c.id===e);if(l)return r.jsx("div",{className:"loading",style:{padding:40,textAlign:"center",color:"#888"},children:"Loading board..."});const f=a.filter(c=>{if(i!=="all"&&(c.priority||"Medium").toLowerCase()!==i||u==="incomplete"&&c.status==="completed"||u==="completed"&&c.status!=="completed")return!1;if(w.trim()!==""){const k=w.trim().toLowerCase().split(/\s+/),I=(c.order_number||"").toLowerCase(),D=(c.company_name||"").toLowerCase(),C=(c.po_number||"").toLowerCase();if(!k.every(P=>I.includes(P)||D.includes(P)||C.includes(P)||c.steps&&c.steps.some(g=>(g.name||"").toLowerCase().includes(P)||(g.dept||"").toLowerCase().includes(P))))return!1}return!0}).sort((c,k)=>{if(m==="updated"){const I=new Date(c.updated_at||0);return new Date(k.updated_at||0)-I}return 0});return r.jsxs("div",{className:"board-view-orders",children:[r.jsxs("div",{className:"board-filters",children:[r.jsxs("div",{className:"filter-group",children:[r.jsx(zi,{size:14,className:"filter-icon"}),r.jsx("span",{className:"filter-label",children:"Sort:"}),r.jsxs("select",{value:m,onChange:c=>y(c.target.value),className:"board-select",children:[r.jsx("option",{value:"updated",children:"Recently Updated"}),r.jsx("option",{value:"created",children:"Recently Created"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Status:"}),r.jsxs("select",{value:u,onChange:c=>h(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Orders"}),r.jsx("option",{value:"incomplete",children:"Incomplete Only"}),r.jsx("option",{value:"completed",children:"Completed Only"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Priority:"}),r.jsxs("select",{value:i,onChange:c=>d(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"low",children:"Low"})]})]}),r.jsxs("div",{className:"board-search-container",children:[r.jsx(Mr,{size:14,className:"board-search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by Order, PO, Company or Task...",value:w,onChange:c=>_(c.target.value),className:"board-search-input"}),w&&r.jsx("button",{className:"search-clear-btn",onClick:()=>_(""),title:"Clear search",children:r.jsx(vn,{size:14})})]})]}),f.map(c=>{if(c.status==="completed")return e!=="all"&&!c.steps.some(C=>C.dept===e)?null:r.jsxs("div",{className:"completed-order-row",onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"completed-order-header",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsxs("div",{className:"completed-badges-row",children:[c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"Delivery:"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]}),r.jsx("span",{className:"completed-global-badge",children:"COMPLETED"})]})]}),r.jsx("div",{className:"completed-banner",children:r.jsxs("div",{className:"completed-banner-content",children:[r.jsx("div",{className:"completed-icon-badge",children:"✓"}),r.jsxs("div",{className:"completed-text-content",children:[r.jsx("span",{className:"completed-title",children:"Order Fully Completed"}),r.jsx("span",{className:"completed-subtitle",children:"All steps have been successfully finalized. Click to view process flow logs."})]})]})})]},c.id);let k=[],I=[];if(k=c.steps.filter(D=>["inprogress","blocked","review"].includes(D.status)),k.length===0){const D=c.steps.find(C=>C.status==="pending");if(D)k=[D];else return null}return I=x.filter(D=>k.some(C=>C.dept===D.id)),I.length===0?null:r.jsxs("div",{className:"board-order-row",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsx("div",{className:"board-dept-grid",children:I.map(D=>{const C=k.filter(L=>L.dept===D.id);return r.jsxs("div",{className:"dept-flow-card",style:{borderTopColor:D.color},onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:D.color}}),r.jsx("div",{className:"dept-card-title",children:D.label})]}),r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:c.order_number}),c.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"#aaa",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:c.company_name}),c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"Delivery:"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),c.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"#f59e0b",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"#d1d5db"},children:c.notes})]})]}),r.jsx("div",{className:"dept-card-tasks",children:C.map(L=>r.jsxs("div",{className:`board-task status-${L.status}`,children:[r.jsx("span",{className:`step-dot dot-${L.status}`}),r.jsx("div",{className:"board-task-name",title:L.name,children:L.name}),r.jsx(Qg,{status:L.status})]},L.id))})]},D.id)})})]},c.id)}),f.length===0&&r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"No orders match the current filters."}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const Jd={Urgent:0,High:1,Medium:2,Low:3},Kd={Urgent:{bg:"rgba(239,68,68,0.12)",color:"#ef4444",border:"rgba(239,68,68,0.35)"},High:{bg:"rgba(249,115,22,0.12)",color:"#f97316",border:"rgba(249,115,22,0.35)"},Medium:{bg:"rgba(234,179,8,0.12)",color:"#eab308",border:"rgba(234,179,8,0.35)"},Low:{bg:"rgba(99,102,241,0.12)",color:"#818cf8",border:"rgba(99,102,241,0.35)"}},Xd={Completed:{bg:"rgba(16,185,129,0.12)",color:"#10b981",border:"rgba(16,185,129,0.3)"},Blocked:{bg:"rgba(239,68,68,0.12)",color:"#ef4444",border:"rgba(239,68,68,0.3)"},"In Progress":{bg:"rgba(59,130,246,0.12)",color:"#3b82f6",border:"rgba(59,130,246,0.3)"},"On Hold":{bg:"rgba(148,163,184,0.12)",color:"#94a3b8",border:"rgba(148,163,184,0.3)"}};function Gg({currentFilter:e,onSetView:t}){const[n,a]=p.useState([]),o=p.useRef(null);p.useEffect(()=>{const g=o.current;if(!g)return;let T=!1,j,N;const M=O=>{["INPUT","SELECT","OPTION","BUTTON","A","TH"].includes(O.target.tagName)||O.target.closest("th")||O.target.closest("button")||(T=!0,g.classList.add("active-drag"),j=O.pageX-g.offsetLeft,N=g.scrollLeft)},A=()=>{T=!1,g.classList.remove("active-drag")},V=()=>{T=!1,g.classList.remove("active-drag")},U=O=>{if(!T)return;O.preventDefault();const Y=(O.pageX-g.offsetLeft-j)*1.5;g.scrollLeft=N-Y};return g.addEventListener("mousedown",M),g.addEventListener("mouseleave",A),g.addEventListener("mouseup",V),g.addEventListener("mousemove",U),()=>{g.removeEventListener("mousedown",M),g.removeEventListener("mouseleave",A),g.removeEventListener("mouseup",V),g.removeEventListener("mousemove",U)}},[]);const[l,s]=p.useState(!0),[i,d]=p.useState(""),[u,h]=p.useState("all"),[m,y]=p.useState("incomplete"),[w,_]=p.useState("order_number"),[S,z]=p.useState("asc"),x=localStorage.getItem("token");p.useEffect(()=>{f();const g=()=>{f()};return window.addEventListener("orderUpdated",g),()=>window.removeEventListener("orderUpdated",g)},[e]);const f=async()=>{s(!0);try{const g=e==="all"?"Sales":e,T=await fetch(`${window.API_BASE}/api/dept-worklist/${encodeURIComponent(g)}`,{headers:{Authorization:`Bearer ${x}`}});T.ok&&a(await T.json())}catch(g){console.error(g)}finally{s(!1)}},c=(g,T)=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:parseInt(g),unitId:parseInt(T)}}))},k=g=>{w===g?z(T=>T==="asc"?"desc":"asc"):(_(g),z("asc"))},I=g=>{var T;return g.unit_status==="Dispatched"?"Completed":g.unit_status==="Hold"?"On Hold":(T=g.dept_steps)!=null&&T.some(j=>j.status==="blocked")?"Blocked":"In Progress"},C=[...n.filter(g=>{const T=I(g);if(u!=="all"&&(g.priority||"Medium").toLowerCase()!==u||m==="incomplete"&&T==="Completed"||m==="completed"&&T!=="Completed"||m==="blocked"&&T!=="Blocked"||m==="hold"&&T!=="On Hold")return!1;if(i.trim()){const j=i.trim().toLowerCase();return(g.order_number||"").toLowerCase().includes(j)||(g.unit_serial||"").toLowerCase().includes(j)||(g.company_name||"").toLowerCase().includes(j)||(g.po_number||"").toLowerCase().includes(j)||(g.reference_number||"").toLowerCase().includes(j)||(g.end_client_name||"").toLowerCase().includes(j)||(g.material_description||"").toLowerCase().includes(j)||(g.part_number||"").toLowerCase().includes(j)}return!0})].sort((g,T)=>{let j,N;return w==="priority"?(j=Jd[g.priority||"Medium"]??2,N=Jd[T.priority||"Medium"]??2):w==="delivery_date"?(j=g.delivery_date?new Date(g.delivery_date).getTime():1/0,N=T.delivery_date?new Date(T.delivery_date).getTime():1/0):w==="unit_status"?(j=I(g),N=I(T)):(j=(g[w]||"").toString().toLowerCase(),N=(T[w]||"").toString().toLowerCase()),j<N?S==="asc"?-1:1:j>N?S==="asc"?1:-1:0}),L=({col:g})=>w!==g?r.jsx(cg,{size:11,style:{opacity:.3,marginLeft:4}}):S==="asc"?r.jsx(ug,{size:11,style:{color:"var(--blue)",marginLeft:4}}):r.jsx(Io,{size:11,style:{color:"var(--blue)",marginLeft:4}}),P=({label:g,col:T,style:j})=>r.jsx("th",{onClick:()=>T&&k(T),style:{cursor:T?"pointer":"default",userSelect:"none",whiteSpace:"nowrap",padding:"11px 14px",fontSize:"11px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.6px",color:w===T?"var(--blue)":"var(--text3)",background:"var(--bg3)",borderBottom:"1px solid var(--border)",...j},children:r.jsxs("span",{style:{display:"inline-flex",alignItems:"center"},children:[g,T&&r.jsx(L,{col:T})]})});return l?r.jsx("div",{style:{padding:60,textAlign:"center",color:"var(--text3)"},children:r.jsx("div",{style:{fontSize:13},children:"Loading units..."})}):r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:0,height:"100%"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"var(--bg2)",borderBottom:"1px solid var(--border)",flexWrap:"wrap"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"7px 12px",flex:"1 1 200px",minWidth:0},children:[r.jsx(Mr,{size:13,style:{color:"var(--text3)",flexShrink:0}}),r.jsx("input",{type:"text",placeholder:"Search order, serial, PO, description, customer...",value:i,onChange:g=>d(g.target.value),style:{background:"none",border:"none",outline:"none",color:"var(--text)",fontSize:13,width:"100%"}}),i&&r.jsx("button",{onClick:()=>d(""),style:{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",display:"flex",padding:0},children:r.jsx(vn,{size:13})})]}),r.jsxs("select",{value:m,onChange:g=>y(g.target.value),style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text2)",fontSize:12,padding:"7px 10px",cursor:"pointer",outline:"none"},children:[r.jsx("option",{value:"all",children:"All Status"}),r.jsx("option",{value:"incomplete",children:"Incomplete"}),r.jsx("option",{value:"completed",children:"Completed"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"hold",children:"On Hold"})]}),r.jsxs("select",{value:u,onChange:g=>h(g.target.value),style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text2)",fontSize:12,padding:"7px 10px",cursor:"pointer",outline:"none"},children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"urgent",children:"Urgent"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"low",children:"Low"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginLeft:"auto",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",fontSize:12,color:"var(--text3)",whiteSpace:"nowrap",flexShrink:0},children:[r.jsx(bg,{size:13}),r.jsx("strong",{style:{color:"var(--text)"},children:C.length})," unit items"]})]}),r.jsx("div",{ref:o,className:"table-responsive-scroll",style:{overflowX:"auto",overflowY:"auto",flex:1},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:13},children:[r.jsx("thead",{style:{position:"sticky",top:0,zIndex:2},children:r.jsxs("tr",{children:[r.jsx(P,{label:"Order #",col:"order_number"}),r.jsx(P,{label:"Unit Serial",col:"unit_serial"}),r.jsx(P,{label:"Customer",col:"company_name"}),r.jsx(P,{label:"PO Number",col:"po_number"}),r.jsx(P,{label:"Ref #",col:"reference_number"}),r.jsx(P,{label:"End Client",col:"end_client_name"}),r.jsx(P,{label:"Part Number",col:"part_number"}),r.jsx(P,{label:"Description",col:"material_description"}),r.jsx(P,{label:"Current Dept",col:"current_dept"}),r.jsx(P,{label:"Priority",col:"priority",style:{textAlign:"center"}}),r.jsx(P,{label:"Delivery",col:"delivery_date"}),r.jsx(P,{label:"Status",col:"unit_status",style:{textAlign:"center"}})]})}),r.jsxs("tbody",{children:[C.map((g,T)=>{const j=I(g),N=Xd[j]||Xd["In Progress"],M=g.priority||"Medium",A=Kd[M]||Kd.Medium,V=g.delivery_date&&new Date(g.delivery_date)<new Date&&j!=="Completed";return r.jsxs("tr",{onClick:()=>c(g.order_id,g.id),style:{background:T%2===0?"var(--bg)":"var(--bg2)",cursor:"pointer",transition:"background 0.12s",borderBottom:"1px solid var(--border)"},onMouseEnter:U=>U.currentTarget.style.background="var(--bg4)",onMouseLeave:U=>U.currentTarget.style.background=T%2===0?"var(--bg)":"var(--bg2)",children:[r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--blue)",fontSize:12,whiteSpace:"nowrap"},children:g.order_number}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--text)",fontSize:12,whiteSpace:"nowrap"},children:g.unit_serial}),r.jsxs("td",{style:{padding:"10px 14px",fontWeight:600,color:"var(--text)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[g.company_name||r.jsx("span",{style:{color:"var(--text3)",fontStyle:"italic"},children:"—"}),g.company_city&&r.jsxs("span",{style:{color:"var(--text3)",fontWeight:400,fontSize:11,marginLeft:4},children:["· ",g.company_city]})]}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",color:"var(--text3)",fontSize:12},children:g.po_number||"—"}),r.jsx("td",{style:{padding:"10px 14px",fontSize:12,whiteSpace:"nowrap"},children:g.reference_number?r.jsx("span",{style:{fontFamily:"var(--font-mono)",color:"#f59e0b",fontWeight:600},children:g.reference_number}):r.jsx("span",{style:{color:"var(--text3)",opacity:.4},children:"—"})}),r.jsx("td",{style:{padding:"10px 14px",color:"var(--text3)",fontSize:12,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:g.end_client_name||r.jsx("span",{style:{opacity:.4},children:"—"})}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--text2)"},children:g.part_number||"—"}),r.jsx("td",{style:{padding:"10px 14px",color:"var(--text2)",fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:g.material_description,children:g.material_description||"—"}),r.jsx("td",{style:{padding:"10px 14px",fontWeight:600,color:"var(--text2)"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:"rgba(99,102,241,0.1)",color:"#818cf8",border:"1px solid rgba(99,102,241,0.25)",textTransform:"uppercase",letterSpacing:"0.4px"},children:g.current_dept||"Sales"})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:A.bg,color:A.color,border:`1px solid ${A.border}`,textTransform:"uppercase",letterSpacing:"0.5px"},children:M})}),r.jsxs("td",{style:{padding:"10px 14px",color:V?"#ef4444":"var(--text2)",fontWeight:V?600:400,whiteSpace:"nowrap",fontSize:12},children:[g.delivery_date?new Date(g.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"}),V&&r.jsx("span",{style:{fontSize:9,color:"#ef4444",fontWeight:700,marginLeft:5,background:"rgba(239,68,68,0.12)",borderRadius:4,padding:"1px 5px"},children:"OVERDUE"})]}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:N.bg,color:N.color,border:`1px solid ${N.border}`,textTransform:"uppercase",letterSpacing:"0.4px",whiteSpace:"nowrap"},children:j})})]},g.unit_id)}),C.length===0&&r.jsx("tr",{children:r.jsxs("td",{colSpan:12,style:{textAlign:"center",padding:"48px 24px",color:"var(--text3)"},children:[r.jsx(Mr,{size:28,style:{opacity:.3,marginBottom:8,display:"block",margin:"0 auto 8px"}}),r.jsx("div",{style:{fontSize:14},children:"No units match the current filters"})]})})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .table-responsive-scroll {
          cursor: grab;
        }
        .table-responsive-scroll.active-drag {
          cursor: grabbing;
          user-select: none;
        }
      `}})]})}function Jg({selectedStep:e,activityLog:t,selectedOrder:n,isOpen:a=!0,onToggle:o}){var s,i,d;const l=e?br.find(u=>u.id===e.dept):null;return r.jsxs("div",{className:`right-panel${a?"":" right-panel--collapsed"}`,children:[r.jsx("button",{className:"rp-toggle",onClick:o,title:a?"Collapse panel":"Expand panel","aria-label":a?"Collapse sidebar":"Expand sidebar",children:r.jsx(Ep,{size:15,style:{transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)",transform:a?"rotate(0deg)":"rotate(180deg)"}})}),r.jsx("div",{className:"rp-inner",children:r.jsxs("div",{className:"rp-content",children:[r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Selected Step"}),e?r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:8,color:(l==null?void 0:l.color)||"var(--text)"},children:e.name}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Department"}),r.jsx("span",{className:"detail-val",style:{color:(l==null?void 0:l.color)||"inherit"},children:e.dept})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Status"}),r.jsx("span",{className:`step-status-badge badge-${e.status}`,style:{marginTop:0},children:e.status.toUpperCase()})]}),e.notes&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Notes"}),r.jsx("span",{className:"detail-val",style:{color:"var(--text2)",maxWidth:130,textAlign:"right",wordBreak:"break-word"},children:e.notes})]})]}):r.jsx("div",{className:"empty-detail",children:"Click any step to see details."})]}),n?r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Order Overview"}),r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:4,fontFamily:"var(--font-mono)",fontSize:13},children:n.order_number}),n.company_name&&r.jsx("div",{style:{color:"var(--text2)",fontSize:11,marginBottom:12},children:n.company_name}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Priority"}),r.jsx("span",{className:`priority-badge ${((s=n.priority)==null?void 0:s.toLowerCase())||"medium"}`,style:{fontSize:10},children:n.priority||"Medium"})]}),n.po_number&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"PO Number"}),r.jsx("span",{className:"detail-val",children:n.po_number})]}),n.reference_number&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Cust. Ref #"}),r.jsx("span",{className:"detail-val",children:n.reference_number})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Classification"}),r.jsx("span",{className:"detail-val",style:{fontWeight:"600",color:n.classification==="Non-Standard"?"var(--blue)":"var(--text2)"},children:n.classification||"Standard"})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Order Date"}),r.jsx("span",{className:"detail-val",children:n.order_date?new Date(n.order_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"N/A"})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Delivery"}),r.jsx("span",{className:"detail-val",style:{color:"var(--accent)"},children:n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"TBD"})]}),n.packaging_type&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Packaging"}),r.jsxs("span",{className:"detail-val",style:{color:"var(--purple)"},children:[n.packaging_type==="Wooden Packaging"?"🪵":"🫧"," ",n.packaging_type]})]}),((i=n.units)==null?void 0:i.length)>0&&r.jsxs("div",{style:{marginTop:12,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsxs("span",{className:"detail-key",style:{display:"block",marginBottom:8},children:["Units (",n.units.length,")"]}),r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:4},children:[n.units.slice(0,12).map(u=>r.jsx("span",{style:{fontSize:9,padding:"2px 5px",borderRadius:3,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontFamily:"var(--font-mono)"},children:u.short_serial},u.id)),n.units.length>12&&r.jsxs("span",{style:{fontSize:9,color:"var(--text3)",padding:"2px 4px"},children:["+",n.units.length-12," more"]})]})]}),((d=n.documents)==null?void 0:d.filter(u=>u.doc_type!=="TaskUpload").length)>0&&r.jsxs("div",{style:{marginTop:10,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsx("span",{className:"detail-key",style:{display:"block",marginBottom:6},children:"Documents"}),n.documents.filter(u=>u.doc_type!=="TaskUpload").map(u=>r.jsx("div",{style:{fontSize:11,marginBottom:3},children:r.jsx("a",{href:`${window.API_BASE}/uploads/${u.file_path.split(/[/\\]/).pop()}?token=${localStorage.getItem("token")}`,target:"_blank",rel:"noopener noreferrer",style:{color:"var(--blue)",textDecoration:"none"},children:u.file_name})},u.id))]})]})]}):null,r.jsxs("div",{className:"panel-section",style:{flex:1},children:[r.jsxs("div",{className:"panel-sec-title",style:{display:"flex",alignItems:"center",gap:6},children:[r.jsx(Dp,{size:10}),"Activity Log"]}),r.jsxs("div",{id:"activityLog",style:{maxHeight:280,overflowY:"auto"},children:[t.length===0&&r.jsx("div",{className:"empty-detail",children:"No activity recorded yet."}),t.slice(0,50).map((u,h)=>{var y;const m=((y=br.find(w=>w.id===u.dept))==null?void 0:y.color)||"var(--text2)";return r.jsxs("div",{className:"log-entry",children:[r.jsx("div",{className:"log-time",children:u.time}),r.jsxs("div",{className:"log-text",children:[r.jsxs("span",{className:"log-dept",style:{color:m},children:["[",u.dept,"]"]})," ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:600},children:u.username}),": ",u.text]})]},h)})]})]})]})})]})}const Zd=e=>{if(!e)return"";if(typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e))return e;try{const t=new Date(e);if(!isNaN(t.getTime()))return t.toISOString().split("T")[0]}catch{}return""};function Kg({step:e,isOpen:t,onClose:n,onSave:a,onDelete:o,userRole:l,selectedOrder:s}){const[i,d]=p.useState("pending"),[u,h]=p.useState(""),[m,y]=p.useState(null),[w,_]=p.useState(""),[S,z]=p.useState({layout:!1,electrical:!1,bom:!1}),[x,f]=p.useState(0),[c,k]=p.useState([]),[I,D]=p.useState("details"),[C,L]=p.useState(null),P=["Admin","Manager"].includes(l),g=e?(["Admin","Manager"].includes(l)||e.dept===l)&&(s==null?void 0:s.hold_status)!=="Approved":!1;if(p.useEffect(()=>{if(e){d(e.status),h(e.notes||""),_(Zd(e.dispatch_date)),y(null),z({layout:!1,electrical:!1,bom:!1}),f(0),D("details"),L(null);try{const A=Array.isArray(e.custom_fields)?e.custom_fields:JSON.parse(e.custom_fields||"[]");k(Array.isArray(A)?A:[])}catch{k([])}}},[e]),!t||!e)return null;const T=async()=>{if(!g)return;if(e.requires_upload&&i==="done"&&x===0){alert("You must upload at least one document to complete this task.");return}L(null);const A=await a({status:i,notes:u,qcFailTarget:m,dispatchDate:w,checklist:S,custom_fields:c});A&&L(A)},j=(A,V)=>{k(U=>U.map((O,K)=>K===A?{...O,value:V}:O))},N=A=>{A.target.className==="modal-overlay open"&&n()},M=(A,V)=>{switch(A.type){case"Text":return r.jsx("input",{type:"text",className:"form-input",value:A.value||"",onChange:U=>j(V,U.target.value),placeholder:`Enter ${A.label}...`,disabled:!g});case"Number":return r.jsx("input",{type:"number",className:"form-input",value:A.value||"",onChange:U=>j(V,U.target.value),disabled:!g});case"Date":return r.jsx("input",{type:"date",className:"form-input",value:Zd(A.value),onChange:U=>j(V,U.target.value),disabled:!g});case"Yes/No":return r.jsx("div",{style:{display:"flex",gap:"12px",marginTop:"4px"},children:["Yes","No"].map(U=>r.jsx("button",{type:"button",onClick:()=>g&&j(V,U),style:{padding:"6px 20px",borderRadius:"6px",border:"1px solid",cursor:g?"pointer":"default",fontSize:"13px",fontWeight:"600",background:A.value===U?U==="Yes"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)":"transparent",borderColor:A.value===U?U==="Yes"?"#10b981":"#ef4444":"#444",color:A.value===U?U==="Yes"?"#10b981":"#ef4444":"#888",opacity:!g&&A.value!==U?.4:1},children:U},U))});case"Dropdown":return r.jsxs("select",{className:"form-select",value:A.value||"",onChange:U=>j(V,U.target.value),disabled:!g,children:[r.jsx("option",{value:"",children:"-- Select --"}),(A.options||[]).map(U=>r.jsx("option",{value:U,children:U},U))]});default:return r.jsx("input",{type:"text",className:"form-input",value:A.value||"",onChange:U=>j(V,U.target.value),placeholder:`Enter ${A.label}...`,disabled:!g})}};return r.jsxs("div",{className:"modal-overlay open",onClick:N,children:[r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:e.name}),r.jsxs("div",{className:"modal-sub",children:[e.dept," — ",e.sub]})]}),r.jsx("button",{className:"modal-close",onClick:n,children:"✕"})]}),(s==null?void 0:s.hold_status)==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.08)",borderBottom:"1px solid rgba(239, 68, 68, 0.15)",padding:"12px 24px",color:"#ef4444",fontSize:"12px",fontWeight:"500"},children:[r.jsx("strong",{children:"Order is on hold."})," Flow updates and document uploads are disabled."]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid var(--border)",padding:"0 24px"},children:["details",...c.length>0?["fields"]:[],"documents"].map(A=>r.jsxs("button",{onClick:()=>D(A),style:{background:"transparent",border:"none",borderBottom:I===A?"2px solid var(--blue)":"2px solid transparent",color:I===A?"var(--blue)":"var(--text3)",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:I===A?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[A==="fields"?"Form Fields":A.charAt(0).toUpperCase()+A.slice(1),A==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:c.length})]},A))}),r.jsxs("div",{className:"modal-body",children:[I==="details"&&r.jsxs(r.Fragment,{children:[!g&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px"}}),r.jsxs("span",{children:[r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:e.dept})," department."]})]}),C&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"13px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px",flexShrink:0}}),r.jsx("span",{style:{flex:1},children:C}),r.jsx("button",{onClick:()=>L(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"16px",padding:"0",lineHeight:1},children:"✕"})]}),s&&e.order_fields&&e.order_fields.length>0&&r.jsxs("div",{style:{marginBottom:"16px",padding:"12px 16px",background:"rgba(59,130,246,0.05)",border:"1px solid rgba(59,130,246,0.15)",borderRadius:"8px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"#3b82f6",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"10px"},children:"Order Reference"}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))",gap:"8px"},children:e.order_fields.map(A=>{const V={order_number:"Order #",company_name:"Company",delivery_date:"Delivery Date",po_number:"PO Number",packaging_type:"Packaging",priority:"Priority",notes:"Order Notes"};let U=s[A];return A==="delivery_date"&&U&&(U=new Date(U).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})),r.jsxs("div",{style:{background:"var(--bg3)",borderRadius:"6px",padding:"8px 10px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"3px"},children:V[A]||A}),r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",fontWeight:"500"},children:U||"—"})]},A)})})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Status"}),g?r.jsxs("select",{className:"form-select",value:i,onChange:A=>d(A.target.value),children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"review",children:"Under Review"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${(Je[i]||Je.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:(Je[i]||Je.pending).label})})]}),e.special==="qc"&&r.jsxs("div",{id:"qcFailArea",children:[r.jsx("label",{style:{fontSize:10,color:"var(--text3)",display:"block",marginBottom:6},children:"If QC Fail — return to:"}),g?r.jsxs("div",{className:"qc-options",children:[r.jsxs("div",{className:`qc-opt${m==="production"?" selected":""}`,onClick:()=>g&&y("production"),style:{cursor:g?"pointer":"default"},children:["Production",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Rework"})]}),r.jsxs("div",{className:`qc-opt${m==="design"?" selected":""}`,onClick:()=>g&&y("design"),style:{cursor:g?"pointer":"default"},children:["Design",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Re-check"})]})]}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:m?`Returned to ${m.charAt(0).toUpperCase()+m.slice(1)}`:"No fail action selected"})]}),e.special==="design"&&r.jsxs("div",{className:"design-checklist",children:[r.jsx("div",{className:"design-checklist-title",children:"Simultaneous Release Checklist"}),g?r.jsxs(r.Fragment,{children:[r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:S.layout,onChange:A=>z({...S,layout:A.target.checked})})," Panel Layout (for Fitter)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:S.electrical,onChange:A=>z({...S,electrical:A.target.checked})})," Electrical Design (for Wireman)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:S.bom,onChange:A=>z({...S,bom:A.target.checked})})," BOM Released to Purchase & Stores"]})]}):r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px"},children:[r.jsxs("div",{children:[S.layout?"Yes":"No"," Panel Layout (for Fitter)"]}),r.jsxs("div",{children:[S.electrical?"Yes":"No"," Panel Design (for Wireman)"]}),r.jsxs("div",{children:[S.bom?"Yes":"No"," BOM Released to Purchase & Stores"]})]})]}),e.special==="dispatch"&&r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirmed Dispatch Date"}),g?r.jsx("input",{type:"date",className:"form-input",value:w,onChange:A=>_(A.target.value)}):r.jsx("div",{style:{fontSize:"14px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:w?new Date(w).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"Not set"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Notes / Remarks"}),g?r.jsx("textarea",{className:"form-textarea",placeholder:"Add notes…",value:u,onChange:A=>h(A.target.value)}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"10px 14px",borderRadius:"6px",border:"1px solid var(--border)",minHeight:"40px",whiteSpace:"pre-wrap"},children:u||"No notes or remarks added."})]})]}),I==="fields"&&c.length>0&&r.jsxs("div",{children:[r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",marginBottom:"16px"},children:g?"Fill in the required information for this task.":"Information filled in for this task."}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:c.map((A,V)=>r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 16px"},children:[r.jsx("div",{style:{marginBottom:"8px"},children:r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:A.label})}),g?M(A,V):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",fontWeight:"500",marginTop:"4px"},children:A.type==="Yes/No"?A.value==="Yes"||A.value===!0?"Yes":"No":A.value||"—"})]},V))})]}),I==="documents"&&r.jsxs("div",{children:[e.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"This task requires at least one document to be marked as Done."}),r.jsx(Oo,{entityType:"Step",entityId:e.id,initialDocs:[],onDocsUpdate:A=>f(A.length),readOnly:!g,defaultDocType:e.default_doc_type||"General",userRole:l})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"24px",paddingTop:"16px",borderTop:"1px solid var(--border)"},children:[P&&g?r.jsx("button",{className:"vbtn",style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444"},onClick:()=>o(e.id),children:"Delete Task"}):r.jsx("div",{}),r.jsx("div",{style:{display:"flex",gap:"12px"},children:g?r.jsxs(r.Fragment,{children:[r.jsx("button",{className:"btn-cancel",onClick:n,children:"Cancel"}),r.jsx("button",{className:"btn-save",onClick:T,children:"Update Status"})]}):r.jsx("button",{className:"btn-cancel",onClick:n,style:{minWidth:"100px"},children:"Close"})})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Xg(){const[e,t]=p.useState(""),[n,a]=p.useState(""),[o,l]=p.useState(!1),[s,i]=p.useState(""),[d,u]=p.useState(!1),h=Ci();p.useEffect(()=>{localStorage.getItem("token")&&h("/dashboard")},[h]);const m=async y=>{y.preventDefault(),i(""),u(!0);try{const w=await fetch(window.API_BASE+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:n})}),_=await w.json();if(!w.ok)throw new Error(_.error||"Login failed");localStorage.setItem("token",_.token),localStorage.setItem("user",JSON.stringify(_.user)),h("/dashboard")}catch(w){i(w.message)}finally{u(!1)}};return r.jsx("div",{className:"auth-container",children:r.jsxs("div",{className:"auth-card",children:[r.jsxs("div",{className:"auth-header",children:[r.jsx("div",{className:"auth-logo",children:r.jsx(kg,{size:32,className:"neon-text"})}),r.jsx("h1",{children:"Welcome Back"}),r.jsx("p",{children:"Sign in to access your ERP dashboard"})]}),r.jsxs("form",{onSubmit:m,className:"auth-form",children:[s&&r.jsxs("div",{className:"auth-error",children:[r.jsx(Ao,{size:18}),r.jsx("span",{children:s})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"email",children:"Email Address / Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Tp,{className:"input-icon",size:18}),r.jsx("input",{id:"email",type:"text",placeholder:"email or username",value:e,onChange:y=>t(y.target.value),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"password",children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(nn,{className:"input-icon",size:18}),r.jsx("input",{id:"password",type:o?"text":"password",placeholder:"••••••••",value:n,onChange:y=>a(y.target.value),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>l(!o),"aria-label":o?"Hide password":"Show password",children:o?r.jsx($n,{size:18}):r.jsx(Un,{size:18})})]})]}),r.jsx("button",{type:"submit",className:"auth-button",disabled:d,children:d?r.jsx(Fn,{className:"animate-spin"}):"Sign In"})]})]})})}function Zg(){const[e,t]=p.useState([]),[n,a]=p.useState(!0),[o,l]=p.useState(null),[s,i]=p.useState(!1),[d,u]=p.useState({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),[h,m]=p.useState(!1),[y,w]=p.useState(""),[_,S]=p.useState(!1),[z,x]=p.useState(!1),[f,c]=p.useState(null),[k,I]=p.useState(!1),[D,C]=p.useState({username:"",email:"",role:"",password:"",confirmPassword:""}),[L,P]=p.useState(!1),[g,T]=p.useState(!1),[j,N]=p.useState(""),[M,A]=p.useState(!1),[V,U]=p.useState(null),[O,K]=p.useState(!1),[Y,E]=p.useState(""),$=localStorage.getItem("token"),Z=["Admin","Manager","Sales","Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Planning","Viewer"];p.useEffect(()=>{se()},[]);const se=async()=>{try{const H=await fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${$}`}}),ge=await H.json();H.ok&&t(ge)}catch(H){console.error("Failed to fetch users",H)}finally{a(!1)}},xe=async H=>{if(H.preventDefault(),m(!0),w(""),d.password!==d.confirmPassword){w("Passwords do not match"),m(!1);return}try{const{confirmPassword:ge,...ie}=d,F=await fetch(window.API_BASE+"/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${$}`},body:JSON.stringify(ie)}),be=await F.json();F.ok?(i(!1),u({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),S(!1),x(!1),se()):w(be.error||"Failed to create user")}catch{w("Network error")}finally{m(!1)}},oe=H=>{c(H),C({username:H.username,email:H.email,role:H.role,password:"",confirmPassword:""}),N(""),P(!1),T(!1),I(!0)},ve=()=>{c(null),I(!1),P(!1),T(!1)},B=async H=>{if(H.preventDefault(),A(!0),N(""),D.password&&D.password!==D.confirmPassword){N("Passwords do not match"),A(!1);return}try{const{confirmPassword:ge,...ie}=D,F=await fetch(`${window.API_BASE}/api/users/${f.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${$}`},body:JSON.stringify(ie)}),be=await F.json();F.ok?(I(!1),c(null),se()):N(be.error||"Failed to update user")}catch{N("Network error")}finally{A(!1)}},te=async()=>{if(V){K(!0),E("");try{const H=await fetch(`${window.API_BASE}/api/users/${V.id}`,{method:"DELETE",headers:{Authorization:`Bearer ${$}`}}),ge=await H.json();H.ok?(U(null),se()):E(ge.error||"Failed to delete user")}catch{E("Network error")}finally{K(!1)}}};return n?r.jsxs("div",{className:"loading-state",children:[r.jsx(Fn,{className:"animate-spin"})," Loading User Directory..."]}):r.jsxs("div",{className:"user-mgmt",children:[r.jsxs("div",{className:"mgmt-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Ip,{size:20}),r.jsx("h2",{children:"User Management Directory"}),r.jsxs("span",{className:"badge-count",children:[e.length," Total Accounts"]})]}),r.jsxs("button",{className:"add-user-btn",onClick:()=>i(!s),children:[r.jsx(Rg,{size:16}),s?"Cancel":"Add New User"]})]}),s&&r.jsx("div",{className:"add-user-form-container",children:r.jsxs("form",{onSubmit:xe,className:"add-user-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(rl,{size:14,className:"input-icon"}),r.jsx("input",{type:"text",placeholder:"johndoe",value:d.username,onChange:H=>u({...d,username:H.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Email Address"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Tp,{size:14,className:"input-icon"}),r.jsx("input",{type:"email",placeholder:"john@example.com",value:d.email,onChange:H=>u({...d,email:H.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(nn,{size:14,className:"input-icon"}),r.jsx("input",{type:_?"text":"password",placeholder:"••••••••",value:d.password,onChange:H=>u({...d,password:H.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>S(!_),"aria-label":_?"Hide password":"Show password",children:_?r.jsx($n,{size:14}):r.jsx(Un,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Confirm Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(nn,{size:14,className:"input-icon"}),r.jsx("input",{type:z?"text":"password",placeholder:"••••••••",value:d.confirmPassword,onChange:H=>u({...d,confirmPassword:H.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>x(!z),"aria-label":z?"Hide password":"Show password",children:z?r.jsx($n,{size:14}):r.jsx(Un,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Assign Role"}),r.jsx("select",{className:"auth-select",value:d.role,onChange:H=>u({...d,role:H.target.value}),children:Z.map(H=>r.jsx("option",{value:H,children:H},H))})]})]}),y&&r.jsx("div",{className:"form-error",children:y}),r.jsx("button",{type:"submit",className:"submit-user-btn",disabled:h,children:h?r.jsx(Fn,{size:16,className:"animate-spin"}):"Create User Account"})]})}),r.jsx("div",{className:"user-table-container",children:r.jsxs("table",{className:"user-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Username"}),r.jsx("th",{children:"Email"}),r.jsx("th",{children:"Current Role"}),r.jsx("th",{children:"Actions"})]})}),r.jsx("tbody",{children:e.map(H=>r.jsxs("tr",{children:[r.jsx("td",{className:"u-name",children:H.username}),r.jsx("td",{className:"u-email",children:H.email}),r.jsx("td",{children:r.jsx("span",{className:`role-badge role-${H.role.toLowerCase()}`,children:H.role})}),r.jsx("td",{children:r.jsxs("div",{className:"action-buttons-cell",style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsxs("button",{className:"vbtn",onClick:()=>oe(H),style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(Lg,{size:14}),"Edit"]}),r.jsxs("button",{className:"vbtn",onClick:()=>{E(""),U(H)},style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px",borderColor:"rgba(239,68,68,0.3)",color:"var(--red)"},children:[r.jsx(Lp,{size:14}),"Delete"]})]})})]},H.id))})]})}),k&&f&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",children:"Edit User Details"}),r.jsxs("p",{className:"modal-sub",children:["Modify details for account: ",f.username]})]}),r.jsx("button",{className:"modal-close",onClick:ve,children:r.jsx(vn,{size:18})})]}),r.jsxs("form",{onSubmit:B,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Username"}),r.jsx("input",{type:"text",className:"form-input",value:D.username,onChange:H=>C({...D,username:H.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Email Address"}),r.jsx("input",{type:"email",className:"form-input",value:D.email,onChange:H=>C({...D,email:H.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Role"}),r.jsx("select",{className:"form-select",value:D.role,onChange:H=>C({...D,role:H.target.value}),children:Z.map(H=>r.jsx("option",{value:H,children:H},H))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"New Password (leave blank to keep current)"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(nn,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:L?"text":"password",className:"form-input",placeholder:"••••••••",value:D.password,onChange:H=>C({...D,password:H.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>P(!L),style:{right:"12px"},"aria-label":L?"Hide password":"Show password",children:L?r.jsx($n,{size:14}):r.jsx(Un,{size:14})})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirm New Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(nn,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:g?"text":"password",className:"form-input",placeholder:"••••••••",value:D.confirmPassword||"",onChange:H=>C({...D,confirmPassword:H.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>T(!g),style:{right:"12px"},"aria-label":g?"Hide password":"Show password",children:g?r.jsx($n,{size:14}):r.jsx(Un,{size:14})})]})]}),j&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:j}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:ve,disabled:M,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:M,children:M?r.jsx(Fn,{size:16,className:"animate-spin"}):"Save Changes"})]})]})]})}),V&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",style:{color:"var(--red)"},children:"Delete User Account"}),r.jsx("p",{className:"modal-sub",children:"Are you sure you want to permanently delete this user?"})]}),r.jsx("button",{className:"modal-close",onClick:()=>U(null),children:r.jsx(vn,{size:18})})]}),r.jsxs("div",{className:"modal-body",children:[r.jsxs("p",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:"1.5"},children:["Deleting ",r.jsx("strong",{children:V.username})," (",V.email,") will remove their account immediately. Any documents uploaded, orders created, or panels assigned to this user will have their references cleared safely."]}),Y&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:Y}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>U(null),disabled:O,children:"Cancel"}),r.jsx("button",{type:"button",className:"btn-save",style:{background:"var(--red)",color:"#fff"},onClick:te,disabled:O,children:O?r.jsx(Fn,{size:16,className:"animate-spin"}):"Delete Account"})]})]})]})})]})}function eh({onOrderCreated:e}){const[t,n]=p.useState({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard",lineItems:[{material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),[a,o]=p.useState([]),[l,s]=p.useState({po:null,quotation:null,approved_docs:[]}),[i,d]=p.useState(!1),[u,h]=p.useState(!1),[m,y]=p.useState(!1),[w,_]=p.useState(!1),S=localStorage.getItem("token");p.useEffect(()=>{fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${S}`}}).then(j=>j.json()).then(j=>o(j)).catch(j=>console.error(j))},[S]),p.useEffect(()=>{if(t.order_date){const j=new Date(t.order_date);j.setDate(j.getDate()+28);const N=j.toISOString().split("T")[0];t.delivery_date!==N&&n(M=>({...M,delivery_date:N,lineItems:M.lineItems.map(A=>({...A,delivery_date:N}))}))}else t.delivery_date!==""&&n(j=>({...j,delivery_date:"",lineItems:j.lineItems.map(N=>({...N,delivery_date:""}))}))},[t.order_date]);const z=j=>{const{name:N,value:M}=j.target;n(A=>({...A,[N]:M}))},x=(j,N,M)=>{n(A=>{const V=[...A.lineItems];if(V[j][N]=M,N==="quantity"||N==="unit_price"){const U=parseFloat(V[j].quantity)||0,O=parseFloat(V[j].unit_price)||0;V[j].total_price=(U*O).toFixed(2)}return{...A,lineItems:V}})},f=()=>{n(j=>({...j,lineItems:[...j.lineItems,{material_description:"",part_number:"",panel_type_size:"",delivery_date:j.delivery_date||"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}))},c=j=>{n(N=>({...N,lineItems:N.lineItems.filter((M,A)=>A!==j)}))},k=(j,N)=>{s(N==="approved_docs"?M=>{const V=[...M.approved_docs||[],...j];return V.length>20?(alert("Maximum 20 files allowed"),M):{...M,[N]:V}}:M=>({...M,[N]:j[0]}))},I=(j,N)=>{const M=Array.from(j.target.files);M.length!==0&&(k(M,N),j.target.value="")},D=(j,N)=>{j.preventDefault(),N(!0)},C=j=>{j(!1)},L=(j,N,M)=>{j.preventDefault(),M(!1);const A=Array.from(j.dataTransfer.files);A.length!==0&&k(A,N)},P=j=>{s(N=>({...N,approved_docs:N.approved_docs.filter((M,A)=>A!==j)}))},g=j=>{s(M=>({...M,[j]:null}));const N=document.getElementById(`file-input-${j}`);N&&(N.value="")},T=async j=>{if(j.preventDefault(),!t.company_location_id||t.lineItems.length===0){alert("Please select a company and add at least one line item.");return}d(!0);const N=new FormData;N.append("company_location_id",t.company_location_id),N.append("order_date",t.order_date),N.append("delivery_date",t.delivery_date),N.append("notes",t.notes),N.append("priority",t.priority),N.append("po_number",t.po_number),N.append("end_client_name",t.end_client_name||""),N.append("gst_number",t.gst_number||""),N.append("reference_number",t.reference_number||""),N.append("classification",t.classification||"Standard"),N.append("lineItems",JSON.stringify(t.lineItems)),l.po&&N.append("po",l.po),l.quotation&&N.append("quotation",l.quotation),l.approved_docs&&l.approved_docs.length>0&&l.approved_docs.forEach(M=>N.append("approved",M));try{const M=await fetch(window.API_BASE+"/api/orders",{method:"POST",headers:{Authorization:`Bearer ${S}`},body:N});if(M.ok){const A=await M.json();alert(A.message),e&&e(A.order),n({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard",lineItems:[{material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),s({po:null,quotation:null,approved_docs:[]})}else{const A=await M.json();alert(A.error||"Failed to create order")}}catch(M){console.error("Submit error:",M),alert("Network error during order creation")}finally{d(!1)}};return r.jsxs("div",{className:"order-creation-container",children:[r.jsxs("div",{className:"form-card",children:[r.jsx("h2",{className:"form-title",children:"Create New Order"}),r.jsx("p",{className:"form-subtitle",children:"Fill in the details to generate an Internal Order Number and Unit IDs."}),r.jsxs("form",{onSubmit:T,className:"order-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Select Company & Location"}),r.jsxs("select",{name:"company_location_id",value:t.company_location_id,onChange:z,className:"form-select",children:[r.jsx("option",{value:"",children:"-- None --"}),a.map(j=>{var N;return r.jsx("optgroup",{label:j.name,children:(N=j.locations)==null?void 0:N.map(M=>r.jsxs("option",{value:M.id,children:[j.name," - ",M.city]},M.id))},j.id)})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Order Date"}),r.jsx("input",{type:"date",name:"order_date",value:t.order_date,onChange:z})]}),r.jsxs("div",{className:"form-group",children:[r.jsxs("label",{children:["Overall Delivery Date ",r.jsx("span",{style:{fontSize:"11px",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",name:"delivery_date",value:t.delivery_date,disabled:!0,style:{opacity:.7,cursor:"not-allowed"}})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{name:"priority",value:t.priority,onChange:z,className:"form-input",children:[r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Customer PO Number"}),r.jsx("input",{type:"text",name:"po_number",value:t.po_number,onChange:z})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Dispatch / Packaging"}),r.jsxs("select",{name:"packaging_type",value:t.packaging_type,onChange:z,className:"form-input",children:[r.jsx("option",{value:"",children:"-- Select Packaging Type --"}),r.jsx("option",{value:"Wooden Packaging",children:"Wooden Packaging"}),r.jsx("option",{value:"Foam Packaging",children:"Foam Packaging"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"End Client Name (Optional)"}),r.jsx("input",{type:"text",name:"end_client_name",value:t.end_client_name,onChange:z})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"GST Number (Optional)"}),r.jsx("input",{type:"text",name:"gst_number",value:t.gst_number,onChange:z,placeholder:"e.g. 27AAAAA1111A1Z1"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Customer Reference Number (Optional)"}),r.jsx("input",{type:"text",name:"reference_number",value:t.reference_number,onChange:z,placeholder:"e.g. REF-2026-99"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Classification"}),r.jsxs("select",{name:"classification",value:t.classification||"Standard",onChange:z,style:{width:"100%",padding:"8px 12px",background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text2)",fontSize:"13px"},children:[r.jsx("option",{value:"Standard",children:"Standard"}),r.jsx("option",{value:"Non-Standard",children:"Non-Standard"})]})]}),r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Overall Order Notes"}),r.jsx("textarea",{name:"notes",value:t.notes,onChange:z})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"32px",marginBottom:"32px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[r.jsx("h3",{className:"section-title",style:{margin:0},children:"Line Items"}),r.jsx("button",{type:"button",className:"vbtn",style:{background:"#3b82f6",fontSize:"12px",padding:"6px 12px"},onClick:f,children:"+ Add Line Item"})]}),t.lineItems.map((j,N)=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"20px",borderRadius:"12px",border:"1px solid var(--border)",marginBottom:"16px",position:"relative"},children:[t.lineItems.length>1&&r.jsx("button",{type:"button",onClick:()=>c(N),style:{position:"absolute",top:"16px",right:"16px",background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:"16px"},children:"✕"}),r.jsxs("div",{className:"line-item-grid-1",children:[r.jsxs("div",{children:[r.jsxs("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:["Line Item # ",r.jsx("span",{style:{color:"#888",fontStyle:"italic"},children:"(auto-assigned)"})]}),r.jsx("input",{type:"text",className:"form-input",value:`Item ${N+1}`,readOnly:!0,style:{background:"var(--bg4)",opacity:.6,cursor:"not-allowed"}})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Material Description"}),r.jsx("input",{type:"text",className:"form-input",value:j.material_description,onChange:M=>x(N,"material_description",M.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Part Number *"}),r.jsx("input",{type:"text",className:"form-input",value:j.part_number,onChange:M=>x(N,"part_number",M.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Panel Type / Size"}),r.jsx("input",{type:"text",className:"form-input",value:j.panel_type_size,onChange:M=>x(N,"panel_type_size",M.target.value)})]})]}),r.jsxs("div",{className:"line-item-grid-2",children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Quantity *"}),r.jsx("input",{type:"number",className:"form-input",min:"1",value:j.quantity,onChange:M=>x(N,"quantity",M.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Unit"}),r.jsx("input",{type:"text",className:"form-input",value:j.unit,onChange:M=>x(N,"unit",M.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Unit Price *"}),r.jsx("input",{type:"number",step:"0.01",min:"0",max:"9999999999999.99",className:"form-input",value:j.unit_price,onChange:M=>x(N,"unit_price",M.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Total Price"}),r.jsx("input",{type:"number",step:"0.01",className:"form-input",value:j.total_price,onChange:M=>x(N,"total_price",M.target.value),readOnly:!0,style:{background:"var(--bg4)",opacity:.7}})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Delivery Date"}),r.jsx("input",{type:"date",className:"form-input",value:j.delivery_date,disabled:!0,style:{opacity:.7,cursor:"not-allowed"}})]})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Item Notes"}),r.jsx("input",{type:"text",className:"form-input",value:j.notes,onChange:M=>x(N,"notes",M.target.value)})]})]},N))]}),r.jsxs("div",{className:"file-upload-section",children:[r.jsx("h3",{className:"section-title",children:"Required Documents"}),r.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"16px"},children:["Only ",r.jsx("strong",{style:{color:"var(--text2)"},children:"one"})," PO copy and one Quotation allowed. To replace after submission, delete the existing file first."]}),r.jsxs("div",{className:"file-grid",children:[r.jsxs("div",{className:`file-input-wrapper${u?" dragging":""}`,onDragOver:j=>D(j,h),onDragLeave:()=>C(h),onDrop:j=>L(j,"po",h),children:[r.jsx("label",{children:"Customer PO Copy"}),l.po?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"8px 10px",width:"100%",justifyContent:"center"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981",fontWeight:"bold"},children:"Done"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:l.po.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:j=>I(j,"po")})]}),r.jsx("button",{type:"button",onClick:()=>g("po"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"Drag file here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:j=>I(j,"po")})]})]}),r.jsxs("div",{className:`file-input-wrapper${m?" dragging":""}`,onDragOver:j=>D(j,y),onDragLeave:()=>C(y),onDrop:j=>L(j,"quotation",y),children:[r.jsx("label",{children:"Quotation"}),l.quotation?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"8px 10px",width:"100%",justifyContent:"center"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981",fontWeight:"bold"},children:"Done"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:l.quotation.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:j=>I(j,"quotation")})]}),r.jsx("button",{type:"button",onClick:()=>g("quotation"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"Drag file here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:j=>I(j,"quotation")})]})]}),r.jsxs("div",{className:`file-input-wrapper${w?" dragging":""}`,onDragOver:j=>D(j,_),onDragLeave:()=>C(_),onDrop:j=>L(j,"approved_docs",_),style:{alignItems:"center"},children:[r.jsx("label",{children:"Approved Documents (Up to 20)"}),r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"Drag files here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{type:"file",multiple:!0,hidden:!0,onChange:j=>I(j,"approved_docs")})]}),l.approved_docs&&l.approved_docs.length>0&&r.jsx("div",{className:"selected-files-list",children:l.approved_docs.map((j,N)=>r.jsxs("div",{className:"selected-file-item",children:[r.jsx("span",{className:"file-name-hint",children:j.name}),r.jsx("button",{type:"button",onClick:()=>P(N),className:"remove-file-btn",children:"✕"})]},N))})]})]})]}),r.jsx("div",{className:"form-actions",children:r.jsx("button",{type:"submit",className:"submit-btn",disabled:i,children:i?"Creating Order...":"Initialize Order"})})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Ap({onImportComplete:e}){var f,c,k,I;const[t,n]=p.useState(null),[a,o]=p.useState(!1),[l,s]=p.useState(!1),[i,d]=p.useState(null),u=p.useRef(null),h=localStorage.getItem("token"),m=D=>{D.preventDefault(),o(!0)},y=()=>o(!1),w=D=>{D.preventDefault(),o(!1);const C=D.dataTransfer.files[0];C&&_(C)},_=D=>{if(!D.name.match(/\.xlsx$/i)){alert("Only .xlsx files are supported. Please use the sample template.");return}n(D),d(null)},S=async()=>{if(t){s(!0),d(null);try{const D=new FormData;D.append("file",t);const L=await(await fetch(window.API_BASE+"/api/orders/import",{method:"POST",headers:{Authorization:`Bearer ${h}`},body:D})).json();if(L.error){d({message:L.error,created:[],errors:[]});return}d(L),L.created&&L.created.length>0}catch{d({message:"Network error — could not reach the server. Is Docker running?",created:[],errors:[]})}finally{s(!1)}}},z=D=>{D.preventDefault(),window.location.href=window.API_BASE+"/api/template/order_import_template.xlsx"},x=()=>{n(null),d(null),u.current&&(u.current.value="")};return r.jsxs("div",{className:"oi-container",children:[r.jsxs("div",{className:"oi-card",children:[r.jsxs("div",{className:"oi-header",children:[r.jsxs("div",{children:[r.jsx("h2",{className:"oi-title",children:"Bulk Order Import"}),r.jsxs("p",{className:"oi-subtitle",children:["Upload a filled Excel template to create multiple orders automatically. Each unique ",r.jsx("code",{children:"po_number"})," becomes one order."]})]}),r.jsx("a",{href:"#",onClick:z,className:"oi-download-btn",title:"Download the sample template",children:"Download Template"})]}),!i&&r.jsxs("div",{className:`oi-dropzone${a?" oi-dragging":""}${t?" oi-has-file":""}`,onDragOver:m,onDragLeave:y,onDrop:w,onClick:()=>{var D;return!t&&((D=u.current)==null?void 0:D.click())},children:[r.jsx("input",{ref:u,type:"file",accept:".xlsx",hidden:!0,onChange:D=>D.target.files[0]&&_(D.target.files[0])}),t?r.jsxs("div",{className:"oi-file-preview",children:[r.jsx("span",{className:"oi-file-icon"}),r.jsxs("div",{className:"oi-file-info",children:[r.jsx("span",{className:"oi-file-name",children:t.name}),r.jsxs("span",{className:"oi-file-size",children:[(t.size/1024).toFixed(1)," KB"]})]}),r.jsx("button",{className:"oi-clear-btn",onClick:D=>{D.stopPropagation(),x()},title:"Remove",children:"✕"})]}):r.jsxs("div",{className:"oi-drop-prompt",children:[r.jsx("div",{className:"oi-drop-icon"}),r.jsxs("div",{className:"oi-drop-text",children:["Drag & drop your ",r.jsx("strong",{children:".xlsx"})," file here"]}),r.jsx("div",{className:"oi-drop-sub",children:"or click to browse"})]})]}),!i&&r.jsx("div",{className:"oi-actions",children:r.jsx("button",{className:"oi-upload-btn",disabled:!t||l,onClick:S,children:l?r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"oi-spinner"})," Processing..."]}):"Import Orders"})}),!i&&r.jsxs("div",{className:"oi-instructions",children:[r.jsx("h3",{className:"oi-inst-title",children:"How to use"}),r.jsxs("ol",{className:"oi-inst-list",children:[r.jsx("li",{children:"Download the template using the button above."}),r.jsxs("li",{children:["Open the ",r.jsx("strong",{children:'"Import Template"'})," sheet and fill in your data."]}),r.jsxs("li",{children:["Each row = one line item. Rows with the same ",r.jsx("code",{children:"po_number"})," are grouped into one order."]}),r.jsxs("li",{children:["Company name & city must match entries in ",r.jsx("strong",{children:"Masters → Companies"}),"."]}),r.jsxs("li",{children:["Dates must be in ",r.jsx("strong",{children:"YYYY-MM-DD"})," format or a proper Excel date."]}),r.jsxs("li",{children:["Save as ",r.jsx("code",{children:".xlsx"})," and upload here."]})]}),r.jsxs("div",{className:"oi-field-ref",children:[r.jsx("h4",{children:"Required Fields"}),r.jsx("div",{className:"oi-field-grid",children:[{f:"company_name",r:!0,note:"Exact match in Masters"},{f:"company_city",r:!0,note:"Exact match in Masters"},{f:"order_date",r:!0,note:"YYYY-MM-DD"},{f:"delivery_date",r:!0,note:"YYYY-MM-DD"},{f:"po_number",r:!0,note:"Groups rows into one order"},{f:"priority",r:!0,note:"Low / Medium / High / Urgent"},{f:"material_description",r:!0,note:"Per line item"},{f:"quantity",r:!0,note:"Positive integer"},{f:"unit",r:!0,note:"e.g. Nos, Sets"},{f:"unit_price",r:!0,note:"Numeric, no ₹"},{f:"packaging_type",r:!1,note:"Wooden Packaging / Foam Packaging"},{f:"end_client_name",r:!1,note:"Optional end client name / site location"},{f:"order_notes",r:!1,note:"Optional"},{f:"part_number",r:!1,note:"Optional"},{f:"panel_type_size",r:!1,note:"e.g. 800x600"},{f:"line_item_delivery_date",r:!1,note:"Defaults to delivery_date"},{f:"line_item_notes",r:!1,note:"Optional"}].map(({f:D,r:C,note:L})=>r.jsxs("div",{className:"oi-field-row",children:[r.jsx("code",{className:"oi-field-name",children:D}),r.jsx("span",{className:`oi-badge ${C?"req":"opt"}`,children:C?"Required":"Optional"}),r.jsx("span",{className:"oi-field-note",children:L})]},D))})]})]}),i&&r.jsxs("div",{className:"oi-result",children:[r.jsx("p",{className:`oi-result-msg ${((f=i.created)==null?void 0:f.length)>0?"success":"fail"}`,children:i.message}),((c=i.created)==null?void 0:c.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{children:"Created & Merged Orders"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Order Number"}),r.jsx("th",{children:"Units Added"}),r.jsx("th",{children:"Action Taken"})]})}),r.jsx("tbody",{children:i.created.map((D,C)=>r.jsxs("tr",{children:[r.jsx("td",{children:D.po_number}),r.jsx("td",{children:r.jsx("strong",{style:{color:"#60a5fa"},children:D.order_number})}),r.jsx("td",{children:D.units}),r.jsx("td",{children:r.jsx("span",{style:{background:D.is_appended?"#1e3a8a":"#064e3b",color:D.is_appended?"#60a5fa":"#34d399",fontSize:"11px",fontWeight:"bold",padding:"3px 8px",borderRadius:"4px",display:"inline-block"},children:D.is_appended?"Merged (Appended)":"Created (New)"})})]},C))})]})]}),((k=i.errors)==null?void 0:k.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{style:{color:"#f87171"},children:"Errors"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Reason"})]})}),r.jsx("tbody",{children:i.errors.map((D,C)=>r.jsxs("tr",{children:[r.jsx("td",{children:D.po_number}),r.jsx("td",{style:{color:"#f87171"},children:D.error})]},C))})]})]}),r.jsxs("div",{style:{display:"flex",gap:12,marginTop:20},children:[r.jsx("button",{className:"oi-upload-btn",onClick:x,children:"Import Another File"}),((I=i.created)==null?void 0:I.length)>0&&r.jsx("button",{className:"oi-upload-btn",style:{background:"#10b981"},onClick:()=>e==null?void 0:e(),children:"View Orders →"})]})]})]}),r.jsx("style",{children:`
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
      `})]})}function th({isOpen:e,onClose:t,onImportComplete:n}){return p.useEffect(()=>{if(!e)return;const a=o=>{o.key==="Escape"&&t()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[e,t]),e?r.jsxs("div",{className:"bim-overlay",onClick:a=>{a.target===a.currentTarget&&t()},children:[r.jsxs("div",{className:"bim-modal",children:[r.jsxs("div",{className:"bim-modal-header",children:[r.jsx("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:r.jsx("span",{style:{fontWeight:"700",fontSize:"16px",color:"var(--text)"},children:"Bulk Order Import"})}),r.jsx("button",{className:"bim-close",onClick:t,title:"Close (Esc)",children:"✕"})]}),r.jsx("div",{className:"bim-body",children:r.jsx(Ap,{onImportComplete:()=>{n==null||n(),t()}})})]}),r.jsx("style",{children:`
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
      `})]}):null}function rh({initialSelectedId:e}){var _n,Ca,za,Ea,Da,Sr,It,ht,Zt,Nn;const[t,n]=p.useState([]),[a,o]=p.useState(null),[l,s]=p.useState(null),[i,d]=p.useState("created_at"),[u,h]=p.useState(!0),[m,y]=p.useState("inprogress"),w=localStorage.getItem("token"),[_,S]=p.useState([]),[z,x]=p.useState([]),[f,c]=p.useState(null),k=JSON.parse(localStorage.getItem("user")||"{}"),[I,D]=p.useState(null),[C,L]=p.useState(""),[P,g]=p.useState("done"),[T,j]=p.useState(!1),[N,M]=p.useState(!1),[A,V]=p.useState(null),[U,O]=p.useState({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard"}),[K,Y]=p.useState([]),[E,$]=p.useState(!1),[Z,se]=p.useState(null),[xe,oe]=p.useState({material_description:"",part_number:"",panel_type_size:"",quantity:"",unit:"Nos",unit_price:"",delivery_date:"",notes:""}),[ve,B]=p.useState(!1),te=async()=>{try{const b=await fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${w}`}});b.ok&&Y(await b.json())}catch(b){console.error("Fetch companies error:",b)}},H=b=>{O({company_location_id:b.company_location_id||"",order_date:b.order_date?b.order_date.split("T")[0]:"",delivery_date:b.delivery_date?b.delivery_date.split("T")[0]:"",notes:b.notes||"",priority:b.priority||"Medium",po_number:b.po_number||"",packaging_type:b.packaging_type||"",end_client_name:b.end_client_name||"",gst_number:b.gst_number||"",reference_number:b.reference_number||"",classification:b.classification||"Standard"}),V(b),te()},ge=async b=>{b.preventDefault(),$(!0);try{const X=await fetch(`${window.API_BASE}/api/orders/${A.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify(U)});if(X.ok)alert("Order amended successfully!"),V(null),await rt(a.id),await gt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const ae=await X.json();alert(ae.error||"Failed to amend order.")}}catch(X){console.error(X),alert("Network error, please try again.")}finally{$(!1)}},ie=async b=>{if(window.confirm("Are you sure you want to delete this order? This will permanently delete the order, all its line items, all unit serial numbers, steps, and resequence all remaining orders!"))try{const X=await fetch(`${window.API_BASE}/api/orders/${b}`,{method:"DELETE",headers:{Authorization:`Bearer ${w}`}});if(X.ok)alert("Order deleted and remaining orders resequenced successfully!"),o(null),await gt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:null}}));else{const ae=await X.json();alert(ae.error||"Failed to delete order.")}}catch(X){console.error(X),alert("Network error, please try again.")}},F=b=>{oe({material_description:b.material_description||"",part_number:b.part_number||"",panel_type_size:b.panel_type_size||"",quantity:b.quantity||"",unit:b.unit||"Nos",unit_price:b.unit_price||"",delivery_date:b.delivery_date?b.delivery_date.split("T")[0]:"",notes:b.notes||""}),se(b)},be=async b=>{b.preventDefault(),B(!0);try{const X=await fetch(`${window.API_BASE}/api/orders/${a.id}/line-items/${Z.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify(xe)});if(X.ok)se(null),await rt(a.id);else{const ae=await X.json();alert(ae.error||"Failed to amend line item.")}}catch(X){console.error(X),alert("Network error, please try again.")}finally{B(!1)}},Pe=(b,X)=>{oe(ae=>({...ae,[b]:X}))},me=async b=>{try{const X=await fetch(`${window.API_BASE}/api/orders/${a.id}/hold/${b}`,{method:"POST",headers:{Authorization:`Bearer ${w}`}});if(X.ok)await rt(a.id),await gt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const ae=await X.json();alert(ae.error||"Failed to update hold status")}}catch(X){console.error(X),alert("Network error updating hold status")}},it=["admin","manager","sales"].includes((_n=k.role)==null?void 0:_n.toLowerCase()),q=async b=>{if(b.preventDefault(),!(!C||!P)){j(!0);try{const X=await fetch(`${window.API_BASE}/api/planning/line-items/${I.id}/bulk-units-status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify({dept:C,status:P})});if(X.ok)alert(`Successfully updated all ${C} steps to ${P} for this batch.`),D(null),await rt(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const ae=await X.json();alert(ae.error||"Failed to bulk update units.")}}catch(X){console.error(X),alert("Network error, please try again.")}finally{j(!1)}}};p.useEffect(()=>{gt(),G();const b=X=>{gt(),X.detail&&X.detail.orderId&&o(ae=>(ae&&ae.id===X.detail.orderId&&rt(X.detail.orderId),ae))};return window.addEventListener("orderUpdated",b),()=>window.removeEventListener("orderUpdated",b)},[]),p.useEffect(()=>{l?Te(l.id):(S([]),c(null))},[l]);const G=async()=>{try{const b=await fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${w}`}});b.ok&&x(await b.json())}catch(b){console.error("Fetch users error:",b)}},Te=async b=>{try{const X=await fetch(`${window.API_BASE}/api/units/${b}/steps`,{headers:{Authorization:`Bearer ${w}`}});X.ok&&S(await X.json())}catch(X){console.error("Fetch unit steps error:",X)}},$t=async(b,X)=>{try{(await fetch(`${window.API_BASE}/api/units/${l.id}/steps/${b}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify(X)})).ok&&(await Te(l.id),await rt(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}})))}catch(ae){console.error("Update unit step error:",ae)}};p.useEffect(()=>{e&&t.length>0&&rt(e)},[e,t]);const gt=async()=>{try{const b=await fetch(window.API_BASE+"/api/orders",{headers:{Authorization:`Bearer ${w}`}});if(b.ok){const X=await b.json();n(X)}}catch(b){console.error("Fetch error:",b)}finally{h(!1)}},rt=async b=>{var X;try{const ae=await fetch(`${window.API_BASE}/api/orders/${b}`,{headers:{Authorization:`Bearer ${w}`}});if(ae.ok){const Ee=await ae.json();if(o(Ee),l){const Ve=(X=Ee.units)==null?void 0:X.find(He=>He.id===l.id);Ve&&s(Ve)}}}catch(ae){console.error("Fetch details error:",ae)}},Na=b=>{if(!b||b.length===0)return 0;const X={Pending:0,Design:15,"Material Waiting":30,Production:55,"QC Testing":75,"QC Passed":90,"Ready for Dispatch":95,Dispatched:100,Delivered:100,Rework:40,"QC Failed":60};let ae=0;return b.forEach(Ee=>{ae+=X[Ee.status]||0}),Math.round(ae/b.length)};if(u)return r.jsx("div",{className:"loading",children:"Loading orders..."});const St=b=>parseInt(b.unit_count)>0&&parseInt(b.dispatched_unit_count)>=parseInt(b.unit_count),kn=t.filter(b=>!St(b)),Oe=t.filter(b=>St(b)),Sn=m==="completed"?Oe:kn;return kn.reduce((b,X)=>b+parseInt(X.line_item_count||0),0),Oe.reduce((b,X)=>b+parseInt(X.line_item_count||0),0),r.jsxs("div",{className:"order-list-container",children:[r.jsxs("div",{className:"orders-sidebar",children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("h3",{className:"sidebar-title",style:{margin:0},children:"Orders"}),r.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"center"},children:[it&&r.jsx("button",{onClick:()=>M(!0),title:"Bulk Import Orders from Excel",style:{background:"var(--blue-dim)",border:"1px solid var(--blue)",color:"var(--blue)",borderRadius:"6px",padding:"3px 9px",fontSize:"11px",fontWeight:"600",cursor:"pointer",display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap",transition:"opacity 0.15s"},onMouseOver:b=>b.currentTarget.style.opacity="0.8",onMouseOut:b=>b.currentTarget.style.opacity="1",children:"Import"}),r.jsxs("select",{value:i,onChange:b=>d(b.target.value),className:"form-select",style:{padding:"2px 8px",fontSize:"11px",width:"auto"},children:[r.jsx("option",{value:"created_at",children:"Created Date"}),r.jsx("option",{value:"order_date",children:"Order Date"}),r.jsx("option",{value:"delivery_date",children:"Delivery Date"}),r.jsx("option",{value:"po_number",children:"PO Number"})]})]})]}),r.jsxs("div",{style:{display:"flex",gap:"4px",marginBottom:"12px",background:"var(--bg4)",borderRadius:"8px",padding:"4px",border:"1px solid var(--border)"},children:[r.jsxs("button",{onClick:()=>y("inprogress"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:m==="inprogress"?"var(--blue)":"transparent",color:m==="inprogress"?"#fff":"var(--text3)"},children:["In Progress ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",kn.length,")"]})]}),r.jsxs("button",{onClick:()=>y("completed"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:m==="completed"?"var(--green)":"transparent",color:m==="completed"?"#fff":"var(--text3)"},children:["Completed ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",Oe.length,")"]})]})]}),r.jsxs("div",{className:"order-items",children:[Sn.length===0&&r.jsx("div",{style:{color:"var(--text3)",fontSize:"13px",textAlign:"center",padding:"32px 16px",fontStyle:"italic"},children:m==="completed"?"No completed orders yet.":"No in-progress orders."}),Sn.map(b=>r.jsxs("div",{className:`order-card ${(a==null?void 0:a.id)===b.id?"active":""}`,onClick:()=>rt(b.id),children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"},children:[r.jsx("div",{className:"order-num",style:{margin:0},children:b.order_number}),m==="completed"?r.jsx("span",{style:{background:"rgba(16,185,129,0.15)",color:"#34d399",border:"1px solid rgba(16,185,129,0.3)",borderRadius:"20px",padding:"2px 8px",fontSize:"10px",fontWeight:"700"},children:"✓ DONE"}):b.priority&&r.jsx("span",{className:`priority-badge ${b.priority.toLowerCase()}`,children:b.priority})]}),r.jsxs("div",{className:"order-meta",children:[r.jsxs("span",{children:[b.unit_count," Units"]})," •",r.jsx("span",{children:i==="created_at"?new Date(b.created_at).toLocaleDateString():i==="order_date"?b.order_date?new Date(b.order_date).toLocaleDateString():"No Order Date":i==="delivery_date"?b.delivery_date?new Date(b.delivery_date).toLocaleDateString():"No Delivery Date":i==="po_number"?b.po_number||"No PO Number":""})]}),b.company_name&&r.jsxs("div",{className:"order-company",children:[b.company_name," - ",b.company_city]})]},b.id))]})]}),r.jsx("div",{className:"order-details-pane",children:a?r.jsxs("div",{className:"details-content",children:[r.jsxs("div",{className:"details-header",children:[r.jsxs("div",{children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"},children:[r.jsx("h2",{style:{margin:0},children:a.order_number}),["admin","manager","sales"].includes((Ca=k.role)==null?void 0:Ca.toLowerCase())&&r.jsx("button",{className:"vbtn",style:{padding:"4px 12px",fontSize:"12px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>H(a),children:"Amend Order"}),((za=k.role)==null?void 0:za.toLowerCase())==="admin"&&r.jsx("button",{className:"vbtn",style:{padding:"4px 12px",fontSize:"12px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>ie(a.id),children:"Delete Order"}),a.hold_status==="Requested"&&r.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsx("span",{style:{fontSize:"11px",background:"rgba(245, 158, 11, 0.15)",color:"#f59e0b",padding:"4px 8px",borderRadius:"4px",fontWeight:"600"},children:"Hold Requested"}),["admin","manager"].includes((Ea=k.role)==null?void 0:Ea.toLowerCase())&&r.jsxs(r.Fragment,{children:[r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#10b981",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>me("approve"),children:"Approve Hold"}),r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>me("reject"),children:"Reject"})]})]}),a.hold_status==="Approved"&&r.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsx("span",{style:{fontSize:"11px",background:"rgba(239, 68, 68, 0.15)",color:"#ef4444",padding:"4px 8px",borderRadius:"4px",fontWeight:"700",textTransform:"uppercase"},children:"ON HOLD"}),["admin","manager","sales"].includes((Da=k.role)==null?void 0:Da.toLowerCase())&&r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>me("resume"),children:"Resume Order"})]}),(a.hold_status==="None"||!a.hold_status)&&["admin","manager","sales"].includes((Sr=k.role)==null?void 0:Sr.toLowerCase())&&r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#f59e0b",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>me("request"),children:"Request Hold"})]}),a.company_name&&r.jsxs("div",{className:"order-company-lg",style:{marginTop:"4px"},children:[a.company_name," (",a.company_city,")"]})]}),r.jsxs("div",{className:"creator-info",children:["Created by: ",a.creator_name||"System"]})]}),a.hold_status==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.25)",borderRadius:"8px",padding:"12px 16px",marginBottom:"20px",color:"#ef4444",fontWeight:"500",fontSize:"13px"},children:[r.jsx("strong",{children:"ORDER IS CURRENTLY ON HOLD"})," — All production updates, step changes, and document uploads for this order and its units are currently locked."]}),r.jsxs("div",{className:"order-progress-container",children:[r.jsxs("div",{className:"progress-labels",children:[r.jsx("span",{children:"Order Progress"}),r.jsxs("span",{children:[Na(a.units),"%"]})]}),r.jsx("div",{className:"progress-bar-bg",children:r.jsx("div",{className:"progress-bar-fill",style:{width:`${Na(a.units)}%`}})})]}),r.jsxs("div",{className:"details-grid",style:{gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:"20px"},children:[r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Priority"}),r.jsx("div",{className:"val",children:r.jsx("span",{className:`priority-badge ${((It=a.priority)==null?void 0:It.toLowerCase())||"medium"}`,children:a.priority||"Medium"})})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Order Date"}),r.jsx("div",{className:"val",children:a.order_date?new Date(a.order_date).toLocaleDateString("en-IN"):"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Delivery Date"}),r.jsx("div",{className:"val",children:a.delivery_date?new Date(a.delivery_date).toLocaleDateString("en-IN"):"TBD"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"PO Number"}),r.jsx("div",{className:"val",children:a.po_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Cust. Ref #"}),r.jsx("div",{className:"val",children:a.reference_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Classification"}),r.jsx("div",{className:"val",style:{fontWeight:"600",color:a.classification==="Non-Standard"?"var(--blue)":"var(--text2)"},children:a.classification||"Standard"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"End Client"}),r.jsx("div",{className:"val",children:a.end_client_name||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"GST Number"}),r.jsx("div",{className:"val",children:a.gst_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Packaging"}),r.jsx("div",{className:"val",children:a.packaging_type||"N/A"})]}),r.jsxs("div",{className:"detail-box",style:{gridColumn:"1 / -1"},children:[r.jsx("label",{children:"Notes"}),r.jsx("div",{className:"val",style:{whiteSpace:"pre-wrap"},children:a.notes||"No notes"})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"24px"},children:[r.jsx("h3",{children:"Line Items & Units"}),(ht=a.line_items)==null?void 0:ht.map(b=>{var ae,Ee,Ve;const X=((ae=a.units)==null?void 0:ae.filter(He=>He.line_item_id===b.id))||[];return r.jsxs("div",{style:{background:"var(--bg3)",borderRadius:"8px",padding:"16px",marginBottom:"16px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",borderBottom:"1px solid var(--border2)",paddingBottom:"8px"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[r.jsx("strong",{children:b.line_item_number}),": ",b.material_description," ",b.part_number?`(${b.part_number})`:"",["admin","manager","production","sales","design","purchase","stores","qc","dispatch","accounts","planning"].includes((Ee=k.role)==null?void 0:Ee.toLowerCase())&&r.jsx("button",{className:"vbtn",style:{padding:"2px 8px",fontSize:"10px",background:"#2563eb",border:"none",borderRadius:"4px",cursor:"pointer",display:"inline-flex",alignItems:"center",height:"22px"},onClick:()=>{if(a.hold_status==="Approved"){alert("Order is currently on hold. Updates are disabled.");return}L(""),g("done"),D(b)},children:"Bulk Update Batch"}),["admin","manager","sales"].includes((Ve=k.role)==null?void 0:Ve.toLowerCase())&&r.jsx("button",{className:"vbtn",title:"Amend Line Item",style:{padding:"2px 8px",fontSize:"10px",background:"#7c3aed",border:"none",borderRadius:"4px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px",height:"22px"},onClick:()=>{if(a.hold_status==="Approved"){alert("Order is currently on hold. Amendments are disabled.");return}F(b)},children:"Amend"})]}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:"13px"},children:[b.quantity," ",b.unit||"Nos"," @ ₹",b.unit_price]})]}),r.jsx("div",{className:"units-grid",children:X.map(He=>r.jsxs("div",{className:"unit-badge interactive",onClick:()=>s(He),children:[r.jsx("span",{className:"u-id",children:He.short_serial}),r.jsx("span",{className:`u-status ${He.status.toLowerCase().replace(/\s+/g,"-")}`,children:He.status})]},He.id))})]},b.id)})]}),r.jsx(Oo,{entityType:"Order",entityId:a.id,initialDocs:((Zt=a.documents)==null?void 0:Zt.filter(b=>b.entity_type==="Order"))||[],userRole:k.role,readOnly:a.hold_status==="Approved"})]}):r.jsx("div",{className:"select-prompt",children:"Select an order from the list to view details and documents."})}),l&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&s(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Unit Tracking"}),r.jsxs("div",{className:"modal-sub",children:[l.unit_id," (",l.status,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>s(null),children:"✕"})]}),r.jsxs("div",{className:"modal-body",children:[(a==null?void 0:a.hold_status)==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.08)",border:"1px solid rgba(239, 68, 68, 0.15)",borderRadius:"6px",padding:"8px 12px",marginBottom:"12px",color:"#ef4444",fontSize:"11px",fontWeight:"500"},children:[r.jsx("strong",{children:"Order is on hold."})," Production flow step updates are locked until the hold is released."]}),r.jsxs("div",{style:{marginBottom:20},children:[r.jsx("h4",{style:{margin:"0 0 12px 0",color:"var(--text)",fontSize:"14px",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Production Steps"}),_.length===0?r.jsx("div",{style:{color:"var(--text3)",fontSize:"13px",fontStyle:"italic"},children:"Loading steps..."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[..._].sort((b,X)=>{var ae,Ee,Ve,He,_r,er,tr,pe,_t;return["admin","manager"].includes((ae=k.role)==null?void 0:ae.toLowerCase())?0:((Ee=b.dept)==null?void 0:Ee.toLowerCase())===((Ve=k.role)==null?void 0:Ve.toLowerCase())&&((He=X.dept)==null?void 0:He.toLowerCase())!==((_r=k.role)==null?void 0:_r.toLowerCase())?-1:((er=X.dept)==null?void 0:er.toLowerCase())===((tr=k.role)==null?void 0:tr.toLowerCase())&&((pe=b.dept)==null?void 0:pe.toLowerCase())!==((_t=k.role)==null?void 0:_t.toLowerCase())?1:0}).map(b=>{var _r,er,tr;const X=f===b.id,ae=(["admin","manager"].includes((_r=k.role)==null?void 0:_r.toLowerCase())||((er=b.dept)==null?void 0:er.toLowerCase())===((tr=k.role)==null?void 0:tr.toLowerCase())||b.assigned_user_id===k.id)&&(a==null?void 0:a.hold_status)!=="Approved",Ee=z.find(pe=>pe.id===b.assigned_user_id);let Ve=[];try{Ve=Array.isArray(b.custom_fields)?b.custom_fields:JSON.parse(b.custom_fields||"[]")}catch{Ve=[]}const He=z.filter(pe=>{var _t,Ut;return((_t=pe.role)==null?void 0:_t.toLowerCase())===((Ut=b.dept)==null?void 0:Ut.toLowerCase())});return r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"},onClick:()=>c(X?null:b.id),children:[r.jsxs("div",{children:[r.jsxs("div",{style:{fontWeight:"600",color:"var(--text)",fontSize:"13px"},children:[!ae&&r.jsx("span",{style:{color:"#60a5fa",marginRight:"6px",fontSize:"9px",textTransform:"uppercase",background:"rgba(59, 130, 246, 0.1)",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(59, 130, 246, 0.2)"},children:"View Only"}),b.name]}),r.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)",marginTop:"2px"},children:["Dept: ",r.jsx("span",{style:{color:"#60a5fa"},children:b.dept})," | Assigned: ",r.jsx("span",{style:{color:"#34d399"},children:Ee?Ee.username:"Unassigned"})]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[r.jsx("span",{className:`step-status-badge badge-${b.status}`,style:{fontSize:"9px",fontWeight:"bold"},children:b.status}),r.jsx("span",{style:{fontSize:"10px",color:"var(--text3)"},children:X?"▲":"▼"})]})]}),X&&r.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px dashed var(--border2)"},children:[!ae&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.08)",border:"1px solid rgba(59, 130, 246, 0.15)",borderRadius:"6px",padding:"8px 12px",marginBottom:"12px",color:"#60a5fa",fontSize:"11px"},children:[r.jsx("strong",{children:"View-Only Mode"})," — managed by the ",r.jsx("strong",{children:b.dept})," department."]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Step Status"}),ae?r.jsxs("select",{className:"form-select",value:b.status,onChange:pe=>$t(b.id,{status:pe.target.value}),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"2px"},children:r.jsx("span",{className:`step-status-badge ${(Je[b.status]||Je.pending).cls}`,style:{fontSize:"11px",padding:"3px 8px",fontWeight:"bold"},children:(Je[b.status]||Je.pending).label})})]}),r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Assign Worker"}),ae?r.jsxs("select",{className:"form-select",value:b.assigned_user_id||"",onChange:pe=>$t(b.id,{assigned_user_id:pe.target.value?parseInt(pe.target.value):null}),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),He.map(pe=>r.jsx("option",{value:pe.id,children:pe.username},pe.id))]}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text)",background:"var(--bg3)",padding:"6px 10px",borderRadius:"6px"},children:Ee?Ee.username:"Unassigned"})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Notes"}),ae?r.jsx("textarea",{className:"form-input",defaultValue:b.notes||"",onBlur:pe=>$t(b.id,{notes:pe.target.value}),placeholder:"Add step notes...",style:{fontSize:"12px",height:"50px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px",whiteSpace:"pre-wrap"},children:b.notes||"No notes added."})]}),Ve.length>0&&r.jsxs("div",{style:{marginBottom:"12px",padding:"10px",background:"var(--bg3)",borderRadius:"6px",border:"1px solid var(--border)"},children:[r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",fontWeight:"bold",marginBottom:"8px",textTransform:"uppercase"},children:"Custom Fields"}),Ve.map((pe,_t)=>{var v;const Ut=R=>{const Q=[...Ve];Q[_t].value=R,$t(b.id,{custom_fields:Q})};return r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text2)",display:"block",marginBottom:"2px"},children:pe.label}),ae?pe.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!pe.value,onChange:R=>Ut(R.target.checked)}):pe.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:pe.value||"",onChange:R=>Ut(R.target.value),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(v=pe.options)==null?void 0:v.map(R=>r.jsx("option",{value:R,children:R},R))]}):r.jsx("input",{type:pe.type==="Number"?"number":"text",className:"form-input",defaultValue:pe.value||"",onBlur:R=>Ut(R.target.value),style:{fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text)",fontWeight:"500",marginTop:"2px"},children:pe.type==="Yes/No"?pe.value==="Yes"||pe.value===!0?"Yes":"No":pe.value||"—"})]},pe.id)})]})]})]},b.id)})})]}),r.jsx("div",{style:{marginTop:24,borderTop:"1px solid var(--border)",paddingTop:"16px"},children:r.jsx(Oo,{entityType:"Unit",entityId:l.id,initialDocs:((Nn=a.documents)==null?void 0:Nn.filter(b=>b.entity_type==="Unit"&&b.entity_id===l.id))||[],onUploadSuccess:()=>rt(a.id),userRole:k.role,readOnly:a.hold_status==="Approved"})})]})]})}),I&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&D(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"400px",width:"90%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Update Batch Units"}),r.jsxs("div",{className:"modal-sub",children:["Line Item: ",I.line_item_number," (",I.quantity," units)"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>D(null),children:"✕"})]}),r.jsxs("form",{onSubmit:q,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{style:{display:"block",color:"var(--text2)",fontSize:"13px",marginBottom:"6px"},children:"Target Department Task"}),r.jsxs("select",{className:"form-select",value:C,onChange:b=>L(b.target.value),style:{width:"100%",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"",children:"-- Select Department --"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"})]})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"20px"},children:[r.jsx("label",{style:{display:"block",color:"var(--text2)",fontSize:"13px",marginBottom:"6px"},children:"Set Task Status to"}),r.jsxs("select",{className:"form-select",value:P,onChange:b=>g(b.target.value),style:{width:"100%",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"flex-end",gap:"10px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>D(null),disabled:T,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:T,style:{background:"#3b82f6",border:"none",color:"#fff",borderRadius:"6px",padding:"8px 16px",cursor:"pointer",fontWeight:"600"},children:T?"Updating...":"Update All Units"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}}),r.jsx(th,{isOpen:N,onClose:()=>M(!1),onImportComplete:()=>{gt(),window.dispatchEvent(new CustomEvent("orderUpdated"))}}),A&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&V(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"700px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Amend Order Details"}),r.jsxs("div",{className:"modal-sub",children:["Updating fields for ",A.order_number]})]}),r.jsx("button",{className:"modal-close",onClick:()=>V(null),children:"✕"})]}),r.jsxs("form",{onSubmit:ge,children:[r.jsx("div",{className:"modal-body",children:r.jsxs("div",{className:"form-grid",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"},children:[r.jsxs("div",{className:"form-group",style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Select Company & Location"}),r.jsxs("select",{className:"form-select",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.company_location_id,onChange:b=>O({...U,company_location_id:b.target.value}),required:!0,children:[r.jsx("option",{value:"",children:"-- None --"}),K.map(b=>{var X;return r.jsx("optgroup",{label:b.name,children:(X=b.locations)==null?void 0:X.map(ae=>r.jsxs("option",{value:ae.id,children:[b.name," - ",ae.city]},ae.id))},b.id)})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Order Date"}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.order_date,onChange:b=>{const X=b.target.value;let ae=U.delivery_date;if(X){const Ee=new Date(X);Ee.setDate(Ee.getDate()+28),ae=Ee.toISOString().split("T")[0]}O({...U,order_date:X,delivery_date:ae})}})]}),r.jsxs("div",{className:"form-group",children:[r.jsxs("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:["Overall Delivery Date ",r.jsx("span",{style:{textTransform:"none",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",opacity:.7,cursor:"not-allowed"},value:U.delivery_date,disabled:!0})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Priority"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.priority,onChange:b=>O({...U,priority:b.target.value}),children:[r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Customer PO Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.po_number,onChange:b=>O({...U,po_number:b.target.value}),placeholder:"e.g. PO-45000"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Packaging Type"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.packaging_type,onChange:b=>O({...U,packaging_type:b.target.value}),children:[r.jsx("option",{value:"",children:"-- Select Packaging Type --"}),r.jsx("option",{value:"Wooden Packaging",children:"Wooden Packaging"}),r.jsx("option",{value:"Foam Packaging",children:"Foam Packaging"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"End Client Name"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.end_client_name,onChange:b=>O({...U,end_client_name:b.target.value}),placeholder:"e.g. Reliance Industries"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"GST Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.gst_number,onChange:b=>O({...U,gst_number:b.target.value}),placeholder:"e.g. 27AAAAA1111A1Z1"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Customer Reference Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.reference_number,onChange:b=>O({...U,reference_number:b.target.value}),placeholder:"e.g. REF-2026-99"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Classification"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:U.classification||"Standard",onChange:b=>O({...U,classification:b.target.value}),children:[r.jsx("option",{value:"Standard",children:"Standard"}),r.jsx("option",{value:"Non-Standard",children:"Non-Standard"})]})]}),r.jsxs("div",{className:"form-group",style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Overall Order Notes"}),r.jsx("textarea",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",height:"80px",resize:"vertical"},value:U.notes,onChange:b=>O({...U,notes:b.target.value}),placeholder:"Enter special notes..."})]})]})}),r.jsxs("div",{className:"modal-footer",style:{display:"flex",justifyContent:"flex-end",gap:"10px",padding:"16px",borderTop:"1px solid var(--border)"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#64748b",border:"none",color:"#fff",padding:"8px 16px",borderRadius:"4px",cursor:"pointer"},onClick:()=>V(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",style:{background:"#10b981",border:"none",color:"#fff",padding:"8px 16px",borderRadius:"4px",cursor:"pointer"},disabled:E,children:E?"Saving...":"Save Changes"})]})]})]})}),Z&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&se(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"640px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Amend Line Item"}),r.jsxs("div",{className:"modal-sub",children:["Item ",Z.line_item_number," — ",a==null?void 0:a.order_number]})]}),r.jsx("button",{className:"modal-close",onClick:()=>se(null),children:"✕"})]}),r.jsxs("form",{onSubmit:be,children:[r.jsx("div",{className:"modal-body",children:r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"},children:[r.jsxs("div",{style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Material Description"}),r.jsx("input",{type:"text",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.material_description,onChange:b=>Pe("material_description",b.target.value),placeholder:"e.g. VFD Control Panel 22kW"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Part Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.part_number,onChange:b=>Pe("part_number",b.target.value),placeholder:"e.g. VFD-22K-STD"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Panel Type / Size"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.panel_type_size,onChange:b=>Pe("panel_type_size",b.target.value),placeholder:"e.g. 800x600"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Quantity"}),r.jsx("input",{type:"number",min:"1",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.quantity,onChange:b=>Pe("quantity",b.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Unit"}),r.jsx("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.unit,onChange:b=>Pe("unit",b.target.value),children:["Nos","Sets","Pcs","Units","Lot"].map(b=>r.jsx("option",{value:b,children:b},b))})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Unit Price (₹)"}),r.jsx("input",{type:"number",min:"0",max:"9999999999999.99",step:"0.01",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:xe.unit_price,onChange:b=>Pe("unit_price",b.target.value)})]}),r.jsxs("div",{style:{gridColumn:"span 2",padding:"8px 12px",background:"var(--bg2)",borderRadius:"6px",border:"1px solid var(--border)",fontSize:"13px",color:"var(--text3)"},children:["Total Price: ",r.jsxs("strong",{style:{color:"var(--text)",fontSize:"15px"},children:["₹",((parseFloat(xe.unit_price)||0)*(parseInt(xe.quantity)||0)).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"11px"},children:"(auto-calculated)"})]}),r.jsxs("div",{children:[r.jsxs("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:["Line Item Delivery Date ",r.jsx("span",{style:{textTransform:"none",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box",opacity:.7,cursor:"not-allowed"},value:xe.delivery_date,disabled:!0})]}),r.jsxs("div",{style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Notes"}),r.jsx("textarea",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",height:"72px",resize:"vertical",boxSizing:"border-box"},value:xe.notes,onChange:b=>Pe("notes",b.target.value),placeholder:"Item-specific notes..."})]})]})}),r.jsxs("div",{className:"modal-footer",style:{display:"flex",justifyContent:"flex-end",gap:"10px",padding:"16px",borderTop:"1px solid var(--border)"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#64748b",border:"none",color:"#fff",padding:"8px 18px",borderRadius:"4px",cursor:"pointer"},onClick:()=>se(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",style:{background:"#7c3aed",border:"none",color:"#fff",padding:"8px 18px",borderRadius:"4px",cursor:"pointer"},disabled:ve,children:ve?"Saving...":"Save Line Item"})]})]})]})})]})}const Rp=[{key:"orders.order_number",label:"Order #"},{key:"orders.po_number",label:"PO Number"},{key:"orders.order_date",label:"Order Date"},{key:"orders.delivery_date",label:"Delivery Date"},{key:"orders.planned_dispatch_date",label:"Planned Dispatch Date"},{key:"orders.priority",label:"Priority"},{key:"orders.classification",label:"Classification"},{key:"orders.packaging_type",label:"Packaging Type"},{key:"orders.end_client_name",label:"End Client Name"},{key:"orders.reference_number",label:"Reference Number"},{key:"orders.gst_number",label:"GST Number"},{key:"orders.hold_status",label:"Hold Status"},{key:"orders.order_status",label:"Order Status"},{key:"orders.notes",label:"Order Notes"},{key:"company_name",label:"Company Name"},{key:"company_city",label:"Company City"},{key:"person_in_charge",label:"Person In Charge"},{key:"contact_number",label:"Contact Number"},{key:"company_email",label:"Company Email"},{key:"orders.wiring_assigned_date",label:"Wiring Assigned Date"},{key:"orders.wiring_expected_date",label:"Wiring Expected Date"},{key:"orders.expected_qc_date",label:"Expected QC Date"},{key:"orders.qc_date",label:"QC Date"},{key:"orders.qc_status",label:"QC Status"},{key:"li.material_description",label:"Material Description"},{key:"li.part_number",label:"Part Number"},{key:"li.panel_type_size",label:"Panel Type / Size"},{key:"li.delivery_date",label:"Line Item Delivery Date"},{key:"li.quantity",label:"Quantity"},{key:"li.unit",label:"Unit"},{key:"li.unit_price",label:"Unit Price"},{key:"li.total_price",label:"Total Price"},{key:"docs.any",label:"Any document uploaded"},{key:"docs.PO",label:"PO document uploaded"},{key:"docs.Drawing",label:"Drawing uploaded"},{key:"docs.BOM",label:"BOM uploaded"},{key:"docs.QC",label:"QC document uploaded"},{key:"docs.Dispatch",label:"Dispatch document uploaded"},{key:"docs.Quotation",label:"Quotation uploaded"},{key:"docs.General",label:"General document uploaded"},{key:"docs.TaskUpload",label:"Task upload present"},{key:"unit_serial",label:"Unit Serial"},{key:"short_serial",label:"Short Serial"},{key:"current_dept",label:"Current Department"},{key:"unit_status",label:"Unit Status"},{key:"__custom__",label:"Custom key…"}],ec=[{value:"",label:"— No condition (any non-empty) —",needsValue:!1},{value:"IS_NOT_EMPTY",label:"is not empty",needsValue:!1},{value:"IS_EMPTY",label:"is empty",needsValue:!1},{value:"HAS_DOCS",label:"has documents (count > 0)",needsValue:!1},{value:"NO_DOCS",label:"has no documents (count = 0)",needsValue:!1},{value:"EQUALS",label:"= equals",needsValue:!0},{value:"NOT_EQUALS",label:"≠ not equals",needsValue:!0},{value:"CONTAINS",label:"contains",needsValue:!0},{value:"GT",label:"> greater than",needsValue:!0},{value:"GTE",label:"≥ greater than or equal",needsValue:!0},{value:"LT",label:"< less than",needsValue:!0},{value:"LTE",label:"≤ less than or equal",needsValue:!0},{value:"DATE_FUTURE",label:"date is in the future",needsValue:!1},{value:"DATE_PAST",label:"date is today or past",needsValue:!1}],Pl=(e,t)=>{switch(e){case"":return"";case"IS_NOT_EMPTY":return'$val !== "" && $val !== null && $val !== undefined';case"IS_EMPTY":return'$val === "" || $val === null || $val === undefined';case"HAS_DOCS":return"Number($val) > 0";case"NO_DOCS":return'Number($val) === 0 || $val === ""';case"EQUALS":return`String($val).toLowerCase() === ${JSON.stringify(String(t).toLowerCase())}`;case"NOT_EQUALS":return`String($val).toLowerCase() !== ${JSON.stringify(String(t).toLowerCase())}`;case"CONTAINS":return`String($val).toLowerCase().includes(${JSON.stringify(String(t).toLowerCase())})`;case"GT":return`Number($val) > ${Number(t)||0}`;case"GTE":return`Number($val) >= ${Number(t)||0}`;case"LT":return`Number($val) < ${Number(t)||0}`;case"LTE":return`Number($val) <= ${Number(t)||0}`;case"DATE_FUTURE":return"new Date($val) > new Date()";case"DATE_PAST":return"new Date($val) <= new Date()";default:return""}},nh=(e,t)=>{var a;if(!e)return"auto-done when not empty";const n=((a=Rp.find(o=>o.key===t))==null?void 0:a.label)||t;return e==="Number($val) > 0"?`${n} → at least 1 document`:e.includes("Number($val) === 0")?`${n} → no documents`:e.includes('!== ""')?`${n} is not empty`:e.includes('=== ""')?`${n} is empty`:e.includes(".includes(")?`${n} contains value`:e.includes("new Date($val) > new Date()")?`${n} is in the future`:e.includes("new Date($val) <= new Date()")?`${n} is today or past`:e.includes("=== ")?`${n} equals value`:e.includes("!== ")?`${n} does not equal value`:e.includes("> ")?`${n} > value`:e.includes(">= ")?`${n} >= value`:e.includes("< ")?`${n} < value`:e.includes("<= ")?`${n} <= value`:e},ah=[{key:"order_number",label:"Order Number"},{key:"company_name",label:"Company Name"},{key:"delivery_date",label:"Delivery Date"},{key:"po_number",label:"PO Number"},{key:"packaging_type",label:"Packaging Type"},{key:"priority",label:"Priority"},{key:"notes",label:"Order Notes"}];function oh(){var K,Y;const[e,t]=p.useState("companies"),[n,a]=p.useState([]),[o,l]=p.useState(!1),[s,i]=p.useState({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),[d,u]=p.useState([]),[h,m]=p.useState(!1),[y,w]=p.useState(null),[_,S]=p.useState({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),[z,x]=p.useState([]),[f,c]=p.useState(!1),[k,I]=p.useState({label:"",type:"Text",options:"",datakeyPreset:"",customDatakey:"",operator:"",conditionValue:""}),D=localStorage.getItem("token"),L=((K=JSON.parse(localStorage.getItem("user")||"{}").role)==null?void 0:K.toLowerCase())==="admin";p.useEffect(()=>{P(),g()},[]),p.useEffect(()=>{const E=$=>{$.altKey&&$.key.toLowerCase()==="n"&&($.preventDefault(),e==="companies"&&L?l(!0):e==="tasks"&&L&&(w(null),S({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,order_fields:[]}),x([]),c(!1),m(!0)))};return window.addEventListener("keydown",E),()=>{window.removeEventListener("keydown",E)}},[e,L]);const P=async()=>{try{const E=await fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${D}`}});E.ok&&a(await E.json())}catch(E){console.error(E)}},g=async()=>{try{const E=await fetch(window.API_BASE+"/api/task_masters",{headers:{Authorization:`Bearer ${D}`}});E.ok&&u(await E.json())}catch(E){console.error(E)}},T=(E,$,Z)=>{const se=[...s.locations];se[E][$]=Z,i({...s,locations:se})},j=()=>{i({...s,locations:[...s.locations,{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]})},N=async E=>{E.preventDefault();try{(await fetch(window.API_BASE+"/api/companies",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${D}`},body:JSON.stringify(s)})).ok&&(l(!1),i({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),P())}catch($){console.error($)}},M=async E=>{E.preventDefault();const $=!!y,Z=$?`${window.API_BASE}/api/task_masters/${y}`:window.API_BASE+"/api/task_masters",se=$?"PUT":"POST",xe=z.map(({id:oe,label:ve,type:B,options:te,datakey:H,condition:ge})=>({id:oe,label:ve,type:B,options:te||[],datakey:H||"",condition:ge||""}));try{(await fetch(Z,{method:se,headers:{"Content-Type":"application/json",Authorization:`Bearer ${D}`},body:JSON.stringify({..._,custom_fields:xe,order_fields:_.order_fields||[]})})).ok?(m(!1),w(null),S({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),x([]),c(!1),g()):alert("Failed to save task")}catch(oe){console.error(oe)}},A=E=>{w(E.id),S({dept:E.dept,name:E.name,sub:E.sub||"",special:E.special||"",is_mandatory:E.is_mandatory,requires_upload:E.requires_upload,default_doc_type:E.default_doc_type||"General",order_fields:Array.isArray(E.order_fields)?E.order_fields:E.order_fields?JSON.parse(E.order_fields):[]});try{const $=Array.isArray(E.custom_fields)?E.custom_fields:JSON.parse(E.custom_fields||"[]");x($)}catch{x([])}c(!1),m(!0)},V=()=>{if(!k.label.trim()){alert("Label is required.");return}const E=k.datakeyPreset==="__custom__"?(k.customDatakey||"").trim():(k.datakeyPreset||"").trim(),$=Pl(k.operator,k.conditionValue),Z={id:Date.now(),label:k.label.trim(),type:k.type,options:k.type==="Dropdown"?k.options.split(",").map(se=>se.trim()).filter(Boolean):[],datakey:E,condition:$};x(se=>[...se,Z]),I({label:"",type:"Text",options:"",datakeyPreset:"",customDatakey:"",operator:"",conditionValue:""}),c(!1)},U=E=>x($=>$.filter(Z=>Z.id!==E)),O=async E=>{if(window.confirm("Are you sure you want to delete this task?"))try{(await fetch(`${window.API_BASE}/api/task_masters/${E}`,{method:"DELETE",headers:{Authorization:`Bearer ${D}`}})).ok?g():alert("Failed to delete task")}catch($){console.error($)}};return r.jsxs("div",{style:{padding:"24px"},children:[r.jsxs("div",{style:{display:"flex",gap:"16px",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:[r.jsx("button",{className:`vbtn ${e==="companies"?"active":""}`,onClick:()=>t("companies"),children:"Companies"}),r.jsx("button",{className:`vbtn ${e==="tasks"?"active":""}`,onClick:()=>t("tasks"),children:"Task Masters"})]}),e==="companies"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"var(--text)"},children:"Company Masters"}),L&&r.jsx("button",{className:"vbtn",onClick:()=>l(!0),children:"+ Register Company (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:n.map(E=>r.jsxs("div",{style:{background:"var(--bg2)",padding:"20px",borderRadius:"12px",border:"1px solid var(--border)"},children:[r.jsx("h3",{style:{margin:"0 0 16px 0",color:"var(--text)"},children:E.name}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:E.locations.map($=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"16px",borderRadius:"8px",border:"1px solid var(--border)"},children:[r.jsx("div",{style:{color:"var(--blue)",fontWeight:"bold",marginBottom:"8px"},children:$.city}),r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",marginBottom:"4px"},children:$.address}),r.jsxs("div",{style:{fontSize:"12px",color:"var(--text3)",marginTop:"12px"},children:[r.jsxs("div",{children:[r.jsx("strong",{children:"Contact:"})," ",$.person_in_charge||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Phone:"})," ",$.contact_number||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Email:"})," ",$.email||"N/A"]})]})]},$.id))})]},E.id))})]}),e==="tasks"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"var(--text)"},children:"Task Masters"}),L&&r.jsx("button",{className:"vbtn",onClick:()=>{w(null),S({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),x([]),c(!1),m(!0)},children:"+ New Task (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:br.map(E=>{const $=d.filter(Z=>Z.dept===E.id);return $.length===0?null:r.jsxs("div",{children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"},children:[r.jsx("div",{style:{width:"4px",height:"16px",background:E.color,borderRadius:"2px"}}),r.jsx("h3",{style:{margin:0,color:"var(--text)",fontSize:"15px"},children:E.label})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:$.map(Z=>r.jsxs("div",{style:{background:"var(--bg2)",padding:"16px",borderRadius:"8px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"},children:[r.jsx("span",{style:{fontSize:"12px",color:E.color,fontWeight:"bold",textTransform:"uppercase"},children:Z.dept}),r.jsx("span",{style:{fontSize:"10px",background:Z.is_mandatory?"var(--blue-dim)":"var(--gray-dim)",color:Z.is_mandatory?"var(--blue)":"var(--text3)",padding:"2px 6px",borderRadius:"4px"},children:Z.is_mandatory?"MANDATORY":"OPTIONAL"})]}),r.jsx("div",{style:{color:"var(--text)",fontWeight:"500",marginBottom:"4px"},children:Z.name}),r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",marginBottom:"12px"},children:Z.sub||"No description"}),r.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[Z.requires_upload&&r.jsxs("span",{style:{fontSize:"10px",background:"#f59e0b44",color:"#fbbf24",padding:"2px 6px",borderRadius:"4px"},children:["Requires: ",Z.default_doc_type||"General"]}),Z.special&&r.jsxs("span",{style:{fontSize:"10px",background:"#10b98144",color:"#34d399",padding:"2px 6px",borderRadius:"4px"},children:["Special: ",Z.special]})]}),L&&r.jsxs("div",{style:{display:"flex",gap:"4px"},children:[r.jsx("button",{style:{background:"transparent",border:"1px solid var(--border2)",color:"var(--text2)",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>A(Z),children:"Edit"}),r.jsx("button",{style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>O(Z.id),children:"Delete"})]})]})]},Z.id))})]},E.id)})})]}),o&&r.jsx("div",{className:"modal-overlay open",onClick:E=>{E.target.className==="modal-overlay open"&&l(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:"Register Company"}),r.jsx("button",{className:"modal-close",onClick:()=>l(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:N,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Company Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:s.name,onChange:E=>i({...s,name:E.target.value})})]}),r.jsx("div",{style:{marginTop:"24px",marginBottom:"16px",borderBottom:"1px solid var(--border)",paddingBottom:"8px",color:"var(--text)"},children:"Locations"}),s.locations.map((E,$)=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"16px",borderRadius:"8px",marginBottom:"16px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"City *"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:E.city,onChange:Z=>T($,"city",Z.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Person in Charge"}),r.jsx("input",{type:"text",className:"form-input",value:E.person_in_charge,onChange:Z=>T($,"person_in_charge",Z.target.value)})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Full Address"}),r.jsx("input",{type:"text",className:"form-input",value:E.address,onChange:Z=>T($,"address",Z.target.value)})]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Contact Number"}),r.jsx("input",{type:"text",className:"form-input",value:E.contact_number,onChange:Z=>T($,"contact_number",Z.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Email"}),r.jsx("input",{type:"email",className:"form-input",value:E.email,onChange:Z=>T($,"email",Z.target.value)})]})]})]},$)),r.jsx("button",{type:"button",onClick:j,style:{background:"transparent",border:"1px dashed var(--border2)",color:"var(--text3)",width:"100%",padding:"12px",borderRadius:"8px",cursor:"pointer",marginBottom:"24px"},children:"+ Add Another Location"}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"var(--bg4)"},onClick:()=>l(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:"Save Company"})]})]})})]})}),h&&r.jsx("div",{className:"modal-overlay open",onClick:E=>{E.target.className==="modal-overlay open"&&m(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:y?"Edit Task Master":"New Task Master"}),r.jsx("button",{className:"modal-close",onClick:()=>m(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:M,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Department"}),r.jsx("select",{className:"form-select",value:_.dept,onChange:E=>S({..._,dept:E.target.value}),children:br.map(E=>r.jsx("option",{value:E.id,children:E.label},E.id))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Task Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:_.name,onChange:E=>S({..._,name:E.target.value})})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Description / Subtitle"}),r.jsx("input",{type:"text",className:"form-input",value:_.sub,onChange:E=>S({..._,sub:E.target.value})})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"16px"},children:[r.jsx("input",{type:"checkbox",checked:_.is_mandatory,onChange:E=>S({..._,is_mandatory:E.target.checked})}),r.jsx("label",{style:{margin:0,color:"var(--text)"},children:"Mandatory Task (added to all new orders)"})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"12px"},children:[r.jsx("input",{type:"checkbox",checked:_.requires_upload,onChange:E=>S({..._,requires_upload:E.target.checked})}),r.jsx("label",{style:{margin:0,color:"var(--text)"},children:"Requires Document Upload to complete"})]}),_.requires_upload&&r.jsxs("div",{className:"modal-field",style:{marginLeft:"24px",marginTop:"8px"},children:[r.jsx("label",{style:{color:"#fff",fontSize:"12px",display:"block",marginBottom:"4px"},children:"Default Document Type"}),r.jsxs("select",{className:"form-select",value:_.default_doc_type||"General",onChange:E=>S({..._,default_doc_type:E.target.value}),style:{fontSize:"13px",width:"100%",padding:"6px 12px"},children:[r.jsx("option",{value:"General",children:"General"}),r.jsx("option",{value:"PO",children:"PO"}),r.jsx("option",{value:"Quotation",children:"Quotation"}),r.jsx("option",{value:"BOM",children:"BOM"}),r.jsx("option",{value:"Drawing",children:"Drawing"}),r.jsx("option",{value:"QC Report",children:"QC Report"}),r.jsx("option",{value:"Dispatch Document",children:"Dispatch Document"}),r.jsx("option",{value:"Photo",children:"Photo"})]})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid #333"},children:[r.jsx("label",{style:{color:"#fff",fontWeight:"600",display:"block",marginBottom:"10px"},children:"Order Fields to Show"}),r.jsx("div",{style:{color:"var(--text3)",fontSize:"11px",marginBottom:"10px"},children:"These fields from the order will be shown as read-only reference inside the task modal."}),r.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:ah.map(E=>{const $=(_.order_fields||[]).includes(E.key);return r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"6px",background:$?"var(--blue-dim)":"var(--bg3)",border:`1px solid ${$?"rgba(59,130,246,0.4)":"var(--border)"}`,borderRadius:"6px",padding:"5px 10px",cursor:"pointer",fontSize:"12px",color:$?"var(--blue)":"var(--text3)"},children:[r.jsx("input",{type:"checkbox",checked:$,style:{display:"none"},onChange:()=>{const Z=_.order_fields||[],se=$?Z.filter(xe=>xe!==E.key):[...Z,E.key];S(xe=>({...xe,order_fields:se}))}}),$?"✓ ":"",E.label]},E.key)})})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("label",{style:{color:"var(--text)",fontWeight:"600"},children:"Form Fields"}),r.jsx("button",{type:"button",onClick:()=>c(!f),style:{background:"rgba(59,130,246,0.15)",color:"#60a5fa",border:"1px solid rgba(59,130,246,0.3)",padding:"4px 10px",borderRadius:"6px",fontSize:"11px",cursor:"pointer"},children:f?"Cancel":"+ Add Field"})]}),f&&r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px",marginBottom:"12px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Label *"}),r.jsx("input",{type:"text",className:"form-input",value:k.label,onChange:E=>I($=>({...$,label:E.target.value})),placeholder:"e.g. Test Voltage"})]}),r.jsxs("div",{style:{background:"var(--bg4)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:"8px",padding:"12px",marginBottom:"12px"},children:[r.jsx("div",{style:{fontSize:"11px",color:"#a78bfa",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"10px"},children:"Auto-Done Trigger (optional)"}),r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"10px"},children:"If the selected DB field matches this condition, the task is automatically marked Done."}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"},children:[r.jsx("span",{style:{fontSize:"12px",fontWeight:"700",color:"#a78bfa",minWidth:"18px"},children:"IF"}),r.jsxs("div",{style:{flex:"1 1 160px"},children:[r.jsxs("select",{className:"form-select",value:k.datakeyPreset||"",onChange:E=>I($=>({...$,datakeyPreset:E.target.value,customDatakey:"",operator:"",conditionValue:""})),children:[r.jsx("option",{value:"",children:"— pick a field —"}),Rp.map(E=>r.jsx("option",{value:E.key,children:E.label},E.key))]}),k.datakeyPreset==="__custom__"&&r.jsx("input",{type:"text",className:"form-input",style:{marginTop:"6px",fontFamily:"monospace",fontSize:"12px"},value:k.customDatakey||"",onChange:E=>I($=>({...$,customDatakey:E.target.value})),placeholder:"table.column_name"})]}),r.jsx("div",{style:{flex:"1 1 160px"},children:r.jsx("select",{className:"form-select",value:k.operator||"",onChange:E=>I($=>({...$,operator:E.target.value,conditionValue:""})),disabled:!k.datakeyPreset||k.datakeyPreset==="",children:ec.map(E=>r.jsx("option",{value:E.value,children:E.label},E.value))})}),((Y=ec.find(E=>E.value===k.operator))==null?void 0:Y.needsValue)&&r.jsx("div",{style:{flex:"1 1 120px"},children:r.jsx("input",{type:"text",className:"form-input",value:k.conditionValue||"",onChange:E=>I($=>({...$,conditionValue:E.target.value})),placeholder:"value…"})})]}),k.datakeyPreset&&k.datakeyPreset!==""&&r.jsx("div",{style:{marginTop:"8px",fontSize:"11px",color:"#9ca3af",fontFamily:"monospace",background:"var(--bg3)",padding:"6px 10px",borderRadius:"4px"},children:Pl(k.operator,k.conditionValue)?`Auto-done: ${Pl(k.operator,k.conditionValue)}`:"Auto-done when field has any value"})]}),r.jsx("button",{type:"button",onClick:V,style:{background:"#10b981",color:"#fff",border:"none",padding:"6px 14px",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},children:"Add Field"})]}),z.length===0?r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",fontStyle:"italic",padding:"8px 0"},children:"No form fields defined. Users will only see Notes when filling this task."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:z.map(E=>{var $;return r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[r.jsxs("div",{children:[r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:E.label}),(($=E.options)==null?void 0:$.length)>0&&r.jsxs("span",{style:{marginLeft:"6px",fontSize:"10px",color:"var(--text3)"},children:["(",E.options.join(", "),")"]})]}),(E.datakey||E.condition)&&r.jsx("div",{style:{fontSize:"11px",color:"#a78bfa",marginTop:"3px",display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"},children:r.jsxs("span",{style:{background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"4px",padding:"1px 6px"},children:["IF ",nh(E.condition,E.datakey)]})})]}),r.jsx("button",{type:"button",onClick:()=>U(E.id),style:{background:"transparent",border:"none",color:"#666",cursor:"pointer",fontSize:"14px"},children:"✕"})]},E.id)})})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px",marginTop:"24px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#333"},onClick:()=>m(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:y?"Update Task":"Save Task"})]})]})})]})})]})}function lh(){const[e,t]=p.useState([]),[n,a]=p.useState("1000"),[o,l]=p.useState(""),[s,i]=p.useState("All"),[d,u]=p.useState(!1),h=localStorage.getItem("token");p.useEffect(()=>{m(n)},[n]);const m=async(S=n)=>{u(!0);try{const z=await fetch(`${window.API_BASE}/api/logs?limit=${S}`,{headers:{Authorization:`Bearer ${h}`}});if(z.ok){const x=await z.json();t(x)}}catch(z){console.error(z)}finally{u(!1)}},y=S=>{const z=new Date(S);return z.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+" "+z.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},w=S=>{switch(S==null?void 0:S.toLowerCase()){case"sales":return{background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",border:"1px solid rgba(59, 130, 246, 0.2)"};case"design":return{background:"rgba(167, 139, 250, 0.1)",color:"#a78bfa",border:"1px solid rgba(167, 139, 250, 0.2)"};case"purchase":return{background:"rgba(249, 115, 22, 0.1)",color:"#f97316",border:"1px solid rgba(249, 115, 22, 0.2)"};case"stores":return{background:"rgba(45, 212, 191, 0.1)",color:"#2dd4bf",border:"1px solid rgba(45, 212, 191, 0.2)"};case"production":return{background:"rgba(239, 68, 68, 0.1)",color:"#ef4444",border:"1px solid rgba(239, 68, 68, 0.2)"};case"qc":return{background:"rgba(34, 197, 94, 0.1)",color:"#22c55e",border:"1px solid rgba(34, 197, 94, 0.2)"};case"dispatch":return{background:"rgba(245, 158, 11, 0.1)",color:"#f59e0b",border:"1px solid rgba(245, 158, 11, 0.2)"};case"accounts":return{background:"rgba(14, 165, 233, 0.1)",color:"#0ea5e9",border:"1px solid rgba(14, 165, 233, 0.2)"};default:return{background:"rgba(255, 255, 255, 0.05)",color:"#888",border:"1px solid rgba(255, 255, 255, 0.1)"}}},_=e.filter(S=>{if(s!=="All"&&S.dept!==s)return!1;if(o.trim()!==""){const z=o.trim().toLowerCase().split(/\s+/),x=(S.username||"").toLowerCase(),f=(S.action_text||"").toLowerCase(),c=(S.order_number||"").toLowerCase();return z.every(k=>x.includes(k)||f.includes(k)||c.includes(k))}return!0});return r.jsxs("div",{style:{padding:"24px"},children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"var(--text)",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Ro,{size:22,style:{color:"#f59e0b"}}),"System Activity Logs"]})}),r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"16px",flex:1,minWidth:"300px"},children:[r.jsxs("div",{style:{position:"relative",flex:1,minWidth:"220px"},children:[r.jsx(Mr,{size:16,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("input",{type:"text",placeholder:"Search logs by user, action or order #...",value:o,onChange:S=>l(S.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 38px",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},className:"log-search-input"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(zi,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:s,onChange:S=>i(S.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"All",children:"All Departments"}),r.jsx("option",{value:"Sales",children:"Sales"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"}),r.jsx("option",{value:"Accounts",children:"Accounts"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]}),r.jsxs("div",{style:{position:"relative",width:"160px"},children:[r.jsx(Pp,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:n,onChange:S=>a(S.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"100",children:"Fetch 100 Logs"}),r.jsx("option",{value:"250",children:"Fetch 250 Logs"}),r.jsx("option",{value:"500",children:"Fetch 500 Logs"}),r.jsx("option",{value:"1000",children:"Fetch 1000 Logs"}),r.jsx("option",{value:"5000",children:"Fetch 5000 Logs"}),r.jsx("option",{value:"all",children:"Fetch All Logs"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[(o||s!=="All")&&r.jsx("button",{onClick:()=>{l(""),i("All")},style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"#ef4444",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",transition:"all 0.2s"},className:"clear-btn",children:"Clear Filters"}),r.jsxs("button",{onClick:()=>m(n),disabled:d,style:{background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",transition:"all 0.2s"},className:"refresh-btn",children:[r.jsx(Ht,{size:14,className:d?"spin":"",style:{transition:"transform 0.5s"}}),d?"Loading...":"Refresh"]})]})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:"12px",fontSize:"12px",color:"var(--text3)"},children:[r.jsxs("div",{children:["Showing ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:"600"},children:_.length})," ","of ",r.jsx("span",{style:{color:"var(--text)",fontWeight:"600"},children:e.length})," fetched logs"," ",n==="all"?"(full system history)":`(limit: ${n})`]}),_.length<e.length&&r.jsxs("div",{style:{fontStyle:"italic"},children:["Filtered out ",e.length-_.length," logs"]})]}),r.jsx("div",{style:{background:"var(--bg2)",borderRadius:"12px",border:"1px solid var(--border)",overflow:"hidden"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"13px"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"var(--bg3)",borderBottom:"1px solid var(--border)"},children:[r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Timestamp"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"User"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Order #"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Department"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Action"})]})}),r.jsx("tbody",{children:d&&e.length===0?r.jsx("tr",{children:r.jsxs("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"var(--text3)"},children:[r.jsx(Ht,{size:24,className:"spin",style:{margin:"0 auto 12px",color:"#f59e0b",display:"block"}}),"Loading activity logs..."]})}):_.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"var(--text3)"},children:"No matching activity logs found."})}):_.map(S=>r.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},className:"log-row",children:[r.jsx("td",{style:{padding:"16px",color:"var(--text3)",whiteSpace:"nowrap"},children:y(S.timestamp)}),r.jsx("td",{style:{padding:"16px",color:"var(--text)",fontWeight:"600"},children:S.username}),r.jsx("td",{style:{padding:"16px"},children:S.order_number?r.jsx("span",{style:{fontFamily:"monospace",fontSize:"11px",background:"var(--orange-dim)",color:"var(--accent)",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(245,158,11,0.2)"},children:S.order_number}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"})}),r.jsx("td",{style:{padding:"16px"},children:S.dept?r.jsx("span",{style:{display:"inline-block",fontSize:"11px",fontWeight:"500",padding:"2px 8px",borderRadius:"12px",...w(S.dept)},children:S.dept}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"})}),r.jsx("td",{style:{padding:"16px",color:"var(--text)"},children:S.action_text})]},S.id))})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const sh=[10,20,50,100],Tl=["sr_no","order_number","po_number","reference_number","part_number","client_name","end_client_name","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","priority","status","qc_status","qc_date","progress","action"];function ih(){var Ut;const e=localStorage.getItem("token"),t=JSON.parse(localStorage.getItem("user")||"{}"),n=["admin","manager","planning"].includes((Ut=t.role)==null?void 0:Ut.toLowerCase()),a=qn.useRef(null);p.useEffect(()=>{const v=a.current;if(!v)return;let R=!1,Q,J;const re=je=>{["INPUT","SELECT","OPTION","BUTTON","A","TH"].includes(je.target.tagName)||je.target.closest("th")||je.target.closest("button")||(R=!0,v.classList.add("active-drag"),Q=je.pageX-v.offsetLeft,J=v.scrollLeft)},le=()=>{R=!1,v.classList.remove("active-drag")},Se=()=>{R=!1,v.classList.remove("active-drag")},ce=je=>{if(!R)return;je.preventDefault();const ue=(je.pageX-v.offsetLeft-Q)*1.5;v.scrollLeft=J-ue};return v.addEventListener("mousedown",re),v.addEventListener("mouseleave",le),v.addEventListener("mouseup",Se),v.addEventListener("mousemove",ce),()=>{v.removeEventListener("mousedown",re),v.removeEventListener("mouseleave",le),v.removeEventListener("mouseup",Se),v.removeEventListener("mousemove",ce)}},[]);const[o,l]=p.useState([]),[s,i]=p.useState(()=>{const v=localStorage.getItem("planning_column_order");if(v)try{const R=JSON.parse(v);if(Array.isArray(R)&&R.length>0){const Q=R.filter(re=>Tl.includes(re)),J=Tl.filter(re=>!Q.includes(re));return[...Q,...J]}}catch(R){console.error("Error parsing column order from localStorage:",R)}return Tl}),[d,u]=p.useState(null),[h,m]=p.useState(null),y=(v,R)=>{u(R),v.dataTransfer.effectAllowed="move",v.dataTransfer.setData("text/plain",R)},w=(v,R)=>{v.preventDefault(),d!==R&&h!==R&&m(R)},_=(v,R)=>{h===R&&m(null)},S=(v,R)=>{if(v.preventDefault(),!d||d===R){u(null),m(null);return}const Q=s.indexOf(d),J=s.indexOf(R);if(Q!==-1&&J!==-1){const re=[...s];re.splice(Q,1),re.splice(J,0,d),i(re),localStorage.setItem("planning_column_order",JSON.stringify(re))}u(null),m(null)},z=()=>{u(null),m(null)},x=v=>{switch(v){case"sr_no":return"Sr. No.";case"order_number":return"Order Number";case"po_number":return"PO Number";case"reference_number":return"Cust. Ref #";case"part_number":return"Part Number";case"client_name":return"Client Name";case"end_client_name":return"End Client Name";case"planned_dispatch":return"Planned Dispatch";case"mounting_start":return"Mounting Start";case"mounting_complete":return"Mounting Complete";case"delivery_date":return"Order Delivery Date";case"wiring_assigned":return"Wiring Assigned";case"wiring_expected":return"Wiring Expected";case"expected_qc":return"Expected QC";case"priority":return"Priority";case"status":return"Status";case"qc_status":return"QC Status";case"qc_date":return"QC Passed Date";case"progress":return"Progress";case"action":return"Action";default:return v}},f=s.filter(v=>!(v==="action"&&!n)),c=(v,R,Q,J)=>{var Se;const re=B&&B.lineItemId===R.line_item_id&&B.colId===v;if(H&&H.lineItemId===R.line_item_id&&H.colId===v)return r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{className:"inline-saving-spinner"}),r.jsx("span",{className:"dim text-xs",children:"Saving..."})]});if(re){const ce=ue=>{ue.key==="Enter"?ue.target.blur():ue.key==="Escape"&&te(null)},je=ue=>{er(R.line_item_id,v,ue,B.oldValue)},Ie=()=>{B&&B.lineItemId===R.line_item_id&&B.colId===v&&er(R.line_item_id,v,B.value,B.oldValue)};if(["priority","status","qc_status"].includes(v)){let ue=[];return v==="priority"?ue=["Low","Medium","High","Urgent"]:v==="status"?ue=["Not Started","In Progress","Waiting for Material","QC Testing","Completed"]:v==="qc_status"&&(ue=["Pending","Pass","Fail"]),r.jsx("select",{className:"inline-edit-select",value:B.value,onChange:dt=>je(dt.target.value),onBlur:Ie,autoFocus:!0,children:ue.map(dt=>r.jsx("option",{value:dt,children:dt},dt))})}if(["planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(v))return r.jsx("input",{type:"date",className:"inline-edit-input",value:B.value,onChange:ue=>te({...B,value:ue.target.value}),onBlur:Ie,onKeyDown:ce,autoFocus:!0});if(v==="end_client_name")return r.jsx("input",{type:"text",className:"inline-edit-input",value:B.value,onChange:ue=>te({...B,value:ue.target.value}),onBlur:Ie,onKeyDown:ce,autoFocus:!0})}switch(v){case"sr_no":return Q;case"order_number":return r.jsxs(r.Fragment,{children:[R.line_item_number,R.total_qty>1&&r.jsxs("span",{style:{opacity:.5,marginLeft:"8px"},children:["(",R.unit_index,"/",R.total_qty,")"]})]});case"po_number":return R.po_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"reference_number":return R.reference_number?r.jsx("span",{style:{color:"#f59e0b",fontWeight:600},children:R.reference_number}):r.jsx("span",{className:"dim text-xs",children:"—"});case"part_number":return R.part_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"client_name":return R.company_name;case"end_client_name":return R.end_client_name||r.jsx("span",{className:"dim text-xs",children:"Unspecified"});case"planned_dispatch":return Oe(R.planned_dispatch_date);case"mounting_start":return Oe(R.mounting_start_date);case"mounting_complete":return Oe(R.mounting_complete_date);case"wiring_assigned":return Oe(R.wiring_assigned_date);case"wiring_expected":return Oe(R.wiring_expected_date);case"expected_qc":return Oe(R.expected_qc_date);case"priority":return r.jsx("span",{className:`priority-badge ${((Se=R.priority)==null?void 0:Se.toLowerCase())||"medium"}`,children:R.priority});case"status":return r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[r.jsx("span",{className:`status-badge ${(R.status||"Not Started").toLowerCase().replace(/\s+/g,"-")}`,children:R.status||"Not Started"}),R.active_dept&&r.jsx("span",{className:`dept-badge dept-${(R.active_dept||"").toLowerCase()}`,children:R.active_dept})]});case"qc_status":return r.jsx("span",{className:`qc-badge ${(R.qc_status||"Pending").toLowerCase()}`,children:R.qc_status||"Pending"});case"qc_date":return Oe(R.qc_date);case"progress":return r.jsxs("div",{className:"progress-cell",children:[r.jsxs("div",{className:"progress-text",children:[J,"%"]}),r.jsx("div",{className:"progress-track",children:r.jsx("div",{className:"progress-fill",style:{width:`${J}%`,backgroundColor:X(J)}})})]});case"action":return n?r.jsx("button",{className:"icon-btn",onClick:()=>Na(R),title:"Edit planning data",children:r.jsx(Eg,{size:13})}):null;default:return null}},[k,I]=p.useState(!0),[D,C]=p.useState(""),[L,P]=p.useState("all"),[g,T]=p.useState("all"),[j,N]=p.useState(null),[M,A]=p.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[V,U]=p.useState(""),[O,K]=p.useState(""),[Y,E]=p.useState([]),[$,Z]=p.useState(!1),[se,xe]=p.useState({end_client_name:!1,planned_dispatch_date:!1,mounting_start_date:!1,mounting_complete_date:!1,wiring_assigned_date:!1,wiring_expected_date:!1,expected_qc_date:!1,priority:!1,status:!1,qc_status:!1,qc_date:!1}),[oe,ve]=p.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[B,te]=p.useState(null),[H,ge]=p.useState(null),[ie,F]=p.useState(1),[be,Pe]=p.useState(20),[me,it]=p.useState("none"),[q,G]=p.useState("none"),[Te,$t]=p.useState({}),gt=v=>{$t(R=>({...R,[v]:R[v]===!1}))};p.useEffect(()=>{rt()},[]);const rt=async()=>{try{const v=await fetch(window.API_BASE+"/api/planning",{headers:{Authorization:`Bearer ${e}`}});v.ok&&l(await v.json())}catch(v){console.error("Error fetching planning data:",v)}finally{I(!1)}},Na=v=>{n&&(N(v),A({end_client_name:v.end_client_name||"",planned_dispatch_date:v.planned_dispatch_date?v.planned_dispatch_date.split("T")[0]:"",mounting_start_date:v.mounting_start_date?v.mounting_start_date.split("T")[0]:"",mounting_complete_date:v.mounting_complete_date?v.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:v.wiring_assigned_date?v.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:v.wiring_expected_date?v.wiring_expected_date.split("T")[0]:"",expected_qc_date:v.expected_qc_date?v.expected_qc_date.split("T")[0]:"",priority:v.priority||"Medium",status:v.status||"Not Started",qc_status:v.qc_status||"Pending",qc_date:v.qc_date?v.qc_date.split("T")[0]:""}),U(""),K(""))},St=v=>{const{name:R,value:Q}=v.target;A(J=>({...J,[R]:Q}))},kn=async v=>{v.preventDefault();try{const R=await fetch(`${window.API_BASE}/api/planning/line-items/${j.line_item_id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(M)});if(R.ok)K("Planning details updated successfully."),setTimeout(()=>{N(null),rt(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const Q=await R.json();U(Q.error||"Failed to update planning details.")}}catch(R){console.error(R),U("Network error, please try again.")}},Oe=v=>v?new Date(v).toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"}):"—",Sn=[];o.forEach(v=>{const R=parseInt(v.quantity)||1;for(let Q=0;Q<R;Q++)Sn.push({...v,unit_index:Q+1,total_qty:R,row_key:`${v.line_item_id}-${Q}`})});const _n=Sn.filter(v=>{let R=!0;if(D.trim()!==""){const re=D.trim().toLowerCase().split(/\s+/),le=(v.order_number||"").toLowerCase(),Se=(v.line_item_number||"").toLowerCase(),ce=`${v.order_number||""} / ${v.line_item_number||""}`.toLowerCase(),je=`${v.order_number||""}/${v.line_item_number||""}`.toLowerCase(),Ie=`${v.order_number||""}${v.line_item_number||""}`.toLowerCase(),ue=(v.po_number||"").toLowerCase(),dt=(v.part_number||"").toLowerCase(),Wr=(v.company_name||"").toLowerCase(),Cn=(v.end_client_name||"").toLowerCase();R=re.every(Nt=>le.includes(Nt)||Se.includes(Nt)||ce.includes(Nt)||je.includes(Nt)||Ie.includes(Nt)||ue.includes(Nt)||dt.includes(Nt)||Wr.includes(Nt)||Cn.includes(Nt))}const Q=L==="all"||v.status===L,J=g==="all"||v.priority===g;return R&&Q&&J}),Ca=v=>{C(v),F(1)},za=v=>{P(v),F(1)},Ea=v=>{T(v),F(1)},Da=v=>{Pe(Number(v)),F(1)},Sr=_n.length,It=Math.max(1,Math.ceil(Sr/be)),ht=Math.min(ie,It),Zt=(ht-1)*be,Nn=Math.min(Zt+be,Sr),b=_n.slice(Zt,Nn),X=v=>v<30?"#ef4444":v<70?"#f59e0b":"#10b981",ae=p.useCallback(()=>{const v=[],Q=Math.max(1,ht-3),J=Math.min(It,ht+3);for(let re=Q;re<=J;re++)v.push(re);return v},[ht,It]),Ee=v=>{E(R=>R.includes(v)?R.filter(Q=>Q!==v):[...R,v])},Ve=()=>{const v=b.map(Q=>Q.line_item_id),R=v.every(Q=>Y.includes(Q));E(R?Q=>Q.filter(J=>!v.includes(J)):Q=>{const J=[...Q];return v.forEach(re=>{J.includes(re)||J.push(re)}),J})},He=async v=>{v.preventDefault();const R={};let Q=!1;if(Object.keys(oe).forEach(J=>{oe[J]!==""&&(R[J]=oe[J],Q=!0)}),!Q){U("Please modify at least one field to update.");return}I(!0);try{const J=await fetch(window.API_BASE+"/api/planning/line-items/bulk",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({lineItemIds:Y,fields:R})});if(J.ok)K(`Successfully updated ${Y.length} items.`),E([]),setTimeout(()=>{Z(!1),U(""),K(""),ve({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),rt(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const re=await J.json();U(re.error||"Failed to update selected items."),I(!1)}}catch(J){console.error(J),U("Network error, please try again."),I(!1)}},_r=(v,R,Q)=>{if(!n||["INPUT","SELECT","OPTION","BUTTON","A","svg","path"].includes(v.target.tagName))return;let J="";R==="end_client_name"?J=Q.end_client_name||"":R==="planned_dispatch"?J=Q.planned_dispatch_date?Q.planned_dispatch_date.split("T")[0]:"":R==="mounting_start"?J=Q.mounting_start_date?Q.mounting_start_date.split("T")[0]:"":R==="mounting_complete"?J=Q.mounting_complete_date?Q.mounting_complete_date.split("T")[0]:"":R==="wiring_assigned"?J=Q.wiring_assigned_date?Q.wiring_assigned_date.split("T")[0]:"":R==="wiring_expected"?J=Q.wiring_expected_date?Q.wiring_expected_date.split("T")[0]:"":R==="expected_qc"?J=Q.expected_qc_date?Q.expected_qc_date.split("T")[0]:"":R==="priority"?J=Q.priority||"Medium":R==="status"?J=Q.status||"Not Started":R==="qc_status"?J=Q.qc_status||"Pending":R==="qc_date"&&(J=Q.qc_date?Q.qc_date.split("T")[0]:""),te({lineItemId:Q.line_item_id,colId:R,value:J,oldValue:J})},er=async(v,R,Q,J)=>{if(Q===J){te(null);return}ge({lineItemId:v,colId:R}),te(null);try{let re=R;R==="planned_dispatch"?re="planned_dispatch_date":R==="mounting_start"?re="mounting_start_date":R==="mounting_complete"?re="mounting_complete_date":R==="wiring_assigned"?re="wiring_assigned_date":R==="wiring_expected"?re="wiring_expected_date":R==="expected_qc"&&(re="expected_qc_date");const le=o.find(je=>je.line_item_id===v);if(!le)throw new Error("Order not found");const Se={end_client_name:le.end_client_name||"",planned_dispatch_date:le.planned_dispatch_date?le.planned_dispatch_date.split("T")[0]:"",mounting_start_date:le.mounting_start_date?le.mounting_start_date.split("T")[0]:"",mounting_complete_date:le.mounting_complete_date?le.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:le.wiring_assigned_date?le.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:le.wiring_expected_date?le.wiring_expected_date.split("T")[0]:"",expected_qc_date:le.expected_qc_date?le.expected_qc_date.split("T")[0]:"",priority:le.priority||"Medium",status:le.status||"Not Started",qc_status:le.qc_status||"Pending",qc_date:le.qc_date?le.qc_date.split("T")[0]:""};Se[re]=Q;const ce=await fetch(`${window.API_BASE}/api/planning/line-items/${v}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(Se)});if(ce.ok)await rt(),window.dispatchEvent(new CustomEvent("orderUpdated"));else{const je=await ce.json();alert(je.error||"Failed to update planning details.")}}catch(re){console.error(re),alert("Network error, please try again.")}finally{ge(null)}},tr=(v,R)=>{if(!R||R==="none")return"";switch(R){case"planned_dispatch":return Oe(v.planned_dispatch_date);case"mounting_start":return Oe(v.mounting_start_date);case"mounting_complete":return Oe(v.mounting_complete_date);case"delivery_date":return Oe(v.delivery_date);case"wiring_assigned":return Oe(v.wiring_assigned_date);case"wiring_expected":return Oe(v.wiring_expected_date);case"expected_qc":return Oe(v.expected_qc_date);case"qc_date":return Oe(v.qc_date);case"client_name":return v.company_name||"Unspecified";case"end_client_name":return v.end_client_name||"Unspecified";case"priority":return v.priority||"Medium";case"status":return v.status||"Not Started";case"qc_status":return v.qc_status||"Pending";case"active_dept":return v.active_dept||"Planning";default:return v[R]||"Unspecified"}},pe=v=>{if(!me||me==="none")return{type:"flat",rows:v};const R={};v.forEach(J=>{const re=tr(J,me);R[re]||(R[re]=[]),R[re].push(J)});const Q={type:"grouped",keys:Object.keys(R).sort(),groups:{}};return Object.keys(R).forEach(J=>{const re=R[J];if(q&&q!=="none"){const le={};re.forEach(Se=>{const ce=tr(Se,q);le[ce]||(le[ce]=[]),le[ce].push(Se)}),Q.groups[J]={type:"subgrouped",keys:Object.keys(le).sort(),groups:le}}else Q.groups[J]={type:"flat",rows:re}}),Q},_t=(v,R,Q)=>{const J=Y.includes(v.line_item_id);return r.jsxs("tr",{className:`planning-row ${J?"selected-row":""}`,children:[n&&r.jsx("td",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},children:r.jsx("input",{type:"checkbox",checked:J,onChange:()=>Ee(v.line_item_id)})}),f.map((re,le)=>{const Se=le===0;let ce="";["sr_no","order_number","po_number","reference_number","part_number","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(re)&&(ce+=" mono"),re==="order_number"&&(ce+=" font-semibold text-accent");let Ie={};re==="part_number"&&(Ie={maxWidth:"120px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}),Se&&(ce+=" col-sticky-first",Ie={...Ie,left:n?"40px":0});const ue=["planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","status","qc_date"].includes(re),dt=B&&B.lineItemId===v.line_item_id&&B.colId===re,Wr=H&&H.lineItemId===v.line_item_id&&H.colId===re;return n&&ue&&(ce+=" editable-cell"),dt&&(ce+=" is-editing"),Wr&&(ce+=" is-saving"),r.jsx("td",{className:ce.trim(),style:Ie,title:re==="part_number"?v.part_number:void 0,onClick:Cn=>ue&&_r(Cn,re,v),children:c(re,v,R,Q)},re)})]},v.row_key)};return k?r.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"400px",color:"#888"},children:"Loading Planning Records..."}):r.jsxs("div",{className:"planning-module",children:[r.jsxs("div",{className:"planning-controls",children:[r.jsxs("div",{className:"search-box",children:[r.jsx(Mr,{size:16,className:"search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by PO, Client, End Client, or Order Number...",value:D,onChange:v=>Ca(v.target.value)})]}),r.jsxs("div",{className:"filter-group",children:[r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Status"}),r.jsxs("select",{value:L,onChange:v=>za(v.target.value),children:[r.jsx("option",{value:"all",children:"All Statuses"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{value:g,onChange:v=>Ea(v.target.value),children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Group By"}),r.jsxs("select",{value:me,onChange:v=>{it(v.target.value),v.target.value==="none"&&G("none")},children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Then Group By"}),r.jsxs("select",{value:q,onChange:v=>G(v.target.value),disabled:me==="none",children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsx("button",{className:"reset-filters-btn",onClick:()=>{C(""),P("all"),T("all"),it("none"),G("none"),F(1)},title:"Reset all filters and grouping to default",children:"Reset Filters"})]})]}),r.jsx("div",{className:"table-responsive",ref:a,children:r.jsxs("table",{className:"planning-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[n&&r.jsx("th",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},children:r.jsx("input",{type:"checkbox",checked:b.length>0&&b.every(v=>Y.includes(v.line_item_id)),onChange:Ve})}),f.map((v,R)=>{const Q=R===0,J=x(v),re=h===v,le=s.indexOf(d),Se=s.indexOf(v);let ce="";re&&le!==-1&&le!==Se&&(ce=le<Se?" drag-over-right":" drag-over-left");let je={},Ie=`${d===v?" dragging":""}${ce}`;return Q&&(Ie+=" col-sticky-first",je={left:n?"40px":0}),r.jsx("th",{className:Ie.trim(),style:je,draggable:!0,onDragStart:ue=>y(ue,v),onDragOver:ue=>w(ue,v),onDragLeave:ue=>_(ue,v),onDrop:ue=>S(ue,v),onDragEnd:z,children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(vg,{size:12,className:"drag-handle"}),r.jsx("span",{children:J})]})},v)})]})}),r.jsx("tbody",{children:b.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:f.length+(n?1:0),style:{textAlign:"center",padding:"32px",color:"#666",fontStyle:"italic"},children:"No planning records match your search criteria."})}):(()=>{const v=pe(b);if(v.type==="flat")return v.rows.map((Q,J)=>{const re=parseInt(Q.total_steps||0),le=parseInt(Q.done_steps||0),Se=re>0?Math.round(le/re*100):0;return _t(Q,Zt+J+1,Se)});let R=Zt;return v.keys.map(Q=>{const J=v.groups[Q],re=`p:${Q}`,le=Te[re]!==!1;let Se=0;return J.type==="flat"?Se=J.rows.length:J.keys.forEach(ce=>{Se+=J.groups[ce].length}),r.jsxs(qn.Fragment,{children:[r.jsx("tr",{className:"group-header-row primary",onClick:()=>gt(re),children:r.jsx("td",{colSpan:f.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content",children:[r.jsx("span",{className:"expand-icon",children:le?r.jsx(Io,{size:14}):r.jsx(io,{size:14})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[x(me),":"]})," ",Q]}),r.jsxs("span",{className:"group-badge",children:[Se," items"]})]})})}),le&&(J.type==="flat"?J.rows.map(ce=>{R++;const je=parseInt(ce.total_steps||0),Ie=parseInt(ce.done_steps||0),ue=je>0?Math.round(Ie/je*100):0;return _t(ce,R,ue)}):J.keys.map(ce=>{const je=J.groups[ce],Ie=`p:${Q}|s:${ce}`,ue=Te[Ie]!==!1;return r.jsxs(qn.Fragment,{children:[r.jsx("tr",{className:"group-header-row secondary",onClick:()=>gt(Ie),children:r.jsx("td",{colSpan:f.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content secondary-content",style:{paddingLeft:"24px"},children:[r.jsx("span",{className:"expand-icon",children:ue?r.jsx(Io,{size:12}):r.jsx(io,{size:12})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[x(q),":"]})," ",ce]}),r.jsxs("span",{className:"group-badge secondary-badge",children:[je.length," items"]})]})})}),ue&&je.map(dt=>{R++;const Wr=parseInt(dt.total_steps||0),Cn=parseInt(dt.done_steps||0),Nt=Wr>0?Math.round(Cn/Wr*100):0;return _t(dt,R,Nt)})]},Ie)}))]},re)})})()})]})}),r.jsxs("div",{className:"pagination-bar",children:[r.jsxs("div",{className:"pagination-info",children:[r.jsx("span",{className:"row-count",children:Sr===0?"No records":`Showing ${Zt+1}–${Nn} of ${Sr} records`}),r.jsxs("div",{className:"page-size-control",children:[r.jsx("span",{children:"Rows per page"}),r.jsx("select",{value:be,onChange:v=>Da(v.target.value),children:sh.map(v=>r.jsx("option",{value:v,children:v},v))})]})]}),r.jsxs("div",{className:"pagination-nav",children:[r.jsx("button",{className:"pg-btn",onClick:()=>F(1),disabled:ht===1,title:"First page",children:r.jsx(pg,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>F(v=>Math.max(1,v-1)),disabled:ht===1,title:"Previous page",children:r.jsx(Ep,{size:14})}),ae().map(v=>r.jsx("button",{className:`pg-btn pg-num ${v===ht?"active":""}`,onClick:()=>F(v),children:v},v)),r.jsx("button",{className:"pg-btn",onClick:()=>F(v=>Math.min(It,v+1)),disabled:ht===It,title:"Next page",children:r.jsx(io,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>F(It),disabled:ht===It,title:"Last page",children:r.jsx(fg,{size:14})})]})]}),j&&r.jsx("div",{className:"modal-overlay open",onClick:v=>{v.target.className==="modal-overlay open"&&N(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Order: ",j.order_number," — Line: ",j.line_item_number," (PO: ",j.po_number||"N/A",")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>N(null),children:r.jsx(vn,{size:18})})]}),r.jsxs("form",{onSubmit:kn,className:"modal-body",children:[V&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(Ao,{size:16}),r.jsx("span",{children:V})]}),O&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(zs,{size:16}),r.jsx("span",{children:O})]}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",name:"planned_dispatch_date",value:M.planned_dispatch_date,onChange:St,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",name:"mounting_start_date",value:M.mounting_start_date,onChange:St,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",name:"mounting_complete_date",value:M.mounting_complete_date,onChange:St,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",name:"wiring_assigned_date",value:M.wiring_assigned_date,onChange:St,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",name:"wiring_expected_date",value:M.wiring_expected_date,onChange:St,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",name:"expected_qc_date",value:M.expected_qc_date,onChange:St,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Overall Planning Status"}),r.jsxs("select",{name:"status",value:M.status,onChange:St,className:"form-select",children:[r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",name:"qc_date",value:M.qc_date,onChange:St,className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>N(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Save Planning Changes"})]})]})]})}),Y.length>0&&r.jsx("div",{className:"bulk-actions-banner",children:r.jsxs("div",{className:"bulk-actions-content",children:[r.jsxs("span",{className:"bulk-count",children:[r.jsx("strong",{children:Y.length})," items selected"]}),r.jsxs("div",{className:"bulk-buttons",children:[r.jsx("button",{className:"btn-bulk-edit",onClick:()=>{ve({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),Z(!0)},children:"Bulk Edit Parameters"}),r.jsx("button",{className:"btn-bulk-clear",onClick:()=>E([]),children:"Deselect All"})]})]})}),$&&r.jsx("div",{className:"modal-overlay open",onClick:v=>{v.target.className==="modal-overlay open"&&Z(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"560px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Updating ",Y.length," selected line items"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>Z(!1),children:r.jsx(vn,{size:18})})]}),r.jsxs("form",{onSubmit:He,className:"modal-body",children:[V&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(Ao,{size:16}),r.jsx("span",{children:V})]}),O&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(zs,{size:16}),r.jsx("span",{children:O})]}),r.jsx("p",{className:"bulk-instructions",children:"Enter values or select options for parameters you want to update for all selected items. Blank fields will remain unchanged."}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",value:oe.planned_dispatch_date,onChange:v=>ve({...oe,planned_dispatch_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",value:oe.mounting_start_date,onChange:v=>ve({...oe,mounting_start_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",value:oe.mounting_complete_date,onChange:v=>ve({...oe,mounting_complete_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",value:oe.wiring_assigned_date,onChange:v=>ve({...oe,wiring_assigned_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",value:oe.wiring_expected_date,onChange:v=>ve({...oe,wiring_expected_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",value:oe.expected_qc_date,onChange:v=>ve({...oe,expected_qc_date:v.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planning Status"}),r.jsxs("select",{value:oe.status,onChange:v=>ve({...oe,status:v.target.value}),className:"form-select",children:[r.jsx("option",{value:"",children:"Leave unchanged"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",value:oe.qc_date,onChange:v=>ve({...oe,qc_date:v.target.value}),className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>Z(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Apply Bulk Changes"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function dh(){const[e,t]=p.useState(()=>localStorage.getItem("erp_company_name")||"Vyom ERP"),[n,a]=p.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing"),[o,l]=p.useState(()=>localStorage.getItem("erp_timezone")||"IST (UTC+05:30)"),[s,i]=p.useState(()=>localStorage.getItem("erp_default_page_size")||"20"),[d,u]=p.useState(()=>localStorage.getItem("erp_double_grouping")!=="false"),[h,m]=p.useState(()=>localStorage.getItem("erp_auto_qc_calc")==="true"),[y,w]=p.useState(()=>localStorage.getItem("erp_planning_fs_default")==="true"),[_,S]=p.useState("1"),[z,x]=p.useState(!0),[f,c]=p.useState(""),[k,I]=p.useState(!1),[D,C]=p.useState(!1),L=localStorage.getItem("token"),[P,g]=p.useState("general"),[T,j]=p.useState(!1),[N,M]=p.useState(!1),[A,V]=p.useState(""),[U,O]=p.useState(!1);p.useEffect(()=>{fetch(window.API_BASE+"/api/system-settings",{headers:{Authorization:`Bearer ${L}`}}).then($=>$.json()).then($=>{$.order_number_start&&S($.order_number_start),x(!!$._orders_exist)}).catch(()=>{})},[L]);const K=async()=>{c(""),C(!1);const $=parseInt(_);if(isNaN($)||$<1){c("Please enter a valid positive number.");return}I(!0);try{const Z=await fetch(window.API_BASE+"/api/system-settings",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${L}`},body:JSON.stringify({order_number_start:$})}),se=await Z.json();Z.ok?(C(!0),setTimeout(()=>C(!1),3e3)):c(se.error||"Failed to save.")}catch{c("Network error.")}finally{I(!1)}},Y=async $=>{$.preventDefault(),j(!0),M(!1),setTimeout(()=>{localStorage.setItem("erp_company_name",e),localStorage.setItem("erp_system_title",n),localStorage.setItem("erp_timezone",o),localStorage.setItem("erp_default_page_size",s),localStorage.setItem("erp_double_grouping",d?"true":"false"),localStorage.setItem("erp_auto_qc_calc",h?"true":"false"),localStorage.setItem("erp_planning_fs_default",y?"true":"false"),j(!1),M(!0),window.dispatchEvent(new CustomEvent("erpSettingsUpdated")),setTimeout(()=>M(!1),3e3)},800)},E=$=>{window.confirm(`Are you sure you want to run: "${$}"? This action cannot be undone.`)&&(O(!0),V(""),setTimeout(()=>{O(!1),$==="Clear Activity Logs"?V("Activity logs cleared successfully (simulated)."):$==="Reset Database"?V("Database reset and re-seeded successfully."):$==="Backup Database"&&V("Database backup generated: vyom_erp_backup_"+new Date().toISOString().split("T")[0]+".sql"),setTimeout(()=>V(""),5e3)},1200))};return r.jsxs("div",{style:{padding:"24px"},className:"settings-container",children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Es,{size:22,style:{color:"#f59e0b"}}),"Administration Settings"]})}),r.jsxs("div",{className:"settings-layout",children:[r.jsxs("div",{className:"settings-tabs",children:[r.jsxs("button",{className:`tab-btn ${P==="general"?"active":""}`,onClick:()=>g("general"),children:[r.jsx(Tg,{size:14}),"General Setup"]}),r.jsxs("button",{className:`tab-btn ${P==="workflow"?"active":""}`,onClick:()=>g("workflow"),children:[r.jsx(Es,{size:14}),"Workflow & Features"]}),r.jsxs("button",{className:`tab-btn ${P==="maintenance"?"active":""}`,onClick:()=>g("maintenance"),children:[r.jsx(Pg,{size:14}),"System Maintenance"]})]}),r.jsxs("div",{className:"settings-content",children:[P==="general"&&r.jsxs(r.Fragment,{children:[r.jsxs("form",{onSubmit:Y,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"General System Configurations"}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Company Name (Logo Text)"}),r.jsx("input",{type:"text",value:e,onChange:$=>t($.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"This label appears on the top-left logo header."})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"System/Factory Title"}),r.jsx("input",{type:"text",value:n,onChange:$=>a($.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"Descriptive subtitle shown next to the logo."})]}),r.jsxs("div",{className:"form-row",children:[r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"System Timezone"}),r.jsxs("select",{value:o,onChange:$=>l($.target.value),children:[r.jsx("option",{value:"IST (UTC+05:30)",children:"India Standard Time (IST)"}),r.jsx("option",{value:"UTC",children:"Coordinated Universal Time (UTC)"}),r.jsx("option",{value:"EST (UTC-05:00)",children:"Eastern Standard Time (EST)"}),r.jsx("option",{value:"GMT",children:"Greenwich Mean Time (GMT)"})]})]}),r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"Default Page Size"}),r.jsxs("select",{value:s,onChange:$=>i($.target.value),children:[r.jsx("option",{value:"10",children:"10 Rows per page"}),r.jsx("option",{value:"20",children:"20 Rows per page"}),r.jsx("option",{value:"50",children:"50 Rows per page"}),r.jsx("option",{value:"100",children:"100 Rows per page"})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:T,children:[T?r.jsx(Ht,{size:14,className:"spin"}):r.jsx(Dl,{size:14}),T?"Saving...":"Save Settings"]}),N&&r.jsxs("span",{className:"success-msg",children:[r.jsx(Ya,{size:14})," Settings updated successfully!"]})]})]}),r.jsxs("div",{style:{marginTop:"28px",padding:"20px 24px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px"},children:[r.jsxs("h3",{style:{margin:"0 0 6px 0",color:"var(--text)",fontSize:"15px",display:"flex",alignItems:"center",gap:"8px"},children:[r.jsx(yg,{size:16,style:{color:"#f59e0b"}}),"Order Number Sequence"]}),r.jsxs("p",{style:{margin:"0 0 16px 0",color:"var(--text3)",fontSize:"13px"},children:["Set the starting order number for this system. ",r.jsx("strong",{style:{color:"#f59e0b"},children:"Once the first order is created, this setting is permanently locked."})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",background:"var(--bg3)",border:`1px solid ${z?"var(--border)":"#f59e0b"}`,borderRadius:"8px",padding:"8px 14px"},children:[r.jsxs("span",{style:{color:"var(--text3)",fontSize:"13px",whiteSpace:"nowrap"},children:["ORD-",new Date().getFullYear(),"-"]}),r.jsx("input",{type:"number",min:"1",value:_,onChange:$=>{S($.target.value),c("")},disabled:z,style:{width:"90px",background:"transparent",border:"none",outline:"none",color:z?"var(--text3)":"var(--text)",fontSize:"15px",fontWeight:"700",cursor:z?"not-allowed":"text"}})]}),z?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",color:"#94a3b8",fontSize:"13px"},children:[r.jsx(nn,{size:14}),"Locked — orders already exist"]}):r.jsxs("button",{type:"button",onClick:K,disabled:k,style:{display:"flex",alignItems:"center",gap:"6px",background:"#f59e0b",color:"#000",border:"none",borderRadius:"8px",padding:"9px 18px",fontWeight:"600",fontSize:"13px",cursor:"pointer"},children:[k?r.jsx(Ht,{size:13,className:"spin"}):r.jsx(Dl,{size:13}),k?"Saving...":"Set Starting Number"]}),D&&r.jsxs("span",{style:{display:"flex",alignItems:"center",gap:"6px",color:"#10b981",fontSize:"13px"},children:[r.jsx(Ya,{size:14})," Saved! Next order will be ORD-",new Date().getFullYear(),"-",String(_).padStart(4,"0")]})]}),f&&r.jsx("p",{style:{margin:"10px 0 0",color:"#ef4444",fontSize:"12px"},children:f})]})]}),P==="workflow"&&r.jsxs("form",{onSubmit:Y,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"Planning Module & Workflow Toggles"}),r.jsxs("div",{className:"toggle-group",children:[r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"enableDoubleGrouping",checked:d,onChange:$=>u($.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"enableDoubleGrouping",children:"Enable Double Grouping Filter"}),r.jsx("span",{className:"toggle-desc",children:"Allows planning board users to apply a secondary group parameter simultaneously."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"autoQCFromSteps",checked:h,onChange:$=>m($.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"autoQCFromSteps",children:"Auto-calculate QC Status"}),r.jsx("span",{className:"toggle-desc",children:"Automatically update line item QC status to completed when all QC department steps are checked off."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"planningFullscreenDefault",checked:y,onChange:$=>w($.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"planningFullscreenDefault",children:"Planning Board Fullscreen by Default"}),r.jsx("span",{className:"toggle-desc",children:"Loads the Planning Module in fullscreen mode automatically."})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:T,children:[T?r.jsx(Ht,{size:14,className:"spin"}):r.jsx(Dl,{size:14}),T?"Saving...":"Save Settings"]}),N&&r.jsxs("span",{className:"success-msg",children:[r.jsx(Ya,{size:14})," Workflow updated successfully!"]})]})]}),P==="maintenance"&&r.jsxs("div",{className:"settings-form",children:[r.jsx("h3",{className:"section-title text-danger",children:"System Operations & Diagnostics"}),r.jsx("p",{className:"danger-notice",children:"WARNING: The operations below are administrative privileges. Running them can modify systemic operational states or reset logging indices."}),r.jsxs("div",{className:"maintenance-actions",children:[r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Database Backup"}),r.jsx("p",{children:"Generate a complete SQL schema and data export dump for emergency recovery."})]}),r.jsx("button",{onClick:()=>E("Backup Database"),className:"maint-btn secondary",disabled:U,children:"Backup DB"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Clear Activity Logs"}),r.jsx("p",{children:"Trims or wipes the system activity logger history database to conserve resources."})]}),r.jsx("button",{onClick:()=>E("Clear Activity Logs"),className:"maint-btn warning",disabled:U,children:"Wipe Logs"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Factory Reset ERP"}),r.jsx("p",{children:"Re-seeds and formats databases to standard template values (removes testing orders)."})]}),r.jsx("button",{onClick:()=>E("Reset Database"),className:"maint-btn danger",disabled:U,children:"Factory Reset"})]})]}),U&&r.jsxs("div",{className:"maintenance-loader",children:[r.jsx(Ht,{size:18,className:"spin"})," Running operations..."]}),A&&r.jsxs("div",{className:"maintenance-result",children:[r.jsx(Ya,{size:14})," ",A]})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const tc={Urgent:{color:"#ef4444",bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.3)"},High:{color:"#f59e0b",bg:"rgba(245,158,11,0.12)",border:"rgba(245,158,11,0.3)"},Medium:{color:"#3b82f6",bg:"rgba(59,130,246,0.12)",border:"rgba(59,130,246,0.3)"},Low:{color:"#6b7280",bg:"rgba(107,114,128,0.12)",border:"rgba(107,114,128,0.3)"}},Bo={done:{label:"Done",color:"#10b981",bg:"rgba(16,185,129,0.12)",icon:"✓"},inprogress:{label:"In Progress",color:"#f59e0b",bg:"rgba(245,158,11,0.12)",icon:"◉"},pending:{label:"Pending",color:"#6b7280",bg:"rgba(107,114,128,0.12)",icon:"○"},blocked:{label:"Blocked",color:"#ef4444",bg:"rgba(239,68,68,0.12)",icon:"✕"},review:{label:"Review",color:"#8b5cf6",bg:"rgba(139,92,246,0.12)",icon:"⟳"}},ch={Design:"#6366f1",Purchase:"#f59e0b",Stores:"#10b981",Production:"#3b82f6",QC:"#8b5cf6",Dispatch:"#ec4899",Accounts:"#14b8a6",Sales:"#f97316"};function uh({step:e,onStatusChange:t,canEdit:n}){const a=Bo[e.status]||Bo.pending;return r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:20,background:a.bg,border:`1px solid ${a.color}33`,fontSize:11,color:a.color,fontWeight:600},children:[r.jsx("span",{children:a.icon}),r.jsx("span",{children:e.name}),n&&r.jsxs("select",{value:e.status,onChange:o=>t(e.id,o.target.value),onClick:o=>o.stopPropagation(),style:{background:"transparent",border:"none",color:a.color,fontSize:10,cursor:"pointer",outline:"none",padding:0},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]})]})}function ph({unit:e,dept:t,onStepStatusChange:n,users:a,currentUser:o}){const[l,s]=p.useState(!1),i=e.dept_steps||[],d=i.filter(w=>w.status==="done").length,u=d===i.length&&i.length>0,h=i.some(w=>w.status==="blocked"),m=w=>{var _,S,z;return["admin","manager"].includes((_=o.role)==null?void 0:_.toLowerCase())||((S=w.dept)==null?void 0:S.toLowerCase())===((z=o.role)==null?void 0:z.toLowerCase())},y=h?"var(--red)":u?"var(--green)":"transparent";return r.jsxs(r.Fragment,{children:[r.jsxs("tr",{onClick:()=>s(w=>!w),style:{cursor:"pointer",borderLeft:`3px solid ${y}`,background:l?"var(--bg3)":"transparent",transition:"background 0.15s"},className:"worklist-row",children:[r.jsxs("td",{style:{padding:"10px 14px"},children:[r.jsx("div",{style:{fontFamily:"monospace",fontWeight:700,color:"var(--text)",fontSize:13},children:e.order_number}),e.company_name&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:11,marginTop:2},children:[e.company_name,e.company_city?` · ${e.company_city}`:""]}),e.po_number&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:11,marginTop:1,fontFamily:"monospace"},children:["PO: ",e.po_number]}),e.reference_number&&r.jsxs("div",{style:{color:"#f59e0b",fontSize:10,marginTop:1,fontWeight:600},children:["Ref: ",e.reference_number]})]}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"monospace",fontWeight:700,color:"var(--text)",fontSize:13},children:e.unit_serial}),r.jsxs("td",{style:{padding:"10px 14px",color:"var(--text2)",fontSize:12},children:[e.material_description,e.part_number&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:10,marginTop:2},children:["Part: ",e.part_number]})]}),r.jsx("td",{style:{padding:"10px 14px"},children:(()=>{const w=tc[e.priority]||tc.Medium;return r.jsx("span",{style:{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:w.bg,color:w.color,border:`1px solid ${w.border}`,textTransform:"uppercase",letterSpacing:.5},children:e.priority})})()}),r.jsx("td",{style:{padding:"10px 14px",fontSize:11,color:"var(--text2)"},children:e.delivery_date?new Date(e.delivery_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"N/A"}),r.jsx("td",{style:{padding:"10px 14px"},children:r.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:i.length===0?r.jsx("span",{style:{color:"#475569",fontSize:11,fontStyle:"italic"},children:"No steps"}):i.map(w=>r.jsx(uh,{step:w,canEdit:m(w),onStatusChange:(_,S)=>n(e.unit_id,_,S)},w.id))})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:u?"var(--green)":h?"var(--red)":"var(--text2)"},children:[u?r.jsx(zs,{size:13}):h?r.jsx(Ao,{size:13}):r.jsx(Dp,{size:13}),d,"/",i.length]})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{color:"var(--text3)",display:"inline-flex",alignItems:"center"},children:l?r.jsx(Io,{size:14}):r.jsx(io,{size:14})})})]}),l&&i.length>0&&r.jsx("tr",{style:{background:"var(--bg3)"},children:r.jsx("td",{colSpan:8,style:{padding:"12px 24px 16px 24px"},children:r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:i.map(w=>{const _=Bo[w.status]||Bo.pending,S=a.find(z=>z.id===w.assigned_user_id);return r.jsxs("div",{style:{background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[r.jsxs("div",{children:[r.jsx("div",{style:{fontWeight:600,color:"var(--text)",fontSize:13},children:w.name}),w.notes&&r.jsx("div",{style:{color:"var(--text3)",fontSize:11,marginTop:2,fontStyle:"italic"},children:w.notes}),S&&r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4,marginTop:4,color:"var(--green)",fontSize:11},children:[r.jsx(rl,{size:10}),S.username]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[w.updated&&r.jsx("span",{style:{color:"var(--text3)",fontSize:10},children:w.updated}),m(w)?r.jsxs("select",{value:w.status,onChange:z=>n(e.unit_id,w.id,z.target.value),style:{background:_.bg,border:`1px solid ${_.color}44`,color:_.color,fontSize:11,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontWeight:600,outline:"none"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("span",{style:{background:_.bg,border:`1px solid ${_.color}44`,color:_.color,fontSize:11,borderRadius:6,padding:"4px 8px",fontWeight:600},children:_.label})]})]},w.id)})})})})]})}function fh({dept:e}){var L;const[t,n]=p.useState([]),[a,o]=p.useState([]),[l,s]=p.useState(!0),[i,d]=p.useState(!1),[u,h]=p.useState("all"),[m,y]=p.useState(""),w=localStorage.getItem("token"),_=JSON.parse(localStorage.getItem("user")||"{}");["admin","manager",e==null?void 0:e.toLowerCase()].includes((L=_.role)==null?void 0:L.toLowerCase());const S=ch[e]||"#6366f1",z=React.useRef(null);p.useEffect(()=>{const P=z.current;if(!P)return;let g=!1,T,j;const N=U=>{["INPUT","SELECT","OPTION","BUTTON","A","TH"].includes(U.target.tagName)||U.target.closest("th")||U.target.closest("button")||(g=!0,P.classList.add("active-drag"),T=U.pageX-P.offsetLeft,j=P.scrollLeft)},M=()=>{g=!1,P.classList.remove("active-drag")},A=()=>{g=!1,P.classList.remove("active-drag")},V=U=>{if(!g)return;U.preventDefault();const K=(U.pageX-P.offsetLeft-T)*1.5;P.scrollLeft=j-K};return P.addEventListener("mousedown",N),P.addEventListener("mouseleave",M),P.addEventListener("mouseup",A),P.addEventListener("mousemove",V),()=>{P.removeEventListener("mousedown",N),P.removeEventListener("mouseleave",M),P.removeEventListener("mouseup",A),P.removeEventListener("mousemove",V)}},[]);const x=p.useCallback(async(P=!1)=>{P?d(!0):s(!0);try{const[g,T]=await Promise.all([fetch(`${window.API_BASE}/api/dept-worklist/${encodeURIComponent(e)}`,{headers:{Authorization:`Bearer ${w}`}}),fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${w}`}})]);g.ok&&n(await g.json()),T.ok&&o(await T.json())}finally{s(!1),d(!1)}},[e,w]);p.useEffect(()=>{x()},[x]),p.useEffect(()=>{const P=()=>x(!0);return window.addEventListener("orderUpdated",P),()=>window.removeEventListener("orderUpdated",P)},[x]);const f=async(P,g,T)=>{try{(await fetch(`${window.API_BASE}/api/units/${P}/steps/${g}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify({status:T})})).ok&&(n(N=>N.map(M=>M.unit_id!==P?M:{...M,dept_steps:(M.dept_steps||[]).map(A=>A.id===g?{...A,status:T}:A)})),window.dispatchEvent(new CustomEvent("orderUpdated")))}catch(j){console.error("Failed to update step",j)}},c=t.filter(P=>{if(m.trim()!==""){const g=m.trim().toLowerCase().split(/\s+/),T=(P.unit_serial||"").toLowerCase(),j=(P.order_number||"").toLowerCase(),N=(P.material_description||"").toLowerCase(),M=(P.company_name||"").toLowerCase(),A=(P.reference_number||"").toLowerCase(),V=(P.po_number||"").toLowerCase();if(!g.every(O=>T.includes(O)||j.includes(O)||N.includes(O)||M.includes(O)||A.includes(O)||V.includes(O)))return!1}if(u==="done"){const g=P.dept_steps||[];return g.length>0&&g.every(T=>T.status==="done")}if(u==="inprogress")return(P.dept_steps||[]).some(T=>T.status==="inprogress");if(u==="pending"){const g=P.dept_steps||[];return g.every(T=>T.status==="pending")||g.length===0}return!0}),k=t.length,I=t.filter(P=>(P.dept_steps||[]).every(g=>g.status==="done")&&(P.dept_steps||[]).length>0).length,D=t.filter(P=>(P.dept_steps||[]).some(g=>g.status==="inprogress")).length,C=t.filter(P=>(P.dept_steps||[]).some(g=>g.status==="blocked")).length;return l?r.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:300,gap:16},children:[r.jsx("div",{style:{width:48,height:48,border:`3px solid ${S}33`,borderTopColor:S,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:14},children:["Loading ",e," worklist..."]}),r.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}):r.jsxs("div",{style:{padding:"4px 0"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12},children:[r.jsx("div",{style:{display:"flex",alignItems:"center",gap:12},children:r.jsxs("div",{children:[r.jsxs("h2",{style:{margin:0,color:"var(--text)",fontSize:20,fontWeight:800},children:[e," Worklist"]}),r.jsx("div",{style:{color:"var(--text3)",fontSize:12,marginTop:2},children:e==="Sales"?`${k} unit${k!==1?"s":""} total in system`:`${k} unit${k!==1?"s":""} currently in ${e}`})]})}),r.jsxs("button",{onClick:()=>x(!0),disabled:i,style:{display:"flex",alignItems:"center",gap:6,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:12,borderRadius:8,padding:"7px 14px",cursor:"pointer",transition:"all 0.2s"},children:[r.jsx(Ht,{size:13,style:{animation:i?"spin 0.8s linear infinite":"none"}}),"Refresh"]})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:12,marginBottom:20},children:[{label:"Total Units",value:k,color:S},{label:"In Progress",value:D,color:"#f59e0b"},{label:"Completed",value:I,color:"#10b981"},{label:"Blocked",value:C,color:"#ef4444"}].map(P=>r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",textAlign:"center",borderTop:`2px solid ${P.color}55`},children:[r.jsx("div",{style:{fontSize:24,fontWeight:800,color:P.color},children:P.value}),r.jsx("div",{style:{fontSize:11,color:"var(--text3)",marginTop:2,textTransform:"uppercase",letterSpacing:.5},children:P.label})]},P.label))}),r.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"},children:[r.jsx("input",{type:"text",placeholder:"Search by unit ID, order, item, client...",value:m,onChange:P=>y(P.target.value),style:{flex:1,minWidth:220,background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,padding:"9px 14px",color:"var(--text)",fontSize:13,outline:"none",transition:"border-color 0.2s"},onFocus:P=>P.target.style.borderColor=S,onBlur:P=>P.target.style.borderColor="var(--border2)"}),r.jsx("div",{style:{display:"flex",background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,overflow:"hidden"},children:["all","pending","inprogress","done"].map(P=>r.jsx("button",{onClick:()=>h(P),style:{padding:"9px 14px",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:u===P?S:"transparent",color:u===P?"#fff":"var(--text2)",textTransform:"capitalize",transition:"all 0.15s"},children:P==="inprogress"?"In Progress":P.charAt(0).toUpperCase()+P.slice(1)},P))})]}),c.length===0&&r.jsxs("div",{style:{textAlign:"center",padding:"60px 20px",background:"var(--bg2)",borderRadius:12,border:"1px solid var(--border)"},children:[r.jsx("div",{style:{color:"var(--text)",fontWeight:700,fontSize:18,marginBottom:6},children:m||u!=="all"?"No matching units":e==="Sales"?"No units in the system":`No units in ${e}`}),r.jsx("div",{style:{color:"var(--text3)",fontSize:13},children:m||u!=="all"?"Try adjusting your search or filter.":`All ${e} tasks are complete or no units have been assigned yet.`})]}),c.length>0&&r.jsx("div",{ref:z,className:"worklist-table-container",style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,overflowX:"auto",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"var(--bg3)",borderBottom:"1px solid var(--border)"},children:[r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Order Info"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Unit ID"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Item Details"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Priority"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Delivery Date"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Tasks"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"center",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Progress"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"center",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Expand"})]})}),r.jsx("tbody",{children:c.map(P=>r.jsx(ph,{unit:P,dept:e,onStepStatusChange:f,users:a,currentUser:_},P.unit_id))})]})}),r.jsx("style",{children:`
        .worklist-row:hover { background: rgba(255,255,255,0.03) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .worklist-table-container {
          cursor: grab;
        }
        .worklist-table-container.active-drag {
          cursor: grabbing;
          user-select: none;
        }
      `})]})}const mh=["All","General","PO","Quotation","BOM","Drawing","QC Report","Dispatch Document","Photo"];function xh(){const[e,t]=p.useState({orders:[],documents:[]}),[n,a]=p.useState(""),[o,l]=p.useState("All"),[s,i]=p.useState("All"),[d,u]=p.useState(!1),[h,m]=p.useState({}),y=localStorage.getItem("token"),w=JSON.parse(localStorage.getItem("user")||"{}");p.useEffect(()=>{_()},[]);const _=async()=>{u(!0);try{const C=await fetch(window.API_BASE+"/api/documents/directory",{headers:{Authorization:`Bearer ${y}`}});if(C.ok){const L=await C.json();t(L)}}catch(C){console.error("Failed to fetch document directory",C)}finally{u(!1)}},S=async(C,L)=>{if(C.stopPropagation(),!!window.confirm("Are you sure you want to delete this document?"))try{const P=await fetch(`${window.API_BASE}/api/documents/${L}`,{method:"DELETE",headers:{Authorization:`Bearer ${y}`}});if(P.ok)t(g=>({...g,documents:g.documents.filter(T=>T.id!==L)}));else{const g=await P.json();alert(g.error||"Failed to delete document")}}catch(P){console.error("Delete error:",P),alert("Network error during deletion")}},z=C=>{switch(C==null?void 0:C.toLowerCase()){case"sales":return{background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",border:"1px solid rgba(59, 130, 246, 0.2)"};case"design":return{background:"rgba(167, 139, 250, 0.1)",color:"#a78bfa",border:"1px solid rgba(167, 139, 250, 0.2)"};case"purchase":return{background:"rgba(249, 115, 22, 0.1)",color:"#f97316",border:"1px solid rgba(249, 115, 22, 0.2)"};case"stores":return{background:"rgba(45, 212, 191, 0.1)",color:"#2dd4bf",border:"1px solid rgba(45, 212, 191, 0.2)"};case"production":return{background:"rgba(239, 68, 68, 0.1)",color:"#ef4444",border:"1px solid rgba(239, 68, 68, 0.2)"};case"qc":return{background:"rgba(34, 197, 94, 0.1)",color:"#22c55e",border:"1px solid rgba(34, 197, 94, 0.2)"};case"dispatch":return{background:"rgba(245, 158, 11, 0.1)",color:"#f59e0b",border:"1px solid rgba(245, 158, 11, 0.2)"};case"accounts":return{background:"rgba(14, 165, 233, 0.1)",color:"#0ea5e9",border:"1px solid rgba(14, 165, 233, 0.2)"};default:return{background:"rgba(255, 255, 255, 0.05)",color:"#888",border:"1px solid rgba(255, 255, 255, 0.1)"}}},x=C=>{switch(C==null?void 0:C.toUpperCase()){case"PO":return{background:"rgba(245, 158, 11, 0.15)",color:"#fbbf24",border:"1px solid rgba(245,158,11,0.3)"};case"QUOTATION":return{background:"rgba(59, 130, 246, 0.15)",color:"#60a5fa",border:"1px solid rgba(59,130,246,0.3)"};case"BOM":return{background:"rgba(45, 212, 191, 0.15)",color:"#2dd4bf",border:"1px solid rgba(45,212,191,0.3)"};case"DRAWING":return{background:"rgba(167, 139, 250, 0.15)",color:"#c084fc",border:"1px solid rgba(167,139,250,0.3)"};case"QC REPORT":return{background:"rgba(34, 197, 94, 0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.3)"};default:return{background:"rgba(255, 255, 255, 0.08)",color:"#e8eaf0",border:"1px solid rgba(255,255,255,0.15)"}}},f=C=>{const L=new Date(C);return L.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+" "+L.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},c=C=>{m(L=>({...L,[C]:!L[C]}))},k=e.documents.filter(C=>{if(o!=="All"&&C.uploader_role!==o||s!=="All"&&C.doc_type!==s)return!1;if(n.trim()!==""){const L=n.trim().toLowerCase().split(/\s+/),P=(C.file_name||"").toLowerCase(),g=(C.uploader_username||"").toLowerCase(),T=(C.source_details||"").toLowerCase(),j=e.orders.find(U=>Number(U.id)===Number(C.order_id)),N=((j==null?void 0:j.order_number)||"").toLowerCase(),M=((j==null?void 0:j.po_number)||"").toLowerCase(),A=((j==null?void 0:j.company_name)||"").toLowerCase(),V=((j==null?void 0:j.end_client_name)||"").toLowerCase();return L.every(U=>P.includes(U)||g.includes(U)||T.includes(U)||N.includes(U)||M.includes(U)||A.includes(U)||V.includes(U))}return!0}),I=e.orders.map(C=>{const L=k.filter(P=>Number(P.order_id)===Number(C.id));return{...C,docs:L}}).filter(C=>{if(n||o!=="All"||s!=="All"){if(n.trim()!==""){const L=n.trim().toLowerCase().split(/\s+/),P=(C.order_number||"").toLowerCase(),g=(C.po_number||"").toLowerCase(),T=(C.company_name||"").toLowerCase(),j=(C.end_client_name||"").toLowerCase();if(L.every(A=>P.includes(A)||g.includes(A)||T.includes(A)||j.includes(A))&&!(o!=="All"||s!=="All"))return!0}return C.docs.length>0}return!0}),D=k.length;return r.jsxs("div",{style:{padding:"24px"},children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px",fontSize:"18px",fontWeight:600},children:[r.jsx(hg,{size:22,style:{color:"#f59e0b"}}),"Order Document Directory"]})}),r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"16px",flex:1,minWidth:"300px"},children:[r.jsxs("div",{style:{position:"relative",flex:1,minWidth:"220px"},children:[r.jsx(Mr,{size:16,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("input",{type:"text",placeholder:"Search by file name, uploader, details...",value:n,onChange:C=>a(C.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 38px",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},className:"doc-search-input"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(zi,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:o,onChange:C=>l(C.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"All",children:"All Departments"}),r.jsx("option",{value:"Sales",children:"Sales"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"}),r.jsx("option",{value:"Accounts",children:"Accounts"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(Ro,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("select",{value:s,onChange:C=>i(C.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:mh.map(C=>r.jsx("option",{value:C==="All"?"All":C,children:C==="All"?"All Document Tags":C},C))}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[(n||o!=="All"||s!=="All")&&r.jsx("button",{onClick:()=>{a(""),l("All"),i("All")},style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"var(--red)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",transition:"all 0.2s"},className:"clear-btn",children:"Clear Filters"}),r.jsxs("button",{onClick:_,disabled:d,style:{background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",transition:"all 0.2s"},className:"refresh-btn",children:[r.jsx(Ht,{size:14,className:d?"spin":""}),d?"Loading...":"Refresh"]})]})]}),r.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:"16px",fontSize:"12px",color:"var(--text2)"},children:r.jsxs("div",{children:["Showing documents for ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:"600"},children:I.length})," orders"," ","(",r.jsx("span",{style:{color:"#fff",fontWeight:"600"},children:D})," documents match filters)"]})}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:d&&e.orders.length===0?r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"64px",textAlign:"center",color:"var(--text2)"},children:[r.jsx(Ht,{size:24,className:"spin",style:{margin:"0 auto 12px",color:"var(--accent)",display:"block"}}),"Loading Document Directory..."]}):I.length===0?r.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"48px",textAlign:"center",color:"var(--text3)"},children:"No orders or documents match the current filters."}):I.map(C=>{const L=h[C.id]!==!0,P=C.docs.length>0;return r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden",transition:"border-color 0.2s"},className:"order-card",children:[r.jsxs("div",{onClick:()=>c(C.id),style:{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:"rgba(255, 255, 255, 0.01)",borderBottom:L?"none":"1px solid var(--border)"},className:"order-card-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"},children:[r.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"13px",background:"rgba(245,158,11,0.1)",color:"var(--accent)",padding:"4px 10px",borderRadius:"6px",border:"1px solid rgba(245,158,11,0.2)",fontWeight:600},children:C.order_number}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px",fontFamily:"var(--font-mono)"},children:"PO:"}),r.jsx("span",{style:{color:"#fff",fontSize:"13px",fontFamily:"var(--font-mono)",fontWeight:500},children:C.po_number||"—"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px"},children:"Client:"}),r.jsx("span",{style:{color:"var(--text2)",fontSize:"13px",fontWeight:500},children:C.company_name||C.end_client_name||"—"})]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsxs("span",{style:{fontSize:"11px",background:P?"rgba(34, 197, 94, 0.1)":"rgba(255,255,255,0.03)",color:P?"var(--green)":"var(--text3)",padding:"3px 8px",borderRadius:"20px",border:P?"1px solid rgba(34, 197, 94, 0.2)":"1px solid var(--border)"},children:[C.docs.length," document",C.docs.length!==1?"s":""]}),r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px",transition:"transform 0.2s",transform:L?"rotate(0deg)":"rotate(180deg)"},children:"▼"})]})]}),!L&&r.jsx("div",{style:{padding:"20px"},children:P?r.jsx("div",{style:{overflowX:"auto"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"13px",textAlign:"left"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{borderBottom:"1px solid var(--border2)",color:"var(--text2)"},children:[r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Document Name"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Tag"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Uploading Dept"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Uploaded By"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Source Context"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Date & Time"}),r.jsx("th",{style:{padding:"10px 12px",textAlign:"right"},children:"Actions"})]})}),r.jsx("tbody",{children:C.docs.map(g=>{var M;const T=g.uploaded_by===w.id||["admin","manager"].includes((M=w.role)==null?void 0:M.toLowerCase()),j=g.file_path.split(/[\/\\]/).pop(),N=`${window.API_BASE}/uploads/${j}?token=${y}`;return r.jsxs("tr",{className:"doc-row",style:{borderBottom:"1px solid var(--border)"},children:[r.jsx("td",{style:{padding:"12px"},children:r.jsxs("a",{href:N,target:"_blank",rel:"noopener noreferrer",style:{color:"#fff",textDecoration:"none",display:"flex",alignItems:"center",gap:"8px",fontWeight:500},className:"doc-file-link",children:[r.jsx(Ro,{size:16,style:{color:"var(--text3)",flexShrink:0}}),r.jsx("span",{style:{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap",maxWidth:"280px"},title:g.file_name,children:g.file_name}),r.jsxs("span",{style:{fontSize:"10px",color:"var(--text3)"},children:["(",(g.file_size/1024).toFixed(1)," KB)"]})]})}),r.jsx("td",{style:{padding:"12px"},children:r.jsx("span",{style:{fontSize:"10px",fontWeight:600,padding:"2px 8px",borderRadius:"4px",textTransform:"uppercase",display:"inline-block",...x(g.doc_type)},children:g.doc_type})}),r.jsx("td",{style:{padding:"12px"},children:r.jsx("span",{style:{fontSize:"11px",fontWeight:500,padding:"2px 8px",borderRadius:"12px",display:"inline-block",...z(g.uploader_role)},children:g.uploader_role||"System"})}),r.jsx("td",{style:{padding:"12px",color:"var(--text2)"},children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(rl,{size:13,style:{color:"var(--text3)"}}),r.jsx("span",{children:g.uploader_username||"system"})]})}),r.jsx("td",{style:{padding:"12px",color:"var(--text2)",fontStyle:g.source_details==="Order Level"?"italic":"normal"},children:g.source_details}),r.jsx("td",{style:{padding:"12px",color:"var(--text3)",whiteSpace:"nowrap"},children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px"},children:[r.jsx(zp,{size:13}),r.jsx("span",{children:f(g.uploaded_at)})]})}),r.jsx("td",{style:{padding:"12px",textAlign:"right"},children:r.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[r.jsx("a",{href:N,download:g.file_name,style:{background:"rgba(255, 255, 255, 0.05)",border:"1px solid var(--border)",color:"var(--text2)",padding:"5px 8px",borderRadius:"6px",cursor:"pointer",display:"inline-flex",alignItems:"center"},title:"Download document",className:"action-icon-btn",children:r.jsx(gg,{size:13})}),T&&r.jsx("button",{onClick:A=>S(A,g.id),style:{background:"rgba(239, 68, 68, 0.05)",border:"1px solid rgba(239, 68, 68, 0.15)",color:"var(--red)",padding:"5px 8px",borderRadius:"6px",cursor:"pointer",display:"inline-flex",alignItems:"center"},title:"Delete document",className:"action-icon-btn delete-btn",children:r.jsx(Lp,{size:13})})]})})]},g.id)})})]})}):r.jsx("div",{style:{color:"var(--text3)",textAlign:"center",fontSize:"13px",padding:"12px 0",fontStyle:"italic"},children:"No documents associated with this order."})})]},C.id)})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const gh=({children:e})=>{const t=localStorage.getItem("token"),n=localStorage.getItem("user");return!t||t==="undefined"||t==="null"||!n?r.jsx(Np,{to:"/",replace:!0}):e};function hh(){const[e,t]=p.useState([]),[n,a]=p.useState([]),[o,l]=p.useState("all"),[s,i]=p.useState("table"),[d,u]=p.useState("Accept-Complete"),[h,m]=p.useState("Standard"),[y,w]=p.useState(null),[_,S]=p.useState(!1),[z,x]=p.useState(null),f=p.useRef(null),[c,k]=p.useState(null),[I,D]=p.useState(!0),[C,L]=p.useState(!1),[P,g]=p.useState(()=>window.innerWidth<1200),[T,j]=p.useState(""),[N,M]=p.useState([]),A=p.useRef(null),V=p.useRef(null),U=Ci(),[O,K]=p.useState(()=>JSON.parse(localStorage.getItem("user")||"{}")),Y=localStorage.getItem("token"),E=async(q,G={})=>{const Te=await fetch(q,{...G,headers:{...G.headers,Authorization:`Bearer ${Y}`}});return Te.status===401?(localStorage.removeItem("token"),localStorage.removeItem("user"),U("/"),null):Te};p.useEffect(()=>{se(),xe();const q=G=>{typeof G.detail=="string"?i(G.detail):G.detail&&G.detail.view&&(i(G.detail.view),G.detail.orderId?(x(G.detail.orderId),f.current=G.detail.orderId):G.detail.orderId===null&&(x(null),f.current=null),G.detail.unitId?(V.current=G.detail.unitId,j(String(G.detail.unitId))):(V.current=null,j("")))};return window.addEventListener("setView",q),()=>window.removeEventListener("setView",q)},[]),p.useEffect(()=>{z?(Z(z),$(z)):(t([]),k(null))},[z]),p.useEffect(()=>{if(!c){j(""),A.current=null;return}if(A.current!==c.id){const q=c.units||[];V.current&&q.some(G=>G.id.toString()===V.current.toString())?j(V.current.toString()):q.length>0?j(q[0].id.toString()):j(""),V.current=null,A.current=c.id}else{const q=c.units||[];T&&!q.some(G=>G.id.toString()===T.toString())&&(q.length>0?j(q[0].id.toString()):j(""))}},[c,T]),p.useEffect(()=>{const q=T;q&&Y?fetch(`${window.API_BASE}/api/units/${q}/steps`,{headers:{Authorization:`Bearer ${Y}`}}).then(async G=>{G.ok&&M(await G.json())}).catch(console.error):M([])},[T,c,Y]),p.useEffect(()=>{const q=()=>{if(z){Z(z),$(z);const G=T;G&&Y&&fetch(`${window.API_BASE}/api/units/${G}/steps`,{headers:{Authorization:`Bearer ${Y}`}}).then(async Te=>{Te.ok&&M(await Te.json())}).catch(console.error)}};return window.addEventListener("orderUpdated",q),()=>window.removeEventListener("orderUpdated",q)},[z,T,c,Y]);const $=async q=>{if(Y)try{const G=await E(`${window.API_BASE}/api/orders/${q}`);G!=null&&G.ok&&k(await G.json())}catch(G){console.error("Failed to fetch order details",G)}},Z=async q=>{if(Y)try{const G=await E(`${window.API_BASE}/api/orders/${q}/steps`);G!=null&&G.ok&&t(await G.json())}catch(G){console.error("Failed to fetch steps",G)}},se=async()=>{if(Y)try{const q=await E(window.API_BASE+"/api/auth/profile");if(q!=null&&q.ok){const G=await q.json();K(G),localStorage.setItem("user",JSON.stringify(G))}}catch(q){console.error("Failed to sync profile",q)}},xe=async()=>{try{const q=await E(window.API_BASE+"/api/logs");if(q!=null&&q.ok){const G=await q.json();a(G.map(Te=>({time:Wn(new Date(Te.timestamp)),dept:Te.dept,text:Te.action_text,username:Te.username})))}}catch(q){console.error("Failed to fetch logs",q)}},oe=async(q,G,Te)=>{const $t=Te??f.current;try{const gt=await E(window.API_BASE+"/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dept:q,action_text:G,order_id:$t?parseInt($t):null})});xe()}catch(gt){console.error("Failed to log activity",gt)}},ve=()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),U("/")},B=q=>{q==="board"?(i("table"),x(null),f.current=null,k(null),t([]),l("all"),window.dispatchEvent(new CustomEvent("setView",{detail:{orderId:null}}))):i(q)},te=e.find(q=>q.id===y)||null,H=q=>{w(q),S(!0)},ge=()=>{S(!1)},ie=async q=>{try{const G=await fetch(`${window.API_BASE}/api/orders/${z}/steps/${y}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${Y}`},body:JSON.stringify(q)});if(G.ok){if(await Z(z),await $(z),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:z}})),te.special==="qc"&&q.status==="blocked"&&q.qcFailTarget){const Te=q.qcFailTarget==="production"?"QC FAIL → returned to Production for rework":"QC FAIL → returned to Design for re-check";oe("QC",Te,z)}return oe(te.dept,`"${te.name}" → ${q.status.toUpperCase()}${q.notes?" — "+q.notes:""}`,z),S(!1),null}else return(await G.json().catch(()=>({}))).error||"Failed to save step"}catch(G){return console.error("Failed to save step",G),"Network error — could not save step"}},F=async q=>{if(window.confirm("Are you sure you want to permanently delete this task from the order's flow?"))try{(await fetch(`${window.API_BASE}/api/orders/${z}/steps/${q}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok?(S(!1),Z(z),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:z}}))):alert("Failed to delete step")}catch(G){console.error(G)}},be=q=>{if(!["Admin","Manager","Accounts","Production"].includes(O.role)){alert("Unauthorized to change BOM status");return}u(q),oe("Stores",`BOM status updated → ${q}`,z)},Pe=q=>{if(!["Admin","Manager","Design"].includes(O.role)){alert("Unauthorized to change Design classification");return}m(q),oe("Design",`Design classified as ${q}`,z)},me=e.filter(q=>!q.order_unit_id),it=[...N,...me];return r.jsxs("div",{className:"app-container",children:[r.jsx(Og,{onLogout:ve,onToggleSidebar:()=>g(q=>!q),sidenavCollapsed:P}),r.jsxs("div",{className:"app",children:[(!I||s!=="planning")&&r.jsx($g,{steps:it,currentFilter:o,onFilterDept:l,bomState:d,onSetBomState:be,designType:h,onSetDesignType:Pe,currentView:s,onSetView:B,userRole:O.role,collapsed:P}),r.jsxs("main",{className:"main",children:[s!=="planning"&&r.jsx(qg,{steps:it,currentFilter:o,selectedOrder:c}),r.jsxs("div",{className:"flow-header",children:[r.jsx("div",{className:"flow-title",children:s==="board"?"Board":s==="planning"?"Planning Board":s==="flow"?"Process Flow":s==="table"?"Table View":s==="orders"?"Order Directory":s==="documents"?"Document Directory":s==="new-order"?"New Order":s==="import"?"Import Orders":s==="masters"?"Masters":s==="logs"?"System Logs":s==="worklist"?`${O.role} Worklist`:"User Management"}),["board","flow","table"].includes(s)&&r.jsxs("div",{className:"view-toggle",children:[r.jsx("button",{className:`vbtn${s==="board"?" active":""}`,onClick:()=>i("board"),children:"Board"}),r.jsx("button",{className:`vbtn${s==="flow"?" active":""}`,onClick:()=>i("flow"),children:"Flow"}),r.jsx("button",{className:`vbtn${s==="table"?" active":""}`,onClick:()=>i("table"),children:"Table"})]}),s==="planning"&&r.jsxs("button",{className:`vbtn${I?" active":""}`,onClick:()=>D(!I),style:{display:"flex",alignItems:"center",gap:"6px"},children:[I?r.jsx(Cg,{size:13}):r.jsx(_g,{size:13}),I?"Exit Fullscreen":"Fullscreen"]})]}),s==="board"?r.jsx(Yg,{currentFilter:o,userRole:O.role,onSetView:i}):s==="planning"?["Admin","Manager","Planning"].includes(O.role)?r.jsx(ih,{}):r.jsx("div",{style:{padding:40,textAlign:"center",color:"var(--text3)"},children:"Unauthorized to view the Planning Module."}):s==="flow"?z?r.jsx(Hg,{steps:e,currentFilter:o,onOpenModal:H,onSetView:i,userRole:O.role,selectedOrderId:z,selectedOrder:c,onStepsChanged:()=>Z(z),selectedUnitId:T,setSelectedUnitId:j,unitSteps:N,setUnitSteps:M}):r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"Please select an order from the Header dropdown to view its Process Flow."}):s==="table"?r.jsx(Gg,{currentFilter:o,onSetView:B}):s==="orders"?r.jsx(rh,{initialSelectedId:z}):s==="documents"?r.jsx(xh,{}):s==="new-order"?r.jsx(eh,{onOrderCreated:()=>{i("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):s==="import"?r.jsx(Ap,{onImportComplete:()=>{i("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):s==="masters"?r.jsx(oh,{}):s==="logs"?r.jsx(lh,{}):s==="settings"?r.jsx(dh,{}):s==="worklist"?r.jsx(fh,{dept:O.role}):r.jsx(Zg,{})]}),s!=="planning"&&O.role==="Admin"&&r.jsx(Jg,{selectedStep:te,activityLog:n,selectedOrder:c,isOpen:C,onToggle:()=>L(q=>!q)})]}),r.jsx(Kg,{step:te,isOpen:_,onClose:ge,onSave:ie,onDelete:F,userRole:O.role,selectedOrder:c})]})}function vh(){return r.jsx(lg,{children:r.jsxs(ng,{children:[r.jsx(so,{path:"/",element:r.jsx(Xg,{})}),r.jsx(so,{path:"/dashboard",element:r.jsx(gh,{children:r.jsx(hh,{})})}),r.jsx(so,{path:"*",element:r.jsx(Np,{to:"/",replace:!0})})]})})}window.API_BASE="";const{fetch:yh}=window;window.fetch=async(...e)=>{var n;const t=await yh(...e);if(t.status===401){const a=typeof e[0]=="string"?e[0]:(n=e[0])==null?void 0:n.url;a&&!a.includes("/api/auth/login")&&(localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.href="/")}return t};Ll.createRoot(document.getElementById("root")).render(r.jsx(qn.StrictMode,{children:r.jsx(vh,{})}));
