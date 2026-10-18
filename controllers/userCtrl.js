async function registration(){
    let name = document.querySelector('#name').value;
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    let confirm = document.querySelector('#confirm').value; 

    let user = {
        name, 
        email , 
        password, 
        confirm
    }
    const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
            "Content-Type": "Application/json",
        },
        body: JSON.stringify(user)
    });

    let res = await response.json();
    
    if(response.status != 200){
        showMessage('danger', 'ERROR', res.error);
    } else{
        showMessage('success', 'OK', res.message)
        navigate('users/login')
    }
} 

async function login() {
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    let user = {
        email,
        password
    }

    const response = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
            "Content-Type": "Application/json",
        },
        body: JSON.stringify(user)
    });

    let res = await response.json();
    
    if(response.status != 200){
        showMessage('danger', 'ERROR', res.error);
    } else{
        showMessage('success', 'OK', res.message)
        storeUser(res.loggedUser)
        loginCheck();
    }
}

function logout(){
    clearUser();
    loginCheck();
    navigate('users/login')
}


function storeUser(user){
    sessionStorage.setItem('SCU', JSON.stringify(user));
}

function loadUser(){
    let user = JSON.parse(sessionStorage.getItem('SCU'));
    return user;
}

function clearUser(){
    sessionStorage.removeItem('SCU');
}

function loginCheck(){
    if( user = loadUser()){
        if(user.role == 'admin'){
            //alert('Admin belépve')
            setMenuItems('admin')
        }else{
            //alert('USer belépve');
            setMenuItems('user')
        }
    }
    else{
        //alert('Nincs belépve')
        setMenuItems('')
    }
}

function setMenuItems(param){
    let baseMenu = document.querySelector('#baseMenu')
    let adminMenu = document.querySelector('#adminMenu')
    let userMenu = document.querySelector('#userMenu')
    switch(param){
        case 'admin' : {
            baseMenu.classList.add('hide')
            userMenu.classList.add('hide')
            adminMenu.classList.remove('hide') 
            break;
        }
        case 'user' : {
            baseMenu.classList.add('hide') 
            adminMenu.classList.add('hide')
            userMenu.classList.remove('hide')

            break;
        }
        default : {  
            adminMenu.classList.add('hide')
            userMenu.classList.add('hide')
            baseMenu.classList.remove('hide')
            break;
        }
    }
}

async function updateProfile() {
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
 
    const user = loadUser();
 
    if (!user || !user.ID) {
        showMessage('danger', 'ERROR', 'You are not logged in!');
        return;
    }
 
    const uid = user.ID;
 
    const data = {
        username: name.value,
        email: email.value,
        luid: uid
    };
 
 
    const response = await fetch(`http://localhost:4000/users/${uid}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
 
    const res = await response.json();
 
    if (!response.ok) {
        showMessage('danger', 'ERROR', res.error);
    }
    else {
        showMessage('success', 'OK', res.message);
 
        name.value = '';
        email.value = '';
    }
}

async function updatePassword(){
    let oldpass = document.querySelector('#oldpass');
    let newpass = document.querySelector('#newpass');
    let confirm = document.querySelector('#confirm');

    let data = {
        oldpass : oldpass.value,
        newpass : newpass.value,
        confirm : confirm.value
    }
    let uid = loadUser() ? loadUser().ID : 0;

    const response = await fetch(`http://localhost:4000/users/${uid}/passmod`, {
        method: 'POST',
        headers: {
            "Content-Type": "Application/json",
        },
        body: JSON.stringify(data)
    });

    let res = await response.json();
    
    if(response.status != 200){
        showMessage('danger', 'ERROR', res.error);
    } else{
        showMessage('success', 'OK', res.message)
        oldpass.value = '';
        newpass.value = '';
        confirm.value = '';
    }
}

function getUserData(){
    let user = loadUser();

    document.querySelector('#name').value = user.name;
    document.querySelector('#email').value = user.email;
}
