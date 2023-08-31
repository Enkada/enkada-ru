import React, { useState } from 'react'

export default function TimelinePage() {
	const [articles, setArticles] = useState([]);

	// useEffect(() => {
	// 	const fetchArticles = async () => {
	// 		try {
	// 			const response = await axios.get("/article/get-all.php");
	// 			setArticles(response.data);
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	};

	// 	fetchArticles();
	// }, []);

	const MONTHS = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const EVENTS = {
		"17.02.2003": "👶 Birth",
		"17.02.2004": "🎂 1st Birthday",
		"17.02.2005": "🎂 2nd Birthday",
		"17.02.2006": "🎂 3rd Birthday",
		"17.02.2007": "🎂 4th Birthday",
		"17.02.2008": "🎂 5th Birthday",
		"17.02.2009": "🎂 6th Birthday",
		"17.02.2010": "🎂 7th Birthday",
		"17.02.2011": "🎂 8th Birthday",
		"17.02.2012": "🎂 9th Birthday",
		"17.02.2013": "🎂 10th Birthday",
		"17.02.2014": "🎂 11th Birthday",
		"17.02.2015": "🎂 12th Birthday",
		"17.02.2016": "🎂 13th Birthday",
		"17.02.2017": "🎂 14th Birthday",
		"17.02.2018": "🎂 15th Birthday",
		"17.02.2019": "🎂 16th Birthday",
		"17.02.2020": "🎂 17th Birthday",
		"17.02.2021": "🎂 18th Birthday",
		"17.02.2022": "🎂 19th Birthday",
		"17.02.2023": "🎂 20th Birthday",
		"01.09.2010": "📚 Start of 1st grade",
		"01.09.2011": "📚 Start of 2nd grade",
		"01.09.2012": "📚 Start of 3rd grade",
		"01.09.2013": "📚 Start of 4th grade",
		"01.09.2014": "📚 Start of 5th grade",
		"01.09.2015": "📚 Start of 6th grade",
		"01.09.2016": "📚 Start of 7th grade",
		"01.09.2017": "📚 Start of 8th grade",
		"01.09.2018": "📚 Start of 9th grade",
		"01.09.2019": "🏫 Start of 1st year in college",
		"01.09.2020": "🏫 Start of 2nd year in college",
		"01.09.2021": "🏫 Start of 3rd year in college",
		"01.09.2022": "🏫 Start of 4th year in college",
		"06.01.2014": "👥 Created second VK account",
		"31.06.2012": "🏖️ Summer in Sochi",
		"31.07.2014": "💻 Bought ASUS laptop",
		"30.08.2022": "💿 System SSD smartbuy 120 GB crashed",
		"20.08.2023": "🗿 DotaN died",
		"20.06.2023": "🛡️ Diploma Defense",
		"30.06.2023": "🌧️ Last message to V",
	};

	Object.keys(EVENTS).forEach(date => {
		EVENTS[date] = { name: EVENTS[date], hue: Math.floor(Math.random() * 360)}
	});

	const getTimeline = () => {
		const timelineItems = [];

		for (let y = 2003; y <= 2023; y++) {
			const year = (
				<div key={y} className="year">
					<div className="year__number">{y}</div>
					<div className="year__month-list">
						{Array.from({ length: 12 }, (_, m) => {
							m += 1;
							const monthEvents = Object.keys(EVENTS).filter(eventDate => {
								const [day, month, yearStr] = eventDate.split('.');
								return y === parseInt(yearStr) && m === parseInt(month);
							});

							return (
								<div key={m} className={`month${monthEvents.length === 0 ? ' no-events' : ''}`}>
									<div className="month__name">{MONTHS[m - 1]}</div>
									<div className="month__line"></div>
									{monthEvents.map(eventDate => {										
											const [day, month] = eventDate.split('.').map(Number);
											const date = new Date(y, month - 1, day);
											const diff = new Date(y, month, 1) - new Date(y, month - 1, 1);
											const top = Math.round((date - new Date(y, month - 1, 1)) / diff * 10000) / 100;
											const hue = EVENTS[eventDate].hue;

											return (
												<div className="marker" style={{ top: `${top}%`, '--clr-event': `hsl(${hue}deg, 50%, 50%)` }}></div>
											);
										})}
									<div className="month__event-list">
										{monthEvents.map(eventDate => {
											const [day] = eventDate.split('.').map(Number);
											const hue = EVENTS[eventDate].hue;

											return (
												<div key={eventDate} className="event">
													<div className="event__day" style={{ '--clr-event': `hsl(${hue}deg, 50%, 70%)` }}>
														{day}
													</div>
													<div className="event__text">{EVENTS[eventDate].name}</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			);

			timelineItems.push(year);
		}

		return (<div className="timeline">
		{timelineItems}
	  </div>);
	}

	return (
		<>
			{getTimeline()}
		</>
	)
}
