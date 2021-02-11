const rateBtns = document.querySelectorAll('.rate-student');

for (let i = 0; i < rateBtns.length; i++) {
  rateBtns[i].addEventListener('click', function () {
    const rateStudentForm = document.getElementById('rate-student-form');

    const interviewerId = this.getAttribute('data-interviewer') ?? '';
    const studentId = this.getAttribute('data-student') ?? '';

    rateStudentForm.action = `/interviewers/${interviewerId}/students/${studentId}`;
  });
}

const editBtns = document.querySelectorAll('.btn-warning');

for (let i = 0; i < editBtns.length; i++) {
  editBtns[i].addEventListener('click', function () {
    var editInterviewer = document.getElementsByClassName("edit-form-submit-btn");
    var autofillName = document.getElementsByClassName("name");
    var autofillCompany = document.getElementsByClassName("company");
    var autofillSelectedDate = document.getElementsByClassName("option1");
    var autofillUnselectedDate = document.getElementsByClassName("option2");

    const interviewerId = this.getAttribute('data-id') ?? '';
    const interviewerName = this.getAttribute('data-name') ?? '';
    const interviewerCompany = this.getAttribute('data-company') ?? '';
    const interviewDate = this.getAttribute('data-date') ?? '';

    editInterviewer[0].action = `/interviewers/${interviewerId}`;
    autofillName[0].value = interviewerName;
    autofillCompany[0].value = interviewerCompany;
    autofillSelectedDate[0].value = interviewDate;
    if(autofillSelectedDate[0].value === "Sat") {
      autofillUnselectedDate[0].value = "2021-02-21";
      autofillSelectedDate[0].value = "2021-02-20";
      autofillUnselectedDate[0].innerHTML = "21st February, 2021";
      autofillSelectedDate[0].innerHTML = "20th February, 2021"
    }
    else {
      autofillUnselectedDate[0].value = "2021-02-20";   
      autofillSelectedDate[0].value = "2021-02-21";   
      autofillUnselectedDate[0].innerHTML = "20th February, 2021";
      autofillSelectedDate[0].innerHTML = "21st February, 2021"
    }
  });
}