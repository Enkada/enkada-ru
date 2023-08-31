import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from 'jquery';

export default function VKMusicPage() {
    const [htmlContent, setHtmlContent] = useState('');
    const [music, setMusic] = useState([]);
    
    const [isRequested, setIsRequested] = useState(false);

    useEffect(() => {
        async function fetchMusicFromVKHTML() {
            try {
                const response = await fetch('/vk_music2.html');
                const text = await response.text();
                setHtmlContent(text);
            } catch (error) {
                console.error('Error fetching HTML file:', error);
            }
        }

        async function fetchMusicFromJSON() {
            try {
                const response = await fetch('/vk_music.json');
                const text = await response.json();
                setMusic(text);
            } catch (error) {
                console.error('Error fetching HTML file:', error);
            }
        }

        const isHtmlMode = false;
        if (isHtmlMode) {
            fetchMusicFromVKHTML();
        }
        else {
            fetchMusicFromJSON();
        }
    }, []);

    useEffect(() => {
        const html = $(htmlContent);

        const rows = html.find('.audio_row');

        let musicData = [];

        rows.each(function (index, element) {
            let json = JSON.parse($(this).attr('data-audio'));
            let cover = $(this).find('.audio_row__cover').attr('src');

            let isRussian = /[а-яА-Я]/.test(json[3]) || /[а-яА-Я]/.test(json[4]) || /[а-яА-Я]/.test(json[16]);
            let isClaimed = $(this).hasClass('audio_claimed');

            let title = json[3];

            const match = title.match(/ \((.*?)\)$/);

            if (match && json[16] == "") {
                title = title.replace(match[0], '');
                json[16] = match[1];
            }
            else {

            }

            let data = {
                title: title, author: json[4],
                duration: json[5],
            };

            if (isRussian)
                data.isRussian = isRussian;

            if (isClaimed)
                data.isClaimed = isClaimed;

            if (cover)
                data.cover = cover;

            if (json[16] != "")
                data.subtitle = json[16];

            musicData.push(data);
            console.log(json);

        });

        console.log(musicData);
        setMusic(musicData);
    }, [htmlContent]);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMinutes = minutes.toString();
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds.toString();

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // return authorsString.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    //         .split(/[,;&]|feat\.\s|\sX\s/)

    function parseAuthors(authorsString) {

        return authorsString
            .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
            .replace(/&amp;/g, "&")
            .split(/[,;&]|feat\.\s|\sX\s|\sx\s|ft\.\s/)
            .map(author => author.trim().replace(/[^a-zA-Zа-яА-Я0-9,.\s-\!:]/g, ''))
            .filter(author => author.length > 2);
    }

    function organizeSongsByArtist(songs) {
        const artistMap = {};

        songs.forEach(song => {
            const mainAuthors = parseAuthors(song.author);

            mainAuthors.forEach(author => {
                const lowercaseAuthor = author.toLowerCase();
                artistMap[lowercaseAuthor] = artistMap[lowercaseAuthor] || [];
                artistMap[lowercaseAuthor].push(song);
            });
        });

        songs.forEach(song => {
            Object.keys(artistMap).forEach(author => {
                const wordBoundaryRegex = new RegExp(`\b${author}\b`, 'i');

                if (
                    (song.title && song.title.match(wordBoundaryRegex)) ||
                    (song.subtitle && song.subtitle.match(wordBoundaryRegex))
                ) {
                    artistMap[author.toLowerCase()].push(song);
                }
            });
        });

        return artistMap;
    }

    // if (!isRequested) {
    //     return (
    //         <button onClick={() => setIsRequested(true)}>REuest</button>
    //     );
    // }

    //console.clear();
    //console.log(music);

    //const artists = ;
    //const artists = Object.fromEntries(Object.entries(organizeSongsByArtist(music || [])).sort((a, b) => b[1].length - a[1].length));
    //console.log(artists);

    return (
        <>
            {/* <div className="section" style={{ "--index": 0 }}>
                <div className="section__header">VK Music Authors</div>
                <div className="section__content author-list">
                    {Object.keys(artists).map((artist, index) => (
                        <div key={index} className={`author`}>
                            <div className="author__name">{artist} {artists[artist].length}</div>
                            <div className="author__song-list music">
                                {artists[artist].map((audio, index) => (
                                    <div key={index} className={`audio ${audio.isRussian ? 'ru-text' : ''} ${audio.isClaimed ? 'claimed' : ''}`}>
                                        {audio.cover ? <img src={audio.cover} className="audio__cover" /> : <div className='audio__cover audio__cover--empty'>♪</div>}
                                        <div className="audio__title" dangerouslySetInnerHTML={{ __html: audio.title + (audio.subtitle ? ` <span class='audio__subtitle'>${audio.subtitle}</span>` : '') }}></div>
                                        <div className="audio__author" dangerouslySetInnerHTML={{ __html: audio.author }}></div>
                                        <div className="audio__duration">{formatTime(audio.duration)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
            <div className="section" style={{ "--index": 1 }}>
                <div className="section__header">VK Music</div>
                <div className="section__content music">
                    {music.map((audio, index) => (
                        <div key={index} className={`audio ${audio.isRussian ? 'ru-text' : ''} ${audio.isClaimed ? 'claimed' : ''}`}>
                            {audio.cover ? <img src={audio.cover} className="audio__cover" /> : <div className='audio__cover audio__cover--empty'>♪</div>}
                            <div className="audio__title" dangerouslySetInnerHTML={{ __html: audio.title + (audio.subtitle ? ` <span class='audio__subtitle'>${audio.subtitle}</span>` : '') }}></div>
                            <div className="audio__author" dangerouslySetInnerHTML={{ __html: audio.author }}></div>
                            <div className="audio__duration">{formatTime(audio.duration)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}