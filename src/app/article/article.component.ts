import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ArticleService} from '../shared/services/article.service';
import {Article} from '../shared/models/article.model';
import {HttpParams} from '@angular/common/http';
import {DateService} from '../shared/services/date.service';
import {AuthenticationService} from '../shared/services/authentication.service';
import {StringService} from '../shared/services/string.service';
import {MiscService} from '../shared/services/misc.service';


@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

    public editMode: boolean = false;
    public creationMode: boolean = false;
    public defaultMode: boolean = false;

    public idArticle = null;
    public articleForm: FormGroup;
    public currentArticle: Article = null;

    public textComment: string = '';
    public articleProtected: boolean = false;
    public articleNotExist: boolean = false;
    public selectTagDisplayed: boolean = false;
    public chosenTag: string = '';
    public chosenTags: any[];
    public searchString: string;
    public tagProposal: string = '';
    public tagString: string;

    public foundArticles: Article[] = [];
    public nextPage: string;
    public totalResults: string;
    public waitingArticle;
    public sortResults='';

    public reactionsCount: any = {
        like: 0,
        heart: 0,
        idea: 0
    };

    public myReactions: any = {
        like: {
            state: false,
            id: null
        },
        heart: {
            state: false,
            id: null
        },
        idea: {
            state: false,
            id: null
        },
    };


    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public fb: FormBuilder,
        public article: ArticleService,
        public DS: DateService,
        public auth: AuthenticationService,
        public stringS: StringService,
        public misc:MiscService
    ) {
    }

    ngOnInit(): void {

        this.route.paramMap.subscribe(params => {

            // Routing "interne"

            this.editMode = params.get('action') === 'edit' || params.get('id') === 'new';
            this.idArticle = params.get('id');

            this.defaultMode = false;
            this.articleProtected = false;

            // Download tag peut être "synchone" ou "asynchrone"
            // (suivant si les tags sont déja présents)

            this.article.retrieveTags().then(() => {

                this.creationMode = params.get('id') === 'new';

                if (!this.idArticle || (isNaN(this.idArticle) && !this.creationMode)) {

                    this.defaultMode = true;

                } else {

                    if (this.creationMode) {

                        this.newArticleInitialisation();

                    } else {

                        // Optimisation : Si on ne change pas d'article, on ne le retélécharge pas
                        // On utilise la sauvegarde du service "article"

                        if (this.article.currentArticle && this.article.currentArticle.id == this.idArticle) {

                            this.currentArticle = this.article.currentArticle;
                            this.processInitialisation();

                        } else {

                            this.initializeReactions();
                            this.article.getArticle(this.idArticle).subscribe((article: Article) => {

                                if (article['status'] === 5) {

                                    this.articleNotExist = true;
                                    this.currentArticle = null;

                                } else if (article['status'] === 4) {

                                    this.articleProtected = true;
                                    this.currentArticle = null;

                                } else {

                                    this.currentArticle = article;
                                    this.processInitialisation();

                                }

                            });
                        }
                    }

                }

            });
        });
    }






    //------------------------------------------------------------------------------------
    // Initialisation du component
    //------------------------------------------------------------------------------------


    private newArticleInitialisation() : void {
        this.currentArticle = null;
        this.article.currentArticle = null;
        this.articleForm = this.fb.group({
            name: ['', [Validators.required]],
            content: [''],
            draft: [true],
            selectTag: ['']
        });
    }

    private initForm(article: Article) : void {

        this.articleForm = this.fb.group({
            name: [article.name, [Validators.required]],
            content: [article.content],
            draft: [article.draft],
            selectTag: ['']
        });
    }


    private initializeReactions() : void{
        this.reactionsCount = {
            like: 0,
            heart: 0,
            idea: 0
        };

        this.myReactions = {
            like: {
                state: false,
                id: null
            },
            heart: {
                state: false,
                id: null
            },
            idea: {
                state: false,
                id: null
            },
        };
    }

    private initReactions() : void{
        this.currentArticle.reactions.forEach(reaction => {

            if (reaction.user.id == this.auth.userSession.idUser) {
                this.myReactions[reaction['type']]['state'] = true;
                this.myReactions[reaction['type']]['id'] = reaction.id;
            }

            this.reactionsCount[reaction['type']]++;

        });
    }

    private initTags() : void {
        this.currentArticle.Tag.forEach(tag => {
            this.article.tags.forEach(tag_ => {
                if (tag_['id'] == tag) {
                    tag_['chosen'] = true;
                }
            });
        });
    }


    private processInitialisation() : void {

        this.initTags();
        this.initReactions();

        if (this.editMode) {
            this.initForm(this.currentArticle);
        }
    }







    //------------------------------------------------------------------------------------
    // Actions LECTURE Article
    //------------------------------------------------------------------------------------


    public addComment() : void {

        this.article.addComment(this.textComment).subscribe((comment) => {
            this.currentArticle.comments.push(comment);
            this.textComment = '';
        });
    }


    public toggleReaction(reaction) : void {

        this.myReactions[reaction]['state'] = !this.myReactions[reaction]['state'];
        if (this.myReactions[reaction]['state']) {

            this.reactionsCount[reaction]++;
            this.article.addReaction(reaction).subscribe((reactionFromServer) => {
                this.myReactions[reaction]['id'] = reactionFromServer.id;
            });

        } else {

            this.reactionsCount[reaction]--;
            this.article.removeReaction(this.myReactions[reaction]['id']).subscribe((status) => {
            });

        }

    }






    //------------------------------------------------------------------------------------
    // Action EDITION / CREATION
    //------------------------------------------------------------------------------------

    public editArticle() : void {
        this.router.navigate(['/article', this.idArticle, 'edit']);
    }

    public deleteArticle(id: string) : void {
        this.article.deleteArticle(id).subscribe((status)=> {
            alert("l'article a bien été supprimé ");
            this.router.navigate(['/article']);
        });
    }

    public closeEdit(event) : void {
        this.router.navigate(['/article', this.currentArticle.id]);
    }

    public saveArticle() : void {

        if (this.creationMode) {

            this.article.addArticle(
                this.articleForm.value,
                this.article.tags.filter(t => t['chosen']).map(t => t['id'])
            ).subscribe((article: Article) => {

                if (this.creationMode) {
                    this.router.navigate(['/article', article.id, 'edit']);
                }
            });

        } else {

            this.article.updateArticle(
                this.articleForm.value,
                this.currentArticle.id,
                this.article.tags.filter(t => t['chosen']).map(t => t['id'])
            ).subscribe((article: Article) => {
                this.currentArticle = article;
            });
        }

    }

    // Tags
    //-------------------------------

    public addTag() : void {
        this.selectTagDisplayed = !this.selectTagDisplayed;
    }


    public pickTag() : void {

        let indSelected = this.article.tags.findIndex(tag => tag['id'] == this.chosenTag);
        if (indSelected >= 0) {
            this.article.tags[indSelected]['chosen'] = true;
        }
        this.selectTagDisplayed = false;


    }

    public removeTag(id) : void {
        let indSelected = this.article.tags.findIndex(tag => tag['id'] == id);
        if (indSelected >= 0) {
            this.article.tags[indSelected]['chosen'] = false;
        }
    }









    //-----------------------------------------------------------------------------
    // Action de Recherche
    //-----------------------------------------------------------------------------


    public mainSearch(nextSearch: string = '') : void {

        if (!nextSearch) {
            this.article.nextPage = 1;
        }
        this.article.searchArticles(
            this.searchString,
            this.article.tags.filter(t => t['selectedForSearch']).map(t => t['id'])
        ).subscribe((response) => {

            if (nextSearch) {
                this.foundArticles = this.foundArticles.concat(response.articles);
            } else {
                this.foundArticles = response.articles;
            }
            this.totalResults = response.totalResults;
            this.misc.multiSort(this.foundArticles, {'createdAt':'desc'})
        });

    }





    public checkEnterSearch(event) : void {
        if (event.key === 'Enter') {
            this.mainSearch();
        }
    }


    public goToArticle(id: string) : void {
        this.router.navigate(['/article', id]);
    }




    // Tag Search


    public getTagName(tagApi) {

        return this.article.tags.find(t => {
            return t['@id'] === tagApi;
        }).title;
    }

    public searchTag(event) : void {

        const matchingTag = this.article.tags.filter(tag =>!tag['selectedForSearch']).find(tag=> {
            return tag['title'].startsWith(this.tagString);
        });

        if (matchingTag) {
            this.tagProposal = matchingTag.title;

            if (event.key === 'Enter') {

                let indSelected = this.article.tags.findIndex(tag => tag['id'] == matchingTag.id);
                if (indSelected >= 0) {
                    this.article.tags[indSelected]['selectedForSearch'] = true;
                }
                this.tagString = '';
                this.tagProposal = '';
            }
        } else {
            this.tagProposal='';
        }
    }


    public removeTagSearch(id) {
        let indSelected = this.article.tags.findIndex(tag => tag['id'] == id);
        if (indSelected >= 0) {
            this.article.tags[indSelected]['selectedForSearch'] = false;
        }
    }


    public pickSorter() : void{

        let crit = this.sortResults.split('-')[0];
        let order = this.sortResults.split('-')[1];
        let sortObj = {}
        sortObj[crit] = order;
        this.misc.multiSort(this.foundArticles,sortObj);

    }




    public logout() : void {
        this.article.currentArticle = null;
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('idUser');
        localStorage.removeItem('sessionUsername');
        localStorage.removeItem('role');
        this.auth.isConnected = false;
        this.router.navigate(['/connexion']);
    }


}
