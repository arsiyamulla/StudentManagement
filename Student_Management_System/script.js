// // script.js
// document.addEventListener('DOMContentLoaded', function () {
//     // ---------- global state ----------
//     let students = [
//         { id: 1, name: 'Liam Smith', email: 'liam.s@edu.co', course: 'Law', status: 'Active' },
//         { id: 2, name: 'Sophia Wilson', email: 'sophia.w@edu.co', course: 'CS', status: 'Inactive' },
//         { id: 3, name: 'Emma Watson', email: 'emma.w@edu.co', course: 'Computer Science', status: 'Active' },
//         { id: 4, name: 'James Carter', email: 'carter.j@edu.co', course: 'Business', status: 'Active' }
//     ];
//     let currentPage = 1;
//     const rowsPerPage = 3;

//     // ---------- DOM elements ----------
//     const loginPage = document.getElementById('login-page');
//     const adminDashboard = document.getElementById('admin-dashboard');
//     const loginForm = document.getElementById('login-form');
//     const views = document.querySelectorAll('.view');
//     const navItems = document.querySelectorAll('.sidebar-nav li');
//     const loadingOverlay = document.getElementById('loading-overlay');
//     const darkToggle = document.getElementById('darkmode-toggle');
//     const globalSearch = document.getElementById('global-search');
//     const manageSearch = document.getElementById('manage-search');
//     const manageTbody = document.querySelector('#manage-student-table tbody');
//     const dashboardTbody = document.querySelector('#dashboard-student-table tbody');
//     const prevBtn = document.querySelector('.page-prev');
//     const nextBtn = document.querySelector('.page-next');
//     const currentPageSpan = document.getElementById('current-page');
//     const totalPagesSpan = document.getElementById('total-pages');
//     const addForm = document.getElementById('add-student-form');
//     const editModal = document.getElementById('editModal');
//     const closeModal = document.querySelector('.close-modal');
//     const editForm = document.getElementById('edit-student-form');
//     const gotoManage = document.getElementById('goto-manage');
//     const logoutBtn = document.getElementById('logout-btn');

//     // Check if user is already logged in (session storage)
//     if (sessionStorage.getItem('isLoggedIn') === 'true') {
//         showDashboard();
//     }

//     // ---------- LOGIN FUNCTIONALITY ----------
//     loginForm.addEventListener('submit', function (e) {
//         e.preventDefault();
        
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;
        
//         // Simple validation (in real app, this would be server-side)
//         if (username === 'admin' && password === 'admin123') {
//             showLoading();
            
//             // Simulate API call
//             setTimeout(() => {
//                 sessionStorage.setItem('isLoggedIn', 'true');
//                 showDashboard();
//                 loadingOverlay.style.display = 'none';
//             }, 1000);
//         } else {
//             alert('Invalid credentials! Use admin / admin123');
//         }
//     });

//     // Logout functionality
//     logoutBtn.addEventListener('click', function () {
//         showLoading();
//         setTimeout(() => {
//             sessionStorage.removeItem('isLoggedIn');
//             loginPage.style.display = 'flex';
//             adminDashboard.style.display = 'none';
//             loadingOverlay.style.display = 'none';
            
//             // Reset any forms if needed
//             if (editModal) editModal.style.display = 'none';
//         }, 500);
//     });

//     function showDashboard() {
//         loginPage.style.display = 'none';
//         adminDashboard.style.display = 'grid';
        
//         // Initialize dashboard data
//         renderDashboard();
//         renderManageTable('');
//         showLoading();
        
//         // Set dashboard as active view
//         document.querySelector('[data-page="dashboard"]').click();
//     }

//     // ---------- helper: show loading then hide ----------
//     function showLoading() {
//         loadingOverlay.style.display = 'flex';
//         setTimeout(() => { loadingOverlay.style.display = 'none'; }, 300);
//     }

