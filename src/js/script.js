const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById('search-button');

const createErrorMessage = (title, message, resolution) => {
    return `
        <div class="word">
            <p class="title">${title}</p>
        </div>
        <p class="word-meaning">${message}</p>
        <p class="word-example">${resolution}</p>
    `;
};

btn.addEventListener("click", async () => {
    try {
        const inp_word = encodeURIComponent(document.getElementById("word").value);
        const response = await fetch(`${apiUrl}${inp_word}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data from the API');
        }

        const [wordData] = await response.json();

        if (!wordData) {
            throw new Error('No definitions found');
        }

        result.innerHTML = `
            <div class="word">
                <h3 class="word-display">${inp_word} </h3>
                <button onclick="playSound()" class="sound-sample">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>            
                </button>
            </div>
            <div class="details">
                <p>${wordData.meanings[0]?.partOfSpeech || "N/A"}</p>
                <p>${wordData.phonetics[0]?.text || "N/A"}</p>
            </div>
            <p class="word-meaning">${wordData.meanings[0]?.definitions[0]?.definition || "N/A"}</p>
            <p class="word-example">${wordData.meanings[0]?.definitions[0]?.example || ""}</p>
        `;

        const audioUrl = wordData.phonetics[0]?.audio || "";
        audioUrl.startsWith('https') ? sound.setAttribute("src", audioUrl) : "";

    } catch (error) {
        console.error('Error:', error);

        const errorMessage = {
            title: 'No Definitions Found',
            message: "Sorry pal, we couldn't find definitions for the word you were looking for.",
            resolution: 'You can try the search again at a later time or head to the web instead.'
        };

        result.innerHTML = createErrorMessage(errorMessage.title, errorMessage.message, errorMessage.resolution);
    }
});

function playSound() {
    sound.play();
}
