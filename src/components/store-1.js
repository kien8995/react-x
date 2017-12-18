import Store from '../common/store';

class CountStore extends Store {
    constructor(state, persistentKey) {
        super(state, persistentKey);
    }
}
const store = new CountStore({count: 0}, "counter-store");

export default store;