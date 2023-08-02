import React, { useContext, useEffect, useState } from "react";

const skills = ["JavaScript, HTML, CSS", "SQL", "Git", "SASS", "REST API", "C#", "React.JS", "Node.JS", "PHP"]

export default function AboutPage() {

    return (
        <>
        <div className="section-row">
            <div className="section" style={{"--index": 0}}>
                <div className="section__header">Personal Info</div>
                <div className="section__content">
                    Kirill, 20yo, Russia
                </div>
            </div>
            <div className="section" style={{"--index": 1}}>
                <div className="section__header">Skills</div>
                <div className="section__content skill-list">
                    {skills.map((skill, index) => <div key={index} className="skill">{skill}</div>)}
                </div>
            </div>
        </div>
        </>        
    );
}