import React, { useContext, useEffect, useState } from "react";

const skills = ["JavaScript, HTML, CSS", "SQL", "Git", "SASS", "REST API", "C#", "React.JS", "Node.JS", "PHP"]

export default function AboutPage() {

    function calculateAge(birthDate) {
        const today = new Date();
        const birthDateObj = new Date(birthDate);

        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }

        return age;
    }

    return (
        <>
            <div className="section-row">
                <div className="section" style={{ "--index": 0 }}>
                    <div className="section__header">Personal Info</div>
                    <div className="section__content">
                        Kirill, {calculateAge("2003-02-17")}yo, Russia
                    </div>
                </div>
                <div className="section" style={{ "--index": 1 }}>
                    <div className="section__header">Skills</div>
                    <div className="section__content skill-list">
                        {skills.map((skill, index) => <div key={index} className="skill">{skill}</div>)}
                    </div>
                </div>
            </div>
        </>
    );
}