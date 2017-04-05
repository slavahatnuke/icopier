const assert = require('assert');

const {copy, isSame} = require('..');

describe('iCopier', () => {
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
});

const show = (clone) => Object.getOwnPropertyNames(clone).map((name) => console.log('>', name, ':', clone[name]));