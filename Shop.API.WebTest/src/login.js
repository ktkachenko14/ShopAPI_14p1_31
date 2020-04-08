
document.addEventListener('DOMContentLoaded', function() {
    let loginBtn = document.querySelector('#loginBtn');
    let url = 'http://localhost:5000/api/auth/authenticate';

    loginBtn.addEventListener('click', function() {
        let login = document.querySelector('#loginForm').value;
        let password = document.querySelector('#passwordForm').value;

        let credentials = {
            'login': login,
            'password': password
        };

       
        let errorBlock = document.querySelector('#errorBlock');    
        fetch(url, { 
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type':'application/json'
            }
        }).then(response => {
           
            
            if (!response.ok) {
                    
                errorBlock.classList.remove('d-none');
                response.json().then(txt => {
                    console.log(txt);
                    errorBlock.innerText = txt.message;
                });
                ;
            } else {
               
                errorBlock.classList.add('d-none');
                response
                    .json()
                        .then(x => {
                            

                            window.localStorage.setItem('shopapicredentials',x.data.token);
                            errorBlock.classList.remove('d-none');
                            errorBlock.classList.remove('alert-danger');
                            errorBlock.classList.add('alert-success');
                            errorBlock.innerHTML = `Welcome, ${x.data.name} ${x.data.lastname}`;
                        

                            // setTimeout(function() {
                            //     window.location.href = 'categories.html';
                            // }, 3000);
                        });
                        
                    
            }
        })
        .catch(error => {
            errorBlock.classList.remove('d-none');
            errorBlock.classList.add('alert-danger');
            errorBlock.innerHTML = `Unknown error. Failed to connect to service`;
        });;  
    });

});