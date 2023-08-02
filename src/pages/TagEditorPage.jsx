import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Error404Page from '../Error404Page';
import { UserContext } from '../UserContext';

const TagEditorPage = () => {
    // --- Auth check START ---
    const {isEditor, ready} = useContext(UserContext);    
    const [redirect, setRedirect] = useState(false);

    useEffect(() => { if (!isEditor) setRedirect(true) }, [ready]);

    if (redirect) return <Error404Page/>
    if (!ready) return "Loading...";  
    // --- Auth check END ---

    const { name } = useParams();
    const [existingTag, setExistingTag] = useState(null);
    const [tagDescription, setTagDescription] = useState('');

    useEffect(() => {
        // Fetch existing tag data from the backend API
        const fetchTags = async () => {
            try {
                const response = await axios.get('/tag/get.php');
                setExistingTag(response.data.find((tag) => tag.name === name));
                setTagDescription(response.data.find((tag) => tag.name === name).description);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTags();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (existingTag) {
            // Edit existing tag
            try {
                await axios.post(`tag/update.php?id=` + existingTag.id, {
                    name: name,
                    description: tagDescription,
                    token: localStorage.getItem('token')
                }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
                console.log('Tag updated successfully');
                window.history.back();
            } catch (error) {
                console.error(error);
            }
        } else {
            // Create new tag
            try {
                await axios.post('tag/add.php', {
                    name: name,
                    description: tagDescription,
                    token: localStorage.getItem('token')
                }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
                console.log('Tag created successfully');
                window.history.back();
            } catch (error) {
                console.error(error);
            }
        }
    };


    return (
        <div className="section">
            <div className="section__header">{existingTag ? "Edit Tag" : "Add Tag"}</div>
            <div className="section__content editor-form">
                <input id="name" type="text" value={name} disabled/>
                <textarea id="tagDescription" value={tagDescription} onChange={(e) => setTagDescription(e.target.value)}></textarea>
                <button onClick={handleSubmit} type="submit">Submit</button>
            </div>
        </div>
    );
};

export default TagEditorPage;