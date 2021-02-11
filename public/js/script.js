const rateBtns = document.querySelectorAll('.rate-student');

for (let i = 0; i < rateBtns.length; i++) {
  rateBtns[i].addEventListener('click', function () {
    const rateStudentForm = document.getElementById('rate-student-form');

    const interviewerId = this.getAttribute('data-interviewer') ?? '';
    const studentId = this.getAttribute('data-student') ?? '';

    rateStudentForm.action = `/interviewers/${interviewerId}/students/${studentId}`;
  });
}

const editBtns = document.querySelectorAll('.edit-interviewer');
for (let i = 0; i < editBtns.length; i++) {
  editBtns[i].addEventListener('click', function () {
    // Select the editForm by ID
    const editInterviewerForm = document.getElementById('edit-interviewer-form');

    // Set form action
    editInterviewerForm.action = `/interviewers/${this.getAttribute('data-id')}`;

    // Prefill input fields
    editInterviewerForm['name'].value = this.getAttribute('data-name') ?? '';
    editInterviewerForm['company'].value = this.getAttribute('data-company') ?? '';
  });
}
