import React, { useContext, useEffect, useState } from "react";

const questions = [
    {
        question: "What is your name?",
        tags: [ "full", "call", "nickname", "username" ],
        answer: "My name is Sara Holt, also known as Enkada"
    },
    {
        question: "How old are you?",
        tags: [ "age", "birth", "date", "year", "born" ],
        answer: "I'm 20 years old. I was born on 17th of February, 2003"
    },
    {
        question: "Where are you from?",
        tags: [ "live", "home", "land", "country", "city", "place", "house" ],
        answer: "I'm from Russia"
    },
    {
        question: "Who is Sara Holt?",
        tags: [],
        answer: "That is me"
    },
    {
        question: "Coffee or tea?",
        tags: [ "prefer", "like", "drink" ],
        answer: "I prefer green tea"
    },
    {
        question: "What is this website about and why did you make it?",
        tags: [ "website", "site", "page", "about", "create", "make", "program", "design", "reason", "purpose" ],
        answer: "It's just a place to store all of my thoughts and things I made during my existance. I think everybody should have their own website"
    },
]

export default function QestionPage() {
    const [inputText, setInputText] = useState('');

    const getScore = (question, inputWords) => {
        const allWords = [...question.tags, question.question];
        let score = 0;
    
        console.log(question, allWords);
        for (const word of inputWords) {
            console.log(word);
            if (allWords.some((w) => word.toLowerCase().includes(w.toLowerCase()))) {
                if (lessValuedWords.includes(word)) {
                    score += .2;
                }
                else {
                    score += 2;
                }
            }
            else if (allWords.some((w) => w.toLowerCase().includes(word.toLowerCase()))) {
                if (lessValuedWords.includes(word)) {
                    score += .1;
                }
                else {
                    score += .2;
                }
            }
        }
    
        return score;
    };

    let filteredQuestions = []

    const inputWords = inputText.split(/\s+/).filter(Boolean); // Split input into words
    const lessValuedWords = ["is", "are", "of", "what", "how", "you", "your"];
    filteredQuestions = questions.filter((question) => getScore(question, inputWords) > .2);

    filteredQuestions.sort((a, b) => {
        return getScore(b, inputWords) - getScore(a, inputWords);
      });

    return (
        <>
        <div className="section">
            <div className="section__header">What's this website?</div>
            <div className="section__content">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem, qui. Iure, libero sed. Aspernatur itaque consequuntur, at commodi ipsum dolor eius laborum dolores iusto id autem! Soluta itaque eum tempora, autem rem magni maxime. Rem delectus assumenda deserunt quidem ut aperiam, repellendus, voluptate omnis explicabo possimus vitae eveniet harum quis.</p>
            </div>
        </div>
        <div className="question-search">
            <input type="text" className="question-search__input" onChange={(e) => setInputText(e.target.value)} placeholder="What's your name?"/>
            <div className="question-search__output">
                {filteredQuestions.sort().map((question, index) => 
                <div key={index}>[{getScore(question, inputWords)}] {question.question} - {question.answer}</div>
                )}
            </div>
        </div>
        </>        
    );
}