import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const Ajax = async function (url, uploadData = undefined) {
  try {
    const res = await Promise.race([
      timeout(TIMEOUT_SEC),
      uploadData
        ? fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
          })
        : fetch(url),
    ]);

    const data = await res.json();
    if (!res.ok) throw new Error(`${res.status} : ${res.statusText}`);
    return data;
  } catch {
    throw err;
  }
};
