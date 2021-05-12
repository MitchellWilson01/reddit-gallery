import React from 'react';
import { RingLoader } from 'react-spinners';
import { css } from '@emotion/react';
import './Article.scss';
import '../../scss/theme.scss';

const Article = (props) => {
    const loaderCSS = css`
        position: absolute;
        left: 0; 
        right: 0; 
        top: 0;
        bottom: 0;
        margin-left: auto; 
        margin-right: auto; 
        margin-top: auto; 
        margin-bottom: auto; 
    `
    const loader = <RingLoader loading="true" color="#0090ff" css={loaderCSS} size={70}/>
    const image = <img src={props.article.url_overridden_by_dest} alt={props.article.title}></img>

    if (!props.loading || props.loading) {
        return (
            <article className={props.dark ? "article article-dark" : "article article-light"}>
                    <p>
                        <i className="fas fa-hand-point-up"></i> {props.article.score}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i className="fas fa-comment"></i> {props.article.num_comments}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i className="fas fa-user"></i> u/{props.article.author}
                    </p>
                    <h4>{props.article.title}</h4>
                    {props.loading ? loader : image}
                    
                    <a href={"https://reddit.com" + props.article.permalink} target="_blank" rel="noreferrer">
                        <i className="fas fa-link"></i>
                    </a>
            </article>
        );
    } else {
        return (
            <article className={props.dark ? "article article-dark" : "article article-light"}>
                    <RingLoader loading="true" color="#0090ff" css={loaderCSS} size={70}/>
            </article>
        );
    }
}

export default Article;