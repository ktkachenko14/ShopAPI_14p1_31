


function renderUsersTable(res) {
    let tableRows = "";

    for (let user of res) {
        tableRows += `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.lastname}</td>
                                <td>${user.login}</td>
                                <td>${user.role}</td>
                                <td>
                                    <div class="delBtn" data-id=${user.id}>
                                        <img src="https://img.icons8.com/plasticine/32/000000/trash--v1.png"/>
                                    </div>
                                </td>
                            </tr>
                        `;
    }

    let tableBody = `
                    <table class="table">
                        <thead>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Lastname</th>
                            <th>Login</th>
                            <th>Roles</th>
                            <th>Delete</th>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                    `;

    $('#usersTable').html(tableBody);
    $('#tableResult').removeClass('d-none');
};


function loadAllUsers() {
    let url = 'http://localhost:5000/api/users';
    let token = window.localStorage.getItem('shopapicredentials');

    fetch(url, {
        headers: {
            'Authorization': `bearer ${token}`          
        }
    })
        .then(x => {
            if (!x.ok) {
                $('#errorBlock').removeClass('d-none');
                $('#errorBlock').html(x.statusText);
            } else {

                x.json()
                    .then(res => {
                        renderUsersTable(res.data);

                        $('.delBtn').click(function () {
                            let id = $(this).data('id');
                            let url = `http://localhost:5000/api/users/${id}`;
                            fetch(url, {
                                method: 'DELETE'
                            })
                                .then(x => {
                                    loadAllUsers();
                                });
                        });

                    })
            }
        });
}


function createUser() {

    let url = 'http://localhost:5000/api/users';
    let newUser = {
        "name": $('#nameForm').val(),
        "lastname": $('#lastnameForm').val(),
        "login": $('#loginForm').val(),
        "password": $('#passwordForm').val(),
        "role": $('#roleForm').val()
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(x => {
            $('#createUserModal').modal('hide');
            loadAllUsers();
        });

};



$(document).ready(function () {


    $('#saveChangesBtn').click(function () {
        createUser();
        $('#createUserModal input').val('');
    });

    loadAllUsers();
});