import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function FileViewer(props) {
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [articles, setArticles] = useState([]);

    const [articleTitle, setArticleTitle] = useState("My Image");
    
    const [imageToUpload, setImageToUpload] = useState(null);
    const [imageSrc, setImageSrc] = useState('');
    //const [isAddedToGallery, setIsAddedToGallery] = useState(false);
    const [uploadType, setUploadType] = useState('standart');
    const [uploadParent, setUploadParent] = useState(0);
    const [isOptimized, setIsOptimized] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(getCurrentDate());

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setImageToUpload(file);
                setDate(getInputDate(file.lastModifiedDate));
            };
            reader.readAsDataURL(file);
        } else {
            uploadFile(file);
        }
    };

    useEffect(() => {
        axios.get('/article/get-all.php').then((response) => {
            setArticles(response.data);
        })
        .catch((error) => {
            console.error(error);
        });

        fetchFiles();
    }, []);

    const fetchFiles = () => {
        axios.get('/upload/get.php').then((response) => {
            setFiles(response.data.files.sort());
            setGallery(response.data.gallery);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const handleDelete = (fileName) => {
        if (window.confirm(`Delete file "${fileName}"?`)) {
            axios.post('/upload/delete.php', { fileName, token: localStorage.getItem('token') }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response) => {
                console.log(response);
                fetchFiles(); // Refresh the file list after deletion
            })
            .catch((error) => {
                console.error(error);
            });
        }
    };

    const resetUpload = (fileName) => {
        setTitle('');
        setImageToUpload('');
        setImageSrc('');
        setDescription('');
        setUploadType('standart');
        resetFileInput();
    };
    
    const handleCustomUpload = () => {
        const formData = new FormData();
        formData.append('file', imageToUpload);
        formData.append('optimize', isOptimized);
        formData.append('mode', uploadType);
        formData.append('parent', uploadParent);
        formData.append('date', date);
        formData.append('title', title);
        formData.append('description', description);        
        formData.append("token", localStorage.getItem('token'));

        axios.post('/upload/add.php', formData).then((response) => {
            resetUpload();
            fetchFiles();
        })
        .catch((error) => {
            // Handle error
            console.error(error);
        });
    };

    const uploadFile = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append("token", localStorage.getItem('token'));

        axios.post('/upload/add.php', formData).then((response) => {
            // Handle successful upload response
            console.log(response);
            resetFileInput();
            fetchFiles();
        })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    };

    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleCopyClick = (text) => {
        navigator.clipboard.writeText(text);
    };

    const getFileTitle = (fileName) => {
        return gallery.find(x => x.name == fileName)?.title ?? (props?.title?.replace(/[^-a-zA-Z0-9,'()!?"\s]/g, '').trim() ?? "My Image");
    };

    const fileGroups = files.reduce((categories, fileName, index) => {
        const extension = fileName.split('.').pop();

        if (['png', 'jpeg', 'jpg', 'gif'].includes(extension)) {
            const isUsed = articles.filter(x => x.content.includes(fileName) || x.content_ru.includes(fileName)).length > 0;

            const image = <div key={index} className={`file file--image`}>
                <img src={axios.defaults.baseURL + "/files/" + fileName}/>
                <div className='btn-file btn-file--delete' onClick={() => handleDelete(fileName)}>✖</div>
                <div className='btn-file btn-file--copy' onClick={() => handleCopyClick(`![${getFileTitle(fileName)}](${fileName})`)}>💾</div>
            </div>

            if (isUsed) {
                categories.images.used.push(image);
            }
            else {   
                categories.images.unused.push(image);
            }
        } else if (['.mp4', '.webm'].includes(extension)) {
            categories.videos.push(
                <div key={index} className='file file--video'>
                    {fileName}
                    <button onClick={() => handleDelete(fileName)}>✖</button>                    
                </div>
            );
        } else {
            categories.other.push(
                <div key={index} className='file file--other'>
                    <a href={axios.defaults.baseURL + "/files/" + fileName}>{fileName}</a>
                    <div className='btn-file btn--emoji btn-file--delete' onClick={() => handleDelete(fileName)}>✖</div>
                    <div className='btn--emoji btn-file--copy' onClick={() => handleCopyClick(`[${fileName}](${fileName})`)}>💾</div>
                </div>
            );
        }

        return categories;
    }, { images: { used: [], unused: []}, videos: [], other: [] })

    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function getInputDate(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    return (
        <div className='file-viewer'>
            {!!imageToUpload && 
            <div className="file-viewer__image-upload">
                <img className='file-viewer__image-upload__image' src={imageSrc} />
                <div className="file-viewer__image-upload__settings">
                    <label><input type="checkbox" checked={isOptimized} onChange={(e) => setIsOptimized(e.target.checked)}/> Optimize file size</label>
                    <label><input type="radio" value="standart" checked={uploadType === 'standart'} onChange={(e) => setUploadType(e.target.value)} name='upload-type'/> Standart</label>
                    <label><input type="radio" value="gallery" checked={uploadType === 'gallery'} onChange={(e) => setUploadType(e.target.value)} name='upload-type' /> Add to gallery 🖼</label>
                    <label><input type="radio" value="child" checked={uploadType === 'child'} onChange={(e) => setUploadType(e.target.value)} name='upload-type' /> Append to parent</label>

                    {!!(uploadType === 'gallery') && <div className="file-viewer__image-upload__settings__gallery">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                        <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}/>
                        <textarea placeholder='Description' rows="2" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    </div>}

                    {!!(uploadType === 'child') && 
                    <select value={uploadParent} onChange={(e) =>{console.log(e); setUploadParent(e.target.value)}}>
                        <option key={-1} value={0}>Select Parent</option>
                        {gallery.filter(x => x.parent == 0).map((image, index) => (<option key={index} value={image.id}>{image.title}</option>))}
                    </select>}

                    <button onClick={handleCustomUpload} 
                        disabled={!((uploadType === 'child' && uploadParent != 0) || (uploadType === 'gallery' && title != "") || uploadType === 'standart')}>Upload Image</button>
                    <button onClick={resetUpload}>Cancel</button>
                </div>
                
            </div>
            }
            <div className='file-viewer__tab-control'>
                <div className="file-viewer__tab-control__tab-list">
                    <button className={activeTab === 0 ? 'active' : ''} onClick={() => handleTabClick(0)}>Images ({fileGroups.images.length})</button>
                    <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}>Videos ({fileGroups.videos.length})</button>
                    <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}>Other ({fileGroups.other.length})</button>
                    <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange}/>
                    <button onClick={handleClick}>Upload File</button>
                </div>
                <div className="file-viewer__tab-control__content">
                {activeTab === 0 && <>
                    <div className='image-group image-group--unused'>{fileGroups.images.unused}</div>
                    <div className='image-group image-group--used'>{fileGroups.images.used}</div>
                </>}
                {activeTab === 1 && fileGroups.videos}
                {activeTab === 2 && fileGroups.other}
                </div>
            </div>
        </div>
    );
};