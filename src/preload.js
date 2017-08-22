const electron=require("electron");
const {ipcRenderer,remote,clipboard,shell}=electron;
const {Menu,MenuItem}=remote;

ipcRenderer.on("redirect-url",(e,url)=>{
    window.location.assign(url);
});

window.addEventListener("contextmenu",e=>{
	e.preventDefault();
	var menu=new Menu();
	if(e.target.tagName=="A"&&e.target.href){
		menu.append(new MenuItem({label:"ブラウザで開く (&B)",click(){shell.openExternal(e.target.href);}}));
		menu.append(new MenuItem({label:"リンクアドレスをコピー (&E)",click(){clipboard.writeText(e.target.href);}}));
		menu.append(new MenuItem({type:"separator"}));
	}
	var str=window.getSelection().toString().replace(/^\s+|\s+$/g,"").replace(/ +/g," ");
	if(str){
		menu.append(new MenuItem({label:"コピー (&C)",role:"copy",accelerator:"CommandOrControl+C"}));
		menu.append(new MenuItem({label:"\""+str+"\" をWeb検索 (&S)",click(){shell.openExternal("https://www.google.co.jp/search?q="+encodeURIComponent(str));}}));
		menu.append(new MenuItem({type:"separator"}));
	}
	menu.append(new MenuItem({label:"再読み込み (&R)",role:"reload",accelerator:"F5"}));
	menu.append(new MenuItem({label:"コンソール (&C)",role:"toggledevtools"}));
	menu.popup(remote.getCurrentWindow());
});

window.addEventListener("DOMContentLoaded",()=>{
	var observer=new MutationObserver(recs=>{
		recs.forEach(rec=>{
			rec.addedNodes.forEach(node=>{
				if(node.nodeType!==1)return;
				var elems=node.querySelectorAll("[data-full-url]");
				elems.forEach(elem=>{
					if(!elem.href||!elem.href.indexOf("://t.co")<0)return;
					elem.href=elem.dataset.fullUrl;
				});
			});
		});
	});
	observer.observe(window.document,{childList:true,subtree:true});
});

window.addEventListener("keydown",e=>{
	if(e.keyCode!=116)return;
	e.preventDefault();
	if(e.ctrlKey)ipcRenderer.send("reload-super");
	else ipcRenderer.send("reload-normal");
});
