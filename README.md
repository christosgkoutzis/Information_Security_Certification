<h1 align="center">SHA-1 Password Cracker</h1>
<h3 align="center">A program developed in Python language that takes a SHA-1 hashed password and gives as output the cracked password, if it is in a database of the 10000 most used passwords.</h3>

<p align="center"> FreeCodeCamp's replit starter code: https://replit.com/github/freeCodeCamp/boilerplate-SHA-1-password-cracker</p>
<p align="center"> My replit with the completed project: https://replit.com/@christosgkoutzi/boilerplate-SHA-1-password-cracker</p>

<p align="center">
    <img src="python.png" alt="python" width=10%>
</p> 

## Features

This program takes as input a suite of unit tests that's written in <code>test_module.py</code> file. Each test gives the program 2 inputs:

  -  A hashed password using the SHA-1 hashing function
        
  -  A boolean expression (True, False) if the hashed password uses salts or not (prepended or appended characters that makes decoding programms harder to decrypt the password)

The program reads the file database of 10000 most used passwords and the salts (if the boolean is True) and gives as output if the password is in the file database, by decrypting it.

## Installation

To try out this project yourself (instructions for bash CLI):

  1)  Clone this repo typing <code>git clone https://github.com/christosgkoutzis/Information_Security_Certification.git</code> 

  2)  Change branch to this project typing <code>git checkout origin/Sha1_Password_Cracker</code>

  3)  Install VSCode Python extension or install <code>pip</code> through CLI

  5)  Run the program typing <code>python main.py</code> command

## Development

In this project, the program that implements the functionality above, is written in <code>password_cracker.py</code> file.It reads the unit tests from <code>test_modules.py</code> (hashed passwords and if the password uses salts) and does the following procedures:

  -  Stores the <code>top-10000-passwords.txt</code> database in the computer's memory (a Python list)
    
  -  Hashes the passwords storing them in a Python dictionary that has as key/value pairs <code><hashed_password>: <decoded_password></code>

  -  Stores the <code>known-salts.txt</code> salt database in a Python list (if the boolean is True)
    
  -  Checks if the input (hashed password) is in the hashed password Python dictionary (mentioned in step 2). If the salts boolean is True, the algorithm does one extra step to prepend and append all the known salts to the encoded passwords.

The Python library that made all this functionality easy is the <code>hashlib</code> library with modules to encode and decode the passwords from SHA-1 hashing function. 
