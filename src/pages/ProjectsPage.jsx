import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const projects = [
    {
        title: "Blog Engine (CMS)",
        image: "blog.jpg",
        link: "https://blog.enkada.ru",
        article: "61/hedgehog-blog-engine-cms"
    },
    {
        title: "Web Forum (CMS)",
        image: "forum.jpg",
        link: "https://forum.enkada.ru",
        article: "72/web-forum"
    },
    {
        title: "DotaN Match Statistics",
        image: "dotan.jpg",
        link: "https://dotan.enkada.ru",
        article: "73/dotan-match-statistics"
    },
    // {
    //     title: "VN Engine",
    //     image: "nkd.png"
    // },
    // {
    //     title: "SG Census",
    //     image: "census.png"
    // },
]

export default function ProjectsPage(props) {

    return (
        <>
        <div className="section" style={{"--index": props.index ?? 0}}>
            <div className="section__header">Projects</div>
            <div className="section__content project-list">
                {projects.map((project, index) => 
                <div key={index} className="project" style={{'backgroundImage':`url(${project.image})`}}>
                    <Link className="project__article" to={"article/" + project.article}>
                        <div className="project__title">{project.title}</div>                    
                    </Link>
                    <a href={project.link} target="_blank" className="project__link">🔗</a>
                </div>)}
            </div>
        </div>
        </>        
    );
}