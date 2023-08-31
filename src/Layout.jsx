import { useContext, useEffect } from "react";
import { Link, NavLink, Outlet } from "../node_modules/react-router-dom/dist/index";
import { UserContext } from "./UserContext";

export default function Layout() {
    const { isEditor, setIsEditor } = useContext(UserContext);

    const handleLogout = () => {
        setIsEditor(false);
        localStorage.removeItem('token');
    }

    return (
        <>
            <header>
                <Link to={"/"} className="logo-link">
                    <img className="logo logo--stare" src="/sara_1.png" alt="" />
                    <img className="logo logo--normal" src="/sara_0.png" alt="" />
                </Link>                
                <div className="header-text">
                    <Link to={"/"} className="title">Enkada</Link>
                    <div className="subtitle">Software engineer, Student</div>
                    <div className="link-list">
                        <a href="https://github.com/Enkada" target="_blank" style={{ "--index": 0 }}><img src="https://github.githubassets.com/favicons/favicon-dark.svg" /></a>
                        <a href="mailto:bunneypass@gmail.com" style={{ "--index": 1 }}><img className="grayscale" src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" /></a>
                        <a href="https://t.me/Enkada" target="_blank" style={{ "--index": 2 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="180 180 640 640" version="1.1">
                                <path d="M226.328419,494.722069 C372.088573,431.216685 469.284839,389.350049 517.917216,369.122161 C656.772535,311.36743 685.625481,301.334815 704.431427,301.003532 C708.567621,300.93067 717.815839,301.955743 723.806446,306.816707 C728.864797,310.92121 730.256552,316.46581 730.922551,320.357329 C731.588551,324.248848 732.417879,333.113828 731.758626,340.040666 C724.234007,419.102486 691.675104,610.964674 675.110982,699.515267 C668.10208,736.984342 654.301336,749.547532 640.940618,750.777006 C611.904684,753.448938 589.856115,731.588035 561.733393,713.153237 C517.726886,684.306416 492.866009,666.349181 450.150074,638.200013 C400.78442,605.66878 432.786119,587.789048 460.919462,558.568563 C468.282091,550.921423 596.21508,434.556479 598.691227,424.000355 C599.00091,422.680135 599.288312,417.758981 596.36474,415.160431 C593.441168,412.561881 589.126229,413.450484 586.012448,414.157198 C581.598758,415.158943 511.297793,461.625274 375.109553,553.556189 C355.154858,567.258623 337.080515,573.934908 320.886524,573.585046 C303.033948,573.199351 268.692754,563.490928 243.163606,555.192408 C211.851067,545.013936 186.964484,539.632504 189.131547,522.346309 C190.260287,513.342589 202.659244,504.134509 226.328419,494.722069 Z" id="Path-3" fill="#FFFFFF" />
                            </svg>
                        </a>
                        <a href="https://twitter.com/EnkadaSiceria" target="_blank" style={{ "--index": 3 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="grayscale" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 72 72" xmlSpace="preserve">
                                <path d="M67.812,16.141c-2.348,1.039-4.869,1.743-7.519,2.06c2.703-1.62,4.778-4.187,5.756-7.244c-2.529,1.5-5.33,2.592-8.313,3.176C55.349,11.591,51.948,10,48.182,10c-7.229,0-13.092,5.861-13.092,13.093c0,1.026,0.118,2.021,0.338,2.981C24.543,25.526,14.9,20.317,8.441,12.395c-1.126,1.936-1.771,4.184-1.771,6.581c0,4.542,2.312,8.551,5.824,10.898c-2.146-0.069-4.165-0.657-5.93-1.638c-0.002,0.055-0.002,0.11-0.002,0.162c0,6.345,4.513,11.638,10.504,12.84c-1.101,0.298-2.256,0.457-3.449,0.457c-0.846,0-1.667-0.078-2.465-0.231c1.667,5.2,6.499,8.986,12.23,9.09C18.9,54.066,13.253,56.16,7.122,56.16c-1.055,0-2.096-0.061-3.122-0.184c5.794,3.717,12.676,5.882,20.067,5.882c24.083,0,37.251-19.949,37.251-37.249c0-0.566-0.014-1.134-0.039-1.694C63.838,21.068,66.058,18.765,67.812,16.141z" fill="#1D9BF0" />
                            </svg>
                        </a>
                        <a href="https://steamcommunity.com/id/siceria/" target="_blank" style={{ "--index": 4 }}><img className="grayscale" src="https://steamcommunity.com/favicon.ico" /></a>
                        <a href="https://vk.com/enkada" target="_blank" style={{ "--index": 5 }}>
                            <svg fill="none" viewBox="8 8 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M25.54 34.58c-10.94 0-17.18-7.5-17.44-19.98h5.48c.18 9.16 4.22 13.04 7.42 13.84V14.6h5.16v7.9c3.16-.34 6.48-3.94 7.6-7.9h5.16c-.86 4.88-4.46 8.48-7.02 9.96 2.56 1.2 6.66 4.34 8.22 10.02h-5.68c-1.22-3.8-4.26-6.74-8.28-7.14v7.14z" fill="#FFFFFF"></path></svg>
                        </a>
                    </div>

                </div>
                <nav>
                    <NavLink to={'/'} style={{ "--index": 0 }}>Home</NavLink>
                    <NavLink to={'/articles'} style={{ "--index": 1 }}>Articles</NavLink>
                    <NavLink to={'/gallery'} style={{ "--index": 2 }}>Gallery</NavLink>
                    <NavLink to={'/about'} style={{ "--index": 3 }}>About</NavLink>
                </nav>
            </header>
            <main>
                <Outlet></Outlet>
            </main>
            <footer>
                {/* {!!!isEditor && <Link to={'/login'}>Login</Link>} */}
                {!!isEditor && <a onClick={handleLogout} href="#">Logout</a>}
            </footer>
        </>
    )
}