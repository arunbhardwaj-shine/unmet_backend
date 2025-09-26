import crypto from 'crypto';

export const encryptedToken = async(id) => {
    let encrypted = await myCrypt(id, process.env.CIPHER_KEY, process.env.CIPHER_VECTOR);
    encrypted = encrypted.replace(/\+/g, ' ');
    return encrypted;
}

export const decryptedToken = async(userToken) => {
   let token = userToken.replace(/ /g, '+');
   var decryptor = crypto.createDecipheriv('aes-256-cbc', process.env.CIPHER_KEY, process.env.CIPHER_VECTOR);
   const decryptData = decryptor.update(token, 'base64', 'utf8') + decryptor.final('utf8');
   return decryptData;
}

export const myCrypt = async(value, key, iv) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encryptedData = cipher.update(value.toString(), 'utf8', 'base64');
  encryptedData += cipher.final('base64');
  return encryptedData;
}