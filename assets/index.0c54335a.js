var J=Object.defineProperty,Q=Object.defineProperties;var X=Object.getOwnPropertyDescriptors;var k=Object.getOwnPropertySymbols;var Y=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var L=(r,e,n)=>e in r?J(r,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[e]=n,R=(r,e)=>{for(var n in e||(e={}))Y.call(e,n)&&L(r,n,e[n]);if(k)for(var n of k(e))Z.call(e,n)&&L(r,n,e[n]);return r},$=(r,e)=>Q(r,X(e));import{o as f,c as g,a as x,r as A,b as j,d as ee,e as M,f as te,g as y,i as C,h as re,j as oe,k as z,F as ne,l as ae,u as ie,m as B,w as T,t as se,n as ce,p as U,q as le}from"./vendor.83dee946.js";import*as S from"https://unpkg.com/three@0.134.0/build/three.module.js";const ue=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const c of o)if(c.type==="childList")for(const t of c.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&i(t)}).observe(document,{childList:!0,subtree:!0});function n(o){const c={};return o.integrity&&(c.integrity=o.integrity),o.referrerpolicy&&(c.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?c.credentials="include":o.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function i(o){if(o.ep)return;o.ep=!0;const c=n(o);fetch(o.href,c)}};ue();var E=(r,e)=>{const n=r.__vccOpts||r;for(const[i,o]of e)n[i]=o;return n};const _e={},de={class:"layout"};function me(r,e){return f(),g("div",de,[x("aside",null,[A(r.$slots,"aside",{},void 0,!0)]),x("main",null,[A(r.$slots,"default",{},void 0,!0)])])}var pe=E(_e,[["render",me],["__scopeId","data-v-607fdc56"]]);const ve="modulepreload",D={},fe="/threejs-learning/",w=function(e,n){return!n||n.length===0?e():Promise.all(n.map(i=>{if(i=`${fe}${i}`,i in D)return;D[i]=!0;const o=i.endsWith(".css"),c=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${c}`))return;const t=document.createElement("link");if(t.rel=o?"stylesheet":ve,o||(t.as="script",t.crossOrigin=""),t.href=i,document.head.appendChild(t),o)return new Promise((d,u)=>{t.addEventListener("load",d),t.addEventListener("error",u)})})).then(()=>e())},he={};function ge(r,e){return"404"}var ye=E(he,[["render",ge]]),H=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:ye});function P(){const r=j(null),e=ee({width:0,height:0}),n=j();let i;const o=new S.Scene,c=new S.WebGL1Renderer;let t;function d(){var v;const{clientWidth:a=100,clientHeight:p=100}=r.value;e.width=a,e.height=p,c.setSize(e.width,e.height),(v=r.value)==null||v.appendChild(c.domElement)}function u(a=.1){t=requestAnimationFrame(u),n.value&&n.value(a),c.render(o,i)}function m(){var a;cancelAnimationFrame(t),(a=r.value)==null||a.removeChild(c.domElement),c.dispose()}M(()=>{d()}),te(()=>{m()});function s(a){a instanceof S.Camera&&_(a),o.add(a)}function l(a){n.value=a}function _(a){i=a}return{body:r,size:e,animation:u,addChild:s,onUpdate:l,renderer:c,scene:o,THREE:S}}const we=y({setup(r){const{body:e,onUpdate:n,addChild:i,animation:o,size:c,renderer:t,scene:d,THREE:u}=P();function m(){const{width:s,height:l}=c,_=new u.OrthographicCamera(s/-2,s/2,l/2,l/-2,1,1e3);i(_),_.position.set(0,0,200),_.lookAt(0,0,0);const a=new u.WebGLCubeRenderTarget(128,{format:u.RGBFormat,generateMipmaps:!0,minFilter:u.LinearMipmapLinearFilter}),p=new u.CubeCamera(1,1e5,a);i(p);const v=new u.MeshLambertMaterial({color:16777215,envMap:a.texture}),b=new u.PlaneGeometry(100,100),h=new u.Mesh(b,v);i(h),h.visible=!1,p.position.copy(h.position),p.update(t,d),h.visible=!0,o(),n(()=>{})}return M(()=>{m()}),(s,l)=>(f(),g("div",{class:"scene",ref:(_,a)=>{a.body=_,C(e)&&(e.value=_)}},null,512))}});var I=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:we});const be={};function Me(r,e){return"index"}var xe=E(be,[["render",Me]]),V=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:xe});const Ce=y({setup(r){const{body:e,onUpdate:n,addChild:i,animation:o,size:c,THREE:t}=P();function d(){const{width:u,height:m}=c,s=new t.OrthographicCamera(u/-2,u/2,m/2,m/-2,1,1e3);i(s),s.position.set(0,0,200),s.lookAt(0,0,0);const l=new t.Mesh(new t.BoxGeometry(1,1,1),[new t.MeshBasicMaterial({color:"red"}),new t.MeshBasicMaterial({color:"blue"}),new t.MeshBasicMaterial({color:"green"}),new t.MeshBasicMaterial({color:"yellow"}),new t.MeshBasicMaterial({color:"gray"}),new t.MeshBasicMaterial({color:"white"})]);i(l),l.scale.set(50,50,50),n(()=>{l.rotation.x+=.01,l.rotation.y+=.01}),o()}return M(()=>{d()}),(u,m)=>(f(),g("div",{class:"scene",ref:(s,l)=>{l.body=s,C(e)&&(e.value=s)}},null,512))}});var F=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:Ce});const Pe=y({setup(r){const{body:e,onUpdate:n,addChild:i,animation:o,size:c,THREE:t}=P();function d(){const{width:u,height:m}=c,s=new t.PerspectiveCamera(45,u/m,1,1e3);i(s),s.position.set(0,0,200),s.lookAt(0,0,0);const l=new t.Mesh(new t.BoxGeometry(1,1,1),[new t.MeshBasicMaterial({color:"red"}),new t.MeshBasicMaterial({color:"blue"}),new t.MeshBasicMaterial({color:"green"}),new t.MeshBasicMaterial({color:"yellow"}),new t.MeshBasicMaterial({color:"gray"}),new t.MeshBasicMaterial({color:"white"})]);i(l),l.scale.set(50,50,50),n(()=>{l.rotation.x+=.01,l.rotation.y+=.01}),o()}return M(()=>{d()}),(u,m)=>(f(),g("div",{class:"scene",ref:(s,l)=>{l.body=s,C(e)&&(e.value=s)}},null,512))}});var G=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:Pe});const Ee=y({setup(r){const{body:e,onUpdate:n,addChild:i,animation:o,size:c,THREE:t}=P();function d(){const{width:u,height:m}=c,s=new t.PerspectiveCamera(45,u/m,1,1e3);i(s),s.position.set(0,200,10),s.lookAt(0,0,0);const l=new t.PlaneGeometry(100,100,20,20),_=new t.ShaderMaterial({uniforms:{timestamp:{value:1}},vertexShader:`
            varying vec3 vColor;

            uniform float timestamp;

            void main() {
                vColor = color;
                vec3 pos = position;
                pos.z = 10.0 * sin(pos.x * 20.0 + timestamp * 0.005);
				vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

				gl_Position = projectionMatrix * mvPosition;
            }
        `,fragmentShader:`
            varying vec3 vColor;

            void main() {
                gl_FragColor = vec4( vColor, 1.0 );
            }
        `,vertexColors:!0});_.wireframe=!0;const a=new t.Mesh(l,_);i(a),n(p=>{a.rotation.x+=.01,a.rotation.y+=.01,_.uniforms.timestamp.value=p}),o()}return M(()=>{d()}),(u,m)=>(f(),g("div",{class:"scene",ref:(s,l)=>{l.body=s,C(e)&&(e.value=s)}},null,512))}});var q=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:Ee});const Se=y({setup(r){const{body:e,onUpdate:n,addChild:i,animation:o,size:c,THREE:t}=P();function d(){const{width:u,height:m}=c,s=new t.PerspectiveCamera(45,u/m,1,1e3);i(s),s.position.set(0,-200,10),s.lookAt(0,0,0);const l=new t.PlaneGeometry(100,100,20,20),_=100/2/Math.PI,a=new t.ShaderMaterial({uniforms:{timestamp:{value:1},r:{value:_},pi:{value:Math.PI}},vertexShader:`
            varying vec3 vColor;

			uniform float timestamp;
            uniform float r;
            uniform float pi;

            void main() {
				float angle = (uv.x - 0.5) / timestamp * pi * 2.0;
				vec3 pos = position;
				pos.x = sin(angle) * r;
				pos.z = cos(angle) * r - r;

				vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

				gl_Position = projectionMatrix * mvPosition;
				vColor = color;
            }
        `,fragmentShader:`
            varying vec3 vColor;

            void main() {
                gl_FragColor = vec4( vColor, 1.0 );
            }
        `,vertexColors:!0});a.wireframe=!0;const p=new t.Mesh(l,a);i(p);let v=1,b=_,h=!0;n(()=>{p.rotation.x+=.01,p.rotation.y+=.01,v<1&&(h=!0),v>3&&(h=!1),h?v+=.01:v-=.01,b=_*v,a.uniforms.timestamp.value=v,a.uniforms.r.value=b}),o()}return M(()=>{d()}),(u,m)=>(f(),g("div",{class:"scene",ref:(s,l)=>{l.body=s,C(e)&&(e.value=s)}},null,512))}});var W=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:Se});const Te="threejs-learning",Oe="0.0.0",ke="three.js learning",Le=["three"],Re="MIT",$e={type:"git",url:"https://github.com/minjs1cn/threejs-learning/"},Ae="https://minjs1cn.github.io/threejs-learning/index.html",je={dev:"vite",build:"vue-tsc --noEmit && vite build",serve:"vite preview"},ze={three:"^0.134.0",vue:"^3.2.16","vue-router":"^4.0.12"},Be={"@types/three":"^0.134.0","@vitejs/plugin-vue":"^1.9.3",typescript:"^4.4.3",vite:"^2.6.4","vue-tsc":"^0.3.0"};var Ue={name:Te,version:Oe,description:ke,keywords:Le,license:Re,repository:$e,homepage:Ae,scripts:je,dependencies:ze,devDependencies:Be};function N(r){return"/"+Ue.name+r}const De={class:"scene"},He={class:"buttons"},Ie=y({setup(r){const{body:e,onUpdate:n,addChild:i,animation:o,size:c,THREE:t}=P(),d=new t.TextureLoader;let u=d.load(N("/touxiang.png"));function m(){const{width:l,height:_}=c,a=new t.OrthographicCamera(l/-2,l/2,_/2,_/-2,1,1e3);i(a),a.position.set(0,0,100),a.lookAt(0,0,0);const p=new t.PlaneGeometry(500,500,20,20),v=t.ShaderLib.basic,b=new t.ShaderMaterial({uniforms:$(R({},v.uniforms),{timestamp:{value:1},u_texture1:{value:d.load(N("/guoqi.png"))},u_texture2:{value:u}}),vertexShader:`
            varying vec2 vUv2;

            void main() {
                vUv2 = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,fragmentShader:`
            varying vec2 vUv2;

            uniform sampler2D u_texture1;
            uniform sampler2D u_texture2;

            void main() {
                vec4 color1 = texture2D(u_texture1, vUv2);
                vec4 color2 = texture2D(u_texture2, vUv2);

                gl_FragColor = mix(color1, color2, vUv2.x * vUv2.y * 2.0);
            }
        `,vertexColors:!0}),h=new t.Mesh(p,b);i(h),n(Ye=>{b.uniforms.u_texture2.value=u}),o()}M(()=>{m()});const s=l=>{var p;const _=(p=l.target.files)==null?void 0:p[0],a=new FileReader;a.readAsDataURL(_),a.onload=function(){u=d.load(a.result)}};return(l,_)=>(f(),g("div",De,[x("div",{class:"canvas",ref:(a,p)=>{p.body=a,C(e)&&(e.value=a)}},null,512),x("div",He,[x("input",{class:"upload",type:"file",name:"file",id:"file",accept:"image/*",onChange:s},null,32)])]))}});var Ve=E(Ie,[["__scopeId","data-v-5bbee353"]]),K=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:Ve});function Fe(r){switch(r){case"./pages/404.vue":return w(()=>Promise.resolve().then(function(){return H}),void 0);case"./pages/CubeCamera.vue":return w(()=>Promise.resolve().then(function(){return I}),void 0);case"./pages/Home.vue":return w(()=>Promise.resolve().then(function(){return V}),void 0);case"./pages/OrthographicCamera.vue":return w(()=>Promise.resolve().then(function(){return F}),void 0);case"./pages/PerspectiveCamera.vue":return w(()=>Promise.resolve().then(function(){return G}),void 0);case"./pages/ShaderMaterial.vue":return w(()=>Promise.resolve().then(function(){return q}),void 0);case"./pages/ShaderMaterial2.vue":return w(()=>Promise.resolve().then(function(){return W}),void 0);case"./pages/TextureMix.vue":return w(()=>Promise.resolve().then(function(){return K}),void 0);default:return new Promise(function(e,n){(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(n.bind(null,new Error("Unknown variable dynamic import: "+r)))})}}const Ge={"/src/pages/404.vue":H,"/src/pages/CubeCamera.vue":I,"/src/pages/Home.vue":V,"/src/pages/OrthographicCamera.vue":F,"/src/pages/PerspectiveCamera.vue":G,"/src/pages/ShaderMaterial.vue":q,"/src/pages/ShaderMaterial2.vue":W,"/src/pages/TextureMix.vue":K},O=Object.keys(Ge).map(r=>{const e=r.replace(/^\/src\/pages\//,"").replace(/\.vue$/,"");return{name:e,path:e==="404"?"/:pathMatch(.*)*":e==="Home"?"/":"/"+e,component:()=>Fe(`./pages/${e}.vue`),meta:{title:e.replace(/^\w/,n=>n.toUpperCase())}}}),qe=[...O.filter(r=>r.name==="Home"),...O.filter(r=>r.name!=="Home"&&r.name!=="404")],We=re({history:oe(),routes:O});const Ne={class:"menu"},Ke=["onClick"],Je=y({setup(r){return(e,n)=>{const i=z("router-link");return f(),g("ul",Ne,[(f(!0),g(ne,null,ae(ie(qe),o=>(f(),B(i,{custom:"",to:{name:o.name},key:o.name},{default:T(({navigate:c,isActive:t})=>{var d;return[x("li",{class:ce({active:t}),onClick:c},se((d=o.meta)==null?void 0:d.title),11,Ke)]}),_:2},1032,["to"]))),128))])}}});var Qe=E(Je,[["__scopeId","data-v-70f5f57c"]]);const Xe=y({setup(r){return(e,n)=>{const i=z("router-view");return f(),B(pe,null,{aside:T(()=>[U(Qe)]),default:T(()=>[U(i)]),_:1})}}});le(Xe).use(We).mount("#app");
