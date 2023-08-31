import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import ArticleListPage from "./ArticleListPage";
import ProjectsPage from "./ProjectsPage";


export default function MainPage() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get("/article/get-all.php");
                setArticles(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchArticles();
    }, []);    

    const lastArticle = articles[0] || {
        "title": "🎲 Something",
        "date": "1984-08-31",
        "tags": "[\"Giraffe\", \"Cookie\"]"
    };

    const convertToURL = (articleTitle) => {
        return articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    return (
        <>
        <div className="section" style={{"--index": 0}}>
            <div className="section__header">What's this website?</div>
            <div className="section__content welcome">
                <p>Welcome to my chaotic corner of the Internet. This place? It's a mind dump. A vortex of unfiltered, unadulterated thoughts straight from the depths of my soul. This is where I unleash my thoughts, rants, ramblings, and reflections on this digital abyss.</p>
                <p>It's also a portfolio of my digital conquests. I showcase projects that I've painstakingly crafted with lines of code and endless coke bottles.</p>
            </div>
        </div>
        {!!(lastArticle) &&
        <div className="section" style={{"--index": 1}}>
            <div className="section__header">Last Article</div>
            <div className="section__content">
                <div className="article-list single-line">
                    <div className="article-list__year-group" style={{"--index": 0}}>
                        <div className="article-list__year-group__item-list">
                            <Link to={"/article/" +  lastArticle.id + "/" + convertToURL(lastArticle.title)} className="article-link" style={{"--index": 0}}>
                                <div className="article-link__info">
                                    <div className={`article-link__title ${lastArticle.id ? "" : "skeleton-text"}`}>{lastArticle.title}</div>
                                    <div className="article-link__tag-list">
                                    {JSON.parse(lastArticle.tags).map((tag, index) => (
                                        <div className={`tag ${lastArticle.id ? "" : "skeleton-text"}`}key={index}>{tag}</div>
                                    ))}
                                    </div>
                                </div>                                
                                <div className={`article-link__date article-link__date--long ${lastArticle.id ? "" : "skeleton-text"}`}>{new Date(lastArticle.date).toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric" })}</div>
                                <div className={`article-link__date article-link__date--short ${lastArticle.id ? "" : "skeleton-text"}`}>{new Date(lastArticle.date).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric" })}</div>
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>}
        <ProjectsPage index={3}></ProjectsPage>
        </>        
    );
}