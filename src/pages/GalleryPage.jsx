import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { ImageViewer } from "./ArticlePage";

export default function GalleryPage() {
    
    //const [files, setFiles] = useState([]);
    const [gallery, setGallery] = useState([]);

    const [viewerImageSrc, setViewerImageSrc] = useState('');

	const showViewer = (src) => {
		setViewerImageSrc(src);
	};

	const resetViewer = () => {
		setViewerImageSrc('');
	};

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = () => {
        axios.get('/upload/get.php').then((response) => {
            //setFiles(response.data.files);

            response.data.gallery.forEach((item) => {
                if (item.parent != "0") {
                    const parent = response.data.gallery.find(x => x.id == item.parent);
                    if(!parent?.children) {
                        parent.children = [];
                    }
                    parent.children.push(item);
                }
            });

            setGallery(groupByYearAndMonth(response.data.gallery.filter(x => x.parent == 0).sort((a, b) => (b.date > a.date ? 1 : -1))));
        })
        .catch((error) => {
            console.error(error);
        });
    };

    //const sortedData = gallery;

    const groupByYearAndMonth = (data) => {
        const groupedData = {};

        data.forEach((item) => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.toLocaleString('default', { month: 'long' });

            if (!groupedData[year]) {   
            groupedData[year] = {};
            }

            if (!groupedData[year][month]) {
            groupedData[year][month] = [];
            }

            groupedData[year][month].push(item);
        });

        return groupedData;
    };

    //const groupedData = groupByYearAndMonth(sortedData);

    return (
        <>
        <div>
        
        </div>
        <div className="section" style={{"--index": 0}}>
            {/* <div className="section__header">Gallery</div> */}
            <div className="section__content gallery">
            {Object.keys(gallery).sort((a, b) => b - a).map((year, yearIndex) => (
                <div className="gallery__year" key={year} style={{"--index": yearIndex}}>
                    <div className="gallery__year__title">{year}</div>
                    {Object.keys(gallery[year]).map((month) => (
                        <div className="gallery__month" key={month}>
                            <div className="gallery__month__title">{month}</div>
                            <div className="gallery__month__image-list">
                                {gallery[year][month].map((image, index) => (
                                    <React.Fragment key={index}>{!image.children ? 
                                        <img src={axios.defaults.baseURL + "/files/" + image.name} alt={image.title} onClick={() => showViewer(axios.defaults.baseURL + "/files/" + image.name)}/>: 
                                        <div className="gallery__image-block">
                                            <img src={axios.defaults.baseURL + "/files/" + image.name} alt={image.title} onClick={() => showViewer(axios.defaults.baseURL + "/files/" + image.name)}/>
                                            {image.children.map((child, index) => (
                                                <img key={index} src={axios.defaults.baseURL + "/files/" + child.name} alt={child.title} onClick={() => showViewer(axios.defaults.baseURL + "/files/" + child.name)}/>
                                            ))}
                                        </div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            </div>
        </div>
        
        <ImageViewer viewerImageSrc={viewerImageSrc} resetViewer={resetViewer} galleryData={gallery}/>
        </>        
    );
}