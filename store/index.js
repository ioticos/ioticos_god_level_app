export const state = () => ({
  auth: null,
  devices: []
});


export const mutations = {
    setAuth(state, auth){
        state.auth = auth;
    }
}



