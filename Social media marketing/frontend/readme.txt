The Social Media Marketing App.
It is built with FastAPI, SQLAlchemy, for the backend and integrates with Twitter(X)
Prerequisites
Before starting, ensure you have the following installed on your system:
Python 3.9+ and copy its path to your system enviroment variable
pip (Python package manager)
VS Code
with the Python extension
SQLite (default DB)

Backend
open the backend folder with vscode
in ur vscode terminal type: pip install -r requirements.txt  to install all the necessary packages
after succesful installation
create a new terminal make sure its cmd and not powershell then type: uvicorn src.app:app --reload
once u do this the app starts running and u can move on to setup the frontend

Built with React
Frontend
open your frontend folder with Vscode
in ur vscode terminal type npm install 
once this is completed type npm run dev
once this is also completed your app is active and ready to run 
now go back to ur backend terminal and right click on the link to take u to your local host where u can access the app