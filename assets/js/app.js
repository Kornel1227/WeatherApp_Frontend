let contentBox = document.getElementById('content');
 
let lightmodeBtn = document.querySelector('#lightModeBtn');
let darkmodeBtn = document.querySelector('#darkModeBtn');
 
let theme = 'ligth';
 
async function navigate(page) {
    contentBox.innerHTML = await (await fetch(`views/${page}.html`)).text();
    
    switch(page){
        case 'admin/users':{
            getAllUsers();
            break;
        }
        case 'users/profile':{
            getUserData();
            break;
        }
        case 'admin/dashboard':{
            getStatistics();
            break;
        }
        case 'users/weather' : {
            getUserWeather();
            break;
        }
        case 'weathersimple' : {
            getUserWeather();
            break;
        }
    }
};
 
lightmodeBtn.addEventListener('click',()=>{
    theme = 'light';
    setTheme(theme);
});
darkmodeBtn.addEventListener('click',()=>{
    theme = 'dark';
    setTheme(theme);
});
 
function setTheme(theme){
    document.documentElement.setAttribute('data-bs-theme', theme)
    document.body.setAttribute('data-color-scheme', theme)
    setThemeBtnState();
    saveTheme(theme);
}
function setThemeBtnState(){
    lightmodeBtn.classList.toggle('hide');
    darkmodeBtn.classList.toggle('hide');
}
 
function saveTheme(theme){
    localStorage.setItem('WeatherTheme', theme);
}
function loadTheme(){
    theme = 'light';
    if(localStorage.getItem('WeatherTheme')){
        theme = localStorage.getItem('WeatherTheme');
        if(theme === 'dark'){
            setThemeBtnState();
        }
    }
    setTheme(theme);
}
 
navigate('home');
loadTheme();
loginCheck()