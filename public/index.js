/*
  Add to Makerlog
  Developed by @FredoGonzalezR
  https://twitter.com/FredoGonzalezR
*/
let token, task, log_btn, task_input, logout;
const api = 'https://api.getmakerlog.com/tasks/';
const uri = window.location.href;

task_input = document.querySelector('.task-input');
logout = document.querySelector('.logout-btn');
log_btn = document.querySelector('.add-btn');

task = decodeURI(uri.split('?task=')[1]);
token = (window.location.hash != '') ? window.location.hash.split('token=')[1].split('&')[0] : localStorage.getItem('token');

if(task != 'undefined') task_input.value = task.replace('%23','#');
/*
  If token hash is present in URL means user has granted access to Makerlog, save token in localStorage and clear hash.
*/
if(token != null && window.location.hash != ''){
  localStorage.setItem('token', token);
  if(localStorage.getItem('redirect') != 'undefined'){
    window.location.href = '/?task='+localStorage.getItem('redirect');
  }else{
    window.location.href = '/';
  }
}else{
  localStorage.setItem('redirect', uri.split('?task=')[1]);
}

/*
  Display "how to" section.
*/
let how_to = 1;
document.querySelector('.how-to-btn').addEventListener('click', e => {
  e.preventDefault();
  if(how_to){
    document.querySelector('.how-to').style.display='block';
    how_to = 0;
  }else{
    document.querySelector('.how-to').style.display='none';
    how_to = 1;
  }
})

/*
  User is logged in,
*/
if(localStorage.getItem('token') != null){  
  
  logout.style.display = 'block';
  log_btn.setAttribute('href', '#');
  log_btn.innerHTML = 'Add task';
  
  logout.addEventListener('click', e => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/';
  })
  
  log_btn.addEventListener('click', e => {
    e.preventDefault();
    if(task_input.value == ''){ alert('Wops! Missing task.');return false; }
    var data = {
      'content': task_input.value,
      'done': true
    }

    fetch(api, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(resp => {return resp.json()}).then(data => {
      task_input.value = '';
      log_btn.innerHTML = 'Added';
      setTimeout(() => {
        log_btn.innerHTML = 'Add Task';
        window.history.pushState('uri', 'Add to Makerlog', '/');
      }, 1000)
    })
  })
  
}