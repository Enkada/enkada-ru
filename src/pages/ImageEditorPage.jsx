import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Error404Page from '../Error404Page';

const ImageEditorPage = () => {
    // --- Auth check START ---
    const {isEditor, ready} = useContext(UserContext);    
    const [redirect, setRedirect] = useState(false);

    useEffect(() => { if (!isEditor) setRedirect(true) }, [ready]);

    if (redirect) return <Error404Page/>
    if (!ready) return "Loading...";  
    // --- Auth check END ---
    
    const [imageData, setImageData] = useState(null);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        // Fetch existing tag data from the backend API
        const fetchTags = async () => {
            try {
                const response = await axios.get('/upload/get.php');
                const name = new URLSearchParams(window.location.search).get('name');
                const image = response.data.gallery.find(x => x.name == name);

                image.children = response.data.gallery.filter(x => x.parent == image.id) ?? [];
                setTitle(image.title);
                setDescription(image.description);
                setDate(getInputDate(image.data));
                setImageData(image);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTags();
    }, []);

    function getInputDate(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const handleSubmit = async (event) => {
        try {
            await axios.post(`upload/update.php`, {
                title: title,
                description: description,
                date: date,
                id: imageData.id,
                token: localStorage.getItem('token')
            }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            console.log('Tag updated successfully');
            window.history.back();
        } catch (error) {
            console.error(error);
        }
    };

    if (!imageData) {
        return "Loading"
    }

    return (
        <div className="section">
            <div className="section__header">Edit {imageData.name}</div>
            <div className="section__content editor-form">
                <div className="image-editor">
                    <img src={axios.defaults.baseURL + "/files/" + imageData.name}/>
                    {imageData.children.map((image, index) => (
                        <img key={index} src={axios.defaults.baseURL + "/files/" + image.name}/>
                    ))}
                </div>
                <p>Original: {imageData.original_name} ({Math.round(imageData.size / 1024 / 1024 * 100) / 100} Mb)</p>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}/>
                <textarea placeholder='Description' rows="2" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                <button onClick={handleSubmit} type="submit">Submit</button>
            </div>
        </div>
    );
};

export default ImageEditorPage;