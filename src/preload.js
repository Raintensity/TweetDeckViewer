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