//     // ---------- render dashboard table (first 4) ----------
//     function renderDashboard() {
//         dashboardTbody.innerHTML = '';
//         students.slice(0, 4).forEach(s => {
//             const row = document.createElement('tr');
//             row.innerHTML = `<td>${s.name}</td><td>${s.email}</td><td>${s.course}</td>
//                 <td><span class="status-badge ${s.status === 'Inactive' ? 'inactive' : ''}">${s.status}</span></td>`;
//             dashboardTbody.appendChild(row);
//         });
//         document.getElementById('total-students').innerText = students.length;
//         document.getElementById('active-students').innerText = students.filter(s => s.status === 'Active').length;
//     }

//     // ---------- render manage table with filter & pagination ----------
//     function renderManageTable(filterText = '') {
//         const filterLower = filterText.toLowerCase();
//         let filtered = students.filter(s => 
//             s.name.toLowerCase().includes(filterLower) || s.email.toLowerCase().includes(filterLower));
//         const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
//         if (currentPage > totalPages) currentPage = totalPages;
//         const start = (currentPage - 1) * rowsPerPage;
//         const pageData = filtered.slice(start, start + rowsPerPage);

//         manageTbody.innerHTML = '';
//         pageData.forEach(s => {
//             const row = document.createElement('tr');
//             row.innerHTML = `<td>${s.name}</td><td>${s.email}</td><td>${s.course}</td>
//                 <td><span class="status-badge ${s.status === 'Inactive' ? 'inactive' : ''}">${s.status}</span></td>
//                 <td>
//                     <button class="edit-btn" data-id="${s.id}"><i class="fas fa-edit"></i></button>
//                     <button class="delete-btn" data-id="${s.id}"><i class="fas fa-trash-alt"></i></button>
//                 </td>`;
//             manageTbody.appendChild(row);
//         });
//         currentPageSpan.innerText = currentPage;
//         totalPagesSpan.innerText = totalPages;
//         prevBtn.disabled = currentPage === 1;
//         nextBtn.disabled = currentPage === totalPages;
//         attachTableActions();
//     }

//     function attachTableActions() {
//         document.querySelectorAll('.edit-btn').forEach(btn => {
//             btn.addEventListener('click', (e) => {
//                 const id = parseInt(e.currentTarget.dataset.id);
//                 const student = students.find(s => s.id === id);
//                 if (student) openEditModal(student);
//             });
//         });
//         document.querySelectorAll('.delete-btn').forEach(btn => {
//             btn.addEventListener('click', (e) => {
//                 if (confirm('Delete student?')) {
//                     const id = parseInt(e.currentTarget.dataset.id);
//                     students = students.filter(s => s.id !== id);
//                     renderDashboard();
//                     renderManageTable(manageSearch.value);
//                     showLoading();
//                 }
//             });
//         });
//     }

//     // ---------- navigation ----------
//     navItems.forEach(item => {
//         item.addEventListener('click', () => {
//             navItems.forEach(n => n.classList.remove('active'));
//             item.classList.add('active');
//             const page = item.dataset.page;
//             views.forEach(v => v.classList.remove('active-view'));
//             if (page === 'dashboard') document.getElementById('dashboard-view').classList.add('active-view');
//             else if (page === 'add-student') document.getElementById('add-student-view').classList.add('active-view');
//             else if (page === 'manage-students') {
//                 document.getElementById('manage-students-view').classList.add('active-view');
//                 renderManageTable(manageSearch.value);
//             } else if (page === 'reports') document.getElementById('reports-view').classList.add('active-view');
//             else if (page === 'settings') document.getElementById('settings-view').classList.add('active-view');
//         });
//     });

//     // ---------- dark mode ----------
//     darkToggle.addEventListener('click', () => {
//         document.body.classList.toggle('dark-mode');
//         const icon = darkToggle.querySelector('i');
//         icon.classList.toggle('fa-moon');
//         icon.classList.toggle('fa-sun');
//     });

