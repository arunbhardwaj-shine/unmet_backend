import crypto from 'crypto';

export const encryptedToken = async(id) => {
    let encrypted = await myCrypt(id, process.env.CIPHER_KEY, process.env.CIPHER_VECTOR);
    encrypted = encrypted.replace(/\+/g, ' ');
    return encrypted;
}

export const myCrypt = async(value, key, iv) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encryptedData = cipher.update(value.toString(), 'utf8', 'base64');
  encryptedData += cipher.final('base64');
  return encryptedData;
}