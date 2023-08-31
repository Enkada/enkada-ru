import { Route, Routes } from '../node_modules/react-router-dom/dist/index'
import Error404Page from './Error404Page'
import Layout from './Layout'
import AboutPage from './pages/AboutPage'
import ArticleListPage from './pages/ArticleListPage'
import ArticlePage from './pages/ArticlePage'
import GalleryPage from './pages/GalleryPage'
import ImageEditorPage from './pages/ImageEditorPage'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import PostEditorPage from './pages/PostEditorPage'
import ProjectsPage from './pages/ProjectsPage'
import { SequenceGamePage } from './pages/SequenceGamePage'
import TagEditorPage from './pages/TagEditorPage'
import TimelinePage from './pages/TimelinePage'
import { TimetablePage } from './pages/TimetablePage'
import VKMusicPage from './pages/VKMusicPage'
import { UserContextProvider } from './UserContext'

function App() {

  return (
	<UserContextProvider>
		<Routes>
			<Route path="/" element={<Layout/>}>
				<Route path="/" element={<MainPage/>}/>
				<Route path="/login" element={<LoginPage/>}/>
				<Route path="/editor" element={<PostEditorPage/>}/>
				<Route path="/editor/:id" element={<PostEditorPage/>}/>
				<Route path="/tag/:name" element={<TagEditorPage/>}/>
				<Route path="/image" element={<ImageEditorPage/>}/>
				<Route path="/articles" element={<ArticleListPage/>}/>
				<Route path="/projects" element={<ProjectsPage/>}/>
				<Route path="/gallery" element={<GalleryPage/>}/>
				<Route path="/about" element={<AboutPage/>}/>
				<Route path="/music" element={<VKMusicPage/>}/>
				<Route path="/timeline" element={<TimelinePage/>}/>	
				<Route path="/timetable" element={<TimetablePage/>}/>				
				<Route path="/sequence" element={<SequenceGamePage/>}/>
				<Route path="/article/:id" element={<ArticlePage/>}/>
				<Route path="/article/:id/:title" element={<ArticlePage/>}/>
				<Route path="*" element={<Error404Page/>}/>
			</Route>
		</Routes>
	</UserContextProvider>
	
  )
}

export default App
