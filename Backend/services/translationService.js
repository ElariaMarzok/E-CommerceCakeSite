
async function translateFieldsToEnglish(fieldsMap) {
    const entries = Object.entries(fieldsMap);
    const results = {};

    for (const [key, text] of entries) {
        try {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`;
            const res  = await fetch(url);
            const data = await res.json();
            results[key] = data.responseData?.translatedText || text;
        } catch (err) {
            console.warn(`[Translation] Failed for "${key}" — keeping original`);
            results[key] = text; // fallback: نفس النص
        }
    }

    return results;
}

module.exports = { translateFieldsToEnglish };