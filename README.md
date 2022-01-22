# HRSoftware

![image](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![image](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![image](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![image](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![image](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)
![image](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)

An application to record mock interview scores and allocate students for MOCKS 2021.

## Project Setup
```
Clone the repository to your local system
git clone https://github.com/ForeseTech/HRSoftware

Navigate to the cloned repo
cd HRSoftware/

Create a copy of the .env.example file and rename it to .env
cp .env.example .env

Replace the placeholder credentials in the .env file with your credentials

Install project dependencies
npm install

Start server in development mode
npm run dev

Start server in production
npm start
```

## Database Seeder

```
Import All Data
node seeder -i

Destroy All Data
node seeder -d
```

## Screenshots
| HR/Admin - Login                                   | Student Incharge  - Login                          | HR - Dashboard                                       |
| -------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| <img src="screenshots/AdminHRLogin.png">           | <img src="screenshots/InchargeLogin.png">          | <img src="screenshots/HRDashboard.png">              |

| HR - Score a Student                               | Incharge - Dashboard                               | Incharge - Allocate Student                          |
| -------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| <img src="screenshots/HRRateStudent.png">          | <img src="screenshots/InchargeDashboard.png">      | <img src="screenshots/InchargeAllocateStudents.png"> |

| Admin - View HR                                    | Admin - View Single HR                             | Admin - Create User                                  |
| -------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| <img src="screenshots/AdminViewHR.png">            | <img src="screenshots/AdminViewSingleHR.png">      | <img src="screenshots/AdminCreateHR.png">            |

| Admin - Allocate Students to HR                    | Admin - View Incharges                             | Admin - View Admins                                  |
| -------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| <img src="screenshots/AdminAllocateStudents.png">  | <img src="screenshots/AdminViewIncharges.png">     | <img src="screenshots/AdminViewAdmin.png">           |      

| Admin - View Students                              | Admin - View Single Student                        | Admin - Create Student                               | 
| -------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- | 
| <img src="screenshots/AdminViewStudents.png">      | <img src="screenshots/AdminViewSingleStudent.png"> | <img src="screenshots/AdminCreateStudent.png">       | 

| Admin - Allocate HR's to Student                   | Admin - View Scores                                |
| -------------------------------------------------- | -------------------------------------------------- | 
| <img src="screenshots/AdminAllocateHRs.png">       | <img src="screenshots/AdminViewScores.png">        |