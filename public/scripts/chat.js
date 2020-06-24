async function getName(){
  let response = await fetch("/getName");
  let out = await response.json();
  return out.name;
}
async function getEmails(){
  let response = await fetch("/getEmails");
  let out = await response.json();
  return out.data;
}
async function getNames(){
  let response = await fetch("/users");
  let out = await response.json();
  return out.data;
}
function nload(){
  formatPage();
  window.socket = io("/");
  (async ()=>{window.name = await getName()})();
  socket.on("successfulConnection", ()=>{
    socket.emit("updateOnline", name);
  });
  socket.on("receive",(data)=>{
    console.log("Received");
    updateDocument();
  });
  updateDocument();
  addOptions();
}
function processDate(date){
  let d = new Date(date);
  return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes()} ${d.getHours() > 12 ? "PM" : "AM"}`;
}
async function addOptions(){
  let names = ["Everyone",...(await getNames())];
  for(let i = 0; i < names.length; i++){
    let option = document.createElement("option");
    option.value = names[i];
    $("baddle").append(option);
  }
}
async function updateDocument(){
  $("messages-container")
  window.data = await getEmails();
  if(data.length == 0 || data == null){
    console.log("No mail!");
  } else {
    data = data.sort((a,b)=>(new Date(b.date).getTime() - new Date(a.date).getTime()));
    for(let i = 0; i < data.length; i++){
      $("messages-container").innerHTML += `<div class="msg-cont"><span class="sendnrecv"><a href="javascript:void(void(0));"  onclick='setUserTo(this)' class='user'>${data[i].from}</a> to <a href="javascript:void(0);" onclick="setUserTo(this)" class='user'>${data[i].to}</a>:</span><span class="date">${processDate(data[i].date)}</span><span class="message">${data[i].message}</span><hr></div>`;
    }
  }
}
function setUserTo(elem){
  if(elem.textContent == window.name){
    return;
  }
  $("to").value = elem.textContent;
}
function sendMsg(){
  event.preventDefault();
  console.log("Sent");
  socket.emit("send",{from:name,to:$("to").value,message:$("message").value,date:new Date()});
  return false;
}
window.addEventListener("load",nload());
