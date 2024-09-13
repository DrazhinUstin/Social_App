import ky from 'ky';

export const api = ky.create({
  parseJson: (text) =>
    JSON.parse(text, (key, value) => (key.includes('At') ? new Date(value) : value)),
});
