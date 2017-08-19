const electron=require("electron");
const {app,shell,globalShortcut}=electron;

let win;
app.on("ready",()=>{
	win=new electron.BrowserWindow({
		title:"TweetDeck",
		webPreferences:{
			nodeIntegration:false,
            preload:__dirname+"/preload.js"
		}
	});
	win.setMenu(null);
	win.on("closed",()=>{
		win=null;
	});
	globalShortcut.register("F5",()=>{
		win.webContents.reload();
	});
	globalShortcut.register("CommandOrControl+F5",()=>{
		win.webContents.reloadIgnoringCache();
	});
	win.loadURL("https://tweetdeck.twitter.com/");
	win.webContents.on("did-finish-load",()=>{
		win.webContents.insertCSS("::-webkit-scrollbar{width:4px!important;height:4px!important;}");
	});
	win.webContents.on("did-get-redirect-request",(e,o,n,w,c,m,r,h)=>{
		if(w){
			setTimeout(()=>win.webContents.send("redirect-url",n),10);
			e.preventDefault();
		}
	});
	win.webContents.on("new-window",(e,url)=>{
		e.preventDefault();
		shell.openExternal(url);
	});
});

app.on("window-all-closed",()=>{
	app.quit();
});
