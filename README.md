<h1 align="center">Port Scanner</h1>
<h3 align="center">A program developed in Python language that takes as input a domain name or an IP address and gives as output its open ports.</h3>

<p align="center"> FreeCodeCamp's replit starter code: https://replit.com/github/freeCodeCamp/boilerplate-port-scanner</p>
<p align="center"> My replit with the completed project: https://replit.com/@christosgkoutzi/python-port-scanner</p>

<p align="center">
    <img src="python.png" alt="python" width=10%>
</p> 

## Features

This program takes as input a suite of unit tests that's written in <code>test_module.py</code> file. Each test gives the program 3 inputs:

  -  A domain name or an IP address
  
  -  A range of ports (f.e. from port 20 to port 80) for testing
        
  -  A boolean expression (True, False) for the verbose mode

The program checks the <code>domain name/IP address</code> for open ports within the <code>port range</code> and gives as output:

  -  A Python list with the open ports along with a user-friendly text if the verbose mode is <code>False</code>

  -  A table with 2 columns one named after <code>PORT</code> that includes all the open ports and one named after <code>SERVICE</code> that includes the name of the web service of each open port. The name of the service gets added by the <code>common_ports.py</code> file's dictionary 

## Installation

To try out this project yourself (instructions for bash CLI):

  1)  Clone this repo typing <code>git clone https://github.com/christosgkoutzis/Information_Security_Certification.git</code> 

  2)  Change branch to this project typing <code>git checkout origin/Port_Scanner</code>

  3)  Install VSCode Python extension or install <code>pip</code> through CLI

  5)  Run the program typing <code>python main.py</code> command

## Development

In this project, the program that implements the functionality above, is written in <code>port_scanner.py</code> file.It reads the unit tests from <code>test_modules.py</code>, accepts and interpretes correctly the inputs (f.e. accepts both as inputs an IP address and a domain name and converts the domain name into IP address if needed) and gives a verbose or non-verbose output according to the respective input.

The Python library that made all this functionality easy is the <code>socket</code> library with modules to convert domain names to IP addresses, connect to the ports and give outputs according to their condition (open/close). 
