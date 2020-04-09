


function renderRolesTable(res) {
    let tableRows = "";

    for (let role of res) {
        tableRows += `
                            <tr>
                                <td>${role.id}</td>
                                <td>${role.name}</td>
                                <td>
                                    <div class="delBtn" data-id=${role.id}>
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
                            <th>Delete</th>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                    `;

    $('#rolesTable').html(tableBody);
    $('#tableResult').removeClass('d-none');
};


function loadAllRoles() {
    let url = 'http://localhost:5000/api/roles';
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
                        renderRolesTable(res.data);

                        $('.delBtn').click(function () {
                            let id = $(this).data('id');
                            let url = `http://localhost:5000/api/roles/${id}`;
                            fetch(url, {
                                method: 'DELETE'
                            })
                                .then(x => {
                                    loadAllRoles();
                                });
                        });

                    })
            }
        });
}


function createRole() {

    let url = 'http://localhost:5000/api/roles';
    let newRole = {
        "name": $('#nameForm').val()
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(newRole),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(x => {
            $('#createRoleModal').modal('hide');
            loadAllRoles();
        });

};



$(document).ready(function () {


    $('#saveChangesBtn').click(function () {
        createRole();
        $('#createRoleModal input').val('');
    });

    loadAllRoles();
});