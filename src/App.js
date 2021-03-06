import React, { useState, useEffect } from 'react';
import { RingLoader } from 'react-spinners';
import { css } from '@emotion/react';
import Dropdown from 'react-dropdown';
import Article from './components/Article/Article';
import Footer from './components/Footer/Footer';
import './App.scss';
import './scss/theme.scss';


const App = () => {
    const initialMobile = window.innerWidth < 768 ? true : false;
    const [mobile, setMobile] = useState(initialMobile);
    const [articles, setArticles] = useState([]);
    const [subreddit, setSubreddit] = useState("pics");
    const [names, setNames] = useState([null, null, null, null, null]);
    const [sort, setSort] = useState("hot");
    const [time, setTime] = useState(null);
    const [page, setPage] = useState(1);
    const [dark, setDark] = useState(false);
    const [loading, setLoading] = useState(true);


    const setNamesHelper = (newName) => {
        let newNames = [...names];
        switch (page) {
            case 1: 
                newNames[1] = newName;
                setNames(newNames);
                break;
            case 2: 
                newNames[2] = newName;
                setNames(newNames);
                break;
            case 3:
                newNames[3] = newName;
                setNames(newNames);
                break;
            default: 
                console.log("ERROR: Invalid directions for page change")
                break;
        }
    } 


    const findAfterParam = () => {
        let after = ""
        switch (page) {
            case 1:
                after = names[0];
                break;
            case 2:
                after = names[1];
                break;
            case 3:
                after = names[2];
                break;
            default: 
                break;
        }
        
        return after;
    }


    const changePage = (action) => {
        if (action === 'NEXT' && page < 6 && articles.length > 99) {
            setPage(page + 1);
        } else if (action === 'PREV' && page > 0) {
            setPage(page - 1);
        } else {
            console.log("ERROR: Invalid directions for page change");
        }
    }


    const sortByTop = (e) => {
        setSort("top");

        let t = null;
        if (e.label === "All Time") {
            t = "all"
        } else {
            t = e.label.toLowerCase();
        }

        setTime(t);
    }


    const setSortHelper = (sortValue) => {
        setPage(0);
        setSort(sortValue);
    }


    const handleResize = () => {
        if (window.innerWidth < 768) {
            setMobile(true);
        } else {
            setMobile(false);
        }
    }


    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);

        let after = findAfterParam();
        let reddit_url = "https://www.reddit.com/r/" + subreddit + "/" + sort + ".json?&limit=100&after=" + after;
        if (sort === "top") {
            reddit_url += "&t=" + time;
        }
        
        fetch(reddit_url).then(res => {
            if (res.status !== 200) {
                console.log("ERROR: Failed to fetch data from Reddit API");
                return;
            }
            res.json().then(data => {
                if (data.data.children.length !== 0) {
                    setArticles(data.data.children);
                    setNamesHelper(data.data.children[data.data.children.length-1].data.name);
                }
                setLoading(false);
            })
        });
    }, [subreddit, page, sort, time]);

    
    const sortOptions = ["All Time", "Year", "Month", "Week"]
    const defaultOption = "Top"
    const themeButton = <button onClick={() => setDark(!dark)}><i className={dark ? "far fa-moon" : "far fa-sun"}></i></button>
    const dummyArticle = <div className="dummy"></div>

    const loaderCSS = css`
        position: absolute;
        left: 0; 
        right: 0; 
        top: 10rem;
        margin-left: auto; 
        margin-right: auto; 
    `
    const loader = <RingLoader loading="true" color="#0090ff" css={loaderCSS} size={140}/>

    window.addEventListener("resize", handleResize);


    return (
        <div className="App">
            <div className={dark ? "header header-dark" : "header header-light"}>
                <div className={dark ? "subreddit subreddit-dark" : "subreddit subreddit-light"}>
                    <i className="fab fa-reddit-alien"></i>
                    <input type="text" value={subreddit} onChange={e => setSubreddit(e.target.value)}></input>
                </div>
                {mobile ? themeButton : null}
                <div className="sort-options">
                    <Dropdown 
                        className={dark ? "option option-dark" : "option option-light"}
                        menuClassName="option-menu"
                        options={sortOptions} 
                        onChange={e => sortByTop(e)} 
                        value={defaultOption} >
                    </Dropdown>
                    <button className={dark ? "option option-dark" : "option option-light"} onClick={e => setSortHelper("hot")}>Hot</button>
                    <button className={dark ? "option option-dark" : "option option-light"} onClick={e => setSortHelper("new")}>New</button>
                </div>
                {mobile ? null : themeButton}
            </div>

            <div className={dark ? "gallery gallery-dark" : "gallery gallery-light"}>
                {(articles != null) ? articles.map((article, index) => <Article key={index} article={article.data} dark={dark} loading={loading}/>) : null}
                {dummyArticle}
                {dummyArticle}
            </div>

            <div className="ree">
                {(articles.length === 0) ? loader : 
                    <div className={dark ? "page page-dark" : "page page-light"}>
                        <div className="buttons">
                            <button onClick={() => changePage('PREV')}><i className="fas fa-angle-left"></i>&nbsp;&nbsp;PREV</button>
                            <div className="vert"></div>
                            <button onClick={() => changePage('NEXT')}>NEXT&nbsp;&nbsp;<i className="fas fa-angle-right"></i></button>
                        </div>
                        <p>Page {page}/3</p>
                    </div>
                }
            </div>

            <Footer theme={dark} />
        </div>
    );
}

export default App;
