const rateBtns = document.querySelectorAll('.rate-student');

for (let i = 0; i < rateBtns.length; i++) {
  rateBtns[i].addEventListener('click', function () {
    const rateStudentForm = document.getElementById('rate-student-form');

    const interviewerId = this.getAttribute('data-interviewer') ?? '';
    const studentId = this.getAttribute('data-student') ?? '';

    rateStudentForm.action = `/interviewers/${interviewerId}/students/${studentId}`;
  });
}
