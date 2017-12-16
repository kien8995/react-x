import Store from '../common/store';

class CountStore extends Store {
    constructor(state) {
        super(state);
    }
}
const store = new CountStore({count: 0});

export default store;