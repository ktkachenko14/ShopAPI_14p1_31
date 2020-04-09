
class CategoryService {

    constructor() {
        this.url = 'http://localhost:5000/api/categories';
        this.tableResult = document.querySelector('#tableResult');
        this.token = window.localStorage.getItem('shopapicredentials');
        document.querySelector('.createBtn').addEventListener('click', x => this.createCategory());

        document.querySelector('#logoutBtn').addEventListener('click', function () {
            window.localStorage.removeItem('loggedUserInfo');
            window.localStorage.removeItem('shopapicredentials');
            window.location.reload();

        });

        this.userInfo = parseJwt(this.token);
     


        document.querySelector('#userInfo').innerText = `${this.userInfo.unique_name} ${this.userInfo.role}`;
        document.querySelector('#loginArea').classList.remove('d-none');


        this.getAllCategories();
    }

    showErrorBlock(message) {
        let errorBlock = document.querySelector('#errorBlock');
        errorBlock.classList.remove('d-none');
        errorBlock.innerText = message;
    }

    showTableData(categories) {
        let resHtml = "";
        if (this.userInfo.role.includes("Admin") || this.userInfo.role.includes("SuperAdmin")) {

            resHtml = `<table class="table mt-3">
        <thead>
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead><tbody>`;

            for (let category of categories) {
                resHtml += `<tr>
            <td>
               
                <div class="categoryId">${category.id}</div>

            </td>
            <td class="editableField">
                <div class="d-none editableForm">
                    <input type="text" class="categoryForm" data-id="${category.id}" value="${category.name}" />   
                    <span class="cancelBtn">
                    <img src="https://img.icons8.com/cute-clipart/32/000000/cancel.png"/>
                    </span>
                </div>
                <div class="categoryName">${category.name}</div>
           
            </td>
            <td>  
                <div class="editBtn">
                    <img src="https://img.icons8.com/dusk/32/000000/edit.png"/>
                </div>
                <div class="d-none saveBtn">
                    <img src="https://img.icons8.com/cute-clipart/32/000000/approval.png"/>
                </div>
            </td>
            <td>
                <div class="delBtn" data-id=${category.id}>
                    <img src="https://img.icons8.com/plasticine/32/000000/trash--v1.png"/>
                </div>
            </td>
            
            </tr>`;
            }
        } else if (this.userInfo.role.includes("User")) {
            resHtml = `<table class="table mt-3">
        <thead>
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
               
            </tr>
        </thead><tbody>`;
            for (let category of categories) {
                resHtml += `<tr>
            <td>               
                <div class="categoryId">${category.id}</div>
            </td>
            <td>        
                <div class="categoryName">${category.name}</div>         
            </td>
            </tr>`;
            }
        }

        resHtml += `</tbody></table>`;

        errorBlock.classList.add('d-none');

        this.tableResult.innerHTML = resHtml;
        document.querySelector('#categoriesTable').classList.remove('d-none');

        let delButtons = document.querySelectorAll('.delBtn');

        let delFunc = this.deleteCategory.bind(this);

        for (let btn of delButtons) {
            btn.addEventListener('click', function () {
                let id = this.dataset.id;
                delFunc(id);
            });
        }

        let cancelButtons = document.querySelectorAll('.cancelBtn');
        for (let btn of cancelButtons) {
            btn.addEventListener('click', function (e) {
                let cancelBtnTd = e.currentTarget.parentElement.parentElement;
                let tr = cancelBtnTd.parentElement;
                tr.querySelectorAll('.editableField .editableForm')[0].classList.add('d-none');
                tr.querySelectorAll('.editableField .categoryName')[0].classList.remove('d-none');
                tr.querySelectorAll('.editBtn')[0].classList.remove('d-none');
                tr.querySelectorAll('.saveBtn')[0].classList.add('d-none');
            });
        }


        let saveButtons = document.querySelectorAll('.saveBtn');
        for (let btn of saveButtons) {
            let token = this.token;
            btn.addEventListener('click', function (e) {


                let tr = e.currentTarget.parentElement.parentElement;
                let categoryName = tr.querySelectorAll('.categoryForm')[0].value;
                let categoryId = tr.querySelectorAll('.categoryForm')[0].dataset.id;

                let url = `http://localhost:5000/api/categories/${categoryId}`;

                let obj = {
                    "name": categoryName
                };
                fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(obj),
                    headers: {
                        'Authorization': `bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(x => x.json())
                    .then(res => {

                        tr.querySelectorAll('.editableField .categoryName')[0].innerText = res.name;

                        tr.querySelectorAll('.editableField .editableForm')[0].classList.add('d-none');
                        tr.querySelectorAll('.editableField .categoryName')[0].classList.remove('d-none');
                        tr.querySelectorAll('.editBtn')[0].classList.remove('d-none');
                        tr.querySelectorAll('.saveBtn')[0].classList.add('d-none');
                    });

            });
        }

        let editButtons = document.querySelectorAll('.editBtn');

        for (let btn of editButtons) {
            btn.addEventListener('click', function (e) {
                let editBtnTd = e.currentTarget.parentElement;
                let tr = editBtnTd.parentElement;
                tr.querySelectorAll('.editableField .editableForm')[0].classList.remove('d-none');
                tr.querySelectorAll('.editableField .categoryName')[0].classList.add('d-none');
                editBtnTd.querySelectorAll('.editBtn')[0].classList.add('d-none');
                editBtnTd.querySelectorAll('.saveBtn')[0].classList.remove('d-none');
            });
        }


    }

    deleteCategory(id) {
        fetch(`${this.url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${this.token}`
            }
        })
            .then(x => this.getAllCategories());
    }

    getAllCategories() {
        fetch(this.url, {
            headers: {
                'Authorization': `bearer ${this.token}`
            }
        })
            .then(x => {
                if (!x.ok) {
                    this.showErrorBlock(x.statusText);
                } else {
                    x.json().then(result => {
                        console.log(result);
                        this.showTableData(result.data);
                    });
                }
               
            })
            .catch(error => {
                this.showErrorBlock('Unknown error. Failed to load data');
            });
    }

    createCategory() {
        let categoryName = prompt("Category name: ");

        if (categoryName.length > 0) {
            let url = 'http://localhost:5000/api/categories';
            let obj = {
                "name": categoryName
            }

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${this.token}`
                },
                body: JSON.stringify(obj)
            }).then(x => {
                if (!x.ok) {
                    this.showErrorBlock(x.statusText);
                } else {
                    x.json().then(res => console.log(res));
                    this.getAllCategories();

                }
            });
        }
    }



}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

document.addEventListener('DOMContentLoaded', function () {

    new CategoryService();


    // document.addEventListener('DOMContentLoaded', function () {
    //     let url = 'http://localhost:5000/api/categories';

    //     let tableResult = document.querySelector('#categoriesTable tbody');


    //     let token = window.localStorage.getItem('shopapicredentials');

    //     fetch(url, {
    //         headers: {
    //             'Authorization': `bearer ${token}`
    //         }
    //     })
    //         .then(x => {
    //             if (!x.ok) {
    //                 let errorBlock = document.querySelector('#errorBlock');
    //                 errorBlock.classList.remove('d-none');
    //                 errorBlock.innerText = x.statusText;
    //             } else {
    //                 x.json()
    //                     .then(result => {


    //                         let resHtml = "";

    //                         for (let category of result) {
    //                             resHtml += `<tr>
    //                             <td>${category.id}</td>
    //                             <td>${category.name}</td>
    //                             <td><div><img class="delBtn" src="https://img.icons8.com/plasticine/32/000000/trash--v1.png"/></div></td>
    //                             </tr>`;
    //                         }

    //                         errorBlock.classList.add('d-none');

    //                         tableResult.innerHTML = resHtml;
    //                         tableResult.parentElement.classList.remove('d-none');
    //                     });
    //             }


    //         });

    // });

});