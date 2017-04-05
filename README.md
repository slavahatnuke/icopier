# icopier
It gives ability to copy objects and detect if something was changed.
It includes 2 functions 
 - `copy(object, depth = null, options = {})`
 - `isSame(object1, object2, depth = null, options = {})`


### Spec / copy
```javascript
const assert = require('assert');

const {copy} = require('icopier');

describe('iCopier / copy', () => {
    it('copy / example (this object is flat)', () => {
        let user = {
            name: 'slava'
        };

        let clone = copy(user);

        let fields = Object.keys(clone);
        assert.deepEqual(fields, ['name']);
        assert(clone !== user);

        assert.deepEqual(clone, {
            name: 'slava'
        });

        assert.equal(JSON.stringify(clone), '{"name":"slava"}');

        class User {
            constructor(name) {
                this.name = name;
            }
        }

        user = new User('slava');
        clone = copy(user);

        assert(clone instanceof User);
        assert(clone !== user);

        assert.deepEqual(clone, {
            name: 'slava'
        });
    });

    it('copy / deep example (infinity depth)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [1, 2, 5, 8]
        };

        let clone = copy(user);

        let fields = Object.keys(clone);
        assert.deepEqual(fields, ['name', 'settings', 'picked']);

        assert.deepEqual(clone, {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [1, 2, 5, 8]
        });

        assert.equal(JSON.stringify(clone), '{"name":"slava","settings":{"allow_notification":true},"picked":[1,2,5,8]}');

        user.settings.allow_notification = true;
        user.picked.splice(0);

        assert.deepEqual(user, {
            "name": "slava",
            "settings": {"allow_notification": true},
            "picked": []
        });

        assert.deepEqual(clone, {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [1, 2, 5, 8]
        });
    });

    it('copy / deep example (depth=0)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [1, 2, 5, 8]
        };

        let clone = copy(user, 0);

        assert.deepEqual(clone, {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [1, 2, 5, 8]
        });

        user.name = 'name-updated';

        assert.deepEqual(clone, {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [1, 2, 5, 8]
        });

        assert.deepEqual(user, {
            name: 'name-updated',
            settings: {
                allow_notification: true,
            },
            picked: [1, 2, 5, 8]
        });

        user.settings.allow_notification = false;
        user.picked.splice(0);

        assert.deepEqual(user, {
            name: 'name-updated',
            settings: {
                allow_notification: false,
            },
            picked: []
        });

        // it's just cloned the zero (0) level of model but settings and picked still a ref
        assert.deepEqual(clone, {
            name: 'slava',
            settings: {
                allow_notification: false,
            },
            picked: []
        });

    })

    it('copy / deep example (depth=1)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [1, 2, 5, 8]
        };

        let clone = copy(user, 1);
        user.name = 'Slava (updated)';
        user.settings.allow_notification = false;
        user.picked.splice(0);

        assert.deepEqual(user, {
            name: 'Slava (updated)',
            settings: {
                allow_notification: false,
            },
            picked: []
        });

        // it's cloned the 1st level of model but settings and picked still a ref
        assert.deepEqual(clone, {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [1, 2, 5, 8]
        });
    })
});

```

### Spec / isSame
```javascript
const assert = require('assert');

const {copy, isSame} = require('icopier');

describe('iCopier / isSame', () => {

    it('isSame / example', () => {

        assert(isSame('some string', 'some string'));

        let user = {
            name: 'slava'
        };

        let clone = copy(user);
        assert(isSame(user, clone));

        user.name = 'updated';
        assert(!isSame(user, clone));
    });

    it('isSame / example (infinity depth)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user);
        assert(isSame(user, clone));

        user.settings.allow_notification = false;
        assert(!isSame(user, clone));

        user.settings.allow_notification = true;
        assert(isSame(user, clone));
    })

    it('isSame / example (infinity depth strict)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user);
        assert(isSame(user, clone));

        user.settings = {
            allow_notification: true,
        };

        assert(!isSame(user, clone));
        assert(isSame(user, clone, null, {strictOrigin: false}));
    })

    it('isSame / example (depth=0)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user, 0);
        assert(isSame(user, clone, 0));
        user.name = 'updated';

        assert(!isSame(user, clone, 0));
        user.name = 'slava';

        assert(isSame(user, clone, 0));

        user.settings.allow_notification = false;
        assert(isSame(user, clone, 0));
    });

    it('isSame / custom fields', () => {
        let user = {
            name: 'slava'
        };

        let clone = copy(user);
        assert(isSame(user, clone));

        user.customField = 'foo';
        assert(!isSame(user, clone));

        delete user.customField;
        assert(isSame(user, clone));
    });


    it('isSame / example (depth=1)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user, 1);
        assert(isSame(user, clone, 1));

        user.settings.allow_notification = false;
        assert(isSame(user, clone, 0));
        assert(!isSame(user, clone, 1));
        assert(!isSame(user, clone, 20));
        assert(!isSame(user, clone, null));
    })



    it('isSame / example (depth=1-2) array', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user, 2);
        assert(isSame(user, clone, 2));

        user.picked[0].id = 100;
        assert(isSame(user, clone, 0));
        assert(isSame(user, clone, 1));

        assert(!isSame(user, clone, 2));
        assert(!isSame(user, clone, 10));
        assert(!isSame(user, clone, null));
    })
});
```