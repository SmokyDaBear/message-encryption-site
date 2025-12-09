# Message Encrypter

This is the source code for my message encrypter site.
It allows users to encrypt text through two layers of encryption, requiring a key to decode.
The actual site can be viewed [here](https://smokydabear.github.io/message-encryption-site/)

## Layers of Encryption

The first layer of encryption is a simple Caesar cipher, which shifts each letter by a fixed number of places in the alphabet.

The second layer is a Vigenère cipher, which uses a keyword to determine the shift for each letter.

When these are combined, they provide a more secure method of encryption.
Users can input their text and a key, and the site will return the encrypted message.

You can copy the link to send to others, who can then use the same key to decrypt the message back to its original form.

## Running the Tests

To run the tests for the encryption functions, use the following command in your terminal:

```bash
npm run tests
```
