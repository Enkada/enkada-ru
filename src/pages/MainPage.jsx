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

    const lastArticle = articles[0];

    const convertToURL = (articleTitle) => {
        return articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    return (
        <>
        <div className="section" style={{"--index": 0}}>
            <div className="section__header">What's this website?</div>
            <div className="section__content">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem, qui. Iure, libero sed. Aspernatur itaque consequuntur, at commodi ipsum dolor eius laborum dolores iusto id autem! Soluta itaque eum tempora, autem rem magni maxime. Rem delectus assumenda deserunt quidem ut aperiam, repellendus, voluptate omnis explicabo possimus vitae eveniet harum quis.</p>
            </div>
        </div>
        {!!(lastArticle) &&
        <div className="section" style={{"--index": 1}}>
            <div className="section__header">Last Article</div>
            <div className="section__content">
                <div className="article-list">
                    <div className="article-list__year-group" style={{"--index": 0}}>
                        <div className="article-list__year-group__item-list">
                            <Link to={"/article/" +  lastArticle.id + "/" + convertToURL(lastArticle.title)} className="article-link" style={{"--index": 0}}>
                                <div className="article-link__info">
                                    <div className="article-link__title">{lastArticle.title}</div>
                                    <div className="article-link__tag-list">
                                    {JSON.parse(lastArticle.tags).map((tag, index) => (
                                        <div className="tag" key={index}>{tag}</div>
                                    ))}
                                    </div>
                                </div>                                
                                <div className="article-link__date  article-link__date--long">{new Date(lastArticle.date).toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric" })}</div>
                                <div className="article-link__date article-link__date--short">{new Date(lastArticle.date).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric" })}</div>
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