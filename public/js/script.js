const rateBtns = document.querySelectorAll('.rate-student');

for (let i = 0; i < rateBtns.length; i++) {
  rateBtns[i].addEventListener('click', function () {
    const rateStudentForm = document.getElementById('rate-student-form');

    const aptitudeScoresTable = document.querySelectorAll('#aptitudeScores tbody tr td');
    const gdScoresTable = document.querySelectorAll('#gdScores tbody tr td');

    const userId = this.getAttribute('data-user') ?? '';
    const studentId = this.getAttribute('data-student') ?? '';

    rateStudentForm.action = `/users/${userId}/students/${studentId}`;

    const aptitudeScores = JSON.parse(this.getAttribute('data-aptitude'));
    aptitudeScoresTable[0].innerHTML = aptitudeScores['core'];
    aptitudeScoresTable[1].innerHTML = aptitudeScores['verbal'];
    aptitudeScoresTable[2].innerHTML = aptitudeScores['quants'];
    aptitudeScoresTable[3].innerHTML = aptitudeScores['programming'];

    const gdScores = JSON.parse(this.getAttribute('data-gd'));
    gdScoresTable[0].innerHTML = gdScores['subject_knowledge'];
    gdScoresTable[1].innerHTML = gdScores['communication_skills'];
    gdScoresTable[2].innerHTML = gdScores['body_language'];
    gdScoresTable[3].innerHTML = gdScores['listening_skills'];
    gdScoresTable[4].innerHTML = gdScores['critical_thinking'];
    gdScoresTable[5].innerHTML = gdScores['leadership_skills'];
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
