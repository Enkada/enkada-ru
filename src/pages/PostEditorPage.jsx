import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Error404Page from "../Error404Page";
import FileViewer from "./FileViewer";

export default function PostEditorPage() {
    // --- Auth check START ---
    const {isEditor, ready} = useContext(UserContext);    
    const [redirect, setRedirect] = useState(false);

    useEffect(() => { if (!isEditor) setRedirect(true) }, [ready]);

    if (redirect) return <Error404Page/>
    if (!ready) return "Loading...";  
    // --- Auth check END ---

    const { id } = useParams();
    const isEditing = !!id;
	const navigate = useNavigate();

    useEffect(() => {
        if (isEditing) {
            axios.post(`/article/get.php?id=${id}`, { token: localStorage.getItem('token') }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).then(response => {
                const articleData = response.data;
                setTitle(articleData.title);
                setTitleRu(articleData.title_ru);

                setContent(articleData.content);
                setContentRu(articleData.content_ru);
                

                setDate(articleData.date);
                setTags(JSON.parse(articleData.tags));
                setIsHidden(articleData.is_hidden === "1");
            }).catch(error => {
                console.log('Error fetching article data: ', error);
            });
        }
        // ??? setTagInput("");
    }, [id, isEditing]);

    const [title, setTitle] = useState("");
    const [titleRu, setTitleRu] = useState("");
    const [content, setContent] = useState("");
    const [contentRu, setContentRu] = useState("");
    const [date, setDate] = useState(getCurrentDate());

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    
    const [isHidden, setIsHidden] = useState(false);

    const textareaRef = useRef(null);
    const textareaRefRu = useRef(null);

    useEffect(() => {
        adjustTextareaHeight();
    }, [content, contentRu]);

    useEffect(() => {
        setTagInput("");
    }, [tags]);

    const handleIsHiddenChange = (event) => {
        setIsHidden(event.target.checked);
    };

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const convertToURL = (articleTitle) => {
        return articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    const handleSave = () => {
        const data = new URLSearchParams();
        data.append('title', title);
        data.append('title_ru', titleRu);
        data.append('content', content);
        data.append('content_ru', contentRu);
        data.append("date", date);
        data.append("tags", JSON.stringify(tags));
        data.append("is_hidden", isHidden);
        data.append("token", localStorage.getItem('token'));

        if (isEditing) {
            // Make an API request to update the existing article
            axios.post(`/article/update.php?id=${id}`, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
            .then(response => {
                if (response.data.success) {
                    console.log('Updated article ' + id);
                    navigate('/article/' + id + "/" + convertToURL(title));
                }
                else {
                    console.log(response.data);
                }
            })
            .catch(error => {
                console.log('DB Error ', error);
            });
        } else {
            // Make an API request to create a new article
            axios.post('/article/add.php', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
            .then(response => {
                if (response.data.success) {
                    console.log('Inserted at ' + response.data.inserted);
                    navigate('/article/' + response.data.inserted + "/" + convertToURL(title));
                }
                else {
                    console.log(response.data);
                }
            })
            .catch(error => {
                console.log('DB Error ', error);
            });
        }
    };

    const handleTagInputKeyDown = (event) => {
        if (event.key === "Enter" && tagInput.trim() !== "") {
            setTags([...tags, tagInput]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
        //adjustTextareaHeight();
    };

    const handleContentRuChange = (e) => {
        setContentRu(e.target.value);
    };
    
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        textarea.style.height = `${textarea.scrollHeight + 2}px`;

        const textareaRu = textareaRefRu.current;
        textareaRu.style.height = `${textareaRu.scrollHeight + 2}px`;
    };

    return (
    <>
        <div className="section">
            <div className="section__header">{isEditing ? "Edit Article" : "New Article"}</div>
            <div className="section__content editor-form">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}/>
                <textarea value={content} ref={textareaRef} onChange={handleContentChange} rows="5"></textarea>
                <div className="original-group">                    
                    <input type="text" value={titleRu} onChange={e => setTitleRu(e.target.value)}/>
                    <textarea value={contentRu} ref={textareaRefRu} onChange={handleContentRuChange} rows="5"></textarea>
                </div>
                <FileViewer title={title}/>
                <div className="tag-input">
                    <div className="tag-input__list">
                        {tags.map((tag, index) => (
                        <div className="tag" key={index}>
                            {tag}
                            <span onClick={() => handleRemoveTag(tag)}>✖</span>
                        </div>
                        ))}
                    </div>
                    <input type="text" placeholder="Input tag and hit Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown}/>
                </div>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                <label><input type="checkbox" checked={isHidden} onChange={handleIsHiddenChange}/>Is Hidden</label>
                <button onClick={handleSave}>{isEditing ? "Update" : "Save"}</button>
            </div>
        </div>
                
    </>
    );
}