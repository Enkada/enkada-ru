import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const projects = [
    {
        title: "Blog Engine (CMS)",
        image: "blog.png",
        article: "61/hedgehog-blog-engine-cms"
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
                <Link to={"article/" + project.article} key={index} style={{'backgroundImage':`url(${project.image})`}} className="project">
                    <div className="project__title">{project.title}</div>
                </Link>)}
            </div>
        </div>
        </>        
    );
}