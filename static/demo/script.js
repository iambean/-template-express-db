const $id = id=> document.getElementById(id);

document.addEventListener('DOMContentLoaded', loadUsers);

$id('user-form').addEventListener('submit', createUser);
$id('edit-user-form').addEventListener('submit', updateUser);

function loadUsers() {
    console.log('Loading users...');

    fetch('/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => renderUsers(data))
        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Failed to load users. Please try again.');
        });
}

function renderUsers(users) {
    const tbody = $id('users-list');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        const userString = encodeURIComponent(JSON.stringify(user));
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.user_name}</td>
            <td>${user.age}</td>
            <td>${user.gender}</td>
            <td>
                <button class="btn-primary" onclick="showEditForm('${userString}')">Edit</button>
                <button class="btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showCreateForm() {
    $id('edit-form').style.display = 'none';
    $id('create-form').style.display = 'block';
    $id('user-form').reset();
}

function showEditForm(userString) {
    const { id, user_name, age, gender } = JSON.parse(decodeURIComponent(userString));

    $id('edit-id').value = id;
    $id('edit-name').value = user_name;
    $id('edit-age').value = age;
    $id('edit-gender').value = gender;

    $id('create-form').style.display = 'none';
    $id('edit-form').style.display = 'block';
}

function hideForm() {
    $id('create-form').style.display = 'none';
    $id('edit-form').style.display = 'none';
}

function createUser(e) {
    e.preventDefault();
    const userData = {
        user_name: $id('user_name').value,
        age: $id('age').value,
        gender: $id('gender').value
    };

    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        hideForm();
        loadUsers();
    })
    .catch(error => {
        console.error('Error creating user:', error);
        alert('Failed to create user. Please try again.');
    });
}

function updateUser(e) {
    e.preventDefault();
    const userData = {
        id: $id('edit-id').value,
        user_name: $id('edit-name').value,
        age: $id('edit-age').value,
        gender: $id('edit-gender').value
    };

    fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        hideForm();
        loadUsers();
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
    });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            loadUsers();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        });
    }
}