import hashlib

def crack_sha1_hash(hash, use_salts=False):
  # Empty list to store the passwords from file
  passwords = []
  # Reads passwords from file to server
  filereader("top-10000-passwords.txt", passwords)
  # Checks if salts are enabled
  if use_salts:
    # Empty dictionary to store salted hashed passwords
    salted_passwords = {}
    # Reads salts from file to server
    salts = []
    filereader("known-salts.txt", salts)
    for salt in salts:
      for password in passwords:
        # Appends salts to passwords
        appended_password = hashlib.sha1(salt + password).hexdigest()
        # Prepends salts to passwords
        prepended_password = hashlib.sha1(password + salt).hexdigest()
        # Adds salted passwords to dictionary
        salted_passwords[appended_password] = password.decode("utf-8")
        salted_passwords[prepended_password] = password.decode("utf-8")
    # Checks if hash is in dictionary
    if hash in salted_passwords:
      return salted_passwords[hash]
    
  # Empty dictionary to store hashed passwords
  passwords_hashed = {}
  # Hashes each password using hashlib library
  for password in passwords:
    # .sha1 takes bytes not the actual text (rb) and .hexdigest converts the bytes to hex
    hash_line = hashlib.sha1(password).hexdigest()
    # .encode reconverts the bytes into text
    passwords_hashed[hash_line] = password.decode("utf-8")
  # Checks if the prehashed password is in the hashed passwords
  if hash in passwords_hashed:
    return passwords_hashed[hash]
    
  print(passwords_hashed)  
  return "PASSWORD NOT IN DATABASE"

def filereader(filename, array):
  # Reads passwords from file line by line changing the text to bytes
  with open(filename, "rb") as file:
    # strip() removes any whitespace characters like newline (\n) at the end of the line
    line = file.readline().strip()
    # While there are lines to read
    while line:
      array.append(line)
      # Reads the next line
      line = file.readline().strip()