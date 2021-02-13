const rateBtns = document.querySelectorAll('.rate-student');

for (let i = 0; i < rateBtns.length; i++) {
  rateBtns[i].addEventListener('click', function () {
    const rateStudentForm = document.getElementById('rate-student-form');

    const userId = this.getAttribute('data-user') ?? '';
    const studentId = this.getAttribute('data-student') ?? '';

    rateStudentForm.action = `/users/${userId}/students/${studentId}`;
  });
}

const editBtns = document.querySelectorAll('.edit-user');
for (let i = 0; i < editBtns.length; i++) {
  editBtns[i].addEventListener('click', function () {
    // Select the editForm by ID
    const edituserForm = document.getElementById('edit-user-form');

    // Set form action
    edituserForm.action = `/users/${this.getAttribute('data-id')}`;

    // Prefill input fields
    edituserForm['name'].value = this.getAttribute('data-name') ?? '';
    edituserForm['company'].value = this.getAttribute('data-company') ?? '';
  });
}
