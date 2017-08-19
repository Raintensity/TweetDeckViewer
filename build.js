const fs=require("fs");
const packager=require("electron-packager");
const package=require("./package.json");
const name="TweetDeckViewer";

var embeded=Object.assign({},package);
delete embeded.devDependencies;
delete embeded.scripts;
embeded.main=package["main"].split("/").pop();
fs.writeFileSync("./src/package.json",JSON.stringify(embeded));
delete embeded;

packager({
	name:name,
	dir:"./src",
	out:"./dist/"+package["version"],
	icon:"./res/tweetdeck.ico",
	platform:"win32",
	arch:"x64",
	electronVersion:"1.7.5",
	overwrite:true,
	asar:true,
	appVersion:package["version"],
	appCopyright:"Copyright (C) 2017 "+package["author"]+".",
	win32metadata:{
		CompanyName:"USX.JP",
		FileDescription:name,
		OriginalFilename:name+".exe",
		ProductName:name,
		InternalName:name
	}
},(err,path)=>{
	if(err)console.log(err);
	console.log("Done: "+path);
	fs.unlinkSync("./src/package.json");
});
