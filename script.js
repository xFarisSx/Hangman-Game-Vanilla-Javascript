async function mainApp() {
    const wordEl = document.getElementById("word");
    const wrongLettersEl = document.getElementById("wrong-letters");
    const playAgainBtn = document.getElementById("play-button");
    const notification = document.getElementById("not-container");
    const finalMessage = document.getElementById("final-message");
    const popup = document.getElementById("popup-container");

    const parts = document.querySelectorAll(".figure-part");

    // const words = ["application", "programming", "interface", "wizard"];

    // let selectedWord = words[Math.floor(Math.random() * words.length)];
    let res = await fetch("https://random-words-api.vercel.app/word");
    let data = await res.json();
    let selectedWord = data[0].word;
    console.log(data);

    let won = false;

    const correctLetters = [];
    const wrongLetters = [];

    function displayWord() {
        if (won) return;
        wordEl.innerHTML = `
		${selectedWord
            .split("")
            .map(
                (letter) => `<span class="letter">
			${correctLetters.includes(letter) ? letter : ""}
		</span>`
            )
            .join("")}
	`;

        const innerWord = wordEl.innerText.replace(/\n/g, "");

        if (innerWord === selectedWord) {
            finalMessage.innerText = "Congratulations! You Won!";
            popup.style.display = "flex";
            won = true;
        }
    }

    function updateWrongLettersEl() {
        wrongLettersEl.innerHTML = `
	<p>Wrong Letters:</p>
	${wrongLetters
        .map((letter) => {
            return `<span>${letter}</span>`;
        })
        .join()}
	`;

        parts.forEach((part, i) => {
            if (i < wrongLetters.length) {
                part.style.display = "block";
            } else {
                part.style.display = "none";
            }
        });

        if (wrongLetters.length === parts.length) {
            finalMessage.innerText = `You Have Lost! The word is '${selectedWord}'`;

            popup.style.display = "flex";
            won = false;
        }
    }

    function showNot() {
        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, 2000);
    }

    window.addEventListener("keydown", (e) => {
        if (!(e.keyCode >= 65) || !(e.keyCode <= 90)) {
            return;
        }
        if (won) return;
        const letter = e.key;

        if (selectedWord.includes(letter)) {
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);

                displayWord();
            } else {
                showNot();
            }
        } else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);

                updateWrongLettersEl();
            } else {
                showNot();
            }
        }
    });

    displayWord();

    playAgainBtn.addEventListener("click", (e) => {
        window.location.reload();
    });
}
mainApp();
