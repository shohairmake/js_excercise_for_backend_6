(() => {
    const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
    const gameState =  {
        quizzes : [],
        currentIndex : 0,
        numberOfCorrects : 0
    };
    
    const questionElement = document.getElementById('question');
    const resultElement = document.getElementById('result');
    const answersContainer = document.getElementById('answers');
    const restartButton = document.getElementById('restart-button');

    window.addEventListener('load', (event) => {
        fetchQuizData();
    });
    restartButton.addEventListener('click', (event) => {
        fetchQuizData();
    });

    const fetchQuizData = async () => {
        questionElement.textContent = 'Now loading...';
        resultElement.textContent = '';
        restartButton.hidden = true;
        try{
            const response = await fetch(API_URL);
            const data = await response.json();
            gameState.quizzes = data.results;
            gameState.currentIndex = 0;
            gameState.numberOfCorrects = 0;
            setNextQuiz();
        }catch (error) {
            alert(`読み込み失敗...(${error.message})`);
        }
    };

    const setNextQuiz = () => {
        questionElement.textContent = '';
        removeAllAnswers();
        if(gameState.currentIndex < gameState.quizzes.length){
            const quiz = gameState.quizzes[gameState.currentIndex];
            makeQuiz(quiz);
        }else{
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        resultElement.textContent = `${gameState.numberOfCorrects}/${gameState.quizzes.length} corrects`;
        restartButton.hidden = false;
    };

    const removeAllAnswers = () => {
        while(answersContainer.firstChild){
            answersContainer.removeChild( answersContainer.firstChild );
        }
    };

    const makeQuiz = (quiz) => {
        const answers = buildAnswers(quiz);
        questionElement.textContent = unescapeHTML(quiz.question);
        answers.forEach((answer) => {
            const liElement = document.createElement('li');
            liElement.className = 'button';
            liElement.textContent = unescapeHTML(answer);
            answersContainer.appendChild(liElement);

            liElement.addEventListener('click', (event) => {
                unescapedCorrectAnswer = unescapeHTML(quiz.correct_answer);
                if(event.target.textContent === unescapedCorrectAnswer){
                    gameState.numberOfCorrects++;
                    alert('Correct answer!!');
                }else{
                    alert(`Wrong answer... (The correct answer is "${unescapedCorrectAnswer}")`);
                }
                gameState.currentIndex++;
                setNextQuiz();
            });
        });
    };

    const buildAnswers = (quiz) => {
        const answers = [
            quiz.correct_answer,
            ...quiz.incorrect_answers
        ];
        const shuffledAnswers = shuffle(answers);
        return shuffledAnswers;
    };

    const shuffle = (array) => {
        const copiedArray = [...array];
        for(let i = copiedArray.length -1; i >= 0; i--){
            const rand = Math.floor(Math.random() * (i + 1));
            [copiedArray[i], copiedArray[rand]] = [copiedArray[rand], copiedArray[i]]
        }
        return copiedArray;
    };

    const unescapeHTML = (str) => {
        const div = document.createElement("div");
        div.innerHTML = str.replace(/</g,"&lt;")
                           .replace(/>/g,"&lt;")
                           .replace(/ /g, "&nbsp;")
                           .replace(/\r/g, "&#13;")
                           .replace(/\n/g, "&#10;");

        return div.textContent || div.innerText;
    };
})();