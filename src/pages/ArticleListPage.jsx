import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function ArticleListPage() {
    const [articles, setArticles] = useState([]);
    const {isEditor} = useContext(UserContext);
    
    const [searchText, setSearchText] = useState('');
    const [selectedValue, setSelectedValue] = useState("Select tag");

    const tagFromUrl = new URLSearchParams(window.location.search).get('tag');

    useEffect(() => {
        if (tagFromUrl) {
            setSelectedValue(tagFromUrl);
        }

        const fetchArticles = async () => {
            

            try {
                if (isEditor) {
                    const response = await axios.post("/article/get-all.php", { token: localStorage.getItem('token') }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
                    setArticles(response.data);
                }
                else {
                    const response = await axios.get("/article/get-all.php");
                    setArticles(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchArticles();
    }, []);

    if (!articles.length) {
		return <div className="loading">Loading</div>;
	}

    const tagCounts = {};

    articles.forEach((obj) => {
        JSON.parse(obj.tags).forEach((tag) => {
        // Increment the tag count or initialize it to 1 if the tag is encountered for the first time
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    });

    const sortedTagCounts = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    const sortedTagCountsObject = Object.fromEntries(sortedTagCounts);

    const articlesByYear = Object.entries(articles.reduce((acc, article) => {
        const year = new Date(article.date).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }

        const search = searchText.trim() == "" || 
            article.title.toLowerCase().includes(searchText.toLowerCase()) ||
            article.content.toLowerCase().includes(searchText.toLowerCase()) ||
            article.title_ru.toLowerCase().includes(searchText.toLowerCase()) ||
            article.content_ru.toLowerCase().includes(searchText.toLowerCase())

        const tag = selectedValue == "Select tag" || JSON.parse(article.tags).includes(selectedValue);

        if (search && tag) {
            acc[year].push(article);
        }
        
        return acc;
    }, {})).sort((a, b) => b[0] - a[0]).filter(x => x[1].length != 0);

    const convertToURL = (articleTitle) => {
        return articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    const highlightText = (text) => {
        // Case-insensitive search and replace with <mark> tag
        const escapedQuery = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
        const regex = new RegExp(escapedQuery, 'gi');
        return text.replace(regex, (match) => `<mark>${match}</mark>`);
    };

    const findInstancesWithContext = (text) => {
        const escapedQuery = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
        const regex = new RegExp(`(.{0,30}${escapedQuery}.{0,30})`, 'gi');
        const instances = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            instances.push(match[1]);
        }
        return instances;
    };

    return (
        <>
        <div className="section">
            <div className="section__header">Articles</div>
            <div className="section__content">
                {!!isEditor && <Link className="btn btn--editor" to={"/editor"}>+ Add New</Link>}
                <div className="article-search">
                    <input type="search" className="article-search__input" placeholder="Search" onChange={(e) => setSearchText(e.target.value)}/>
                    <select className="article-search__select" value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
                        <option>Select tag</option>
                        {Object.keys(sortedTagCountsObject).map((tag, index) => (<option value={tag} key={index}>{tag} ({sortedTagCountsObject[tag]})</option>))}
                    </select>
                </div>
                <div className="article-list">
                {articlesByYear.map(([year, articlesByYear], yearIndex) => (
                    <div className="article-list__year-group" key={yearIndex} style={{"--index": yearIndex}}>
                        <div className="article-list__year-group__title">{year}</div>
                        <div className="article-list__year-group__item-list">
                        {articlesByYear.map((article, articleIndex) => (                            
                            <React.Fragment key={articleIndex}>
                            <Link to={"/article/" +  article.id + "/" + convertToURL(article.title)} key={article.id} className={`article-link ${article.is_hidden == 1 ? "hidden" : ""}`} style={{"--index": articleIndex}}>
                                <div className="article-link__info">
                                    <div className="article-link__title" dangerouslySetInnerHTML={{ __html: highlightText(article.title) }}></div>
                                    <div className="article-link__tag-list">
                                    {JSON.parse(article.tags).map((tag, index) => (
                                        <button className="tag" key={index} onClick={(e) => {e.preventDefault(); setSelectedValue(tag)}}>{tag}</button>
                                    ))}
                                    </div>
                                </div>
                                <div className="article-link__date article-link__date--long">{new Date(article.date).toLocaleDateString("en-US", {month: "long", day: "numeric"})}</div>
                                <div className="article-link__date article-link__date--short">{new Date(article.date).toLocaleDateString("en-US", {month: "short", day: "numeric"})}</div>
                            </Link>
                            {!!(searchText.trim().length > 0 && (article.content.toLowerCase().includes(searchText.toLowerCase()) || article.content_ru.toLowerCase().includes(searchText.toLowerCase()))) && 
                                <div className="article-content-search">
                                    {findInstancesWithContext(article.content).map((instance, instanceIndex) => (
                                        <div dangerouslySetInnerHTML={{ __html: highlightText(instance) }}></div>
                                    ))}
                                    {findInstancesWithContext(article.content_ru).map((instance, instanceIndex) => (
                                        <div className="ru-text" dangerouslySetInnerHTML={{ __html: highlightText(instance) }}></div>
                                    ))}
                                </div>}
                            </React.Fragment>
                            
                        ))}
                        </div>
                        
                    </div>
                ))}
                </div>
            </div>
        </div>        
        </>        
    );
}