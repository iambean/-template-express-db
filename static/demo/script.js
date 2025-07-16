document.addEventListener('DOMContentLoaded', loadUsers);

document.getElementById('user-form').addEventListener('submit', createUser);
document.getElementById('edit-user-form').addEventListener('submit', updateUser);

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
    const tbody = document.getElementById('users-list');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.user_name}</td>
            <td>${user.age}</td>
            <td>${user.gender}</td>
            <td>
                <button class="btn-primary" onclick="showEditForm(${user.id})">Edit</button>
                <button class="btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showCreateForm() {
    document.getElementById('edit-form').style.display = 'none';
    document.getElementById('create-form').style.display = 'block';
    document.getElementById('user-form').reset();
}

function showEditForm(userId) {
    // TODO: Implement AJAX call to fetch user data
    console.log('Editing user with ID:', userId);

    // Mock data for demonstration
    const mockUser = { 
        id: userId, 
        user_name: 'John Doe', 
        age: 30, 
        gender: 'M' 
    };

    document.getElementById('edit-id').value = mockUser.id;
    document.getElementById('edit-name').value = mockUser.name;
    document.getElementById('edit-email').value = mockUser.email;
    document.getElementById('edit-role').value = mockUser.role;

    document.getElementById('create-form').style.display = 'none';
    document.getElementById('edit-form').style.display = 'block';
}

function hideForm() {
    document.getElementById('create-form').style.display = 'none';
    document.getElementById('edit-form').style.display = 'none';
}

function createUser(e) {
    e.preventDefault();
    const userData = {
        user_name: document.getElementById('user_name').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value
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
        id: document.getElementById('edit-id').value,
        user_name: document.getElementById('edit-user_name').value,
        age: document.getElementById('edit-age').value,
        gender: document.getElementById('edit-gender').value
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