//     // ---------- search (manage) ----------
//     manageSearch.addEventListener('input', (e) => {
//         currentPage = 1;
//         renderManageTable(e.target.value);
//     });

//     // pagination
//     prevBtn.addEventListener('click', () => {
//         if (currentPage > 1) { currentPage--; renderManageTable(manageSearch.value); }
//     });
//     nextBtn.addEventListener('click', () => {
//         const total = Math.ceil(students.filter(s => s.name.toLowerCase().includes(manageSearch.value.toLowerCase()) || s.email.toLowerCase().includes(manageSearch.value.toLowerCase())).length / rowsPerPage);
//         if (currentPage < total) { currentPage++; renderManageTable(manageSearch.value); }
//     });

//     // global search (redirect to manage + filter)
//     globalSearch.addEventListener('input', (e) => {
//         document.querySelector('[data-page="manage-students"]').click();
//         manageSearch.value = e.target.value;
//         currentPage = 1;
//         renderManageTable(e.target.value);
//     });

//     // add student form with validation
//     addForm.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const name = document.getElementById('fullname').value.trim();
//         const email = document.getElementById('email').value.trim();
//         const course = document.getElementById('course').value.trim();
//         const status = document.getElementById('status').value;
//         let valid = true;

//         if (!name) { document.getElementById('error-name').innerText = 'Name required'; valid = false; } else { document.getElementById('error-name').innerText = ''; }
//         if (!email || !/^\S+@\S+\.\S+$/.test(email)) { document.getElementById('error-email').innerText = 'Valid email required'; valid = false; } else { document.getElementById('error-email').innerText = ''; }
//         if (!valid) return;

//         const newId = Math.max(...students.map(s=>s.id),0)+1;
//         students.push({ id: newId, name, email, course: course || 'Not specified', status });
//         showLoading();
//         addForm.reset();
//         renderDashboard();
//         if (document.getElementById('manage-students-view').classList.contains('active-view')) renderManageTable(manageSearch.value);
//         alert('Student added successfully!');
//     });

//     // modal edit logic
//     function openEditModal(s) {
//         document.getElementById('edit-id').value = s.id;
//         document.getElementById('edit-name').value = s.name;
//         document.getElementById('edit-email').value = s.email;
//         document.getElementById('edit-course').value = s.course;
//         document.getElementById('edit-status').value = s.status;
//         editModal.style.display = 'flex';
//     }
//     closeModal.addEventListener('click', () => { editModal.style.display = 'none'; });
//     window.addEventListener('click', (e) => { if (e.target === editModal) editModal.style.display = 'none'; });

//     editForm.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const id = parseInt(document.getElementById('edit-id').value);
//         const student = students.find(s => s.id === id);
//         if (student) {
//             student.name = document.getElementById('edit-name').value;
//             student.email = document.getElementById('edit-email').value;
//             student.course = document.getElementById('edit-course').value;
//             student.status = document.getElementById('edit-status').value;
//             showLoading();
//             renderDashboard();
//             if (document.getElementById('manage-students-view').classList.contains('active-view')) renderManageTable(manageSearch.value);
//             editModal.style.display = 'none';
//         }
//     });

