
![🇨🇦 Spectrum Management System (SMS) License Application Exporter](readme_ressources/Frame%203410.png)

### What is the spectrum management system?

The Spectrum Management System (SMS) is a Canadian government online portal that provides access to a wide range of services provided by ISED’s *(the department of Innovation, Science and Economic Development Canada)* spectrum management program.

### What problem does this project solve?

For registered radio or spectrum licensees the SMS only enables you access to print licences, and has stuck to this rather analog way of doing things for the better part of ~7 years. This means your personal records of these licence applications is limited - no possibility for sorting, search and reformatting to a custom layout.

Also simply copying the licences from the SMS isn't really an option because the engineers/users of the SMS typically have over 20 pages of tables, so everytime going in the SMS and copying everything over is not a reasonable use of their time and expertise.

### How does this project solve the problem?

This node.js application in the background:

- Navigates to the SMS
- Logs-in with given credentials
- Navigates to license applications
- Creates a custom JS table object from all the licenses in the SMS

And then once the table is created the program will:

- Convert the table object into a csv string
- Export/create a csv file in the exports folder

Thus now enabling the user to have a csv version of their license applications for their records instead of solely print in a single click! They can now put back their time to more core tasks that make use of their skills.

### Preview

- Currently build auth page

![auth page image](https://user-images.githubusercontent.com/79291357/209575086-bbe07a74-4eee-4b15-9f47-e91bbf799365.png)

- Currently built home screen:

![dashboard image](https://user-images.githubusercontent.com/79291357/209574727-fac23284-a90a-405c-8087-04216d49bf2d.png)

