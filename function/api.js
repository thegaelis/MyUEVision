import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// Setting up the instance isn't used in the function below but can be useful in other contexts
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
});

async function translateText(textString) {
  const url = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'e5058aac94msha01dec9d4c212a5p146233jsn745bd9d64c96',
      'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com',
    },
    body: JSON.stringify({
      q: textString,
      source: 'en',
      target: 'vi',
    }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // If the response is not ok, throw an error
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result == null) {
      throw new Error('The server returned null value');
    }
    return result.data.translations.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
}

export {translateText};

const uploadImage = async base64String => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        imgBase64: base64String,
      }),
    });
    if (!response.ok) {
      // If the response is not ok, throw an error
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.generated_caption.generated_caption;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export {uploadImage};
