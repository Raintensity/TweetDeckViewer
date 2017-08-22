const electron=require("electron");
const {app,shell,ipcMain}=electron;

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
	ipcMain.on("reload-normal",()=>{
		win.webContents.reload();
	});
	ipcMain.on("reload-super",()=>{
		win.webContents.reloadIgnoringCache();
	});
	win.webContents.on("did-finish-load",()=>{
		win.webContents.insertCSS("::-webkit-scrollbar{width:4px!important;height:4px!important;}");
	});
	win.webContents.on("did-get-redirect-request",(e,o,n,w,c,m,r,h)=>{
		if(!w)return;
		setTimeout(()=>{
			win.webContents.send("redirect-url",n);
		},10);
		e.preventDefault();
	});
	win.webContents.on("new-window",(e,url)=>{
		e.preventDefault();
		shell.openExternal(url);
	});
	win.loadURL("https://tweetdeck.twitter.com/");
});

app.on("window-all-closed",()=>{
	app.quit();
});
