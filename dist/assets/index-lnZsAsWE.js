function Lp(e,t){for(var n=0;n<t.length;n++){const a=t[n];if(typeof a!="string"&&!Array.isArray(a)){for(const o in a)if(o!=="default"&&!(o in e)){const l=Object.getOwnPropertyDescriptor(a,o);l&&Object.defineProperty(e,o,l.get?l:{enumerable:!0,get:()=>a[o]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const s of l.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function a(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}})();function Rp(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Zd={exports:{}},Io={},ec={exports:{}},ie={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var da=Symbol.for("react.element"),Op=Symbol.for("react.portal"),Bp=Symbol.for("react.fragment"),Mp=Symbol.for("react.strict_mode"),$p=Symbol.for("react.profiler"),Fp=Symbol.for("react.provider"),Up=Symbol.for("react.context"),Wp=Symbol.for("react.forward_ref"),qp=Symbol.for("react.suspense"),Vp=Symbol.for("react.memo"),Hp=Symbol.for("react.lazy"),Ni=Symbol.iterator;function Qp(e){return e===null||typeof e!="object"?null:(e=Ni&&e[Ni]||e["@@iterator"],typeof e=="function"?e:null)}var tc={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},rc=Object.assign,nc={};function pn(e,t,n){this.props=e,this.context=t,this.refs=nc,this.updater=n||tc}pn.prototype.isReactComponent={};pn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};pn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function ac(){}ac.prototype=pn.prototype;function _s(e,t,n){this.props=e,this.context=t,this.refs=nc,this.updater=n||tc}var Ns=_s.prototype=new ac;Ns.constructor=_s;rc(Ns,pn.prototype);Ns.isPureReactComponent=!0;var Ci=Array.isArray,oc=Object.prototype.hasOwnProperty,Cs={current:null},lc={key:!0,ref:!0,__self:!0,__source:!0};function sc(e,t,n){var a,o={},l=null,s=null;if(t!=null)for(a in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(l=""+t.key),t)oc.call(t,a)&&!lc.hasOwnProperty(a)&&(o[a]=t[a]);var i=arguments.length-2;if(i===1)o.children=n;else if(1<i){for(var d=Array(i),u=0;u<i;u++)d[u]=arguments[u+2];o.children=d}if(e&&e.defaultProps)for(a in i=e.defaultProps,i)o[a]===void 0&&(o[a]=i[a]);return{$$typeof:da,type:e,key:l,ref:s,props:o,_owner:Cs.current}}function Yp(e,t){return{$$typeof:da,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function zs(e){return typeof e=="object"&&e!==null&&e.$$typeof===da}function Gp(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var zi=/\/+/g;function Zo(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Gp(""+e.key):t.toString(36)}function Ua(e,t,n,a,o){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(l){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case da:case Op:s=!0}}if(s)return s=e,o=o(s),e=a===""?"."+Zo(s,0):a,Ci(o)?(n="",e!=null&&(n=e.replace(zi,"$&/")+"/"),Ua(o,t,n,"",function(u){return u})):o!=null&&(zs(o)&&(o=Yp(o,n+(!o.key||s&&s.key===o.key?"":(""+o.key).replace(zi,"$&/")+"/")+e)),t.push(o)),1;if(s=0,a=a===""?".":a+":",Ci(e))for(var i=0;i<e.length;i++){l=e[i];var d=a+Zo(l,i);s+=Ua(l,t,n,d,o)}else if(d=Qp(e),typeof d=="function")for(e=d.call(e),i=0;!(l=e.next()).done;)l=l.value,d=a+Zo(l,i++),s+=Ua(l,t,n,d,o);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function ka(e,t,n){if(e==null)return e;var a=[],o=0;return Ua(e,a,"","",function(l){return t.call(n,l,o++)}),a}function Jp(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Xe={current:null},Wa={transition:null},Kp={ReactCurrentDispatcher:Xe,ReactCurrentBatchConfig:Wa,ReactCurrentOwner:Cs};function ic(){throw Error("act(...) is not supported in production builds of React.")}ie.Children={map:ka,forEach:function(e,t,n){ka(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return ka(e,function(){t++}),t},toArray:function(e){return ka(e,function(t){return t})||[]},only:function(e){if(!zs(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};ie.Component=pn;ie.Fragment=Bp;ie.Profiler=$p;ie.PureComponent=_s;ie.StrictMode=Mp;ie.Suspense=qp;ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Kp;ie.act=ic;ie.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var a=rc({},e.props),o=e.key,l=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,s=Cs.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(d in t)oc.call(t,d)&&!lc.hasOwnProperty(d)&&(a[d]=t[d]===void 0&&i!==void 0?i[d]:t[d])}var d=arguments.length-2;if(d===1)a.children=n;else if(1<d){i=Array(d);for(var u=0;u<d;u++)i[u]=arguments[u+2];a.children=i}return{$$typeof:da,type:e.type,key:o,ref:l,props:a,_owner:s}};ie.createContext=function(e){return e={$$typeof:Up,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Fp,_context:e},e.Consumer=e};ie.createElement=sc;ie.createFactory=function(e){var t=sc.bind(null,e);return t.type=e,t};ie.createRef=function(){return{current:null}};ie.forwardRef=function(e){return{$$typeof:Wp,render:e}};ie.isValidElement=zs;ie.lazy=function(e){return{$$typeof:Hp,_payload:{_status:-1,_result:e},_init:Jp}};ie.memo=function(e,t){return{$$typeof:Vp,type:e,compare:t===void 0?null:t}};ie.startTransition=function(e){var t=Wa.transition;Wa.transition={};try{e()}finally{Wa.transition=t}};ie.unstable_act=ic;ie.useCallback=function(e,t){return Xe.current.useCallback(e,t)};ie.useContext=function(e){return Xe.current.useContext(e)};ie.useDebugValue=function(){};ie.useDeferredValue=function(e){return Xe.current.useDeferredValue(e)};ie.useEffect=function(e,t){return Xe.current.useEffect(e,t)};ie.useId=function(){return Xe.current.useId()};ie.useImperativeHandle=function(e,t,n){return Xe.current.useImperativeHandle(e,t,n)};ie.useInsertionEffect=function(e,t){return Xe.current.useInsertionEffect(e,t)};ie.useLayoutEffect=function(e,t){return Xe.current.useLayoutEffect(e,t)};ie.useMemo=function(e,t){return Xe.current.useMemo(e,t)};ie.useReducer=function(e,t,n){return Xe.current.useReducer(e,t,n)};ie.useRef=function(e){return Xe.current.useRef(e)};ie.useState=function(e){return Xe.current.useState(e)};ie.useSyncExternalStore=function(e,t,n){return Xe.current.useSyncExternalStore(e,t,n)};ie.useTransition=function(){return Xe.current.useTransition()};ie.version="18.3.1";ec.exports=ie;var p=ec.exports;const ro=Rp(p),Xp=Lp({__proto__:null,default:ro},[p]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zp=p,ef=Symbol.for("react.element"),tf=Symbol.for("react.fragment"),rf=Object.prototype.hasOwnProperty,nf=Zp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,af={key:!0,ref:!0,__self:!0,__source:!0};function dc(e,t,n){var a,o={},l=null,s=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(s=t.ref);for(a in t)rf.call(t,a)&&!af.hasOwnProperty(a)&&(o[a]=t[a]);if(e&&e.defaultProps)for(a in t=e.defaultProps,t)o[a]===void 0&&(o[a]=t[a]);return{$$typeof:ef,type:e,key:l,ref:s,props:o,_owner:nf.current}}Io.Fragment=tf;Io.jsx=dc;Io.jsxs=dc;Zd.exports=Io;var r=Zd.exports,zl={},cc={exports:{}},ft={},uc={exports:{}},pc={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(B,V){var C=B.length;B.push(V);e:for(;0<C;){var $=C-1>>>1,O=B[$];if(0<o(O,V))B[$]=V,B[C]=O,C=$;else break e}}function n(B){return B.length===0?null:B[0]}function a(B){if(B.length===0)return null;var V=B[0],C=B.pop();if(C!==V){B[0]=C;e:for(var $=0,O=B.length,de=O>>>1;$<de;){var ue=2*($+1)-1,ae=B[ue],me=ue+1,se=B[me];if(0>o(ae,C))me<O&&0>o(se,ae)?(B[$]=se,B[me]=C,$=me):(B[$]=ae,B[ue]=C,$=ue);else if(me<O&&0>o(se,C))B[$]=se,B[me]=C,$=me;else break e}}return V}function o(B,V){var C=B.sortIndex-V.sortIndex;return C!==0?C:B.id-V.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;e.unstable_now=function(){return l.now()}}else{var s=Date,i=s.now();e.unstable_now=function(){return s.now()-i}}var d=[],u=[],h=1,g=null,v=3,w=!1,N=!1,S=!1,E=typeof setTimeout=="function"?setTimeout:null,m=typeof clearTimeout=="function"?clearTimeout:null,f=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function c(B){for(var V=n(u);V!==null;){if(V.callback===null)a(u);else if(V.startTime<=B)a(u),V.sortIndex=V.expirationTime,t(d,V);else break;V=n(u)}}function j(B){if(S=!1,c(B),!N)if(n(d)!==null)N=!0,Q(T);else{var V=n(u);V!==null&&M(j,V.startTime-B)}}function T(B,V){N=!1,S&&(S=!1,m(D),D=-1),w=!0;var C=v;try{for(c(V),g=n(d);g!==null&&(!(g.expirationTime>V)||B&&!P());){var $=g.callback;if(typeof $=="function"){g.callback=null,v=g.priorityLevel;var O=$(g.expirationTime<=V);V=e.unstable_now(),typeof O=="function"?g.callback=O:g===n(d)&&a(d),c(V)}else a(d);g=n(d)}if(g!==null)var de=!0;else{var ue=n(u);ue!==null&&M(j,ue.startTime-V),de=!1}return de}finally{g=null,v=C,w=!1}}var I=!1,x=null,D=-1,U=5,k=-1;function P(){return!(e.unstable_now()-k<U)}function _(){if(x!==null){var B=e.unstable_now();k=B;var V=!0;try{V=x(!0,B)}finally{V?z():(I=!1,x=null)}}else I=!1}var z;if(typeof f=="function")z=function(){f(_)};else if(typeof MessageChannel<"u"){var F=new MessageChannel,A=F.port2;F.port1.onmessage=_,z=function(){A.postMessage(null)}}else z=function(){E(_,0)};function Q(B){x=B,I||(I=!0,z())}function M(B,V){D=E(function(){B(e.unstable_now())},V)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(B){B.callback=null},e.unstable_continueExecution=function(){N||w||(N=!0,Q(T))},e.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):U=0<B?Math.floor(1e3/B):5},e.unstable_getCurrentPriorityLevel=function(){return v},e.unstable_getFirstCallbackNode=function(){return n(d)},e.unstable_next=function(B){switch(v){case 1:case 2:case 3:var V=3;break;default:V=v}var C=v;v=V;try{return B()}finally{v=C}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(B,V){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var C=v;v=B;try{return V()}finally{v=C}},e.unstable_scheduleCallback=function(B,V,C){var $=e.unstable_now();switch(typeof C=="object"&&C!==null?(C=C.delay,C=typeof C=="number"&&0<C?$+C:$):C=$,B){case 1:var O=-1;break;case 2:O=250;break;case 5:O=1073741823;break;case 4:O=1e4;break;default:O=5e3}return O=C+O,B={id:h++,callback:V,priorityLevel:B,startTime:C,expirationTime:O,sortIndex:-1},C>$?(B.sortIndex=C,t(u,B),n(d)===null&&B===n(u)&&(S?(m(D),D=-1):S=!0,M(j,C-$))):(B.sortIndex=O,t(d,B),N||w||(N=!0,Q(T))),B},e.unstable_shouldYield=P,e.unstable_wrapCallback=function(B){var V=v;return function(){var C=v;v=V;try{return B.apply(this,arguments)}finally{v=C}}}})(pc);uc.exports=pc;var of=uc.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var lf=p,pt=of;function q(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var fc=new Set,qn={};function Tr(e,t){nn(e,t),nn(e+"Capture",t)}function nn(e,t){for(qn[e]=t,e=0;e<t.length;e++)fc.add(t[e])}var Ht=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),El=Object.prototype.hasOwnProperty,sf=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Ei={},Di={};function df(e){return El.call(Di,e)?!0:El.call(Ei,e)?!1:sf.test(e)?Di[e]=!0:(Ei[e]=!0,!1)}function cf(e,t,n,a){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return a?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function uf(e,t,n,a){if(t===null||typeof t>"u"||cf(e,t,n,a))return!0;if(a)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Ze(e,t,n,a,o,l,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=a,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=s}var Ve={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){Ve[e]=new Ze(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];Ve[t]=new Ze(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){Ve[e]=new Ze(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){Ve[e]=new Ze(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){Ve[e]=new Ze(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){Ve[e]=new Ze(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){Ve[e]=new Ze(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){Ve[e]=new Ze(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){Ve[e]=new Ze(e,5,!1,e.toLowerCase(),null,!1,!1)});var Es=/[\-:]([a-z])/g;function Ds(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Es,Ds);Ve[t]=new Ze(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Es,Ds);Ve[t]=new Ze(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Es,Ds);Ve[t]=new Ze(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){Ve[e]=new Ze(e,1,!1,e.toLowerCase(),null,!1,!1)});Ve.xlinkHref=new Ze("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){Ve[e]=new Ze(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ps(e,t,n,a){var o=Ve.hasOwnProperty(t)?Ve[t]:null;(o!==null?o.type!==0:a||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(uf(t,n,o,a)&&(n=null),a||o===null?df(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=n===null?o.type===3?!1:"":n:(t=o.attributeName,a=o.attributeNamespace,n===null?e.removeAttribute(t):(o=o.type,n=o===3||o===4&&n===!0?"":""+n,a?e.setAttributeNS(a,t,n):e.setAttribute(t,n))))}var Jt=lf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Sa=Symbol.for("react.element"),Br=Symbol.for("react.portal"),Mr=Symbol.for("react.fragment"),Ts=Symbol.for("react.strict_mode"),Dl=Symbol.for("react.profiler"),xc=Symbol.for("react.provider"),mc=Symbol.for("react.context"),Is=Symbol.for("react.forward_ref"),Pl=Symbol.for("react.suspense"),Tl=Symbol.for("react.suspense_list"),As=Symbol.for("react.memo"),Xt=Symbol.for("react.lazy"),gc=Symbol.for("react.offscreen"),Pi=Symbol.iterator;function yn(e){return e===null||typeof e!="object"?null:(e=Pi&&e[Pi]||e["@@iterator"],typeof e=="function"?e:null)}var ze=Object.assign,el;function Cn(e){if(el===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);el=t&&t[1]||""}return`
`+el+e}var tl=!1;function rl(e,t){if(!e||tl)return"";tl=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(u){var a=u}Reflect.construct(e,[],t)}else{try{t.call()}catch(u){a=u}e.call(t.prototype)}else{try{throw Error()}catch(u){a=u}e()}}catch(u){if(u&&a&&typeof u.stack=="string"){for(var o=u.stack.split(`
`),l=a.stack.split(`
`),s=o.length-1,i=l.length-1;1<=s&&0<=i&&o[s]!==l[i];)i--;for(;1<=s&&0<=i;s--,i--)if(o[s]!==l[i]){if(s!==1||i!==1)do if(s--,i--,0>i||o[s]!==l[i]){var d=`
`+o[s].replace(" at new "," at ");return e.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",e.displayName)),d}while(1<=s&&0<=i);break}}}finally{tl=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Cn(e):""}function pf(e){switch(e.tag){case 5:return Cn(e.type);case 16:return Cn("Lazy");case 13:return Cn("Suspense");case 19:return Cn("SuspenseList");case 0:case 2:case 15:return e=rl(e.type,!1),e;case 11:return e=rl(e.type.render,!1),e;case 1:return e=rl(e.type,!0),e;default:return""}}function Il(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Mr:return"Fragment";case Br:return"Portal";case Dl:return"Profiler";case Ts:return"StrictMode";case Pl:return"Suspense";case Tl:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case mc:return(e.displayName||"Context")+".Consumer";case xc:return(e._context.displayName||"Context")+".Provider";case Is:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case As:return t=e.displayName||null,t!==null?t:Il(e.type)||"Memo";case Xt:t=e._payload,e=e._init;try{return Il(e(t))}catch{}}return null}function ff(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Il(t);case 8:return t===Ts?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function fr(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function hc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function xf(e){var t=hc(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),a=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var o=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(s){a=""+s,l.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return a},setValue:function(s){a=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function _a(e){e._valueTracker||(e._valueTracker=xf(e))}function vc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),a="";return e&&(a=hc(e)?e.checked?"true":"false":e.value),e=a,e!==n?(t.setValue(e),!0):!1}function no(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Al(e,t){var n=t.checked;return ze({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Ti(e,t){var n=t.defaultValue==null?"":t.defaultValue,a=t.checked!=null?t.checked:t.defaultChecked;n=fr(t.value!=null?t.value:n),e._wrapperState={initialChecked:a,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function yc(e,t){t=t.checked,t!=null&&Ps(e,"checked",t,!1)}function Ll(e,t){yc(e,t);var n=fr(t.value),a=t.type;if(n!=null)a==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(a==="submit"||a==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Rl(e,t.type,n):t.hasOwnProperty("defaultValue")&&Rl(e,t.type,fr(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ii(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var a=t.type;if(!(a!=="submit"&&a!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Rl(e,t,n){(t!=="number"||no(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var zn=Array.isArray;function Kr(e,t,n,a){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&a&&(e[n].defaultSelected=!0)}else{for(n=""+fr(n),t=null,o=0;o<e.length;o++){if(e[o].value===n){e[o].selected=!0,a&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function Ol(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(q(91));return ze({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ai(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(q(92));if(zn(n)){if(1<n.length)throw Error(q(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:fr(n)}}function bc(e,t){var n=fr(t.value),a=fr(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),a!=null&&(e.defaultValue=""+a)}function Li(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function jc(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Bl(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?jc(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Na,wc=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,a,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,a,o)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Na=Na||document.createElement("div"),Na.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Na.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Vn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Ln={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},mf=["Webkit","ms","Moz","O"];Object.keys(Ln).forEach(function(e){mf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Ln[t]=Ln[e]})});function kc(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Ln.hasOwnProperty(e)&&Ln[e]?(""+t).trim():t+"px"}function Sc(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var a=n.indexOf("--")===0,o=kc(n,t[n],a);n==="float"&&(n="cssFloat"),a?e.setProperty(n,o):e[n]=o}}var gf=ze({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ml(e,t){if(t){if(gf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(q(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(q(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(q(61))}if(t.style!=null&&typeof t.style!="object")throw Error(q(62))}}function $l(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Fl=null;function Ls(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ul=null,Xr=null,Zr=null;function Ri(e){if(e=pa(e)){if(typeof Ul!="function")throw Error(q(280));var t=e.stateNode;t&&(t=Bo(t),Ul(e.stateNode,e.type,t))}}function _c(e){Xr?Zr?Zr.push(e):Zr=[e]:Xr=e}function Nc(){if(Xr){var e=Xr,t=Zr;if(Zr=Xr=null,Ri(e),t)for(e=0;e<t.length;e++)Ri(t[e])}}function Cc(e,t){return e(t)}function zc(){}var nl=!1;function Ec(e,t,n){if(nl)return e(t,n);nl=!0;try{return Cc(e,t,n)}finally{nl=!1,(Xr!==null||Zr!==null)&&(zc(),Nc())}}function Hn(e,t){var n=e.stateNode;if(n===null)return null;var a=Bo(n);if(a===null)return null;n=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(q(231,t,typeof n));return n}var Wl=!1;if(Ht)try{var bn={};Object.defineProperty(bn,"passive",{get:function(){Wl=!0}}),window.addEventListener("test",bn,bn),window.removeEventListener("test",bn,bn)}catch{Wl=!1}function hf(e,t,n,a,o,l,s,i,d){var u=Array.prototype.slice.call(arguments,3);try{t.apply(n,u)}catch(h){this.onError(h)}}var Rn=!1,ao=null,oo=!1,ql=null,vf={onError:function(e){Rn=!0,ao=e}};function yf(e,t,n,a,o,l,s,i,d){Rn=!1,ao=null,hf.apply(vf,arguments)}function bf(e,t,n,a,o,l,s,i,d){if(yf.apply(this,arguments),Rn){if(Rn){var u=ao;Rn=!1,ao=null}else throw Error(q(198));oo||(oo=!0,ql=u)}}function Ir(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Dc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Oi(e){if(Ir(e)!==e)throw Error(q(188))}function jf(e){var t=e.alternate;if(!t){if(t=Ir(e),t===null)throw Error(q(188));return t!==e?null:e}for(var n=e,a=t;;){var o=n.return;if(o===null)break;var l=o.alternate;if(l===null){if(a=o.return,a!==null){n=a;continue}break}if(o.child===l.child){for(l=o.child;l;){if(l===n)return Oi(o),e;if(l===a)return Oi(o),t;l=l.sibling}throw Error(q(188))}if(n.return!==a.return)n=o,a=l;else{for(var s=!1,i=o.child;i;){if(i===n){s=!0,n=o,a=l;break}if(i===a){s=!0,a=o,n=l;break}i=i.sibling}if(!s){for(i=l.child;i;){if(i===n){s=!0,n=l,a=o;break}if(i===a){s=!0,a=l,n=o;break}i=i.sibling}if(!s)throw Error(q(189))}}if(n.alternate!==a)throw Error(q(190))}if(n.tag!==3)throw Error(q(188));return n.stateNode.current===n?e:t}function Pc(e){return e=jf(e),e!==null?Tc(e):null}function Tc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Tc(e);if(t!==null)return t;e=e.sibling}return null}var Ic=pt.unstable_scheduleCallback,Bi=pt.unstable_cancelCallback,wf=pt.unstable_shouldYield,kf=pt.unstable_requestPaint,Te=pt.unstable_now,Sf=pt.unstable_getCurrentPriorityLevel,Rs=pt.unstable_ImmediatePriority,Ac=pt.unstable_UserBlockingPriority,lo=pt.unstable_NormalPriority,_f=pt.unstable_LowPriority,Lc=pt.unstable_IdlePriority,Ao=null,Rt=null;function Nf(e){if(Rt&&typeof Rt.onCommitFiberRoot=="function")try{Rt.onCommitFiberRoot(Ao,e,void 0,(e.current.flags&128)===128)}catch{}}var Dt=Math.clz32?Math.clz32:Ef,Cf=Math.log,zf=Math.LN2;function Ef(e){return e>>>=0,e===0?32:31-(Cf(e)/zf|0)|0}var Ca=64,za=4194304;function En(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function so(e,t){var n=e.pendingLanes;if(n===0)return 0;var a=0,o=e.suspendedLanes,l=e.pingedLanes,s=n&268435455;if(s!==0){var i=s&~o;i!==0?a=En(i):(l&=s,l!==0&&(a=En(l)))}else s=n&~o,s!==0?a=En(s):l!==0&&(a=En(l));if(a===0)return 0;if(t!==0&&t!==a&&!(t&o)&&(o=a&-a,l=t&-t,o>=l||o===16&&(l&4194240)!==0))return t;if(a&4&&(a|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=a;0<t;)n=31-Dt(t),o=1<<n,a|=e[n],t&=~o;return a}function Df(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Pf(e,t){for(var n=e.suspendedLanes,a=e.pingedLanes,o=e.expirationTimes,l=e.pendingLanes;0<l;){var s=31-Dt(l),i=1<<s,d=o[s];d===-1?(!(i&n)||i&a)&&(o[s]=Df(i,t)):d<=t&&(e.expiredLanes|=i),l&=~i}}function Vl(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Rc(){var e=Ca;return Ca<<=1,!(Ca&4194240)&&(Ca=64),e}function al(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ca(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Dt(t),e[t]=n}function Tf(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var a=e.eventTimes;for(e=e.expirationTimes;0<n;){var o=31-Dt(n),l=1<<o;t[o]=0,a[o]=-1,e[o]=-1,n&=~l}}function Os(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var a=31-Dt(n),o=1<<a;o&t|e[a]&t&&(e[a]|=t),n&=~o}}var ve=0;function Oc(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Bc,Bs,Mc,$c,Fc,Hl=!1,Ea=[],or=null,lr=null,sr=null,Qn=new Map,Yn=new Map,er=[],If="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Mi(e,t){switch(e){case"focusin":case"focusout":or=null;break;case"dragenter":case"dragleave":lr=null;break;case"mouseover":case"mouseout":sr=null;break;case"pointerover":case"pointerout":Qn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Yn.delete(t.pointerId)}}function jn(e,t,n,a,o,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:a,nativeEvent:l,targetContainers:[o]},t!==null&&(t=pa(t),t!==null&&Bs(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Af(e,t,n,a,o){switch(t){case"focusin":return or=jn(or,e,t,n,a,o),!0;case"dragenter":return lr=jn(lr,e,t,n,a,o),!0;case"mouseover":return sr=jn(sr,e,t,n,a,o),!0;case"pointerover":var l=o.pointerId;return Qn.set(l,jn(Qn.get(l)||null,e,t,n,a,o)),!0;case"gotpointercapture":return l=o.pointerId,Yn.set(l,jn(Yn.get(l)||null,e,t,n,a,o)),!0}return!1}function Uc(e){var t=br(e.target);if(t!==null){var n=Ir(t);if(n!==null){if(t=n.tag,t===13){if(t=Dc(n),t!==null){e.blockedOn=t,Fc(e.priority,function(){Mc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function qa(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Ql(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var a=new n.constructor(n.type,n);Fl=a,n.target.dispatchEvent(a),Fl=null}else return t=pa(n),t!==null&&Bs(t),e.blockedOn=n,!1;t.shift()}return!0}function $i(e,t,n){qa(e)&&n.delete(t)}function Lf(){Hl=!1,or!==null&&qa(or)&&(or=null),lr!==null&&qa(lr)&&(lr=null),sr!==null&&qa(sr)&&(sr=null),Qn.forEach($i),Yn.forEach($i)}function wn(e,t){e.blockedOn===t&&(e.blockedOn=null,Hl||(Hl=!0,pt.unstable_scheduleCallback(pt.unstable_NormalPriority,Lf)))}function Gn(e){function t(o){return wn(o,e)}if(0<Ea.length){wn(Ea[0],e);for(var n=1;n<Ea.length;n++){var a=Ea[n];a.blockedOn===e&&(a.blockedOn=null)}}for(or!==null&&wn(or,e),lr!==null&&wn(lr,e),sr!==null&&wn(sr,e),Qn.forEach(t),Yn.forEach(t),n=0;n<er.length;n++)a=er[n],a.blockedOn===e&&(a.blockedOn=null);for(;0<er.length&&(n=er[0],n.blockedOn===null);)Uc(n),n.blockedOn===null&&er.shift()}var en=Jt.ReactCurrentBatchConfig,io=!0;function Rf(e,t,n,a){var o=ve,l=en.transition;en.transition=null;try{ve=1,Ms(e,t,n,a)}finally{ve=o,en.transition=l}}function Of(e,t,n,a){var o=ve,l=en.transition;en.transition=null;try{ve=4,Ms(e,t,n,a)}finally{ve=o,en.transition=l}}function Ms(e,t,n,a){if(io){var o=Ql(e,t,n,a);if(o===null)xl(e,t,a,co,n),Mi(e,a);else if(Af(o,e,t,n,a))a.stopPropagation();else if(Mi(e,a),t&4&&-1<If.indexOf(e)){for(;o!==null;){var l=pa(o);if(l!==null&&Bc(l),l=Ql(e,t,n,a),l===null&&xl(e,t,a,co,n),l===o)break;o=l}o!==null&&a.stopPropagation()}else xl(e,t,a,null,n)}}var co=null;function Ql(e,t,n,a){if(co=null,e=Ls(a),e=br(e),e!==null)if(t=Ir(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Dc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return co=e,null}function Wc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Sf()){case Rs:return 1;case Ac:return 4;case lo:case _f:return 16;case Lc:return 536870912;default:return 16}default:return 16}}var rr=null,$s=null,Va=null;function qc(){if(Va)return Va;var e,t=$s,n=t.length,a,o="value"in rr?rr.value:rr.textContent,l=o.length;for(e=0;e<n&&t[e]===o[e];e++);var s=n-e;for(a=1;a<=s&&t[n-a]===o[l-a];a++);return Va=o.slice(e,1<a?1-a:void 0)}function Ha(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Da(){return!0}function Fi(){return!1}function xt(e){function t(n,a,o,l,s){this._reactName=n,this._targetInst=o,this.type=a,this.nativeEvent=l,this.target=s,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Da:Fi,this.isPropagationStopped=Fi,this}return ze(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Da)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Da)},persist:function(){},isPersistent:Da}),t}var fn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Fs=xt(fn),ua=ze({},fn,{view:0,detail:0}),Bf=xt(ua),ol,ll,kn,Lo=ze({},ua,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Us,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==kn&&(kn&&e.type==="mousemove"?(ol=e.screenX-kn.screenX,ll=e.screenY-kn.screenY):ll=ol=0,kn=e),ol)},movementY:function(e){return"movementY"in e?e.movementY:ll}}),Ui=xt(Lo),Mf=ze({},Lo,{dataTransfer:0}),$f=xt(Mf),Ff=ze({},ua,{relatedTarget:0}),sl=xt(Ff),Uf=ze({},fn,{animationName:0,elapsedTime:0,pseudoElement:0}),Wf=xt(Uf),qf=ze({},fn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Vf=xt(qf),Hf=ze({},fn,{data:0}),Wi=xt(Hf),Qf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Yf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Gf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Jf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Gf[e])?!!t[e]:!1}function Us(){return Jf}var Kf=ze({},ua,{key:function(e){if(e.key){var t=Qf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ha(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Yf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Us,charCode:function(e){return e.type==="keypress"?Ha(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ha(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Xf=xt(Kf),Zf=ze({},Lo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),qi=xt(Zf),ex=ze({},ua,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Us}),tx=xt(ex),rx=ze({},fn,{propertyName:0,elapsedTime:0,pseudoElement:0}),nx=xt(rx),ax=ze({},Lo,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),ox=xt(ax),lx=[9,13,27,32],Ws=Ht&&"CompositionEvent"in window,On=null;Ht&&"documentMode"in document&&(On=document.documentMode);var sx=Ht&&"TextEvent"in window&&!On,Vc=Ht&&(!Ws||On&&8<On&&11>=On),Vi=" ",Hi=!1;function Hc(e,t){switch(e){case"keyup":return lx.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Qc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var $r=!1;function ix(e,t){switch(e){case"compositionend":return Qc(t);case"keypress":return t.which!==32?null:(Hi=!0,Vi);case"textInput":return e=t.data,e===Vi&&Hi?null:e;default:return null}}function dx(e,t){if($r)return e==="compositionend"||!Ws&&Hc(e,t)?(e=qc(),Va=$s=rr=null,$r=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Vc&&t.locale!=="ko"?null:t.data;default:return null}}var cx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Qi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!cx[e.type]:t==="textarea"}function Yc(e,t,n,a){_c(a),t=uo(t,"onChange"),0<t.length&&(n=new Fs("onChange","change",null,n,a),e.push({event:n,listeners:t}))}var Bn=null,Jn=null;function ux(e){ou(e,0)}function Ro(e){var t=Wr(e);if(vc(t))return e}function px(e,t){if(e==="change")return t}var Gc=!1;if(Ht){var il;if(Ht){var dl="oninput"in document;if(!dl){var Yi=document.createElement("div");Yi.setAttribute("oninput","return;"),dl=typeof Yi.oninput=="function"}il=dl}else il=!1;Gc=il&&(!document.documentMode||9<document.documentMode)}function Gi(){Bn&&(Bn.detachEvent("onpropertychange",Jc),Jn=Bn=null)}function Jc(e){if(e.propertyName==="value"&&Ro(Jn)){var t=[];Yc(t,Jn,e,Ls(e)),Ec(ux,t)}}function fx(e,t,n){e==="focusin"?(Gi(),Bn=t,Jn=n,Bn.attachEvent("onpropertychange",Jc)):e==="focusout"&&Gi()}function xx(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ro(Jn)}function mx(e,t){if(e==="click")return Ro(t)}function gx(e,t){if(e==="input"||e==="change")return Ro(t)}function hx(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Tt=typeof Object.is=="function"?Object.is:hx;function Kn(e,t){if(Tt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),a=Object.keys(t);if(n.length!==a.length)return!1;for(a=0;a<n.length;a++){var o=n[a];if(!El.call(t,o)||!Tt(e[o],t[o]))return!1}return!0}function Ji(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ki(e,t){var n=Ji(e);e=0;for(var a;n;){if(n.nodeType===3){if(a=e+n.textContent.length,e<=t&&a>=t)return{node:n,offset:t-e};e=a}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ji(n)}}function Kc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Kc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Xc(){for(var e=window,t=no();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=no(e.document)}return t}function qs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function vx(e){var t=Xc(),n=e.focusedElem,a=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Kc(n.ownerDocument.documentElement,n)){if(a!==null&&qs(n)){if(t=a.start,e=a.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=n.textContent.length,l=Math.min(a.start,o);a=a.end===void 0?l:Math.min(a.end,o),!e.extend&&l>a&&(o=a,a=l,l=o),o=Ki(n,l);var s=Ki(n,a);o&&s&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),l>a?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var yx=Ht&&"documentMode"in document&&11>=document.documentMode,Fr=null,Yl=null,Mn=null,Gl=!1;function Xi(e,t,n){var a=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Gl||Fr==null||Fr!==no(a)||(a=Fr,"selectionStart"in a&&qs(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Mn&&Kn(Mn,a)||(Mn=a,a=uo(Yl,"onSelect"),0<a.length&&(t=new Fs("onSelect","select",null,t,n),e.push({event:t,listeners:a}),t.target=Fr)))}function Pa(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ur={animationend:Pa("Animation","AnimationEnd"),animationiteration:Pa("Animation","AnimationIteration"),animationstart:Pa("Animation","AnimationStart"),transitionend:Pa("Transition","TransitionEnd")},cl={},Zc={};Ht&&(Zc=document.createElement("div").style,"AnimationEvent"in window||(delete Ur.animationend.animation,delete Ur.animationiteration.animation,delete Ur.animationstart.animation),"TransitionEvent"in window||delete Ur.transitionend.transition);function Oo(e){if(cl[e])return cl[e];if(!Ur[e])return e;var t=Ur[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Zc)return cl[e]=t[n];return e}var eu=Oo("animationend"),tu=Oo("animationiteration"),ru=Oo("animationstart"),nu=Oo("transitionend"),au=new Map,Zi="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function mr(e,t){au.set(e,t),Tr(t,[e])}for(var ul=0;ul<Zi.length;ul++){var pl=Zi[ul],bx=pl.toLowerCase(),jx=pl[0].toUpperCase()+pl.slice(1);mr(bx,"on"+jx)}mr(eu,"onAnimationEnd");mr(tu,"onAnimationIteration");mr(ru,"onAnimationStart");mr("dblclick","onDoubleClick");mr("focusin","onFocus");mr("focusout","onBlur");mr(nu,"onTransitionEnd");nn("onMouseEnter",["mouseout","mouseover"]);nn("onMouseLeave",["mouseout","mouseover"]);nn("onPointerEnter",["pointerout","pointerover"]);nn("onPointerLeave",["pointerout","pointerover"]);Tr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Tr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Tr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Tr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Tr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Tr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Dn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),wx=new Set("cancel close invalid load scroll toggle".split(" ").concat(Dn));function ed(e,t,n){var a=e.type||"unknown-event";e.currentTarget=n,bf(a,t,void 0,e),e.currentTarget=null}function ou(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var a=e[n],o=a.event;a=a.listeners;e:{var l=void 0;if(t)for(var s=a.length-1;0<=s;s--){var i=a[s],d=i.instance,u=i.currentTarget;if(i=i.listener,d!==l&&o.isPropagationStopped())break e;ed(o,i,u),l=d}else for(s=0;s<a.length;s++){if(i=a[s],d=i.instance,u=i.currentTarget,i=i.listener,d!==l&&o.isPropagationStopped())break e;ed(o,i,u),l=d}}}if(oo)throw e=ql,oo=!1,ql=null,e}function ke(e,t){var n=t[es];n===void 0&&(n=t[es]=new Set);var a=e+"__bubble";n.has(a)||(lu(t,e,2,!1),n.add(a))}function fl(e,t,n){var a=0;t&&(a|=4),lu(n,e,a,t)}var Ta="_reactListening"+Math.random().toString(36).slice(2);function Xn(e){if(!e[Ta]){e[Ta]=!0,fc.forEach(function(n){n!=="selectionchange"&&(wx.has(n)||fl(n,!1,e),fl(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ta]||(t[Ta]=!0,fl("selectionchange",!1,t))}}function lu(e,t,n,a){switch(Wc(t)){case 1:var o=Rf;break;case 4:o=Of;break;default:o=Ms}n=o.bind(null,t,n,e),o=void 0,!Wl||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),a?o!==void 0?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):o!==void 0?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function xl(e,t,n,a,o){var l=a;if(!(t&1)&&!(t&2)&&a!==null)e:for(;;){if(a===null)return;var s=a.tag;if(s===3||s===4){var i=a.stateNode.containerInfo;if(i===o||i.nodeType===8&&i.parentNode===o)break;if(s===4)for(s=a.return;s!==null;){var d=s.tag;if((d===3||d===4)&&(d=s.stateNode.containerInfo,d===o||d.nodeType===8&&d.parentNode===o))return;s=s.return}for(;i!==null;){if(s=br(i),s===null)return;if(d=s.tag,d===5||d===6){a=l=s;continue e}i=i.parentNode}}a=a.return}Ec(function(){var u=l,h=Ls(n),g=[];e:{var v=au.get(e);if(v!==void 0){var w=Fs,N=e;switch(e){case"keypress":if(Ha(n)===0)break e;case"keydown":case"keyup":w=Xf;break;case"focusin":N="focus",w=sl;break;case"focusout":N="blur",w=sl;break;case"beforeblur":case"afterblur":w=sl;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":w=Ui;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":w=$f;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":w=tx;break;case eu:case tu:case ru:w=Wf;break;case nu:w=nx;break;case"scroll":w=Bf;break;case"wheel":w=ox;break;case"copy":case"cut":case"paste":w=Vf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":w=qi}var S=(t&4)!==0,E=!S&&e==="scroll",m=S?v!==null?v+"Capture":null:v;S=[];for(var f=u,c;f!==null;){c=f;var j=c.stateNode;if(c.tag===5&&j!==null&&(c=j,m!==null&&(j=Hn(f,m),j!=null&&S.push(Zn(f,j,c)))),E)break;f=f.return}0<S.length&&(v=new w(v,N,null,n,h),g.push({event:v,listeners:S}))}}if(!(t&7)){e:{if(v=e==="mouseover"||e==="pointerover",w=e==="mouseout"||e==="pointerout",v&&n!==Fl&&(N=n.relatedTarget||n.fromElement)&&(br(N)||N[Qt]))break e;if((w||v)&&(v=h.window===h?h:(v=h.ownerDocument)?v.defaultView||v.parentWindow:window,w?(N=n.relatedTarget||n.toElement,w=u,N=N?br(N):null,N!==null&&(E=Ir(N),N!==E||N.tag!==5&&N.tag!==6)&&(N=null)):(w=null,N=u),w!==N)){if(S=Ui,j="onMouseLeave",m="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(S=qi,j="onPointerLeave",m="onPointerEnter",f="pointer"),E=w==null?v:Wr(w),c=N==null?v:Wr(N),v=new S(j,f+"leave",w,n,h),v.target=E,v.relatedTarget=c,j=null,br(h)===u&&(S=new S(m,f+"enter",N,n,h),S.target=c,S.relatedTarget=E,j=S),E=j,w&&N)t:{for(S=w,m=N,f=0,c=S;c;c=Or(c))f++;for(c=0,j=m;j;j=Or(j))c++;for(;0<f-c;)S=Or(S),f--;for(;0<c-f;)m=Or(m),c--;for(;f--;){if(S===m||m!==null&&S===m.alternate)break t;S=Or(S),m=Or(m)}S=null}else S=null;w!==null&&td(g,v,w,S,!1),N!==null&&E!==null&&td(g,E,N,S,!0)}}e:{if(v=u?Wr(u):window,w=v.nodeName&&v.nodeName.toLowerCase(),w==="select"||w==="input"&&v.type==="file")var T=px;else if(Qi(v))if(Gc)T=gx;else{T=xx;var I=fx}else(w=v.nodeName)&&w.toLowerCase()==="input"&&(v.type==="checkbox"||v.type==="radio")&&(T=mx);if(T&&(T=T(e,u))){Yc(g,T,n,h);break e}I&&I(e,v,u),e==="focusout"&&(I=v._wrapperState)&&I.controlled&&v.type==="number"&&Rl(v,"number",v.value)}switch(I=u?Wr(u):window,e){case"focusin":(Qi(I)||I.contentEditable==="true")&&(Fr=I,Yl=u,Mn=null);break;case"focusout":Mn=Yl=Fr=null;break;case"mousedown":Gl=!0;break;case"contextmenu":case"mouseup":case"dragend":Gl=!1,Xi(g,n,h);break;case"selectionchange":if(yx)break;case"keydown":case"keyup":Xi(g,n,h)}var x;if(Ws)e:{switch(e){case"compositionstart":var D="onCompositionStart";break e;case"compositionend":D="onCompositionEnd";break e;case"compositionupdate":D="onCompositionUpdate";break e}D=void 0}else $r?Hc(e,n)&&(D="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(D="onCompositionStart");D&&(Vc&&n.locale!=="ko"&&($r||D!=="onCompositionStart"?D==="onCompositionEnd"&&$r&&(x=qc()):(rr=h,$s="value"in rr?rr.value:rr.textContent,$r=!0)),I=uo(u,D),0<I.length&&(D=new Wi(D,e,null,n,h),g.push({event:D,listeners:I}),x?D.data=x:(x=Qc(n),x!==null&&(D.data=x)))),(x=sx?ix(e,n):dx(e,n))&&(u=uo(u,"onBeforeInput"),0<u.length&&(h=new Wi("onBeforeInput","beforeinput",null,n,h),g.push({event:h,listeners:u}),h.data=x))}ou(g,t)})}function Zn(e,t,n){return{instance:e,listener:t,currentTarget:n}}function uo(e,t){for(var n=t+"Capture",a=[];e!==null;){var o=e,l=o.stateNode;o.tag===5&&l!==null&&(o=l,l=Hn(e,n),l!=null&&a.unshift(Zn(e,l,o)),l=Hn(e,t),l!=null&&a.push(Zn(e,l,o))),e=e.return}return a}function Or(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function td(e,t,n,a,o){for(var l=t._reactName,s=[];n!==null&&n!==a;){var i=n,d=i.alternate,u=i.stateNode;if(d!==null&&d===a)break;i.tag===5&&u!==null&&(i=u,o?(d=Hn(n,l),d!=null&&s.unshift(Zn(n,d,i))):o||(d=Hn(n,l),d!=null&&s.push(Zn(n,d,i)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var kx=/\r\n?/g,Sx=/\u0000|\uFFFD/g;function rd(e){return(typeof e=="string"?e:""+e).replace(kx,`
`).replace(Sx,"")}function Ia(e,t,n){if(t=rd(t),rd(e)!==t&&n)throw Error(q(425))}function po(){}var Jl=null,Kl=null;function Xl(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Zl=typeof setTimeout=="function"?setTimeout:void 0,_x=typeof clearTimeout=="function"?clearTimeout:void 0,nd=typeof Promise=="function"?Promise:void 0,Nx=typeof queueMicrotask=="function"?queueMicrotask:typeof nd<"u"?function(e){return nd.resolve(null).then(e).catch(Cx)}:Zl;function Cx(e){setTimeout(function(){throw e})}function ml(e,t){var n=t,a=0;do{var o=n.nextSibling;if(e.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(a===0){e.removeChild(o),Gn(t);return}a--}else n!=="$"&&n!=="$?"&&n!=="$!"||a++;n=o}while(n);Gn(t)}function ir(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ad(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var xn=Math.random().toString(36).slice(2),Lt="__reactFiber$"+xn,ea="__reactProps$"+xn,Qt="__reactContainer$"+xn,es="__reactEvents$"+xn,zx="__reactListeners$"+xn,Ex="__reactHandles$"+xn;function br(e){var t=e[Lt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Qt]||n[Lt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ad(e);e!==null;){if(n=e[Lt])return n;e=ad(e)}return t}e=n,n=e.parentNode}return null}function pa(e){return e=e[Lt]||e[Qt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Wr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(q(33))}function Bo(e){return e[ea]||null}var ts=[],qr=-1;function gr(e){return{current:e}}function Se(e){0>qr||(e.current=ts[qr],ts[qr]=null,qr--)}function we(e,t){qr++,ts[qr]=e.current,e.current=t}var xr={},Ge=gr(xr),rt=gr(!1),Nr=xr;function an(e,t){var n=e.type.contextTypes;if(!n)return xr;var a=e.stateNode;if(a&&a.__reactInternalMemoizedUnmaskedChildContext===t)return a.__reactInternalMemoizedMaskedChildContext;var o={},l;for(l in n)o[l]=t[l];return a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function nt(e){return e=e.childContextTypes,e!=null}function fo(){Se(rt),Se(Ge)}function od(e,t,n){if(Ge.current!==xr)throw Error(q(168));we(Ge,t),we(rt,n)}function su(e,t,n){var a=e.stateNode;if(t=t.childContextTypes,typeof a.getChildContext!="function")return n;a=a.getChildContext();for(var o in a)if(!(o in t))throw Error(q(108,ff(e)||"Unknown",o));return ze({},n,a)}function xo(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||xr,Nr=Ge.current,we(Ge,e),we(rt,rt.current),!0}function ld(e,t,n){var a=e.stateNode;if(!a)throw Error(q(169));n?(e=su(e,t,Nr),a.__reactInternalMemoizedMergedChildContext=e,Se(rt),Se(Ge),we(Ge,e)):Se(rt),we(rt,n)}var Ft=null,Mo=!1,gl=!1;function iu(e){Ft===null?Ft=[e]:Ft.push(e)}function Dx(e){Mo=!0,iu(e)}function hr(){if(!gl&&Ft!==null){gl=!0;var e=0,t=ve;try{var n=Ft;for(ve=1;e<n.length;e++){var a=n[e];do a=a(!0);while(a!==null)}Ft=null,Mo=!1}catch(o){throw Ft!==null&&(Ft=Ft.slice(e+1)),Ic(Rs,hr),o}finally{ve=t,gl=!1}}return null}var Vr=[],Hr=0,mo=null,go=0,mt=[],gt=0,Cr=null,Ut=1,Wt="";function vr(e,t){Vr[Hr++]=go,Vr[Hr++]=mo,mo=e,go=t}function du(e,t,n){mt[gt++]=Ut,mt[gt++]=Wt,mt[gt++]=Cr,Cr=e;var a=Ut;e=Wt;var o=32-Dt(a)-1;a&=~(1<<o),n+=1;var l=32-Dt(t)+o;if(30<l){var s=o-o%5;l=(a&(1<<s)-1).toString(32),a>>=s,o-=s,Ut=1<<32-Dt(t)+o|n<<o|a,Wt=l+e}else Ut=1<<l|n<<o|a,Wt=e}function Vs(e){e.return!==null&&(vr(e,1),du(e,1,0))}function Hs(e){for(;e===mo;)mo=Vr[--Hr],Vr[Hr]=null,go=Vr[--Hr],Vr[Hr]=null;for(;e===Cr;)Cr=mt[--gt],mt[gt]=null,Wt=mt[--gt],mt[gt]=null,Ut=mt[--gt],mt[gt]=null}var ut=null,ct=null,_e=!1,Et=null;function cu(e,t){var n=ht(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function sd(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ut=e,ct=ir(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ut=e,ct=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Cr!==null?{id:Ut,overflow:Wt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=ht(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ut=e,ct=null,!0):!1;default:return!1}}function rs(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ns(e){if(_e){var t=ct;if(t){var n=t;if(!sd(e,t)){if(rs(e))throw Error(q(418));t=ir(n.nextSibling);var a=ut;t&&sd(e,t)?cu(a,n):(e.flags=e.flags&-4097|2,_e=!1,ut=e)}}else{if(rs(e))throw Error(q(418));e.flags=e.flags&-4097|2,_e=!1,ut=e}}}function id(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ut=e}function Aa(e){if(e!==ut)return!1;if(!_e)return id(e),_e=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Xl(e.type,e.memoizedProps)),t&&(t=ct)){if(rs(e))throw uu(),Error(q(418));for(;t;)cu(e,t),t=ir(t.nextSibling)}if(id(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(q(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ct=ir(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ct=null}}else ct=ut?ir(e.stateNode.nextSibling):null;return!0}function uu(){for(var e=ct;e;)e=ir(e.nextSibling)}function on(){ct=ut=null,_e=!1}function Qs(e){Et===null?Et=[e]:Et.push(e)}var Px=Jt.ReactCurrentBatchConfig;function Sn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(q(309));var a=n.stateNode}if(!a)throw Error(q(147,e));var o=a,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(s){var i=o.refs;s===null?delete i[l]:i[l]=s},t._stringRef=l,t)}if(typeof e!="string")throw Error(q(284));if(!n._owner)throw Error(q(290,e))}return e}function La(e,t){throw e=Object.prototype.toString.call(t),Error(q(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function dd(e){var t=e._init;return t(e._payload)}function pu(e){function t(m,f){if(e){var c=m.deletions;c===null?(m.deletions=[f],m.flags|=16):c.push(f)}}function n(m,f){if(!e)return null;for(;f!==null;)t(m,f),f=f.sibling;return null}function a(m,f){for(m=new Map;f!==null;)f.key!==null?m.set(f.key,f):m.set(f.index,f),f=f.sibling;return m}function o(m,f){return m=pr(m,f),m.index=0,m.sibling=null,m}function l(m,f,c){return m.index=c,e?(c=m.alternate,c!==null?(c=c.index,c<f?(m.flags|=2,f):c):(m.flags|=2,f)):(m.flags|=1048576,f)}function s(m){return e&&m.alternate===null&&(m.flags|=2),m}function i(m,f,c,j){return f===null||f.tag!==6?(f=kl(c,m.mode,j),f.return=m,f):(f=o(f,c),f.return=m,f)}function d(m,f,c,j){var T=c.type;return T===Mr?h(m,f,c.props.children,j,c.key):f!==null&&(f.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===Xt&&dd(T)===f.type)?(j=o(f,c.props),j.ref=Sn(m,f,c),j.return=m,j):(j=Za(c.type,c.key,c.props,null,m.mode,j),j.ref=Sn(m,f,c),j.return=m,j)}function u(m,f,c,j){return f===null||f.tag!==4||f.stateNode.containerInfo!==c.containerInfo||f.stateNode.implementation!==c.implementation?(f=Sl(c,m.mode,j),f.return=m,f):(f=o(f,c.children||[]),f.return=m,f)}function h(m,f,c,j,T){return f===null||f.tag!==7?(f=Sr(c,m.mode,j,T),f.return=m,f):(f=o(f,c),f.return=m,f)}function g(m,f,c){if(typeof f=="string"&&f!==""||typeof f=="number")return f=kl(""+f,m.mode,c),f.return=m,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Sa:return c=Za(f.type,f.key,f.props,null,m.mode,c),c.ref=Sn(m,null,f),c.return=m,c;case Br:return f=Sl(f,m.mode,c),f.return=m,f;case Xt:var j=f._init;return g(m,j(f._payload),c)}if(zn(f)||yn(f))return f=Sr(f,m.mode,c,null),f.return=m,f;La(m,f)}return null}function v(m,f,c,j){var T=f!==null?f.key:null;if(typeof c=="string"&&c!==""||typeof c=="number")return T!==null?null:i(m,f,""+c,j);if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Sa:return c.key===T?d(m,f,c,j):null;case Br:return c.key===T?u(m,f,c,j):null;case Xt:return T=c._init,v(m,f,T(c._payload),j)}if(zn(c)||yn(c))return T!==null?null:h(m,f,c,j,null);La(m,c)}return null}function w(m,f,c,j,T){if(typeof j=="string"&&j!==""||typeof j=="number")return m=m.get(c)||null,i(f,m,""+j,T);if(typeof j=="object"&&j!==null){switch(j.$$typeof){case Sa:return m=m.get(j.key===null?c:j.key)||null,d(f,m,j,T);case Br:return m=m.get(j.key===null?c:j.key)||null,u(f,m,j,T);case Xt:var I=j._init;return w(m,f,c,I(j._payload),T)}if(zn(j)||yn(j))return m=m.get(c)||null,h(f,m,j,T,null);La(f,j)}return null}function N(m,f,c,j){for(var T=null,I=null,x=f,D=f=0,U=null;x!==null&&D<c.length;D++){x.index>D?(U=x,x=null):U=x.sibling;var k=v(m,x,c[D],j);if(k===null){x===null&&(x=U);break}e&&x&&k.alternate===null&&t(m,x),f=l(k,f,D),I===null?T=k:I.sibling=k,I=k,x=U}if(D===c.length)return n(m,x),_e&&vr(m,D),T;if(x===null){for(;D<c.length;D++)x=g(m,c[D],j),x!==null&&(f=l(x,f,D),I===null?T=x:I.sibling=x,I=x);return _e&&vr(m,D),T}for(x=a(m,x);D<c.length;D++)U=w(x,m,D,c[D],j),U!==null&&(e&&U.alternate!==null&&x.delete(U.key===null?D:U.key),f=l(U,f,D),I===null?T=U:I.sibling=U,I=U);return e&&x.forEach(function(P){return t(m,P)}),_e&&vr(m,D),T}function S(m,f,c,j){var T=yn(c);if(typeof T!="function")throw Error(q(150));if(c=T.call(c),c==null)throw Error(q(151));for(var I=T=null,x=f,D=f=0,U=null,k=c.next();x!==null&&!k.done;D++,k=c.next()){x.index>D?(U=x,x=null):U=x.sibling;var P=v(m,x,k.value,j);if(P===null){x===null&&(x=U);break}e&&x&&P.alternate===null&&t(m,x),f=l(P,f,D),I===null?T=P:I.sibling=P,I=P,x=U}if(k.done)return n(m,x),_e&&vr(m,D),T;if(x===null){for(;!k.done;D++,k=c.next())k=g(m,k.value,j),k!==null&&(f=l(k,f,D),I===null?T=k:I.sibling=k,I=k);return _e&&vr(m,D),T}for(x=a(m,x);!k.done;D++,k=c.next())k=w(x,m,D,k.value,j),k!==null&&(e&&k.alternate!==null&&x.delete(k.key===null?D:k.key),f=l(k,f,D),I===null?T=k:I.sibling=k,I=k);return e&&x.forEach(function(_){return t(m,_)}),_e&&vr(m,D),T}function E(m,f,c,j){if(typeof c=="object"&&c!==null&&c.type===Mr&&c.key===null&&(c=c.props.children),typeof c=="object"&&c!==null){switch(c.$$typeof){case Sa:e:{for(var T=c.key,I=f;I!==null;){if(I.key===T){if(T=c.type,T===Mr){if(I.tag===7){n(m,I.sibling),f=o(I,c.props.children),f.return=m,m=f;break e}}else if(I.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===Xt&&dd(T)===I.type){n(m,I.sibling),f=o(I,c.props),f.ref=Sn(m,I,c),f.return=m,m=f;break e}n(m,I);break}else t(m,I);I=I.sibling}c.type===Mr?(f=Sr(c.props.children,m.mode,j,c.key),f.return=m,m=f):(j=Za(c.type,c.key,c.props,null,m.mode,j),j.ref=Sn(m,f,c),j.return=m,m=j)}return s(m);case Br:e:{for(I=c.key;f!==null;){if(f.key===I)if(f.tag===4&&f.stateNode.containerInfo===c.containerInfo&&f.stateNode.implementation===c.implementation){n(m,f.sibling),f=o(f,c.children||[]),f.return=m,m=f;break e}else{n(m,f);break}else t(m,f);f=f.sibling}f=Sl(c,m.mode,j),f.return=m,m=f}return s(m);case Xt:return I=c._init,E(m,f,I(c._payload),j)}if(zn(c))return N(m,f,c,j);if(yn(c))return S(m,f,c,j);La(m,c)}return typeof c=="string"&&c!==""||typeof c=="number"?(c=""+c,f!==null&&f.tag===6?(n(m,f.sibling),f=o(f,c),f.return=m,m=f):(n(m,f),f=kl(c,m.mode,j),f.return=m,m=f),s(m)):n(m,f)}return E}var ln=pu(!0),fu=pu(!1),ho=gr(null),vo=null,Qr=null,Ys=null;function Gs(){Ys=Qr=vo=null}function Js(e){var t=ho.current;Se(ho),e._currentValue=t}function as(e,t,n){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===n)break;e=e.return}}function tn(e,t){vo=e,Ys=Qr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(tt=!0),e.firstContext=null)}function yt(e){var t=e._currentValue;if(Ys!==e)if(e={context:e,memoizedValue:t,next:null},Qr===null){if(vo===null)throw Error(q(308));Qr=e,vo.dependencies={lanes:0,firstContext:e}}else Qr=Qr.next=e;return t}var jr=null;function Ks(e){jr===null?jr=[e]:jr.push(e)}function xu(e,t,n,a){var o=t.interleaved;return o===null?(n.next=n,Ks(t)):(n.next=o.next,o.next=n),t.interleaved=n,Yt(e,a)}function Yt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Zt=!1;function Xs(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function mu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Vt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function dr(e,t,n){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,pe&2){var o=a.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),a.pending=t,Yt(e,n)}return o=a.interleaved,o===null?(t.next=t,Ks(a)):(t.next=o.next,o.next=t),a.interleaved=t,Yt(e,n)}function Qa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Os(e,n)}}function cd(e,t){var n=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,n===a)){var o=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?o=l=s:l=l.next=s,n=n.next}while(n!==null);l===null?o=l=t:l=l.next=t}else o=l=t;n={baseState:a.baseState,firstBaseUpdate:o,lastBaseUpdate:l,shared:a.shared,effects:a.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function yo(e,t,n,a){var o=e.updateQueue;Zt=!1;var l=o.firstBaseUpdate,s=o.lastBaseUpdate,i=o.shared.pending;if(i!==null){o.shared.pending=null;var d=i,u=d.next;d.next=null,s===null?l=u:s.next=u,s=d;var h=e.alternate;h!==null&&(h=h.updateQueue,i=h.lastBaseUpdate,i!==s&&(i===null?h.firstBaseUpdate=u:i.next=u,h.lastBaseUpdate=d))}if(l!==null){var g=o.baseState;s=0,h=u=d=null,i=l;do{var v=i.lane,w=i.eventTime;if((a&v)===v){h!==null&&(h=h.next={eventTime:w,lane:0,tag:i.tag,payload:i.payload,callback:i.callback,next:null});e:{var N=e,S=i;switch(v=t,w=n,S.tag){case 1:if(N=S.payload,typeof N=="function"){g=N.call(w,g,v);break e}g=N;break e;case 3:N.flags=N.flags&-65537|128;case 0:if(N=S.payload,v=typeof N=="function"?N.call(w,g,v):N,v==null)break e;g=ze({},g,v);break e;case 2:Zt=!0}}i.callback!==null&&i.lane!==0&&(e.flags|=64,v=o.effects,v===null?o.effects=[i]:v.push(i))}else w={eventTime:w,lane:v,tag:i.tag,payload:i.payload,callback:i.callback,next:null},h===null?(u=h=w,d=g):h=h.next=w,s|=v;if(i=i.next,i===null){if(i=o.shared.pending,i===null)break;v=i,i=v.next,v.next=null,o.lastBaseUpdate=v,o.shared.pending=null}}while(!0);if(h===null&&(d=g),o.baseState=d,o.firstBaseUpdate=u,o.lastBaseUpdate=h,t=o.shared.interleaved,t!==null){o=t;do s|=o.lane,o=o.next;while(o!==t)}else l===null&&(o.shared.lanes=0);Er|=s,e.lanes=s,e.memoizedState=g}}function ud(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var a=e[t],o=a.callback;if(o!==null){if(a.callback=null,a=n,typeof o!="function")throw Error(q(191,o));o.call(a)}}}var fa={},Ot=gr(fa),ta=gr(fa),ra=gr(fa);function wr(e){if(e===fa)throw Error(q(174));return e}function Zs(e,t){switch(we(ra,t),we(ta,e),we(Ot,fa),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Bl(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Bl(t,e)}Se(Ot),we(Ot,t)}function sn(){Se(Ot),Se(ta),Se(ra)}function gu(e){wr(ra.current);var t=wr(Ot.current),n=Bl(t,e.type);t!==n&&(we(ta,e),we(Ot,n))}function ei(e){ta.current===e&&(Se(Ot),Se(ta))}var Ne=gr(0);function bo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var hl=[];function ti(){for(var e=0;e<hl.length;e++)hl[e]._workInProgressVersionPrimary=null;hl.length=0}var Ya=Jt.ReactCurrentDispatcher,vl=Jt.ReactCurrentBatchConfig,zr=0,Ce=null,Oe=null,Me=null,jo=!1,$n=!1,na=0,Tx=0;function He(){throw Error(q(321))}function ri(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Tt(e[n],t[n]))return!1;return!0}function ni(e,t,n,a,o,l){if(zr=l,Ce=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Ya.current=e===null||e.memoizedState===null?Rx:Ox,e=n(a,o),$n){l=0;do{if($n=!1,na=0,25<=l)throw Error(q(301));l+=1,Me=Oe=null,t.updateQueue=null,Ya.current=Bx,e=n(a,o)}while($n)}if(Ya.current=wo,t=Oe!==null&&Oe.next!==null,zr=0,Me=Oe=Ce=null,jo=!1,t)throw Error(q(300));return e}function ai(){var e=na!==0;return na=0,e}function At(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Me===null?Ce.memoizedState=Me=e:Me=Me.next=e,Me}function bt(){if(Oe===null){var e=Ce.alternate;e=e!==null?e.memoizedState:null}else e=Oe.next;var t=Me===null?Ce.memoizedState:Me.next;if(t!==null)Me=t,Oe=e;else{if(e===null)throw Error(q(310));Oe=e,e={memoizedState:Oe.memoizedState,baseState:Oe.baseState,baseQueue:Oe.baseQueue,queue:Oe.queue,next:null},Me===null?Ce.memoizedState=Me=e:Me=Me.next=e}return Me}function aa(e,t){return typeof t=="function"?t(e):t}function yl(e){var t=bt(),n=t.queue;if(n===null)throw Error(q(311));n.lastRenderedReducer=e;var a=Oe,o=a.baseQueue,l=n.pending;if(l!==null){if(o!==null){var s=o.next;o.next=l.next,l.next=s}a.baseQueue=o=l,n.pending=null}if(o!==null){l=o.next,a=a.baseState;var i=s=null,d=null,u=l;do{var h=u.lane;if((zr&h)===h)d!==null&&(d=d.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),a=u.hasEagerState?u.eagerState:e(a,u.action);else{var g={lane:h,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};d===null?(i=d=g,s=a):d=d.next=g,Ce.lanes|=h,Er|=h}u=u.next}while(u!==null&&u!==l);d===null?s=a:d.next=i,Tt(a,t.memoizedState)||(tt=!0),t.memoizedState=a,t.baseState=s,t.baseQueue=d,n.lastRenderedState=a}if(e=n.interleaved,e!==null){o=e;do l=o.lane,Ce.lanes|=l,Er|=l,o=o.next;while(o!==e)}else o===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function bl(e){var t=bt(),n=t.queue;if(n===null)throw Error(q(311));n.lastRenderedReducer=e;var a=n.dispatch,o=n.pending,l=t.memoizedState;if(o!==null){n.pending=null;var s=o=o.next;do l=e(l,s.action),s=s.next;while(s!==o);Tt(l,t.memoizedState)||(tt=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,a]}function hu(){}function vu(e,t){var n=Ce,a=bt(),o=t(),l=!Tt(a.memoizedState,o);if(l&&(a.memoizedState=o,tt=!0),a=a.queue,oi(ju.bind(null,n,a,e),[e]),a.getSnapshot!==t||l||Me!==null&&Me.memoizedState.tag&1){if(n.flags|=2048,oa(9,bu.bind(null,n,a,o,t),void 0,null),Fe===null)throw Error(q(349));zr&30||yu(n,t,o)}return o}function yu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ce.updateQueue,t===null?(t={lastEffect:null,stores:null},Ce.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function bu(e,t,n,a){t.value=n,t.getSnapshot=a,wu(t)&&ku(e)}function ju(e,t,n){return n(function(){wu(t)&&ku(e)})}function wu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Tt(e,n)}catch{return!0}}function ku(e){var t=Yt(e,1);t!==null&&Pt(t,e,1,-1)}function pd(e){var t=At();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:aa,lastRenderedState:e},t.queue=e,e=e.dispatch=Lx.bind(null,Ce,e),[t.memoizedState,e]}function oa(e,t,n,a){return e={tag:e,create:t,destroy:n,deps:a,next:null},t=Ce.updateQueue,t===null?(t={lastEffect:null,stores:null},Ce.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(a=n.next,n.next=e,e.next=a,t.lastEffect=e)),e}function Su(){return bt().memoizedState}function Ga(e,t,n,a){var o=At();Ce.flags|=e,o.memoizedState=oa(1|t,n,void 0,a===void 0?null:a)}function $o(e,t,n,a){var o=bt();a=a===void 0?null:a;var l=void 0;if(Oe!==null){var s=Oe.memoizedState;if(l=s.destroy,a!==null&&ri(a,s.deps)){o.memoizedState=oa(t,n,l,a);return}}Ce.flags|=e,o.memoizedState=oa(1|t,n,l,a)}function fd(e,t){return Ga(8390656,8,e,t)}function oi(e,t){return $o(2048,8,e,t)}function _u(e,t){return $o(4,2,e,t)}function Nu(e,t){return $o(4,4,e,t)}function Cu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function zu(e,t,n){return n=n!=null?n.concat([e]):null,$o(4,4,Cu.bind(null,t,e),n)}function li(){}function Eu(e,t){var n=bt();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&ri(t,a[1])?a[0]:(n.memoizedState=[e,t],e)}function Du(e,t){var n=bt();t=t===void 0?null:t;var a=n.memoizedState;return a!==null&&t!==null&&ri(t,a[1])?a[0]:(e=e(),n.memoizedState=[e,t],e)}function Pu(e,t,n){return zr&21?(Tt(n,t)||(n=Rc(),Ce.lanes|=n,Er|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,tt=!0),e.memoizedState=n)}function Ix(e,t){var n=ve;ve=n!==0&&4>n?n:4,e(!0);var a=vl.transition;vl.transition={};try{e(!1),t()}finally{ve=n,vl.transition=a}}function Tu(){return bt().memoizedState}function Ax(e,t,n){var a=ur(e);if(n={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null},Iu(e))Au(t,n);else if(n=xu(e,t,n,a),n!==null){var o=Ke();Pt(n,e,a,o),Lu(n,t,a)}}function Lx(e,t,n){var a=ur(e),o={lane:a,action:n,hasEagerState:!1,eagerState:null,next:null};if(Iu(e))Au(t,o);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var s=t.lastRenderedState,i=l(s,n);if(o.hasEagerState=!0,o.eagerState=i,Tt(i,s)){var d=t.interleaved;d===null?(o.next=o,Ks(t)):(o.next=d.next,d.next=o),t.interleaved=o;return}}catch{}finally{}n=xu(e,t,o,a),n!==null&&(o=Ke(),Pt(n,e,a,o),Lu(n,t,a))}}function Iu(e){var t=e.alternate;return e===Ce||t!==null&&t===Ce}function Au(e,t){$n=jo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Lu(e,t,n){if(n&4194240){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,Os(e,n)}}var wo={readContext:yt,useCallback:He,useContext:He,useEffect:He,useImperativeHandle:He,useInsertionEffect:He,useLayoutEffect:He,useMemo:He,useReducer:He,useRef:He,useState:He,useDebugValue:He,useDeferredValue:He,useTransition:He,useMutableSource:He,useSyncExternalStore:He,useId:He,unstable_isNewReconciler:!1},Rx={readContext:yt,useCallback:function(e,t){return At().memoizedState=[e,t===void 0?null:t],e},useContext:yt,useEffect:fd,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Ga(4194308,4,Cu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Ga(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ga(4,2,e,t)},useMemo:function(e,t){var n=At();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var a=At();return t=n!==void 0?n(t):t,a.memoizedState=a.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},a.queue=e,e=e.dispatch=Ax.bind(null,Ce,e),[a.memoizedState,e]},useRef:function(e){var t=At();return e={current:e},t.memoizedState=e},useState:pd,useDebugValue:li,useDeferredValue:function(e){return At().memoizedState=e},useTransition:function(){var e=pd(!1),t=e[0];return e=Ix.bind(null,e[1]),At().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var a=Ce,o=At();if(_e){if(n===void 0)throw Error(q(407));n=n()}else{if(n=t(),Fe===null)throw Error(q(349));zr&30||yu(a,t,n)}o.memoizedState=n;var l={value:n,getSnapshot:t};return o.queue=l,fd(ju.bind(null,a,l,e),[e]),a.flags|=2048,oa(9,bu.bind(null,a,l,n,t),void 0,null),n},useId:function(){var e=At(),t=Fe.identifierPrefix;if(_e){var n=Wt,a=Ut;n=(a&~(1<<32-Dt(a)-1)).toString(32)+n,t=":"+t+"R"+n,n=na++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Tx++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Ox={readContext:yt,useCallback:Eu,useContext:yt,useEffect:oi,useImperativeHandle:zu,useInsertionEffect:_u,useLayoutEffect:Nu,useMemo:Du,useReducer:yl,useRef:Su,useState:function(){return yl(aa)},useDebugValue:li,useDeferredValue:function(e){var t=bt();return Pu(t,Oe.memoizedState,e)},useTransition:function(){var e=yl(aa)[0],t=bt().memoizedState;return[e,t]},useMutableSource:hu,useSyncExternalStore:vu,useId:Tu,unstable_isNewReconciler:!1},Bx={readContext:yt,useCallback:Eu,useContext:yt,useEffect:oi,useImperativeHandle:zu,useInsertionEffect:_u,useLayoutEffect:Nu,useMemo:Du,useReducer:bl,useRef:Su,useState:function(){return bl(aa)},useDebugValue:li,useDeferredValue:function(e){var t=bt();return Oe===null?t.memoizedState=e:Pu(t,Oe.memoizedState,e)},useTransition:function(){var e=bl(aa)[0],t=bt().memoizedState;return[e,t]},useMutableSource:hu,useSyncExternalStore:vu,useId:Tu,unstable_isNewReconciler:!1};function Ct(e,t){if(e&&e.defaultProps){t=ze({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function os(e,t,n,a){t=e.memoizedState,n=n(a,t),n=n==null?t:ze({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Fo={isMounted:function(e){return(e=e._reactInternals)?Ir(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var a=Ke(),o=ur(e),l=Vt(a,o);l.payload=t,n!=null&&(l.callback=n),t=dr(e,l,o),t!==null&&(Pt(t,e,o,a),Qa(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var a=Ke(),o=ur(e),l=Vt(a,o);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=dr(e,l,o),t!==null&&(Pt(t,e,o,a),Qa(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ke(),a=ur(e),o=Vt(n,a);o.tag=2,t!=null&&(o.callback=t),t=dr(e,o,a),t!==null&&(Pt(t,e,a,n),Qa(t,e,a))}};function xd(e,t,n,a,o,l,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,l,s):t.prototype&&t.prototype.isPureReactComponent?!Kn(n,a)||!Kn(o,l):!0}function Ru(e,t,n){var a=!1,o=xr,l=t.contextType;return typeof l=="object"&&l!==null?l=yt(l):(o=nt(t)?Nr:Ge.current,a=t.contextTypes,l=(a=a!=null)?an(e,o):xr),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Fo,e.stateNode=t,t._reactInternals=e,a&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=l),t}function md(e,t,n,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,a),t.state!==e&&Fo.enqueueReplaceState(t,t.state,null)}function ls(e,t,n,a){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs={},Xs(e);var l=t.contextType;typeof l=="object"&&l!==null?o.context=yt(l):(l=nt(t)?Nr:Ge.current,o.context=an(e,l)),o.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(os(e,t,l,n),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&Fo.enqueueReplaceState(o,o.state,null),yo(e,n,o,a),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function dn(e,t){try{var n="",a=t;do n+=pf(a),a=a.return;while(a);var o=n}catch(l){o=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:o,digest:null}}function jl(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ss(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Mx=typeof WeakMap=="function"?WeakMap:Map;function Ou(e,t,n){n=Vt(-1,n),n.tag=3,n.payload={element:null};var a=t.value;return n.callback=function(){So||(So=!0,hs=a),ss(e,t)},n}function Bu(e,t,n){n=Vt(-1,n),n.tag=3;var a=e.type.getDerivedStateFromError;if(typeof a=="function"){var o=t.value;n.payload=function(){return a(o)},n.callback=function(){ss(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){ss(e,t),typeof a!="function"&&(cr===null?cr=new Set([this]):cr.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function gd(e,t,n){var a=e.pingCache;if(a===null){a=e.pingCache=new Mx;var o=new Set;a.set(t,o)}else o=a.get(t),o===void 0&&(o=new Set,a.set(t,o));o.has(n)||(o.add(n),e=Zx.bind(null,e,t,n),t.then(e,e))}function hd(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function vd(e,t,n,a,o){return e.mode&1?(e.flags|=65536,e.lanes=o,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Vt(-1,1),t.tag=2,dr(n,t,1))),n.lanes|=1),e)}var $x=Jt.ReactCurrentOwner,tt=!1;function Je(e,t,n,a){t.child=e===null?fu(t,null,n,a):ln(t,e.child,n,a)}function yd(e,t,n,a,o){n=n.render;var l=t.ref;return tn(t,o),a=ni(e,t,n,a,l,o),n=ai(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Gt(e,t,o)):(_e&&n&&Vs(t),t.flags|=1,Je(e,t,a,o),t.child)}function bd(e,t,n,a,o){if(e===null){var l=n.type;return typeof l=="function"&&!xi(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,Mu(e,t,l,a,o)):(e=Za(n.type,null,a,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!(e.lanes&o)){var s=l.memoizedProps;if(n=n.compare,n=n!==null?n:Kn,n(s,a)&&e.ref===t.ref)return Gt(e,t,o)}return t.flags|=1,e=pr(l,a),e.ref=t.ref,e.return=t,t.child=e}function Mu(e,t,n,a,o){if(e!==null){var l=e.memoizedProps;if(Kn(l,a)&&e.ref===t.ref)if(tt=!1,t.pendingProps=a=l,(e.lanes&o)!==0)e.flags&131072&&(tt=!0);else return t.lanes=e.lanes,Gt(e,t,o)}return is(e,t,n,a,o)}function $u(e,t,n){var a=t.pendingProps,o=a.children,l=e!==null?e.memoizedState:null;if(a.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},we(Gr,dt),dt|=n;else{if(!(n&1073741824))return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,we(Gr,dt),dt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},a=l!==null?l.baseLanes:n,we(Gr,dt),dt|=a}else l!==null?(a=l.baseLanes|n,t.memoizedState=null):a=n,we(Gr,dt),dt|=a;return Je(e,t,o,n),t.child}function Fu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function is(e,t,n,a,o){var l=nt(n)?Nr:Ge.current;return l=an(t,l),tn(t,o),n=ni(e,t,n,a,l,o),a=ai(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Gt(e,t,o)):(_e&&a&&Vs(t),t.flags|=1,Je(e,t,n,o),t.child)}function jd(e,t,n,a,o){if(nt(n)){var l=!0;xo(t)}else l=!1;if(tn(t,o),t.stateNode===null)Ja(e,t),Ru(t,n,a),ls(t,n,a,o),a=!0;else if(e===null){var s=t.stateNode,i=t.memoizedProps;s.props=i;var d=s.context,u=n.contextType;typeof u=="object"&&u!==null?u=yt(u):(u=nt(n)?Nr:Ge.current,u=an(t,u));var h=n.getDerivedStateFromProps,g=typeof h=="function"||typeof s.getSnapshotBeforeUpdate=="function";g||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==a||d!==u)&&md(t,s,a,u),Zt=!1;var v=t.memoizedState;s.state=v,yo(t,a,s,o),d=t.memoizedState,i!==a||v!==d||rt.current||Zt?(typeof h=="function"&&(os(t,n,h,a),d=t.memoizedState),(i=Zt||xd(t,n,i,a,v,d,u))?(g||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=d),s.props=a,s.state=d,s.context=u,a=i):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{s=t.stateNode,mu(e,t),i=t.memoizedProps,u=t.type===t.elementType?i:Ct(t.type,i),s.props=u,g=t.pendingProps,v=s.context,d=n.contextType,typeof d=="object"&&d!==null?d=yt(d):(d=nt(n)?Nr:Ge.current,d=an(t,d));var w=n.getDerivedStateFromProps;(h=typeof w=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==g||v!==d)&&md(t,s,a,d),Zt=!1,v=t.memoizedState,s.state=v,yo(t,a,s,o);var N=t.memoizedState;i!==g||v!==N||rt.current||Zt?(typeof w=="function"&&(os(t,n,w,a),N=t.memoizedState),(u=Zt||xd(t,n,u,a,v,N,d)||!1)?(h||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(a,N,d),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(a,N,d)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&v===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&v===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=N),s.props=a,s.state=N,s.context=d,a=u):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&v===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&v===e.memoizedState||(t.flags|=1024),a=!1)}return ds(e,t,n,a,l,o)}function ds(e,t,n,a,o,l){Fu(e,t);var s=(t.flags&128)!==0;if(!a&&!s)return o&&ld(t,n,!1),Gt(e,t,l);a=t.stateNode,$x.current=t;var i=s&&typeof n.getDerivedStateFromError!="function"?null:a.render();return t.flags|=1,e!==null&&s?(t.child=ln(t,e.child,null,l),t.child=ln(t,null,i,l)):Je(e,t,i,l),t.memoizedState=a.state,o&&ld(t,n,!0),t.child}function Uu(e){var t=e.stateNode;t.pendingContext?od(e,t.pendingContext,t.pendingContext!==t.context):t.context&&od(e,t.context,!1),Zs(e,t.containerInfo)}function wd(e,t,n,a,o){return on(),Qs(o),t.flags|=256,Je(e,t,n,a),t.child}var cs={dehydrated:null,treeContext:null,retryLane:0};function us(e){return{baseLanes:e,cachePool:null,transitions:null}}function Wu(e,t,n){var a=t.pendingProps,o=Ne.current,l=!1,s=(t.flags&128)!==0,i;if((i=s)||(i=e!==null&&e.memoizedState===null?!1:(o&2)!==0),i?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),we(Ne,o&1),e===null)return ns(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(s=a.children,e=a.fallback,l?(a=t.mode,l=t.child,s={mode:"hidden",children:s},!(a&1)&&l!==null?(l.childLanes=0,l.pendingProps=s):l=qo(s,a,0,null),e=Sr(e,a,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=us(n),t.memoizedState=cs,e):si(t,s));if(o=e.memoizedState,o!==null&&(i=o.dehydrated,i!==null))return Fx(e,t,s,a,i,o,n);if(l){l=a.fallback,s=t.mode,o=e.child,i=o.sibling;var d={mode:"hidden",children:a.children};return!(s&1)&&t.child!==o?(a=t.child,a.childLanes=0,a.pendingProps=d,t.deletions=null):(a=pr(o,d),a.subtreeFlags=o.subtreeFlags&14680064),i!==null?l=pr(i,l):(l=Sr(l,s,n,null),l.flags|=2),l.return=t,a.return=t,a.sibling=l,t.child=a,a=l,l=t.child,s=e.child.memoizedState,s=s===null?us(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},l.memoizedState=s,l.childLanes=e.childLanes&~n,t.memoizedState=cs,a}return l=e.child,e=l.sibling,a=pr(l,{mode:"visible",children:a.children}),!(t.mode&1)&&(a.lanes=n),a.return=t,a.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=a,t.memoizedState=null,a}function si(e,t){return t=qo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ra(e,t,n,a){return a!==null&&Qs(a),ln(t,e.child,null,n),e=si(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Fx(e,t,n,a,o,l,s){if(n)return t.flags&256?(t.flags&=-257,a=jl(Error(q(422))),Ra(e,t,s,a)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=a.fallback,o=t.mode,a=qo({mode:"visible",children:a.children},o,0,null),l=Sr(l,o,s,null),l.flags|=2,a.return=t,l.return=t,a.sibling=l,t.child=a,t.mode&1&&ln(t,e.child,null,s),t.child.memoizedState=us(s),t.memoizedState=cs,l);if(!(t.mode&1))return Ra(e,t,s,null);if(o.data==="$!"){if(a=o.nextSibling&&o.nextSibling.dataset,a)var i=a.dgst;return a=i,l=Error(q(419)),a=jl(l,a,void 0),Ra(e,t,s,a)}if(i=(s&e.childLanes)!==0,tt||i){if(a=Fe,a!==null){switch(s&-s){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=o&(a.suspendedLanes|s)?0:o,o!==0&&o!==l.retryLane&&(l.retryLane=o,Yt(e,o),Pt(a,e,o,-1))}return fi(),a=jl(Error(q(421))),Ra(e,t,s,a)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=em.bind(null,e),o._reactRetry=t,null):(e=l.treeContext,ct=ir(o.nextSibling),ut=t,_e=!0,Et=null,e!==null&&(mt[gt++]=Ut,mt[gt++]=Wt,mt[gt++]=Cr,Ut=e.id,Wt=e.overflow,Cr=t),t=si(t,a.children),t.flags|=4096,t)}function kd(e,t,n){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),as(e.return,t,n)}function wl(e,t,n,a,o){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:n,tailMode:o}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=a,l.tail=n,l.tailMode=o)}function qu(e,t,n){var a=t.pendingProps,o=a.revealOrder,l=a.tail;if(Je(e,t,a.children,n),a=Ne.current,a&2)a=a&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&kd(e,n,t);else if(e.tag===19)kd(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}a&=1}if(we(Ne,a),!(t.mode&1))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;n!==null;)e=n.alternate,e!==null&&bo(e)===null&&(o=n),n=n.sibling;n=o,n===null?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),wl(t,!1,o,n,l);break;case"backwards":for(n=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&bo(e)===null){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}wl(t,!0,n,null,l);break;case"together":wl(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ja(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Gt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Er|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(q(153));if(t.child!==null){for(e=t.child,n=pr(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=pr(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Ux(e,t,n){switch(t.tag){case 3:Uu(t),on();break;case 5:gu(t);break;case 1:nt(t.type)&&xo(t);break;case 4:Zs(t,t.stateNode.containerInfo);break;case 10:var a=t.type._context,o=t.memoizedProps.value;we(ho,a._currentValue),a._currentValue=o;break;case 13:if(a=t.memoizedState,a!==null)return a.dehydrated!==null?(we(Ne,Ne.current&1),t.flags|=128,null):n&t.child.childLanes?Wu(e,t,n):(we(Ne,Ne.current&1),e=Gt(e,t,n),e!==null?e.sibling:null);we(Ne,Ne.current&1);break;case 19:if(a=(n&t.childLanes)!==0,e.flags&128){if(a)return qu(e,t,n);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),we(Ne,Ne.current),a)break;return null;case 22:case 23:return t.lanes=0,$u(e,t,n)}return Gt(e,t,n)}var Vu,ps,Hu,Qu;Vu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};ps=function(){};Hu=function(e,t,n,a){var o=e.memoizedProps;if(o!==a){e=t.stateNode,wr(Ot.current);var l=null;switch(n){case"input":o=Al(e,o),a=Al(e,a),l=[];break;case"select":o=ze({},o,{value:void 0}),a=ze({},a,{value:void 0}),l=[];break;case"textarea":o=Ol(e,o),a=Ol(e,a),l=[];break;default:typeof o.onClick!="function"&&typeof a.onClick=="function"&&(e.onclick=po)}Ml(n,a);var s;n=null;for(u in o)if(!a.hasOwnProperty(u)&&o.hasOwnProperty(u)&&o[u]!=null)if(u==="style"){var i=o[u];for(s in i)i.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(qn.hasOwnProperty(u)?l||(l=[]):(l=l||[]).push(u,null));for(u in a){var d=a[u];if(i=o!=null?o[u]:void 0,a.hasOwnProperty(u)&&d!==i&&(d!=null||i!=null))if(u==="style")if(i){for(s in i)!i.hasOwnProperty(s)||d&&d.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in d)d.hasOwnProperty(s)&&i[s]!==d[s]&&(n||(n={}),n[s]=d[s])}else n||(l||(l=[]),l.push(u,n)),n=d;else u==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,i=i?i.__html:void 0,d!=null&&i!==d&&(l=l||[]).push(u,d)):u==="children"?typeof d!="string"&&typeof d!="number"||(l=l||[]).push(u,""+d):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(qn.hasOwnProperty(u)?(d!=null&&u==="onScroll"&&ke("scroll",e),l||i===d||(l=[])):(l=l||[]).push(u,d))}n&&(l=l||[]).push("style",n);var u=l;(t.updateQueue=u)&&(t.flags|=4)}};Qu=function(e,t,n,a){n!==a&&(t.flags|=4)};function _n(e,t){if(!_e)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function Qe(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,a=0;if(t)for(var o=e.child;o!==null;)n|=o.lanes|o.childLanes,a|=o.subtreeFlags&14680064,a|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)n|=o.lanes|o.childLanes,a|=o.subtreeFlags,a|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=a,e.childLanes=n,t}function Wx(e,t,n){var a=t.pendingProps;switch(Hs(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qe(t),null;case 1:return nt(t.type)&&fo(),Qe(t),null;case 3:return a=t.stateNode,sn(),Se(rt),Se(Ge),ti(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Aa(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Et!==null&&(bs(Et),Et=null))),ps(e,t),Qe(t),null;case 5:ei(t);var o=wr(ra.current);if(n=t.type,e!==null&&t.stateNode!=null)Hu(e,t,n,a,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!a){if(t.stateNode===null)throw Error(q(166));return Qe(t),null}if(e=wr(Ot.current),Aa(t)){a=t.stateNode,n=t.type;var l=t.memoizedProps;switch(a[Lt]=t,a[ea]=l,e=(t.mode&1)!==0,n){case"dialog":ke("cancel",a),ke("close",a);break;case"iframe":case"object":case"embed":ke("load",a);break;case"video":case"audio":for(o=0;o<Dn.length;o++)ke(Dn[o],a);break;case"source":ke("error",a);break;case"img":case"image":case"link":ke("error",a),ke("load",a);break;case"details":ke("toggle",a);break;case"input":Ti(a,l),ke("invalid",a);break;case"select":a._wrapperState={wasMultiple:!!l.multiple},ke("invalid",a);break;case"textarea":Ai(a,l),ke("invalid",a)}Ml(n,l),o=null;for(var s in l)if(l.hasOwnProperty(s)){var i=l[s];s==="children"?typeof i=="string"?a.textContent!==i&&(l.suppressHydrationWarning!==!0&&Ia(a.textContent,i,e),o=["children",i]):typeof i=="number"&&a.textContent!==""+i&&(l.suppressHydrationWarning!==!0&&Ia(a.textContent,i,e),o=["children",""+i]):qn.hasOwnProperty(s)&&i!=null&&s==="onScroll"&&ke("scroll",a)}switch(n){case"input":_a(a),Ii(a,l,!0);break;case"textarea":_a(a),Li(a);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(a.onclick=po)}a=o,t.updateQueue=a,a!==null&&(t.flags|=4)}else{s=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=jc(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof a.is=="string"?e=s.createElement(n,{is:a.is}):(e=s.createElement(n),n==="select"&&(s=e,a.multiple?s.multiple=!0:a.size&&(s.size=a.size))):e=s.createElementNS(e,n),e[Lt]=t,e[ea]=a,Vu(e,t,!1,!1),t.stateNode=e;e:{switch(s=$l(n,a),n){case"dialog":ke("cancel",e),ke("close",e),o=a;break;case"iframe":case"object":case"embed":ke("load",e),o=a;break;case"video":case"audio":for(o=0;o<Dn.length;o++)ke(Dn[o],e);o=a;break;case"source":ke("error",e),o=a;break;case"img":case"image":case"link":ke("error",e),ke("load",e),o=a;break;case"details":ke("toggle",e),o=a;break;case"input":Ti(e,a),o=Al(e,a),ke("invalid",e);break;case"option":o=a;break;case"select":e._wrapperState={wasMultiple:!!a.multiple},o=ze({},a,{value:void 0}),ke("invalid",e);break;case"textarea":Ai(e,a),o=Ol(e,a),ke("invalid",e);break;default:o=a}Ml(n,o),i=o;for(l in i)if(i.hasOwnProperty(l)){var d=i[l];l==="style"?Sc(e,d):l==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,d!=null&&wc(e,d)):l==="children"?typeof d=="string"?(n!=="textarea"||d!=="")&&Vn(e,d):typeof d=="number"&&Vn(e,""+d):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(qn.hasOwnProperty(l)?d!=null&&l==="onScroll"&&ke("scroll",e):d!=null&&Ps(e,l,d,s))}switch(n){case"input":_a(e),Ii(e,a,!1);break;case"textarea":_a(e),Li(e);break;case"option":a.value!=null&&e.setAttribute("value",""+fr(a.value));break;case"select":e.multiple=!!a.multiple,l=a.value,l!=null?Kr(e,!!a.multiple,l,!1):a.defaultValue!=null&&Kr(e,!!a.multiple,a.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=po)}switch(n){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}}a&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Qe(t),null;case 6:if(e&&t.stateNode!=null)Qu(e,t,e.memoizedProps,a);else{if(typeof a!="string"&&t.stateNode===null)throw Error(q(166));if(n=wr(ra.current),wr(Ot.current),Aa(t)){if(a=t.stateNode,n=t.memoizedProps,a[Lt]=t,(l=a.nodeValue!==n)&&(e=ut,e!==null))switch(e.tag){case 3:Ia(a.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Ia(a.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else a=(n.nodeType===9?n:n.ownerDocument).createTextNode(a),a[Lt]=t,t.stateNode=a}return Qe(t),null;case 13:if(Se(Ne),a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(_e&&ct!==null&&t.mode&1&&!(t.flags&128))uu(),on(),t.flags|=98560,l=!1;else if(l=Aa(t),a!==null&&a.dehydrated!==null){if(e===null){if(!l)throw Error(q(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(q(317));l[Lt]=t}else on(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Qe(t),l=!1}else Et!==null&&(bs(Et),Et=null),l=!0;if(!l)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(a=a!==null,a!==(e!==null&&e.memoizedState!==null)&&a&&(t.child.flags|=8192,t.mode&1&&(e===null||Ne.current&1?Be===0&&(Be=3):fi())),t.updateQueue!==null&&(t.flags|=4),Qe(t),null);case 4:return sn(),ps(e,t),e===null&&Xn(t.stateNode.containerInfo),Qe(t),null;case 10:return Js(t.type._context),Qe(t),null;case 17:return nt(t.type)&&fo(),Qe(t),null;case 19:if(Se(Ne),l=t.memoizedState,l===null)return Qe(t),null;if(a=(t.flags&128)!==0,s=l.rendering,s===null)if(a)_n(l,!1);else{if(Be!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=bo(e),s!==null){for(t.flags|=128,_n(l,!1),a=s.updateQueue,a!==null&&(t.updateQueue=a,t.flags|=4),t.subtreeFlags=0,a=n,n=t.child;n!==null;)l=n,e=a,l.flags&=14680066,s=l.alternate,s===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=s.childLanes,l.lanes=s.lanes,l.child=s.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=s.memoizedProps,l.memoizedState=s.memoizedState,l.updateQueue=s.updateQueue,l.type=s.type,e=s.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return we(Ne,Ne.current&1|2),t.child}e=e.sibling}l.tail!==null&&Te()>cn&&(t.flags|=128,a=!0,_n(l,!1),t.lanes=4194304)}else{if(!a)if(e=bo(s),e!==null){if(t.flags|=128,a=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),_n(l,!0),l.tail===null&&l.tailMode==="hidden"&&!s.alternate&&!_e)return Qe(t),null}else 2*Te()-l.renderingStartTime>cn&&n!==1073741824&&(t.flags|=128,a=!0,_n(l,!1),t.lanes=4194304);l.isBackwards?(s.sibling=t.child,t.child=s):(n=l.last,n!==null?n.sibling=s:t.child=s,l.last=s)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=Te(),t.sibling=null,n=Ne.current,we(Ne,a?n&1|2:n&1),t):(Qe(t),null);case 22:case 23:return pi(),a=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==a&&(t.flags|=8192),a&&t.mode&1?dt&1073741824&&(Qe(t),t.subtreeFlags&6&&(t.flags|=8192)):Qe(t),null;case 24:return null;case 25:return null}throw Error(q(156,t.tag))}function qx(e,t){switch(Hs(t),t.tag){case 1:return nt(t.type)&&fo(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return sn(),Se(rt),Se(Ge),ti(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return ei(t),null;case 13:if(Se(Ne),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(q(340));on()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Se(Ne),null;case 4:return sn(),null;case 10:return Js(t.type._context),null;case 22:case 23:return pi(),null;case 24:return null;default:return null}}var Oa=!1,Ye=!1,Vx=typeof WeakSet=="function"?WeakSet:Set,X=null;function Yr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(a){De(e,t,a)}else n.current=null}function fs(e,t,n){try{n()}catch(a){De(e,t,a)}}var Sd=!1;function Hx(e,t){if(Jl=io,e=Xc(),qs(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var a=n.getSelection&&n.getSelection();if(a&&a.rangeCount!==0){n=a.anchorNode;var o=a.anchorOffset,l=a.focusNode;a=a.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var s=0,i=-1,d=-1,u=0,h=0,g=e,v=null;t:for(;;){for(var w;g!==n||o!==0&&g.nodeType!==3||(i=s+o),g!==l||a!==0&&g.nodeType!==3||(d=s+a),g.nodeType===3&&(s+=g.nodeValue.length),(w=g.firstChild)!==null;)v=g,g=w;for(;;){if(g===e)break t;if(v===n&&++u===o&&(i=s),v===l&&++h===a&&(d=s),(w=g.nextSibling)!==null)break;g=v,v=g.parentNode}g=w}n=i===-1||d===-1?null:{start:i,end:d}}else n=null}n=n||{start:0,end:0}}else n=null;for(Kl={focusedElem:e,selectionRange:n},io=!1,X=t;X!==null;)if(t=X,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,X=e;else for(;X!==null;){t=X;try{var N=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(N!==null){var S=N.memoizedProps,E=N.memoizedState,m=t.stateNode,f=m.getSnapshotBeforeUpdate(t.elementType===t.type?S:Ct(t.type,S),E);m.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var c=t.stateNode.containerInfo;c.nodeType===1?c.textContent="":c.nodeType===9&&c.documentElement&&c.removeChild(c.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(q(163))}}catch(j){De(t,t.return,j)}if(e=t.sibling,e!==null){e.return=t.return,X=e;break}X=t.return}return N=Sd,Sd=!1,N}function Fn(e,t,n){var a=t.updateQueue;if(a=a!==null?a.lastEffect:null,a!==null){var o=a=a.next;do{if((o.tag&e)===e){var l=o.destroy;o.destroy=void 0,l!==void 0&&fs(t,n,l)}o=o.next}while(o!==a)}}function Uo(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var a=n.create;n.destroy=a()}n=n.next}while(n!==t)}}function xs(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Yu(e){var t=e.alternate;t!==null&&(e.alternate=null,Yu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Lt],delete t[ea],delete t[es],delete t[zx],delete t[Ex])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Gu(e){return e.tag===5||e.tag===3||e.tag===4}function _d(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Gu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ms(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=po));else if(a!==4&&(e=e.child,e!==null))for(ms(e,t,n),e=e.sibling;e!==null;)ms(e,t,n),e=e.sibling}function gs(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(a!==4&&(e=e.child,e!==null))for(gs(e,t,n),e=e.sibling;e!==null;)gs(e,t,n),e=e.sibling}var We=null,zt=!1;function Kt(e,t,n){for(n=n.child;n!==null;)Ju(e,t,n),n=n.sibling}function Ju(e,t,n){if(Rt&&typeof Rt.onCommitFiberUnmount=="function")try{Rt.onCommitFiberUnmount(Ao,n)}catch{}switch(n.tag){case 5:Ye||Yr(n,t);case 6:var a=We,o=zt;We=null,Kt(e,t,n),We=a,zt=o,We!==null&&(zt?(e=We,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):We.removeChild(n.stateNode));break;case 18:We!==null&&(zt?(e=We,n=n.stateNode,e.nodeType===8?ml(e.parentNode,n):e.nodeType===1&&ml(e,n),Gn(e)):ml(We,n.stateNode));break;case 4:a=We,o=zt,We=n.stateNode.containerInfo,zt=!0,Kt(e,t,n),We=a,zt=o;break;case 0:case 11:case 14:case 15:if(!Ye&&(a=n.updateQueue,a!==null&&(a=a.lastEffect,a!==null))){o=a=a.next;do{var l=o,s=l.destroy;l=l.tag,s!==void 0&&(l&2||l&4)&&fs(n,t,s),o=o.next}while(o!==a)}Kt(e,t,n);break;case 1:if(!Ye&&(Yr(n,t),a=n.stateNode,typeof a.componentWillUnmount=="function"))try{a.props=n.memoizedProps,a.state=n.memoizedState,a.componentWillUnmount()}catch(i){De(n,t,i)}Kt(e,t,n);break;case 21:Kt(e,t,n);break;case 22:n.mode&1?(Ye=(a=Ye)||n.memoizedState!==null,Kt(e,t,n),Ye=a):Kt(e,t,n);break;default:Kt(e,t,n)}}function Nd(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Vx),t.forEach(function(a){var o=tm.bind(null,e,a);n.has(a)||(n.add(a),a.then(o,o))})}}function Nt(e,t){var n=t.deletions;if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];try{var l=e,s=t,i=s;e:for(;i!==null;){switch(i.tag){case 5:We=i.stateNode,zt=!1;break e;case 3:We=i.stateNode.containerInfo,zt=!0;break e;case 4:We=i.stateNode.containerInfo,zt=!0;break e}i=i.return}if(We===null)throw Error(q(160));Ju(l,s,o),We=null,zt=!1;var d=o.alternate;d!==null&&(d.return=null),o.return=null}catch(u){De(o,t,u)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Ku(t,e),t=t.sibling}function Ku(e,t){var n=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Nt(t,e),It(e),a&4){try{Fn(3,e,e.return),Uo(3,e)}catch(S){De(e,e.return,S)}try{Fn(5,e,e.return)}catch(S){De(e,e.return,S)}}break;case 1:Nt(t,e),It(e),a&512&&n!==null&&Yr(n,n.return);break;case 5:if(Nt(t,e),It(e),a&512&&n!==null&&Yr(n,n.return),e.flags&32){var o=e.stateNode;try{Vn(o,"")}catch(S){De(e,e.return,S)}}if(a&4&&(o=e.stateNode,o!=null)){var l=e.memoizedProps,s=n!==null?n.memoizedProps:l,i=e.type,d=e.updateQueue;if(e.updateQueue=null,d!==null)try{i==="input"&&l.type==="radio"&&l.name!=null&&yc(o,l),$l(i,s);var u=$l(i,l);for(s=0;s<d.length;s+=2){var h=d[s],g=d[s+1];h==="style"?Sc(o,g):h==="dangerouslySetInnerHTML"?wc(o,g):h==="children"?Vn(o,g):Ps(o,h,g,u)}switch(i){case"input":Ll(o,l);break;case"textarea":bc(o,l);break;case"select":var v=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!l.multiple;var w=l.value;w!=null?Kr(o,!!l.multiple,w,!1):v!==!!l.multiple&&(l.defaultValue!=null?Kr(o,!!l.multiple,l.defaultValue,!0):Kr(o,!!l.multiple,l.multiple?[]:"",!1))}o[ea]=l}catch(S){De(e,e.return,S)}}break;case 6:if(Nt(t,e),It(e),a&4){if(e.stateNode===null)throw Error(q(162));o=e.stateNode,l=e.memoizedProps;try{o.nodeValue=l}catch(S){De(e,e.return,S)}}break;case 3:if(Nt(t,e),It(e),a&4&&n!==null&&n.memoizedState.isDehydrated)try{Gn(t.containerInfo)}catch(S){De(e,e.return,S)}break;case 4:Nt(t,e),It(e);break;case 13:Nt(t,e),It(e),o=e.child,o.flags&8192&&(l=o.memoizedState!==null,o.stateNode.isHidden=l,!l||o.alternate!==null&&o.alternate.memoizedState!==null||(ci=Te())),a&4&&Nd(e);break;case 22:if(h=n!==null&&n.memoizedState!==null,e.mode&1?(Ye=(u=Ye)||h,Nt(t,e),Ye=u):Nt(t,e),It(e),a&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!h&&e.mode&1)for(X=e,h=e.child;h!==null;){for(g=X=h;X!==null;){switch(v=X,w=v.child,v.tag){case 0:case 11:case 14:case 15:Fn(4,v,v.return);break;case 1:Yr(v,v.return);var N=v.stateNode;if(typeof N.componentWillUnmount=="function"){a=v,n=v.return;try{t=a,N.props=t.memoizedProps,N.state=t.memoizedState,N.componentWillUnmount()}catch(S){De(a,n,S)}}break;case 5:Yr(v,v.return);break;case 22:if(v.memoizedState!==null){zd(g);continue}}w!==null?(w.return=v,X=w):zd(g)}h=h.sibling}e:for(h=null,g=e;;){if(g.tag===5){if(h===null){h=g;try{o=g.stateNode,u?(l=o.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(i=g.stateNode,d=g.memoizedProps.style,s=d!=null&&d.hasOwnProperty("display")?d.display:null,i.style.display=kc("display",s))}catch(S){De(e,e.return,S)}}}else if(g.tag===6){if(h===null)try{g.stateNode.nodeValue=u?"":g.memoizedProps}catch(S){De(e,e.return,S)}}else if((g.tag!==22&&g.tag!==23||g.memoizedState===null||g===e)&&g.child!==null){g.child.return=g,g=g.child;continue}if(g===e)break e;for(;g.sibling===null;){if(g.return===null||g.return===e)break e;h===g&&(h=null),g=g.return}h===g&&(h=null),g.sibling.return=g.return,g=g.sibling}}break;case 19:Nt(t,e),It(e),a&4&&Nd(e);break;case 21:break;default:Nt(t,e),It(e)}}function It(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Gu(n)){var a=n;break e}n=n.return}throw Error(q(160))}switch(a.tag){case 5:var o=a.stateNode;a.flags&32&&(Vn(o,""),a.flags&=-33);var l=_d(e);gs(e,l,o);break;case 3:case 4:var s=a.stateNode.containerInfo,i=_d(e);ms(e,i,s);break;default:throw Error(q(161))}}catch(d){De(e,e.return,d)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Qx(e,t,n){X=e,Xu(e)}function Xu(e,t,n){for(var a=(e.mode&1)!==0;X!==null;){var o=X,l=o.child;if(o.tag===22&&a){var s=o.memoizedState!==null||Oa;if(!s){var i=o.alternate,d=i!==null&&i.memoizedState!==null||Ye;i=Oa;var u=Ye;if(Oa=s,(Ye=d)&&!u)for(X=o;X!==null;)s=X,d=s.child,s.tag===22&&s.memoizedState!==null?Ed(o):d!==null?(d.return=s,X=d):Ed(o);for(;l!==null;)X=l,Xu(l),l=l.sibling;X=o,Oa=i,Ye=u}Cd(e)}else o.subtreeFlags&8772&&l!==null?(l.return=o,X=l):Cd(e)}}function Cd(e){for(;X!==null;){var t=X;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Ye||Uo(5,t);break;case 1:var a=t.stateNode;if(t.flags&4&&!Ye)if(n===null)a.componentDidMount();else{var o=t.elementType===t.type?n.memoizedProps:Ct(t.type,n.memoizedProps);a.componentDidUpdate(o,n.memoizedState,a.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&ud(t,l,a);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}ud(t,s,n)}break;case 5:var i=t.stateNode;if(n===null&&t.flags&4){n=i;var d=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":d.autoFocus&&n.focus();break;case"img":d.src&&(n.src=d.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var h=u.memoizedState;if(h!==null){var g=h.dehydrated;g!==null&&Gn(g)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(q(163))}Ye||t.flags&512&&xs(t)}catch(v){De(t,t.return,v)}}if(t===e){X=null;break}if(n=t.sibling,n!==null){n.return=t.return,X=n;break}X=t.return}}function zd(e){for(;X!==null;){var t=X;if(t===e){X=null;break}var n=t.sibling;if(n!==null){n.return=t.return,X=n;break}X=t.return}}function Ed(e){for(;X!==null;){var t=X;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Uo(4,t)}catch(d){De(t,n,d)}break;case 1:var a=t.stateNode;if(typeof a.componentDidMount=="function"){var o=t.return;try{a.componentDidMount()}catch(d){De(t,o,d)}}var l=t.return;try{xs(t)}catch(d){De(t,l,d)}break;case 5:var s=t.return;try{xs(t)}catch(d){De(t,s,d)}}}catch(d){De(t,t.return,d)}if(t===e){X=null;break}var i=t.sibling;if(i!==null){i.return=t.return,X=i;break}X=t.return}}var Yx=Math.ceil,ko=Jt.ReactCurrentDispatcher,ii=Jt.ReactCurrentOwner,vt=Jt.ReactCurrentBatchConfig,pe=0,Fe=null,Ie=null,qe=0,dt=0,Gr=gr(0),Be=0,la=null,Er=0,Wo=0,di=0,Un=null,et=null,ci=0,cn=1/0,$t=null,So=!1,hs=null,cr=null,Ba=!1,nr=null,_o=0,Wn=0,vs=null,Ka=-1,Xa=0;function Ke(){return pe&6?Te():Ka!==-1?Ka:Ka=Te()}function ur(e){return e.mode&1?pe&2&&qe!==0?qe&-qe:Px.transition!==null?(Xa===0&&(Xa=Rc()),Xa):(e=ve,e!==0||(e=window.event,e=e===void 0?16:Wc(e.type)),e):1}function Pt(e,t,n,a){if(50<Wn)throw Wn=0,vs=null,Error(q(185));ca(e,n,a),(!(pe&2)||e!==Fe)&&(e===Fe&&(!(pe&2)&&(Wo|=n),Be===4&&tr(e,qe)),at(e,a),n===1&&pe===0&&!(t.mode&1)&&(cn=Te()+500,Mo&&hr()))}function at(e,t){var n=e.callbackNode;Pf(e,t);var a=so(e,e===Fe?qe:0);if(a===0)n!==null&&Bi(n),e.callbackNode=null,e.callbackPriority=0;else if(t=a&-a,e.callbackPriority!==t){if(n!=null&&Bi(n),t===1)e.tag===0?Dx(Dd.bind(null,e)):iu(Dd.bind(null,e)),Nx(function(){!(pe&6)&&hr()}),n=null;else{switch(Oc(a)){case 1:n=Rs;break;case 4:n=Ac;break;case 16:n=lo;break;case 536870912:n=Lc;break;default:n=lo}n=lp(n,Zu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Zu(e,t){if(Ka=-1,Xa=0,pe&6)throw Error(q(327));var n=e.callbackNode;if(rn()&&e.callbackNode!==n)return null;var a=so(e,e===Fe?qe:0);if(a===0)return null;if(a&30||a&e.expiredLanes||t)t=No(e,a);else{t=a;var o=pe;pe|=2;var l=tp();(Fe!==e||qe!==t)&&($t=null,cn=Te()+500,kr(e,t));do try{Kx();break}catch(i){ep(e,i)}while(!0);Gs(),ko.current=l,pe=o,Ie!==null?t=0:(Fe=null,qe=0,t=Be)}if(t!==0){if(t===2&&(o=Vl(e),o!==0&&(a=o,t=ys(e,o))),t===1)throw n=la,kr(e,0),tr(e,a),at(e,Te()),n;if(t===6)tr(e,a);else{if(o=e.current.alternate,!(a&30)&&!Gx(o)&&(t=No(e,a),t===2&&(l=Vl(e),l!==0&&(a=l,t=ys(e,l))),t===1))throw n=la,kr(e,0),tr(e,a),at(e,Te()),n;switch(e.finishedWork=o,e.finishedLanes=a,t){case 0:case 1:throw Error(q(345));case 2:yr(e,et,$t);break;case 3:if(tr(e,a),(a&130023424)===a&&(t=ci+500-Te(),10<t)){if(so(e,0)!==0)break;if(o=e.suspendedLanes,(o&a)!==a){Ke(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Zl(yr.bind(null,e,et,$t),t);break}yr(e,et,$t);break;case 4:if(tr(e,a),(a&4194240)===a)break;for(t=e.eventTimes,o=-1;0<a;){var s=31-Dt(a);l=1<<s,s=t[s],s>o&&(o=s),a&=~l}if(a=o,a=Te()-a,a=(120>a?120:480>a?480:1080>a?1080:1920>a?1920:3e3>a?3e3:4320>a?4320:1960*Yx(a/1960))-a,10<a){e.timeoutHandle=Zl(yr.bind(null,e,et,$t),a);break}yr(e,et,$t);break;case 5:yr(e,et,$t);break;default:throw Error(q(329))}}}return at(e,Te()),e.callbackNode===n?Zu.bind(null,e):null}function ys(e,t){var n=Un;return e.current.memoizedState.isDehydrated&&(kr(e,t).flags|=256),e=No(e,t),e!==2&&(t=et,et=n,t!==null&&bs(t)),e}function bs(e){et===null?et=e:et.push.apply(et,e)}function Gx(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var a=0;a<n.length;a++){var o=n[a],l=o.getSnapshot;o=o.value;try{if(!Tt(l(),o))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function tr(e,t){for(t&=~di,t&=~Wo,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Dt(t),a=1<<n;e[n]=-1,t&=~a}}function Dd(e){if(pe&6)throw Error(q(327));rn();var t=so(e,0);if(!(t&1))return at(e,Te()),null;var n=No(e,t);if(e.tag!==0&&n===2){var a=Vl(e);a!==0&&(t=a,n=ys(e,a))}if(n===1)throw n=la,kr(e,0),tr(e,t),at(e,Te()),n;if(n===6)throw Error(q(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,yr(e,et,$t),at(e,Te()),null}function ui(e,t){var n=pe;pe|=1;try{return e(t)}finally{pe=n,pe===0&&(cn=Te()+500,Mo&&hr())}}function Dr(e){nr!==null&&nr.tag===0&&!(pe&6)&&rn();var t=pe;pe|=1;var n=vt.transition,a=ve;try{if(vt.transition=null,ve=1,e)return e()}finally{ve=a,vt.transition=n,pe=t,!(pe&6)&&hr()}}function pi(){dt=Gr.current,Se(Gr)}function kr(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,_x(n)),Ie!==null)for(n=Ie.return;n!==null;){var a=n;switch(Hs(a),a.tag){case 1:a=a.type.childContextTypes,a!=null&&fo();break;case 3:sn(),Se(rt),Se(Ge),ti();break;case 5:ei(a);break;case 4:sn();break;case 13:Se(Ne);break;case 19:Se(Ne);break;case 10:Js(a.type._context);break;case 22:case 23:pi()}n=n.return}if(Fe=e,Ie=e=pr(e.current,null),qe=dt=t,Be=0,la=null,di=Wo=Er=0,et=Un=null,jr!==null){for(t=0;t<jr.length;t++)if(n=jr[t],a=n.interleaved,a!==null){n.interleaved=null;var o=a.next,l=n.pending;if(l!==null){var s=l.next;l.next=o,a.next=s}n.pending=a}jr=null}return e}function ep(e,t){do{var n=Ie;try{if(Gs(),Ya.current=wo,jo){for(var a=Ce.memoizedState;a!==null;){var o=a.queue;o!==null&&(o.pending=null),a=a.next}jo=!1}if(zr=0,Me=Oe=Ce=null,$n=!1,na=0,ii.current=null,n===null||n.return===null){Be=1,la=t,Ie=null;break}e:{var l=e,s=n.return,i=n,d=t;if(t=qe,i.flags|=32768,d!==null&&typeof d=="object"&&typeof d.then=="function"){var u=d,h=i,g=h.tag;if(!(h.mode&1)&&(g===0||g===11||g===15)){var v=h.alternate;v?(h.updateQueue=v.updateQueue,h.memoizedState=v.memoizedState,h.lanes=v.lanes):(h.updateQueue=null,h.memoizedState=null)}var w=hd(s);if(w!==null){w.flags&=-257,vd(w,s,i,l,t),w.mode&1&&gd(l,u,t),t=w,d=u;var N=t.updateQueue;if(N===null){var S=new Set;S.add(d),t.updateQueue=S}else N.add(d);break e}else{if(!(t&1)){gd(l,u,t),fi();break e}d=Error(q(426))}}else if(_e&&i.mode&1){var E=hd(s);if(E!==null){!(E.flags&65536)&&(E.flags|=256),vd(E,s,i,l,t),Qs(dn(d,i));break e}}l=d=dn(d,i),Be!==4&&(Be=2),Un===null?Un=[l]:Un.push(l),l=s;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var m=Ou(l,d,t);cd(l,m);break e;case 1:i=d;var f=l.type,c=l.stateNode;if(!(l.flags&128)&&(typeof f.getDerivedStateFromError=="function"||c!==null&&typeof c.componentDidCatch=="function"&&(cr===null||!cr.has(c)))){l.flags|=65536,t&=-t,l.lanes|=t;var j=Bu(l,i,t);cd(l,j);break e}}l=l.return}while(l!==null)}np(n)}catch(T){t=T,Ie===n&&n!==null&&(Ie=n=n.return);continue}break}while(!0)}function tp(){var e=ko.current;return ko.current=wo,e===null?wo:e}function fi(){(Be===0||Be===3||Be===2)&&(Be=4),Fe===null||!(Er&268435455)&&!(Wo&268435455)||tr(Fe,qe)}function No(e,t){var n=pe;pe|=2;var a=tp();(Fe!==e||qe!==t)&&($t=null,kr(e,t));do try{Jx();break}catch(o){ep(e,o)}while(!0);if(Gs(),pe=n,ko.current=a,Ie!==null)throw Error(q(261));return Fe=null,qe=0,Be}function Jx(){for(;Ie!==null;)rp(Ie)}function Kx(){for(;Ie!==null&&!wf();)rp(Ie)}function rp(e){var t=op(e.alternate,e,dt);e.memoizedProps=e.pendingProps,t===null?np(e):Ie=t,ii.current=null}function np(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=qx(n,t),n!==null){n.flags&=32767,Ie=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Be=6,Ie=null;return}}else if(n=Wx(n,t,dt),n!==null){Ie=n;return}if(t=t.sibling,t!==null){Ie=t;return}Ie=t=e}while(t!==null);Be===0&&(Be=5)}function yr(e,t,n){var a=ve,o=vt.transition;try{vt.transition=null,ve=1,Xx(e,t,n,a)}finally{vt.transition=o,ve=a}return null}function Xx(e,t,n,a){do rn();while(nr!==null);if(pe&6)throw Error(q(327));n=e.finishedWork;var o=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(q(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if(Tf(e,l),e===Fe&&(Ie=Fe=null,qe=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Ba||(Ba=!0,lp(lo,function(){return rn(),null})),l=(n.flags&15990)!==0,n.subtreeFlags&15990||l){l=vt.transition,vt.transition=null;var s=ve;ve=1;var i=pe;pe|=4,ii.current=null,Hx(e,n),Ku(n,e),vx(Kl),io=!!Jl,Kl=Jl=null,e.current=n,Qx(n),kf(),pe=i,ve=s,vt.transition=l}else e.current=n;if(Ba&&(Ba=!1,nr=e,_o=o),l=e.pendingLanes,l===0&&(cr=null),Nf(n.stateNode),at(e,Te()),t!==null)for(a=e.onRecoverableError,n=0;n<t.length;n++)o=t[n],a(o.value,{componentStack:o.stack,digest:o.digest});if(So)throw So=!1,e=hs,hs=null,e;return _o&1&&e.tag!==0&&rn(),l=e.pendingLanes,l&1?e===vs?Wn++:(Wn=0,vs=e):Wn=0,hr(),null}function rn(){if(nr!==null){var e=Oc(_o),t=vt.transition,n=ve;try{if(vt.transition=null,ve=16>e?16:e,nr===null)var a=!1;else{if(e=nr,nr=null,_o=0,pe&6)throw Error(q(331));var o=pe;for(pe|=4,X=e.current;X!==null;){var l=X,s=l.child;if(X.flags&16){var i=l.deletions;if(i!==null){for(var d=0;d<i.length;d++){var u=i[d];for(X=u;X!==null;){var h=X;switch(h.tag){case 0:case 11:case 15:Fn(8,h,l)}var g=h.child;if(g!==null)g.return=h,X=g;else for(;X!==null;){h=X;var v=h.sibling,w=h.return;if(Yu(h),h===u){X=null;break}if(v!==null){v.return=w,X=v;break}X=w}}}var N=l.alternate;if(N!==null){var S=N.child;if(S!==null){N.child=null;do{var E=S.sibling;S.sibling=null,S=E}while(S!==null)}}X=l}}if(l.subtreeFlags&2064&&s!==null)s.return=l,X=s;else e:for(;X!==null;){if(l=X,l.flags&2048)switch(l.tag){case 0:case 11:case 15:Fn(9,l,l.return)}var m=l.sibling;if(m!==null){m.return=l.return,X=m;break e}X=l.return}}var f=e.current;for(X=f;X!==null;){s=X;var c=s.child;if(s.subtreeFlags&2064&&c!==null)c.return=s,X=c;else e:for(s=f;X!==null;){if(i=X,i.flags&2048)try{switch(i.tag){case 0:case 11:case 15:Uo(9,i)}}catch(T){De(i,i.return,T)}if(i===s){X=null;break e}var j=i.sibling;if(j!==null){j.return=i.return,X=j;break e}X=i.return}}if(pe=o,hr(),Rt&&typeof Rt.onPostCommitFiberRoot=="function")try{Rt.onPostCommitFiberRoot(Ao,e)}catch{}a=!0}return a}finally{ve=n,vt.transition=t}}return!1}function Pd(e,t,n){t=dn(n,t),t=Ou(e,t,1),e=dr(e,t,1),t=Ke(),e!==null&&(ca(e,1,t),at(e,t))}function De(e,t,n){if(e.tag===3)Pd(e,e,n);else for(;t!==null;){if(t.tag===3){Pd(t,e,n);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(cr===null||!cr.has(a))){e=dn(n,e),e=Bu(t,e,1),t=dr(t,e,1),e=Ke(),t!==null&&(ca(t,1,e),at(t,e));break}}t=t.return}}function Zx(e,t,n){var a=e.pingCache;a!==null&&a.delete(t),t=Ke(),e.pingedLanes|=e.suspendedLanes&n,Fe===e&&(qe&n)===n&&(Be===4||Be===3&&(qe&130023424)===qe&&500>Te()-ci?kr(e,0):di|=n),at(e,t)}function ap(e,t){t===0&&(e.mode&1?(t=za,za<<=1,!(za&130023424)&&(za=4194304)):t=1);var n=Ke();e=Yt(e,t),e!==null&&(ca(e,t,n),at(e,n))}function em(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),ap(e,n)}function tm(e,t){var n=0;switch(e.tag){case 13:var a=e.stateNode,o=e.memoizedState;o!==null&&(n=o.retryLane);break;case 19:a=e.stateNode;break;default:throw Error(q(314))}a!==null&&a.delete(t),ap(e,n)}var op;op=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||rt.current)tt=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return tt=!1,Ux(e,t,n);tt=!!(e.flags&131072)}else tt=!1,_e&&t.flags&1048576&&du(t,go,t.index);switch(t.lanes=0,t.tag){case 2:var a=t.type;Ja(e,t),e=t.pendingProps;var o=an(t,Ge.current);tn(t,n),o=ni(null,t,a,e,o,n);var l=ai();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,nt(a)?(l=!0,xo(t)):l=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,Xs(t),o.updater=Fo,t.stateNode=o,o._reactInternals=t,ls(t,a,e,n),t=ds(null,t,a,!0,l,n)):(t.tag=0,_e&&l&&Vs(t),Je(null,t,o,n),t=t.child),t;case 16:a=t.elementType;e:{switch(Ja(e,t),e=t.pendingProps,o=a._init,a=o(a._payload),t.type=a,o=t.tag=nm(a),e=Ct(a,e),o){case 0:t=is(null,t,a,e,n);break e;case 1:t=jd(null,t,a,e,n);break e;case 11:t=yd(null,t,a,e,n);break e;case 14:t=bd(null,t,a,Ct(a.type,e),n);break e}throw Error(q(306,a,""))}return t;case 0:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:Ct(a,o),is(e,t,a,o,n);case 1:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:Ct(a,o),jd(e,t,a,o,n);case 3:e:{if(Uu(t),e===null)throw Error(q(387));a=t.pendingProps,l=t.memoizedState,o=l.element,mu(e,t),yo(t,a,null,n);var s=t.memoizedState;if(a=s.element,l.isDehydrated)if(l={element:a,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){o=dn(Error(q(423)),t),t=wd(e,t,a,n,o);break e}else if(a!==o){o=dn(Error(q(424)),t),t=wd(e,t,a,n,o);break e}else for(ct=ir(t.stateNode.containerInfo.firstChild),ut=t,_e=!0,Et=null,n=fu(t,null,a,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(on(),a===o){t=Gt(e,t,n);break e}Je(e,t,a,n)}t=t.child}return t;case 5:return gu(t),e===null&&ns(t),a=t.type,o=t.pendingProps,l=e!==null?e.memoizedProps:null,s=o.children,Xl(a,o)?s=null:l!==null&&Xl(a,l)&&(t.flags|=32),Fu(e,t),Je(e,t,s,n),t.child;case 6:return e===null&&ns(t),null;case 13:return Wu(e,t,n);case 4:return Zs(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=ln(t,null,a,n):Je(e,t,a,n),t.child;case 11:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:Ct(a,o),yd(e,t,a,o,n);case 7:return Je(e,t,t.pendingProps,n),t.child;case 8:return Je(e,t,t.pendingProps.children,n),t.child;case 12:return Je(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(a=t.type._context,o=t.pendingProps,l=t.memoizedProps,s=o.value,we(ho,a._currentValue),a._currentValue=s,l!==null)if(Tt(l.value,s)){if(l.children===o.children&&!rt.current){t=Gt(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var i=l.dependencies;if(i!==null){s=l.child;for(var d=i.firstContext;d!==null;){if(d.context===a){if(l.tag===1){d=Vt(-1,n&-n),d.tag=2;var u=l.updateQueue;if(u!==null){u=u.shared;var h=u.pending;h===null?d.next=d:(d.next=h.next,h.next=d),u.pending=d}}l.lanes|=n,d=l.alternate,d!==null&&(d.lanes|=n),as(l.return,n,t),i.lanes|=n;break}d=d.next}}else if(l.tag===10)s=l.type===t.type?null:l.child;else if(l.tag===18){if(s=l.return,s===null)throw Error(q(341));s.lanes|=n,i=s.alternate,i!==null&&(i.lanes|=n),as(s,n,t),s=l.sibling}else s=l.child;if(s!==null)s.return=l;else for(s=l;s!==null;){if(s===t){s=null;break}if(l=s.sibling,l!==null){l.return=s.return,s=l;break}s=s.return}l=s}Je(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,a=t.pendingProps.children,tn(t,n),o=yt(o),a=a(o),t.flags|=1,Je(e,t,a,n),t.child;case 14:return a=t.type,o=Ct(a,t.pendingProps),o=Ct(a.type,o),bd(e,t,a,o,n);case 15:return Mu(e,t,t.type,t.pendingProps,n);case 17:return a=t.type,o=t.pendingProps,o=t.elementType===a?o:Ct(a,o),Ja(e,t),t.tag=1,nt(a)?(e=!0,xo(t)):e=!1,tn(t,n),Ru(t,a,o),ls(t,a,o,n),ds(null,t,a,!0,e,n);case 19:return qu(e,t,n);case 22:return $u(e,t,n)}throw Error(q(156,t.tag))};function lp(e,t){return Ic(e,t)}function rm(e,t,n,a){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ht(e,t,n,a){return new rm(e,t,n,a)}function xi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function nm(e){if(typeof e=="function")return xi(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Is)return 11;if(e===As)return 14}return 2}function pr(e,t){var n=e.alternate;return n===null?(n=ht(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Za(e,t,n,a,o,l){var s=2;if(a=e,typeof e=="function")xi(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case Mr:return Sr(n.children,o,l,t);case Ts:s=8,o|=8;break;case Dl:return e=ht(12,n,t,o|2),e.elementType=Dl,e.lanes=l,e;case Pl:return e=ht(13,n,t,o),e.elementType=Pl,e.lanes=l,e;case Tl:return e=ht(19,n,t,o),e.elementType=Tl,e.lanes=l,e;case gc:return qo(n,o,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case xc:s=10;break e;case mc:s=9;break e;case Is:s=11;break e;case As:s=14;break e;case Xt:s=16,a=null;break e}throw Error(q(130,e==null?e:typeof e,""))}return t=ht(s,n,t,o),t.elementType=e,t.type=a,t.lanes=l,t}function Sr(e,t,n,a){return e=ht(7,e,a,t),e.lanes=n,e}function qo(e,t,n,a){return e=ht(22,e,a,t),e.elementType=gc,e.lanes=n,e.stateNode={isHidden:!1},e}function kl(e,t,n){return e=ht(6,e,null,t),e.lanes=n,e}function Sl(e,t,n){return t=ht(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function am(e,t,n,a,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=al(0),this.expirationTimes=al(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=al(0),this.identifierPrefix=a,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function mi(e,t,n,a,o,l,s,i,d){return e=new am(e,t,n,i,d),t===1?(t=1,l===!0&&(t|=8)):t=0,l=ht(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:a,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Xs(l),e}function om(e,t,n){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Br,key:a==null?null:""+a,children:e,containerInfo:t,implementation:n}}function sp(e){if(!e)return xr;e=e._reactInternals;e:{if(Ir(e)!==e||e.tag!==1)throw Error(q(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(nt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(q(171))}if(e.tag===1){var n=e.type;if(nt(n))return su(e,n,t)}return t}function ip(e,t,n,a,o,l,s,i,d){return e=mi(n,a,!0,e,o,l,s,i,d),e.context=sp(null),n=e.current,a=Ke(),o=ur(n),l=Vt(a,o),l.callback=t??null,dr(n,l,o),e.current.lanes=o,ca(e,o,a),at(e,a),e}function Vo(e,t,n,a){var o=t.current,l=Ke(),s=ur(o);return n=sp(n),t.context===null?t.context=n:t.pendingContext=n,t=Vt(l,s),t.payload={element:e},a=a===void 0?null:a,a!==null&&(t.callback=a),e=dr(o,t,s),e!==null&&(Pt(e,o,s,l),Qa(e,o,s)),s}function Co(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Td(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function gi(e,t){Td(e,t),(e=e.alternate)&&Td(e,t)}function lm(){return null}var dp=typeof reportError=="function"?reportError:function(e){console.error(e)};function hi(e){this._internalRoot=e}Ho.prototype.render=hi.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(q(409));Vo(e,t,null,null)};Ho.prototype.unmount=hi.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Dr(function(){Vo(null,e,null,null)}),t[Qt]=null}};function Ho(e){this._internalRoot=e}Ho.prototype.unstable_scheduleHydration=function(e){if(e){var t=$c();e={blockedOn:null,target:e,priority:t};for(var n=0;n<er.length&&t!==0&&t<er[n].priority;n++);er.splice(n,0,e),n===0&&Uc(e)}};function vi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Qo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Id(){}function sm(e,t,n,a,o){if(o){if(typeof a=="function"){var l=a;a=function(){var u=Co(s);l.call(u)}}var s=ip(t,a,e,0,null,!1,!1,"",Id);return e._reactRootContainer=s,e[Qt]=s.current,Xn(e.nodeType===8?e.parentNode:e),Dr(),s}for(;o=e.lastChild;)e.removeChild(o);if(typeof a=="function"){var i=a;a=function(){var u=Co(d);i.call(u)}}var d=mi(e,0,!1,null,null,!1,!1,"",Id);return e._reactRootContainer=d,e[Qt]=d.current,Xn(e.nodeType===8?e.parentNode:e),Dr(function(){Vo(t,d,n,a)}),d}function Yo(e,t,n,a,o){var l=n._reactRootContainer;if(l){var s=l;if(typeof o=="function"){var i=o;o=function(){var d=Co(s);i.call(d)}}Vo(t,s,e,o)}else s=sm(n,t,e,o,a);return Co(s)}Bc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=En(t.pendingLanes);n!==0&&(Os(t,n|1),at(t,Te()),!(pe&6)&&(cn=Te()+500,hr()))}break;case 13:Dr(function(){var a=Yt(e,1);if(a!==null){var o=Ke();Pt(a,e,1,o)}}),gi(e,1)}};Bs=function(e){if(e.tag===13){var t=Yt(e,134217728);if(t!==null){var n=Ke();Pt(t,e,134217728,n)}gi(e,134217728)}};Mc=function(e){if(e.tag===13){var t=ur(e),n=Yt(e,t);if(n!==null){var a=Ke();Pt(n,e,t,a)}gi(e,t)}};$c=function(){return ve};Fc=function(e,t){var n=ve;try{return ve=e,t()}finally{ve=n}};Ul=function(e,t,n){switch(t){case"input":if(Ll(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var a=n[t];if(a!==e&&a.form===e.form){var o=Bo(a);if(!o)throw Error(q(90));vc(a),Ll(a,o)}}}break;case"textarea":bc(e,n);break;case"select":t=n.value,t!=null&&Kr(e,!!n.multiple,t,!1)}};Cc=ui;zc=Dr;var im={usingClientEntryPoint:!1,Events:[pa,Wr,Bo,_c,Nc,ui]},Nn={findFiberByHostInstance:br,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},dm={bundleType:Nn.bundleType,version:Nn.version,rendererPackageName:Nn.rendererPackageName,rendererConfig:Nn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Jt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Pc(e),e===null?null:e.stateNode},findFiberByHostInstance:Nn.findFiberByHostInstance||lm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ma=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ma.isDisabled&&Ma.supportsFiber)try{Ao=Ma.inject(dm),Rt=Ma}catch{}}ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=im;ft.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!vi(t))throw Error(q(200));return om(e,t,null,n)};ft.createRoot=function(e,t){if(!vi(e))throw Error(q(299));var n=!1,a="",o=dp;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=mi(e,1,!1,null,null,n,!1,a,o),e[Qt]=t.current,Xn(e.nodeType===8?e.parentNode:e),new hi(t)};ft.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(q(188)):(e=Object.keys(e).join(","),Error(q(268,e)));return e=Pc(t),e=e===null?null:e.stateNode,e};ft.flushSync=function(e){return Dr(e)};ft.hydrate=function(e,t,n){if(!Qo(t))throw Error(q(200));return Yo(null,e,t,!0,n)};ft.hydrateRoot=function(e,t,n){if(!vi(e))throw Error(q(405));var a=n!=null&&n.hydratedSources||null,o=!1,l="",s=dp;if(n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=ip(t,null,e,1,n??null,o,!1,l,s),e[Qt]=t.current,Xn(e),a)for(e=0;e<a.length;e++)n=a[e],o=n._getVersion,o=o(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,o]:t.mutableSourceEagerHydrationData.push(n,o);return new Ho(t)};ft.render=function(e,t,n){if(!Qo(t))throw Error(q(200));return Yo(null,e,t,!1,n)};ft.unmountComponentAtNode=function(e){if(!Qo(e))throw Error(q(40));return e._reactRootContainer?(Dr(function(){Yo(null,null,e,!1,function(){e._reactRootContainer=null,e[Qt]=null})}),!0):!1};ft.unstable_batchedUpdates=ui;ft.unstable_renderSubtreeIntoContainer=function(e,t,n,a){if(!Qo(n))throw Error(q(200));if(e==null||e._reactInternals===void 0)throw Error(q(38));return Yo(e,t,n,!1,a)};ft.version="18.3.1-next-f1338f8080-20240426";function cp(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(cp)}catch(e){console.error(e)}}cp(),cc.exports=ft;var cm=cc.exports,Ad=cm;zl.createRoot=Ad.createRoot,zl.hydrateRoot=Ad.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function sa(){return sa=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},sa.apply(this,arguments)}var ar;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(ar||(ar={}));const Ld="popstate";function um(e){e===void 0&&(e={});function t(a,o){let{pathname:l,search:s,hash:i}=a.location;return js("",{pathname:l,search:s,hash:i},o.state&&o.state.usr||null,o.state&&o.state.key||"default")}function n(a,o){return typeof o=="string"?o:up(o)}return fm(t,n,null,e)}function Ae(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function yi(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function pm(){return Math.random().toString(36).substr(2,8)}function Rd(e,t){return{usr:e.state,key:e.key,idx:t}}function js(e,t,n,a){return n===void 0&&(n=null),sa({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?mn(t):t,{state:n,key:t&&t.key||a||pm()})}function up(e){let{pathname:t="/",search:n="",hash:a=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),a&&a!=="#"&&(t+=a.charAt(0)==="#"?a:"#"+a),t}function mn(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let a=e.indexOf("?");a>=0&&(t.search=e.substr(a),e=e.substr(0,a)),e&&(t.pathname=e)}return t}function fm(e,t,n,a){a===void 0&&(a={});let{window:o=document.defaultView,v5Compat:l=!1}=a,s=o.history,i=ar.Pop,d=null,u=h();u==null&&(u=0,s.replaceState(sa({},s.state,{idx:u}),""));function h(){return(s.state||{idx:null}).idx}function g(){i=ar.Pop;let E=h(),m=E==null?null:E-u;u=E,d&&d({action:i,location:S.location,delta:m})}function v(E,m){i=ar.Push;let f=js(S.location,E,m);u=h()+1;let c=Rd(f,u),j=S.createHref(f);try{s.pushState(c,"",j)}catch(T){if(T instanceof DOMException&&T.name==="DataCloneError")throw T;o.location.assign(j)}l&&d&&d({action:i,location:S.location,delta:1})}function w(E,m){i=ar.Replace;let f=js(S.location,E,m);u=h();let c=Rd(f,u),j=S.createHref(f);s.replaceState(c,"",j),l&&d&&d({action:i,location:S.location,delta:0})}function N(E){let m=o.location.origin!=="null"?o.location.origin:o.location.href,f=typeof E=="string"?E:up(E);return f=f.replace(/ $/,"%20"),Ae(m,"No window.location.(origin|href) available to create URL for href: "+f),new URL(f,m)}let S={get action(){return i},get location(){return e(o,s)},listen(E){if(d)throw new Error("A history only accepts one active listener");return o.addEventListener(Ld,g),d=E,()=>{o.removeEventListener(Ld,g),d=null}},createHref(E){return t(o,E)},createURL:N,encodeLocation(E){let m=N(E);return{pathname:m.pathname,search:m.search,hash:m.hash}},push:v,replace:w,go(E){return s.go(E)}};return S}var Od;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(Od||(Od={}));function xm(e,t,n){return n===void 0&&(n="/"),mm(e,t,n)}function mm(e,t,n,a){let o=typeof t=="string"?mn(t):t,l=xp(o.pathname||"/",n);if(l==null)return null;let s=pp(e);gm(s);let i=null;for(let d=0;i==null&&d<s.length;++d){let u=zm(l);i=_m(s[d],u)}return i}function pp(e,t,n,a){t===void 0&&(t=[]),n===void 0&&(n=[]),a===void 0&&(a="");let o=(l,s,i)=>{let d={relativePath:i===void 0?l.path||"":i,caseSensitive:l.caseSensitive===!0,childrenIndex:s,route:l};d.relativePath.startsWith("/")&&(Ae(d.relativePath.startsWith(a),'Absolute route path "'+d.relativePath+'" nested under path '+('"'+a+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),d.relativePath=d.relativePath.slice(a.length));let u=_r([a,d.relativePath]),h=n.concat(d);l.children&&l.children.length>0&&(Ae(l.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+u+'".')),pp(l.children,t,h,u)),!(l.path==null&&!l.index)&&t.push({path:u,score:km(u,l.index),routesMeta:h})};return e.forEach((l,s)=>{var i;if(l.path===""||!((i=l.path)!=null&&i.includes("?")))o(l,s);else for(let d of fp(l.path))o(l,s,d)}),t}function fp(e){let t=e.split("/");if(t.length===0)return[];let[n,...a]=t,o=n.endsWith("?"),l=n.replace(/\?$/,"");if(a.length===0)return o?[l,""]:[l];let s=fp(a.join("/")),i=[];return i.push(...s.map(d=>d===""?l:[l,d].join("/"))),o&&i.push(...s),i.map(d=>e.startsWith("/")&&d===""?"/":d)}function gm(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Sm(t.routesMeta.map(a=>a.childrenIndex),n.routesMeta.map(a=>a.childrenIndex)))}const hm=/^:[\w-]+$/,vm=3,ym=2,bm=1,jm=10,wm=-2,Bd=e=>e==="*";function km(e,t){let n=e.split("/"),a=n.length;return n.some(Bd)&&(a+=wm),t&&(a+=ym),n.filter(o=>!Bd(o)).reduce((o,l)=>o+(hm.test(l)?vm:l===""?bm:jm),a)}function Sm(e,t){return e.length===t.length&&e.slice(0,-1).every((a,o)=>a===t[o])?e[e.length-1]-t[t.length-1]:0}function _m(e,t,n){let{routesMeta:a}=e,o={},l="/",s=[];for(let i=0;i<a.length;++i){let d=a[i],u=i===a.length-1,h=l==="/"?t:t.slice(l.length)||"/",g=Nm({path:d.relativePath,caseSensitive:d.caseSensitive,end:u},h),v=d.route;if(!g)return null;Object.assign(o,g.params),s.push({params:o,pathname:_r([l,g.pathname]),pathnameBase:Im(_r([l,g.pathnameBase])),route:v}),g.pathnameBase!=="/"&&(l=_r([l,g.pathnameBase]))}return s}function Nm(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,a]=Cm(e.path,e.caseSensitive,e.end),o=t.match(n);if(!o)return null;let l=o[0],s=l.replace(/(.)\/+$/,"$1"),i=o.slice(1);return{params:a.reduce((u,h,g)=>{let{paramName:v,isOptional:w}=h;if(v==="*"){let S=i[g]||"";s=l.slice(0,l.length-S.length).replace(/(.)\/+$/,"$1")}const N=i[g];return w&&!N?u[v]=void 0:u[v]=(N||"").replace(/%2F/g,"/"),u},{}),pathname:l,pathnameBase:s,pattern:e}}function Cm(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),yi(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let a=[],o="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(s,i,d)=>(a.push({paramName:i,isOptional:d!=null}),d?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(a.push({paramName:"*"}),o+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?o+="\\/*$":e!==""&&e!=="/"&&(o+="(?:(?=\\/|$))"),[new RegExp(o,t?void 0:"i"),a]}function zm(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return yi(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function xp(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,a=e.charAt(n);return a&&a!=="/"?null:e.slice(n)||"/"}const Em=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Dm=e=>Em.test(e);function Pm(e,t){t===void 0&&(t="/");let{pathname:n,search:a="",hash:o=""}=typeof e=="string"?mn(e):e,l;if(n)if(Dm(n))l=n;else{if(n.includes("//")){let s=n;n=n.replace(/\/\/+/g,"/"),yi(!1,"Pathnames cannot have embedded double slashes - normalizing "+(s+" -> "+n))}n.startsWith("/")?l=Md(n.substring(1),"/"):l=Md(n,t)}else l=t;return{pathname:l,search:Am(a),hash:Lm(o)}}function Md(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(o=>{o===".."?n.length>1&&n.pop():o!=="."&&n.push(o)}),n.length>1?n.join("/"):"/"}function _l(e,t,n,a){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(a)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function Tm(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function mp(e,t){let n=Tm(e);return t?n.map((a,o)=>o===n.length-1?a.pathname:a.pathnameBase):n.map(a=>a.pathnameBase)}function gp(e,t,n,a){a===void 0&&(a=!1);let o;typeof e=="string"?o=mn(e):(o=sa({},e),Ae(!o.pathname||!o.pathname.includes("?"),_l("?","pathname","search",o)),Ae(!o.pathname||!o.pathname.includes("#"),_l("#","pathname","hash",o)),Ae(!o.search||!o.search.includes("#"),_l("#","search","hash",o)));let l=e===""||o.pathname==="",s=l?"/":o.pathname,i;if(s==null)i=n;else{let g=t.length-1;if(!a&&s.startsWith("..")){let v=s.split("/");for(;v[0]==="..";)v.shift(),g-=1;o.pathname=v.join("/")}i=g>=0?t[g]:"/"}let d=Pm(o,i),u=s&&s!=="/"&&s.endsWith("/"),h=(l||s===".")&&n.endsWith("/");return!d.pathname.endsWith("/")&&(u||h)&&(d.pathname+="/"),d}const _r=e=>e.join("/").replace(/\/\/+/g,"/"),Im=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Am=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Lm=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Rm(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const hp=["post","put","patch","delete"];new Set(hp);const Om=["get",...hp];new Set(Om);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ia(){return ia=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},ia.apply(this,arguments)}const bi=p.createContext(null),Bm=p.createContext(null),xa=p.createContext(null),Go=p.createContext(null),Ar=p.createContext({outlet:null,matches:[],isDataRoute:!1}),vp=p.createContext(null);function ma(){return p.useContext(Go)!=null}function ji(){return ma()||Ae(!1),p.useContext(Go).location}function yp(e){p.useContext(xa).static||p.useLayoutEffect(e)}function wi(){let{isDataRoute:e}=p.useContext(Ar);return e?Km():Mm()}function Mm(){ma()||Ae(!1);let e=p.useContext(bi),{basename:t,future:n,navigator:a}=p.useContext(xa),{matches:o}=p.useContext(Ar),{pathname:l}=ji(),s=JSON.stringify(mp(o,n.v7_relativeSplatPath)),i=p.useRef(!1);return yp(()=>{i.current=!0}),p.useCallback(function(u,h){if(h===void 0&&(h={}),!i.current)return;if(typeof u=="number"){a.go(u);return}let g=gp(u,JSON.parse(s),l,h.relative==="path");e==null&&t!=="/"&&(g.pathname=g.pathname==="/"?t:_r([t,g.pathname])),(h.replace?a.replace:a.push)(g,h.state,h)},[t,a,s,l,e])}function $m(e,t){return Fm(e,t)}function Fm(e,t,n,a){ma()||Ae(!1);let{navigator:o}=p.useContext(xa),{matches:l}=p.useContext(Ar),s=l[l.length-1],i=s?s.params:{};s&&s.pathname;let d=s?s.pathnameBase:"/";s&&s.route;let u=ji(),h;if(t){var g;let E=typeof t=="string"?mn(t):t;d==="/"||(g=E.pathname)!=null&&g.startsWith(d)||Ae(!1),h=E}else h=u;let v=h.pathname||"/",w=v;if(d!=="/"){let E=d.replace(/^\//,"").split("/");w="/"+v.replace(/^\//,"").split("/").slice(E.length).join("/")}let N=xm(e,{pathname:w}),S=Hm(N&&N.map(E=>Object.assign({},E,{params:Object.assign({},i,E.params),pathname:_r([d,o.encodeLocation?o.encodeLocation(E.pathname).pathname:E.pathname]),pathnameBase:E.pathnameBase==="/"?d:_r([d,o.encodeLocation?o.encodeLocation(E.pathnameBase).pathname:E.pathnameBase])})),l,n,a);return t&&S?p.createElement(Go.Provider,{value:{location:ia({pathname:"/",search:"",hash:"",state:null,key:"default"},h),navigationType:ar.Pop}},S):S}function Um(){let e=Jm(),t=Rm(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,o={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return p.createElement(p.Fragment,null,p.createElement("h2",null,"Unexpected Application Error!"),p.createElement("h3",{style:{fontStyle:"italic"}},t),n?p.createElement("pre",{style:o},n):null,null)}const Wm=p.createElement(Um,null);class qm extends p.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?p.createElement(Ar.Provider,{value:this.props.routeContext},p.createElement(vp.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Vm(e){let{routeContext:t,match:n,children:a}=e,o=p.useContext(bi);return o&&o.static&&o.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(o.staticContext._deepestRenderedBoundaryId=n.route.id),p.createElement(Ar.Provider,{value:t},a)}function Hm(e,t,n,a){var o;if(t===void 0&&(t=[]),n===void 0&&(n=null),a===void 0&&(a=null),e==null){var l;if(!n)return null;if(n.errors)e=n.matches;else if((l=a)!=null&&l.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let s=e,i=(o=n)==null?void 0:o.errors;if(i!=null){let h=s.findIndex(g=>g.route.id&&(i==null?void 0:i[g.route.id])!==void 0);h>=0||Ae(!1),s=s.slice(0,Math.min(s.length,h+1))}let d=!1,u=-1;if(n&&a&&a.v7_partialHydration)for(let h=0;h<s.length;h++){let g=s[h];if((g.route.HydrateFallback||g.route.hydrateFallbackElement)&&(u=h),g.route.id){let{loaderData:v,errors:w}=n,N=g.route.loader&&v[g.route.id]===void 0&&(!w||w[g.route.id]===void 0);if(g.route.lazy||N){d=!0,u>=0?s=s.slice(0,u+1):s=[s[0]];break}}}return s.reduceRight((h,g,v)=>{let w,N=!1,S=null,E=null;n&&(w=i&&g.route.id?i[g.route.id]:void 0,S=g.route.errorElement||Wm,d&&(u<0&&v===0?(Xm("route-fallback"),N=!0,E=null):u===v&&(N=!0,E=g.route.hydrateFallbackElement||null)));let m=t.concat(s.slice(0,v+1)),f=()=>{let c;return w?c=S:N?c=E:g.route.Component?c=p.createElement(g.route.Component,null):g.route.element?c=g.route.element:c=h,p.createElement(Vm,{match:g,routeContext:{outlet:h,matches:m,isDataRoute:n!=null},children:c})};return n&&(g.route.ErrorBoundary||g.route.errorElement||v===0)?p.createElement(qm,{location:n.location,revalidation:n.revalidation,component:S,error:w,children:f(),routeContext:{outlet:null,matches:m,isDataRoute:!0}}):f()},null)}var bp=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(bp||{}),jp=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(jp||{});function Qm(e){let t=p.useContext(bi);return t||Ae(!1),t}function Ym(e){let t=p.useContext(Bm);return t||Ae(!1),t}function Gm(e){let t=p.useContext(Ar);return t||Ae(!1),t}function wp(e){let t=Gm(),n=t.matches[t.matches.length-1];return n.route.id||Ae(!1),n.route.id}function Jm(){var e;let t=p.useContext(vp),n=Ym(),a=wp();return t!==void 0?t:(e=n.errors)==null?void 0:e[a]}function Km(){let{router:e}=Qm(bp.UseNavigateStable),t=wp(jp.UseNavigateStable),n=p.useRef(!1);return yp(()=>{n.current=!0}),p.useCallback(function(o,l){l===void 0&&(l={}),n.current&&(typeof o=="number"?e.navigate(o):e.navigate(o,ia({fromRouteId:t},l)))},[e,t])}const $d={};function Xm(e,t,n){$d[e]||($d[e]=!0)}function Zm(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function kp(e){let{to:t,replace:n,state:a,relative:o}=e;ma()||Ae(!1);let{future:l,static:s}=p.useContext(xa),{matches:i}=p.useContext(Ar),{pathname:d}=ji(),u=wi(),h=gp(t,mp(i,l.v7_relativeSplatPath),d,o==="path"),g=JSON.stringify(h);return p.useEffect(()=>u(JSON.parse(g),{replace:n,state:a,relative:o}),[u,g,o,n,a]),null}function eo(e){Ae(!1)}function eg(e){let{basename:t="/",children:n=null,location:a,navigationType:o=ar.Pop,navigator:l,static:s=!1,future:i}=e;ma()&&Ae(!1);let d=t.replace(/^\/*/,"/"),u=p.useMemo(()=>({basename:d,navigator:l,static:s,future:ia({v7_relativeSplatPath:!1},i)}),[d,i,l,s]);typeof a=="string"&&(a=mn(a));let{pathname:h="/",search:g="",hash:v="",state:w=null,key:N="default"}=a,S=p.useMemo(()=>{let E=xp(h,d);return E==null?null:{location:{pathname:E,search:g,hash:v,state:w,key:N},navigationType:o}},[d,h,g,v,w,N,o]);return S==null?null:p.createElement(xa.Provider,{value:u},p.createElement(Go.Provider,{children:n,value:S}))}function tg(e){let{children:t,location:n}=e;return $m(ws(t),n)}new Promise(()=>{});function ws(e,t){t===void 0&&(t=[]);let n=[];return p.Children.forEach(e,(a,o)=>{if(!p.isValidElement(a))return;let l=[...t,o];if(a.type===p.Fragment){n.push.apply(n,ws(a.props.children,l));return}a.type!==eo&&Ae(!1),!a.props.index||!a.props.children||Ae(!1);let s={id:a.props.id||l.join("-"),caseSensitive:a.props.caseSensitive,element:a.props.element,Component:a.props.Component,index:a.props.index,path:a.props.path,loader:a.props.loader,action:a.props.action,errorElement:a.props.errorElement,ErrorBoundary:a.props.ErrorBoundary,hasErrorBoundary:a.props.ErrorBoundary!=null||a.props.errorElement!=null,shouldRevalidate:a.props.shouldRevalidate,handle:a.props.handle,lazy:a.props.lazy};a.props.children&&(s.children=ws(a.props.children,l)),n.push(s)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const rg="6";try{window.__reactRouterVersion=rg}catch{}const ng="startTransition",Fd=Xp[ng];function ag(e){let{basename:t,children:n,future:a,window:o}=e,l=p.useRef();l.current==null&&(l.current=um({window:o,v5Compat:!0}));let s=l.current,[i,d]=p.useState({action:s.action,location:s.location}),{v7_startTransition:u}=a||{},h=p.useCallback(g=>{u&&Fd?Fd(()=>d(g)):d(g)},[d,u]);return p.useLayoutEffect(()=>s.listen(h),[s,h]),p.useEffect(()=>Zm(a),[a]),p.createElement(eg,{basename:t,children:n,location:i.location,navigationType:i.action,navigator:s,future:a})}var Ud;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(Ud||(Ud={}));var Wd;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(Wd||(Wd={}));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const og=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Sp=(...e)=>e.filter((t,n,a)=>!!t&&a.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var lg={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sg=p.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:o="",children:l,iconNode:s,...i},d)=>p.createElement("svg",{ref:d,...lg,width:t,height:t,stroke:e,strokeWidth:a?Number(n)*24/Number(t):n,className:Sp("lucide",o),...i},[...s.map(([u,h])=>p.createElement(u,h)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=(e,t)=>{const n=p.forwardRef(({className:a,...o},l)=>p.createElement(sg,{ref:l,iconNode:t,className:Sp(`lucide-${og(e)}`,a),...o}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ig=ne("ArrowUpDown",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _p=ne("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zo=ne("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Np=ne("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const to=ne("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dg=ne("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cg=ne("ChevronsLeft",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ug=ne("ChevronsRight",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eo=ne("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $a=ne("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ks=ne("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pg=ne("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fg=ne("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cp=ne("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zp=ne("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xg=ne("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pn=ne("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tn=ne("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Do=ne("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ki=ne("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mg=ne("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gg=ne("GripVertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hg=ne("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vg=ne("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yg=ne("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bg=ne("ListTodo",[["rect",{x:"3",y:"5",width:"6",height:"6",rx:"1",key:"1defrl"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const In=ne("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jr=ne("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jg=ne("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wg=ne("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ep=ne("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kg=ne("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sg=ne("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _g=ne("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ng=ne("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cg=ne("Pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qt=ne("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nl=ne("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zg=ne("ScrollText",[["path",{d:"M15 12h-5",key:"r7krc0"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pr=ne("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ss=ne("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eg=ne("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dg=ne("SlidersVertical",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pg=ne("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tg=ne("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dp=ne("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ig=ne("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ag=ne("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jo=ne("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pp=ne("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.436.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const un=ne("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function Lg({onLogout:e,onToggleSidebar:t,sidenavCollapsed:n}){var P,_;const[a,o]=p.useState(()=>new Date().toLocaleTimeString("en-IN")),[l,s]=p.useState([]),[i,d]=p.useState(""),[u,h]=p.useState(""),[g,v]=p.useState(!1),w=p.useRef(null),N=JSON.parse(localStorage.getItem("user")||"{}"),S=localStorage.getItem("token"),[E,m]=p.useState(()=>{const z=localStorage.getItem("erp_theme");return z?z==="dark":!0}),[f,c]=p.useState(()=>localStorage.getItem("erp_company_name")||"Vyom ERP"),[j,T]=p.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing");p.useEffect(()=>{const z=localStorage.getItem("erp_theme"),F=z?z==="dark":!0;document.documentElement.setAttribute("data-theme",F?"dark":"light"),m(F)},[]);const I=()=>{const z=!E;m(z),localStorage.setItem("erp_theme",z?"dark":"light"),document.documentElement.setAttribute("data-theme",z?"dark":"light")};p.useEffect(()=>{const z=setInterval(()=>{o(new Date().toLocaleTimeString("en-IN"))},1e3);x();const F=B=>{B.detail&&B.detail.orderId!==void 0?d(B.detail.orderId||""):B.detail&&B.detail.orderId===null&&d("")};window.addEventListener("setView",F);const A=()=>{x()};window.addEventListener("orderUpdated",A);const Q=B=>{w.current&&!w.current.contains(B.target)&&v(!1)};document.addEventListener("mousedown",Q);const M=()=>{c(localStorage.getItem("erp_company_name")||"Vyom ERP"),T(localStorage.getItem("erp_system_title")||"Control Panel Manufacturing")};return window.addEventListener("erpSettingsUpdated",M),()=>{clearInterval(z),window.removeEventListener("setView",F),window.removeEventListener("orderUpdated",A),document.removeEventListener("mousedown",Q),window.removeEventListener("erpSettingsUpdated",M)}},[]),p.useEffect(()=>{if(i&&l.length>0){const z=l.find(F=>F.id==i);z&&h(z.order_number)}else i||h("")},[i,l]);const x=async()=>{if(S)try{const z=await fetch(window.API_BASE+"/api/orders",{headers:{Authorization:`Bearer ${S}`}});if(z.ok){const F=await z.json();s(F)}}catch(z){console.error("Header fetch error:",z)}},D=(z,F)=>{d(z),h(F||""),v(!1),z?window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:parseInt(z)}})):window.dispatchEvent(new CustomEvent("setView",{detail:{view:"board",orderId:null}}))},U=i&&u.trim()===(((P=l.find(z=>z.id==i))==null?void 0:P.order_number)||""),k=l.filter(z=>{const F=U?"":u.trim().toLowerCase();if(!F)return!0;const A=F.split(/\s+/),Q=(z.order_number||"").toLowerCase(),M=(z.company_name||"").toLowerCase(),B=(z.po_number||"").toLowerCase();return A.every(V=>Q.includes(V)||M.includes(V)||B.includes(V))});return r.jsxs("div",{className:"header",children:[r.jsxs("div",{className:"header-left",children:[r.jsx("button",{className:"sidebar-toggle-btn",onClick:t,title:n?"Expand Sidebar":"Collapse Sidebar","aria-label":n?"Expand Sidebar":"Collapse Sidebar",children:r.jsx(Sg,{size:16})}),r.jsx("div",{className:"logo",children:f}),r.jsx("div",{className:"header-title",children:j})]}),r.jsxs("div",{className:"header-right",children:[r.jsxs("div",{className:"user-info",children:[r.jsx(Jo,{size:14,className:"user-icon"}),r.jsx("span",{className:"user-name",children:N.username||"User"}),r.jsx("span",{className:`role-badge role-${(_=N.role)==null?void 0:_.toLowerCase()}`,children:N.role||"Viewer"})]}),r.jsxs("div",{className:"order-selector",ref:w,children:[r.jsx(Pr,{size:14,className:"search-icon"}),r.jsx("input",{type:"text",className:"order-search-input",placeholder:"Search Order...",value:u,onFocus:()=>v(!0),onChange:z=>{h(z.target.value),v(!0)}}),i&&r.jsx("button",{className:"clear-search",onClick:z=>{z.stopPropagation(),D("","")},title:"Clear Selection",children:"×"}),g&&r.jsxs("div",{className:"search-dropdown-menu",children:[r.jsx("div",{className:`search-dropdown-item ${i?"":"active"}`,onClick:()=>D("",""),children:"View All Orders (Board)"}),k.length>0?k.map(z=>r.jsxs("div",{className:`search-dropdown-item ${i==z.id?"active":""}`,onClick:()=>D(z.id,z.order_number),children:[r.jsx("div",{style:{fontWeight:600},children:z.order_number}),z.company_name&&r.jsx("div",{style:{fontSize:"10px",color:"#888"},children:z.company_name})]},z.id)):r.jsx("div",{className:"search-dropdown-item empty",children:"No orders found"})]})]}),r.jsx("div",{className:"clock-wrapper",children:a}),r.jsxs("button",{onClick:I,title:E?"Switch to Light Mode":"Switch to Dark Mode",className:"theme-toggle-btn",children:[E?r.jsx(Tg,{size:13}):r.jsx(Ng,{size:13}),r.jsx("span",{className:"theme-toggle-text",children:E?"Light":"Dark"})]}),r.jsxs("button",{onClick:e,className:"logout-btn",children:[r.jsx(wg,{size:14,className:"logout-icon"}),r.jsx("span",{className:"logout-text",children:"Logout"})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const Bt=[{id:"Sales",color:"var(--teal)",label:"Sales",sub:"Customer interface"},{id:"Design",color:"var(--purple)",label:"Design",sub:"Engineering"},{id:"Purchase",color:"var(--orange)",label:"Purchase",sub:"Procurement"},{id:"Stores",color:"var(--green)",label:"Stores",sub:"Stock & Issue"},{id:"Production",color:"var(--red)",label:"Production",sub:"Manufacturing"},{id:"QC",color:"var(--blue)",label:"QC",sub:"Quality Control"},{id:"Dispatch",color:"var(--text2)",label:"Dispatch",sub:"Logistics"},{id:"Accounts",color:"var(--text2)",label:"Accounts",sub:"Billing"}];An(new Date),An(new Date),An(new Date),An(new Date);function An(e){return e.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}const $e={pending:{cls:"badge-pending",label:"PENDING"},inprogress:{cls:"badge-inprogress",label:"IN PROGRESS"},done:{cls:"badge-done",label:"DONE"},blocked:{cls:"badge-blocked",label:"BLOCKED"},review:{cls:"badge-review",label:"REVIEW"}},Rg=[{id:"board",icon:yg,label:"Board",roles:null},{id:"planning",icon:_p,label:"Planning",roles:["Admin","Manager","Planning"]},{id:"orders",icon:fg,label:"Orders",roles:null},{id:"documents",icon:Do,label:"Documents",roles:null},{id:"new-order",icon:pg,label:"New Order",roles:["Admin","Manager","Sales"]},{id:"masters",icon:zp,label:"Masters",roles:["Admin","Manager","Sales"]},{id:"import",icon:Ig,label:"Import",roles:["Admin","Manager","Sales"]},{id:"worklist",icon:bg,label:"My Worklist",roles:["Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Sales"]}],Og=[{id:"users",icon:Pp,label:"User Directory"},{id:"logs",icon:zg,label:"System Logs"},{id:"settings",icon:Ss,label:"System Settings"}];function qd({item:e,isActive:t,onClick:n}){const a=e.icon;return r.jsxs("button",{className:`dept-btn${t?" active":""}`,onClick:n,title:e.label,children:[r.jsx(a,{size:16,className:"nav-icon"}),r.jsx("span",{className:"nav-label",children:e.label})]})}function Bg({steps:e,currentFilter:t,onFilterDept:n,currentView:a,onSetView:o,userRole:l,collapsed:s=!1}){return r.jsx("aside",{className:`sidenav${s?" sidenav--collapsed":""}`,children:r.jsxs("div",{className:"sidenav-inner",children:[r.jsxs("div",{className:"sidenav-group",children:[r.jsx("p",{className:"sidenav-label",children:"Workspace"}),Rg.map(i=>i.roles&&!i.roles.includes(l)?null:r.jsx(qd,{item:i,isActive:a===i.id,onClick:()=>o(i.id)},i.id))]}),r.jsxs("div",{className:"sidenav-group",children:[r.jsx("p",{className:"sidenav-label",children:"Departments"}),r.jsxs("button",{className:`dept-btn${t==="all"?" active":""}`,onClick:()=>n("all"),title:"All Departments",children:[r.jsx("span",{className:"dept-dot",style:{background:"var(--accent)"}}),r.jsx("span",{className:"nav-label",children:"All Departments"})]}),Bt.map(i=>{const d=e.filter(h=>h.dept===i.id&&h.status==="done").length,u=e.filter(h=>h.dept===i.id).length;return r.jsxs("button",{className:`dept-btn${t===i.id?" active":""}`,onClick:()=>{n(i.id),o("flow")},title:i.label,children:[r.jsx("span",{className:"dept-dot",style:{background:i.color}}),r.jsx("span",{className:"nav-label",children:i.label}),r.jsx("span",{className:"dept-count nav-count",children:u>0?`${d}/${u}`:"—"})]},i.id)})]}),l==="Admin"&&r.jsxs("div",{className:"sidenav-group sidenav-group--admin",children:[r.jsx("p",{className:"sidenav-label",children:"Admin"}),Og.map(i=>r.jsx(qd,{item:i,isActive:a===i.id,onClick:()=>o(i.id)},i.id))]})]})})}function Mg({deliveryDate:e}){if(!e)return r.jsx("span",{style:{color:"var(--text3)"},children:"—"});const t=Math.ceil((new Date(e)-new Date)/864e5),n=t<0||t<7?"var(--red)":t<14?"var(--accent)":"var(--green)",a=t<0?`${Math.abs(t)}d overdue`:t===0?"today":`${t}d left`;return r.jsx("span",{style:{color:n,fontFamily:"var(--font-mono)",fontSize:14,fontWeight:700},children:a})}function $g({steps:e,currentFilter:t,selectedOrder:n}){const a=t==="all"?e:e.filter(h=>h.dept===t),o=a.filter(h=>h.status==="inprogress").length,l=a.filter(h=>h.status==="blocked").length,s=a.filter(h=>h.status==="done").length,i=a.length;let d="PENDING",u="var(--accent)";return i===0?(d="NO TASKS",u="var(--text3)"):s===i?(d="COMPLETE",u="var(--green)"):l>0?(d="BLOCKED",u="var(--red)"):(s>0||o>0)&&(d="IN PROGRESS",u="var(--blue)"),r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card stat-status",children:[r.jsx("div",{className:"stat-label",children:"Order Status"}),r.jsx("div",{className:"stat-value",style:{color:u,fontSize:13,fontWeight:700,marginTop:4},children:d}),r.jsx("div",{className:"stat-sub",children:(n==null?void 0:n.order_number)||"no order selected"})]}),r.jsxs("div",{className:"stat-card stat-progress",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:o>0?"var(--blue)":"var(--text3)"},children:o}),r.jsx("div",{className:"stat-sub",children:"active steps"})]}),r.jsxs("div",{className:"stat-card stat-blocked",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:l>0?"var(--red)":"var(--text3)"},children:l}),r.jsx("div",{className:"stat-sub",children:l>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card stat-delivery",children:[r.jsx("div",{className:"stat-label",children:"Delivery"}),r.jsx("div",{style:{marginTop:4},children:r.jsx(Mg,{deliveryDate:n==null?void 0:n.delivery_date})}),r.jsx("div",{className:"stat-sub",children:n!=null&&n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"TBD"})]})]})}function Fg(){const[e,t]=p.useState(null),n=localStorage.getItem("token");return p.useEffect(()=>{fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${n}`}}).then(a=>a.ok?a.json():[]).then(a=>{const o=new Date,l=new Date(o);l.setDate(o.getDate()+7);let s=0,i=0,d=0,u=0,h=0;a.forEach(g=>{h+=parseInt(g.line_item_count||0);const v=(g.priority||"Medium").toLowerCase();if((v==="urgent"||v==="high")&&d++,g.delivery_date){const w=new Date(g.delivery_date);w>=o&&w<=l&&u++}(g.steps||[]).forEach(w=>{w.status==="blocked"&&s++,w.status==="inprogress"&&i++})}),t({total:a.length,totalLineItems:h,urgentHigh:d,totalBlocked:s,totalIP:i,dueThisWeek:u})}).catch(()=>t(null))},[n]),e?r.jsxs("div",{className:"stats-row",children:[r.jsxs("div",{className:"stat-card stat-active",children:[r.jsx("div",{className:"stat-label",children:"Active Orders & Items"}),r.jsxs("div",{className:"stat-value",style:{color:"var(--text)"},children:[e.totalLineItems,r.jsxs("span",{style:{fontSize:"13px",color:"var(--text3)",fontWeight:"normal",marginLeft:"6px"},children:["(",e.total," Orders)"]})]}),r.jsx("div",{className:"stat-sub",children:"in pipeline"})]}),r.jsxs("div",{className:"stat-card stat-urgent",children:[r.jsx("div",{className:"stat-label",children:"Urgent / High"}),r.jsx("div",{className:"stat-value",style:{color:e.urgentHigh>0?"var(--accent)":"var(--text3)"},children:e.urgentHigh}),r.jsx("div",{className:"stat-sub",children:"priority orders"})]}),r.jsxs("div",{className:"stat-card stat-progress",children:[r.jsx("div",{className:"stat-label",children:"In Progress"}),r.jsx("div",{className:"stat-value",style:{color:e.totalIP>0?"var(--blue)":"var(--text3)"},children:e.totalIP}),r.jsx("div",{className:"stat-sub",children:"steps across orders"})]}),r.jsxs("div",{className:"stat-card stat-blocked",children:[r.jsx("div",{className:"stat-label",children:"Blocked"}),r.jsx("div",{className:"stat-value",style:{color:e.totalBlocked>0?"var(--red)":"var(--text3)"},children:e.totalBlocked}),r.jsx("div",{className:"stat-sub",children:e.totalBlocked>0?"need attention":"all clear"})]}),r.jsxs("div",{className:"stat-card stat-due",children:[r.jsx("div",{className:"stat-label",children:"Due This Week"}),r.jsx("div",{className:"stat-value",style:{color:e.dueThisWeek>0?"var(--accent)":"var(--text3)"},children:e.dueThisWeek}),r.jsx("div",{className:"stat-sub",children:"orders"})]})]}):r.jsx("div",{className:"stats-row",children:[...Array(5)].map((a,o)=>r.jsxs("div",{className:"stat-card",style:{opacity:.4},children:[r.jsx("div",{className:"stat-label",children:"Loading…"}),r.jsx("div",{className:"stat-value",children:"—"})]},o))})}function Ug({steps:e,currentFilter:t,selectedOrder:n}){return n?r.jsx($g,{steps:e,currentFilter:t,selectedOrder:n}):r.jsx(Fg,{})}const Vd=["General","PO","Quotation","BOM","Drawing","QC Report","Dispatch Document","Photo"],Wg=["Sales","Accounts","Admin","Manager"];function Po({entityType:e,entityId:t,initialDocs:n=[],onUploadSuccess:a,onDocsUpdate:o,readOnly:l=!1,defaultDocType:s="General",userRole:i=null}){const u=!i||Wg.includes(i)?Vd:Vd.filter(P=>P!=="PO"),[h,g]=p.useState(n),[v,w]=p.useState(!1),[N,S]=p.useState(s),[E,m]=p.useState(!0),[f,c]=p.useState(!1),j=localStorage.getItem("token");p.useEffect(()=>{s&&S(s)},[s]),p.useEffect(()=>{t&&(async()=>{try{const _=await fetch(`${window.API_BASE}/api/documents/${e}/${t}`,{headers:{Authorization:`Bearer ${j}`}});if(_.ok){const z=await _.json();g(z)}}catch(_){console.error("Failed to fetch docs",_)}})()},[e,t,j]),p.useEffect(()=>{o&&o(h)},[h,o]);const T=async P=>{if(N==="PO"||N==="Quotation"){if(P.length>1){alert(`${N} can only be a single file.`);return}if(h.some(z=>z.doc_type===N)){alert(`A ${N} already exists. Please delete it first.`);return}}if(h.length+P.length>20){alert("Maximum 20 files allowed per entity.");return}w(!0);const _=new FormData;_.append("entity_type",e),_.append("entity_id",t),_.append("doc_type",N),P.forEach(z=>_.append("files",z));try{const z=await fetch(window.API_BASE+"/api/documents/upload",{method:"POST",headers:{Authorization:`Bearer ${j}`},body:_});if(z.ok){const F=await z.json();g([...h,...F]),a&&a(F)}else{const F=await z.json();alert(F.error||"Upload failed")}}catch(z){console.error("Upload error:",z),alert("Network error during upload")}finally{w(!1)}},I=async P=>{const _=Array.from(P.target.files);_.length!==0&&(await T(_),P.target.value="")},x=P=>{l||(P.preventDefault(),c(!0))},D=()=>{c(!1)},U=async P=>{if(l)return;P.preventDefault(),c(!1);const _=Array.from(P.dataTransfer.files);_.length!==0&&await T(_)},k=async P=>{if(window.confirm("Delete this document?"))try{const _=await fetch(`${window.API_BASE}/api/documents/${P}`,{method:"DELETE",headers:{Authorization:`Bearer ${j}`}});if(_.ok){const z=h.filter(F=>F.id!==P);g(z),a&&a(z)}else{const z=await _.json();alert(z.error||"Failed to delete document")}}catch(_){console.error("Delete error:",_),alert("Network error during deletion")}};return r.jsxs("div",{className:`doc-manager${f?" doc-manager--dragging":""}`,onDragOver:x,onDragLeave:D,onDrop:U,children:[r.jsxs("div",{className:"doc-header",onClick:()=>m(P=>!P),style:{cursor:"pointer",userSelect:"none"},children:[r.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",margin:0},children:[r.jsx("span",{style:{display:"inline-block",fontSize:"10px",transition:"transform 0.2s",transform:E?"rotate(-90deg)":"rotate(0deg)",color:"var(--text3)"},children:"▼"}),"Documents (",h.length,"/20)",h.length>0&&E&&r.jsxs("span",{style:{fontSize:"11px",fontWeight:"400",color:"var(--text3)",background:"var(--bg4)",padding:"1px 7px",borderRadius:"10px",marginLeft:"2px"},children:[h.length," file",h.length!==1?"s":""]})]}),!l&&!E&&r.jsxs("div",{className:"doc-upload-controls",onClick:P=>P.stopPropagation(),children:[r.jsx("select",{value:N,onChange:P=>S(P.target.value),className:"doc-type-select",children:u.map(P=>r.jsx("option",{value:P,children:P},P))}),r.jsxs("label",{className:"upload-btn",children:[v?"Uploading...":"Add Files",r.jsx("input",{type:"file",multiple:!0,hidden:!0,onChange:I,disabled:v||h.length>=20})]})]})]}),!E&&r.jsx("div",{className:"doc-list",children:h.length===0?r.jsx("div",{className:"no-docs",children:f?"Drop files here to upload":"No documents uploaded yet. Drag & drop files here to upload."}):h.map(P=>r.jsxs("div",{className:"doc-item",children:[r.jsxs("div",{className:"doc-info",children:[r.jsx("span",{className:"doc-type-badge",children:P.doc_type}),r.jsx("span",{className:"doc-name",title:P.file_name,children:P.file_name})]}),r.jsxs("div",{className:"doc-meta",children:[r.jsxs("span",{children:[(P.file_size/1024).toFixed(1)," KB"]}),r.jsx("a",{href:`${window.API_BASE}/uploads/${P.file_path.split(/[\/\\]/).pop()}?token=${j}`,target:"_blank",rel:"noopener noreferrer",className:"doc-link",children:"View"}),!l&&r.jsx("button",{onClick:()=>k(P.id),style:{background:"transparent",border:"none",color:"var(--red)",cursor:"pointer",marginLeft:"4px",fontSize:"14px",lineHeight:1},title:"Delete document",children:"✕"})]})]},P.id))}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Hd({status:e}){const{cls:t,label:n}=$e[e]||$e.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function qg({steps:e,currentFilter:t,onOpenModal:n,onSetView:a,userRole:o,selectedOrderId:l,selectedOrder:s,onStepsChanged:i,selectedUnitId:d,setSelectedUnitId:u,unitSteps:h,setUnitSteps:g}){const[v,w]=p.useState([]),[N,S]=p.useState(null),E=localStorage.getItem("token"),[m,f]=p.useState(!1),[c,j]=p.useState(null),[T,I]=p.useState([]),[x,D]=p.useState(null),U=JSON.parse(localStorage.getItem("user")||"{}"),k=c?["Admin","Manager"].includes(o)||c.dept===o||c.assigned_user_id===U.id:!1,[P,_]=p.useState("details"),[z,F]=p.useState(0),A=(()=>{if(!c)return[];try{return Array.isArray(c.custom_fields)?c.custom_fields:JSON.parse(c.custom_fields||"[]")}catch{return[]}})();p.useEffect(()=>{fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${E}`}}).then(async L=>{L.ok&&I(await L.json())}).catch(console.error)},[E]);const Q=async(L,ee)=>{if(!k)return;const Y=h.find(oe=>oe.id===L),be=Y?Y.order_unit_id:d;if(be)try{const oe=await fetch(`${window.API_BASE}/api/units/${be}/steps/${L}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${E}`},body:JSON.stringify(ee)});if(oe.ok){const W=await fetch(`${window.API_BASE}/api/units/${be}/steps`,{headers:{Authorization:`Bearer ${E}`}}).then(je=>je.json());g(W);const Ee=W.find(je=>je.id===L);j(Ee),i&&i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:l}}))}else{const W=await oe.json().catch(()=>({}));D(W.error||"Failed to update step")}}catch(oe){console.error(oe),D("Network error — could not update step")}},M=L=>{D(null),L.order_unit_id?(j(L),_("details"),F(0),f(!0)):n(L.id)},B=e.filter(L=>!L.order_unit_id),V=[...h,...B],C=()=>{const L=(s==null?void 0:s.units)||[];return r.jsxs("div",{className:"unit-selector-container",style:{marginBottom:24,display:"flex",alignItems:"center",gap:12},children:[r.jsx("span",{style:{fontSize:13,color:"var(--text3)",fontWeight:"bold",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Track Level:"}),r.jsxs("select",{className:"form-select",value:d,onChange:ee=>u(ee.target.value),style:{width:"auto",background:"var(--bg3)",fontSize:"13px",padding:"6px 12px",border:"1px solid var(--border2)",color:"var(--text)",borderRadius:"6px",cursor:"pointer"},children:[r.jsx("option",{value:"",children:"Order Milestones"}),L.map(ee=>r.jsxs("option",{value:ee.id,children:["Unit: ",ee.unit_id," (",ee.status,")"]},ee.id))]})]})};p.useEffect(()=>{fetch(window.API_BASE+"/api/task_masters",{headers:{Authorization:`Bearer ${E}`}}).then(async L=>{if(L.ok){const ee=await L.json();w(ee)}}).catch(console.error)},[E]);const $=async L=>{if(!(!L||!l))try{(await fetch(`${window.API_BASE}/api/orders/${l}/steps`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${E}`},body:JSON.stringify({taskId:L})})).ok&&(i&&i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:l}})))}catch(ee){console.error(ee)}},O=(L,ee)=>{S(ee),L.dataTransfer.effectAllowed="move",setTimeout(()=>{L.target.style.opacity="0.5"},0)},de=L=>{L.target.style.opacity="1",S(null)},ue=(L,ee)=>{L.preventDefault(),N&&N.dept!==ee?L.dataTransfer.dropEffect="none":L.dataTransfer.dropEffect="move"},ae=async(L,ee)=>{if(L.preventDefault(),!N||N.id===ee.id||N.dept!==ee.dept)return;const Y=e.filter(he=>he.dept===ee.dept),be=Y.findIndex(he=>he.id===N.id),oe=Y.findIndex(he=>he.id===ee.id);if(be===-1||oe===-1)return;const W=[...Y],[Ee]=W.splice(be,1);W.splice(oe,0,Ee);const je=W.map(he=>he.id);try{(await fetch(`${window.API_BASE}/api/orders/${l}/steps/reorder`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${E}`},body:JSON.stringify({orderedIds:je})})).ok&&i&&(i(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:l}})))}catch(he){console.error("Failed to reorder",he)}},me=[...Bt].sort((L,ee)=>["Admin","Manager"].includes(o)?0:L.id===o?-1:ee.id===o?1:0),se=t==="all"?me:me.filter(L=>L.id===t);return r.jsxs("div",{style:{display:"flex",flexDirection:"column",width:"100%"},children:[C(),t==="all"?r.jsxs("div",{className:"lanes",children:[se.map(L=>{const ee=V.filter(W=>W.dept===L.id),Y=ee.some(W=>W.status==="blocked"),be=!d&&(["Admin","Manager"].includes(o)||L.id===o),oe=v.filter(W=>W.dept===L.id&&!ee.some(Ee=>Ee.task_id===W.id));return r.jsxs("div",{className:`lane${Y?" active-lane":""}`,children:[r.jsxs("div",{className:"lane-label",children:[r.jsx("div",{style:{width:3,height:20,background:L.color,borderRadius:2,marginBottom:6}}),r.jsx("div",{className:"lane-name",children:L.label}),r.jsx("div",{className:"lane-sub",children:L.sub}),L.id==="Sales"&&o==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:12,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),be&&oe.length>0&&l&&!d&&r.jsx("div",{style:{marginTop:12},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:W=>{$(W.target.value),W.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),oe.map(W=>r.jsx("option",{value:W.id,children:W.name},W.id))]})})]}),r.jsxs("div",{className:"lane-steps",children:[ee.map((W,Ee)=>{const je=JSON.parse(localStorage.getItem("user")||"{}"),he=!!W.order_unit_id,H=["Admin","Manager"].includes(o)||W.dept===o||he&&W.assigned_user_id===je.id,Z=!he&&!d&&H;return r.jsxs("div",{style:{display:"flex",alignItems:"center"},draggable:Z,onDragStart:ce=>Z&&O(ce,W),onDragEnd:de,onDragOver:ce=>ue(ce,L.id),onDrop:ce=>Z&&ae(ce,W),children:[r.jsxs("div",{className:`step status-${W.status}${H?"":" read-only"}${W.dept==="Sales"&&W.status==="pending"?" pulse-sales":""}${(N==null?void 0:N.id)===W.id?" dragging":""}`,onClick:()=>M(W),style:{cursor:Z?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${W.status}`}),r.jsxs("div",{className:"step-num",children:[L.id.toUpperCase().slice(0,3),"-",String(Ee+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[W.name,W.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4},children:"📎"})]}),r.jsx("div",{className:"step-sub",children:W.sub}),r.jsx(Hd,{status:W.status}),W.notes&&r.jsx("div",{className:"step-note",children:W.notes})]}),Ee<ee.length-1&&r.jsx("div",{className:"step-arrow",children:"›"})]},he?`unit-${W.id}`:`order-${W.id}`)}),ee.length===0&&r.jsx("div",{style:{padding:12,color:"var(--text3)",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},L.id)}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
            .pulse-sales {
              animation: sales-glow 2s infinite ease-in-out;
              border: 1px solid rgba(20, 184, 166, 0.4) !important;
            }
            @keyframes sales-glow {
              0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
              50% { box-shadow: 0 0 15px 0 rgba(20, 184, 166, 0.4); }
              100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
            }
          `}})]}):r.jsx("div",{className:"flow-card-grid",children:se.map(L=>{const ee=V.filter(W=>W.dept===L.id),Y=ee.some(W=>W.status==="blocked"),be=!d&&(["Admin","Manager"].includes(o)||L.id===o),oe=v.filter(W=>W.dept===L.id&&!ee.some(Ee=>Ee.task_id===W.id));return r.jsxs("div",{className:`dept-flow-card${Y?" has-blocked":""}`,children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:L.color}}),r.jsxs("div",{children:[r.jsx("div",{className:"dept-card-title",children:L.label}),r.jsx("div",{className:"dept-card-sub",children:L.sub})]})]}),s&&r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:s.order_number}),s.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:s.company_name}),s.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"🚚"})," ",new Date(s.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),s&&s.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"var(--accent)",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"var(--text2)"},children:s.notes})]}),L.id==="Sales"&&o==="Sales"&&!d&&r.jsx("button",{className:"vbtn",style:{marginTop:8,width:"100%",fontSize:11,background:"rgba(59, 130, 246, 0.2)",color:"#60a5fa",border:"1px solid rgba(59, 130, 246, 0.3)"},onClick:()=>a("new-order"),children:"+ New Order"}),be&&oe.length>0&&l&&!d&&r.jsx("div",{style:{marginTop:8},children:r.jsxs("select",{className:"form-select",style:{fontSize:11,padding:"4px 8px",background:"rgba(255,255,255,0.05)"},onChange:W=>{$(W.target.value),W.target.value=""},children:[r.jsx("option",{value:"",children:"+ Add Task..."}),oe.map(W=>r.jsx("option",{value:W.id,children:W.name},W.id))]})})]}),r.jsxs("div",{className:"dept-card-tasks-vertical",children:[ee.map((W,Ee)=>{const je=JSON.parse(localStorage.getItem("user")||"{}"),he=!!W.order_unit_id,H=["Admin","Manager"].includes(o)||W.dept===o||he&&W.assigned_user_id===je.id,Z=!he&&!d&&H;return r.jsx("div",{style:{display:"flex",alignItems:"center"},draggable:Z,onDragStart:ce=>Z&&O(ce,W),onDragEnd:de,onDragOver:ce=>ue(ce,L.id),onDrop:ce=>Z&&ae(ce,W),children:r.jsxs("div",{className:`step status-${W.status}${H?"":" read-only"}${W.dept==="Sales"&&W.status==="pending"?" pulse-sales":""}${(N==null?void 0:N.id)===W.id?" dragging":""}`,onClick:()=>M(W),style:{cursor:Z?"grab":"pointer"},children:[r.jsx("span",{className:`step-dot dot-${W.status}`}),r.jsxs("div",{className:"step-num",children:[L.id.toUpperCase().slice(0,3),"-",String(Ee+1).padStart(2,"0")]}),r.jsxs("div",{className:"step-name",children:[W.name,W.requires_upload&&r.jsx("span",{title:"Requires Upload",style:{marginLeft:4},children:"📎"})]}),r.jsx("div",{className:"step-sub",children:W.sub}),r.jsx(Hd,{status:W.status}),W.notes&&r.jsx("div",{className:"step-note",children:W.notes})]})},he?`unit-${W.id}`:`order-${W.id}`)}),ee.length===0&&r.jsx("div",{style:{padding:12,color:"var(--text3)",fontSize:11,fontStyle:"italic",textAlign:"center"},children:"No tasks assigned to this department."})]})]},L.id)})}),m&&c&&r.jsx("div",{className:"modal-overlay open",onClick:L=>{L.target.className==="modal-overlay open"&&f(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:k?"Edit Unit Step":"View Unit Step"}),r.jsxs("div",{className:"modal-sub",children:[c.name," (",c.dept,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>f(!1),children:"✕"})]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid var(--border)",padding:"0 24px",marginBottom:"16px"},children:["details",...A.length>0?["fields"]:[],"documents"].map(L=>r.jsxs("button",{onClick:()=>_(L),style:{background:"transparent",border:"none",borderBottom:P===L?"2px solid var(--blue)":"2px solid transparent",color:P===L?"var(--blue)":"var(--text3)",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:P===L?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[L==="fields"?"Form Fields":L.charAt(0).toUpperCase()+L.slice(1),L==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:A.length})]},L))}),r.jsxs("div",{className:"modal-body",children:[!k&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"12px"},children:["ℹ️ ",r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:c.dept})," department."]}),x&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"12px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"14px",flexShrink:0},children:"⛔"}),r.jsx("span",{style:{flex:1},children:x}),r.jsx("button",{onClick:()=>D(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"14px",padding:"0",lineHeight:1},children:"✕"})]}),P==="details"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Status"}),k?r.jsxs("select",{className:"form-select",value:c.status,onChange:L=>{const ee=L.target.value;if(c.requires_upload&&ee==="done"&&z===0){alert("You must upload at least one document to complete this task.");return}Q(c.id,{status:ee})},style:{fontSize:"13px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${($e[c.status]||$e.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:($e[c.status]||$e.pending).label})})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Assign Worker"}),k?r.jsxs("select",{className:"form-select",value:c.assigned_user_id||"",onChange:L=>Q(c.id,{assigned_user_id:L.target.value?parseInt(L.target.value):null}),style:{fontSize:"13px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),T.filter(L=>L.role===c.dept).map(L=>r.jsx("option",{value:L.id,children:L.username},L.id))]}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:(()=>{const L=T.find(ee=>ee.id===c.assigned_user_id);return L?L.username:"Unassigned"})()})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{children:"Notes"}),k?r.jsx("textarea",{className:"form-input",defaultValue:c.notes||"",onBlur:L=>Q(c.id,{notes:L.target.value}),placeholder:"Add step notes...",style:{fontSize:"13px",height:"60px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"10px 12px",borderRadius:"6px",minHeight:"40px",whiteSpace:"pre-wrap"},children:c.notes||"No notes added."})]})]}),P==="fields"&&A.length>0&&r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:A.map((L,ee)=>{var be;const Y=oe=>{const W=[...A];W[ee].value=oe,Q(c.id,{custom_fields:W})};return r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 16px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:L.label}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"10px",color:"var(--text3)",textTransform:"uppercase",background:"var(--bg4)",padding:"1px 5px",borderRadius:"3px"},children:L.type})]}),k?L.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!L.value,onChange:oe=>Y(oe.target.checked)}):L.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:L.value||"",onChange:oe=>Y(oe.target.value),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(be=L.options)==null?void 0:be.map(oe=>r.jsx("option",{value:oe,children:oe},oe))]}):r.jsx("input",{type:L.type==="Number"?"number":"text",className:"form-input",defaultValue:L.value||"",onBlur:oe=>Y(oe.target.value),style:{fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"#ddd",fontWeight:"500",marginTop:"2px"},children:L.type==="Yes/No"?L.value==="Yes"||L.value===!0?"✅ Yes":"❌ No":L.value||"—"})]},L.id)})}),P==="documents"&&r.jsxs("div",{children:[c.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"⚠️ This task requires at least one document to be marked as Done."}),r.jsx(Po,{entityType:"UnitStep",entityId:c.id,initialDocs:[],onDocsUpdate:L=>F(L.length),readOnly:!k,defaultDocType:c.default_doc_type||"General",userRole:o})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Vg({status:e}){const{cls:t,label:n}=$e[e]||$e.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Hg({currentFilter:e,userRole:t,onSetView:n}){const[a,o]=p.useState([]),[l,s]=p.useState(!0),[i,d]=p.useState("all"),[u,h]=p.useState("incomplete"),[g,v]=p.useState("updated"),[w,N]=p.useState(""),S=localStorage.getItem("token");p.useEffect(()=>{E();const c=()=>{E()};return window.addEventListener("orderUpdated",c),()=>window.removeEventListener("orderUpdated",c)},[]);const E=async()=>{try{const c=await fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${S}`}});c.ok&&o(await c.json())}catch(c){console.error(c)}finally{s(!1)}},m=e==="all"?Bt:Bt.filter(c=>c.id===e);if(l)return r.jsx("div",{className:"loading",style:{padding:40,textAlign:"center",color:"#888"},children:"Loading board..."});const f=a.filter(c=>{if(i!=="all"&&(c.priority||"Medium").toLowerCase()!==i||u==="incomplete"&&c.status==="completed"||u==="completed"&&c.status!=="completed")return!1;if(w.trim()!==""){const j=w.trim().toLowerCase().split(/\s+/),T=(c.order_number||"").toLowerCase(),I=(c.company_name||"").toLowerCase(),x=(c.po_number||"").toLowerCase();if(!j.every(U=>T.includes(U)||I.includes(U)||x.includes(U)||c.steps&&c.steps.some(k=>(k.name||"").toLowerCase().includes(U)||(k.dept||"").toLowerCase().includes(U))))return!1}return!0}).sort((c,j)=>{if(g==="updated"){const T=new Date(c.updated_at||0);return new Date(j.updated_at||0)-T}return 0});return r.jsxs("div",{className:"board-view-orders",children:[r.jsxs("div",{className:"board-filters",children:[r.jsxs("div",{className:"filter-group",children:[r.jsx(ki,{size:14,className:"filter-icon"}),r.jsx("span",{className:"filter-label",children:"Sort:"}),r.jsxs("select",{value:g,onChange:c=>v(c.target.value),className:"board-select",children:[r.jsx("option",{value:"updated",children:"Recently Updated"}),r.jsx("option",{value:"created",children:"Recently Created"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Status:"}),r.jsxs("select",{value:u,onChange:c=>h(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Orders"}),r.jsx("option",{value:"incomplete",children:"Incomplete Only"}),r.jsx("option",{value:"completed",children:"Completed Only"})]})]}),r.jsxs("div",{className:"filter-group",children:[r.jsx("span",{className:"filter-label",children:"Priority:"}),r.jsxs("select",{value:i,onChange:c=>d(c.target.value),className:"board-select",children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"low",children:"Low"})]})]}),r.jsxs("div",{className:"board-search-container",children:[r.jsx(Pr,{size:14,className:"board-search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by Order, PO, Company or Task...",value:w,onChange:c=>N(c.target.value),className:"board-search-input"}),w&&r.jsx("button",{className:"search-clear-btn",onClick:()=>N(""),title:"Clear search",children:r.jsx(un,{size:14})})]})]}),f.map(c=>{if(c.status==="completed")return e!=="all"&&!c.steps.some(x=>x.dept===e)?null:r.jsxs("div",{className:"completed-order-row",onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"completed-order-header",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsxs("div",{className:"completed-badges-row",children:[c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"🚚"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]}),r.jsx("span",{className:"completed-global-badge",children:"COMPLETED"})]})]}),r.jsx("div",{className:"completed-banner",children:r.jsxs("div",{className:"completed-banner-content",children:[r.jsx("div",{className:"completed-icon-badge",children:"✓"}),r.jsxs("div",{className:"completed-text-content",children:[r.jsx("span",{className:"completed-title",children:"Order Fully Completed"}),r.jsx("span",{className:"completed-subtitle",children:"All steps have been successfully finalized. Click to view process flow logs."})]})]})})]},c.id);let j=[],T=[];if(j=c.steps.filter(I=>["inprogress","blocked","review"].includes(I.status)),j.length===0){const I=c.steps.find(x=>x.status==="pending");if(I)j=[I];else return null}return T=m.filter(I=>j.some(x=>x.dept===I.id)),T.length===0?null:r.jsxs("div",{className:"board-order-row",children:[r.jsxs("h3",{className:"board-order-title",children:[c.order_number," ",c.company_name&&r.jsxs("span",{className:"board-order-company",children:["— ",c.company_name]})]}),r.jsx("div",{className:"board-dept-grid",children:T.map(I=>{const x=j.filter(D=>D.dept===I.id);return r.jsxs("div",{className:"dept-flow-card",style:{borderTopColor:I.color},onClick:()=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:c.id}})),n("flow")},children:[r.jsxs("div",{className:"dept-card-header",children:[r.jsxs("div",{className:"dept-card-title-row",children:[r.jsx("div",{className:"dept-color-bar",style:{background:I.color}}),r.jsx("div",{className:"dept-card-title",children:I.label})]}),r.jsxs("div",{className:"dept-card-ord-row",children:[r.jsx("div",{className:"ord-badge",children:c.order_number}),c.company_name&&r.jsx("div",{style:{fontSize:"11px",color:"#aaa",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"},children:c.company_name}),c.delivery_date&&r.jsxs("div",{className:"delivery-badge",children:[r.jsx("span",{className:"icon",children:"🚚"})," ",new Date(c.delivery_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]})]}),c.notes&&r.jsxs("div",{style:{marginTop:"10px",fontSize:"11px",color:"#f59e0b",background:"rgba(245, 158, 11, 0.05)",border:"1px solid rgba(245, 158, 11, 0.15)",borderRadius:"6px",padding:"6px 10px",fontStyle:"italic",lineHeight:"1.4",wordBreak:"break-word",display:"flex",alignItems:"flex-start",gap:"4px"},children:[r.jsx("span",{style:{fontWeight:"700",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.5px",color:"#f59e0b",marginTop:"1px",flexShrink:0},children:"Note:"}),r.jsx("span",{style:{color:"#d1d5db"},children:c.notes})]})]}),r.jsx("div",{className:"dept-card-tasks",children:x.map(D=>r.jsxs("div",{className:`board-task status-${D.status}`,children:[r.jsx("span",{className:`step-dot dot-${D.status}`}),r.jsx("div",{className:"board-task-name",title:D.name,children:D.name}),r.jsx(Vg,{status:D.status})]},D.id))})]},I.id)})})]},c.id)}),f.length===0&&r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"No orders match the current filters."}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Qg({status:e}){const{cls:t,label:n}=$e[e]||$e.pending;return r.jsx("span",{className:`step-status-badge ${t}`,children:n})}function Yg({steps:e,currentFilter:t,onOpenModal:n,userRole:a}){const o=(t==="all"?e:e.filter(l=>l.dept===t)).slice().sort((l,s)=>["Admin","Manager"].includes(a)?0:l.dept===a&&s.dept!==a?-1:s.dept===a&&l.dept!==a?1:0);return r.jsxs("table",{className:"step-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"#"}),r.jsx("th",{children:"DEPT"}),r.jsx("th",{children:"STEP"}),r.jsx("th",{children:"STATUS"}),r.jsx("th",{children:"NOTES"}),r.jsx("th",{children:"UPDATED"})]})}),r.jsx("tbody",{children:o.map((l,s)=>{const i=Bt.find(d=>d.id===l.dept);return r.jsxs("tr",{onClick:()=>n(l.id),children:[r.jsx("td",{style:{color:"var(--text3)",fontFamily:"var(--font-mono)",fontSize:10},children:s+1}),r.jsx("td",{children:r.jsx("span",{style:{color:(i==null?void 0:i.color)||"var(--text2)",fontWeight:500},children:l.dept})}),r.jsxs("td",{children:[r.jsx("div",{style:{fontWeight:500},children:l.name}),r.jsx("div",{style:{fontSize:10,color:"var(--text3)"},children:l.sub})]}),r.jsx("td",{children:r.jsx(Qg,{status:l.status})}),r.jsx("td",{style:{color:"var(--text3)",fontSize:11},children:l.notes||"—"}),r.jsx("td",{style:{color:"var(--text3)",fontFamily:"var(--font-mono)",fontSize:10},children:l.updated||"—"})]},l.id)})})]})}const Qd={Urgent:0,High:1,Medium:2,Low:3},Yd={Urgent:{bg:"rgba(239,68,68,0.12)",color:"#ef4444",border:"rgba(239,68,68,0.35)"},High:{bg:"rgba(249,115,22,0.12)",color:"#f97316",border:"rgba(249,115,22,0.35)"},Medium:{bg:"rgba(234,179,8,0.12)",color:"#eab308",border:"rgba(234,179,8,0.35)"},Low:{bg:"rgba(99,102,241,0.12)",color:"#818cf8",border:"rgba(99,102,241,0.35)"}},Gd={Completed:{bg:"rgba(16,185,129,0.12)",color:"#10b981",border:"rgba(16,185,129,0.3)"},Blocked:{bg:"rgba(239,68,68,0.12)",color:"#ef4444",border:"rgba(239,68,68,0.3)"},"In Progress":{bg:"rgba(59,130,246,0.12)",color:"#3b82f6",border:"rgba(59,130,246,0.3)"},"On Hold":{bg:"rgba(148,163,184,0.12)",color:"#94a3b8",border:"rgba(148,163,184,0.3)"}};function Gg({currentFilter:e,onSetView:t}){const[n,a]=p.useState([]),[o,l]=p.useState(!0),[s,i]=p.useState(""),[d,u]=p.useState("all"),[h,g]=p.useState("incomplete"),[v,w]=p.useState("order_number"),[N,S]=p.useState("asc"),E=localStorage.getItem("token");p.useEffect(()=>{m()},[]);const m=async()=>{try{const k=await fetch(window.API_BASE+"/api/board",{headers:{Authorization:`Bearer ${E}`}});k.ok&&a(await k.json())}catch(k){console.error(k)}finally{l(!1)}},f=k=>{window.dispatchEvent(new CustomEvent("setView",{detail:{view:"flow",orderId:parseInt(k)}}))},c=k=>{v===k?S(P=>P==="asc"?"desc":"asc"):(w(k),S("asc"))},j=k=>{var P;return k.hold_status&&k.hold_status!=="None"?"On Hold":k.status==="completed"?"Completed":(P=k.steps)!=null&&P.some(_=>_.status==="blocked")?"Blocked":"In Progress"},I=[...n.filter(k=>{const P=j(k);if(d!=="all"&&(k.priority||"Medium").toLowerCase()!==d||h==="incomplete"&&P==="Completed"||h==="completed"&&P!=="Completed"||h==="blocked"&&P!=="Blocked"||h==="hold"&&P!=="On Hold")return!1;if(s.trim()){const _=s.trim().toLowerCase();return(k.order_number||"").toLowerCase().includes(_)||(k.company_name||"").toLowerCase().includes(_)||(k.po_number||"").toLowerCase().includes(_)||(k.reference_number||"").toLowerCase().includes(_)||(k.end_client_name||"").toLowerCase().includes(_)}return!0})].sort((k,P)=>{let _,z;return v==="priority"?(_=Qd[k.priority||"Medium"]??2,z=Qd[P.priority||"Medium"]??2):v==="delivery_date"?(_=k.delivery_date?new Date(k.delivery_date).getTime():1/0,z=P.delivery_date?new Date(P.delivery_date).getTime():1/0):v==="units"?(_=parseInt(k.unit_count)||0,z=parseInt(P.unit_count)||0):(_=(k[v]||"").toString().toLowerCase(),z=(P[v]||"").toString().toLowerCase()),_<z?N==="asc"?-1:1:_>z?N==="asc"?1:-1:0}),x=({col:k})=>v!==k?r.jsx(ig,{size:11,style:{opacity:.3,marginLeft:4}}):N==="asc"?r.jsx(dg,{size:11,style:{color:"var(--blue)",marginLeft:4}}):r.jsx(zo,{size:11,style:{color:"var(--blue)",marginLeft:4}}),D=({label:k,col:P,style:_})=>r.jsx("th",{onClick:()=>P&&c(P),style:{cursor:P?"pointer":"default",userSelect:"none",whiteSpace:"nowrap",padding:"11px 14px",fontSize:"11px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.6px",color:v===P?"var(--blue)":"var(--text3)",background:"var(--bg3)",borderBottom:"1px solid var(--border)",..._},children:r.jsxs("span",{style:{display:"inline-flex",alignItems:"center"},children:[k,P&&r.jsx(x,{col:P})]})});if(o)return r.jsx("div",{style:{padding:60,textAlign:"center",color:"var(--text3)"},children:r.jsx("div",{style:{fontSize:13},children:"Loading orders..."})});const U=I.reduce((k,P)=>k+(parseInt(P.unit_count)||0),0);return r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:0,height:"100%"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"var(--bg2)",borderBottom:"1px solid var(--border)",flexWrap:"wrap"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"7px 12px",flex:"1 1 200px",minWidth:0},children:[r.jsx(Pr,{size:13,style:{color:"var(--text3)",flexShrink:0}}),r.jsx("input",{type:"text",placeholder:"Search order, PO, company, client...",value:s,onChange:k=>i(k.target.value),style:{background:"none",border:"none",outline:"none",color:"var(--text)",fontSize:13,width:"100%"}}),s&&r.jsx("button",{onClick:()=>i(""),style:{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",display:"flex",padding:0},children:r.jsx(un,{size:13})})]}),r.jsxs("select",{value:h,onChange:k=>g(k.target.value),style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text2)",fontSize:12,padding:"7px 10px",cursor:"pointer",outline:"none"},children:[r.jsx("option",{value:"all",children:"All Status"}),r.jsx("option",{value:"incomplete",children:"Incomplete"}),r.jsx("option",{value:"completed",children:"Completed"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"hold",children:"On Hold"})]}),r.jsxs("select",{value:d,onChange:k=>u(k.target.value),style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text2)",fontSize:12,padding:"7px 10px",cursor:"pointer",outline:"none"},children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"urgent",children:"Urgent"}),r.jsx("option",{value:"high",children:"High"}),r.jsx("option",{value:"medium",children:"Medium"}),r.jsx("option",{value:"low",children:"Low"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginLeft:"auto",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 12px",fontSize:12,color:"var(--text3)",whiteSpace:"nowrap",flexShrink:0},children:[r.jsx(vg,{size:13}),r.jsx("strong",{style:{color:"var(--text)"},children:I.length})," orders  · ",r.jsx("strong",{style:{color:"var(--text)"},children:U})," units"]})]}),r.jsx("div",{style:{overflowX:"auto",overflowY:"auto",flex:1},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:13},children:[r.jsx("thead",{style:{position:"sticky",top:0,zIndex:2},children:r.jsxs("tr",{children:[r.jsx(D,{label:"#",col:"order_number"}),r.jsx(D,{label:"Customer",col:"company_name"}),r.jsx(D,{label:"PO Number",col:"po_number"}),r.jsx(D,{label:"Ref #",col:"reference_number"}),r.jsx(D,{label:"End Client"}),r.jsx(D,{label:"Classification",col:"classification"}),r.jsx(D,{label:"Units",col:"units",style:{textAlign:"center"}}),r.jsx(D,{label:"Priority",col:"priority",style:{textAlign:"center"}}),r.jsx(D,{label:"Delivery",col:"delivery_date"}),r.jsx(D,{label:"Active Depts"}),r.jsx(D,{label:"Status",style:{textAlign:"center"}})]})}),r.jsxs("tbody",{children:[I.map((k,P)=>{var V;const _=((V=k.steps)==null?void 0:V.filter(C=>["inprogress","blocked","review"].includes(C.status)))||[],z=Array.from(new Set(_.map(C=>C.dept))),F=j(k),A=Gd[F]||Gd["In Progress"],Q=k.priority||"Medium",M=Yd[Q]||Yd.Medium,B=k.delivery_date&&new Date(k.delivery_date)<new Date&&F!=="Completed";return r.jsxs("tr",{onClick:()=>f(k.id),style:{background:P%2===0?"var(--bg)":"var(--bg2)",cursor:"pointer",transition:"background 0.12s",borderBottom:"1px solid var(--border)"},onMouseEnter:C=>C.currentTarget.style.background="var(--bg4)",onMouseLeave:C=>C.currentTarget.style.background=P%2===0?"var(--bg)":"var(--bg2)",children:[r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",fontWeight:700,color:"var(--blue)",fontSize:12,whiteSpace:"nowrap"},children:k.order_number}),r.jsxs("td",{style:{padding:"10px 14px",fontWeight:600,color:"var(--text)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[k.company_name||r.jsx("span",{style:{color:"var(--text3)",fontStyle:"italic"},children:"—"}),k.company_city&&r.jsxs("span",{style:{color:"var(--text3)",fontWeight:400,fontSize:11,marginLeft:4},children:["· ",k.company_city]})]}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"var(--font-mono)",color:"var(--text3)",fontSize:12},children:k.po_number||"—"}),r.jsx("td",{style:{padding:"10px 14px",fontSize:12,whiteSpace:"nowrap"},children:k.reference_number?r.jsx("span",{style:{fontFamily:"var(--font-mono)",color:"#f59e0b",fontWeight:600},children:k.reference_number}):r.jsx("span",{style:{color:"var(--text3)",opacity:.4},children:"—"})}),r.jsx("td",{style:{padding:"10px 14px",color:"var(--text3)",fontSize:12,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:k.end_client_name||r.jsx("span",{style:{opacity:.4},children:"—"})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:k.classification==="Non-Standard"?"rgba(99,102,241,0.12)":"rgba(16,185,129,0.1)",color:k.classification==="Non-Standard"?"#818cf8":"#34d399",border:`1px solid ${k.classification==="Non-Standard"?"rgba(99,102,241,0.3)":"rgba(16,185,129,0.25)"}`,textTransform:"uppercase",letterSpacing:"0.4px"},children:k.classification||"Standard"})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:12,fontWeight:700,color:"var(--text2)",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:6,padding:"2px 8px",display:"inline-block"},children:k.unit_count||0})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:M.bg,color:M.color,border:`1px solid ${M.border}`,textTransform:"uppercase",letterSpacing:"0.5px"},children:Q})}),r.jsxs("td",{style:{padding:"10px 14px",color:B?"#ef4444":"var(--text2)",fontWeight:B?600:400,whiteSpace:"nowrap",fontSize:12},children:[k.delivery_date?new Date(k.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"}),B&&r.jsx("span",{style:{fontSize:9,color:"#ef4444",fontWeight:700,marginLeft:5,background:"rgba(239,68,68,0.12)",borderRadius:4,padding:"1px 5px"},children:"OVERDUE"})]}),r.jsx("td",{style:{padding:"10px 14px"},children:r.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:z.length>0?z.map(C=>{const $=Bt.find(de=>de.id===C),O=_.some(de=>de.dept===C&&de.status==="blocked");return r.jsx("span",{style:{fontSize:9,fontWeight:700,background:O?"rgba(239,68,68,0.12)":$!=null&&$.color?`${$.color}22`:"var(--bg4)",color:O?"#ef4444":($==null?void 0:$.color)||"var(--text3)",border:`1px solid ${O?"rgba(239,68,68,0.4)":$!=null&&$.color?`${$.color}44`:"var(--border)"}`,padding:"2px 7px",borderRadius:10,textTransform:"uppercase",letterSpacing:"0.4px"},children:C},C)}):r.jsx("span",{style:{color:"var(--text3)",fontSize:11,fontStyle:"italic"},children:"Pending"})})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:A.bg,color:A.color,border:`1px solid ${A.border}`,textTransform:"uppercase",letterSpacing:"0.4px",whiteSpace:"nowrap"},children:F})})]},k.id)}),I.length===0&&r.jsx("tr",{children:r.jsxs("td",{colSpan:10,style:{textAlign:"center",padding:"48px 24px",color:"var(--text3)"},children:[r.jsx(Pr,{size:28,style:{opacity:.3,marginBottom:8,display:"block",margin:"0 auto 8px"}}),r.jsx("div",{style:{fontSize:14},children:"No orders match the current filters"})]})})]})]})})]})}function Jg({selectedStep:e,activityLog:t,selectedOrder:n,isOpen:a=!0,onToggle:o}){var s,i,d;const l=e?Bt.find(u=>u.id===e.dept):null;return r.jsxs("div",{className:`right-panel${a?"":" right-panel--collapsed"}`,children:[r.jsx("button",{className:"rp-toggle",onClick:o,title:a?"Collapse panel":"Expand panel","aria-label":a?"Collapse sidebar":"Expand sidebar",children:r.jsx(Np,{size:15,style:{transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)",transform:a?"rotate(0deg)":"rotate(180deg)"}})}),r.jsx("div",{className:"rp-inner",children:r.jsxs("div",{className:"rp-content",children:[r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Selected Step"}),e?r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:8,color:(l==null?void 0:l.color)||"var(--text)"},children:e.name}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Department"}),r.jsx("span",{className:"detail-val",style:{color:(l==null?void 0:l.color)||"inherit"},children:e.dept})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Status"}),r.jsx("span",{className:`step-status-badge badge-${e.status}`,style:{marginTop:0},children:e.status.toUpperCase()})]}),e.notes&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Notes"}),r.jsx("span",{className:"detail-val",style:{color:"var(--text2)",maxWidth:130,textAlign:"right",wordBreak:"break-word"},children:e.notes})]})]}):r.jsx("div",{className:"empty-detail",children:"Click any step to see details."})]}),n?r.jsxs("div",{className:"panel-section",children:[r.jsx("div",{className:"panel-sec-title",children:"Order Overview"}),r.jsxs("div",{className:"detail-card",children:[r.jsx("h4",{style:{marginBottom:4,fontFamily:"var(--font-mono)",fontSize:13},children:n.order_number}),n.company_name&&r.jsxs("div",{style:{color:"var(--text2)",fontSize:11,marginBottom:12},children:["🏢 ",n.company_name]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Priority"}),r.jsx("span",{className:`priority-badge ${((s=n.priority)==null?void 0:s.toLowerCase())||"medium"}`,style:{fontSize:10},children:n.priority||"Medium"})]}),n.po_number&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"PO Number"}),r.jsx("span",{className:"detail-val",children:n.po_number})]}),n.reference_number&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Cust. Ref #"}),r.jsx("span",{className:"detail-val",children:n.reference_number})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Classification"}),r.jsx("span",{className:"detail-val",style:{fontWeight:"600",color:n.classification==="Non-Standard"?"var(--blue)":"var(--text2)"},children:n.classification||"Standard"})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Order Date"}),r.jsx("span",{className:"detail-val",children:n.order_date?new Date(n.order_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"N/A"})]}),r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Delivery"}),r.jsx("span",{className:"detail-val",style:{color:"var(--accent)"},children:n.delivery_date?new Date(n.delivery_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"TBD"})]}),n.packaging_type&&r.jsxs("div",{className:"detail-row",children:[r.jsx("span",{className:"detail-key",children:"Packaging"}),r.jsxs("span",{className:"detail-val",style:{color:"var(--purple)"},children:[n.packaging_type==="Wooden Packaging"?"🪵":"🫧"," ",n.packaging_type]})]}),((i=n.units)==null?void 0:i.length)>0&&r.jsxs("div",{style:{marginTop:12,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsxs("span",{className:"detail-key",style:{display:"block",marginBottom:8},children:["Units (",n.units.length,")"]}),r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:4},children:[n.units.slice(0,12).map(u=>r.jsx("span",{style:{fontSize:9,padding:"2px 5px",borderRadius:3,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontFamily:"var(--font-mono)"},children:u.short_serial},u.id)),n.units.length>12&&r.jsxs("span",{style:{fontSize:9,color:"var(--text3)",padding:"2px 4px"},children:["+",n.units.length-12," more"]})]})]}),((d=n.documents)==null?void 0:d.filter(u=>u.doc_type!=="TaskUpload").length)>0&&r.jsxs("div",{style:{marginTop:10,borderTop:"1px solid var(--border)",paddingTop:10},children:[r.jsx("span",{className:"detail-key",style:{display:"block",marginBottom:6},children:"Documents"}),n.documents.filter(u=>u.doc_type!=="TaskUpload").map(u=>r.jsx("div",{style:{fontSize:11,marginBottom:3},children:r.jsxs("a",{href:`${window.API_BASE}/uploads/${u.file_path.split(/[/\\]/).pop()}?token=${localStorage.getItem("token")}`,target:"_blank",rel:"noopener noreferrer",style:{color:"var(--blue)",textDecoration:"none"},children:["📄 ",u.file_name]})},u.id))]})]})]}):null,r.jsxs("div",{className:"panel-section",style:{flex:1},children:[r.jsxs("div",{className:"panel-sec-title",style:{display:"flex",alignItems:"center",gap:6},children:[r.jsx(Cp,{size:10}),"Activity Log"]}),r.jsxs("div",{id:"activityLog",style:{maxHeight:280,overflowY:"auto"},children:[t.length===0&&r.jsx("div",{className:"empty-detail",children:"No activity recorded yet."}),t.slice(0,50).map((u,h)=>{var v;const g=((v=Bt.find(w=>w.id===u.dept))==null?void 0:v.color)||"var(--text2)";return r.jsxs("div",{className:"log-entry",children:[r.jsx("div",{className:"log-time",children:u.time}),r.jsxs("div",{className:"log-text",children:[r.jsxs("span",{className:"log-dept",style:{color:g},children:["[",u.dept,"]"]})," ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:600},children:u.username}),": ",u.text]})]},h)})]})]})]})})]})}const Jd=e=>{if(!e)return"";if(typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e))return e;try{const t=new Date(e);if(!isNaN(t.getTime()))return t.toISOString().split("T")[0]}catch{}return""};function Kg({step:e,isOpen:t,onClose:n,onSave:a,onDelete:o,userRole:l,selectedOrder:s}){const[i,d]=p.useState("pending"),[u,h]=p.useState(""),[g,v]=p.useState(null),[w,N]=p.useState(""),[S,E]=p.useState({layout:!1,electrical:!1,bom:!1}),[m,f]=p.useState(0),[c,j]=p.useState([]),[T,I]=p.useState("details"),[x,D]=p.useState(null),U=["Admin","Manager"].includes(l),k=e?(["Admin","Manager"].includes(l)||e.dept===l)&&(s==null?void 0:s.hold_status)!=="Approved":!1;if(p.useEffect(()=>{if(e){d(e.status),h(e.notes||""),N(Jd(e.dispatch_date)),v(null),E({layout:!1,electrical:!1,bom:!1}),f(0),I("details"),D(null);try{const A=Array.isArray(e.custom_fields)?e.custom_fields:JSON.parse(e.custom_fields||"[]");j(Array.isArray(A)?A:[])}catch{j([])}}},[e]),!t||!e)return null;const P=async()=>{if(!k)return;if(e.requires_upload&&i==="done"&&m===0){alert("You must upload at least one document to complete this task.");return}D(null);const A=await a({status:i,notes:u,qcFailTarget:g,dispatchDate:w,checklist:S,custom_fields:c});A&&D(A)},_=(A,Q)=>{j(M=>M.map((B,V)=>V===A?{...B,value:Q}:B))},z=A=>{A.target.className==="modal-overlay open"&&n()},F=(A,Q)=>{switch(A.type){case"Text":return r.jsx("input",{type:"text",className:"form-input",value:A.value||"",onChange:M=>_(Q,M.target.value),placeholder:`Enter ${A.label}...`,disabled:!k});case"Number":return r.jsx("input",{type:"number",className:"form-input",value:A.value||"",onChange:M=>_(Q,M.target.value),disabled:!k});case"Date":return r.jsx("input",{type:"date",className:"form-input",value:Jd(A.value),onChange:M=>_(Q,M.target.value),disabled:!k});case"Yes/No":return r.jsx("div",{style:{display:"flex",gap:"12px",marginTop:"4px"},children:["Yes","No"].map(M=>r.jsx("button",{type:"button",onClick:()=>k&&_(Q,M),style:{padding:"6px 20px",borderRadius:"6px",border:"1px solid",cursor:k?"pointer":"default",fontSize:"13px",fontWeight:"600",background:A.value===M?M==="Yes"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)":"transparent",borderColor:A.value===M?M==="Yes"?"#10b981":"#ef4444":"#444",color:A.value===M?M==="Yes"?"#10b981":"#ef4444":"#888",opacity:!k&&A.value!==M?.4:1},children:M},M))});case"Dropdown":return r.jsxs("select",{className:"form-select",value:A.value||"",onChange:M=>_(Q,M.target.value),disabled:!k,children:[r.jsx("option",{value:"",children:"-- Select --"}),(A.options||[]).map(M=>r.jsx("option",{value:M,children:M},M))]});default:return r.jsx("input",{type:"text",className:"form-input",value:A.value||"",onChange:M=>_(Q,M.target.value),placeholder:`Enter ${A.label}...`,disabled:!k})}};return r.jsxs("div",{className:"modal-overlay open",onClick:z,children:[r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:e.name}),r.jsxs("div",{className:"modal-sub",children:[e.dept," — ",e.sub]})]}),r.jsx("button",{className:"modal-close",onClick:n,children:"✕"})]}),(s==null?void 0:s.hold_status)==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.08)",borderBottom:"1px solid rgba(239, 68, 68, 0.15)",padding:"12px 24px",color:"#ef4444",fontSize:"12px",fontWeight:"500"},children:["⛔ ",r.jsx("strong",{children:"Order is on hold."})," Flow updates and document uploads are disabled."]}),r.jsx("div",{style:{display:"flex",gap:0,borderBottom:"1px solid var(--border)",padding:"0 24px"},children:["details",...c.length>0?["fields"]:[],"documents"].map(A=>r.jsxs("button",{onClick:()=>I(A),style:{background:"transparent",border:"none",borderBottom:T===A?"2px solid var(--blue)":"2px solid transparent",color:T===A?"var(--blue)":"var(--text3)",padding:"10px 16px",cursor:"pointer",fontSize:"13px",fontWeight:T===A?"600":"400",textTransform:"capitalize",marginBottom:"-1px"},children:[A==="fields"?"Form Fields":A.charAt(0).toUpperCase()+A.slice(1),A==="fields"&&r.jsx("span",{style:{marginLeft:6,background:"#3b82f6",color:"#fff",borderRadius:"10px",padding:"1px 6px",fontSize:"10px"},children:c.length})]},A))}),r.jsxs("div",{className:"modal-body",children:[T==="details"&&r.jsxs(r.Fragment,{children:[!k&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.1)",border:"1px solid rgba(59, 130, 246, 0.2)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#60a5fa",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px"},children:"ℹ️"}),r.jsxs("span",{children:[r.jsx("strong",{children:"View-Only Mode"})," — This task is managed by the ",r.jsx("strong",{children:e.dept})," department."]})]}),x&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"8px",padding:"10px 14px",marginBottom:"16px",color:"#f87171",fontSize:"13px",display:"flex",alignItems:"flex-start",gap:"8px"},children:[r.jsx("span",{style:{fontSize:"15px",flexShrink:0},children:"⛔"}),r.jsx("span",{style:{flex:1},children:x}),r.jsx("button",{onClick:()=>D(null),style:{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:"16px",padding:"0",lineHeight:1},children:"✕"})]}),s&&e.order_fields&&e.order_fields.length>0&&r.jsxs("div",{style:{marginBottom:"16px",padding:"12px 16px",background:"rgba(59,130,246,0.05)",border:"1px solid rgba(59,130,246,0.15)",borderRadius:"8px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"#3b82f6",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"10px"},children:"Order Reference"}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))",gap:"8px"},children:e.order_fields.map(A=>{const Q={order_number:"Order #",company_name:"Company",delivery_date:"Delivery Date",po_number:"PO Number",packaging_type:"Packaging",priority:"Priority",notes:"Order Notes"};let M=s[A];return A==="delivery_date"&&M&&(M=new Date(M).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})),r.jsxs("div",{style:{background:"var(--bg3)",borderRadius:"6px",padding:"8px 10px"},children:[r.jsx("div",{style:{fontSize:"10px",color:"var(--text3)",marginBottom:"3px"},children:Q[A]||A}),r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",fontWeight:"500"},children:M||"—"})]},A)})})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Status"}),k?r.jsxs("select",{className:"form-select",value:i,onChange:A=>d(A.target.value),children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"review",children:"Under Review"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]}):r.jsx("div",{style:{marginTop:"4px"},children:r.jsx("span",{className:`step-status-badge ${($e[i]||$e.pending).cls}`,style:{fontSize:"12px",padding:"4px 10px",fontWeight:"bold"},children:($e[i]||$e.pending).label})})]}),e.special==="qc"&&r.jsxs("div",{id:"qcFailArea",children:[r.jsx("label",{style:{fontSize:10,color:"var(--text3)",display:"block",marginBottom:6},children:"If QC Fail — return to:"}),k?r.jsxs("div",{className:"qc-options",children:[r.jsxs("div",{className:`qc-opt${g==="production"?" selected":""}`,onClick:()=>k&&v("production"),style:{cursor:k?"pointer":"default"},children:["↩ Production",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Rework"})]}),r.jsxs("div",{className:`qc-opt${g==="design"?" selected":""}`,onClick:()=>k&&v("design"),style:{cursor:k?"pointer":"default"},children:["↩ Design",r.jsx("br",{}),r.jsx("span",{style:{fontSize:9,opacity:.7},children:"Re-check"})]})]}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:g?`↩ Returned to ${g.charAt(0).toUpperCase()+g.slice(1)}`:"No fail action selected"})]}),e.special==="design"&&r.jsxs("div",{className:"design-checklist",children:[r.jsx("div",{className:"design-checklist-title",children:"Simultaneous Release Checklist"}),k?r.jsxs(r.Fragment,{children:[r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:S.layout,onChange:A=>E({...S,layout:A.target.checked})})," Panel Layout (for Fitter)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:S.electrical,onChange:A=>E({...S,electrical:A.target.checked})})," Electrical Design (for Wireman)"]}),r.jsxs("label",{children:[r.jsx("input",{type:"checkbox",checked:S.bom,onChange:A=>E({...S,bom:A.target.checked})})," BOM Released to Purchase & Stores"]})]}):r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px",marginTop:"6px"},children:[r.jsxs("div",{children:[S.layout?"✅":"❌"," Panel Layout (for Fitter)"]}),r.jsxs("div",{children:[S.electrical?"✅":"❌"," Panel Design (for Wireman)"]}),r.jsxs("div",{children:[S.bom?"✅":"❌"," BOM Released to Purchase & Stores"]})]})]}),e.special==="dispatch"&&r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirmed Dispatch Date"}),k?r.jsx("input",{type:"date",className:"form-input",value:w,onChange:A=>N(A.target.value)}):r.jsx("div",{style:{fontSize:"14px",color:"var(--text)",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px"},children:w?new Date(w).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"Not set"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Notes / Remarks"}),k?r.jsx("textarea",{className:"form-textarea",placeholder:"Add notes…",value:u,onChange:A=>h(A.target.value)}):r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"10px 14px",borderRadius:"6px",border:"1px solid var(--border)",minHeight:"40px",whiteSpace:"pre-wrap"},children:u||"No notes or remarks added."})]})]}),T==="fields"&&c.length>0&&r.jsxs("div",{children:[r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",marginBottom:"16px"},children:k?"Fill in the required information for this task.":"Information filled in for this task."}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:c.map((A,Q)=>r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 16px"},children:[r.jsx("div",{style:{marginBottom:"8px"},children:r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:A.label})}),k?F(A,Q):r.jsx("div",{style:{fontSize:"13px",color:"var(--text)",fontWeight:"500",marginTop:"4px"},children:A.type==="Yes/No"?A.value==="Yes"||A.value===!0?"✅ Yes":"❌ No":A.value||"—"})]},Q))})]}),T==="documents"&&r.jsxs("div",{children:[e.requires_upload&&r.jsx("div",{style:{marginBottom:16,padding:"10px 14px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,color:"#fbbf24",fontSize:13},children:"⚠️ This task requires at least one document to be marked as Done."}),r.jsx(Po,{entityType:"Step",entityId:e.id,initialDocs:[],onDocsUpdate:A=>f(A.length),readOnly:!k,defaultDocType:e.default_doc_type||"General",userRole:l})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"24px",paddingTop:"16px",borderTop:"1px solid var(--border)"},children:[U&&k?r.jsx("button",{className:"vbtn",style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444"},onClick:()=>o(e.id),children:"Delete Task"}):r.jsx("div",{}),r.jsx("div",{style:{display:"flex",gap:"12px"},children:k?r.jsxs(r.Fragment,{children:[r.jsx("button",{className:"btn-cancel",onClick:n,children:"Cancel"}),r.jsx("button",{className:"btn-save",onClick:P,children:"Update Status"})]}):r.jsx("button",{className:"btn-cancel",onClick:n,style:{minWidth:"100px"},children:"Close"})})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Xg(){const[e,t]=p.useState(""),[n,a]=p.useState(""),[o,l]=p.useState(!1),[s,i]=p.useState(""),[d,u]=p.useState(!1),h=wi();p.useEffect(()=>{localStorage.getItem("token")&&h("/dashboard")},[h]);const g=async v=>{v.preventDefault(),i(""),u(!0);try{const w=await fetch(window.API_BASE+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:n})}),N=await w.json();if(!w.ok)throw new Error(N.error||"Login failed");localStorage.setItem("token",N.token),localStorage.setItem("user",JSON.stringify(N.user)),h("/dashboard")}catch(w){i(w.message)}finally{u(!1)}};return r.jsx("div",{className:"auth-container",children:r.jsxs("div",{className:"auth-card",children:[r.jsxs("div",{className:"auth-header",children:[r.jsx("div",{className:"auth-logo",children:r.jsx(jg,{size:32,className:"neon-text"})}),r.jsx("h1",{children:"Welcome Back"}),r.jsx("p",{children:"Sign in to access your ERP dashboard"})]}),r.jsxs("form",{onSubmit:g,className:"auth-form",children:[s&&r.jsxs("div",{className:"auth-error",children:[r.jsx(Eo,{size:18}),r.jsx("span",{children:s})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"email",children:"Email Address / Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Ep,{className:"input-icon",size:18}),r.jsx("input",{id:"email",type:"text",placeholder:"email or username",value:e,onChange:v=>t(v.target.value),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{htmlFor:"password",children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Jr,{className:"input-icon",size:18}),r.jsx("input",{id:"password",type:o?"text":"password",placeholder:"••••••••",value:n,onChange:v=>a(v.target.value),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>l(!o),"aria-label":o?"Hide password":"Show password",children:o?r.jsx(Pn,{size:18}):r.jsx(Tn,{size:18})})]})]}),r.jsx("button",{type:"submit",className:"auth-button",disabled:d,children:d?r.jsx(In,{className:"animate-spin"}):"Sign In"})]})]})})}function Zg(){const[e,t]=p.useState([]),[n,a]=p.useState(!0),[o,l]=p.useState(null),[s,i]=p.useState(!1),[d,u]=p.useState({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),[h,g]=p.useState(!1),[v,w]=p.useState(""),[N,S]=p.useState(!1),[E,m]=p.useState(!1),[f,c]=p.useState(null),[j,T]=p.useState(!1),[I,x]=p.useState({username:"",email:"",role:"",password:"",confirmPassword:""}),[D,U]=p.useState(!1),[k,P]=p.useState(!1),[_,z]=p.useState(""),[F,A]=p.useState(!1),[Q,M]=p.useState(null),[B,V]=p.useState(!1),[C,$]=p.useState(""),O=localStorage.getItem("token"),de=["Admin","Manager","Sales","Design","Purchase","Stores","Production","QC","Dispatch","Accounts","Planning","Viewer"];p.useEffect(()=>{ue()},[]);const ue=async()=>{try{const Y=await fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${O}`}}),be=await Y.json();Y.ok&&t(be)}catch(Y){console.error("Failed to fetch users",Y)}finally{a(!1)}},ae=async Y=>{if(Y.preventDefault(),g(!0),w(""),d.password!==d.confirmPassword){w("Passwords do not match"),g(!1);return}try{const{confirmPassword:be,...oe}=d,W=await fetch(window.API_BASE+"/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${O}`},body:JSON.stringify(oe)}),Ee=await W.json();W.ok?(i(!1),u({username:"",email:"",password:"",confirmPassword:"",role:"Viewer"}),S(!1),m(!1),ue()):w(Ee.error||"Failed to create user")}catch{w("Network error")}finally{g(!1)}},me=Y=>{c(Y),x({username:Y.username,email:Y.email,role:Y.role,password:"",confirmPassword:""}),z(""),U(!1),P(!1),T(!0)},se=()=>{c(null),T(!1),U(!1),P(!1)},L=async Y=>{if(Y.preventDefault(),A(!0),z(""),I.password&&I.password!==I.confirmPassword){z("Passwords do not match"),A(!1);return}try{const{confirmPassword:be,...oe}=I,W=await fetch(`${window.API_BASE}/api/users/${f.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${O}`},body:JSON.stringify(oe)}),Ee=await W.json();W.ok?(T(!1),c(null),ue()):z(Ee.error||"Failed to update user")}catch{z("Network error")}finally{A(!1)}},ee=async()=>{if(Q){V(!0),$("");try{const Y=await fetch(`${window.API_BASE}/api/users/${Q.id}`,{method:"DELETE",headers:{Authorization:`Bearer ${O}`}}),be=await Y.json();Y.ok?(M(null),ue()):$(be.error||"Failed to delete user")}catch{$("Network error")}finally{V(!1)}}};return n?r.jsxs("div",{className:"loading-state",children:[r.jsx(In,{className:"animate-spin"})," Loading User Directory..."]}):r.jsxs("div",{className:"user-mgmt",children:[r.jsxs("div",{className:"mgmt-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Pp,{size:20}),r.jsx("h2",{children:"User Management Directory"}),r.jsxs("span",{className:"badge-count",children:[e.length," Total Accounts"]})]}),r.jsxs("button",{className:"add-user-btn",onClick:()=>i(!s),children:[r.jsx(Ag,{size:16}),s?"Cancel":"Add New User"]})]}),s&&r.jsx("div",{className:"add-user-form-container",children:r.jsxs("form",{onSubmit:ae,className:"add-user-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Username"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Jo,{size:14,className:"input-icon"}),r.jsx("input",{type:"text",placeholder:"johndoe",value:d.username,onChange:Y=>u({...d,username:Y.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Email Address"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Ep,{size:14,className:"input-icon"}),r.jsx("input",{type:"email",placeholder:"john@example.com",value:d.email,onChange:Y=>u({...d,email:Y.target.value}),required:!0})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Jr,{size:14,className:"input-icon"}),r.jsx("input",{type:N?"text":"password",placeholder:"••••••••",value:d.password,onChange:Y=>u({...d,password:Y.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>S(!N),"aria-label":N?"Hide password":"Show password",children:N?r.jsx(Pn,{size:14}):r.jsx(Tn,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Confirm Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Jr,{size:14,className:"input-icon"}),r.jsx("input",{type:E?"text":"password",placeholder:"••••••••",value:d.confirmPassword,onChange:Y=>u({...d,confirmPassword:Y.target.value}),required:!0}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>m(!E),"aria-label":E?"Hide password":"Show password",children:E?r.jsx(Pn,{size:14}):r.jsx(Tn,{size:14})})]})]}),r.jsxs("div",{className:"input-group",children:[r.jsx("label",{children:"Assign Role"}),r.jsx("select",{className:"auth-select",value:d.role,onChange:Y=>u({...d,role:Y.target.value}),children:de.map(Y=>r.jsx("option",{value:Y,children:Y},Y))})]})]}),v&&r.jsx("div",{className:"form-error",children:v}),r.jsx("button",{type:"submit",className:"submit-user-btn",disabled:h,children:h?r.jsx(In,{size:16,className:"animate-spin"}):"Create User Account"})]})}),r.jsx("div",{className:"user-table-container",children:r.jsxs("table",{className:"user-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"Username"}),r.jsx("th",{children:"Email"}),r.jsx("th",{children:"Current Role"}),r.jsx("th",{children:"Actions"})]})}),r.jsx("tbody",{children:e.map(Y=>r.jsxs("tr",{children:[r.jsx("td",{className:"u-name",children:Y.username}),r.jsx("td",{className:"u-email",children:Y.email}),r.jsx("td",{children:r.jsx("span",{className:`role-badge role-${Y.role.toLowerCase()}`,children:Y.role})}),r.jsx("td",{children:r.jsxs("div",{className:"action-buttons-cell",style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsxs("button",{className:"vbtn",onClick:()=>me(Y),style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(Pg,{size:14}),"Edit"]}),r.jsxs("button",{className:"vbtn",onClick:()=>{$(""),M(Y)},style:{padding:"6px 10px",display:"flex",alignItems:"center",gap:"6px",borderColor:"rgba(239,68,68,0.3)",color:"var(--red)"},children:[r.jsx(Dp,{size:14}),"Delete"]})]})})]},Y.id))})]})}),j&&f&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",children:"Edit User Details"}),r.jsxs("p",{className:"modal-sub",children:["Modify details for account: ",f.username]})]}),r.jsx("button",{className:"modal-close",onClick:se,children:r.jsx(un,{size:18})})]}),r.jsxs("form",{onSubmit:L,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Username"}),r.jsx("input",{type:"text",className:"form-input",value:I.username,onChange:Y=>x({...I,username:Y.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Email Address"}),r.jsx("input",{type:"email",className:"form-input",value:I.email,onChange:Y=>x({...I,email:Y.target.value}),required:!0})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Role"}),r.jsx("select",{className:"form-select",value:I.role,onChange:Y=>x({...I,role:Y.target.value}),children:de.map(Y=>r.jsx("option",{value:Y,children:Y},Y))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"New Password (leave blank to keep current)"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Jr,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:D?"text":"password",className:"form-input",placeholder:"••••••••",value:I.password,onChange:Y=>x({...I,password:Y.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>U(!D),style:{right:"12px"},"aria-label":D?"Hide password":"Show password",children:D?r.jsx(Pn,{size:14}):r.jsx(Tn,{size:14})})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Confirm New Password"}),r.jsxs("div",{className:"input-wrapper",children:[r.jsx(Jr,{size:14,className:"input-icon",style:{left:"12px"}}),r.jsx("input",{type:k?"text":"password",className:"form-input",placeholder:"••••••••",value:I.confirmPassword||"",onChange:Y=>x({...I,confirmPassword:Y.target.value}),style:{paddingLeft:"32px",paddingRight:"32px"}}),r.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>P(!k),style:{right:"12px"},"aria-label":k?"Hide password":"Show password",children:k?r.jsx(Pn,{size:14}):r.jsx(Tn,{size:14})})]})]}),_&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:_}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:se,disabled:F,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:F,children:F?r.jsx(In,{size:16,className:"animate-spin"}):"Save Changes"})]})]})]})}),Q&&r.jsx("div",{className:"modal-overlay open",children:r.jsxs("div",{className:"modal",children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("h3",{className:"modal-title",style:{color:"var(--red)"},children:"Delete User Account"}),r.jsx("p",{className:"modal-sub",children:"Are you sure you want to permanently delete this user?"})]}),r.jsx("button",{className:"modal-close",onClick:()=>M(null),children:r.jsx(un,{size:18})})]}),r.jsxs("div",{className:"modal-body",children:[r.jsxs("p",{style:{fontSize:"13px",color:"var(--text2)",lineHeight:"1.5"},children:["Deleting ",r.jsx("strong",{children:Q.username})," (",Q.email,") will remove their account immediately. Any documents uploaded, orders created, or panels assigned to this user will have their references cleared safely."]}),C&&r.jsx("div",{className:"form-error",style:{marginTop:"8px"},children:C}),r.jsxs("div",{className:"modal-actions",style:{marginTop:"16px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>M(null),disabled:B,children:"Cancel"}),r.jsx("button",{type:"button",className:"btn-save",style:{background:"var(--red)",color:"#fff"},onClick:ee,disabled:B,children:B?r.jsx(In,{size:16,className:"animate-spin"}):"Delete Account"})]})]})]})})]})}function eh({onOrderCreated:e}){const[t,n]=p.useState({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard",lineItems:[{material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),[a,o]=p.useState([]),[l,s]=p.useState({po:null,quotation:null,approved_docs:[]}),[i,d]=p.useState(!1),[u,h]=p.useState(!1),[g,v]=p.useState(!1),[w,N]=p.useState(!1),S=localStorage.getItem("token");p.useEffect(()=>{fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${S}`}}).then(_=>_.json()).then(_=>o(_)).catch(_=>console.error(_))},[S]),p.useEffect(()=>{if(t.order_date){const _=new Date(t.order_date);_.setDate(_.getDate()+28);const z=_.toISOString().split("T")[0];t.delivery_date!==z&&n(F=>({...F,delivery_date:z,lineItems:F.lineItems.map(A=>({...A,delivery_date:z}))}))}else t.delivery_date!==""&&n(_=>({..._,delivery_date:"",lineItems:_.lineItems.map(z=>({...z,delivery_date:""}))}))},[t.order_date]);const E=_=>{const{name:z,value:F}=_.target;n(A=>({...A,[z]:F}))},m=(_,z,F)=>{n(A=>{const Q=[...A.lineItems];if(Q[_][z]=F,z==="quantity"||z==="unit_price"){const M=parseFloat(Q[_].quantity)||0,B=parseFloat(Q[_].unit_price)||0;Q[_].total_price=(M*B).toFixed(2)}return{...A,lineItems:Q}})},f=()=>{n(_=>({..._,lineItems:[..._.lineItems,{material_description:"",part_number:"",panel_type_size:"",delivery_date:_.delivery_date||"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}))},c=_=>{n(z=>({...z,lineItems:z.lineItems.filter((F,A)=>A!==_)}))},j=(_,z)=>{s(z==="approved_docs"?F=>{const Q=[...F.approved_docs||[],..._];return Q.length>20?(alert("Maximum 20 files allowed"),F):{...F,[z]:Q}}:F=>({...F,[z]:_[0]}))},T=(_,z)=>{const F=Array.from(_.target.files);F.length!==0&&(j(F,z),_.target.value="")},I=(_,z)=>{_.preventDefault(),z(!0)},x=_=>{_(!1)},D=(_,z,F)=>{_.preventDefault(),F(!1);const A=Array.from(_.dataTransfer.files);A.length!==0&&j(A,z)},U=_=>{s(z=>({...z,approved_docs:z.approved_docs.filter((F,A)=>A!==_)}))},k=_=>{s(F=>({...F,[_]:null}));const z=document.getElementById(`file-input-${_}`);z&&(z.value="")},P=async _=>{if(_.preventDefault(),!t.company_location_id||t.lineItems.length===0){alert("Please select a company and add at least one line item.");return}d(!0);const z=new FormData;z.append("company_location_id",t.company_location_id),z.append("order_date",t.order_date),z.append("delivery_date",t.delivery_date),z.append("notes",t.notes),z.append("priority",t.priority),z.append("po_number",t.po_number),z.append("end_client_name",t.end_client_name||""),z.append("gst_number",t.gst_number||""),z.append("reference_number",t.reference_number||""),z.append("classification",t.classification||"Standard"),z.append("lineItems",JSON.stringify(t.lineItems)),l.po&&z.append("po",l.po),l.quotation&&z.append("quotation",l.quotation),l.approved_docs&&l.approved_docs.length>0&&l.approved_docs.forEach(F=>z.append("approved",F));try{const F=await fetch(window.API_BASE+"/api/orders",{method:"POST",headers:{Authorization:`Bearer ${S}`},body:z});if(F.ok){const A=await F.json();alert(A.message),e&&e(A.order),n({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard",lineItems:[{material_description:"",part_number:"",panel_type_size:"",delivery_date:"",quantity:1,unit:"Nos",unit_price:"",total_price:"",notes:""}]}),s({po:null,quotation:null,approved_docs:[]})}else{const A=await F.json();alert(A.error||"Failed to create order")}}catch(F){console.error("Submit error:",F),alert("Network error during order creation")}finally{d(!1)}};return r.jsxs("div",{className:"order-creation-container",children:[r.jsxs("div",{className:"form-card",children:[r.jsx("h2",{className:"form-title",children:"Create New Order"}),r.jsx("p",{className:"form-subtitle",children:"Fill in the details to generate an Internal Order Number and Unit IDs."}),r.jsxs("form",{onSubmit:P,className:"order-form",children:[r.jsxs("div",{className:"form-grid",children:[r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Select Company & Location"}),r.jsxs("select",{name:"company_location_id",value:t.company_location_id,onChange:E,className:"form-select",children:[r.jsx("option",{value:"",children:"-- None --"}),a.map(_=>{var z;return r.jsx("optgroup",{label:_.name,children:(z=_.locations)==null?void 0:z.map(F=>r.jsxs("option",{value:F.id,children:[_.name," - ",F.city]},F.id))},_.id)})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Order Date"}),r.jsx("input",{type:"date",name:"order_date",value:t.order_date,onChange:E})]}),r.jsxs("div",{className:"form-group",children:[r.jsxs("label",{children:["Overall Delivery Date ",r.jsx("span",{style:{fontSize:"11px",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",name:"delivery_date",value:t.delivery_date,disabled:!0,style:{opacity:.7,cursor:"not-allowed"}})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{name:"priority",value:t.priority,onChange:E,className:"form-input",children:[r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Customer PO Number"}),r.jsx("input",{type:"text",name:"po_number",value:t.po_number,onChange:E})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Dispatch / Packaging"}),r.jsxs("select",{name:"packaging_type",value:t.packaging_type,onChange:E,className:"form-input",children:[r.jsx("option",{value:"",children:"-- Select Packaging Type --"}),r.jsx("option",{value:"Wooden Packaging",children:"Wooden Packaging"}),r.jsx("option",{value:"Foam Packaging",children:"Foam Packaging"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"End Client Name (Optional)"}),r.jsx("input",{type:"text",name:"end_client_name",value:t.end_client_name,onChange:E})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"GST Number (Optional)"}),r.jsx("input",{type:"text",name:"gst_number",value:t.gst_number,onChange:E,placeholder:"e.g. 27AAAAA1111A1Z1"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Customer Reference Number (Optional)"}),r.jsx("input",{type:"text",name:"reference_number",value:t.reference_number,onChange:E,placeholder:"e.g. REF-2026-99"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Classification"}),r.jsxs("select",{name:"classification",value:t.classification||"Standard",onChange:E,style:{width:"100%",padding:"8px 12px",background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--text2)",fontSize:"13px"},children:[r.jsx("option",{value:"Standard",children:"Standard"}),r.jsx("option",{value:"Non-Standard",children:"Non-Standard"})]})]}),r.jsxs("div",{className:"form-group full-width",children:[r.jsx("label",{children:"Overall Order Notes"}),r.jsx("textarea",{name:"notes",value:t.notes,onChange:E})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"32px",marginBottom:"32px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[r.jsx("h3",{className:"section-title",style:{margin:0},children:"Line Items"}),r.jsx("button",{type:"button",className:"vbtn",style:{background:"#3b82f6",fontSize:"12px",padding:"6px 12px"},onClick:f,children:"+ Add Line Item"})]}),t.lineItems.map((_,z)=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"20px",borderRadius:"12px",border:"1px solid var(--border)",marginBottom:"16px",position:"relative"},children:[t.lineItems.length>1&&r.jsx("button",{type:"button",onClick:()=>c(z),style:{position:"absolute",top:"16px",right:"16px",background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:"16px"},children:"✕"}),r.jsxs("div",{className:"line-item-grid-1",children:[r.jsxs("div",{children:[r.jsxs("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:["Line Item # ",r.jsx("span",{style:{color:"#888",fontStyle:"italic"},children:"(auto-assigned)"})]}),r.jsx("input",{type:"text",className:"form-input",value:`Item ${z+1}`,readOnly:!0,style:{background:"var(--bg4)",opacity:.6,cursor:"not-allowed"}})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Material Description"}),r.jsx("input",{type:"text",className:"form-input",value:_.material_description,onChange:F=>m(z,"material_description",F.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Part Number *"}),r.jsx("input",{type:"text",className:"form-input",value:_.part_number,onChange:F=>m(z,"part_number",F.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Panel Type / Size"}),r.jsx("input",{type:"text",className:"form-input",value:_.panel_type_size,onChange:F=>m(z,"panel_type_size",F.target.value)})]})]}),r.jsxs("div",{className:"line-item-grid-2",children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Quantity *"}),r.jsx("input",{type:"number",className:"form-input",min:"1",value:_.quantity,onChange:F=>m(z,"quantity",F.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Unit"}),r.jsx("input",{type:"text",className:"form-input",value:_.unit,onChange:F=>m(z,"unit",F.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Unit Price *"}),r.jsx("input",{type:"number",step:"0.01",min:"0",max:"9999999999999.99",className:"form-input",value:_.unit_price,onChange:F=>m(z,"unit_price",F.target.value),required:!0})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Total Price"}),r.jsx("input",{type:"number",step:"0.01",className:"form-input",value:_.total_price,onChange:F=>m(z,"total_price",F.target.value),readOnly:!0,style:{background:"var(--bg4)",opacity:.7}})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Delivery Date"}),r.jsx("input",{type:"date",className:"form-input",value:_.delivery_date,disabled:!0,style:{opacity:.7,cursor:"not-allowed"}})]})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"#888",marginBottom:"4px"},children:"Item Notes"}),r.jsx("input",{type:"text",className:"form-input",value:_.notes,onChange:F=>m(z,"notes",F.target.value)})]})]},z))]}),r.jsxs("div",{className:"file-upload-section",children:[r.jsx("h3",{className:"section-title",children:"Required Documents"}),r.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"16px"},children:["⚠️ Only ",r.jsx("strong",{style:{color:"var(--text2)"},children:"one"})," PO copy and one Quotation allowed. To replace after submission, delete the existing file first."]}),r.jsxs("div",{className:"file-grid",children:[r.jsxs("div",{className:`file-input-wrapper${u?" dragging":""}`,onDragOver:_=>I(_,h),onDragLeave:()=>x(h),onDrop:_=>D(_,"po",h),children:[r.jsx("label",{children:"Customer PO Copy"}),l.po?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"8px 10px",width:"100%",justifyContent:"center"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981"},children:"✔"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:l.po.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:_=>T(_,"po")})]}),r.jsx("button",{type:"button",onClick:()=>k("po"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"📁 Drag file here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{id:"file-input-po",type:"file",hidden:!0,onChange:_=>T(_,"po")})]})]}),r.jsxs("div",{className:`file-input-wrapper${g?" dragging":""}`,onDragOver:_=>I(_,v),onDragLeave:()=>x(v),onDrop:_=>D(_,"quotation",v),children:[r.jsx("label",{children:"Quotation"}),l.quotation?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"8px 10px",width:"100%",justifyContent:"center"},children:[r.jsx("span",{style:{fontSize:"11px",color:"#10b981"},children:"✔"}),r.jsx("span",{className:"file-name-hint",style:{flex:1,maxWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:l.quotation.name}),r.jsxs("label",{style:{fontSize:"10px",color:"#60a5fa",cursor:"pointer",whiteSpace:"nowrap"},children:["Replace",r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:_=>T(_,"quotation")})]}),r.jsx("button",{type:"button",onClick:()=>k("quotation"),className:"remove-file-btn",title:"Remove",children:"✕"})]}):r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"📁 Drag file here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{id:"file-input-quotation",type:"file",hidden:!0,onChange:_=>T(_,"quotation")})]})]}),r.jsxs("div",{className:`file-input-wrapper${w?" dragging":""}`,onDragOver:_=>I(_,N),onDragLeave:()=>x(N),onDrop:_=>D(_,"approved_docs",N),style:{alignItems:"center"},children:[r.jsx("label",{children:"Approved Documents (Up to 20)"}),r.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",marginTop:"8px",border:"1px dashed var(--border2)",borderRadius:"6px",padding:"16px",cursor:"pointer",color:"var(--text3)",fontSize:"12px",width:"100%",boxSizing:"border-box"},children:[r.jsx("span",{children:"📁 Drag files here or"}),r.jsx("span",{style:{color:"var(--blue)"},children:"browse files"}),r.jsx("input",{type:"file",multiple:!0,hidden:!0,onChange:_=>T(_,"approved_docs")})]}),l.approved_docs&&l.approved_docs.length>0&&r.jsx("div",{className:"selected-files-list",children:l.approved_docs.map((_,z)=>r.jsxs("div",{className:"selected-file-item",children:[r.jsx("span",{className:"file-name-hint",children:_.name}),r.jsx("button",{type:"button",onClick:()=>U(z),className:"remove-file-btn",children:"✕"})]},z))})]})]})]}),r.jsx("div",{className:"form-actions",children:r.jsx("button",{type:"submit",className:"submit-btn",disabled:i,children:i?"Creating Order...":"Initialize Order"})})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function Tp({onImportComplete:e}){var f,c,j,T,I;const[t,n]=p.useState(null),[a,o]=p.useState(!1),[l,s]=p.useState(!1),[i,d]=p.useState(null),u=p.useRef(null),h=localStorage.getItem("token"),g=x=>{x.preventDefault(),o(!0)},v=()=>o(!1),w=x=>{x.preventDefault(),o(!1);const D=x.dataTransfer.files[0];D&&N(D)},N=x=>{if(!x.name.match(/\.xlsx$/i)){alert("Only .xlsx files are supported. Please use the sample template.");return}n(x),d(null)},S=async()=>{if(t){s(!0),d(null);try{const x=new FormData;x.append("file",t);const U=await(await fetch(window.API_BASE+"/api/orders/import",{method:"POST",headers:{Authorization:`Bearer ${h}`},body:x})).json();if(U.error){d({message:U.error,created:[],errors:[]});return}d(U),U.created&&U.created.length>0}catch{d({message:"Network error — could not reach the server. Is Docker running?",created:[],errors:[]})}finally{s(!1)}}},E=x=>{x.preventDefault(),window.location.href=window.API_BASE+"/api/template/order_import_template.xlsx"},m=()=>{n(null),d(null),u.current&&(u.current.value="")};return r.jsxs("div",{className:"oi-container",children:[r.jsxs("div",{className:"oi-card",children:[r.jsxs("div",{className:"oi-header",children:[r.jsxs("div",{children:[r.jsx("h2",{className:"oi-title",children:"Bulk Order Import"}),r.jsxs("p",{className:"oi-subtitle",children:["Upload a filled Excel template to create multiple orders automatically. Each unique ",r.jsx("code",{children:"po_number"})," becomes one order."]})]}),r.jsx("a",{href:"#",onClick:E,className:"oi-download-btn",title:"Download the sample template",children:"⬇ Download Template"})]}),!i&&r.jsxs("div",{className:`oi-dropzone${a?" oi-dragging":""}${t?" oi-has-file":""}`,onDragOver:g,onDragLeave:v,onDrop:w,onClick:()=>{var x;return!t&&((x=u.current)==null?void 0:x.click())},children:[r.jsx("input",{ref:u,type:"file",accept:".xlsx",hidden:!0,onChange:x=>x.target.files[0]&&N(x.target.files[0])}),t?r.jsxs("div",{className:"oi-file-preview",children:[r.jsx("span",{className:"oi-file-icon",children:"📊"}),r.jsxs("div",{className:"oi-file-info",children:[r.jsx("span",{className:"oi-file-name",children:t.name}),r.jsxs("span",{className:"oi-file-size",children:[(t.size/1024).toFixed(1)," KB"]})]}),r.jsx("button",{className:"oi-clear-btn",onClick:x=>{x.stopPropagation(),m()},title:"Remove",children:"✕"})]}):r.jsxs("div",{className:"oi-drop-prompt",children:[r.jsx("div",{className:"oi-drop-icon",children:"📂"}),r.jsxs("div",{className:"oi-drop-text",children:["Drag & drop your ",r.jsx("strong",{children:".xlsx"})," file here"]}),r.jsx("div",{className:"oi-drop-sub",children:"or click to browse"})]})]}),!i&&r.jsx("div",{className:"oi-actions",children:r.jsx("button",{className:"oi-upload-btn",disabled:!t||l,onClick:S,children:l?r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"oi-spinner"})," Processing..."]}):"Import Orders"})}),!i&&r.jsxs("div",{className:"oi-instructions",children:[r.jsx("h3",{className:"oi-inst-title",children:"How to use"}),r.jsxs("ol",{className:"oi-inst-list",children:[r.jsx("li",{children:"Download the template using the button above."}),r.jsxs("li",{children:["Open the ",r.jsx("strong",{children:'"Import Template"'})," sheet and fill in your data."]}),r.jsxs("li",{children:["Each row = one line item. Rows with the same ",r.jsx("code",{children:"po_number"})," are grouped into one order."]}),r.jsxs("li",{children:["Company name & city must match entries in ",r.jsx("strong",{children:"Masters → Companies"}),"."]}),r.jsxs("li",{children:["Dates must be in ",r.jsx("strong",{children:"YYYY-MM-DD"})," format or a proper Excel date."]}),r.jsxs("li",{children:["Save as ",r.jsx("code",{children:".xlsx"})," and upload here."]})]}),r.jsxs("div",{className:"oi-field-ref",children:[r.jsx("h4",{children:"Required Fields"}),r.jsx("div",{className:"oi-field-grid",children:[{f:"company_name",r:!0,note:"Exact match in Masters"},{f:"company_city",r:!0,note:"Exact match in Masters"},{f:"order_date",r:!0,note:"YYYY-MM-DD"},{f:"delivery_date",r:!0,note:"YYYY-MM-DD"},{f:"po_number",r:!0,note:"Groups rows into one order"},{f:"priority",r:!0,note:"Low / Medium / High / Urgent"},{f:"material_description",r:!0,note:"Per line item"},{f:"quantity",r:!0,note:"Positive integer"},{f:"unit",r:!0,note:"e.g. Nos, Sets"},{f:"unit_price",r:!0,note:"Numeric, no ₹"},{f:"packaging_type",r:!1,note:"Wooden Packaging / Foam Packaging"},{f:"end_client_name",r:!1,note:"Optional end client name / site location"},{f:"order_notes",r:!1,note:"Optional"},{f:"part_number",r:!1,note:"Optional"},{f:"panel_type_size",r:!1,note:"e.g. 800x600"},{f:"line_item_delivery_date",r:!1,note:"Defaults to delivery_date"},{f:"line_item_notes",r:!1,note:"Optional"}].map(({f:x,r:D,note:U})=>r.jsxs("div",{className:"oi-field-row",children:[r.jsx("code",{className:"oi-field-name",children:x}),r.jsx("span",{className:`oi-badge ${D?"req":"opt"}`,children:D?"Required":"Optional"}),r.jsx("span",{className:"oi-field-note",children:U})]},x))})]})]}),i&&r.jsxs("div",{className:"oi-result",children:[r.jsxs("p",{className:`oi-result-msg ${((f=i.created)==null?void 0:f.length)>0?"success":"fail"}`,children:[((c=i.created)==null?void 0:c.length)>0?"✅":"⚠️"," ",i.message]}),((j=i.created)==null?void 0:j.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{children:"Created & Merged Orders"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Order Number"}),r.jsx("th",{children:"Units Added"}),r.jsx("th",{children:"Action Taken"})]})}),r.jsx("tbody",{children:i.created.map((x,D)=>r.jsxs("tr",{children:[r.jsx("td",{children:x.po_number}),r.jsx("td",{children:r.jsx("strong",{style:{color:"#60a5fa"},children:x.order_number})}),r.jsx("td",{children:x.units}),r.jsx("td",{children:r.jsx("span",{style:{background:x.is_appended?"#1e3a8a":"#064e3b",color:x.is_appended?"#60a5fa":"#34d399",fontSize:"11px",fontWeight:"bold",padding:"3px 8px",borderRadius:"4px",display:"inline-block"},children:x.is_appended?"Merged (Appended)":"Created (New)"})})]},D))})]})]}),((T=i.errors)==null?void 0:T.length)>0&&r.jsxs("div",{className:"oi-result-section",children:[r.jsx("h4",{style:{color:"#f87171"},children:"Errors"}),r.jsxs("table",{className:"oi-result-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[r.jsx("th",{children:"PO Number"}),r.jsx("th",{children:"Reason"})]})}),r.jsx("tbody",{children:i.errors.map((x,D)=>r.jsxs("tr",{children:[r.jsx("td",{children:x.po_number}),r.jsx("td",{style:{color:"#f87171"},children:x.error})]},D))})]})]}),r.jsxs("div",{style:{display:"flex",gap:12,marginTop:20},children:[r.jsx("button",{className:"oi-upload-btn",onClick:m,children:"Import Another File"}),((I=i.created)==null?void 0:I.length)>0&&r.jsx("button",{className:"oi-upload-btn",style:{background:"#10b981"},onClick:()=>e==null?void 0:e(),children:"View Orders →"})]})]})]}),r.jsx("style",{children:`
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
      `})]})}function th({isOpen:e,onClose:t,onImportComplete:n}){return p.useEffect(()=>{if(!e)return;const a=o=>{o.key==="Escape"&&t()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[e,t]),e?r.jsxs("div",{className:"bim-overlay",onClick:a=>{a.target===a.currentTarget&&t()},children:[r.jsxs("div",{className:"bim-modal",children:[r.jsxs("div",{className:"bim-modal-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[r.jsx("span",{style:{fontSize:"18px"},children:"📥"}),r.jsx("span",{style:{fontWeight:"700",fontSize:"16px",color:"var(--text)"},children:"Bulk Order Import"})]}),r.jsx("button",{className:"bim-close",onClick:t,title:"Close (Esc)",children:"✕"})]}),r.jsx("div",{className:"bim-body",children:r.jsx(Tp,{onImportComplete:()=>{n==null||n(),t()}})})]}),r.jsx("style",{children:`
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
      `})]}):null}function rh({initialSelectedId:e}){var ha,va,ya,ba;const[t,n]=p.useState([]),[a,o]=p.useState(null),[l,s]=p.useState(null),[i,d]=p.useState("created_at"),[u,h]=p.useState(!0),[g,v]=p.useState("inprogress"),w=localStorage.getItem("token"),[N,S]=p.useState([]),[E,m]=p.useState([]),[f,c]=p.useState(null),j=JSON.parse(localStorage.getItem("user")||"{}"),[T,I]=p.useState(null),[x,D]=p.useState(""),[U,k]=p.useState("done"),[P,_]=p.useState(!1),[z,F]=p.useState(!1),[A,Q]=p.useState(null),[M,B]=p.useState({company_location_id:"",order_date:"",delivery_date:"",notes:"",priority:"Medium",po_number:"",packaging_type:"",end_client_name:"",gst_number:"",reference_number:"",classification:"Standard"}),[V,C]=p.useState([]),[$,O]=p.useState(!1),[de,ue]=p.useState(null),[ae,me]=p.useState({material_description:"",part_number:"",panel_type_size:"",quantity:"",unit:"Nos",unit_price:"",delivery_date:"",notes:""}),[se,L]=p.useState(!1),ee=async()=>{try{const y=await fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${w}`}});y.ok&&C(await y.json())}catch(y){console.error("Fetch companies error:",y)}},Y=y=>{B({company_location_id:y.company_location_id||"",order_date:y.order_date?y.order_date.split("T")[0]:"",delivery_date:y.delivery_date?y.delivery_date.split("T")[0]:"",notes:y.notes||"",priority:y.priority||"Medium",po_number:y.po_number||"",packaging_type:y.packaging_type||"",end_client_name:y.end_client_name||"",gst_number:y.gst_number||"",reference_number:y.reference_number||"",classification:y.classification||"Standard"}),Q(y),ee()},be=async y=>{y.preventDefault(),O(!0);try{const G=await fetch(`${window.API_BASE}/api/orders/${A.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify(M)});if(G.ok)alert("Order amended successfully!"),Q(null),await wt(a.id),await jt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const re=await G.json();alert(re.error||"Failed to amend order.")}}catch(G){console.error(G),alert("Network error, please try again.")}finally{O(!1)}},oe=async y=>{if(window.confirm("Are you sure you want to delete this order? This will permanently delete the order, all its line items, all unit serial numbers, steps, and resequence all remaining orders!"))try{const G=await fetch(`${window.API_BASE}/api/orders/${y}`,{method:"DELETE",headers:{Authorization:`Bearer ${w}`}});if(G.ok)alert("Order deleted and remaining orders resequenced successfully!"),o(null),await jt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:null}}));else{const re=await G.json();alert(re.error||"Failed to delete order.")}}catch(G){console.error(G),alert("Network error, please try again.")}},W=y=>{me({material_description:y.material_description||"",part_number:y.part_number||"",panel_type_size:y.panel_type_size||"",quantity:y.quantity||"",unit:y.unit||"Nos",unit_price:y.unit_price||"",delivery_date:y.delivery_date?y.delivery_date.split("T")[0]:"",notes:y.notes||""}),ue(y)},Ee=async y=>{y.preventDefault(),L(!0);try{const G=await fetch(`${window.API_BASE}/api/orders/${a.id}/line-items/${de.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify(ae)});if(G.ok)ue(null),await wt(a.id);else{const re=await G.json();alert(re.error||"Failed to amend line item.")}}catch(G){console.error(G),alert("Network error, please try again.")}finally{L(!1)}},je=(y,G)=>{me(re=>({...re,[y]:G}))},he=async y=>{try{const G=await fetch(`${window.API_BASE}/api/orders/${a.id}/hold/${y}`,{method:"POST",headers:{Authorization:`Bearer ${w}`}});if(G.ok)await wt(a.id),await jt(),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const re=await G.json();alert(re.error||"Failed to update hold status")}}catch(G){console.error(G),alert("Network error updating hold status")}},H=["Admin","Manager","Sales"].includes(j.role),Z=async y=>{if(y.preventDefault(),!(!x||!U)){_(!0);try{const G=await fetch(`${window.API_BASE}/api/planning/line-items/${T.id}/bulk-units-status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify({dept:x,status:U})});if(G.ok)alert(`Successfully updated all ${x} steps to ${U} for this batch.`),I(null),await wt(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}}));else{const re=await G.json();alert(re.error||"Failed to bulk update units.")}}catch(G){console.error(G),alert("Network error, please try again.")}finally{_(!1)}}};p.useEffect(()=>{jt(),ce();const y=G=>{jt(),G.detail&&G.detail.orderId&&o(re=>(re&&re.id===G.detail.orderId&&wt(G.detail.orderId),re))};return window.addEventListener("orderUpdated",y),()=>window.removeEventListener("orderUpdated",y)},[]),p.useEffect(()=>{l?ot(l.id):(S([]),c(null))},[l]);const ce=async()=>{try{const y=await fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${w}`}});y.ok&&m(await y.json())}catch(y){console.error("Fetch users error:",y)}},ot=async y=>{try{const G=await fetch(`${window.API_BASE}/api/units/${y}/steps`,{headers:{Authorization:`Bearer ${w}`}});G.ok&&S(await G.json())}catch(G){console.error("Fetch unit steps error:",G)}},lt=async(y,G)=>{try{(await fetch(`${window.API_BASE}/api/units/${l.id}/steps/${y}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify(G)})).ok&&(await ot(l.id),await wt(a.id),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:a.id}})))}catch(re){console.error("Update unit step error:",re)}};p.useEffect(()=>{e&&t.length>0&&wt(e)},[e,t]);const jt=async()=>{try{const y=await fetch(window.API_BASE+"/api/orders",{headers:{Authorization:`Bearer ${w}`}});if(y.ok){const G=await y.json();n(G)}}catch(y){console.error("Fetch error:",y)}finally{h(!1)}},wt=async y=>{var G;try{const re=await fetch(`${window.API_BASE}/api/orders/${y}`,{headers:{Authorization:`Bearer ${w}`}});if(re.ok){const ye=await re.json();if(o(ye),l){const St=(G=ye.units)==null?void 0:G.find(Mt=>Mt.id===l.id);St&&s(St)}}}catch(re){console.error("Fetch details error:",re)}},kt=y=>{if(!y||y.length===0)return 0;const G={Pending:0,Design:15,"Material Waiting":30,Production:55,"QC Testing":75,"QC Passed":90,"Ready for Dispatch":95,Dispatched:100,Delivered:100,Rework:40,"QC Failed":60};let re=0;return y.forEach(ye=>{re+=G[ye.status]||0}),Math.round(re/y.length)};if(u)return r.jsx("div",{className:"loading",children:"Loading orders..."});const ga=y=>parseInt(y.unit_count)>0&&parseInt(y.dispatched_unit_count)>=parseInt(y.unit_count),Le=t.filter(y=>!ga(y)),Lr=t.filter(y=>ga(y)),gn=g==="completed"?Lr:Le;return Le.reduce((y,G)=>y+parseInt(G.line_item_count||0),0),Lr.reduce((y,G)=>y+parseInt(G.line_item_count||0),0),r.jsxs("div",{className:"order-list-container",children:[r.jsxs("div",{className:"orders-sidebar",children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("h3",{className:"sidebar-title",style:{margin:0},children:"Orders"}),r.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"center"},children:[H&&r.jsx("button",{onClick:()=>F(!0),title:"Bulk Import Orders from Excel",style:{background:"var(--blue-dim)",border:"1px solid var(--blue)",color:"var(--blue)",borderRadius:"6px",padding:"3px 9px",fontSize:"11px",fontWeight:"600",cursor:"pointer",display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap",transition:"opacity 0.15s"},onMouseOver:y=>y.currentTarget.style.opacity="0.8",onMouseOut:y=>y.currentTarget.style.opacity="1",children:"📥 Import"}),r.jsxs("select",{value:i,onChange:y=>d(y.target.value),className:"form-select",style:{padding:"2px 8px",fontSize:"11px",width:"auto"},children:[r.jsx("option",{value:"created_at",children:"Created Date"}),r.jsx("option",{value:"order_date",children:"Order Date"}),r.jsx("option",{value:"delivery_date",children:"Delivery Date"}),r.jsx("option",{value:"po_number",children:"PO Number"})]})]})]}),r.jsxs("div",{style:{display:"flex",gap:"4px",marginBottom:"12px",background:"var(--bg4)",borderRadius:"8px",padding:"4px",border:"1px solid var(--border)"},children:[r.jsxs("button",{onClick:()=>v("inprogress"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:g==="inprogress"?"var(--blue)":"transparent",color:g==="inprogress"?"#fff":"var(--text3)"},children:["In Progress ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",Le.length,")"]})]}),r.jsxs("button",{onClick:()=>v("completed"),style:{flex:1,padding:"6px 0",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"12px",fontWeight:"600",transition:"all 0.2s",background:g==="completed"?"var(--green)":"transparent",color:g==="completed"?"#fff":"var(--text3)"},children:["Completed ",r.jsxs("span",{style:{opacity:.7,fontWeight:400},children:["(",Lr.length,")"]})]})]}),r.jsxs("div",{className:"order-items",children:[gn.length===0&&r.jsx("div",{style:{color:"var(--text3)",fontSize:"13px",textAlign:"center",padding:"32px 16px",fontStyle:"italic"},children:g==="completed"?"No completed orders yet.":"No in-progress orders."}),gn.map(y=>r.jsxs("div",{className:`order-card ${(a==null?void 0:a.id)===y.id?"active":""}`,onClick:()=>wt(y.id),children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"},children:[r.jsx("div",{className:"order-num",style:{margin:0},children:y.order_number}),g==="completed"?r.jsx("span",{style:{background:"rgba(16,185,129,0.15)",color:"#34d399",border:"1px solid rgba(16,185,129,0.3)",borderRadius:"20px",padding:"2px 8px",fontSize:"10px",fontWeight:"700"},children:"✓ DONE"}):y.priority&&r.jsx("span",{className:`priority-badge ${y.priority.toLowerCase()}`,children:y.priority})]}),r.jsxs("div",{className:"order-meta",children:[r.jsxs("span",{children:[y.unit_count," Units"]})," •",r.jsx("span",{children:i==="created_at"?new Date(y.created_at).toLocaleDateString():i==="order_date"?y.order_date?new Date(y.order_date).toLocaleDateString():"No Order Date":i==="delivery_date"?y.delivery_date?new Date(y.delivery_date).toLocaleDateString():"No Delivery Date":i==="po_number"?y.po_number||"No PO Number":""})]}),y.company_name&&r.jsxs("div",{className:"order-company",children:["🏢 ",y.company_name," - ",y.company_city]})]},y.id))]})]}),r.jsx("div",{className:"order-details-pane",children:a?r.jsxs("div",{className:"details-content",children:[r.jsxs("div",{className:"details-header",children:[r.jsxs("div",{children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"},children:[r.jsx("h2",{style:{margin:0},children:a.order_number}),["Admin","Manager","Sales"].includes(j.role)&&r.jsx("button",{className:"vbtn",style:{padding:"4px 12px",fontSize:"12px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>Y(a),children:"Amend Order"}),j.role==="Admin"&&r.jsx("button",{className:"vbtn",style:{padding:"4px 12px",fontSize:"12px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>oe(a.id),children:"Delete Order"}),a.hold_status==="Requested"&&r.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsx("span",{style:{fontSize:"11px",background:"rgba(245, 158, 11, 0.15)",color:"#f59e0b",padding:"4px 8px",borderRadius:"4px",fontWeight:"600"},children:"Hold Requested"}),["Admin","Manager"].includes(j.role)&&r.jsxs(r.Fragment,{children:[r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#10b981",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>he("approve"),children:"Approve Hold"}),r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>he("reject"),children:"Reject"})]})]}),a.hold_status==="Approved"&&r.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsx("span",{style:{fontSize:"11px",background:"rgba(239, 68, 68, 0.15)",color:"#ef4444",padding:"4px 8px",borderRadius:"4px",fontWeight:"700",textTransform:"uppercase"},children:"⛔ ON HOLD"}),["Admin","Manager","Sales"].includes(j.role)&&r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>he("resume"),children:"Resume Order"})]}),(a.hold_status==="None"||!a.hold_status)&&["Admin","Manager","Sales"].includes(j.role)&&r.jsx("button",{type:"button",className:"vbtn",style:{padding:"4px 12px",fontSize:"11px",background:"#f59e0b",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>he("request"),children:"Request Hold"})]}),a.company_name&&r.jsxs("div",{className:"order-company-lg",style:{marginTop:"4px"},children:["🏢 ",a.company_name," (",a.company_city,")"]})]}),r.jsxs("div",{className:"creator-info",children:["Created by: ",a.creator_name||"System"]})]}),a.hold_status==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.25)",borderRadius:"8px",padding:"12px 16px",marginBottom:"20px",color:"#ef4444",fontWeight:"500",fontSize:"13px"},children:["⚠️ ",r.jsx("strong",{children:"ORDER IS CURRENTLY ON HOLD"})," — All production updates, step changes, and document uploads for this order and its units are currently locked."]}),r.jsxs("div",{className:"order-progress-container",children:[r.jsxs("div",{className:"progress-labels",children:[r.jsx("span",{children:"Order Progress"}),r.jsxs("span",{children:[kt(a.units),"%"]})]}),r.jsx("div",{className:"progress-bar-bg",children:r.jsx("div",{className:"progress-bar-fill",style:{width:`${kt(a.units)}%`}})})]}),r.jsxs("div",{className:"details-grid",style:{gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:"20px"},children:[r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Priority"}),r.jsx("div",{className:"val",children:r.jsx("span",{className:`priority-badge ${((ha=a.priority)==null?void 0:ha.toLowerCase())||"medium"}`,children:a.priority||"Medium"})})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Order Date"}),r.jsx("div",{className:"val",children:a.order_date?new Date(a.order_date).toLocaleDateString("en-IN"):"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Delivery Date"}),r.jsx("div",{className:"val",children:a.delivery_date?new Date(a.delivery_date).toLocaleDateString("en-IN"):"TBD"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"PO Number"}),r.jsx("div",{className:"val",children:a.po_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Cust. Ref #"}),r.jsx("div",{className:"val",children:a.reference_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Classification"}),r.jsx("div",{className:"val",style:{fontWeight:"600",color:a.classification==="Non-Standard"?"var(--blue)":"var(--text2)"},children:a.classification||"Standard"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"End Client"}),r.jsx("div",{className:"val",children:a.end_client_name||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"GST Number"}),r.jsx("div",{className:"val",children:a.gst_number||"N/A"})]}),r.jsxs("div",{className:"detail-box",children:[r.jsx("label",{children:"Packaging"}),r.jsx("div",{className:"val",children:a.packaging_type||"N/A"})]}),r.jsxs("div",{className:"detail-box",style:{gridColumn:"1 / -1"},children:[r.jsx("label",{children:"Notes"}),r.jsx("div",{className:"val",style:{whiteSpace:"pre-wrap"},children:a.notes||"No notes"})]})]}),r.jsxs("div",{className:"line-items-section",style:{marginTop:"24px"},children:[r.jsx("h3",{children:"Line Items & Units"}),(va=a.line_items)==null?void 0:va.map(y=>{var re;const G=((re=a.units)==null?void 0:re.filter(ye=>ye.line_item_id===y.id))||[];return r.jsxs("div",{style:{background:"var(--bg3)",borderRadius:"8px",padding:"16px",marginBottom:"16px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",borderBottom:"1px solid var(--border2)",paddingBottom:"8px"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[r.jsx("strong",{children:y.line_item_number}),": ",y.material_description," ",y.part_number?`(${y.part_number})`:"",["Admin","Manager","Production","Sales","Design","Purchase","Stores","QC","Dispatch","Accounts","Planning"].includes(j.role)&&r.jsx("button",{className:"vbtn",style:{padding:"2px 8px",fontSize:"10px",background:"#2563eb",border:"none",borderRadius:"4px",cursor:"pointer",display:"inline-flex",alignItems:"center",height:"22px"},onClick:()=>{if(a.hold_status==="Approved"){alert("Order is currently on hold. Updates are disabled.");return}D(""),k("done"),I(y)},children:"Bulk Update Batch"}),["Admin","Manager","Sales"].includes(j.role)&&r.jsx("button",{className:"vbtn",title:"Amend Line Item",style:{padding:"2px 8px",fontSize:"10px",background:"#7c3aed",border:"none",borderRadius:"4px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"4px",height:"22px"},onClick:()=>{if(a.hold_status==="Approved"){alert("Order is currently on hold. Amendments are disabled.");return}W(y)},children:"✏ Amend"})]}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:"13px"},children:[y.quantity," ",y.unit||"Nos"," @ ₹",y.unit_price]})]}),r.jsx("div",{className:"units-grid",children:G.map(ye=>r.jsxs("div",{className:"unit-badge interactive",onClick:()=>s(ye),children:[r.jsx("span",{className:"u-id",children:ye.short_serial}),r.jsx("span",{className:`u-status ${ye.status.toLowerCase().replace(/\s+/g,"-")}`,children:ye.status})]},ye.id))})]},y.id)})]}),r.jsx(Po,{entityType:"Order",entityId:a.id,initialDocs:((ya=a.documents)==null?void 0:ya.filter(y=>y.entity_type==="Order"))||[],userRole:j.role,readOnly:a.hold_status==="Approved"})]}):r.jsx("div",{className:"select-prompt",children:"Select an order from the list to view details and documents."})}),l&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&s(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Unit Tracking"}),r.jsxs("div",{className:"modal-sub",children:[l.unit_id," (",l.status,")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>s(null),children:"✕"})]}),r.jsxs("div",{className:"modal-body",children:[(a==null?void 0:a.hold_status)==="Approved"&&r.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.08)",border:"1px solid rgba(239, 68, 68, 0.15)",borderRadius:"6px",padding:"8px 12px",marginBottom:"12px",color:"#ef4444",fontSize:"11px",fontWeight:"500"},children:["⛔ ",r.jsx("strong",{children:"Order is on hold."})," Production flow step updates are locked until the hold is released."]}),r.jsxs("div",{style:{marginBottom:20},children:[r.jsx("h4",{style:{margin:"0 0 12px 0",color:"var(--text)",fontSize:"14px",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Production Steps"}),N.length===0?r.jsx("div",{style:{color:"var(--text3)",fontSize:"13px",fontStyle:"italic"},children:"Loading steps..."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[...N].sort((y,G)=>["Admin","Manager"].includes(j.role)?0:y.dept===j.role&&G.dept!==j.role?-1:G.dept===j.role&&y.dept!==j.role?1:0).map(y=>{const G=f===y.id,re=(["Admin","Manager"].includes(j.role)||y.dept===j.role||y.assigned_user_id===j.id)&&(a==null?void 0:a.hold_status)!=="Approved",ye=E.find(ge=>ge.id===y.assigned_user_id);let St=[];try{St=Array.isArray(y.custom_fields)?y.custom_fields:JSON.parse(y.custom_fields||"[]")}catch{St=[]}const Mt=E.filter(ge=>ge.role===y.dept);return r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"},onClick:()=>c(G?null:y.id),children:[r.jsxs("div",{children:[r.jsxs("div",{style:{fontWeight:"600",color:"var(--text)",fontSize:"13px"},children:[!re&&r.jsx("span",{style:{color:"#60a5fa",marginRight:"6px",fontSize:"9px",textTransform:"uppercase",background:"rgba(59, 130, 246, 0.1)",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(59, 130, 246, 0.2)"},children:"View Only"}),y.name]}),r.jsxs("div",{style:{fontSize:"11px",color:"var(--text3)",marginTop:"2px"},children:["Dept: ",r.jsx("span",{style:{color:"#60a5fa"},children:y.dept})," | Assigned: ",r.jsx("span",{style:{color:"#34d399"},children:ye?ye.username:"Unassigned"})]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[r.jsx("span",{className:`step-status-badge badge-${y.status}`,style:{fontSize:"9px",fontWeight:"bold"},children:y.status}),r.jsx("span",{style:{fontSize:"10px",color:"var(--text3)"},children:G?"▲":"▼"})]})]}),G&&r.jsxs("div",{style:{marginTop:"12px",paddingTop:"12px",borderTop:"1px dashed var(--border2)"},children:[!re&&r.jsxs("div",{style:{background:"rgba(59, 130, 246, 0.08)",border:"1px solid rgba(59, 130, 246, 0.15)",borderRadius:"6px",padding:"8px 12px",marginBottom:"12px",color:"#60a5fa",fontSize:"11px"},children:["ℹ️ ",r.jsx("strong",{children:"View-Only Mode"})," — managed by the ",r.jsx("strong",{children:y.dept})," department."]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Step Status"}),re?r.jsxs("select",{className:"form-select",value:y.status,onChange:ge=>lt(y.id,{status:ge.target.value}),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("div",{style:{marginTop:"2px"},children:r.jsx("span",{className:`step-status-badge ${($e[y.status]||$e.pending).cls}`,style:{fontSize:"11px",padding:"3px 8px",fontWeight:"bold"},children:($e[y.status]||$e.pending).label})})]}),r.jsxs("div",{children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Assign Worker"}),re?r.jsxs("select",{className:"form-select",value:y.assigned_user_id||"",onChange:ge=>lt(y.id,{assigned_user_id:ge.target.value?parseInt(ge.target.value):null}),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Unassigned"}),Mt.map(ge=>r.jsx("option",{value:ge.id,children:ge.username},ge.id))]}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text)",background:"var(--bg3)",padding:"6px 10px",borderRadius:"6px"},children:ye?ye.username:"Unassigned"})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Notes"}),re?r.jsx("textarea",{className:"form-input",defaultValue:y.notes||"",onBlur:ge=>lt(y.id,{notes:ge.target.value}),placeholder:"Add step notes...",style:{fontSize:"12px",height:"50px",resize:"vertical"}}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text2)",fontStyle:"italic",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px",whiteSpace:"pre-wrap"},children:y.notes||"No notes added."})]}),St.length>0&&r.jsxs("div",{style:{marginBottom:"12px",padding:"10px",background:"var(--bg3)",borderRadius:"6px",border:"1px solid var(--border)"},children:[r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",fontWeight:"bold",marginBottom:"8px",textTransform:"uppercase"},children:"Custom Fields"}),St.map((ge,Ko)=>{var ja;const hn=st=>{const wa=[...St];wa[Ko].value=st,lt(y.id,{custom_fields:wa})};return r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text2)",display:"block",marginBottom:"2px"},children:ge.label}),re?ge.type==="Yes/No"?r.jsx("input",{type:"checkbox",checked:!!ge.value,onChange:st=>hn(st.target.checked)}):ge.type==="Dropdown"?r.jsxs("select",{className:"form-select",value:ge.value||"",onChange:st=>hn(st.target.value),style:{fontSize:"12px",padding:"4px"},children:[r.jsx("option",{value:"",children:"Select..."}),(ja=ge.options)==null?void 0:ja.map(st=>r.jsx("option",{value:st,children:st},st))]}):r.jsx("input",{type:ge.type==="Number"?"number":"text",className:"form-input",defaultValue:ge.value||"",onBlur:st=>hn(st.target.value),style:{fontSize:"12px",padding:"4px 8px"}}):r.jsx("div",{style:{fontSize:"12px",color:"var(--text)",fontWeight:"500",marginTop:"2px"},children:ge.type==="Yes/No"?ge.value==="Yes"||ge.value===!0?"✅ Yes":"❌ No":ge.value||"—"})]},ge.id)})]})]})]},y.id)})})]}),r.jsx("div",{style:{marginTop:24,borderTop:"1px solid var(--border)",paddingTop:"16px"},children:r.jsx(Po,{entityType:"Unit",entityId:l.id,initialDocs:((ba=a.documents)==null?void 0:ba.filter(y=>y.entity_type==="Unit"&&y.entity_id===l.id))||[],onUploadSuccess:()=>wt(a.id),userRole:j.role,readOnly:a.hold_status==="Approved"})})]})]})}),T&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&I(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"400px",width:"90%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Update Batch Units"}),r.jsxs("div",{className:"modal-sub",children:["Line Item: ",T.line_item_number," (",T.quantity," units)"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>I(null),children:"✕"})]}),r.jsxs("form",{onSubmit:Z,className:"modal-body",children:[r.jsxs("div",{className:"modal-field",style:{marginBottom:"16px"},children:[r.jsx("label",{style:{display:"block",color:"var(--text2)",fontSize:"13px",marginBottom:"6px"},children:"Target Department Task"}),r.jsxs("select",{className:"form-select",value:x,onChange:y=>D(y.target.value),style:{width:"100%",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"",children:"-- Select Department --"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"})]})]}),r.jsxs("div",{className:"modal-field",style:{marginBottom:"20px"},children:[r.jsx("label",{style:{display:"block",color:"var(--text2)",fontSize:"13px",marginBottom:"6px"},children:"Set Task Status to"}),r.jsxs("select",{className:"form-select",value:U,onChange:y=>k(y.target.value),style:{width:"100%",borderRadius:"6px",padding:"10px"},required:!0,children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"})]})]}),r.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"flex-end",gap:"10px"},children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>I(null),disabled:P,children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",disabled:P,style:{background:"#3b82f6",border:"none",color:"#fff",borderRadius:"6px",padding:"8px 16px",cursor:"pointer",fontWeight:"600"},children:P?"Updating...":"Update All Units"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}}),r.jsx(th,{isOpen:z,onClose:()=>F(!1),onImportComplete:()=>{jt(),window.dispatchEvent(new CustomEvent("orderUpdated"))}}),A&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&Q(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"700px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Amend Order Details"}),r.jsxs("div",{className:"modal-sub",children:["Updating fields for ",A.order_number]})]}),r.jsx("button",{className:"modal-close",onClick:()=>Q(null),children:"✕"})]}),r.jsxs("form",{onSubmit:be,children:[r.jsx("div",{className:"modal-body",children:r.jsxs("div",{className:"form-grid",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"},children:[r.jsxs("div",{className:"form-group",style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Select Company & Location"}),r.jsxs("select",{className:"form-select",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:M.company_location_id,onChange:y=>B({...M,company_location_id:y.target.value}),required:!0,children:[r.jsx("option",{value:"",children:"-- None --"}),V.map(y=>{var G;return r.jsx("optgroup",{label:y.name,children:(G=y.locations)==null?void 0:G.map(re=>r.jsxs("option",{value:re.id,children:[y.name," - ",re.city]},re.id))},y.id)})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Order Date"}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:M.order_date,onChange:y=>{const G=y.target.value;let re=M.delivery_date;if(G){const ye=new Date(G);ye.setDate(ye.getDate()+28),re=ye.toISOString().split("T")[0]}B({...M,order_date:G,delivery_date:re})}})]}),r.jsxs("div",{className:"form-group",children:[r.jsxs("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:["Overall Delivery Date ",r.jsx("span",{style:{textTransform:"none",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",opacity:.7,cursor:"not-allowed"},value:M.delivery_date,disabled:!0})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Priority"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:M.priority,onChange:y=>B({...M,priority:y.target.value}),children:[r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Customer PO Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:M.po_number,onChange:y=>B({...M,po_number:y.target.value}),placeholder:"e.g. PO-45000"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Packaging Type"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:M.packaging_type,onChange:y=>B({...M,packaging_type:y.target.value}),children:[r.jsx("option",{value:"",children:"-- Select Packaging Type --"}),r.jsx("option",{value:"Wooden Packaging",children:"Wooden Packaging"}),r.jsx("option",{value:"Foam Packaging",children:"Foam Packaging"})]})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"End Client Name"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:M.end_client_name,onChange:y=>B({...M,end_client_name:y.target.value}),placeholder:"e.g. Reliance Industries"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"GST Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:M.gst_number,onChange:y=>B({...M,gst_number:y.target.value}),placeholder:"e.g. 27AAAAA1111A1Z1"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Customer Reference Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:M.reference_number,onChange:y=>B({...M,reference_number:y.target.value}),placeholder:"e.g. REF-2026-99"})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Classification"}),r.jsxs("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)"},value:M.classification||"Standard",onChange:y=>B({...M,classification:y.target.value}),children:[r.jsx("option",{value:"Standard",children:"Standard"}),r.jsx("option",{value:"Non-Standard",children:"Non-Standard"})]})]}),r.jsxs("div",{className:"form-group",style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Overall Order Notes"}),r.jsx("textarea",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",height:"80px",resize:"vertical"},value:M.notes,onChange:y=>B({...M,notes:y.target.value}),placeholder:"Enter special notes..."})]})]})}),r.jsxs("div",{className:"modal-footer",style:{display:"flex",justifyContent:"flex-end",gap:"10px",padding:"16px",borderTop:"1px solid var(--border)"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#64748b",border:"none",color:"#fff",padding:"8px 16px",borderRadius:"4px",cursor:"pointer"},onClick:()=>Q(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",style:{background:"#10b981",border:"none",color:"#fff",padding:"8px 16px",borderRadius:"4px",cursor:"pointer"},disabled:$,children:$?"Saving...":"Save Changes"})]})]})]})}),de&&r.jsx("div",{className:"modal-overlay open",onClick:y=>{y.target.className==="modal-overlay open"&&ue(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"640px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Amend Line Item"}),r.jsxs("div",{className:"modal-sub",children:["Item ",de.line_item_number," — ",a==null?void 0:a.order_number]})]}),r.jsx("button",{className:"modal-close",onClick:()=>ue(null),children:"✕"})]}),r.jsxs("form",{onSubmit:Ee,children:[r.jsx("div",{className:"modal-body",children:r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"},children:[r.jsxs("div",{style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Material Description"}),r.jsx("input",{type:"text",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ae.material_description,onChange:y=>je("material_description",y.target.value),placeholder:"e.g. VFD Control Panel 22kW"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Part Number"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ae.part_number,onChange:y=>je("part_number",y.target.value),placeholder:"e.g. VFD-22K-STD"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Panel Type / Size"}),r.jsx("input",{type:"text",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ae.panel_type_size,onChange:y=>je("panel_type_size",y.target.value),placeholder:"e.g. 800x600"})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Quantity"}),r.jsx("input",{type:"number",min:"1",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ae.quantity,onChange:y=>je("quantity",y.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Unit"}),r.jsx("select",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ae.unit,onChange:y=>je("unit",y.target.value),children:["Nos","Sets","Pcs","Units","Lot"].map(y=>r.jsx("option",{value:y,children:y},y))})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Unit Price (₹)"}),r.jsx("input",{type:"number",min:"0",max:"9999999999999.99",step:"0.01",required:!0,style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box"},value:ae.unit_price,onChange:y=>je("unit_price",y.target.value)})]}),r.jsxs("div",{style:{gridColumn:"span 2",padding:"8px 12px",background:"var(--bg2)",borderRadius:"6px",border:"1px solid var(--border)",fontSize:"13px",color:"var(--text3)"},children:["Total Price: ",r.jsxs("strong",{style:{color:"var(--text)",fontSize:"15px"},children:["₹",((parseFloat(ae.unit_price)||0)*(parseInt(ae.quantity)||0)).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})]}),r.jsx("span",{style:{marginLeft:"8px",fontSize:"11px"},children:"(auto-calculated)"})]}),r.jsxs("div",{children:[r.jsxs("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:["Line Item Delivery Date ",r.jsx("span",{style:{textTransform:"none",color:"var(--text3)"},children:"(Auto-calculated)"})]}),r.jsx("input",{type:"date",style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",boxSizing:"border-box",opacity:.7,cursor:"not-allowed"},value:ae.delivery_date,disabled:!0})]}),r.jsxs("div",{style:{gridColumn:"span 2"},children:[r.jsx("label",{style:{display:"block",fontSize:"11px",color:"var(--text3)",marginBottom:"4px",textTransform:"uppercase"},children:"Notes"}),r.jsx("textarea",{style:{width:"100%",padding:"8px",borderRadius:"6px",background:"var(--bg3)",color:"var(--text)",border:"1px solid var(--border)",height:"72px",resize:"vertical",boxSizing:"border-box"},value:ae.notes,onChange:y=>je("notes",y.target.value),placeholder:"Item-specific notes..."})]})]})}),r.jsxs("div",{className:"modal-footer",style:{display:"flex",justifyContent:"flex-end",gap:"10px",padding:"16px",borderTop:"1px solid var(--border)"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#64748b",border:"none",color:"#fff",padding:"8px 18px",borderRadius:"4px",cursor:"pointer"},onClick:()=>ue(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",style:{background:"#7c3aed",border:"none",color:"#fff",padding:"8px 18px",borderRadius:"4px",cursor:"pointer"},disabled:se,children:se?"Saving...":"Save Line Item"})]})]})]})})]})}const Ip=[{key:"orders.order_number",label:"Order #"},{key:"orders.po_number",label:"PO Number"},{key:"orders.order_date",label:"Order Date"},{key:"orders.delivery_date",label:"Delivery Date"},{key:"orders.planned_dispatch_date",label:"Planned Dispatch Date"},{key:"orders.priority",label:"Priority"},{key:"orders.classification",label:"Classification"},{key:"orders.packaging_type",label:"Packaging Type"},{key:"orders.end_client_name",label:"End Client Name"},{key:"orders.reference_number",label:"Reference Number"},{key:"orders.gst_number",label:"GST Number"},{key:"orders.hold_status",label:"Hold Status"},{key:"orders.order_status",label:"Order Status"},{key:"orders.notes",label:"Order Notes"},{key:"company_name",label:"Company Name"},{key:"company_city",label:"Company City"},{key:"person_in_charge",label:"Person In Charge"},{key:"contact_number",label:"Contact Number"},{key:"company_email",label:"Company Email"},{key:"orders.wiring_assigned_date",label:"Wiring Assigned Date"},{key:"orders.wiring_expected_date",label:"Wiring Expected Date"},{key:"orders.expected_qc_date",label:"Expected QC Date"},{key:"orders.qc_date",label:"QC Date"},{key:"orders.qc_status",label:"QC Status"},{key:"li.material_description",label:"Material Description"},{key:"li.part_number",label:"Part Number"},{key:"li.panel_type_size",label:"Panel Type / Size"},{key:"li.delivery_date",label:"Line Item Delivery Date"},{key:"li.quantity",label:"Quantity"},{key:"li.unit",label:"Unit"},{key:"li.unit_price",label:"Unit Price"},{key:"li.total_price",label:"Total Price"},{key:"docs.any",label:"📄 Any document uploaded"},{key:"docs.PO",label:"📄 PO document uploaded"},{key:"docs.Drawing",label:"📄 Drawing uploaded"},{key:"docs.BOM",label:"📄 BOM uploaded"},{key:"docs.QC",label:"📄 QC document uploaded"},{key:"docs.Dispatch",label:"📄 Dispatch document uploaded"},{key:"docs.Quotation",label:"📄 Quotation uploaded"},{key:"docs.General",label:"📄 General document uploaded"},{key:"docs.TaskUpload",label:"📄 Task upload present"},{key:"unit_serial",label:"Unit Serial"},{key:"short_serial",label:"Short Serial"},{key:"current_dept",label:"Current Department"},{key:"unit_status",label:"Unit Status"},{key:"__custom__",label:"✏️ Custom key…"}],Kd=[{value:"",label:"— No condition (any non-empty) —",needsValue:!1},{value:"IS_NOT_EMPTY",label:"is not empty",needsValue:!1},{value:"IS_EMPTY",label:"is empty",needsValue:!1},{value:"HAS_DOCS",label:"📄 has documents (count > 0)",needsValue:!1},{value:"NO_DOCS",label:"📄 has no documents (count = 0)",needsValue:!1},{value:"EQUALS",label:"= equals",needsValue:!0},{value:"NOT_EQUALS",label:"≠ not equals",needsValue:!0},{value:"CONTAINS",label:"contains",needsValue:!0},{value:"GT",label:"> greater than",needsValue:!0},{value:"GTE",label:"≥ greater than or equal",needsValue:!0},{value:"LT",label:"< less than",needsValue:!0},{value:"LTE",label:"≤ less than or equal",needsValue:!0},{value:"DATE_FUTURE",label:"date is in the future",needsValue:!1},{value:"DATE_PAST",label:"date is today or past",needsValue:!1}],Cl=(e,t)=>{switch(e){case"":return"";case"IS_NOT_EMPTY":return'$val !== "" && $val !== null && $val !== undefined';case"IS_EMPTY":return'$val === "" || $val === null || $val === undefined';case"HAS_DOCS":return"Number($val) > 0";case"NO_DOCS":return'Number($val) === 0 || $val === ""';case"EQUALS":return`String($val).toLowerCase() === ${JSON.stringify(String(t).toLowerCase())}`;case"NOT_EQUALS":return`String($val).toLowerCase() !== ${JSON.stringify(String(t).toLowerCase())}`;case"CONTAINS":return`String($val).toLowerCase().includes(${JSON.stringify(String(t).toLowerCase())})`;case"GT":return`Number($val) > ${Number(t)||0}`;case"GTE":return`Number($val) >= ${Number(t)||0}`;case"LT":return`Number($val) < ${Number(t)||0}`;case"LTE":return`Number($val) <= ${Number(t)||0}`;case"DATE_FUTURE":return"new Date($val) > new Date()";case"DATE_PAST":return"new Date($val) <= new Date()";default:return""}},nh=(e,t)=>{var a;if(!e)return"auto-done when not empty";const n=((a=Ip.find(o=>o.key===t))==null?void 0:a.label)||t;return e==="Number($val) > 0"?`${n} → at least 1 document`:e.includes("Number($val) === 0")?`${n} → no documents`:e.includes('!== ""')?`${n} is not empty`:e.includes('=== ""')?`${n} is empty`:e.includes(".includes(")?`${n} contains value`:e.includes("new Date($val) > new Date()")?`${n} is in the future`:e.includes("new Date($val) <= new Date()")?`${n} is today or past`:e.includes("=== ")?`${n} equals value`:e.includes("!== ")?`${n} does not equal value`:e.includes("> ")?`${n} > value`:e.includes(">= ")?`${n} >= value`:e.includes("< ")?`${n} < value`:e.includes("<= ")?`${n} <= value`:e},ah=[{key:"order_number",label:"Order Number"},{key:"company_name",label:"Company Name"},{key:"delivery_date",label:"Delivery Date"},{key:"po_number",label:"PO Number"},{key:"packaging_type",label:"Packaging Type"},{key:"priority",label:"Priority"},{key:"notes",label:"Order Notes"}];function oh(){var V;const[e,t]=p.useState("companies"),[n,a]=p.useState([]),[o,l]=p.useState(!1),[s,i]=p.useState({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),[d,u]=p.useState([]),[h,g]=p.useState(!1),[v,w]=p.useState(null),[N,S]=p.useState({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),[E,m]=p.useState([]),[f,c]=p.useState(!1),[j,T]=p.useState({label:"",type:"Text",options:"",datakeyPreset:"",customDatakey:"",operator:"",conditionValue:""}),I=localStorage.getItem("token"),D=JSON.parse(localStorage.getItem("user")||"{}").role==="Admin";p.useEffect(()=>{U(),k()},[]),p.useEffect(()=>{const C=$=>{$.altKey&&$.key.toLowerCase()==="n"&&($.preventDefault(),e==="companies"&&D?l(!0):e==="tasks"&&D&&(w(null),S({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,order_fields:[]}),m([]),c(!1),g(!0)))};return window.addEventListener("keydown",C),()=>{window.removeEventListener("keydown",C)}},[e,D]);const U=async()=>{try{const C=await fetch(window.API_BASE+"/api/companies",{headers:{Authorization:`Bearer ${I}`}});C.ok&&a(await C.json())}catch(C){console.error(C)}},k=async()=>{try{const C=await fetch(window.API_BASE+"/api/task_masters",{headers:{Authorization:`Bearer ${I}`}});C.ok&&u(await C.json())}catch(C){console.error(C)}},P=(C,$,O)=>{const de=[...s.locations];de[C][$]=O,i({...s,locations:de})},_=()=>{i({...s,locations:[...s.locations,{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]})},z=async C=>{C.preventDefault();try{(await fetch(window.API_BASE+"/api/companies",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${I}`},body:JSON.stringify(s)})).ok&&(l(!1),i({name:"",locations:[{address:"",city:"",person_in_charge:"",contact_number:"",email:""}]}),U())}catch($){console.error($)}},F=async C=>{C.preventDefault();const $=!!v,O=$?`${window.API_BASE}/api/task_masters/${v}`:window.API_BASE+"/api/task_masters",de=$?"PUT":"POST",ue=E.map(({id:ae,label:me,type:se,options:L,datakey:ee,condition:Y})=>({id:ae,label:me,type:se,options:L||[],datakey:ee||"",condition:Y||""}));try{(await fetch(O,{method:de,headers:{"Content-Type":"application/json",Authorization:`Bearer ${I}`},body:JSON.stringify({...N,custom_fields:ue,order_fields:N.order_fields||[]})})).ok?(g(!1),w(null),S({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),m([]),c(!1),k()):alert("Failed to save task")}catch(ae){console.error(ae)}},A=C=>{w(C.id),S({dept:C.dept,name:C.name,sub:C.sub||"",special:C.special||"",is_mandatory:C.is_mandatory,requires_upload:C.requires_upload,default_doc_type:C.default_doc_type||"General",order_fields:Array.isArray(C.order_fields)?C.order_fields:C.order_fields?JSON.parse(C.order_fields):[]});try{const $=Array.isArray(C.custom_fields)?C.custom_fields:JSON.parse(C.custom_fields||"[]");m($)}catch{m([])}c(!1),g(!0)},Q=()=>{if(!j.label.trim()){alert("Label is required.");return}const C=j.datakeyPreset==="__custom__"?(j.customDatakey||"").trim():(j.datakeyPreset||"").trim(),$=Cl(j.operator,j.conditionValue),O={id:Date.now(),label:j.label.trim(),type:j.type,options:j.type==="Dropdown"?j.options.split(",").map(de=>de.trim()).filter(Boolean):[],datakey:C,condition:$};m(de=>[...de,O]),T({label:"",type:"Text",options:"",datakeyPreset:"",customDatakey:"",operator:"",conditionValue:""}),c(!1)},M=C=>m($=>$.filter(O=>O.id!==C)),B=async C=>{if(window.confirm("Are you sure you want to delete this task?"))try{(await fetch(`${window.API_BASE}/api/task_masters/${C}`,{method:"DELETE",headers:{Authorization:`Bearer ${I}`}})).ok?k():alert("Failed to delete task")}catch($){console.error($)}};return r.jsxs("div",{style:{padding:"24px"},children:[r.jsxs("div",{style:{display:"flex",gap:"16px",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:[r.jsx("button",{className:`vbtn ${e==="companies"?"active":""}`,onClick:()=>t("companies"),children:"Companies"}),r.jsx("button",{className:`vbtn ${e==="tasks"?"active":""}`,onClick:()=>t("tasks"),children:"Task Masters"})]}),e==="companies"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"var(--text)"},children:"Company Masters"}),D&&r.jsx("button",{className:"vbtn",onClick:()=>l(!0),children:"+ Register Company (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:n.map(C=>r.jsxs("div",{style:{background:"var(--bg2)",padding:"20px",borderRadius:"12px",border:"1px solid var(--border)"},children:[r.jsx("h3",{style:{margin:"0 0 16px 0",color:"var(--text)"},children:C.name}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:C.locations.map($=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"16px",borderRadius:"8px",border:"1px solid var(--border)"},children:[r.jsx("div",{style:{color:"var(--blue)",fontWeight:"bold",marginBottom:"8px"},children:$.city}),r.jsx("div",{style:{fontSize:"13px",color:"var(--text2)",marginBottom:"4px"},children:$.address}),r.jsxs("div",{style:{fontSize:"12px",color:"var(--text3)",marginTop:"12px"},children:[r.jsxs("div",{children:[r.jsx("strong",{children:"Contact:"})," ",$.person_in_charge||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Phone:"})," ",$.contact_number||"N/A"]}),r.jsxs("div",{children:[r.jsx("strong",{children:"Email:"})," ",$.email||"N/A"]})]})]},$.id))})]},C.id))})]}),e==="tasks"&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px"},children:[r.jsx("h2",{style:{margin:0,color:"var(--text)"},children:"Task Masters"}),D&&r.jsx("button",{className:"vbtn",onClick:()=>{w(null),S({dept:"Sales",name:"",sub:"",special:"",is_mandatory:!0,requires_upload:!1,default_doc_type:"General",order_fields:[]}),m([]),c(!1),g(!0)},children:"+ New Task (Alt+N)"})]}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:Bt.map(C=>{const $=d.filter(O=>O.dept===C.id);return $.length===0?null:r.jsxs("div",{children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"},children:[r.jsx("div",{style:{width:"4px",height:"16px",background:C.color,borderRadius:"2px"}}),r.jsx("h3",{style:{margin:0,color:"var(--text)",fontSize:"15px"},children:C.label})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"16px"},children:$.map(O=>r.jsxs("div",{style:{background:"var(--bg2)",padding:"16px",borderRadius:"8px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px"},children:[r.jsx("span",{style:{fontSize:"12px",color:C.color,fontWeight:"bold",textTransform:"uppercase"},children:O.dept}),r.jsx("span",{style:{fontSize:"10px",background:O.is_mandatory?"var(--blue-dim)":"var(--gray-dim)",color:O.is_mandatory?"var(--blue)":"var(--text3)",padding:"2px 6px",borderRadius:"4px"},children:O.is_mandatory?"MANDATORY":"OPTIONAL"})]}),r.jsx("div",{style:{color:"var(--text)",fontWeight:"500",marginBottom:"4px"},children:O.name}),r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",marginBottom:"12px"},children:O.sub||"No description"}),r.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[O.requires_upload&&r.jsxs("span",{style:{fontSize:"10px",background:"#f59e0b44",color:"#fbbf24",padding:"2px 6px",borderRadius:"4px"},children:["Requires: ",O.default_doc_type||"General"]}),O.special&&r.jsxs("span",{style:{fontSize:"10px",background:"#10b98144",color:"#34d399",padding:"2px 6px",borderRadius:"4px"},children:["Special: ",O.special]})]}),D&&r.jsxs("div",{style:{display:"flex",gap:"4px"},children:[r.jsx("button",{style:{background:"transparent",border:"1px solid var(--border2)",color:"var(--text2)",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>A(O),children:"Edit"}),r.jsx("button",{style:{background:"transparent",border:"1px solid #ef444444",color:"#ef4444",borderRadius:"4px",cursor:"pointer",padding:"2px 6px",fontSize:"10px"},onClick:()=>B(O.id),children:"Delete"})]})]})]},O.id))})]},C.id)})})]}),o&&r.jsx("div",{className:"modal-overlay open",onClick:C=>{C.target.className==="modal-overlay open"&&l(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"600px"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:"Register Company"}),r.jsx("button",{className:"modal-close",onClick:()=>l(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:z,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Company Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:s.name,onChange:C=>i({...s,name:C.target.value})})]}),r.jsx("div",{style:{marginTop:"24px",marginBottom:"16px",borderBottom:"1px solid var(--border)",paddingBottom:"8px",color:"var(--text)"},children:"Locations"}),s.locations.map((C,$)=>r.jsxs("div",{style:{background:"var(--bg3)",padding:"16px",borderRadius:"8px",marginBottom:"16px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"City *"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:C.city,onChange:O=>P($,"city",O.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Person in Charge"}),r.jsx("input",{type:"text",className:"form-input",value:C.person_in_charge,onChange:O=>P($,"person_in_charge",O.target.value)})]})]}),r.jsxs("div",{style:{marginBottom:"12px"},children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Full Address"}),r.jsx("input",{type:"text",className:"form-input",value:C.address,onChange:O=>P($,"address",O.target.value)})]}),r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"},children:[r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Contact Number"}),r.jsx("input",{type:"text",className:"form-input",value:C.contact_number,onChange:O=>P($,"contact_number",O.target.value)})]}),r.jsxs("div",{children:[r.jsx("label",{style:{display:"block",fontSize:"12px",color:"var(--text3)",marginBottom:"4px"},children:"Email"}),r.jsx("input",{type:"email",className:"form-input",value:C.email,onChange:O=>P($,"email",O.target.value)})]})]})]},$)),r.jsx("button",{type:"button",onClick:_,style:{background:"transparent",border:"1px dashed var(--border2)",color:"var(--text3)",width:"100%",padding:"12px",borderRadius:"8px",cursor:"pointer",marginBottom:"24px"},children:"+ Add Another Location"}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"var(--bg4)"},onClick:()=>l(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:"Save Company"})]})]})})]})}),h&&r.jsx("div",{className:"modal-overlay open",onClick:C=>{C.target.className==="modal-overlay open"&&g(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsx("div",{className:"modal-title",children:v?"Edit Task Master":"New Task Master"}),r.jsx("button",{className:"modal-close",onClick:()=>g(!1),children:"✕"})]}),r.jsx("div",{className:"modal-body",children:r.jsxs("form",{onSubmit:F,children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Department"}),r.jsx("select",{className:"form-select",value:N.dept,onChange:C=>S({...N,dept:C.target.value}),children:Bt.map(C=>r.jsx("option",{value:C.id,children:C.label},C.id))})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Task Name"}),r.jsx("input",{type:"text",className:"form-input",required:!0,value:N.name,onChange:C=>S({...N,name:C.target.value})})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Description / Subtitle"}),r.jsx("input",{type:"text",className:"form-input",value:N.sub,onChange:C=>S({...N,sub:C.target.value})})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"16px"},children:[r.jsx("input",{type:"checkbox",checked:N.is_mandatory,onChange:C=>S({...N,is_mandatory:C.target.checked})}),r.jsx("label",{style:{margin:0,color:"var(--text)"},children:"Mandatory Task (added to all new orders)"})]}),r.jsxs("div",{className:"modal-field",style:{display:"flex",alignItems:"center",gap:"12px",marginTop:"12px"},children:[r.jsx("input",{type:"checkbox",checked:N.requires_upload,onChange:C=>S({...N,requires_upload:C.target.checked})}),r.jsx("label",{style:{margin:0,color:"var(--text)"},children:"Requires Document Upload to complete"})]}),N.requires_upload&&r.jsxs("div",{className:"modal-field",style:{marginLeft:"24px",marginTop:"8px"},children:[r.jsx("label",{style:{color:"#fff",fontSize:"12px",display:"block",marginBottom:"4px"},children:"Default Document Type"}),r.jsxs("select",{className:"form-select",value:N.default_doc_type||"General",onChange:C=>S({...N,default_doc_type:C.target.value}),style:{fontSize:"13px",width:"100%",padding:"6px 12px"},children:[r.jsx("option",{value:"General",children:"General"}),r.jsx("option",{value:"PO",children:"PO"}),r.jsx("option",{value:"Quotation",children:"Quotation"}),r.jsx("option",{value:"BOM",children:"BOM"}),r.jsx("option",{value:"Drawing",children:"Drawing"}),r.jsx("option",{value:"QC Report",children:"QC Report"}),r.jsx("option",{value:"Dispatch Document",children:"Dispatch Document"}),r.jsx("option",{value:"Photo",children:"Photo"})]})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid #333"},children:[r.jsx("label",{style:{color:"#fff",fontWeight:"600",display:"block",marginBottom:"10px"},children:"Order Fields to Show"}),r.jsx("div",{style:{color:"var(--text3)",fontSize:"11px",marginBottom:"10px"},children:"These fields from the order will be shown as read-only reference inside the task modal."}),r.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:ah.map(C=>{const $=(N.order_fields||[]).includes(C.key);return r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"6px",background:$?"var(--blue-dim)":"var(--bg3)",border:`1px solid ${$?"rgba(59,130,246,0.4)":"var(--border)"}`,borderRadius:"6px",padding:"5px 10px",cursor:"pointer",fontSize:"12px",color:$?"var(--blue)":"var(--text3)"},children:[r.jsx("input",{type:"checkbox",checked:$,style:{display:"none"},onChange:()=>{const O=N.order_fields||[],de=$?O.filter(ue=>ue!==C.key):[...O,C.key];S(ue=>({...ue,order_fields:de}))}}),$?"✓ ":"",C.label]},C.key)})})]}),r.jsxs("div",{style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},children:[r.jsx("label",{style:{color:"var(--text)",fontWeight:"600"},children:"Form Fields"}),r.jsx("button",{type:"button",onClick:()=>c(!f),style:{background:"rgba(59,130,246,0.15)",color:"#60a5fa",border:"1px solid rgba(59,130,246,0.3)",padding:"4px 10px",borderRadius:"6px",fontSize:"11px",cursor:"pointer"},children:f?"Cancel":"+ Add Field"})]}),f&&r.jsxs("div",{style:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px",marginBottom:"12px"},children:[r.jsxs("div",{style:{marginBottom:"8px"},children:[r.jsx("label",{style:{fontSize:"11px",color:"var(--text3)",display:"block",marginBottom:"4px"},children:"Label *"}),r.jsx("input",{type:"text",className:"form-input",value:j.label,onChange:C=>T($=>({...$,label:C.target.value})),placeholder:"e.g. Test Voltage"})]}),r.jsxs("div",{style:{background:"var(--bg4)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:"8px",padding:"12px",marginBottom:"12px"},children:[r.jsx("div",{style:{fontSize:"11px",color:"#a78bfa",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"10px"},children:"⚡ Auto-Done Trigger (optional)"}),r.jsx("div",{style:{fontSize:"11px",color:"var(--text3)",marginBottom:"10px"},children:"If the selected DB field matches this condition, the task is automatically marked Done."}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"},children:[r.jsx("span",{style:{fontSize:"12px",fontWeight:"700",color:"#a78bfa",minWidth:"18px"},children:"IF"}),r.jsxs("div",{style:{flex:"1 1 160px"},children:[r.jsxs("select",{className:"form-select",value:j.datakeyPreset||"",onChange:C=>T($=>({...$,datakeyPreset:C.target.value,customDatakey:"",operator:"",conditionValue:""})),children:[r.jsx("option",{value:"",children:"— pick a field —"}),Ip.map(C=>r.jsx("option",{value:C.key,children:C.label},C.key))]}),j.datakeyPreset==="__custom__"&&r.jsx("input",{type:"text",className:"form-input",style:{marginTop:"6px",fontFamily:"monospace",fontSize:"12px"},value:j.customDatakey||"",onChange:C=>T($=>({...$,customDatakey:C.target.value})),placeholder:"table.column_name"})]}),r.jsx("div",{style:{flex:"1 1 160px"},children:r.jsx("select",{className:"form-select",value:j.operator||"",onChange:C=>T($=>({...$,operator:C.target.value,conditionValue:""})),disabled:!j.datakeyPreset||j.datakeyPreset==="",children:Kd.map(C=>r.jsx("option",{value:C.value,children:C.label},C.value))})}),((V=Kd.find(C=>C.value===j.operator))==null?void 0:V.needsValue)&&r.jsx("div",{style:{flex:"1 1 120px"},children:r.jsx("input",{type:"text",className:"form-input",value:j.conditionValue||"",onChange:C=>T($=>({...$,conditionValue:C.target.value})),placeholder:"value…"})})]}),j.datakeyPreset&&j.datakeyPreset!==""&&r.jsx("div",{style:{marginTop:"8px",fontSize:"11px",color:"#9ca3af",fontFamily:"monospace",background:"var(--bg3)",padding:"6px 10px",borderRadius:"4px"},children:Cl(j.operator,j.conditionValue)?`⚡ ${Cl(j.operator,j.conditionValue)}`:"⚡ auto-done when field has any value"})]}),r.jsx("button",{type:"button",onClick:Q,style:{background:"#10b981",color:"#fff",border:"none",padding:"6px 14px",borderRadius:"6px",cursor:"pointer",fontSize:"12px",fontWeight:"600"},children:"Add Field"})]}),E.length===0?r.jsx("div",{style:{color:"var(--text3)",fontSize:"12px",fontStyle:"italic",padding:"8px 0"},children:"No form fields defined. Users will only see Notes when filling this task."}):r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:E.map(C=>{var $;return r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--bg3)",padding:"8px 12px",borderRadius:"6px",border:"1px solid var(--border)"},children:[r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[r.jsxs("div",{children:[r.jsx("span",{style:{color:"var(--text)",fontSize:"13px",fontWeight:"600"},children:C.label}),(($=C.options)==null?void 0:$.length)>0&&r.jsxs("span",{style:{marginLeft:"6px",fontSize:"10px",color:"var(--text3)"},children:["(",C.options.join(", "),")"]})]}),(C.datakey||C.condition)&&r.jsx("div",{style:{fontSize:"11px",color:"#a78bfa",marginTop:"3px",display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"},children:r.jsxs("span",{style:{background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"4px",padding:"1px 6px"},children:["⚡ IF ",nh(C.condition,C.datakey)]})})]}),r.jsx("button",{type:"button",onClick:()=>M(C.id),style:{background:"transparent",border:"none",color:"#666",cursor:"pointer",fontSize:"14px"},children:"✕"})]},C.id)})})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px",marginTop:"24px"},children:[r.jsx("button",{type:"button",className:"vbtn",style:{background:"#333"},onClick:()=>g(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"vbtn",children:v?"Update Task":"Save Task"})]})]})})]})})]})}function lh(){const[e,t]=p.useState([]),[n,a]=p.useState("1000"),[o,l]=p.useState(""),[s,i]=p.useState("All"),[d,u]=p.useState(!1),h=localStorage.getItem("token");p.useEffect(()=>{g(n)},[n]);const g=async(S=n)=>{u(!0);try{const E=await fetch(`${window.API_BASE}/api/logs?limit=${S}`,{headers:{Authorization:`Bearer ${h}`}});if(E.ok){const m=await E.json();t(m)}}catch(E){console.error(E)}finally{u(!1)}},v=S=>{const E=new Date(S);return E.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+" "+E.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},w=S=>{switch(S==null?void 0:S.toLowerCase()){case"sales":return{background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",border:"1px solid rgba(59, 130, 246, 0.2)"};case"design":return{background:"rgba(167, 139, 250, 0.1)",color:"#a78bfa",border:"1px solid rgba(167, 139, 250, 0.2)"};case"purchase":return{background:"rgba(249, 115, 22, 0.1)",color:"#f97316",border:"1px solid rgba(249, 115, 22, 0.2)"};case"stores":return{background:"rgba(45, 212, 191, 0.1)",color:"#2dd4bf",border:"1px solid rgba(45, 212, 191, 0.2)"};case"production":return{background:"rgba(239, 68, 68, 0.1)",color:"#ef4444",border:"1px solid rgba(239, 68, 68, 0.2)"};case"qc":return{background:"rgba(34, 197, 94, 0.1)",color:"#22c55e",border:"1px solid rgba(34, 197, 94, 0.2)"};case"dispatch":return{background:"rgba(245, 158, 11, 0.1)",color:"#f59e0b",border:"1px solid rgba(245, 158, 11, 0.2)"};case"accounts":return{background:"rgba(14, 165, 233, 0.1)",color:"#0ea5e9",border:"1px solid rgba(14, 165, 233, 0.2)"};default:return{background:"rgba(255, 255, 255, 0.05)",color:"#888",border:"1px solid rgba(255, 255, 255, 0.1)"}}},N=e.filter(S=>{if(s!=="All"&&S.dept!==s)return!1;if(o.trim()!==""){const E=o.trim().toLowerCase().split(/\s+/),m=(S.username||"").toLowerCase(),f=(S.action_text||"").toLowerCase(),c=(S.order_number||"").toLowerCase();return E.every(j=>m.includes(j)||f.includes(j)||c.includes(j))}return!0});return r.jsxs("div",{style:{padding:"24px"},children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"var(--text)",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Do,{size:22,style:{color:"#f59e0b"}}),"System Activity Logs"]})}),r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"16px",flex:1,minWidth:"300px"},children:[r.jsxs("div",{style:{position:"relative",flex:1,minWidth:"220px"},children:[r.jsx(Pr,{size:16,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("input",{type:"text",placeholder:"Search logs by user, action or order #...",value:o,onChange:S=>l(S.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 38px",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},className:"log-search-input"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(ki,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:s,onChange:S=>i(S.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"All",children:"All Departments"}),r.jsx("option",{value:"Sales",children:"Sales"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"}),r.jsx("option",{value:"Accounts",children:"Accounts"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]}),r.jsxs("div",{style:{position:"relative",width:"160px"},children:[r.jsx(zp,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:n,onChange:S=>a(S.target.value),style:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"100",children:"Fetch 100 Logs"}),r.jsx("option",{value:"250",children:"Fetch 250 Logs"}),r.jsx("option",{value:"500",children:"Fetch 500 Logs"}),r.jsx("option",{value:"1000",children:"Fetch 1000 Logs"}),r.jsx("option",{value:"5000",children:"Fetch 5000 Logs"}),r.jsx("option",{value:"all",children:"Fetch All Logs"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[(o||s!=="All")&&r.jsx("button",{onClick:()=>{l(""),i("All")},style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"#ef4444",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",transition:"all 0.2s"},className:"clear-btn",children:"Clear Filters"}),r.jsxs("button",{onClick:()=>g(n),disabled:d,style:{background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",transition:"all 0.2s"},className:"refresh-btn",children:[r.jsx(qt,{size:14,className:d?"spin":"",style:{transition:"transform 0.5s"}}),d?"Loading...":"Refresh"]})]})]}),r.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:"12px",fontSize:"12px",color:"var(--text3)"},children:[r.jsxs("div",{children:["Showing ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:"600"},children:N.length})," ","of ",r.jsx("span",{style:{color:"var(--text)",fontWeight:"600"},children:e.length})," fetched logs"," ",n==="all"?"(full system history)":`(limit: ${n})`]}),N.length<e.length&&r.jsxs("div",{style:{fontStyle:"italic"},children:["Filtered out ",e.length-N.length," logs"]})]}),r.jsx("div",{style:{background:"var(--bg2)",borderRadius:"12px",border:"1px solid var(--border)",overflow:"hidden"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"13px"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"var(--bg3)",borderBottom:"1px solid var(--border)"},children:[r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Timestamp"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"User"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Order #"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Department"}),r.jsx("th",{style:{padding:"16px",color:"var(--text3)",fontWeight:"500"},children:"Action"})]})}),r.jsx("tbody",{children:d&&e.length===0?r.jsx("tr",{children:r.jsxs("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"var(--text3)"},children:[r.jsx(qt,{size:24,className:"spin",style:{margin:"0 auto 12px",color:"#f59e0b",display:"block"}}),"Loading activity logs..."]})}):N.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:"5",style:{padding:"48px",textAlign:"center",color:"var(--text3)"},children:"No matching activity logs found."})}):N.map(S=>r.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},className:"log-row",children:[r.jsx("td",{style:{padding:"16px",color:"var(--text3)",whiteSpace:"nowrap"},children:v(S.timestamp)}),r.jsx("td",{style:{padding:"16px",color:"var(--text)",fontWeight:"600"},children:S.username}),r.jsx("td",{style:{padding:"16px"},children:S.order_number?r.jsx("span",{style:{fontFamily:"monospace",fontSize:"11px",background:"var(--orange-dim)",color:"var(--accent)",padding:"2px 6px",borderRadius:"4px",border:"1px solid rgba(245,158,11,0.2)"},children:S.order_number}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"})}),r.jsx("td",{style:{padding:"16px"},children:S.dept?r.jsx("span",{style:{display:"inline-block",fontSize:"11px",fontWeight:"500",padding:"2px 8px",borderRadius:"12px",...w(S.dept)},children:S.dept}):r.jsx("span",{style:{color:"var(--text3)"},children:"—"})}),r.jsx("td",{style:{padding:"16px",color:"var(--text)"},children:S.action_text})]},S.id))})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const sh=[10,20,50,100],Fa=["sr_no","order_number","po_number","reference_number","part_number","client_name","end_client_name","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","priority","status","qc_status","qc_date","progress","action"];function ih(){const e=localStorage.getItem("token"),t=JSON.parse(localStorage.getItem("user")||"{}"),n=["Admin","Manager","Planning"].includes(t.role),[a,o]=p.useState([]),[l,s]=p.useState(()=>{const b=localStorage.getItem("planning_column_order");if(b)try{const R=JSON.parse(b);if(Array.isArray(R)&&R.length>0){const J=R.filter(te=>Fa.includes(te)),K=Fa.filter(te=>!J.includes(te));return[...J,...K]}}catch(R){console.error("Error parsing column order from localStorage:",R)}return Fa}),[i,d]=p.useState(null),[u,h]=p.useState(null),g=(b,R)=>{d(R),b.dataTransfer.effectAllowed="move",b.dataTransfer.setData("text/plain",R)},v=(b,R)=>{b.preventDefault(),i!==R&&u!==R&&h(R)},w=(b,R)=>{u===R&&h(null)},N=(b,R)=>{if(b.preventDefault(),!i||i===R){d(null),h(null);return}const J=l.indexOf(i),K=l.indexOf(R);if(J!==-1&&K!==-1){const te=[...l];te.splice(J,1),te.splice(K,0,i),s(te),localStorage.setItem("planning_column_order",JSON.stringify(te))}d(null),h(null)},S=()=>{d(null),h(null)},E=b=>{switch(b){case"sr_no":return"Sr. No.";case"order_number":return"Order Number";case"po_number":return"PO Number";case"reference_number":return"Cust. Ref #";case"part_number":return"Part Number";case"client_name":return"Client Name";case"end_client_name":return"End Client Name";case"planned_dispatch":return"Planned Dispatch";case"mounting_start":return"Mounting Start";case"mounting_complete":return"Mounting Complete";case"delivery_date":return"Order Delivery Date";case"wiring_assigned":return"Wiring Assigned";case"wiring_expected":return"Wiring Expected";case"expected_qc":return"Expected QC";case"priority":return"Priority";case"status":return"Status";case"qc_status":return"QC Status";case"qc_date":return"QC Passed Date";case"progress":return"Progress";case"action":return"Action";default:return b}},m=l.filter(b=>!(b==="action"&&!n)),f=(b,R,J,K)=>{var Pe;const te=se&&se.lineItemId===R.line_item_id&&se.colId===b;if(ee&&ee.lineItemId===R.line_item_id&&ee.colId===b)return r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{className:"inline-saving-spinner"}),r.jsx("span",{className:"dim text-xs",children:"Saving..."})]});if(te){const fe=xe=>{xe.key==="Enter"?xe.target.blur():xe.key==="Escape"&&L(null)},Ue=xe=>{Si(R.line_item_id,b,xe,se.oldValue)},Re=()=>{se&&se.lineItemId===R.line_item_id&&se.colId===b&&Si(R.line_item_id,b,se.value,se.oldValue)};if(["priority","status","qc_status"].includes(b)){let xe=[];return b==="priority"?xe=["Low","Medium","High","Urgent"]:b==="status"?xe=["Not Started","In Progress","Waiting for Material","QC Testing","Completed"]:b==="qc_status"&&(xe=["Pending","Pass","Fail"]),r.jsx("select",{className:"inline-edit-select",value:se.value,onChange:it=>Ue(it.target.value),onBlur:Re,autoFocus:!0,children:xe.map(it=>r.jsx("option",{value:it,children:it},it))})}if(["planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(b))return r.jsx("input",{type:"date",className:"inline-edit-input",value:se.value,onChange:xe=>L({...se,value:xe.target.value}),onBlur:Re,onKeyDown:fe,autoFocus:!0});if(b==="end_client_name")return r.jsx("input",{type:"text",className:"inline-edit-input",value:se.value,onChange:xe=>L({...se,value:xe.target.value}),onBlur:Re,onKeyDown:fe,autoFocus:!0})}switch(b){case"sr_no":return J;case"order_number":return r.jsxs(r.Fragment,{children:[R.line_item_number,R.total_qty>1&&r.jsxs("span",{style:{opacity:.5,marginLeft:"8px"},children:["(",R.unit_index,"/",R.total_qty,")"]})]});case"po_number":return R.po_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"reference_number":return R.reference_number?r.jsx("span",{style:{color:"#f59e0b",fontWeight:600},children:R.reference_number}):r.jsx("span",{className:"dim text-xs",children:"—"});case"part_number":return R.part_number||r.jsx("span",{className:"dim text-xs",children:"—"});case"client_name":return R.company_name;case"end_client_name":return R.end_client_name||r.jsx("span",{className:"dim text-xs",children:"Unspecified"});case"planned_dispatch":return Le(R.planned_dispatch_date);case"mounting_start":return Le(R.mounting_start_date);case"mounting_complete":return Le(R.mounting_complete_date);case"wiring_assigned":return Le(R.wiring_assigned_date);case"wiring_expected":return Le(R.wiring_expected_date);case"expected_qc":return Le(R.expected_qc_date);case"priority":return r.jsx("span",{className:`priority-badge ${((Pe=R.priority)==null?void 0:Pe.toLowerCase())||"medium"}`,children:R.priority});case"status":return r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[r.jsx("span",{className:`status-badge ${(R.status||"Not Started").toLowerCase().replace(/\s+/g,"-")}`,children:R.status||"Not Started"}),R.active_dept&&r.jsxs("span",{className:`dept-badge dept-${(R.active_dept||"").toLowerCase()}`,children:["⚙ ",R.active_dept]})]});case"qc_status":return r.jsx("span",{className:`qc-badge ${(R.qc_status||"Pending").toLowerCase()}`,children:R.qc_status||"Pending"});case"qc_date":return Le(R.qc_date);case"progress":return r.jsxs("div",{className:"progress-cell",children:[r.jsxs("div",{className:"progress-text",children:[K,"%"]}),r.jsx("div",{className:"progress-track",children:r.jsx("div",{className:"progress-fill",style:{width:`${K}%`,backgroundColor:ge(K)}})})]});case"action":return n?r.jsx("button",{className:"icon-btn",onClick:()=>wt(R),title:"Edit planning data",children:r.jsx(Cg,{size:13})}):null;default:return null}},[c,j]=p.useState(!0),[T,I]=p.useState(""),[x,D]=p.useState("all"),[U,k]=p.useState("all"),[P,_]=p.useState(null),[z,F]=p.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[A,Q]=p.useState(""),[M,B]=p.useState(""),[V,C]=p.useState([]),[$,O]=p.useState(!1),[de,ue]=p.useState({end_client_name:!1,planned_dispatch_date:!1,mounting_start_date:!1,mounting_complete_date:!1,wiring_assigned_date:!1,wiring_expected_date:!1,expected_qc_date:!1,priority:!1,status:!1,qc_status:!1,qc_date:!1}),[ae,me]=p.useState({end_client_name:"",planned_dispatch_date:"",mounting_start_date:"",mounting_complete_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),[se,L]=p.useState(null),[ee,Y]=p.useState(null),[be,oe]=p.useState(1),[W,Ee]=p.useState(20),[je,he]=p.useState("none"),[H,Z]=p.useState("none"),[ce,ot]=p.useState({}),lt=b=>{ot(R=>({...R,[b]:R[b]===!1}))};p.useEffect(()=>{jt()},[]);const jt=async()=>{try{const b=await fetch(window.API_BASE+"/api/planning",{headers:{Authorization:`Bearer ${e}`}});b.ok&&o(await b.json())}catch(b){console.error("Error fetching planning data:",b)}finally{j(!1)}},wt=b=>{n&&(_(b),F({end_client_name:b.end_client_name||"",planned_dispatch_date:b.planned_dispatch_date?b.planned_dispatch_date.split("T")[0]:"",mounting_start_date:b.mounting_start_date?b.mounting_start_date.split("T")[0]:"",mounting_complete_date:b.mounting_complete_date?b.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:b.wiring_assigned_date?b.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:b.wiring_expected_date?b.wiring_expected_date.split("T")[0]:"",expected_qc_date:b.expected_qc_date?b.expected_qc_date.split("T")[0]:"",priority:b.priority||"Medium",status:b.status||"Not Started",qc_status:b.qc_status||"Pending",qc_date:b.qc_date?b.qc_date.split("T")[0]:""}),Q(""),B(""))},kt=b=>{const{name:R,value:J}=b.target;F(K=>({...K,[R]:J}))},ga=async b=>{b.preventDefault();try{const R=await fetch(`${window.API_BASE}/api/planning/line-items/${P.line_item_id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(z)});if(R.ok)B("Planning details updated successfully."),setTimeout(()=>{_(null),jt(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const J=await R.json();Q(J.error||"Failed to update planning details.")}}catch(R){console.error(R),Q("Network error, please try again.")}},Le=b=>b?new Date(b).toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"}):"—",Lr=[];a.forEach(b=>{const R=parseInt(b.quantity)||1;for(let J=0;J<R;J++)Lr.push({...b,unit_index:J+1,total_qty:R,row_key:`${b.line_item_id}-${J}`})});const gn=Lr.filter(b=>{let R=!0;if(T.trim()!==""){const te=T.trim().toLowerCase().split(/\s+/),le=(b.order_number||"").toLowerCase(),Pe=(b.line_item_number||"").toLowerCase(),fe=`${b.order_number||""} / ${b.line_item_number||""}`.toLowerCase(),Ue=`${b.order_number||""}/${b.line_item_number||""}`.toLowerCase(),Re=`${b.order_number||""}${b.line_item_number||""}`.toLowerCase(),xe=(b.po_number||"").toLowerCase(),it=(b.part_number||"").toLowerCase(),Rr=(b.company_name||"").toLowerCase(),vn=(b.end_client_name||"").toLowerCase();R=te.every(_t=>le.includes(_t)||Pe.includes(_t)||fe.includes(_t)||Ue.includes(_t)||Re.includes(_t)||xe.includes(_t)||it.includes(_t)||Rr.includes(_t)||vn.includes(_t))}const J=x==="all"||b.status===x,K=U==="all"||b.priority===U;return R&&J&&K}),ha=b=>{I(b),oe(1)},va=b=>{D(b),oe(1)},ya=b=>{k(b),oe(1)},ba=b=>{Ee(Number(b)),oe(1)},y=gn.length,G=Math.max(1,Math.ceil(y/W)),re=Math.min(be,G),ye=(re-1)*W,St=Math.min(ye+W,y),Mt=gn.slice(ye,St),ge=b=>b<30?"#ef4444":b<70?"#f59e0b":"#10b981",Ko=p.useCallback(()=>{const b=[],J=Math.max(1,re-3),K=Math.min(G,re+3);for(let te=J;te<=K;te++)b.push(te);return b},[re,G]),hn=b=>{C(R=>R.includes(b)?R.filter(J=>J!==b):[...R,b])},ja=()=>{const b=Mt.map(J=>J.line_item_id),R=b.every(J=>V.includes(J));C(R?J=>J.filter(K=>!b.includes(K)):J=>{const K=[...J];return b.forEach(te=>{K.includes(te)||K.push(te)}),K})},st=async b=>{b.preventDefault();const R={};let J=!1;if(Object.keys(ae).forEach(K=>{ae[K]!==""&&(R[K]=ae[K],J=!0)}),!J){Q("Please modify at least one field to update.");return}j(!0);try{const K=await fetch(window.API_BASE+"/api/planning/line-items/bulk",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({lineItemIds:V,fields:R})});if(K.ok)B(`Successfully updated ${V.length} items.`),C([]),setTimeout(()=>{O(!1),Q(""),B(""),me({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),jt(),window.dispatchEvent(new CustomEvent("orderUpdated"))},1200);else{const te=await K.json();Q(te.error||"Failed to update selected items."),j(!1)}}catch(K){console.error(K),Q("Network error, please try again."),j(!1)}},wa=(b,R,J)=>{if(!n||["INPUT","SELECT","OPTION","BUTTON","A","svg","path"].includes(b.target.tagName))return;let K="";R==="end_client_name"?K=J.end_client_name||"":R==="planned_dispatch"?K=J.planned_dispatch_date?J.planned_dispatch_date.split("T")[0]:"":R==="mounting_start"?K=J.mounting_start_date?J.mounting_start_date.split("T")[0]:"":R==="mounting_complete"?K=J.mounting_complete_date?J.mounting_complete_date.split("T")[0]:"":R==="wiring_assigned"?K=J.wiring_assigned_date?J.wiring_assigned_date.split("T")[0]:"":R==="wiring_expected"?K=J.wiring_expected_date?J.wiring_expected_date.split("T")[0]:"":R==="expected_qc"?K=J.expected_qc_date?J.expected_qc_date.split("T")[0]:"":R==="priority"?K=J.priority||"Medium":R==="status"?K=J.status||"Not Started":R==="qc_status"?K=J.qc_status||"Pending":R==="qc_date"&&(K=J.qc_date?J.qc_date.split("T")[0]:""),L({lineItemId:J.line_item_id,colId:R,value:K,oldValue:K})},Si=async(b,R,J,K)=>{if(J===K){L(null);return}Y({lineItemId:b,colId:R}),L(null);try{let te=R;R==="planned_dispatch"?te="planned_dispatch_date":R==="mounting_start"?te="mounting_start_date":R==="mounting_complete"?te="mounting_complete_date":R==="wiring_assigned"?te="wiring_assigned_date":R==="wiring_expected"?te="wiring_expected_date":R==="expected_qc"&&(te="expected_qc_date");const le=a.find(Ue=>Ue.line_item_id===b);if(!le)throw new Error("Order not found");const Pe={end_client_name:le.end_client_name||"",planned_dispatch_date:le.planned_dispatch_date?le.planned_dispatch_date.split("T")[0]:"",mounting_start_date:le.mounting_start_date?le.mounting_start_date.split("T")[0]:"",mounting_complete_date:le.mounting_complete_date?le.mounting_complete_date.split("T")[0]:"",wiring_assigned_date:le.wiring_assigned_date?le.wiring_assigned_date.split("T")[0]:"",wiring_expected_date:le.wiring_expected_date?le.wiring_expected_date.split("T")[0]:"",expected_qc_date:le.expected_qc_date?le.expected_qc_date.split("T")[0]:"",priority:le.priority||"Medium",status:le.status||"Not Started",qc_status:le.qc_status||"Pending",qc_date:le.qc_date?le.qc_date.split("T")[0]:""};Pe[te]=J;const fe=await fetch(`${window.API_BASE}/api/planning/line-items/${b}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(Pe)});if(fe.ok)await jt(),window.dispatchEvent(new CustomEvent("orderUpdated"));else{const Ue=await fe.json();alert(Ue.error||"Failed to update planning details.")}}catch(te){console.error(te),alert("Network error, please try again.")}finally{Y(null)}},_i=(b,R)=>{if(!R||R==="none")return"";switch(R){case"planned_dispatch":return Le(b.planned_dispatch_date);case"mounting_start":return Le(b.mounting_start_date);case"mounting_complete":return Le(b.mounting_complete_date);case"delivery_date":return Le(b.delivery_date);case"wiring_assigned":return Le(b.wiring_assigned_date);case"wiring_expected":return Le(b.wiring_expected_date);case"expected_qc":return Le(b.expected_qc_date);case"qc_date":return Le(b.qc_date);case"client_name":return b.company_name||"Unspecified";case"end_client_name":return b.end_client_name||"Unspecified";case"priority":return b.priority||"Medium";case"status":return b.status||"Not Started";case"qc_status":return b.qc_status||"Pending";case"active_dept":return b.active_dept||"Planning";default:return b[R]||"Unspecified"}},Ap=b=>{if(!je||je==="none")return{type:"flat",rows:b};const R={};b.forEach(K=>{const te=_i(K,je);R[te]||(R[te]=[]),R[te].push(K)});const J={type:"grouped",keys:Object.keys(R).sort(),groups:{}};return Object.keys(R).forEach(K=>{const te=R[K];if(H&&H!=="none"){const le={};te.forEach(Pe=>{const fe=_i(Pe,H);le[fe]||(le[fe]=[]),le[fe].push(Pe)}),J.groups[K]={type:"subgrouped",keys:Object.keys(le).sort(),groups:le}}else J.groups[K]={type:"flat",rows:te}}),J},Xo=(b,R,J)=>{const K=V.includes(b.line_item_id);return r.jsxs("tr",{className:`planning-row ${K?"selected-row":""}`,children:[n&&r.jsx("td",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},children:r.jsx("input",{type:"checkbox",checked:K,onChange:()=>hn(b.line_item_id)})}),m.map((te,le)=>{const Pe=le===0;let fe="";["sr_no","order_number","po_number","reference_number","part_number","planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","qc_date"].includes(te)&&(fe+=" mono"),te==="order_number"&&(fe+=" font-semibold text-accent");let Re={};te==="part_number"&&(Re={maxWidth:"120px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}),Pe&&(fe+=" col-sticky-first",Re={...Re,left:n?"40px":0});const xe=["planned_dispatch","mounting_start","mounting_complete","wiring_assigned","wiring_expected","expected_qc","status","qc_date"].includes(te),it=se&&se.lineItemId===b.line_item_id&&se.colId===te,Rr=ee&&ee.lineItemId===b.line_item_id&&ee.colId===te;return n&&xe&&(fe+=" editable-cell"),it&&(fe+=" is-editing"),Rr&&(fe+=" is-saving"),r.jsx("td",{className:fe.trim(),style:Re,title:te==="part_number"?b.part_number:void 0,onClick:vn=>xe&&wa(vn,te,b),children:f(te,b,R,J)},te)})]},b.row_key)};return c?r.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"400px",color:"#888"},children:"Loading Planning Records..."}):r.jsxs("div",{className:"planning-module",children:[r.jsxs("div",{className:"planning-controls",children:[r.jsxs("div",{className:"search-box",children:[r.jsx(Pr,{size:16,className:"search-icon"}),r.jsx("input",{type:"text",placeholder:"Search by PO, Client, End Client, or Order Number...",value:T,onChange:b=>ha(b.target.value)})]}),r.jsxs("div",{className:"filter-group",children:[r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Status"}),r.jsxs("select",{value:x,onChange:b=>va(b.target.value),children:[r.jsx("option",{value:"all",children:"All Statuses"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Priority"}),r.jsxs("select",{value:U,onChange:b=>ya(b.target.value),children:[r.jsx("option",{value:"all",children:"All Priorities"}),r.jsx("option",{value:"Low",children:"Low"}),r.jsx("option",{value:"Medium",children:"Medium"}),r.jsx("option",{value:"High",children:"High"}),r.jsx("option",{value:"Urgent",children:"Urgent"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Group By"}),r.jsxs("select",{value:je,onChange:b=>{he(b.target.value),b.target.value==="none"&&Z("none")},children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsxs("div",{className:"filter-select-wrapper",children:[r.jsx("label",{children:"Then Group By"}),r.jsxs("select",{value:H,onChange:b=>Z(b.target.value),disabled:je==="none",children:[r.jsx("option",{value:"none",children:"None"}),r.jsx("option",{value:"client_name",children:"Client Name"}),r.jsx("option",{value:"end_client_name",children:"End Client Name"}),r.jsx("option",{value:"priority",children:"Priority"}),r.jsx("option",{value:"status",children:"Status"}),r.jsx("option",{value:"qc_status",children:"QC Status"}),r.jsx("option",{value:"planned_dispatch",children:"Planned Dispatch Date"}),r.jsx("option",{value:"mounting_start",children:"Mounting Start Date"}),r.jsx("option",{value:"mounting_complete",children:"Mounting Complete Date"}),r.jsx("option",{value:"wiring_assigned",children:"Wiring Assigned Date"}),r.jsx("option",{value:"wiring_expected",children:"Wiring Expected Date"}),r.jsx("option",{value:"expected_qc",children:"Expected QC Date"}),r.jsx("option",{value:"qc_date",children:"QC Passed Date"}),r.jsx("option",{value:"delivery_date",children:"Order Delivery Date"}),r.jsx("option",{value:"active_dept",children:"Active Dept"})]})]}),r.jsx("button",{className:"reset-columns-btn",onClick:()=>{s(Fa),localStorage.removeItem("planning_column_order")},title:"Reset columns to default order",children:"Reset Columns"})]})]}),r.jsx("div",{className:"table-responsive",children:r.jsxs("table",{className:"planning-table",children:[r.jsx("thead",{children:r.jsxs("tr",{children:[n&&r.jsx("th",{className:"col-sticky-checkbox",style:{width:"40px",minWidth:"40px",textAlign:"center",left:0},children:r.jsx("input",{type:"checkbox",checked:Mt.length>0&&Mt.every(b=>V.includes(b.line_item_id)),onChange:ja})}),m.map((b,R)=>{const J=R===0,K=E(b),te=u===b,le=l.indexOf(i),Pe=l.indexOf(b);let fe="";te&&le!==-1&&le!==Pe&&(fe=le<Pe?" drag-over-right":" drag-over-left");let Ue={},Re=`${i===b?" dragging":""}${fe}`;return J&&(Re+=" col-sticky-first",Ue={left:n?"40px":0}),r.jsx("th",{className:Re.trim(),style:Ue,draggable:!0,onDragStart:xe=>g(xe,b),onDragOver:xe=>v(xe,b),onDragLeave:xe=>w(xe,b),onDrop:xe=>N(xe,b),onDragEnd:S,children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(gg,{size:12,className:"drag-handle"}),r.jsx("span",{children:K})]})},b)})]})}),r.jsx("tbody",{children:Mt.length===0?r.jsx("tr",{children:r.jsx("td",{colSpan:m.length+(n?1:0),style:{textAlign:"center",padding:"32px",color:"#666",fontStyle:"italic"},children:"No planning records match your search criteria."})}):(()=>{const b=Ap(Mt);if(b.type==="flat")return b.rows.map((J,K)=>{const te=parseInt(J.total_steps||0),le=parseInt(J.done_steps||0),Pe=te>0?Math.round(le/te*100):0;return Xo(J,ye+K+1,Pe)});let R=ye;return b.keys.map(J=>{const K=b.groups[J],te=`p:${J}`,le=ce[te]!==!1;let Pe=0;return K.type==="flat"?Pe=K.rows.length:K.keys.forEach(fe=>{Pe+=K.groups[fe].length}),r.jsxs(ro.Fragment,{children:[r.jsx("tr",{className:"group-header-row primary",onClick:()=>lt(te),children:r.jsx("td",{colSpan:m.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content",children:[r.jsx("span",{className:"expand-icon",children:le?r.jsx(zo,{size:14}):r.jsx(to,{size:14})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[E(je),":"]})," ",J]}),r.jsxs("span",{className:"group-badge",children:[Pe," items"]})]})})}),le&&(K.type==="flat"?K.rows.map(fe=>{R++;const Ue=parseInt(fe.total_steps||0),Re=parseInt(fe.done_steps||0),xe=Ue>0?Math.round(Re/Ue*100):0;return Xo(fe,R,xe)}):K.keys.map(fe=>{const Ue=K.groups[fe],Re=`p:${J}|s:${fe}`,xe=ce[Re]!==!1;return r.jsxs(ro.Fragment,{children:[r.jsx("tr",{className:"group-header-row secondary",onClick:()=>lt(Re),children:r.jsx("td",{colSpan:m.length+(n?1:0),children:r.jsxs("div",{className:"group-header-content secondary-content",style:{paddingLeft:"24px"},children:[r.jsx("span",{className:"expand-icon",children:xe?r.jsx(zo,{size:12}):r.jsx(to,{size:12})}),r.jsxs("span",{className:"group-title",children:[r.jsxs("strong",{children:[E(H),":"]})," ",fe]}),r.jsxs("span",{className:"group-badge secondary-badge",children:[Ue.length," items"]})]})})}),xe&&Ue.map(it=>{R++;const Rr=parseInt(it.total_steps||0),vn=parseInt(it.done_steps||0),_t=Rr>0?Math.round(vn/Rr*100):0;return Xo(it,R,_t)})]},Re)}))]},te)})})()})]})}),r.jsxs("div",{className:"pagination-bar",children:[r.jsxs("div",{className:"pagination-info",children:[r.jsx("span",{className:"row-count",children:y===0?"No records":`Showing ${ye+1}–${St} of ${y} records`}),r.jsxs("div",{className:"page-size-control",children:[r.jsx("span",{children:"Rows per page"}),r.jsx("select",{value:W,onChange:b=>ba(b.target.value),children:sh.map(b=>r.jsx("option",{value:b,children:b},b))})]})]}),r.jsxs("div",{className:"pagination-nav",children:[r.jsx("button",{className:"pg-btn",onClick:()=>oe(1),disabled:re===1,title:"First page",children:r.jsx(cg,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>oe(b=>Math.max(1,b-1)),disabled:re===1,title:"Previous page",children:r.jsx(Np,{size:14})}),Ko().map(b=>r.jsx("button",{className:`pg-btn pg-num ${b===re?"active":""}`,onClick:()=>oe(b),children:b},b)),r.jsx("button",{className:"pg-btn",onClick:()=>oe(b=>Math.min(G,b+1)),disabled:re===G,title:"Next page",children:r.jsx(to,{size:14})}),r.jsx("button",{className:"pg-btn",onClick:()=>oe(G),disabled:re===G,title:"Last page",children:r.jsx(ug,{size:14})})]})]}),P&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&_(null)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"520px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Order: ",P.order_number," — Line: ",P.line_item_number," (PO: ",P.po_number||"N/A",")"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>_(null),children:r.jsx(un,{size:18})})]}),r.jsxs("form",{onSubmit:ga,className:"modal-body",children:[A&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(Eo,{size:16}),r.jsx("span",{children:A})]}),M&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(ks,{size:16}),r.jsx("span",{children:M})]}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",name:"planned_dispatch_date",value:z.planned_dispatch_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",name:"mounting_start_date",value:z.mounting_start_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",name:"mounting_complete_date",value:z.mounting_complete_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",name:"wiring_assigned_date",value:z.wiring_assigned_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",name:"wiring_expected_date",value:z.wiring_expected_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",name:"expected_qc_date",value:z.expected_qc_date,onChange:kt,className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Overall Planning Status"}),r.jsxs("select",{name:"status",value:z.status,onChange:kt,className:"form-select",children:[r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",name:"qc_date",value:z.qc_date,onChange:kt,className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>_(null),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Save Planning Changes"})]})]})]})}),V.length>0&&r.jsx("div",{className:"bulk-actions-banner",children:r.jsxs("div",{className:"bulk-actions-content",children:[r.jsxs("span",{className:"bulk-count",children:[r.jsx("strong",{children:V.length})," items selected"]}),r.jsxs("div",{className:"bulk-buttons",children:[r.jsx("button",{className:"btn-bulk-edit",onClick:()=>{me({end_client_name:"",planned_dispatch_date:"",wiring_assigned_date:"",wiring_expected_date:"",expected_qc_date:"",priority:"",status:"",qc_status:"",qc_date:""}),O(!0)},children:"Bulk Edit Parameters"}),r.jsx("button",{className:"btn-bulk-clear",onClick:()=>C([]),children:"Deselect All"})]})]})}),$&&r.jsx("div",{className:"modal-overlay open",onClick:b=>{b.target.className==="modal-overlay open"&&O(!1)},children:r.jsxs("div",{className:"modal",style:{maxWidth:"560px",width:"95%"},children:[r.jsxs("div",{className:"modal-header",children:[r.jsxs("div",{children:[r.jsx("div",{className:"modal-title",children:"Bulk Edit Planning Parameters"}),r.jsxs("div",{className:"modal-sub",children:["Updating ",V.length," selected line items"]})]}),r.jsx("button",{className:"modal-close",onClick:()=>O(!1),children:r.jsx(un,{size:18})})]}),r.jsxs("form",{onSubmit:st,className:"modal-body",children:[A&&r.jsxs("div",{className:"alert-message error",children:[r.jsx(Eo,{size:16}),r.jsx("span",{children:A})]}),M&&r.jsxs("div",{className:"alert-message success",children:[r.jsx(ks,{size:16}),r.jsx("span",{children:M})]}),r.jsx("p",{className:"bulk-instructions",children:"Enter values or select options for parameters you want to update for all selected items. Blank fields will remain unchanged."}),r.jsxs("div",{className:"modal-form-grid",children:[r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planned Dispatch Date"}),r.jsx("input",{type:"date",value:ae.planned_dispatch_date,onChange:b=>me({...ae,planned_dispatch_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Start Date"}),r.jsx("input",{type:"date",value:ae.mounting_start_date,onChange:b=>me({...ae,mounting_start_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Mounting Complete Date"}),r.jsx("input",{type:"date",value:ae.mounting_complete_date,onChange:b=>me({...ae,mounting_complete_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Assigned Date"}),r.jsx("input",{type:"date",value:ae.wiring_assigned_date,onChange:b=>me({...ae,wiring_assigned_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Wiring Expected Date"}),r.jsx("input",{type:"date",value:ae.wiring_expected_date,onChange:b=>me({...ae,wiring_expected_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Expected QC Date"}),r.jsx("input",{type:"date",value:ae.expected_qc_date,onChange:b=>me({...ae,expected_qc_date:b.target.value}),className:"form-input"})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"Planning Status"}),r.jsxs("select",{value:ae.status,onChange:b=>me({...ae,status:b.target.value}),className:"form-select",children:[r.jsx("option",{value:"",children:"Leave unchanged"}),r.jsx("option",{value:"Not Started",children:"Not Started"}),r.jsx("option",{value:"In Progress",children:"In Progress"}),r.jsx("option",{value:"Waiting for Material",children:"Waiting for Material"}),r.jsx("option",{value:"QC Testing",children:"QC Testing"}),r.jsx("option",{value:"Completed",children:"Completed"})]})]}),r.jsxs("div",{className:"modal-field",children:[r.jsx("label",{children:"QC Passed Date"}),r.jsx("input",{type:"date",value:ae.qc_date,onChange:b=>me({...ae,qc_date:b.target.value}),className:"form-input"})]})]}),r.jsxs("div",{className:"modal-actions",children:[r.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>O(!1),children:"Cancel"}),r.jsx("button",{type:"submit",className:"btn-save",children:"Apply Bulk Changes"})]})]})]})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}function dh(){const[e,t]=p.useState(()=>localStorage.getItem("erp_company_name")||"Vyom ERP"),[n,a]=p.useState(()=>localStorage.getItem("erp_system_title")||"Control Panel Manufacturing"),[o,l]=p.useState(()=>localStorage.getItem("erp_timezone")||"IST (UTC+05:30)"),[s,i]=p.useState(()=>localStorage.getItem("erp_default_page_size")||"20"),[d,u]=p.useState(()=>localStorage.getItem("erp_double_grouping")!=="false"),[h,g]=p.useState(()=>localStorage.getItem("erp_auto_qc_calc")==="true"),[v,w]=p.useState(()=>localStorage.getItem("erp_planning_fs_default")==="true"),[N,S]=p.useState("1"),[E,m]=p.useState(!0),[f,c]=p.useState(""),[j,T]=p.useState(!1),[I,x]=p.useState(!1),D=localStorage.getItem("token"),[U,k]=p.useState("general"),[P,_]=p.useState(!1),[z,F]=p.useState(!1),[A,Q]=p.useState(""),[M,B]=p.useState(!1);p.useEffect(()=>{fetch(window.API_BASE+"/api/system-settings",{headers:{Authorization:`Bearer ${D}`}}).then(O=>O.json()).then(O=>{O.order_number_start&&S(O.order_number_start),m(!!O._orders_exist)}).catch(()=>{})},[D]);const V=async()=>{c(""),x(!1);const O=parseInt(N);if(isNaN(O)||O<1){c("Please enter a valid positive number.");return}T(!0);try{const de=await fetch(window.API_BASE+"/api/system-settings",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${D}`},body:JSON.stringify({order_number_start:O})}),ue=await de.json();de.ok?(x(!0),setTimeout(()=>x(!1),3e3)):c(ue.error||"Failed to save.")}catch{c("Network error.")}finally{T(!1)}},C=async O=>{O.preventDefault(),_(!0),F(!1),setTimeout(()=>{localStorage.setItem("erp_company_name",e),localStorage.setItem("erp_system_title",n),localStorage.setItem("erp_timezone",o),localStorage.setItem("erp_default_page_size",s),localStorage.setItem("erp_double_grouping",d?"true":"false"),localStorage.setItem("erp_auto_qc_calc",h?"true":"false"),localStorage.setItem("erp_planning_fs_default",v?"true":"false"),_(!1),F(!0),window.dispatchEvent(new CustomEvent("erpSettingsUpdated")),setTimeout(()=>F(!1),3e3)},800)},$=O=>{window.confirm(`Are you sure you want to run: "${O}"? This action cannot be undone.`)&&(B(!0),Q(""),setTimeout(()=>{B(!1),O==="Clear Activity Logs"?Q("Activity logs cleared successfully (simulated)."):O==="Reset Database"?Q("Database reset and re-seeded successfully."):O==="Backup Database"&&Q("Database backup generated: vyom_erp_backup_"+new Date().toISOString().split("T")[0]+".sql"),setTimeout(()=>Q(""),5e3)},1200))};return r.jsxs("div",{style:{padding:"24px"},className:"settings-container",children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px"},children:[r.jsx(Ss,{size:22,style:{color:"#f59e0b"}}),"Administration Settings"]})}),r.jsxs("div",{className:"settings-layout",children:[r.jsxs("div",{className:"settings-tabs",children:[r.jsxs("button",{className:`tab-btn ${U==="general"?"active":""}`,onClick:()=>k("general"),children:[r.jsx(Dg,{size:14}),"General Setup"]}),r.jsxs("button",{className:`tab-btn ${U==="workflow"?"active":""}`,onClick:()=>k("workflow"),children:[r.jsx(Ss,{size:14}),"Workflow & Features"]}),r.jsxs("button",{className:`tab-btn ${U==="maintenance"?"active":""}`,onClick:()=>k("maintenance"),children:[r.jsx(Eg,{size:14}),"System Maintenance"]})]}),r.jsxs("div",{className:"settings-content",children:[U==="general"&&r.jsxs(r.Fragment,{children:[r.jsxs("form",{onSubmit:C,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"General System Configurations"}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"Company Name (Logo Text)"}),r.jsx("input",{type:"text",value:e,onChange:O=>t(O.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"This label appears on the top-left logo header."})]}),r.jsxs("div",{className:"form-group",children:[r.jsx("label",{children:"System/Factory Title"}),r.jsx("input",{type:"text",value:n,onChange:O=>a(O.target.value),required:!0}),r.jsx("span",{className:"helper-text",children:"Descriptive subtitle shown next to the logo."})]}),r.jsxs("div",{className:"form-row",children:[r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"System Timezone"}),r.jsxs("select",{value:o,onChange:O=>l(O.target.value),children:[r.jsx("option",{value:"IST (UTC+05:30)",children:"India Standard Time (IST)"}),r.jsx("option",{value:"UTC",children:"Coordinated Universal Time (UTC)"}),r.jsx("option",{value:"EST (UTC-05:00)",children:"Eastern Standard Time (EST)"}),r.jsx("option",{value:"GMT",children:"Greenwich Mean Time (GMT)"})]})]}),r.jsxs("div",{className:"form-group half",children:[r.jsx("label",{children:"Default Page Size"}),r.jsxs("select",{value:s,onChange:O=>i(O.target.value),children:[r.jsx("option",{value:"10",children:"10 Rows per page"}),r.jsx("option",{value:"20",children:"20 Rows per page"}),r.jsx("option",{value:"50",children:"50 Rows per page"}),r.jsx("option",{value:"100",children:"100 Rows per page"})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:P,children:[P?r.jsx(qt,{size:14,className:"spin"}):r.jsx(Nl,{size:14}),P?"Saving...":"Save Settings"]}),z&&r.jsxs("span",{className:"success-msg",children:[r.jsx($a,{size:14})," Settings updated successfully!"]})]})]}),r.jsxs("div",{style:{marginTop:"28px",padding:"20px 24px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px"},children:[r.jsxs("h3",{style:{margin:"0 0 6px 0",color:"var(--text)",fontSize:"15px",display:"flex",alignItems:"center",gap:"8px"},children:[r.jsx(hg,{size:16,style:{color:"#f59e0b"}}),"Order Number Sequence"]}),r.jsxs("p",{style:{margin:"0 0 16px 0",color:"var(--text3)",fontSize:"13px"},children:["Set the starting order number for this system. ",r.jsx("strong",{style:{color:"#f59e0b"},children:"Once the first order is created, this setting is permanently locked."})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",background:"var(--bg3)",border:`1px solid ${E?"var(--border)":"#f59e0b"}`,borderRadius:"8px",padding:"8px 14px"},children:[r.jsxs("span",{style:{color:"var(--text3)",fontSize:"13px",whiteSpace:"nowrap"},children:["ORD-",new Date().getFullYear(),"-"]}),r.jsx("input",{type:"number",min:"1",value:N,onChange:O=>{S(O.target.value),c("")},disabled:E,style:{width:"90px",background:"transparent",border:"none",outline:"none",color:E?"var(--text3)":"var(--text)",fontSize:"15px",fontWeight:"700",cursor:E?"not-allowed":"text"}})]}),E?r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",color:"#94a3b8",fontSize:"13px"},children:[r.jsx(Jr,{size:14}),"Locked — orders already exist"]}):r.jsxs("button",{type:"button",onClick:V,disabled:j,style:{display:"flex",alignItems:"center",gap:"6px",background:"#f59e0b",color:"#000",border:"none",borderRadius:"8px",padding:"9px 18px",fontWeight:"600",fontSize:"13px",cursor:"pointer"},children:[j?r.jsx(qt,{size:13,className:"spin"}):r.jsx(Nl,{size:13}),j?"Saving...":"Set Starting Number"]}),I&&r.jsxs("span",{style:{display:"flex",alignItems:"center",gap:"6px",color:"#10b981",fontSize:"13px"},children:[r.jsx($a,{size:14})," Saved! Next order will be ORD-",new Date().getFullYear(),"-",String(N).padStart(4,"0")]})]}),f&&r.jsx("p",{style:{margin:"10px 0 0",color:"#ef4444",fontSize:"12px"},children:f})]})]}),U==="workflow"&&r.jsxs("form",{onSubmit:C,className:"settings-form",children:[r.jsx("h3",{className:"section-title",children:"Planning Module & Workflow Toggles"}),r.jsxs("div",{className:"toggle-group",children:[r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"enableDoubleGrouping",checked:d,onChange:O=>u(O.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"enableDoubleGrouping",children:"Enable Double Grouping Filter"}),r.jsx("span",{className:"toggle-desc",children:"Allows planning board users to apply a secondary group parameter simultaneously."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"autoQCFromSteps",checked:h,onChange:O=>g(O.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"autoQCFromSteps",children:"Auto-calculate QC Status"}),r.jsx("span",{className:"toggle-desc",children:"Automatically update line item QC status to completed when all QC department steps are checked off."})]})]}),r.jsxs("div",{className:"toggle-item",children:[r.jsx("input",{type:"checkbox",id:"planningFullscreenDefault",checked:v,onChange:O=>w(O.target.checked)}),r.jsxs("div",{className:"toggle-label-group",children:[r.jsx("label",{htmlFor:"planningFullscreenDefault",children:"Planning Board Fullscreen by Default"}),r.jsx("span",{className:"toggle-desc",children:"Loads the Planning Module in fullscreen mode automatically."})]})]})]}),r.jsxs("div",{className:"form-actions",children:[r.jsxs("button",{type:"submit",className:"save-btn",disabled:P,children:[P?r.jsx(qt,{size:14,className:"spin"}):r.jsx(Nl,{size:14}),P?"Saving...":"Save Settings"]}),z&&r.jsxs("span",{className:"success-msg",children:[r.jsx($a,{size:14})," Workflow updated successfully!"]})]})]}),U==="maintenance"&&r.jsxs("div",{className:"settings-form",children:[r.jsx("h3",{className:"section-title text-danger",children:"System Operations & Diagnostics"}),r.jsx("p",{className:"danger-notice",children:"WARNING: The operations below are administrative privileges. Running them can modify systemic operational states or reset logging indices."}),r.jsxs("div",{className:"maintenance-actions",children:[r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Database Backup"}),r.jsx("p",{children:"Generate a complete SQL schema and data export dump for emergency recovery."})]}),r.jsx("button",{onClick:()=>$("Backup Database"),className:"maint-btn secondary",disabled:M,children:"Backup DB"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Clear Activity Logs"}),r.jsx("p",{children:"Trims or wipes the system activity logger history database to conserve resources."})]}),r.jsx("button",{onClick:()=>$("Clear Activity Logs"),className:"maint-btn warning",disabled:M,children:"Wipe Logs"})]}),r.jsxs("div",{className:"maintenance-card",children:[r.jsxs("div",{className:"card-info",children:[r.jsx("h4",{children:"Factory Reset ERP"}),r.jsx("p",{children:"Re-seeds and formats databases to standard template values (removes testing orders)."})]}),r.jsx("button",{onClick:()=>$("Reset Database"),className:"maint-btn danger",disabled:M,children:"Factory Reset"})]})]}),M&&r.jsxs("div",{className:"maintenance-loader",children:[r.jsx(qt,{size:18,className:"spin"})," Running operations..."]}),A&&r.jsxs("div",{className:"maintenance-result",children:[r.jsx($a,{size:14})," ",A]})]})]})]}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const Xd={Urgent:{color:"#ef4444",bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.3)"},High:{color:"#f59e0b",bg:"rgba(245,158,11,0.12)",border:"rgba(245,158,11,0.3)"},Medium:{color:"#3b82f6",bg:"rgba(59,130,246,0.12)",border:"rgba(59,130,246,0.3)"},Low:{color:"#6b7280",bg:"rgba(107,114,128,0.12)",border:"rgba(107,114,128,0.3)"}},To={done:{label:"Done",color:"#10b981",bg:"rgba(16,185,129,0.12)",icon:"✓"},inprogress:{label:"In Progress",color:"#f59e0b",bg:"rgba(245,158,11,0.12)",icon:"◉"},pending:{label:"Pending",color:"#6b7280",bg:"rgba(107,114,128,0.12)",icon:"○"},blocked:{label:"Blocked",color:"#ef4444",bg:"rgba(239,68,68,0.12)",icon:"✕"},review:{label:"Review",color:"#8b5cf6",bg:"rgba(139,92,246,0.12)",icon:"⟳"}},ch={Design:"#6366f1",Purchase:"#f59e0b",Stores:"#10b981",Production:"#3b82f6",QC:"#8b5cf6",Dispatch:"#ec4899",Accounts:"#14b8a6",Sales:"#f97316"};function uh({step:e,onStatusChange:t,canEdit:n}){const a=To[e.status]||To.pending;return r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:20,background:a.bg,border:`1px solid ${a.color}33`,fontSize:11,color:a.color,fontWeight:600},children:[r.jsx("span",{children:a.icon}),r.jsx("span",{children:e.name}),n&&r.jsxs("select",{value:e.status,onChange:o=>t(e.id,o.target.value),onClick:o=>o.stopPropagation(),style:{background:"transparent",border:"none",color:a.color,fontSize:10,cursor:"pointer",outline:"none",padding:0},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]})]})}function ph({unit:e,dept:t,onStepStatusChange:n,users:a,currentUser:o}){const[l,s]=p.useState(!1),i=e.dept_steps||[],d=i.filter(w=>w.status==="done").length,u=d===i.length&&i.length>0,h=i.some(w=>w.status==="blocked"),g=w=>["Admin","Manager"].includes(o.role)||w.dept===o.role,v=h?"var(--red)":u?"var(--green)":"transparent";return r.jsxs(r.Fragment,{children:[r.jsxs("tr",{onClick:()=>s(w=>!w),style:{cursor:"pointer",borderLeft:`3px solid ${v}`,background:l?"var(--bg3)":"transparent",transition:"background 0.15s"},className:"worklist-row",children:[r.jsxs("td",{style:{padding:"10px 14px"},children:[r.jsx("div",{style:{fontFamily:"monospace",fontWeight:700,color:"var(--text)",fontSize:13},children:e.order_number}),e.company_name&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:11,marginTop:2},children:["🏢 ",e.company_name,e.company_city?` · ${e.company_city}`:""]}),e.po_number&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:11,marginTop:1,fontFamily:"monospace"},children:["PO: ",e.po_number]}),e.reference_number&&r.jsxs("div",{style:{color:"#f59e0b",fontSize:10,marginTop:1,fontWeight:600},children:["Ref: ",e.reference_number]})]}),r.jsx("td",{style:{padding:"10px 14px",fontFamily:"monospace",fontWeight:700,color:"var(--text)",fontSize:13},children:e.unit_serial}),r.jsxs("td",{style:{padding:"10px 14px",color:"var(--text2)",fontSize:12},children:[e.material_description,e.part_number&&r.jsxs("div",{style:{color:"var(--text3)",fontSize:10,marginTop:2},children:["Part: ",e.part_number]})]}),r.jsx("td",{style:{padding:"10px 14px"},children:(()=>{const w=Xd[e.priority]||Xd.Medium;return r.jsx("span",{style:{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:w.bg,color:w.color,border:`1px solid ${w.border}`,textTransform:"uppercase",letterSpacing:.5},children:e.priority})})()}),r.jsx("td",{style:{padding:"10px 14px",fontSize:11,color:"var(--text2)"},children:e.delivery_date?new Date(e.delivery_date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"N/A"}),r.jsx("td",{style:{padding:"10px 14px"},children:r.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:i.length===0?r.jsx("span",{style:{color:"#475569",fontSize:11,fontStyle:"italic"},children:"No steps"}):i.map(w=>r.jsx(uh,{step:w,canEdit:g(w),onStatusChange:(N,S)=>n(e.unit_id,N,S)},w.id))})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:u?"var(--green)":h?"var(--red)":"var(--text2)"},children:[u?r.jsx(ks,{size:13}):h?r.jsx(Eo,{size:13}):r.jsx(Cp,{size:13}),d,"/",i.length]})}),r.jsx("td",{style:{padding:"10px 14px",textAlign:"center"},children:r.jsx("span",{style:{color:"var(--text3)",display:"inline-flex",alignItems:"center"},children:l?r.jsx(zo,{size:14}):r.jsx(to,{size:14})})})]}),l&&i.length>0&&r.jsx("tr",{style:{background:"var(--bg3)"},children:r.jsx("td",{colSpan:8,style:{padding:"12px 24px 16px 24px"},children:r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:i.map(w=>{const N=To[w.status]||To.pending,S=a.find(E=>E.id===w.assigned_user_id);return r.jsxs("div",{style:{background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[r.jsxs("div",{children:[r.jsx("div",{style:{fontWeight:600,color:"var(--text)",fontSize:13},children:w.name}),w.notes&&r.jsx("div",{style:{color:"var(--text3)",fontSize:11,marginTop:2,fontStyle:"italic"},children:w.notes}),S&&r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4,marginTop:4,color:"var(--green)",fontSize:11},children:[r.jsx(Jo,{size:10}),S.username]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[w.updated&&r.jsx("span",{style:{color:"var(--text3)",fontSize:10},children:w.updated}),g(w)?r.jsxs("select",{value:w.status,onChange:E=>n(e.unit_id,w.id,E.target.value),style:{background:N.bg,border:`1px solid ${N.color}44`,color:N.color,fontSize:11,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontWeight:600,outline:"none"},children:[r.jsx("option",{value:"pending",children:"Pending"}),r.jsx("option",{value:"inprogress",children:"In Progress"}),r.jsx("option",{value:"done",children:"Done"}),r.jsx("option",{value:"blocked",children:"Blocked"}),r.jsx("option",{value:"review",children:"Review"})]}):r.jsx("span",{style:{background:N.bg,border:`1px solid ${N.color}44`,color:N.color,fontSize:11,borderRadius:6,padding:"4px 8px",fontWeight:600},children:N.label})]})]},w.id)})})})})]})}function fh({dept:e}){const[t,n]=p.useState([]),[a,o]=p.useState([]),[l,s]=p.useState(!0),[i,d]=p.useState(!1),[u,h]=p.useState("all"),[g,v]=p.useState(""),w=localStorage.getItem("token"),N=JSON.parse(localStorage.getItem("user")||"{}");["Admin","Manager",e].includes(N.role);const S=ch[e]||"#6366f1",E=p.useCallback(async(x=!1)=>{x?d(!0):s(!0);try{const[D,U]=await Promise.all([fetch(`${window.API_BASE}/api/dept-worklist/${encodeURIComponent(e)}`,{headers:{Authorization:`Bearer ${w}`}}),fetch(window.API_BASE+"/api/users",{headers:{Authorization:`Bearer ${w}`}})]);D.ok&&n(await D.json()),U.ok&&o(await U.json())}finally{s(!1),d(!1)}},[e,w]);p.useEffect(()=>{E()},[E]),p.useEffect(()=>{const x=()=>E(!0);return window.addEventListener("orderUpdated",x),()=>window.removeEventListener("orderUpdated",x)},[E]);const m=async(x,D,U)=>{try{(await fetch(`${window.API_BASE}/api/units/${x}/steps/${D}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`},body:JSON.stringify({status:U})})).ok&&(n(P=>P.map(_=>_.unit_id!==x?_:{..._,dept_steps:(_.dept_steps||[]).map(z=>z.id===D?{...z,status:U}:z)})),window.dispatchEvent(new CustomEvent("orderUpdated")))}catch(k){console.error("Failed to update step",k)}},f=t.filter(x=>{if(g.trim()!==""){const D=g.trim().toLowerCase().split(/\s+/),U=(x.unit_serial||"").toLowerCase(),k=(x.order_number||"").toLowerCase(),P=(x.material_description||"").toLowerCase(),_=(x.company_name||"").toLowerCase(),z=(x.reference_number||"").toLowerCase(),F=(x.po_number||"").toLowerCase();if(!D.every(Q=>U.includes(Q)||k.includes(Q)||P.includes(Q)||_.includes(Q)||z.includes(Q)||F.includes(Q)))return!1}if(u==="done"){const D=x.dept_steps||[];return D.length>0&&D.every(U=>U.status==="done")}if(u==="inprogress")return(x.dept_steps||[]).some(U=>U.status==="inprogress");if(u==="pending"){const D=x.dept_steps||[];return D.every(U=>U.status==="pending")||D.length===0}return!0}),c=t.length,j=t.filter(x=>(x.dept_steps||[]).every(D=>D.status==="done")&&(x.dept_steps||[]).length>0).length,T=t.filter(x=>(x.dept_steps||[]).some(D=>D.status==="inprogress")).length,I=t.filter(x=>(x.dept_steps||[]).some(D=>D.status==="blocked")).length;return l?r.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:300,gap:16},children:[r.jsx("div",{style:{width:48,height:48,border:`3px solid ${S}33`,borderTopColor:S,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}),r.jsxs("div",{style:{color:"var(--text3)",fontSize:14},children:["Loading ",e," worklist..."]}),r.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}):r.jsxs("div",{style:{padding:"4px 0"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[r.jsx("div",{style:{width:36,height:36,borderRadius:10,background:`${S}22`,border:`1px solid ${S}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18},children:e==="Design"?"✏️":e==="QC"?"🔬":e==="Production"?"🔧":e==="Purchase"?"📦":e==="Stores"?"🏪":e==="Dispatch"?"🚚":e==="Accounts"?"💼":"📋"}),r.jsxs("div",{children:[r.jsxs("h2",{style:{margin:0,color:"var(--text)",fontSize:20,fontWeight:800},children:[e," Worklist"]}),r.jsx("div",{style:{color:"var(--text3)",fontSize:12,marginTop:2},children:e==="Sales"?`${c} unit${c!==1?"s":""} total in system`:`${c} unit${c!==1?"s":""} currently in ${e}`})]})]}),r.jsxs("button",{onClick:()=>E(!0),disabled:i,style:{display:"flex",alignItems:"center",gap:6,background:"var(--bg4)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:12,borderRadius:8,padding:"7px 14px",cursor:"pointer",transition:"all 0.2s"},children:[r.jsx(qt,{size:13,style:{animation:i?"spin 0.8s linear infinite":"none"}}),"Refresh"]})]}),r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:12,marginBottom:20},children:[{label:"Total Units",value:c,color:S},{label:"In Progress",value:T,color:"#f59e0b"},{label:"Completed",value:j,color:"#10b981"},{label:"Blocked",value:I,color:"#ef4444"}].map(x=>r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",textAlign:"center",borderTop:`2px solid ${x.color}55`},children:[r.jsx("div",{style:{fontSize:24,fontWeight:800,color:x.color},children:x.value}),r.jsx("div",{style:{fontSize:11,color:"var(--text3)",marginTop:2,textTransform:"uppercase",letterSpacing:.5},children:x.label})]},x.label))}),r.jsxs("div",{style:{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"},children:[r.jsx("input",{type:"text",placeholder:"Search by unit ID, order, item, client...",value:g,onChange:x=>v(x.target.value),style:{flex:1,minWidth:220,background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,padding:"9px 14px",color:"var(--text)",fontSize:13,outline:"none",transition:"border-color 0.2s"},onFocus:x=>x.target.style.borderColor=S,onBlur:x=>x.target.style.borderColor="var(--border2)"}),r.jsx("div",{style:{display:"flex",background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,overflow:"hidden"},children:["all","pending","inprogress","done"].map(x=>r.jsx("button",{onClick:()=>h(x),style:{padding:"9px 14px",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:u===x?S:"transparent",color:u===x?"#fff":"var(--text2)",textTransform:"capitalize",transition:"all 0.15s"},children:x==="inprogress"?"In Progress":x.charAt(0).toUpperCase()+x.slice(1)},x))})]}),f.length===0&&r.jsxs("div",{style:{textAlign:"center",padding:"60px 20px",background:"var(--bg2)",borderRadius:12,border:"1px solid var(--border)"},children:[r.jsx("div",{style:{fontSize:40,marginBottom:12},children:"🎉"}),r.jsx("div",{style:{color:"var(--text)",fontWeight:700,fontSize:18,marginBottom:6},children:g||u!=="all"?"No matching units":e==="Sales"?"No units in the system":`No units in ${e}`}),r.jsx("div",{style:{color:"var(--text3)",fontSize:13},children:g||u!=="all"?"Try adjusting your search or filter.":`All ${e} tasks are complete or no units have been assigned yet.`})]}),f.length>0&&r.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{background:"var(--bg3)",borderBottom:"1px solid var(--border)"},children:[r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Order Info"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Unit ID"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Item Details"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Priority"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Delivery Date"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"left",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Tasks"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"center",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Progress"}),r.jsx("th",{style:{padding:"12px 14px",textAlign:"center",color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5},children:"Expand"})]})}),r.jsx("tbody",{children:f.map(x=>r.jsx(ph,{unit:x,dept:e,onStepStatusChange:m,users:a,currentUser:N},x.unit_id))})]})}),r.jsx("style",{children:`
        .worklist-row:hover { background: rgba(255,255,255,0.03) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `})]})}const xh=["All","General","PO","Quotation","BOM","Drawing","QC Report","Dispatch Document","Photo"];function mh(){const[e,t]=p.useState({orders:[],documents:[]}),[n,a]=p.useState(""),[o,l]=p.useState("All"),[s,i]=p.useState("All"),[d,u]=p.useState(!1),[h,g]=p.useState({}),v=localStorage.getItem("token"),w=JSON.parse(localStorage.getItem("user")||"{}");p.useEffect(()=>{N()},[]);const N=async()=>{u(!0);try{const x=await fetch(window.API_BASE+"/api/documents/directory",{headers:{Authorization:`Bearer ${v}`}});if(x.ok){const D=await x.json();t(D)}}catch(x){console.error("Failed to fetch document directory",x)}finally{u(!1)}},S=async(x,D)=>{if(x.stopPropagation(),!!window.confirm("Are you sure you want to delete this document?"))try{const U=await fetch(`${window.API_BASE}/api/documents/${D}`,{method:"DELETE",headers:{Authorization:`Bearer ${v}`}});if(U.ok)t(k=>({...k,documents:k.documents.filter(P=>P.id!==D)}));else{const k=await U.json();alert(k.error||"Failed to delete document")}}catch(U){console.error("Delete error:",U),alert("Network error during deletion")}},E=x=>{switch(x==null?void 0:x.toLowerCase()){case"sales":return{background:"rgba(59, 130, 246, 0.1)",color:"#3b82f6",border:"1px solid rgba(59, 130, 246, 0.2)"};case"design":return{background:"rgba(167, 139, 250, 0.1)",color:"#a78bfa",border:"1px solid rgba(167, 139, 250, 0.2)"};case"purchase":return{background:"rgba(249, 115, 22, 0.1)",color:"#f97316",border:"1px solid rgba(249, 115, 22, 0.2)"};case"stores":return{background:"rgba(45, 212, 191, 0.1)",color:"#2dd4bf",border:"1px solid rgba(45, 212, 191, 0.2)"};case"production":return{background:"rgba(239, 68, 68, 0.1)",color:"#ef4444",border:"1px solid rgba(239, 68, 68, 0.2)"};case"qc":return{background:"rgba(34, 197, 94, 0.1)",color:"#22c55e",border:"1px solid rgba(34, 197, 94, 0.2)"};case"dispatch":return{background:"rgba(245, 158, 11, 0.1)",color:"#f59e0b",border:"1px solid rgba(245, 158, 11, 0.2)"};case"accounts":return{background:"rgba(14, 165, 233, 0.1)",color:"#0ea5e9",border:"1px solid rgba(14, 165, 233, 0.2)"};default:return{background:"rgba(255, 255, 255, 0.05)",color:"#888",border:"1px solid rgba(255, 255, 255, 0.1)"}}},m=x=>{switch(x==null?void 0:x.toUpperCase()){case"PO":return{background:"rgba(245, 158, 11, 0.15)",color:"#fbbf24",border:"1px solid rgba(245,158,11,0.3)"};case"QUOTATION":return{background:"rgba(59, 130, 246, 0.15)",color:"#60a5fa",border:"1px solid rgba(59,130,246,0.3)"};case"BOM":return{background:"rgba(45, 212, 191, 0.15)",color:"#2dd4bf",border:"1px solid rgba(45,212,191,0.3)"};case"DRAWING":return{background:"rgba(167, 139, 250, 0.15)",color:"#c084fc",border:"1px solid rgba(167,139,250,0.3)"};case"QC REPORT":return{background:"rgba(34, 197, 94, 0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.3)"};default:return{background:"rgba(255, 255, 255, 0.08)",color:"#e8eaf0",border:"1px solid rgba(255,255,255,0.15)"}}},f=x=>{const D=new Date(x);return D.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+" "+D.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})},c=x=>{g(D=>({...D,[x]:!D[x]}))},j=e.documents.filter(x=>{if(o!=="All"&&x.uploader_role!==o||s!=="All"&&x.doc_type!==s)return!1;if(n.trim()!==""){const D=n.trim().toLowerCase().split(/\s+/),U=(x.file_name||"").toLowerCase(),k=(x.uploader_username||"").toLowerCase(),P=(x.source_details||"").toLowerCase(),_=e.orders.find(M=>Number(M.id)===Number(x.order_id)),z=((_==null?void 0:_.order_number)||"").toLowerCase(),F=((_==null?void 0:_.po_number)||"").toLowerCase(),A=((_==null?void 0:_.company_name)||"").toLowerCase(),Q=((_==null?void 0:_.end_client_name)||"").toLowerCase();return D.every(M=>U.includes(M)||k.includes(M)||P.includes(M)||z.includes(M)||F.includes(M)||A.includes(M)||Q.includes(M))}return!0}),T=e.orders.map(x=>{const D=j.filter(U=>Number(U.order_id)===Number(x.id));return{...x,docs:D}}).filter(x=>{if(n||o!=="All"||s!=="All"){if(n.trim()!==""){const D=n.trim().toLowerCase().split(/\s+/),U=(x.order_number||"").toLowerCase(),k=(x.po_number||"").toLowerCase(),P=(x.company_name||"").toLowerCase(),_=(x.end_client_name||"").toLowerCase();if(D.every(A=>U.includes(A)||k.includes(A)||P.includes(A)||_.includes(A))&&!(o!=="All"||s!=="All"))return!0}return x.docs.length>0}return!0}),I=j.length;return r.jsxs("div",{style:{padding:"24px"},children:[r.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"24px",borderBottom:"1px solid var(--border)",paddingBottom:"16px"},children:r.jsxs("h2",{style:{margin:0,color:"#fff",display:"flex",alignItems:"center",gap:"12px",fontSize:"18px",fontWeight:600},children:[r.jsx(mg,{size:22,style:{color:"#f59e0b"}}),"Order Document Directory"]})}),r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 20px",marginBottom:"20px",display:"flex",flexWrap:"wrap",gap:"16px",alignItems:"center",justifyContent:"space-between"},children:[r.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"16px",flex:1,minWidth:"300px"},children:[r.jsxs("div",{style:{position:"relative",flex:1,minWidth:"220px"},children:[r.jsx(Pr,{size:16,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("input",{type:"text",placeholder:"Search by file name, uploader, details...",value:n,onChange:x=>a(x.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 38px",fontSize:"13px",outline:"none",transition:"border-color 0.2s"},className:"doc-search-input"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(ki,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsxs("select",{value:o,onChange:x=>l(x.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:[r.jsx("option",{value:"All",children:"All Departments"}),r.jsx("option",{value:"Sales",children:"Sales"}),r.jsx("option",{value:"Design",children:"Design"}),r.jsx("option",{value:"Purchase",children:"Purchase"}),r.jsx("option",{value:"Stores",children:"Stores"}),r.jsx("option",{value:"Production",children:"Production"}),r.jsx("option",{value:"QC",children:"QC"}),r.jsx("option",{value:"Dispatch",children:"Dispatch"}),r.jsx("option",{value:"Accounts",children:"Accounts"})]}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]}),r.jsxs("div",{style:{position:"relative",width:"180px"},children:[r.jsx(Do,{size:14,style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}),r.jsx("select",{value:s,onChange:x=>i(x.target.value),style:{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--text)",padding:"10px 12px 10px 34px",fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"},children:xh.map(x=>r.jsx("option",{value:x==="All"?"All":x,children:x==="All"?"All Document Tags":x},x))}),r.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text3)",fontSize:"10px"},children:"▼"})]})]}),r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[(n||o!=="All"||s!=="All")&&r.jsx("button",{onClick:()=>{a(""),l("All"),i("All")},style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"var(--red)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",transition:"all 0.2s"},className:"clear-btn",children:"Clear Filters"}),r.jsxs("button",{onClick:N,disabled:d,style:{background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text)",padding:"10px 16px",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",transition:"all 0.2s"},className:"refresh-btn",children:[r.jsx(qt,{size:14,className:d?"spin":""}),d?"Loading...":"Refresh"]})]})]}),r.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:"16px",fontSize:"12px",color:"var(--text2)"},children:r.jsxs("div",{children:["Showing documents for ",r.jsx("span",{style:{color:"var(--accent)",fontWeight:"600"},children:T.length})," orders"," ","(",r.jsx("span",{style:{color:"#fff",fontWeight:"600"},children:I})," documents match filters)"]})}),r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:d&&e.orders.length===0?r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"64px",textAlign:"center",color:"var(--text2)"},children:[r.jsx(qt,{size:24,className:"spin",style:{margin:"0 auto 12px",color:"var(--accent)",display:"block"}}),"Loading Document Directory..."]}):T.length===0?r.jsx("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"48px",textAlign:"center",color:"var(--text3)"},children:"No orders or documents match the current filters."}):T.map(x=>{const D=h[x.id]!==!0,U=x.docs.length>0;return r.jsxs("div",{style:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden",transition:"border-color 0.2s"},className:"order-card",children:[r.jsxs("div",{onClick:()=>c(x.id),style:{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:"rgba(255, 255, 255, 0.01)",borderBottom:D?"none":"1px solid var(--border)"},className:"order-card-header",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"},children:[r.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"13px",background:"rgba(245,158,11,0.1)",color:"var(--accent)",padding:"4px 10px",borderRadius:"6px",border:"1px solid rgba(245,158,11,0.2)",fontWeight:600},children:x.order_number}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px",fontFamily:"var(--font-mono)"},children:"PO:"}),r.jsx("span",{style:{color:"#fff",fontSize:"13px",fontFamily:"var(--font-mono)",fontWeight:500},children:x.po_number||"—"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px"},children:"Client:"}),r.jsx("span",{style:{color:"var(--text2)",fontSize:"13px",fontWeight:500},children:x.company_name||x.end_client_name||"—"})]})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[r.jsxs("span",{style:{fontSize:"11px",background:U?"rgba(34, 197, 94, 0.1)":"rgba(255,255,255,0.03)",color:U?"var(--green)":"var(--text3)",padding:"3px 8px",borderRadius:"20px",border:U?"1px solid rgba(34, 197, 94, 0.2)":"1px solid var(--border)"},children:[x.docs.length," document",x.docs.length!==1?"s":""]}),r.jsx("span",{style:{color:"var(--text3)",fontSize:"11px",transition:"transform 0.2s",transform:D?"rotate(0deg)":"rotate(180deg)"},children:"▼"})]})]}),!D&&r.jsx("div",{style:{padding:"20px"},children:U?r.jsx("div",{style:{overflowX:"auto"},children:r.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"13px",textAlign:"left"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{borderBottom:"1px solid var(--border2)",color:"var(--text2)"},children:[r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Document Name"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Tag"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Uploading Dept"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Uploaded By"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Source Context"}),r.jsx("th",{style:{padding:"10px 12px",fontWeight:500,fontSize:"11px",fontFamily:"var(--font-mono)"},children:"Date & Time"}),r.jsx("th",{style:{padding:"10px 12px",textAlign:"right"},children:"Actions"})]})}),r.jsx("tbody",{children:x.docs.map(k=>{const P=k.uploaded_by===w.id||w.role==="Admin"||w.role==="Manager",_=k.file_path.split(/[\/\\]/).pop(),z=`${window.API_BASE}/uploads/${_}?token=${v}`;return r.jsxs("tr",{className:"doc-row",style:{borderBottom:"1px solid var(--border)"},children:[r.jsx("td",{style:{padding:"12px"},children:r.jsxs("a",{href:z,target:"_blank",rel:"noopener noreferrer",style:{color:"#fff",textDecoration:"none",display:"flex",alignItems:"center",gap:"8px",fontWeight:500},className:"doc-file-link",children:[r.jsx(Do,{size:16,style:{color:"var(--text3)",flexShrink:0}}),r.jsx("span",{style:{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap",maxWidth:"280px"},title:k.file_name,children:k.file_name}),r.jsxs("span",{style:{fontSize:"10px",color:"var(--text3)"},children:["(",(k.file_size/1024).toFixed(1)," KB)"]})]})}),r.jsx("td",{style:{padding:"12px"},children:r.jsx("span",{style:{fontSize:"10px",fontWeight:600,padding:"2px 8px",borderRadius:"4px",textTransform:"uppercase",display:"inline-block",...m(k.doc_type)},children:k.doc_type})}),r.jsx("td",{style:{padding:"12px"},children:r.jsx("span",{style:{fontSize:"11px",fontWeight:500,padding:"2px 8px",borderRadius:"12px",display:"inline-block",...E(k.uploader_role)},children:k.uploader_role||"System"})}),r.jsx("td",{style:{padding:"12px",color:"var(--text2)"},children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[r.jsx(Jo,{size:13,style:{color:"var(--text3)"}}),r.jsx("span",{children:k.uploader_username||"system"})]})}),r.jsx("td",{style:{padding:"12px",color:"var(--text2)",fontStyle:k.source_details==="Order Level"?"italic":"normal"},children:k.source_details}),r.jsx("td",{style:{padding:"12px",color:"var(--text3)",whiteSpace:"nowrap"},children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px"},children:[r.jsx(_p,{size:13}),r.jsx("span",{children:f(k.uploaded_at)})]})}),r.jsx("td",{style:{padding:"12px",textAlign:"right"},children:r.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[r.jsx("a",{href:z,download:k.file_name,style:{background:"rgba(255, 255, 255, 0.05)",border:"1px solid var(--border)",color:"var(--text2)",padding:"5px 8px",borderRadius:"6px",cursor:"pointer",display:"inline-flex",alignItems:"center"},title:"Download document",className:"action-icon-btn",children:r.jsx(xg,{size:13})}),P&&r.jsx("button",{onClick:F=>S(F,k.id),style:{background:"rgba(239, 68, 68, 0.05)",border:"1px solid rgba(239, 68, 68, 0.15)",color:"var(--red)",padding:"5px 8px",borderRadius:"6px",cursor:"pointer",display:"inline-flex",alignItems:"center"},title:"Delete document",className:"action-icon-btn delete-btn",children:r.jsx(Dp,{size:13})})]})})]},k.id)})})]})}):r.jsx("div",{style:{color:"var(--text3)",textAlign:"center",fontSize:"13px",padding:"12px 0",fontStyle:"italic"},children:"No documents associated with this order."})})]},x.id)})}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})}const gh=({children:e})=>{const t=localStorage.getItem("token"),n=localStorage.getItem("user");return!t||t==="undefined"||t==="null"||!n?r.jsx(kp,{to:"/",replace:!0}):e};function hh(){const[e,t]=p.useState([]),[n,a]=p.useState([]),[o,l]=p.useState("all"),[s,i]=p.useState("board"),[d,u]=p.useState("Accept-Complete"),[h,g]=p.useState("Standard"),[v,w]=p.useState(null),[N,S]=p.useState(!1),[E,m]=p.useState(null),f=p.useRef(null),[c,j]=p.useState(null),[T,I]=p.useState(!0),[x,D]=p.useState(!1),[U,k]=p.useState(()=>window.innerWidth<1200),[P,_]=p.useState(""),[z,F]=p.useState([]),A=p.useRef(null),Q=wi(),[M,B]=p.useState(()=>JSON.parse(localStorage.getItem("user")||"{}")),V=localStorage.getItem("token"),C=async(H,Z={})=>{const ce=await fetch(H,{...Z,headers:{...Z.headers,Authorization:`Bearer ${V}`}});return ce.status===401?(localStorage.removeItem("token"),localStorage.removeItem("user"),Q("/"),null):ce};p.useEffect(()=>{de(),ue();const H=Z=>{typeof Z.detail=="string"?i(Z.detail):Z.detail&&Z.detail.view&&(i(Z.detail.view),Z.detail.orderId?(m(Z.detail.orderId),f.current=Z.detail.orderId):Z.detail.orderId===null&&(m(null),f.current=null))};return window.addEventListener("setView",H),()=>window.removeEventListener("setView",H)},[]),p.useEffect(()=>{E?(O(E),$(E)):(t([]),j(null))},[E]),p.useEffect(()=>{if(!c){_(""),A.current=null;return}if(A.current!==c.id){const H=c.units||[];H.length>0?_(H[0].id.toString()):_(""),A.current=c.id}else{const H=c.units||[];P&&!H.some(Z=>Z.id.toString()===P.toString())&&(H.length>0?_(H[0].id.toString()):_(""))}},[c,P]),p.useEffect(()=>{var Z,ce;const H=P||((ce=(Z=c==null?void 0:c.units)==null?void 0:Z[0])==null?void 0:ce.id);H&&V?fetch(`${window.API_BASE}/api/units/${H}/steps`,{headers:{Authorization:`Bearer ${V}`}}).then(async ot=>{ot.ok&&F(await ot.json())}).catch(console.error):F([])},[P,c,V]),p.useEffect(()=>{const H=()=>{var Z,ce;if(E){O(E),$(E);const ot=P||((ce=(Z=c==null?void 0:c.units)==null?void 0:Z[0])==null?void 0:ce.id);ot&&V&&fetch(`${window.API_BASE}/api/units/${ot}/steps`,{headers:{Authorization:`Bearer ${V}`}}).then(async lt=>{lt.ok&&F(await lt.json())}).catch(console.error)}};return window.addEventListener("orderUpdated",H),()=>window.removeEventListener("orderUpdated",H)},[E,P,c,V]);const $=async H=>{if(V)try{const Z=await C(`${window.API_BASE}/api/orders/${H}`);Z!=null&&Z.ok&&j(await Z.json())}catch(Z){console.error("Failed to fetch order details",Z)}},O=async H=>{if(V)try{const Z=await C(`${window.API_BASE}/api/orders/${H}/steps`);Z!=null&&Z.ok&&t(await Z.json())}catch(Z){console.error("Failed to fetch steps",Z)}},de=async()=>{if(V)try{const H=await C(window.API_BASE+"/api/auth/profile");if(H!=null&&H.ok){const Z=await H.json();B(Z),localStorage.setItem("user",JSON.stringify(Z))}}catch(H){console.error("Failed to sync profile",H)}},ue=async()=>{try{const H=await C(window.API_BASE+"/api/logs");if(H!=null&&H.ok){const Z=await H.json();a(Z.map(ce=>({time:An(new Date(ce.timestamp)),dept:ce.dept,text:ce.action_text,username:ce.username})))}}catch(H){console.error("Failed to fetch logs",H)}},ae=async(H,Z,ce)=>{const ot=ce??f.current;try{const lt=await C(window.API_BASE+"/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dept:H,action_text:Z,order_id:ot?parseInt(ot):null})});ue()}catch(lt){console.error("Failed to log activity",lt)}},me=()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),Q("/")},se=H=>{i(H),H==="board"&&(m(null),f.current=null,j(null),t([]),l("all"),window.dispatchEvent(new CustomEvent("setView",{detail:{orderId:null}})))},L=e.find(H=>H.id===v)||null,ee=H=>{w(H),S(!0)},Y=()=>{S(!1)},be=async H=>{try{const Z=await fetch(`${window.API_BASE}/api/orders/${E}/steps/${v}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${V}`},body:JSON.stringify(H)});if(Z.ok){if(await O(E),await $(E),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:E}})),L.special==="qc"&&H.status==="blocked"&&H.qcFailTarget){const ce=H.qcFailTarget==="production"?"QC FAIL → returned to Production for rework":"QC FAIL → returned to Design for re-check";ae("QC",ce,E)}return ae(L.dept,`"${L.name}" → ${H.status.toUpperCase()}${H.notes?" — "+H.notes:""}`,E),S(!1),null}else return(await Z.json().catch(()=>({}))).error||"Failed to save step"}catch(Z){return console.error("Failed to save step",Z),"Network error — could not save step"}},oe=async H=>{if(window.confirm("Are you sure you want to permanently delete this task from the order's flow?"))try{(await fetch(`${window.API_BASE}/api/orders/${E}/steps/${H}`,{method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).ok?(S(!1),O(E),window.dispatchEvent(new CustomEvent("orderUpdated",{detail:{orderId:E}}))):alert("Failed to delete step")}catch(Z){console.error(Z)}},W=H=>{if(!["Admin","Manager","Accounts","Production"].includes(M.role)){alert("Unauthorized to change BOM status");return}u(H),ae("Stores",`BOM status updated → ${H}`,E)},Ee=H=>{if(!["Admin","Manager","Design"].includes(M.role)){alert("Unauthorized to change Design classification");return}g(H),ae("Design",`Design classified as ${H}`,E)},je=e.filter(H=>!H.order_unit_id),he=[...z,...je];return r.jsxs("div",{className:"app-container",children:[r.jsx(Lg,{onLogout:me,onToggleSidebar:()=>k(H=>!H),sidenavCollapsed:U}),r.jsxs("div",{className:"app",children:[(!T||s!=="planning")&&r.jsx(Bg,{steps:he,currentFilter:o,onFilterDept:l,bomState:d,onSetBomState:W,designType:h,onSetDesignType:Ee,currentView:s,onSetView:se,userRole:M.role,collapsed:U}),r.jsxs("main",{className:"main",children:[s!=="planning"&&r.jsx(Ug,{steps:he,currentFilter:o,selectedOrder:c}),r.jsxs("div",{className:"flow-header",children:[r.jsx("div",{className:"flow-title",children:s==="board"?"Board":s==="planning"?"Planning Board":s==="flow"?"Process Flow":s==="table"?"Table View":s==="orders"?"Order Directory":s==="documents"?"Document Directory":s==="new-order"?"New Order":s==="import"?"Import Orders":s==="masters"?"Masters":s==="logs"?"System Logs":s==="worklist"?`${M.role} Worklist`:"User Management"}),["board","flow","table"].includes(s)&&r.jsxs("div",{className:"view-toggle",children:[r.jsx("button",{className:`vbtn${s==="board"?" active":""}`,onClick:()=>se("board"),children:"Board"}),r.jsx("button",{className:`vbtn${s==="flow"?" active":""}`,onClick:()=>i("flow"),children:"Flow"}),r.jsx("button",{className:`vbtn${s==="table"?" active":""}`,onClick:()=>i("table"),children:"Table"})]}),s==="planning"&&r.jsxs("button",{className:`vbtn${T?" active":""}`,onClick:()=>I(!T),style:{display:"flex",alignItems:"center",gap:"6px"},children:[T?r.jsx(_g,{size:13}):r.jsx(kg,{size:13}),T?"Exit Fullscreen":"Fullscreen"]})]}),s==="board"?r.jsx(Hg,{currentFilter:o,userRole:M.role,onSetView:i}):s==="planning"?["Admin","Manager","Planning"].includes(M.role)?r.jsx(ih,{}):r.jsx("div",{style:{padding:40,textAlign:"center",color:"var(--text3)"},children:"Unauthorized to view the Planning Module."}):s==="flow"?E?r.jsx(qg,{steps:e,currentFilter:o,onOpenModal:ee,onSetView:i,userRole:M.role,selectedOrderId:E,selectedOrder:c,onStepsChanged:()=>O(E),selectedUnitId:P,setSelectedUnitId:_,unitSteps:z,setUnitSteps:F}):r.jsx("div",{style:{padding:40,textAlign:"center",color:"#888"},children:"Please select an order from the Header dropdown to view its Process Flow."}):s==="table"?E?r.jsx(Yg,{steps:he,currentFilter:o,onOpenModal:ee,userRole:M.role}):r.jsx(Gg,{currentFilter:o,onSetView:se}):s==="orders"?r.jsx(rh,{initialSelectedId:E}):s==="documents"?r.jsx(mh,{}):s==="new-order"?r.jsx(eh,{onOrderCreated:()=>{i("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):s==="import"?r.jsx(Tp,{onImportComplete:()=>{i("orders"),window.dispatchEvent(new CustomEvent("orderUpdated"))}}):s==="masters"?r.jsx(oh,{}):s==="logs"?r.jsx(lh,{}):s==="settings"?r.jsx(dh,{}):s==="worklist"?r.jsx(fh,{dept:M.role}):r.jsx(Zg,{})]}),s!=="planning"&&M.role==="Admin"&&r.jsx(Jg,{selectedStep:L,activityLog:n,selectedOrder:c,isOpen:x,onToggle:()=>D(H=>!H)})]}),r.jsx(Kg,{step:L,isOpen:N,onClose:Y,onSave:be,onDelete:oe,userRole:M.role,selectedOrder:c})]})}function vh(){return r.jsx(ag,{children:r.jsxs(tg,{children:[r.jsx(eo,{path:"/",element:r.jsx(Xg,{})}),r.jsx(eo,{path:"/dashboard",element:r.jsx(gh,{children:r.jsx(hh,{})})}),r.jsx(eo,{path:"*",element:r.jsx(kp,{to:"/",replace:!0})})]})})}window.API_BASE="";const{fetch:yh}=window;window.fetch=async(...e)=>{var n;const t=await yh(...e);if(t.status===401){const a=typeof e[0]=="string"?e[0]:(n=e[0])==null?void 0:n.url;a&&!a.includes("/api/auth/login")&&(localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.href="/")}return t};zl.createRoot(document.getElementById("root")).render(r.jsx(ro.StrictMode,{children:r.jsx(vh,{})}));
