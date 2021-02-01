import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Article} from '../models/article.model';
import {Comment} from '../models/comment.model';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    public currentArticle: Article;
    public isBusy: boolean = false;
    public tags: any = null;

    constructor(
        public http: HttpClient) {
    }



    //--------------------------------------------------------------------------
    // Commun
    //--------------------------------------------------------------------------

    public retrieveTags() : Promise<any> {

        return new Promise((resolve, reject)=> {

            if (!this.tags) {

                this.http.get<any>('/api/article/getTags').subscribe((tags:any) => {

                    this.tags = tags.map(tag => {
                        tag.chosen = false;
                        tag.selectedForSearch = false;
                        return tag;
                    });
                    resolve(this.tags);
                })

            } else {

                this.tags = this.tags.map(tag => {
                    tag.chosen = false;
                    tag.selectedForSearch = false;
                    return tag;
                });
                resolve(this.tags);
            }

        });
    }


    //--------------------------------------------------------------------------
    // Edition / Creation
    //--------------------------------------------------------------------------

    public addArticle(
        formData: { name: string, content: string, draft: string },
        tags: any[]

    ) : Observable<Article> {

        let infosArticle = {
            name: formData.name,
            content: formData.content,
            draft: formData.draft,
            tags: tags
        };

        return this.http.post<Article>('/api/article/addArticle', infosArticle).pipe(
            tap((article: Article) => {
                this.currentArticle = article;
            })
        );
    }


    public updateArticle(

        formData: { name: string, content: string, draft: string},
        id: string,
        tags: any[]

    ): Observable<Article> {

        let infosArticle = {
            id: id,
            name: formData.name,
            content: formData.content,
            draft: formData.draft,
            tags: tags
        };

        return this.http.post<Article>('/api/article/updateArticle', infosArticle).pipe(
            tap((article: Article) => {

                this.currentArticle = article;
            })
        );
    }

    public deleteArticle(id): Observable<string> {

        return this.http.post<string>('/api/article/deleteArticle', {id:id});
    }







    //--------------------------------------------------------------------------
    // Lecture Article
    //--------------------------------------------------------------------------

    public addComment(textComment: string): Observable<Comment> {

        const infosComment = {
            text: textComment,
            idArticle: this.currentArticle.id
        }

        return this.http.post<Comment>('/api/article/addComment', infosComment);
    }


    public getArticle(id: string): Observable<Article> {

            return this.http.get<Article>('/api/article/getArticle?idArticle=' + id).pipe(
                tap((article: Article)=> {
                    this.currentArticle = article;
                })
            )
    }


    public removeReaction(id:string): Observable<string> {

        return this.http.post<string>('/api/article/removeReaction', {id:id});
    }

    public addReaction(reaction: any): Observable<any> {

        const infosReaction = {
            type: reaction,
            idArticle: this.currentArticle.id
        };

        return this.http.post<any>('/api/article/addReaction', infosReaction);

    }










    //--------------------------------------------------------------------------
    // Recherche
    //--------------------------------------------------------------------------

    public searchArticles(query: string, searchedTags: any[]): Observable<Article[]> {

        const infoSearch = {
            query: query,
            searchedTags: searchedTags
        }

        return this.http.post<Article[]>('/api/article/searchArticles', infoSearch);
    }






}


