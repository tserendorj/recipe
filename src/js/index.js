require("@babel/polyfill");
import Search from './model/Search';
import { elements, renderLoader, clearLoader } from './view/base';
import * as searchView from './view/searchView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import Recipe from './model/Recipe';
import List from './model/List';
import Like from './model/Like';
import {renderRecipe, clearRecipe, highlightSelectedRecipe} from './view/recipeView';
import { startCase } from 'lodash';

/* 
    Web app tulu
    hailtiin query, result
    tuhain uzuulj baiga jor
    likelsan joruud
    zahialj baigaa joriin nairlaganuud
*/

const state = {};


const controlSearch = async () => {
    // webes hailtiin tulhuur ugiig gargaj awna.
    const query = searchView.getInput();

    if (query){
    // shineer hailtiin objectiig uusgene.
    state.search = new Search(query);

    // hailt hiihed zoriulj interfaceiig beltgene.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);
    // hailtiig guitsetgene
    await state.search.doSearch();
    // hailtiin ur dung delgetsend uzuulne
    clearLoader();
    if(state.search.result === undefined) alert("ilertsgui");
    else searchView.renderRecipes(state.search.result)
    }
    
};

elements.searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    controlSearch();
});

elements.pagetButtons.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-inline');

    if(btn) {
        const gotoPageNumber = parseInt(btn.dataset.goto);
        searchView.clearSearchResult();
        searchView.renderRecipes(state.search.result, gotoPageNumber);
    }
});

// Joriin controller
const controlRecipe = async function() {
    // URL aas ID-g salgana
    const id = window.location.hash.replace('#',"");

    
    // Joriin modeliig uusgej ugnu
    if(id){

        state.recipe = new Recipe(id);

        // UI display beldene
        clearRecipe();
        renderLoader(elements.recipeDiv);
        highlightSelectedRecipe(id);
    
        // Joroo tataj awchirna
        await state.recipe.getRecipe();
    
        // Joriig guitsetgeh hugatsaabolon ortsiig tootsoolno
        clearLoader();
        state.recipe.calcTime();
        state.recipe.calcHuniiToo();
    
        // Joroo uzuulne
        renderRecipe(state.recipe, state.likes.isLiked(id));
    }
}


window.addEventListener('hashchange', controlRecipe)

window.addEventListener('load', controlRecipe)

window.addEventListener('load', function(){
    if (!state.likes) state.likes = new Like();

    // like menu
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

    // likeuud baiwal tsened haruulna
    state.likes.likes.forEach(function(like){
        likesView.renderLike(like);
    })

})



// ['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

// Nairlaganii controller
const controlList = function() {
    // nairlaganii modeliig uusgene
    state.list = new List();
    // Umnu ni haragdaj baisan modeluudiig arilgana
    listView.clearItems();

    // Ug model ruu odoo baiga jorigi hiine
    state.recipe.ingredients.forEach(function(n){
        // tuhain nairlagiig modelruu hiine
        const item = state.list.addItem(n);
        // tuhain nairlagiig delgetsend gargana
        listView.renderItem(item);
    });


    // state.recipe.ingredients
};

// like controller
const controlLike = function(){
    // likeiin modeliig uusgeh
    if (!state.likes) state.likes = new Like();
    // odoo haragdaj baiga joriin id g olj awah
    const currentRecipeId = state.recipe.id;
    // ene joriig likelasan esehiig shalgah
    if (state.likes.isLiked(currentRecipeId)){
        state.likes.deleteLike(currentRecipeId);
        // view-s ustgah
        likesView.deleteLike(currentRecipeId);
        likesView.toggleLikeBtn(false);

    } else {
        const newLike = state.likes.addLike(currentRecipeId, 
            state.recipe.title, 
            state.recipe.publisher, 
            state.image_url);
            
        likesView.renderLike(newLike);
        likesView.toggleLikeBtn(true);
    }

    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

};

elements.recipeDiv.addEventListener('click', function(e){
    if(e.target.matches('.recipe__btn, .recipe__btn *')){
        controlList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});

elements.shoppingList.addEventListener('click', function(e){
    // click hiisen li elementiin data-itemidiig shuuj awah
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // oldson ID-tei ortsiig modeloos ustgana
    state.list.deleteItem(id);
    
    // delgetsees ustgana
    listView.deletItem(id);

});