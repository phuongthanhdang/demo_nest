import {
  createCipheriv,
  randomBytes,
  createDecipheriv,
  createHash,
} from 'crypto';

const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = randomBytes(32);
const iv = randomBytes(16);

export const encryptData = (data) => {
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

export const decryptData = (data) => {
  const iv = Buffer.from(data.iv, 'hex');
  const encryptedText = Buffer.from(data.encryptedData, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
