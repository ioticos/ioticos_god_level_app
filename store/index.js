export const state = () => ({
  auth: null,
  devices: []
});


export const mutations = {
    setAuth(state, auth){
        state.auth = auth;
    }
}


export const actions = {
    readToken() {
        let auth = null;

        try {
            auth = JSON.parse(localStorage.getItem('auth'));
        } catch (error) {
            console.log(err);
        }

        //saving auth in state
        this.commit('setAuth' , auth)
        
    }
}



