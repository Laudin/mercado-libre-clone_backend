"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[810],{7810:function(e,n,t){t.r(n),t.d(n,{LoginPage:function(){return f}});var i=t(6152),a=t(9439),r=t(4781),o=t(7313),s=t(5964),c=t(5190),d=t(6299),l=t(7890),u=t(6417);function f(){var e=o.useState({id:"",email:"",name:"",password:""}),n=(0,a.Z)(e,2),t=n[0],r=n[1],f=o.useContext(c.S),v=(f.currentUser,f.dispatchUser),C=(0,l.s0)(),Z=o.useState(!1),b=(0,a.Z)(Z,2),k=b[0],y=b[1],P=o.useState(!1),I=(0,a.Z)(P,2),S=I[0],L=I[1],D=o.useState(!1),F=(0,a.Z)(D,2),R=F[0],U=F[1],q=o.useRef(null);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(s.ql,{children:[(0,u.jsx)("title",{children:"Login"}),(0,u.jsx)("meta",{name:"",content:""})]}),(0,u.jsx)(p,{children:(0,u.jsxs)(x,{ref:q,children:[(0,u.jsx)("h1",{children:"Login"}),S&&(0,u.jsx)(j,{children:"Credenciales erroneas"}),(0,u.jsx)(h,{children:"Email"}),(0,u.jsx)(m,{type:"email",id:"email",name:"email",value:t.email,onChange:function(e){r((function(n){return(0,i.Z)((0,i.Z)({},n),{},{email:e.target.value})}))},"data-testid":"email"}),(0,u.jsx)(h,{children:"Password"}),(0,u.jsx)(m,{type:"password",id:"password",name:"password",value:t.password,onChange:function(e){r((function(n){return(0,i.Z)((0,i.Z)({},n),{},{password:e.target.value})}))},"data-testid":"password"}),k&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(h,{children:"Name"}),(0,u.jsx)(m,{type:"text",id:"name",name:"name",value:t.name,onChange:function(e){r((function(n){return(0,i.Z)((0,i.Z)({},n),{},{name:e.target.value})}))}})]}),R?(0,u.jsx)(g,{children:"cargando..."}):k?(0,u.jsx)(g,{onClick:function(e){e.preventDefault(),(0,d.a$)((0,i.Z)({},t))},"data-testid":"sign-in",children:"Crear cuenta"}):(0,u.jsx)(g,{onClick:function(e){e.preventDefault(),U((function(e){return!0})),(0,d.pH)(t.email,t.password?t.password:"").then((function(e){if(e)if(U((function(e){return!1})),e.error)L(!0);else{var n=e.data,t=n.id,i=n.name,a=n.email;v({type:"set_user",id:t,name:i,email:a}),L(!1),C("/")}})).catch((function(e){return console.log(e)}))},"data-testid":"login",children:"Continuar"}),!k&&(0,u.jsx)(w,{href:"#",onClick:function(){y(!0)},"data-testid":"register",children:"Registrate"})]})})]})}var p=r.ZP.div.withConfig({componentId:"sc-1fxn11f-0"})(["display:flex;flex-direction:column;justify-content:center;width:1240px;margin:auto;font-size:1.2rem;"]),x=r.ZP.form.withConfig({componentId:"sc-1fxn11f-1"})(["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;padding:50px;background:white;width:500px;border-radius:15px;opacity:1;transition:opacity 0.3s;& h1{text-align:center;margin-top:0px;}"]),h=r.ZP.label.withConfig({componentId:"sc-1fxn11f-2"})([""]),m=r.ZP.input.withConfig({componentId:"sc-1fxn11f-3"})([""]),g=r.ZP.button.withConfig({componentId:"sc-1fxn11f-4"})(["width:200px;background:transparent;border:2px solid var(--blue);border-radius:2px;outline:none;margin:20px auto;padding:8px;&:hover{background:var(--blue);border:2px solid var(--blue);color:white;}"]),w=r.ZP.a.withConfig({componentId:"sc-1fxn11f-5"})(["text-align:center;&:hover{color:var(--blue)}"]),j=r.ZP.div.withConfig({componentId:"sc-1fxn11f-6"})(["color:red;"])}}]);