# 1. Web application for individual budget planning
It has built-in authentication: email address and password. Functionality offers CRUD operations in dashboard- creating, reading, updating, deleting budget records. Additionally included graphics with Chart.js, pagination, filtering by month or category, comparison between income and expenses, profile page, about page, currency conversion and bug report page. Project was implemented, using MVC architecture. It helps making HTTP requests to database. During development Vite server was used, which allows to dynamically update code and right away observe page changes. Application is hosted in Render: https://budgetplanningapp.onrender.com. For database in production Neon PostgreSQL service was used in Render, but local development- SQLite.
## 1.1. Frontend technologies
* Javascript
* React
* Tailwind CSS
* Chart.js
## 1.2. Backend technologies
* PHP
* Laravel
* PostgreSQL
# 2. Project installation in PC
## 2.1. Necessary programs
* PHP <br>
Open PHP downloads site: https://www.php.net/downloads.php
Choose Thread Safe Zip version. Extract from archive. Then from Downloads folder it gets moved to ```C:\Program Files\php-8.5.3```. In the end PHP environment variables are added. Open Start-> Edit the system environment variables-> Environment Variables-> System variables-> Path-> Edit.-> New and then paste the PHP location there.->Confirm with OK.
* Composer <br>
Begin Composer download: https://getcomposer.org/download/
In Windows Installer choose file marked in blue: ```Composer-Setup.exe```. A dialog window will appear for installation. It offers installing for all PC users or single user. Later click 3 times Next and in the end Install. Once done, click Next and Finish. To check if installation was successful, in terminal(Command prompt) optionally can type "composer".
* Node.js <br>
Open: https://nodejs.org/en/download
Choose ```Windows Installer (.msi)```. Click Next->Accept License agreement and click Next 4 more times->Install->Finish.
## 2.2. Cloning
In PC create an empty folder for storing project. Open repository in Github, copy HTTPS site from Code. Then open terminal in project's location and enter "git clone" and paste Github site with dot in the end. Example: ```git clone https://github.com/Guntis-Lielbardis/BudgetPlanningApp.git .```
## 2.3. Installation process
Open php.ini, it's location: ```C:\Program Files\php-8.5.3``` and enable 2 extensions. Remove semicolons at start of lines.
Find ```;extension=fileinfo``` and change to ```extension=fileinfo```.
Similarly ```;extension=pdo_sqlite``` to ```extension=pdo_sqlite```.<br>
Further installation continues in terminal.<br>
* PHP dependency manager is installed with: ```composer install --ignore-platform-reqs```. If PC has old PHP version, then simply ```composer install```.
* To use React, enter command for installing node package manager: ```npm install```.
* Generate an .env file: ```copy .env.example .env```.
* Generate app key: ```php artisan key:generate```. <br>
* If database uses SQLite, make sure that correct connection in .env file is set: ```DB_CONNECTION=sqlite```.
* In file explorer go to project's database folder, create a new file called: "database.sqlite".
* Run migrations: ```php artisan migrate```.
* To start PHP server, run: ```php artisan serve```.
* Parallelly open new terminal from project's location to start local development server: ```npm run dev```.
* __P.S.__ To locally test "Bug report" feature with Gmail SMTP, it's necessary to have Google profile username, which is added to .env file in <b>MAIL_USERNAME</b>.
* Then generate "App password" and use it without spaces in .env file in <b>MAIL_PASSWORD</b>. For simplicity <b>MAIL_FROM_ADDRESS</b> and <b>BUG_REPORT_EMAIL</b> should match(Message is sent from and to the same person, but in production to my email address). Check ".env.example" to fill with values if needed.
* Feature can run with <b>Resend API</b> as well. In that case, in Resend platform key can be generated and pasted in new environment variable <b>RESEND_KEY</b>. Don't forget to change <b>MAIL_MAILER</b> to "resend" and <b>MAIL_FROM_ADDRESS</b> to "onboarding@resend.dev".
* To make sure Resend API works, SSL certificate is needed. Open https://curl.se/docs/caextract.html
* Download "cacert.pem" file. Then move it to: ```C:\Program Files\php-8.5.3\extras\ssl```
* In php.ini file add path of "cacert.pem" twice at <b>curl.cainfo</b> and <b>openssl.cafile</b>.
For example, ```curl.cainfo = "C:\Program Files\php-8.5.3\extras\ssl\cacert.pem"``` and ```openssl.cafile = "C:\Program Files\php-8.5.3\extras\ssl\cacert.pem"```.
# 3. Future perspectives
* Personalized budget planning suggestions
* Reminders in email
* Additional profile settings