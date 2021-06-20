require("@babel/polyfill");
import Search from './model/Search';
import { elements, renderLoader, clearLoader } from './view/base';
import * as searchView from './view/searchView';
import Recipe from './model/Recipe'


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

const r = new Recipe(47746)
r.getRecipe();