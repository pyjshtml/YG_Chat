const $ = id => document.getElementById(id);
window.onresize = function(){
  $("content").style.height = `${document.body.offsetHeight-document.querySelector('.title-bar').offsetHeight}px`;
}
window.formatPage = function(){
  if($("content")){
    $("content").style.height = `${document.body.offsetHeight-document.querySelector('.title-bar').offsetHeight}px`;
  }
}
window.addEventListener("load",formatPage);
