const crypto = require('crypto');

const crypt = {}

const salt = process.env.SALT
const key = crypto.pbkdf2Sync(salt, salt, 100000, 32, 'sha256')

crypt.encrypt = (data) => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex')
    const combined = iv.toString('hex') + encrypted

    return combined
}

crypt.decrypt = (data = '') => {
    const combinedBuffer = Buffer.from(data, 'hex');
    const separatedIV = combinedBuffer.slice(0, 16);
    const separatedData = combinedBuffer.slice(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, separatedIV);
    let decrypted = ''
    try {
        decrypted = decipher.update(separatedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    } catch (error) {
        console.error('Decryption failed:', error);
    }

    return decrypted
}

module.exports = crypt