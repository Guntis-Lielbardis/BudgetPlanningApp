# 1. Tīmekļa aplikācija individuālā budžeta plānošanai
Ir iebūvēta autentifikācija: e-pasta adrese un parole. Funkcionalitāte sastāv no informācijas panelī esošām CRUD operācijām-ierakstu izveidošana, nolasīšana, atjaunināšana, dzēšana. Papildus ir grafisks attēlojums, ierakstu dalījums pa atsevišķām lapām, ierakstu filtrēšana, ienākumu un izdevumu salīdzinājums, profila lapa, paskaidrojošā lapa. Projekts realizēts, izmantojot MVC(modelis-skats-kontrolieris) arhitektūru. Tas palīdz veikt HTTP pieprasījumus datubāzei. Ērtai aplikācijas izveidei bija izmantots Vite serveris, kas atļauj dinamiski mainīt kodu un uzreiz redzēt izmaiņas ekrānā. Vietne ir uzstādīta Render platformā. Datubāzei izmantots Neon PostgreSQL risinājums vietnē Render, bet lokālai izstrādei SQLite.
## 1.1. Frontend tehnoloģijas
* Javascript
* React
* Tailwind CSS
* Chart.js
## 1.2. Backend tehnoloģijas
* PHP
* Laravel
* PostgreSQL
# 2. Projekta instalācija datorā
## 2.1. Nepieciešamās programmas
* PHP <br>
Atver PHP lejupielādes saiti: https://www.php.net/downloads.php
Izvēlas Thread Safe Zip versiju lejupielādei. Izvelk no Zip arhīva. Tad no lejupielādes mapes tas jāpārvieto uz ```C:\Program Files\php-8.5.3```. Noslēgumā nepieciešams pievienot PHP sadaļā "Environment variables". Atver Start-> Edit the system environment variables-> Environment Variables-> System variables-> Nospiež uz Path, izvēlas Edit.-> Nospiež pogu New un iekopē PHP lokāciju uz diska.->Visu apstiprina ar OK.
* Composer <br>
Sākt Composer lejupielādi var: https://getcomposer.org/download/
Sadaļā Windows Installer izvēlas zilā krāsā izceltu failu ```Composer-Setup.exe```. Pēc tā aktivizēšanas atvērsies dialoga logs instalācijas procesam. Var izvēlēties instalāciju visiem datora lietotājiem vai tikai sev. Vēlāk nospiež 3 reizes pogu Next un beigās Install. Kad instalācija beigusies, nospiež Next un Finish. Lai pārbaudītu, vai instalācija notikusi pareizi, terminālī var ievadīt "composer".
* Node.js <br>
Atver: https://nodejs.org/en/download
Jāizvēlas ```Windows Installer (.msi)```. Instalācijas logā spiež Next->Piekrīt noteikumiem un spiež Next vēl 4 reizes->Install->Finish
## 2.2. Klonēšana
Datorā jāizveido jauna tukša mape, kur glabāsies projekts. Atver projekta repozitoriju Github, sadaļā Code nokopē HTTPS saiti. Pēc tam šajā mapē atver Command Prompt(termināli) un ievada "git clone" un vēl ielīmē Github saiti ar punktu beigās. Tas ir ```git clone https://github.com/Guntis-Lielbardis/BudgetPlanningApp.git .```
## 2.3. Instalācijas gaita
Atver php.ini, kas atrodas mapē ```C:\Program Files\php-8.5.3``` un aktivizē 2 paplašinājumus. Jānoņem semikolus sākumā.
Atrod ```;extension=fileinfo``` un nomaina uz ```extension=fileinfo```
Līdzīgā veidā ```;extension=pdo_sqlite``` nomaina uz ```extension=pdo_sqlite```<br>
Tālākā instalācija turpinās terminālī.<br>
* PHP bibliotēku instalācijai ievada: ```composer install --ignore-platform-reqs```. Ja veca PHP versija datorā, tad var vienkārši ```composer install```.
* Lai varētu darboties ar Javascript bibliotēkām, to skaitā React, ievada ```npm install```
* Izveido .env failu: ```copy .env.example .env```
* Ģenerē aplikācijas atslēgu: ```php artisan key:generate``` <br>
* Ja datubāzei izmantots SQLite, pārliecinās failā .env par to, ka savienojums ```DB_CONNECTION=sqlite``` ir iestatīts.
* Failu pārlūkā dodas uz projekta datubāzes(database) mapi, izveido jaunu failu ar nosaukumu "database.sqlite".
* Izveidotajai datubāzei veic migrācijas: ```php artisan migrate```
* Lai sāktu PHP serveri: ```php artisan serve```
* Jaunā terminālī šajā pašā lokācijā startē Vite serveri: ```npm run dev```.
# 3. Perspektīvas nākotnē
* Personalizēti budžeta ieteikumi
* Valūtu konvertācija
* Atgādinājumi e-pastā
* Papildus profila iestatījumi
* "Bug report" sekcija