//     gotoManage.addEventListener('click', () => { document.querySelector('[data-page="manage-students"]').click(); });
// });
// script.js
document.addEventListener('DOMContentLoaded', function () {
    // ---------- global state ----------
    let students = [
        { id: 1, name: 'Liam Smith', email: 'liam.s@edu.co', course: 'Law', status: 'Active' },
        { id: 2, name: 'Sophia Wilson', email: 'sophia.w@edu.co', course: 'CS', status: 'Inactive' },
        { id: 3, name: 'Emma Watson', email: 'emma.w@edu.co', course: 'Computer Science', status: 'Active' },
        { id: 4, name: 'James Carter', email: 'carter.j@edu.co', course: 'Business', status: 'Active' }
    ];
    let currentPage = 1;
    const rowsPerPage = 3;

    // ---------- DOM elements ----------
    const loginPage = document.getElementById('login-page');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('login-form');
    const views = document.querySelectorAll('.view');
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const loadingOverlay = document.getElementById('loading-overlay');
    const darkToggle = document.getElementById('darkmode-toggle');
    const globalSearch = document.getElementById('global-search');
    const manageSearch = document.getElementById('manage-search');
    const manageTbody = document.querySelector('#manage-student-table tbody');
    const dashboardTbody = document.querySelector('#dashboard-student-table tbody');
    const prevBtn = document.querySelector('.page-prev');
    const nextBtn = document.querySelector('.page-next');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const addForm = document.getElementById('add-student-form');
    const editModal = document.getElementById('editModal');
    const closeModal = document.querySelector('.close-modal');
    const editForm = document.getElementById('edit-student-form');
    const gotoManage = document.getElementById('goto-manage');
    const logoutBtn = document.getElementById('logout-btn');
    

    // ---------- PASSWORD VISIBILITY TOGGLE ----------
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle the eye icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Check if user is already logged in (session storage)
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        showDashboard();
    }

    // ---------- LOGIN FUNCTIONALITY ----------
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (in real app, this would be server-side)
        if (username === 'admin' && password === 'admin123') {
            showLoading();
            
            // Simulate API call
            setTimeout(() => {
                sessionStorage.setItem('isLoggedIn', 'true');
                showDashboard();
                loadingOverlay.style.display = 'none';
            }, 1000);
        } else {
            alert('Invalid credentials! Use admin / admin123');
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function () {
        showLoading();
        setTimeout(() => {
            sessionStorage.removeItem('isLoggedIn');
            loginPage.style.display = 'flex';
            adminDashboard.style.display = 'none';
            loadingOverlay.style.display = 'none';
            
            // Reset any forms if needed
            if (editModal) editModal.style.display = 'none';
        }, 500);
    });

    function showDashboard() {
        loginPage.style.display = 'none';
        adminDashboard.style.display = 'grid';
        
        // Initialize dashboard data
        renderDashboard();
        renderManageTable('');
        showLoading();
        
        // Set dashboard as active view
        document.querySelector('[data-page="dashboard"]').click();
    }

    // ---------- helper: show loading then hide ----------
    function showLoading() {
        loadingOverlay.style.display = 'flex';
        setTimeout(() => { loadingOverlay.style.display = 'none'; }, 300);
    }

    // ---------- render dashboard table (first 4) ----------
    function renderDashboard() {
        dashboardTbody.innerHTML = '';
        students.slice(0, 4).forEach(s => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${s.name}</td><td>${s.email}</td><td>${s.course}</td>
                <td><span class="status-badge ${s.status === 'Inactive' ? 'inactive' : ''}">${s.status}</span></td>`;
            dashboardTbody.appendChild(row);
        });
        document.getElementById('total-students').innerText = students.length;
        document.getElementById('active-students').innerText = students.filter(s => s.status === 'Active').length;
    }

    // ---------- render manage table with filter & pagination ----------
    function renderManageTable(filterText = '') {
        const filterLower = filterText.toLowerCase();
        let filtered = students.filter(s => 
            s.name.toLowerCase().includes(filterLower) || s.email.toLowerCase().includes(filterLower));
        const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const start = (currentPage - 1) * rowsPerPage;
        const pageData = filtered.slice(start, start + rowsPerPage);

        manageTbody.innerHTML = '';
        pageData.forEach(s => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${s.name}</td><td>${s.email}</td><td>${s.course}</td>
                <td><span class="status-badge ${s.status === 'Inactive' ? 'inactive' : ''}">${s.status}</span></td>
                <td>
                    <button class="edit-btn" data-id="${s.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${s.id}"><i class="fas fa-trash-alt"></i></button>
                </td>`;
            manageTbody.appendChild(row);
        });
        currentPageSpan.innerText = currentPage;
        totalPagesSpan.innerText = totalPages;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        attachTableActions();
    }

    function attachTableActions() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const student = students.find(s => s.id === id);
                if (student) openEditModal(student);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('Delete student?')) {
                    const id = parseInt(e.currentTarget.dataset.id);
                    students = students.filter(s => s.id !== id);
                    renderDashboard();
                    renderManageTable(manageSearch.value);
                    showLoading();
                }
            });
        });
    }

    // ---------- navigation ----------
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            const page = item.dataset.page;
            views.forEach(v => v.classList.remove('active-view'));
            if (page === 'dashboard') document.getElementById('dashboard-view').classList.add('active-view');
            else if (page === 'add-student') document.getElementById('add-student-view').classList.add('active-view');
            else if (page === 'manage-students') {
                document.getElementById('manage-students-view').classList.add('active-view');
                renderManageTable(manageSearch.value);
            } else if (page === 'reports') document.getElementById('reports-view').classList.add('active-view');
            else if (page === 'settings') document.getElementById('settings-view').classList.add('active-view');
        });
    });

    // ---------- dark mode ----------
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = darkToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // ---------- search (manage) ----------
    manageSearch.addEventListener('input', (e) => {
        currentPage = 1;
        renderManageTable(e.target.value);
    });

    // pagination
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderManageTable(manageSearch.value); }
    });
    nextBtn.addEventListener('click', () => {
        const total = Math.ceil(students.filter(s => s.name.toLowerCase().includes(manageSearch.value.toLowerCase()) || s.email.toLowerCase().includes(manageSearch.value.toLowerCase())).length / rowsPerPage);
        if (currentPage < total) { currentPage++; renderManageTable(manageSearch.value); }
    });

    // global search (redirect to manage + filter)
    globalSearch.addEventListener('input', (e) => {
        document.querySelector('[data-page="manage-students"]').click();
        manageSearch.value = e.target.value;
        currentPage = 1;
        renderManageTable(e.target.value);
    });

    // add student form with validation
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const course = document.getElementById('course').value.trim();
        const status = document.getElementById('status').value;
        let valid = true;

        if (!name) { document.getElementById('error-name').innerText = 'Name required'; valid = false; } else { document.getElementById('error-name').innerText = ''; }
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) { document.getElementById('error-email').innerText = 'Valid email required'; valid = false; } else { document.getElementById('error-email').innerText = ''; }
        if (!valid) return;

        const newId = Math.max(...students.map(s=>s.id),0)+1;
        students.push({ id: newId, name, email, course: course || 'Not specified', status });
        showLoading();
        addForm.reset();
        renderDashboard();
        if (document.getElementById('manage-students-view').classList.contains('active-view')) renderManageTable(manageSearch.value);
        alert('Student added successfully!');
    });

    // modal edit logic
    function openEditModal(s) {
        document.getElementById('edit-id').value = s.id;
        document.getElementById('edit-name').value = s.name;
        document.getElementById('edit-email').value = s.email;
        document.getElementById('edit-course').value = s.course;
        document.getElementById('edit-status').value = s.status;
        editModal.style.display = 'flex';
    }
    closeModal.addEventListener('click', () => { editModal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === editModal) editModal.style.display = 'none'; });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-id').value);
        const student = students.find(s => s.id === id);
        if (student) {
            student.name = document.getElementById('edit-name').value;
            student.email = document.getElementById('edit-email').value;
            student.course = document.getElementById('edit-course').value;
            student.status = document.getElementById('edit-status').value;
            showLoading();
            renderDashboard();
            if (document.getElementById('manage-students-view').classList.contains('active-view')) renderManageTable(manageSearch.value);
            editModal.style.display = 'none';
        }
    });

    gotoManage.addEventListener('click', () => { document.querySelector('[data-page="manage-students"]').click(); });
});