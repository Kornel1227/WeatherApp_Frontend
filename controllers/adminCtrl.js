async function getAllUsers() {

    let luid = loadUser() ? loadUser().ID : 0;
    const response = await fetch('http://localhost:4000/admin/users', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ luid }),
    });
 
    if(response.status != 200){
        const res = await response.json();
        showMessage('danger', 'ERROR', res.error)
    }
    else{
        const users = await response.json();
        drawTable(users);
    }   
}

function drawTable(users){
    let usersList = document.querySelector('#usersList');
    let usersCount = document.querySelector('#usersCount'); 

    usersCount.innerHTML = users.length;

    users.forEach((users, index) => {
        addTableRow(users, index)
    })
    
}

function addTableRow(users, index){
    
        let userList = document.querySelector('#usersList')

        let tr = document.createElement('tr');
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td3 = document.createElement('td')
        let td4 = document.createElement('td')
        let td5 = document.createElement('td')
        let td6 = document.createElement('td')
        let td7 = document.createElement('td')

        td1.innerHTML = (index + 1) + '.';
        td2.innerHTML = users.name;
        td3.innerHTML = users.email;
        td4.innerHTML = moment(users.created_at).format('YYYY-MM-DD - H:mm')
        td5.innerHTML = users.last_login ? moment(users.last_login, "YYYYMMDDHmm").fromNow() : "never";
        td6.innerHTML = users.login_count;

        let isActive = users.is_active ? 'checked': '';
        let isDisabled = users.ID == loadUser().ID ? 'disabled' : '';
        td7.innerHTML = '<div class="form-check form-switch float-end"><input class="form-check-input" type="checkbox" role="switch" id="is_active" '+ isActive +' '+ isDisabled +' onclick="changeUserStatus('+ users.ID + ')"></div>';


        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);


        usersList.appendChild(tr);
    
}

async function changeUserStatus(uid){
    let luid = loadUser() ? loadUser().ID : 0;

    let data = {
        uid, 
        luid
    };

    const response = await fetch(`http://localhost:4000/admin/status`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    const res = await response.json();

    if(response.status != 200){
        showMessage('danger', 'ERROR', res.error)
    }
    else{
        showMessage('success', 'OK', res.error)
    }  
}