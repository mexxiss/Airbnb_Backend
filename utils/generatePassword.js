import crypto from 'crypto';

export const generatePassword = () => {
    const length = 12; // You can change the length of the password
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    
    // Generate random password by selecting random characters from the set
    for (let i = 0; i < length; i++) {
        password += chars.charAt(crypto.randomInt(0, chars.length)); // random selection of char
    }

    return password;
}