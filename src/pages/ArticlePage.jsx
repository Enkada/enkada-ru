import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

export function ImageViewer(props) {
	const [viewerVisible, setViewerVisible] = useState(false);
	const [viewerPosition, setViewerPosition] = useState({ x: 0, y: 0 });
	const [viewerScale, setViewerScale] = useState(1);
	const [isDragging, setIsDragging] = useState(false);
	const viewerRef = useRef(null);
	
    const {isEditor} = useContext(UserContext);
	
    const [gallery, setGallery] = useState([]);
    const [imageData, setImageData] = useState(null);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

	const { viewerImageSrc, resetViewer, imageList, setViewerImageSrc } = props;
	
    const [neighboringImages, setNeighboringImages] = useState({ next: null, prev: null });

	useEffect(() => {
		if (viewerImageSrc) {
			setViewerVisible(true);
			const image = gallery.find(x => x.name == viewerImageSrc.split('/').at(-1));

			if (imageList?.length) {
				const targetImage = viewerImageSrc;
				const targetIndex = imageList.indexOf(targetImage);

				let neighboringImages = { next: null, prev: null }

				if (targetIndex !== -1) {

					if (targetIndex > 0) {
						neighboringImages.prev = imageList[targetIndex - 1];
					}

					if (targetIndex < imageList.length - 1) {
						neighboringImages.next = imageList[targetIndex + 1];
					}

					setNeighboringImages(neighboringImages);
				} else {
					console.log("Image not found in the array.");
				}
			}

			if (!image) {
				setImageData(null);
				return;
			}

			if (image.parent != 0) {
				const parent = gallery.find(x => x.id == image.parent);
				image.title = parent.title;
				image.description = parent.description;
				image.date = parent.date;
				image.parent_name = parent.name;
				image.occurrences = parent.occurrences;
			}
			setImageData(image);
		} else {
			setViewerVisible(false);
			setImageData(null);
		}
	}, [viewerImageSrc]);

	useEffect(() => {
		axios.get('/article/get-all.php').then((response) => {
			const articles = response.data;

			axios.get('/upload/get.php').then((response) => {
				
				response.data.gallery.forEach(image => {
					if (image.parent == 0) {
						image.occurrences = articles.filter(x => x.content.includes(image.name) || x.content_ru.includes(image.name));						
					}
				});

				setGallery(response.data.gallery);
			})
			.catch((error) => {
				console.error(error);
			});
		})
		.catch((error) => {
			console.error(error);
		});
	}, []);


	const hideViewer = () => {
		setViewerVisible(false);
		setViewerPosition({
			x: 0,
			y: 0
		});
		resetViewer();
	};

	const handleMouseDown = () => {
		setIsDragging(true);
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		const handleMouseMove = (event) => {
			if (viewerVisible && isDragging) {
				const { movementX, movementY } = event;

				setViewerPosition(prevPosition => ({
					x: prevPosition.x + movementX,
					y: prevPosition.y + movementY
				}));
			}
		};

		const handleScroll = (event) => {

			if (viewerVisible) {
				event.preventDefault();
				const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
				setViewerScale((prevScale) => prevScale * scaleFactor);
			}
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('wheel', handleScroll, { passive: false });
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('wheel', handleScroll);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [viewerVisible, isDragging]);

	//console.log(neighboringImages);

	return (<>{viewerVisible && (
		<div className="image-viewer" ref={viewerRef} onMouseDown={handleMouseDown} style={{transform: `translate(${viewerPosition.x}px, ${viewerPosition.y}px) scale(${viewerScale})`,}}>
			
			{!!imageData && 
			<>
			<div className="image-viewer__info">
				<div className="image-viewer__title">{imageData.title}</div>
				<div className="image-viewer__date">{new Date(imageData.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>			
			</div>		
			<div className="btn-show-description btn--emoji" onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}>ℹ</div>			
			</>}
			{!!(imageData && isEditor) && (imageData.parent == 0 ? 
				<Link to={"/image/?name=" + imageData.name} className="btn-edit btn--emoji">✏️</Link> :
				<Link to={"/image/?name=" + imageData.parent_name} className="btn-edit btn--emoji">✏️</Link>
			)}
			
			{!!(imageData && isDescriptionVisible) && <div className="image-viewer__description" onClick={(e) => {e.preventDefault(); setIsDragging(false);}}>
				{imageData.description}
				{!!(imageData && imageData.occurrences.length) && <>
				<br/><br/>Appears in: 
					{imageData.occurrences.map((article, index) => (<Link to={"/article/" + article.id}> {article.title}</Link>))}
				</>}
			</div>}
			<div className="btn-close-viewer btn--emoji" onClick={hideViewer}>✖</div>
			{!!neighboringImages.next && <div className="btn-next" onClick={() => setViewerImageSrc(neighboringImages.next)}>{">"}</div>}
			{!!neighboringImages.prev && <div className="btn-prev" onClick={() => setViewerImageSrc(neighboringImages.prev)}>{"<"}</div>}
			<img src={viewerImageSrc} />
		</div>)}
	</>);
}

export default function ArticlePage() {
	const { id } = useParams();
	const [article, setArticle] = useState(null);
	const [tagData, setTagData] = useState([]);
	const navigate = useNavigate();

	const { isEditor } = useContext(UserContext);
	const [isOriginal, setIsOriginal] = useState(false);

	const [neighborArticles, setNeighborArticles] = useState([]);

	const [viewerImageSrc, setViewerImageSrc] = useState('');

	const [articleImages, setArticleImages] = useState([]);

	const showViewer = (src) => {
		setViewerImageSrc(src);
	};

	const resetViewer = () => {
		setViewerImageSrc('');
	};

	const setImageList = (data) => {
		const matches = data.match(/!\[.*?\]\((.*?)\)/g);

		if (matches) {
			const imageUrls = matches.map(match => {
				let imageUrl = match.match(/!\[.*?\]\((.*?)\)/)[1];
				imageUrl = imageUrl.includes("http") ? imageUrl : axios.defaults.baseURL + "/files/" + imageUrl;
				return imageUrl;
			});
			
			setArticleImages(imageUrls);
		}
	}

	useEffect(() => {
		const fetchArticle = async () => {
			try {
				if (isEditor) {
					const response = await axios.post(`/article/get.php?id=${id}`, { token: localStorage.getItem('token') }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});

					if (!response.data.error) {					
						document.title = 'Enkada – ' + response.data.title.replace(/[^-a-zA-Z0-9,'()!?"\s]/g, '').trim();
	
						setArticle(response.data);

						setImageList(response.data.content);

						if (!response.data.content) {
							setIsOriginal(true);
						}
					}
					else {
						console.log(response.data);
						navigate('/');
					}
				}
				else {
					const response = await axios.get(`/article/get.php?id=${id}`);

					if (!response.data.error) {					
						document.title = 'Enkada – ' + response.data.title.replace(/[^-a-zA-Z0-9,'()!?"\s]/g, '').trim();

						setArticle(response.data);

						setImageList(response.data.content);

						if (!response.data.content) {
							setIsOriginal(true);
						}
					}
					else {
						console.log(response.data);
						navigate('/');
					}
				}

			} catch (error) {
				console.error(error);
			}
		};

		axios.get(`/article/get-all.php`).then(response => {
			function getNeighborsById(array, id) {
				const currentIndex = array.findIndex(obj => obj.id === id);

				if (currentIndex === 0) {
					return { prev: array[1] };
				} else if (currentIndex === array.length - 1) {
					return { next: array[currentIndex -1]};
				} else {
					return { next: array[currentIndex - 1], prev: array[currentIndex + 1]};
				}
			}

			setNeighborArticles(getNeighborsById(response.data, id));
		}).catch(error => {
			console.log('Error fetching article data: ', error);
		});

		axios.get(`/tag/get.php`).then(response => {
			setTagData(response.data);
		}).catch(error => {
			console.log('Error fetching tag data: ', error);
		});

		fetchArticle();

		return () => {
			document.title = 'Enkada';
		};
		
	}, [id]);

	if (!article) {
		return <div className="loading">Loading</div>;
	}

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this article?")) {
			try {
				const response = await axios.delete(`/article/delete.php`, {
					data: { id: id, token: localStorage.getItem('token') },
				});
				console.log(response.data);
				navigate('/');
			} catch (error) {
				console.error(error);
			}
		}
	};

	const convertToURL = (articleTitle) => {
		return articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	}

	const headerIdLink = (header) => {
		return header.replace(/[^-а-яА-Яa-zA-Z0-9,'()!?"\s]/g, '').trim().replace(/\s/g, '_');
	}

	const { title, content, date, tags, title_ru, content_ru } = article;

	function extractH2Headers(markdownText) {
		const lines = markdownText.split('\n');
		const h2Headers = [];
		
		for (const line of lines) {
			if (line.trim().startsWith('## ')) {
			// Remove the '##' and any leading/trailing whitespace to get the header text
			const headerText = line.replace(/^##\s*/, '');
			h2Headers.push(headerText);
			}
		}
		
		return h2Headers;
	}

	const headers = isOriginal ? extractH2Headers(content_ru) : extractH2Headers(content);

	return (
		<div className={`article ${isOriginal ? "article--ru" : ""}`}>
			{!!isEditor && <div className="editor-btn-list">
				<button className="btn--editor" onClick={handleDelete}>🗑 Delete Article</button>
				<Link className="btn btn--editor" to={'/editor/' + id}>✏ Edit</Link>
			</div>}
			<div className="article__title">
				<span>{isOriginal ? title_ru : title}</span>
				{!!(title_ru && content_ru) && <div className="btn--emoji" onClick={() => setIsOriginal(!isOriginal)}>🇷🇺</div>}
			</div>
			<div className="article__date">{new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
			<div className="article__tag-list">
				{JSON.parse(tags).map((tag, index) => (
					<React.Fragment key={index}>
						<Link to={"/articles?tag=" + tag} className="tag" >
						{tag}
						{!!tagData.find(x => x.name == tag) && <div data-description={tagData.find(x => x.name == tag).description} className="tag__description">ℹ</div>}
						
						</Link>
						{!!isEditor && <Link to={"/tag/" + tag} className="btn--emoji">✏️</Link>}
					</React.Fragment>
				))}
			</div>
			{!!(headers.length >= 2) && <div className="article__table-of-contents">
				<div className="article__table-of-contents__header">Table of Contents</div>
				{headers.map((header, index) => (
					<a key={index} className="article__table-of-contents__link" href={"#" + headerIdLink(header)}>{header}</a>
				))}
				
			</div>}
			<div className="article__content">
				<ReactMarkdown components={{
					a: (props) => {
						if (props.href.startsWith('/')) {
							return <Link to={props.href}>{props.children}</Link>;
						} else if (!props.href.includes("http")) {
							return <a href={axios.defaults.baseURL + "/files/" + props.href}>{props.children}</a>;
						} else {
							return <a href={props.href}>{props.children}</a>;
						}
					},
					img: (props) => {
						const src = props.src.includes("http") ? props.src : axios.defaults.baseURL + "/files/" + props.src;

						return (
							<img src={src} onClick={() => showViewer(src)} alt={props.alt}/>
						);
					},
					code: (props) => {
						if (props.children[0][0] == "!") {
							return <span className="glitch">{props.children[0].substring(1)}</span>
						}
						else {
							return <code>{props.children[0]}</code>
						}
					},
					h2: (props) => {
						return (
							<h2 id={headerIdLink(props.children[0])}>{props.children}</h2>
						);
					},
				}} remarkPlugins={[remarkGfm]}>{isOriginal ? content_ru : content}</ReactMarkdown>
			</div>
			{<div className="article__neighbors">
				{!!neighborArticles.next && <>
					<div>Next</div>
					<Link to={"/article/" + neighborArticles.next.id + "/" + convertToURL(neighborArticles.next.title)}>{neighborArticles.next.title}</Link>
					<div>{new Date(neighborArticles.next.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
				</>}
				{!!neighborArticles.prev && <>
					<div>Previous</div>
					<Link to={"/article/" + neighborArticles.prev.id + "/" + convertToURL(neighborArticles.prev.title)}>{neighborArticles.prev.title}</Link>
					<div>{new Date(neighborArticles.prev.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
				</>}
			</div>}
			<ImageViewer viewerImageSrc={viewerImageSrc} setViewerImageSrc={setViewerImageSrc} imageList={articleImages} resetViewer={resetViewer}/>
		</div>
	);
}
