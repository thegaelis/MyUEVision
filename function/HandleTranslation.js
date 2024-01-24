import React from "react";
const HandleTranslation = async () => {
    try{
const response = await fetch(`https://deep-translate1.p.rapidapi.com/language/translate/v2`,{
    method: 'POST',
    headers: {
        'content-type': 'application/json',
    'X-RapidAPI-Key': '0519ed7368msh95e46583c4afefdp194060jsne126059cd088',
    'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com' 
    },
    body: {
        "q": "Hello World!",
    "source": "en",
    "target": "vn"
    }
})
const data = await response.json();
console.log(data);
return JSON.stringify(data);
} catch (error) {
    console.error('error: ',error);
}
}
export default HandleTranslation;