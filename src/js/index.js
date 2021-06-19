require("@babel/polyfill");
import Search from './model/Search';

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
    const query = 'pizza';
    if (query){
    // shineer hailtiin objectiig uusgene.
    state.search = new Search(query);

    // hailt hiihed zoriulj interfaceiig beltgene.
    
    // hailtiig guitsetgene
    await state.search.doSearch();
    // hailtiin ur dung delgetsend uzuulne
    console.log(state.search.result);
    }
    
};

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})