!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";var t=function(){function t(t,e,n,o){this.targetNode=t,this.moveStart=e,this.move=n,this.moveEnd=o,this.isTouch=!1,this.prevDelta={x:0,y:0},this.moveCoord={startX:0,startY:0,nowX:0,nowY:0,shiftX:0,shiftY:0,deltaX:0,deltaY:0},this.EventSettings={capture:!0,passive:!1}}return t.prototype.getInCoord=function(t){var e=0,n=0;t instanceof MouseEvent?(e=t.clientX,n=t.clientY):(e=t.touches[0].clientX,n=t.touches[0].clientY);var o=this.targetNode.getBoundingClientRect();return{nowX:e-o.x,nowY:n-o.y}},t.prototype.StartMouseOrTouch=function(t){t.preventDefault();var e=this.getInCoord(t),n=e.nowX,o=e.nowY;this.isTouch=!0,this.moveCoord.nowX=n,this.moveCoord.nowY=o,this.moveStart(this.moveCoord)},t.prototype.Move=function(t){var e=this,n=e.isTouch,o=e.moveCoord,i=e.prevDelta;if(n){var r=this.getInCoord(t),a=r.nowX,s=r.nowY;0!==o.nowX&&(o.deltaX=a-o.nowX),0!==o.nowY&&(o.deltaY=s-o.nowY),o.nowX=a,o.nowY=s,o.deltaX===o.deltaY&&0!==o.nowX&&0!==o.nowY&&(o.deltaY=i.y,o.deltaX=i.x),i={x:o.deltaX,y:o.deltaY},o.shiftX=o.nowX-o.startX,o.shiftY=o.nowY-o.startY,this.move(o)}},t.prototype.DetectEnd=function(t){var e=this.moveCoord,n=this.moveEnd;this.isTouch=!1,n(e)},t.prototype.observe=function(){var t=this;this.targetNode.addEventListener("mousedown",(function(e){return t.StartMouseOrTouch(e)}),this.EventSettings),this.targetNode.addEventListener("touchstart",(function(e){return t.StartMouseOrTouch(e)}),this.EventSettings),window.addEventListener("mousemove",(function(e){return t.Move(e)}),this.EventSettings),this.targetNode.addEventListener("touchmove",(function(e){return t.Move(e)}),this.EventSettings),window.addEventListener("mouseup",(function(e){return t.DetectEnd(e)}),this.EventSettings),this.targetNode.addEventListener("touchend",(function(e){return t.DetectEnd(e)}),this.EventSettings)},t.prototype.unobserve=function(){var t=this;this.targetNode.removeEventListener("mousedown",(function(e){return t.StartMouseOrTouch(e)}),this.EventSettings),this.targetNode.removeEventListener("touchstart",(function(e){return t.StartMouseOrTouch(e)}),this.EventSettings),window.removeEventListener("mousemove",(function(e){return t.Move(e)}),this.EventSettings),this.targetNode.removeEventListener("touchmove",(function(e){return t.Move(e)}),this.EventSettings),window.removeEventListener("mouseup",(function(e){return t.DetectEnd(e)}),this.EventSettings),this.targetNode.removeEventListener("touchend",(function(e){return t.DetectEnd(e)}),this.EventSettings)},t}();function e(t,e,n){t.style.setProperty(e,n)}var n=function(){function n(t,e){this.children=t,this.onUpdate=e,this.prevNowY=0,this.isTouchTrack=!1,this.scrollOverflow=document.createElement("div"),this.scrollTrack=document.createElement("div"),this.scrollContainer=document.createElement("div")}return n.prototype.create=function(){var e=this,n=this,o=n.children,i=n.scrollOverflow,a=n.scrollTrack,s=n.scrollContainer;i.className="scroll-overflow",i.append(o),a.className="scroll-track scroll-track-y",s.className="scroll-container",s.append(i,a);var c=r.bind(null,s,i);c();var u=new MutationObserver(c);return new ResizeObserver(c).observe(i),u.observe(i,{childList:!0,subtree:!0}),i.addEventListener("scroll",(function(t){return e.onMoveScroll(t)}),{passive:!1}),new t(a,this.onStart.bind(this),this.onMoveY.bind(this),this.onMoveEnd.bind(this)).observe(),s},n.prototype.calcPosition=function(t){void 0===t&&(t=0);var n=this.scrollOverflow,r=this.scrollContainer,a=o(r,n),s=i(a).y,c=a.container.y,u=a.overflow.y/c,l=c-s,d=n.scrollTop;t>=0&&t<l?e(r,"--evg-scroller--y",(d=u*t)+"px"):-1===Math.sign(t)?e(r,"--evg-scroller--y",(d=0)+"px"):e(r,"--evg-scroller--y",(d=u*l)+"px"),n.scrollTo(0,d)},n.prototype.onMoveScroll=function(t){var n=this.scrollContainer,i=o(n,this.scrollOverflow),r=i.container,a=i.overflow,s=Number((t.target.scrollTop/(a.y-r.y)).toFixed(2));e(n,"--evg-scroller-y",Number((t.target.scrollTop/a.y).toFixed(2))*r.y+"px"),this.onScrollDetectPosition(s)},n.prototype.onStart=function(t){var e=this,n=e.scrollContainer,r=e.scrollOverflow;e.isTouchTrack;var a=t.nowY,s=i(o(n,r)).y;if(a<this.prevNowY||a>this.prevNowY+s){var c=s/2;this.prevNowY=a-c,this.calcPosition(this.prevNowY)}},n.prototype.onMoveY=function(t){this.prevNowY+=t.deltaY,this.calcPosition(this.prevNowY)},n.prototype.onMoveEnd=function(){this.isTouchTrack=!1},n.prototype.onScrollDetectPosition=function(t){this.onUpdate&&this.onUpdate(100*t)},n}();function o(t,e){return{container:{x:t.offsetWidth,y:t.offsetHeight},overflow:{x:e.scrollWidth,y:e.scrollHeight}}}function i(t){var e=t.container,n=t.overflow;return{x:e.x/n.x*e.x,y:e.y/n.y*e.y}}function r(t,n){var r=o(t,n),a=!1;r.container.y<r.overflow.y&&(a=!0),e(t,"--evg-scroller-size-y",i(r).y+"px"),e(t,"--evg-scroller-show",a?"block":"none")}function a(t){var e=document.createElement(t.type);return e.className=t.className.join(" "),e.classList.add("button"),e.addEventListener("click",t.onClick),t.children&&(e.innerHTML=t.children),e}var s=function(){function t(t,e){this.children=t,this.changeTabIndex=e,this.tabs=document.createElement("div"),this.tabsZone=document.createElement("div"),this.tabPanel=document.createElement("div"),this.mapTabsCoord=new Map,this.indexActiveTab=0,this.prevIndexActiveTab=0}return t.prototype.create=function(){var t=this,e=this,n=e.tabs,o=e.tabsZone,i=e.tabPanel,r=e.children;return n.className="tabs",o.className="tabs_zone",i.className="tabs_panel",r.forEach((function(e,n){e.tabContent.classList.add("tab");var r=e.tabContent.offsetWidth*(n+1);t.mapTabsCoord.set(n,r);var s=a({type:"button",className:["tab_button",t.indexActiveTab===n?"tab_button_active":""],children:e.button,onClick:function(){return t.setIndexActiveTab(n)}});s.setAttribute("data-index",""+n),i.append(s),o.append(e.tabContent)})),n.append(o,i),n},t.prototype.setIndexActiveTab=function(t){var n=0;this.prevIndexActiveTab!==t&&t<=this.children.length-1&&(this.tabPanel.childNodes.forEach((function(e){var n=e;n.dataset.index&&(Number(n.dataset.index)===t?n.classList.add("tab_button_active"):n.classList.remove("tab_button_active"))})),this.prevIndexActiveTab=t,n=this.children[t].tabContent.getBoundingClientRect().width*t,e(this.tabsZone,"--evg-tabs-zone-shift-x",-n+"px"),this.changeTabIndex&&this.changeTabIndex(t))},t.prototype.onChangeTabIndex=function(t){this.prevIndexActiveTab=t,this.changeTabIndex&&this.changeTabIndex(t)},t}();function c(t,e){void 0===e&&(e="full");var n=encodeURIComponent(t.replace(/\uFE0F/giu,"")).replace(/%/gi,"").toLowerCase(),o=document.createElement("full"===e?"i":"img");if("mini"===e)return o.className="emoji",o.setAttribute("src","/emoji/e/"+n+".png"),o;o.className="emoji @"+n;var i=document.createElement("div");return i.setAttribute("data-hex",n),i.setAttribute("data-utf8",t),i.className="item_cont",i.append(o),i}var u="(?:"+Array.from([]).concat("[\\u2700-\\u27bf]","(?:\\ud83c[\\udde6-\\uddff]){2}","[\\ud800-\\udbff][\\udc00-\\udfff]","[\\u0023\\u002a\\u0030-\\u0039]\\ufe0f?\\u20e3",["\\u3299","\\u3297"],["\\u303d","\\u3030"],["\\u24c2"],["\\ud83c[\\udd70-\\udd71]","\\ud83c[\\udd7e-\\udd7f]","\\ud83c\\udd8e","\\ud83c[\\udd91-\\udd9a]","\\ud83c[\\udde6-\\uddff]"],["[\\ud83c\\ude01-\\ude02]","\\ud83c\\ude1a","\\ud83c\\ude2f","[\\ud83c\\ude32-\\ude3a]","[\\ud83c\\ude50-\\ude51]"],["\\u203c","\\u2049"],["[\\u25aa-\\u25ab]","\\u25b6","\\u25c0","[\\u25fb-\\u25fe]"],["\\u00a9","\\u00ae"],["\\u2122","\\u2139"],["\\ud83c\\udc04"],"[\\u2600-\\u26FF]",["\\u2b05","\\u2b06","\\u2b07","\\u2b1b","\\u2b1c","\\u2b50","\\u2b55"],["\\u231a","\\u231b","\\u2328","\\u23cf","[\\u23e9-\\u23f3]","[\\u23f8-\\u23fa]"],["\\ud83c\\udccf"],["\\u2934","\\u2935"],["[\\u2190-\\u21ff]"]).join("|")+")";function l(t){var e=[];return t.childNodes.forEach((function(t){var n;e.push({content:t.textContent,type:3===t.nodeType?"text":8===t.nodeType?"comment":t.nodeName.toLowerCase(),atts:1!==t.nodeType?[]:(n=t.attributes,Array.prototype.map.call(n,(function(t){return{att:t.name,value:t.value}}))),node:t,children:l(t)})})),e}function d(t,e,n){var o;console.log("diff start:",t,e);var i=e.length-t.length;if(console.log("diff count:",i),i>0)for(console.log("diff remove лишнее:");i>0;i--)null===(o=e[e.length-i].node.parentNode)||void 0===o||o.removeChild(e[e.length-i].node);t.forEach((function(o,i){var r;if(!e[i])return console.log("diff: add ",t[i]),void n.appendChild(h(t[i]));if(t[i].type!==e[i].type)return console.log("diff: update ",t[i]),void(null===(r=e[i].node.parentNode)||void 0===r||r.replaceChild(h(t[i]),e[i].node));if(t[i].content!==e[i].content)return console.log("diff: update content ",e[i].node.textContent,"->",t[i].content),void(e[i].node.textContent=t[i].content);if(e[i].children&&o.children){var a=document.createDocumentFragment();return d(o.children,e[i].children,a),void n.appendChild(a)}o.children&&(console.log("diff: diff -> diff child "),e[i].children&&d(o.children,e[i].children,e[i].node))})),console.log("diff end:",t,e,l(n))}function h(t){var e,n,o;return e="text"===t.type?document.createTextNode(t.content):document.createElement(t.type),n=e,(o=t.atts)&&o.forEach((function(t){"class"===t.att?n.className=t.value:n.setAttribute(t.att,t.value)})),t.children?t.children.forEach((function(t){e.appendChild(h(t))})):"text"!==t.type&&(e.textContent=t.content),e}Array.from([]).concat("(^|s)https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)","(^|s)(#[a-zd-]+)","(^|s)(@[a-zd-]+)","S+@S+.S+").join("|");var v=function(){function t(t,e,n){void 0===t&&(t="placeholder"),this.placeholder=t,this.actionElement=e,this.onChangeInput=n,this.value="",this.textFieldBase=document.createElement("div"),this.textFieldInput=document.createElement("div"),this.selectTargetNode=document.createElement("div"),this.saveRange=new Range,this.selectStart=0,this.selectEnd=0}return t.prototype.setValue=function(t){t!==this.value&&(this.value=t,this.textFieldInput.innerHTML=t)},t.prototype.onFocus=function(){this.textFieldInput.focus()},t.prototype.create=function(){var t=this,e=this,o=e.textFieldBase,i=e.textFieldInput,r=e.actionElement;o.className="textField_base",i.className="textField_input",i.setAttribute("contenteditable","true"),i.setAttribute("role","textbox"),i.setAttribute("placeholder",this.placeholder);var a=new n(i);return r instanceof HTMLElement&&(r.classList.add("textField_icon-button"),o.append(r)),o.append(a.create()),i.addEventListener("paste",(function(e){var n,o;e.preventDefault();var i,r,a,s=(null===(n=e.clipboardData)||void 0===n?void 0:n.getData("text/html"))||(null===(o=e.clipboardData)||void 0===o?void 0:o.getData("text/plain"));if(s){var c=f(s);i=/<[^>]+>/gim,r=/(style="[^"]*")/gim,a=/(<img class="emoji" src=".*" >)|(<br\/?>)/gim,c=c.replace(r,"").replace(i,(function(t){return t.match(a)?t:""})).replace(/\n/g,""),c=t.emojiDetect(c),document.execCommand("insertHTML",!1,c)}})),document.addEventListener("selectionchange",(function(){return t.detectAndSaveRange()})),new MutationObserver((function(e){return t.highlightRealTime(e)})).observe(i,{childList:!0,characterData:!0,characterDataOldValue:!0,subtree:!0}),o},t.prototype.addEmoji=function(t){this.addContentInRange(c(t,"mini"))},t.prototype.addContentInRange=function(t){var e=window.getSelection()||document.getSelection();this.saveRange.startOffset!==this.saveRange.endOffset&&this.saveRange.deleteContents(),this.saveRange.insertNode(t),this.saveRange.collapse(!1),null==e||e.addRange(this.saveRange)},t.prototype.emojiDetect=function(t){var e=new RegExp(u,"g");return(t=t.replace(/\uFE0F/giu,"")).replace(e,(function(t){return c(t,"mini").outerHTML}))},t.prototype.restore=function(){this.saveRange.selectNodeContents(this.textFieldInput),this.saveRange.collapse(!1);var t=window.getSelection()||document.getSelection();null==t||t.removeAllRanges(),null==t||t.addRange(this.saveRange)},t.prototype.detectAndSaveRange=function(){var t,e=window.getSelection()||document.getSelection();e&&e.anchorNode&&("textField_input"!==e.anchorNode.className&&"textField_input"!==(null===(t=e.anchorNode)||void 0===t?void 0:t.parentNode).className||(this.saveRange=e.getRangeAt(0)))},t.prototype.highlightRealTime=function(t){var e=this.textFieldInput.innerHTML;if("<br>"===this.textFieldInput.innerHTML)return this.textFieldInput.innerHTML="",void(this.onChangeInput&&this.onChangeInput(""));var n,o=f(e);if(console.log("diffText",e,o),e!==o){console.log("[highlightRealTime] что-то поменялось заменяем"),console.log("[highlightRealTime] alltext:",e),console.log("[highlightRealTime] cleantText:",o);var i=l(this.textFieldInput);d(l((n=o,(new DOMParser).parseFromString(n,"text/html").body)),i,this.textFieldInput),this.restore()}this.onChangeInput&&this.onChangeInput(o)},t}();function f(t){return t.replace(/(^|\s)https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,(function(t,e){return"<a>"+e+"</a> "})).replace(/\S+@\S+\.\S+/gi,(function(t,e){return"<a>"+e+"</a> "})).replace(/(@[A-Za-z0-9]*\b)[\s]/gi,(function(t,e){return"<a>"+e+"</a> "})).replace(/(#[A-Za-z0-9]*\b)[\s]/gi,(function(t,e){return"<a>"+e+"</a> "}))}var p=function(){function t(t,e){this.children=t,this.onClick=e,this.list=document.createElement("div")}return t.prototype.create=function(){var t=this,e=this.list,n=this.children;return e.className="list",e.append.apply(e,this.buildItems(n)),e.addEventListener("click",(function(e){var n=e.target;"item_cont"===n.className&&t.onClick(n.dataset.utf8)})),e},t.prototype.buildItems=function(t){var e=[];return t.forEach((function(t){var n=document.createElement("div");n.className="row_title",n.innerText=t.title,e.push(n),function(t,e){for(var n=[],o=0;o<Math.ceil(t.length/e);o++)n[o]=t.slice(o*e,o*e+e);return n}(t.items,10).forEach((function(t){var n=document.createElement("div");n.className="row_items";var o=t.map((function(t){return c(t)}));n.append.apply(n,o),e.push(n)}))})),e},t.prototype.updateList=function(t){var e;(e=this.list).append.apply(e,this.buildItems(t))},t.prototype.newList=function(t){var e;this.list.innerHTML="",(e=this.list).append.apply(e,this.buildItems(t))},t}(),m='\n<svg width="20px" height="20px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <title>smile_24</title>\n    <desc>Created with Sketch.</desc>\n    <defs></defs>\n    <g id="Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <g id="smile_24">\n            <rect id="Bounds" x="0" y="0" width="16" height="16"></rect>\n            <path d="M0,8 C0,3.581722 3.581722,0 8,0 C12.418278,0 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 C3.581722,16 0,12.418278 0,8 Z M14.5,8 C14.5,4.41014913 11.5898509,1.5 8,1.5 C4.41014913,1.5 1.5,4.41014913 1.5,8 C1.5,11.5898509 4.41014913,14.5 8,14.5 C11.5898509,14.5 14.5,11.5898509 14.5,8 Z M5.375,7.50268555 C4.75367966,7.50268555 4.25,6.99900589 4.25,6.37768555 C4.25,5.7563652 4.75367966,5.25268555 5.375,5.25268555 C5.99632034,5.25268555 6.5,5.7563652 6.5,6.37768555 C6.5,6.99900589 5.99632034,7.50268555 5.375,7.50268555 Z M10.625,7.50268555 C10.0036797,7.50268555 9.5,6.99900589 9.5,6.37768555 C9.5,5.7563652 9.99867477,5.25268555 10.6199951,5.25268555 C11.2413155,5.25268555 11.75,5.7563652 11.75,6.37768555 C11.75,6.99900589 11.2463203,7.50268555 10.625,7.50268555 Z M4.42474485,10.5502898 C4.18388135,10.2133066 4.26180174,9.74486934 4.5987849,9.50400585 C4.93576806,9.26314235 5.40420534,9.34106274 5.64506883,9.6780459 C5.73744915,9.80729177 5.84100377,9.92953535 5.9553107,10.0438423 C7.08250582,11.1710374 8.91005019,11.1710374 10.0372453,10.0438423 C10.1516961,9.9293915 10.2553674,9.80698414 10.3478357,9.67755825 C10.5886289,9.34052489 11.0570499,9.26250686 11.3940833,9.50330011 C11.7311166,9.74409336 11.8091347,10.2125144 11.5683414,10.5495477 C11.4279227,10.7460889 11.2707985,10.9316094 11.0979055,11.1045024 C9.38492392,12.817484 6.60763208,12.817484 4.89465053,11.1045024 C4.72197534,10.9318273 4.56502905,10.7465562 4.42474485,10.5502898 Z" id="Mask" fill="currentColor" fill-rule="nonzero"></path>\n        </g>\n    </g>\n</svg>\n'.trim(),g='\n<svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM8 16A8 8 0 108 0a8 8 0 000 16z" fill="currentColor"/>\n    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.65 11.085a.75.75 0 01-1.006.336l-2.5-1.25A.75.75 0 016.73 9.5V5.25a.75.75 0 011.5 0v3.786l2.085 1.043a.75.75 0 01.335 1.006z" fill="currentColor"/>\n</svg>\n'.trim(),b=function(){return(b=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},w=function(){function t(t){this.state=t,this.listeners=[]}return t.prototype.init=function(t){this.state=b(b({},this.state),t)},t.prototype.getState=function(){return this.state},t.prototype.subscribe=function(t){this.listeners.push(t)},t.prototype.setState=function(t){var e=[b({},this.state),t(this.state)],n=e[0],o=e[1];this.state=t(this.state),this.listeners.forEach((function(t){return t(n,o)}))},t}(),y=function(){function t(t){this.emojisDB=t}return t.prototype.getNextCursor=function(t){return t+1<=this.emojisDB.length?t+1:-1},t.prototype.getEmojis=function(t){var e=this.getNextCursor(t);return-1!==e?{cursor:t,nextCursor:e,emojis:this.emojisDB[t]}:{cursor:t,nextCursor:e}},t}();function x(t){document.body.setAttribute("scheme",t)}function C(t){return Array.from(t.keys()).sort((function(e,n){return t.get(n)-t.get(e)}))}var E,T="EVG-STATE",S=function(){return(S=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)},N=new w({activeTabIndex:0,inputText:"",favorites:new Map,favoritesCount:0,showEmoji:!1,cursor:0,emojis:[],theme:"light"}),I=function(){try{var t=localStorage.getItem(T);if(null===t)return;return JSON.parse(t)}catch(t){return}}();I&&N.init(S(S({},I),{favorites:new Map(I.favorites.map((function(t){return[t[0],t[1]]})))})),null===(E=N.getState())||void 0===E||E.activeTabIndex,N.subscribe((function(t,e){(function(t){try{var e=JSON.stringify(t);localStorage.setItem(T,e)}catch(t){console.log("[saveState] error: "+t)}})({activeTabIndex:e.activeTabIndex,theme:e.theme,inputText:e.inputText,favoritesCount:e.favoritesCount,favorites:Array.from(e.favorites.entries())}),t.activeTabIndex,e.activeTabIndex;t.favoritesCount!==e.favoritesCount&&O.newList([{title:"Часто используемые",items:C(e.favorites)}]);t.inputText,e.inputText;t.showEmoji,e.showEmoji;t.cursor!==e.cursor&&-1!==e.cursor&&k.updateList(e.emojis);t.theme!==e.theme&&(X.classList.toggle("btn-theme-"+t.theme),X.classList.toggle("btn-theme-"+e.theme))}));var M=new y([{title:"Эмоции",items:["😀","😃","😄","😁","😅","😆","😂","🤣","😉","😊","☺","🙂","🙃","😇","😗","😙","😚","😘","😍","🥰","🤩","🤗","😋","😜","🤪","😛","😝","🤑","🤭","🤐","🤫","😶","🤔","🤨","🧐","😐","😑","🙄","😬","🤥","😏","😌","🤤","😴","🤓","😎","🥳","🤠","😒","😔","😪","😕","😟","🙁","☹","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","😷","🤒","🤕","🤢","🤮","🤧","🥶","🥵","🥴","😵","🤯","😤","😠","😡","🤬","😈","👿","💀","☠","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","🙈","🙉","🙊","🦠"]},{title:"Жесты и люди",items:["👍","👎","👌","✌","🤞","🤟","🤘","🤙","🖕","✊","👊","🤛","🤜","👈","👉","👆","👇","☝","👋","🤚","🖐","✋","🖖","👏","🙌","👐","🤲","🤝🏻","🙏","💪","🦵","🦶","👂","👃","🧠","🦷","🦴","👀","👁","👅","👄","✍","💅","🤳","👫","👭","👬","👩‍❤️‍💋‍👨","👨‍❤️‍💋‍👨","👩‍❤️‍💋‍👩","👩‍❤️‍👨","👨‍❤️‍👨","👩‍❤️‍👩","👪","👶","🧒","👦","👧","🧑","👱","👨","🧔","👱‍♂️","👨‍🦰","👨‍🦱","👨‍🦳","👨‍🦲","👩","👱‍♀️","👩‍🦰","👩‍🦱","👩‍🦳","👩‍🦲","🧓️","👴️","👵️","🙍‍♂️️","🙍‍♀️️","🙎‍♂️","🙎‍♀️️","🙅‍♂️","🙅‍♀️","🙆‍♂️","🙆‍♀️","💁‍♂️","💁‍♀️️","🙋‍♂️","🙋‍♀️️","🙇‍♂️","🙇‍♀️️","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","💆‍♂️️","💆‍♀️","💇‍♂️️","💇‍♀️","🚶‍♂️️","🚶‍♀️️","🏃‍♂️️","🏃‍♀️","💃","🕺","🕴️","👯‍♂️️","👯‍♀️","🧖‍♂️","🧖‍♀️️","👼","🎅","🤶","🦸‍♂️","🦸‍♀️","🦹‍♂️","🦹‍♀️","🧙‍♂️","🧙‍♀️","🧚‍♂️","🧚‍♀️","🧛‍♂️","🧛‍♀️","🧜‍♂️","🧜‍♀️","🧝‍♂️","🧝‍♀️","🧞‍♂️","🧞‍♀️","🧟‍♂️","🧟‍♀️","👨‍⚕️","👩‍⚕️","👨‍🎓","👩‍🎓","👨‍🏫","👩‍🏫","👨‍⚖️","👩‍⚖️","👨‍🌾","👩‍🌾","👨‍🍳","👩‍🍳","👨‍🔧","👩‍🔧","👨‍🏭","👩‍🏭","👨‍💼","👩‍💼","👨‍🔬","👩‍🔬","👨‍💻","👩‍💻","👨‍🎤","👩‍🎤","👨‍🎨","👩‍🎨","👨‍✈️","👩‍✈️","👨‍🚀","👩‍🚀","👨‍🚒","👩‍🚒","👮‍♂️","👮‍♀️","🕵️‍♂️","🕵️‍♀️","💂‍♂️","💂‍♀️","👷‍♂️","👷‍♀️","🤴","👸","👳‍♂️","👳‍♀️","👲","🧕","🤵","👰","🤰","🤱","🛀","🛌"]},{title:"Символы",items:["💋","❤","💔","❣","💘","💝","💖","💗","💓","💞","💕","💟","💜","🧡","💛","💚","💙","🖤","💯","💢","💥","💫","🕳","💣","💬","👁️‍🗨️","🗨","🗯","💭","💤","🗣","👤","👥","👣","🔇","🔊","📢","📣","🔔","🔕","🎼","🎵","🎶","⚠","🚸","☢","☣","🆚","🆓","🆕","🚮","🚾","🚭","✅","♻","⚕","🔱","‼","⁉","❓","❗","🆘","⛔","🚫","🚳","🚯","🚱","🚷","📵","🔞"]},{title:"Животные и растения",items:["🐵","🐒","🦍","🐶","🐕","🐩","🐺","🦊","🦝","🐱","🐈","🦁","🐯","🐅","🐆","🐴","🐎","🦄","🦓","🦌","🐮","🐂","🐃","🐄","🐷","🐽","🐖","🐗","🐏","🐑","🐐","🐪","🐫","🦙","🦒","🐘","🦏","🦛","🐭","🐁","🐀","🐹","🐰","🐇","🐿","🦔","🦇","🐻","🐨","🐼","🦘","🦡","🐾","🦃","🐔","🐓","🐣","🐤","🐥","🐦","🐧","🕊","🦅","🦆","🦢","🦉","🦚","🦜","🐸","🐊","🐢","🦎","🐍","🐲","🐉","🦕","🦖","🐳","🐋","🐬","🐟","🐠","🐡","🦈","🐙","🦀","🦞","🦐","🦑","🐚","🐌","🦋","🐛","🐜","🐝","🐞","🦗","🕷","🕸","🦂","🦟","💐","🌸","💮","🏵","🌹","🥀","🌺","🌻","🌼","🌷","🌳","🌲","🎄","🌴","🌵","🌾","🌱","🌿","☘","🍀","🍁","🍂","🍃","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","🌡","☀","🌝","🌞","⭐","🌟","🌠","☁","⛅","⛈","🌤","🌥","🌦","🌧","🌨","🌩","🌪","🌫","🌬","💨","🌀","🌈","🌂","☂","☔","⛱","⚡","❄","☃","⛄","☄","🔥","💦","💧","🌊"]},{title:"Еда и напитки",items:["🍏","🍎","🍐","🍅","🥝","🍑","🍒","🍓","🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🥥","🥑","🍆","🥔","🥕","🌽","🌶","🥒","🥬","🥦","🍄","🥜","🌰","🍞","🥐","🥖","🥨","🥯","🥞","🧀","🍖","🍗","🥩","🥓","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🥙","🥚","🍳","🥘","🍲","🥣","🥗","🍿","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🍵","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🥤","🥢","🍽","🍴","🥄"]},{title:"Спорт и активности",items:["⚽","⚾","🥎","🏀","🏐","🏈","🏉","🎾","🥏","🎳","🏏","🏑","🏒","🥍","🏓","🏸","🥊","🥋","🥅","⛳","⛸","🎣","🎽","🛹","🎿","🛷","🥌","🎯","🎱","🎮","🕹","🎰","🎲","🧩","♟","🧗‍♂️️","🧗‍♀️","🤺","🏇","⛷","🏂","🏌️‍♂️","🏌️‍♀️","🏄‍♂️","🏄‍♀️","🚣‍♂️","🚣‍♀️","🏊‍♂️","🏊‍♀️","⛹️‍♂️","⛹️‍♀️","🏋️‍♂️","🏋️‍♀️","🚴‍♂️","🚴‍♀️","🚵‍♂️","🚵‍♀️","🤸","🤼‍♂️","🤼‍♀️","🤽‍♂️","🤽‍♀️","🤾‍♂️","🤾‍♀️","🤹‍♂️","🤹‍♀️","🧘‍♂️","🧘‍♀️","🎖","🏆","🏅","🥇","🥈","🥉"]},{title:"Путешествия и транспорт",items:["🚂","🚃","🚄","🚅","🚆","🚇","🚈","🚉","🚊","🚝","🚞","🚋","🚌","🚍","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🚚","🚛","🚜","🏎","🏍","🛵","🚲","🛴","🚏","🛣","🛤","🛢","⛽","🚨","🚥","🚦","🛑","🚧","⚓","⛵","🛶","🚤","🛳","⛴","🛥","🚢","✈","🛩","🛫","🛬","💺","🚁","🚟","🚠","🚡","🛰","🚀","🛸","🌍","🌎","🌏","🌐","🗺","🗾","🧭","🏔","⛰","🌋","🗻","🏕","🏖","🏜","🏝","🏞","🏟","🏛","🏗","🧱","🏘","🏚","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🕍","⛩","🕋","⛲","⛺","🌁","🌃","🏙","🌄","🌅","🌆","🌇","🌉","♨","🌌","🎠","🎡","🎢","💈","🎪"]},{title:"Предметы",items:["🎙","🎚","🎛","🎤","🎧","📻","🎷","🎸","🎹","🎺","🎻","🥁","📯","🎭","🖼","🎨","🧵","🧶","🔮","🧿","🧸","🃏","🀄","🎴","🎃","🎆","🎇","🧨","✨","🎈","🎉","🎊","🎋","🎍","🎎","🎏","🎐","🎑","🧧","🎀","🎁","🎗","🎟","🎫","🛎","🧳","⌛","⏳","⌚","⏰","⏱","⏲","🕰","👓","🕶","🥽","🥼","👔","👕","👖","🧣","🧤","🧥","🧦","👗","👘","👙","👚","👛","👜","👝","🛍","🎒","👞","👟","🥾","🥿","👠","👡","👢","👑","👒","🎩","🎓","🧢","⛑","📿","💄","💍","💎","📱","📲","☎","📞","📟","📠","🔋","🔌","💻","🖥","🖨","⌨","🖱","🖲","💽","💾","💿","📀","🧮","🎥","🎞","📽","🎬","📺","📷","📸","📹","📼","🔍","🔎","🕯","💡","🔦","🏮","📔","📕","📖","📗","📘","📙","📚","📓","📒","📃","📜","📄","📰","🗞","📑","🔖","🏷","💰","💴","💵","💶","💷","💸","💳","🧾","💹","💱","💲","✉","💌","📧","📨","📩","📤","📥","📦","📫","📪","📬","📭","📮","🗳","✏","✒","🖋","🖊","🖌","🖍","📝","💼","📁","📂","🗂","📅","📆","🗒","🗓","📇","📈","📉","📊","📋","📌","📍","📎","🖇","📏","📐","✂","🗃","🗄","🗑","🔒","🔓","🔏","🔐","🔑","🗝","🔨","⛏","⚒","🛠","🗡","⚔","🔪","🔫","🏹","🛡","🔧","🔩","⚙","🗜","⚖","🔗","⛓","🧰","🧲","⚗","🧪","🧫","🧬","🔬","🔭","📡","💉","💊","🚪","🛏","🛋","🚽","🚿","🛁","🧴","🧷","🧹","🧺","🧻","🧼","🧽","🧯","🛒","🚬","⚰","⚱","🏺","🗿"]},{title:"Флаги",items:["🇷🇺","🇰🇿","🇧🇾","🇺🇦","🇲🇳","🇬🇪","🇦🇿","🇹🇯","🇧🇷","🇱🇹","🇱🇻","🇪🇪","🇦🇲","🏁","🚩","🎌","🏴","🏳","🏳️‍🌈","🏴‍☠️","🇦🇨","🇦🇩","🇦🇪","🇦🇫","🇦🇬","🇦🇮","🇦🇱","🇦🇴","🇦🇶","🇦🇷","🇦🇸","🇦🇹","🇦🇺","🇦🇼","🇦🇽","🇧🇦","🇧🇧","🇧🇩","🇧🇪","🇧🇫","🇧🇬","🇧🇭","🇧🇮","🇧🇯","🇧🇱","🇧🇲","🇧🇳","🇧🇴","🇧🇶","🇧🇸","🇧🇹","🇧🇻","🇧🇼","🇧🇿","🇨🇦","🇨🇨","🇨🇩","🇨🇫","🇨🇬","🇨🇭","🇨🇮","🇨🇰","🇨🇱","🇨🇲","🇨🇳","🇨🇴","🇨🇵","🇨🇷","🇨🇺","🇨🇻","🇨🇼","🇨🇽","🇨🇾","🇨🇿","🇩🇪","🇩🇬","🇩🇯","🇩🇰","🇩🇲","🇩🇴","🇩🇿","🇪🇨","🇪🇬","🇪🇭","🇪🇷","🇪🇸","🇪🇹","🇪🇺","🇫🇮","🇫🇯","🇫🇰","🇫🇲","🇫🇴","🇫🇷","🇬🇦","🇬🇧","🇬🇩","🇬🇫","🇬🇬","🇬🇭","🇬🇮","🇬🇱","🇬🇲","🇬🇳","🇬🇵","🇬🇶","🇬🇷","🇬🇸","🇬🇹","🇬🇺","🇬🇼","🇬🇾","🇭🇰","🇭🇲","🇭🇳","🇭🇷","🇭🇹","🇭🇺","🇮🇨","🇮🇩","🇮🇪","🇮🇱","🇮🇲","🇮🇳","🇮🇴","🇮🇶","🇮🇷","🇮🇸","🇮🇹","🇯🇪","🇯🇲","🇯🇴","🇯🇵","🇰🇪","🇰🇬","🇰🇭","🇰🇮","🇰🇲","🇰🇳","🇰🇵","🇰🇷","🇰🇼","🇰🇾","🇱🇦","🇱🇧","🇱🇨","🇱🇮","🇱🇰","🇱🇷","🇱🇸","🇱🇺","🇱🇾","🇲🇦","🇲🇨","🇲🇩","🇲🇪","🇲🇫","🇲🇬","🇲🇭","🇲🇰","🇲🇱","🇲🇲","🇲🇴","🇲🇵","🇲🇶","🇲🇷","🇲🇸","🇲🇹","🇲🇺","🇲🇻","🇲🇼","🇲🇽","🇲🇾","🇲🇿","🇳🇦","🇳🇨","🇳🇪","🇳🇫","🇳🇬","🇳🇮","🇳🇱","🇳🇴","🇳🇵","🇳🇷","🇳🇺","🇳🇿","🇴🇲","🇵🇦","🇵🇪","🇵🇫","🇵🇬","🇵🇭","🇵🇰","🇵🇱","🇵🇲","🇵🇳","🇵🇷","🇵🇸","🇵🇹","🇵🇼","🇵🇾","🇶🇦","🇷🇪","🇷🇴","🇷🇸","🇷🇼","🇸🇦","🇸🇧","🇸🇨","🇸🇩","🇸🇪","🇸🇬","🇸🇭","🇸🇮","🇸🇯","🇸🇰","🇸🇱","🇸🇲","🇸🇳","🇸🇴","🇸🇷","🇸🇸","🇸🇹","🇸🇻","🇸🇽","🇸🇾","🇸🇿","🇹🇦","🇹🇨","🇹🇩","🇹🇫","🇹🇬","🇹🇭","🇹🇰","🇹🇱","🇹🇲","🇹🇳","🇹🇴","🇹🇷","🇹🇹","🇹🇻","🇹🇼","🇹🇿","🇺🇬","🇺🇲","🇺🇳","🇺🇸","🇺🇾","🇺🇿","🇻🇦","🇻🇨","🇻🇪","🇻🇬","🇻🇮","🇻🇳","🇻🇺","🇼🇫","🇼🇸","🇽🇰","🇾🇪","🇾🇹","🇿🇦","🇿🇲","🇿🇼"]}]),L=document.getElementById("root"),A=document.createElement("div");A.className="container";var j=document.createElement("div");j.className="emoji-container emoji-container-hidden";var Y=document.createElement("div");Y.className="emoji-container-tail";var R,F,k=new p(N.getState().emojis,P),O=new p([{title:"Часто используемые",items:C(N.getState().favorites)}],P),D=(R=[{list:k.create(),callbackScroll:function(t){t>90&&B()},buttunIcon:m},{list:O.create(),buttunIcon:g}],F=R.map((function(t){return{tabContent:new n(t.list,t.callbackScroll).create(),button:t.buttunIcon}})),new s(F)),_=a({type:"div",className:["icon-button"],children:m,onClick:function(){j.classList.toggle("emoji-container-hidden")}}),X=a({type:"div",className:["btn-theme","btn-theme-"+Z()],onClick:function(){var t="dark"===Z()?"light":"dark";x(t),N.setState((function(e){return S(S({},e),{theme:t})}))}}),z=new v("Ваше сообщение",_,H);function Z(){return"light"===N.getState().theme?"light":"dark"}function P(t){if(t){z.addEmoji(t);var e=N.getState().favorites.get(t);N.setState((function(n){return S(S({},n),{favorites:n.favorites.set(t,(e||0)+1),favoritesCount:n.favoritesCount+1})}))}}function B(){var t=N.getState().cursor;if(-1!==t){var e=M.getEmojis(t);N.setState((function(t){return S(S({},t),{cursor:e.nextCursor,emojis:[e.emojis]})}))}}function H(t){N.setState((function(e){return S(S({},e),{inputText:t})}))}z.setValue(N.getState().inputText),j.append(D.create(),Y),A.append(j,z.create()),null==L||L.append(A,X),z.onFocus(),B(),x(N.getState().theme)}));
