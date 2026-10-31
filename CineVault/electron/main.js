const {app,BrowserWindow,Menu}=require('electron');
const path=require('path');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
app.whenReady().then(()=>{
  Menu.setApplicationMenu(null);
  const w=new BrowserWindow({width:1280,height:800,backgroundColor:'#232220',title:'Cine Vault',webPreferences:{contextIsolation:true}});
  w.loadFile(path.join(__dirname,'..','web','index.html'));
});
app.on('window-all-closed',()=>app.quit());
