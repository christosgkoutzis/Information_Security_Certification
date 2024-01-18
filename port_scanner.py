import socket
import re
import common_ports


def get_open_ports(target, port_range, verbose=False):
  ip = ""
  open_ports = []
  try:
    # gethostbyname takes as parameter a domain name and gives output the IP address
    ip = socket.gethostbyname(target)
    # Check main.py tests on how the 2 indeces of port_range are used
    for port in range(port_range[0], port_range[1]+1):
      # Declares socket object with IPv4 protocol (AF_INET) and TCP (SOCK_STREAM)
      s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      # Sets a timeout of 1 second for the socket to open
      socket.setdefaulttimeout(1)
      # Tries to connect to the port and returns an error if it fails
      result = s.connect_ex((ip, port))
      # If the port is open, it adds it to the list of open ports
      if result == 0:
        open_ports.append(port)
      # Closes the socket
      s.close()
  # If Ctrl + C is pressed while the program is running
  except KeyboardInterrupt:
    return "Exiting port scanner..."
  # 404 error in the IP address
  except socket.gaierror:
    # Checks if ip is a hostname
    if re.search('[a-zA-Z]', target):
      return "Error: Invalid hostname"
    # ip is an IP address
    return "Error: Invalid IP address"
  except socket.error:
    return "Error: Invalid IP address"
  
  host = None
  # Tries to get hostname if the input was IP address
  try:
    host = socket.gethostbyaddr(ip)[0]
  except socket.herror:
    host = None
  # Gives result as project's instructions
  result = "Open ports for "
  if host is not None:
    result += "{url} ({ip})\n".format(url=host, ip=ip)
  else:
    result += "{ip}\n".format(ip=ip)
  if verbose:
    # Will give a list of open ports along with the service name (f.e. 80 HTTP)
    header = "PORT     SERVICE\n"
    body = ""
    for port in open_ports:
      try:
        body += "{po}".format(po=port) + " " * (9 - len(str(port))) + "{service}".format(service=common_ports.ports_and_services[port])
      except OSError:
        body += "{po}".format(po=port) + " " * (9 - len(str(port))) + "{service}\n".format(service="Unknown")
      # If we are not in the final loop, a new line is added
      if(open_ports[len(open_ports) - 1] != port):
        body += "\n"
    return result + header + body  
  return(open_ports)